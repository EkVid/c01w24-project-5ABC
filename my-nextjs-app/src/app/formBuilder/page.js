'use client'
import QuestionBase from "@/components/GrantForm/QuestionBase";
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
    }
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
  const [questionData, setQuestionData] = useState();
  const [isEditMode, setIsEditMode] = useState(true);

  useEffect(() => {
    setQuestionData(testbody.map(q => ({...q, id: uuidv4()})));
  }, []);

  // useEffect(() => {
  //   console.log(questionData);
  // }, [questionData]);

  const handleOnChangeQuestionData = (questionId, newQuestionData) => {
    setQuestionData(prev => prev.map(q => q.id === questionId ? newQuestionData : q));
  }

  const handleOnDeleteQuestion = (questionId) => {
    setQuestionData(prev => prev.filter(q => q.id !== questionId));
  }

  return (
    <>
      <button onClick={() => setIsEditMode(prev => !prev)}>Change isEditMode</button>
      {questionData?.map(q => 
        <div key={q.id} className={`flex flex-col custom-questioncard-background dark:d-custom-questioncard-background p-5 m-5 rounded-xl border-4 ${q.errMsgArr && q.errMsgArr.length > 0 ? "custom-err-border" : "custom-questioncard-border dark:d-custom-questioncard-border"}`}>
          <QuestionBase 
            questionData={q} 
            isEditMode={isEditMode}
            onChangeQuestionData={newData => handleOnChangeQuestionData(q.id, newData)}
            onDelete={handleOnDeleteQuestion}
            onSelectAnswer={answer => console.log(`${q.question}: ${answer}`)}
          />
        </div>
      )}
    </>
    
  )
}