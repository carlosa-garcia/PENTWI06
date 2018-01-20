var todo = angular.module('toDoList', []);
todo.controller('toDoCtrl', function($scope, $timeout) {
    $scope.todos = []

    $scope.addTask = function() {
        if ($scope.formTodoInput) {
            if ($scope.todos.indexOf($scope.formTodoInput) == -1) {
                $scope.todos.push($scope.formTodoInput);
                $scope.formTodoInput = '';
                $timeout(function() {
                    application.refresh();
                })
            };
        };
    };
});
todo.directive('taskLi', function(){
    return {
        restrict: 'E',
        template: '<li class="list-group-item" ng-repeat="todo in todos" toggle-complete>{{todo}}</li>'
    };
});
todo.directive('toggleComplete', function($timeout){
    return {
        restrict: 'A',
        link: function(scope, el, attrs) {
            $timeout(function() {
                var status
                el.on('click', function(){
                    $(this).toggleClass('list-group-item-success');
                    $('#myInput').focus();
                    scope.tasksDone = $('.list-group-item-success').length;
                    application.refresh();
                });
            });
        }
    };
});
todo.directive('clearSelected', function($timeout) {
    return {
        restrict: 'A',
        link: function(scope, el, attrs) {
            el.on('click', function() {
                var completedTasks = $('.list-group-item-success');
                completedTasks.each(function(taskIndex) {
                    var taskName = $(this).text();
                    scope.todos.forEach(function(obj, objIndex) {
                        if (taskName === obj) {
                            scope.todos.splice(objIndex, 1);
                        };
                    });
                });
                scope.tasksDone = completedTasks.length
                completedTasks.remove();
                $('#myInput').focus();
                $timeout(function(){
                    application.refresh();
                })
            });
        }
    }
});
todo.directive('clearAll', function($timeout) {
    return {
        restrict: 'A',
        link: function(scope, el, attrs) {
            el.on('click', function() {
                var items = '.list-group-item';
                $(items).remove();
                scope.todos = []
                scope.tasksDone = 0
                $('#myInput').focus();
                $timeout(function(){
                    application.refresh();
                })
            });
        }
    }
});
