/**
 * Created by wangheng on 2017/9/19.
 * 通知
 */
(function() {
    "use strict";
    var app = angular.module("app");

    app.controller('StatisticsCtrl', StatisticsCtrl);
    function StatisticsCtrl($scope, $http, AppService) {
        document.title = "统计分析";
        var vm = this;

        $http.get('/ovu-pcos/pcos/govcloud/statistical/get.do').success(function (data) {
            vm.runningstatus =  data;
            //电梯分布
            if (data && data.elevatorCompanyList) {
                var names = [];
                data.elevatorCompanyList.forEach(function(da) {
                    da.name = da.company +'(' + da.amount + ')';
                    da.value = da.amount;
                    names.push(da.name);
                })
                var option = AppService.commonPileOption();
                option.legend.data = names;
                option.series[0].data = data.elevatorCompanyList;
                vm.option1 = option;
            }
            //维保单位维保工作完成率
            if (data && data.WorkUnitCompletionRateByCommunityList) {
                vm.option2 = AppService.getPorgressOption(data.WorkUnitCompletionRateByCommunityList,'完成率');
            }
            //维保单位维保工作完成率
            if (data && data.WorkUnitCompletionRateByPersonList) {
                vm.option3 = AppService.getPorgressOption(data.WorkUnitCompletionRateByPersonList,'平均分');
            }

        })

    }

})();