import Signup from "@/components/Signup";
import BaseLayout from "@/app/layout";
<<<<<<< HEAD
import dynamic from "next/dynamic";
=======
>>>>>>> 548595b (Added routes for login & Signup)

const SignupPage = () => {
  return (
    <BaseLayout showFooter={false}>
      <Signup />
    </BaseLayout>
  );
};

<<<<<<< HEAD
export default dynamic(() => Promise.resolve(SignupPage), { ssr: false });
=======
export default SignupPage;
>>>>>>> 548595b (Added routes for login & Signup)
