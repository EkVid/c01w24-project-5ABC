import dynamic from "next/dynamic";

const RandomLayout = dynamic(
    () => import("@/app/(noFooter)/layout"),
    { ssr: false }
);

export default function Layout({children}) {
    return (
      <RandomLayout>
        {children}
      </RandomLayout>
    )
  }