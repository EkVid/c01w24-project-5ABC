import Link from "next/link"
import DashboardInnerContainer from "../../InnerContainer"
import { useRouter } from 'next/navigation'
import axios from "axios"

// const testGrants = [{
//     "grantorEmail": "test@test.com",
//     "Title": "New Grant",
//     "Description": "desc",
//     "WinnerIDs": [],
//     "AppliedIDs": [],
//     "NumWinners": 0,
//     "MaxWinners": 7,
//     "Deadline": "2024-03-29",
//     "PostedDate": "2024-03-18",
//     "profileReqs": {
//         "minAge": 18,
//         "maxAge": 21,
//         "race": [
//             "White",
//             "Black",
//             "Asian"
//         ],
//         "gender": [
//             "Male",
//             "Female",
//             "Other"
//         ],
//         "nationality": [
//             "Canadian"
//         ],
//         "veteran": 1
//     },
//     "Active": true,
//     "AmountPerApp": 500,
//     "QuestionData": [
//         {
//             "id": "14b603b5-71fe-4d8c-8034-f93ddfc507a2",
//             "question": "Q1",
//             "type": "multiple choice",
//             "errMsgArr": [],
//             "isRequired": false,
//             "file": null,
//             "fileData": null,
//             "answersObj": [
//                 {
//                     "answer": "Yes",
//                     "id": "0c054680-da27-46f2-8df7-48a381b1ee62"
//                 },
//                 {
//                     "answer": "No",
//                     "id": "2db720f2-d6e1-481c-81c8-815c2368eef5"
//                 }
//             ],
//             "errEmptyAnsIdxArr": [],
//             "errDupAnsIdxArr": []
//         },
//         {
//             "id": "05dc0202-00e5-4d19-83a5-6262ff3807ed",
//             "question": "Q2",
//             "type": "checkbox",
//             "errMsgArr": [],
//             "isRequired": true,
//             "file": null,
//             "fileData": null,
//             "answersObj": [
//                 {
//                     "answer": "1",
//                     "id": "17d188a0-d968-4727-a93d-29d9504a21c7"
//                 },
//                 {
//                     "answer": "2",
//                     "id": "2acef650-1ba1-43a0-8aa9-5df6f0fe225c"
//                 }
//             ],
//             "errEmptyAnsIdxArr": [],
//             "errDupAnsIdxArr": []
//         },
//         {
//             "id": "a3dc752c-568c-447e-afb4-0da5a582df88",
//             "question": "Q3",
//             "type": "textbox",
//             "errMsgArr": [],
//             "isRequired": true,
//             "file": null,
//             "fileData": null,
//             "options": {
//                 "minCharsNum": "10",
//                 "maxCharsNum": "1000"
//             }
//         },
//         {
//             "id": "8b4ea7db-412d-44dd-b6ec-133ce292fbe7",
//             "question": "Q4",
//             "type": "number",
//             "errMsgArr": [],
//             "isRequired": true,
//             "file": null,
//             "fileData": null,
//             "options": {
//                 "minNum": "1",
//                 "maxNum": "10",
//                 "isIntegerOnly": true
//             }
//         },
//         {
//             "id": "178eefc5-05a9-4b7b-aafb-ad1045aea20c",
//             "question": "Q5",
//             "type": "email",
//             "errMsgArr": [],
//             "isRequired": true,
//             "file": null,
//             "fileData": null
//         },
//         {
//             "id": "4ea288f2-161d-4ab9-870f-081b0766a015",
//             "question": "Q6",
//             "type": "phone number",
//             "errMsgArr": [],
//             "isRequired": true,
//             "file": null,
//             "fileData": null
//         },
//         {
//             "id": "50e979dc-60cc-4c81-bf1c-5e9634a85b2a",
//             "question": "Q7",
//             "type": "date",
//             "errMsgArr": [],
//             "isRequired": true,
//             "file": null,
//             "fileData": null
//         },
//         {
//             "id": "40d883b4-990e-49f9-a266-f5ec655b6819",
//             "question": "Q8",
//             "type": "file",
//             "errMsgArr": [],
//             "isRequired": true,
//             "file": null,
//             "fileData": null
//         }
//     ]
// }]

