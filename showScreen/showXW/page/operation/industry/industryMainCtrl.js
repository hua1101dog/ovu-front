/**
 * Created by wangheng
 * 运营指标体系》产业指标
 */
(function () {
    "use strict";
    var app = angular.module("app");

    app.controller('industryMainCtrl', industryMainCtrl);
    industryMainCtrl.$inject = ['$scope', 'AppService','httpService'];

    function industryMainCtrl($scope, AppService,httpService) {
        var vm = this;
        vm.title = '园区';
        vm.parkNo = AppService.parkNo;
        vm.type = 'industry';
        function getRightData() {

            // 获取right-panel数据 折线图
            /*httpHelper.api('GET')('/water')({ parkNo: parkNo }).then(function(result) {
             var res = result.data;
             vm.rightData = {
             total: res.waterMeterNum,
             regular_num: res.normal,
             fail_num: res.abnormal
             };
             var data = res.waterTrend;
             vm.polyData = AppService.getPolyOption(data, '单位：m³');
             });
             */
            
            // vm.params={'aa':22};
            // AppService.getOpeIndustry(vm.params).then(function (resp) {
    
            //     $scope.opeindustry = resp.data;
    
            // },function error (){
                
            // });

            vm.params={
                parkNo:vm.parkNo,
                type:vm.type
            };
    
            httpService.getOpeIndustry(vm.params).then(function success (resp) {
                if(resp.data.success){
                    $scope.opeIndustry = resp.data.datas;
                    // 产业聚集度变化
                    var focusData = $scope.opeIndustry.tradeFocus.data;
                    vm.focusData = AppService.getPolyOption(focusData, '单位：%');

                    // 就业人数变化
                    var PersonData = $scope.opeIndustry.tradeObtain.data;
                    vm.employmentData= AppService.getPolyOption(PersonData, '单位：人');

                    // 行业分类企业数占比
                    var companyRatio = $scope.opeIndustry.companyRatio;
                    vm.option1 = AppService.commonPileOption(companyRatio);

                    // 行业分类面积占比
                    var chartData = $scope.opeIndustry.companyArea;
                    vm.option2 = AppService.commonPileOption(chartData);

                    // 上市企业概况
                    var companyData=$scope.opeIndustry.companyQuoted;
                    vm.companyData=AppService.commonPileOption(companyData);

                }
                },
                function(){
                    var focusData = $scope.opeIndustry.tradeFocus.data;
                    var focusData = {
                        Jan: 10,
                        Feb: 15,
                        Mar: 20,
                        Apr: 25,
                        May: 30,
                        Jun: 34,
                        Jul: 35,
                        Aug: 36,
                        Sep: 38.7,
                        Oct: 42.9

                    };
                    

                    // 就业人数变化
                    var PersonData={
                        Jan: 500,
                        Feb: 550,
                        Mar: 600,
                        Apr: 700,
                        May: 1000,
                        Jun: 2000,
                        Jul: 4600,
                        Aug: 5400,
                        Sep: 5812,
                        Oct: 6057

                    };
                    vm.employmentData= AppService.getPolyOption(PersonData, '单位：人');

                    // 上市企业概况
                    var companyData=[
                        { name: '主板', value: 1},
                        { name: '新三板', value: 1 },
                        { name: '中小板', value: 0 },
                        { name: '创业板', value: 0 },
                        { name: '境外', value: 1 }
                    ];
                    vm.companyData=AppService.commonPileOption(companyData);

                    // 行业分类企业数占比
                    var chartData = [];
                    chartData.push(
                        { name: '金融、泛金融类', value: 26},
                        { name: '商贸、电子商务', value: 45 },
                        { name: '工程建筑及房地产开发', value: 49 },
                        { name: '计算机、软件开发', value: 25 },
                        { name: '教育培训', value: 11 },
                        { name: '咨询服务', value: 27 },
                        { name: '装修设计', value: 21 },
                        { name: '科技及推广应用', value: 19 },
                        { name: '文化传媒', value: 13 },
                        { name: '商务生活服务', value: 25 });
                    vm.option1 = AppService.commonPileOption(chartData);

                    // 行业分类面积占比
                    chartData = [];
                    chartData.push(
                        { name: '金融、泛金融类', value: 47953.95},
                        { name: '商贸、电子商务', value: 9952.64 },
                        { name: '工程建筑及房地产开发', value: 22079.29 },
                        { name: '计算机、软件开发', value: 4482.08 },
                        { name: '教育培训', value: 2460.54 },
                        { name: '咨询服务', value: 6677.34 },
                        { name: '装修设计', value: 5452.52 },
                        { name: '科技及推广应用', value: 5613.5 },
                        { name: '文化传媒', value: 2881.02 },
                        { name: '商务生活服务', value: 4172.5 });
                    vm.option2 = AppService.commonPileOption(chartData);
                });

            
        }

        getRightData();

        
    }

})();