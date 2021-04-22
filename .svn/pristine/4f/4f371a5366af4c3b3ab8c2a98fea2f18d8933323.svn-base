   (function(angular, document) {
       //    document.title = "项目总览";
       var app = angular.module('angularApp');

       app.controller('MultiCtrl', ['$scope', '$rootScope', '$uibModal', '$http', '$q', '$filter', 'fac', 'eqMonit.chartsService', 'eqMonit.cities', 'eqMonit.multi.httpService', 'eqMonit.mapService', function($scope, $rootScope, $uibModal, $http, $q, $filter, fac, charts, city, httpHelper, mapService) {

           // 页面数据模型
           $scope.pageModel = {};

           // 会话验证 判断是否需要登录
           var p = fac.getSessionInfo($rootScope);
           // 会话验证成功才执行
           p.then(function() {

               // 判断是集团版 还是项目版
               var isGroup = fac.isGroupVersion();
               //项目版时,会保存已选 中的 parkId至 search中. 而在集团版中,每次打开页面,parkId默认为空
               //    if (!isGroup && $scope.park) {
               //        $scope.search.parkId = $scope.park.ID;
               //        $scope.search.PARK_NAME = $scope.park.PARK_NAME;
               //    }

               // 获取项目树
               httpHelper.getParkTree().then(function(res) {
                   console.log('获取项目树成功');
                   console.log(res.data);
                   $scope.parkTree = res.data;
               });
               //获取所有数据
               httpHelper.fetchAll().then(function(res) {
                   console.log('初始化界面获取全部数据成功');
                   $scope.pageModel = res.data;
                   console.log(res.data);
                   console.log('map markers');
                   var points = res.data.data.map(pointMaper);
                   mapService.addMarkersAndsetBound($scope.map, points);
               });
           });

           // 配置tree-view 指令 非编辑模式
           $scope.config = {
               edit: false
           };
           // tree-view 节点点击 回调函数
           $scope.selectNode = function(node) {
               //    console.log(node);
               //    console.log(node.PARK_NAME);
               //    console.log(node.id);
               if (node.pid === '0') { //根节点
                   $scope.map.setZoom(4); // 地图显示全国
                   httpHelper.fetchAll().then(function(res) { // 获取全国所有的数据
                       console.log('获取全部数据成功');
                       $scope.pageModel = res.data;
                       console.log('全部数据 map markers');
                       var points = res.data.data.map(pointMaper);
                       mapService.addMarkersAndsetBound($scope.map, points);
                   });
               } else if (city.isInCities(node.PARK_NAME) || city.isInCities(node.PARK_NAME + '市')) { //点击了市
                   $scope.map.setCity(node.PARK_NAME + '市'); //地图显示当前市
                   // 筛选当前市的所有数据
                   httpHelper.fetchByCity(node.id).then(function(res) {
                       console.log('获取' + node.PARK_NAME + '市数据成功');
                       $scope.pageModel = res.data;
                       console.log('市级别 map markers');
                       var points = res.data.data.map(pointMaper);
                       mapService.addMarkersAndsetBound($scope.map, points);
                   });
               } else if (node.PARK_TYPE === '1') { //叶节点
                   // 地图显示该区域
                   // 筛选当前项目的数据
                   httpHelper.fetchByCity(node.id).then(function(res) {
                       console.log('获取' + node.PARK_NAME + '数据成功');
                       $scope.pageModel = res.data;
                       console.log('项目级别 map markers');
                       var points = res.data.data.map(pointMaper);
                       mapService.addMarkersAndsetBound($scope.map, points);
                   });
               }
           };

           // 跳转到单项目
           $scope.singleProject = function(item) {
               //    console.log(id);
               //    $scope.$parent.projectId = id;
               $rootScope.projectId = item.ID;
               $rootScope.projectName = item.PARK_NAME;
               $scope.$parent.singleProject();
           };

           // 高德地图
           var map = new AMap.Map('map-multi', {
               resizeEnable: true,
               zoom: 4,
               center: [116.480983, 40.0958]
           });

           $scope.map = map;
           var pointMaper = function(value) {
               var point = {};
               if (value.TR_POSITION) {
                   point.longitude = value.TR_POSITION.split(',')[0];
                   point.latitude = value.TR_POSITION.split(',')[1];
               } else if (value.MAP_LNG && value.MAP_LAT) {
                   point.longitude = value.MAP_LNG;
                   point.latitude = value.MAP_LAT;
               } else {
                   point.longitude = null;
                   point.latitude = null;
               }
               return point;
           };
           //    $scope.markers = null;

           var colors = [
               "#3366cc", "#dc3912", "#ff9900", "#109618", "#990099", "#0099c6", "#dd4477", "#66aa00",
               "#b82e2e", "#316395", "#994499", "#22aa99", "#aaaa11", "#6633cc", "#e67300", "#8b0707",
               "#651067", "#329262", "#5574a6", "#3b3eac"
           ];


           // 统计图表
           // 饼图
           var pieOption = charts.getPieOption();
           pieOption.title.text = " ";
           httpHelper.fetchEqStatus().then(function(res) {
               console.log('饼图设备状态统计数据获取成功');
               var data = res.data.map(function(v, i) {
                   return {
                       name: res.data[i].text,
                       value: res.data[i].num
                   };
               });
               pieOption.legend.data = data.map(function(v) {
                   return v.name;
               });
               pieOption.series[0].data = data;
               $scope.pieOption = pieOption;
           });

           // 柱状图
           var barOption = charts.getBarOption();
           $scope.barOption = barOption;
           httpHelper.fetchEqFaultNum().then(function(res) {
               console.log('柱状图设备故障统计数据获取成功');
               barOption.title.text = '';

               barOption.xAxis[0].data = res.data.map(function(v) {
                   return v.equipmentName;
               });
               barOption.series[0].data = res.data.map(function(v) {
                   return v.equipmentNum;
               });
               $scope.barOption = barOption;
           });

           //图表resize事件
           window.onresize = function() {
               $scope.$broadcast("onWindowResize");
           };
       }]);

       app.service('eqMonit.chartsService', ['$http', function($http) {
           //电梯品牌统计，空心扇形图都可以用
           this.getPieOption = function() {
               return angular.merge({}, {
                   title: {
                       left: 'center'
                   },
                   tooltip: {
                       trigger: 'item',
                       formatter: "{a} <br/>{b}: {c} ({d}%)"
                   },
                   legend: {
                       data: ['日历', '格力', '互看了', '视频广告', '搜索引擎'],
                       bottom: '5%'
                   },
                   series: [{
                       name: '访问来源',
                       type: 'pie',
                       radius: ['50%', '70%'],
                       center: ['50%', '45%'],
                       avoidLabelOverlap: false,
                       label: {
                           normal: {
                               show: false,
                               position: 'center'
                           },
                           emphasis: {
                               show: true,
                               textStyle: {
                                   fontSize: '30',
                                   fontWeight: 'bold'
                               }
                           }
                       },
                       labelLine: {
                           normal: {
                               show: false
                           }
                       },
                       data: [{
                           value: 335,
                           name: '日历'
                       }, {
                           value: 310,
                           name: '格力'
                       }, {
                           value: 234,
                           name: '互看了'
                       }, {
                           value: 135,
                           name: '视频广告'
                       }, {
                           value: 1548,
                           name: '搜索引擎'
                       }]
                   }]
               });
           };
           this.getBarOption = function() {
               return angular.merge({}, {
                   title: {
                       text: '电梯分类统计',
                       top: '3%',
                       left: '3%',
                       textStyle: {
                           color: '#73879C',
                           fontSize: '14',
                           fontFamily: '微软雅黑',
                           fontWeight: 'normal'
                       }
                   },
                   tooltip: {
                       trigger: 'axis',
                       formatter: "{b} : {c}台",
                       axisPointer: { // 坐标轴指示器，坐标轴触发有效
                           type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
                       }
                   },
                   legend: {
                       orient: 'vertical',
                       x: '75%',
                       y: 'middle',
                       data: ''
                   },
                   grid: {
                       left: '3%',
                       right: '4%',
                       bottom: '3%',
                       containLabel: true
                   },
                   xAxis: [{
                       type: 'category',
                       data: ['暖通', '给排水', '变配电', '电梯', '消防', '安防', '智能照明', '停车场', '能耗'],
                       axisTick: {
                           alignWithLabel: true
                       },
                       axisLabel: {
                           interval: 0
                       }
                   }],
                   yAxis: [{
                       type: 'value',
                       name: '台'
                   }],
                   series: [{
                       name: '直接访问',
                       type: 'bar',
                       legendHoverLink: false,
                       data: [10, 52, 200, 334, 390, 330, 220, 200, 100],
                       label: {
                           normal: {
                               show: true,
                               position: 'outside',
                               formatter: "{c}台"
                           }
                       },
                       itemStyle: {
                           normal: {　　　　　　　　　　　　
                               color: function(params) {
                                   var colorList = ['#c23531', '#2f4554', '#61a0a8', '#d48265', '#91c7ae', '#749f83', '#ca8622', '#bda29a', '#6e7074'];
                                   return colorList[params.dataIndex]
                               }　　　　　　　　　　　
                           }
                       }
                   }]
               });
           }
       }]);

       app.service('eqMonit.mapService', ['$http', function($http) {
           // 存放marker点 的私有数组
           var mapMarkers = [];
           // 设置地图范显示围  根据所有的点 求出需要显示的范围  如果list为空 显示武汉市
           this.setMapBounds = function(map, list) {
               if (!list || !list.length) {
                   //    map.setCity('武汉市');
                   map.setZoom(4);
                   return;
               } else {
                   var bounds = this.getBoundsByListData(list);
                   map.setBounds(bounds);
               }
           };
           // 根据list [{longitude:00.000000,latitude:00.000000,...},...] 数据获取地图显示范围
           this.getBoundsByListData = function(list) {
               var lngArr = [],
                   latArr = [];

               list.forEach(function(v, i) {
                   if (v.longitude && v.latitude) {
                       lngArr.push(parseFloat(v.longitude));
                       latArr.push(parseFloat(v.latitude));
                   }
               });
               // 最小经度 和 最大经度
               var minLng = Math.min.apply(null, lngArr),
                   maxLng = Math.max.apply(null, lngArr);
               // 最小纬度 和 最大纬度
               var minLat = Math.min.apply(null, latArr),
                   maxLat = Math.max.apply(null, latArr);
               // 经度范围 = 最大经度 - 最小经度  纬度范围 = 最大纬度 - 最小纬度
               var deltaLng = maxLng - minLng,
                   deltaLat = maxLat - minLat;
               // 最值两侧各留5%余量
               minLng -= 0.05 * deltaLng;
               minLat -= 0.05 * deltaLat;
               maxLng += 0.05 * deltaLng;
               maxLat += 0.05 * deltaLat;

               var southWest = new AMap.LngLat(minLng.toFixed(6), minLat.toFixed(6)),
                   northEast = new AMap.LngLat(maxLng.toFixed(6), maxLat.toFixed(6));
               // 返回适配list的范围
               return new AMap.Bounds(southWest, northEast);
           };
           //打单点
           this.addMarker = function(map, point) {
               if (!point.longitude || !point.latitude) {
                   console.log('marker点没有经纬度');
                   return;
               }
               if (!angular.isNumber(-point.longitude) || !angular.isNumber(-point.latitude)) {
                   console.log('marker点的经纬度数据类型不正确');
                   return;
               }
               if (Math.abs(point.longitude) > 180 || Math.abs(point.latitude) > 90) {
                   console.log('marker点经纬度数值范围不正确');
                   return;
               }
               var icon = '';
               switch (point.color) {
                   case 'red':
                       icon = '../res/img/mark_bs/mark_bs10.png';
                       break;
                   case 'yellow':
                       icon = '../res/img/mark_bs/mark_bs6.png';
                       break;
                   case 'green':
                       icon = '../res/img/mark_bs/mark_bs7.png';
                       break;
                   default:
                       icon = '';
               }
               var marker = new AMap.Marker({
                   icon: icon,
                   position: [point.longitude, point.latitude],
                   map: map,
                   extData: point
               });
               // 将marker点 添加到数组
               mapMarkers.push(marker);
               return marker;
           };
           // 打多个点
           this.addMarkers = function(map, points) {
               var markers = [];
               var context = this;
               points.forEach(function(point) {
                   var marker = context.addMarker(map, point);
                   markers.push(marker);
               });
               return markers;
           };
           //打点 并 设置显示范围
           this.addMarkersAndsetBound = function(map, points) {
               // 过滤出有经纬度的点
               points = points.filter(function(v) {
                   return v.longitude && v.latitude;
               });
               // 先清空地图上的marker点 再清空mapMarkers
               map.remove(mapMarkers);
               mapMarkers = [];
               this.addMarkers(map, points);
               this.setMapBounds(map, points);
           };
           // 添加图片覆盖物
           this.addGroundImage = function(map, imageUrl, blPosition, trPosition) {
               if (!blPosition || !trPosition) {
                   console.log('该项目没有blposition,trPosition')
                   return;
               }
               var pointStart = new AMap.LngLat(blPosition.split(',')[0], blPosition.split(',')[1]);
               var pointEnd = new AMap.LngLat(trPosition.split(',')[0], trPosition.split(',')[1]);
               var bounds = new AMap.Bounds(pointStart, pointEnd);
               // 设置地图显示范围
               map.setBounds(bounds);
               // 添加图片覆盖物
               var groundImage = new AMap.GroundImage(imageUrl, bounds, {
                   map: map
               });
               return groundImage;
           };
       }]);

       app.service('eqMonit.multi.httpService', ['$http', '$q', 'fac', function($http, $q, fac) {
           var parkTreeUrl = '/ovu-base/system/park/tree.do', // 项目树 url
               allDetailUrl = '/ovu-base/system/park/listByGrid.do', // 所有的项目数据
               filterDetailUrl = '/ovu-base/system/park/listByGrid2.do', // 过滤项目数据 按照 城市 或者 项目筛选数据
               eqStatusUrl = '/ovu-pcos/pcos/equipment/listEquipStatus.do', // 设备状态统计
               eqFaultNumUrl = '/ovu-pcos/pcos/equipment/listExpEquipNum.do'; // 设备故障统计

           //获取项目树
           this.getParkTree = function() {
               return $http.get(parkTreeUrl);
           };
           //获取所有的项目数据
           this.fetchAll = function() {
               return $http.post(allDetailUrl, {
                   isGroup: fac.isGroupVersion()
               }, fac.postConfig)

               .then(function(res) {
                   return $http.post(allDetailUrl, {
                       isGroup: fac.isGroupVersion(),
                       pageSize: res.data.totalCount || 5
                   }, fac.postConfig);
               });

           };
           // 根据城市名 /项目名 获取项目数据
           this.fetchByCity = function(cityId) {
               return $http.post(filterDetailUrl, {
                   isGroup: fac.isGroupVersion(),
                   id: cityId
               }, fac.postConfig)

               .then(function(res) {
                   return $http.post(filterDetailUrl, {
                       isGroup: fac.isGroupVersion(),
                       id: cityId,
                       pageSize: res.data.totalCount || 5
                   }, fac.postConfig);
               });
           };

           // 获取设备状态统计信息
           this.fetchEqStatus = function() {
               return $http.post(eqStatusUrl, {
                   isGroup: fac.isGroupVersion()
               }, fac.postConfig);
           };

           // 获取设备故障统计数据
           this.fetchEqFaultNum = function() {
               return $http.post(eqFaultNumUrl, {
                   isGroup: fac.isGroupVersion()
               }, fac.postConfig);
           };

       }]);

       app.factory('eqMonit.cities', function() {
           function isInCities(value) {
               value = value.slice(0, 2) + '市';
               console.log('slice........');
               console.log(value);
               return this.data.some(function(v) {
                   return v.city === value;
               });
           }
           return {
               data: [{ "id": "2", "city": "\u5317\u4eac\u5e02", "parent": "1" }, { "id": "19", "city": "\u5929\u6d25\u5e02", "parent": "1" }, { "id": "37", "city": "\u77f3\u5bb6\u5e84\u5e02", "parent": "36" }, { "id": "61", "city": "\u5510\u5c71\u5e02", "parent": "36" }, { "id": "77", "city": "\u79e6\u7687\u5c9b\u5e02", "parent": "36" }, { "id": "86", "city": "\u90af\u90f8\u5e02", "parent": "36" }, { "id": "107", "city": "\u90a2\u53f0\u5e02", "parent": "36" }, { "id": "128", "city": "\u4fdd\u5b9a\u5e02", "parent": "36" }, { "id": "155", "city": "\u5f20\u5bb6\u53e3\u5e02", "parent": "36" }, { "id": "174", "city": "\u627f\u5fb7\u5e02", "parent": "36" }, { "id": "187", "city": "\u6ca7\u5dde\u5e02", "parent": "36" }, { "id": "205", "city": "\u5eca\u574a\u5e02", "parent": "36" }, { "id": "217", "city": "\u8861\u6c34\u5e02", "parent": "36" }, { "id": "231", "city": "\u592a\u539f\u5e02", "parent": "230" }, { "id": "243", "city": "\u5927\u540c\u5e02", "parent": "230" }, { "id": "256", "city": "\u9633\u6cc9\u5e02", "parent": "230" }, { "id": "263", "city": "\u957f\u6cbb\u5e02", "parent": "230" }, { "id": "278", "city": "\u664b\u57ce\u5e02", "parent": "230" }, { "id": "286", "city": "\u6714\u5dde\u5e02", "parent": "230" }, { "id": "294", "city": "\u664b\u4e2d\u5e02", "parent": "230" }, { "id": "307", "city": "\u8fd0\u57ce\u5e02", "parent": "230" }, { "id": "322", "city": "\u5ffb\u5dde\u5e02", "parent": "230" }, { "id": "338", "city": "\u4e34\u6c7e\u5e02", "parent": "230" }, { "id": "357", "city": "\u5415\u6881\u5e02", "parent": "230" }, { "id": "373", "city": "\u547c\u548c\u6d69\u7279\u5e02", "parent": "372" }, { "id": "384", "city": "\u5305\u5934\u5e02", "parent": "372" }, { "id": "395", "city": "\u4e4c\u6d77\u5e02", "parent": "372" }, { "id": "400", "city": "\u8d64\u5cf0\u5e02", "parent": "372" }, { "id": "414", "city": "\u901a\u8fbd\u5e02", "parent": "372" }, { "id": "424", "city": "\u9102\u5c14\u591a\u65af\u5e02", "parent": "372" }, { "id": "434", "city": "\u547c\u4f26\u8d1d\u5c14\u5e02", "parent": "372" }, { "id": "450", "city": "\u5df4\u5f66\u6dd6\u5c14\u5e02", "parent": "372" }, { "id": "459", "city": "\u4e4c\u5170\u5bdf\u5e03\u5e02", "parent": "372" }, { "id": "472", "city": "\u5174\u5b89\u76df", "parent": "372" }, { "id": "479", "city": "\u9521\u6797\u90ed\u52d2\u76df", "parent": "372" }, { "id": "492", "city": "\u963f\u62c9\u5584\u76df", "parent": "372" }, { "id": "497", "city": "\u6c88\u9633\u5e02", "parent": "496" }, { "id": "512", "city": "\u5927\u8fde\u5e02", "parent": "496" }, { "id": "524", "city": "\u978d\u5c71\u5e02", "parent": "496" }, { "id": "533", "city": "\u629a\u987a\u5e02", "parent": "496" }, { "id": "542", "city": "\u672c\u6eaa\u5e02", "parent": "496" }, { "id": "550", "city": "\u4e39\u4e1c\u5e02", "parent": "496" }, { "id": "558", "city": "\u9526\u5dde\u5e02", "parent": "496" }, { "id": "567", "city": "\u8425\u53e3\u5e02", "parent": "496" }, { "id": "575", "city": "\u961c\u65b0\u5e02", "parent": "496" }, { "id": "584", "city": "\u8fbd\u9633\u5e02", "parent": "496" }, { "id": "593", "city": "\u76d8\u9526\u5e02", "parent": "496" }, { "id": "599", "city": "\u94c1\u5cad\u5e02", "parent": "496" }, { "id": "608", "city": "\u671d\u9633\u5e02", "parent": "496" }, { "id": "617", "city": "\u846b\u82a6\u5c9b\u5e02", "parent": "496" }, { "id": "626", "city": "\u957f\u6625\u5e02", "parent": "625" }, { "id": "638", "city": "\u5409\u6797\u5e02", "parent": "625" }, { "id": "649", "city": "\u56db\u5e73\u5e02", "parent": "625" }, { "id": "657", "city": "\u8fbd\u6e90\u5e02", "parent": "625" }, { "id": "663", "city": "\u901a\u5316\u5e02", "parent": "625" }, { "id": "672", "city": "\u767d\u5c71\u5e02", "parent": "625" }, { "id": "680", "city": "\u677e\u539f\u5e02", "parent": "625" }, { "id": "687", "city": "\u767d\u57ce\u5e02", "parent": "625" }, { "id": "694", "city": "\u5ef6\u8fb9\u671d\u9c9c\u65cf\u81ea\u6cbb\u5dde", "parent": "625" }, { "id": "704", "city": "\u54c8\u5c14\u6ee8\u5e02", "parent": "703" }, { "id": "724", "city": "\u9f50\u9f50\u54c8\u5c14\u5e02", "parent": "703" }, { "id": "742", "city": "\u9e21\u897f\u5e02", "parent": "703" }, { "id": "753", "city": "\u9e64\u5c97\u5e02", "parent": "703" }, { "id": "763", "city": "\u53cc\u9e2d\u5c71\u5e02", "parent": "703" }, { "id": "773", "city": "\u5927\u5e86\u5e02", "parent": "703" }, { "id": "784", "city": "\u4f0a\u6625\u5e02", "parent": "703" }, { "id": "803", "city": "\u4f73\u6728\u65af\u5e02", "parent": "703" }, { "id": "815", "city": "\u4e03\u53f0\u6cb3\u5e02", "parent": "703" }, { "id": "821", "city": "\u7261\u4e39\u6c5f\u5e02", "parent": "703" }, { "id": "833", "city": "\u9ed1\u6cb3\u5e02", "parent": "703" }, { "id": "841", "city": "\u7ee5\u5316\u5e02", "parent": "703" }, { "id": "853", "city": "\u5927\u5174\u5b89\u5cad\u5730\u533a", "parent": "703" }, { "id": "857", "city": "\u4e0a\u6d77\u5e02", "parent": "1" }, { "id": "876", "city": "\u5357\u4eac\u5e02", "parent": "875" }, { "id": "889", "city": "\u65e0\u9521\u5e02", "parent": "875" }, { "id": "899", "city": "\u5f90\u5dde\u5e02", "parent": "875" }, { "id": "911", "city": "\u5e38\u5dde\u5e02", "parent": "875" }, { "id": "920", "city": "\u82cf\u5dde\u5e02", "parent": "875" }, { "id": "931", "city": "\u5357\u901a\u5e02", "parent": "875" }, { "id": "941", "city": "\u8fde\u4e91\u6e2f\u5e02", "parent": "875" }, { "id": "949", "city": "\u6dee\u5b89\u5e02", "parent": "875" }, { "id": "959", "city": "\u76d0\u57ce\u5e02", "parent": "875" }, { "id": "970", "city": "\u626c\u5dde\u5e02", "parent": "875" }, { "id": "978", "city": "\u9547\u6c5f\u5e02", "parent": "875" }, { "id": "986", "city": "\u6cf0\u5dde\u5e02", "parent": "875" }, { "id": "994", "city": "\u5bbf\u8fc1\u5e02", "parent": "875" }, { "id": "1002", "city": "\u676d\u5dde\u5e02", "parent": "1001" }, { "id": "1017", "city": "\u5b81\u6ce2\u5e02", "parent": "1001" }, { "id": "1030", "city": "\u6e29\u5dde\u5e02", "parent": "1001" }, { "id": "1043", "city": "\u5609\u5174\u5e02", "parent": "1001" }, { "id": "1052", "city": "\u6e56\u5dde\u5e02", "parent": "1001" }, { "id": "1059", "city": "\u7ecd\u5174\u5e02", "parent": "1001" }, { "id": "1067", "city": "\u91d1\u534e\u5e02", "parent": "1001" }, { "id": "1078", "city": "\u8862\u5dde\u5e02", "parent": "1001" }, { "id": "1086", "city": "\u821f\u5c71\u5e02", "parent": "1001" }, { "id": "1092", "city": "\u53f0\u5dde\u5e02", "parent": "1001" }, { "id": "1103", "city": "\u4e3d\u6c34\u5e02", "parent": "1001" }, { "id": "1115", "city": "\u5408\u80a5\u5e02", "parent": "1114" }, { "id": "1126", "city": "\u829c\u6e56\u5e02", "parent": "1114" }, { "id": "1136", "city": "\u868c\u57e0\u5e02", "parent": "1114" }, { "id": "1145", "city": "\u6dee\u5357\u5e02", "parent": "1114" }, { "id": "1153", "city": "\u9a6c\u978d\u5c71\u5e02", "parent": "1114" }, { "id": "1161", "city": "\u6dee\u5317\u5e02", "parent": "1114" }, { "id": "1167", "city": "\u94dc\u9675\u5e02", "parent": "1114" }, { "id": "1173", "city": "\u5b89\u5e86\u5e02", "parent": "1114" }, { "id": "1186", "city": "\u9ec4\u5c71\u5e02", "parent": "1114" }, { "id": "1195", "city": "\u6ec1\u5dde\u5e02", "parent": "1114" }, { "id": "1205", "city": "\u961c\u9633\u5e02", "parent": "1114" }, { "id": "1215", "city": "\u5bbf\u5dde\u5e02", "parent": "1114" }, { "id": "1222", "city": "\u516d\u5b89\u5e02", "parent": "1114" }, { "id": "1231", "city": "\u4eb3\u5dde\u5e02", "parent": "1114" }, { "id": "1237", "city": "\u6c60\u5dde\u5e02", "parent": "1114" }, { "id": "1243", "city": "\u5ba3\u57ce\u5e02", "parent": "1114" }, { "id": "1253", "city": "\u798f\u5dde\u5e02", "parent": "1252" }, { "id": "1268", "city": "\u53a6\u95e8\u5e02", "parent": "1252" }, { "id": "1276", "city": "\u8386\u7530\u5e02", "parent": "1252" }, { "id": "1283", "city": "\u4e09\u660e\u5e02", "parent": "1252" }, { "id": "1297", "city": "\u6cc9\u5dde\u5e02", "parent": "1252" }, { "id": "1311", "city": "\u6f33\u5dde\u5e02", "parent": "1252" }, { "id": "1324", "city": "\u5357\u5e73\u5e02", "parent": "1252" }, { "id": "1336", "city": "\u9f99\u5ca9\u5e02", "parent": "1252" }, { "id": "1345", "city": "\u5b81\u5fb7\u5e02", "parent": "1252" }, { "id": "1357", "city": "\u5357\u660c\u5e02", "parent": "1356" }, { "id": "1368", "city": "\u666f\u5fb7\u9547\u5e02", "parent": "1356" }, { "id": "1374", "city": "\u840d\u4e61\u5e02", "parent": "1356" }, { "id": "1381", "city": "\u4e5d\u6c5f\u5e02", "parent": "1356" }, { "id": "1396", "city": "\u65b0\u4f59\u5e02", "parent": "1356" }, { "id": "1400", "city": "\u9e70\u6f6d\u5e02", "parent": "1356" }, { "id": "1405", "city": "\u8d63\u5dde\u5e02", "parent": "1356" }, { "id": "1425", "city": "\u5409\u5b89\u5e02", "parent": "1356" }, { "id": "1440", "city": "\u5b9c\u6625\u5e02", "parent": "1356" }, { "id": "1452", "city": "\u629a\u5dde\u5e02", "parent": "1356" }, { "id": "1465", "city": "\u4e0a\u9976\u5e02", "parent": "1356" }, { "id": "1480", "city": "\u6d4e\u5357\u5e02", "parent": "1479" }, { "id": "1492", "city": "\u9752\u5c9b\u5e02", "parent": "1479" }, { "id": "1504", "city": "\u6dc4\u535a\u5e02", "parent": "1479" }, { "id": "1514", "city": "\u67a3\u5e84\u5e02", "parent": "1479" }, { "id": "1522", "city": "\u4e1c\u8425\u5e02", "parent": "1479" }, { "id": "1529", "city": "\u70df\u53f0\u5e02", "parent": "1479" }, { "id": "1543", "city": "\u6f4d\u574a\u5e02", "parent": "1479" }, { "id": "1557", "city": "\u6d4e\u5b81\u5e02", "parent": "1479" }, { "id": "1570", "city": "\u6cf0\u5b89\u5e02", "parent": "1479" }, { "id": "1578", "city": "\u5a01\u6d77\u5e02", "parent": "1479" }, { "id": "1584", "city": "\u65e5\u7167\u5e02", "parent": "1479" }, { "id": "1590", "city": "\u83b1\u829c\u5e02", "parent": "1479" }, { "id": "1594", "city": "\u4e34\u6c82\u5e02", "parent": "1479" }, { "id": "1608", "city": "\u5fb7\u5dde\u5e02", "parent": "1479" }, { "id": "1621", "city": "\u804a\u57ce\u5e02", "parent": "1479" }, { "id": "1631", "city": "\u6ee8\u5dde\u5e02", "parent": "1479" }, { "id": "1640", "city": "\u83cf\u6cfd\u5e02", "parent": "1479" }, { "id": "1652", "city": "\u90d1\u5dde\u5e02", "parent": "1651" }, { "id": "1666", "city": "\u5f00\u5c01\u5e02", "parent": "1651" }, { "id": "1677", "city": "\u6d1b\u9633\u5e02", "parent": "1651" }, { "id": "1694", "city": "\u5e73\u9876\u5c71\u5e02", "parent": "1651" }, { "id": "1706", "city": "\u5b89\u9633\u5e02", "parent": "1651" }, { "id": "1717", "city": "\u9e64\u58c1\u5e02", "parent": "1651" }, { "id": "1724", "city": "\u65b0\u4e61\u5e02", "parent": "1651" }, { "id": "1738", "city": "\u7126\u4f5c\u5e02", "parent": "1651" }, { "id": "1750", "city": "\u6fee\u9633\u5e02", "parent": "1651" }, { "id": "1758", "city": "\u8bb8\u660c\u5e02", "parent": "1651" }, { "id": "1766", "city": "\u6f2f\u6cb3\u5e02", "parent": "1651" }, { "id": "1773", "city": "\u4e09\u95e8\u5ce1\u5e02", "parent": "1651" }, { "id": "1781", "city": "\u5357\u9633\u5e02", "parent": "1651" }, { "id": "1796", "city": "\u5546\u4e18\u5e02", "parent": "1651" }, { "id": "1807", "city": "\u4fe1\u9633\u5e02", "parent": "1651" }, { "id": "1819", "city": "\u5468\u53e3\u5e02", "parent": "1651" }, { "id": "1831", "city": "\u9a7b\u9a6c\u5e97\u5e02", "parent": "1651" }, { "id": "1843", "city": "\u7701\u76f4\u8f96\u53bf\u7ea7\u884c\u653f\u533a\u5212", "parent": "1651" }, { "id": "1846", "city": "\u6b66\u6c49\u5e02", "parent": "1845" }, { "id": "1861", "city": "\u9ec4\u77f3\u5e02", "parent": "1845" }, { "id": "1869", "city": "\u5341\u5830\u5e02", "parent": "1845" }, { "id": "1879", "city": "\u5b9c\u660c\u5e02", "parent": "1845" }, { "id": "1894", "city": "\u8944\u9633\u5e02", "parent": "1845" }, { "id": "1905", "city": "\u9102\u5dde\u5e02", "parent": "1845" }, { "id": "1910", "city": "\u8346\u95e8\u5e02", "parent": "1845" }, { "id": "1917", "city": "\u5b5d\u611f\u5e02", "parent": "1845" }, { "id": "1926", "city": "\u8346\u5dde\u5e02", "parent": "1845" }, { "id": "1936", "city": "\u9ec4\u5188\u5e02", "parent": "1845" }, { "id": "1948", "city": "\u54b8\u5b81\u5e02", "parent": "1845" }, { "id": "1956", "city": "\u968f\u5dde\u5e02", "parent": "1845" }, { "id": "1961", "city": "\u6069\u65bd\u571f\u5bb6\u65cf\u82d7\u65cf\u81ea\u6cbb\u5dde", "parent": "1845" }, { "id": "1970", "city": "\u7701\u76f4\u8f96\u53bf\u7ea7\u884c\u653f\u533a\u5212", "parent": "1845" }, { "id": "1976", "city": "\u957f\u6c99\u5e02", "parent": "1975" }, { "id": "1987", "city": "\u682a\u6d32\u5e02", "parent": "1975" }, { "id": "1998", "city": "\u6e58\u6f6d\u5e02", "parent": "1975" }, { "id": "2005", "city": "\u8861\u9633\u5e02", "parent": "1975" }, { "id": "2019", "city": "\u90b5\u9633\u5e02", "parent": "1975" }, { "id": "2033", "city": "\u5cb3\u9633\u5e02", "parent": "1975" }, { "id": "2044", "city": "\u5e38\u5fb7\u5e02", "parent": "1975" }, { "id": "2055", "city": "\u5f20\u5bb6\u754c\u5e02", "parent": "1975" }, { "id": "2061", "city": "\u76ca\u9633\u5e02", "parent": "1975" }, { "id": "2069", "city": "\u90f4\u5dde\u5e02", "parent": "1975" }, { "id": "2082", "city": "\u6c38\u5dde\u5e02", "parent": "1975" }, { "id": "2095", "city": "\u6000\u5316\u5e02", "parent": "1975" }, { "id": "2109", "city": "\u5a04\u5e95\u5e02", "parent": "1975" }, { "id": "2116", "city": "\u6e58\u897f\u571f\u5bb6\u65cf\u82d7\u65cf\u81ea\u6cbb\u5dde", "parent": "1975" }, { "id": "2126", "city": "\u5e7f\u5dde\u5e02", "parent": "2125" }, { "id": "2139", "city": "\u97f6\u5173\u5e02", "parent": "2125" }, { "id": "2151", "city": "\u6df1\u5733\u5e02", "parent": "2125" }, { "id": "2159", "city": "\u73e0\u6d77\u5e02", "parent": "2125" }, { "id": "2164", "city": "\u6c55\u5934\u5e02", "parent": "2125" }, { "id": "2173", "city": "\u4f5b\u5c71\u5e02", "parent": "2125" }, { "id": "2180", "city": "\u6c5f\u95e8\u5e02", "parent": "2125" }, { "id": "2189", "city": "\u6e5b\u6c5f\u5e02", "parent": "2125" }, { "id": "2200", "city": "\u8302\u540d\u5e02", "parent": "2125" }, { "id": "2207", "city": "\u8087\u5e86\u5e02", "parent": "2125" }, { "id": "2217", "city": "\u60e0\u5dde\u5e02", "parent": "2125" }, { "id": "2224", "city": "\u6885\u5dde\u5e02", "parent": "2125" }, { "id": "2234", "city": "\u6c55\u5c3e\u5e02", "parent": "2125" }, { "id": "2240", "city": "\u6cb3\u6e90\u5e02", "parent": "2125" }, { "id": "2248", "city": "\u9633\u6c5f\u5e02", "parent": "2125" }, { "id": "2254", "city": "\u6e05\u8fdc\u5e02", "parent": "2125" }, { "id": "2264", "city": "\u4e1c\u839e\u5e02", "parent": "2125" }, { "id": "2265", "city": "\u4e2d\u5c71\u5e02", "parent": "2125" }, { "id": "2266", "city": "\u6f6e\u5dde\u5e02", "parent": "2125" }, { "id": "2271", "city": "\u63ed\u9633\u5e02", "parent": "2125" }, { "id": "2278", "city": "\u4e91\u6d6e\u5e02", "parent": "2125" }, { "id": "2286", "city": "\u5357\u5b81\u5e02", "parent": "2285" }, { "id": "2300", "city": "\u67f3\u5dde\u5e02", "parent": "2285" }, { "id": "2312", "city": "\u6842\u6797\u5e02", "parent": "2285" }, { "id": "2331", "city": "\u68a7\u5dde\u5e02", "parent": "2285" }, { "id": "2340", "city": "\u5317\u6d77\u5e02", "parent": "2285" }, { "id": "2346", "city": "\u9632\u57ce\u6e2f\u5e02", "parent": "2285" }, { "id": "2352", "city": "\u94a6\u5dde\u5e02", "parent": "2285" }, { "id": "2358", "city": "\u8d35\u6e2f\u5e02", "parent": "2285" }, { "id": "2365", "city": "\u7389\u6797\u5e02", "parent": "2285" }, { "id": "2374", "city": "\u767e\u8272\u5e02", "parent": "2285" }, { "id": "2388", "city": "\u8d3a\u5dde\u5e02", "parent": "2285" }, { "id": "2395", "city": "\u6cb3\u6c60\u5e02", "parent": "2285" }, { "id": "2408", "city": "\u6765\u5bbe\u5e02", "parent": "2285" }, { "id": "2416", "city": "\u5d07\u5de6\u5e02", "parent": "2285" }, { "id": "2426", "city": "\u6d77\u53e3\u5e02", "parent": "2425" }, { "id": "2432", "city": "\u4e09\u4e9a\u5e02", "parent": "2425" }, { "id": "2438", "city": "\u4e09\u6c99\u5e02", "parent": "2425" }, { "id": "2442", "city": "\u7701\u76f4\u8f96\u53bf\u7ea7\u884c\u653f\u533a\u5212", "parent": "2425" }, { "id": "2459", "city": "\u91cd\u5e86\u5e02", "parent": "1" }, { "id": "2499", "city": "\u6210\u90fd\u5e02", "parent": "2498" }, { "id": "2520", "city": "\u81ea\u8d21\u5e02", "parent": "2498" }, { "id": "2528", "city": "\u6500\u679d\u82b1\u5e02", "parent": "2498" }, { "id": "2535", "city": "\u6cf8\u5dde\u5e02", "parent": "2498" }, { "id": "2544", "city": "\u5fb7\u9633\u5e02", "parent": "2498" }, { "id": "2552", "city": "\u7ef5\u9633\u5e02", "parent": "2498" }, { "id": "2563", "city": "\u5e7f\u5143\u5e02", "parent": "2498" }, { "id": "2572", "city": "\u9042\u5b81\u5e02", "parent": "2498" }, { "id": "2579", "city": "\u5185\u6c5f\u5e02", "parent": "2498" }, { "id": "2586", "city": "\u4e50\u5c71\u5e02", "parent": "2498" }, { "id": "2599", "city": "\u5357\u5145\u5e02", "parent": "2498" }, { "id": "2610", "city": "\u7709\u5c71\u5e02", "parent": "2498" }, { "id": "2618", "city": "\u5b9c\u5bbe\u5e02", "parent": "2498" }, { "id": "2630", "city": "\u5e7f\u5b89\u5e02", "parent": "2498" }, { "id": "2638", "city": "\u8fbe\u5dde\u5e02", "parent": "2498" }, { "id": "2647", "city": "\u96c5\u5b89\u5e02", "parent": "2498" }, { "id": "2657", "city": "\u5df4\u4e2d\u5e02", "parent": "2498" }, { "id": "2664", "city": "\u8d44\u9633\u5e02", "parent": "2498" }, { "id": "2670", "city": "\u963f\u575d\u85cf\u65cf\u7f8c\u65cf\u81ea\u6cbb\u5dde", "parent": "2498" }, { "id": "2684", "city": "\u7518\u5b5c\u85cf\u65cf\u81ea\u6cbb\u5dde", "parent": "2498" }, { "id": "2703", "city": "\u51c9\u5c71\u5f5d\u65cf\u81ea\u6cbb\u5dde", "parent": "2498" }, { "id": "2722", "city": "\u8d35\u9633\u5e02", "parent": "2721" }, { "id": "2734", "city": "\u516d\u76d8\u6c34\u5e02", "parent": "2721" }, { "id": "2739", "city": "\u9075\u4e49\u5e02", "parent": "2721" }, { "id": "2755", "city": "\u5b89\u987a\u5e02", "parent": "2721" }, { "id": "2763", "city": "\u6bd5\u8282\u5e02", "parent": "2721" }, { "id": "2773", "city": "\u94dc\u4ec1\u5e02", "parent": "2721" }, { "id": "2785", "city": "\u9ed4\u897f\u5357\u5e03\u4f9d\u65cf\u82d7\u65cf\u81ea\u6cbb\u5dde", "parent": "2721" }, { "id": "2794", "city": "\u9ed4\u4e1c\u5357\u82d7\u65cf\u4f97\u65cf\u81ea\u6cbb\u5dde", "parent": "2721" }, { "id": "2811", "city": "\u9ed4\u5357\u5e03\u4f9d\u65cf\u82d7\u65cf\u81ea\u6cbb\u5dde", "parent": "2721" }, { "id": "2825", "city": "\u6606\u660e\u5e02", "parent": "2824" }, { "id": "2841", "city": "\u66f2\u9756\u5e02", "parent": "2824" }, { "id": "2852", "city": "\u7389\u6eaa\u5e02", "parent": "2824" }, { "id": "2863", "city": "\u4fdd\u5c71\u5e02", "parent": "2824" }, { "id": "2870", "city": "\u662d\u901a\u5e02", "parent": "2824" }, { "id": "2883", "city": "\u4e3d\u6c5f\u5e02", "parent": "2824" }, { "id": "2890", "city": "\u666e\u6d31\u5e02", "parent": "2824" }, { "id": "2902", "city": "\u4e34\u6ca7\u5e02", "parent": "2824" }, { "id": "2912", "city": "\u695a\u96c4\u5f5d\u65cf\u81ea\u6cbb\u5dde", "parent": "2824" }, { "id": "2923", "city": "\u7ea2\u6cb3\u54c8\u5c3c\u65cf\u5f5d\u65cf\u81ea\u6cbb\u5dde", "parent": "2824" }, { "id": "2937", "city": "\u6587\u5c71\u58ee\u65cf\u82d7\u65cf\u81ea\u6cbb\u5dde", "parent": "2824" }, { "id": "2946", "city": "\u897f\u53cc\u7248\u7eb3\u50a3\u65cf\u81ea\u6cbb\u5dde", "parent": "2824" }, { "id": "2950", "city": "\u5927\u7406\u767d\u65cf\u81ea\u6cbb\u5dde", "parent": "2824" }, { "id": "2963", "city": "\u5fb7\u5b8f\u50a3\u65cf\u666f\u9887\u65cf\u81ea\u6cbb\u5dde", "parent": "2824" }, { "id": "2969", "city": "\u6012\u6c5f\u5088\u50f3\u65cf\u81ea\u6cbb\u5dde", "parent": "2824" }, { "id": "2974", "city": "\u8fea\u5e86\u85cf\u65cf\u81ea\u6cbb\u5dde", "parent": "2824" }, { "id": "2979", "city": "\u62c9\u8428\u5e02", "parent": "2978" }, { "id": "2989", "city": "\u65e5\u5580\u5219\u5e02", "parent": "2978" }, { "id": "3009", "city": "\u660c\u90fd\u5e02", "parent": "2978" }, { "id": "3022", "city": "\u5c71\u5357\u5730\u533a", "parent": "2978" }, { "id": "3035", "city": "\u90a3\u66f2\u5730\u533a", "parent": "2978" }, { "id": "3047", "city": "\u963f\u91cc\u5730\u533a", "parent": "2978" }, { "id": "3055", "city": "\u6797\u829d\u5730\u533a", "parent": "2978" }, { "id": "3064", "city": "\u897f\u5b89\u5e02", "parent": "3063" }, { "id": "3079", "city": "\u94dc\u5ddd\u5e02", "parent": "3063" }, { "id": "3085", "city": "\u5b9d\u9e21\u5e02", "parent": "3063" }, { "id": "3099", "city": "\u54b8\u9633\u5e02", "parent": "3063" }, { "id": "3115", "city": "\u6e2d\u5357\u5e02", "parent": "3063" }, { "id": "3128", "city": "\u5ef6\u5b89\u5e02", "parent": "3063" }, { "id": "3143", "city": "\u6c49\u4e2d\u5e02", "parent": "3063" }, { "id": "3156", "city": "\u6986\u6797\u5e02", "parent": "3063" }, { "id": "3170", "city": "\u5b89\u5eb7\u5e02", "parent": "3063" }, { "id": "3182", "city": "\u5546\u6d1b\u5e02", "parent": "3063" }, { "id": "3192", "city": "\u5170\u5dde\u5e02", "parent": "3191" }, { "id": "3202", "city": "\u5609\u5cea\u5173\u5e02", "parent": "3191" }, { "id": "3204", "city": "\u91d1\u660c\u5e02", "parent": "3191" }, { "id": "3208", "city": "\u767d\u94f6\u5e02", "parent": "3191" }, { "id": "3215", "city": "\u5929\u6c34\u5e02", "parent": "3191" }, { "id": "3224", "city": "\u6b66\u5a01\u5e02", "parent": "3191" }, { "id": "3230", "city": "\u5f20\u6396\u5e02", "parent": "3191" }, { "id": "3238", "city": "\u5e73\u51c9\u5e02", "parent": "3191" }, { "id": "3247", "city": "\u9152\u6cc9\u5e02", "parent": "3191" }, { "id": "3256", "city": "\u5e86\u9633\u5e02", "parent": "3191" }, { "id": "3266", "city": "\u5b9a\u897f\u5e02", "parent": "3191" }, { "id": "3275", "city": "\u9647\u5357\u5e02", "parent": "3191" }, { "id": "3286", "city": "\u4e34\u590f\u56de\u65cf\u81ea\u6cbb\u5dde", "parent": "3191" }, { "id": "3295", "city": "\u7518\u5357\u85cf\u65cf\u81ea\u6cbb\u5dde", "parent": "3191" }, { "id": "3305", "city": "\u897f\u5b81\u5e02", "parent": "3304" }, { "id": "3314", "city": "\u6d77\u4e1c\u5e02", "parent": "3304" }, { "id": "3322", "city": "\u6d77\u5317\u85cf\u65cf\u81ea\u6cbb\u5dde", "parent": "3304" }, { "id": "3327", "city": "\u9ec4\u5357\u85cf\u65cf\u81ea\u6cbb\u5dde", "parent": "3304" }, { "id": "3332", "city": "\u6d77\u5357\u85cf\u65cf\u81ea\u6cbb\u5dde", "parent": "3304" }, { "id": "3338", "city": "\u679c\u6d1b\u85cf\u65cf\u81ea\u6cbb\u5dde", "parent": "3304" }, { "id": "3345", "city": "\u7389\u6811\u85cf\u65cf\u81ea\u6cbb\u5dde", "parent": "3304" }, { "id": "3352", "city": "\u6d77\u897f\u8499\u53e4\u65cf\u85cf\u65cf\u81ea\u6cbb\u5dde", "parent": "3304" }, { "id": "3359", "city": "\u94f6\u5ddd\u5e02", "parent": "3358" }, { "id": "3367", "city": "\u77f3\u5634\u5c71\u5e02", "parent": "3358" }, { "id": "3372", "city": "\u5434\u5fe0\u5e02", "parent": "3358" }, { "id": "3379", "city": "\u56fa\u539f\u5e02", "parent": "3358" }, { "id": "3386", "city": "\u4e2d\u536b\u5e02", "parent": "3358" }, { "id": "3392", "city": "\u4e4c\u9c81\u6728\u9f50\u5e02", "parent": "3391" }, { "id": "3402", "city": "\u514b\u62c9\u739b\u4f9d\u5e02", "parent": "3391" }, { "id": "3408", "city": "\u5410\u9c81\u756a\u5730\u533a", "parent": "3391" }, { "id": "3412", "city": "\u54c8\u5bc6\u5730\u533a", "parent": "3391" }, { "id": "3416", "city": "\u660c\u5409\u56de\u65cf\u81ea\u6cbb\u5dde", "parent": "3391" }, { "id": "3424", "city": "\u535a\u5c14\u5854\u62c9\u8499\u53e4\u81ea\u6cbb\u5dde", "parent": "3391" }, { "id": "3429", "city": "\u5df4\u97f3\u90ed\u695e\u8499\u53e4\u81ea\u6cbb\u5dde", "parent": "3391" }, { "id": "3439", "city": "\u963f\u514b\u82cf\u5730\u533a", "parent": "3391" }, { "id": "3449", "city": "\u514b\u5b5c\u52d2\u82cf\u67ef\u5c14\u514b\u5b5c\u81ea\u6cbb\u5dde", "parent": "3391" }, { "id": "3454", "city": "\u5580\u4ec0\u5730\u533a", "parent": "3391" }, { "id": "3467", "city": "\u548c\u7530\u5730\u533a", "parent": "3391" }, { "id": "3476", "city": "\u4f0a\u7281\u54c8\u8428\u514b\u81ea\u6cbb\u5dde", "parent": "3391" }, { "id": "3504", "city": "\u81ea\u6cbb\u533a\u76f4\u8f96\u53bf\u7ea7\u884c\u653f\u533a\u5212", "parent": "3391" }, { "id": "3513", "city": "\u53f0\u5317\u5e02", "parent": "3512" }, { "id": "3526", "city": "\u9ad8\u96c4\u5e02", "parent": "3512" }, { "id": "3565", "city": "\u57fa\u9686\u5e02", "parent": "3512" }, { "id": "3573", "city": "\u53f0\u4e2d\u5e02", "parent": "3512" }, { "id": "3603", "city": "\u53f0\u5357\u5e02", "parent": "3512" }, { "id": "3641", "city": "\u65b0\u7af9\u5e02", "parent": "3512" }, { "id": "3645", "city": "\u5609\u4e49\u5e02", "parent": "3512" }, { "id": "3648", "city": "\u65b0\u5317\u5e02", "parent": "3512" }, { "id": "3678", "city": "\u5b9c\u5170\u53bf", "parent": "3512" }, { "id": "3691", "city": "\u6843\u56ed\u53bf", "parent": "3512" }, { "id": "3705", "city": "\u65b0\u7af9\u53bf", "parent": "3512" }, { "id": "3719", "city": "\u82d7\u6817\u53bf", "parent": "3512" }, { "id": "3738", "city": "\u5f70\u5316\u53bf", "parent": "3512" }, { "id": "3765", "city": "\u5357\u6295\u53bf", "parent": "3512" }, { "id": "3779", "city": "\u4e91\u6797\u53bf", "parent": "3512" }, { "id": "3800", "city": "\u5609\u4e49\u53bf", "parent": "3512" }, { "id": "3819", "city": "\u5c4f\u4e1c\u53bf", "parent": "3512" }, { "id": "3853", "city": "\u53f0\u4e1c\u53bf", "parent": "3512" }, { "id": "3870", "city": "\u82b1\u83b2\u53bf", "parent": "3512" }, { "id": "3884", "city": "\u6f8e\u6e56\u53bf", "parent": "3512" }, { "id": "3892", "city": "\u9999\u6e2f\u5c9b", "parent": "3891" }, { "id": "3897", "city": "\u4e5d\u9f99", "parent": "3891" }, { "id": "3903", "city": "\u65b0\u754c", "parent": "3891" }, { "id": "3914", "city": "\u6fb3\u95e8\u534a\u5c9b", "parent": "3913" }, { "id": "3920", "city": "\u6c39\u4ed4\u5c9b", "parent": "3913" }, { "id": "3922", "city": "\u8def\u73af\u5c9b", "parent": "3913" }],
               isInCities: isInCities,
           };
       });

       //    angular.bootstrap(document.getElementById("angularId"), ['angularApp']);
   })(angular, document);