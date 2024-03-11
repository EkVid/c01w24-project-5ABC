'use client'
import FontSizeContext from "@/components/utils/FontSizeContext";
import ReducedMotionContext from "@/components/utils/ReducedMotionContext";
import ThemeContext from "@/components/utils/ThemeContext";
import { getTheme } from "@/components/utils/theme";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from 'uuid';
import Image from "next/image";
import UndoIcon from "@/../public/undo.svg";
import SubmitIcon from "@/../public/submit.svg";
import QuestionBase from "@/components/GrantForm/QuestionBase";

const AccessibilityBar = dynamic(
  () => import("@/components/AccessibilityBar"),
  { ssr: false }
);

const testbody = [
  {
    question: "What's your name?",
    type: process.env.NEXT_PUBLIC_TYPE_TEXT,
    isRequired: true,
    options:
    {
      isMultipleLines: false,
      minCharsNum: 2,
      maxCharsNum: 20,
    },
    file: null,
  },
  {
    question: "What's your email?",
    type: process.env.NEXT_PUBLIC_TYPE_EMAIL,
    isRequired: true,
  },
  {
    question: "What's your phone number?",
    type: process.env.NEXT_PUBLIC_TYPE_PHONE,
    isRequired: false,
  },
  {
    question: "Enter your age:",
    type: process.env.NEXT_PUBLIC_TYPE_NUMBER,
    isRequired: true,
    options:
    {
      isIntegerOnly: true,
      minNum: 0,
    }
  },
  {
    question: "What is your GPA on a 4.0 scale?",
    type: process.env.NEXT_PUBLIC_TYPE_NUMBER,
    isRequired: false,
    options:
    {
      isIntegerOnly: false,
      minNum: 0,
      maxNum: 4,
    }
  },
  {
    question: "Do you have a driver's license?",
    type: process.env.NEXT_PUBLIC_TYPE_MULTI,
    answers: ["Yes", "No"],
    isRequired: true,
  },
  {
    question: "Select all that apply",
    type: process.env.NEXT_PUBLIC_TYPE_CHECKBOX,
    answers: ["Tall", "Smol", "Wide", "Thinn"],
    isRequired: false,
    options:
    {
      isNoneAnOption: true
    }
  },
  {
    question: "When did you graduate high school?",
    type: process.env.NEXT_PUBLIC_TYPE_DATE,
    isRequired: false,
    options:
    {
      isDateRange: false
    }
  },
  {
    question: "Start and end date of last job",
    type: process.env.NEXT_PUBLIC_TYPE_DATE,
    isRequired: false,
    options:
    {
      isDateRange: true,
      isBothRequired: true,
    }
  },
  {
    question: "Download and complete attached file",
    type: process.env.NEXT_PUBLIC_TYPE_FILE,
    isRequired: true,
  },
]

