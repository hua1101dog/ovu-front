/**
 * Created by wangheng
 * 门户地图
 */
(function() {
    "use strict";
    var app = angular.module("app");

    app.controller('portalCtrl', portalCtrl);
    portalCtrl.$inject = ['$scope', 'AppService' ,'$http','$state'];

    function portalCtrl($scope, AppService, $http, $state) {
        var vm = this;
        /*042010601112046*/
        var domainId = AppService.domainId;

        //地图基本配置
        vm.mapOptions = {
            // map-self config
            // ui map config
            uiMapCache : false,
            zoom: 11,
            liteStyle:true,
            mapStyle: 'amap://styles/darkblue',
            city:"武汉市"
        };
        // center:[114.30,30.60]

        //地图标记点覆盖事件
        vm.mouseoverMaker = function($event,$params,marker){
            vm.markerData = marker.getExtData();
            vm.myInfoWindow.open(vm.map, marker.getPosition());
        };

        //地图标记点点击事件
        vm.clickMap = function($event,$params,marker){
            var temp = marker.getExtData();
            //存在session
            $http.get('/ovu-screen/pcos/show/park/get.do',{params: {parkNo:temp.PARK_NO}});
            var parkName = temp.PARK_NAME;
            var fmapId;
            var logo;
            /*if(parkName == '合肥金融港'){
                logo ='hf-logo.png';
                fmapId = "hfjrg";
            }else if(parkName == '创意天地'){
                logo ='cy-logo.png';
                fmapId = "ovuhlw";
            }else if(parkName == '丽岛2046') {
                logo ='hf-logo.png';
                fmapId = "10347";
            }*/
            var park ={parkNo:temp.PARK_NO,parkName:temp.PARK_NAME,fmapId:fmapId,logo:logo};
            // AppService.parkNo =park.parkNo;
            AppService.parkNo = '042010600012046';
            AppService.park = park;
            //存到会话中
            sessionStorage.park = JSON.stringify(park);
            $state.go('app.dispatch');
        };

        $http.get('/ovu-screen/pcos/show/park/all.do?domainId='+domainId)
            .success(function (rep) {
                if (rep.success) {
                    var data = rep.data;
                    var markers = [];
                    data && data.forEach(function (park) {
                        var marker = addMarker(park);
                        markers.push(marker);
                    });
                    vm.markers = markers;
                }
            });

        function addMarker(data) {
            var icon = new AMap.Icon({
                image : '/show-cmcc/res/img/icon_map_localize.png'
            });
            var marker = new AMap.Marker({
                position : [data.MAP_LNG,data.MAP_LAT],
                map : vm.map,
                extData:data,
                zIndex: 1000,
                icon:icon
            });
            return marker;
        }
    }

})();
