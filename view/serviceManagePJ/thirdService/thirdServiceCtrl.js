(function () {
    var app = angular.module("angularApp");
    // 水费账单
    app.controller("thirdServicePJ", function (
        $scope,
        $rootScope,
        $http,
        $filter,
        $uibModal,
        fac
    ) {
        document.title = "OVU-三级服务";
        angular.extend($rootScope, fac.dicts);
        $scope.search = {};
        $scope.current = null;
        $scope.pageModel = {};
        $scope.firstServiceList = {};
        $scope.secondServiceList = {};
        var selectList = [];
        var param = {
            status: 1,
            serviceLevel: 1,
        };
        app.modulePromiss.then(function () {
            fac.initPage($scope, function () {
                param.parkId = app.park.parkId;
                $scope.find();
            });
        });

        $scope.find = function () {
            fac.getResult(
                "/ovu-park/backstage/serviceManage/list",
                {
                    status: 1,
                    serviceLevel: 1,
                    parkId: app.park.parkId,
                },
                function (service) {
                    $scope.firstServiceList = service.data;
                    $scope.showSecond(service.data[0]);
                }
            );
        };

        $scope.showSecond = function (item) {
            $scope.current = angular.copy(item);
            var param = {
                parentId: item.id,
                parkId: app.park.parkId,
            };
            fac.getResult(
                "/ovu-park/backstage/serviceManage/list",
                param,
                function (service) {
                    $scope.secondServiceList = service.data;
                    $scope.pageModel = {};
                    $scope.showChild(service.data[0]);
                    //
                }
            );
        };

        $scope.showChild = function (item) {
            $scope.current = angular.copy(item);
            selectList = [];
            var param = {
                parentId: item.id,
                parkId: app.park.parkId,
            };
            fac.getResult(
                "/ovu-park/backstage/serviceManage/list",
                param,
                function (service) {
                    $scope.pageModel = service.data;
                }
            );
        };

        $scope.selectOne = function (product) {
            if (!product.checked) {
                selectList.push(product.id);
                product.checked = !product.checked;
            } else {
                selectList.splice(selectList.indexOf(product.id), 1);
                product.checked = !product.checked;
            }
            if (selectList.length == $scope.pageModel.length) {
                $scope.allFlag = true
            } else {
                $scope.allFlag = false
            }
        };

        //添加/修改
        $scope.showEditModal = function (item) {
            if (!fac.checkPark($scope)) {
                return;
            }
            // 服务类别
            var copy = angular.extend({}, $scope.current);
            // 编辑 - 选中服务
            var item = item ? item : {};
            var modal = $uibModal.open({
                animation: false,
                size: "md",
                templateUrl:
                    "/view/serviceManagePJ/thirdService/modal.thirdService.html",
                controller: "modal.thirdServiceCtrl",
                resolve: {
                    categorySetting: copy,
                    item: item,
                },
            });
            modal.result.then(
                function () {
                    // $scope.find();
                    $scope.showChild($scope.current);
                },
                function () {
                    console.info("Modal dismissed at: " + new Date());
                }
            );
            event.stopPropagation();
        };

        $scope.del = function () {
            var delList = selectList.toString();
            confirm("确认删除该服务分类吗?", function () {
                fac.getResult(
                    "/ovu-park/backstage/serviceManage/remove",
                    { ids: delList, edition: "2" },
                    function (resp) {
                        window.msg("删除成功!");
                        $scope.showChild($scope.current);
                    }
                );
            });
        };

        $rootScope.$on("refresh", function (event) {
            $scope.showChild($scope.current);
        });

        $scope.delAll = function () {
            selectList = [];
            angular.forEach($scope.pageModel, function (data, index, arrary) {
                data.checked = false;
            });
        };

        $scope.checkAll = function () {
            if ($scope.allFlag) {
                $scope.delAll();
                angular.forEach($scope.pageModel, function (
                    data,
                    index,
                    arrary
                ) {
                    $scope.selectOne(data);
                });
            } else {
                $scope.delAll();
            }
        };
    });
    // 新增分类=》编辑框组件
    app.controller("modal.thirdServiceCtrl", function (
        $scope,
        $rootScope,
        $http,
        $uibModalInstance,
        $filter,
        $uibModal,
        fac,
        categorySetting,
        item
    ) {
        var cache = {
            useType: item.useType ? item.useType + "" : "1",
            serviceType: item.serviceType ? item.serviceType + "" : "1",
            limitLevel: item.limitLevel ? item.limitLevel + "" : "1",
            isDevelop:
                item.isDevelop == 0 || item.isDevelop == 1
                    ? item.isDevelop + ""
                    : "1",
            isDefault:
                item.isDefault == 0 || item.isDefault == 1
                    ? item.isDefault + ""
                    : "0",
            isMinapp:
                item.isMinapp == 0 || item.isMinapp == 1
                    ? item.isMinapp + ""
                    : "0",
            status:
                item.status == 0 || item.status == 1 ? item.status + "" : "1",
            parentId: categorySetting.id,
            parentServiceName: categorySetting.serviceName,
        };
        $scope.userClassify = {
            enterprise:
                item.permission && item.permission.indexOf("2") != -1
                    ? true
                    : false,
            virtualCom:
                item.permission && item.permission.indexOf("0") != -1
                    ? true
                    : false,
            staff:
                item.permission && item.permission.indexOf("3") != -1
                    ? true
                    : false,
            personal:
                item.permission && item.permission.indexOf("1") != -1
                    ? true
                    : false,
            hide:
                item.permission && item.permission.indexOf("4") != -1
                    ? true
                    : false,
        };
        $scope.item = {};
        angular.extend($scope.item, item, cache);
        // if(JSON.stringify(item) != "{}"){
        //     angular.extend($scope.item,item);
        //     $scope.item.useType = $scope.item.useType+"";
        //     $scope.item.serviceType = $scope.item.serviceType+"";
        //     $scope.item.limitLevel = $scope.item.limitLevel+"";
        //     $scope.item.isDevelop = $scope.item.isDevelop+"";
        //     status
        // }else{
        //     angular.extend($scope.item,cache);
        // }
        fac.getResult(
            "/ovu-park/backstage/serviceManage/getOrderNo",
            { parentId: categorySetting.id },
            function (success) {
                $scope.item.orderNo = success.orderNo;
            }
        );

        $scope.save = function (form) {
            if ($(".save").attr("disabled")) {
                return false;
            }
            if (!$scope.item.appLogoUrl && !$scope.item.logoUrl) {
                alert("必须上传图片");
                return false;
            }
            form.$setSubmitted(true);
            if (!form.$valid) {
                return;
            }
            //用户分类
            if (
                !$scope.userClassify.virtualCom &&
                !$scope.userClassify.personal &&
                !$scope.userClassify.enterprise &&
                !$scope.userClassify.staff && 
                !$scope.userClassify.hide
            ) {
                alert("请勾选用户权限");
                return false;
            }
            var tempArr = [];
            $scope.userClassify.virtualCom && tempArr.push("0");
            $scope.userClassify.personal && tempArr.push("1");
            $scope.userClassify.enterprise && tempArr.push("2");
            $scope.userClassify.staff && tempArr.push("3");
            $scope.userClassify.hide && tempArr.push("4");
            $scope.item.permission = tempArr.join(",");

            // 字段补全
            $scope.item.serviceLevel = "3";
            $scope.item.edition = categorySetting.edition;
            $scope.item.parkId = app.park.parkId;

            fac.getResult(
                "/ovu-park/backstage/serviceManage/saveOrEdit",
                $scope.item,
                function (resp) {
                    $uibModalInstance.close();
                    window.msg("添加服务分类成功!");
                    $rootScope.$broadcast("refresh");
                }
            );
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss("cancel");
        };
    });
})();
