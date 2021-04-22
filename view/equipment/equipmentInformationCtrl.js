(function () {
    "use strict";
    var app = angular.module("angularApp");
    app.service('AppService', function ($http, fac) {
        var that = this;
        this.park = { parkNo: '', parkName: '' };
        //项目编号
        this.parkNo = '';
    });
    app.controller('equipmentInformationCtrl', function ($scope, $rootScope, $interval, $http, $filter, $uibModal, fac, AppService) {
        $scope.pageModel = {

        };
        $scope.search = {

        };
        $scope.equipment = [];
        $scope.find = function (pageNo) {
            angular.extend($scope.search, { currentPage: pageNo || $scope.pageModel.currentPage || 1, pageSize: $scope.pageModel.pageSize || 10 });
            fac.getPageResult("/faceDiscern/devManager/queryAllDev", $scope.search, function (data) {
                $scope.pageModel = data;
                let datas = $scope.pageModel.data;
                for (let i = 0; i < datas.length; i++) {
                    if (datas[i].equStatus == 1) {
                        datas[i].statue = "正常"
                    } else if (datas[i].equStatus == 2) {
                        datas[i].statue = "停用"
                    } else if (datas[i].equStatus == 3) {
                        datas[i].statue = "故障"
                    } else if (datas[i].equStatus == 4) {
                        datas[i].statue = "报废"
                    }
                }
                $scope.equipment = datas;
                console.log(' $scope.equipment:', $scope.equipment);
            });
        };
        $scope.find(1);
        $scope.goSyn = function () {//同步
            $http.get('/faceDiscern/devManager/synchro').success(function (resp) {
                msg(resp.msg + "!");
                $scope.find(1);
          })
        }
        $scope.toRefresh = function () {//刷新

        };
        $scope.toEdit = function (item) {//添加
              // 点击编辑/保存按钮 
            console.log(item)
            item.showDetail = false;
            var modal = $uibModal.open({
                animation: false,
                size: 'lg',
                templateUrl: '/view/equipment/component/editModel.html',
                controller: 'editModelCtrl',
                resolve: { data: item }
            })
            modal.result.then(function () {
                $scope.find(1)
            }, function () { //模态框关闭事件

            })

        };
        $scope.toDel = function (id) {//删除
            confirm("确认删除该条记录吗?", function () {
                $http.get(`/faceDiscern/devManager/deleteDev/${id}`).success(function (resp) {
                    msg(resp.msg + "!");
                    $scope.find(1);
                });
            })
        };
    });
    app.controller('editModelCtrl', function ($scope, $http, $uibModalInstance) {
        
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    })
})()

