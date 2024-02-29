import Image from "next/image";
import TrashIcon from "@/../public/trash-icon.svg"
import PlusIcon from "@/../public/plus.svg"
import UndoIcon from "@/../public/undo.svg"
import MultichoiceIcon from "@/../public/multichoice.svg"
import CheckboxIcon from "@/../public/checkbox.svg"
import NumberIcon from "@/../public/number.svg"
import TextIcon from "@/../public/textbox.svg"
import EmailIcon from "@/../public/email.svg"
import PhoneIcon from "@/../public/phone.svg"
import DateIcon from "@/../public/date.svg"
import FileIcon from "@/../public/file.svg"
import { useContext, useRef } from "react";
import { v4 as uuidv4 } from 'uuid';
import FontSizeContext from "@/components/utils/FontSizeContext";
import QMultichoice from "./QMultichoice";
import ReducedMotionContext from "../utils/ReducedMotionContext";
import CheckboxOption from "./SmallComponents/CheckboxOption";
import ErrTextbox from "./SmallComponents/ErrTextbox";
import QCheckbox from "./QCheckbox";
import QNumber from "./QNumber";
import QText from "./QText";
import QEmail from "./QEmail";
import QPhoneNum from "./QPhoneNum";
import QDate from "./QDate";
import QFile from "./QFile";

