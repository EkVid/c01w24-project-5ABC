import AccessibilityBar from "@/components/AccessibilityBar";
import Signup from "@/components/signup-login/Signup";
import dynamic from "next/dynamic";

const SignupPage = () => {
  return (
    <>
      <AccessibilityBar />
      <Signup />
    </>
  );
};

export default dynamic(() => Promise.resolve(SignupPage), { ssr: false });
