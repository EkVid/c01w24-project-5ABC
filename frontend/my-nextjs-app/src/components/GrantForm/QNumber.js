import { useContext, useEffect, useState } from "react";
import ReducedMotionContext from "../utils/ReducedMotionContext";
import OptionsDiv from "./SmallComponents/OptionsDiv";
import CheckboxOption from "./SmallComponents/CheckboxOption";
import NumOption from "./SmallComponents/NumOption";
import ResponseMsg from "./SmallComponents/ResponseMsg";

const QNumber = ({options, isErr, isEditMode, onSelectAnswer, onChangeOptions, applicantAnswer, questionNum}) => {
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
    onSelectAnswer(newAnswer ? {value: parseFloat(newAnswer)} : null);
  }

  useEffect(() => setCurrentAnswer(""), [isEditMode]);

  return applicantAnswer?.value ?
    <ResponseMsg msg={applicantAnswer.value}/>
    : applicantAnswer == "" ?
    <ResponseMsg isNoResponse={true}/>
    :
    <>
      {isEditMode ? 
        <OptionsDiv>
          <CheckboxOption 
            label={`Require integer answers for Q${questionNum}:`}
            currentValue={isIntegerOnly} 
            onClick={() => onChangeOptions({...options, isIntegerOnly: !isIntegerOnly})}
          />
          <NumOption
            label={`Minimum number for Q${questionNum}:`}
            currentValue={minNum}
            onChangeValue={newMin => onChangeOptions({...options, minNum: newMin})}
          />
          <NumOption
            label={`Maximum number for Q${questionNum}:`}
            currentValue={maxNum}
            onChangeValue={newMax => onChangeOptions({...options, maxNum: newMax})}
          />
        </OptionsDiv>
        :
        <></>
      }
      {/* <label htmlFor="numAnswer" className="mb-2 custom-text dark:d-text">Answer:</label> */}
      <input
        type="text"
        id="numAnswer"
        placeholder={"example: 123"}
        className={`text-sm max-w-full md:max-w-96 border-b-2 bg-transparent custom-text dark:d-text m-1 ${isEditMode ? "custom-disabled-input dark:d-custom-disabled-input" : "custom-interactive-input"} ${!isEditMode && isErr ? "custom-err-border" : "dark:border-white"} ${isReduceMotion ? "" : "transition-colors"} [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`}
        onInput={e => handleOnInput(e.target.value)}
        value={currentAnswer}
        disabled={isEditMode}
      />
      {!isEditMode ?
        <>
          <p className="italic text-sm custom-text-shade dark:d-text-shade">{rangeStr}</p>
          <p className="italic text-sm mt-1 custom-text-shade dark:d-text-shade">{isIntegerOnly ? "Integer answers only" : ""}</p>
        </>
        :
        <></>
      }
    </>
}

export default QNumber;