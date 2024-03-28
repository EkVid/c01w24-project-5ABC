import {v4 as uuidv4} from 'uuid'
import { getApplciationStatus } from '../utils'
import { useContext } from 'react';
import ReducedMotionContext from "@/components/utils/ReducedMotionContext";
import ColourBlindnessContext from "@/components/utils/ColorBlindnessContext";
import { getcbMode } from "@/components/utils/cbMode";
import Link from 'next/link';

export default function ApplicationList({ applications }){
    const cbMode = useContext(ColourBlindnessContext)
    const { protanopia, deuteranopia, tritanopia } = getcbMode(cbMode)
    let applicationElements

    if(!applications){
        applicationElements = 
            <h1 className="dark:d-text">
                There was an error loading grant applications 
                {/* <Link href='/dashboard/my-grants' className="ps-2 underline">
                    Go Back
                </Link> */}
            </h1>
    }
    else if(applications.length === 0){
        applicationElements = 
            <h1 className="dark:d-text">
                There are no applications for this grant. 
                {/* <Link href='/dashboard/my-grants' className="ps-2 underline">
                    Go Back
                </Link> */}
            </h1>
    }
    else{
        applicationElements = applications.map(application => {
            const applicationStatus = getApplciationStatus(application)
            // TODO: ROUTE TO PROPER APPLICATION ID
            return(
                <div className="px-4 py-4 my-4 hover:scale-105 rounded-md border border-black dark:border-white" key={uuidv4()}>
                    <Link href={`/dashboard/application/${application.grantID}`} className="flex flex-col sm:flex-row hover:cursor-pointer justify-between items-center">
                        <h2 tabIndex="0" className="dark:d-text text-xl text-centerfont-bold">{application.email}</h2>
                        {/* Set proper color classes after merch with applicant dashboard */}
                        <div tabIndex="0" aria-label={`Application status: ${applicationStatus}`} className={`rounded-full text-center text-white px-4 py-2 mt-2 sm:mt-0 ${applicationStatus === 'Accepted' ? (protanopia ? "custom-green-background-pt" : deuteranopia ? "custom-green-background-dt" : tritanopia ? "custom-green-background-tr" : "custom-green-background") : (applicationStatus === 'Pending' ? (protanopia ? "custom-yellow-background-pt" : deuteranopia ? "custom-yellow-background-dt" : tritanopia ? "custom-yellow-background-tr" : "bg-[#d1aa64]") : 'bg-[#d76b65]')}`}>
                            {applicationStatus}
                        </div>
                    </Link>
                </div>
            )
        })
    }


    return(
        <section>
            <h1 tabIndex="0" className="dark:d-text text-3xl mb-10 ">Applications</h1>
            {applicationElements}
        </section>
    )
}