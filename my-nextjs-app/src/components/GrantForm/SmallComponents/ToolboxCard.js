import Image from "next/image";
import { useContext } from "react";
import FontSizeContext from "@/components/utils/FontSizeContext";
import ReducedMotionContext from "@/components/utils/ReducedMotionContext";
import { useSortable } from "@dnd-kit/sortable";
import { useUniqueId } from "@dnd-kit/utilities";
import { useDraggable } from "@dnd-kit/core";

const ToolboxCard = ({title, type, desc, icon}) => {
  const fontSizeMultiplier = useContext(FontSizeContext) / 100; 
  const isReduceMotion = useContext(ReducedMotionContext);
  const {attributes, isDragging, listeners, setNodeRef} = useSortable({
    id: useUniqueId(),
    data: {title, type, desc, icon, cont: "toolbox"}
  });

  return (
    <div 
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      className={`flex flex-auto p-2 items-center rounded-lg hover:custom-hover-white dark:hover:d-custom-hover-black cursor-move ${isDragging ? "opacity-0" : ""} ${isReduceMotion ? "" : "transition-colors"}`}
    >
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
  )
}

export default ToolboxCard;