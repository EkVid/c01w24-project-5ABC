import DashboardInnerContainer from "../../InnerContainer"

const testGrants = [{
    "Title": "New Grant",
    "Description": "My new grant is great, you should apply!",
    "WinnerIDs": [],
    "AppliedIDs": [],
    "NumWinners": 0,
    "MaxWinners": "6",
    "Deadline": "2024-03-29",
    "PostedDate": null,
    "profileReqs": {
        "minAge": "18",
        "maxAge": "20",
        "race": [
            "White",
            "Asian",
            "Black"
        ],
        "gender": [
            "Male",
            "Female",
            "Other"
        ],
        "nationality": [
            "Canadian"
        ],
        "veteran": "1"
    },
    "Active": true,
    "AmountPerApp": 500,
    "QuestionData": [
        {
            "id": "218dad96-a376-42da-8db4-59c0b676ffa5",
            "question": "Are you sure?",
            "type": "checkbox",
            "errMsgArr": [],
            "isRequired": true,
            "file": null,
            "fileData": null,
            "answersObj": [
                {
                    "answer": "Yes",
                    "id": "a85dcbb0-4671-463a-94b2-69f50e1863f9"
                },
                {
                    "answer": "No",
                    "id": "1b740c90-d24c-4fe7-9994-342e5adb3d46"
                }
            ],
            "errEmptyAnsIdxArr": [],
            "errDupAnsIdxArr": []
        },
        {
            "id": "de810331-cfe3-4f05-bd63-589736ee085a",
            "question": "On a scale of 1-10, how much do you want it?",
            "type": "number",
            "errMsgArr": [],
            "isRequired": true,
            "file": null,
            "fileData": null,
            "options": {
                "isIntegerOnly": true,
                "minNum": "1",
                "maxNum": "10"
            }
        },
        {
            "id": "4b31f404-976d-40a5-9f7b-6bb17a363eb8",
            "question": "Do you want this grant?",
            "type": "multiple choice",
            "errMsgArr": [],
            "isRequired": true,
            "file": null,
            "fileData": null,
            "answersObj": [
                {
                    "answer": "Yes",
                    "id": "aa80e5f6-f709-4889-8d3b-bc435b4caef7"
                },
                {
                    "answer": "No",
                    "id": "b3acd332-4b29-4f4f-994f-7f00bc8ecb90"
                }
            ],
            "errEmptyAnsIdxArr": [],
            "errDupAnsIdxArr": []
        },
        {
            "id": "c381623d-e1fd-4df7-a7db-3c5af0b670d3",
            "question": "What's your email?",
            "type": "email",
            "errMsgArr": [],
            "isRequired": true,
            "file": null,
            "fileData": null
        },
        {
            "id": "c0df2659-77b6-4341-a7fa-a5eaf5c1658a",
            "question": "What's your phone number?",
            "type": "phone number",
            "errMsgArr": [],
            "isRequired": false,
            "file": null,
            "fileData": null
        },
        {
            "id": "25f1a4b1-a9a3-492a-b5db-56bd1927c9e2",
            "question": "Upload a cool picture",
            "type": "file",
            "errMsgArr": [],
            "isRequired": true,
            "file": {},
            "fileData": {
                "fileLink": "blob:http://localhost:3000/c2764a07-170a-44ef-9591-52010be55a78",
                "fileName": "Purple-Space-Background.jpg"
            }
        },
        {
            "id": "b6879294-81a1-4958-9269-ba9330bd5dc6",
            "question": "Explain why you do or do not want this grant.",
            "type": "textbox",
            "errMsgArr": [],
            "isRequired": true,
            "file": null,
            "fileData": null,
            "options": {
                "isMultipleLines": true,
                "maxCharsNum": "1000",
                "minCharsNum": "100"
            }
        },
        {
            "id": "93c89af2-0bf7-4119-a95e-51d53e8f6db9",
            "question": "When were you born?",
            "type": "date",
            "errMsgArr": [],
            "isRequired": true,
            "file": null,
            "fileData": null,
            "options": {
                "isDateRange": false,
                "isBothRequired": false
            }
        }
    ],
    "Files": []
}]

const MyGrants = () => {

    function getGrantStatus(grant){
        if(grant.NumWinners === grant.MaxWinners) return 'Awarded'
        if(!grant.Active) return 'Closed'
        return 'Open'
        
    }

    function getGrantElements(grants){
        const grantElements = grants.map(grant => {
            const grantStatus = getGrantStatus(grant)
            
            return( 
                <details className="group px-4 py-4 rounded-md border border-black dark:border-white">
                    <summary className="flex flex-col sm:flex-row hover:cursor-pointer group-open:mb-5 justify-between items-center">
                        <h2 className="dark:d-text text-xl text-centerfont-bold">{grant.Title}</h2>
                        <div className={`rounded-full text-center text-white px-4 py-2 mt-2 sm:mt-0 ${grantStatus === 'Awarded' ? 'custom-green' : (grantStatus === 'Open' ? 'bg-[#d1aa64]' : 'bg-[#d76b65]')}`}>
                            {grantStatus}
                        </div>
                    </summary>

                    <div>
                        <p>Description: {grant.Description}</p>
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
                    {getGrantElements(testGrants)}
                </div>
            </section>
        </DashboardInnerContainer>
    )
}

export default MyGrants