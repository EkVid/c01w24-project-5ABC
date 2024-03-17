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
import { useEffect, useMemo, useState } from "react";
import { v4 as uuidv4 } from 'uuid';
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import ThemeContext from "@/components/utils/ThemeContext";
import { getTheme } from "@/components/utils/theme";

const AccessibilityBar = dynamic(
  () => import("@/components/AccessibilityBar"),
  { ssr: false }
);

export default function EditPage({params}) {
  const [fontSize, setFontSize] = useState(100);
  const [theme, setTheme] = useState(false);
  const [isReducedMotion, setIsReducedMotion] = useState(false);
  const [questionData, setQuestionData] = useState(null);
  const [activeQuestion, setActiveQuestion] = useState(null);
  const [newDraggedObj, setNewDraggedObj] = useState(null);
  const [isEditMode, setIsEditMode] = useState(true);
  const [isToolboxDisabled, setIsToolboxDisabled] = useState(false);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [isBottomToolboxOpen, setIsBottomToolboxOpen] = useState(true);
  const [tempIdx, setTempIdx] = useState([-1, -1]);
  const title = decodeURI(params.formTitle);

  const questionPanelRef = useDroppable({ id: "questionPanel"});
  const router = useRouter();

  const largeFontSize = 140;
  const deltaXToAdd = 240;

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

  useEffect(() => setTheme(getTheme()), []);
 
  return (
    <div className="flex flex-col flex-grow justify-between">
      <FontSizeContext.Provider value={fontSize}>
        <ThemeContext.Provider value={theme}>
          <ReducedMotionContext.Provider value={isReducedMotion}>
            <DndContext
              id="OuterDnd"
              collisionDetection={rectIntersection}
              onDragStart={handleOnDragStart}
              onDragMove={handleOnDragMove}
              onDragEnd={handleOnDragEnd}
              onDragCancel={clearStates}
              modifiers={[restrictToVerticalAxisAndWindowEdges]}
            >
              <title>{`${title} Editor`}</title>
              {/* Header for title and save, exit, view buttons */}
              <div className={`flex flex-col sticky top-0 z-30 h-fit custom-questioncard-background border-b border-b-black dark:border-b-white ${isReducedMotion ? "" : "transition"}`}>
                <AccessibilityBar 
                  onChangeFont={setFontSize}
                  onChangeTheme={setTheme}
                  onChangeMotion={setIsReducedMotion}
                />
                <div className="flex items-center justify-between p-2 overflow-auto">
                  <button 
                    aria-label="Quit"
                    onClick={() => router.push("/")}
                    className={`flex shrink-0 min-w-fit items-center rounded custom-interactive-btn m-1 p-1 self-stretch ${isReducedMotion ? "" : "transition"}`}
                  >
                    <Image
                      src={UndoIcon}
                      alt="Arrow to go back"
                      width={22 * fontSize / 100}
                      height={"auto"}
                      className="dark:d-white-filter rotate-[30deg]"
                    />
                    <div className="ml-3 text-xl custom-text dark:d-text hidden lg:flex">Quit</div>
                  </button>
                  <h1 className="flex-grow text-center mx-3 text-2xl custom-text dark:d-text overflow-auto max-h-20">{title}</h1>
                  <div className="min-w-fit flex flex-col">
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
                      />
                      <div className="ml-3 text-xl custom-text dark:d-text hidden lg:flex">Save</div>
                    </button>
                    <button 
                      aria-label={isEditMode ? "Preview form" : "Edit form"}
                      onClick={() => setIsEditMode(!isEditMode)}
                      className={`flex shrink-0 rounded items-center custom-interactive-btn mx-1 mb-1 px-2 py-1 ${isReducedMotion ? "" : "transition"}`}
                    >
                      <Image
                        src={isEditMode ? EyeIcon : EditIcon}
                        alt={isEditMode ? "Eye" : "Edit"}
                        width={22 * fontSize / 100}
                        height={"auto"}
                        className="dark:d-white-filter"
                      />
                      <div className="ml-3 text-xl custom-text dark:d-text hidden lg:flex">{isEditMode ? "View" : "Edit"}</div>
                    </button>
                  </div>
                </div>
              </div>
              <div className={`${fontSize > largeFontSize ? "flex-col" : "flex flex-col lg:flex-row"} flex-auto bg-transparent`}>
                <div className={`${fontSize > largeFontSize || !isEditMode ? "" : "lg:flex sticky top-36"} hidden h-fit max-h-[85vh] px-3 py-5 pb-0 m-3 rounded-xl border-4 border-transparent overflow-auto flex-col lg:max-w-xs xl:max-w-sm custom-questioncard-background ${isToolboxDisabled ? "opacity-30" : ""} ${isReducedMotion ? "" : "transition"}`}>
                  <Toolbox onClickAdd={handleOnClickAddQuestion}/>
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
                      />
                    )}
                    {isEditMode ?
                      !questionData || questionData.length === 0 ?
                        <div className={`flex m-20 self-center text-3xl font-bold custom-text dark:d-text text-center opacity-50 whitespace-pre-wrap ${isReducedMotion ? "" : "transition"}`}>
                          {!questionData ? 
                            "Use the toolbox to start creating your application form!\n\n\nClick the + icons to start adding questions!" 
                            : 
                            "You trynna give people an empty application to fill out?\n\n\nAdd your questions here now."
                          }
                        </div>
                        :
                        <div className="text-center my-20 text-3xl font-bold custom-text dark:d-text opacity-50">End of form</div>
                      : !questionData || questionData.length === 0 ?
                        <div className="text-center my-20 text-3xl font-bold custom-text dark:d-text opacity-50">
                          There are no questions to preview
                        </div>
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
                <div className={`${!isEditMode ? "hidden" : fontSize <= largeFontSize ? "lg:hidden" : ""} flex flex-col sticky h-fit bottom-0 w-screen ${isReducedMotion ? "" : "transition"}`}>
                  <button 
                    aria-label={isBottomToolboxOpen ? "Close Toolbox" : "Open Toolbox"} 
                    onClick={() => setIsBottomToolboxOpen(prev => !prev)}
                    className={`mx-4 my-2 p-2 rounded self-end custom-text dark:d-text custom-questioncard-background custom-interactive-btn border-2 border-black dark:border-white ${isReducedMotion ? "" : "transition"}`}
                  >
                    {isBottomToolboxOpen ? "Close Toolbox" : "Open Toolbox"}
                  </button>
                  {isBottomToolboxOpen ? 
                    <div className={`flex items-center mt-2 p-2 border-t border-t-black dark:border-t-white custom-questioncard-background overflow-auto ${isReducedMotion ? "" : "transition"}`}>
                      <Toolbox isSmallVersion={true} onClickAdd={handleOnClickAddQuestion}/>
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