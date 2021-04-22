(function() {
    "use strict";
    var app = angular.module("app");

    app.controller('equipmentRoomCtrl', equipmentRoomCtrl);

    equipmentRoomCtrl.$inject = ['$scope', 'AppService', '$http'];

    function equipmentRoomCtrl($scope, AppService, $http) {

      var vm = this;

        vm.statusList = [
          [0, "待派发"],
          [1, "已派发"],
          [4, "已退回"],
          [5, "已接单"],
          [7, "已执行"],
          [8, "已评价"]
        ];

        var parkNo = AppService.parkNo;
        vm.parkNo = parkNo;
        var type = 'equipmentRoom';
        vm.type = type;

        $http.get('/ovu-screen/pcos/show/equiphouse/count.do?parkNo='+vm.parkNo).success(function (data) {
            vm.equipmentRoom=data.data;
        });

        //设备房设备列表
        $scope.$on('toSensor',function (evt, data) {
            var param={parkNo:vm.parkNo,houseId:data.id};
            $http.get('/ovu-screen/pcos/show/equiphouse/equiplist.do',{params:param}).success(function (data) {
                if(data.success){
                    vm.sensorList= data.data;
                }
            })
        })

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
