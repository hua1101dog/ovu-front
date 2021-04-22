
(function() {
	"use strict";

	var app = angular.module("angularApp");
	app.controller('singleProjectCtl', function ($scope,$rootScope, $http,$filter,$uibModal,fac,$location) {
        document.title ="单项目概览";
        $scope.search={};
		$scope.pageModel={};
    $scope.progress=0;

    //从多项目跳转过来
    if ($location.search().projectId) {
      debugger;
      var id=$location.search().projectId;
      var name=$location.search().projectName;
      var state=$location.search().state;
      find(id,name,state);
    }

		$scope.selectProject=function(){
			var modal = $uibModal.open({
				animation: true,
				size: '',
				templateUrl: '/common/modal.project.html',
				controller: 'selectProjectCtrl'
				, resolve: {}
			});
			modal.result.then(function (data) {
				find(data.id,data.name,data.taking_state);
			}, function () {
				console.info('Modal dismissed at: ' + new Date());
			});
		};

    function find(id,name,state){
        $scope.search.projectId=id;
        $scope.search.projectName=name;
        setProgress(state);
        showChart();
    }


		//确认完成
		$scope.finish = function(){
			confirm("确认完成此项目吗?",function(){
				$http.post("/ovu-pcos/taking/statistics/finish.do",{id:$scope.search.projectId},fac.postConfig).success(function(data){
					if(data.success){
						setProgress(2);
						msg('操作成功！');
					}else{
						alert(data.error);
					}
				});
			})
		};

		//设置承接进度
		function setProgress(taking_state){
			if(!taking_state || taking_state==0){
				$scope.progress=0;
			}else if(taking_state==1){
				$scope.progress=50;
			}else if(taking_state==2){
				$scope.progress=100;
			}else if(taking_state==4){
				$scope.progress=80;
			}
		}

		function showChart(){
			//加载图表
			var projectId=$scope.search.projectId;
			var taktypeId=$scope.typeId?$scope.typeId:'';
			loadData(projectId,1,taktypeId);
			loadData(projectId,2,taktypeId);
			loadData(projectId,3,taktypeId);

			//条形图
			loadBarData(projectId);
		}

		//获取图表数据
		function loadData(projectId,way,typeId){
			$http.post("/ovu-pcos/taking/init/report.do",{projectId:projectId,way:way,typeId:typeId,source:-1},fac.postConfig).success(function (data) {
				if(way==1){
					loadChart('stockChart','盘点清单',data);
				}else if(way==2){
					loadChart('watchChart','查验清单',data);
				}else if(way==3){
					loadChart('checkChart','检测清单',data);
				}
			})
		}

		//获取图表数据
		function loadBarData(projectId){
			$http.post("/ovu-pcos/taking/statistics/statisType.do",{projectId:projectId},fac.postConfig).success(function (data) {
				//text yes_count total
				var obj={names:[],values:[]};
				data.forEach(function(item){
					obj.names.push(item.text);
					var progress=item.total!=0?(item.yes_count/item.total*100).toFixed(0):0;
					obj.values.push(progress);
				});
				loadBarChart(obj);
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

		//加载图表
		function loadBarChart(data) {
			var myChart = echarts.init(document.getElementById('itemChart'));
			var option={
				tooltip : {
					trigger: 'axis',
					axisPointer : {            // 坐标轴指示器，坐标轴触发有效
						type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
					}
				},
				toolbox: {
					show : false
				},
				xAxis : [
					{
						type : 'category',
						data : data.names
					}
				],
				yAxis : [
					{
						type : 'value'
					}
				],
				series : [
					{
						name:'进度',
						type:'bar',
						data:data.values
					}
				]
			};
			myChart.setOption(option);
		}

	});
	app.controller('singleProjectModalCtrl', function($scope,$rootScope,$http,$uibModalInstance,$uibModal,$filter,fac,item) {
		$scope.item = item || {};

		$scope.cancel = function () {
			$uibModalInstance.dismiss('cancel');
		};
	});
})()
