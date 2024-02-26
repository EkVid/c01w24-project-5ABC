import Image from "next/image";
import TrashIcon from "@/../public/trash-icon.svg"
import { useContext } from "react";
import { v4 as uuidv4 } from 'uuid';
import FontSizeContext from "@/components/utils/FontSizeContext";
import QMultichoice from "./QMultichoice";
import ReducedMotionContext from "../utils/ReducedMotionContext";
import CheckboxSetting from "./SmallComponents/CheckboxSetting";
import ErrTextbox from "./SmallComponents/ErrTextbox";

const QuestionBase = ({questionData, isEditMode, onSelectAnswer, onChangeQuestionData, onDelete}) => {
  const fontSizeMultiplier = useContext(FontSizeContext) / 100;
  const isReduceMotion = useContext(ReducedMotionContext);

  const {id, answers, question, type, isRequired, errMsg} = questionData;

  const isTitleErr = errMsg === process.env.NEXT_PUBLIC_ERR_MISSING_TITLE;

  const answersObj = answers?.map(a => ({
    answer: a, 
    id: uuidv4()
  }));

  const handleOnChangeQuestion = (newQuestion) => {
    onChangeQuestionData({...questionData, question: newQuestion, errMsg: isTitleErr ? null : errMsg});
  }

  const handleOnAddAnswer = () => {
    onChangeQuestionData({...questionData, answers: [...answers, ""]})
  }

  const handleOnChangeAnswers = (answerId, newAnswer) => {
    validateAndUpdateAnswers(answersObj.map(a => a.id === answerId ? ({...a, answer: newAnswer}) : a));
  }
  
  const handleOnDeleteAnswer = (answerId) => {
    const filteredAnsObj = answersObj.filter(a => a.id !== answerId)
    validateAndUpdateAnswers(filteredAnsObj);
  }

  // Validation on answers for multiple choice and checkbox questions
  const validateAndUpdateAnswers = (newAnswersObjArr) => {
    const ansArr = newAnswersObjArr.map(a => a.answer)
    const emptyAnsArr = [];
    const dupAnsArr = [];
    const tempCountObj = {};
    for (let i = 0; i < newAnswersObjArr.length; i++) { 
      const ansObj = newAnswersObjArr[i];
      if (ansObj.answer == null || ansObj.answer.trim().length === 0) emptyAnsArr.push(i);
      else if (tempCountObj[ansObj.answer]) tempCountObj[ansObj.answer].push(i);
      else tempCountObj[ansObj.answer] = [i];
    }
    for (let v of Object.values(tempCountObj)) {
      if (v.length > 1) v.forEach(i => dupAnsArr.push(i));
    }
    onChangeQuestionData({...questionData, answers: ansArr, errEmptyAnsIdxArr: emptyAnsArr, errDupAnsIdxArr: dupAnsArr});
  }

  

  return (
    <>
      <div className={`flex mb-5 items-center`}>
        {isEditMode ?
          <>
            <input 
              type="text"
              className={`flex-auto min-w-5 text-2xl bg-transparent border-b-2 border-black dark:border-white text-black dark:text-white hover:custom-hover-white dark:hover:d-custom-hover-black focus:bg-transparent dark:focus:bg-transparent ${isReduceMotion ? "" : "transition-colors"} ${question === "" ? "custom-red-border dark:d-custom-red-border" : ""}`}
              value={question}
              placeholder="Enter question"
              onInput={e => handleOnChangeQuestion(e.target.value)}
            />
            <button onClick={() => onDelete(id)} className={`ml-4 shrink-0 custom-red-background p-1.5 rounded-lg hover:custom-hover-red active:custom-active-red ${isReduceMotion ? "" : "transition-colors"}`}>
              <Image
                src={TrashIcon}
                alt="Delete"
                width={35 * fontSizeMultiplier}
                height={"auto"}
                className="pointer-events-none d-filter-white"
              />
            </button>
          </>
          :
          <>
            
            <div className="text-2xl text-black dark:text-white">
              {question}{isRequired ? <font className="custom-red dark:d-custom-red mr-1"> *</font> : <></>}
            </div>
          </>
        }
      </div>
      {/* Options section */}
      {isEditMode ? 
        <div className="pl-5 mb-8">
          <div className="mb-2 px-2 text-black dark:text-white">Settings:</div>
            <CheckboxSetting 
              label={"Required question"} 
              currentValue={isRequired} 
              onClick={() => onChangeQuestionData({...questionData, isRequired: !isRequired})}
            />
        </div>
        :
        <></>
      }
      {/* Body of question */}
      {type === "multiple choice" ?
        <QMultichoice
          questionData={questionData}
          isEditMode={isEditMode}
          answersObj={answersObj}
          onSelectAnswer={onSelectAnswer}
          onAddAnswer={handleOnAddAnswer}
          onChangeAnswers={handleOnChangeAnswers}
          onDeleteAnswer={handleOnDeleteAnswer}
        />
        :
        <></>
      }
      {errMsg ? 
        <ErrTextbox msg={errMsg}/>
        :
        <></>
      }
    </>
  )
}

export default QuestionBase;