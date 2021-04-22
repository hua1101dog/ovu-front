/**
 * Created by wangheng
 * 运营指标体系》双创指标
 */
(function() {
    "use strict";
    var app = angular.module("app");

    app.controller('twoAbilitiesMainCtrl', twoAbilitiesMainCtrl);
    twoAbilitiesMainCtrl.$inject = ['$scope', 'AppService','httpService'];

    function twoAbilitiesMainCtrl($scope, AppService,httpService) {
        var vm = this;
        vm.title = '园区';
        vm.parkNo = AppService.parkNo;
        vm.type = 'twoAbilities';

        vm.params={
            parkNo:vm.parkNo,
            type:vm.type
        };

        httpService.getOpeTwoAbilities(vm.params).then(function (resp) {
            if(resp.data.success){
                $scope.opeTwoAb = resp.data.datas;
                var categoryData= $scope.opeTwoAb.sc_classify_pie;
                vm.categoryData=AppService.commonPileOption(categoryData);
            }
        },function error (resp){

        });

        // function getRightData() {
        //     var categoryData=[
        //         {name:"金融保险",value:6},
        //         {name:"制造供应",value:5},
        //         {name:"文化娱乐",value:5},
        //         {name:"其他",value:5},
        //         {name:"信息科技",value:2}
        //     ];
        //     vm.categoryData=AppService.commonPileOption(categoryData);
        // }

        // getRightData();
    }

})();