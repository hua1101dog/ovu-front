/**
 * Created by wangheng on 2017/9/19.
 * 园区安全中心》电子巡更
 */
(function() {
    "use strict";
    var app = angular.module("app");

    app.controller('patrollingMainCtrl', patrollingMainCtrl);

    function patrollingMainCtrl($scope, $http, AppService) {
        var vm = this;
        vm.parkNo = AppService.parkNo;
        var type = 'watch';
        vm.type = type;


        //进入页面首先查询园区的数据
        var param = { parkNo: AppService.parkNo, type: 'watch' };
        getCommonRight(param);

        //联动
        $scope.$on('toSensor', function(evt, data) {
            evt.stopPropagation();
            var param={parkNo:vm.parkNo,pointId:data.id};
            vm.name = data && data.name;
            $http.get('/ovu-screen/residence/workOrder/getPatrolManList.do',{params:param}).success(function (res) {
                vm.list = res.data;
            })

        });

        //右侧方法
        function getCommonRight(param) {
            //debugger;
            /*AppService.getTotal(param).then(function(response) {
                vm.watch = response.data;

            })*/
            var h=moment().format("H");
            var time = moment().format("H:m");
            if(h>=0 && h<3){
                vm.watch={total:0};
            }else if(time =='10:30' || time =='8:00' || time =='3:00'){
                vm.watch={total:1,regular_num:1};
            }else {
                vm.watch={total:9,regular_num:9};
            }
        }
    }

})();
