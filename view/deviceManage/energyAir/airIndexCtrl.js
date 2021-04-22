(function() {
	var app = angular.module("angularApp");
	app.controller('airConditionerCtl', function ($scope, $rootScope, $http, $filter, $uibModal, fac) {	
		document.title ="OVU-能源空调管理";
		angular.extend($rootScope,fac.dicts);
		$scope.search = {};
		$scope.pageModel = {};
		
        /*
         * 空间相关,暂时注释,改用模糊搜索
        //分期列表
        $scope.loadStage = function(){
            fac.getPageResult("/ovu-base/system/parkStage/findStagesByParkId", {parkId : app.park.ID}, function(data){
                $scope.StageList = data;
                
                $scope.find(1);
            });
        }
        //楼栋列表
        $scope.loadBuild = function(){
            fac.getPageResult("/ovu-base/system/parkFloor/findFloorsByStageId", {stageId : $scope.search.stageId}, function(data){
                $scope.BuildList = data;
                
                $scope.find(1);
            });
        }
        
        $scope.changeStage= function(){
            if(!$scope.search.stageId || $scope.search.stageId == ""){
                $scope.BuildList = [];
            }else{
                $scope.loadBuild();
            }
            //console.log($scope.search.stageId + " "+ $scope.search.floorId);
        }
        
        $scope.changeBuild= function(){
            if(!$scope.search.floorId || $scope.search.floorId == ""){
                $scope.GroundList = [];
            }else{
                $scope.loadGround();
            }
            //console.log($scope.search.stageId + " "+ $scope.search.floorId);
        }
        
        $scope.changeNum= function(){
        	$scope.find(1);
        }
       
        //楼层列表
        $scope.loadGround = function(){
            $scope.GroundList = [];
            $scope.groundList =[];
            fac.getPageResult("/ovu-base/system/parkFloor/findGroundNoList", {stageId : $scope.search.stageId, floorId : $scope.search.floorId}, function(data){
//                $scope.ground = data;
//
//                if($scope.ground){
//                    for(var i=1;i<=$scope.ground.length;i++){
//                        $scope.GroundList.push(i);
//                    }
//                }
            	
            	if (!data) {
					$scope.GroundList = [];
				}else {
					$scope.GroundList = data;
				}
            });
        }
		*/
        $scope.find = function(pageNo){
            if(!app.park || !app.park.ID){
				window.msg("请先选择一个项目!");
				return false;
			}

			$scope.search.parkId = app.park.ID;
			/*$scope.stageMap = {};
			$scope.floorMap = {};
			$scope.houseMap = {};*/
            $.extend($scope.search,{currentPage:pageNo||$scope.pageModel.currentPage||1,pageSize:$scope.pageModel.pageSize||10});
            $scope.search.pageIndex = $scope.search.currentPage-1;
            $scope.search.totalCount = $scope.pageModel.totalCount||0;
            console.log($scope.search);
            fac.getPageResult("/ovu-park/backstage/equipment/airconditioner/list", $scope.search, function(data){   
                console.log(data);
                $scope.pageModel = data;
            });
            /*fac.getPageResult("/ovu-park/backstage/equipment/airconditioner/spaceList",$scope.search,function(data){
				$scope.stageMap = data.stageMap;
				$scope.floorMap = data.floorMap;
				$scope.houseMap = data.houseMap;
            });*/
        };
         
        /*$scope.loadStage();*/
        
        app.modulePromiss.then(function() {
            fac.initPage($scope,function(){
            	$scope.find();
            })
        });
        
        $scope.uploadAirConditionerInfo = function() {
			if (!app.park.ID) {
				alert("请选择项目！");
				return;
			}
			
			fac.upload({url:'/ovu-park/backstage/equipment/airconditioner/uploadExcel', params:{parkId : app.park.ID},
				accept:"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"},function(resp){
				if(resp.success){
					window.msg("导入成功!");
					$scope.find(1);
				}else{
					window.alert(resp.error);
				}
			});
		};
		
    });
    
})()