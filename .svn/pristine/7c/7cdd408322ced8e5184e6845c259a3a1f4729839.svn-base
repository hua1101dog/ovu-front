/**
 * Created by Administrator on 2017/7/20.
 */
(function() {
    "use strict";
    var app = angular.module("angularApp");
    app.controller('jobCtrl', function($scope, $rootScope, $http, $filter, $uibModal, $timeout, fac) {
        document.title = "OVU-职位管理";
        $scope.pageModel = {};
        $scope.search = {};
        $scope.chekStatuses = [{
        	"text":"待审核",
        	"value":"0"
        },{
        	"text":"审核通过",
        	"value":"1"
        },{
        	"text":"审核不通过",
        	"value":"2"
        }];
        
        $scope.find = function(pageNo) {
            $.extend($scope.search, {
                currentPage: pageNo || $scope.pageModel.currentPage || 1,
                pageSize: $scope.pageModel.pageSize || 10
            });
            fac.getPageResult("/ovu-park/backstage/talentShare/job/list", $scope.search, function(data) {
                $scope.pageModel = data;
            });
        };
        
        $scope.find(1);
        $scope.showDescripInfo = function(item){
        	 var modal = $uibModal.open({
                 animation: false,
                 size: 'md',
                 templateUrl: '/view/talentShare/job/modal.showJobInfo.html',
                 controller: 'showJobInfoCtrl',
                 resolve: { jobInfo: item}
             });
             modal.result.then(function() {
                 $scope.find();
             }, function() {
                 console.info('Modal dismissed at: ' + new Date());
             });
        }
        $scope.showEditModal = function(item,checkState) {
        	if(checkState == 1){
        		confirm("确认审核通过吗?", function() {
        			var params = {'id':item.id,'checkDescribe':'','checkStatus':checkState};
	            	  $http.post("/ovu-park/backstage/talentShare/job/checkJob", params, fac.postConfig).success(function(resp) {
	                      if (resp.code == 0) {
	                          msg("操作成功！");
	                          $scope.find(1)
	                      } else {
	                          alert(resp.message);
	                      }
	                  })
                });
        	}else if(checkState == 2){
        		confirm("确认审核不通过吗?", function() {
        			var params = {'id':item.id,'checkDescribe':'','checkStatus':checkState};
	            	  $http.post("/ovu-park/backstage/talentShare/job/checkJob", params, fac.postConfig).success(function(resp) {
	                      if (resp.code == 0) {
	                          msg("操作成功！");
	                          $scope.find(1)
	                      } else {
	                          alert(resp.message);
	                      }
	                  })
                });
        	}
        };
    });
    app.controller('showJobInfoCtrl', function($scope, $rootScope, $http, $uibModalInstance, $filter, fac, jobInfo) {
    	$scope.jobInfo = jobInfo;
        $scope.cancel = function() {
            $uibModalInstance.dismiss('cancel');
        };
    });
})();
