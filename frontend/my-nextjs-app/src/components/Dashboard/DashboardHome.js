'use client'
import DashboardInnerContainer from "./InnerContainer"
import { useRouter } from "next/navigation"

const DashboardHome = () => {
    const router = useRouter()
    return(
        <DashboardInnerContainer>
            <div className="min-h-screen dark:d-text" onLoad={router.push('/dashboard/my-grants')}></div>
        </DashboardInnerContainer>
    )
}

export default DashboardHome