import React from 'react';
import { createRoot } from 'react-dom/client'
import './index.css';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { Provider } from 'react-redux';

import store from './redux/store';
import PageManager from './Components/PageManager';
import ProtectedRoutes from './Components/ProtectedRoutes';
import CandidateJobs from './pages/CandidateJobs';
import CandidateProfile from './pages/CandidateProfile';
import InterviewerPosts from './pages/InterviewerPosts';
import InterviewerCandProfile from './pages/InterviewerCandProfile';

const root = createRoot(
  document.getElementById('root')
);

root.render(
  <React.StrictMode>
    <Provider store={store} >
      <Router>
        <Routes>
          
          <Route exact path='/' element={
            <ProtectedRoutes>
              <PageManager pageName='HOME' />
            </ProtectedRoutes>} />

          <Route exact path='/jobs' element={
            <ProtectedRoutes>
              <CandidateJobs />
            </ProtectedRoutes>} />

            <Route exact path='/profile' element={
            <ProtectedRoutes>
              <CandidateProfile />
            </ProtectedRoutes>} />

            <Route exact path='/postedJobs' element={
            <ProtectedRoutes>
              <InterviewerPosts />
            </ProtectedRoutes>} />

            <Route exact path='/cand_profile' element={
            <ProtectedRoutes>
              <InterviewerCandProfile />
            </ProtectedRoutes>} />

        </Routes>
      </Router>
    </Provider>
  </React.StrictMode>,
);

reportWebVitals();
