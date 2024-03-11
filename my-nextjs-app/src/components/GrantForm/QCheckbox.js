import { useContext, useEffect, useState } from "react";
import { v4 as uuidv4 } from 'uuid';
import Image from "next/image";
import PlusIcon from "@/../public/plus.svg";
import FontSizeContext from "../utils/FontSizeContext";
import ReducedMotionContext from "../utils/ReducedMotionContext";
import OptionsDiv from "./SmallComponents/OptionsDiv";
import CheckboxOption from "./SmallComponents/CheckboxOption";

const QCheckbox = ({answersObj, options, isEditMode, errAnsIdxArr, onSelectAnswer, onAddAnswer, onChangeAnswers, onChangeOptions, onDeleteAnswer}) => {
  const [currentAnswersIdx, setCurrentAnswersIdx] = useState([]);
  const fontSizeMultiplier = useContext(FontSizeContext) / 100; 
  const isReduceMotion = useContext(ReducedMotionContext);

  const isNoneAnOption = options?.isNoneAnOption ?? false;

  const formName = uuidv4();

  const checkboxStyle = {
    transform: `scale(${fontSizeMultiplier * 1.2})`
  }

  const handleOnAddAnswer = () => {
    if (isEditMode) onAddAnswer();
  }

  const handleOnSelectAnswer = (answer, idx) => {
    if (isEditMode) return;
    if (isNoneAnOption && answer === process.env.NEXT_PUBLIC_NONE_OF_THE_ABOVE) {
      if (currentAnswersIdx.length === 1 && currentAnswersIdx[0] === answersObj.length) {
        setCurrentAnswersIdx([]);
        onSelectAnswer(null);
      }
      else {
        setCurrentAnswersIdx([answersObj.length]);
        onSelectAnswer({answers: [process.env.NEXT_PUBLIC_NONE_OF_THE_ABOVE]});
      }
    }
    else {
      if (currentAnswersIdx.includes(idx)) {
        const idxArr = currentAnswersIdx.filter(i => i !== idx);
        idxArr.sort((a, b) => a - b);
        setCurrentAnswersIdx(idxArr);
        onSelectAnswer({answers: idxArr.map(idx => answersObj[idx].answer)});
      }
      else {
        const idxArr = [...currentAnswersIdx, idx].filter(i => i !== answersObj.length);
        idxArr.sort((a, b) => a - b);
        setCurrentAnswersIdx(idxArr);
        onSelectAnswer({answers: idxArr.map(idx => answersObj[idx].answer)});
      }
    }
  }

  useEffect(() => setCurrentAnswersIdx([]), [isEditMode]);

  return (
    <>
      {isEditMode ? 
        <OptionsDiv>
          <CheckboxOption 
            label={`Include "${process.env.NEXT_PUBLIC_NONE_OF_THE_ABOVE}:`} 
            currentValue={isNoneAnOption} 
            onClick={() => onChangeOptions({...options, isNoneAnOption: !isNoneAnOption})}
          />
        </OptionsDiv>
        :
        <></>
      }
      {answersObj?.map((a, idx) =>
        <div 
          aria-label={`Answer: ${a.answer}`}
          key={idx} 
          onClick={() => handleOnSelectAnswer(a.answer, idx)}
          className={`flex items-center max-w-fit px-2 py-1 m-1 ${isEditMode ? "" : "rounded-md custom-interactive-btn"} ${isReduceMotion ? "" : "transition-colors"}`}
        >
          <input
            aria-label={`Checkbox for answer ${a.answer}`}
            type="checkbox"
            id={a.id}
            name={formName}
            style={checkboxStyle}
            onChange={() => handleOnSelectAnswer(a.answer, idx)}
            checked={isEditMode ? false : currentAnswersIdx.includes(idx)}
            className="pointer-events-none custom-accent dark:d-custom-accent"
            tabIndex={isEditMode ? "-1" : ""}
          />
          {isEditMode ?
            <>
              {/* Edit answer */}
              <input
                aria-label={`Textbox to edit answer ${idx + 1}`}
                type="text"
                onChange={e => onChangeAnswers(a.id, e.target.value)}
                value={a.answer}
                placeholder="Enter an answer"
                className={`min-w-5 text-sm custom-text border-b-2 dark:d-text custom-interactive-input ml-3 ${isReduceMotion ? "" : "transition-colors"} ${errAnsIdxArr?.includes(idx) ? "custom-err-border" : "border-black dark:border-white"}`}
              />
              {/* Hide delete answer button if there is only one answer */}
              <button 
                aria-label={`Button to delete answer ${idx + 1}`}
                onClick={() => onDeleteAnswer(a.id)}
                className={`ml-2 p-0.5 rounded-md custom-interactive-btn m-1 flex ${answersObj.length > 1 ? "visible" : "invisible"} ${isReduceMotion ? "" : "transition-colors"}`}
              >
                <Image
                  src={PlusIcon}
                  alt="Delete"
                  width={18 * fontSizeMultiplier}
                  height={"auto"}
                  className="text-sm dark:d-white-filter rotate-45 pointer-events-none"
                />
              </button>  
            </>
            :
            // Show answer
            <label htmlFor={a.id} className="ml-3 text-sm custom-dark-grey dark:d-text pointer-events-none"> 
              {a.answer.trim() === "" ? "(empty answer)" : a.answer}
            </label>
          }
        </div>
      )}
      {/* Show add button if in edit mode */}
      {isEditMode ? 
        <button 
          aria-label="Button to add an additional answer"
          className={`flex w-fit rounded-md p-1 mt-4 custom-interactive-btn m-1 ${isReduceMotion ? "" : "transition-colors"} ${!isEditMode ? "hidden" : ""}`} 
          onClick={handleOnAddAnswer}
        >
          <Image
            src={PlusIcon}
            alt={`Add`}
            width={18 * fontSizeMultiplier}
            height={'auto'}
            className="mr-2 dark:d-white-filter"
          />
          <div className='custom-dark-grey dark:d-custom-dark-grey'>Add Answer</div>
        </button>
        :
        <></>
      }
      {!isEditMode && options?.isNoneAnOption ? 
        <>
          <div className="border-2 rounded-3xl max-w-52 my-1.5 border-opacity-30 dark:border-opacity-30 border-black dark:border-white"/>
          <button 
            aria-label={`Answer: ${process.env.NEXT_PUBLIC_NONE_OF_THE_ABOVE}`}
            onClick={() => handleOnSelectAnswer(process.env.NEXT_PUBLIC_NONE_OF_THE_ABOVE)}
            className={`flex items-center p-1 px-2 ${isEditMode ? "" : "rounded-md custom-interactive-btn m-1"} ${isReduceMotion ? "" : "transition-colors"}`}
          >
            <input
              type="checkbox"
              id={process.env.NEXT_PUBLIC_NONE_OF_THE_ABOVE}
              name={formName}
              style={checkboxStyle}
              onChange={() => handleOnSelectAnswer(process.env.NEXT_PUBLIC_NONE_OF_THE_ABOVE)}
              checked={currentAnswersIdx.includes(answersObj.length)}
              className="pointer-events-none custom-accent dark:d-custom-accent"
            />
            <label htmlFor={process.env.NEXT_PUBLIC_NONE_OF_THE_ABOVE} className="ml-3 text-sm custom-dark-grey dark:d-text pointer-events-none selection:bg-"> 
              {process.env.NEXT_PUBLIC_NONE_OF_THE_ABOVE}
            </label>
          </button>
        </>
        :
        <></>
      }
    </>
  )
}

export default QCheckbox;