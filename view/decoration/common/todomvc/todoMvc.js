(function(angular, win) {
    angular.module('angularApp')

    .component('todoMvc', {
        templateUrl: '../view/decoration/common/todomvc/view.html',
        controller: 'TodoCtrl',
        bindings: {
            todos: '<'
        },
    })

    .controller('TodoCtrl', ['$scope', '$filter', 'cacheStorage','$element', function TodoCtrl($scope, $filter, store,element) {
        'use strict';
        store.todos = this.todos;
        var todos = $scope.todos = store.todos;

        $scope.newTodo = '';
        $scope.editedTodo = null;
        //按下enter键添加数据
        //document绑定全局有污染，改为element绑定
        element.bind("keydown keypress", function (event) {
            if(event.which === 13) {
                $scope.addTodo();
            }
        });
        $scope.addTodo = function() {
            
            var newTodo = {
                title: $scope.newTodo.trim()
            };

            if (!newTodo.title) {
                return;
            }

            $scope.saving = true;
            store.insert(newTodo)
                .then(function success() {
                    $scope.newTodo = '';
                })
                .finally(function() {
                    $scope.saving = false;
                });
        };

        $scope.editTodo = function(todo) {
            $scope.editedTodo = todo;
            // Clone the original todo to restore it on demand.
            $scope.originalTodo = angular.extend({}, todo);
        };

        $scope.saveEdits = function(todo, event) {
            // Blur events are automatically triggered after the form submit event.
            // This does some unfortunate logic handling to prevent saving twice.
            if (event === 'blur' && $scope.saveEvent === 'submit') {
                $scope.saveEvent = null;
                return;
            }

            $scope.saveEvent = event;

            if ($scope.reverted) {
                // Todo edits were reverted-- don't save.
                $scope.reverted = null;
                return;
            }

            todo.title = todo.title.trim();

            if (todo.title === $scope.originalTodo.title) {
                $scope.editedTodo = null;
                return;
            }

            store[todo.title ? 'put' : 'delete'](todo)
                .then(function success() {}, function error() {
                    todo.title = $scope.originalTodo.title;
                })
                .finally(function() {
                    $scope.editedTodo = null;
                });
        };

        $scope.revertEdits = function(todo) {
            todos[todos.indexOf(todo)] = $scope.originalTodo;
            $scope.editedTodo = null;
            $scope.originalTodo = null;
            $scope.reverted = true;
        };

        $scope.removeTodo = function(todo) {
            store.delete(todo);
        };


    }])

    .directive('todoEscape', function() {
        'use strict';

        var ESCAPE_KEY = 27;
          
        return function(scope, elem, attrs) {
            elem.bind('keydown', function(event) {
                if (event.keyCode === ESCAPE_KEY) {
                    scope.$apply(attrs.todoEscape);
                }
            });

            scope.$on('$destroy', function() {
                elem.unbind('keydown');
            });
        };
    })

    .directive('todoFocus', function todoFocus($timeout) {
        'use strict';

        return function(scope, elem, attrs) {
            scope.$watch(attrs.todoFocus, function(newVal) {
                if (newVal) {
                    $timeout(function() {
                        elem[0].focus();
                    }, 0, false);
                }
            });
        };
    })

    .factory('cacheStorage', function($q) {
        'use strict';

        var store = {
            todos: [],

            delete: function(todo) {
                var deferred = $q.defer();

                store.todos.splice(store.todos.indexOf(todo), 1);

                deferred.resolve(store.todos);

                return deferred.promise;
            },

            get: function() {
                var deferred = $q.defer();

                deferred.resolve(store.todos);

                return deferred.promise;
            },

            insert: function(todo) {
                var deferred = $q.defer();

                store.todos.push(todo);

                deferred.resolve(store.todos);

                return deferred.promise;
            },

            put: function(todo) {
                var deferred = $q.defer();

                deferred.resolve(store.todos);

                return deferred.promise;
            }
        };

        return store;
    });

})(angular, window);