import { useContext } from 'react';
import ReducedMotionContext from '../../../../../utils/ReducedMotionContext';
import FontSizeContext from '../../../../../utils/FontSizeContext';

export default function ViewCheckbox({ question }){
    const fontSizeMultiplier = useContext(FontSizeContext) / 100; 
    const isReduceMotion = useContext(ReducedMotionContext);
  
    const checkboxStyle = {
        transform: `scale(${fontSizeMultiplier * 1.2})`
      }

    return (
        <div className='p-2 md:mx-10 mx-4 my-4 border border-black dark:border-white rounded'>
            <h1 tabIndex="0" aria-label={`Question: ${question.question}`} className='dark:text-white'>{question.question}  {question.isRequired ? '*' : ''}</h1>
            {question.answersObj?.map((a, idx) =>
                <div 
                    aria-label={`Answer: ${a.answer}`}
                    tabIndex="0"
                    key={idx} 
                    className={`flex items-center max-w-fit px-2 py-1 m-1 rounded-md custom-interactive-input ${isReduceMotion ? "" : "transition-colors"}`}
                >
                    <input
                        aria-label={`Checkbox for answer ${a.answer}`}
                        type="checkbox"
                        id={a.id}
                        style={checkboxStyle}
                        className="pointer-events-none custom-accent dark:d-custom-accent"
                        disabled={true}
                        tabIndex="-1"
                    />
            
                    <label htmlFor={a.id} className="ml-3 text-sm custom-dark-grey dark:d-text pointer-events-none"> 
                        {a.answer.trim() === "" ? "(empty answer)" : a.answer}
                    </label>
                </div>
            )}
        </div>
    )
}