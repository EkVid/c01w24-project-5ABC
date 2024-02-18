import Image from "next/image";
import CheckIcon from "@/../public/check.svg"

const CheckWord = ({word}) => {
  return (
    <div className="flex justify-center mt-2">
      <Image
        src={CheckIcon}
        alt="Checkmark"
        height={30}
        width={30}
        className="transition-all duration-300 mr-4 pointer"
      />
      <h2 className="custom-green-dark self-center text-3xl font-bold">
        {word}
      </h2>
    </div>
  )
}

export default CheckWord;