<%@ page language="java" contentType="text/html; charset=utf-8"
		 pageEncoding="utf-8" %>
<style>
	.card-border {
		border: 1px solid #ddd;
		background: #fff;
	}
	.margin-10 {
		margin-top: 10px;
	}
	.border-r10 {
		border-radius: 10px;
	}
	.title {
		height: 30px;
		margin: 10px;
		border-bottom: 1px solid #ddd;
	}
	.common_footer {
		text-align: center;
		border-top: 1px solid #ddd;
		line-height: 40px;
	}
	.red {
		color: red;
	}
	.green {				
		color: green;
	}
	.border-line {
		border-right: 1px solid #ddd;
		margin: 10px 0;
		text-align: center;
		line-height: 80px;
	}
	.person {
		text-align: center;
		line-height: 100px;
	}
	.person span {
		font-weight: 700;
	}
	.work_top {	
		text-align: center;
		height: 70px;
		line-height: 70px;
	}
	.common-size {
		font-size: 18px;
		font-weight: 700;
	}
	.work_main {	
		text-align: center;
		height: 80px;
	}
	.top-star {
		line-height: 100px;
	}
	.star_icon {
		display: inline-block;
		width: 45px;
		height: 55px;
		vertical-align: middle;
		margin-top: -20px;
		margin-right: 20px;
		background: url(/ovu-pcos/res/img/u394.png) no-repeat;
		background-size: 100% 100%;
	}
	.paddiing-b10 {
		padding-bottom: 10px;
	 }
</style>
<div id="angularId" ng-controller="proAll">
	<div class="x_panel">
		<h4>项目总览{{proName}}</h4>
	</div>
	<div class="row">
		<div class=" col-sm-4 col-xs-12">
			<div class="card-border" style="height: 300px">
				<div class="title">
					<h5>收入执行率</h5>
				</div>
				<div id="income" style="height: 210px;">
					
				</div>
				<div class="common_footer" style="height: 40px;">
					<span>实际收入:</span><span class="red common-size">{{data.realIncome | number}}元</span>
				</div>
			</div>
		</div>
		<div class=" col-sm-4 col-xs-12">
			<div class="card-border" style="height: 300px">
				<div class="title">
					<h5>支出执行率</h5>
				</div>
				<div id="out" style="height: 210px;">
					
				</div>
				<div class="common_footer" style="height: 40px;">
					<span>实际支出:</span><span class="green common-size">{{data.realOut | number}}元</span>
				</div>
			</div>
		</div>
		<div class=" col-sm-4 col-xs-12">
			<div class="card-border" style="height: 300px">
				<div class="title">
					<h5>物业收缴率</h5>
				</div>
				<div id="property" style="height: 210px;">
					
				</div>
				<div class="common_footer" style="height: 40px;">
					<span>实际收缴:</span><span class="red common-size">{{data.realCharge | number}}元</span>
				</div>
			</div>
		</div>
	</div>
	<div class="row margin-10">
		<div class=" col-sm-4 col-xs-12">
			<div class="card-border border-r10" style="height: 100px">
				<div class="col-xs-4 border-line"><span>在岗</span></div>
				<div class="col-xs-8 person common-size"><span>{{data.ON_DUTY | number}}人
					
				</span></div>
			</div>
		</div>
		<div class=" col-sm-4 col-xs-12">
			<div class="card-border border-r10" style="height: 100px">
				<div class="col-xs-4 border-line"><span>在编</span></div>
				<div class="col-xs-8 person common-size"><span>{{data.ON_STAFF| number}}人
					
				</span></div>
			</div>								
		</div>
		<div class="col-sm-4 col-xs-12">
			<div class="card-border border-r10" style="height: 100px">
				<div class="col-xs-4 border-line"><span>缺编</span></div>
				<div class="col-xs-8 person common-size"><span>{{data.OFF_STAFF| number}}人
					
				</span></div>
			</div>
		</div>
	</div>
	<div class="row margin-10">
		<div class=" col-sm-3 col-xs-12">
			<div class="card-border border-r10" style="height: 150px">
				<div class="work_top"><span>总工单</span></div>
				<div class="work_main common-size"><span>{{data.ORDER_ALL| number}}条</span></div>
			</div>
		</div>
		<div class=" col-sm-3 col-xs-12">
			<div class="card-border border-r10" style="height: 150px">
				<div class="work_top"><span>已完成工单</span></div>
				<div class="work_main common-size"><span>{{data.ORDER_FINISHED| number}}条</span></div>
			</div>
		</div>
		<div class="col-sm-3 col-xs-12">
			<div class="card-border border-r10" style="height: 150px">
				<div class="work_top"><span>总异常工单</span></div>
				<div class="work_main common-size"><span>{{data.ORDER_ERROR | number}}条</span></div>
			</div>
		</div>
		<div class="col-sm-3 col-xs-12">
			<div class="card-border border-r10" style="height: 150px">
				<div class="work_top"><span>处理业主投诉</span></div>
				<div class="work_main common-size"><span>{{data.ORDER_COMPLAINT| number}}条</span></div>
			</div>
		</div>
	</div>
		<div class="row margin-10 paddiing-b10">
		<div class=" col-sm-4 col-xs-12">
			<div class="card-border border-r10" style="height: 150px">					<div class="title">
					<h5 class="text-center">员工工单执行明星</h5>
				</div>
				<div class="text-center top-star"><i class="star_icon"></i><span>{{data.ORDER_EXEC_STAR_NAME}}</span>&nbsp;&nbsp;<span class="common-size">{{data.ORDER_EXEC_STAR_AMOUNT | number}}条工单</span></div>
				
			</div>
		</div>
		<div class="col-sm-4 col-xs-12">
			<div class="card-border border-r10" style="height: 150px">
						<div class="title">
							<h5 class="text-center">

