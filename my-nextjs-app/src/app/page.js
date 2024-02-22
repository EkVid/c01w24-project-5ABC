import Hero from "@/components/Hero";
import Quotes from "@/components/Quotes/Quotes";
import AuthNavBar from "@/components/navbar/AuthNavBar";
import UnauthNavBar from "@/components/navbar/UnauthNavBar";
import Login from "@/components/Login";
import SignUp from "@/components/Signup";

export default function Home() {
  return (
    <main>
      {/* <AuthNavBar />
      <Hero />
      <Quotes /> */}
      {/* <Login /> */}
      <SignUp />
    </main>
  );
}
