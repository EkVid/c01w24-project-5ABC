

const DashboardInnerContainer = ({children}) => {
    return(
        <main className="p-8 dark:shadow-none dark:border-t-2 dark:border-l-2 dark:border-neutral-600 custom-inner-shadow transition-colors">
            {children}
        </main>
    )
}

export default DashboardInnerContainer