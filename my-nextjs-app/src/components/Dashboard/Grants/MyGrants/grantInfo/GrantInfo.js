'use client'
import ApplicationList from "../applications/ApplicationList"
import RemoveGrant from "./RemoveGrant"
import DashboardInnerContainer from "@/components/Dashboard/InnerContainer"
import { getGrantStatus, openGrant, closeGrant } from "../utils"
import { useRouter } from "next/navigation"

export default function GrantInfo({ grant, grantID, applications }){
    grant
    const router = useRouter()
    const grantStatus = getGrantStatus(grant)
    const userData = JSON.parse(sessionStorage.getItem('userData'))

    if(!userData){
        router.push('/login')
    }

    return(
        <DashboardInnerContainer>
            <div className="mb-10">
                <div className="mb-8 flex flex-col sm:flex-row justify-between items-center">
                    <h2 className="w-full mb-0 text-3xl dark:d-text bg-transparent focus:outline-none dark:placeholder:text-neutral-300">
                        {grant.Title}
                    </h2>
                    {/* Set proper color classes after merch with applicant dashboard */}
                    <div className={`rounded-full text-center text-white px-4 py-2 mt-2 sm:mt-0 ${grantStatus === 'Awarded' ? 'custom-green-background' : (grantStatus === 'Open' ? 'bg-[#d1aa64]' : 'bg-[#d76b65]')}`}>
                        {grantStatus}
                    </div>
                </div>

                <p className="pt-2 dark:d-text">Description: {grant.Description}</p>
                <p className="pt-2 dark:d-text">Grant Winners Picked: {grant.NumWinners}</p>
                <p className="pt-2 dark:d-text">Maximum Number of Grant Winners: {grant.MaxWinners}</p>
                <p className="pt-2 dark:d-text">Amount Per Winner (CAD $): {grant.AmountPerApp}</p>
                <p className="pt-2 dark:d-text">Application Deadline: {grant.Deadline}</p>

                <div className="w-full flex flex-col sm:flex-row">
                    {grant.Active ? 
                        <button 
                            onClick={() => {
                                closeGrant(grantID, userData)
                                router.refresh()
                                console.log(grant)
                            }}
                            className="rounded text-center px-4 py-2 hover:scale-105 text-white mt-6 bg-[#d76b65]"
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