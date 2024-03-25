export default function ApplicationList({ applications }){
    let applicationElements

    if(!applications){
        applicationElements = 
            <h1 className="dark:d-text">
                There was an error loading grant applications 
                {/* <Link href='/dashboard/my-grants' className="ps-2 underline">
                    Go Back
                </Link> */}
            </h1>
    }
    else if(applications.length === 0){
        applicationElements = 
            <h1 className="dark:d-text">
                There are no applications for this grant. 
                {/* <Link href='/dashboard/my-grants' className="ps-2 underline">
                    Go Back
                </Link> */}
            </h1>
    }
    else{
        applicationElements = applications.map(application => {
            <>An application</>
        })
    }


    return(
        <section>
            <h1 tabIndex="0" className="dark:d-text text-3xl mb-10 ">Applications</h1>
            {applicationElements}
        </section>
    )
}