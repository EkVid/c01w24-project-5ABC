import ReducedMotionContext from "@/components/utils/ReducedMotionContext";
import { checkIfNum } from "@/components/utils/checkIfNum";
import { useContext } from "react";

const NumOption = ({label, currentValue, onChangeValue, isIntegerOnly=false, isPositiveOnly=false}) => {
  const isReduceMotion = useContext(ReducedMotionContext);

  const value = currentValue ? currentValue : ""

  return(
    <div className="p-1 flex flex-col md:flex-row">
      <label htmlFor="number" className="text-sm mr-2 custom-text dark:d-text">{label}</label>
      <input
        type="text"
        name="number"
        className={`text-xs min-w-1 max-w-32 border-b-2 custom-text dark:d-text custom-interactive-input ${!checkIfNum(value) ? "custom-err-border" : "border-black dark:border-white"} ${isReduceMotion ? "" : "transition-colors"}`}
        onInput={e => onChangeValue(e.target.value)}
        value={value}
        placeholder="Enter a number"
      />
    </div>
  )
}

export default NumOption;