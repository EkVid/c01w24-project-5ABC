'use client'
<<<<<<< HEAD
import FontSizeContext from "@/components/utils/FontSizeContext";
import ReducedMotionContext from "@/components/utils/ReducedMotionContext";
import ThemeContext from "@/components/utils/ThemeContext";
import { getTheme } from "@/components/utils/theme";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const AccessibilityBar = dynamic(
  () => import("@/components/AccessibilityBar"),
  { ssr: false }
);

const FormComponent = dynamic(() => import("@/components/GrantForm/FormComponent"), {
  ssr: false,
});

const FormEditor = () => {
  const [fontSize, setFontSize] = useState(100);
  const [theme, setTheme] = useState(false);
  const [isReducedMotion, setIsReducedMotion] = useState(false);

  useEffect(() => setTheme(getTheme()), []);
=======
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
<<<<<<< HEAD
>>>>>>> 972d39f (moved routers and removed warnings in inspect console)
 
  return (
    <div className="flex flex-col flex-grow justify-between">
=======
  const [fontSize, setFontSize] = useState(100);
  const [theme, setTheme] = useState(false);
  const [isReducedMotion, setIsReducedMotion] = useState(false);

  useEffect(() => setTheme(getTheme()), []);
 
  return (
    <div className="flex flex-col">
>>>>>>> e2d6acf (fixed warnings, redid layout, and dnd now doesn't look glitchy)
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