import React from 'react'
import Navbar, { linkList } from '../Components/Navbar'
import Footer from '../Components/Footer'
import { useLocation } from 'react-router-dom'

const InterviewerCandProfile = (props) => {

    const { state } = useLocation();
    const username = (state && state.username) ? state.username : '';
    return (
        <div className='page-wrapper'>
            <Navbar selectedPage={linkList.INTERVIEWER_POSTS} />
            <div className='page-container'>
                <span style={{ color: 'var(--ui-color)', fontSize: '1.4rem', fontWeight: 'bold', padding: '10px' }}>
                    {username} Profile</span>

            </div>
            <Footer />
        </div>
    )
}


export default InterviewerCandProfile