export default function ApplicationPage({params}) {
  const [fontSize, setFontSize] = useState(100);
  const [theme, setTheme] = useState(false);
  const [isReducedMotion, setIsReducedMotion] = useState(false);
  const [questionData, setQuestionData] = useState(null);
  const [answerData, setAnswerData] = useState(null);
  const [title, setTitle] = useState("");
console.log(decodeURI(params.appId))
  useEffect(() => setTheme(getTheme()), []);

  // Load question data into form
  useEffect(() => {
    //const fetchedQuestData = fetch(`localhost:4000/idkUrl/${params.appId}`);
    const fetchedQuestData = testbody;
    const questData = fetchedQuestData.map(q => {
      let newQuestObj = {...q, id: uuidv4(), errMsgArr: []};
      if (q.answers) {
        newQuestObj = {...newQuestObj, answersObj: q.answers.map(a => ({answer: a, id: uuidv4()}))};
        delete newQuestObj.answers;
      }
      return newQuestObj;
    });
    setTitle("Poot Title Here");
    setQuestionData(questData);
    setAnswerData(questData.map(q => null));
  }, []);

  const handleOnQuit = () => {
    let isDataStored = false;
    for (let answerObj of answerData) {
      if (answerObj.answers) {
        isDataStored = true;
        break;
      }
    }
    if (isDataStored) {
      // Prompt user to confirm to leave page bc they will lose data if they do
      // If they cancel quitting, return early
    }
    // Navigate back to application page
  }

  const handleOnReview = () => {
    // Verify answers and yell at them for issues in answers
    // Navigate to review answers page if no problem
  }

  const handleOnSelectAnswer = (questionId, answer) => {
    
  }
 
  return (
    <div className="flex flex-col flex-grow">
      <FontSizeContext.Provider value={fontSize}>
        <ThemeContext.Provider value={theme}>
          <ReducedMotionContext.Provider value={isReducedMotion}>
            <title>{`${title} application form`}</title>
            <div className={`flex flex-col sticky top-0 z-30 h-fit custom-questioncard-background`}>
              <AccessibilityBar 
                onChangeFont={setFontSize}
                onChangeTheme={setTheme}
                onChangeMotion={setIsReducedMotion}
              />
              <div className="flex justify-between p-2 overflow-auto">
                <button 
                  aria-label="Return to grants"
                  onClick={handleOnQuit}
                  className={`flex shrink-0 items-center min-w-fit rounded custom-interactive-btn m-1 p-1 ${isReducedMotion ? "" : "transition"}`}
                >
                  <Image
                    src={UndoIcon}
                    alt="Arrow to go back a page"
                    width={22 * fontSize / 100}
                    height={"auto"}
                    className="dark:d-white-filter rotate-[30deg]"
                  />
                  <p className="ml-2.5 text-xl custom-text dark:d-text hidden lg:flex">Quit</p>
                </button>
                <h1 className="flex-grow self-center text-center mx-4 text-2xl custom-text dark:d-text overflow-auto max-h-20">{title}</h1>
                <button 
                  aria-label="Review and submit answers"
                  onClick={handleOnReview}
                  className={`flex shrink-0 items-center rounded custom-interactive-btn m-1 px-2 py-1 ${isReducedMotion ? "" : "transition"}`}
                >
                  <Image
                    src={SubmitIcon}
                    alt="Checkmark"
                    width={22 * fontSize / 100}
                    height={"auto"}
                    className="dark:d-white-filter"
                  />
                  <p className="ml-2.5 text-xl custom-text dark:d-text hidden lg:flex">Review / Submit</p>
                </button>
              </div>
            </div>
            {questionData ? 
              <div className={`flex flex-col max-w-full flex-auto px-3 mx-3 mt-6 h-full overflow-auto`}>
                {questionData?.map((q, i) =>
                  <QuestionBase 
                    key={q.id}
                    questionData={q} 
                    questionNum={i + 1}
                    isEditMode={false}
                    isLastQuestion={i === questionData.length - 1}
                    onSelectAnswer={() => {return}}
                  />
                )}
                {!questionData || questionData.length === 0 ?
                  <h3 className="text-center my-20 text-3xl font-bold custom-text dark:d-text opacity-50">
                    There are no questions to preview
                  </h3>
                  :
                  <div className="flex flex-col mt-5 mb-10">
                    <p className="text-center text-3xl font-bold custom-text dark:d-text opacity-50 whitespace-pre-wrap">
                      {'You have reached the end of the application!'}
                    </p>
                    <button 
                      aria-label="Review and submit answers"
                      onClick={handleOnReview}
                      className={`flex rounded custom-interactive-btn m-1 mt-5 p-2.5 self-center custom-questioncard-background ${isReducedMotion ? "" : "transition-colors"}`}
                    >
                      <Image
                        src={SubmitIcon}
                        alt="Checkmark"
                        width={22 * fontSize / 100}
                        height={"auto"}
                        className="dark:d-white-filter"
                      />
                      <div className="ml-2.5 text-xl custom-text dark:d-text">Review / Submit</div>
                    </button>
                  </div>
                }
              </div>
              :
              <p className="custom-text dark:d-text text-center mt-8">Loading form...</p> 
            }
          </ReducedMotionContext.Provider>
        </ThemeContext.Provider>
      </FontSizeContext.Provider>
    </div>
  )
}

