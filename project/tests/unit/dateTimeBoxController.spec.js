describe('dateTimeBoxController', function () {
    var scope,
        $controller,
        $rootScope,
        $q,
        TaskService,
        DatetimeService,
        TASK_EVENTS,
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

        ctrl = $controller('dateTimeBoxController as ctrl', {
            $scope: scope
        });

        spyOn(DatetimeService, 'getCurTask').and.returnValue(3);
        spyOn(DatetimeService, 'getCursorPos').and.returnValue([23, 54]);
    }));

    it('should initialize with scope.visibility as hidden', function () {
        expect(scope.visibility).toBe('hidden')
    });
    
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
    });

    describe('showBox function', function () {
        
        it('should exist', function () {
            expect(angular.isFunction(scope.showBox)).toBe(true)
        });
        
        it('should set visibility to show and set posx and posy correctly', function () {
            scope.showBox([23, 54]);
            expect(scope.visibility).toBe('show');
            expect(scope.posx).toBe(23);
            expect(scope.posy).toBe(54)
        });
    });

    describe('closeBox function', function () {

        it('should exist', function () {
            expect(angular.isFunction(scope.closeBox)).toBe(true)
        });

        it('should set visibility to hidden', function () {
            scope.closeBox();
            expect(scope.visibility).toBe('hidden')
        })
    });
    
    describe('watchers', function () {
        
        it('should close the box and set the time when a time is selected', function () {
            spyOn(scope, 'closeBox');
            spyOn(scope, 'setDate');
            scope.chosenTime = 'some_time';
            scope.cur_task = 'some_task';
            scope.$digest();
            expect(scope.closeBox).toHaveBeenCalled();
            expect(scope.setDate).toHaveBeenCalled();
            expect(scope.setDate).toHaveBeenCalledWith('some_task', 'some_time');
        });
        
        it('should call showBox and set cur_task accordingly when getCursorPos of DatetimeService changes and visibility is hidden', function () {
            DatetimeService.getCursorPos.calls.reset();
            DatetimeService.setCursorPos([31, 20]);
            spyOn(scope, 'showBox');
            scope.visibility = 'hidden';
            expect(scope.cur_task).toBe(null);
            scope.$digest();
            expect(scope.showBox).toHaveBeenCalled();
            expect(scope.cur_task).toBe(3)
        });

        it('should call closebox when getCursorPos of DatetimeService changes and visibility is show', function () {
            DatetimeService.getCursorPos.calls.reset();
            DatetimeService.setCursorPos([31, 20]);
            scope.cur_task = 3
            spyOn(scope, 'closeBox');
            scope.visibility = 'show';
            scope.$digest();
            expect(scope.closeBox).toHaveBeenCalled();
        })
    })
});