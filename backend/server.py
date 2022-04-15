import os
from flask import Flask, request, session, make_response, render_template, send_from_directory
from flask_cors import CORS, cross_origin

from utils import cprint, unique_filename
import db_actions
from job_manager import job_manager
from resume_similarity import start_similary

app = Flask(__name__)
app.secret_key = 'dkald@2390'
app.config['SESSION_COOKIE_HTTPONLY'] = False
cors = CORS(app)

UPLOAD_FOLDER = 'uploads'


@app.route('/', methods=['GET'])
def home_page():
    return 'home page'


@app.route('/login_user', methods=['POST'])
@cross_origin(supports_credentials=True)
def login_user():
    try:
        payload = request.json
        username = payload['username']
        password = payload['password']
    except:
        return {'msg': 'wrong parameters'}, 400
    response = db_actions.authenticate_user(username, password)
    if response[0]['isValid']:
        for key in response[0]['userData']:
            session[key] = response[0]['userData'][key]

    return response


@app.route('/interview_list', methods=['GET'])
@cross_origin(supports_credentials=True)
def get_interview_list():
    username = session.get('username', None)
    if not username:
        return {'msg': 'Authentication error'}, 401
    return db_actions.get_interview_list(username)


@app.route('/interview_company_list', methods=['GET'])
@cross_origin(supports_credentials=True)
def get_company_interview_list():
    username = session.get('username', None)
    if not username:
        return {'msg': 'Authentication error'}, 401
    return db_actions.get_company_interview_list(username)


@app.route('/set_interview_status', methods=['GET'])
@cross_origin(supports_credentials=True)
def set_interview_status():
    _id = request.args.get('_id', None)
    value = request.args.get('value', None)
    username = session.get('username', None)
    if not username:
        return {'msg': 'Authentication error'}, 401

    if not(_id and value):
        return {'msg': 'Invalid parameters'}, 400

    return db_actions.set_interview_status(_id, value)


@app.route('/job_list', methods=['GET'])
@cross_origin(supports_credentials=True)
def get_job_list():
    username = session.get('username', None)
    if not username:
        return {'msg': 'Authentication error'}, 401
    return db_actions.get_job_list(username)


@app.route('/apply_job', methods=['GET'])
@cross_origin(supports_credentials=True)
def apply_job():
    username = session.get('username', None)
    job_id = request.args.get('job_id', None)
    if not username:
        return {'msg': 'Authentication error'}, 401

    if not job_id:
        return {'msg': 'Invalid Job ID'}, 400

    return db_actions.apply_job(username, job_id)


@app.route('/withdrawApplication', methods=['GET'])
@cross_origin(supports_credentials=True)
def withdraw_application():
    username = session.get('username', None)
    job_id = request.args.get('job_id', None)
    if not username:
        return {'msg': 'Authentication error'}, 401

    if not job_id:
        return {'msg': 'Invalid Job ID'}, 400

    return db_actions.withdraw_application(username, job_id)


@app.route('/openingsPosted', methods=['GET'])
@cross_origin(supports_credentials=True)
def openings():
    username = session.get('username', None)
    if not username:
        return {'msg': 'Authentication error'}, 401

    return db_actions.get_openings(username)


@app.route('/candidateProfile', methods=['GET'])
@cross_origin(supports_credentials=True)
def get_profile():
    username = session.get('username', None)
    if not username:
        return {'msg': 'Authentication error'}, 401

    candidate_username = request.args.get('candidate_username', None)
    target_username = candidate_username or username

    return db_actions.get_profile(target_username)


@app.route('/uploadResume', methods=['POST'])
@cross_origin(supports_credentials=True)
def upload_resume():
    username = session.get('username', None)

    if not username:
        return {'msg': 'Authentication error'}, 401

    if 'resume' not in request.files:
        return {'msg': 'Resume file not found'}, 400

    file = request.files['resume']
    dir_path = os.path.join(os.getcwd(), UPLOAD_FOLDER)
    file_name = unique_filename('pdf', dir_path)
    file_path = os.path.join(os.path.join(dir_path, file_name))
    file.save(file_path)
    return db_actions.update_resume_location(username, file_path)


@app.route('/getCandidateResume', methods=['GET'])
@cross_origin(supports_credentials=True)
def show_candidate_resume():

    username = session.get('username', None)
    if not username:
        return {'msg': 'Authentication error'}, 401

    candidate_username = request.args.get('candidate_username', None)
    target_username = candidate_username or username

    file_location = db_actions.get_candidate_resume(target_username)
    if not file_location:
        return {'msg': 'No resume found'}, 400
    directory, file_name = os.path.split(file_location)
    cprint(directory, file_name)
    return send_from_directory(directory, file_name, as_attachment=False)


@app.route('/modifyJob', methods=['POST'])
@cross_origin(supports_credentials=True)
def modify_job():
    username = session.get('username', None)

    if not username:
        return {'msg': 'Authentication error'}, 401

    payload = request.json
    if not payload:
        return {'msg': 'No payload for adding or editing job'}, 400

    return db_actions.modify_job(username, payload)


@app.route('/deleteJob', methods=['GET'])
@cross_origin(supports_credentials=True)
def delete_job():
    username = session.get('username', None)

    if not username:
        return {'msg': 'Authentication error'}, 401

    job_id = request.args.get('job_id', None)
    if not job_id:
        return {'msg': 'Job Id not present in parameter'}, 400

    return db_actions.delete_job(username, job_id)


@app.route('/getJobData', methods=['GET'])
@cross_origin(supports_credentials=True)
def get_job_data():
    username = session.get('username', None)

    if not username:
        return {'msg': 'Authentication error'}, 401

    job_id = request.args.get('job_id', None)
    if not job_id:
        return {'msg': 'Job Id not present in parameter'}, 400

    return db_actions.get_job_data(job_id)


@app.route('/processResumeJob', methods=['POST'])
@cross_origin(supports_credentials=True)
def process_resume_job():
    username = session.get('username', None)

    if not username:
        return {'msg': 'Authentication error'}, 401
    payload = request.json
    candidate_username = payload.get('candidate_usernmae', None)
    if not candidate_username:
        return {'msg': 'Candidate profile name not present'}, 400

    job_id = payload.get('job_id', None)
    if not job_id:
        return {'msg': 'Job ID must be mentioned'}, 400

    resume_path, job_description = db_actions.process_resume(
        candidate_username, job_id)
    task_id = job_manager.add_job(start_similary, resume_path, job_description)
    return task_id


@app.route('/getTaskStatus', methods=['GET'])
@cross_origin(supports_credentials=True)
def get_task_status():
    task_id = request.args.get('task_id', None)
    if not task_id:
        return {'msg': 'Task Id not provided'}, 400
    return job_manager.get_status(task_id)

if __name__ == '__main__':
    app.run(debug=True)
