import { useContext } from 'react';
import ReducedMotionContext from '../../../../utils/ReducedMotionContext';

export default function ViewNumber({ question }){
    const isReduceMotion = useContext(ReducedMotionContext);
  
    const isIntegerOnly = question.options?.isIntegerOnly ?? false;
    const minNum = question.options?.minNum ?? "";
    const maxNum = question.options?.maxNum ?? "";
  
    let rangeStr = "";
    if (minNum !== "" && maxNum !== "") {
      rangeStr += `Answer must be between ${minNum} and ${maxNum}`;
    }
    else if (minNum !== "") {
      rangeStr += `Answer must be at least ${minNum}`;
    }
    else if (maxNum !== "") {
      rangeStr += `Answer must be at most ${maxNum}`;
    }

    return (
        <div className='p-2 md:mx-10 mx-4 my-4 border border-black dark:border-white rounded'>
            <h1 className='dark:text-white'>{question.question}  {question.isRequired ? '*' : ''}</h1>
            <input
                type="number"
                min={minNum}
                max={maxNum}
                id="numAnswer"
                className={`text-sm max-w-full md:max-w-96 border-b-2 bg-transparent custom-text dark:d-text m-1 custom-interactive-input ${isReduceMotion ? "" : "transition-colors"} [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`}
                disabled={true}
            />
            {rangeStr !== ""?
                <p className="italic text-sm mt-1 custom-text-shade dark:d-text-shade">{rangeStr}</p>
                :
                <></>
            }
            {isIntegerOnly ?
                <p className="italic text-sm mt-1 custom-text-shade dark:d-text-shade">Integer answers only</p>
                :
                <></>
            }
        </div>
    )
}