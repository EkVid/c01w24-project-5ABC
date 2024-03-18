'use client'
import ApplicationList from "@/components/Dashboard/Grants/MyGrants/applications/ApplicationList";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";

export async function getData(){
    const userData = JSON.parse(sessionStorage.getItem('userData'))
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${userData.token}`
    }

    const response = await axios.post('http://localhost:5000/getGrantorGrants', {grantorEmail: userData.email}, {headers: headers})
    console.log(response)
    if(response.status !== 200){
      throw new Error('Failed to fetch grant data')
    }

    return response.data.grants

}

const MyGrants = async () => {
    const params = useParams()
    const router = useRouter()

    const grantID = params.grantID
    const userData = sessionStorage.getItem('userData')
    let applications = null

    if(!userData){
        router.push('/login')
    }

    const headers = {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${userData.token}`
    }

    try{
        const response = await axios.get(`http://localhost:5000/getAllGrantApplications/${grantID}`, {headers: headers})
        applications = response.data.applications
    }
    catch(err){
        throw new Error('Cannot find grant with that ID')
    }

  return (
    <div>
      <ApplicationList applications={applications}/>
    </div>
  )
}

export default MyGrants;