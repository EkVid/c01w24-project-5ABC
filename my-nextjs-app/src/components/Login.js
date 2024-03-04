"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import Four_Circle from "../../public/logo.svg";
import Image from "next/image";
import FontSizeContext from "@/components/utils/FontSizeContext";
import { useContext, useState } from "react";
import show_password from "../../public/password_eye.svg";
import hide_password from "../../public/password_eye_cross.svg";
import axios from "axios";
import { useRouter } from "next/navigation";
import VerificationFailMessage from "./VerificationFailMessage";

const Login = () => {
  const [data, setData] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [emailValue, setEmailValue] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const router = useRouter();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // TODO: route to welcome user landing page otherwise leave him on same page
    try {
      const response = axios.post("http://localhost:5000/login", {
        Email: emailValue,
        Password: newPassword,
      });
      setData(response.data.message);
      console.log(emailValue, newPassword);
      console.log(data);
    } catch (error) {
      console.log(data);
    }
  };

  const fontSizeMultiplier = useContext(FontSizeContext) / 100;

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
      {/* <VerificationFailMessage
        text={"Login failed. Please double-check your email and password."}
      />
      TODO: render this with logic for route 401 */}

      {/* <VerificationFailMessage
        text={"An unexpected error occured, please try again"}
      />
      TODO: render this with logic for route 400 and 500  */}
      <div
        className="flex flex-col md:flex-row bg-white shadow-xl overflow-hidden rounded-lg"
        style={{ maxWidth: "1200px" }}
      >
        <div className="flex flex-col w-full md:w-1/2 lg:w-3/5 xl:w-3/5 p-16 space-y-8">
          <div className="space-y-6 flex flex-col items-center md:items-start">
            <Image
              src={Four_Circle}
              alt="Logo"
              width={80 * fontSizeMultiplier}
              height={80 * fontSizeMultiplier}
              className="rounded-3xl"
            />
            <h2 className="text-center lg:text-6xl md:text-5xl text-4xl mb-8 mt-8 font-semibold text-black">
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
              <h2 className="text-center text-xl hover:underline hover:text-blue-500 text-black">
                Forgot password?
              </h2>
            </Link>{" "}
            <div className="bg-green-500 rounded max-w-xs w-full rounded-full ">
              <button
                type="submit"
                className="text-white text-md w-full font-semibold bg-green-500 hover:bg-green-600 rounded-full h-12 px-6 transition duration-150 ease-in-out"
              >
                Sign In
              </button>
            </div>
          </form>
        </div>
        <div
          className="w-full md:w-1/2 lg:w-2/5 xl:w-2/5 p-16 space-y-8 flex flex-col justify-center items-center"
          style={{ backgroundColor: "rgb(80, 150, 80)" }}
        >
          <h2 className="lg:text-5xl md:text-4xl text-2xl text-center text-white font-semibold">
            New here?
          </h2>
          <p className="lg:text-2xl md:text-xl text-l text-center text-white">
            Sign up and discover a great amount of new opportunities!
          </p>
          <div className="bg-white rounded max-w-xs w-full rounded-full">
            <Link href="/signup">
              <button className="inline-block text-black text-md w-full font-semibold h-12 px-6 bg-white hover:bg-gray-100 rounded-full transition duration-150 ease-in-out">
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
