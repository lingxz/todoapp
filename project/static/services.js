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
                    return true;
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
                return "currentuser - todo";
            }

            // return available functions for use in controllers
            return ({
                isLoggedIn: isLoggedIn,
                login: login,
                logout: logout,
                register: register,
                getCurrentUser: getCurrentUser,
                getToken: getToken
            });

        }]);