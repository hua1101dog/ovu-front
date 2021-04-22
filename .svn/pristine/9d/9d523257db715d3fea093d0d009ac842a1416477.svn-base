/**
 * 工单综合报表
 */
(function() {
	'use strict';
	
	document.title = "工单综合报表";
	var app = angular.module("angularApp");
	
	app.controller('TicketCtrl',TicketCtrl);
	TicketCtrl.$inject=['$scope','$timeout','$uibModal','TicketService','fac'];
	function TicketCtrl($scope,$timeout,$uibModal,TicketService,fac){
		var vm = this;
		angular.extend($scope, fac.dicts);
		
        $scope.pageModel = {};
		$scope.search = {status :'',origin :'',type:''};
		//分页表格
	    $scope.find = function(pageNo){
			if(!$scope.search.EXEC_NAME){
                delete $scope.search.execPersonId;
            }
	    	angular.extend($scope.search, { currentPage: pageNo || $scope.pageModel.currentPage || 1, pageSize: $scope.pageModel.pageSize || 10 });
            $scope.search.pageIndex = $scope.search.currentPage - 1;
            fac.getPageResult("/ovu-pcos/pcos/liftreport/workunit/list.do", $scope.search, function(data) {
                $scope.pageModel = data;
            });	
	    }
	    //图表数据
	    vm.selectTime = function(time) {
	    	TicketService.getChart(time).then(function(data){
	    		//工单类型分布
	    		var typeOption=TicketService.getElevatorOption();
	    		typeOption.title.text = "工单类型分布";
	    		typeOption.series[0].data=data.typeList || [];
	    		typeOption.legend.data = data.typeList.map(function(mode) {
					   return mode.name;
				}) || [];
	    		vm.typeOption = typeOption; 
	    		//电梯品牌
	    		var statusOption=TicketService.getElevatorOption();
	    		statusOption.title.text = "工单状态统计";
	    		statusOption.series[0].data=data.statusList || [];
	    		statusOption.legend.data = data.statusList.map(function(mode) {
	    			return mode.name;
	    		}) || [];
	    		vm.statusOption = statusOption; 
			});
        }
		$scope.selectedExecPerson=function(item,search){
            search.execPersonId=item.id;
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
	app.service('TicketService',['$http', function ($http) {
        //电梯品牌统计，空心扇形图都可以用
        this.getElevatorOption = function(){
            return angular.merge({},{
            	title: {
                    left:'center'
                },
		   		tooltip: {
			        trigger: 'item',
			        formatter: "{a} <br/>{b}: {c} ({d}%)"
			    },
			    legend: {
			        data:['日历','格力','互看了','视频广告','搜索引擎'],
			        bottom:'5%'
			    },
			    series: [
			        {
			            name:'访问来源',
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
        
        this.getChart = function(param){
        	return $http.get('/ovu-pcos/pcos/liftreport/workunit/chart.do?timeDim='+param).then(function(resp) {
        		return resp.data;
        	});
        }
	            

	 }]);
	
})()
