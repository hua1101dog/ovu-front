/**
 * Created by Zn on 2018/1/3.
 */
(function () {
    "use strict";
    var app = angular.module("angularApp");

    app.controller('overviewCtrl', function ($scope, $rootScope, $timeout, $uibModal, $state, $http, $filter, fac) {
        document.title = '设备房概览';
        var mapCenter;
        app.modulePromiss.then(function () {
            $scope.search = {
                unitStatus: 8
            };
            $scope.pageModel = {};
            
            $scope.$watch('dept.id', function (deptId, oldValue) {
                if (deptId) {
                    if ($scope.dept.parkId) {
                        $scope.search.parkId = $scope.dept.parkId;
                        $scope.search.houseId = sessionStorage.getItem('houseId');
                        $scope.park=getPostion();
                        mapCenter=[$scope.park['mapLng'],$scope.park['mapLat']];
                        $scope.find();
                        $scope.abnormalBroadcast();
                        $scope.initMap(mapCenter);
                    } else {
                        alert('请选择跟项目关联的部门');
                        return
                    }
                    function getPostion(){
                        var position=[]
                        function getNode(nodes){
                           nodes && nodes.forEach(function(n){
                               if(n.id==$scope.dept.parkId){
                                   position=n
                                 }else{
                                     if(n.nodes && n.nodes.length){
                                        getNode(n.nodes)
                                     }
                                 }
                           })  
                        }
                        getNode($rootScope.parkTree)
                        return  position
                     }
                }
            })
        })
        $scope.abnormalBroadcast = function () {
            $http.post('/ovu-pcos/pcos/equiphouse/getReport', $scope.search, fac.postConfig).success(function (data) {
                $scope.data = data
            })
        }
        $scope.initMap = function (mapCenter) {
            var map = new AMap.Map('container', {
                resizeEnable: true,
                zoom: 16,
                center: mapCenter

            });
            $http.post('/ovu-pcos/pcos/equiphouse/getHouseList', $scope.search, fac.postConfig).success(function (data) {
                if (data) {
                    data.forEach(function (v) {
                        var info = [];
                        if (v.mapLng && v.mapLat) {
                            map.setCenter([v.mapLng, v.mapLat]);
                            info.push(v.equipHouseName);
                            if (!fac.isEmpty(v.sensorData)) {
                                for (var i = 0; i < v.sensorData.length; i++) {
                                    var obj = v.sensorData[i];
                                    info.push(obj.name + ':' + obj.val + (obj.unit == undefined ? '' : obj.unit) + (obj.isRegular == 1 ? '' : '<span style="color: red">(异常)</span>'))
                                    //   info.push(obj.name+':'+'<span ng-class="{red:obj.isRegular==2}">{{obj.val+(obj.unit==undefined?"":obj.unit)+(obj.isRegular==2?"(异常)":"")}}</span>');
                                }
                            }
                            info.push("<div style='overflow: hidden;'><a href='javascript:void(0)' class='btn btn-xs btn-link pull-left inform'>查看详情</a><a href='javascript:void(0)' class='btn btn-xs btn-link pull-right camera'>摄像头</a></div>")
                            if (!fac.isEmpty(v.sensorData) && v.sensorData.some(function (item) {
                                    return item.isRegular == 2
                                })) {
                                //异常
                                new AMap.Marker({
                                    map: map,
                                    icon: '/res/img/mark_bs/sign_operations_abnormal.png',
                                    position: [v.mapLng, v.mapLat]
                                }).on('click', function () {
                                    new AMap.InfoWindow({
                                        content: info.join("<br>") //使用默认信息窗体框样式，显示信息内容
                                    }).open(map, [v.mapLng, v.mapLat]);
                                    $timeout(function () {
                                        $("a.inform").click(function () {
                                            sessionStorage.setItem("equipName", v.equipHouseName);
                                            sessionStorage.setItem("equipHouseId", v.equipHouseId);
                                            sessionStorage.setItem("houseId", v.houseId);
                                            $state.go('admin', {
                                                folder: 'equipmentroom',
                                                page: 'equipInform'
                                            });
                                        })
                                        $('a.camera').click(function () {
                                            //$('#box').css("display","block");
                                            //   $http.post('/ovu-pcos/pcos/equiphouse/getHouseVideo', {equipHouseId:v.equipHouseId},fac.postConfig).success(function (data) {
                                            //     fac.showVideo(data);
                                            //   })
                                            $rootScope.playVideo(v.equipHouseId)
                                            /*  $scope.selected=0;
                                              $scope.toggleVideo=function (item,index) {
                                                 /!* $scope.ScreenUrl=item;*!/
                                                  $scope.selected=index;
                                              }*/
                                            /* $http.post('/ovu-pcos/pcos/equiphouse/getHouseVideo',{equipHouseId:v.equipHouseId},fac.postConfig).success(function (data) {
                                                 $scope.videoList=data;
                                                 $('#content').html(v.equipHouseName);
                                             })*/
                                        })
                                    }, 500)
                                })
                            } else {
                                //正常
                                new AMap.Marker({
                                    map: map,
                                    icon: '/res/img/mark_bs/sign_operations.png',
                                    position: [v.mapLng, v.mapLat]
                                }).on('click', function () {
                                    new AMap.InfoWindow({
                                        content: info.join("<br>") //使用默认信息窗体框样式，显示信息内容
                                    }).open(map, [v.mapLng, v.mapLat]);
                                    $timeout(function () {
                                        $("a.inform").click(function () {
                                            sessionStorage.setItem("equipName", v.equipHouseName);
                                            sessionStorage.setItem("equipHouseId", v.equipHouseId);
                                            sessionStorage.setItem("houseId", v.houseId);
                                            // $state.go('admin', {
                                            //     folder: 'equipmentroom',
                                            //     page: 'equipInform'
                                            // });
                                            $rootScope.target('equipmentroom/equipInform','设备房概览详情',false,'','','equipmentroom/equipInform')
                                        })
                                        $('a.camera').click(function () {
                                            /* $('#box').css("display","block");*/
                                            $http.post('/ovu-pcos/pcos/equiphouse/getHouseVideo', {
                                                equipHouseId: v.equipHouseId
                                            }, fac.postConfig).success(function (data) {
                                                // fac.showVideo(data);
                                                $rootScope.playVideo(v.equipHouseId)
                                            })

                                            /* $scope.selected=0;
                                             $scope.toggleVideo=function (item,index) {
                                                 /!*$scope.ScreenUrl=item;*!/
                                                 $scope.selected=index;
                                             }
                                             $http.post('/ovu-pcos/pcos/equiphouse/getHouseVideo',{equipHouseId:v.equipHouseId},fac.postConfig).success(function (data) {
                                                 $scope.videoList=data;
                                                 $('#content').html(v.equipHouseName);
                                             })*/
                                        })
                                    }, 500)
                                })
                            }
                        }
                    })
                }
            })
        }
        $scope.find = function (pageNo) {
            // if (!$scope.search.EXEC_NAME) {
            //     delete $scope.search.execPersonId;
            // }
            if(!$rootScope.dept ||!$rootScope.dept.id){
                alert("请选择部门！");
                return false;
            }
            // $scope.search.EXEC_NAME = $scope.search.user?$scope.search.user.name:undefined;
            // $scope.search.execPersonId = $scope.search.user?$scope.search.user.id:undefined;
            $.extend($scope.search, {
                currentPage: pageNo || 1,
                pageSize: $scope.pageModel.pageSize || 10
            });
            $scope.search.pageIndex = $scope.search.currentPage - 1;
            $scope.search.houseId = '';
            fac.getPageResult("/ovu-pcos/pcos/equiphouse/getHouseWorkUnit", $scope.search, function (data) {
                $scope.pageModel = data;
            });
        };

        $scope.goEquipInform = function (item) {
            sessionStorage.setItem("equipName", item.equipHouseName);
            sessionStorage.setItem("equipHouseId", item.equipHouseId);
            sessionStorage.setItem("houseId", item.houseId);
            // $state.go('admin', {
            //     folder: 'equipmentroom',
            //     page: 'equipInform'
            // });
            $rootScope.target('equipmentroom/equipInform','设备房概览详情',false,'','','equipmentroom/equipInform')
        }
        //查看回访详情
        $scope.showReturnVisit = function (id) {
            $uibModal.open({
                animation: false,
                templateUrl: '../view/workunit/modal.showReturnVisit.html',
                size: 'lg',
                controller: 'showReturnVisitModalCtrl',
                resolve: {
                    id: function () {
                        return id;
                    }
                }
            });
        };
        $scope.selectedExecPerson = function (item, search) {
            search.execPersonId = item.id;
        }
    });
    //查看回访
    app.controller('showReturnVisitModalCtrl', function ($scope, $uibModalInstance, $http, fac, id) {
        $scope.search = {
            unitId: id
        };
        $scope.pageModel = {};

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };

        $scope.find = function (pageNo) {
            $.extend($scope.search, {
                currentPage: pageNo || $scope.pageModel.currentPage || 1,
                pageSize: $scope.pageModel.pageSize || 10
            });
            fac.getPageResult("/ovu-pcos/pcos/workunit_callback/list.do", $scope.search, function (data) {
                $scope.pageModel = data;
            });
        }
        $scope.find();
    });
})();
