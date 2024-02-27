"use client";

import Link from "next/link";
import { useState } from "react";

const ForgotPassword = () => {
  const [resetClicked, setResetClicked] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setResetClicked(true);
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
            <p className="text-center text-xl">Logo</p>
            <h2 className="text-center lg:text-5xl md:text-5xl text-4xl mb-8 mt-8 font-semibold">
              Reset your password
            </h2>
          </div>
          {!resetClicked ? (
            <>
              <h3 className="text-center text-sm mb-8 mt-8 font-semibold">
                Enter your email address below and we'll send you a link to
                reset your password.
              </h3>
              <form
                className="flex flex-col space-y-6 items-center"
                onSubmit={handleSubmit}
              >
                <input
                  type="email"
                  placeholder="Email"
                  className="p-4 text-lg rounded-full border lg:max-w-lg md:max-w-md max-w-xs w-full"
                  required
                />
                <div className="bg-green-500 rounded max-w-xs w-full rounded-full">
                  <button
                    type="submit"
                    className="text-white text-md w-full font-semibold bg-green-500 hover:bg-green-600 rounded-full h-12 px-6 transition duration-150 ease-in-out"
                  >
                    Reset Password
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div className="text-center lg:text-lg md:text-lg text-sm mb-8 mt-8">
              <p>
                Check your inbox for the next steps.
                <br />
                If you don't receive an email, and it's not in your spam folder,
                <br />
                this could mean you signed up with a different address.
              </p>
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
            <p>or</p>
            <p>
              <Link
                href="/signup"
                className="text-green-500 hover:underline ml-5"
              >
                Register
              </Link>
            </p>
          </div>
          <div className="text-center lg:text-md text-sm">
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
