(function(angular, doc, win) {

    // 这些全局变量完全不知道干什么用的
    var img0 = new Image();
    img0.src = "/lib/xwMap/image/17.png";
    var img1 = new Image();
    img1.src = "/lib/xwMap/image/16.png";
    var img2 = new Image();
    img2.src = "/lib/xwMap/image/14.png";
    var img3 = new Image();
    img3.src = "/lib/xwMap/image/type0.png";

    var app = angular.module('angularApp');
    // model.dome = [""]

    app.component('xwMap', {
        templateUrl: '../view/equipment/monitoring/detail/xwMap/view.html',
        bindings: {},
        controller: 'xwMapCtrl',
    });

    // 2D/3DMap 控制器
    app.controller('xwMapCtrl', ['$scope', '$http', '$rootScope', '$interval', '$uibModal', '$document', '$q', 'fac', function($scope, $http, $rootScope, $interval, $uibModal, $document, $q, fac) {

        // 园区切换
        $scope.$on('parkChanged', function(evt, data) {
            var stage = '一期';
            // 楼栋list
            var filterData = data.treeData.filter(function(v) {
                return v.stageName == stage;
            });
            if (filterData[0]) {
                // model.buildingList = filterData[0].nodes;
                variable.buildingList = filterData[0].nodes;
            } else {
                confirm('没有查询到该园区楼栋信息');
                return;
            }

            parkId = data.parkId;
            getinfo(map, parkId);

        });

        // 加载电子地图完成  先获取parkId
        app.modulePromiss.then(function(res) {
            $scope.search = {
                isGroup: fac.isGroupVersion()
            };
            if (app.park) {
                $scope.search.parkId = app.park.ID;
                $scope.search.PARK_NAME = app.park.PARK_NAME;
                parkId = $scope.search.parkId;
                fac.getHouseTree($scope, $scope.search.parkId).then(function(data) {
                    var stage = '一期';
                    // 楼栋list
                    var filterData = data.filter(function(v) {
                        return v.stageName == stage;
                    });
                    if (filterData[0]) {
                        // model.buildingList = filterData[0].nodes;
                        variable.buildingList = filterData[0].nodes;
                    } else {
                        confirm('没有查询到该园区楼栋信息');
                        return;
                    }
                });
                getinfo(map, parkId);

            } else {
                confirm('请选择项目');
            }

        });


        // 一堆变量依赖
        var model = new variable();
        // 地图类型 园区 parkMap 室内楼层 indoorMap
        var mapType = 'parkMap';
        // 室内地图租售状态 0: 默认值 1:未出售 2: 已出租 3: 已出售
        var ytype; // 租售状态

        //
        // var url = "/ovu-pcos/lib/xwMap/";
        var url = "/lib/xwMap/";


        // 为点击模块获取model的信息  mapModule: 模块信息  mapInfoList: 地图上所有的信息列表
        var mapclick = function mapclick(mapModule, mapInfoList) {
            // console.log(mapInfoList)
            if (mapType === 'parkMap') {
                $(".nameshow").text("楼栋信息")
                model.floorId = "";
            } else if (mapType == 'indoorMap') {
                $(".nameshow").text("房间信息");
            }
            model.relative_id = mapModule.relative_id;
            $("#relativeId>input").val(mapModule.relative_id);
            $(".infoshow>.relativeId>div").eq(1).html(mapModule.relative_id);
            $("#mapname>input").val(map.id);
            // wx   注释
            // $http.post('/ovu-pcos/Map/MapFloorRelation/getUnitAndGroundInfo.do', {
            //     floorId: '6cdc0961f199496580f856a8fa85e430'
            // }, fac.postConfig).then(function(res) {
            //     console.log('asddfasdf aaf f///////');
            //     console.log(res.data);

            // var re = angular.copy(res.data);
            // re.data = angular.copy(re.success);
            // delete re.success;
            //此处判断是否为全局地图   是否开放楼层选择框 和进入楼栋按钮
            // if (re.data[0]['mapType'] == 1) {
            model.cache['click_mapid'] = null;
            $(".Mask").fadeIn("show")
            $(".infoshow>.modelName>div").eq(1).html("")
            $(".infoshow>.modelHeight>div").eq(1).html("");
            $(".infoshow>.modelinfo>div").eq(1).html("");
            $("#mapname>input").val("");
            $("#mapinfo>textarea").val("");
            $("#mapheight>input").val("");
            if (mapType === 'parkMap') {
                //控制选中房间弹窗
                $(".Mask-div .onload").show();
                model.cache['changeUrl'] = map.mapurl; //aesgfgaergtetrfer !!!!!!!!
                console.log(map.mapurl);
            } else if (mapType === 'indoorMap') {
                //控制选中房间弹窗
                // $(".Mask-div .onload").remove();

                $(".Mask-div .onload").hide();
                $("#mapchange").css('display', 'block');


                // wx begin
                // for (var i = 0; i < map.nowMap.mapinfo.length; i++) {
                //     if (map.nowMap.mapinfo[i].site_id == re["relative_id"]) {
                //         $(".nameshow").text(map.nowMap.mapinfo[i].site_name);
                //         $(".infoshow").text(map.nowMap.mapinfo[i].remark_info);
                //         $("#mapname>input").val(map.nowMap.mapinfo[i].site_name);
                //         $("#mapinfo>textarea").val(map.nowMap.mapinfo[i].remark_info);
                //         $("#mapheight>input").val(map.nowMap.mapinfo[i].map_height);
                //         model.cache['click_mapid'] = map.nowMap.mapinfo[i].id;
                //         break;
                //     }
                // }
                //wx  end


                //填充对应数据
                // $(".Mask .nameshow").text(re[0]["site_name"]);
                // $(".Mask .infoshow2").text(re[0]["remark_info"]);
                // $("#mapname>input").val(re[0]["site_name"]);
                // $("#mapinfo>textarea").val(re[0]["remark_info"]);
                // $(".ul1>li").eq(re[0]["type"] - 1).css("background-color", re[0]["site_color"])
            }
            $(".ul1>li").css("background-color", "#fff");
            //填充对应数据
            mapInfoList.some(function(v) {

                if (v.site_id == mapModule["relative_id"]) {
                    // console.log(v)

                    $(".infoshow>.modelName>div").eq(1).html(v.site_name)
                    $(".infoshow>.modelHeight>div").eq(1).html(v.map_height);
                    $(".infoshow>.modelinfo>div").eq(1).html(v.remark_info);
                    // $(".infoshow").text(v.remark_info);
                    $("#mapname>input").val(v.site_name);
                    $("#mapinfo>textarea").val(v.remark_info);
                    $("#mapheight>input").val(v.map_height);
                    model.cache['click_mapid'] = v.id;
                    return true;
                }
            });
            // model.floorIdture = model.floorIdture;

            if (!model.mapInfoList.length) {
                confirm("没有地图信息");
                return;
            }
            model.mapInfoList.some(function(v) {
                // console.log("88888888888888888888")
                // console.log(model.mapInfoList);
                // console.log(mapModule["relative_id"]);
                if (v.modularId == mapModule["relative_id"]) {

                    // model.floorIdture = v.floorId
                    // console.log(model.floorIdture)
                    mapType === 'parkMap' ?
                        model.floorId = v.floorId :
                        model.houseId = v.houseId;
                }

            });



        };
        // 点击设备获取设备信息 eqinfo: 设备信息
        var mapclick2 = function mapclick2(eqInfo) {
            // console.log("111111111111111")
            // 缓存设备ID     删除设备时调用
            model.eqobjId = eqInfo.object.info.id
            $(".xw-map-container #infowindow").css("display", "block");
            $(".xw-map-container .info_name").text("");
            $(".xw-map-container .info_tag").text("");
            // $(".xw-map-container .Mokuai .infoshow2").text("");
            // $(".xw-map-container #mapname>input").val("");
            // $(".xw-map-container #mapinfo>textarea").val("");
            // $(".ul1>li").css("background-color", "#fff")
            $("#mapx2>input").val();
            $("#mapy2>input").val();
            $("#mapz2>input").val();
            // variable.mokuaiid = variable.mokuai.id;
            // variable.mod_img1_change = eqInfo.object.info.specialSite;
            model.mod_img1_change = eqInfo.object.info.specialSite;
            // console.log(eqInfo);
            // console.log($(".mod_img1 li").length);
            for (var i = 0; i < $(".mod_img1_change li").length; i++) {
                if (Number($(".mod_img1_change li").eq(i).attr("ytype")) == eqInfo.object.info.specialSite) {
                    $(".mod_img1_change li").eq(i).css({
                        "border": "none",
                        "width": "30px",
                        "height": "30px"
                    })
                    $(".mod_img1_change li").eq(i).siblings().css({
                        "border": "1px solid ",
                        "width": "28px",
                        "height": "28px"
                    })
                }
            }
            $(".info_name").text("设备信息")
            $(".info_tag").text(eqInfo.object.info.name)
            $("#mapx2>input").val(eqInfo.object.info.center[0]);
            $("#mapy2>input").val(eqInfo.object.info.y);
            $("#mapz2>input").val(eqInfo.object.info.center[1]);

        };

        //添加设备时获取坐标
        var mapClickFacility = function(point) {
            console.log('pointasdgfdrfg666666666666666666666666666666666666');
            console.log(point);
            $("#mapx2>input").val(point.x);
            $("#mapy2>input").val(point.y);
            $("#mapz2>input").val(point.z);
        };

        // 参数 1 id  2 url
        var map = new XWMap("map", url, "infowindow");

        map.on('xwClick', function(evt) {
            if (evt.type === 'mapModule') {
                mapclick(evt.moduleInfo, evt.mapInfoList);
            }
        });
        map.on('xwClick', function(evt) {
            if (evt.type === 'mapFacility') {
                mapclick2(evt.intersects);
            }
        });
        map.on('xwClick', function(evt) {
            if (evt.type === 'mapGetPoint') {
                mapClickFacility(evt.point);
            }
        });

        $scope.$on('buildingClick', function(evt, data) {
            // console.log('buildingClick................................');
            // console.log(data);
            // console.log(model);
            var mapModule = getModuleByFloorId(model, data.floorId);
            // console.log(mapModule);
            map.showSpecialModel(mapModule.modularName);
        });

        function getModuleByFloorId(model, id) {
            var mapModule;
            model.mapInfoList.some(function(item) {
                if (item.floorId === id) {
                    mapModule = item;
                    return true;
                }
            });

            return mapModule;
        }

        // var parkId = '0eefc67ff27d43ddbebd7e942e0918ec';
        var parkId = '';
        map.init();

        win.map = map;

        // 获取园区地图 获取地图信息 获取设备信息
        // getinfo(map, parkId);

        // 实现响应式
        $(window).resize(function() {
            // canvassize()
            // wjlong begin
            // map.camera.aspect = $("#map").width() / $("#map").height();
            map.camera.aspect = map.container.offsetWidth / map.container.offsetHeight;
            // wjlong end
            map.camera.updateProjectionMatrix();

            // 王建龙 begin
            // var top = document.getElementById("map").offsetTop;
            // var left = document.getElementById("map").offsetLeft;
            var top = map.getOffsetTop(document.getElementById("map"));
            var left = map.getOffsetLeft(document.getElementById("map"));
            //王建龙 end

            // console.log(top, left);
            map.renderer.domElement.top = top;
            map.renderer.domElement.left = left;
            // console.log(map.renderer.domElement.width, map.renderer.domElement.height);

            // wjlong begin
            // map.renderer.setSize($("#map").width(), $("#map").height());
            map.renderer.setSize(map.container.offsetWidth, map.container.offsetHeight);
            // model 响应式
            positionModel();
            // wjlong end

        });

        // 设置信息展示panel 的位置
        function positionModel() {
            var coverWidth = document.querySelector('#map').offsetWidth;
            $(".xw-map-container .Mask-div").css("left", (coverWidth - $('.xw-map-container .Mask-div').width()) / 2 + "px");
        }

        positionModel();


        //进入楼层触发事件
        $(".xw-map-container .onload").click(function() {
            $("#mapheight").hide();
            $(".ul1").show();
            $('#select>option').eq(0).html("请选择房间编码");
            $(".Mask").fadeOut("hidden")
            $('#select').removeClass('not-allow-empty');
            $(".Mask").fadeOut();
            $('#backToPark').show();
            map.clearMap();
            // map.mapurl = model.cache['changeUrl'];

            mapType = 'indoorMap'; // 进入室内地图
            // map.loadData(model.cache['changeUrl']);
            // map.draw();
            // 显示楼层列表
            // console.log(showFloors);
            // showFloors('e4801d3d4c584bd1bc2bf1e5c76cc162');
            showFloors(model.floorId, function() {

                showSelect('room');
            });


            // wjlong end
        });

        //返回全局地图事件 begin
        $('#backToPark').click(function() {
            // map.mapurl = '/ovu-pcos/lib/xwMap/park.geojson';
            mapType = 'parkMap'; // 返回园区地图
            map.controls.wxflag = 0;
            getinfo(map, parkId);
            //    $(".addmod3") .hide();
            modelHidden($(".addmod3"));
            $("#mapheight").show()
            $('#backToPark').hide();
            $("#mapchange").hide();
            $("#infowindow").hide();
            $(".ul1").hide();
            $('#select>option').eq(0).html("请选择楼栋编码");
        });


        //选择模块已出售未出售
        $(".ul1>li").click(function() {
            var index = $(this).index()
            ytype = $(this).attr("ytype");

            $(".ul1>li").css("background-color", "#fff")
            if (index == 0) {
                $(this).css("background-color", "#FFF5B7")
                color = "#FFF5B7"
            } else if (index == 1) {
                $(this).css("background-color", "#E5FFB9 ")
                color = "#E5FFB9"
            } else {
                $(this).css("background-color", "#FFB9B9")
                color = "#FFB9B9"
            }
        });

        // card按钮
        $(".xw-map-container .model-close").click(function() {
            console.log('close');
            $(".xw-map-container .Mask").fadeOut("show");

            modelHidden($(".xw-map-container .addmod"));
        });


        // card 修改按钮
        $(".xw-map-container .revise").click(function() {

            $(".Mask").hide();
            $(".xw-map-container .addmod").animate({
                opacity: 'show',
                right: 0
            }, 500);
            if (mapType === 'parkMap') {
                showSelect('floor');
            } else {
                // 房间
            }
        });

        //			    var mapdata=new mapData();
        //			    mapdata.load("geojson/002.geojson","geojson/route/route-0.json");
        //			    var a=mapdata.findPathById(2,5);
        //			    //var a=mapdata.Dijstra(5);
        //			    console.log(a);


        // 根据parkId获取地图jaon数据 获取地图显示信息 获取地图设备信息
        function getinfo(map, parkId) {

            var parkMapApi = {
                    url: '/ovu-pcos/Map/MapUpload/getParkMap.do',
                    data: {
                        // park_id: '0eefc67ff27d43ddbebd7e942e0918ec'
                        park_id: parkId
                    }
                },
                mapInfoApi = {
                    url: '/ovu-pcos/Map/MapFloorInformation/getFloorInformation.do',
                    data: {
                        mapId: '' // 请求完成后更新
                    }
                },
                eqInfoApi = {
                    url: '/ovu-pcos/pcos/equipment/api/getEquipments',
                    data: {
                        mapId: '' // 请求完成后更新
                    }
                };

            // 请求园区地图
            function getParkMap() {
                return $q(function(resolve, reject) {
                    console.log(parkMapApi);
                    return $http.post(parkMapApi.url, parkMapApi.data, fac.postConfig).then(function(res) {
                        resolve(res.data);
                    });
                })
            }
            // 请求地图信息
            function getMapInfo() {
                return $q(function(resolve, reject) {
                    return $http.post(mapInfoApi.url, mapInfoApi.data, fac.postConfig).then(function(res) {
                        resolve(res.data);
                    });
                });
            }
            // 请求设备信息
            function getEqInfo() {
                return $q(function(resolve, reject) {
                    return $http.post(eqInfoApi.url, eqInfoApi.data, fac.postConfig).then(function(res) {
                        resolve(res.data);
                    });
                })
            }

            getParkMap().then(function(data0) {
                if (!data0.data.mapUrl) {
                    confirm('暂无该园区地图');
                    return;
                }
                if (mapType === 'parkMap') {
                    mapInfoApi.data.mapId = data0.data.id;
                    eqInfoApi.data.mapId = data0.data.id;
                } else if (mapType === 'indoorMap') {
                    mapInfoApi.data.mapId = map.mapid;
                    eqInfoApi.data.mapId = map.mapid;
                }

                $q.all([getMapInfo(), getEqInfo()]).then(function(data) {
                    var data1 = data[0],
                        data2 = data[1];
                    // 地图信息 绑定给model 可能是全局的 也可能是室内的
                    model.mapInfoList = data1.data;

                    if (data0 && data1 && data2) {
                        map.clearMap(); // 先清除地图

                        if (mapType === 'parkMap') {
                            // 全局园区地图
                            // map.mapurl = '/ovu-pcos/' + data0.data.mapUrl;
                            map.mapurl = data0.data.mapUrl;
                            map.mapid = data0.data.id;
                            $(".clickcontroll").hide();
                        } else if (mapType === 'indoorMap') {
                            // 楼层地图
                            $(".clickcontroll").show();
                        }

                        var modelInfo = data1.data.map(function(item, index, arr) {
                            return {
                                site_name: item.modularName,
                                remark_info: item.modularInformation,
                                site_id: item.modularId,
                                map_id: item.mapId,
                                type: '',
                                map_height: item.modularHeight,
                                id: item.id,
                            }
                        });
                        var facilityList = data2.data.map(function(item, index, arr) {
                            return {
                                // facility_info: arr[index].modularName,
                                facility_name: item.name,
                                facility_x: item.map_x,
                                facility_y: item.map_y,
                                facility_z: item.map_z,
                                id: item.id,
                                map_id: map.mapid,
                                special_site: item.icon_id
                            }
                        });

                        map.nowMap = new mapData();
                        map.nowMap.mapinfo = modelInfo; // 地图信息
                        map.nowMap.facilityList = facilityList; // 设备信息

                        map.nowMap.load(map.mapurl);
                        map.draw();
                        map.animate();
                    }
                });
            });

        }


        //2/3D切换
        $("#2d").click(function() {
            console.log(123)
            map.clearMap();

            for (var i = 0; i < map.nowMap.geojson.length; i++) {
                map.nowMap.geojson[i].h = 0;
            }
            map.draw();
            //					map.camera.position.set(0,300,0);
            //					map.controls.enableZoom=false;
            //					map.controls.enableRotate=false;
            map.controls._2d = true;
        });
        $("#3d").click(function() {
            getinfo(map, parkId);
            //				map.camera.position.set(-107,104,15);
            map.controls._2d = false;
        });

        //右上角添加设备
        $(".xw-map-container .clickcontroll").click(function() {
            map.controls.wxflag = 1;
            $(".title3").text("添加设备")
            $("#mapname3>input").val("");
            $("#mapinfo3>textarea").val("");
            $("#mapx2>input").val("");
            $("#mapy2>input").val("");
            $("#mapz2>input").val("");
            $("#infowindow").css("display", "none")
            map.camera.position.set(0, 200, 0);
            $(".addmod3").animate({
                opacity: 'show',
                right: 0
            }, 500);
            showIcons();

            // parkId: '0eefc67ff27d43ddbebd7e942e0918ec',
            // stageId: '5ed924f967ce4239b443766c34471c71',
            // floorId: 'e4801d3d4c584bd1bc2bf1e5c76cc162',
            // unitNum: '1',
            // groundNum: '1'


            var id = $('#mapchange>.floor-active').attr("id");
            // console.log('楼层。。。');
            // console.log(id);
            var groundNum;
            model.floorList.some(function(v) {
                if (v.mapId == id) {
                    groundNum = v.groundNumber;
                    return true;
                }
            });
            showEqSelect(parkId, '5ed924f967ce4239b443766c34471c71', 'e4801d3d4c584bd1bc2bf1e5c76cc162', 1, groundNum);
        });
        //添加设备时关闭按钮
        $(".xw-map-container .addmod3 .infos_close").click(function() {
            map.controls.wxflag = 0;
            modelHidden($(".addmod3"))
            map.deleteObjectByName("click");
        });


        // card 楼栋 房间信息
        $(".xw-map-container .addmod .infos_close").click(function() {
            map.controls.wxflag = 0;
            $(".Mask").fadeOut("show");
            modelHidden($(".addmod"));
            map.deleteObjectByName("click");
        });



        $(".xw-map-container .mod_img1_change ul").css("width", $(".xw-map-container .mod_img1_change li").length * 50 + "px");

        //点击图片给设备添加不同类型
        $(".xw-map-container .mod_img1_change li").click(function() {
            model.mod_img1_change = $(this).attr("ytype")
            $(this).css({
                "border": "none",
                "width": "30px",
                "height": "30px"
            })
            $(this).siblings().css({
                "border": "1px solid ",
                "width": "28px",
                "height": "28px"
            })
        });
        //修改设备时提交按钮
        $(".xw-map-container .submit3").click(function() {
            var eqId = $("#select1").val();
            // var info = $("#mapinfo3>textarea").val();
            var iconId = model.mod_img1_change;
            var mapx = $("#mapx2>input").val();
            var mapy = $("#mapy2>input").val();
            var mapz = $("#mapz2>input").val();
            map.controls.wxflag = 0;

            if ($('#select1').val() == "0" || iconId == "") {
                $('#select1').addClass('not-allow-empty');
                confirm("请选择房间编码与设备类型", function() {

                });
            } else {
                $http.post('/ovu-pcos/pcos/equipment/api/add.do', {
                    mapid: map.mapid,
                    equipid: eqId,
                    iconid: iconId,
                    mapx: mapx,
                    mapy: mapy,
                    mapz: mapz,
                    eqInfo: '备注',

                }, fac.postConfig).then(function(res) {
                    modelHidden($(".addmod3"))
                    console.log('res...');
                    console.log(res.data);
                    map.deleteObjectByName("click");
                    getinfo(map, parkId);
                });


                // 刷新地图

                // map.clearMap();
                // map.loadData(map.mapurl)
                // map.draw();

            }
        });

        //修改设备时删除按钮
        $(".xw-map-container .delete").click(function() {
            // var id = Number(mokuai.object.info.id.substr(1, mokuai.object.info.id.length));

            $http.post('/ovu-pcos/pcos/equipment/api/delete', {
                mapid: map.mapid,
                equipid: model.eqobjId,
            }, fac.postConfig).then(function(res) {

            });
            // 重新渲染地图
            $(".addmod3").hide();
            map.deleteObjectByName("click");
            getinfo(map, parkId);
            // map.clearMap();
            // map.loadData(map.mapurl);
            // map.draw();
        });
        //关闭设备信息窗
        $(".xw-map-container .info_close").click(function() {
            $("#infowindow").css("display", "none")
            map.controls.wxflag = 0;
            modelHidden($(".addmod3"))
        });
        //设备信息窗修改按钮
        $(".xw-map-container .info_submit").click(function() {
            $(".title3").text("修改设备")
            $("#infowindow").css("display", "none")
            $(".addmod3").animate({
                opacity: 'show',
                right: 0
            }, 500)
            $(".Mokuai").fadeOut("show")
            map.controls.wxflag = 1;
            map.camera.position.set(0, 200, 0);

            // $("#mapname3>input").val(mokuai.object.info.name);
            // $("#mapx2>input").val(mokuai.object.info.center[0]);
            // $("#mapy2>input").val();
            // $("#mapz2>input").val(mokuai.object.info.center[1]);
            // $("#mapinfo3>textarea").val(mokuai.object.info.info);
        });


        //点击提交修改地图信息
        $(".xw-map-container .submit").click(function() {
            var floorId = $("#select").val();
            var Data = $("#mapname>input").val();
            var info = $("#mapinfo>textarea").val();
            var height = $("#mapheight>input").val();

            model.floorId = floorId;

            // $.ajax({
            //     type: "post",
            //     url: "__APP__/Home/Hefei/editRemark",
            //     data: {
            //         "site_name": Data, //模块名称
            //         "remark_info": info, //备注信息
            //         // "site_color": color, //模块颜色
            //         "site_id": model.relative_id, //模块ID
            //         "map_id": map.mapid,
            //         "type": model.ytype,
            //         "map_height": height
            //     },
            //     success: function(re) {
            //         alert(re)
            //         $(".Mask").fadeOut("show");
            //         modelHidden($(".addmod"));

            //         // 修改信息之后 刷新地图
            //         map.deleteObjectByName("click");
            //         map.clearMap();
            //         map.loadData(map.mapurl);
            //         map.draw();
            //     }
            // });

            if ($('#select').val() == "0") {
                $('#select').addClass('not-allow-empty');
                confirm("请选择房间编码", function() {

                });
            } else {
                console.log("---------------------------------------");
                console.log(model.cache);
                console.log(typeof(model.cache.hasOwnProperty("click_mapid")));
                if (mapType == 'parkMap') {
                    var data = {
                        // floorId: '6cdc0961f199496580f856a8fa85e430',
                        floorId: floorId,
                        houseId: "0",
                        id: typeof(model.cache.hasOwnProperty("click_mapid")) === undefined ? null : model.cache["click_mapid"],
                        mapId: map.mapid,
                        modularId: model.relative_id,
                        // houseCode: $('#select').val(),
                        modularName: $('#mapname>input').val(),
                        modularInformation: $('#mapinfo>textarea').val(),
                        // sale_status: ytype,
                        modularHeight: height,
                    };

                } else if (mapType == 'indoorMap') {
                    var data = {
                        // floorId: '6cdc0961f199496580f856a8fa85e430',
                        houseId: floorId,
                        id: typeof(model.cache.hasOwnProperty("click_mapid")) === undefined ? null : model.cache["click_mapid"],
                        mapId: map.mapid,
                        modularId: model.relative_id,
                        // houseCode: $('#select').val(),
                        modularName: $('#mapname>input').val(),
                        modularInformation: $('#mapinfo>textarea').val(),
                        // sale_status: ytype,
                        modularHeight: height,
                    };
                }

                console.log(map.mapid)
                $http.post('/ovu-pcos/Map/MapFloorInformation/edit.do', data, fac.postConfig).then(function(res) {
                    // console.log('dataaaaaaa');
                    // console.log(res.data);

                    modelHidden($(".addmod"));

                    getinfo(map, parkId);
                });
            }

        });
        $("#select").change(function() {
            $('#select').removeClass('not-allow-empty');
        });
        $("#select1").change(function() {
            $('#select1').removeClass('not-allow-empty');
        });


        //地图模块状态
        // $("ul").css("width", $("ul>li").length * 80 + "px")
        // $("ul>li").click(function() {
        //     var index = $(this).index()
        //     ytype = $(this).attr("ytype");

        //     $("ul>li").css("background-color", "#fff")
        //     if (index == 0) {
        //         $(this).css("background-color", "#FFF5B7")
        //         color = "#FFF5B7"
        //     } else if (index == 1) {
        //         $(this).css("background-color", "#E5FFB9")
        //         color = "#E5FFB9"
        //     } else {
        //         $(this).css("background-color", "#FFB9B9")
        //         color = "#FFB9B9"
        //     }
        // });


        //地图模块状态
        // $("ul").css("width", $("ul>li").length * 80 + "px")
        // $("ul>li").click(function() {
        //     var index = $(this).index()
        //     ytype = $(this).attr("ytype");

        //     $("ul>li").css("background-color", "#fff")
        //     if (index == 0) {
        //         $(this).css("background-color", "#FFF5B7")
        //         color = "#FFF5B7"
        //     } else if (index == 1) {
        //         $(this).css("background-color", "#E5FFB9")
        //         color = "#E5FFB9"
        //     } else {
        //         $(this).css("background-color", "#FFB9B9")
        //         color = "#FFB9B9"
        //     }
        // });


        // var PositionInfoWindow = []

        // function position_info_windows(e) {
        //     var a = [],
        //         b = [];
        //     a.push(map.camera.position.x, map.camera.position.y, map.camera.position.z);
        //     b.push(map.controls.target.x, map.controls.target.y, map.controls.target.z);
        //     var cubePosition = [Number(e.x), Number(e.y), Number(e.z)];
        //     var dd = getPixelFromCoordinate(a, b, cubePosition, map.camera.fov, window.innerWidth, window.innerHeight);
        //     //	        	var mydiv=document.getElementById("infowindow");
        //     //	        	mydiv.style.top=dd[0]-170+"px";
        //     //	        	mydiv.style.left=dd[1]-100+"px";
        // }

        // win.position_info_windows = position_info_windows;
        // win.PositionInfoWindow = PositionInfoWindow;

        // wjlong begin
        // 渲染楼层列表
        function renderFloors(data) {
            var str = '';

            data.forEach(function(v, i, arr) {
                if (v.groundNumber == 1) {
                    str += '<div id="' + v.mapId + '" url="' + v.mapUrl + '" class="floor-active"  groundNumber="' + v.groundNumber + '">' + v.floorName + '</div><hr/>';

                    //wx   赋值MAP.MAPID
                    map.mapid = v.mapId;
                    // console.log(8888888888888888888888888888888888888888)
                    // console.log(map.mapid)
                } else {
                    str += '<div id="' + v.mapId + '" url="' + v.mapUrl + '"  groundNumber="' + v.groundNumber + '">' + v.floorName + '</div><hr/>';
                }

            });
            var cover = document.querySelector('#mapchange');
            cover.innerHTML = str;
        }
        // 获取楼层数据显示楼层
        function showFloors(floorId, callback) {
            // $http
            $http.post('/ovu-pcos/Map/MapFloorRelation/getUnitAndGroundInfo.do', {
                floorId: floorId
            }, fac.postConfig).then(function(res) {

                var re = angular.copy(res.data);
                re.data = angular.copy(re.success);
                delete re.success;
                // console.log("222222222222222222222")
                // console.log(re)
                // console.log(re.data)
                if (!re.data || !re.data.length) {
                    confirm("该楼栋未绑定");
                    return;

                }
                renderFloors(re.data);
                model.floorList = re.data;
                // wx   进入楼栋请求地图  请求地图数据
                // console.log("eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee")
                // console.log(map.mapid)
                getinfo(map, parkId);
                // console.log(map.mapid)
                $("#mapchange").show();
                //切换楼层样式&&获取地图路径
                $("#mapchange>div").click(function() {
                    $("#mapchange>div").removeClass("floor-active");
                    $(this).addClass("floor-active");
                    $("#infowindow").css("display", "none");
                    modelHidden($(".addmod3"));
                    showSelect('room');
                    map.controls.wxflag = 0;
                    // map.mapurl = '/ovu-pcos/' + $(this).attr("url");
                    map.mapurl = $(this).attr("url");
                    map.mapid = $(this).attr("id");
                    getinfo(map, parkId);
                    console.log(map);

                    map.clearMap();
                    map.loadData(map.mapurl);
                    map.draw();

                });

                // 遍历楼层数据 查询 第一次的地图url
                re.data.some(function(v) {
                    if (v.groundNumber == 1) {
                        // map.mapurl = '/ovu-pcos/' + v.mapUrl;
                        map.mapurl = v.mapUrl;
                      console.log(map.mapurl);
                      return true;
                    }
                })

                map.clearMap();
                map.loadData(map.mapurl);
                map.draw();

                callback && callback();
            });


        }

        // 显示楼栋 房间  设备  修改 select
        function renderSelect(data, type) {
            var str = '',
                cover;
            if (type === 'floor') {
                data.forEach(function(v, i, arr) {
                    str += '<option value="' + v.floorId + '" >' + v.floorName + '</option>';
                });
                cover = document.querySelector('#select');
            } else if (type === 'room') {
                data.forEach(function(v, i, arr) {
                    str += '<option value="' + v.id + '">' + v.house_NAME + '</option>';
                });
                cover = document.querySelector('#select');
            } else if (type === 'equip') {
                data.forEach(function(v, i, arr) {
                    str += '<option value="' + v.id + '">' + v.name + '</option>';
                });
                cover = document.querySelector('#select1');
            }

            var initVal = cover.children[0].outerHTML;
            cover.innerHTML = initVal + str;
        }
        // 楼栋信息 房间信息select
        function showSelect(type) {
            if (type === 'room') {
                // 房间信息获取
                // $http.get('/ovu-pcos/Map/MapHouseRelation/getHouseList.do', {
                //     params: {
                //         floorId: '6cdc0961f199496580f856a8fa85e430',
                //         unitNum: 1,
                //         groundNum: 1
                //     }
                // }).then(function(res) {

                //     console.log('res.data////////////////////////');
                //     console.log(res.data);
                //     renderSelect(res.data.success, 'room');

                // });
                $http.post("/ovu-pcos/Map/MapUpload/getHouse.do", {
                    floor_id: model.floorId,
                    unit_num: 1,
                    ground_num: parseInt($("#mapchange>.floor-active").attr("groundnumber"))
                }, fac.postConfig).success(function(houseData) {
                    renderSelect(houseData, 'room');
                });
            } else if (type === 'floor') {
                // console.log('model.buildingList////////////////////////');
                // console.log(model.buildingList);
                // renderSelect(model.buildingList, 'floor');
                renderSelect(variable.buildingList, 'floor');

            }

        }
        // 获取设备图标
        function showIcons() {
            $http.get('/ovu-pcos/pcos/equipment/api/getIcons ').then(function(res) {
                // console.log('res.data00000000');
                // console.log(res.data);
                var result = res.data;
                if (result.code == 0) {
                    console.log(result.data);
                }
            });
        }

        // 设备编辑 select
        function showEqSelect(parkId, stageId, floorId, unitNum, groundNum) {

            $http.post('/ovu-pcos/pcos/equipment/api/getEquipments.do', {

                // parkId: '0eefc67ff27d43ddbebd7e942e0918ec',
                // stageId: '5ed924f967ce4239b443766c34471c71',
                // floorId: 'e4801d3d4c584bd1bc2bf1e5c76cc162',
                // unitNum: '1',
                // groundNum: '1'

                parkId: parkId,
                stageId: stageId,
                floorId: floorId,
                unitNum: unitNum,
                groundNum: groundNum
            }, fac.postConfig).then(function(res) {

                // console.log('res.data/\\\\\///////////////////////');
                // console.log(res.data);
                renderSelect(res.data.data, 'equip');

            });
        }

        // wjlong end


        function modelHidden(model) {
            model.animate({
                opacity: "hidden",
                right: -300
            }, 500, function() {
                model.hide()
            });
        }


    }]);

})(angular, document, window);
