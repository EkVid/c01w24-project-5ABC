import ToolboxCard from "./SmallComponents/ToolboxCard";
import Image from "next/image";
import PlusIcon from "@/../public/plus.svg";
import MultichoiceIcon from "@/../public/multichoice.svg"
import CheckboxIcon from "@/../public/checkbox.svg"
import NumberIcon from "@/../public/number.svg"
import TextIcon from "@/../public/textbox.svg"
import EmailIcon from "@/../public/email.svg"
import PhoneIcon from "@/../public/phone.svg"
import DateIcon from "@/../public/date.svg"
import FileIcon from "@/../public/file.svg"
import { useContext } from "react";
import FontSizeContext from "../utils/FontSizeContext";
import ReducedMotionContext from "../utils/ReducedMotionContext";
import SmallToolboxCard from "./SmallComponents/SmallToolboxCard";

const toolboxData = [
  {
    title: "Multiple\n Choice",
    desc: "Multiple pre-defined responses, only one can be selected",
    icon: MultichoiceIcon,
    type: process.env.NEXT_PUBLIC_TYPE_MULTI
  },
  {
    title: "Checkbox",
    desc: "Multiple pre-defined responses, any number can be selected",
    icon: CheckboxIcon,
    type: process.env.NEXT_PUBLIC_TYPE_CHECKBOX
  },
  {
    title: "Textbox",
    desc: "Open-ended questions and responses",
    icon: TextIcon,
    type: process.env.NEXT_PUBLIC_TYPE_TEXT
  },
  {
    title: "Number",
    desc: "Only numeric responses, can be restricted to integers or a range",
    icon: NumberIcon,
    type: process.env.NEXT_PUBLIC_TYPE_NUMBER
  },
  {
    title: "Email",
    desc: "Responses must be an email address",
    icon: EmailIcon,
    type: process.env.NEXT_PUBLIC_TYPE_EMAIL
  },
  {
    title: "Phone\n Number",
    desc: "Responses must be a phone number",
    icon: PhoneIcon,
    type: process.env.NEXT_PUBLIC_TYPE_PHONE
  },
  {
    title: "Date",
    desc: "Responses can be a single date or a date range",
    icon: DateIcon,
    type: process.env.NEXT_PUBLIC_TYPE_DATE
  },
  {
    title: "File\n Upload",
    desc: "Applicants can upload a file",
    icon: FileIcon,
    type: process.env.NEXT_PUBLIC_TYPE_FILE
  }
]

const Toolbox = ({isSmallVersion, onClickAdd}) => {
  const fontSizeMultiplier = useContext(FontSizeContext) / 100;
  const isReduceMotion = useContext(ReducedMotionContext);

  return (
    <>
      {isSmallVersion ? 
        <div className="flex flex-col items-center w-56 pl-2 pr-5 border-r border-black dark:border-white">
          <h1 className="text-3xl w-fit text-center custom-text dark:d-text font-bold ">
            Question Toolbox
          </h1>
          <p className="mt-2 text-sm text-center custom-text dark:d-text">
            Click the + to add that question to the bottom of the form
          </p>
        </div>
        :
        <div className="flex flex-col">
          <h1 className="text-3xl text-center custom-text dark:d-text font-bold">
            Question Toolbox
          </h1>
          <p className="mt-2 mb-6 text-sm text-center custom-text-shade dark:d-text-shade">
            Drag and drop questions into the panel on the right or click the + icon to add a new question to the bottom of the form
          </p>
        </div>
      }
      <div className={isSmallVersion ? "flex" : "flex flex-col"}>
      {toolboxData.map(({title, desc, icon, type}) => 
        isSmallVersion ?
          <div key={title} className="flex flex-col ml-2 justify-between items-center">
            <button
              aria-label={`Add '${type}' type question to bottom`}
              onClick={() => onClickAdd(type)}
              className={`p-1 px-6 shrink-0 rounded-lg custom-interactive-btn m-1 ${isReduceMotion ? "" : "transition-colors"}`}
            >
              <Image
                src={PlusIcon}
                alt="Add question"
                width={20 * fontSizeMultiplier}
                height={"auto"}
                className="dark:d-white-filter pointer-events-none"
              />
            </button>
            <SmallToolboxCard 
              title={title} 
              type={type}
              icon={icon}
            />
          </div>
          :
          <div key={title} className="flex mb-2 justify-between">
            <ToolboxCard 
              title={title} 
              type={type}
              desc={desc} 
              icon={icon}
            />
            <button
              aria-label={`Add '${type}' type question to bottom`}
              onClick={() => onClickAdd(type)}
              className={`ml-2 p-2 shrink-0 rounded-lg custom-interactive-btn m-1 ${isReduceMotion ? "" : "transition-colors"}`}
            >
              <Image
                src={PlusIcon}
                alt="Add question"
                width={25 * fontSizeMultiplier}
                height={"auto"}
                className="dark:d-white-filter pointer-events-none"
              />
            </button>
          </div>
        )
      }
      </div>
    </>    
  )
}

export default Toolbox;