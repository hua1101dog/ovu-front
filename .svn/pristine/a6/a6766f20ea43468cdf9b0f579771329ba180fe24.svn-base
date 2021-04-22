/*
 *
 */
'use strict';

/* Controllers */

angular.module('app')
    .controller('AppCtrl', ['$scope', '$rootScope', '$window', '$http', '$state', 'AppService', 'MENULIST',
        function($scope, $rootScope, $window, $http, $state, AppService, MENULIST) {
            //路由切换开始
            var index;
            $scope.$on('$stateChangeStart', function(event, state) {
                if (state.name.indexOf('app.operation') != -1) {
                    index = 0;
                } else if (state.name.indexOf('app.facility') != -1) {
                    index = 0;
                } else if (state.name.indexOf('app.safe') != -1) {
                    index = 2;
                } else {
                    index = 3;
                }
                $scope.menuList = MENULIST[index];

                if ($scope.video.on) {
                    $scope.video.on = false;
                    $scope.video.id = null;
                }
            });
            $window.onresize = function() {
                $scope.$broadcast('onWindowResize');
            };

            $scope.video = AppService.video;

            $scope.$on('closePlay',function (data) {
                AppService.video.on =false;
            });

           /* if (!$rootScope.logo) {
                $rootScope.logo = AppService.park && AppService.park.logo;
            }*/
        }
    ])

.service('AppService', function($http) {
    var that = this;
    /*var session = sessionStorage.park && JSON.parse(sessionStorage.park);
    this.park = session || {};*/
    //项目编号
    this.parkNo = '042010600012046';
    //公共饼图
    this.commonPileOption = function(data) {
        var name = [];
        data && data.forEach(function(da) {
            if (!("name" in da)) {
                da.name = "其他";
            }
            if (!("value" in da)) {
                da.value = 0;
            }
            da.name += '(' + da.value + ')';
            name.push(da.name);
        });
        return angular.merge({}, {
            tooltip: {
                trigger: 'item',
                // formatter: "{a} <br/>{b}: {c} ({d}%)",
                formatter: "{d}%",
                // position: ['50%', '50%']
            },
            grid: {
                left: 'center'
            },
            legend: {
                orient: 'vertical',
                left: 'right',
                top: 'middle',
                data: name
            },
           /* color: ["#85B9F5", "#FA727E", "#3AD35E","#FF6666","#663366","#CCFFFF","#666699","#FF3399"],*/
            series: [{
                name: '详情',
                type: 'pie',
                radius: ['50%', '70%'],
                center: ['35%', '50%'],
                avoidLabelOverlap: false,
                label: {
                    normal: {
                        show: false,
                        position: 'center'
                    },
                    emphasis: {
                        show: true,
                        textStyle: {
                            fontSize: '15',
                            fontWeight: 'bold'
                        }
                    }
                },
                labelLine: {
                    normal: {
                        show: false
                    }
                },
                data: data
            }]

        });
    };

    //折线图
    this.getPolyOption = function(data, yAxisName) {
        // console.log(data);
        var data0 = {
            Apr: 25,
            Aug: 50,
            Dec: 72,
            Feb: 40,
            Jan: 50,
            Jul: 60,
            Jun: 42,
            Mar: 25,
            May: 25,
            Nov: 80,
            Oct: 68,
            Sep: 25
        };

        var monthMap = {
            Jan: '1月',
            Feb: '2月',
            Mar: '3月',
            Apr: '4月',
            May: '5月',
            Jun: '6月',
            Jul: '7月',
            Aug: '8月',
            Sep: '9月',
            Oct: '10月',
            Nov: '11月',
            Dec: '12月',
        };

        var trendData = [];
        // map数据
        angular.forEach(data, function(v, i) {
            monthMap[i] && trendData.push({
                name: monthMap[i],
                value: v,
            });
        });
        // 数据按照月份排序
        trendData.sort(function(a, b) {
            return parseInt(a.name.slice(0, -1)) - parseInt(b.name.slice(0, -1));
        });
        // 临时去掉12月份数据
        if (trendData.length > 11) {
            trendData.pop();
        }

        // 获取 排好序的月份
        var xAxisData = trendData.map(function(v) {
            return v.name;
        });

        // console.log(trendData);
        // console.log(xAxisData);

        return {
            title: {
                text: ''
            },
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                show: false,
            },
            grid: {
                show: false,
                left: '3%',
                right: '10%',
                bottom: '3%',
                containLabel: true
            },
            toolbox: {
                feature: {
                    // saveAsImage: {}
                }
            },
            xAxis: {
                axisLabel: {
                    fontSize: 8,
                    rotate: -15,
                    interval: 0
                },
                splitLine: {
                    show: false,
                },
                axisTick: {
                    show: false
                },
                axisLine: {
                    lineStyle: {
                        color: '#666'
                    }
                },
                type: 'category',
                boundaryGap: false,
                // data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
                data: xAxisData
            },
            yAxis: {
                type: 'value',
                // name: '单位：m³',
                name: yAxisName,
                splitLine: {
                    show: false,
                },
                axisTick: {
                    show: false
                },
                axisLine: {
                    lineStyle: {
                        color: '#666'
                    }
                },
            },
            series: [{
                    type: 'line',
                    symbol: 'circle',
                    label: {
                        normal: {
                            // show: true,
                            show: false,
                            position: [2, -15],
                        }

                    },
                    itemStyle: {
                        normal: {
                            color: '#2A60FF',
                            borderColor: '#2A60FF',
                            borderWidth: 3,
                        }
                    },
                    lineStyle: {
                        normal: {
                            color: '#2A60FF',
                            width: 3
                        }
                    },
                    // [{name value}]
                    data: trendData
                },

            ]
        };
    };

    //公共http请求
    //获取右侧部分总和
    this.getTotal = function(param) {
        return $http.get("/ovu-screen/pcos/show/total", { params: param }).then(function(resp) {
            return resp.data;
        });
    };
    //获取右侧部分图表数据
    this.getChartData = function(param) {
        return $http.get("/ovu-screen/pcos/show/chartData", { params: param }).then(function(resp) {
            return resp.data;
        });
    };
    //获取右侧设备
    this.getEquipList = function(param) {
        return $http.get("/ovu-screen/pcos/show/equip/list", { params: param }).then(function(resp) {
            return resp.data;
        });
    };

    //视频
    this.video = {};
    this.showVideo = function(id) {
        this.video.on = true;
        this.video.id = id;
    };

    // 添加一个state保存当前页面的状态
    this.displayState = {
        id: 'elevator',
        name: '园区',
        pname: ''
    };
    // 设置状态
    this.setState = function(obj) {
        this.displayState = angular.copy(obj);
    };
    // 读取状态
    this.getState = function() {
        return angular.copy(this.displayState);
    };


});
