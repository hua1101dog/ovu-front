(function () {
  document.title = "一人一档";
  "use strict";
  var app = angular.module("angularApp");
  app.service('AppService', function ($http, fac) {
    var that = this;
    this.park = { parkNo: '', parkName: '' };
    //项目编号
    this.parkNo = '';
  });
  app.controller('aPersonADetailCtrl', function ($scope, $rootScope, $interval, $http, $filter, $uibModal, fac, AppService) {
    const id = $rootScope.pages.params.item.id ? $rootScope.pages.params.item.id : $rootScope.pages.params.item.uuid;
    $scope.url = $rootScope.pages.params.item.url;
    $scope.people = $rootScope.pages.params.item;
    $scope.search = {};
    $scope.mapData = {
      name: 'cytdRange' + new Date().getTime(),
      timeStr: new Date().getTime()
    };
    $scope.typeList = [
      { name: "大华", id: 1 },
      { name: "宇视", id: 2 },
      { name: "海康", id: 3 },
      { name: "旷视", id: 4 },
      { name: "大华dvr", id: 5 },
      { name: "臻识", id: 6 },
      { name: "其他", id: 7 },
    ];
    $scope.screen = [];
    $scope.path = [];
    AppService.park = { parkNo: '', parkName: '' };
    AppService.parkNo = '';

    $scope.pageModel = {};
    $scope.childList = [];
    function formatDate(now) {
      var year = now.getFullYear();
      var month = now.getMonth() + 1;
      var date = now.getDate();
      var hour = now.getHours();
      var minute = now.getMinutes();
      var second = now.getSeconds();
      return year + "-" + month + "-" + date + " " + hour + ":" + minute + ":" + second;
    };
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
    };
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
        };
      })
    });
    function coordinatesToMercato(dinatesArr) {
      var dinatesToMercato = dinatesArr.slice(0);
      dinatesToMercato = dinatesToMercato instanceof Array ? dinatesToMercato : [];
      dinatesToMercato[0] = Number.parseFloat(dinatesToMercato[0]) * 20037508.34 / 180;
      dinatesToMercato[1] = Math.log(Math.tan((90 + Number.parseFloat(dinatesToMercato[1])) * Math.PI / 360)) / (Math.PI / 180);
      dinatesToMercato[1] = -Number.parseFloat(dinatesToMercato[1]) * 20037508.34 / 180;
      return dinatesToMercato;
    };

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
    };
    function getQueryAll() {
      $http.get(`/faceDiscern/devManager/queryAll`).success(function (res) {
        $scope.screen = res;
        console.log('$scope.screen :', $scope.screen);
      });
    };
    getQueryAll();
    $rootScope.$on('trackLoadCompleteMap' + $scope.mapData.timeStr, (evt, map) => {
      $rootScope.mapObjPed = map;
      map && $scope.drawCamera();
    });
    $scope.drawCamera = function () { //画图
      // $rootScope.mapObjPed.addWayLine($rootScope.mapObjPed.map);
    };
    $scope.all_Charge = false
    //全选按钮
    $scope.allCharge = function () { //全选
      $scope.all_Charge = !$scope.all_Charge
      $scope.pageModel.list.forEach(item => {
        item.checked = $scope.all_Charge
        $scope.path.push([parseFloat(item.longitude), parseFloat(item.latitude)]);
      })
    };
    $scope.charge = function (item) { //单选
      console.log('item :', item);
      item.checked = !item.checked;
      $scope.checkedList = [];
      $scope.pageModel.list.forEach((item) => {
        if (item.checked) {
          $scope.checkedList.push(item.id)
        }
        if ($scope.checkedList.length == $scope.pageModel.pageSize) {
          $scope.all_Charge = true
        } else {
          $scope.all_Charge = false
        }
      })
    };
    function timeSystem(time) {
      var d = new Date(time);
      var times = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate() + ' ' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds();
      return times
    }
    $scope.find = function (pageNo) {
      angular.extend($scope.search, { currentPage: pageNo || $scope.pageModel.currentPage || 1, pageSize: $scope.pageModel.pageSize || 10 });
      if ($scope.url) {
        fac.getPageResult(`/faceDiscern/stranger/detail?uuid=${id}&pageIndex=${pageNo || 0}&pageSize=10&parkId=af98a32c9b4d490297cadc2d85faf797`, $scope.search, function (data) {
          $scope.pageModel = data;
          let datas = $scope.pageModel.data;
          for (let i = 0; i < datas.length; i++) {
            datas[i].createTimes = timeSystem(datas[i].createTime);
            console.log('datas[i].createTimes :', datas[i].createTimes);
            datas[i].checked = false;
            datas[i].avatarPhoto = datas[i].url;
          }
          $scope.childList = datas;
        });
      } else {
        fac.getPageResult(`/faceDiscern/staffManage/staffInfo?subjectId=${id}&pageIndex=${pageNo || 0}&pageSize=10`, $scope.search, function (data) {
          $scope.pageModel = data;
          let datas = $scope.pageModel.data;
          for (let i = 0; i < datas.length; i++) {
            datas[i].checked = false;
            datas[i].avatarPhoto = "http://192.168.6.100" + datas[i].photo;
            if (datas[i].subject == undefined) return;
            datas[i].entryDate = formatDate(new Date(datas[i].subject.entry_date * 1000));
            for (let j = 0; j < $scope.screen.length; j++) {
              if ($scope.screen[j].screenToken == datas[i].screen.screen_token) {
                datas[i].longitude = $scope.screen[j].longitude;
                datas[i].latitude = $scope.screen[j].latitude;
              }
            }
          }
          $scope.childList = datas;
        });
      }
    };
    if ($scope.url) {
      $scope.find(0);
    } else {
      $scope.find(1);
    };
    $scope.showBigImg = function (url) {
      var img = "<img  src=" + url + " style='width:300px;height:300px' />"
      layui.use('layer', function () {
        layer = layui.layer
        layer.open({
          type: 1,
          title: '照片',
          content: img //这里content是一个普通的String
        });
      })
    };
    $scope.goList = function () {
      $rootScope.target("equipment/aPersonA", "档案列表", false, '', {
      }, "equipment/aPersonA");
    };
    $.ajax({
      type: "get",
      url: "../view/facesSetting/json/route1.json",
      async: true,
      success: function(data) {
       $scope.paths = data;
      }
    });
    $scope.checkTrack = function () {
      console.log('object :', $scope.path);
      $rootScope.mapObjPed.addCameraMarker($scope.childList, $rootScope.mapObjPed.map);
      let list = [];
      let mapCenter = coordinatesToMercato([114.31624978513, 30.47280866738]);
      for (let i = 0; i < $scope.path.length; i++) {
          list.push(coordinatesToCoordinates3(mapCenter,[$scope.path[i][0],$scope.path[i][1]]))
      }
      console.log('list :', list);
      $rootScope.mapObjPed.drawPointPath($rootScope.mapObjPed.map,list,$scope.paths,"创意天地");
    };
  });
})();
