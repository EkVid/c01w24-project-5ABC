'use client'
import Grantee_dashboard from "@/components/Grantee_Board/Grantee_dashboard";
import BaseLayout from "@/app/(root)/layout";
import dynamic from "next/dynamic";
import axios from "axios";

export async function getData(){
    const userData = JSON.parse(sessionStorage.getItem('userData'))
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${userData.token}`
    }

    const response = await axios.post('http://localhost:5000/getGranteeApplications', {email: userData.email}, {headers: headers})
    if(response.status !== 200){
      throw new Error('Failed to fetch applications')
    }
    return response.data.applicationsWithGrants.reverse()
}

const Grantee_browse_page = async () => {
  const applications = await getData()

  return (
    <BaseLayout>
      <Grantee_dashboard applications={applications}/>
    </BaseLayout>
  );
};

export default dynamic(() => Promise.resolve(Grantee_browse_page), {
  ssr: false,
});
