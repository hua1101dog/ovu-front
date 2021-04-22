(function () {
  'use strict';
  var app = angular.module('angularApp');
  app.service('AppService', function ($http, fac) {
    var that = this;
    this.park = { parkNo: '', parkName: '' };
    //项目编号
    this.parkNo = '';
    this.isAddWay=false
    this.onlyIndoorMap = true;
  });
  app.controller('stopInforCtl', function ($scope, $rootScope, $timeout, $http, $filter, $uibModal, fac, AppService) {
    document.title = 'OVU-巡查路线信息';
    AppService.park = { parkNo: '', parkName: '' };
    AppService.parkNo = '';

    $scope.dealCameras = [];
    $scope.cameras = [];
    $scope.showEditModal = false;
    // 1: 修改 2： 添加
    $scope.uploadMethod = 1;
    $scope.search = {};
    $scope.routes = [];
    $scope.form = {};
    $scope.selectedCameras = [];
    // 选择的摄像头
    // for (let i = 1; i < 10; i++) {
    //   $scope.selectedCameras.push({ name: `摄像头${i}` });
    // }

    for (let i = 1; i < 10; i++) {
      $scope.routes.push({ name: `路线${i}` });
    }

    $scope.mapData={
      name: 'cytdRange' + new Date().getTime(),
      timeStr: new Date().getTime()
    };

    $scope.addRoute = function() {
      $scope.form = {
        name: ''
      };
      $scope.showEditModal = true;
    };

    $scope.close = function() {
      $scope.showEditModal = false;
    };

    $scope.deleteRoute = function(data) {

    };
    $scope.deleteCamera = function(e, index) {
      e.preventDefault();
      $scope.selectedCameras.splice(index, 1);
    };

    $scope.editRoute = function(data) {
      $scope.showEditModal = true;
      $scope.form = {
        name: data.name
      };
    };

    $rootScope.$on('getCamera', (evt, pointInfo, position) => {
      if ($scope.showEditModal) {
        $scope.selectedCameras.push(pointInfo.value);
        $scope.$apply();
      }
    });

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
          }
          reloadMap();
        }
      })
    });

    $rootScope.$on('loadCompleteMap' + $scope.mapData.timeStr, (evt, map) => {
      $rootScope.mapObj = map;
      map && $scope.drawCamera();
    });

    $scope.drawCamera = function() {
      $http.get('/ovu-pcos/pcos/equipment/bigScreen/rtspCameraInfo/query',
        {
          params: {
            parkId: 'af98a32c9b4d490297cadc2d85faf797'
          }
        }
      ).success(function (res) {
        const lngAdd = 0.00544400142515;
        const latAdd = 0.00248701216297;
        let data = res.data;
        data.forEach(val => {
          val.longitude = parseFloat(val.longitude) - lngAdd;
          val.latitude = parseFloat(val.latitude) + latAdd;
          val.icon = '/common/mapComponent/img/camera-gray.png';
          $rootScope.mapObj.addCameraMarker(val, $rootScope.mapObj.map).then(res => {
            $scope.cameras[val.id] = res;
          });
        });
      });
    };
  });
})();
