	(function() {
		"use strict";
		var app = angular.module("angularApp");
		app.directive("datePicker",function(){
			return {
				restrict:"A",
				link:function(scope, element, attr){

					element.bind("click", function () {
						window.WdatePicker({
							dateFmt:'yyyy-MM-dd',
							maxDate:'%y-%M-%d',
							onpicked: function () {
								scope.$apply(function(){
									//alert(this.$dp.el.value);
									scope.onpickedDate(this.$dp.el.value);
								});
							}
						});
					});
				}
			};
		});
		app.controller('dailylogCtl', function ($scope,$rootScope,$uibModal, $http,$filter,fac) {
			document.title ="工作日志";
			var USER_ID=null;
			var DOMAIN_ID;
			var PARK_ID;
			var CURR_DATE=moment().format('YYYY-MM-DD');

			$scope.pageModel = {};

			app.modulePromiss.then(function(){
				$scope.search = {
					isGroup: fac.isGroupVersion()
				};
				if(app.user){
					USER_ID = app.user.ID;
					DOMAIN_ID =$scope.search.domainId = app.user.DOMAIN_ID ;
				}
				if(app.park){
					PARK_ID = $scope.search.parkId = app.park.ID;
					$scope.search.PARK_NAME =  app.park.PARK_NAME;
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
				fac.getPageResult("/ovu-pcos/pcos/dailylog/list.do",$scope.search,function(data){

					data.list.forEach(function(item){
						if(item.USER_ID==USER_ID && item.RECORD_DATE==CURR_DATE){
							item.self=true;
						}else{
							item.self=false;
						}
					});
					$scope.pageModel = data;
				});
			};

			//删除
			$scope.del = function(item){
				dodel(item.ID);
			}
			function dodel(ids){
				confirm("确认删除这条日志?",function(){
					$http.post("/ovu-pcos/pcos/dailylog/delete.do",{id:ids},fac.postConfig).success(function(resp){
						if(resp.success){
							$scope.find();
						}else{
							alert('删除失败');
						}
					})
				});
			}

			$scope.showEditModal = function(group,readOnly){
				if(!fac.hasActivePark($scope.search)){
					return;
				}
				group = group||{PARK_ID:PARK_ID,DOMAIN_ID:DOMAIN_ID};
				var modal = $uibModal.open({
					animation: false,
					size:'lg',
					templateUrl: '/common/modal.dailylog.html',
					controller: 'dailylogModalCtrl'
					,resolve: {group: $.extend(true,{},group),readOnly:readOnly?true:false}
				});
				modal.result.then(function () {
					$scope.find();
				}, function () {
					console.info('Modal dismissed at: ' + new Date());
				});
			}


		});
		app.controller('dailylogModalCtrl', function($scope,$rootScope,$http,$uibModalInstance,$uibModal,$filter,fac,group,readOnly) {
			app.modulePromiss.then(function() {
				if (app.park) {
					group.PARK_ID = app.park.ID;
					group.PARK_NAME = app.park.PARK_NAME;
				}

				//新增时默认当天
				if(!group.ID){
					var CURR_DATE=moment().format('YYYY-MM-DD');
					$scope.item.RECORD_DATE=CURR_DATE;
					var pdata={};
					pdata.date=CURR_DATE;
					chooseDate(pdata);
				}
				um.setContent(group.CONTENT || '');
				if(readOnly){
					$('.edui-container').css('border',"0px").css('box-shadow','0px 0px');
					$('.edui-toolbar').hide();
					um.setDisabled('fullscreen');
				}
			});

			$scope.$watch('item.RECORD_DATE', function(nv,ov) {
				if(nv!==ov){
					var pdata={};
					pdata.date=nv;
					chooseDate(pdata);
				}
			});


			//保存
			$scope.save = function(form,item){
				if(fac.isGroupVersion()){
					item.PARK_ID='';
				}
				form.$setSubmitted(true);
				if(!form.$valid){
					return;
				}
				item.CONTENT=um.getContent() || item.CONTENT;
				if(item.CONTENT==null || item.CONTENT==''){
					alert('请填写日志内容');
					return;
				}
				var unitids = $scope.unitdata.reduce(function(ret,n){ret.push(n.ID);return ret},[]).join();
				console.log('WORKUNIT_IDS:'+unitids);
				item.WORKUNIT_IDS=unitids;
				$http.post("/ovu-pcos/pcos/dailylog/saveOrUpdate.do",item,fac.postConfig).success(function(data, status, headers, config) {
					if(data.success){
						$uibModalInstance.close();
						msg("保存成功!");
					} else {
						alert(data.msg+" 保存失败.");
					}
				})
			}
			$scope.cancel = function () {
				$uibModalInstance.dismiss('cancel');
			};

			$scope.item = group;
			$scope.unitdata=[];
			$scope.readOnly = readOnly;//只读
			$scope.dateDisabled=group.ID?true:false;//日期置灰
			$scope.opr=group.ID?(readOnly?'查看':'修改'):'填写';
			//有工单就加载
			if(group.ID && group.WORKUNIT_IDS){
				var pdata={};
				pdata.id=group.WORKUNIT_IDS;
				chooseDate(pdata);
			}

			//获取工单数据
			function chooseDate(pdata){
				$http.post("/ovu-pcos/pcos/dailylog/listunits.do",{FROM_DATE:pdata.date,ID:pdata.id},fac.postConfig).success(function(data, status, headers, config) {

					$scope.unitdata=data;
				})
			}

			//日期选择回调
			$scope.onpickedDate=function(date){
				var oldDate=$scope.item.RECORD_DATE;
				$scope.item.RECORD_DATE=date;
				if(oldDate !== date){
					var pdata={};
					pdata.date=date;
					chooseDate(pdata);
				}
			};

			// 编辑框第二次加载
			$scope.$on('$destroy', function() {
				um.destroy();
			});
		});
	})()