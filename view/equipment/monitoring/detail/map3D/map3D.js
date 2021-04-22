(function(angular, doc) {
    // 避免重复加载 尤其是使用component一定不能重复加载
    var invokes = angular.module('angularApp')
        ._invokeQueue
        .map(function(v) {
            return v[2][0];
        });

    var loaded = invokes.some(function(v) {
        return v === 'eqMonitorMap';
    });

    if (loaded) {
        return;
    }

    var app = angular.module('angularApp');

    app.component('eqMonitorMap', {
        templateUrl: '../view/equipment/monitoring/detail/map3D/view.html',
        bindings: {
            // toContact: '&'
        },
        controller: 'eqMonitorMapCtrl',
        controllerAs: 'vm'
    });

    // 2D/3DMap 控制器
    app.controller('eqMonitorMapCtrl', ['$scope', '$http', '$rootScope', '$interval', '$uibModal', '$document', 'fac', function($scope, $http, $rootScope, $interval, $uibModal, $document, fac) {
        // 监听设备分类点击事件
        $scope.$on('eqTypeItemClick', function(e, data) {
            // debugger;
            console.log('设备分类监听事件');
            console.log(e);
            console.log(data);
            $scope.selectEqupNode(data);
        });
        // 监听事件列表点击事件
        $scope.$on('eventItemClick', function(e, data) {
            console.log('事件列表监听事件');
            console.log(e);
            console.log(data);
            $scope.selectThing(data);
        });

        $scope.$on('eqTreeMapClick', function(e, data) {
            // debugger;
            console.log('设备分类监听事件');
            console.log(e);
            console.log(data);
            var coord = {
                x: parseFloat(map.center.x),
                y: parseFloat(map.center.y),
                z: parseFloat(map.center.z),
                groupID: parseInt(data.id)
            };
            moveTo(coord);

            //groups 表示当前要切换的楼层ID数组,
            //allLayer表示当前楼层是单层状态还是多层状态。
            removeAllTop();

            if (polygonLayer) {
                polygonLayer.removeAll();
            }
        });


        $scope.selectEqupNode = function(node) {

            $scope.curNode = node;
            removeAllTop();

            if ($scope.curNode.is_equip != undefined && $scope.curNode.is_equip == true && $scope.curNode.map_lat != undefined && $scope.curNode.map_lat != "" && $scope.curNode.map_lng != undefined && $scope.curNode.map_lng != "") {

                if (polygonLayer) {
                    polygonLayer.removeAll();
                }

                console.info($scope.curNode.map_lat);
                console.info($scope.curNode.map_lng);

                var coord = {
                    //设置弹框的x轴
                    x: parseFloat($scope.curNode.map_lat),
                    //设置弹框的y轴
                    y: parseFloat($scope.curNode.map_lng),

                    z: parseFloat(1),

                    groupID: parseInt($scope.curNode.ground_num)
                };
                moveTo(coord); //定位跳转

                //信息框控件大小配置
                var ctlOpt = new fengmap.controlOptions({
                    // begin eeeqxxtg 显式添加img路径 拒绝在服务器根目录下添加resource文件夹
                    imgUrl: '/view/equipment/resource/style/wedgets/img/',
                    // end
                    mapCoord: {
                        //设置弹框的x轴
                        x: parseFloat($scope.curNode.map_lat),
                        //设置弹框的y轴
                        y: parseFloat($scope.curNode.map_lng),

                        //z: parseFloat(1),
                        //设置弹框位于的楼层
                        groupID: parseInt($scope.curNode.ground_num)
                    },
                    //设置弹框的宽度
                    width: 200,
                    //设置弹框的高度
                    height: 100,
                    marginTop: 0,
                    init2D: false,
                    //设置弹框的内容
                    content: $scope.curNode.text //'<a target="_bank" href="#">'+name+'</a>' 
                });

                //addCircleMaker(parseInt($scope.curNode.ground_num),parseFloat($scope.curNode.map_lat),parseFloat($scope.curNode.map_lat));
                //添加弹框到地图上
                var popMarker = new fengmap.FMPopInfoWindow(map, ctlOpt);
            }

        }


        $scope.selectThing = function(model) {
            //debugger;
            if (polygonLayer) {
                polygonLayer.removeAll();
            }

            removeAllTop();

            //debugger;

            if (isNaN(parseFloat(model.map_lat)) || isNaN(parseFloat(model.map_lng)) ||
                isNaN(parseInt(model.ground_num))) return;

            //debugger;

            var coord = {
                x: parseFloat(model.map_lat),
                y: parseFloat(model.map_lng),
                z: 0,
                groupID: parseInt(model.ground_num)
            };
            moveTo(coord); //定位跳转

            addCircleMaker(parseInt(model.ground_num), parseFloat(model.map_lat),
                parseFloat(model.map_lng));

            map.storeSelect(
                model,
                true,
                false);

            //debugger;   

            //信息框控件大小配置
            var ctlOpt = new fengmap.controlOptions({
                // begin eeeqxxtg 显式添加img路径 拒绝在服务器根目录下添加resource文件夹
                imgUrl: '/view/equipment/resource/style/wedgets/img/',
                // end
                mapCoord: {
                    //设置弹框的x轴
                    x: parseFloat(model.map_lat),
                    //设置弹框的y轴
                    y: parseFloat(model.map_lng),

                    z: parseFloat(0),
                    //设置弹框位于的楼层
                    groupID: parseInt(model.ground_num)
                },
                //设置弹框的宽度
                width: 200,
                //设置弹框的高度
                height: 100,
                marginTop: 10,
                //设置弹框的内容
                content: '<a class="box">異常事件</a><br>' + model.workunit_name
                    //'<a target="_bank" href="#">'+name+'</a>' 
            });

            fac.showVideo(model.equipment_id);

            var popMarker = new fengmap.FMPopInfoWindow(
                map,
                ctlOpt);

        }

        var map;
        var fmapID = 'ovuhlw';
        var groupLayer;
        var searchAnalyser;
        var defaultGroupID = 1; //默认显示楼层
        var res = [];
        var res1 = [];

        var groupControl;

        var polygonLayer = null;

        var newThindId = "";

        //debugger;
        map = new fengmap.FMMap({
            //渲染dom
            container: document.getElementById('fengMap'),
            //地图数据位置
            mapServerURL: '/view/equipment/data/' + fmapID,
            //主题数据位置
            mapThemeURL: '/view/equipment/data/theme/',
            //设置主题
            defaultThemeName: '2001',
            // 默认比例尺级别设置为20级	
            defaultMapScaleLevel: 20,
            //开启2维，3维切换的动画显示
            viewModeAnimateMode: true,
            //开发者申请应用下web服务的key
            key: '7e7845016c9c7fb97e603a8a35e8697e',
            //开发者申请应用名称
            appName: 'OVU',
        });

        window.map = map;
        //打开Fengmap服务器的地图数据和主题
        map.openMapById(fmapID);

        //var oTable_container = document.querySelector('#table-container');

        var aBtn = document.querySelectorAll('.btn');
        //开启2维模式

        var buuton1 = document.getElementById("2dbuuton");
        var buuton2 = document.getElementById("3dbuuton");



        buuton1.onclick = function() {
            //设置地图为2维模式
            map.viewMode = fengmap.FMViewMode.MODE_2D;
            this.classList.add('btn-primary');
            buuton2.classList.remove('btn-primary');
        };

        //开启3维模式
        buuton2.onclick = function() {
            //设置地图为3维模式
            map.viewMode = fengmap.FMViewMode.MODE_3D;
            this.classList.add('btn-primary');
            buuton1.classList.remove('btn-primary');
        };


        function addCircleMaker(gid, x, y) {
            //debugger;
            var group = map.getFMGroup(gid);

            if (group == undefined) return;

            //创建PolygonMarkerLayer
            if (!polygonLayer) {
                polygonLayer = new fengmap.FMPolygonMarkerLayer();
                group.addLayer(polygonLayer);
            } else {
                polygonLayer.removeAll();
                group.addLayer(polygonLayer);
            }
            var circleMaker = new fengmap.FMPolygonMarker({
                //设置颜色
                color: '#3CF9DF',
                //设置透明度
                alpha: .3,
                //设置边框线的宽度
                lineWidth: 3,
                //设置高度
                height: 6,
                points: {
                    //设置为圆形
                    type: 'circle',
                    //设置此形状的中心坐标
                    center: {
                        x: x,
                        y: y
                    },
                    //设置半径
                    radius: 3,
                    //设置段数，默认为40段
                    segments: 40,
                }
            });
            polygonLayer.addMarker(circleMaker);
        };

        //移动方法
        function moveTo(coord) {
            map.visibleGroupIDs = [coord.groupID];
            map.focusGroupID = coord.groupID;
            map.moveTo(coord);
        };

        //解析方法
        function parseJson(results) {
            //debugger;
            //for (var i in results) {
            if (!results || !angular.isArray(results)) {
                console.log('results不是合理的数组, 不能执行parseJson');
                return;
            }
            for (var i = 0; i < results.length; i++) {
                i = parseInt(i);
                var model = results[i];

                // debugger;

                if (model.is_equip != undefined && model.is_equip == true && model.map_lat !=
                    undefined && model.map_lat != "" && model.map_lng != undefined && model.map_lng !=
                    "") {
                    addMarkers(model.ground_num,
                        model.map_lat,
                        model.map_lng,
                        model.equipmentType,
                        model.text);
                }

                if (model.nodes != undefined) {
                    parseJson(model.nodes);
                }

            }
        }

        //移除多余的弹出框
        function removeAllTop() {
            //debugger;
            var a = map.mapView.container_;
            var b = a.children;
            var len = b.length;
            if (len <= 3)
                return;
            for (var i = 0; i < len - 3; i++) {
                a.removeChild(b[2])
            }

        }

        //添加Marker,额外添加一个参数图片类型
        function addMarkers(gid, X, Y,
            imageType, name) {

            //debugger;
            var group = map
                .getFMGroup(gid);

            if (group != undefined) {

                //返回当前层中第一个imageMarkerLayer,如果没有，则自动创建
                var layer = group
                    .getOrCreateLayer('imageMarker');

                var imageUrl = '';

                switch (imageType) {
                    case "11": //hollow. u needn't change this color. because i will make a hole on the model in the final version.
                        imageUrl = '../image/xsp.png';
                        break;
                    case "111": //closed area
                        imageUrl = '../image/jx.png';
                        break;
                    case "112": //empty shop
                        imageUrl = '../image/sxt.png';
                        break;
                    case "21": //empty shop
                        imageUrl = '../image/jkp.png';
                        break;
                    case "22": //empty shop
                        imageUrl = '../image/yp.png';
                        break;
                    case "23": //empty shop
                        imageUrl = '../image/dy.png';
                        break;
                    case "24": //empty shop
                        imageUrl = '../image/wsd.png';
                        break;
                    case "31": //empty shop
                        imageUrl = '../image/hwx.png';
                        break;
                    case "32": //empty shop
                        imageUrl = '../image/hwx.png';
                        break;
                    case "33": //empty shop
                        imageUrl = '../image/hwx.png';
                        break;
                    case "34": //empty shop
                        imageUrl = '../image/hwx.png';
                        break;
                    case "35": //empty shop
                        imageUrl = '../image/hwx.png';
                        break;
                    default:
                        imageUrl = '../image/mc.png';
                        break;
                }

                var im = new fengmap.FMImageMarker({
                    //id:1,
                    x: X,
                    y: Y,
                    z: 1,
                    url: imageUrl,
                    size: 32,
                    callback: function() {
                        im
                            .alwaysShow();
                    }
                });
                layer.addMarker(im);
            }
        };

        function removeMarkers() {
            //获取多楼层Marker
            map
                .callAllLayersByAlias(
                    'imageMarker',
                    function(
                        layer) {
                        layer
                            .removeAll();
                    });
        };



        var ctlOpt = new fengmap.controlOptions({
            // begin eeeqxxtg 显式添加img路径 拒绝在服务器根目录下添加resource文件夹
            imgUrl: '/view/equipment/resource/style/wedgets/img/',
            // end
            //默认在右下角
            position: fengmap.controlPositon.RIGHT_BOTTOM,
            //默认显示楼层的个数
            showBtnCount: 2,
            //位置x,y的偏移量
            offset: {
                x: 20,
                y: 150
            }
        });



        //摄像头显示
        map.on('mapClickNode', function(event) {
            var model = event;
            //var d;
            switch (event.nodeType) {
                case fengmap.FMNodeType.IMAGE_MARKER:
                    //判断是否为摄像头
                    //debugger;
                    console.info(model);

                    if (model.url.indexOf('sxt.png') > -1) {
                        fac.showVedio();
                    }
                    break;
            }
        });

        //显示楼层
        function showFlow() {

            var bodyMsg = [];

            for (var i = 0; i < map.groupIDs.length; i++) {
                debugger;
                var model = map.groupIDs[i]
                console.info(parseInt(model));

                var newV = {
                    id: parseInt(model),
                    pid: "",
                    text: "F" + parseInt(model),
                    type: "map_floor"
                };

                bodyMsg.push(newV);

            }

            //debugger;
            $scope.budingTree = bodyMsg;
            // 传递给root
            // $rootScope.budingTree = bodyMsg;
            $scope.$emit('bimFloorLoaded', bodyMsg);

        }

        showFlow();

        map.on('loadComplete', function() {
            //创建楼层(按钮型)，创建时请在地图加载后(loadComplete回调)创建。
            //不带单/双层楼层控制按钮,初始时只有1个按钮,点击后可弹出其他楼层按钮
            //debugger;
            //groupControl = new fengmap.buttonGroupsControl(
            //    map,
            //    ctlOpt);

            //楼层控件是否可点击，默认为true
            //groupControl.enableExpand = false;

            showFlow();

            if (polygonLayer) {
                polygonLayer.removeAll();
            }



            var request = {
                types: ['model'],
                typeID: ['200200']
            };

            fengmap.MapUtil.search(map, 1, request, function(result) {
                //debugger;

                for (var i = 0; i < result.length; i++) {
                    var model = result[i];

                    //console.info(model.FID);
                    //console.info(model.name);
                    //console.info(model.typeID);

                    if (i % 3 == 1) {
                        model.setColor("red")
                    }

                    if (i % 3 == 2) {
                        model.setColor("yellow")
                    }

                    if (i % 3 == 0) {
                        model.setColor("white");
                    }

                }

                //var models = result;    
            });

            //保持多层和楼层切换一致
            //groupControl
            //    .onChange(function(
            //        groups,
            //        allLayer) {
            //groups 表示当前要切换的楼层ID数组,
            //allLayer表示当前楼层是单层状态还是多层状态。
            //       removeAllTop();

            //       if (polygonLayer) {
            //           polygonLayer.removeAll();
            //       }

            //   });

            parseJson($rootScope.equipdata);



        });

    }]);

})(angular, document);