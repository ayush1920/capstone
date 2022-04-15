import axios from 'axios'
import { updateLogin } from '../redux/actions/actions'

const BASE_URL = 'http://localhost:5000';

const postRequest = async (_url, payload, isJson = true) => {
    const url = BASE_URL + _url
    const headers = {
        'Access-Control-Allow-Origin': '*',
    }

    if (isJson)
        headers['Content-Type'] = 'application/json';

    return await axios.post(url, payload,
        {
            withCredentials: true,
            headers: headers,
        })
        .then((res) => {
            return { status: true, response: res.data }
        })
        .catch(err => {
            if (err.response && err.response.status)
                return { status: false, msg: 'Incorrent username or password' }
            return { status: false, msg: 'Network or server error' }
        })
}


const getRequest = async (_url, params = null) => {
    const url = BASE_URL + _url;
    const options = {
        withCredentials: true,
        headers: {
            'Access-Control-Allow-Origin': '*'
        }
    }

    if (params && (params.constructor === Object && (Object.keys(params).length > 0))) {
        options['params'] = params
    }

    return await axios.get(url, options)
        .then(res => { return { status: true, response: res.data } })
        .catch((err) => {
            return { status: false };;
        })

}

export const loginUser = async (userDetails, dispatch, notifier, navigate) => {
    const resp = await postRequest('/login_user', userDetails);
    // Wrong user credentials
    if (!resp.status)
        return notifier(resp.msg);

    if (resp.response.isValid) {
        dispatch(updateLogin(resp.response.userData));
        localStorage.setItem('session', JSON.stringify(resp.response.userData))
        return navigate('/');
    }

}

export const getCandidateInterview = async () => {
    const resp = await getRequest('/interview_list');
    if (!resp.status)
        return []
    return resp.response.interview_data
}


export const getCandidateJobs = async () => {
    const resp = await getRequest('/job_list');
    if (!resp.status)
        return []
    return resp.response.job_data
}


export const applyJob = async (job_id) => {
    return getRequest('/apply_job', { 'job_id': job_id });
}

export const withdrawApplication = async (job_id) => {
    return getRequest('/withdrawApplication', { 'job_id': job_id });
}

export const getCompanyInterview = async () => {
    const resp = await getRequest('/interview_company_list');
    if (!resp.status)
        return []
    return resp.response.interview_data
}

export const setInterviewStatus = async (_id, isEnabled) => {
    return getRequest('/set_interview_status', { '_id': _id, value: isEnabled });
}

export const getInterviewerOpenings = async () => {
    const resp = await getRequest('/openingsPosted');
    if (!resp.status)
        return []
    return resp.response.openings
}


export const getCandidateProfile = async (candidate_username) => {
    const params = {}
    if (candidate_username)
        params['candidate_username'] = candidate_username;

    const resp = await getRequest('/candidateProfile', params);
    if (!resp.status)
        return []
    return resp.response.profile
}

export const uploadCandidateResume = async (file) => {
    const formData = new FormData();
    formData.append(
        "resume",
        file,
        file.name
    );

    const resp = await postRequest('/uploadResume', formData);
    if (!resp.status) {
        return ''
    }
    console.log(resp.response)
    return resp.response.resume_location
}

export const modifyJob = async (job_data) => {
    const resp = await postRequest('/modifyJob', job_data)
    if (!resp.status) {
        return {}
    }
    return resp.response.jobRecord
}

export const deleteJob = async (job_id) => {
    const resp = await getRequest('/deleteJob', { 'job_id': job_id })
    if (!resp.status)
        return ''
    return resp.response
}

export const getJobData = async (job_id) => {
    const resp = await getRequest('/getJobData', { 'job_id': job_id })
    if (!resp.status)
        return {}
    return resp.response
}

export const analizeCanadidateResume = async (candidate_username, job_id) => {
    const resp = await postRequest('/processResumeJob', { 'candidate_usernmae': candidate_username, 'job_id': job_id })
    if (!resp.status)
        return ''
    return resp.response

}

export const getTaskStatus = async (task_id) => {
    const resp = await getRequest('/getTaskStatus', { 'task_id': task_id })
    if (!resp.status)
        return ''
    return resp.response
}
