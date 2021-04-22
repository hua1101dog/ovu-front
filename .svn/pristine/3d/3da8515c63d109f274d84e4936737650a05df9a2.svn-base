/**
 * 自定义 angular组件
 */
(function () {
  'use strict';

  var app = angular.module("angularApp");
  app.component('ruleMapComponent', {
    templateUrl: '/common/mapComponent/component/mapContainer.html',
    bindings: {
      mapData: '<',
      onBim: '&',
      isAddWay: '<'
    },
    controller: ['$scope', '$rootScope', '$timeout', '$http', 'AppService', 'indoorServiceRule', '$state', 'fac', function ($scope, $rootScope, $timeout, $http, AppService, indoorServiceRule, $state, fac) {
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
      var parkNo = AppService.parkNo; //园区编号
      var onlyIndoorMap = AppService.onlyIndoorMap; //是否只有园区地图
      var mapList = [];    //地图渲染数据
      var map;             //map
      var bubble;
      var bubble2;
      var clickNum = 0;
      $ctrl.startRange = false;
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
          var floor = indoorServiceRule.getFloorById(parkName, $ctrl.floorId);
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
        mapList = [
        ];//地图数据
        parkName = AppService.park.parkName;//园区名称
        parkNo = AppService.parkNo; //园区编号
        console.log(parkName + '&' + parkNo);

        indoorServiceRule.getMapData(parkNo, parkName).then(function () {
          var mapData = indoorServiceRule.getPark(parkName);
          if (mapData.name) {
            if ($ctrl.mapData && $ctrl.mapData.name) {
              mapData.name = $ctrl.mapData.name
              mapData.timeStr = $ctrl.mapData.timeStr || ''
            }
            mapList.push(mapData);
          }
          if (mapList.length == 0) {
            map = null;
            if ($ctrl.isAddWay) {
              document.querySelector('.x_panel #mapBox').innerHTML = '';
            } else {
              document.querySelector('#mapBox').innerHTML = '';
            }

            return;
          }

          if (!map) {
            // 初始化地图
            map = new AirocovMap.Map({
              container: $ctrl.isAddWay ? document.querySelector('.x_panel #mapBox') : document.querySelector('#mapBox'),
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
            $rootScope.$emit("getCamera", e.target.info.properties.userData, e.position);
            e.target.material.map = new map.THREE.TextureLoader().load('/res/img/singleCamer.png');
            console.log(e.target.info.properties.uuid + "/" + e.lnglat);
            if (e.type == "marker") { //判断点击marker
              var value = e.target.info.properties.userData.value;
              var field = e.target.info.properties.userData.field;
              bubble && bubble.close();
              bubble = new AirocovMap.Controls.InfoWindow({
                content: `<div class='col-sm-12 panel panel-default' style='max-width:300px;padding:0;margin-bottom:0;'>${value.content}</div>`,
                id: e.target.info.properties.userData.id, //传入返回的设备ID
                floor: e.target.info.floor
              });
              map.addControl(bubble);
              bubble.positioning();
              if (!$ctrl.isAddWay) {
                console.log(value);
                $scope.cameraRangeInformation = value;
                if (value.content) {
                  $ctrl.addLightRange(e.target.info.properties.userData.value)
                } else {
                  alert("无摄像头")
                }
              }
            }
            else if ($ctrl.startRange && $ctrl.curMarker) {
              if ($ctrl.curMarker.curPoint) {
                angular.extend($ctrl.curMarker.curPoint, [e.position.x, e.position.z]);
              } else {
                $ctrl.curMarker.points.push([e.position.x, e.position.z]);
              }
              addMarker($ctrl.curMarker, () => {
                $scope.$applyAsync();
              })
            } else if (!$ctrl.startRange && e.type == "fence") {
              var title = ""
              if ($ctrl.isAddWay) {//选择巡查点
                $rootScope.$emit("addCameraWay" + mapList[0].timeStr, e.target.info.properties.userData, e.position);
                title = e.target.info.properties.userData.equipmentName + "-" + e.target.info.properties.userData.bindCameraName;
                addBubble2(title, e.position)
              } else {
                $rootScope.$emit("bindCamera" + mapList[0].timeStr, e.target.info.properties.userData);
                //addBubble2(title,e.position)
              }
            } else { //点击到地图上，但没有点中元素
              console.log(e.lnglat); //返回地图信息，包含点击坐标
            }
          });
          map.event.on("loaded", function () {
            //清除气泡
            bubble && bubble.close();
            var mapObj = {
              map: map,
              addCameraMarker: addCameraMarker,
              addRangesMarker: addRangesMarker,
              addWayLine: addWayLine,
              addStopCar: addStopCar,
              addBubble2: addBubble2,
              addWindowInfo:addWindowInfo,
            }
            $rootScope.$emit("loadCompleteMap"+mapList[0].timeStr, mapObj);
            console.log("地图渲染完成" + new Date().toLocaleString());
          });
          map.event.on("loadComplete", function (e) {
            //console.log("地图加载完成"+new Date().toLocaleString());
          });
        })
      };
      $scope.$on("showCamera", function (event, obj, drawPath) {

      });
      function addBubble2(title, position) {
        bubble2 && bubble2.close();
        bubble2 = new AirocovMap.Controls.InfoWindow({
          content: `<div class='col-sm-12 panel panel-default' style='max-width:400px;padding:0;margin-bottom:0;'>${title}</div>`,
          // id: e.target.info.properties.userData.id, //传入返回的设备ID
          // floor: e.target.info.floor,
          position: map.screenCoordinates(position),  //三维场景坐标的投影到屏幕的坐标
          positionXYZ: position  //三维场景坐标
        });
        map.addControl(bubble2);
        bubble2.positioning();
      }
      function addMarker(marker, fn) {
        //若marker 已有描点，清除此描点
        marker.objId && map.clearLayer(mapList[0].name, marker.objId);
        if (marker.points.length == 0) {
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
            drawFence($ctrl.curMarker, $ctrl.curMarker.objId);
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
          imgUrl: marker.imgMarker,
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
          $ctrl.curMarker && $ctrl.curMarker.points.forEach((point, index) => addTextMark(map, $ctrl.curMarker.objId, { x: point[0], y: 101, z: point[1] }, index + 1))
        }
        fn && fn();
      }
      function addWayLine(marker) {
        //若marker 已有描点，清除此描点
        map.clearLayer(mapList[0].name, "lineG");
        let points = marker;
        if (points.length <= 1) {
          return
        }
        let PolyLine = new AirocovMap.Markers.PolyLine();
        let arr = [];
        points.forEach(v => {
          arr.push([v[0] * .02, v[1] * .02])
        });
        //创建路径
        let config = {
          //线段的高度
          height: 80,
          //路径的宽度
          radius: 0.05,
          //自定义贴图
          imgUrl: "/res/img/arrow.png",
          //运动速度
          speed: 1,
          //单节长度
          sinLength: 1,
          lineType: 'straight'
        }
        //创建路径
        let path = PolyLine.drawPath(arr, config)
        path.scale.x = 50;
        path.scale.z = 50;
        map.addToLayer(path, mapList[0].name, "lineG", true)
      };
      //创建围栏
      function drawFence(curMarker, name,state) {
        if(curMarker.points.length == 0) return;
        let polyline = new AirocovMap.Markers.PolyLine();
        //围栏的配置
        var config = {
          height: 70, //围栏高度
          color: curMarker.isSel ? "#FF0000" : "#ffff00", //围栏平面颜色
          opacity: curMarker.isSel ? 0.5 : 0.2, //围栏平面透明度
          lineColor: curMarker.isSel ? "#009900" : "#ff0000", //围栏线的颜色
        }
        //创建围栏，传入围栏坐标及配置，返回围栏对象
        var fence = polyline.drawWordsFence(curMarker.points, config)
        fence.info.properties.userData = {
          equipmentId: curMarker.equipmentId,
          equipmentName: curMarker.equipmentName,
          bindCameraId: curMarker.bindCameraId,
          bindCameraName: curMarker.bindCameraName,
          // bindEquipmentName:curMarker.bindEquipmentName||"",
          id: Math.floor(Math.random() * 10000),
          points: curMarker.points,
        };
        addCameraRange(curMarker.points,state);
        //添加到对应楼层中图层
        map.addToLayer(fence, mapList[0].name, name, true);
      };
      function addCameraRange(monitoringRange,state) {
        if ($scope.cameraRangeInformation == undefined) return;
        let param = {
          id: $scope.cameraRangeInformation.id,
          name: $scope.cameraRangeInformation.name,
          rtsp: $scope.cameraRangeInformation.rtsp,
          in_out_door: $scope.cameraRangeInformation.in_out_door,
          latitude: parseFloat($scope.cameraRangeInformation.latitude) - 0.00248701216297,
          longitude: parseFloat($scope.cameraRangeInformation.longitude) + 0.00544400142515,
          frame: $scope.cameraRangeInformation.frame,
          park_id: $scope.cameraRangeInformation.park_id,
          domain_id: $scope.cameraRangeInformation.domain_id,
          imgUrl: $scope.cameraRangeInformation.imgUrl,
          monitoring_range: JSON.stringify(monitoringRange),
          code: $scope.code
        }
        $http.post(`/ovu-pcos/pcos/equipment/bigScreen/rtspCameraInfo/save`, angular.extend(param), fac.postConfig).success(function (resp) {
          if(state){
            if (resp.data !== undefined) {
              msg(resp.data + "!");
            } else {
              layer.msg(resp.msg, {//失败
                time: 2000,
                icon: 5
              });
            }
          }
          $rootScope.$broadcast('renovate', resp.data); //广告位
        });
      };   
      function addCameraMarker(data, map) {
        //清除气泡
        //bubble && bubble.close();
        var arrowPoints = [];
        var _y = $ctrl.showParkMap ? 100 : 1;
        map.clearLayer(mapList[0].name, "otherGroup");
        // map.clearFloorLayer(currPoint, false);
        Array.isArray(data) && data.forEach(function (value) {
          return new Promise(resolve => {
          new AirocovMap.Markers.ImageMarker({
            imgMarker: value.icon, //图片路径
            size: 2,
            // lnglat: [v.lon, v.lat], //经纬度坐标
            lnglat: [value.longitude, value.latitude], //经纬度坐标
            y: _y, //三维坐标系坐标y值
            mapCenter: map.getMapCenter(mapList[0].name), //地图中心点,
            userData: {
              id: value.id || Math.floor(Math.random() * 10000),
              value: value,
              field: value.field,
            },
            callback: function (imgMark) {
              //将图片标注添加到地图
              resolve(imgMark.position);
              map.addToLayer(imgMark, mapList[0].name, "otherGroup", true);
            }
          })
          arrowPoints.push([value.longitude, value.latitude])
          });
        });
        // fn && fn(arrowPoints);
      };
      function addRangesMarker(ranges, map,state) {
        if (ranges.length > 0) {
          map.clearLayer(mapList[0].name, "fenceGroup");
          if ($ctrl.curMarker && $ctrl.curMarker.objId) {
            map.clearLayer(mapList[0].name, $ctrl.curMarker.objId, true);
          }
          ranges.forEach(po => { drawFence(po, "fenceGroup"),state })
          // if(selCameraInfo&&selCameraInfo.position){
          //     addBubble2(selCameraInfo.title,selCameraInfo.position)
          // }
        }
      }
      function addStopCar(value, map) {
        const lngAdd = 0.00544400142515;
        const latAdd = 0.00248701216297;
        map.addJSONModel({
          //模型路径
          src: '/common/mapComponent/json/indoorMapData/car.js',
          //模型缩放大小
          size: 8,
          //模型位置
          position: [parseFloat(value.longitude) - lngAdd, 200, parseFloat(value.latitude) + latAdd],
          //模型加载完成的回调函数
          callback: function (model) {
            map.addToLayer(model, mapList[0].name, "modelLayer")
          }
        });
      };
      function addWindowInfo(position, text, map) {
        const infowindow = new AirocovMap.Controls.InfoWindow({
          content: `<div style="background-color: #ffffff;position:relative">
                    ${text}
                  </div>`,
          id: position,  //楼层的模型info.id或自定义id
          floor: 1 //楼层编号
        });
        map.addControl(infowindow);
        infowindow.positioning();
      }
      function subPlus1(name) {
        let matches = (name + "").match(/\d+$/);
        if (matches) {
          return name.substr(0, matches.index) + (parseInt(matches[0]) + 1);
        }
        return name + 1;
      }
      function addTextMark(map, layerName, position, text) {
        //生成文字标注
        let textMark = new AirocovMap.Markers.TextMarker({
          text: text,  //标注内容
          zoom: 1, //文字大小缩放系数
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
      $ctrl.addLightRange = function (equipment) {
        if (!$ctrl.startRange) {
          $scope.$apply(function () {
            $ctrl.startRange = true
            $rootScope.$emit("changeMarker" + mapList[0].timeStr, equipment.equipmentId);
          });
        } else {
          if ($ctrl.curMarker && $ctrl.curMarker.equipmentId && $ctrl.curMarker.equipmentId == equipment.equipmentId) {//选中同一个
            $scope.$apply(function () {
              $ctrl.startRange = false;
              bubble && bubble.close()
              $rootScope.$emit("changeMarker" + mapList[0].timeStr, "");
            });
          } else {
            $rootScope.$emit("changeMarker" + mapList[0].timeStr, equipment.equipmentId);
          }
        }
        if ($ctrl.curMarker && $ctrl.curMarker.objId) {
          map.clearLayer(mapList[0].name, $ctrl.curMarker.objId, true);
          $scope.$apply(function () {
            $ctrl.curMarker = {}
          });
        }
        if (!$ctrl.startRange) {
          return
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
          equipmentId: equipment.equipmentId,
          equipmentName: equipment.content,
          bindCameraId: "",
          bindCameraName: "",
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
        if ($ctrl.curMarker.curPoint == point) {
          delete $ctrl.curMarker.curPoint;
        }
        $ctrl.curMarker.points.splice($ctrl.curMarker.points.indexOf(point), 1)
        addMarker($ctrl.curMarker)
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
    }]
  });


  app.service('indoorServiceRule', function ($q, $http) {
    var that = this;
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
})();
