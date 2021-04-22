(function(angular, doc) {
   

    angular.module('angularApp')

    .controller('coverCtrl', ['$scope', '$location', '$rootScope', function($scope, $location, $rootScope) {
        doc.title = "项目运营中心";
        $scope.type = "multiProjects";

        //进入单项目页面
        $scope.enterSingelProject = function(projectId) {
            $scope.type = "singleProject";
            $rootScope.projectId = projectId;
        };
        //进入单电梯页面
        $scope.enterSingleElevator = function(id) {
            $scope.type = "singleElevator";
            $rootScope.liftId = id;
        };

        // 从电梯返回单项目
        $scope.$on('gobackToProject', function(evt, data) {
            $scope.enterSingelProject($rootScope.projectId);
        });

        // 从单项目返回多项目
        $scope.$on('gobackToMulti', function(evt, data) {
            $scope.type = "multiProjects";
        });

    }]);

})(angular, document);
