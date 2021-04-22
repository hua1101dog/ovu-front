(function () {
    var app = angular.module("angularApp");
    app.directive('wdatePicker', function () {
        return {
            restrict: "A",
            link: function (scope, element, attr) {
                element.bind('click', function () {
                    window.WdatePicker({
                        onpicked: function () { element.change() },
                        oncleared: function () { element.change() }
                    })
                });
            }
        }
    });
    app.controller('chargeCategorySetCtrl', function ($scope, $rootScope, $http, $filter, $uibModal, $location, fac) {
        $scope.chargesList = [
            { status: false, name: '物业管理费' },
            { status: true, name: '车位管理费' },
            { status: false, name: '进场管理费' },
            { status: false, name: '临时停车费' }
        ]
        // $scope.allState = false;
        // $scope.isPermit = true;
        $scope.pageModel = {};
        $scope.search = {};
        $scope.find = function (pageNo) {
            $.extend($scope.search, {
                currentPage: pageNo || $scope.pageModel.currentPage || 1,
                pageSize: $scope.pageModel.pageSize || 10
            });
            fac.getPageResult("/ovu-park/backstage/property/expenseCategory/listByPage", $scope.search, function (resp) {
                $scope.pageModel = resp;
                $scope.pageModel.data.forEach((value, index) => {
                    value.status = false;
                })
            });
        }
        // $scope.chooseAll = function (status) {
        //     $scope.chargesList.forEach((value, index) => {
        //         value.status = status;
        //     })
        //     $scope.isPermit = sureState($scope.chargesList, 1);
        // }
        // $scope.chooseOne = function (status, index) {
        //     $scope.allState = sureState($scope.chargesList, 2);
        //     $scope.isPermit = sureState($scope.chargesList, 1);
        // }
        // 录入&编辑
        $scope.chargeEdit = function (item) {
            var editList = item || {};
            // if (type === 1) {
            //     editList = {};
            // }
            // else if (type === 2) {
            //     editList = sureState($scope.chargesList, 3);
            //     if (editList.length === 0) {
            //         window.alert("请选择收费项目!");
            //         return false;
            //     }
            //     if (editList.length > 1) {
            //         window.alert("请选择一条收费项目再进行编辑!");
            //         return false;
            //     }
            //     editList = editList[0];
            // }
            var modal = $uibModal.open({
                animation: false,
                size: 'md',
                templateUrl: '/view/propertyCharges/chargeCategory/modal.chargeEdit.html',
                controller: 'chargeEditCtrl',
                resolve: {
                    item: function () {
                        return $.extend({}, editList, { parkId: $scope.search.parkId });
                    }
                }
            });
            modal.result.then(function (data) {
                $scope.find();
            }, function () {
                console.info('Modal dismissed at: ' + new Date());
            });
        }
        // 删除
        $scope.chargeCancel = function (item) {
            var surplus = item || {};
            // surplus = sureState($scope.chargesList, 3);
            // if (surplus.length === 0) {
            //     window.alert("请选择收费项目!");
            //     return false;
            // }
            // if (surplus.length > 1) {
            //     window.alert("请选择一条收费项目再删除!");
            //     return false;
            // }
            // surplus = surplus[0];
            var layerIndex = layer.confirm('确认删除吗？', {
                btn: ['确定', '取消'], //按钮
                shade: false //不显示遮罩
            }, function () {
                $http.post("/ovu-park/backstage/property/expenseCategory/delete", surplus, fac.postConfig).success(function (resp) {
                    if (resp.code === 0) {
                        $scope.find();
                        window.msg(resp.msg);
                        layer.close(layerIndex);
                    } else {
                        window.alert(resp.msg);
                        layer.close(layerIndex);
                    }
                })
            }, function () {
                console.log('取消了');
            });
        }
        app.modulePromiss.then(function () {
            $scope.$watch('dept.id', function (deptId, oldValue) {
                if (deptId) {
                    var parkDept = fac.getParkDept(null, deptId);
                    if (parkDept) {
                        $scope.search.parkId = parkDept.parkId;
                        $scope.search.parkName = parkDept.parkName;
                    } else {
                        $scope.search = {};
                    }
                } else {
                    $scope.search = {};
                }
                $scope.find(1);
            })
        });

        function sureState(data, type) {
            if (type === 1) {
                return data.some(function (value, index) {
                    return value.status;
                })
            } else if (type === 2) {
                return data.every(function (value, index) {
                    return value.status;
                })
            } else if (type === 3) {
                return data.filter(function (value, index) {
                    return value.status;
                })
            }
        }
    });
    // 录入&编辑
    app.controller('chargeEditCtrl', function ($scope, $rootScope, $http, $uibModalInstance, $filter, fac, item) {
        console.log(item)
        $scope.curItem = item;
        $scope.title = isEmpty($scope.curItem)
        // 保存
        $scope.save = function (form) {
            if (!form.$valid) {
                window.alert("请完成必填项目!");
            }
            $http.post("/ovu-park/backstage/property/expenseCategory/save", $scope.curItem, fac.postConfig).success(function (resp) {
                if (resp.code === 0) {
                    window.msg(resp.msg);
                    $uibModalInstance.close();
                } else {
                    window.alert(resp.msg);
                }
            })
        }
        // 取消
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        }

        // 验证空数组和空对象
        function isEmpty(obj) {
            //检验null和undefined
            if (!obj && obj !== 0 && obj !== '') {
                return true;
            }
            //检验数组
            if (Array.prototype.isPrototypeOf(obj) && obj.length === 0) {
                return true;
            }
            //检验对象
            if (Object.prototype.isPrototypeOf(obj) && Object.keys(obj).length === 0) {
                return true;
            }
            return false;
        }
    });
})()
