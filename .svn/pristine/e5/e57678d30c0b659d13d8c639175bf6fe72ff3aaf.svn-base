/**
 * 电梯综合报表
 */
(function() {
	'use strict';
	
	document.title = "电梯综合报表";
	var app = angular.module("angularApp");
	
	app.controller('ElevatorControl',ElevatorControl);
	ElevatorControl.$inject=['$scope','$timeout','$uibModal','ElevatorService','fac'];
	function ElevatorControl($scope,$timeout,$uibModal,ElevatorService,fac){
		var vm = this;
        $scope.pageModel = {};
		$scope.search = {};
		//分页表格
	    $scope.find = function(pageNo){
	    	angular.extend($scope.search, { currentPage: pageNo || $scope.pageModel.currentPage || 1, pageSize: $scope.pageModel.pageSize || 10 });
            $scope.search.pageIndex = $scope.search.currentPage - 1;
            fac.getPageResult("/ovu-pcos/pcos/liftreport/lift/list.do", $scope.search, function(data) {
                $scope.pageModel = data;
            });	
	    }
	    //图表数据
	    vm.selectTime = function(time) {
	    	ElevatorService.getChart(time).then(function(data){
				//工单总完成率
    			vm.faultOption=ElevatorService.getFaultOption(data.faultList);
	    		//电梯分类
	    		var classifyOp=ElevatorService.getElevatorOption();
	    		classifyOp.title.text="电梯分类统计";
	    		classifyOp.series[0].name="电梯分类";
	    		var clasNames=[];
	    		data.typeList.forEach(function(mode) {
	    			mode.name += '('+mode.value+')';
	    			clasNames.push(mode.name);
				}) 
	    		classifyOp.series[0].data=data.typeList || [];
	    		classifyOp.legend.data = clasNames;
	    		vm.classifyOption = classifyOp; 
	    		//电梯品牌
	    		var brandOp=ElevatorService.getElevatorOption();
	    		brandOp.title.text="电梯品牌分布统计Top10";
	    		var bNames=[];
	    		data.brandList.forEach(function(mode) {
	    			mode.name += '('+mode.value+')';
	    			bNames.push(mode.name);
				}) 
	    		brandOp.series[0].data=data.brandList || [];
	    		brandOp.series[0].name="电梯品牌";
	    		brandOp.legend.data = bNames;
	    		vm.brandOption = brandOp; 
			});
        }
		
	   //图表resize事件
		window.onresize = function(){
			$scope.$broadcast("onWindowResize");
	    }
		
		vm.selectTime('year');
	    $scope.find();
	}
	/**
	 * Service
	 */
	app.service('ElevatorService',['$http', function ($http) {
        //工单完成率统计。用于进度条类似
        this.getFaultOption = function(data){
        	var optionData=[];
        	var yaxisData=[];
        	var otherData=[];
        	data && data.reverse() && data.forEach(function(v,i){
        		var obj={
	     	            value: v.value,
	     	            itemStyle: {
	     	                normal: {
	     	                    color: (i % 2 === 0 ? '#E35E5E' : '#669FD8'),
	     	                    borderColor: (i % 2 === 0 ? '#E25555' : '#5594D4'),
	     	                }
	     	            	}
	     	        	};
        		optionData.push(obj);
        		yaxisData.push(v.name);
        		otherData.push(100);
        	})
            return angular.merge({}, {
            	title:{
            		text : '电梯品牌故障率统计',
            		left:'center'
            	},
                tooltip: {
                    trigger: 'axis',
                    formatter: function(obj){
                    	  return obj[1].name + ' : 故障(' + obj[1].value + '%)';
                    },
                    axisPointer: { // 坐标轴指示器，坐标轴触发有效
                        type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
                    }
                },
                grid: {
                    left: '3%',
                    right: '16%',
                    bottom: '3%',
                    top:'15%',
                    containLabel: true
                },
    	        yAxis: {
    	            data: yaxisData,
    	            axisTick: {
    	                show: false
    	            },
    	            axisLabel: {
    	            },
    	            axisLine: {
    	                show: false
    	            },
    	            splitLine: {
    	                show: false
    	            }
    	        },
    	        xAxis: {
    	            splitLine: {
    	                show: false
    	            },
    	            axisTick: {
    	                show: false
    	            },
    	            show: false,
    	            axisLine: {
    	                show: false
    	            }
    	        },
    	        series: [{
    	            type: 'bar',
    	            barWidth: 15,
    	            itemStyle: {
    	                normal: {
    	                    color: '#ddd',
    	                    barBorderRadius: 15
    	                }
    	            },
    	            silent: true,
    	            barGap: '-100%', // Make series be overlap
    	            label: {
    	                normal: {
    	                    show: true,
    	                    position: ['100%', '-50%'],
    	                    textStyle: {
    	                        color: '#353535',
    	                        fontWeight: 'bold',
    	                        fontSize: 20
    	                    },
    	                    formatter: function(params) {
    	                        return data[params.dataIndex].value + '%';
    	                    }
    	                }
    	            },
    	            data: otherData
    	        	}, 
    	        	{
        	        	type: 'bar',
        	            z: 10,
        	            barWidth: 15,
        	            itemStyle: {
        	                normal: {
        	                    // color: '#E35E5E',
        	                    // borderColor: '#E25555',
        	                    borderWidth: 1,
        	                    borderType: 'solid',
        	                    barBorderRadius: 15,
        	                }
    	            },
    	            data: optionData
    	        }]
    	    });
        }
        //电梯品牌统计，空心扇形图都可以用
        this.getElevatorOption = function(){
            return angular.merge({},{
            	title:{
            		left:'center'
            	},
		   		tooltip: {
			        trigger: 'item',
			        formatter: "{a} <br/>{b}: {c} ({d}%)"
			    },
			    grid: {
			    	top:"-10%"
                },
			    legend: {
			        data:['日历','格力','互看了','视频广告','搜索引擎'],
			        bottom: 0
			    },
			    series: [
			        {
			            name:'电梯统计',
			            type:'pie',
			            radius: ['50%', '70%'],
			            center: ['50%', '45%'],
			            avoidLabelOverlap: false,
			            label: {
			                normal: {
			                    show: false,
			                    position: 'center'
			                },
			                emphasis: {
			                    show: true,
			                    textStyle: {
			                        fontSize: '20',
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
        
        this.getChart = function(param){
        	return $http.get('/ovu-pcos/pcos/liftreport/lift/chart.do?timeDim='+param).then(function(resp) {
        		return resp.data;
        	});
        }
	            

	 }]);
	
})()
