'use client'
import GrantInfo from "@/components/Dashboard/Grants/MyGrants/grantInfo/GrantInfo";
import axios from "axios";
import { useRouter } from "next/navigation";

const MyGrants = async ({params}) => {
    const router = useRouter()

    const grantID = params.grantID
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