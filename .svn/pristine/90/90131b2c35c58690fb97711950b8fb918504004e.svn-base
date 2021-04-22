(function () {
    var app = angular.module("angularApp");
    app.controller('rentPriceCtrl', function ($scope, $rootScope, $http, $filter, $uibModal, $location, fac) {
        document.title = "OVU-租金定价";
        $scope.search = {};
        $scope.pageModel = {};
        // 项目状态 0:保存待提交，1：提交待审批, 2:审批通过, 3:审批驳回
        $scope.status = [
            { value: "0", text: "待提交" },
            { value: "1", text: "审批中" },
            { value: "2", text: "已通过" },
            { value: "3", text: "已驳回" },
        ]
        // 项目下拉分期
        $scope.getStageList = function () {
            var params = { "parkId": app.park.parkId };
            $http.post("/ovu-park/backstage/rental/project/getProjectStageList", params, fac.postConfig).success(function (resp) {
                if (resp.code == 0) {
                    $scope.stageList = resp.data;
                } else {
                    window.error(resp.message);
                }
            });
        }
        // 列表
        $scope.find = function (pageNo) {
            $.extend($scope.search, { currentPage: pageNo || $scope.pageModel.currentPage || 1, pageSize: $scope.pageModel.pageSize || 10 });
            $scope.search.pageIndex = $scope.search.currentPage - 1;
            $scope.search.totalCount = $scope.pageModel.totalCount || 0;
            fac.getPageResult("/ovu-park/backstage/rental/project/list", $scope.search, function (data) {
                $scope.pageModel = data;
            });
        };
        // 新增项目  弹窗
        $scope.newModal = function () {
            var modal = $uibModal.open({
                animation: false,
                size: 'md',
                templateUrl: '/view/rental/rentPrice/modal.new.html',
                controller: 'newProjectRent',
            });
            modal.result.then(function () {
                $scope.find();
            }, function () {
                $scope.find();
            });
        }
        // 提交，1：提交待审批
        $scope.submit = function (id) {
            var params = {
                id: id,
                updatorId: app.user.personId,
                status: 1,
            }
            $http.post("/ovu-park/backstage/rental/project/saveStageHousesRent", params, fac.postConfig).success(function (resp) {
                if (resp.code == 0) {
                    window.msg("成功提交");
                    $scope.find();
                } else {
                    window.alert(resp.message);
                }
            });
        };
        // 明细
        $scope.detail = function (id, stageId) {
            // $location.url('/rental/rentPrice/detail')
            // $location.search({ 'id': id, 'stageId': stageId })
            $rootScope.target("rental/rentPrice/detail", "定价明细", false, '', { 'id': id, 'stageId': stageId },"rental/rentPrice/detail")
        }
        // 分解 变更
        $scope.resolve = function (id, stageId, status) {
            // $location.url('/rental/rentPrice/resolve')
            // $location.search({ 'id': id, 'stageId': stageId, 'status': status });
            $rootScope.target("rental/rentPrice/resolve", "租金分解", false, '', { 'id': id, 'stageId': stageId, 'status': status },"rental/rentPrice/resolve")

        }
        // 审批查看 - 弹窗
        $scope.examModal = function (item) {
            var modal = $uibModal.open({
                animation: false,
                size: 'lg',
                templateUrl: '/view/rental/rentPrice/modal.exam.html',
                controller: 'examProjectRent',
                resolve: { item, item }
                });
            modal.result.then(function () {
                $scope.find();
                }, function () { 
            });
        }
        // 历史记录  弹窗
        $scope.historyModal = function (item) {
            var modal = $uibModal.open({
                animation: false,
                size: 'lg',
                templateUrl: '/view/rental/rentPrice/modal.history.html',
                controller: 'historyProjectPrice',
                resolve: { item, item }
                });
            modal.result.then(function () {
                $scope.find();
                }, function () { 
            });
                }
        //删除
        $scope.deleteProject = function (item) {
            var params = {
                id: item.id,
                updatorId: app.user.personId,
                dataStatus: 0,
            }
            confirm("确定删除项目	[" + item.stageName + "租金定价" + item.code + "]?", function () {
                $http.post("/ovu-park/backstage/rental/project/updateProject", params, fac.postConfig).success(function (resp) {
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
            $scope.projectName = app.park.text;
            $scope.search.parkId = app.park.parkId;
            fac.initPage($scope, function () {
                $scope.find();
                $scope.getStageList();
            });
        });

    });
    // 新增项目 - 模态创
    app.controller('newProjectRent', function ($scope, $rootScope, $http, $filter, $uibModalInstance, fac) {
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
        $scope.item = {};
        $scope.item.creatorId = app.user.personId;
        $scope.item.parkId = app.park.parkId;
        $scope.item.code = "";
        // 获取 项目区域列表
        $scope.getStageList = function () {
            $http.post("/ovu-park/backstage/rental/project/getForRentalStageList", { parkId: app.park.parkId }, fac.postConfig).success(function (resp) {
                if (resp.code == 0) {
                    $scope.stageList = resp.data.stageList;
                    $scope.createTime = resp.data.createTime;
                } else {
                    window.alert(resp.message);
                }
            });
        }
        // 选择项目区域列表 

        $scope.changeStage = function (id) {
            angular.forEach($scope.stageList, function (value, key) {
                if (value.stageId === id) {
                    $scope.item.code = value.nextVersion;
                    $scope.item.stageName = value.stageName;
                }
            })
        }
        $scope.getStageList();
        // 保存 新增
        $scope.save = function (form) {
            if (!form.$valid) {
                window.alert('请完成并正确填写必填项！');
                return false;
            }
            $http.post("/ovu-park/backstage/rental/project/save", $scope.item, fac.postConfig).success(function (resp) {
                if (resp.code == 0) {
                    window.msg("保存成功");
                    $scope.cancel();
                } else {
                    window.alert(resp.message);
                }
            });
        }
    });
    // 审批项目 - 模态创
    app.controller('examProjectRent', function ($scope, $rootScope, $http, $filter, $uibModalInstance, fac, item) {
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    });
    // 历史记录 - 模态创
    app.controller('historyProjectPrice', function ($scope, $rootScope, $http, $filter, $uibModalInstance, fac, item) {
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
        // 获取列表
        $scope.search = {};
        $scope.pageModel = {};
        $scope.find = function (pageNo) {
            $.extend($scope.search, { currentPage: pageNo || $scope.pageModel.currentPage || 1, pageSize: $scope.pageModel.pageSize || 10 });
            $scope.search.pageIndex = $scope.search.currentPage - 1;
            $scope.search.totalCount = $scope.pageModel.totalCount || 0;
            $scope.search.projectId = item.id;
            fac.getPageResult("/ovu-park/backstage/rental/projectChangeHis/list", $scope.search, function (data) {
                $scope.pageModel = data;
                console.log($scope.pageModel);
            });
        };
        $scope.find();
    });
    // 租金定价状态  过滤器
    app.filter('rentPriceStatus', function () {
        return function (status) {
            switch (status) {
                case '0':
                    return '待提交';
                    break;
                case '1':
                    return '审批中';
                    break;
                case '2':
                    return '已通过';
                    break;
                case '3':
                    return '已驳回';
                    break;
            }
        }
    })
    app.filter("dateDay", function () {
        return function (str) {
            if (str) {
                return str.slice(0, 10)
            } else {
                return "--"
            }

        }
    });
})()
