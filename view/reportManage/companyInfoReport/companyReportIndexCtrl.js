(function() {
        var app = angular.module("angularApp");
        //项目架构ctl
        app.controller('reportFormsController', function($scope, $rootScope, $http, $filter, $uibModal, fac) {
        	document.title = "OVU-企业信息报表";
            angular.extend($rootScope, fac.dicts);
            $rootScope.houseIdTypes = {};
            $scope.pageModel = {};
            $scope.isShow = false;

            $scope.beListeds = [
                {value:1, text: "是"},
                {value:2, text: "否"}
            ];

// 企业类型选择框
            $scope. companyTypeList=[
                {dicSort:1,dicItem:"国有企业"},
                {dicSort:2,dicItem:"集体企业"},
                {dicSort:3,dicItem:"股份制"},
                {dicSort:4,dicItem:"联营企业"},
                {dicSort:5,dicItem:"有限责任公司"},
                {dicSort:6,dicItem:"私营企业"},
                {dicSort:7,dicItem:"其他企业"},
                {dicSort:8,dicItem:"港、澳、台商投资企业"},
                {dicSort:9,dicItem:"外商投资企业"},
                {dicSort:10,dicItem:"行政机关"},
                {dicSort:11,dicItem:"事业单位"},
                {dicSort:12,dicItem:"社会团体"},
            ];



          

 



            //获取一级行业类型
        	$scope.parentIndustryList = function(){
            	$http.post("/ovu-base/ovupark/web/industry/queryIndustryList",{grade : 0}, fac.postConfig).success(function(resp){
                    if(resp.code == 0){
                    	$scope.parentIndustryList = resp.data;
                    }
                });
            }
        	//获取一级行业下对应父行业的行业类型列表
        	$scope.getIndustryList = function(){
        		if(fac.isEmpty($scope.search.parentIndustryCode)){
        			$('.childSelect').removeClass('selectInvalid');
        			$scope.search.industryCode = '';
        			$scope.industryList = [];
        		}else{
	            	$http.post("/ovu-base/ovupark/web/industry/queryIndustryByParentCode",
	            			{parentCode : $scope.search.parentIndustryCode} ,fac.postConfig).success(function(resp){
	                    if(resp.code == 0){
	                    	delete $scope.search.industryCode;
	                    	$scope.industryList = resp.data;
	                    }
	                });
        		}
            }
        	
        	//先加在一级行业列表，当一级行业选取的时候，触发二级行业的选择
        	$scope.parentIndustryList();
        	
            //加载二级行业列表,作为列表回显使用
        	$http.post("/ovu-base/ovupark/web/industry/queryIndustryList",{grade : 1}, fac.postConfig).success(function(resp){
                if(resp.code == 0){
                	$scope.secondIndustryList = resp.data;
                }
            });
            
        	//获取行业名称
            $scope.getIndustryName = function(industryCode){
            	var industryName = "--";
            	angular.forEach($scope.secondIndustryList,function(industryObj){
       			 if(industryCode == industryObj.industryCode){
       				industryName = industryObj.industryName;
       			 }
       		 });
            	return industryName;
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
            //改变注册地址
           $scope.changeAddrType = function(){
               
            $scope.search.stageId = "";
            if($scope.search.regAddrType == 1){//1:园区内  2:园区外  
                $scope.isShow = true;
                $scope.loadStage();
            }else{
                $scope.isShow =false;
            }
            // else {
            //     $scope.isShow = false;
              
            // }
       }

         //查询
         $scope.find = function(pageNo) {
            var pag = {
                currentPage : pageNo || $scope.pageModel.currentPage || 1,
                pageSize : $scope.pageModel.pageSize || 10
            };
            $.extend($scope.search, pag);
            $scope.search.pageIndex = $scope.search.currentPage - 1;
            $scope.search.totalCount = $scope.pageModel.totalCount || 0;
         
            fac.getPageResult("/ovu-base/system/reportForms/listByPage",$scope.search,function(data){
                $scope.pageModel = data;
            });
        }
         

        //查询
        $scope.query = function(){
          
        if(fac.isNotEmpty($scope.search.parentIndustryCode)&&fac.isEmpty($scope.search.industryCode)){
             $('.childSelect').addClass('selectInvalid');
                } else{
         $('.childSelect').removeClass('selectInvalid');
            fac.initPage($scope,function(){
             $scope.find(1);
            })
                }  

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
                	$scope.search.floorNum = '';
                	$scope.search.houseId = '';
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
                    	$scope.search.floorNum = '';
                    	$scope.search.houseId = '';
                });     
            }
            
            //根据buildId,unitId获取楼层信息
            $scope.selectUnit = function () {
                var params = { "buildId":$scope.search.buildId,"unitNo":$scope.search.unitNum}
                $http.post("/ovu-base/system/parkHouse/listGroundNo_mute", params, fac.postConfig).success(function(resp){
                	if(resp.code == 0){
                		$scope.floorList = resp.data;
                		$scope.houseList = [];
                		$scope.search.floorNum = '';
                    	$scope.search.houseId = '';
                	}         
                });     
            }
          //根据buildId,unitId,groundNo获取楼层信息
            $scope.selectGround = function () {
                var params = { "buildId":$scope.search.buildId,"unitNo":$scope.search.unitNum,'groundNo':$scope.search.floorNum}
                $http.post("/ovu-base/system/parkHouse/getHouses", params, fac.postConfig).success(function(resp){
                	if(resp.code == 0){
                		$scope.houseList = resp.data;
                    	$scope.search.houseId = '';
                	}         
                });     
            }
           
            /**
            导出到excel表
             */
            $scope.exportToTable = function() {
                var regAddrType = $scope.search.regAddrType;
                var companyName = $scope.search.companyName;
                var parentIndustryCode = $scope.search.parentIndustryCode;
                var industryCode = $scope.search.industryCode;
                var enterTimeBegin = $scope.search.enterTimeBegin;
                var enterTimeEnd = $scope.search.enterTimeEnd;
                var stageId = $scope.search.stageId;
                var buildId = $scope.search.buildId;
                var unitNum = $scope.search.unitNum;
                var floorNum = $scope.search.floorNum;
                var houseId = $scope.search.houseId;

                var requestData = "parkId="+app.park.parkId;
                if (stageId) {
                    requestData += "&stageId=" + stageId;
                }
                if (buildId) {
                    requestData += "&buildId=" + buildId;
                }
                if (unitNum) {
                    requestData += "&unitNum=" + unitNum;
                }
                if (floorNum) {
                    requestData += "&floorNum=" + floorNum;
                }
                if (houseId) {
                    requestData += "&houseId=" + houseId;
                }
                if (regAddrType) {
                	requestData += "&regAddrType=" + regAddrType;
                }
                if (companyName) {
                    requestData += "&companyName=" + companyName;
                }
                if (parentIndustryCode) {
                    requestData += "&parentIndustryCode=" + parentIndustryCode;
                }
                if (industryCode) {
                    requestData += "&industryCode=" + industryCode;
                }
                if (enterTimeBegin) {
                    requestData += "&enterTimeBegin=" + enterTimeBegin;
                }
                if (enterTimeEnd) {
                    requestData += "&enterTimeEnd=" + enterTimeEnd;
                }

                var URL = encodeURI("/ovu-base/system/reportForms/exportCompanyInfo?"+ requestData);
                window.location.href = URL;
            }
            app.modulePromiss.then(function() {
                fac.initPage($scope,function(){
                	$scope.find(1);
                })
            });


    
            $scope.queryCompanyEnterHouses = function (companyId) {

                var modal = $uibModal.open({
                    animation: false,
                    size: '',
                    templateUrl: '/view/reportManage/companyInfoReport/company.enterHouse.html',
                    controller: 'companyEnterHouseCtrl',
                    resolve: { companyId : function () {
                            return companyId;
                        }
                    }
                });
            }

        });

        app.controller('companyEnterHouseCtrl', function ($scope, $rootScope, $http, $uibModalInstance, $filter, fac,companyId) {
        $scope.id = companyId;
        $scope.search={};
        $scope.pageModel = {};
        $scope.find = function (pageNo) {
            $scope.search.companyId = $scope.id;
            $.extend($scope.search, {   currentPage: pageNo || $scope.pageModel.currentPage || 1,
                pageSize: $scope.pageModel.pageSize || 10 });
            $scope.search.pageIndex = $scope.search.currentPage - 1;
            $scope.search.totalCount = $scope.pageModel.totalCount || 0;
            fac.getPageResult("/ovu-park/backstage/spaceReport/house/queryCompanyEnterList",  $scope.search, function(data){
                $scope.pageModel = data;
            });
        }

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        }

        app.modulePromiss.then(function () {
            $scope.find();
        });

    });

})()
