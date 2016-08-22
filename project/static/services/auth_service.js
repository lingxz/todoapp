/**
 * Created by mark on 8/22/16.
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