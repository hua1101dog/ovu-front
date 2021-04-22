/**
 * 年度项目情况汇总
 */
(function() {
	'use strict';

	document.title = "项目综合报表";
	var app = angular.module("angularApp");

	app.controller('ProjectReportCtrl',ProjectReportCtrl);
	ProjectReportCtrl.$inject=['$scope','$timeout','$uibModal','ProjectReportService','fac'];
	function ProjectReportCtrl($scope,$timeout,$uibModal,ProjectReportService,fac){
		var vm = this;
        $scope.pageModel = {};
		$scope.search = {};
		//更换统一的项目选择器（修改）
        $scope.findPark = function () {
            var modal = $uibModal.open({
                animation: false,
                size: "lg",
                templateUrl: '/common/modal.select.parks.html',
                controller: 'parksSelectorCtrl',
                resolve: {
                    data: function () {
                        return { isOnly: true }
                    }
                }
            });
            modal.result.then(function (data) {
                //console.log(data);
                $scope.search.projectName = data.fullPath;
                $scope.search.projectId = data.ID;
            }, function () {

            });
        }
		//分页表格
	    $scope.find = function(pageNo){
	    	angular.extend($scope.search, { currentPage: pageNo || $scope.pageModel.currentPage || 1, pageSize: $scope.pageModel.pageSize || 10 });
            $scope.search.pageIndex = $scope.search.currentPage - 1;
            fac.getPageResult("/ovu-pcos/pcos/liftreport/project/list.do", $scope.search, function(data) {
                $scope.pageModel = data;
            });
	    }
	    //图表数据
	    vm.selectTime = function(time) {
	    	ProjectReportService.getChart(time).then(function(data){
				//工单总完成率
	    		vm.SuccessOption=ProjectReportService.getSuccessOption(data.finishedRateList);
				//项目工单类型分布及电梯数量
				vm.WorkAndElevatorOption=ProjectReportService.getWorkAndElevatorOption(data.totalList);
			});
        }

	   //图表resize事件
		window.onresize = function(){
			$scope.$broadcast("onWindowResize");
	    }
		//选择项目
		/*vm.findPark = function(){
			var modal = $uibModal.open({
				animation : false,
				size : 'sm',
				templateUrl : '/common.park.tree.html',
				controller : 'ParkTreeCtrl',
				resolve : {
				}
			});
			modal.result.then(function(node) {
				$scope.search.projectName=node.text;
				$scope.search.projectId=node.did;
				if(fac.isEmpty(node.did)){
					$scope.search.projectName='';
				}
			}, function() {
				console.info('Modal dismissed at: '
						+ new Date());
			});
		}
*/
		 vm.selectTime('year');
	     $scope.find();
	}
	/**
	 * Service
	 */
	app.service('ProjectReportService',['$http', function ($http) {
	    //各项目工单类型分布及电梯数量，包含柱形图以及折线图
        this.getWorkAndElevatorOption = function(data){
        	var nameList=[];
        	var liftList=[];
        	var planList=[];
        	var emergencyList=[];
        	data && data.forEach(function(da){
        		nameList.push(da.name);
        		liftList.push(da.liftTotal);
        		planList.push(da.planTotal);
        		emergencyList.push(da.emergencyTotal);
        	})
            return angular.merge({}, {
            	title: {
                    text: '各项目工单类型分布及电梯数量',
                    left:'center'
                },
                tooltip : {
                    trigger: 'axis',
                    axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                        type : 'line'        // 默认为直线，可选为：'line' | 'shadow'
                    }
                },
                legend: {
                    data: ['应急工单', '维保工单','电梯数量'],
                    orient: 'vertical',
					top:'middle',
					left:'80%',
                },
                grid: {
                    left: '3%',
                    right: '20%',
                    bottom: '10%',
                    top:'15%',
                    containLabel: true
                },
                yAxis:  {
                    type: 'value'
                },
                xAxis: {
                    type: 'category',
                    data: nameList
                },
                series: [
                    {
                        name: '应急工单',
                        type: 'bar',
                        stack: '工单',
                        label: {
                            normal: {
                                show: false

                            }
                        },
                        data: emergencyList
                    },
                    {
                        name: '维保工单',
                        type: 'bar',
                        stack: '工单',
                        label: {
                            normal: {
                                show: false

                            }
                        },
                        data: planList
                    },
                    {
                        name:'电梯数量',
                        type:'line',
                        data: liftList
                    }
                ]
            });
        }

        //工单完成率统计。用于进度条类似
        this.getSuccessOption = function(data){
        	var optionData=[];
        	var yaxisData=[];
        	var otherData=[];
        	data && data.reverse() && data.forEach(function(v,i){
        		if(v.finishedRate){
        			v.value=v.finishedRate.replace(/%/, "");
        		}
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
            		text : '各项目工单完成率Top10',
            		left:'center'
            	},
                tooltip: {
                    trigger: 'axis',
                    formatter: function(obj){
                    	  return obj[1].name + ' : 完成率(' + obj[1].value + '%)';
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

        this.getChart = function(param){
        	return $http.get('/ovu-pcos/pcos/liftreport/project/chart.do?timeDim='+param).then(function(resp) {
        		return resp.data;
        	});
        }


	 }]);

	//项目选择控制器
	app.controller('ParkTreeCtrl', function ($scope, $http, $uibModalInstance, $filter,$timeout, fac) {
		$http.post("/ovu-base/system/park/tree.do", {parkType:0}).success(function(data){
	        if(fac.isNotEmpty(data)){
	        	data.unshift({did:'',text:'无'});
	        	var $checkableTree = $('#parkModalTree').treeview({
			        data:  data,
			        showIcon: false,
			        showCheckbox: false,
			        onNodeSelected: function(event, node) {
			        	if(node.nodes && node.nodes.length){
			        		return;
						}
			        	$uibModalInstance.close(node);
			        },
			        onNodeUnchecked: function (event, node) {
			        }
			    });
	        }
	    })
	    $scope.cancel = function () {
			$uibModalInstance.dismiss('cancel');
		};

	    $scope.save = function () {
			$uibModalInstance.close();
		};

	});

})()
