import Login from "@/components/signup-login/Login";
import dynamic from "next/dynamic";
import AccessibilityBar from "@/components/AccessibilityBar";

const LoginPage = () => {
  return (
    <>
      <AccessibilityBar />
      <Login />
    </>
  );
};

export default dynamic(() => Promise.resolve(LoginPage), { ssr: false });
