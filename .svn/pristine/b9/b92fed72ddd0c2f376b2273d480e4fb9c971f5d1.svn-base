(function() {
	document.title ="OVU-空间拆分";
	var app = angular.module("angularApp");
	app.controller('parkMergeCtl', function ($stateParams, $scope, $rootScope, $http, $filter, $uibModal, fac, $state, $timeout, $location) {
        var curPage;
        setTimeout(function () {
            curPage = $rootScope.getCurTabPage($rootScope.pages.active, $rootScope.pages);
        })
	    var obj = {
	        houseId: $rootScope.pages.params.houseId,
	        //isSperated: 0,
	        rmCats: $rootScope.pages.params.rmCat,
	    };
	    $scope.emtHouseList = [{text:"是",value:1},{text:"否",value:2}]
	    
		
		fac.loadSelect($scope, "HOUSE_TYPE");
		fac.loadSelect($scope, "HOUSE_IS_DECORATION");
		$http.post('/ovu-base/system/parkHouse/getForSeperate', obj, fac.postConfig).success(function (resp) {
		    if (resp.code == 0){
		        //原始信息
		        $scope.originalData = resp.data.house;
		        $scope.originalData.rmCat = getType($scope.originalData.rmCat);
		        $scope.originalData.isEmtHouse = getEmtHouse($scope.originalData.isEmtHouse);
                $scope.resolutionData = resp.data.splitHouseList;
                $scope.canAdd = resp.data.canAdd;

		        //拆分面积
		       /* for (var i in $scope.resolutionData) {
		            $scope.resolutionData[i].area = $scope.originalData.area / 2;
		        }*/
                //拆分房号
		       /* code();*/
		    }else{
				alert(resp.msg)
				$rootScope.target('/projectSpace/spaceMaintain/spaceIndex', "空间维护", false, '', {
					// houseId: obj.id,
					// rmCat: obj.rmCat
				});
			}
		});
        //拆分信息
		$scope.resolutionData = [
		   {
		       'houseName': '',
		       'houseCode': '',
		       'houseNo': '',
			   'isDecoration': '',
		       'rmStd': '',
		       'isEmtHouse': '',
		       'area': '',
		       'areaSu': '',
		       'areaProperty': '',
		       'beforeHouseNo': '',
			   'afterHouseNo': '',
			   'rentsaleCharacter': '',
			   'isSperated': ''
		   },
			{
			    'houseName': '',
			    'houseCode': '',
			    'houseNo': '',
				'isDecoration': '',
			    'rmStd': '',
			    'isEmtHouse': '',
			    'area': '',
			    'areaSu': '',
			    'areaProperty': '',
			    'beforeHouseNo': '',
				'afterHouseNo': '',
				'rentsaleCharacter': '',
				'isSperated': ''
			}
		];
        
		$scope.resolutionItem = {
		    'houseName': '',
		    'houseCode': '',
		    'houseNo': '',
		    'isDecoration': '',
		    'rmStd': '',
		    'isEmtHouse': '',
		    'area': '',
			'areaSu': '',
		    'areaProperty': '',
		    'beforeHouseNo': '',
			'afterHouseNo': '',
			'rentsaleCharacter': '',
			'isSperated': ''
		};
		$scope.resolution = function () {
		    code();
		};
		$scope.del = function (event, index) {
		    $scope.resolutionData.splice(index, 1);
		    //code();
		}
        //保存
		$scope.saveInfo = function (chai) {
		    var length = $scope.resolutionData.length;
		    //var totalArea = 0;
		    
		    for (var i = 0; i < length; i++) {
		        if (i == 0) {
		            $scope.resolutionData[i].beforeHouseNo = $scope.originalData.beforeHouseNo;
					$scope.resolutionData[i].afterHouseNo = $scope.resolutionData[i + 1].houseNo;
					$scope.resolutionData[i].rentsaleCharacter = 1;
					$scope.resolutionData[i].isSperated = 0;
		        } else if (i == length - 1) {
		            $scope.resolutionData[i].beforeHouseNo = $scope.resolutionData[i - 1].houseNo;
					$scope.resolutionData[i].afterHouseNo = $scope.originalData.afterHouseNo;
					$scope.resolutionData[i].rentsaleCharacter = 1;
					$scope.resolutionData[i].isSperated = 0;
		        } else {
		            $scope.resolutionData[i].beforeHouseNo = $scope.resolutionData[i - 1].houseNo;
					$scope.resolutionData[i].afterHouseNo = $scope.resolutionData[i + 1].houseNo;
					$scope.resolutionData[i].rentsaleCharacter = 1;
					$scope.resolutionData[i].isSperated = 0;
		        }

		        if ($scope.canAdd == 1){
                    $scope.resolutionData[i].recordNumber = $scope.originalData.recordNumber;
                }
		        //totalArea += $scope.resolutionData[i].area;
		        
		    }
		    chai.$setSubmitted(true);
		    if (!chai.$valid) {
		        return;
		    }
            
		    /*if (totalArea != $scope.originalData.area) {
		        
		        alert('拆分后的建筑面积之和不等原空间的建筑面积，请修改！');
		        return;
		    }*/
		    $scope.saveData = {
		        'action': 'separate',
		        'body': JSON.stringify($scope.resolutionData),
		        'houseIds': $scope.originalData.id,
		        'isSperated': 0,
		        'rmCats': $location.search().rmCats
		    };

		    $http.post('/ovu-base/system/parkHouse/checkApply', $scope.saveData, fac.postConfig).success(function (resp) {
		        if (resp.code==0) {
		            msg("保存成功，待复核！");
                    $scope.$emit("needToClose", curPage);
		        } else {
		            alert(resp.msg);
		        }
		    });
		};
		$scope.cancle = function(){
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
		function getEmtHouse(value) {
		    var text = '';
		    if (value == 1) {
		        text = "是";
		    } else {
		        text = "否";
		    }
		    return text;
		}
		function code() {
            $scope.param = {
                'houseCode' : $scope.resolutionData[$scope.resolutionData.length-1].houseCode,
                'houseNo' : $scope.originalData.houseNo
            }
                $http.post('/ovu-base/system/parkHouse/genHouseCode', $scope.param, fac.postConfig).success(function (resp) {
                if (resp.code==0) {
                    $scope.resolutionItem.houseCode = resp.data.houseCode;
                    $scope.resolutionItem.houseNo = resp.data.houseNo;
                    $scope.resolutionData.push(angular.copy($scope.resolutionItem));
                } else {
                    alert(resp.msg);
                }
            });
		}
	});
})()
