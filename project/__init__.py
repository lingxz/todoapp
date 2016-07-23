import json
from flask import Flask, request, redirect, jsonify, session
from flask_bcrypt import Bcrypt
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import text
from project.config import BaseConfig
import jwt
from jwt import DecodeError, ExpiredSignature
from datetime import datetime, timedelta
from functools import wraps
import parsedatetime as pdt

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
        session['user_id'] = user.id
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
    session.pop('user_id', None)
    return jsonify({'result': 'success'})


def retrieve_tasks_helper():
    # Support for the reverse query here
    tasks = Task.query. \
        filter(Task.user_id == session['user_id']). \
        order_by(Task.lft)

    todo_list = []
    for task in tasks:
        task_item = task_to_dictionary(task)
        todo_list.append(task_item)
    return todo_list


def task_to_dictionary(task):
    if task.due_date:
        # convert datetime object to string before sending
        due_date = task.due_date.strftime("%Y/%m/%d %H:%M:%S")
    else:
        due_date = None
    task_item = {
        'id': task.id,
        'content': task.content,
        'due_date': due_date,
        'done': task.done
    }
    return task_item


@app.route('/retrieve', methods=['POST'])
@login_required
def retrieve_tasks():
    """Swap to a post request because you are sending data"""
    # Support for the reverse query here
    todo_list = retrieve_tasks_helper()

    # Must generate the initial task
    if len(todo_list) == 0:
        task = Task(
            content="Edit your first task",
            user_id=session['user_id'],
            due_date=None
        )
        db.session.add(task)
        db.session.commit()
        todo_list = retrieve_tasks_helper()

    return json.dumps(todo_list)


@app.route('/add', methods=['POST'])
@login_required
def add_task():
    data = request.json['content']
    # if not data:
    #     return redirect('/')

    cal = pdt.Calendar()
    date_time = cal.nlp(data)
    if date_time and date_time[0][0] > datetime.now():  # if date is in the past, ignore date
        # if datetime was given
        dt = date_time[0][0]  # this defaults to 9am if no time was given
        # here we try to remove datetime from string
        date_string_start = date_time[0][2]
        date_string_end = date_time[0][3]
        content = data[:date_string_start].rstrip() + data[date_string_end:]
        if not content.strip():
            content = data

    else:
        dt = None
        content = data

    user_id = request.json['user_id']
    my_right = Task.query.get(request.json['prev_task']).rgt
    task = Task(
        content=content,
        user_id=user_id,
        due_date=dt,
        my_right=my_right
    )
    user_id = str(user_id)
    # Technically this should be wrapped in a transaction
    cmd = "UPDATE tasks SET rgt = rgt + 2 WHERE user_id =" + user_id + " AND rgt > " + str(my_right)
    db.engine.execute(text(cmd))
    cmd2 = "UPDATE tasks SET lft = lft + 2 WHERE user_id =" + user_id + " AND lft > " + str(my_right)
    db.engine.execute(text(cmd2))
    db.session.add(task)
    db.session.commit()
    return json.dumps(task_to_dictionary(task))


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


@app.route('/edit_task', methods=['POST'])
@login_required
def edit_task():
    id = request.json['id']
    content = request.json['content']
    current_task = Task.query.filter_by(id=id).first()
    current_task.content = content
    db.session.commit()
    return 'OK'


@app.route('/edit_date', methods=['POST'])
@login_required
def edit_date():
    id = request.json['id']
    new_date = request.json['date']
    new_date = datetime.strptime(new_date, '%a %b %d %Y %H:%M:%S GMT%z (%Z)')
    current_task = Task.query.filter_by(id=id).first()
    current_task.due_date = new_date
    db.session.commit()
    return new_date.strftime("%Y/%m/%d %H:%M:%S")


@app.route('/remove_date', methods=['POST'])
@login_required
def remove_date():
    id = request.json['id']
    current_task = Task.query.filter_by(id=id).first()
    current_task.due_date = None
    db.session.commit()
    return 'OK'


@app.route('/delete_task', methods=['POST'])
@login_required
def delete_task():
    id = request.json['id']
    current_task = db.session.query(Task).get(id)
    db.session.delete(current_task)
    db.session.commit()
    return 'OK'


@app.route('/')
def index():
    return app.send_static_file('index.html')


if __name__ == "__main__":
    app.run(debug=True)
