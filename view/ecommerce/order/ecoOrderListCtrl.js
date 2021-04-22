(function() {
		var app = angular.module("angularApp");
		app.controller('ecoOrderListCtl', function ($scope, $rootScope, $http, $filter, $uibModal, fac) {
			angular.extend($rootScope,fac.dicts);
			document.title ="OVU-订单交易查询";
			$scope.search = {};
			$scope.statusModel = [
//				{"name":"进行中","id":0},
				{"name":"待发货","id":1},
				{"name":"已发货","id":2},
				{"name":"已收货","id":3},
				{"name":"已完成","id":4},
				{"name":"已取消","id":5}
			];
			$scope.priceModel = [
				{"name":"100元以内","section":"0-100"},
				{"name":"101-1000元","section":"101-1000"},
				{"name":"1001-10000元","section":"1001-10000"},
				{"name":"10000元以上","section":"10001-999999"}
			];
			$scope.customerUserModel = {};
			$scope.pageModel = {};
			
			$scope.find = function(pageNo){
				$.extend($scope.search,{currentPage:pageNo||$scope.pageModel.currentPage||1,pageSize:$scope.pageModel.pageSize||10});
				$scope.search.pageIndex = $scope.search.currentPage-1;
				$scope.search.totalCount = $scope.pageModel.totalCount||0;
				$scope.search.UrlKey = $rootScope.UrlKey;
				if($scope.search.priceRange && $scope.search.priceRange.split('-').length === 2){
					$scope.search.priceMin = $scope.search.priceRange.split('-')[0];
					$scope.search.priceMax = $scope.search.priceRange.split('-')[1];
				}else{
					$scope.search.priceMin = "";
					$scope.search.priceMax = "";
				}

				fac.getPageResult("/ovu-park/backstage/ecommerce/orderManage/getAllOrderByGrid",$scope.search,function(data){
					console.log(data);
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
	        
	        /**
	         * 查看订单
	         */
	        $scope.showApproveModal = function (commodity) {
	        	commodity = commodity || {};
	        	commodity.statusName = $scope.getStatus(commodity.status);
	            var copy = angular.extend({}, commodity);

	            var modal = $uibModal.open({
	            	animation:true,
	                size: 'lg',
	                templateUrl: '/view/ecommerce/order/modalDetails.html',
	                controller: 'viewOrderCtrl',
	                resolve: {order: copy},
	                backdrop: 'static',
	                keyboard: false
	            });
	            
	            modal.result.then(function () {
	            	
	            }, function () {
	                console.info('Modal approveDemandCtrl dismissed at: ' + new Date());
	            });
	        };
			
			!function(){
				$scope.find(1);
			}();
		});
		
		app.controller('viewOrderCtrl',function($rootScope,$scope, $http, $uibModalInstance, $filter, fac, order, $uibModal){
		        $scope.item = order;
		        angular.extend($rootScope,fac.dicts);
				$scope.search = {"orderNo":$scope.item.id};
				$scope.pageModel = {};
				
				$scope.find = function(pageNo){
					$.extend($scope.search,{currentPage:pageNo||$scope.pageModel.currentPage||1,pageSize:$scope.pageModel.pageSize||10});
					$scope.search.pageIndex = $scope.search.currentPage-1;
					$scope.search.totalCount = $scope.pageModel.totalCount||0;
					$scope.search.UrlKey = $rootScope.UrlKey;
	
					fac.getPageResult("/ovu-park/backstage/ecommerce/orderManage/getOrderInfoByID",$scope.search,function(data){
						$scope.pageModel = data;
					});
				};
				!function(){
					$scope.find(1);
				}();
		        $scope.cancel = function () {
		            $uibModalInstance.dismiss('cancel');
		        };
		    });
		
	})()
	
	