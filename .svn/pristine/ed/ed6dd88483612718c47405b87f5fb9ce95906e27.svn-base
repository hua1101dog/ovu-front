(function () {

    angular
        .module("angularApp")
        .controller('PlatformMainCtrl', function ($scope, $rootScope, $timeout, fac, PlatformMainService) {
            var vm = this;
            document.title = "平台运营管理";
            //加载历史，这里判断该页面是否已经加载
            var loadHistory = {};
            //选择tab.
            vm.selectTab = function (index) {
                $timeout(function () {
                    vm.index = index;
                    !loadHistory[index] && $scope.$broadcast('init' + index, 'initMapLayer');
                    loadHistory[index] = true;
                })
                if(index=='5'){
                    $('#myCarousel').carousel({
                        interval: 3
                       });
                }
            }

            //监听地图选择区域，如果变化，则根据该值重新查询
            $rootScope.$watch('props', function (current, prev) {
                if (!angular.equals(current, prev)) {
                    $scope.$broadcast('init' + vm.index, current);
                }
            })

            //地图基本配置
            vm.baseOptions = {
                toolbar: true,
                // map-self config
                resizeEnable: false,
                scrollWheel: false,
                // ui map config
                uiMapCache: false,
                zoom: 5,
                liteStyle: true
            };


            //图表resize事件
            window.onresize = function () {
                $rootScope.$broadcast("onWindowResize");
            }
        })
        .controller('index0Ctrl', function ($scope, $rootScope, $timeout, PlatformMainService) {
            var vm = this;
            vm.index = 0;
            //地图配置
            vm.mapOptions = angular.extend($scope.$parent.vm.baseOptions);
            //地图标记点
            vm.markers = [];
            //初始化
            function init(param) {
                PlatformMainService.getOtherData(param, vm.index).then(function (data) {
                    vm.index0 = data;
                    //电梯品牌统计
                    var option = PlatformMainService.getElevatorOption();
                    var names = [];
                    data.lift.modelList && data.lift.modelList.forEach(function (mode) {
                        mode.name += '(' + mode.value + ')';
                        names.push(mode.name);
                    });
                    option.series[0].data = data.lift.modelList || [];
                    option.legend.data = names;
                    vm.index0ElevatorOption = option;
                });
                PlatformMainService.getMapData(param, vm.index).then(function (data) {
                    var markers = [];
                    data.forEach(function (da) {
                        var marker = PlatformMainService.addMarker(vm.map, da, 0);
                        markers.push(marker);
                    })
                    vm.markers = markers;
                });
            }
            //地图标记点事件
            vm.mouseoverMaker = function ($event, $params, marker) {
                vm.markerData = marker.getExtData();
                vm.myInfoWindow.open(vm.map, marker.getPosition());
            }

            $scope.$on("init0", function (event, data) {
                //是否初始化地图覆盖物
                data == 'initMapLayer' && $timeout(function () {
                    PlatformMainService.getMapDistrict(vm.map, $rootScope);
                }, 2000)
                var param = { code: data.adcode, dimension: data.level || 'country' };
                init(param);
            })

        })
        .controller('index1Ctrl', function ($scope, $rootScope, $timeout, PlatformMainService) {
            var vm = this;
            vm.index = 1;
            //地图配置
            vm.mapOptions = angular.extend($scope.$parent.vm.baseOptions);
            //地图标记点
            vm.markers = [];

            function init(param) {
                PlatformMainService.getOtherData(param, vm.index).then(function (data) {
                    vm.index1 = data;
                    //电梯品牌统计
                    var elevatorOption = PlatformMainService.getElevatorOption();
                    var names = [];
                    data.modelList.forEach(function (mode) {
                        mode.name += '(' + mode.value + ')';
                        names.push(mode.name);
                    });
                    elevatorOption.series[0].data = data.modelList || [];
                    elevatorOption.legend.data = names;
                    vm.index1ElevatorOption = elevatorOption;
                    //电梯分类
                    var classifyOption = PlatformMainService.getPileOption();
                    data.typeList.forEach(function (type) {
                        type.name += '(' + type.value + ')';
                        names.push(type.name);
                    });
                    classifyOption.series[0].data = data.typeList || [];
                    classifyOption.legend.data = names;
                    vm.index1ClassifyOption = classifyOption;
                    ///电梯分布
                    var distributionOption = PlatformMainService.getPileOption();
                    data.regionList.forEach(function (re) {
                        re.name += '(' + re.value + ')';
                        names.push(re.name);
                    });
                    distributionOption.series[0].data = data.regionList || [];
                    distributionOption.legend.data = names;
                    vm.index1DistributionOption = distributionOption;
                    //电梯品牌故障率
                    vm.index1FaultOption = PlatformMainService.getFaultOption(data.faultList, '故障率');
                });
                PlatformMainService.getMapData(param, vm.index).then(function (data) {
                    var markers = [];
                    data.forEach(function (da) {
                        var marker = PlatformMainService.addMarker(vm.map, da, 1);
                        markers.push(marker);
                    })
                    vm.markers = markers;
                });
            }

            //地图标记点事件
            vm.mouseoverMaker = function ($event, $params, marker) {
                vm.markerData = marker.getExtData();
                vm.myInfoWindow.open(vm.map, marker.getPosition());
            }

            $scope.$on("init1", function (e, data) {
                //是否初始化地图覆盖物
                data == 'initMapLayer' && $timeout(function () {
                    PlatformMainService.getMapDistrict(vm.map, $rootScope);
                })
                var param = { code: data.adcode, dimension: data.level || 'country' };
                init(param);
            })
        })
        .controller('index2Ctrl', function ($scope, $rootScope, $timeout, PlatformMainService) {
            var vm = this;
            vm.index = 2;
            //地图配置
            vm.mapOptions = angular.extend($scope.$parent.vm.baseOptions);
            //地图标记点
            vm.markers = [];
            //初始化
            function init(param) {
                PlatformMainService.getOtherData(param, vm.index).then(function (data) {
                    vm.index2 = data;
                    //服务项目
                    var serviceOption = PlatformMainService.getPileOption();
                    var names = [];
                    data.project.useList.forEach(function (use) {
                        use.name += '(' + use.value + ')';
                        names.push(use.name);
                    });
                    serviceOption.series[0].data = data.project.useList || [];
                    serviceOption.legend.data = names;
                    vm.index2ServiceOption = serviceOption;
                    //服务电梯
                    var elevatorOption = PlatformMainService.getPileOption();
                    var liftnames = [];
                    data.lift.useList.forEach(function (use) {
                        use.name += '(' + use.value + ')';
                        liftnames.push(use.name);
                    });
                    elevatorOption.series[0].data = data.lift.useList || [];
                    elevatorOption.legend.data = liftnames;
                    vm.index2ElevatorOption = elevatorOption;
                });
                PlatformMainService.getMapData(param, vm.index).then(function (data) {
                    var markers = [];
                    data.forEach(function (da) {
                        var marker = PlatformMainService.addMarker(vm.map, da, 2);
                        markers.push(marker);
                    })
                    vm.markers = markers;
                });
            }

            //地图标记点事件
            vm.mouseoverMaker = function ($event, $params, marker) {
                vm.markerData = marker.getExtData();
                vm.myInfoWindow.open(vm.map, marker.getPosition());
            }

            $scope.$on("init2", function (e, data) {
                //是否初始化地图覆盖物
                data == 'initMapLayer' && $timeout(function () {
                    PlatformMainService.getMapDistrict(vm.map, $rootScope);
                })
                var param = { code: data.adcode, dimension: data.level || 'country' };
                init(param);
            })

        })
        .controller('index3Ctrl', function ($scope, $rootScope, $timeout, PlatformMainService) {
            var vm = this;
            vm.index = 3;
            //地图配置
            vm.mapOptions = angular.extend($scope.$parent.vm.baseOptions);
            //地图标记点
            vm.markers = [];
            //初始化
            function init(param) {
                PlatformMainService.getOtherData(param, vm.index).then(function (data) {
                    vm.index3 = data;
                    //运维工程师年龄结构统计
                    var ageOption = PlatformMainService.getPileOption();
                    var names = [];
                    data.ageList.forEach(function (age) {
                        age.name += '(' + age.value + ')';
                        names.push(age.name);
                    })
                    ageOption.series[0].data = data.ageList || [];
                    ageOption.legend.data = names;
                    vm.index3AgeOption = ageOption;
                    //运维工程师签到统计
                    var signOption = PlatformMainService.getPileOption();
                    var signNames = [];
                    data.signinList.forEach(function (sign) {
                        sign.name += '(' + sign.value + ')';
                        signNames.push(sign.name);
                    })
                    signOption.series[0].data = data.signinList || [];
                    signOption.legend.data = signNames;
                    vm.index3SignOption = signOption;
                });
                PlatformMainService.getMapData(param, vm.index).then(function (data) {
                    var markers = [];
                    data.forEach(function (da) {
                        var marker = PlatformMainService.addMarker(vm.map, da, 3);
                        markers.push(marker);
                    })
                    vm.markers = markers;
                });
            }

            //地图标记点事件
            vm.mouseoverMaker = function ($event, $params, marker) {
                vm.markerData = marker.getExtData();
                vm.myInfoWindow.open(vm.map, marker.getPosition());
            }

            $scope.$on("init3", function (e, data) {
                //是否初始化地图覆盖物
                data == 'initMapLayer' && $timeout(function () {
                    PlatformMainService.getMapDistrict(vm.map, $rootScope);
                })
                var param = { code: data.adcode, dimension: data.level || 'country' };
                init(param);
            })

        })
        .controller('index4Ctrl', function ($scope, $rootScope, $timeout, PlatformMainService) {
            var vm = this;
            vm.index = 4;
            //初始化
            function init() {
                var param = { dimension: 'country' };
                PlatformMainService.getOtherData(param, vm.index).then(function (data) {
                    vm.index4 = data;
                    //应急工单来源统计
                    var worryOption = PlatformMainService.getPileOption();
                    var names = [];
                    data.originList.forEach(function (origin) {
                        origin.name += '(' + origin.value + ')';
                        names.push(origin.name);
                    })
                    worryOption.series[0].data = data.originList || [];
                    worryOption.legend.data = names;
                    vm.index4WorryOption = worryOption;
                    //工单总完成率
                    var successOption = PlatformMainService.getFaultOption(data.finishedRateList, '完成率');
                    successOption.title.text = "各公司工单完成率对比";
                    vm.index4SuccessOption = successOption;
                    //项目工单类型分布及电梯数量
                    vm.index4WorkAndElevatorOption = PlatformMainService.getWorkAndElevatorOption(data.totalList);
                });
            }

            $scope.$on("init4", function (e, data) {
                init();
            })

        })
        .controller('index5Ctrl', function ($scope, $rootScope, $timeout, PlatformMainService, fac) {
            var vm = this;
            vm.index = 5;
            //地图配置
            vm.mapOptions = angular.extend($scope.$parent.vm.baseOptions);
            //地图标记点
            vm.markers = [];
            //初始化
            function init(param) {
                
                PlatformMainService.getOtherData(param, vm.index).then(function (data) {
                    vm.index5 = data;
                });
                /* PlatformMainService.getMapData(param,vm.index).then(function(data){
                    var markers=[];
                    data.forEach(function(da){
                        var marker =PlatformMainService.addMarker(vm.map,da,5);
                        markers.push(marker);
                    })
                    vm.markers=markers;
                }); */
            }

            //地图标记点事件
            vm.mouseoverMaker = function ($event, $params, marker) {
                vm.markerData = marker.getExtData();
                vm.myInfoWindow.open(vm.map, marker.getPosition());
            }

            vm.watchVideo = function (id) {
                $scope.deviceId = id;
                /* fac.showVideo(id);*/
            }

            $scope.$on("init5", function (e, data) {
               
                //是否初始化地图覆盖物
                data == 'initMapLayer' && $timeout(function () {
                    PlatformMainService.getMapDistrict(vm.map, $rootScope);
                    vm.show = true;
                }, 200)
                var param = { code: data.adcode, dimension: data.level || 'country' };
                init(param);

            })

        })

        /**
         * Service
         */
        .service('PlatformMainService',
            ['$http',
                function ($http) {
                    var that = this;
                    //加了index参数目的是不同tab栏地图标记用不同的icon（）
                    this.addMarker = function (map, data, index) {
                        var marker = new AMap.Marker({
                            position: [data.longitude, data.latitude],
                            map: map,
                            zIndex: 1000,
                            icon: '/res/img/mark_bs/' + index + '.png',
                            extData: data
                        });
                        return marker;
                    }

                    this.getMapDistrict = function (map, rootscope) {
                        //**地图行政区划逻辑 start//
                        //just some colors
                        var colors = [
                            "#3366cc", "#dc3912", "#ff9900", "#109618", "#990099", "#0099c6", "#dd4477", "#66aa00",
                            "#b82e2e", "#316395", "#994499", "#22aa99", "#aaaa11", "#6633cc", "#e67300", "#8b0707",
                            "#651067", "#329262", "#5574a6", "#3b3eac"
                        ];

                        AMapUI.loadUI(['geo/DistrictExplorer'], function (DistrictExplorer) {
                            //创建一个实例
                            var districtExplorer = new DistrictExplorer({
                                eventSupport: true, //打开事件支持
                                map: map,
                                preload: [100000]
                            });
                            var currentAreaNode = null;

                            //鼠标hover提示内容
                            var $tipMarkerContent = $('<div class="tipMarker top"></div>');

                            var tipMarker = new AMap.Marker({
                                content: $tipMarkerContent.get(0),
                                offset: new AMap.Pixel(0, 0),
                                bubble: true
                            });

                            //根据Hover状态设置相关样式
                            function toggleHoverFeature(feature, isHover, position) {

                                tipMarker.setMap(isHover ? map : null);

                                if (!feature) {
                                    return;
                                }

                                var props = feature.properties;

                                if (isHover) {
                                    //更新提示内容
                                    $tipMarkerContent.html(props.adcode + ': ' + props.name);
                                    //更新位置
                                    tipMarker.setPosition(position || props.center);
                                }

                                //更新相关多边形的样式
                                var polys = districtExplorer.findFeaturePolygonsByAdcode(props.adcode);
                                for (var i = 0, len = polys.length; i < len; i++) {

                                    polys[i].setOptions({
                                        fillOpacity: isHover ? 0.5 : 0.2
                                    });
                                }
                            }

                            //监听feature的hover事件
                            districtExplorer.on('featureMouseout featureMouseover', function (e, feature) {
                                toggleHoverFeature(feature, e.type === 'featureMouseover',
                                    e.originalEvent ? e.originalEvent.lnglat : null);
                            });

                            //监听鼠标在feature上滑动
                            districtExplorer.on('featureMousemove', function (e, feature) {
                                //更新提示位置
                                tipMarker.setPosition(e.originalEvent.lnglat);
                            });

                            //feature被点击
                            districtExplorer.on('featureClick', function (e, feature) {

                                var props = feature.properties;

                                //如果存在子节点
                                if (props.childrenNum > 0) {
                                    //切换聚焦区域
                                    switch2AreaNode(props.adcode);
                                    rootscope.props = props;
                                }
                            });

                            //外部区域被点击
                            districtExplorer.on('outsideClick', function (e) {

                                districtExplorer.locatePosition(e.originalEvent.lnglat, function (error, routeFeatures) {
                                    if (routeFeatures && routeFeatures.length > 1) {
                                        //切换到省级区域
                                        switch2AreaNode(routeFeatures[1].properties.adcode);
                                        rootscope.props = routeFeatures[1].properties;
                                    } else {
                                        //切换到全国
                                        switch2AreaNode(100000);
                                        rootscope.props = {};
                                    }

                                }, {
                                        levelLimit: 1
                                    });
                            });

                            //绘制某个区域的边界
                            function renderAreaPolygons(areaNode) {

                                //更新地图视野
                                map.setBounds(areaNode.getBounds(), null, null, true);

                                //清除已有的绘制内容
                                districtExplorer.clearFeaturePolygons();

                                //绘制子区域
                                districtExplorer.renderSubFeatures(areaNode, function (feature, i) {

                                    var fillColor = colors[i % colors.length];
                                    var strokeColor = colors[colors.length - 1 - i % colors.length];

                                    return {
                                        cursor: 'default',
                                        bubble: true,
                                        strokeColor: strokeColor, //线颜色
                                        strokeOpacity: 1, //线透明度
                                        strokeWeight: 1, //线宽
                                        fillColor: fillColor, //填充色
                                        fillOpacity: 0.35, //填充透明度
                                    };
                                });

                                //绘制父区域
                                districtExplorer.renderParentFeature(areaNode, {
                                    cursor: 'default',
                                    bubble: true,
                                    strokeColor: 'black', //线颜色
                                    strokeOpacity: 1, //线透明度
                                    strokeWeight: 1, //线宽
                                    fillColor: null, //填充色
                                    fillOpacity: 0.35, //填充透明度
                                });
                            }



                            //切换区域后刷新显示内容
                            function refreshAreaNode(areaNode) {

                                districtExplorer.setHoverFeature(null);

                                renderAreaPolygons(areaNode);
                            }

                            //切换区域
                            function switch2AreaNode(adcode, callback) {

                                if (currentAreaNode && ('' + currentAreaNode.getAdcode() === '' + adcode)) {
                                    return;
                                }

                                loadAreaNode(adcode, function (error, areaNode) {

                                    if (error) {

                                        if (callback) {
                                            callback(error);
                                        }

                                        return;
                                    }

                                    currentAreaNode = window.currentAreaNode = areaNode;

                                    //设置当前使用的定位用节点
                                    districtExplorer.setAreaNodesForLocating([currentAreaNode]);

                                    refreshAreaNode(areaNode);

                                    if (callback) {
                                        callback(null, areaNode);
                                    }
                                });
                            }

                            //加载区域
                            function loadAreaNode(adcode, callback) {

                                districtExplorer.loadAreaNode(adcode, function (error, areaNode) {

                                    if (error) {

                                        if (callback) {
                                            callback(error);
                                        }

                                        console.error(error);

                                        return;
                                    }

                                    if (callback) {
                                        callback(null, areaNode);
                                    }
                                });
                            }

                            //全国
                            switch2AreaNode(100000);

                        });
                        //**地图行政区划逻辑 end//
                    }

                    //电梯品牌统计，空心扇形图都可以用
                    this.getElevatorOption = function () {
                        return angular.merge({}, {
                            tooltip: {
                                trigger: 'item',
                                formatter: "{a} <br/>{b}: {c} ({d}%)"
                            },
                            legend: {
                                data: ['日历', '格力', '互看了', '视频广告', '搜索引擎']
                            },
                            series: [
                                {
                                    name: '访问来源',
                                    type: 'pie',
                                    radius: ['50%', '70%'],
                                    center: ['50%', '55%'],
                                    avoidLabelOverlap: false,
                                    label: {
                                        normal: {
                                            show: false,
                                            position: 'center'
                                        },
                                        emphasis: {
                                            show: true,
                                            textStyle: {
                                                fontSize: '30',
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
                                        { value: 335, name: '日历' },
                                        { value: 310, name: '格力' },
                                        { value: 234, name: '互看了' },
                                        { value: 135, name: '视频广告' },
                                        { value: 1548, name: '搜索引擎' }
                                    ]
                                }
                            ]
                        });
                    }
                    //电梯分类统计，饼图通用
                    this.getPileOption = function () {
                        return angular.merge({}, {
                            tooltip: {
                                trigger: 'item',
                                formatter: "{a} <br/>{b} : {c} ({d}%)"
                            },
                            legend: {
                                data: ['直接访问', '邮件营销', '联盟广告', '视频广告', '搜索引擎']
                            },
                            series: [
                                {
                                    name: '访问来源',
                                    type: 'pie',
                                    radius: '55%',
                                    center: ['50%', '60%'],
                                    data: [
                                        { value: 335, name: '直接访问' },
                                        { value: 310, name: '邮件营销' },
                                        { value: 234, name: '联盟广告' },
                                        { value: 135, name: '视频广告' },
                                        { value: 1548, name: '搜索引擎' }
                                    ],
                                    itemStyle: {
                                        emphasis: {
                                            shadowBlur: 10,
                                            shadowOffsetX: 0,
                                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                                        }
                                    }
                                }
                            ]
                        });
                    }
                    //电梯品牌故障率统计。用于进度条类似
                    this.getFaultOption = function (data, tip) {
                        var optionData = [];
                        var yaxisData = [];
                        var otherData = [];

                        data && data.reverse() && data.forEach(function (v, i) {
                            if (v.finishedRate) {
                                v.value = v.finishedRate.replace(/%/, "");
                            }
                            var obj = {
                                value: v.value,
                                itemStyle: {
                                    normal: {
                                        color: (i % 2 === 0 ? '#E35E5E' : '#669FD8'),
                                        borderColor: (i % 2 === 0 ? '#E25555' : '#5594D4'),
                                    }
                                }
                            };
                            optionData.push(obj);
                            yaxisData.push(v.name);
                            otherData.push(100);
                        })
                        return angular.merge({}, {
                            title: {
                            },
                            tooltip: {
                                trigger: 'axis',
                                formatter: function (obj) {
                                    return obj[1].name + ':' + tip + '(' + (obj[1].value || 0) + '%)';
                                },
                                axisPointer: { // 坐标轴指示器，坐标轴触发有效
                                    type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
                                }
                            },
                            grid: {
                                left: '3%',
                                right: '15%',
                                bottom: '3%',
                                top: '5%',
                                containLabel: true
                            },
                            yAxis: {
                                data: yaxisData,
                                axisTick: {
                                    show: false
                                },
                                axisLabel: {
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
                                        formatter: function (params) {
                                            return (data[params.dataIndex].value || 0) + '%';
                                        }
                                    }
                                },
                                data: otherData
                            },
                            {
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
                                data: optionData
                            }]
                        });
                    }
                    //各项目工单类型分布及电梯数量，包含柱形图以及折线图
                    this.getWorkAndElevatorOption = function (data) {
                        var nameList = [];
                        var liftList = [];
                        var planList = [];
                        var emergencyList = [];
                        data && data.forEach(function (da) {
                            nameList.push(da.name);
                            liftList.push(da.liftTotal);
                            planList.push(da.planTotal);
                            emergencyList.push(da.emergencyTotal);
                        })
                        return angular.merge({}, {
                            tooltip: {
                                trigger: 'axis',
                                axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                                    type: 'line'        // 默认为直线，可选为：'line' | 'shadow'
                                }
                            },
                            legend: {
                                data: ['应急工单', '维保工单', '电梯数量']
                            },
                            grid: {
                                left: '3%',
                                right: '4%',
                                bottom: '3%',
                                containLabel: true
                            },
                            yAxis: {
                                type: 'value'
                            },
                            xAxis: {
                                type: 'category',
                                data: nameList
                            },
                            series: [
                                {
                                    name: '应急工单',
                                    type: 'bar',
                                    stack: '工单',
                                    label: {
                                        normal: {
                                            show: false

                                        }
                                    },
                                    data: emergencyList
                                },
                                {
                                    name: '维保工单',
                                    type: 'bar',
                                    stack: '工单',
                                    label: {
                                        normal: {
                                            show: false

                                        }
                                    },
                                    data: planList
                                },
                                {
                                    name: '电梯数量',
                                    type: 'line',
                                    data: liftList
                                }
                            ]
                        });
                    }

                    this.getOtherData = function (param, index) {
                        return $http.post('/ovu-pcos/pcos/liftreport/' + switchUrl(index) + '/other.do', param).then(function (resp) {
                            return resp.data;
                        });
                    }

                    this.getMapData = function (param, index) {
                        return $http.post("/ovu-pcos/pcos/liftreport/" + switchUrl(index) + "/map.do", param).then(function (resp) {
                            return resp.data;
                        });
                    }

                    function switchUrl(index) {
                        var url;
                        switch (index) {
                            case 0:
                                url = 'display';
                                break;
                            case 1:
                                url = 'lift';
                                break;
                            case 2:
                                url = 'project';
                                break;
                            case 3:
                                url = 'person';
                                break;
                            case 4:
                                url = 'workunit';
                                break;
                            case 5:
                                url = 'monitor';
                                break;
                        }
                        return url;
                    }

                }]);

})()
