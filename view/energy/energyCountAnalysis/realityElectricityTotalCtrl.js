/**
 * Created by Cx on 2020/1/7.
 */
(function () {
    "use strict";
    var app = angular.module("angularApp");

    app.controller('realityElectricityTotalCtrl', function ($scope, $rootScope, $uibModal, $state, $http, $filter, fac) {
        document.title = 'OVU-实际用电负荷统计';
        $scope.search = {};

        app.modulePromiss.then(function () {
            $scope.$watch('dept.id', function (deptId, oldValue) {
                if (deptId) {
                    if ($scope.dept.parkId) {
                        $scope.search.deptId = deptId;
                        $scope.find()
                    } else {
                        alert('请选择跟项目关联的部门');
                        $scope.search.deptId && delete $scope.search.deptId


                    }

                }
            })

        })

        $scope.find =  () =>{
            $http.post('/ovu-energy/energy/powerload').success(function (data) {
               $scope.realityElectricityTotalList=data.data
            });
            // $scope.realityElectricityTotalList=
                
            //      [{
            //         "ammeterServiceArea": "特色酒店",
            //         "ammeterServiceMode": "",
            //         "list":[{
            //             "capacity": 1000,
            //             "designLoad": "762.5",
            //             "meterNumber": "T1",
            //             "pfc": 0.9,
            //             "pointId": 264
            //         }, {
            //             "capacity": 1000,
            //             "designLoad": "461.9",
            //             "energy": 310.0000,
            //             "ia": 0.0000,
            //             "ib": 0.0000,
            //             "ic": 0.0000,
            //             "meterNumber": "T2",
            //             "pfc": 0.9,
            //             "pointId": 265
            //         }],
            //         "roomName": "1-1配电室"
            //     },{
            //         "ammeterServiceArea": "餐饮、艺术卖场",
            //         "ammeterServiceMode": "一用一备",
            //         "list": [{
            //             "capacity": 630,
            //             "designLoad": "501",
            //             "meterNumber": "T1",
            //             "pfc": 0.9,
            //             "pointId": 346
            //         },{
            //             "capacity": 630,
            //             "designLoad": "541",
            //             "energy": 335.0000,
            //             "ia": 78.5000,
            //             "ib": 90.5000,
            //             "ic": 89.0000,
            //             "meterNumber": "T2",
            //             "pfc": 0.9,
            //             "pointId": 347
            //         }],
            //         "roomName": "1-2配电室"
            //     },{
            //         "ammeterServiceArea": "艺术家工作室、商铺",
            //         "ammeterServiceMode": "一回",
            //         "list": [{
            //             "capacity": 1000,
            //             "designLoad": "1406",
            //             "energy": 312.0000,
            //             "ia": 137.2000,
            //             "ib": 176.0000,
            //             "ic": 135.2000,
            //             "meterNumber": "T1",
            //             "pfc": 0.9,
            //             "pointId": 405
            //         }, {
            //             "capacity": 1000,
            //             "designLoad": "1588",
            //             "meterNumber": "T2",
            //             "pfc": 0.9,
            //             "pointId": 406
            //         }],
            //         "roomName": "1-3配电室"
            //     }, {
            //         "ammeterServiceArea": "美术馆、剧院",
            //         "ammeterServiceMode": "一用一备",
            //         "list": [{
            //             "capacity": 800,
            //             "designLoad": "1403",
            //             "meterNumber": "T1",
            //             "pfc": 0.9,
            //             "pointId": 464
            //         }, {
            //             "capacity": 800,
            //             "designLoad": "1346.5",
            //             "energy": 222.0000,
            //             "ia": 0.0000,
            //             "ib": 0.0000,
            //             "ic": 0.0000,
            //             "meterNumber": "T2",
            //             "pfc": 0.9,
            //             "pointId": 465
            //         }],
            //         "roomName": "1-4配电室"
            //     }, {
            //         "ammeterServiceArea": "高层1#、2#",
            //         "ammeterServiceMode": "一二回",
            //         "list": [{
            //             "capacity": 800,
            //             "designLoad": "951",
            //             "meterNumber": "T1",
            //             "pfc": 0.9,
            //             "pointId": 182
            //         }, {
            //             "capacity": 800,
            //             "designLoad": "946",
            //             "meterNumber": "T2",
            //             "pfc": 0.9,
            //             "pointId": 183
            //         }],
            //         "roomName": "1-5配电室"
            //     }, {
            //         "ammeterServiceArea": "高层3#、4#，创意工坊1~3#",
            //         "ammeterServiceMode": "一二回",
            //         "list": [{
            //             "capacity": 1000,
            //             "designLoad": "794",
            //             "meterNumber": "T1",
            //             "pfc": 0.9,
            //             "pointId": 2122
            //         }, {
            //             "capacity": 800,
            //             "designLoad": "788",
            //             "meterNumber": "T2",
            //             "pfc": 0.9,
            //             "pointId": 2162
            //         }, {
            //             "capacity": 1000,
            //             "designLoad": "1244",
            //             "meterNumber": "T3",
            //             "pfc": 0.9,
            //             "pointId": 2008
            //         }, {
            //             "capacity": 1000,
            //             "designLoad": "1257",
            //             "meterNumber": "T4",
            //             "pfc": 0.9,
            //             "pointId": 2121
            //         }],
            //         "roomName": "1-6配电室"
            //     }, {
            //         "ammeterServiceArea": "高层5#、6#，创意工坊4#、5#",
            //         "ammeterServiceMode": "一二回",
            //         "list": [{
            //             "capacity": 1000,
            //             "designLoad": "1391",
            //             "meterNumber": "T1",
            //             "pfc": 0.9,
            //             "pointId": 597
            //         }, {
            //             "capacity": 800,
            //             "designLoad": "1097.5",
            //             "meterNumber": "T2",
            //             "pfc": 0.9,
            //             "pointId": 672
            //         }, {
            //             "capacity": 1000,
            //             "designLoad": "1106",
            //             "meterNumber": "T3",
            //             "pfc": 0.9,
            //             "pointId": 700
            //         }],
            //         "roomName": "1-7配电室"
            //     }, {
            //         "ammeterServiceArea": "商业中心",
            //         "ammeterServiceMode": "一用一备",
            //         "list": [{
            //             "capacity": 500,
            //             "designLoad": "252",
            //             "meterNumber": "T1",
            //             "pfc": 0.9,
            //             "pointId": 744
            //         }, {
            //             "capacity": 500,
            //             "designLoad": "467",
            //             "meterNumber": "T2",
            //             "pfc": 0.9,
            //             "pointId": 703
            //         }],
            //         "roomName": "2-1配电室"
            //     }, {
            //         "ammeterServiceArea": "创意工坊10#、11#，商铺",
            //         "ammeterServiceMode": "一回",
            //         "list": [{
            //             "capacity": 800,
            //             "designLoad": "1229",
            //             "meterNumber": "T1",
            //             "pfc": 0.9,
            //             "pointId": 744
            //         }, {
            //             "capacity": 800,
            //             "designLoad": "1264",
            //             "meterNumber": "T2",
            //             "pfc": 0.9,
            //             "pointId": 746
            //         }],
            //         "roomName": "2-2配电室"
            //     }, {
            //         "ammeterServiceArea": "高层7#、8#",
            //         "ammeterServiceMode": "一二回",
            //         "list": [{
            //             "capacity": 800,
            //             "designLoad": "891.5",
            //             "meterNumber": "T1",
            //             "pfc": 0.9,
            //             "pointId": 1005
            //         }, {
            //             "capacity": 800,
            //             "designLoad": "891.5",
            //             "meterNumber": "T2",
            //             "pfc": 0.9,
            //             "pointId": 1094
            //         }, {
            //             "capacity": 800,
            //             "designLoad": "920",
            //             "meterNumber": "T3",
            //             "pfc": 0.9,
            //             "pointId": 960
            //         }, {
            //             "capacity": 800,
            //             "designLoad": "920",
            //             "meterNumber": "T4",
            //             "pfc": 0.9,
            //             "pointId": 1004
            //         }],
            //         "roomName": "2-4配电室"
            //     }, {
            //         "ammeterServiceArea": "创意工坊6~9#",
            //         "ammeterServiceMode": "一回",
            //         "list": [{
            //             "capacity": 1000,
            //             "designLoad": "672.2",
            //             "meterNumber": "T1",
            //             "pfc": 0.9,
            //             "pointId": 1095
            //         }, {
            //             "capacity": 1000,
            //             "designLoad": "830.2",
            //             "meterNumber": "T2",
            //             "pfc": 0.9,
            //             "pointId": 1148
            //         }],
            //         "roomName": "2-5配电室"
            //     }]
                
           
        };
  
        // var tableCont = $('.section-scroll tr th'); //获取th
        // var tableCont_child = $('.section-scroll tr th'); //获取th下边的div
        // var tableScroll = $('.section-scroll'); //获取滚动条同级的class
        
        //         function scrollHandle() {
        //             var scrollTop = tableScroll.scrollTop();
        //             // 当滚动距离大于0时设置top及相应的样式
        //             if (scrollTop > 0) {
        //                 console.log(scrollTop)
        //                 tableCont.css({
        //                     "top": scrollTop + 'px',
        //                     "marginTop": "-1px",
                          
        //                 });
        //                 tableCont_child.css({
                            
        //                     "marginTop": "-1px",
                          
        //                 })
        //             } else {
        //                 console.log(scrollTop)
        //             // 当滚动距离小于0时设置top及相应的样式
        //                 tableCont.css({
        //                     "top": scrollTop + 'px',
        //                     "marginTop": "0",
        //                 });
        //                 tableCont_child.css({
        //                     "border": "none",
        //                     "marginTop": 0,
        //                     "marginBottom": 0,
        //                 })
        //             }
        //         }
        // tableScroll.on('scroll', scrollHandle);
     





    });


})();
