from flask import Flask, request, session, g, redirect, url_for, abort, render_template, flash
import os
import sqlite3
import string
import random
import json

app = Flask(__name__)
app.config.from_object(__name__)

# Load default config and override config from an environment variable
app.config.update(dict(
    DATABASE=os.path.join(app.root_path, 'database.db'),
    SECRET_KEY='development key',
    USERNAME='admin',
    PASSWORD='default'
))
app.config.from_envvar('SERVER_SETTINGS', silent=True)


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


def get_tasks():
    print "CALLING ROUTE"
    db = get_db()
    query = """SELECT * FROM Tasks"""
    cur = db.execute(query)
    tasks = cur.fetchall()
    return tasks


@app.route('/retrieve', methods=['GET'])
def retrieve_tasks():
    tasks = get_tasks()
    todolist = []
    for task in tasks:
        taskitem = {
            'id': task[0],
            'content': task[1],
            'duedate': task[2]
        }
        todolist.append(taskitem)
    return json.dumps(todolist)


@app.route('/add', methods=['POST'])
def add_task():
    db = get_db()

    data = request.json['content']
    # Use ? ? to prevent SQL injection
    # TODO: strip the content in the 'text' field
    db.execute('INSERT INTO Tasks (content) VALUES (?)', [data])
    db.commit()
    flash('New entry was successfully posted')
    return 'OK'

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


if __name__ == "__main__":
    app.run(debug=True)
