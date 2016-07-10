import json
from flask import Flask, request, redirect, jsonify, session
from flask_bcrypt import Bcrypt
from flask_sqlalchemy import SQLAlchemy
from project.config import BaseConfig
import jwt
from jwt import DecodeError, ExpiredSignature
from datetime import datetime, time, timedelta
from functools import wraps
import dateutil.parser as dparser

# config
app = Flask(__name__)
app.config.from_object(BaseConfig)

bcrypt = Bcrypt(app)
db = SQLAlchemy(app)

# Import after to avoid circular dependency
from project.models import Task, User


# Token creation
def create_token(user):
    payload = {
        # data
        'id': user.id,
        'username': user.username,
        # issued at
        'iat': datetime.utcnow(),
        # expiry
        'exp': datetime.utcnow() + timedelta(days=1)
    }

    token = jwt.encode(payload, BaseConfig.SECRET_KEY, algorithm='HS256')
    return token.decode('unicode_escape')


def parse_token(req):
    token = req.headers.get('Authorization').split()[1]
    return jwt.decode(token, BaseConfig.SECRET_KEY, algorithms='HS256')


def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if not request.headers.get('Authorization'):
            response = jsonify(message='Missing authorization header')
            response.status_code = 401
            return response

        try:
            payload = parse_token(request)
        except DecodeError:
            response = jsonify(message='Token is invalid')
            response.status_code = 401
            return response
        except ExpiredSignature:
            response = jsonify(message='Token has expired')
            response.status_code = 401
            return response

        return f(*args, **kwargs)

    return decorated_function


@app.route('/api/login', methods=['POST'])
def login():
    json_data = request.json
    user = User.query.filter_by(email=json_data['email']).first()
    if user and bcrypt.check_password_hash(
            user.password, json_data['password']):
        session['logged_in'] = True
        token = create_token(user)
        return jsonify({'result': True, "token": token, "username": user.username})
    else:
        return jsonify({'result': False, "token": -1})


@app.route('/api/register', methods=['POST'])
def register():
    """
    For POSTS, create the relevant account
    """
    json_data = request.json
    user = User(
        email=json_data['email'],
        username=json_data['username'],
        password=json_data['password']
    )
    try:
        db.session.add(user)
        db.session.commit()
        status = 'success'
    except:
        status = 'this user is already registered'
    db.session.close()
    return jsonify({'result': status})


@app.route('/api/logout')
@login_required
def logout():
    session.pop('logged_in', None)
    return jsonify({'result': 'success'})


@app.route('/retrieve', methods=['POST'])
@login_required
def retrieve_tasks():
    """Swap to a post request because you are sending data"""
    # Support for the reverse query here
    tasks = Task.query.order_by(Task.id.desc()).limit(10)
    todo_list = []
    for task in tasks:
        if task.due_date:
            # convert datetime object to string before sending
            due_date = task.due_date.strftime("%d/%m/%Y %H:%M:%S")
        else:
            due_date = None
        task_item = {
            'id': task.id,
            'content': task.content,
            'due_date': due_date,
            'done': task.done
        }
        todo_list.append(task_item)
    return json.dumps(todo_list)


@app.route('/add', methods=['POST'])
@login_required
def add_task():
    data = request.json['content']
    if not data:
        return redirect('/')
    try:
        dt = dparser.parse(data, fuzzy=True)
        if dt.time() == time():  # if time is 0:0:0, then no time was given
            # if no time was given, time defaults to 9am
            dt = dt.replace(hour=9, minute=0)
        content = data
    except ValueError:
        dt = None
        content = data

    task = Task(
        content=content,
        user_id=request.json['user_id'],
        due_date=dt
    )
    db.session.add(task)
    db.session.commit()
    return 'OK'


@app.route('/markdone', methods=['POST'])
@login_required
def mark_as_done():
    id = request.json['id']
    if not id:
        return redirect('/')
    current_task = Task.query.filter_by(id=id).first()
    if current_task.done:
        current_task.done = False
        db.session.commit()
        return json.dumps({'done': False})
    else:
        current_task.done = True
        db.session.commit()
        return json.dumps({'done': True})


@app.route('/api/user_preferences', methods=['POST'])
@login_required
def get_user_preferences():
    id = request.json['user']['id']
    show_completed_task = User.query.filter_by(id=id).first().show_completed_task
    return json.dumps({'show_completed_task': show_completed_task})


@app.route('/')
def index():
    return app.send_static_file('index.html')


if __name__ == "__main__":
    app.run(debug=True)
