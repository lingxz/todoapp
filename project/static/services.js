/**
 * Created by mark on 7/6/16.
 */
angular.module('todoApp').factory('AuthService',
    ['$q', '$timeout', '$http', '$window',
        function ($q, $timeout, $http, $window) {
            var tokenName = 'webapp-token';

            function saveToken(token) {
                $window.localStorage[tokenName] = token;
            }

            function getToken() {
                return $window.localStorage[tokenName];
            }


            function isLoggedIn() {
                var token = getToken();

                if (token) {
                    var payload = JSON.parse($window.atob(token.split('.')[1]));

                    return payload.exp > Date.now() / 1000;
                } else {
                    return false;
                }
            }

            function login(email, password) {

                // create a new instance of deferred
                var deferred = $q.defer();

                // send a post request to the server
                $http.post('/api/login', {email: email, password: password})
                // handle success
                    .success(function (data, status) {
                        if (status === 200 && data.result) {
                            saveToken(data.token);
                            deferred.resolve();
                        } else {
                            deferred.reject();
                        }
                    })
                    // handle error
                    .error(function (data) {
                        deferred.reject();
                    });

                // return promise object
                return deferred.promise;

            }

            function logout() {

                // create a new instance of deferred
                var deferred = $q.defer();

                // send a get request to the server
                $http({
                    method: 'GET',
                    url: '/api/logout',
                    headers: {Authorization: 'Bearer ' + getToken()}
                })
                // handle success
                    .success(function (data) {
                        // Clear all parameters
                        $window.localStorage.removeItem(tokenName);
                        deferred.resolve();
                    })
                    // handle error
                    .error(function (data) {
                        deferred.reject();
                    });
                // return promise object
                return deferred.promise;

            }

            function register(email, password, username) {

                // create a new instance of deferred
                var deferred = $q.defer();

                // send a post request to the server
                $http.post('/api/register', {
                    email: email,
                    password: password,
                    username: username
                })
                // handle success
                    .success(function (data, status) {
                        if (status === 200 && data.result) {
                            deferred.resolve();
                        } else {
                            deferred.reject();
                        }
                    })
                    // handle error
                    .error(function (data) {
                        deferred.reject();
                    });

                // return promise object
                return deferred.promise;

            }

            function getCurrentUser() {
                var token = getToken();

                if (token) {
                    var payload = JSON.parse($window.atob(token.split('.')[1]));

                    return payload.username;
                } else {
                    return false;
                }
            }

            function getCurrentUserID() {
                var token = getToken();

                if (token) {
                    var payload = JSON.parse($window.atob(token.split('.')[1]));

                    return payload.id;
                } else {
                    return false;
                }
            }

            function getUserPreference() { // should this be in another service?
                var deferred = $q.defer();
                var show_completed = true;
                $http({
                    method: 'GET',
                    url: '/api/user_preferences',
                    headers: {Authorization: 'Bearer ' + getToken()}
                })
                    .success(function (response) {
                        setShowTaskPref(response.show_completed_task);
                        //deferred.resolve(response.show_completed_task);
                    })
                    .error(function (error) {
                        deferred.reject();
                    });

                return deferred.promise
            }

            function updateShowTaskPref(option) {
                setShowTaskPref(option);
                $http({
                    method: 'POST',
                    url: '/api/user_preferences/update_show_task',
                    headers: {Authorization: 'Bearer ' + getToken()},
                    data: {
                        'option': option
                    }
                })
            }

            var showTaskPref;

            function setShowTaskPref(newPref) {
                showTaskPref = newPref
            }

            function retrieveShowTaskPref() {
                return showTaskPref
            }

            function getHeaders() {
                return {Authorization: 'Bearer ' + getToken()}
            }

            // return available functions for use in controllers
            return ({
                isLoggedIn: isLoggedIn,
                login: login,
                logout: logout,
                register: register,
                getCurrentUser: getCurrentUser,
                getCurrentUserID: getCurrentUserID,
                getToken: getToken,
                getUserPreference: getUserPreference,
                updateShowTaskPref: updateShowTaskPref,
                setShowTaskPref: setShowTaskPref,
                retrieveShowTaskPref: retrieveShowTaskPref,
                getHeaders: getHeaders
            });

        }]);

angular.module('todoApp').factory('DatetimeService', [function () {
    var cur_pos = null;
    var cur_task = null;

    function getCursorPos() {
        return cur_pos
    }

    function setCursorPos(cursor, task_id) {
        cur_pos = cursor;
        cur_task = task_id;
    }

    function getCurTask() {
        return cur_task
    }

    return {
        getCursorPos: getCursorPos,
        setCursorPos: setCursorPos,
        getCurTask: getCurTask
    }

}]);

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