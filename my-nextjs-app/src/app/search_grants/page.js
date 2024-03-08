import Search_grants from "@/components/Grantee_Board/Search_grants";
import BaseLayout from "@/app/(root)/layout";
import dynamic from "next/dynamic";

const Search_grants_page = () => {
  return (
    <BaseLayout>
      <Search_grants />
    </BaseLayout>
  );
};

export default dynamic(() => Promise.resolve(Search_grants_page), {
  ssr: false,
});
