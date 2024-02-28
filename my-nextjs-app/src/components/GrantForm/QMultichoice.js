"use client"
import { useContext, useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import Image from 'next/image';
import PlusIcon from "@/../public/plus.svg";
import ReducedMotionContext from '../utils/ReducedMotionContext';
import FontSizeContext from '../utils/FontSizeContext';
import OptionsDiv from './SmallComponents/OptionsDiv';

const QMultichoice = ({answersObj, isRequired, isEditMode, errAnsIdxArr, onSelectAnswer, onAddAnswer, onChangeAnswers, onDeleteAnswer}) => {
  const [currentAnswer, setCurrentAnswer] = useState([])
  const fontSizeMultiplier = useContext(FontSizeContext) / 100; 
  const isReduceMotion = useContext(ReducedMotionContext);
 
  const formName = uuidv4();

  const radioStyle = {
    transform: `scale(${fontSizeMultiplier * 1.2})`
  }

  const handleOnClickAnswer = (answer) => {
    if (isEditMode) return;
    setCurrentAnswer(answer);
    onSelectAnswer(answer);
  }

  const handleOnAddAnswer = () => {
    onAddAnswer();
  }

  const handleOnClearSelectedAnswer = () => {
    setCurrentAnswer([]);
    onSelectAnswer([]);
  }

  useEffect(() => setCurrentAnswer([]), [isEditMode]);

  return (
    <>
      {isEditMode ? 
        <OptionsDiv />
        :
        <></>
      }
      {answersObj?.map((a, idx) =>
        <div 
          key={idx} 
          onClick={() => handleOnClickAnswer(a.answer)}
          className={`flex items-center p-1 px-2 mb-1 ${isEditMode ? "" : "rounded-md custom-interactive-btn"} ${isReduceMotion ? "" : "transition-colors"}`}
        >
          <input
            type="radio"
            id={a.id}
            name={formName}
            style={radioStyle}
            onChange={() => handleOnClickAnswer(a.answer)}
            checked={isEditMode ? false : a.answer === currentAnswer}
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
                className={`text-sm custom-text overflow-auto border-b-2 ml-3 dark:d-text custom-interactive-input ${isReduceMotion ? "" : "transition-colors"} ${errAnsIdxArr?.includes(idx) ? "custom-err-border" : "border-black dark:border-white"}`}
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
            <label htmlFor={a.id} className="ml-3 text-sm custom-dark-grey dark:d-text pointer-events-none"> 
<<<<<<< HEAD
              {a.answer.trim() === "" ? "(empty answer)" : a.answer}
=======
              {a.answer}
>>>>>>> 7198180 (more styling refacotring)
            </label>
          }
        </div>
      )}
      {/* Show add button if in edit mode, or show clear answer button if in final view */}
      <button 
        className={`flex w-fit rounded-md p-1 mt-4 custom-interactive-btn ${isReduceMotion ? "" : "transition-colors"} ${!isEditMode && (currentAnswer == null || isRequired) ? "hidden" : ""}`} 
        onClick={isEditMode ? handleOnAddAnswer : handleOnClearSelectedAnswer}
      >
        <Image
          src={PlusIcon}
          alt={`Add`}
          width={18 * fontSizeMultiplier}
          height={'auto'}
          className={`pointer-events-none dark:d-white-filter ${isEditMode ? "" : "rotate-45"}`}
        />
        <div className='ml-2 custom-dark-grey dark:d-custom-dark-grey'>{isEditMode ? "Add Answer" : "Clear Answer"}</div>
      </button>
    </>
  )
}

export default QMultichoice;