import Image from "next/image";
import PlusIcon from "@/../public/plus.svg";
import { useContext } from "react";
import FontSizeContext from "@/components/utils/FontSizeContext";
import ReducedMotionContext from "@/components/utils/ReducedMotionContext";

const ToolboxCard = ({title, desc, icon, onClickAdd}) => {
  const fontSizeMultiplier = useContext(FontSizeContext) / 100; 
  const isReduceMotion = useContext(ReducedMotionContext);

  return (
    <div className="flex my-2">
      <div className={`flex flex-auto p-2 items-center rounded-lg hover:custom-hover-white dark:hover:d-custom-hover-black cursor-grab active:cursor-grabbing ${isReduceMotion ? "" : "transition-colors"}`}>
        <Image
          src={icon}
          alt="Question icon"
          width={20 * fontSizeMultiplier}
          height={"auto"}
          className="mt-1 mx-1 self-start pointer-events-none dark:d-white-filter"
        />
        <div className="flex flex-col mx-4">
          <div className="text-lg font-bold custom-text dark:d-text select-none">{title}</div>
          <div className="text-sm custom-text-shade dark:d-text-shade select-none">{desc}</div>
        </div>
      </div>
      <button 
        onClick={onClickAdd}
        className={`shrink-0 ml-2 p-2 rounded-md custom-interactive-btn ${isReduceMotion ? "" : "transition-colors"}`}
      >
        <Image
          src={PlusIcon}
          alt="Add question"
          width={25 * fontSizeMultiplier}
          height={"auto"}
          className="dark:d-white-filter pointer-events-none"
        />
      </button>
    </div>
  )
}

export default ToolboxCard;