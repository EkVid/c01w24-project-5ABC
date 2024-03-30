'use client'
import Apply from "@/components/GrantForm/Apply"
import axios from "axios";
import { useRouter } from "next/navigation";

async function getData(userData, grantID){
  const authHeaders = {
    'Authorization': `Bearer ${userData.token}`
  }

  try{
    const grantRes = await axios.get(`http://localhost:5000/getGrant/${grantID}`, {headers: authHeaders})
    return grantRes.data
  }
  catch(err){
    throw new Error('Cannot find grant with that ID')
  }
}

const Page = async ({params}) => {
  const router = useRouter()
  const userData = JSON.parse(sessionStorage.getItem('userData'))

  if(!userData){
    router.push('/login')
  }

  const grantID = params.grantID
  const grant = await getData(userData, grantID)

  return (
    <Apply title={grant.Title} grantID={grantID} fetchedQuestData={grant.QuestionData}/>
  )
}

export default Page
