import React from 'react'
import Footer from '../Components/Footer'
import Navbar, {linkList} from '../Components/Navbar'

const CandidateProfile = () => {
    return (
        <div className='page-wrapper'>
            <Navbar selectedPage={linkList.CANDIDATE_PROFILE} />
            <div className='page-container'>
                <span style={{ color: 'var(--ui-color)', fontSize: '1.4rem', fontWeight: 'bold', padding: '10px' }}>
                    Manage Your Profile
                </span>
            </div>
            <Footer />
        </div>

    )
}

export default CandidateProfile