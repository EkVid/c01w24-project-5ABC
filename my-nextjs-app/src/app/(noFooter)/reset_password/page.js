import AccessibilityBar from "@/components/AccessibilityBar";
import ResetPassword from "@/components/signup-login/ResetPassword";
import dynamic from "next/dynamic";

const ResetPasswordPage = () => {
  return (
    <>
      <AccessibilityBar />
      <ResetPassword />
    </>
  );
};

export default dynamic(() => Promise.resolve(ResetPasswordPage), {
  ssr: false,
});
