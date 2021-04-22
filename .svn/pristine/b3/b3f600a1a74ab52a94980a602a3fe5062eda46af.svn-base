(function() {
        var app = angular.module("angularApp");
        //项目架构ctl
        app.controller('spaceReportIndexContr', function ($scope, $scope, $http, $filter, $uibModal, fac) {
        	document.title ="OVU-空间信息报表";
            angular.extend($scope,fac.dicts);
            $scope.houseIdTypes = {};
            $scope.pageModel = {};
            //查询
            $scope.find = function(pageNo){
                $.extend($scope.search,{currentPage:pageNo||$scope.pageModel.currentPage||1,pageSize:$scope.pageModel.pageSize||10});
                $scope.search.rentsaleCharacter = 1;
                $scope.search.pageIndex = $scope.search.currentPage-1;
                $scope.search.totalCount = $scope.pageModel.totalCount||0;
                //$scope.search.isSperated = 0;
                // $scope.search.config = 1;
                fac.getPageResult("/ovu-park/backstage/spaceReport/house/getSpaceInfoList", $scope.search, function(data){
                    $scope.pageModel = data;
                });
            };

            $scope.countParkDetail = function(){
                var param = {"parkId":app.park.parkId}
                console.log(param)
                $http.post("/ovu-park/backstage/spaceReport/house/countParkDetail",param,fac.postConfig).success(function(resp){
                    if(resp.code == 0){
                        $scope.parkDetail = resp.data;
                    }
                });
            };

            /**
                导出到excel表
            */
            $scope.exportToTable = function (){
                var stageId = $scope.search.stageId;
                var buildId = $scope.search.buildId;
                var unitNum = $scope.search.unitNum;
                var groundNo = $scope.search.groundNo;
                var id = $scope.search.id;
                var spaceStatus = $scope.search.spaceStatus;
                var requestData = "parkId="+app.park.parkId;
                if(stageId){
                    requestData += "&stageId="+stageId;
                }
                if(buildId){
                    requestData += "&buildId="+buildId;
                }
                if(unitNum){
                    requestData += "&unitNum="+unitNum;
                }
                if(groundNo){
                    requestData += "&groundNo="+groundNo;
                }
                if(id){
                    requestData += "&id="+id;
                }
                if(spaceStatus){
                    requestData += "&spaceStatus="+spaceStatus;
                }
                requestData += "&rentsaleCharacter=1";
                var URL = encodeURI("/ovu-park/backstage/spaceReport/house/exportSpaceInfo?"+requestData);
                window.location.href = URL;
            }

            //根据parkId获取分期列表
            $scope.loadStage = function() {
            	var param = {"parkId":app.park.parkId}
            	$http.post("/ovu-base/system/park/stageList",param,fac.postConfig).success(function(resp){
            		if(resp.code == 0){
            			 $scope.stageList = resp.data;
            			 $scope.buildList = [];
                     	 $scope.unitList = [];
                     	 $scope.floorList = [];
                     	 $scope.houseList = [];
            		}
                });
            }
          //根据stageId获得楼栋信息
            $scope.selectStage = function (){
                var params = {
                    'stageId' : $scope.search.stageId
                }
                $http.post("/ovu-base/system/parkBuild/getBuilds", params, fac.postConfig).success(function(data){
            		$scope.buildList = data;
            		$scope.unitList = [];
                	$scope.floorList = [];
                	$scope.houseList = [];
                	$scope.search.buildId = '';
                	$scope.search.unitNum = '';
                	$scope.search.groundNo = '';
                	$scope.search.id = '';
                });
            }
          //根据buildId获得单元信息
            $scope.selectBuild = function () {
            	var params = {'buildId':$scope.search.buildId};
                $http.post("/ovu-base/system/parkHouse/listUnitNo_mute", params, fac.postConfig).success(function(resp){
                		$scope.unitList = resp.data;
                    	$scope.floorList = [];
                    	$scope.houseList = [];
                    	$scope.search.unitNum = '';
                    	$scope.search.groundNo = '';
                    	$scope.search.id = '';
                });     
            }
            
            //根据buildId,unitId获取楼层信息
            $scope.selectUnit = function () {
                var params = { "buildId":$scope.search.buildId,"unitNo":$scope.search.unitNum}
                $http.post("/ovu-base/system/parkHouse/listGroundNo_mute", params, fac.postConfig).success(function(resp){
                	if(resp.code == 0){
                		$scope.floorList = resp.data;
                		$scope.houseList = [];
                		$scope.search.groundNo = '';
                    	$scope.search.id = '';
                	}         
                });     
            }
          //根据buildId,unitId,groundNo获取楼层信息
            $scope.item = {};
            $scope.item.id = '';
            $scope.selectGround = function () {
            	var params = { "buildId":$scope.search.buildId,"unitNo":$scope.search.unitNum,'groundNo':$scope.search.groundNo,
     				   "rmCats":"FW11,FW12,FW16","isSperated":0}
		         $http.post("/ovu-base/system/parkHouse/queryHouseListSelective", params, fac.postConfig).success(function(resp){
		         	if(resp.code == 0){
		         		$scope.houseList = resp.data;
		             	$scope.item.id = '';
		         	}         
		         });     
		     }

            $scope.showRentsaleInfo = function(item){
                var copy = angular.extend({},item);
                var modal = $uibModal.open({
                    animation: false,
                    size:'lg',
                    templateUrl: '/view/reportManage/spaceInfoReport/modal.showDetail.html',
                    controller: 'rentsaleInfoContr',
                    resolve: {houseObj: copy}
                });
                modal.result.then(function () {
                    $scope.find();
                }, function () {
                    console.info('Modal dismissed at: ' + new Date());
                });
            };

            $scope.showEnterInfo = function(item){
                var copy = angular.extend({},item);
                var modal = $uibModal.open({
                    animation: false,
                    size:'lg',
                    templateUrl: '/view/reportManage/spaceInfoReport/modal.houseEnterInfo.html',
                    controller: 'enterInfoContr',
                    resolve: {houseObj: copy}
                });
                modal.result.then(function () {
                    $scope.find();
                }, function () {
                    console.info('Modal dismissed at: ' + new Date());
                });
            };


            //展示详情信息
            $scope.showDetailInfo = function(item){
                var copy = angular.extend({},item);
                var modal = $uibModal.open({
                    animation: false,
                    size:'lg',
                    templateUrl: '/view/reportManage/spaceInfoReport/modal.joinParticulars.html',
                    controller: 'detailInfoContr',
                    resolve: {houseObj: copy}
                });
                modal.result.then(function () {
                    $scope.find();
                }, function () {
                    console.info('Modal dismissed at: ' + new Date());
                });
            };
            app.modulePromiss.then(function() {
                fac.initPage($scope,function(){
                	$scope.find();
                	$scope.loadStage();
                    $scope.countParkDetail();
                })
            });
            $scope.query = function(){
            	fac.initPage($scope, function () {
                    $scope.find(1);
                })
            }
        });

    app.controller('rentsaleInfoContr', function($rootScope, $scope, $http, $uibModalInstance, $uibModal, $filter, fac, houseObj) {
        $scope.house = houseObj;
        $scope.result = {};
        //查询
        $scope.findDetail = function(){
            $scope.houseId = $scope.house.id;
            $http.post("/ovu-park/backstage/spaceReport/house/getHouseRentInfo", {houseId:$scope.houseId},fac.postConfig).success(function(data, status, headers, config) {
                if (data.code == 0){
                    $scope.result = data;
                }
                }).error(function(data, status, headers, config) {
                console.log("获取列表异常");
            });
        }
        $scope.findDetail();
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };

        $scope.showHouseInfo = function(item){
            var copy = angular.extend({},item);
            var modal = $uibModal.open({
                animation: false,
                size:'lg',
                templateUrl: '/view/reportManage/spaceInfoReport/modal.spaceHouseInfo.html',
                controller: 'spaceHouseInfoContr',
                resolve: {houseObj: copy}
            });
            modal.result.then(function () {
                console.info('Modal dismissed at: ' + new Date());
            });
        };

    });

    app.filter("operateStatus", function () {
        return function (status) {
            switch (status) {
                case 1:
                    return '在业';
                    break;
                case 2:
                    return '存续';
                    break;
                case 3:
                    return '吊销';
                    break;
                case 4:
                    return '注销';
                    break;
                case 5:
                    return '迁出';
                    break;
                case '无':
                    return '无';
                    break;
            }
        }
    })

    app.controller('enterInfoContr', function($rootScope, $scope, $http, $uibModalInstance, $uibModal, $filter, fac, houseObj) {
        $scope.house = houseObj;
        //1:在业 2:存续 3:吊销 4:注销 5:迁出
        // 状态

        //查询
        $scope.getEnterList = function(){
            $scope.houseId = $scope.house.id;
            $http.post("/ovu-park/backstage/spaceReport/house/getEnterList", {houseId:$scope.houseId},fac.postConfig).success(function(data, status, headers, config) {
                if (data.code == 0){
                    $scope.result = data;
                }
            }).error(function(data, status, headers, config) {
                console.log("获取列表异常");
            });
        }
        $scope.getEnterList();
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    });

    app.controller('spaceHouseInfoContr', function($rootScope, $scope, $http, $uibModalInstance, $uibModal, $filter, fac, houseObj) {
        $scope.items = houseObj.houseInfos;
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };

    });


        app.controller('detailInfoContr', function($rootScope, $scope, $http, $uibModalInstance, $uibModal, $filter, fac, houseObj) {
            $scope.item = houseObj;
            $scope.search = {};
            $scope.pageModel = {};
          //获取所属行业列表
            fac.loadSelect($scope, "INDUSTRY");
            //查询
            $scope.findDetail = function(pageNo){
                $.extend($scope.search,{currentPage:pageNo||$scope.pageModel.currentPage||1,pageSize:$scope.pageModel.pageSize||10});
                $scope.search.pageIndex = $scope.search.currentPage-1;
                $scope.search.totalCount = $scope.pageModel.totalCount||0;
                $scope.search.houseId = $scope.item.id;
                fac.getPageResult("/ovu-base/system/reportForms/registrationParticulars", $scope.search, function(data){
                    $scope.pageModel = data;
                    angular.forEach($scope.pageModel.data,function(obj){
	               		 angular.forEach($scope.industryList,function(industryObj){
	               			 if(obj.industryCode == industryObj.dicSort){
	               				 obj.industryName = industryObj.dicItem;
	               			 }
	               		 });
	               	 });
                });
            }
            $scope.findDetail();
            $scope.cancel = function () {
                $uibModalInstance.dismiss('cancel');
            };

        });
})()
