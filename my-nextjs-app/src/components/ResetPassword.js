"use client";
import { useState, useEffect } from "react";
// Assuming you're using react-router-dom for navigation
import { useRouter } from "next/navigation";

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
  const [showSuccessMessage, setShowSuccessMessage] = useState(false); //  State for showing the success message

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

  const handleSubmit = (e) => {
    e.preventDefault();
    setPasswordError(!validatePassword(newPassword));
    setMatchError(newPassword !== confirmPassword);

    if (validatePassword(newPassword) && newPassword === confirmPassword) {
      setShowSuccessMessage(true); // Show the verification success message
    }
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
      <div
        className="flex flex-col md:flex-row bg-white shadow-xl overflow-hidden rounded-lg"
        style={{ maxWidth: "1200px", width: "100%" }}
      >
        <div className="flex flex-col w-full p-16 space-y-8">
          <div className="space-y-6">
            <div>{showSuccessMessage && <VerificationSuccessMessage />}</div>
            <h2 className="text-center lg:text-5xl md:text-5xl text-4xl mb-8 mt-8 font-semibold text-black">
              Reset your password{" "}
            </h2>
          </div>
          <form
            className="flex flex-col space-y-6 items-center w-full"
            onSubmit={handleSubmit}
          >
            <div className="text-left w-full text-sm px-4 lg:max-w-lg md:max-w-md max-w-xs font-semibold text-green-600">
              <p>New Password</p>
              <p
                className={`text-red-500 text-xs mt-5 ${
                  passwordError ? "block" : "hidden"
                }`}
              >
                Password needs to be minimum 7 characters long, including at
                least 1 alphabet, 1 number, and 1 special symbol
              </p>
            </div>

            <input
              type="password"
              placeholder="New Password"
              className="p-4 text-lg rounded-full border lg:max-w-lg md:max-w-md max-w-xs w-full text-black"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              onBlur={handlePasswordBlur}
              onFocus={handlePasswordFocus}
              required
            />
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
            <input
              type="password"
              placeholder="Confirm New Password"
              className="p-4 text-lg rounded-full border lg:max-w-lg md:max-w-md max-w-xs w-full text-black"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              onBlur={handleMatchBlur}
              onFocus={handleMatchFocus}
              required
            />
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
