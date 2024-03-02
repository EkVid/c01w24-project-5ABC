'use client'
import AccessibilityBar from "@/components/AccessibilityBar";
import FontSizeContext from "@/components/utils/FontSizeContext";
import ReducedMotionContext from "@/components/utils/ReducedMotionContext";
import ThemeContext from "@/components/utils/ThemeContext";
import { getTheme } from "@/components/utils/theme";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const FormComponent = dynamic(() => import("@/components/GrantForm/FormComponent"), {
  ssr: false,
})

const FormEditor = () => {
  const [fontSize, setFontSize] = useState(100);
  const [theme, setTheme] = useState(false);
  const [isReducedMotion, setIsReducedMotion] = useState(false);

  useEffect(() => setTheme(getTheme()), []);
 
  return (
    <div className="flex flex-col">
      <AccessibilityBar 
        onChangeFont={setFontSize}
        onChangeTheme={setTheme}
        onChangeMotion={setIsReducedMotion}
      />
      <FontSizeContext.Provider value={fontSize}>
        <ThemeContext.Provider value={theme}>
          <ReducedMotionContext.Provider value={isReducedMotion}>
            <FormComponent/>
          </ReducedMotionContext.Provider>
        </ThemeContext.Provider>
      </FontSizeContext.Provider>
    </div>
  )
}

export default FormEditor;