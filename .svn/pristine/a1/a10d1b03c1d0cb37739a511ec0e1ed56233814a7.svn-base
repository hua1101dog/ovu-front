/**
 * Created by wangheng
 * 运营指标体系》招商指标
 */
(function() {
    "use strict";
    var app = angular.module("app");

    app.controller('businessMainCtrl', businessMainCtrl);

    businessMainCtrl.$inject = ['$scope', 'AppService','GlobalServise','httpService'];
    
    function businessMainCtrl($scope, AppService,GlobalServise,httpService) {
        var vm = this;
        vm.title = '园区';
        vm.parkNo = AppService.parkNo;

        // 如果是长沙，不要（商业）
        if(vm.parkNo == '04301040001ZSRJ'){
            vm.changsha = true;
        }else{
            vm.changsha = false;
        }

        vm.type = 'business';

        vm.showLogos = AppService.park.fmapId;
        
        vm.params={
            parkNo:vm.parkNo,
            type:vm.type
        };

        httpService.getOpeBusiness(vm.params).then(function (resp) {
            if(resp.data.success){
                $scope.opeBusiness = resp.data.datas;
            }
        },function error (resp){

        });
        // 获取大屏右侧
    }

})();