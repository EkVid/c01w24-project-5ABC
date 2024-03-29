"use client";

import Four_Circle from "../../public/logo.svg";
import cbFour_Circle from "../../public/cblogo.svg"
import trFour_Circle from "../../public/trlogo.svg"
import Image from "next/image";
import FontSizeContext from "@/components/utils/FontSizeContext";
import monochromeFour_Circle from "../../public/monochromelogo.svg"
import ColourBlindnessContext from "@/components/utils/ColorBlindnessContext";
import { getcbMode } from "@/components/utils/cbMode";
import { useContext } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";

const Hero = () => {
  const fontSizeMultiplier = useContext(FontSizeContext) / 100;
  const cbMode = useContext(ColourBlindnessContext)
  const { protanopia, deuteranopia, tritanopia, monochrome } = getcbMode(cbMode)

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-20 py-16 md:px-8 lg:px-12 items-center justify-center md:ml-20 sm:ml-10 min-w-">
      <div className="flex justify-end items-center">
        <div className="flex flex-col gap-8 items-center text-center lg:items-start lg:text-left text-align:ceter">
          <h1 className="custom-text dark:d-text text-3xl tracking-widest md:text-4xl lg:text-5xl font-semibold">
            Funding futures,{" "}
            <span className={`${protanopia ? "custom-green-pt dark:d-custom-green-color-blind" : deuteranopia ? "custom-green-dt dark:d-custom-green-color-blind" : tritanopia ? "custom-green-tr dark:d-custom-green-color-blind-tr" : "custom-green"}`}>changing lives</span>.
          </h1>
          <p className="custom-text text-sm md:text-sm lg:text-sm custom-grey dark:text-[#dddddd]">
            Simplify your life with MA everywhere, our online and mobile
            self-service platform that lets you instantly connect to your grants
            information.
          </p>
          <button className={`text-white py-2 px-4 rounded ${protanopia ? "custom-green-background-pt" : deuteranopia ? "custom-green-background-dt" : tritanopia ? "custom-green-background-tr" : monochrome ? "custom-green-background-mo" : "custom-green-background"}`}>
            <Link href="/signup">
              Register
            </Link>
          </button>
        </div>
      </div>
      <div className="flex justify-center">
        <Image
          src={protanopia ? cbFour_Circle : deuteranopia ? cbFour_Circle : tritanopia ? trFour_Circle : Four_Circle}
          alt="Logo"
          width={300 * fontSizeMultiplier}
          height={"auto"}
          className="rounded-3xl"
        />
      </div>
    </div>
  );
};

export default dynamic(() => Promise.resolve(Hero), { ssr: false });
