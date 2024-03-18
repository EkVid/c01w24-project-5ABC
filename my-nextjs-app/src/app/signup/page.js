import Signup from "@/components/signup-login/Signup";
import BaseLayout from "@/app/layout";
import dynamic from "next/dynamic";

const SignupPage = () => {
  return (
    <BaseLayout showFooter={false}>
      <Signup />
    </BaseLayout>
  );
};

export default dynamic(() => Promise.resolve(SignupPage), { ssr: false });
