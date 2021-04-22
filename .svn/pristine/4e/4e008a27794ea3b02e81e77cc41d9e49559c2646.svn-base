/**
 * 自定义 angular组件
 */
(function () {
    'use strict';

    var app = angular.module("angularApp");

    app.component('faceBigScreen', {
        transclude: {
            'left': '?bigScreenLeft',  //左边包含的页面
            'right': '?bigScreenRight' //右边包含的页面
        },
        templateUrl: '/view/face/track/component/bigScreen.html',
        bindings: {
            mapData: '<',
        
            type: '<',
            showLeft: '<?',
            onlyIndoorMap: '<?'  //是否只展示园区地图，不要bim模式
        },
        controller: ['$scope','$rootScope','$timeout', '$state', 'AppService','$http', function ($scope, $rootScope, $timeout, $state, AppService, $http) {
            var $ctrl = this;
            $ctrl.$onInit = function () {
                console.log('faceBigScreen init...');
                $ctrl.showRight = true; //是否展示右侧面板
                $ctrl.showLeft = $ctrl.showLeft === undefined ? true : false;//是否展示左侧面板,默认是有展示的

               
            };

            //单向绑定发生变化的时候
            $ctrl.$onChanges = function (changes) {

            };
        }]
    });

    app.component('faceIndoorMap', {
        templateUrl: '/view/face/track/component/indoorMap.html',
        bindings: {
            mapData: '<',
            onBim : '&'
        },
        require: {
            faceBigScreen: '^^'
        },
        controller: ['$scope', '$rootScope', '$timeout', '$http', 'AppService', 'indoorService', '$state', function ($scope, $rootScope, $timeout, $http, AppService, indoorService, $state) {
            var $ctrl = this;
            //组件挂载后发事件
            $ctrl.$postLink = function () {
                $scope.$emit("indoorMapEnd");
            }

            // 地图配置
            AirocovMap.Config.set({
                // 楼层间距200
                showAllFloor: false,
                count: 100,
                zoom: 2,
                // defaultFloor: "武汉创意天地",
                showViewMode: "MODE_2D",
                defaultGap: 18,//楼层间距
                showMenu: false //不显示楼层选择
            });
            var parkName = AppService.park.parkName;//园区名称
          
            var parkId = AppService.park.parkId; //园区id
            var onlyIndoorMap = AppService.onlyIndoorMap; //是否只有园区地图
            var mapList = [];    //地图渲染数据
            var map;             //map
            var bubble;          //气泡弹框

            $ctrl.$onInit = function () {
                console.log('indoor map init...');
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
                $ctrl.cancelTip = function () {
                    $ctrl.showEnterTip = false;
                    $ctrl.floorName = null;
                };
                //进入楼栋
                $ctrl.enterFloor = function () {
                    $ctrl.selectNo = 0;
                    $ctrl.show2DMode = true;  //默认是2D模式
                    $ctrl.to2D();
                    $ctrl.showParkMap = false; //隐藏楼层提示框
                    $ctrl.floorName = null;    //置空点击的楼栋名称
                    var floor = indoorService.getFloorById(parkName, $ctrl.floorId);
                    // 广播消息
                    var state = {
                        id: floor.floorNo,
                        name: floor.name
                    };
                    $scope.$emit('toFloor', state);  //进入楼栋
                    //楼层list
                    $ctrl.groundList = floor.list;
                    // 深拷贝一次
                    var mapList = JSON.parse(JSON.stringify(floor.list));

                    // 室内设备渲染
                    $timeout(function () {
                        map.resetRender({
                            defaultFloor: "F1",
                            mapList: JSON.parse(JSON.stringify(mapList))
                        });
                    })
                    $ctrl.showEnterTip = false;

                    $scope.$emit('isBuildingMap', true);
                };

                // 返回园区
                $ctrl.showParkMap = true;  //是否展示园区地图

                $ctrl.backToPark = function () {
                    $ctrl.showParkMap = true;
                    $ctrl.show2DMode = true;
                    $ctrl.to2D();
                    // $scope.$emit('toGaode', '返回高德界面');

                    $scope.$emit('isBuildingMap', false);
                    $timeout(function () {
                        map.resetRender({
                            mapList: JSON.parse(JSON.stringify(mapList))
                        });
                    })
                };
                /* 楼层控制点击事件*/
                $ctrl.floorCtrl = function () {
                    if ($('#jumpHead').hasClass('shrink')) {
                        $('#jumpHead img').attr('src', '/view/face/track/img/layer.png');
                        $('#jumpHead').removeClass('shrink');
                        $('#jumpBody').show();

                        // 显示选中的楼层
                        var name = $.trim($('label.selected').html());
                        map.showOneFloor(name);
                        // 广播事件
                        var floor = indoorService.getFloorById(parkName, $ctrl.floorId);
                        var state = {
                            floorName:floor.name,
                            name: name,
                            id: parseInt(name.substring(1))
                        };
                        $scope.$emit('toGround', state);
                    } else {
                        $('#jumpHead img').attr('src', '/view/face/track/img/layers.png');
                        $('#jumpHead').addClass('shrink');
                        $('#jumpBody').hide();
                        // 显示所有楼层
                        map.showAllFloor();
                        // 广播事件
                        floor = indoorService.getFloorById(parkName, $ctrl.floorId);
                        state = {
                            id: floor.floorNo,
                            name: floor.name
                        };
                        $scope.$emit('toFloor', state);
                    }

                };
                $ctrl.selectNo = 0;
                //NoShowFloor  代表不进入到该楼层
                $ctrl.groundClick = function (item, index, NoShowFloor) {
                    //清除气泡
                    bubble && bubble.close();

                    $ctrl.selectNo = index;
                    !NoShowFloor && $timeout(function () {
                        map.showFloor(item.name);
                    }, 1000)
                    // 广播事件
                    var floor = indoorService.getFloorById(parkName, $ctrl.floorId);
                    var state = {
                        floorName:floor.name,
                        name: item.name,
                        id: parseInt(item.name.substring(1))
                    };
                    $scope.$emit('toGround', state);
                };

                // 接收 人员轨迹==》人员轨迹查询事件
                $scope.$on("showPerson", function (event, obj,drawPath) {
                    drawPath=drawPath!=undefined?drawPath:true;
                    // 清空 地图小图标数据
                    if (drawPath){
                        obj.length > 0 && addMarker(obj,drawArrow);
                    }else{
                        obj.length > 0 && addMarker(obj);
                    }
                });

                //重新加载地图
                $scope.$on("reloadMap"+window.location.hash, function () {
                    $timeout(function () {
                        loadMap();
                    });
                });
            };

            //单向绑定数据发生变化时
            $ctrl.$onChanges = function (changes) {
                //根据父数据渲染地图
                //console.log(changes.mapData.currentValue);
                //readerMap(changes.mapData.currentValue);
            };

            //获取项目地图数据 parkName
            $timeout(function () {
                loadMap();
            });
            function loadMap(){
                console.log('loading map...');
                //地图变量重新加载
                $ctrl.show2DMode = true;
                $ctrl.showParkMap=true;
                $ctrl.selectNo=0;
                mapList=[];//地图数据
                parkName = AppService.park.parkName;//园区名称
             
                parkId = AppService.park.parkId; //园区id
               
                indoorService.getMapData(parkName,parkId).then(function (res) {
                    var mapData = res;
                    
                    if(mapData.name){
                        mapList.push(mapData);
                    }

                    if(mapList.length==0){
                        map=null;
                        document.querySelector('#xwMap').innerHTML='';
                        return;
                    }
                    map = null
                    document.querySelector('#xwMap').innerHTML = ''; 
                    // 初始化地图
                    map = new AirocovMap.Map({
                        container: document.querySelector('#xwMap'),
                        // mapList: mapList,
                        mapList: JSON.parse(JSON.stringify(mapList)),
                        themeUrl: "/common/mapComponent/json/indoorMapData/theme/fillcolor.json",
                        position: {//设置相机位置
                            x: 0,
                            y: 300,
                            z: 0
                        }
                    });


                    // 地图点击事件
                    map.event.on("click", function (e) { //注册点击事件
                     
                        if (e.type == "room") { //判断点击类型为模块元素
                            if(e.target.name!='高层办工1#'){
                                return;
                            }

                            map.highLightByUUID(e.target.info.properties.uuid);
                            // map.highLightById(e.target.info.properties.uuid, e.target.info.floor); //模块高亮，把对应模块ID传入
                            //这是历史遗留的一个bug，只有园区点击room的时候需要对floorId进行赋值操作
                            if (map.floors.length == 1) {
                                $ctrl.floorId = e.target.info.id;                     //获取点击的bimId
                            }
                            var floor = indoorService.getFloorById(parkName, $ctrl.floorId);
                            // 显示进入楼栋提示信息
                            $timeout(function () {
                                if ($ctrl.showParkMap) {
                                    $ctrl.showEnterTip = true;
                                }
                                $ctrl.floorName = floor && floor.name;
                            });

                            if(!$ctrl.showParkMap){
                                var uuid = e.target.info.properties.uuid;
                                var data = { id: uuid};
                                $scope.$emit('toRoom', data);
                            }
                        } else if (e.type == "marker") { //判断点击marker
                            var value = e.target.info.properties.userData.value;
                            var field = e.target.info.properties.userData.field;
                            var str = createBubbleContent(value, field);
                            // 弹出气泡
                            bubble && bubble.close();
                            bubble = new AirocovMap.Controls.InfoWindow({
                                content: str,
                                id: e.target.info.properties.userData.id, //传入返回的设备ID
                                floor: e.target.info.floor
                            });
                            map.addControl(bubble);
                            bubble.positioning();
                        } else { //点击到地图上，但没有点中元素
                            console.log(e.lnglat); //返回地图信息，包含点击坐标
                        }
                    });

                    map.event.on("loaded", function(){
                        //清除气泡
                        bubble && bubble.close();
                        //console.log("地图渲染完成"+new Date().toLocaleString());
                    });
                    map.event.on("loadComplete", function(e){
                        //console.log("地图加载完成"+new Date().toLocaleString());
                    });
                })
            }


            function addMarker(data,fn) {
                //清除气泡
                bubble && bubble.close();

                var arrowPoints = [];
                var currPoint=$ctrl.showParkMap?'创意天地':data[0].floor;
                var _y=$ctrl.showParkMap?50:1;
                map.clearFloorLayer(currPoint, false);
                Array.isArray(data) && data.forEach(function (value) {
                    new AirocovMap.Markers.ImageMarker({
                        imgMarker: "/view/face/track/img/user.png", //图片路径
                        size: 2,
                        // lnglat: [v.lon, v.lat], //经纬度坐标
                        lnglat: [value.map_lng,value.map_lat], //经纬度坐标
                        y: _y, //三维坐标系坐标y值
                        mapCenter: map.getMapCenter(value.floor||map.floors[0]), //地图中心点,
                        userData: {
                            id: value.id || Math.floor(Math.random()*10000),
                            value:value,
                            field : getField(value),
                        },
                        callback: function (imgMark) {
                            //将图片标注添加到地图
                            map.addToLayer(imgMark, value.floor||map.floors[0], "otherGroup", true);
                        }
                    });
                    arrowPoints.push([value.map_lng, value.map_lat])
                });
                fn && fn(arrowPoints);
            }

            //创建气泡弹出框的内容,根据设备信息 以及  field的列名和值
            function createBubbleContent(value, field) {
                var str = "<div class='col-sm-12 panel panel-default' style='width:300px;padding:15px;margin-bottom:0;'>";
                for (var key in field) {
                    var text = value[field[key]];
                    var str1 = "";
                    //这里是为了处理监测参数。是一个数组，需要换行显示
                    if(angular.isArray(text)){
                        text && text.forEach(function (t) {
                            str1 += "<div>"+t+"</div>"
                        })
                    }else {
                        str1 = text;
                    }
                    str +=
                        "<div class='row'>" +
                        "<div class='col-sm-12'>" +
                        "<div class='col-sm-5 spantext lineHeight2'>" + key + ":</div>" +
                        "<div class='col-sm-7 spantext lineHeight2'>";
                    if(key!='抓拍照片'){
                        str+=(str1 || '无');
                    }else{
                        str+="<img class='img-circle' width='60' height='60' src='"+str1+"' />";
                    }
                    str+="</div>" +
                        "</div>" +
                        "</div>";
                }
                str += "</div>";
                return str;
            }

            //根据数据获取  该数据的对应的气泡显示列是什么
            function getField() {
                var obj = {"抓拍照片":"photo","时间":"time", "位置": "position"};
                return obj;
            }

            //画人员轨迹
            function drawArrow(arrowPoints) {
                if(arrowPoints.length<2){
                    return;
                }
                // debugger
                var resultArr = [];
                var currPoint=$ctrl.showParkMap?'创意天地':arrowPoints[0].floor||map.floors[0];
                var mapCenter = coordinatesToMercato(map.getMapCenter(currPoint));
                var resultArr = coordinatesToCoordinates3(mapCenter,arrowPoints);
                var polyline = new AirocovMap.Markers.PolyLine;

                var config = {
                    //线段的高度
                    height: 2,
                    //路径的宽度
                    radius: 0.2,
                    //自定义贴图
                    imgUrl: "/view/face/track/img/arrow.png",
                    //单节长度
                    sinLength: 2,
                    //是否弯曲化,默认笔直'straight',三个以上点的路径有效。
                    lineType: 'straight',
                    speed: 0.5
                }

                var fenceId = polyline.drawPath(resultArr, config);
                map.addToLayer(fenceId,currPoint,"roadLayer");
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
                    dinatesArr.forEach(function(item){
                        var dinatesToMercato = coordinatesToMercato(item);
                        var dinatesDiff = [];
                        dinatesDiff[0] = dinatesToMercato[0] - mapCenter[0];
                        dinatesDiff[1] = dinatesToMercato[1] - mapCenter[1];
                        coordinatesThreeArr.push(dinatesDiff);
                    })
                }
                return coordinatesThreeArr;
            }
        }]
    });

    app.service('indoorService', function ($q, $http) {
        var that = this;
       
        //根据项目no获取json数据，这里做了一个判断，为了防止同一个项目切换页面时候的重复加载;
        this.getMapData = function (parkName,parkId) {
            var deferred = $q.defer();
            that.mapData=that.mapData?that.mapData:{};
             
            if (that.mapData.name != parkName) {
                if(parkId){
                    $http.get("/ovu-base/system/park/get?id="+parkId).success(function (resp) {
                   
                        if(resp.data.parkEmapPath){
                           if (resp.data.parkEmapPath.indexOf("http") == -1) {
                              
                               that.mapData =  {
                                   mapUrl: "/ovu-base" + resp.data.parkEmapPath,
                                   name: parkName
                               };
                           }else{
                               that.mapData =  {
                                   mapUrl: resp.data.parkEmapPath,
                                   name: parkName
                               };
                           }
                           deferred.resolve(that.mapData);
                        }else{
                            that.mapData={}
                            deferred.resolve(that.mapData);
                        }
                      
                   })
                } else{
                    that.mapData={}
                    deferred.resolve(that.mapData);
                }
            } else {
                setTimeout(function () {
                    deferred.resolve(that.mapData);
                });
            }
            return deferred.promise;
        }

        var getParkItem = function (name) {
            if (Array.isArray(that.mapData)) {
                return that.mapData.find(function (data) {
                    return data.name == name;
                })
            }
            return that.mapData;
        };

        // 获取园区信息( 这个需求是要展示 能源站和园区地图，所以当onlyIndoorMap为true时，显示园区，否则就是能源站地图)
        this.getPark = function (name ,onlyIndoorMap) {
            var park = getParkItem(name) || {};
            return {
                name: park.park_name || park.name,
                mapUrl: park.mapUrl,
                themeUrl: park.themeUrl
            }
        };
        // 获取楼栋
        this.getFloor = function (parkName, floorName) {
            var park = getParkItem(parkName);
            var floor = park.list.filter(function (item) {
                return item.name === floorName;
            })[0];
            return floor;
        };

        // 根据id获取楼栋
        this.getFloorById = function (parkName, id) {
            var park = getParkItem(parkName);
            var floor = park.list.find(function (item) {
                // return item.id === parseInt(id);
                return item.bimId == id;
            });
            return floor;
        };

        // 获取楼层
        this.getGround = function (parkName, floorName, groundName) {
            var floor = this.getFloor(parkName, floorName);
            var ground = floor.list.filter(function (item) {
                return item.name === groundName;
            })[0];
            return ground;
        };
    });
})();
