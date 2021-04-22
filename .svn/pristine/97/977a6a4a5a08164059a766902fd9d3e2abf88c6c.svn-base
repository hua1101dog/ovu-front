/**
 * Created by Zn on 2017/11/21.
 */
(function (angular) {
    "use strict";
    var app = angular.module("angularApp");
    app.controller('energyCategoryCtrl', function ($scope, $rootScope, $uibModal, $state, $http, $filter, fac){
        document.title='能源分类分项统计';
        $scope.selected=1;
        $scope.search={}
        var startTime=moment().subtract(1, 'months').format('YYYY-MM-DD');
        var endTime=moment().format('YYYY-MM-DD');
        $scope.config={
            edit:false
        }
        $scope.callback=function () {
            $scope.initTreeData();
            $scope.find();
            $scope.toggleYear();
        }
          //图表resize事件
          window.onresize = function(){
            $rootScope.$broadcast("onWindowResize");
        }
        app.modulePromiss.then(function () {
            $scope.search = {
              year:moment().year(),
              isGroup: fac.isGroupVersion(),
              timeDim:'day'
            };
            $scope.search.startTime=startTime;
            $scope.search.endTime=endTime;
            $scope.$watch('dept.id', function (deptId, oldValue) {
                if (deptId) {
                    if ($scope.dept.parkId) {
                        $scope.search.parkId = $scope.dept.parkId;
                        $scope.search.parkName = $scope.dept.parkName;
                        $scope.callback();
                    } else {
                        alert('请选择跟项目关联的部门');
                        $scope.search.parkId &&  delete $scope.search.parkId
                        $scope.search.parkName &&  delete $scope.search.parkName;
                    }

                }

            })
        })
        function energyConsumeAll(data1,data2){
            var myChartEnergyCA = echarts.init(document.getElementById('energyConsumeAll'));
            var energyConsumeAllOption={
                title:{
                    text:'能源消耗总量',
                    subtext: data1
                },
                tooltip: {
                    trigger: 'item',
                    formatter: "{a} <br/>{b}: {c} ({d}%)"
                },
                legend: {
                    orient: 'vertical',
                    x: 'right',
                    y:'center',
                    data:['能源消耗总量']
                },
                series: [
                    {
                        name:'能源消耗总量',
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
                        },
                        data:[
                            {value:data2, name:'能源消耗总量'}
                        ]
                    }
                ]
            };
            myChartEnergyCA.setOption(energyConsumeAllOption);
            //图标自适应大小
            window.addEventListener('resize', function () {
                myChartEnergyCA.resize();
    
            });

        }
        function energyConsumeFenXiangCount(data1,data2){
            var myChartFenX = echarts.init(document.getElementById('energyConsumeFenXiangCount'));
         var option={
            title : {
                text: '能源消耗分项统计',
                subtext: data1,
                x:'center'
            },
            tooltip : {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            legend: {
                orient: 'vertical',
                x: 'right',
                y:'center',
                data: ['动力用电','公共用电','空调用电']
            },
            series : [
                {
                    name: '',
                    type: 'pie',
                    radius : '55%',
                    center: ['50%', '60%'],
                    data:data2,
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
         myChartFenX.setOption(option);
         //图标自适应大小
         window.addEventListener('resize', function () {
            myChartFenX.resize();
 
         });

        }
         function energyLineTrendData(year,data1,data2){
          
            var myChart = echarts.init(document.getElementById('energyLineTrendData'));
            window.onresize = myChart.resize;
            var option={
                title: {
                    text: year+'年月度能源消耗趋势图',
                    left: 'center'
                },
                tooltip: {
                    trigger: 'axis',
                   formatter: function (params) {
                     if(params instanceof Array){
                         return  params[0].name
                             +'<br />本月数据：'+ params[0].value+'<br />'
                             +'环比上月：'+($scope.monthHuan[params[0].dataIndex]==undefined?'无数据':$scope.monthHuan[params[0].dataIndex])+'<br />'
                             +'去年同月数据：'+(params.length==2?params[1].value:"无数据")+'<br />'
                             +'同比去年本月：'+($scope.monthTong[params[0].dataIndex]==undefined?'无数据':$scope.monthTong[params[0].dataIndex]);
                     }
                    }
                },
                legend: {
                    orient: 'vertical',
                    x: 'right',
                    y:'center',
                    data: ['本月数据', '去年同月数据']
                },
                xAxis: {
                    type: 'category',
                   // name: 'x',
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
                    type: 'value'
                    //name: 'y'
                },
                series: [
                    {
                        name: '本月数据',
                        type: 'line',
                        data: data1,
                        markLine: {
                            symbol:"none",
                            data: [
                              { type: 'average',
                                name: '平均值',
                                lineStyle: {
                                  normal: {
                                    color: "green",
                                    width: 2,
                                    type: "solid"
                                  }
                                },
                                label:{
                                  normal:{
                                    formatter:'平均值\n{c}',
                                    position:'middle'
                                  }
                                }
                              }
                            ]
                        }
                    },
                    {
                        name: '去年同月数据',
                        type: 'line',
                        data: data2,
                        markLine: {
                            symbol:"none",
                            data: [
                              { type: 'average',
                                name: '平均值',
                                lineStyle: {
                                  normal: {
                                    color: "blue",
                                    width: 2,
                                    type: "solid"
                                  }
                                },
                                label:{
                                  normal:{
                                    formatter:'平均值\n{c}',
                                    position:'middle'
                                  }
                                }
                              }
                            ]
                        }
                    }
                ]
            };
            myChart.setOption(option);
            //图标自适应大小
            window.addEventListener('resize', function () {
                myChart.resize();
    
            });
         }
        
        function energyColumnTrendData(year,data1,data2){
            var myChart = echarts.init(document.getElementById('energyColumnTrendData'));
            var option={
                title: {
                    text: year+'年月度能源消耗趋势图',
                    left: 'center'
                },
                tooltip : {
                    trigger: 'axis',
                    formatter: function (params) {
                        if(params instanceof Array){
                            return  params[0].name
                                +'<br />本月数据：'+ params[0].value+'<br />'
                                +'环比上月：'+($scope.monthHuan[params[0].dataIndex]==undefined?'无数据':$scope.monthHuan[params[0].dataIndex])+'<br />'
                                +'去年同月数据：'+(params.length==2?params[1].value:"无数据")+'<br />'
                                +'同比去年本月：'+($scope.monthTong[params[0].dataIndex]==undefined?'无数据':$scope.monthTong[params[0].dataIndex]);
                        }
                    }
                },
                legend: {
                    orient: 'vertical',
                    x: 'right',
                    y:'center',
                    data:['本月数据','去年同月数据']
                },
                xAxis : [
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
                    }
                ],
                yAxis : [
                    {
                        type : 'value'
                    }
                ],
                series : [
                    {
                        name:'本月数据',
                        type:'bar',
                        data:data1,
                        markLine: {
                            data: [
                                {type: 'average', name: '平均值'}
                            ]
                        }
                    },
                    {
                        name:'去年同月数据',
                        type:'bar',
                        data:data2,
                        markLine: {
                            data: [
                                {type: 'average', name: '平均值'}
                            ]
                        }
                    }
                ]
            };
            myChart.setOption(option);
            //图标自适应大小
            window.addEventListener('resize', function () {
                myChart.resize();
    
            });
        }
       
        $scope.initTreeData=function () {
            $http.post("/ovu-energy/energy/classify/tree",fac.postConfig).success(function (data) {
                $scope.treeData = data.data;
            });
        };
        $scope.selectNode = function (search,item) {
            
         
            if(item.state.selected){
                if (item.parentId==='0') {
                    $scope.search.classifyId= item.id;
                    $scope.search.itemId='';
                }
                else {
                    $scope.search.classifyId=item.parentId;
                    $scope.search.itemId=item.id;
                }
                $scope.find();
                $scope.toggleYear();
            }
        };
        $scope.find=function () {
            if (!$rootScope.dept || !$rootScope.dept.id) {
                alert("请选择部门！");
                return false;
            }
            if($scope.search.startTime || $scope.search.endTime){
                $scope.selected=0;
                $scope.search.timeDim=""
             }
            $http.post("/ovu-energy/energy/stats/classifyitem",$scope.search,fac.postConfig).success(function (data) {
                var data=data.data;
                
                if(fac.isEmpty(data.itemList)){
                    // $scope.energyConsumeAll.title.subtext='';
                    $scope.energyConsumeFenXiangCount.title.subtext='';
                    // $scope.energyConsumeAll.series[0].data[0].value=0;
                    $scope.energyConsumeFenXiangCount.series[0].data=[];
                }
                else {
                    // $scope.energyConsumeAll.title.subtext='单位：'+data.itemList[0].unit;
                    // $scope.energyConsumeFenXiangCount.title.subtext='单位：'+data.itemList[0].unit;
                    // $scope.energyConsumeAll.series[0].data[0].value=data.total.value;
                    // $scope.energyConsumeFenXiangCount.series[0].data=data.itemList;
                }
                var title='单位：'+data.itemList[0].unit || ''
                data.total.value =data.total.value || 0
                data.itemList=data.itemList || []
                energyConsumeAll(title,data.total.value)
                energyConsumeFenXiangCount(title,data.itemList)

            });
        }
        $scope.findTime=function () {
            $scope.search.startTime='';
            $scope.search.endTime='';
            $scope.find()
        }
        $scope.selectTime = function (time) {
            $scope.search.timeDim=time;
            $scope.findTime();
        }
        $scope.toggleYear=function () {
            $http.post("/ovu-energy/energy/stats/classifyitem/trend",$scope.search,fac.postConfig).success(function (data) {
                data = data.data;
                var prevMonthValue=[];
                var monthValue=[];
                $scope.monthTong=[];
                $scope.monthHuan=[];
                if(!fac.isEmpty(data.prevYear)){
                  data.prevYear.forEach(function (prevMonthData) {
                    prevMonthValue.push(prevMonthData.value);
                  });
                }
                if(!fac.isEmpty(data.year)){
                  data.year.forEach(function (monthData) {
                    monthValue.push(monthData.value);
                    $scope.monthTong.push(monthData.yoyPercent);
                    $scope.monthHuan.push(monthData.momPercent);
                  });
                }
                // $scope.energyLineTrendData.series[0].data=monthValue;  //本月
                // $scope.energyLineTrendData.series[1].data=prevMonthValue; //上月
                // $scope.energyColumnTrendData.series[0].data=monthValue;  //本月
                // $scope.energyColumnTrendData.series[1].data=prevMonthValue;
                // $scope.energyLineTrendData.title.text=$scope.search.year+'年月度能源消耗趋势图';
                // $scope.energyColumnTrendData.title.text=$scope.search.year+'年月度能源消耗趋势图';
              
                if($scope.isLine){
                    energyLineTrendData($scope.search.year,monthValue,prevMonthValue)
                  
                  }else{
                    energyColumnTrendData($scope.search.year,monthValue,prevMonthValue)
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
            $scope.toggleYear()
        };
    });
})(angular)
