
(function () {
    "use strict";
    var app = angular.module("angularApp");
    app.controller('ownerInfoCtrl', function ($scope, $rootScope, $http, $filter, $uibModal, $timeout, fac) {
        document.title = "业主信息管理";
        $scope.pageModel = {};
        $scope.search = {};
        $scope.config={};
        $scope.config.edit=false
        var selectedIndex;
        app.modulePromiss.then(function () {

            $scope.treeData = [];
            fac.initPage($scope, function () {
                $scope.loadHouseTree();
                $scope.changeIndex(selectedIndex);
                fac.loadSelect($scope, "HOUSE_STATUS")
            })
        });
        $scope.init = function () {
            $scope.loadHouseTree();
            $scope.changeIndex(selectedIndex);
            fac.loadSelect($scope, "HOUSE_STATUS")
        }
        $scope.find = function (pageNo) {

            angular.extend($scope.search, { currentPage: pageNo || $scope.pageModel.currentPage || 1, pageSize: $scope.pageModel.pageSize || 10 });
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
            $scope.changeIndex(selectedIndex);
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


        //新增，编辑业主 打开模态框
        $scope.showAddModal = function (task) {

            var copy = angular.extend({}, task);

            copy.isGroup = $scope.search.isGroup;

            if (!copy.PARK_ID) {
                angular.extend(copy, { PARK_ID: $scope.search.parkId, PARK_NAME: $scope.search.PARK_NAME, treeData: $scope.treeData })
            }

            var modal = $uibModal.open({
                animation: false,
                templateUrl: '../view/newowner/ownerInfo/own/modal.ownEdit.html',
                size: 'lg',
                controller: 'ownerInfoEditCtrl',
                controllerAs: 'vm',
                resolve: { task: copy }
            });
            modal.result.then(function () {
                $scope.find();
            }, function () {
                $scope.find();
            });

        }
        //查看亲属
        $scope.showRelative = function (task) {
            var copy = angular.extend({}, task);
            copy.isGroup = $scope.search.isGroup;
            if (!copy.PARK_ID) {
                angular.extend(copy, { PARK_ID: $scope.search.parkId })
            }
            var modal = $uibModal.open({
                animation: false,
                templateUrl: '../view/newowner/ownerInfo/own/modal.Relative.html',
                size: 'lg',
                controller: 'relativesEditCtrl',
                controllerAs: 'vm',
                resolve: { task: copy }
            });
            modal.result.then(function () {
                $scope.find();
            }, function () {
                $scope.find();
            });

        }
        //查看租户
        $scope.showTanant = function (task) {
            var copy = angular.extend({}, task);
            copy.isGroup = $scope.search.isGroup;
            if (!copy.PARK_ID) {
                angular.extend(copy, { PARK_ID: $scope.search.parkId })
            }
            var modal = $uibModal.open({
                animation: false,
                templateUrl: '../view/newowner/ownerInfo/own/modal.Tanant.html',
                size: 'lg',
                controller: 'tanantEditCtrl',
                controllerAs: 'vm',
                resolve: { task: copy }
            });
            modal.result.then(function () {
                $scope.find();
            }, function () {
                $scope.find();
            });
        }
        //删除业主

        //批量删除业主

        $scope.delAll = function () {
            var ids = $scope.pageModel.list.reduce(function (ret, n) { n.checked && ret.push(n.id); return ret }, []);
            delGroup(ids);
        };
        $scope.del = function (item) {
            delGroup([item.id]);
        }

        function delGroup(ids) {
            confirm("确认删除选中的" + ids.length + "条记录?", function () {
                $http.post("/ovu-base/owner/delete.do", { "ownerIds": ids.join() }, fac.postConfig).success(function (resp) {
                    if (resp.code=="0") {
                        $scope.find();
                        msg(resp.msg);
                    } else {
                        msg(resp.msg);
                    }
                })
            });
        }


        $scope.changeIndex = function (index) {
            if (index == 0 && $scope.search.parkId) {
                $scope.find();
            }
            var copy = angular.extend({}, copy);
                angular.extend(copy, { 
                    isGroup:$scope.search.isGroup,
                    parkId: $scope.search.parkId, 
                    parkName: $scope.search.parkName,
                    stageId:$scope.search.stageId ,
                    buildId:$scope.search.buildId,
                    unitNo:$scope.search.unitNo,
                    groundNo:$scope.search.groundNo
                })
             
            $scope.$broadcast('index' + index,  copy);
            selectedIndex = index;
        };


    });
    //业主新增模块
    app.controller("ownerInfoEditCtrl", function ($scope, $uibModal, $uibModalInstance, $http, fac, task) {

        var vm = $scope.vm = this;
        $scope.search = {};
        $scope.pageModel = {};
        vm.ownList = [];

        var item = {};
        $scope.houseTree = "";
        var ownerAddress = {};
        //编辑业主信息
        if (fac.isNotEmpty(task.id)) {
            $scope.item = {}
            $http.post("/ovu-base/owner/detail.do", { ownerId: task.id }, fac.postConfig).success(function (res) {

                angular.extend($scope.item, res.data);
             
                if ($scope.item.stageId) {
                    $scope.item.stageId = task.treeData.find(function (n) { return n.id == $scope.item.stageId});
                    if ($scope.item.buildId) {
                        var param={
                            stageId:$scope.item.stageId.id
                        }
                        $http.get("/ovu-base/system/parkBuild/getBuilds.do", { params: param }).success(function (res) {

                            $scope.buildList = res;
                            $scope.item.buildId=$scope.buildList.find(function(n){ return n.id ==$scope.item.buildId})

                        });
                            $scope.geneUnit($scope.item);
                            $scope.geneGround($scope.item);
                            $scope.getHouseList($scope.item);

                    }
                }


            })
        }
        // 获取分期

        $http.post("/ovu-base/system/parkStage/tree.do", {

            parkId: task.PARK_ID,
            level: "2",
        }, fac.postConfig).success(function (res) {
            $scope.treeData = res;

        });
        //获取楼栋
        $scope.geneBuild = function (task) {


            if(!task || !task.stageId){
                $scope.buildList=[];
                return;
            }
            var param={
                stageId:task.stageId
            }
            $http.get("/ovu-base/system/parkBuild/getBuilds.do", { params: param }).success(function (res) {

                $scope.buildList = res;

            });
        }
        //获取单元
         $scope.geneUnit = function (task) {

            if (!task || !task.buildId) {
                $scope.unitList = [];
                return;
            }
            var param = {
                pageSize: 1000,
                pageIndex: 0,
                buildId: task.buildId || ""
            };
            $http.get("/ovu-base/system/parkHouse/listUnitNo_mute.do", { params: param }).success(function (resp) {
                $scope.unitList = resp.data;

            })
        }
        //获取楼栋
        $scope.geneGround = function (task) {

            if (!task || !task.buildId || !task.unitNo) {
                $scope.groundList = [];
                return;
            }
            var param = {
                pageSize: 1000,
                pageIndex: 0,
                buildId: task.buildId  || "",
                unitNo: task.unitNo
            };
            $http.get("/ovu-base/system/parkHouse/listGroundNo_mute.do", { params: param }).success(function (resp) {
                $scope.groundList = resp.data;

            })
        }
        $scope.getHouseList = function (task) {

            $scope.houseList = [];
            if (task.groundNo) {
                $http.post("/ovu-base/system/parkHouse/getHouses.do",
                    {
                        buildId: task.buildId,
                        unitNo: task.unitNo,
                        groundNo: task.groundNo,
                        roomCategory: "FW12"
                    }, fac.postConfig).success(function (list) {
                        // list.data.forEach(function (n) {
                        //     if (task.HOUSE_ID == n.ID) {
                        //         task.HOUSE = n;
                        //     } else if (n.task_ID) {
                        //         n.HOUSE_NAME += "(已关联其它业主)";
                        //         n.ID = 0;
                        //     }
                        // })
                        $scope.houseList = list.data;

                    })
            }

        }


        //点击保存
        vm.save = function (form, item) {
            form.$setSubmitted(true);
            if (!form.$valid) {
                return;
            }

            angular.extend(item, {
                parkId: task.PARK_ID,
                // stageId: "bed85b86cdfe4a4fa0ecdbf29ca2bf33",
                // buildId: "70df4814430c42cb91bb979b797e85e9",
                // unitNo: "01",
                // groundNo: "005",
                // houseId: "f4478864f45a4a488f9e47aa4ff5bcef"
            });

            $http.post("/ovu-base/owner/edit.do", item, fac.postConfig).success(function (res) {
                if (res.code == "0") {
                    $uibModalInstance.close();

                    msg(res.msg);
                } else {

                    $uibModalInstance.close();
                    msg(res.msg);
                }

            })

        }
        //点击取消
        vm.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };

    });
    //编辑亲属模块
    app.controller("relativesEditCtrl", function ($scope, $uibModal, $uibModalInstance, $http, fac, task) {
        //获取亲属列表
        var vm = $scope.vm = this;
        $scope.search = {};

        $scope.pageModel = {};
        //获取亲属列表
        if (fac.isNotEmpty(task.id)) {
            $scope.find = function (pageNo) {
                $.extend($scope.search, {
                    currentPage: pageNo || $scope.pageModel.currentPage || 1,
                    pageSize: $scope.pageModel.pageSize || 10,
                    ownerId: task.id
                });
                fac.getPageResult("/ovu-base/owner/relative/list.do", $scope.search, function (data) {
                    $scope.pageModel = data;

                });
            };
            $scope.find();
        }
        //禁用/启用亲属
        $scope.unAuthorise = function (item) {

            var alt = ""
            if (item.status == '1') {
                alt = "禁用"
            } else {
                alt = "启用"
            }
            authorise([item.id], "确认" + alt + "亲属 " + item.relationName + " 吗?", item.status);
        }
        //批量禁用/启用亲属
        $scope.unAuthoriseAll = function () {
            var ids = $scope.pageModel.list.reduce(function (ret, n) { n.checked && ret.push(n.id); return ret }, []);
            authorise(ids, "确认禁用 " + ids.length + " 个亲属吗?");
        }

        function authorise(ids, msg, status) {
            confirm(msg, function () {
                $http.get("/ovu-pcos/pcos/newowner/relative/forbid.do", { params: { ids: ids.join(), status: status } }).success(function (resp) {
                    if (resp.success) {
                        $scope.find();
                    } else {
                        alert("操作失败");
                    }
                })
            });
        }

        //点击取消
        vm.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    });
    //编辑租户模块
    app.controller("tanantEditCtrl", function ($scope, $uibModal, $uibModalInstance, $http, fac, task) {
        var vm = $scope.vm = this;
        $scope.search = {};


        $scope.pageModel = {};
        //获取租户列表
        if (fac.isNotEmpty(task.id)) {
            $scope.find = function (pageNo) {
                $.extend($scope.search, {
                    currentPage: pageNo || $scope.pageModel.currentPage || 1,
                    pageSize: $scope.pageModel.pageSize || 10,
                    ownerId: task.id
                });
                fac.getPageResult("/ovu-base/owner/tenant/list.do", $scope.search, function (data) {
                    $scope.pageModel = data;
                });
            }
            $scope.find();
        }


        //禁用租户
        $scope.unAuthorise = function (item) {
            authorise([item.id], "确认禁用租户 " + item.tenantName + " 吗?");
        }
        //批量禁用租户
        $scope.unAuthoriseAll = function () {
            var ids = $scope.pageModel.list.reduce(function (ret, n) { n.checked && ret.push(n.id); return ret }, []);
            authorise(ids, "确认禁用 " + ids.length + " 个租户吗?");
        }
        function authorise(ids, msg) {
            confirm(msg, function () {
                $http.get("/ovu-pcos/pcos/newowner/tanant/forbid.do", { params: { ids: ids.join() } }).success(function (resp) {
                    if (resp.success) {
                        $scope.find();
                    } else {
                        alert("操作失败");
                    }
                })
            });
        }

        //点击取消
        vm.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    })
    //工单模块 报事查询
    app.controller("workunitCtrl", function ($scope, $rootScope, $http, $filter, $uibModal, fac) {
        $scope.pageModel = {};
    //    
        $scope.$on('index1', function (event, data) {
            $scope.find(1, data);
        });
        $scope.search={};
         $scope.search.unitStatus=5
        $scope.find = function (pageNo, data) {
            angular.extend($scope.search,{currentPage: pageNo || $scope.pageModel.currentPage || 1, pageSize: $scope.pageModel.pageSize || 10 }, data);
            fac.getPageResult("/ovu-pcos/pcos/building_search/workunit/sourceunit/queryList.do", $scope.search, function (res) {
                $scope.pageModel = res;
            });

        };

    })
    //报装申请查询
    app.controller("reportRequestCtrl", function ($scope, $rootScope, $http, $filter, $uibModal, fac) {
        var vm = $scope.vm = this;
        $scope.pageModel = {};
        $scope.search={}
        $scope.$on('index1', function (event, data) {

            $scope.find(1, data);
        });
        $scope.find = function (pageNo, data) {
            angular.extend($scope.search,{ currentPage: pageNo || $scope.pageModel.currentPage || 1, pageSize: $scope.pageModel.pageSize || 10 }, data);
            fac.getPageResult("/ovu-pcos/pcos/building_search/workunit/decoration/queryList.do", $scope.search, function (res) {
                $scope.pageModel = res;
            });

        };
        // 显示报装证件
        vm.showReportCertif = function (item) {
            var modal = $uibModal.open({
                animation: false,
                templateUrl: '../view/newowner/ownerInfo/workunit/modal.reportCertif.html',
                size: 'lg',
                controller: 'ReportCertifCtrl',
                controllerAs: 'vm',
                resolve: { item: item }
            });



        };

    })
    // 报装证件
    app.controller('ReportCertifCtrl', function ($scope, $rootScope, $http, $filter, $uibModal, $uibModalInstance, fac, item) {
        var vm = $scope.vm = this;
        vm.item = item;
        vm.showPhoto = $rootScope.showPhoto;
        vm.processImgUrl = $rootScope.processImgUrl;

        // 请求所有的报装文件
        $http.post('/ovu-pcos/pcos/presFile/list.do', {
            pageIndex: 0,
            pageSize: 100
        }, fac.postConfig).then(function (res) {
            var data = res.data.data;

            if (!item.certificateUrl || !item.certificateId) {
                msg('该报装请求没有报装证件');
            } else {
                var arr = item.certificateUrl.split(',');

                var ids = item.certificateId.split(',');
                arr = arr.map(function (url, index) {
                    var file = data.filter(function (v) {
                        return v.id === parseInt(ids[index]);
                    })[0];
                    if (file) {
                        return [file.fileName, url];
                    } else {
                        return ['该类文件已删除', ''];
                    }
                }).filter(function (v) {
                    return v[1];
                });
                if (!arr.length) {
                    msg('该报装请求没有报装证件');
                    return;
                }
                // 默认显示第一张图片
                arr[0].active = true;
                vm.imgUrl = vm.processImgUrl(arr[0][1]);
                vm.certifList = arr;

            }
        });


        vm.clickPicTitle = function (item, list) {
            list.forEach(function (v) {
                v.active = false;
            });
            item.active = true;
            vm.imgUrl = vm.processImgUrl(item[1]);

        };
        vm.cancel = function () {

            $uibModalInstance.dismiss('cancel');
        };
    })

    //工单查询
    app.controller("workunitPoolCtrl", function ($scope, $rootScope, $http, $filter, $uibModal, fac) {
        $scope.pageModel = {};
         $scope.search={};
        $scope.$on('index1', function (event, data) {

            $scope.find(1, data);

        });
        $scope.search.unitStatus=5
        $scope.find = function (pageNo, data) {

            angular.extend($scope.search,{ unitStatus:$scope.search.unitStatus,currentPage: pageNo || $scope.pageModel.currentPage || 1, pageSize: $scope.pageModel.pageSize || 10 }, data);
            fac.getPageResult("/ovu-pcos/pcos/building_search/workunit/workunitSearche/queryList.do", $scope.search, function (res) {
                $scope.pageModel = res;
            });

        };
    })
    //设备模块
    app.controller("equipmentCtrl", function ($scope, $rootScope, $http, $filter, $uibModal, fac) {
        $scope.pageModel = {};
        $scope.search={};
        $scope.$on('index2', function (event, data) {
            $scope.find(1, data);
        });
        
        $scope.find = function (pageNo, data) {
            angular.extend($scope.search,{ currentPage: pageNo || $scope.pageModel.currentPage || 1, pageSize: $scope.pageModel.pageSize || 10 }, data);
            fac.getPageResult("/ovu-pcos/pcos/building_search/equip_search/queryList.do", $scope.search, function (res) {
                $scope.pageModel = res;
            });
        };
    })
})();
