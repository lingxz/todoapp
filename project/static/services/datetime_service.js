/**
 * Created by mark on 8/22/16.
 */
angular.module('todoApp').factory('DatetimeService', [function () {
    var cur_pos = null;
    var cur_task = null;

    function getCursorPos() {
        return cur_pos
    }

    function setCursorPos(cursor, task_id) {
        cur_pos = cursor;
        cur_task = task_id;
    }

    function getCurTask() {
        return cur_task
    }

    return {
        getCursorPos: getCursorPos,
        setCursorPos: setCursorPos,
        getCurTask: getCurTask
    }

}]);