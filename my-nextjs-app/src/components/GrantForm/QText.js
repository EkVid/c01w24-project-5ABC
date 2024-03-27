import { useContext, useEffect, useState } from "react";
import ReducedMotionContext from "../utils/ReducedMotionContext";
import OptionsDiv from "./SmallComponents/OptionsDiv";
import CheckboxOption from "./SmallComponents/CheckboxOption";
import NumOption from "./SmallComponents/NumOption";
import ResponseMsg from "./SmallComponents/ResponseMsg";

const QText = ({options, isErr, isEditMode, onSelectAnswer, onChangeOptions, applicantAnswer, questionNum}) => {
  const [currentAnswer, setCurrentAnswer] = useState("");
  const isReduceMotion = useContext(ReducedMotionContext);

  const isMultipleLines = options?.isMultipleLines ?? false;
  const minCharsNum = options?.minCharsNum ?? "";
  const maxCharsNum = options?.maxCharsNum ?? "";

  let rangeStr = "";
  if (minCharsNum !== "" && maxCharsNum !== "" && minCharsNum === maxCharsNum) {
    rangeStr = `Answer must be exactly ${minCharsNum} characters long`
  }
  else if (minCharsNum !== "" && maxCharsNum !== "") {
    rangeStr = `Answer must be between ${minCharsNum} and ${maxCharsNum} characters`;
  }
  else if (minCharsNum !== "") {
    rangeStr = `Answer must be at least ${minCharsNum} characters`;
  }
  else if (maxCharsNum !== "") {
    rangeStr = `Answer must be at most ${maxCharsNum} characters`;
  }

  const handleOnInput = (newAnswer) => {
    if (isEditMode) return;
    setCurrentAnswer(newAnswer);
    onSelectAnswer(newAnswer ? {text: newAnswer} : null);
  }

  useEffect(() => setCurrentAnswer(""), [isEditMode]);

  return applicantAnswer?.text ?
    <ResponseMsg msg={applicantAnswer.text}/>
    : applicantAnswer == "" ?
    <ResponseMsg isNoResponse={true}/>
    :
    <>
      {isEditMode ? 
        <OptionsDiv>
          <CheckboxOption 
            label={`Enable exteneded responses for Q${questionNum}:`}
            currentValue={isMultipleLines} 
            onClick={() => onChangeOptions({...options, isMultipleLines: !isMultipleLines})}
          />
          <NumOption
            label={`Minimum character count for Q${questionNum}:`}
            currentValue={minCharsNum}
            onChangeValue={newMin => onChangeOptions({...options, minCharsNum: newMin}, newMin && newMin > 0)}
          />
          <NumOption
            label={`Maximum character count for Q${questionNum}:`}
            currentValue={maxCharsNum}
            onChangeValue={newMax => onChangeOptions({...options, maxCharsNum: newMax})}
          />
        </OptionsDiv>
        :
        <></>
      }
      {isMultipleLines ?
        <textarea
          style={isEditMode ? {height: '3.5em'} : {}}
          placeholder={isEditMode ? "User will enter answer here" : "example: abc"}
          className={`min-h-6 max-h-96 flex custom-text dark:d-text text-sm border-2 bg-transparent m-1 ${isEditMode ? "custom-disabled-input dark:d-custom-disabled-input resize-none" : "custom-interactive-input"} ${isErr && !isEditMode ? "custom-err-border" : "dark:border-white"} ${isReduceMotion ? "" : "transition-colors"}`}
          onInput={e => handleOnInput(e.target.value)}
          value={currentAnswer}
          disabled={isEditMode}
        />
        :
        <input
          type="text"
          placeholder={isEditMode ? "User will enter answer here" : "example: abc"}
          className={`text-sm max-w-full custom-text dark:d-text md:max-w-96 border-b-2 bg-transparent m-1 ${isEditMode ? "custom-disabled-input dark:d-custom-disabled-input" : "custom-interactive-input"} ${isErr && !isEditMode ? "custom-err-border" : "dark:border-white"} ${isReduceMotion ? "" : "transition-colors"}`}
          onInput={e => handleOnInput(e.target.value)}
          value={currentAnswer}
          disabled={isEditMode}
        />
      }
      {!isEditMode ?
        <p className="italic text-sm custom-text-shade dark:d-text-shade">{rangeStr}</p>
        :
        <></>
      }
    </>
}

export default QText;