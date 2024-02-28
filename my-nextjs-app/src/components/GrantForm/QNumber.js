import { useContext, useEffect, useState } from "react";
import ReducedMotionContext from "../utils/ReducedMotionContext";
import OptionsDiv from "./SmallComponents/OptionsDiv";
import CheckboxOption from "./SmallComponents/CheckboxOption";
import NumOption from "./SmallComponents/NumOption";
import { checkIfNum } from "../utils/checkIfNum";

const QNumber = ({options, optionsErrMsgArr, isErr, isEditMode, onSelectAnswer, onChangeOptions}) => {
  const [currentAnswer, setCurrentAnswer] = useState("");
  const isReduceMotion = useContext(ReducedMotionContext);

  const isIntegerOnly = options?.isIntegerOnly ? options.isIntegerOnly : false;
  const minNum = options?.minNum ? options.minNum : "";
  const maxNum = options?.maxNum ? options.maxNum : "";

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
    if (checkIfNum(newAnswer, false, isIntegerOnly)) setCurrentAnswer(newAnswer);
  }

  useEffect(() => onSelectAnswer(currentAnswer), [currentAnswer]);

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
            currentValue={minNum}
            onChangeValue={newMin => onChangeOptions({...options, minNum: newMin})}
            isError={optionsErrMsgArr.includes(process.env.NEXT_PUBLIC_ERR_MAX_LESS_THAN_MIN)}
          />
          <NumOption
            label={"Maximum number: "}
            currentValue={maxNum}
            onChangeValue={newMax => onChangeOptions({...options, maxNum: newMax})}
            isError={optionsErrMsgArr.includes(process.env.NEXT_PUBLIC_ERR_MAX_LESS_THAN_MIN)}
          />
        </OptionsDiv>
        :
        <></>
      }
      <input
        type="input"
        placeholder={isEditMode ? "User will enter number here" : "Enter number"}
        className={`text-sm max-w-full md:max-w-96 border-b-2 bg-transparent custom-text dark:d-text ${isEditMode ? "custom-disabled-input dark:d-custom-disabled-input" : "dark:border-white custom-interactive-input"} ${!isEditMode && isErr ? "custom-err-border" : " dark:border-white"} ${isReduceMotion ? "" : "transition-colors"}`}
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