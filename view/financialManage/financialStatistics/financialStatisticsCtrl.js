(function () {
    var app = angular.module("angularApp");
    app.controller('financialStatisticsCtrl', function ($scope, $rootScope, $http, $filter, $uibModal, fac) {
        document.title = "OVU-财务统计";
        $scope.current = 1;
        $scope.currentType1 = "day";
        $scope.currentType2 = "day";
        // angular.extend($rootScope, fac.dicts);
        $scope.search = {
            month: '',
            parkId: ''
        };
        
        $scope.pageModel = {};
        $scope.pageModel2 = {};

        // 页面初始化
        app.modulePromiss.then(function () {
            $scope.$watch('dept.id', function (deptId, oldValue) {
                if (deptId) {
                    if ($scope.dept.parkId){

                        $scope.search.parkId = $scope.dept.parkId
                        $scope.init();

                    } else {
                        $scope.search.parkId && delete $scope.search.parkId
                        alert("请选择项目关联的部门")
                        // $scope.init();
                        $scope.pageModel = {};
                        $scope.pageModel2 = {};
                        $scope.option.xAxis.data = []
                        $scope.option.series[0].data = []
                        return
                    }

                }
            })
        })


        $scope.setDateCycleSelf = function (type) {
            if (!$scope.dept.parkId) {
                alert("请选择项目关联的部门")
                return
            }
            var params = {
                parkId: $scope.search.parkId
            }
            $("#monthElecReport").val('')
            $scope.currentType1 = type;
            if (type == 'day') {
                $http.get("/ovu-park/backstage/paymentbill/statistics/todayStat",{params:params}).success((resp) => {
                    $scope.pageModel = resp.data
                    $scope.option.xAxis.data = $scope.pageModel.dimension.map(e => e + '时')
                    $scope.option.series[0].data = $scope.pageModel.yOwnDimension
                    console.log('resp', resp)
                })
            } else if (type == "week") {
                $http.get("/ovu-park/backstage/paymentbill/statistics/curWeekStat",{params:params}).success((resp) => {
                    $scope.pageModel = resp.data
                    $scope.option.xAxis.data = $scope.pageModel.dimension
                    $scope.option.series[0].data = $scope.pageModel.yOwnDimension
                    console.log('resp', resp)
                })
            } else {
                $http.get("/ovu-park/backstage/paymentbill/statistics/curMonthStat",{params:params}).success((resp) => {
                    $scope.pageModel = resp.data
                    $scope.option.xAxis.data = $scope.pageModel.dimension
                    $scope.option.series[0].data = $scope.pageModel.yOwnDimension
                    console.log('resp', resp)
                })
            }
        }


        $scope.setDateCycleThird = function (type) {
            if (!$scope.dept.parkId) {
                alert("请选择项目关联的部门")
                return
            }

            var params = {
                parkId: $scope.search.parkId
            }

            $("#monthElecReport2").val('')
            $scope.currentType2 = type;
            if (type == 'day') {
                $http.get("/ovu-park/backstage/paymentbill/statistics/todayStat",{params:params}).success((resp) => {
                    $scope.pageModel2 = resp.data
                    $scope.option2.xAxis.data = $scope.pageModel2.dimension.map(e => e + '时')
                    $scope.option2.series[0].data = $scope.pageModel2.yThirdDimension
                    console.log('resp', resp)
                })
            } else if (type == "week") {
                $http.get("/ovu-park/backstage/paymentbill/statistics/curWeekStat",{params:params}).success((resp) => {
                    $scope.pageModel2 = resp.data
                    $scope.option2.xAxis.data = $scope.pageModel2.dimension
                    $scope.option2.series[0].data = $scope.pageModel2.yThirdDimension
                    console.log('resp', resp)
                })
            } else {
                $http.get("/ovu-park/backstage/paymentbill/statistics/curMonthStat",{params:params}).success((resp) => {
                    $scope.pageModel2 = resp.data
                    $scope.option2.xAxis.data = $scope.pageModel2.dimension
                    $scope.option2.series[0].data = $scope.pageModel2.yThirdDimension
                    console.log('resp', resp)
                })
            }
        }

        $scope.findMonth = function (type) {
            if (!$scope.dept.parkId) {
                alert("请选择项目关联的部门")
                return
            }

            if (type == 'self') {
                if (!$("#monthElecReport").val()) {
                    alert('请选择时间')
                    return
                }
                var params = {
                    month: $("#monthElecReport").val(),
                    parkId: $scope.search.parkId
                }
                $http.get("/ovu-park/backstage/paymentbill/statistics/findMonthStat", {
                    params: params
                }).success((resp) => {
                    $scope.pageModel = resp.data
                    $scope.option.xAxis.data = $scope.pageModel.dimension
                    $scope.option.series[0].data = $scope.pageModel.yOwnDimension
                    // console.log('resp', resp)
                })
            } else {
                if (!$("#monthElecReport2").val()) {
                    alert('请选择时间')
                    return
                }
                var params = {
                    month: $("#monthElecReport2").val(),
                    parkId: $scope.search.parkId
                }
                $http.get("/ovu-park/backstage/paymentbill/statistics/findMonthStat", {
                    params: params
                }).success((resp) => {
                    $scope.pageModel2 = resp.data
                    $scope.option2.xAxis.data = $scope.pageModel2.dimension
                    $scope.option2.series[0].data = $scope.pageModel2.yThirdDimension
                    // console.log('resp', resp)
                })
            }

        }
        $scope.option = {
            tooltip: {
                trigger: 'axis'
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                // data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                data: [],
                axisLabel: {
                    inside: false,
                    textStyle: {}
                },
                axisTick: {
                    show: false
                },
                axisLine: {
                    show: false
                },
                // z: 10,

            },
            yAxis: {
                type: 'value',
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
            // dataZoom: [{
            //     type: 'inside'
            // }],
            label: {
                show: true,
                // 标签的文字。
                // formatter: 'This is a normal label.'
            },
            series: [{
                name: '订单数量',
                // data: [820, 932, 901, 934, 1290, null, null],
                data: [],
                type: 'line',
                smooth: true,
                areaStyle: {}
            }, ],

        };

        $scope.option2 = {
            tooltip: {
                trigger: 'axis'
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                // data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                data: [],
                axisLabel: {
                    inside: false,
                    textStyle: {}
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
                type: 'value',
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
            // dataZoom: [{
            //     type: 'inside'
            // }],
            label: {
                show: true,
                // 标签的文字。
                // formatter: 'This is a normal label.'
            },
            series: [{
                name: '订单数量',
                // data: [820, 932, 901, 934, 1290, 1330, 1320],
                data: [],
                type: 'line',
                smooth: true,
                areaStyle: {}
            }, ]
        };

        $scope.init = function () {
            $scope.setDateCycleSelf('day')
            $scope.setDateCycleThird('day')
        }
        $scope.init()

    });
})()
