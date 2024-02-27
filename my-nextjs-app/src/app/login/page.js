import Login from "@/components/Login";
import BaseLayout from "@/app/layout";
import dynamic from "next/dynamic";

const LoginPage = () => {
  return (
    <BaseLayout showFooter={false}>
      <Login />
    </BaseLayout>
  );
};

export default dynamic(() => Promise.resolve(LoginPage), { ssr: false });
