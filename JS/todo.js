var todo = angular.module('toDoList', []);
todo.controller('toDoCtrl', function($scope) {
    $scope.todos = []
    $scope.completed = false;

    $scope.addTask = function() {
        if ($scope.formTodoInput) {
            $scope.todos.push({text:$scope.formTodoInput, status:false});
            $scope.formTodoInput = '';
            $('#myInput').focus();
        };
    };
    $scope.checkTasks = function() {
        var tasks = $('.list-group li').length;
        var show = false;
        if (tasks >= 1) {show = true;};
        return show
    };
    $scope.checkCompletedTasks = function() {
        if ($('.list-group-item-success').length >= 1) {
            completed = false;
        } else {
            completed = true;
        };
        return completed
    };
});
todo.directive('taskLi', function(){
    return {
        restrict: 'E',
        template: '<li class="list-group-item" ng-repeat="todo in todos" toggle-complete>{{todo.text}}</li>'
    };
});
todo.directive('toggleComplete', function(){
    return {
        restrict: 'A',
        link: function(scope, el, attrs) {
            var status
            el.on('click', function(){
                $(this).toggleClass('list-group-item-success');
                status = scope.checkCompletedTasks()
                $('#clearComplete').prop('disabled', status);
            });
        }
    };
});
todo.directive('clearSelected', function() {
    return {
        restrict: 'A',
        link: function(scope, el, attrs) {
            el.on('click', function() {
                var items = $('.list-group-item-success');
                items.each(function(taskIndex) {
                    var taskName = $(this).text();
                    scope.todos.forEach(function(obj, objIndex) {
                        if (taskName === obj.text) {
                            scope.todos.splice(objIndex, 1);
                        };
                    });
                });
                items.remove();
                status = scope.checkCompletedTasks()
                $('#clearComplete').prop('disabled', status);
            });
        }
    }
});
todo.directive('clearAll', function() {
    return {
        restrict: 'A',
        link: function(scope, el, attrs) {
            el.on('click', function() {
                var items = '.list-group-item';
                $(items).remove();
                $('#clearAll').prop('disabled', true)
                scope.todos = []
            });
        }
    }
});
// todo.directive('updateProgress', function() {
//     return {
//         restrict: 'A',
//         link: function(scope, el, attrs) {
//             scope.$watch('onChange' function() {
//                 $('#todo-list');
//             });
//             var pendingTasks = $('.list-group-item').not('.list-group-item-success').length;
//             var completedTasks = $('.list-group-item-success').length;
//
//             progress = (completedTasks / (pendingTasks + completedTasks)) * 100
//             if (progress) {
//                 var taskList = $('#todo-list').on('change', function(){
//                     $('#banner').html("Progress...");
//                     // $('.progress').show();
//                     $('.progress-bar').attr('aria-valuemax', pendingTasks + completedTasks);
//                     $('.progress-bar').attr('aria-valuenow', completedTasks);
//                     $('.progress-bar').css('width',  progress + '%');
//                     $('.progress-bar').html(Math.round(progress * 10) / 10 + '%');
//                 });
//             };
//         }
//     };
// });

// $scope.updateStatusBar =  function() {
//     var pendingTasks = $('.list-group-item').not('.list-group-item-success').length;
//     var completedTasks = $('.list-group-item-success').length;
//
//     console.log("pending:" + pendingTasks + "completed:" + completedTasks);
//
//     progress = (completedTasks / (pendingTasks + completedTasks)) * 100
//     console.log("progress:" + progress);
//     if (progress) {
//         $('#banner').html("Progress...");
//         // $('.progress').show();
//         $('.progress-bar').attr('aria-valuemax', pendingTasks + completedTasks);
//         $('.progress-bar').attr('aria-valuenow', completedTasks);
//         $('.progress-bar').css('width',  progress + '%');
//         $('.progress-bar').html(Math.round(progress * 10) / 10 + '%');
//     };
// };
