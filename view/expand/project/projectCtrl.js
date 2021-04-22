/**
 * Created by ghostsf on 2017/9/15.
 */
(function () {
    "use strict";
    var app = angular.module("angularApp");

    //项目管理ctrl
    app.controller('projectCtrl', function ($scope, $state, $rootScope, $http, $filter, $uibModal, fac) {
        document.title = "OVU-项目拓展-项目管理";
        $scope.pageModel = {};
        $scope.search = {};

        app.modulePromiss.then(function () {
            $scope.search.checkState = 0;
            $scope.find();
        });

        $scope.checkStates = [[0, "待审核"]];

        /**
         * 切换审核状态列表
         * @param checkState
         */
        $scope.switchTab = function (checkType) {
            if (checkType == 0) {
                $scope.checkStates = [[0, "待审核"]];
                $scope.search.checkState = 0;
            } else {
                $scope.checkStates = [[3, "已审核"], [1, "审核通过"], [2, "审核不通过"]];
                $scope.search.checkState = 3;
            }
            $scope.pageModel.currentPage = 1;
            $scope.find();
        }

        /**
         * 搜索查询
         * @param pageNo
         */
        $scope.find = function (pageNo) {
            angular.extend($scope.search, {
                currentPage: pageNo || $scope.pageModel.currentPage || 1,
                pageSize: $scope.pageModel.pageSize || 10
            });
            fac.getPageResult("/ovu-pcos/pcos/expand/project/listInfo.do", $scope.search, function (data) {
                $scope.pageModel = data;
            });
        };

        /**
         * 新增、编辑框
         * @param id
         */
        $scope.showEditModal = function (id) {
            var param = {
                id: id
            };
            var modal = $uibModal.open({
                animation: true,
                size: 'lg',
                templateUrl: 'expand/project/modal.edit.html',
                controller: 'editCtrl'
                , resolve: {param: param}
            });
            modal.result.then(function () {
                $scope.find();
            }, function () {
                console.info('Modal dismissed at: ' + new Date());
            });
        }

        /**
         * 查看项目详情
         * @param id
         */
        $scope.detail = function (id) {
            var param = {
                id: id
            };
            var modal = $uibModal.open({
                animation: true,
                size: 'lg',
                templateUrl: 'expand/project/modal.detail.html',
                controller: 'detailCtrl'
                , resolve: {param: param}
            });
            modal.result.then(function () {
                $scope.find();
            }, function () {
                console.info('Modal dismissed at: ' + new Date());
            });
        }

        /**
         * 审核
         * @param id
         */
        $scope.check = function (id) {
            console.log("check...");
            var param = {
                id: id
            };
            var modal = $uibModal.open({
                animation: true,
                size: 'lg',
                templateUrl: 'expand/project/modal.check.html',
                controller: 'checkCtrl'
                , resolve: {param: param}
            });
            modal.result.then(function () {
                $scope.find();
            }, function () {
                console.info('Modal dismissed at: ' + new Date());
            });
        };

        /**
         * 删除
         * @param item
         */
        $scope.del = function (id) {
            confirm("确认删除该项目吗?", function () {
                $http.get("/ovu-pcos/pcos/expand/project/delete.do?projectID=" + id).success(function (data, status, headers, config) {
                    if (data.state == "success") {
                        $scope.find();
                        msg("删除成功!");
                    } else {
                        msg(data.state);
                    }
                });
            })
        };

    });

    /**
     * 项目编辑Ctrl
     */
    app.controller('editCtrl', function ($scope, $rootScope, $http, $uibModalInstance, $uibModal, $filter, fac, param) {
        $scope.exp_elevatorBrand = [[1, "三菱"], [2, "日立"]];
        $scope.exp_centralAir = [[1, "有"], [0, "无"]];
        $scope.exp_coalGas = [[2, "市政煤气"], [1, "专用煤气"], [0, "其他"]];
        $scope.exp_isCommonWaterSpend = [[1, "是"], [0, "否"]];
        $scope.exp_propertyManagement = [[2, "全权委托"], [1, "顾问管理"], [0, "其他"]];
        $scope.exp_hasOwnPropertyCompany = [[1, "有"], [0, "无"]];

        $scope.providePaperList = [
            {"id": 1, "text": "总平面图", "chosen": false},
            {"id": 2, "text": "首层平面图", "chosen": false},
            {"id": 3, "text": "地下室平面图", "chosen": false},
            {"id": 4, "text": "其他", "chosen": false},
        ];
        $scope.intelligentFacilitiesList = [
            {"id": 1, "text": "门禁", "chosen": false},
            {"id": 2, "text": "电子巡更", "chosen": false},
            {"id": 3, "text": "停车场IC卡", "chosen": false},
            {"id": 4, "text": "闭路监控", "chosen": false},
        ];

        if (param.id != null && typeof(param.id) != "undefined") {
            $scope.isAdd = 0;
        } else {
            $scope.isAdd = 1;
        }

        $scope.item = {};
        if (fac.isNotEmpty(param.id)) {
            $http.get("/ovu-pcos/pcos/expand/project/get.do?projectID=" + param.id).success(function (data) {
                if (data.state == "success") {
                    $scope.item = data.data;
                    delete $scope.item.createTime;
                    if ($scope.item.providePaper) {
                        var f = false;
                        $scope.providePaperList.forEach(function (n) {
                            if ($scope.item.providePaper.indexOf(n.id) > -1) {
                                n.chosen = true
                                f = true;
                            }
                        });
                        if (!f) {
                            $scope.providePaperList.forEach(function (n) {
                                n.chosen = false
                            });
                        }
                    }
                    if ($scope.item.intelligentFacilities) {
                        var f = false;
                        $scope.intelligentFacilitiesList.forEach(function (n) {
                            if ($scope.item.intelligentFacilities.indexOf(n.id) > -1) {
                                n.chosen = true
                                f = true;
                            }
                        });
                        if (!f) {
                            $scope.intelligentFacilitiesList.forEach(function (n) {
                                n.chosen = false
                            });
                        }
                    }
                } else {
                    alert(data.state);
                }
            })
        }

        $scope.save = function (form, item) {
            form.$setSubmitted(true);
            if (!form.$valid) {
                return;
            }

            var providePaperListTemp = $scope.providePaperList.filter(function (n) {
                return n.chosen
            });
            if (!providePaperListTemp || providePaperListTemp.length == 0) {
                item.providePaper = 0;
            } else {
                var list = providePaperListTemp.reduce(function (sum, n) {
                    sum.push(n.id);
                    return sum;
                }, []);
                item.providePaper = list.join();
            }

            var intelligentFacilitiesListTemp = $scope.intelligentFacilitiesList.filter(function (n) {
                return n.chosen
            });
            if (!intelligentFacilitiesListTemp || intelligentFacilitiesListTemp.length == 0) {
                item.intelligentFacilities = 0;
            } else {
                var list2 = intelligentFacilitiesListTemp.reduce(function (sum, n) {
                    sum.push(n.id);
                    return sum;
                }, []);
                item.intelligentFacilities = list2.join();
            }

            var param = angular.extend({}, item);
            $http.post("/ovu-pcos/pcos/expand/project/save.do", param, fac.postConfig).success(function (data, status, headers, config) {
                console.log("data:" + data);
                if (data.state == "success") {
                    msg("保存成功!");
                    $uibModalInstance.close();
                } else {
                    alert(data.state);
                }
            })
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    });

    /**
     * 项目详情查看
     */
    app.controller('detailCtrl', function ($scope, $rootScope, $http, $uibModalInstance, $uibModal, $filter, fac, param) {
        $scope.exp_elevatorBrand = [[1, "三菱"], [2, "日立"]];
        $scope.exp_centralAir = [[1, "有"], [0, "无"]];
        $scope.exp_coalGas = [[2, "市政煤气"], [1, "专用煤气"], [0, "其他"]];
        $scope.exp_isCommonWaterSpend = [[1, "是"], [0, "否"]];
        $scope.exp_propertyManagement = [[2, "全权委托"], [1, "顾问管理"], [0, "其他"]];
        $scope.exp_hasOwnPropertyCompany = [[1, "有"], [0, "无"]];

        $scope.providePaperList = [
            {"id": 1, "text": "总平面图", "chosen": false},
            {"id": 2, "text": "首层平面图", "chosen": false},
            {"id": 3, "text": "地下室平面图", "chosen": false},
            {"id": 4, "text": "其他", "chosen": false},
        ];
        $scope.intelligentFacilitiesList = [
            {"id": 1, "text": "门禁", "chosen": false},
            {"id": 2, "text": "电子巡更", "chosen": false},
            {"id": 3, "text": "停车场IC卡", "chosen": false},
            {"id": 4, "text": "闭路监控", "chosen": false},
        ];

        $scope.item = {};
        if (fac.isNotEmpty(param.id)) {
            $http.get("/ovu-pcos/pcos/expand/project/get.do?projectID=" + param.id).success(function (data) {
                if (data.state == "success") {
                    $scope.item = data.data;
                    delete $scope.item.createTime;
                    if ($scope.item.providePaper) {
                        var f = false;
                        $scope.providePaperList.forEach(function (n) {
                            if ($scope.item.providePaper.indexOf(n.id) > -1) {
                                n.chosen = true
                                f = true;
                            }
                        });
                        if (!f) {
                            $scope.providePaperList.forEach(function (n) {
                                n.chosen = false
                            });
                        }
                    }
                    if ($scope.item.intelligentFacilities) {
                        var f = false;
                        $scope.intelligentFacilitiesList.forEach(function (n) {
                            if ($scope.item.intelligentFacilities.indexOf(n.id) > -1) {
                                n.chosen = true
                                f = true;
                            }
                        });
                        if (!f) {
                            $scope.intelligentFacilitiesList.forEach(function (n) {
                                n.chosen = false
                            });
                        }
                    }
                } else {
                    alert(data.state);
                }
            })
        }

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    });

    /**
     * 项目审核
     */
    app.controller('checkCtrl', function ($scope, $rootScope, $http, $uibModalInstance, $uibModal, $filter, fac, param) {
        $scope.exp_elevatorBrand = [[1, "三菱"], [2, "日立"]];
        $scope.exp_centralAir = [[1, "有"], [0, "无"]];
        $scope.exp_coalGas = [[2, "市政煤气"], [1, "专用煤气"], [0, "其他"]];
        $scope.exp_isCommonWaterSpend = [[1, "是"], [0, "否"]];
        $scope.exp_propertyManagement = [[2, "全权委托"], [1, "顾问管理"], [0, "其他"]];
        $scope.exp_hasOwnPropertyCompany = [[1, "有"], [0, "无"]];

        $scope.providePaperList = [
            {"id": 1, "text": "总平面图", "chosen": false},
            {"id": 2, "text": "首层平面图", "chosen": false},
            {"id": 3, "text": "地下室平面图", "chosen": false},
            {"id": 4, "text": "其他", "chosen": false},
        ];
        $scope.intelligentFacilitiesList = [
            {"id": 1, "text": "门禁", "chosen": false},
            {"id": 2, "text": "电子巡更", "chosen": false},
            {"id": 3, "text": "停车场IC卡", "chosen": false},
            {"id": 4, "text": "闭路监控", "chosen": false},
        ];

        $scope.item = {};
        $scope.checkProject = {};
        $scope.checkdata = {
            id: null,
            projectId: null,
            checkState: 1,
            remarks: ""
        };

        if (fac.isNotEmpty(param.id)) {
            $http.get("/ovu-pcos/pcos/expand/project/get.do?projectID=" + param.id).success(function (data) {
                if (data.state == "success") {
                    $scope.item = data.data;
                    delete $scope.item.createTime;
                }
            });
            $http.get("/ovu-pcos/pcos/expand/project/getCheck.do?projectID=" + param.id).success(function (data) {
                if (data.state == "success") {
                    $scope.checkProject = data.data;
                    delete $scope.checkProject.createTime;
                }
            })
        }

        /**
         * 保存审核
         * @param form
         * @param item
         */
        $scope.saveCheck = function (form, checkdata) {
            form.$setSubmitted(true);
            if (!form.$valid) {
                return;
            }
            checkdata.id = $scope.checkProject.id;
            checkdata.projectId = $scope.item.id;
            $http.post("/ovu-pcos/pcos/expand/project/saveCheck.do", checkdata, fac.postConfig).success(function (data, status, headers, config) {
                console.log("data:" + data);
                if (data.state == "success") {
                    msg("保存成功!");
                    $uibModalInstance.close();
                } else {
                    alert(data.state);
                }
            })
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    });

})();
