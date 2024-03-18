import ResetPassword from "@/components/signup-login/ResetPassword";
import BaseLayout from "@/app/layout";
import dynamic from "next/dynamic";

const ResetPasswordPage = () => {
  return (
    <BaseLayout showFooter={false}>
      <ResetPassword />
    </BaseLayout>
  );
};

export default dynamic(() => Promise.resolve(ResetPasswordPage), {
  ssr: false,
});
