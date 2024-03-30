'use client'
import ResetPassword from "@/components/signup-login/ResetPassword";
import FontSizeContext from "@/components/utils/FontSizeContext";
import ReducedMotionContext from "@/components/utils/ReducedMotionContext";
import ThemeContext from "@/components/utils/ThemeContext";
import { getTheme } from "@/components/utils/theme";
import ColourBlindnessContext from "@/components/utils/ColorBlindnessContext";
import dynamic from "next/dynamic";
import { useState, useEffect } from "react";

const AccessibilityBar = dynamic(
  () => import("@/components/AccessibilityBar"),
  { ssr: false }
);

const ResetPasswordPage = () => {
  const [fontSize, setFontSize] = useState(100);
  const [theme, setTheme] = useState(false);
  const [isReducedMotion, setIsReducedMotion] = useState(false);
  const [cbMode, setcbMode] = useState("")

  useEffect(() => {
    setTheme(getTheme())
    setcbMode(localStorage.getItem('cbMode'))
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
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
                  <ResetPassword />
                </ColourBlindnessContext.Provider>
              </ReducedMotionContext.Provider>
          </ThemeContext.Provider>
      </FontSizeContext.Provider>
    </div>
  );
};

export default dynamic(() => Promise.resolve(ResetPasswordPage), {
  ssr: false,
});
