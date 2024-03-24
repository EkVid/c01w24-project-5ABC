import Link from "next/link"
import { usePathname } from "next/navigation"
import menuIcon from "@/../public/lineThreeHor.svg"
import xMark from "@/../public/x.svg"
import Image from "next/image"

const Sidebar = () => {
    const pathname = usePathname()

    function handleSidebarPopout(){
        const dashboard = document.getElementById('grantor-sidebar')
        // dashboard.style.transform = 'translateX(100%)'
    }

    return(
        <div className="flex-grow flex flex-col xl:w-1/5 lg:w-1/4 md:w-1/3 sm:w-1/12 w-1/6 dark:d-custom-dark-grey-background transition-all">
            <nav className="h-full block md:hidden w-full flex justify-center items-start mt-2 group cursor-pointer" onClick={handleSidebarPopout}>
                <Image
                    src={menuIcon}
                    alt="menu"
                    className="w-12 h-auto dark:d-white-filter group-hover:scale-105"
                />
            </nav>

            <nav id='grantor-sidebar' className="md:inline md:static hidden bg-inherit dark:bg-d-custom-dark-grey-background transition-transform">
                <div className="w-full">
                    {/* <Image
                        src={xMark}
                        alt="exit"
                        className="md:hidden block w-12 h-auto dark:d-white-filter group-hover:scale-105"
                    /> */}
                    <Link aria-label="dashboard home" href="/dashboard" className="w-full">
                        <h1 className="text-center text-3xl dark:d-text my-6">Logo</h1>
                    </Link>
                </div>
                
                <details className="group" open>
                    <summary className="list-none flex items-center w-full cursor-pointer">
                        <h1 className="custom-dark-grey dark:d-text text-3xl ms-8 me-auto">Grants</h1>
                        <div className="custom-dark-grey dark:d-text cs-text-5xl mx-5 group-open:rotate-90 transition-transform">
                            &#8250;
                        </div>
                    </summary>

                    <ul className="custom-dark-grey text-lg dark:d-text w-full ps-16 pe-2 ">
                        <li className={`${pathname.includes('my-grants') ? "custom-green-background text-white" : "bg-transparent"} w-full p-2 rounded-lg`}>
                            <Link aria-label="my grants" href='/dashboard/my-grants'>My Grants</Link>
                        </li>
                        <li className={`${pathname.includes('create-new-grant') ? "custom-green-background text-white" : "bg-transparent"} w-full p-2 lg:pe-0 pe-2 rounded-lg`}>
                            <Link aria-label="create new grant" href='/dashboard/create-new-grant'>Create New Grant</Link>
                        </li>
                    </ul>
                </details>
            </nav>
        </div>
    )
}

export default Sidebar