(function () {
    "use strict";
    var app = angular.module("angularApp");
    // var checkParkId;


    app.controller('workcusCtrl', function ($scope, $rootScope, $uibModal, $http, $state, $filter, fac) {
        document.title = '工作流用户管理';
        $scope.pageModel = {};
        $scope.search = {};

        //判断是集团版还是项目版
        app.modulePromiss.then(function () {
            $scope.search = { isGroup: fac.isGroupVersion() };
            if ($scope.search.isGroup) {
                ($scope.search.parkId == undefined || $scope.search.parkId == 'undefined' || $scope.search.parkId == null) ? $scope.search.parkId = '' : $scope.search.parkId;
                // checkParkId = $scope.search.parkId;
                $scope.find();
            } else {
                $scope.$watch('park', function (newValue, oldValue) {
                    if (newValue && newValue.id) {
                        $scope.search.parkId = newValue.id;
                        // checkParkId = $scope.search.parkId;
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

            fac.getPageResult("/ovu-pcos/pcos/compact/roleuser/list", $scope.search, function (data) {
                $scope.pageModel = data;
            })
        };

        $scope.del = function (item) {
            confirm("确认删除该客户吗？", function () {
                $http.post('/ovu-pcos/pcos/compact/roleuser/del', { id: item.id }, fac.postConfig).success(function (data) {
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
            item == undefined ? item = { ss: '新增' } : item.ss = '修改';

            item.parkId = $scope.search.parkId;
            item.parkName = $scope.search.parkName;
            var modal = $uibModal.open({
                animation: false,
                size: 'md',
                templateUrl: '/view/agreement/agreementworkcus/modal.editworkcus.html',
                controller: 'editWorkCusCtrl',
                //resolve: { park: function(){ return copy; }}
                resolve: {
                    item: angular.copy(item),
                    search: $scope.search
                }
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

    app.controller("editWorkCusCtrl", function ($scope, $http, $uibModal, $uibModalInstance, $filter, fac, item, search) {
        //角色名称下拉框数据加载
        $http.post("/ovu-pcos/pcos/compact/checkrole/loadRoleList", { parkId: item.parkId }, fac.postConfig).success(function (data) {
            console.log('角色列表数据', data);
            $scope.role = data;
        })
        $scope.search = search;
        // var houseTreePromiss = fac.getHouseTree($scope, item.parkId);
        // //集团版, 用于选择项目
        // $scope.selectPark = function (node) {
        //     if (node.PARK_TYPE == 1) {
        //         item.PARK_NAME = node.fullPath;
        //         item.parkId = node.did;
        //         if (node.did) {
        //             houseTreePromiss = fac.getHouseTree($scope, item.parkId);
        //         }
        //     } else {
        //         alert("请先择项目！");
        //     }
        // }


        $scope.findParentDept = function () {
            modalDept.open({
                callback: function (node) {
                    if (node.id && node.text) {
                        if ($scope.search.id && $scope.search.id == node.id) {
                            alert("不能选择本机构为其上级机构!");
                            return;
                        }
                        $scope.search.parentName = node.text;
                        $scope.search.deptId = node.id;

                        console.log('$scope.search.deptId', $scope.search.deptId);
                        $scope.$apply();
                        $scope.loadUser();
                    }
                    modalDept.close();
                },
                parkId: item.parkId
            });
        };

        // console.log($scope.search.PARENT_NAME);
        //部门列表
        // $http.post("/ovu-pcos/pcos/compact/roleuser/loadDeptlist", {parkId:item.parkId}, fac.postConfig).success(function (data) {
        //     console.log('部门列表数据', data);
        //     $scope.dept = data;
        // })
        //用户列表
        $scope.loadUser = function(){
             $http.post("/ovu-pcos/pcos/compact/roleuser/loadUserlist", { deptId: $scope.search.deptId }, fac.postConfig).success(function (data) {
                console.log('用户列表数据', data);
                $scope.cus = data;
            })
        };
        // if ($scope.search.deptId) {
        //     $http.post("/ovu-pcos/pcos/compact/roleuser/loadUserlist", { deptId: $scope.search.deptId }, fac.postConfig).success(function (data) {
        //         console.log('用户列表数据', data);
        //         $scope.cus = data;
        //     })
        // }

        $scope.save = function (form, item) {
            form.$setSubmitted(true);
            if (!form.$valid) {
                return;
            }
            var data = {
                deptId: $scope.search.deptId,
                userId: $scope.userId,
                checkRoleId: $scope.roleId,
                parkId: $scope.search.parkId
            }
            $http.post('/ovu-pcos/pcos/compact/roleuser/edit', data, fac.postConfig).success(function (data) {
                if (data.status) {
                    $uibModalInstance.close();
                    msg("保存成功！");
                }else{
                    alert("保存失败");
                }
            })
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss("cancel");
        };

    })

})();
