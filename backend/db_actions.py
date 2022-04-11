import json
from bson.objectid import ObjectId
from datetime import timezone
from mongo import mongo
from utils import cprint
from pymongo.cursor  import Cursor
mongo = mongo.db

def convert_cursor(crx):
    def format_result(x):
        _id = x.get('_id', None)
        if _id:
            x['_id'] = str(_id)
        return x
            
    if isinstance(crx, dict):
        return format_result(crx)

    if isinstance(crx, Cursor):
        out = list(map(format_result, crx))
        if out:
            return out
    return []
        
def authenticate_user(username, password):
    result = mongo.usercred.find_one({'username': username, 'password': password}, {'password':0, '_id':0})
    if not result:
        return {'isValid': False}, 401
    
    return {'isValid': True, 'userData': convert_cursor(result)}, 200

def get_interview_list(username):
    cprint(username)
    result = mongo.interview_list.find({'interviewee': username}, {'_id':0}).sort('time', -1)
    result = convert_cursor(result)
    for res in result:
        res['time'] = int(res['time'].replace(tzinfo=timezone.utc).timestamp() * 1000)
    cprint(result)
    if not result:
        result = []
    return {'interview_data': result}


def get_company_interview_list(username):
    cprint(username)
    result = mongo.interview_list.find({'lister': username}).sort('time', -1)
    result = convert_cursor(result)
    for res in result:
        res['time'] = int(res['time'].replace(tzinfo=timezone.utc).timestamp() * 1000)
    cprint(result)
    if not result:
        result = []
    return {'interview_data': result}


def set_interview_status(_id, status):
    status = json.loads(status)
    mongo.interview_list.update_one({'_id': ObjectId(_id)}, {'$set':{'enabled' :status}})
    return {'status': True}
    
    
def get_job_list(username):
    applied = mongo.job_list.find({'applied':username}, {'applied':0})
    applied = convert_cursor(applied) or []
    for value in applied:
        value['applied'] = True
    
    not_applied = mongo.job_list.find({'applied':{'$ne': username}}, {'applied':0})
    not_applied = convert_cursor(not_applied) or []
    for value in not_applied:
        value['applied'] = False

    result = applied + not_applied
    return {'job_data': result}

def apply_job(username, job_id):
    mongo.job_list.update_one({'job_id': job_id}, {'$push' : {'applied': username}})
    return {'status': True}

def get_openings(username):
    result = mongo.job_list.find({'lister': username})
    return {'openings' : convert_cursor(result)}

def add_job_data(details):
    mongo.insert_one(details)
    
