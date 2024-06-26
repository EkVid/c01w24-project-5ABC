import { useContext, useEffect, useState } from "react";
import ReducedMotionContext from "../utils/ReducedMotionContext";
import OptionsDiv from "./SmallComponents/OptionsDiv";
import CheckboxOption from "./SmallComponents/CheckboxOption";
import ResponseMsg from "./SmallComponents/ResponseMsg";

const QDate = ({options, isErr, isEditMode, onSelectAnswer, onChangeOptions, applicantAnswer, questionNum}) => {
  const [currentAnswer, setCurrentAnswer] = useState({startDate: ""});
  const isReduceMotion = useContext(ReducedMotionContext);

  const isDateRange = options?.isDateRange ?? false;
  const isBothRequired = options?.isBothRequired && isDateRange ? options.isBothRequired : false;

  const handleOnInput = (newAnswer, isEndDate) => {
    if (isEditMode) return;
    const newStartDate = !isEndDate ? newAnswer : currentAnswer.startDate;
    const newEndDate = isEndDate ? newAnswer : currentAnswer?.endDate ?? "";
    if (isDateRange) {
      const dataToSave = {startDate: newStartDate, endDate: newEndDate};
      setCurrentAnswer(dataToSave);
      if (newStartDate || newEndDate) onSelectAnswer(dataToSave);
      else onSelectAnswer(null);
    }
    else {
      const dataToSave = {startDate: newStartDate};
      setCurrentAnswer(dataToSave);
      if (newStartDate) onSelectAnswer(dataToSave);
      else onSelectAnswer(null);
    }
  }

  useEffect(() => setCurrentAnswer({startDate: ""}), [isEditMode]);

  return applicantAnswer?.startDate ?
    <>
      <ResponseMsg 
        msg={`${applicantAnswer.endDate ? "Start: " : ""} ${applicantAnswer.startDate}`}
        isMarginBottomAdded={applicantAnswer.endDate ? true : false}
      />
      {applicantAnswer.endDate ? 
        <ResponseMsg msg={`End: ${applicantAnswer.endDate}`}/>
        : 
        <></>
      }
    </>
    : applicantAnswer == "" ?
    <ResponseMsg isNoResponse={true}/>
    :
    <>
      {isEditMode ? 
        <OptionsDiv>
          <CheckboxOption 
            label={`Enable date range answers for Q${questionNum}:`}
            currentValue={isDateRange} 
            onClick={() => onChangeOptions({isDateRange: !isDateRange, isBothRequired: false})}
          />
          {isDateRange ?
            <CheckboxOption 
              label={`Require both start and end for Q${questionNum}:`}
              currentValue={isBothRequired} 
              onClick={() => onChangeOptions({...options, isBothRequired: !isBothRequired}, true)}
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
          className={`text-sm w-fit md:max-w-96 border-b-2 bg-transparent m-1 ${isEditMode ? "custom-disabled-input dark:d-custom-disabled-input" : "custom-text dark:d-text custom-interactive-input"} ${isErr && !isEditMode ? "custom-err-border" : "dark:border-white"} ${isReduceMotion ? "" : "transition-colors"}`}
          onInput={e => handleOnInput(e.target.value, false)}
          value={currentAnswer?.startDate ?? ""}
          disabled={isEditMode}
        />
      </div>
      {isDateRange ?
        <>
          <label htmlFor="endDate" className="mb-1 custom-text dark:d-text flex md:hidden">End:</label>
          <div className="flex">
            <label htmlFor="endDate" className="custom-text dark:d-text mr-4 hidden md:flex">End:</label>
            <input
              type="date"
              id="endDate"
              placeholder={isEditMode ? "User will enter answer here" : "Enter your answer"}
              className={`text-sm w-fit md:max-w-96 border-b-2 bg-transparent m-1 ${isEditMode ? "custom-disabled-input dark:d-custom-disabled-input" : "custom-text dark:d-text custom-interactive-input"} ${isErr && !isEditMode ? "custom-err-border" : "dark:border-white"} ${isReduceMotion ? "" : "transition-colors"}`}
              onInput={e => handleOnInput(e.target.value, true)}
              value={currentAnswer?.endDate ?? ""}
              disabled={isEditMode}
            />
          </div>
          {!isEditMode ? 
            <p className="italic text-sm mt-2 custom-text-shade dark:d-text-shade">
              {isBothRequired ? "Both start and end dates are required" : "You may enter either a start or end date"}
            </p>
            : 
            <></>
          }
        </>
        :
        <></>
      }
    </>
}

export default QDate;