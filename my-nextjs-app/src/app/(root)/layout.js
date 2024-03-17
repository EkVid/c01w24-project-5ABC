import AccessibilityBar from "@/components/AccessibilityBar";
import AuthNavbar from "@/components/navbar/AuthNavBar";
import UnAuthNavbar from "@/components/navbar/UnauthNavBar";
import Footer from "@/components/Footer";

export default function NewRootLayout({ children }) {
  const loggedin = true;
  return (
    <div className="flex flex-col min-h-screen">
      <AccessibilityBar />
      {loggedin ? <AuthNavbar /> : <UnAuthNavbar />}
      <div className="flex flex-col flex-grow dark:bg-[#1f1f1f]">
        {children}
      </div>
      <Footer />
    </div>
  );
}
