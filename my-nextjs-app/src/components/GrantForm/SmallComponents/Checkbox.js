import FontSizeContext from "@/components/utils/FontSizeContext";
import ReducedMotionContext from "@/components/utils/ReducedMotionContext";
import { useContext } from "react";

const Checkbox = ({label, currentValue, onClick}) => {
  const fontSizeMultiplier = useContext(FontSizeContext) / 100;
  const isReduceMotion = useContext(ReducedMotionContext);
  const checkboxStyle = {
    transform: `scale(${fontSizeMultiplier * 1.2})`
  }


  return (
    <button 
      onClick={onClick}
      className={`flex items-center w-fit rounded-md p-1 custom-interactive-btn ${isReduceMotion ? "" : "transition-colors"}`}
    >
      <input 
        type="checkbox"
        id="isRequired"
        checked={currentValue}
        style={checkboxStyle}
        onChange={onClick}
        className="pointer-events-none select-none custom-accent dark:d-custom-accent"
      />
      <label htmlFor="isRequired" className={`ml-3 text-black text-sm dark:text-white pointer-events-none z-40`}>{label}</label>
    </button>
  )
}

export default Checkbox;