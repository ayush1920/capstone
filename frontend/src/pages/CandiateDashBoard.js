import React, { useEffect, useState } from 'react'
import Navbar, { linkList } from '../Components/Navbar'
import Footer from '../Components/Footer'

import { useIsMount } from '../js/utils'
import { getCandidateInterview } from '../js/httpHandler'
import { useDispatch } from 'react-redux'


const CandiateDashBoard = () => {
    const [interviewList, updateInterviewList] = useState([]);

    useEffect(() => {
        // Use effect renders twice
        // https://stackoverflow.com/a/60619061
        const fetchInterviewDetails = async () => {
            const candidateData = await getCandidateInterview();
            updateInterviewList(candidateData);
        };
        fetchInterviewDetails();
    }, []);

    return (
        <div className='page-wrapper'>
            <Navbar selectedPage={linkList.HOME} />
            <div className='page-container'>
                <span style={{color:'var(--ui-color)', fontSize:'1.4rem', fontWeight:'bold', padding:'10px'}}>
                    Scheduled and Past Interviews</span>
                <div className='interview-list-container'>
                    {
                        interviewList.map((item, index) => {
                            const interview_timestamp = new Date(item.time);
                            const interview_time = `${interview_timestamp.toLocaleTimeString()} ${interview_timestamp.toLocaleDateString()}`

                            return (
                                <div className='interview-item' key={index}>
                                    <div className='interview-details'>
                                        <div>Role:</div> <b>{item.role}</b>
                                        <div>Company Name:</div><b>{item.lister}</b>
                                        <div>Salary:</div> <b>{item.salary}</b>
                                        <div>Time: </div><b>{interview_time}</b>
                                        <div>Status: </div><b>{(item.enabled) ? 'Interview started' : 'Interview not yet started'}</b>
                                    </div>
                                        {(item.enabled) && <button className='custom-purple' style={{ float: 'right', marginRight:'20px' }}> Join Interview</button>}
                                </div>)
                        })
                    }
                </div>
            </div>
            <Footer />
        </div>
    )
}

export default CandiateDashBoard;