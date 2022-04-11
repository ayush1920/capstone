import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom'
import { useIsMount } from '../js/utils'
import store from '../redux/store'
import { logOut } from '../redux/actions/actions';


const Navbar = (props) => {
    const [name, setName] = useState('    ');
    const [pageLinks, updatePageLinks] = useState([]);
    const [loggedIn, setLoggedIn] = useState(false);
    const navigate = useNavigate();
    const dispath = useDispatch();

    useEffect(() => {
        let { username, loggedIn, isInterviewer } = store.getState().mainReducer
        const accessLevel = (isInterviewer) ? 'INTERVIEWER' : 'CANDIDATE';
        setName(username);
        setLoggedIn(loggedIn);
        highlightSelectedPage(props.selectedPage, accessLevel, loggedIn)
    }, [])

    const highlightSelectedPage = (selectedPage, accessLevel, loggedIn) => {
        const pageLinkList = Object.values(linkList)
        // Fileter links with adming access if user doesn't have it.

        const finalLinkList = []

        for (let index = 0; index < pageLinkList.length; index++) {
            const pageDetails = pageLinkList[index];
            if ((pageDetails.access === 'ALL' || pageDetails.access == accessLevel) &&
                ((!pageDetails.loginRequired) || loggedIn)) {
                finalLinkList.push(
                    <Link className={`navbar-link${(index === selectedPage.index) ? ' selected' : ''}`} to={pageDetails.path} key={index}>{pageDetails.text}</Link>
                )
            }
        }

        updatePageLinks(finalLinkList);
    }

    const signOutUser = () => {
        // https://stackoverflow.com/a/27374365
        document.cookie.split(";").forEach(function (c) { document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); });
        dispath(logOut());
        navigate('/');
    }

    return (
        <>
            <div className='navbar-custom'>
                <div className='navbar-logo' onClick={() => { navigate('/', { replace: true }) }}>
                    <span style={{ fontSize: '1.6rem', color: '#411D7A', fontWeight: "bold" }}>INTERVIEW.<span style={{ fontSize: '1rem', fontWeight: 'normal' }}> AI</span></span>
                </div>

                <div className='navbar-links-container' style={{ marginLeft: '50px' }}>
                    {pageLinks}
                </div>

                {loggedIn && <div className="dropdown">
                    <button className='navbar-user-button'>{name}&nbsp;&nbsp;&#x2BC6;</button>
                    <div className="dropdown-content">
                        <button className='custom-purple-reverse' style={{ minWidth: '100%', borderColor: 'var(--background-light-color)' }} onClick={signOutUser}>Sign Out</button>
                    </div>
                </div>}

            </div>
            <Notifier />
        </>

    )
}

export const linkList = {
    'HOME': { index: 0, text: 'Home', path: '/', access: 'ALL', loginRequired: false },
    'CANDIDATE_JOBS': { index: 1, text: 'Jobs', path: '/jobs', access: 'CANDIDATE', loginRequired: true },
    'CANDIDATE_PROFILE': { index: 2, text: 'Profile', path: '/profile', access: 'CANDIDATE', loginRequired: true },
    'INTERVIEWER_POSTS': { index: 3, text: 'Posted Jobs', path: '/postedJobs', access: 'INTERVIEWER', loginRequired: true }
}

Object.freeze(linkList)

const Notifier = () => {
    const message = useSelector(state => state.mainReducer.message);
    const firstMount = useIsMount();
    const [className, setClassName] = useState('notifier');

    useEffect(() => {
        if (!firstMount)
            showMessage(message);
    }, [message]);

    const showMessage = () => {
        setClassName('notifier show')
        setTimeout(() => {
            setClassName('notifier')
        }, 5000);
    }

    return (
        <div className={className}>
            <span>{message}</span>
        </div>
    )
};


export default Navbar