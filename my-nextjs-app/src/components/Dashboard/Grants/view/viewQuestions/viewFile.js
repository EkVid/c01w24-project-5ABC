import { useContext } from "react";
import ReducedMotionContext from '../../../../utils/ReducedMotionContext';

export default function ViewFile({ question }){
    const isReduceMotion = useContext(ReducedMotionContext);

    return (
        <div className='p-2 md:mx-10 mx-4 my-4 border border-black dark:border-white rounded'>
            <h1 className='dark:text-white'>{question.question}  {question.isRequired ? '*' : ''}</h1>
            <label className='dark:text-white'>
                Users will upload files here:
                <input
                    type="file"
                    className={`text-sm max-w-full custom-text dark:d-text md:max-w-96 bg-transparent m-1 ${isReduceMotion ? "" : "transition-colors"}`}
                    disabled={true}
                />
            </label>
           
        </div>
    )
} 