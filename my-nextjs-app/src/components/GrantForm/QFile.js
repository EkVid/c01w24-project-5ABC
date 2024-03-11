import { useContext, useEffect, useRef } from "react";
import ReducedMotionContext from "../utils/ReducedMotionContext";
import OptionsDiv from "./SmallComponents/OptionsDiv";

const QFile = ({isEditMode, onSelectAnswer}) => {
  const isReduceMotion = useContext(ReducedMotionContext);

  return isEditMode ? 
    <>
      <OptionsDiv/>
      <input
        type="file"
        className={`text-sm max-w-full custom-text dark:d-text md:max-w-96 rounded-md bg-transparent ${isEditMode ? "custom-disabled-input dark:d-custom-disabled-input" : "custom-interactive-input"} ${isReduceMotion ? "" : "transition-colors"}`}
        disabled={true}
      />
    </>
    :
    <input
      type="file"
      className={`text-sm max-w-full custom-text dark:d-text md:max-w-96 rounded-md bg-transparent ${isEditMode ? "custom-disabled-input dark:d-custom-disabled-input" : "custom-interactive-input"} ${isReduceMotion ? "" : "transition-colors"}`}
      onInput={e => onSelectAnswer(e.target.files[0])}
    />
}

export default QFile;