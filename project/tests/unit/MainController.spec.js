describe('mainController', function () {

    var scope,
        $rootScope,
        $controller,
        $q,
        TaskService,
        TASK_EVENTS,
        AuthService,
        deferred,
        createController;

    beforeEach(module('templates'));
    beforeEach(module('todoApp'));

    beforeEach(inject(function (_$controller_, _$rootScope_, _$q_, _TaskService_, _TASK_EVENTS_, _AuthService_) {
        $rootScope = _$rootScope_;
        $controller = _$controller_;
        scope = $rootScope.$new();
        $q = _$q_;
        TaskService = _TaskService_;
        TASK_EVENTS = _TASK_EVENTS_;
        AuthService = _AuthService_;
        createController = function () {
            return $controller('mainController', {
                '$scope': scope
            })
        };

        // spy on the function that is always called on initialization so that it doesn't call through
        deferred = $q.defer();
        spyOn(TaskService, 'retrieveItems').and.returnValue(deferred.promise)

    }));

    it('should set newtask to empty string on initialization', function () {
        controller = createController();
        expect(scope.newtask).toBe("")
    });

    describe('retrieveItems function', function () {

        it('should exist', function () {
            var controller = createController();
            expect(angular.isFunction(scope.retrieveItems)).toBe(true)
        });

        it('should call the retrieveItems function from TaskService on initialization', function () {
            var controller = createController();
            expect(TaskService.retrieveItems).toHaveBeenCalled();
        });

        it('should set tasks in the scope', function () {
            controller = createController();
            scope.retrieveItems();
            deferred.resolve('more_tasks');
            scope.$digest();
            expect(scope.tasks).toBe('more_tasks')
        })
    });
    
    describe('makeSubTask function', function () {

        it('should exist', function () {
            var controller = createController();
            expect(angular.isFunction(scope.makeSubTask)).toBe(true)
        });

        it('should call the getPrevSibling task function with correct argument', function () {
            var deferred = $q.defer();
            spyOn(TaskService, 'getPrevSibling').and.returnValue(deferred.promise);
            var controller = createController();
            scope.makeSubTask('some_task');
            expect(TaskService.getPrevSibling).toHaveBeenCalled();
            expect(TaskService.getPrevSibling).toHaveBeenCalledWith('some_task')
        });

        it('should call the makeSubTask function from task service when promise from getPrevSibling is resolved', function () {
            var deferred = $q.defer();
            spyOn(TaskService, 'getPrevSibling').and.returnValue(deferred.promise);

            var deferred2 = $q.defer();
            spyOn(TaskService, 'makeSubTask').and.returnValue(deferred2.promise);

            var controller = createController();
            scope.makeSubTask('some_task');
            deferred.resolve({id: 'some_id'});
            scope.$digest();

            expect(TaskService.makeSubTask).toHaveBeenCalled();
            expect(TaskService.makeSubTask).toHaveBeenCalledWith('some_task', 'some_id')
        });

        it('should not call makeSubTask function if promise is not resolved', function () {
            var deferred = $q.defer();
            spyOn(TaskService, 'getPrevSibling').and.returnValue(deferred.promise);

            var deferred2 = $q.defer();
            spyOn(TaskService, 'makeSubTask').and.returnValue(deferred2.promise);

            var controller = createController();
            scope.makeSubTask('some_task');
            deferred.reject();
            scope.$digest();

            expect(TaskService.makeSubTask).not.toHaveBeenCalled();
        });

        it('should emit refreshTaskList event when second promise is resolved', function () {
            var deferred = $q.defer();
            spyOn(TaskService, 'getPrevSibling').and.returnValue(deferred.promise);

            var deferred2 = $q.defer();
            spyOn(TaskService, 'makeSubTask').and.returnValue(deferred2.promise);

            var controller = createController();
            spyOn(scope, '$emit');

            scope.makeSubTask('some_task');
            deferred.resolve({id: 'some_id'});
            deferred2.resolve();
            scope.$digest();
            expect(scope.$emit).toHaveBeenCalled();
            expect(scope.$emit).toHaveBeenCalledWith(TASK_EVENTS.refreshTaskList)
        });

        it('should not emit refreshTaskList event if second promise is not resolved', function () {
            var deferred = $q.defer();
            spyOn(TaskService, 'getPrevSibling').and.returnValue(deferred.promise);

            var deferred2 = $q.defer();
            spyOn(TaskService, 'makeSubTask').and.returnValue(deferred2.promise);

            var controller = createController();
            spyOn(scope, '$emit');

            scope.makeSubTask('some_task');
            deferred.resolve({id: 'some_id'});
            deferred2.reject();
            scope.$digest();
            expect(scope.$emit).not.toHaveBeenCalled();
        })
    });

    describe('Testing $watch expressions', function () {

        it('should update current task when the current task variable in TaskService is changed', function () {
            var controller = createController();
            TaskService.setCurrentTask('bla');
            scope.$digest();
            expect(scope.currentTask).toBe('bla');

            TaskService.setCurrentTask('sth else');
            scope.$digest();
            expect(scope.currentTask).toBe('sth else');
        });

        it('should update user preference when user preference in AuthService is changed', function () {
            var controller = createController();
            AuthService.setShowTaskPref(true);
            scope.$digest();
            expect(scope.showCompleted).toBe(true);

            AuthService.setShowTaskPref(false);
            scope.$digest();
            expect(scope.showCompleted).toBe(false);
        })
    })
});
