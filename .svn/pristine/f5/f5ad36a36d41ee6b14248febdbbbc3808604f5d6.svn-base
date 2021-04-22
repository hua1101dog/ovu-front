/**
 * Created by Zn on 2017/11/21.
 */
(function (angular) {
    "use strict";
    var app = angular.module("angularApp");
    app.controller('energySyntheticalCtrl', function ($scope, $rootScope, $uibModal, $state, $http, $filter,$ocLazyLoad, fac){
        document.title='能源综合统计';
        var startTime=moment().subtract(1, 'months').format('YYYY-MM-DD');
        var endTime=moment().format('YYYY-MM-DD');
        $scope.search={
            year:moment().year()
        };
        $scope.callback=function () {
            /*selectPark();*/
            $scope.find();
            $scope.toggleYear();
        }
        //图表resize事件
        window.onresize = function(){
            $rootScope.$broadcast("onWindowResize");
        }
        app.modulePromiss.then(function () {
           /* $scope.search = {isGroup: fac.isGroupVersion()};*/
            $scope.search.year=new Date().getFullYear();
            $scope.search.startTime=startTime;
            $scope.search.endTime=endTime;
            $scope.callback();
           
        })
        function intCategoryData(data1,data2){
            var myChartEnergyC = echarts.init(document.getElementById('energyCategory'));
            var   eCOption = {
                title:{
                    text:'能源消耗分类分布'
                },
                tooltip: {
                    trigger: 'item',
                    formatter: "{a} <br/>{b}<!--: {c} ({d}%)-->"
                },
                legend: {
                    orient: 'vertical',
                    x: 'right',
                    y:'center',
                    data: data1
                },
                series: [
                    {
                        name:'能源消耗',
                        type:'pie',
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
                        data: data2
                    }
                ]
            };
            myChartEnergyC.setOption(eCOption);
            //图标自适应大小
            window.addEventListener('resize', function () {
                myChartEnergyC.resize();
    
            });
        }
        function intLineData(data1,data2){
            var myChartEnergyC = echarts.init(document.getElementById('everyEnergyData'));
            var   eCOption = {
                title:{
                    text:"项目能源能耗TOP10"
                },
                color: ['#3398DB'],
                tooltip : {
                    trigger: 'axis',
                    axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                        type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                    }
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis : [
                    {
                        type : 'value',
                        axisLabel: {  
                            interval:0,  
                            rotate:40  
                         }  
                    }
                ],
                yAxis : [
                    {
                        type : 'category',
                        data : data1,
                    }
                ],
                series : [
                    {
                        name:'能耗值',
                        type:'bar',
                        barWidth: 30,
                        data:data2
                    }
                ]
            };
            myChartEnergyC.setOption(eCOption);
            //图标自适应大小
            window.addEventListener('resize', function () {
                myChartEnergyC.resize();
    
            });
        }
        function Line(year, data1, data2) {
            var myChartLine = echarts.init(document.getElementById('line'));
            $scope.engeryLineOption = {
                title: {
                    text: year + '年月度能源消耗趋势图',
                    left: 'center'
                },
                tooltip: {
                    trigger: 'axis'
                },
                legend: {
                    orient: 'vertical',
                    x: 'right',
                    y:'center',
                    data:data1
                },
                xAxis: {
                    type: 'category',
                    name: 'x',
                    splitLine: {show: false},
                    data: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月','十月','十一月','十二月'],
                    //设置字体竖直
                    axisLabel: {
                        interval: 0,
                        formatter:function(value)
                        {
                            return value&&value.split("").join("\n");
                        }
                    }
                },
    
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                yAxis: {
                    type: 'value',
                    name: 'y'
                },
                series: data2
            };
            myChartLine.setOption($scope.engeryLineOption);
            //图标自适应大小
            window.addEventListener('resize', function () {
                myChartLine.resize();
    
            });
          }
          function Column(year,data1,data2){
            var myChartColumn = echarts.init(document.getElementById('column'));
            $scope.energyColumn = {
                title: {
                    text: year + '年月度能源消耗趋势图',
                    left: 'center'
                },
                tooltip : {
                    trigger: 'axis',
                    axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                        type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                    }
                },
                legend: {
                    orient: 'horizontal',
                    x:'center',
                    padding:[35,5],
                    data:data1
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
    
                xAxis :
                    {
                        type : 'category',
                        data : ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月','十月','十一月','十二月'],
                        //设置字体竖直
                        axisLabel: {
                            interval: 0,
                            formatter:function(value)
                            {
                                return value&&value.split("").join("\n");
                            }
                        }
                    },
                yAxis: {
                    type: 'value'
                },
                series:data2
            };
            myChartColumn.setOption($scope.energyColumn);
            //图标自适应大小
            window.addEventListener('resize', function () {
                myChartColumn.resize();
    
            });
          }
        //根据项目查询
        $scope.searchProject = function (item) {
            /*$scope.search.parkId = item.parkId;*/
            sessionStorage.setItem("parkName",item.parkName);
            sessionStorage.setItem("parkId",item.parkId);
            // $state.go('three',{folder:'energy',catalogue:'energyCountAnalysis',page:'singleEnergy'});
            $ocLazyLoad.load("/view/energy/energyCountAnalysis/singleEnergyCtrl.js").then(() => {
                let pageUrl = "/view/energy/energyCountAnalysis/singleEnergy.html";
                let page = $rootScope.pages.find(n => n.url == pageUrl);
                if (!page) {
                    $rootScope.pages.push({text: '能源统计', url: pageUrl,global:true,oriUrl:pageUrl})
                }else{
                    page.hide = false;
                }
                setTimeout(() => {
                    $rootScope.pages.active = pageUrl;
                    $scope.$applyAsync();
                })
            })
        }
        $scope.find=function () {
            if (!$rootScope.dept || !$rootScope.dept.id) {
                alert("请选择部门！");
                return false;
            }
            if($scope.search.startTime || $scope.search.endTime){
                $scope.selected=0;
                $scope.search.timeDim=""
             }
            find();
        }
        function find() {
            $http.post("/ovu-energy/energy/stats/multi/classify",$scope.search,fac.postConfig).success(function (data) {
                /*categoryArr=data.classifyList;*/
                var classifyNameArr=[];
                var parkNameArr=[];
                data = data.data;
                for (var i = 0; i < data.classifyList.length; i++) {
                    data.classifyList[i].name=data.classifyList[i].name+'('+data.classifyList[i].value+data.classifyList[i].unit+')';
                    classifyNameArr.push(data.classifyList[i].name);
                }
                /* for (var j = 0; j < data.parkList.length; j++) {
                 parkNameArr.push(data.parkList[j].parkName);
                 }
                 console.log(data.classifyList);
                 console.log(parkNameArr);*/
                var parkValueArr=[];
                if(!fac.isEmpty(data.parkList)){
                    data.parkList.forEach(function (v) {
                        parkNameArr.push(v.parkName);
                        parkValueArr.push(v.value);
                    })
                }
                // $scope.energyCategoryData.series[0].data=data.classifyList;
                // $scope.energyCategoryData.legend.data=classifyNameArr;
                data.classifyList = data.classifyList || []
                intCategoryData(classifyNameArr,data.classifyList)
                // $scope.everyEnergyData.yAxis[0].data=parkNameArr;
                // $scope.everyEnergyData.series[0].data=parkValueArr;
                intLineData(parkNameArr,parkValueArr)

            });
        }
        function selectPark() {
            $http.get('/ovu-energy/energy/stats/park').success(function(resp) {
                $scope.projectsList = resp.data;
            });
        }
        selectPark();
        $scope.findTime=function () {
            $scope.search.startTime='';
            $scope.search.endTime='';
            $scope.find();
        }
        $scope.selectTime = function (time) {
            $scope.search.timeDim=time;
            $scope.findTime();
        }
        /*$scope.goSinglePro=function () {
         $state.go('three',{folder:'energy',catalogue:'energyCountAnalysis',page:'singleEnergy'});
         };*/
        /* var categoryArr;*/
        $scope.toggleYear=function () {
            $http.post('/ovu-energy/energy/stats/trend',$scope.search,fac.postConfig).success(function (data) {
                data = data.data;
                var tempLine={
                    name: '水',
                    type: 'line',
                    data: []
                }
                var tempColumn= {
                    name: '水',
                    type: 'bar',
                    barWidth :30,
                    stack: '总量',
                    label: {
                        normal: {
                            show: true,
                            position: 'inside',
                            color:'#ffd366'
                        }
                    },
                    data: []
                }
                var seriesColumn=[];
                var seriesLine=[];
                var energyName=[];
                if(!fac.isEmpty(data)){
                    data.forEach(function (monthData,index1) {
                        monthData.classifyList.forEach(function (classify,index2) {
                            if(index1 == 0){
                                var copyColumn = angular.copy(tempColumn);
                                var copyLine = angular.copy(tempLine);
                                /*  console.log(copy);*/
                                copyColumn.name= classify.name;
                                copyLine.name= classify.name;
                                copyColumn.data.push(classify.value);
                                copyLine.data.push(classify.value);
                                seriesColumn.push(copyColumn);
                                seriesLine.push(copyLine);
                                energyName.push(classify.name);
                            }else {
                                seriesColumn[index2].data.push(classify.value);
                                seriesLine[index2].data.push(classify.value);
                            }
                        });
                    });

                }
                if($scope.isLine){
                    Line($scope.search.year,energyName,seriesLine)
                  
                  }else{
                    Column($scope.search.year,energyName,seriesColumn)
                  }
    
            });
        }
        $scope.isLine=true;
        $scope.isColumn=false;
        $scope.toggleLine=function (flag) {
            if(flag){
                $scope.isLine=true;
                $scope.isColumn=false;
            }else {
                $scope.isLine=false;
                $scope.isColumn=true;
            }
            $scope.toggleYear();
        };
    });
})(angular)
