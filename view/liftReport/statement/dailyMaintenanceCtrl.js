/**
 * 日常维修报表
 */
(function() {
    'use strict';
    document.title = "日常维修报表";
    var app = angular.module("angularApp");

    app.config(function($mdThemingProvider) {
        $mdThemingProvider
            .theme("default")
            .primaryPalette("cyan")
            .accentPalette("light-green");
    });

    app.controller('DailyMaintenanceCtrl',function($scope, $timeout,$q,DailyMaintenanceService,fac) {
        var vm = this;
        //是否展示详情
        vm.ifShowDetail =false;
        vm.time = moment().format("YYYY");
        vm.selectedTime=moment().format("YYYY-MM");
        var promise;
        //查询图表数据
        vm.init = function(){
            DailyMaintenanceService.getList(vm.time).then(function(data){
                vm.list=data;
                var option=DailyMaintenanceService.getDailyMaintenanceOption();
                var xList=[];
                var series0=[];
                var series1=[];
                data.forEach(function(da){
                    xList.push(da.month);
                    series0.push(da.plan);
                    series1.push(da.finish);
                })
                option.series[0].data=series0;
                option.series[1].data=series1;
                option.xAxis.data =xList;
                vm.dailyMaintenanceOption=option;
            });
        }

        //获取日历
        vm.getCalendar = function(){
            promise = asyncGetCalendar();
        }
        vm.getCalendar();
        //异步获取数据，返回promise承诺
        function asyncGetCalendar(){
            var deferred = $q.defer();
            DailyMaintenanceService.getCalendar(vm.selectedTime).then(function(data){
                var obj={};
                data && data.forEach(function(da){
                    obj[da.day]=da.status;
                })
                deferred.resolve(obj);
            });
            return deferred.promise;
        }

        //已选择的日期
        $scope.selectedDate = new Date();
        //每周从周天开始
        $scope.weekStartsOn = 0;
        $scope.dayFormat = "d";
        //禁用未来的日期
        $scope.disableFutureDates = false;

        //自定义按钮点击事件
        $scope.customClick= function (type,date) {
            $scope.search={time:moment(date).format("YYYY-MM-DD"),status:type};
            $scope.find();
            vm.ifShowDetail =true;
        }

        $scope.pageModel = {};

        $scope.find = function(pageNo){
            angular.extend($scope.search, { currentPage: pageNo || $scope.pageModel.currentPage || 1, pageSize: $scope.pageModel.pageSize || 10 });
            $scope.search.pageIndex = $scope.search.currentPage - 1;
            fac.getPageResult("/ovu-pcos/pcos/liftreport/stats/daily/calendar/detail.do", $scope.search, function(data) {
                $scope.pageModel = data;
            });
        }
        //上一月
        $scope.prevMonth = $scope.nextMonth = function(data) {
            vm.selectedTime = data.year+'-'+data.month;
            vm.getCalendar();
        };

        var button1="<div class='text-center'><div><button class='btn btn-warning btn-xs p-xs'  ng-click='customClick({t:1,day:day})'>待完成</button></div>";
        var button2="<div class='text-center'><div><button class='btn btn-success btn-xs p-xs'  ng-click='customClick({t:2,day:day})'>已完成</button></div>";
        var button3="<div class='text-center'><div><button class='btn btn-danger btn-xs p-xs'  ng-click='customClick({t:3,day:day})'>已超期</button></div>";
        var buttonArray =[button1,button2,button3];
        //设置具体每天的内容，可以异步
        $scope.setDayContent = function(date) {
            var deferred = $q.defer();
            promise.then(function(obj) {
                var time=moment(date).format("YYYY-MM-DD");
                if(Object.keys(obj).indexOf(time) != -1){
                    var buttons="";
                    var status = obj[time];
                    status && status.forEach(function(st){
                        buttons += buttonArray[st-1];
                    })
                    var data = buttons;
                    deferred.resolve(data);
                }
            })
            return deferred.promise;
        };
        //关闭详情
        vm.cancel = function(){
            vm.ifShowDetail =false;
        }

        //图表resize事件
        window.onresize = function(){
            $scope.$broadcast("onWindowResize");
        }

        vm.init();
    });
    /**
     * Service
     */
    app.service('DailyMaintenanceService',['$http', function ($http) {
        //日常保养报表。柱状图
        this.getDailyMaintenanceOption = function(){
            return angular.merge({}, {
                title: {
                    text: '日常保养报表',
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
                    data: ['应完成', '已完成']
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
                        name: '应完成',
                        type: 'bar',
                        data: [120,132, 101, 134,132, 101, 134,132, 101, 134,132, 101]
                    },
                    {
                        name: '已完成',
                        type: 'bar',
                        data: [120,132, 101, 134,132, 101, 134,132, 101, 134,132, 101]
                    }
                ]
            });
        }

        this.getList= function(param){
            return $http.get('/ovu-pcos/pcos/liftreport/stats/daily/list.do?time='+param).then(function(resp) {
                return resp.data;
            });
        }
        this.getCalendar= function(param){
            return $http.get('/ovu-pcos/pcos/liftreport/stats/daily/calendar.do?time='+param).then(function(resp) {
                return resp.data;
            });
        }
        this.getDetail= function(param){
            return $http.get('/ovu-pcos/pcos/liftreport/stats/daily/calendar/detail.do?time='+param.time+'&status='+param.status).then(function(resp) {
                return resp.data;
            });
        }

    }]);
})()
