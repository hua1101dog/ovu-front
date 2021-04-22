(function () {
    "use strict";
    var app = angular.module("angularApp");
    app.controller('easylinkinCtrl', function ($scope, $rootScope, $http, $filter, $uibModal, fac) {
        document.title = "传感器管理";
        $scope.search = {};
        $scope.pageModel = {};

        !$rootScope.sensorTypeEnum && $http.get("/middleware/easylinkin/sensorTypeEnum").success(function(resp){
            if(resp.code ==0){
                $rootScope.sensorTypeEnum = resp.data;
            }
        })

        //分页
        $scope.find = function (pageNo) {
            angular.extend($scope.search, { currentPage: pageNo || $scope.pageModel.currentPage || 1, pageSize: $scope.pageModel.pageSize || 10 });
            fac.getPageResult('/middleware/easylinkin/list', $scope.search, function (data) {
                $scope.pageModel = data
            })
        }

        $scope.showHistory = function(item){
            var modal = $uibModal.open({
                animation: false,
                size: 'lg',
                templateUrl: '/view/middleware/easylinkin.history.html',
                controller: 'easylinkinHistoryCtrl',
                resolve: {
                    item: function () { return item;}
                }
            });
            modal.result.then(function () {
            }, function () {
            });
        }

        $scope.find(1);

        $scope.showEditModal = function (item) {
            var copy = angular.extend({type:2}, item);
            var modal = $uibModal.open({
                animation: false,
                size: '',
                templateUrl: "/view/middleware/easylinkin.modal.html",
                controller: 'easylinkinEditCtrl',
                controllerAs: 'vm',
                resolve: {
                    easylinkin: copy
                }
            })
            modal.result.then(function () {
                $scope.find();
            })
        }
        //删除设备
        $scope.del = function (id) {
            confirm("确认删除该代理吗?", function () {
                $http.get("/middleware/easylinkin/del?ids=" + id).success(function (resp) {
                    if (resp.code == 0) {
                        $scope.find();
                    } else {
                        alert(resp.msg);
                    }
                })
            })
        }
    });
    app.controller('easylinkinEditCtrl', function ($scope, $uibModal, $uibModalInstance, $http, fac, easylinkin) {
        var vm = $scope.vm = this;
        $scope.item = easylinkin;

        vm.save = function (form, item) {
            form.$setSubmitted(true);
            if (!form.$valid) {
                return
            }
            delete item.optime;

            $http.post('/middleware/easylinkin/save', item).success(function (res) {
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

    app.controller('easylinkinHistoryCtrl', function ($scope, $uibModal, $uibModalInstance, $http, fac, item) {
        var vm = $scope.vm = this;
        $scope.item = item;
        $scope.search = {mac:item.mac};
        $scope.pageModel = {};



        //分页
        var pushUrls = [];
        $scope.find = function (pageNo) {
            angular.extend($scope.search, { currentPage: pageNo || $scope.pageModel.currentPage || 1, pageSize: $scope.pageModel.pageSize || 10 });
            fac.getPageResult('/middleware/easylinkin/getSensorHistory',$scope.search, function (data) {
                $scope.pageModel = data;
                data.data.forEach(function(n){
                    n.sendJsonArray = JSON.parse(n.sendJson);
                    n.sendJsonArray = n.sendJsonArray.filter(function(m){
                        var pushUrl = pushUrls.find(function(x){return x.id == m.pushUrlId});
                        if(pushUrl){
                            m.pushName = pushUrl.name;
                            return true;
                        }else {
                            return false;
                        }
                    })
                })
            })
        }

        if(item.parkNo){
            $http.get("/middleware/pushUrl/getPushUrls",{params:{parkNo:item.parkNo,company:"easylinkin"}}).success(function(resp){
                if(resp.code == 0){
                    pushUrls = resp.data;
                    $scope.find();
                }else{
                    alert(resp.msg);
                }
            })
        }else {
            $scope.find();
        }


        $scope.copy =  function(clipBoardContent){
            const input = document.createElement('input');
            document.body.appendChild(input);
            input.setAttribute('value', clipBoardContent);
            input.select();
            if (document.execCommand('copy')) {
                document.execCommand('copy');
                alert("复制成功!");
            }
            document.body.removeChild(input);
        }

        $scope.reSend = function(item,rec){
            item.pushUrlId = rec.pushUrlId;
            confirm("重新推送此条数据吗？",function () {
                $http.post('/middleware/easylinkin/reSend', item).success(function (res) {
                    if (res.code == 0) {
                        if(res.data == 1){
                            rec.status = 1;
                            msg("推送成功!");
                        }else{
                            alert(res.msg);
                        }
                    } else {
                        alert(res.msg);
                    }
                })
            })
        }

    })

})()
