(function () {
    "use strict";
    var app = angular.module("app");

    app.controller('personCtrl', personCtrl);

    function personCtrl($scope) {
        var myChart = echarts.init(document.getElementById('main'));
        var option = {
            title : {
                text: '人员类别',
                x:'center',
                textStyle: {
                    color: '#ccc'
                }
            },
            tooltip : {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            legend: {
                show:false,
                x : 'center',
                data:['秩序','工程','管家','客服','绿化','保洁']
            },
            toolbox: {
                show : true
            },
            calculable : true,
            series : [

                {
                    name:'面积模式',
                    type:'pie',
                    radius : [30, 110],
                    center : ['50%', '50%'],
                    roseType : 'area',
                    data:[
                        {value:100, name:'秩序'},
                        {value:88, name:'工程'},
                        {value:30, name:'管家'},
                        {value:50, name:'客服'},
                        {value:50, name:'绿化'},
                        {value:66, name:'保洁'}
                    ]
                }
            ]
        };
        myChart.setOption(option);


    //2.工单执行数
        var myChart2 = echarts.init(document.getElementById('main2'));
        var data = [["毛可", 234], ["李仪", 227], ["何志勇", 211],
            ["缪薇", 181], ["潘宇", 176], ["潘卓", 175], ["胡婷", 163],
            ["杨玉印", 141],["任福生", 127],["张斌", 115]];

        var dateList = data.map(function (item) {
            return item[1];
        });
        var valueList = data.map(function (item) {
            return item[0];
        });

        var option2= {
            title: {
                text: '工单执行数',
                left: 'center',
                textStyle: {
                    color: '#ccc'
                }
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow',

                }
            },
            legend: {
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: {
                type: 'value',
                boundaryGap: [0, 0.01],
                axisLine: {
                    lineStyle: {
                        color: '#ccc'
                    }
                }
            },
            yAxis: {
                type: 'category',
                data: valueList,
                axisLine: {
                    lineStyle: {
                        color: '#ccc'
                    }
                }
            },
            series: [
                {
                    name: '工单执行',
                    type: 'bar',
                    data: dateList.sort(function (a, b) { return a - b; })
                }
            ]
        };
        myChart2.setOption(option2);


        //3.步数排行
        var myChart3 = echarts.init(document.getElementById('main3'));
        var data = [["毛可", 115222], ["李仪", 22222], ["何志勇", 333325],
            ["缪薇", 452622], ["潘宇", 888822], ["潘卓", 444552], ["胡婷", 125354],
            ["杨玉印", 356245],["任福生", 444455],["张斌", 333544]];

        var dateList2 = data.map(function (item) {
            return item[1];
        });
        var valueList2 = data.map(function (item) {
            return item[0];
        });

        option2.title.text='步数排行';
        option2.series[0].name='步数排行';
        option2.yAxis.data=valueList2;
        option2.series[0].data=dateList2.sort(function (a, b) { return a - b; });
        myChart3.setOption(option2);


    }
})();