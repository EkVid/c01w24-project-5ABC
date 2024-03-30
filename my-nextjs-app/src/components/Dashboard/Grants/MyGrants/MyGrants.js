'use client'
import Link from "next/link"
import DashboardInnerContainer from "../../InnerContainer"
import { useRouter } from 'next/navigation'
import { useContext } from "react";
import { getGrantStatus, openGrant, closeGrant } from "./utils";
import ReducedMotionContext from "@/components/utils/ReducedMotionContext";
import ColourBlindnessContext from "@/components/utils/ColorBlindnessContext";
import { getcbMode } from "@/components/utils/cbMode";

const MyGrants = ({ grants }) => {
    const router = useRouter()
    const isReduceMotion = useContext(ReducedMotionContext);
    const cbMode = useContext(ColourBlindnessContext)
    const { protanopia, deuteranopia, tritanopia } = getcbMode(cbMode)
    const userData = JSON.parse(sessionStorage.getItem('userData'))

    if(!userData){
        router.push('/login')
    }

    function getGrantElements(grants){
        const grantElements = grants.map(grant => {
            const grantStatus = getGrantStatus(grant)
            
            return(
                <details aria-label={`${grant.Title} dropdown`} className="group px-4 py-4 my-4 rounded-md border border-black dark:border-white" key={grant._id}>
                    <summary className="flex flex-col sm:flex-row hover:cursor-pointer group-open:mb-5 justify-between items-center">
                        <h2 tabIndex="0" className="dark:d-text text-xl text-centerfont-bold">{grant.Title}</h2>
                        {/* Set proper color classes after merch with applicant dashboard */}
                        <div tabIndex="0" aria-label={`Grant status: ${grantStatus}, enter to view more info`} className={`rounded-full text-center text-white px-4 py-2 mt-2 sm:mt-0 ${grantStatus === 'Awarded' ? (protanopia ? "custom-green-background-pt" : deuteranopia ? "custom-green-background-dt" : tritanopia ? "custom-green-background-tr" : "custom-green-background") : (grantStatus === 'Open' ? (protanopia ? "custom-yellow-background-pt" : deuteranopia ? "custom-yellow-background-dt" : tritanopia ? "custom-yellow-background-tr" : "bg-[#d1aa64]") : 'bg-[#d76b65]')}`}>
                            {grantStatus}
                        </div>
                    </summary>

                    <div className="flex flex-col gap-y-2 dark:d-text sm:gap-y-0">
                        <div className="flex flex-col sm:flex-row justify-between">
                            <p tabIndex="0" className="pt-2 pe-2 font-bold">Description:</p> 
                            <p tabIndex="0">{grant.Description}</p>
                        
                        </div>
                        <div className="flex flex-col sm:flex-row justify-between">
                            <p tabIndex="0" className="pt-2 pe-2 font-bold">Grant Winners Picked:</p> 
                            <p tabIndex="0">{grant.NumWinners}</p>
                        
                        </div>
                        <div className="flex flex-col sm:flex-row justify-between">
                            <p tabIndex="0" className="pt-2 pe-2 font-bold">Maximum Number of Grant Winners:</p> 
                            <p tabIndex="0">{grant.MaxWinners}</p>
                        
                        </div>
                        <div className="flex flex-col sm:flex-row justify-between">
                            <p tabIndex="0" className="pt-2 pe-2 font-bold">Amount Per Winner (CAD $):</p> 
                            <p tabIndex="0">{grant.AmountPerApp}</p>
                        </div>
                        <div className="flex flex-col sm:flex-row justify-between">
                            <p tabIndex="0" className="pt-2 pe-2 font-bold">Application Deadline:</p> 
                            <p tabIndex="0">{grant.Deadline}</p>
                        </div>
                        
                        <div className="w-full flex flex-col sm:flex-row">
                            {grant.Active ? 
                                <button 
                                    onClick={() => {
                                        closeGrant(grant._id, userData)
                                        router.refresh()
                                    }}
                                    className="rounded text-center px-4 py-2 hover:scale-105 text-white mt-6 bg-[#d76b65]"
                                    aria-label="Change grant status to closed"
                                >
                                    Close Grant
                                </button>
                            :
                                grant.NumWinners < grant.MaxWinners ?
                                    <button 
                                        onClick={() => {
                                            openGrant(grant._id, userData)
                                            router.refresh()
                                        }}
                                        className={`rounded text-center px-4 py-2 hover:scale-105 text-white mt-6 ${protanopia ? "custom-green-background-pt" : deuteranopia ? "custom-green-background-dt" : tritanopia ? "custom-green-background-tr" : "custom-green-background"}`}
                                        aria-label="Change grant status to open"
                                    >
                                        Open Grant
                                    </button>
                                :
                                    <></>
                            }

                            <Link href={`/dashboard/my-grants/${grant._id}`} className="rounded text-center border border-black dark:border-white px-4 py-2 hover:scale-105 ms-0 sm:ms-auto dark:d-text mt-6">
                                View More Info
                            </Link>
                        </div>
                    </div>
                </details>
            )
        })
        return grantElements
    }

    return(
        <DashboardInnerContainer>
            <section className="min-h-screen">
                <h1 tabIndex={0} className="dark:d-text text-4xl">My Grants</h1>
                <div>
                    {getGrantElements(grants)}
                </div>
            </section>
        </DashboardInnerContainer>
    )
}

export default MyGrants