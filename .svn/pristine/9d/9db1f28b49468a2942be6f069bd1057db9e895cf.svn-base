
(function() {
	document.title ="OVU-空间合并";
	var app = angular.module("angularApp");
	app.controller('spaceMerge', function ($stateParams,$rootScope, $scope, $http, fac, $state, $timeout, $location) {
        var curPage;
        setTimeout(function () {
            curPage = $rootScope.getCurTabPage($rootScope.pages.active, $rootScope.pages);
        })

        var obj = {
	        houseIds: $rootScope.pages.params.houseIds,
	        isSperated: $rootScope.pages.params.isSperated,
            rentsaleCharacter: $rootScope.pages.params.rentsaleCharacter
	    };
		console.log("obj",obj)
        $scope.recordNumber =[];
	    fac.loadSelect($scope, "HOUSE_TYPE");
	    fac.loadSelect($scope, "HOUSE_IS_DECORATION");
	    $http.post('/ovu-base/system/parkHouse/getForMerge', obj, fac.postConfig).success(function (resp) {
	        if (resp.code == 0) {
	            $scope.mergeData = resp.data.houseList;
                $scope.houseCode = resp.data.houseCode;
                $scope.houseNo = resp.data.houseNo;
    			$scope.saveItemData = {
    					'houseName':'',
    					'houseCode': '',
    					'houseNo': '',
    					'isDecoration':'',
    					'rmStd': '',
    					'area':0,
    					'areaSu': 0,
    					'areaProperty': 0,
    					'owner':'',
    					'beforeHouseNo':'',
						'afterHouseNo':'',
						'isSperated': 0,
						'rentsaleCharacter': 1
    			};
    			for(var j = 0; j < $scope.mergeData.length; j++){
                    if($scope.recordNumber.indexOf($scope.mergeData[j].recordNumber)==-1){
                        $scope.recordNumber.push($scope.mergeData[j].recordNumber);
                    }
    			    $scope.mergeData[j].rmCat = getType($scope.mergeData[j].rmCat);
    				$scope.saveItemData.area +=  $scope.mergeData[j].area;
    				$scope.saveItemData.areaSu += new Number($scope.mergeData[j].areaSu == undefined ? 0 : $scope.mergeData[j].areaSu);
    				$scope.saveItemData.areaProperty += new Number($scope.mergeData[j].areaProperty == undefined ? 0 : $scope.mergeData[j].areaProperty);
    			}
    			
    			$scope.saveItemData.houseCode = $scope.houseCode;
    			$scope.saveItemData.houseNo = $scope.houseNo;
    			$scope.saveItemData.owner = $scope.mergeData[0].owner;
    			$scope.saveItemData.beforeHouseNo = $scope.mergeData[0].beforeHouseNo;
    			$scope.saveItemData.afterHouseNo = $scope.mergeData[$scope.mergeData.length-1].afterHouseNo;
    			var ids ='';
    			for( var k = 0; k < $scope.mergeData.length; k++){
    				if(k < $scope.mergeData.length-1) {
    					ids = ids + $scope.mergeData[k].ID + ',';
    				}else if(k == $scope.mergeData.length-1){
    					ids = ids + $scope.mergeData[k].ID; 
    				}
    			}
    		}
    	});
		$scope.saveInfo = function(form) {
			if(!form.$valid){
				return;
			}
            $scope.saveItemData.recordNumber = $scope.recordNumber.join(",");
            $scope.saveData = {
			    'action': 'merge',
			    'body': JSON.stringify([$scope.saveItemData]),
			    'houseIds': obj.houseIds
				// 'isSperated': 0,
				
			    // 'rmCats': $location.search().params.rmCats
			};
			console.log("$scope.saveData",$scope.saveData)
			$http.post('/ovu-base/system/parkHouse/checkApply', $scope.saveData, fac.postConfig).success(function (resp) {
			    if (resp.code==0) {
					msg("保存成功，待复核！");
                    $scope.$emit("needToClose", curPage);
				}else{
					alert(resp.msg);
				}
			});  
		}
		
		$scope.cancle = function () {
            $scope.$emit("needToClose", curPage);
		}
		
		function getType(value) {
		    var text = '';
		    var obj = $scope.houseType;
			angular.forEach(obj, function (data, index, array) {
			    if (value == data.id) {
				    text = data.dicItem;
				}
			});
			return text;
		}
	});
})()
