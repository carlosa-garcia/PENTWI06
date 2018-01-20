var todo = angular.module('toDoList', []);
todo.controller('toDoCtrl', function($scope, $timeout) {
    arrayData = localStorage.getItem('ToDoList');
    if ( arrayData === null) {
        $scope.todos = []
    } else {
        try {
            $scope.todos = JSON.parse(arrayData);
        } catch(err) {
            $scope.todos = arrayData;
        }
    };
    $scope.saveList = function() {
        localStorage.setItem('ToDoList', JSON.stringify($scope.todos));
    };

    $scope.addTask = function() {
        if ($scope.formTodoInput) {
            if ($scope.todos.indexOf($scope.formTodoInput) == -1) {
                $scope.todos.push({text:$scope.formTodoInput, completed: false});
                $scope.formTodoInput = '';
                // Trough out this file you will see $timeout being used
                // this is to allow the angular to properly update the DOM
                // before executing the progress bar code.
                $timeout(function() {
                    application.refresh();
                })
                $scope.saveList()
            };
        };
    };
});
todo.directive('taskLi', function(){
    return {
        restrict: 'E',
        template: '<li class="list-group-item" ng-repeat="todo in todos track by $index" ng-class="{{todo.completed}} ? \'list-group-item-success\' : \'\'" toggle-complete>{{todo.text}}</li>'
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
                    taskName = $(this).text();
                    scope.todos.forEach(function(obj, objIndex) {
                        if (taskName == obj.text) {
                            obj.completed = true;
                        };
                    });
                    $('#myInput').focus();
                    application.refresh();
                    scope.saveList()
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
                        if (taskName === obj.text) {
                            scope.todos.splice(objIndex, 1);
                        };
                    });
                });
                completedTasks.remove();
                $('#myInput').focus();
                $timeout(function(){
                    application.refresh();
                })
                scope.saveList()
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
                $('#myInput').focus();
                scope.saveList()
                $timeout(function(){
                    application.refresh();
                })
            });
        }
    }
});
