(function() {
	var app = angular.module("angularApp");
	app.controller('statisticsIndexCtrl', function($stateParams,$scope, $rootScope, $http, $state,
			$filter, $uibModal, fac) {
		 angular.extend($rootScope,fac.dicts);
		document.title = "OVU-数据统计";
	 	var vm =  $scope.vm = this;
	 	vm.showAllCategoryName = true;
	 	vm.showAllIndustryName = true;
	 	vm.showAllProvince = true;
	 	vm.statistics = {};
	 	vm.statistics.companyCount = 0;
	 	vm.statistics.companyCountShow = false;
	 	vm.statistics.relationStatus = '';
	 	vm.statistics.regCityCode = '';
	 	vm.statistics.regProvinceCode = '';
	 	vm.statistics.parkareaStatus = '';
        $scope.pageModel = {};
        var param = {};
        vm.enterprise = {};
        if(!fac.isEmpty($stateParams.params)){
        	vm.search.id = $stateParams.params;
	 	}
        vm.parkareaStatusList = [{'name':'全部','value':''},
              					{'name':'中电产业园内','value':'1'},
              					{'name':'中电产业园外','value':'2'}
              					];
        
        vm.relationStatusList = [{'name':'全部','value':''},
                                 {'name':'上游','value':'0'},
             					{'name':'中游','value':'1'},
             					{'name':'下游','value':'2'},
             					{'name':'无','value':'-1'}
                             ];
        vm.getIndustryCategoryNameList=function(typeName,obj){
        	vm.domainRelationList = [];
        	vm.statistics.chainSupplyId = '';
        	vm.statistics.chainSupplyName = '';
        	var typeName = typeName;
        	if(typeName == 'init'){
        		vm.statistics.chainDomainCode = 'A';
        	}else if('select'){
        		vm.statistics.chainDomainCode = obj[1];
        	}
        	var params = {'chainDomainCode':vm.statistics.chainDomainCode};
        	$.post('/ovu-park/backstage/supplychain/industrySupply/getChainDomainBySupply',params, function(resp){
        		if(resp.code == 0){
        			vm.industryCategoryNameList = resp.data;
        			if(vm.industryCategoryNameList.length > 0){
        				vm.statistics.companyCountShow = true;
        				vm.getCompanyNum(vm.industryCategoryNameList[0]);
        				if(typeName == 'init'){
        					vm.getDomainCategory('init',{'name':'全部','value':''});
        				}else if(typeName == 'select'){
        					vm.getDomainCategory(vm.statistics);
        				}
        			}else{
        				vm.statistics.companyCountShow = false;
        			}
        			$scope.$apply();
        		}
            });
        }
        vm.getCompanyNum = function(obj){
        		vm.statistics.chainSupplyName = obj.chainSupplyName;
            	vm.statistics.chainSupplyId = obj.chainSupplyId;
        	var params = {'chainSupplyCode':vm.statistics.chainSupplyId};
        	$.post('/ovu-park/backstage/supplychain/dataReport/getCompanyNum',params, function(resp){
        		if(resp.code == 0){
        			vm.statistics.companyCount= resp.data.companyCount;
        			$scope.$apply();	
        		}
            });
        }
        
        vm.getDomainCategory = function(typeName){
        	var typeName = typeName;
        	if(!fac.isEmpty(vm.statistics.chainSupplyId)){
        		var params = {'chainSupplyCode':vm.statistics.chainSupplyId,'relationStatus':vm.statistics.relationStatus};
            	$.post('/ovu-park/backstage/supplychain/dataReport/getDomainCategoryByList',params, function(resp){
            		if(resp.code == 0){
            			if(resp.data.length > 0){
            				vm.domainRelationList = resp.data;
            				//产业链名称的对象默认选择第一个
            				vm.statistics.industryCategoryCode = vm.domainRelationList[0].industryCategoryCode;
            				vm.statistics.industryCategoryName = vm.domainRelationList[0].industryCategoryName;
            				$scope.find('1')
            			}
            			
            			$scope.$apply(); 	
            		}
                });
        	}
        }
        
        vm.getDomainCategoryBychainSupplyId = function(obj,chainSupplyObj){
        	var params = {'chainSupplyCode':chainSupplyObj.chainSupplyId,'relationStatus':obj.relationStatus};
        	$.post('/ovu-park/backstage/supplychain/dataReport/getDomainCategoryByList',params, function(resp){
        		if(resp.code == 0){
        			vm.domainRelationList = resp.data;
        			$scope.$apply(); 	
        		}
            });
        }
        
        vm.showMoreCategoryName = function(typeName){
        	if(typeName == 'close'){
        		vm.showAllCategoryName = true;
        	}else if(typeName == 'open'){
        		vm.showAllCategoryName = false;
        	}
        }
        
        vm.showALLindustryName = function(typeName){
        	if(typeName == 'close'){
        		vm.showAllIndustryName = true;
        	}else if(typeName == 'open'){
        		vm.showAllIndustryName = false;
        	}
        }
        vm.showMoreProvince = function(typeName){
        	if(typeName == 'close'){
        		vm.showAllProvince = true;
        	}else if(typeName == 'open'){
        		vm.showAllProvince = false;
        	}
        }
        $scope.find = function(pageNo){
        	$.extend(vm.statistics,{currentPage:pageNo||$scope.pageModel.currentPage||1,pageSize:$scope.pageModel.pageSize||10});
        	vm.statistics.pageIndex = vm.statistics.currentPage-1;
        	vm.statistics.totalCount = $scope.pageModel.totalCount||0;
        		fac.getPageResult('/ovu-park/backstage/supplychain/dataReport/getDomainCompanyByGrid',vm.statistics, function(resp){
        			$scope.pageModel = resp;
        		});
        }
        vm.cities = [];
        vm.getCityList = function(code){
        	$.post('/ovu-park/backstage/supplychain/dataReport/getQtyCityByLists',{regCityCode:code}, function(resp){
        		if(resp.code == 0){
        			vm.cityList = resp.data;
        			if(vm.cityList.length > 0){
        				vm.queryCompanyListByArea(vm.cityList[0]);
        			}
        			$scope.$apply();
        		}
            });
        }
        vm.queryCompanyListByArea = function(obj){
        	vm.statistics.regCityCode = obj.cityCode;
        	vm.statistics.regCityName = obj.cityName;
           	if(!fac.isEmpty(vm.statistics.chainSupplyId)){
           		$scope.find('1');
           	}
        }
        vm.provinceList = [];
        vm.getProvinceList = function(){
        	$.post('/ovu-park/backstage/supplychain/dataReport/getQtyProvinceByLists',{regCityName:''}, function(resp){
        		if(resp.code == 0){
        			vm.provinceList = resp.data;
        		}
            });
        }
        
        vm.showIndustryChain = function(obj){
        	var param = angular.copy(vm.statistics);
        	param.companyCode = obj.companyCode;
            	var modal = $uibModal.open({
                    animation: false,
                    size:'sm',
                    templateUrl: '/view/productDatabase/dataStatistics/modal.industryChain.html',
                    controller: 'industryChainCtrl',
                    resolve: {
                        param: param
                    }
                });
        }
       // init
    	vm.getIndustryCategoryNameList('init');
    	/*$scope.find('1');*/
    	$scope.query = function(){
    		if(!fac.isEmpty(vm.statistics.chainSupplyId)){
           		$scope.find('1');
           	}
    	}
	});
	app.controller('industryChainCtrl',function($scope, $http, $uibModalInstance, $filter, fac, param){
    	var vm =  $scope.vm = this;
    	vm.chainSupplyName = param.chainSupplyName;
    	var params = {'chainSupplyCode':param.chainSupplyId,'companyCode':param.companyCode};
    	vm.getIndustryChainList = function(){
        	$.post('/ovu-park/backstage/supplychain/dataReport/listDomainRelationsByList',params, function(resp){
        		if(resp.code == 0){
        			vm.chainList = resp.data;
        			$scope.$apply();
        		}
            });
        }
        vm.cancel = function(){
            $uibModalInstance.dismiss('cancel');
        };
        
    });
})()