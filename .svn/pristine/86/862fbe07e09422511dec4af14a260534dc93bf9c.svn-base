/**
 * 自定义 angular组件
 */
(function () {
  'use strict';
  var app = angular.module("angularApp");
  app.component('mapParkStopComponent', {
    templateUrl: '/common/mapComponent/component/mapStopContainer.html',
    bindings: {
      mapData: '<',
      onBim: '&',
      isStop: '<'
    },
    controller: ['$scope', '$rootScope', '$timeout', '$http', 'AppService', 'indoorServiceStop', '$state', function ($scope, $rootScope, $timeout, $http, AppService, indoorServiceStop, $state) {
      var $ctrl = this;
      var timestamp = Date.parse(new Date());
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
          var floor = indoorServiceStop.getFloorById(parkName, $ctrl.floorId);
          var state = {
            floorName: floor.name,
            name: item.name,
            id: parseInt(item.name.substring(1))
          };
          $scope.$emit('toGround'+timestamp, state);
        };

        //重新加载地图
        $scope.$on("reloadMap"+timestamp, function () {
          $timeout(function () {
            loadStopMap();
          });
        });
      };
      //创建围栏
      function drawFenceMap(curMarker, name) {
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
        //添加到对应楼层中图层
        map.addToLayer(fence, mapList[0].name, name, true);
      };
      //单向绑定数据发生变化时
      $ctrl.$onChanges = function (changes) {
        //根据父数据渲染地图
        //console.log(changes.mapData.currentValue);
        //readerMap(changes.mapData.currentValue);
      };

      //获取项目地图数据 parkName
      $timeout(function () {
        loadStopMap();
      });
      function loadStopMap() {
        console.log('loading map...');
        //地图变量重新加载
        $ctrl.show2DMode = true;
        $ctrl.showParkMap = true;
        $ctrl.selectNo = 0;
        mapList = [];//地图数据
        parkName = AppService.park.parkName;//园区名称
        parkNo = AppService.parkNo; //园区编号
        console.log(parkName + '&' + parkNo);
        indoorServiceStop.getMapData(parkNo, parkName).then(function () {
          var mapData = indoorServiceStop.getPark(parkName);
          if (mapData.name) {
            if ($ctrl.mapData && $ctrl.mapData.name) {
              mapData.name = $ctrl.mapData.name
              mapData.timeStr = $ctrl.mapData.timeStr || ''
            }
            mapList.push(mapData);
          }
          if (mapList.length == 0) {
            map = null;
            return;
          }
          if (!map) {
            // 初始化地图
            map = new AirocovMap.Map({
              container:document.querySelector('#mapStopBox'),
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
          };
          function addRangesMarker(ranges, map) {
            if (ranges.length>0) {
              map.clearLayer(mapList[0].name, "fenceGroup");
              if ($ctrl.curMarker && $ctrl.curMarker.objId) {
                map.clearLayer(mapList[0].name, $ctrl.curMarker.objId, true);
              }
                ranges.forEach(po => { 
                  if(po.points.length>0){
                     drawFenceMap(po, "fenceGroup") 
                  }
                  })
            }
          };
          function addCameraMarker(value, map) {
            var _y = $ctrl.showParkMap ? 100 : 1;
            map.clearLayer(mapList[0].name, "otherGroup");
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
                  resolve(imgMark.position);
                  map.addToLayer(imgMark, mapList[0].name, "otherGroup", true);
                }
              });
            })
          };
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
          map.event.on("loaded", function () {
            //清除气泡
            bubble && bubble.close();
            var mapObj = {
              map: map,
              addCameraMarker: addCameraMarker,
              addRangesMarker: addRangesMarker,
              addStopCar: addStopCar,
              addWindowInfo:addWindowInfo,
              addWindow: addWindow,
            }
            $rootScope.$emit("stopLoadCompleteMap"+mapList[0].timeStr, mapObj);
            console.log("地图渲染完成" + new Date().toLocaleString());
          });
          map.event.on("loadComplete"+mapList[0].timeStr, function (e) {
            console.log("地图加载完成"+new Date().toLocaleString());
          });

        })
      }
      // $scope.$on("showCamera"+mapList[0].timeStr, function (event, obj, drawPath) {
      // });  
      function addWindow(position, text, map) {
        const infowindow = new AirocovMap.Controls.InfoWindow({
          content: `<div style="background-color: #ffffff;position:relative">
                    ${text}
                  </div>`,
          position: map.screenCoordinates(position),
          positionXYZ: position
        });
        map.addControl(infowindow);
        infowindow.positioning();
      };
      function addWindowInfo(position, text, map) {
        const infowindow = new AirocovMap.Controls.InfoWindow({
          content: `<div style="background-color: #ffffff;position:relative">
                    ${text}
                  </div>`,
          position: map.screenCoordinates(position),
          positionXYZ: position
        });
        map.addControl(infowindow);
        infowindow.positioning();
      }
    }]
  });


  app.service('indoorServiceStop', function ($q, $http) {
    var that = this;
    this.mapData = [];
    //根据项目no获取json数据，这里做了一个判断，为了防止同一个项目切换页面时候的重复加载;

    this.getMapData = function (parkNo, parkName) {
      var deferred = $q.defer();
      that.mapData = that.mapData ? that.mapData : {};
      if (that.mapData.park_no !== parkNo) {
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
