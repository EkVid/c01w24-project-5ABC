const ResetPassword = () => {
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
            <h2 className="text-center lg:text-5xl md:text-5xl text-4xl mb-8 mt-8 font-semibold text-black">
              Reset your password{" "}
            </h2>
          </div>
          <form className="flex flex-col space-y-6 items-center w-full">
            <div className="text-left w-full text-sm px-4 lg:max-w-lg md:max-w-md max-w-xs font-semibold text-green-600">
              <p>New Password</p>
              <p className="text-red-500 text-xs mt-5 hidden">
                Password needs to be minimum 7 characters long, including at
                least 1 alphabet, 1 number, and 1 special symbol
              </p>
              {/* make the text appear if the passwords doesn't satisfy the criteria above */}
            </div>

            <input
              type="password"
              placeholder="New Password"
              className="p-4 text-lg rounded-full border lg:max-w-lg md:max-w-md max-w-xs w-full text-black"
              required
            />
            <div className="text-left w-full text-sm px-4 lg:max-w-lg md:max-w-md max-w-xs text-green-600 font-semibold">
              <p>Confirm New Password</p>
              <p className="text-red-500 text-xs mt-5 hidden">
                Passwords don't match
              </p>
              {/* make the text appear if two passwords don't match */}
            </div>
            <input
              type="password"
              placeholder="Confirm New Password"
              className="p-4 text-lg rounded-full border lg:max-w-lg md:max-w-md max-w-xs w-full text-black"
              required
            />
            <div className="bg-green-500 rounded max-w-xs w-full rounded-full">
              <button
                type="submit"
                className="text-white text-md w-full font-semibold bg-green-500 hover:bg-green-600 rounded-full h-12 px-6 transition duration-150 ease-in-out"
              >
                Save Password
              </button>
              {/* redirect the user back to login (/login) once done */}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
