(function() {
	var app = angular.module("angularApp");
	app.controller('questionnaireCtl', function ($scope, $rootScope, $http, $filter, $uibModal, $state, fac) {
		document.title ="OVU-问卷管理";
		angular.extend($rootScope,fac.dicts);
		$scope.currentNum = 3;
		$scope.search = {};
		$scope.pageModel = {};

		$scope.find = function(pageNo){
			$.extend($scope.search, {currentPage:pageNo||$scope.pageModel.currentPage||1,pageSize:$scope.pageModel.pageSize||10});
			$scope.search.pageIndex = $scope.search.currentPage-1;
			$scope.search.totalCount = $scope.pageModel.totalCount||0;
			if($("#search_date1").val()){
				$scope.search.fromCreateTime = $("#search_date1").val() + " 00:00:00";
			}else{
				delete $scope.search.fromCreateTime;
			}
			if($("#search_date2").val()){
				$scope.search.toCreateTime = $("#search_date2").val() + " 23:59:59";
			}else{
				delete $scope.search.toCreateTime;
			}
			fac.getPageResult("/ovu-park/backstage/questionnaire/list",$scope.search,function(data){		
				$scope.pageModel = data;
			});
		};										
		
		app.modulePromiss.then(function() {
            fac.initPage($scope,function(){
            	$scope.find(1);
            })
        });
		 $scope.query = function(){
	        	fac.initPage($scope, function () {
	                $scope.find(1);
	            })
	        }
		//设置问卷状态
		$scope.setCurrentNum=function(num){
			$scope.currentNum = num;
			if(num != 3){
				$scope.search.naireStatus = num + "";
			}else{
				delete $scope.search.naireStatus;
			}
			
			$scope.find(1);
		}
		
		//删除问卷信息
		$scope.delItem = function(questionnaire){
			confirm("确定删除问卷 ["+questionnaire.title+"]?",function(){
				$.post("/ovu-park/backstage/questionnaire/remove", {ids: questionnaire.id},function(resp){
					if(resp.code == .0){
						window.msg("删除成功!");
						$scope.find();
					}else{
						window.alert(resp.message);
					}
				});
			});
		};
		
		//修改问卷状态
		$scope.updateItem = function(id, status){
			$.post("/ovu-park/backstage/questionnaire/setNaireStatus",{id : id, naireStatus : status, updatorId : app.user.ID},function(resp){
				if(resp.code == 0){
					window.msg("操作成功!");
					$scope.find();
				}else{
					window.alert(resp.message);
				}
			});
		};
		
		$scope.optItem = function(questionnaire, type, status){
			if(type == 'del'){//删除
				$scope.delItem(questionnaire);
			}else if(type == 'questions'){//题目管理
				$('li[alt="问卷管理"]', '.leftDiv').removeClass("active");
				$('li[alt="题目管理"]', '.leftDiv').addClass("active");
				
				app.naireId = questionnaire.id;
				// $state.go('three', { folder: "questionAssistant", catalogue: "problemManage", page: "problemIndex" });
				$rootScope.target("questionAssistant/problemManage/problemIndex", "题目管理", false, '', { }, "questionAssistant/problemManage/problemIndex");
			}else{//发布,停止
				if(type == "publish"){//TODO 发布, 检测有效时间是否合理
					var curDate = new Date().format("yyyy-MM-dd");
					if(questionnaire.beginTime < curDate){
						window.alert("问卷有效期开始时间["+questionnaire.beginTime+"]早于今日["+curDate+"], 请重新设置有效期!");
						return false;
					}
					$.post("/ovu-park/backstage/questionnaire/getInfosById", {id : questionnaire.id}, function(resp){
						if(resp.code == 0){
							if(!resp.data || !resp.data.questionItems || resp.data.questionItems.length == 0){
								window.alert("发布前, 请先给问卷至少完成一个题目!");
								return false;
							}
							
							$scope.updateItem(questionnaire.id, status);
						}else{
							window.alert("获取待发布问卷信息失败!");
						}
					});
					
				}else{
					$scope.updateItem(questionnaire.id, status);
				}
				
			}
		};
		
		$scope.showEditModal = function (questionnaire) {
			if(!app.park){
				window.msg("请先选择一个项目!");
				return false;
			}
			questionnaire = questionnaire || {creatorId : app.user.ID, updatorId : app.user.ID};
			questionnaire.parkId = app.park.parkId;
			questionnaire.updatorId = app.user.id;
			
			var copy = angular.extend({},questionnaire);
			var modal = $uibModal.open({
				animation: false,
				size: 'lg',
				templateUrl: '/view/questionAssistant/questionManage/modal.editQuestionnaire.html',
				controller: 'editQuestionnaireCtrl',
				resolve: {questionnaire: copy},
				backdrop: 'static', 
				keyboard: false
			});
			modal.rendered.then(function(){
				console.log("Modal EditQuestionnaire rendered");
			});
			modal.result.then(function () {
				$scope.find();
			}, function () {
				console.info('Modal EditQuestionnaire dismissed at: ' + new Date());
			});
		};	
		
		$scope.showPreviewModal = function (questionnaire) {
			questionnaire = questionnaire || {};
			var copy = angular.extend({},questionnaire);
			
			var modal = $uibModal.open({
				animation: false,
				size: 'lg',
				templateUrl: '/view/questionAssistant/questionManage/modal.previewQuestionnaire.html',
				controller: 'previewQuestionnaireCtrl',
				resolve: {questionnaire: copy},
				backdrop: 'static', 
				keyboard: false
			});
			modal.rendered.then(function(){
				console.log("Modal PreviewQuestionnaire rendered");
			});
			modal.result.then(function () {
				$scope.find();
			}, function () {
				console.info('Modal PreviewQuestionnaire dismissed at: ' + new Date());
			});
		};
		
		$scope.showStatisticsModal = function (questionnaire) {
			questionnaire = questionnaire || {};		
			var um;
			var copy = angular.extend({},questionnaire);
			var modal = $uibModal.open({
				animation: false,
				size: 'lg',
				templateUrl: '/view/questionAssistant/questionManage/modal.statisticsQuestionnaire.html',
				controller: 'statisticsQuestionnaireCtrl'
				, resolve: {questionnaire: copy},
				backdrop: 'static', 
				keyboard: false
			});
			modal.rendered.then(function(){
				console.log("Modal StatisticsQuestionnaire rendered");
			});
			modal.result.then(function () {
				$scope.find();
			}, function () {
				console.info('Modal StatisticsQuestionnaire dismissed at: ' + new Date());
			});
		};
		
	});	
	
	app.filter("convertStatusType",function(){//转换问卷状态数字
		return function(item) {
			var value = item.naireStatus;
			if(value == "0"){
				return "草稿";
			} else if(value == "1"){
				var curDate = new Date().format("yyyy-MM-dd");
				
				if(item.END_TIME < curDate){
					return "运行中(已失效)";
				}else{
					return "运行中";
				}
			} else if(value == "2"){
				return "结束";
			}else {
				return "--";
			}
	    }
    });
	
	app.filter("convertTitle",function(){//转换标题
		 return function(title) {
	        	if(angular.isUndefined(title) || title == ''){
	        		title = '--';
	        	}else{
	        		if(title.length > 16){
	                    title = title.substring(0, 16) + "...";
	                }
	        	}
	            return title;
	        }
    });
	
	app.controller('editQuestionnaireCtrl',function($scope, $http, $uibModalInstance, $filter, fac, questionnaire, $uibModal){
		$scope.item = questionnaire;
		$scope.saveQuestionnaire = function (form, item, event) {
			//按钮禁用
			if($(event.target).attr("disabled")){
				return false;
			}
			form.$setSubmitted(true);
			if (!form.$valid) {
				return false;
			}
			if(! $("#naire_date1").val() || !$("#naire_date2").val()){
				window.msg("请完成有效日期!");
				return false;
			}
			
			$(event.target).attr("disabled", "disabled");
			
			item.beginTime = $("#naire_date1").val();
			item.endTime = $("#naire_date2").val();
			$.post("/ovu-park/backstage/questionnaire/saveOrEdit", item, function(resp){
				if(resp.code == 0){
					window.msg("操作成功!");
					$uibModalInstance.close();
				}else{
					window.alert(resp.message);
				}
			});
		}
		$scope.cancel = function () {
			$uibModalInstance.dismiss('cancel');
		};	
	});
	
	app.controller('previewQuestionnaireCtrl',function($scope, $http, $uibModalInstance, $filter, fac, questionnaire, $uibModal){
		//$scope.item = questionnaire;
		
		$scope.find = function(){
			$.post("/ovu-park/backstage/questionnaire/getInfosById", {id : questionnaire.id}, function(resp){
				if(resp.code == 0){
					$scope.item = resp.data;
					$scope.$apply();
				}else{
					window.alert(resp.message);
				}
			});
		};
		
		app.modulePromiss.then(function() {
            fac.initPage($scope,function(){
            	$scope.find();
            })
        });
		
		$scope.cancel = function () {
			$uibModalInstance.dismiss('cancel');
		};	
	});
	
	app.controller('statisticsQuestionnaireCtrl',function($scope, $http, $uibModalInstance, $filter, fac,questionnaire, $uibModal){
		//$scope.item = questionnaire;
		$scope.find = function(){
			$.post("/ovu-park/backstage/questionnaire/getInfosById", {id : questionnaire.id}, function(resp){
				if(resp.code == 0){
					$scope.item = resp.data;
					$scope.$apply();
				}else{
					window.alert(resp.message);
				}
			});
		};
		
		app.modulePromiss.then(function() {
            fac.initPage($scope,function(){
            	$scope.find();
            })
        });
		
		$scope.cancel = function () {
			$uibModalInstance.dismiss('cancel');
		};	
	});
	/*
	app.filter("convertStatusType",function(){//转换问卷人数百分比
		return function(item) {
			
			return Math.round((option.COUNT_CHOICE / item.questionNaire.COUNT_JOIN) * 100*100)/100;
	    }
    });
	*/
	//angular.bootstrap(document.getElementById("questionnaireId"), ['angularApp']);
})()