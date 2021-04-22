/**
 * Created by wangheng on 2017/9/19.
 */
(function() {
    "use strict";
    var app = angular.module("app");

    app.controller('liftMainCtl', liftMainCtl);

    liftMainCtl.$inject = ['$scope', '$http', 'AppService'];



    function liftMainCtl($scope, $http, AppService) {

      var vm = this;
      vm.statusList = [
        [0, "待派发"],
        [1, "已派发"],
        [4, "已退回"],
        [5, "已接单"],
        [7, "已执行"],
        [8, "已评价"]
      ];
        // 体验馆园区
        var parkNo = AppService.parkNo;
        vm.parkNo = parkNo;
        var type = 'elevator';
        vm.type = type;

        var param = { parkNo: parkNo, type: type };
        //总数
        AppService.getTotal(param).then(function(res) {
            vm.rightData = res.data;
        });
        //电梯列表
        AppService.getEquipList(param).then(function(res) {
            vm.rightBuildEquipList = res.data;
        });

        //电梯监测详情
        $scope.$on('toSensor', function(evt, data) {
            $http.get('/ovu-screen/pcos/show/equip/monitor.do?id=' + data.id).success(function(data) {
                if (data.success) {
                    vm.sensorList = data.data;
                }
            })
        });

      //4.设备工单列表
      $scope.$on('toWork',function (evt, data) {
        console.log(data);
        vm.location = data.location;
        $http.get('/ovu-screen/pcos/show/workunit/workUnitOne', { params: { domainId: data.domain_id, equipment_id: data.id} }).success(function (res) {
          console.log(res.data);
          vm.workUnitList = res.data;
        });
      });
    }

})();
