import ViewMC from "./viewQuestions/viewMC"
import ViewCheckbox from "./viewQuestions/viewCheckbox"
import ViewText from "./viewQuestions/viewText"
import ViewNumber from "./viewQuestions/viewNumber"
import ViewEmail from "./viewQuestions/viewEmail"
import ViewPhoneNum from "./viewQuestions/viewPhoneNum"
import ViewDate from "./viewQuestions/viewDate"
import ViewFile from "./viewQuestions/viewFile"

export default function ViewApplication({ QuestionData }){
    return(
        <>
            <ViewMC question={QuestionData[0]} />
            <ViewCheckbox question={QuestionData[1]} />
            <ViewText question={QuestionData[2]} />
            <ViewNumber question={QuestionData[3]} />
            <ViewEmail question={QuestionData[4]} />
            <ViewPhoneNum question={QuestionData[5]} />
            <ViewDate question={QuestionData[6]} />
            <ViewFile question={QuestionData[7]} />
            
        </>
    )
}