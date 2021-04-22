(function(angular, doc) {
    doc.title = "项目运营中心";
    angular.module('angularApp')

    .controller('coverCtrl', ['$scope', '$http', '$rootScope', function($scope, $http, $rootScope) {

        $scope.type = "overview";

        $scope.enterSingleElevator = function(liftId) {
            $scope.type = "singleElevator";
            $rootScope.liftId = liftId;
        }

      // 从电梯返回单项目
      $scope.$on('gobackToProject', function(evt, data) {
        $scope.type = "overview";
      });
    }]);

})(angular, document);
