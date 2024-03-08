import { useContext, useEffect, useState } from "react";
import ReducedMotionContext from "../utils/ReducedMotionContext";
import OptionsDiv from "./SmallComponents/OptionsDiv";
import CheckboxOption from "./SmallComponents/CheckboxOption";

const QDate = ({options, isErr, isEditMode, onSelectAnswer, onChangeOptions}) => {
  const [currentAnswer, setCurrentAnswer] = useState("");
  const isReduceMotion = useContext(ReducedMotionContext);

  const isDateRange = options?.isDateRange ?? false;
  const isBothRequired = options?.isBothRequired && isDateRange ? options.isBothRequired : false;

  const handleOnInput = (newAnswer) => {
    if (isEditMode) return;
    setCurrentAnswer(newAnswer);
    onSelectAnswer(newAnswer);
  }

  useEffect(() => setCurrentAnswer(""), [isEditMode]);

  return (
    <>
      {isEditMode ? 
        <OptionsDiv>
          <CheckboxOption 
            label={"Enable date range answers:"}
            currentValue={isDateRange} 
            onClick={() => onChangeOptions({isDateRange: !isDateRange, isBothRequired: false})}
          />
          {isDateRange ?
            <CheckboxOption 
              label={"Require both start and end:"}
              currentValue={isBothRequired} 
              onClick={() => onChangeOptions({...options, isBothRequired: !isBothRequired})}
            />
            :
            <></>
          }
        </OptionsDiv>
        :
        <></>
      }
      {isDateRange ? <label htmlFor="startDate" className="mb-1 custom-text dark:d-text flex md:hidden">Start:</label> : <></>}
      <div className="flex mb-6 md:mb-2">
        {isDateRange ? <label htmlFor="startDate" className="custom-text dark:d-text mr-2 hidden md:flex">Start:</label> : <></>}
        <input
          type="date"
          id="startDate"
          placeholder={isEditMode ? "User will enter answer here" : "Enter your answer"}
          className={`text-sm w-fit md:max-w-96 border-b-2 bg-transparent ${isEditMode ? "custom-disabled-input dark:d-custom-disabled-input" : "custom-text dark:d-text custom-interactive-input"} ${isErr && !isEditMode ? "custom-err-border" : "dark:border-white"} ${isReduceMotion ? "" : "transition-colors"}`}
          onInput={e => handleOnInput(e.target.value, 0)}
          value={currentAnswer}
          disabled={isEditMode}
        />
      </div>
      {isDateRange ?
        <>
          <label htmlFor="startDate" className="mb-1 custom-text dark:d-text flex md:hidden">End:</label>
          <div className="flex">
            <label htmlFor="startDate" className="custom-text dark:d-text mr-4 hidden md:flex">End:</label>
            <input
              type="date"
              id="startDate"
              placeholder={isEditMode ? "User will enter answer here" : "Enter your answer"}
              className={`text-sm w-fit md:max-w-96 border-b-2 bg-transparent ${isEditMode ? "custom-disabled-input dark:d-custom-disabled-input" : "custom-text dark:d-text custom-interactive-input"} ${isErr && !isEditMode ? "custom-err-border" : "dark:border-white"} ${isReduceMotion ? "" : "transition-colors"}`}
              onInput={e => handleOnInput(e.target.value, 1)}
              value={currentAnswer}
              disabled={isEditMode}
            />
          </div>
          {isBothRequired && !isEditMode? 
            <div className="italic text-sm mt-2 custom-text-shade dark:d-text-shade">
              Both start and end dates are required
            </div>
            : !isBothRequired && !isEditMode ?
            <div className="italic text-sm mt-2 custom-text-shade dark:d-text-shade">
              You may enter either a start or end date
            </div>
            : 
            <></>
          }
        </>
        :
        <></>
      }
    </>
  )
}

export default QDate;