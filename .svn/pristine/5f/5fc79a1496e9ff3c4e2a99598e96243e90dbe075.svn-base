(function () {
    "use strict";
    var app = angular.module("angularApp");

    //合同分类管理ctrl
    app.controller("creatCtrl", function ($scope, $rootScope, $uibModal,$state, $http, $filter, fac) {
        document.title = "合同创建";

        //判断是集团版还是项目版
        app.modulePromiss.then(function () {
            $scope.pageModel = {};
            $scope.search = { isGroup: fac.isGroupVersion() };
            if ($scope.search.isGroup) {
                $scope.find();
            } else {
                $scope.$watch('park', function (newValue, oldValue) {
                    if (newValue && newValue.id) {
                        $scope.search.parkId = newValue.id;
                        //$scope.search.PARK_NAME = newValue.PARK_NAME;
                        $scope.find();
                    } else {
                        alert("请先选定一个项目");
                    }
                });
            }
        });

        $scope.find = function (pageNo) {
            $.extend($scope.search, { currentPage: pageNo || 1, pageSize: $scope.pageModel.pageSize || 10 });
            $scope.search.pageIndex = $scope.search.currentPage - 1;
            
            $scope.search.compactStatus = 0;
            fac.getPageResult("/ovu-pcos/pcos/compact/info/list", $scope.search, function (data) {
                $scope.pageModel = data;
            })
        };

        $scope.del = function (item) {
            confirm("确认删除吗？", function () {
                $http.post('/ovu-pcos/pcos/compact/info/remove', { compactInfoId:item.infoId }, fac.postConfig).success(function (data) {
                    if (data.status) {
                        $scope.find();
                        msg(data.msg);
                    } else {
                        msg(data.msg);
                    }
                })
            })
        };

        // $scope.commit = function(item){
        //     $http.post('/ovu-pcos/pcos/compact/info/compactcommit',{ infoId:item.infoId},fac.postConfig).success(function(data){
        //         if(data.status == 0){
        //             msg(data.msg);
        //             $scope.find();
        //         }else{
        //             msg(data.msg);
        //         }
        //     })
        // }

        //合同提交
        // $scope.commitCompact = function(item){
        //     confirm("确认提交吗？", function () {
        //         $http.post('/ovu-pcos/pcos/compact/info/commit', item, fac.postConfig).success(function (data) {
        //             if (data.status == 0) {
        //                 msg(data.msg);
        //                 $scope.find();
        //             } else {
        //                 msg(data.msg);
        //             }
        //         })
        //     })
        // };
    
        $scope.showCreat = function () {
            sessionStorage.setItem('parkId',$scope.search.parkId);
            $state.go('three', { folder: 'agreement', catalogue: 'agreementcreat', page: 'agreementcreat' });
        };

        $scope.commit = function(item){
             sessionStorage.setItem('parkId',item.parkId);
             sessionStorage.setItem('id',item.infoId);
             $state.go('three', { folder: 'agreement', catalogue: 'agreementcreat', page: 'agreementedit' });
        };

    });



})();
