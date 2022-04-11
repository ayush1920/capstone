import pymongo
from uuid import uuid1
from utils import cprint
from datetime import datetime

unique_id = lambda : str(uuid1())

class Mongo:
    def __init__(self, db_name, init_function = None):
        cprint('Mongo Database initialised', color = 'yellow')
        self.db = pymongo.MongoClient()[db_name]

        if init_function != None:
            init_function(self.db)

def initialize_database(db):
    # insert company and student credentials if not exists
    if not db.usercred.find_one({'username': 'company1'}):
        db.usercred.insert_one({'username': 'company1', 'password': 'comp1@123', 'interviewer': True})

    if not db.usercred.find_one({'username': 'company2'}):
        db.usercred.insert_one({'username': 'company2', 'password': 'comp2@123', 'interviewer': True})

    if not db.usercred.find_one({'username': 'candidate'}):
        db.usercred.insert_one({'username': 'candidate', 'password': 'cand@123', 'interviewer': False})

    # delete all documents from "interview_list"
    db.interview_list.delete_many({})
    db.job_list.delete_many({})
    
    # if no document is present in "interview_list"
    count = db.interview_list.count_documents({})
    if not count:
        db.interview_list.insert_many([{'lister':'company1',
                                        'interviewee': 'candidate',
                                        'time': datetime.utcnow(),
                                        'role': 'Python Dev',
                                        'salary':'negotiable',
                                        'enabled': False}])
        
    count = db.job_list.count_documents({})
    if not count:
        db.job_list.insert_one({'lister': 'company2', 'role': 'Python Dev', 'salary':'negotiable', 'job_id': unique_id(),
                                'applied' : ['candidate']})
        
        db.job_list.insert_one({'lister': 'company1', 'role': 'Java Dev', 'salary':'4,00,000', 'job_id': unique_id(),
                                'applied' : []})
                                       
mongo = Mongo('capstone', initialize_database)
