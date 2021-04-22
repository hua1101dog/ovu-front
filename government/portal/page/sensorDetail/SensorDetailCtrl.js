/**
 * Created by wangheng on 2017/9/19.
 * 通知
 */
(function() {
    "use strict";
    var app = angular.module("app");

    //设备查询控制器
    app.controller('SensorDetailCtrl', SensorDetailCtrl);
    function SensorDetailCtrl($scope, $http,$state,$stateParams, fac) {
        var vm = this;
        vm.search={};

        if($stateParams.sensorData){
            vm.sensor = $stateParams.sensorData.data;
        }

        vm.find = function(item){
            $http.get("/ovu-pcos/pcos/equipment/get.do?regiCode="+item.regiCode+"&maintainName="+item.maintainName).success(function(data) {
                if(data.success){
                    vm.sensor = data.data;
                }else{
                    alert('请输入正确的查询条件!');
                }
            }).error(function () {
                alert("请输入正确的查询条件!");
            })
        };


    }

})();