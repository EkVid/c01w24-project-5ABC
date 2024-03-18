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
import ErrTextbox from "@/components/GrantForm/SmallComponents/ErrTextbox";
import { useRouter } from "next/navigation";

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
    isRequired: true,
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
    fileData: 
    {
      fileLink: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2F3fc4ed44-3fbc-419a-97a1-a29742511391.selcdn.net%2Fcoub_storage%2Fcoub%2Fsimple%2Fcw_image%2F4d4a7c5479f%2Fca1bf7ae0f002963751d0%2Fmed_1673105234_6tqgye_1409562215_1381603942_00014.jpg&f=1&nofb=1&ipt=47580c26f539884377b16df3bbc3137ed1f6f3f264716a80d415e4eb8fb271d5&ipo=images",
      fileName: "shagged_by_rare_parrot.jpg",
    }
  },
]

const EMAIL_REGEX = /^[^!#\$%&~\.]+(\.[^!#\$%&~\.]+)*@([^!#\$%&~\.]{1,63}\.)+[^!#\$%&~\.]{2,}$/;
const PHONE_REGEX = /^(\+\d( )?)?(\(|-)?\d{3}(\)|-| )?\d{3}(-| )?\d{4}(,? ?(ext\.?|extension|x){1}\d+)?$/i;

export default function ApplicationPage({params}) {
  const [fontSize, setFontSize] = useState(100);
  const [theme, setTheme] = useState(false);
  const [isReducedMotion, setIsReducedMotion] = useState(false);
  const [isRequiredVis, setIsRequiredVis] = useState(false);
  const [isErrVis, setIsErrVis] = useState(false);
  const [questionData, setQuestionData] = useState(null);
  const [answerData, setAnswerData] = useState(null);
  const [title, setTitle] = useState("");

  const router = useRouter();

  // Load question data into form
  useEffect(() => {
    // TODO: Get question data array into fetchedQuestData, also get and set title
    //const fetchedQuestData = fetch(`localhost:4000/idkUrl/${params.appId}`);
    const fetchedQuestData = testbody;
    const questData = fetchedQuestData.map(q => {
      let newQuestObj = {...q, id: uuidv4(), errMsg: null};
      if (q.answers) {
        newQuestObj = {...newQuestObj, answersObj: q.answers.map(a => ({answer: a, id: uuidv4()}))};
        delete newQuestObj.answers;
      }
      return newQuestObj;
    });
    setTitle("Poot Title Here");
    setQuestionData(questData);
    setAnswerData(questData.map(q => null));
    setTheme(getTheme());
    setIsRequiredVis(questData.filter(q => q.isRequired).length > 0);
  }, []);

  useEffect(() => {
    if (!questionData) setIsErrVis(false);
    else setIsErrVis(questionData.filter(q => q.errMsg).length > 0);
  }, [questionData]);

  const handleOnQuit = () => {
    if (answerData.filter(a => a != null).length > 0) {
      // TODO: Use better looking prompt to prompt user to confirm to leave page (they will lose their answers if they confirm)
      if(!confirm("Are you sure you want to leave? You will lose your answers")) return;
    }
    // TODO: Navigate back to application page
    router.push("/");
  }

  // Checks answers and validates them and shows error message for issues
  // If no problems, shows preview page
  const handleOnReview = () => {
    const allErrMsg = questionData.map(q => null);
    for (let i = 0; i < questionData.length; i++) {
      const question = questionData[i];
      const answer = answerData[i];
      if (!question.isRequired && !answer) continue;
      if (question.isRequired && !answer) {
        allErrMsg[i] = "Please enter an answer";
        continue;
      }
      if (question.type === process.env.NEXT_PUBLIC_TYPE_TEXT) {
        const minCharsNum = question.options?.minCharsNum;
        const maxCharsNum = question.options?.maxCharsNum;
        const text = answer?.text;
        if (minCharsNum && text && text.length < minCharsNum) {
          allErrMsg[i] = `Answer too short (current: ${text.length}, min: ${minCharsNum})`;
          continue;
        }
        if (maxCharsNum && text && text.length > maxCharsNum) {
          allErrMsg[i] = `Answer too long (current: ${text.length}, max: ${maxCharsNum})`;
          continue;
        }
      }
      else if (question.type === process.env.NEXT_PUBLIC_TYPE_NUMBER) {
        const isInt = question.options?.isIntegerOnly;
        const minNum = question.options?.minNum;
        const maxNum = question.options?.maxNum;
        const value = answer?.value;
        if (isNaN(value)) {
          allErrMsg[i] = "Answer must be a number";
          continue;
        }
        if (isInt && value && !Number.isSafeInteger(parseFloat(value))) {
          allErrMsg[i] = "Answer must be an integer";
          continue;
        }
        if (minNum && value && value < minNum) {
          allErrMsg[i] = `Number too low (current: ${value}, min: ${minNum})`;
          continue;
        }
        if (maxNum && value && value > minNum) {
          allErrMsg[i] = `Number too high (current: ${value}, max: ${maxNum})`;
          continue;
        }
      }
      else if (question.type === process.env.NEXT_PUBLIC_TYPE_EMAIL) {
        const email = answer?.email;
        if (!EMAIL_REGEX.test(email)) {
          allErrMsg[i] = "You must enter a valid email address";
          continue;
        }
      }
      else if (question.type === process.env.NEXT_PUBLIC_TYPE_PHONE) {
        const phoneNum = answer?.phoneNum;
        if (!PHONE_REGEX.test(phoneNum)) {
          allErrMsg[i] = "You must enter a valid phone number";
          continue;
        }
      }
      else if (question.type === process.env.NEXT_PUBLIC_TYPE_DATE) {
        const isDateRange = question.options?.isDateRange;
        const isBothRequired = question.options?.isBothRequired;
        const startDate = answer?.startDate;
        const endDate = answer?.endDate;
        if (isDateRange && isBothRequired && !startDate && endDate) {
          allErrMsg[i] = "You must enter a start date";
          continue;
        }
        if (isDateRange && isBothRequired && startDate && !endDate) {
          allErrMsg[i] = "You must enter an end date";
          continue;
        }
        if (new Date(startDate) > new Date(endDate)) {
          allErrMsg[i] = "Start date cannot be later than end date";
          continue;
        }
      }
    }
    setQuestionData(prev => prev.map((q, i) => ({...q, errMsg: allErrMsg[i]})));
    if (allErrMsg.filter(e => e != null).length === 0) {
      console.log("No problems, go to review")
      // TODO: Go to review page
    }
  }

  const handleOnSelectAnswer = (questionId, answer) => {
    setAnswerData(prev => {
      const questionIdx = questionData.findIndex(q => q.id === questionId);
      return prev.map((a, i) => i === questionIdx ? answer : a);
    });
    setQuestionData(prev => prev.map(q => q.id === questionId ? {...q, errMsg: null} : q));
  }

  return (
    <div className="flex flex-col flex-grow">
      <FontSizeContext.Provider value={fontSize}>
        <ThemeContext.Provider value={theme === "light"}>
          <ReducedMotionContext.Provider value={isReducedMotion}>
            <title>{`${title} Application`}</title>
            <div className={`flex flex-col sticky top-0 z-30 h-fit custom-questioncard-background`}>
              <AccessibilityBar 
                onChangeFont={setFontSize}
                onChangeTheme={setTheme}
                onChangeMotion={setIsReducedMotion}
              />
              <div className="flex justify-between overflow-auto m-2">
                <button 
                  aria-label="Return to grants"
                  onClick={handleOnQuit}
                  className={`flex shrink-0 items-center w-fit rounded custom-interactive-btn m-1 p-2 ${isReducedMotion ? "" : "transition"}`}
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
                  className={`flex shrink-0 items-center w-fit rounded custom-interactive-btn m-1 px-2 py-1 ${isErrVis ? "hidden" : ""} ${isReducedMotion ? "" : "transition"}`}
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
                {isErrVis ?
                  <div className="flex items-center mx-2">
                    <ErrTextbox msg={"Fix all errors\nto review and\nsubmit form"}/>
                  </div>
                  :
                  <></>
                }
              </div>
            </div>
            {isRequiredVis ?
              <p className="mx-3 px-3 mt-6">
                <font className="custom-red dark:d-custom-red mr-1 text-xl">*</font>Indicates required question
              </p>
              :
              <></>
            }
            {questionData ? 
              <div className={`flex flex-col max-w-full flex-auto px-3 mx-3 mt-6 h-full overflow-auto`}>
                {questionData?.map((q, i) =>
                  <QuestionBase 
                    key={q.id}
                    questionData={q} 
                    questionNum={i + 1}
                    isEditMode={false}
                    isLastQuestion={i === questionData.length - 1}
                    onSelectAnswer={handleOnSelectAnswer}
                  />
                )}
                {!questionData || questionData.length === 0 ?
                  <h3 className="text-center my-20 text-3xl font-bold custom-text dark:d-text opacity-50">
                    There are no questions to preview
                  </h3>
                  :
                  <div className="flex flex-col items-center mt-5 mb-10">
                    <p className="text-center text-3xl font-bold custom-text dark:d-text opacity-50 whitespace-pre-wrap">
                      {'You have reached the end of the application!'}
                    </p>
                    {isErrVis ?
                      <div className="flex items-center p-4">
                        <ErrTextbox msg={"Fix all errors to review and submit form"}/>
                      </div>
                      :
                      <button 
                        aria-label="Review and submit answers"
                        onClick={handleOnReview}
                        className={`flex rounded custom-interactive-btn m-1 mt-5 p-3 self-center custom-questioncard-background ${isReducedMotion ? "" : "transition-colors"}`}
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
                    }
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

