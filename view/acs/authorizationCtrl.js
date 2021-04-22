(function () {
    "use strict";
    var app = angular.module("angularApp");
    app.controller('ownCtl', ["$scope", "$http", "$filter", "$uibModal", "fac", "$rootScope", function ($scope, $http, $filter, $uibModal, fac, $rootScope) {
        document.title = "业主授权管理";
        $scope.pageModel = {};
        $scope.search = {};
        $scope.pageModel.authPlace = "1";
        $scope.config={};
        $scope.config.edit=false
        app.modulePromiss.then(function () {
            $scope.acs_treeData = [];
            // fac.initPage($scope, function () {
            //     $scope.loadHouseTree();
              
            // })
            $scope.$watch('dept.id', function (deptId, oldValue) {
                if (deptId) {
                      $scope.search.deptId=deptId;
                      $scope.search.parkId=$rootScope.dept.parkId;
                      $scope.loadHouseTree();
                }
            })

        });
        $scope.find = function (pageNo) {

            // if (!fac.hasOnlyPark($scope.search)) {
            //     return;
            // }
            
            if (!$scope.search.deptId||!$rootScope.dept.id ) {
                alert("请选择部门！");
                return ;
            }
            $.extend($scope.search, {
                currentPage: pageNo || $scope.pageModel.currentPage || 1,
                pageSize: $scope.pageModel.pageSize || 10
            });
            fac.getPageResult("/ovu-pcos/pcos/acs/acs_authorization/queryPage.do", $scope.search, function (data) {
                $scope.pageModel = data;

            });
        };

        $scope.selectNode = function (search,node) {
           
            //  node.state = node.state || {};
            //  node.state.selected = !node.state.selected;
             if (node.state.selected) {
               
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
          } else {
                 delete $scope.search.stageId;
                 delete $scope.search.buildId;
                 delete $scope.search.unitNo;
                 delete $scope.search.groundNo;
             }
             $scope.find();
         }

        $scope.loadHouseTree = function () {
            if (!$scope.search.parkId) {
                $scope.pageModel = {};
                $scope.acs_treeData=[];
                return;
            }
            $http.post("/ovu-base/system/parkStage/tree.do", {

                parkId: $scope.search.parkId,
                level: "3",
            }, fac.postConfig).success(function (acs_treeData) {
                $scope.flatData = fac.treeToFlat(acs_treeData);
                $scope.flatData.forEach(function (n) {
                 
                    n.buildNo ? (n.isLeaf = true) : (n.isLeaf = false);
                });
                $scope.acs_treeData = acs_treeData;
                if (!$scope.search.deptId) {
                    $scope.pageModel = {};
                } else {
                    $scope.find();
                }
            });

        }

        //授权 

        $scope.authorise = function () {
            var ownerIds = $scope.pageModel.list.reduce(function (ret, n) {
                n.checked && ret.push(n.ownerId);
                return ret
            }, []);

            var modal = $uibModal.open({
                animation: false,
                size: 'lg',
                templateUrl: 'ownAccModel.html',
                controller: 'giveModalCtrl',
                resolve: {
                    data: function () {
                        return {
                            deptId: $scope.search.deptId,
                            parkId: $scope.search.parkId,
                            ownerIds: ownerIds
                        }
                    },

                }
            });
            modal.result.then(function () {

                $scope.find();

            }, function () {
             
                $scope.find();
            });

        }
        //取消授权
        $scope.unAuthorise = function () {
            var ownerIds = $scope.pageModel.list.reduce(function (ret, n) {
                n.checked && ret.push(n.ownerId);
                return ret
            }, []);

            $http.get("/ovu-pcos/pcos/acs/acs_authorization/delete.do", {
                params: {
                    ownerId: ownerIds
                }
            }).success(function (res) {
                if (res.acsMsg) {
                    $scope.find();
                    msg("取消授权成功");

                } else {
                    msg("取消授权失败");
                }
            })
        }
        //批量授权
        $scope.authoriseAll = function () {
            var modal = $uibModal.open({
                animation: false,
                size: 'lg',
                templateUrl: 'ownAccModel.html',
                controller: 'giveModalCtrl',
                resolve: {

                    data: function () {
                        return {
                            deptId: $scope.search.deptId,
                            parkId: $scope.search.parkId
                        }
                    },
                }
            });
            modal.result.then(function (data) {
                $scope.find();
            }, function () {
                $scope.find();
            });

        }

    }]);

    app.controller('giveModalCtrl', function ($scope, $rootScope, $http, $uibModalInstance, $filter, fac, data) {
        $scope.config = {
            edit: false,
            showCheckbox: true
        }
        $scope.rightList = [];
        var factree = [];

        //初始化项目树，因为这个在根元素上面，所以会保存上次选择的数据
        $http.post("/ovu-pcos/pcos/acs/acs_authorization/tree.do", {
            deptId: data.deptId,
            parkId:data.parkId,
            onlyFloor: true
        }, fac.postConfig)
            .success(function (acs_hascheck_treeData) {
                $scope.acs_hascheck_treeData = acs_hascheck_treeData;
                factree = fac.treeToFlat(acs_hascheck_treeData);
            });


        function expandFather(node) {
            var father = $scope.acs_hascheck_treeData.find(function (n) {
                return n.did == node.pdid
            });
            if (father) {
                father.state = father.state || {};
                father.state.expanded = true;
                expandFather(father);
            }
        }
        $scope.check = function (node) {
            node.state = node.state || {};
            node.state.checked = !node.state.checked;

            function checkSons(node, status) {
                node.state = node.state || {};
                node.state.checked = status;
                if (node.nodes && node.nodes.length) {
                    node.nodes.forEach(function (n) {
                        checkSons(n, status);
                    })
                }
            }

            if (node.state.checked) {
                checkSons(node, true);
            } else {
                checkSons(node, false);
            }
            $scope.rightList = factree.filter(function (n) {

                return n.state && n.state.checked && n.acsEquipId
            })
        }
        $scope.save = function () {

            var acsEquipIds = $scope.rightList.reduce(function (ret, n) {
                n.acsEquipId && ret.push(n.acsEquipId);
                return ret
            }, []);

            //业主授权 

            if (data.ownerIds) {
                $http.get("/ovu-pcos/pcos/acs/acs_authorization/insertOrUpdate.do", {
                    params: {
                        deptId: data.deptId,
                        parkId:data.parkId,
                        acsEquipId: acsEquipIds,
                        ownerId: data.ownerIds
                    }
                }).success(function (res) {
                    if (res.acsMsg) {
                        $uibModalInstance.close();
                        msg("授权成功");

                    } else {
                        msg("授权失败")
                    }
                });

            } else {
                //业主批量授权
                $http.get("/ovu-pcos/pcos/acs/acs_authorization/insertOrUpdateAll.do", {
                    params: {
                        acsEquipId: acsEquipIds,
                        deptId: data.deptId,
                        parkId:data.parkId,
                    }
                }).success(function (res) {

                    if (res.acsMsg) {
                        $uibModalInstance.close();
                        msg("批量授权成功")
                    } else {
                        msg("批量授权失败")
                    }
                })
            }
        }
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    });

})();