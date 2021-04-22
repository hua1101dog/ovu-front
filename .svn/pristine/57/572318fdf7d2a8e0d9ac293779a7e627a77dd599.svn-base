/**
 * 人员综合报表
 */
(function() {
	'use strict';

	document.title = "人员综合报表";
	var app = angular.module("angularApp");

	app.controller('PersonContrl',PersonContrl);
	PersonContrl.$inject=['$scope','$timeout','$uibModal','PersonService','fac'];
	function PersonContrl($scope,$timeout,$uibModal,PersonService,fac){
		var vm = this;
        $scope.pageModel = {};
		$scope.search = {};
		//分页表格
	    $scope.find = function(pageNo){
	    	angular.extend($scope.search, { currentPage: pageNo || $scope.pageModel.currentPage || 1, pageSize: $scope.pageModel.pageSize || 10 });
            $scope.search.pageIndex = $scope.search.currentPage - 1;
            fac.getPageResult("/ovu-pcos/pcos/liftreport/person/list.do", $scope.search, function(data) {
                $scope.pageModel = data;
            });
	    }
	    //图表数据
	    vm.selectTime = function(time) {
	    	PersonService.getChart(time).then(function(data){
				//员工出勤
    			var signinOp = PersonService.getFaultOption(data.attendanceRate,'出勤率');
	    		signinOp.title.text = "员工出勤率统计TOP10";
	    		vm.signInOption=signinOp;
	    		//工单
	    		//员工出勤
    			// var workOp = PersonService.getFaultOption(data.workUnitTop,'工单量');
	    		// workOp.title.text = "员工月均处理工单量TOP10";
				// vm.workOption=workOp;
				
			});
		 }
		 	PersonService.getMonth().then(function(data){
				//员工出勤
				 var workOp = PersonService.getMonthOption(data.workUnitTop,'工单量');
				 workOp.title.text = "员工月均处理工单量TOP10";
				 vm.workOption=workOp;
		 })
	
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
	app.service('PersonService',['$http', function ($http) {
        //工单完成率统计。用于进度条类似
        this.getFaultOption = function(data,tip){
        	var optionData=[];
        	var yaxisData=[];
        	var otherData=[];
        	data && data.reverse() &&  data.forEach(function(v,i){
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
            	},
                tooltip: {
                    trigger: 'axis',
                   /* formatter: function(obj){
                	   if(obj[data]){
						   return obj[1].name + ':' + tip + '(' + obj[1].value + (tip == "出勤率"?'%':'') + ')';
						
                	   }
                	   return '无';
					},*/
					formatter: function(obj){
						if(obj[1]){
							return obj[1].name + ':' + tip + '(' + obj[1].value + (tip == "出勤率"?'%':'') + ')';
						 
						}
						return '无';
					 },
                    axisPointer: { // 坐标轴指示器，坐标轴触发有效
                        type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
                    }
                },
                grid: {
                    left: '3%',
                    right: '15%',
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
    	                    // position: ['100%', '-50%'],
							position: ['105%', '-50%'],
    	                    textStyle: {
    	                        color: '#353535',
    	                        fontWeight: 'bold',
    	                        fontSize: 20
    	                    },
    	                    formatter: function(params) {
    	                    	if(tip == "出勤率"){
    	                    		 return data[params.dataIndex].value + '%';
    	                    	}
    	                    	return data[params.dataIndex].value;
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
		//月均处理工单量
		this.getMonthOption = function(data,tip){
        	var optionData=[];
        	var yaxisData=[];
        	var otherData=[];
        	data && data.reverse() &&  data.forEach(function(v,i){
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
            	},
                tooltip: {
                    trigger: 'axis',
                   /* formatter: function(obj){
                	   if(obj[data]){
						   return obj[1].name + ':' + tip + '(' + obj[1].value + (tip == "出勤率"?'%':'') + ')';
						
                	   }
                	   return '无';
					},*/
					formatter: function(obj){
						if(obj[1]){
							return obj[1].name + ':' + tip + '(' + obj[1].value + (tip == "出勤率"?'%':'') + ')';
						 
						}
						return '无';
					 },
                    axisPointer: { // 坐标轴指示器，坐标轴触发有效
                        type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
                    }
                },
                grid: {
                    left: '3%',
                    right: '15%',
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
    	                    // position: ['100%', '-50%'],
							position: ['105%', '-50%'],
    	                    textStyle: {
    	                        color: '#353535',
    	                        fontWeight: 'bold',
    	                        fontSize: 20
    	                    },
    	                    formatter: function(params) {
    	                    	if(tip == "出勤率"){
    	                    		 return data[params.dataIndex].value + '%';
    	                    	}
    	                    	return data[params.dataIndex].value;
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
        this.getChart = function(param){
        	return $http.get('/ovu-pcos/pcos/liftreport/person/chart/person.do?timeDim='+param).then(function(resp) {
        		return resp.data;
        	});
        }
         this.getMonth=function(){
			return $http.get('/ovu-pcos/pcos/liftreport/person/chart/workunit.do').then(function(resp) {
        		return resp.data;
        	}); 
		 }

	 }]);

})()
