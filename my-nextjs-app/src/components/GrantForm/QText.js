import { useContext, useState } from "react";
import ReducedMotionContext from "../utils/ReducedMotionContext";
import OptionsDiv from "./SmallComponents/OptionsDiv";
import CheckboxOption from "./SmallComponents/CheckboxOption";
import NumOption from "./SmallComponents/NumOption";

const QText = ({options, optionsErrMsgArr, isErr, isEditMode, onSelectAnswer, onChangeOptions}) => {
  const [currentAnswer, setCurrentAnswer] = useState("");
  const isReduceMotion = useContext(ReducedMotionContext);

  const isMultipleLines = options?.isMultipleLines ? options.isMultipleLines : false;
  const minCharsNum = options?.minCharsNum ? options.minCharsNum : "";
  const maxCharsNum = options?.maxCharsNum ? options.maxCharsNum : "";

  let rangeStr = "";
  if (minCharsNum !== "" && maxCharsNum !== "") {
    rangeStr += `Answer must be between ${minCharsNum} and ${maxCharsNum} characters`;
  }
  else if (minCharsNum !== "") {
    rangeStr += `Answer must be at least ${minCharsNum} characters`;
  }
  else if (maxCharsNum !== "") {
    rangeStr += `Answer must be at most ${maxCharsNum} characters`;
  }

  const handleOnInput = (newAnswer) => {
    if (isEditMode) return;
    setCurrentAnswer(newAnswer);
    onSelectAnswer(newAnswer);
  }

  return (
    <>
      {isEditMode ? 
        <OptionsDiv>
          <CheckboxOption 
            label={"Enable multiline responses"}
            currentValue={isMultipleLines} 
            onClick={() => onChangeOptions({...options, isMultipleLines: !isMultipleLines})}
          />
          <NumOption
            label={"Minimum character count: "}
            currentValue={minCharsNum}
            onChangeValue={newMin => onChangeOptions({...options, minCharsNum: newMin})}
          />
          <NumOption
            label={"Maximum character count: "}
            currentValue={maxCharsNum}
            onChangeValue={newMax => onChangeOptions({...options, maxCharsNum: newMax})}
          />
        </OptionsDiv>
        :
        <></>
      }
      {isMultipleLines ?
        <textarea
          placeholder={isEditMode ? "User will enter answer here" : "Enter an answer"}
          className={`min-h-6 max-h-96 custom-text dark:d-text text-sm max-w-full md:max-w-96 border-2 bg-transparent ${isEditMode ? "custom-disabled-input dark:d-custom-disabled-input" : "dark:border-white custom-interactive-input"} ${isErr && !isEditMode ? "custom-err-border" : ""} ${isReduceMotion ? "" : "transition-colors"}`}
          onInput={e => handleOnInput(e.target.value)}
          value={currentAnswer}
          disabled={isEditMode}
        />
        :
        <input
          type="text"
          placeholder={isEditMode ? "User will enter answer here" : "Enter an answer"}
          className={`text-sm max-w-full custom-text dark:d-text md:max-w-96 border-b-2 bg-transparent ${isEditMode ? "custom-disabled-input dark:d-custom-disabled-input" : "dark:border-white custom-interactive-input"} ${isErr && !isEditMode ? "custom-err-border" : ""} ${isReduceMotion ? "" : "transition-colors"}`}
          onInput={e => handleOnInput(e.target.value)}
          value={currentAnswer}
          disabled={isEditMode}
        />
      }
      {rangeStr !== "" && !isEditMode ?
        <div className="italic text-sm custom-text-shade dark:d-text-shade">{rangeStr}</div>
        :
        <></>
      }
    </>
  )
}

export default QText;