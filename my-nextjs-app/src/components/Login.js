<<<<<<< HEAD
<<<<<<< HEAD
import Link from "next/link";
import dynamic from "next/dynamic";

=======
>>>>>>> c0cda00 (Created sign up and sign in sections' UI)
=======
import Link from "next/link";

>>>>>>> 548595b (Added routes for login & Signup)
const Login = () => {
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
        style={{ maxWidth: "1200px" }}
      >
        <div className="flex flex-col w-full md:w-1/2 lg:w-3/5 xl:w-3/5 p-16 space-y-8">
          <div className="space-y-6">
            <p className="text-center text-xl">Logo</p>
            <h2 className="text-center lg:text-6xl md:text-5xl text-4xl mb-8 mt-8 font-semibold">
              Sign in to your account
            </h2>
          </div>

          <form className="flex flex-col space-y-6 items-center">
            <input
              type="email"
              placeholder="Email"
              className="p-4 text-lg rounded-full border lg:max-w-lg md:max-w-md max-w-xs w-full"
            />
            <input
              type="password"
              placeholder="Password"
              className="p-4 text-lg rounded-full border lg:max-w-lg md:max-w-md max-w-xs w-full"
            />
<<<<<<< HEAD
            <Link href="/forgot_password">
              <h2 className="text-center text-xl hover:underline hover:text-blue-500">
                Forgot password?
              </h2>
            </Link>{" "}
            <div className="bg-green-500 rounded max-w-xs w-full rounded-full ">
              <button
                type="submit"
                className="text-white text-md w-full font-semibold bg-green-500 hover:bg-green-600 rounded-full h-12 px-6 transition duration-150 ease-in-out"
=======
            <h2 className="text-center text-xl">Forgot password?</h2>
            {/* remeber to add link to forgot password  */}
            <div className="bg-green-500 rounded max-w-xs w-full rounded-full ">
              <button
                type="submit"
<<<<<<< HEAD
                className="text-white text-lg w-full font-semibold"
>>>>>>> c0cda00 (Created sign up and sign in sections' UI)
=======
                className="text-white text-lg w-full font-semibold bg-green-500 rounded-full h-12 px-6"
>>>>>>> 548595b (Added routes for login & Signup)
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
<<<<<<< HEAD
<<<<<<< HEAD
            <Link href="/signup">
              <button className="inline-block custom-text text-md w-full font-semibold h-12 px-6 bg-white hover:bg-gray-100 rounded-full transition duration-150 ease-in-out">
                Sign Up
              </button>
            </Link>
=======
            <button
              type="submit"
              className="text-black text-lg w-full font-semibold"
            >
              Sign Up
            </button>
>>>>>>> c0cda00 (Created sign up and sign in sections' UI)
=======
            <Link href="/signup">
              <button className="text-black text-lg w-full font-semibold h-12 px-6">
                Sign Up
              </button>
            </Link>
>>>>>>> 548595b (Added routes for login & Signup)
          </div>
        </div>
      </div>
    </div>
  );
};

<<<<<<< HEAD
export default dynamic(() => Promise.resolve(Login), { ssr: false });
=======
export default Login;
>>>>>>> c0cda00 (Created sign up and sign in sections' UI)
