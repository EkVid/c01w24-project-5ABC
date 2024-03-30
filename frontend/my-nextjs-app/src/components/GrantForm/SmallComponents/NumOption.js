import ReducedMotionContext from "@/components/utils/ReducedMotionContext";
import { checkIfNum } from "@/components/utils/checkIfNum";
import { useContext } from "react";
import { v4 as uuidv4 } from 'uuid';

const NumOption = ({label, currentValue, onChangeValue}) => {
  const isReduceMotion = useContext(ReducedMotionContext);

  const value = currentValue ?? ""
  const formId = uuidv4();

  return(
    <div className="px-2 py-1 flex flex-col md:flex-row md:items-center">
      <label htmlFor={formId} className="text-sm mr-3 custom-text dark:d-text">{label}</label>
      <input
        type="text"
        id={formId}
        className={`text-xs min-w-1 max-w-24 border-b-2 custom-text dark:d-text custom-interactive-input m-1 ${!checkIfNum(value) ? "custom-err-border" : "border-black dark:border-white"} ${isReduceMotion ? "" : "transition-colors"}`}
        onInput={e => onChangeValue(e.target.value)}
        value={value}
        placeholder="Enter a number"
      />
    </div>
  )
}

export default NumOption;