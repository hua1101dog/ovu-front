/**
 * Created by ghostsf on 2017/9/15.
 */
(function () {
    "use strict";
    var app = angular.module("angularApp");

    //统计分析ctrl
    app.controller('statisticsCtrl', function ($scope, $state, $location, $rootScope, $http, $filter, $uibModal, fac) {
        document.title = "统计分析";

        $scope.pageModel = {};
        $scope.search = {};

        $scope.followUpState_options = [["0", "初次接洽"], ["1", "项目跟进中"], ["2", "合同谈判中"], ["3", "签订合同"], ["4", "已确定其他物业公司"]];
        $scope.propertyManagement_options = [[0, "其他"], [1, "顾问管理"], ["2", "全权委托"]];

        var month = [];
        var year = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];
        var chartDatas = {
            funnelList: [],
            annulusList: [],
            trendList: [],
            categoryDate: year
        };

        /**
         * 转化率漏斗图
         * @param funnelListLegend
         */
        function initFunnel(funnelListLegend) {
            var funnelChart = echarts.init(document.getElementById('funnel'));
            var funnelOption = {
                title: {},
                tooltip: {
                  
                },
                toolbox: {
                    feature: {
                        dataView: {readOnly: false},
                        restore: {},
                        saveAsImage: {}
                    }
                },
                legend: {
                    orient: 'vertical',
                    x: 'left',
                    data: ['初次接洽', '项目跟进中', '合同谈判中', '签订合同']
                },
                calculable: true,
                series: [
                    {
                        
                        type: 'funnel',
                        left: '10%',
                        top: 60,
                        //x2: 80,
                        bottom: 60,
                        width: '80%',
                        // height: {totalHeight} - y - y2,
                        min: 0,
                        max: 100,
                        minSize: '0%',
                        maxSize: '100%',
                        sort: 'descending',
                        gap: 2,
                        label: {
                            normal: {
                                show: true,
                                position: 'right'
                            },
                            emphasis: {
                                textStyle: {
                                    fontSize: 20
                                }
                            }
                        },
                        labelLine: {
                            normal: {
                                length: 10,
                                lineStyle: {
                                    width: 1,
                                    type: 'solid'
                                }
                            }
                        },
                        itemStyle: {
                            normal: {
                                borderColor: '#fff',
                                borderWidth: 1
                            }
                        },
                        data: chartDatas.funnelList,
                    }
                ]
            };
            funnelChart.setOption(funnelOption);
        }

        /**
         * 项目状态统计
         * @param annulusListLegend
         */
        function initAnnulus(annulusListLegend) {
            var annulusChart = echarts.init(document.getElementById('annulus'));

            var annulusOption = {
                tooltip: {
                    trigger: 'item',
                    formatter: "{a} <br/>{b}: {c} ({d}%)"
                },
                toolbox: {
                    feature: {
                        dataView: {readOnly: false},
                        restore: {},
                        saveAsImage: {}
                    }
                },
                legend: {
                    orient: 'vertical',
                    x: 'left',
                    data: annulusListLegend
                },
                series: [
                    {
                        name: '项目跟进状态',
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
                        data: chartDatas.annulusList,
                    }
                ]
            };
            annulusChart.setOption(annulusOption);
        }

        /**
         * 趋势图
         */
        function initTrend() {
            var trendChart = echarts.init(document.getElementById('trend'));

            var trendOption = {
                title: {},
                tooltip: {
                    trigger: 'axis'
                },
                legend: {
                    orient: 'horizontal',
                    data: ['初次接洽', '项目跟进中', '合同谈判中', '签订合同', '已确定其他物业公司']
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                toolbox: {},
                xAxis: {
                    type: 'category',
                    boundaryGap: false,
                    data: chartDatas.categoryDate
                },
                yAxis: {
                    type: 'value'
                },
                series: chartDatas.trendList
            };
            trendChart.setOption(trendOption);
        }

        app.modulePromiss.then(function () {
            $scope.search.checkState = 1;
            $scope.search.projectState = 1;
            $scope.find();
            $scope.getFunnel(1);
            $scope.getAnnulus(1);
            $scope.getTrend(1);
        });

        /**
         * 搜索查询
         * @param pageNo
         */
        $scope.find = function (pageNo) {
            angular.extend($scope.search, {
                currentPage: pageNo || $scope.pageModel.currentPage || 1,
                pageSize: $scope.pageModel.pageSize || 10
            });
            fac.getPageResult("/ovu-pcos/pcos/expand/expandProject/listInfo.do", $scope.search, function (data) {
                $scope.pageModel = data;
            });
        };

        $scope.getFunnel = function (flag) {
            $.post("/ovu-pcos/pcos/expand/statistics/getFunnel.do", {flag: flag}, function (res) {
                if (res) {
                    chartDatas.funnelList = res.data;
                    // var funnelListLegend = chartDatas.funnelList.map(function (n) {
                    //     n.name = n.name + ' ' + n.value;
                    //     return n;
                    // });
                    initFunnel();
                }
            }, "json");
        };

        $scope.getAnnulus = function (flag) {
            $.post("/ovu-pcos/pcos/expand/statistics/getAnnulus.do", {flag: flag}, function (res) {
                if (res) {
                    chartDatas.annulusList = res.data.filter(function (n) {
                        if (n.name !== "已确定其他物业公司") {
                            return n;
                        }
                    });
                    var annulusListLegend = chartDatas.annulusList.map(function (n) {
                        n.name = n.name + ' ' + n.value + ' ' + '个';
                        return n;
                    });
                    initAnnulus(annulusListLegend);
                }
            }, "json");
        };

        /**
         * 获取当月天数
         */
        $.post("/ovu-pcos/pcos/expand/statistics/getMonthDays.do", {}, function (res) {
            if (res) {
                month = res;
            }
        }, "json");

        /**
         * 趋势图
         * @param flag
         */
        $scope.getTrend = function (flag) {
            if (flag == 0) {
                chartDatas.categoryDate = month;
            } else if (flag == 1) {
                chartDatas.categoryDate = year;
            }
            $.post("/ovu-pcos/pcos/expand/statistics/getTrend.do", {flag: flag}, function (res) {
                if (res) {
                    chartDatas.trendList = res.data;
                    initTrend();
                }
            }, "json");
        }
    });
})();
