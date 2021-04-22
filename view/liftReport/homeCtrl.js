(function(){
    document.title = '综合展示首页';
    var app = angular.module('angularApp');
    app.controller('indexCtrl',function($scope,$http){
        //项目概览
        $http.get('/ovu-pcos/pcos/liftreport/homepage/project.do').success(function(resp){
            $scope.projectDes = resp;
        });
        //电梯概览
        $http.get('/ovu-pcos/pcos/liftreport/homepage/lift.do').success(function(resp){
            $scope.liftDes = resp;
            console.log(resp);
            //电梯状态统计数据
            var statOption = initPie();
            statOption.title.text = '电梯状态统计';
            statOption.title.subtext = '今日保养 ' + $scope.liftDes.planWorkUnitTotal;
            statOption.legend.orient='vertical';
            statOption.legend.x='left';
            statOption.series[0].center=['65%','50%'];
            statOption.legend.data = ['正常('+$scope.liftDes.normalTotal+')','异常('+$scope.liftDes.abnormalTotal+')'];
            statOption.series[0].data = [
                {value:$scope.liftDes.normalTotal, name:statOption.legend.data[0]},
                {value:$scope.liftDes.abnormalTotal, name:statOption.legend.data[1]}

            ];
            $scope.statOption = statOption;
            //电梯分类统计
            var classOption  = initClass();
            classOption.xAxis[0].data = $scope.liftDes.typeList.map(function(n){
                return n.name;
            });
            classOption.series[0].data = $scope.liftDes.typeList;
            $scope.classOption  = classOption;
            //电梯区域分布数据
            var areaOption = initPie();
            areaOption.title.text = '电梯区域分布';
            areaOption.legend.orient='vertical';
            areaOption.legend.x='left';
            areaOption.series[0].center=['65%','50%'];
            $scope.liftDes.regionList.forEach(function(region){
                region.name += '('+region.value+')';
            })
            areaOption.legend.data = $scope.liftDes.regionList.map(function(n){
                return n.name;
            });
            areaOption.series[0].data = $scope.liftDes.regionList;
            $scope.areaOption = areaOption;
            //电梯品牌分布统计
            $scope.brandOption = initPie();
            $scope.brandOption.title.text = '电梯品牌分布统计';
            $scope.brandOption.legend.orient='vertical';
            $scope.brandOption.legend.x='left';
            $scope.brandOption.series[0].center=['65%','50%'];
            $scope.liftDes.modelList.forEach(function(model){
                model.name +='('+model.value+')';
            })
            $scope.brandOption.legend.data =  $scope.liftDes.modelList.map(function(n){
                return n.name;
            });
            $scope.brandOption.series[0].data = $scope.liftDes.modelList;
            //电梯故障率
            var faultOption = initFault();
            faultOption.xAxis[0].data =$scope.liftDes.faultList.map(function(n){
                return n.name;
            });
            //修改故障统计柱状图展示问题
            faultOption.series[0].data = $scope.liftDes.faultList.map(function (n) {
                return n.total;
            });
            $scope.faultOption = faultOption;
        });
        //工单概览
        $http.get('/ovu-pcos/pcos/liftreport/homepage/workunit.do').success(function(resp){
            $scope.workOrder = resp;
            console.log(resp);
            //项目工单统计
            $scope.projectListOption = initPie();
            $scope.projectListOption.title.text = '项目工单统计';
            $scope.projectListOption.legend.orient='vertical';
            $scope.projectListOption.legend.x='left';
            $scope.projectListOption.series[0].center=['65%','50%'];
            $scope.workOrder.workunitList.forEach(function(unit){
                unit.name +='('+unit.value+')';
            })
            $scope.projectListOption.legend.data = $scope.workOrder.workunitList.map(function(n){
                return n.name;
            });
            $scope.projectListOption.series[0].data = $scope.workOrder.workunitList;
            //各项目工单类型分布及电梯数量
            $scope.proOrderOption = initProOrder();
            $scope.proOrderOption.xAxis.data = $scope.workOrder.totalList.map(function(n){
                return n.name;
            });
            $scope.proOrderOption.series[0].data = $scope.workOrder.totalList.map(function(n){
                return n.planTotal;
            });
            $scope.proOrderOption.series[1].data = $scope.workOrder.totalList.map(function(n){
                return n.emergencyTotal;
            });
            $scope.proOrderOption.series[2].data = $scope.workOrder.totalList.map(function(n){
                return n.liftTotal;
            });
            //应急工单来源统计
            $scope.sourceOption = initPie();
            $scope.sourceOption.title.text = '应急工单来源统计';
            $scope.sourceOption.legend.orient='vertical';
            $scope.sourceOption.legend.x='left';
            $scope.sourceOption.series[0].center=['65%','50%'];
            var total = 0;
            for(var i = 0; i < $scope.workOrder.originList.length; i++){
                total += $scope.workOrder.originList[i].value;
                $scope.workOrder.originList[i].name +='('+$scope.workOrder.originList[i].value+')';
            }
            $scope.sourceOption.title.subtext = '应急工单总数 ' + total;
            $scope.sourceOption.legend.data = $scope.workOrder.originList.map(function(n){
                return n.name;
            });
            $scope.sourceOption.series[0].data = $scope.workOrder.originList;
            //各项目工单完成率
            $scope.rateOption = initRateOption();
            $scope.rateOption.title.subtext = '工单总完成率 ' + $scope.workOrder.totalFinishedRate;
            $scope.workOrder.finishedRateList = $scope.workOrder.finishedRateList.reverse();
            $scope.rateOption.yAxis.data =   $scope.workOrder.finishedRateList.map(function(n){
                return n.name;
            });
            var arry = [];
            var data = [];
            var length = $scope.workOrder.finishedRateList.length;
            console.log( $scope.workOrder.finishedRateList);
            $('#progress').css('height',21*length + 80);
            for(j in  $scope.workOrder.finishedRateList){

                var value = $scope.workOrder.finishedRateList[j].finishedRate;
                value = value.substring(0,value.length-1);
                arry.push(value);
                data.push(100);
            }
            $scope.rateOption.series[0].data = data;
            $scope.rateOption.series[0].label.normal.formatter = function(params) {
                return arry[params.dataIndex] + '%';}
            $scope.rateOption.series[1].data = arry.map(function(v, i) {
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


        });
        //柱状图
        function initClass(){
            return {
                title : {
                    text: '电梯分类统计',
                    top:'3%',
                    left:'3%',
                    textStyle:{
                        color:'#73879C',
                        fontSize:'14',
                        fontFamily: '微软雅黑',
                        fontWeight:'normal'
                    }
                },
                tooltip: {
                    trigger: 'axis',
                    formatter: "{b} : {c}台",
                    axisPointer: { // 坐标轴指示器，坐标轴触发有效
                        type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
                    }
                },
                legend: {
                    orient: 'vertical',
                    x: '75%',
                    y:'middle',
                    data: ''
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis: [{
                    type: 'category',
                    data:'',
                    axisTick: {
                        alignWithLabel: true
                    },
                    axisLabel :{
                        interval:0
                    }
                }],
                yAxis: [{
                    type: 'value',
                    name:'台'

                }],
                series: [{
                    name: '直接访问',
                    type: 'bar',
                    legendHoverLink:false,
                    data:'',
                    label: {
                        normal: {
                            show: true,
                            position: 'outside',
                            formatter: "{c}台"
                        }
                    },
                    itemStyle: {
                        normal: {
                            color: function (params) {
                                var colorList = ['#c23531','#2f4554', '#61a0a8', '#d48265', '#91c7ae','#749f83',  '#ca8622', '#bda29a','#6e7074'];
                                return colorList[params.dataIndex]
                            }

                        }
                    }
                }]
            }
        }




        // 电梯故障统计
        function initFault(){
            return {
                title : {
                    text: '电梯品牌故障率统计',
                    top:'3%',
                    left:'3%',
                    textStyle:{
                        color:'#73879C',
                        fontSize:'14',
                        fontFamily: '微软雅黑',
                        fontWeight:'normal'
                    }
                },
                tooltip: {
                    trigger: 'axis',
                    formatter: function (params) {
                        //修改故障统计柱状图显示问题
                        params[0].allData=$scope.liftDes.faultList;
                        var da=params[0].allData;
                        if (da) {
                            return  '品牌：' +da[params[0].dataIndex].name + ' <br/>'
                                + '电梯台数：' + da[params[0].dataIndex].total+ '<br/>'
                                + '故障率：' + da[params[0].dataIndex].value

                        }
                    },
                    axisPointer: { // 坐标轴指示器，坐标轴触发有效
                        type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
                    }
                },
                legend: {
                    orient: 'vertical',
                    x: '75%',
                    y:'middle',
                    data: ''
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis: [{
                    type: 'category',
                    data:'',
                    axisTick: {
                        alignWithLabel: true
                    },
                    axisLabel :{
                        interval:0
                    }
                }],
                yAxis: [{
                    type: 'value',
                }],
                series: [{
                    name: '直接访问',
                    type: 'bar',
                    legendHoverLink:false,
                    data:'',
                    label: {
                        normal: {
                            show: true,
                            position: 'outside',
                            formatter: "{c}"
                        }
                    },
                    itemStyle: {
                        normal: {
                            color: function (params) {
                                var colorList = ['#c23531','#2f4554', '#61a0a8', '#d48265', '#91c7ae','#749f83',  '#ca8622', '#bda29a','#6e7074'];
                                return colorList[params.dataIndex]
                            }

                        }
                    }
                }]
            }
        }


        //堆叠折图
        function initProOrder(){
            return {

                title: {
                    text: '各项目工单类型分布及电梯数量',
                    top:'3%',
                    left:'3%',
                    textStyle:{
                        color:'#73879C',
                        fontSize:'14',
                        fontFamily: '微软雅黑',
                        fontWeight:'normal'
                    }
                },
                tooltip : {
                    trigger: 'axis',
                    axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                        type : 'line'        // 默认为直线，可选为：'line' | 'shadow'
                    }
                },
                legend: {
                    y:'15%',
                    data: ['应急工单', '维保工单','电梯数量']
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    top:'25%',
                    containLabel: true
                },
                yAxis: {
                    type: 'value',
                    scale: true,
                    min: 0,
                    // boundaryGap: [0.2, 0.2],
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
                    }
                },
                series: [{
                    name: '维保工单',
                    type: 'bar',
                    stack: '总量',
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
        }



        function initRateOption(){
            return {
                title: {
                    text: '各项目工单完成率统计Top10',
                    subtext:'' ,
                    top:'3%',
                    left:'3%',
                    textStyle:{
                        color:'#73879C',
                        fontSize:'14',
                        fontFamily: '微软雅黑',
                        fontWeight:'normal'
                    },
                    subtextStyle:{
                        color:'#73879C',
                        fontSize:'12',
                        fontFamily: '微软雅黑'
                    }
                },
                tooltip: {
                    trigger: 'axis',
                    formatter: function(obj){
                        return obj[1].name + ' : 完成(' + obj[1].value + '%)';
                    },
                    axisPointer: { // 坐标轴指示器，坐标轴触发有效
                        type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
                    }
                },
                grid: {
                    left: '3%',
                    right: '15%',
                    bottom: '0',
                    top:'65',
                    containLabel: true
                },
                yAxis: {
                    data: '',
                    axisTick: {
                        show: false
                    },
                    axisLabel :{
                        interval:0
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
                            barBorderRadius: 15
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
                                fontWeight: 'bold',
                                fontSize: 20
                            },
                            /* formatter: function(params) {
                                return completedRateData[params.dataIndex] + '%';
                            } */
                        }
                    },
                    data: ''
                }, {
                    type: 'bar',
                    z: 10,
                    barWidth: 15,
                    itemStyle: {
                        normal: {
                            // color: '#E35E5E',
                            // borderColor: '#E25555',
                            borderWidth: 1,
                            borderType: 'solid',
                            barBorderRadius: 15,
                        }
                    },
                    data: ''
                }]
            }
        }

        //饼状图方法
        function initPie(){
            return    {
                title : {
                    text: '',
                    subtext:'' ,
                    top:'3%',
                    left:'3%',
                    textStyle:{
                        color:'#73879C',
                        fontSize:'14',
                        fontFamily: '微软雅黑',
                        fontWeight:'normal'
                    },
                    subtextStyle:{
                        color:'#73879C',
                        fontSize:'12',
                        fontFamily: '微软雅黑'
                    }
                },
                tooltip : {
                    trigger: 'item',
                    formatter: "{b} : {c} ({d}%)"
                },
                legend: {
                    orient: 'vertical',
                    x: '70%',
                    y:'middle',
                    data: ''
                },
                series: [
                    {
                        name:'访问来源',
                        type:'pie',
                        radius : '55%',
                        center: ['40%', '50%'],
                        data:'',
                        label:{
                            normal:{
                                show:false
                            }
                        },
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
        }
        //图表resize事件
        window.onresize = function(){
            $scope.$broadcast("onWindowResize");
        }

    });
})()
