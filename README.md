#Todo app

Made as an exercise in Flask, Angular, SQL

## Important
Project brought up to date with Python 3 (because it seems many tutorials are
using python 3, so this should avoid pain in the long run)

Login tutorial from - https://realpython.com/blog/python/handling-user-authentication-with-angular-and-flask/


Have to change the interpreter

## Running the app - pull with no changes to DB
python manage.py runserver (it will run with the debug options)

## Running the app - after a change to DB model (assuming you made the change)
python manage.py db migrate
python manage.py db upgrade
python manage.py runserver

## Running the app - after a change to DB model (you did not make the change)
python manage.py db upgrade
python manage.py runserver