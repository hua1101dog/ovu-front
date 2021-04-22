(function () {
    "use strict";
    var app = angular.module("angularApp");
    app.controller('relativeManageCtrl', function ($scope, $rootScope, $http, $filter, $uibModal, fac) {
        document.title = "业主亲属管理";
        $scope.pageModel = {};
        $scope.search = {};
        $scope.config={};
        $scope.config.edit=false
        app.modulePromiss.then(function () {
           $scope.treeData=[];
            fac.initPage($scope, function () {
                $scope.loadHouseTree();

            })
         });
        $scope.init=function(){
            $scope.loadHouseTree();

        }
        //业主分页
        $scope.find = function (pageNo) {
            if (!fac.hasOnlyPark($scope.search)) {
                return;
            }
            $.extend($scope.search, { currentPage: pageNo || $scope.pageModel.currentPage || 1, pageSize: $scope.pageModel.pageSize || 10 });
            fac.getPageResult("/ovu-base/owner/list2.do", $scope.search, function (data) {
                data.data && data.data.forEach(function(v){
                  
                    v.name && (v.name=v.name.split(','));
                    v.idCard && (v.idCard=v.idCard.split(','));
                    v.ownerUnit && (v.ownerUnit=v.ownerUnit.split(','));
                    v.phone && (v.phone=v.phone.split(','));

                })
                $scope.pageModel = data;

            });
        };

        // $scope.selectNode = function (node) {
        //     if ($scope.curNode != node) {
        //         $scope.curNode && $scope.curNode.state && ($scope.curNode.state.selected = false);
        //     }
        //     node.state = node.state || {};
        //     node.state.selected = !node.state.selected;
        //     if (node.state.selected) {
        //         $scope.curNode = node;
        //         $scope.search.stageId = node.stageId;
        //         $scope.search.floorId = node.floorId;
        //         if (!node.nodes) {
        //             $scope.search.unitNum = node.unitNum;
        //         } else {

        //             $scope.search.unitNum = null;
        //         }

        //     } else {
        //         delete $scope.curNode;
        //         delete $scope.search.stageId;
        //         delete $scope.search.floorId;
        //         delete $scope.search.unitNum;
        //     }
        //     $scope.find();
        // }
        $scope.selectNode = function (node) {
            console.log(node);
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
                $scope.search.groundNo && delete  $scope.search.groundNo;

                $scope.search.stageId = node.id;

            } else if (node.level == "2") {
                $scope.search.unitNo && delete $scope.search.unitNo;
                $scope.search.groundNo && delete  $scope.search.groundNo;
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
        }else {
             delete $scope.search.stageId;
             delete $scope.search.buildId;
             delete $scope.search.unitNo;
             delete $scope.search.groundNo;
           }
           $scope.find();
        }
        // $scope.loadHouseTree = function () {
        //     $http.post("/ovu-base/system/parkStage/tree.do", {

        //         parkId: $scope.search.parkId,
        //         onlyFloor: true
        //     }, fac.postConfig).success(function (treeData) {
        //         $scope.flatData = fac.treeToFlat(treeData);
        //         $scope.flatData.forEach(function (n) {
        //             // n.floorId ? (n.isLeaf = true) : (n.isLeaf = false);
        //             n.buildNo ? (n.isLeaf = true) : (n.isLeaf = false);
        //         });
        //         $scope.treeData = treeData;

        //         if (!fac.hasOnlyPark($scope.search)) {
        //             $scope.pageModel = {};
        //         } else {
        //             $scope.find();
        //         }
        //     });

        // }
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
        //设置亲属打开模态框
        $scope.showAddModal = function (task) {

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
                templateUrl: '../view/newowner/relative/modal.relativeEdit.html',
                size: 'md',
                controller: 'relativeEditCtrl',
                controllerAs: 'vm',
                resolve: { task: copy }
            })
            modal.result.then(function () {
                $scope.find();
            });
        }

        //批量导出
        $scope.outputAll = function () {
            var ids = $scope.pageModel.list.reduce(function (ret, n) { n.checked && ret.push(n.id); return ret }, []);

            if (ids != '') {
                window.location.href = "/ovu-pcos/pcos/newowner/relative/export?ids=" + ids;
            }
            else {
                msg("请勾选下面条目");
            }

        }

    });

    //设置亲属
    app.controller("relativeEditCtrl", function ($scope, $uibModal, $uibModalInstance, $http, fac, task) {
        var vm = $scope.vm = this;
        $scope.search = {};


        $scope.pageModel = "";

        var relatives = {};

        //查看详情
        if (fac.isNotEmpty(task.id)) {
            $scope.find = function (pageNo) {
                $.extend($scope.search, { currentPage: pageNo || $scope.pageModel.currentPage || 1, pageSize: $scope.pageModel.pageSize || 1000, houseId: task.houseId});
                fac.getPageResult("/ovu-base/owner/relative/list.do", $scope.search, function (data) {
                    $scope.pageModel = data || [];

                });
            };
            $scope.find();
        }

        //添加亲属
        vm.addTodoItem = function () {
            $scope.pageModel.data = $scope.pageModel.data || [];
            $scope.pageModel.list = $scope.pageModel.list || $scope.pageModel.data;
            $scope.pageModel.data.push({ relationRole: 2, ownerId: task.id, parkId: task.PARK_ID, ownerName: task.name, ownerTel: task.phone });
        }
        //批量删除亲属
        vm.batchDelTodoItem = function () {
            var i = $scope.pageModel.data.length;
            while (i--) {
                var obj = $scope.pageModel.data[i];
                obj.checked && $scope.pageModel.data.splice($scope.pageModel.data.indexOf(obj), 1);
            }
        }
        //删除单个亲属
        vm.delTodoItem = function (item) {
            $scope.pageModel.data.splice($scope.pageModel.data.indexOf(item), 1);
        }
        //点击保存

        vm.save = function (form, item) {

            form.$setSubmitted(true);
            if (!form.$valid) {
                return;
            }

            relatives = {relatives: $scope.pageModel.data }
            $.extend(relatives, { ownerId: task.id });
            $http.post("/ovu-base/owner/relative/edit.do", relatives).success(function (res) {
                if (res.code=="0") {
                    $uibModalInstance.close();
                    msg(res.msg);


                } else {
                    msg(res.msg);
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
