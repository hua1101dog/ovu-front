

(function () {
    "use strict";
    var app = angular.module("app");

    app.controller('elevatorCtrl', elevatorCtrl);

    function elevatorCtrl($scope) {
        var myChart = echarts.init(document.getElementById('main'));

        var option = {
            title: {
                text: '电梯状态',
                left: 'center',
                textStyle: {
                    color: '#ccc'
                }
            },
            tooltip : {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            legend: {
                orient: 'vertical',
            },
            series : [
                {
                    name: '电梯状态',
                    type: 'pie',
                    radius : '55%',
                    center: ['50%', '60%'],
                    data:[
                        {value:200, name:'正常'},
                        {value:50, name:'停用'},
                        {value:10, name:'故障'}
                    ].sort(function (a, b) { return a.value - b.value; }),
                    itemStyle: {
                        emphasis: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
                }
            ]
        };

        myChart.setOption(option);
    }
})();