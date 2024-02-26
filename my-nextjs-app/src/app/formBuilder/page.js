'use client'
import QuestionBase from "@/components/GrantForm/QuestionBase";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from 'uuid';

const testbody = [
  {
    question: "Do you have a driver's license?",
    type: "multiple choice",
    answers: ["Yes", "No"],
    isRequired: true,
    errMsg: null,
    errEmptyAnsIdxArr: [],
    errDupAnsIdxArr: []
  },
  {
    question: "Select all that apply",
    type: process.env.NEXT_PUBLIC_TYPE_CHECKBOX,
    answers: ["Tall", "Smol", "Wide", "Thinn"],
    isRequired: false,
    options:
    {
      isAllAnOption: false,
      isNoneAnOption: false
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
        <div key={q.id} className={`custom-questioncard-background dark:d-custom-questioncard-background p-5 m-5 rounded-xl border-4 custom-questioncard-border dark:d-custom-questioncard-border ${q.errMsg ? "custom-red-border dark:d-custom-red-border" : ""}`}>
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