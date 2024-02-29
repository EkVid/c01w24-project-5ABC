import { useContext } from "react";
import ReducedMotionContext from "../utils/ReducedMotionContext";
import OptionsDiv from "./SmallComponents/OptionsDiv";

const QFile = ({isEditMode, onSelectAnswer}) => {
  const isReduceMotion = useContext(ReducedMotionContext);

  return (
    <>
      {/* Standardize the margin between required question option and input */}
      {isEditMode ? 
        <OptionsDiv/>
        :
        <></>
      }
      <input
        type="file"
        className={`text-sm max-w-full custom-text dark:d-text md:max-w-96 rounded-md bg-transparent ${isEditMode ? "custom-disabled-input dark:d-custom-disabled-input" : "custom-interactive-input"} ${isReduceMotion ? "" : "transition-colors"}`}
        onInput={e => onSelectAnswer(e.target.files[0])}
        disabled={isEditMode}
      />
    </>
  )
}

export default QFile;