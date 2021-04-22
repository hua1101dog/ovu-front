(function() {
    var app = angular.module("angularApp");
    
    app.controller('rentResourceCtrl', function ($scope, $rootScope, $http, $filter, $uibModal,$location, fac) {		
    	document.title = "OVU-租赁资源";
    	// $scope.$apply();
        $scope.search = {
            stageId:"",
            buildId:"",
            houseCode:"",
            rentalStatus:""
        }
        $scope.status = [
            {value:"1",text:"启用"},
            {value:"0",text:"停用"}
        ]
        // 排序状态值
        $scope.sortStatusCopy = {
            areaSort: -1
        }
        $scope.sortStatus = {
            areaSort: -1
        }
        // 获取分期
        //$scope.stages = [];
        $scope.getStage = function(){
            var param = {"parkId":app.park.parkId}
            $http.post("/ovu-park/backstage/rental/rentalResources/getRentalStageList", param, fac.postConfig).success(function (resp) {
                $scope.stages = resp.data;
            });
        }
        // $scope.getStage();
        // 获取楼栋
        //$scope.builds = [];
        $scope.getBulid = function(){
            var param = {
                "stageId": $scope.search.stageId,
            }
            $http.post("/ovu-park/backstage/rental/rentalResources/getRentalBuildList", param, fac.postConfig).success(function (resp) {
                $scope.builds = resp.data;
            });
        }
        // 获取列表
        $scope.pageModel ={};
        $scope.find = function(pageNo){
			$.extend($scope.search,{currentPage:pageNo||$scope.pageModel.currentPage||1,pageSize:$scope.pageModel.pageSize||10});
			$scope.search.pageIndex = $scope.search.currentPage-1;
			$scope.search.totalCount = $scope.pageModel.totalCount||0;
			fac.getPageResult("/ovu-park/backstage/rental/rentalResources/getRentalHouseList", $scope.search,function(data){	
                $scope.pageModel = data;
                console.log($scope.pageModel);
			});
        };
        
        $scope.resourcesSort = function (key, value) {
            $scope.sortStatus = angular.copy($scope.sortStatusCopy);
            $scope.sortStatus[key] = value;
            delete $scope.search.areaSort;
            $scope.search[key] = value;
            $scope.find(1);
        }
		//获取单价
		/*$scope.getPrice = function(houseId){
			return $scope.pageModel.data[0].priceMap[houseId];
		}*/
        app.modulePromiss.then(function() {
            fac.initPage($scope,function(){
                $scope.find();
                $scope.getStage();
            });
        });
        // 启用停用 (停用rentalStatus，启用rentalStatus) 
        $scope.updateStatus = function(state,item){
            var param ={
                rentalStatus:state,
                id:item.id
            }
            var word = state?"启用":"停用"
            confirm("确认"+word+"该资源?", function () {
                $.post("/ovu-park/backstage/rental/rentalResources/updateRentalStatus", param, function (resp) {
                    if(resp.code==0){
                        window.msg(word+"资源成功");
                        $scope.find();
                    }else{
                        window.alert(resp.message);
                    }
                });
            })
        }
        // 批量启用/停用  启用:1 停用:0
        $scope.batchUpdate = function (state) {
            let choosed = $scope.pageModel.list.filter((value,index) => {
                return value.checked;
            })
            if (choosed.length == 0) {
                let msg = state == 1?'启用':'停用';
                confirm("请先选择需要被"+msg+'租赁资源!');
                return;
            }
            if (state == 1) { // 启用
                choosed = $scope.pageModel.list.filter((value,index) => {
                    return value.checked && (value.rentalStatus == 1)
                })
                if (choosed.length>0) {
                    confirm("选择的租赁资源中已经存在启用中的租赁资源,请选择停用状态的资源!");
                    return;
                }
            } else {
                choosed = $scope.pageModel.list.filter((value,index) => {
                    return value.checked && (value.rentalStatus == 0)
                })
                if (choosed.length>0) {
                    confirm("选择的租赁资源中已经存在停用中的租赁资源,请选择启用状态的资源!");
                    return;
                }
            }
            let ids = [];
            $scope.pageModel.list.filter((value,index) => {
                if (value.checked) {
                    ids.push(value.id);
                }
            })
            let params = {
                rentalStatus:state,
                houseIds: ids.join(",")
            }
            var word = state?"启用":"停用"
            confirm("确认批量"+word+"选中的资源吗?", function () {
                $.post("/ovu-park/backstage/rental/rentalResources/updateRentalStatusBath", params, function (resp) {
                    if(resp.code==0){
                        window.msg(word+"资源成功");
                        $scope.find();
                    }else{
                        window.alert(resp.message);
                    }
                });
            })
        }
        
        // 查看详情
        $scope.detail = function(item){
            // $location.path('/rental/rentResource/rentResourceDetail');
            var modal = $uibModal.open({
                animation: false,
                size: 'lg',
                templateUrl: '/view/rental/rentResource/modal.detail.html',
                controller: 'rentResourceDetailCtrl',
                resolve: { item, item }
            });
            
        };
    });	
    // 详情 - 弹窗
    app.controller('rentResourceDetailCtrl', function ($scope, $rootScope,$uibModalInstance, fac,item,$location) {	
    	$scope.secondPartyType = ['','个人','企业',"个人"];
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
        //获取基本信息
        $scope.getRentalHouseInfo = function(){
        	var params = {
                    id:item.id
             }
        	$.post("/ovu-park/backstage/rental/rentalResources/getRentalHouseInfo", params, function (resp) {
                 if(resp.code==0){
                     $scope.baseMsg = resp.data;
                     console.log($scope.baseMsg);
                     $scope.$apply();
                 }else{
                     window.alert(resp.message);
                 }
             });
		};
		
		//获取合作信息
		$scope.pageModel = {};
		$scope.find = function(pageNo){
			$scope.contractParams = {
					houseId:item.houseId
	        }
			$.extend($scope.contractParams,{currentPage:pageNo||$scope.pageModel.currentPage||1,pageSize:$scope.pageModel.pageSize||10});
			$scope.contractParams.pageIndex = $scope.contractParams.currentPage-1;
			$scope.contractParams.totalCount = $scope.pageModel.totalCount||0;
			fac.getPageResult("/ovu-park/backstage/rental/contractBaseInfo/getContractListByHouseId", $scope.contractParams,function(data){	
				$scope.pageModel = data;
                console.log($scope.pageModel);
			});
		};
		
		$scope.getRentalHouseInfo();
        $scope.lookContract = function(id){
            $rootScope.target("rental/rentAgreementNew/lookAgreement", "预览合同", false, '', { "id": id }, "rental/rentAgreementNew/lookAgreement");
            $scope.cancel();
        };
    });	
})()
