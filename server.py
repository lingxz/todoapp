from flask import Flask, request, session, g, redirect, url_for, abort, render_template, flash
from flask_sqlalchemy import SQLAlchemy
import os
import sqlite3
import string
import random
import json
import datetime


# app = Flask(__name__)
# app.config.from_object(__name__)
#
# # Load default config and override config from an environment variable
# app.config.update(dict(
#     DATABASE=os.path.join(app.root_path, 'database.db'),
#     SECRET_KEY='development key',
#     USERNAME='admin',
#     PASSWORD='default'
# ))
# app.config.from_envvar('SERVER_SETTINGS', silent=True)


app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = True
db = SQLAlchemy(app)


class User(db.Model):
    __tablename__='user'

    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String, nullable=True)
    username = db.Column(db.String, nullable=False)
    password = db.Column(db.String, nullable=False)
    authenticated = db.Column(db.Boolean, default=False)
    tasks = db.relationship('Task', backref="user", cascade="all, delete-orphan", lazy='dynamic')
    # one to many mapping between user and tasks, deletes all tasks when user is deleted

    def is_active(self):
        """True, as all users are active."""
        return True

    def get_id(self):
        """Return the email address to satisfy Flask-Login's requirements."""
        return self.email

    def is_authenticated(self):
        """Return True if the user is authenticated."""
        return self.authenticated

    def is_anonymous(self):
        """True, as anonymous users are supported."""
        return True


class Task(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    content = db.Column(db.Text)
    done = db.Column(db.Boolean, default=False)
    start_date = db.Column(db.DateTime, default=datetime.datetime.now())
    due_date = db.Column(db.DateTime, nullable=True)
    parent_task = db.Column(db.Integer, nullable=True)  # stores the parent task id
    sub_tasks = db.relationship('Task', backref='parent', lazy='dynamic')
    # is this storing the object or the id?
    # should all sub tasks be deleted if parent is deleted?

    def __init__(self, content):
        self.content = content
        self.done = False

    def __repr__(self):
        return '<Content %s>' % self.content


def connect_db():
    """Connects to the specific database."""
    rv = sqlite3.connect(app.config['DATABASE'])
    rv.row_factory = sqlite3.Row
    return rv


def get_db():
    """Opens a new database connection if there is none yet for the
    current application context.
    """
    if not hasattr(g, 'sqlite_db'):
        g.sqlite_db = connect_db()
    return g.sqlite_db


@app.teardown_appcontext
def close_db(error):
    """Closes the database again at the end of the request."""
    if hasattr(g, 'sqlite_db'):
        g.sqlite_db.close()


def init_db():
    db = get_db()
    with app.open_resource('schema.sql', mode='r') as f:
        db.cursor().executescript(f.read())
    db.commit()


@app.cli.command('initdb')
def initdb_command():
    """Initializes the database."""
    init_db()
    print 'Initialized the database.'


# @app.route('/add', methods=['POST'])
# def add_entry():
#     if not session.get('logged_in'):
#         abort(401)
#     db = get_db()
#     # Use ? ? to prevent SQL injection
#
#     # TODO: Strip the content in the 'text' field
#     db.execute('INSERT INTO entries (title, text) VALUES (?, ?)',
#                [request.form['title'], request.form['text']])
#     db.commit()
#     flash('New entry was successfully posted')
#     return redirect(url_for('show_entries'))
#


# @app.route('/login', methods=['GET', 'POST'])
# def login():
#     """Storing as plaintext for simplicity now, Werkzeug has security helpers"""
#     error = None
#     if request.method == 'POST':
#         if request.form['username'] != app.config['USERNAME']:
#             error = 'Invalid username'
#         elif request.form['password'] != app.config['PASSWORD']:
#             error = 'Invalid password'
#         else:
#             session['logged_in'] = True
#             flash('You were logged in')
#             return redirect(url_for('show_entries'))
#     return render_template('login.html', error=error)
#
#
# @app.route('/logout')
# def logout():
#     session.pop('logged_in', None)
#     flash('You were logged out')
#     return redirect(url_for('show_entries'))


@app.route('/')
def show_tasks():
    return render_template("index.html")


def get_tasks(num_tasks):
    db = get_db()

    # This is a workaround because they refused to let me use parameterised query with the limit
    # Also note that the tasks are sorted in the correct order here, rather than at the frontend
    # I assume you want the newest task to appear at the top of the list
    query = 'SELECT * FROM tasks ORDER BY postid DESC LIMIT ' + str(num_tasks)

    cur = db.execute(query)
    tasks = cur.fetchall()
    return tasks


@app.route('/retrieve', methods=['POST'])
def retrieve_tasks():
    """Swap to a post request because you are sending data"""
    num_tasks = request.json['numTasks']
    tasks = get_tasks(num_tasks)
    todo_list = []
    for task in tasks:
        task_item = {
            'id': task[0],
            'content': task[1],
            'duedate': task[2]
        }
        todo_list.append(task_item)

    return json.dumps(todo_list)


@app.route('/add', methods=['POST'])
def add_task():
    db = get_db()

    data = request.json['content']
    print data
    # Use ? ? to prevent SQL injection
    # TODO: strip the content in the 'text' field
    db.execute('INSERT INTO tasks (content) VALUES (?)', [data])
    db.commit()

    return 'OK'


@app.route('/register', methods=['POST'])
def register():
    db = get_db()
    json_data = request.json
    user = User(
        email=json_data['email'],
        username=json_data['username'],
        password=json_data['password'])

    # try:
    #     db.session.add(user)
    #     db.session.commit()
    #     status = 'success'
    # except:
    #     status = 'this user is already registered'
    # db.session.close()
    # return jsonify({'result': status})

if __name__ == "__main__":
    app.run(debug=True)
