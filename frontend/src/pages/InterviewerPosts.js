import React, { useState, useEffect } from 'react'
import Footer from '../Components/Footer';
import Navbar, { linkList } from '../Components/Navbar';
import { useNavigate } from 'react-router-dom';
import { getInterviewerOpenings } from '../js/httpHandler';
import { formatRupee } from '../js/utils';

const InterviewerPosts = () => {
  const [openingList, updateOpeningList] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInterviewerJobList = async () => {
      const data = await getInterviewerOpenings();
      updateOpeningList(data);

    };
    fetchInterviewerJobList();
  }, []);

  // const toggleInterview = async (_id, isEnabled) => {
  //   let setValue = !(isEnabled);
  //   setValue = setValue.toString();
  //   const response = await setInterviewStatus(_id, setValue);
  //   console.log(response);
  //   if (response.status) {
  //     // Reload page
  //     return navigate(0);
  //   }
  // }


  return (
    <div className='page-wrapper'>
      <Navbar selectedPage={linkList.INTERVIEWER_POSTS} />
      <div className='page-container'>
        <span style={{ color: 'var(--ui-color)', fontSize: '1.4rem', fontWeight: 'bold', padding: '10px' }}>
          Posted Openings</span>
        <div className='interview-list-container'>
          {
            openingList.map((item, index) => {

              return (
                <OpeningItem key={index} role={item.designation} salary={item.salary} 
                location = {item.location} applied={item.applied} job_id = {item._id} />
              )
            })
          }
        </div>
      </div>
      <Footer />
    </div>
  )
}


const OpeningItem = (props) => {
  const { role, salary, location, applied, job_id } = props
  const [showCandidates, setShowCandidates] = useState(false);
  const navigate = useNavigate();

  const showMoreDetails = () => {
    navigate('/postOpening', {state: {'_id': job_id}})
  }

  return (
    <div className='interview-item'>
      <div className='interview-details'>
        <div>Designation:</div> <b>{role}</b>
        <div>Location:</div> <b>{location}</b>
        <div>Salary:</div> <b>{formatRupee(salary)}</b>
        {
          showCandidates && applied.map((candidateName, index2) => {
            return (
              <React.Fragment key={index2}>
                <div>UserID:</div>
                <div>
                  {candidateName}
                  <button className='custom-purple-reverse' style={{ height: '30px', marginLeft: '10px' }} onClick={() => {
                    return navigate('/cand_profile', { state: { username: candidateName, job_id: job_id, role:role } });
                  }}> Show Candidate Profile</button></div>

              </React.Fragment>
            )
          })
        }
      </div>

      <button className='custom-blue-reverse' style={{ float: 'right', marginRight: '20px' }} onClick={showMoreDetails}> Show More Details</button>
      {<button className='custom-purple' style={{ float: 'right', marginRight: '20px' }} onClick={() => { setShowCandidates(!showCandidates) }}>
        {(showCandidates) ? 'Hide Applied Candidates' : 'Show Applied Candidates'}({applied.length})</button>}


    </div>)
}


export default InterviewerPosts