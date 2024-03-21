import { useContext } from 'react';
import ReducedMotionContext from '../../../../utils/ReducedMotionContext';

export default function ViewPhoneNum({ question }){
    const isReduceMotion = useContext(ReducedMotionContext);
  
    return (
        <div className='p-2 md:mx-10 mx-4 my-4 border border-black dark:border-white rounded'>
            <h1 className='dark:text-white'>{question.question}  {question.isRequired ? '*' : ''}</h1>
            <input
                type="tel"
                placeholder={"example: 123-456-7890"}
                className={`text-sm max-w-full custom-text dark:d-text md:max-w-96 border-b-2 bg-transparent m-1 custom-interactive-input ${isReduceMotion ? "" : "transition-colors"}`}
                disabled={true}
            />
        </div>
      
    )
}