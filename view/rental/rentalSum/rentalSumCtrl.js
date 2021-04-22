(function () {
    var app = angular.module("angularApp");
    app.controller('rentSumCtrl', function ($scope, $rootScope, $http, $filter, $uibModal, fac) {
        document.title = "OVU-费项管理";
        // 状态
        $scope.status = [
            { value: "0", text: "未启用" },
            { value: "1", text: "使用中" },
            { value: "2", text: "已停用" }
        ];
        // 用途
        $scope.purpose = [
            { value: "01", text: "正常收入" },
            { value: "02", text: "暂收暂付" }
        ]
        // 类别
        $scope.category = [
            { value: "02", text: "租金类" },
            { value: "03", text: "管理费类" },
            { value: "04", text: "其他类" },
            { value: "05", text: "押金类" }
        ]

        $scope.search = {};
        $scope.pageModel = {};
        // 列表
        $scope.find = function (pageNo) {
            $.extend($scope.search, { currentPage: pageNo || $scope.pageModel.currentPage || 1, pageSize: $scope.pageModel.pageSize || 10 });
            $scope.search.pageIndex = $scope.search.currentPage - 1;
            $scope.search.totalCount = $scope.pageModel.totalCount || 0;
            $scope.search.parkId = app.park.parkId;
            fac.getPageResult("/ovu-park/backstage/rental/rentalExpenditureManage/selectByPage", $scope.search, function (data) { //ovu-park/backstage/rental/expenditure/list
                $scope.pageModel = data;
            });
        };
        // 新增、编辑费项 / 查看 - 模态框
        $scope.editModal = function (item, status) {
            if (status) {
                $.extend(item, {checkStatus: status});
            }
            var modal = $uibModal.open({
                animation: false,
                size: 'md',
                templateUrl: '/view/rental/rentalSum/modal.edit.html',
                controller: 'rentSumCtrlEditCtrl',
                resolve: { item: item }
            });
            modal.result.then(function () {
                $scope.find();
            }, function () {
                $scope.find();
            });
        }
        // 停用 、启用
        $scope.updateStatus = function (item) {
            var params = {
                id: item.id,
            }
            var change = "";
            if (item.status === 0) {
                params.status = 1
                change = "启用";
            } else if (item.status === 1) {
                params.status = 2
                change = "停用";
            } else {
                params.status = 1;
                change = "启用";
            }
            confirm("确定" + change + "[" + item.name + "]?", function () {
                $http.post("/ovu-park/backstage/rental/rentalExpenditureManage/updateStatus", params, fac.postConfig).success(function (resp) {
                    if (resp.code == 0) {
                        window.msg("状态保存成功");
                        $scope.find();
                    } else {
                        window.alert(resp.msg);
                    }
                });
            })

        }
        // 删除
        $scope.del = function (item) {
            var params = { id: item.id }
            confirm("确定删除费项	[" + item.name + "]?", function () {
                $http.post("/ovu-park/backstage/rental/rentalExpenditureManage/remove", params, fac.postConfig).success(function (resp) {
                    if (resp.code == 0) {
                        window.msg("删除成功");
                        $scope.find();
                    } else {
                        window.alert(resp.message);
                    }
                });
            })
        }

        app.modulePromiss.then(function () {
            fac.initPage($scope, function () {
                $scope.find();
            })
        });
    });
    // 新增/编辑费项 模态创
    app.controller('rentSumCtrlEditCtrl', function ($scope, $rootScope, $http, $filter, $uibModalInstance, fac, item) {
        // 用途
        $scope.purpose = [
            { value: "01", text: "正常收入" },
            { value: "02", text: "暂收暂付" }
        ];
        // 类别    02:租金类, 03:管理费类, 04:其他类, 05:押金类
        $scope.category = [
            { value: "02", text: "租金类" },
            { value: "03", text: "管理费类" },
            { value: "04", text: "其他类" },
            { value: "05", text: "押金类" }
        ]
        //是否启用 0:未启用, 1:使用中
        $scope.status = [
            { value: "0", text: "否" },
            { value: "1", text: "是" }
        ];
        $scope.bills = [
            { value: "1", text: "一次性收费" },
            { value: "2", text: "周期性收费" },
            { value: "3", text: "计量表收费" },
            { value: "4", text: "单位：日/㎡" },
            { value: "5", text: "单位：月/㎡" },
            { value: "6", text: "单位：季度/㎡"},
            { value: "7", text: "单位：年/㎡" }
        ]
        item && (item.billingRates = item.billingRates ? (item.billingRates+''): '');
        item && (item.createTime = null);
        item && (item.updateTime = null);
        $scope.item = angular.copy(item);
        $scope.edit = item ? true : false;
        if (!$scope.edit) {
            $scope.item = {};//初始化
        }
        $scope.checkStatus = false;
        if (item && item.checkStatus) {
            $scope.checkStatus = item.checkStatus;
        }
        $scope.item.status = $scope.item.status == 1? '1': '0';

        $scope.getData = function (data) {
            console.log(data, 1);
        }
        // // 计费标准选择
        // $("#sel_menu2").select2({
        //     tags: true,
        //     maximumSelectionLength: 1  //最多能够选择的个数
        // });

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
        // 保存
        $scope.save = function (form) {
            $scope.item.parkId = app.park.parkId;
            if (!form.$valid) {
                window.alert('请完成必填项！');
                return false;
            }
            $http.post("/ovu-park/backstage/rental/rentalExpenditureManage/save", $scope.item, fac.postConfig).success(function (resp) { //ovu-park/backstage/rental/expenditure/saveOrEdit
                if (resp.code == 0) {
                    window.msg("保存成功");
                    $scope.cancel();
                } else {
                    window.alert(resp.message);
                }
                // $scope.cancel();
            });
        }
    });
    app.filter("purpose", function () {
        return function (status) {
            switch (status) {
                case '01':
                    return '正常收入';
                    break;
                case '02':
                    return '暂收暂付';
                    break;
            }
        }
    })
    app.filter("status", function () {
        return function (status) {
            status += '';
            switch (status) {
                case '0':
                    return '未启用';
                    break;
                case '1':
                    return '使用中';
                    break;
                case '2':
                    return '已停用';
                    break;
                default:
                    return '--';
                    break;
            }
        }
    })
})()
