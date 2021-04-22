var map;
var navg;
var pathSimplifierIns;

(function () {
    var app = angular.module("angularApp");
    app.controller('personTrackCtrl', function ($scope, $rootScope, $http, $uibModal, fac) {
        document.title = "历史轨迹";
        var mapCenter;
        var mapHeight = $("#routeBody").outerHeight()-$(".page-title").outerHeight()-$("#queryBox").outerHeight()-$("#personList").outerHeight();
        $("#mapDiv").css("height",mapHeight-170);
        $scope.tody=moment().format('YYYY-MM-DD');
        function getPostion() {
            var position = []

            function getNode(nodes) {
                nodes && nodes.forEach(function (n) {
                    if (n.id == $scope.dept.parkId) {
                        position = n
                    } else {
                        if (n.nodes && n.nodes.length) {
                            getNode(n.nodes)
                        }
                    }
                })
            }
            getNode($rootScope.parkTree)
            return position
        }
        function getTodayDate() {
            var date = new Date();
            var year = date.getFullYear();
            var month = date.getMonth() + 1;
            var day = date.getDate();
            return [year, month, day].map(function (n) {
                n = n.toString();
                return n[1] ? n : '0' + n;
            }).join('-');
        }

        $scope.search = {
            date: getTodayDate(),
        };

        app.modulePromiss.then(function () {
            $rootScope.$watch('dept.id', function (deptId, oldValue) {
                if (deptId) {
                    $scope.search.deptId=deptId
                    if ($scope.dept.parkId) {
                        // $scope.item.parkId=$scope.dept.parkId;
                        // $scope.item.parkName=$scope.dept.deptName;
                       
                        $scope.park = getPostion();
                        
                        mapCenter = [$scope.park['mapLng'], $scope.park['mapLat']];
                        
                       
                       
                        
                    }else{
                        mapCenter=[]; 
                    } 
                    // $scope.deptTree = $.extend(true,[],[fac.getNodeById(app.deptTree,deptId)]);
                   $scope.loginUser=$scope.user;
                   $scope.loginUser.userId=$scope.user.personId;
                   $scope.loginUser.userName=$scope.user.nickname;
                   $scope.loginUser.id = $scope.user.personId;
                   $scope.find($scope.loginUser)
                }
            })
        });
      

        function kaishiFull() {
            var docElm = document.documentElement;
            //W3C
            if (docElm.requestFullscreen) {
                docElm.requestFullscreen();
            }
            //FireFox
            else if (docElm.mozRequestFullScreen) {
                docElm.mozRequestFullScreen();
            }
            //Chrome等
            else if (docElm.webkitRequestFullScreen) {
                docElm.webkitRequestFullScreen();
            }
            //IE11
            else if (elem.msRequestFullscreen) {
                elem.msRequestFullscreen();
            }
        }


        //TODO 全屏处理
        function fullmap() {
            
            var mapDiv = document.getElementById("mapDiv");
            var width = window.screen.width;
            var height = window.screen.height;
            mapDiv.style.width = width + "px";
            mapDiv.style.height = height + "px";
            mapDiv.setAttribute("class", "map-full");
        }

        /**
         * 退出全屏
         */
        /*document.onkeydown = function (event) {
            var e = event || window.event || arguments.callee.caller.arguments[0];
            console.log(e)
            if (e && e.keyCode == 27) {
                console.log("exit full")
                var mapDiv = document.getElementById("mapDiv");
                mapDiv.style.width = "100%";
                mapDiv.style.height = "100%";
                mapDiv.setAttribute("class", "map-init");
            }
        }*/


        /**
         * 地图全屏
         */
        $scope.full = function () {
            console.log('full....');
            kaishiFull();

            document.addEventListener("fullscreenchange", function () {
                fullmap();
                console.log('full....w3c');
            }, false);

            document.addEventListener("mozfullscreenchange", function () {
                fullmap();
                console.log('full....FireFox');
            }, false);

            document.addEventListener("webkitfullscreenchange", function () {
                fullmap();
                console.log('full....chrome');
            }, false);

            document.addEventListener("msfullscreenchange", function () {
                fullmap();
                console.log('full....IE11');
            }, false);

        };


        function getPersonPosition(ids,user) {
            var param = {
                ids: ids,
                type: 1,
                date: $scope.search.date,
                time:$scope.search.time
            };
            $http.post("/ovu-pcos/pcos/personPostion/getPersonPosition.do", param, fac.postConfig).success(function (data) {
           
                if($scope.search.time){
                    $scope.search.time=$scope.search.time.replace(/-/g," - ")
                }
                $scope.personAndPositions = data;
                loadPostion();
                $scope.setZoomAndCenter(user)
            })
        }


        /**
         * 选择员工
         */
        $scope.choosePerson = function () {
            var modal = $uibModal.open({
                animation: false,
                size: 'lg',
                templateUrl: '/common/modal.select.mutiDeptPerson.html',
                controller: 'mutiDeptPersonSelectorCtrl'
                , resolve: {
                    // deptTree:function(){return $.extend(true,[],$scope.deptTree)}
                      //根据列表页选择的部门过滤出模态框的部门
                      deptTree:function(){return $.extend([],$scope.deptTree)}
                }
            });
            modal.result.then(function (data) {
                if (data) {
                    $scope.personsSelected = data.personsSelected;
                    var ids = [];
                    data.personsSelected.forEach(function (item) {
                        ids.push(item.id);
                    });
                    getPersonPosition(ids);
                }
            }, function () {
                console.info('Modal dismissed at: ' + new Date());
            });
        };

        /**
         * 查询
         */
        //比较开始时间值和结束时间值
        function calculate(str){
            var list=str.split(' - ')
            var time1=  list[0].replace(":","");
            var time2=  list[1].replace(":","");
            return time1 >= time2;
        }
        $scope.find = function (user) {
            $scope.personsSelected=[];
            if(!user){
                alert('请选择人员')
                return;
            }
            if(!user.userId){
                alert("此用户“"+user.name+"”未分配系统账号！");
                return;
            }
            if(!$scope.search.date){
                alert('请选择日期')
                return;
            }
            
            if($scope.search.time && calculate($scope.search.time)){
                alert('开始时间必须小于结束时间')
                return
            }
            if($scope.search.time){
                $scope.search.time=$scope.search.time.replace(/\s+/g,"")
            }
         
            $scope.search.userId = user.userId;
           
            $scope.personsSelected.push(user);
            getPersonPosition($scope.personsSelected[0].id,user);
           
        };


        /**
         * 选择一个或者不选择
         * @param item
         */
        $scope.chooseOne = function (item) {
            item.checked = !item.checked;
        };


        /**
         * 定位到某个人
         * @param person
         */
        $scope.setZoomAndCenter = function (person) {
            //清除覆盖物
            // var map;
            // map = map || new AMap.Map('containerTrack', {
            //     resizeEnable: true,
            //     zoom: 13
            // });
            map.clearMap();

            //画轨迹线
            var personLinesArr = getPersonLinesArr($scope.personAndPositions);
            personLinesArr.forEach(function (p) {
                if (p.id === person.id) {
                    drawLine(p, map);
                }
            });
            if(personLinesArr.length==0){
                if (navg) {
                    navg.destroy();
                 }
                 if (pathSimplifierIns) {
                     pathSimplifierIns.setData(null);
                     // pathSimplifierIns.renderLater();
                 }
            }

           


        };


        /**
         * 初始化地图,显示当前项目空间的经纬度，否则显示武汉地图
         */
        function initMap() {

            var park = app.park || {};
            var mapConfig = {resizeEnable: true,};
            if (park.TR_POSITION && park.BL_POSITION) {
                mapConfig.zoom = 15;
                var topRight = park.TR_POSITION.split(",");
                var bomLeft = park.BL_POSITION.split(",");
                var centerLng = (Number(topRight[0]) + Number(bomLeft[0])) / 2;
                var centerLat = (Number(topRight[1]) + Number(bomLeft[1])) / 2;
                mapConfig.center = [centerLng.toFixed(6), centerLat.toFixed(6)];

                if (park.PARK_ICON) {
                    var imageLayer = new AMap.ImageLayer({
                        url: $rootScope.processImgUrl(park.PARK_ICON, 'origin'),
                        bounds: new AMap.Bounds(
                            bomLeft,
                            topRight
                        ),
                        zooms: [15, 18]
                    });
                    mapConfig.layers = [
                        new AMap.TileLayer(),
                        imageLayer
                    ]
                }
            }
            map = new AMap.Map('containerTrack', mapConfig);

            AMapUI.loadUI(['control/BasicControl'], function (BasicControl) {

                //添加一个缩放控件
                map.addControl(new BasicControl.Zoom({
                    position: 'rt'
                }));

            });
          
            // var mouseTool = new AMap.MouseTool(map); 
            // var overlays = [];
            // mouseTool.on('draw',function(e){
            //     overlays.push(e.obj);
            // }) 
            // function draw(type){
            //   switch(type){
            //     case 'rule':{
            //         mouseTool.rule({
            //             startMarkerOptions : {//可缺省
            //                 icon: new AMap.Icon({
            //                     size: new AMap.Size(19, 31),//图标大小
            //                     imageSize:new AMap.Size(19, 31),
            //                     image: "https://webapi.amap.com/theme/v1.3/markers/b/start.png"
            //                 })
            //             },
            //             endMarkerOptions : {//可缺省
            //                 icon: new AMap.Icon({
            //                     size: new AMap.Size(19, 31),//图标大小
            //                     imageSize:new AMap.Size(19, 31),
            //                     image: "https://webapi.amap.com/theme/v1.3/markers/b/end.png"
            //                 }),
            //                 offset: new AMap.Pixel(-9, -31)
            //             },
            //             midMarkerOptions : {//可缺省
            //                 icon: new AMap.Icon({
            //                     size: new AMap.Size(19, 31),//图标大小
            //                     imageSize:new AMap.Size(19, 31),
            //                     image: "https://webapi.amap.com/theme/v1.3/markers/b/mid.png"
            //                 }),
            //                 offset: new AMap.Pixel(-9, -31)
            //             },
            //             lineOptions : {//可缺省
            //                 strokeStyle: "solid",
            //                 strokeColor: "#FF33FF",
            //                 strokeOpacity: 1,
            //                 strokeWeight: 2
            //             }
            //             //同 RangingTool 的 自定义 设置，缺省为默认样式
            //         });
            //         break;
            //     }
            //     case 'measureArea':{
            //         mouseTool.measureArea({
            //             strokeColor:'#80d8ff',
            //             fillColor:'#80d8ff',
            //             fillOpacity:0.3
            //           //同 Polygon 的 Option 设置
            //         });
            //         break;
            //     }
            //   }
            // }
            // var radios = document.getElementsByName('func');
            // for(var i=0;i<radios.length;i+=1){
            //     radios[i].onchange = function(e){
            //       draw(e.target.value)
            //     }
            // }
            // draw('rule')
        
            // document.getElementById('close').onclick = function(){
            //     mouseTool.close(true)//关闭，并清除覆盖物
            //     for(var i=0;i<radios.length;i+=1){
            //         radios[i].checked = false;
            //     }
            // }
        }

        /**
         * 随机颜色
         * @returns {string}
         */
        var getRandomColor = function () {
            return '#' + (Math.random() * 0xffffff << 0).toString(16);
        };

        /**
         * 画轨迹线
         */
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
                        var points = pathData.points,
                            lnglatList = [];

                        for (var i = 0, len = points.length; i < len; i++) {
                            lnglatList.push(points[i].lnglat);
                        }
                      
                        return lnglatList;
                    },
                    getHoverTitle: function (pathData, pathIndex, pointIndex) {
                        //返回鼠标悬停时显示的信息
                        if (pointIndex >= 0) {
                            //鼠标悬停在某个轨迹节点上
                            return "姓名：" + personPosition.name + "(" + personPosition.post_name + ")<br>时间：" + pathData.points[pointIndex].position_time;
                        }
                        //鼠标悬停在节点之间的连线上
                        //return pathData.name + '，点数量' + pathData.path.length;
                    },
                    renderOptions: {
                        //轨迹线的样式
                        pathLineStyle: {
                            strokeStyle: 'red',
                            lineWidth: 6,
                            dirArrowStyle: true,
                           
                        },
                        renderAllPointsIfNumberBelow: 100
                    }
                });

                //这里构建轨迹
                window.pathSimplifierIns = pathSimplifierIns;

                pathSimplifierIns.setData([{
                    name: personPosition.name + '的轨迹',
                    points: personPosition.points
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

        /**
         * 数据分组
         * @param personAndPositions
         */
        function getPersonLinesArr(arr) {
            var map = {},
                dest = [];
            arr.forEach(function (ai) {
                if (ai.map_lat != null && ai.map_lng != null) {
                    var position = [parseFloat(ai.map_lng), parseFloat(ai.map_lat)];
                    if (!map[ai.id]) {
                        dest.push({
                            id: ai.id,
                            name: ai.name,
                            post_name: ai.post_name,
                            points: [{
                                position_time: ai.position_time,
                                lnglat: position
                            }]
                        });
                        map[ai.id] = ai.id;
                    } else {
                        for (var j = 0; j < dest.length; j++) {
                            var dj = dest[j];
                            if (dj.id == ai.id) {
                                dj.points.push({
                                    position_time: ai.position_time,
                                    lnglat: position
                                });
                                break;
                            }
                        }
                    }
                }
            });
            return dest;
        }

        /**
         * 加载定位信息
         * 连线画轨迹
         */
        function loadPostion() {

            /*var infoWindow = new AMap.InfoWindow({offset: new AMap.Pixel(0, -30)});

            function markerClick(e) {
                infoWindow.setContent(e.target.content);
                infoWindow.open(map, e.target.getPosition());
            }*/

            // 清除地图覆盖物
            map = map || new AMap.Map('containerTrack', {
                resizeEnable: true,
                zoom: 13
            });
            map.clearMap();
            if(mapCenter.length>0){
             
                map.setZoomAndCenter(18, mapCenter)
            }else{
                map.setZoomAndCenter(8, [116.214547,39.983965]); //同时设置地图层级与中心点
            }
            //清空之前的定位标记
            $scope.personsSelected.map(function (selected) {
                if ("position" in selected) {
                    delete selected.position;
                }
                selected.isClick = false;
                return selected;
            });

            //选择列表里显示是否有定位数据
            $scope.personAndPositions.map(function (node, i) {
                if (node.map_lat != null && node.map_lng != null) {
                    var position = [parseFloat(node.map_lng), parseFloat(node.map_lat)];

                    //画点
                    /*var marker = new AMap.Marker({
                        map: map,
                        icon: icons[i % 10],
                        position: position,
                        offset: new AMap.Pixel(-12, -36)
                    });
                    marker.content = "姓名：" + node.name + "(" + node.post_name + ")<br>时间：" + node.position_time;
                    marker.on('click', markerClick);
                    marker.emit('click', {target: marker});*/

                    // $scope.personsSelected.map(function (selected) {
                    //     if (node.id === selected.id) {
                    //         selected.position = position;
                    //         //selected.marker = marker;
                    //     }
                    //     return selected;
                    // });

                }
                return node;
            });


          
            

            map.setFitView();
        }

        /**
         * 加载地图
         */
        initMap();

    
    
  


    });
})()
