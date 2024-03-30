'use client'
import ApplicationList from "../applications/ApplicationList"
import Application from "../applications/Application"
import RemoveGrant from "./RemoveGrant"
import DashboardInnerContainer from "@/components/Dashboard/InnerContainer"
import ColourBlindnessContext from "@/components/utils/ColorBlindnessContext";
import { getcbMode } from "@/components/utils/cbMode";
import { useContext, useState } from "react";
import { getGrantStatus, openGrant, closeGrant, getApplciationStatus } from "../utils"
import { useRouter } from "next/navigation"
import Link from "next/link"
import axios from "axios"

export default function GrantInfo({ grant, grantID, applications }){
    const router = useRouter()
    const [viewApp, setViewApp] = useState(false)
    const [currApp, setCurrApp] = useState(null)
    const grantStatus = getGrantStatus(grant)
    const cbMode = useContext(ColourBlindnessContext)
    const { protanopia, deuteranopia, tritanopia } = getcbMode(cbMode)
    const userData = JSON.parse(sessionStorage.getItem('userData'))
    let applicationStatus = getApplciationStatus(currApp)

    if(!userData){
        router.push('/login')
    }

    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userData.token}`
    }

    async function handleReject(){
        const body = {
            applicationID: currApp._id,
        }

        try{
            const res = await axios.put('http://localhost:5000/updateGrantLosers', body, {headers: headers})
            console.log(res)
            setCurrApp(null)
            setViewApp(false)
            router.refresh()
        }
        catch(err){
            console.error('There was an error accepting this applicant', err)
        }
        return
    }

    async function handleAccept(){
        const body = {
            applicationID: currApp._id,
        }

        try{
            const res = await axios.put('http://localhost:5000/updateGrantWinners', body, {headers: headers})
            console.log(res)
            setCurrApp(null)
            setViewApp(false)
            router.refresh()
        }
        catch(err){
            console.error('There was an error accepting this applicant', err)
        }
        return
    }

    return(
        <DashboardInnerContainer>
            <div className="mb-10 dark:d-text">
                <Link href="/dashboard/my-grants" className="text-center dark:d-text hover:underline">
                    Back to My Grants
                </Link>
                <div className="mt-6 mb-8 flex flex-col sm:flex-row justify-between items-center">
                    <h2 tabIndex="0" className="w-full mb-0 text-3xl dark:d-text bg-transparent">
                        {grant.Title}
                    </h2>
                    {/* Set proper color classes after merch with applicant dashboard */}
                    <div tabIndex="0" aria-label={`Grant status: ${grantStatus}`}   className={`rounded-full text-center text-white px-4 py-2 mt-2 sm:mt-0 ${grantStatus === 'Awarded' ? (protanopia ? "custom-green-background-pt" : deuteranopia ? "custom-green-background-dt" : tritanopia ? "custom-green-background-tr" : "custom-green-background") : (grantStatus === 'Open' ? (protanopia ? "custom-yellow-background-pt" : deuteranopia ? "custom-yellow-background-dt" : tritanopia ? "custom-yellow-background-tr" : "bg-[#d1aa64]") : 'bg-[#d76b65]')}`}>
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
                        <div className="flex flex-col">
                            <p className="mt-8 dark:d-text">Close the grant to new applications</p>
                            <button 
                                onClick={() => {
                                    closeGrant(grantID, userData)
                                    router.refresh()
                                    console.log(grant)
                                }}
                                className="rounded text-center px-4 py-2 hover:scale-105 text-white mt-2 bg-[#d76b65]"
                                aria-label="Change grant status to closed"
                            >
                                Close Grant
                            </button>
                        </div>
             
                    :
                        grant.NumWinners < grant.MaxWinners ?
                            <div className="flex flex-col">
                                <p className="mt-8 dark:d-text">Open the grant to new applications</p>
                                <button 
                                    onClick={() => {
                                        openGrant(grantID, userData)
                                        router.refresh()
                                        console.log(grant)
                                    }}
                                    className={`rounded text-center px-4 py-2 hover:scale-105 text-white mt-2 ${protanopia ? "custom-green-background-pt" : deuteranopia ? "custom-green-background-dt" : tritanopia ? "custom-green-background-tr" : "custom-green-background"}`}
                                    aria-label="Change grant status to open"
                                >
                                    Open Grant
                                </button>
                            </div>
                        :
                            <></>
                    }
                </div>
            </div>
     
            {viewApp ? 
                <div className="my-16">
                    <button onClick={()=>{setViewApp(false)}} className="mb-6 text-center dark:d-text hover:underline">
                        Back to all applications
                    </button>
                    <Application application={currApp} QuestionData={grant.QuestionData} />

                    {currApp && applicationStatus === 'Pending' && grant.NumWinners < grant.MaxWinners ? 
                        <div className="flex flex-row justify-between my-10">
                            <button onClick={handleReject} className={`p-2 text-center rounded hover:scale-105 text-white bg-[#d76b65]`}>
                                Reject Application
                            </button>
                            <button onClick={handleAccept} className={`p-2 text-center rounded hover:scale-105 text-white ${protanopia ? "custom-green-background-pt" : deuteranopia ? "custom-green-background-dt" : tritanopia ? "custom-green-background-tr" : "custom-green-background"}`}>
                                Accept Application
                            </button>
                        </div>
                    :
                        <div className="flex flex-col">
                            <div tabIndex="0" aria-label={`Application status: ${applicationStatus}`} className={`rounded-full text-center text-white px-4 py-2 mt-2 sm:mt-0 ${applicationStatus === 'Accepted' ? (protanopia ? "custom-green-background-pt" : deuteranopia ? "custom-green-background-dt" : tritanopia ? "custom-green-background-tr" : "custom-green-background") : (applicationStatus === 'Pending' ? (protanopia ? "custom-yellow-background-pt" : deuteranopia ? "custom-yellow-background-dt" : tritanopia ? "custom-yellow-background-tr" : "bg-[#d1aa64]") : 'bg-[#d76b65]')}`}>
                                {applicationStatus}
                            </div>
                            <div className="flex flex-col items-end mt-6">
                                {grant.NumWinners === grant.MaxWinners ? 
                                    applicationStatus === 'Accepted' ?
                                    <>
                                        <h1>All winners have been selected </h1>
                                        <button onClick={handleReject} className={`p-2 text-center rounded hover:underline dark:d-text`}>
                                            Revoke Application
                                        </button>
                                    </>
                                    :
                                    <h1>All winners have been selected </h1>
                                
                                :
                                    applicationStatus === 'Accepted' ?
                                    <button onClick={handleReject} className={`p-2 text-center rounded hover:underline dark:d-text`}>
                                        Revoke Application
                                    </button>
                                    : applicationStatus === 'Rejected' ?
                                        <button onClick={handleAccept} className={`p-2 text-center rounded hover:underline dark:d-text`}>
                                            Accept Application
                                        </button>
                                        :
                                        <></>
                                }
                                {
                                }
                                
                                
                            </div>    
                        </div>
                        
                    }
                    
                </div>
                
            :
                <div className="my-16">
                    <ApplicationList applications={applications} setCurrApp={setCurrApp} setViewApp={setViewApp}/>
                    <RemoveGrant grant={grant} grantID={grantID} />
                </div>
            }
            
        </DashboardInnerContainer>
    )
}