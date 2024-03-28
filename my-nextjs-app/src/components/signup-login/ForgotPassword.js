"use client";

import Link from "next/link";
import { useState, useEffect, useContext } from "react";
import { useRouter } from "next/navigation";
import ThemeContext from "../utils/ThemeContext";
import ColourBlindnessContext from "@/components/utils/ColorBlindnessContext";
import ReducedMotionContext from "../utils/ReducedMotionContext";
import { getcbMode } from "@/components/utils/cbMode";
import axios from "axios";
import VerificationFailMessage from "./VerificationFailMessage";

const VerificationSuccessMessage = () => {
  const [countdown, setCountdown] = useState(3); // Start the countdown at 3 seconds
  const router = useRouter();

  const cbMode = useContext(ColourBlindnessContext)
  const { protanopia, deuteranopia, tritanopia } = getcbMode(cbMode)

  useEffect(() => {
    if (countdown === 0) {
      router.push("/reset_password"); // Redirect to the reset_password page when countdown reaches 0
      return;
    }

    // Decrease the countdown by 1 every second
    const timerId = setTimeout(() => {
      setCountdown(countdown - 1);
    }, 1000);

    return () => clearTimeout(timerId); // Cleanup the timer when the component unmounts or countdown changes
  }, [countdown, router]);

  return (
    <div className={`fixed top-0 left-0 w-full p-4 ${protanopia ? "custom-green-background-pt" : deuteranopia ? "custom-green-background-dt" : tritanopia ? "custom-green-background-tr" : "custom-green-background"} text-white text-center shadow-md`}>
      Verification successful! Redirecting to reset password page in {countdown}{" "}
      seconds...
    </div>
  );
};

