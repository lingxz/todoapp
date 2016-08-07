describe('TaskController', function () {

    var scope,
        $controller,
        $rootScope,
        $q,
        TaskService,
        AuthService,
        task,
        ctrl;

    beforeEach(module('templates'));
    beforeEach(module('todoApp'));

    beforeEach(inject(function (_$controller_, _$rootScope_, _$q_, _TaskService_, _AuthService_) {
        $controller = _$controller_;
        $rootScope = _$rootScope_;
        $q = _$q_;
        TaskService = _TaskService_;
        AuthService = _AuthService_;
        scope = $rootScope.$new();

        task = {content: 'content', done: false, due_date: 'some_date'};
        var bindings = {task: task};

        ctrl = $controller('TaskController as ctrl', {$scope: scope}, bindings);
    }));

    it('should expose the task', function () {
        expect(scope.ctrl.task).toEqual(task)
    });

    describe('markAsDone function', function () {

        it('should exist', function () {
            expect(angular.isFunction(scope.markAsDone)).toBe(true)
        });

        it('should call the markAsDone function from TaskService with correct arguments', function () {
            var deferred = $q.defer();
            spyOn(TaskService, 'markAsDone').and.returnValue(deferred.promise);
            scope.markAsDone();
            expect(TaskService.markAsDone).toHaveBeenCalled();
            expect(TaskService.markAsDone).toHaveBeenCalledWith(task)
        });

        it('should set the task done data when promise is resolved', function () {
            var deferred = $q.defer();
            spyOn(TaskService, 'markAsDone').and.returnValue(deferred.promise);
            scope.markAsDone();
            deferred.resolve({done: true});
            scope.$digest();
            expect(scope.ctrl.task.done).toBe(true)
        });

        it('should not do anything when promise is rejected', function () {
            var deferred = $q.defer();
            spyOn(TaskService, 'markAsDone').and.returnValue(deferred.promise);
            scope.markAsDone();
            deferred.reject();
            scope.$digest();
            expect(scope.ctrl.task.done).toBe(false)
        })
    });

    describe('removeDate function', function () {

        it('should exist', function () {
            expect(angular.isFunction(scope.markAsDone)).toBe(true)
        });

        it('should call the removeDate function from TaskService with correct arguments', function () {
            var deferred = $q.defer();
            spyOn(TaskService, 'removeDate').and.returnValue(deferred.promise);
            scope.removeDate();
            expect(TaskService.removeDate).toHaveBeenCalled();
            expect(TaskService.removeDate).toHaveBeenCalledWith(task)
        });

        it('should set the due_date of the task to null when promise is resolved', function () {
            var deferred = $q.defer();
            spyOn(TaskService, 'removeDate').and.returnValue(deferred.promise);
            scope.removeDate();
            deferred.resolve();
            scope.$digest();
            expect(scope.ctrl.task.due_date).toBe(null)
        });

        it('should not change the due_date of the task when promise is rejected', function () {
            var deferred = $q.defer();
            spyOn(TaskService, 'removeDate').and.returnValue(deferred.promise);
            scope.removeDate();
            deferred.reject();
            scope.$digest();
            expect(scope.ctrl.task.due_date).toBe(task.due_date)
        })
    });
});