import json
import os
from bson.objectid import ObjectId
from datetime import timezone
from mongo import mongo
from utils import cprint
from pymongo.cursor import Cursor
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
    result = mongo.usercred.find_one(
        {'username': username, 'password': password}, {'password': 0, '_id': 0})
    if not result:
        return {'isValid': False}, 401

    return {'isValid': True, 'userData': convert_cursor(result)}, 200


def get_interview_list(username):
    result = mongo.interview_list.find({'interviewee': username}, {
                                       '_id': 0}).sort('time', -1)
    result = convert_cursor(result)
    for res in result:
        res['time'] = int(res['time'].replace(
            tzinfo=timezone.utc).timestamp() * 1000)
    if not result:
        result = []
    return {'interview_data': result}


def get_company_interview_list(username):
    result = mongo.interview_list.find({'lister': username}).sort('time', -1)
    result = convert_cursor(result)
    for res in result:
        res['time'] = int(res['time'].replace(
            tzinfo=timezone.utc).timestamp() * 1000)
    if not result:
        result = []
    return {'interview_data': result}


def set_interview_status(_id, status):
    status = json.loads(status)
    mongo.interview_list.update_one({'_id': ObjectId(_id)}, {
                                    '$set': {'enabled': status}})
    return {'status': True}


def get_job_list(username):
    applied = mongo.job_list.find({'applied': username}, {'applied': 0})
    applied = convert_cursor(applied) or []
    for value in applied:
        value['applied'] = True

    not_applied = mongo.job_list.find(
        {'applied': {'$ne': username}}, {'applied': 0})
    not_applied = convert_cursor(not_applied) or []
    for value in not_applied:
        value['applied'] = False

    result = applied + not_applied
    return {'job_data': result}


def apply_job(username, _id):
    mongo.job_list.update_one({'_id': ObjectId(_id)}, {
                              '$push': {'applied': username}})
    return {'status': True}


def withdraw_application(username, _id):
    mongo.job_list.update_one({'_id': ObjectId(_id)}, {
                              '$pull': {'applied': username}})
    return {'status': True}


def get_openings(username):
    result = mongo.job_list.find({'lister': username}, {
                                 '_id': 1, 'location': 1, 'salary': 1, 'designation': 1, 'applied': 1})
    return {'openings': convert_cursor(result)}


def get_profile(username):
    result = mongo.user_details.find_one({'username': username}, {'_id': 0})
    return {'profile': convert_cursor(result)}


def update_resume_location(username, file_path):
    user_details = mongo.user_details.find_one({'username': username})
    if user_details:
        resume_location = user_details['resume_location']
        if os.path.isfile(resume_location):
            os.remove(resume_location)

    mongo.user_details.update_one({'username': username}, {
                                  '$set': {'resume_location': file_path}})
    return {'resume_location': file_path}


def get_candidate_resume(username):
    user_details = mongo.user_details.find_one({'username': username})
    if not user_details:
        return ''
    return user_details.get('resume_location', '')


def modify_job(username, payload):
    payload['lister'] = username
    if payload['_id']:
        payload['_id'] = ObjectId(payload['_id'])
        mongo.job_list.update_one({'_id': payload['_id']}, {'$set': payload})
    else:
        del payload['_id']
        payload['applied'] = []
        object_id = mongo.job_list.insert_one(payload).inserted_id
        del payload['applied']
        payload['_id'] = object_id
    payload['_id'] = str(payload['_id'])
    return {'jobRecord': payload}


def delete_job(username, job_id):
    # lister -> username prevents unauthorized person from deleting reccord solely by job_id.
    mongo.job_list.delete_one({'_id': ObjectId(job_id), 'lister': username})
    return 'Job deleted successfully'


def get_job_data(job_id):
    result = mongo.job_list.find_one({'_id': ObjectId(job_id)} ,{'applied': 0})
    return convert_cursor(result) 


def process_resume(username, job_id):
    resume_path = mongo.user_details.find_one({'username': username})['resume_location']
    job_details = mongo.job_list.find_one({'_id': ObjectId(job_id)})['job_description']
    return resume_path, job_details
