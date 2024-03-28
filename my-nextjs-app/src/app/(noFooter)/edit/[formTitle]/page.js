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
import EyeIcon from "@/../public/password_eye.svg"
import { DndContext, DragOverlay, rectIntersection, useDroppable} from "@dnd-kit/core";
import { SortableContext, arrayMove, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { useEffect, useMemo, useState } from "react";
import { v4 as uuidv4 } from 'uuid';
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import ThemeContext from "@/components/utils/ThemeContext";
import { getTheme } from "@/components/utils/theme";
import ErrTextbox from "@/components/GrantForm/SmallComponents/ErrTextbox";
import { TYPE_CHECKBOX, TYPE_EMAIL, TYPE_MULTI, TYPE_NUMBER, TYPE_TEXT } from "@/components/utils/constants";

const AccessibilityBar = dynamic(
  () => import("@/components/AccessibilityBar"),
  { ssr: false }
);

const DELTA_X_TO_ADD = 270;
const LARGE_FONT_SIZE = 140;

const NO_QUESTION_MSG = "Add a question\nto preview or\nsave form";
const FIX_ERR_MSG = "Fix all issues\nto save or\npreview form";

export default function EditPage({params}) {
   // Carter: initializing the question data from grant form
   const grant = JSON.parse(localStorage.getItem('grant'))
   const initQuestions = grant ? grant.QuestionData : null

  const [fontSize, setFontSize] = useState(100);
  const [theme, setTheme] = useState(false);
  const [isReducedMotion, setIsReducedMotion] = useState(false);
  const [questionData, setQuestionData] = useState(initQuestions);
  const [activeQuestion, setActiveQuestion] = useState(null);
  const [newDraggedObj, setNewDraggedObj] = useState(null);
  const [isEditMode, setIsEditMode] = useState(true);
  const [isToolboxDisabled, setIsToolboxDisabled] = useState(false);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [isBottomToolboxOpen, setIsBottomToolboxOpen] = useState(true);
  const [cornerMsg, setCornerMsg] = useState(NO_QUESTION_MSG);
  const [tempIdx, setTempIdx] = useState([-1, -1]);
  const title = decodeURI(params.formTitle);

  const questionPanelRef = useDroppable({ id: "questionPanel"});
  const router = useRouter();

  const getNewQuestionObj = (type) => {
    let newQuestion = {
      id: uuidv4(),
      question: "",
      type: type,
      errMsg: null,
      isRequired: false,
      file: null,
      fileData: null,
    }
    if (type === TYPE_MULTI || type === TYPE_CHECKBOX) {
      newQuestion = {...newQuestion, 
        answersObj: [{answer: "", id: uuidv4()}],
        errEmptyAnsIdxArr: [0], 
        errDupAnsIdxArr: []
      }
    }
    return newQuestion;
  }

  const tempObj = {...getNewQuestionObj(TYPE_EMAIL), isTemp: true}

  const handleOnQuit = () => {
    if (questionData && questionData.length > 0) {
      // TODO: Use better looking prompt to prompt grantor if they want to leave
      if(!confirm("Are you sure you want to leave? You will lose any unsaved questions")) return;
    }
    router.back();
  }

  const handleOnSave = () => {
    const errMsgArr = getErrMsgArr();
    setQuestionData(prev => prev.map((q, i) => ({...q, errMsg: errMsgArr[i]})));
    if (errMsgArr.filter(e => e != null).length === 0) {
      // TODO: make request and save form
  
    // Carter: setting the question data into grant form
    const newGrant = {...grant, QuestionData:questionData}
    localStorage.setItem('grant', JSON.stringify(newGrant))
    console.log("Congratulations. You clicked the save button. Way to go. This button doesn't work btw.");
    }
  }

  const handleOnPreview = () => {
    if (!isEditMode) setIsEditMode(true);
    else {
      const errMsgArr = getErrMsgArr();
      setQuestionData(prev => prev.map((q, i) => ({...q, errMsg: errMsgArr[i]})));
      if (errMsgArr.filter(e => e != null).length === 0) setIsEditMode(false);
    }
  }

  const getErrMsgArr = () => {
    const errMsgArr = questionData.map(q => null);
    for (let i = 0; i < questionData.length; i++) {
      const question = questionData[i];
      const type = question.type;
      if (!question.question || !question.question.trim()) {
        errMsgArr[i] = "Question cannot be empty";
        continue;
      }
      if (type === TYPE_MULTI || type === TYPE_CHECKBOX) {
        const errEmptyAnsIdxArr = question.errEmptyAnsIdxArr;
        const errDupAnsIdxArr = question.errDupAnsIdxArr;
        if (errEmptyAnsIdxArr.length > 0) {
          errMsgArr[i] = "No empty answers allowed";
          continue;
        }
        if (errDupAnsIdxArr.length > 0) {
          errMsgArr[i] = "No duplicate answers allowed";
          continue;
        }
      }
      if (type === TYPE_TEXT) {
        const minCharsNum = question.options?.minCharsNum;
        const maxCharsNum = question.options?.maxCharsNum;
        if (minCharsNum && !Number.isSafeInteger(parseFloat(minCharsNum))) {
          errMsgArr[i] = "Minimum character count must be an integer";
          continue;
        }
        if (maxCharsNum && !Number.isSafeInteger(parseFloat(maxCharsNum))) {
          errMsgArr[i] = "Maximum character count must be an integer";
          continue;
        }
        if (minCharsNum && minCharsNum < 1) {
          errMsgArr[i] = "Minimum character count must be empty or at least 1";
          continue;
        }
        if (maxCharsNum && maxCharsNum < 1) {
          errMsgArr[i] = "Maximum character count must be empty or at least 1";
          continue;
        }
        if (minCharsNum && maxCharsNum && parseFloat(minCharsNum) > parseFloat(maxCharsNum)) {
          errMsgArr[i] = "Minimum must be less or equal to maximum character count";
          continue;
        }
      }
      if (type === TYPE_NUMBER) {
        const minNum = question.options?.minNum;
        const maxNum = question.options?.maxNum;
        if (minNum && Number.isNaN(parseFloat(minNum))) {
          errMsgArr[i] = "Minimum must be a number";
          continue;
        }
        if (maxNum && Number.isNaN(parseFloat(maxNum))) {
          errMsgArr[i] = "Maximum must be a number";
          continue;
        }
        if (minNum && maxNum && parseFloat(minNum) > parseFloat(maxNum)) {
          errMsgArr[i] = "Minimum must be less or equal to maximum";
          continue;
        }
      }
    }
    return errMsgArr.map((e, i) => e ? `Q${i + 1} Error: ${e}` : null);
  }

  const handleOnClickAddQuestion = (type) => {
    const newQuestion = getNewQuestionObj(type);
    if (questionData != null) setQuestionData([...questionData, newQuestion]);
    else setQuestionData([newQuestion]);
  }

  useEffect(() => setTheme(getTheme()), []);
  useEffect(() => {
    if (questionData == null || questionData.length === 0) setCornerMsg(NO_QUESTION_MSG);
    else if (questionData.filter(q => q.errMsg).length > 0) setCornerMsg(FIX_ERR_MSG);
    else setCornerMsg(null);
  }, [questionData]);

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
    setNewDraggedObj(active);

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
    setIsAddingNew(delta.x >= DELTA_X_TO_ADD);

    // For dragging from toolbox
    if (activeCont === "toolbox") {
      if (delta.x < DELTA_X_TO_ADD && newDraggedObj) return clearTemp();
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
      if (questionData && questionData.length === 1 && questionData[0].isTemp && delta.x >= DELTA_X_TO_ADD) handleOnClickAddQuestion(type);
      else if (tempIdx[1] !== -1) {
        const newQuestion = getNewQuestionObj(type);
        setQuestionData(prev => [...prev.slice(0, tempIdx[1]), newQuestion, ...prev.slice(tempIdx[1])]);
      }
    }
    clearStates();
    clearTemp();
  }

  useEffect(() => {
    setTimeout(() => {
      if (tempIdx[0] === -1 && tempIdx[1] === -1) return;
      setQuestionData(prev => {
        if (!prev) return [];
        return arrayMove(prev, tempIdx[0], tempIdx[1]);
      });
    }, 50);
    
  }, [tempIdx]);

  // ---------------- Question handlers ---------------- 

  const handleOnChangeQuestionData = (questionId, newQuestionData) => {
    setQuestionData(prev => prev.map(q => q.id === questionId ? {...newQuestionData, errMsg: null} : q));
  }

  const handleOnDeleteQuestion = (questionId) => {
    setQuestionData(prev => prev.filter(q => q.id !== questionId));
  }

  const handleOnChangePosition = (questionId, posChange) => {
    const questionIdx = questionData.findIndex(q => q.id === questionId);
    if (questionIdx === 0 && posChange === -1) return;
    if (questionIdx === questionData.length - 1 && posChange === 1) return;
    setQuestionData(prev => arrayMove(prev, questionIdx, questionIdx + posChange));
  }

  const questionIds = useMemo(() => questionData ? questionData.map(q => q.id) : [], [questionData]);

  // --------------- React DnD Props ----------------

  const restrictToVerticalAxisAndWindowEdges = ({transform, draggingNodeRect, windowRect}) => {
    const value = {...transform};
    if (!draggingNodeRect || !windowRect) return transform;
    
    if (draggingNodeRect.left + transform.x <= windowRect.left) value.x = windowRect.left - draggingNodeRect.left;
    else if (draggingNodeRect.right + transform.x >= windowRect.left + windowRect.width) value.x = windowRect.left + windowRect.width - draggingNodeRect.right;

    return value;
  }

  const announcements = {
    onDragStart({active}) {
      const activeObj = active.data?.current;
      const questionTitle = activeObj?.title;
      const questionNum = activeObj?.questionNum;
      return questionNum ? 
        `Picked up question ${questionNum}: ${questionTitle}. This question is in position ${questionNum} out of ${questionData.length}.` 
        : 
        `Picked up question new question of type ${questionTitle}. Use the right arrow key to move the question into the form.`;
    },
    onDragOver({active, over}) {
      const activeObj = active.data?.current;
      const questionTitle = activeObj?.title;
      const overNum = over?.data?.current?.questionNum ? over.data?.current?.questionNum + 1 : 0;
      const totalNumOfQuestions = questionData ? questionData.length + 1 : 0;
      if (over && activeObj?.cont === "questionPanel") {
        return `Question ${questionTitle} is moved over position ${overNum} of ${totalNumOfQuestions}`;
      }
      else if (totalNumOfQuestions === 0 && isAddingNew) {
        return `New question of type ${questionTitle} is over form and will be first question when dropped.`
      }
      else if (over && over.id !== tempObj.id && isAddingNew) {
        return `New question of type ${questionTitle} is moved over position ${overNum} of ${totalNumOfQuestions - 1}`
      }
    },
    onDragEnd({active, over}) {
      const activeObj = active.data?.current;
      const questionTitle = activeObj?.title;
      const overNum = over?.data?.current?.questionNum ? over.data?.current?.questionNum + 1 : 0;
      const totalNumOfQuestions = questionData ? questionData.length + 1 : 0;
      if (over && activeObj?.cont === "questionPanel") {
        return `Question ${questionTitle} is dropped into position ${overNum} of ${totalNumOfQuestions}`;
      }
      else if (totalNumOfQuestions === 0 && isAddingNew) {
        return `New question of type ${questionTitle} is added to form as first question.`
      }
      else if (over && over.id !== tempObj.id && isAddingNew) {
        return `New question of type ${questionTitle} is added into position ${overNum} of ${totalNumOfQuestions}`
      }
    },
    onDragCancel({active}) {
      const activeObj = active.data?.current;
      const questionTitle = activeObj?.title;
      const questionNum = activeObj?.questionNum;
      return questionNum ? 
        `Dragging was cancelled. Question ${questionNum}: ${questionTitle} was returned to its original position of ${questionNum} out of ${questionData?.length ?? 0}.`
        :
        `Dragging was cancelled. New question of type ${questionTitle} was not added. Form currently has ${questionData?.length ?? 0}`;
    },
  }
 
  return (
    <div className="flex flex-col flex-grow justify-between">
      <FontSizeContext.Provider value={fontSize}>
        <ThemeContext.Provider value={theme === "light"}>
          <ReducedMotionContext.Provider value={isReducedMotion}>
            <DndContext
              id="OuterDnd"
              collisionDetection={rectIntersection}
              onDragStart={handleOnDragStart}
              onDragMove={handleOnDragMove}
              onDragEnd={handleOnDragEnd}
              onDragCancel={clearStates}
              modifiers={[restrictToVerticalAxisAndWindowEdges]}
              accessibility={announcements}
              screenReaderInstructions={"To pick up a question, press space or enter while the drag handle is selected. If a new question drag handle is selected, use the right arrow key to move the question into the form and use the up and down arrows to position the new question. If a pre-existing question has been selected, use the up and down arrow keys to change the position of the question. Press space or enter again to drop the item in its new position, or press escape to cancel."}
            >
              <title>{`${title} Editor`}</title>
              {/* Header for title and save, exit, view buttons */}
              <div className={`flex flex-col sticky top-0 z-30 min-h-fit custom-questioncard-background ${isReducedMotion ? "" : "transition"}`}>
                <AccessibilityBar 
                  onChangeFont={setFontSize}
                  onChangeTheme={setTheme}
                  onChangeMotion={setIsReducedMotion}
                />
                <div className="flex items-center justify-between overflow-auto mx-2">
                  <button 
                    aria-label="Quit"
                    onClick={handleOnQuit}
                    className={`flex shrink-0 min-w-fit items-center rounded custom-interactive-btn m-1 p-2 ${isReducedMotion ? "" : "transition"}`}
                  >
                    <Image
                      src={UndoIcon}
                      alt="Arrow to go back"
                      width={22 * fontSize / 100}
                      height={"auto"}
                      className="dark:d-white-filter rotate-[30deg]"
                      aria-hidden="true"
                    />
                    <p className="ml-3 text-xl custom-text dark:d-text hidden lg:flex">Quit</p>
                  </button>
                  <h1 className="flex-grow text-center mx-3 text-2xl custom-text dark:d-text overflow-auto max-h-20">{title}</h1>
                  <div className="min-w-fit flex items-center">
                    <div className={`min-w-fit flex flex-col ${cornerMsg ? "invisible" : ""}`}>
                      <button 
                        aria-label="Save current questions"
                        onClick={handleOnSave}
                        className={`flex shrink-0 rounded items-center custom-interactive-btn mx-1 mt-1 px-2 py-1 ${isReducedMotion ? "" : "transition"}`}
                      >
                        <Image
                          src={SaveIcon}
                          alt="Floppy disk"
                          width={22 * fontSize / 100}
                          height={"auto"}
                          className="dark:d-white-filter"
                          aria-hidden="true"
                        />
                        <p className="ml-3 text-xl custom-text dark:d-text hidden lg:flex">Save</p>
                      </button>
                      <button 
                        aria-label={isEditMode ? "Preview form" : "Edit form"}
                        onClick={handleOnPreview}
                        className={`flex shrink-0 rounded items-center custom-interactive-btn mx-1 mb-1 px-2 py-1 ${isReducedMotion ? "" : "transition"}`}
                      >
                        <Image
                          src={isEditMode ? EyeIcon : EditIcon}
                          alt={isEditMode ? "Eye" : "Edit"}
                          width={22 * fontSize / 100}
                          height={"auto"}
                          className="dark:d-white-filter"
                          aria-hidden="true"
                        />
                        <p className="ml-3 text-xl custom-text dark:d-text hidden lg:flex">{isEditMode ? "View" : "Edit"}</p>
                      </button>
                    </div>
                    <div className={`items-center ${cornerMsg ? "flex" : "hidden"}`} role="alert" aria-live="assertive">
                      {cornerMsg ? <ErrTextbox msg={cornerMsg}/> : <></>}
                    </div>
                  </div>
                </div>
              </div>
              <div className={`${fontSize > LARGE_FONT_SIZE ? "flex-col" : "flex flex-col lg:flex-row"} flex-auto bg-transparent`}>
                <div className={`${fontSize > LARGE_FONT_SIZE || !isEditMode ? "" : "lg:flex sticky top-32"} hidden h-fit max-h-[85vh] px-3 py-5 pb-0 m-3 rounded-xl border-4 border-transparent overflow-auto flex-col lg:max-w-xs xl:max-w-sm custom-questioncard-background ${isToolboxDisabled ? "opacity-30" : ""} ${isReducedMotion ? "" : "transition"}`}>
                  <Toolbox onClickAdd={handleOnClickAddQuestion} currentNumOfQuestions={questionData?.length ?? 0}/>
                </div>
                <SortableContext
                  items={questionIds}
                  strategy={verticalListSortingStrategy}
                >
                  <div 
                    className={`flex flex-col max-w-full flex-auto p-2.5 pb-0 max-h-full overflow-auto ${isReducedMotion ? "" : "transition"}`} 
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
                        onSelectAnswer={() => {return}}
                        onChangePosition={posChange => handleOnChangePosition(q.id, posChange)}
                        totalNumOfQuestions={questionData?.length ?? 0}
                      />
                    )}
                    {isEditMode ?
                      !questionData || questionData.length === 0 ?
                        <p className={`flex m-20 self-center text-3xl font-bold custom-text dark:d-text text-center opacity-50 whitespace-pre-wrap ${isReducedMotion ? "" : "transition"}`}>
                          {!questionData ? 
                            "Use the toolbox to start creating your application form!\n\n\nClick the + icons to start adding questions!" 
                            : 
                            "You trynna give people an empty application to fill out?\n\n\nAdd your questions here now."
                          }
                        </p>
                        :
                        <p className="text-center my-20 text-3xl font-bold custom-text dark:d-text opacity-50">End of form</p>
                      : !questionData || questionData.length === 0 ?
                        <p className="text-center my-20 text-3xl font-bold custom-text dark:d-text opacity-50">
                          There are no questions to preview
                        </p>
                        :
                        <></>
                    }
                  </div>
                </SortableContext>
                <DragOverlay zIndex={100} dropAnimation={{
                    duration: isReducedMotion || isAddingNew ? 0 : 250
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
                        title={newDraggedObj.data?.current.title}
                        type={newDraggedObj.data?.current.type}
                        desc={newDraggedObj.data?.current.desc}
                        icon={newDraggedObj.data?.current.icon}
                      />
                    </div>
                    :
                    null
                  }
                </DragOverlay>
                <div className={`${!isEditMode ? "hidden" : fontSize <= LARGE_FONT_SIZE ? "lg:hidden" : ""} flex flex-col sticky h-fit bottom-0 w-screen ${isReducedMotion ? "" : "transition"}`}>
                  <button 
                    aria-label={isBottomToolboxOpen ? "Close Toolbox" : "Open Toolbox"} 
                    onClick={() => setIsBottomToolboxOpen(prev => !prev)}
                    className={`mx-4 my-2 p-2 rounded self-end custom-text dark:d-text custom-questioncard-background custom-interactive-btn border-2 border-black dark:border-white ${isReducedMotion ? "" : "transition"}`}
                  >
                    {isBottomToolboxOpen ? "Close Toolbox" : "Open Toolbox"}
                  </button>
                  {isBottomToolboxOpen ? 
                    <div className={`flex items-center mt-2 p-2 border-t border-t-black dark:border-t-white custom-questioncard-background overflow-auto ${isReducedMotion ? "" : "transition"}`}>
                      <Toolbox isSmallVersion={true} onClickAdd={handleOnClickAddQuestion} currentNumOfQuestions={questionData?.length ?? 0}/>
                    </div>
                    :
                    <></>
                  }
                </div>
              </div>
            </DndContext>
          </ReducedMotionContext.Provider>
        </ThemeContext.Provider>
      </FontSizeContext.Provider>
    </div>
  )
}