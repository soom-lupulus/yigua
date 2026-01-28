"use client";
import Gua from "@/components/Gua";
import { useEffect, useState } from "react";

export default function Home() {
  const [trigramList, setTrigramList] = useState([]);
  useEffect(() => {
    fetch("/api/trigram", {
      method: "GET",
    })
      .then((response) => response.json())
      .then(({ data }) => {
        console.log(data);
        const sortedDataBySquare = data.result.sort((a, b) => a.position_square - b.position_square)
        setTrigramList(sortedDataBySquare || []);
      });
  }, []);
  return (
    <div className="grid gap-2 grid-cols-8 grid-rows-8 h-screen p-1">
      {trigramList.map((trigram) => (
        <Gua
          key={trigram.trigram_num}
          trigram_name={trigram.trigram}
          yaoStr={trigram.yao_yy}
          yao_content_1={trigram.yao_content_1}
          yao_content_2={trigram.yao_content_2}
          yao_content_3={trigram.yao_content_3}
          yao_content_4={trigram.yao_content_4}
          yao_content_5={trigram.yao_content_5}
          yao_content_6={trigram.yao_content_6}
        />
      ))}
    </div>
  );
}
