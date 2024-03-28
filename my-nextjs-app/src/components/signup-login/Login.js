"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import Four_Circle from "../../../public/logo.svg";
import cbFourCircle from "../../../public/cblogo.svg"
import Image from "next/image";
import FontSizeContext from "@/components/utils/FontSizeContext";
import ThemeContext from "../utils/ThemeContext";
import ColourBlindnessContext from "@/components/utils/ColorBlindnessContext";
import ReducedMotionContext from "../utils/ReducedMotionContext";
import { getcbMode } from "@/components/utils/cbMode";
import { useContext, useState } from "react";
import show_password from "../../../public/password_eye.svg";
import hide_password from "../../../public/password_eye_cross.svg";
import axios from "axios";
import { useRouter } from "next/navigation";
import VerificationFailMessage from "./VerificationFailMessage";

const Login = () => {
  const [data, setData] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [emailValue, setEmailValue] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const router = useRouter();
  const [display, setDisplay] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const cbMode = useContext(ColourBlindnessContext)
  const { protanopia, deuteranopia, tritanopia } = getcbMode(cbMode)
  const fontSizeMultiplier = useContext(FontSizeContext) / 100;
  const isReducedMotion = useContext(ReducedMotionContext)
  const theme = useContext(ThemeContext)

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    axios
      .post("http://localhost:5000/login", {
        Email: emailValue,
        Password: newPassword,
      })
      .then((response) => {
        const userData = {
          email: response.data.UserInfo.Email,
          token: response.data.token,
          type: response.data.UserInfo.Usertype,
        }
        sessionStorage.setItem('userData', JSON.stringify(userData))
        setData(response.data.message);
        if(response.data.UserInfo.Usertype === 'grantor'){
          router.push('/dashboard')
        }
        else if(response.data.UserInfo.Usertype === 'grantee'){
          router.push('/grantee_dashboard')
        }
      })
      .catch((error) => {
        setDisplay(true);
        setErrorMsg(error.response.data);
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

  return (
    <div
      className={`flex items-center justify-center py-4 flex-grow ${theme === 'light' ? "" : "d-custom-navy-background border-t border-white"}`}
      style={{
          backgroundImage:`${theme === 'light' ? "url('https://images.rawpixel.com/image_800/czNmcy1wcml2YXRlL3Jhd3BpeGVsX2ltYWdlcy93ZWJzaXRlX2NvbnRlbnQvbHIvcm00MjItMDQ3LWtxOTJ3eDl5LmpwZw.jpg')" : ""}`,
          backgroundSize: "cover",
          backgroundPosition: "center",
      }}
    >
      {/* #TODO : fixed the operator, need to check on Alykhan's side since my backend is a bit weird*/}
      {display && <VerificationFailMessage text={errorMsg} />}
      <div
        className="flex flex-col md:flex-row bg-white dark:d-custom-dark-grey-background shadow-xl overflow-hidden rounded-lg"
        style={{ maxWidth: "1200px" }}
      >
        <div className="flex flex-col w-full md:w-1/2 lg:w-3/5 xl:w-3/5 p-16 space-y-8">
          <div className="space-y-6 flex flex-col items-center md:items-start">
            <Image
              src={protanopia || deuteranopia || tritanopia ? cbFourCircle : Four_Circle}
              alt="Logo"
              width={80 * fontSizeMultiplier}
              height={80 * fontSizeMultiplier}
              className="rounded-3xl"
            />
            <h2 className="text-center lg:text-6xl md:text-5xl text-4xl mb-8 mt-8 font-semibold text-black dark:d-text">
              Sign in to your account
            </h2>
          </div>

          <form
            className="flex flex-col space-y-6 items-center"
            onSubmit={handleSubmit}
          >
            <input
              type="email"
              placeholder="Email"
              value={emailValue}
              onChange={(e) => setEmailValue(e.target.value)}
              className="p-4 text-lg rounded-full border lg:max-w-lg md:max-w-md max-w-xs w-full text-black"
            />
            <div className="relative flex items-center w-full lg:max-w-lg md:max-w-md max-w-xs">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="p-4 text-lg rounded-full border w-full text-black pr-10"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
              <div
                onClick={togglePasswordVisibility}
                className="cursor-pointer absolute right-0 mr-4 flex items-center justify-center h-full"
              >
                {showPassword ? (
                  <Image
                    src={hide_password}
                    alt="Logo"
                    width={30 * fontSizeMultiplier}
                    height={30 * fontSizeMultiplier}
                    className="rounded-3xl"
                  />
                ) : (
                  <Image
                    src={show_password}
                    alt="Logo"
                    width={30 * fontSizeMultiplier}
                    height={30 * fontSizeMultiplier}
                    className="rounded-3xl"
                  />
                )}
              </div>
            </div>
            <Link href="/forgot_password">
              <h2 className="text-center text-xl hover:underline hover:text-blue-500 text-black dark:d-text">
                Forgot password?
              </h2>
            </Link>{" "}
            <div className="bg-green-500 max-w-xs w-full rounded-full ">
              <button
                type="submit"
                className={`text-white text-md w-full font-semibold ${protanopia ? "custom-green-background-pt" : deuteranopia ? "custom-green-background-dt" : tritanopia ? "custom-green-background-tr" : "custom-green-background"} hover:scale-105 rounded-full h-12 px-6 ${isReducedMotion ? "" : "transition duration-150 ease-in-out"}`}
              >
                Sign In
              </button>
            </div>
          </form>
        </div>
        <div
          className={`w-full md:w-1/2 lg:w-2/5 xl:w-2/5 p-16 space-y-8 flex flex-col justify-center items-center ${protanopia ? "custom-green-background-pt" : deuteranopia ? "custom-green-background-dt" : tritanopia ? "custom-green-background-tr" : "custom-green-background"} ${isReducedMotion ? "" : "transition duration-150 ease-in-out"}`}
        >
          <h2 className="lg:text-5xl md:text-4xl text-2xl text-center text-white font-semibold">
            New here?
          </h2>
          <p className="lg:text-2xl md:text-xl text-l text-center text-white">
            Sign up and discover a great amount of new opportunities!
          </p>
          <div className="bg-white max-w-xs w-full rounded-full">
            <Link href="/signup">
              <button className={`inline-block text-black text-md w-full font-semibold h-12 px-6 bg-white hover:scale-105 rounded-full ${isReducedMotion ? "" : "transition duration-150 ease-in-out"}`}>
                Sign Up
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default dynamic(() => Promise.resolve(Login), { ssr: false });
