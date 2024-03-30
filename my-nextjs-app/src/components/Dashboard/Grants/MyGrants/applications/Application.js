import ViewAnswers from "@/components/GrantForm/ViewAnswers"


export default function Application({application, QuestionData}){
    return(
        <div className="flex flex-col dark:d-text">
            <h1 tabIndex={0} className="text-2xl mt-2 mb-6">Viewing application from <span className="underline">{application.email}</span></h1>
            <p tabIndex={0} className="my-2">Date submitted: {application.dateSubmitted}</p>
            <div className="flex flex-col">
                <p tabIndex={0} className="mb-2">Application Form Answers: </p>
                <ViewAnswers questionData={QuestionData} answerData={application.answers}/> 
            </div>
        </div>
    )
}