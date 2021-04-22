/**
 * Created by chenxi on 2018/3/6.
 */
(function () {
    "use strict";
    var app = angular.module("angularApp");
    app.controller('accountCtrl', function ($scope, $rootScope, $http,$location, $filter,fac) {

        document.title = "视频设备台账";
        $http.get("/ovu-camera/pcos/videomanagement/account/count.do").success(function(res){
           $scope.transform=res.transform;
           $scope.imos=res.imos;
           $scope.nvr=res.nvr;
           $scope.media=res.media;
           $scope.camera=res.camera;
           $scope.hardware=res.hardware;
        })
        //硬件台账
        $scope.goHardware = function (url) {
            getUrl(url)
        }
        //摄像机台账
        $scope.goCamera = function (url) {
            getUrl(url)
        }

        //nvr台账
        $scope.goNVR = function (url) {
            getUrl(url)
        }
        //监控服务台账
        $scope.goIMOS = function (url) {
            getUrl(url)
        }
        //转流服务台账
        $scope.goTransform = function (url) {
            getUrl(url);
        }
        //流媒体服务台账
        $scope.goMedia = function (url) {
            getUrl(url)
        }
        function getUrl(url) {
            $location.path('videomanagement/' + url);
        }

    });

})();
