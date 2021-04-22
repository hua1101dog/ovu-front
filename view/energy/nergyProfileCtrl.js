//  能耗概况
(function () {
    "use strict";
    var app = angular.module("angularApp");

    app.controller('nergyProfileCtrl', function ($scope, $rootScope, $http, $filter, $uibModal, fac) {
        document.title = "能耗概况";
        $scope.search = {};
        $scope.search.pointType = 1;
        $scope.search.time = 'day';
        $scope.search.pointName = '';
        app.modulePromiss.then(function () {
            $scope.init();
            // $scope.$watch('dept.id', function (deptId, oldValue) {
            //     if (deptId) {
            //         if ($scope.dept.parkId) {
            //             $scope.search.parkId = $scope.dept.parkId;
            //             $scope.init();
            //         } else {
            //             alert('请选择跟项目关联的部门');
            //             return
            //         }

            //     }
            // })

        })
        $scope.init = function () {
            $http.get('/ovu-energy/energy/classify/list').success(function (res) {
                if (res.code == 0) {
                    $scope.classifyList = res.data;
                    $scope.classifyList.forEach(function (v) {
                        if (v.type == $scope.search.pointType) {
                            $scope.search.pointName = v.name;
                            $scope.search.unitName = v.unitName
                        }
                    })
                    $scope.find();
                } else {
                    alert(res.msg);
                }
            })

        }
        //选择分类
        $scope.checkTypes = function (item) {
            $scope.search.pointType = item.type;
            $scope.search.classifyId = item.classifyId;
            $scope.search.pointName = item.name;
            $scope.search.unitName = item.unitName
            $scope.init()
        }

        //能源概况
        $scope.find = function () {
            // if(!$rootScope.dept ||!$rootScope.dept.id){
            //     alert("请选择部门！");
            //     return false;
            // }
            $http.post("/ovu-energy/energy/energystat/basicinfo/energybasicinfo", {
                pointType: $scope.search.pointType,
                parkId: $scope.search.parkId
            }, fac.postConfig).success(function (resp) {
                // 地图显示
                // 设置地图显示范围
                if (resp.code == 0) {
                    if (resp.data.parkEnergyBasic) {
                        resp.data.parkEnergyBasic.forEach(function (v) {

                            var arr = v.trPosition.split(',');
                            v.trPosition = arr[1];
                            v.blPosition = arr[0];

                        })
                        // setMapBounds(resp.data.parkEnergyBasic);
                        var markers = [];
                        resp.data.parkEnergyBasic.forEach(function (da) {
                            if (da.blPosition && da.trPosition) {
                                var marker = addMarkers(da);
                                markers.push(marker);

                            }
                        })
                        $scope.markers = markers;

                    }
                    $scope.parkEnergyBasicTime = resp.data.parkEnergyBasicTime;
                    $scope.search.pointName = $scope.search.pointName || $scope.classifyList[0].name;
                } else {
                    alert(resp.msg);
                }
            });
            //用能平均值
            $http.post("/ovu-energy/energy/energystat/basicinfo/energybasicpercent", {
                pointType: $scope.search.pointType,
                time: $scope.search.time,
                parkId: $scope.search.parkId
            }, fac.postConfig).success(function (resp) {
                if (resp.code == 0) {
                    var data = resp.data;
                    $scope.unitAreaTop.series[0].data = resp.data.unitAreaTop && resp.data.unitAreaTop.reduce(function (ret, n) {
                        ret.push(n.topValue);
                        return ret

                    }, []);
                    $scope.unitAreaTop.yAxis.data = resp.data.unitAreaTop && resp.data.unitAreaTop.reduce(function (ret, n) {
                        ret.push(n.parkName);
                        return ret

                    }, []);
                    $scope.perCapitaTop.series[0].data = resp.data.perCapitaTop && resp.data.perCapitaTop.reduce(function (ret, n) {
                        ret.push(n.topValue);
                        return ret

                    }, []);
                    $scope.perCapitaTop.yAxis.data = resp.data.perCapitaTop && resp.data.perCapitaTop.reduce(function (ret, n) {
                        ret.push(n.parkName);
                        return ret

                    }, []);

                } else {
                    alert(resp.msg);
                }
            });
        }
        //地图基本配置
        $scope.mapOptions = {
            toolbar: true,
            // map-self config
            resizeEnable: false,
            
            // ui map config
            uiMapCache: false,
            zoom: 5,
            liteStyle: true
        };

        //地图标记点事件
        $scope.mouseoverMaker = function ($event, $params, marker) {
            $scope.markerData = marker.getExtData();
            setTimeout(function () {
                initProOrder($scope.search.pointName, $scope.markerData.energyValue);
            }, 1)
            $scope.myInfoWindow.open($scope.map, marker.getPosition());

        }


        function setMapBounds(list) {
            /*
            // 设置地图范显示围  根据所有的点 求出需要显示的范围  如果list为空 显示武汉市
                if (!list || !list.length) {
                    $scope.map.setCity('武汉市');
                } else {
                    var bounds = getBoundsByListData(list);
                    $scope.map.setBounds(bounds);
                }
                */
            var bounds = getBoundsByListData(list);
            $scope.map.setBounds(bounds);
        }
        // 根据list [{blPosition:00.000000,trPosition:00.000000,...},...] 数据获取地图显示范围
        function getBoundsByListData(list) {
            var lngArr = [],
                latArr = [];
            list.forEach(function (v, i) {
                if (v.blPosition && v.trPosition) {
                    lngArr.push(parseFloat(v.blPosition));
                    latArr.push(parseFloat(v.trPosition));
                }
            });

            var minLng = Math.min.apply(null, lngArr),
                maxLng = Math.max.apply(null, lngArr);

            var minLat = Math.min.apply(null, latArr),
                maxLat = Math.max.apply(null, latArr);

            var deltaLng = maxLng - minLng,
                deltaLat = maxLat - minLat;

            minLng -= 0.05 * deltaLng;
            minLat -= 0.05 * deltaLat;
            maxLng += 0.05 * deltaLng;
            maxLat += 0.05 * deltaLat;

            var southWest = new AMap.LngLat(minLng.toFixed(6), minLat.toFixed(6)),
                northEast = new AMap.LngLat(maxLng.toFixed(6), maxLat.toFixed(6));

            return new AMap.Bounds(southWest, northEast);

        }

        //打点 更换图标（Zn）
        function addMarkers(data) {

            var marker = new AMap.Marker({
                position: [data.blPosition, data.trPosition],
                map: $scope.map,
                icon: '/res/img/mark_bs/mark_bs1.png',
                extData: data
            });
            return marker;
        }
        function initProOrder(name, value) {
            document.getElementById('proOrder');
            var myChartProOrder = echarts.init(document.getElementById('proOrder'));
            var proOrderOption = {
                series: [{
                        type: "gauge",
                        center: ["50%", "50%"], // 仪表位置
                        data: [{
                            name: name,
                            value: value
                        }],
                        radius: "90%", //仪表大小
                        startAngle: 210, //开始角度
                        endAngle: -30, //结束角度
                        axisLine: {
                            show: false,
                            lineStyle: { // 属性lineStyle控制线条样式
                                color: [

                                    [0.7, new echarts.graphic.LinearGradient(0, 0, 1, 0, [{
                                        offset: 1,
                                        color: "#C7DD6B" // 70% 处的颜色
                                    }, {
                                        offset: 0.8,
                                        color: "#C7DD6B" // 66% 处的颜色
                                    }, {
                                        offset: 0,
                                        color: "#1CAD52" // 50% 处的颜色
                                    }], false)],
                                    [0.9, new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                        offset: 1,
                                        color: "#C7DD6B" // 90% 处的颜色
                                    }, {
                                        offset: 0.8,
                                        color: "#C7DD6B" // 86% 处的颜色
                                    }, {
                                        offset: 0,
                                        color: "#C7DD6B" // 70% 处的颜色
                                    }], false)],
                                    [1, new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                        offset: 0.2,
                                        color: "#CCC" // 92% 处的颜色
                                    }, {
                                        offset: 0,
                                        color: "#C7DD6B" // 90% 处的颜色
                                    }], false)]

                                ],
                                width: 10,

                            }
                        },
                        splitLine: {
                            show: false
                        },
                        axisTick: {
                            show: false
                        },
                        axisLabel: {
                            show: false
                        },
                        pointer: false,
                        detail: {
                            show: true,
                            fontSize: 14,
                            offsetCenter: [0, 5]
                        }
                    },

                ]

            }
            myChartProOrder.setOption(proOrderOption);
            // window.addEventListener('resize', function () {
            //     myChartProOrder.resize();

            // });
        }
        $scope.findTime = function () {
            $scope.find();
        }
        $scope.selectTime = function (time) {
            $scope.search.time = time;
            $scope.findTime();
        }
        //单位面积能耗排名TOP10
        $scope.unitAreaTop = {
            title: {
                text: '单位面积能耗排名TOP10',
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                }
            },

            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: {
                type: 'value',
                boundaryGap: [0, 0.01]
            },
            yAxis: {
                type: 'category',
                data: []
            },
            series: [{

                    type: 'bar',
                    data: []
                },

            ]
        }
        //人均能耗排名TOP10
        $scope.perCapitaTop = {
            title: {
                text: '人均能耗排名TOP10',
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                }
            },

            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: {
                type: 'value',
                boundaryGap: [0, 0.01]
            },
            yAxis: {
                type: 'category',
                data: []
            },
            series: [{
                    type: 'bar',
                    data: []
                },

            ]
        }
    })


})();
