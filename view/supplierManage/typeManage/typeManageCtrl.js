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
    app.controller('typeManageCtrl', function ($scope, $rootScope, $http, $filter, $uibModal, $location, fac) {
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
            fac.getPageResult("/ovu-park/backstage/supplier/supplierTypeInfo/selectByPage", $scope.search, function (resp) {
                // console.log(resp);
                $scope.pageModel = resp;
            });
        }
        // 新增&编辑
        $scope.editType = function (item) {
            let editList = item || {};
            var modal = $uibModal.open({
                animation: false,
                size: 'md',
                templateUrl: '/view/supplierManage/typeManage/modal.typeEdit.html',
                controller: 'typeEditCtrl',
                resolve: {
                    item: function () {
                        return $.extend({}, editList);
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
        $scope.cancelType = function (item) {
            let params = {
                id : item.id
            };
            var layerIndex = layer.confirm('确认删除吗？', {
                btn: ['确定', '取消'], //按钮
                shade: false //不显示遮罩
            }, function () {
                $http.post("/ovu-park/backstage/supplier/supplierTypeInfo/delete", params, fac.postConfig).success(function (resp) {
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
    // 新增&编辑
    app.controller('typeEditCtrl', function ($scope, $rootScope, $http, $uibModalInstance, $filter, fac, item) {
        $scope.curItem = item;
        $scope.title = isEmpty($scope.curItem);

        $http.get('/ovu-park/backstage/supplier/supplierTypeInfo/getOrderNo').success(res => {
            $scope.curNo = res.data.orderNo;
            if (!$scope.title) {
                $scope.curNo = $scope.curItem.no;
            }
        })
        
        $scope.categoryNameList = []
        // 保存
        $scope.save = function (form) {
            if (!form.$valid) {
                window.alert("请完成必填项目!");
                return false;
            }
            $scope.curItem.no = $scope.curNo
            $http.post("/ovu-park/backstage/supplier/supplierTypeInfo/save", $scope.curItem, fac.postConfig).success(function (resp) {
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
