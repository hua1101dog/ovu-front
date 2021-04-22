/**
 * Created by Zn on 2018/1/3.
 */
(function () {
    "use strict";
    var app = angular.module("angularApp");

    app.controller('orderManageCtrl', function ($scope, $rootScope, $uibModal, $state, $http, $filter, fac) {
        document.title='设备房工单管理';
        app.modulePromiss.then(function() {
            $scope.search={
              unitStatus:8
            };
            $scope.pageModel={};
            // $scope.$watch('park', function(newValue, oldValue) {
            //     if (newValue && newValue.id) {
            //         $scope.search.parkId = newValue.id;
            //         $scope.search.parkName = newValue.parkName;
            //         $scope.find();
            //     } else {
            //         alert("请先选定一个项目");
            //     }
            // })
            $scope.$watch('dept.id', function (deptId, oldValue) {
                if (deptId) {
                    if ($scope.dept.parkId) {
                        $scope.search.parkId = $scope.dept.parkId;
                         $scope.find();
                    } else {
                        alert('请选择跟项目关联的部门');
                        return
                    }

                }
            })
        })
        $scope.find = function (pageNo) {
            if(!$rootScope.dept ||!$rootScope.dept.id){
                alert("请选择部门！");
                return false;
            }
            $.extend($scope.search, {currentPage: pageNo || 1, pageSize: $scope.pageModel.pageSize || 10});
            $scope.search.pageIndex = $scope.search.currentPage - 1;
            // $scope.search.execPersonName = $scope.search.user?$scope.search.user.name:undefined;
            fac.getPageResult("/ovu-pcos/pcos/equiphouse/getHouseWorkUnit", $scope.search, function (data) {
                $scope.pageModel = data;
            });
            
        };
        //查看回访详情
        $scope.showReturnVisit = function(id){
            $uibModal.open({
                animation: false,
                templateUrl: '../view/workunit/modal.showReturnVisit.html',
                size:'lg',
                controller: 'showReturnVisitModalCtrl',
                resolve: {
                    id: function(){return id;}
                }
            });
        }
    });
    //查看回访
    app.controller('showReturnVisitModalCtrl', function($scope,$uibModalInstance,$http,fac,id) {
        $scope.search={unitId:id};
        $scope.pageModel={};

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };

        $scope.find = function(pageNo){
            $.extend($scope.search,{currentPage:pageNo||$scope.pageModel.currentPage||1,pageSize:$scope.pageModel.pageSize||10});
            fac.getPageResult("/ovu-pcos/pcos/workunit_callback/list.do",$scope.search,function(data){
                $scope.pageModel = data;
            });
        }
        $scope.find();
    });
})();
