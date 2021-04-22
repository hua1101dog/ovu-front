/**
 * 自定义 angular组件
 */
(function () {
    'use strict';

    var app = angular.module("app");

    app.component('bigScreen', {
        transclude: true,
        templateUrl: '../showXW/page/component/bigScreen.html',
        bindings: {
            gaodeData: '<',
            indoorData: '<',
            parkNo: '<',
            type: '<'
        },
        controller: ['$scope', function ($scope) {
            var $ctrl = this;
            // console.log("gaodeData:",$ctrl.gaodeData);
            // console.log("indoorData:",$ctrl.indoorData);
            // console.log("parkNo:",$ctrl.parkNo);
            $ctrl.$onInit = function () {
                // console.log('data.......');
                // console.log($ctrl.gaodeData);
                // console.log($ctrl.indoorData);
                $ctrl.showRight = true;
            };

            $ctrl.$onChanges = function (changes) {
                if (!changes.gaodeData.isFirstChange()) {
                    $scope.$broadcast('刷新高德地图', changes.gaodeData.currentValue);
                }
                // console.log('big change');
                // console.log(changes);
            };
            $scope.$on('toFlooor', function (e, data) {
                // console.log('biglisten');
                // console.log(data);
            });

        }]
    });

    app.component('mapArea', {
        templateUrl: '../showXW/page/component/mapArea.html',
        bindings: {
            gaodeData: '<',
            parkNo: '<',
            indoorData: '<'
        },
        controller: function ($scope, $rootScope, AppService, $state) {
            var $ctrl = this;
            $ctrl.$onInit = function () {
                if (AppService.park.parkNo === "03401110001HFJR" || AppService.park.parkNo === "04201110001CYTD" || AppService.park.parkNo === "04301040001ZSRJ") {
                    // if (AppService.park.parkNo === "03401110001HFJR") {
                    $ctrl.showGaode = false;
                    $ctrl.showIndoor = true;
                    return;
                }
                $ctrl.showGaode = true;
                $ctrl.showIndoor = false;
                $ctrl.hashState = {};
            };

            $ctrl.toIndoor = function (e) {
                // 室外摄像头 显示视频 只显示创意天地的
                var fmapId = AppService.park.fmapId;
                if ($state.includes('app.facility.camera') && e.iconType == 'icon-service-sign-camera') {
                    if (fmapId == 'ovuhlw') {
                        AppService.showVideo(30); AppService.showVideo(30);
                    } else {
                        if (e.iconId == '1503380644454') { AppService.showVideo(e.iconId); }
                    }
                }
                // 配套
                e.iconMating && $state.go('app.company.mating.detail', { id: e.iconMating });

                // 活动
                // e.iconActivity
                // (function(id) {
                //     vm.url = [];
                //     $http.get("/ovu-screen-fake-fake/pcos/show/activity/info.do", { params: { id: id } }).success(function(rep) {
                //         rep.PHOTO.forEach(function(ph) {
                //             vm.url.push('/document/img/3.0/' + ph);
                //         })
                //         vm.on = true;
                //     });
                // })();

                // 运营指标 静态页 不跳转
                if ($state.includes('app.operation')) {
                    return;
                }
                // 配套 活动 服务 不跳室内地图
                if ($state.includes('app.company.mating') || $state.includes('app.company.activity') || $state.includes('app.company.service')) {
                    return;
                }
                // 只有A5 A6 体验馆 才跳转到室内地图
                if (e.iconName != "A5栋" && e.iconName != "A6栋" && e.iconName != "体验馆") {
                    return;
                }
                $ctrl.showGaode = false;
                $ctrl.showIndoor = true;
                var state = { name: e.iconName, id: e.iconId }; // 真实数据逻辑
                // var state = { name: '体验馆', id: AppService.floorNo }; // 假数据定位到体验馆
                // var state = { name: e.iconName, id: AppService.floorNo }; // 假数据定位到体验馆
                $ctrl.hashState = state;
                $scope.$emit('toFloor', state);
                // $scope.$broadcast('toFloor', state);
                $rootScope.erState = state; //给室内地图传消息
            };
            $ctrl.toGaode = function (e) {
                $ctrl.showGaode = true;
                $ctrl.showIndoor = false;
                $scope.$emit('toGaode', '返回高德界面');
            };

            $ctrl.$onChanges = function (changes) {
                // console.log(changes);
            };

        }
    });

    app.component('gaodeMap', {
        templateUrl: '../showXW/page/component/gaodeMap.html',
        bindings: {
            onIconClick: '&',
            gaodeData: '<'
        },
        require: {
            bigScreen: '^^'
        },
        controller: ['$scope', '$timeout', 'gaodeMapService', 'AppService', function ($scope, $timeout, mapService, AppService) {
            var $ctrl = this;
            // 初始化地图
            var map = new AMap.Map('map-gaode', {
                resizeEnable: true
            });

            $ctrl.$onInit = function () {
                // 获取地图数据
                // var gaodeData = $ctrl.bigScreen.gaodeData;

                var parkNo = AppService.parkNo,
                    type = $ctrl.bigScreen.type;
                var testData = {};
                if (parkNo === "04201030002GGRJY") {
                    testData = {
                        area: {
                            parkIcon: '',
                            center: [114.406236, 30.477072],
                            leftDown: {
                                lng: 114.402706,
                                lat: 30.473678
                            },
                            rightUp: {
                                lng: 114.409669,
                                lat: 30.479938
                            }
                        },
                        buildingList: [
                            //                      {
                            //                          iconID: 'd8001',
                            //                          iconName: '光谷软件园D8号',
                            //                          position: [114.404476, 30.477534],
                            //                          iconColor: '#2A60FF',
                            //                          iconType: 'icon-map-sign-water'
                            //                      }
                        ],
                        equipmentList: [
                            //                      {
                            //                          iconID: 'b8001',
                            //                          iconName: '中国建设银行',
                            //                          position: [114.408896, 30.478366],
                            //                          iconColor: '#2A60FF',
                            //                          iconType: 'icon-map-sign-water'
                            //                      }
                        ]
                    };
                    mapService.renderGaode(map, testData, $ctrl);
                } else if (parkNo === "04201030002GGJRG") {
                    testData = {
                        area: {
                            parkIcon: '',
                            center: [114.42472, 30.456139],
                            leftDown: {
                                lng: 114.420471,
                                lat: 30.453503
                            },
                            rightUp: {
                                lng: 114.429097,
                                lat: 30.459182
                            }
                        },
                        buildingList: [],
                        equipmentList: []
                    };
                    mapService.renderGaode(map, testData, $ctrl);
                } else if (parkNo === "04201030002WHYCZX") {
                    testData = {
                        area: {
                            parkIcon: '',
                            center: [114.429088, 30.418501],
                            leftDown: {
                                lng: 114.427988,
                                lat: 30.418117
                            },
                            rightUp: {
                                lng: 114.430102,
                                lat: 30.419366
                            }
                        },
                        buildingList: [],
                        equipmentList: []
                    };
                    mapService.renderGaode(map, testData, $ctrl);
                } else if (parkNo === "04201030002SWCCXJD") {
                    testData = {
                        area: {
                            parkIcon: '',
                            center: [114.47454, 30.483755],
                            leftDown: {
                                lng: 114.464964,
                                lat: 30.475809
                            },
                            rightUp: {
                                lng: 114.483825,
                                lat: 30.489595
                            }
                        },
                        buildingList: [],
                        equipmentList: []
                    };
                    mapService.renderGaode(map, testData, $ctrl);
                } else if (parkNo === "04201030002GKYYQXY") {
                    testData = {
                        area: {
                            parkIcon: '',
                            center: [114.526437, 30.489149],
                            leftDown: {
                                lng: 114.526646,
                                lat: 30.484651
                            },
                            rightUp: {
                                lng: 114.530471,
                                lat: 30.488636
                            }
                        },
                        buildingList: [],
                        equipmentList: []
                    };
                    mapService.renderGaode(map, testData, $ctrl);
                } else if (parkNo === "04201030002WLKJCQB") {
                    testData = {
                        area: {
                            parkIcon: '',
                            center: [114.54019, 30.491717],
                            leftDown: {
                                lng: 114.536595,
                                lat: 30.487428
                            },
                            rightUp: {
                                lng: 114.547625,
                                lat: 30.495231
                            }
                        },
                        buildingList: [],
                        equipmentList: []
                    };
                    mapService.renderGaode(map, testData, $ctrl);
                } else if (parkNo === "04201030002QDGJHY") {
                    testData = {
                        area: {
                            parkIcon: '',
                            center: [120.160122, 35.950956],
                            leftDown: {
                                lng: 120.158861,
                                lat: 35.949445
                            },
                            rightUp: {
                                lng: 120.160621,
                                lat: 35.952042
                            }
                        },
                        buildingList: [],
                        equipmentList: []
                    };
                    mapService.renderGaode(map, testData, $ctrl);
                } else if (parkNo === "04201030002QDYCZX") {
                    testData = {
                        area: {
                            parkIcon: '',
                            center: [120.16186, 35.96532],
                            leftDown: {
                                lng: 120.156808,
                                lat: 35.964009

                            },
                            rightUp: {
                                lng: 120.164107,
                                lat: 35.96743
                            }
                        },
                        buildingList: [],
                        equipmentList: []
                    };
                    mapService.renderGaode(map, testData, $ctrl);
                } else if (parkNo === "04201030002QDHYKJ") {
                    testData = {
                        area: {
                            parkIcon: '',
                            center: [120.335765, 36.057268],
                            leftDown: {
                                lng: 120.334821,
                                lat: 36.056162
                            },
                            rightUp: {
                                lng: 120.336736,
                                lat: 36.058348
                            }
                        },
                        buildingList: [],
                        equipmentList: []
                    };
                    mapService.renderGaode(map, testData, $ctrl);
                } else if (parkNo === "04201030002SYLHKJ") {
                    testData = {
                        area: {
                            parkIcon: '',
                            center: [123.40982, 41.984668],
                            leftDown: {
                                lng: 123.407153,
                                lat: 41.982531
                            },
                            rightUp: {
                                lng: 123.413445,
                                lat: 41.985422
                            }
                        },
                        buildingList: [],
                        equipmentList: []
                    };
                    mapService.renderGaode(map, testData, $ctrl);
                } else if (parkNo === "04201030002SYZDXX") {
                    testData = {
                        area: {
                            parkIcon: '',
                            center: [123.460687, 41.932831],
                            leftDown: {
                                lng: 123.457212,
                                lat: 41.930323
                            },
                            rightUp: {
                                lng: 123.463477,
                                lat: 41.935256
                            }
                        },
                        buildingList: [],
                        equipmentList: []
                    };
                    mapService.renderGaode(map, testData, $ctrl);
                } else if (parkNo === "04201030002HSLHKJ") {
                    testData = {
                        area: {
                            parkIcon: '',
                            center: [115.000712, 30.158596],
                            leftDown: {
                                lng: 114.998357,
                                lat: 30.155289
                            },
                            rightUp: {
                                lng: 115.002675,
                                lat: 30.159398
                            }
                        },
                        buildingList: [],
                        equipmentList: []
                    };
                    mapService.renderGaode(map, testData, $ctrl);
                } else if (parkNo === "04201030002EZLHKJ") {
                    testData = {
                        area: {
                            parkIcon: '',
                            center: [114.657439, 30.500768],
                            leftDown: {
                                lng: 114.651201,
                                lat: 30.497395
                            },
                            rightUp: {
                                lng: 114.663442,
                                lat: 30.50442
                            }
                        },
                        buildingList: [],
                        equipmentList: []
                    };
                    mapService.renderGaode(map, testData, $ctrl);
                } else if (parkNo === "04201030002HGLHKJ") {
                    testData = {
                        area: {
                            parkIcon: '',
                            center: [114.901924, 30.474566],
                            leftDown: {
                                lng: 114.895964,
                                lat: 30.471774
                            },
                            rightUp: {
                                lng: 114.909101,
                                lat: 30.479689
                            }
                        },
                        buildingList: [],
                        equipmentList: []
                    };
                    mapService.renderGaode(map, testData, $ctrl);
                } else if (parkNo === "04201030002CECXX") {
                    testData = {
                        area: {
                            parkIcon: '',
                            center: [108.900026, 34.237393],
                            leftDown: {
                                lng: 108.899259,
                                lat: 34.236976
                            },
                            rightUp: {
                                lng: 108.900938,
                                lat: 34.238355
                            }
                        },
                        buildingList: [],
                        equipmentList: []
                    };
                    mapService.renderGaode(map, testData, $ctrl);
                } else {
                    mapService.getData(parkNo, type)
                        .then(function (gaodeData) {
                            // console.log('初始化高德地图######################');
                            // console.log(gaodeData);
                            if (!gaodeData || !gaodeData.area || !gaodeData.buildingList) {
                                // alert('没有后台数据');
                                //  return;
                                // 定位到合肥市
                                // 高的地图数据示例
                                var defaultData = {
                                    area: {
                                        parkIcon: '',
                                        center: [117.288374, 31.75165],
                                        leftDown: {
                                            lng: 117.287166,
                                            lat: 31.750199
                                        },
                                        rightUp: {
                                            lng: 117.289541,
                                            lat: 31.753128
                                        }
                                    },
                                    buildingList: [{
                                        iconID: '111',
                                        position: [117.288374, 31.75165],
                                        iconColor: '#2A60FF',
                                        iconType: 'icon-map-sign-water'
                                    }],
                                    equipmentList: [{
                                        iconID: '111',
                                        position: [117.288374, 31.75165],
                                        iconColor: '#2A60FF',
                                        iconType: 'icon-map-sign-water'
                                    }]
                                };

                                mapService.renderGaode(map, defaultData, $ctrl);
                                return;
                            }
                            mapService.renderGaode(map, gaodeData, $ctrl);
                        });
                }
            };

            $scope.$on('刷新高德地图', function (e, data) {
                var gaodeData = data;
                mapService.renderGaode(map, gaodeData, $ctrl);
            });

            $ctrl.$onChanges = function (changes) {
                // console.log(changes);
            };

        }]
    });

    app.service('gaodeMapService', ['$timeout', 'iconService', 'gaodeHttpServer', '$q', 'AppService', function ($timeout, iconService, httpHelper, $q, AppService) {

        var windowInfo;

        // 根据左上角 右下角 计算center
        this.getCenter = function (leftDown, rightUp) {
            var centerLng = ((leftDown.lng + rightUp.lng) / 2).toFixed(6);
            var centerLat = ((leftDown.lat + rightUp.lat) / 2).toFixed(6);
            return [centerLng, centerLat];
        };
        // 根据左下角 右上角 点 绘制矩形区域
        this.createRectPath = function createRectPath(leftDown, rightUp) {
            return [
                new AMap.LngLat(leftDown.lng, leftDown.lat),
                new AMap.LngLat(rightUp.lng, leftDown.lat),
                new AMap.LngLat(rightUp.lng, rightUp.lat),
                new AMap.LngLat(leftDown.lng, rightUp.lat)
            ];
        };

        // 绘制圆角矩形  r  0.1  矩形宽的10%   segments 分段数
        this.createArcRectPath = function (leftDown, rightUp, r, segments) {

            if (!r || !segments) {
                return this.createRectPath(leftDown, rightUp);
            }
            var dx = Math.abs(rightUp.lng - leftDown.lng) * r,
                dy = Math.abs(rightUp.lng - leftDown.lng) * r,
                dr = dx;

            // 生成圆弧离散点
            var dtheta = Math.PI / (2 * segments);
            var points = [];
            for (var i = 0; i <= segments; i++) {
                points.push({
                    dx: (1 - Math.cos(i * dtheta)) * dr,
                    dy: (1 - Math.sin(i * dtheta)) * dr
                });
            }
            // 绘制圆角矩形
            var lnglats = [];
            points.forEach(function (v) {
                lnglats.push(new AMap.LngLat(leftDown.lng + v.dx, leftDown.lat + v.dy));
            });
            points.forEach(function (v) {
                lnglats.push(new AMap.LngLat(rightUp.lng - v.dy, leftDown.lat + v.dx));
            });
            points.forEach(function (v) {
                lnglats.push(new AMap.LngLat(rightUp.lng - v.dx, rightUp.lat - v.dy));
            });
            points.forEach(function (v) {
                lnglats.push(new AMap.LngLat(leftDown.lng + v.dy, rightUp.lat - v.dx));
            });

            return lnglats;
        };

        // 聚焦到园区 并绘制园区矩形
        this.focusAndDrawRect = function (map, center, leftDown, rightUp) {
            // map.setCity('合肥市');
            // 显示合肥金融港
            map.setCenter(center);
            map.setZoom(17);
            // var path = this.createRectPath(leftDown, rightUp);
            var path = this.createArcRectPath(leftDown, rightUp, 0.05, 7);
            //117.286966 31.749943
            //117.289541 31.753428
            // 绘制矩形区域
            var rect = new AMap.Polygon({
                map: map,
                path: path,
                fillColor: '#BBD3E4',
                fillOpacity: 0.01,
                strokeWeight: 5,
                // borderWeight: 5,
                // strokeColor: '#7CB4E7',
                strokeColor: '#6F91F5',
                // lineJoin: 'bevel'
            });
            return rect;
        };

        // 聚焦到园区 并绘制图片
        this.focusAndDrawParkIcon = function (map, center, leftDown, rightUp, iconUrl) {
            // 显示合肥金融港
            map.setCenter(center);
            map.setZoom(18);

            leftDown = new AMap.LngLat(leftDown.lng, leftDown.lat);
            rightUp = new AMap.LngLat(rightUp.lng, rightUp.lat);

            var bounds = new AMap.Bounds(leftDown, rightUp);
            if (iconUrl == '') {
                return;
            } else {
                var img = new AMap.GroundImage(iconUrl, bounds, {
                    map: map
                });
            }


            // var img = new AMap.ImageLayer({
            //     map: map,
            //     url: iconUrl,
            //     bounds: new AMap.Bounds(leftDown, rightUp),
            //     // zooms: [15, 18]
            // });

            return img;
        };

        //添加equipment marker
        this.addEquipmentMarker = function addEquipmentMarker(map, SimpleMarker, iconType, iconName, iconColor, position, clickFn, iconData) {
            position = [parseFloat(position[0]), parseFloat(position[1])];
            var iconMarker = new SimpleMarker({
                //前景文字
                iconLabel: {
                    innerHTML: '<i style="font-size: 25px;position:absolute;top:-5px;left:0"class="icon iconfont ' + iconType + '"></i>', //设置文字内容
                    style: {
                        // color: '#2A60FF', //设置文字颜色
                        color: iconColor, //设置文字颜色
                        fontSize: '50px'
                    }
                },
                //图标主题
                iconTheme: 'fresh',
                //背景图标样式
                iconStyle: '<div style="background:#FFF;width:25px;height:25px;border-radius:50%"></div>',

                map: map,
                position: position
            });

            var context = this;
            iconMarker.on('click', function (e) {
                $timeout(function () {
                    // 停车场禁止点击
                    if (iconType !== 'icon-map-sign-car' && iconType !== 'icon-service-sign-ad' && iconType !== 'icon-fuwu1') {
                        clickFn && clickFn(e);
                    } else if (iconType == 'icon-service-sign-ad') {
                        // console.log(position);
                        var flag = position[1];
                        if (flag == '31.750721') {
                            context.openInfoForAd(map, position, '墙面', '1', '80000', '已租', '中软国际有限公司', '3年');
                        } else if (flag == '31.751259') {
                            context.openInfoForAd(map, position, '电梯', '2', '100000', '已租', '华旺达科技有限公司', '3年');
                        } else if (flag == '31.751387') {
                            context.openInfoForAd(map, position, '电梯', '1', '800000', '已租', '网易合肥有限公司', '2年');
                        } else if (flag == '31.751916') {
                            context.openInfoForAd(map, position, '电梯', '2', '60000', '已租', '鸿海精密合肥有限公司', '1年');
                        } else if (flag == '31.752819') {
                            context.openInfoForAd(map, position, '宣传栏', '1', '70000', '已租', '华旺达科技有限公司', '1年');
                        } else if (flag == '31.752263') {
                            context.openInfoForAd(map, position, '宣传栏', '1', '50000', '已租', '中软国际有限公司', '1年');
                        } else {
                            context.openInfoForAd2(map, position)
                        }

                    } else if (iconType === 'icon-fuwu1') {
                        var personName = iconData.name,
                            personPosition = iconData.positionName,
                            personNum = iconData.personCode,
                            personPhone = iconData.phone;
                        context.openInfoForService(map, position, personName, personPosition, personNum, personPhone);
                    }

                });
            });

            iconMarker.on('mouseover', function (e) {
                $timeout(function () {
                    if (iconType === 'icon-map-sign-car') {
                        context.openInfoForCar(map, position, iconData);
                    }
                });
            });
            iconMarker.on('mouseout', function (e) {
                $timeout(function () {
                    if (iconType === 'icon-map-sign-car') {
                        // console.log('leave...............');
                        windowInfo.close();
                        // context.openInfoForCar(map, position, iconData);
                    }
                });
            });
        };

        // 添加marker
        this.addIconMarker = function addIconMarker(map, SimpleMarker, iconType, iconName, iconColor, position, clickFn, iconData) {
            position = [parseFloat(position[0]), parseFloat(position[1])];
            var iconMarker = new SimpleMarker({
                //前景文字

                //图标主题
                iconTheme: 'fresh',

                map: map,
                position: position,

                label: {
                    content: iconName,
                    offset: new AMap.Pixel(-5, 30)
                }
            });

            var context = this;
            iconMarker.on('click', function (e) {
                $timeout(function () {
                    // console.log('adsfadfafasfasfafdasfffffffffffff');
                    // console.log(iconType);
                    // 停车场禁止点击
                    if (iconType !== 'icon-map-sign-car' && iconType !== 'icon-service-sign-ad') {
                        clickFn && clickFn(e);
                    } else if (iconType == 'icon-service-sign-ad') {
                        // console.log(position);
                        var flag = position[1];
                        if (flag == '31.750721') {
                            context.openInfoForAd(map, position, '墙面', '1', '80000', '已租', '中软国际有限公司', '3年');
                        } else if (flag == '31.751259') {
                            context.openInfoForAd(map, position, '电梯', '2', '100000', '已租', '华旺达科技有限公司', '3年');
                        } else if (flag == '31.751387') {
                            context.openInfoForAd(map, position, '电梯', '1', '800000', '已租', '网易合肥有限公司', '2年');
                        } else if (flag == '31.751916') {
                            context.openInfoForAd(map, position, '电梯', '2', '60000', '已租', '鸿海精密合肥有限公司', '1年');
                        } else if (flag == '31.752819') {
                            context.openInfoForAd(map, position, '宣传栏', '1', '70000', '已租', '华旺达科技有限公司', '1年');
                        } else if (flag == '31.752263') {
                            context.openInfoForAd(map, position, '宣传栏', '1', '50000', '已租', '中软国际有限公司', '1年');
                        } else {
                            context.openInfoForAd2(map, position)
                        }

                    } else if (iconType === 'icon-map-sign-car') {
                        // console.log('222##############################');
                        // console.log(iconType);
                        // console.log(iconData);
                    }
                });
            });

            iconMarker.on('mouseover', function (e) {
                $timeout(function () {
                    if (iconType === 'icon-map-sign-car') {
                        context.openInfoForCar(map, position, iconData);
                    }
                });
            });
            iconMarker.on('mouseout', function (e) {
                $timeout(function () {
                    if (iconType === 'icon-map-sign-car') {
                        // console.log('leave...............');
                        windowInfo.close();
                        // context.openInfoForCar(map, position, iconData);
                    }
                });
            });
        };

        // 添加equipement markerList
        this.addEquipmentMarkerList = function (map, SimpleMarker, iconList, $ctrl) {
            // console.log('equip,,,,,,,,,,,,,,,,,,,,,,,,,,');
            // console.log(iconList);
            var context = this;
            if (!iconList) {
                return;
            }
            iconList.forEach(function (icon) {
                context.addEquipmentMarker(map, SimpleMarker, icon.iconType, icon.iconName, icon.iconColor, icon.position, function () {
                    $ctrl.onIconClick({
                        $event: {
                            iconId: icon.iconID,
                            iconName: icon.iconName,
                            iconType: icon.iconType,
                            iconMating: icon.iconMating,
                            iconActivity: icon.iconActivity,
                            iconService: icon.iconService,
                            iconData: icon.iconData
                        }
                    });
                }, icon.iconData);
            });
        };

        // 添加markerList
        this.addIconMarkerList = function (map, SimpleMarker, iconList, $ctrl) {
            // console.log('marker,,,,,,,,,,,,,,,,,,,,,,,,,,');
            // console.log(iconList);
            var context = this;
            iconList.forEach(function (icon) {
                context.addIconMarker(map, SimpleMarker, icon.iconType, icon.iconName, icon.iconColor, icon.position, function () {
                    $ctrl.onIconClick({
                        $event: {
                            iconId: icon.iconID,
                            iconName: icon.iconName
                        }
                    });
                }, icon.iconData);
            });
        };

        // 渲染地图
        this.renderGaode = function (map, gaodeData, $ctrl) {
            var context = this;
            var center = gaodeData.area.center,
                leftDown = gaodeData.area.leftDown,
                rightUp = gaodeData.area.rightUp,
                parkIcon = gaodeData.area.parkIcon;

            leftDown = {
                lng: parseFloat(leftDown.lng),
                lat: parseFloat(leftDown.lat)
            };
            rightUp = {
                lng: parseFloat(rightUp.lng),
                lat: parseFloat(rightUp.lat)
            };

            // 如果center不是数组，或者是空数组[] 就取中心点
            if (!center.length) {
                center = this.getCenter(leftDown, rightUp);
            }

            //清除覆盖物
            map.clearMap();

            // 合肥金融港 园区 贴图  创意天地 2046园区 绘制矩形
            if (AppService.park.FMAP_ID === 'hfjrg') {
                var url = parkIcon;
                // 服务器上传文件不给力 暂时使用静态文件
                url = '/showXW/res/img/hfjrg/kuang_03.png';
                this.focusAndDrawParkIcon(map, center, leftDown, rightUp, url);
            } else if (AppService.park.FMAP_ID === 'ovuhlw') {
                // this.focusAndDrawRect(map, center, leftDown, rightUp);
                var url = parkIcon;
                // 服务器上传文件不给力 暂时使用静态文件
                url = '/showXW/res/img/ovuhlw/cytd.png';
                this.focusAndDrawParkIcon(map, center, leftDown, rightUp, url);
                map.setZoom(17);
            } else if (AppService.park.fmapId == 'wccxjd') {
                var url = '/showXW/res/img/' + AppService.park.fmapId + '/' + AppService.park.fmapId + '.jpg';
                this.focusAndDrawParkIcon(map, center, leftDown, rightUp, url);
                map.setZoom(15);
            } else if (AppService.park.fmapId == 'cecxx' || AppService.park.fmapId == 'qdgjhy' || AppService.park.fmapId == 'qdhykj' || AppService.park.fmapId == 'ggjrg') {
                var url = '';
                this.focusAndDrawParkIcon(map, center, leftDown, rightUp, url);
                // var editor={};
                // editor._polygon=(function(){
                //     var arr = [ //构建多边形经纬度坐标数组
                //         [114.429068,30.458883],
                //         [114.429068,30.457605],
                //         [114.428376,30.456635],
                //         [114.428097,30.455766],
                //         [114.428129,30.456034],
                //         [114.427088,30.455642],
                //         [114.426324,30.453459],
                //         [114.423642,30.453033],
                //         [114.422435,30.457218],
                //         [114.422934,30.457292],
                //         [114.424945,30.458693]
                //     ]
                //     return new AMap.Polygon({
                //         map: map,
                //         path: arr,
                //         strokeColor: "#0000ff",
                //         strokeOpacity: 1,
                //         strokeWeight: 1,
                //         fillColor: "#0000ff",
                //         fillOpacity: 0.35
                //     });
                // })();
                // map.setFitView();
                map.setZoom(17);
            } else {
                var url = parkIcon;
                url = '/showXW/res/img/' + AppService.park.fmapId + '/' + AppService.park.fmapId + '.png';
                this.focusAndDrawParkIcon(map, center, leftDown, rightUp, url);
                map.setZoom(16);
            }






            // 绘制icon图标
            AMapUI.loadUI(['overlay/SimpleMarker'], function (SimpleMarker) {

                var iconList = gaodeData.buildingList;
                var equipmentList = gaodeData.equipmentList;

                // console.log('2222222222');
                // console.log(iconList);
                // console.log(equipmentList);

                context.addIconMarkerList(map, SimpleMarker, iconList, $ctrl);
                context.addEquipmentMarkerList(map, SimpleMarker, equipmentList, $ctrl);

            });
        };

        // 获取数据
        this.getData = function (parkNo, type) {
            // 获取高德地图数据
            return $q(function (resolve, reject) {
                var gaodeData;

                //设置buildingList数据
                httpHelper
                    .api('GET')('/park/get')({ parkNo: parkNo })
                    .then(function (result) {
                        gaodeData = postGetParkMap(result.data);

                        if (type === 'parkingLot' || type === 'camera') {
                            return httpHelper.api('GET')('/equip/list')({ parkNo: parkNo, type: type });
                        }
                        return httpHelper.api('GET')('/floor/list')({ parkNo: parkNo, type: type });
                    })
                    .then(function (result) {
                        var obj = {};
                        if (type === 'camera') {
                            obj.equipmentList = postGetListMap4Equipment(result.data);
                        }

                        if (type === 'parkingLot') {
                            // obj.buildingList = postParkingMap(result.data);
                            obj.buildingList = [];
                            obj.equipmentList = postParkingMap(result.data);
                        } else if (type === 'mating') {
                            obj.buildingList = postGetListMap(result.data);
                            obj.equipmentList = postMatingMap(result.data);
                        } else if (type === 'service') {
                            obj.buildingList = postGetListMap(result.data);
                            obj.equipmentList = postServiceMap(result.data);
                        } else {
                            obj.buildingList = postGetListMap(result.data);
                        }

                        gaodeData = angular.merge(gaodeData, obj);

                        // 摄像头需要再请求一次楼栋列表
                        if (type == 'camera') {
                            httpHelper.api('GET')('/floor/list')({ parkNo: parkNo, type: type }).then(function (result) {
                                var obj = {};
                                obj.buildingList = postGetListMap(result.data);
                                gaodeData = angular.merge(gaodeData, obj);
                                resolve(gaodeData);
                            });
                        } else if (type === 'activity') {
                            httpHelper.api('GET')('/activity/list.do')({ parkNo: parkNo }).then(function (result) {
                                var obj = {};
                                // console.log('result.....');
                                // console.log(result);
                                obj.equipmentList = postGetActivity(result.data, gaodeData);
                                gaodeData = angular.merge(gaodeData, obj);
                                resolve(gaodeData);
                            });
                        } else if (type === 'infrared') {
                            httpHelper.api('GET')('/equip/list')({ parkNo: parkNo, type: type }).then(function (result) {
                                var obj = {};
                                // console.log('infrares   ,,,,,,result.....');
                                obj.equipmentList = postGetListMap4Equipment(result.data);
                                gaodeData = angular.merge(gaodeData, obj);
                                resolve(gaodeData);
                                // console.log(gaodeData);
                            });
                        } else {
                            resolve(gaodeData);
                        }

                    });
            });

            // map园区数据
            function postGetParkMap(backData) {
                return {
                    parkName: backData.data.PARK_NAME,
                    area: {
                        parkIcon: backData.data.PARK_ICON,
                        center: [],
                        leftDown: {
                            lng: parseFloat(backData.data.BL_POSITION.split(',')[0]),
                            lat: parseFloat(backData.data.BL_POSITION.split(',')[1])
                        },
                        rightUp: {
                            lng: parseFloat(backData.data.TR_POSITION.split(',')[0]),
                            lat: parseFloat(backData.data.TR_POSITION.split(',')[1])
                        }
                    },
                }
            }

            // map楼栋列表数据
            function postGetListMap(backData) {
                //过滤没有经纬度的数据
                var arrFilter = backData.data.filter(function (v) {
                    return v.MAP_POSITION
                });
                var arr = arrFilter.map(function (v) {
                    var iconColor;
                    if (v.DATA_STATUS == 1) {
                        iconColor = iconService.getColor('ovuBlue'); // 设备状态正常显示蓝色
                    } else {
                        iconColor = iconService.getColor('ovuRed'); // 设备状态异常显示红色
                    }
                    var position = v.MAP_POSITION.split(',');

                    // 专为广告而生 begin
                    if (v.equip_type === 'ad') {
                        //已标记的广告位
                        var flagLatArr = ['31.750721', '31.751259', '31.751387', '31.751916', '31.752819', '31.752263'];
                        var isFlag = flagLatArr.some(function (v) {
                            return position[1] == v;
                        });

                        if (!isFlag) {
                            iconColor = iconService.getColor('ovuRed');
                        }
                    }
                    // 专为广告而生 end

                    return {
                        // iconID: v.ID,
                        iconID: v.FLOOR_NO,
                        position: [parseFloat(position[0]), parseFloat(position[1])],
                        iconType: iconService.getType(v.equip_type),
                        iconColor: iconColor,
                        iconName: v.FLOOR_NAME
                    }
                });
                return arr;
            }

            //ghostsf
            function postGetListMap4Equipment(backData) {
                var arrFilter = backData.data.filter(function (v) {
                    return v.latitude_
                });
                var arr = arrFilter.map(function (v) {
                    var iconColor = iconService.getColor('ovuBlue'); // 设备状态正常显示蓝色
                    var position = [v.longitude_, v.latitude_];
                    return {
                        iconID: v.id,
                        position: [parseFloat(position[0]), parseFloat(position[1])],
                        iconType: iconService.getType(v.equip_type),
                        iconColor: iconColor,
                        iconName: v.name
                    }
                });
                return arr;
            }

            // 停车场
            function postParkingMap(backData) {
                var arrFilter = backData.data.filter(function (v) {
                    return v.latitude_
                });
                var arr = arrFilter.map(function (v) {
                    var iconColor;
                    if (1) {
                        iconColor = iconService.getColor('ovuBlue'); // 设备状态正常显示蓝色
                    } else {
                        // iconColor = iconService.getColor('ovuRed'); // 设备状态异常显示红色
                    }
                    // var position = v.MAP_POSITION.split(',');
                    var position = [v.longitude_, v.latitude_];
                    return {
                        iconID: v.id,
                        position: [parseFloat(position[0]), parseFloat(position[1])],
                        // iconType: iconService.getType(v.equip_type),
                        iconType: 'icon-map-sign-car',
                        iconColor: iconColor,
                        // iconName: v.name
                        // iconName: v.equip_simple_name,
                        iconName: '',
                        iconData: v
                    }
                });
                return arr;
            }
            // 配套
            function postMatingMap(backData) {
                var arrFilter = backData.data.filter(function (v) {
                    return v.MAP_POSITION && v.mating;
                });
                var arr = arrFilter.map(function (v) {
                    // var iconColor = iconService.getColor('ovuBlue'); // 设备状态正常显示蓝色
                    var iconColor = '#43e191'; // 设备状态正常显示蓝色
                    // var position = [v.longitude_, v.latitude_];
                    var position = v.MAP_POSITION.split(',');

                    var typs = { '1': 'icon-canyin', '2': 'icon-tuwen', '3': 'glyphicon glyphicon-star' };
                    return {
                        iconID: v.mating.id,
                        position: [parseFloat(position[0] * 0.9999999), parseFloat(position[1] * 0.9999925)],
                        iconType: typs[v.mating.type],
                        iconColor: iconColor,
                        iconName: v.mating.name,
                        // iconMating: v.mating.type
                        iconMating: v.mating.id
                    }
                });
                return arr;
            }
            // 活动
            function postGetActivity(backData, gaodeData) {
                var arrFilter = backData.parkActivitys.filter(function (v) {
                    return v.FLOOR_NO;
                });
                // console.log('@@@@@@@@@@@@@@@@@@@');
                // console.log(gaodeData.buildingList);
                // console.log(arrFilter);

                var arr = arrFilter.map(function (v) {
                    // var iconColor = iconService.getColor('ovuBlue'); // 设备状态正常显示蓝色
                    var iconColor = '#43e191'; // 设备状态正常显示蓝色
                    // var position = [v.longitude_, v.latitude_];
                    var position;
                    gaodeData.buildingList.some(function (item) {
                        if (item.iconID == v.FLOOR_NO) {
                            position = item.position;
                            return true;
                        }
                    });
                    if (!position || !position.length) {
                        position = "117.28772,31.750767".split(',');
                    }

                    // console.log('position5555555555555555555555555555');
                    // console.log(position);

                    return {
                        iconID: v.ID,
                        position: [parseFloat(position[0] * 0.9999999), parseFloat(position[1] * 0.9999925)],
                        iconType: 'icon-huodong_',
                        iconColor: iconColor,
                        iconName: v.TITLE,
                        iconActivity: 'activity'
                    }
                });
                return arr;
            }
            // 服务
            function postServiceMap(backData) {
                // var personName = iconData.name,
                //     personPosition = iconData.positionName,
                //     personNum = iconData.personCode,
                //     personPhone = iconData.phone;

                backData = [
                    { id: 1, type: 2, MAP_POSITION: "117.288153,31.750997", name: '张何欢', positionName: '物业工程师', personCode: 'OVU4120', phone: '13024271518' },
                    { id: 2, type: 1, MAP_POSITION: "117.289964,31.751377", name: '李二', positionName: '运营工程师', personCode: 'OVU4120', phone: '13944447891' },
                    { id: 3, type: 1, MAP_POSITION: "117.291190,31.751797", name: '宋涛', positionName: '运营工程师', personCode: 'OVU4120', phone: '13766668897' },
                    { id: 4, type: 1, MAP_POSITION: "117.291050,31.752833", name: '伍斯特', positionName: '运营工程师', personCode: 'OVU4120', phone: '13124276585' },
                    { id: 5, type: 1, MAP_POSITION: "117.287994,31.752797", name: '海风', positionName: '运营工程师', personCode: 'OVU4120', phone: '13524273663' },
                    { id: 6, type: 1, MAP_POSITION: "117.288809,31.752901", name: '王衡', positionName: '运营工程师', personCode: 'OVU4120', phone: '13624275234' },
                    { id: 7, type: 2, MAP_POSITION: "117.289077,31.75068", name: '郑文杰', positionName: '物业工程师', personCode: 'OVU4120', phone: '13824277896' },
                    { id: 8, type: 2, MAP_POSITION: "117.287806,31.751382", name: '王牛', positionName: '物业工程师', personCode: 'OVU4120', phone: '13924276639' },
                    { id: 9, type: 1, MAP_POSITION: "117.28845,31.751948", name: '刘加', positionName: '运营工程师', personCode: 'OVU4120', phone: '15924275896' },
                    { id: 10, type: 2, MAP_POSITION: "117.289101,31.751218", name: '冯源', positionName: '物业工程师', personCode: 'OVU4120', phone: '13566699877' },
                    { id: 11, type: 2, MAP_POSITION: "117.28772,31.750767", name: '何家鑫', positionName: '物业工程师', personCode: 'OVU4120', phone: '13756898752' },
                    { id: 12, type: 1, MAP_POSITION: "117.28779,31.752165", name: '刘量', positionName: '运营工程师', personCode: 'OVU4120', phone: '13155588691' },
                    { id: 13, type: 1, MAP_POSITION: "117.289169,31.752267", name: '姚总', positionName: '运营工程师', personCode: 'OVU4120', phone: '13636699875' },
                ];
                var arrFilter = backData.filter(function (v) {
                    return v.MAP_POSITION;
                });
                var arr = arrFilter.map(function (v) {
                    var iconColor;
                    // v.type == '1' ? iconColor = iconService.getColor('ovuBlue') : iconColor = '#5BCCC2'; //iconService.getColor('ovuGreen'); // 设备状态正常显示蓝色
                    v.type == '1' ? iconColor = '#43e191' : iconColor = '#5BCCC2'; //iconService.getColor('ovuGreen'); // 设备状态正常显示蓝色
                    // var position = [v.longitude_, v.latitude_];
                    var position = v.MAP_POSITION.split(',');

                    return {
                        iconID: 1,
                        position: [parseFloat(position[0] * 0.9999999), parseFloat(position[1] * 0.9999925)],
                        iconType: 'icon-fuwu1',
                        iconColor: iconColor,
                        iconName: '服务',
                        iconService: 'service',
                        iconData: v
                    }
                });
                return arr;
            }
        };

        // 弹窗  专为广告位而弹窗
        this.openInfoForAd = function (map, position, adType, adNumber, income, status, brand, adTime) {
            var info = [];
            var str = "<div class='col-sm-12 m-b'>" +
                "<h4 class='font-bold '>" + "广告位信息" + "</h4>" +
                "</div>" +
                "<div class=' col-sm-12'>" +
                "<div class='col-sm-6 text-md font-bold'>" + "广告位类型:" + "</div>" +
                "<div class='col-sm-6 spantext lineHeight2'>" + adType + "</div>" +
                "</div>" +
                "<div class=' col-sm-12 m-t'>" +
                "<div class='col-sm-6 text-md font-bold'>" + "广告位数量:" + "</div>" +
                "<div class='col-sm-6 spantext lineHeight2'>" + adNumber + "</div>" +
                "</div>" +
                "<div class=' col-sm-12 m-t'>" +
                "<div class='col-sm-6 text-md font-bold'>" + "总收入:" + "</div>" +
                "<div class='col-sm-6 spantext lineHeight2'>" + income + "</div>" +
                "</div>" +
                "<div class=' col-sm-12 m-t'>" +
                "<div class='col-sm-6 text-md font-bold'>" + "状态:" + "</div>" +
                "<div class='col-sm-6 spantext lineHeight2'>" + status + "</div>" +
                "</div>" +
                "<div class=' col-sm-12 m-t' style='padding:0'>" +
                "<div class='col-sm-6 text-md font-bold'>" + "投放企业名称:" + "</div>" +
                "<div class='col-sm-6 spantext lineHeight2'>" + brand + "</div>" +
                "</div>" +
                "<div class=' col-sm-12 m-t'>" +
                "<div class='col-sm-6 text-md font-bold'>" + "投放时间:" + "</div>" +
                "<div class='col-sm-6 spantext lineHeight2'>" + adTime + "</div>" +
                "</div>";
            info.push('打开信息窗体');
            var infoWindow = new AMap.InfoWindow({
                // content: info.join("") //使用默认信息窗体框样式，显示信息内容
                content: str
            });
            infoWindow.open(map, position);
        };

        this.openInfoForAd2 = function (map, position) {
            var str = "<div class='col-sm-12 m-b'>" +
                "<h4 class='font-bold '>" + "广告位信息" + "</h4>" +
                "</div>" +
                "<div class=' col-sm-12'>" +
                "<div class='col-sm-6 text-md font-bold'>" + "广告位类型:" + "</div>" +
                "<div class='col-sm-6 spantext lineHeight2'>" + "待租" + "</div>" +
                "</div>";

            var infoWindow = new AMap.InfoWindow({
                // content: info.join("") //使用默认信息窗体框样式，显示信息内容
                content: str
            });
            infoWindow.open(map, position);
        };

        // 弹窗  服务
        this.openInfoForService = function (map, position, personName, personPosition, personNum, personPhone) {
            var info = [];
            var str = "<div class='col-sm-12 m-b'>" +
                "<div class=' col-sm-12'>" +
                "<div class='col-sm-6 text-md font-bold'>" + "姓名:" + "</div>" +
                "<div class='col-sm-6 spantext lineHeight2'>" + personName + "</div>" +
                "</div>" +
                "<div class=' col-sm-12 m-t'>" +
                "<div class='col-sm-6 text-md font-bold'>" + "岗位:" + "</div>" +
                "<div class='col-sm-6 spantext lineHeight2'>" + personPosition + "</div>" +
                "</div>" +
                "<div class=' col-sm-12 m-t'>" +
                "<div class='col-sm-6 text-md font-bold'>" + "工号:" + "</div>" +
                "<div class='col-sm-6 spantext lineHeight2'>" + personNum + "</div>" +
                "</div>" +
                "<div class=' col-sm-12 m-t'>" +
                "<div class='col-sm-6 text-md font-bold'>" + "手机:" + "</div>" +
                "<div class='col-sm-6 spantext lineHeight2'>" + personPhone + "</div>" +
                "</div>";
            info.push('打开信息窗体');
            var infoWindow = new AMap.InfoWindow({
                // content: info.join("") //使用默认信息窗体框样式，显示信息内容
                content: str
            });
            infoWindow.open(map, position);
        };

        // 弹窗 停车场
        this.openInfoForCar = function (map, position, iconData) {
            var info = [];
            var str = "<div class='col-sm-12 m-b' style='width:200px;padding:5px;'>" +
                // "<div class=' col-sm-12'>" +
                // "<div class='col-sm-6 text-md font-bold text-right'>" + "名称:" + "</div>" +
                // "<div class='col-sm-6 spantext lineHeight2 text-left'>" + iconData.name + "</div>" +
                // "</div>" +
                "<div class=' col-sm-12'>" +
                "<div class='col-sm-6 text-md font-bold text-right'>" + "名称:" + "</div>" +
                "<div class='col-sm-6 spantext lineHeight2 text-left'>" + iconData.equip_simple_name + "</div>" +
                "</div>" +
                "<div class=' col-sm-12'>" +
                "<div class='col-sm-6 text-md font-bold text-right'>" + "位置:" + "</div>" +
                "<div class='col-sm-6 spantext lineHeight2 text-left'>" + iconData.loc_simple_name + "</div>" +
                "</div>" +
                "</div>";
            info.push('打开信息窗体');
            var infoWindow = new AMap.InfoWindow({
                // content: info.join("") //使用默认信息窗体框样式，显示信息内容
                content: str,
                offset: new AMap.Pixel(5, -15)
            });
            infoWindow.open(map, position);
            windowInfo = infoWindow;
            return infoWindow;
        };

    }]);

    app.service('gaodeHttpServer', ['$http', function ($http) {
        var baseUrl = '/ovu-screen-fake/pcos/show';
        this.api = function (method) {
            return function (url) {
                return function (data) {
                    var realUrl = baseUrl + url;
                    if (method === 'GET') {
                        return $http.get(realUrl, {
                            params: data
                        });
                    }
                }
            };
        };
    }]);

    app.service('iconService', function () {
        var grayColor = '#373C46';
        var blueColor = '#2A60FF';
        var greenColor = '#37CF82';
        var redColor = '#F95353';
        var orangeColor = '#FA9264';

        this.getAllColor = function () {
            return {
                ovuGray: grayColor,
                ovuBlue: blueColor,
                ovuGreen: greenColor,
                ovuRed: redColor,
                ovuOrange: orangeColor
            };
        };

        this.getColor = function (name) {
            var allColor = this.getAllColor();
            return allColor[name];
        };

        this.getAllType = function () {
            return {
                elevator: 'icon-map-sign-lift', // 电梯
                camera: 'icon-service-sign-camera', // 摄像头
                gate: 'icon-map-sign-guard', // 门禁
                parkingLot: 'icon-map-sign-car', // 停车
                sensor: 'icon-map-sign-sensor', // LORA 传感器
                waterMeter: 'icon-map-sign-water', // 水表
                ammeter: 'icon-map-sign-electricity', // 电表
                energy: 'icon-map-sign-energy', // 能耗表
                space: 'icon-service-sign-space', // 空间
                assets: 'icon-service-sign-assets', // 资产
                company: 'icon-service-sign-enterpr', // 企业
                ad: 'icon-service-sign-ad', // 广告位
                infrared: 'icon-map-sign-alarm', // 防盗报警
                fire: 'icon-map-sign-fire', // 消防
                ovuPatrolling: 'icon-map-sign-watch', // 电子巡更
                ovuAccess: '', // 园区门禁管理
            };
        };

        this.getType = function (name) {
            var allType = this.getAllType();
            if (!allType[name]) {
                // console.log('UI未提供' + name + 'icon!');
                return 'icon-red';
            }
            return allType[name];
        };
    });



    app.component('indoorMap', {
        templateUrl: '../showXW/page/component/indoorMap.html',
        bindings: {
            onBackToGaode: '&',
            indoorData: '<'
        },
        require: {
            mapArea: '^^',
            bigScreen: '^^'
        },
        controller: ['$scope', '$rootScope', '$timeout', '$http', 'AppService', 'indoorService', '$state','personService', function ($scope, $rootScope, $timeout, $http, AppService, indoorService, $state,personService) {
            var $ctrl = this;
            $ctrl.$onInit = function () {
                // 地图配置
                AirocovMap.config({
                    // 楼层间距200
                    showAllFloor: false,
                    count: 100,
                    zoom: 5,
                    // defaultFloor: "合肥金融港",
                    //showViewMode: "MODE_3D",
                    defaultGap: 18,//楼层间距
                    showMenu: false //不显示楼层选择
                });
                var parkName = AppService.park.parkName;//园区名称
                var parkNo = AppService.parkNo;
                var type = $ctrl.bigScreen.type;
                var mapList = [];
                var map;
                mapList.push(indoorService.getPark(parkName));
                if (type === 'mating') {
                    $http.get('/ovu-screen-fake/pcos/show/mating/list.do').then(function (result) {
                        var data = result.data.data;
                        mapList[0].other = data.map(function (v) {
                            var position = [0, 0];
                            var id = '';
                            var stype = '';
                            var logo = '';
                            if (v) {
                                id = v.id;
                                position = v.map_position.split(',');
                                stype = v.type;
                                logo = centerIcon(v.type);

                            }
                            return {
                                type: "Position",//固定参数（从其他途径获取的经纬度，在本地图上显示）
                                sType: stype,//自定义数据类型（不同的设备比如报警器，摄像头等.....）
                                logo: logo,//设备显示的图片,
                                dinates: position,
                                // dinates: [117.289113, 31.752325],
                                id: id
                            }

                        });

                        // 初始化地图
                        map = new AirocovMap.Map({
                            container: document.querySelector('#xwMap'),
                            // mapList: mapList,
                            mapList: JSON.parse(JSON.stringify(mapList)),
                            position: {//设置相机位置
                                x: 0,
                                y: 300,
                                z: 0,
                            }
                        });
                        // 地图点击事件
                        map.event.on("click", function (e) { //注册点击事件
                            if (e.type == "clickModel") { //判断点击类型为模块元素
                                console.log(e); //返回模块信息

                            } else if (e.type == "clickEq") { //判断点击类型为设备元素
                                console.log(e); //返回设备信息
                                console.log(e.target.other.type )
                                $state.go('app.company.mating.detail', { id: e.target.other.id })

                            } else if (e.type == "clickMap") { //点击到地图上，但没有点中元素
                                console.log(e); //返回地图信息，包含点击坐标
                            }
                        });

                    });
                } else if (type === 'activity') {
                    $http.get('/ovu-screen-fake/pcos/show/floor/list?parkNo=' + parkNo + '&type=' + type).then(function (result) {
                        var euipdata = result.data.data;
                        $http.get('/ovu-screen-fake/pcos/show/activity/list.do?parkNo=' + parkNo).then(function (result) {
                            var data = result.data.parkActivitys;
                            mapList[0].other = data.map(function (v) {
                                var logo = '';
                                var position = ["117.28772", "31.750767"];
                                for (var i in euipdata) {
                                    if (euipdata[i].FLOOR_NO == v.FLOOR_NO) {
                                        // console.log(euipdata[i]);
                                        position = euipdata[i].MAP_POSITION.split(',');

                                    }
                                }
                                logo = centerIcon(3);
                                return {
                                    type: "Position",//固定参数（从其他途径获取的经纬度，在本地图上显示）
                                    sType: type,//自定义数据类型（不同的设备比如报警器，摄像头等.....）
                                    logo: logo,//设备显示的图片,
                                    dinates: position,
                                    // dinates: [117.289113, 31.752325],

                                }

                            });
                            // 初始化地图
                            map = new AirocovMap.Map({
                                container: document.querySelector('#xwMap'),
                                // mapList: mapList,
                                mapList: JSON.parse(JSON.stringify(mapList)),
                                position: {//设置相机位置
                                    x: 0,
                                    y: 300,
                                    z: 0,
                                }
                            });


                        });
                    });
                } else if (type === 'service') {
                    var backData = personService.getperosnInfo(parkNo).parkData;
                    var arrFilter = backData.filter(function (v) {
                        return v.MAP_POSITION;
                    });

                    mapList[0].other = arrFilter.map(function (v) {
                        var position = v.MAP_POSITION.split(',');
                        return {
                            type: "Position",//固定参数（从其他途径获取的经纬度，在本地图上显示）
                            sType: "service",//自定义数据类型（不同的设备比如报警器，摄像头等.....）
                            logo: centerIcon(4),//设备显示的图片,
                            dinates: position,
                            id: v.id

                        }

                    });
                    // 初始化地图
                    map = new AirocovMap.Map({
                        container: document.querySelector('#xwMap'),
                        // mapList: mapList,
                        mapList: JSON.parse(JSON.stringify(mapList)),
                        position: {//设置相机位置
                            x: 0,
                            y: 300,
                            z: 0,
                        }
                    });
                    // 地图点击事件
                    map.event.on("click", function (e) { //注册点击事件
                        if (e.type == "clickModel") { //判断点击类型为模块元素
                            console.log(e); //返回模块信息


                        } else if (e.type == "clickEq") { //判断点击类型为设备元素
                            var item = backData.filter(function (v) {
                                if (e.target.id == v.id) {
                                    return v;
                                }
                            })
                            var str = "<div class='col-sm-12 m-b' style=\"width:400px;background:#fff;padding: 15px;\">" +
                                "<div class=' col-sm-12'>" +
                                "<div class='col-sm-6 text-md font-bold'>" + "姓名:" + "</div>" +
                                "<div class='col-sm-6 spantext lineHeight2'>" + item[0].name + "</div>" +
                                "</div>" +
                                "<div class=' col-sm-12 m-t'>" +
                                "<div class='col-sm-6 text-md font-bold'>" + "岗位:" + "</div>" +
                                "<div class='col-sm-6 spantext lineHeight2'>" + item[0].positionName + "</div>" +
                                "</div>" +
                                "<div class=' col-sm-12 m-t'>" +
                                "<div class='col-sm-6 text-md font-bold'>" + "工号:" + "</div>" +
                                "<div class='col-sm-6 spantext lineHeight2'>" + item[0].personCode + "</div>" +
                                "</div>" +
                                "<div class=' col-sm-12 m-t'>" +
                                "<div class='col-sm-6 text-md font-bold'>" + "手机:" + "</div>" +
                                "<div class='col-sm-6 spantext lineHeight2'>" + item[0].phone + "</div>" +
                                "</div>";
                            // 弹出气泡
                            map.addInfoWindow({
                                content: str,
                                id: e.target.id, //传入返回的设备ID
                            });


                        } else if (e.type == "clickMap") { //点击到地图上，但没有点中元素
                            console.log(e); //返回地图信息，包含点击坐标
                        }
                    });


                } else {
                    $http.get('/ovu-screen-fake/pcos/show/equip/list?parkNo=' + parkNo + '&type=' + type).then(function (result) {
                        var equipPosition = result.data.data;
                        renderEuip(equipPosition);
                    });


                }

                //渲染总图设备
                function renderEuip(equipPosition) {
                    mapList[0].other = equipPosition.map(function (v) {
                        return {
                            type: "Position",//固定参数（从其他途径获取的经纬度，在本地图上显示）
                            sType: type,//自定义数据类型（不同的设备比如报警器，摄像头等.....）
                            logo: equipIcon(type, v.equip_status),//设备显示的图片,
                            dinates: [v.longitude_, v.latitude_],
                            // dinates: [117.289113, 31.752325],
                            id: v.id
                        }
                    });
                    // 初始化地图
                    map = new AirocovMap.Map({
                        container: document.querySelector('#xwMap'),
                        // mapList: mapList,
                        themeUrl: "/showXW/res/indoor-data/xwData/parklist/csrjy/cs6/theme/fillcolor.json",
                        mapList: JSON.parse(JSON.stringify(mapList)),
                        //themeUrl: "/showXW/res/indoor-data/xwData/parklist/hfjrg/theme.json",
                        position: {//设置相机位置
                            x: 0,
                            y: 300,
                            z: 0,
                        }
                    });

                    // 地图点击事件
                    map.event.on("click", function (e) { //注册点击事件
                        if (e.type == "clickModel") { //判断点击类型为模块元素
                            console.log(e); //返回模块信息
                            if ($state.includes('app.operation')) {
                                return;
                            }
                            if ($state.includes('app.facility.parking')) { // 停车禁止进入
                                return;
                            }
                            // map.clickOutModel(e.target.intersectInfo.id); //模块高亮，把对应模块ID传入
                            map.clickOutModel(e.target.intersectInfo.id, e.target.intersectInfo.floor); //模块高亮，把对应模块ID传入
                            $ctrl.floorId = e.target.intersectInfo.id;
                            var floor = indoorService.getFloorById(parkName, $ctrl.floorId);
                            // console.log($ctrl.floorId);
                            // console.log(floor);
                            // 显示进入楼栋提示信息
                            $timeout(function () {
                                if ($ctrl.showParkMap) {
                                    $ctrl.showEnterTip = true;
                                }
                                if (floor) {
                                    $ctrl.floorName = floor.name;
                                }
                            });

                        } else if (e.type == "clickEq") { //判断点击类型为设备元素
                            console.log(e); //返回设备信息

                            var equipItem = {};
                            for (var i in equipPosition) {
                                if (equipPosition[i].id == e.target.id) {
                                    equipItem = equipPosition[i];
                                }
                            }
                            if (e.target.other.type == "camera") { //调摄像头
                                if ($state.includes('app.safe.alarm')) { //
                                    return;
                                }
                                if (e.target.id == '1503380644454') {
                                    $timeout(function () {
                                        AppService.showVideo(e.target.id)
                                    });
                                }

                            } else if (e.target.other.type == "parkingLot") {
                                var str = "<div class='col-sm-12 m-b panel panel-default' style='width:200px;padding:5px;background:#fff;'>" +
                                    // "<div class=' col-sm-12'>" +
                                    // "<div class='col-sm-6 text-md font-bold text-right'>" + "名称:" + "</div>" +
                                    // "<div class='col-sm-6 spantext lineHeight2 text-left'>" + iconData.name + "</div>" +
                                    // "</div>" +
                                    "<div class=' col-sm-12'>" +
                                    "<div class='col-sm-6 text-md font-bold text-right'>" + "名称:" + "</div>" +
                                    "<div class='col-sm-6 spantext lineHeight2 text-left'>" + equipItem.equip_simple_name + "</div>" +
                                    "</div>" +
                                    "<div class=' col-sm-12'>" +
                                    "<div class='col-sm-6 text-md font-bold text-right'>" + "位置:" + "</div>" +
                                    "<div class='col-sm-6 spantext lineHeight2 text-left'>" + equipItem.loc_simple_name + "</div>" +
                                    "</div>" +
                                    "</div>";
                                // 弹出气泡
                                map.addInfoWindow({
                                    content: str,
                                    id: e.target.id, //传入返回的设备ID
                                });
                            }

                        } else if (e.type == "clickMap") { //点击到地图上，但没有点中元素
                            console.log(e); //返回地图信息，包含点击坐标
                        }
                    });
                }

                // 2D 3D 按钮组
                $ctrl.show2DMode = true;
                $ctrl.to2D = function () {
                    map.mapTo2D();//转换2D调用方法
                    $ctrl.show2DMode = true;
                };
                $ctrl.to3D = function () {
                    map.mapTo3D();//转换3D调用方法
                    $ctrl.show2DMode = false;
                };

                // 进入楼栋提示
                // $ctrl.showEnterTip = true;
                $ctrl.cancelTip = function () {
                    $ctrl.showEnterTip = false;
                    $ctrl.floorName = null;
                };


                $ctrl.enterFloor = function () {
                    $ctrl.show2DMode = true;
                    // console.log('进入楼栋');x
                    $ctrl.showParkMap = false;
                    $ctrl.floorName = null;
                    var floor = indoorService.getFloorById(parkName, $ctrl.floorId);
                    // 广播消息
                    var state = {
                        id: floor.floorNo,
                        name: floor.name,
                    }
                    $scope.$emit('toFloor', state);
                    $ctrl.groundList = floor.groundList;
                    // restRender 会剔除掉 mapList[0],
                    // 深拷贝一次
                    var mapList = JSON.parse(JSON.stringify(floor.groundList));

                    // 请求设备数据
                    var floor = indoorService.getFloorById(parkName, $ctrl.floorId);
                    var floorNo = floor.floorNo;
                    var parkNo = AppService.parkNo;
                    var type = $ctrl.bigScreen.type;
                    // 室内设备渲染
                    $http.get('/ovu-screen-fake/pcos/show/equip/list?floorNo=' + floorNo + '&parkNo=' + parkNo + '&type=' + type).then(function (res) {
                        var eqitem = res.data.data;
                        if (eqitem.length > 0) {
                            for (var i = 0; i < $ctrl.groundList.length; i++) {
                                for (var j = 0; j < eqitem.length; j++) {
                                    if (eqitem[j].ground_num == $ctrl.groundList[i].name.substr(1)) {
                                        mapList[i].other = [
                                            {
                                                type: "Position",//固定参数（从其他途径获取的经纬度，在本地图上显示）
                                                sType: type,//自定义数据类型（不同的设备比如报警器，摄像头等.....）
                                                dinates: [eqitem[j].map_lng, eqitem[j].map_lat],//传入经纬度
                                                // dinates: AirocovMap.Utils.GPS.gcj_decrypt_exact(eqitem.latitude_, eqitem.longitude_),//传入经纬度
                                                // logo: "../logos.png",//设备显示的图片
                                                logo: equipIcon(type, eqitem[j].equip_status),//设备显示的图片,
                                                id: eqitem[j].id
                                            }

                                        ];
                                    }
                                }
                            }
                        }
                        // 地图点击事件
                        map.event.on("click", function (e) { //注册点击事件
                            var str = '';
                            if (e.type == "clickModel") { //判断点击类型为模块元素
                                map.clickOutModel(e.target.intersectInfo.id, e.target.intersectInfo.floor); //模块高亮，把对应模块ID传入
                                if (type === 'space' || type == 'company') {
                                    var id = e.target.intersectInfo.uuid;
                                    console.log('uuid:' + id);
                                    $http.get("/ovu-screen-fake/pcos/show/house/getHouseNo?bimId=" + (id || 520238010116) + '&floorNo=' + floor.floorNo).success(function (resp) {
                                        if (resp.success) {

                                            var houseNo = resp.data && resp.data.HOUSE_NO;
                                            var houseName = resp.data && resp.data.HOUSE_NAME;
                                            var data = { id: houseNo, name: houseName };
                                            $scope.$emit('toRoom', data);
                                        }
                                    });

                                }
                            } else if (e.type == "clickEq") { //判断点击类型为设备元素
                                var equipItem = {};
                                for (var i in eqitem) {

                                    if (eqitem[i].id == e.target.id) {
                                        equipItem = eqitem[i];
                                    }
                                }
                                if (e.target.other.type == "camera") { // 摄像头
                                    str = "<div class='panel panel-default' style='overflow:auto;height:160px;width: 500px;margin-bottom:0;'><div class=' col-sm-12 m-t-lg'>" +
                                        "<div class='col-sm-4 text-md font-bold'>" + "摄像头名称:" + "</div>" +
                                        "<div class='col-sm-8 spantext lineHeight2'>" + equipItem.name + "</div>" +
                                        "</div>" +
                                        "<div class=' col-sm-12 m-t'>" +
                                        "<div class='col-sm-4 text-md font-bold'>" + "摄像头状态:" + "</div>";
                                    if (equipItem.equip_status == 1) {
                                        str = str + "<div class='col-sm-8 spantext lineHeight2' >" + "正常" + "</div>";
                                    } else {
                                        str = str + "<div class='col-sm-8 spantext lineHeight2' style='color: red;'>" + "异常" + "</div>";
                                    }

                                    str = str + "</div></div>";
                                    map.addInfoWindow({
                                        content: str, //传入前端样式
                                        id: e.target.id, //传入返回的设备ID
                                    });
                                } else if (e.target.other.type == "elevator") { // 电梯
                                    str = "<div class='panel panel-default' style='overflow:auto;height:200px;width: 500px;margin-bottom:0;'><div class='col-sm-12 m-b'>" +
                                        "<h4>" + equipItem.name + "</h4>" +
                                        "</div>" +
                                        "<div class=''>";
                                    if (equipItem.equip_status == 1) {
                                        str = str + "<div class='col-sm-3 text-lg font-bold'>" + "正常" + "</div>";
                                    } else {
                                        str = str + "<div class='col-sm-3 text-lg font-bold' style='color: red;'>" + "异常" + "</div>";
                                    }
                                    str = str + "<div class='col-sm-3 text-lg font-bold'>" + getVal(equipItem.params, '方向', '上行') + "</div>" +
                                        "<div class='col-sm-3 text-lg font-bold'>" + getVal(equipItem.params, '温度', GetRandomNum(20, 24) + '℃') + "</div>" +
                                        "<div class='col-sm-3 text-lg font-bold m-b'>" + getVal(equipItem.params, '潮度', GetRandomNum(12, 20) + '%rh') + "</div>" +
                                        "</div>" +
                                        "<div class=''>" +
                                        "<div class='col-sm-3 spantext'>" + "电梯状态" + "</div>" +
                                        "<div class='col-sm-3 spantext'>" + "运行方向" + "</div>" +
                                        "<div class='col-sm-3 spantext'>" + "轿厢温度" + "</div>" +
                                        "<div class='col-sm-3 spantext'>" + "轿厢湿度" + "</div>" +
                                        "</div></div>";
                                    map.addInfoWindow({
                                        content: str, //传入前端样式
                                        id: e.target.id, //传入返回的设备ID
                                    });
                                } else if (e.target.other.type == "gate") {
                                    str = "<div class='panel panel-default' style='overflow:auto;height:160px;width: 500px;margin-bottom:0;'><div class=' col-sm-12 m-t-lg'>" +
                                        "<div class='col-sm-4 text-md font-bold'>" + "门禁名称:" + "</div>" +
                                        "<div class='col-sm-8 spantext lineHeight2'>" + equipItem.name + "</div>" +
                                        "</div>" +
                                        "<div class=' col-sm-12 m-t'>" +
                                        "<div class='col-sm-4 text-md font-bold'>" + "门禁状态:" + "</div>";
                                    if (equipItem.equip_status == 1) {
                                        str = str + "<div class='col-sm-8 spantext lineHeight2' >" + "正常" + "</div>";
                                    } else {
                                        str = str + "<div class='col-sm-8 spantext lineHeight2' style='color: red;'>" + "异常" + "</div>";
                                    }

                                    str = str + "</div></div>";

                                    map.addInfoWindow({
                                        content: str, //传入前端样式
                                        id: e.target.id, //传入返回的设备ID
                                    });
                                } else if (e.target.other.type == 'waterMeter') {
                                    $http.get('/ovu-screen-fake/pcos/equipment/get.do?id=' + e.target.id)
                                        .success(function (resultsother) {
                                            //
                                            $http.get('/ovu-screen-fake/pcos/show/water?houseNo=' + resultsother.data.houseNo)
                                                .success(function (results) {
                                                    str = '<div class="panel panel-default" id="mainEchar" style="height:180px;width: 450px;margin-bottom:0;"></div>';
                                                    //
                                                    map.addInfoWindow({
                                                        content: str, //传入前端样式
                                                        id: e.target.id, //传入返回的设备ID
                                                    });

                                                    //画图方法;
                                                    makeEchat(results.waterTrend, '单位：m³');

                                                })
                                                .error(function () {
                                                    alert("请求事件出错");
                                                });

                                        });

                                } else if (e.target.other.type == 'ammeter') {
                                    $http.get('/ovu-screen-fake/pcos/equipment/get.do?id=' + e.target.id)
                                        .success(function (resultsother) {
                                            //
                                            $http.get('/ovu-screen-fake/pcos/show/power?houseNo=' + resultsother.data.houseNo)
                                                .success(function (results) {
                                                    str = '<div class="panel panel-default" id="mainEchar" style="height:180px;width: 450px;margin-bottom:0;"></div>';
                                                    //
                                                    map.addInfoWindow({
                                                        content: str, //传入前端样式
                                                        id: e.target.id, //传入返回的设备ID
                                                    });

                                                    //画图方法;
                                                    makeEchat(results.powerTrend, '单位：万KWH');

                                                })
                                                .error(function () {
                                                    alert("请求事件出错");
                                                });

                                        });

                                } else if (e.target.other.type == 'energy') {
                                    $http.get('/ovu-screen-fake/pcos/equipment/get.do?id=' + e.target.id)
                                        .success(function (resultsother) {
                                            //
                                            $http.get('/ovu-screen-fake/pcos/show/power?houseNo=' + resultsother.data.houseNo)
                                                .success(function (results) {
                                                    str = '<div class="panel panel-default" id="mainEchar" style="height:180px;width: 450px;margin-bottom:0;"></div>';
                                                    //
                                                    map.addInfoWindow({
                                                        content: str, //传入前端样式
                                                        id: e.target.id, //传入返回的设备ID
                                                    });

                                                    //画图方法;
                                                    makeEchat(results.powerTrend, '单位：KWH');

                                                })
                                                .error(function () {
                                                    alert("请求事件出错");
                                                });

                                        });

                                }

                            } else if (e.type == "clickMap") { //点击到地图上，但没有点中元素
                                console.log(e); //返回地图信息，包含点击坐标
                            }
                        });
                        map.resetRender({
                            mapList: JSON.parse(JSON.stringify(mapList))
                        });

                    });

                    $ctrl.showEnterTip = false;


                };

                // 返回园区
                $ctrl.showParkMap = true;
                $ctrl.backToPark = function () {
                    // console.log('返回园区');
                    $ctrl.showParkMap = true;
                    $ctrl.show2DMode = true;
                    $scope.$emit('toGaode', '返回高德界面');

                    map.resetRender({
                        mapList: JSON.parse(JSON.stringify(mapList)),
                    });
                };
                /* 楼层控制点击事件*/
                $ctrl.floorCtrl = function () {
                    if ($('#jumpHead').hasClass('shrink')) {
                        $('#jumpHead img').attr('src', '/show/res/indoor-data/feng-wedgets/img/layer.png');
                        $('#jumpHead').removeClass('shrink');
                        $('#jumpBody').show();

                        // 显示选中的楼层
                        var name = $.trim($('label.selected').html());
                        map.showFloor(name);
                        // 广播事件
                        var floor = indoorService.getFloorById(parkName, $ctrl.floorId);
                        var state = {
                            name: floor.name + '-' + name,
                            id: parseInt(name.substring(1))
                        };
                        $scope.$emit('toGround', state);
                    } else {
                        $('#jumpHead img').attr('src', '/show/res/indoor-data/feng-wedgets/img/layers.png');
                        $('#jumpHead').addClass('shrink');
                        $('#jumpBody').hide();
                        // 显示所有楼层
                        map.showAllFloor();
                        // 广播事件
                        var floor = indoorService.getFloorById(parkName, $ctrl.floorId);
                        var state = {
                            id: floor.floorNo,
                            name: floor.name,
                        }
                        $scope.$emit('toFloor', state);
                    }

                };
                $ctrl.selectNo = 0;
                $ctrl.groundClick = function (item, index) {
                    $ctrl.selectNo = index;
                    map.showFloor(item.name);
                    // 广播事件
                    var floor = indoorService.getFloorById(parkName, $ctrl.floorId);
                    var state = {
                        name: floor.name + '-' + item.name,
                        id: parseInt(item.name.substring(1))
                    };
                    $scope.$emit('toGround', state);
                };
                //企业中心图标判断
                function centerIcon(type) {
                    var imageUrl = '';
                    switch (type) {
                        case 1:
                            imageUrl = '/showXW/res/img/2.png';
                            break;
                        case 2:
                            imageUrl = '/showXW/res/img/4.png';
                            break;
                        case 3:
                            imageUrl = '/showXW/res/img/3.png';
                            break;
                        case 4:
                            imageUrl = '/showXW/res/img/1.png';
                            break;
                        case 5:
                            imageUrl = '/showXW/res/img/1.png';
                            break;
                    }
                    return imageUrl;
                }
                // 设备图标判断
                function equipIcon(type, imagestatus) {
                    var imageUrl = '';
                    switch (type) {
                        case "elevator": //hollow. u needn't change this color. because i will make a hole on the model in the final version.
                            //电梯
                            if (imagestatus == '1') {
                                imageUrl = '/show/res/img/map-sign-lift-normal.png';
                            } else {
                                imageUrl = '/show/res/img/map-sign-lift-abnormality.png';
                            }
                            break;
                        case "camera": //closed area
                            //摄像头
                            if (imagestatus == '1') {
                                imageUrl = '/show/res/img/map-sign-camera-normal.png';
                            } else {
                                imageUrl = '/show/res/img/map-sign-camera-abnormality.png';
                            }
                            break;
                        case "gate": //empty shop
                            //门禁
                            if (imagestatus == '1') {
                                imageUrl = '/show/res/img/map-sign-guard-normal.png';
                            } else {
                                imageUrl = '/show/res/img/map-sign-guard-abnormality.png';
                            }
                            break;
                        case "parkingLot": //empty shop
                            //停车管理
                            if (imagestatus == '1') {
                                imageUrl = '/show/res/img/map-sign-car-normal.png';
                            } else {
                                imageUrl = '/show/res/img/map-sign-car-abnormality.png';
                            }
                            break;
                        case "sensor": //empty shop
                            //LORA传感器
                            if (imagestatus == '1') {
                                imageUrl = '/show/res/img/map-sign-sensor-normal.png';
                            } else {
                                imageUrl = '/show/res/img/map-sign-sensor-abnormality.png';
                            }
                            break;
                        case "waterMeter": //empty shop
                            //水表
                            if (imagestatus == '1') {
                                imageUrl = '/show/res/img/map-sign-water-normal.png';
                            } else {
                                imageUrl = '/show/res/img/map-sign-water-abnormality.png';
                            }
                            break;
                        case "ammeter": //empty shop
                            //电表
                            if (imagestatus == '1') {
                                imageUrl = '/show/res/img/map-sign-electricity-normal.png';
                            } else {
                                imageUrl = '/show/res/img/map-sign-electricity-abnormality.png';
                            }
                            break;
                        case "energy": //empty shop
                            //能源表
                            if (imagestatus == '1') {
                                imageUrl = '/show/res/img/map-sign--energy-normal.png';
                            } else {
                                imageUrl = '/show/res/img/map-sign--energy-abnormality.png';
                            }
                            break;
                        case "space": //empty shop
                            //空间
                            if (imagestatus == '1') {
                                imageUrl = '/show/res/img/map-sign--rent.png';
                            } else {
                                imageUrl = '/show/res/img/map-sign--null.png';
                            }
                            break;
                        case "assets": //empty shop
                            //资产
                            if (imagestatus == '1') {
                                imageUrl = '/show/res/img/map-sign-assets-normal.png';
                            } else {
                                imageUrl = '/show/res/img/map-sign-assets-abnormality.png';
                            }
                            break;
                        case "company": //empty shop
                            //企业
                            if (imagestatus == '1') {
                                imageUrl = '/show/res/img/map-sign-senterprise-normal.png';
                            } else {
                                imageUrl = '/show/res/img/map-sign-senterprise-abnormality.png';
                            }
                            break;
                        case "ad": //empty shop
                            //广告位
                            if (imagestatus == '1') {
                                imageUrl = '/show/res/img/map-sign--rent.png';
                            } else {
                                imageUrl = '/show/res/img/map-sign--null.png';
                            }
                            break;
                        case "infrared": //empty shop
                            //防盗报警
                            if (imagestatus == '1') {
                                imageUrl = '/show/res/img/map-sign-alarm-normal.png';
                            } else {
                                imageUrl = '/show/res/img/map-sign-assets-abnormality.png';
                            }
                            break;
                        case "ovufire": //empty shop
                            //视频监控
                            if (imagestatus == '1') {
                                imageUrl = '/show/res/img/map-sign--watch-normal.png';
                            } else {
                                imageUrl = '/show/res/img/map-sign--watch-abnormality.png';
                            }
                            break;
                        case "ovuPatrolling": //empty shop
                            //电子巡更
                            if (imagestatus == '1') {
                                imageUrl = '/show/res/img/map-sign-chair-normal.png';
                            } else {
                                imageUrl = '/show/res/img/map-sign-chair-abnormality.png';
                            }
                            break;
                        case "ovuAccess": //empty shop
                            //门禁管理
                            if (imagestatus == '1') {
                                imageUrl = '/show/res/img/map-sign-entrance-normal.png';
                            } else {
                                imageUrl = '/show/res/img/map-sign-entrance-abnormality.png';
                            }
                            break;
                        case "fire": //empty shop
                            //消防系统
                            if (imagestatus == '1') {
                                imageUrl = '/show/res/img/map-sign-lift-normal.png';
                            } else {
                                imageUrl = '/show/res/img/map-sign-lift-abnormality.png';
                            }
                            break;
                        default:
                            imageUrl = '/show/res/img/mc.png';
                            break;
                    }
                    return imageUrl;
                }
                function makeEchat(data, yAxisName) {
                    var myChart = echarts.init(document.getElementById("mainEchar"));
                    var option = AppService.getPolyOption(data, yAxisName);
                    // console.log(option);
                    // 为echarts对象加载数据
                    myChart.setOption(option);
                }
                function GetRandomNum(Min, Max) {
                    var Range = Max - Min;
                    var Rand = Math.random();
                    return (Min + Math.round(Rand * Range));
                }
                function getVal(params, name, detaultVal) {
                    var val = "";
                    //
                    if (!params) {
                        return detaultVal;
                    }
                    for (var i = 0; i < params.length; i++) {
                        if (params[i].name == name) {
                            if (params[i].val_and_time) {
                                val = params[i].val_and_time.split('#')[0];
                            }
                        }
                    }
                    if (!val) {
                        val = detaultVal;
                    }
                    return val;
                }
            };

            $ctrl.goback = function () {
                $ctrl.onBackToGaode({
                    $event: {}
                });
            };


        }]
    });

    app.service('indoorService', function () {
        var baseUrl = '/showXW/res/indoor-data/xwData/parklist/'
        var data = [
            {
                name: '合肥金融港',
                // name: 'hfjrg',
                mapUrl: baseUrl + 'hfjrg/view/1.geojson',
                floorList: [
                    {
                        id: "11",
                        name: 'A1',
                        floorNo: '03401110001HFJRYQ01001',
                        groundList: groundList(17, 1)
                    }, {
                        id: "8",
                        name: 'A2',
                        floorNo: '03401110001HFJRYQ01002',
                        groundList: groundList(23, 2)
                    }, {
                        id: "6",
                        floorNo: '03401110001HFJRYQ01003',
                        name: 'A3',
                        groundList: groundList(23, 3)
                    }, {
                        id: "15",
                        floorNo: '03401110001HFJRYQ01A05',
                        name: 'A5',
                        groundList: groundList(17, 5)
                    }, {
                        id: "17",
                        floorNo: '03401110001HFJRYQ01A06',
                        name: 'A6',
                        groundList: groundList(14, 6)
                    }, {
                        id: "26",
                        floorNo: '03401110001HFJRYQ01007',
                        name: 'A7',
                        groundList: groundList(6, 7)
                    }, {
                        id: "29",
                        floorNo: '03401110001HFJRYQ01008',
                        name: 'A8',
                        groundList: groundList(6, 8)
                    }, {
                        id: "38",
                        name: 'A9',
                        floorNo: '03401110001HFJRYQ01009',
                        groundList: groundList(6, 9)
                    }, {
                        id: "48",
                        floorNo: '03401110001HFJRYQ01010',
                        name: 'A10',
                        groundList: groundList(6, 10)
                    }, {
                        id: "44",
                        floorNo: '03401110001HFJRYQ01011',
                        name: 'A11',
                        groundList: groundList(6, 11)
                    }, {
                        id: "33",
                        floorNo: '03401110001HFJRYQ01012',
                        name: 'A12',
                        groundList: groundList(6, 12)
                    }, {
                        id: "27",
                        floorNo: '03401110001HFJRYQ01013',
                        name: 'A13',
                        groundList: groundList(6, 13)
                    }

                ]
            },
            {
                name: '创意天地',
                mapUrl: baseUrl + 'cytd/view/zt.geojson',
                floorList: [
                    {
                        id: '',
                        name: '艺术家1',
                        groundList: [
                            {
                                name: 'F1',
                                mapUrl: baseUrl + 'cytd/a1/1f.geojson',
                            }, {
                                name: 'F2',
                                mapUrl: baseUrl + 'cytd/a1/2f.geojson',
                            }, {
                                name: 'F3',
                                mapUrl: baseUrl + 'cytd/a1/3f.geojson',
                            }

                        ]
                    }, {
                        id: '',
                        name: '艺术家2',
                        groundList: [
                            {
                                name: 'F1',
                                mapUrl: baseUrl + 'hfjrg/artist2/1f.geojson',
                            }, {
                                name: 'F2',
                                mapUrl: baseUrl + 'hfjrg/artist2/2f.geojson',
                            }

                        ]
                    }, {
                        id: '',
                        name: '高层办公2',
                        groundList: [
                            {
                                name: 'F1',
                                mapUrl: baseUrl + 'hfjrg/highOffice2/1f.geojson',
                            }, {
                                name: 'F2',
                                mapUrl: baseUrl + 'hfjrg/highOffice2/2f.geojson',
                            }, {
                                name: 'F3',
                                mapUrl: baseUrl + 'hfjrg/highOffice2/3f.geojson',
                            }, {
                                name: 'F4',
                                mapUrl: baseUrl + 'hfjrg/highOffice2/4f.geojson',
                            }, {
                                name: 'B1',
                                mapUrl: baseUrl + 'hfjrg/highOffice2/b1.geojson',
                            }


                        ]
                    }, {
                        id: '',
                        name: '高层办公9',
                        groundList: [
                        ]
                    }

                ]
            },
            {
                name: '长沙软件园',
                mapUrl: baseUrl + 'csrjy/view/zt.geojson',
                //themeUrl: "/showXW/res/indoor-data/xwData/parklist/csrjy/theme.json",
                floorList: [
                    {
                        id: '35',
                        name: '4#',
                        floorNo: '',
                        groundList: [
                            {
                                name: 'F1',
                                mapUrl: baseUrl + 'csrjy/cs4/cs4-1f.geojson',
                            },
                            {
                                name: 'F2',
                                mapUrl: baseUrl + 'csrjy/cs4/cs4-2f.geojson',
                            },
                            {
                                name: 'F3',
                                mapUrl: baseUrl + 'csrjy/cs4/cs4-3f.geojson',
                            },
                            {
                                name: 'F4',
                                mapUrl: baseUrl + 'csrjy/cs4/cs4-4f.geojson',
                            },
                            {
                                name: 'F5',
                                mapUrl: baseUrl + 'csrjy/cs4/cs4-5f.geojson',
                            }
                        ]
                    },
                    {
                        id: '45',
                        floorNo: '',
                        name: '5#',
                        groundList: [
                            {
                                name: 'F1',
                                mapUrl: baseUrl + 'csrjy/cs5/cs5-1f.geojson',
                            },
                            {
                                name: 'F2',
                                mapUrl: baseUrl + 'csrjy/cs5/cs5-2f.geojson',
                            },
                            {
                                name: 'F3',
                                mapUrl: baseUrl + 'csrjy/cs5/cs5-3f.geojson',
                            },
                            {
                                name: 'F4',
                                mapUrl: baseUrl + 'csrjy/cs5/cs5-4f.geojson',
                            },
                            {
                                name: 'F5',
                                mapUrl: baseUrl + 'csrjy/cs5/cs5-5f.geojson',
                            },
                            {
                                name: 'F6',
                                mapUrl: baseUrl + 'csrjy/cs5/cs5-6f.geojson',
                            },
                            {
                                name: 'F7',
                                mapUrl: baseUrl + 'csrjy/cs5/cs5-7f.geojson',
                            },
                            {
                                name: 'F8',
                                mapUrl: baseUrl + 'csrjy/cs5/cs5-8f.geojson',
                            }
                        ]
                    },
                    {
                        id: '41',
                        floorNo: '04301040001ZSRJYQ01001',
                        name: '6#',
                        groundList: [
                            {
                                name: 'F1',
                                mapUrl: baseUrl + 'csrjy/cs6/cs6-1f.geojson',
                            },
                            {
                                name: 'F2',
                                mapUrl: baseUrl + 'csrjy/cs6/cs6-2f.geojson',
                            },
                            {
                                name: 'F3',
                                mapUrl: baseUrl + 'csrjy/cs6/cs6-3f.geojson',
                            },
                            {
                                name: 'F4',
                                mapUrl: baseUrl + 'csrjy/cs6/cs6-4f.geojson',
                            },
                            {
                                name: 'F5',
                                mapUrl: baseUrl + 'csrjy/cs6/cs6-5f.geojson',
                            }
                        ]
                    },
                    {
                        id: '50',
                        floorNo: '',
                        name: '7#',
                        groundList: [
                            {
                                name: 'F1',
                                mapUrl: baseUrl + 'csrjy/cs7/cs7-1f.geojson',
                            },
                            {
                                name: 'F2',
                                mapUrl: baseUrl + 'csrjy/cs7/cs7-2f.geojson',
                            },
                            {
                                name: 'F3',
                                mapUrl: baseUrl + 'csrjy/cs7/cs7-3f.geojson',
                            },
                            {
                                name: 'F4',
                                mapUrl: baseUrl + 'csrjy/cs7/cs7-4f.geojson',
                            },
                            {
                                name: 'F5',
                                mapUrl: baseUrl + 'csrjy/cs7/cs7-5f.geojson',
                            },
                            {
                                name: 'F6',
                                mapUrl: baseUrl + 'csrjy/cs7/cs7-5f.geojson',
                            },
                            {
                                name: 'F7',
                                mapUrl: baseUrl + 'csrjy/cs7/cs7-5f.geojson',
                            },
                            {
                                name: 'F8',
                                mapUrl: baseUrl + 'csrjy/cs7/cs7-5f.geojson',
                            }
                        ]
                    },
                    {
                        id: '81',
                        floorNo: '',
                        name: '8#',
                        groundList: [
                            {
                                name: 'F1',
                                mapUrl: baseUrl + 'csrjy/cs8/cs8-1f.geojson',
                            },
                            {
                                name: 'F2',
                                mapUrl: baseUrl + 'csrjy/cs8/cs8-2f.geojson',
                            },
                            {
                                name: 'F3',
                                mapUrl: baseUrl + 'csrjy/cs8/cs8-3f.geojson',
                            },
                            {
                                name: 'F4',
                                mapUrl: baseUrl + 'csrjy/cs8/cs8-4f.geojson',
                            },
                            {
                                name: 'F5',
                                mapUrl: baseUrl + 'csrjy/cs8/cs8-5f.geojson',
                            }
                        ]
                    },
                    {
                        id: '83',
                        floorNo: '',
                        name: '11#',
                        groundList: [
                            {
                                name: 'F1',
                                mapUrl: baseUrl + 'csrjy/cs11/cs11-1f.geojson',
                            },
                            {
                                name: 'F2',
                                mapUrl: baseUrl + 'csrjy/cs11/cs11-2f.geojson',
                            },
                            {
                                name: 'F3',
                                mapUrl: baseUrl + 'csrjy/cs11/cs11-3f.geojson',
                            },
                            {
                                name: 'F4',
                                mapUrl: baseUrl + 'csrjy/cs11/cs11-4f.geojson',
                            }
                        ]
                    },
                     {
                        id: '84',
                        floorNo: '',
                        name: '12#',
                        groundList: [
                            {
                                name: 'F1',
                                mapUrl: baseUrl + 'csrjy/cs12/cs12-1f.geojson',
                            },
                            {
                                name: 'F2',
                                mapUrl: baseUrl + 'csrjy/cs12/cs12-2f.geojson',
                            },
                            {
                                name: 'F3',
                                mapUrl: baseUrl + 'csrjy/cs12/cs12-3f.geojson',
                            },
                            {
                                name: 'F4',
                                mapUrl: baseUrl + 'csrjy/cs12/cs12-4f.geojson',
                            }
                        ]
                    },
                    {
                        id: '85',
                        floorNo: '',
                        name: '14#',
                        groundList: [
                            {
                                name: 'F1',
                                mapUrl: baseUrl + 'csrjy/cs14/cs14-1f.geojson',
                            },
                            {
                                name: 'F2',
                                mapUrl: baseUrl + 'csrjy/cs14/cs14-2f.geojson',
                            },
                            {
                                name: 'F3',
                                mapUrl: baseUrl + 'csrjy/cs14/cs14-3f.geojson',
                            },
                            {
                                name: 'F4',
                                mapUrl: baseUrl + 'csrjy/cs14/cs14-4f.geojson',
                            },
                             {
                                name: 'F5',
                                mapUrl: baseUrl + 'csrjy/cs14/cs14-5f.geojson',
                            }
                        ]
                    },
                    {
                        id: '75',
                        floorNo: '',
                        name: '17#',
                        groundList: [
                            {
                                name: 'F1',
                                mapUrl: baseUrl + 'csrjy/cs17/cs17-1f.geojson',
                            },
                            {
                                name: 'F2',
                                mapUrl: baseUrl + 'csrjy/cs17/cs17-2f.geojson',
                            },
                            {
                                name: 'F3',
                                mapUrl: baseUrl + 'csrjy/cs17/cs17-3f.geojson',
                            },
                            {
                                name: 'F4',
                                mapUrl: baseUrl + 'csrjy/cs17/cs17-4f.geojson',
                            },
                             {
                                name: 'F5',
                                mapUrl: baseUrl + 'csrjy/cs17/cs17-5f.geojson',
                            }
                        ]
                    },
                      {
                        id: '73',
                        floorNo: '',
                        name: '18#',
                        groundList: [
                            {
                                name: 'F1',
                                mapUrl: baseUrl + 'csrjy/cs18/cs18-1f.geojson',
                            },
                            {
                                name: 'F2',
                                mapUrl: baseUrl + 'csrjy/cs18/cs18-2f.geojson',
                            },
                            {
                                name: 'F3',
                                mapUrl: baseUrl + 'csrjy/cs18/cs18-3f.geojson',
                            },
                            {
                                name: 'F4',
                                mapUrl: baseUrl + 'csrjy/cs18/cs18-4f.geojson',
                            },
                             {
                                name: 'F5',
                                mapUrl: baseUrl + 'csrjy/cs18/cs18-5f.geojson',
                            }
                        ]
                    }
                ]
            }
        ];
        function groundList(num, floor) {
            var arr = [];
            for (var i = 1; i <= num; i++) {
                var name = 'F' + i;
                var mapUrl = '/showXW/res/indoor-data/xwData/parklist/hfjrg/a' + floor + '/' + i + 'f.geojson';
                arr.push({ 'name': name, 'mapUrl': mapUrl });
            }
            return arr;
        }
        var getParkItem = function (name) {
            var park = data.filter(function (item) {
                return item.name === name;
            })[0];
            return park;
        };
        this.data = getParkItem('合肥金融港');
        // 获取园区信息
        this.getPark = function (name) {
            var park = getParkItem(name);
            return {
                name: park.name,
                mapUrl: park.mapUrl,
                themeUrl: park.themeUrl
            }
        };
        // 获取楼栋
        this.getFloor = function (parkName, floorName) {
            var park = getParkItem(parkName);
            var floor = park.floorList.filter(function (item) {
                return item.name === floorName;
            })[0];
            return floor;
        };

        // 根据id获取楼栋
        this.getFloorById = function (parkName, id) {
            var park = getParkItem(parkName);
            var floor = park.floorList.filter(function (item) {
                // return item.id === parseInt(id);
                return item.id === id;
            })[0];
            return floor;
        };

        // 获取楼层
        this.getGround = function (parkName, floorName, groundName) {
            var floor = this.getFloor(parkName, floorName);
            var ground = floor.groundList.filter(function (item) {
                return item.name === groundName;
            })[0];
            return ground;
        };


    });
    app.service('personService', function () {
        var data = [
            {
                parkNo: '03401110001HFJR',
                parkData: [
                    { id: 1, type: 2, MAP_POSITION: "117.288153,31.750997", name: '张何欢', positionName: '物业工程师', personCode: 'OVU4120', phone: '13024271518' },
                    { id: 2, type: 1, MAP_POSITION: "117.289964,31.751377", name: '李二', positionName: '运营工程师', personCode: 'OVU4120', phone: '13944447891' },
                    { id: 3, type: 1, MAP_POSITION: "117.291190,31.751797", name: '宋涛', positionName: '运营工程师', personCode: 'OVU4120', phone: '13766668897' },
                    { id: 4, type: 1, MAP_POSITION: "117.291050,31.752833", name: '伍斯特', positionName: '运营工程师', personCode: 'OVU4120', phone: '13124276585' },
                    { id: 5, type: 1, MAP_POSITION: "117.287994,31.752797", name: '海风', positionName: '运营工程师', personCode: 'OVU4120', phone: '13524273663' },
                    { id: 6, type: 1, MAP_POSITION: "117.288809,31.752901", name: '王衡', positionName: '运营工程师', personCode: 'OVU4120', phone: '13624275234' },
                    { id: 7, type: 2, MAP_POSITION: "117.289077,31.75068", name: '郑文杰', positionName: '物业工程师', personCode: 'OVU4120', phone: '13824277896' },
                    { id: 8, type: 2, MAP_POSITION: "117.287806,31.751382", name: '王牛', positionName: '物业工程师', personCode: 'OVU4120', phone: '13924276639' },
                    { id: 9, type: 1, MAP_POSITION: "117.28845,31.751948", name: '刘加', positionName: '运营工程师', personCode: 'OVU4120', phone: '15924275896' },
                    { id: 10, type: 2, MAP_POSITION: "117.289101,31.751218", name: '冯源', positionName: '物业工程师', personCode: 'OVU4120', phone: '13566699877' },
                    { id: 11, type: 2, MAP_POSITION: "117.28772,31.750767", name: '何家鑫', positionName: '物业工程师', personCode: 'OVU4120', phone: '13756898752' },
                    { id: 12, type: 1, MAP_POSITION: "117.28779,31.752165", name: '刘量', positionName: '运营工程师', personCode: 'OVU4120', phone: '13155588691' },
                    { id: 13, type: 1, MAP_POSITION: "117.289169,31.752267", name: '姚总', positionName: '运营工程师', personCode: 'OVU4120', phone: '13636699875' },
                ]
            },
            {
                parkNo: '04301040001ZSRJ',
                parkData: [
                    { id: 1, type: 2, MAP_POSITION: "112.881237,28.228485 ", name: '张何欢', positionName: '物业工程师', personCode: 'OVU4120', phone: '13024271518' },
                    { id: 2, type: 1, MAP_POSITION: "112.881765,28.228245", name: '李二', positionName: '运营工程师', personCode: 'OVU4120', phone: '13944447891' },
                    { id: 3, type: 1, MAP_POSITION: "112.882336,28.228136", name: '宋涛', positionName: '运营工程师', personCode: 'OVU4120', phone: '13766668897' },
                    { id: 4, type: 1, MAP_POSITION: "112.882241,28.227266", name: '伍斯特', positionName: '运营工程师', personCode: 'OVU4120', phone: '13124276585' },
                    { id: 5, type: 1, MAP_POSITION: "112.881467,28.227412", name: '海风', positionName: '运营工程师', personCode: 'OVU4120', phone: '13524273663' },
                    { id: 6, type: 1, MAP_POSITION: "112.880754,28.228839", name: '王衡', positionName: '运营工程师', personCode: 'OVU4120', phone: '13624275234' },
                    { id: 7, type: 2, MAP_POSITION: "117.289077,31.75068", name: '郑文杰', positionName: '物业工程师', personCode: 'OVU4120', phone: '13824277896' },
                    { id: 8, type: 2, MAP_POSITION: "112.879608,28.228523", name: '王牛', positionName: '物业工程师', personCode: 'OVU4120', phone: '13924276639' },
                    { id: 9, type: 1, MAP_POSITION: "112.879391,28.227320", name: '刘加', positionName: '运营工程师', personCode: 'OVU4120', phone: '15924275896' },
                    { id: 10, type: 2, MAP_POSITION: "112.880355,28.229697", name: '冯源', positionName: '物业工程师', personCode: 'OVU4120', phone: '13566699877' },
                    { id: 11, type: 2, MAP_POSITION: "112.880474,28.229673", name: '何家鑫', positionName: '物业工程师', personCode: 'OVU4120', phone: '13756898752' },
                    { id: 12, type: 1, MAP_POSITION: "112.882258,28.230393", name: '刘量', positionName: '运营工程师', personCode: 'OVU4120', phone: '13155588691' },
                    { id: 13, type: 1, MAP_POSITION: "112.880731,28.231421", name: '姚总', positionName: '运营工程师', personCode: 'OVU4120', phone: '13636699875' },
                ]
            }
        ];
        this.getperosnInfo = function(parkNo) {
            var parkData = data.filter(function (item) {
                return item.parkNo === parkNo;
            })[0];
            return parkData;
        }

    });
    app.component('infoPanel', {
        transclude: true,
        templateUrl: '../showXW/page/component/infoPanel.html',
        bindings: {},
        controller: function () {
            var $ctrl = this;
            $ctrl.$onInit = function () { };
        }
    });

    //视频播放组件
    app.component('palyModal', {
        bindings: {
            deviceId: '<?',
            width: '<?',
            height: '<?',
            url: '<?'
        },
        templateUrl: '/showXW/page/component/vedio.html',
        controllerAs: 'vm',
        controller: function ($scope, $timeout, $http) {
            var vm = this;

            var id = 'video';
            vm.$onInit = function () {
                vm.width = vm.width || 700;
                vm.height = vm.height || 400;
            };

            vm.middle = function () {
                vm.width = 1000;
                vm.height = 650;
            };
            vm.small = function () {
                vm.width = 700;
                vm.height = 400;
            };
            vm.large = function () {
                vm.width = $(window).width();
                vm.height = $(window).height();
            };

            vm.close = function () {
                $scope.$emit('closePlay');
            };
            //监听url变化
            $scope.$watch('vm.url', function (current, prev) {
                if (angular.isDefined(current) && !angular.equals(current, prev)) {
                    if (current == '') {
                        init();
                    } else {
                        play(vm.url);
                    }
                }
            }, true);

            //监听url变化
            $scope.$watch('vm.width', function (current, prev) {
                if (angular.isDefined(current) && !angular.equals(current, prev)) {
                    init();
                }
            }, true);

            function init() {
                /*vm.data = {
                    interM3u8: 'http://116.205.13.37:2020/34020000001320000002/live/34020000001320000002.m3u8',
                    lanM3u8: "http://192.168.1.200:2020/34020000001320000002/live/local_34020000001320000002.m3u8"
                };*/
                $http.get('/ovu-screen-fake/system/video/live.do?equipmentId=' + vm.deviceId).success(function (data) {
                    play(data.interM3u8 || "http://116.205.13.37:8080/34020000001320000002/live/34020000001320000002.m3u8");
                    vm.data = data;
                })
                //play("http://116.205.13.37:2020/34020000001320000002/live/34020000001320000002.m3u8");
                //play("http://192.168.1.200:2020/34020000001320000002/live/local_34020000001320000002.m3u8");

            }
            //初始化
            $timeout(function () {
                if (vm.deviceId) {
                    init();
                } else {
                    $scope.$watch('vm.deviceId', function (current, prev) {
                        if (angular.isDefined(current) && !angular.equals(current, prev)) {
                            init();
                        }
                    }, true);
                }
            });

            function onJavaScriptBridgeCreated() { }

            function playClear() {
                // console.log('iiiii');
                play("")
            }

            function play(url) {
                var flashvars = {
                    src: escape(url),
                    controlBarAutoHide: true,
                    controlBarPosition: "bottom",
                    streamType: "vod",
                    autoPlay: true,
                    verbose: true,
                    bufferingOverlay: true,
                    plugin_m3u8: "../view/playVedio/HLSProviderOSMF.swf",
                    javascriptCallbackFunction: "onJavaScriptBridgeCreated"
                };

                var params = {
                    quality: "high",
                    allowFullScreen: true,
                    allowScriptAccess: "always",
                    bgcolor: "#000000",
                    wmode: 'opaque'
                };

                var attrs = {
                    id: id,
                    name: id,
                    align: "middle"
                };

                swfobject.embedSWF(
                    // url to SMP player
                    "../view/playVedio/StrobeMediaPlayback.swf",
                    // div id where player will be place
                    id,
                    // width, height
                    (vm.width * 0.8) || "700", (vm.height - 54) || "450",
                    // minimum flash player version required
                    "10.2",
                    // other parameters
                    null, flashvars, params, attrs
                );
            }
        }
    });

})();
