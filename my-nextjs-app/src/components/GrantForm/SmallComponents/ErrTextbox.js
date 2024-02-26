"use client"
import Image from "next/image";
import AlertIcon from "@/../public/alert.svg"
import { useContext } from "react";
import FontSizeContext from "../../utils/FontSizeContext";

const ErrTextbox = ({msg}) => {
  const fontSize = useContext(FontSizeContext);

  return msg ? (
    <div className="flex items-center p-2">
      <Image
        src={AlertIcon}
        alt="Alert"
        width={"auto"}
        height={17 * (fontSize / 100)}
      />
      <div className="ml-2 text-sm custom-red dark:d-custom-red">
        {msg}
      </div>
    </div>
  )
  : <></>
}

export default ErrTextbox;