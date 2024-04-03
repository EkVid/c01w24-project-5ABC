import { useContext, useEffect, useRef, useState } from "react";
import ReducedMotionContext from "../utils/ReducedMotionContext";
import Image from "next/image";
import PlusIcon from "@/../public/plus.svg";
import FontSizeContext from "../utils/FontSizeContext";
import { uploadFile } from "../utils/uploadFile";
import ResponseMsg from "./SmallComponents/ResponseMsg";

const QFile = ({isEditMode, onSelectAnswer, applicantAnswer}) => {
  const [currentAnswer, setCurrentAnswer] = useState(null);
  const fontSizeMultiplier = useContext(FontSizeContext) / 100;
  const isReduceMotion = useContext(ReducedMotionContext);

  const formRef = useRef();

  const handleOnUpload = async (file) => {
    if (isEditMode) return;
    setCurrentAnswer({fileLink: "", fileName: "Uploading..."});
    try {
      const {base64str, url, fileName, fileType} = await uploadFile(file);
      setCurrentAnswer({fileLink: url, fileName: `${fileName} (${fileType})`});
      onSelectAnswer({fileLink: base64str, fileName: `${fileName} (${fileType})`});
    }
    catch (errMsg) {
      setCurrentAnswer({fileLink: "", fileName: errMsg});
      onSelectAnswer(null);
    }
  }

  const handleOnClearFile = () => {
    if (currentAnswer?.fileLink) URL.revokeObjectURL(currentAnswer.fileLink);
    setCurrentAnswer(null);
    if (!isEditMode) onSelectAnswer(null);
    if (formRef.current) formRef.current.reset();
  }

  useEffect(() => handleOnClearFile(), [isEditMode]);

  return applicantAnswer?.fileName && applicantAnswer?.fileLink ?
    <p className={`text-sm custom-text dark:d-text whitespace-pre-wrap ${isReduceMotion ? "" : "transition-colors"}`}>
      {"Applicant's file:\n"}
      <a 
        aria-label={`Download ${applicantAnswer.fileName}`}
        href={`${process.env.NEXT_PUBLIC_BACKEND_DOMAIN + process.env.NEXT_PUBLIC_APPEND}/getFile/${applicantAnswer.fileLink}`} 
        target="_blank" 
        rel="noreferrer noopener" 
        className={`text-sm break-words custom-link`}
      >
        {applicantAnswer.fileName}
      </a>
    </p>
    : applicantAnswer == "" ?
    <ResponseMsg isNoResponse={true}/>
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
            className={`text-sm max-w-full custom-text dark:d-text md:max-w-96 rounded-md bg-transparent my-1 ${isEditMode ? "custom-disabled-input dark:d-custom-disabled-input" : "custom-interactive-input"} ${isReduceMotion ? "" : "transition-colors"}`}
            onInput={e => handleOnUpload(e.target.files[0])}
            disabled={isEditMode}
          />
        }
      </form>
    </>
}

export default QFile;