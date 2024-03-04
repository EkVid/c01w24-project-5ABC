import Link from "next/link"
import { useRouter } from "next/router"


const Sidebar = () => {
    const router = useRouter()

    return(
        <div className="flex flex-col lg:w-1/5 dark:d-custom-dark-grey-background dark:border-e-2 dark:border-neutral-600 transition-colors">
            <h1 className="w-full text-center text-3xl dark:d-text my-6">
                Logo
            </h1>

            <nav className=" ">
                <details className="group">
                    <summary className="list-none flex items-center w-full cursor-pointer">
                        <h1 className="custom-dark-grey dark:d-text text-3xl ms-8 me-auto">Grants</h1>
                        <div className="custom-dark-grey dark:d-text cs-text-5xl mx-5 group-open:rotate-90 transition-transform">
                            &#8250;
                        </div>
                    </summary>

                    <ul className="custom-dark-grey text-lg dark:d-text w-full ms-16">
                        <li className="my-2 py-2">
                            <Link href='/dashboard/my-grants' activeClassName="bg-black">My Grants</Link>
                        </li>
                        <li className="my-2 py-2">
                            <Link href='/dashboard/create-new-grant'>Create New Grant</Link>
                        </li>
                    </ul>
                    
                    
                </details>
            </nav>
        </div>
    )
}

export default Sidebar