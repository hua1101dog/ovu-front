// 数据源管理 
(function () {
    "use strict";
    var app = angular.module("angularApp");
    app.controller('dataSourceCtrl', ["$scope", "$http", "$filter", "$uibModal", "fac", "$rootScope", function ($scope, $http, $filter, $uibModal, fac, $rootScope) {
        document.title = "数据源管理";
        $scope.pageModel = {};
        $scope.search = {};
        app.modulePromiss.then(function () {
            $scope.$watch('dept.id', function (deptId, oldValue) {
                if (deptId) {
                    if ($scope.dept.parkId) {
                        $scope.search.parkId = $scope.dept.parkId;
                        $scope.find();
                    } else {
                        alert('请选择跟项目关联的部门');
                        $scope.search.parkId &&  delete $scope.search.parkId
                       
                    }

                }
            })
        });

        $scope.find = function (pageNo) {
            $.extend($scope.search, {
                currentPage: pageNo || $scope.pageModel.currentPage || 1,
                pageSize: $scope.pageModel.pageSize || 10
            });
            fac.getPageResult("/ovu-energy/energy/list.do", $scope.search, function (data) {
                console.log(data)
                $scope.pageModel = data;

            });
        };
        //新增修改
        $scope.showAddModal = function (task) {
            var copy = angular.extend({}, task);
            copy.isGroup = $scope.search.isGroup;
            if (!copy.parkId) {
                angular.extend(copy, { parkId: $scope.search.parkId })
            }
            var modal = $uibModal.open({
                animation: false,
                templateUrl: '../view/energy/dataSource/modal.dataSourceEdit.html',
                size: 'md',
                controller: 'dataSourceEditCtrl',
                resolve: { task: copy }
            });
            modal.result.then(function () {
                $scope.find();
            }, function () {
                $scope.find();
            });
        }
        //删除
        $scope.toDel = function (item) {

            confirm("确认删除该条记录吗?", function () {
                $http.get("/ovu-energy/energy/delete.do", {
                    params: {
                        datasourceId: item.datasourceId
                    }
                }).success(function (res) {
                    if (res.code==0) {
                        msg(res.msg)
                        $scope.find();
                    }else{
                        alert(res.msg)
                    }
                });
            })

        }

    }])

    app.controller('dataSourceEditCtrl', function ($scope, $uibModal, $uibModalInstance, $http, fac, task) {
        var vm = $scope.vm = this;
        $scope.item = {};
        $scope.item.datasourceType = 1
        //修改数据源
        if (fac.isNotEmpty(task.datasourceId)) {
            $http.get("/ovu-energy/energy/get.do", { params: { datasourceId: task.datasourceId } }).success(function (res) {

                angular.extend($scope.item, res.data);

            })
        }
        //切换类型
        
        //点击保存
        vm.save = function (form, item) {
            form.$setSubmitted(true);
            if (!form.$valid) {
                msg("请填写内容");
                return;
            }
            angular.extend(item, { parkId: task.parkId });
            $http.post("/ovu-energy/energy/edit.do", item,fac.postConfig).success(function (res) {
                if (res.code==0) {
                    $uibModalInstance.close();
                    msg("操作成功!");
                } else {
                    msg(res.msg);
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