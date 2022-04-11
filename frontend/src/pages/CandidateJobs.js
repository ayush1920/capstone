import React, { useState, useEffect } from 'react'
import Footer from '../Components/Footer'
import Navbar, { linkList } from '../Components/Navbar'
import { getCandidateJobs, applyJob } from '../js/httpHandler'
import { useNavigate } from 'react-router-dom'

const CandidateJobs = () => {

    const [jobsList, updateJobsList] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        // Use effect renders twice
        // https://stackoverflow.com/a/60619061
        const fetchJobDetails = async () => {
            const jobData = await getCandidateJobs();
            console.log(jobData)
            updateJobsList(jobData);
        };
        fetchJobDetails();
    }, []);


    const applyForJob = async(job_id) =>{
        const response  = await applyJob(job_id);
        
        console.log('response', response);
        if (response.status){
            // Reload page
            return navigate(0);
        }
    }

    return (
        <div className='page-wrapper'>
            <Navbar selectedPage={linkList.CANDIDATE_JOBS} />
            <div className='page-container'>
                <span style={{ color: 'var(--ui-color)', fontSize: '1.4rem', fontWeight: 'bold', padding: '10px' }}>
                    Available Jobs for you</span>
                <div className='interview-list-container'>
                    {
                        jobsList.map((item, index) => {
                            return (
                                <div className='interview-item' key={index}>
                                    <div className='interview-details'>
                                        <div>Role:</div> <b>{item.role}</b>
                                        <div>Company Name:</div><b>{item.lister}</b>
                                        <div>Salary:</div> <b>{item.salary}</b>
                                        <div>Status:</div> <b>{(item.applied) ? 'Applied' : 'Not Applied'}</b>
                                    </div>
                                {(!item.applied) && <button className='custom-purple' style={{ float: 'right', marginRight:'20px' }} onClick={()=>{applyForJob(item.job_id)}}> Apply for Position</button>}
                                </div>)
                        })
                    }
                </div>
            </div>
            <Footer />
        </div>

    )
}

export default CandidateJobs