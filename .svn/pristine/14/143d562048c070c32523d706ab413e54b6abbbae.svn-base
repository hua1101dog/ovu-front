/**
 * Created by chenxi on 2018/3/7.
 */
(function () {
    "use strict";
    var app = angular.module("angularApp");
    app.controller('vedeoCloseCtrl', function ($scope, $rootScope, $http, $filter, $uibModal, fac) {

        document.title = "视频关闭列表";
        $scope.search = {};
        $scope.pageModel = {};
        $scope.config={};
        $scope.config.edit=false
        // app.modulePromiss.then(function () {
        //     fac.initPage($scope, function () {
        //         $scope.find()
        //     }, function () {
        //         $scope.find()
        //     })
        // })
        app.modulePromiss.then(function () {
            $scope.treeData = [];
            fac.initPage($scope, function () {
                $scope.loadHouseTree();
            })

        });
        //分页
        $scope.find = function (pageNo) {
            angular.extend($scope.search, { currentPage: pageNo || $scope.pageModel.currentPage || 1, pageSize: $scope.pageModel.pageSize || 10,enable:'1'  });
            fac.getPageResult('/ovu-camera/pcos/videomanagement/device/list.do', $scope.search, function (res) {
                $scope.pageModel = res;
            })
        }
        //关闭摄像机
        $scope.close = function (id) {
            var layerIndex = layer.load(1, {
                shade: [0.2, '#000'] //0.1透明度的白色背景
            });
            $http.get("/ovu-camera/pcos/videomanagement/device/getClose?id=" + id).success(function (data, status, headers, config) {
                layer.close(layerIndex);
                if (data.success) {
                    $scope.find();
                    msg("操作成功");
                } else {
                    alert("操作失败");
                }
            }) 
        }  
        /*
        $scope.selectNode = function (node) {
            if ($scope.curNode != node) {
                $scope.curNode && $scope.curNode.state && ($scope.curNode.state.selected = false);
            }
            node.state = node.state || {};
            node.state.selected = !node.state.selected;
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
            $http.post("/ovu-pcos/pcos/videomanagement/camerinfo/floorTreeWithCaremaCnt.do", {
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
    });
    
                   

})();