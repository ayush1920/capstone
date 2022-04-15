import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar, { linkList } from '../Components/Navbar'
import Footer from '../Components/Footer'
import { getCompanyInterview, setInterviewStatus } from '../js/httpHandler'


const InterviewerDashBoard = () => {
    const [interviewList, updateInterviewList] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        // Use effect renders twice
        // https://stackoverflow.com/a/60619061
        const fetchInterviewDetails = async () => {
            const interviewData = await getCompanyInterview();
            updateInterviewList(interviewData);
        };
        fetchInterviewDetails();
    }, []);

    const toggleInterview = async(_id, isEnabled) =>{
        let setValue = !(isEnabled);
        setValue = setValue.toString();
        const response  = await setInterviewStatus(_id, setValue);

        if (response.status){
            // Reload page
            return navigate(0);
        }
    }

    return (
        <div className='page-wrapper'>
            <Navbar selectedPage={linkList.HOME} />
            <div className='page-container'>
                <span style={{ color: 'var(--ui-color)', fontSize: '1.4rem', fontWeight: 'bold', padding: '10px' }}>
                    Interviews</span>
                <div className='interview-list-container'>
                    {
                        interviewList.map((item, index) => {
                            const interview_timestamp = new Date(item.time);
                            const interview_time = `${interview_timestamp.toLocaleTimeString()} ${interview_timestamp.toLocaleDateString()}`
                            return (
                                <div className='interview-item' key={index}>
                                    <div className='interview-details'>
                                        <div>Interviewee Id:</div><b>{item.interviewee}</b>
                                        <div>Role:</div> <b>{item.role}</b>
                                        <div>Salary:</div> <b>{item.salary}</b>
                                        <div>Time: </div><b>{interview_time}</b>
                                        <div>Status: </div><b>{(item.enabled) ? 'Interview started' : 'Interview not yet started'}</b>
                                    </div>
                                    {<button className='custom-purple' style={{ float: 'right', marginRight: '20px' }} onClick={()=>{toggleInterview(item._id, item.enabled)}}>
                                        {(item.enabled) ? 'Disable Interview' : 'Enable Interview'} </button>}
                                </div>)
                        })
                    }
                </div>
            </div>
            <Footer />
        </div>
    )
}

export default InterviewerDashBoard;