import ReducedMotionContext from "@/components/utils/ReducedMotionContext";
import { checkIfNum } from "@/components/utils/checkIfNum";
import { useContext } from "react";

const NumOption = ({label, isIntegerOnly, isPositiveOnly, isError, currentValue, onChangeValue}) => {
  const isReduceMotion = useContext(ReducedMotionContext);

  const value = currentValue ? currentValue : ""

  // Only change option value if input is a number
  const onInput = (newValue) => {
    if (checkIfNum(newValue, isPositiveOnly, isIntegerOnly)) onChangeValue(newValue);
  }

  return(
    <div className="p-1">
      <label htmlFor="number" className="text-sm mr-2 text-black dark:d-text">{label}</label>
      <input
        type="text"
        name="number"
        className={`text-xs min-w-1 max-w-32 border-b-2 text-black dark:d-text border-black dark:border-white custom-interactive-input ${isReduceMotion ? "" : "transition-colors"}`}
        onInput={e => onInput(e.target.value)}
        value={value}
        placeholder="Enter a number"
      />
    </div>
  )
}

export default NumOption;