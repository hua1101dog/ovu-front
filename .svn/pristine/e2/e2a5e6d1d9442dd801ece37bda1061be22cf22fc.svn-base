
(function() {
	"use strict";

	var app = angular.module("angularApp");
	app.controller('takingTwiceReportCtl', function ($scope,$rootScope, $http,$filter,$uibModal,fac) {
        document.title ="二次承接报告";
        $scope.search={};
		$scope.pageModel={};
		app.modulePromiss.then(function(){
			$scope.search = {isGroup:fac.isGroupVersion()};
			$scope.search.type=1;
			$scope.search.source=2;
			loadDeptTree();
		});

		//查询
		$scope.find = function(pageNo) {
			if(!$scope.search.projectId){
				alert('请选择项目！');
				return;
			}
			$scope.search.typeId = $scope.typeId;
			$.extend($scope.search, {
				currentPage: pageNo || $scope.pageModel.currentPage || 1,
				pageSize: $scope.pageModel.pageSize || 10
			});
			fac.getPageResult("/ovu-pcos/taking/init/list.do", $scope.search, function(data) {
				$scope.pageModel = data;
			});
		};

		//点击列表项
		$scope.clicktr=function(item){
			if($scope.typeId!=item.id){
				$scope.typeId=item.id;
				$scope.find(1);
				showChart();
			}else{
				delete $scope.typeId;
				$scope.pageModel={};
			}
		};

		//切换Tab
		$scope.switchTab = function (checkType) {
			if(!$scope.search.projectId){
				return;
			}
			$scope.search.type=checkType;
			$scope.find(1);
		};

		$scope.selectProject=function(){
			var modal = $uibModal.open({
				animation: true,
				size: '',
				templateUrl: '/common/modal.project.html',
				controller: 'selectProjectCtrl'
				, resolve: {}
			});
			modal.result.then(function (data) {
				$scope.search.projectId=data.id;
				$scope.search.projectName=data.name;
				$scope.find(1);
				showChart();
			}, function () {
				console.info('Modal dismissed at: ' + new Date());
			});
		};

		//编辑
		$scope.showEditModal = function(item){
			var modal = $uibModal.open({
				animation: false,
				size:'',
				templateUrl: 'undertaking/twice/modal.takingReport.html',
				controller: 'takingTwiceReportModalCtrl'
				,resolve: {item:function(){return  angular.extend({},item);}}
			});
			modal.result.then(function (data) {
				$scope.find();
			}, function () {
				console.info('Modal dismissed at: ' + new Date());
			});
		};

		function showChart(){
			//加载图表
			var projectId=$scope.search.projectId;
			var taktypeId=$scope.typeId?$scope.typeId:'';
			loadData(projectId,1,taktypeId);
			loadData(projectId,2,taktypeId);
			loadData(projectId,3,taktypeId);
		}

		//获取图表数据
		function loadData(projectId,way,typeId){
			$http.post("/ovu-pcos/taking/init/report.do",{projectId:projectId,way:way,typeId:typeId,source:$scope.search.source},fac.postConfig).success(function (data) {
				if(way==1){
					loadChart('stockChart','盘点清单',data);
				}else if(way==2){
					loadChart('watchChart','查验清单',data);
				}else if(way==3){
					loadChart('checkChart','检测清单',data);
				}
			})
		}

		//加载图表
		function loadChart(chartid,chartName,data) {
			var myChart = echarts.init(document.getElementById(chartid));

			var annulusOption = {
				tooltip: {
					trigger: 'item',
					formatter: "{a} <br/>{b}: {c} ({d}%)"
				},
				toolbox: {
				},
				legend: {
					orient: 'vertical',
					x: 'left',
					data: data
				},
				series: [
					{
						name: chartName,
						type: 'pie',
						radius: ['50%', '70%'],
						avoidLabelOverlap: false,
						label: {
							normal: {
								show: false,
								position: 'center'
							},
							emphasis: {
								show: true,
								textStyle: {
									fontSize: '10',
									fontWeight: 'bold'
								}
							}
						},
						labelLine: {
							normal: {
								show: true
							}
						},
						data: data
					}
				]
			};
			myChart.setOption(annulusOption);
		}

		function loadDeptTree(){
			$scope.typeId='';
			$http.get("/ovu-pcos/taking/type/tree.do").success(function(data) {
				$scope.list=data;
			});
		};

	});
	app.controller('takingTwiceReportModalCtrl', function($scope,$rootScope,$http,$uibModalInstance,$uibModal,$filter,fac,item) {
		$scope.item = item || {};
        item.result='';
        if(item.has_confirm){
            if(item.has_confirm==1){
                item.result='承接通过';
            }else{
                item.result='承接不通过';
            }
        }

		$scope.cancel = function () {
			$uibModalInstance.dismiss('cancel');
		};
	});
})()
