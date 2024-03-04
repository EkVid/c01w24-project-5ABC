import Sidebar from "./Sidebar"
import DashboardHeader from "./DashboardHeader"

const DashboardLayout = ({ children, pathname }) => {
    return(
        <section className="flex">
            <Sidebar/>
            <div className='lg:w-4/5 sm:w-2/3'>
                <DashboardHeader />
                {children}
            </div>
            
        </section>
    )
}

export default DashboardLayout