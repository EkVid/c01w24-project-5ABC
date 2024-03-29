import ReducedMotionContext from "@/components/utils/ReducedMotionContext";
import ColourBlindnessContext from "@/components/utils/ColorBlindnessContext";
import { getcbMode } from "@/components/utils/cbMode";
import { useContext } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

const DashboardHeader = () => {
    const isReducedMotion = useContext(ReducedMotionContext)
    const cbMode = useContext(ColourBlindnessContext)
    const { protanopia, deuteranopia, tritanopia } = getcbMode(cbMode)
    const router = useRouter()

    const userData = JSON.parse(sessionStorage.getItem('userData'))

    if(!userData){
        router.push('/login')
    }

    async function handleLogout(){
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${userData.token}`
        }

        try{
            const res = await axios.post("http://localhost:5000/logout", {Email: userData.email}, {headers: headers})
            sessionStorage.removeItem('userData')
            router.push('/')
        }
        catch(err){
            console.error(err)
        }
        return
    }

    return(
        <header className={`flex justify-end w-full p-2 ${isReducedMotion ? "" : "transition-colors"}`}>
            <div tabIndex="0" className="flex flex-row items-center p-2 rounded border border-slate-300 dark:border-white dark:d-text">
                <div className="w-8 h-8 rounded-full bg-slate-200 me-4"></div>
                <h2>{userData.email} (<span className="text-capitalize">{userData.type}</span>)</h2>
            </div>
            <button onClick={handleLogout} className="ms-4 flex flex-row items-center p-2 rounded hover:underline border border-slate-300 dark:border-white dark:d-text">
                Logout
            </button>
        </header>
    )
}

export default DashboardHeader