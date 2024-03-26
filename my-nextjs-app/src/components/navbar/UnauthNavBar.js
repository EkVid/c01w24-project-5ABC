'use client'
import Link from "next/link";
import styles from "@/styles/Navbar/unauthNavBar.module.css";
import ReducedMotionContext from "@/components/utils/ReducedMotionContext";
import ColourBlindnessContext from "@/components/utils/ColorBlindnessContext";
import { getcbMode } from "@/components/utils/cbMode";
import { useContext } from "react";

const NewBar = () => {
  const isReducedMotion = useContext(ReducedMotionContext)
  const cbMode = useContext(ColourBlindnessContext)
  const { protanopia, deuteranopia, tritanopia } = getcbMode(cbMode)

  return (
    <nav className={`${styles.nav} dark:d-custom-dark-grey-background dark:border-y-2 dark:border-neutral-600 ${isReducedMotion ? "" : "transition-colors"}`}>
      <div className={`${styles.logo}`}>
        <Link href="/">
          <p className="dark:d-text">Logo</p>
        </Link>
      </div>
      <div className={styles.actions}>
        <Link href="/login">
          <p className={`py-2 px-4 rounded me-4 ${protanopia ? "custom-green-background-pt" : deuteranopia ? "custom-green-background-dt" : tritanopia ? "custom-green-background-tr" : "custom-green-background"}`}>Login</p>
        </Link>
        <Link href="/signup">
          <p className={`py-2 px-4 rounded me-4 ${protanopia ? "custom-green-background-pt" : deuteranopia ? "custom-green-background-dt" : tritanopia ? "custom-green-background-tr" : "custom-green-background"}`}>Register Now →</p>
        </Link>
      </div>
    </nav>
  );
};

export default NewBar;
