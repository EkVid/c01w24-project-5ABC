'use client'
import Applied_grants from "@/components/Grantee_Board/Applied_grants";
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

    return response.data.applicationsWithGrants
}

const Applied_grants_page = async () => {
  const applications = await getData()

  return (
    <BaseLayout>
      <Applied_grants applications={applications}/>
    </BaseLayout>
  );
};

export default dynamic(() => Promise.resolve(Applied_grants_page), {
  ssr: false,
});
