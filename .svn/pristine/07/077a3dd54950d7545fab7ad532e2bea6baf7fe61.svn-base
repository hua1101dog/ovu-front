/**
 * Created by wangheng on 2017/9/19.
 * 通知
 */
(function() {
    "use strict";
    var app = angular.module("app");

    //预警事件控制器
    app.controller('WarningCtrl', WarningCtrl);
    function WarningCtrl($scope, $http, fac) {
        document.title = "预警事件管理";
        var vm = this;
        vm.title ="设备预警列表";//默认为设备预警
        vm.type=1;  //默认为设备预警
        $scope.pageModel = {};
        $scope.search = {};

        //选择设备还是资质预警
        vm.selectType = function (type) {
            vm.title = vm.type == 1 ? '设备预警列表':'维保单位资质到期预警列表';
            vm.url = vm.type == 1 ? '/ovu-pcos/pcos/govcloud/warning/equipment.do':'/ovu-pcos/pcos/govcloud/warning/maintain.do';
            $scope.pageModel = {};
            $scope.search = {};
            $scope.find(1);
        }

        //发送邮件
        vm.sendEmail = function () {
            var ids = $scope.pageModel.list.reduce(function(ret, n) {
                n.checked && ret.push(n.id);
                return ret
            }, []);
            $http.post("/ovu-pcos/pcos/govcloud/warning/email.do", {
                "ids": ids.join()
            }, fac.postConfig).success(function(resp) {
                if (resp.success) {
                    msg();
                    $scope.find();
                } else {
                    alert(resp.error);
                }
            })
        }

        $scope.find = function(pageNo){
            angular.extend($scope.search,{currentPage:pageNo||$scope.pageModel.currentPage||1,pageSize:$scope.pageModel.pageSize||10});
            fac.getPageResult(vm.url,$scope.search,function(data){
                $scope.pageModel = data;
            });
        };
        //默认查询设备预警
        vm.selectType(1);

    }
})();