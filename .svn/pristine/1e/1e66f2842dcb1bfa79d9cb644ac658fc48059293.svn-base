/**
 * Created by ghostsf on 2017/11/09.
 * 企业服务中心》配套
 */
(function() {
    "use strict";
    var app = angular.module("app");

    app.controller('matingMainCtrl', matingMainCtrl);

    function matingMainCtrl($scope, $http, $state, AppService) {
        var vm = this;
        vm.parkNo = AppService.parkNo;
        vm.type = 'mating';

        // 右侧 园区配套列表 的 类型
        $scope.listType = function (num) {
            var type;
            if(num == 1){
                type = '餐饮';
            }else if(num == 2){
                type = '零售'
            }else if(num == 3){
                type = '企业服务';
            }else if(num == 4){
                type = '图书';
            }else if(num == 5){
                type = '生活配套';
            }
            return type;
        }

        //进入页面首先查询数据
        $http.get("/ovu-screen-fake/pcos/show/mating/list.do").success(function(rep) {
            if (rep.success) {
                vm.parkingLotList = rep.data;
            }
        });

        $http.get("/ovu-screen-fake/pcos/show/mating/statistics.do").success(function(rep) {
            if (rep.success) {
                vm.datas = rep.data;
            }
        });

        vm.goDetail = function(id) {
            $state.go('app.company.mating.detail', { id: id });
           /* vm.url = [];
            $http.get("/ovu-pcos/pcos/show/mating/get.do", { params: { id: id } }).success(function(resp) {
                if (resp.success && resp.data) {
                    resp.data.scenes.forEach(function(ph) {
                        vm.url.push('/' + ph.url);
                    })
                    vm.on = true;
                }
            });*/
        }


       /* //图片索引
        vm.index = 0;
        //下一张
        vm.next = function() {
            if (vm.index == (vm.url.length - 1)) {
                vm.index = 0
            } else {
                vm.index++;
            }
        }
        //上一张
        vm.last = function() {
            if (vm.index == 0) {
                vm.index = (vm.url.length - 1);
            } else {
                vm.index--;
            }
        }
        //图表滚动拖动方法
        $scope.wheel = function() { wheelzoom(event.target); }*/

    }

    app.controller('matingDetailCtrl', matingDetailCtrl);

    function matingDetailCtrl($scope, $http, $stateParams, AppService) {
        var vm = this;

        // debugger
        $http.get("/ovu-screen-fake/pcos/show/mating/get.do", { params: { id: $stateParams.id } }).success(function(resp) {
            //    debugger
            if (resp.success) {
                vm.detail = resp.data;
            }
        });

    }

})();
