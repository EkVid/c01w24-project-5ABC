import Signup from "@/components/Signup";
import BaseLayout from "@/app/layout";

const SignupPage = () => {
  return (
    <BaseLayout showFooter={false}>
      <Signup />
    </BaseLayout>
  );
};

export default SignupPage;
