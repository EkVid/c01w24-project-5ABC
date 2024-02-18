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
          <ul className="flex mt-5 justify-center lg:space-x-30 md:space-x-20 space-x-5">
            <li>
              <a href="#" className="hover:underline">
                Dashboard
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                Grants
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                Application
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                Edit&nbsp;Profile
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

export default Footer;
