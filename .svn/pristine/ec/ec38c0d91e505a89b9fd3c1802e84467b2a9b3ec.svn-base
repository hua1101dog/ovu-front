(function () {
    'use strict';
    var app = angular.module("angularApp");
    app.controller("accessCtr", ["$scope", "$http", "$filter", "$uibModal", "$rootScope", "fac", function ($scope, $http, $filter, $uibModal,  $rootScope,fac) {
        document.title = "门禁设备管理";
        $scope.pageModel = [];
        $scope.search = {};
        $scope.id = "";
        app.modulePromiss.then(function () {
            // fac.initPage($scope, function () {

            //     $scope.find();
            // }, function () {
            //     $scope.find();
            // });
            $scope.$watch('dept.id', function (deptId, oldValue) {
                if (deptId) {
                    $scope.search.deptId=deptId;
                    $scope.search.parkId=$rootScope.dept.parkId;
                    $scope.find(1);
                    
                }
            })

        })
        //x按钮关闭弹出框
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
        $scope.toAdd = function (id) {
            //弹出模态框 
            if (!$scope.search.deptId) {
                alert("请选择部门！");
                return
            }
            var modalInstance = $uibModal.open({
                component: 'reportFeeEditModal',

                resolve: {
                    data: function () {
                        return {
                            deptId: $scope.search.deptId,
                            parkId: $scope.search.parkId,
                            id: id
                        };
                    }
                }

            });
            modalInstance.result.then(function () {
                $scope.find();
            }, function () {
                $scope.find();
            });
        }
        $scope.editStage = $scope.addTopNode = function (stage) {
            if (!fac.hasOnlyPark($scope.search)) {
                return;
            }
            var modal = $uibModal.open({
                animation: false,
                size: '',
                templateUrl: 'space/modal.editStage.html',
                controller: 'editStageCtrl',
                resolve: {
                    stage: function () {
                        if (stage) {
                            return angular.extend({}, stage);
                        } else {
                            return {
                                parkId: $scope.search.parkId
                            };
                        }
                    }
                }
            });
            modal.result.then(function (data) {
                if (stage) {
                    angular.extend(stage, data)
                } else {

                    $scope.treeData.push(data);
                }
            });
        }
        //分页数据
        $scope.find = function (pageNo) {
            // if (!fac.hasActivePark($scope.search)) {

            //     return;
            // }
            if (!$scope.search.deptId||!$rootScope.dept.id ) {
                alert("请选择部门！");
                return ;
            }
            angular.extend($scope.search, {
                currentPage: pageNo || $scope.pageModel.currentPage || 1,
                pageSize: $scope.pageModel.pageSize || 10
            });

            fac.getPageResult("/ovu-pcos/pcos/acs/acs_equipment/queryPage.do", $scope.search, function (data) {
                $scope.pageModel = data;
            });
        }

        //删除
        $scope.toDel = function (item) {

            confirm("确认删除该条记录吗?", function () {
                $http.get("/ovu-pcos/pcos/acs/acs_equipment/delete.do", {
                    params: {
                        acsEquipId: item
                    }
                }).success(function (res) {
                    if (res.acsMsg) {
                        msg('操作成功')
                        $scope.find();
                    }
                });
            })

        }
    }]);
    app.component('reportFeeEditModal', {

        bindings: {
            resolve: '<',
            close: '&',
            dismiss: '&'
        },
        templateUrl: 'reportFeeEditModal.html',
        controllerAs: '$ctrl',
        controller: function ($http, $uibModal, fac) {
            var $ctrl = this;
            $ctrl.title = "新增门禁设备";

            //点击搜索
            $ctrl.pro = function () {
                if (!$ctrl.resolve.data.parkId) {
                    msg("请先选择项目！");
                    return;
                }
                var modal = $uibModal.open({
                    animation: false,
                    size: 'lg',
                    templateUrl: '/view/equipment/selector.equipment.html',
                    controller: 'equipmentSelectorCtrl',
                    resolve: {
                        data: function () {
                            return {
                                parkId: $ctrl.item.parkId,
                                equipment_id: $ctrl.item.equipmentId,
                            };
                        }
                    }
                });
                modal.result.then(function (data) {
                    $ctrl.item.equipmentId = data.id;
                    $ctrl.item.equipment_name = data.name;
                    $ctrl.item.equipment_ad = data.park_name + " " + data.stage_name + " " + data.floor_name + " " + data.house_name;

                });

            };
            $ctrl.$onInit = function () {

                $ctrl.item = angular.copy($ctrl.resolve.data);
                $ctrl.item = $ctrl.item || {};
                $ctrl.item.is_equip = "0";
                $ctrl.item.is_equipt = "0"
                $ctrl.index = 0;
                if ($ctrl.item.id) {
                    $ctrl.title = "编辑门禁设备"
                    $http.get("/ovu-pcos/pcos/acs/acs_equipment/queryDetail.do", {
                        params: {
                            id: $ctrl.item.id
                        }
                    }).success(function (res) {
                        angular.extend($ctrl.item, res);
                        $ctrl.item.equipment_name = $ctrl.item.name;
                        $ctrl.item.equipment_ad = $ctrl.item.installPlace;
                        $ctrl.item.is_equip = $ctrl.item.isPwdEquipment;
                        $ctrl.item.is_equipt = $ctrl.item.isFrontScan;
                    });;
                }

            };


            $ctrl.changeIndex = function (index) {
                $ctrl.index = index;
            };
            //点击保存
            $ctrl.ok = function (form, item) {

                form.$setSubmitted(true);

                if (!form.$valid) {

                
                    return;
                }
                $ctrl.arr = [
                    [
                        [$ctrl.item.deviceBlueMac],
                        [$ctrl.item.deviceWifiMac, $ctrl.item.deviceRealWifiMac, $ctrl.item.deviceBlueMac]
                    ],
                    [
                        [$ctrl.item.deviceQrMac],
                        [$ctrl.item.deviceQrMac, $ctrl.item.qrChangeNum, $ctrl.item.qrChangeType]
                    ],
                    [$ctrl.item.blueChangeNum, $ctrl.item.blueChangeType]
                ]
                if ($ctrl.item.is_equip == 1) {
                    delete $ctrl.arr[0][1];
                } else {
                    delete $ctrl.arr[0][0];
                }

               var valNow = $ctrl.arr[$ctrl.index];

                for (var k in valNow) {

                    if (angular.isArray((valNow[k]))) {
                        for (var i in valNow[k]) {
                            if (fac.isEmpty(valNow[k][i])) {
                                msg('请填写数据');
                                return;

                            }
                        }

                    }

                    if (fac.isEmpty(valNow[k])) {
                        msg('请填写数据');
                        return;

                    }

                };

                var paramInvo = {};
                var url = "/ovu-pcos/pcos/acs/acs_equipment/edit.do";
                paramInvo = {
                    id: $ctrl.item.id,
                    deviceWifiMac: item.deviceWifiMac,
                    deviceBlueMac: item.deviceBlueMac,
                    equipmentId: item.equipmentId,
                    deviceQrMac: item.deviceQrMac,
                    deviceRealWifiMac: item.deviceRealWifiMac,
                    remark: item.remark,
                    deptId: item.deptId,
                    parkId: item.parkId,
                    isPwdEquipment: $ctrl.item.is_equip,
                    isFrontScan: $ctrl.item.is_equipt,
                    qrChangeType: $ctrl.item.qrChangeType,
                    blueChangeType: $ctrl.item.blueChangeType,
                    qrChangeNum: item.qrChangeNum,
                    blueChangeNum: item.blueChangeNum,
                }



                $http.post(url, paramInvo, fac.postConfig).success(function (res) {
                    if (res.acsMsg) {
                        msg("操作成功");
                    } else {
                        alert("操作失败");
                    }

                    $ctrl.close();

                });


            };
            $ctrl.cancel = function () {
                $ctrl.dismiss({
                    $value: $ctrl.item
                });
            };

            $ctrl.numChange = function () {
                if ($ctrl.item.qrChangeNum <= 0) {
                    $ctrl.item.qrChangeNum = 0;
                }
                if ($ctrl.item.blueChangeNum <= 0) {
                    $ctrl.item.blueChangeNum = 0;
                }
            }

        }

    });

})()