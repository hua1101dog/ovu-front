(function() {
		var app = angular.module("angularApp");
		app.controller('complainListCtrl', function ($scope, $rootScope, $http, $filter, $uibModal, fac) {
			document.title ="OVU-投诉管理";
			angular.extend($rootScope,fac.dicts);
			$scope.search = {};
			$scope.statusModel = [
				{"name":"未回复","id":0},
				{"name":"已回复","id":1}
			];
			$scope.pageModel = {};
			
			$scope.find = function(pageNo){
				$.extend($scope.search,{currentPage:pageNo||$scope.pageModel.currentPage||1,pageSize:$scope.pageModel.pageSize||10});
				$scope.search.pageIndex = $scope.search.currentPage-1;
				$scope.search.totalCount = $scope.pageModel.totalCount||0;
				$scope.search.UrlKey = $rootScope.UrlKey;
				if($scope.search.time){
					if($scope.search.time=="1"){
						$scope.search.marker = "M";
						$scope.search.ago = "1";
					}else if($scope.search.time=="2"){
						$scope.search.marker = "M";
						$scope.search.ago = "3";
					}else if($scope.search.time=="3"){
						$scope.search.marker = "M";
						$scope.search.ago = "6";
					}else if($scope.search.time=="4"){
						$scope.search.marker = "Y";
						$scope.search.ago = "1";
					}
				}else{
					$scope.search.marker = "";
					$scope.search.ago = "";
				}
				fac.getPageResult("/ovu-park/backstage/propertyComplain/list",$scope.search,function(data){
					$scope.pageModel = data;
				});
				
			};
			/**
			 * 设置需求行业
			 */
	        $scope.getStatus = function(sid){
	        	var name = "";
	        	var len = $scope.statusModel.length;
	        	for(var i = 0; i < len; i++){
	        		var temp = $scope.statusModel[i];
	        		if(sid == temp.id){
	        			name = temp.name;
	        		}
	        	}
	        	return name;
	        }
	        
	        $scope.showViewModal = function (advertising) {
	        	advertising = advertising || {};
	            var copy = angular.extend({}, advertising);

	            var modal = $uibModal.open({
	            	animation:true,
	                size: 'lg',
	                templateUrl: '/view/adminPark/complaintManage/modalView.html',
	                controller: 'viewComplaintViewCtrl',
	                resolve: {complain: copy},
	                backdrop: 'static',
	                keyboard: false
	            });
	            
	            modal.result.then(function (resp) {
	            	if(resp.code == 0){
	            		$scope.find(1);
	            		msg("提交成功！");
	            	}
	            }, function () {
	                console.info('Modal approveDemandCtrl dismissed at: ' + new Date());
	            });
	        };
	        // 详情 
	        $scope.showApproveModal = function (advertising) {
	        	advertising = advertising || {};
	            var copy = angular.extend({}, advertising);

	            var modal = $uibModal.open({
	            	animation:true,
	                size: 'lg',
	                templateUrl: '/view/adminPark/complaintManage/modalDetails.html',
	                controller: 'viewComplaintCtrl',
	                resolve: {complain: copy},
	                backdrop: 'static',
	                keyboard: false
	            });
	            
	            modal.result.then(function (resp) {
	            	if(resp.code == 0){
	            		$scope.find(1);
	            		msg("提交成功！");
	            	}
	            }, function () {
	                console.info('Modal approveDemandCtrl dismissed at: ' + new Date());
	            });
	        };
			app.modulePromiss.then(function() {
				fac.initPage($scope,function(){
					$scope.find(1);
				})
			});
			$scope.query = function(){
	        	fac.initPage($scope, function () {
	                $scope.find(1);
	            })
	        }
		});
		
		app.controller('viewComplaintCtrl',function($scope,$rootScope, $http, $uibModalInstance, $filter,$uibModal, fac, complain){
			$scope.type = complain.type=='1'?"建议":"投诉";
			$scope.item = {};  
	        $scope.getDetail = function(){
	        	var param = {"id":complain.id};
	            $http.post("/ovu-park/backstage/propertyComplain/getDetail", param, fac.postConfig).success(function(resp){
	               if(resp.code == 0) {
	               		$scope.item = resp.data;
	               }
	            });
	        };
	    	$scope.cancel = function () {
	            $uibModalInstance.dismiss('cancel');
	        };
	        
	        !function(){
	        	$scope.getDetail();
	        }();
	    });
	    
	    app.controller('viewComplaintViewCtrl',function($scope,$rootScope, $http, $uibModalInstance, $filter,$uibModal, fac, complain){
	        $scope.item = {};  
	        $scope.complainDetail = {
	        	"complainId":complain.id,
	        	"uid":$rootScope.user.id,
	        	"content":""
	        };
	        $scope.getDetail = function(){
	        	var param = {"id":complain.id};
	            $http.post("/ovu-park/backstage/propertyComplain/getDetail", param, fac.postConfig).success(function(resp){
	               if(resp.code == 0) {
	               		$scope.item = resp.data;
	               }
	            });
	        };

		    $scope.saveComplain = function(){
		    	if(!$scope.complainDetail.content || $.trim($scope.complainDetail.content)==""){
		    		alert("请填写回复内容！");
                	return;
		    	}
		    	console.log("$rootScope.user===",$rootScope.user);
		    	var param = angular.copy($scope.complainDetail);
	            $http.post("/ovu-park/backstage/complainReply/save", param, fac.postConfig).success(function(resp){
	               if(resp.code == 0) {
	               		$uibModalInstance.close({"code":resp.code});
	               }
	            });
	        };
	       
	        $scope.cancel = function () {
	            $uibModalInstance.dismiss('cancel');
	        };
	        
	        !function(){
	        	$scope.getDetail();
	        }();
	    });
	    
	})()
	
	