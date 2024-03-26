import AccessibilityBar from "@/components/AccessibilityBar";
import ForgotPassword from "@/components/signup-login/ForgotPassword";
import dynamic from "next/dynamic";

const ForgotPasswordPage = () => {
  return (
    <>
      <AccessibilityBar />
      <ForgotPassword />
    </>
  );
};

export default dynamic(() => Promise.resolve(ForgotPasswordPage), {
  ssr: false,
});
