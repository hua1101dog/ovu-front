/**
 * Created by chenxi on 2018/3/7.
 */
(function () {
    "use strict";
    var app = angular.module("angularApp");
    !app.registerMediaDetect && app.directive("mediaDetect", function () {
        return {
            scope: {
                ip: '=',
                media: '='
            },
            link: function (scope, ele, attrs, c) {
                $.ajax({
                    url: "http://" + scope.ip + ":" + scope.media.httpPort + "/testMedia.html",
                    cache: true,
                    timeout: 800,
                    success: function (html) {
                    },
                    error: function (resp) {
                        console.log(resp.responseText);
                        switch (resp.status) {
                            case 0:
                                scope.media.mediaStatus = 1;
                                break;
                            case 404:
                                scope.media.mediaStatus = 0;
                                break;
                        }
                        scope.$apply();
                    }
                });
            }
        }
    });
    app.registerMediaDetect = true;

    app.controller('hardwareCtrl', function ($scope, $rootScope, $http, $filter, $uibModal, fac) {
        document.title = "硬件服务器设备管理";
        $scope.search = {};
        $scope.pageModel = {};
        $scope.lanConfig = {edit: true};

        function getLantree() {
            $http.get('/ovu-camera/pcos/videomanagement/hardware/allLan').success(function (res) {
                if (res.code == 0) {
                    $scope.lanTree = res.data;
                    $scope.flatLanTree = fac.treeToFlat($scope.lanTree);
                } else {
                    alert(res.msg);
                }
            })
        }

        getLantree();

        //选中分类节点
        $scope.selectNode = function (node) {
            if ($scope.curNode != node) {
                $scope.curNode && $scope.curNode.state && ($scope.curNode.state.selected = false);
            }
            node.state = node.state || {};
            node.state.selected = !node.state.selected;
            if (node.state.selected) {
                $scope.curNode = node;
                $scope.find(1);
            } else {
                delete $scope.curNode;
            }
        }
        $scope.editNode = function (lan) {
            if (lan && !lan.lanId) {
                //当前是 项目节点，不作处理。
                return;
            }
            var copy = angular.extend({isGroup: $scope.search.isGroup}, lan);
            var modal = $uibModal.open({
                animation: false,
                templateUrl: '../view/videomanagement/hardware.lan.modal.html',
                //size: 'lg',
                controller: 'lanEditCtrl',
                resolve: {
                    lan: copy
                }
            });
            modal.result.then(function () {
                getLantree();
            }, function () {
            })
        }

        //下级分类
        $scope.addSon = function (park) {
            var modal = $uibModal.open({
                animation: true,
                templateUrl: '../view/videomanagement/hardware.lan.modal.html',
                controller: 'lanEditCtrl',
                resolve: {
                    lan: function () {
                        return {isGroup: $scope.search.isGroup, parkId: park.id, parkName: park.text};
                    }
                }
            });
            modal.result.then(function (data) {
                getLantree();
            });
        }

        //删除分类
        $scope.delNode = function (node) {
            if (node.nodes && node.nodes.length) {
                alert("此节点有下级节点,不能删除！")
            } else {
                confirm("确定删除 " + node.text, function () {
                    $http.get("/ovu-camera/pcos/videomanagement/hardware/deleteLan.do?id=" + node.id).success(function (resp) {
                        if (resp.code == 0) {
                            getLantree();
                        } else {
                            alert(resp.error);
                        }
                    });
                })
            }
        }
        //分页
        $scope.find = function (pageNo) {
            if ($scope.curNode) {
                $scope.search.lanId = $scope.curNode.lanId;
            } else {
                delete $scope.search.lanId;
            }
            angular.extend($scope.search, {
                currentPage: pageNo || $scope.pageModel.currentPage || 1,
                pageSize: $scope.pageModel.pageSize || 10
            });
            fac.getPageResult('/ovu-camera/pcos/videomanagement/hardware/pageList.do', $scope.search, function (data) {
                $scope.pageModel = data;
            })
        }
        $scope.find();
        //添加设备，弹出模态框
        $scope.showEditModal = function (hardware) {
            var copy = angular.extend({}, hardware);
            var modal = $uibModal.open({
                animation: false,
                templateUrl: '../view/videomanagement/hardware.modal.html',
                size: 'lg',
                controller: 'hardwareEditModalCtrl',
                controllerAs: 'vm',
                resolve: {
                    hardware: copy,
                    lanTree: function () {
                        return $scope.lanTree
                    }
                }
            });
            modal.result.then(function () {
                $scope.find();
            }, function () {
                $scope.find();
            })
        }


        //删除设备
        $scope.del = function (id) {
            confirm("确认删除该硬件服务器吗?", function () {
                $http.get("/ovu-camera/pcos/videomanagement/hardware/delete.do?id=" + id).success(function (msg) {
                    if (msg.code == 0) {
                        $scope.find();
                    } else {
                        alert();
                    }
                })

            })
        }

    });
    app.controller('hardwareEditModalCtrl', function ($scope, $uibModal, $uibModalInstance, $http, fac, hardware, lanTree) {
        var vm = $scope.vm = this;
        $scope.item = hardware || {};
        $scope.item.transformList = $scope.item.transformList || [];
        $scope.item.imosList = $scope.item.imosList || [];
        $scope.item.mediaList = $scope.item.mediaList || [];
        $scope.item.proxyList = $scope.item.proxyList || [];
        $scope.item.miSdkList = $scope.item.miSdkList || [];
        $scope.lanTree = lanTree;
        if (fac.isNotEmpty(hardware.id)) {
            $http.get('/ovu-camera/pcos/videomanagement/hardware/get.do', {params: {id: hardware.id}}).success(function (res) {
                angular.extend($scope.item, res);
            })
        }
        $scope.setParkId = function (host, node) {
            host.parkId = node.parkId;
        }
        vm.save = function (form, item) {
            form.$setSubmitted(true);
            if (!form.$valid) {
                return
            }
            if ((!$scope.item.localIp) && (!$scope.item.ip)) {
                msg("请填写硬件服务器ip地址");
                return
            }
            delete item.createTime;

            $http.post('/ovu-camera/pcos/videomanagement/hardware/edit.do', item).success(function (res) {
                if (res.code == 0) {
                    $uibModalInstance.close();
                    msg("操作成功!");
                } else {
                    alert(res.msg);
                }
            })
        }
        vm.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        }
    })

    app.controller('lanEditCtrl', function ($scope, $uibModal, $uibModalInstance, $http, fac, lan) {

        $scope.item = lan || {};
        if (fac.isNotEmpty(lan.id)) {
            $http.get('/ovu-camera/pcos/videomanagement/hardware/getLan.do', {params: {id: lan.id}}).success(function (resp) {
                if (resp.code == 0) {
                    angular.extend($scope.item, resp.data);
                } else {
                    alert(resp.msg);
                }
            })
        }
        $scope.save = function (form, item) {
            form.$setSubmitted(true);
            if (!form.$valid) {
                return
            }
            $http.post('/ovu-camera/pcos/videomanagement/hardware/editLan.do', item).success(function (res) {
                if (res.code == 0) {
                    $uibModalInstance.close();
                    msg("操作成功!");
                } else {
                    alert(res.msg);
                }
            })
        }
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        }
    })

})();
