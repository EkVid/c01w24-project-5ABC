import QuestionBase from "./QuestionBase";

const ViewAnswers = ({questionData, answerData}) => {
  const formattedAnswers = answerData?.map(a => a ? a : "");
  return (
    <>
      {questionData?.map((q, i) => 
        <QuestionBase 
          key={i}
          questionData={q} 
          questionNum={i + 1}
          isEditMode={false}
          isLastQuestion={i === questionData.length - 1}
          applicantAnswer={formattedAnswers[i]}
          onSelectAnswer={() => {return}}
        />
      )}
    </>
  )
}

export default ViewAnswers;