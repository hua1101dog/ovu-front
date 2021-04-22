/**
 * Created by wangheng on 2017/9/19.
 * 通知
 */
(function() {
    "use strict";
    var app = angular.module("app");

    //预警事件控制器
    app.controller('ElevatorManageCtrl', ElevatorManageCtrl);
    function ElevatorManageCtrl($scope,$uibModal, fac) {
        document.title = "电梯管理";
        var vm = this;
        $scope.pageModel = {};
        $scope.search = {};

        $scope.find = function(pageNo){
            angular.extend($scope.search,{currentPage:pageNo||$scope.pageModel.currentPage||1,pageSize:$scope.pageModel.pageSize||10});
            fac.getPageResult("/ovu-pcos/pcos/govcloud/elevator/list.do",$scope.search,function(data){
                $scope.pageModel = data;
            });
        };

        //详情弹出框
        vm.see = function(id){
            var modal = $uibModal.open({
                animation: false,
                templateUrl: '/government/management/page/elevatorManage/elevatorManage-detail.html',
                controller: 'ElevatorManageEditCtrl',
                controllerAs :'vm',
                size:'lg',
                resolve: {
                    id: id
                }
            });
            modal.result.then(function () {
            }, function () {
                console.info('Modal dismissed at: ' + new Date());
            });
        }

        $scope.find(1);
    }

    app.controller('ElevatorManageEditCtrl', ElevatorManageEditCtrl);
    function ElevatorManageEditCtrl($scope, $http, $uibModalInstance,fac, id) {
        var vm = this;
        vm.sensor={};
        $http.get("/ovu-pcos/pcos/equipment/get.do?id="+id).success(function(data) {
            if(data.success){
                vm.sensor = data.data || {};
            }
        }).error(function () {
            alert();
        })

        vm.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        }
    }
})();