 (function() {
    var app = angular.module("angularApp");
    //项目架构ctl
    app.controller('certificateMgmtIndexCtrl', function ($scope, $rootScope, $http, $filter, $uibModal, fac) {
    	document.title ="OVU-企业认证管理";
        angular.extend($rootScope,fac.dicts);
        $scope.search = {};
        $scope.pageModel = {};
       
        //查询
        $scope.find = function(pageNo){
            $.extend($scope.search,{currentPage:pageNo||$scope.pageModel.currentPage||1,pageSize:$scope.pageModel.pageSize||10});
            $scope.search.pageIndex = $scope.search.currentPage-1;
            $scope.search.totalCount = $scope.pageModel.totalCount||0;
            fac.getPageResult("/ovu-base/ovupark/backstage/customer/listConfirmInfos", $scope.search, function(data){
                $scope.pageModel = data;
            });
        } 
        
        app.modulePromiss.then(function() {
            fac.initPage($scope,function(){
            	$scope.find(1);
            })
        });
        $scope.query = function(){
        	fac.initPage($scope,function(){
            	$scope.find(1);
            })
        }
        $scope.showConfirmModal = function(company){
            var copy = angular.extend({},company);
            var modal = $uibModal.open({
                animation: false,
                templateUrl: '/view/customerMgmt/certificateMgmt/modal.confirm.html',
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
        if($scope.item && $scope.item.companyBo.businessLicenseImg){
        	$scope.businessLicenseImg.push($scope.item.companyBo.businessLicenseImg);
        }
        if($scope.item && $scope.item.companyBo.taxRegCertificateImg){
        	$scope.taxRegCertificateImg.push($scope.item.companyBo.taxRegCertificateImg);
        }
        
        $scope.setConfirmStatus = function(status){
        	$scope.confirmStatus = status;
        	
        };
        
        $scope.confirmCompany = function (item) {
            
        	if(!item.confirmStatus || item.confirmStatus == '0'){
        		window.alert("请勾选审核状态!");
        		return false;
            }
            if(!item.confirmOpinion){
                window.alert("请填写审核意见!");
        		return false;
            }
            item.confirmUser = app.user.id;
            // item.confirmStatus == 1通过  ； 2 拒绝
            var param={
                id:item.id,
                confirmStatus:item.confirmStatus,
                content :item.confirmOpinion,
                cid:item.parkUserId
            }
        	$.post("/ovu-park/backstage/customer/approveConfirm", param, function (resp) {
                if (resp.code == 0) {
                    window.msg("审核成功!");
                    $uibModalInstance.close();
                    if(item.confirmStatus==1){
                        $.post("/ovu-park/web/index/integral/allotAccount", {parkUserId:item.parkUserId},function(){
                            debugger;
                        });
                    }
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