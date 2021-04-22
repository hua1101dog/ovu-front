//  多项目电梯概览
(function(angular, doc) {
    doc.title = "项目运营中心";

    angular.module('angularApp')
        .controller('multiProjectsOverviewController', ['$scope', '$http', '$location', function($scope, $http, $location) {

            // 项目列表
            $http.get('/ovu-pcos/pcos/liftreport/center/multi/projectlist.do')

            .success(function(resp) {
                $scope.projectsList = resp;
            });

            // 电梯保养概况 地图列表 电梯故障数top10 维保工月均完成工单数top10 维保工程师出勤率top10
            $http.get('/ovu-pcos/pcos/liftreport/center/multi/lift.do')

            .success(function(resp) {
                $scope.planingList = resp.planingList;
                $scope.keepingList = resp.keepingList;

                // 地图显示
                // 设置地图显示范围
                setMapBounds(resp.mapList);
                var markers = [];
                resp.mapList.forEach(function(da) {
                    if (da.longitude && da.latitude) {
                        var marker = addMarkers(da,1);;
                        markers.push(marker);
                    }
                })
                $scope.markers = markers;
                // 电梯故障数top10
                $scope.faultTopList = resp.faultTopList;
                // 维保工月均完成工单数TOP10
                $scope.workUnitTop = resp.workUnitTop;
                // 维保工程师出勤率TOP10
                $scope.attendanceRateTop = resp.attendanceRate.map(function(value) {
                    return {
                        name: value.NAME,
                        job: value.job,
                        attendanceRate: value.attendanceRate
                    }
                });

            });

            //地图基本配置
            $scope.mapOptions = {
                toolbar: true,
                // map-self config
                resizeEnable: false,
                // ui map config
                uiMapCache: false,
                zoom: 5,
                liteStyle: true,
               
            };

            //地图标记点事件
            $scope.mouseoverMaker = function($event, $params, marker) {
                $scope.markerData = marker.getExtData();
                $scope.myInfoWindow.open($scope.map, marker.getPosition());
            }

            // 设置地图范显示围  根据所有的点 求出需要显示的范围  如果list为空 显示武汉市
            function setMapBounds(list) {
                if (!list || !list.length) {
                    $scope.map.setCity('武汉市');
                } else {
                    var bounds = getBoundsByListData(list);
                    $scope.map.setBounds(bounds);
                }
            }
            // 根据list [{longitude:00.000000,latitude:00.000000,...},...] 数据获取地图显示范围
            function getBoundsByListData(list) {
                var lngArr = [],
                    latArr = [];
           
                list.forEach(function(v, i) {
                    if (v.longitude && v.latitude) {
                        lngArr.push(parseFloat(v.longitude));
                        latArr.push(parseFloat(v.latitude));
                    }
                });

                var minLng = Math.min.apply(null, lngArr),
                    maxLng = Math.max.apply(null, lngArr);

                var minLat = Math.min.apply(null, latArr),
                    maxLat = Math.max.apply(null, latArr);

                var deltaLng = maxLng - minLng,
                    deltaLat = maxLat - minLat;

                minLng -= 0.05 * deltaLng;
                minLat -= 0.05 * deltaLat;
                maxLng += 0.05 * deltaLng;
                maxLat += 0.05 * deltaLat;

                var southWest = new AMap.LngLat(minLng.toFixed(6), minLat.toFixed(6)),
                    northEast = new AMap.LngLat(maxLng.toFixed(6), maxLat.toFixed(6));

                return new AMap.Bounds(southWest, northEast);

            }

            //打点 更换图标（Zn）
            function addMarkers(data,index) {
                var marker = new AMap.Marker({
                    position: [data.longitude, data.latitude],
                    map: $scope.map,
                    icon: '/res/img/mark_bs/'+index+'.png',
                    extData: data
                });
                return marker;
            }
        }])

    // ecahrts 图表 controller
    .controller('mchartsController', ['$scope', '$http', '$window', 'multiMainService', function($scope, $http, $window, multiMainService) {
        //window resize 事件 重新渲染
        angular.element($window).on('resize', function() {
            $scope.$broadcast("onWindowResize");
        });

        $scope.selectTab = function(type) {
            $http.get('/ovu-pcos/pcos/liftreport/center/multi/workunit.do?timeDim=' + type)

            .success(function(resp) {
                // 各项目工单类型分布以及电梯数量 堆叠柱状 折线 图
                var stackNameData = [],
                    emergencyData = [],
                    planData = [],
                    liftData = [];

                var maxData = []; //记录每一列数据的最大值，用来确定maxY

                resp.totalList.forEach(function(value, index) {
                    stackNameData[index] = value.name;
                    emergencyData[index] = value.emergencyTotal;
                    planData[index] = value.planTotal;
                    liftData[index] = value.liftTotal;
                    maxData[index] = Math.max(value.planTotal + value.emergencyTotal, value.liftTotal);
                });

                var maxY = Math.floor(1.05 * Math.max.apply(null, maxData));

                // 填充配置项目
                $scope.stackBarOption = multiMainService.getStackBarOptionByData({
                    titleText: '各项目工单类型分布及电梯数量',
                    maxY: maxY,
                    labelData: stackNameData,
                    series: [{
                        type: 'bar',
                        legend: '应急工单',
                        data: emergencyData
                    }, {
                        type: 'bar',
                        legend: '计划工单',
                        data: planData
                    }, {
                        type: 'line',
                        legend: '电梯数量',
                        data: liftData
                    }]
                });

                //各项目工单完成率统计
                // 进度条 副标题使用的变量
                var totalFinishedRate = parseInt(resp.totalFinishedRate);
                var progressNameData = [],
                    progressfinishedRateData = [];
                resp.finishedRateList.forEach(function(value, index) {
                    progressNameData[index] = value.name;
                    progressfinishedRateData[index] = parseInt(value.finishedRate);
                });

                $scope.progressBarOption = multiMainService.getProgressBarOptionByData({
                    titleText: '各项目工单完成率统计',
                    titleSubtext: '工单总完成率：' + totalFinishedRate + '%',
                    // labelData: ['丽岛2046', '创意天地', '软件园', '金融港', '项目A', '项目B', '项目C'],
                    labelData: progressNameData,
                    data: progressfinishedRateData,
                });
            });
        }


    }])


    // echarts 图表 服务
    .factory('multiMainService', function() {
        return {
            initStackBar: function() {
                //默认数据
                return {
                    title: {
                        text: '各项目工单类型分布及电梯数量',
                    },
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: { // 坐标轴指示器，坐标轴触发有效
                            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
                        }
                    },
                    legend: {
                        orient: 'vertical',
                        right: '1%',
                        top: '3%',
                        data: ['应急工单', '维保工单', '电梯数量']
                    },
                    grid: {
                        left: '3%',
                        right: '20%',
                        bottom: '3%',
                        containLabel: true
                    },
                    yAxis: {
                        type: 'value',
                        scale: true,
                        name: '数值',
                        max: 200,
                        min: 0,
                        boundaryGap: [0.2, 0.2],
                        axisTick: {
                            show: false
                        },
                        axisLine: {
                            show: false
                        },
                    },
                    xAxis: {
                        type: 'category',
                        data: ['丽岛2046', '创意天地', '软件园', '金融港'],
                        splitLine: {
                            show: false
                        },
                        axisTick: {
                            show: false
                        },
                    },
                    series: [{
                        name: '维保工单',
                        type: 'bar',
                        stack: '总量',
                        barWidth: 30,
                        label: {
                            normal: {
                                show: false,
                                position: 'insideRight',
                                formatter: '{c}'
                            }
                        },
                        itemStyle: {
                            normal: {
                                color: '#669FD8',
                                borderColor: '#5594D4'
                            }
                        },
                        data: [50, 60, 20, 40]
                    }, {
                        name: '应急工单',
                        type: 'bar',
                        stack: '总量',
                        barWidth: 30,
                        label: {
                            normal: {
                                show: false,
                                position: 'insideRight',
                                formatter: '{c}'
                            }
                        },
                        itemStyle: {
                            normal: {
                                color: '#E35E5E',
                                borderColor: '#E25555'
                            }
                        },
                        data: [50, 80, 30, 80]
                    }, {
                        name: '电梯数量',
                        type: 'line',
                        data: [40, 50, 30, 90]
                    }]
                };
            },
            getStackBarOptionByData: function(option) {
                // 初始化
                var stackOpton = this.initStackBar();
                // 配置传进来的数据
                stackOpton.title.text = option.titleText;
                stackOpton.yAxis.max = option.maxY;
                stackOpton.xAxis.data = option.labelData;

                option.series.forEach(function(v, i) {
                    stackOpton.series[i].type = v.type;
                    stackOpton.series[i].data = v.data;
                    stackOpton.series[i].name = v.legend;
                });

                stackOpton.legend.data = stackOpton.series.map(function(v) {
                    return v.name;
                });
                return stackOpton;
            },
            initProgressBar: function() {
                //默认数据
                var completedRateData = [50, 70, 40, 80, 60, 75, 60].reverse();
                var totalRate = 50;
                var optionData = completedRateData.map(function(v, i) {
                    return {
                        value: v,
                        itemStyle: {
                            normal: {
                                color: (i % 2 === 0 ? '#E35E5E' : '#669FD8'),
                                borderColor: (i % 2 === 0 ? '#E25555' : '#5594D4'),
                            }
                        }
                    }
                });
                return {
                    title: {
                        text: '各项目工单完成率统计',
                        subtext: '工单总完成率：' + totalRate + '%',
                        subtextStyle: {
                            color: '#78A8D8',
                            fontSize: 20,
                            fontWeight: 'bold'
                        }
                    },
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: { // 坐标轴指示器，坐标轴触发有效
                            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
                        },
                        formatter: '{b1}<br />{c1}%'
                    },
                    grid: {
                        left: '3%',
                        right: '15%',
                        bottom: '3%',
                        containLabel: true
                    },
                    yAxis: {
                        data: ['丽岛2046', '创意天地', '软件园', '金融港', '项目A', '项目B', '项目C'].reverse(),
                        axisTick: {
                            show: false
                        },
                        axisLabel: {
                            // formatter: 'barGap: \'-100%\''
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
                    // animationDurationUpdate: 1200,
                    series: [{
                        type: 'bar',
                        itemStyle: {
                            normal: {
                                color: '#ddd',
                                barBorderRadius: 15,
                            }
                        },
                        silent: true,
                        barWidth: 15,
                        barGap: '-100%', // Make series be overlap
                        label: {
                            normal: {
                                show: true,
                                position: ['100%', '-50%'],

                                textStyle: {
                                    color: '#353535',
                                    fontSize: 20,
                                    fontWeight: 'bold'
                                },
                                formatter: function(params) {
                                    return completedRateData[params.dataIndex] + '%';
                                }
                            }
                        },
                        data: []
                    }, {
                        type: 'bar',
                        barWidth: 15,
                        z: 10,
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
                };
            },
            getProgressBarOptionByData: function(optionData) {
                var progressOption = this.initProgressBar();
                // 配置传进来的数据
                progressOption.title.text = optionData.titleText;
                progressOption.title.subtext = optionData.titleSubtext;
                // echarts 默认 从下往上排列 逆序一下
                progressOption.yAxis.data = optionData.labelData.reverse();
                // 配置隔行换色
                var optionData = optionData.data.map(function(v, i) {
                    return {
                        value: v,
                        itemStyle: {
                            normal: {
                                color: (i % 2 === 0 ? '#E35E5E' : '#669FD8'),
                                borderColor: (i % 2 === 0 ? '#E25555' : '#5594D4'),
                            }
                        }
                    }
                });
                // 同样需要逆序
                optionData.reverse();
                progressOption.series[1].data = optionData;

                // 设置 背景条样式
                optionData.forEach(function(v, i) {
                    progressOption.series[0].data[i] = 100;
                });
                progressOption.series[0].label.normal.formatter = function(params) {
                    return optionData[params.dataIndex].value + '%';
                }
                return progressOption;
            }
        }
    });
})(angular, document);
