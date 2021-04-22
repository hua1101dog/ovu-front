(function() {
		var app = angular.module("angularApp");
		app.controller('saleReleaseCtl', function ($scope, $rootScope, $http, $filter, $uibModal, fac) {
		    document.title = "定价发布";
		    angular.extend($rootScope, fac.dicts);
		    $scope.search = {};
		    $scope.pageModel = {};
		    $scope.isShow = true;

		    //列表
		    $scope.find = function (pageNo) {
		        //if(!app.park || !app.park.parkId){
		        //	window.msg("请先选择一个项目!");
		        //	return false;
		        //}
		        $scope.search.parkId = app.park.parkId;
		        $.extend($scope.search, { currentPage: pageNo || $scope.pageModel.currentPage || 1, pageSize: $scope.pageModel.pageSize || 10 });
		        $scope.search.pageIndex = $scope.search.currentPage - 1;
		        $scope.search.totalCount = $scope.pageModel.totalCount || 0;

		        fac.getPageResult("/ovu-park/backstage/invest/saleRelease/list", $scope.search, function (data) {
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

		    //审核操作
		    $scope.publishSale = function (id,type) {
		        var confim;
		        if (type == 3) {
		            confim = '通过'
		        } else {
		            confim = '驳回'
		        }
		        confirm("确认"+confim+"房屋信息吗?", function () {
		            $.post("/ovu-park/backstage/invest/saleRelease/save", { "id": id, "status": type }, function (data) {
		                if (data.code ==0) {
		                    if (($scope.pageModel.data.length == 1 || $scope.select) && $scope.pageModel.currentPage > 1) {
		                        $scope.pageModel.currentPage = $scope.pageModel.currentPage - 1;
		                    }
		                    $scope.find();
		                } else {
		                    alert("操作失败");
		                }
		            });
		        })
		    }

		    

		    //分期类型
		    function loadStageListByParkId(parkId) {
		        $scope.stageList = [];
		        $http.post("/ovu-park/backstage/invest/saleRelease/getParkStageList", {
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
		    // 导入表格
		    $scope.uploadFile = function () {
		        $scope.importInvestExcel($scope,'url', 'name', ['.xls','.xlsx']);
		    }
            // 下载模板
            $scope.downloadFile = function () {
                $scope.downInvestSaleTmpl();
            }

            //下载招商系统出售模板
            $scope.downInvestSaleTmpl = function(){
                var url="/ovu-park/backstage/invest/saleRelease/downLoadExcelModel";
                getBlankTmpl(url,'invsetSale');
            }

            function getBlankTmpl(url,type){
                var elemIF = document.createElement("iframe");
                elemIF.src = url+"?type="+type;
                elemIF.style.display = "none";
                document.body.appendChild(elemIF);
            }

		    //初始化
		    app.modulePromiss.then(function () {
		        fac.initPage($scope, function () {
		            loadStageListByParkId(app.park.parkId);
		            $scope.find();
		        })
		    });
		});
		
	})()
