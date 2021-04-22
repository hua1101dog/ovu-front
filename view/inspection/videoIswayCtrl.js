// 巡查线路管理
(function () {
    var app = angular.module("angularApp");
    app.directive('wdateWay', function () {
        return {
            restrict: "A",
            require: '?ngModel',
            scope: {},
            link: function (scope, element, attrs, ngModel) {
                if (!ngModel) return;
                element.bind('click', function () {
                    window.WdatePicker({
                        dateFmt: "HH:mm",
                        onpicked: function () { element.change() },
                        oncleared: function () { element.change() }
                    })
                });
                element.on("blur", function () {
                    var val = this.value;
                    scope.$apply(function () {
                        ngModel.$setViewValue(val);
                    });
                })

            }
        }
    });

    app.service('AppService', function ($http, fac) {
        var that = this;
        this.park = {  parkName: '' };
        //项目编号
       
        this.onlyIndoorMap = true;
        this.isAddWay = true
    });

    app.controller('videoIswayCtrl', function ($scope, $rootScope, $uibModal, $http, $filter, fac, $timeout, AppService) {
        document.title = "巡查路线";
        $scope.pageModel = {};
        $scope.title = '添加'
        $scope.search = {};
        $scope.startAddWay = false
        $scope.isEdit = true;  //添加按钮
        $scope.isSave = false;//是否禁用完成按钮
        $scope.selecedPoints = [];
        $scope.isnWayList = [];
        
        $scope.mapData_way={
            name:"cytdWay"+ new Date().getTime(),
            timeStr:new Date().getTime()}
        var iconList = ['/res/img/WechatIMG1240.png', '/res/img/WechatIMG1239.png', '/res/img/WechatIMG1239.png']
        app.modulePromiss.then(function () {
            $rootScope.$watch('dept.id', function (deptId, oldValue) {
                if (deptId) {
                    var parkDept = fac.getParkDept(null, deptId);
                    if (parkDept) {
                     
                        $scope.search.parkId = parkDept.parkId;
                        $scope.search.parkName = parkDept.parkName
                       
                    } else {
                        $scope.search.parkId = "";
                        $scope.search.parkName = ""
                    
                    }
                    reloadMap();
                    findAllWay();
                }
            })
        });
        // 地图加载完成，开始打点
        $rootScope.$on('loadCompleteMap'+$scope.mapData_way.timeStr, (evt, map) => {
            $rootScope.mapWayObj = map;
            map && $scope.find(true);


        })
        // 地图加载完成，开始打点
        $rootScope.$on('addCameraWay'+$scope.mapData_way.timeStr, (evt, pointInfo, position) => {
            addCameraLine(pointInfo, position)
        })

        function addCameraLine(pointInfo, position) {
            if (!$scope.startAddWay) {
                return
            }
            var findVal = $scope.selecedPoints.find(function (point) {
                return pointInfo.bindCameraId == point.equipmentId
            })
            if (findVal) {
                return
            }
            $scope.$apply(function () {
                $scope.selecedPoints.push({
                    equipmentSimpleName: pointInfo.bindCameraName,
                    equipmentId: pointInfo.bindCameraId,
                    point: pointInfo.points[0]

                })
                if ($scope.selecedPoints.length > 0) {
                    $scope.isSave = true
                }
            });
            resetFenceColor()
        }
        function resetFenceColor() {
            $scope.ranges.forEach(r => { r.isSel = false })
            $scope.selecedPoints.forEach(v => {
                var findVal = $scope.ranges.find(function (range) {
                    return range.bindCameraId == v.equipmentId
                })
                findVal && (findVal.isSel = true)
            })
            $rootScope.mapWayObj.addRangesMarker($scope.ranges, $rootScope.mapWayObj.map)

        }
        //列表查询
        $scope.find = function () {
            //项目判断
          
            $http.post("/ovu-pcos/pcos/equipment/cameraShootingRange/getCamera", $scope.search).success(function (resp) {
                if (resp.code == 0) {
                    var datas = [];
                    $scope.ranges = [];
                    var selCameraInfo = {}
                    $scope.pageModel = resp.data;
                    resp.data.forEach(function (item) {

                        if (item.longitude && item.latitude) {
                            let len = item.cameraList ? item.cameraList.length : 0
                            datas.push({
                                equipmentName: item.equipmentSimpleName,
                                equipmentId: item.equipmentId,
                                floor: '创意天地',
                                longitude: item.longitude,
                                latitude: item.latitude,
                                content: item.equipmentSimpleName,
                                icon: len > 2 ? iconList[2] : iconList[len],
                                haveCamera: len ? true : false
                            });
                            if (item.cameraList && item.cameraList.length > 0) {
                                item.cameraList.forEach(v => {
                                    if (v.coordinates) {
                                        let pointArr = JSON.parse(v.coordinates);
                                        let points = []
                                        pointArr.forEach(p => { points.push([p.longitude, p.latitude]) })
                                        $scope.ranges.push({
                                            equipmentName: item.equipmentSimpleName,
                                            equipmentId: item.equipmentId,
                                            bindCameraId: v.equipmentId,
                                            bindCameraName: v.equipmentSimpleName,
                                            points: points,
                                            bindEquipmentName: v.equipmentName
                                        })
                                    }


                                })
                            }


                        }
                    });

                    $rootScope.mapWayObj.addCameraMarker(datas, $rootScope.mapWayObj.map)
                    $rootScope.mapWayObj.addRangesMarker($scope.ranges, $rootScope.mapWayObj.map)
                }
            });
        };

        function reloadMap() {
            //加载地图
           
            var parkName = '';
            parkName = $scope.search.parkName;
            AppService.isAddWay = true
            AppService.park = { parkName: parkName,parkId:$scope.search.parkId };
            //项目编号
          
         
            
            $scope.$broadcast("reloadMap"+window.location.hash);
        }

        //查询所有的线路列表
        function findAllWay() {
            // if (!fac.hasSpecialPark($scope.search)) {
            //     $scope.isnWayList = []
            //     return;
            // }
            var params = {
                parkId: $scope.search.parkId
            }

            $http.post('/ovu-pcos/pcos/videoinspection/way/list', params).success(function (resp) {
                if (resp.code == 0) {
                    $scope.isnWayList = resp.data || [];
                } else {
                    $scope.isnWayList = []
                }
            })
        }
        //根据选择的巡查路线在地图上标识围栏
        $scope.getWay = function () {

            //$scope.isEdit = true;
            // $scope.isSave = true;
            $scope.startAddWay = false
            if (!$scope.search.insWayId) {
                $scope.selecedPoints = [];
                resetFenceColor()
                return
            }
            $http.get('/ovu-pcos/pcos/videoinspection/way/get/' + $scope.search.insWayId, fac.postConfig).success(function (data) {
                $scope.selecedPoints = [];
                let points = []
                data.data.equipmentList.forEach(function (v) {
                    var findCamera;
                    let pointArr = []

                    // for (var i = 0; i < $scope.pageModel.length; i++) {
                    //     if ($scope.pageModel[i].cameraList && $scope.pageModel[i].cameraList.length > 0) {
                    //         findCamera = $scope.pageModel[i].cameraList.find(function (camera) {
                    //             return camera.equipmentId == v.equipmentId
                    //         })
                    //     }
                    //     if (findCamera&&findCamera.coordinates) {
                    //         pointArr = JSON.parse(findCamera.coordinates);
                    //         break
                    //     }
                    // }
                    $scope.selecedPoints.push({
                        equipmentId: v.equipmentId,
                        equipmentSimpleName: v.equipmentSimpleName,
                    })
                    // if (pointArr.length > 0) {
                    //     $scope.selecedPoints.push({
                    //         point: [pointArr[0].longitude, pointArr[0].latitude],
                    //         equipmentId: v.equipmentId,
                    //         equipmentSimpleName: v.equipmentSimpleName,
                    //     })
                    //     points.push([pointArr[0].longitude, pointArr[0].latitude])
                    // }
                })
                resetFenceColor()

            })
        }


        //添加路线
        $scope.addWayPoint = function (isEdit) {
            if (!$scope.search.parkId) {
                alert('请选择项目下的部门！')
                return
            }
            // $scope.isEdit = isEdit;
            $scope.startAddWay = !$scope.startAddWay;
            //添加
            if(!isEdit){
                if ($scope.selecedPoints.length !== 0) {
                    $scope.selecedPoints = [];
                    resetFenceColor();
                }
                $scope.search.insWayId && delete $scope.search.insWayId
            }else{
                $scope.isSave=true
            }
        }
        //删除路线
        $scope.del = function () {

            if (!$scope.search.insWayId) {
                alert('请选择路线');
                return
            }
            confirm("确认删除该巡查路线?", function () {
                $http.get("/ovu-pcos/pcos/videoinspection/way/delete/" + $scope.search.insWayId, fac.postConfig).success(function (resp) {
                    if (resp.code == 0) {
                        msg(resp.msg);
                        var index = $scope.isnWayList.findIndex(function (v, i) {
                            return v.insWayId == $scope.search.insWayId
                        })
                        $scope.isnWayList.splice(index, 1);
                        $scope.selecedPoints = [];
                        resetFenceColor()
                    } else {
                        alert(resp.msg);
                    }
                })
            });
        }
        //删除点位
        $scope.delItem = function (item, $event) {
            $event.stopPropagation()
            $event.preventDefault()
            var index = $scope.selecedPoints.findIndex(function (v) {
                return v.equipmentId == item.equipmentId
            })
            var path = [];
            $scope.selecedPoints.splice(index, 1);
            if ($scope.selecedPoints.length < 1) {//是否禁用完成按钮
                $scope.isSave = false
            } else {
                $scope.isSave = true
            }
            resetFenceColor()



        }
        // $scope.cancle = function () {
        //     $scope.getWay()

        // }
        //列表拖拽
        $scope.dropComplete = function (index, obj, event) {
            //重新排序
            var idx = $scope.selecedPoints.indexOf(obj);
            $scope.selecedPoints.splice(idx, 1);
            $scope.selecedPoints.splice(index, 0, obj);
            resetFenceColor()


        };

        $scope.save = function () {
            if ($scope.selecedPoints.length == 0) {
                alert('请选择巡查点');
                return
            }
            var modal = $uibModal.open({
                animation: false,
                size: 'md',
                templateUrl: '/view/inspection/modal.addPatrolWay.html',
                controller: 'insitemSelectorCtrl',
                resolve: {
                    data: {
                        parkId: $scope.search.parkId,
                        equipmentList: $scope.selecedPoints,
                        insWayId: $scope.search.insWayId || ''
                    }
                }

            });
            modal.result.then(function (data) {
                findAllWay();
                $scope.startAddWay = false
            });


        }
        $scope.$on("$destroy", function () {
            $rootScope.mapWayObj.map=null;
          
        })

    });
    app.controller('insitemSelectorCtrl', function ($scope, $rootScope, $http, $uibModal, $uibModalInstance, $timeout, $filter, fac, data) {
        $scope.item = {}
        $scope.item.timeList = [];
        $scope.item.captureNum=1;
        fac.loadSelect($scope, "VIDEO_INSPECTION_WAY_CLASSIFY");
        if (fac.isNotEmpty(data.insWayId)) {
            $http.get('/ovu-pcos/pcos/videoinspection/way/get/' + data.insWayId, fac.postConfig).success(function (resp) {
                if (resp.code == 0) {
                    $scope.item.wayName = resp.data.wayName
                    $scope.item.captureNum = resp.data.captureRule.captureNum
                    var list = (resp.data.captureRule.captureTime && resp.data.captureRule.captureTime.split(',')) || [];
                    list.forEach(function (v) {
                        $scope.item.timeList.push({ time: v })
                    })
                }

            })
        }
        $scope.addTime = function () {
            $scope.item.timeList.push({
                time: ''
            });
        }
        $scope.delTime = function (i) {
            $scope.item.timeList.splice($scope.item.timeList.indexOf(i), 1);
        }


        //保存
        $scope.save = function (form) {
            form.$setSubmitted(true);
            if (!form.$valid) {
                return;
            }
            var arr = [];
            var captureTime = ''
            $scope.item.timeList.forEach(function (v) {
                arr.push(v.time);
            });
            captureTime = arr.join(',')
            var equipmentList = []
            data.equipmentList.forEach(function (v) {
                equipmentList.push({ equipmentId: v.equipmentId, equipmentSimpleName: v.equipmentSimpleName, type: 2 });
            });
            var parm = {
                insWayId: data.insWayId,
                wayName: $scope.item.wayName,
                captureRule: { captureNum: $scope.item.captureNum, captureTime: captureTime },
                parkId: data.parkId,
                equipmentList: equipmentList,
                wayClassify:$scope.item.wayClassify
            }
            $http.post("/ovu-pcos/pcos/videoinspection/way/edit", parm).success(function (resp) {
                if (resp.code == 0) {
                    $uibModalInstance.close();
                    msg(resp.msg);

                } else {
                    alert(resp.msg);
                }

            });

        }

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    });

})()
