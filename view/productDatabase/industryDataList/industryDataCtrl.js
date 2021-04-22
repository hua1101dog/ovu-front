(function() {
	var app = angular.module("angularApp");
	app.controller('industryDataCtrl', function($scope, $rootScope,$state,$http, $filter, $uibModal, fac) {
		angular.extend($rootScope, fac.dicts);
		document.title = "OVU-产业数据";
		var vm = $scope.vm = this;
		angular.extend($rootScope, fac.dicts);
		$scope.pageModel = {};
		$scope.chains = '';
    	$scope.chainTree = [];
    	$scope.selectData = [];
		$scope.pageModel.totalRecord = 0;
		app.park = '';
		vm.search = {};
		if(!fac.isEmpty($rootScope.pages.params)){
		 	vm.search.ids = $rootScope.pages.params.params;;
	 	}
		vm.displayByDateOrder = function(sort){
        	vm.search.sort = sort;
        	$scope.find();
        }
		$scope.find = function(pageNo) {
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
            fac.getPageResult("/ovu-park/backstage/supplychain/productInfo/queryProductListByParams",param,function(data){
            		$scope.pageModel = data;
            		app.park.industryCategoryCode = '';
            });
		}
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
    	
		// init
		$scope.find(1);
			
		//查询产品列表
		 vm.getProductList = function(industryCode){
			 	$scope.products = '';
			 	$scope.productTree = [];
            	$scope.selectData = [];
	        	$.post('/ovu-park/backstage/supplychain/productInfo/getProductListByIndustryCode', {'industryCode':industryCode}, function(resp){
	        		$scope.productTree = resp.data;
	            });
	        }
	        
	        vm.query = function(){
	        	vm.search.ids = '';
	        	if(fac.isNotEmpty($scope.parentIndustryCode)&&fac.isEmpty(vm.search.industryCode)){
	        		$('.childSelect').addClass('selectInvalid');
	        	} else{
	        		$('.childSelect').removeClass('selectInvalid');
	        		$scope.find(1);
	        	}  
	        }
	        
	        vm.associatedCompany = function(item){
	        	var modifyData = {};
	        	$.post('/ovu-park/backstage/supplychain/productInfo/getProductDetail',
	        		{id:item.id}).then(function(resp){
	        			if(resp.code == 0){
	        				var data = resp.data;
			            	var modal = $uibModal.open({
			                    animation: false,
			                    size:'industryEdit',
			                    templateUrl: '/view/productDatabase/industryDataList/modal.edit.html',
			                    controller: 'associatedCompanyCtrl',
			                    resolve: {
			                        param: data
			                    }
			                });
			                modal.result.then(function () {
			                    $scope.find();
			                }, function () {
			                    console.info('Modal dismissed at: ' + new Date());
			                });
	        			}else{
	        				alert(resp.message);
	        			}
	            });
	        }
	     //展示企业信息
	     vm.displayEnterpriseInfo = function(item){
        	var modal = $uibModal.open({
                animation: false,
                size:'info',
                templateUrl: '/view/productDatabase/industryDataList/modal.enterpriseInfo.html',
                controller: 'enterpriseInfoCtrl',
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
	
	 app.controller('enterpriseInfoCtrl',function($scope, $rootScope, $http, $state, $uibModalInstance, $filter, fac,param){
	    	var vm =  $scope.vm = this;
	    	$scope.pageModel = {};
	    	$scope.find = function(pageNo){
	    		if($scope.pageModel.currentPage){
	                delete $scope.pageModel.currentPage;
	            }
	    		var	params = {'industryProductCode':param.id};
	            $.extend(params,{currentPage:pageNo||$scope.pageModel.currentPage||1,pageSize:$scope.pageModel.pageSize||10});
	            params.pageIndex = params.currentPage-1;
	            params.totalCount = $scope.pageModel.totalCount||0;
	    		  fac.getPageResult("/ovu-park/backstage/supplychain/raletion/getRelationCompanys",params,function(data){
	            		$scope.pageModel = data;
	            });
	    	}
	    	vm.gotoEnterpriseTab = function(obj){
				$rootScope.target("productDatabase/enterpriseDataList/enterpriseData", "企业数据", false, '',{params:obj.id},"productDatabase/enterpriseDataList/enterpriseData");
	    		//$state.go('three', { folder: 'productDatabase', catalogue: 'enterpriseDataList', page: 'enterpriseData' ,params:obj.id});
	    		$uibModalInstance.close();
	    	}
	        vm.cancel = function(){
	            $uibModalInstance.dismiss('cancel');
	        };
	    });
	 
	 app.controller('enterpriseSelectCtrl',function($rootScope, $scope, $http, $uibModalInstance, $uibModal, $filter, fac,param){
	    	var vm =  $scope.vm = this;
	    	vm.getAllParkarea = function(){
	          	$.post('/ovu-base/system/park/listAvaibleParkList', $scope.search, function(resp){
	          		$scope.parkList = resp.data;
	              });
	        }
	    	$scope.search = {};
            $scope.pageModel = {};
            vm.originCompanList = param.originCompanyList;
            vm.selectedCompanyList = angular.copy(vm.originCompanList);
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
	            $scope.search.industryProductCode = param.id;
	            fac.getPageResult("/ovu-park/backstage/supplychain/CompanyCenter/getRelationCompanys",$scope.search,function(data){
	            	$scope.pageModel = data;
	            	if(data.data && data.data.length >0){
            			updateCompanyListCheckStatus($scope.pageModel);
	            	}
	            });
	        }
	        //清除公司名称
	        $scope.clear = function(){
	        	$scope.search.companyName = '';
	        	$scope.search.parkId = '';
	        }
	        //根据已经存在的companyList，将列表中存在的勾选上，并且更新selectedCompayList的值
	        var updateCompanyListCheckStatus = function(data){
	        	if(vm.selectedCompanyList.length == 0){
	        		angular.forEach(data.data,function(company){
			 			company.checked = false;
			 		});	
	        	}else{
	        		angular.forEach(data.data,function(company){
		        		if(fac.isEmpty(company.id)){
		        			company.companyId = company.id;
		        		}
			 			if(fac.isEmpty(company.checked)){
			 				company.checked = false;
			 			}
			 			var flag = false;
			 			angular.forEach(vm.selectedCompanyList,function(obj){
			 				if(company.id == obj.id){
			 					flag = true;
			 				}
			 			});
			 			if(flag){
			 				company.checked = true;
			 			}else{
			 				company.checked = false;
			 			}
			 		});	
	        	}
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
	                    if (list[i].id === list[j].id){
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
            	var tempList = [];
            	if(data.checked){
            		angular.forEach($scope.pageModel.data,function(obj){
            			vm.selectedCompanyList.push(obj);
            			obj.checked = true;
            		});
            		vm.selectedCompanyList = uniq(vm.selectedCompanyList);
            	}else{
            		angular.forEach(data.data,function(obj){
            			angular.forEach(vm.selectedCompanyList,function(company){
            				if(obj.id == company.id){
            					company.checked = false;
            				}
            			});
            		});
            		var tempSelected = [];
            		angular.forEach(vm.selectedCompanyList,function(obj){
            			if(obj.checked){
            				tempSelected.push(obj);
            			}
            		});
            		vm.selectedCompanyList = tempSelected;
            	}
	        }
	        
	        $scope.checkOne = function (item,data) {
	        	 item.checked = !item.checked;
	             if (data && data.data) {
	                 data.checked = data.data.every(function (v) {
	                     return v.checked;
	                 });
	             }
	            if(item.checked){ //如果是勾选，直接末尾加入
	            	item.companyId = item.id;
	            	vm.selectedCompanyList.push(item);
	            }else{//如果是取消
	            	var tempList = [];
	            	angular.forEach(vm.selectedCompanyList,function(data,index,array){
	            		if(array[index].id == item.id){
	            			vm.selectedCompanyList.splice(index,1);
	            		}
	            	});
	            }
	        }
	        vm.delCompany = function(company,data){
	        	angular.forEach(vm.selectedCompanyList,function(data,index,array){
	        		if(array[index].id == company.id){
	        			vm.selectedCompanyList.splice(index,1);
	        			company.checked = false;
	        		}
	        	});
	        	updateCompanyListCheckStatus(data);
	        }
	        
	        $scope.find();
	        vm.save = function(pageModel){
	        	var nameList = [];
	        	var idList = [];
	        	var putDomainCompanyList = [];
	        	angular.forEach(vm.selectedCompanyList,function(obj){
        			nameList.push(obj.companyName);
        			idList.push(obj.id);
        			putDomainCompanyList.push({'companyId':obj.companyId});
	        	});
	        	var param = {'nameList':nameList,'idList':idList,'selectedList':vm.selectedCompanyList};
	        	$uibModalInstance.close(param);
	        }
	        
	    });
	app.controller('associatedCompanyCtrl',function($scope, $http, $state,$uibModalInstance, $uibModal, $filter, fac,param){
    	var vm =  $scope.vm = this;
    	$scope.pageModel = {};
    	vm.product = param;
    	var companyIds = '';
    	var companyIdList = [];
    	var nameList = [];
    	var companyIdsList = [];
    	var transforCompanyName = function(companyList){
          	angular.forEach(companyList,function(obj){
          		nameList.push(obj.companyName);
          		obj.id = obj.companyId;
          		companyIdsList.push(obj.companyId);
          		companyIdList.push({'companyId':obj.companyId,'id':obj.companyId});
          	});
          	return {'companyIdList':companyIdList,'nameList':nameList,'companyIdsList':companyIdsList};
        }
    	var companyData = transforCompanyName(vm.product.companyData);
    	
    	companyIds = companyData.companyIdsList.toString();
    	
    	if(companyData.nameList.length >0){
    		vm.product.domainCompanyNameList = companyData.nameList;
    		vm.product.domainCompanyNameStr = companyData.nameList.toString();
    	}else{
    		vm.product.domainCompanyNameStr = '';
    		vm.product.domainCompanyNameList = [];
    	}
    
        vm.cancel = function(){
            $uibModalInstance.dismiss('cancel');
        };
        vm.selectEnterprise = function(){
        	var param = {'originCompanyList':angular.copy(vm.product.companyData?vm.product.companyData:[]),'id':vm.product.id};
        	var modal = $uibModal.open({
                animation: false,
                size:'industryEdit',
                templateUrl: '/view/productDatabase/industryDataList/modal.enterpriseList.html',
                controller: 'enterpriseSelectCtrl',
                resolve: {
                    param:param
                }
        	
            });
            modal.result.then(function (data) {
            	vm.product.domainCompanyNameStr= data.nameList.toString();
            	vm.product.domainCompanyNameList = data.nameList;
            	companyIds = data.idList.toString();
            	vm.product.companyData = data.selectedList;
            }, function () {
                console.info('Modal dismissed at: ' + new Date());
            });
        }
        vm.save = function(form){
        	form.$setSubmitted(true);
	   		 if (!form.$valid) {
	                return;
	            } 
	   		var params = {'companyId':companyIds,'industryProductCode':vm.product.id};
    		$.post('/ovu-park/backstage/supplychain/raletion/saveByProductCode', params, function(resp){
    			 if (resp.code == 0) {
                     $uibModalInstance.close();
                     msg("保存成功！");
                 } else {
                     alert(resp.message);
                 }
            });
        }
        
        vm.deleteAll = function(){
        	 confirm("确认删除所有企业吗?", function () {
        		 companyIds = '';
        		 companyIdList = [];
        		 companyIdsList = [];
        		 vm.product.domainCompanyList = '';
				 vm.product.companyData  = '';
				 $scope.$apply(function () {
					vm.product.domainCompanyNameStr = '';
				});
				
				
             });
        }
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
})()