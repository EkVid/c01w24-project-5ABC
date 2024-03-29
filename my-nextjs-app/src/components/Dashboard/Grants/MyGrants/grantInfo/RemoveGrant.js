import axios from "axios"
import { useRouter } from "next/navigation"
import { useState, useContext } from "react"
import ColourBlindnessContext from "@/components/utils/ColorBlindnessContext";
import { getcbMode } from "@/components/utils/cbMode";

export default function RemoveGrant({ grant, grantID }){
    const router = useRouter()
    const userData = JSON.parse(sessionStorage.getItem('userData'))
    const [deleteState, setDeleteState] = useState(false)
    const cbMode = useContext(ColourBlindnessContext)
    const { protanopia, deuteranopia, tritanopia } = getcbMode(cbMode)

    if(!userData){
        router.push('/login')
    }

    async function deleteGrant(){
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${userData.token}`
        }

        try{
            await axios.delete(`http://localhost:5000/deleteGrant/${grantID}`, {headers:headers})
            router.push('/dashboard/my-grants')
        }   
        catch(err){
            console.log('Error deleting grant:', err)
        }
    }

    return(
        <div className="flex flex-col my-16">
            <h2 tabIndex="0" className="dark:d-text text-3xl">Remove '{grant.Title}'</h2>
            {!deleteState ? 
                <button 
                    className="rounded w-fit text-center px-4 py-2 hover:scale-105 text-white mt-6 bg-[#d76b65]" 
                    onClick={() => setDeleteState(true)}
                >
                    Delete Grant
                </button>
            :
                <div>
                    <p tabIndex={0} className="dark:d-text mt-6 mb-2">Are you sure you want to delete the grant</p>
                    <div className="flex flex-row justify-between">
                        <button 
                            className={`rounded w-fit text-center px-4 py-2 hover:scale-105 text-white ${protanopia ? "custom-yellow-background-pt" : deuteranopia ? "custom-yellow-background-dt" : tritanopia ? "custom-yellow-background-tr" : "bg-[#d1aa64]"}`} 
                            onClick={()=> setDeleteState(false)}
                        >
                            No
                        </button>
                        <button 
                            className="rounded w-fit text-center px-4 py-2 hover:scale-105 text-white bg-[#d76b65]" 
                            onClick={deleteGrant}
                        >
                            Yes Delete {grant.Title}
                        </button>
                    </div>

                    
                </div>
            
            
            }
            
        </div>
    )
}