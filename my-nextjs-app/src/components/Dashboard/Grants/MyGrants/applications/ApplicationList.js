import DashboardInnerContainer from "@/components/Dashboard/InnerContainer"
import Link from "next/link"

export default function ApplicationList({ applications }){
    let applicationElements

    if(applications.length === 0){
        applicationElements = 
            <h1>
                Uh oh! There are no applications for this grant. 
                <Link href='/dashboard/my-grants' className="ps-2 underline">
                    Go Back
                </Link>
            </h1>
    }
    else{
        applicationElements = applications.map(application => {
            <>An application</>
        })
    }


    return(
        <DashboardInnerContainer>
            <section>
                <h1 className="text-3xl mb-10 ">Applications</h1>
                {applicationElements}
            </section>
            
        </DashboardInnerContainer>
   
    )
}