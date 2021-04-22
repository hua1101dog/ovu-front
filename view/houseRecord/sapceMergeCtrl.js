
(function() {
	document.title ="OVU-空间合并";
	var app = angular.module("angularApp");
	app.controller('spaceMerge_houseCtrl', function ($stateParams,$rootScope, $scope, $http, fac, $state, $timeout, $location) {
		var curPage;
        setTimeout(function () {
            curPage = $rootScope.getCurTabPage($rootScope.pages.active, $rootScope.pages);
        },100)
        localStorage.getItem("houseRecord_id")

        var obj = {
	        houseIds:  localStorage.getItem("houseRecord_id"),
	        
		};
		$scope.saveItemData={}
		var houseIdList=  localStorage.getItem("houseRecord_id").split(',')
		var houseIds=[]
		houseIdList.forEach(v=>{
			houseIds.push({
				id:v
			})
		})
		$scope.recordNumber =[];
			//获取最大房号
			function code() {
           
				$http.get('/ovu-base/house/space/max?id='+houseIds[0].id).success(function (resp) {
				if (resp.code==0) {
				   $scope.maxHouseCode=resp.data
				   
				   if($scope.maxHouseCode>=999){
						 alert('房屋已达上限，不可合并')
						
						$scope.$emit('needToClose', $rootScope.getCurTabPage($rootScope.pages.active, $rootScope.pages));
					$rootScope.$emit("findPage");
						
				   }else{
					
				   }
				  
				
				} else {
					alert(resp.msg);
				}
			});
		}
		function accAdd(arg1,arg2){  
			var r1,r2,m;  
			try{r1=arg1.toString().split(".")[1].length}catch(e){r1=0}  
			try{r2=arg2.toString().split(".")[1].length}catch(e){r2=0}  
			m=Math.pow(10,Math.max(r1,r2))  
			return (arg1*m+arg2*m)/m  
			} 
		//前面补0
		$scope.PrefixInteger=function(num, length) {
			  if(num>999){
				 alert('最大房屋编码为999,不可再进行合并')
				 return
			  }
			return (Array(length).join('0') + num).slice(-length);
		  }
		  code();
		  fac.loadSelect($scope,null,function(){
		
			getData()
		});
		  function getData(){
			
			$http.post('/ovu-base/house/space/list?houseIds='+ localStorage.getItem("houseRecord_id")).success(function (resp) {
				if (resp.code == 0) {
					$scope.mergeData = resp.data;
					$scope.houseCode = resp.data[0].houseCode;
					$scope.houseNo = resp.data[0].houseNo;
					$scope.houseNoCopy=$scope.houseNo.substring(0,$scope.houseNo.length-3)
					$scope.saveItemData.area=0
					$scope.saveItemData.areaProperty=0
					$scope.houseType = $rootScope.dicData['HOUSE_TYPE'];
					$scope.isDecoration = $rootScope.dicData['HOUSE_IS_DECORATION'];
					$scope.houseStatus= $rootScope.dicData['HOUSE_STATUS']
					for(var j = 0; j < $scope.mergeData.length; j++){
						
						
						$scope.saveItemData.area =  accAdd($scope.saveItemData.area,$scope.mergeData[j].area)-0;
						$scope.saveItemData.areaProperty = accAdd($scope.saveItemData.areaProperty,$scope.mergeData[j].areaProperty)-0;;
					     if($scope.mergeData[j].rmCat){
							$scope.mergeData[j].treeTypeList = $rootScope.dicData[$scope.mergeData[j].rmCat];
						 }
					}
					
					
			
				
				
				
					
				}else{
					alert(resp.msg)
				}
			});
		  }
	  
		$scope.selectHouseType = function (item) {
          
            $scope.treeTypeList = $rootScope.dicData[item.rmCat];

        }
		$scope.saveInfo = function(form) {
			if(!form.$valid){
				return;
			}
			
			$scope.saveItemData.houseNo=$scope.houseNoCopy+$scope.PrefixInteger($scope.maxHouseCode-0+1,3)
		
            $scope.saveData = {
			    
			    'parkHouse': $scope.saveItemData,
			    'houseIds':  localStorage.getItem("houseRecord_id")
			
			};
			
			$http.post('/ovu-base/house/space/merge', $scope.saveData).success(function (resp) {
			    if (resp.code==0) {
					msg("保存成功！");
					$scope.$emit('needToClose', curPage);
					$rootScope.$emit("findPage");
				}else{
					alert(resp.msg);
				}
			});  
		}
		
		
		
		
	});
})()
