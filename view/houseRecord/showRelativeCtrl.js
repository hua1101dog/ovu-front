(function() {
	document.title ="OVU-空间查看";
	var app = angular.module("angularApp");
	app.controller('showRelativeCtrl', function ($stateParams, $scope, $rootScope, $http, $filter, $uibModal, fac, $state, $timeout, $location) {
       
		var curPage;
        setTimeout(function () {
            curPage = $rootScope.getCurTabPage($rootScope.pages.active, $rootScope.pages);
        })
	  
		$scope.resolutionData=[] //子空间
	
		$scope.originalData =[] //父空间
		// $rootScope.pages.params.houseSource 2 拆分 3合并
		
		function getData(){
			$scope.houseType = $rootScope.dicData['HOUSE_TYPE'];
			$scope.isDecoration = $rootScope.dicData['HOUSE_IS_DECORATION'];
			$scope.houseStatus= $rootScope.dicData['HOUSE_STATUS']
			$http.get('/ovu-base/house/people/family?id='+ localStorage.getItem("houseRecord_id")).success(function (resp) {
				if (resp.code == 0){
					if(JSON.stringify(resp.data) === '{}'){
						alert('暂无数据')
						$scope.$emit('needToClose', curPage);
						$rootScope.$emit("findPage");
						return
					  }
					  $scope.resolutionData=resp.data.children
					  $scope.originalData=resp.data.parent
					
				$scope.resolutionData.length && $scope.resolutionData.forEach(v=>{
					if(v.rmCat){
						v.treeTypeList = $rootScope.dicData[v.rmCat];
						
					
					 } 
					 v.stageName=$scope.originalData[0].stageName
					v.buildName=$scope.originalData[0].buildName
				 })
				 console.log($scope.resolutionData)
				 $scope.originalData.length && $scope.originalData.forEach(v=>{
					if(v.rmCat){
						v.treeTypeList = $rootScope.dicData[v.rmCat];
					
					 } 
				 })
				 
					
					
					
				  
	
				}else{
					alert(resp.msg)
				
				}
			});
			
		}
		
		fac.loadSelect($scope,null,function(){
		
			getData()
	
		});
       
		
	
	
		
	});
})()
