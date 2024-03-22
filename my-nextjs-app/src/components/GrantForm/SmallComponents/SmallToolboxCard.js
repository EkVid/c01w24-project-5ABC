import Image from "next/image";
import { useContext } from "react";
import FontSizeContext from "@/components/utils/FontSizeContext";

const SmallToolboxCard = ({title, icon}) => {
  const fontSizeMultiplier = useContext(FontSizeContext) / 100; 

  return (
    <div 
      className={`flex flex-col w-24 p-1.5 justify-between items-center flex-auto rounded-lg`}
    >
      <div className="flex flex-auto justify-center items-center">
        <h2 className="text-md text-center font-bold whitespace-pre-wrap custom-text dark:d-text select-none">{title}</h2>
      </div>
      <Image
        src={icon}
        alt={`Question icon for ${title}`}
        width={20 * fontSizeMultiplier}
        height={"auto"}
        className="pointer-events-none dark:d-white-filter m-2"
      />
    </div>
  )
}

export default SmallToolboxCard;