# project / models.py

import datetime
from project import db, bcrypt


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String, nullable=True)
    username = db.Column(db.String, nullable=False, unique=True)
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

    # sub_tasks = db.relationship('Task', backref='parent', lazy='dynamic')
    # is this storing the object or the id?
    # this sub_task thing doesn't work
    # should all sub tasks be deleted if parent is deleted?
    # need to add category

    def __init__(self, content):
        self.content = content
        self.done = False

    def __repr__(self):
        return '<Content %s>' % self.content
