/**
 * Created by wangheng on 2017/9/19.
 * 通知
 */
(function() {
    "use strict";
    var app = angular.module("app");

    //list控制器
    app.controller('PlatformCtrl', PlatformCtrl);
    function PlatformCtrl($scope, $http,$state, AppService) {
        document.title ="平台运营管理";
        var vm = this;
        //地图基本配置
        vm.mapOptions = {
            // map-self config
            // ui map config
            uiMapCache : false,
            zoom:11,
            liteStyle:true,
        };


        //引入SimpleMarker，loadUI的路径参数为模块名中 'ui/' 之后的部分
        AMapUI.loadUI(['overlay/SimpleMarker'], function(SimpleMarker) {
            $http.get('/ovu-pcos/pcos/govcloud/platformoperation/get.do').success(function (data) {
                //运营数据
                vm.platformList = data.platform;
                //品牌分布
                vm.brandList = data.brand;
                vm.numN=4;
                vm.infoN="︾" ;
                vm.getmoreN=function(){
                    if(vm.infoN=="︾"){
                      vm.numN= vm.brandList.length;
                      vm.infoN="︽";
                    }
                    else{
                      vm.numN=4;
                      vm.infoN="︾";
                    }

                }
                //运行状态
                vm.runningList = data.runningstatus;
                //地区分布
                vm.regionList = data.region;
                vm.numW=4;
                vm.infoW="︾" ;
                vm.getmoreW=function(){
                    if(vm.infoW=="︾"){
                      vm.numW=vm.regionList.length;
                      vm.infoW="︽";
                    }
                    else{
                      vm.numW=4;
                      vm.infoW="︾";
                    }

                }
                //marker
                AppService.setMapBounds(data.region,vm.map);
                initMarker(SimpleMarker,data.region || []);
            })
        });
       //生成地图标记点方法
        function initMarker(SimpleMarker,list) {
            list.forEach(function (li) {
                //创建SimpleMarker实例
                new SimpleMarker({
                    //前景文字
                    iconLabel: {
                        innerHTML: li.amount, //设置文字内容
                        style: {
                            color: '#fff'//设置文字颜色
                        }
                    },
                    //图标主题
                    iconTheme: 'fresh',
                    //背景图标样式
                    iconStyle: 'green',
                    map: vm.map,
                    position: [li.longitude, li.latitude],
                    label: {
                        content: li.region,
                        offset: new AMap.Pixel(27, 25)
                    }
                });
            })
        }
    }

})();