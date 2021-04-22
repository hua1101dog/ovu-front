/**
 * Created by wangheng on 2017/9/19.
 * 企业服务中心》企业
 */
(function() {
    "use strict";
    var app = angular.module("app");

    app.controller('firmMainCtrl', firmMainCtrl);
    firmMainCtrl.$inject = ['$scope','$http', 'AppService','httpService'];

    function firmMainCtrl($scope, $http, AppService,httpService) {
        var vm = this;
        //默认展示楼栋的右侧
        // vm.title = AppService.park.parkName;
        vm.show = 1;

        vm.parkNo = AppService.parkNo;
        var type = 'company';
        vm.type = type;

        //进入页面首先查询园区的数据
        var param = { parkNo: AppService.parkNo };
        getFalseData();

        //高德
        $scope.$on('toGaode', function(evt, data) {
            evt.stopPropagation();
            vm.show = 1;
            vm.title = AppService.park.parkName;
            param = { parkNo: AppService.parkNo };
            //getCompanyData(param);
            getFalseData();
        });

        //楼栋
        $scope.$on('toFloor', function(evt, data) {
            evt.stopPropagation();

            //查询右侧详情
            vm.title = data.name;
            // param.floorNo = AppService.floorNo;
            param.floorNo = data.id;
            delete param.groundNum;
            delete param.companyNo;
            getCompanyData(param);
            vm.show = 2;
        });

        //几层
        $scope.$on('toGround', function(evt, data) {
            evt.stopPropagation();

            //查询右侧详情
            vm.show = 2;
            vm.title = data.name;
            param.groundNum = data.id;
            delete param.companyNo;
            getCompanyData(param);
        });

        //房间编号
        $scope.$on('toRoom', function(evt, data) {
            evt.stopPropagation();

            //查询右侧详情
            vm.title = data.name;
            param.houseNo = data.id;

            getCompanyData(param);
            vm.show = 3;
        });

        //获取接口数据
        function getCompanyData(param) {
            $http.get("/ovu-screen-fake/pcos/show/company", { params: param }).success(function(data) {
                vm.company = data || {};
                //图表数据
                var chartData = [];
                //企业类型
                if (data && data.companyTypeProportion) {
                    chartData.push(
                        { name: '上市企业', value: data.companyTypeProportion.listedCompany },
                        { name: '合资企业', value: vm.company.totalCompany-data.companyTypeProportion.listedCompany },
                        { name: '外资企业', value: data.companyTypeProportion.foreignCompany })
                    vm.option1 = AppService.commonPileOption(chartData);
                }
                //企业成立年限
                if (data && data.companyEstabProportion) {
                    chartData = [];
                    chartData.push({ name: '10年以上', value: data.companyEstabProportion.tenYear }, { name: '5-10年', value: data.companyEstabProportion.fiveToTenYear }, { name: '5年以下', value: data.companyEstabProportion.fiveYear })
                    vm.option2 = AppService.commonPileOption(chartData);
                }
                //产权比例
                if (data && data.propertyRightRate) {
                    chartData = [];
                    chartData.push({ name: '租户', value: data.propertyRightRate.tenantNum }, { name: '产权方', value: data.propertyRightRate.propertyRightNum })
                   if (vm.show == 1) {
                        vm.option3 = AppService.commonPileOption(chartData);
                    } else
                    if (vm.show == 2) {
                        vm.option4 = AppService.commonPileOption(chartData);
                    }
                }
                //行业分布
                if (data && data.companyIndustryProportion) {
                    chartData = [];
                    chartData.push(
                        { name: '互联网', value: vm.company.totalCompany-data.companyIndustryProportion.realeState},
                        { name: '房地产', value: data.companyIndustryProportion.realeState },
                        { name: '物流', value: data.companyIndustryProportion.logistics });
                    vm.option5 = AppService.commonPileOption(chartData);
                }
            }).error(function () {
                vm.company = {};
                vm.company.companyName = "";
                vm.title = "";
            });
        }
        //构造园区假数据
        function getFalseData() {
            vm.params={
                parkNo:vm.parkNo,
                type:vm.type
            };
            httpService.getComfirm(vm.params).then(function success (resp) {
                console.log(resp);
                if(resp.data.success){

                    $scope.comFirm = resp.data.datas;
                    console.log($scope.comFirm);
                    // 产业聚集度变化
                    var focusData = $scope.comFirm.tradeFocus.data;
                    vm.focusData = AppService.getPolyOption(focusData, '单位：%');

                    // 就业人数变化
                    var PersonData = $scope.comFirm.tradeObtain.data;
                    vm.employmentData= AppService.getPolyOption(PersonData, '单位：人');

                    // 行业分类企业数占比
                    var companyRatio = $scope.comFirm.companyRatio;
                    vm.option1 = AppService.commonPileOption(companyRatio);

                    // 行业分类面积占比
                    var chartData = $scope.comFirm.companyArea;
                    vm.option2 = AppService.commonPileOption(chartData);

                    // 上市企业概况
                    var companyData=$scope.comFirm.companyQuoted;
                    vm.companyData=AppService.commonPileOption(companyData);
                }},
                function(){

                });


            // var chartData = [];
            // chartData.push(
            //     { name: '金融、泛金融类', value: 26},
            //     { name: '商贸、电子商务', value: 45 },
            //     { name: '工程建筑及房地产开发', value: 49 },
            //     { name: '计算机、软件开发', value: 25 },
            //     { name: '教育培训', value: 11 },
            //     { name: '咨询服务', value: 27 },
            //     { name: '装修设计', value: 21 },
            //     { name: '科技及推广应用', value: 19 },
            //     { name: '文化传媒', value: 13 },
            //     { name: '商务生活服务', value: 25 });
            // vm.option1 = AppService.commonPileOption(chartData);

            // chartData = [];
            // chartData.push(
            //     { name: '金融、泛金融类', value: 47953.95},
            //     { name: '商贸、电子商务', value: 9952.64 },
            //     { name: '工程建筑及房地产开发', value: 22079.29 },
            //     { name: '计算机、软件开发', value: 4482.08 },
            //     { name: '教育培训', value: 2460.54 },
            //     { name: '咨询服务', value: 6677.34 },
            //     { name: '装修设计', value: 5452.52 },
            //     { name: '科技及推广应用', value: 5613.5 },
            //     { name: '文化传媒', value: 2881.02 },
            //     { name: '商务生活服务', value: 4172.5 });
            // vm.option2 = AppService.commonPileOption(chartData);

            // chartData = [];
            // chartData.push(
            //     { name: '主板', value: 1},
            //     { name: '新三板', value: 1 },
            //     { name: '中小板', value: 0 },
            //     { name: '创业板', value: 0 },
            //     { name: '境外', value: 1 });
            // vm.option3 = AppService.commonPileOption(chartData);

            // var focusData = {
            //     Jan: 10,
            //     Feb: 15,
            //     Mar: 20,
            //     Apr: 25,
            //     May: 30,
            //     Jun: 34,
            //     Jul: 35,
            //     Aug: 36,
            //     Sep: 38.7,
            //     Oct: 42.9

            // };
            // vm.focusData = AppService.getPolyOption(focusData, '单位：%');
            // var PersonData={
            //     Jan: 500,
            //     Feb: 550,
            //     Mar: 600,
            //     Apr: 700,
            //     May: 1000,
            //     Jun: 2000,
            //     Jul: 4600,
            //     Aug: 5400,
            //     Sep: 5812,
            //     Oct: 6057

            // };
            // vm.employmentData= AppService.getPolyOption(PersonData, '单位：人');




        }
    }

})();
