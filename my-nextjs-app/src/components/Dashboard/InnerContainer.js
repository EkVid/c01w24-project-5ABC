

const DashboardInnerContainer = ({children}) => {
    return(
        <div className="p-8 min-h-screen dark:shadow-none dark:border-t-2 dark:border-l-2 dark:border-neutral-600 custom-inner-shadow transition-colors">
            {children}
        </div>
    )
}

export default DashboardInnerContainer