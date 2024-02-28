import FontSizeContext from "@/components/utils/FontSizeContext";
import ReducedMotionContext from "@/components/utils/ReducedMotionContext";
import { useContext } from "react";

const CheckboxOption = ({label, currentValue, onClick}) => {
  const fontSizeMultiplier = useContext(FontSizeContext) / 100;
  const isReduceMotion = useContext(ReducedMotionContext);
  const checkboxStyle = {
    transform: `scale(${fontSizeMultiplier * 1.2})`
  }

  const value = currentValue == true;

  return (
    <button 
      onClick={onClick}
      className={`flex w-fit rounded-md pl-1 py-1 custom-interactive-btn ${isReduceMotion ? "" : "transition-colors"}`}
    >
      <input 
        type="checkbox"
        id="isRequired"
        checked={value}
        style={checkboxStyle}
        onChange={onClick}
        className="pointer-events-none select-none custom-accent dark:d-custom-accent"
      />
      <label htmlFor="isRequired" className={`ml-3 custom-text dark:d-text text-left text-sm pointer-events-none z-40`}>{label}</label>
    </button>
  )
}

export default CheckboxOption;