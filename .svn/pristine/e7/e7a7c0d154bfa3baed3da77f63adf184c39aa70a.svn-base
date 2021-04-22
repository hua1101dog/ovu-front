/**
 * Created by Zn on 2018/1/30.
 */
(function () {
    "use strict";
    var app = angular.module("angularApp");

    //合同备案管理ctrl
    app.controller("remindCtrl", function ($scope, $rootScope, $uibModal, $http, $filter, fac, $state) {
        $scope.search = {
            compactInfoId: sessionStorage.getItem('id')
        };
        $scope.pageModel = {};
        $scope.find = function (pageNo) {
            $.extend($scope.search, { currentPage: pageNo || 1, pageSize: $scope.pageModel.pageSize || 10 });
            $scope.search.pageIndex = $scope.search.currentPage - 1;

            fac.getPageResult("/ovu-pcos/pcos/compact/info/warning", $scope.search, function (data) {
                $scope.pageModel = data;
            })
        };
        $scope.find();

        $scope.del = function (item) {
            confirm("确认删除吗？", function () {
                $http.post('/ovu-pcos/pcos/compact/info/removeWarning', { id: item.id , compactInfoId:sessionStorage.getItem('id') }, fac.postConfig).success(function (data) {
                    if (data.status) {
                        msg(data.msg);
                        $scope.find();
                    } else {
                        alert(data.msg);
                    }
                })
            })
        };



        $scope.back = function () {
            var backContent = sessionStorage.getItem('back');
             //返回到期合同管理
             
             if(backContent == 'discard'){
                 $state.go('admin', { folder: 'agreement', page: 'discard' });
             }else if(backContent == 'library'){
                 $state.go('admin', { folder: 'agreement', page: 'library' });
             }else if(backContent == 'expired'){
                 $state.go('admin', { folder: 'agreement', page: 'expired' });
             }
            //$state.go('admin', { folder: 'agreement', page: 'discard' });
        };

    })
})()
