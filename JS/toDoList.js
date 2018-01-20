var todo = angular.module('toDoList', []);
todo.controller('toDoCtrl', function($scope) {
    $scope.todos = []
    $scope.tasksDone = 0

    $scope.addTask = function() {
        if ($scope.formTodoInput) {
            if ($scope.todos.indexOf($scope.formTodoInput) == -1) {
                $scope.todos.push($scope.formTodoInput);
            };
            $scope.formTodoInput = '';
            $('#myInput').focus();
            $('#clearAll').prop('disabled', false);
            // FIXME: add 1 teask completed add another, error occurs use directive update-list
        };
    };
});
todo.directive('updateList', function(){
    
});
todo.directive('taskLi', function(){
    return {
        restrict: 'E',
        template: '<li class="list-group-item" ng-repeat="todo in todos" toggle-complete>{{todo}}</li>'
    };
});
todo.directive('toggleComplete', function(){
    return {
        restrict: 'A',
        link: function(scope, el, attrs) {
            var status
            el.on('click', function(){
                $(this).toggleClass('list-group-item-success');
                $('#myInput').focus();
                scope.tasksDone = $('.list-group-item-success').length;
                application.refresh();
            });
        }
    };
});
todo.directive('clearSelected', function() {
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
                application.refresh();
                // Force the app to update ng-show directive in progress bar"
                // otherwise it will not update until user starts typing again
                if (scope.todos.length == 0) {
                    scope.$apply();
                };
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
                scope.todos = []
                scope.tasksDone = 0
                $('#myInput').focus();
                application.refresh();
                // Force the app to update ng-show directive in progress bar"
                // otherwise it will not update until user starts typing again
                scope.$apply();
            });
        }
    }
});
