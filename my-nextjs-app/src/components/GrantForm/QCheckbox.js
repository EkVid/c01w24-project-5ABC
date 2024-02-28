import { useContext, useEffect, useState } from "react";
import { v4 as uuidv4 } from 'uuid';
import Image from "next/image";
import PlusIcon from "@/../public/plus.svg";
import FontSizeContext from "../utils/FontSizeContext";
import ReducedMotionContext from "../utils/ReducedMotionContext";
import OptionsDiv from "./SmallComponents/OptionsDiv";
import CheckboxOption from "./SmallComponents/CheckboxOption";

const QCheckbox = ({answersObj, options, isEditMode, errAnsIdxArr, onSelectAnswer, onAddAnswer, onChangeAnswers, onChangeOptions, onDeleteAnswer}) => {
  const [currentAnswers, setCurrentAnswers] = useState([]);
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

  const handleOnSelectAnswer = (answer) => {
    if (isEditMode) return;
    if (isNoneAnOption && answer === process.env.NEXT_PUBLIC_NONE_OF_THE_ABOVE) {
      if (currentAnswers.length === 1 && currentAnswers[0] === process.env.NEXT_PUBLIC_NONE_OF_THE_ABOVE) {
        setCurrentAnswers([]);
        onSelectAnswer([]);
      }
      else {
        setCurrentAnswers([process.env.NEXT_PUBLIC_NONE_OF_THE_ABOVE]);
        onSelectAnswer([process.env.NEXT_PUBLIC_NONE_OF_THE_ABOVE]);
      }
    }
    else {
      if (currentAnswers.includes(answer)) {
        const newAnswers = currentAnswers.filter(a => a !== answer);
        setCurrentAnswers(newAnswers);
        onSelectAnswer(newAnswers);
      }
      else {
        const newAnswers = [...currentAnswers, answer];
        const newAnswersWithoutNone = newAnswers.filter(a => a !== process.env.NEXT_PUBLIC_NONE_OF_THE_ABOVE);
        setCurrentAnswers(newAnswersWithoutNone);
        onSelectAnswer(newAnswersWithoutNone);
      }
    }
  }

  useEffect(() => setCurrentAnswers([]), [isEditMode]);

  return (
    <>
      {isEditMode ? 
        <OptionsDiv>
          <CheckboxOption 
            label={`Include "${process.env.NEXT_PUBLIC_NONE_OF_THE_ABOVE}:"`} 
            currentValue={isNoneAnOption} 
            onClick={() => onChangeOptions({...options, isNoneAnOption: !isNoneAnOption})}
          />
        </OptionsDiv>
        :
        <></>
      }
      {answersObj?.map((a, idx) =>
        <div 
          key={idx} 
          onClick={() => handleOnSelectAnswer(a.answer)}
          className={`flex items-center p-1 px-2 mb-1 ${isEditMode ? "" : "rounded-md custom-interactive-btn"} ${isReduceMotion ? "" : "transition-colors"}`}
        >
          <input
            type="checkbox"
            id={a.id}
            name={formName}
            style={checkboxStyle}
            onChange={() => handleOnSelectAnswer(a.answer)}
            checked={isEditMode ? false : currentAnswers.includes(a.answer)}
            className="pointer-events-none custom-accent dark:d-custom-accent"
          />
          {isEditMode ?
            <>
              {/* Edit answer */}
              <input
                type="text"
                onChange={e => onChangeAnswers(a.id, e.target.value)}
                value={a.answer}
                placeholder="Enter an answer"
<<<<<<< HEAD
                className={`min-w-5 text-sm custom-text border-b-2 ml-3 dark:d-text custom-interactive-input ${isReduceMotion ? "" : "transition-colors"} ${errAnsIdxArr?.includes(idx) ? "custom-err-border" : "border-black dark:border-white"}`}
=======
                className={`min-w-5 text-sm custom-text border-b-2 border-black ml-3 dark:d-text dark:border-white custom-interactive-input ${isReduceMotion ? "" : "transition-colors"} ${errAnsIdxArr?.includes(idx) ? "custom-err-border" : "border-black dark:border-white"}`}
>>>>>>> 7198180 (more styling refacotring)
              />
              {/* Hide delete answer button if there is only one answer */}
              {answersObj.length > 1 ?
                <button 
                  onClick={() => onDeleteAnswer(a.id)}
                  className={`shrink-0 ml-2 p-0.5 rounded-md custom-interactive-btn ${isReduceMotion ? "" : "transition-colors"}`}
                >
                  <Image
                    src={PlusIcon}
                    alt="Delete"
                    width={20 * fontSizeMultiplier}
                    height={"auto"}
                    className="text-sm dark:d-white-filter rotate-45 pointer-events-none"
                  />
                </button>
                :
                <></>
              }
            </>
            :
            // Show answer
            <label htmlFor={a.id} className="ml-3 text-sm custom-dark-grey dark:d-text pointer-events-none selection:bg-"> 
              {a.answer.trim() === "" ? "(empty answer)" : a.answer}
            </label>
          }
        </div>
      )}
      {/* Show add button if in edit mode */}
      {isEditMode ? 
        <button 
          className={`flex w-fit rounded-md p-1 mt-4 custom-interactive-btn ${isReduceMotion ? "" : "transition-colors"} ${!isEditMode ? "hidden" : ""}`} 
          onClick={handleOnAddAnswer}
        >
          <Image
            src={PlusIcon}
            alt={`Add`}
            width={18 * fontSizeMultiplier}
            height={'auto'}
            className={`pointer-events-none dark:d-white-filter`}
          />
          <div className='ml-2 custom-dark-grey dark:d-custom-dark-grey'>Add Answer</div>
        </button>
        :
        <></>
      }
      {!isEditMode && options?.isNoneAnOption ? 
        <>
        <div className="border-2 rounded-3xl max-w-52 my-1.5 dark:d-custom-dark-grey-border"/>
          <div 
            onClick={() => handleOnSelectAnswer(process.env.NEXT_PUBLIC_NONE_OF_THE_ABOVE)}
            className={`flex items-center p-1 px-2 mb-1 ${isEditMode ? "" : "rounded-md custom-interactive-btn"} ${isReduceMotion ? "" : "transition-colors"}`}
          >
            <input
              type="checkbox"
              id={process.env.NEXT_PUBLIC_NONE_OF_THE_ABOVE}
              name={formName}
              style={checkboxStyle}
              onChange={() => handleOnSelectAnswer(process.env.NEXT_PUBLIC_NONE_OF_THE_ABOVE)}
              checked={currentAnswers.includes(process.env.NEXT_PUBLIC_NONE_OF_THE_ABOVE)}
              className="pointer-events-none custom-accent dark:d-custom-accent"
            />
            <label htmlFor={process.env.NEXT_PUBLIC_NONE_OF_THE_ABOVE} className="ml-3 text-sm custom-dark-grey dark:d-text pointer-events-none selection:bg-"> 
                {process.env.NEXT_PUBLIC_NONE_OF_THE_ABOVE}
              </label>
          </div>
        </>
        :
        <></>
      }
    </>
  )
}

export default QCheckbox;