export default function FormLayout({children}) {
  return (
    <div className="flex flex-col min-h-screen flex-grow dark:bg-[#1f1f1f]">
      {children}
    </div>
  )
}