'use client'
import ApplicationList from "../applications/ApplicationList"
import RemoveGrant from "./RemoveGrant"
import DashboardInnerContainer from "@/components/Dashboard/InnerContainer"
import { getGrantStatus, openGrant, closeGrant } from "../utils"
import { useRouter } from "next/navigation"

export default function GrantInfo({ grant, grantID, applications }){
    const router = useRouter()
    const grantStatus = getGrantStatus(grant)
    const userData = JSON.parse(sessionStorage.getItem('userData'))

    if(!userData){
        router.push('/login')
    }

    return(
        <DashboardInnerContainer>
            <div className="mb-10 dark:d-text">
                <div className="mb-8 flex flex-col sm:flex-row justify-between items-center">
                    <h2 tabIndex="0" className="w-full mb-0 text-3xl dark:d-text bg-transparent">
                        {grant.Title}
                    </h2>
                    {/* Set proper color classes after merch with applicant dashboard */}
                    <div tabIndex="0" aria-label={`Grant status: ${grantStatus}`}   className={`rounded-full text-center text-white px-4 py-2 mt-2 sm:mt-0 ${grantStatus === 'Awarded' ? 'custom-green-background' : (grantStatus === 'Open' ? 'bg-[#d1aa64]' : 'bg-[#d76b65]')}`}>
                        {grantStatus}
                    </div>
                </div>

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
                                closeGrant(grantID, userData)
                                router.refresh()
                                console.log(grant)
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
                                    openGrant(grantID, userData)
                                    router.refresh()
                                    console.log(grant)
                                }}
                                className="rounded text-center px-4 py-2 hover:scale-105 text-white mt-6 custom-green-background"
                                aria-label="Change grant status to open"
                            >
                                Open Grant
                            </button>
                        :
                            <></>
                    }
                </div>
            </div>
     
            <RemoveGrant grant={grant} grantID={grantID} />
            <ApplicationList applications={applications}/>
        </DashboardInnerContainer>
    )
}