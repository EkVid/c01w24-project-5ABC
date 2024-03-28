'use client'
import Apply from "@/components/GrantForm/Apply"
import { TYPE_CHECKBOX, TYPE_EMAIL, TYPE_MULTI, TYPE_TEXT, TYPE_PHONE, TYPE_NUMBER, TYPE_DATE, TYPE_FILE } from "@/components/utils/constants";
import axios from "axios";
import { useRouter } from "next/navigation";

// const testbody = [
//   {
//     question: "What's your name?",
//     type: TYPE_TEXT,
//     isRequired: true,
//     options:
//     {
//       isMultipleLines: false,
//       minCharsNum: 2,
//       maxCharsNum: 20,
//     },
//     file: null,
//   },
//   {
//     question: "What's your email?",
//     type: TYPE_EMAIL,
//     isRequired: false,
//   },
//   {
//     question: "What's your phone number?",
//     type: TYPE_PHONE,
//     isRequired: false,
//   },
//   {
//     question: "Enter your age:",
//     type: TYPE_NUMBER,
//     isRequired: true,
//     options:
//     {
//       isIntegerOnly: true,
//       minNum: 0,
//     }
//   },
//   {
//     question: "What is your GPA on a 4.0 scale?",
//     type: TYPE_NUMBER,
//     isRequired: false,
//     options:
//     {
//       isIntegerOnly: false,
//       minNum: 0,
//       maxNum: 4,
//     }
//   },
//   {
//     question: "Do you have a driver's license?",
//     type: TYPE_MULTI,
//     answers: ["Yes", "No"],
//     isRequired: true,
//   },
//   {
//     question: "Select all that apply",
//     type: TYPE_CHECKBOX,
//     answers: ["Tall", "Smol", "Wide", "Thinn"],
//     isRequired: false,
//     options:
//     {
//       isNoneAnOption: true
//     }
//   },
//   {
//     question: "When did you graduate high school?",
//     type: TYPE_DATE,
//     isRequired: false,
//     options:
//     {
//       isDateRange: false
//     }
//   },
//   {
//     question: "Start and end date of last job",
//     type: TYPE_DATE,
//     isRequired: true,
//     options:
//     {
//       isDateRange: true,
//       isBothRequired: true,
//     }
//   },
//   {
//     question: "Download and complete attached file",
//     type: TYPE_FILE,
//     isRequired: true,
//     fileData: 
//     {
//       fileLink: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2F3fc4ed44-3fbc-419a-97a1-a29742511391.selcdn.net%2Fcoub_storage%2Fcoub%2Fsimple%2Fcw_image%2F4d4a7c5479f%2Fca1bf7ae0f002963751d0%2Fmed_1673105234_6tqgye_1409562215_1381603942_00014.jpg&f=1&nofb=1&ipt=47580c26f539884377b16df3bbc3137ed1f6f3f264716a80d415e4eb8fb271d5&ipo=images",
//       fileName: "shagged_by_rare_parrot.jpg",
//     }
//   },
// ]

// const testAnswers = [
//   {text: "Bob"},
//   {email: "email@some.com"},
//   {phoneNum: "333-333-3333"}, 
//   {value: 4},
//   {value: 3},
//   {answer: "Yes"},
//   {answers: ["Tall", "Smol"]},
//   {startDate: "2024-03-21"},
//   {startDate: "2024-03-05", endDate: "2024-03-28"},
//   {fileLink: "idHere", fileName: "somefile.txt (txt)"}
// ]

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
