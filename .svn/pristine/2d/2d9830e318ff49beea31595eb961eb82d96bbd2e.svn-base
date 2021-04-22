/**
 * 自定义 angular指令
 */
(function() {
    "use strict";
    var app = angular.module("app");

    //Setup map events from a google map object to trigger on a given element too,
    //then we just use ui-event to catch events from an element
    function bindMapEvents(scope, eventsStr, googleObject, element) {
        angular.forEach(eventsStr.split(' '), function(eventName) {
            //Prefix all googlemap events with 'map-', so eg 'click'
            //for the googlemap doesn't interfere with a normal 'click' event
            window.AMap.event.addListener(googleObject, eventName, function(event) {
                element.triggerHandler('map-' + eventName, event);
                //We create an $apply if it isn't happening. we need better support for this
                //We don't want to use timeout because tons of these events fire at once,
                //and we only need one $apply
                if (!scope.$$phase) {
                    scope.$apply();
                }
            });
        });
    }

    app.value('uiMapConfig', {}).directive('uiMap', [
        'uiMapConfig', '$window', '$parse',
        function(uiMapConfig, $window, $parse) {
            var mapEvents = 'complete click dblclick mapmove movestart moveend zoomchange zoomstart zoomend mousemove mousewheel mouseover mouseout mouseup mousedown rightclick dragstart dragging dragend resize touchstart touchmove touchend';
            var options = uiMapConfig || {};
            return {
                restrict: 'A',
                link: function(scope, elm, attrs) {
                    var map;

                    var opts = angular.extend({}, options, scope.$eval(attrs.uiOptions));

                    scope.$on("map.loaded", function(e, type) {
                        if (type == "gaode" && !map) {
                            initMap();
                        }
                    });

                    if ($window.AMap) {
                        initMap();
                    }

                    function initMap() {
                        if (opts.uiMapCache && window[attrs.uiMapCache]) {
                            elm.replaceWith(window[attrs.uiMapCache]);
                            map = window[attrs.uiMapCache + "Map"];
                        } else {

                            map = new window.AMap.Map(elm[0], opts);
                            /**************** add AMap plugins *******************************/
                            if (opts.toolbar) {
                                map.plugin(["AMap.ToolBar"], function() {
                                    var toolBar = new AMap.ToolBar({
                                        position: 'RT',
                                        liteStyle: opts.liteStyle,
                                        direction: false,
                                        ruler: false,
                                        locate: false
                                    });
                                    map.addControl(toolBar);
                                });
                            }

                            if (opts.maptype == "SATELLITE") {
                                map.plugin(["AMap.MapType"], function() {
                                    //地图类型切换
                                    /* MaptypeOptions	 类型	 说明
                                     defaultType  	Number	 初始化默认图层类型。 取值为0：2D地图 取值为1：卫星图 默认值：0
                                     showTraffic	    Boolean	 叠加实时交通图层 默认值：false
                                     showRoad 	    Boolean	 叠加路网图层 默认值：false
                                     */
                                    var type = new AMap.MapType({
                                        defaultType: 1,
                                        showRoad: true
                                    });
                                    map.addControl(type);
                                });
                            } else if (opts.maptype) {
                                map.plugin(["AMap.MapType"], function() {
                                    var type = new AMap.MapType({
                                        defaultType: 0,
                                        showRoad: true
                                    });
                                    map.addControl(type);
                                });
                            }

                            if (opts.overview) {
                                map.plugin(["AMap.OverView"], function() {
                                    //加载鹰眼
                                    var view = new AMap.OverView({
                                        isOpen: opts.overview.isOpen || false
                                    });
                                    map.addControl(view);
                                });
                            }

                            if (opts.uiMapCache) {
                                $window[attrs.uiMapCache + "Map"] = map;
                                scope.$on("$destroy", function() {
                                    $window[attrs.uiMapCache] = elm;
                                });
                            }
                            /*********************** end add AMap plugins ****************/
                        }
                        var model = $parse(attrs.uiMap);
                        //Set scope variable for the map
                        model.assign(scope, map);
                        bindMapEvents(scope, mapEvents, map, elm);
                    }

                }
            };
        }
    ]);
    app.value('uiMapInfoWindowConfig', {}).directive('uiMapInfoWindow', [
        'uiMapInfoWindowConfig', '$window', '$parse', '$compile',
        function(uiMapInfoWindowConfig, $window, $parse, $compile) {
            var infoWindowEvents = 'change open close';
            var options = uiMapInfoWindowConfig || {};
            return {
                link: function(scope, elm, attrs) {
                    var opts = angular.extend({}, options, scope.$eval(attrs.uiOptions));
                    opts.offset = new AMap.Pixel(0, -31);
                    opts.content = elm[0];
                    var model = $parse(attrs.uiMapInfoWindow);
                    var infoWindow = model(scope);

                    scope.$on("map.loaded", function(e, type) {
                        if (type == "gaode" && !infoWindow) {
                            initInfoWindow();
                        }
                    });

                    if ($window.AMap) {
                        initInfoWindow();
                    }

                    function initInfoWindow() {
                        if (!infoWindow) {
                            infoWindow = new window.AMap.InfoWindow(opts);
                            model.assign(scope, infoWindow);
                        }
                        bindMapEvents(scope, infoWindowEvents, infoWindow, elm);
                        /* The info window's contents dont' need to be on the dom anymore,
                         google maps has them stored.  So we just replace the infowindow element
                         with an empty div. (we don't just straight remove it from the dom because
                         straight removing things from the dom can mess up angular) */
                        elm.replaceWith('<div></div>');
                        //Decorate infoWindow.open to $compile contents before opening
                        var _open = infoWindow.open;
                        infoWindow.open = function open(a1, a2, a3, a4, a5, a6) {
                            $compile(elm.contents())(scope);
                            _open.call(infoWindow, a1, a2, a3, a4, a5, a6);
                        };
                    }
                }
            };
        }
    ]);
    /*
     * Map overlay directives all work the same. Take map marker for example
     * <ui-map-marker="myMarker"> will $watch 'myMarker' and each time it changes,
     * it will hook up myMarker's events to the directive dom element.  Then
     * ui-event will be able to catch all of myMarker's events. Super simple.
     */
    function mapOverlayDirective(directiveName, events) {
        app.directive(directiveName, [function() {
            return {
                restrict: 'A',
                link: function(scope, elm, attrs) {
                    scope.$watch(attrs[directiveName], function(newObject) {
                        if (newObject) {
                            bindMapEvents(scope, events, newObject, elm);
                        }
                    });
                }
            };
        }]);
    }

    mapOverlayDirective('uiMapMarker', 'click dblclick rightclick mousemove mouseover mouseout mousedown mouseup dragstart dragging dragend moving moveend movealong touchstart touchmove touchend');
    mapOverlayDirective('uiMapPolyline', 'click dblclick rightclick hide show mousedown mouseup mouseover mouseout change touchstart touchmove touchend');
    mapOverlayDirective('uiMapPolygon', 'click dblclick rightclick hide show mousedown mouseup mouseover mouseout change touchstart touchmove touchend');
    //mapOverlayDirective('uiMapRectangle', 'bounds_changed click dblclick mousedown mousemove mouseout mouseover ' + 'mouseup rightclick');
    mapOverlayDirective('uiMapCircle', 'click dblclick rightclick hide show mousedown mouseup mouseover mouseout change touchstart touchmove touchend');
    mapOverlayDirective('uiMapGroundImage', 'click dblclick');

    app.provider('uiMapLoadParams', function uiMapLoadParams() {
            var params = {};

            this.setParams = function(ps) {
                params = ps;
            };

            this.$get = function uiMapLoadParamsFactory() {

                return params;
            };
        })
        .directive('uiMapAsyncLoad', ['$window', '$parse', 'uiMapLoadParams',
            function($window, $parse, uiMapLoadParams) {
                return {
                    restrict: 'A',
                    link: function(scope, element, attrs) {

                        $window.mapgaodeLoadedCallback = function mapgaodeLoadedCallback() {
                            scope.$broadcast("map.loaded", "gaode");
                        };

                        var params = angular.extend({}, uiMapLoadParams, scope.$eval(attrs.uiMapAsyncLoad));

                        params.callback = "mapgaodeLoadedCallback";

                        if (!$window.AMap) {
                            var script = document.createElement("script");
                            script.type = "text/javascript";
                            script.src = "http://webapi.amap.com/maps?" + param(params);
                            document.body.appendChild(script);
                        } else {
                            mapgaodeLoadedCallback();
                        }
                    }
                }
            }
        ]);

    /**
     * 序列化js对象
     *
     * @param a
     * @param traditional
     * @returns {string}
     */
    function param(a, traditional) {
        var prefix,
            s = [],
            add = function(key, value) {
                // If value is a function, invoke it and return its value
                value = angular.isFunction(value) ? value() : (value == null ? "" : value);
                s[s.length] = encodeURIComponent(key) + "=" + encodeURIComponent(value);
            };

        // If an array was passed in, assume that it is an array of form elements.
        if (angular.isArray(a) || (a.jquery && !angular.isObject(a))) {
            // Serialize the form elements
            angular.forEach(a, function() {
                add(this.name, this.value);
            });

        } else {
            // If traditional, encode the "old" way (the way 1.3.2 or older
            // did it), otherwise encode params recursively.
            for (prefix in a) {
                buildParams(prefix, a[prefix], traditional, add);
            }
        }

        // Return the resulting serialization
        return s.join("&").replace(r20, "+");
    }

    var r20 = /%20/g;

    function buildParams(prefix, obj, traditional, add) {
        var name;

        if (angular.isArray(obj)) {
            // Serialize array item.
            angular.forEach(obj, function(v, i) {
                if (traditional || rbracket.test(prefix)) {
                    // Treat each array item as a scalar.
                    add(prefix, v);

                } else {
                    // Item is non-scalar (array or object), encode its numeric index.
                    buildParams(prefix + "[" + (typeof v === "object" ? i : "") + "]", v, traditional, add);
                }
            });

        } else if (!traditional && angular.isObject(obj)) {
            // Serialize object item.
            for (name in obj) {
                buildParams(prefix + "[" + name + "]", obj[name], traditional, add);
            }

        } else {
            // Serialize scalar item.
            add(prefix, obj);
        }
    }

    var decode = decodeURIComponent;


    app.directive('uiEvent', ['$parse',
        function($parse) {
            return function($scope, elm, attrs) {
                var events = $scope.$eval(attrs.uiEvent);
                angular.forEach(events, function(uiEvent, eventName) {
                    var fn = $parse(uiEvent);
                    elm.bind(eventName, function(evt) {
                        var params = Array.prototype.slice.call(arguments);
                        //Take out first paramater (event object);
                        params = params.splice(1);
                        fn($scope, { $event: evt, $params: params });
                        if (!$scope.$$phase) {
                            $scope.$apply();
                        }
                    });
                });
            };
        }
    ]);
    //echarts指令
    app.directive('uiEcharts', ['$window', '$timeout', function($window, $timeout) {
        return {
            restrict: 'A',
            scope: {
                option: '=uiEcharts', //图表选择
                theme: '=theme', //主题
                //controller中可以通过此回调来接收图表实例
                createdFun: '=createdFun'
            },
            link: function(scope, el, attrs) {
                var initChart = function() {
                    var option = scope.option;
                    var theme = scope.theme;
                    if (option == null) {
                        return null;
                    }

                    var myChart = echarts.init(el[0], theme);
                    myChart.showLoading();
                    myChart.setOption(option);
                    myChart.hideLoading();

                    if (scope.createdFun) {
                        scope.createdFun(myChart);
                    }

                    scope.$on('$destroy', function() {
                        if (!myChart.isDisposed()) {
                            myChart.clear();
                            myChart.dispose();
                        }
                    });

                    var _resizeChart = function() {
                        !myChart.isDisposed() && myChart.resize();
                    }
                    scope.$on("onWindowResize", function() {
                        _resizeChart();
                    });

                    scope.$on("chartResize", function() {
                        _resizeChart();
                    });

                    return myChart;
                }
                var myChart = initChart();

                //watch option
                var watch = function(watchExpressions) {
                    angular.forEach(watchExpressions, function(expressions) {
                        scope.$watch(expressions, function(current, prev) {
                            if (!angular.equals(current, prev)) {
                                //第一次当option为null时chart实例也为null
                                if (myChart == null) {
                                    myChart = initChart();
                                }
                                myChart.hideLoading();
                                myChart.clear();
                                if (scope.option) {
                                    myChart.setOption(scope.option);
                                    // 放上面会出现未知问题
                                    myChart.resize();
                                }
                                //执行回调函数
                                if (scope.createdFun) {
                                    scope.createdFun(myChart);
                                }
                            }
                        }, true);
                    });
                }
                watch(["option"]);
            }
        };
    }]);

    /**
     * 监控视频柏播放组件
     * param:设备id,宽度，长度
     */
    app.directive('playVideo', ['$window', '$timeout', '$http', function($window, $timeout, $http) {
        return {
            restrict: 'AE',
            scope: {
                deviceId: '<?',
                width: '<?',
                height: '<?',
                url: '<?'
            },
            link: function(scope, el, attr) {
                var width = scope.width || el.parent().width();
                var height = scope.height || el.parent().height();
                var id = attr.id;
                //监听url变化
                scope.$watch('url', function(current, prev) {
                    if (angular.isDefined(current) && !angular.equals(current, prev)) {
                        if (current == '') {
                            init();
                        } else {
                            play(scope.url);
                        }
                    }
                }, true);

                function init() {
                    /* $http.get('/ovu-base/system/video/live.do?equipmentId=' + scope.deviceId).success(function(data) {
                         play(data.interM3u8 || "http://116.205.13.37:8080/34020000001320000002/live/34020000001320000002.m3u8");
                     })*/
                    play("http://116.205.13.37:2020/34020000001320000002/live/34020000001320000002.m3u8");
                }
                //初始化
                $timeout(function() {
                    if (scope.deviceId) {
                        init();
                    } else {
                        scope.$watch('deviceId', function(current, prev) {
                            if (angular.isDefined(current) && !angular.equals(current, prev)) {
                                init();
                            }
                        }, true);
                    }
                })

                function onJavaScriptBridgeCreated() {}

                function playClear() {
                    console.log('iiiii')
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
                        width || "700", height || "450",
                        // minimum flash player version required
                        "10.2",
                        // other parameters
                        null, flashvars, params, attrs
                    );
                }
            }
        };
    }]);

    // 添加全屏
    app.directive('mapFullPage', ['$timeout', function($timeout) {
        return {
            restrict: 'A',
            link: function(scope, ele, attrs) {
                // console.log(ele[0].offsetHeight);
                var fullHeight = document.body.clientHeight;
                ele[0].style.height = fullHeight - 60 - 2 + 'px';
                // console.log(document.body.clientHeight);
            }
        }
    }]);


})();