'use client'
import GrantInfo from "@/components/Dashboard/Grants/MyGrants/grantInfo/GrantInfo";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";

const MyGrants = async () => {
    const params = useParams()
    const router = useRouter()

    const grantID = params.grantID
    console.log(grantID)
    const userData = JSON.parse(sessionStorage.getItem('userData'))
    let grant = null
    let applications = null

    if(!userData){
        router.push('/login')
    }

    const authHeaders = {
      'Authorization': `Bearer ${userData.token}`
    }

    try{
      const grantRes = await axios.get(`http://localhost:5000/getGrant/${grantID}`, {headers: authHeaders})
      grant = grantRes.data

      try{
        const appRes = await axios.get(`http://localhost:5000/getAllGrantApplications/${grantID}`, {headers: authHeaders})
        console.log('applications', appRes)
        applications = appRes.data.applications
      }
      catch(err){
          throw new Error('Cannot find grant applications')
      }
    }
    catch(err){
      throw new Error('Cannot find grant with that ID')
    }
  

  return (
    <div>
      <GrantInfo grant={grant} grantID={grantID} applications={applications}/>
    </div>
  )
}

export default MyGrants;