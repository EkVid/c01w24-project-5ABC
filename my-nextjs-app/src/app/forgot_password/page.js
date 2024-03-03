import ForgotPassword from "@/components/ForgotPassword";
import BaseLayout from "@/app/layout";
import dynamic from "next/dynamic";

const ForgotPasswordPage = () => {
  return (
    <BaseLayout showFooter={false}>
      <ForgotPassword />
    </BaseLayout>
  );
};

export default dynamic(() => Promise.resolve(ForgotPasswordPage), {
  ssr: false,
});
