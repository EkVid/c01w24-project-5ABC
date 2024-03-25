import Login from "@/components/signup-login/Login";
import dynamic from "next/dynamic";

const LoginPage = () => {
  return (
    <div>
      <Login />
    </div>
  );
};

export default dynamic(() => Promise.resolve(LoginPage), { ssr: false });
