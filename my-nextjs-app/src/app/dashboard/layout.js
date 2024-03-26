'use client'
import Footer from "@/components/Footer";
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

const DashboardLayoutElement = dynamic(
    () => import("@/components/Dashboard/DashboardLayout.js"),
    { ssr: false }
);

export default function DashboardLayout({children}) {

    const [fontSize, setFontSize] = useState(100);
    const [theme, setTheme] = useState(false);
    const [isReducedMotion, setIsReducedMotion] = useState(false);
  
    useEffect(() => setTheme(getTheme()), []);

    return (
      <div className="flex flex-col min-h-screen dark:bg-[#1f1f1f]">
        <AccessibilityBar 
            onChangeFont={setFontSize}
            onChangeTheme={setTheme}
            onChangeMotion={setIsReducedMotion}
        />
        <FontSizeContext.Provider value={fontSize}>
            <ThemeContext.Provider value={theme}>
                <ReducedMotionContext.Provider value={isReducedMotion}>
                    <DashboardLayoutElement children={children}/>
                </ReducedMotionContext.Provider>
            </ThemeContext.Provider>
        </FontSizeContext.Provider>
        <Footer />
      </div>
    )
  }