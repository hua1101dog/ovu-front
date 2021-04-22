/**
 * 视频配置管理
 */
(function() {
    'use strict';

    document.title = "视频配置管理";
    var app = angular.module("angularApp");

    app.controller('VedioConfigCtl', VedioConfigCtl);

    function VedioConfigCtl($scope, $timeout, $uibModal, $http, fac) {
        var vm = this;
        $scope.pageModel = {};
        $scope.search = {};
        //分页表格
        $scope.find = function(pageNo) {
            angular.extend($scope.search, { currentPage: pageNo || $scope.pageModel.currentPage || 1, pageSize: $scope.pageModel.pageSize || 10 });
            $scope.search.pageIndex = $scope.search.currentPage - 1;
            fac.getPageResult("/ovu-pcos/system/video/list.do", $scope.search, function(data) {
                $scope.pageModel = data;
            });
        }
        $scope.find();
        //新增修改弹出框
        vm.showEditModal = function(id) {
            var modal = $uibModal.open({
                animation: false,
                templateUrl: '../view/elevator/videoConfig/modal.addOrEdit.html',
                controller: 'AddEditModalCtrl',
                resolve: {
                    id: id
                }
            });
            modal.result.then(function() {
                $scope.find();
            }, function() {
                console.info('Modal dismissed at: ' + new Date());
            });
        }

        vm.del = function(id) {
            confirm("确认删除该记录?", function() {
                $http.get("/ovu-pcos/system/video/delete.do?id=" + id).success(function(data, status, headers, config) {
                    if (data.success) {
                        $scope.find();
                        msg(data.msg);
                    } else {
                        alert(data.msg);
                    }
                })
            });
        }

    }
    //新增修改弹出框控制器
    app.controller('AddEditModalCtrl', AddEditModalCtrl);

    function AddEditModalCtrl($scope, $timeout, $uibModal, $uibModalInstance, $http, fac, id) {
        var vm = $scope.vm = this;
        vm.item = {};
        if (fac.isNotEmpty(id)) {
            $http.get("/ovu-pcos/system/video/get.do?id=" + id).success(function(data, status, headers, config) {
                if (data) {
                    vm.item = data;
                } else {
                    alert();
                }
            })
        }

        vm.save = function(form, item, vm) {
            form.$setSubmitted(true);
            if (!form.$valid) {
                return;
            }
            var find = vm.videoList.find(function(video) {
                return video.deviceId == item.videoId;
            })
            item.videoName = find.deviceName || '';
            $http.post("/ovu-pcos/system/video/edit.do", item, fac.postConfig).success(function(data, status, headers, config) {
                if (data.success) {
                    $uibModalInstance.close();
                    msg("保存成功!");
                } else {
                    alert();
                }
            })
        }
        vm.cancel = function() {
            $uibModalInstance.dismiss('cancel');
        };

        //选择项目  type为1是项目，为2是分期楼栋
        vm.findParkOrFloor = function(type) {
            if (type == 2 && fac.isEmpty(vm.item.parkId)) {
                alert('请先选择项目');
                return;
            }
            var param = { parkId: vm.item.parkId, type: type };
            var modal = $uibModal.open({
                animation: false,
                size: 'sm',
                component: 'parkComponent',
                resolve: {
                    param: param
                }
            });
            modal.result.then(function(node) {
                if (type == 1) {
                    vm.item.parkId = node.did;
                    vm.item.parkName = node.text;
                } else {
                    vm.item.floorId = node.floorId;
                    vm.item.stageId = node.stageId;
                    vm.item.floorName = node.stageName + node.floorName;
                }
            }, function() {});
        }
        vm.chooseSensor = function() {
            if (fac.isEmpty(vm.item.parkId) || fac.isEmpty(vm.item.stageId)) {
                alert('请先选择项目或者分期楼栋');
                return;
            }
            var param = { parkId: vm.item.parkId, stageId: vm.item.stageId, floorId: vm.item.floorId };
            var modal = $uibModal.open({
                animation: false,
                size: 'lg',
                templateUrl: '/view/quality/point/modal.quality.sensor.html',
                controller: 'ChooseSensorModalCtrl',
                resolve: {
                    param: param
                }
            });
            modal.result.then(function(data) {
                vm.item.equipmentId = data.sensor.emtId;
            }, function() {});
        }

        var arg = { parkId: 'd5f58a2e1e3841bda586e72e4406e9a1', stageId: 'fc7c956504794ae18dc1b23ef623a30c', floorId: 'f36bee21472d49be82ac388901d8ed70' }
        $http.post('/ovu-pcos/system/video/videoList.do', arg, fac.postConfig).success(function(data) {
            vm.videoList = data;
        })

    }

    //选择设备
    app.controller('ChooseSensorModalCtrl', function($scope, $http, $uibModal, $uibModalInstance, $filter, fac, param) {
        $scope.search = { parkId: param.parkId, stageId: param.stageId, floorId: param.floorId };
        $scope.pageModel = {};
        $scope.find = function(pageNo) {
            $.extend($scope.search, { currentPage: pageNo || $scope.pageModel.currentPage || 1, pageSize: $scope.pageModel.pageSize || 10 });
            $scope.search.pageIndex = $scope.search.currentPage - 1;
            fac.getPageResult("/ovu-pcos/system/video/equipmentList.do", $scope.search, function(data) {
                $scope.pageModel = data;
            });
        }

        $scope.save = function() {
            var sensor = $scope.pageModel.data.find(function(se) {
                return se.checked;
            })
            if (!sensor) {
                return;
            }
            $uibModalInstance.close({ sensor: sensor });
        }
        $scope.cancel = function() {
            $uibModalInstance.dismiss('cancel');
        };

        $scope.find();

        //获取设备类型树
        $http.get("/ovu-pcos/pcos/equipment/getEmtTree.do").success(function(resp) {
            if (resp.success) {
                $scope.typeData = resp.data;
            }
        });
        //选择树节点
        $scope.selectNode = function(node) {
            // if (node.is_model == 1) {
            //     $scope.search.modelId = node.id;
            //     $scope.search.emtTypeName = node.text;
            //     $scope.search.modelHover = search.modelFocus = false;
            // } else {
            //     alert("请选择产品型号！");
            // }
            if (node.nodes && node.nodes.length > 0) {
                alert('请选择最后一级分类!');
                return;
            } else {
                $scope.search.modelId = node.id;
                $scope.search.emtTypeName = node.text;
                $scope.search.modelHover = $scope.search.modelFocus = false;
            }
        }
    });

})()
