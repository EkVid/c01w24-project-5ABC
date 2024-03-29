import { useContext } from 'react';
import ReducedMotionContext from '../../../../../utils/ReducedMotionContext';


export default function ViewDate({ question }){
  const isReduceMotion = useContext(ReducedMotionContext);

  const isDateRange = question.options?.isDateRange ?? false;
  const isBothRequired = question.options?.isBothRequired && isDateRange ? question.options.isBothRequired : false;

  return (
    <div className='p-2 md:mx-10 mx-4 my-4 border border-black dark:border-white rounded'>
        <h1 tabIndex="0" aria-label={`Question: ${question.question}`} className='dark:text-white'>{question.question}  {question.isRequired ? '*' : ''}</h1>
        {isDateRange ? <label htmlFor="startDate" className="mb-1 custom-text dark:d-text flex md:hidden">Start:</label> : <></>}
        <div className="flex mb-6 md:mb-2">
            {isDateRange ? <label htmlFor="startDate" className="custom-text dark:d-text mr-2 hidden md:flex">Start:</label> : <></>}
            <input
                type="date"
                id="startDate"
                placeholder="User will enter answer here"
                className={`text-sm w-fit md:max-w-96 border-b-2 bg-transparent m-1 custom-text dark:d-text custom-interactive-input ${isReduceMotion ? "" : "transition-colors"}`}
                disabled={true}
            />
        </div>
        {isDateRange ?
            <>
            <label htmlFor="startDate" className="mb-1 custom-text dark:d-text flex md:hidden">End:</label>
            <div className="flex">
                <label htmlFor="startDate" className="custom-text dark:d-text mr-4 hidden md:flex">End:</label>
                <input
                    type="date"
                    id="startDate"
                    placeholder="User will enter answer here"
                    className={`text-sm w-fit md:max-w-96 border-b-2 bg-transparent m-1 custom-text dark:d-text custom-interactive-input ${isReduceMotion ? "" : "transition-colors"}`}
                    disabled={true}
                />
            </div>
            {isBothRequired ? 
                <p className="italic text-sm mt-2 custom-text-shade dark:d-text-shade">
                    Both start and end dates are required
                </p>
                : !isBothRequired ?
                <p className="italic text-sm mt-2 custom-text-shade dark:d-text-shade">
                    You may enter either a start or end date
                </p>
                : 
                <></>
            }
            </>
            :   
            <></>
        }
    </div>
  )
}