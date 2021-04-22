/**
 * Created by wangheng on 2017/9/19.
 * 通知
 */
(function() {
    "use strict";
    var app = angular.module("angularApp");

    //预警事件控制器
    app.controller('unitCtrl', unitCtrl);
    function unitCtrl($scope, $uibModal, $http, fac) {
        document.title = "维保单位管理";
        var vm = this;
        $scope.pageModel = {};
        $scope.search = {domainId:1};

        //新增或者修改弹出框
        vm.edit = function(id){
            var modal = $uibModal.open({
                animation: false,
                component: "maintenanceAddOrEditModelComponent",
                size :'max',
                resolve: {
                        id:id,
                }
            });
            modal.result.then(function () {
                $scope.find();
            }, function () {
                console.info('Modal dismissed at: ' + new Date());
            });
        }
        //批量删除
        vm.batchDel = function () {
            var ids = $scope.pageModel.list.reduce(function(ret, n) {
                n.checked && ret.push(n.newsId);
                return ret
            }, []);
            del(ids);
        }
        //单个删除
        vm.del = function (id) {
            del([id]);
        }

        function del(ids) {
            confirm("确认删除?", function() {
                $http.post("/ovu-pcos/pcos/maintenanceunit/mtu/deleteById.do", {
                    "id": ids.join()
                }, fac.postConfig).success(function(resp) {
                    if (resp.success) {
                        $scope.find();
                    } else {
                        alert(resp.error);
                    }
                })
            });
        }

        $scope.find = function(pageNo){
            angular.extend($scope.search,{currentPage:pageNo||$scope.pageModel.currentPage||1,pageSize:$scope.pageModel.pageSize||10});
            fac.getPageResult("/ovu-pcos/pcos/maintenanceunit/mtu/list.do",$scope.search,function(data){
                $scope.pageModel = data;
            });
        };

        $scope.find(1);
    }
})();
