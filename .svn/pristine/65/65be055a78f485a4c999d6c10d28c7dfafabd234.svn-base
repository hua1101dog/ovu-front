//租户管理
(function () {
    var app = angular.module("angularApp");
    app.controller("tenantCtrl", function ($scope, $rootScope, $http, $filter, $uibModal, fac) {
        document.title = "租户管理";
        $scope.pageModel = {};
        $scope.search = {};
        $scope.id = "";
        //租户分页
        $scope.find = function (pageNo) {
            angular.extend($scope.search, { currentPage: pageNo || $scope.pageModel.currentPage || 1, pageSize: $scope.pageModel.pageSize || 10, reportType: 1 });
            fac.getPageResult("/ovu-base/owner/tenant/list.do", $scope.search, function (data) {
                data.data && data.data.forEach(function(v){
                  
                    v.ownerTel && (v.ownerTel=v.ownerTel.split(','));
                    v.ownerName && (v.ownerName=v.ownerName.split(','));
                    v.beginTime && (v.beginTime=v.beginTime.split(','));
                    v.endTime && (v.endTime=v.endTime.split(','));

                })
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
                templateUrl: '../view/newowner/tenant/modal.tenantEdit.html',
                size: 'md',
                controller: 'tenantEditCtrl',
                resolve: { task: copy }

            });
            modal.result.then(function () {
                $scope.find();
            }, function () {
                $scope.find();
            });

        }


        //删除租户
        $scope.delAll = function () {
            var ids = $scope.pageModel.list.reduce(function (ret, n) { n.checked && ret.push(n.id); return ret }, []);
            delGroup(ids);
        };
        $scope.del = function (item) {
            delGroup([item.id]);
        }

        function delGroup(ids) {
            confirm("确认删除选中的" + ids.length + "条记录?", function () {
                $http.post("/ovu-base/owner/tenant/delete.do", { "ownerTenantIds": ids.join() }, fac.postConfig).success(function (resp) {
                    if (resp.code=="0") {
                        $scope.find();
                        msg(resp.msg);
                    } else {
                        msg(resp.msg);
                    }
                })
            });
        }

        //批量导出
        $scope.outputAll = function () {
            var ids = $scope.pageModel.list.reduce(function (ret, n) { n.checked && ret.push(n.id); return ret }, []);

            if (ids != '') {
                window.location.href = "/ovu-pcos/pcos/newowner/tanant/export?ids=" + ids;
            }
            else {
                msg("请勾选下面条目");
            }

        }
    })
    //租户编辑模块
    app.controller("tenantEditCtrl", function ($scope, $uibModal, $uibModalInstance, $http, fac, task) {
        var vm = $scope.vm = this;
        $scope.item = {};
        //修改租户
        if (fac.isNotEmpty(task.id)) {
            $http.post("/ovu-base/owner/tenant/detail.do", { ownerTenantId: task.id }, fac.postConfig).success(function (res) {

                angular.extend($scope.item, res.data);

            })
        }

        //选择业主

        $scope.item.status = 1;

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
                    $scope.item.ownerTel = data.phone;
                    $scope.item.houseNo = data.houseNo;
                    $scope.item.ownerId = data.id;
                    $scope.item.houseId = data.houseId;

                }
            });
        }
        //点击保存
        vm.save = function (form, item) {

            var tenant = { parkId: task.PARK_ID, ownerId: $scope.item.ownerId };

            form.$setSubmitted(true);
            if (!form.$valid) {
                msg("请填写内容");
                return;
            }
            tenant = angular.extend(tenant, item);

            $http.post("/ovu-base/owner/tenant/edit.do", tenant, fac.postConfig).success(function (res) {
                if (res.code=="0") {
                    $uibModalInstance.close();
                    msg(res.msg);
                    $scope.find();
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