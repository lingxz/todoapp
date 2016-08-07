describe('dateTimeBoxController', function () {
    var scope,
        $controller,
        $rootScope,
        $q,
        TaskService,
        DatetimeService,
        TASK_EVENTS,
        task,
        ctrl;

    beforeEach(module('templates'));
    beforeEach(module('todoApp'));

    beforeEach(inject(function (_$controller_, _$rootScope_, _$q_, _TaskService_, _DatetimeService_, _TASK_EVENTS_) {
        $controller = _$controller_;
        $rootScope = _$rootScope_;
        $q = _$q_;
        TaskService = _TaskService_;
        DatetimeService = _DatetimeService_;
        TASK_EVENTS = _TASK_EVENTS_;
        scope = $rootScope.$new();

        task = {content: 'content', done: false, due_date: 'some_date'};
        var bindings = {task: task};

        ctrl = $controller('dateTimeBoxController as ctrl', {
            $scope: scope
        });

        spyOn(DatetimeService, 'getCurTask').and.returnValue(3);
        spyOn(DatetimeService, 'getCursorPos').and.returnValue(5);
    }));
    
    describe('setDate function', function () {
        
        it('should exist', function () {
            expect(angular.isFunction(scope.setDate)).toBe(true)
        });
        
        it('should call the editDate function from TaskService with the correct arguments', function () {
            var newDate = new Date();
            var deferred = $q.defer();
            spyOn(TaskService, 'editDate').and.returnValue(deferred.promise);
            scope.setDate(3, newDate);
            expect(TaskService.editDate).toHaveBeenCalled();
            expect(TaskService.editDate).toHaveBeenCalledWith(3, newDate)
        });

        it('should emit refreshTaskList event when promise is resolved', function () {
            var newDate = new Date();
            var deferred = $q.defer();
            spyOn(TaskService, 'editDate').and.returnValue(deferred.promise);
            spyOn(scope, '$emit');
            scope.setDate(3, newDate);
            deferred.resolve();
            scope.$digest();
            expect(scope.$emit).toHaveBeenCalledWith(TASK_EVENTS.refreshTaskList)
        });

        it('should not emit event if promise is rejected', function () {
            var newDate = new Date();
            var deferred = $q.defer();
            spyOn(TaskService, 'editDate').and.returnValue(deferred.promise);
            spyOn(scope, '$emit');
            scope.setDate(3, newDate);
            deferred.reject();
            scope.$digest();
            expect(scope.$emit).not.toHaveBeenCalled()
        })
    })
});