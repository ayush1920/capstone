import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Navigate, useLocation} from 'react-router-dom';

import { updateLogin } from '../redux/actions/actions';

const ProtectedRoutes = ({children}) =>{
    const {state} = useLocation();
    const dispatch = useDispatch();
    const {loggedIn} = useSelector(state => state.mainReducer);
    if (loggedIn)
        return children;
    // If user is logged in redirect to page


    // If disable redirect show childrent.
    // Mostly used in case to show login pasge without verifying whether user has logged in or not.

    if (state && state.disableRedirect){
        return children;
    }  

    const value = ('; '+document.cookie).split(`; session=`).pop().split(';')[0];
    
    // Cookie not available, redirect to login page and disable further redirect.
    if (!value){
        return <Navigate to='/' state={{disableRedirect: true}}/>
    }

    // Cookie available use cookie to update redux.
    var usercred = JSON.parse(atob(value.split('.')[0]));
    dispatch(updateLogin(usercred));
    return children;
}
export default ProtectedRoutes