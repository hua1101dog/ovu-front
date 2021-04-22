/**
 * Created by wangheng
 * 运营指标体系》能耗指标
 */
(function() {
    "use strict";
    var app = angular.module("app");

    app.controller('energyMainCtrl', energyMainCtrl);
    energyMainCtrl.$inject = ['$scope', '$http', 'AppService'];

    function energyMainCtrl($scope, $http, AppService) {
        var vm = this;
        vm.title = '园区';
        vm.parkNo = AppService.parkNo;
        vm.type = 'energy';

        vm.clickType = function (type) {
            getRightData(type);
        };
        vm.clickType(1);

        //slectedType 为1则是电，2则是水
        function getRightData(slectedType) {
            //1.能耗日用能耗趋势图，柱状图
            var today=moment().format("D");
            var title=[];
            var data1=[];
            for(var i=19;i>=0;i--){
                title.push(moment().subtract(i, 'days').format("D"));
            }
            var option1 = getbarOption();
            if(slectedType == 1){
                data1 = [939,1061,1091,1007,937,957,1013,837,1110,914,1121,
                    995,925,925,903,1113,1004,979,998,510]
            }else {
                data1 = [17,13,15,22,20,20,15,17,19,24,19,
                    23,20,17,17,25,22,15,16,12];
                option1.yAxis.name = "单位:m³";
            }
            var dataShadow = [];  //图表阴影
            for (var i = 0; i < data1.length; i++) {
                slectedType == 1 && dataShadow.push(1200);
                slectedType == 2 && dataShadow.push(30);
            }
            option1.xAxis.data = title;
            option1.series[0].data = dataShadow;
            option1.series[1].data = data1;
            vm.option1= option1;

            //2.能耗月用能耗趋势图
            var option2 = getLineOption(title,data1,dataShadow);
            option2.xAxis.data=["2017.1","2017.2","2017.3",
              "2017.4","2017.5","2017.6","2017.7",
              "2017.8","2017.9","2017.10","2017.11","2017.12"];
            if(slectedType == 1){
              option2.legend.data =["照明用电","动力用电"];
              option2.series[0].name="照明用电";
              option2.series[0].data=[15918,16445,13752,14098,
                14541,11628,13296,20264,13296,
                11280,12327,12327];
              option2.series[1].name="动力用电";
              option2.series[1].data=[32622,30988,28099,26293,25859,
                25723,23565,17864,25000,17864,
                19971,17202];
            }else {
              option2.legend.data =["消防用水","保洁保绿用水"];
              option2.series[0].name="消防用水";
              option2.series[0].data=[71,0,0,0,0,
                129,63,227,1203,418,
                204,113];
              option2.series[1].name="保洁保绿用水";
              option2.series[1].data=[313,171,192,192,395,
                565,469,853,525,327,
                359,447];
              option2.yAxis.name = "单位:m³";
            }
            vm.option2=option2;

            //3.各项对比
            var option3 = getPile1();
            if(slectedType == 1){
                option3.series[0].data =[
                    {value:168364, name:'照明用电'},
                    {value:291050, name:'动力用电'}
                ].sort(function (a, b) { return a.value - b.value; });
            }else {
                option3.series[0].data =[
                    {value:2428, name:'消防用水'},
                    {value:4808, name:'保洁保绿用水'}
                ].sort(function (a, b) { return a.value - b.value; });
            }
            vm.option3=option3;

            //4.两个小饼图

            var option=getPile2();
            if(slectedType == 1){
                vm.title1 = "动力用电";
                option.title.text = '63%';
                option.legend.data[0] = '动力用电';
                option.series[0].data = [{value:168364, name:'动力用电'},
                    {value:168364, name:'其他'}];
            }else {
                vm.title1 = "保洁保绿用水";
                option.title.text = '66%';
                option.legend.data[0] = '保洁保绿用水';
                option.series[0].data = [{value:4808, name:'保洁保绿用水'},
                                        {value:2428, name:'其他'}];
            }
            vm.option4=angular.copy(option);

            if(slectedType == 1){
                vm.title2 = "照明用电";
                option.title.text =  '37%';
                option.legend.data[0] = '照明用电';
                option.series[0].data = [{value:168364, name:'照明用电'},
                    {value:168364, name:'其他'}];
            }else {
                vm.title2 = "消防用水";
                option.title.text = '34%';
                option.legend.data[0] = '保洁保绿用水';
                option.series[0].data = [{value:2428, name:'消防用水'},
                                        {value:4808, name:'其他'}];
            }
            vm.option5=option;

        }

        function getbarOption(title,data,dataShadow) {
           var option = {
               xAxis: {
                   data: [],
                   axisLabel: {
                       inside: false,
                       textStyle: {
                       }
                   },
                   axisTick: {
                       show: false
                   },
                   axisLine: {
                       show: false
                   },
                   z: 10
               },
               yAxis: {
                   name: '单位:kW·h',
                   axisLine: {
                       show: false
                   },
                   axisTick: {
                       show: false
                   },
                   axisLabel: {
                       textStyle: {
                           color: '#999'
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
                       barGap:'-100%',
                       barCategoryGap:'40%',
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
                               position: 'top'
                           }
                       },
                       data: data
                   }
               ]
           };
            return option;
        }

        function getLineOption() {
            return {
                title: {
                },
                tooltip: {
                    trigger: 'axis'
                },
                legend: {
                    data:['特殊设备','公共用电','动力用电','暖通空调']
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis: {
                    type: 'category',
                    boundaryGap: false,
                    data: ['1月','2月','3月','4月','5月','6月','7月', '8月','9月','10月','11月']
                },
                yAxis: {
                    type: 'value',
                    name: '单位:kW·h'
                },
                series: [
                    {
                        name:'特殊设备',
                        type:'line',
                        stack: '总量',
                        data:[120, 132, 101, 134, 90, 230, 210, 110 ,550, 115,400]
                    },
                    {
                        name:'公共用电',
                        type:'line',
                        stack: '总量',
                        data:[220, 182, 191, 234, 290, 330, 310,234, 290, 330,400]
                    }
                ]
            };
        }

        function getPile1() {
            return {
                title: {
                },
                tooltip : {
                    trigger: 'item',
                    formatter: "{a} <br/>{b} : {c} ({d}%)"
                },
                visualMap: {
                    show: false,
                    min: 10,
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
                        data:[],
                        roseType: 'radius',
                        label: {
                            normal: {
                                textStyle: {
                                    color: 'black'
                                }
                            }
                        },
                        labelLine: {
                            normal: {
                                lineStyle: {
                                    color: '#c23531'
                                },
                                smooth: 0.2,
                                length: 10,
                                length2: 20
                            }
                        },
                        itemStyle: {
                            normal: {
                                color: '#c23531',
                                shadowBlur: 100,
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
        }

        function getPile2() {
            return {
                title: {
                    x: 'center',
                    y: 'center'
                },
                tooltip: {
                    trigger: 'item',
                    formatter: "{a} <br/>{b}: {c} ({d}%)"
                },
                legend: {
                    show :false,
                    data:['动力用电','其他']
                },
                series: [
                    {
                        name:'访问来源',
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
                                show: true
                            }
                        },
                        data:[
                            {value:75, name:'动力用电'},
                            {value:25, name:'其他'}
                        ]
                    }
                ]
            };
        }
    }

})();
