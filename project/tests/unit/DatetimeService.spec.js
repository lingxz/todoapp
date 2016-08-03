describe('DatetimeService', function () {

    var DatetimeService;


    beforeEach(module('todoApp'));

    beforeEach(inject(function(_DatetimeService_){
        DatetimeService = _DatetimeService_;
    }));

    it('should have getCursorPos function', function () {
        expect(angular.isFunction(DatetimeService.getCursorPos)).toBe(true);
    });

    it('should get cursor position when getCursorPos is called', function () {
        var cur_pos = 12;
        var cur_task = 5;
        DatetimeService.setCursorPos(cur_pos, cur_task);
        expect(DatetimeService.getCursorPos()).toEqual(12);
    });

    it('should get current task when getCurTask is called', function () {
        var cur_pos = 12;
        var cur_task = 5;
        DatetimeService.setCursorPos(cur_pos, cur_task);
        expect(DatetimeService.getCurTask()).toEqual(5);
    });

});