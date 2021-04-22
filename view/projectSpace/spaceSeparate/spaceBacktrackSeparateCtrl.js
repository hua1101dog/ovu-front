(function() {
	document.title ="OVU-空间逆向拆分";
	var app = angular.module("angularApp");
	app.controller('parkBacktrackSeparateCtl', function ($stateParams, $scope, $rootScope, $http, $filter, $uibModal, fac, $state, $timeout, $location) {
	   
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
		        houseIds: $location.search().houseId,
		        isSperated: 0
		};
		$http.post('/ovu-base/system/parkHouse/getHouseListByIds', obj, fac.postConfig).success(function (resp) {
		    if (resp.code == 0) {
		        //原始信息
		        $scope.originalData = resp.data[0];
		        $scope.originalData.rmCat = getType($scope.originalData.rmCat);
		        $scope.originalData.isEmtHouse = getEmtHouse($scope.originalData.isEmtHouse); 
		    }
		});
		
        //拆分信息
		$scope.resolutionData = [
		   {
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
		   },
			{
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
			}
		];
        
		$scope.resolutionItem = {
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
		
		$scope.resolution = function () {
		    $scope.resolutionData.push(angular.copy($scope.resolutionItem));
		};
		
		$scope.del = function (event, index) {
		    $scope.resolutionData.splice(index, 1);
		}
		
        //保存
		$scope.saveInfo = function (chai) {
		    chai.$setSubmitted(true);
		    if (!chai.$valid) {
		        return;
		    }
		    
		    $scope.saveData = {
		        'action': 'reverseSeparate',
		        'body': JSON.stringify($scope.resolutionData),
		        'houseIds': $scope.originalData.id
		    };

		    $http.post('/ovu-base/system/parkHouseBacktrack/checkApply', $scope.saveData, fac.postConfig).success(function (resp) {
		        if (resp.code==0) {
		            msg("保存成功，待复核！");
		            $timeout(function () {
		                $location.url('/projectSpace/spaceMaintain/spaceBacktrack')
		            }, 2000);
		        } else {
		            alert(resp.msg);
		        }
		    });
		};
		$scope.cancle = function(){
		    $location.url('/projectSpace/spaceMaintain/spaceBacktrack')
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
		function getEmtHouse(value) {
		    var text = '';
		    if (value == 1) {
		        text = "是";
		    } else {
		        text = "否";
		    }
		    return text;
		}
		
	});
})()
