// 巡查轨迹 
var map;
var navg;
var pathSimplifierIns;
(function () {
    var app = angular.module("angularApp");
    app.controller('inspathCtrl', function ($scope, $rootScope, $window, $timeout, $uibModal, $http, $filter, fac, $compile) {
        document.title = "巡查轨迹";
        $scope.pageModel = {};
        $scope.search = {};
        $scope.item = {};
        $scope.isnWayList = []
        $scope.isshow = false; //显示图片按钮
        $scope.search.insDate = moment().format('YYYY-MM-DD');
        var mapCenter;
        var ovu2DMap;
        var map2dDraw;
        var CanvasLayer;
        $scope.childTree=[]
        app.modulePromiss.then(function () {
            $scope.$watch("dept.id", function (deptId, oldValue) {
               
                if (deptId) {
                    if (!$scope.dept.parkId) {
                        alert("请选择项目下的部门");
                        $scope.search.parkId && delete $scope.search.parkId;
                        $scope.search.parkName && delete $scope.search.parkName;
                        $scope.childTree=[]
                        $scope.postTree=[]
                        $scope.mainMap.clearMap();
                           return
                    }
                    $scope.mainMap.clearMap();
                    $scope.childTree=[]
                    $scope.postTree=[]
                    $scope.search.deptId=deptId
                    $scope.search.nodeText=''
                    if ($scope.dept.parkId) {
                     
                        $scope.search.parkId = $scope.dept.parkId;
                        $scope.search.parkName = $scope.dept.deptName;
                      
                        $scope.park = getPostion();
                      
                        mapCenter = [
                            $scope.park["mapLng"],
                            $scope.park["mapLat"],
                        ];
                        $rootScope.execTreeNode($rootScope.deptTree, function(
                            node
                        ) {
                           
                            if (node.id && (node.id==$scope.dept.id)) {
                             
                             $scope.childTree=node.nodes || []
                            }
                            
                        });
                        var params = {
                            pdeptId: $scope.search.deptId,
                            insType: 2,
                        }
                        $http.post('/ovu-pcos/pcos/inspection/insway/list.do?', params, fac.postConfig).success(function (res) {
                            $scope.wayList = res.data;
                        })
                        $scope.find();
                     
                    } else {
                        $scope.search.parkName && delete $scope.search.parkName;
                        $scope.search.parkId && delete $scope.search.parkId;
                       
                        //
                        // 默认定位到武汉创意天地
                        mapCenter = [114.32233, 30.471139];
                    }
                    //画出图层
                    //地图需要参数
                    var topRight = $scope.park.trPosition
                        ? $scope.park.trPosition.split(",")
                        : undefined;
                    var bomLeft = $scope.park.blPosition
                        ? $scope.park.blPosition.split(",")
                        : undefined;

                    var mapProperties = $scope.park.director
                        ? $scope.park.director.split(",")
                        : [];
                    var width = mapProperties[0]
                        ? Number(mapProperties[0])
                        : 2000;
                    var height = mapProperties[1]
                        ? Number(mapProperties[1])
                        : 2000;
                    var zoom = mapProperties[2]
                        ? Number(mapProperties[2])
                        : 2.76;
                    if ($scope.park.airscapePath) {
                        if (
                            $scope.park.airscapePath.indexOf("http") == -1
                        ) {
                            $scope.park.airscapePath =
                                "/ovu-base" + $scope.park.airscapePath;
                        }
                        ovu2DMap = new OvuMap();
                        map2dDraw = new Draw2DMap(
                            width,
                            height,
                            zoom,
                            undefined
                        );
                        ovu2DMap.loadTheme();
                        ovu2DMap.loadJson($scope.park.airscapePath);
                        var draw = function (argument) {
                            AMap.Util.requestAnimFrame(draw);
                            if (ovu2DMap.mapJson === undefined) {
                                return;
                            }
                            var _curFloor = ovu2DMap.mapJson;
                            //地图绘制
                            map2dDraw.draw(_curFloor, $scope.mainMap);
                            //图层刷新
                            CanvasLayer.reFresh();
                        };
                        CanvasLayer = new AMap.CanvasLayer({
                            canvas: map2dDraw.canvas,
                            bounds: new AMap.Bounds(bomLeft, topRight),
                            zooms: [3, 18],
                        });
                        //把图层 存放到 地图中
                        CanvasLayer.setMap($scope.mainMap);

                        //绘图循环的核心方法
                        draw(23);
                    }

                    function getPostion() {
                        var position = [];

                        function getNode(nodes) {
                            nodes &&
                                nodes.forEach(function (n) {
                                    if (n.id == $scope.dept.parkId) {
                                        position = n;
                                    } else {
                                        if (n.nodes && n.nodes.length) {
                                            getNode(n.nodes);
                                        }
                                    }
                                });
                        }
                        getNode($rootScope.parkTree);
                        return position;
                    }
               
                  
                  
                   
                  
                 
              
                }

                $scope.mainMap.setCenter(mapCenter);

            
            });
          
               
      
           

        })

       

        $scope.markList = []
        //查询巡查点
        $scope.find = function (flag) {
             if(!$scope.search.deptId){
                 alert('请选择部门')
                return
             }
            //地图
            $scope.search.userId && delete $scope.search.userId
            $scope.mainMap.clearMap();
            $scope.search.userId = $scope.search.user ? $scope.search.user.userId : undefined;
            var markers = [];
            var polylines = [];
            $http.post('/ovu-pcos/pcos/inspection/insorbit/list', $scope.search, fac.postConfig).success(function (resp) {
                if (resp.code == 0) {

                    if (resp.data.length !== 0) {
                       

                        var list = [];
                        $scope.isnWayList = resp.data;

                        resp.data.forEach(function (da) {
                            var path = []; //折线经纬度数组

                            da.insOrbitProduces && da.insOrbitProduces.forEach(function (point) {
                                if (point.longitude) {
                                    path.push([point.longitude, point.latitude]);
                                    list.push(point);
                                    $scope.markList.push(point)
                                    if (point.imagePaths) {
                                        point.imagePathlist = point.imagePaths.split(',');
                                        point.imgPath = $rootScope.processImgUrl(point.imagePathlist[0]) || '/res/img/detail.png';
                                    } else {
                                        point.imagePathlist = [];
                                        point.imgPath = ''
                                    }


                                    point.ran = Math.random().toString()
                                    var marker = addmainMarker(point, flag); //每个巡查点都要生成maker
                                    markers.push(marker);
                                }
                            })
                            var polyline = addPolyline($scope.mainMap, path, da); //每个点的路线生成一个折线
                            polylines.push(polyline);


                        })

                        // setMapBounds(list);
                        $scope.polylines = polylines;
                        $scope.mainMarkers = markers;

                    } else {
                        $scope.isnWayList = [];
                    }
                } else {
                    alert(resp.msg);
                }

            })



        };
     
        //选择部门获取路线
        $scope.setDept = function (search, node) {
            if(node){
                $scope.search.deptId = node.id
            }else{
                $scope.search.deptId=$scope.dept.id 
            }
           
          
            var params = {
                pdeptId: $scope.search.deptId,
                insType: 2,
            }
            $http.post('/ovu-pcos/pcos/inspection/insway/list.do?', params, fac.postConfig).success(function (res) {
                $scope.wayList = res.data;
            })
            $scope.find();
        }
        $scope.$watch('isnWayList', function (newV, oldV) {
            if (newV.length > 0) {
                $('#list').css('left', '0px')
            }

        }, true)
            //下一个 向左移动
            var width=0;
        $scope.goRight = function () {
            if ($scope.isnWayList.length >= 2) {

                var px = Math.ceil(0 - ($scope.isnWayList.length - 1) * 220) + "px"
                if ($('#list').css('left') == px) {
                    alert('最后一页');

                } else {
                     width=width-220
                        $("#list").animate({
                            left: "-"+(0-width)+'px'
                        }, 1000);
                }

            } else {
                alert('最后一页');
            }

        }
        //上一个 向右移动
        $scope.goLeft = function () {
            
            if ($('#list').css('left') == '0px') {
                alert('第一页');
                return
            }
             width=width+220
            $("#list").animate({
              left: width+'px'
            }, 1000);

        }



        //大地图
        $scope.mainMapOptions = {
            toolbar: true,
            // map-self config
            resizeEnable: true,
            // ui map config
            uiMapCache: false,
            zoom: 15,
            //精简模式
            liteStyle: true,
            expandZoomRange: true
        }

        //查询位置
        var geocoder;

        //点击地图上的点
        // $scope.floorIshow = false;

        var markerContent = ''

        function addmainMarker(data, flag) {
            var imagePath;
            //判断是室内点还是室外点
            if (data.type == 2) { //室外点
                if (data.pointType == 1) {
                    //开始点
                    imagePath = '../res/img/inspection/u1615.png';
                } else if (data.pointType == 3) {
                    imagePath = '../res/img/inspection/u1647.png';
                    //结束点
                } else {
                    imagePath = '../res/img/inspection/u779.png';
                }

            } else {
                if (data.pointType == 1) {
                    //开始点
                    imagePath = '../res/img/inspection/u1615.png';
                } else if (data.pointType == 3) {
                    imagePath = '../res/img/inspection/u1647.png';
                    //结束点
                } else {
                    imagePath = '../res/img/inspection/u787.png';
                }

            }
            var icon = new AMap.Icon({
                image: imagePath,
                // size: new AMap.Size(25, 30),

                // 图标所用图片大小
                imageSize: new AMap.Size(20, 20),
                // 图标取图偏移量
                imageOffset: new AMap.Pixel(0, 15)
            });

            var marker = new AMap.Marker({
                position: [data.longitude, data.latitude],
                map: $scope.mainMap,
                icon: icon,
                extData: data
            });
            if (flag) {
                marker.on('click', function (e) {
                    $scope.showPhoto(data.imgPath,data.imagePathlist);
                  
                })

                // var content='<div class="thumbnail"><img src="' + data.imgPath + '" style="width:100%;height:75px"><p  style=" font-weight: 700;margin: 5px 0px;">' + data.createTime + '</p></div>'
                // marker.setLabel({ //label默认蓝框白底左上角显示，样式className为：amap-marker-label
                //     // offset: new AMap.Pixel(20, 20), //修改label相对于maker的位置
                //     content: content

                // });
                var markerContent = document.createElement("div");
                markerContent.style.height = "104px";
                markerContent.style.width = "153px";
                var markerImg = document.createElement("img");
                var p = document.createElement("p");
                p.innerHTML = '<p  style=" font-weight: 700;margin: 5px 0px;">' + data.createTime + '</p>'
                markerContent.className = "thumbnail"; //设置描点img的统一样式
                markerImg.src = data.imgPath //设置图片url
                markerImg.style.height = "75px";
                markerImg.style.width = "100%";

                markerContent.appendChild(markerImg);
                markerContent.appendChild(p);
                marker.setContent(markerContent);

            } else {
                // marker.setLabel({ //label默认蓝框白底左上角显示，样式className为：amap-marker-label
                //     offset: new AMap.Pixel(20, 20), //修改label相对于maker的位置



                // });
                marker.setContent('');
            }
            //   var content='<div id='+data.insPointId+'></div>'




            return marker;
        }

        function addPolyline(map, path, data) {
            var polyline = new AMap.Polyline({
                path: path, //设置线覆盖物路径
                strokeColor: getRandomColor(), //线颜色
                strokeOpacity: 1, //线透明度
                strokeWeight: 5, //线宽
                strokeStyle: "solid", //线样式
                // strokeDasharray: [10, 5], //补充线样式
                lineJoin: 'round',
                lineCap: 'round',
                showDir: true,
                map: map,
                bubble: false,
                extData: data

            });
            return polyline;
        }
        function drawLine(personPosition, map) {
            /*var polyline = new AMap.Polyline({
                path: lineArr,          //设置线覆盖物路径
                strokeColor: getRandomColor(), //线颜色
                strokeOpacity: 1,       //线透明度
                strokeWeight: 5,        //线宽
                strokeStyle: "solid",   //线样式
                strokeDasharray: [10, 5] //补充线样式
            });
            polyline.setMap(map);*/

            //清空原来的轨迹数据
            if (navg) {
                
               navg.destroy();
            }
            if (pathSimplifierIns) {
                pathSimplifierIns.setData(null);
                // pathSimplifierIns.renderLater();
            }

            //加载PathSimplifier，loadUI的路径参数为模块名中 'ui/' 之后的部分
            AMapUI.load(['ui/misc/PathSimplifier'], function (PathSimplifier) {

                if (!PathSimplifier.supportCanvas) {
                    alert('当前环境不支持 Canvas！');
                    return;
                }

                //启动页面
                initPage(PathSimplifier);
            });

            function initPage(PathSimplifier) {
                //创建组件实例
                pathSimplifierIns = new PathSimplifier({
                    zIndex: 100,
                    map: map, //所属的地图实例
                    getPath: function (pathData, pathIndex) {
                      
                        return pathData.path;
                    },
                    getHoverTitle: function (pathData, pathIndex, pointIndex) {
                        //返回鼠标悬停时显示的信息
                        // if (pointIndex >= 0) {
                        //     //鼠标悬停在某个轨迹节点上
                        //     return "姓名：" + personPosition.name + "(" + personPosition.post_name + ")<br>时间：" + pathData.points[pointIndex].position_time;
                        // }
                        //鼠标悬停在节点之间的连线上
                        //return pathData.name + '，点数量' + pathData.path.length;
                    },
                    renderOptions: {
                        //轨迹线的样式
                        pathLineStyle: {
                            strokeStyle:  getRandomColor(),
                            lineWidth: 4,
                            dirArrowStyle: true
                        }
                    }
                });

                //这里构建轨迹
                window.pathSimplifierIns = pathSimplifierIns;

                pathSimplifierIns.setData([{
                    // name: personPosition.name + '的轨迹',
                    path: personPosition
                }]);

                //创建一个巡航器
                navg = pathSimplifierIns.createPathNavigator(0, //关联第1条轨迹
                    {
                        loop: true, //循环播放
                        speed: 100
                    });

                navg.start();
            }
        }

        var getRandomColor = function () {
            return (function (m, s, c) {
                return (c ? arguments.callee(m, s, c - 1) : '#') +
                    s[m.floor(m.random() * 16)]
            })(Math, '0123456789abcdef', 5)
        }
        //获取单个巡查轨迹
        $scope.getPath = function (orbitId, flag) {
            $scope.search.orbitId = orbitId
            $scope.mainMap.clearMap();

            var polylines = [];
            var markers = [];
            $http.post('/ovu-pcos/pcos/inspection/insorbit/showAsMap', {
                orbitId: orbitId
            }, fac.postConfig).success(function (data) {
                var data=data.data
                if (data.pointList.length !== 0) {
                    var list = [];
                    var path = []; //折线经纬度数组
                    data.pointList.forEach(function (da, index) {

                        if (da.longitude) {
                            if (index == 0) {
                                da.pointType = 1
                            } else if (index == data.pointList.length - 1) {
                                da.pointType = 3
                            } else {
                                da.pointType = 2
                            }

                            path.push([da.longitude, da.latitude]);
                            list.push(da);
                            if (da.imagePaths) {
                                da.imagePathlist = da.imagePaths.split(',');
                                da.imgPath = $rootScope.processImgUrl(da.imagePathlist[0]) || '/res/img/detail.png';
                            } else {
                                da.imgPath = ''
                            }


                            da.ran = Math.random().toString()
                            var marker = addmainMarker(da, flag); //每个巡查点都要生成maker

                            markers.push(marker);
                            var polyline = addPolyline($scope.mainMap, path); //每个点的路线生成一个折线
                            polylines.push(polyline);
                        }
                    })

                    $scope.polylines = polylines;
                    $scope.mainMarkers = markers;
                }
                var path = []; //实际轨迹经纬度数组
                if(data.executeOrbitList.length !== 0){
                  
                    data.executeOrbitList.forEach(function (da, index) {
                        if (da.latitude && da.longitude) {
                            path.push([da.longitude, da.latitude]);
                           
                        }
                    })
                    drawLine(path,$scope.mainMap)
                 
                }else{
                    if (navg) {
                
                        navg.destroy();
                     }
                     if (pathSimplifierIns) {
                         pathSimplifierIns.setData(null);
                         // pathSimplifierIns.renderLater();
                     }
                }

            })

        }
        //点击路线
        $scope.clickPolyline = function ($event, $params, polyline) {

            var data = polyline.getExtData();

            $scope.search.orbitId = data.orbitId

            var index = $scope.isnWayList.findIndex(e => {
                return e.orbitId == $scope.search.orbitId
            })
            var arr = $scope.isnWayList

            if (index > 0 && index < arr.length - 1) {
                var arr1 = arr.slice(index, arr.length - 1);
                var arr2 = arr.slice(0, index + 1);
                $scope.isnWayList = arr1.concat(arr2)
            } else if (index == arr.length - 1) {
                $scope.isnWayList.reverse()
            }
            //  $('#list').css('left','0px')
            //  $("#list").animate({
            //     left: "-=290px"
            // }, 1000);
            $http.post('/ovu-pcos/pcos/inspection/insorbit/showAsMap', {
                orbitId: data.orbitId
            }, fac.postConfig).success(function (data) {
                var data=data.data
                if(data.executeOrbitList.length !== 0){
                    var path = []; //实际轨迹经纬度数组
                    data.executeOrbitList.forEach(function (da, index) {
                        if (da.latitude && da.longitude) {
                            path.push([da.longitude, da.latitude]);
                            drawLine(path,$scope.mainMap)
                        }
                    })
                }

            })



        }



        //显示图片
        $scope.showImg = function () {
            if (!$scope.isshow) {
                $scope.isshow = true
            }


            var markers = [];
            // $scope.markList.forEach(function (da) {
            //     if (da.longitude && da.latitude && da.imagePaths) {

            //         var marker = addmainMarker(da, true);
            //         markers.push(marker);

            //     }
            // })
            // $scope.mainMarkers = markers;




            if (!$scope.search.orbitId) {
                $scope.find(true);
            } else {

                $scope.getPath($scope.search.orbitId, true)
            }

        }

        //隐藏图片
        $scope.displayImg = function () {
            if ($scope.isshow) {
                $scope.isshow = false
            }

            $scope.mainMap.clearMap();
            if (!$scope.search.orbitId) {
                $scope.find();
            } else {

                $scope.getPath($scope.search.orbitId)
            }


        }
        // //显示图片
        $scope.showPhoto = function (src, imgList) {
            $("#sImg").attr('src', src);
            var src = event.srcElement.getAttribute("src") || src;
            if (src && src.indexOf("?imageView2") > -1) {
                src = src.substr(0, src.indexOf("?imageView2"));
            }
            $scope.curPic = {
                url: src,
                on: true
            };
            //下一张图片
           
            var j = imgList.length - 1;
            var i = 0;
            $scope.next = function () {
                    if (i == imgList.length - 1) {
                        alert('最后一张');
                        j = imgList.length - 1;
                        return
                    }
                    i++;
                    if (imgList.length > 1) {
                        $scope.curPic = {
                            url: imgList[i],
                            on: true
                        }

                    } else {
                        alert('最后一张');
                    }


                },
                $scope.before = function () {

                    if (j == 0) {
                        alert('第一张');
                        i = 0;
                        return
                    }
                    j--;
                    if (imgList.length > 1) {
                        $scope.curPic = {
                            url: imgList[j],
                            on: true
                        }
                    } else {
                        alert('最后一张');
                    }
                }

           

        }



    });


})()
