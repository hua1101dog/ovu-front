(function () {
    "use strict";
    var app = angular.module("angularApp");
    app.controller('sanpCtrl', function ($scope, $rootScope, $http, $location, $filter, $uibModal, fac) {
        document.title = "视频抓拍";
        $scope.pageModel = {};
        $scope.search = {};
        $scope.config={};
        $scope.config.edit=false
        app.modulePromiss.then(function () {
            $scope.treeData = [];
            fac.initPage($scope, function () {
                $scope.loadHouseTree();

            })
        });

        //表格分页
        $scope.find = function (pageNo) {
            if (!fac.hasOnlyPark($scope.search)) {
                return;
            }
            $.extend($scope.search, { currentPage: pageNo || $scope.pageModel.currentPage || 1, pageSize: $scope.pageModel.pageSize || 10 });
            fac.getPageResult("/ovu-camera/pcos/videomanagement/camerinfo/pageList.do", $scope.search, function (data) {
                $scope.pageModel = data;
            });
        };
           /*
        $scope.selectNode = function (node) {

            if ($scope.curNode != node) {
                $scope.curNode && $scope.curNode.state && ($scope.curNode.state.selected = false);
            }
            node.state = node.state || {};
            node.state.selected = !node.state.selected;
            console.log(node);
            if (node.state.selected) {
                $scope.curNode = node;
                $scope.search.stageId = node.stageId;
                $scope.search.floorId = node.floorId;
                if (node.floorId) {
                    $scope.search.stageId = node.pid;
                    $scope.search.floorId = node.floorId;
                }


            }
            else {
                delete $scope.curNode;
                delete $scope.search.stageId;
                delete $scope.search.floorId;

            }
            $scope.find(1);
        }
        $scope.loadHouseTree = function () {
            $http.post("/ovu-camera/pcos/videomanagement/camerinfo/floorTreeWithCaremaCnt.do", {
                parkId: $scope.search.parkId,
                // onlyFloor: true
            }, fac.postConfig).success(function (treeData) {
                $scope.flatData = fac.treeToFlat(treeData);
                $scope.flatData.forEach(function (n) {
                    n.floorId ? (n.isLeaf = true) : (n.isLeaf = false);
                });
                $scope.treeData = treeData;

                if (!fac.hasOnlyPark($scope.search)) {
                    $scope.pageModel = {};
                } else {
                    $scope.find();
                }
            });

        }
        */
        $scope.selectNode = function (node) {
            if ($scope.curNode != node) {
                $scope.curNode && $scope.curNode.state && ($scope.curNode.state.selected = false);
            }
            node.state = node.state || {};
            node.state.selected = !node.state.selected;
            if (node.state.selected) {
                $scope.curNode = node;
                if (node.level == 1) {
                    $scope.search.buildId && delete $scope.search.buildId;
                    $scope.search.unitNo && delete $scope.search.unitNo;
                    $scope.search.groundNo && delete $scope.search.groundNo;

                    $scope.search.stageId = node.id;

                } else if (node.level == "2") {
                    $scope.search.unitNo && delete $scope.search.unitNo;
                    $scope.search.groundNo && delete $scope.search.groundNo;
                    $scope.search.stageId = node.parentId;
                    $scope.search.buildId = node.id;
                } else if (node.level == "3") {
                    $scope.search.groundNo && delete $scope.search.groundNo;
                    $scope.search.stageId = node.id.split("_")[0];
                    $scope.search.buildId = node.parentId;
                    $scope.search.unitNo = node.data;

                } else if (node.level == "4") {
                    $scope.search.stageId = node.id.split("_")[0];
                    $scope.search.buildId = node.id.split("_")[1];
                    $scope.search.unitNo = node.id.split("_")[2];
                    $scope.search.groundNo = node.data;
                }
            } else {
                delete $scope.search.stageId;
                delete $scope.search.buildId;
                delete $scope.search.unitNo;
                delete $scope.search.groundNo;
            }
            $scope.find();
        }

        $scope.loadHouseTree = function () {
            $http.post("/ovu-base/system/parkStage/tree.do", {

                parkId: $scope.search.parkId,
                level: "4",
            }, fac.postConfig).success(function (treeData) {
                $scope.flatData = fac.treeToFlat(treeData);
                $scope.flatData.forEach(function (n) {
                    // n.floorId ? (n.isLeaf = true) : (n.isLeaf = false);
                    n.buildNo ? (n.isLeaf = true) : (n.isLeaf = false);
                });
                $scope.treeData = treeData;

                if (!fac.hasOnlyPark($scope.search)) {
                    $scope.pageModel = {};
                } else {
                    $scope.find();
                }
            });

        }
        //策略详情打开模态框
        $scope.showDetailsModal = function (task) {
            if (!fac.hasActivePark($scope.search)) {
                return;
            }
            var copy = angular.extend({}, task);
            copy.isGroup = $scope.search.isGroup;
            if (!copy.parkId) {
                angular.extend(copy, { parkId: $scope.search.parkId, parkName: $scope.search.parkName })
            }
            var modal = $uibModal.open({
                animation: false,
                templateUrl: '../view/videomanagement/snap/modal.strategiesDetails.html',
                size: 'max',
                controller: 'strategiesDetailCtrl',
                controllerAs: 'vm',
                resolve: { task: copy }
            })
            modal.result.then(function () {
                $scope.find();
            });
        }
        //设置策略打开模态框
        // $scope.showSetModal = function (task) {

        //     if (!fac.hasActivePark($scope.search)) {
        //         return;
        //     }
        //     var copy = angular.extend({}, task);
        //     copy.isGroup = $scope.search.isGroup;
        //     if (!copy.PARK_ID) {
        //         angular.extend(copy, { PARK_ID: $scope.search.parkId,cameraId:task.id })
        //     }
        //     delete  copy.id;
        //     var modal = $uibModal.open({
        //         animation: false,
        //         templateUrl: '../view/videomanagement/snap/modal.strategiesSet.html',
        //         size: 'md',
        //         controller: 'strategiesSetCtrl',
        //         controllerAs: 'vm',
        //         resolve: { task: copy }
        //     })
        //     modal.result.then(function () {
        //         $scope.find();
        //     });
        // }
        //抓拍记录
        $scope.record = function (item) {
            var url = "/view/videomanagement/screenconfRecord.html?code=" + item.code + "&name=" + item.name + "&cameraPosition=" + item.cameraPosition;

            window.open(url, '_blank');
            // $location.url('/videomanagement/screenconfRecord').search({ code: code });
        }
    });
    //策略详情
    app.controller("strategiesDetailCtrl", function ($scope, $uibModal, $uibModalInstance, $http, fac, task) {
        var vm = $scope.vm = this;
        $scope.search = {};
        $scope.pageModel = "";
        var relatives = {};
        //策略详情列表
        if (fac.isNotEmpty(task.id)) {
            $scope.find = function (pageNo) {
                $.extend($scope.search, { currentPage: pageNo || $scope.pageModel.currentPage || 1, pageSize: $scope.pageModel.pageSize || 10, cameraId: task.id });
                fac.getPageResult("/ovu-camera/pcos/videomanagement/screenconf/pagelist.do", $scope.search, function (data) {
                    $scope.pageModel = data || [];
                });
            };
        }
        $scope.find();

        //修改策略
        vm.showEditModal = function (item) {
            var copy = angular.extend({}, item);
            copy.isGroup = $scope.search.isGroup;
            if (!copy.parkId) {
                angular.extend(copy, { parkId: $scope.search.parkId, cameraId: task.id })
            }
            var modal = $uibModal.open({
                animation: false,
                templateUrl: '../view/videomanagement/snap/modal.strategiesSet.html',
                size: 'md',
                controller: 'strategiesSetCtrl',
                controllerAs: 'vm',
                resolve: { task: copy }
            })
            modal.result.then(function () {
                $scope.find();
            });
        }
        //删除策略
        vm.del = function (id) {
            confirm("确认删除该策略吗?", function () {
                $http.get("/ovu-camera/pcos/videomanagement/screenconf/delete?ids=" + id).success(function (msg) {
                    if (msg.success) {
                        $scope.find();
                    } else {
                        alert();
                    }
                })
            })
        }
        // vm.save = function (form, item) {
        //     $uibModalInstance.close();
        // }
        //点击取消
        vm.cancel = function () {
            $uibModalInstance.close();
        };
    })
    //策略设置
    app.controller("strategiesSetCtrl", function ($scope, $uibModal, $uibModalInstance, $http, fac, task) {
        var vm = $scope.vm = this;
        $scope.item = {};
        $scope.item.screenConfType = 1;
        // $scope.item.screenConfType="时间间隔";
        vm.camera = [];
        $scope.item.cameraId = task.cameraId;
        //查看详情
        if (fac.isNotEmpty(task.id)) {
            $http.get('/ovu-camera/pcos/videomanagement/screenconf/get.do', { params: { id: task.id } }).success(function (res) {
                angular.extend($scope.item, res.data);
            })
        }
        //获取摄像头编码列表
        $http.get("/ovu-camera/pcos/videomanagement/camerinfo/list.do").success(function (data) {
            vm.camera = data;
            //根据摄像机id查询线路list
            var camerainfoNo = vm.camera.reduce(function (ret, n) {
                (n.id == task.cameraId) && ret.push(n.code);
                return ret;
            }, []).join();
            $scope.item.cameraCode = camerainfoNo;
            $http.get("/ovu-camera/pcos/videomanagement/route/getRouteList.do", { params: { camerainfoNo: camerainfoNo } }).success(function (data, status, headers, config) {
                $scope.routeList = data.data;
            });
        });

        //点击保存
        vm.save = function (form, item) {
            form.$setSubmitted(true);
            if (!form.$valid) {
                return;
            }
            delete item.createTime;
            if (item.screenConfType == 1) {
                delete item.fixedTime;
            } else {
                // delete item.spaceSec
            }
            // delete item.screenConfType;
            // angular.extend(item,{screenConfType:"1"});
            // angular.extend(item, {createTime: moment().format('YYYY-MM-DD HH:mm:ss')});
            $http.post("/ovu-camera/pcos/videomanagement/screenconf/edit.do", item, fac.postConfig).success(function (res) {
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
        };
    })
})();
