import Image from "next/image";
import TrashIcon from "@/../public/trash-icon.svg"
import { useContext } from "react";
import FontSizeContext from "@/components/utils/FontSizeContext";
import QMultichoice from "./QMultichoice";
import ReducedMotionContext from "../utils/ReducedMotionContext";
import CheckboxSetting from "./SmallComponents/CheckboxSetting";

const QuestionBase = ({questionData, isEditMode, onSelectAnswer, onChangeQuestionData, onDelete}) => {
  const fontSizeMultiplier = useContext(FontSizeContext) / 100;
  const isReduceMotion = useContext(ReducedMotionContext);

  const {id, question, type, answers, isRequired} = questionData;

  const handleOnChangeQuestion = (newQuestion) => {
    onChangeQuestionData({...questionData, question: newQuestion});
  }

  const handleOnChangeAnswers = (newAnswers) => {
    onChangeQuestionData({...questionData, answers: newAnswers});
  }

  return (
    <>
      <div className={`flex mb-5 items-center`}>
        {isEditMode ?
          <>
            <input 
              type="text"
              className={`flex-auto min-w-5 text-2xl bg-transparent border-b border-black dark:border-white text-black dark:text-white hover:custom-hover-white dark:hover:d-custom-hover-black focus:bg-transparent dark:focus:bg-transparent ${isReduceMotion ? "" : "transition-colors"}`}
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
          <div className="mb-2 px-3">Settings:</div>
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
          onSelectAnswer={onSelectAnswer}
          onChangeAnswers={handleOnChangeAnswers}
          onDelete={() => onDelete(id)}
        />
        :
        <></>
      }
    </>
  )
}

export default QuestionBase;