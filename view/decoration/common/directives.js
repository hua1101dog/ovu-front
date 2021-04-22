(function(angular, win) {
    var app = angular.module('angularApp');

    app.directive('autoFocus', ['$timeout', function($timeout) {
        return function(scope, elem, attrs) {
            scope.$watch(attrs.autoFocus, function(newV) {
                if (newV) {
                    $timeout(function() {
                        elem[0].focus();
                    }, 0, false);
                }
            })
        }
    }]);
})(angular, window);