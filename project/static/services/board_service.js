/**
 * Created by mark on 8/22/16.
 */
angular.module('todoApp').factory('BoardService', ['$q', '$http', 'TaskService', function ($q, $http, TaskService) {
    var currentBoard = null;
    var currentBoardID = -1;
    var tasks = null;
    var firstBoard = null;
    var lastBoard = null;
    var filteredTasks = null;

    function setCurrentBoard(board) {
        currentBoard = board
    }

    function getCurrentBoard() {
        return currentBoard
    }

    function generateResponse() {
        return {
            tasks: tasks,
            filteredTasks: filteredTasks,
            firstBoard: firstBoard,
            lastBoard: lastBoard,
            currentBoard: currentBoard,
            currentBoardID: currentBoardID
        };
    }

    function taskFilter() {
        var deferred = $q.defer();
        var promise = TaskService.getDirectSubTasks(currentBoard.id);
        promise.then(function (data) {
            filteredTasks = data;
            deferred.resolve(data)
        }, function (error) {
            console.log(error);
            deferred.reject()
        });

        return deferred.promise
    }

    function retrieveItems() {
        var deferred = $q.defer();
        var promise = TaskService.retrieveItems();
        promise.then(function (response) {
            tasks = response;

            // Find the very first board (for display)
            firstBoard = tasks[0];

            // Find the last board (for appending)
            for (var i in tasks) {
                var curTask = tasks[i];
                if (curTask.depth == 0) {
                    lastBoard = curTask;
                    if (curTask.group === currentBoardID) {
                        currentBoard = curTask;
                    }
                }
            }

            taskFilter().then(function () {
                deferred.resolve(generateResponse());

            })
        }, function (error) {
            console.log(error);
            deferred.reject()
        });
        return deferred.promise;
    }

    function changeBoard(board) {
        var val = board.group;
        if (currentBoardID === val) {
            currentBoardID = -1;
            currentBoard = null;
        } else {
            currentBoardID = val;
            currentBoard = board;
        }
        taskFilter();
        return generateResponse();
    }

    function addNewBoard() {
        var deferred = $q.defer();
        var promise = TaskService.addTask(lastBoard, "NEW BOARD");
        promise.then(function (response) {
            var promise2 = retrieveItems();
            promise2.then(function (response) {
                changeBoard(lastBoard);
                deferred.resolve(generateResponse());
            })
        }, function (error) {
            console.log(error);
            deferred.reject()
        });
        return deferred.promise;
    }

    function deleteBoard() {
        var deferred = $q.defer();
        if (currentBoardID == -1) {
            deferred.resolve(generateResponse());
            return deferred.promise;
        }
        // TODO: Find and change to the previous board (not the last board)
        var promise = TaskService.deleteTask(currentBoard);
        promise.then(function (response) {
            var promise2 = retrieveItems();
            promise2.then(function (response) {
                changeBoard(lastBoard);
                deferred.resolve(generateResponse());
            })
        }, function (error) {
            console.log(error);
            deferred.reject()
        });
        return deferred.promise;
    }

    function addTaskToBoard() {
        var deferred = $q.defer();
        var parent_id;
        if (currentBoard == null) {
            parent_id = firstBoard.id;
        } else {
            parent_id = currentBoard.id;
        }
        var promise = TaskService.addSubTask(parent_id);
        promise.then(function (response) {
            var promise2 = retrieveItems();
            promise2.then(function (response) {
                deferred.resolve(generateResponse());
            })
        }, function (error) {
            console.log(error);
            deferred.reject()
        });
        return deferred.promise;
    }

    return ({
        setCurrentBoard: setCurrentBoard,
        getCurrentBoard: getCurrentBoard,
        retrieveItems: retrieveItems,
        changeBoard: changeBoard,
        addNewBoard: addNewBoard,
        deleteBoard: deleteBoard,
        addTaskToBoard: addTaskToBoard
    })
}]);