/**
 * Created by Zn on 2017/11/22.
 */
(function (angular) {
    "use strict";
    var app = angular.module("angularApp");
    app.controller('singleEnergyCtrl', function ($scope, $rootScope,$timeout, $uibModal, $state, $http, $filter, $ocLazyLoad, fac){
        document.title='能源综合统计';
        $scope.selected=1;
        $scope.search={}
     
        app.modulePromiss.then(function () {
            $scope.search={
                year:moment().year(),
                isGroup: fac.isGroupVersion(),
               timeDim:'day'
            }
            $scope.search.parkName=sessionStorage.getItem("parkName");
            $scope.search.parkId=sessionStorage.getItem("parkId");
            $http.post("/ovu-energy/energy/classify/list",fac.postConfig).success(function (data) {
                data = data.data;
                $scope.measureCategory=data || [];
                ($scope.measureCategory) && ($scope.search.classifyId = $scope.measureCategory[0].classifyId);
                $scope.find();
                $scope.toggleYear();
                $scope.toggleClassifyId();
            });
           
        })
        $scope.find=function () {
            if (!$rootScope.dept || !$rootScope.dept.id) {
                alert("请选择部门！");
                return false;
            }
            if($scope.search.startTime || $scope.search.endTime){
                $scope.selected=0;
                $scope.search.timeDim=""
             }
            $http.post('/ovu-energy/energy/stats/single/classify',$scope.search,fac.postConfig).success(function (data) {
                data = data.data;
                if(!fac.isEmpty(data)){
                    $scope.energyCategoryData.series[0].data=data.classifyList;
                    var classifyNameArr=[];
                    for (var i = 0; i < data.classifyList.length; i++) {
                        data.classifyList[i].name=data.classifyList[i].name+'('+data.classifyList[i].value+data.classifyList[i].unit+')';
                        classifyNameArr.push(data.classifyList[i].name);
                    }

                    $scope.energyCategoryData.legend.data=classifyNameArr;
                }
            })
            $scope.toggleClassifyId();
        }
        $scope.toggleClassifyId=function () {
            $http.post("/ovu-energy/energy/stats/single/classify/top10",$scope.search,fac.postConfig).success(function (data) {
                data = data.data;
                $scope.spaceData=data.spaceList;

            });
        }
        $scope.back=function () {
            // $state.go('three',{folder:'energy',catalogue:'energyCountAnalysis',page:'energySynthetical'});
            $ocLazyLoad.load("/view/energy/energyCountAnalysis/energySyntheticalCtrl.js").then(() => {
                let pageUrl = "/view/energy/energyCountAnalysis/energySynthetical.html";
               
                let page = $rootScope.pages.find(n => n.url == pageUrl);
                if (!page) {
                    $rootScope.pages.push({text: '能源综合统计', url: pageUrl,global:false,oriUrl:pageUrl})
                }else{
                    page.hide = false;
                }
                setTimeout(() => {
                    $rootScope.pages.active = pageUrl;
                    $scope.$applyAsync();
                })
            })
        }
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
                    stack: '总量',
                    barWidth :30,
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

                    $scope.energyLineTrendData.legend.data=energyName;
                    $scope.energyColumnTrendData.legend.data=energyName;
                    $scope.energyColumnTrendData.series=seriesColumn;
                    $scope.energyLineTrendData.series=seriesLine;
                    $scope.energyLineTrendData.title.text=$scope.search.year+'年月度能源消耗趋势图';
                    $scope.energyColumnTrendData.title.text=$scope.search.year+'年月度能源消耗趋势图';
                }
            });
        }
        $scope.findTime=function () {
            $scope.search.startTime='';
            $scope.search.endTime='';
            $scope.find();
        }
        $scope.selectTime = function (time) {
            $scope.search.timeDim=time;
            $scope.findTime();
            $scope.toggleClassifyId();
        }
        $scope.energyCategoryData={
            title:{
                text:'能源消耗分类分布'
            },
            tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b}({d}%)",
                textStyle:{
                    color:'black'
                }
            },
            legend: {
                orient: 'vertical',
                x: 'right',
                y:'center'
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
                            show: false,
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
                    }
                    /*data:[{name:"水",unit:"m³",value:"555"},
                     {name:"电",unit:"m³",value:"555"},
                     {name:"能耗",unit:"m³",value:"555"},
                     {name:"气",unit:"m³",value:"555"}]*/
                }
            ]
        };
        $scope.energyLineTrendData={
            title: {
                text: '能源消耗趋势图',
                left: 'center'
            },
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                orient: 'vertical',
                x: 'right',
                y:'center'
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
                        return value.split("").join("\n");
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
            }/*,
             series: [
             {
             name: '水',
             type: 'line',
             data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 150, 455]
             },
             {
             name: ' 电',
             type: 'line',
             data: [1, 2, 4, 8, 16, 32, 64, 128, 256,11,11,11]
             },
             {
             name: '能耗',
             type: 'line',
             data: [2, 1, 5, 6, 32, 34, 28, 16, 12,22,22,22]
             },
             {
             name: ' 气',
             type: 'line',
             data: [1, 3, 8, 6, 12, 24,18, 26, 12,33,33,33]
             }

             ]*/
        };
        $scope.energyColumnTrendData={
            title:{
                text:"各项目能源消耗分类统计"
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
                padding:[35,5]
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
                            return value.split("").join("\n");
                        }
                    }
                },
            yAxis: {
                type: 'value'
            }/*,
             series: [
             {
             name: '水',
             type: 'bar',
             stack: '总量',
             barWidth :30,
             label: {
             normal: {
             show: true,
             position: 'insideRight'
             }
             },
             data: [320, 302, 301, 334, 390,320, 302, 301, 334, 390, 330, 320]
             },
             {
             name: '电',
             type: 'bar',
             stack: '总量',
             barWidth :30,
             label: {
             normal: {
             show: true,
             position: 'insideRight'
             }
             },
             data: [320, 302, 301, 334, 390,120, 132, 101, 134, 90, 230, 210]
             },
             {
             name: '能耗',
             type: 'bar',
             stack: '总量',
             barWidth :30,
             label: {
             normal: {
             show: true,
             position: 'insideRight'
             }
             },
             data: [320, 302, 301, 334, 390,220, 182, 191, 234, 290, 330, 310]
             },
             {
             name: '气',
             type: 'bar',
             stack: '总量',
             barWidth :30,
             label: {
             normal: {
             show: true,
             position: 'insideRight'
             },
             position:'bottom'
             },
             data: [320, 302, 301, 334, 390,150, 212, 201, 154, 190, 330, 410]
             }
             ]*/
        };
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
        };
    });
})(angular)
