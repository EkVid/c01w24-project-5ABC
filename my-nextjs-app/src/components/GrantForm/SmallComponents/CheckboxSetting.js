import FontSizeContext from "@/components/utils/FontSizeContext";
import ReducedMotionContext from "@/components/utils/ReducedMotionContext";
import { useContext } from "react";

const CheckboxSetting = ({label, currentValue, onClick}) => {
  const fontSizeMultiplier = useContext(FontSizeContext) / 100;
  const isReduceMotion = useContext(ReducedMotionContext);
  const checkboxStyle = {
    transform: `scale(${fontSizeMultiplier * 1.2})`,
    accentColor: '#407541',
  }


  return (
    <div 
      onClick={onClick}
      className={`flex items-center w-fit rounded-md p-1 px-3 hover:cursor-pointer hover:custom-hover-white dark:hover:d-custom-hover-black active:custom-active-white dark:active:d-custom-active-black ${isReduceMotion ? "" : "transition-colors"}`}
    >
      <input 
        type="checkbox"
        id="isRequired"
        checked={currentValue}
        style={checkboxStyle}
        onChange={onClick}
        className="pointer-events-none"
      />
      <label htmlFor="isRequired" className={`ml-3 text-black dark:text-white pointer-events-none`}>{label}</label>
    </div>
  )
}

export default CheckboxSetting;