'use client'
import Link from "next/link";
import styles from "@/styles/Navbar/unauthNavBar.module.css";
import ReducedMotionContext from "@/components/utils/ReducedMotionContext";
import ColourBlindnessContext from "@/components/utils/ColorBlindnessContext";
import { getcbMode } from "@/components/utils/cbMode";
import { useContext, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";


const NewBar = () => {
  const isReducedMotion = useContext(ReducedMotionContext)
  const cbMode = useContext(ColourBlindnessContext)
  const { protanopia, deuteranopia, tritanopia } = getcbMode(cbMode)

  const [data, setData] = useState("");

  const handleDashboardView = () => {
    axios
      .post("http://localhost:5000/grantee_dashboard", {
        email: "applicant@website.com",
        Filters: {
        }
      })
      .then((response) => {
        setData(response.data);
        // console.log(response.data)
        localStorage.setItem('applicationsWithQuestions', JSON.stringify(response.data))
        router.push('/grantee_dashboard');
      })
      .catch((error) => {
        if (error.response) {
          console.log(error.response.status);
          console.log(error.response.data);
        } else if (error.request) {
          console.log("No response received:", error.request);
        } else {
          console.log("Error:", error.message);
        }
      });
    };
  const router = useRouter();

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
        <button className="bg-green-600 text-white w-full px-5 py-2 rounded-full hover:bg-green-800 transition-colors text-sm sm:text-base"
        onClick={
          handleDashboardView
        }>
          Dashboard
        </button>
      </div>
    </nav>
  );
};

export default NewBar;
