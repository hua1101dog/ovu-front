(function() {
    var app = angular.module("angularApp");
    app.controller('collectionCtrl',function ($scope, $rootScope, $http, $filter, $uibModal, fac) {
    	document.title ="OVU-企业数据库";
        angular.extend($rootScope,fac.dicts);
        $scope.search = {};
        $scope.pageModel = {};
        fac.loadSelect($scope, "ENTERPRISE_SIZE");
        fac.loadSelect($scope, "ENTERPRISE_NATURE");
        $scope.find = function(pageNo){
            $.extend($scope.search,{currentPage:pageNo||$scope.pageModel.currentPage||1,pageSize:$scope.pageModel.pageSize||10});
            $scope.search.pageIndex = $scope.search.currentPage-1;
            $scope.search.totalCount = $scope.pageModel.totalCount||0;
            fac.getPageResult("/ovu-park/backstage/companyData/company/list",$scope.search,function(data){
                $scope.pageModel = data;
            });
        };
        /* 获取行业数据 */
		$scope.getIndustries = function(){
			var url = '/ovu-park/backstage/companyData/industry/list?level=0';
			$http({
			    method: 'GET',
			    url: url
			}).then(function successCallback(response) {				        
			        $scope.industryList = response.data.data;
			        console.log($scope.industryList)
			    }, function errorCallback(response) {
			      
			});
		}
    	$scope.find();
    	$scope.getIndustries();
        $scope.query = function(){
           $scope.find(1);
        }
        //展示详情
        $scope.showLookModal = function (company) {
        	company = company ||angular.extend({},$scope.search);
            var um;
            var copy = angular.extend({},company);
            $rootScope.company=copy;
            var modal = $uibModal.open({
                animation: false,
                size: 'lg',
                backdrop: 'static',
                keyboard: true,
                templateUrl:'/view/dataCollection/companyDatabase/modal.showDetails.html',
                controller: 'lookNoticeCtrl'
                , resolve: {company: copy}
            });
            modal.result.then(function () {
                $scope.find();
            }, function () {
                // console.info('Modal dismissed at: ' + new Date());
            });
            modal.rendered.then(function(){
                if(company.content){
                    $(".showcompany").html(company.content);
                }
            });
        };
    });
    
   
    app.filter("convertCompanyType",function(){//转换企业类型
        return function(value) {
            if(value == 0){
                return "外资（欧美）";
            } else if(value == 1){
                return "外资（非欧美）";
            } else if(value == 2){
                return "合资";
            } else if(value == 3){
                return "国企";
            } else if(value == 4){
                return "民营公司";
            } else if(value == 5){
                return "外企代表处";
            } else if(value == 6){
                return "非营利机构";
            } else if(value == 7){
                return "事业单位";
            } else if(value == 8){
                return "政府企业";
            } else {
                return "--";
            }
        }
    });
    
    app.filter("convertCompanyStatus",function(){//转换企业状态
        return function(value) {
            if(value == 0){
                return "在业";
            } else if(value == 1){
                return "存续";
            } else if(value == 2){
                return "吊销";
            } else if(value == 3){
                return "注销";
            } else if(value == 4){
                return "迁出";
            } else {
                return "--";
            }
        }
    });
    
    app.filter("convertOwnership",function(){//转换所属关系
    	return function(value) {
    		if(value == 0){
    			return "分公司";
    		} else if(value == 1){
    			return "子公司";
    		} else if(value == 2){
    			return "办事处";
    		} else if(value == 3){
    			return "研发中心";
    		} else {
    			return "--";
    		}
    	}
    });
    
    app.filter("convertCorporateSize",function(){//转换企业规模
    	return function(value) {
    		if(value == 0){
    			return "50-100人";
    		} else if(value == 1){
    			return "100-200人";
    		} else if(value == 2){
    			return "200-500人";
    		} else if(value == 3){
    			return "500-1000人";
    		} else if(value == 4){
    			return "1000人以上";
    		} else {
    			return "--";
    		}
    	}
    });
    
    app.filter("convertEstablishedTime",function(){//转换成立时间
    	return function(value) {
    		if(value == 0){
    			return "成立1年以内";
    		} else if(value == 1){
    			return "成立1-5年";
    		} else if(value == 2){
    			return "成立5-10年";
    		} else if(value == 3){
    			return "成立10-15年";
    		} else if(value == 4){
    			return "成立15年以上";
    		} else {
    			return "--";
    		}
    	}
    });

    app.controller('lookNoticeCtrl',function($scope, $rootScope, $http, $uibModalInstance, $filter, fac,company, $uibModal){
    	$rootScope.company = company;
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    });
    
    //公司基本信息
    app.controller('background1',function ($scope, $rootScope, $http, $filter, $uibModal, fac) {
    	$scope.company=$rootScope.company;
        angular.extend($rootScope,fac.dicts);
        $scope.search = {};
        $scope.item = {};

        
        $scope.getInfos = function(){
        	$.post("/ovu-park/backstage/companyData/company/getById", {id: $scope.company.id}, function(data){
           	 	if (data.code == 0) {
           	 		$scope.item = data.data;
				}
           });
        }
        $scope.getInfos();
        
        $scope.showCorStr = function() {
        	var copy = $rootScope.company;
        	var modal = $uibModal.open({
                animation: false,
                size: 'lg',
                backdrop: 'static',
                keyboard: true,
                templateUrl:'/view/dataCollection/companyDatabase/modal.showCorStu.html',
                controller:'corStuCtr',
                resolve: {company: copy}
            });
            modal.result.then(function () {
            	
            }, function () {
                // console.info('Modal dismissed at: ' + new Date());
            });
            modal.rendered.then(function(){
            });
        }
        
    });
    //企业组织架构详情
    app.controller('corStuCtr',function($scope, $rootScope, $http, $uibModalInstance, $filter, fac,company, $uibModal){
    	$scope.company = company;

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    });
    //主要人员
    app.controller('background2',function ($scope, $rootScope, $http, $filter, $uibModal, fac) {
    	$scope.company=$rootScope.company;
        angular.extend($rootScope,fac.dicts);
        $scope.search = {};
        $scope.search.cid = $scope.company.id;
        $scope.pageModel = {};

    	$scope.find = function(pageNo){
            $.extend($scope.search,{currentPage:pageNo||$scope.pageModel.currentPage||1,pageSize:$scope.pageModel.pageSize||10});
            $scope.search.pageIndex = $scope.search.currentPage-1;
            $scope.search.totalCount = $scope.pageModel.totalCount||0;
            fac.getPageResult("/ovu-park/backstage/companyData/stuff/list",$scope.search,function(data){
                $scope.pageModel = data;
            });
        };
        $scope.find();
    });
    
    //股东信息
    app.controller('background3',function ($scope, $rootScope, $http, $filter, $uibModal, fac) {
    	$scope.company=$rootScope.company;
        angular.extend($rootScope,fac.dicts);
        $scope.search = {};
        $scope.search.cid = $scope.company.id;
        $scope.pageModel = {};

    	$scope.find = function(pageNo){
            $.extend($scope.search,{currentPage:pageNo||$scope.pageModel.currentPage||1,pageSize:$scope.pageModel.pageSize||10});
            $scope.search.pageIndex = $scope.search.currentPage-1;
            $scope.search.totalCount = $scope.pageModel.totalCount||0;
            fac.getPageResult("/ovu-park/backstage/companyData/shareholder/list",$scope.search,function(data){
                $scope.pageModel = data;
            });
        };
        
      $scope.find();
    });
    
    //所属关系
    app.controller('background4',function ($scope, $rootScope, $http, $filter, $uibModal, fac) {
    	$scope.company=$rootScope.company;
        angular.extend($rootScope,fac.dicts);
        $scope.search = {};
        $scope.search.cid = $scope.company.id;
        $scope.pageModel = {};

    	$scope.find = function(pageNo){
            $.extend($scope.search,{currentPage:pageNo||$scope.pageModel.currentPage||1,pageSize:$scope.pageModel.pageSize||10});
            $scope.search.pageIndex = $scope.search.currentPage-1;
            $scope.search.totalCount = $scope.pageModel.totalCount||0;
            fac.getPageResult("/ovu-park/backstage/companyData/company/listParentCompany",$scope.search,function(data){
                $scope.pageModel = data;
            });
        };
        
       $scope.find();
    });
    
    //对外投资信息
    app.controller('background5',function ($scope, $rootScope, $http, $filter, $uibModal, fac) {
    	$scope.company=$rootScope.company;
        angular.extend($rootScope,fac.dicts);
        $scope.search = {};
        $scope.search.cid = $scope.company.id;
        $scope.pageModel = {};

    	$scope.find = function(pageNo){
            $.extend($scope.search,{currentPage:pageNo||$scope.pageModel.currentPage||1,pageSize:$scope.pageModel.pageSize||10});
            $scope.search.pageIndex = $scope.search.currentPage-1;
            $scope.search.totalCount = $scope.pageModel.totalCount||0;
            fac.getPageResult("/ovu-park/backstage/companyData/investmentAbroad/list",$scope.search,function(data){
                $scope.pageModel = data;
            });
        };
       $scope.find();
    });
    
    //变更记录
    app.controller('background6',function ($scope, $rootScope, $http, $filter, $uibModal, fac) {
    	$scope.company=$rootScope.company;
        angular.extend($rootScope,fac.dicts);
        $scope.search = {};
        $scope.search.cid = $scope.company.id;
        $scope.pageModel = {};

    	$scope.find = function(pageNo){
            $.extend($scope.search,{currentPage:pageNo||$scope.pageModel.currentPage||1,pageSize:$scope.pageModel.pageSize||10});
            $scope.search.pageIndex = $scope.search.currentPage-1;
            $scope.search.totalCount = $scope.pageModel.totalCount||0;
            fac.getPageResult("/ovu-park/backstage/companyData/changeHis/list",$scope.search,function(data){
                $scope.pageModel = data;
            });
        };
        
        $scope.find();
    });
    
    //融资历史
    app.controller('development1',function ($scope, $rootScope, $http, $filter, $uibModal, fac) {
    	$scope.company=$rootScope.company;
    	angular.extend($rootScope,fac.dicts);
    	$scope.search = {};
    	$scope.search.cid = $scope.company.id;
    	$scope.pageModel = {};
    	
    	$scope.find = function(pageNo){
    		$.extend($scope.search,{currentPage:pageNo||$scope.pageModel.currentPage||1,pageSize:$scope.pageModel.pageSize||10});
    		$scope.search.pageIndex = $scope.search.currentPage-1;
    		$scope.search.totalCount = $scope.pageModel.totalCount||0;
    		fac.getPageResult("/ovu-park/backstage/companyData/financingHis/list",$scope.search,function(data){
    			$scope.pageModel = data;
    		});
    	};
    	
    	$scope.find();
    });
    
    //企业业务
    app.controller('development2',function ($scope, $rootScope, $http, $filter, $uibModal, fac) {
    	$scope.company=$rootScope.company;
    	angular.extend($rootScope,fac.dicts);
    	$scope.search = {};
    	$scope.search.cid = $scope.company.id;
    	$scope.pageModel = {};
    	
    	$scope.find = function(pageNo){
    		$.extend($scope.search,{currentPage:pageNo||$scope.pageModel.currentPage||1,pageSize:$scope.pageModel.pageSize||10});
    		$scope.search.pageIndex = $scope.search.currentPage-1;
    		$scope.search.totalCount = $scope.pageModel.totalCount||0;
    		fac.getPageResult("/ovu-park/backstage/companyData/business/list",$scope.search,function(data){
    			$scope.pageModel = data;
    		});
    	};
    	
        $scope.find();
    });
    
    //投资事件
    app.controller('development3',function ($scope, $rootScope, $http, $filter, $uibModal, fac) {
    	$scope.company=$rootScope.company;
    	angular.extend($rootScope,fac.dicts);
    	$scope.search = {};
    	$scope.search.cid = $scope.company.id;
    	$scope.pageModel = {};
    	
    	$scope.find = function(pageNo){
    		$.extend($scope.search,{currentPage:pageNo||$scope.pageModel.currentPage||1,pageSize:$scope.pageModel.pageSize||10});
    		$scope.search.pageIndex = $scope.search.currentPage-1;
    		$scope.search.totalCount = $scope.pageModel.totalCount||0;
    		fac.getPageResult("/ovu-park/backstage/companyData/investmentHis/list",$scope.search,function(data){
    			$scope.pageModel = data;
    		});
    	};
    	
        $scope.find();
    });
    
    //招投标
    app.controller('information1',function ($scope, $rootScope, $http, $filter, $uibModal, fac) {
    	$scope.company=$rootScope.company;
    	angular.extend($rootScope,fac.dicts);
    	$scope.search = {};
    	$scope.search.cid = $scope.company.id;
    	$scope.pageModel = {};
    	
    	$scope.find = function(pageNo){
    		$.extend($scope.search,{currentPage:pageNo||$scope.pageModel.currentPage||1,pageSize:$scope.pageModel.pageSize||10});
    		$scope.search.pageIndex = $scope.search.currentPage-1;
    		$scope.search.totalCount = $scope.pageModel.totalCount||0;
    		fac.getPageResult("/ovu-park/backstage/companyData/bibInvitation/list",$scope.search,function(data){
    			$scope.pageModel = data;
    		});
    	};
    	
        $scope.find();
    });
    
    //招聘信息
    app.controller('information2',function ($scope, $rootScope, $http, $filter, $uibModal, fac) {
    	$scope.company=$rootScope.company;
    	angular.extend($rootScope,fac.dicts);
    	$scope.search = {};
    	$scope.search.cid = $scope.company.id;
    	$scope.pageModel = {};
    	
    	$scope.find = function(pageNo){
    		$.extend($scope.search,{currentPage:pageNo||$scope.pageModel.currentPage||1,pageSize:$scope.pageModel.pageSize||10});
    		$scope.search.pageIndex = $scope.search.currentPage-1;
    		$scope.search.totalCount = $scope.pageModel.totalCount||0;
    		fac.getPageResult("/ovu-park/backstage/companyData/recruit/list",$scope.search,function(data){
    			$scope.pageModel = data;
    		});
    	};
    	
        $scope.find();
    });
    
    //产品信息
    app.controller('information3',function ($scope, $rootScope, $http, $filter, $uibModal, fac) {
    	$scope.company=$rootScope.company;
    	angular.extend($rootScope,fac.dicts);
    	$scope.search = {};
    	$scope.search.cid = $scope.company.id;
    	$scope.pageModel = {};
    	
    	$scope.find = function(pageNo){
    		$.extend($scope.search,{currentPage:pageNo||$scope.pageModel.currentPage||1,pageSize:$scope.pageModel.pageSize||10});
    		$scope.search.pageIndex = $scope.search.currentPage-1;
    		$scope.search.totalCount = $scope.pageModel.totalCount||0;
    		fac.getPageResult("/ovu-park/backstage/companyData/product/list",$scope.search,function(data){
    			$scope.pageModel = data;
    		});
    	};
    	
       $scope.find();
    });
    
})()