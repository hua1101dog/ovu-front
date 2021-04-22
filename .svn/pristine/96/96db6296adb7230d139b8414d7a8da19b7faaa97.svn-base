var twoDparam = {};
window.houseID = '';
(function() {
    var app = angular.module("angularApp");
    app.controller('saleManageCtl', function ($scope,$rootScope,$http,$filter,$uibModal,fac,$state) {
        document.title = "出售管理";
        angular.extend($rootScope, fac.dicts);
        $scope.search = {};
        $scope.pageModel = {};
        $scope.isShow = true;

        //列表
        $scope.find = function (pageNo) {
            
            $scope.search.parkId = app.park.parkId;
            $.extend($scope.search, { currentPage: pageNo || $scope.pageModel.currentPage || 1, pageSize: $scope.pageModel.pageSize || 10 });
            $scope.search.pageIndex = $scope.search.currentPage - 1;
            $scope.search.totalCount = $scope.pageModel.totalCount || 0;

            fac.getPageResult("/ovu-park/backstage/invest/saleManage/list", $scope.search, function (data) {
                $scope.pageModel = data;
            });
        };

        //选择分期
        $scope.changeStage = function (STAGE) {
            if (null == STAGE) {
                delete $scope.floorList;
                delete $scope.unitList;
                delete $scope.groundList;
                $scope.search.stageId = null;
            } else {
                $scope.search.stageId = STAGE.id;
                loadFloorListByStageId(STAGE.id);
            }
            $scope.pageModel.currentPage = 1;
        }
        //选择楼栋
        $scope.changeFloor = function (FLOOR) {
            if (null == FLOOR) {
                delete $scope.unitList;
                delete $scope.groundList;
                $scope.search.buildId = null;
            } else {
                $scope.search.buildId = FLOOR.id;
                loadUnitListByFloorId(FLOOR.id)

            }
            $scope.pageModel.currentPage = 1;
        }
        //选择单元
        $scope.changeUnit = function (build, unit) {
            if (null == unit) {
                delete $scope.groundList;
                $scope.search.unitNum = null;
            } else {
                $scope.search.unitNum = unit;
                loadGroundListByUnitId(build.id, unit);
            }
            $scope.pageModel.currentPage = 1;
        }
        //选择楼层
        $scope.changeGround = function (GROUND_NUM) {
            if (null == GROUND_NUM) {
                $scope.search.floorNum = null;
            } else {
                $scope.search.floorNum = GROUND_NUM;
            }
            $scope.pageModel.currentPage = 1;
        }
        //发布状态
        $scope.getStatus = function (STATUS) {
            $scope.search.status = STATUS;
            $scope.pageModel.currentPage = 1;
        }

        //售操作
        $scope.sell = function (id) {

            var modal = $uibModal.open({
                animation: true,
                size: '',
                templateUrl: '/view/investmentMamage/sellManage/modal.rent.html',
                controller: 'leaseOrSaleCtrl',
                resolve: { param:{'id': id } }
                
            });
            modal.result.then(function () {
                $scope.find();
            }, function () {
                console.info('Modal dismissed at: ' + new Date());
            });

        };

        

        //分期类型
        function loadStageListByParkId(parkId) {
            $scope.stageList = [];
            $http.post("/ovu-park/backstage/invest/saleManage/getParkStageList", {
                parkId: parkId
            }, fac.postConfig).success(function (data) {
                $scope.stageList = data.data;
            });
        }
        //楼栋类型
        function loadFloorListByStageId(stageId) {
            $scope.floorList = [];
            $http.post("/ovu-park/backstage/invest/priceRelease/getParkBuildList", {
                stageId: stageId
            }, fac.postConfig).success(function (data) {
                $scope.floorList = data.data;
            });
        }
        //单元类型
        function loadUnitListByFloorId(floorId) {
            $scope.unitList = [];
            $http.post("/ovu-park/backstage/invest/priceRelease/getParkUnitList", {
                buildId: floorId
            }, fac.postConfig).success(function (data) {
                $scope.unitList = data.data;
            });
        }
        //楼层类型
        function loadGroundListByUnitId(build, unitId) {
            $scope.groundList = [];
            $http.post("/ovu-park/backstage/invest/priceRelease/getParkFloorList", {
                buildId: build,
                unitNum: unitId
            }, fac.postConfig).success(function (data) {
                $scope.groundList = data.data;
            });
        }

        //初始化
        app.modulePromiss.then(function () {
            fac.initPage($scope, function () {
                loadStageListByParkId(app.park.parkId);
                $scope.find();
            })
        });
       
    });
    //售弹出框
    // 添加乙方
    app.controller('leaseOrSaleCtrl', function ($scope, $rootScope, $http, $uibModalInstance, $filter, fac, param) {
        $scope.search = {};
        $scope.personPageModel = {};
        $scope.companyPageModel = {};
        // 获取 乙方人员列表
        $scope.searchCustomers1 = function (pageNo) {
            $scope.search.parkId = app.park.parkId;
            $.extend($scope.search, { currentPage: pageNo || $scope.personPageModel.currentPage || 1, pageSize: $scope.personPageModel.pageSize || 10 });
            $scope.search.pageIndex = $scope.search.currentPage - 1;
            $scope.search.totalCount = $scope.personPageModel.totalCount || 0;

            $http.post("/ovu-park/backstage/rental/contract/getPersonInfo",  $scope.search, fac.postConfig).success(function (resp) {
                if (resp.code==0) {
                    $scope.personList = resp.data.data;
                    $scope.personPageModel = resp.data;
                    $scope.personPageModel.currentPage = $scope.personPageModel.pageIndex + 1;
                    var pages = [];
                    var hash = {};
                    var list = [1, $scope.search.currentPage - 1, $scope.search.currentPage, $scope.search.currentPage + 1, $scope.personPageModel.pageTotal];
                    list.forEach(function (v) {
                        if (!hash[v] && v <= $scope.personPageModel.pageTotal && v > 0) {
                            hash[v] = true;
                            pages.push(v);
                        }
                    })
                    if (pages.length > 2 && pages.indexOf(2) == -1) {
                        pages.splice(1, 0, '······');
                    }
                    if (pages.length > 2 && pages.indexOf($scope.personPageModel.pageTotal - 1) == -1) {
                        pages.splice(pages.length - 1, 0, '······');
                    }
                    $scope.personPageModel.pages = pages;
                } else {
                    window.alert(resp.message);
                }
            });
        }

        // 获取 乙方企业列表
        $scope.searchCustomers2 = function (pageNo) {
            $scope.search.parkId = app.park.parkId;
            $.extend($scope.search, { currentPage: pageNo || $scope.companyPageModel.currentPage || 1, pageSize: $scope.companyPageModel.pageSize || 10 });
            $scope.search.pageIndex = $scope.search.currentPage - 1;
            $scope.search.totalCount = $scope.companyPageModel.totalCount || 0;
            $http.post("/ovu-park/backstage/rental/contract/getCompanyInfo", $scope.search, fac.postConfig).success(function (resp) {
                if (resp.code==0) {
                    $scope.companyList = resp.data.data;
                    $scope.companyPageModel = resp.data;
                    $scope.companyPageModel.currentPage = $scope.companyPageModel.pageIndex + 1;
                    var pages = [];
                    var hash = {};
                    var list = [1, $scope.search.currentPage - 1, $scope.search.currentPage, $scope.search.currentPage + 1, $scope.companyPageModel.pageTotal];
                    list.forEach(function (v) {
                        if (!hash[v] && v <= $scope.companyPageModel.pageTotal && v > 0) {
                            hash[v] = true;
                            pages.push(v);
                        }
                    })
                    if (pages.length > 2 && pages.indexOf(2) == -1) {
                        pages.splice(1, 0, '······');
                    }
                    if (pages.length > 2 && pages.indexOf($scope.companyPageModel.pageTotal - 1) == -1) {
                        pages.splice(pages.length - 1, 0, '······');
                    }
                    $scope.companyPageModel.pages = pages;
                } else {
                    window.alert(resp.message);
                }
            });
        }

        // 选中乙方
        $scope.selectSecondPart = function (event, x) {
            $scope.secondParty = x;
            if (event.target.tagName.toLowerCase() != "td" && event.target.tagName.toLowerCase() != "tr") {
                return false;
            }
            $(event.target).parent().parent().children("tr").removeClass("success");
            $(event.target).parent().addClass("success");
        }
        // 保存
        $scope.save = function () {
            $http.post("/ovu-park/backstage/invest/saleManage/save", { id: param.id, purchaserId: $scope.secondParty.personId}, fac.postConfig).success(function (resp) {
                if (resp.code == 0) {
                    $uibModalInstance.close();
                } else {
                    window.alert(resp.message);
                }
            });
           
           
        }
        // 取消
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        }

        app.modulePromiss.then(function () {
            $scope.searchCustomers1();
            $scope.searchCustomers2();
        });
    });

})();
