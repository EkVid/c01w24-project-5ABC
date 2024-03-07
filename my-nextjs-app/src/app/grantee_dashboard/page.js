import Grantee_dashboard from "@/components/Grantee_Board/Grantee_dashboard";
import BaseLayout from "@/app/(root)/layout";
import dynamic from "next/dynamic";

const Grantee_browse_page = () => {
  return (
    <BaseLayout>
      <Grantee_dashboard />
    </BaseLayout>
  );
};

export default dynamic(() => Promise.resolve(Grantee_browse_page), {
  ssr: false,
});
