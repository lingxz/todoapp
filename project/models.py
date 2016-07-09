# project / models.py

import datetime
from project import db, bcrypt


class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    email = db.Column(db.String, nullable=False, unique=True)
    username = db.Column(db.String, nullable=False, unique=True)
    password = db.Column(db.String, nullable=False)
    authenticated = db.Column(db.Boolean, default=False)

    tasks = db.relationship('Task', backref="users", cascade="all, delete-orphan", lazy='dynamic')

    # one to many mapping between user and tasks, deletes all tasks when user is deleted

    def __init__(self, email, password, username, admin=False):
        self.email = email
        self.password = bcrypt.generate_password_hash(str(password))
        self.registered_on = datetime.datetime.now()
        self.username = username
        self.admin = admin

    def is_active(self):
        """True, as all users are active."""
        return True

    def get_id(self):
        return self.id

    def is_authenticated(self):
        """Return True if the user is authenticated."""
        return self.authenticated

    def is_anonymous(self):
        """True, as anonymous users are supported."""
        return True

    def __repr__(self):
        return '<User {0}>'.format(self.email)


class Task(db.Model):
    __tablename__ = "tasks"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    content = db.Column(db.Text)
    done = db.Column(db.Boolean, default=False)
    start_date = db.Column(db.DateTime, default=datetime.datetime.now())
    due_date = db.Column(db.DateTime, nullable=True)
    category = db.Column(db.Text, nullable=True)

    parent_id = db.Column(db.Integer, db.ForeignKey('tasks.id'))
    sub_tasks = db.relationship("Task", backref=db.backref('parent', remote_side=[id]))

    def __init__(self, content, due_date=None):
        self.content = content
        self.due_date = due_date
        self.done = False

    def __repr__(self):
        return '<Content %s>' % self.content
