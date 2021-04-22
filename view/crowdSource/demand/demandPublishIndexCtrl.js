(function() {
    var app = angular.module("angularApp");
    app.controller('demandPublishCtl', function ($scope, $rootScope, $http, $filter, $uibModal, fac) {
    	angular.extend($rootScope,fac.dicts);
    	document.title ="OVU-发布管理";
        $scope.search = {"dataStatus":1};
        $scope.industryModel = {};
        $scope.budgetList = ['','1万以下','1~10万','10万~50万','50万~100万','100万以上'];//获取对应的预算
        $scope.pageModel = {};
        $scope.currentNum = 3;
        //fac.loadSelect($scope, "INDUSTRY");
        $http.post("/ovu-base/ovupark/web/industry/queryIndustryList", { grade: 1}, fac.postConfig).success(function (resp) {
            if (resp.code == 0) {
                $scope.industryList = resp.data;
            }
        });
        $scope.find = function(pageNo){
            $.extend($scope.search,{currentPage:pageNo||$scope.pageModel.currentPage||1, pageSize:$scope.pageModel.pageSize||10});
            $scope.search.pageIndex = $scope.search.currentPage-1;
            $scope.search.totalCount = $scope.pageModel.totalCount||0;
            $scope.search.demandStatus = "2,3,4,5,6,7";//默认全部
            fac.getPageResult("/ovu-park/backstage/crowdSource/demand/listDemandByStatus", $scope.search, function(data){
                $scope.pageModel = data;
                angular.forEach($scope.pageModel.data,function(obj){
              		 angular.forEach($scope.industryList,function(industryObj){
              			 if(obj.industry == industryObj.industryCode){
              				 obj.industryName = industryObj.industryName;
              			 }
              		 });
              	 });
            });
        };

        /**
         * 设置标题
         */
        $scope.convertTitle = function(title){
        	if(fac.isEmpty(title)){
        		title = '--';
        	}else{
        		if(title.length > 16){
                    title = title.substring(0, 16) + "...";
                }
        	}
        	return title;
        }
        /**
         * 转换状态数字
         */
        $scope.convertStatusType = function(auditingStatus){
            if(auditingStatus == "-1"){
                return "待审核";
            } else if(auditingStatus == "0"){
                return "已拒绝";
            }else if(auditingStatus == "1"){
                return "已通过";
            }else {
            	return "--"
            }
        }

        /**
         * 选择需求状态
         */
        $scope.setCurrentNum = function(num){
        	if(num == 0){
        		$scope.search.auditingStatus = '-1';
        	}else if(num == 1){
        		$scope.search.auditingStatus = '1'
        	}else if(num == 2){
        		$scope.search.auditingStatus = '0'
        	}else if(num == 3){
        		$scope.search.demandStatus = "2,3,4,5,6,7";
        		delete $scope.search.auditingStatus;
        	}
            $scope.currentNum = num;
        	$scope.find(1);
        }


        $scope.showApproveModal = function (demand) {
        	demand = demand || {};
        	demand.updatorId = app.user.id;
        	//demand.industryName = demand.industryName;
            var copy = angular.extend({}, demand);
            var modal = $uibModal.open({
            	animation:true,
                size: 'lg',
                templateUrl: '/view/crowdSource/demand/modal.approveDemand.html',
                controller: 'approveDemandCtrl',
                resolve: {demand: copy},
                backdrop: 'static',
                keyboard: false
            })
            modal.result.then(function(data) {
                if(data&&data.status){
                    $scope.find(1);
                }
            }, function(reason) {});


        };
        $scope.find();
    });

    app.controller('approveDemandCtrl',function($scope, $http, $uibModalInstance, $filter, fac, demand, $uibModal){
        $scope.item = demand;
        $scope.statusItem = {
        		"id": $scope.item.id,
        		"updatorId": $scope.item.updatorId
        		};

       // 需求解决方式
        $scope.allSolution = [
            {name:'技术咨询',id:1},
            {name:'技术培训',id:2},
            {name:'方案设计',id:3},
            {name:'技术转让/许可',id:4},
            {name:'委托/合作开发',id:5},
            {name:'其他',id:6}
        ]

       // 换算需求解决方式
        $scope.solution = function (str) {
            var strs='';
            $scope.allSolution.forEach(function (park) {
                if(str.indexOf(park.id )!=-1){
                    strs +=park.name +',';
                }
            })
            strs = strs.slice(0,strs.length-1)
            return strs
        }

        /**
         * 审核
         */
        $scope.approve = function (status) {
        	if(status == "1"){
        		$scope.statusItem.demandStatus = "3";
        	}else{
        		$scope.statusItem.demandStatus = "7";
        	}
        	$scope.statusItem.auditingStatus = status;
        	$scope.statusItem.updatorId = app.user.ID;
            $.post("/ovu-park/backstage/crowdSource/demand/setDemandStatus", $scope.statusItem, function(resp){
                if(resp.code == 0){
                	window.msg("审核成功!");
                	$uibModalInstance.close({status:1});
                }else{
                	 window.alert(resp.message);
                }
            });
        }
        // 附件下载
        $scope.downLoad = function () {
            if (!$scope.item.filePath) {
                window.alert("无附件!");
                return false;
            }
            window.open($scope.item.filePath);
        }
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    });
})()
