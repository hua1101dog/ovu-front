(function() {
    var app = angular.module("angularApp");
    app.controller('mgmtIndexCtrl', function ($scope, $rootScope, $state,$q,$http, $filter, $uibModal, fac) {
    	document.title ="OVU-数据管理";
    	var vm =  $scope.vm = this;
        angular.extend($rootScope,fac.dicts);
        $scope.pageModel = {};
    	$scope.products = '';
    	$scope.productTree = [];
    	$scope.selectData = [];
        vm.search = {};
        var param = {};
        $scope.pageModel.totalRecord = 0;
        $scope.find = function(pageNo){
            if($scope.pageModel.currentPage){
                delete $scope.pageModel.currentPage;
            }
            $.extend(vm.search,{currentPage:pageNo||$scope.pageModel.currentPage||1,pageSize:$scope.pageModel.pageSize||10});
            vm.search.pageIndex = vm.search.currentPage-1;
            vm.search.totalCount = $scope.pageModel.totalCount||0;
            param = angular.copy(vm.search);
            if(fac.isNotEmpty($scope.selectData)){
            	 param.ids = $scope.selectData;
            }
            fac.getPageResult("/ovu-park/backstage/supplychain/productInfo/getProductListByParams",param,function(data){
            		$scope.pageModel = data;
            });
        }
        // init
        $scope.find();
      //获取一级行业类型
    	$scope.parentIndustryList = function(){
        	$http.post("/ovu-base/ovupark/web/industry/queryIndustryList",{grade : 0}, fac.postConfig).success(function(resp){
                if(resp.code == 0){
                	$scope.parentIndustryList = resp.data;
                }
            });
        }
    	//获取一级行业下对应父行业的行业类型列表
    	$scope.getIndustryList = function(parentIndustryCode){
    		if(!fac.isEmpty(parentIndustryCode)){
    			$http.post("/ovu-base/ovupark/web/industry/queryIndustryByParentCode",
            			{parentCode : $scope.parentIndustryCode} ,fac.postConfig).success(function(resp){
                    if(resp.code == 0){
                    	$scope.industryList = resp.data;
                    	vm.search.industryCode = '';
                    	$scope.productTree = [];
            			$scope.selectData = [];
                    	$scope.products = '';
                    }
                });
    		}else{
    			$('.childSelect').removeClass('selectInvalid');
    			$scope.industryList = [];
    			vm.search.industryCode = '';
    			$scope.productTree = [];
    			$scope.selectData = [];
    		}
        }
        vm.query = function(){
        	if(fac.isNotEmpty($scope.parentIndustryCode)&&fac.isEmpty(vm.search.industryCode)){
        		$('.childSelect').addClass('selectInvalid');
        	} else{
        		$('.childSelect').removeClass('selectInvalid');
        		$scope.find(1);
        	}       	
        }
        
        vm.getProductList = function(industryCode){
        	$scope.products = '';
		 	$scope.productTree = [];
        	$scope.selectData = [];
        	$.post('/ovu-park/backstage/supplychain/productInfo/getProductListByIndustryCode', {'industryCode':industryCode}, function(resp){
        		$scope.productTree = resp.data;
            });
        }
        vm.edit = function(type,item){
        	var param ={'operationType':type};
        	if(type == 'modify'){
        		param.data = item;
        	}
        		var modal = $uibModal.open({
                    animation: false,
                    size:'lg',
                    templateUrl: '/view/productDatabase/dataManager/modal.enterprise.html',
                    controller: 'editDataCtrl',
                    resolve: {
                        param: param
                    }
                });
                modal.result.then(function () {
                    $scope.find();
                }, function () {
                    console.info('Modal dismissed at: ' + new Date());
                });
        }
        vm.deleteItem = function(item){
        	confirm("确认删除这项产品信息吗？", function() {
    			var params = {'id':item.id};
            	  $http.post("/ovu-park/backstage/supplychain/productInfo/remove", params, fac.postConfig).success(function(resp) {
                      if (resp.code == 0) {
                          msg("操作成功！");
                          $scope.find(1)
                      } else {
                          alert(resp.message);
                      }
                  })
            });
        }
    });
    app.controller('editDataCtrl',function($scope,$rootScope, $http, $uibModalInstance, $filter, fac,param){
    	var vm =  $scope.vm = this;
    	 //获取一级行业类型
    	$scope.parentIndustryList = function(){
        	$http.post("/ovu-base/ovupark/web/industry/queryIndustryList",{grade : 0}, fac.postConfig).success(function(resp){
                if(resp.code == 0){
                	$scope.parentIndustryList = resp.data;
                }
            });
        }
    	//获取一级行业下对应父行业的行业类型列表
    	$scope.getIndustryList = function(parentIndustryCode,type){
    		if(!fac.isEmpty(parentIndustryCode)){
    			$http.post("/ovu-base/ovupark/web/industry/queryIndustryByParentCode",
            			{parentCode : parentIndustryCode} ,fac.postConfig).success(function(resp){
                    if(resp.code == 0){
                    	$scope.industryList = resp.data;
                    	 if(type == 'select'){
                    		vm.enterprise.industryCode = '';
                    	}
                    	
                    }
                });
    		}else{
    			$scope.industryList = [];
    			vm.enterprise.industryCode = '';
    		}
        	
        }
    	vm.operationType = angular.copy(param.operationType);
    	if(vm.operationType == 'modify'){
    		vm.enterprise = angular.copy(param.data);
    		if(fac.isNotEmpty(vm.enterprise.industryParentCode)){
        		$scope.getIndustryList(param.data.industryParentCode,'init');
        	}
    	}else if(vm.operationType == 'add'){
    		vm.enterprise = {};
    		vm.enterprise.relationStatus = '';
    	}
        vm.save = function(form,obj){
        	form.$setSubmitted(true);
	   		 if (!form.$valid) {
	                return;
	            } 
	   		var saveData = angular.copy(vm.enterprise);
	   		saveData.creatorId = $rootScope.user.id;
    		delete saveData.updateTime;
	   		delete saveData.createTime;
    		$.post('/ovu-park/backstage/supplychain/productInfo/saveOrEdit', saveData, function(resp){
    			 if (resp.code == 0) {
                     $uibModalInstance.close();
                     msg("保存成功！");
                 } else {
                     alert(resp.message);
                 }
            });
        }
        vm.cancel = function(){
            $uibModalInstance.dismiss('cancel');
        };
    });
    app.directive("productSelect", function () {
		return {
		    restrict: 'AE',
		    scope: {
				productTree:'=',
				selectData:'=',
				products:'='
			},
			replace: true,
		    templateUrl: '/view/productDatabase/directive/product.html',
		    controller: function($scope) {
		    	$scope.isProduct = false;
		    	$scope.$watch('productTree',function(){
		    		selectData();	    		
		    	})
		    	$scope.openTreeProduct = function() {
		    		$scope.isProduct = true;
		    	}
	    		$scope.productClick = function(item) {
	    		  $scope.products = '';
	    		  item.checkflag = item.checkflag==1?0:1;
	    		  selectData();
		        }
	    		function selectData() {
	    		  var arr  = [];
	    		  $scope.selectData = [];  
	    		  var tempIdArr = [];
			      for(var i in $scope.productTree) {
			      	if($scope.productTree[i].checkflag==1) {
			      		arr.push($scope.productTree[i].industryProductName);
			      		tempIdArr.push($scope.productTree[i].id);
			      	}
			      }
			      $scope.products = arr.join('，');
			      $scope.selectData = tempIdArr.join(',');
	    		}
			}
	    };
	});
    app.directive("outsideClick", function () {
    	return {
    	      restrict: 'AC',
    	      link: function(scope, el, attr) {
    	    	  $('html').on('click', function(e) {
    	          e.preventDefault();
    	          var temp = $(e.target).closest('.areaClick').length;
    	          if($(e.target).closest('.areaClick').length > 0){
    	        	  $('.industrial_ul').show();
    	         }else{
    	        	 $('.industrial_ul').hide();
    	         }
    	        });
    	      }
    	    };
	});
    app.directive('ngEnter', function () {
        return function (scope, element, attrs) {
            element.bind("keydown keypress", function (event) {
                if (event.which === 13) {
                    scope.$apply(function () {
                        scope.$eval(attrs.ngEnter);
                    });
                    event.preventDefault();
                }
            });
        };
    });
})()