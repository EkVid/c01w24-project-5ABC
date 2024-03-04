import Link from "next/link"
import { usePathname } from "next/navigation"

const Sidebar = () => {
    const pathname = usePathname()

    return(
        <div className="h-screen flex flex-col lg:w-1/5 sm:w-1/3 dark:d-custom-dark-grey-background transition-colors">
            <Link href="/dashboard" className="w-full text-center text-3xl dark:d-text my-6">
                Logo
            </Link>

            <nav className=" ">
                <details className="group" open>
                    <summary className="list-none flex items-center w-full cursor-pointer">
                        <h1 className="custom-dark-grey dark:d-text text-3xl ms-8 me-auto">Grants</h1>
                        <div className="custom-dark-grey dark:d-text cs-text-5xl mx-5 group-open:rotate-90 transition-transform">
                            &#8250;
                        </div>
                    </summary>

                    <ul className="custom-dark-grey text-lg dark:d-text w-full ps-16 pe-2">
                        <li className={`${pathname.includes('my-grants') ? "custom-green-background text-white" : "bg-transparent"} w-full p-2 rounded-lg`}>
                            <Link href='/dashboard/my-grants'>My Grants</Link>
                        </li>
                        <li className={`${pathname.includes('create-new-grant') ? "custom-green-background text-white" : "bg-transparent"} w-full p-2 rounded-lg`}>
                            <Link href='/dashboard/create-new-grant'>Create New Grant</Link>
                        </li>
                    </ul>
                    
                    
                </details>
            </nav>
        </div>
    )
}

export default Sidebar