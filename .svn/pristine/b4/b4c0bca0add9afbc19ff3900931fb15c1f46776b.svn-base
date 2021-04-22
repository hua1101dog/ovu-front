/**
 * Created by wangheng
 * 运营指标体系》招商指标
 */
(function() {
    "use strict";
    var app = angular.module("app");

    app.controller('activityMainCtrl', activityMainCtrl);
    activityMainCtrl.$inject = ['$scope', '$rootScope', '$http', 'AppService'];

    function activityMainCtrl($scope, $rootScope, $http, AppService) {
        var vm = this;
        vm.title = '园区';
        vm.parkNo = AppService.parkNo;
        vm.type = 'activity';
        //图片索引
        vm.index = 0;
        //图片路径列表
        /* vm.url = ['/show/res/img/home/hf-bg.jpg','/show/res/img/home/cy-bg.jpg'
                 ,'/show/res/img/home/hf-logo.png'];*/

        vm.showDetail = function(id) {
            vm.url = [];
            $http.get("/ovu-screen-fake/pcos/show/activity/info.do", { params: { id: id } }).success(function(rep) {
                vm.url.push('/document/img/3.0/' +id+'/'+rep.POSTER);
                rep.PHOTO.forEach(function(ph) {
                    vm.url.push('/document/img/3.0/' +id+'/'+ ph);
                })
                vm.on = true;
            });

        }

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
        $scope.wheel = function() { wheelzoom(event.target); }


        $http.get("/ovu-screen-fake/pcos/show/activity/list.do", { params: { parkNo: vm.parkNo } }).success(function(rep) {
            vm.list = rep.parkActivitys;
        });
    }

})();
