import Applied_grants from "@/components/Grantee_Board/Applied_grants";
import BaseLayout from "@/app/(root)/layout";
import dynamic from "next/dynamic";

const Applied_grants_page = () => {
  return (
    <BaseLayout>
      <Applied_grants />
    </BaseLayout>
  );
};

export default dynamic(() => Promise.resolve(Applied_grants_page), {
  ssr: false,
});