const ForgotPassword = () => {
  const [data, setData] = useState("");
  const [resetClicked, setResetClicked] = useState(false); // store whether reset password button is clicked
  const [code, setCode] = useState(""); // Store the entered code
  const [codeChecked, setCodeChecked] = useState(false); // Store whether the code is correct or not
  const [showWarning, setShowWarning] = useState(false); // store whether to show the warning or not based on the code
  const [verifyClicked, setVerifyClicked] = useState(false); // State to track verify button click
  const [showSuccessMessage, setShowSuccessMessage] = useState(false); //  State for showing the success message
  const [emailValue, setEmailValue] = useState("");
  const [display, setDisplay] = useState(false); // for displaying failed msg
  const [resetCode, setResetCode] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const router = useRouter(); // used for redirection

  const cbMode = useContext(ColourBlindnessContext)
  const { protanopia, deuteranopia, tritanopia } = getcbMode(cbMode)
  const isReducedMotion = useContext(ReducedMotionContext)
  const theme = useContext(ThemeContext)

  const handleForgotSubmit = (e) => {
    e.preventDefault();
    // TODO: handle email does not exist in db frontend
    axios
    .post("http://localhost:5000/forgot_password", {
      Email: emailValue,
    })
    .then((response) => {
      setData(response.data.message);
      setResetCode(response.data.code)
      setResetClicked(true);
      console.log(response.data.code);
      localStorage.setItem('resetCode', JSON.stringify(response.data.code));
      localStorage.setItem('email', emailValue);
    })
    .catch((error) => {
      setDisplay(true);
      setErrorMsg(error.response.data.message);
      setResetClicked(false);
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

  const getResetCode = () => {
    return resetCode;
  }

  const handleCodeChange = (e) => {
    setCode(e.target.value); // Update the code based on input
    setShowWarning(false); // remove the warning once the user starts to type
    if (verifyClicked) {
      // If verify has already been clicked, check the code immediately
      checkCode(e.target.value);
    }
  };

  const checkCode = (inputCode) => {
    if (inputCode === resetCode) {
      setCodeChecked(true);
      setShowWarning(false);
      setShowSuccessMessage(true);
    } else {
      setCodeChecked(false);
      setShowWarning(true);
      setCode(""); // clean the text box for the user to re-enter code
    }
  };

  const handleVerify = (e) => {
    e.preventDefault();
    setVerifyClicked(true); // Mark verify as clicked
    checkCode(code); // Check the code
    setVerifyClicked(false); // let the user re-enthe the code
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
      
      <div
        className="flex flex-col md:flex-row bg-white dark:d-custom-dark-grey-background shadow-xl overflow-hidden rounded-lg"
        style={{ maxWidth: "1200px", width: "100%" }}
      >
        <div className="flex flex-col w-full p-16 space-y-8">
          <div className="space-y-6">
            <div>{showSuccessMessage && <VerificationSuccessMessage />}</div>
            <h2 className="text-center lg:text-5xl md:text-5xl text-4xl mb-4 mt-8 font-semibold text-black dark:d-text">
              Reset your password
            </h2>
          </div>
          {!resetClicked ? (
            <>
              <h3 className="text-center text-sm mb-8 mt-8 font-semibold text-black dark:d-text">
                Enter your email address below and we'll send you a link to
                reset your password.
              </h3>
              <form
                className="flex flex-col space-y-6 items-center"
                onSubmit={handleForgotSubmit}
              >
                <input
                  type="email"
                  placeholder="Email"
                  value={emailValue}
                  onChange={(e) => setEmailValue(e.target.value)}
                  className="p-4 text-lg rounded-full border lg:max-w-lg md:max-w-md max-w-xs w-full text-black"
                  required
                />
                <div className={`rounded max-w-xs w-full rounded-full`}>
                  <button
                    type="submit"
                    className={`text-white text-md w-full font-semibold ${protanopia ? "custom-green-background-pt" : deuteranopia ? "custom-green-background-dt" : tritanopia ? "custom-green-background-tr" : "custom-green-background"} hover:scale-105 rounded-full h-12 px-6 ${isReducedMotion ? "" : "transition duration-150 ease-in-out"}`}
                  >
                    Reset Password
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div>
              <div className="text-center lg:text-lg md:text-lg text-sm mb-8 mt-8 text-black dark:d-text">
                <p>
                  Check your inbox for a verification code.
                  <br />
                  If you don't receive an email, and it's not in your spam
                  folder,
                  <br />
                  this could mean you signed up with a different address.
                </p>
              </div>
              <div className="flex justify-center mt-4">
                <input
                  type="text"
                  value={code}
                  onChange={handleCodeChange}
                  placeholder="Enter your verification code"
                  className="p-4 text-lg rounded-full border lg:max-w-lg md:max-w-md max-w-xs w-full text-black"
                  aria-label="Verification Code"
                  required
                />
              </div>
              {showWarning && (
                <p className="text-red-500 text-xs text-center mt-5">
                  Verification Code is incorrect, please enter again
                </p>
              )}
              <div className="flex justify-center mt-4">
                <button
                  onClick={handleVerify}
                  className={`text-white text-md font-semibold ${protanopia ? "custom-green-background-pt" : deuteranopia ? "custom-green-background-dt" : tritanopia ? "custom-green-background-tr" : "custom-green-background"} hover:scale-105 rounded-full h-12 px-6 ${isReducedMotion ? "" : "transition duration-150 ease-in-out"}`}
                  aria-label="Verify Button"
                >
                  Verify
                </button>
              </div>
            </div>
          )}
          <div className="border-t border-gray-300 my-8"></div>
          <div className="text-center mt-8 flex justify-center items-center lg:text-2xl md:text-xl text-lg">
            <p>
              <Link
                href="/login"
                className={`${protanopia ? "custom-green-pt dark:d-custom-green-color-blind" : deuteranopia ? "custom-green-dt dark:d-custom-green-color-blind" : tritanopia ? "custom-green-tr dark:d-custom-green-color-blind" : "custom-green"} hover:underline mr-5`}
              >
                Login
              </Link>
            </p>
            <p className="text-black dark:d-text">or</p>
            <p>
              <Link
                href="/signup"
                className={`${protanopia ? "custom-green-pt dark:d-custom-green-color-blind" : deuteranopia ? "custom-green-dt dark:d-custom-green-color-blind" : tritanopia ? "custom-green-tr dark:d-custom-green-color-blind" : "custom-green"} hover:underline ml-5`}
              >
                Register
              </Link>
            </p>
          </div>
          <div className="text-center lg:text-md text-sm text-black dark:d-text">
            <p>
              Still can't login? If you need additional assistance, <br />
              e-mail 5ABC@gmail.com
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ForgotPassword;
// export { handleForgotSubmit };
export const tempCode = '786110';
// export default { ForgotPassword, resetCode }
// we cant export this because resetCode doesnt get populated as soon as page is rendered
// need to wait for post req to complete then send it like that

