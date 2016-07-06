import json
from flask import Flask, request, redirect, render_template
from flask_login import LoginManager
from flask_wtf import Form
from wtforms import StringField, PasswordField, BooleanField
from wtforms.validators import DataRequired, Email
from flask.ext.bcrypt import Bcrypt
from flask.ext.sqlalchemy import SQLAlchemy
from project.config import BaseConfig

# config
app = Flask(__name__)
app.config.from_object(BaseConfig)

bcrypt = Bcrypt(app)
db = SQLAlchemy(app)

# Import after to avoid circular dependency
from project.models import Task, User

# login stuff
login_manager = LoginManager()
login_manager.init_app(app)


class LoginForm(Form):
    email = StringField('Email', validators=[DataRequired(), Email()])
    password = PasswordField('Password', validators=[DataRequired()])
    remember_me = BooleanField('remember_me', default=False)


@login_manager.user_loader
def load_user(user_id):
    """Given *user_id*, return the associated User object.
    """
    return User.query.get(user_id)


@app.route('/login', methods=['GET', 'POST'])
def login():
    """For GET requests, display the login form.
    For POSTS, login the current user by processing the form
    """
    form = LoginForm()
    if form.validate_on_submit():
        user = User.query.get()
        # haven't finish


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


@app.route('/retrieve', methods=['POST'])
def retrieve_tasks():
    """Swap to a post request because you are sending data"""

    # Support for the reverse query here
    tasks = Task.query.order_by(Task.id.desc()).limit(10)
    todo_list = []
    for task in tasks:
        task_item = {
            'id': task.id,
            'content': task.content,
            'duedate': 'bla'  # placeholder
        }
        todo_list.append(task_item)
    return json.dumps(todo_list)


@app.route('/add', methods=['POST'])
def add_task():
    data = request.json['content']
    if not data:
        return redirect('/')
    task = Task(data)
    db.session.add(task)
    db.session.commit()
    return 'OK'


if __name__ == "__main__":
    app.run(debug=True)
