"use client";

import Four_Circle from "../../public/logo.svg";
import Image from "next/image";
import { useEffect, useState } from "react";

const Hero = () => {
  const [fontSize, setFontSize] = useState(16); // Default font size

  useEffect(() => {
    const interval = setInterval(() => {
      const rootElement = document.getElementById("root");
      if (rootElement) {
        const newFontSize = parseInt(
          window.getComputedStyle(rootElement).fontSize,
          10
        );
        if (newFontSize !== fontSize) {
          setFontSize(newFontSize);
        }
      }
    }, 500); // Check every 500 milliseconds (0.5 second)

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, [fontSize]);
  return (
<<<<<<< HEAD
    <div className="grid grid-cols-1 md:grid-cols-2 gap-20 py-16 md:px-8 lg:px-12 items-center justify-center md:ml-20 sm:ml-10 min-w-">
      <div className="flex justify-end items-center">
        <div className="flex flex-col gap-8 items-center text-center lg:items-start lg:text-left text-align:ceter">
          <h1 className="custom-text dark:text-white text-3xl tracking-widest md:text-4xl lg:text-5xl font-semibold">
            Funding futures,{" "}
            <span className="custom-green">changing lives</span>.
          </h1>
          <p className="custom-text text-sm md:text-sm lg:text-sm custom-grey dark:text-[#dddddd]">
            Simplify your life with MA everywhere, our online and mobile
            self-service platform that lets you instantly connect to your grants
            information.
          </p>
          <button className="bg-blue-500 text-white py-2 px-4 rounded custom-green-background">
            Register
          </button>
        </div>
=======
    <div className="grid grid-cols-1 md:grid-cols-2 gap-20 py-16 px-4 md:px-8 lg:px-12 items-center lg:ml-40 md:ml-20">
      {" "}
      <div className="flex flex-col gap-8 lg:ml-20">
        <h1 className="text-black dark:text-white text-3xl tracking-widest md:text-4xl lg:text-5xl font-semibold">
          Funding futures, <span className="custom-green"> changing lives</span>
          .
        </h1>
        <p className="text-black text-sm md:text-sm lg:text-sm custom-grey dark:text-[#dddddd]">
          Simplify your life with MA everywhere, our online and mobile
          self-service platform that lets you instantly connect to your grants
          information.
        </p>
        <button className="self-start bg-blue-500 text-white py-2 px-4 rounded custom-green-background">
          Register
        </button>
>>>>>>> fae0b24 (Font Size and Theme settings implemented)
      </div>
      <div className="flex justify-center">
        <Image
          src={Four_Circle}
          alt="Logo"
          width={20 * fontSize}
          height={"auto"}
          className="rounded-3xl transition-all duration-300"
        />
      </div>
    </div>
  );
};

export default Hero;
