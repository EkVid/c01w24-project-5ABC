import { useContext, useState } from "react";
import ReducedMotionContext from "../utils/ReducedMotionContext";
import OptionsDiv from "./SmallComponents/OptionsDiv";

const QPhoneNum = ({isErr, isEditMode, onSelectAnswer}) => {
  const [currentAnswer, setCurrentAnswer] = useState("");
  const isReduceMotion = useContext(ReducedMotionContext);

  const handleOnInput = (newAnswer) => {
    if (isEditMode) return;
    setCurrentAnswer(newAnswer);
    onSelectAnswer(newAnswer);
  }

  return (
    <>
      {/* Standardize the margin between required question option and input */}
      {isEditMode ? 
        <OptionsDiv/>
        :
        <></>
      }
      <input
        type="tel"
        placeholder={"ex: 123-456-7890"}
        className={`text-sm max-w-full custom-text dark:d-text md:max-w-96 border-b-2 bg-transparent ${isEditMode ? "custom-disabled-input dark:d-custom-disabled-input" : "custom-interactive-input"} ${isErr && !isEditMode ? "custom-err-border" : "dark:border-white "} ${isReduceMotion ? "" : "transition-colors"}`}
        onInput={e => handleOnInput(e.target.value)}
        value={currentAnswer}
        disabled={isEditMode}
      />
    </>
  )
}

export default QPhoneNum;