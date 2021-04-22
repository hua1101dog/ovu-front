/**
 * 自定义 angular组件
 */
(function () {
    'use strict';

    var app = angular.module("app");

    app.component('bigScreen', {
        transclude: true,
        templateUrl: '../show-fm/page/component/bigScreen.html',
        bindings: {
            gaodeData: '<',
            indoorData: '<',
            parkNo: '<',
            type: '<'
        },
        controller: ['$scope', function ($scope) {
            var $ctrl = this;
            $ctrl.$onInit = function () {
                $ctrl.showRight = true;
            };

            $ctrl.$onChanges = function (changes) {
                if (!changes.gaodeData.isFirstChange()) {
                    $scope.$broadcast('刷新高德地图', changes.gaodeData.currentValue);
                }
            };
            $scope.$on('toFlooor', function (e, data) {

            });

        }]
    });

    app.component('mapArea', {
        templateUrl: '../show-fm/page/component/mapArea.html',
        bindings: {
            gaodeData: '<',
            indoorData: '<'
        },
        controller: function ($scope, $rootScope, AppService, $state) {
            var $ctrl = this;
            $ctrl.$onInit = function () {
                // $ctrl.showGaode = true;
                // $ctrl.showIndoor = false;
                $ctrl.showGaode = false;
                $ctrl.showIndoor = true;
                $ctrl.hashState = {};
            };
            $ctrl.toIndoor = function (e) {
                // console.log(e);
                // console.log(AppService);
                // 室外摄像头 显示视频 只显示创意天地的
                // var fmapId = AppService.park.fmapId;
                // if (fmapId == 'ovuhlw' && $state.includes('app.facility.camera') && e.iconType == 'icon-service-sign-camera') {
                // console.log('显示摄像头视频');
                // console.log(AppService);
                // AppService.showVideo(1);
                // }
                // 配套
                e.iconMating && $state.go('app.company.mating.detail', {
                    id: e.iconMating
                });


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
                var state = {
                    name: e.iconName,
                    id: e.iconId
                }; // 真实数据逻辑
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

            $ctrl.$onChanges = function (changes) {};

        }
    });

    app.component('gaodeMap', {
        templateUrl: '../show-fm/page/component/gaodeMap.html',
        bindings: {
            onIconClick: '&',
            gaodeData: '<'
        },
        require: {
            bigScreen: '^^'
        },
        controller: ['$scope', '$timeout', '$state', 'gaodeMapService', 'gaodeHttpServer', 'AppService', function ($scope, $timeout, $state, mapService, httpHelper, AppService) {
            var $ctrl = this;
            // 初始化地图
            var map = new AMap.Map('map-gaode', {
                resizeEnable: true,
                // 默认先定位到2046
                center: [114.330813, 30.518567],
                zoom: 18
            });

            $ctrl.$onInit = function () {
                var parkNo = AppService.parkNo,
                    type = $ctrl.bigScreen.type;
                var parkNo = AppService.parkNo,
                    type = $ctrl.bigScreen.type;
                // 显示底部过滤器
                if ($state.includes('app.operation.equipment')) {
                    $ctrl.showBottomBar = true;
                    httpHelper.api('GET')('/equip/typelist')().then(function (res) {
                        // console.log(res.data);
                        if (res.data.success) {
                            $ctrl.equipCatoryList = res.data.data;
                        }
                    });

                    $ctrl.checkOne = function (item) {
                        item.checked = !item.checked;


                        var ids = $ctrl.equipCatoryList.filter(function (v) {

                            return v.checked;
                        }).map(function (v) {
                            return v.id;
                        }).join(',');

                        mapService.getData(parkNo, type, ids)
                            .then(function (gaodeData) {
                                mapService.renderGaode(map, gaodeData, $scope, type);
                            });
                    };

                } else if ($state.includes('app.dispatch')) {
                    console.log(123);
                    $ctrl.showBottomBar = true;
                    $ctrl.isDispatch = true;

                    httpHelper.api('GET')('/person/list.do')({
                        parkNo: parkNo,
                        type: '1,2,3,4,5'
                    }).then(function (res) {
                        if (res.data.success) {
                            $ctrl.totalNum = res.data.data.length;
                            console.log($ctrl.totalNum);
                        }
                    });
                    /* 人员图标筛选器*/
                    $ctrl.equipCatoryList = [{
                            type: 1, //人员轨迹请求参数
                            text: '管家', //人员类别
                            num: 21, //人数
                            icon: 'icon-sign_stewards', //图标样式
                            color: 'icon-color-yellow' //图标颜色
                        },
                        {
                            type: 2,
                            text: '保洁',
                            num: 21,
                            icon: 'icon-sign_cleanness',
                            color: 'icon-color-green'
                        },
                        {
                            type: 3,
                            text: '工程',
                            num: 21,
                            icon: 'icon-sign_engineering',
                            color: 'icon-color-purple'
                        },
                        {
                            type: 4,
                            text: '客服',
                            num: 21,
                            icon: 'icon-sign_service',
                            color: 'icon-color-blue'
                        },
                        {
                            type: 5,
                            text: '秩序',
                            num: 21,
                            icon: 'icon-sign_order',
                            color: 'icon-color-pink'
                        }
                    ];
                    $ctrl.checkOne = function (item) {
                        item.checked = !item.checked;

                        var ids = $ctrl.equipCatoryList.filter(function (v) {

                            return v.checked;
                        }).map(function (v) {
                            return v.type;
                        }).join(',');
                        mapService.getData(parkNo, type, ids)
                            .then(function (gaodeData) {
                                mapService.renderGaode(map, gaodeData, $scope, type);
                            });
                    };

                }

                // 获取地图数据
                mapService.getData(parkNo, type)
                    .then(function (gaodeData) {
                        // console.log('初始化高德地图######################');
                        // console.log(gaodeData);
                        if (!gaodeData || !gaodeData.area) {
                            // alert('没有后台数据');
                            // return;
                            // 高德地图数据示例
                            var defaultData = {
                                area: {
                                    parkIcon: '',
                                    center: [114.330738, 30.518678],
                                    leftDown: {
                                        lng: 117.287166,
                                        lat: 31.750199
                                    },
                                    rightUp: {
                                        lng: 117.289541,
                                        lat: 31.753128
                                    }
                                },
                                buildingList: [
                                    // {
                                    //     iconID: '111',
                                    //     position: [114.3308, 30.5187],
                                    //     iconColor: '#2A60FF',
                                    //     iconType: 'icon-map-sign-water'
                                    // }
                                ],
                                equipmentList: [{
                                    iconID: '111',
                                    position: [114.330738, 30.518678],
                                    iconColor: '#2A60FF',
                                    iconType: 'icon-map-sign-water'
                                }]
                            };
                            mapService.renderGaode(map, defaultData, $ctrl);
                            return;
                        }
                        mapService.renderGaode(map, gaodeData, $scope, type);
                        // var data = { id: gaodeData.id, name: modelNode.sensorName };

                    });

            };

            $scope.$on('刷新高德地图', function (e, data) {
                var gaodeData = data;
                mapService.renderGaode(map, gaodeData, $ctrl);
            });

            $ctrl.$onChanges = function (changes) {

            };

        }]
    });

    app.service('gaodeMapService', ['$timeout', 'iconService', 'gaodeHttpServer', '$q', 'AppService', '$compile', function ($timeout, iconService, httpHelper, $q, AppService, $compile) {

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
            // 聚焦到center坐标
            map.setCenter(center);
            map.setZoom(18);
            /* 定位不准，手动调整坐标*/
            // leftDown = new AMap.LngLat(leftDown.lng, leftDown.lat);
            leftDown = [114.329641, 30.517765];
            // rightUp = new AMap.LngLat(rightUp.lng, rightUp.lat);
            rightUp = [114.33180277811812, 30.519585420387827];

            var bounds = new AMap.Bounds(leftDown, rightUp);
            var img = new AMap.GroundImage(iconUrl, bounds, {
                map: map
            });

            window.IMG = img;

            return img;
        };

        /* 聚焦到园区*/
        this.focusPark = function (map, center) {
            map.setCenter(center);
            map.setZoom(18);

        };
        /* 画出电子围墙以及报警区域*/
        this.drawFenceAndAlarmArea = function (map, center, ptStart, ptEnd) {
            map.setCenter(center);
            map.setZoom(18);
            var greenLineArr = [
                [114.32964359986113, 30.51942829918711],
                [114.33095788227843, 30.519585420387827],
                [114.33130656945036, 30.519419056755627],
                [114.33189129101561, 30.5178986648133],
                [114.33181082474516, 30.517662978826902],
                [114.32985281216429, 30.51804654592475],
                [114.32964359986113, 30.51942829918711]
            ];
            var redLineArr = [
                [ptStart[0], ptStart[1]],
                [ptEnd[0], ptEnd[1]]
            ];
            var polylineGreen = new AMap.Polyline({
                path: greenLineArr, //设置线覆盖物路径
                strokeColor: "#50c533", //线颜色
                strokeOpacity: 0.8, //线透明度
                strokeWeight: 2, //线宽
                strokeStyle: "dashed", //线样式
                strokeDasharray: [10, 5] //补充线样式
            });
            var polylineRed = new AMap.Polyline({
                path: redLineArr, //设置线覆盖物路径
                strokeColor: "#e42836", //线颜色
                strokeOpacity: 0.8, //线透明度
                strokeWeight: 4, //线宽
                strokeStyle: "dashed", //线样式
                strokeDasharray: [10, 5] //补充线样式
            });
            polylineGreen.setMap(map);
            polylineRed.setMap(map);

            var clickEventListener = map.on('click', function (e) {
                console.log(e.lnglat);

            });
        };

        /* 初始化气泡框数据 **/
        /*  type                  value
         *  设施设备指标=》equipment           分类，名称，地址
         *  设备房=》icon-sign_operations                 名称，设备数
         *  电梯=》icon-map-sign-lift                   名称，状态，楼层，方向
         *  停车管理=》parkingLot               null
         *  水表=》icon-map-sign-water               名称，地址
         *  电表=》icon-map-sign-electricity                  名称，地址
         *  能源表=》icon-map-sign-energy                 名称，地址
         *  LORA传感器=》icon-map-sign-sensor             名称，地址
         *  电子巡更=》watch                名称，地址
         *  摄像头=》icon-service-sign-camera                 名称，地址，状态
         *  人员=》                         姓名，部门
         *  烟感=》icon-sign_fire                    名称，状态
         *  防盗报警=》alarm             名称，监测参数，监测状态
         *  门磁=》                   名称，监测参数，监测状态
         * */
        this.handleEquipData = function (data, type) {
            // console.log(type);
            var result = [];
            if (type === 'icon-map-sign-water') {
                result = [{
                        key: '设备名称',
                        value: data.name
                    },
                    {
                        key: '设备地址',
                        value: data.house_name
                    }
                ]
            } else if (type === 'icon-sign_operations') {
                console.log(data.workunit_count);
                result = [{
                        key: '设备房名称',
                        value: data.name
                    },
                    {
                        key: '设备总数',
                        value: data.workunit_count
                    }
                ]
            } else if (type === 'icon-map-sign-watch') {
                result = [{
                        key: '设备名称',
                        value: data.pname
                    },
                    {
                        key: '设备ID',
                        value: data.id
                    }
                ]
            } else if (type === 'person') {
                result = [{
                        key: '人员姓名',
                        value: data.name
                    },
                    {
                        key: '人员部门',
                        value: data.dept
                    }
                ]
            } else if (type === 'icon-sign_abnormality') {
                result = [{
                        key: '传感器名称',
                        value: data.name
                    },
                    {
                        key: '传感器类型',
                        value: data.equip_type_name
                    }
                ]
            } else if (type === 'icon-service-sign-camera') {
                var tempStr = data.name;
                var i = tempStr.indexOf('摄像机');
                tempStr = tempStr.substr(i + 3, 3);
                result = [{
                        key: '摄像机名称',
                        value: tempStr
                    },
                    {
                        key: '摄像机ID',
                        value: data.id
                    }
                ]
            } else {
                result = [{
                        key: '设备名称',
                        value: data.name
                    },
                    {
                        key: '设备ID',
                        value: data.id
                    }
                ]
            }
            return result
        };

        /* 添加equipment marker*/
        this.addEquipmentMarker = function addEquipmentMarker(map, SimpleMarker, iconType, iconName, iconColor, position, clickFn, iconData, $ctrl) {
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
                position: position,
                extData: iconData.dept
            });
            // console.log(iconMarker);

            var context = this;
            var windowInfoData = this.handleEquipData(iconData, iconType);

            /* 设备图标点击事件*/
            iconMarker.on('click', function (e) {
                $timeout(function () {
                    // 停车场禁止点击
                    if (iconType !== 'icon-map-sign-car' && iconType !== 'icon-fuwu1') {
                        clickFn && clickFn(e);
                    } else {
                        if (iconType === 'icon-fuwu1') {
                            var personName = iconData.name,
                                personPosition = iconData.positionName,
                                personNum = iconData.personCode,
                                personPhone = iconData.phone;
                            context.openInfoForService(map, position, personName, personPosition, personNum, personPhone);
                        }
                    }

                    console.log($ctrl);

                    if (iconType !== 'icon-service-sign-camera') {
                        var obj = {};
                        if (iconType === 'icon-map-sign-watch') {
                            obj.id = iconData.id;
                            obj.name = iconData.name;
                            // debugger;
                            $ctrl.$emit('toSensor', obj);
                        } else {
                            if (iconType === 'icon-sign_operations') {
                                obj.id = iconData.house_id;
                                $ctrl.$emit('toSensor', obj);
                            }
                            obj.id = iconData.id;
                            obj.name = iconData.pname;
                            // debugger;
                            $ctrl.$emit('toSensor', obj);
                        }
                    } else {
                        if (iconData.id === 1511841947207 || iconData.id === 1511841947206) {
                            AppService.showVideo(iconData.id);
                            console.log("playNo" + iconData.id);
                        }
                    }
                });
            });
            /* 设备图标鼠标移入事件*/
            iconMarker.on('mouseover', function (e) {
                $timeout(function () {
                    // debugger;
                    if (e.target.getExtData()) {
                        iconType = 'person';
                        windowInfoData = context.handleEquipData(iconData, iconType);
                        context.openWindowCommon(map, windowInfoData, position);
                    } else {
                        // console.log(iconType);
                        context.openWindowCommon(map, windowInfoData, position);
                    }
                });
            });
            iconMarker.on('mouseout', function (e) {
                $timeout(function () {
                    if (iconType === 'icon-map-sign-car') {

                    }
                    // console.log('leave...............');
                    windowInfo.close();
                });
            });
        };

        // 添加Icon marker
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
                    console.log('adsfadfafasfasfafdasfffffffffffff');
                    console.log(iconType);
                    // 停车场禁止点击
                    if (iconType !== 'icon-map-sign-car' && iconType !== 'icon-service-sign-ad') {
                        clickFn && clickFn(e);
                    } else if (iconType == 'icon-service-sign-ad') {
                        console.log(position);
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
                        console.log("####wwww");
                        var tempData = [{
                                key: "k1",
                                value: "111"
                            },
                            {
                                key: "k2",
                                value: "222"
                            },
                            {
                                key: "k3",
                                value: "333"
                            }
                        ];
                        context.openWindowCommon(map, tempData, position);

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
            var context = this;
            if (!iconList) {
                return;
            }
            iconList.forEach(function (icon) {
                if (icon.iconType) {
                    context.addEquipmentMarker(map, SimpleMarker, icon.iconType, icon.iconName, icon.iconColor, icon.position,
                        function () {
                            // $ctrl.onIconClick({
                            //     $event: {
                            //         iconId: icon.iconID,
                            //         iconName: icon.iconName,
                            //         iconType: icon.iconType,
                            //         iconMating: icon.iconMating,
                            //         iconActivity: icon.iconActivity,
                            //         iconService: icon.iconService,
                            //         iconData: icon.iconData
                            //     }
                            // });
                        }, icon.iconData, $ctrl);
                }

                // console.log(icon.iconData);
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
        this.renderGaode = function (map, gaodeData, $ctrl, type) {
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

            this.focusPark(map, center);

            var typeFlag = type;
            if (typeFlag === "rail") {
                var alarmPt1 = [114.32964359986113, 30.51942829918711];
                var alarmPt2 = [114.33095788227843, 30.519585420387827];
                this.drawFenceAndAlarmArea(map, center, alarmPt1, alarmPt2);
            }
            var url = "/show-fm/res/img/2046map.png";
            this.focusAndDrawParkIcon(map, center, leftDown, rightUp, url);

            // 绘制icon图标
            AMapUI.loadUI(['overlay/SimpleMarker'], function (SimpleMarker) {

                var equipmentList = gaodeData.equipmentList;

                console.log('设备列表');
                console.log(equipmentList);

                context.addEquipmentMarkerList(map, SimpleMarker, equipmentList, $ctrl);

            });
        };

        // 获取数据
        this.getData = function (parkNo, type, equipTypeIds) {
            // 获取高德地图数据
            return $q(function (resolve, reject) {
                var gaodeData;
                var typeFlag; //设备类型标识位
                //设置buildingList数据
                httpHelper
                    .api('GET')('/park/get')({
                        parkNo: parkNo
                    })
                    .then(function (result) {
                        // console.log('园区data---------');
                        // console.log(result);
                        gaodeData = postGetParkMap(result.data);
                        //设备房
                        if (type === 'equipmentRoom') {
                            return httpHelper.api('GET')('/equiphouse/list')({
                                parkNo: parkNo
                            });
                        }
                        //设施设备指标
                        if (type === 'equipment') {
                            return httpHelper.api('GET')('/equip/list')({
                                parkNo: parkNo,
                                equipTypeIds: equipTypeIds
                            });
                        }
                        //电子巡更
                        if (type === 'watch') {
                            return httpHelper.api('GET')('/getPatrolPoint')({
                                parkNo: parkNo
                            });
                        }
                        // 调度指挥中心
                        if (type === 'dispatch') {
                            return $q.all([

                                /* 换成异常设备接口*/
                                httpHelper.api('GET')('/sensorAlertList.do')({
                                    parkNo: parkNo,
                                    type: 'sensor'
                                }),
                                httpHelper.api('GET')('/person/list.do')({
                                    parkNo: parkNo,
                                    type: equipTypeIds || '1,2,3,4,5'

                                })
                                // httpHelper.api('GET')('/person/list.do')({
                                //     parkNo: parkNo,
                                //     type: equipTypeIds || '1,2,3,4,5'
                                // })
                            ]);
                        }
                        return httpHelper.api('GET')('/equip/list')({
                            parkNo: parkNo,
                            type: type
                        });
                    })
                    .then(function (result) {

                        console.log("####creep####");
                        console.log(result);

                        var obj = {};
                        if (type === 'dispatch') {

                            var filterEqutList = [];

                            result[0].data.data.forEach(function (da) {
                                if (da.is_regular !== 1) {
                                    filterEqutList.push(da);
                                }
                            });

                            var resData = angular.merge([], result[1].data.data);
                            resData = resData.concat(filterEqutList);
                            var tempObj = {
                                data: resData
                            };
                            console.log('merge@@@@@@@@@@@@@@@@@@@@@@@@@');
                            console.log(tempObj);
                            obj.equipmentList = postGetListMap4Person(tempObj);
                            gaodeData = angular.merge(gaodeData, obj);
                            // console.log(gaodeData);
                            resolve(gaodeData);
                        } else {
                            if (type === "parkingLot") {
                                obj.equipmentList = postGetListMap4Parking(result.data);
                                gaodeData = angular.merge(gaodeData, obj);
                                resolve(gaodeData);
                            } else {
                                if (type === "equipmentRoom") {
                                    obj.equipmentList = postGetListMap4EqRoom(result.data);
                                    gaodeData = angular.merge(gaodeData, obj);
                                    resolve(gaodeData);
                                } else {
                                    if (type === "watch") {
                                        obj.equipmentList = postGetListMap4Watch(result.data);
                                        gaodeData = angular.merge(gaodeData, obj);
                                        resolve(gaodeData);
                                    } else {
                                        obj.equipmentList = postGetListMap4Equipment(result.data);
                                        gaodeData = angular.merge(gaodeData, obj);
                                        resolve(gaodeData);
                                    }
                                }
                            }
                        }
                    });
            });

            // map园区数据格式化
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
                    }
                }
            }
            // iconColor = iconService.getColor('ovuRed');  // 设备状态异常显示红色
            // iconColor = iconService.getColor('ovuBlue'); // 设备状态正常显示蓝色
            /* 获取设备图标数据_公用方法*/
            function postGetListMap4Equipment(backData) {
                var arrFilter = backData.data.filter(function (v) {
                    return v.latitude_
                });
                var arr = arrFilter.map(function (v) {
                    var iconColor;
                    if (v.equip_status && v.equip_status !== 1) {
                        if (v.sensor_status && v.sensor_status === 1) {
                            iconColor = iconService.getColor('ovuBlue');
                        } else {
                            iconColor = iconService.getColor('ovuRed');
                        }
                    } else {
                        iconColor = iconService.getColor('ovuBlue');
                    }

                    if (v.equip_type === 'camera') {
                        if (v.id === 1511841947207 || v.id === 1511841947206) {
                            iconColor = iconService.getColor('ovuBlue');
                        } else {
                            iconColor = iconService.getColor('ovuGray');
                        }
                    }

                    var position = [v.longitude_, v.latitude_];
                    return {
                        iconID: v.id,
                        position: [parseFloat(position[0]), parseFloat(position[1])],
                        iconType: iconService.getType(v.equip_type),
                        iconColor: iconColor,
                        iconName: v.name,
                        iconData: v
                    }
                });
                return arr;
            }

            /* 获取设备图标数据_专为停车场*/
            function postGetListMap4Parking(backData) {
                var arrFilter = backData.data.filter(function (v) {
                    return v.latitude_
                });
                var arr = arrFilter.map(function (v) {
                    var position = [v.longitude_, v.latitude_];
                    var parkType;
                    var iconColor;
                    if (v.equip_status && v.equip_status !== 1) {
                        if (v.sensor_status && v.sensor_status === 1) {
                            (v.equip_simple_name == '入口设备') ? iconColor = iconService.getColor('ovuGreen'): iconColor = iconService.getColor('ovuBlue');
                            (v.equip_simple_name == '入口设备') ? parkType = iconService.getType('parkingLotIn'): parkType = iconService.getType('parkingLotOut');
                        } else {
                            iconColor = iconService.getColor('ovuRed');
                            (v.equip_simple_name == '入口设备') ? parkType = iconService.getType('parkingLotIn'): parkType = iconService.getType('parkingLotOut');
                        }
                    } else {
                        (v.equip_simple_name == '入口设备') ? iconColor = iconService.getColor('ovuGreen'): iconColor = iconService.getColor('ovuBlue');
                        (v.equip_simple_name == '入口设备') ? parkType = iconService.getType('parkingLotIn'): parkType = iconService.getType('parkingLotOut');
                    }
                    // if (v.equip_simple_name === '入口设备') {
                    //     parkType = iconService.getType('parkingLotIn');
                    //     iconColor = iconService.getColor('ovuGreen');
                    // } else {
                    //     parkType = iconService.getType('parkingLotOut');
                    // }
                    return {
                        iconID: v.id,
                        position: [parseFloat(position[0]), parseFloat(position[1])],
                        iconType: parkType,
                        iconColor: iconColor,
                        iconName: v.name,
                        iconData: v
                    }
                });
                return arr;
            }

            /* 获取设备图标数据_专为设备房*/
            function postGetListMap4EqRoom(backData) {
                var arrFilter = backData.data.filter(function (v) {
                    return v.latitude_
                });
                var arr = arrFilter.map(function (v) {
                    var iconColor = iconService.getColor('ovuBlue'); // 设备状态正常显示蓝色
                    var position = [v.longitude_, v.latitude_];
                    var parkType = iconService.getType('equiphouse');
                    return {
                        iconID: v.id,
                        position: [parseFloat(position[0]), parseFloat(position[1])],
                        iconType: parkType,
                        iconColor: iconColor,
                        iconName: v.name,
                        iconData: v
                    }
                });
                return arr;
            }

            /* 获取设备图标数据_专为电子巡更*/
            function postGetListMap4Watch(backData) {
                var arrFilter = backData.data.filter(function (v) {
                    return v.maplng
                });
                var arr = arrFilter.map(function (v) {
                    var iconColor = iconService.getColor('ovuBlue'); // 设备状态正常显示蓝色
                    var position = [v.maplng, v.maplnt];
                    var parkType = iconService.getType('watch');
                    return {
                        iconID: v.id,
                        position: [parseFloat(position[0]), parseFloat(position[1])],
                        iconType: parkType,
                        iconColor: iconColor,
                        iconName: v.pname,
                        iconData: v
                    }
                });
                return arr;
            }

            /* 获取设备图标数据_专为人员轨迹*/
            function postGetListMap4Person(backData) {
                // debugger;
                var arrFilter = backData.data.filter(function (v) {
                    return v.latitude_
                });
                var arr = arrFilter.map(function (v) {
                    var iconColor = iconService.getColor('ovuBlue'); // 设备状态正常显示蓝色
                    var position = [v.longitude_, v.latitude_];
                    var parkType;
                    var personType;

                    if (v.equip_type) {
                        iconColor = iconService.getColor('ovuRed');
                        parkType = iconService.getType('abnormality');
                    } else {
                        personType = v.dept;
                        // console.log(personType);
                        if (personType === '物业部') {
                            parkType = iconService.getType('stewards');
                        } else if (personType === '保洁部') {
                            parkType = iconService.getType('cleanness');
                        } else if (personType === '蓝域' || personType === '工程部') {
                            parkType = iconService.getType('engineering');
                        } else if (personType === '秩序部') {
                            parkType = iconService.getType('order');
                        } else if (personType === '客服部') {
                            parkType = iconService.getType('service');
                        }
                        // console.log(parkType);
                    }

                    //管家 物业
                    //保洁 保洁
                    //工程 蓝域，工程
                    //客服 客服
                    //秩序 秩序

                    return {
                        iconID: "",
                        position: [parseFloat(position[0]), parseFloat(position[1])],
                        iconType: parkType,
                        iconColor: iconColor,
                        iconName: v.name,
                        iconData: v
                    }
                });
                return arr;
            }

        };

        /* 公用方法创建信息窗体*/
        this.openWindowCommon = function (map, data, position) {
            var str, info, temp, infoWindow, i;
            // info = [];
            str = "";
            if (data.length) {
                for (i = 0; i < data.length; i++) {
                    // info.push({key:data[i].key,value:data[i].value});
                    temp = "<div class='col-sm-6 text-md font-bold text-right'>" + data[i].key + ":</div>" +
                        "<div class='col-sm-6 spantext lineHeight2 text-left'>" + data[i].value + "</div>";
                    str = str + temp;
                }
            }
            // console.log(info);
            // str = $compile("<div class='col-sm-12 m-b' style='width:200px;padding:5px;'>" +
            //     "<div class=' col-sm-12' >" +
            //     "<div class='col-sm-6 text-md font-bold text-right' ng-repeat='item in info'>{{info.key}}</div>" +
            //     "<div class='col-sm-6 spantext lineHeight2 text-left' ng-repeat='item in info'>{{info.value}}</div>" +
            //     "</div>" +
            //     "</div>");
            str = "<div class=' col-sm-12' >" + str + "</div>";
            // console.log(str);
            infoWindow = new AMap.InfoWindow({
                content: str,
                offset: new AMap.Pixel(5, -15)
            });
            infoWindow.open(map, position);
            windowInfo = infoWindow;
        };


    }]);

    app.service('gaodeHttpServer', ['$http', function ($http) {
        var baseUrl = '/ovu-screen/pcos/show';
        this.api = function (method) {
            return function (url) {
                return function (data) {
                    var realUrl = baseUrl + url;
                    if (method === 'GET') {
                        return $http.get(realUrl, {
                            params: data
                        });
                    } else {
                        // 需要main.html引进filter.js文件
                        // return $http.post(realUrl, data, fac.postConfig);
                    }
                }
            };
        };

    }]);

    app.service('iconService', function () {
        var grayColor = '#8b929e';
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
                parkingLot: 'icon-sign_out', // 停车
                parkingLotIn: 'icon-sign_come', // 停车
                parkingLotOut: 'icon-sign_out', // 停车
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
                watch: 'icon-map-sign-watch', // 电子巡更
                person: 'icon-fuwu1', //人员
                ovuAccess: '', // 园区门禁管理
                equiphouse: 'icon-sign_operations', //设备房
                temperature: 'icon-map-sign-fire', //温度传感器
                smoke: 'icon-sign_fire', //烟感传感器
                waterLevel: '', //"液位传感器"],
                abnormality: 'icon-sign_abnormality', //"液位传感器"],
                stewards: 'icon-sign_stewards', //管家
                cleanness: 'icon-sign_cleanness', //保洁
                engineering: 'icon-sign_engineering', //工程
                order: 'icon-sign_order', //秩序
                service: 'icon-sign_service', //客服
                pressure: '', //"压力传感器"],
                current: '', //"电流阈值传感器"],
                electric: '' //"电参数综合传感器"]
            };
        };

        this.getType = function (name) {
            var allType = this.getAllType();
            if (!allType[name]) {
                console.log('UI未提供' + name + 'icon!');
                return 'icon-red';
            }
            return allType[name];
        };
    });

    app.component('indoorMap', {
        templateUrl: '../show-fm/page/component/indoorMap.html',
        bindings: {
            onBackToGaode: '&',
            indoorData: '<'
        },
        require: {
            mapArea: '^^',
            bigScreen: '^^'
        },
        //controller: ['$scope', '$rootScope', '$timeout', '$http', 'AppService', function($scope, $rootScope, $timeout, $http, AppService) {
        controller: ['$scope', '$rootScope', 'gaodeHttpServer', '$timeout', '$http', 'AppService', '$state', '$q', function ($scope, $rootScope, httpHelper, $timeout, $http, AppService, $state, $q) {
            var $ctrl = this;
            var imgBaseUrl = '/show-ems/res/img/indoor-icon/';
            var personNum = [0,0,0,0];
            var isInit = true;
            $ctrl.$onInit = function () {
                /* 室内地图start */
                // 获取地图数据
                var parkNo = AppService.parkNo,
                    type = $ctrl.bigScreen.type,
                    dataOther = [],
                    position = {},
                    content = null,
                    eqList = [],
                    ids = type == "equipment" ? "" : "1,2,3,4";
                // 判断是调度指挥中心还是运营指标体系
              if ($state.includes('app.facility.equipment')) {
                $ctrl.showBottomBar = true;
                httpHelper.api('GET')('/equip/typelist')().then(function (res) {
                  if (res.data.success) {
                    $ctrl.equipCatoryList = res.data.data;
                  }
                });
              } else if ($state.includes('app.dispatch')) {
                $ctrl.showBottomBar = true;
                $ctrl.isDispatch = true;
                $ctrl.equipCatoryList = [{
                  type: 1,
                  text: '管家',
                  num: 0,
                  icon: 'icon-sign_stewards',
                  color: 'icon-color-yellow'
                }, {
                  type: 2,
                  text: '保洁',
                  num: 0,
                  icon: 'icon-sign_cleanness',
                  color: 'icon-color-green'
                }, {
                  type: 3,
                  text: '工程',
                  num: 0,
                  icon: 'icon-sign_engineering',
                  color: 'icon-color-purple'
                },
                // {
                //   type: 4,
                //   text: '客服',
                //   num: 0,
                //   icon: 'icon-sign_service',
                //   color: 'icon-color-blue'
                // },
                {
                  type: 4,
                  text: '秩序',
                  num: 0,
                  icon: 'icon-sign_order',
                  color: 'icon-color-pink'
                }];
              }

              $ctrl.checkOne = function (item) {
                item.checked = !item.checked;
                ids = $ctrl.equipCatoryList.filter(function (v) {
                  return v.checked;
                }).map(function (v) {
                  if (v.id) {
                    return v.id;
                  } else if (v.type) {
                    return v.type;
                  }
                }).join(',');
                if (type == "equipment") {
                  mapEquipment();
                } else if (type == "dispatch") {
                  mapDispatch();
                }
              };

              // 接收 气泡事件
              $scope.$on("showBubble", function (event, obj) {
                for (var i = 0; i < eqList.length; i++) {
                  if (obj.id == eqList[i].id) {
                    var info = typeField(eqList[i].mapTitle, eqList[i].info);
                    var n = map.addInfoWindow({
                      content: createContent(info), //传入前端样式
                      id: obj.id,
                    });
                  }
                }

              });

              $scope.$on("showPerson", function (event, obj) {
                // 清空 地图小图标数据
                dataOther = [];

                obj.forEach(function (value,index) {

                  if (value.map_lat && value.map_lng) {
                    // 修正经纬度坐标偏差 for 丽岛2046
                    value.map_lat = Number.parseFloat(value.map_lat) + 0.00025842186953;
                    value.map_lng = Number.parseFloat(value.map_lng) - 0.0003591393113;
                    position = {
                      type: "Position",
                      sType: type,
                      name: value.name,
                      id: index+'person',
                      dinates: AirocovMap.Utils.GPS.gcj_decrypt_exact(value.map_lat, value.map_lng),
                      info: value,
                      logo: imgBaseUrl + "sign_trajectory.png"
                    };
                    position.mapTitle = {
                      name: "name",
                      id: "dept_name",
                      titleName: "人员姓名",
                      titleId: "人员部门"

                    };
                    dataOther.push(position);
                  }
                });
                mapRender(dataOther);
              });

              //设备运维中心 、 项目安全中心
              var mapElevator = function () {
                var prams = {},
                  url = null;
                if (type == "equipmentRoom") {
                  prams = {
                    parkNo: parkNo
                  };
                  url = "/equiphouse/list";
                } else if (type == "watch") {
                  prams = {
                    parkNo: parkNo
                  };
                  url = "/getPatrolPoint"
                } else {
                  prams = {
                    parkNo: parkNo,
                    type: type
                  };
                  url = '/equip/list';
                }
                httpHelper.api('GET')(url)(prams).then(function (res) {
                  eqList=[];
                  console.log(res.data.data);
                  if (res.data.data) {
                    dataOther = [];
                    res.data.data.forEach(function (value) {
                      if(!value.latitude_){
                        return;
                      }
                      if (type == "watch") {
                        // 电子巡更
                        if (value.maplnt && value.maplng) {
                          value.maplnt = Number.parseFloat(value.maplnt) + 0.00025842186953;
                          value.maplng = Number.parseFloat(value.maplng) - 0.0003591393113;
                          position = {
                            type: "Position",

                            sType: type,
                            dinates: AirocovMap.Utils.GPS.gcj_decrypt_exact(value.maplnt, value.maplng),
                            info: value,
                            id: value.id
                          };
                          console.log(value);
                          if (value.patrolStatus == 1) {
                            position.logo = imgBaseUrl + "sign_watchman.png";
                          } else {
                            position.logo = imgBaseUrl + "sign_watchman_n.png";
                          }
                          position.mapTitle = {
                            name: "pname",
                            id: "id"
                          }
                        }
                      } else {
                        value.latitude_ = Number.parseFloat(value.latitude_) + 0.00025842186953;
                        value.longitude_ = Number.parseFloat(value.longitude_) - 0.0003591393113;
                        if (value.latitude_ && value.longitude_) {
                          position = {
                            type: "Position",
                            sType: type,
                            dinates: AirocovMap.Utils.GPS.gcj_decrypt_exact(value.latitude_, value.longitude_),
                            info: value,
                            id: value.id
                          };
                          if (type == "equipmentRoom") {
                            // 设备房
                            var param=[];
                            value.params.forEach(function(pa){
                              param.push({name:pa.param_name,value:pa.val+(pa.unit || '')});
                            });
                            position.logo = imgBaseUrl + "sign_operations.png";
                            position.mapTitle = {
                              name: "app_name",
                              id: "id",
                              param : param
                            }
                          } else if (type == "elevator") {
                            // 电梯
                            //如果设备异常
                            if(value.equip_status != 1){
                              position.logo = imgBaseUrl + "sign_abnormality.png";
                            }else if (value.params && value.params.length > 0){
                              //如果设备有监测参数
                              var pa =  value.params;
                              var filter = pa.filter(function (p) {
                                return p.param_code == "directionInt";
                              });
                              var val = filter[0] && filter[0].val;
                              if(val == '等客'){
                                position.logo = imgBaseUrl + "sign_wait.png";
                              }else if(val == '上行'){
                                position.logo = imgBaseUrl + "sign_up.png";
                              }else {
                                position.logo = imgBaseUrl + "sign_down.png";
                              }
                            }else {
                              //否则是正常的电梯
                              position.logo = imgBaseUrl + "6.png";
                            }
                            position.mapTitle = {
                              name: "app_name",
                              id: "id"
                            }
                          } else if (type == "parkingLot") {
                            // 停车管理
                            if (value.equip_simple_name == "入口设备") {
                              console.log(value);
                              if (value.equip_status == 1) {
                                position.logo = imgBaseUrl + "sign_come.png";
                              } else {
                                position.logo = imgBaseUrl + "sign_come_n.png";
                              }

                            } else {
                              if (value.equip_status == 1) {
                                position.logo = imgBaseUrl + "sign_out.png";
                              } else {
                                position.logo = imgBaseUrl + "sign_out_n.png";
                              }
                            }
                            position.mapTitle = {
                              name: "app_name",
                              id: "id"
                            }
                          } else if (type == "waterMeter") {
                            // 水表
                            if (value.equip_status == 1) {
                              position.logo = imgBaseUrl + "sign_water.png";
                            } else {
                              position.logo = imgBaseUrl + "sign_water_n.png";
                            }

                            position.mapTitle = {
                              titleName: "设备名称",
                              titleId: "设备地址",
                              name: "app_name",
                              id: "house_name",
                              param:[{name:"月使用量",value:"3589m³"}]
                            }

                          } else if (type == "ammeter") {
                            // 电表
                            if (value.equip_status == 1) {
                              position.logo = imgBaseUrl + "3.png";
                            } else {
                              position.logo = imgBaseUrl + "sign_electricity_n.png";
                            }
                            position.mapTitle = {
                              name: "app_name",
                              id: "id",
                              param:[{name:"月使用量",value:"3589kW·h"}]
                            }
                          } else if (type == "energy") {
                            // 能源表
                            if (value.equip_status == 1) {
                              position.logo = imgBaseUrl + "sign_energy1.png";
                            } else {
                              position.logo = imgBaseUrl + "sign_energy_n.png";
                            }
                            position.mapTitle = {
                              name: "app_name",
                              id: "id"
                            }

                          } else if (type == "sensor") {
                            // 传感器
                            console.log(value);
                            if (value.equip_type == "gate") {
                              if (value.equip_status == 1) {
                                if (value.sensor_status && value.sensor_status!=1){
                                  position.logo = imgBaseUrl + "sign_abnormality.png";
                                }else {
                                  position.logo = imgBaseUrl + "2.png";
                                }
                              } else {
                                position.logo = imgBaseUrl + "access_null.png";
                              }
                            } else if (value.equip_type == "waterLevel") {
                              if (value.equip_status == 1) {
                                if (value.sensor_status && value.sensor_status!=1){
                                  position.logo = imgBaseUrl + "sign_abnormality.png";
                                }else {
                                  position.logo = imgBaseUrl + "sign_sensors.png";
                                }
                              } else {
                                position.logo = imgBaseUrl + "sign_sensors_null.png";
                              }
                            } else if (value.equip_type == "smoke") {
                              if (value.equip_status == 1) {
                                if (value.sensor_status && value.sensor_status!=1){
                                  position.logo = imgBaseUrl + "sign_abnormality.png";
                                }else {
                                  position.logo = imgBaseUrl + "icon-fire.png";
                                }
                              } else {
                                position.logo = imgBaseUrl + "icon-fire-.png";
                              }
                            } else if (value.equip_type == 'infrared') {
                              if (value.equip_status == 1) {
                                if (value.sensor_status && value.sensor_status!=1){
                                  position.logo = imgBaseUrl + "sign_abnormality.png";
                                }else {
                                  position.logo = imgBaseUrl + "sign_alarm.png";
                                }

                              } else {
                                position.logo = imgBaseUrl + "sign_alarm-_null.png";
                              }
                            }

                            position.mapTitle = {
                              name: "app_name",
                              id: "id"
                            }
                          } else if (type == "rail") {
                            // 电子围栏
                            position.logo = imgBaseUrl + "sign_alarm.png";
                            position.mapTitle = {
                              name: "app_name",
                              id: "equip_code"
                            }
                          } else if (type == "alarm") {
                            // 防盗报警
                            if (value.equip_type == 'infrared') {
                              position.info.equip_type_name="红外传感器";
                              position.mapTitle = {
                                name: "name",
                                id: "equip_type_name",
                                titleName: "传感器名称",
                                titleId: "传感器类型"
                              };
                              if (value.equip_status == 1) {
                                position.logo = imgBaseUrl + "sign_alarm.png";
                              } else {
                                position.logo = imgBaseUrl + "sign_alarm-_null.png";
                              }
                            } else if(value.equip_type == 'gate'){
                              position.logo = imgBaseUrl + "sign_abnormality.png";
                              position.info.equip_type_name="门禁传感器";
                              position.mapTitle = {
                                name: "name",
                                id: "equip_type_name",
                                titleName: "传感器名称",
                                titleId: "传感器类型"
                              };
                            } else {
                              position.mapTitle = {
                                titleName: "摄像机名称",
                                titleId: "摄像机位置",
                                name: "app_name",
                                id: "loc_simple_name"
                              };
                              if (value.id == 1511841947207 || value.id == 1511841947206) {
                                position.logo = imgBaseUrl + "5.png";
                              } else {
                                position.logo = imgBaseUrl + "5.png"
                              }
                            }
                          } else if (type == "gate") {
                            // 门禁管理
                            if (value.equip_status == 1) {
                              position.logo = imgBaseUrl + "2.png";
                            } else {
                              position.logo = imgBaseUrl + "access_a.png";
                            }
                            position.mapTitle = {
                              name: "app_name",
                              id: "id"
                            }
                          } else if (type == "camera") {
                            // 摄像头
                            if (value.id == 1511841947207 || value.id == 1511841947206) {
                              position.logo = imgBaseUrl + "5.png";
                            } else {
                              position.logo = imgBaseUrl + "5.png"
                            }
                            position.mapTitle = {
                              titleName: "摄像机名称",
                              titleId: "摄像机位置",
                              name: "app_name",
                              id: "loc_simple_name"
                            }
                          } else if (type == "fire") {
                            // 消防系统
                            if (value.equip_status == 1) {
                              position.logo = imgBaseUrl + "icon-fire.png";
                            } else {
                              position.logo = imgBaseUrl + "fire_null.png";
                            }
                            position.mapTitle = {
                              name: "app_name",
                              id: "id"
                            }
                          }
                        }
                      }
                      dataOther.push(position);
                      eqList.push(position);
                    });
                    mapRender(dataOther);
                  }
                });
              };

              //调度指挥中心
              var mapDispatch = function () {
                $ctrl.cameraShow = true;
                var sensor = {},
                  personList = {},
                  cameraList = {};

                personList = getDispatch({
                  parkNo: parkNo,
                  type: ids
                }, "/person/list.do");

                personList.then(function (res) {
                  var ipeople = res.data.data;
                  if (ipeople && isInit){
                    ipeople.forEach(function (value) {
                      if (value.dept.indexOf("物业") != -1 || value.dept.indexOf("客服") != -1) {
                        personNum[0]++;
                      } else if (value.dept.indexOf("保洁") != -1) {
                        personNum[1]++;
                      } else if (value.dept.indexOf("工程") != -1 || value.dept.indexOf("蓝域") != -1) {
                        personNum[2]++;
                      } else if (value.dept.indexOf("秩序") != -1 || value.dept.indexOf("白班") != -1 || value.dept.indexOf("夜班") != -1 || value.dept.indexOf("中班") != -1) {
                        personNum[3]++;
                      }
                    });
                    isInit = false;
                  }
                });

                sensor = getDispatch({
                  parkNo: parkNo,
                  type: "sensor"
                }, "/sensorAlertList.do");

                cameraList = getDispatch({
                  parkNo: parkNo,
                  type: "camera"
                }, "/equip/list.do");
                if (flag){
                  $q.all([personList, sensor, cameraList]).then(function (res) {
                    dataOther = [];
                    eqList = [];
                    //各种部门的人员数，依次为管家，保洁，工程，客服，秩序。
                    // var personNum=[0,0,0,0,0];
                    res.forEach(function (list, indexOne) {
                      list.data.data && list.data.data.forEach(function (value, indexTwo) {
                        if (value.latitude_ && value.longitude_) {

                          // if(value.dept && value.dept.indexOf("服务中心") != -1){
                          //   return;
                          // }
                          var myDept;
                          if(value.dept === "白班" || value.dept === "中班" || value.dept === "夜班"){
                            myDept = "秩序部"
                          }else{
                            myDept = value.dept;
                          }
                          var lat = Number.parseFloat(value.latitude_) + 0.00265842186953;
                          var lon = Number.parseFloat(value.longitude_) - 0.0058591393113;
                          var tempVal = {
                            dept: myDept,
                            latitude_: lat,
                            longitude_: lon,
                            name: value.name
                          };
                          if (value.dept){
                            position = {
                              type: "Position",
                              sType: type,
                              dinates: [lon, lat],
                              info: tempVal,
                              logo: imgBaseUrl + "sign_stewards.png"
                            };
                          }else {
                            position = {
                              type: "Position",
                              sType: type,
                              dinates: [lon, lat],
                              info: value,
                              logo: imgBaseUrl + "sign_stewards.png"
                            };
                          }

                          if (value.val) {
                            position.logo = imgBaseUrl + "sign_abnormality.png";
                            position.id = value.id;
                            position.mapTitle = {
                              name: "name",
                              id: "equip_type_name",
                              titleName: "传感器名称",
                              titleId: "传感器类型"
                            };
                            eqList.push(position);
                          } else if (value.dept) {
                            // /人员相关
                            position.id = indexOne.toString() + indexTwo.toString();
                            position.mapTitle = {
                              name: "name",
                              id: "dept",
                              titleName: "人员姓名",
                              titleId: "人员部门"
                            };
                            img(value.dept);

                          } else {
                            //摄像头
                            if (value.equip_type) {
                              img(value.equip_type, value)
                            }
                            position.id = value.id;
                            position.mapTitle = {
                              titleName: "摄像机名称",
                              titleId: "摄像机位置",
                              name: "app_name",
                              id: "loc_simple_name"
                            }
                          }
                          dataOther.push(position);
                        }
                      })
                    });
                    mapRender(dataOther);
                    //给每个部门的人依次赋值
                    $ctrl.equipCatoryList.forEach(function (t,index) {
                      t.num = personNum[index];
                    });
                    //计算总在线人数
                    $ctrl.totalNum = personNum.reduce(function(prev,curr){
                      return prev+curr;
                    })
                  })
                }else {
                  $q.all([personList, sensor]).then(function (res) {
                    dataOther = [];
                    eqList = [];
                    //各种部门的人员数，依次为管家，保洁，工程，客服，秩序。
                    // var personNum=[0,0,0,0,0];
                    res.forEach(function (list, indexOne) {
                      list.data.data && list.data.data.forEach(function (value, indexTwo) {
                        if (value.latitude_ && value.longitude_) {

                          // if(value.dept && value.dept.indexOf("服务中心") != -1){
                          //   return;
                          // }
                          var myDept;
                          if(value.dept === "白班" || value.dept === "中班" || value.dept === "夜班"){
                            myDept = "秩序部"
                          }else{
                            myDept = value.dept;
                          }
                          var lat = Number.parseFloat(value.latitude_) + 0.00265842186953;
                          var lon = Number.parseFloat(value.longitude_) - 0.0058591393113;
                          var tempVal = {
                            dept: myDept,
                            latitude_: lat,
                            longitude_: lon,
                            name: value.name
                          };
                          if (value.dept){
                            position = {
                              type: "Position",
                              sType: type,
                              dinates: [lon, lat],
                              info: tempVal,
                              logo: imgBaseUrl + "sign_stewards.png"
                            };
                          }else {
                            position = {
                              type: "Position",
                              sType: type,
                              dinates: [lon, lat],
                              info: value,
                              logo: imgBaseUrl + "sign_stewards.png"
                            };
                          }

                          if (value.val) {
                            position.logo = imgBaseUrl + "sign_abnormality.png";
                            position.id = value.id;
                            position.mapTitle = {
                              name: "name",
                              id: "equip_type_name",
                              titleName: "传感器名称",
                              titleId: "传感器类型"
                            };
                            eqList.push(position);
                          } else if (value.dept) {
                            // /人员相关
                            position.id = indexOne.toString() + indexTwo.toString();
                            position.mapTitle = {
                              name: "name",
                              id: "dept",
                              titleName: "人员姓名",
                              titleId: "人员部门"
                            };
                            img(value.dept);

                          } else {
                            //摄像头
                            if (value.equip_type) {
                              img(value.equip_type, value)
                            }
                            position.id = value.id;
                            position.mapTitle = {
                              titleName: "摄像机名称",
                              titleId: "摄像机位置",
                              name: "app_name",
                              id: "loc_simple_name"
                            }
                          }
                          dataOther.push(position);
                        }
                      })
                    });
                    mapRender(dataOther);
                    //给每个部门的人依次赋值
                    $ctrl.equipCatoryList.forEach(function (t,index) {
                      t.num = personNum[index];
                    });
                    //计算总在线人数
                    $ctrl.totalNum = personNum.reduce(function(prev,curr){
                      return prev+curr;
                    })
                  })
                }
              };
              var getDispatch = function (params, url) {
                return httpHelper.api('GET')(url)(params);
              };
              //运营指标体系
              var mapEquipment = function () {
                var params = {};
                if (0 < ids.length) {
                  params = {
                    parkNo: parkNo,
                    equipTypeIds: ids
                  }
                } else {
                  params = {
                    parkNo: parkNo
                  }
                }
                httpHelper.api('GET')('/equip/list')(params).then(function (res) {
                  dataOther = [];
                  res.data.data.forEach(function (value) {
                    //  console.log(value)
                    if (value.latitude_ && value.longitude_) {
                      var lat = Number.parseFloat(value.latitude_) + 0.00265842186953;
                      var lon = Number.parseFloat(value.longitude_) - 0.0058591393113;
                      position = {
                        type: "Position",
                        sType: type,
                        dinates: [lon, lat],
                        info: value,
                        id: value.id
                      };
                      if (value.equip_type) {
                        img(value.equip_type, value)
                      }
                      if (value.equip_type == "camera") {
                        position.mapTitle = {
                          titleName: "摄像机名称",
                          titleId: "摄像机位置",
                          name: "app_name",
                          id: "loc_simple_name"
                        }
                      } else {
                        position.mapTitle = {
                          name: "app_name",
                          id: "id"
                        }
                      }
                      dataOther.push(position);
                    }
                  });
                  mapRender(dataOther);
                })
              };

              //m门禁管理，需要摄像头和门禁的数据
              var mapEquip2Camera = function (cameraFlag) {
                $ctrl.cameraShow = true;
                var sensor = {},
                  cameraList = {};
                sensor = getDispatch({
                  parkNo: parkNo,
                  type: type
                }, "/equip/list.do");

                if (cameraFlag){
                  cameraList = getDispatch({
                    parkNo: parkNo,
                    type: "camera"
                  }, "/equip/list.do");
                  $q.all([sensor, cameraList]).then(function (res) {
                    dataOther = [];
                    res.forEach(function (list, indexOne) {
                      list.data.data.forEach(function (value, indexTwo) {
                        if (value.latitude_ && value.longitude_) {
                          var lat = Number.parseFloat(value.latitude_) + 0.00265842186953;
                          var lon = Number.parseFloat(value.longitude_) - 0.0058591393113;
                          position = {
                            type: "Position",
                            sType: type,
                            dinates: [lon, lat],
                            info: value,
                            id :value.id
                          };

                          if (type === 'alarm'){
                            // 防盗报警
                            if (value.equip_status == 1) {
                              position.logo = imgBaseUrl + "sign_abnormality.png";
                            } else {
                              position.logo = imgBaseUrl + "sign_alarm-_null.png";
                            }
                            position.mapTitle = {
                              name: "app_name",
                              id: "id"
                            }
                            if(value.equip_type == 'camera') {
                              //摄像头
                              img(value.equip_type, value);
                              position.mapTitle = {
                                titleName: "摄像机名称",
                                titleId: "摄像机位置",
                                name: "app_name",
                                id: "loc_simple_name"
                              }
                            }

                          }else {
                            if (value.equip_type == 'gate') {
                              // 门禁管理
                              if (value.equip_status == 1) {
                                position.logo = imgBaseUrl + "2.png";
                              } else {
                                position.logo = imgBaseUrl + "sign_abnormality.png";
                              }
                              position.mapTitle = {
                                name: "app_name",
                                id: "id"
                              }
                            }else if(value.equip_type == 'smoke'){//fire查的是烟感报警的设备
                              // 消防系统
                              if (value.equip_status == 1) {
                                position.logo = imgBaseUrl + "icon-fire.png";
                              } else {
                                position.logo = imgBaseUrl + "sign_abnormality.png";
                              }
                              position.mapTitle = {
                                name: "app_name",
                                id: "id"
                              }

                            } else if(value.equip_type == 'camera') {
                              //摄像头
                              img(value.equip_type, value);
                              position.mapTitle = {
                                titleName: "摄像机名称",
                                titleId: "摄像机位置",
                                name: "app_name",
                                id: "loc_simple_name"
                              }
                            }
                          }
                          dataOther.push(position);
                        }
                      })
                    });
                    mapRender(dataOther);
                  })
                }else {
                  sensor.then(function (res) {
                    dataOther = [];
                    eqList = [];
                    res.data.data.forEach(function (value, indexTwo) {
                      if (value.latitude_ && value.longitude_) {
                        var lat = Number.parseFloat(value.latitude_) + 0.00265842186953;
                        var lon = Number.parseFloat(value.longitude_) - 0.0058591393113;
                        position = {
                          type: "Position",
                          sType: type,
                          dinates: [lon, lat],
                          info: value,
                          id :value.id
                        };

                        if (type === 'alarm'){
                          // 防盗报警
                          if (value.equip_status == 1) {
                            position.logo = imgBaseUrl + "sign_abnormality.png";
                          } else {
                            position.logo = imgBaseUrl + "sign_alarm-_null.png";
                          }
                          position.mapTitle = {
                            name: "app_name",
                            id: "id"
                          }
                          if(value.equip_type == 'camera') {
                            //摄像头
                            img(value.equip_type, value);
                            position.mapTitle = {
                              titleName: "摄像机名称",
                              titleId: "摄像机位置",
                              name: "app_name",
                              id: "loc_simple_name"
                            }
                          }

                        }else {
                          if (value.equip_type == 'gate') {
                            // 门禁管理
                            if (value.equip_status == 1) {
                              position.logo = imgBaseUrl + "2.png";
                            } else {
                              position.logo = imgBaseUrl + "sign_abnormality.png";
                            }
                            position.mapTitle = {
                              name: "app_name",
                              id: "id"
                            }
                          }else if(value.equip_type == 'smoke'){//fire查的是烟感报警的设备
                            // 消防系统
                            if (value.equip_status == 1) {
                              position.logo = imgBaseUrl + "icon-fire.png";
                            } else {
                              position.logo = imgBaseUrl + "sign_abnormality.png";
                            }
                            position.mapTitle = {
                              name: "app_name",
                              id: "id"
                            }

                          } else if(value.equip_type == 'camera') {
                            //摄像头
                            img(value.equip_type, value);
                            position.mapTitle = {
                              titleName: "摄像机名称",
                              titleId: "摄像机位置",
                              name: "app_name",
                              id: "loc_simple_name"
                            }
                          }
                        }
                        dataOther.push(position);
                        eqList.push(position);
                      }
                    })
                    mapRender(dataOther);
                  });
                }
              };
              // 判断显示图片
              function img(type, val) {
                if (type == "camera") {
                  // 弱电
                  if (val.id == 1511841947207 || val.id == 1511841947206) {
                    position.logo = imgBaseUrl + "5.png";
                  } else {
                    position.logo = imgBaseUrl + "5.png"
                  }

                } else if (type == "gate") {
                  //消防
                  position.logo = imgBaseUrl + "2.png";
                } else if (type == "space") {
                  //强电
                  //给排水
                  position.logo = imgBaseUrl + "4.png";
                } else if (type == "ammeter") {
                  //能源
                  position.logo = imgBaseUrl + "3.png";
                } else if (type == "elevator") {
                  //电梯
                  position.logo = imgBaseUrl + "6.png";
                } else if (type == "parkingLot") {
                  // 机械设备
                  position.logo = imgBaseUrl + "sign_out.png";
                } else if (type == "秩序部" || type == "白班" || type == "中班" || type == "夜班") {
                  position.logo = imgBaseUrl + "sign_order.png"
                } else if (type == "客服部") {
                  position.logo = imgBaseUrl + "sign_stewards.png"  //客服改成管家
                } else if (type == "工程部" || type == "蓝域") {
                  position.logo = imgBaseUrl + "sign_engineering.png"
                } else if (type.indexOf("保洁") != -1) {
                  position.logo = imgBaseUrl + "sign_cleanness.png"
                } else if (type == "物业部" ) {
                  position.logo = imgBaseUrl + "sign_stewards.png"
                }
              }
              //弹窗模块赋值
              function createContent(info) {
                var append="";
                //如果传入还有其他列与参数，则循环追加
                if(info.param && info.param.length > 0){
                  info.param.forEach(function (pa) {
                    append += "<div>"+pa.name+"</div>"+
                      "<div>"+pa.value+"</div>";
                  })
                }
                info.titleName = info.titleName || "设备名称";
                info.titleId = info.titleId || "设备ID";
                content = '<div style="infoWindowStyle2"></div>' +
                  '<div class="infoWindowStyle clearfix">' +
                  '<div>' + info.titleName + '</div>' +
                  '<div>' + info.name + '</div>'+
                  '<div>' + info.titleId + '</div>'+
                  '<div>' + info.id + '</div>'+
                  append+
                  '</div>' +
                  '<div class="mapClose" id ="mapClose">x</div>';
                return content;
              }
              // 根据不同type， 构建弹窗信息
              function typeField(eqField, eqInfo) {
                var info = {
                  name: eqInfo[eqField.name],
                  id: eqInfo[eqField.id],
                  titleName: eqField.titleName,
                  titleId: eqField.titleId,
                  param : eqField.param
                };
                if (eqInfo.equip_type == "camera") {
                  console.log(info);
                  info.name = info.name.substr(-3);
                }
                return info;
              }

              var map = new AirocovMap.Map({
                container: document.getElementById("map-indoor"), //设置地图容器ID
                mapList: [{ //传入本楼栋内所有楼层信息
                  name: "F1",
                  mapUrl: "/show-ems/res/indoor-data/lidao2046.geojson", //地图文件
                  // other: dataOther //第三方数据
                }],
                themeUrl: "/show-ems/res/img/indoor-icon/fillcolor.json", //共用渲染文件
                position: { //初始观察位置
                  x: -30,
                  y: -200,
                  z: 100
                }
              });

              AirocovMap.config({
                showMenu: false
              });

              var flag = false;
              var cameraList = {

                fire: "fire"
              };
              $ctrl.showCamera = function () {
                flag = true;
                if (type in cameraList){
                  mapEquip2Camera(flag);
                }else{
                  mapDispatch();
                }
                $ctrl.btnCamera = true;
              };
              $ctrl.hideCamera = function () {
                flag = false;
                if (type in cameraList){
                  mapEquip2Camera(flag);
                }else{
                  mapDispatch();
                }
                $ctrl.btnCamera = false;
              };

              $ctrl.to2D = function () {
                map.mapTo2D();
              };
              $ctrl.to3D = function () {
                map.mapTo3D()
              };
              var mapEvent = {
                elevator: "elevator",
                camera: "camera",
                equipmentRoom: "equipmentRoom",
                watch: "watch",
                equipment: "equipment"
              };
              var mapEvent4workList = {
                elevator: "elevator",
                equipmentRoom: "equipmentRoom",
                equipment: "equipment"
              };
              map.event.on("click", function (e) { //注册点击事件
                if (e.type == "clickModel") { //判断点击类型为模块元素
                  console.log(e); //返回模块信息
                  // map.closeInfoWindow()
                  map.clickOutModel(e.target.intersectInfo.id); //模块高亮，把对应模块ID传入
                } else if (e.type == "clickEq") { //判断点击类型为设备元素
                  console.log(e); //返回设备信息
                  // 弹出气泡
                  if (type in mapEvent) {
                    gloalEvent(e.target.other.mapTitle, e.target.other.info, type);
                    if (type in mapEvent4workList){
                      console.log(type);
                      gloalEvent4workList(e.target.other.mapTitle, e.target.other.info, type);
                    }

                    if (e.target.other.info.id == 1511841947207 || e.target.other.info.id == 1511841947206) {
                      $timeout(function () {
                        AppService.showVideo(e.target.other.info.id);
                      });

                    }
                  }else if(type == 'dispatch' || type == 'fire'){
                    //调度指挥中心也需要打开摄像头，但不需要传播事件
                    if (e.target.other.info.id == 1511841947207 || e.target.other.info.id == 1511841947206) {
                      $timeout(function () {
                        AppService.showVideo(e.target.other.info.id);
                      });

                    }
                  }
                  var info = typeField(e.target.other.mapTitle, e.target.other.info);
                  // debugger;
                  var n = map.addInfoWindow({
                    content: createContent(info), //传入前端样式
                    id: e.target.id
                  });
                } else if (e.type == "clickMap") { //点击到地图上，但没有点中元素
                  // map.closeInfoWindow();
                  console.log(e); //返回地图信息，包含点击坐标
                }
              });

              // 发布全局事件=》右侧显示监控参数
              function gloalEvent(eqField, info, type) {
                var obj = {};
                if (type == "equipmentRoom") {
                  obj.name = info[eqField.name];
                  obj.id = info.house_id;
                  $scope.$emit('toSensor', obj);
                }
                obj.name = info[eqField.name];
                obj.id = info.id;
                $scope.$emit('toSensor', obj);
              }

              // 发布全局事件=》右侧显示工单列表
              function gloalEvent4workList(eqField, info, type) {
                var workObj = {};
                console.log(eqField);
                console.log(info);
                workObj.domain_id = info.domain_id;
                workObj.id = info.id;
                workObj.location = info.name;
                $scope.$emit('toWork', workObj);

              }

              function mapRender(dataOther) {
                map.resetRender({
                  mapList: [{ //传入本楼栋内所有楼层信息
                    name: "F1",
                    mapUrl: "/show-ems/res/indoor-data/lidao2046.geojson", //地图文件
                    other: dataOther //第三方数据
                  }],
                  themeUrl: "/show-ems/res/img/indoor-icon/fillcolor.json", //共用渲染文件
                });
                console.log(dataOther);
              }
              var apiList = {
                equipmentRoom: "equipmentRoom",
                elevator: "elevator",
                parkingLot: "parkingLot",
                waterMeter: "waterMeter",
                ammeter: "ammeter",
                energy: "energy",
                sensor: "sensor",
                rail: "rail",
                //alarm: "alarm",
                watch: "watch",
                gate: "gate",
                camera: "camera"
              };

              if (type == "dispatch") {
                mapDispatch();
              } else if (type == "equipment") {
                mapEquipment();
              } else if(type == "gate" || type == "fire"){//数据不仅包含本身的设备列表还需要摄像头的数据
                mapEquip2Camera();
              } else if (type in apiList) {
                mapElevator();
              }

              /* 室内地图end */
            };
            $ctrl.goback = function () {
                $ctrl.onBackToGaode({
                    $event: {}
                });
            };

        }]
    });

    app.component('infoPanel', {
        transclude: true,
        templateUrl: '../show-fm/page/component/infoPanel.html',
        bindings: {},
        controller: function () {
            var $ctrl = this;
            $ctrl.$onInit = function () {};
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
        templateUrl: '/show-fm/page/component/vedio.html',
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
                $http.get('/ovu-screen/system/video/live.do?equipmentId=' + vm.deviceId).success(function (data) {
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

            function onJavaScriptBridgeCreated() {}

            function playClear() {
                console.log('iiiii');
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
