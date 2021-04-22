(function() { 
    var app = angular.module("angularApp");
    //用电报表相关
    app.controller('elecMeterReportCtl', function ($scope, $rootScope,$q, $http, $filter, $uibModal, fac) {            
        angular.extend($rootScope,fac.dicts);
        $scope.currentType = "year";//按年统计
        $scope.search = {currentDay : "0"};
        $scope.pageModel = {};
        $scope.search.time = '';
        $scope.initDate = function(){
            var currDateStr = new Date().format("yyyy-MM"); 
            $("#dayElecReport", "#elecMeterReport").val(currDateStr);
            $("#yearElecReport", "#elecMeterReport").val(currDateStr.substring(0, 4));
            $("#monthElecReport", "#elecMeterReport").val(new Date().format("yyyy-MM"));
        };
        $scope.initDate();
        var getParkNo = function(){
        	var deferred = $q.defer();
    	    $http.get("/ovu-base/system/park/get?id=" + $scope.park.parkId).success(function (resp) {
    		   if(resp.code == 0){
    			   app.park.parkNo = resp.data.parkNo;
        		   deferred.resolve(resp.data);
    		   }else {
    			   deferred.reject(resp.data);
    		   }
           })
           return deferred.promise;
        }
        $scope.find = function(pageNo){
        	if (!app.park) {
				windows.error("请先选择一个项目！");
				return false;
			}
        	
            $.extend($scope.search,{currentPage:pageNo||$scope.pageModel.currentPage||1,pageSize:$scope.pageModel.pageSize||10});
            $scope.search.pageIndex = $scope.search.currentPage-1;
            $scope.search.totalCount = $scope.pageModel.totalCount||0;
            if($scope.currentType == "month"){
            	$scope.search.time = $("#monthElecReport", "#elecMeterReport").val();
                if(!$scope.search.time || $scope.search.time.trim() == ""){
                    window.alert("请选择统计月份!");
                    return false;
                }
            }else if($scope.currentType == "year"){
            	$scope.search.time = $("#yearElecReport", "#elecMeterReport").val();
                if(!$scope.search.time || $scope.search.time.trim() == ""){
                    window.alert("请选择统计年份!");
                    return false;
                }
                $scope.search.currentYear = $scope.search.time;
            }else if($scope.currentType == "day"){
            	$scope.search.time = $("#dayElecReport", "#elecMeterReport").val();
                if(!$scope.search.time || $scope.search.time.trim() == ""){
                    window.alert("请选择统计日期!");
                    return false;
                }
            }
            var params = {
            		'currentPage':$scope.search.currentPage,
            		'pageIndex': $scope.search.pageIndex,
            		'pageSize': $scope.search.pageSize,
            		'parkNo': app.park.parkNo,
            		'timeDim': $scope.currentType,
            		'time': $scope.search.time
            		};
            fac.getPageResult("/ovu-energy/energy/park/point/page", params,function(data){ 
            	$scope.pageModel = data;
            });
        };
        app.modulePromiss.then(function() {
            fac.initPage($scope,function(){
            		 getParkNo().
						then(function(data){
							$scope.find(1);
						}, function(data){
							
						})
            	
            })
        });
        
        $scope.setCurrentType=function(type){
            $scope.currentType = type;
            if(type == "month"){
                $("#monthElecReport", "#elecMeterReport").css("display", "inline-block");
                $("#yearElecReport", "#elecMeterReport").css("display", "none");
                $("#dayElecReport", "#elecMeterReport").css("display", "none");
                $("#monthElecReport", "#elecMeterReport").val(new Date().format("yyyy-MM"));
            }else if(type == "year"){
                $("#monthElecReport", "#elecMeterReport").css("display", "none");
                $("#dayElecReport", "#elecMeterReport").css("display", "none");
                $("#yearElecReport", "#elecMeterReport").css("display", "inline-block");
                $("#yearElecReport", "#elecMeterReport").val(new Date().format("yyyy"));
            }else if(type == "day"){
                $("#monthElecReport", "#elecMeterReport").css("display", "none");
                $("#yearElecReport", "#elecMeterReport").css("display", "none");
                $("#dayElecReport", "#elecMeterReport").css("display", "inline-block");
                $("#dayElecReport", "#elecMeterReport").val(new Date().format("yyyy-MM-dd"));
            }
        };
        
        //展示电表历史记录详情
        $scope.showDetailsModal = function(item){
        	var params = {'pointId' : item.pointId,
        				'time' : $scope.search.time,
        				'timeDim' : $scope.currentType
	                   };
            var modal = $uibModal.open({
                animation: false,
                size: 'lg',
                templateUrl: '/view/reportManage/waterPowerReport/modal.detail.html',
                controller: 'elecMeterDetailsCtrl', 
                resolve: {elecData: params}
            });
            modal.result.then(function () {
                console.info('Modal closed at: ' + new Date());
            }, function () {
                console.info('Modal dismissed at: ' + new Date());
            });
        };
    });
    app.controller('elecMeterDetailsCtrl', function($scope, $rootScope, $http, $uibModalInstance, $filter, fac, $uibModal, elecData){
        angular.extend($rootScope,fac.dicts);
        $scope.pageModel = {};
        $scope.find = function(pageNo){
            $.extend($scope.search,{currentPage:pageNo||$scope.pageModel.currentPage||1,pageSize:$scope.pageModel.pageSize||10});
            $scope.search.pageIndex = $scope.search.currentPage-1;
            $scope.search.totalCount = $scope.pageModel.totalCount||0;
            var params = {
            		'currentPage':$scope.search.currentPage,
            		'pageIndex': $scope.search.pageIndex,
            		'pageSize': $scope.search.pageSize,
            		'parkNo': $scope.search.parkNo,
            		'timeDim': elecData.timeDim,
            		'time': elecData.time,
            		'pointId':elecData.pointId
            		};
            fac.getPageResult("/ovu-energy/energy/park/point/data", params,function(data){ 
                $scope.pageModel = data;
            });
            /*fac.getPageResultForEnergy("/ovu-energy/energy/park/point/data", params,function(data){ 
                $scope.pageModel = data;
            });*/
        };
        app.modulePromiss.then(function() {
            fac.initPage($scope,function(){
            	$scope.find(1);
            })
        });
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    });
})()