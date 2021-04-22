(function () {
    var app = angular.module("angularApp");
    app.directive('wdatePicker', function () {
        return {
            restrict: "A",
            link: function (scope, element, attr) {
                element.bind('click', function () {
                    window.WdatePicker({
                        onpicked: function () {
                            element.change()
                        },
                        oncleared: function () {
                            element.change()
                        }
                    })
                });
            }
        }
    });
    app.controller('depositManageCtrl', function ($scope, $rootScope, $http, $filter, $uibModal, $location, fac) {
        $scope.typeList = [{
                value: 1,
                name: '个人'
            },
            {
                value: 2,
                name: '企业'
            },
            {
                value: 3,
                name: '员工'
            }
        ]
        $scope.depositTypeList = [];
        $http.get("/ovu-base/system/dictionary/get?item=ANTECEDENT_MONEY_TYPE").success(function(resp){
            if(resp.code == 0){
                $scope.depositTypeList=resp.data;
            }
        });

        $scope.statusList = [{
                value: 1,
                name: '未退还'
            },
            {
                value: 2,
                name: '部分退还'
            },
            {
                value: 3,
                name: '已退还'
            }
        ]
        $scope.pageModel = {};
        $scope.search = {
            "parkId": app.park.parkId
        };

        $scope.find = function (pageNo) {
            $.extend($scope.search, {
                currentPage: pageNo || $scope.pageModel.currentPage || 1,
                pageSize: $scope.pageModel.pageSize || 10
            });
            fac.getPageResult("/ovu-park/backstage/billManage/depositsBillManage/selectByPage", $scope.search, function (resp) {
                console.log(resp)
                $scope.pageModel = resp;
                $scope.pageModel.data.forEach((value, index) => {
                    value.taxRate = Number(value.taxRate).toFixed(2);
                });
            });
        }
        $scope.query = function(){
        	fac.initPage($scope, function () {
                $scope.find(1);
            })
        }
        // 新增&编辑
        $scope.edit = function (item) {
            let editList = item || {};
            var modal = $uibModal.open({
                animation: false,
                size: '',
                templateUrl: '/view/supplierManage/depositManage/modal.depositEdit.html',
                controller: 'depositEditCtrl',
                resolve: {
                    item: function () {
                        return $.extend({}, editList, {
                            parkId: $scope.search.parkId
                        });
                    }
                }
            });
            modal.result.then(function (data) {
                $scope.find();
            }, function () {
                console.info('Modal dismissed at: ' + new Date());
            });
        }
        // 退款
        $scope.refund = function (item) {
            let editList = item || {};
            var modal = $uibModal.open({
                animation: false,
                size: '',
                templateUrl: '/view/supplierManage/depositManage/modal.depositRefund.html',
                controller: 'depositRefundCtrl',
                resolve: {
                    item: function () {
                        return $.extend({}, editList, {
                            parkId: $scope.search.parkId
                        });
                    }
                }
            });
            modal.result.then(function (data) {
                $scope.find();
            }, function () {
                console.info('Modal dismissed at: ' + new Date());
            });
        }
        // 退款历史
        $scope.refundHistory = function (item) {
            let editList = item || {};
            var modal = $uibModal.open({
                animation: false,
                size: '',
                templateUrl: '/view/supplierManage/depositManage/modal.refundHistory.html',
                controller: 'refundHistoryCtrl',
                resolve: {
                    item: function () {
                        return $.extend({}, editList, {
                            parkId: $scope.search.parkId
                        });
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
        $scope.cancel = function (item) {
            var surplus = item || {};
            var layerIndex = layer.confirm('确认删除吗？', {
                btn: ['确定', '取消'], //按钮
                shade: false //不显示遮罩
            }, function () {
                $http.post("/ovu-park/backstage/property/expenseTaxRate/delete", surplus, fac.postConfig).success(function (resp) {
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
                $scope.query();
            })
        });
    });
    // 新增&编辑
    app.controller('depositEditCtrl', function ($scope, $rootScope, $http, $uibModal, $uibModalInstance, $filter, fac, item) {
        $scope.typeList = [{
                value: 1,
                name: '装修设计'
            },
            {
                value: 2,
                name: '办公服务'
            },
            {
                value: 3,
                name: '智慧物联'
            },
            {
                value: 4,
                name: '金融服务'
            }
        ]

        $scope.depositTypeList = [];
        $http.get("/ovu-base/system/dictionary/get?item=ANTECEDENT_MONEY_TYPE").success(function(resp){
            if(resp.code == 0){
                $scope.depositTypeList=resp.data;
            }
        });

        $scope.search = item;
        $scope.staffList = {
            data: []
        };
        $scope.chooseStaff = {};
        if ($scope.search.id) {
            $scope.HOUSE = $scope.search.houseName;
            $scope.search.depositsType += '';
            $scope.search.userTypeStr = $filter("userTypeStatus")($scope.search.userType);
            $scope.staffList.data[0] = angular.copy($scope.search);
        }
        // 选择客户
        $scope.setName = function (name) {
            let alreadyChoose = false;
            $scope.staffList.data.forEach((value, index) => {
                if (value.name === name) {
                    $scope.search.userName = value.name;
                    $scope.search.userId = value.id;
                    $scope.search.userType = value.userType
                    $scope.search.userTypeStr = $filter('userTypeStatus')(value.userType);
                    $scope.chooseStaff = value;
                    alreadyChoose = true;
                    return;
                }
            })
            if (alreadyChoose) {
                return;
            }
            $scope.search.userId = '';
            $scope.search.userType = '';
            $scope.search.userTypeStr = '';
            $scope.HOUSE = '';
            $scope.search.depositsType = '';
            $scope.search.amount = null;

            var params = {
                "pageSize": 10,
                "pageIndex": 0,
                "name": name
            };
            $http.post("/ovu-park/backstage/billManage/depositsBillManage/getUserByName", params, fac.postConfig).success(function (response) {
                console.log(response);
                if (response && response.code == 0) {
                    $scope.staffList = response.data;
                    for (var i = 0; i < $scope.staffList.data.length; i++) {
                        if ($scope.staffList.data[i].name === $scope.search.userName) {
                            $scope.search.userName = $scope.staffList.data[i].name;
                            $scope.search.userId = $scope.staffList.data[i].id;
                            $scope.search.userType = $scope.staffList.data[i].userType
                            $scope.search.userTypeStr = $filter('userTypeStatus')($scope.staffList.data[i].userType);
                            $scope.chooseStaff = $scope.staffList.data[i];
                            break;
                        }
                    }
                } else {
                    window.alert(response.msg);
                }
            })

        }

        $scope.chooseOp = function (data) {
            console.log(data)
        }

        $scope.getFocus = function () {
            document.getElementById('focusShow').focus()
        }
        // 押金金额控制 
        $scope.amountChange = function () {
            $scope.search.amount = $scope.search.amount.toFixed(2);
            $scope.search.amount = Number($scope.search.amount);
        }
        // 选择空间信息
        $scope.changeHouse = function () {
            if (!$scope.search.userId) {
                window.alert("请选择有效客户!");
                return false;
            }
            let userId = $scope.search.userId || ''
            var modal = $uibModal.open({
                animation: false,
                size: '',
                templateUrl: '/view/supplierManage/depositManage/modal.chooseHouse.html',
                controller: 'chooseHouseCtrl',
                resolve: {
                    item: $.extend({}, {
                        parkId: $scope.search.parkId,
                        houseId: $scope.search.houseId,
                        userId: userId
                    }, $scope.chooseStaff)
                }
            });
            modal.result.then(function (data) {
                let houseNames = [];
                let houseIds = [];
                data && data.houseList && data.houseList.forEach((value, index) => {
                    houseNames.push(value.houseName);
                    houseIds.push(value.id);
                })
                $scope.HOUSE = houseNames.join();
                $scope.search.houseId = houseIds.join();
                $scope.search.houseName = $scope.HOUSE;
            });
        }
        // 保存
        $scope.save = function (form) {
            if (!form.$valid) {
                if (!$scope.search.userId) {
                    window.alert("请选择有效客户!");
                    return false;
                }
                window.alert("请完成必填项目!");
                return false;
            }
            if (!$scope.search.userId) {
                window.alert("请选择有效客户!");
                return false;
            }
            // $scope.search.userId = $scope.staffList.data[0].id;
            $http.post("/ovu-park/backstage/billManage/depositsBillManage/save", $scope.search, fac.postConfig).success(function (resp) {
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
    // 选择空间信息
    app.controller('chooseHouseCtrl', function ($scope, $rootScope, $http, $uibModalInstance, $filter, fac, item) {

        $scope.search = item;
        $scope.chooseAll = function (checked) {
            $scope.pageModel.data.forEach((value, index) => {
                value.checked = checked;
            })
            $scope.isPermit = sureState($scope.pageModel.data, 1);
        }
        $scope.chooseOne = function (checked, index) {
            $scope.allState = sureState($scope.pageModel.data, 2);
            $scope.isPermit = sureState($scope.pageModel.data, 1);
        }

        $scope.save = function () {
            let chooseHouse = sureState($scope.pageModel.data, 3);
            if (chooseHouse.length === 0) {
                window.alert("请选择房屋!");
                return false;
            }

            $uibModalInstance.close({
                houseList: chooseHouse
            });
        }
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
        //获取房屋
        $scope.pageModel = {};
        $scope.find = function (pageNo) {
            let param = {
                parkId: $scope.search.parkId,
                personId: $scope.search.personId || $scope.search.userId
            }
            $.extend(param, {
                currentPage: pageNo || $scope.pageModel.currentPage || 1,
                pageSize: $scope.pageModel.pageSize || 10
            })
            fac.getPageResult("/ovu-park/backstage/billManage/depositsBillManage/getEnterHouseList", param, function (resp) {
                console.log(resp)
                $scope.pageModel = resp;
                if ($scope.search.houseId) {
                    let arr = $scope.search.houseId.split(",");
                    $scope.pageModel.data.forEach((value, index) => {
                        if (arr.indexOf(value.id) != -1) {
                            value.checked = true;
                        }
                    })
                }
                
            });
        }

        function sureState(data, type) {
            if (type === 1) {
                return data.some(function (value, index) {
                    return value.checked;
                })
            } else if (type === 2) {
                return data.every(function (value, index) {
                    return value.checked;
                })
            } else if (type === 3) {
                return data.filter(function (value, index) {
                    return value.checked;
                })
            }
        }
        app.modulePromiss.then(function () {
            $scope.find(1)
        })
    });
    // 退款
    app.controller('depositRefundCtrl', function ($scope, $rootScope, $http, $uibModalInstance, $filter, fac, item) {
        $scope.search = item;
        // 保存
        $scope.save = function (form) {
            if (!form.$valid) {
                window.alert("请完成必填项目!");
                return false;
            }
            $scope.search.billId = $scope.search.id;
            $http.post("/ovu-park/backstage/billManage/depositsBillManage/refund", $scope.search, fac.postConfig).success(function (resp) {
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
    // 退款历史
    app.controller('refundHistoryCtrl', function ($scope, $rootScope, $http, $uibModalInstance, $filter, fac, item) {
        console.log(app)
        $scope.search = item;
        $scope.pageModel = {};
        $scope.find = function (pageNo) {
            let param = {
                billId: $scope.search.id
            }
            $.extend(param, {
                currentPage: pageNo || $scope.pageModel.currentPage || 1,
                pageSize: $scope.pageModel.pageSize || 10
            })
            fac.getPageResult("/ovu-park/backstage/billManage/depositsBillLog/selectByPage", param, function (resp) {
                console.log(resp)
                $scope.pageModel = resp;
                $scope.pageModel.data.forEach((value, index) => {
                    value.nickName = app.user.nickname;
                })
            });
        }
        // 保存
        $scope.save = function (form) {
            if (!form.$valid) {
                window.alert("请完成必填项目!");
                return false;
            }
            $http.post("/ovu-park/backstage/property/expenseTaxRate/saveOrEdit", $scope.search, fac.postConfig).success(function (resp) {
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
            $scope.find(1)
        })
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
