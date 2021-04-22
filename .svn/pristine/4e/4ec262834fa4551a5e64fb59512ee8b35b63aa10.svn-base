(function() {
    var app = angular.module("angularApp");
    app.controller('rentApplyCtrl', function ($scope, $rootScope, $http, $filter, $uibModal, $location, fac) {
    	document.title = "OVU-租赁申请"; 
    	$scope.search = {"contractSource":2};
    	 $scope.engageCount;
    	 $scope.status = [
    	            {value:"1",text:"已接洽"},
    	            {value:"0",text:"未接洽"}
    	 ]
    	 
    	 // 获取列表
         $scope.pageModel ={};
         $scope.find = function(pageNo){
 			$.extend($scope.search,{currentPage:pageNo||$scope.pageModel.currentPage||1,pageSize:$scope.pageModel.pageSize||10});
 			$scope.search.pageIndex = $scope.search.currentPage-1;
             $scope.search.totalCount = $scope.pageModel.totalCount||0;
             $scope.search.parkId = app.park.parkId;
 			 fac.getPageResult("/ovu-park/backstage/rental/contractApply/list", $scope.search,function(data){	
                 $scope.pageModel = data;
 			});
         };
 		//获取未接洽总数
         $scope.getEngageCount = function () {
 		    var param = {
 		        "parkId": app.park.parkId
 		    };
            $http.post("/ovu-park/backstage/rental/contractApply/engageCount",param,fac.postConfig).success(function(resp){
                $scope.engageCount = resp.data;
                $scope.$emit('to-main', $scope.engageCount);
            });
        }
 		// 查看合同
        $scope.lookAgreement = function(id){
            // $location.url('/rental/rentAgreement/lookAgreement');
            // $location.search({'id':id});
            $rootScope.target("rental/rentAgreementNew/lookAgreement", "预览合同", false, '', {'id':id}, "rental/rentAgreementNew/lookAgreement");
        }
 		// 接洽合同
        $scope.editContract = function(item){
        	$scope.engageCount = $scope.engageCount - 1;
        	$scope.$emit('to-main', $scope.engageCount);
            // $location.url('/rental/rentAgreement/addAgreement');
            // $location.search({"id":id});
            // $rootScope.target("rental/rentAgreement/addAgreement", "编辑合同", false, '', item)
            var param = {
            		"id":item.id,
            		"updatorId":app.user.personId,
            		"updatorName":app.user.nickname!=null?app.user.nickname:app.user.loginName
            }
            $http.post("/ovu-park/backstage/rental/contractApply/engageContract",param,fac.postConfig).success(function(resp){
            
            });
            let curId = {}
            if (item && item.id) {
                curId = item;
            }
            var modal = $uibModal.open({
                animation: false,
                size: 'lg',
                templateUrl: '/view/rental/rentAgreementNew/addAgreement.html',
                controller: 'addAgreementCtrl',
                resolve: {
                    curContractId: curId
                }
            });
            modal.result.then(function (data) {
                $scope.find();
            }, function () {
                $scope.find();
            });
        }
        app.modulePromiss.then(function () {
            fac.initPage($scope, function () {
                $scope.getEngageCount();
                $scope.search = { "contractSource": 2 };
                $scope.find();
            })
        });
 		
    });
    // 创建时间-格式化
    app.filter("formateDate", function () {
        return function (createTime) {
            var date = new Date(createTime);
            return date;
        }
    })
    // 接洽状态
    app.filter("contactStatus", function () {
    	return function (status) {
             switch (status) {
                 case 0:
                     return '未接洽';
                     break;
                 case 1:
                     return '已接洽';
                     break;
             }
         }
    })
})()
