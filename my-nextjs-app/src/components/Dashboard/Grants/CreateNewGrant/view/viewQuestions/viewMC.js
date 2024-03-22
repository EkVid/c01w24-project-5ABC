import { useContext } from 'react';
import ReducedMotionContext from '../../../../../utils/ReducedMotionContext';
import FontSizeContext from '../../../../../utils/FontSizeContext';

export default function ViewMC({ question }){
    const fontSizeMultiplier = useContext(FontSizeContext) / 100; 
    const isReduceMotion = useContext(ReducedMotionContext);
  
    const radioStyle = {
      transform: `scale(${fontSizeMultiplier * 1.2})`
    }

    return (
        <div className='p-2 md:mx-10 mx-4 my-4 border border-black dark:border-white rounded'>
            <h1 className='dark:text-white'>{question.question}  {question.isRequired ? '*' : ''}</h1>
            {question.answersObj?.map((a, idx) =>
                <div 
                    key={idx} 
                    aria-label={`Answer: ${a.answer}`}
                    className={`flex items-center max-w-fit p-1 px-2 rounded-md m-1 custom-interactive-input ${isReduceMotion ? "" : "transition-colors"}`}
                >
                    <input
                        type="radio"
                        id={a.id}
                        style={radioStyle}
                        className="pointer-events-none custom-accent dark:d-custom-accent"
                    />

                    <label htmlFor={a.id} className="ml-3 text-sm custom-dark-grey dark:d-text pointer-events-none"> 
                        {a.answer.trim() === "" ? "(empty answer)" : a.answer}
                    </label>
                
                </div>
            )}
        </div>
    )
}