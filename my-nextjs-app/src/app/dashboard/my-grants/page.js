'use client'
import MyGrantsElement from "@/components/Dashboard/Grants/MyGrants/MyGrants";
import axios from "axios";

export async function getData(){
    const userData = JSON.parse(sessionStorage.getItem('userData'))
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${userData.token}`
    }

    const response = await axios.post('http://localhost:5000/getGrantorGrants', {grantorEmail: userData.email}, {headers: headers})
    if(response.status !== 200){
      throw new Error('Failed to fetch grant data')
    }

    return response.data.grants.reverse()

}

const MyGrants = async () => {
  const grants = await getData()

  return (
    <div>
      <MyGrantsElement grants={grants}/>
    </div>
  )
}

export default MyGrants;