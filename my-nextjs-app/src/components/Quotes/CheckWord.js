import Image from "next/image";
import CheckIcon from "@/../public/check.svg"
import whiteCheck from "@/../public/whiteCheck.svg"

const CheckWord = ({word, theme, protanopia, deuteranopia, tritanopia}) => {
  return (
    <div className="flex justify-center mt-2">
      <Image
        src={theme === 'light' ? CheckIcon : whiteCheck}
        alt="Checkmark"
        height={30}
        width={30}
        className="transition-all duration-300 mr-4 pointer"
      />
      <h2 className={`${protanopia ? "custom-green-pt dark:d-custom-green-color-blind" : deuteranopia ? "custom-green-dt dark:d-custom-green-color-blind" : tritanopia ? "custom-green-tr dark:d-custom-green-color-blind" : "custom-green"} self-center text-3xl font-bold`}>
        {word}
      </h2>
    </div>
  )
}

export default CheckWord;