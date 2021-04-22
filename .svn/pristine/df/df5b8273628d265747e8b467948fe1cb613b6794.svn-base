(function () {
    "use strict";
    var app = angular.module("angularApp");
    app.controller('airPanelCtrl', function ($scope, $rootScope, $http, $filter, $uibModal, fac) {
        document.title = "空调面板设备管理";
        $scope.search = {};
        $scope.pageModel = {};

        //分页
        $scope.find = function (pageNo) {
            angular.extend($scope.search, { currentPage: pageNo || $scope.pageModel.currentPage || 1, pageSize: $scope.pageModel.pageSize || 10 });
            fac.getPageResult('/middleware/airpanel/list', $scope.search, function (data) {
                $scope.pageModel = data
            })
        }

        $scope.find(1);
        //
        $scope.editDevSwitchSta=function(item){
            var switchStatus=item.devSwitchSta=="1"?"0":"1";
            $http.get('/middleware/six/setLoraAirPanelStatus?device_ids='+item.deviceId+'&DEV_SWITCH_STA='+switchStatus).success(function (res) {
                
                if (res.success) {
                    var index = layer.load(1, {
                        shade: [0.2, '#000'] //0.1透明度的白色背景
                    });
                     setTimeout(function() {
                        layer.close(index);
                        $scope.find();
                     }, 3000); 
                } else {
                    alert(res.msg);
                }
            })

        }
        $scope.editDevTargetTemp=function(item){
            var param = { device_ids: item.deviceId, devTargetTemp: item.devTargetTemp };
            var modal = $uibModal.open({
                animation: false,
                size: '',
                templateUrl: "/view/middleware/airPanelTempSet.modal.html",
                controller: 'airPanelTempSetCtrl',
                controllerAs: 'vm',
                resolve: {
                    param: param
                }
            })

            modal.result.then(function() {
                    $scope.find();
                })
        

        }
        $scope.editDevSpeed=function(item){
            var param = { device_ids: item.deviceId, devSpeed: item.devSpeed };
            var modal = $uibModal.open({
                animation: false,
                size: '',
                templateUrl: "/view/middleware/airPanelSpeedSet.modal.html",
                controller: 'airPanelSpeedSetCtrl',
                controllerAs: 'vm',
                resolve: {
                    param: param
                }
            })

            modal.result.then(function () {
               $scope.find();
            })
            
        }
        
        $scope.editDevMode=function(item){
            var param = { device_ids: item.deviceId, devMode: item.devMode };
            var modal = $uibModal.open({
                animation: false,
                size: '',
                templateUrl: "/view/middleware/airPanelModeSet.modal.html",
                controller: 'airPanelModeSetCtrl',
                controllerAs: 'vm',
                resolve: {
                    param: param
                }
            })
            modal.result.then(function () {
                $scope.find();
            })
                        
        }

        $scope.showEditModal = function (item) {
            var copy = angular.extend({},item);
            var modal = $uibModal.open({
                animation: false,
                size: '',
                templateUrl: "/view/middleware/airPanel.modal.html",
                controller: 'airPanelEditCtrl',
                controllerAs: 'vm',
                resolve: {
                	airPanel: copy
                }
            })
            modal.result.then(function () {
                $scope.find();
            })
        }
        //设置
        $scope.showOperate = function (item) {
            var copy = angular.extend({type:2}, item);
            var modal = $uibModal.open({
                animation: false,
                size: '',
                templateUrl: "/view/middleware/airPanelOperate.modal.html",
                controller: 'airPanelOperateCtrl',
                controllerAs: 'vm',
                resolve: {
                	airPanel: copy
                }
            })
            modal.result.then(function () {
                $scope.find();
            })
        }
        //删除设备
        $scope.del = function (id) {
            confirm("确认删除该设备吗?", function () {
                $http.get("/middleware/airpanel/del?ids=" + id).success(function (resp) {
                    if (resp.code == 0) { 
                        $scope.find();
                    } else {
                        alert(resp.msg);
                    }
                })
            })
        }
    });
    app.controller('airPanelEditCtrl', function ($scope, $uibModal, $uibModalInstance, $http, fac, airPanel) {
        var vm = $scope.vm = this;
        $scope.item = airPanel;

        vm.save = function (form, item) {
            form.$setSubmitted(true);
            if (!form.$valid) {
                return
            }
            delete item.optime;

            $http.post('/middleware/airpanel/save', item).success(function (res) {
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
    
        app.controller('airPanelOperateCtrl', function ($scope, $uibModal, $uibModalInstance, $http, fac, airPanelOperate) {
        var vm = $scope.vm = this;
        $scope.item = airPanel;

        vm.save = function (form, item) {
            form.$setSubmitted(true);
            if (!form.$valid) {
                return
            }
            delete item.optime;

            $http.post('/middleware/airpanel/save', item).success(function (res) {
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
//修改温度
    app.controller('airPanelTempSetCtrl', function ($scope, $uibModal, $uibModalInstance, $http, fac, param) {
        var vm = $scope.vm = this;
        $scope.item = {device_ids:param.device_ids,devTargetTemp:parseInt(param.devTargetTemp)};
        vm.save = function (form, item) {
            form.$setSubmitted(true);
            if (!form.$valid) {
                return
            }
            $http.get('/middleware/six/setLoraAirPanelStatus?device_ids='+item.device_ids+'&DEV_TARGET_TEMP='+item.devTargetTemp, item).success(function (res) {
                
                if (res.success) {
                    var index = layer.load(1, {
                        shade: [0.2, '#000'] //0.1透明度的白色背景
                    });
                     setTimeout(function() {
                        layer.close(index);
                        $uibModalInstance.close();
                        msg("设置成功!");
                }, 3000);                 
                } else {
                    alert(res.msg);
                }
            })
        };
        vm.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        }
    })
//风速设置
    app.controller('airPanelSpeedSetCtrl', function ($scope, $uibModal, $uibModalInstance, $http, fac, param) {
        var vm = $scope.vm = this;
        $scope.item = param;

        vm.save = function (form, item) {
            form.$setSubmitted(true);
            if (!form.$valid) {
                return
            }
            $http.get('/middleware/six/setLoraAirPanelStatus?device_ids='+item.device_ids+'&DEV_SPEED='+item.devSpeed).success(function (res) {
                
                if (res.success) {
                    var index = layer.load(1, {
                        shade: [0.2, '#000'] //0.1透明度的白色背景
                    });
                setTimeout(function() {
                    layer.close(index);
                    $uibModalInstance.close();
                    msg("设置成功!");
                }, 3000); 
                } else {
                    alert(res.msg);
                }
            })
        };
        vm.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        }
    })
    //工作模式设置
    app.controller('airPanelModeSetCtrl', function ($scope, $uibModal, $uibModalInstance, $http, fac, param) {
        var vm = $scope.vm = this;
        $scope.item = param;

        vm.save = function (form, item) {
            form.$setSubmitted(true);
            if (!form.$valid) {
                return
            }
            $http.get('/middleware/six/setLoraAirPanelStatus?device_ids='+item.device_ids+'&DEV_MODE='+item.devMode).success(function (res) {
                
                if (res.success) {
                    var index = layer.load(1, {
                        shade: [0.2, '#000'] //0.1透明度的白色背景
                    });
                    setTimeout(function() {
                        layer.close(index);
                        $uibModalInstance.close();
                        msg("设置成功!");
                    }, 3000); 
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
