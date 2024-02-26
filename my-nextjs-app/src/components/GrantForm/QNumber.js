import { useContext, useState } from "react";
import ReducedMotionContext from "../utils/ReducedMotionContext";
import OptionsDiv from "./SmallComponents/OptionsDiv";
import CheckboxOption from "./SmallComponents/CheckboxOption";
import NumOption from "./SmallComponents/NumOption";
import { checkIfNum } from "../utils/checkIfNum";

const QNumber = ({options, optionsErrMsgArr, isEditMode, onSelectAnswer, onChangeOptions}) => {
  const [currentAnswer, setCurrentAnswer] = useState("");
  const isReduceMotion = useContext(ReducedMotionContext);

  const isIntegerOnly = options?.isIntegerOnly ? options.isIntegerOnly : false;
  const minNum = options?.minNum ? options.minNum : "";
  const maxNum = options?.maxNum ? options.maxNum : "";

  let rangeStr;
  

  const handleOnInput = (newAnswer) => {
    if (isEditMode) return;
    if (checkIfNum(newAnswer, false, isIntegerOnly)) setCurrentAnswer(newAnswer);
  }

  return (
    <>
      {isEditMode ? 
        <OptionsDiv>
          <CheckboxOption 
            label={"Require integer answers"}
            currentValue={isIntegerOnly} 
            onClick={() => onChangeOptions({...options, isIntegerOnly: !isIntegerOnly})}
          />
          <NumOption
            label={"Minimum number: "}
            isPositiveOnly={true}
            isIntegerOnly={true}
            currentValue={minNum}
            onChangeValue={newMin => onChangeOptions({...options, minNum: newMin})}
          />
          <NumOption
            label={"Maximum number: "}
            currentValue={maxNum}
            onChangeValue={newMax => onChangeOptions({...options, maxNum: newMax})}
          />
        </OptionsDiv>
        :
        <></>
      }
      <input
        type="input"
        placeholder={isEditMode ? "User will enter answer here" : "Enter a number"}
        className={`text-sm max-w-full md:max-w-96 border-b-2 bg-transparent ${isEditMode ? "" : "border-white dark:border-black custom-interactive-input"} ${isReduceMotion ? "" : "transition-colors"}`}
        onInput={e => handleOnInput(e.target.value)}
        value={currentAnswer}
        disabled={isEditMode}
      />
    </>
  )
}

export default QNumber;