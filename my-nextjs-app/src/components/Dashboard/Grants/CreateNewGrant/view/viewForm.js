import ViewMC from "./viewQuestions/viewMC"
import ViewCheckbox from "./viewQuestions/viewCheckbox"
import ViewText from "./viewQuestions/viewText"
import ViewNumber from "./viewQuestions/viewNumber"
import ViewEmail from "./viewQuestions/viewEmail"
import ViewPhoneNum from "./viewQuestions/viewPhoneNum"
import ViewDate from "./viewQuestions/viewDate"
import ViewFile from "./viewQuestions/viewFile"

export default function ViewApplication({ QuestionData }){

    function mapQuestions(QuestionData){
        const questionElements = QuestionData.map(question => {
            if(question.type === 'multiple choice'){
                return <ViewMC question={question} key={question.id}/>
            }
            else if(question.type === 'checkbox'){
                return <ViewCheckbox question={question} key={question.id}/>
            }
            else if(question.type === 'textbox'){
                return <ViewText question={question} key={question.id}/>
            }
            else if(question.type === 'number'){
                return <ViewNumber question={question} key={question.id}/>
            }
            else if(question.type === 'email'){
                return <ViewEmail question={question} key={question.id}/>
            }
            else if(question.type === 'phone number'){
                return <ViewPhoneNum question={question} key={question.id}/>
            }
            else if(question.type === 'date'){
                return <ViewDate question={question} key={question.id}/>
            }
            else if(question.type === 'file'){
                return <ViewFile question={question} key={question.id}/>
            }
        })

        return questionElements
    }

    return(
        <>
            {mapQuestions(QuestionData)}
        </>
    )
}