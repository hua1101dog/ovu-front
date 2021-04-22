/**
 * Created by wangheng on 2017/9/19.
 * 园区安全中心》消防
 */
(function() {
    "use strict";
    var app = angular.module("app");

    app.controller('fireMainCtrl', fireMainCtrl);

    function fireMainCtrl($scope, $http, AppService) {
        var vm = this;
        //默认展示园区的右侧
        vm.show = 1;
        vm.title = '园区';

        vm.parkNo = AppService.parkNo;
        var type = 'fire';
        vm.type = type;

        // vm.fmapId = AppService.park.fmapId;

        //进入页面首先查询园区的数据
        var param = { parkNo: AppService.parkNo, type: 'fire' };
        getFireData(param);

        //获取接口数据
        function getFireData(param) {
            AppService.getEquipList(param).then(function(response) {
                debugger;
                vm.list = response.data.filter(function (da) {
                    return da.equip_type =='smoke' && da.equip_status != 1;
                });
            })

        }
    }

})();