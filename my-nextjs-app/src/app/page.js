import Hero from "@/components/Hero";
import Quotes from "@/components/Quotes/Quotes";
// import AuthNavBar from "@/components/navbar/AuthNavBar";
import UnauthNavBar from "@/components/navbar/UnauthNavBar";
export default function Home() {
  return (
    <main>
      <UnauthNavBar />
      <Hero />
      <Quotes />
    </main>
  );
}
