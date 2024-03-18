"use client"
import Image from "next/image";
import AlertIconLightMode from "@/../public/alert-light.svg"
import AlertIconDarkMode from "@/../public/alert-dark.svg"
import { useContext } from "react";
import FontSizeContext from "../../utils/FontSizeContext";
import ThemeContext from "@/components/utils/ThemeContext";

const ErrTextbox = ({msg}) => {
  const fontSize = useContext(FontSizeContext);
  const isLightTheme = useContext(ThemeContext);

  return msg ? (
    <>
      <Image
        src={isLightTheme ? AlertIconLightMode : AlertIconDarkMode}
        alt="Alert"
        width={"auto"}
        height={25 * (fontSize / 100)}
      />
      <p className="ml-3 text-sm custom-red dark:d-custom-red whitespace-pre-wrap">
        {msg}
      </p>
    </>
  )
  : <></>
}

export default ErrTextbox;