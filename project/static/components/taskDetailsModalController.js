todoApp.controller('taskDetailsModalController', function ($scope, $uibModalInstance, TaskService, task, subtasks) {

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

    $scope.$on('refresh', function () {
        $scope.getSubTasks()
    })

});

