(function () {
    "use strict";
    var app = angular.module("angularApp");
   
    app.component('mapBlockComponent', {
        templateUrl: '/common/mapComponent/component/schemeDetail.html',
        bindings: {
            mapData: '<',
            onBim: '&',

        },
        controller: ['$scope', '$rootScope', '$timeout', '$http', 'indoorService', '$state','$compile', function ($scope, $rootScope, $timeout, $http, indoorService, $state,$compile) {
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
                zoom: 2.4,
                // defaultFloor: "武汉创意天地",
                showViewMode: "MODE_2D",
                defaultGap: 18,//楼层间距
                showMenu: false,//不显示楼层选择
                theta: 0,
                //2d模式下地图水平方向初始旋转角度,默认为20度
            });
            var parkName = indoorService.park.parkName;//园区名称
            var parkNo = indoorService.parkNo; //园区编号

            var mapList = [];    //地图渲染数据
            var map;             //map
            var bubble;
            $ctrl.startRange = false;



            $ctrl.$onInit = function () {
                console.log('indoor map init...');
                // 返回园区
                $ctrl.showParkMap = true;  //是否展示园区地图

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
                        floorName: floor.name,
                        name: item.name,
                        id: parseInt(item.name.substring(1))
                    };
                    $scope.$emit('toGround', state);
                };

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
            function loadMap() {
                console.log('loading map...');
                //地图变量重新加载
                $ctrl.show2DMode = true;
                $ctrl.showParkMap = true;
                $ctrl.selectNo = 0;
                mapList = [];//地图数据
                parkName = indoorService.park.parkName;//园区名称
                parkNo = indoorService.parkNo; //园区编号


                indoorService.getMapData(parkNo, parkName).then(function () {
                    var mapData = indoorService.getPark(parkName);

                    if (mapData.name) {
                        if ($ctrl.mapData && $ctrl.mapData.name) {
                            mapData.name = $ctrl.mapData.name
                            mapData.timeStr = $ctrl.mapData.timeStr || ''
                        }
                        mapList.push(mapData);
                    }

                    if (mapList.length == 0) {
                        map = null;
                        document.querySelector('#mapBox_block').innerHTML = '';

                        return;
                    }

                    if (!map) {
                        // 初始化地图
                        map = new AirocovMap.Map({
                            container: document.querySelector('#mapBox_block'),
                            // mapList: mapList,
                            mapList: JSON.parse(JSON.stringify(mapList)),
                            themeUrl: "/common/mapComponent/json/indoorMapData/theme/fillcolor.json",
                            position: {//设置相机位置
                                x: 0,
                                y: 300,
                                z: 0
                            }
                        });
                    } else {
                        $timeout(function () {
                            map.resetRender({
                                mapList: JSON.parse(JSON.stringify(mapList))
                            });
                        })
                    }


                    // 地图点击事件
                    map.event.on("click", function (e) { //注册点击事件
                             console.log(e.position)
                            bubble && bubble.close();
                            // x: 23.321088267605777, y: 51.00000000000007, z: 195.7142819517696
                         var data=e.target.info.properties.userData
                      
                        if (e.type == 'marker') {
                       
                            if(data.item.hasReport){
                                //秩序卫生巡查
                              
                                  map.moveTo(e.position)
                             addInfoWindow(e, map,1)
                            }else if(data.item.insPointId){
                                //巡逻岗巡查
                                if(data.item.status==2){
                                     map.moveTo({x:e.position.x,y:e.position.y,z:e.position.z-220})
                                  addInfoWindow(e, map,2)
                                }
                                
                            }
                             

                        }else if(e.type == 'fence'){
                               
                              if(data.item.equipmentId){
                               if(data.item.insResultImages){
                                 if(!angular.isArray(data.item.insResultImages)){
                                  
                                 data.item.insResultImages=data.item.insResultImages.split(',')
                                  console.log(data.item.insResultImages)
                                  }
                                  map.moveTo(e.position)
                                  addInfoWindow(e, map,3,data.item.insResultImages)

                                     
                              }else{
                                alert('暂无图片')
                              }
                              }
                              
                     
                        }
                        //清除摄像头点位
                          // map.clearLayer(mapList[0].name, 'caram');


                    });

                    map.event.on("loaded", function () {
                        map.control.enableRotate = false;
                        var mapObj = {
                            map: map,
                            addImgMarker: addImgMarker,
                            drawPeoplePath: drawPeoplePath,
                            addRangesMarker:addRangesMarker,
                            addImgMarker_p:addImgMarker_p

                        }
                        map.clearLayer(mapList[0].name, "otherGroup",true);
                         // map.clearLayer(mapList[0].name, "caram",true);
                        $rootScope.$emit("loadCompleteMap" + mapList[0].timeStr, mapObj);
                        console.log("地图渲染完成" + new Date().toLocaleString());
                    });
                    map.event.on("loadComplete", function (e) {
                        //console.log("地图加载完成"+new Date().toLocaleString());
                    });
                })
            }

            //选择颜色
            $ctrl.chooseColor = function (item) {
                $ctrl.curMarkUrl = item
                index = $ctrl.curMarkUrlList.indexOf(item)
            }

            var size;
            function addImgMarker(layerName,lnglat, map, name, item) {
                 map.clearLayer(name, layerName);
             
                  var img = '/res/img/mark_bs/list_icon_001.png'
                  if(layerName=='camera'){
                    //摄像头
                    size=2
                       if(item.cameraList.length>1){
                           img= '/res/img/mutilCamer.png'

                      }else if(item.cameraList.length==1){
                         img= '/res/img/singleCamer.png'
                      }else{
                         img= '/res/img/noCamer.png'
                      }
                  }else{
                    size=1.2
                    if(item.status==1){
                        //未巡查
                        img= '/res/img/mark_bs/list_icon_002.png'

                    }else{
                       img= '/res/img/mark_bs/icon_green.png'
                    }
                  }
             
               new AirocovMap.Markers.ImageMarker({
                    imgMarker: img, //图片路径
                    size: size, //图片大小缩放系数
                    // position:{x:x0,y:y0,z:z0}, //三维坐标系坐标
                    lnglat: lnglat,//[114.3218162017, 30.470431986173], //[Math.abs(lnglat[0]),Math.abs(lnglat[1])], //经纬度坐标
                    y: 60, //三维坐标系坐标y值
                    userData: {
                        item:item,
                         id: Math.floor(Math.random() * 10000),
                    },
                    mapCenter: map.getMapCenter(name), //地图中心点
                    callback: function (imgMark) {
                        //将图片标注添加到地图
                        map.addToLayer(imgMark, name, layerName, true);
                    }
                });
            }
              //根据positon 打点
             function addImgMarker_p(layerName,lnglat, map, name,item) {
               map.clearLayer(name, layerName);
               var img = ''
               if(item.hasReport){
                img = '/res/img/mark_bs/mark_bs1.png'
               }else{
                img = '/res/img/mark_bs/mark_bs5.png'
               }
                
   
               new AirocovMap.Markers.ImageMarker({
                    imgMarker: img, //图片路径
                    size: 1.2, //图片大小缩放系数
                    position:{x:lnglat[0],y:100,z:lnglat[1]}, //三维坐标系坐标
                    y: 100, //三维坐标系坐标y值
                    userData: {
                        item:item,
                         id: Math.floor(Math.random() * 10000),
                    },
                    mapCenter: map.getMapCenter(name), //地图中心点
                    callback: function (imgMark) {
                        //将图片标注添加到地图
                        map.addToLayer(imgMark, name, layerName, true);
                    }
                });
            }
              //创建围栏
            function drawFence(curMarker,name) {
                
                  if(!curMarker.blockColor){
                  //    if(curMarker.hanleStatus==1){
                  //      //未处理
                  //      curMarker.blockColor='#708090'
                  // }else if(curMarker.hanleStatus==2){
                  //       //不达标
                  //        curMarker.blockColor='#DC143C'
                  // }else{
                  //   //已达标
                  //   curMarker.blockColor='#008000'
                  // }
                     if(curMarker.hanleStatus==3){
                       //已达标
                       curMarker.blockColor='#008000'
                  }else if(curMarker.hanleStatus==2){
                        //不达标
                         curMarker.blockColor='#DC143C'
                  }else{
                    //未处理
                    curMarker.blockColor='#708090'
                  }
                  }
                let polyline = new AirocovMap.Markers.PolyLine();
                //围栏的配置
                var config = {
                    height: 70, //围栏高度
                    color: curMarker.blockColor , //围栏平面颜色
                    opacity: 0.4, //围栏平面透明度
                    lineColor: curMarker.blockColor, //围栏线的颜色
                }
                //创建围栏，传入围栏坐标及配置，返回围栏对象
                var fence = polyline.drawWordsFence(curMarker.points, config)
                curMarker.id=Math.floor(Math.random() * 10000)
                curMarker.color=curMarker.blockColor
                fence.info.properties.userData.item =curMarker;
                fence.info.properties.userData.id =Math.floor(Math.random() * 10000);
                //添加到对应楼层中图层
                map.addToLayer(fence, mapList[0].name, name, true);

            }
             
                //画区域范围
                function addRangesMarker(ranges,map,name){
                // map.clearLayer(mapList[0].name, name);
                if( $ctrl.curMarker&&$ctrl.curMarker.objId ){
                    map.clearLayer(mapList[0].name,$ctrl.curMarker.objId,true);                   
                }
                
                ranges.forEach(po=> {
                    drawFence(po,name)

                    
                })
             
            }

       //随机生成minx 到max的随机整数数 包括n和m      
    function random(min, max){
    var random = max - min + 1;
    return Math.floor(Math.random() * random + min);
     }
 
            // 画线
            function drawPeoplePath(list, map, name) {
                 
                // map.clearLayer(name, "roadLayer");
                let imc = coordinatesToMercato(map.getMapCenter(name));
                let polyline = new AirocovMap.Markers.PolyLine();
                 let arr = [];
                list.forEach((value) => {
              
                
                    let tempPt = coordinatesToCoordinates3(imc, [Number(value[0]), Number(value[1])]);
                        arr.push([tempPt[0]*.1,tempPt[1]*.1]);
       
    
                })
              
                  
                
                  //路径的配置
                    let config = {
                        //线段的高度
                        height: 59,
                        //路径的宽度
                        radius: .2,
                        //自定义贴图
                        // imgUrl: "/res/img/mark_bs/green.png",  
                        imgUrl:'/res/img/line/'+random(1,15)+'.png',
                        //运动速度
                        speed: 2,
                        //单节长度
                        sinLength: 3,
                        //是否弯曲化,默认笔直'straight',三个以上点的路径有效。
                        lineType: 'straight'
                    };
                  //创建路径
                    let path = polyline.drawPath(arr, config);
                    path.scale.x = 10;
                    path.scale.z = 10;
                    map.addToLayer(path, name, "roadLayer", true);
                 // var PolyLine = new AirocovMap.Markers.PolyLine()
                 // var config = {
                 //        //高度
                 //      height: 50,
                 //         //颜色
                 //     lineColor: "#32ff23",
                 //     //宽度
                 //      lineWidth: 2,
                 //  //是否有方向标记
                 //     direction: true,
                 //    }
                 // //创建meshLine
                 //      var meshLine = PolyLine.drawLine(arr, config)
                 //      // console.log(list)
                 //   //添加到对应楼层中图层
                 //    // meshLine.scale.x = 10;
                 //    // meshLine.scale.z = 10;
                 //     var meshLineId = map.addToLayer(meshLine, name, "roadLayer", true)



            };
              //信息窗
            function addInfoWindow(e, map,flag,img) {
                         bubble && bubble.close();

                     var content=''
              
                var arr=[];
        
                  if(flag==1){
                   //秩序卫生巡查
                 if(e.target.info.properties.userData.item.personList){
                    e.target.info.properties.userData.item.personList.forEach(v=>{
                        v.workunitList && v.workunitList.forEach(workUnit=>{
                            workUnit.personName=v.personName
                           if(workUnit.photos){
                             if(!angular.isArray(workUnit.photos)){
                                 workUnit.photos= workUnit.photos.split(',')
                            }
                        }else{
                            workUnit.photos=['/res/img/detail.png']
                        }
                          
                            arr.push(workUnit)
                        })
                    })
                      content='<div class="infoWin" style="overflow: auto;max-height: 281px">'+getTem(arr)+'</div>'
                    }else{

                    }
                   } 
                   if(flag==2){
                    if(e.target.info.properties.userData.item.insResultImages){
                       if(!angular.isArray(e.target.info.properties.userData.item.insResultImages)){
                                 e.target.info.properties.userData.item.insResultImages= e.target.info.properties.userData.item.insResultImages.split(',')
                       } 
                         content=carousel(e.target.info.properties.userData.item.insResultImages)
                        
                   }else{
                    alert('暂无图片')
                       
                   }
                   }
                   if(flag==3){
                     
                        var temp=''
                        for(var i=0;i<img.length;i++){
                        temp+='<img src="'+img[i]+'" alt="" style="width:500px;height:300px">'
                        }

                       content='<div class="infoWin" style="padding:10"><p style="margin-bottom: 5px;">外围卫生巡查</p>'+temp+'</div>'
                    
                   }
              
                
                 if(flag!==3){
                     bubble = new AirocovMap.Controls.InfoWindow({
                    //信息窗内容，是一个dom
                   
                      content: content,
                    id: e.target.info.properties.userData.id,  //楼层的模型info.id或自定义id
                    floor: e.target.info.floor //楼层编号
                })
                 }else{
                     bubble = new AirocovMap.Controls.InfoWindow({
                    //信息窗内容，是一个dom
                    // content: carousel(),
                      content: content,
                      position: map.screenCoordinates(e.position),  //三维场景坐标的投影到屏幕的坐标
                      positionXYZ: e.position,  //三维场景坐标
                    // id: e.target.info.properties.userData.id,  //楼层的模型info.id或自定义id
                    floor: e.target.info.floor //楼层编号
                     })
                 }
                
                
               
                map.addControl(bubble)
                //实时对信息窗定位
                bubble.positioning()
                
            }
            function getTem(list){
                var temp='<div style="background-color: #ffffff;    width: 320px;text-align: center;margin-bottom: 5px;">'
                for(var i =0 ;i<list.length;i++){
                    temp+=  '<p style="text-align: left"><span style="font-weight:700;font-size: 16px;">'+list[i].personName+'</span></p>'+'<img src='+list[i].photos[0]+' alt="" style="height:180px;width:100%; margin-top: 5px;">'+
                '<p style="margin-bottom: 15px; margin-top: 5px;text-align: left;">'+list[i].description+'</p>'
                }
                return temp
            }
             //轮播图
            function carousel(list){

                var li='';
                var div='';
                var arrow=''
                if(list.length>1){
                   for(var i =0 ;i<list.length;i++){
                    li+='<li data-target="#carousel-example-generic" data-slide-to="'+i+(i==0?'" class="active"':'"')+'></li>'
                 }
                arrow= '<a class="left carousel-control" style="    height: 640px;" href="#carousel-example-generic" role="button" data-slide="prev">'+
    '<span class="glyphicon glyphicon-chevron-left" aria-hidden="true"></span>'+
    '<span class="sr-only">Previous</span>'+
 ' </a>'+
 ' <a class="right carousel-control" style=" height: 640px;"  href="#carousel-example-generic" role="button" data-slide="next">'+
    '<span class="glyphicon glyphicon-chevron-right" aria-hidden="true"></span>'+
    '<span class="sr-only">Next</span>'+
  '</a>'
                }else{
                    li='';
                    arrow=''
                }
                
                 for(var i =0 ;i<list.length;i++){
                    div+= '<div class="item'+(i==0?' active':' ')+'">'+
          ' <img src="'+list[i]+ '" alt="..." style="width:640px;height:640px">'+
            ' <div class="carousel-caption">'+
          ' </div></div>'
                }
                var temp='<div id="carousel-example-generic" class="carousel slide" data-ride="carousel"><ol class="carousel-indicators" style="bottom:10px">'
                    +li+ '</ol>'+'<div class="carousel-inner" role="listbox" style="width:640px;height:640px">'+div;
                    return(  temp+'</div></div>'+arrow+
'</div>')

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
                    dinatesArr.forEach((item) => {
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
        this.park = { parkNo: '', parkName: '' };
        //项目编号
        this.parkNo = '';
        this.mapData = [];
        //根据项目no获取json数据，这里做了一个判断，为了防止同一个项目切换页面时候的重复加载;

        this.getMapData = function (parkNo, parkName) {
            var deferred = $q.defer();
            that.mapData = that.mapData ? that.mapData : {};
            if (that.mapData.park_no != parkNo) {
                $http.get("/common/mapComponent/json/indoorMapData/mapDataFile.json").success(function (data) {
                    that.mapData = data[parkName];
                    deferred.resolve(that.mapData);
                })
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

        // 获取园区信息
        this.getPark = function (name) {
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
    app.controller('myworktaskCtrl', function ($scope, $rootScope, $http, indoorService, $filter, $uibModal, $interval) {
        document.title = "OVU-我的任务";
        $scope.mapData = {
            name: "cytdTask" + new Date().getTime(),
            timeStr: new Date().getTime()
        }
            $scope.search = {time:moment().format('YYYY-MM-DD')};
       
        //地图初始化
        indoorService.park = { parkNo: '', parkName: '' };
        indoorService.parkNo = '';


        function reloadMap() {
            //加载地图
            var parkNo = '';
            var parkName = '';
            // if (fac.hasSpecialPark($scope.search)) {
            //     parkNo = '04201110001CYTD';
            //     parkName = '创意天地';
            // } else {
            //     parkNo = '';
            //     parkName = '';
            // }
            parkName = $scope.search.parkName || '创意天地'
            parkNo = $scope.search.parkNo || '04201110001CYTD'

            indoorService.park = { parkNo: parkNo, parkName: parkName };
            //项目编号
            //$scope.parkNo=parkNo;
            indoorService.parkNo = parkNo;

            $scope.$broadcast("reloadMap"+window.location.hash);
        }
        reloadMap();
         $scope.search.parkNo=indoorService.parkNo;
        // 地图加载完成，开始打点
        $rootScope.$on('loadCompleteMap' + $scope.mapData.timeStr, (evt, map) => {
            $rootScope.mapObj = map;
         
            map && getTask();


        })
                                 function getCenterPoint(path) {
  //var path =e.;//Array<Point> 返回多边型的点数组
  //var ret=parseFloat(num1)+parseFloat(num2);
  var x = 0.0;
  var y = 0.0;
  for (var i = 0; i < path.length; i++) {
    x = x + parseFloat(path[i][0]);
    y = y + parseFloat(path[i][1]);
  }
  x = x / path.length;
  y = y / path.length;
  var arr=[x, y]
  return arr;
  
}
        function getTask(){
            $http.post("/ovu-pcos/pcos/oc/task/list",{parkNo:indoorService.parkNo}).success(function (resp) {
                if (resp.code == 0) {
                   $scope.taskList=resp.data
                $scope.taskList.length && $scope.selectTask($scope.taskList[0].taskType)
                 
                
                }
            })
        }
   
        $scope.selectTask=function(taskType,flag){
           if(flag){
              $scope.search.time=moment().format('YYYY-MM-DD')
           }
            $rootScope.mapObj.map.clearFloorLayer($scope.mapData.name)
              $(".airocovInfoWindow").remove();
              $rootScope.mapObj.map.moveTo({x:0, y:0, z:0})
             $scope.search.taskType=taskType;
             $scope.search.personId && delete $scope.search.personId
             
             if(taskType==1 || taskType==2){
                     //巡逻岗巡查
                     getXlg()
             }else if(taskType==3 || taskType==4){
                   //外围卫生巡查
                      getWW()
             }else{
                 getZX()

                    //秩序保洁巡查
             }
        }
         //获取路线
        function getWay(){
              $rootScope.mapObj.map.clearFloorLayer($scope.mapData.name)
              $(".airocovInfoWindow").remove();
            $http.post("/ovu-pcos/pcos/oc/patrol/personInsResult",$scope.search).success(function (resp) {
                if (resp.code == 0) {
                 var lngAdd = 0.00544400142515;
                  var latAdd = 0.00248701216297;
                  
                 resp.data.forEach(v=>{
                   var arr=[]
                    v.pointList && v.pointList.forEach(point=>{
                         // 30.470021,114.321951   //高德
                         // 30.47255136652455,114.31673405392799 星网 
                         //point.longitude=point.longitude-0+0.00248701216297
                         //point.latitude=point.latitude-0.00544400142515‬
                        if( point.longitude && point.latitude){
                         point.longitude=point.longitude-lngAdd;
                         point.latitude =point.latitude-0+latAdd;
                           arr.push([point.longitude,point.latitude])
                             $rootScope.mapObj.addImgMarker('otherGroup',[point.longitude,point.latitude], $rootScope.mapObj.map, $scope.mapData.name,point)
                        }
                 

                    })
       

                     $rootScope.mapObj.drawPeoplePath(arr, $rootScope.mapObj.map, $scope.mapData.name)
                 })
              
                
                }
            })
           
        }

        function getXlg(){
              $rootScope.mapObj.map.clearFloorLayer($scope.mapData.name)
              $(".airocovInfoWindow").remove();
            //获取人员列表
           $http.post("/ovu-pcos/pcos/oc/patrol/personList",$scope.search).success(function (resp) {
                if (resp.code == 0) {
                  $scope.leftPersonList=resp.data
                }
            })
          getWay()
          
           
        }
        function getWW(){
              $rootScope.mapObj.map.clearFloorLayer($scope.mapData.name)
              $(".airocovInfoWindow").remove();
            var datas = [];
            
            var selCameraInfo={}
             //获取外围视频巡查结果
             $http.post("/ovu-pcos/pcos/oc/cleaning/insResult",$scope.search).success(function (resp) {
                if (resp.code == 0) {
                 
                  var insResult=resp.data
                 $http.post('/ovu-pcos/pcos/equipment/cameraShootingRange/getCamera',{parkId:'af98a32c9b4d490297cadc2d85faf797',parkName:'创意天地'}).success(res=>{
               if (res.code == 0) {
                 
                  var getCameraList= res.data.filter(function(item){
                    if(item.latitude){

                      return item
                    }
                  
                   })
                  getCameraList.forEach(ca=>{
                      if(ca.longitude && ca.latitude){
                         $rootScope.mapObj.addImgMarker('camera',[ca.longitude, ca.latitude],$rootScope.mapObj.map, $scope.mapData.name,ca)
                      }
                  })
                  
                  
                }
                     getCameraList.forEach(ca=>{
                        let ranges11= [];
                       ca.cameraList.length && ca.cameraList.forEach(eqId=>{
                          //该视频巡查点有照射范围 画出照射范围
                            if(eqId.coordinates){
                                        let pointArr=JSON.parse(eqId.coordinates);
                                        let points=[]

                                        pointArr.forEach(p => {points.push([p.longitude,p.latitude])})
                                        ranges11.push({
                                            equipmentName: eqId.equipmentSimpleName,
                                            equipmentId: eqId.equipmentId,
                                            points:points,
                                            // insResultImages:eq.insResultImages,
                                            // hanleStatus:eq.hanleStatus
                                        })

                                       
                                    }
                       })
                       ranges11 && ranges11.forEach(range=>{
                        insResult && insResult.forEach(ins=>{
                           ins.equipmentList &&  ins.equipmentList.forEach(eq=>{
                             if(eq.equipmentId==range.equipmentId){
                                range.insResultImages=eq.insResultImages
                                range.hanleStatus=eq.hanleStatus

                             }
                           })
                        })
                       })
                       $rootScope.mapObj.addRangesMarker(ranges11,$rootScope.mapObj.map,'testlayer') 
                      })

                
                
                
                


            })
                
                }
            })
        }
        function getZX(){
              $rootScope.mapObj.map.clearFloorLayer($scope.mapData.name)
              $(".airocovInfoWindow").remove();
             //获取人员列表
           $http.post("/ovu-pcos/pcos/oc/order/personList",$scope.search).success(function (resp) {
                if (resp.code == 0) {
                  $scope.leftPersonList=resp.data
                  
                
                }
            })
           //查询区块
             $http.post("/ovu-pcos/pcos/oc/order/parkBlockList",$scope.search).success(function (resp) {
                if (resp.code == 0) {
                    var ranges=[]
             
                   resp.data.length && resp.data.forEach(v => {
                                    if(v.coordinates){
                                        let pointArr=JSON.parse(v.coordinates);
                                        let points=[]

                                        pointArr.forEach(p => {points.push([p.longitude,p.latitude])})
                                        ranges.push({
                                            blockId: v.blockId,
                                            hasReport:v.hasReport,
                                          personList:v.personList,
                                           
                                            blockColor:v.blockColor,
                                             points:points,
                                        })
                                             $rootScope.mapObj.addImgMarker_p('otherGroup',getCenterPoint(points),$rootScope.mapObj.map, $scope.mapData.name,v)

                                       
                                    }
                                   
                                      
                                })

                  $rootScope.mapObj.addRangesMarker(ranges,$rootScope.mapObj.map,'testlayer') 
                
                }
            })

        }
        $scope.checkPerson=function(id){
          
           if($scope.search.personId==id){
              delete $scope.search.personId
           }else{
             $scope.search.personId=id
           }
             if($scope.search.taskType==1 || $scope.search.taskType==2){
                     //巡逻岗巡查
                     getXlg()
             }else if($scope.search.taskType==3 || $scope.search.taskType==4){
                   //外围卫生巡查
                      getWW()
             }else{
                 getZX()

                    //秩序保洁巡查
             }
        }
      
       

        $scope.$on("$destroy", function () {
            $rootScope.mapObj.map = null;
            console.log("页面被销毁")
        })


    });
})();
