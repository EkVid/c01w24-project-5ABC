"use client";
import React, { useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import Four_Circle from "../../public/logo.svg";
import Image from "next/image";
import FontSizeContext from "@/components/utils/FontSizeContext";
import { useContext } from "react";

const SignUp = () => {
  const [selection, setSelection] = useState("grantee");
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
      <div className="flex flex-col md:flex-row bg-white shadow-lg overflow-hidden rounded-lg">
        <div className="flex flex-col w-full md:w-4/6 p-12 space-y-6 ">
          <div className="flex flex-col items-center lg:items-start space-y-4">
            <Image
              src={Four_Circle}
              alt="Logo"
              width={80 * fontSizeMultiplier}
              height={80 * fontSizeMultiplier}
              className="rounded-3xl"
            />
            <h2 className="text-center lg:text-5xl md:text-5xl text-3xl mb-6 mt-6 font-semibold">
              Welcome to the future of funding
            </h2>
          </div>
          <p className="text-center text-lg mt-4">
            Already have an account?{" "}
            <Link href="/login" className="text-green-600 hover:text-green-700">
              Sign in
            </Link>
          </p>
          <div className="flex mb-6 justify-center ">
            <div
              className={`cursor-pointer px-4 py-3 text-lg flex items-center ${
                selection === "grantee" ? "bg-green-200" : "bg-green-100"
              } rounded mr-2`}
              onClick={() => setSelection("grantee")}
            >
              <span
                className={`inline-block h-6 w-6 mr-2 rounded-full border-2 ${
                  selection === "grantee"
                    ? "border-blue-500"
                    : "border-gray-400"
                } flex justify-center items-center`}
              >
                <span
                  className={`inline-block h-4 w-4 rounded-full ${
                    selection === "grantee" ? "bg-blue-500" : "bg-white"
                  }`}
                ></span>
              </span>
              Grantee
            </div>
            <div
              className={`cursor-pointer px-4 py-3 text-lg flex items-center ${
                selection === "grantor" ? "bg-green-200" : "bg-green-100"
              } rounded`}
              onClick={() => setSelection("grantor")}
            >
              <span
                className={`inline-block h-6 w-6 mr-2 rounded-full border-2 ${
                  selection === "grantor"
                    ? "border-blue-500"
                    : "border-gray-400"
                } flex justify-center items-center`}
              >
                <span
                  className={`inline-block h-4 w-4 rounded-full ${
                    selection === "grantor" ? "bg-blue-500" : "bg-white"
                  }`}
                ></span>
              </span>
              Grantor
            </div>
          </div>

          <form className="flex flex-col space-y-4 items-center">
            <input
              type="email"
              placeholder="Email"
              className="p-4 text-lg rounded-full border lg:max-w-lg md:max-w-md max-w-xs w-full"
              required
            />
            <p className="text-red-500 text-xs hidden">
              Password needs to be minimum 7 characters long, including at least
              1 alphabet, 1 number, and 1 special symbol
            </p>
            {/* make the text appear if the passwords doesn't satisfy the criteria above */}
            <input
              type="password"
              placeholder="Password"
              className="p-4 text-lg rounded-full border lg:max-w-lg md:max-w-md max-w-xs w-full"
              required
            />
            <p className="text-red-500 text-xs hidden">Passwords don't match</p>
            {/* make the text appear if two passwords don't match */}
            <input
              type="password"
              placeholder="Confirm password"
              className="p-4 text-lg rounded-full border lg:max-w-lg md:max-w-md max-w-xs w-full"
              required
            />
            <div className="bg-green-500 rounded max-w-xs w-full rounded-full">
              <button
                type="submit"
                className="text-white text-md w-full font-semibold bg-green-500 hover:bg-green-600 rounded-full h-12 px-6 transition duration-150 ease-in-out"
              >
                Sign Up
              </button>
            </div>
          </form>
        </div>
        <div className="w-full md:w-2/6 p-12 bg-green-100 space-y-4 flex flex-col justify-center items-center">
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
