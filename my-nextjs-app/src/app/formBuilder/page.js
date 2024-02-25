'use client'
import QuestionBase from "@/components/GrantForm/QuestionBase";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from 'uuid';

const testbody = [{
  question: "Do you have a driver's license?",
  type: "multiple choice",
  answers: ["Yes", "No"],
  isRequired: true
},
{
  question: "Do you have a driver's license 2?",
  type: "multiple choice",
  answers: ["Yes", "No"],
  isRequired: false
}]


export default function FormBuilder() {
  const [questionData, setQuestionData] = useState();

  useEffect(() => {
    setQuestionData(testbody.map(q => ({...q, id: uuidv4()})))
  }, []);

  const handleOnChangeQuestionData = (questionId, newQuestionData) => {
    setQuestionData(prev => prev.map(q => q.id === questionId ? newQuestionData : q));
  }

  const handleOnDeleteQuestion = (questionId) => {
    setQuestionData(prev => prev.filter(q => q.id !== questionId));
  }

  return questionData?.map(q => 
    <div key={q.id} className="custom-questioncard-background dark:d-custom-questioncard-background p-5 m-5 rounded-xl ">
      <QuestionBase 
        questionData={q} 
        isEditMode={false}
        onChangeQuestionData={newData => handleOnChangeQuestionData(q.id, newData)}
        onDelete={handleOnDeleteQuestion}
        onSelectAnswer={answer => console.log(`${q.question}: ${answer}`)}
      />
    </div>

  )
}