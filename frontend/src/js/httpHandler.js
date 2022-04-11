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

    if (params) {
        options['params'] = params
    }

    return await axios.get(url, options)
        .then(res => { return { status: true, data: res.data } })
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
        return navigate('/');
    }

}

export const getCandidateInterview = async () => {
    const resp = await getRequest('/interview_list');
    if (!resp.status)
        return []
    return resp.data.interview_data
}


export const getCandidateJobs = async () => {
    const resp = await getRequest('/job_list');
    if (!resp.status)
        return []
    return resp.data.job_data
}


export const applyJob = async (job_id) => {
    return getRequest('/apply_job', { 'job_id': job_id });
}


export const getCompanyInterview = async () => {
    const resp = await getRequest('/interview_company_list');
    if (!resp.status)
        return []
    return resp.data.interview_data
}

export const setInterviewStatus = async (_id, isEnabled) => {
    return getRequest('/set_interview_status', { '_id': _id, value: isEnabled });
}

export const getInterviewerOpenings = async () => {
    const resp = await getRequest('/openingsPosted');
    if (!resp.status)
        return []
    return resp.data.openings
}