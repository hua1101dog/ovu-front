//全况统计
(function () {
    "use strict";
    var app = angular.module("angularApp");
    app.controller('dashboardCtrl', function ($scope, $rootScope, $http, $uibModal, $q, fac, dashboardService) {
        document.title = "全况";
        /**
         * 查询信息
         * @type {{}}
         */
        $scope.search = {};

        /**
         * 城市
         */
        $scope.cities = [["武汉", "武汉"]];

        /**
         * 停车场
         * @type {Array}
         */
        $scope.parklots = [];

        /**
         * 项目信息
         * @type {{}}
         */
        $scope.project = {};

        /**
         * 当前停车场
         * @type {{}}
         */
        $scope.parklot = {};

        /**
         * 城市
         * @type {string}
         */
        $scope.city = '武汉';

        /**
         * 项目所有的停车场
         * @type {Array}
         */
        $scope.projectParklots = [];

        $scope.parklotsAllSpaceNum = 0;

        $scope.parklotsAllFreeSpaceNum = 0;

        var map;

        app.modulePromiss.then(function () {
            fac.initPage($scope, function () {//项目
                $scope.projectInit();
            }, function () {//集团
                //选择一个项目
                if (!('parkId' in $scope.search) && !$scope.search.parkId) {
                    alert("请先选择一个项目");
                } else {
                    $scope.groupInit();
                }
            })
        });


        /**
         * 查询
         *
         */
        $scope.find = function () {
            if (!$scope.search.parklot) {
                alert("请先选择一个停车场");
                return;
            }
            $scope.search.parklotId = $scope.search.parklot.parklotId;
            getAnnulus();
        };

        /**
         * 选择城市事件
         */
        $scope.selectCity = function (city) {
            $scope.city = city;
            getParklots({city: city, parkId: $scope.search.parkId}).then(function (parklots) {
                $scope.parklots = parklots;
            });
        };

        /**
         * 选择车场事件
         */
        $scope.selectParklot = function (parklot) {
            //集团版
            if ($scope.search.isGroup) {
                //停车场实收收入图 趋势图
                loadActIncomeTrend();

                //车流量对比
                loadTrafficNumTrend();

                //月卡缴费柱状图
                loadMonthCardPaymentBarGroup();
            } else {
                //停车场实收收入图 趋势图
                loadActIncomeTrendProject();

                //月卡缴费柱状图
                loadMonthCardPaymentBarProject();

                //异常放行柱状图
                loadAbnormalReleaseBar();

                //每日车辆构成柱状图
                loadCarTypeBar();
            }
        };

        /**
         * 项目版 init
         */
        $scope.projectInit = function () {
            //$scope.search.parkId
            //绘制会有饼状图
            getAnnulus();
        };


        /**
         * 集团版 init
         */
        $scope.groupInit = function () {
            //绘制会有饼状图
            getAnnulus();

            //加载地图
            loadMap();

            //项目信息
            $http.post("/ovu-base/system/park/get.do", {id: $scope.search.parkId}, fac.postConfig).success(function (data, status, headers, config) {
                data = data.data;
                $scope.project = data;

                //清除原覆盖物
                map.clearMap();

                //标注项目位置
                new AMap.Marker({
                    position: [data.mapLng, data.mapLat],
                    title: data.parkName,
                    map: map
                });

                map.setZoomAndCenter(15, [data.mapLng, data.mapLat]);
            });

            //显示项目默认停车场信息
            getParklots({parkId: $scope.search.parkId}).then(function (parklots) {
                $scope.parklots = parklots;
                $scope.parklots.forEach(function (value) {
                    $scope.parklotsAllSpaceNum += value.totalSpaceNum;
                    $scope.parklotsAllFreeSpaceNum += value.freeSpaceNum;
                });

                //停车场环形图
                loadParklotAnnulus();
            });

        };

        /**
         * 饼状图 用例
         * @type {{payableMoneyAnnulusListLegends: string[], preferentialMoneyAnnulusListLegends: string[], payactMoneyAnnulusListLegends: string[], parkCarAnnulusListLegends: string[]}}
         */
        var annulusListLegends = {
            payableMoneyAnnulusListLegends: ['临时车', '月卡车', 'VIP车', '储值卡', '其它车'],
            preferentialMoneyAnnulusListLegends: ['优惠车', '月卡车', 'VIP车', '免费', '其它'],
            payactMoneyAnnulusListLegends: ['现金', '线上支付', 'POS支付', '月卡', '储值卡'],
            parkCarAnnulusListLegends: ['临时车', '月卡车', 'VIP车', '其它车']
        };


        /**
         * 绘制饼状图
         */
        function makeAnnulus(annulusChartId, annulusListLegend, chartData, total) {
            var annulusChart = echarts.init(document.getElementById(annulusChartId));

            var annulusOption = {
                title: {
                    text: total,
                    textStyle: {
                        fontWeight: 'bolder',
                        fontFamily: 'Microsoft YaHei',
                        fontSize: 32,
                        align: 'center'
                    },
                },
                tooltip: {
                    trigger: 'item',
                    formatter: "{a} <br/>{b}: {c} ({d}%)"
                },
                legend: {
                    orient: 'horizontal',
                    y: 'bottom',
                    data: annulusListLegend
                },
                series: [
                    {
                        name: '',
                        type: 'pie',
                        radius: ['50%', '70%'],
                        avoidLabelOverlap: false,
                        label: {
                            normal: {
                                show: false,
                                position: 'right'
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
                        data: chartData
                    }
                ]
            };
            annulusChart.setOption(annulusOption);
        };

        var loadAnnulusDatas = function (search, type) {
            $http.post("/ovu-pcos/pcos/parklot/dashboard/getAnnulusChartData.do?type=" + type, search, fac.postConfig).success(function (data, status, headers, config) {
                if (data.code === 0) {
                    var total = 0;
                    data.data.forEach(function (value) {
                        total += value.value;
                    });
                    switch (type) {
                        case 1:
                            makeAnnulus("payableMoneyAnnulus",
                                annulusListLegends.payableMoneyAnnulusListLegends,
                                data.data, total);
                            break;
                        case 2:
                            makeAnnulus("preferentialMoneyAnnulus",
                                annulusListLegends.preferentialMoneyAnnulusListLegends,
                                data.data, total);
                            break;
                        case 3:
                            makeAnnulus("payactMoneyAnnulus",
                                annulusListLegends.payactMoneyAnnulusListLegends,
                                data.data, total);
                            break;
                        case 4:
                            makeAnnulus("parkCarAnnulus",
                                annulusListLegends.parkCarAnnulusListLegends,
                                data.data, total);
                            break;
                    }
                } else {
                    msg(data.message);
                }
            });
        };


        /**
         * 获得饼状图数据
         * 绘制饼状图
         */
        var getAnnulus = function () {
            loadAnnulusDatas($scope.search, 1);
            loadAnnulusDatas($scope.search, 2);
            loadAnnulusDatas($scope.search, 3);
            loadAnnulusDatas($scope.search, 4);
        };

        /**
         * 加载项目地点地图
         */
        var loadMap = function () {
            map = map || new AMap.Map('container', {
                resizeEnable: true,
                zoom: 13
            });
        }

        /**
         * 停车场环形图
         */
        var loadParklotAnnulus = function () {
            var annulusChart = echarts.init(document.getElementById('parklotAnnulus'));
            var annulusOption = {
                title: {
                    show: false
                },
                tooltip: {
                    trigger: 'item',
                    formatter: "{a} <br/>{b}: {c} ({d}%)"
                },
                legend: {
                    orient: 'horizontal',
                    y: 'bottom',
                    data: ['总车位', '已用车位']
                },
                series: [
                    {
                        name: '停车位',
                        type: 'pie',
                        radius: ['50%', '70%'],
                        avoidLabelOverlap: false,
                        label: {
                            normal: {
                                show: false,
                                position: 'right'
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
                        data: [
                            {value: $scope.parklotsAllSpaceNum, name: '总车位'},
                            {value: $scope.parklotsAllFreeSpaceNum, name: '已用车位'},
                        ]
                    }
                ]
            };
            annulusChart.setOption(annulusOption);
        };

        function getDateStr(date) {
            const month = date.getMonth() + 1;
            const day = date.getDate();
            return [month, day].map(function (n) {
                n = n.toString();
                return n[1] ? n : '0' + n;
            }).join('-');
        }

        /**
         * 获得车场信息列表
         * @param parkId
         */
        var getParklots = function (param) {
            var deferred = $q.defer();
            $http.post("/ovu-pcos/pcos/parklot/park/getParklots.do", param, fac.postConfig).success(function (data, status, headers, config) {
                if (data.code === 0) {
                    var datas = data.data;
                    var parklots = [];
                    datas.forEach(function (e) {
                        parklots.push(e);
                        deferred.resolve(parklots);
                    });
                } else {
                    msg(data.message);
                }
            }).error(function (data, status, headers, config) {
                deferred.reject(data);
            });
            return deferred.promise;
        };

        /**
         * 折线图数据
         * @type {{actIncomeTrendList: Array}}
         */
        var trendDatas = {
            //实收收入
            actIncomexAxisDatas: [],
            actIncomexLegendDatas: [],
            actIncomeTrendList: [],

            //车流量
            trafficNumxAxisDatas: [],
            trafficNumxLegendDatas: [],
            //name type data
            trafficNumTrendList: []
        };

        /**
         * 柱状图数据
         */
        var barDatas = {
            //月卡缴费
            monthCardPayxAxisDatas: [],
            monthCardPayxLegendDatas: [],
            monthCardPayBarList: [],

            //异常放行
            abnormalReleasexAxisDatas: [],
            abnormalReleasexLegendDatas: ['1号岗', '2号岗', '3号岗', '4号岗'],
            abnormalReleaseBarList: [],

            //每日车辆构成
            carTypexAxisDatas: [],
            carTypexLegendDatas: ['临时车', 'VIP车', '月卡车', '其他'],
            carTypeBarList: []
        };

        //停车场 实收收入 集团版 ///////////////////////////////////////////////////////////////////////////////////////
        var actIncomeTrend;
        /**
         * 停车场实收收入图
         */
        var loadActIncomeTrend = function () {
            if ($scope.search.parklot) {

                actIncomeTrend = echarts.init(document.getElementById('actIncomeTrend'));

                //默认当前时间往前一周的时间
                var date = new Date();
                for (var i = 6; i >= 0; i--) {
                    date.setDate(date.getDate() - i);
                    trendDatas.actIncomexAxisDatas.push(getDateStr(date));
                    date = new Date();
                }

                var defaultParklotId = $scope.search.parklot.parklotId;
                var defaultParklotName = $scope.search.parklot.parklotName;

                trendDatas.actIncomexLegendDatas.push(new Date().getFullYear().toString());

                //获得默认同期对比数据
                var defaultCity = $scope.city;
                var defaultYear = new Date().getFullYear();
                var defaultSearch = {
                    city: defaultCity,
                    parklotId: defaultParklotId,
                    parklotName: defaultParklotName,
                    startDay: trendDatas.actIncomexAxisDatas[0],
                    endDay: trendDatas.actIncomexAxisDatas[trendDatas.actIncomexAxisDatas.length - 1],
                    startYear: defaultYear,
                    endYear: defaultYear
                };
                $http.post("/ovu-pcos/pcos/parklot/dashboard/getActIncomeSamePeriodContrast.do", defaultSearch, fac.postConfig).success(function (data, status, headers, config) {
                    if (data.code === 0) {
                        trendDatas.actIncomeTrendList = data.data;

                        var trendOption = {
                            title: {},
                            tooltip: {
                                trigger: 'axis'
                            },
                            legend: {
                                orient: 'horizontal',
                                data: trendDatas.actIncomexLegendDatas
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
                                data: trendDatas.actIncomexAxisDatas
                            },
                            yAxis: {
                                type: 'value'
                            },
                            series: trendDatas.actIncomeTrendList
                        };
                        actIncomeTrend.setOption(trendOption);

                    } else {
                        msg(data.message);
                    }
                });
            }
        };

        /**
         * 停车场实收收入图 同期对比
         */
        $scope.actIncomeSamePeriodContrast = function () {
            var param = {
                actIncomeTrend: actIncomeTrend
            };
            var modal = $uibModal.open({
                animation: true,
                templateUrl: 'parklot/modal.samePeriodContrast.html',
                controller: 'actIncomeSamePeriodContrastCtl'
                , resolve: {param: param}
            });
            modal.result.then(function () {
                $scope.find();
            }, function () {
                console.info('Modal dismissed at: ' + new Date());
            });
        }

        /**
         * 停车场实收收入图 车场选择
         */
        $scope.actIncomeParklotContrast = function () {
            var param = {
                actIncomeTrend: actIncomeTrend
            };
            var modal = $uibModal.open({
                animation: true,
                templateUrl: 'parklot/modal.parklotContrast.html',
                controller: 'actIncomeParklotContrastCtl'
                , resolve: {param: param}
            });
            modal.result.then(function () {
                $scope.find();
            }, function () {
                console.info('Modal dismissed at: ' + new Date());
            });
        };

        //停车场 实收收入 项目版 ///////////////////////////////////////////////////////////////////////////////////////
        var actIncomeTrendProject;

        var loadActIncomeTrendProject = function () {
            if ($scope.search.parklot) {

                actIncomeTrendProject = echarts.init(document.getElementById('actIncomeTrend'));

                //默认当前时间往前一周的时间
                var date = new Date();
                for (var i = 6; i >= 0; i--) {
                    date.setDate(date.getDate() - i);
                    trendDatas.actIncomexAxisDatas.push(getDateStr(date));
                    date = new Date();
                }

                var defaultParklotId = $scope.search.parklot.parklotId;
                var defaultParklotName = $scope.search.parklot.parklotName;

                trendDatas.actIncomexLegendDatas.push(new Date().getFullYear().toString());

                //获得默认同期对比数据
                var defaultCity = $scope.city;
                var defaultYear = new Date().getFullYear();
                var defaultSearch = {
                    city: defaultCity,
                    parklotId: defaultParklotId,
                    parklotName: defaultParklotName,
                    startDay: trendDatas.actIncomexAxisDatas[0],
                    endDay: trendDatas.actIncomexAxisDatas[trendDatas.actIncomexAxisDatas.length - 1],
                    startYear: defaultYear,
                    endYear: defaultYear
                };
                $http.post("/ovu-pcos/pcos/parklot/dashboard/getActIncomeSamePeriodContrast.do", defaultSearch, fac.postConfig).success(function (data, status, headers, config) {
                    if (data.code === 0) {
                        trendDatas.actIncomeTrendList = data.data;

                        var trendOption = {
                            title: {},
                            tooltip: {
                                trigger: 'axis'
                            },
                            legend: {
                                orient: 'horizontal',
                                data: trendDatas.actIncomexLegendDatas
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
                                data: trendDatas.actIncomexAxisDatas
                            },
                            yAxis: {
                                type: 'value'
                            },
                            series: trendDatas.actIncomeTrendList
                        };
                        actIncomeTrendProject.setOption(trendOption);

                    } else {
                        msg(data.message);
                    }
                });
            }
        };
        /**
         * 停车场 实收收入 项目版 搜索
         */
        $scope.actIncomeSearch = function () {
            if (!$scope.search.parklot) {
                alert("停车场必选");
                return;
            }

            if (!$scope.search.actIncomeStartDay || !$scope.search.actIncomeEndDay) {
                alert("时间范围必填");
                return;
            }

            var defaultParklotId = $scope.search.parklot.parklotId;
            var defaultParklotName = $scope.search.parklot.parklotName;


            if (!actIncomeTrendProject) {
                actIncomeTrendProject = echarts.init(document.getElementById('actIncomeTrend'));
            }

            var defaultSearch = {
                parklotId: defaultParklotId,
                parklotName: defaultParklotName,
                startTime: $scope.search.actIncomeStartDay,
                endTime: $scope.search.actIncomeEndDay
            };

            trendDatas.actIncomexLegendDatas.push(defaultParklotName);

            //横轴 天数
            var xAxis = dashboardService.getAxisDatasWithYear($scope.search.actIncomeStartDay, $scope.search.actIncomeEndDay);

            $http.post("/ovu-pcos/pcos/parklot/dashboard/getActIncomeTrendParklotContrast.do", defaultSearch, fac.postConfig).success(function (data, status, headers, config) {
                if (data.code === 0) {
                    trendDatas.actIncomeTrendList = data.data;

                    var trendOption = {
                        title: {},
                        tooltip: {
                            trigger: 'axis'
                        },
                        legend: {
                            orient: 'horizontal',
                            data: trendDatas.actIncomexLegendDatas
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
                            data: xAxis
                        },
                        yAxis: {
                            type: 'value'
                        },
                        series: trendDatas.actIncomeTrendList
                    };
                    actIncomeTrendProject.setOption(trendOption);

                } else {
                    msg(data.message);
                }
            });

        }

        //停车场车流量///////////////////////////////////////////////////////////////////////////////////////
        var trafficNumTrend;
        /**
         * 停车场车流量 同期对比图 初始化
         */
        var loadTrafficNumTrend = function () {
            if ($scope.search.parklot) {

                trafficNumTrend = echarts.init(document.getElementById('trafficNumTrend'));

                //默认当前时间往前一周的时间
                var date = new Date();
                for (var i = 6; i >= 0; i--) {
                    date.setDate(date.getDate() - i);
                    trendDatas.trafficNumxAxisDatas.push(getDateStr(date));
                    date = new Date();
                }

                var defaultParklotId = $scope.search.parklot.parklotId;
                var defaultParklotName = $scope.search.parklot.parklotName;

                trendDatas.trafficNumxLegendDatas.push(new Date().getFullYear().toString());

                //获得默认同期对比数据
                var defaultCity = $scope.city;
                var defaultYear = new Date().getFullYear();
                var defaultSearch = {
                    city: defaultCity,
                    parklotId: defaultParklotId,
                    parklotName: defaultParklotName,
                    startDay: trendDatas.trafficNumxAxisDatas[0],
                    endDay: trendDatas.trafficNumxAxisDatas[trendDatas.trafficNumxAxisDatas.length - 1],
                    startYear: defaultYear,
                    endYear: defaultYear
                };
                $http.post("/ovu-pcos/pcos/parklot/dashboard/getTrafficNumTrendSamePeriodContrast.do", defaultSearch, fac.postConfig).success(function (data, status, headers, config) {
                    if (data.code === 0) {
                        trendDatas.trafficNumTrendList = data.data;

                        var trendOption = {
                            title: {},
                            tooltip: {
                                trigger: 'axis'
                            },
                            legend: {
                                orient: 'horizontal',
                                data: trendDatas.trafficNumxLegendDatas
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
                                data: trendDatas.trafficNumxAxisDatas
                            },
                            yAxis: {
                                type: 'value'
                            },
                            series: trendDatas.trafficNumTrendList
                        };
                        trafficNumTrend.setOption(trendOption);

                    } else {
                        msg(data.message);
                    }
                });
            }
        };

        /**
         * 停车场车流量 同期对比
         */
        $scope.trafficNumTrendSamePeriodContrast = function () {
            var param = {
                trafficNumTrend: trafficNumTrend
            };
            var modal = $uibModal.open({
                animation: true,
                templateUrl: 'parklot/modal.samePeriodContrast.html',
                controller: 'trafficNumTrendSamePeriodContrastCtl'
                , resolve: {param: param}
            });
            modal.result.then(function () {
                $scope.find();
            }, function () {
                console.info('Modal dismissed at: ' + new Date());
            });
        };

        /**
         * 停车场车流量 车场选择
         */
        $scope.trafficNumTrendParklotContrast = function () {
            var param = {
                trafficNumTrend: trafficNumTrend
            };
            var modal = $uibModal.open({
                animation: true,
                templateUrl: 'parklot/modal.parklotContrast.html',
                controller: 'trafficNumTrendParklotContrastCtl'
                , resolve: {param: param}
            });
            modal.result.then(function () {
                $scope.find();
            }, function () {
                console.info('Modal dismissed at: ' + new Date());
            });
        };

        //月卡缴费柱状图 集团版///////////////////////////////////////////////////////////////////////////////////////
        var monthCardPayBarGroup;
        /**
         * 停车场 月卡缴费 默认同期对比
         */
        var loadMonthCardPaymentBarGroup = function () {
            if ($scope.search.parklot) {

                monthCardPayBarGroup = echarts.init(document.getElementById('monthCardPayBar'));

                //默认当前时间往前一周的时间
                var date = new Date();
                for (var i = 6; i >= 0; i--) {
                    date.setDate(date.getDate() - i);
                    barDatas.monthCardPayxAxisDatas.push(getDateStr(date));
                    date = new Date();
                }

                barDatas.monthCardPayxLegendDatas.push(new Date().getFullYear().toString());

                var defaultParklotId = $scope.search.parklot.parklotId;
                var defaultParklotName = $scope.search.parklot.parklotName;

                barDatas.monthCardPayxLegendDatas.push(defaultParklotName);

                //获得默认同期对比数据
                var defaultCity = $scope.city;
                var defaultYear = new Date().getFullYear();
                var defaultSearch = {
                    city: defaultCity,
                    parklotId: defaultParklotId,
                    parklotName: defaultParklotName,
                    startDay: barDatas.monthCardPayxAxisDatas[0],
                    endDay: barDatas.monthCardPayxAxisDatas[barDatas.monthCardPayxAxisDatas.length - 1],
                    startYear: defaultYear,
                    endYear: defaultYear
                };

                $http.post("/ovu-pcos/pcos/parklot/dashboard/getMonthCardPaySamePeriodContrast.do", defaultSearch, fac.postConfig).success(function (data, status, headers, config) {
                    if (data.code === 0) {
                        barDatas.monthCardPayBarList = data.data;

                        var barOption = {
                            title: {},
                            tooltip: {
                                trigger: 'axis'
                            },
                            legend: {
                                orient: 'horizontal',
                                data: barDatas.monthCardPayxLegendDatas
                            },
                            grid: {
                                left: '3%',
                                right: '4%',
                                bottom: '3%',
                                containLabel: true
                            },
                            xAxis: {
                                type: 'category',
                                boundaryGap: true,
                                data: barDatas.monthCardPayxAxisDatas
                            },
                            yAxis: {
                                type: 'value'
                            },
                            series: barDatas.monthCardPayBarList
                        };
                        monthCardPayBarGroup.setOption(barOption);

                    } else {
                        msg(data.message);
                    }
                });
            }
        };

        /**
         * 停车场 月卡缴费 同期对比
         */
        $scope.monthCardPayBarSamePeriodContrast = function () {
            var param = {
                monthCardPayBarGroup: monthCardPayBarGroup
            };
            var modal = $uibModal.open({
                animation: true,
                templateUrl: 'parklot/modal.samePeriodContrast.html',
                controller: 'monthCardPaySamePeriodContrastCtl'
                , resolve: {param: param}
            });
            modal.result.then(function () {
                $scope.find();
            }, function () {
                console.info('Modal dismissed at: ' + new Date());
            });
        }

        /**
         * 停车场 月卡缴费 车场选择
         */
        $scope.monthCardPayBarParklotContrast = function () {
            var param = {
                monthCardPayBarGroup: monthCardPayBarGroup
            };
            var modal = $uibModal.open({
                animation: true,
                templateUrl: 'parklot/modal.parklotContrast.html',
                controller: 'monthCardPayParklotContrastCtl'
                , resolve: {param: param}
            });
            modal.result.then(function () {
                $scope.find();
            }, function () {
                console.info('Modal dismissed at: ' + new Date());
            });
        };


        //月卡缴费柱状图 项目版 ///////////////////////////////////////////////////////////////////////////////////////
        var monthCardPayBarProject
        var loadMonthCardPaymentBarProject = function () {
            if ($scope.search.parklot) {

                monthCardPayBarProject = echarts.init(document.getElementById('monthCardPayBar'));

                //默认当前时间往前一周的时间
                var date = new Date();
                for (var i = 6; i >= 0; i--) {
                    date.setDate(date.getDate() - i);
                    barDatas.monthCardPayxAxisDatas.push(getDateStr(date));
                    date = new Date();
                }

                var defaultParklotId = $scope.search.parklot.parklotId;
                var defaultParklotName = $scope.search.parklot.parklotName;

                //获得默认同期对比数据
                var defaultCity = $scope.city;
                var defaultYear = new Date().getFullYear();
                var defaultSearch = {
                    city: defaultCity,
                    parklotId: defaultParklotId,
                    parklotName: defaultParklotName,
                    startDay: defaultYear + "-" + barDatas.monthCardPayxAxisDatas[0],
                    endDay: defaultYear + "-" + barDatas.monthCardPayxAxisDatas[barDatas.monthCardPayxAxisDatas.length - 1],
                };

                $http.post("/ovu-pcos/pcos/parklot/dashboard/getMonthCardPayBarProjectData.do", defaultSearch, fac.postConfig).success(function (data, status, headers, config) {
                    if (data.code === 0) {
                        barDatas.monthCardPayBarList = data.data;

                        var barOption = {
                            title: {},
                            tooltip: {
                                trigger: 'axis'
                            },
                            legend: {
                                orient: 'horizontal',
                                data: barDatas.monthCardPayxLegendDatas
                            },
                            grid: {
                                left: '3%',
                                right: '4%',
                                bottom: '3%',
                                containLabel: true
                            },
                            xAxis: {
                                type: 'category',
                                boundaryGap: true,
                                data: barDatas.monthCardPayxAxisDatas
                            },
                            yAxis: {
                                type: 'value'
                            },
                            series: barDatas.monthCardPayBarList
                        };
                        monthCardPayBarProject.setOption(barOption);

                    } else {
                        msg(data.message);
                    }
                });
            }
        };

        /**
         * 月卡缴费柱状图搜索
         */
        $scope.monthCardBarSearch = function () {
            var defaultCity = $scope.city;
            var defaultParklotId = $scope.search.parklot.parklotId;
            var defaultParklotName = $scope.search.parklot.parklotName;

            if (!defaultParklotId) {
                alert("停车场必选");
                return;
            }
            if (!$scope.search.monthCardBarStartDay || !$scope.search.monthCardBarEndDay) {
                alert("缴费时间范围必填");
                return;
            }

            if (!monthCardPayBarProject) {
                monthCardPayBarProject = echarts.init(document.getElementById('monthCardPayBar'));
            }

            var defaultSearch = {
                city: defaultCity,
                parklotId: defaultParklotId,
                parklotName: defaultParklotName,
                startDay: $scope.search.monthCardBarStartDay,
                endDay: $scope.search.monthCardBarEndDay
            };

            //横轴 天数
            var carTypexAxisDatas = dashboardService.getAxisDatasWithYear($scope.search.monthCardBarStartDay, $scope.search.monthCardBarEndDay);

            $http.post("/ovu-pcos/pcos/parklot/dashboard/getMonthCardPayBarProjectData.do", defaultSearch, fac.postConfig).success(function (data, status, headers, config) {
                if (data.code === 0) {
                    barDatas.monthCardPayBarList = data.data;

                    var barOption = {
                        title: {},
                        tooltip: {
                            trigger: 'axis'
                        },
                        legend: {
                            orient: 'horizontal',
                            data: barDatas.monthCardPayxLegendDatas
                        },
                        grid: {
                            left: '3%',
                            right: '4%',
                            bottom: '3%',
                            containLabel: true
                        },
                        xAxis: {
                            type: 'category',
                            boundaryGap: true,
                            data: carTypexAxisDatas
                        },
                        yAxis: {
                            type: 'value'
                        },
                        series: barDatas.monthCardPayBarList
                    };
                    monthCardPayBarProject.setOption(barOption);

                } else {
                    msg(data.message);
                }
            });
        }

        //异常放行柱状图///////////////////////////////////////////////////////////////////////////////////////
        var abnormalReleaseBar;
        var loadAbnormalReleaseBar = function () {
            //项目默认车场的数据
            if ($scope.search.parkId && $scope.search.parklot) {

                abnormalReleaseBar = echarts.init(document.getElementById('abnormalReleaseBar'));

                //默认当前时间往前一周的时间
                var date = new Date();
                for (var i = 6; i >= 0; i--) {
                    date.setDate(date.getDate() - i);
                    barDatas.abnormalReleasexAxisDatas.push(getDateStr(date));
                    date = new Date();
                }

                var defaultParklotId = $scope.search.parklot.parklotId;
                var defaultParklotName = $scope.search.parklot.parklotName;

                barDatas.abnormalReleasexLegendDatas.push(new Date().getFullYear().toString());

                //获得默认同期对比数据
                var defaultCity = $scope.city;
                var defaultYear = new Date().getFullYear();
                var defaultSearch = {
                    city: defaultCity,
                    parklotId: defaultParklotId,
                    parklotName: defaultParklotName,
                    startDay: defaultYear + "-" + barDatas.abnormalReleasexAxisDatas[0],
                    endDay: defaultYear + "-" + barDatas.abnormalReleasexAxisDatas[barDatas.abnormalReleasexAxisDatas.length - 1],
                };

                $http.post("/ovu-pcos/pcos/parklot/dashboard/getAbnormalReleaseBarData.do", defaultSearch, fac.postConfig).success(function (data, status, headers, config) {
                    if (data.code === 0) {
                        barDatas.abnormalReleaseBarList = data.data;

                        var barOption = {
                            title: {},
                            tooltip: {
                                trigger: 'axis'
                            },
                            legend: {
                                orient: 'horizontal',
                                data: barDatas.abnormalReleasexLegendDatas
                            },
                            grid: {
                                left: '3%',
                                right: '4%',
                                bottom: '3%',
                                containLabel: true
                            },
                            xAxis: {
                                type: 'category',
                                boundaryGap: true,
                                data: barDatas.abnormalReleasexAxisDatas
                            },
                            yAxis: {
                                type: 'value'
                            },
                            series: barDatas.abnormalReleaseBarList
                        };
                        abnormalReleaseBar.setOption(barOption);

                    } else {
                        msg(data.message);
                    }
                });
            }
        };
        /**
         * 异常放行搜索
         */
        $scope.abnormalReleaseBarSearch = function () {
            var defaultCity = $scope.city;
            var defaultParklotId = $scope.search.parklot.parklotId;
            var defaultParklotName = $scope.search.parklot.parklotName;

            if (!defaultParklotId) {
                alert("停车场必选");
                return;
            }
            if (!$scope.search.abnormalReleaseBarStartDay || !$scope.search.abnormalReleaseBarEndDay) {
                alert("出车时间范围必填");
                return;
            }

            if (!abnormalReleaseBar) {
                abnormalReleaseBar = echarts.init(document.getElementById('abnormalReleaseBar'));
            }

            var defaultSearch = {
                city: defaultCity,
                parklotId: defaultParklotId,
                parklotName: defaultParklotName,
                startDay: $scope.search.abnormalReleaseBarStartDay,
                endDay: $scope.search.abnormalReleaseBarEndDay
            };

            //横轴 天数
            var xAxisDatas = dashboardService.getAxisDatasWithYear($scope.search.abnormalReleaseBarStartDay, $scope.search.abnormalReleaseBarEndDay);

            $http.post("/ovu-pcos/pcos/parklot/dashboard/getAbnormalReleaseBarData.do", defaultSearch, fac.postConfig).success(function (data, status, headers, config) {
                if (data.code === 0) {
                    barDatas.abnormalReleaseBarList = data.data;

                    var barOption = {
                        title: {},
                        tooltip: {
                            trigger: 'axis'
                        },
                        legend: {
                            orient: 'horizontal',
                            data: barDatas.abnormalReleasexLegendDatas
                        },
                        grid: {
                            left: '3%',
                            right: '4%',
                            bottom: '3%',
                            containLabel: true
                        },
                        xAxis: {
                            type: 'category',
                            boundaryGap: true,
                            data: xAxisDatas
                        },
                        yAxis: {
                            type: 'value'
                        },
                        series: barDatas.abnormalReleaseBarList
                    };
                    abnormalReleaseBar.setOption(barOption);

                } else {
                    msg(data.message);
                }
            });
        }

        //每日车辆构成柱状图///////////////////////////////////////////////////////////////////////////////////////
        var carTypeBar;
        var loadCarTypeBar = function () {
            // $scope.parklot = {
            //     parklotId:'799',
            //     parklotName:'武汉安顺星苑'
            // }
            if ($scope.search.parkId && $scope.search.parklot) {

                carTypeBar = echarts.init(document.getElementById('carTypeBar'));

                //默认当前时间往前一周的时间
                var date = new Date();
                for (var i = 6; i >= 0; i--) {
                    date.setDate(date.getDate() - i);
                    barDatas.carTypexAxisDatas.push(getDateStr(date));
                    date = new Date();
                }

                var defaultParklotId = $scope.search.parklot.parklotId;
                var defaultParklotName = $scope.search.parklot.parklotName;

                barDatas.carTypexLegendDatas.push(new Date().getFullYear().toString());

                //获得默认同期对比数据
                var defaultCity = $scope.city;
                var defaultYear = new Date().getFullYear();
                var defaultSearch = {
                    city: defaultCity,
                    parklotId: defaultParklotId,
                    parklotName: defaultParklotName,
                    startDay: defaultYear + "-" + barDatas.carTypexAxisDatas[0],
                    endDay: defaultYear + "-" + barDatas.carTypexAxisDatas[barDatas.carTypexAxisDatas.length - 1],
                };

                $http.post("/ovu-pcos/pcos/parklot/dashboard/getCarTypeBarData.do", defaultSearch, fac.postConfig).success(function (data, status, headers, config) {
                    if (data.code === 0) {
                        barDatas.carTypeBarList = data.data;

                        var barOption = {
                            title: {},
                            tooltip: {
                                trigger: 'axis'
                            },
                            legend: {
                                orient: 'horizontal',
                                data: barDatas.carTypexLegendDatas
                            },
                            grid: {
                                left: '3%',
                                right: '4%',
                                bottom: '3%',
                                containLabel: true
                            },
                            xAxis: {
                                type: 'category',
                                boundaryGap: true,
                                data: barDatas.carTypexAxisDatas
                            },
                            yAxis: {
                                type: 'value'
                            },
                            series: barDatas.carTypeBarList
                        };
                        carTypeBar.setOption(barOption);

                    } else {
                        msg(data.message);
                    }
                });
            }
        };
        /**
         * 每日车辆构成搜索
         */
        $scope.carTypeBarSearch = function () {
            var defaultCity = $scope.city;
            var defaultParklotId = $scope.search.parklot.parklotId;
            var defaultParklotName = $scope.search.parklot.parklotName;

            if (!carTypeBar) {
                carTypeBar = echarts.init(document.getElementById('carTypeBar'));
            }

            if (!defaultParklotId) {
                alert("停车场必选");
                return;
            }
            if (!$scope.search.carTypeBarStartDay || !$scope.search.carTypeBarEndDay) {
                alert("进车时间范围必填");
                return;
            }

            //横轴 天数
            var carTypexAxisDatas = dashboardService.getAxisDatasWithYear($scope.search.carTypeBarStartDay, $scope.search.carTypeBarEndDay);

            var defaultSearch = {
                city: defaultCity,
                parklotId: defaultParklotId,
                parklotName: defaultParklotName,
                startDay: $scope.search.carTypeBarStartDay,
                endDay: $scope.search.carTypeBarEndDay
            };

            $http.post("/ovu-pcos/pcos/parklot/dashboard/getCarTypeBarData.do", defaultSearch, fac.postConfig).success(function (data, status, headers, config) {
                if (data.code === 0) {
                    barDatas.carTypeBarList = data.data;

                    var barOption = {
                        title: {},
                        tooltip: {
                            trigger: 'axis'
                        },
                        legend: {
                            orient: 'horizontal',
                            data: barDatas.carTypexLegendDatas
                        },
                        grid: {
                            left: '3%',
                            right: '4%',
                            bottom: '3%',
                            containLabel: true
                        },
                        xAxis: {
                            type: 'category',
                            boundaryGap: true,
                            data: carTypexAxisDatas
                        },
                        yAxis: {
                            type: 'value'
                        },
                        series: barDatas.carTypeBarList
                    };
                    carTypeBar.setOption(barOption);

                } else {
                    msg(data.message);
                }
            });
        }
    });

    /**
     * 停车场实收收入图 同期对比
     * controller
     */
    app.controller('actIncomeSamePeriodContrastCtl', function ($scope, $rootScope, $http, $uibModalInstance, $uibModal, $filter, fac, dashboardService, param) {
        $scope.search = {};
        $scope.parklots = [];
        $scope.selectedParklot = {};

        var actIncomeTrend = param.actIncomeTrend;

        /**
         * 城市
         */
        $scope.cities = [["武汉", "武汉"]];

        /**
         * 根据城市查询车场信息
         *
         * @param parkId
         */
        var getParklots = function (city) {
            $http.post("/ovu-pcos/pcos/parklot/park/getParklots.do", {city: city}, fac.postConfig).success(function (data, status, headers, config) {
                if (data.code === 0) {
                    var datas = data.data;
                    datas.forEach(function (e) {
                        var parklot = {};
                        parklot.parklotId = e.parklotId;
                        parklot.parklotName = e.parklotName;
                        $scope.parklots.push(parklot);
                    });
                } else {
                    msg(data.message);
                }
            });
        };

        /**
         * 选择城市事件
         */
        $scope.selectCity = function (city) {
            getParklots(city);
        };

        /**
         * 监听选中的车场
         */
        $scope.$watch("selectedParklot", function (n) {
            if (('parklotId' in n) && ('parklotName' in n)) {
                $scope.search.parklotId = n.parklotId;
                $scope.search.parklotName = n.parklotName;
            } else {
                $scope.search.parklotId = "";
                $scope.search.parklotName = "";
            }
        });


        /**
         * 筛选查询
         */
        $scope.doSearch = function (search) {
            if (!$scope.search.city) {
                alert("城市必选");
                return;
            }
            if (!$scope.search.parklotId) {
                alert("停车场必选");
                return;
            }
            if (!search.startDay || !search.endDay) {
                alert("统计周期必填");
                return;
            }
            if (!search.startYear || !search.endYear) {
                alert("年份必选");
                return;
            }

            //用例
            var actIncomexLegendDatas = [];
            for (var y = 0; y <= parseInt(search.endYear) - parseInt(search.startYear); y++) {
                actIncomexLegendDatas.push((parseInt(search.startYear) + y).toString());
            }
            //横轴 天数
            var actIncomexAxisDatas = dashboardService.getAxisDatas(search.startDay, search.endDay);

            $http.post("/ovu-pcos/pcos/parklot/dashboard/getActIncomeSamePeriodContrast.do", search, fac.postConfig).success(function (data, status, headers, config) {
                if (data.code === 0) {
                    var trendOption = {
                        title: {},
                        tooltip: {
                            trigger: 'axis'
                        },
                        legend: {
                            orient: 'horizontal',
                            data: actIncomexLegendDatas
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
                            data: actIncomexAxisDatas
                        },
                        yAxis: {
                            type: 'value'
                        },
                        series: data.data
                    };
                    actIncomeTrend.setOption(trendOption);

                    $uibModalInstance.dismiss('cancel');
                } else {
                    msg(data.message);
                }
            });
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    });

    /**
     * 停车场实收收入图 车场对比
     * controller
     */
    app.controller('actIncomeParklotContrastCtl', function ($scope, $rootScope, $http, $uibModalInstance, $uibModal, $filter, fac, dashboardService, param) {
        $scope.search = {};
        $scope.parklots1 = [];
        $scope.parklots2 = [];
        $scope.parklots3 = [];
        $scope.parklots4 = [];

        $scope.selectedParklot1 = {};

        var actIncomeTrend = param.actIncomeTrend;

        var searchParklots = [];

        /**
         * 城市
         */
        $scope.cities = [["武汉", "武汉"]];

        /**
         * 监听选中的车场
         * @param parklotModel
         */
        var watchSelectedParklot = function (parklotModel) {
            $scope.$watch(parklotModel, function (n) {
                if (n) {
                    if (('parklotId' in n) && ('parklotName' in n)) {
                        if (!searchParklots.hasOwnProperty(n.parklotId)) {
                            searchParklots[n.parklotId] = n.parklotName;
                        }
                    }
                }
            });
        };

        watchSelectedParklot("selectedParklot1");
        watchSelectedParklot("selectedParklot2");
        watchSelectedParklot("selectedParklot3");
        watchSelectedParklot("selectedParklot4");

        /**
         * 根据城市查询车场信息
         *
         * @param parkId
         */
        var getParklots = function (city, index) {
            $http.post("/ovu-pcos/pcos/parklot/park/getParklots.do", {city: city}, fac.postConfig).success(function (data, status, headers, config) {
                if (data.code === 0) {
                    var parklots = [];
                    var datas = data.data;
                    datas.forEach(function (e) {
                        var parklot = {};
                        parklot.parklotId = e.parklotId;
                        parklot.parklotName = e.parklotName;
                        parklots.push(parklot);
                    });

                    switch (index) {
                        case 1:
                            $scope.parklots1 = parklots;
                            break;
                        case 2:
                            $scope.parklots2 = parklots;
                            break;
                        case 3:
                            $scope.parklots3 = parklots;
                            break;
                        case 4:
                            $scope.parklots4 = parklots;
                            break;
                    }

                } else {
                    msg(data.message);
                }
            });
        };


        /**
         * 选择城市事件
         */
        $scope.selectCity = function (city, index) {
            getParklots(city, index);
        };


        /**
         * 筛选查询
         * 筛选查询
         */
        $scope.doSearch = function (search) {
            if (!$scope.selectedParklot1.parklotId) {
                alert("至少选择一个车场");
                return;
            }
            if (!$scope.search.startTime || !$scope.search.endTime) {
                alert("统计周期必填");
                return;
            }
            var param = {
                parklotId: '',
                parklotName: '',
                startTime: search.startTime,
                endTime: search.endTime
            };
            //用例 选择的车场
            var actIncomexLegendDatas = [];
            var parklotIdsArr = [];
            for (var index in searchParklots) {
                actIncomexLegendDatas.push(searchParklots[index]);
                parklotIdsArr.push(index);
            }
            param.parklotId = parklotIdsArr.join();
            param.parklotName = actIncomexLegendDatas.join();

            //横轴 天数
            var actIncomexAxisDatas = dashboardService.getAxisDatasWithYear(search.startTime, search.endTime);

            $http.post("/ovu-pcos/pcos/parklot/dashboard/getActIncomeTrendParklotContrast.do", param, fac.postConfig).success(function (data, status, headers, config) {
                if (data.code === 0) {
                    var trendOption = {
                        title: {},
                        tooltip: {
                            trigger: 'axis'
                        },
                        legend: {
                            orient: 'horizontal',
                            data: actIncomexLegendDatas
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
                            data: actIncomexAxisDatas
                        },
                        yAxis: {
                            type: 'value'
                        },
                        series: data.data
                    };
                    actIncomeTrend.setOption(trendOption);

                    $uibModalInstance.dismiss('cancel');
                } else {
                    msg(data.message);
                }
            });
        };

        /**
         * 取消
         */
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    });

    /**
     * 停车场车流量 同期对比
     */
    app.controller('trafficNumTrendSamePeriodContrastCtl', function ($scope, $rootScope, $http, $uibModalInstance, $uibModal, $filter, fac, dashboardService, param) {
        $scope.search = {};
        $scope.parklots = [];
        $scope.selectedParklot = {};

        var trafficNumTrend = param.trafficNumTrend;

        /**
         * 城市
         */
        $scope.cities = [["武汉", "武汉"]];

        /**
         * 根据城市查询车场信息
         *
         * @param parkId
         */
        var getParklots = function (city) {
            $http.post("/ovu-pcos/pcos/parklot/park/getParklots.do", {city: city}, fac.postConfig).success(function (data, status, headers, config) {
                if (data.code === 0) {
                    var datas = data.data;
                    datas.forEach(function (e) {
                        var parklot = {};
                        parklot.parklotId = e.parklotId;
                        parklot.parklotName = e.parklotName;
                        $scope.parklots.push(parklot);
                    });
                } else {
                    msg(data.message);
                }
            });
        };

        /**
         * 选择城市事件
         */
        $scope.selectCity = function (city) {
            getParklots(city);
        };

        /**
         * 监听选中的车场
         */
        $scope.$watch("selectedParklot", function (n) {
            if (('parklotId' in n) && ('parklotName' in n)) {
                $scope.search.parklotId = n.parklotId;
                $scope.search.parklotName = n.parklotName;
            } else {
                $scope.search.parklotId = "";
                $scope.search.parklotName = "";
            }
        });


        /**
         * 筛选查询
         */
        $scope.doSearch = function (search) {
            if (!$scope.search.city) {
                alert("城市必选");
                return;
            }
            if (!$scope.search.parklotId) {
                alert("停车场必选");
                return;
            }
            if (!search.startDay || !search.endDay) {
                alert("统计周期必填");
                return;
            }
            if (!search.startYear || !search.endYear) {
                alert("年份必选");
                return;
            }

            //用例
            var trafficNumxLegendDatas = [];
            for (var y = 0; y <= parseInt(search.endYear) - parseInt(search.startYear); y++) {
                trafficNumxLegendDatas.push((parseInt(search.startYear) + y).toString());
            }
            //横轴 天数
            var trafficNumxAxisDatas = dashboardService.getAxisDatas(search.startDay, search.endDay);

            $http.post("/ovu-pcos/pcos/parklot/dashboard/getTrafficNumTrendSamePeriodContrast.do", search, fac.postConfig).success(function (data, status, headers, config) {
                if (data.code === 0) {
                    var trendOption = {
                        title: {},
                        tooltip: {
                            trigger: 'axis'
                        },
                        legend: {
                            orient: 'horizontal',
                            data: trafficNumxLegendDatas
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
                            data: trafficNumxAxisDatas
                        },
                        yAxis: {
                            type: 'value'
                        },
                        series: data.data
                    };
                    trafficNumTrend.setOption(trendOption);

                    $uibModalInstance.dismiss('cancel');
                } else {
                    msg(data.message);
                }
            });
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };

    });


    /**
     * 停车场车流量 车场选择
     */
    app.controller('trafficNumTrendParklotContrastCtl', function ($scope, $rootScope, $http, $uibModalInstance, $uibModal, $filter, fac, dashboardService, param) {
        $scope.search = {};
        $scope.parklots1 = [];
        $scope.parklots2 = [];
        $scope.parklots3 = [];
        $scope.parklots4 = [];

        $scope.selectedParklot1 = {};

        var trafficNumTrend = param.trafficNumTrend;

        var searchParklots = [];

        /**
         * 城市
         */
        $scope.cities = [["武汉", "武汉"]];

        /**
         * 监听选中的车场
         * @param parklotModel
         */
        var watchSelectedParklot = function (parklotModel) {
            $scope.$watch(parklotModel, function (n) {
                if (n) {
                    if (('parklotId' in n) && ('parklotName' in n)) {
                        if (!searchParklots.hasOwnProperty(n.parklotId)) {
                            searchParklots[n.parklotId] = n.parklotName;
                        }
                    }
                }
            });
        };

        watchSelectedParklot("selectedParklot1");
        watchSelectedParklot("selectedParklot2");
        watchSelectedParklot("selectedParklot3");
        watchSelectedParklot("selectedParklot4");

        /**
         * 根据城市查询车场信息
         *
         * @param parkId
         */
        var getParklots = function (city, index) {
            $http.post("/ovu-pcos/pcos/parklot/park/getParklots.do", {city: city}, fac.postConfig).success(function (data, status, headers, config) {
                if (data.code === 0) {
                    var parklots = [];
                    var datas = data.data;
                    datas.forEach(function (e) {
                        var parklot = {};
                        parklot.parklotId = e.parklotId;
                        parklot.parklotName = e.parklotName;
                        parklots.push(parklot);
                    });

                    switch (index) {
                        case 1:
                            $scope.parklots1 = parklots;
                            break;
                        case 2:
                            $scope.parklots2 = parklots;
                            break;
                        case 3:
                            $scope.parklots3 = parklots;
                            break;
                        case 4:
                            $scope.parklots4 = parklots;
                            break;
                    }

                } else {
                    msg(data.message);
                }
            });
        };


        /**
         * 选择城市事件
         */
        $scope.selectCity = function (city, index) {
            getParklots(city, index);
        };


        /**
         * 筛选查询
         */
        $scope.doSearch = function (search) {
            if (!$scope.selectedParklot1.parklotId) {
                alert("至少选择一个车场");
                return;
            }
            if (!$scope.search.startTime || !$scope.search.endTime) {
                alert("统计周期必填");
                return;
            }
            var param = {
                parklotId: '',
                parklotName: '',
                startTime: search.startTime,
                endTime: search.endTime
            };
            //用例 选择的车场
            var trafficNumxLegendDatas = [];
            var parklotIdsArr = [];
            for (var index in searchParklots) {
                trafficNumxLegendDatas.push(searchParklots[index]);
                parklotIdsArr.push(index);
            }
            param.parklotId = parklotIdsArr.join();
            param.parklotName = trafficNumxLegendDatas.join();

            //横轴 天数
            var trafficNumxAxisDatas = dashboardService.getAxisDatasWithYear(search.startTime, search.endTime);

            $http.post("/ovu-pcos/pcos/parklot/dashboard/getTrafficNumTrendParklotContrast.do", param, fac.postConfig).success(function (data, status, headers, config) {
                if (data.code === 0) {
                    var trendOption = {
                        title: {},
                        tooltip: {
                            trigger: 'axis'
                        },
                        legend: {
                            orient: 'horizontal',
                            data: trafficNumxLegendDatas
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
                            data: trafficNumxAxisDatas
                        },
                        yAxis: {
                            type: 'value'
                        },
                        series: data.data
                    };
                    trafficNumTrend.setOption(trendOption);

                    $uibModalInstance.dismiss('cancel');
                } else {
                    msg(data.message);
                }
            });
        };

        /**
         * 取消
         */
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };

    });


    /**
     * 停车场 月卡缴费 同期对比
     */
    app.controller('monthCardPaySamePeriodContrastCtl', function ($scope, $rootScope, $http, $uibModalInstance, $uibModal, $filter, fac, dashboardService, param) {
        $scope.search = {};
        $scope.parklots = [];
        $scope.selectedParklot = {};

        var monthCardPayBarGroup = param.monthCardPayBarGroup;

        /**
         * 城市
         */
        $scope.cities = [["武汉", "武汉"]];

        /**
         * 根据城市查询车场信息
         *
         * @param parkId
         */
        var getParklots = function (city) {
            $http.post("/ovu-pcos/pcos/parklot/park/getParklots.do", {city: city}, fac.postConfig).success(function (data, status, headers, config) {
                if (data.code === 0) {
                    var datas = data.data;
                    datas.forEach(function (e) {
                        var parklot = {};
                        parklot.parklotId = e.parklotId;
                        parklot.parklotName = e.parklotName;
                        $scope.parklots.push(parklot);
                    });
                } else {
                    msg(data.message);
                }
            });
        };

        /**
         * 选择城市事件
         */
        $scope.selectCity = function (city) {
            getParklots(city);
        };

        /**
         * 监听选中的车场
         */
        $scope.$watch("selectedParklot", function (n) {
            if (('parklotId' in n) && ('parklotName' in n)) {
                $scope.search.parklotId = n.parklotId;
                $scope.search.parklotName = n.parklotName;
            } else {
                $scope.search.parklotId = "";
                $scope.search.parklotName = "";
            }
        });


        /**
         * 筛选查询
         */
        $scope.doSearch = function (search) {
            if (!$scope.search.city) {
                alert("城市必选");
                return;
            }
            if (!$scope.search.parklotId) {
                alert("停车场必选");
                return;
            }
            if (!search.startDay || !search.endDay) {
                alert("统计周期必填");
                return;
            }
            if (!search.startYear || !search.endYear) {
                alert("年份必选");
                return;
            }

            //用例
            var legendDatas = [];
            for (var y = 0; y <= parseInt(search.endYear) - parseInt(search.startYear); y++) {
                legendDatas.push((parseInt(search.startYear) + y).toString());
            }
            //横轴 天数
            var axisDatas = dashboardService.getAxisDatas(search.startDay, search.endDay);

            $http.post("/ovu-pcos/pcos/parklot/dashboard/getMonthCardPaySamePeriodContrast.do", search, fac.postConfig).success(function (data, status, headers, config) {
                if (data.code === 0) {
                    var barOption = {
                        title: {},
                        tooltip: {
                            trigger: 'axis'
                        },
                        legend: {
                            orient: 'horizontal',
                            data: legendDatas
                        },
                        grid: {
                            left: '3%',
                            right: '4%',
                            bottom: '3%',
                            containLabel: true
                        },
                        xAxis: {
                            type: 'category',
                            boundaryGap: true,
                            data: axisDatas
                        },
                        yAxis: {
                            type: 'value'
                        },
                        series: data.data
                    };
                    monthCardPayBarGroup.setOption(barOption);

                    $uibModalInstance.dismiss('cancel');
                } else {
                    msg(data.message);
                }
            });
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };

    });


    /**
     * 停车场车 月卡缴费 车场选择
     */
    app.controller('monthCardPayParklotContrastCtl', function ($scope, $rootScope, $http, $uibModalInstance, $uibModal, $filter, fac, dashboardService, param) {
        $scope.search = {};
        $scope.parklots1 = [];
        $scope.parklots2 = [];
        $scope.parklots3 = [];
        $scope.parklots4 = [];

        $scope.selectedParklot1 = {};

        var monthCardPayBarGroup = param.monthCardPayBarGroup;

        var searchParklots = [];

        /**
         * 城市
         */
        $scope.cities = [["武汉", "武汉"]];

        /**
         * 监听选中的车场
         * @param parklotModel
         */
        var watchSelectedParklot = function (parklotModel) {
            $scope.$watch(parklotModel, function (n) {
                if (n) {
                    if (('parklotId' in n) && ('parklotName' in n)) {
                        if (!searchParklots.hasOwnProperty(n.parklotId)) {
                            searchParklots[n.parklotId] = n.parklotName;
                        }
                    }
                }
            });
        };

        watchSelectedParklot("selectedParklot1");
        watchSelectedParklot("selectedParklot2");
        watchSelectedParklot("selectedParklot3");
        watchSelectedParklot("selectedParklot4");

        /**
         * 根据城市查询车场信息
         *
         * @param parkId
         */
        var getParklots = function (city, index) {
            $http.post("/ovu-pcos/pcos/parklot/park/getParklots.do", {city: city}, fac.postConfig).success(function (data, status, headers, config) {
                if (data.code === 0) {
                    var parklots = [];
                    var datas = data.data;
                    datas.forEach(function (e) {
                        var parklot = {};
                        parklot.parklotId = e.parklotId;
                        parklot.parklotName = e.parklotName;
                        parklots.push(parklot);
                    });

                    switch (index) {
                        case 1:
                            $scope.parklots1 = parklots;
                            break;
                        case 2:
                            $scope.parklots2 = parklots;
                            break;
                        case 3:
                            $scope.parklots3 = parklots;
                            break;
                        case 4:
                            $scope.parklots4 = parklots;
                            break;
                    }

                } else {
                    msg(data.message);
                }
            });
        };


        /**
         * 选择城市事件
         */
        $scope.selectCity = function (city, index) {
            getParklots(city, index);
        };


        /**
         * 筛选查询
         */
        $scope.doSearch = function (search) {
            if (!$scope.selectedParklot1.parklotId) {
                alert("至少选择一个车场");
                return;
            }
            if (!$scope.search.startTime || !$scope.search.endTime) {
                alert("统计周期必填");
                return;
            }
            var param = {
                parklotId: '',
                parklotName: '',
                startTime: search.startTime,
                endTime: search.endTime
            };
            //用例 选择的车场
            var legendDatas = [];
            var parklotIdsArr = [];
            for (var index in searchParklots) {
                legendDatas.push(searchParklots[index]);
                parklotIdsArr.push(index);
            }
            param.parklotId = parklotIdsArr.join();
            param.parklotName = legendDatas.join();

            //横轴 天数
            var axisDatas = dashboardService.getAxisDatasWithYear(search.startTime, search.endTime);

            $http.post("/ovu-pcos/pcos/parklot/dashboard/getMonthCardPayParklotContrast.do", param, fac.postConfig).success(function (data, status, headers, config) {
                if (data.code === 0) {
                    var barOption = {
                        title: {},
                        tooltip: {
                            trigger: 'axis'
                        },
                        legend: {
                            orient: 'horizontal',
                            data: legendDatas
                        },
                        grid: {
                            left: '3%',
                            right: '4%',
                            bottom: '3%',
                            containLabel: true
                        },
                        xAxis: {
                            type: 'category',
                            boundaryGap: true,
                            data: axisDatas
                        },
                        yAxis: {
                            type: 'value'
                        },
                        series: data.data
                    };
                    monthCardPayBarGroup.setOption(barOption);

                    $uibModalInstance.dismiss('cancel');
                } else {
                    msg(data.message);
                }
            });
        };

        /**
         * 取消
         */
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };

    });


    /**
     * service
     */
    app.service('dashboardService', function () {
        /**
         * 获得横轴数据 MM-dd
         * @param startDay
         * @param endDay
         */
        this.getAxisDatas = function (startDay, endDay) {
            var axisDatas = [];

            function getDate(datestr) {
                return new Date(Date.parse(datestr.replace(/-/g, "/")));
            }

            function getDateStr(date) {
                const month = date.getMonth() + 1;
                const day = date.getDate();
                return [month, day].map(function (n) {
                    n = n.toString();
                    return n[1] ? n : '0' + n;
                }).join('-');
            }

            var startTime = getDate('2018-' + startDay);
            var endTime = getDate('2018-' + endDay);
            while ((endTime.getTime() - startTime.getTime()) >= 0) {
                axisDatas.push(getDateStr(startTime));
                startTime.setDate(startTime.getDate() + 1);
            }
            return axisDatas;
        }

        /**
         * 获得横轴数据 yyyy-MM-dd
         * @param startDay
         * @param endDay
         */
        this.getAxisDatasWithYear = function (startDay, endDay) {
            var axisDatas = [];

            function getDate(datestr) {
                return new Date(Date.parse(datestr.replace(/-/g, "/")));
            }

            function getDateStr(date) {
                const year = date.getFullYear();
                const month = date.getMonth() + 1;
                const day = date.getDate();
                return [year, month, day].map(function (n) {
                    n = n.toString();
                    return n[1] ? n : '0' + n;
                }).join('-');
            }

            var startTime = getDate(startDay);
            var endTime = getDate(endDay);
            while ((endTime.getTime() - startTime.getTime()) >= 0) {
                axisDatas.push(getDateStr(startTime));
                startTime.setDate(startTime.getDate() + 1);
            }
            return axisDatas;
        }


    });
})()
