
(function () {
    "use strict";
    var app = angular.module("app");

    app.controller('ownerCtrl', ownerCtrl);

    function ownerCtrl($scope) {
        var vm = this;
        var myChart = echarts.init(document.getElementById('main'));
        var option = {
            title: {
                text: '业主报事',
                left: 'center',
                top: 20,
                textStyle: {
                    color: '#ccc'
                }
            },

            tooltip : {
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
            series : [
                {
                    name:'访问来源',
                    type:'pie',
                    radius : '55%',
                    center: ['50%', '50%'],
                    data:[
                        {value:335, name:'已处理'},
                        {value:310, name:'未处理'}

                    ].sort(function (a, b) { return a.value - b.value; }),
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
        var myChart2 = echarts.init(document.getElementById('main2'));
        var data = [["1月",60],["2月",65],["3月",55],["4月",70],["5月",73],["6月",70],["7月",69],["8月",72],["9月",79],["10月",83],["11月",81],["12月",85]];

        var dateList = data.map(function (item) {
            return item[0];
        });
        var valueList = data.map(function (item) {
            return item[1];
        });

        var option2 = {
            // Make gradient line here
            visualMap: [{
                show: false,
                type: 'continuous',
                seriesIndex: 0,
                min: 0,
                max: 100
            }],
            title: [{
                left: 'center',
                text: '业主满意度',
                textStyle:{
                    color:'#ccc'
                }
            }],
            tooltip : {
                trigger: 'axis',
                axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                    type : 'line'        // 默认为直线，可选为：'line' | 'shadow'
                }
            },
            xAxis: [{
                data: dateList,
                axisLine: {
                    lineStyle: {
                        color: '#ccc'
                    }
                },
            }],
            yAxis: [{
                splitLine: {show: false},
                axisLine: {
                    lineStyle: {
                        color: '#ccc'
                    }
                },
            }],
            grid: [{
                bottom: '30%'
            }, {
                top: '30%'
            }],
            series: [{
                type: 'line',
                showSymbol: false,
                data: valueList
            }]
        };
        myChart2.setOption(option2);
    }

})();