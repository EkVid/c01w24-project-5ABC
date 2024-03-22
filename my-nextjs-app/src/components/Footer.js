import dynamic from "next/dynamic";

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[#263238] text-white">
      <div className="max-w-6xl mx-auto px-4 py-10 md:py-12 flex flex-col justify-between h-full">
        {/* Logo and Navigation Container */}
        <div className="flex flex-col items-center justify-center">
          {/* Logo */}
          <div>
            <h2 className="uppercase font-bold">Logo</h2>
          </div>
          {/* Navigation/Quick Links */}
          <ul className="flex flex-col sm:flex-row mt-5 justify-center items-center sm:items-center lg:space-x-30 md:space-x-10 space-y-5 sm:space-y-0 sm:space-x-5">
            <li>
              <a href="/dashboard" className="hover:underline text-sm sm:text-base">
                Dashboard
              </a>
            </li>
            <li>
              <a href="/dashboard/my-grants" className="hover:underline text-sm sm:text-base">
                Grants
              </a>
            </li>
            <li>
              <a href="/dashboard/create-new-grant" className="hover:underline text-sm sm:text-base">
                Application
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline text-sm sm:text-base">
                Profile
              </a>
            </li>
          </ul>
        </div>
        {/* Copyright Section */}
        <div className="mt-8 flex justify-center w-full">
          <p className="text-center">
            Copyright &copy; {year} 5ABC. All Rights Reserved
          </p>
        </div>
      </div>
    </footer>
  );
};

export default dynamic(() => Promise.resolve(Footer), { ssr: false });
