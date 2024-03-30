"use client"
import Image from "next/image";
import AlertIconLightMode from "@/../public/alert-light.svg"
import AlertIconDarkMode from "@/../public/alert-dark.svg"
import { useContext } from "react";
import FontSizeContext from "../../utils/FontSizeContext";

const ErrTextbox = ({msg}) => {
  const fontSize = useContext(FontSizeContext);

  return msg ? (
    <>
      <Image
        src={AlertIconLightMode}
        alt="Alert"
        width={"auto"}
        height={25 * (fontSize / 100)}
        className="dark:hidden"
        aria-hidden="true"
      />
      <Image
        src={AlertIconDarkMode}
        alt="Alert"
        width={"auto"}
        height={25 * (fontSize / 100)}
        className="hidden dark:block"
        aria-hidden="true"
      />
      <p className="ml-3 text-sm custom-red dark:d-custom-red whitespace-pre-wrap">
        {msg}
      </p>
    </>
  )
  : <></>
}

export default ErrTextbox;