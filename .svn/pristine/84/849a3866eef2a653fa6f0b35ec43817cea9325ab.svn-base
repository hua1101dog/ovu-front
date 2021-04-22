(function() {
	var app = angular.module("angularApp");
	app.controller('waterMeterCtl', function ($scope, $rootScope, $http, $filter, $uibModal, fac) {	
		document.title ="OVU-能源水表管理";
		angular.extend($rootScope,fac.dicts);
		$scope.search = {};
		$scope.pageModel = {};
		$scope.stageMap = {};
		$scope.floorMap = {};
		$scope.houseMap = {};
		
		$scope.find = function(pageNo){
			$scope.search.PARK_ID=app.park.ID;
        	if(!app.park || !app.park.ID){
				window.msg("请先选择一个项目!");
				return false;
			}
			$scope.search.parkId = app.park.ID;
            if($scope.pageModel.currentPage){
                delete $scope.pageModel.currentPage;
            }
			
			$.extend($scope.search,{currentPage:pageNo||$scope.pageModel.currentPage||1,pageSize:$scope.pageModel.pageSize||10});
			$scope.search.pageIndex = $scope.search.currentPage-1;
			$scope.search.totalCount = $scope.pageModel.totalCount||0;
			
			console.log($scope.search);
			fac.getPageResult("/ovu-park/backstage/equipment/waterMeter/list", $scope.search, function(data){
				$scope.pageModel = data;
			});
			fac.getPageResult("/ovu-park/backstage/equipment/waterMeter/spaceList",$scope.search,function(data){
				$scope.stageMap = data.stageMap;
				$scope.floorMap = data.floorMap;
				$scope.houseMap = data.houseMap;
            });
		};
		
		app.modulePromiss.then(function() {
            fac.initPage($scope,function(){
            	$scope.find();
            })
        });
		
		//空间相关
		loadStageListByParkId(app.park.ID);
        $scope.changeStage= function(STAGE){
			if(null == STAGE){
				delete $scope.floorList;
				delete $scope.groundList;
				delete $scope.search.stageId;
				delete $scope.search.floorId;
				delete $scope.search.groundNum;
			}else{
				$scope.search.stageId = STAGE.ID;
				loadFloorListByStageId(STAGE.ID);
			}
			$scope.find();
		}
		
		$scope.changeFloor= function(FLOOR){
			if(null == FLOOR){
				delete $scope.groundList;
				delete $scope.search.floorId;
			}else{
				$scope.search.floorId = FLOOR.iD;
				loadGroundListByFloorId(FLOOR.iD);
			}	
			$scope.find();
		}
		
		$scope.changeGround= function(GROUND){
			$scope.search.groundNum = GROUND;
			$scope.find();
		}
		
		function loadStageListByParkId(parkId){
			$scope.stageList = [];
			$http.post("/ovu-base/system/parkStage/findStagesByParkId", {
				parkId : parkId
			},fac.postConfig).success(function(data){
				$scope.stageList = data.data;
			});
		}
		
		function loadFloorListByStageId(stageId){
			$scope.floorList = [];
			$http.post("/ovu-base/system/parkFloor/findFloorsByStageId", {
				stageId : stageId
			},fac.postConfig).success(function(data){
				$scope.floorList = data.data;
				console.log(data);
			});
		}
		
		function loadGroundListByFloorId(floorId){
			$scope.groundList = [];
			$http.post("/ovu-base/system/parkFloor/findGroundNoList", {
				floorId : floorId
			},fac.postConfig).success(function(data){
				if (data.data[0] == null) {
					$scope.groundList = [];
				}else {
					
					$scope.groundList = data.data;
				}
			});
		}
		
		
		//删除能源水表
		$scope.del = function (item) {
			confirm("确认删除能源水表信息吗?", function () {
				$.post("/ovu-park/backstage/equipment/waterMeter/remove", {"ids": item.id}, function (data) {
					$scope.find(1);
				});
			})
		};
		
		$scope.checkInputFlow = function(item, callback){
			if(!item.flowNow){
				msg("请先填写流量");
				return;
			}
			if(!item.readingTimeNow){
				msg("请先选择读表时间");
				return;
			}
			
			if(item.flowNow < item.flow){
				confirm("你填写的流量值小于上期读数, 确认继续将会录入数据且把水表置为异常, 是否继续?", function () {
					callback();
				});
			}else{
				var currDate = new Date().format("yyyy-MM"), readTime = item.readingTime;
				if(!readTime || readTime.trim() == ""){
					confirm("确认保存新的能源水表读数信息吗?", function () {
						callback();
					});
				}else{
					readTime = readTime.substring(0, 7);
					if(currDate == readTime){
						confirm(readTime+"月已有录入数据, 确认继续将会被当前的录入数据覆盖, 是否继续?", function () {
							callback();
						});
					}else{
						confirm("确认保存新的能源水表读数信息吗?", function () {
							callback();
						});
					}
				}
				
			}
			
		};
		
		//保存读数
		$scope.saveFlow = function(item){
			$scope.checkInputFlow(item, function(){
				$.post("/ovu-park/backstage/equipment/waterMeter/updateWaterMeter", {
						"id": item.id,
						"flow": item.flow,
						"readingTime": item.readingTime,
						"flowNow": item.flowNow,
						"readingTimeNow": item.readingTimeNow,
						"parkId": app.park.ID,
						"updatorId": app.user.ID
					}, function (data) {
						if (data.code != 1) {
							msg(data.message);
						}
						$scope.find();
				});
			});
			
		};
		
		//新增/编辑水表
		$scope.showEditModal = function(waterMeter){
			if (!app.park) {
				windows.error("请先选择一个项目!");
				return false;
			}
			waterMeter = waterMeter || {flow : 0, status : "2", watermeterType : "1", creatorId : app.user.ID};
			waterMeter.parkId = app.park.ID;
			waterMeter.updatorId = app.user.ID;
			
			var data = angular.extend({}, waterMeter);
			
			var modal = $uibModal.open({
				animation: false,
				size: 'md',
				templateUrl: '/view/deviceManage/energyWaterMeter/modal.editWaterMeter.html',
				controller: 'editWaterMeterCtrl', 
				resolve: {waterMeter: data}
			});
			modal.rendered.then(function(){
				/*console.log("Modal rendered");*/
				
				$('#multi_ground_num').selectpicker();
				$('#multi_ground_num').selectpicker("val", "");
			});
			modal.result.then(function () {
				/*console.info('Modal EditWaterMeter closed at: ' + new Date());*/
				isInitSelect = true;
				$scope.find();
			}, function () {
				/*console.info('Modal dismissed at: ' + new Date());*/
				isInitSelect = true;
			});
		};
		
		//展示水表历史记录详情
		$scope.showDetailsModal = function(waterMeter){
			waterMeter = waterMeter || {};
			var data = angular.extend({}, waterMeter);
			
			var modal = $uibModal.open({
				animation: false,
				size: 'md',
				templateUrl: '/view/deviceManage/energyWaterMeter/modal.waterMeterDetails.html',
				controller: 'waterMeterDetailsCtrl', 
				resolve: {waterMeter: data}
			});
			modal.result.then(function () {
				/*console.info('Modal closed at: ' + new Date());*/
			}, function () {
				/*console.info('Modal dismissed at: ' + new Date());*/
			});
		};
	});
	
	app.controller('editWaterMeterCtrl', function($scope, $rootScope, $http, $uibModalInstance, $filter, fac, $uibModal, waterMeter){
		$scope.item = waterMeter;
		$scope.isDisable = false;
		
		//分期列表
		$scope.loadStage = function(){
			$scope.stageList = [];
			fac.getPageResult("/ovu-base/system/parkStage/findStagesByParkId", {parkId : app.park.ID,}, function(data){
				$scope.StageList = data;
			});
		}
		//楼栋列表
		$scope.loadBuild = function(){
			$scope.BuildList = [];
			fac.getPageResult("/ovu-base/system/parkFloor/findFloorsByStageId", {stageId : $scope.item.stageId}, function(data){
				$scope.BuildList = data;
			});
		}
		//楼层列表
		$scope.loadGround = function(){
			$scope.GroundList = [];
			
			$.post("/ovu-base/system/parkFloor/findGroundNoList", {floorId : $scope.item.floorId}, function(data){
				if (data.data[0] == null || data.data[0] == 0) {
					$scope.GroundList = [];
				}else {
					$scope.GroundList = data.data;
				}
				/*if($scope.ground){
					for(var i=0;i<=$scope.ground;i++){
						$scope.GroundList.push(i);
					}
				}*/
				$scope.$apply();
				$("#multi_ground_num").selectpicker('refresh');
				var arr = "";
				if($scope.item.groundNum && $scope.item.groundNum != ""){
					arr = $scope.item.groundNum.split(",");
				}
				$('#multi_ground_num').selectpicker("val", arr);
			});
		}
		//房间列表
		$scope.loadHouse = function(){
			fac.getPageResult("/ovu-base/system/parkHouse/getCurrentFloorHouses", {buildId : $scope.item.floorId, groundNo : $scope.item.groundNum}, function(data){
				$scope.HouseList = data;
			});
		}
		
		$scope.changeStage= function(){
			if(!$scope.item.stageId || $scope.item.stageId == ""){
				$scope.BuildList = [];
				$scope.GroundList = [];
				$scope.HouseList = [];
			}else{
				$scope.loadBuild();
			}
		}
		
		$scope.changeBuild= function(){
			if(!$scope.item.floorId || $scope.item.floorId == ""){
				$scope.GroundList = [];
				$scope.HouseList = [];
			}else{
				$scope.loadGround();
			}
		}
		
		$scope.changeGround= function(){
			if(!$scope.item.groundNum || $scope.item.groundNum == ""){
				$scope.HouseList = [];
			}else{
				$scope.loadHouse();
			}
		}
		
		
		$scope.changeType = function(){
			if($scope.item.watermeterType == "2"){
				$scope.loadHouse();
			}
		};
		$scope.loadStage();
		
		if($scope.item.stageId){
			$scope.loadBuild();
		}
		if($scope.item.floorId){
			$scope.loadGround();
		}
		if($scope.item.groundNum && $scope.item.watermeterType == "2"){
			$scope.loadHouse();
		}
		
		$scope.checkWaterMeterCode = function(){
			if($scope.item.code && $scope.item.code.trim() != ""){
				$.post("/ovu-park/backstage/equipment/waterMeter/onlyCode", {code : $scope.item.code.trim()}, function (data) {
					if (data.code != 1) {
						$scope.isDisable = true;
						msg(data.message);
					}else{
						$scope.isDisable = false;
					}
					$scope.$apply();
				});
			}
		};
		
		$scope.save = function (form, item) {
			form.$setSubmitted(true);
			if (!form.$valid) {
				return;
			}
			if(item.times <= 0){
				msg("水表倍率必须为大于0的数字!");
				return false;
			}
			if(item.price <= 0){
				msg("单价必须为大于0的数字!");
				return false;
			}
			
			item.groundNum = item.groundNum.toString();
			if(item.watermeterType == "1"){
				item.houseId = " ";
			}
			
			$http.post("/ovu-park/backstage/equipment/waterMeter/saveOrEdit", $scope.item, fac.postConfig).success(function (code) {
				if(code == 0){
                    alert("操作失败!");
                }else{
                    window.msg("操作成功!");
                    $uibModalInstance.close();
                }
			});
		};
		
		$scope.cancel = function () {
			$uibModalInstance.dismiss('cancel');
		};
	});
	
	app.controller('waterMeterDetailsCtrl', function($scope, $rootScope, $http, $uibModalInstance, $filter, fac, $uibModal, waterMeter){
		angular.extend($rootScope,fac.dicts);
		$scope.waterMeter = waterMeter;
		$scope.search = {};
		$scope.pageModel = {};
		
		$scope.find = function(pageNo){
			if(!app.park || !app.park.ID){
				window.msg("请先选择一个项目!");
				return false;
			}
			$.extend($scope.search,{currentPage:pageNo||$scope.pageModel.currentPage||1,pageSize:$scope.pageModel.pageSize||10});
			$scope.search.pageIndex = $scope.search.currentPage-1;
			$scope.search.totalCount = $scope.pageModel.totalCount||0;
			$scope.search.id = $scope.waterMeter.id;
			$scope.search.parkId = app.park.ID;
			
			$("#toolbarTr").prevAll().remove();
			$("#tableloading").removeClass("hide");
			/*console.log($scope.search);*/
			fac.getPageResult("/ovu-park/backstage/equipment/waterMeterHis/list", $scope.search,function(data){	
				$("#tableloading").addClass("hide");
				console.log(data);
				$scope.pageModel = data;
			});
		};
		
		if($scope.waterMeter && $scope.waterMeter.id){
			$scope.search.id = $scope.waterMeter.id;
			$scope.find();
		}
		
		$scope.cancel = function () {
			$uibModalInstance.dismiss('cancel');
		};
	});
})()