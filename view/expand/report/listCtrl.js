/**
 * Created by ghostsf on 2017/9/15.
 */
(function () {
    "use strict";
    var app = angular.module("angularApp");

    //项目管理ctrl
    app.controller('costProjectCtrl', function ($scope, $state,$location, $rootScope, $http, $filter, $uibModal, fac) {
        document.title = "已报价项目管理";
        $scope.pageModel = {};
        $scope.search = {};

        app.modulePromiss.then(function () {
            $scope.find();
        });

        $scope.reportStates = [[0, "待审核"], [1, "审核通过"], [2, "审核不通过"]];


        /**
         * 搜索查询
         * @param pageNo
         */
        $scope.find = function (pageNo) {
            angular.extend($scope.search, {
                currentPage: pageNo || $scope.pageModel.currentPage || 1,
                pageSize: $scope.pageModel.pageSize || 10
            });
            fac.getPageResult("/ovu-pcos/extend/report/list.do", $scope.search, function (data) {
                $scope.pageModel = data;
            });
        };

        /**
         * 编辑
         * @param id
         */
        $scope.modify = function (id) {
            $location.url("/expand/paySetting/costing").search('projectId', id);
        };

        /**
         * 审核、查看
         * @param id
         */
        $scope.edit = function (id,isEdit) {
            var param = {
                id: id,
                isEdit:isEdit,
                canExport:(isEdit?false:true)
            };
            var modal = $uibModal.open({
                animation: true,
                size: 'lg',
                templateUrl: 'expand/report/modal.list.html',
                controller: 'costReportModalCtrl'
                , resolve: {param: param}
            });
            modal.result.then(function () {
                if(isEdit){
                    $scope.find();
                }
            }, function () {
                console.info('Modal dismissed at: ' + new Date());
            });
        }
        /**
         * 删除
         * @param id
         */
        $scope.delCost = function (id) {
            confirm("确认删除此项目报价吗?",function(){
                $http.post("/ovu-pcos/extend/report/del.do",{id:id},fac.postConfig).success(function(data){
                    if(data.success){
                        msg('删除成功！');
                        $scope.find();
                    }else{
                        alert('删除失败');
                    }
                });
            });
        };
        /**
         * 历史报价
         * @param id
         */
        $scope.showHisCost = function (id) {
            var param = {
                id: id
            };
            var modal = $uibModal.open({
                animation: true,
                size: 'lg',
                templateUrl: 'expand/report/modal.versions.html',
                controller: 'hisCostCtrl'
                , resolve: {param: param}
            });
            modal.result.then(function () {
            }, function () {
                console.info('Modal dismissed at: ' + new Date());
            });
        }
    });

    /**
     * 历史报价Ctrl
     */
    app.controller('hisCostCtrl', function ($scope, $rootScope, $http, $uibModalInstance, $uibModal, $filter, fac, param) {
        $scope.list=[];

        $http.get("/ovu-pcos/extend/report/getProHistoryLogs.do?id=" + param.id).success(function (data) {
            $scope.list=data;
            $scope.list.forEach(function(item){
                item.chae=(item.earning-item.pay).toFixed(2);
            });
        });

        /**
         * 查看
         * @param id
         */
        $scope.show = function (id,versionId) {
            var param = {
                id: id,
                isEdit:false,
                versionId:versionId
            };
            var modal = $uibModal.open({
                animation: true,
                size: 'lg',
                templateUrl: 'expand/report/modal.list.html',
                controller: 'costReportModalCtrl'
                , resolve: {param: param}
            });
            modal.result.then(function () {
            }, function () {
                console.info('Modal dismissed at: ' + new Date());
            });
        }
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    });
})();
