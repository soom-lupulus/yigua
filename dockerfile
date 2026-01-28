# 1. 基础设定：使用 Node 24 版本的轻量级镜像
FROM node:24-alpine AS base

# 2. 依赖阶段：安装项目所需依赖
FROM base AS deps
# 针对某些依赖（如 Prisma 或 Sharp）可能需要的构建工具，alpine 必须装这个
RUN apk add --no-cache libc6-compat
WORKDIR /app

# 启用 pnpm (因为你本地用 pnpm)
RUN corepack enable && corepack prepare pnpm@latest --activate

# 拷贝依赖定义文件
COPY package.json pnpm-lock.yaml* ./
# 【关键】拷贝 prisma 架构文件，以便在安装依赖后生成 Client
COPY prisma ./prisma/

# 安装依赖 (使用 --frozen-lockfile 确保版本锁定)
RUN pnpm i --frozen-lockfile

# 【关键】生成 Prisma Client
# 这一步必须在 deps 或 builder 阶段完成，否则运行时找不到数据库驱动
RUN npx prisma generate


# 3. 构建阶段：编译 Next.js 源码
FROM base AS builder
WORKDIR /app
# 从上个阶段拷贝 node_modules 和 prisma client
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# 禁用 Next.js 的匿名数据收集
ENV NEXT_TELEMETRY_DISABLED=1

# 执行构建
RUN corepack enable && corepack prepare pnpm@latest --activate && pnpm run build


# 4. 运行阶段：最终生成的轻量镜像
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# 出于安全考虑，不使用 root 用户运行
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# 拷贝公共资源
COPY --from=builder /app/public ./public

# 设置权限并拷贝 standalone 构建产物
# .next/standalone 是 Next.js 自动提取出的最小运行环境
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
# 【可选】如果运行时需要 prisma（如进行 migrate），取消下面一行的注释
# COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma

USER nextjs

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# 启动程序
CMD ["node", "server.js"]