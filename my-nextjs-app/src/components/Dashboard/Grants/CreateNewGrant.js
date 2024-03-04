'use client'
import DashboardInnerContainer from "../InnerContainer"
import { useState, useEffect } from "react"
import Link from "next/link"

const CreateNewGrant = () => {
    // Initialize grant to default or last in-progress one
    const progressGrant = JSON.parse(localStorage.getItem('grant'))
    const defaultGrant = {
        title: "",
        description: "",
        numWinners: 0,
        form: {title: "", questionData: null},
        profile: null,
    }
    const initGrant = progressGrant ? progressGrant : defaultGrant

    const [ grant, setGrant ] = useState(initGrant)

    // Only show undo if there was a previous deletion
    const undoShow = localStorage.getItem('clearedGrant') !== null

    // Form onChange handlers
    function setTitle(e){
        setGrant(prevGrant => ({...prevGrant, title:e.target.value}))
    }

    function setDescription(e){
        setGrant(prevGrant => ({...prevGrant, description:e.target.value}))
    }

    function setNumWinners(e){
        setGrant(prevGrant => ({...prevGrant, numWinners:e.target.value}))
    }

    function setFormTitle(e){
        setGrant(prevGrant => ({...prevGrant, form:{title: e.target.value, questionData: prevGrant.questionData}}))
    }
    
    function handleUndo(){
        const oldGrant = JSON.parse(localStorage.getItem('clearedGrant', JSON.stringify(grant)))
        localStorage.removeItem('clearedGrant')
        setGrant(oldGrant)
    }

    // Button functions
    function clearForm(){
        localStorage.setItem('clearedGrant', JSON.stringify(grant))
        setGrant(defaultGrant)
    }

    function handleSubmit(e){
        e.preventDefault()
        console.log("form submitted")
        // localStorage.removeItem('grant')
    }

    // Set form to session storage for preservation on page refresh
    // Form is deleted after posting
    useEffect(() => {
        localStorage.setItem('grant', JSON.stringify(grant))
    }, [grant])

    return(
        <DashboardInnerContainer>
            <div>
                <h1 className="text-3xl dark:d-text">
                    Create New Grant
                </h1>

                <p className="text-lg dark:d-text my-6 ms-6">
                    Seamlessly create new grants with a quick and easy application 
                    form builder. Drag and drop any question type and customize it 
                    to your needs. Mix and match to create the perfect form!
                </p>

                <div className="w-full shadow-2xl rounded-xl p-8 dark:shadow-none dark:border-2 dark:border-neutral-600">
                    <form onSubmit={handleSubmit}>
                        <label>
                            <input 
                                className="w-full mb-10 text-3xl dark:d-text bg-transparent focus:outline-none dark:placeholder:text-neutral-300"
                                type="text" 
                                value={grant.title}
                                onChange={setTitle}
                                placeholder="My Grant Title*"
                                required
                            />
                        </label>

                        <label className="flex md:flex-row flex-col items-top ms-4 mb-10">
                            <p className="pt-2 dark:d-text">Desctipion&nbsp;:</p>
                            <textarea 
                                className="md:mx-4 mx-0 p-2 rounded-md w-full custom-dark-grey-background border-2 border-neutral-300 focus:border-neutral-600 dark:d-text dark:d-custom-dark-grey-background dark:border-neutral-700 dark:focus:border-white" 
                                value={grant.description} 
                                onChange={setDescription}
                                placeholder="The description of my grant..."
                            >
                            </textarea>
                        </label>

                        <label className="flex md:flex-row flex-col items-top ms-4 mb-10">
                            <p className="pt-2 dark:d-text">Number of Grant Winners*&nbsp;:</p>
                            <input 
                                type="number"
                                className="mx-4 p-2 custom-dark-grey-background rounded-md border-2 border-neutral-300 focus:border-neutral-600 dark:d-text dark:d-custom-dark-grey-background dark:border-neutral-700 dark:focus:border-white" 
                                value={grant.numWinners} 
                                onChange={setNumWinners}
                                min={1}
                                required
                            />
                        </label>

                        <label className="w-full flex md:flex-row flex-col items-center ms-4 mb-10">
                            <p className="dark:d-text">Application Form*&nbsp;:</p>
                            <div className="flex md:flex-row flex-col items-center rounded-md custom-dark-grey-background border-2 border-neutral-300 dark:d-text dark:d-custom-dark-grey-background dark:border-neutral-700">
                                <input 
                                    className="w-full dark:d-text bg-transparent focus:outline-none dark:placeholder:text-neutral-300"
                                    type="text"
                                    value={grant.form.title}
                                    onChange={setFormTitle}
                                    placeholder="My Form Name*"
                                    required
                                />
                                <Link href='/formEditor' className="px-8 my-2 md:my-0 text-center py-4 rounded-md custom-green-background text-white border-2 border-neutral-300 hover:scale-105 dark:d-text dark:border-neutral-700">
                                    Edit
                                </Link>
                            </div> 
                        </label>

                        {/* <div className="w-full flex md:flex-row flex-col items-center ms-4 mb-10">
                            <p className="dark:d-text">Application Form*&nbsp;:</p>
                            <div className="flex flex-col sm:flex-row flex-grow items-center md:ms-4 md:me-8 mx-0 px-2 py-2 rounded-md custom-dark-grey-background border-2 border-neutral-300 dark:d-text dark:d-custom-dark-grey-background dark:border-neutral-700">
                                <p className="flex-grow text-center dark:d-text">My Custom Form</p>
                                <Link href='#' className="px-6 my-2 md:my-0 text-center py-4 me-2 rounded-md bg-white border-2 border-neutral-300 dark:d-text dark:d-custom-dark-grey-background dark:border-neutral-700">Applicant View</Link>
                                <Link href='/formEditor' className="px-8 my-2 md:my-0 text-center py-4 rounded-md custom-green-background text-white border-2 border-neutral-300 hover:scale-105 dark:d-text dark:border-neutral-700">
                                    Edit
                                </Link>
                            </div>
                        </div> */}

                        <label className="flex md:flex-row flex-col items-top ms-4 mb-20">
                            <p className="pt-2 dark:d-text">Grantee Profile&nbsp;:</p>
                            <textarea 
                                className="md:mx-4 mx-0 p-2 rounded-md w-full custom-dark-grey-background border-2 border-neutral-300 focus:border-neutral-600 dark:d-text dark:d-custom-dark-grey-background dark:border-neutral-700 dark:focus:border-white" 
                                
                                placeholder="Profile - TODO"
                            >
                            </textarea>
                        </label>

                        <div className="w-full flex sm:flex-row flex-col items-center justify-end sm:gap-6">
                            <button 
                                type="button"
                                id='undo-btn'
                                className={`${undoShow ? '' : 'hidden'} hover:underline dark:d-text`} 
                                onClick={handleUndo}
                            >
                                Undo
                            </button>
                            <button
                                type="button"
                                className="px-6 my-2 md:my-0 text-center py-4 sm:me-2 rounded-md hover:scale-105 bg-white hover:bg-red-600 border-2 border-neutral-300 disabled:text-neutral-400 disabled:bg-transparent dark:d-text dark:disabled:bg-transparent dark:disabled:text-neutral-400 dark:d-custom-dark-grey-background dark:hover:bg-red-600 dark:border-neutral-700"
                                onClick={clearForm}
                                disabled={(!grant.title && !grant.description && grant.numWinners === 0 && !grant.form && !grant.profile)}
                            >
                                Clear
                            </button>
                            <button
                                type="submit"
                                className="px-6 my-2 md:my-0 text-center py-4 rounded-md hover:scale-105 custom-green-background disabled:text-neutral-400 dark:disabled:bg-transparent dark:disabled:text-neutral-400 disabled:bg-transparent dark:d-text border-2 border-neutral-300 dark:d-text dark:border-neutral-700"
                                disabled={!(grant.title && grant.numWinners > 0 && grant.form)}
                            >
                                Confirm
                            </button>
                        </div>
                        
                    </form>
                    
                </div>
            </div>
        </DashboardInnerContainer>
    )
}

export default CreateNewGrant