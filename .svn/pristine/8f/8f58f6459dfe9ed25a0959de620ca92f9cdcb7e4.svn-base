(function (angular) {
    "use strict";
    var app = angular.module("angularApp");
    app.controller('energyConsumptionCtrl', function ($scope, $rootScope, $uibModal, $state, $http, $filter, fac) {
        document.title = '业态能耗统计';
        // var startTime=moment().subtract(1, 'months').format('YYYY-MM-DD');
        var startTime = moment().format('YYYY-MM-DD');
        var endTime = moment().format('YYYY-MM-DD');
        $scope.search = {}
        $scope.selects = 1;
        $scope.callback = function () {
            $scope.findTypes();
            $scope.find();
            $scope.toggleYear();
        }
        app.modulePromiss.then(function () {
            $scope.search = {
                year: moment().year(),
                timeDim: 'day',
                meterType: '1',
                isGroup: fac.isGroupVersion()
            };
            $scope.search.startTime = startTime;
            $scope.search.endTime = endTime;
            $scope.callback();
        })
        $scope.isLine=true;
        $scope.isColumn=false;
        $scope.width=$(window).width()-300
        function parkList(data1, data2) {
            var myChartPark = echarts.init(document.getElementById('parkList'));
            var   parkListOption = {
                title: {
                    text: '各业态项目数',
                },
                tooltip: {
                    trigger: 'item',
                    formatter: "{b}({d}%)"
                },
                legend: {
                    orient: 'vertical',
                    x: 'right',
    
                    data: data1
                },
                series: [{
                    type: 'pie',
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
                    data: data2
                }]
            };
            myChartPark.setOption(parkListOption);
            //图标自适应大小
            window.addEventListener('resize', function () {
                myChartPark.resize();

            });
      }
      function meterList(data1, data2) {
        var myChartMeter = echarts.init(document.getElementById('meterList'));
        var   meterOption =    {
            title: {
            text: '各业态仪表数',
        },
        tooltip: {
            trigger: 'item',
            formatter: "{b}({d}%)"
        },
        legend: {
            orient: 'vertical',
            x: 'right',

            data: data1
        },
        series: [{
            type: 'pie',
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
            data: data2
        }]
        };
        myChartMeter.setOption(meterOption);
        //图标自适应大小
        window.addEventListener('resize', function () {
            myChartMeter.resize();

        });
       }
       function energyList(data1, data2) {
        var myChartEnergy = echarts.init(document.getElementById('energyList'));
        var   energyListOption = {
            title: {
                text: '各业态能耗量',
            },
            tooltip: {
                trigger: 'item',
                formatter: "{b}({d}%)"
            },
            legend: {
                orient: 'vertical',
                x: 'right',

                data: data1
            },
            series: [{
                type: 'pie',
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
                data: data2
            }]
        };
        myChartEnergy.setOption(energyListOption);
     
        //图标自适应大小
        window.addEventListener('resize', function () {
            myChartEnergy.resize();

        });
       }
       function energyLine(year, data1, data2,data3) {
        var myChartEnergy1 = echarts.init(document.getElementById('energyLineTrend'));
        window.onresize = myChartEnergy1.resize;
        $scope.engeryOption = {
            title: {
                text: year + '年月度各业态能源消耗趋势图',
                left: 'center'
            },
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                orient: 'vertical',
                x: 'right',
                data: data1
            },
            xAxis: {
                type: 'category',
                name: 'x',
                splitLine: {
                    show: false
                },
                data: data2,
                //设置字体竖直
                axisLabel: {
                    interval: 0,
                    formatter: function (value) {
                        return value && value.split("").join("\n");
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
            series: data3
        };
        myChartEnergy1.setOption($scope.engeryOption);
        //图标自适应大小
        window.addEventListener('resize', function () {
            myChartEnergy1.resize();

        });
      }
      function energyColumn(year,data1,data2,data3){
     
        var myChartEnergyColumn = echarts.init(document.getElementById('energyColumnTrend'));
        window.onresize = myChartEnergyColumn.resize();
        $scope.energyColumnOption = {
            title: {
                text: year + '年月度各业态能源消耗趋势图',
                left: 'center'
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: { // 坐标轴指示器，坐标轴触发有效
                    type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
                }
            },
            legend: {
                orient: 'horizontal',
                x: 'center',
                padding: [35, 5],
                data: data1,
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },

            xAxis: {
                type: 'category',
                data: data2,
                //设置字体竖直
                axisLabel: {
                    interval: 0,
                    formatter: function (value) {
                        return value && value.split("").join("\n");
                    }
                }
            },
            yAxis: {
                type: 'value'
            },
            series: [{
                type: 'bar',
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
                data: data3
            }]
        };
        myChartEnergyColumn.setOption($scope.energyColumnOption);
        //图标自适应大小
        window.addEventListener('resize', function () {
            myChartEnergyColumn.resize();

        });
      }
        $scope.findTypes = function () {
            $http.get('/ovu-energy/energy/classify/list').success(function (res) {
                if (res.code == 0) {
                    $scope.classifyList = res.data;
                } else {
                    alert(res.msg);
                }
            })
        };
        $scope.find = function () {
            if ($scope.search.startTime && ($scope.search.startTime !== startTime)) {
                $scope.selects = 0;
                $scope.search.timeDim = ""
            }
            $http.post("/ovu-energy/energy/stats/parkformat/chart", $scope.search, fac.postConfig).success(function (data) {
                var data = data.data;
                var parkNameList = [];
                var meterNameList = [];
                var energyNameList = [];
                data.parkList && data.parkList.forEach(function (v) {
                    $scope.yetaiDict.forEach(function (value) {
                        if (v.name == value[0]) {
                            v.name = value[1]
                            v.name += ':' + v.value
                        }
                    })
                    parkNameList.push(v.name);
                });
                data.meterList &&  data.meterList.forEach(function (v) {
                    $scope.yetaiDict.forEach(function (value) {
                        if (v.name == value[0]) {
                            v.name = value[1]
                            v.name += ':' + v.value
                        }
                    })
                    meterNameList.push(v.name);
                });
                data.energyList.forEach(function (v) {
                    $scope.yetaiDict.forEach(function (value) {
                        if (v.name == value[0]) {
                            v.name = value[1]
                            v.name += ':' + v.value
                        }
                    })
                    energyNameList.push(v.name);
                });
                // $scope.parkList.series[0].data = data.parkList=data.parkList || [];
                // $scope.parkList.legend.data = parkNameList;
                data.parkList=data.parkList || [];
                data.meterList=data.meterList || [];
                data.energyList=data.energyList || [];
                // $scope.meterList.series[0].data = data.meterList;
                // $scope.meterList.legend.data = meterNameList;
                // $scope.energyList.series[0].data = data.energyList;
                // $scope.energyList.legend.data = energyNameList;
                parkList(parkNameList,data.parkList);
                meterList(meterNameList, data.meterList)
                energyList(energyNameList,data.energyList)
            });
        }
       
       
        $scope.toggleYear = function () {
            // $scope.energyLineTrendData.title.text = $scope.search.year + '年月度各业态能源消耗趋势图';
            // $scope.energyColumnTrendData.title.text = $scope.search.year + '年月度各业态能源消耗趋势图';
            $http.get("/ovu-energy/energy/stats/parkformat/trend", {
                params: {
                    meterType: $scope.search.meterType,
                    year: $scope.search.year
                }
            }, fac.postConfig).success(function (data) {
                data = data.data;
                var tempLine = {
                    name: '水',
                    type: 'line',
                    data: []
                }
                var tempColumn = {
                    name: '水',
                    type: 'bar',
                    barWidth: 30,
                    stack: '总量',
                    label: {
                        normal: {
                            show: true,
                            position: 'inside',
                            color: '#ffd366'
                        }
                    },
                    data: []
                }
                var seriesColumn = [];
                var seriesLine = [];
                var energyName = [];
                var monthList = [];
                if (!fac.isEmpty(data)) {
                    data.forEach(function (monthData, index1) {
                        monthList.push(monthData.month);
                        monthData.formatList.forEach(function (classify, index2) {
                            $scope.yetaiDict.forEach(function (value) {
                                if (classify.name == value[0]) {
                                    classify.name = value[1];
                                    if (index1 == 0) {
                                        var copyColumn = angular.copy(tempColumn);
                                        var copyLine = angular.copy(tempLine);

                                        copyColumn.name = classify.name;
                                        copyLine.name = classify.name;
                                        copyColumn.data.push(classify.value);
                                        copyLine.data.push(classify.value);
                                        seriesColumn.push(copyColumn);
                                        seriesLine.push(copyLine);
                                        energyName.push(classify.name);
                                    } else {
                                        seriesColumn[index2] && seriesColumn[index2].data.push(classify.value);
                                        seriesLine[index2] && seriesLine[index2].data.push(classify.value);
                                    }
                                }
                            })

                        });
                    });
                    // $scope.energyLineTrendData.xAxis.data = monthList;
                    // $scope.energyColumnTrendData.xAxis.data = monthList
                    // $scope.energyLineTrendData.legend.data = energyName;
                    // $scope.energyColumnTrendData.legend.data = energyName;
                    // $scope.energyColumnTrendData.series[0].data = seriesLine[0].data;
                    // $scope.energyLineTrendData.series = seriesLine;





                }
              if($scope.isLine){
                energyLine($scope.search.year,energyName,monthList,seriesLine)
              
              }else{
                energyColumn($scope.search.year,energyName,monthList,seriesLine[0].data)
              }


            });
        }
      
        $scope.checkTypes = function (item) {
            $scope.search.meterType = item.type;
            $scope.find();
            $scope.toggleYear();
        };
        $scope.yetaiDict = [
                ['SY', "商业"],
                ['SX', "商业写字楼"],
                ['SZ', "商业住宅"],
                ['XZ', "写字楼"],
                ['PZ', "普通住宅"],
                ['BZ', "别墅住宅"],
                ['YQ', "产业园区"],
                ['ZL', "展览馆"]
            ],
        $scope.findTime = function () {
            $scope.search.startTime = '';
            $scope.search.endTime = '';
            $scope.find();
        }
        $scope.selectTime = function (time) {
            $scope.search.timeDim = time;
            $scope.findTime();
        }
       
        $scope.toggleLine = function (flag) {
            if (flag) {
                $scope.isLine = true;
                $scope.isColumn = false;
               
            } else {
                $scope.isLine = false;
                $scope.isColumn = true;
            }
            $scope.toggleYear();
        };
      

      

    });
})(angular)
