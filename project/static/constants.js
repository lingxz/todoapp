angular.module('todoApp')
    .constant('AUTH_EVENTS', {
        loginSuccess: 'auth-login-success',
        loginFailed: 'auth-login-failed',
        logoutSuccess: 'auth-logout-success',
        sessionTimeout: 'auth-session-timeout',
        notAuthenticated: 'auth-not-authenticated',
        notAuthorized: 'auth-not-authorized'
    })
    .constant('USER_ROLES', {
        all: '*',
        admin: 'admin',
        guest: 'guest'
    })
    .constant('USER_PREFERENCES', {
        showCompletedTasks: 'show-completed-tasks',
        hideCompletedTasks: 'hide-completed-tasks'
    })
    .constant('TASK_EVENTS', {
        addNewEmptyTask: 'add-new-empty-task',
        refreshTaskList: 'refresh-task-list',
        summonDatePicker: 'summon-date-picker'
    });
