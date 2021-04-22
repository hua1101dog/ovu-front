(function() {
	var app = angular.module("angularApp");
	app.controller('enterpriseDataCtrl', function($stateParams,$scope, $rootScope, $http, $state,
			$filter, $uibModal, fac) {
		angular.extend($rootScope, fac.dicts);
		document.title = "OVU-企业数据";
	 	var vm =  $scope.vm = this;
	 	var stateParam = {};
        $scope.pageModel = {};
        vm.search = {};
        var param = {};
        vm.enterprise = {};
		$scope.pageModel.totalRecord = 0;
        if(!fac.isEmpty($rootScope.pages.params)){
        	vm.search.id = $rootScope.pages.params.params;
	 	}
        vm.displayByDateOrder = function(sort){
        	vm.search.sort = sort;
        	$scope.find();
        }
        $scope.find = function(pageNo){
            if($scope.pageModel.currentPage){
                delete $scope.pageModel.currentPage;
            }
            $.extend(vm.search,{currentPage:pageNo||$scope.pageModel.currentPage||1,pageSize:$scope.pageModel.pageSize||10});
            vm.search.pageIndex = vm.search.currentPage-1;
            vm.search.totalCount = $scope.pageModel.totalCount||0;
            param = angular.copy(vm.search);
            fac.getPageResult("/ovu-park/backstage/supplychain/CompanyCenter/getCompanyList",param,function(data){
            		$scope.pageModel = data;
            		//$stateParams.params = '';
            });
        }
        // init
       $scope.find(1);
       
       $scope.getCreateTimeDate = function(dateStr){
       	var date = dateStr.trim();
       	return date.substring(0,10);
       }
       
       vm.getAllParkarea = function(){
         	$.post('/ovu-base/system/park/listAvaibleParkList', $scope.search, function(resp){
         		$scope.parkList = resp.data;
             });
       }
        vm.query = function(){
        	$state.params.params = '';
        	vm.search.id = '';
        	$scope.find(1);
        }
        
        //关联产品
        vm.associatedProduct = function(item){
        	$.post('/ovu-park/backstage/supplychain/CompanyCenter/getCompanyInfo',
        		{id:item.id}).then(function(resp){
        			var data = resp.data;
	            	var modal = $uibModal.open({
	                    animation: false,
	                    size:'industryEdit',
	                    templateUrl: '/view/productDatabase/enterpriseDataList/modal.edit.html',
	                    controller: 'associatedProductCtrl',
	                    resolve: {
	                        param: data
	                    }
	                });
                modal.result.then(function () {
                    $scope.find(1);
                }, function () {
                    console.info('Modal dismissed at: ' + new Date());
                });
                
            });
        }
        //展示覆盖企业信息
        vm.displayProductInfo = function(item){
        	var modal = $uibModal.open({
                animation: false,
                size:'info',
                templateUrl: '/view/productDatabase/enterpriseDataList/modal.productInfo.html',
                controller: 'displayProductCtrl',
                resolve: {
                    param: item
                }
        	
            });
            modal.result.then(function () {
                $scope.find();
            }, function () {
                console.info('Modal dismissed at: ' + new Date());
            });
        }

	});
	app.controller('associatedProductCtrl',function($scope, $http, $state,$uibModalInstance, $uibModal, $filter, fac,param){
    	var vm =  $scope.vm = this;
    	$scope.pageModel = {};
    	vm.enterprise = param;
    	var productNameList = [];
      	var productIdList = [];
    	var transforProductName = function(list){
          	angular.forEach(list,function(obj){
      			productNameList.push(obj.productName);
      			productIdList.push(obj.productId);
          	});
          	return {'productIdList':productIdList,'productNameList':productNameList};
          }
    	vm.enterprise.productList = param.productList;
		var productData = transforProductName(vm.enterprise.productList);
		productIdList = productData.productIdList.toString();
		vm.enterprise.domainProductNameStr = productData.productNameList.toString();
		vm.enterprise.domainProductNameList = productData.productNameList;
        vm.cancel = function(){
            $uibModalInstance.dismiss('cancel');
        };
        
        vm.selectProduct = function(){
        	var param = {'originProductList':angular.copy(vm.enterprise.productList),'companyId':vm.enterprise.companyId};
        	var modal = $uibModal.open({
                animation: false,
                size:'industryEdit',
                templateUrl: '/view/productDatabase/enterpriseDataList/modal.productList.html',
                controller: 'productSelectCtrl',
                resolve: {
                    param:param
                }
            });
            modal.result.then(function (data) {
            	vm.enterprise.domainProductNameStr= data.productNameList.toString();
            	vm.enterprise.domainProductNameList = data.productNameList
            	productIdList = data.productIdList.toString();
            	vm.enterprise.productList = data.selectedList;
            }, function () {
                console.info('Modal dismissed at: ' + new Date());
            });
        }
        vm.save = function(form,obj){
        	form.$setSubmitted(true);
	   		 if (!form.$valid) {
	                return;
	            } 
	   			var params = {'companyId':vm.enterprise.companyId,'industryProductCode':productIdList};
        		// save data
        		$.post('/ovu-park/backstage/supplychain/raletion/saveByCompanyId', params, function(resp){
        			 if (resp.code == 0) {
                         $uibModalInstance.close();
                         msg("保存成功！");
                     } else {
                         alert(resp.message);
                     }
                });
        }
        
        vm.deleteAll = function(){
        	 confirm("确认删除所有产品吗?", function () {
        		 productIdList = '';
        		 vm.enterprise.productList = [];
        		 vm.enterprise.domainProductNameStr = '';
        		 vm.enterprise.domainProductNameList = [];
        		 productNameList = [];
             });
        }
    });
	 app.controller('productSelectCtrl',function($rootScope, $scope, $http, $uibModalInstance, $uibModal, $filter, fac,param){
	    var vm =  $scope.vm = this;
	    $scope.search = {};
        $scope.pageModel = {};
        vm.selectedProductList = angular.copy(param.originProductList);
        $scope.search.companyId = param.companyId;
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
            			{parentCode : parentIndustryCode} ,fac.postConfig).success(function(resp){
                    if(resp.code == 0){
                    	$scope.industryList = resp.data;
                    	$scope.search.industryCode = '';
                    }
                });
    		}else{
    			$scope.industryList = [];
    			$scope.search.industryCode = '';
    		}
        }
	        vm.cancel = function(){
	            $uibModalInstance.dismiss('cancel');
	        };
	        $scope.find = function(pageNo){
	        	if($scope.pageModel.currentPage){
	                delete $scope.pageModel.currentPage;
	            }
	            $.extend($scope.search,{currentPage:pageNo||$scope.pageModel.currentPage||1,pageSize:$scope.pageModel.pageSize||10});
	            $scope.search.pageIndex = $scope.search.currentPage-1;
	            $scope.search.totalCount = $scope.pageModel.totalCount||0;
	            fac.getPageResult("/ovu-park/backstage/supplychain/productInfo/getRelationProducts",$scope.search,function(data){
	            	$scope.pageModel = data;
	            	if($scope.pageModel.data && $scope.pageModel.data.length >0){
	            		updateProductListCheckStatus($scope.pageModel);
	            	}
	            
	            });
	        }
	        //清除公司名称
	        $scope.clear = function(){
	        	$scope.search.industryProductName = '';
	        	$scope.search.relationStatus = '';
	        	$scope.search.industryCode = '';
	        	$scope.parentIndustryCode = '';
	        	
	        }
	        
	        $scope.query = function(){
	        	if(fac.isNotEmpty($scope.parentIndustryCode)&&fac.isEmpty($scope.search.industryCode)){
	        		$('.childSelect').addClass('selectInvalid');
	        	} else{
	        		$('.childSelect').removeClass('selectInvalid');
	        		$scope.find(1);
	        	} 
	        }
	        //根据已经存在的productList，将列表中存在的勾选上，并且更新selectedProductList的值
	        var updateProductListCheckStatus = function(data){
	        	angular.forEach(data.data,function(product){
	        		if(fac.isEmpty(product.productId)){
	        			product.productId = product.id;
	        		}
		 			if(angular.isUndefined(product.checked)){
		 				product.checked = false;
		 			}
		 			var flag = false;
		 			angular.forEach(vm.selectedProductList,function(obj){
		 				if(product.productId == obj.productId){
		 					flag = true;
		 				}
		 			});
		 			if(flag){
		 				product.checked = true;
		 			}else{
		 				product.checked = false;
		 			}
		 		});	
	        	//全选
	     		var allFlag = true;
	     		angular.forEach(data.data,function(obj){
	     			if(!obj.checked){
	     				allFlag = false;
	     			}
	     		});
	     		if(allFlag){
	     			data.checked = true;
	     		}else{
	     			data.checked = false;
	     		}
	        }
	            
	         
	        var uniq = function(list){
	            var temp = [];
	            var index = [];
	            var n = list.length;
	            for(var i = 0; i < n; i++) {
	                for(var j = i + 1; j < n; j++){
	                    if (list[i].id == list[j].id){
	                        i++;
	                        j = i;
	                    }
	                }
	                temp.push(list[i]);
	                index.push(i);
	            }
	            return temp;
	        }
	        $scope.checkAll = function (data) {
	        	  data.checked = !data.checked;
	              data.data.forEach(function (n) {
	                  n.checked = data.checked
	              });
            	if(data.checked){
            		angular.forEach(data.data,function(obj){
            			vm.selectedProductList.push(obj);
            		});
            		vm.selectedProductList = uniq(vm.selectedProductList);
            	}else{
            		angular.forEach(data.data,function(obj){
            			angular.forEach(vm.selectedProductList,function(product){
            				if(obj.productId == product.productId){
            					product.checked = false;
            				}
            			});
            		});
            		var tempSelected = [];
            		angular.forEach(vm.selectedProductList,function(obj){
            			if(obj.checked){
            				tempSelected.push(obj);
            			}
            		});
            		vm.selectedProductList = tempSelected;
            	}
	        }
	        $scope.checkOne = function (item, data) {
	        	item.checked = !item.checked;
	             if (data && data.data) {
	                 data.checked = data.data.every(function (v) {
	                     return v.checked;
	                 });
	             }
	            if(item.checked){ //如果是勾选，直接末尾加入
	            	item.productId = item.id;
	            	vm.selectedProductList.push(item);
	            }else{//如果是取消
	            	var tempList = [];
	            	angular.forEach(vm.selectedProductList,function(data,index,array){
	            		if(array[index].productId == item.productId){
	            			vm.selectedProductList.splice(index,1);
	            		}
	            	});
	            }
	        }
	        vm.delProduct = function(product,data){
	        	angular.forEach(vm.selectedProductList,function(data,index,array){
	        		if(array[index].productId == product.productId){
	        			vm.selectedProductList.splice(index,1);
	        			product.checked = false;
	        		}
	        	});	 
	        	updateProductListCheckStatus(data);
	        }
	        $scope.find(1);
	        vm.changePage = function(){
	        	$scope.find();
	        }
	        vm.save = function(pageModel){
	        	var productNameList = [];
	        	var productIdList = [];
	        	angular.forEach(vm.selectedProductList,function(obj){
	     			productNameList.push(obj.productName);
	     			productIdList.push(obj.productId);
	        	});
	        	var param = {'productNameList':productNameList,'productIdList':productIdList,'selectedList':vm.selectedProductList};
	        	$uibModalInstance.close(param);
	        }
	        
	    });
    app.controller('displayProductCtrl',function($scope, $rootScope, $http, $state, $uibModalInstance, $filter, fac,param){
    	var vm =  $scope.vm = this;
    	vm.companyName = param.companyName;
    	$scope.pageModel = {};
    	$scope.find = function(pageNo){
    		if($scope.pageModel.currentPage){
                delete $scope.pageModel.currentPage;
            }
    		var	params = {'companyId':param.id};
            $.extend(params,{currentPage:pageNo||$scope.pageModel.currentPage||1,pageSize:$scope.pageModel.pageSize||10});
            params.pageIndex = params.currentPage-1;
            params.totalCount = $scope.pageModel.totalCount||0;
    		  fac.getPageResult("/ovu-park/backstage/supplychain/raletion/getRelationProducts",params,function(data){
            		$scope.pageModel = data;
            });
    	}
    	vm.gotoProductTab = function(obj){
			$rootScope.target("productDatabase/industryDataList/industryData", "产品数据", false, '',{params:obj.id},"productDatabase/industryDataList/industryData");
    		//$state.go('three', { folder: 'productDatabase', catalogue: 'industryDataList', page: 'industryData',params:obj.id});
    		$uibModalInstance.close();
    	}
        vm.cancel = function(){
            $uibModalInstance.dismiss('cancel');
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