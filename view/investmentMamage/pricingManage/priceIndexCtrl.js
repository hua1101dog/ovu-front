(function() {
		var app = angular.module("angularApp");
		app.controller('fixPriceCtl', function ($scope, $rootScope, $http, $filter, $uibModal, fac) {
			document.title ="定价管理";
			angular.extend($rootScope,fac.dicts);
			$scope.search = {};
			$scope.pageModel = {};
			$scope.isShow = true;

            //列表
			$scope.find = function(pageNo){
			    $scope.search.parkId = app.park.parkId;
				$.extend($scope.search,{currentPage:pageNo||$scope.pageModel.currentPage||1,pageSize:$scope.pageModel.pageSize||10});
				$scope.search.pageIndex = $scope.search.currentPage-1;
				$scope.search.totalCount = $scope.pageModel.totalCount || 0;

				fac.getPageResult("/ovu-park/backstage/invest/priceManage/list", $scope.search, function (data) {
					$scope.pageModel = data;
				});
			};
            
			//选择分期
			$scope.changeStage= function(STAGE){
				if(null == STAGE){
					delete $scope.floorList;
					delete $scope.unitList;
					delete $scope.groundList;
					$scope.search.stageId = null;
				}else{
				    $scope.search.stageId = STAGE.id;
				    loadFloorListByStageId(STAGE.id);
				}
				$scope.pageModel.currentPage = 1;
			}
			//选择楼栋
			$scope.changeFloor= function(FLOOR){
				if(null == FLOOR){
				    delete $scope.unitList;
				    delete $scope.groundList;
				    scope.search.buildId = null;
				} else {
				    $scope.search.buildId = FLOOR.id;
				    loadUnitListByFloorId(FLOOR.id)
					
				}	
				$scope.pageModel.currentPage = 1;
			}
		    //选择单元
			$scope.changeUnit = function (unit) {
			    if (null == unit) {
			        delete $scope.groundList;
			        $scope.search.unitId = null;
			    } else {
			        $scope.search.unitId = unit.id;
			        loadGroundListByUnitId(unit.id);
			    }
			    $scope.pageModel.currentPage = 1;
			}
			//选择楼层
			$scope.changeGround = function (GROUND_NUM) {
			    if (null == GROUND_NUM) {
			        $scope.search.floorId= null;
			    } else {
			        $scope.search.floorId = GROUND_NUM.id;
			        $scope.search.floorNum = GROUND_NUM;
			    }
			    $scope.pageModel.currentPage = 1;
			}
		    //定价状态
			$scope.getStatus= function(STATUS){
			    $scope.search.status= STATUS;
			}
			
			//定价操作
			$scope.showFixModal = function (house) {
				house = house ||angular.extend({},$scope.search);
				var copy = angular.extend({},house);
				var modal = $uibModal.open({
					animation: false,
					size: 'md',
					templateUrl: '/view/investmentMamage/pricingManage/modal.fixPrice.html',
					controller: 'addOrEditPriceCtrl'
					, resolve: {house: copy}
				});
				modal.result.then(function () {
					if($scope.pageModel.data.length == 1 && $scope.pageModel.currentPage > 1){
						$scope.pageModel.currentPage = $scope.pageModel.currentPage -1;
					}
					$scope.find();
				}, function () {
					console.info('Modal dismissed at: ' + new Date());
				});
			}

			//function hasActivePark() {
			//	if (!$scope.search.PARK_ID) {
			//		alert("请选择项目！");
			//		return false;
			//	} else {
			//		return true;
			//	}
			//}
            //分期类型
			function loadStageListByParkId(parkId){
				$scope.stageList = [];
			    $http.post("/ovu-park/backstage/invest/priceManage/getParkStageList", {
					parkId : parkId
			    }, fac.postConfig).success(function (data) {
					$scope.stageList = data.data;
				});
			}
			//楼栋类型
			function loadFloorListByStageId(stageId){
				$scope.floorList = [];
			    $http.post("/ovu-park/backstage/invest/priceManage/getParkBuildList", {
					stageId : stageId
				},fac.postConfig).success(function(data){
					$scope.floorList = data.data;
				});
			}
		    //单元类型
			function loadUnitListByFloorId(floorId) {
			    $scope.unitList = [];
			    $http.post("/ovu-park/backstage/invest/priceManage/getParkUnitList", {
			        buildId: floorId
			    }, fac.postConfig).success(function (data) {
			        $scope.unitList = data.data;
			    });
			}
			//楼层类型
			function loadGroundListByUnitId(unitId){
				$scope.groundList = [];
			    $http.post("/ovu-park/backstage/invest/priceManage/getParkFloorList", {
			        unitId: unitId
				},fac.postConfig).success(function(data){
					$scope.groundList = data.data;
				});
			}
			
			
            //初始化
			app.modulePromiss.then(function() {
	            fac.initPage($scope,function(){
	                loadStageListByParkId(app.park.parkId);
	            	$scope.find();
	            })
	        });
		});
    //定价弹出框
		app.controller('addOrEditPriceCtrl', function ($scope, $http, $uibModalInstance, $filter, fac, house) {
			$scope.savePrice = function (item) {
				
			    var obj = { "id": item.id, "price": item.price };
				
				
				$.post("/ovu-park/backstage/invest/priceManage/save", obj, function (data) {
						if(data.code == 0){
							$uibModalInstance.close();
						}else{
						    alert(data.message);
						}
				});
			}
			
			$scope.cancel = function () {
				$uibModalInstance.dismiss('cancel');
			};
			
			$scope.item = house;
		});
	})()
