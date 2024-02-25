"use client"
import { useContext, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import fontSizeContext from '../utils/FontSizeContext';
import Image from 'next/image';
import PlusIcon from "@/../public/plus.svg";
import ReducedMotionContext from '../utils/ReducedMotionContext';

const QMultichoice = ({questionData, isEditMode, onSelectAnswer, onChangeAnswers, onDelete}) => {
  const [currentAnswer, setCurrentAnswer] = useState(null)
  const fontSizeMultiplier = useContext(fontSizeContext) / 100; 
  const isReduceMotion = useContext(ReducedMotionContext);
 
  const {id, question, answers, isRequired} = questionData;
  const formName = uuidv4();
  const answersObj = answers?.map(a => ({
    answer: a, 
    id: uuidv4()
  }));

  const radioStyle = {
    transform: `scale(${fontSizeMultiplier * 1.2})`,
    accentColor: '#407541',
  }

  const handleOnClickAnswer = (answer) => {
    if (isEditMode) return;
    setCurrentAnswer(answer);
    onSelectAnswer(answer);
  }

  const handleOnAddAnswer = () => {
    onChangeAnswers([...answers, ""]);
  }

  const handleOnEditAnswers = (answerId, newAnswer) => {
    onChangeAnswers(answersObj.map(a => a.id === answerId ? newAnswer : a.answer));
  }

  const handleOnDeleteAnswers = (answerId) => {
    const filteredAnsObj = answersObj.filter(a => a.id !== answerId)
    onChangeAnswers(filteredAnsObj.map(a => a.answer));
  }

  const handleOnClearSelectedAnswer = () => {
    setCurrentAnswer(null);
    onSelectAnswer(null);
  }

  return (
    <>
      {answersObj?.map((a, idx) =>
        <div 
          key={idx} 
          onClick={() => handleOnClickAnswer(a.answer)}
          className={`flex items-center my-2 p-1 px-3 ${isEditMode ? "" : "rounded-md hover:custom-hover-white dark:hover:d-custom-hover-black active:custom-active-white dark:active:d-custom-active-black"}`}
        >
          <input
            type="radio"
            id={a.id}
            name={formName}
            style={radioStyle}
            onChange={() => handleOnClickAnswer(a.answer)}
            checked={isEditMode ? false : a.answer === currentAnswer}
            className="pointer-events-none"
          />
          {isEditMode ?
            <>
              <input
                type="text"
                onChange={e => handleOnEditAnswers(a.id, e.target.value)}
                value={a.answer}
                placeholder="Enter an answer"
                className={`min-w-5 text-md bg-transparent text-black border-b border-b-black ml-3 dark:text-white dark:border-b-white hover:custom-hover-white dark:hover:d-custom-hover-black focus:bg-transparent dark:focus:bg-transparent ${isReduceMotion ? "" : "transition-colors"}`}
              />
              {/* Hide delete answer button if there is only one answer */}
              {answersObj.length > 1 ?
                <button 
                  onClick={() => handleOnDeleteAnswers(a.id)}
                  className={`shrink-0 bg-red-800 ml-2 p-0.5 rounded-md custom-red-background hover:custom-hover-red active:custom-active-red ${isReduceMotion ? "" : "transition-colors"}`}
                >
                  <Image
                    src={PlusIcon}
                    alt="Delete"
                    width={20 * fontSizeMultiplier}
                    height={"auto"}
                    className="d-filter-white rotate-45 pointer-events-none"
                  />
                </button>
                :
                <></>
              }
            </>
            :
            <label htmlFor={a.id} className="ml-3 custom-dark-grey dark:text-white pointer-events-none"> 
              {a.answer}
            </label>
          }
        </div>
      )}
      {/* Show add button if in edit mode, or show clear answer button if in final view */}
      <button 
        className={`flex w-fit rounded-md p-1 px-3 mt-4 hover:custom-hover-white dark:hover:d-custom-hover-black active:custom-active-white dark:active:d-custom-active-black ${isReduceMotion ? "" : "transition-colors"} ${!isEditMode && (currentAnswer == null || isRequired) ? "hidden" : ""}`} 
        onClick={isEditMode ? handleOnAddAnswer : handleOnClearSelectedAnswer}
      >
        <Image
          src={PlusIcon}
          alt={`Add`}
          width={15 * fontSizeMultiplier}
          height={'auto'}
          className={`pointer-events-none dark:d-filter-white ${isEditMode ? "" : "rotate-45"}`}
        />
        <div className='ml-2 custom-dark-grey dark:d-custom-dark-grey'>{isEditMode ? "Add Answer" : "Clear Answer"}</div>
      </button>
    </>
  )
}

export default QMultichoice;