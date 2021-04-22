/**
 * Created by chenxi on 2018/3/7.
 */
(function () {
    "use strict";
    var app = angular.module("angularApp");
    app.controller('playsourceCtrl', function ($scope, $rootScope, $http, $filter, $uibModal, fac) {

        document.title = "播放源管理";
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
            angular.extend($scope.search, { currentPage: pageNo || $scope.pageModel.currentPage || 1, pageSize: $scope.pageModel.pageSize || 10 });
            fac.getPageResult('/ovu-camera/pcos/videomanagement/device/list.do', $scope.search, function (res) {
                $scope.pageModel = res;
            })
        }
        //添加播放源
        $scope.showEditModal = function (task) {
            var copy = angular.extend({}, task);
            if (!fac.hasActivePark($scope.search)) {
                return;
            }
            var copy = angular.extend({}, task);
            copy.isGroup = $scope.search.isGroup;
            if (!copy.parkId) {
                angular.extend(copy, {
                    parkId: $scope.search.parkId,
                     parkName: $scope.search.parkName,
                     stageId:$scope.search.stageId,
                     floorId: $scope.search.floorId
                    })
            }
            var modal = $uibModal.open({
                animation: false,
                size: 'lg',
                templateUrl: "../view/videomanagement/playsource/modal.playsourceEdit.html",
                controller: 'playsourceEditModalCtrl',
                controllerAs: 'vm',
                resolve: { task: copy }
            })
            modal.result.then(function () {
                $scope.find()
            }, function () {
                $scope.find()
            })
        }
        //删除线路
        $scope.del = function (id) {
            confirm("确认删除该播放源吗?", function () {
                $http.get("/ovu-camera/pcos/videomanagement/device/delete.do?ids=" + id).success(function (msg) {
                    if (msg.success) {
                        $scope.find();
                    } else {
                        alert();
                    }
                })
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

    });
    app.controller('playsourceEditModalCtrl', function ($scope, $uibModal, $uibModalInstance, $http, $filter, fac, task) {
        var vm = $scope.vm = this;
        $scope.item = {};
        $scope.cameraList = ""
        //获取摄像头编码列表
        // var params={}
        $http.get("/ovu-camera/pcos/videomanagement/camerinfo/list.do").success(function (data, status, headers, config) {
            $scope.cameraList = data;
        });

        //根据摄像头编号查询路线
        // $scope.getRouter = function (id) {
        //     var camerainfoNo = $scope.cameraList.reduce(function (ret, n) {
        //         (n.id == id) && ret.push(n.code);
        //         return ret;
        //     }, []).join();
        //     $scope.item.cameraCode = camerainfoNo;
        //     $http.get("/ovu-camera/pcos/videomanagement/route/getRouteList.do", { params: { camerainfoNo: camerainfoNo } }).success(function (data, status, headers, config) {
        //         $scope.routeList = data.data;
        //     });
        // }
        //选择摄像机
        $scope.selectOwner = function(){
            var modal = $uibModal.open({
                animation: false,
                size:'max',
                templateUrl: '/view/videomanagement/modal.selectCamera.html',
                controller: 'cameraSelectorCtrl'
                ,resolve: {data: function(){return {parkId:task.parkId};}}
            });
            modal.result.then(function (data) {
                if(data){
                    $scope.item.cameraCode  = data.code;
                    $scope.item.cameraId = data.id;
                    $scope.item.cameraName=data.name
                    $http.get("/ovu-camera/pcos/videomanagement/route/getRouteList.do", { params: { camerainfoNo: $scope.item.cameraCode} }).success(function (data, status, headers, config) {
                                $scope.routeList = data.data;
                            });
                }
            });
        };
        if (fac.isNotEmpty(task.id)) {
            $http.get('/ovu-camera/pcos/videomanagement/device/get.do', { params: { id: task.id } }).success(function (res) {
                // angular.extend($scope.item, res.device);
                $http.get("/ovu-camera/pcos/videomanagement/route/getRouteList.do", { params: { camerainfoNo: res.data.cameraCode } }).success(function (data, status, headers, config) {
                    $scope.routeList = data.data;
                });
                res.data.updateTime = $filter('date')(res.data.updateTime, "yyyy-MM-dd hh:mm:ss");
                $scope.item.code = res.data.code;
                $scope.item.name = res.data.name;
                $scope.item.cameraId = res.data.cameraId;
                $scope.item.cameraCode = res.data.cameraCode
                $scope.item.routeId = res.data.routeId;
                $scope.item.updateTime = res.data.updateTime;
                $scope.item.cameraName=res.data.cameraName;
                // $scope.item.localFlvUrl=res.data.localFlvUrl;
                // $scope.item.flvUrl=res.data.flvUrl;
                // $scope.item.localM3u8Url=res.data.localM3u8Url;
                // $scope.item.m3u8Url=res.data.m3u8Url;
                $scope.item.status = res.data.status;
                $scope.item.remark = res.data.remark;
                $scope.item.id = task.id;
            })
        }
        vm.save = function (form, item) {
            form.$setSubmitted(true);
            if (!form.$valid) {
                return
            }
            //     var date=new Date();
            //    item.updateTime=date.getTime(item.updateTime)
            $http.post('/ovu-camera/pcos/videomanagement/device/edit.do', item, fac.postConfig).success(function (res) {
                if (res.success) {
                    $uibModalInstance.close();
                    msg("操作成功!");
                } else if(!res.isUnique){
                    alert("该播放源已经存在，请重新选择");
                    return
                }else{
                    $uibModalInstance.close();
                    msg("操作失败!");
                }
            })
        };
        vm.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };


    });
    app.controller('cameraSelectorCtrl', function ($scope, $rootScope, $http, $filter, $uibModal,$uibModalInstance, fac,data) {
        $scope.config={};
        $scope.config.edit=false
           //加载树
           $http.post("/ovu-base/system/parkStage/tree.do", {
            parkId: data.parkId,
            level: "4",
         }, fac.postConfig).success(function (treeData) {
            $scope.flatData = fac.treeToFlat(treeData);
            $scope.flatData.forEach(function (n) {
                // n.floorId ? (n.isLeaf = true) : (n.isLeaf = false);
                n.buildNo ? (n.isLeaf = true) : (n.isLeaf = false);
            });
            $scope.treeData = treeData;

            if (!$scope.search) {
                $scope.pageModel = {};
            } else {
                $scope.find();
            }
         });
                $scope.search = {parkId:data.parkId};
                $scope.pageModel = {};

                //分页
                $scope.find = function (pageNo) {
                    angular.extend($scope.search, { currentPage: pageNo || $scope.pageModel.currentPage || 1, pageSize: $scope.pageModel.pageSize || 10 });
                    fac.getPageResult('/ovu-camera/pcos/videomanagement/camerinfo/pageList.do', $scope.search, function (data) {
                        $scope.pageModel = data
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
                        if(node.floorId){
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
                $scope.checkItem=function(item){
                    $scope.curCamera =item;
                }
                $scope.save = function () {

                    if (!$scope.curCamera) {
                        alert("请选择设备！");
                    } else {
                        $uibModalInstance.close($scope.curCamera);
                    }
                }
                $scope.cancel = function () {
                    $uibModalInstance.dismiss('cancel');
                };

            });

})();
