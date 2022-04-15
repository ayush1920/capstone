import React from 'react'
import { useSelector } from 'react-redux'
import LoginPage from '../pages/LoginPage'
import InterviewerDashBoard from '../pages/InterviewerDashBoard'
import CandiateDashBoard from '../pages/CandiateDashBoard'


const PageManager = (props) => {
    const { loggedIn, isInterviewer } = useSelector(state => state.mainReducer);

    switch (props.pageName) {
        case 'HOME': {
            if (loggedIn) {
                if (isInterviewer)
                    return <InterviewerDashBoard /> 
                return <CandiateDashBoard />
            }
            return <LoginPage />
        }
        default: {
            return (
                <div>
                    No page name found in Page Manager.
                </div>)
        }
    }
}

PageManager.defaultProps = {
    pageName: ''
}

export default PageManager