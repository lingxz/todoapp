describe('mainController', function () {

    var scope,
        $rootScope,
        $controller,
        $q,
        TaskService,
        createController;

    beforeEach(module('templates'));
    beforeEach(module('todoApp'));

    beforeEach(inject(function (_$controller_, _$rootScope_, _$q_, _TaskService_) {
        $rootScope = _$rootScope_;
        $controller = _$controller_;
        scope = $rootScope.$new();
        $q = _$q_;
        TaskService = _TaskService_;
        createController = function () {
            return $controller('mainController', {
                '$scope': scope
            })
        }
    }));

    it('should set newtask to empty string on initialization', function () {
        controller = createController();
        expect(scope.newtask).toBe("")
    });

    it('should retrieve tasks on initialization', function () {
        var deferred = $q.defer();
        spyOn(TaskService, 'retrieveItems').and.returnValue(deferred.promise);
        var controller = createController();
        deferred.resolve('some_tasks');
        $rootScope.$digest();
        expect(scope.tasks).toBe('some_tasks')
    });

    describe('retrieveItems function', function () {

        it('should exist', function () {
            var controller = createController();
            expect(angular.isFunction(scope.retrieveItems)).toBe(true)
        });

        it('should call the retrieveItems function from TaskService', function () {
            var deferred = $q.defer();
            spyOn(TaskService, 'retrieveItems').and.returnValue(deferred.promise);
            var controller = createController();
            expect(TaskService.retrieveItems).toHaveBeenCalled();
        });

        it('should set tasks in the scope', function () {
            var deferred = $q.defer();
            spyOn(TaskService, 'retrieveItems').and.returnValue(deferred.promise);
            controller = createController();
            scope.retrieveItems();
            deferred.resolve('more_tasks');
            $rootScope.$digest();
            expect(scope.tasks).toBe('more_tasks')
        })
    })

});