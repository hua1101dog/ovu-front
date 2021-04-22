(function() {
	document.title ="OVU-空间历史";
	var app = angular.module("angularApp");
	app.controller('historyCtl', function ($stateParams,$scope, $http,fac,$uibModal) {
		fac.loadSelect($scope,"HOUSE_TYPE");
		fac.loadSelect($scope,"HOUSE_IS_DECORATION");
		//var paramMap = angular.fromJson($stateParams.params);
		/*$http.post('/ovu-base/system/positionHistory/findPositionHistory.do',{"positionId":$stateParams.params},fac.postConfig).success(function(resp){
			console.info("=================");
			console.info(resp);
			$scope.newestItem = resp.position;
			$scope.search = {'positionId':$scope.newestItem.id};
			
		});*/
		$scope.pageModel = {};
		$scope.search={};
		$scope.find = function(pageNo){
			$.extend($scope.search,{currentPage:pageNo||$scope.pageModel.currentPage||1,pageSize:$scope.pageModel.pageSize||10});
			$scope.search.pageIndex = $scope.search.currentPage-1;
			$scope.search.totalCount = $scope.pageModel.totalCount||0;
			$scope.search.positionId = $stateParams.params;
			$http.post('/ovu-base/system/positionHistory/findPositionHistory.do',$scope.search,fac.postConfig).success(function(resp){
				if(resp.code){
					$scope.newestItem = resp.data.position;
					$scope.pageModel = resp.data.page;
				}
			});
		};
		
        $scope.find(1);
        	
		$http.post("/ovu-base/system/dictionary/get",{"item":'POSITION_ACTION'},fac.postConfig).success(function(data){
			$scope.positionAction = angular.fromJson(data.dic_VAL);
		});
		
		$scope.getType = function(obj,value){
			var text = '';
			angular.forEach(obj,function(data,index,array) {
				if(value == data.value) {
					text = data.text;
				}
			});
			return text;
		}
		
		/**
			跳转到工位历史详情页面
		*/
		/* $scope.goPositionDetail = function(url,historyId){
			$(".right_col").load(url,{'historyId':historyId});
		} */
		$scope.showDetail = function(item){
			var modal = $uibModal.open({
				animation: true,
				size:'',
				templateUrl: '/view/projectSpace/spaceMaintain/modal.detail.html',
				controller: 'detailCtrl'
				,resolve: {
					data:function(){
						return item
					}
				}
			}); 
			modal.result.then(function () {
				
			}, function () {
				console.info('Modal dismissed at: ' + new Date());
			});
		}
	});	
	app.controller('detailCtrl', function($scope,$http,$uibModalInstance,fac,data) {
		$scope.item = data;
		$http.post('/ovu-base/system/positionHistory/detailHistory',{"historyId":data.id},fac.postConfig).success(function(resp){
			if(resp.code) {
				$scope.data = resp.data;
				$scope.belongSpace = "";
                if($scope.data.FLOOR_NAME.indexOf("栋") == -1){
                	$scope.belongSpace = $scope.data.FLOOR_NAME+"栋" + $scope.data.HOUSE_CODE
                }else {
                	$scope.belongSpace = $scope.data.FLOOR_NAME+ $scope.data.HOUSE_CODE
                }
			}else{
				alert(resp.message);
			}	
	
		});
		$scope.cancel = function(){
			$uibModalInstance.dismiss('cancel');
		};
	});
})()
