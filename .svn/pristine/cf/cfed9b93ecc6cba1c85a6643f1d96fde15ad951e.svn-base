/**
 * 自定义 angular指令
 */
(function () {
    "use strict";
    var app = angular.module("angularApp");

    //Setup map events from a google map object to trigger on a given element too,
    //then we just use ui-event to catch events from an element
    function bindMapEvents(scope, eventsStr, googleObject, element) {
        angular.forEach(eventsStr.split(' '), function (eventName) {
            //Prefix all googlemap events with 'map-', so eg 'click'
            //for the googlemap doesn't interfere with a normal 'click' event
            window.AMap.event.addListener(googleObject, eventName, function (event) {
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
        function (uiMapConfig, $window, $parse) {
            var mapEvents = 'complete click dblclick mapmove movestart moveend zoomchange zoomstart zoomend mousemove mousewheel mouseover mouseout mouseup mousedown rightclick dragstart dragging dragend resize touchstart touchmove touchend';
            var options = uiMapConfig || {};
            return {
                restrict: 'A',
                link: function (scope, elm, attrs) {
                    var map;

                    var opts = angular.extend({}, options, scope.$eval(attrs.uiOptions));

                    scope.$on("map.loaded", function (e, type) {
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
                                map.plugin(["AMap.ToolBar"], function () {
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
                                map.plugin(["AMap.MapType"], function () {
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
                                map.plugin(["AMap.MapType"], function () {
                                    var type = new AMap.MapType({
                                        defaultType: 0,
                                        showRoad: true
                                    });
                                    map.addControl(type);
                                });
                            }

                            if (opts.overview) {
                                map.plugin(["AMap.OverView"], function () {
                                    //加载鹰眼
                                    var view = new AMap.OverView({
                                        isOpen: opts.overview.isOpen || false
                                    });
                                    map.addControl(view);
                                });
                            }

                            if (opts.uiMapCache) {
                                $window[attrs.uiMapCache + "Map"] = map;
                                scope.$on("$destroy", function () {
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
        function (uiMapInfoWindowConfig, $window, $parse, $compile) {
            var infoWindowEvents = 'change open close';
            var options = uiMapInfoWindowConfig || {};
            return {
                link: function (scope, elm, attrs) {
                    var opts = angular.extend({}, options, scope.$eval(attrs.uiOptions));
                    opts.offset = new AMap.Pixel(0, -31);
                    opts.content = elm[0];
                    var model = $parse(attrs.uiMapInfoWindow);
                    var infoWindow = model(scope);

                    scope.$on("map.loaded", function (e, type) {
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
        app.directive(directiveName, [function () {
            return {
                restrict: 'A',
                link: function (scope, elm, attrs) {
                    scope.$watch(attrs[directiveName], function (newObject) {
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

        this.setParams = function (ps) {
            params = ps;
        };

        this.$get = function uiMapLoadParamsFactory() {

            return params;
        };
    })
        .directive('uiMapAsyncLoad', ['$window', '$parse', 'uiMapLoadParams',
            function ($window, $parse, uiMapLoadParams) {
                return {
                    restrict: 'A',
                    link: function (scope, element, attrs) {

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
            add = function (key, value) {
                // If value is a function, invoke it and return its value
                value = angular.isFunction(value) ? value() : (value == null ? "" : value);
                s[s.length] = encodeURIComponent(key) + "=" + encodeURIComponent(value);
            };

        // If an array was passed in, assume that it is an array of form elements.
        if (angular.isArray(a) || (a.jquery && !angular.isObject(a))) {
            // Serialize the form elements
            angular.forEach(a, function () {
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
            angular.forEach(obj, function (v, i) {
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
        function ($parse) {
            return function ($scope, elm, attrs) {
                var events = $scope.$eval(attrs.uiEvent);
                angular.forEach(events, function (uiEvent, eventName) {
                    var fn = $parse(uiEvent);
                    elm.bind(eventName, function (evt) {
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
    app.directive('uiEcharts', ['$window', '$timeout', function ($window, $timeout) {
        return {
            restrict: 'A',
            scope: {
                option: '=uiEcharts', //图表选择
                theme: '=theme', //主题
                //controller中可以通过此回调来接收图表实例
                createdFun: '=createdFun'
            },
            link: function (scope, el, attrs) {
                var initChart = function () {
                    var option = scope.option;
                    var theme = scope.theme;
                    if (option == null) {
                        return null;
                    }
                    //这里是为了解决echarts宽度为百分比的一个bug
                    angular.element(el[0]).css('width', angular.element(el[0]).width());
                    var myChart = echarts.init(el[0], theme);
                    myChart.showLoading();
                    myChart.setOption(option);
                    myChart.hideLoading();

                    if (scope.createdFun) {
                        scope.createdFun(myChart);
                    }

                    scope.$on('$destroy', function () {
                        if (!myChart.isDisposed()) {
                            myChart.clear();
                            myChart.dispose();
                        }
                    });

                    var _resizeChart = function () {
                        !myChart.isDisposed() && myChart.resize();
                    }
                    scope.$on("onWindowResize", function () {
                        _resizeChart();
                    });

                    scope.$on("chartResize", function () {
                        _resizeChart();
                    });

                    return myChart;
                }
                var myChart = initChart();

                //watch option
                var watch = function (watchExpressions) {
                    angular.forEach(watchExpressions, function (expressions) {
                        scope.$watch(expressions, function (current, prev) {
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

    app.directive('pdfSaveButton', ['$rootScope', '$pdfStorage', function ($rootScope, $pdfStorage) {

        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                $pdfStorage.pdfSaveButtons.push(element);

                scope.buttonText = "Button";
                element.on('click', function () {

                    //2018-02-03
                    //解决pdf导出时弹出其他iframe弹出框bug
                    var iframList = document.querySelectorAll('iframe[src]');
                    iframList.forEach(function (iframe) {
                        if (iframe.src.indexOf('/ovu-base') > -1 || iframe.src.indexOf('/ovu-pcos') > -1) {
                            document.body.removeChild(iframe);
                        }
                    });
                    //
                    var activePdfSaveId = attrs.pdfSaveButton;
                    var activePdfSaveName = attrs.pdfName;
                    $rootScope.$broadcast('savePdfEvent', { activePdfSaveId: activePdfSaveId, activePdfSaveName: activePdfSaveName });


                })
            }


        }

    }]);
    app.directive('pdfSaveContent', ['$rootScope', '$pdfStorage', function ($rootScope, $pdfStorage) {


        return {
            link: function (scope, element, attrs) {

                $pdfStorage.pdfSaveContents.push(element);

                var myListener = scope.$on('savePdfEvent', function (event, args) {

                    var currentElement = element;
                    var currentElementId = currentElement[0].getAttribute('pdf-save-content');

                    // save a call of query selector because angular loads the element on load by default
                    //	var elem = document.querySelectorAll('[pdf-save]') ;
                    var elem = $pdfStorage.pdfSaveContents;
                    var broadcastedId = args.activePdfSaveId;
                    var broadcastedName = args.activePdfSaveName || 'default.pdf';



                    //iterate through the element array to match the id
                    for (var i = 0; i < elem.length; i++) {

                        // handle the case of elem getting length
                        //	if(i == 'length' || i == 'item')
                        //		continue ;

                        // if the event is received by other element than for whom it what propogated for continue


                        if (!matchTheIds(broadcastedId, currentElementId))
                            continue;

                        var single = elem[i];
                        var singleElement = single[0];
                        //var parent = single[0] ;
                        var pdfId = singleElement.getAttribute('pdf-save-content');

                        if (matchTheIds(pdfId, broadcastedId)) {
                            console.log('Id is same');
                            convertToPdf(elem, pdfId);
                            break; // exit the loop once pdf gets printed
                        }

                    }

                    function matchTheIds(elemId, broadcastedId) {
                        return elemId == broadcastedId;
                    }

                    function convertToPdf(theElement, id) {
                        //theElement = [theElement];
                        convert(theElement, id);

                    }
                    //为了确保absolute定位的元素也能购全部截取，而不是只是可视化区域才能截取
                    //所以这里克隆了元素，设为relative定位
                    function hiddenClone(element) {
                        // Create clone of element
                        var clone = element.cloneNode(true);


                        var isFilter = singleElement.getAttribute('is-filter') || false;
                        if (isFilter) {
                            //删除未选中的项
                            $(clone).find(".glyphicon-unchecked").parent().parent().remove();//删除未选中的元素
                            $(clone).find(".glyphicon-check").parent().remove();//删除复选框
                            $(clone).find("img").parent().parent().remove();//删除图片元素
                            //console.log(clone);
                        }


                        // Position element relatively within the
                        // body but still out of the viewport
                        var style = clone.style;
                        style.position = 'relative';
                        style.top = window.innerHeight + 'px';
                        style.left = 0;
                        style.width = "900px";
                        style.boxShadow = 'none';
                        // Append clone to body and return the clone

                        document.body.appendChild(clone);
                        return clone;
                    }


                    function convert(theElement, id) {
                        //var quotes = $('div[pdf-save-content='+id+']')[0];
                        var quotes = hiddenClone($('div[pdf-save-content=' + id + ']')[0]);
                        /*html2canvas(quotes, {
                            allowTaint: true,//允许跨域
                            onrendered: function(canvas) {
                                //'a4': [595.28, 841.89],
                                var pdf = new jsPDF('t', 'pt', 'a4');
                                for (var i = 0; i <= quotes.clientHeight / 1300; i++) {
                                    var srcImg = canvas;
                                    var sX = 0;
                                    var sY = 1300 * i; // start 980 pixels down for every new page
                                    var sWidth = 900;
                                    var sHeight = 1300;
                                    var dX = 0;
                                    var dY = 0;
                                    var dWidth = 900;
                                    var dHeight = 1300;

                                    window.onePageCanvas = document.createElement("canvas");
                                    onePageCanvas.setAttribute('width', 900);
                                    onePageCanvas.setAttribute('height', 1300);
                                    var ctx = onePageCanvas.getContext('2d');
                                    // details on this usage of this function:
                                    // https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Using_images#Slicing
                                    ctx.drawImage(srcImg, sX, sY, sWidth, sHeight, dX, dY, dWidth, dHeight);

                                    // document.body.appendChild(canvas);
                                    var canvasDataURL = onePageCanvas.toDataURL("image/png", 1.0);

                                    var width = onePageCanvas.width;
                                    var height = onePageCanvas.clientHeight;

                                    //! If we're on anything other than the first page,
                                    // add another page
                                    if (i > 0) {
                                        pdf.addPage('t', 'pt', 'a4'); //8.5" x 11" in pts (in*72)
                                    }
                                    //! now we declare that we're working on that page
                                    pdf.setPage(i + 1);
                                    //! now we add content to that page!
                                    pdf.addImage(canvasDataURL, 'PNG', 20, 20, (width * .63), (height * .62));

                                }

                                //! after the for loop is finished running, we save the pdf.
                                pdf.save(broadcastedName);
                                document.body.removeChild(quotes);
                            }

                        });*/

                        html2canvas(quotes, {
                            onrendered: function (canvas) {
                                //'a4': [595.28, 841.89],
                                var contentWidth = canvas.width;
                                var contentHeight = canvas.height;
                                //一页pdf显示html页面生成的canvas高度;
                                var pageHeight = contentWidth / 592.28 * 841.89;
                                //未生成pdf的html页面高度
                                var leftHeight = contentHeight;
                                //页面偏移
                                var position = 0;
                                //a4纸的尺寸[595.28,841.89]，html页面生成的canvas在pdf中图片的宽高
                                var imgWidth = 595.28;
                                var imgHeight = 592.28 / contentWidth * contentHeight;
                                var pageData = canvas.toDataURL('image/png', 1.0);
                                //注①
                                var pdf = new jsPDF('', 'pt', 'a4');
                                //有两个高度需要区分，一个是html页面的实际高度，和生成pdf的页面高度(841.89)
                                //当内容未超过pdf一页显示的范围，无需分页
                                if (leftHeight < pageHeight) {
                                    pdf.addImage(pageData, 'PNG', 0, 0, imgWidth, imgHeight);
                                } else {
                                    while (leftHeight > 0) {
                                        //arg3-->距离左边距;arg4-->距离上边距;arg5-->宽度;arg6-->高度
                                        pdf.addImage(pageData, 'PNG', 0, position, imgWidth, imgHeight);
                                        leftHeight -= pageHeight;
                                        position -= 841.89;
                                        //避免添加空白页
                                        if (leftHeight > 0) {
                                            //注②
                                            pdf.addPage('', 'pt', 'a4');
                                        }
                                    }
                                }

                                //! after the for loop is finished running, we save the pdf.
                                pdf.save(broadcastedName);
                                document.body.removeChild(quotes);
                            }

                        });

                    }



                });
                // handle the memory leak
                // unbind the event
                scope.$on('$destroy', myListener);

            }

        }

    }]);


    app.service('$pdfStorage', function () {
        this.pdfSaveButtons = [];
        this.pdfSaveContents = [];
    })

    app.component('decorationPagination', {
        templateUrl: '/view/decoration/common/pagination/view.html',
        bindings: {
            simple: '@', // 简化分页
            totalCount: '<',
            currentPage: '<',
            numPerPage: '<',
            onSelectChange: '&',
            onPageChanged: '&'
        },
        controller: ['decoration.pageService', function (pageService) {
            var vm = this;

            vm.$onInit = function () {
                // 最多显示1 2 3 4 5 5个页面按钮
                vm.maxSize = 3;
                // 到（）页  [1,2,3....]
                vm.selectablePages = pageService.getSelectablePages(vm.totalCount, vm.numPerPage);
                // 当前显示(0|第11|1-10)条
                vm.currentDisplay = pageService.getCurrentDisplay(vm.totalCount, vm.numPerPage, vm.currentPage);
                // console.log('init.....................');
                // console.log(vm.currentPage);
            };
            vm.$onChanges = function (changes) {
                // 更新 selectablePages
                vm.selectablePages = pageService.getSelectablePages(vm.totalCount, vm.numPerPage);
                // 更新 currentDisplay
                vm.currentDisplay = pageService.getCurrentDisplay(vm.totalCount, vm.numPerPage, vm.currentPage);
            };
            // 每页 条 变化时  改变numPerPage
            vm.selectChange = function () {
                // 更新每页条数 后 currentPage 设置1
                vm.currentPage = 1;
                // 更新 selectablePages
                vm.selectablePages = pageService.getSelectablePages(vm.totalCount, vm.numPerPage);
                // 更新 currentDisplay
                vm.currentDisplay = pageService.getCurrentDisplay(vm.totalCount, vm.numPerPage, vm.currentPage);
                vm.onSelectChange({
                    $event: {
                        nowSelected: vm.numPerPage
                    }
                });
            };

            //当前页码变化时  改变 currentPage
            vm.pageChanged = function () {
                // 更新 currentDisplay
                // 页码改变 当totalCount == 0  时  currentPage = null
                if (!vm.currentPage) {
                    return;
                }
                vm.currentDisplay = pageService.getCurrentDisplay(vm.totalCount, vm.numPerPage, vm.currentPage);
                vm.onPageChanged({
                    $event: {
                        currentPage: vm.currentPage
                    }
                })
            };

        }],
        controllerAs: 'vm'
    });

    app.component('indoorMapPark', {
        templateUrl: '/common/indoorMapPark.html',
        bindings: {
            mapLng: '<',
            mapLat: '<',
            unClick: '<'
        },
        controller: ['$scope', '$rootScope', '$timeout', '$http', '$state', 'indoorService', function ($scope, $rootScope, $timeout, $http, $state, indoorService) {
            var $ctrl = this;
            var isChangeColor = false;  //当地图底色是否被改变

            $ctrl.themeUrl = "/common/mapComponent/json/indoorMapData/theme/fillcolor.json";
            $scope.mapData = []

            $ctrl.$onInit = function () {
                // 地图配置
                AirocovMap.Config.set({
                    // 楼层间距200
                    showAllFloor: false,
                    count: 100,
                    zoom: 1.3,
                    defaultGap: 18,//楼层间距
                    showMenu: false,//不显示楼层选择,
                    showViewMode: "MODE_2D",
                    theta: 0,
                });
                var parkName = app.park.parkName;//园区名称
                var mapList = [];
                var map;
                $scope.no_map = false;
                $scope.mapload = false;
                $scope.mapData = [];
                var mapList = []
                function addImgMarker(lnglat, map, name) {
                    // var pos = position.split(",")
                    new AirocovMap.Markers.ImageMarker({
                        imgMarker: '/res/img/mark_bs/ICON.png', //图片路径
                        size: 2, //图片大小缩放系数
                        //position:{x:x0,y:y0,z:z0}, //三维坐标系坐标
                        lnglat: lnglat,//[114.3218162017, 30.470431986173], //[Math.abs(lnglat[0]),Math.abs(lnglat[1])], //经纬度坐标
                        y: 100, //三维坐标系坐标y值
                        userData: lnglat,
                        mapCenter: map.getMapCenter(name), //地图中心点
                        callback: function (imgMark) {
                            //将图片标注添加到地图
                            map.addToLayer(imgMark, name, "otherGroup", true);
                        }
                    });
                }
                //获取项目地图数据
                $scope.map = function () {
                    $http.get("/common/mapComponent/json/indoorMapData/mapDataFile.json").success(function (data) {
                        $scope.mapData = data[parkName];
                        if (!$scope.mapData) {
                            $scope.no_map = true;
                        }

                        if ($scope.mapload) {
                            map.resetRender({
                                themeUrl: $ctrl.themeUrl,
                                mapList: [
                                    {
                                        name: 'f1',
                                        mapUrl: $scope.mapData.mapUrl
                                    }
                                ]
                            });
                        } else {
                            // 初始化地图
                            map = new AirocovMap.Map({
                                container: document.querySelector('#selectRoomBox'),
                                // mapList: mapList,
                                //themeUrl: "./res/indoor-data/xwData/parklist/csrjy/cs6/theme/fillcolor.json",
                                mapList: [{
                                    name: 'f1',
                                    mapUrl: $scope.mapData.mapUrl
                                }],
                                themeUrl: $ctrl.themeUrl,
                                logoSrc: "",
                                position: {//设置相机位置
                                    x: 0,
                                    y: 300,
                                    z: 0
                                },
                                zoom: 2
                            });
                        }


                        //地图  加载完成事件
                        map.event.on("loaded", function (e) {
                            console.log($ctrl.unClick)
                            $scope.positionList = [];
                            map.mapLatStr = $ctrl.mapLat
                            map.mapLngStr = $ctrl.mapLng
                            map.unClick = $ctrl.unClick
                            map.clearLayer('f1', "otherGroup", true);
                            $scope.mapload = true;
                            var mapLng = [];
                            var mapLat = []
                            if (map.mapLatStr) {
                                mapLng = map.mapLngStr.split(',');
                                mapLat = map.mapLatStr.split(',');
                            }

                            mapLng && mapLng.forEach((lng, index) => {
                                $scope.positionList.push([lng - 0, mapLat[index] - 0])

                            })
                            for (var i = 0; i < $scope.positionList.length; i++) {
                                addImgMarker($scope.positionList[i], map, 'f1');
                            }

                            $rootScope.$broadcast('birdMap', map);

                        })
                        $scope.position = '';
                        map.event.on("click", function (e) { //注册点击事件
                            // 园区地图  点击事件
                            console.log(e)
                            var arr = [];
                            if (map.unClick) {
                                return
                            }
                            $scope.selectArr = $scope.positionList || []
                            var item = [Math.abs(e.lnglat[0]), Math.abs(e.lnglat[1])]
                            if (e.type == 'marker') {
                                var index = $scope.selectArr.findIndex(v => {
                                    return v.toString() == e.target.info.properties.userData.toString()
                                })
                                console.log(index)
                                $scope.selectArr.splice(index, 1)
                                map.clearLayer('f1', "otherGroup", true);
                                for (var i = 0; i < $scope.selectArr.length; i++) {
                                    addImgMarker($scope.selectArr[i], map, 'f1');
                                }

                            } else {
                                $scope.selectArr.push(item)
                                $scope.position = e.lnglat;
                                e.lnglat = [Math.abs(e.lnglat[0]), Math.abs(e.lnglat[1])]
                                addImgMarker(e.lnglat, map, 'f1')
                            }
                            $rootScope.$broadcast('position', $scope.selectArr); //空间
                            $rootScope.$broadcast('adv', $scope.selectArr); //广告位
                        });

                    })

                }
                $scope.map();

            };


        }],
        controllerAs: 'vm'
    });
    app.service('decoration.pageService', function () {
        // 根据总的数据条数totalCount=11  每页数据条数numPerPage=5  得到pageList = [1,2,3]
        this.getSelectablePages = function (totalCount, numPerPage) {
            var pageList = [];
            var pageCount = Math.ceil(totalCount / numPerPage);
            for (var i = 0; i < pageCount; i++) {
                pageList.push(i + 1);
            }
            return pageList;
        };
        // 根据 数据总条数 每页多少条 当前页码 计算 《共(?)条 当前显示(0|第11|1-10)条》
        this.getCurrentDisplay = function (totalCount, numPerPage, currentPage) {
            // 当前显示的开始项目 编号
            var from = (currentPage - 1) * numPerPage + 1;
            // 当前显示的结束项目 编号
            var to = currentPage * numPerPage > totalCount ? totalCount : currentPage * numPerPage;

            // 显示内容
            var currentDisplay = '';
            if (parseInt(to) === 0) {
                currentDisplay = '0';
            } else if (parseInt(from) === parseInt(to)) {
                currentDisplay = '第' + from;
            } else {
                currentDisplay = from + '-' + to;
            }
            return currentDisplay;
        };
    });
    app.component('todoMvc', {
        templateUrl: '../view/decoration/common/todomvc/view.html',
        controller: 'TodoCtrl',
        bindings: {
            todos: '<'
        },
    })

    app.controller('TodoCtrl', ['$scope', '$filter', 'cacheStorage', '$element', function TodoCtrl($scope, $filter, store, element) {
        'use strict';
        store.todos = this.todos;
        var todos = $scope.todos = store.todos;

        $scope.newTodo = '';
        $scope.editedTodo = null;
        //按下enter键添加数据
        //document绑定全局有污染，改为element绑定
        element.bind("keydown keypress", function (event) {
            if (event.which === 13) {
                $scope.addTodo();
            }
        });
        $scope.addTodo = function () {

            var newTodo = {
                title: $scope.newTodo.trim()
            };

            if (!newTodo.title) {
                return;
            }

            $scope.saving = true;
            store.insert(newTodo)
                .then(function success() {
                    $scope.newTodo = '';
                })
                .finally(function () {
                    $scope.saving = false;
                });
        };

        $scope.editTodo = function (todo) {
            $scope.editedTodo = todo;
            // Clone the original todo to restore it on demand.
            $scope.originalTodo = angular.extend({}, todo);
        };

        $scope.saveEdits = function (todo, event) {
            // Blur events are automatically triggered after the form submit event.
            // This does some unfortunate logic handling to prevent saving twice.
            if (event === 'blur' && $scope.saveEvent === 'submit') {
                $scope.saveEvent = null;
                return;
            }

            $scope.saveEvent = event;

            if ($scope.reverted) {
                // Todo edits were reverted-- don't save.
                $scope.reverted = null;
                return;
            }

            todo.title = todo.title.trim();

            if (todo.title === $scope.originalTodo.title) {
                $scope.editedTodo = null;
                return;
            }

            store[todo.title ? 'put' : 'delete'](todo)
                .then(function success() { }, function error() {
                    todo.title = $scope.originalTodo.title;
                })
                .finally(function () {
                    $scope.editedTodo = null;
                });
        };

        $scope.revertEdits = function (todo) {
            todos[todos.indexOf(todo)] = $scope.originalTodo;
            $scope.editedTodo = null;
            $scope.originalTodo = null;
            $scope.reverted = true;
        };

        $scope.removeTodo = function (todo) {
            store.delete(todo);
        };


    }])

    app.directive('todoEscape', function () {
        'use strict';

        var ESCAPE_KEY = 27;

        return function (scope, elem, attrs) {
            elem.bind('keydown', function (event) {
                if (event.keyCode === ESCAPE_KEY) {
                    scope.$apply(attrs.todoEscape);
                }
            });

            scope.$on('$destroy', function () {
                elem.unbind('keydown');
            });
        };
    })

    app.directive('todoFocus', function todoFocus($timeout) {
        'use strict';

        return function (scope, elem, attrs) {
            scope.$watch(attrs.todoFocus, function (newVal) {
                if (newVal) {
                    $timeout(function () {
                        elem[0].focus();
                    }, 0, false);
                }
            });
        };
    })

    app.factory('cacheStorage', function ($q) {
        'use strict';

        var store = {
            todos: [],

            delete: function (todo) {
                var deferred = $q.defer();

                store.todos.splice(store.todos.indexOf(todo), 1);

                deferred.resolve(store.todos);

                return deferred.promise;
            },

            get: function () {
                var deferred = $q.defer();

                deferred.resolve(store.todos);

                return deferred.promise;
            },

            insert: function (todo) {
                var deferred = $q.defer();

                store.todos.push(todo);

                deferred.resolve(store.todos);

                return deferred.promise;
            },

            put: function (todo) {
                var deferred = $q.defer();

                deferred.resolve(store.todos);

                return deferred.promise;
            }
        };

        return store;
    });
    app.directive('dmDropdownStaticInclude', ['$compile', function ($compile) {
        return function (scope, element, attrs) {
            var template = attrs.dmDropdownStaticInclude;
            var contents = element.html(template).contents();
            $compile(contents)(scope);
        };
    }]);
    app.directive('ngDropdownMultiselect', ['$filter', '$document', '$compile', '$parse', function ($filter, $document, $compile, $parse) {
        return {
            restrict: 'AE',
            scope: {
                selectedModel: '=',
                options: '=',
                extraSettings: '=',
                events: '=',
                searchFilter: '=?',
                translationTexts: '=',
                groupBy: '@',
                disabled: "="
            },
            template: function (element, attrs) {
                var checkboxes = attrs.checkboxes ? true : false;
                var groups = attrs.groupBy ? true : false;

                var template = '<div class="multiselect-parent btn-group dropdown-multiselect" ng-class="{open: open}">';
                template += '<button ng-disabled="disabled" type="button" class="dropdown-toggle" ng-class="settings.buttonClasses" ng-click="toggleDropdown()">{{getButtonText()}}&nbsp;<span class="caret"></span></button>';
                template += '<ul class="dropdown-menu dropdown-menu-form" ng-if="open" ng-style="{display: open ? \'block\' : \'none\', height : settings.scrollable ? settings.scrollableHeight : \'auto\', overflow: \'auto\' }" >';
                template += '<li ng-if="settings.showCheckAll && settings.selectionLimit !== 1"><a ng-keydown="keyDownLink($event)" data-ng-click="selectAll()" tabindex="-1" id="selectAll"><span class="glyphicon glyphicon-ok"></span>  {{texts.checkAll}}</a>';
                template += '<li ng-if="settings.showUncheckAll"><a ng-keydown="keyDownLink($event)" data-ng-click="deselectAll();" tabindex="-1" id="deselectAll"><span class="glyphicon glyphicon-remove"></span>   {{texts.uncheckAll}}</a></li>';
                template += '<li ng-if="settings.selectByGroups && ((settings.showCheckAll && settings.selectionLimit > 0) || settings.showUncheckAll)" class="divider"></li>';
                template += '<li ng-if="settings.selectByGroups && ((settings.showCheckAll && settings.selectionLimit > 0) || settings.showUncheckAll)" class="divider"></li>';
                template += '<li ng-repeat="currentGroup in settings.selectByGroups track by $index" ng-click="selectCurrentGroup(currentGroup)"><a ng-class="{\'dropdown-selected-group\': selectedGroup === currentGroup}" tabindex="-1">{{::texts.selectGroup}} {{::getGroupLabel(currentGroup)}}</a></li>';
                template += '<li ng-if="settings.selectByGroups && settings.showEnableSearchButton" class="divider"></li>';
                template += '<li ng-if="settings.showEnableSearchButton && settings.enableSearch"><a ng-keydown="keyDownLink($event); keyDownToggleSearch();" ng-click="toggleSearch($event);" tabindex="-1">{{texts.disableSearch}}</a></li>';
                template += '<li ng-if="settings.showEnableSearchButton && !settings.enableSearch"><a ng-keydown="keyDownLink($event); keyDownToggleSearch();" ng-click="toggleSearch($event);" tabindex="-1">{{texts.enableSearch}}</a></li>';
                template += '<li ng-if="(settings.showCheckAll && settings.selectionLimit > 0) || settings.showUncheckAll || settings.showEnableSearchButton" class="divider"></li>';
                template += '<li ng-if="settings.enableSearch"><div class="dropdown-header"><input type="text" class="form-control searchField" ng-keydown="keyDownSearchDefault($event); keyDownSearch($event, input.searchFilter);" ng-style="{width: \'100%\'}" ng-model="input.searchFilter" placeholder="{{texts.searchPlaceholder}}" /></li>';
                template += '<li ng-if="settings.enableSearch" class="divider"></li>';

                if (groups) {
                    template += '<li ng-repeat-start="option in orderedItems | filter:getFilter(input.searchFilter)" ng-show="getPropertyForObject(option, settings.groupBy) !== getPropertyForObject(orderedItems[$index - 1], settings.groupBy)" role="presentation" class="dropdown-header">{{ getGroupLabel(getPropertyForObject(option, settings.groupBy)) }}</li>';
                    template += '<li ng-class="{\'active\': isChecked(getPropertyForObject(option,settings.idProp)) && settings.styleActive}" ng-repeat-end role="presentation">';
                } else {
                    template += '<li ng-class="{\'active\': isChecked(getPropertyForObject(option,settings.idProp)) && settings.styleActive}" role="presentation" ng-repeat="option in options | filter:getFilter(input.searchFilter)">';
                }

                template += '<a ng-keydown="option.disabled || keyDownLink($event)" role="menuitem" class="option" tabindex="-1" ng-click="option.disabled || setSelectedItem(getPropertyForObject(option,settings.idProp), false, true)" ng-disabled="option.disabled">';

                if (checkboxes) {
                    template += '<div class="checkbox"><label><input class="checkboxInput" type="checkbox" ng-click="checkboxClick($event, getPropertyForObject(option,settings.idProp))" ng-checked="isChecked(getPropertyForObject(option,settings.idProp))" /> <span dm-dropdown-static-include="{{settings.template}}"></div></label></span></a>';
                } else {
                    template += '<span data-ng-class="{\'glyphicon glyphicon-ok\': isChecked(getPropertyForObject(option,settings.idProp))}"> </span> <span dm-dropdown-static-include="{{settings.template}}"></span></a>';
                }

                template += '</li>';

                template += '<li class="divider" ng-show="settings.selectionLimit > 1"></li>';
                template += '<li role="presentation" ng-show="settings.selectionLimit > 1"><a role="menuitem">{{selectedModel.length}} {{texts.selectionOf}} {{settings.selectionLimit}} {{texts.selectionCount}}</a></li>';

                template += '</ul>';
                template += '</div>';

                return template;
            },
            link: function ($scope, $element, $attrs) {
                var $dropdownTrigger = $element.children()[0];

                $scope.toggleDropdown = function () {
                    if ($scope.open) {
                        $scope.close()
                    } else { $scope.open = true }
                    if ($scope.settings.keyboardControls) {
                        if ($scope.open) {
                            if ($scope.settings.selectionLimit === 1 && $scope.settings.enableSearch) {
                                setTimeout(function () {
                                    angular.element($element)[0].querySelector('.searchField').focus();
                                }, 0);
                            } else {
                                focusFirstOption();
                            }
                        }
                    }
                    if ($scope.settings.enableSearch) {
                        if ($scope.open) {
                            setTimeout(function () {
                                angular.element($element)[0].querySelector('.searchField').focus();
                            }, 0);
                        }
                    }
                };

                $scope.checkboxClick = function ($event, id) {
                    $scope.setSelectedItem(id, false, true);
                    $event.stopImmediatePropagation();
                };

                $scope.externalEvents = {
                    onItemSelect: angular.noop,
                    onItemDeselect: angular.noop,
                    onSelectAll: angular.noop,
                    onDeselectAll: angular.noop,
                    onInitDone: angular.noop,
                    onMaxSelectionReached: angular.noop,
                    onSelectionChanged: angular.noop,
                    onClose: angular.noop
                };

                $scope.settings = {
                    dynamicTitle: true,
                    scrollable: false,
                    scrollableHeight: '300px',
                    closeOnBlur: true,
                    displayProp: 'label',
                    idProp: 'id',
                    externalIdProp: 'id',
                    enableSearch: false,
                    selectionLimit: 0,
                    showCheckAll: true,
                    showUncheckAll: true,
                    showEnableSearchButton: false,
                    closeOnSelect: false,
                    buttonClasses: 'btn btn-default',
                    closeOnDeselect: false,
                    groupBy: $attrs.groupBy || undefined,
                    groupByTextProvider: null,
                    smartButtonMaxItems: 0,
                    smartButtonTextConverter: angular.noop,
                    styleActive: false,
                    keyboardControls: false,
                    template: '{{getPropertyForObject(option, settings.displayProp)}}',
                    searchField: '$',
                    showAllSelectedText: false
                };

                $scope.texts = {
                    checkAll: 'Check All',
                    uncheckAll: 'Uncheck All',
                    selectionCount: 'checked',
                    selectionOf: '/',
                    searchPlaceholder: 'Search...',
                    buttonDefaultText: 'Select',
                    dynamicButtonTextSuffix: 'checked',
                    disableSearch: 'Disable search',
                    enableSearch: 'Enable search',
                    selectGroup: 'Select all:',
                    allSelectedText: 'All'
                };

                $scope.input = {
                    searchFilter: $scope.searchFilter || ''
                };

                if (angular.isDefined($scope.settings.groupBy)) {
                    $scope.$watch('options', function (newValue) {
                        if (angular.isDefined(newValue)) {
                            $scope.orderedItems = $filter('orderBy')(newValue, $scope.settings.groupBy);
                        }
                    });
                }

                $scope.$watch('selectedModel', function (newValue) {
                    if (!Array.isArray(newValue)) {
                        $scope.singleSelection = true;
                    } else {
                        $scope.singleSelection = false;
                    }
                });

                $scope.close = function () {
                    $scope.open = false;
                    $scope.externalEvents.onClose();
                }

                $scope.selectCurrentGroup = function (currentGroup) {
                    $scope.selectedModel.splice(0, $scope.selectedModel.length);
                    if ($scope.orderedItems) {
                        $scope.orderedItems.forEach(function (item) {
                            if (item[$scope.groupBy] === currentGroup) {
                                $scope.setSelectedItem($scope.getPropertyForObject(item, $scope.settings.idProp), false, false)
                            }
                        });
                    }
                    $scope.externalEvents.onSelectionChanged();
                };

                angular.extend($scope.settings, $scope.extraSettings || []);
                angular.extend($scope.externalEvents, $scope.events || []);
                angular.extend($scope.texts, $scope.translationTexts);

                $scope.singleSelection = $scope.settings.selectionLimit === 1;

                function getFindObj(id) {
                    var findObj = {};

                    if ($scope.settings.externalIdProp === '') {
                        findObj[$scope.settings.idProp] = id;
                    } else {
                        findObj[$scope.settings.externalIdProp] = id;
                    }

                    return findObj;
                }

                function clearObject(object) {
                    for (var prop in object) {
                        delete object[prop];
                    }
                }

                if ($scope.singleSelection) {
                    if (angular.isArray($scope.selectedModel) && $scope.selectedModel.length === 0) {
                        clearObject($scope.selectedModel);
                    }
                }

                if ($scope.settings.closeOnBlur) {
                    $document.on('click', function (e) {
                        if ($scope.open) {
                            var target = e.target.parentElement;
                            var parentFound = false;

                            while (angular.isDefined(target) && target !== null && !parentFound) {
                                if (!!target.className.split && contains(target.className.split(' '), 'multiselect-parent') && !parentFound) {
                                    if (target === $dropdownTrigger) {
                                        parentFound = true;
                                    }
                                }
                                target = target.parentElement;
                            }

                            if (!parentFound) {
                                $scope.$apply(function () {
                                    $scope.close();
                                });
                            }
                        }
                    });
                }

                $scope.getGroupLabel = function (groupValue) {
                    if ($scope.settings.groupByTextProvider !== null) {
                        return $scope.settings.groupByTextProvider(groupValue);
                    }

                    return groupValue;
                };

                function textWidth(text) {
                    var $btn = $element.find('button');
                    var canvas = document.createElement('canvas');
                    var ctx = canvas.getContext('2d');
                    ctx.font = $btn.css('font-size') + $btn.css('font-family');
                    // http://stackoverflow.com/questions/38823353/chrome-canvas-2d-context-measuretext-giving-me-weird-results
                    ctx.originalFont = $btn.css('font-size') + $btn.css('font-family');
                    ctx.fillStyle = '#000000';
                    return ctx.measureText(text).width;
                }

                $scope.getButtonText = function () {
                    if ($scope.settings.dynamicTitle && $scope.selectedModel && ($scope.selectedModel.length > 0 || (angular.isObject($scope.selectedModel) && Object.keys($scope.selectedModel).length > 0))) {
                        if ($scope.settings.smartButtonMaxItems > 0) {

                            var paddingWidth = 12 * 2,
                                borderWidth = 1 * 2,
                                dropdownIconWidth = 8;
                            var widthLimit = $element[0].offsetWidth - paddingWidth - borderWidth - dropdownIconWidth;

                            var itemsText = [];

                            angular.forEach($scope.options, function (optionItem) {
                                if ($scope.isChecked($scope.getPropertyForObject(optionItem, $scope.settings.idProp))) {
                                    var displayText = $scope.getPropertyForObject(optionItem, $scope.settings.displayProp);
                                    var converterResponse = $scope.settings.smartButtonTextConverter(displayText, optionItem);

                                    itemsText.push(converterResponse ? converterResponse : displayText);
                                }
                            });

                            if ($scope.selectedModel.length > $scope.settings.smartButtonMaxItems) {
                                itemsText = itemsText.slice(0, $scope.settings.smartButtonMaxItems);
                                itemsText.push('...');
                            }

                            var result = itemsText.join(', ');
                            var index = result.length - 4;
                            if ($element[0].offsetWidth === 0)
                                return result;
                            while (textWidth(result) > widthLimit && index > 0) {
                                if (itemsText[itemsText.length - 1] !== "...") {
                                    itemsText.push('...');
                                    result = result + "...";
                                }
                                result = result.slice(0, index) + result.slice(index + 1);
                                index--;
                            }

                            return result;
                        } else {
                            var totalSelected;

                            if ($scope.singleSelection) {
                                totalSelected = ($scope.selectedModel !== null && angular.isDefined($scope.selectedModel[$scope.settings.idProp])) ? 1 : 0;
                            } else {
                                totalSelected = angular.isDefined($scope.selectedModel) ? $scope.selectedModel.length : 0;
                            }

                            if (totalSelected === 0) {
                                return $scope.texts.buttonDefaultText;
                            }

                            if ($scope.settings.showAllSelectedText && totalSelected === $scope.options.length) {
                                return $scope.texts.allSelectedText;
                            }

                            return totalSelected + ' ' + $scope.texts.dynamicButtonTextSuffix;
                        }
                    } else {
                        return $scope.texts.buttonDefaultText;
                    }
                };

                $scope.getPropertyForObject = function (object, property) {
                    if (angular.isDefined(object) && object.hasOwnProperty(property)) {
                        return object[property];
                    }

                    return undefined;
                };

                $scope.selectAll = function () {
                    var searchResult;
                    $scope.deselectAll(true);
                    $scope.externalEvents.onSelectAll();

                    searchResult = $filter('filter')($scope.options, $scope.getFilter($scope.input.searchFilter));
                    angular.forEach(searchResult, function (value) {
                        $scope.setSelectedItem(value[$scope.settings.idProp], true, false);
                    });
                    $scope.externalEvents.onSelectionChanged();
                    $scope.selectedGroup = null;
                };

                $scope.deselectAll = function (dontSendEvent) {
                    dontSendEvent = dontSendEvent || false;

                    if (!dontSendEvent) {
                        $scope.externalEvents.onDeselectAll();
                    }

                    if ($scope.singleSelection) {
                        clearObject($scope.selectedModel);
                    } else {
                        $scope.selectedModel.splice(0, $scope.selectedModel.length);
                    }
                    if (!dontSendEvent) {
                        $scope.externalEvents.onSelectionChanged();
                    }
                    $scope.selectedGroup = null;
                };

                $scope.setSelectedItem = function (id, dontRemove, fireSelectionChange) {
                    var findObj = getFindObj(id);
                    var finalObj = null;

                    if ($scope.settings.externalIdProp === '') {
                        finalObj = find($scope.options, findObj);
                    } else {
                        finalObj = findObj;
                    }

                    if ($scope.singleSelection) {
                        clearObject($scope.selectedModel);
                        angular.extend($scope.selectedModel, finalObj);
                        if (fireSelectionChange) {
                            $scope.externalEvents.onItemSelect(finalObj);
                        }
                        if ($scope.settings.closeOnSelect || $scope.settings.closeOnDeselect) $scope.close();
                    } else {
                        dontRemove = dontRemove || false;

                        var exists = findIndex($scope.selectedModel, findObj) !== -1;

                        if (!dontRemove && exists) {
                            $scope.selectedModel.splice(findIndex($scope.selectedModel, findObj), 1);
                            $scope.externalEvents.onItemDeselect(findObj);
                            if ($scope.settings.closeOnDeselect) $scope.close();
                        } else if (!exists && ($scope.settings.selectionLimit === 0 || $scope.selectedModel.length < $scope.settings.selectionLimit)) {
                            $scope.selectedModel.push(finalObj);
                            if (fireSelectionChange) {
                                $scope.externalEvents.onItemSelect(finalObj);
                            }
                            if ($scope.settings.closeOnSelect) $scope.close();
                            if ($scope.settings.selectionLimit > 0 && $scope.selectedModel.length === $scope.settings.selectionLimit) {
                                $scope.externalEvents.onMaxSelectionReached();
                            }
                        }
                    }
                    if (fireSelectionChange) {
                        $scope.externalEvents.onSelectionChanged();
                    }
                    $scope.selectedGroup = null;
                };

                $scope.isChecked = function (id) {
                    if ($scope.singleSelection) {
                        if ($scope.settings.externalIdProp === '') {
                            return $scope.selectedModel !== null && angular.isDefined($scope.selectedModel[$scope.settings.idProp]) && $scope.selectedModel[$scope.settings.idProp] === getFindObj(id)[$scope.settings.idProp];
                        }
                        return $scope.selectedModel !== null && angular.isDefined($scope.selectedModel[$scope.settings.externalIdProp]) && $scope.selectedModel[$scope.settings.externalIdProp] === getFindObj(id)[$scope.settings.externalIdProp];
                    }

                    return findIndex($scope.selectedModel, getFindObj(id)) !== -1;
                };

                $scope.externalEvents.onInitDone();

                $scope.keyDownLink = function (event) {
                    var sourceScope = angular.element(event.target).scope();
                    var nextOption;
                    var parent = event.target.parentNode;
                    if (!$scope.settings.keyboardControls) {
                        return;
                    }
                    if (event.keyCode === 13 || event.keyCode === 32) { // enter
                        event.preventDefault();
                        if (!!sourceScope.option) {
                            $scope.setSelectedItem($scope.getPropertyForObject(sourceScope.option, $scope.settings.idProp), false, true);
                        } else if (event.target.id === 'deselectAll') {
                            $scope.deselectAll();
                        } else if (event.target.id === 'selectAll') {
                            $scope.selectAll();
                        }
                    } else if (event.keyCode === 38) { // up arrow
                        event.preventDefault();
                        if (!!parent.previousElementSibling) {
                            nextOption = parent.previousElementSibling.querySelector('a') || parent.previousElementSibling.querySelector('input');
                        }
                        while (!nextOption && !!parent) {
                            parent = parent.previousElementSibling;
                            if (!!parent) {
                                nextOption = parent.querySelector('a') || parent.querySelector('input');
                            }
                        }
                        if (!!nextOption) {
                            nextOption.focus();
                        }
                    } else if (event.keyCode === 40) { // down arrow
                        event.preventDefault();
                        if (!!parent.nextElementSibling) {
                            nextOption = parent.nextElementSibling.querySelector('a') || parent.nextElementSibling.querySelector('input');
                        }
                        while (!nextOption && !!parent) {
                            parent = parent.nextElementSibling;
                            if (!!parent) {
                                nextOption = parent.querySelector('a') || parent.querySelector('input');
                            }
                        }
                        if (!!nextOption) {
                            nextOption.focus();
                        }
                    } else if (event.keyCode === 27) {
                        event.preventDefault();

                        $scope.toggleDropdown();
                    }
                };

                $scope.keyDownSearchDefault = function (event) {
                    var parent = event.target.parentNode.parentNode;
                    var nextOption;
                    if (!$scope.settings.keyboardControls) {
                        return;
                    }
                    if (event.keyCode === 9 || event.keyCode === 40) { //tab
                        event.preventDefault();
                        focusFirstOption();
                    } else if (event.keyCode === 38) {
                        event.preventDefault();
                        if (!!parent.previousElementSibling) {
                            nextOption = parent.previousElementSibling.querySelector('a') || parent.previousElementSibling.querySelector('input');
                        }
                        while (!nextOption && !!parent) {
                            parent = parent.previousElementSibling;
                            if (!!parent) {
                                nextOption = parent.querySelector('a') || parent.querySelector('input');
                            }
                        }
                        if (!!nextOption) {
                            nextOption.focus();
                        }
                    } else if (event.keyCode === 27) {
                        event.preventDefault();

                        $scope.toggleDropdown();
                    }
                };

                $scope.keyDownSearch = function (event, searchFilter) {
                    var searchResult;
                    if (!$scope.settings.keyboardControls) {
                        return;
                    }
                    if (event.keyCode === 13) {
                        if ($scope.settings.selectionLimit === 1 && $scope.settings.enableSearch) {
                            searchResult = $filter('filter')($scope.options, $scope.getFilter(searchFilter));
                            if (searchResult.length === 1) {
                                $scope.setSelectedItem($scope.getPropertyForObject(searchResult[0], $scope.settings.idProp), false, true);
                            }
                        } else if ($scope.settings.enableSearch) {
                            $scope.selectAll();
                        }
                    }
                };

                $scope.getFilter = function (searchFilter) {
                    var filter = {};
                    filter[$scope.settings.searchField] = searchFilter;
                    return filter;
                };

                $scope.toggleSearch = function ($event) {
                    if ($event) {
                        $event.stopPropagation();
                    }
                    $scope.settings.enableSearch = !$scope.settings.enableSearch;
                    if (!$scope.settings.enableSearch) {
                        $scope.input.searchFilter = '';
                    }
                };

                $scope.keyDownToggleSearch = function () {
                    if (!$scope.settings.keyboardControls) {
                        return;
                    }
                    if (event.keyCode === 13) {
                        $scope.toggleSearch();
                        if ($scope.settings.enableSearch) {
                            setTimeout(
                                function () {
                                    angular.element($element)[0].querySelector('.searchField').focus();
                                }, 0
                            );
                        } else {
                            focusFirstOption();
                        }
                    }
                };

                function focusFirstOption() {
                    setTimeout(function () {
                        var elementToFocus = angular.element($element)[0].querySelector('.option');
                        if (angular.isDefined(elementToFocus) && elementToFocus != null) {
                            elementToFocus.focus();
                        }
                    }, 0);
                }
            }
        };
    }]);

    function contains(collection, target) {
        var containsTarget = false;
        collection.some(function (object) {
            if (object === target) {
                containsTarget = true;
                return true;
            }
        });
        return containsTarget;
    }

    function find(collection, properties) {
        var target;

        collection.some(function (object) {
            var hasAllSameProperties = true;
            Object.keys(properties).forEach(function (key) {
                if (object[key] !== properties[key]) {
                    hasAllSameProperties = false;
                }
            });
            if (hasAllSameProperties) {
                target = object;
                return true
            }
        });

        return target;
    }

    function findIndex(collection, properties) {
        var index = -1;
        var counter = -1;

        collection.some(function (object) {
            var hasAllSameProperties = true;
            counter += 1;
            Object.keys(properties).forEach(function (key) {
                if (object[key] !== properties[key]) {
                    hasAllSameProperties = false;
                }
            });
            if (hasAllSameProperties) {
                index = counter;
                return true
            }
        });

        return index;
    }


    /**
     * table 冻结column指令
     *
     * 实现得不是很好，随时可能更改api,请谨慎使用
     *
     * 使用方法：
     * 在table外套一层 fixed-columns-table
     * 左边需要冻结的列的数量：left-fixed-number
     * 右边需要冻结的列的数量：right-fixed-number
     *
     * <div fixed-columns-table left-fixed-number="2" right-fixed-number="1">
     * 		<table>
     * 			...
     * 			<tr ng-repeat="  " on-repeat-render-finished>
     * 			...
     * 		</table>
     * </div>
     *
     *
     * 如果在modal或tabset中使用  请添加useAsync属性
     *
     * <div fixed-columns-table left-fixed-number="2" right-fixed-number="1" use-async="true">
     * 		<table>
     * 			...
     * 			<tr ng-repeat="  " on-repeat-render-finished>
     * 			...
     * 		</table>
     * </div>
     *
     * useAsync 会添加一个$interval来watch table 是否已经在浏览器渲染完成 有一定的性能损耗 非异步场景不要使用useAsync
     *
     */
    app.directive("fixedColumnsTable", ['$timeout', '$interval', '$q', function ($timeout, $interval, $q) {
        return {
            restrict: "A",
            template: "<div class='table-responsive'><div ng-transclude></div></div>",
            transclude: true,
            link: function (scope, $element, $attrs) {
                // console.log('link00000');
                // console.log($attrs);
                // console.log(scope);
                // 获取要冻结的列的数目   leftFixedNumber : 左侧要冻结的列的个数 rightFixedNumber：右侧要冻结的列的个数
                var leftNumber = $attrs.leftFixedNumber || 0,
                    rightNumber = $attrs.rightFixedNumber || 0;

                var useAsync = $attrs.useAsync;

                // table渲染 promise
                var tableRenderPromise = function ($element, leftNumber, rightNumber, useAsync) {
                    return $q(function (resolve, reject) {
                        console.log(useAsync);
                        if (!useAsync) {
                            resolve();
                            return;
                        }
                        var stop = $interval(function () {
                            // console.log('useasync......');
                            // div offsetWidth>0 的时候 认为渲染完成
                            if ($element[0].offsetWidth > 0) {
                                $interval.cancel(stop);
                                stop = undefined;
                                resolve();
                            }
                        }, 13);
                    });
                }

                scope.$on('ngRepeatRenderFinished', function (e, ele) {
                    // 阻止事件继续向上传播
                    e.stopPropagation();
                    // console.log('repeat finished');
                    // console.log(e);
                    // console.log(ele);
                    // console.log('alkjsfgjss');
                    tableRenderPromise($element, leftNumber, rightNumber, useAsync).then(function () {
                        // 设置列
                        var styleOption = getFixedColumnsCss($element, leftNumber, rightNumber);
                        // 设置 table margin
                        styleTableMargin($element, styleOption.tblMarginLeft, styleOption.tblMarginRight);
                        styleFixedColumns($element, styleOption.leftWidthList, styleOption.rightWidthList, styleOption.accLeft, styleOption.accRight);
                        // 再设置一次
                        $timeout(function () {
                            styleFixedColumns($element, styleOption.leftWidthList, styleOption.rightWidthList, styleOption.accLeft, styleOption.accRight);
                        }, 0);
                    });
                });

                // 获取table 原有的css
                function getFixedColumnsCss($element, leftNumber, rightNumber) {
                    // 表头处理
                    var trs = $element.find('tr');
                    var theadTr = trs[0];
                    var ths = [].slice.call(theadTr.children, 0);
                    // 左侧冻结两列 右侧冻结两列为例 leftWidthList = [100, 50] 代表左侧两个td/th的宽度 右侧相同
                    var leftWidthList = [],
                        rightWidthList = [];
                    // accLeft 列宽的累加 假如leftWidthList = [100, 50, 200] accLeft=[0, 100, 150, 350] 前面的n-1个 用于设置left 最后一个350用于设置tableCover responsive-table的margin-left,右侧相同
                    var accLeft = ths.reduce(function (arr, v, i) {
                        if (i < leftNumber) {
                            var itemWidth = v.style.width ? parseInt(v.style.width) : v.offsetWidth;
                            leftWidthList.push(itemWidth);
                            var left = arr[arr.length - 1] + itemWidth;
                            arr.push(left);
                        }
                        return arr;
                    }, [0]);

                    var accRight = ths.reduceRight(function (arr, v, i) {
                        if (ths.length - i <= rightNumber) {
                            var itemWidth = v.style.width ? parseInt(v.style.width) : v.offsetWidth;
                            rightWidthList.push(itemWidth);
                            var right = arr[arr.length - 1] + itemWidth;
                            arr.push(right);
                        }
                        return arr;
                    }, [0]);

                    // 如上所述 设置tablecover的margin
                    var tblMarginLeft = accLeft.pop(),
                        tblMarginRight = accRight.pop();

                    return {
                        tblMarginLeft: tblMarginLeft,
                        tblMarginRight: tblMarginRight,
                        leftWidthList: leftWidthList,
                        rightWidthList: rightWidthList,
                        accLeft: accLeft,
                        accRight: accRight
                    };
                }
                // 设置table margin
                function styleTableMargin($element, tblMarginLeft, tblMarginRight) {
                    angular.element($element[0].children[0]).css({
                        marginLeft: tblMarginLeft + 'px',
                        marginRight: tblMarginRight + 'px'
                    });
                }
                // 设置table 冻结列
                function styleFixedColumns($element, leftWidthList, rightWidthList, accLeft, accRight) {
                    if (!$element) {
                        return;
                    }
                    // 每一行的高度
                    var heightList = [];
                    var trs = $element.find('tr');
                    angular.forEach(trs, function (tr, i) {
                        // 左边冻结2列 则区第3个td的高度代表本行的高度
                        // var obj = [].slice.call(tr.children, 0)[leftNumber];
                        // var height = obj.offsetHeight;
                        var height = tr.offsetHeight
                        heightList.push(height);
                    });
                    // console.log('height');
                    // console.log(heightList);
                    // 循环每一行 设置每一个冻结列的样式
                    angular.forEach(trs, function (tr, row) {
                        var trChilds = [].slice.call(tr.children, 0);
                        //左侧冻结列
                        accLeft.forEach(function (left, i) {
                            angular.element(trChilds[i]).css({
                                position: 'absolute',
                                left: left + 'px',
                                top: 'auto',
                                width: leftWidthList[i] + 'px',
                                height: heightList[row] + 'px',
                                lineHeight: heightList[row] + 'px',
                                padding: 0,
                                textAlign: 'center'
                            });
                        });
                        // 右侧冻结列
                        accRight.forEach(function (right, i) {
                            angular.element(trChilds[trChilds.length - 1 - i]).css({
                                position: 'absolute',
                                right: right + 'px',
                                top: 'auto',
                                width: rightWidthList[i] + 'px',
                                height: heightList[row] + 'px',
                                lineHeight: heightList[row] + 'px',
                                padding: 0,
                                textAlign: 'center'
                            });
                        });
                    });

                }

            }
        };
    }]);
    // repeat 每次更新数据完成时触发 ngRepeatRenderFinished事件 供冻结column指令使用
    app.directive('onRepeatRenderFinished', function ($timeout) {
        return {
            restrict: 'A',
            link: function (scope, element, attr) {
                if (scope.$last === true) {
                    $timeout(function () {
                        //这里element, 就是ng-repeat渲染的最后一个元素
                        scope.$emit('ngRepeatRenderFinished', element);
                    });
                }
            }
        };
    });

    /**
     * ng-laydate指令
     * 基于laydate
     */
    app.directive('ngLayDate', function ($timeout, $filter) {
        return {
            require: '?ngModel',
            restrict: 'A',
            scope: {
                ngModel: '=',
                maxDate: '@?',
                minDate: '@?'
            },
            link: function (scope, element, attr, ngModel) {
                var _date = null,
                    _config = {};
                // 渲染模板完成后执行
                $timeout(function () {
                    // 初始化参数
                    _config = {
                        elem: element[0],
                        format: attr.format != undefined && attr.format != '' ? attr.format : 'yyyy-MM-dd',
                        type: (attr.format == 'HH:mm:ss' || attr.format == 'HH:mm') ? 'time' :  'date',
                        done: function (data) {
                            ngModel.$setViewValue(data);
                            /* scope.$apply(setViewValue);*/
                        },
                        clear: function () {
                            ngModel.$setViewValue('');
                        }
                    };

                    if (attr.maxDate) {
                        _config.max = attr.maxDate;
                    }
                    if (attr.minDate) {
                        _config.min = attr.minDate;
                    }
                    if (attr.format == 'HH:mm') {
                        $('.layui-laydate-content>.layui-laydate-list').css({ 'padding-bottom': '0px', 'overflow': 'hidden' })
                        $('.layui-laydate-content>.layui-laydate-list>li').css({ 'width': '50%' })
                        $('.merge-box .scrollbox .merge-list').css({ 'padding-bottom': '5px' })
                    }


                    // 监听日期最大值
                    if (attr.hasOwnProperty('maxDate')) {
                        attr.$observe('maxDate', function (val) {
                            _config.max = val;
                        })
                    }
                    // 监听日期最小值
                    if (attr.hasOwnProperty('minDate')) {
                        attr.$observe('minDate', function (val) {
                            _config.min = val;
                        })
                    }
                    _date = laydate.render(_config);
                    var dateTop=0
                    $('.modal ')[0] &&  $('.modal ')[0].addEventListener("scroll", function(){
                        //解决页面滚动时,日期选择器无法跟随页面滚动而滚动
                        
                        var top=0
                        if(!$('.layui-laydate')[0]){
                           return
                        }
                        dateTop=dateTop || $('.layui-laydate')[0].style['top'] //获取第一次开始日期选择器时 元素距离顶部的距离
                        
                        var px=dateTop.replace(/px/, "")- 0
                      
                      
                        top=px-$('.modal ').scrollTop() //日期选择器距离顶部的最终距离=第一次开始日期选择器时 元素距离顶部的距离 -  模态框滚动的距离
                       
                    
                      
                       var co=px
                       var num=co - $('.modal ').scrollTop()
                      $(".layui-laydate").css("top",num+'px');
                  
                       
                      }); 

                    // 模型值同步到视图上
                    ngModel.$render = function () {
                        element.val(ngModel.$viewValue || '');
                    }

                    // 监听元素上的事件
                    /* element.on('blur keyup change', function() {
                     scope.$apply(setViewValue);
                     });*/

                    setViewValue();

                    // 更新模型上的视图值
                    function setViewValue() {
                        var val = element.val();
                        /* ngModel.$setViewValue(val);*/
                    }
                }, 0);
            }
        };
    });
    app.directive('ngLayRange', function ($timeout, $filter) {
        return {
            require: '?ngModel',
            restrict: 'A',
            scope: {
                ngModel: '=',
                maxDate: '@?',
                minDate: '@?',
                dateFormat: '@?',
                dateType: '@?',
            },
            link: function (scope, element, attr, ngModel) {
                var _date = null,
                    _config = {};
                // 渲染模板完成后执行
                $timeout(function () {
                    // 初始化参数
                    _config = {
                        elem: element[0],
                        format: attr.dateFormat || 'HH:mm',
                        type: attr.dateType || 'time',
                        range: '-',
                        // show: true,
                        trigger: 'click',
                        closeStop: element[0],

                        done: function (data, date, endDate) {
                            ngModel.$setViewValue(data);
                            /* scope.$apply(setViewValue);*/
                        },


                        clear: function () {
                            ngModel.$setViewValue('');
                        }
                    };
                    if (attr.maxDate) {
                        _config.max = attr.maxDate;
                    }
                    if (attr.minDate) {
                        _config.min = attr.minDate;
                    }
                    if (_config.format == 'HH:mm') {
                        $('.layui-laydate-content>.layui-laydate-list').css({
                            'padding-bottom': '0px',
                            'overflow': 'hidden'
                        })
                        $('.layui-laydate-content>.layui-laydate-list>li').css({ 'width': '50%' })
                        $('.merge-box .scrollbox .merge-list').css({ 'padding-bottom': '5px' })
                    }
                    // 监听日期最大值
                    if (attr.hasOwnProperty('maxDate')) {
                        attr.$observe('maxDate', function (val) {
                            _config.max = val;
                        })
                    }
                    // 监听日期最小值
                    if (attr.hasOwnProperty('minDate')) {
                        attr.$observe('minDate', function (val) {
                            _config.min = val;
                        })
                    }
                    _date = laydate.render(_config);

                    // 模型值同步到视图上
                    ngModel.$render = function () {
                        element.val(ngModel.$viewValue || '');
                    }

                    // 监听元素上的事件
                    /* element.on('blur keyup change', function() {
                     scope.$apply(setViewValue);
                     });*/

                    setViewValue();

                    // 更新模型上的视图值
                    function setViewValue() {
                        var val = element.val();
                        /* ngModel.$setViewValue(val);*/
                    }
                }, 0);
            }
        };
    });
    app.directive('ngLayDateRange', function ($timeout, $filter) {
        return {
            require: '?ngModel',
            restrict: 'A',
            scope: {
                ngModel: '=',
                maxDate: '@?',
                minDate: '@?',
                callBack:'=',
                dateObj:"=dateObj",
                dateCopy:"=dateCopy",
                minMax:'@?'
            },
            link: function (scope, element, attr, ngModel) {
                var _date = null,
                    _config = {};
                // 渲染模板完成后执行
                $timeout(function () {
                    // 初始化参数
                    _config = {
                        elem: element[0],
                        format:  'yyyy-MM-dd',
                        type:  'date',
                       

                        done: function (data,value) {
                          
                            scope.callBack && scope.callBack(scope.dateCopy,scope.minMax,value);
                       
                           
                            ngModel.$setViewValue(data);
                            /* scope.$apply(setViewValue);*/
                        },
                        clear: function () {
                            ngModel.$setViewValue('');
                        },
                        
                    };

                    if (attr.maxDate) {
                        _config.max = attr.maxDate;
                      
                    }
                   
                    if (attr.minDate) {
                       
                        _config.min = attr.minDate;
                    }
                    if (attr.format == 'HH:mm') {
                        $('.layui-laydate-content>.layui-laydate-list').css({ 'padding-bottom': '0px', 'overflow': 'hidden' })
                        $('.layui-laydate-content>.layui-laydate-list>li').css({ 'width': '50%' })
                        $('.merge-box .scrollbox .merge-list').css({ 'padding-bottom': '5px' })
                    }


                    // 监听日期最大值
                    if (attr.hasOwnProperty('maxDate')) {
                       
                        attr.$observe('maxDate', function (val) {
                            _config.max = val;
                        })
                    }
                    // 监听日期最小值
                    if (attr.hasOwnProperty('minDate')) {
                       
                        attr.$observe('minDate', function (val) {
                            _config.min = val;
                        })
                    }
                    _date = laydate.render(_config);
                    scope.dateObj=_date
                 

                    // 模型值同步到视图上
                    ngModel.$render = function () {
                        element.val(ngModel.$viewValue || '');
                    }

                    // 监听元素上的事件
                    /* element.on('blur keyup change', function() {
                     scope.$apply(setViewValue);
                     });*/

                    setViewValue();

                    // 更新模型上的视图值
                    function setViewValue() {
                        var val = element.val();
                        /* ngModel.$setViewValue(val);*/
                    }
                }, 0);
            }
        };
    });
    app.directive('ngLayDateTimeRange', function ($timeout, $filter) {
        return {
            require: '?ngModel',
            restrict: 'A',
            scope: {
                ngModel: '=',
                maxDate: '@?',
                minDate: '@?',
                callBack:'=',
                dateObj:"=dateObj",
                dateCopy:"=dateCopy",
                minMax:'@?'
            },
            link: function (scope, element, attr, ngModel) {
                var _date = null,
                    _config = {};
                // 渲染模板完成后执行
                $timeout(function () {
                    // 初始化参数
                    _config = {
                        elem: element[0],
                        format:  'yyyy-MM-dd HH:mm:ss',
                        type:  'datetime',
                       

                        done: function (data,value) {
                          
                            scope.callBack && scope.callBack(scope.dateCopy,scope.minMax,value);
                       
                           
                            ngModel.$setViewValue(data);
                            /* scope.$apply(setViewValue);*/
                        },
                        clear: function () {
                            ngModel.$setViewValue('');
                        },
                        
                    };

                    if (attr.maxDate) {
                        _config.max = attr.maxDate;
                      
                    }
                   
                    if (attr.minDate) {
                       
                        _config.min = attr.minDate;
                    }
                  


                    // 监听日期最大值
                    if (attr.hasOwnProperty('maxDate')) {
                       
                        attr.$observe('maxDate', function (val) {
                            _config.max = val;
                        })
                    }
                    // 监听日期最小值
                    if (attr.hasOwnProperty('minDate')) {
                       
                        attr.$observe('minDate', function (val) {
                            _config.min = val;
                        })
                    }
                    _date = laydate.render(_config);
                    scope.dateObj=_date
                 

                    // 模型值同步到视图上
                    ngModel.$render = function () {
                        element.val(ngModel.$viewValue || '');
                    }

                    // 监听元素上的事件
                    /* element.on('blur keyup change', function() {
                     scope.$apply(setViewValue);
                     });*/

                    setViewValue();

                    // 更新模型上的视图值
                    function setViewValue() {
                        var val = element.val();
                        /* ngModel.$setViewValue(val);*/
                    }
                }, 0);
            }
        };
    });

    /**
     * 如果后台返回的为long的时间戳
     * 则返回格式化数据
     */
    app.directive('convertToDate', function ($timeout, $filter) {
        return {
            require: 'ngModel',
            restrict: 'A',
            link: function (scope, element, attrs, ngModel) {
                ngModel.$formatters.push(function (val) {
                    if (val && (angular.isNumber(val) || val.indexOf('-') == -1)) {
                        return ($filter('date')(val, "yyyy-MM-dd") || '');
                    }
                });
            }
        };
    });


    /**
     * 监控视频柏播放组件
     * param:设备id,宽度，长度
     */
    app.directive('playCamera', ['$window', '$timeout', '$http', function ($window, $timeout, $http) {
        return {
            restrict: 'AE',
            scope: {
                deviceId: '<?',
                width: '<?',
                height: '<?',
                url: '<?',
                list: '<?'
            },
            templateUrl: '/view/playVedio/cameraInner.html',
            link: function (scope, el, attr) {
                var CAMERA_SERVICE_URL = app.CAMERA_SERVICE_URL;
                scope.player; //播放器实体对象
                scope.isOpen = true; //是否展开右侧水平的面板,默认不展开
                scope.width = scope.width || el.parent().width() || 100;
                scope.id = 'video' + scope.$id;

                scope.$on('destory', function (evt, data) {
                    flv_destroy();
                });

                scope.$on('$destroy', function () {
                    flv_destroy();
                });

                //点击视频源，用于切换摄像头
                var interval;
                scope.clickVideo = function (video, index) {
                    scope.videoIndex = index;
                    $http.jsonp(CAMERA_SERVICE_URL + '/api/getIsOpen?code=' + video.regi_code + "&callback=JSON_CALLBACK").success(function (data) {
                        if (data.data && data.data.flvUrl) {
                            play(data.data.flvUrl)
                        } else {
                            getUrlById(video.id);
                        }

                    });
                }

                function getUrlById(id) {
                    $http.jsonp(CAMERA_SERVICE_URL + '/api/sourceDetail?sourceId=' + id + "&callback=JSON_CALLBACK").success(function (data) {
                        if (data.data && data.data.flvUrl) {
                            scope.url = data.data.flvUrl;
                        } else {
                            setTimeout(function () {
                                getUrlById(id);
                            }, 2000)
                        }
                    });
                }

                //改变线路  1外网,2内网
                scope.changeLine = function (type) {
                    scope.url = type == 1 ? scope.data.interM3u8 : scope.data.lanM3u8;
                }
                //展开右侧面板的方法
                scope.toggleRight = function () {
                    if (scope.isOpen) {
                        scope.height = el.parent().height();
                    }
                }

                //监听url变化
                scope.$watch('url', function (current, prev) {
                    if (angular.isDefined(current) && !angular.equals(current, prev)) {
                        if (current == '') {
                            init();
                        } else {
                            play(scope.url);
                        }
                    }
                }, true);

                function init() {
                    scope.list && scope.clickVideo(scope.list[0], 0); //默认打开第一个摄像头直播

                }
                //初始化
                $timeout(function () {
                    if (scope.list) {
                        init();
                    } else {
                        scope.$watch('list', function (current, prev) {
                            if (angular.isDefined(current) && !angular.equals(current, prev)) {
                                init();
                            }
                        }, true);
                    }
                })

                function play(url) {
                    if (flvjs.isSupported()) {
                        if (typeof scope.player !== "undefined") {
                            if (scope.player != null) {
                                scope.player.unload();
                                scope.player.detachMediaElement();
                                scope.player.destroy();
                                scope.player = null;
                            }
                        }
                        var videoElement = document.getElementById(scope.id);
                        scope.player = flvjs.createPlayer({
                            type: 'flv',
                            isLive: true,
                            hasAudio: false,
                            url: url || 'http://116.205.13.37:8082/live/34020000001310000001.flv'
                        });
                        scope.player.attachMediaElement(videoElement);
                        scope.player.load();
                        scope.player.play();
                    }

                    //利用奇米来进行视频播放，内置的有线路切换
                    /*  scope.player = new ChimeePlayer({
                          wrapper: '#'+id,
                          src: scope.data.interM3u8,
                          box:'hls',
                          isLive: true,
                          autoplay: true,
                          controls: true,
                          log: {
                              error: false,
                              info: false,
                              warn: false,
                              debug: false,
                              verbose: false,
                          },
                          plugin: [
                              {
                                  "name": "chimeeControl",
                                  "children": {
                                      play:{},  progressBar:{},  screen:{},
                                      "clarity": {
                                          "list": [
                                              {
                                                  "name": "线路一",
                                                  "src": scope.data.interM3u8
                                              },
                                              {
                                                  "name": "线路二",
                                                  "src": scope.data.lanM3u8
                                              }
                                          ]
                                      }
                                  }
                              }
                          ]
                      });*/
                }

                function flv_destroy() {
                    if (scope.player) {
                        scope.player.pause();
                        scope.player.unload();
                        scope.player.detachMediaElement();
                        scope.player.destroy();
                        scope.player = null;
                    }
                }
            }
        };
    }]);

    app.component('strangerMap', {
        templateUrl: '/common/strangerMap.html',
        bindings: {
            // 传值  接收
            mapLng: '<',
            mapLat: '<',
            unClick: '<',

        },
        controller: ['$scope', '$rootScope', '$timeout', '$http', '$state', 'indoorService', function ($scope, $rootScope, $timeout, $http, $state, indoorService) {
            var $ctrl = this;
            var isChangeColor = false;  //当地图底色是否被改变
           
            $scope.mapData = []
            $scope.paths = []
            $scope.lineList = []

            $ctrl.$onInit = function () {
                // 地图配置
                OvuRouteMap.Config.set({
                    // 楼层间距200
                    showAllFloor: false,
                    count: 100,
                    zoom: 3,
                    defaultGap: 18,//楼层间距
                    showMenu: false,//不显示楼层选择,
                    showViewMode: "MODE_2D",
                    theta: 0,
                });

                var map;

                function addImgMarker(lnglat, map, name) {
                    // var pos = position.split(",")
                    new OvuRouteMap.Markers.ImageMarker({
                        imgMarker: '/res/img/mark_bs/ICON.png', //图片路径
                        size: 2, //图片大小缩放系数
                        //position:{x:x0,y:y0,z:z0}, //三维坐标系坐标
                        lnglat: lnglat,//[114.3218162017, 30.470431986173], //[Math.abs(lnglat[0]),Math.abs(lnglat[1])], //经纬度坐标
                        y: 50, //三维坐标系坐标y值
                        userData: lnglat,
                        mapCenter: map.getMapCenter(name), //地图中心点
                        callback: function (imgMark) {
                            //将图片标注添加到地图
                            map.addToLayer(imgMark, name, "otherGroup", true);
                        }
                    });
                }

                function addInfowindow(obj, map) {
                    new OvuRouteMap.Controls.InfoWindow({
                        //信息窗内容，是一个dom
                        content: `<div style="background-color: #ffffff;position:relative">
                                  <div style="float:left">
                                       出现次数:
                                  </div>
                                  <div style="float:left">
                                      ${obj.count || ""}
                                  </div>
                              </div>`,
                        position: map.screenCoordinates({
                            x: obj.lnglat[0],
                            y: 60,
                            z: obj.lnglat[1]
                        }), //三维场景坐标的投影到屏幕的坐标
                        positionXYZ: { x: obj.lnglat[0], y: 60, z: obj.lnglat[1] } //三维场景坐标
                    });
                    //将信息窗添加到地图中
                    map.addControl(infowindow);
                    //实时对信息窗定位
                    infowindow.positioning();
                }
                //转墨卡托坐标
                function coordinatesToMercato(dinatesArr) {
                    var dinatesToMercato = dinatesArr.slice(0);
                    dinatesToMercato = dinatesToMercato instanceof Array ? dinatesToMercato : [];
                    dinatesToMercato[0] = Number.parseFloat(dinatesToMercato[0]) * 20037508.34 / 180;
                    dinatesToMercato[1] = Math.log(Math.tan((90 + Number.parseFloat(dinatesToMercato[1])) * Math.PI / 360)) / (Math.PI / 180);
                    dinatesToMercato[1] = -Number.parseFloat(dinatesToMercato[1]) * 20037508.34 / 180;
                    return dinatesToMercato;
                }


                //经纬度转换到三维坐标系中的坐标
                function coordinatesToCoordinates3(mapCenter, dinatesArr) {
                    var coordinatesThreeArr = [];
                    if (!(dinatesArr[0] instanceof Array)) {
                        var centerMercato = coordinatesToMercato(dinatesArr);
                        coordinatesThreeArr[0] = centerMercato[0] - mapCenter[0];
                        coordinatesThreeArr[1] = centerMercato[1] - mapCenter[1];
                    } else {
                        dinatesArr.forEach(function (item) {
                            var dinatesToMercato = coordinatesToMercato(item);
                            var dinatesDiff = [];
                            dinatesDiff[0] = dinatesToMercato[0] - mapCenter[0];
                            dinatesDiff[1] = dinatesToMercato[1] - mapCenter[1];
                            coordinatesThreeArr.push(dinatesDiff);
                        })
                    }
                    return coordinatesThreeArr;
                }
                var animateTween;
                function drawPointPath(map, points, paths, floorName) {
                    //删除指定图层

                    if (animateTween != undefined) {
                        animateTween.kill();
                    }

                    map.clearLayer(floorName, "testlayer");
                    map.clearLayer(floorName, "room1Group");
                    map.clearLayer("f1", "testlinelayer");
                    // animate.kill()
                    var pathAttay = [];
                    var walkPoints = [];
                    if (points.length > 1) {
                        for (var i = 0; i < points.length - 1; i++) {
                            let getPath = OvuRouteMap.Tools.findingPath(
                                points[i],
                                points[i + 1],
                                paths
                            );
                            pathAttay = pathAttay.concat(getPath);
                        }
                    }

                    //画框的基本属性
                    var config = {
                        //高度
                        height: 5,
                        //颜色
                        lineColor: "#00FF00",
                        //宽度
                        lineWidth: 0.01,
                        //是否有方向标记
                        direction: true
                    };

                    //用于画线的对象
                    var PolyLine = new OvuRouteMap.Markers.PolyLine();
                    //创建路径
                    var road = PolyLine.drawMeshLine(pathAttay, config);

                    // console.log(road);
                    //加载到地图
                    map.addToLayer(road, floorName, "testlayer", true);

                    //获取路径
                    //var pathPoints = road.geometry.parameters.path.points.map(function (point) {
                    //    return [point.x, point.z];
                    //})

                    var pathPoints = pathAttay;

                    //createLine();

                    //加载模型
                    map.addJSONModel({
                        src: "/view/facesSetting/json/man2.json",
                        size: 24,
                        position: [pathPoints[0][0], 1, pathPoints[0][1]],
                        callback: function (man) {
                            map.addToLayer(man, "f1", "room1Group");
                            animate(1, 40, pathPoints, man);
                        }
                    });

                    //循环运行
                    function animate(step, speed, positionData, model) {
                        if (step <= positionData.length - 1) {
                            let next_V = new map.THREE.Vector2(
                                positionData[step][0] - model.position.x,
                                positionData[step][1] - model.position.z
                            );
                            let t = next_V.length() / speed;
                            animateTween = TweenMax.to(model.position, t, {
                                x: positionData[step][0],
                                z: positionData[step][1],
                                ease: Power0.easeNone,
                                onStart: function () {
                                    if (step == 1) {
                                        createLine(
                                            [points[0][0], points[0][1]],
                                            [points[0][0], points[0][1] + 0.0005]
                                        );
                                    }
                                    model.rotation.y = getAngle(new map.THREE.Vector2(0, 1), next_V);
                                },
                                onUpdate: function (e) {
                                    if (step != 1) {
                                        updateLine([
                                            positionData[step - 1][0],
                                            positionData[step - 1][1]
                                        ]);
                                    }
                                },
                                onComplete: function () {
                                    step++;
                                    animate(step, speed, positionData, model);
                                }
                            });
                        } else {
                            model.position.x = positionData[0][0];
                            model.position.z = positionData[0][1];
                            //线清空
                            animate(1, speed, positionData, model);
                        }
                    }

                    //计算夹角
                    function getAngle(v1, v2) {
                        //获取余旋值
                        var cosTheta = v1.dot(v2) / (v1.length() * v2.length());
                        if (cosTheta > 1) {
                            cosTheta = 1;
                        } else if (cosTheta < -1) {
                            cosTheta = -1;
                        }
                        var theta = Math.acos(cosTheta);
                        return v1.x * v2.y - v1.y * v2.x > 0 ? -theta : theta;
                    }

                    function createLine(Points1, Points2) {
                        walkPoints = [];
                        //
                        walkPoints.push(Points1);
                        walkPoints.push(Points2);

                        map.clearLayer("f1", "testlinelayer");

                        //meshLine的配置
                        var config = {
                            //高度
                            height: 5.2,
                            //颜色
                            lineColor: "#FF0000",
                            //宽度
                            lineWidth: 0.01,
                            //是否有方向标记
                            direction: true
                        };

                        //创建meshLine
                        var meshLine = PolyLine.drawMeshLine(walkPoints, config);
                        //添加到对应楼层中图层

                        // debugger;

                        var meshLineId = map.addToLayer(meshLine, "f1", "testlinelayer", true);
                    }

                    function updateLine(Points1) {
                        walkPoints.push(Points1);

                        map.clearLayer("f1", "testlinelayer");

                        //meshLine的配置
                        var config = {
                            //高度
                            height: 5.2,
                            //颜色
                            lineColor: "#FF0000",
                            //宽度
                            lineWidth: 0.01,
                            //是否有方向标记
                            direction: true
                        };

                        //创建meshLine
                        var meshLine = PolyLine.drawMeshLine(walkPoints, config);
                        //添加到对应楼层中图层

                        // debugger;

                        var meshLineId = map.addToLayer(meshLine, "f1", "testlinelayer", true);
                    }
                }

                //获取项目地图数据
                $scope.map = function () {

                    map = new OvuRouteMap.Map({
                        container: document.querySelector('#selectRoomBox'),
                        mapList: [{
                            name: 'f1',
                            mapUrl: '/view/facesSetting/json/Change_cytdNKT.geojson'
                        }],
                        themeUrl: '/view/facesSetting/json/theme/fillcolor.json',
                        logoSrc: "",
                        position: {//设置相机位置
                            x: 0,
                            y: 300,
                            z: 0
                        },
                        zoom: 3
                    });
                    //     }
                    $scope.$on('sendChild', function (event, data) {
                        map.clearLayer("f1", "otherGroup");
                        if (animateTween != undefined) {
                            animateTween.kill();
                        }
                        $scope.itemList = data
                        $scope.lineList = []
                        // console.log(map.getMapCenter('f1'))
                        let mapCenter = coordinatesToMercato(map.getMapCenter("f1"));
                        $scope.itemList.forEach((item) => {
                            var localList = []
                            localList.push(item.longitude * 1, item.latitude * 1)
                            localList = coordinatesToCoordinates3(mapCenter, localList);
                            $scope.lineList.push(localList)
                            new OvuRouteMap.Markers.ImageMarker({
                                imgMarker: item.url, //图片路径
                                size: 8, //图片大小缩放系数
                                position: { x: localList[0], y: 100, z: localList[1] }, //三维坐标系坐标
                                center: [0.5, 0], //标注的中心点相对位置
                                callback: function (imgMark) {
                                    //将图片标注添加到地图
                                    map.addToLayer(imgMark, 'f1', "otherGroup", true);
                                }
                            });
                        })
                        var roadFlag = true;
                        for (var i = 0; i <= $scope.lineList - 2; i++) {
                            var firstLongitude = $scope.lineList[i][0];
                            var firstLatitude = $scope.lineList[i][1];
                            var secondLongitude = $scope.lineList[i + 1][0];
                            var secondLatitude = $scope.lineList[i + 1][1];
                            // console.log(firstLongitude);
                            // console.log(secondLongitude);
                            if (
                                firstLongitude == secondLongitude &&
                                firstLatitude == secondLatitude
                            ) {
                                roadFlag = false;
                                break;
                            } else {
                                roadFlag = true;
                            }
                        }

                        if (roadFlag) {
                            drawPointPath(map, $scope.lineList, $scope.paths, "f1");
                        } else {
                            layer.msg('请选择连续两个不同的点', { icon: 1, time: 500 });
                        }
                        // console.log($scope.itemList);
                        // console.log($scope.paths)
                        // console.log($scope.lineList)
                    });

                    //     //地图  加载完成事件
                    map.event.on("loaded", function (e) {
                        // let mapCenter = coordinatesToMercato(map.getMapCenter("f1"));
                        $.ajax({
                            type: "get",
                            url: "/view/facesSetting/json/route1.json",
                            async: true,
                            success: function (data) {
                                $scope.paths = data;
                            }
                        });
                        if ($scope.paths.length > 0) {
                            // console.log($scope.paths)
                        }

                    })
                    map.event.on("click", function (e) { //注册点击事件
                        // 园区地图  点击事件
                        console.log(e)
                    });


                }
                $scope.map();

            };


        }],
        controllerAs: 'vm'
    });
    app.directive("onDetail", function () {
        return {
            restrict: "E",
            transclude: true,
            scope: {
               
                value:'@',
                titles:'@',
                strLength:'@'
            
            },
            templateUrl: '/common/ondetail.html',
            controller:function($scope, $http){
                var host = $scope.host = {};
                $scope.value=this.value
            }
                
                
            }
        })

    // app.directive('ngEnter', function ($document) {
    //     return function (scope, element, attrs) {
    //         $document.bind("keypress", function (event) {
    //             if (event.which === 13) {
    //                 scope.$apply(function () {
    //                     scope.$eval(attrs.ngEnter);
    //                 });
    //                 event.preventDefault();
    //             }
    //         });
    //     };
    // })

})();

/**
 * @author Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2015-12-11
 * 基于ui-router & script-loader实现的按需加载方案,可在不修改一行js代码的情况下实现angular框架的按需加载
 * 依赖于 browser-script-loader (https://github.com/kuitos/script-loader)
 * modify by eeeqxxtg
 */
;
/*
(function(angular, undefined) {

    'use strict';

    // begin eeeqxxtg 为了少引入一个script标签  直接挂载到系统 module上
    // angular
    //     .module('ui.router.requirePolyfill', ['ng', 'ui.router', 'oc.lazyLoad'])
    //     .decorator('uiViewDirective', DecoratorConstructor)
    //     .config(config);

    angular
        .module("angularApp")
        .decorator('uiViewDirective', DecoratorConstructor)
        .config(config);
    // end

    config.$inject = ['$ocLazyLoadProvider'];

    function config($ocLazyLoadProvider) {
        // begin eeeqxxtg debug false
        // $ocLazyLoadProvider.config({ debug: true });
        $ocLazyLoadProvider.config({ debug: false });
        // end
    }

    /!**
     * 装饰uiView指令,给其加入按需加载的能力
     *!/
    DecoratorConstructor.$inject = ['$delegate', '$log', '$q', '$compile', '$controller', '$interpolate', '$state', '$ocLazyLoad'];

    function DecoratorConstructor($delegate, $log, $q, $compile, $controller, $interpolate, $state, $ocLazyLoad) {

        // 移除原始指令逻辑
        $delegate.pop();
        // 在原始ui-router的模版加载逻辑中加入脚本请求代码,实现按需加载需求
        $delegate.push({

            restrict: 'ECA',
            priority: -400,
            compile: function(tElement) {
                var initial = tElement.html();
                return function(scope, $element, attrs) {

                    var current = $state.$current,
                        name = getUiViewName(scope, attrs, $element, $interpolate),
                        locals = current && current.locals[name];

                    if (!locals) {
                        return;
                    }

                    $element.data('$uiView', { name: name, state: locals.$$state });

                    var template = locals.$template ? locals.$template : initial,
                        processResult = processTpl(template);

                    var compileTemplate = function() {
                        $element.html(processResult.tpl);

                        var link = $compile($element.contents());

                        if (locals.$$controller) {
                            locals.$scope = scope;
                            locals.$element = $element;
                            var controller = $controller(locals.$$controller, locals);
                            if (locals.$$controllerAs) {
                                scope[locals.$$controllerAs] = controller;
                            }
                            $element.data('$ngControllerController', controller);
                            $element.children().data('$ngControllerController', controller);
                        }

                        link(scope);
                    };

                    // 模版中不含脚本则直接编译,否则在获取完脚本之后再做编译
                    if (processResult.scripts.length) {
                        loadScripts(processResult.scripts).then(compileTemplate);
                    } else {
                        compileTemplate();
                    }

                };
            }

        });
        return $delegate;

        /!**
         * Shared ui-view code for both directives:
         * Given scope, element, and its attributes, return the view's name
         *!/
        function getUiViewName(scope, attrs, element, $interpolate) {
            var name = $interpolate(attrs.uiView || attrs.name || '')(scope);
            var inherited = element.inheritedData('$uiView');
            return name.indexOf('@') >= 0 ? name : (name + '@' + (inherited ? inherited.state.name : ''));
        }

        /!**
         * 从模版中解析出script外链脚本
         * @return tpl:处理后的模版字符串 scripts:提取出来的脚本链接,数组索引对应脚本优先级, 数据结构: [['a.js','b.js'], ['c.js']]
         *!/
        function processTpl(tpl) {

            // var SCRIPT_TAG_REGEX = /<script\s+((?!type=('|")text\/ng-template('|")).)*>.*<\/script>/gi,
            //     SCRIPT_SRC_REGEX = /.*\ssrc="(\S+)".*!/,
            //     SCRIPT_SEQ_REGEX = /.*\sseq="(\S+)".*!/,
            var SCRIPT_TAG_REGEX = /<(script)\s+((?!type=('|")text\/ng-template\3).)*?>.*?<\/\1>/gi,
                SCRIPT_SRC_REGEX = /.*\ssrc=("|')(\S+)\1.*!/,
                SCRIPT_SEQ_REGEX = /.*\sseq=("|')(\S+)\1.*!/,
                scripts = [];


            // begin eeeqxxtg 处理页面上的注释掉的scipt标签 <!-- <script src="xxx.js"></script> -->
            var COMMENT_SCRIPT_REGEX = /<!\--\s+<(script)([\s\S]*?)-->/gi;
            tpl = tpl.replace(COMMENT_SCRIPT_REGEX, '<!-- comment script -->');
            // end

            // 处理模版,将script抽取出来
            tpl = tpl.replace(SCRIPT_TAG_REGEX, function(match) {

                // 抽取src部分按设置的优先级存入数组,默认优先级为0(最高优先级)
                var matchedScriptSeq = match.match(SCRIPT_SEQ_REGEX),
                    matchedScriptSrc = match.match(SCRIPT_SRC_REGEX);

                // var seq = (matchedScriptSeq && matchedScriptSeq[1]) || 0;
                var seq = (matchedScriptSeq && matchedScriptSeq[2]) || 0;
                scripts[seq] = scripts[seq] || [];

                // if (matchedScriptSrc && matchedScriptSrc[1]) {
                //     scripts[seq].push(matchedScriptSrc[1]);
                // }
                if (matchedScriptSrc && matchedScriptSrc[2]) {
                    scripts[seq].push(matchedScriptSrc[2]);
                }

                return '<!-- script replaced -->';
            });
            return {
                tpl: tpl,
                scripts: scripts.filter(function(script) {
                    // 过滤空的索引
                    return !!script;
                })
            };

        }

        // 按脚本优先级加载脚本
        function loadScripts(scripts) {
            var promise = $ocLazyLoad.load(scripts.shift()),
                errorHandle = function(err) {
                    $log.error(err);
                    return $q.reject(err);
                },
                nextGroup;

            while (scripts.length) {

                nextGroup = scripts.shift();
                // IIFE 包一下nextGroup 模拟块级作用域 不然，所有的nextGroup 都是 scripts[scripts.length - 1]
                // (function(nextGroup) {
                //     promise = promise.then(function() {
                //         return $ocLazyLoad.load(nextGroup);
                //     });
                // })(nextGroup);
                promise = promise.then(function(nextGroup) {
                    return $ocLazyLoad.load(nextGroup);
                }.bind(null, nextGroup));
            }

            return promise.catch(errorHandle);
        }




    }
// 人才共享 - 发布职位  树结构
    app.directive("treeDep", function () {
        return {
            restrict: "E",
            scope: {
                nodeList: '='
            },
            templateUrl: '/view/talentShare/jobType/tree.html',
            controller: function ($scope) {
                // $scope.selectNode = $scope.$parent.selectNode;\
            }
        };
    });

    // 添加全屏
    app.directive('mapFullPage', ['$timeout', function($timeout) {
        return {
            restrict: 'A',
            link: function(scope, ele, attrs) {
                // console.log(ele[0].offsetHeight);
                var fullHeight = document.body.clientHeight;
                ele[0].style.height = fullHeight - 60 - 2 - (attrs.mapFullPage || 0) + 'px';
                // console.log(document.body.clientHeight);
            }
        }
    }]);

})(window.angular);
*/
