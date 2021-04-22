	(function() {
		document.title ="日志查询";
		var app = angular.module("angularApp");
		app.controller('dailylogCtl', function ($scope,$rootScope,$uibModal, $http,$filter,fac) {

			$scope.pageModel = {};

			//查询
			$scope.find = function(pageNo){
				if(!fac.hasActivePark($scope.search)){
					return;
				}
				$.extend($scope.search,{currentPage:pageNo||1,pageSize:$scope.pageModel.pageSize||10});
				$scope.search.pageIndex = $scope.search.currentPage-1;
				fac.getPageResult("/ovu-pcos/pcos/dailylog/searchlist.do",$scope.search,function(data){
					$scope.pageModel = data;
				});
			};

			$scope.showEditModal = function(group,readOnly){
				if(!fac.hasActivePark($scope.search)){
					return;
				}
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

			app.modulePromiss.then(function(){
				$scope.search = {isGroup:fac.isGroupVersion()};
				if(app.park && !$scope.search.isGroup){
					$scope.search.parkId = app.park.ID;
					$scope.search.PARK_NAME =  app.park.PARK_NAME;
				}
				$scope.find(1);
			});

		});
		app.controller('dailylogModalCtrl', function($scope,$rootScope,$http,$uibModalInstance,$uibModal,$filter,fac,group,readOnly) {
			debugger;
			var promiss = fac.getSessionInfo($rootScope);
			promiss.then(function(){
				if($scope.park){
					group.PARK_ID = $scope.park.ID;
					group.PARK_NAME =  $scope.park.PARK_NAME;
				}
//				console.log(um);
				um.setContent(group.CONTENT || '');
				if(readOnly){
					//$('.edui-btn-toolbar').hide();
					$('.edui-container').css('border',"0px").css('box-shadow','0px 0px');
					$('.edui-toolbar').hide();
					um.setDisabled('fullscreen');
				}
			});
			$scope.cancel = function () {
				$uibModalInstance.dismiss('cancel');
			};

			$scope.item = group;
			$scope.readOnly = readOnly;//只读
			$scope.dateDisabled=group.ID?true:false;//日期置灰
			$scope.opr=group.ID?(readOnly?'查看':'修改'):'新建';
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


			// 编辑框第二次加载
			$scope.$on('$destroy', function() {
				um.destroy();
			});
		});
	})()
