# This script assumes all necessary plugins are installed into the venv

source venv/bin/activate
py.test --cov=project --cov-report html project
deactivate