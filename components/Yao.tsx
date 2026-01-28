// BaguaYao.jsx
const BaguaYao = ({ yin }: {yin?: boolean}) => {
  if (!yin) {
    return <div className="w-full h-2 bg-[#6d4c41] my-1"></div>;
  }

  return (
    <div className="w-full h-2 my-1 flex justify-between">
      <div className="w-1/3 h-2 bg-[#6d4c41]"></div>
      <div className="w-1/3 h-2 bg-[#6d4c41]"></div>
    </div>
  );
};

export default BaguaYao;
