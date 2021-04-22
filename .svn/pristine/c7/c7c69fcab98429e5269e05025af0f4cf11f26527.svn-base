// 单项目电梯概览
(function (angular, doc) {
    doc.title = "项目运营中心";
    // angular.module('myApp.singleProject', ['ui.bootstrap', 'customCharts'])
    angular.module('angularApp')

        .controller('singleProjectOverviewController', ['$scope', '$rootScope', '$http', '$location', '$uibModal', function ($scope, $rootScope, $http, $location, $uibModal) {

            // tree-view 配置  不要显示编辑 icon
            $scope.config = {edit: false, sort: false};
            // tree-view 点击选择
            $scope.selectNode = function (node) {
                if ($scope.curNode != node) {
                    $scope.curNode && $scope.curNode.state && ($scope.curNode.state.selected = false);
                }
                node.state = node.state || {};
                node.state.selected = !node.state.selected;
                if (node.state.selected) {
                    $scope.curNode = node;
                    // $scope.find();
                    // 如果需要点击跳转 在这里写代码
                } else {
                    delete $scope.curNode;
                }
            };

            // 项目空间
            $http({
                method: 'GET',
                url: '/ovu-pcos/pcos/liftreport/center/single/project/space.do',
                params: {
                    'projectId': $scope.projectId
                }
            })

                .success(function (resp) {
                    var data = resp || [];
                    // 后台返回的数据排序 一期 二期 四期 三期....
                    // 这里只管到二十期，超过二十期就不能用了
                    var datamap = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二', '十三', '十四', '十五', '十六', '十七', '十八', '十九', '二十'];
                    data.forEach(function (v, i) {
                        datamap.some(function (innerV, inneri) {
                            if (v.text.startsWith(innerV)) {
                                v.index = inneri;
                                return true;
                            }
                        });
                    });
                    data.sort(function (a, b) {
                        return a.index - b.index;
                    });

                    $scope.treeData = data;
                });

            // 待办事项
            $http({
                method: 'GET',
                url: '/ovu-pcos/pcos/liftreport/center/single/project/todo.do',
                params: {
                    'projectId': $scope.projectId
                }
            })

                .success(function (resp) {
                    $scope.allData = resp;
                    $scope.todoArr = [];
                    for (var i = 0; i < resp.length; i++) {
                        if (resp.length == 0) {
                            $scope.todoArr = [];
                        }
                        $scope.todoArr.push(resp[i]);
                        if (i == 1) {
                            break;
                        }
                    }
                    $scope.todoList = $scope.todoArr;
                });
            $scope.isMore = true;
            $scope.seeMore = function () {
                $scope.isMore = false;
                $scope.todoList = $scope.allData;
            }
            $scope.stopMore = function () {
                $scope.isMore = true;
                $scope.todoList = $scope.todoArr;
            }
            // 地图
            $http({
                method: 'GET',
                url: '/ovu-pcos/pcos/liftreport/center/single/map.do',
                params: {
                    'projectId': $scope.projectId
                }
            })

                .success(function (resp) {
                    setMapBounds(resp.liftlist);
                    var markers = [];
                    resp.liftlist.forEach(function (da) {
                        if (da.longitude && da.latitude) {
                            var marker = addMarkers(da, 1);
                            ;
                            markers.push(marker);
                        }
                    })
                    resp.personList.forEach(function (da) {
                        if (da.longitude && da.latitude) {
                            var marker = addMarkers(da, 6);
                            ;
                            markers.push(marker);
                        }
                    })
                    $scope.markers = markers;
                });

            // 电梯故障数据
            $http({
                method: 'GET',
                url: '/ovu-pcos/pcos/liftreport/center/single/lift/faulttop.do',
                params: {
                    'projectId': $scope.projectId
                }
            })
                .success(function (resp) {
                    $scope.items = resp;
                });


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
                $scope.myInfoWindow.open($scope.map, marker.getPosition());
            }

            $scope.clickMarker = function ($event, $params, marker) {
                /*window.location.hash = '#/elevator-' + marker.getExtData().liftId;*/
                $scope.enterSingleElevator(marker.getExtData().liftId);
            }


            // 设置地图范显示围  根据所有的点 求出需要显示的范围  如果list为空 显示武汉市
            function setMapBounds(list) {
                if (!list || !list.length) {
                    $scope.map.setCity('武汉市');
                } else {
                    var bounds = getBoundsByListData(list);
                    // console.log(bounds);
                    $scope.map.setBounds(bounds);
                }
            }

            // 根据list [{longitude:00.000000,latitude:00.000000,...},...] 数据获取地图显示范围
            function getBoundsByListData(list) {
                var lngArr = [],
                    latArr = [];

                list.forEach(function (v, i) {
                    if (v.longitude && v.latitude) {
                        lngArr.push(parseFloat(v.longitude));
                        latArr.push(parseFloat(v.latitude));
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

            //打点    加参数index区分电梯和人员的标记（Zn）
            function addMarkers(data, index) {
                var marker = new AMap.Marker({
                    position: [data.longitude, data.latitude],
                    icon: '/res/img/mark_bs/' + index + '.png',
                    map: $scope.map,
                    extData: data
                });
                return marker;
            }

            // 返回多项目
            $scope.goBack = function () {
                $scope.$emit('gobackToMulti', 1);
            };

        }])

        .controller('schartsController', ['$scope', '$http', '$window', 'singleMainService', function ($scope, $http, $window, singleMainService) {
            $scope.selectTime = function (time) {
                $http({
                    method: 'GET',
                    url: '/ovu-pcos/pcos/liftreport/center/single/workunit.do',
                    params: {
                        'projectId': $scope.projectId,
                        'timeDim': time
                    }
                })
                    .success(function (resp) {
                        var pie1Legend = [],
                            pie1Data = [],
                            pie2Legend = [],
                            pie2Data = [],
                            total1 = 0,
                            total2 = 0;
                        resp.typeList.forEach(function (v, i) {
                            pie1Legend.push(v.name);
                            pie1Data.push(parseInt(v.value));
                            total1 += parseInt(v.value);
                        });
                        resp.emergencyList.forEach(function (v, i) {
                            pie2Legend.push(v.name);
                            pie2Data.push(parseInt(v.value));
                            total2 += parseInt(v.value);
                        });


                        $scope.pieOption1 = singleMainService.getPieOptionByData({
                            titleText: '工单类型统计',
                            titleSubtext: '工单总数：' + total1,
                            labelData: pie1Legend,
                            data: pie1Data,
                           
                        });

                        $scope.pieOption2 = singleMainService.getPieOptionByData({
                            titleText: '故障工单来源统计',
                            titleSubtext: '故障工单总数：' + total2,
                            labelData: pie2Legend,
                            data: pie2Data
                        });

                    });
            }
            //window resize 事件 重新渲染
            angular.element($window).on('resize', function () {
                $scope.$broadcast("onWindowResize");
            });

            $scope.selectTime('year');

        }])

        //人员列表控制器
        .controller('PersonCtrl', function ($scope, $http, $uibModal, fac) {
            //人员统计
            $scope.pageModel = {};
            $scope.search = {projectId: $scope.projectId, signInTime: moment().format('YYYY-MM-DD')};
            //查询巡查点列表
            $scope.find = function (pageNo) {
                $.extend($scope.search, {
                    currentPage: pageNo || $scope.pageModel.currentPage || 1,
                    pageSize: $scope.pageModel.pageSize || 10
                });
                $scope.search.pageIndex = $scope.search.currentPage - 1;
                fac.getPageResult("/ovu-pcos/pcos/liftreport/center/single/person/signin.do", $scope.search, function (data) {
                    $scope.pageModel = data;
                });
            };
            $scope.find();

            //查看详情
            $scope.showDetailModal = function (item) {
                var param = {id: item.id, signInTime: $scope.search.signInTime};
                var modal = $uibModal.open({
                    animation: false,
                    size: 'lg',
                    templateUrl: '/view/liftReport/projectOperationCenter/modal.person.detail.html',
                    controller: 'PersonDetailCtrl',
                    resolve: {
                        param: param
                    }
                });
                modal.result.then(function () {
                }, function () {
                });
            }
            $scope.limitNum = 5;
            //获取人员列表
            $http.get("/ovu-pcos/pcos/liftreport/center/single/person/list.do?projectId=" + $scope.projectId).success(function (data) {
                $scope.userList = data;
                $scope.userList.department.forEach(function (v) {
                    v.isExpand=false;
                });
            });
            $scope.selectDepartment=function (item) {
                item.isExpand=!item.isExpand;
            }
            $scope.switchShowAll = function () {
                if ($scope.limitNum == 5) {
                    $scope.limitNum = '';
                } else {
                    $scope.limitNum = 5;
                }
            }

        })

        //维保记录详情弹出框
        .controller('PersonDetailCtrl', function ($scope, $uibModalInstance, $http, param) {
            //获取
            $http.get("/ovu-pcos/pcos/liftreport/center/single/person/signin/detail.do?id=" + param.id + "&signInTime=" + param.signInTime).success(function (data) {
                $scope.signinList = data;
            });
            $scope.cancel = function () {
                $uibModalInstance.dismiss('cancel');
            }
        })

        //维保记录
        .controller('WorkIndex0Ctrl', function ($scope, $uibModal, fac) {
            //人员统计
            $scope.pageModel = {};
            $scope.search = {projectId: $scope.projectId};
            //查询巡查点列表
            $scope.find = function (pageNo) {
                $.extend($scope.search, {
                    currentPage: pageNo || $scope.pageModel.currentPage || 1,
                    pageSize: $scope.pageModel.pageSize || 10
                });
                $scope.search.pageIndex = $scope.search.currentPage - 1;
                fac.getPageResult("/ovu-pcos/pcos/liftreport/center/single/workunit/plan.do", $scope.search, function (data) {
                    $scope.pageModel = data;
                });
            };
            //查看详情
            $scope.showDetail = function (item) {
                var modal = $uibModal.open({
                    animation: false,
                    size: 'lg',
                    templateUrl: '/view/liftReport/projectOperationCenter/modal.plan.detail.html',
                    controller: 'PlanDetailCtrl',
                    resolve: {
                        param: item
                    }
                });
                modal.result.then(function () {
                }, function () {
                });
            }

            $scope.find();

        })

        //维保记录详情弹出框
        .controller('PlanDetailCtrl', function ($scope, $uibModalInstance, $http, param) {
            //获取
            $http.get("/ovu-pcos/pcos/liftreport/center/single/workunit/detail.do?type=1&id=" + param.id).success(function (data) {
                $scope.elevator = data;
                data.stepList && data.stepList.forEach(function(v){
                    if(v.photos){
                        v.photos = v.photos.split(",") || [];
                    }
                 })
                
            });
            $scope.cancel = function () {
                $uibModalInstance.dismiss('cancel');
            }
        })
        //应急记录详情弹出框
        .controller('EmergencyDetailCtrl', function ($scope, $uibModalInstance, $http, param) {
            //获取
            $http.get("/ovu-pcos/pcos/liftreport/center/single/workunit/detail.do?type=2&id=" + param.id).success(function (data) {
                $scope.data = data;
                $scope.data.photo= data.photo.split(",") || []
                
            });
            $scope.cancel = function () {
                $uibModalInstance.dismiss('cancel');
            }
        })

        //应急记录
        .controller('WorkIndex1Ctrl', function ($scope, $uibModal, fac) {
            //人员统计
            $scope.pageModel = {};
            $scope.search = {projectId: $scope.projectId};
            //查询巡查点列表
            $scope.find = function (pageNo) {
                $.extend($scope.search, {
                    currentPage: pageNo || $scope.pageModel.currentPage || 1,
                    pageSize: $scope.pageModel.pageSize || 10
                });
                $scope.search.pageIndex = $scope.search.currentPage - 1;
                fac.getPageResult("/ovu-pcos/pcos/liftreport/center/single/workunit/emergency.do", $scope.search, function (data) {
                    $scope.pageModel = data;
                });
            };
            //查看详情
            $scope.showDetail = function (item) {
                var modal = $uibModal.open({
                    animation: false,
                    size: 'lg',
                    templateUrl: '/view/liftReport/projectOperationCenter/modal.emergencylist.detail.html',
                    controller: 'EmergencyDetailCtrl',
                    resolve: {
                        param: item
                    }
                });
                modal.result.then(function () {
                }, function () {
                });
            }

            $scope.find();

        })

        // echarts 图表 服务
        .factory('singleMainService', function () {
            return {
                initStackBar: function () {
                    //默认数据
                    return {
                        title: {
                            text: '各项目工单类型分布及电梯数量',
                        },
                        tooltip: {
                            trigger: 'axis',
                            axisPointer: { // 坐标轴指示器，坐标轴触发有效
                                type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
                            }
                        },
                        legend: {
                            orient: 'vertical',
                            right: '1%',
                            top: '3%',
                            data: ['应急工单', '维保工单', '电梯数量']
                        },
                        grid: {
                            left: '3%',
                            right: '20%',
                            bottom: '3%',
                            containLabel: true
                        },
                        yAxis: {
                            type: 'value',
                            scale: true,
                            name: '数值',
                            max: 200,
                            min: 0,
                            boundaryGap: [0.2, 0.2],
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
                            },
                        },
                        series: [{
                            name: '维保工单',
                            type: 'bar',
                            stack: '总量',
                            barWidth: 30,
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
                            barWidth: 30,
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
                },
                getStackBarOptionByData: function (option) {
                    // 初始化
                    var stackOpton = this.initStackBar();
                    // 配置传进来的数据
                    stackOpton.title.text = option.titleText;
                    stackOpton.yAxis.max = option.maxY;
                    stackOpton.xAxis.data = option.labelData;

                    option.series.forEach(function (v, i) {
                        stackOpton.series[i].type = v.type;
                        stackOpton.series[i].data = v.data;
                        stackOpton.series[i].name = v.legend;
                    });

                    stackOpton.legend.data = stackOpton.series.map(function (v) {
                        return v.name;
                    });
                    return stackOpton;
                },
                initProgressBar: function () {
                    //默认数据
                    var completedRateData = [50, 70, 40, 80, 60, 75, 60].reverse();
                    var totalRate = 50;
                    var optionData = completedRateData.map(function (v, i) {
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
                    return {
                        title: {
                            text: '各项目工单完成率统计',
                            subtext: '工单总完成率：' + totalRate + '%',
                            subtextStyle: {
                                color: '#78A8D8',
                                fontSize: 20,
                                fontWeight: 'bold'
                            }
                        },
                        tooltip: {
                            trigger: 'axis',
                            axisPointer: { // 坐标轴指示器，坐标轴触发有效
                                type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
                            },
                            formatter: '{b1}<br />{c1}%'
                        },
                        grid: {
                            left: '3%',
                            right: '15%',
                            bottom: '3%',
                            containLabel: true
                        },
                        yAxis: {
                            data: ['丽岛2046', '创意天地', '软件园', '金融港', '项目A', '项目B', '项目C'].reverse(),
                            axisTick: {
                                show: false
                            },
                            axisLabel: {
                                // formatter: 'barGap: \'-100%\''
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
                                    barBorderRadius: 15,
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
                                        fontSize: 20,
                                        fontWeight: 'bold'
                                    },
                                    formatter: function (params) {
                                        return completedRateData[params.dataIndex] + '%';
                                    }
                                }
                            },
                            data: [100, 100, 100, 100, 100, 100, 100]
                        }, {
                            type: 'bar',
                            barWidth: 15,
                            z: 10,
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
                    };
                },
                getProgressBarOptionByData: function (optionData) {
                    var progressOption = this.initProgressBar();
                    // 配置传进来的数据
                    progressOption.title.text = optionData.titleText;
                    progressOption.title.subtext = optionData.titleSubtext;
                    // echarts 默认 从下往上排列 逆序一下
                    progressOption.yAxis.data = optionData.labelData.reverse();
                    // 配置隔行换色
                    var optionData = optionData.data.map(function (v, i) {
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
                    // 同样需要逆序
                    optionData.reverse();
                    progressOption.series[1].data = optionData;

                    // 设置 背景条样式
                    optionData.forEach(function (v, i) {
                        progressOption.series[0].data[i] = 100;
                    });
                    progressOption.series[0].label.normal.formatter = function (params) {
                        return optionData[params.dataIndex].value + '%';
                    }
                    return progressOption;
                },
                initPie: function () {
                    //默认数据
                    var total = 999;
                    return {
                        title: {
                            text: '工单类型统计',
                            subtext: '工单总数：' + total,
                            x: 'center',
                            bottom:15
                        },
                        tooltip: {
                            trigger: 'item',
                            formatter: "{a} <br/>{b} : {c} ({d}%)"
                        },
                        legend: {
                            orient: 'horizontal',
                            left: 'center',
                            top: 15,
                            data: []
                        },
                        series: [{
                            name: '工单来源',
                            type: 'pie',
                            radius: '55%',
                            center: ['50%', '50%'],
                            label: {
                                normal: {
                                    show: true,
                                    position: 'inner',
                                    formatter: '{d}%'
                                }
                            },
                            data: [],
                            itemStyle: {
                                emphasis: {
                                    shadowBlur: 10,
                                    shadowOffsetX: 0,
                                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                                }
                            }
                        }]
                    };
                },
                getPieOptionByData: function (optionData) {
                    var pieOption = this.initPie();
                    // 配置传进来的数据
                    pieOption.title.text = optionData.titleText;
                    pieOption.title.subtext = optionData.titleSubtext;

                    optionData.data.forEach(function (v, i) {
                        var obj = {};
                        pieOption.series[0].data[i] = obj;
                        obj.value = v;
                        obj.name = optionData.labelData[i];
                    });
                    pieOption.legend.data = pieOption.series[0].data.map(function (v) {
                        return v.name;
                    });
                    return pieOption;
                }

            }
        })

        .filter("normalFilter", function () {
            return function (val) {
                return val == 1 ? '正常' : '异常';
            }
        });

})(angular, document);
