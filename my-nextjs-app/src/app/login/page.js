import Login from "@/components/Login";
import BaseLayout from "@/app/layout";

const LoginPage = () => {
  return (
    <BaseLayout showFooter={false}>
      <Login />
    </BaseLayout>
  );
};

export default LoginPage;
