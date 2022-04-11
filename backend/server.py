from flask import Flask, request, session, make_response, render_template
from flask_cors import CORS, cross_origin

from utils import cprint
import db_actions

app = Flask(__name__)
app.secret_key = 'dkald@2390'
app.config['SESSION_COOKIE_HTTPONLY'] = False
cors = CORS(app)

@app.route('/', methods = ['GET'])
def home_page():
    return 'home page'

@app.route('/login_user', methods = ['POST'])
@cross_origin(supports_credentials=True)
def login_user():
    try:
        payload = request.json
        username = payload['username']
        password = payload['password']
    except:
        return {'msg':'wrong parameters'}, 400
    response = db_actions.authenticate_user(username, password) 
    if response[0]['isValid']:
        for key in response[0]['userData']:
            session[key] = response[0]['userData'][key]
            
    return response
    
@app.route('/interview_list', methods = ['GET'])
@cross_origin(supports_credentials=True)
def get_interview_list():
    username = session.get('username', None)
    if not username:
        return {'msg': 'Authentication error'}, 401
    return db_actions.get_interview_list(username)

@app.route('/interview_company_list', methods = ['GET'])
@cross_origin(supports_credentials=True)
def get_company_interview_list():
    username = session.get('username', None)
    if not username:
        return {'msg': 'Authentication error'}, 401
    return db_actions.get_company_interview_list(username)

@app.route('/set_interview_status', methods = ['GET'])
@cross_origin(supports_credentials=True)
def set_interview_status():
    _id = request.args.get('_id',None)
    value = request.args.get('value',None)
    username = session.get('username', None)
    if not username:
        return {'msg': 'Authentication error'}, 401

    if not(_id and value):
        return {'msg': 'Invalid parameters'}, 400
    
    return db_actions.set_interview_status(_id, value)

        
@app.route('/job_list', methods = ['GET'])
@cross_origin(supports_credentials=True)
def get_job_list():
    username = session.get('username', None)
    if not username:
        return {'msg': 'Authentication error'}, 401
    return db_actions.get_job_list(username)

@app.route('/apply_job', methods = ['GET'])
@cross_origin(supports_credentials=True)
def apply_job():
    username = session.get('username', None);
    job_id = request.args.get('job_id', None)
    if not username:
        return {'msg': 'Authentication error'}, 401

    if not job_id:
        return {'msg': 'Invalid Job ID'}, 400 
    
    return db_actions.apply_job(username, job_id)


@app.route('/openingsPosted', methods = ['GET'])
@cross_origin(supports_credentials=True)
def openings():
    username = session.get('username', None);
    if not username:
        return {'msg': 'Authentication error'}, 401
    
    return db_actions.get_openings(username)

if __name__ == '__main__':
    app.run(debug = True)
