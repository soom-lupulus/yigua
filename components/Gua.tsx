import Yao from "./Yao";
import { pinyin } from "pinyin-pro";
import * as Tooltip from "@radix-ui/react-tooltip";
import isChinese from 'is-chinese'
const SLTooltip = ({ children }: { children: string }) => (
  <Tooltip.Provider>
    <Tooltip.Root>
      <Tooltip.Trigger>
        <p className="text-left">{children}</p>
      </Tooltip.Trigger>
      <Tooltip.Portal>
        <Tooltip.Content className="bg-gray-100">
          <Tooltip.Arrow />
          {children.split("").map((char, index) =>
            // 中文且前三个字符不标拼音
            isChinese(char) && index > 2 ? (
              <ruby key={index}>
                {char}
                <rt>{pinyin(char)}</rt>
              </ruby>
            ) : (
              <span key={index}>{char}</span>
            )
          )}
        </Tooltip.Content>
      </Tooltip.Portal>
    </Tooltip.Root>
  </Tooltip.Provider>
);
interface IGua {
  trigram_name: string;
  yaoStr: string;
  yao_content_1: string;
  yao_content_2: string;
  yao_content_3: string;
  yao_content_4: string;
  yao_content_5: string;
  yao_content_6: string;
}
const Gua = ({
  trigram_name,
  yaoStr,
  yao_content_1,
  yao_content_2,
  yao_content_3,
  yao_content_4,
  yao_content_5,
  yao_content_6,
}: IGua) => {
  return (
    <div className="h-full overflow-hidden grid grid-cols-[50px_1fr] gap-2">
      <div>
        <p className="text-xs font-bold ">{trigram_name}</p>
        <div>
          {yaoStr
            .split("")
            .map((i, index) =>
              Number(i) ? <Yao key={index} /> : <Yao yin key={index} />
            )}
        </div>
      </div>
      <div className="flex-col justify-end h-full text-[.55rem] leading-[1.1] text-[#3a3a3a]">
        <SLTooltip>{yao_content_6}</SLTooltip>
        <SLTooltip>{yao_content_5}</SLTooltip>
        <SLTooltip>{yao_content_4}</SLTooltip>
        <SLTooltip>{yao_content_3}</SLTooltip>
        <SLTooltip>{yao_content_2}</SLTooltip>
        <SLTooltip>{yao_content_1}</SLTooltip>
      </div>
    </div>
  );
};

export default Gua;
