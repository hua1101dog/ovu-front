/**
 * Created by wangheng
 * 门户地图
 */
(function() {
	"use strict";
	var app = angular.module("app");

	app.controller('portalCtrl', portalCtrl);
	portalCtrl.$inject = ['$scope', '$http', '$state', '$timeout', 'AppService'];

	function portalCtrl($scope, $http, $state, $timeout, AppService) {
		var vm = this;
		/*042010601112046*/
		var parkNo = [
		    '03401110001HFJR',
            '04201110001CYTD',
            '04201030002GGRJY',
            '04201030002GGJRG',
            '04201030002WHYCZX',
            '04201030002SWCCXJD',
            '04201030002GKYYQXY',
            '04201030002WLKJCQB',
            '04201030002QDGJHY',
            '04201030002QDHYKJ',
            '04201030002SYLHKJ',
            '04201030002HSLHKJ',
            '04201030002EZLHKJ',
            '04201030002HGLHKJ',
            '04201030002CECXX',
            '04603000001HNST',
            '04505000001BHCY',
            '04505000001BHXX',
            '05101000001CDXG',
            '03303000001WZXX',
            '04301040001ZSRJ'
        ];

		//地图基本配置
		vm.mapOptions = {
			uiMapCache: false,
			zoom: 5,
			liteStyle: true,
			mapStyle: 'amap://styles/darkblue',
			center: [105.76364, 36.064211]
		};

        //地图标记点覆盖事件
        vm.mouseoverMaker = function($event,$params,marker){
            // debugger;
            vm.markerData = marker.getExtData();
            //console.log(vm.markerData);
            if(vm.markerData.num){
                vm.markerData.PARK_NAME = vm.markerData.CITY + ":" + vm.markerData.num + "个项目";
            }else{
                vm.markerData.PARK_NAME = vm.markerData.PARK_NAME;
            }
            vm.myInfoWindow.open(vm.map, marker.getPosition());
        }

        // 监听地图的变化
        $scope.$watch("vm.map",function () {
            vm.map.on('zoomend', function(e) {
                if(vm.map.getZoom() < 8){
                    vm.map.clearMap();
                    $http.get('/ovu-screen-fake/pcos/showbigmap/parkmap/list',{params: {parkNo:parkNo}}).success(function (rep) {
                        if(rep.success) {
                            var data = rep.data;
                            // console.log(data);
                            var markers = [];
                            data && data.forEach(function (park) {
                                if (park.CITY == '武汉市') {
                                    var item = {'num':'7','MAP_LNG':"114.31667","MAP_LAT":"30.51667","CITY":"武汉"};
                                    var marker = addMarker(item);
                                    if(markers.indexOf(marker) >= 0){
                                        return
                                    }else{
                                        markers.push(marker);
                                    }
                                } else if(park.CITY == '青岛市'){
                                    var item = {'num':'2','MAP_LNG':"120.3126430000","MAP_LAT":"36.0649320000","CITY":"青岛"};
                                    var marker = addMarker(item);
                                    if(markers.indexOf(marker) >= 0){
                                        return
                                    }else{
                                        markers.push(marker);
                                    }
                                } else if(park.CITY == '广西壮族自治区,北海市'){
                                    var item = {'num':'2','MAP_LNG':"109.131142 ","MAP_LAT":"21.471945","CITY":"北海"};
                                    var marker = addMarker(item);
                                    if(markers.indexOf(marker) >= 0){
                                        return
                                    }else{
                                        markers.push(marker);
                                    }
                                }else {
                                    var marker = addMarker(park);
                                    markers.push(marker);
                                }
                            })
                            vm.markers = markers;
                        }
                    });
                }
                if(vm.map.getZoom() > 7 ){
                    vm.map.clearMap();

                    //查询城市内的项目点
                    $http.get('/ovu-screen-fake/pcos/showbigmap/parkmap/list',{params: {parkNo:parkNo}}).success(function (rep) {
                            if(rep.success){
                                var data = rep.data;
                                var markers=[];
                                data && data.forEach(function (park) {
                                    var marker = addMarker(park);
                                    markers.push(marker);
                                })
                                vm.markers=markers;
                            }
                        })
                }
            });

        })

		    //地图标记点点击事件
        vm.clickMap = function($event,$params,marker){
            // debugger;
            var temp = marker.getExtData();
            console.log(temp);

            if(temp.num){
                vm.map.setZoomAndCenter(8,[temp.MAP_LNG,temp.MAP_LAT]);
            } else if(temp.PARK_NO == '04603000001HNST' ||temp.PARK_NO == '04505000001BHCY' ||temp.PARK_NO == '04505000001BHXX' ||temp.PARK_NO == '05101000001CDXG' ||temp.PARK_NO == '03303000001WZXX' || temp.PARK_NO == '04201030002QDHYKJ'|| temp.PARK_NO == '04201030002CECXX'){
                return;
            } else{
                // 判断是否是前两个项目 确定另外三个按钮是否可点
                var judge={};
                if(temp.PARK_NO=='04201110001CYTD'||temp.PARK_NO=='03401110001HFJR'){
                    judge = {operate:false,facility:false,company:false,safe:false};
                }else if(temp.PARK_NO=='04301040001ZSRJ'){
                    judge = {operate:false,facility:false,company:false,safe:true};
                } else{
                    judge = {operate:false,facility:true,company:true,safe:true};
                }
                //存在session
                $http.get('/ovu-screen-fake/pcos/show/park/get.do',{params: {parkNo:temp.PARK_NO}});
                var parkName = temp.PARK_NAME;
                var park ={judge:judge,parkNo:temp.PARK_NO,parkName:temp.PARK_NAME,fmapId:temp.FMAP_ID,logo:temp.PARK_LOGO,bg:temp.PARK_BG};
                AppService.parkNo = park.parkNo;
                AppService.park = park;
                debugger
                //存到会话中
                sessionStorage.park = JSON.stringify(park);
                $state.go('home');

            }
        }

		    //地图标点接口(接口完成后重新开放)
        $http.get('/ovu-screen-fake/pcos/showbigmap/parkmap/list',{params: {parkNo:parkNo}}).success(function (rep) {
            if(rep.success) {
                var data = rep.data;
                // console.log(data);
                var markers = [];
                data && data.forEach(function (park) {
                    if (park.CITY == '武汉市') {
                        var item = {'num':'7','MAP_LNG':"114.31667","MAP_LAT":"30.51667","CITY":"武汉"};
                        var marker = addMarker(item);
                        if(markers.indexOf(marker) >= 0){
                            return
                        }else{
                            markers.push(marker);
                        }
                    } else if(park.CITY == '青岛市'){
                        var item = {'num':'2','MAP_LNG':"120.3126430000","MAP_LAT":"36.0649320000","CITY":"青岛"};
                        var marker = addMarker(item);
                        if(markers.indexOf(marker) >= 0){
                            return
                        }else{
                            markers.push(marker);
                        }
                    }else if(park.CITY == '广西壮族自治区,北海市'){
                        var item = {'num':'2','MAP_LNG':"109.131142 ","MAP_LAT":"21.471945","CITY":"北海"};
                        var marker = addMarker(item);
                        if(markers.indexOf(marker) >= 0){
                            return
                        }else{
                            markers.push(marker);
                        }
                    } else {
                        var marker = addMarker(park);
                        markers.push(marker);
                    }
                })
                vm.markers = markers;
            }
        });

        // 添加标点
		function addMarker(data) {
			var marker = new AMap.Marker({
				position: [data.MAP_LNG, data.MAP_LAT],
				map: vm.map,
				extData: data,
				zIndex: 1000
			});
			return marker;
		}
    }

})();

