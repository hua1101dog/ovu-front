 (function(angular, document) {
     //  document.title = "单项目";
     var app = angular.module('angularApp');

     app.controller('singleCtrl', ['$scope', '$rootScope', '$uibModal', '$http', '$filter', 'fac', 'eqMonit.chartsService', 'eqMonit.single.httpService', 'eqMonit.mapService',
         function($scope, $rootScope, $uibModal, $http, $filter, fac, charts, httpHelper, mapService) {
             // 拿到项目名称
             $scope.projectName = $rootScope.projectName;
             //  $scope.projectId = $rootScope.projectId;
             var projectId = $rootScope.projectId;

             // 会话验证 这里不需要了 入口文件已经验证过了
             if (!fac.isGroupVersion() && app.park) {
                 console.log('app');
                 console.log(app);
                 $scope.projectName = app.park.parkName.split('>').pop();
                 projectId = app.park.id;
             }

             console.log('parkid......');
             console.log(projectId);
             httpHelper.getProjDetail(projectId).then(function(res) {
                 console.log('单项目');
                 console.log(res.data);

                 var projData = {};

                 // 这四个属性是每一期的
                 var filterArr = ['stage_id', 'stage_map_lat', 'stage_map_lng', 'equip_status'];
                 var obj = res.data[0];
                 for (var k in obj) {
                     if (obj.hasOwnProperty(k)) {
                         var isInFilter = filterArr.some(function(v) {
                             return k === v;
                         });
                         if (!isInFilter) {
                             projData[k] = obj[k];
                         }
                     }
                 }
                 projData.stages = res.data.map(function(v) {
                     return {
                         stage_id: v.stage_id,
                         stage_map_lat: v.stage_map_lat,
                         stage_map_lng: v.stage_map_lng,
                         stage_status: v.equip_status
                     };
                 });
                 //  console.log('拼接。。。。。');
                 //  console.log(projData);
                 var points = projData.stages.map(function(v) {
                     var color = '';
                     if (v.stage_status === 1) {
                         color = 'green'
                     }
                     if (v.stage_status === 3) {
                         color = 'yellow'
                     }
                     if (v.stage_status === 2) {
                         color = 'red'
                     }
                     return {
                         longitude: v.stage_map_lng,
                         latitude: v.stage_map_lat,
                         color: color
                     };
                 });
                 console.log(points);
                 mapService.addMarkers($scope.map, points);
                 // 拼接图标路径
                 var parkIcon = '/ovu-pcos/' + projData.PARK_ICON;
                 mapService.addGroundImage($scope.map, parkIcon, projData.BL_POSITION, projData.TR_POSITION);
             });

             //  });

             // 跳转到设备详情
             $scope.detail = function() {
                 $scope.$parent.detail();
             };

             // 地图
             var map = new AMap.Map('map-single', {
                 resizeEnable: true,
                 zoom: 4,
                 center: [116.480983, 40.0958]
             });

             $scope.map = map;

             // 图表
             var pieOption1, pieOption2;
             pieOption1 = charts.getPieOption();
             pieOption2 = charts.getPieOption();
             // 设备状态饼图
             httpHelper.fetchProjEqStatus(projectId).then(function(res) {
                 console.log('柱状图1');
                 console.log(res);
                 var data = res.data.map(function(v, i) {
                     return {
                         name: res.data[i].text,
                         value: res.data[i].num
                     };
                 });

                 pieOption1.legend.data = data.map(function(v) {
                     return v.name;
                 });
                 pieOption1.series[0].data = data;
                 $scope.pieOption1 = pieOption1;
             });
             // 设备故障统计图
             httpHelper.fetchProjEqFaultNum(projectId).then(function(res) {
                 console.log('柱状图2');
                 console.log(res);
                 var data = res.data.map(function(v) {
                     return {
                         name: v.equipmentName,
                         value: v.equipmentNum
                     }
                 })
                 pieOption2.legend.data = data.map(function(v) {
                     return v.name;
                 });
                 pieOption2.series[0].data = data;
                 // 样式
                 pieOption2.series[0].radius = ['30%', '45%'];
                 pieOption2.series[0].center = ['50%', '25%'];
                 $scope.pieOption2 = pieOption2;
             });

             //图表resize事件
             window.onresize = function() {
                 $scope.$broadcast("onWindowResize");
             };


             $scope.pageModel = {};
             $scope.search = {};
             $scope.search.isGroup = fac.isGroupVersion();
             //  $scope.find = find;


         }
     ]);

     app.service('eqMonit.single.httpService', ['$http', '$q', 'fac', function($http, $q, fac) {

         var projDetailUrl = '/ovu-base/system/park/getDetails.do', //单项目性情数据
             projEqFaultNumUrl = '/ovu-pcos/pcos/equipment/listExpEquipNum.do', //单项目设备故障统计
             projEqStatusUrl = '/ovu-pcos/pcos/equipment/listEquipStatus.do'; //单项目设备状态统计

         // 获取单项目详情数据
         this.getProjDetail = function(projId) {
             return $http.get(projDetailUrl + '?parkId=' + projId);
         };

         // 获取设备状态统计信息
         this.fetchProjEqStatus = function(projId) {
             return $http.post(projEqStatusUrl, {
                 isGroup: false,
                 park_id: projId
             }, fac.postConfig);
         };

         // 获取设备故障统计数据
         this.fetchProjEqFaultNum = function(projId) {
             return $http.post(projEqFaultNumUrl, {
                 isGroup: false,
                 park_id: projId
             }, fac.postConfig);
         };

     }]);


     //  angular.bootstrap(document.getElementById("angularId"), ['angularApp']);
 })(angular, document);