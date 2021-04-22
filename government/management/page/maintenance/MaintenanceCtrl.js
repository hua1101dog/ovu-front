/**
 * Created by wangheng on 2017/9/19.
 * 通知
 */
(function() {
    "use strict";
    var app = angular.module("app");

    //预警事件控制器
    app.controller('MaintenanceCtrl', MaintenanceCtrl);
    function MaintenanceCtrl($scope, $http,$uibModal, fac) {
        document.title = "维保单位管理";
        var vm = this;
        $scope.pageModel = {};
        $scope.search = {};
        // 修改
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

        /*vm.edit = function(newsId){
            if(!fac.isEmpty(newsId)) {
                $state.go('app.maintenance.edit', {id: newsId});
            } else {
                $state.go('app.maintenance.edit');
            }
        }*/
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

    /*app.controller('MaintenanceEditCtrl', MaintenanceEditCtrl);
    function MaintenanceEditCtrl($scope,$state, $http, fac) {
        var vm = this;
        vm.item={personList:[]};
        vm.topTitle = "新增";
        vm.titles=['管理者代表(总经理)','维保负责人','质保负责人','技术负责人','施工(安装改造)负责人','开工告示指定人'];
        var id = $state.params.id;
        //修改
        if(fac.isNotEmpty(id)){
            vm.topTitle = "修改";
            $http.get("/ovu-pcos/pcos/maintenanceunit/mtu/get.do?id="+id).success(function(data) {
                vm.item = data || {};
            }).error(function () {
                alert();
            })
        }

        vm.addPhoto = function (item) {
            fac.upload({url:"/ovu-pcos/upload/img.do"},function(resp){
                if(resp.status==1){
                    item.photo=resp.url;
                    $scope.$apply();
                }else{
                    alert(resp.error);
                }
            })
        }

        vm.addPhoto2 = function (item) {
            fac.upload({url:"/ovu-pcos/upload/img.do"},function(resp){
                if(resp.status==1){
                    item.qualificationPhoto=resp.url;
                    $scope.$apply();
                }else{
                    alert(resp.error);
                }
            })
        }

        //保存
        vm.save = function (form,item) {
            form.$setSubmitted(true);
            if(!form.$valid){
                return;
            }
            var param = angular.copy(item);
            $http.post("/ovu-pcos/pcos/maintenanceunit/mtu/edit.do",param).success(function(data) {
                if(data.success){
                    msg("保存成功!");
                    $state.go("app.maintenance.list");
                } else {
                    alert();
                }
            })
        }

        vm.cancel = function () {
            $state.go("app.maintenance.list");
        }
    }*/
})();