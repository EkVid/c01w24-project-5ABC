

const DashboardInnerContainer = ({children}) => {
    return(
        <div className="h-screen flex flex-col p-8 dark:shadow-none dark:border-2 dark:border-neutral-600 custom-inner-shadow ">
            {children}
        </div>
    )
}

export default DashboardInnerContainer