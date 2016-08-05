from project import app, db
from flask_testing import TestCase
from flask import url_for
from project.config import TestConfig
from project.models import User
import json


class UserTestSetup(TestCase):
    def create_app(self):
        app.config.from_object(TestConfig)
        return app

    def setUp(self):
        self.test_username = 'test'
        self.test_password = 'test'
        self.test_email = 'test@test.com'
        db.create_all()

    def tearDown(self):
        db.session.remove()
        db.drop_all()


class UserTests(UserTestSetup):
    """Functions to check user routes"""

    def create_user(self):
        self.test_username = 'test'
        self.test_password = 'test'
        self.test_email = 'test@test.com'
        user = User(
            username=self.test_username,
            password=self.test_password,
            email=self.test_email
        )

        db.session.add(user)
        db.session.commit()

    def test_user_can_login(self):
        """Check if a registered user can log in"""
        self.create_user()

        resp = self.client.post(url_for('users.login'),
                                data=json.dumps({'email': self.test_email, 'password': self.test_password}),
                                content_type='application/json')

        self.assertEquals(resp.json['result'], True)
        self.assertEquals(resp.json['username'], self.test_username)

    def test_unregistered_user_cannot_login(self):
        """User must be registered to log in"""
        resp = self.client.post(url_for('users.login'),
                                data=json.dumps({'email': self.test_email, 'password': self.test_password}),
                                content_type='application/json')

        self.assertEquals(resp.json['result'], False)

    def test_can_register_user(self):
        """Check if user can be registered"""
        resp = self.client.post(url_for('users.register'),
                                data=json.dumps({
                                    'email': self.test_email,
                                    'password': self.test_password,
                                    'username': self.test_username}
                                ),
                                content_type='application/json')

        self.assert200(resp)
        self.assertEquals(resp.json['result'], 'success')

    def test_cannot_register_multiple_user(self):
        """Prevent multiple registrations"""
        self.create_user()

        resp = self.client.post(url_for('users.register'),
                                data=json.dumps({
                                    'email': self.test_email,
                                    'password': self.test_password,
                                    'username': self.test_username}
                                ),
                                content_type='application/json')

        self.assert200(resp)
        self.assertEquals(resp.json['result'], 'this user is already registered')
