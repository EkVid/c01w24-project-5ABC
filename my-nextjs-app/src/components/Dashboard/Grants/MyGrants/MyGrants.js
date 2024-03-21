import Link from "next/link"
import DashboardInnerContainer from "../../InnerContainer"
import { useRouter } from 'next/navigation'
import axios from "axios"

const MyGrants = ({ grants }) => {
    const router = useRouter()
    const userData = sessionStorage.getItem('userData')

    if(!userData){
        router.push('/login')
    }

    function getGrantStatus(grant){
        if(grant.NumWinners === grant.MaxWinners) return 'Awarded'
        if(!grant.Active) return 'Closed'
        return 'Open'
    }

    async function openGrant(grant){
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${userData.token}`
        }
        
        const body= {
            grantID: grant._id,
            active: true,
        }

        try{
            const response = await axios.post('http://localhost:5000/updateGrantStatus', body, {headers: headers})
            router.refresh()
        }
        catch(err){
            console.error(err)
        }
    }

    async function closeGrant(grant){
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${userData.token}`
        }
        
        const body= {
            grantID: grant._id,
            active: false,
        }

        try{
            const response = await axios.post('http://localhost:5000/updateGrantStatus', body, {headers: headers})
            router.refresh()
        }
        catch(err){
            console.error(err)
        }
    }

    function getGrantElements(grants){
        const grantElements = grants.map(grant => {
            const grantStatus = getGrantStatus(grant)
            
            return( 
                //TODO: make key unique, likely from grantID returned
                <details className="group px-4 py-4 my-4 rounded-md border border-black dark:border-white" key={grant._id}>
                    <summary className="flex flex-col sm:flex-row hover:cursor-pointer group-open:mb-5 justify-between items-center">
                        <h2 className="dark:d-text text-xl text-centerfont-bold">{grant.Title}</h2>
                        {/* Set proper color classes after merch with applicant dashboard */}
                        <div className={`rounded-full text-center text-white px-4 py-2 mt-2 sm:mt-0 ${grantStatus === 'Awarded' ? 'custom-green-background' : (grantStatus === 'Open' ? 'bg-[#d1aa64]' : 'bg-[#d76b65]')}`}>
                            {grantStatus}
                        </div>
                    </summary>

                    <div className="flex flex-col gap-y-2 sm:gap-y-0">
                        <p className="pt-2 dark:d-text">Description: {grant.Description}</p>
                        <p className="pt-2 dark:d-text">Grant Winners Picked: {grant.NumWinners}</p>
                        <p className="pt-2 dark:d-text">Maximum Number of Grant Winners: {grant.MaxWinners}</p>
                        <p className="pt-2 dark:d-text">Amount Per Winner (CAD $): {grant.AmountPerApp}</p>
                        <p className="pt-2 dark:d-text">Application Deadline: {grant.Deadline}</p>

                        <div className="w-full flex flex-col sm:flex-row">
                            {grant.Active ? 
                                <button 
                                    onClick={() => closeGrant(grant)}
                                    className="rounded text-center px-4 py-2 hover:scale-105 text-white mt-6 bg-[#d76b65]"
                                >
                                    Close Grant
                                </button>
                            :
                                grant.NumWinners < grant.MaxWinners ?
                                    <button 
                                        onClick={() => openGrant(grant)}
                                        className="rounded text-center px-4 py-2 hover:scale-105 text-white mt-6 custom-green-background"
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
                <div>
                    {getGrantElements(grants)}
                </div>
            </section>
        </DashboardInnerContainer>
    )
}

export default MyGrants