 (function() {
    var app = angular.module("angularApp");
    //项目架构ctl
    app.controller('confirmContr', function ($scope, $rootScope, $http, $filter, $uibModal, fac) {
    	document.title ="OVU-企业认证管理";
        angular.extend($rootScope,fac.dicts);
        $scope.search = {};
        $scope.pageModel = {};
       
        //查询
        $scope.find = function(pageNo){
        	if(!app.park || !app.park.ID){
				window.msg("请先选择一个项目!");
				return false;
			}
        	$scope.search.PARK_ID = app.park.ID;
			
            $.extend($scope.search,{currentPage:pageNo||$scope.pageModel.currentPage||1,pageSize:$scope.pageModel.pageSize||10});
            $scope.search.pageIndex = $scope.search.currentPage-1;
            $scope.search.totalCount = $scope.pageModel.totalCount||0;
            //console.log($rootScope.search);
            fac.getPageResult("/ovu-base/ovupark/backstage/customer/listConfirmInfos", $scope.search, function(data){
            	console.info(data);
                $scope.pageModel = data;
            });
        } 
        
        app.modulePromiss.then(function() {
            fac.initPage($scope,function(){
            	$scope.find();
            })
        });
        
        $scope.showConfirmModal = function(company){
            var copy = angular.extend({},company);
            
            var modal = $uibModal.open({
                animation: false,
                templateUrl: '/view/parkCustomerManage/companyConfirm/modal.ConfirmCompany.html',
                controller: 'companyConfirmContr',
                resolve: {company: copy}
            });
            modal.result.then(function () {
                $scope.find();
            }, function () {
                console.info('Modal dismissed at: ' + new Date());
            });
        };
    });
    
    app.filter("confirmStatusFilter",function(){//转换认证状态
        return function(value) {
            if(value == "0"){
                return "待认证";
            }else if(value == "1"){
                return "通过";
            }else if(value == "2"){
                return "未通过";
            }else{
            	return "未知";
            }
        }
    });
    
    app.controller('companyConfirmContr', function($scope, $rootScope, $http, $uibModalInstance, $uibModal, $filter, fac, company) {
        $scope.item = company;   
        $scope.businessLicenseImg = [];
        $scope.taxRegCertificateImg = [];
        
        if($scope.item && $scope.item.BUSINESS_LICENSE_IMG){
        	$scope.businessLicenseImg = $scope.item.BUSINESS_LICENSE_IMG.split(",");
        }
        if($scope.item && $scope.item.TAX_REG_CERTIFICATE_IMG){
        	$scope.taxRegCertificateImg = $scope.item.TAX_REG_CERTIFICATE_IMG.split(",");
        }
        
        $scope.setConfirmStatus = function(status){
        	$scope.CONFIRM_STATUS = status;
        	
        };
        
        $scope.confirmCompany = function (item) {
        	if(!item.CONFIRM_STATUS || item.CONFIRM_STATUS == '0'){
        		window.alert("请勾选审核状态!");
        		return false;
        	}
        	
        	item.CONFIRM_USER = app.user.ID;
        	$.post("/ovu-base/ovupark/backstage/customer/approveConfirm", item, function (resp) {
                if (resp.code) {
                    window.msg("审核成功!");
                	$uibModalInstance.close();
                } else {
                	window.alert(resp.message);
                }
                
            });
        }
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };              
    });
        
})()