'use client'
import QuestionBase from "@/components/GrantForm/QuestionBase";
import ToolboxCard from "@/components/GrantForm/SmallComponents/ToolboxCard";
import Toolbox from "@/components/GrantForm/Toolbox";
import FontSizeContext from "@/components/utils/FontSizeContext";
import ReducedMotionContext from "@/components/utils/ReducedMotionContext";
import Image from "next/image";
import UndoIcon from "@/../public/undo.svg";
import EditIcon from "@/../public/edit.svg";
import SaveIcon from "@/../public/save.svg";
import EyeIcon from "@/../public/password-eye.svg"
import { DndContext, DragOverlay, rectIntersection, useDroppable} from "@dnd-kit/core";
import { SortableContext, arrayMove, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { useContext, useEffect, useMemo, useState } from "react";
import { v4 as uuidv4 } from 'uuid';

const testbody = [
  {
    question: "What's your name?",
    type: process.env.NEXT_PUBLIC_TYPE_TEXT,
    errMsgArr: ["Example of error"],
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
  },
  {
    question: "What's your education time?",
    type: process.env.NEXT_PUBLIC_TYPE_DATE,
    options:
    {
      isDateRange: true,
      isBothRequired: false,
    }
  },
  {
    question: "What's your phone number?",
    type: process.env.NEXT_PUBLIC_TYPE_PHONE,
  },
  {
    question: "What's your email?",
    type: process.env.NEXT_PUBLIC_TYPE_EMAIL,
  },
  {
    question: "Do you have a driver's license?",
    type: process.env.NEXT_PUBLIC_TYPE_MULTI,
    answers: ["Yes", "No"],
    isRequired: true,
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
  },
  {
    question: "Enter your age:",
    type: process.env.NEXT_PUBLIC_TYPE_NUMBER,
    options:
    {
      isIntegerOnly: false,
      minNum: 0,
    }
  }
]

const FormComponent = () => {
  const fontSize = useContext(FontSizeContext);
  const isReduceMotion = useContext(ReducedMotionContext);
  const [questionData, setQuestionData] = useState(null);
  const [activeQuestion, setActiveQuestion] = useState(null);
  const [newDraggedObj, setNewDraggedObj] = useState(null);
  const [isEditMode, setIsEditMode] = useState(true);
  const [isToolboxDisabled, setIsToolboxDisabled] = useState(false);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [tempIdx, setTempIdx] = useState([-1, -1]);

  const questionPanelRef = useDroppable({ id: "questionPanel"});

  const largeFontSize = 140;
  const deltaXToAdd = 240;

  // Load data into form
  // useEffect(() => {
  //   const allData = [];
  //   for (let question of testbody) {
  //     //question = {...question, id: uuidv4(), errMsgArr: []}
  //     question = {...question, id: uuidv4()}
  //     if (question.answers) question = {...question, answersObj: question.answers.map(a => ({answer: a, id: uuidv4()}))}
  //     allData.push(question);
  //   }
  //   setQuestionData(allData);
  // }, []);

  const getNewQuestionObj = (type) => {
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
    return newQuestion;
  }

  const tempObj = {...getNewQuestionObj("multiple choice"), isTemp: true}

  const handleOnQuit = () => {
    // TODO: Send user back to their forms when clicked Quit
    console.log("Aye where you goin? Quitting doesn't work");
  }

  const handleOnSave = () => {
    // TODO: Do save and make request
    console.log("Congratulations. You clicked the save button. Way to go. This button doesn't work btw.");
  }

  const handleOnClickAddQuestion = (type) => {
    const newQuestion = getNewQuestionObj(type);
    if (questionData != null) setQuestionData([...questionData, newQuestion]);
    else setQuestionData([newQuestion]);
  }

  // ---------------- Drag handlers ----------------

  const clearStates = () => {
    setIsToolboxDisabled(false);
    setNewDraggedObj(null);
    setActiveQuestion(null);
  }

  const clearTemp = () => {
    setQuestionData(prev => {
      if (!prev) return null;
      return prev.filter(q => !q.isTemp);
    });
    setTempIdx([-1, -1]);
  }

  const handleOnDragStart = ({active}) => {
    setIsToolboxDisabled(true);
    setNewDraggedObj(active.data?.current);

    setActiveQuestion(() => {
      if (questionData == null) return null;
      const oldIdx = questionData.findIndex(q => q.id === active.id);
      if (oldIdx !== -1) return questionData[oldIdx];
      return null;
    });

  }

  const handleOnDragMove = ({active, over, delta}) => {
    const activeCont = active.data?.current?.cont;
    const overId = over?.id;
    setIsAddingNew(delta.x >= deltaXToAdd);

    // For dragging from toolbox
    if (activeCont === "toolbox") {
      if (delta.x < deltaXToAdd && newDraggedObj) return clearTemp();
      if (questionData == null || questionData.length === 0) return setQuestionData([tempObj]);
      if (questionData.filter(q => q.isTemp).length === 0) return setQuestionData([...questionData, tempObj]);
      const newTempIdx = questionData.findIndex(q => q.id === overId);
      if (newTempIdx !== tempIdx[1]) return setTempIdx([tempIdx[1], newTempIdx]);
    }
  }

  const handleOnDragEnd = ({active, over, delta}) => {
    const type = active.data?.current?.type;
    const activeCont = active.data?.current?.cont;

    if (activeCont === "questionPanel") {
      setQuestionData(prev => {
        const oldIdx = prev.findIndex(q => q.id === active.id);
        const newIdx = prev.findIndex(q => q.id === over.id);
        return arrayMove(prev, oldIdx, newIdx);
      });
    }

    if (activeCont === "toolbox") {
      if (questionData && questionData.length === 1 && questionData[0].isTemp && delta.x >= deltaXToAdd) handleOnClickAddQuestion(type);
      else if (tempIdx[1] !== -1) {
        const newQuestion = getNewQuestionObj(type);
        setQuestionData(prev => [...prev.slice(0, tempIdx[1]), newQuestion, ...prev.slice(tempIdx[1])]);
      }
    }
    clearStates();
    clearTemp();
  }

  useEffect(() => {
    if (tempIdx[0] === -1 && tempIdx[1] === -1) return;
    setQuestionData(prev => {
      if (!prev) return [];
      return arrayMove(prev, tempIdx[0], tempIdx[1]);
    });
  }, [tempIdx])

  // ---------------- Question handlers ---------------- 

  const handleOnChangeQuestionData = (questionId, newQuestionData) => {
    setQuestionData(prev => prev.map(q => q.id === questionId ? newQuestionData : q));
  }

  const handleOnDeleteQuestion = (questionId) => {
    setQuestionData(prev => prev.filter(q => q.id !== questionId));
  }

  const handleOnSelectAnswer = (questionID, answer) => {
    //console.log("answer: " + answer);
    // TODO: Store answer that applicant chooses for final version
  }

  const handleOnChangePosition = (questionId, posChange) => {
    const questionIdx = questionData.findIndex(q => q.id === questionId);
    if (questionIdx === 0 && posChange === -1) return;
    if (questionIdx === questionData.length - 1 && posChange === 1) return;
    setQuestionData(prev => arrayMove(prev, questionIdx, questionIdx + posChange));
  }

  const questionIds = useMemo(() => questionData ? questionData.map(q => q.id) : [], [questionData]);

  const restrictToVerticalAxisAndWindowEdges = ({transform, draggingNodeRect, windowRect}) => {
    const value = {...transform};
    if (!draggingNodeRect || !windowRect) return transform;
    
    if (draggingNodeRect.left + transform.x <= windowRect.left) value.x = windowRect.left - draggingNodeRect.left;
    else if (draggingNodeRect.right + transform.x >= windowRect.left + windowRect.width) value.x = windowRect.left + windowRect.width - draggingNodeRect.right;

    return value;
  }

  return (
    <DndContext
      collisionDetection={rectIntersection}
      onDragStart={handleOnDragStart}
      onDragMove={handleOnDragMove}
      onDragEnd={handleOnDragEnd}
      onDragCancel={clearStates}
      modifiers={[restrictToVerticalAxisAndWindowEdges]}
    >
      {/* Header for title and save, exit, view buttons */}
      <div className={`flex items-center sticky top-0 z-30 justify-between h-fit overflow-auto px-2.5 custom-questioncard-background`}>
        <button 
          onClick={handleOnQuit}
          className="flex min-w-fit rounded custom-interactive-btn px-2 py-1"
        >
          <Image
            src={UndoIcon}
            alt="Quit"
            width={22 * fontSize / 100}
            height={"auto"}
            className="dark:d-white-filter rotate-[30deg]"
          />
          <div className="ml-3 text-xl custom-text dark:d-text">Quit</div>
        </button>
        <div className="flex-grow text-center mx-8 text-2xl custom-text dark:d-text">
          Da Best Form in Da World
        </div>
        <div className="min-w-fit flex flex-col justify-between">
          <button 
            onClick={handleOnSave}
            className="flex rounded custom-interactive-btn px-2 py-1"
          >
            <Image
              src={SaveIcon}
              alt="Quit"
              width={22 * fontSize / 100}
              height={"auto"}
              className="dark:d-white-filter"
            />
            <div className="ml-3 text-xl custom-text dark:d-text">Save</div>
          </button>
          <button 
            onClick={() => setIsEditMode(!isEditMode)}
            className="flex rounded custom-interactive-btn px-2 py-1"
          >
            <Image
              src={isEditMode ? EyeIcon : EditIcon}
              alt="Quit"
              width={22 * fontSize / 100}
              height={"auto"}
              className="dark:d-white-filter"
            />
            <div className="ml-3 text-xl custom-text dark:d-text">{isEditMode ? "View" : "Edit"}</div>
          </button>
        </div>
      </div>
      <div className={`${fontSize > largeFontSize ? "flex-col" : "flex flex-col lg:flex-row"} flex-grow bg-transparent`}>
        <div className={`${fontSize > largeFontSize || !isEditMode ? "" : "lg:flex sticky top-20"} hidden h-fit max-h-[90vh] px-3 py-5 pb-0 m-3 rounded-xl border-4 border-transparent overflow-auto flex-col lg:max-w-xs xl:max-w-sm custom-questioncard-background ${isToolboxDisabled ? "opacity-30" : ""} ${isReduceMotion ? "" : "transition"}`}>
          <Toolbox onClickAdd={handleOnClickAddQuestion}/>
        </div>
        <SortableContext
          items={questionIds}
          strategy={verticalListSortingStrategy}
        >
          <div 
            className={`flex flex-col max-w-full flex-auto p-2.5 pb-0 max-h-screen overflow-auto ${isReduceMotion ? "" : "transition"}`} 
            ref={questionPanelRef.setNodeRef}
          >
            {questionData?.map((q, i) => 
              <QuestionBase 
                key={q.id}
                questionData={q} 
                questionNum={i + 1}
                isEditMode={isEditMode}
                isLastQuestion={i === questionData.length - 1}
                onChangeQuestionData={newData => handleOnChangeQuestionData(q.id, newData)}
                onDelete={handleOnDeleteQuestion}
                onSelectAnswer={answer => handleOnSelectAnswer(q.id, answer)}
                onChangePosition={posChange => handleOnChangePosition(q.id, posChange)}
              />
            )}
            {!questionData || questionData.length === 0 ?
              <div className="flex m-20 self-center text-3xl font-bold custom-text dark:d-text text-center opacity-50 whitespace-pre-wrap">
                {!questionData ? 
                  "Use the toolbox to start creating your application form!\n\n\nClick the + icons to start adding questions!" 
                  : 
                  "You trynna give people an empty application to fill out?\n\n\nAdd your questions here now."
                }
              </div>
              :
              <div className="text-center my-20 text-3xl font-bold custom-text dark:d-text opacity-50">End of form</div>
            }
          </div>
        </SortableContext>
        <DragOverlay zIndex={100} dropAnimation={{
            duration: isReduceMotion || isAddingNew ? 0 : 250
          }}
        >
          {activeQuestion ? 
            <div className="overflow-visible">
              <QuestionBase 
                questionData={activeQuestion} 
                isEditMode={true}
                questionNum={null}
                onChangeQuestionData={null}
                onDelete={null}
                onSelectAnswer={null}
              /> 
            </div>
            : newDraggedObj ?
            <div className="custom-questioncard-background rounded-lg transition-none">
              <ToolboxCard 
                title={newDraggedObj.title}
                type={newDraggedObj.type}
                desc={newDraggedObj.desc}
                icon={newDraggedObj.icon}
              />
            </div>
            :
            null
          }
        </DragOverlay>
        <div className={`${!isEditMode ? "hidden" : fontSize <= largeFontSize ? "lg:hidden" : ""} flex sticky max-h-[10vh]bottom-0 items-center w-screen p-3 my-3 overflow-auto custom-questioncard-background ${isReduceMotion ? "" : "transition"}`}>
          <Toolbox isSmallVersion={true} onClickAdd={handleOnClickAddQuestion}/>
        </div>
      </div>
    </DndContext>
  )
}

export default FormComponent;