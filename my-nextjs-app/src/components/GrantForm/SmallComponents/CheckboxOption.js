import FontSizeContext from "@/components/utils/FontSizeContext";
import ReducedMotionContext from "@/components/utils/ReducedMotionContext";
import { useContext } from "react";
import { v4 as uuidv4 } from 'uuid';

const CheckboxOption = ({label, currentValue, onClick}) => {
  const fontSizeMultiplier = useContext(FontSizeContext) / 100;
  const isReduceMotion = useContext(ReducedMotionContext);
  const checkboxStyle = {
    transform: `scale(${fontSizeMultiplier * 1.25})`
  }

  const value = currentValue == true;
  const formId = uuidv4();

  return (
<<<<<<< HEAD
    <div className="flex items-center px-2 py-1">
      <label htmlFor={formId} className={`mr-4 custom-text dark:d-text text-left text-sm`}>{label}</label>
=======
    <button 
      onClick={onClick}
      className={`flex w-fit rounded-md pl-1 py-1 custom-interactive-btn ${isReduceMotion ? "" : "transition-colors"}`}
    >
>>>>>>> 7198180 (more styling refacotring)
      <input 
        type="checkbox"
        id={formId}
        checked={value}
        style={checkboxStyle}
        onChange={onClick}
        className={`flex w-fit rounded-md custom-interactive-btn custom-accent ring-4 ring-transparent hover:ring-opacity-40 hover:ring-gray-400 active:ring-opacity-60 ${isReduceMotion ? "" : "transition"}`}
      />
<<<<<<< HEAD
    </div>
=======
      <label htmlFor="isRequired" className={`ml-3 custom-text text-left text-sm dark:d-text pointer-events-none z-40`}>{label}</label>
    </button>
>>>>>>> 7198180 (more styling refacotring)
  )
}

export default CheckboxOption;