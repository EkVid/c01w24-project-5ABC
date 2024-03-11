import { useContext, useEffect, useRef, useState } from "react";
import ReducedMotionContext from "../utils/ReducedMotionContext";
import Image from "next/image";
import PlusIcon from "@/../public/plus.svg";
import FontSizeContext from "../utils/FontSizeContext";

const QFile = ({isEditMode, onSelectAnswer}) => {
  const [currentAnswer, setCurrentAnswer] = useState(null);
  const fontSizeMultiplier = useContext(FontSizeContext) / 100;
  const isReduceMotion = useContext(ReducedMotionContext);

  const formRef = useRef();

  const handleOnUpload = (file) => {
    if (isEditMode) return;
    setCurrentAnswer(file);
    onSelectAnswer(file);
  }

  const handleOnSubmit = (e) => {
    e.preventDefault();
    formRef.current.reset();
  }

  const handleOnClearFile = () => {
    setCurrentAnswer(null);
    onSelectAnswer(null);
  }

  useEffect(() => handleOnClearFile(), [isEditMode]);

  return isEditMode ? 
    <>
      <p className={`text-sm custom-text dark:d-text ${isReduceMotion ? "" : "transition-colors"}`}>Your file:</p>
      <input
        type="file"
        className={`text-sm max-w-full custom-text dark:d-text md:max-w-96 rounded-md bg-transparent my-1 ${isEditMode ? "custom-disabled-input dark:d-custom-disabled-input" : "custom-interactive-input"} ${isReduceMotion ? "" : "transition-colors"}`}
        disabled={true}
      />
    </>
    :
    <>
      <p className={`text-sm custom-text dark:d-text ${isReduceMotion ? "" : "transition-colors"}`}>Your file:</p>
      <form ref={formRef} onSubmit={handleOnSubmit} className="my-1">
        {currentAnswer ? 
          <div className="flex items-start">
            <a 
              aria-label={`Download ${currentAnswer.name}`}
              href={URL.createObjectURL(currentAnswer)} 
              target="_blank" 
              rel="noreferrer noopener" 
              className={`text-sm break-words custom-link`}
            >
              {currentAnswer.name}
            </a>
            <button 
              aria-label="Remove currently attached file"
              onClick={handleOnClearFile}
              className={`shrink-0 ml-2 p-0.5 rounded-md custom-interactive-btn ${currentAnswer ? "flex" : "hidden"} ${isReduceMotion ? "" : "transition-colors"}`}
            >
              <Image
                src={PlusIcon}
                alt="Delete"
                width={18 * fontSizeMultiplier}
                height={"auto"}
                className="dark:d-white-filter rotate-45 pointer-events-none"
              />
            </button>
          </div>
          :
          <input
            type="file"
            className={`text-sm max-w-full custom-text dark:d-text md:max-w-96 rounded-md bg-transparent m-1 ${isEditMode ? "custom-disabled-input dark:d-custom-disabled-input" : "custom-interactive-input"} ${isReduceMotion ? "" : "transition-colors"}`}
            onInput={e => handleOnUpload(e.target.files[0])}
          />
        }
      </form>
    </>
    
}

export default QFile;