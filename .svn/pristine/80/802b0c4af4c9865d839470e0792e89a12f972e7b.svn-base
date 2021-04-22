/**
 * Created by wangheng on 2017/8/28.
 */
(function () {
    "use strict";
    var app = angular.module("angularApp");
    app.controller('firePointCtl', function ($scope, $rootScope, $http, $filter, $uibModal, $location, fac) {
        document.title = "消防点管理";
        $scope.config = { edit: false };
        $scope.pageModel = {};
        $scope.search = {};

        app.modulePromiss.then(function () {
            $scope.treeData = [];
            fac.initPage($scope, function () {
                $scope.loadHouseTree();
            })
        })

        $scope.init = function () {
            $scope.loadHouseTree();
            $scope.find();
        }

        $scope.find = function (pageNo) {
            /* if(!fac.hasActivePark($scope.search)){
                 return;
             }*/
            //    console.log($scope.curNode);
            // var param = {
            //         parkId: $scope.search.parkId,
            // 		stageId:$scope.curNode && $scope.curNode.stageId,
            // 		floorId:$scope.curNode && $scope.curNode.floorId
            // }

            angular.extend($scope.search, { currentPage: pageNo || $scope.pageModel.currentPage || 1, pageSize: $scope.pageModel.pageSize || 10 });
            fac.getPageResult("/ovu-pcos/pcos/fire/firepoint/list.do", $scope.search, function (data) {
                $scope.pageModel = data;
            });
        };

        $scope.del = function (item) {
            confirm("确认删除该消防点吗?", function () {
                $http.get("/ovu-pcos/pcos/fire/firepoint/delete.do?firePointId=" + item.firePointId).success(function (data, status, headers, config) {
                    if (data.success) {
                        $scope.find();
                        msg(data.msg);
                    } else {
                        alert();
                    }
                });
            })
        }

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
        $scope.showEditModal = function (id) {
            /*if(!fac.hasActivePark($scope.search)){
                return;
            }*/
            if(!$scope.search.buildId){
                alert('请选择楼栋');
                return;
            }
            var param = {
                id: id, stageId: $scope.search.stageId,
                floorId: $scope.search.buildId || $scope.search.floorId, parkId: $scope.search.parkId
            }

            var modal = $uibModal.open({
                animation: true,
                templateUrl: 'fire/modal/modal.editFirePoint.html',
                controller: 'editFirePointCtrl'
                , resolve: { param: param }
            });
            modal.result.then(function () {
                $scope.find();
            }, function () {
                console.info('Modal dismissed at: ' + new Date());
            });
        }

        $scope.loadHouseTree = function () {
            $http.post("/ovu-base/system/parkStage/tree.do", {
                parkId: $scope.search.parkId,
                level: "2",
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
        //离开页面时
        $scope.$on('$destroy', function () {
            if ($scope.curNode && $scope.curNode.state) {
                $scope.curNode.state.selected = false;
            }
        });

    });

    app.controller('editFirePointCtrl', function ($scope, $rootScope, $http, $uibModalInstance, $uibModal, $filter, fac, param) {
        $scope.item = {};
        var arg = { parkId: param.parkId, stageId: param.stageId, floorId: param.floorId || $scope.item.floorId };

        if (fac.isNotEmpty(param.id)) {
            $http.get("/ovu-pcos/pcos/fire/firepoint/get.do?firePointId=" + param.id).success(function (data) {
                $scope.item = data;
            })
        }

        // $scope.chooseSensor = function(){
        //   var modal = $uibModal.open({
        //     animation: false,
        //     size:'lg',
        //     component: 'sensorModelComponent',
        //     resolve : {
        //       param:arg
        //     }
        //   });
        //   modal.result.then(function (data) {
        //     $scope.item.equipmentId=data.sensor.emtId;
        //     $scope.item.equipmentName=data.sensor.emtName;
        //   }, function () {
        //   });
        // }
        //选择设备分类
        $scope.chooseEquipment = function (task) {
            var modal = $uibModal.open({
                animation: false,
                size: 'lg',
                templateUrl: '/view/equipment/selector.equipments.html',
                controller: 'equipmentSelectorCtrl'
                , resolve: { data: function () { return { parkId: param.parkId, equipment_id: task.equipment_id, stageId: param.stageId, floorId: param.floorId || $scope.item.floorId }; } }
            });
            modal.result.then(function (data) {

                task.equipmentId = data.id;
                task.equipmentName = data.name;
            });
        }

        $scope.save = function (form, item) {
            form.$setSubmitted(true);
            if (!form.$valid) {
                return;
            }
            var param = angular.extend({}, item, arg);
            if (fac.isNotEmpty(param.firePointId)) {
                delete param.parkId;
                delete param.stageId;
                delete param.floorId;
            }
            $http.post("/ovu-pcos/pcos/fire/firepoint/edit.do", param, fac.postConfig).success(function (data, status, headers, config) {
                if (data.success) {
                    msg("保存成功!");
                    $uibModalInstance.close();
                } else {
                    alert();
                }
            })
        }

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    });
    app.controller('equipmentSelectorCtrl', function ($scope, $rootScope, $http, $uibModalInstance, $filter, fac, data) {
        
          $rootScope.config = {edit: false};
  
          data.equipment_id && $http.get("/ovu-pcos/pcos/equipment/get.do?id=" + data.equipment_id).success(function (data) {
              $scope.curEquip = data;
          })
  
          $scope.pageModel = {};
          $scope.find = function (pageNo) {
              $.extend($scope.search, {
                  currentPage: pageNo || $scope.pageModel.currentPage || 1,
                  pageSize: $scope.pageModel.pageSize || 10
              });
              $scope.search.pageIndex = $scope.search.currentPage - 1;
              fac.getPageResult("/ovu-pcos/pcos/equipment/queryByPage.do", $scope.search, function (data) {
                  $scope.pageModel = data;
              });
          };
          $http.get("/ovu-pcos/pcos/equipment/getEmtTree",{ params: $scope.search }).success(function (resp) {
            if (resp.success) {
                $scope.equipTypeTree = resp.data;
            }
        })
          $scope.search = {parkId: data.parkId,stageId:data.stageId,floorId:data.floorId};
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
                  $scope.find();
              } else {
                  delete $scope.curNode;
                  delete $scope.search.stageId;
                  delete $scope.search.floorId;
              }
          };
  
          $scope.selectType = function (node) {
              $scope.search.equipTypeId = node.id;
              $scope.search.equipTypeName = (node.ptexts ? node.ptexts + " > " : "") + node.text;
              $scope.search.modelHover = $scope.search.modelFocus = false;
          };
  
          $scope.find();
          $scope.save = function () {
  
              if (!$scope.curEquip && !$scope.curEquip.id) {
                  alert("请选择设备！");
              } else {
                  $uibModalInstance.close($scope.curEquip);
              }
          }
          $scope.cancel = function () {
              $uibModalInstance.dismiss('cancel');
          };
      });
    
})();
