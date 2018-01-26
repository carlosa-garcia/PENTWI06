var todo = angular.module('toDoList', []);
todo.factory('application', function() {
    return {
        refresh: function() {
            var disableAllButton = function(bool) {
                $('#clearAll').prop('disabled', bool);
            };
            var disableCompletedButton = function(bool) {
                $('#clearComplete').prop('disabled', bool);
            };
            var updateProgressBar = function(valueMax, valueNow, width, html) {
                $('.progress-bar').attr('aria-valuemax', valueMax)
                .attr('aria-valuenow', valueNow)
                .css('width',  width)
                .html(html);
            };
            pending = $('.list-group-item').not('.list-group-item-success').length;
            done = $('.list-group-item-success').length;

            if (pending === 0 && done === 0) {
                $('.progress').hide();
                $('#banner').html('Awesome task app.')
                disableCompletedButton(true);
                disableAllButton(true);
                updateProgressBar(0, 0, '0%', '0%');
            } else {
                disableAllButton(false);
                progress = (done / (pending + done)) * 100;
                $('#banner').html("Progress...");
                $('.progress').show();
                updateProgressBar(pending + done, done, progress + '%', Math.round(progress * 10) / 10 + '%');
            };
            if (done === 0) {
                disableCompletedButton(true)
            } else {
                disableCompletedButton(false)
            };
            $('#myInput').focus();
        }
    }
});
todo.factory('storage', function() {
    var loadLocalStorage = function() {
        try {
            rawStorage = localStorage.getItem('ToDoList');
            try {
                storage = JSON.parse(rawStorage);
            } catch(err) {
                storage = rawStorage;
            };
        }
        catch(err) {
            storage = []
        };
        return storage;
    };
    return {
        load: loadLocalStorage,
        save: function(obj) {
            localStorage.setItem('ToDoList', angular.toJson(obj));
        }
    };
});
// todo.config(function ($provide) {});
todo.run(function($timeout, application) {
    // Trough out this file you will see $timeout being used
    // this is to allow the angular to properly update the DOM
    // before executing the progress bar code.
    $timeout(function(){
        application.refresh();
    });
});
todo.controller('toDoCtrl', function($scope, $timeout, storage, application) {
    storedData = storage.load();
    if (storedData != null && storedData.length >= 1) {
        $scope.todos = storedData;
    } else {
        $scope.todos = [];
    };
    taskExists = function(stringToVerify) {
        stringExists = false;
        if ($scope.todos.length >= 1) {
            $scope.todos.forEach(function(obj, objIndex) {
                if (stringToVerify == obj.text) {
                    stringExists = true;
                };
            });
        };
        return stringExists;
    };
    $scope.addTask = function() {
        newTask = $scope.formTodoInput;
        if (newTask) {
            repeatedTask = taskExists(newTask);
            if (repeatedTask == false) {
                $scope.todos.push({text:newTask, completed: false});
            };
            $scope.formTodoInput = '';
            $timeout(function() {
                application.refresh();
            })
            storage.save($scope.todos)
        };
    };
});
todo.directive('taskLi', function(){
    return {
        restrict: 'E',
        template: '<li class="list-group-item" ng-repeat="todo in todos" ng-class="{{todo.completed}} ? \'list-group-item-success\' : \'\'" toggle-complete>{{todo.text}}</li>'
    };
});
todo.directive('submitOnEnter', function() {
    return {
        restrict: 'A',
        link: function(scope, el, attrs) {
            el.on('keypress', function(event){
                var keycode = (event.keyCode ? event.keyCode : event.which);
                if (keycode == '13') {
                    scope.addTask();
                }
            });
        }
    };
});
todo.directive('toggleComplete', function($timeout, storage, application){
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
                            obj.completed = !obj.completed;
                        };
                    });
                    $('#myInput').focus();
                    application.refresh();
                    storage.save(scope.todos)
                });
            });
        }
    };
});
todo.directive('clearSelected', function($timeout, storage, application) {
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
                storage.save(scope.todos);
                $timeout(function(){
                    application.refresh();
                })
            });
        }
    }
});
todo.directive('clearAll', function($timeout, storage, application) {
    return {
        restrict: 'A',
        link: function(scope, el, attrs) {
            el.on('click', function() {
                var items = '.list-group-item';
                $(items).remove();
                scope.todos = []
                $('#myInput').focus();
                storage.save(scope.todos);
                $timeout(function(){
                    application.refresh();
                })
            });
        }
    }
});
