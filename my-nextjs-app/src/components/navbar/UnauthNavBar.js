"use client";
import Link from "next/link";
import styles from "@/styles/Navbar/unauthNavBar.module.css";
import axios from "axios";
import { useState } from "react";
import { useRouter } from "next/navigation";


const NewBar = () => {
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
    <nav className={styles.nav}>
      <div className={styles.logo}>
        <Link href="/">
          <p>Logo</p>
        </Link>
      </div>
      <div className={styles.actions}>
        <Link href="/login">
          <p className={styles.button}>Login</p>
        </Link>
        <Link href="/signup">
          <p className={styles.button}>Register Now →</p>
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
