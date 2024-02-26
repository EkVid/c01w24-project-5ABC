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
    <div className="flex items-center p-2">
      <Image
        src={isLightTheme ? AlertIconLightMode : AlertIconDarkMode}
        alt="Alert"
        width={"auto"}
        height={25 * (fontSize / 100)}
      />
      <div className="ml-2.5 text-sm custom-red dark:d-custom-red">
        {msg}
      </div>
    </div>
  )
  : <></>
}

export default ErrTextbox;