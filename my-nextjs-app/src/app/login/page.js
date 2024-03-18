import Login from "@/components/signup-login/Login";
import BaseLayout from "@/app/layout";
<<<<<<< HEAD
import dynamic from "next/dynamic";
=======
>>>>>>> 548595b (Added routes for login & Signup)

const LoginPage = () => {
  return (
    <BaseLayout showFooter={false}>
      <Login />
    </BaseLayout>
  );
};

<<<<<<< HEAD
export default dynamic(() => Promise.resolve(LoginPage), { ssr: false });
=======
export default LoginPage;
>>>>>>> 548595b (Added routes for login & Signup)