const MyGrants = ({ grants }) => {
    const router = useRouter()
    const userData = sessionStorage.getItem('userData')

    if(!userData){
        router.push('/login')
    }

    function getGrantStatus(grant){
        if(grant.NumWinners === grant.MaxWinners) return 'Awarded'
        if(!grant.Active) return 'Closed'
        return 'Open'
    }

    async function openGrant(grant){
        const headers = {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${userData.token}`
        }
        
        const body= {
            grantID: grant._id,
            active: true,
        }

        // Waiting for backend routes
        // try{
        //     const response = await axios.post('http://localhost:5000/updateGrantStatus', body, {headers: headers})
        //     console.log(response)
        //     router.reload()
        // }
        // catch(err){
        //     console.error(err)
        // }
    }

    async function closeGrant(grant){
        const headers = {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${userData.token}`
        }
        
        const body= {
            grantID: grant._id,
            active: false,
        }

        // Waiting for backend routes
        // try{
        //     const response = await axios.post('http://localhost:5000/updateGrantStatus', body, {headers: headers})
        //     console.log(response)
        //     router.reload()
        // }
        // catch(err){
        //     console.error(err)
        // }
    }

    function getGrantElements(grants){
        const grantElements = grants.map(grant => {
            const grantStatus = getGrantStatus(grant)
            
            return( 
                //TODO: make key unique, likely from grantID returned
                <details className="group px-4 py-4 my-4 rounded-md border border-black dark:border-white" key={grant._id}>
                    <summary className="flex flex-col sm:flex-row hover:cursor-pointer group-open:mb-5 justify-between items-center">
                        <h2 className="dark:d-text text-xl text-centerfont-bold">{grant.Title}</h2>
                        {/* Set proper color classes after merch with applicant dashboard */}
                        <div className={`rounded-full text-center text-white px-4 py-2 mt-2 sm:mt-0 ${grantStatus === 'Awarded' ? 'custom-green' : (grantStatus === 'Open' ? 'bg-[#d1aa64]' : 'bg-[#d76b65]')}`}>
                            {grantStatus}
                        </div>
                    </summary>

                    <div className="flex flex-col gap-y-2 sm:gap-y-0">
                        <p className="pt-2 dark:d-text">Description: {grant.Description}</p>
                        <p className="pt-2 dark:d-text">Grant Winners Picked: {grant.NumWinners}</p>
                        <p className="pt-2 dark:d-text">Maximum Number of Grant Winners: {grant.MaxWinners}</p>
                        <p className="pt-2 dark:d-text">Amount Per Winner (CAD $): {grant.AmountPerApp}</p>
                        <p className="pt-2 dark:d-text">Application Deadline: {grant.Deadline}</p>

                        <div className="w-full flex flex-col sm:flex-row">
                            {grant.Active ? 
                                <button 
                                    onClick={() => closeGrant(grant)}
                                    className="rounded text-center px-4 py-2 hover:scale-105 text-white mt-6 bg-[#d76b65]"
                                >
                                    Close Grant
                                </button>
                            :
                                grant.NumWinners < grant.MaxWinners ?
                                    <button 
                                        onClick={() => openGrant(grant)}
                                        className="rounded text-center px-4 py-2 hover:scale-105 dark:d-text mt-6 custom-green"
                                    >
                                        Open Grant
                                    </button>
                                :
                                    <></>
                            }

                            <Link href={`/dashboard/my-grants/${grant._id}`} className="rounded text-center border border-black dark:border-white px-4 py-2 hover:scale-105 ms-0 sm:ms-auto dark:d-text mt-6">
                                View Applications
                            </Link>
                        </div>
                        
                    </div>

                </details>
            )
        })
        return grantElements
    }

    return(
        <DashboardInnerContainer>
            <section className="min-h-screen">
                <div>
                    {getGrantElements(grants)}
                </div>
            </section>
        </DashboardInnerContainer>
    )
}

export default MyGrants