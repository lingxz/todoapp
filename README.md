#Todo app

Made as an exercise in Flask, Angular, SQL

## Running the app - pull with no changes to DB
python manage.py runserver (it will run with the debug options)

## Running the app - after a change to DB model (assuming you made the change)
python manage.py db migrate
python manage.py db upgrade
python manage.py runserver

## Running the app - after a change to DB model (you did not make the change)
python manage.py db upgrade
python manage.py runserver