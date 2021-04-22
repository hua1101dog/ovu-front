(function () {
    "use strict";
    var app = angular.module("angularApp");
    app.service('AppService', function ($http, fac) {
        var that = this;
        this.park = {  parkName: '' };
        //项目编号
        
       
        this.onlyIndoorMap = true;
    });
    app.controller('blockCtrl', function ($scope, $rootScope,AppService, $http, $filter, $uibModal, fac, $timeout,$compile) {
        document.title = "区块划分";
        $scope.pconfig = {showMap:false};
        $scope.pageModel = [];
        $scope.lastPageModel = {};
        $scope.lastNull = false;

      
        $scope.config = {
            edit: true
        }
        $scope.block_coupleData=[]
      
          $scope.locationUrl=window.location.hash
        $scope.pageModel = [];
        $scope.lastPageModel = {};
        $scope.lastNull = false;
        $scope.mapData={
            name:"cytdRange"+ (new Date()).valueOf(),
            timeStr:(new Date()).valueOf()
        }

        $scope.search = {};
          //地图初始化
          AppService.park = { parkName: '' };
          
        
          
          function reloadMap999() {
       
              $rootScope.$broadcast("hasChanged");
            //加载地图
         
          
       
            AppService.park = { parkName: $scope.search.parkName,parkId: $scope.search.parkId };
           

              
               $scope.hasPark=false
               $scope.hasPark=true
             if(!$rootScope.mapObj){
              //如果没有地图，则渲染地图
             
               $scope.$broadcast("reloadMap"+window.location.hash);
             }else{
              
                 //如果有地图，则清除地图上的图层 并发送请求，获取左侧树的数据和右侧的区块数据
                  if($rootScope.mapObj && $rootScope.mapObj.map){
               $rootScope.mapObj.map.clearFloorLayer($scope.mapData.name);
               $rootScope.mapObj=null
               $scope.$broadcast("reloadMap"+window.location.hash);
                }
           
                getCouple()
             }
            
        }
        function getCouple(){
            $http.post("/ovu-pcos/pcos/parkBlock/group/list",{deptId:$scope.search.deptId}).success(function (resp) {
                if (resp.code == 0) {
                  $scope.block_coupleData=resp.data
                  $scope.block_coupleData && $scope.block_coupleData.forEach((couple)=>{
                    couple.nodeName=couple.text=couple.groupName
                    couple.id=couple.groupId
                    couple.isLeaf=true
                  })
                  if($scope.block_coupleData.length){
                    $scope.block_coupleData[0].state={selected:true}
                    $scope.search.text=$scope.block_coupleData[0].text
                    $scope.search.groupId=$scope.block_coupleData[0].groupId
                    if( $rootScope.mapObj){
                        $scope.selectNode($scope.search,$scope.block_coupleData[0])
                    }
                  }
                 
                  
                }
            })
        }
              app.modulePromiss.then(function () {
              $rootScope.$watch('dept.id', function (deptId, oldValue) {
                  if (deptId) {
                        $scope.search.deptId=deptId
                        $scope.search.groupId && delete $scope.search.groupId
                      var parkDept = fac.getParkDept(null, deptId);
                      if($rootScope.mapObj && $rootScope.mapObj.map){
                        $rootScope.mapObj.map.clearFloorLayer($scope.mapData.name);
                        $rootScope.mapObj.map.clearLayer($scope.mapData.name);
                        $rootScope.mapObj=null
                      
                         }
                      if (parkDept) {
                          $scope.search.parkId = parkDept.parkId;
                          $scope.search.parkName = parkDept.parkName
                          reloadMap999()  
                          
                      }else{
                          alert('请选择项目关联的部门')
                          $scope.search.parkId="";
                          $scope.search.parkName=""
                         
                      }
                     
                      
                     
                   
                  }
              })
          });
          
          
            //新增分组
            $scope.editNode = $scope.addTopNode = function(node){
                if (node) {
                    node.copy = angular.extend({}, node);
                    node.state = node.state || {};
                    node.state.edit = true;
                    node.isLeaf=true
                   

                } else {
                    $scope.search.text='';
                    $scope.block_coupleData.push({
                        state: { edit: true },
                        copy:{
                            nodeName:$scope.search.text,
                            parkId:$scope.search.parkId,
                           
                        },
                        isLeaf: true
                    })
                }
        };
       
        //选中分组
        $scope.selectNode= function (search,node) {
            if(node.state.selected){
                $scope.curNode=node;
               
            }else{
                delete $scope.curNode;
            }

            $scope.hasChanged=!$scope.hasChanged
            
            $scope.find();
        };
        //删除分组
        $scope.delNode = function(node){
            confirm("确认删除该分组吗?", function () {
                $http.get("/ovu-pcos/pcos/parkBlock/group/delete/"+node.id,fac.postConfig).success(function (data) {
                    if (data.code == '0') {
                       
                        var list = fac.treeToFlat($scope.block_coupleData);
                        var parent = list.find(function (n) { return n.id == node.parentId });
                        if (parent) {
                            parent.nodes.splice(parent.nodes.indexOf(node), 1)
                        } else {
                            $scope.block_coupleData.splice($scope.block_coupleData.indexOf(node), 1)
                        }
                        msg(data.msg);

                         if($scope.block_coupleData.length){
                    $scope.block_coupleData[0].state={selected:true}
                    $scope.search.text=$scope.block_coupleData[0].text
                    $scope.search.groupId=$scope.block_coupleData[0].groupId
                    $scope.selectNode($scope.search,$scope.block_coupleData[0])
                  }else{
                    $scope.search.groupId && delete  $scope.search.groupId
                    $scope.find()
                  }
                   
                    } else {
                        alert(data.msg);
                    }
                })
            });
        };
        //撤销
        $scope.undo = function (node) {
            if (node.id) {
                node.state.edit = false;
            } else {
                var parent = getNodeById(node.parentId);
                if (parent) {
                    parent.nodes.splice(parent.nodes.indexOf(node), 1)
                } else {
                    $scope.block_coupleData.splice($scope.block_coupleData.indexOf(node), 1)
                }
            }
        }
        function getNodeById(did) {
            if (!did) {
                return false;
            }
            var list = getAllNodes($scope.block_coupleData);
            return list.find(function (n) {
                return n.id == did
            })
        }
        //保存分组
        $scope.save = function (node) {
            
            if (!node.copy.text) {
                alert('名称不能为空');
                return;
            }

            var filterData; //需要过滤的数据
             //第一级
             filterData = $scope.block_coupleData;
            var findData = filterData.find(function (n) {
                return (n.id != node.copy.id && n.text == node.copy.text)
            });
            if (findData) {
                alert('分类名称已存在');
                return;
            }


            var item = {};
            item.groupId = node.copy.id;
            item.groupName = node.copy.text;
            item.parkId = node.copy.parkId;
            item.deptId=$scope.search.deptId
            var url = "/ovu-pcos/pcos/parkBlock/group/edit";

            $http.post(url, item).success(function (resp) {
                if (resp.code == 0) {

                    msg(resp.msg);
                    node.id = resp.data.groupId;
                    node.text = resp.data.groupName;
                    node.createrId = resp.data.createrId;
                    node.domainId= resp.data.domainId;
                    node.parkId= resp.data.parkId || '';
                    node.state.edit = false;
                    
                  
                     if(!$scope.search.groupId){
                         var group=$scope.block_coupleData.filter(v=>{
                        return v.state.selected
                           })
                       if(group.length){
                         $scope.search.groupId=group[0].groupId
                       }
                    }
                     
                } else {
                    alert(resp.msg);
                }
            });

        }
        
          // 地图加载完成，开始打点
          $rootScope.$on('loadCompleteMap'+$scope.mapData.timeStr, (evt, map) => {
              $rootScope.mapObj = map;
              map && getCouple(true)
        
            
  
  
          })
          //绑定区块名称
          $rootScope.$on('bindName'+$scope.mapData.timeStr, (evt, pointInfo) => {
            openbindName(pointInfo)
          })       
         
          let openbindName = function (pointInfo) {
            pointInfo.parkId?pointInfo.parkId:(pointInfo.parkId=$scope.search.parkId)
            pointInfo.groupId?pointInfo.groupId:(pointInfo.groupId=$scope.search.groupId)
            pointInfo.deptId?pointInfo.deptId:(pointInfo.deptId=$scope.search.deptId)
            var modal = $uibModal.open({
                animation: true,
                size: '',
                templateUrl: 'setName.html',
                controller:'setNameCtrl',
                resolve: { data:pointInfo}
                
            });
            modal.result.then(function (data) {
                  $rootScope.mapObj.map.clearFloorLayer($scope.mapData.name);
                  $rootScope.mapObj.map.clearLayer($scope.mapData.name);
                $scope.find();
            }, function () {
                 $rootScope.mapObj.map.clearFloorLayer($scope.mapData.name);
                 $rootScope.mapObj.map.clearLayer($scope.mapData.name);
                 $scope.find();
                console.info('Modal dismissed at: ' + new Date());
            });
          }
     
  
          //列表查询
          $scope.find = function () {
              $rootScope.$broadcast("hasChanged");
              //项目判断
            //   if (!fac.hasSpecialPark($scope.search)) {
            //       return;
            //   }
              if($rootScope.mapObj && $rootScope.mapObj.map){
                 $rootScope.mapObj.map.clearFloorLayer($scope.mapData.name);
                 $rootScope.mapObj.map.clearLayer($scope.mapData.name);
              }
             $http.post("/ovu-pcos/pcos/parkBlock/list", $scope.search).success(function (resp) {
                  if (resp.code == 0) {
                      var ranges= [];
                      $scope.blockData = resp.data;
                      resp.data.forEach(function (v) {
                        if(JSON.parse(v.coordinates).length){
                            let pointArr=JSON.parse(v.coordinates);
                            let points=[]
                            pointArr.forEach(p => {points.push([p.longitude,p.latitude])})
                            ranges.push({
                                blockName: v.blockName,
                                points:points,
                                blockColor:v.blockColor,
                                groupId:v.groupId,
                                blockId:v.blockId,
                                parkId:v.parkId
                            })
                           
                        }
                      });
                      $rootScope.mapObj.addRangesMarker(ranges,$rootScope.mapObj.map)
                  }
              });
          };
  
         
          $scope.$on("$destroy", function () {
              $rootScope.mapObj.map=null;
              console.log("页面被销毁")
          })

    });
  


    app.component('mapBlockComponent', {
        templateUrl: '/common/mapComponent/component/schemeDetail.html',
        bindings: {
            mapData: '<',
            onBim: '&',
            groupId:'<',
           
          
        },
        controller: ['$scope', '$rootScope', '$timeout', '$http', 'AppService', 'indoorService_block', '$state','$compile', function ($scope, $rootScope, $timeout, $http, AppService, indoorService_block, $state,$compile) {
            var $ctrl = this;
            //组件挂载后发事件
            $ctrl.$postLink = function () {
                $scope.$emit("indoorMapEnd");
            }
           var index=0
           
           $ctrl.curMarkUrlList=[...Array(31).keys()] //调色板
   $ctrl.curMarkUrlList.shift()
  
            $ctrl.curMarkUrl=$ctrl.curMarkUrlList[index]
            $ctrl.curMarkColorList=['#FF5829','#FF7852','#FF9577','#F18F00','#FBA321',
            '#FFC062','#EB246D','#FF5593','#FF80AE','#9E13C8',
             '#C73CF1','#E386FF','#3540D6','#4F5AF3','#8089FF',
               '#0E57EB','#3477FF','#6F9EFF','#5B30B2','#7C50D5',
                 '#A47DF3','#29B5D7','#41C9EA','#6BE2FF','#378D7E',
                   '#3FBEA8','#2BECCA','#E9DA17','#FAEA20','#FFF78D'


            ] //调色板
         
            // 地图配置
            AirocovMap.Config.set({
                // 楼层间距200
                showAllFloor: false,
                count: 100,
                zoom: 2,
                // defaultFloor: "武汉创意天地",
                showViewMode: "MODE_2D",
                defaultGap: 18,//楼层间距
                showMenu: false ,//不显示楼层选择
                theta: 0,
                //2d模式下地图水平方向初始旋转角度,默认为20度
            });
            var parkName = AppService.park.parkName;//园区名称
            var parkId=AppService.park.parkId;//园区id
            var onlyIndoorMap = AppService.onlyIndoorMap; //是否只有园区地图
            var mapList = [];    //地图渲染数据
            var map;             //map
            var bubble;
            $ctrl.startRange = false;
            $ctrl.path=[]
            $ctrl.curMarkType = {
                name: "xian.png",
                url: "/res/img/xian.png"
            }
            $ctrl.curScheme = {
                markers: []
            }        //气泡弹框

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
                    var floor = indoorService_block.getFloorById(parkName, $ctrl.floorId);
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
                    },1);
                });
            };

            //单向绑定数据发生变化时
            $ctrl.$onChanges = function (changes) {
                //根据父数据渲染地图
                //console.log(changes.mapData.currentValue);
                //readerMap(changes.mapData.currentValue);
            };

             $rootScope.$on("hasChanged",function(){
              $ctrl.startRange=false
               
              if($ctrl.curMarker && $ctrl.curMarker.points.length){
               $ctrl.curMarker.points=[]
              }
             });

            //获取项目地图数据 parkName
            $timeout(function () {
                loadMap();
            });
            var loadNum=0
            function loadMap() {
                console.log('loading map...');
                //地图变量重新加载
                $ctrl.show2DMode = true;
                $ctrl.showParkMap = true;
                $ctrl.selectNo = 0;
                mapList = [];//地图数据
                parkName = AppService.park.parkName;//园区名称
                parkId=AppService.park.parkId
                 $ctrl.startRange=false
                 if($ctrl.curMarker && $ctrl.curMarker.points.length){
               $ctrl.curMarker.points=[]
                 }
                 
                 indoorService_block.getMapData( parkId,parkName).then(function (res) {
                    var mapData = res;

                    if (mapData.name) {

                        if($ctrl.mapData&&$ctrl.mapData.name){
                            mapData.name=$ctrl.mapData.name
                            mapData.timeStr=$ctrl.mapData.timeStr||''
                        }
                        mapList.push(mapData);
                    }

                    if (mapList.length == 0) {

                        map = null;
                        document.querySelector('#mapBox_block').innerHTML = '';  
                        var html=` <div style="position: absolute;transform: translate(-50%,0);left: 50%;" id="iconList" > <div ng-if="$ctrl.startRange" style="  text-align: center;
                        float: left;
                        width:  400px;
                        height: 36px;
                        cursor: pointer;">
                        <div class="pull-right" style="display: inline-block;line-height: 12px">
                          
                        <div ng-repeat="item in $ctrl.curMarkUrlList track by $index" style="display: inline-block">
                        <img class="colorTab"  style="max-width: 32px;
                        height: 10px;
                        margin-left: 5px;" ng-src="{{'/common/mapComponent/img/'+item+'.png'}}"  alt="" ng-click="$ctrl.chooseColor(item)">
                         </div>
                
                        </div>
                        <span>开始标注范围</span>
                         </div>
                         </div>
                         <div style="position: absolute;transform: translate(-50%,40px);left: 50%;">
                         <ul class="ul-block" ng-if="$ctrl.startRange">
                             <li ng-repeat="point in $ctrl.curMarker.points track by $index" role="button" class="btn btn-default"
                                 ng-class="{'btn-warning':$ctrl.curMarker.curPoint == point}"
                                 ng-click="$ctrl.selectPoint($ctrl.curMarker,point)">
                                 <span>
                                     <i class="glyphicon glyphicon-map-marker"></i>
                                     {{$index+1}}
                                 </span>
                                 <a ng-click="$ctrl.delPoint(point)"><i class="fa fa-remove"></i></a></li>
                         </ul>
                         
                     </div> `
                       
                       var compileFn = $compile(html);
                        var $dom = compileFn($scope);
                        $dom.appendTo($('#mapBox_block'));    
                        return;
                        
                       
                    }
                     
                    if (!map) {
                        // 初始化地图
                        loadNum=loadNum+1
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
                        
                        map=null
                        document.querySelector('#mapBox_block').innerHTML = '';  
                    
                        var html=` <div style="position: absolute;transform: translate(-50%,0);left: 50%;" id="iconList" > <div ng-if="$ctrl.startRange" style="  text-align: center;
                        float: left;
                        width:  400px;
                        height: 36px;
                        cursor: pointer;">
                        <div class="pull-right" style="display: inline-block;line-height: 12px">
                          
                        <div ng-repeat="item in $ctrl.curMarkUrlList track by $index" style="display: inline-block">
                        <img class="colorTab"  style="max-width: 32px;
                        height: 10px;
                        margin-left: 5px;" ng-src="{{'/common/mapComponent/img/'+item+'.png'}}"  alt="" ng-click="$ctrl.chooseColor(item)">
                         </div>
                
                        </div>
                        <span>开始标注范围</span>
                         </div>
                         </div>
                         <div style="position: absolute;transform: translate(-50%,40px);left: 50%;">
                         <ul class="ul-block" ng-if="$ctrl.startRange">
                             <li ng-repeat="point in $ctrl.curMarker.points track by $index" role="button" class="btn btn-default"
                                 ng-class="{'btn-warning':$ctrl.curMarker.curPoint == point}"
                                 ng-click="$ctrl.selectPoint($ctrl.curMarker,point)">
                                 <span>
                                     <i class="glyphicon glyphicon-map-marker"></i>
                                     {{$index+1}}
                                 </span>
                                 <a ng-click="$ctrl.delPoint(point)"><i class="fa fa-remove"></i></a></li>
                         </ul>
                         
                     </div> `
                       
                       var compileFn = $compile(html);
                        var $dom = compileFn($scope);
                        $dom.appendTo($('#mapBox_block'));
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
                    }
                    

                    // 地图点击事件
                    map.event.on("click", function (e) { //注册点击事件
                        
                         if(!$ctrl.groupId){
                             alert('请选择分组')
                             return
                         }
                        if ($ctrl.startRange && $ctrl.curMarker) {
                            if ($ctrl.curMarker.curPoint) {
                                angular.extend($ctrl.curMarker.curPoint, [e.position.x, e.position.z]);
                            } else {
                               $ctrl.curMarker.points.push([e.position.x, e.position.z]);
                            }
                            addMarker($ctrl.curMarker, () => {
                                $scope.$applyAsync();
                            })


                        } else if (!$ctrl.startRange && e.type == "fence") {
                           
                            $rootScope.$emit("bindName"+mapList[0].timeStr, e.target.info.properties.userData);                           

                        } else { //点击到地图上，但没有点中元素
                            if($ctrl.curMarker && $ctrl.curMarker.points.length){
                                $ctrl.curMarker.points=[]
                                
                            }
                            $ctrl.addLightRange() 
                           
                        }
                      
                    });

                    map.event.on("loaded", function () {
                        
                        var mapObj = {
                            map: map,
                            addRangesMarker:addRangesMarker,

                        }
                        $rootScope.$emit("loadCompleteMap"+mapList[0].timeStr, mapObj);
                        console.log("地图渲染完成" + new Date().toLocaleString());
                    });
                    map.event.on("loadComplete", function (e) {
                        //console.log("地图加载完成"+new Date().toLocaleString());
                    });
                })
               
            }

             //选择颜色
             $ctrl.chooseColor=function(item){
                $ctrl.curMarkUrl=item
                index=$ctrl.curMarkUrlList.indexOf(item)
             }
           
           
            function addMarker(marker, fn) {
               //若marker 已有描点，清除此描点
               marker.objId && map.clearLayer(mapList[0].name, marker.objId);
               if(marker.points.length==0){
                   return
               }
               let PolyLine = new AirocovMap.Markers.PolyLine();
               let points = marker.points;
               let len = points.length - 1

               if (!$ctrl.curMarker.curPoint && points.length > 3) {
                   let xdis = Math.abs(points[len][0] - points[0][0])
                   let zdis = Math.abs(points[len][1] - points[0][1])
                   if (xdis <= 3 && zdis <= 3) {
                       points[len][0] = points[0][0]
                       points[len][1] = points[0][1]
                       $ctrl.startRange = false
                       drawFence($ctrl.curMarker,$ctrl.curMarker.objId);
                       $rootScope.$emit("bindName"+mapList[0].timeStr, $ctrl.curMarker);
                       fn && fn();
                       return
                   }
               }
               if (points.length == 1) {
                   points = points.concat(points);

               }

               let arr = [];
               points.forEach(v => {
                   arr.push([v[0] * .02, v[1] * .02])
               });
                //创建路径
                let config = {
                 //线段的高度
                 height: 70,
                 //路径的宽度
                 radius: 0.02,
                 //自定义贴图
                 imgUrl: '/common/mapComponent/img/'+$ctrl.curMarkUrl+'.png',
                 //运动速度
                 speed: 1,
                 //单节长度
                 sinLength: 0.2,
                 lineType: 'straight'
                }
               //创建路径
               let path = PolyLine.drawPath(arr, config)
               path.scale.x = 50;
               path.scale.z = 50;
               marker.objId = path.id;
               //添加到对应楼层中图层 // marker.objId
               map.addToLayer(path, mapList[0].name, marker.objId, true)

               //每个转角添加了一个数字标注
               if ($ctrl.startRange) {
                   $ctrl.curMarker && $ctrl.curMarker.points.forEach((point, i) => addTextMark(map, $ctrl.curMarker.objId, { x: point[0], y: 101, z: point[1] }, i + 1))
               }

               fn && fn();
            }
           
            //创建围栏
            function drawFence(curMarker,name) {
                
                let polyline = new AirocovMap.Markers.PolyLine();
                //围栏的配置
                var config = {

                    height: 70, //围栏高度
                    color: curMarker.blockColor || $ctrl.curMarkColorList[index], //围栏平面颜色
                    opacity: 0.5, //围栏平面透明度
                    lineColor: curMarker.blockColor || $ctrl.curMarkColorList[index], //围栏线的颜色
                }
                //创建围栏，传入围栏坐标及配置，返回围栏对象
                var fence = polyline.drawWordsFence(curMarker.points, config)
                curMarker.id=Math.floor(Math.random() * 10000)
                curMarker.color=curMarker.blockColor || $ctrl.curMarkColorList[index]
                fence.info.properties.userData =curMarker;
                //添加到对应楼层中图层
                map.addToLayer(fence, mapList[0].name, name, true);

            }
         
            function addRangesMarker(ranges,map){
                map.clearLayer(mapList[0].name, "fenceGroup");
                if( $ctrl.curMarker&&$ctrl.curMarker.objId ){
                    map.clearLayer(mapList[0].name,$ctrl.curMarker.objId,true);                   
                }
                
                ranges.forEach(po=> {drawFence(po,"fenceGroup")})
             
            }
           
            function addTextMark(map, layerName, position, text) {
                //生成文字标注
                let textMark = new AirocovMap.Markers.TextMarker({
                    text: text,  //标注内容
                    zoom: 0.8, //文字大小缩放系数
                    color: "purple", //文字颜色
                    position: position, //三维坐标系位置
                    userData: {
                    },
                    callback: function (textMark) {
                        //将文字标注添加到指定楼层的指定图层中
                        map.addToLayer(textMark, mapList[0].name, layerName, true);
                    }
                });
            }
            $ctrl.addLightRange = function () {
                if(!$ctrl.startRange){
                    $scope.$apply(function () {
                      
                        $ctrl.startRange = true
                     
                    });
                }
                
               
                var markType = {
                    icons: [{
                        name: "xian.png",
                        url: "/res/img/xian.png"
                    }],
                    open: true,
                    title: "划线",
                    type: "path"
                }

                let marker = {
                    name: '测试',
                    type: markType.type,
                    points: [],
                    imgMarker: $ctrl.curMarkType.url,
                  
                };
                //$ctrl.curScheme.markers.push(marker);
                $ctrl.curMarker = marker;
                return;
            }
            $ctrl.selectPoint = function (marker, point) {
                if (marker.curPoint == point) {
                    delete marker.curPoint;
                } else {
                    marker.curPoint = point
                }
            }
            $ctrl.delPoint = function (point) {
                event.stopPropagation();
                    if($ctrl.curMarker.curPoint == point){
                        delete $ctrl.curMarker.curPoint;
                    }
                    $ctrl.curMarker.points.splice($ctrl.curMarker.points.indexOf(point),1)
                    addMarker($ctrl.curMarker)
            }
           


            
        }]
    });


    app.service('indoorService_block', function ($q, $http) {
        var that = this;
      
        //根据项目no获取json数据，这里做了一个判断，为了防止同一个项目切换页面时候的重复加载;
        this.getMapData = function (parkId,parkName) {
            var deferred = $q.defer();
            that.mapData = that.mapData ? that.mapData : {};
           
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
        this.getPark = function (name, onlyIndoorMap) {
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
  
    app.controller('setNameCtrl', function ($scope, $rootScope, $http, $uibModalInstance, $filter, fac, data) {

       $scope.item=data
        var points=data.points
        //删除区块
        $scope.delete = function () {
            if($scope.item.id){
                $http.get("/ovu-pcos/pcos/parkBlock/delete/" + $scope.item.blockId, fac.postConfig).success(function (resp) {
                    if (resp.code == 0) {
                         msg(resp.msg);
                        $uibModalInstance.close();
                    }else{
                        alert(resp.msg)
                    }
                });
            }
        }
        
   
        $scope.save = function (form) {
            form.$setSubmitted(true);
            if (!form.$valid) {
                return;
            }
            let coordinates=[]
            points.forEach(v => {coordinates.push({longitude:v[0],latitude:v[1] })});
            $scope.item.coordinates=JSON.stringify(coordinates)
            $scope.item.blockColor=$scope.item.color
            var params={
                blockName:$scope.item.blockName,
                coordinates:$scope.item.coordinates,
                deptId:$scope.item.deptId,
                parkId:$scope.item.parkId,
                blockId:$scope.item.blockId,
                blockColor:$scope.item.blockColor,
                groupId:$scope.item.groupId
             }
            $http.post("/ovu-pcos/pcos/parkBlock/edit",params).success(function (resp) {
                if (resp.code == 0) {
                    msg(resp.msg);
                    $uibModalInstance.close($scope.item);
                }else{
                    alert(resp.msg)
                }
            });

            
        }
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        }
    });

})();
