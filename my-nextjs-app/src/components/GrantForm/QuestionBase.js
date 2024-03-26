import Image from "next/image";
import TrashIcon from "@/../public/trash-icon.svg"
import PlusIcon from "@/../public/plus.svg"
import DragIcon from "@/../public/drag.svg"
import UpIcon from "@/../public/up-arrow.svg"
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
import { useSortable } from "@dnd-kit/sortable";
import { TYPE_MULTI, TYPE_CHECKBOX, TYPE_TEXT, TYPE_NUMBER, TYPE_EMAIL, TYPE_PHONE, TYPE_DATE, TYPE_FILE } from "../utils/constants";
import { uploadFile } from "../utils/uploadFile";

const QuestionBase = ({questionData, questionNum, isEditMode, isLastQuestion, onChangePosition, onSelectAnswer, onChangeQuestionData, onDelete, applicantAnswer}) => {
  const fontSizeMultiplier = useContext(FontSizeContext) / 100;
  const isReduceMotion = useContext(ReducedMotionContext);
  const formRef = useRef();

  const {
    id,
    answersObj, 
    question, 
    type, 
    file, 
    fileData,
    options, 
    isRequired, 
    errMsg, 
    errEmptyAnsIdxArr, 
    errDupAnsIdxArr,
    isTemp
  } = questionData;
  
  const {attributes, isDragging, listeners, setNodeRef, setActivatorNodeRef, transform} = useSortable({ 
    id: id,
    data: {
      questionNum,
      cont: "questionPanel"
    },
    disabled: !isEditMode
  });
  
  const dragTransitionSec = 0.1;

  const dragStyle = {
    translate: `${transform ? transform.x : 0}px ${transform ? transform.y : 0}px`,
    transition: isReduceMotion ? "" : isDragging ? "" : transform ? `translate ${dragTransitionSec}s` : ""
  }

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

  const handleOnChangeOptions = (newOptions, newIsRequired) => {
    onChangeQuestionData({...questionData, options: newOptions, isRequired: newIsRequired ? newIsRequired : isRequired});
  }

  const handleOnAddFile = async (e) => {
    onChangeQuestionData({...questionData, file: "", fileData: {fileLink: null, fileName: "Uploading..."}});
    try {
      const {base64str, url, fileName, fileType} = await uploadFile(e.target.files[0]);
      onChangeQuestionData({...questionData, file: base64str, fileData: {fileLink: url, fileName: `${fileName} (${fileType})`}});
    }
    catch (errMsg) {
      onChangeQuestionData({...questionData, file: "", fileData: {fileLink: null, fileName: errMsg}});
    }
  }

  const handleOnClearFile = (e) => {
    e.preventDefault();
    formRef.current.reset();
    if (fileData?.fileLink) URL.revokeObjectURL(fileData.fileLink);
    onChangeQuestionData({...questionData, file: null, fileData: null});
  }

  // --------- Handlers for questions that have answers (multiple choice, checkbox) -----------

  const handleOnAddAnswer = () => {
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
    emptyAnsArr.sort((a, b) => a - b);
    dupAnsArr.sort((a, b) => a - b);
    onChangeQuestionData({...questionData, answersObj: newAnswersObjArr, errEmptyAnsIdxArr: emptyAnsArr, errDupAnsIdxArr: dupAnsArr});
  }

  return (
    <div 
      ref={setNodeRef} 
      style={dragStyle}
      className={`p-5 ${isEditMode ? "pt-0" : ""} mb-5 rounded-xl border-4 overflow-auto ${(isDragging || isTemp) && isEditMode ? "border-dashed border-black dark:border-white bg-transparent" : errMsg ? "custom-err-border custom-questioncard-background" : "custom-questioncard-background border-transparent"} ${isReduceMotion ? "" : "transition-colors"}`}
    >
      <div className={`flex flex-col  ${(isDragging || isTemp) && isEditMode ? "invisible" : ""}`}>
        {isEditMode ? 
          <div className="flex justify-center mt-2">
            <button 
              aria-label="Move question up one"
              onClick={() => onChangePosition(-1)}
              className={`px-2 py-1 rounded-lg custom-interactive-btn m-1 ${questionNum && questionNum > 1 && !isDragging && !isTemp && isEditMode ? "visible" : "invisible"} ${isReduceMotion ? "" : "transition-colors"}`}
            >
              <Image
                src={UpIcon}
                alt="Move up"
                height={8 * fontSizeMultiplier}
                className="dark:d-white-filter "
              />
            </button>
            <button 
              aria-label="Drag handle to rearrange question"
              ref={setActivatorNodeRef}
              className={`px-2 py-1 mx-6 cursor-move rounded-lg hover:custom-hover-white dark:hover:d-custom-hover-black ${isReduceMotion ? "" : "transition-colors"}`}
              {...listeners}
              {...attributes} 
            >
              <Image
                src={DragIcon}
                alt="Drag handle"
                height={8 * fontSizeMultiplier}
                className="dark:d-white-filter"
              />
            </button>
            <button
              aria-label="Move question down one"
              onClick={() => onChangePosition(1)}
              className={`px-2 py-1 rounded-lg custom-interactive-btn m-1 ${questionNum && !isLastQuestion && !isDragging && !isTemp ? "visible" : "invisible"} ${isReduceMotion ? "" : "transition-colors"}`}
            >
              <Image
                src={UpIcon}
                alt="Move down"
                height={8 * fontSizeMultiplier}
                className="dark:d-white-filter rotate-180"
              />
            </button>
          </div>
          :
          <></>
        }
        <div className={`flex items-center md:mb-5`}>
          {isEditMode ?
            <>
              <h2 className={`font-bold text-xl custom-text dark:d-text ${isEditMode ? "" : "self-start"} ${isReduceMotion ? "" : "transition-colors"}`}>
                Q{questionNum}.
              </h2> 
              <input 
                aria-label={`Textbox to type a question for question ${questionNum}`}
                type="text"
                className={`flex-auto min-w-5 text-xl border-b-2 custom-text dark:d-text custom-interactive-input mx-3 my-1 ${isReduceMotion ? "" : "transition-colors"} ${question.trim() === "" ? "custom-err-border" : "border-black dark:border-white "}`}
                value={question}
                placeholder="Enter a question"
                onInput={e => handleOnChangeQuestion(e.target.value)}
              />
              <button 
                aria-label={`Delete question ${questionNum}`}
                onClick={() => onDelete(id)} 
                className={`shrink-0 p-1.5 rounded-lg custom-interactive-btn m-1 hidden md:flex ${isReduceMotion ? "" : "transition-colors"}`}
              >
                <Image
                  src={TrashIcon}
                  alt="Trash icon"
                  width={30 * fontSizeMultiplier}
                  height={"auto"}
                  className={`pointer-events-none dark:d-white-filter ${isReduceMotion ? "" : "transition"}`}
                />
              </button>
            </>
            :
            <h2 className={`text-xl custom-text dark:d-text ${isReduceMotion ? "" : "transition-colors"}`}>
              {question.trim() === "" ? `Q${questionNum}. (empty question)` : `Q${questionNum}. ${question}`}{isRequired ? <font className="custom-red dark:d-custom-red mr-1"> *</font> : <></>}
            </h2>
          }
        </div>
        {isEditMode ?
          <button 
            aria-label={`Delete question ${questionNum}`}
            onClick={() => onDelete(id)} 
            className={`p-1.5 rounded-lg custom-interactive-btn m-1 flex self-end md:hidden ${isReduceMotion ? "" : "transition-colors"}`}
          >
            <Image
              src={TrashIcon}
              alt="Trash icon"
              width={30 * fontSizeMultiplier}
              height={"auto"}
              className={`pointer-events-none dark:d-white-filter ${isReduceMotion ? "" : "transition"}`}
            />
          </button>
          :
          <></>
        }
        {/* Options section for required question and file upload */}
        {isEditMode ? 
          <>
          <div className={`text-sm mb-4 over custom-text dark:d-text ${isReduceMotion ? "" : "transition-colors"}`}>Settings:</div>
          <div className="px-4 mb-4 overflow-auto">
            <CheckboxOption 
              label={"Required question:"} 
              currentValue={isRequired} 
              onClick={() => onChangeQuestionData({...questionData, isRequired: !isRequired})}
            />
            <div className="flex px-2 py-1 items-center min-h-8">
              <label htmlFor={attId} className={`text-sm mr-2 custom-text dark:d-text `}>Attachment: </label>
              <form ref={formRef} onSubmit={e => e.preventDefault()} className="flex items-center">
                {file != null ? 
                  <>
                    {fileData?.fileLink ?
                      <a 
                        aria-label={`Download ${fileData.fileName}`}
                        href={fileData.fileLink} 
                        target="_blank" 
                        rel="noreferrer noopener" 
                        className={`text-sm break-words custom-link`}
                        >
                          {fileData.fileName}
                      </a>
                      :
                      <p className={`text-sm break-words`}>
                        {fileData.fileName}
                      </p>
                    }
                    <button 
                      aria-label="Remove currently attached file"
                      onClick={handleOnClearFile}
                      className={`shrink-0 ml-2 p-0.5 rounded-md custom-interactive-btn ${file != null ? "flex" : "hidden"} ${isReduceMotion ? "" : "transition-colors"}`}
                    >
                      <Image
                        src={PlusIcon}
                        alt="Delete"
                        width={18 * fontSizeMultiplier}
                        height={"auto"}
                        className="dark:d-white-filter rotate-45 pointer-events-none"
                      />
                    </button>
                  </>
                  :
                  <input
                    aria-label={`Button to upload an attachment for question ${questionNum}`}
                    type="file"
                    id={attId}
                    className={`text-sm custom-text dark:d-text md:max-w-96 rounded-md bg-transparent custom-interactive-input mx-1 ${isReduceMotion ? "" : "transition-colors"}`}
                    onInput={handleOnAddFile}
                  />
                }
              </form>
            </div>
          </div>
          </>
          :
          <></>
        }
        {fileData && !isEditMode ?
          <a 
            aria-label={`Download ${fileData.fileName}`}
            href={fileData.fileLink} 
            target="_blank" 
            rel="noreferrer noopener" 
            className={`mb-5 text-sm break-words custom-link mx-2`}
            >
              {fileData.fileName}
          </a>
          :
          <></>
        }
        <div className="flex justify-between">
          <div className="flex flex-col flex-auto overflow-auto">
            {/* Body of question */}
            {type === TYPE_MULTI ?
              <QMultichoice
                answersObj={answersObj}
                isRequired={isRequired}
                isEditMode={isEditMode}
                errAnsIdxArr={errAnsIdxArr}
                onSelectAnswer={answer => onSelectAnswer(id, answer)}
                onAddAnswer={handleOnAddAnswer}
                onChangeAnswers={handleOnChangeAnswers}
                onDeleteAnswer={handleOnDeleteAnswer}
                applicantAnswer={applicantAnswer}
              />
              : type === TYPE_CHECKBOX ?
              <QCheckbox
                answersObj={answersObj}
                options={options}
                isEditMode={isEditMode}
                errAnsIdxArr={errAnsIdxArr}
                onSelectAnswer={answer => onSelectAnswer(id, answer)}
                onAddAnswer={handleOnAddAnswer}
                onChangeAnswers={handleOnChangeAnswers}
                onChangeOptions={handleOnChangeOptions}
                onDeleteAnswer={handleOnDeleteAnswer}
                applicantAnswer={applicantAnswer}
              />
              : type === TYPE_NUMBER ?
              <QNumber
                options={options}
                isErr={!isEditMode && errMsg}
                isEditMode={isEditMode}
                onSelectAnswer={answer => onSelectAnswer(id, answer)}
                onChangeOptions={handleOnChangeOptions}
                applicantAnswer={applicantAnswer}
              />
              : type === TYPE_TEXT ?
              <QText
                options={options}
                isErr={!isEditMode && errMsg}
                isEditMode={isEditMode}
                onSelectAnswer={answer => onSelectAnswer(id, answer)}
                onChangeOptions={handleOnChangeOptions}
                applicantAnswer={applicantAnswer}
              />
              : type === TYPE_EMAIL ?
              <QEmail
                isErr={!isEditMode && errMsg}
                isEditMode={isEditMode}
                onSelectAnswer={answer => onSelectAnswer(id, answer)}
                applicantAnswer={applicantAnswer}
              />
              : type === TYPE_PHONE ?
              <QPhoneNum
                isErr={!isEditMode && errMsg}
                isEditMode={isEditMode}
                onSelectAnswer={answer => onSelectAnswer(id, answer)}
                applicantAnswer={applicantAnswer}
              />
              : type === TYPE_DATE ?
              <QDate
                options={options}
                isErr={!isEditMode && errMsg}
                isEditMode={isEditMode}
                onSelectAnswer={answer => onSelectAnswer(id, answer)}
                onChangeOptions={handleOnChangeOptions}
                applicantAnswer={applicantAnswer}
              />
              : type === TYPE_FILE ?
              <QFile
                isEditMode={isEditMode}
                onSelectAnswer={answer => onSelectAnswer(id, answer)}
                applicantAnswer={applicantAnswer}
              />
              :
              <></>
            }
            {errMsg ? 
              <div className="flex items-center mx-1 mt-4">
                <ErrTextbox msg={errMsg}/>
              </div> 
              : 
              <></>
            }
          </div>
          {/* Question icon in corner */}
          {fontSizeMultiplier < 1.5 ?
            <div className="shrink-0 ml-4 p-1.5 m-1 hidden lg:flex self-end">
              <Image
                src={
                  type === TYPE_MULTI ? MultichoiceIcon : 
                  type === TYPE_CHECKBOX ? CheckboxIcon : 
                  type === TYPE_TEXT ? TextIcon :
                  type === TYPE_NUMBER ? NumberIcon :
                  type === TYPE_EMAIL ? EmailIcon :
                  type === TYPE_PHONE ? PhoneIcon :
                  type === TYPE_DATE ? DateIcon :
                  type === TYPE_FILE ? FileIcon : ""}
                alt={type === TYPE_MULTI ? "Multiple choice type question" : 
                  type === TYPE_CHECKBOX ? "Checkbox type question" : 
                  type === TYPE_TEXT ? "Texbox type question" :
                  type === TYPE_NUMBER ? "Numeric type question" :
                  type === TYPE_EMAIL ? "Email type question" :
                  type === TYPE_PHONE ? "Phone number type question" :
                  type === TYPE_DATE ? "Date type question" :
                  type === TYPE_FILE ? "File upload type question" : ""}
                width={30 * fontSizeMultiplier}
                height={"auto"}
                className="pointer-events-none opacity-40 dark:opacity-30 dark:d-white-filter"
              />
            </div>
            :
            <></>
          }
        </div>
      </div>
    </div>
  )
}

export default QuestionBase;