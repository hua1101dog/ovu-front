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
    app.controller('feeCategorySetCtrl', function ($scope, $rootScope, $http, $filter, $uibModal, $location, fac) {
        console.log(app.park.parkId);
        $scope.enableList = [
            { value: 1, name: '是' },
            { value: 0, name: '否' }
        ]
        $scope.pageModel = {};
        $scope.search = {};
        $scope.find = function (pageNo) {
            $.extend($scope.search, {
                currentPage: pageNo || $scope.pageModel.currentPage || 1,
                pageSize: $scope.pageModel.pageSize || 10
            });
            fac.getPageResult("/ovu-park/backstage/property/expenseChildType/listByPage", $scope.search, function (resp) {
                // console.log(resp);
                $scope.pageModel = resp;
            });
        }
        //停启用
        $scope.updateUsing = function (item){
            var param = {};
            angular.copy(item,param);
            if (item.isUsing === 0){
                param.isUsing = 1;
            } else {
                param.isUsing = 0;
            }
            $http.post("/ovu-park/backstage/property/expenseChildType/save", param, fac.postConfig).success(function (resp) {
                if (resp.code === 0) {
                    $scope.find();
                    window.msg(resp.msg);
                } else {
                    window.alert(resp.msg);
                }
            })
        }

        // 录入&编辑
        $scope.editFee = function (item) {
            let editList = item || {};
            var modal = $uibModal.open({
                animation: false,
                size: 'md',
                templateUrl: '/view/propertyCharges/feeCategory/modal.feeEdit.html',
                controller: 'feeEditCtrl',
                resolve: {
                    item: function () {
                        return $.extend({}, { parkId: $scope.search.parkId , detail: editList});
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
        $scope.cancelFee = function (item) {
            var surplus = item || {};
            var layerIndex = layer.confirm('确认删除吗？', {
                btn: ['确定', '取消'], //按钮
                shade: false //不显示遮罩
            }, function () {
                $http.post("/ovu-park/backstage/property/expenseChildType/delete", surplus, fac.postConfig).success(function (resp) {
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
    });
    // 录入&编辑
    app.controller('feeEditCtrl', function ($scope, $rootScope, $http, $uibModalInstance, $filter, fac, item) {
        $scope.curItem = item.detail;
        $scope.parkId = item.parkId
        $scope.title = isEmpty($scope.curItem);
        
        $scope.categoryNameList = []
        $scope.enableList = [
            { value: 1, name: '是' },
            { value: 0, name: '否' }
        ]
        $scope.payList = [
            { value: 1, name: '是' },
            { value: 0, name: '否' }
        ]
        $scope.billModeList = [ //抄表计费、建面计费、套内计费、定额计费、手动输入
            { value: 1, name: '抄表计费' },
            { value: 2, name: '建面计费' },
            { value: 3, name: '套内计费' },
            { value: 4, name: '定额计费' },
            { value: 5, name: '手动输入' }
        ]
        $scope.taxRateList = []
        $scope.chargeMethodList = [
            { value: 2, name: '一次性收费' },
            { value: 1, name: '周期性收费' }
        ]
        $scope.cycleTypeList = [
            { value: 1, name: '小时' },
            { value: 2, name: '日' },
            { value: 3, name: '月' },
            { value: 4, name: '年' }
        ]
        $scope.billUnitList = [ //kw/h、M2、M3、户、吨
            { value: 1, name: 'kw/h' },
            { value: 2, name: 'M2' },
            { value: 3, name: 'M3' },
            { value: 4, name: '户' },
            { value: 5, name: '吨' }
        ]
        // 获取收费类别名称列表
        $scope.getCategoryNameList = function () {
            $http.post("/ovu-park/backstage/property/expenseCategory/select", { parkId: $scope.parkId }, fac.postConfig).success(function (resp) {
                if (resp.code === 0) {
                    $scope.categoryNameList = resp.data;
                    if (isEmpty($scope.categoryNameList)) {
                        window.alert("请设置收费类别!");
                    }
                } else {
                    window.alert(resp.msg);
                }
            })
        }
        // 获取税率列表
        $scope.getTaxRateList = function () {
            $http.post("/ovu-park/backstage/property/expenseTaxRate/select", { parkId: $scope.parkId }, fac.postConfig).success(function (resp) {
                if (resp.code === 0) {
                    $scope.taxRateList = resp.data;
                    if (isEmpty($scope.taxRateList)) {
                        window.alert("请设置收费税率!");
                    }
                } else {
                    window.alert(resp.msg);
                }
            })
        }
        // 项目价格变化
        $scope.priceChange = function () {
            if (!$scope.curItem.taxRate) {
                window.alert("请选择税率!");
                return false;
            }
            if ($scope.curItem.taxRate && !$scope.curItem.price) {
                window.alert("请输入收费项目价格");
            }
            $scope.curItem.price = $scope.curItem.price.toFixed(2);
            $scope.curItem.price = Number($scope.curItem.price);
            $scope.curItem.noTaxPrice = ($scope.curItem.price * (1-$scope.curItem.taxRate)).toFixed(2);
            $scope.curItem.noTaxPrice = Number($scope.curItem.noTaxPrice);
        }
        // 保存
        $scope.save = function (form) {
            if (!form.$valid) {
                window.alert("请完成必填项目!");
                return false;
            }
            $scope.curItem.parkId = $scope.parkId;
            $scope.curItem.cycleType === 'null' && (delete $scope.curItem.cycleType);
            delete $scope.curItem.createTime;
            delete $scope.curItem.creatorId;
            delete $scope.curItem.creatorName;
            $http.post("/ovu-park/backstage/property/expenseChildType/save", $scope.curItem, fac.postConfig).success(function (resp) {
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

        app.modulePromiss.then(function () {
            $scope.getCategoryNameList();
            $scope.getTaxRateList();
            if (!$scope.title) {
                $scope.curItem.parentId += '';
                $scope.curItem.isUsing += '';
                // $scope.curItem.onlinePay += '';
                $scope.curItem.chargeWay += '';
                $scope.curItem.taxRate += '';
                $scope.curItem.payType += '';
                $scope.curItem.cycleType += '';
                $scope.curItem.chargeUnit += '';
            }
        });
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
