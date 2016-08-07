#Todo app
[![Build Status][travis-image]][travis-url]

Made as an exercise in Flask, Angular, SQL

## Important
Project brought up to date with Python 3 (because it seems many tutorials are using python 3, so this should avoid pain in the long run). Have to change the interpreter because of this.

Login tutorial from - https://realpython.com/blog/python/handling-user-authentication-with-angular-and-flask/


### Running the app - pull with no changes to DB
```python
python manage.py runserver # it will run with the debug option
```

### Running the app - after a change to DB model (assuming you made the change)
```python
python manage.py db migrate
python manage.py db upgrade
python manage.py runserver
```

### Running the app - after a change to DB model (you did not make the change)
```python
python manage.py db upgrade
python manage.py runserver
```

### Testing (you will need Node.js to run the tests)
```npm init``` to install the necessary npm packages
```karma start``` to run the tests

### Testing (Backend)
```pip install coverage```
```nosetests --with-coverage --cover-package=project --cover-html```

[travis-image]: https://travis-ci.org/lingxz/todoapp.svg?branch=master
[travis-url]: https://travis-ci.org/lingxz/todoapp
