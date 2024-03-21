'use client'
import ViewApplication from "./viewApplication"
import axios from "axios"
import { useRouter } from 'next/navigation'

export default function ViewGrant({ grant, setViewGrant }){
    const router = useRouter()
    
    function stringifyArray(arr){
        let string = ''
        if(arr.length === 0) return 'Any'
        for(let i = 0; i < arr.length; i++){
            string = string + ", " + arr[i]
        }
        return string.substring(1)
    }

    function signGrant(grant, email){
        if(!email){
            console.error('error, no email')
            return null
        }
        const today = new Date()
        const signedGrant = {...grant, grantorEmail:email, PostedDate: today.toISOString().split('T')[0]}

        return signedGrant
    }

    function prepareGrant(grant, email){
        const signedGrant = signGrant(grant, email)
        const form = new FormData()
        let fileIdx = 0
        let fileArr = []
        const finalQuestionArr = signedGrant.QuestionData.map(question => {
            let newQuestion = {...question}
            if(question.file){
                fileArr.push(question.file)
                newQuestion.fileIdx = fileIdx
                fileIdx++
            }
            delete newQuestion.file
            delete newQuestion.id
            delete newQuestion.errMsg
            return newQuestion
        })
        const finalGrant = {...signedGrant, QuestionData: finalQuestionArr}
        console.log(finalGrant)
        console.log(fileArr)
        form.append('jsonData', JSON.stringify(finalGrant))
        form.append('files', fileArr)
        return form
    }

    async function PostGrant(){
        const userData = JSON.parse(sessionStorage.getItem('userData'))

        if(!userData){
            router.push('/login')
        }

        const form = prepareGrant(grant, userData.email)
        if(!form){
            console.error('error formatting grant')
            return null
        }
        const headers = {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${userData.token}`
        }

        try{
            const response = await axios.post('http://localhost:5000/createGrant', form, {headers: headers})
            console.log(response)
            // Remove grant objects from local storage
            localStorage.removeItem('grant')
            localStorage.removeItem('clearedGrant')
            router.push('/dashboard/my-grants')
        }
        catch(err){
            console.error(err)
        }
    }

    return (
        <>
            <div>
                <h2 
                    className="w-full mb-10 text-3xl dark:d-text bg-transparent focus:outline-none dark:placeholder:text-neutral-300"
                >
                    Review '{grant.Title}'
                </h2>
            </div>

            <div className="flex md:flex-row flex-col items-top ms-4 mb-10">
                <p className="pt-2 dark:d-text">Description: {grant.Description}</p>
            </div>

            <div className="flex md:flex-row flex-col items-top ms-4 mb-10">
                <p className="pt-2 dark:d-text">Number of Grant Winners: {grant.MaxWinners}</p>
            </div>

            <div className="flex md:flex-row flex-col items-top ms-4 mb-10">
                <p className="pt-2 dark:d-text">Amount Per Winner (CAD $): {grant.AmountPerApp}</p>
            </div>

            <div className="w-fullflex-col items-center ms-4 mb-10">
                <p className="self-start md:self-auto dark:d-text">Application Form:</p>
                {/* <div className="md:max-w-xl sm:min-w-60 sm:max-w-60 min-w-40 ms-4 me-8 flex flex-col sm:flex-row items-center rounded-md custom-dark-grey-background border-2 border-neutral-300 dark:d-text dark:d-custom-dark-grey-background dark:border-neutral-700">
                </div>  */}
                <div> 
                    <ViewApplication QuestionData={grant.QuestionData} />
                </div>
            </div>

            <div className="flex md:flex-row flex-col items-top ms-4 mb-10">
                <p className="pt-2 dark:d-text">Application Deadline: {grant.Deadline}</p>
            </div>

            <div className="flex flex-col items-top ms-4 mb-20">
                <p className="w-full pt-2 dark:d-text">Grantee Profile - Your ideal applicant: </p>
                <div 
                    className="self-center flex flex-col md:mx-4 mx-0 p-2 my-4 rounded-md w-full custom-dark-grey-background border-2 border-neutral-300 focus:border-neutral-600 dark:d-text dark:d-custom-dark-grey-background dark:border-neutral-700 dark:focus:border-white" 
                >
                    <div className="flex flex-col my-2">
                        Age range: {!grant.profileReqs.minAge && !grant.profileReqs.maxAge ? 'Any' : `${grant.profileReqs.minAge} - ${grant.profileReqs.maxAge}`}
                    </div>

                    <div className="flex flex-col my-2">
                        Race: {stringifyArray(grant.profileReqs.race)}
                    </div>

                    <div className="flex flex-col my-2">
                        Gender: {stringifyArray(grant.profileReqs.gender)}
                    </div>

                    <div className="flex flex-col my-2">
                        Nationality: {stringifyArray(grant.profileReqs.nationality)}
                    </div>

                    <div className="flex flex-col my-2">
                        Are they a veteran: {grant.profileReqs.veteran === 0 ? 'No' : (grant.profileReqs.veteran === 1 ? 'Yes' : 'N/A')}
                    </div>

                </div>
            </div>

            <div className="w-full flex sm:flex-row flex-col items-center justify-end sm:gap-6">
                <button
                    className="px-6 my-2 md:my-0 text-center py-4 sm:me-2 rounded-md hover:scale-105 bg-white border-2 border-neutral-300 disabled:text-neutral-400 disabled:bg-transparent dark:d-text dark:disabled:bg-transparent dark:disabled:text-neutral-400 dark:d-custom-dark-grey-background dark:border-neutral-700"
                    onClick={() => setViewGrant(false)}
                >
                    Back
                </button>
                <button
                    className="px-6 my-2 md:my-0 text-white text-center py-4 rounded-md hover:scale-105 disabled:hover:scale-100 custom-green-background disabled:text-neutral-400 dark:disabled:bg-transparent dark:disabled:text-neutral-400 disabled:bg-transparent border-2 border-neutral-300 dark:d-text dark:border-neutral-700"
                    onClick={PostGrant}
                >
                    Post Grant
                </button>
            </div>
        </>
    )
}