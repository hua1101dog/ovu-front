(function () {
    "use strict";
    var app = angular.module("angularApp");

    app.controller('customAnalysisCtrl', function ($scope, $rootScope, $sce, $uibModal, $state, $http, $filter, fac) {
        document.title = '自定义值分析';
        $scope.pageModel = {};
        $scope.search = {};
        $scope.search.meterType = 1;
        var startTime = moment().format('YYYY-MM-DD');
        var endTime = moment().format('YYYY-MM-DD');
        $scope.selected = 1;

        var selectedIndex;
        $scope.isLine = true;
        $scope.isColumn = false;
        $scope.search.startTime = startTime;
        $scope.search.endTime = endTime;
        // 页面初始化
        app.modulePromiss.then(function () {
            $scope.findTypes();
            $scope.$watch('dept.id', function (deptId, oldValue) {
                if (deptId) {
                    if ($scope.dept.parkId) {
                        $scope.search.parkId = $scope.dept.parkId;
                        $scope.search.parkName = $scope.dept.parkName;
                        $scope.init();
                    } else {
                        alert('请选择跟项目关联的部门');
                        $scope.search.parkId &&  delete $scope.search.parkId
                        $scope.search.parkName &&  delete $scope.search.parkName;
                    }

                }

            })

        })

        $scope.init = function () {
            $scope.changeIndex(selectedIndex);
        }
        $scope.changeIndex = function (index) {
            if (index == 0) {
                $scope.find();
            }
            var copy = angular.extend({}, copy);
            angular.extend(copy, {
                meterType: $scope.search.meterType,
                startTime: $scope.search.startTime,
                endTime: $scope.search.endTime,
                timeDim: $scope.search.timeDim,

            })

            $scope.$broadcast('index' + index, copy);
            selectedIndex = index;

        };
        $scope.width=$(window).width()-300
      
        $scope.findTypes = function () {
            $http.get('/ovu-energy/energy/classify/list').success(function (res) {
                if (res.code == 0) {
                    $scope.classifyList = res.data;
                } else {
                    alert(res.msg);
                }
            })

        };
        $scope.checkTypes = function (item) {

            $scope.search.meterType = item.type;
            $scope.find();
            $scope.changeIndex(selectedIndex);
            // $scope.toggleYear();
        };
        // 查询
        $scope.find = function () {
           
            if ($scope.search.startTime && ($scope.search.startTime !== startTime)) {
                $scope.selected = 0;
                $scope.search.timeDim = ""
            }
            $http.post("/ovu-energy/energy/stats/policy/time", $scope.search, fac.postConfig).success(function (resp) {
                var data = resp.data;
                $scope.policyListArr = data;
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
                var dateList = [];
                var va = [];
                if (!fac.isEmpty(data)) {

                    data.forEach(function (monthData, index1) {
                        dateList.push(monthData.time);
                        if (!monthData.policyList) {


                            va.push(monthData.total);
                            seriesColumn = {
                                type: 'bar',
                                data: va,
                            }
                            seriesLine = {
                                type: 'line',
                                data: va,
                            }
                        } else {
                            monthData.policyList.forEach(function (classify, index2) {
                                if (index1 == 0) {
                                    var copyColumn = angular.copy(tempColumn);
                                    var copyLine = angular.copy(tempLine);
                                    /*  console.log(copy);*/
                                    copyColumn.name = classify.name;
                                    copyLine.name = classify.name;
                                    copyColumn.data.push(classify.value);
                                    copyLine.data.push(classify.value);
                                    seriesColumn.push(copyColumn);
                                    seriesLine.push(copyLine);
                                    energyName.push(classify.name);
                                } else {
                                    seriesColumn[index2].data.push(classify.value);
                                    seriesLine[index2].data.push(classify.value);
                                }
                            });
                        }


                    });
                    $scope.policyLineTrendData.legend.data = energyName;
                    $scope.policyLineTrendData.xAxis.data = dateList;

                    $scope.policyLineTrendData.series = seriesLine;
                    $scope.policyLineTrendData.title.text = '数据统计';
                    $scope.policyColumnTrendData.xAxis[0].data = dateList;
                    $scope.policyColumnTrendData.legend.data = energyName;
                    $scope.policyColumnTrendData.series = seriesColumn;
                    $scope.policyColumnTrendData.title.text = '数据统计';


                } else {
                    $scope.policyLineTrendData.xAxis.data = [];
                    $scope.policyColumnTrendData.xAxis.data = [];
                    $scope.policyLineTrendData.series = [];
                    $scope.policyColumnTrendData.series = [];
                    $scope.policyLineTrendData.legend.data = [];
                    $scope.policyColumnTrendData.legend.data = [];
                }

            });
        }

        $scope.findTime = function () {
            $scope.search.startTime = '';
            $scope.search.endTime = '';
            $scope.find();
        }
        $scope.selectTime = function (time) {
            $scope.search.timeDim = time;
            $scope.findTime();
        };
        $scope.policyLineTrendData = {
            title: {
                // text: '能源消耗趋势图',
                left: 'center'
            },
            tooltip: {
                trigger: 'axis',
                formatter: function (params) {
                    if (params instanceof Array) {
                        var relVal = params[0].name; //x轴名称
                        for (var i = 0, l = params.length; i < l; i++) {
                            relVal += '<br/>' + params[i].seriesName + ' : ' + params[i].value;
                        }

                        return relVal;
                    }
                    formatter: "{b}<br/>{a} : {c}分"
                }

            },
            legend: {
                orient: 'vertical',
                x: 'right',
                y: 'center',
                data: []
            },
            xAxis: {
                type: 'category',
                // name: 'x',
                splitLine: {
                    show: false
                },
                data: [],
                //设置字体竖直
                // axisLabel: {
                //     interval: 0,
                //     formatter: function (value) {
                //         return value.split("").join("\n");
                //     }
                // }
            },

            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            yAxis: {
                type: 'value'
                //name: 'y'
            },
            series: [{
                    name: '',
                    type: 'line',
                    data: [],

                },
                {
                    name: '',
                    type: 'line',
                    data: [],

                }
            ]
        };
        $scope.policyColumnTrendData = {
            title: {

                // subtext: '单位：kW·h ',
                left: 'center'
            },
            tooltip: {
                trigger: 'axis',
                formatter: function (params) {
                    if (params instanceof Array) {
                        var relVal = params[0].name; //x轴名称
                        for (var i = 0, l = params.length; i < l; i++) {
                            relVal += '<br/>' + params[i].seriesName + ' : ' + params[i].value;
                        }

                        return relVal;
                    }
                    formatter: "{b}<br/>{a} : {c}分"
                }

            },
            legend: {
                orient: 'vertical',
                x: 'right',
                y: 'center',
                data: []
            },
            xAxis: [{
                type: 'category',
                data: [],
                // //设置字体竖直
                // axisLabel: {
                //     interval: 0,
                //     formatter: function (value) {
                //         return value.split("").join("\n");
                //     }
                // }
            }],
            yAxis: [{
                type: 'value'
            }],
            series: [{
                    name: '',
                    type: 'bar',
                    data: [],

                },
                {
                    name: '',
                    type: 'bar',
                    data: [],

                }
            ]
        };

        $scope.toggleLine = function (flag) {
            if (flag) {
                $scope.isLine = true;
                $scope.isColumn = false;
            } else {
                $scope.isLine = false;
                $scope.isColumn = true;
            }
        };

    });

    app.controller('energyDataCtrl', function ($scope, $http, $uibModal, $filter, fac) {
        $scope.date = 0;
        $scope.dateTime = 0;
        $scope.timeDims = 'year';
        $scope.search.time = moment().format('YYYY')
        $scope.$on('index1', function (event, data) {

            $scope.find();

        });
        $scope.find = function (data) {
            if ($scope.date == 0) {
                $scope.timeDims = 'year'
            } else if ($scope.date == 1) {
                $scope.timeDims = 'month'
            } else {
                $scope.timeDims = 'day'
            }
            delete $scope.search.timeDim;

            $http.post("/ovu-energy/energy/stats/policy/data", {
                meterType: $scope.search.meterType,
                timeDim: $scope.timeDims,
                time: $scope.search.time,
                parkId: $scope.search.parkId
            }, fac.postConfig).success(function (resp) {
                var data = resp.data;
                $scope.dateLists = data;
                var nameList = ["总值", "累计值"];
                var timeList = [];
                var totalList = [];
                $scope.levelList = [];
                var aggValueList = [];


                if (!fac.isEmpty(data)) {

                    data.forEach(function (monthData) {
                        $scope.levelList.push(monthData.policyName);
                        timeList.push(monthData.time);
                        totalList.push(monthData.total);
                        aggValueList.push(monthData.aggValue)


                    });
                    $scope.dataLineTrendData.legend.data = nameList;
                    $scope.dataColumnTrendData.legend.data = nameList;
                    $scope.dataLineTrendData.xAxis.data = timeList;
                    $scope.dataColumnTrendData.xAxis.data = timeList;

                    $scope.dataLineTrendData.series = [{
                            name: nameList[0],
                            data: totalList,
                            type: 'line'
                        },
                        {
                            name: nameList[1],
                            data: aggValueList,
                            type: 'line'
                        }
                    ]
                    $scope.dataColumnTrendData.series = [{
                            name: nameList[0],
                            data: totalList,
                            type: 'bar'
                        },
                        {
                            name: nameList[1],
                            data: aggValueList,
                            type: 'bar'
                        }
                    ];

                    $scope.dataLineTrendData.title.text = '数据统计';
                    $scope.dataColumnTrendData.title.text = '数据统计';


                } else {
                    $scope.dataLineTrendData.xAxis.data = [];
                    $scope.dataColumnTrendData.xAxis.data = [];
                    $scope.dataLineTrendData.series = [];
                    $scope.dataColumnTrendData.series = [];
                    $scope.dataLineTrendData.legend.data = [];
                    $scope.dataColumnTrendData.legend.data = [];
                }

            });
            $scope.findData(data)
        }
        $scope.findData = function () {

            $http.post("/ovu-energy/energy/classify/policy", {
                policyType: 2,
                meterType: $scope.search.meterType
            }, fac.postConfig).success(function (res) {
                $scope.dataList = res.data
            })
        }
        $scope.changeTime = function (date) {
            $scope.search.time = '';


        }
        $scope.findTime = function () {
            $scope.search.startTime = '';
            $scope.search.endTime = '';
            $scope.find();
        }
        $scope.selectTime = function (time) {
            $scope.search.timeDim = time;
            $scope.findTime();
        };
        $scope.dataLineTrendData = {
            title: {
                // text: '能源消耗趋势图',
                left: 'center'
            },
            tooltip: {
                trigger: 'axis',
                formatter: function (params) {
                    // if (params instanceof Array) {
                    //     var relVal = params[0].name;  //x轴名称
                    //     for (var i = 0, l = params.length; i < l; i++) {
                    //         relVal += '</br>'+params[i].seriesName+'<br/> 总值: ' + params[i].value;
                    //     }

                    //     return relVal;
                    // }
                    // formatter: "{b}<br/>{a} : {c}分"
                    if (params instanceof Array) {

                        return params[0].name +
                            '<br />总值：' + params[0].value +
                            '<br />累计值：' + params[1].value + '<br />' +
                            '所属阶段：' + ($scope.levelList[params[0].dataIndex] == undefined ? '' : $scope.levelList[params[0].dataIndex]);
                    }
                }

            },
            legend: {
                orient: 'vertical',
                x: 'right',
                y: 'center',
                data: []
            },
            xAxis: {
                type: 'category',
                // name: 'x',
                splitLine: {
                    show: false
                },
                data: [],

            },

            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            yAxis: {
                type: 'value'
                //name: 'y'
            },
            series: [


            ]
        };
        $scope.dataColumnTrendData = {
            title: {
                // text: '能源消耗趋势图',
                // subtext: '单位：kW·h ',
                left: 'center'
            },
            tooltip: {
                trigger: 'axis',
                formatter: function (params) {
                    if (params instanceof Array) {

                        return params[0].name +
                            '<br />总值：' + params[0].value +
                            '<br />累计值：' + params[1].value + '<br />' +
                            '所属阶段：' + ($scope.levelList[params[0].dataIndex] == undefined ? '' : $scope.levelList[params[0].dataIndex]);
                    }
                }

            },
            legend: {
                orient: 'vertical',
                x: 'right',
                y: 'center',
                data: []
            },
            xAxis: {
                type: 'category',
                data: [],

            },

            yAxis: [{
                type: 'value'
            }],
            series: [

            ]
        };

        $scope.toggleLine = function (flag) {

            if (flag) {
                $scope.isLine = true;
                $scope.isColumn = false;
            } else {
                $scope.isLine = false;
                $scope.isColumn = true;
            }
        };
    });

})();
