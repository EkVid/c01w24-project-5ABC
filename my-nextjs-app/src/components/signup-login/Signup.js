"use client";
import React, { useState, useEffect, useContext } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import Four_Circle from "../../../public/logo.svg";
import cbFour_Circle from "../../../public/cblogo.svg"
import trFour_Circle from "../../../public/trlogo.svg"
import Image from "next/image";
import FontSizeContext from "@/components/utils/FontSizeContext";
import ThemeContext from "../utils/ThemeContext";
import ColourBlindnessContext from "@/components/utils/ColorBlindnessContext";
import ReducedMotionContext from "../utils/ReducedMotionContext";
import { getcbMode } from "@/components/utils/cbMode";
import { useRouter } from "next/navigation";
import show_password from "../../../public/password_eye.svg";
import hide_password from "../../../public/password_eye_cross.svg";
import axios from "axios";
import VerificationFailMessage from "./VerificationFailMessage";

const VerificationSuccessMessage = () => {
  const [countdown, setCountdown] = useState(3); // Start the countdown at 3 seconds
  const router = useRouter();
  const cbMode = useContext(ColourBlindnessContext)
  const { protanopia, deuteranopia, tritanopia, monochrome } = getcbMode(cbMode)

  useEffect(() => {
    if (countdown === 0) {
      router.push("/login"); // Redirect to the login page when countdown reaches 0
      return;
    }

    // Decrease the countdown by 1 every second
    const timerId = setTimeout(() => {
      setCountdown(countdown - 1);
    }, 1000);

    return () => clearTimeout(timerId); // Cleanup the timer when the component unmounts or countdown changes
  }, [countdown, router]);

  return (
    <div className={`fixed top-0 left-0 w-full p-4 text-white text-center shadow-md ${protanopia ? "custom-green-background-pt" : deuteranopia ? "custom-green-background-dt" : tritanopia ? "custom-green-background-tr" : monochrome ? "custom-green-background-mo" : "custom-green-background"}`}>
      Register successful! Redirecting you to Login page in {countdown}{" "}
      seconds...
    </div>
  );
};

