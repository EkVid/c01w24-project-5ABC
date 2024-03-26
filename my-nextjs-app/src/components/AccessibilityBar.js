"use client";

import "@/app/globals.css";
import chevronDown from "../../public/chevron-down.svg";
import sun from "../../public/sun.svg";
import moon from "../../public/moon.svg";
import Image from "next/image.js";
import { useState } from "react";
import { scaleFont, resetFont, getFont } from "./utils/scaleFont.js";
import { initTheme, changeTheme, getTheme } from "./utils/theme.js";
import FontSizeContext from "./utils/FontSizeContext";
import ReducedMotionContext from "./utils/ReducedMotionContext";
import ThemeContext from "./utils/ThemeContext";
import ColourBlindnessContext from "@/components/utils/ColorBlindnessContext";
import { initcbMode, changecbMode, getcbMode } from "./utils/cbMode";

const AccessibilityBar = ({children, onChangeTheme, onChangeFont, onChangeMotion, onChangeCBMode}) => {
  initTheme()
  const prevcbMode = initcbMode()
  const [ lightTheme, setLightTheme ] = useState(getTheme() === 'light')
  const [ fontSize, setFontSize ] = useState(100)  // Default font size is 100
  const [ isReducedMotion, setIsReducedMotion ] = useState(false)
  const [ cbMode, setcbMode ] = useState(prevcbMode)
  const { protanopia, deuteranopia, tritanopia } = getcbMode(cbMode)

  const handleScaleFontDown = () => {
    scaleFont("down");
    setFontSize(getFont());
    if (onChangeFont) onChangeFont(getFont());
  }

  const handleScaleFontUp = () => {
    scaleFont("up");
    setFontSize(getFont());
    if (onChangeFont) onChangeFont(getFont());
  }

  const handleResetFont = () => {
    resetFont();
    setFontSize(getFont());
    if (onChangeFont) onChangeFont(getFont());
  }

  const handleOnChangeTheme = (e) => {
    changeTheme(e.target.checked, setLightTheme);
    if (onChangeTheme) onChangeTheme(getTheme());
  }

  const handleOnClickMotion = () => {
    setIsReducedMotion(!isReducedMotion);
    if (onChangeMotion) onChangeMotion(!isReducedMotion);
  }

  const handleColourBlindness = (e) => {
    changecbMode(e.target.value)
    setcbMode(e.target.value)
    if (onChangeCBMode) onChangeCBMode(e.target.value)
  }

  return(
    <div className={`h-fit custom-dark-grey-background dark:bg-[#263238] drop-shadow-sm ${isReducedMotion ? "" : "transition-colors"}`}>
      {/* Dropdown */}
      <details aria-label="accessibility settings dropdown" className="group">
        {/* Dropdown Closed Content */}
        <summary className="list-none flex flex-nowrap justify-end items-center cursor-pointer">
          <h1 className="custom-dark-grey dark:d-text cs-text-lg text-center">Accessibility Settings</h1>
          <div className="custom-dark-grey dark:d-text cs-text-2xl mx-5 group-open:rotate-90 transition-transform">
            &#8250;
          </div>
        </summary>

        {/* Dropdown Open Content */}
        <div className="flex justify-start custom-dark-grey p-4 space-x-5 transition-all overflow-x-auto">

          {/* Font Size */}
          <div className="flex flex-col p-2 rounded-lg drop-shadow-lg custom-offwhite-background dark:bg-[#1f1f1f] border-2 border-transparent dark:border-gray-600  min-w-40">
            <div className="flex items-center justify-center">
              <h3 className="text-center cs-text-xl dark:d-text">Font Size </h3>
              <button aria-label="reset font size" className="cs-text-2xl ms-3 cursor-pointer dark:d-text" onClick={handleResetFont}>&#8635;</button>
            </div>

            <div className="flex space-x-4 justify-center items-center">
              <button 
                className="cs-text-5xl font-light hover:cursor-pointer dark:d-text" 
                onClick={handleScaleFontDown}
                aria-label="decrease font size">
                  −
              </button>

              <p className="text-4xl dark:d-text">A</p>

              <button 
                className="cs-text-5xl font-light hover:cursor-pointer dark:d-text" 
                onClick={handleScaleFontUp}
                aria-label="increase font size">
                  +
              </button>
            </div>
            <hr className="border border-[#4D4D4D] dark:border-white" />
          </div>

          {/* Theme */}
          <div className="flex flex-col p-2 rounded-lg drop-shadow-lg custom-offwhite-background dark:bg-[#1f1f1f] border-2 border-transparent dark:border-gray-600 min-w-40">
            <h3 className="text-center cs-text-xl dark:d-text">Theme</h3>
            <div className="flex flex-col lg:flex-row lg:space-x-2 items-center lg:justify-center mt-4">
              <label id='theme-label' tabIndex='0' htmlFor="theme" aria-label="toggle light mode" className="relative cursor-pointer focus-visible:ring focus-visible:ring-[#E0E0E0]" onKeyUp={(e)=> e.key === 'Enter' ? e.target.click() : null}>
                <input id='theme' name='theme' value='light' type="checkbox" aria-labelledby="theme-label" className="sr-only peer" onChange={handleOnChangeTheme} checked={lightTheme}/>
                <div className={`dark:bg-[#E0E0E0] ${protanopia ? "custom-green-background-pt" : deuteranopia ? "custom-green-background-dt" : tritanopia ? "custom-green-background-tr" : "custom-green-background"} relative w-20 h-10 rounded-full ${isReducedMotion ? "" : "transition-colors"} duration-400 z-0`}></div>
                <span className="w-2/5 h-4/5 bg-white absolute rounded-full left-1 top-1 peer-checked:left-11 transition-all duration-400 z-1 flex items-center justify-center">
                  <Image
                    src={lightTheme ? sun : moon}
                    alt={lightTheme ? "sun" : "moon"}
                    className="w-full h-full transition-all duration-300"
                  />
                </span>
              </label>
            </div>
          </div>

          {/* Color Blindness Modes */}
          <div className="flex flex-col p-2 rounded-lg drop-shadow-lg custom-offwhite-background dark:bg-[#1f1f1f] border-2 border-transparent dark:border-gray-600 min-w-40">
            <h3 className="text-center cs-text-xl dark:d-text">Color Blindness</h3>
            <div className="flex justify-center items-center mt-4 mx-1 rounded-lg custom-dark-grey-background h-8">
              <select name='colour-blindness' defaultValue={cbMode} onChange={handleColourBlindness} className="border-2 border-slate-300 rounded p-2">
                  <option value="">None</option>
                  <option value="protanopia">Protanopia</option>
                  <option value="deuteranopia">Deuteranopia</option>
                  <option value="tritanopia">Tritanopia</option>
              </select>
            </div>
          </div>

          {/* Reduced Motion */}
          <div className="flex flex-col p-2 rounded-lg drop-shadow-lg custom-offwhite-background dark:bg-[#1f1f1f] border-2 border-transparent dark:border-gray-600 min-w-40">
            <h3 className="text-center cs-text-xl dark:d-text">Reduced Motion</h3>
            <div className="flex space-x-2 items-center mt-4">
              <p className="cs-text-lg dark:d-text">Off</p>
              <label id='motion-label' htmlFor="motion" tabIndex='0' aria-label="toggle reduced motion" className="relative cursor-pointer focus-visible:ring focus-visible:ring-[#E0E0E0]" onKeyUp={(e)=> e.key === 'Enter' ? e.target.click() : null}>
                <input id='motion' name='motion' value="reduced" tabIndex='-1' type="checkbox" aria-labelledby="motion-label" className="sr-only peer" onChange={handleOnClickMotion} checked={isReducedMotion}/>
                <div className={`bg-[#E0E0E0] ${protanopia ? "peer-checked:custom-green-background-pt" : deuteranopia ? "peer-checked:custom-green-background-dt" : tritanopia ? "peer-checked:custom-green-background-tr" : "peer-checked:custom-green-background"} relative w-20 h-10 rounded-full ${isReducedMotion ? "" : "transition-colors"} duration-400 z-0`}></div>
                <span className="w-2/5 h-4/5 bg-white absolute rounded-full left-1 top-1 peer-checked:left-11 transition-all duration-400 z-1"></span>
              </label>
              <p className="cs-text-lg dark:d-text">On</p>
            </div>
          </div>
        </div>
      </details>
      <FontSizeContext.Provider value={fontSize}>
        <ThemeContext.Provider value={lightTheme}>
          <ReducedMotionContext.Provider value={isReducedMotion}>
            <ColourBlindnessContext.Provider value={cbMode}>
              {children}
            </ColourBlindnessContext.Provider>
          </ReducedMotionContext.Provider>
        </ThemeContext.Provider>
      </FontSizeContext.Provider>
    </div>
  );
};

export default AccessibilityBar;
