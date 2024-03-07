"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import VerificationFailMessage from "./VerificationFailMessage";

const VerificationSuccessMessage = () => {
  const [countdown, setCountdown] = useState(3); // Start the countdown at 3 seconds
  const router = useRouter();

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
    <div className="fixed top-0 left-0 w-full p-4 bg-green-500 text-white text-center shadow-md">
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
      className="flex items-center justify-center min-h-screen"
      style={{
        backgroundImage:
          "url('https://images.rawpixel.com/image_800/czNmcy1wcml2YXRlL3Jhd3BpeGVsX2ltYWdlcy93ZWJzaXRlX2NvbnRlbnQvbHIvcm00MjItMDQ3LWtxOTJ3eDl5LmpwZw.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {display && <VerificationFailMessage text={errorMsg} />}
      
      <div
        className="flex flex-col md:flex-row bg-white shadow-xl overflow-hidden rounded-lg"
        style={{ maxWidth: "1200px", width: "100%" }}
      >
        <div className="flex flex-col w-full p-16 space-y-8">
          <div className="space-y-6">
            <div>{showSuccessMessage && <VerificationSuccessMessage />}</div>
            <h2 className="text-center lg:text-5xl md:text-5xl text-4xl mb-4 mt-8 font-semibold text-black">
              Reset your password
            </h2>
          </div>
          {!resetClicked ? (
            <>
              <h3 className="text-center text-sm mb-8 mt-8 font-semibold text-black">
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
                <div className="bg-green-500 rounded max-w-xs w-full rounded-full">
                  <button
                    type="submit"
                    className="text-white text-md w-full font-semibold bg-green-500 hover:bg-green-600 rounded-full h-12 px-6 transition duration-150 ease-in-out text-black"
                  >
                    Reset Password
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div>
              <div className="text-center lg:text-lg md:text-lg text-sm mb-8 mt-8 text-black">
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
                  className="text-white text-md font-semibold bg-green-500 hover:bg-green-600 rounded-full h-12 px-6 transition duration-150 ease-in-out"
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
                className="text-green-500 hover:underline mr-5 "
              >
                Login
              </Link>
            </p>
            <p className="text-black">or</p>
            <p>
              <Link
                href="/signup"
                className="text-green-500 hover:underline ml-5"
              >
                Register
              </Link>
            </p>
          </div>
          <div className="text-center lg:text-md text-sm text-black">
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
// export default { ForgotPassword, resetCode }
// we cant export this because resetCode doesnt get populated as soon as page is rendered
// need to wait for post req to complete then send it like that

