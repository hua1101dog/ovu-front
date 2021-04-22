(function() {
    var app = angular.module("angularApp");
    app.controller('parkManagerCtl', function ($scope,$rootScope, $http,$filter,$uibModal,fac) {
    	document.title ="OVU-地下车库管理";
        angular.extend($rootScope,fac.dicts);
        $rootScope.search = {PARK_ID:'${app.park.ID}'};
        $rootScope.search = {};
        $scope.pageModel = {};
        // $http({method:"get",
        //     url:"/ovu-base/system/parkStage/listByPark",
        //     params:{'parkId':$rootScope.search.PARK_ID}
        // }).success(function(data){
        //     $scope.stages = data;
        // });

        //查询车库列表
        $scope.find = function(pageNo){
            if(!app.park || !app.park.ID){
				window.msg("请先选择一个项目!");
				return false;
			}

			$rootScope.search.PARK_ID = app.park.ID;
            $.extend($rootScope.search,{currentPage:pageNo||$scope.pageModel.currentPage||1,pageSize:$scope.pageModel.pageSize||10});
            $rootScope.search.pageIndex = $rootScope.search.currentPage-1;
            $rootScope.search.totalCount = $scope.pageModel.totalCount||0;
            fac.getPageResult("/ovu-base/system/workPosition/getParkList", $rootScope.search, function(data){
                $scope.pageModel = data;
                console.info(data);
            });
        }

        //租 type 1租 2售 spaceType 3房屋  2车位  1工位
        $scope.sell = $scope.rent = function(id,type,spaceType){
            var ids = {
                parkId:$rootScope.search.PARK_ID,
                id:id,
                type:type,
                spaceType:spaceType
            };
            var modal = $uibModal.open({
                animation: true,
                size:'',
                templateUrl: '/view/projectSpace/garageManage/modal.rent.html',
                controller: 'rentCtrl'
                ,resolve: {
                    ids:function() {
                        return ids;
                    }
                }
            });
            modal.result.then(function () {
                $scope.find();
            }, function () {
                console.info('Modal dismissed at: ' + new Date());
            });
        };


        //分期列表
        $scope.loadStage = function(){
            fac.getPageResult("/ovu-base/system/parkStage/findStagesByParkId", {parkId : app.park.ID}, function(data){
                $scope.StageList = data;
                
                //$scope.find(1);
            });
        }
        
        //楼栋列表
        $scope.loadBuild = function(){
            fac.getPageResult("/ovu-base/system/parkFloor/findFloorsByStageId", {stageId : $scope.search.stageId}, function(data){
                $scope.BuildList = data;

                //$scope.find(1);
            });
        }

         $scope.changeStage= function(){
            if(!$scope.search.stageId || $scope.search.stageId == ""){
                $scope.BuildList = [];
            }else{
                //  app.modulePromiss.then(function() {
                //     fac.initPage($scope,function(){
                //         $scope.find();
                //    })
                // });
                $scope.loadBuild();
            }
            //console.log($scope.search.stageId + " "+ $scope.search.floorId);
        }

        $scope.loadStage();
        //$scope.loadBuild();

        app.modulePromiss.then(function() {
            fac.initPage($scope,function(){
            	$scope.find();
            })
        });
    });


    app.controller('rentCtrl', function($scope,$http,$uibModalInstance,fac,ids) {
        $scope.userType = "";
        $scope.ids = ids;
        $scope.parkId = ids.parkId;
        $scope.name = "";
        $scope.belongUser = "";
        $scope.expand = function() {
            $scope.isList = true;
            if(!$scope.userType){
                alert("请选择客户类型！");
                $scope.listData = "";
                $scope.isList = false;
            }else {
                getUserInfo($scope.userType);
            }


        }



        $scope.choiceName = function(item) {
            $scope.name = item.nAME;
            $scope.isList = false;
            $scope.id =  item.cUSTOMER_USER_ID;

        };
        $scope.changeClassify = function () {
            if(!$scope.userType){
                alert("请选择客户类型！");
                $scope.listData = "";
                $scope.isList = false;
            }else {
                $scope.isList = false;
                getUserInfo($scope.userType);
            }
            $scope.name = "";
            $scope.id = "";
        };
        function getUserInfo(type) {
            if(type == "personal"){
                $http.post('/ovu-base/ovupark/backstage/personal/findAllPersonal',{"parkId":$scope.parkId},fac.postConfig).success(function(resp){
                    if(resp.code==1) {
                        $scope.listData = resp.data;
                        if($scope.listData.length == 0){
                            $scope.isList = false;
                        }
                    }else{
                        alert(resp.message);
                    }

                });
            }else if(type == "company"){
                $http.post('/ovu-base/ovupark/backstage/customer/findAllCustomer',{"parkId":$scope.parkId},fac.postConfig).success(function(resp){
                    if(resp.code==1) {
                    	console.info("====企业用户信息列表=====");
                    	console.info(angular.toJson(resp.data));
                    	$scope.listData = resp.data;
                        if($scope.listData.length == 0){
                            $scope.isList = false;
                        }
                    }else{
                        alert(resp.message);
                    }

                });
            }
        }
        $scope.rentSave = function() {
        	console.info("id:"+$scope.id)
            if(!$scope.id){
                if($scope.userType == 'company'){
                    alert("企业名不能为空！");
                }else{
                    alert("客户名不能为空！");
                }
                return;
            }
            if(ids.spaceType == 3){
                $scope.spaceType = "house";
                $scope.changeSpaceType =1 //1-房屋 2-车位 3-工位
            }else if(ids.spaceType == 2) {
                $scope.spaceType = "parking";
                $scope.changeSpaceType = 2//1-房屋 2-车位 3-工位
            }else if(ids.spaceType == 1) {
                $scope.spaceType = "workPosition";
                $scope.changeSpaceType = 3//1-房屋 2-车位 3-工位
            }
            var param = {
                "spaceId": ids.id,
                "enterCusId": $scope.id,
                "requestType": ids.type,
                "changeSpaceType":$scope.changeSpaceType,
                "spaceTypeFrom": $scope.spaceType,
                "belongUser": $scope.belongUser,
                "userType":$scope.userType
            }
            //console.info(param);
            $http.post('/ovu-base/system/propertyChange/save.do',param,fac.postConfig).success(function(resp){
                if(resp.code==1) {
                    msg();
                    $uibModalInstance.close();
                }else{
                    alert(resp.message);
                }

            });
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    });

})();