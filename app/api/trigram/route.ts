
import { NextResponse } from "next/server"

import { prisma } from "@/lib/prisma"


export async function GET(request: Request) {
  const searchParams = new URL(request.url).searchParams
  // const pageIndex = Number(searchParams.get("pageIndex") || 0)
  // const pageSize = Number(searchParams.get("pageSize") || 10)
  // 计算跳过的记录数 (offset) 分页0-based
  const total = await prisma.trigram.count()
  const data = await prisma.trigram.findMany()
  // const data = await prisma.cases.findMany({
  //   skip,
  //   take: pageSize,
  //   // 添加 orderBy 实现倒序排列
  //   orderBy: {
  //     id: "desc", // 按 id 字段倒序排列，也可以按其他字段排序
  //   },
  // })
  return NextResponse.json({
    code: 200,
    msg: "",
    data: {
      total,
      result: data,
    },
  })
}

