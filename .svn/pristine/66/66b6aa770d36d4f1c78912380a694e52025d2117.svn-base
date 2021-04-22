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

        // 选项卡另外三项不可点
        $rootScope.judge = park.judge;
        vm.bg = {"background-image":"url('/showXW/res/img/home/"+park.bg+"')"};
        !$rootScope.logo && $state.go('portal');
    }
})();
