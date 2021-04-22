(function () {
  'use strict';
  var app = angular.module('angularApp');
  app.service('AppService', function ($http, fac) {
    var that = this;
    this.park = { parkNo: '', parkName: '' };
    //项目编号
    this.parkNo = '';
    this.isStop= true
    this.onlyIndoorMap = true;
  });
  app.controller('stopinformationCtrl', function ($scope, $window, $rootScope, $timeout, $http, $filter, $uibModal, fac, AppService) {
    document.title = 'OVU-违停信息';
    $scope.lists = [
      // {
      //   dataType: 'VehiclePicking',
      //   name: '1号工坊摄像头',$
      //   time: '2019-12-02 09:36:01',
      //   picA: 'http://imagetest.ovuems.com/986d9498-11be-11ea-bb50-04d4c491fc7f.jpg',
      //   picB: 'http://imagetest.ovuems.com/941f6858-11be-11ea-8b9e-04d4c491fc7f.jpg',
      //   id: 5
      // }
    ];
    $scope.dealCameras = [];
    $scope.cameras = [];
    $scope.search = {};
    $scope.mapData = {
      name: 'cytdRange' + new Date().getTime(),
      timeStr: new Date().getTime()
    };

    AppService.park = { parkNo: '', parkName: '' };
    AppService.parkNo = '';

    function reloadMap() {
      //加载地图
      var parkNo = '';
      var parkName = '';
      if (fac.hasSpecialPark($scope.search)) {
        parkNo = '04201110001CYTD';
        parkName = '创意天地';
      } else {
        parkNo = '';
        parkName = $scope.search.parkName;
      }
      AppService.isAddWay = false
      AppService.park = { parkNo: parkNo, parkName: parkName };
      //项目编号
      //$scope.parkNo=parkNo;
      AppService.parkNo = parkNo;
      $scope.$broadcast("reloadMap"+window.location.hash);
    }
    app.modulePromiss.then(function () {
      $rootScope.$watch('dept.id', function (deptId, oldValue) {
        if (deptId) {
          var parkDept = fac.getParkDept(null, deptId);
          if (parkDept) {
            $scope.search.parkId = parkDept.parkId;
            $scope.search.parkName = parkDept.parkName;
          } else {
            $scope.search.parkId = '';
            $scope.search.parkName = '';
          };
          reloadMap();
        }
      })
    });
    $rootScope.$on('stopLoadCompleteMap'+$scope.mapData.timeStr, (evt, map) => {
      $rootScope.mapObjStop = map;
      map && $scope.drawCamera();
    });
    
    $scope.datas = [];
    $scope.goMessage = function (item) {
      $rootScope.mapObjStop.addWindowInfo($scope.cameras[item.id],item.name,$rootScope.mapObjStop.map);
    };
    $scope.drawCamera = function () {  
      $http.get('/ovu-pcos/pcos/equipment/bigScreen/rtspCameraInfo/query',
        {
          params: {
            parkId: 'af98a32c9b4d490297cadc2d85faf797',
            pageSize: 1000,
            pageIndex: 0
          }
        }
      ).success(function (res) {
        const lngAdd = 0.00544400142515;
        const latAdd = 0.00248701216297;
        $scope.datas = res.data.data;
        $scope.ranges = [];
        $scope.datas.forEach(val => {
          val.id = val.id;
          val.longitude = parseFloat(val.longitude) - lngAdd;
          val.latitude = parseFloat(val.latitude) + latAdd;
          val.icon = '/common/mapComponent/img/camera.png';
          $scope.ranges.push({
            equipmentName: val.name,
            equipmentId: val.domain_id,
            bindCameraId: val.domain_id,
            bindCameraName: val.name,
            points: val.monitoring_range ? JSON.parse(val.monitoring_range) : [],
          });
          $rootScope.mapObjStop.addCameraMarker(val, $rootScope.mapObjStop.map).then(res => {
            $scope.cameras[val.id] = res;
          });
          $rootScope.mapObjStop.addRangesMarker($scope.ranges, $rootScope.mapObjStop.map);
        });
      });
    };

    const socket = new SockJS('/ovu-pcos/pcos/sayhello', null, { transports: 'websocket', timeout: 20000 });

    socket.onopen = function () {
      console.log('Info: connection opened.');
    };

    socket.onmessage = (event) => {
      let data = JSON.parse(event.data).data;
      if (data && data.dataType === 'VehiclePicking') {
        $scope.lists.unshift(data);
        if (!$scope.dealCameras.includes(data.id)) {
          $scope.datasRange = $scope.datas;
          let longAdh = 0;
          let latAdh = 0;
          $scope.datas.forEach((item, j) => {
            if (item.id == data.id) {
              let monitoringRange = JSON.parse(item.monitoring_range);
              monitoringRange.forEach((it, i) => {
                longAdh = longAdh + it[0];
                latAdh = latAdh + it[1];
              });
              let longitude = longAdh / monitoringRange.length;
              let latitude = latAdh / monitoringRange.length;
              let imgList = {
                longitude: longitude,
                latitude: latitude,
              }
              $rootScope.mapObjStop.addStopCar(imgList, $rootScope.mapObjStop.map);
              $scope.datasRange.splice(j, 1);
            }
          });
          $scope.ranges = [];
          $scope.datasRange.forEach(item => {
            $scope.ranges.push({
              equipmentName: item.name,
              equipmentId: item.domain_id,
              bindCameraId: item.domain_id,
              bindCameraName: item.name,
              points: item.monitoring_range ? JSON.parse(item.monitoring_range) : [],
            });
          });
          $rootScope.mapObjStop.addRangesMarker($scope.ranges, $rootScope.mapObjStop.map);
          // $rootScope.mapObjStop.addWindow($scope.cameras[data.id], '此处有违停', $rootScope.mapObjStop.map,data.id);
          $scope.dealCameras.push(data.id);
        }
      }
    };

    $scope.$on('cloneSocket', () => {
      socket.close();
    });
    socket.onclose = (event) => {
      console.log('Info: connection closed.');
    };


  });
})();
