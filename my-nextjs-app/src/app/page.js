import Hero from "@/components/Hero";
import Quotes from "@/components/Quotes/Quotes";
import Navbar from "@/components/AuthNavBar";
import NewBar from "@/components/UnauthNavBar";

export default function Home() {
  return (
    <main>
      <NewBar />
      <Hero />
      <Quotes />
    </main>
  );
}
