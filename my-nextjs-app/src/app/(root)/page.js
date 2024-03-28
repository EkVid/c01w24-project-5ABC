import AddFormButton from "@/components/GrantForm/AddFormButton";
import Hero from "@/components/Hero";
import Quotes from "@/components/Quotes/Quotes";
// import AuthNavBar from "@/components/navbar/AuthNavBar";
import dynamic from "next/dynamic";

const UnauthNavBar = dynamic(
  () => import("@/components/navbar/UnauthNavBar"),
  { ssr: false }
);

export default function Home() {
  return (
    <main>
      <UnauthNavBar />
      <AddFormButton title={"Title Goes Here"}/>
      <Hero />
      <Quotes />
    </main>
  );
}
