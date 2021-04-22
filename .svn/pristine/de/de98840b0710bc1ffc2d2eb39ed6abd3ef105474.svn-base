/**
 * Created by wangheng on 2017/9/19.
 * 园区安全中心》防盗报警
 */
(function() {
    "use strict";
    var app = angular.module("app");

    app.controller('alarmMainCtrl', alarmMainCtrl);

    function alarmMainCtrl($scope, $http, AppService) {
        var vm = this;
        vm.parkNo = AppService.parkNo;
        var type = 'alarm';
        vm.type = type;



        /*首先查询 园区整体的概况*/
        var param = { parkNo: AppService.parkNo, type: type };
        getCommonRight(param);

        //右侧方法
        function getCommonRight(param) {

            $http.get('/ovu-screen/pcos/show/sensorAlertList.do',{params:{parkNo:  vm.parkNo, type: 'sensor'}}).success(function (result) {
                var data = result.data;
                vm.list = data.filter(function(v) {
                    return v.equip_type == 'gate' || v.equip_type == 'infrared';
                });

            })
          /*  AppService.getEquipList(param).then(function(data) {
                vm.list = data.data.filter(function(item) {
                    return item.sensor_status != 1;
                });
            })*/
        }


    }

})();
