import Image from "next/image";
import { useContext } from "react";
import FontSizeContext from "@/components/utils/FontSizeContext";
import ReducedMotionContext from "@/components/utils/ReducedMotionContext";
import { useSortable } from "@dnd-kit/sortable";
<<<<<<< HEAD
<<<<<<< HEAD
import { useUniqueId } from "@dnd-kit/utilities";
<<<<<<< HEAD
=======
>>>>>>> 06ce668 (fixed dnd issue without major change to root layout)
=======
import { useUniqueId } from "@dnd-kit/utilities";
>>>>>>> 972d39f (moved routers and removed warnings in inspect console)
=======
import { useDraggable } from "@dnd-kit/core";
>>>>>>> a2fc5c6 (dnd works)

const ToolboxCard = ({title, type, desc, icon}) => {
  const fontSizeMultiplier = useContext(FontSizeContext) / 100; 
  const isReduceMotion = useContext(ReducedMotionContext);
  const {attributes, isDragging, listeners, setNodeRef} = useSortable({
<<<<<<< HEAD
<<<<<<< HEAD
    id: useUniqueId(),
    data: {title, type, desc, icon, cont: "toolbox"}
<<<<<<< HEAD
  });

  return (
    <button 
=======
    id: title,
=======
    id: useUniqueId(),
>>>>>>> 972d39f (moved routers and removed warnings in inspect console)
    data: {title, type, desc, icon}
=======
>>>>>>> a2fc5c6 (dnd works)
  });

  return (
    <div 
>>>>>>> 06ce668 (fixed dnd issue without major change to root layout)
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
<<<<<<< HEAD
      <div className="flex flex-col items-start mx-4">
        <div className="text-lg text-left font-bold custom-text dark:d-text select-none">{title}</div>
        <div className="text-sm text-left custom-text-shade dark:d-text-shade select-none">{desc}</div>
      </div>
    </button>
=======
      <div className="flex flex-col mx-4">
        <div className="text-lg font-bold custom-text dark:d-text select-none">{title}</div>
        <div className="text-sm custom-text-shade dark:d-text-shade select-none">{desc}</div>
      </div>
      
    </div>
>>>>>>> 06ce668 (fixed dnd issue without major change to root layout)
  )
}

export default ToolboxCard;