"use client";
import { useState, useEffect, useContext } from "react";
import { useRouter } from "next/navigation";
import FontSizeContext from "@/components/utils/FontSizeContext";
import show_password from "../../../public/password_eye.svg";
import hide_password from "../../../public/password_eye_cross.svg";
import Image from "next/image";
import VerificationFailMessage from "./VerificationFailMessage";
import { tempCode } from './ForgotPassword';
import axios from "axios";

const VerificationSuccessMessage = () => {
  const [countdown, setCountdown] = useState(3); // Start the countdown at 3 seconds
  const router = useRouter();

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
    <div className="fixed top-0 left-0 w-full p-4 bg-green-500 text-white text-center shadow-md">
      Password Reset successful! Redirecting you to Login page in {countdown}{" "}
      seconds...
    </div>
  );
};

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const [matchError, setMatchError] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showWarning, setShowWarning] = useState(false); // store whether to show the warning or not based on the code
  const [code, setCode] = useState(""); // Store the entered code
  const [display, setDisplay] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");


  const fontSizeMultiplier = useContext(FontSizeContext) / 100;

  const onValueChange = (value) => {
    console.log('Received value:', value);
  };

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

  const handleCodeFocus = () => {
    setCode("");
    setShowWarning(false);
  };

  const handleCodeChange = (e) => {
    const inputCode = e.target.value;
    setCode(inputCode);
    setShowWarning(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setPasswordError(!validatePassword(newPassword));
    setMatchError(newPassword !== confirmPassword);
    var response = localStorage.getItem('resetCode');
    var emailValue = localStorage.getItem('email');
    var resetCode = JSON.parse(response);
    
    setShowWarning(code !== resetCode);

    if (
      validatePassword(newPassword) &&
      newPassword === confirmPassword &&
      code == resetCode
    ) {
      axios
        .post("http://localhost:5000/reset_password", {
          Email: emailValue,
          ResetCode: resetCode,
          NewPassword: newPassword

        })
        .then((response) => {
          setData(response.data.message);
          console.log(response.data.message);
        })
        .catch((error) => {
          setDisplay(true);
          // setErrorMsg(error.response.data.message);
          if (error.response) {
            console.log(error.response.status);
            console.log(error.response.data);
          } else if (error.request) {
            console.log("No response received:", error.request);
          } else {
            console.log("Error:", error.message);
          }
        });
      setShowSuccessMessage(true);
    }
  };

  const toggleNewPasswordVisibility = () => {
    setShowNewPassword(!showNewPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
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
        style={{ maxWidth: "1000px", width: "100%" }}
      >
        <div className="flex flex-col w-full p-16 space-y-8">
          <div className="space-y-6">
            <div>{showSuccessMessage && <VerificationSuccessMessage />}</div>
            <h2 className="text-center lg:text-5xl md:text-5xl text-4xl mb-8 mt-8 font-semibold text-black">
              Reset your password
            </h2>
          </div>
          <form
            className="flex flex-col space-y-6 items-center w-full"
            onSubmit={handleSubmit}
          >
            {/* New Password Input */}
            <div className="text-left w-full text-sm px-4 lg:max-w-lg md:max-w-md max-w-xs font-semibold text-green-600">
              <p>New Password</p>
              <p
                className={`text-red-500 text-xs mt-5 Participant 5: 5 ${
                  passwordError ? "block" : "hidden"
                }`}
              >
                Password needs to be minimum 7 characters long, including at
                least 1 alphabet, 1 number, and 1 special symbol
              </p>
            </div>
            <div className="relative flex items-center w-full lg:max-w-lg md:max-w-md max-w-xs">
              <input
                type={showNewPassword ? "text" : "password"}
                placeholder="New Password"
                className="p-4 text-lg rounded-full border w-full text-black pr-10"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                onBlur={handlePasswordBlur}
                onFocus={handlePasswordFocus}
                required
              />
              <div
                onClick={toggleNewPasswordVisibility}
                className="cursor-pointer absolute right-0 mr-4 flex items-center justify-center h-full"
              >
                {showNewPassword ? (
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
            {/* Confirm New Password Input */}
            <div className="text-left w-full text-sm px-4 lg:max-w-lg md:max-w-md max-w-xs text-green-600 font-semibold">
              <p>Confirm New Password</p>
              <p
                className={`text-red-500 text-xs mt-5 ${
                  matchError ? "block" : "hidden"
                }`}
              >
                Passwords don't match
              </p>
            </div>
            <div className="relative flex items-center w-full lg:max-w-lg md:max-w-md max-w-xs">
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm New Password"
                className="p-4 text-lg rounded-full border w-full text-black pr-10"
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
            <div className="text-left w-full text-sm px-4 lg:max-w-lg md:max-w-md max-w-xs text-green-600 font-semibold">
              <p>Verification Code</p>
            </div>
            <div className="relative flex items-center w-full lg:max-w-lg md:max-w-md max-w-xs">
              <input
                type="text"
                placeholder="Enter your verification code"
                className="p-4 text-lg rounded-full border w-full text-black pr-10"
                value={code}
                onChange={handleCodeChange}
                onFocus={handleCodeFocus}
                required
              />
            </div>
            {showWarning && (
              <p className="text-red-500 text-xs text-center mt-5">
                Verification Code is incorrect, please enter again
              </p>
            )}
            <div className="bg-green-500 rounded max-w-xs w-full rounded-full">
              <button
                type="submit"
                className="text-white text-md w-full font-semibold bg-green-500 hover:bg-green-600 rounded-full h-12 px-6 transition duration-150 ease-in-out"
              >
                Save Password
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;