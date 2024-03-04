import Sidebar from "./Sidebar"
import DashboardHeader from "./DashboardHeader"

const DashboardLayout = ({ children }) => {
    return(
        <section className="flex min-h-screen">
            <Sidebar/>
            <div className='flex flex-col xl:w-4/5 lg:w-3/4 md:w-2/3 sm:w-11/12 w-5/6'>
                <DashboardHeader />
                {children}
            </div>
            
        </section>
    )
}

export default DashboardLayout