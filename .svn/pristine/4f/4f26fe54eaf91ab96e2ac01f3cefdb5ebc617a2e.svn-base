/**
 * Created by wangheng on 2017/8/28.
 */
(function() {
    "use strict";
    var app = angular.module("angularApp");
    app.controller('fireBroadcastCtrl', function ($scope,$rootScope, $http,$filter,$uibModal,$location,fac) {
    	var vm= this;
        document.title ="火警实时播报";
        $scope.pageModel = {};
        vm.list = [];

        app.modulePromiss.then(function(){
            $scope.search = {
                isGroup: fac.isGroupVersion()
            };
            vm.find();
        })

        vm.find = function(){
            $http.post('/ovu-pcos/pcos/fire/broadcast/list').success(function (data) {
                vm.list = data;
            })
        };

        //跳转到单消防点实时监控
        vm.toFireMonitoring = function (firePointId) {
            // $rootScope.firePointId = firePointId;
            // $scope.firePointId=firePointId;
            $location.path('/fire/fireMonitoring').search({firePointId:firePointId});
        }
        //实时播报
        $scope.$on('fireBroadcast',function (event, data) {
            if(data){
                data.forEach(function (da) {
                    vm.list.unshift(da);
                })
            }
        })
        
        
    });

})();