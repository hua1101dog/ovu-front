(function () {
    "use strict";
    var app = angular.module("angularApp");

    //客户管理ctrl
    app.controller("workroleCtrl", function ($scope, $rootScope, $uibModal, $http, $state, $filter, fac) {
        document.title = "工作流角色管理";
        $scope.pageModel = {};
        $scope.search = {};

        $scope.callback = function () {
            $scope.find();

        }

        //判断当前是集团版还是项目版
        app.modulePromiss.then(function () {
            $scope.search = { isGroup: fac.isGroupVersion() };
            if ($scope.search.isGroup) {
                ($scope.search.parkId == undefined || $scope.search.parkId == 'undefined' || $scope.search.parkId == null) ? $scope.search.parkId = '' : $scope.search.parkId;

                console.log($scope.search);
                $scope.find();
            } else {
                $scope.$watch('park', function (newValue, oldValue) {
                    if (newValue && newValue.id) {
                        $scope.search.parkId = newValue.id;

                        //$scope.search.PARK_NAME = newValue.PARK_NAME;
                        $scope.find();
                    } else {
                        alert("请先选定一个项目");
                    }
                });
            }
        });

        $scope.find = function (pageNo) {
            $.extend($scope.search, { currentPage: pageNo || 1, pageSize: $scope.pageModel.pageSize || 10 });
            $scope.search.pageIndex = $scope.search.currentPage - 1;

            fac.getPageResult("/ovu-pcos/pcos/compact/checkrole/list", $scope.search, function (data) {
                $scope.pageModel = data;
            })
        };


        $scope.del = function (item) {
            confirm("确认删除该客户吗？", function () {
                $http.post('/ovu-pcos/pcos/compact/checkrole/del', { roleId: item.roleId }, fac.postConfig).success(function (data) {
                    if (data.status) {
                        $scope.find();
                        msg(data.msg);
                    } else {
                        msg(data.msg);
                    }
                })

            })
        };

        //编辑模态窗口
        $scope.showModal = function (item) {
            
            item == undefined ? item = { ss: '新增', roleId: undefined } : item.ss = '修改';
            item.parkId = $scope.search.parkId;
            var modal = $uibModal.open({
                animation: false,
                size: 'md',
                templateUrl: '/view/agreement/agreementworkrole/modal.editworkrole.html',
                controller: 'editWorkRoleCtrl',
                //resolve: { park: function(){ return copy; }}
                resolve: { item: angular.copy(item) }
            });
            modal.result.then(function () {
                $scope.find();
            });
            modal.rendered.then(function () {
                console.log("Modal rendered");
            });
            modal.opened.then(function () {
                console.log("Modal opened");
            });


        };


    });

    app.controller("editWorkRoleCtrl", function ($scope, $http, $uibModal, $uibModalInstance, $filter, fac, item) {
        console.log(item)
        $scope.item = item;
        $scope.checkRoleName = item.checkRoleName;
        //加载下拉列表
        $http.post("/ovu-pcos/pcos/compact/classify/loadClassifyList", {parkId:item.parkId}, fac.postConfig).success(function (data) {
            console.log('分类列表数据', data);
            $scope.map = data;
            if (item.classifyId) {
                $scope.classifyId = item.classifyId;
            }
        });
        // if (item.classifyId) {
        //     $scope.classifyId = item.classifyId;
        // }

        $scope.save = function (form, item) {
            console.log(item);
            // item.parkId = parkId;

            form.$setSubmitted(true);
            if (!form.$valid) {
                return;
            }
            var data = {
                roleId: item.roleId,
                parkId: $scope.item.parkId,
                checkRoleName: $scope.checkRoleName,
                classifyId: $scope.classifyId
            }
            var info = {
                parkId: $scope.item.parkId,
                checkRoleName: $scope.checkRoleName,
                classifyId: $scope.classifyId
            }
            if (item.ss == '新增') {
                $http.post("/ovu-pcos/pcos/compact/checkrole/edit", info, fac.postConfig).success(function (data, status, headers, config) {
                    if (data.status) {
                        $uibModalInstance.close();
                        msg("保存成功！");
                    } else {
                        alert("保存失败");
                    }
                })
            } else {
                $http.post("/ovu-pcos/pcos/compact/checkrole/edit", data, fac.postConfig).success(function (data, status, headers, config) {
                    if (data.status) {
                        $uibModalInstance.close();
                        msg("保存成功！");
                    } else {
                        alert("保存失败");
                    }
                })
            }

        }

        $scope.cancel = function () {
            $uibModalInstance.dismiss("cancel");
        };
    });

})();
