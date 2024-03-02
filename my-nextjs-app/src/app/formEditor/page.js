'use client'
import AccessibilityBar from "@/components/AccessibilityBar";
import FormComponent from "@/components/GrantForm/FormComponent";
import QuestionBase from "@/components/GrantForm/QuestionBase";
import ToolboxCard from "@/components/GrantForm/SmallComponents/ToolboxCard";
import Toolbox from "@/components/GrantForm/Toolbox";
import FontSizeContext from "@/components/utils/FontSizeContext";
import ReducedMotionContext from "@/components/utils/ReducedMotionContext";
import { getTheme, initTheme } from "@/components/utils/theme";
import { DndContext, DragOverlay, closestCenter, useDraggable} from "@dnd-kit/core";
import { restrictToFirstScrollableAncestor, restrictToParentElement, restrictToWindowEdges } from "@dnd-kit/modifiers";
import { SortableContext, arrayMove, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { useContext, useEffect, useId, useMemo, useState } from "react";
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

const FormEditor = () => {
  const [lightTheme, setLightTheme] = useState(getTheme() === 'light')
  const [fontSize, setFontSize] = useState(100)  // Default font size is 100
  const [isReduceMotion, setIsReduceMotion] = useState(false)
  const [questionData, setQuestionData] = useState(null);
  const [activeQuestion, setActiveQuestion] = useState(null);
  const [newDraggedObj, setNewDraggedObj] = useState(null);
  const [isEditMode, setIsEditMode] = useState(true);
  const [isToolboxDisabled, setIsToolboxDisabled] = useState(false);

  const {setNodeRef} = useDraggable({ id: "questionPanel"});

  // Load data into form
  useEffect(() => {
    const allData = [];
    for (let question of testbody) {
      //question = {...question, id: uuidv4(), errMsgArr: []}
      question = {...question, id: uuidv4()}
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

  // const handleOnDragStart = ({active, data}) => {
  //   setIsToolboxDisabled(true); 
  //   setActiveQuestion(() => {
  //     const oldIdx = questionData.findIndex(q => q.id === active.id);
  //     if (oldIdx !== -1) return questionData[oldIdx];
  //     const type = active.data?.current?.type;
  //     let newQuestion = {
  //       id: uuidv4(),
  //       question: "",
  //       type: type,
  //       errMsgArr: [],
  //       isRequired: false,
  //       file: null,
  //     }
  //     if (type === process.env.NEXT_PUBLIC_TYPE_MULTI || type === process.env.NEXT_PUBLIC_TYPE_CHECKBOX) {
  //       newQuestion = {...newQuestion, 
  //         answersObj: [{answer: "", id: uuidv4()}],
  //         errEmptyAnsIdxArr: [0], 
  //         errDupAnsIdxArr: []
  //       }
  //     }
  //     return newQuestion;
  //   })
  // }

  const clearStates = () => {
    setIsToolboxDisabled(false);
    setNewDraggedObj(null);
    setActiveQuestion(null);
  }

  const handleOuterDragStart = ({active}) => {
    setIsToolboxDisabled(true);
    setNewDraggedObj(active.data?.current);
  }

  const handleOuterDragEnd = ({active, over}) => {
    clearStates();
  }

  const handleOnDragStart = ({active}) => {
    setIsToolboxDisabled(true); 
    setActiveQuestion(() => {
      const oldIdx = questionData.findIndex(q => q.id === active.id);
      if (oldIdx !== -1) return questionData[oldIdx];
      return null;
    })
  }

  const handleOnDragEnd = ({active, over}) => {
    const type = active.data?.current?.type;
    const questionNum = active.data?.current?.questionNum;
    if (type && (!questionData.length || questionData.length === 0)) handleOnClickAddQuestion(type);
    else if (questionNum !== undefined) {
      setQuestionData(prev => {
        const oldIdx = prev.findIndex(q => q.id === active.id);
        const newIdx = prev.findIndex(q => q.id === over.id);
        return arrayMove(prev, oldIdx, newIdx);
      });
    }
    clearStates();
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

  const handleOnChangePosition = (questionId, posChange) => {
    const questionIdx = questionData.findIndex(q => q.id === questionId);
    if (questionIdx === 0 && posChange === -1) return;
    if (questionIdx === questionData.length - 1 && posChange === 1) return;
    setQuestionData(prev => arrayMove(prev, questionIdx, questionIdx + posChange));
  }

  const questionIds = useMemo(() => questionData ? questionData.map(q => q.id) : [], [questionData]);
 
  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <AccessibilityBar onChangeTheme={curTheme => setLightTheme(curTheme)} />
      <FormComponent/>
    </div>
  )
}

export default FormEditor;