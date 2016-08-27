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

    function taskFilter() {
        var res = [];

        for (var i in tasks) {
            if (currentBoardID === -1) {
                if (tasks[i].depth > 0) res.push(tasks[i]);
            } else {
                if (tasks[i].rgt < currentBoard.rgt && tasks[i].lft > currentBoard.lft) {
                    res.push(tasks[i]);
                }
            }
        }
        filteredTasks = res;
    };

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
                    console.log(curTask.group, currentBoardID);
                    if (curTask.group === currentBoardID) {
                        currentBoard = curTask;
                    }
                }
            }

            taskFilter();

            var resp = {
                tasks: tasks,
                filteredTasks: filteredTasks,
                firstBoard: firstBoard,
                lastBoard: lastBoard,
                currentBoard: currentBoard
            };

            deferred.resolve(resp);
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
        return {
            currentBoard: currentBoard,
            currentBoardID: currentBoardID,
            filteredTasks: filteredTasks
        }
    }

    return ({
        setCurrentBoard: setCurrentBoard,
        getCurrentBoard: getCurrentBoard,
        retrieveItems: retrieveItems,
        changeBoard: changeBoard
    })
}]);