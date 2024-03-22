import axios from "axios"
import { useRouter } from "next/navigation"

export default function RemoveGrant({ grant, grantID }){
    const router = useRouter()
    const userData = JSON.parse(sessionStorage.getItem('userData'))

    if(!userData){
        router.push('/login')
    }

    async function deleteGrant(){
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${userData.token}`
        }

        try{
            await axios.delete(`http://localhost:5000/deleteGrant/${grantID}`)
            router.push('/dashboard/my-grants')
        }   
        catch(err){
            console.log('Error deleting grant:', err)
        }
    }

    return(
        <div className="flex flex-col mb-10">
            <h2 className="text-3xl">Remove {grant.Title}</h2>
            <button 
                className="rounded w-fit text-center px-4 py-2 hover:scale-105 text-white mt-6 bg-[#d76b65]" 
                onClick={deleteGrant}
            >
                Delete Grant
            </button>
        </div>
    )
}