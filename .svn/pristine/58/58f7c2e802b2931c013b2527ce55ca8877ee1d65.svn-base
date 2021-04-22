
(function () {
    "use strict";
    var app = angular.module("app");

    app.controller('equipmentRoomCtrl', equipmentRoomCtrl);

    function equipmentRoomCtrl($scope, $http,AppService) {
        var vm = this;

        ///ovu-pcos/pcos/show/equip/equipHouseRuning.do?parkNo=042010600012046
        $http.get('/ovu-pcos/pcos/show/equip/equipHouseRuning.do?parkNo='+AppService.parkNo).success(function (res) {
            console.log(res.data);
        });

        vm.option1 = {
            color:['#5793f3', '#d14a61', '#675bba'],
            tooltip : {
                trigger: 'axis',
                axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                    type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                }
            },
            legend: {
                // data: ['压力', '液位'],
                data: ['水泵房01','水泵房02','水泵房03'],
                textStyle:{
                    color:'#ccc'
                }
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis:  {
                type: 'value',
                axisLine: {
                    lineStyle: {
                        color: '#ccc'
                    }
                }
            },
            yAxis: {
                type: 'category',
                data: ['压力', '液位'],
                // data: ['水泵房01','水泵房02','水泵房03'],
                axisLine: {
                    lineStyle: {
                        color: '#ccc'
                    }
                }
            },
            series: [
                {
                    name: '水泵房01',
                    type: 'bar',
                    stack: '总量',
                    label: {
                        normal: {
                            show: true,
                            position: 'insideRight'
                        }
                    },
                    data: [320, 302]
                },
                {
                    name: '水泵房02',
                    type: 'bar',
                    stack: '总量',
                    label: {
                        normal: {
                            show: true,
                            position: 'insideRight'
                        }
                    },
                    data: [120, 132]
                },
                {
                    name: '水泵房03',
                    type: 'bar',
                    stack: '总量',
                    label: {
                        normal: {
                            show: true,
                            position: 'insideRight'
                        }
                    },
                    data: [120, 132]
                }
            ]
        };

        var option2 = {
            color: ['#5793f3', '#d14a61', '#675bba'],
            tooltip : {
                trigger: 'axis',
                axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                    type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                }
            },
            legend: {
                data:['A','B','C'],
                textStyle:{
                    color:'#ccc'
                }
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            yAxis : [
                {
                    type : 'category',
                    // data : ['配电房电压','配电房电流'],
                    data : ['配电房电压'],
                    axisLine: {
                        lineStyle: {
                            color: '#ccc'
                        }
                    }
                }
            ],
            xAxis : [
                {
                    type : 'value',
                    axisLine: {
                        lineStyle: {
                            color: '#ccc'
                        }
                    }
                }
            ],
            series : [
                {
                    name:'A',
                    type:'bar',
                    data:[320, 332]
                },
                {
                    name:'B',
                    type:'bar',
                    data:[120, 132]
                },
                {
                    name:'C',
                    type:'bar',
                    data:[120, 132]
                }

            ]
        };

        vm.option2 = option2;
        // var option3 = angular.copy(option2);
        var option3 = {
            color: ['#5793f3', '#d14a61', '#675bba'],
            tooltip : {
                trigger: 'axis',
                axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                    type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                }
            },
            legend: {
                data:['A','B','C'],
                textStyle:{
                    color:'#ccc'
                }
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            yAxis : [
                {
                    type : 'category',
                    data : ['能耗'],
                    axisLine: {
                        lineStyle: {
                            color: '#ccc'
                        }
                    }
                }
            ],
            xAxis : [
                {
                    type : 'value',
                    axisLine: {
                        lineStyle: {
                            color: '#ccc'
                        }
                    }
                }
            ],
            series : [
                {
                    name:'A',
                    type:'bar',
                    data:[320, 332]
                },
                {
                    name:'B',
                    type:'bar',
                    data:[120, 132]
                },
                {
                    name:'C',
                    type:'bar',
                    data:[120, 132]
                }

            ]
        };
        // option3.xAxis[0].data = ['配电箱电压','配电箱电流'];
        vm.option3 = option3;
        vm.option4 = option3;
    }

})();