'use client'
import QuestionBase from "@/components/GrantForm/QuestionBase";
import Toolbox from "@/components/GrantForm/Toolbox";
import { DndContext, MouseSensor, TouchSensor, useSensor } from "@dnd-kit/core";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from 'uuid';

const testbody = [
  {
    question: "What's your name?",
    type: process.env.NEXT_PUBLIC_TYPE_TEXT,
    errMsgArr: ["Invaldi ererif here"],
    options:
    {
      isMultipleLines: true,
      minCharsNum: 3,
      maxCharsNum: null,
    },
    curFile: {name: "notactualfile.txt"},
    isCurFileDeleting: false,
  },
  {
    question: "Any attachments?",
    type: process.env.NEXT_PUBLIC_TYPE_FILE,
    errMsgArr: ["Invaldi file error here"],
  },
  {
    question: "What's your education time?",
    type: process.env.NEXT_PUBLIC_TYPE_DATE,
    errMsgArr: ["Invaldi date error here"],
    options:
    {
      isDateRange: true,
      isBothRequired: false,
    }
  },
  {
    question: "What's your phone number?",
    type: process.env.NEXT_PUBLIC_TYPE_PHONE,
    errMsgArr: ["phone neu error"]
  },
  {
    question: "What's your email?",
    type: process.env.NEXT_PUBLIC_TYPE_EMAIL,
    errMsgArr: ["email error"]
  },
  {
    question: "Do you have a driver's license?",
    type: process.env.NEXT_PUBLIC_TYPE_MULTI,
    answers: ["Yes", "No"],
    isRequired: true,
    errMsgArr: null,
    errEmptyAnsIdxArr: [],
    errDupAnsIdxArr: []
  },
  {
    question: "Select all that apply",
    type: process.env.NEXT_PUBLIC_TYPE_CHECKBOX,
    answers: ["Tall", "Smol", "Wide", "Thinn"],
    isRequired: false,
    errMsgArr: ["eerror 1", "erro2"],
    options:
    {
      isAllAnOption: false,
      isNoneAnOption: false
    }
  },
  {
    question: "Enter your age:",
    type: process.env.NEXT_PUBLIC_TYPE_NUMBER,
    errMsgArr: ['rr'],
    options:
    {
      isIntegerOnly: false,
      minNum: 0,
    }
  }
]


export default function FormBuilder() {
  const [questionData, setQuestionData] = useState(null);
  const [isEditMode, setIsEditMode] = useState(true);

  // Load data into form
  // useEffect(() => {
  //   const allData = [];
  //   for (let question of testbody) {
  //     question = {...question, id: uuidv4(), errMsgArr: []}
  //     if (question.answers) question = {...question, answersObj: question.answers.map(a => ({answer: a, id: uuidv4()}))}
  //     allData.push(question);
  //   }
  //   setQuestionData(allData);
  // }, []);

  const handleOnClickAddQuestion = (type) => {
    let newQuestion = {
      id: uuidv4(),
      question: "",
      type: type,
      errMsgArr: [],
      isRequired: false,
      file: null,
    }
    if (type === process.env.NEXT_PUBLIC_TYPE_MULTI || type === process.env.NEXT_PUBLIC_TYPE_CHECKBOX) {
      newQuestion = {...newQuestion, 
        answersObj: [{answer: "", id: uuidv4()}],
        errEmptyAnsIdxArr: [0], 
        errDupAnsIdxArr: []
      }
    }
    if (questionData != null) setQuestionData([...questionData, newQuestion]);
    else setQuestionData([newQuestion]);
  }

  const handleOnChangeQuestionData = (questionId, newQuestionData) => {
    setQuestionData(prev => prev.map(q => q.id === questionId ? newQuestionData : q));
  }

  const handleOnDeleteQuestion = (questionId) => {
    setQuestionData(prev => prev.filter(q => q.id !== questionId));
  }

  const handleOnSelectAnswer = (questionID, answer) => {
    //console.log("answer: " + answer);
  }

  return (
    <>
      <button onClick={() => setIsEditMode(prev => !prev)}>Change isEditMode</button>
      <div className="flex">
        <div className={`${isEditMode ? "lg:flex sticky top-5" : ""} hidden h-fit p-5 ml-5 my-5 rounded-xl border-4 max-h-[95vh] overflow-auto flex-col max-w-sm custom-questioncard-background dark:d-custom-questioncard-background custom-questioncard-border dark:d-custom-questioncard-border`}>
          <Toolbox onClickAdd={handleOnClickAddQuestion}/>
        </div>
        <div className={`flex flex-col flex-auto`}>
          {questionData?.map(q => 
            <div key={q.id} className={`flex flex-col custom-questioncard-background dark:d-custom-questioncard-background p-5 m-5 rounded-xl border-4 ${q.errMsgArr && q.errMsgArr.length > 0 ? "custom-err-border" : "custom-questioncard-border dark:d-custom-questioncard-border"}`}>
              <QuestionBase 
                questionData={q} 
                isEditMode={isEditMode}
                onChangeQuestionData={newData => handleOnChangeQuestionData(q.id, newData)}
                onDelete={handleOnDeleteQuestion}
                onSelectAnswer={answer => handleOnSelectAnswer(q.id, answer)}
              />
            </div>
          )}
          {!questionData || questionData.length === 0 ?
            <div className="flex m-20 self-center text-3xl font-bold custom-text dark:d-text text-center opacity-50 whitespace-pre-wrap">
              {!questionData ? 
                "Use the toolbox to start creating your application form!\n\n\nDrag and drop questions here!" 
                : 
                "You trynna give people an empty application to fill out?\n\n\nAdd your questions back now."
              }
            </div>
            :
            <></>
          }
        </div>
      </div>
    </>
    
  )
}