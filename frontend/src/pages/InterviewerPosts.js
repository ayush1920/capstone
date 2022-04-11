import React, { useState, useEffect } from 'react'
import Footer from '../Components/Footer';
import Navbar, { linkList } from '../Components/Navbar';
import { useNavigate, Navigate } from 'react-router-dom';
import { getInterviewerOpenings } from '../js/httpHandler';

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
                <OpeningItem key={index} role={item.role} salary={item.salary} applied={item.applied} />
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
  const { role, salary, applied } = props
  const [showCandidates, setShowCandidates] = useState(false);
  const navigate = useNavigate();

  return (
    <div className='interview-item'>
      <div className='interview-details'>
        <div>Role:</div> <b>{role}</b>
        <div>Salary:</div> <b>{salary}</b>
        {
          showCandidates && applied.map((candidateName, index2) => {
            return (
              <React.Fragment key={index2}>
                <div>UserID:</div>
                <div>
                  {candidateName}
                  <button className='custom-purple-reverse' style={{ height: '30px', marginLeft: '10px' }} onClick={() => {
                    return navigate('/cand_profile', { state: { username: candidateName } });
                  }}> Show Candidate Profile</button></div>

              </React.Fragment>
            )
          })
        }
      </div>

      {<button className='custom-purple' style={{ float: 'right', marginRight: '20px' }} onClick={() => { setShowCandidates(!showCandidates) }}>
        {(showCandidates) ? 'Hide Applied Candidates' : 'Show Applied Candidates'}({applied.length})</button>}

    </div>)
}


export default InterviewerPosts