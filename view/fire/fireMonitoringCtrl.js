/**
 * Created by wangheng on 2017/8/28.
 */
(function () {
    "use strict";
    var app = angular.module("angularApp");
    app.controller('fireMonitoringCtl', function ($scope, $rootScope, $location, $http, $filter, $uibModal, fac) {
        var vm = this;
        document.title = "单消防点实时监控";

        var urlP = $location.url().split("=");
        // var id = $rootScope.firePointId;
        var id = urlP[1];
        vm.markers = [];
        //地图基本配置
        vm.mapOptions = {
            // map-self config
            // ui map config
            uiMapCache: false,
            zoom: 12,
            liteStyle: true
        };
        //地图标记点事件
        /* vm.mouseoverMaker = function($event,$params,marker){
             vm.markerData = marker.getExtData();
             vm.myInfoWindow.open(vm.map, marker.getPosition());
         }*/

        vm.clickMaker = function ($event, $params, marker) {
            vm.markerData = marker.getExtData();
            vm.myInfoWindow.open(vm.map, marker.getPosition());
        }
        //消息推送弹出框
        /*vm.message ={url:'myPopoverTemplate.html', content: 'Hello, World!'}*/

        //误报处理
        vm.falseAlarmHandle = function (id) {
            var modal = $uibModal.open({
                animation: true,
                templateUrl: 'fire/modal/modal.editFalseAlarm.html',
                controller: 'editFalseAlarmCtrl'
                , resolve: { id: id }
            });
            modal.result.then(function () {
                getEquiAndPerson(id);
            });
        }
        //查看处理详情
        vm.showDetail = function () {
            var param = {
                id: vm.workunitId,
                showSave: false,
                title: '处理详情'
            }
            var modal = $uibModal.open({
                animation: true,
                component: 'workOrderModalComponent',
                resolve: {
                    param: param
                }
            });
            modal.result.then(function () {
            }, function () {
            });
        };
        //消息推送按钮
        vm.messagePush = function (id) {
            $http.get('/ovu-pcos/pcos/fire/firepointoverview/pushWorkUnit.do?fireWorkunitId=' + id).success(function (data) {
                if (data.success) {
                    msg('推送成功');
                } else {
                    alert();
                }
            });
        }
        //返回到地图页面
        $scope.goBack = function () {
            $location.path('/fire/fireBroadcast');
        }

        //获取设备点以及人员点位
        function getEquiAndPerson() {
            $http.get('/ovu-pcos/pcos/fire/firepointoverview/getFirePointVideoAndPersonList.do?firePointId=' + id)
                .success(function (data) {
                    var markers = [];
                    var list = data.personList || [];

                    data.firePointVideo && list.push(data.firePointVideo);
                    setMapBounds(list);
                    //人员打点
                    list.forEach(function (da) {
                        markers.push(addMarker(vm.map, da));
                    })
                    vm.markers = markers;

                    vm.workunitId = data && data.firePointVideo && data.firePointVideo.workunitId;
                    if (vm.workunitId && fac.isEmpty(vm.list)) {
                        //获取右侧列表
                        $http.get('/ovu-pcos/pcos/fire/firepointoverview/getState.do?workunitId=' + vm.workunitId)
                            .success(function (data) {
                                vm.list = data;
                            });
                    }
                });
        }
        getEquiAndPerson();

        function addMarker(map, data) {
            var icon;
            if(data.firePointId !== undefined) {
                icon = new AMap.Icon({
                    image : "/res/img/fire/ic_fire_1.png",
                    size:[60,60],
                    imageSize:[60,60],
                    imageOffset: new AMap.Pixel(-10, -10)
                });
            }else{
                icon = new AMap.Icon({
                    image : "http://webapi.amap.com/theme/v1.3/markers/n/mark_b.png",
                });
            }
           
            var marker = new AMap.Marker({
                position: [data.longitude || data.mapLng, data.latitude || data.mapLat],
                map: map,
                zIndex: 1000,
                extData: data,
                icon: icon
            });
            return marker;
        }


        // 设置地图范显示围  根据所有的点 求出需要显示的范围  如果list为空 显示武汉市
        function setMapBounds(list) {
            if (!list || !list.length) {
                vm.map.setCity('武汉市');
            } else {
                var bounds = getBoundsByListData(list);
                vm.map.setBounds(bounds);
            }
        }
        // 根据list [{longitude:00.000000,latitude:00.000000,...},...] 数据获取地图显示范围
        function getBoundsByListData(list) {
            var lngArr = [],
                latArr = [];

            list.forEach(function (v, i) {
                if (v && v.mapLng || v.mapLat) {
                    v.longitude = v.mapLng;
                    v.latitude = v.mapLat;
                }
                if (v && v.longitude && v.latitude) {
                    lngArr.push(parseFloat(v.longitude));
                    latArr.push(parseFloat(v.latitude));
                }
            });

            var minLng = Math.min.apply(null, lngArr),
                maxLng = Math.max.apply(null, lngArr);

            var minLat = Math.min.apply(null, latArr),
                maxLat = Math.max.apply(null, latArr);

            var deltaLng = maxLng - minLng,
                deltaLat = maxLat - minLat;

            minLng -= 0.05 * deltaLng;
            minLat -= 0.05 * deltaLat;
            maxLng += 0.05 * deltaLng;
            maxLat += 0.05 * deltaLat;

            var southWest = new AMap.LngLat(minLng.toFixed(6), minLat.toFixed(6)),
                northEast = new AMap.LngLat(maxLng.toFixed(6), maxLat.toFixed(6));

            return new AMap.Bounds(southWest, northEast);

        }

    });

    app.controller('editFalseAlarmCtrl', function ($scope, $rootScope, $http, $uibModalInstance, $uibModal, $filter, fac, id) {
        $scope.item = { workunitId: id, type: 2 };
        $scope.save = function (form, item) {
            form.$setSubmitted(true);
            if (!form.$valid) {
                return;
            } else if (!item.imgPaths) {
                alert("请上传图片");
                return;
            }
            $http.post("/ovu-pcos/pcos/fire/firepointoverview/updateFireWorkUnitToFalse.do", item, fac.postConfig).success(function (data, status, headers, config) {
                if (data.success) {
                    msg("保存成功!");
                    $uibModalInstance.close();
                } else {
                    alert();
                }
            })
        }

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };


        //选择执行人员
        $scope.chooseExecutePerson = function () {
            var modal = $uibModal.open({
                animation: false,
                size: 'lg',
                templateUrl: '/common/modal.select.person.html',
                controller: 'personSelectorCtrl',
                resolve: {
                    data: {
                        onlyOne: true,
                        per_Id: $scope.item.execPersonId,//人员id
                        per_Name: $scope.item.execPersonName,//人员名字
                        parkId: ''
                    }
                }
            });
            modal.result.then(function (data) {
                if (data) {
                    $scope.item.execPersonId = data.per_Id;
                    $scope.item.execPersonName = data.per_Name;
                }
            }, function () {
            });
        }
        //选择配合人员
        $scope.chooseOtherPerson = function () {
            var modal = $uibModal.open({
                animation: false,
                size: 'lg',
                templateUrl: '/common/modal.select.person.html',
                controller: 'personSelectorCtrl',
                resolve: {
                    data: {
                        per_Id: $scope.item.otherId, //人员id
                        per_Name: $scope.item.otherName, //人员名字
                        parkId: ''
                    }
                }
            });
            modal.result.then(function (data) {
                if (data) {
                    $scope.item.coopPersonIds = data.per_Id;
                    $scope.item.coopPersonName = data.per_Name;
                }
            }, function () { });
        }
    });

})();
