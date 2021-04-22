/**
 * Created by wangheng on 2017/8/28.
 * 工单统计控制器
 */
(function() {
    "use strict";
    var app = angular.module("angularApp");
    app.controller('workOrderStatisticsCtrl', function ($scope,$rootScope, $http,$filter,$uibModal,$window,$location,fac,workOrderStatisticsService) {
    	var vm = this;
        document.title ="工单统计";
        vm.search={};
       //查询图表数据 
		vm.init = function(){
			workOrderStatisticsService.getCharts(vm.search).then(function(data){
				//工单统计
				var option=workOrderStatisticsService.getElevatorOption();
				var names=[];
				data.statusList.forEach(function(mode) {
					mode.name += '('+mode.value+')';
					names.push(mode.name);
				});
				option.series[0].data=data.statusList || [];
				option.legend.data = names;
				vm.oneOption=option;
				//已解决工单工单统计
				var distributionOption=workOrderStatisticsService.getPileOption();
				names=[];
				data.typeList.forEach(function(re) {
					re.name += '('+re.value+')';
					names.push(re.name);
				});
				distributionOption.series[0].data=data.typeList || [];
				distributionOption.legend.data = names;
				vm.twoOption=distributionOption;
				//处理人员top10
				option=workOrderStatisticsService.barOption();
				var xList=[];
				var series0=[];
				var series1=[];
				data.personnelList.forEach(function(da){
					xList.push(da.name || '');
					series0.push(da.value);
					series1.push(da.falsevalue);
				})
				option.series[0].data=series0;
				option.series[1].data=series1;
				option.xAxis.data =xList;
				vm.threeOption=option;
				//月度工单统计
				option=workOrderStatisticsService.lineOption();
				var xList=[];
				var series0=[];
				data.monthList.forEach(function(da){
					xList.push(da.name);
					series0.push(da.value);
				})
				option.series[0].data=series0;
				option.xAxis.data =xList;
				vm.fourOption=option;
			});	
		}
		window.onresize = function(){
            $scope.$broadcast("onWindowResize");
        }
		vm.init();
		
    });

   
    app.service('workOrderStatisticsService',
		    ['$http', 
		        function ($http) {
					//电梯品牌统计，空心扇形图都可以用
					
		            this.getElevatorOption = function(){
   
		                return angular.merge({},{
					   		tooltip: {
						        trigger: 'item',
						        formatter: "{a} <br/>{b}: {c} ({d}%)"
						    },
						    legend: {
						        data:['日历','格力','互看了','视频广告','搜索引擎']
						    },
						    series: [
						        {
						            name:'访问来源',
						            type:'pie',
						            radius: ['50%', '70%'],
						            center: ['50%', '55%'],
						            avoidLabelOverlap: false,
						            label: {
						                normal: {
						                    show: false,
						                    position: 'center'
						                },
						                emphasis: {
						                    show: true,
						                    textStyle: {
						                        fontSize: '30',
						                        fontWeight: 'bold'
						                    }
						                }
						            },
						            labelLine: {
						                normal: {
						                    show: false
						                }
						            },
						            data:[
						                {value:335, name:'日历'},
						                {value:310, name:'格力'},
						                {value:234, name:'互看了'},
						                {value:135, name:'视频广告'},
						                {value:1548, name:'搜索引擎'}
						            ]
						        }
						    ]
						});
		            }
		            //电梯分类统计，饼图通用
		            this.getPileOption = function(){
		                return angular.merge({},{
		                    tooltip : {
		                        trigger: 'item',
		                        formatter: "{a} <br/>{b} : {c} ({d}%)"
		                    },
		                    legend: {
		                        data: ['直接访问','邮件营销','联盟广告','视频广告','搜索引擎']
		                    },
		                    series : [
		                        {
		                            name: '访问来源',
		                            type: 'pie',
		                            radius : '55%',
		                            center: ['50%', '60%'],
		                            data:[
		                                {value:335, name:'直接访问'},
		                                {value:310, name:'邮件营销'},
		                                {value:234, name:'联盟广告'},
		                                {value:135, name:'视频广告'},
		                                {value:1548, name:'搜索引擎'}
		                            ],
		                            itemStyle: {
		                                emphasis: {
		                                    shadowBlur: 10,
		                                    shadowOffsetX: 0,
		                                    shadowColor: 'rgba(0, 0, 0, 0.5)'
		                                }
		                            }
		                        }
		                    ]
		                });
		            }
		            //柱状图
		            this.barOption = function(){
		                return angular.merge({}, {
		                	title: {
		                        text: '',
		                        left:'center'
		                    },
		                    tooltip : {
		                        trigger: 'axis',
		                        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
		                            type : 'line'        // 默认为直线，可选为：'line' | 'shadow'
		                        }
		                    },
		                    legend: {
		    	            	 x : 'center',
		    	                 y : 'bottom',
		                        data: ['火警单', '误报单']
		                    },
		                    grid: {
		                        left: '3%',
		                        right: '4%',
		                        bottom: '8%',
		                        top:'10%',
		                        containLabel: true
		                    },
		                    yAxis:  {
		                        type: 'value'
		                    },
		                    xAxis: {
		                        type: 'category',
		                        data: ['一月','二月','三月','四月','五月','六月','七月','八月','九月','十月','十一月','十二月']
		                    },
		                    series: [
		                        {
		                            name: '火警单',
		                            type: 'bar',
		                            stack: '工单',
		                            data: [120,132, 101, 134,132, 101, 134,132, 101, 134,132, 101]
		                        },
		                        {
		                            name: '误报单',
		                            type: 'bar',
		                            stack: '工单',
		                            data: [120,132, 101, 134,132, 101, 134,132, 101, 134,132, 101]
		                        }
		                    ]
		                });
		            }  
		            //折线图
		            this.lineOption = function(){
		            	return angular.merge({}, {
		            		 title: {
		            		    },
		            		    tooltip: {
									trigger: 'axis',
									
									
		            		    },
		            		    legend: {
		            		        data:['工单量']
		            		    },
		            		    grid: {
		            		        left: '3%',
		            		        right: '0%',
		            		        bottom: '3%',
		            		        containLabel: true
		            		    },
		            		    toolbox: {
		            		        feature: {
		            		            saveAsImage: {}
									},
									right:'3%'
		            		    },
		            		    xAxis: {
		            		        type: 'category',
		            		        boundaryGap: false,
		            		        data: ['周一','周二','周三','周四','周五','周六','周日']
		            		    },
		            		    yAxis: {
		            		        type: 'value'
		            		    },
		            		    series: [
		            		        {
		            		            name:'工单量',
		            		            type:'line',
		            		            stack: '总量',
		            		            data:[820, 932, 901, 934, 1290, 1330, 1320]
		            		        }
		            		    ]
		            	});
		            }  
		            
		            this.getCharts= function(param){
		            	return $http.get('/ovu-pcos/pcos/fire/workUnitStatistical/getFirepointOverview.do',{params:param}).then(function(resp) {
		    				return resp.data;
		    			});
					}
					
				
		 }]);

})();