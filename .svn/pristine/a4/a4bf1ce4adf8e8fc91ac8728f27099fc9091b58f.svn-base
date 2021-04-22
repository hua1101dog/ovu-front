
(function() {
	document.title ="OVU-空间逆向合并";
	var app = angular.module("angularApp");
	app.controller('spaceBacktrackMerge', function ($stateParams, $scope, $rootScope, $http, fac, $state, $timeout, $location) {
	    
	    $scope.areaNatureList = [{text:"不可售",value:0},{text:"可售",value:1}];
	    $scope.investmentPropertyList = [{text:"否",value:0},{text:"是",value:1}];
	    
	    function initDic(){
            $http.post("/ovu-base/system/dictionary/get", {}, fac.postConfig).success(function (resp) {
                $rootScope.houseTypeTree = resp.data.HOUSE_TYPE;
                $rootScope.dicData = resp.data;
            });
        }
	    
	    app.modulePromiss.then(function () {
            initDic();
        });
	    
	    $scope.selectHouseType = function (item) {
            $scope.treeTypeList = $scope.dicData[item.rmCat];
        }
	    
		var obj = {
	        houseIds: $location.search().params.houseIds,
	        isSperated: $location.search().params.isSperated,
	        rmCats: $location.search().params.rmCats
	    };
	   
	    $http.post('/ovu-base/system/parkHouse/getHouseListByIds', obj, fac.postConfig).success(function (resp) {
	        if (resp.code == 0) {
	            $scope.mergeData = resp.data;
    			$scope.saveItemData = {
    				   'houseName': '',
				       'rmShortName': '',
				       'houseCode': '',
				       'unitNo': '',
				       'groundNo': '',
				       'recordNumber': '',
				       'area': '',
				       'areaActual': '',
				       'areaProperty': '',
				       'rmCat': '',
				       'rmType': '',
				       'areaNature': '',
				       'investmentProperty': ''
    			};
    		}
    	});
		$scope.saveInfo = function(form) {
			if(!form.$valid){
				return;
			}	
			$scope.saveData = {
			    'action': 'reverseMerge',
			    'body': JSON.stringify([$scope.saveItemData]),
			    'houseIds': obj.houseIds,
			    'isSperated': 0,
			    'rmCats': $location.search().params.rmCats
			};
			$http.post('/ovu-base/system/parkHouseBacktrack/checkApply', $scope.saveData, fac.postConfig).success(function (resp) {
			    if (resp.code==0) {
					msg("保存成功，待复核！");
					$timeout(function () {
					    $location.url('/projectSpace/spaceMaintain/spaceBacktrack')
					},2000)
					
				}else{
					alert(resp.message);
				}
			});  
		}
		
		$scope.cancle = function () {
		    $location.url('/projectSpace/spaceMaintain/spaceBacktrack')
		}
		
	});
})()
