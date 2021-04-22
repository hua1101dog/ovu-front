/**
 * Created by wangheng on 2017/8/28.
 */
(function() {
    "use strict";
    var app = angular.module("angularApp");
    app.controller('singVideoCtrl', function ($scope,$rootScope,$location, $http,fac) {
    	  var vm = this;
        document.title ="单一视频监控";
        angular.extend(vm,$rootScope.singleVideoParam);
        var urlP=$location.url().split("=");
        var firePointId= urlP[1];
        //图表配置
        var option={
        		tooltip : {
                    trigger: 'item',
                    formatter: "{a} <br/>{b} : {c} ({d}%)"
                },
                legend: {
                    data: []
                },
                series : [
                    {
                        name: '消防工单',
                        type: 'pie',
                        radius : '55%',
                        center: ['50%', '60%'],
                        data:[
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
        }


        //视频历史
       /* $http.get('/ovu-pcos/system/video/recordHistory.do?equipmentId='+vm.equipmentId).success(function(data){
       	 	vm.historyList=data || [];
        })*/

        //查看历史
        vm.clickHistory = function(url){
        	vm.historyUrl=url;
        }

        //图标数据以及传感器
        // $http.get('/ovu-pcos/pcos/fire/firemonitor/detail.do?firePointId='+vm.firePointId).success(function(data){
            $http.get('/ovu-pcos/pcos/fire/firemonitor/detail.do?firePointId='+firePointId).success(function(data){
        	var names=[];
            data.chartList.forEach(function(chart) {
              chart.name += '('+chart.value+')';
              names.push(chart.name);
            });
            option.series[0].data=data.chartList || [];
            option.legend.data = names;
            vm.eventOption=option;
            vm.sensorList = data.sensorList;
            })

          //事件列表
          $scope.pageModel = {};
          $scope.search= {firePointId:vm.firePointId};
          $scope.find = function(pageNo){
               angular.extend($scope.search,{currentPage:pageNo||$scope.pageModel.currentPage||1,pageSize:$scope.pageModel.pageSize||10});
               fac.getPageResult("/ovu-pcos/pcos/fire/firemonitor/event.do",$scope.search,function(data){
                   $scope.pageModel = data;
               });
          };
          $scope.find();
    });

})();