const SignUp = () => {
  const [data, setData] = useState("");
  const [selection, setSelection] = useState("grantee");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [emailValue, setEmailValue] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const [matchError, setMatchError] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false); //  State for showing the success message
  const [display, setDisplay] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const cbMode = useContext(ColourBlindnessContext)
  const { protanopia, deuteranopia, tritanopia, monochrome } = getcbMode(cbMode)
  const fontSizeMultiplier = useContext(FontSizeContext) / 100;
  const isReducedMotion = useContext(ReducedMotionContext)
  const theme = useContext(ThemeContext)

  const validatePassword = (password) => {
    const regex =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{7,}$/;
    return regex.test(password);
  };

  const handlePasswordBlur = () => {
    setPasswordError(!validatePassword(newPassword));
  };

  const handlePasswordFocus = () => {
    setPasswordError(false);
  };

  const handleMatchBlur = () => {
    setMatchError(newPassword !== confirmPassword);
  };

  const handleMatchFocus = () => {
    setMatchError(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setPasswordError(!validatePassword(newPassword));
    setMatchError(newPassword !== confirmPassword);

    axios
      .post("http://localhost:5000/signup", {
        Email: emailValue,
        Password: newPassword,
        Usertype: selection,
      })
      .then((response) => {
        setData(response.data.message);
        if (validatePassword(newPassword) && newPassword === confirmPassword) {
          setShowSuccessMessage(true); // Show the verification success message
        }
      })
      .catch((error) => {
        setDisplay(true);
        setErrorMsg(error.response.data.message);
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

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
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
      {display && <VerificationFailMessage text={errorMsg} />}
      <div className="flex flex-col md:flex-row bg-white dark:d-custom-dark-grey-background shadow-lg overflow-hidden rounded-lg">
        <div className="flex flex-col w-full md:w-4/6 p-12 space-y-6 ">
          <div className="flex flex-col items-center lg:items-start space-y-4">
            <Image
              src={protanopia ? cbFour_Circle : deuteranopia ? cbFour_Circle : tritanopia ? trFour_Circle : Four_Circle}
              alt="Logo"
              width={80 * fontSizeMultiplier}
              height={80 * fontSizeMultiplier}
              className="rounded-3xl"
            />
            <div>{showSuccessMessage && <VerificationSuccessMessage />}</div>
            <h2 className="text-center lg:text-5xl md:text-5xl text-3xl mb-6 mt-6 font-semibold text-black dark:d-text">
              Welcome to the future of funding
            </h2>
          </div>
          <p className="text-center text-lg mt-4 text-black dark:d-text">
            Already have an account?{" "}
            <Link href="/login" className={`${protanopia ? "custom-green-pt dark:d-custom-green-color-blind" : deuteranopia ? "custom-green-dt dark:d-custom-green-color-blind" : tritanopia ? "custom-green-tr dark:d-custom-green-color-blind-tr" : "custom-green"} hover:underline`}>
              Sign in
            </Link>
          </p>
          <div className="flex mb-6 justify-center ">
            <div
              className={`cursor-pointer px-4 py-3 text-lg flex items-center ${
                selection === "grantee" ? (protanopia ? "custom-green-background-pt text-white" : deuteranopia ? "custom-green-background-dt text-white" : tritanopia ? "custom-green-background-tr text-white" : monochrome ? "custom-green-background-mo text-white" : "bg-green-200 text-black") : "bg-green-100 text-black"
              } rounded mr-2`}
              onClick={() => setSelection("grantee")}
            >
              <span
                className={`inline-block h-6 w-6 mr-2 rounded-full border-2 ${
                  selection === "grantee"
                    ? (protanopia ? "custom-red-border-cb" : deuteranopia ? "custom-red-border-cb" : tritanopia ? "custom-red-border-cb" : monochrome ? "custom-red-border-cb" : "border-blue-500")
                    : "border-gray-400"
                } flex justify-center items-center`}
              >
                <span
                  className={`inline-block h-4 w-4 rounded-full ${
                    selection === "grantee" ? (protanopia ? "custom-red-background" : deuteranopia ? "custom-red-background" : tritanopia ? "custom-red-background" : monochrome ? "custom-red-background" : "bg-blue-500") : "bg-white"
                  }`}
                ></span>
              </span>
              <p>Grantee</p>
            </div>
            <div
              className={`cursor-pointer px-4 py-3 text-lg flex items-center ${
                selection === "grantor" ? (protanopia ? "custom-green-background-pt text-white" : deuteranopia ? "custom-green-background-dt text-white" : tritanopia ? "custom-green-background-tr text-white" : monochrome ? "custom-green-background-mo text-white" : "bg-green-200 text-black") : "bg-green-100 text-black"
              } rounded`}
              onClick={() => setSelection("grantor")}
            >
              <span
                className={`inline-block h-6 w-6 mr-2 rounded-full border-2 ${
                  selection === "grantor"
                    ? (protanopia ? "custom-red-border-cb" : deuteranopia ? "custom-red-border-cb" : tritanopia ? "custom-red-border-cb" : monochrome ? "custom-red-border-cb" : "border-blue-500")
                    : "border-gray-400"
                } flex justify-center items-center`}
              >
                <span
                  className={`inline-block h-4 w-4 rounded-full ${
                    selection === "grantor" ? (protanopia ? "custom-red-background" : deuteranopia ? "custom-red-background" : tritanopia ? "custom-red-background" : monochrome ? "custom-red-background" : "bg-blue-500") : "bg-white"
                  }`}
                ></span>
              </span>
              <p>Grantor</p>
            </div>
          </div>

          <form
            className="flex flex-col space-y-4 items-center"
            onSubmit={handleSubmit}
          >
            <input
              type="email"
              value={emailValue}
              onChange={(e) => setEmailValue(e.target.value)}
              placeholder="Email"
              className="p-4 text-lg rounded-full border lg:max-w-lg md:max-w-md max-w-xs w-full text-black"
              required
            />
            <p
              className={`text-red-500 text-sm mt-5 ${
                passwordError ? "block" : "hidden"
              }`}
            >
              Password needs to be minimum 7 characters long, including at least
              1 alphabet, 1 number, and 1 special symbol{" "}
            </p>
            <div className="relative flex items-center w-full lg:max-w-lg md:max-w-md max-w-xs">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="p-4 text-lg rounded-full border w-full text-black pr-10" // Added padding-right to make room for the icon
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                onBlur={handlePasswordBlur}
                onFocus={handlePasswordFocus}
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
            <p
              className={`text-red-500 text-sm mt-5 ${
                matchError ? "block" : "hidden"
              }`}
            >
              Passwords don't match
            </p>
            <div className="relative flex items-center w-full lg:max-w-lg md:max-w-md max-w-xs">
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Password"
                className="p-4 text-lg rounded-full border w-full text-black pr-10" // Added padding-right to make room for the icon
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                onBlur={handleMatchBlur}
                onFocus={handleMatchFocus}
                required
              />
              <div
                onClick={toggleConfirmPasswordVisibility}
                className="cursor-pointer absolute right-0 mr-4 flex items-center justify-center h-full"
              >
                {showConfirmPassword ? (
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
            <div className="bg-green-500 max-w-xs w-full rounded-full">
              <button
                type="submit"
                className={`text-white text-md w-full font-semibold ${protanopia ? "custom-green-background-pt" : deuteranopia ? "custom-green-background-dt" : tritanopia ? "custom-green-background-tr" : monochrome ? "custom-green-background-mo" : "custom-green-background"} hover:scale-105 rounded-full h-12 px-6 ${isReducedMotion ? "" : "transition duration-150 ease-in-out"}`}
              >
                Sign Up
              </button>
            </div>
          </form>
        </div>
        <div className={`w-full md:w-2/6 p-12 ${protanopia ? "custom-green-background-pt text-white" : deuteranopia ? "custom-green-background-pt text-white" : tritanopia ? "custom-green-background-pt text-white" : monochrome ? "custom-green-background-mo text-white" : "bg-green-100"} space-y-4 flex flex-col justify-center items-center`}>
          <img
            src="https://accoladetechnology.com/wp-content/uploads/2019/04/Icon-Financial-Services.png"
            alt="Service Icon"
            className="mx-auto"
            style={{ maxWidth: "40%", height: "auto" }}
          />
          <h2 className="text-xl text-center">
            The service of {selection === "grantee" ? "Grantee" : "Grantor"}{" "}
            includes:
          </h2>
          <div className="text-md text-left ml-6">
            {selection === "grantee" ? (
              <>
                <p>
                  <span className="text-green-500 mr-2">✔️</span>
                  Submit different grants
                </p>
                <br />
                <p>
                  <span className="text-green-500 mr-2">✔️</span>Board View of
                  all your grants
                </p>
                <br />
                <p>
                  <span className="text-green-500 mr-2">✔️</span>Able to view
                  personal eligible grants
                </p>
                <br />
                <p>
                  <span className="text-green-500 mr-2">✔️</span>Plus much
                  more...
                </p>
              </>
            ) : (
              <>
                <p>
                  <span className="text-green-500 mr-2">✔️</span>Approve or
                  decline grants
                </p>
                <br />
                <p>
                  <span className="text-green-500 mr-2">✔️</span>Board View of
                  all grants submissions
                </p>
                <br />
                <p>
                  <span className="text-green-500 mr-2">✔️</span>Set grants'
                  milestone progresses
                </p>
                <br />
                <p>
                  <span className="text-green-500 mr-2">✔️</span>Plus much
                  more...
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default dynamic(() => Promise.resolve(SignUp), { ssr: false });