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
            function setShowTaskPref(newPref){
                showTaskPref = newPref
            }
            function retrieveShowTaskPref(){
                return showTaskPref
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
                retrieveShowTaskPref: retrieveShowTaskPref
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


angular.module('todoApp').factory('RecursionHelper', ['$compile', function($compile){
	return {
		/**
		 * Manually compiles the element, fixing the recursion loop.
		 * @param element
		 * @param [link] A post-link function, or an object with function(s) registered via pre and post properties.
		 * @returns An object containing the linking functions.
		 */
		compile: function(element, link){
			// Normalize the link parameter
			if(angular.isFunction(link)){
				link = { post: link };
			}

			// Break the recursion loop by removing the contents
			var contents = element.contents().remove();
			var compiledContents;
			return {
				pre: (link && link.pre) ? link.pre : null,
				/**
				 * Compiles and re-adds the contents
				 */
				post: function(scope, element){
					// Compile the contents
					if(!compiledContents){
						compiledContents = $compile(contents);
					}
					// Re-add the compiled contents to the element
					compiledContents(scope, function(clone){
						element.append(clone);
					});

					// Call the post-linking function, if any
					if(link && link.post){
						link.post.apply(null, arguments);
					}
				}
			};
		}
	};
}]);

angular.module('todoApp').factory('TaskService',[function(){
    var currentTask = null;

    function setCurrentTask(task){
        currentTask = task
    }
    function getCurrentTask(){
        return currentTask
    }
    return ({
        setCurrentTask: setCurrentTask,
        getCurrentTask: getCurrentTask
    })

}]);