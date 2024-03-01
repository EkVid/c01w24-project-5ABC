'use client'
import QuestionBase from "@/components/GrantForm/QuestionBase";
import Toolbox from "@/components/GrantForm/Toolbox";
import ReducedMotionContext from "@/components/utils/ReducedMotionContext";
import { DndContext, DragOverlay, MouseSensor, TouchSensor, closestCenter, closestCorners, rectIntersection, useDraggable, useDroppable, useSensor } from "@dnd-kit/core";
import { restrictToWindowEdges } from "@dnd-kit/modifiers";
import { SortableContext, arrayMove, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { useContext, useEffect, useMemo, useState } from "react";
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
  const isReduceMotion = useContext(ReducedMotionContext);
  const [questionData, setQuestionData] = useState(null);
  const [activeId, setActiveId] = useState(null);
  const [isEditMode, setIsEditMode] = useState(true);
  const [isToolboxDisabled, setIsToolboxDisabled] = useState(false);
  const {setNodeRef} = useDraggable({ id: "questionPanel"});

  // Load data into form
  useEffect(() => {
    const allData = [];
    for (let question of testbody) {
      question = {...question, id: uuidv4(), errMsgArr: []}
      if (question.answers) question = {...question, answersObj: question.answers.map(a => ({answer: a, id: uuidv4()}))}
      allData.push(question);
    }
    setQuestionData(allData);
  }, []);

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

  // ---------------- Drag handlers ----------------

  const handleOnDragStart = ({active}) => {
    setIsToolboxDisabled(true); 
    setActiveId(active.id);
  }

  const handleOnDragEnd = ({active, over, data}) => {
    const type = data?.type;
    const currentIdx = active.data?.current?.index;
    if (type && (!questionData.length || questionData.length === 0)) handleOnClickAddQuestion(type);
    else if (currentIdx !== undefined) {
      setQuestionData(prev => {
        const oldIdx = prev.findIndex(q => q.id === active.id);
        const newIdx = prev.findIndex(q => q.id === over.id);
        return arrayMove(prev, oldIdx, newIdx);
      });
    }
    setIsToolboxDisabled(false);
    setActiveId(null);
  }

  const handleOnDragCancel = () => {
    setIsToolboxDisabled(false);
    setActiveId(null);
  }

  // ---------------- Question handlers ---------------- 

  const handleOnChangeQuestionData = (questionId, newQuestionData) => {
    setQuestionData(prev => prev.map(q => q.id === questionId ? newQuestionData : q));
  }

  const handleOnDeleteQuestion = (questionId) => {
    setQuestionData(prev => prev.filter(q => q.id !== questionId));
  }

  const handleOnSelectAnswer = (questionID, answer) => {
    //console.log("answer: " + answer);
  }

  const questionIds = useMemo(() => questionData ? questionData.map(q => q.id) : [], [questionData]);
 
  return (
    <DndContext
      collisionDetection={closestCenter}
      onDragStart={handleOnDragStart}
      onDragEnd={handleOnDragEnd}
      onDragCancel={handleOnDragCancel}
      modifiers={[restrictToWindowEdges]}
    >
      <SortableContext
        id="questionPanel"
        items={questionIds}
        strategy={verticalListSortingStrategy}
      >
        <button onClick={() => setIsEditMode(prev => !prev)}>Change isEditMode</button>
        <div className="flex bg-transparent">
          <div className={`${isEditMode ? "lg:flex sticky top-5" : ""} hidden h-fit p-5 ml-5 my-5 rounded-xl border-4 max-h-[95vh] overflow-auto overscroll-none flex-col max-w-sm custom-questioncard-background ${isToolboxDisabled ? "opacity-30" : ""} ${isReduceMotion ? "" : "transition ease-out"}`}>
            <Toolbox onClickAdd={handleOnClickAddQuestion}/>
          </div>
          <div className={`flex flex-col max-w-full flex-auto p-5`} ref={setNodeRef}>
            {questionData?.map((q, i) => 
              <QuestionBase 
                key={q.id}
                questionData={q} 
                questionIdx={i}
                isEditMode={isEditMode}
                isLastQuestion={i === questionData.length - 1}
                onChangeQuestionData={newData => handleOnChangeQuestionData(q.id, newData)}
                onDelete={handleOnDeleteQuestion}
                onSelectAnswer={answer => handleOnSelectAnswer(q.id, answer)}
              />
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
            <DragOverlay>
              {activeId ? <div className="flex">THis is diplsay</div> : null}
            </DragOverlay>
          </div>
        </div>
      </SortableContext>
    </DndContext>
    
  )
}