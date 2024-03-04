import Sidebar from "./Sidebar"

const DashboardLayout = ({ children }) => {
    return(
        <div className="mb-auto">
            <Sidebar/>
            {children}
        </div>
    )
}

export default DashboardLayout