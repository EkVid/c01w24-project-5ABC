import { useContext } from 'react';
import ReducedMotionContext from '../../../../utils/ReducedMotionContext';

export default function ViewText({ question }){
    const isReduceMotion = useContext(ReducedMotionContext);

    const isMultipleLines = question.options?.isMultipleLines ?? false;
    const minCharsNum = question.options?.minCharsNum ?? "";
    const maxCharsNum = question.options?.maxCharsNum ?? "";
  
    let rangeStr = "";
    if (minCharsNum !== "" && maxCharsNum !== "") {
      rangeStr += `Answer must be between ${minCharsNum} and ${maxCharsNum} characters`;
    }
    else if (minCharsNum !== "") {
      rangeStr += `Answer must be at least ${minCharsNum} characters`;
    }
    else if (maxCharsNum !== "") {
      rangeStr += `Answer must be at most ${maxCharsNum} characters`;
    }

    return (
        <div className='p-2 md:mx-10 mx-4 my-4 border border-black dark:border-white rounded'>
            <h1 className='dark:text-white'>{question.question}  {question.isRequired ? '*' : ''}</h1>
            {isMultipleLines ?
                <textarea
                placeholder="User will enter answer here"
                className={`min-h-6 max-h-96 flex custom-text dark:d-text text-sm border-2 bg-transparent m-1 custom-interactive-input ${isReduceMotion ? "" : "transition-colors"}`}
                disabled={true}
                />
                :
                <input
                    type="text"
                    placeholder="User will enter answer here"
                    className={`text-sm max-w-full custom-text dark:d-text md:max-w-96 border-b-2 bg-transparent m-1 custom-interactive-input ${isReduceMotion ? "" : "transition-colors"}`}
                    disabled={true}
                />
            }
            {rangeStr !== "" ?
                <p className="italic text-sm custom-text-shade dark:d-text-shade">{rangeStr}</p>
                :
                <></>
            }
        </div>
    )
}