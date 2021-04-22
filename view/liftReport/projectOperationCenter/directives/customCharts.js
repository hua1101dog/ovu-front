// 需要html 入口文件中引入 echarts 3.0

angular.module('customCharts', [])

// 进度条
.factory('progressBarConfig', function() {
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
            data: [100, 100, 100, 100, 100, 100, 100]
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
    }

})

.directive('progressBar', ['progressBarConfig', '$window', function(pbConfig, $window) {
    return {
        restrict: 'EA',
        scope: {
            uiOption: '='
        },
        link: function(scope, iEle, iAttrs) {
            // 设置dom 宽高
            iEle.css({
                width: scope.uiOption.width || '100%',
                height: scope.uiOption.height || '100%'
            });
            var myChart = echarts.init(iEle[0]);
            // 配置传进来的数据
            pbConfig.title.text = scope.uiOption.titleText;
            pbConfig.title.subtext = scope.uiOption.titleSubtext;
            // echarts 默认 从下往上排列 逆序一下  
            pbConfig.yAxis.data = scope.uiOption.labelData.reverse();
            // 配置隔行换色
            var optionData = scope.uiOption.data.map(function(v, i) {
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
            pbConfig.series[1].data = optionData;

            // 设置 背景条样式
            optionData.forEach(function(v, i) {
                pbConfig.series[0].data[i] = 100;
            });
            pbConfig.series[0].label.normal.formatter = function(params) {
                return optionData[params.dataIndex].value + '%';
            }

            var option = pbConfig;
            // console.log(option);
            if (option && angular.isObject(option)) {
                myChart.setOption(option);
            }
            //window resize 事件 重新渲染
            angular.element($window).on('resize', function() {
                myChart.resize();
            });
        }

    }
}])

// 堆叠柱状折线图
.factory('stackBarConfig', function() {
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
                    show: true,
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
                    show: true,
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

})

.directive('stackBar', ['stackBarConfig', '$window', function(sbConfig, $window) {
    return {
        restrict: 'EA',
        scope: {
            uiOption: '='
        },
        link: function(scope, iEle, iAttrs) {
            // 设置dom 宽高
            iEle.css({
                width: scope.uiOption.width || '100%',
                height: scope.uiOption.height || '100%'
            });
            var myChart = echarts.init(iEle[0]);

            // 配置传进来的数据
            sbConfig.title.text = scope.uiOption.titleText;
            sbConfig.yAxis.max = scope.uiOption.maxY;
            sbConfig.xAxis.data = scope.uiOption.labelData;

            scope.uiOption.series.forEach(function(v, i) {
                sbConfig.series[i].type = v.type;
                sbConfig.series[i].data = v.data;
                sbConfig.series[i].name = v.name;
            });

            sbConfig.legend.data = sbConfig.series.map(function(v) {
                return v.name;
            });


            var option = sbConfig;
            // console.log(option);
            if (option && angular.isObject(option)) {
                myChart.setOption(option);
            }
            //window resize 事件 重新渲染
            angular.element($window).on('resize', function() {
                myChart.resize();
            });
        }

    }
}])

// 饼图
.factory('pieChartConfig', function() {
    //默认数据
    var total = 999;
    return {
        title: {
            text: '工单类型统计',
            subtext: '工单总数：' + total,
            x: 'center'
        },
        tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        legend: {
            orient: 'horizontal',
            left: 'center',
            top: 'bottom',
            data: ['故障工单', '维保工单']
        },
        series: [{
            name: '工单来源',
            type: 'pie',
            radius: '55%',
            center: ['50%', '60%'],
            label: {
                normal: {
                    show: true,
                    position: 'inner',
                    formatter: '{d}%'
                }
            },
            data: [{
                value: 335,
                name: '故障工单'
            }, {
                value: 310,
                name: '维保工单'
            }],
            itemStyle: {
                emphasis: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
            }
        }]
    };

})

.directive('pieChart', ['pieChartConfig', '$window', function(pcConfig, $window) {
    return {
        restrict: 'EA',
        scope: {
            uiOption: '='
        },
        link: function(scope, iEle, iAttrs) {
            // 设置dom 宽高
            iEle.css({
                width: scope.uiOption.width || '100%',
                height: scope.uiOption.height || '100%'
            });
            var myChart = echarts.init(iEle[0]);

            // 配置传进来的数据
            pcConfig.title.text = scope.uiOption.titleText;
            pcConfig.title.subtext = scope.uiOption.titleSubtext;

            scope.uiOption.data.forEach(function(v, i) {
                var obj = {};
                pcConfig.series[0].data[i] = obj;
                obj.value = v;
                obj.name = scope.uiOption.labelData[i];
            });
            pcConfig.legend.data = pcConfig.series[0].data.map(function(v) {
                return v.name;
            });


            var option = pcConfig;
            // console.log(option);
            if (option && angular.isObject(option)) {
                myChart.setOption(option);
            }

            //window resize 事件 重新渲染
            angular.element($window).on('resize', function() {
                myChart.resize();
            });
        }

    }
}])

// 圆环饼图
.factory('pieDoughnutConfig', function() {
    return {
        title: {
            text: '电梯分类统计',
            x: '25%'
        },
        tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b}: {c} ({d}%)"
        },
        legend: {
            orient: 'vertical',
            left: '70%',
            y: 'center',
            data: ['直接访问', '邮件营销', '联盟广告', '视频广告', '搜索引擎']
        },
        series: [{
            name: '访问来源',
            type: 'pie',
            radius: ['35%', '55%'],
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
            center: ['30%', '50%'],
            data: [
                { value: 335, name: '直接访问' },
                { value: 310, name: '邮件营销' },
                { value: 234, name: '联盟广告' },
                { value: 135, name: '视频广告' },
                { value: 548, name: '搜索引擎' }
            ]
        }]
    }
})

