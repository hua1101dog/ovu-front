(function () {
    "use strict";
    var app = angular.module("angularApp");
    
    app.controller('dataPointCtrl', function ($scope, $rootScope, $http, $filter, $uibModal, fac) {
        document.title = "数据采集点管理";
        $scope.search = {};
        $scope.pageModel = {};

         // 数据类型 select 选择
        !$rootScope.companyEnum && $http.get("/middleware/proxy/companyEnum").success(function(resp){
            console.log('resp=',resp)
            if(resp.code ==0){
                $rootScope.companyEnum = resp.data;
            }
        })


        //分页
        $scope.find = function (pageNo) {
            angular.extend($scope.search, { currentPage: pageNo || $scope.pageModel.currentPage || 1, pageSize: $scope.pageModel.pageSize || 10 });
            fac.getPageResult('/middleware/dataPoint/list', $scope.search, function (data) {
                $scope.pageModel = data
                data.data.forEach(function(n){
                    if(n.type == 'reformer'){
                        $http.get("/middleware/api/reformer/isTcpOn?reformerId="+n.id).success(function(resp){
                            n.tcpOn = (resp.code==0);
                        })
                    }
                })
            })
        }

        $scope.find(1);

        $scope.initTcpProxy = function (item){
            !item.tcpOn && $http.get("/middleware/api/reformer/initTcpProxy?dataPointId="+item.id).success(function(resp){
                if(resp.code == 0){
                    msg("连接成功！");
                }else{
                    alert(resp.msg);
                }
            })
        }

        $scope.showEditModal = function (item) {
            var copy = angular.extend({config:"{}"}, item);
            var modal = $uibModal.open({
                animation: false,
                size: '',
                templateUrl: "/view/middleware/dataPoint.modal.html",
                controller: 'dataPointEditCtrl',
                controllerAs: 'vm',
                resolve: {
                    dataPoint: copy
                }
            })
            modal.result.then(function () {
                $scope.find();
            })
        }
        //删除设备
        $scope.del = function (id) {
            confirm("确认删除该推送地址吗?", function () {
                $http.get("/middleware/dataPoint/del?ids=" + id).success(function (resp) {
                    if (resp.code == 0) {
                        $scope.find();
                    } else {
                        alert(resp.msg);
                    }
                })
            })
        }


    });

    //弹层的控制器
    app.controller('dataPointEditCtrl', function ($scope, $uibModal, $uibModalInstance, $http, fac, dataPoint) {
        var vm = $scope.vm = this;
        dataPoint.configJSON = JSON.parse(dataPoint.config);
        $scope.item = dataPoint;

        fac.getPageResult('/middleware/proxy/list', {}, function (pageModel) {
            $scope.proxyList = pageModel.data;
        })

        vm.save = function (form, item) {
            form.$setSubmitted(true);
            if (!form.$valid) {
                return
            }
            dataPoint.config = JSON.stringify(dataPoint.configJSON);
            $http.post('/middleware/dataPoint/save', item).success(function (res) {
                if (res.code == 0) {
                    $uibModalInstance.close();
                    msg("保存成功!");
                } else {
                    alert(res.msg);
                }
            })
        };
        vm.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        }
    })

})()
