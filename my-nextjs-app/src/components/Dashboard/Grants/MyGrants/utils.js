'use client'
import axios from "axios"

export function getGrantStatus(grant){
    if(grant.NumWinners === grant.MaxWinners) return 'Awarded'
    if(!grant.Active) return 'Closed'
    return 'Open'
}

export async function openGrant(grantID, userData){
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userData.token}`
    }
    
    const body= {
        grantID: grantID,
        active: true,
    }

    try{
        await axios.post('http://localhost:5000/updateGrantStatus', body, {headers: headers})
    }
    catch(err){
        console.error(err)
    }
}

export async function closeGrant(grantID, userData){
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userData.token}`
    }
    
    const body= {
        grantID: grantID,
        active: false,
    }

    try{
        await axios.post('http://localhost:5000/updateGrantStatus', body, {headers: headers})
    }
    catch(err){
        console.error(err)
    }
}

export function getApplciationStatus(application){
    let status
    switch(application.status){
        case 1:
            status = 'Pending'
            break
        case 2:
            status = 'Rejected'
            break
        case 3:
            status = 'Accepted'
            break
    }
    return status
}