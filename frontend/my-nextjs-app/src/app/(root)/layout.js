'use client'
import FontSizeContext from "@/components/utils/FontSizeContext";
import ReducedMotionContext from "@/components/utils/ReducedMotionContext";
import ThemeContext from "@/components/utils/ThemeContext";
import ColourBlindnessContext from "@/components/utils/ColorBlindnessContext";
import Footer from "@/components/Footer";
import { getTheme } from "@/components/utils/theme";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";

const AccessibilityBar = dynamic(
  () => import("@/components/AccessibilityBar"),
  { ssr: false }
);

export default function NewRootLayout({children}) {
  const [fontSize, setFontSize] = useState(100);
  const [theme, setTheme] = useState(false);
  const [isReducedMotion, setIsReducedMotion] = useState(false);
  const [cbMode, setcbMode] = useState("")

  useEffect(() => {
    setTheme(getTheme())
    setcbMode(localStorage.getItem('cbMode'))
  }, []);


  return (
    <div className="flex flex-col min-h-screen">
      <AccessibilityBar
        onChangeFont={setFontSize}
        onChangeTheme={setTheme}
        onChangeMotion={setIsReducedMotion}
        onChangeCBMode={setcbMode}
      />
      <FontSizeContext.Provider value={fontSize}>
          <ThemeContext.Provider value={theme}>
              <ReducedMotionContext.Provider value={isReducedMotion}>
                <ColourBlindnessContext.Provider value={cbMode}>
                  <div className="flex flex-col flex-grow dark:bg-[#1f1f1f]">
                    {children}
                  </div>
                </ColourBlindnessContext.Provider>
              </ReducedMotionContext.Provider>
          </ThemeContext.Provider>
      </FontSizeContext.Provider>
      <Footer/>
    </div>
  )
}