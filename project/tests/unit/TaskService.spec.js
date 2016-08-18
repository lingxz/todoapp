describe('TaskService', function () {

    var TaskService,
        $httpBackend,
        AuthService,
        $q;

    beforeEach(module('templates'));
    beforeEach(module('todoApp'));

    beforeEach(inject(function (_TaskService_, _$httpBackend_, _AuthService_, _$q_) {
        TaskService = _TaskService_;
        $httpBackend = _$httpBackend_;
        AuthService = _AuthService_;
        $q = _$q_;
        spyOn(AuthService, 'getHeaders').and.returnValue({Authorization: 'xxx'});
        spyOn(AuthService, 'getCurrentUserID').and.returnValue(5);
    }));

    describe('set and get current task functions', function () {
        it('should set the current task correctly', function () {
            expect(TaskService.getCurrentTask()).toBe(null);
            TaskService.setCurrentTask('xxx');
            expect(TaskService.getCurrentTask()).toBe('xxx');
        })
    });

    describe('addTask function', function () {

        it('should exist', function () {
            expect(angular.isFunction(TaskService.addTask)).toBe(true)
        });
        
        it('should send task data to the server', function () {
            var content = "content";
            var task = {id: 3};

            expectedData = {
                content: content,
                user_id: 5,
                prev_task: task.id
            };

            $httpBackend.expectPOST('/add', expectedData).respond(201, '');
            TaskService.addTask(task, content);
            $httpBackend.flush();
        });

        // this is not really unitary since it's checking data and headers at once
        it('should send correct auth headers', function () {
            var content = "content";
            var task = {id: 3};

            expectedData = {
                content: content,
                user_id: 5,
                prev_task: task.id
            };

            $httpBackend.expectPOST('/add', expectedData, function (headers) {
                return headers.Authorization === 'xxx'
            }).respond(201, '');

            TaskService.addTask(task, content);
            $httpBackend.flush()
        });

        it('content should default to empty string if not provided', function () {

            var task = {id: 3};

            expectedData = {
                content: "",
                user_id: 5,
                prev_task: task.id
            };

            $httpBackend.expectPOST('/add', expectedData).respond(201, '');
            TaskService.addTask(task);
            $httpBackend.flush()
        });

        it('should resolve promise when request is successful', function () {
            var task = {id: 3};
            $httpBackend.whenPOST('/add').respond(201, '');
            promise = TaskService.addTask(task);

            var result = null;
            promise.then(function () {
                result = 'resolved'
            }, function (error) {
                result = 'rejected'
            });
            $httpBackend.flush();
            expect(result).toBe('resolved')
        });

        it('should reject promise when request fails', function () {
            var task = {id: 3};
            $httpBackend.whenPOST('/add').respond(500, '');
            promise = TaskService.addTask(task);

            var result = null;
            promise.then(function () {
                result = 'resolved'
            }, function (error) {
                result = 'rejected'
            });
            $httpBackend.flush();
            expect(result).toBe('rejected')
        })
    });

    describe('removeDate function', function () {

        it('should exist', function () {
            expect(angular.isFunction(TaskService.removeDate)).toBe(true)
        });

        it('should send task data to the server', function () {
            var task = {id: 3, another: 'bla'};
            var expectedData = {id: 3};

            $httpBackend.expectPOST('/remove_date', expectedData).respond(201, '');
            TaskService.removeDate(task);
            $httpBackend.flush();
        });

        it('should send correct auth headers', function () {
            var task = {id: 3, another: 'bla'};
            var expectedData = {id: 3};

            $httpBackend.expectPOST('/remove_date', expectedData, function (headers) {
                return headers.Authorization === 'xxx'
            }).respond(201, '');

            TaskService.removeDate(task);
            $httpBackend.flush()
        });

        it('should resolve promise when request is successful', function () {
            var task = {id: 3, another: 'bla'};
            $httpBackend.whenPOST('/remove_date').respond(201, '');
            promise = TaskService.removeDate(task);

            var result = null;
            promise.then(function () {
                result = 'resolved'
            }, function (error) {
                result = 'rejected'
            });
            $httpBackend.flush();
            expect(result).toBe('resolved')
        });

        it('should reject promise when request fails', function () {
            var task = {id: 3, another: 'bla'};
            $httpBackend.whenPOST('/remove_date').respond(500, '');
            promise = TaskService.removeDate(task);

            var result = null;
            promise.then(function () {
                result = 'resolved'
            }, function (error) {
                result = 'rejected'
            });
            $httpBackend.flush();
            expect(result).toBe('rejected')
        })
    });

    describe('editTask function', function () {

        it('should exist', function () {
            expect(angular.isFunction(TaskService.editTask)).toBe(true)
        });

        it('should send task data to the server', function () {
            var task = {id: 3, another: 'bla'};
            var content = 'content';
            var expectedData = {id: task.id, content: content};

            $httpBackend.expectPOST('/edit_task', expectedData).respond(201, '');
            TaskService.editTask(task, content);
            $httpBackend.flush();
        });

        it('should send correct auth headers', function () {

            var task = {id: 3, another: 'bla'};
            var content = 'content';
            var expectedData = {id: task.id, content: content};

            $httpBackend.expectPOST('/edit_task', expectedData, function (headers) {
                return headers.Authorization === 'xxx'
            }).respond(201, '');
            TaskService.editTask(task, content);
            $httpBackend.flush();
        });
    });

    describe('retrieveItems function', function () {

        var expectedData = {user_id: 5};

        it('should exist', function () {
            expect(angular.isFunction(TaskService.retrieveItems)).toBe(true)
        });

        it('should send user data to the server', function () {
            $httpBackend.expectPOST('/retrieve_tasks', expectedData).respond(201, '');
            TaskService.retrieveItems();
            $httpBackend.flush();
        });

        it('should send correct auth headers', function () {
            $httpBackend.expectPOST('/retrieve_tasks', expectedData, function (headers) {
                return headers.Authorization === 'xxx'
            }).respond(201, '');
            TaskService.retrieveItems();
            $httpBackend.flush();
        });

        it('should resolve promise with data when request is successful', function () {
            var data = 'data';
            $httpBackend.whenPOST('/retrieve_tasks').respond(201, data);
            promise = TaskService.retrieveItems();
            var result = null;
            promise.then(function (data) {
                result = data
            }, function (error) {
                result = 'rejected'
            });
            $httpBackend.flush();
            expect(result).toBe(data)
        });

        it('should reject promise when request fails', function () {
            $httpBackend.whenPOST('/retrieve_tasks').respond(500, '');
            promise = TaskService.retrieveItems();
            var result = null;
            promise.then(function () {
                result = 'resolved'
            }, function (error) {
                result = 'rejected'
            });
            $httpBackend.flush();
            expect(result).toBe('rejected')
        });
    });

    describe('deleteTask function', function () {

        var task = {id: 3, another: 'bla'};
        var expectedData = {user_id: 5, id: 3};

        it('should exist', function () {
            expect(angular.isFunction(TaskService.deleteTask)).toBe(true)
        });

        it('should send user and task data to the server', function () {
            $httpBackend.expectPOST('/delete_task', expectedData).respond(201, '');
            TaskService.deleteTask(task);
            $httpBackend.flush();
        });

        it('should send correct auth headers', function () {
            $httpBackend.expectPOST('/delete_task', expectedData, function (headers) {
                return headers.Authorization === 'xxx'
            }).respond(201, '');
            TaskService.deleteTask(task);
            $httpBackend.flush();
        });

        it('should resolve promise when request is successful', function () {
            $httpBackend.whenPOST('/delete_task').respond(201, '');
            promise = TaskService.deleteTask(task);

            var result = null;
            promise.then(function (response) {
                result = 'resolved'
            }, function (error) {
                result = 'rejected'
            });
            $httpBackend.flush();
            expect(result).toBe('resolved')
        });

        it('should reject promise when request fails', function () {
            $httpBackend.whenPOST('/delete_task').respond(500, '');
            promise = TaskService.deleteTask(task);

            var result = null;
            promise.then(function (response) {
                result = 'resolved'
            }, function (error) {
                result = 'rejected'
            });
            $httpBackend.flush();
            expect(result).toBe('rejected')
        });
    });

    describe('getPrevSibling function', function () {
        var task = {id: 3, another: 'bla'};
        var expectedData = {user_id: 5, task_id: 3};

        it('should exist', function () {
            expect(angular.isFunction(TaskService.getPrevSibling)).toBe(true)
        });

        it('should send user and task data to the server', function () {
            $httpBackend.expectPOST('/get_prev_sibling', expectedData).respond(201, '');
            TaskService.getPrevSibling(task);
            $httpBackend.flush();
        });

        it('should send correct auth headers', function () {
            $httpBackend.expectPOST('/get_prev_sibling', expectedData, function (headers) {
                return headers.Authorization === 'xxx'
            }).respond(201, '');
            TaskService.getPrevSibling(task);
            $httpBackend.flush();
        });

        it('should resolve promise with data when request is successful', function () {
            var data = 'data';
            $httpBackend.whenPOST('/get_prev_sibling').respond(201, data);
            promise = TaskService.getPrevSibling(task);
            var result = null;
            promise.then(function (data) {
                result = data
            }, function (error) {
                result = 'rejected'
            });
            $httpBackend.flush();
            expect(result).toBe(data)
        });

        it('should reject promise when request fails', function () {
            $httpBackend.whenPOST('/get_prev_sibling').respond(500, '');
            promise = TaskService.getPrevSibling(task);
            var result = null;
            promise.then(function (response) {
                result = 'resolved'
            }, function (error) {
                result = 'rejected'
            });
            $httpBackend.flush();
            expect(result).toBe('rejected')
        });
    });

    describe('makeSubTask function', function () {
        var task = {id: 3, another: 'bla'};
        var prev_sibling_id = 12;
        var expectedData = {
            user_id: 5,
            prev_task_id: prev_sibling_id,
            subtask_id: task.id};

        it('should exist', function () {
            expect(angular.isFunction(TaskService.makeSubTask)).toBe(true)
        });

        it('should send user and task data to the server', function () {
            $httpBackend.expectPOST('/make_subtask', expectedData).respond(201, '');
            TaskService.makeSubTask(task, prev_sibling_id);
            $httpBackend.flush();
        });

        it('should send correct auth headers', function () {
            $httpBackend.expectPOST('/make_subtask', expectedData, function (headers) {
                return headers.Authorization === 'xxx'
            }).respond(201, '');
            TaskService.makeSubTask(task, prev_sibling_id);
            $httpBackend.flush();
        });

        it('should resolve promise when request is successful', function () {
            $httpBackend.whenPOST('/make_subtask').respond(201, '');
            promise = TaskService.makeSubTask(task, prev_sibling_id);

            var result = null;
            promise.then(function (response) {
                result = 'resolved'
            }, function (error) {
                result = 'rejected'
            });
            $httpBackend.flush();
            expect(result).toBe('resolved')
        });

        it('should reject promise when request fails', function () {
            $httpBackend.whenPOST('/make_subtask').respond(500, '');
            promise = TaskService.makeSubTask(task, prev_sibling_id);

            var result = null;
            promise.then(function (response) {
                result = 'resolved'
            }, function (error) {
                result = 'rejected'
            });
            $httpBackend.flush();
            expect(result).toBe('rejected')
        });
    });

    describe('markAsDone function', function () {
        var task = {id: 3, another: 'bla'};
        var expectedData = {id: task.id};

        it('should exist', function () {
            expect(angular.isFunction(TaskService.markAsDone)).toBe(true)
        });

        it('should send task data to the server', function () {
            $httpBackend.expectPOST('/markdone', expectedData).respond(201, '');
            TaskService.markAsDone(task);
            $httpBackend.flush();
        });

        it('should send correct auth headers', function () {
            $httpBackend.expectPOST('/markdone', expectedData, function (headers) {
                return headers.Authorization === 'xxx'
            }).respond(201, '');
            TaskService.markAsDone(task);
            $httpBackend.flush();
        });

        it('should resolve promise with data when request is successful', function () {
            var data = 'data';
            $httpBackend.whenPOST('/markdone').respond(201, data);
            promise = TaskService.markAsDone(task);

            var result = null;
            promise.then(function (data) {
                result = data
            }, function (error) {
                result = 'rejected'
            });
            $httpBackend.flush();
            expect(result).toBe(data)
        });

        it('should reject promise when request is successful', function () {
            $httpBackend.whenPOST('/markdone').respond(500, '');
            promise = TaskService.markAsDone(task);

            var result = null;
            promise.then(function (response) {
                result = 'resolved'
            }, function (error) {
                result = 'rejected'
            });
            $httpBackend.flush();
            expect(result).toBe('rejected')
        });
    });

    describe('editDate function', function () {
        var task_id = 3;
        var due_date = new Date();
        var expectedData = {id: task_id, date: due_date.toString()};

        it('should exist', function () {
            expect(angular.isFunction(TaskService.editDate)).toBe(true)
        });

        it('should send task data and due date to the server', function () {
            $httpBackend.expectPOST('/edit_date', expectedData).respond(201, '');
            TaskService.editDate(task_id, due_date);
            $httpBackend.flush();
        });

        it('should send correct auth headers', function () {
            $httpBackend.expectPOST('/edit_date', expectedData, function (headers) {
                return headers.Authorization === 'xxx'
            }).respond(201, '');
            TaskService.editDate(task_id, due_date);
            $httpBackend.flush();
        });

        it('should resolve promise when request is successful', function () {
            $httpBackend.whenPOST('/edit_date').respond(201, '');
            promise = TaskService.editDate(task_id, due_date);

            var result = null;
            promise.then(function (response) {
                result = 'resolved'
            }, function (error) {
                result = 'rejected'
            });
            $httpBackend.flush();
            expect(result).toBe('resolved')
        });

        it('should reject promise when request fails', function () {
            $httpBackend.whenPOST('/edit_date').respond(500, '');
            promise = TaskService.editDate(task_id, due_date);

            var result = null;
            promise.then(function (response) {
                result = 'resolved'
            }, function (error) {
                result = 'rejected'
            });
            $httpBackend.flush();
            expect(result).toBe('rejected')
        });
    })
});