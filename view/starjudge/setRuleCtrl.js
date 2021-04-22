/**
 * Created by Zn on 2018/4/2.
 */
(function () {
    "use strict";
    var app = angular.module("angularApp");

    app.controller('setRuleCtrl', function ($scope, $rootScope, $uibModal, $state, $http, $filter, fac) {
        document.title='设定规则';
        $scope.pageModel = {};
        $scope.search={};
        /*$scope.callback=function () {
            $scope.find();
            $scope.search.PARENT_NAME='';
            $scope.search.deptId='';

        }*/
        app.modulePromiss.then(function () {
            $scope.search = {isGroup: fac.isGroupVersion()};
            if ($scope.search.isGroup) {
                $scope.find();
                sessionStorage.setItem("parkId",$scope.search.parkId);
            } else {
                $scope.$watch('park', function (newValue, oldValue) {
                    if (newValue && newValue.id) {
                        $scope.search.parkId = newValue.id;
                        $scope.search.parkName = newValue.parkName;
                        $scope.find(1);
                    } else {
                        alert("请先选定一个项目");
                    }
                });
            }
        });
        $scope.confirm=function () {
            if($scope.search.score1<$scope.search.score2 &&
                $scope.search.score2<$scope.search.score3 &&
                $scope.search.score3<$scope.search.score4){
                $http.post('/ovu-pcos/pcos/star/rule/set',$scope.search,fac.postConfig).success(function (data) {
                    debugger
                    if(data.success){
                        $scope.find();
                        $scope.search.score1=$scope.search.score2=$scope.search.score3=$scope.search.score4='';
                    }
                })
            }
            else {
                alert('星级越高分值越高，您输入的不合法');
                return;
            }

        }
        $scope.find = function (pageNo) {
            $.extend($scope.search, {currentPage: pageNo || 1, pageSize: $scope.pageModel.pageSize || 10});
            $scope.search.pageIndex = $scope.search.currentPage - 1;
            fac.getPageResult("/ovu-pcos/pcos/star/rule/list", $scope.search, function (data) {
                $scope.pageModel = data;
            });
        };
    });
})();
