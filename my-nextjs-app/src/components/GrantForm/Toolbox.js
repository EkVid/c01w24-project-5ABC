import ToolboxCard from "./SmallComponents/ToolboxCard";
import MultichoiceIcon from "@/../public/multichoice.svg"
import CheckboxIcon from "@/../public/checkbox.svg"
import NumberIcon from "@/../public/number.svg"
import TextIcon from "@/../public/textbox.svg"
import EmailIcon from "@/../public/email.svg"
import PhoneIcon from "@/../public/phone.svg"
import DateIcon from "@/../public/date.svg"
import FileIcon from "@/../public/file.svg"

const toolboxData = [
  {
    title: "Multiple Choice",
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
    title: "Phone Number",
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
    title: "File Upload",
    desc: "Applicants can upload a file",
    icon: FileIcon,
    type: process.env.NEXT_PUBLIC_TYPE_FILE
  }
]

const Toolbox = ({onClickAdd}) => {
  return (
    <>
      <h1 className="text-3xl text-center custom-text dark:d-text font-bold">
        Question Toolbox
      </h1>
      <p className="mt-2 mb-6 text-sm text-center custom-text-shade dark:d-text-shade">
        Drag and drop questions into the panel on the right or click the + icon to add a new question to the bottom of the form
      </p>
      {toolboxData.map(({title, desc, icon, type}) => 
        <ToolboxCard 
          key={title}
          title={title} 
          desc={desc} 
          icon={icon}
          onClickAdd={() => onClickAdd(type)}
        />
      )}
    </>
  )
}

export default Toolbox;