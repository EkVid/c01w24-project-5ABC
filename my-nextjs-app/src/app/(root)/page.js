import AddFormButton from "@/components/GrantForm/AddFormButton";
import Hero from "@/components/Hero";
import Quotes from "@/components/Quotes/Quotes";
// import AuthNavBar from "@/components/navbar/AuthNavBar";
import UnauthNavBar from "@/components/navbar/UnauthNavBar";


import Login from "@/components/signup-login/Login";
import SignUp from "@/components/signup-login/Signup";


export default function Home() {
  return (
    <main>
      <UnauthNavBar />
      <AddFormButton />
      <Hero />
      <Quotes />
    </main>
  );
}
