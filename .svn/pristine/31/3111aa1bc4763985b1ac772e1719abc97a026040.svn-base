(function() {
    "use strict";
    var app = angular.module("app");

    app.controller('equipmentRoomCtrl', equipmentRoomCtrl);

    equipmentRoomCtrl.$inject = ['$scope', 'AppService', '$http'];

    function equipmentRoomCtrl($scope, AppService, $http) {
        var vm = this;

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

    }

})();
