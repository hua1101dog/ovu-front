//访客管理
(function () {
    var app = angular.module("angularApp");
    app.controller("visitorCtrl", function ($scope, $rootScope, $http, $filter, $uibModal, fac) {
        document.title = "访客管理";
        $scope.pageModel = {};
        $scope.search = {};
        $scope.id = "";

        $scope.find = function (pageNo) {
            angular.extend($scope.search, { currentPage: pageNo || $scope.pageModel.currentPage || 1, pageSize: $scope.pageModel.pageSize || 10, reportType: 1 });
            fac.getPageResult("/ovu-pcos/pcos/newowner/visitor/queryList.do", $scope.search, function (data) {
                $scope.pageModel = data;
            });
        };


        app.modulePromiss.then(function () {
            fac.initPage($scope, function () {
                $scope.find();
            }, function () {
                $scope.find();
            });

        })

        //新增修改

        $scope.showAddModal = function (task) {
            var copy = angular.extend({}, task);
            copy.isGroup = $scope.search.isGroup;
            if (!copy.PARK_ID) {
                angular.extend(copy, { PARK_ID: $scope.search.parkId, PARK_NAME: $scope.search.PARK_NAME })
            }
            var modal = $uibModal.open({
                animation: false,
                templateUrl: '../view/newowner/visitor/modal.visitorEdit.html',
                size: 'md',
                controller: 'visitorEditCtrl',
                resolve: { task: copy }
            });
            modal.result.then(function () {
                $scope.find();
            }, function () {
                 $scope.find();
            });

        }


        //删除访客
        $scope.delAll = function () {
            var ids = $scope.pageModel.list.reduce(function (ret, n) { n.checked && ret.push(n.id); return ret }, []);
            delGroup(ids);
        };
        $scope.del = function (item) {
            delGroup([item.id]);
        }

        function delGroup(ids) {
            confirm("确认删除选中的" + ids.length + "条记录?", function () {
                $http.post("/ovu-pcos/pcos/newowner/visitor/delete.do", { "ids": ids.join() }, fac.postConfig).success(function (resp) {
                    if (resp.success) {
                        $scope.find();
                    } else {
                        msg(resp.error);
                    }
                })
            });
        }

        //批量导出
        $scope.outputAll = function () {
            var ids = $scope.pageModel.list.reduce(function (ret, n) { n.checked && ret.push(n.id); return ret }, []);

            if (ids != '') {
                window.location.href = "/ovu-pcos/pcos/newowner/visitor/export?ids=" + ids + "&parkId=" + $scope.search.parkId;
            }
            else {
                msg("请勾选下面条目");
            }

        }

    })
    //访客编辑模块
    app.controller("visitorEditCtrl", function ($scope, $uibModal, $uibModalInstance, $http, fac, task) {
        var vm = $scope.vm = this;
        $scope.item = {};
        //修改租户
        if (fac.isNotEmpty(task.id)) {
            $http.post("/ovu-pcos/pcos/newowner/visitor/detail.do", { id: task.id }, fac.postConfig).success(function (res) {

                angular.extend($scope.item, res);

            })
        }

        //选择业主
        $scope.item = {};
        $scope.selectOwner = function () {
            var modal = $uibModal.open({
                animation: false,
                size: 'lg',
                templateUrl: '/common/modal.select.owner.html',
                controller: 'ownerSelectorCtrl'
                , resolve: { data: function () { return { parkId: task.PARK_ID }; } }
            });
            modal.result.then(function (data) {
                if (data) {
                    $scope.item.ownerName = data.name;
                    $scope.item.ownerPhone = data.phone;
                    $scope.item.houseNo = data.houseNo;
                    $scope.item.ownerId = data.id;
                    $scope.item.houseId = data.houseId;
                }
            });
        }
        //点击保存
        vm.save = function (form, item) {

            var visitor = { parkId: task.PARK_ID, ownerId: $scope.item.ownerId };
            form.$setSubmitted(true);
            if (!form.$valid) {
                msg("请填写内容");
                return;
            }
            visitor = angular.extend(visitor, item);
            $http.post("/ovu-pcos/pcos/newowner/visitor/edit.do", visitor, fac.postConfig).success(function (res) {
                if (res.success) {
                    $uibModalInstance.close();
                    msg("操作成功!");
                } else {
                    msg("操作失败!");
                    $uibModalInstance.close();
                }

            })
        }
        //点击取消
        vm.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        }

    })
})()