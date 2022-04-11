export const notify = (msg) =>{
    return {
        type: 'SET_MESSAGE',
        payload: msg,
    }
}

export const updateLogin = (data) =>{
    const payload = {username: data.username, isInterviewer: data.interviewer, loggedIn:true}
    return {
        type: 'UPDATE_USER_DETAILS',
        payload: payload,
    }
}

export const logOut = () =>{
    const payload = {username:'', isInterviewer:false, loggedIn: false}
    return {
        type: 'UPDATE_USER_DETAILS',
        payload: payload,
    }  
}