const QuestionBase = ({questionData, isEditMode, onSelectAnswer, onChangeQuestionData, onDelete}) => {
  const fontSizeMultiplier = useContext(FontSizeContext) / 100;
  const isReduceMotion = useContext(ReducedMotionContext);
  const formRef = useRef();

  const {
    id, 
    answersObj, 
    question, 
    type, 
    file, 
    curFile, 
    isCurFileDeleting, 
    options, 
    isRequired, 
    errMsgArr, 
    errEmptyAnsIdxArr, 
    errDupAnsIdxArr
  } = questionData;

  const attId = uuidv4();

  // For multiple answers questions, sends array of index of answers that have problems to highlight red
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

  const handleOnSubmitFile = (e) => {
    e.preventDefault();
    formRef.current.reset();
  }

  const handleOnUndoCurFile = (e) => {
    formRef.current.reset();
    onChangeQuestionData({...questionData, isCurFileDeleting: !isCurFileDeleting, file: null})
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
    onChangeQuestionData({...questionData, answersObj: newAnswersObjArr, errEmptyAnsIdxArr: emptyAnsArr, errDupAnsIdxArr: dupAnsArr});
  }

  return (
    <>
      <div className={`flex items-center mb-6`}>
        {isEditMode ?
          <>
            <input 
              type="text"
              className={`flex-auto min-w-5 text-2xl border-b-2 custom-text dark:d-text custom-interactive-input ${isReduceMotion ? "" : "transition-colors"} ${question === "" ? "custom-err-border" : "border-black dark:border-white "}`}
              value={question}
              placeholder="Enter a question"
              onInput={e => handleOnChangeQuestion(e.target.value)}
            />
            <button onClick={() => onDelete(id)} className={`ml-4 shrink-0 p-1.5 rounded-lg custom-interactive-btn hidden md:flex ${isReduceMotion ? "" : "transition-colors"}`}>
              <Image
                src={TrashIcon}
                alt="Delete"
                width={30 * fontSizeMultiplier}
                height={"auto"}
                className="pointer-events-none dark:d-white-filter"
              />
            </button>
          </>
          :
          <div className="text-2xl custom-text dark:d-text">
            {question}{isRequired ? <font className="custom-red dark:d-custom-red mr-1"> *</font> : <></>}
          </div>
        }
      </div>
      {isEditMode ?
        <button onClick={() => onDelete(id)} className={`p-1.5 mt-1 rounded-lg custom-interactive-btn flex self-end md:hidden ${isReduceMotion ? "" : "transition-colors"}`}>
          <Image
            src={TrashIcon}
            alt="Delete"
            width={30 * fontSizeMultiplier}
            height={"auto"}
            className="pointer-events-none dark:d-white-filter"
          />
        </button>
        :
        <></>
      }
      {/* Options section for required question and file upload */}
      {isEditMode ? 
        <>
        <div className="text-sm mb-4 custom-text dark:d-text">Settings:</div>
        <div className="px-4 mb-4">
          <CheckboxOption 
            label={"Required question:"} 
            currentValue={isRequired} 
            onClick={() => onChangeQuestionData({...questionData, isRequired: !isRequired})}
          />
          <div className="flex items-center px-2 py-1">
            <label htmlFor={attId} className="text-sm mr-2 custom-text dark:d-text">Attachments:</label>
            <form ref={formRef} onSubmit={handleOnSubmitFile} className="flex items-center overflow-hidden">
              <input
                type="file"
                id={attId}
                className={`text-sm custom-text dark:d-text md:max-w-96 rounded-md bg-transparent custom-interactive-input ${isReduceMotion ? "" : "transition-colors"}`}
                onInput={e => onChangeQuestionData({...questionData, file: e.target.files[0]})}
                disabled={!isCurFileDeleting && curFile}
              />
              <button 
                onClick={() => onChangeQuestionData({...questionData, file: null})}
                className={`shrink-0 ml-2 p-0.5 rounded-md custom-interactive-btn ${file ? "flex" : "hidden"} ${isReduceMotion ? "" : "transition-colors"}`}
              >
                <Image
                  src={PlusIcon}
                  alt="Delete"
                  width={20 * fontSizeMultiplier}
                  height={"auto"}
                  className="dark:d-white-filter rotate-45 pointer-events-none"
                />
              </button>
            </form>
          </div>
          {curFile ? 
            <div className="flex items-center">
              <div className="text-sm custom-text-shade dark:d-text-shade pl-8">
                {isCurFileDeleting ? "Previous uploaded file will be deleted" : `Current upload: ${curFile.name}`}
              </div>
              <button 
                onClick={handleOnUndoCurFile}
                className={`shrink-0 ml-2 p-0.5 rounded-md custom-interactive-btn ${isReduceMotion ? "" : "transition-colors"}`}
              >
                <Image
                  src={isCurFileDeleting ? UndoIcon : PlusIcon}
                  alt={isCurFileDeleting ? "Restore" : "Delete"}
                  width={20 * fontSizeMultiplier}
                  height={"auto"}
                  className={`text-sm dark:d-white-filter shrink-0 pointer-events-none opacity-50 ${isCurFileDeleting ? "" : "rotate-45"}`}
                />
              </button>
            </div>
            :
            <></>
          }
        </div>
        </>
        :
        <></>
      }
      {file ?
        <div>

        </div>
        :
        <></>
      }
      <div className="flex justify-between items-end">
        <div className="flex flex-col flex-auto mr-5">
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
            : type === process.env.NEXT_PUBLIC_TYPE_CHECKBOX ?
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
            : type === process.env.NEXT_PUBLIC_TYPE_NUMBER ?
            <QNumber
              options={options}
              isErr={!isEditMode && errMsgArr && errMsgArr.length > 0}
              isEditMode={isEditMode}
              onSelectAnswer={onSelectAnswer}
              onChangeOptions={handleOnChangeOptions}
            />
            : type === process.env.NEXT_PUBLIC_TYPE_TEXT ?
            <QText
              options={options}
              isErr={!isEditMode && errMsgArr && errMsgArr.length > 0}
              isEditMode={isEditMode}
              onSelectAnswer={onSelectAnswer}
              onChangeOptions={handleOnChangeOptions}
            />
            : type === process.env.NEXT_PUBLIC_TYPE_EMAIL ?
            <QEmail
              isErr={!isEditMode && errMsgArr && errMsgArr.length > 0}
              isEditMode={isEditMode}
              onSelectAnswer={onSelectAnswer}
            />
            : type === process.env.NEXT_PUBLIC_TYPE_PHONE ?
            <QPhoneNum
              isErr={!isEditMode && errMsgArr && errMsgArr.length > 0}
              isEditMode={isEditMode}
              onSelectAnswer={onSelectAnswer}
            />
            : type === process.env.NEXT_PUBLIC_TYPE_DATE ?
            <QDate
              options={options}
              isErr={!isEditMode && errMsgArr && errMsgArr.length > 0}
              isEditMode={isEditMode}
              onSelectAnswer={onSelectAnswer}
              onChangeOptions={handleOnChangeOptions}
            />
            : type === process.env.NEXT_PUBLIC_TYPE_FILE ?
            <QFile
              isEditMode={isEditMode}
              onSelectAnswer={onSelectAnswer}
            />
            :
            <></>
          }
          {errMsgArr?.map((err, i) => <ErrTextbox msg={err} key={i}/>)}
        </div>
        {/* Question icon in corner */}
        <div className="p-1.5"><Image
          src={
            type === process.env.NEXT_PUBLIC_TYPE_MULTI ? MultichoiceIcon : 
            type === process.env.NEXT_PUBLIC_TYPE_CHECKBOX ? CheckboxIcon : 
            type === process.env.NEXT_PUBLIC_TYPE_TEXT ? TextIcon :
            type === process.env.NEXT_PUBLIC_TYPE_NUMBER ? NumberIcon :
            type === process.env.NEXT_PUBLIC_TYPE_EMAIL ? EmailIcon :
            type === process.env.NEXT_PUBLIC_TYPE_PHONE ? PhoneIcon :
            type === process.env.NEXT_PUBLIC_TYPE_DATE ? DateIcon :
            type === process.env.NEXT_PUBLIC_TYPE_FILE ? FileIcon : ""}
          alt={type === process.env.NEXT_PUBLIC_TYPE_MULTI ? "Multiple choice type question" : 
            type === process.env.NEXT_PUBLIC_TYPE_CHECKBOX ? "Checkbox type question" : 
            type === process.env.NEXT_PUBLIC_TYPE_TEXT ? "Texbox type question" :
            type === process.env.NEXT_PUBLIC_TYPE_NUMBER ? "Numeric type question" :
            type === process.env.NEXT_PUBLIC_TYPE_EMAIL ? "Email type question" :
            type === process.env.NEXT_PUBLIC_TYPE_PHONE ? "Phone number type question" :
            type === process.env.NEXT_PUBLIC_TYPE_DATE ? "Date type question" :
            type === process.env.NEXT_PUBLIC_TYPE_FILE ? "File upload type question" : ""}
          width={30 * fontSizeMultiplier}
          height={"auto"}
          className="pointer-events-none opacity-40 dark:opacity-30 dark:d-white-filter"
        /></div>
        
      </div>
    </>
  )
}

export default QuestionBase;