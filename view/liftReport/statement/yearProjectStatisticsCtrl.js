/**
 * 年度项目情况汇总
 */
(function() {
	document.title = "年度项目情况汇总";
	var app = angular.module("angularApp");
	
	app.controller('YearProjectCtrl',function($scope, $timeout,$q,YearProjectService) {
		var vm = this;
		vm.time = moment().format("YYYY");
		
		vm.find = function(){
			YearProjectService.getData(vm.time).then(function(data){
				vm.list = data;
				
				var xAxisData=[];
				var series0=[];
				var series1=[];
				var series2=[];
				var series3=[];
				var option = YearProjectService.getOption();
				data.forEach(function(da){
					xAxisData.push(da.month);
					series0.push(da.addProjectTotal);
					series1.push(da.addLiftTotal);
					series2.push(da.loseProjectTotal);
					series3.push(da.loseLiftTotal);
				})
				option.series[0].data=series0;
				option.series[1].data=series1;
				// option.series[2].data=series2;
				// option.series[3].data=series3;
				option.xAxis.data =xAxisData;
				vm.yearProjectOption = option;
			});	
		}
		
	   //图表resize事件
		window.onresize = function(){
			$scope.$broadcast("onWindowResize");
	    }
		
		vm.find();
	});
	/**
	 * Service
	 */
	app.service('YearProjectService',['$http', function ($http) {
		 //日常保养报表。柱状图
        this.getOption = function(){
            return angular.merge({}, {
            	title: {
                    text: '年度项目情况汇总统计图',
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
					// data: ['新增项目数', '新增电梯数', '丢失项目数', '丢失电梯数']
					data: ['新增项目数', '新增电梯数']
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
                        name: '新增项目数',
                        type: 'bar',
                        data: [120,132, 101, 134,132, 101, 134,132, 101, 134,132, 101]
                    },
                    {
                        name: '新增电梯数',
                        type: 'bar',
                        data: [120,132, 101, 134,132, 101, 134,132, 101, 134,132, 101]
                    },
                    // {
                    // 	name: '丢失项目数',
                    // 	type: 'bar',
                    // 	data: [120,132, 101, 134,132, 101, 134,132, 101, 134,132, 101]
                    // },
                    // {
                    // 	name: '丢失电梯数',
                    // 	type: 'bar',
                    // 	data: [120,132, 101, 134,132, 101, 134,132, 101, 134,132, 101]
                    // }
                ]
            });
        }       
        this.getData= function(param){
        	return $http.get('/ovu-pcos/pcos/liftreport/stats/project/year.do?time='+param).then(function(resp) {
        		return resp.data;
        	});
        }        

	 }]);
	
})()
