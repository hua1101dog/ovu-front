var map;
(function () {
    var app = angular.module("angularApp");
    app.controller('personPositionCtl', function ($scope, $rootScope, $http, $uibModal, fac) {
        document.title = "实时定位";
       var mapCenter;
        var mapHeight = $("#routeBody").outerHeight() - $(".page-title").outerHeight() - $("#personList").outerHeight();
        $("#mapDiv").css("height", mapHeight-160);
        var map = new AMap.Map('containerPosition', {
            resizeEnable: true,
            zoom: 10,
           
        })
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
        app.modulePromiss.then(function () {
            $rootScope.$watch('dept.id', function (deptId, oldValue) {
                if (deptId) {
                    $scope.deptTree = $.extend(true,[],[fac.getNodeById(app.deptTree,deptId)])
                    if ($scope.dept.parkId) {
                        // $scope.item.parkId=$scope.dept.parkId;
                        // $scope.item.parkName=$scope.dept.deptName;
                       
                        $scope.park = getPostion();
                        
                        mapCenter = [$scope.park['mapLng'], $scope.park['mapLat']];
                        
                       
                       
                        
                    }else{
                        mapCenter=[]; 
                    } 
                    loadPostion()
                    $http.get("/ovu-pcos/pcos/personPostion/getDeptPersonList.do?deptId="+deptId).success(function (data) {
                       if(data){
                        // $scope.personsSelected = data;
                        var ids = [];
                        data && data.forEach(function (item) {
                            ids.push(item.id);
                        });
                        getPersonPosition(ids,true);
                       }
                       
                     
                    })
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
            console.log("fullmap")
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
        /*document.onkeydown=function(event){
            var e = event || window.event || arguments.callee.caller.arguments[0];
            console.log(e)
            if(e && e.keyCode==27){
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


        function getPersonPosition(ids,flag) {
            //实时定位数据 type = 0
            var param = {
                ids: ids.join(","),
                type: 0
            };
            $http.post("/ovu-pcos/pcos/personPostion/getPersonPosition.do", param, fac.postConfig).success(function (data) {
                map.clearMap();
                if(flag){
                    $scope.personsSelected=data
                   }
               if(data && data.length){
                  
                loadPostion(data);
               }
            })
        }


        /**
         * 选择员工
         */
        $scope.choosePerson = function () {
            $scope.deptTree.forEach(function(node){
                node.state = node.state || {};
                node.state.checked = false;
                if(node.nodes){
                    uncheck(node.nodes)

                }
                function uncheck(v){
                   v.forEach(function(n){
                        n.state = n.state || {};
                        n.state.checked = false;
                        if(n.nodes){
                            uncheck(n.nodes)
                        }
                    })
                    
                }
            })
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
            if (person.position) {
                map.setZoomAndCenter(18, person.position);
            }
            if (person.marker) {
                //弹窗显示切换
                var marker = person.marker;
                marker.emit('click', {target: marker});
            }
        };


       //初始化地图,显示当前项目空间的经纬度，否则显示武汉地图
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
        map = new AMap.Map('container', mapConfig);

        AMapUI.loadUI(['control/BasicControl'], function (BasicControl) {

            //添加一个缩放控件
            map.addControl(new BasicControl.Zoom({
                position: 'rt'
            }));

        });
    }


        /**
         * 加载定位信息
         */
        function loadPostion(positionData) {
            
            var infoWindow = new AMap.InfoWindow({offset: new AMap.Pixel(0, -30)});

            function markerClick(e) {
                infoWindow.setContent(e.target.content);
                infoWindow.open(map, e.target.getPosition());
            }

            // 清除地图覆盖物
            
            map.clearMap();
            if(mapCenter.length>0){
             
                map.setZoomAndCenter(18, mapCenter)
            }else{
                map.setZoomAndCenter(8, [116.214547,39.983965]); //同时设置地图层级与中心点
            }

            //标记图片
            var icons = [];
            for (var i = 0; i < 10; i++) {
                var icon = new AMap.Icon({
                    image: '/res/img/mark_bs/mark_bs' + (i + 1) + '.png',
                });
                icons[i] = icon;
            }

            positionData && positionData.map(function (node, i) {
                if (node.map_lat != null && node.map_lng != null) {
                    var position = [parseFloat(node.map_lng), parseFloat(node.map_lat)];

                    var marker = new AMap.Marker({
                        map: map,
                        icon: icons[i % 10],
                        position: position,
                        offset: new AMap.Pixel(-12, -36),
                        
                    });
                    marker.content = "姓名：" + node.name + "(" + node.post_name + ")<br>时间：" + node.position_time;
                    marker.on('click', markerClick);
                    marker.emit('click', {target: marker});

                    $scope.personsSelected.map(function (selected) {
                        if (node.id === selected.id) {
                            selected.position = position;
                            selected.marker = marker;
                        }
                        return selected;
                    });
                }

                return node;
            });
            map.setFitView();
        }

        /**
         * 加载地图
         */
        // initMap();

    });
})()
