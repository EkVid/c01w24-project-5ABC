"use client"
import { useContext, useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import Image from 'next/image';
import PlusIcon from "@/../public/plus.svg";
import ReducedMotionContext from '../utils/ReducedMotionContext';
import FontSizeContext from '../utils/FontSizeContext';
import OptionsDiv from './SmallComponents/OptionsDiv';

const QMultichoice = ({answersObj, isRequired, isEditMode, errAnsIdxArr, onSelectAnswer, onAddAnswer, onChangeAnswers, onDeleteAnswer}) => {
  const [currentAnswer, setCurrentAnswer] = useState(null)
  const fontSizeMultiplier = useContext(FontSizeContext) / 100; 
  const isReduceMotion = useContext(ReducedMotionContext);
 
  const formName = uuidv4();

  const radioStyle = {
    transform: `scale(${fontSizeMultiplier * 1.2})`
  }

  const handleOnClickAnswer = (answer) => {
    if (isEditMode) return;
    setCurrentAnswer(answer);
    onSelectAnswer({answer: answer});
  }

  const handleOnAddAnswer = () => {
    onAddAnswer();
  }

  const handleOnClearSelectedAnswer = () => {
    setCurrentAnswer(null);
    onSelectAnswer(null);
  }

  useEffect(() => setCurrentAnswer(null), [isEditMode]);

  return (
    <>
      {isEditMode ? 
        <OptionsDiv />
        :
        <></>
      }
      {answersObj?.map((a, idx) =>
        <button 
          key={idx} 
          onClick={() => handleOnClickAnswer(a.answer)}
          className={`flex items-center p-1 px-2 ${isEditMode ? "" : "rounded-md custom-interactive-btn m-1"} ${isReduceMotion ? "" : "transition-colors"}`}
        >
          <input
            type="radio"
            id={a.id}
            name={formName}
            style={radioStyle}
            onChange={() => handleOnClickAnswer(a.answer)}
            checked={isEditMode ? false : a.answer === currentAnswer}
            className="pointer-events-none custom-accent dark:d-custom-accent mr-2"
            tabIndex="-1"
          />
          {isEditMode ?
            <>
              {/* Edit answer */}
              <input
                type="text"
                onChange={e => onChangeAnswers(a.id, e.target.value)}
                value={a.answer}
                placeholder="Enter an answer"
                className={`text-sm custom-text overflow-auto border-b-2 dark:d-text custom-interactive-input ${isReduceMotion ? "" : "transition-colors"} ${errAnsIdxArr?.includes(idx) ? "custom-err-border" : "border-black dark:border-white"}`}
              />
              {/* Hide delete answer button if there is only one answer */}
              {answersObj.length > 1 ?
                <button 
                  name='delete'
                  onClick={() => onDeleteAnswer(a.id)}
                  className={`shrink-0 ml-2 p-0.5 rounded-md custom-interactive-btn m-1 ${isReduceMotion ? "" : "transition-colors"}`}
                >
                  <Image
                    src={PlusIcon}
                    alt={`Delete answer ${a.answer}`}
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
            <label htmlFor={a.id} className="ml-3 text-sm custom-dark-grey dark:d-text pointer-events-none"> 
              {a.answer.trim() === "" ? "(empty answer)" : a.answer}
            </label>
          }
        </button>
      )}
      {/* Show add button if in edit mode, or show clear answer button if in final view */}
      <button 
        aria-label={isEditMode ? "Add additional answer" : "Clear currently selected answer"}
        name={isEditMode ? "Add Answer" : "Clear Answer"}
        className={`flex w-fit rounded-md p-1 mt-4 custom-interactive-btn m-1 ${isReduceMotion ? "" : "transition-colors"} ${!isEditMode && (currentAnswer == null || isRequired) ? "hidden" : ""}`} 
        onClick={isEditMode ? handleOnAddAnswer : handleOnClearSelectedAnswer}
      >
        <Image
          src={PlusIcon}
          alt={""}
          width={18 * fontSizeMultiplier}
          height={'auto'}
          className={`pointer-events-none dark:d-white-filter mr-2 ${isEditMode ? "" : "rotate-45"}`}
        />
        <label htmlFor={isEditMode ? "Add Answer" : "Clear Answer"} className='custom-dark-grey dark:d-custom-dark-grey cursor-pointer'>{isEditMode ? "Add Answer" : "Clear Answer"}</label>
      </button>
    </>
  )
}

export default QMultichoice;