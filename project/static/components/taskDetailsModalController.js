todoApp.controller('taskDetailsModalController', function ($scope,
                                                           $uibModalInstance,
                                                           TaskService,
                                                           DatetimeService,
                                                           task,
                                                           subtasks) {

    $scope.task = task;
    $scope.subtasks = subtasks;

    $scope.isFlipped = true;

    $scope.flipCard = function () {
        console.log('flipcard');
        $scope.isFlipped = !$scope.isFlipped
    };

    $scope.scrollBarsConfig = {
        autoHideScrollbar: false,
        theme: 'minimal-dark',
        advanced: {
            updateOnContentResize: true
        },
        scrollInertia: 50
    };

    $scope.close = function () {
        $uibModalInstance.close($scope.subtasks)
    };

    $scope.getSubTasks = function () {
        var promise = TaskService.getDirectSubTasks(task.id);
        promise.then(function (data) {
            $scope.subtasks = data
        })
    };

    $scope.addSubTask = function () {
        if ($scope.newSubTask === "" || $scope.newSubTask === undefined) {
            return
        }
        var promise = TaskService.addSubTask(task.id, $scope.newSubTask);
        promise.then(function (data) {
            console.log(data);
            $scope.$emit('refresh');
            $scope.newSubTask = "";
        })
    };

    $scope.markAsDone = function () {
        promise = TaskService.markAsDone(task);
        promise.then(function (data) {
            task.done = data.done
        });
    };

    $scope.callDateTimePicker = function (event) {
        var el = event.target;
        var viewportOffset = el.getBoundingClientRect();
        var left = viewportOffset.left;
        var top = viewportOffset.top;
        var bottom = viewportOffset.bottom;
        if (top < window.innerHeight / 2) { // button in top half of window
            cur_pos = [left - 330, bottom - 70]
        } else {
            cur_pos = [left - 330, top - 330]
        }
        DatetimeService.setCursorPos(cur_pos, task.id);
    };

    $scope.$on('refresh', function () {
        $scope.getSubTasks()
    })

});

