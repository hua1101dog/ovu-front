(function() {
		var app = angular.module("angularApp");
		app.controller('questionsCtl', function ($scope, $rootScope, $http, $filter, $uibModal, fac) {		
			document.title ="OVU-题目管理";
			angular.extend($rootScope,fac.dicts);
			$scope.search = {};
			$scope.pageModel = {};
			
			if(app.naireId){
				$scope.search.questionnaireId = app.naireId;
				delete app.naireId;
			}
			
			$scope.initNaires = function(){
				$.post("/ovu-park/backstage/questionnaire/getAll", {naireStatus : "0", parkId : app.park.parkId}, function(resp){
					if(resp.code == 0){
						$scope.naireList = resp.data;
						$scope.$apply();
					}
				});
			}
			
			$scope.find = function(pageNo){
				$.extend($scope.search,{currentPage:pageNo||$scope.pageModel.currentPage||1,pageSize:$scope.pageModel.pageSize||10});
				$scope.search.pageIndex = $scope.search.currentPage-1;
				$scope.search.totalCount = $scope.pageModel.totalCount||0;
				fac.getPageResult("/ovu-park/backstage/question/list",$scope.search,function(data){		
					$scope.pageModel = data;
				});
			};										
			
			
			app.modulePromiss.then(function() {
	            fac.initPage($scope,function(){
	            	$scope.initNaires();
	            	$scope.find();
	            })
	        });
			 $scope.query = function(){
	        	fac.initPage($scope, function () {
	                $scope.find(1);
	            })
	        }
			
			//删除题目信息
			$scope.delItem = function(question){
				confirm("确定删除题目 ["+question.title+"]?",function(){
					$.post("/ovu-park/backstage/question/remove",{ids: question.id},function(resp){				
						if(resp.code == 0){
							window.msg("删除成功!");
							$scope.find(1);
						}else{
							window.alert(resp.message);
						}
					});
				})
			};
			
			//交换位置
			$scope.changeItems = function(exchangeInfo){
				$.post("/ovu-park/backstage/question/exchangePosition", {exchangeInfo : JSON.stringify(exchangeInfo)}, function(resp){
					if(resp.code == 0){
						window.msg("操作成功!");
						$scope.find(1);
					}else{
						window.alert(resp.message);
					} 
				});
			};
			
			$scope.optItem = function(question, type, event){
				if(type == 'del'){
					$scope.delItem(question);
				}else if(type == 'up' || type == 'down'){
					if(!$scope.search.questionnaireId){
						window.msg("请先选择一个问卷!");
						return false;
					}
					
					var cid = parseInt($(event.target).attr("data-cid"));
					if(cid == 0 && type == 'up'){
						window.msg("已经是第一个,不能上移!");
						return false;
					}
					if(cid == $scope.pageModel.data.length - 1 && type == 'down'){
						window.msg("已经是最后一个,不能下移!");
						return false;
					}
					
					if(type == 'up'){
						cid --;
					}else{
						cid ++;
					}
					
					var otherItem = $scope.pageModel.data[cid];
					var exchangeInfo = [
										{
											id : question.id,
											position : otherItem.position
										},
										{
											id : otherItem.id,
											position : question.position
										}
					                  ];
					$scope.changeItems(exchangeInfo);
				}
			};
			
			$scope.showEditModal = function (question) {
				//question = question || {QUESTIONNAIRE_ID : $scope.search.QUESTIONNAIRE_ID_EQ, TYPE : 'radio'};
				var q_info = {};
				if(!question){
					q_info = {
							questionnaireId : $scope.search.questionnaireId, 
							questionType : 'radio',
							optionItems : []
					};
				}else{
					q_info = question;
					q_info.optionItems = [];
				}
				
				if(!q_info.questionnaireId){
					window.msg("请先选择一个问卷!");
					return false;
				}
				var copy = angular.extend({}, q_info);
				
				var modal = $uibModal.open({
					animation: false,
					size: 'lg',
					templateUrl: '/view/questionAssistant/problemManage/modal.editQuestion.html',
					controller: 'editQuestionCtrl'
					, resolve: {q_info: copy},
					backdrop: 'static', 
					keyboard: false
				});
				modal.rendered.then(function(){
					console.log("Modal editQuestion rendered");
				});
				modal.result.then(function () {
					$scope.find();
				}, function () {
					console.info('Modal editQuestion dismissed at: ' + new Date());
				});
			};	
			
			$scope.showPreviewModal = function (question) {
				question = question || {};
				var copy = angular.extend({},question);
				
				var modal = $uibModal.open({
					animation: false,
					size: 'lg',
					templateUrl: '/view/questionAssistant/problemManage/modal.previewQuestion.html',
					controller: 'previewQuestionCtrl'
					, resolve: {question: copy},
					backdrop: 'static', 
					keyboard: false
				});
				modal.rendered.then(function(){
					console.log("Modal previewQuestion rendered");
				});
				modal.result.then(function () {
					$scope.find();
				}, function () {
					console.info('Modal previewQuestion dismissed at: ' + new Date());
				});
			};
			
			$scope.showPreviewNaireModal = function (questionnaire) {
				questionnaire = questionnaire || {id : $scope.search.questionnaireId};
				if(!questionnaire.id){
					window.msg("请先选择一个问卷!");
					return false;
				}
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
			
		});	
		
		app.filter("convertQuestionType",function(){//转换题目类型
			return function(value) {
				if(value == "checkbox"){
					return "多选题";
				} else if(value == "radio"){
					return "单选题";
				} else {
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
		
 		app.controller('editQuestionCtrl',function($scope, $http, $uibModalInstance, $filter, fac, q_info, $uibModal){
 			$scope.item = q_info;
 			
 			$scope.find = function(){
 				if(q_info.id){
 					$.post("/ovu-park/backstage/question/getInfosById", {id: q_info.id}, function(resp){
 	 					if(resp.code == 0){
 	 						$scope.item = resp.data;
 	 						$scope.$apply();
 	 					}else{
 	 						window.alert(resp.message);
 	 					}
 	 				});
 				}
 			}
 			
 			app.modulePromiss.then(function() {
 	            fac.initPage($scope,function(){
 	            	$scope.find();
 	            })
 	        });
 			
 			$scope.initMaxCount = function(){
 				if(!q_info.id){//新增
	 				$.post("/ovu-park/backstage/question/getMaxPosition", {questionnaireId : q_info.questionnaireId}, function(resp){
	 					if(resp.code == 0){
	 						$scope.maxCount = resp.data;
 	 						$scope.$apply();
 	 					}else{
 	 						window.alert(resp.message);
 	 					}
	 				});
 				}
 			};
 			
 			$scope.initMaxCount();
 			
 			$scope.setQuestionType = function(type){
 				$scope.item.questionType = type;
 				//$scope.$apply();
 			};
 			
			$scope.addOption = function() {
				$scope.item.optionItems.push({content : ""});
			}
			
			$scope.getOptions = function(type){
 				var optionItems = [];
				$(".q_option").each(function(cId){
					if(type == 'save' && !$(this).val()){
						window.msg("选项不能为空!");
						optionItems = false;
						return false;
					}
					var o_item = {
							questionnaireId : $scope.item.questionnaireId,
							content : $(this).val(),
							position : cId + 1
					};
					if($scope.item.id){
						o_item.questionId = $scope.item.id;
					}
					
					optionItems.push(o_item);
				});
				return optionItems;
 			};
 			
			$scope.reduceOption = function(event){
 				$(event.target).parent().parent().remove();
 				
 				$scope.item.optionItems = $scope.getOptions('show');
 				//$scope.$apply();
 			};
 			
 			$scope.saveQuestion = function (form, item, event) {
 				//按钮禁用
				if($(event.target).attr("disabled")){
					return false;
				}
				form.$setSubmitted(true);
				if (!form.$valid) {
					return false;
				}
				
				var optionItems =  $scope.getOptions('save');
				if(!optionItems){
					return false;
				}
				if(optionItems.length < 2){
					window.msg("请至少添加2条选项!");
					return false;
				}
				
				$(event.target).attr("disabled", "disabled");
				$scope.item.position = $scope.item.position ? $scope.item.position : ($scope.maxCount+1);
				$scope.item.optionItems = optionItems;
				console.log(JSON.stringify($scope.item));
				$.post("/ovu-park/backstage/question/saveOrEdit", {questionItem : JSON.stringify($scope.item)}, function(resp){
					if(resp.code == 0){
						window.msg("操作成功!");
						$(event.target).removeAttr("disabled");
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
 		
 		app.controller('previewQuestionCtrl', function($scope, $http, $uibModalInstance, $filter, fac,question, $uibModal){
 			//$scope.item = question;
 			$scope.find = function(){
 				$.post("/ovu-park/backstage/question/getInfosById", {id: question.id}, function(resp){
 					if(resp.code == 0){
 						$scope.item = resp.data;
 						$scope.$apply();
 					}else{
 						window.alert("获取题目信息失败!");
 					}
 				});
 			}
 			
 			app.modulePromiss.then(function() {
 	            fac.initPage($scope,function(){
 	            	$scope.find();
 	            })
 	        });
 			
			$scope.cancel = function () {
				$uibModalInstance.dismiss('cancel');
			};	
		});
		
 		app.controller('previewQuestionnaireCtrl',function($scope, $http, $uibModalInstance, $filter, fac,questionnaire, $uibModal){
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
 		
	})()