/**
 * Created by wangheng on 2017/9/19.
 * 园区安全中心》门禁管理
 */
(function() {
    "use strict";
    var app = angular.module("app");

    app.controller('accessMainCtrl', accessMainCtrl);

    function accessMainCtrl($scope, $http, AppService) {
        var vm = this;
        //默认展示楼栋的右侧
        vm.parkNo = AppService.parkNo;
        var type = 'gate';
        vm.type = type;

        // vm.fmapId = AppService.park.fmapId;

        /*首先查询 园区整体的概况*/
        var param = { parkNo: AppService.parkNo, type: 'gate' };
        getCommonRight(param);

        //右侧方法
        function getCommonRight(param) {
            AppService.getTotal(param).then(function(response) {
               
                vm.gate = response.data;
            })
        }
    }

})();