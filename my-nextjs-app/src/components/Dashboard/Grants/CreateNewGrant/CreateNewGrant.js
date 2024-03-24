'use client'
import DashboardInnerContainer from "../../InnerContainer"
import ViewGrant from "./view/ViewGrant"
import { useState, useEffect } from "react"
import Link from "next/link"
import { v4 as uuidv4 } from 'uuid';
import xMark from "@/../public/x.svg"
import Image from "next/image";

const CreateNewGrant = () => {
    // Initialize grant to default or last in-progress one
    const progressGrant = JSON.parse(localStorage.getItem('grant'))
    const defaultGrant = {
        grantorEmail: '',
        Title: "",
        Description: "",
        WinnerIDs: [],
        AppliedIDs: [],
        NumWinners: 0,
        MaxWinners: 0,
        Deadline: new Date().toISOString().split('T')[0],
        PostedDate: null,
        profileReqs: {
            minAge: 0,
            maxAge: 0,
            race: [],
            gender: [],
            nationality: [],
            veteran: 2,
        },
        Active: true,
        AmountPerApp: 0,
        QuestionData: null,
    }
    const initGrant = progressGrant ? progressGrant : defaultGrant

    const [ grant, setGrant ] = useState(initGrant)
    const [ race, setRace ] = useState('')
    const [ gender , setGender ] = useState('')
    const [ nationality, setNationality ] = useState('')
    const [ viewGrant, setViewGrant ] = useState(false)

    // Only show undo if there was a previous deletion
    const undoShow = localStorage.getItem('clearedGrant') !== null

    // --------------- Form handlers ---------------
    function setTitle(e){
        setGrant(prevGrant => ({...prevGrant, Title:e.target.value}))
    }

    function setDescription(e){
        setGrant(prevGrant => ({...prevGrant, Description:e.target.value}))
    }

    function setMaxWinners(e){
        setGrant(prevGrant => ({...prevGrant, MaxWinners:e.target.valueAsNumber}))
    }

    function checkMaxWinners(e){
        // Ensure a minimum of 1 winner
        if(e.target.value < 1){
            setGrant(prevGrant => ({...prevGrant, MaxWinners:1}))
        }
    }

    function setAmountPerApp(e){
        setGrant(prevGrant => ({...prevGrant, AmountPerApp:e.target.valueAsNumber}))
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
        setGrant(prevGrant => ({...prevGrant, profileReqs:{...prevGrant.profileReqs, minAge:e.target.valueAsNumber}}))
    }

    function verifyMinAge(e){
        if(e.target.value < 0){
            setGrant(prevGrant => ({...prevGrant, profileReqs:{...prevGrant.profileReqs, minAge:0}}))
        }
        const maxAge = grant.profileReqs.maxAge
        if(e.target.value > maxAge){
            setGrant(prevGrant => ({...prevGrant, profileReqs:{...prevGrant.profileReqs, maxAge:e.target.valueAsNumber}}))
        }
    }

    function setMaxAge(e){
        setGrant(prevGrant => ({...prevGrant, profileReqs:{...prevGrant.profileReqs, maxAge:e.target.valueAsNumber}}))
    }

    function verifyMaxAge(e){
        const minAge = grant.profileReqs.minAge
        if(e.target.value < minAge){
            setGrant(prevGrant => ({...prevGrant, profileReqs:{...prevGrant.profileReqs, maxAge:minAge}}))
            return
        }
        if(e.target.value < 0){
            setGrant(prevGrant => ({...prevGrant, profileReqs:{...prevGrant.profileReqs, maxAge:0}}))
        }
    }

    function addRace(e){
        // If the user presses enter
        if(e.keyCode === 13 && race){
            const raceArr = grant.profileReqs.race
            raceArr.push(race)
            setGrant(prevGrant => ({...prevGrant, profileReqs:{...prevGrant.profileReqs, race:raceArr}}))
            setRace('')
        }
    }

    function removeRace(race){
        const raceArr = grant.profileReqs.race
        const idx = raceArr.indexOf(race)
        if(idx > -1){
            raceArr.splice(idx, 1)
        }
        setGrant(prevGrant => ({...prevGrant, profileReqs:{...prevGrant.profileReqs, race:raceArr}}))
    }

    const raceElements = grant.profileReqs.race.map(race => {
        return (
            <div tabIndex='0' aria-label={`${race} press enter to remove`} className="flex w-fit p-2 my-0 lg:my-4 border border-black dark:border-white rounded dark:d-custom-navy-background" key={uuidv4()} onKeyUp={(e)=> e.key === 'Enter' ? removeRace(race) : null}>
                {race}
                <Image 
                    src={xMark}
                    alt='delete'
                    className='ms-2 w-6 h-6 dark:d-white-filter cursor-pointer hover:scale-110'
                    onClick={() => removeRace(race)}
                />
            </div>
        )
    })

    function addGender(e){
        // If the user presses enter
        if(e.keyCode === 13 && gender){
            const genderArr = grant.profileReqs.gender
            genderArr.push(gender)
            setGrant(prevGrant => ({...prevGrant, profileReqs:{...prevGrant.profileReqs, gender:genderArr}}))
            setGender('')
        }
    }

    function removeGender(gender){
        const genderArr = grant.profileReqs.gender
        const idx = genderArr.indexOf(gender)
        if(idx > -1){
            genderArr.splice(idx, 1)
        }
        setGrant(prevGrant => ({...prevGrant, profileReqs:{...prevGrant.profileReqs, gender:genderArr}}))
    }

    const genderElements = grant.profileReqs.gender.map(gender => {
        return (
            <div tabIndex='0' aria-label={`${gender} press enter to remove`} className="flex w-fit p-2 my-0 lg:my-4 border border-black dark:border-white rounded dark:d-custom-navy-background" key={uuidv4()} onKeyUp={(e)=> e.key === 'Enter' ? removeGender(gender) : null}>
                {gender}
                <Image 
                    src={xMark}
                    alt='delete'
                    className='ms-2 w-6 h-6 dark:d-white-filter cursor-pointer hover:scale-110'
                    onClick={() => removeGender(gender)}
                />
            </div>
        )
    })

    function addNationality(e){
        // If the user presses enter
        if(e.key === 'Enter' && nationality){
            const nationalityArr = grant.profileReqs.nationality
            nationalityArr.push(nationality)
            setGrant(prevGrant => ({...prevGrant, profileReqs:{...prevGrant.profileReqs, nationality: nationalityArr}}))
            setNationality('')
        }
    }

    function removeNationality(nationality){
        const nationalityArr = grant.profileReqs.nationality
        const idx = nationalityArr.indexOf(nationality)
        if(idx > -1){
            nationalityArr.splice(idx, 1)
        }
        setGrant(prevGrant => ({...prevGrant, profileReqs:{...prevGrant.profileReqs, nationality:nationalityArr}}))
    }

    const nationalityElements = grant.profileReqs.nationality.map(nationality => {
        return (
            <div tabIndex='0' aria-label={`${nationality} press enter to remove`} className="flex w-fit p-2 my-0 lg:my-4 border border-black dark:border-white rounded dark:d-custom-navy-background" key={uuidv4()} onKeyUp={(e)=> e.key === 'Enter' ? removeNationality(nationality) : null}>
                {nationality}
                <Image 
                    src={xMark}
                    alt='delete'
                    className='ms-2 w-6 h-6 dark:d-white-filter cursor-pointer hover:scale-110'
                    onClick={() => removeNationality(nationality)}
                />
            </div>
        )
    })

    function setVeteran(e){
        setGrant(prevGrant => ({...prevGrant, profileReqs:{...prevGrant.profileReqs, veteran:parseInt(e.target.value)}}))
    }


    // --------------- Button functions ---------------
    function clearForm(){
        localStorage.setItem('clearedGrant', JSON.stringify(grant))
        setGrant(defaultGrant)
    }

    function handleSubmit(e){
        e.preventDefault()
        setViewGrant(true)
    }

    function handleUndo(){
        const oldGrant = JSON.parse(localStorage.getItem('clearedGrant', JSON.stringify(grant)))
        localStorage.removeItem('clearedGrant')
        setGrant(oldGrant)
    }

    // Set form to session storage for preservation on page refresh
    // Form is deleted after posting
    useEffect(() => {
        localStorage.setItem('grant', JSON.stringify(grant))
    }, [grant])

    return(
        <DashboardInnerContainer>
            { viewGrant ? 
                <ViewGrant grant={grant} setViewGrant={setViewGrant}/>
            :
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
                        <form onSubmit={handleSubmit} onKeyDown={(e) => {if(e.key === 'Enter') e.preventDefault()}}>
                            <label id="grant-title" aria-label="Your grant title">
                                <input 
                                    className="w-full mb-10 text-3xl dark:d-text bg-transparent focus:outline-none dark:placeholder:text-neutral-300"
                                    type="text" 
                                    value={grant.Title}
                                    onChange={setTitle}
                                    placeholder="My Grant Title*"
                                    required
                                    aria-labelledby="grant-title"
                                />
                            </label>

                            <label id="grant-desc" aria-label="grant-description" className="flex md:flex-row flex-col items-top ms-4 mb-10">
                                <p className="pt-2 dark:d-text">Desctipion*&nbsp;:</p>
                                <textarea 
                                    className="md:mx-4 mx-0 p-2 rounded-md w-full custom-dark-grey-background border-2 border-neutral-300 focus:border-neutral-600 dark:d-text dark:d-custom-dark-grey-background dark:border-neutral-700 dark:focus:border-white" 
                                    value={grant.Description} 
                                    onChange={setDescription}
                                    placeholder="The description of my grant..."
                                    required
                                    aria-labelledby="grant-desc"
                                >
                                </textarea>
                            </label>

                            <label id="grant-nw" className="flex md:flex-row flex-col items-top ms-4 mb-10" aria-label="number of winners">
                                <p className="pt-2 dark:d-text">Number of Grant Winners*&nbsp;:</p>
                                <input 
                                    type="number"
                                    className="mx-4 p-2 custom-dark-grey-background rounded-md border-2 border-neutral-300 focus:border-neutral-600 dark:d-text dark:d-custom-dark-grey-background dark:border-neutral-700 dark:focus:border-white" 
                                    value={grant.MaxWinners} 
                                    onChange={setMaxWinners}
                                    onBlur={checkMaxWinners}
                                    required
                                    aria-labelledby="grant-nw"
                                />
                            </label>

                            <label id="grant-aw" className="flex md:flex-row flex-col items-top ms-4 mb-10" aria-label="amount per winner (CAD)">
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
                                    aria-labelledby="grant-aw"
                                />
                            </label>

                            <div className="w-full flex md:flex-row flex-col items-center ms-4 mb-10">
                                <p className="self-start md:self-auto dark:d-text">Application Form*&nbsp;:</p>
                                <div className="md:max-w-xl sm:min-w-60 sm:max-w-60 min-w-40 ms-4 me-8 flex flex-col sm:flex-row items-center rounded-md custom-dark-grey-background border-2 border-neutral-300 dark:d-text dark:d-custom-dark-grey-background dark:border-neutral-700">
                                    <p 
                                        className="mx-auto max-w-full text-center truncate dark:d-text bg-transparent focus:outline-none dark:placeholder:text-neutral-300"
                                    >
                                        {grant.Title ? grant.Title : 'Default'} Form
                                    </p>
                                    <Link aria-label="edit grant application form" href={`/edit/${grant.Title ? grant.Title : 'Default Form'}`} className="px-8 my-2 md:my-0 text-center py-4 rounded-md custom-green-background text-white border-2 border-neutral-300 hover:scale-105 dark:d-text dark:border-neutral-700">
                                        Edit
                                    </Link>
                                </div> 
                            </div>

                            <label id="grant-deadline" className="flex md:flex-row flex-col items-top ms-4 mb-10" aria-label="grant deadline">
                                <p className="pt-2 dark:d-text">Application Deadline*&nbsp;:</p>
                                <input 
                                    type="date"
                                    className="mx-4 p-2 custom-dark-grey-background rounded-md border-2 border-neutral-300 focus:border-neutral-600 dark:d-text dark:d-custom-dark-grey-background dark:border-neutral-700 dark:focus:border-white" 
                                    value={grant.Deadline} 
                                    onChange={setDeadline}
                                    onBlur={checkDeadlineValidity}
                                    required
                                    aria-labelledby="grant-deadline"
                                />
                            </label>

                            <div className="flex flex-col items-top ms-4 mb-20">
                                <p className="w-full pt-2 dark:d-text" tabIndex='0'>Grantee Profile - Tell us about your ideal applicant: </p>
                                <div 
                                    className="self-center flex flex-col md:mx-4 mx-0 p-2 my-4 rounded-md w-full custom-dark-grey-background border-2 border-neutral-300 focus:border-neutral-600 dark:d-text dark:d-custom-dark-grey-background dark:border-neutral-700 dark:focus:border-white" 
                                >
                                    <p className="mb-8" tabIndex='0'>Blank sections indicate no specification</p>
                                    <label className="flex flex-col my-2">
                                        Age range:
                                        <div className="my-4">
                                            <input 
                                                type="number"
                                                className="w-1/12 min-w-16 mx-4 p-2 bg-white rounded-md border-2 border-neutral-300 focus:border-neutral-600 dark:d-text dark:d-custom-dark-grey-background dark:border-neutral-700 dark:focus:border-white" 
                                                value={grant.profileReqs.minAge} 
                                                onChange={setMinAge}
                                                step='1'
                                                onBlur={verifyMinAge}
                                                placeholder="0"
                                                aria-label="minimum age"
                                            />
                                            -
                                            <input 
                                                type="number"
                                                className="w-1/12 min-w-16 mx-4 p-2 bg-white rounded-md border-2 border-neutral-300 focus:border-neutral-600 dark:d-text dark:d-custom-dark-grey-background dark:border-neutral-700 dark:focus:border-white" 
                                                value={grant.profileReqs.maxAge} 
                                                onChange={setMaxAge}
                                                onBlur={verifyMaxAge}
                                                placeholder="0"
                                                aria-label="maximum age"
                                            />
                                        </div>
                                        
                                    </label>

                                    <label className="flex flex-col my-2">
                                        Race (press enter to add):
                                        <div className="flex flex-col lg:flex-row">
                                            <input 
                                                type="text"
                                                className="w-3/5 min-w-40 mx-4 p-2 my-4 bg-white rounded-md border-2 border-neutral-300 focus:border-neutral-600 dark:d-text dark:d-custom-dark-grey-background dark:border-neutral-700 dark:focus:border-white" 
                                                value={race} 
                                                onChange={(e) => setRace(e.target.value)}
                                                onKeyUp={addRace}
                                                aria-label="desired races"
                                            />

                                            <div className="flex flex-wrap gap-3 lg:ms-6 ms-4 md:mt-0">
                                                {raceElements}
                                            </div>
                                        </div>
                                    </label>

                                    <label className="flex flex-col my-2">
                                        Gender (press enter to add):
                                        <div className="flex flex-col lg:flex-row">
                                            <input 
                                                type="text"
                                                className="w-3/5 min-w-40 mx-4 p-2 my-4 bg-white rounded-md border-2 border-neutral-300 focus:border-neutral-600 dark:d-text dark:d-custom-dark-grey-background dark:border-neutral-700 dark:focus:border-white" 
                                                value={gender} 
                                                onChange={(e) => setGender(e.target.value)}
                                                onKeyUp={addGender}
                                                aria-label="desired genders"
                                            />

                                            <div className="flex flex-wrap gap-3 lg:ms-6 ms-4 md:mt-0">
                                                {genderElements}
                                            </div>
                                        </div>
                                    </label>

                                    <label className="flex flex-col my-2">
                                        Nationality (press enter to add):
                                        <div className="flex flex-col lg:flex-row">
                                            <input 
                                                type="text"
                                                className="w-3/5 min-w-40 mx-4 p-2 my-4 bg-white rounded-md border-2 border-neutral-300 focus:border-neutral-600 dark:d-text dark:d-custom-dark-grey-background dark:border-neutral-700 dark:focus:border-white" 
                                                value={nationality} 
                                                onChange={(e) => setNationality(e.target.value)}
                                                onKeyUp={addNationality}
                                                aria-label="desired nationalities"
                                            />

                                            <div className="flex flex-wrap gap-3 lg:ms-6 ms-4 md:mt-0">
                                                {nationalityElements}
                                            </div>
                                        </div>
                                    </label>

                                    <label tabIndex="0" className="flex flex-col my-2">
                                        Are they a veteran:
                                        <div className="flex flex-col lg:flex-row gap-x-10">
                                            <label id="grant-nv" tabIndex="0" aria-label="not a veteran" onKeyUp={(e)=> e.key === 'Enter' ? e.target.click() : null}>
                                                <input 
                                                    type="radio"
                                                    name="veteran"
                                                    value={0}
                                                    className="mx-4 p-2 my-4 bg-white rounded-md border-2 border-neutral-300 focus:border-neutral-600 dark:d-text dark:d-custom-dark-grey-background dark:border-neutral-700 dark:focus:border-white"
                                                    onChange={setVeteran}
                                                    defaultChecked={grant.profileReqs.veteran === 0}
                                                    aria-labelledby="grant-nv"
                                                    tabIndex="-1"
                                                />
                                                No
                                            </label>
                                            <label id="grant-yv" tabIndex="0" aria-label="yes a veteran" onKeyUp={(e)=> e.key === 'Enter' ? e.target.click() : null}>
                                                <input 
                                                    type="radio"
                                                    name="veteran"
                                                    value={1}
                                                    className="mx-4 p-2 my-4 bg-white rounded-md border-2 border-neutral-300 focus:border-neutral-600 dark:d-text dark:d-custom-dark-grey-background dark:border-neutral-700 dark:focus:border-white"
                                                    onChange={setVeteran}
                                                    defaultChecked={grant.profileReqs.veteran === 1}
                                                    aria-labelledby="grant-yv"
                                                    tabIndex="-1"
                                                />
                                                Yes
                                            </label>
                                            <label id="grant-nav" tabIndex="0" aria-label="not applicable" onKeyUp={(e)=> e.key === 'Enter' ? e.target.click() : null}>
                                                <input 
                                                    type="radio"
                                                    name="veteran"
                                                    value={2}
                                                    className="mx-4 p-2 my-4 bg-white rounded-md border-2 border-neutral-300 focus:border-neutral-600 dark:d-text dark:d-custom-dark-grey-background dark:border-neutral-700 dark:focus:border-white"
                                                    onChange={setVeteran}
                                                    defaultChecked={grant.profileReqs.veteran === 2}
                                                    aria-labelledby="grant-nav"
                                                    tabIndex="-1"
                                                />
                                                N/A
                                            </label>
                                        </div>
                                    </label>

                                </div>
                            </div>

                            <div className="w-full flex sm:flex-row flex-col items-center justify-end sm:gap-6">
                                <button 
                                    type="button"
                                    id='undo-btn'
                                    className={`${undoShow ? '' : 'hidden'} hover:underline dark:d-text`} 
                                    onClick={handleUndo}
                                    aria-label="restore cleared form"
                                    onKeyUp={(e)=> e.key === 'Enter' ? e.target.click() : null}
                                >
                                    Restore
                                </button>
                                <button
                                    type="button"
                                    className="px-6 my-2 md:my-0 text-center py-4 sm:me-2 rounded-md hover:scale-105 bg-white hover:bg-red-600 border-2 border-neutral-300 disabled:text-neutral-400 disabled:bg-transparent dark:d-text dark:disabled:bg-transparent dark:disabled:text-neutral-400 dark:d-custom-dark-grey-background dark:hover:bg-red-600 dark:border-neutral-700"
                                    onClick={clearForm}
                                    disabled={(!grant.Title && !grant.Description && grant.MaxWinners === 0 && !grant.AmountPerApp && !grant.QuestionData && grant.Deadline === '0000-00-00')}
                                    aria-label="clear form"
                                    onKeyUp={(e)=> e.key === 'Enter' ? e.target.click() : null}
                                >
                                    Clear
                                </button>
                                <button
                                    type="submit"
                                    className="px-6 my-2 md:my-0 text-white text-center py-4 rounded-md hover:scale-105 disabled:hover:scale-100 custom-green-background disabled:text-neutral-400 dark:disabled:bg-transparent dark:disabled:text-neutral-400 disabled:bg-transparent dark:d-text border-2 border-neutral-300 dark:border-neutral-700"
                                    disabled={!(grant.Title && grant.Description && grant.MaxWinners > 0 && grant.AmountPerApp > 0 && grant.QuestionData && grant.Deadline !== '0000-00-00')}
                                    aria-label="continue to review grant"
                                    onKeyUp={(e)=> e.key === 'Enter' ? e.target.click() : null}
                                >
                                    Review
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            }
            
        </DashboardInnerContainer>
    )
}

export default CreateNewGrant