import Image from "next/image";
import { useContext } from "react";
import FontSizeContext from "@/components/utils/FontSizeContext";
import ReducedMotionContext from "@/components/utils/ReducedMotionContext";
import { useSortable } from "@dnd-kit/sortable";
import { useUniqueId } from "@dnd-kit/utilities";

const ToolboxCard = ({title, type, desc, icon}) => {
  const fontSizeMultiplier = useContext(FontSizeContext) / 100; 
  const isReduceMotion = useContext(ReducedMotionContext);
  const {attributes, isDragging, listeners, setNodeRef} = useSortable({
    id: useUniqueId(),
    data: {title, type, desc, icon, cont: "toolbox"}
  });

  return (
    <button 
      aria-label={`Drag-and-droppable card for ${title}`}
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      className={`flex flex-auto p-2 items-center rounded-lg cursor-move ${isDragging ? "opacity-0" : ""} ${isReduceMotion ? "" : "transition-colors"}`}
    >
      <Image
        src={icon}
        alt={`${title} icon`}
        width={20 * fontSizeMultiplier}
        height={"auto"}
        className="mt-1 mx-1 self-start pointer-events-none dark:d-white-filter"
      />
      <div className="flex flex-auto flex-col items-start mx-4">
        <h2 className="text-lg text-left font-bold custom-text dark:d-text select-none">{title}</h2>
        <p className="text-sm text-left custom-text-shade dark:d-text-shade select-none">{desc}</p>
      </div>
    </button>
  )
}

export default ToolboxCard;