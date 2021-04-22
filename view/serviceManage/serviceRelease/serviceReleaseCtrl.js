(function () {
    var app = angular.module("angularApp");
    // 水费账单
    app.controller('serviceRelease', function ($scope, $rootScope, $http, $filter, $uibModal, fac) {
        document.title = "OVU-服务发布";
        angular.extend($rootScope, fac.dicts);
        $scope.search = {};
        $scope.current = null;
        $scope.pageModel = {};
        $scope.firstServiceList = {};
        $scope.secondServiceList = {};
        var selectList = [];
        var param = {
            status: 1,
            serviceLevel: 1
        };
        app.modulePromiss.then(function () {
            $scope.find();
            // fac.initPage($scope, function () {
            //     param.parkId = app.park.ID
            //     $scope.find();
            // })
        });


        $scope.find = function () {
            fac.getResult("/ovu-park/backstage/serviceManage/list", {status: 1, serviceLevel: 1}, function (service) {
                $scope.firstServiceList = service.data;
                $scope.showSecond(service.data[0])
            });
        };

        $scope.showSecond = function (item) {
            console.log(item);

            if (!$scope.current) {
                $scope.current = angular.copy(item);
            }
            var param = {
                parentId: item.id
            };
            fac.getResult("/ovu-park/backstage/serviceManage/list", param, function (service) {
                $scope.secondServiceList = service.data;
                $scope.pageModel = {};
                $scope.showChild(service.data[0])
            });
        };

        $scope.showChild = function (item) {
            console.log(item);
            $scope.allFlag = false;
            selectList = []
            $scope.current = angular.copy(item);

            var param = {
                parentId: item.id,
                edition:1
            };
            fac.getResult("/ovu-park/backstage/serviceManage/list", param, function (service) {
                $scope.pageModel = service.data;

            });
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

        //批量发布
        $scope.morePub = function () {
            console.log(selectList);
            if (selectList.length) {
                var delList = selectList.toString();
                confirm("确认发布所选服务吗?", function () {
                    fac.getResult("/ovu-park/backstage/serviceManage/updateStatus", {
                        ids: delList,
                        status: 1
                    }, function (resp) {
                        window.msg("批量发布成功!");
                        $scope.showChild($scope.current);
                    });
                })
            } else {
                alert("请先选中服务!");
            }
            
        };

        $scope.pub = function (item) {
            var id = item.id;
            var status = item.status;

            confirm("确认" + (status == '1' ? '取消' : '发布') + "所选服务吗?", function () {
                if (status == 1) {
                    fac.getResult("/ovu-park/backstage/serviceManage/updateStatus", {
                        ids: id,
                        status: 0
                    }, function (resp) {
                        window.msg("取消服务成功!");
                        $scope.showChild($scope.current);
                    });
                } else {
                    item.checked = false;
                    fac.getResult("/ovu-park/backstage/serviceManage/updateStatus", {
                        ids: id,
                        status: 1
                    }, function (resp) {
                        window.msg("发布服务成功!");
                        $scope.showChild($scope.current);
                    });
                }
            })


        };

        $scope.del = function () {
            var delList = selectList.toString();
            if (selectList.length) {
                confirm("确认取消所选服务吗?", function () {
                    fac.getResult("/ovu-park/backstage/serviceManage/updateStatus", {
                        ids: delList,
                        status: 0
                    }, function (resp) {
                        window.msg("取消服务成功!");
                        $scope.showChild($scope.current);
                    });
                })
            } else {
                alert("请先选中服务!");
            }
            
        };

        $rootScope.$on("refresh", function (event) {
            $scope.showChild($scope.current);
        });

        $scope.delAll = function () {
            selectList = []
            angular.forEach($scope.pageModel, function (data, index, arrary) {
                data.checked = false;
            })
        }


        $scope.checkAll = function () {
            if ($scope.allFlag) {
                $scope.delAll();
                angular.forEach($scope.pageModel, function (data, index, arrary) {
                    $scope.selectOne(data)
                })
            }else{
                $scope.delAll();
            }

        }


    });
    // 新增分类=》编辑框组件
    app.controller('modal.serviceReleaseCtrl', function ($scope, $rootScope, $http, $uibModalInstance, $filter, $uibModal, fac, categorySetting) {

        // $scope.item = categorySetting;
        $scope.save = function (form) {
            if ($(".save").attr("disabled")) {
                return false;
            }
            form.$setSubmitted(true);
            if (!form.$valid) {
                return;
            }

            var selectList = categorySetting.selectList.toString();

            console.log($scope.item);


            fac.getResult("/ovu-park/backstage/serviceManage/updateStatus", {
                ids: selectList,
                status: 1
            }, function (resp) {
                $uibModalInstance.close();
                window.msg("发布服务成功!");
                $rootScope.$broadcast("refresh");
            });
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    });
})()
