	(function() {
		"use strict";
		var app = angular.module("angularApp");
		app.controller('customerFollowCtl', function ($scope, $rootScope, $uibModal, $http, $filter, fac) {
			document.title ="客户跟进管理";

			$scope.pageModel = {};

			app.modulePromiss.then(function(){
				$scope.search = {
					isGroup: fac.isGroupVersion()
				};
				if(app.park){
					$scope.search.parkId = app.park.ID;
				}
				$scope.find(1);
			});

			//查询
			$scope.find = function(pageNo){
				if(!fac.hasActivePark($scope.search)){
					return;
				}
				$.extend($scope.search,{currentPage:pageNo||1,pageSize:$scope.pageModel.pageSize||10});
				$scope.search.pageIndex = $scope.search.currentPage-1;
				fac.getPageResult("/ovu-pcos/expand/customerVisitingLog/list.do",$scope.search,function(data){
					$scope.pageModel = data;
					
				});
			};


			$scope.showEditModal = function(group){
				if(!fac.hasActivePark($scope.search)){
					return;
				}
				var modal = $uibModal.open({
					animation: false,
					size:'lg',
					templateUrl: '../view/expand/customer/modal.customerFollow.html',
					controller: 'customerFollowModalCtrl'
					,resolve: {group: $.extend(true,{},group)}
				});
				modal.result.then(function () {
					$scope.find();
				}, function () {
					console.info('Modal dismissed at: ' + new Date());
				});
			}


		});
		app.controller('customerFollowModalCtrl', function($scope,$rootScope,$http,$uibModalInstance,$uibModal,$filter,fac,group) {
			$scope.item = group;
			
			$scope.customerVisitingLogList = {};
			$http.post("/ovu-pcos/expand/customerVisitingLog/getByCustomerId.do", {customerId:$scope.item.id}, fac.postConfig).success(function(data, status, headers, config) {
				$scope.customerVisitingLogList = data;
			});
			
			$scope.posts = new Array();
			
			$http.get("/ovu-base/system/dept/tree.do").success(function(resp){
	            $scope.deptTree = resp;
	        });
			
			$scope.selectPerson = function(post) {
				if ($scope.posts.length == 0) {
	            	$scope.posts.push(post)
	            }
			}
			
			function getPostList(item) {
	            item.postList = [];
	            item.deptId && $http.get("/ovu-base/pcos/person/getPost.do?id="+item.deptId).success(function(data){
	                item.postList = data;
	            })
	        }
			
			$scope.getPersonList = function(item) {
	            item.personList = [];
	            item.postId && $http.get("/ovu-base/pcos/person/getAllPerson.do?deptId=" + item.deptId + "&postId=" + item.postId).success(function(data){
	                item.personList = data;
	            })
	        }

	        $scope.selectNode = function(node, post) {
	            if(node.nodes && node.nodes.length){
	                alert("请选择子节点！");
	            }else if(node.id &&  node.id!= post.deptId){
	                post.deptId = node.id;
	                post.deptName = (node.ptexts?node.ptexts+ " > ":"") +node.text;
	                post.deptHover = post.deptFocus = false;
	                getPostList(post);
//	                getPersonList(post);
	            }
	        }
	        
			$scope.customerVisitingLog = {
				id : null,
				customerId : $scope.item.id,
				executorId : null,
				executorName : null,
				visitedName : null,
				visitedJob : null,
				remark : null,
				visitingTime : null,
				visitingState : null
			};
			
			//保存
			$scope.save = function(form, customerVisitingLog) {
				form.$setSubmitted(true);
				
				if(!form.$valid) {
					return;
				}
				
				if (angular.isNumber(customerVisitingLog.visitingTime)) {
					customerVisitingLog.visitingTime = $filter('date')(customerVisitingLog.visitingTime, 'yyyy/MM/dd HH:mm:ss');
				}
				
				var personId = "", personName="";
                
                $scope.posts && $scope.posts.forEach(function(n,index,list){
                	personId += n.person.id+(index==list.length-1?"":",");
                	personName += n.person.name+(index==list.length-1?"":",");
                });
                
                if (personId.indexOf(",") >= 0) {
                	return;
                }
				
                customerVisitingLog.executorId = personId;
                customerVisitingLog.executorName = personName;
				$http.post("/ovu-pcos/expand/customerVisitingLog/save.do", customerVisitingLog, fac.postConfig).success(function(data, status, headers, config) {
					
					if(data.success) {
						$uibModalInstance.close();
						msg("保存成功!");
					} else {
						alert(data.error+" 保存失败.");
					}
				})
			}

			$scope.cancel = function () {
				$uibModalInstance.dismiss('cancel');
			};

		});
	})()