出勤率明星
</h5>
						</div>
						<div class="text-center top-star"><i class="star_icon"></i><span>{{data.ON_DUTY_STAR_NAME}}</span>&nbsp;&nbsp;<span class="common-size">{{data.ON_DUTY_STAR_AMOUNT}}</span></div>
					</div>
				</div>
				<div class="col-sm-4 col-xs-12">
					<div class="card-border border-r10" style="height: 150px">
				<div class="title">
					<h5 class="text-center">物业费收缴率明星</h5>
				</div>
				<div class="text-center top-star"><i class="star_icon"></i><span>{{data.PAY_STAR_NAME}}</span>&nbsp;&nbsp;<span class="common-size">{{data.PAY_STAR_AMOUNT | number}}元</span></div>
			</div>
		</div>
	</div>
</div>
<script>
	//员工出勤单数统计
	(function(){
		document.title = "单项目总览";
		var app = angular.module("angularApp");
		app.controller('proAll', function ($scope,$rootScope, $http,$filter,$uibModal,fac) {
			angular.extend($rootScope,fac.dicts);		
			$scope.param = {parkId:'${act_park.ID}'};
			$scope.pro = {name:'${act_park.PARK_NAME}'};
			$scope.proName = ">" + $scope.pro.name;
			function hasActivePark() {
				if (!$scope.param.parkId) {
					alert("请选择项目！");
					return false;
				} else {
					return true;
				}
			}
			hasActivePark();
			if(!hasActivePark()){
				return;
			}
			$http.post("/ovu-pcos/pcos/stat/statOverview.do").success(function(resp){
				$scope.data = resp;
				//图表数据
				$scope.data1 = $scope.data.INRate;				
				$scope.data2 = $scope.data.OUTRate;
				$scope.data3 = $scope.data.ChargeRate;
				
				initChart($scope.data1,$scope.data2,$scope.data3);				
			});
			function initChart(data1,data2,data3){
				// 收入
				var myChartIncome = echarts.init(document.getElementById('income'));
				incomeOption = {
					tooltip: {
						trigger: 'item',
						formatter: "{b}: {c}元 ({d}%)"
					},
					series: [{
						name: '收入',
						type: 'pie',
						radius: ['50%', '80%'],
						avoidLabelOverlap: false,
						label: {
							normal: {
								show: false,
								position: 'center'
							},
							emphasis: {
								show: true,
								textStyle: {
									fontSize: '12',
									fontWeight: 'bold'
								}
							}
						},
						labelLine: {
							normal: {
								show: false
							}
						},
						data: data1
					}]
				};// 为echarts对象加载数据
				myChartIncome.setOption(incomeOption);
				
				// 支出
				var myChartOut = echarts.init(document.getElementById('out'));
				outOption = {
					tooltip: {
						trigger: 'item',
						formatter: "{b}: {c}元 ({d}%)"
					},
					series: [{
						name: '支出',
						type: 'pie',
						radius: ['50%', '80%'],
						avoidLabelOverlap: false,
						label: {
							normal: {
								show: false,
								position: 'center'
							},
							emphasis: {
								show: true,
								textStyle: {
									fontSize: '12',
									fontWeight: 'bold'
								}
							}
						},
						labelLine: {
							normal: {
								show: false
							}
						},
						color:['green','#2f4554'],
						data: data2
					}]
				};// 为echarts对象加载数据
				//物业催缴
				myChartOut.setOption(outOption);
				var myChartProperty = echarts.init(document.getElementById('property'));
				propertyOption = {
					tooltip: {
						trigger: 'item',
						formatter: "{b}: {c} 元({d}%)"
					},
					series: [{
						name: '收缴',
						type: 'pie',
						radius: ['50%', '80%'],
						avoidLabelOverlap: false,
						label: {
							normal: {
								show: false,
								position: 'center'
							},
							emphasis: {
								show: true,
								textStyle: {
									fontSize: '12',
									fontWeight: 'bold'
								}
							}
						},
						labelLine: {
							normal: {
								show: false
							}
						},
						data: data3
					}]
				};// 为echarts对象加载数据
				myChartProperty.setOption(propertyOption);
				
				//图标自适应大小
				window.addEventListener('resize', function () {
					myChartIncome.resize();
					myChartOut.resize();
					myChartProperty.resize();
				});
			}
		})
		angular.bootstrap(document.getElementById("angularId"), ['angularApp']);
	})()
</script>



