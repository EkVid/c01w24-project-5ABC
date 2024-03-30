"use client"
import { useContext, useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import Image from 'next/image';
import PlusIcon from "@/../public/plus.svg";
import ReducedMotionContext from '../utils/ReducedMotionContext';
import FontSizeContext from '../utils/FontSizeContext';
import ResponseMsg from './SmallComponents/ResponseMsg';

const QMultichoice = ({answersObj, isRequired, isEditMode, errAnsIdxArr, onSelectAnswer, onAddAnswer, onChangeAnswers, onDeleteAnswer, applicantAnswer}) => {
  const [currentAnswerIdx, setCurrentAnswerIdx] = useState(-1);
  const fontSizeMultiplier = useContext(FontSizeContext) / 100; 
  const isReduceMotion = useContext(ReducedMotionContext);
 
  const formName = uuidv4();

  const radioStyle = {
    transform: `scale(${fontSizeMultiplier * 1.2})`
  }

  const handleOnClickAnswer = (answer, idx) => {
    if (isEditMode) return;
    setCurrentAnswerIdx(idx);
    onSelectAnswer({answer: answer});
  }

  const handleOnAddAnswer = () => {
    onAddAnswer();
  }

  const handleOnClearSelectedAnswer = () => {
    setCurrentAnswerIdx(-1);
    onSelectAnswer(null);
  }

  useEffect(() => setCurrentAnswerIdx(-1), [isEditMode]);

  return applicantAnswer?.answer ?
    <ResponseMsg msg={applicantAnswer.answer}/>
    : applicantAnswer == "" ?
    <ResponseMsg isNoResponse={true}/>
    :
    <>
      {answersObj?.map((a, idx) =>
        <div 
          key={idx} 
          onClick={() => handleOnClickAnswer(a.answer, idx)}
          className={`flex items-center min-w-fit p-1 px-2 ${isEditMode ? "" : "rounded-md custom-interactive-btn m-1"} ${isReduceMotion ? "" : "transition-colors"}`}
        >
          <input
            aria-label={`Multiple-choice answer ${idx + 1}: ${a.answer}`}
            type="radio"
            id={a.id}
            name={formName}
            style={radioStyle}
            onChange={() => handleOnClickAnswer(a.answer, idx)}
            checked={isEditMode ? false : idx === currentAnswerIdx}
            className="pointer-events-none custom-accent dark:d-custom-accent"
            tabIndex={isEditMode ? "-1" : ""}
          />
          {isEditMode ?
            <>
              {/* Edit answer */}
              <input
                type="text"
                onChange={e => onChangeAnswers(a.id, e.target.value)}
                value={a.answer}
                placeholder="Enter an answer"
                className={`text-sm custom-text overflow-auto border-b-2 dark:d-text custom-interactive-input m-1 ml-3 ${isReduceMotion ? "" : "transition-colors"} ${errAnsIdxArr?.includes(idx) ? "custom-err-border" : "border-black dark:border-white"}`}
              />
              {/* Hide delete answer button if there is only one answer */}
              <button 
                name='delete'
                onClick={() => onDeleteAnswer(a.id)}
                className={`ml-2 p-0.5 rounded-md custom-interactive-btn m-1 flex ${answersObj.length > 1 ? "visible" : "invisible"} ${isReduceMotion ? "" : "transition-colors"}`}
              >
                <Image
                  src={PlusIcon}
                  alt={`Delete answer ${a.answer}`}
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
      {/* Show add button if in edit mode, or show clear answer button if in final view */}
      <button 
        aria-label={isEditMode ? "Add additional answer" : "Clear currently selected answer"}
        name={isEditMode ? "Add Answer" : "Clear Answer"}
        className={`flex w-fit rounded-md p-1 mt-4 custom-interactive-btn m-1 ${isReduceMotion ? "" : "transition-colors"} ${!isEditMode && (currentAnswerIdx === -1 || isRequired) ? "hidden" : ""}`} 
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
}

export default QMultichoice;