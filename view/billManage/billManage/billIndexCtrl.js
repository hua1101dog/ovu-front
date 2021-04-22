(function() {
	var app = angular.module("angularApp");
	//--------------------------------------------用水账单控制器---------------------------------------------
	app.controller('waterBillCtl', function ($scope, $rootScope, $http, $filter, $uibModal, fac) {	
		document.title ="OVU-账单管理";
		angular.extend($rootScope, fac.dicts);
		$scope.search = {};
		$scope.pageModel = {};
		
		$scope.find = function(pageNo){
			if(!app.park || !app.park.ID){
				window.msg("请先选择一个项目!");
				return false;
			}
			$scope.search.parkId = app.park.ID;
			$.extend($scope.search,{currentPage:pageNo||$scope.pageModel.currentPage||1, pageSize:$scope.pageModel.pageSize||10});
			$scope.search.pageIndex = $scope.search.currentPage-1;
			$scope.search.totalCount = $scope.pageModel.totalCount||0;
			
			if($("#waterBill_date1").val()){
				$scope.search.startTime = $("#waterBill_date1").val() + " 00:00:00";
			}else{
				delete $scope.search.startTime;
			}
			if($("#waterBill_date2").val()){
				$scope.search.endTime = $("#waterBill_date2").val() + " 23:59:59";
			}else{
				delete $scope.search.endTime;
			}
			fac.getPageResult("/ovu-park/backstage/waterBill/list", $scope.search, function(data){	
				console.log(data);
				$scope.pageModel = data;
			});
		};
		
		$scope.uploadBillInfo = function() {
			if (!app.park.ID) {
				alert("请选择项目！");
				return;
			}
			
			fac.upload({url:'/ovu-park/backstage/waterBill/uploadExcel', params:{parkId : app.park.ID},
				accept:"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"},function(resp){
				if(resp.success){
					window.msg("导入成功!");
					$scope.find(1);
				}else{
					window.alert(resp.error);
				}
			});
		};
		
		app.modulePromiss.then(function() {
            fac.initPage($scope,function(){
            	$scope.find();
            })
        });
		
		//展示水表历史记录详情
		$scope.showDetailsModal = function(waterBill){
			var copy = angular.extend({}, waterBill);
			
			var modal = $uibModal.open({
				animation: false,
				size: 'lg',
				templateUrl: '/view/billManage/billManage/modal.companyWaterBillDetails.html',
				controller: 'companyWaterBillDetailsCtrl', 
				resolve: {waterBill: copy}
			});
			modal.result.then(function () {
				console.info('Modal closed at: ' + new Date());
			}, function () {
				console.info('Modal dismissed at: ' + new Date());
			});
		};
	});
	//--------------------------------------------用水账单详情控制器---------------------------------------------
	app.controller('companyWaterBillDetailsCtrl', function($scope, $rootScope, $http, $uibModalInstance, $filter, fac, $uibModal, waterBill){
		angular.extend($rootScope,fac.dicts);
		$scope.search = waterBill;
		$scope.pageModel = {};
		
		$scope.find = function(pageNo){
			$.extend($scope.search,{currentPage:pageNo||$scope.pageModel.currentPage||1,pageSize:$scope.pageModel.pageSize||10});
			$scope.search.pageIndex = $scope.search.currentPage-1;
			$scope.search.totalCount = $scope.pageModel.totalCount||0;
			
			$("#toolbarTr").prevAll().remove();
			$("#tableloading").removeClass("hide");
			console.log($scope.search);
			delete $scope.search.customerId;
			fac.getPageResult("/ovu-park/backstage/waterBill/listDetails", $scope.search,function(data){	
				$("#tableloading").addClass("hide");
				console.log(data);
				$scope.pageModel = data;
			});
		};
		
		app.modulePromiss.then(function() {
            fac.initPage($scope,function(){
            	$scope.find();
            })
        });
		
		$scope.cancel = function () {
			$uibModalInstance.dismiss('cancel');
		};
	});
	
	
	//----------------------------------------------------------用电账单控制器-------------------------------------------------------
	app.controller('elecBillCtl', function ($scope, $rootScope, $http, $filter, $uibModal, fac) {			
		angular.extend($rootScope,fac.dicts);
		$scope.search = {};
		$scope.pageModel = {};
		
		
		$scope.find = function(pageNo){
			if(!app.park || !app.park.ID){
				window.msg("请先选择一个项目!");
				return false;
			}
			$scope.search.parkId = app.park.ID;
			$.extend($scope.search,{currentPage:pageNo||$scope.pageModel.currentPage||1,pageSize:$scope.pageModel.pageSize||10});
			$scope.search.pageIndex = $scope.search.currentPage-1;
			$scope.search.totalCount = $scope.pageModel.totalCount||0;
			
			if($("#elecBill_date1").val()){
				$scope.search.startTime = $("#elecBill_date1").val() + " 00:00:00";
			}else{
				delete $scope.search.startTime;
			}
			if($("#elecBill_date2").val()){
				$scope.search.endTime = $("#elecBill_date2").val() + " 23:59:59";
			}else{
				delete $scope.search.endTime;
			}
			fac.getPageResult("/ovu-park/backstage/electricityBill/list", $scope.search, function(data){	
				console.log(data);
				$scope.pageModel = data;
			});
		};
		
		$scope.uploadBillInfo = function() {
			if (!app.park.ID) {
				alert("请选择项目！");
				return;
			}
			
			fac.upload({url:'/ovu-park/backstage/electricityBill/uploadExcel', params:{parkId : app.park.ID},
				accept:"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"},function(resp){
				if(resp.success){
					window.msg("导入成功!");
					$scope.find(1);
				}else{
					window.alert(resp.error);
				}
			});
		};
		
		 app.modulePromiss.then(function() {
            fac.initPage($scope,function(){
            	$scope.find();
            })
        });
		
		//展示用电历史记录详情
		$scope.showDetailsModal = function(elecBill){
			var copy = angular.extend({}, elecBill);
			
			var modal = $uibModal.open({
				animation: false,
				size: 'lg',
				templateUrl: '/view/billManage/billManage/modal.companyElecBillDetails.html',
				controller: 'companyElecBillDetailsCtrl', 
				resolve: {elecBill: copy}
			});
			modal.result.then(function () {
				console.info('Modal closed at: ' + new Date());
			}, function () {
				console.info('Modal dismissed at: ' + new Date());
			});
		};
	});
	
	//----------------------------------------------------------用电账单详情控制器-------------------------------------------------------
	app.controller('companyElecBillDetailsCtrl', function($scope, $rootScope, $http, $uibModalInstance, $filter, fac, $uibModal, elecBill){
		angular.extend($rootScope,fac.dicts);
		$scope.search = elecBill;
		$scope.pageModel = {};
		
		$scope.find = function(pageNo){
			$.extend($scope.search,{currentPage:pageNo||$scope.pageModel.currentPage||1,pageSize:$scope.pageModel.pageSize||10});
			$scope.search.pageIndex = $scope.search.currentPage-1;
			$scope.search.totalCount = $scope.pageModel.totalCount||0;
			
			$("#toolbarTr").prevAll().remove();
			$("#tableloading").removeClass("hide");
			console.log($scope.search);
			delete $scope.search.customerId;
			fac.getPageResult("/ovu-park/backstage/electricityBill/listDetails", $scope.search,function(data){	
				$("#tableloading").addClass("hide");
				console.log(data);
				$scope.pageModel = data;
			});
		};
		
		app.modulePromiss.then(function() {
            fac.initPage($scope,function(){
            	$scope.find();
            })
        });
		
		$scope.cancel = function () {
			$uibModalInstance.dismiss('cancel');
		};
	});
	
	
	
	//----------------------------------------------------------物业费账单控制器-------------------------------------------------------
	app.controller('propertyBillCtl', function ($scope, $rootScope, $http, $filter, $uibModal, fac) {			
		angular.extend($rootScope,fac.dicts);
		$scope.search = {};
		$scope.pageModel = {};
		
		$scope.find = function(pageNo){
			if(!app.park || !app.park.ID){
				window.msg("请先选择一个项目!");
				return false;
			}
			$scope.search.parkId = app.park.ID;
			$.extend($scope.search,{currentPage:pageNo||$scope.pageModel.currentPage||1,pageSize:$scope.pageModel.pageSize||10});
			$scope.search.pageIndex = $scope.search.currentPage-1;
			$scope.search.totalCount = $scope.pageModel.totalCount||0;
			
			if($("#propertyBill_date1").val()){
				$scope.search.startTime = $("#propertyBill_date1").val() + " 00:00:00";
			}else{
				delete $scope.search.startTime;
			}
			if($("#propertyBill_date2").val()){
				$scope.search.endTime = $("#propertyBill_date2").val() + " 23:59:59";
			}else{
				delete $scope.search.endTime;
			}
			fac.getPageResult("/ovu-park/backstage/propertyBill/list", $scope.search, function(data){	
				console.log(data);
				$scope.pageModel = data;
			});
		};
		
		$scope.uploadBillInfo = function() {
			if (!app.park.ID) {
				alert("请选择项目！");
				return;
			}
			
			fac.upload({url:'/ovu-park/backstage/propertyBill/uploadExcel', params:{parkId : app.park.ID},
				accept:"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"},function(resp){
				if(resp.success){
					window.msg("导入成功!");
					$scope.find(1);
				}else{
					window.alert(resp.error);
				}
			});
		};
		
		app.modulePromiss.then(function() {
            fac.initPage($scope,function(){
            	$scope.find();
            })
        });
		
		//展示物业费历史记录详情
		$scope.showDetailsModal = function(propertyBill){
			var copy = angular.extend({}, propertyBill);
			
			var modal = $uibModal.open({
				animation: false,
				size: 'lg',
				templateUrl: '/view/billManage/billManage/modal.companyPropertyBillDetails.html',
				controller: 'companyPropertyBillDetailsCtrl', 
				resolve: {propertyBill: copy}
			});
			modal.result.then(function () {
				console.info('Modal closed at: ' + new Date());
			}, function () {
				console.info('Modal dismissed at: ' + new Date());
			});
		};
	});
	
	//---------------------------------------------------------物业费账单详情控制器---------------------------------------------------
	app.controller('companyPropertyBillDetailsCtrl', function($scope, $rootScope, $http, $uibModalInstance, $filter, fac, $uibModal, propertyBill){
		angular.extend($rootScope,fac.dicts);
		$scope.search = propertyBill;
		$scope.pageModel = {};
		$scope.stageMap = {};
		$scope.floorMap = {};
		$scope.houseMap = {};
		
		$scope.find = function(pageNo){
			$.extend($scope.search,{currentPage:pageNo||$scope.pageModel.currentPage||1,pageSize:$scope.pageModel.pageSize||10});
			$scope.search.pageIndex = $scope.search.currentPage-1;
			$scope.search.totalCount = $scope.pageModel.totalCount||0;
			
			$("#toolbarTr").prevAll().remove();
			$("#tableloading").removeClass("hide");
			console.log($scope.search);
			delete $scope.search.customerId;
			fac.getPageResult("/ovu-park/backstage/propertyBill/listDetails", $scope.search,function(data){	
				$("#tableloading").addClass("hide");
				console.log(data);
				$scope.pageModel = data;
			});
			fac.getPageResult("/ovu-park/backstage/equipment/waterMeter/spaceList",$scope.search,function(data){
				$scope.stageMap = data.stageMap;
				$scope.floorMap = data.floorMap;
				$scope.houseMap = data.houseMap;
            });
		};
		
		$scope.find(1);
		
		$scope.cancel = function () {
			$uibModalInstance.dismiss('cancel');
		};
	});
	
	
	//---------------------------------------------------------能源费用账单控制器---------------------------------------------------
	app.controller('energyBillCtl', function ($scope, $rootScope, $http, $filter, $uibModal, fac) {			
		angular.extend($rootScope,fac.dicts);
		$scope.search = {};
		$scope.pageModel = {};
		
		$scope.find = function(pageNo){
			if(!app.park || !app.park.ID){
				window.msg("请先选择一个项目!");
				return false;
			}
			$scope.search.parkId = app.park.ID;
			$.extend($scope.search,{currentPage:pageNo||$scope.pageModel.currentPage||1,pageSize:$scope.pageModel.pageSize||10});
			$scope.search.pageIndex = $scope.search.currentPage-1;
			$scope.search.totalCount = $scope.pageModel.totalCount||0;
			
			if($("#energyBill_date1").val()){
				$scope.search.startTime = $("#energyBill_date1").val() + " 00:00:00";
			}else{
				delete $scope.search.startTime;
			}
			if($("#energyBill_date2").val()){
				$scope.search.endTime = $("#energyBill_date2").val() + " 23:59:59";
			}else{
				delete $scope.search.endTime;
			}
			fac.getPageResult("/ovu-park/backstage/energyBill/list", $scope.search, function(data){	
				console.log(data);
				$scope.pageModel = data;
			});
		};
		
		$scope.uploadBillInfo = function() {
			if (!app.park.ID) {
				alert("请选择项目！");
				return;
			}
			
			fac.upload({url:'/ovu-park/backstage/energyBill/uploadExcel', params:{parkId : app.park.ID},
				accept:"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"},function(resp){
				if(resp.success){
					window.msg("导入成功!");
					$scope.find(1);
				}else{
					window.alert(resp.error);
				}
			});
		};
		
		app.modulePromiss.then(function() {
            fac.initPage($scope,function(){
            	$scope.find();
            })
        });
		
		//展示能源费历史记录详情
		$scope.showDetailsModal = function(energyBill){
			var copy = angular.extend({}, energyBill);
			
			var modal = $uibModal.open({
				animation: false,
				size: 'lg',
				templateUrl: '/view/billManage/billManage/modal.companyEnergyBillDetails.html',
				controller: 'companyEnergyBillDetailsCtrl', 
				resolve: {energyBill: copy}
			});
			modal.result.then(function () {
				console.info('Modal closed at: ' + new Date());
			}, function () {
				console.info('Modal dismissed at: ' + new Date());
			});
		};
	});
	
	//---------------------------------------------------------能源费用账单详情控制器---------------------------------------------------
	app.controller('companyEnergyBillDetailsCtrl', function($scope, $rootScope, $http, $uibModalInstance, $filter, fac, $uibModal, energyBill){
		angular.extend($rootScope,fac.dicts);
		$scope.search = waterMeterReport;
		$scope.pageModel = {};
		
		$scope.find = function(pageNo){
			$.extend($scope.search,{currentPage:pageNo||$scope.pageModel.currentPage||1,pageSize:$scope.pageModel.pageSize||10});
			$scope.search.pageIndex = $scope.search.currentPage-1;
			$scope.search.totalCount = $scope.pageModel.totalCount||0;
			
			$("#toolbarTr").prevAll().remove();
			$("#tableloading").removeClass("hide");
			console.log($scope.search);
			fac.getPageResult("/ovu-park/backstage/energyBill/list", $scope.search,function(data){	
				$("#tableloading").addClass("hide");
				console.log(data);
				$scope.pageModel = data;
			});
		};
		
		app.modulePromiss.then(function() {
            fac.initPage($scope,function(){
            	$scope.find();
            })
        });
		
		$scope.cancel = function () {
			$uibModalInstance.dismiss('cancel');
		};
	});
})()