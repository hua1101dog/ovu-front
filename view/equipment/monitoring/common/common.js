(function(angular, doc) {

    var app = angular.module('angularApp');

    app.component('eqMonitorCommon', {
        templateUrl: '../view/equipment/monitoring/common/view.html',
        bindings: {},
        controller: 'eqMonitorCommonCtrl',
        controllerAs: 'vm'
    });

    // BIM 控制器
    app.controller('eqMonitorCommonCtrl', ['$scope', '$http', '$rootScope', '$window', '$interval', 'fac', function($scope, $http, $rootScope, $window, $interval, fac) {
        var vm = this;
        vm.alertNumber = 1000000;
    }]);

})(angular, document);