import ReducedMotionContext from "@/components/utils/ReducedMotionContext";
import { useContext } from "react";

const DashboardHeader = () => {
    const isReducedMotion = useContext(ReducedMotionContext)

    return(
        <header className={`flex justify-end w-full p-4 ${isReducedMotion ? "" : "transition-colors"}`}>
            <h1 className="dark:d-text">Header</h1>
        </header>
    )
}

export default DashboardHeader