'use client'

import "@/app/globals.css";
import chevronDown from "../../public/chevron-down.svg"
import Image from "next/image.js";
import { useState } from "react";
import { scaleFont, resetFont } from "./utils/scaleFont.js"
import { initTheme, changeTheme, getTheme } from "./utils/theme.js"

const AccessibilityBar = () => {
  initTheme()
  const [ lightTheme, setLightTheme ] = useState(getTheme() === 'light')

  return(
    <div className="custom-dark-grey-background dark:bg-[#263238] drop-shadow-sm">
      {/* Dropdown */}
      <details className="group">

        {/* Dropdown Closed Content */}
        <summary className="list-none flex flex-nowrap justify-end items-center cursor-pointer">
          <h1 className="custom-dark-grey-text dark:text-white cs-text-lg text-center">Accessibility Settings</h1>
          <div className="custom-dark-grey-text dark:text-white cs-text-2xl mx-5 group-open:rotate-90 transition-transform">
            &#8250;
          </div>
        </summary>

        {/* Dropdown Open Content */}
        <div className="flex justify-start sm:justify-center custom-dark-grey-text p-4 space-x-5 transition-all overflow-x-auto">

          {/* Font Size */}
          <div className="flex flex-col p-2 rounded-lg drop-shadow-lg custom-offwhite-background dark:bg-[#1f1f1f] border-2 border-transparent dark:border-gray-600  min-w-40">
            <div className="flex items-center justify-center">
              <h3 className="text-center cs-text-xl dark:text-white">Font Size </h3>
              <button className="cs-text-2xl ms-3 cursor-pointer dark:text-white" onClick={resetFont}>&#8635;</button>
            </div>
            
            <div className="flex space-x-4 justify-center items-center">
              <button 
                className="cs-text-5xl font-light hover:cursor-pointer dark:text-white" 
                onClick={() => scaleFont('down')}>
                  −
              </button>

              <p className="text-4xl dark:text-white">A</p>

              <button 
                className="cs-text-5xl font-light hover:cursor-pointer dark:text-white" 
                onClick={() => scaleFont('up')}>
                  +
              </button>
            </div>
            <hr className="border border-[#4D4D4D] dark:border-white"/>
          </div>

          {/* Theme */}
          <div className="flex flex-col p-2 rounded-lg drop-shadow-lg custom-offwhite-background dark:bg-[#1f1f1f] border-2 border-transparent dark:border-gray-600 min-w-40">
            <h3 className="text-center cs-text-xl dark:text-white">Theme</h3>
            <div className="flex flex-col lg:flex-row lg:space-x-2 items-center lg:justify-center mt-4">
              <p className="cs-text-lg dark:text-white -ms-12 lg:ms-0">Dark</p>
              <label htmlFor="theme" className="relative cursor-pointer focus-visible:ring focus-visible:ring-[#E0E0E0] ">
                <input id='theme' type="checkbox" className="sr-only peer" onChange={(e) => changeTheme(e.target.checked, setLightTheme)} checked={lightTheme}/>
                <div className="dark:bg-[#E0E0E0] bg-[#4CAF4F] relative w-20 h-10 rounded-full transition-colors duration-400 z-0"></div>
                <span className="w-2/5 h-4/5 bg-white absolute rounded-full left-1 top-1 peer-checked:left-11 transition-all duration-400 z-1"></span>
              </label>
              <p className="cs-text-lg dark:text-white ms-12 lg:ms-0">Light</p>
            </div>
          </div>

          {/* Language */}
          <div className="flex flex-col p-2 rounded-lg drop-shadow-lg custom-offwhite-background dark:bg-[#1f1f1f] border-2 border-transparent dark:border-gray-600 min-w-40">
            <h3 className="text-center cs-text-xl dark:text-white">Language</h3>
            <div className="flex justify-center items-center mt-4 mx-1 px-2 rounded-lg custom-dark-grey-background h-8">
              <p className="cs-text-xl text-center ms-auto">EN</p>
              <Image
                src={chevronDown}
                alt="down chevron"
                className="ms-auto transition-all duration-300"
              />
            </div>
          </div>

          {/* Reduced Motion */}
          <div className="flex flex-col p-2 rounded-lg drop-shadow-lg custom-offwhite-background dark:bg-[#1f1f1f] border-2 border-transparent dark:border-gray-600 min-w-40">
            <h3 className="text-center cs-text-xl dark:text-white">Reduced Motion</h3>
            <div className="flex space-x-2 items-center mt-4">
              <p className="cs-text-lg dark:text-white">Off</p>
              <label htmlFor="motion" className="relative cursor-pointer focus-visible:ring focus-visible:ring-[#E0E0E0] ">
                <input id='motion' type="checkbox" className="sr-only peer"/>
                <div className="bg-[#E0E0E0] peer-checked:bg-[#4CAF4F] relative w-20 h-10 rounded-full transition-colors duration-400 z-0"></div>
                <span className="w-2/5 h-4/5 bg-white absolute rounded-full left-1 top-1 peer-checked:left-11 transition-all duration-400 z-1"></span>
              </label>
              <p className="cs-text-lg dark:text-white">On</p>
            </div>
          </div>
        </div>
      </details>
    </div>
  )
}

export default AccessibilityBar