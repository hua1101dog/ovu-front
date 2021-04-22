(function() {
    "use strict";
    var app = angular.module("app");

    app.controller('parkingMainCtl', parkingMainCtl);

    parkingMainCtl.$inject = ['$scope', 'AppService', 'iconService', 'gaodeHttpServer'];

    function parkingMainCtl($scope, AppService, iconService, httpHelper) {
        var vm = this;

        // 体验馆园区
        var parkNo = AppService.parkNo;
        vm.parkNo = parkNo;
        var type = 'parkingLot';
        vm.type = type;

        //********************************右侧panel统计数据逻辑***************************************************** */
        // 获取园区 右侧统计数据
        function getRightData() {
            // 获取right-panel数据
            httpHelper.api('GET')('/parkingLot/total')({ parkNo: parkNo }).then(function(result) {
                //debugger;
                // 渲染右侧数据
                var res = result.data;
                
                var data1 = {'total':'546','left_num':'212'};
                
                vm.rightData = data1;
            });
            // 停车位数据
            httpHelper.api('GET')('/parkingLot/groupByPostion')({ parkNo: parkNo, type: type }).then(function(result) {
                // 渲染右侧列表数据
                var res = result.data;
                var data = res.data;
                
                var data1 = [{'position':'地下','total':'360','left_num':'130'},{'position':'地面','total':'186','left_num':'82'}];
                
                vm.parkingLotList = data1;
            });
            var storage = [151, 220, 383, 328, 123, 295, 455, 500, 125, 147, 21, 25, 266, 288, 459, 275, 25, 14, 16, 98];
            httpHelper.api('GET')('/equip/list')({ parkNo: parkNo, type: type }).then(function(result) {
            //    debugger;
                // 渲染右侧列表数据
                var res = result.data.data;
                var enter=0;
                var normal=0;
                vm.total=res.length;
                res.forEach(function (da) {
                   // debugger;
                    if(da.equip_simple_name.indexOf('入口')!=-1){
                        enter++ ;
                    }
                    if(da.equip_status==1){
                        normal++;
                    }
                });
                vm.enter =enter;
                vm.normal=normal;
            });
        }
        getRightData();

    }

})();