/**
 * Created by mark on 8/22/16.
 */
angular.module('todoApp').factory('TaskService', ['$q', '$http', 'AuthService', function ($q, $http, AuthService) {
    var currentTask = null;

    function setCurrentTask(task) {
        currentTask = task
    }

    function getCurrentTask() {
        return currentTask
    }

    function addTask(task, content) {
        var deferred = $q.defer();

        // for a default argument
        content = content || "";

        var headers = AuthService.getHeaders();
        $http({
            url: '/add',
            method: "POST",
            headers: headers,
            data: {
                content: content,
                user_id: AuthService.getCurrentUserID(),
                prev_task: task.id
            }
        }).then(function (response) {
            deferred.resolve()
        }, function (error) {
            console.log(error);
            deferred.reject()
        });

        return deferred.promise
    }

    function removeDate(task) {
        var deferred = $q.defer();
        var headers = AuthService.getHeaders();
        $http({
            method: 'POST',
            url: '/remove_date',
            headers: headers,
            data: {
                id: task.id
            }
        }).then(function (response) {
            deferred.resolve()
        }, function (error) {
            console.log(error);
            deferred.reject()
        });

        return deferred.promise
    }

    function editTask(task, new_content) {
        var headers = AuthService.getHeaders();
        $http({
            method: 'POST',
            url: '/edit_task',
            headers: headers,
            data: {
                id: task.id,
                content: new_content
            }
        })
    }

    function retrieveItems() {
        var headers = AuthService.getHeaders();
        var deferred = $q.defer();
        $http({
            method: 'POST',
            url: '/retrieve_tasks',
            headers: headers,
            data: {
                user_id: AuthService.getCurrentUserID()
            }
        }).then(function (response) {
            deferred.resolve(response.data);
        }, function (error) {
            console.log(error);
            deferred.reject()
        });
        return deferred.promise
    }

    function deleteTask(task) {
        var headers = AuthService.getHeaders();
        var deferred = $q.defer();
        $http({
            method: 'POST',
            url: '/delete_task',
            headers: headers,
            data: {
                user_id: AuthService.getCurrentUserID(),
                id: task.id
            }
        }).then(function (response) {
            deferred.resolve()
        }, function (error) {
            console.log(error);
            deferred.reject()
        });

        return deferred.promise
    }

    function getPrevSibling(task) {
        var headers = AuthService.getHeaders();
        var deferred = $q.defer();

        $http({
            url: '/get_prev_sibling',
            method: "POST",
            headers: headers,
            data: {
                user_id: AuthService.getCurrentUserID(),
                task_id: task.id
            }
        }).then(function (response) {
            deferred.resolve(response.data);
        }, function (error) {
            console.log(error);
            deferred.reject()
        });

        return deferred.promise
    }

    function makeSubTask(task, prev_sibling_id) {
        var headers = AuthService.getHeaders();
        var deferred = $q.defer();

        $http({
            url: '/make_subtask',
            method: "POST",
            headers: headers,
            data: {
                user_id: AuthService.getCurrentUserID(),
                prev_task_id: prev_sibling_id,
                subtask_id: task.id
            }
        }).then(function (response) {
            deferred.resolve()
        }, function (error) {
            console.log(error);
            deferred.reject()
        });

        return deferred.promise
    }

    function addSubTask(parent_id) {
        var headers = AuthService.getHeaders();
        var deferred = $q.defer();

        $http({
            url: '/add_subtask',
            method: "POST",
            headers: headers,
            data: {
                user_id: AuthService.getCurrentUserID(),
                parent_id: parent_id
            }
        }).then(function (response) {
            deferred.resolve()
        }, function (error) {
            console.log(error);
            deferred.reject()
        });

        return deferred.promise
    }


    function markAsDone(task) {
        var headers = AuthService.getHeaders();
        var deferred = $q.defer();

        $http({
            method: 'POST',
            url: '/markdone',
            headers: headers,
            data: {
                id: task.id
            }
        }).then(function (response) {
            deferred.resolve(response.data)
        }, function (error) {
            console.log(error);
            deferred.reject()
        });
        return deferred.promise
    }

    function editDate(task_id, date) {
        var headers = AuthService.getHeaders();
        var deferred = $q.defer();

        $http({
            method: 'POST',
            url: '/edit_date',
            headers: headers,
            data: {
                id: task_id,
                date: date.toString()
            }
        }).then(function (response) {
            deferred.resolve()
        }, function (error) {
            console.log(error);
            deferred.reject()
        });

        return deferred.promise
    }

    return ({
        setCurrentTask: setCurrentTask,
        getCurrentTask: getCurrentTask,
        addTask: addTask,
        removeDate: removeDate,
        editTask: editTask,
        retrieveItems: retrieveItems,
        deleteTask: deleteTask,
        getPrevSibling: getPrevSibling,
        makeSubTask: makeSubTask,
        markAsDone: markAsDone,
        editDate: editDate,
        addSubTask: addSubTask
    })

}]);