.directive('pieDoughnut', ['pieDoughnutConfig', '$window', function(pdConfig, $window) {
    return {
        restrict: 'EA',
        scope: {
            uiOption: '='
        },
        link: function(scope, iEle, iAttrs) {
            // 设置dom 宽高
            iEle.css({
                width: scope.uiOption.width || '100%',
                height: scope.uiOption.height || '100%'
            });
            var myChart = echarts.init(iEle[0]);

            // 配置传进来的数据
            pdConfig.title.text = scope.uiOption.titleText;

            pdConfig.legend.data = scope.uiOption.labelData;
            pdConfig.series[0].data = scope.uiOption.data.map(function(v, i) {
                return {
                    value: v,
                    name: pdConfig.legend.data[i]
                }
            });

            var option = pdConfig;
            // console.log(option);
            if (option && angular.isObject(option)) {
                myChart.setOption(option);
            }

            //window resize 事件 重新渲染
            angular.element($window).on('resize', function() {
                myChart.resize();
            });
        }

    }
}]);


/** progressBar使用方法

// markUp
<div ng-app="myApp" ng-controller="mainCtrl">

    <div progress-bar ui-option="option"></div>
    
</div>

// script
<script>
    angular.module('myApp',['customCharts'])
    .controller('mainCtrl', ['$scope', function($scope) {
        // 副标题使用的变量
        var totalRate = 50
        // 配置这些项目就可以了
        $scope.option = {
            type: 'progressBar',
            titleText: '各项目工单完成率统计',
            titleSubtext: '工单总完成率：' + totalRate + '%',
            labelData: ['丽岛2046', '创意天地', '软件园', '金融港', '项目A', '项目B', '项目C'],
            data: [50, 70, 40, 80, 60, 75, 60],
        }

    }]);
</script>

*/

/** stackBar 使用方法

// markUp
<div ng-app="myApp" ng-controller="mainCtrl">

    <div stack-bar ui-option="stackBarOption"></div>
    
</div>

// script
<script>
    angular.module('myApp',[customCharts])
    .controller('mainCtrl', ['$scope', function($scope) {
        // 副标题使用的变量
        var totalRate = 50
        // 配置这些项目就可以了
        $scope.option = {
            type: 'stackBar',
            titleText: '各项目工单类型分布及电梯数量',
            maxY: 150,
            labelData: ['丽岛2046', '创意天地', '软件园', '金融港'],
            series: [{
                type: 'bar',
                legend: '应急工单',
                data: [50, 60, 20, 40]
            }, {
                type: 'bar',
                legend: '计划工单',
                data: [50, 80, 30, 90]
            }, {
                type: 'line',
                legend: '电梯数量',
                data: [40, 50, 30, 90]
            }]
        }

    }]);
</script>

*/


/** pieChart 使用方法

// markUp
<div ng-app="myApp" ng-controller="mainCtrl">

    <div pie-chart ui-option="pieOption1"></div>
    
</div>

// script
<script>
    angular.module('myApp',[customCharts])
    .controller('mainCtrl', ['$scope', function($scope) {
        var total1 = 999;
        $scope.pieOption1 = {
            type: 'pieChart',
            titleText: '工单类型统计',
            titleSubtext: '工单总数：' + total1,
            labelData: ['故障工单', '维保工单'],
            data: [335, 310]
        };

    }]);
</script>

*/