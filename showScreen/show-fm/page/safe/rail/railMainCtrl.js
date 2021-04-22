/**
 * Created by wangheng on 2017/9/19.
 * 园区安全中心》门禁管理
 */
(function() {
    "use strict";
    var app = angular.module("app");

    app.controller('railMainCtrl', railMainCtrl);

    function railMainCtrl($scope, $http, AppService) {
        var vm = this;
        //默认展示楼栋的右侧
        vm.title = '园区';
        vm.parkNo = AppService.parkNo;
        var type = 'rail';
        vm.type = type;

        /*首先查询 园区整体的概况*/
        var param = { parkNo: AppService.parkNo, type: 'rail' };
        //getCommonRight(param);

        //右侧方法
        function getCommonRight(param) {
            AppService.getTotal(param).then(function(response) {
               /* if(vm.title == '园区' && response.data){
                    response.data.regular_num *= 10;
                    response.data.fail_num *= 10;
                    response.data.broken_num *= 10;
                    response.data.total *=10;
                }*/
                vm.gate = response.data;
                //图表数据
                var chart = [];
                chart.push({ name: '门开', value: vm.gate.regular_num || 0 }, { name: '门关', value: vm.gate.fail_num || 0 }, { name: '损坏', value: vm.gate.broken_num || 0 });
                vm.option = AppService.commonPileOption(chart);
            })
        }
    }

})();