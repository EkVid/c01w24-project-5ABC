import { useContext, useEffect, useRef, useState } from "react";
import ReducedMotionContext from "../utils/ReducedMotionContext";
import Image from "next/image";
import PlusIcon from "@/../public/plus.svg";
import FontSizeContext from "../utils/FontSizeContext";
import { uploadFile } from "../utils/uploadFile";

const QFile = ({isEditMode, onSelectAnswer}) => {
  const [currentAnswer, setCurrentAnswer] = useState(null);
  const fontSizeMultiplier = useContext(FontSizeContext) / 100;
  const isReduceMotion = useContext(ReducedMotionContext);

  const formRef = useRef();

  const handleOnUpload = async (file) => {
    if (isEditMode) return;
    setCurrentAnswer({fileLink: "", fileName: "Uploading..."});
    try {
      const {base64str, url, fileName} = await uploadFile(file);
      setCurrentAnswer({fileLink: url, fileName: fileName});
      onSelectAnswer(base64str);
    }
    catch (errMsg) {
      setCurrentAnswer({fileLink: "", fileName: errMsg});
      onSelectAnswer(null);
    }
  }

  const handleOnClearFile = () => {
    if (currentAnswer?.fileLink) URL.revokeObjectURL(currentAnswer.fileLink);
    setCurrentAnswer(null);
    onSelectAnswer(null);
    console.log(formRef.current)
    formRef.current?.reset();
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
      <form ref={formRef} onSubmit={e => e.preventDefault()} className="my-1 min-h-8">
        {currentAnswer ? 
          <div className="flex items-start">
            {currentAnswer.fileLink ?
              <a 
                aria-label={`Download ${currentAnswer.fileName}`}
                href={currentAnswer.fileLink} 
                target="_blank" 
                rel="noreferrer noopener" 
                className={`text-sm break-words custom-link`}
              >
                {currentAnswer.fileName}
              </a>
              :
              <p className={`text-sm break-words`}>
                {currentAnswer.fileName}
              </p>
            }
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