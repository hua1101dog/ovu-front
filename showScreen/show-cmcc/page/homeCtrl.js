/***
 * 菜单控制器
 * wangheng
 *
 */
/**
 * Created by wangheng
 * 门户地图
 */
(function() {
    "use strict";
    var app = angular.module("app");

    app.controller('homeCtrl', homeCtrl);
    homeCtrl.$inject = ['$scope', '$rootScope','AppService' ,'$http','$state'];

    function homeCtrl($scope,$rootScope, AppService, $http, $state) {
        var vm = this;
        var park = AppService.park;
        $rootScope.logo = park.logo;
        if(park.fmapId == 'hfjrg'){
            vm.bg = {"background-image":"url('/show/res/img/home/hf-bg.jpg')"};
        }else if(park.fmapId == 'ovuhlw'){
            vm.bg = {"background-image":"url('/show/res/img/home/cy-bg.jpg')"};
        }else {
            vm.bg = {"background-image":"url('/show/res/img/home/hf-bg.jpg')"};
        }

        !$rootScope.logo && $state.go('portal');

    }

})();
