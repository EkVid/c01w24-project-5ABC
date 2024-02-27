import Image from "next/image";
import TrashIcon from "@/../public/trash-icon.svg"
import { useContext } from "react";
import { v4 as uuidv4 } from 'uuid';
import FontSizeContext from "@/components/utils/FontSizeContext";
import QMultichoice from "./QMultichoice";
import ReducedMotionContext from "../utils/ReducedMotionContext";
import CheckboxOption from "./SmallComponents/CheckboxOption";
import ErrTextbox from "./SmallComponents/ErrTextbox";
import QCheckbox from "./QCheckbox";
import QNumber from "./QNumber";

const QuestionBase = ({questionData, isEditMode, onSelectAnswer, onChangeQuestionData, onDelete}) => {
  const fontSizeMultiplier = useContext(FontSizeContext) / 100;
  const isReduceMotion = useContext(ReducedMotionContext);

  const {id, answers, question, type, options, isRequired, errMsgArr, errEmptyAnsIdxArr, errDupAnsIdxArr} = questionData;

  const isTitleErr = errMsgArr?.includes(process.env.NEXT_PUBLIC_ERR_MISSING_TITLE);

  const answersObj = answers?.map(a => ({
    answer: a, 
    id: uuidv4()
  }));

  const errAnsIdxArr = [];
  if (errEmptyAnsIdxArr) {
    for (let idx of errEmptyAnsIdxArr) {
      if (!errAnsIdxArr.includes(idx)) errAnsIdxArr.push(idx);
    }
  }
  if (errDupAnsIdxArr) {
    for (let idx of errDupAnsIdxArr) {
      if (!errAnsIdxArr.includes(idx)) errAnsIdxArr.push(idx);
    }
  }
  
  const handleOnChangeQuestion = (newQuestion) => {
    onChangeQuestionData({...questionData, question: newQuestion})
  }

  const handleOnChangeOptions = (newOptions) => {
    onChangeQuestionData({...questionData, options: newOptions});
  }

  // --------- Handlers for questions that have answers (multiple choice, checkbox) -----------

  const handleOnAddAnswer = () => {
    //onChangeQuestionData({...questionData, answers: [...answers, ""]})
    validateAndUpdateAnswers([...answersObj, {answer: "", id: uuidv4()}]);
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
              className={`flex-auto min-w-5 text-2xl border-b-2 border-black dark:border-white text-black dark:text-white custom-interactive-input ${isReduceMotion ? "" : "transition-colors"} ${question === "" ? "custom-red-border dark:d-custom-red-border" : ""}`}
              value={question}
              placeholder="Enter a question"
              onInput={e => handleOnChangeQuestion(e.target.value)}
            />
            <button onClick={() => onDelete(id)} className={`ml-4 shrink-0 p-1.5 rounded-lg custom-interactive-btn ${isReduceMotion ? "" : "transition-colors"}`}>
              <Image
                src={TrashIcon}
                alt="Delete"
                width={35 * fontSizeMultiplier}
                height={"auto"}
                className="pointer-events-none dark:d-white-filter"
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
        <div className="pl-5">
          <div className="text-sm mb-2  text-black dark:text-white">Settings:</div>
            <CheckboxOption 
              label={"Required question"} 
              currentValue={isRequired} 
              onClick={() => onChangeQuestionData({...questionData, isRequired: !isRequired})}
            />
        </div>
        :
        <></>
      }
      {/* Body of question */}
      {type === process.env.NEXT_PUBLIC_TYPE_MULTI ?
        <QMultichoice
          answersObj={answersObj}
          isRequired={isRequired}
          isEditMode={isEditMode}
          errAnsIdxArr={errAnsIdxArr}
          onSelectAnswer={onSelectAnswer}
          onAddAnswer={handleOnAddAnswer}
          onChangeAnswers={handleOnChangeAnswers}
          onDeleteAnswer={handleOnDeleteAnswer}
        />
        :
        type === process.env.NEXT_PUBLIC_TYPE_CHECKBOX ?
        <QCheckbox
          answersObj={answersObj}
          options={options}
          isEditMode={isEditMode}
          errAnsIdxArr={errAnsIdxArr}
          onSelectAnswer={onSelectAnswer}
          onAddAnswer={handleOnAddAnswer}
          onChangeAnswers={handleOnChangeAnswers}
          onChangeOptions={handleOnChangeOptions}
          onDeleteAnswer={handleOnDeleteAnswer}
        />
        :
        type === process.env.NEXT_PUBLIC_TYPE_NUMBER ?
        <QNumber
          options={options}
          isEditMode={isEditMode}
          onSelectAnswer={onSelectAnswer}
          onChangeOptions={handleOnChangeOptions}
        />
        :
        <></>
      }
      {errMsgArr?.map((err, i) => 
        <ErrTextbox msg={err} key={i}/>
      )}
    </>
  )
}

export default QuestionBase;