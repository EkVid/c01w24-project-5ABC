import { Inter } from "next/font/google";
import "./globals.css";
import dynamic from "next/dynamic";
<<<<<<< HEAD
<<<<<<< HEAD
=======
import Footer from "@/components/Footer";
>>>>>>> c0cda00 (Created sign up and sign in sections' UI)
=======
>>>>>>> 972d39f (moved routers and removed warnings in inspect console)

const AccessibilityBar = dynamic(
  () => import("@/components/AccessibilityBar"),
  { ssr: false }
);

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  return (
    <html id="root" lang="en">
      <body className={inter.className}>
        <div className="flex flex-col min-h-screen">
          <AccessibilityBar />
          <main className="flex-grow dark:bg-[#1f1f1f]">{children}</main>
<<<<<<< HEAD
          <Footer />
=======
          {showFooter && <Footer />}
>>>>>>> 548595b (Added routes for login & Signup)
        </div>
      </body>
    </html>
  );
}