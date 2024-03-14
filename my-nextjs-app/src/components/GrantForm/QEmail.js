import { useContext, useEffect, useState } from "react";
import ReducedMotionContext from "../utils/ReducedMotionContext";

const QEmail = ({isErr, isEditMode, onSelectAnswer}) => {
  const [currentAnswer, setCurrentAnswer] = useState("");
  const isReduceMotion = useContext(ReducedMotionContext);

  const handleOnInput = (newAnswer) => {
    if (isEditMode) return;
    setCurrentAnswer(newAnswer);
    onSelectAnswer(newAnswer ? {email: newAnswer} : null);
  }

  useEffect(() => setCurrentAnswer(""), [isEditMode]);

  return (
    <input
      type="email"
      placeholder={"example: example@domain.com"}
      className={`text-sm max-w-full custom-text dark:d-text md:max-w-96 border-b-2 bg-transparent m-1 ${isEditMode ? "custom-disabled-input dark:d-custom-disabled-input" : "custom-interactive-input"} ${isErr && !isEditMode ? "custom-err-border" : "dark:border-white "} ${isReduceMotion ? "" : "transition-colors"}`}
      onInput={e => handleOnInput(e.target.value)}
      value={currentAnswer}
      disabled={isEditMode}
    />
  )
}

export default QEmail;