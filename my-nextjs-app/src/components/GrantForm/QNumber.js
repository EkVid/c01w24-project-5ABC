import { useContext, useState } from "react";
import ReducedMotionContext from "../utils/ReducedMotionContext";
import OptionsDiv from "./SmallComponents/OptionsDiv";
import CheckboxOption from "./SmallComponents/CheckboxOption";
import NumOption from "./SmallComponents/NumOption";
import { checkIfNum } from "../utils/checkIfNum";

const QNumber = ({options, isErr, isEditMode, onSelectAnswer, onChangeOptions}) => {
  const [currentAnswer, setCurrentAnswer] = useState("");
  const isReduceMotion = useContext(ReducedMotionContext);

  const isIntegerOnly = options?.isIntegerOnly ?? false;
  const minNum = options?.minNum ?? "";
  const maxNum = options?.maxNum ?? "";

  let rangeStr = "";
  if (minNum !== "" && maxNum !== "") {
    rangeStr += `Answer must be between ${minNum} and ${maxNum}`;
  }
  else if (minNum !== "") {
    rangeStr += `Answer must be at least ${minNum}`;
  }
  else if (maxNum !== "") {
    rangeStr += `Answer must be at most ${maxNum}`;
  }

  const handleOnInput = (newAnswer) => {
    if (isEditMode) return;
    setCurrentAnswer(newAnswer);
    onSelectAnswer(newAnswer)
  }

  return (
    <>
      {isEditMode ? 
        <OptionsDiv>
          <CheckboxOption 
            label={"Require integer answers:"}
            currentValue={isIntegerOnly} 
            onClick={() => onChangeOptions({...options, isIntegerOnly: !isIntegerOnly})}
          />
          <NumOption
            label={"Minimum number:"}
            currentValue={minNum}
            onChangeValue={newMin => onChangeOptions({...options, minNum: newMin})}
          />
          <NumOption
            label={"Maximum number:"}
            currentValue={maxNum}
            onChangeValue={newMax => onChangeOptions({...options, maxNum: newMax})}
          />
        </OptionsDiv>
        :
        <></>
      }
      {/* <label htmlFor="numAnswer" className="mb-2 custom-text dark:d-text">Answer:</label> */}
      <input
        type="number"
        id="numAnswer"
        placeholder={"ex: 12345"}
        className={`text-sm max-w-full md:max-w-96 border-b-2 bg-transparent custom-text dark:d-text ${isEditMode ? "custom-disabled-input dark:d-custom-disabled-input" : "custom-interactive-input"} ${!isEditMode && isErr ? "custom-err-border" : " dark:border-white"} ${isReduceMotion ? "" : "transition-colors"} [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`}
        onInput={e => handleOnInput(e.target.value)}
        value={currentAnswer}
        disabled={isEditMode}
      />
      {rangeStr !== "" && !isEditMode ?
        <div className="italic text-sm mt-1 custom-text-shade dark:d-text-shade">{rangeStr}</div>
        :
        <></>
      }
    </>
  )
}

export default QNumber;