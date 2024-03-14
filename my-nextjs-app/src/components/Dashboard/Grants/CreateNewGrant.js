'use client'
import DashboardInnerContainer from "../InnerContainer"
import { useState, useEffect } from "react"
import Link from "next/link"

// TODO: Vefiry max age is filled out when min age isnt

const CreateNewGrant = () => {
    // Initialize grant to default or last in-progress one
    const progressGrant = JSON.parse(localStorage.getItem('grant'))
    const defaultGrant = {
        Title: "",
        Description: "",
        WinnerIDs: [],
        AppliedIDs: [],
        NumWinners: 0,
        MaxWinners: 0,
        Deadline: '0000-00-00',
        PostedDate: null,
        profileReqs: {
            minAge: 0,
            maxAge: 0,
            race: [],
            gender: [],
            nationality: "",
            veteran: 2,
        },
        Active: true,
        AmountPerApp: 0,
        QuestionData: null,
        Files: [],
    }
    const initGrant = progressGrant ? progressGrant : defaultGrant

    const [ grant, setGrant ] = useState(initGrant)

    // Only show undo if there was a previous deletion
    const undoShow = localStorage.getItem('clearedGrant') !== null

    // Form onChange handlers
    function setTitle(e){
        setGrant(prevGrant => ({...prevGrant, Title:e.target.value}))
    }

    function setDescription(e){
        setGrant(prevGrant => ({...prevGrant, Description:e.target.value}))
    }

    function setMaxWinners(e){
        setGrant(prevGrant => ({...prevGrant, MaxWinners:e.target.value}))
    }

    function checkMaxWinners(e){
        // Ensure a minimum of 1 winner
        if(e.target.value < 1){
            setGrant(prevGrant => ({...prevGrant, MaxWinners:1}))
        }
    }

    function setAmountPerApp(e){
        setGrant(prevGrant => ({...prevGrant, AmountPerApp:e.target.value}))
    }

    function roundAmount(e){
        // Round to nearest cent
        let newAmount = Math.round((grant.AmountPerApp) * 100) / 100
        setGrant(prevGrant => ({...prevGrant, AmountPerApp:newAmount}))
    }

    function checkAmountAboveZero(e){
        if(e.target.value < 0){
            setGrant(prevGrant => ({...prevGrant, AmountPerApp:0}))
        }
    }

    function setDeadline(e){
        setGrant(prevGrant => ({...prevGrant, Deadline:e.target.value}))
    }

    function checkDeadlineValidity(e){
        const today = new Date().toJSON().slice(0, 10);
        if(e.target.value < today){
            setGrant(prevGrant => ({...prevGrant, Deadline:today}))
        }
    }

    function setMinAge(e){
        setGrant(prevGrant => ({...prevGrant, profileReqs:{...prevGrant.profileReqs, minAge:e.target.value}}))
    }

    function checkAgeAboveZero(e){
        console.log('here')
        if(e.target.value < 0){
            console.log('in')
            setGrant(prevGrant => ({...prevGrant, profileReqs:{...prevGrant.profileReqs, minAge:0}}))
        }
    }

    function setMaxAge(e){
        setGrant(prevGrant => ({...prevGrant, profileReqs:{...prevGrant.profileReqs, maxAge:e.target.value}}))
    }

    function checkAboveMin(e){
        const minAge = grant.profileReqs.minAge
        if(e.target.value < minAge){
            setGrant(prevGrant => ({...prevGrant, profileReqs:{...prevGrant.profileReqs, maxAge:minAge}}))
        }
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
                                value={grant.Title}
                                onChange={setTitle}
                                placeholder="My Grant Title*"
                                required
                            />
                        </label>

                        <label className="flex md:flex-row flex-col items-top ms-4 mb-10">
                            <p className="pt-2 dark:d-text">Desctipion*&nbsp;:</p>
                            <textarea 
                                className="md:mx-4 mx-0 p-2 rounded-md w-full custom-dark-grey-background border-2 border-neutral-300 focus:border-neutral-600 dark:d-text dark:d-custom-dark-grey-background dark:border-neutral-700 dark:focus:border-white" 
                                value={grant.Description} 
                                onChange={setDescription}
                                placeholder="The description of my grant..."
                                required
                            >
                            </textarea>
                        </label>

                        <label className="flex md:flex-row flex-col items-top ms-4 mb-10">
                            <p className="pt-2 dark:d-text">Number of Grant Winners*&nbsp;:</p>
                            <input 
                                type="number"
                                className="mx-4 p-2 custom-dark-grey-background rounded-md border-2 border-neutral-300 focus:border-neutral-600 dark:d-text dark:d-custom-dark-grey-background dark:border-neutral-700 dark:focus:border-white" 
                                value={grant.MaxWinners} 
                                onChange={setMaxWinners}
                                onBlur={checkMaxWinners}
                                required
                            />
                        </label>

                        <label className="flex md:flex-row flex-col items-top ms-4 mb-10">
                            <p className="pt-2 dark:d-text">Amount Per Winner (CAD $)*&nbsp;:</p>
                            <input 
                                type="number"
                                className="mx-4 p-2 custom-dark-grey-background rounded-md border-2 border-neutral-300 focus:border-neutral-600 dark:d-text dark:d-custom-dark-grey-background dark:border-neutral-700 dark:focus:border-white" 
                                value={grant.AmountPerApp} 
                                onChange={setAmountPerApp}
                                step='0.01'
                                min={0}
                                onBlur={(e) => {
                                    roundAmount(e)
                                    checkAmountAboveZero(e, 'AmountPerApp')
                                }}
                                placeholder="0.00"
                                required
                            />
                        </label>

                        <div className="w-full flex md:flex-row flex-col items-center ms-4 mb-10">
                            <p className="self-start md:self-auto dark:d-text">Application Form*&nbsp;:</p>
                            <div className="flex-grow w-full md:w-fit ms-4 me-8 flex flex-row items-center rounded-md custom-dark-grey-background border-2 border-neutral-300 dark:d-text dark:d-custom-dark-grey-background dark:border-neutral-700">
                                <p 
                                    className="mx-auto text-center dark:d-text bg-transparent focus:outline-none dark:placeholder:text-neutral-300"
                                >
                                    {grant.Title ? grant.Title : 'Default'} Form
                                </p>
                                <Link href={`/edit/${grant.Title}`} className="px-8 my-2 md:my-0 text-center py-4 rounded-md custom-green-background text-white border-2 border-neutral-300 hover:scale-105 dark:d-text dark:border-neutral-700">
                                    Edit
                                </Link>
                            </div> 
                        </div>

                        <label className="flex md:flex-row flex-col items-top ms-4 mb-10">
                            <p className="pt-2 dark:d-text">Application Deadline*&nbsp;:</p>
                            <input 
                                type="date"
                                className="mx-4 p-2 custom-dark-grey-background rounded-md border-2 border-neutral-300 focus:border-neutral-600 dark:d-text dark:d-custom-dark-grey-background dark:border-neutral-700 dark:focus:border-white" 
                                value={grant.Deadline} 
                                onChange={setDeadline}
                                onBlur={checkDeadlineValidity}
                                required
                            />
                        </label>

                        <div className="flex flex-col items-top ms-4 mb-20">
                            <p className="w-full pt-2 dark:d-text">Grantee Profile - Tell us about your ideal applicant: </p>
                            <div 
                                className="self-center md:mx-4 mx-0 p-2 my-4 rounded-md w-full custom-dark-grey-background border-2 border-neutral-300 focus:border-neutral-600 dark:d-text dark:d-custom-dark-grey-background dark:border-neutral-700 dark:focus:border-white" 
                            >
                                <label className="">
                                    Age:
                                    <input 
                                        type="number"
                                        className="mx-4 p-2 bg-white rounded-md border-2 border-neutral-300 focus:border-neutral-600 dark:d-text dark:d-custom-dark-grey-background dark:border-neutral-700 dark:focus:border-white" 
                                        value={grant.profileReqs.minAge} 
                                        onChange={setMinAge}
                                        step='1'
                                        onBlur={checkAgeAboveZero}
                                        placeholder="0"
                                    />
                                    -
                                    <input 
                                        type="number"
                                        className="mx-4 p-2 bg-white rounded-md border-2 border-neutral-300 focus:border-neutral-600 dark:d-text dark:d-custom-dark-grey-background dark:border-neutral-700 dark:focus:border-white" 
                                        value={grant.profileReqs.maxAge} 
                                        onChange={setMaxAge}
                                        onBlur={checkAboveMin}
                                        placeholder="0"
                                    />
                                </label>

                            </div>
                        </div>

                        <div className="w-full flex sm:flex-row flex-col items-center justify-end sm:gap-6">
                            <button 
                                type="button"
                                id='undo-btn'
                                className={`${undoShow ? '' : 'hidden'} hover:underline dark:d-text`} 
                                onClick={handleUndo}
                            >
                                Restore
                            </button>
                            <button
                                type="button"
                                className="px-6 my-2 md:my-0 text-center py-4 sm:me-2 rounded-md hover:scale-105 bg-white hover:bg-red-600 border-2 border-neutral-300 disabled:text-neutral-400 disabled:bg-transparent dark:d-text dark:disabled:bg-transparent dark:disabled:text-neutral-400 dark:d-custom-dark-grey-background dark:hover:bg-red-600 dark:border-neutral-700"
                                onClick={clearForm}
                                disabled={(!grant.Title && !grant.Description && grant.MaxWinners === 0 && !grant.AmountPerApp && !grant.QuestionData && !grant.Deadline)}
                            >
                                Clear
                            </button>
                            <button
                                type="submit"
                                className="px-6 my-2 md:my-0 text-center py-4 rounded-md hover:scale-105 disabled:hover:scale-100 custom-green-background disabled:text-neutral-400 dark:disabled:bg-transparent dark:disabled:text-neutral-400 disabled:bg-transparent dark:d-text border-2 border-neutral-300 dark:d-text dark:border-neutral-700"
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