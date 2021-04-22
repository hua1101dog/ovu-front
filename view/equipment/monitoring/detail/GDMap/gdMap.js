(function (angular, doc, win) {

    var app = angular.module('angularApp');

    app.component('gdMap', {
        templateUrl: '../view/equipment/monitoring/detail/GDMap/view.html',
        bindings: {},
        controller: 'gdMapCtrl'
     });
    app.controller('gdMapCtrl',['$scope', '$http', '$rootScope', '$interval', '$uibModal', '$document', '$q', 'fac','gaodeMapService',function ($scope, $http, $rootScope, $interval, $uibModal, $document, $q, fac, mapService) {

        var gdMap = new AMap.Map('gd-map-container', {
            resizeEnable: true,
            zoom:16,
        });
        var find = function(parkId) {
            var leftDown = parkId.BL_POSITION.split(',');
            var rightUp = parkId.TR_POSITION.split(',');
            var center = mapService.getCenter(leftDown, rightUp);
            gdMap.setCenter(center);
            mapService.createRectPath(leftDown, rightUp, gdMap);
            fac.getPageResult("/ovu-pcos/pcos/equipment/queryByPage.do", {
                pageIndex: 0,
                pageSize: 100,
                parkId: parkId.ID
            }, function(data) {

                var arr = data.data.filter(function(item){
                    return item.latitude_ && item.longitude_;
                });
                var markerItem = [];
                arr.forEach(function (item) {
                    var marker = new AMap.Marker({
                        position: [item.longitude_, item.latitude_],
                        map: gdMap,
                        extData: item,
                        zIndex: 1000,
                        title: item.equipment_name
                    })
                    markerItem.push(marker);
                    var infoWindow = new AMap.InfoWindow({offset: new AMap.Pixel(10, -30)});
                    markerItem.forEach(function (markers) {
                        markers.on('click',function (e) {
                            // var temp = e.target.Xg.extData;
                            // $scope.clickMap(temp)
                            console.log('----------->>>',e)
                            // var infoWindow = new AMap.InfoWindow({
                            //     content: ''+ e.target.G.extData.name,
                            //     offset: new AMap.Pixel(16, -45)
                            // });
                            // infoWindow.open(gdMap, marker.getPosition());
                            infoWindow.setContent(e.target.G.extData.name);
                            infoWindow.open(gdMap, e.target.getPosition());
                        })
                    })
                })

            });
        };

        if(app.park && app.park.BL_POSITION){
            console.log(app.park);
            gdMap.setCenter(app.park.BL_POSITION.split(','));
            find(app.park);
        } else {
            confirm('请选择项目');
        }

        $scope.$on('parkChanged', function(evt, data) {
            if(app.park && app.park.BL_POSITION){
                gdMap.setCenter(app.park.BL_POSITION.split(','));
                find(app.park);
            }

        });
    }]);
    app.service('gaodeMapService', [ function() {

        // 根据左上角 右下角 计算center
        this.getCenter = function(leftDown, rightUp) {
            var centerLng = ((parseFloat(leftDown[0]) + parseFloat(rightUp[0])) / 2).toFixed(6);
            var centerLat = ((parseFloat(leftDown[1]) + parseFloat(rightUp[1])) / 2).toFixed(6);
           return [centerLng, centerLat];
        };

        // 根据左下角 右上角 点 绘制矩形区域
        this.createRectPath = function createRectPath(leftDown, rightUp, map) {
            var southWest = new AMap.LngLat(leftDown[0], leftDown[1]);
            var northEast = new AMap.LngLat(rightUp[0], rightUp[1]);
            var bounds = new AMap.Bounds(southWest, northEast);
            var rectangle = new AMap.Rectangle({
                map: map,
                bounds: bounds,
                strokeColor:'green',
                strokeWeight:10,
                strokeOpacity:0.5,
                strokeDasharray: [30,10],
                strokeStyle: 'solid',
                fillColor:'white',
                fillOpacity:0.5,
                zIndex:10,
                cursor:'pointer',
                bubble: false
            });
            // rectangle.show();
            // rectangle.setMap(map)
        };

    }]);
})(angular, document, window);
