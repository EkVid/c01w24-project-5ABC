import AccessibilityBar from "@/components/AccessibilityBar";
import Footer from "@/components/Footer";

export default function NewRootLayout({children}) {
  return (
    <div className="flex flex-col min-h-screen">
      <AccessibilityBar/>
      <div className="flex flex-col flex-grow dark:bg-[#1f1f1f]">
        {children}
      </div>
      <Footer/>
    </div>
  )
}