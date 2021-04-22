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
      //   name: '1号工坊摄像头',
      //   time: '2019-12-02 09:36:01',
      //   picA: 'http://imagetest.ovuems.com/986d9498-11be-11ea-bb50-04d4c491fc7f.jpg',
      //   picB: 'http://imagetest.ovuems.com/941f6858-11be-11ea-8b9e-04d4c491fc7f.jpg',
      //   id: 5
      // }
    ];
    $scope.typeList = [
      { name: "大华", id: 1 },
      { name: "宇视", id: 2 },
      { name: "海康", id: 3 },
      { name: "旷视", id: 4 },
      { name: "旷视", id: 5 },
      { name: "大华dvr", id: 6 },
      { name: "臻识", id: 7 },
      { name: "其他", id: 8 },
    ];
    $scope.dealCameras = [];
    $scope.cameras = [];
    $scope.search = {
      name:""
    };
    $scope.rule = {
      ruleName: "",
      brand: "",
      equipSimpleName: "",
      peopleNum:10
    };
    $scope.imgList = [];
    $scope.pageModel = [];
    $scope.showCameraList = 1;
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
      AppService.isStop = false
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
        };
        $scope.getEquipmentList();
      })
    });
    $rootScope.$on('stopLoadCompleteMap'+$scope.mapData.timeStr, (evt, map) => {
      $rootScope.mapObjPed = map;
      map && $scope.drawCamera();
    });
    $scope.find = function (pageNo) {
      angular.extend($scope.search, { currentPage: pageNo || $scope.pageModel.currentPage || 1, pageSize: $scope.pageModel.pageSize || 10 });
      fac.getPageResult("/ovu-pcos/pcos/equipment/bigScreen/rtspPeopleInfo/query", $scope.search, function (data) {
        $scope.pageModel = data;
        $scope.imgList = $scope.pageModel.data;
      });
    };
    $scope.find(1);
    $scope.datas = [];
    // $scope.goMessage = function (item) {
    //   console.log('$scope.cameras :', $scope.cameras);
    //   console.log('item :', item);
    //   $rootScope.mapObjPed.addWindowInfo($scope.cameras[item.id],item.name,$rootScope.mapObjPed.map);
    // };
    $scope.goSearch = function () {
      $scope.getEquipmentList();
    };
    $scope.goSearchImgList = function(){
      $scope.find(1);
    };
    $scope.drawCamera = function () {
      $http.get('/ovu-pcos/pcos/equipment/bigScreen/rtspPeopleInfo/query',
        {
          params: {
            parkId: $scope.search.parkId,
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
          val.icon = '/res/img/selSingleCamer.png';
          $scope.ranges.push({
            equipmentName: val.name,
            equipmentId: val.domain_id,
            bindCameraId: val.domain_id,
            bindCameraName: val.name,
            points: val.monitoring_range ? JSON.parse(val.monitoring_range) : [],
          });
          $rootScope.mapObjPed.addCameraMarker(val, $rootScope.mapObjPed.map).then(res => {
            $scope.cameras[val.id] = res;
          });
        });
      });
    };
    $scope.equipmentList = function(){
      $scope.imgItem = null;
      $scope.showCameraList = 1;
    };
    $scope.deleteImg = function (index, id) {
      confirm("确认删除该条记录吗?", function () {
        $http.get(`/ovu-pcos/pcos/equipment/bigScreen/rtspPeopleInfo/delete?id=${id}`).success(function (res) {
          msg(res.data + "!");
          $scope.find(1);
        });
    })
  };
    $scope.getEquipmentList = function () {
      $http.get(`/ovu-pcos/pcos/equipment/bigScreen/queryRtspForDaping?domainId=14bdbea59d2c4b0a96594fb94382901e&inOutDoor=2&parkId=${$scope.search.parkId}&model_id=1500625624144&equip_status=1&in_out_door=2&NAME=${$scope.rule.ruleName}&equipSimpleName=${$scope.rule.equipSimpleName}&brand=${$scope.rule.brand}`).success(function (resp) {
        let datas = resp.data;
        for (let i = 0; i < datas.length; i++) {
          for (let j = 0; j < $scope.imgList.length; j++) {
            if ($scope.imgList[j].name == datas[i].equip_simple_name) {
              datas[i].operation = "已设置区域"
            }
          }
        }
        $scope.rulesList = datas;
      });
    };
    $scope.drawMonitoring = function (item) {//规则设置
      $scope.item = item;
      $scope.snapPicture(item);
    };
    $scope.snapPicture = function (item) {//点击抓拍获取设备图片
      switch (item.cameraInfo.cameraModel) {
        case "dh":
            item.rtspRule = `rtsp://${item.cameraInfo.cameraPasswd}:${item.cameraInfo.cameraPasswd}@${item.cameraInfo.ip}:${item.cameraInfo.port}`;
            break;
        case "ys":
            item.rtspRule = `rtsp://${item.cameraInfo.cameraPasswd}:${item.cameraInfo.cameraPasswd}@${item.cameraInfo.ip}:${item.cameraInfo.port}`;
            break;
        case "海康":
            item.rtspRule = `rtsp://${item.cameraInfo.cameraPasswd}:${item.cameraInfo.cameraPasswd}@${item.cameraInfo.ip}:${item.cameraInfo.port}`;
            break;
        case "旷视":
            item.rtspRule = `rtsp://${item.cameraInfo.ip}:${item.cameraInfo.port}/user=${item.cameraInfo.cameraPasswd}_password=${item.cameraInfo.cameraPasswd}`;
            break;
        case "dh_dvr":
            item.rtspRule = `rtsp://${item.cameraInfo.cameraPasswd}:${item.cameraInfo.cameraPasswd}@${item.cameraInfo.ip}:${item.cameraInfo.port}/cam/realmonitor?channel=${item.cameraInfo.channel}`;
            break;
        case "臻识":
            item.rtspRule = `resp://${item.cameraInfo.ip}:${item.cameraInfo.port}/h264`;
            break;
        case "其他":
            item.rtspRule = `resp://${item.cameraInfo.cameraPasswd}:${item.cameraInfo.cameraPasswd}@${item.cameraInfo.ip}:${item.cameraInfo.port}`;
            break;
        default:
            break;
    }
      $('#exampleModalScrollablePeo').modal('show');//打开模态框
      $http.get(`/ovu-pcos/pcos/equipment/bigScreen/getImageByRtsp?rtspUrl=${item.rtspRule}`).success(function (resp) {
          $scope.rule.cutImages = resp.data;
          if (resp.data == "") $scope.rule.cutImages = "/image/no-img.png"
      });
    };
    $scope.editPeoImg = function(index,item){//编辑
      $('#exampleModalScrollablePeo').modal('show');//打开模态框
      $scope.rule.peopleNum = item.num;
      $scope.rule.cutImages = item.imgUrl;
      $scope.imgItem = item;
    };
    $scope.savePeople = function(){
      let param;
            if ($scope.imgItem == null) {
                param = {
                    name: $scope.item.equip_simple_name,
                    rtsp: $scope.item.rtspRule,
                    in_out_door: $scope.item.in_out_door,
                    latitude: $scope.item.map_lat,
                    longitude: $scope.item.map_lng,
                    park_id: $scope.item.park_id,
                    num:$scope.rule.peopleNum,
                    domain_id: $scope.item.domain_id,
                    code: $scope.item.regi_code,
                    imgUrl:$scope.rule.cutImages
                } 
            } else {
                param = {
                    id: $scope.imgItem.id,
                    name: $scope.imgItem.name,
                    rtsp: $scope.imgItem.rtsp,
                    in_out_door: $scope.imgItem.in_out_door,
                    latitude: $scope.imgItem.latitude,
                    longitude: $scope.imgItem.longitude,
                    imgUrl:$scope.imgItem.imgUrl,
                    num:$scope.rule.peopleNum,
                    park_id: $scope.search.parkId,
                    domain_id: "14bdbea59d2c4b0a96594fb94382901e",
                }
            }
      $http.post(`/ovu-pcos/pcos/equipment/bigScreen/rtspPeopleInfo/save`, angular.extend(param), fac.postConfig).success(function (resp) {
        if (resp.data !== undefined) {
            msg(resp.data + "!");
        } else {
            layer.msg(resp.msg, {//失败
                time: 2000,
                icon: 5
            });

        }
        $scope.find(1);;
    });
    };
    const pedestrianWebsocket = new SockJS('/ovu-pcos/pcos/sayhello', null, { transports: 'websocket', timeout: 20000 });
    pedestrianWebsocket.onopen = function () {
      console.log('Info: connection opened.');
    };
    pedestrianWebsocket.onmessage = (event) => {
      let data = JSON.parse(event.data).data;
      if (data && data.dataType === 'PeopleGather') {
        $scope.lists.unshift(data);
        if($scope.lists.length>20){
          $scope.lists.pop();
        }
        if (!$scope.dealCameras.includes(data.id)) {
          if($scope.datas.length == 0) return;
          for (let i = 0; i < $scope.datas.length; i++) {
            if($scope.datas[i].id == data.id){
              $scope.datas[i].id = $scope.datas[i].id;
              $scope.datas[i].icon = '/common/mapComponent/img/people.png';
            }
          }
          $scope.datas.forEach(item => {
            $rootScope.mapObjPed.addCameraMarker(item, $rootScope.mapObjPed.map).then(res => {
              $scope.cameras[item.id] = res;
            });     
          });
          $scope.dealCameras.push(data.id);
          if(data == undefined) return;
          if($rootScope.mapObjPed == undefined) return;
          $rootScope.mapObjPed.addWindow($scope.cameras[data.id], `此处有${data.personNum}人聚集!`, $rootScope.mapObjPed.map);
        }
      }
    };

    $scope.$on('cloneSocket', () => {
      pedestrianWebsocket.close();
    });
    pedestrianWebsocket.onclose = (event) => {
      console.log('Info: connection closed.');
      console.log(event);
    };


  });
})();
