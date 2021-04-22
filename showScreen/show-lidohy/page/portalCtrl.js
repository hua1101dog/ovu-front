/**
 * Created by wangheng
 * 门户地图
 */
(function () {
    "use strict";
    var app = angular.module("app");

    app.service('portalService',
        ['$http',
            function ($http) {
                var that = this;
                this.getMapDistrict = function (map) {
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

                            if(map.getZoom()>6){
                                isHover = false;
                            }
                            tipMarker.setMap(isHover ? map : null);

                            if (feature.properties.level != "province" ) {
                                return;
                            }

                            var props = feature.properties;

                            if (isHover) {
                                //更新提示内容
                               /* $tipMarkerContent.html(props.adcode + ': ' + props.name);*/
                                $tipMarkerContent.html(props.name);
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
                            }
                        });

                        /*//外部区域被点击
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
                        });*/

                        //绘制某个区域的边界
                        function renderAreaPolygons(areaNode) {

                            //更新地图视野
                            map.setBounds(areaNode.getBounds(), null, null, true);

                            //清除已有的绘制内容
                            districtExplorer.clearFeaturePolygons();

                            //绘制子区域
                            districtExplorer.renderSubFeatures(areaNode, function (feature, i) {

                                var name = feature.properties.name;
                                if (name == "湖北省" || name == "安徽省"|| name == "山东省") {
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
                                }

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


            }]);

    app.controller('portalCtrl', portalCtrl);
    portalCtrl.$inject = ['$scope', 'AppService', '$http', '$state', 'portalService'];

    function portalCtrl($scope, AppService, $http, $state, portalService) {
        var vm = this;
        /*042010601112046*/
        var parkNo = ['03401110001HFJR', '04201110001CYTD'];
        var domainId='14bdbea59d2c4b0a96594fb94382901e';
        vm.map ={};
        //地图基本配置
        vm.mapOptions = {
            // map-self config
            // ui map config
            uiMapCache: false,
            zoom: 5,
            liteStyle: true,
            mapStyle: 'amap://styles/darkblue',
            center: [105.76364, 36.064211]
        };
        vm.markers=[];

        $scope.$watch("vm.map",function (current,prev) {
            if (angular.isDefined(current)) {
                portalService.getMapDistrict(vm.map);
                var temp = vm.map;
                vm.map.on('zoomend', function(e) {
                    if(vm.map.getZoom() < 5){
                        portalService.getMapDistrict(vm.map);
                        vm.markers=[];
                        vm.map.clearMap();
                    }
                    if(vm.map.getZoom() > 6 && vm.markers.length == 0){
                        vm.map.clearMap();
                        //ems查询所有的正式版项目
                        $http.get('/ovu-screen/pcos/show/park/all.do?domainId='+domainId)
                            .success(function (rep) {
                                if (rep.success) {
                                    var data = rep.data;
                                    var markers = [];
                                    data && data.forEach(function (park) {
                                        var marker = addMarker(park);
                                        markers.push(marker);
                                    });
                                    vm.markers = markers;
                                }
                        });
                    }
                });
            }
        });

        //地图标记点覆盖事件
        vm.mouseoverMaker = function ($event, $params, marker) {
            vm.markerData = marker.getExtData();
            vm.myInfoWindow.open(vm.map, marker.getPosition());
        };

        //地图标记点点击事件
        vm.clickMap = function ($event, $params, marker) {
            var temp = marker.getExtData();
            var parkName = temp.PARK_NAME;
            var logo;
            if (parkName != '丽岛2046') {
                return;
            }
            //存在session
            $http.get('/ovu-screen/pcos/show/park/get.do', {params: {parkNo: temp.PARK_NO}});
            var park = {parkNo: temp.PARK_NO, parkName: temp.PARK_NAME, logo: logo};
            AppService.parkNo = park.parkNo;
            AppService.park = park;
            //存到会话中
            sessionStorage.park = JSON.stringify(park);
            $state.go('home');
        };


        function addMarker(data) {
            var icon = new AMap.Icon({
                image: '/ovu-pcos/show-cmcc/res/img/icon_map_localize.png'
            });
            var marker = new AMap.Marker({
                icon: icon,
                position: [data.MAP_LNG, data.MAP_LAT],
                map: vm.map,
                extData: data
            });
            return marker;
        }
    }

})();
