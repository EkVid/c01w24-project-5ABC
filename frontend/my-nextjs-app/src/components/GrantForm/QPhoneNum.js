import { useContext, useEffect, useState } from "react";
import ReducedMotionContext from "../utils/ReducedMotionContext";
import ResponseMsg from "./SmallComponents/ResponseMsg";

const QPhoneNum = ({isErr, isEditMode, onSelectAnswer, applicantAnswer}) => {
  const [currentAnswer, setCurrentAnswer] = useState("");
  const isReduceMotion = useContext(ReducedMotionContext);

  const handleOnInput = (newAnswer) => {
    if (isEditMode) return;
    setCurrentAnswer(newAnswer);
    onSelectAnswer(newAnswer ? {phoneNum: newAnswer} : null);
  }

  useEffect(() => setCurrentAnswer(""), [isEditMode]);

  return applicantAnswer?.phoneNum ?
    <ResponseMsg msg={applicantAnswer.phoneNum}/>
    : applicantAnswer == "" ?
    <ResponseMsg isNoResponse={true}/>
    :
    <input
      type="tel"
      placeholder={"example: 555-555-5555, ext. 555"}
      className={`text-sm max-w-full custom-text dark:d-text md:max-w-96 border-b-2 bg-transparent m-1 ${isEditMode ? "custom-disabled-input dark:d-custom-disabled-input" : "custom-interactive-input"} ${isErr && !isEditMode ? "custom-err-border" : "dark:border-white "} ${isReduceMotion ? "" : "transition-colors"}`}
      onInput={e => handleOnInput(e.target.value)}
      value={currentAnswer}
      disabled={isEditMode}
    />
  
}

export default QPhoneNum;