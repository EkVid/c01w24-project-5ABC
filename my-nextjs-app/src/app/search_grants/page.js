import Search_grants from "@/components/Grantee_Board/Search_grants";
import BaseLayout from "@/app/(root)/layout";
import dynamic from "next/dynamic";
import axios from "axios";

export async function getData(){
    const userData = JSON.parse(sessionStorage.getItem('userData'))
    const headers = {
      'Authorization': `Bearer ${userData.token}`
    }

    const response = await axios.get('http://localhost:5000/getAllGrants', {headers: headers})
    if(response.status !== 200){
      throw new Error('Failed to fetch applications')
    }
    console.log(response)

    return response.data
}


const Search_grants_page = () => {
  const grants = getData()

  return (
    <BaseLayout>
      <Search_grants />
    </BaseLayout>
  );
};

export default dynamic(() => Promise.resolve(Search_grants_page), {
  ssr: false,
});
