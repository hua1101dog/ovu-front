(function() {
	document.title ="承接工单";
	var app = angular.module("angularApp").run(['$anchorScroll', function($anchorScroll) {
		$anchorScroll.yOffset = 50;
		// 默认向下便宜50px
		// 在此处配置偏移量
	}]);
	app.controller('holdOrderCtl', function ($scope,$rootScope,$uibModal, $http,$filter,fac) {
		angular.extend($rootScope,fac.dicts);
		app.modulePromiss.then(function(){
			$scope.search = {isGroup:fac.isGroupVersion()};

			$scope.find();
		});

		$scope.pageModel = {};

		//查询
		$scope.find = function(pageNo){
			$.extend($scope.search,{currentPage:pageNo||1,pageSize:$scope.pageModel.pageSize||10});
			$scope.search.pageIndex = $scope.search.currentPage-1;
			fac.getPageResult("/ovu-pcos/pcos/holdorder/list.do",$scope.search,function(data){
				$scope.pageModel = data;
			});
		};

		//选择电梯
		$scope.chooseEquipment = function(){
			if(!fac.hasOnlyPark($scope.search)){
				return;
			}
			var modal = $uibModal.open({
				animation: false,
				size:'lg',
				templateUrl: '/view/equipment/multiselector.equipment.html',
				controller: 'equipmentMultiSelectorCtrl'
				,resolve: {data: function(){return {parkId:$scope.search.parkId};}}
			});
			modal.result.then(function (data) {
				var equipment_id=[];
                if(data){
                    data.forEach(function(item){
                        equipment_id.push(item.id);
                    });
                }
				if(equipment_id.length>0){
					buildOrder(equipment_id.join(),$scope.search.parkId);
				}
			});
		};

		function buildOrder(ids,parkId){
			$http.post("/ovu-pcos/pcos/holdorder/buildOrder.do",{ids:ids,parkId:parkId},fac.postConfig).success(function(data, status, headers, config) {
				if(data.success){
					$scope.find();
					$uibModalInstance.close();
					msg("生成成功!");
				} else {
					alert(data.msg+" 生成失败.");
				}
			})

		}

		//批量删除
		$scope.delAll = function(){
			var ids = $scope.pageModel.list.reduce(function(ret,n){n.checked && n.order_status==1 && ret.push(n.id);return ret},[]);
			if(ids.length==0){
				alert("仅有未执行的工单可以删除！");
				return;
			}
			dodel(ids.join());
		};
		//删除
		$scope.del = function(item){
			dodel(item.id);
		};
		function dodel(ids){
			confirm("确认删除选择的工单?",function(){
				$http.post("/ovu-pcos/pcos/holdorder/delete.do",{ids:ids},fac.postConfig).success(function(resp){
					if(resp.success){
						$scope.find();
					}else{
						alert('删除失败');
					}
				})
			});
		}

		//执行
		$scope.showEditModal = function(group,readOnly){
			group = group||{};
			var modal = $uibModal.open({
				animation: false,
				size:'lg',
				templateUrl: '/view/holdorder/modal.holdorder.html',
				controller: 'holdorderModalCtrl'
				,resolve: {group: $.extend(true,{},group),readOnly:readOnly?true:false}
			});
			modal.result.then(function () {
				$scope.find();
			}, function () {
				console.info('Modal dismissed at: ' + new Date());
			});
		};

	});
	app.controller('holdorderModalCtrl', function($scope,$rootScope,$http,$uibModalInstance,$uibModal,$filter,fac,group,readOnly,$location,$anchorScroll) {

		$scope.onFocus = function (item) {
			$location.hash(item.id);
			$anchorScroll();
		};

		//保存
		
		$scope.save = function(form,item){
			var i=0;
			form.$setSubmitted(true);
			
			if(!form.$valid){
				return;
			}
			$scope.unitdata.forEach(function(item){
				item.image=item.pics?item.pics.join():'';
				if(item.pics.length>3){
                    i++
				}
				
				
			});
			if(i>0){
               alert('每项上传图片限制为3张')
			}else{
				
				$http.post("/ovu-pcos/pcos/holdorder/saveDetail.do",{detail_json:JSON.stringify($scope.unitdata)},fac.postConfig).success(function(data, status, headers, config) {
				if(data.success){
					$uibModalInstance.close();
					msg("保存成功!");
				} else {
					alert(data.msg+" 保存失败.");
				}
			})

			}
			
			
		}
		$scope.cancel = function () {
			$uibModalInstance.dismiss('cancel');
		};

		$scope.item = group;
		$scope.unitdata=[];//明细
		$scope.riskLevelData=[];//风险等级
		$scope.readOnly = readOnly;//只读
		//有工单就加载
		if(group.id){
			findDetails(group.id);
			getRiskLevels();
		}

		//查看风险等级
		$scope.showRiskLevel=function(){
			var o={data:$scope.riskLevelData};
			var modal = $uibModal.open({
				animation: false,
				size:'lg',
				templateUrl: '/view/holdorder/modal.risklevel.html',
				controller: 'riskLevelModalCtrl'
				,resolve: {obj: o}
			});
			modal.result.then(function () {
				getRiskLevels();
			}, function () {
				console.info('Modal dismissed at: ' + new Date());
			});
		};

		//获取工单明细数据
		function findDetails(id){
			$http.post("/ovu-pcos/pcos/holdorder/findDetails.do",{id:id},fac.postConfig).success(function(data, status, headers, config) {

				$scope.unitdata=data;
				$scope.unitdata.forEach(function(item){
					item.pics = item.image?item.image.split(","):[];
				});
			})
		}

		//获取所有风险等级
		function getRiskLevels(){
			$http.post("/ovu-pcos/pcos/holdorder/listRiskLevel.do",{},fac.postConfig).success(function(data, status, headers, config) {
				$scope.riskLevelData=data;
			})
		}
		//打印
		$scope.print = function(){
			$("#myPrint").print({
				globalStyles: true,
				mediaPrint: true,
				stylesheet: null,
				noPrintSelector: ".no-print",
				iframe: true,
				append: null,
				prepend: null,
				manuallyCopyFormValues: true,
				deferred: $.Deferred(),
				timeout: 750,
				title: null,
				doctype: '<!doctype html>'    // remove script tags from print content
			});
		}

		// 编辑框第二次加载
		$scope.$on('$destroy', function() {

		});
	});
	app.controller('riskLevelModalCtrl', function($scope,$rootScope,$http,$uibModalInstance,$uibModal,$filter,fac,obj) {
		$scope.steps=obj.data || [];

		//保存
		$scope.save = function(form,items){
			form.$setSubmitted(true);
			if(!form.$valid){
				return;
			}
			$http.post("/ovu-pcos/pcos/holdorder/saveRiskLevel.do",{riskLevel_json:JSON.stringify(items),del_json:JSON.stringify($scope.delData)},fac.postConfig).success(function(data, status, headers, config) {
				if(data.success){
					$uibModalInstance.close();
					msg("保存成功!");
				} else {
					alert(data.msg+" 保存失败.");
				}
			})
		};

		//删除
		$scope.delData=[];
		$scope.del = function(item){
			if(item.id){
				$scope.delData.push(item);
			}
			$scope.steps.splice($scope.steps.indexOf(item),1);
		};

		$scope.cancel = function () {
			$uibModalInstance.dismiss('cancel');
		};

		// 编辑框第二次加载
		$scope.$on('$destroy', function() {

		});
	});
})();
