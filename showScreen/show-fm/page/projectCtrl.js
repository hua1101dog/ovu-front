(function () {
    "use strict";
    var app = angular.module("app");

    app.controller('projectCtrl', projectCtrl);

    function projectCtrl($scope) {
        var vm= this;
        var myChart = echarts.init(document.getElementById('main'));
        var option = {
            title: {
                text: '工单状态分析',
                left: 'center',
                top: 20,
                textStyle: {
                    color: '#ccc'
                }
            },

            tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
            },

            visualMap: {
                show: false,
                min: 80,
                max: 600,
                inRange: {
                    colorLightness: [0, 1]
                }
            },
            series: [
                {
                    name: '工单状态',
                    type: 'pie',
                    radius: '55%',
                    center: ['50%', '50%'],
                    data: [
                        {value: 335, name: '待派发'},
                        {value: 310, name: '待接收'},
                        {value: 310, name: '已退回'},
                        {value: 310, name: '待处理'},
                        {value: 310, name: '待评价'},
                        {value: 310, name: '已评价'}

                    ].sort(function (a, b) {
                        return a.value - b.value;
                    }),
                    roseType: 'radius',
                    label: {
                        normal: {
                            textStyle: {
                                color: 'rgba(255, 255, 255, 0.3)'
                            }
                        }
                    },
                    labelLine: {
                        normal: {
                            lineStyle: {
                                color: 'rgba(255, 255, 255, 0.3)'
                            },
                            smooth: 0.2,
                            length: 10,
                            length2: 20
                        }
                    },
                    itemStyle: {
                        normal: {
                            color: '#c23531',
                            shadowBlur: 200,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    },

                    animationType: 'scale',
                    animationEasing: 'elasticOut',
                    animationDelay: function (idx) {
                        return Math.random() * 200;
                    }
                }
            ]
        };
        myChart.setOption(option);


        //第二个柱状图
        var myChart2 = echarts.init(document.getElementById('main2'));
        var data = [["设施设备巡检", 60], ["设施设备维保", 65], ["工程", 55],
            ["保洁", 73], ["秩序", 70], ["绿化", 69], ["客服", 72]];

        var dateList = data.map(function (item) {
            return item[1];
        });
        var valueList = data.map(function (item) {
            return item[0];
        });

        var dataShadow = data.map(function (item) {
            return 100;
        });

        var option2 = {
            xAxis: {
                data: valueList,
                axisLabel: {
                    inside: false,
                    textStyle: {
                        color: '#ccc'
                    }
                },
                axisTick: {
                    show: false
                },
                axisLine: {
                    show: false,
                    color: '#ccc'
                },
                z: 10
            },
            yAxis: {
                axisLine: {
                    show: false,
                    color: '#ccc'
                },
                axisTick: {
                    show: false
                },
                axisLabel: {
                    textStyle: {
                        color: '#ccc'
                    }
                }
            },
            dataZoom: [
                {
                    type: 'inside'
                }
            ],
            series: [
                { // For shadow
                    type: 'bar',
                    itemStyle: {
                        normal: {color: 'rgba(0,0,0,0.05)'}
                    },
                    barGap: '-100%',
                    barCategoryGap: '40%',
                    data: dataShadow,
                    animation: true
                },
                {
                    type: 'bar',
                    itemStyle: {
                        normal: {
                            color: new echarts.graphic.LinearGradient(
                                0, 0, 0, 1,
                                [
                                    {offset: 0, color: '#83bff6'},
                                    {offset: 0.5, color: '#188df0'},
                                    {offset: 1, color: '#188df0'}
                                ]
                            )
                        },
                        emphasis: {
                            color: new echarts.graphic.LinearGradient(
                                0, 0, 0, 1,
                                [
                                    {offset: 0, color: '#2378f7'},
                                    {offset: 0.7, color: '#2378f7'},
                                    {offset: 1, color: '#83bff6'}
                                ]
                            )
                        }
                    },
                    label: {
                        normal: {
                            show: true,
                            position: 'insideTop',
                            color: '#ccc'
                        }
                    },
                    data: dateList
                }
            ]
        };
        myChart2.setOption(option2);


        //工单下面的进度条
        var optionData=[];
        var yaxisData=[];
        var otherData=[];
        var data3 = [{name:'工单完成数',value:833}];
        data3 && data3.reverse() &&  data3.forEach(function(v,i){
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
            otherData.push(1000);
        });
        var tip = '完成率';

        var option3 = {
            title: {
                text: '工单完成率',
                left: 'center',
                top: 20,
                textStyle: {
                    color: '#ccc'
                }
            },
            tooltip: {
                trigger: 'axis',
                formatter: function (obj) {
                        return obj[1].name + ':'  + obj[1].value ;
                },
                axisPointer: { // 坐标轴指示器，坐标轴触发有效
                    type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
                }
            },
            grid: {
                left: '-5%',
                right: '30%',
                bottom: '3%',
                top: '0%',
                containLabel: true
            },
            yAxis: {
                data: yaxisData,
                show:false,
                axisTick: {
                    show: false
                },
                axisLabel: {},
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
                barWidth: 20,
                itemStyle: {
                    normal: {
                        color: '#ccc',
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
                            color: '#ccc',
                            fontWeight: 'bold',
                            fontSize: 30
                        },
                        formatter: function (params) {
                               /* return data3[params.dataIndex].value + '%';*/
                            return '80%';
                        }
                    }
                },
                data: otherData
            },
                {
                    type: 'bar',
                    z: 10,
                    barWidth: 20,
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
        vm.option = option3;

    }

})();