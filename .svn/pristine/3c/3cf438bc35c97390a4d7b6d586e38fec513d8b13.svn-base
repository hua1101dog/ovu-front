 (function(angular, doc) {
     doc.title = "项目运营中心";
     angular.module('angularApp')

     .controller('singleElevatorOverviewController', ['$scope', '$http', 'fac', '$rootScope', function($scope, $http, fac, $rootScope) {
         angular.extend($scope, fac.dicts);
         // 电梯详情
         $http({
                 method: 'GET',
                 url: '/ovu-pcos/pcos/liftreport/center/single/lift.do',
                 params: {
                     liftId: $scope.liftId
                 }
             })
             .success(function(resp) {
                 if (!resp) {
                     resp = {};
                 }
                 $scope.name = resp.name;
                 var detailData = [{
                     name: '电梯名称',
                     content: resp.name
                 }, {
                     name: '电梯编号',
                     content: resp.code
                 }, {
                     name: '注册代码',
                     content: resp.registerCode
                 }, {
                     name: '所属项目',
                     content: resp.projectName
                 }, {
                     name: '电梯位置',
                     content: resp.equipmentLocation
                 }, {
                     name: '维保单位',
                     content: resp.maintainCompany
                 }, {
                     name: '电梯分类',
                     content: resp.typeName
                 }, {
                     name: '电梯品牌',
                     content: resp.brandName
                 }, {
                     name: '电梯型号',
                     content: resp.modelName
                 }, {
                     name: '维保工',
                     content: resp.personName
                 }, {
                     name: '首保日期',
                     content: resp.firstMaintainDate
                 }, {
                     name: '下次维保日期',
                     content: resp.nextMaintainDate,
                     isActive: true
                 }, {
                     name: '年检日期',
                     content: resp.yearMaintainDate,
                 }, {
                     name: '电梯状态',
                     content: resp.status
                 }];

                 // 电梯详情数据
                 $scope.elevatorDetailsData = detailData;

                 if (resp) {
                     var liftlist = [{
                         longitude: resp.longitude,
                         latitude: resp.latitude,
                         liftStatus: resp.status,
                         liftName: resp.name,
                         liftCode: resp.code,
                         projectName: resp.projectName
                     }];
                     setMapBounds(liftlist);
                     addMarkers(liftlist);
                 }

             });


         // 电梯实时环境
         $http({
                 method: 'GET',
                 url: '/ovu-pcos/pcos/liftreport/center/single/lift/status.do',
                 params: {
                     liftId: $scope.liftId
                 }
             })
             .success(function(data) {
                 $scope.realTimeStatus = data;
             });


         // 维保记录 应急记录 维保计划
         $http({
                 method: 'GET',
                 url: '/ovu-pcos/pcos/liftreport/center/single/lift/workunit.do',
                 params: {
                     liftId: $scope.liftId
                 }
             })
             .success(function(resp) {
                 // 维保记录数据
                 $scope.recordList = resp.recordList;
                 // 应急记录数据
                 $scope.emergencylist = resp.emergencyList;
                 // 维保计划数据
                 $scope.planList = resp.planList;


                 $scope.showInfo = 'map';
                 $scope.showVideo = function() {
                     $scope.showInfo = 'elevatorVideo';

                     $http.get('/ovu-pcos/system/video/recordHistory.do?equipmentId=' + $scope.liftId).success(function(data) {
                        var list = [];
                        for(key in data){
                          list = list.concat(data[key]);
                        }
                        $scope.historyList = list || [];
                     })
                 };
                 $scope.showStatus = function(data) {
                     $scope.showInfo = 'elevatorState';
                     $http.get('/ovu-pcos/pcos/liftreport/center/single/lift/status/deatil.do?liftId=' + $scope.liftId + "&type=1").success(function(data) {
                         $scope.historyStateList = data || [];
                     })

                     $scope.currenState = data;
                 };
                 $scope.showEnv = function(data) {
                     $scope.showInfo = 'elevatorEnv';

                     $http.get('/ovu-pcos/pcos/liftreport/center/single/lift/status/deatil.do?liftId=' + $scope.liftId + "&type=2").success(function(data) {
                         $scope.historyEnvList = data || [];
                     })

                     $scope.currenEv = data;
                 };
                 $scope.cancel = function() {
                     $scope.showInfo = 'map';

                 }

                 $scope.clickEvHistory = function(item) {
                     $scope.currenEv = item;
                 }
                 $scope.clickStateHistory = function(item) {
                     $scope.currenState = item;
                 }
             });


         var map = new AMap.Map('map-container-elevator', {
             resizeEnable: true,
             center: [114.322063, 30.479823],
             zoom: 4,
         });
         map.on('complete', function() {
             map.plugin(["AMap.ToolBar", "AMap.OverView", "AMap.Scale"], function() {

                 var scale = new AMap.Scale();
                 scale.position = 'RB'
                 map.addControl(scale);
             });
         });

         // 设置地图范显示围  根据所有的点 求出需要显示的范围  如果list为空 显示武汉市
         function setMapBounds(list) {
             if (!list || !list.length) {
                 map.setCity('武汉市');
             } else {
                 var bounds = getBoundsByListData(list);
                 console.log(bounds);
                 map.setBounds(bounds);
             }
         }
         // 根据list [{longitude:00.000000,latitude:00.000000,...},...] 数据获取地图显示范围
         function getBoundsByListData(list) {
             var lngArr = [],
                 latArr = [];

             list.forEach(function(v, i) {
                 if (v.longitude && v.latitude) {
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

         //打点
         function addMarkers(list) {
             var markers = [];
             if (!list || !list.length) {
                 markers[0] = new AMap.Marker({
                     map: map
                 });
                 return markers;
             }
             var points = getLnglatsByListData(list);
             points.forEach(function(v, i) {
                 var marker = new AMap.Marker({
                     map: map,
                     position: v,
                     // title: i + 1,
                     // content:
                 });
                 // console.log(v);
                 var data = [{
                         key: '项目名称',
                         value: v.projectName
                     }, {
                         key: '电梯名称',
                         value: v.liftName || ''
                     }, {
                         key: '电梯编号',
                         value: v.liftCode || ''
                     }
                     // ,{
                     //     key: '电梯位置',
                     //     value: v.liftPosition
                     // }, {
                     //     key: '维保工',
                     //     value: v.personName
                     // }
                 ];

                 data.title = v.liftStatus === 1 ? '正常' : '异常';

                 var str = renderMarker(data);

                 var mapIcon;
                 marker.on('mouseover', function() {
                     marker.setzIndex(10010);
                     mapIcon = marker.getIcon();
                     //marker.setOffset(new AMap.Pixel(-20, -20));
                     marker.setContent(str);
                 });

                 marker.on('mouseout', function() {
                     marker.setzIndex(10);
                     marker.setContent('');
                     //marker.setOffset(new AMap.Pixel(0, 0));
                     marker.setIcon(mapIcon);
                 });

                 marker.on('click', function() {
                     //window.location.hash = '#/elevator-37';
                 });

                 markers.push(marker);
             });
             return markers;
         }
         // 根据list 得到地图lnglat点集
         function getLnglatsByListData(list) {
             var lnglatList = [];
             list.forEach(function(v, i) {
                 if (v.longitude && v.latitude) {
                     var lng = parseFloat(v.longitude).toFixed(6),
                         lat = parseFloat(v.latitude).toFixed(6);
                     var lnglat = new AMap.LngLat(lng, lat);
                     lnglatList.push(lnglat);
                     lnglat.projectName = v.projectName;
                     lnglat.liftName = v.liftName;
                     lnglat.liftCode = v.liftCode;
                     // lnglat.liftPosition = v.liftPosition;
                     // lnglat.personName = v.personName;
                     lnglat.liftStatus = v.liftStatus;
                 }
             });
             return lnglatList;
         }
         // 渲染 marker
         function renderMarker(data) {
             var innnerStr = '';
             data.forEach(function(v, i) {
                 innnerStr += '<div><span class="key">' + v.key + ': </span><span class="value" style="white-space:normal; word-break:break-all;">' + v.value + '</span></div>';
             });
             var str = `<div class="map-marker panel panel-default">
                                <div class="map-marker-title panel-title">` + data.title + `</div>
                                <div class="map-marker-content panel-content">` +
                 innnerStr +

                 `</div>
                            </div>`;
             return str;
         }

         $scope.goBack = function() {
             //  window.history.back();
             $scope.$emit('gobackToProject', 1);
         };

         $scope.clickHistory = function(url) {
             $scope.historyUrl = url;
         };

     }])

     //维保记录
     .controller('RecordListCtrl', function($scope, $http, $uibModal, fac) {

         //查看详情
         $scope.showDetailModal = function(item) {
             var param = { id: item.id };
             var modal = $uibModal.open({
                 animation: false,
                 size: 'lg',
                 templateUrl: '/view/liftReport/projectOperationCenter/modal.recordlist.detail.html',
                 controller: 'RecordListDetailCtrl',
                 resolve: {
                     param: param
                 }
             });
             modal.result.then(function() {}, function() {});
         }

     })

     //维保记录详情弹出框
     .controller('RecordListDetailCtrl', function($scope, $uibModalInstance, $http, param) {
         //获取
         $http.get("/ovu-pcos/pcos/liftreport/center/single/workunit/detail.do?type=1&id=" + param.id).success(function(data) {
             $scope.lift = data;
             $scope.recordDetailList = data.stepList;
             $scope.recordDetailList && $scope.recordDetailList.forEach(function(v){
                if(v.photos){
                    v.photos = v.photos.split(",") || [];
                }
             })
         });
         $scope.cancel = function() {
             $uibModalInstance.dismiss('cancel');
         }
     })

     //应急记录
     .controller('EmergencyListCtrl', function($scope, $http, $uibModal, fac) {

         //查看详情
         $scope.showDetailModal = function(item) {
             var param = { id: item.id };
             var modal = $uibModal.open({
                 animation: false,
                 size: 'lg',
                 templateUrl: '/view/liftReport/projectOperationCenter/modal.emergencylist.detail.html',
                 controller: 'EmergencyListDetailCtrl',
                 resolve: {
                     param: param
                 }
             });
             modal.result.then(function() {}, function() {});
         }

     })

     //应急记录详情弹出框
     .controller('EmergencyListDetailCtrl', function($scope, $uibModalInstance, $http, param) {
         //获取
         $http.get("/ovu-pcos/pcos/liftreport/center/single/workunit/detail.do?type=2&id=" + param.id).success(function(data) {
              $scope.data = data;
              $scope.data.photo= data.photo.split(",") || []
         });

         $scope.cancel = function() {
             $uibModalInstance.dismiss('cancel');
         }
     })


     //维保计划
     .controller('PlanListCtrl', function($scope, $http, $uibModal, fac) {

         //查看详情
         $scope.showDetailModal = function(item) {
             var param = { id: item.id };
             var modal = $uibModal.open({
                 animation: false,
                 size: 'lg',
                 templateUrl: '/view/liftReport/projectOperationCenter/modal.recordlist.detail.html',
                 controller: 'PlanListDetailCtrl',
                 resolve: {
                     param: param
                 }
             });
             modal.result.then(function() {}, function() {});
         }

     })

     //维保计划详情弹出框
     .controller('PlanListDetailCtrl', function($scope, $uibModalInstance, $http, param) {
         //获取
         $http.get("/ovu-pcos/pcos/liftreport/center/single/workunit/detail.do?type=1&id=" + param.id).success(function(data) {
             $scope.lift = data;
             $scope.recordDetailList = data.stepList;
             $scope.recordDetailList && $scope.recordDetailList.forEach(function(v){
                if(v.photos){
                    v.photos = v.photos.split(",") || [];
                }
               
             })
         });



         $scope.cancel = function() {
             $uibModalInstance.dismiss('cancel');
         }
     });


 })(angular, document);
