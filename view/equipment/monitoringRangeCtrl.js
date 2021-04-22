(function () {
    "use strict";
    var app = angular.module("angularApp");
    app.service('AppService', function ($http, fac) {
        var that = this;
        this.park = {  parkName: '',parkId:'' };
        //项目编号
     
        this.isAddWay=false
        this.onlyIndoorMap = true;
    });
    app.controller('monitoringRangeCtrl', function ($scope, $rootScope, AppService, $http, $filter, $uibModal, fac, $timeout) {
        document.title = "监控覆盖范围设置";
       
        $scope.pageModel = [];
        $scope.lastPageModel = {};
        $scope.lastNull = false;
        $scope.mapData={
            name:"cytdRange"+ new Date().getTime(),
            timeStr:new Date().getTime()
        }
        $scope.search = {};
        var iconList = ['/res/img/WechatIMG1240.png', '/res/img/WechatIMG1239.png', '/res/img/WechatIMG1239.png','/res/img/WechatIMG1239.png','/res/img/WechatIMG1239.png']
        //地图初始化
        AppService.park = { parkName: '' ,parkId:''};
     
        app.modulePromiss.then(function () {
            $rootScope.$watch('dept.id', function (deptId, oldValue) {
                if (deptId) {
                    var parkDept = fac.getParkDept(null, deptId);
                    if (parkDept) {
                        $scope.search.parkId = parkDept.parkId;
                        $scope.search.parkName = parkDept.parkName
                    }else{
                        $scope.search.parkId="";
                        $scope.search.parkName=""
                    }
                    reloadMap();                    
                }
            })
        });
        // 地图加载完成，开始打点
        $rootScope.$on('loadCompleteMap'+$scope.mapData.timeStr, (evt, map) => {
            console.log(map)
            $rootScope.mapObj = map;
            map && $scope.find(true);
        })
        //绑定摄像头
        $rootScope.$on('bindCamera'+$scope.mapData.timeStr, (evt, pointInfo) => {
            openbindCamera(pointInfo)
        })       
        //选中or取消灯杆，改变灯杆图标
        $rootScope.$on('changeMarker'+$scope.mapData.timeStr, (evt, selEquipmentId) => {
            refreshMarker(selEquipmentId)
        })
        let openbindCamera = function (pointInfo) {
            var camera = $scope.pageModel.find(function (item) {
                return item.equipmentId ==pointInfo.equipmentId;
            })
            if(camera){
                var modal = $uibModal.open({
                    animation: true,
                    size: '',
                    templateUrl: 'selCamera.html',
                    controller:'selCameraCtrl',
                    resolve: { data:{cameraList:camera.cameraList,points:pointInfo.points,bindCameraId:pointInfo.bindCameraId}}
                    
                });
                modal.result.then(function (data) {
                    $scope.find(false);
                }, function () {
                    console.info('Modal dismissed at: ' + new Date());
                });

            }
        }
        function refreshMarker(selEquipmentId){
            var datas = [];
            $scope.pageModel.forEach(function (item) {
                if (item.longitude && item.latitude) {
                    let len = item.cameraList ? item.cameraList.length : 0
                    datas.push({
                        equipmentName: item.equipmentSimpleName,
                        equipmentId: item.equipmentId,
                        floor: '创意天地',
                        longitude: item.longitude,
                        latitude: item.latitude,
                        content: item.equipmentSimpleName,
                        icon: len>2?iconList[2]:iconList[len],
                        haveCamera: len ? true : false
                    });
                }
            })
            if(selEquipmentId){
                var findData=datas.find(function(v){return v.equipmentId==selEquipmentId})
                findData.icon=(findData.icon==iconList[2]?iconList[4]:iconList[3])
            }
            $rootScope.mapObj.addCameraMarker(datas,$rootScope.mapObj.map)
       }

        //列表查询
        $scope.find = function (isFresh) {
            //项目判断
            // if (!fac.hasSpecialPark($scope.search)) {
            //     return;
            // }
            $http.post("/ovu-pcos/pcos/equipment/cameraShootingRange/getCamera", $scope.search).success(function (resp) {

                if (resp.code == 0) {
                    var datas = [];
                    var ranges= [];
                    var selCameraInfo={}
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
                                icon: len>2?iconList[2]:iconList[len],
                                haveCamera: len ? true : false
                            });
                            if(item.cameraList&&item.cameraList.length>0){
                                item.cameraList.forEach(v => {
                                    if(v.coordinates){
                                        let pointArr=JSON.parse(v.coordinates);
                                        let points=[]
                                        pointArr.forEach(p => {points.push([p.longitude,p.latitude])})
                                        ranges.push({
                                            equipmentName: item.equipmentSimpleName,
                                            equipmentId: item.equipmentId,
                                            bindCameraId:v.equipmentId,
                                            bindCameraName:v.equipmentSimpleName,
                                            points:points,
                                        })
                                        // if(selCameraId&&v.equipmentId==selCameraId){
                                        //     selCameraInfo={
                                        //         position:{x:pointArr[0].longitude,y:50,z:pointArr[0].latitude},
                                        //         title:item.equipmentSimpleName+"-"+v.equipmentSimpleName
                                        //     }
                                        // }
                                    }
                                   
                                      
                                })
                            }
                           

                        }
                    });
                    if(isFresh){
                        $rootScope.mapObj.addCameraMarker(datas,$rootScope.mapObj.map)
                    }
                    $rootScope.mapObj.addRangesMarker(ranges,$rootScope.mapObj.map)

                }
            });
        };

        function reloadMap() {
            //加载地图
           
            AppService.isAddWay=false
            AppService.park = { parkName: $scope.search.parkName,parkId:$scope.search.parkId };
            //项目编号
             
            $scope.$broadcast("reloadMap"+window.location.hash);
        }
        $scope.$on("$destroy", function () {
            $rootScope.mapObj.map=null;
            console.log("页面被销毁")
        })

    });
    app.controller('selCameraCtrl', function ($scope, $rootScope, $http, $uibModalInstance, $filter, fac, data) {

        $scope.cameraList=data.cameraList
        var points=data.points
        var lastSelId;
        
        $scope.checkOne = function (item) {
            if ( $scope.cameraList &&  $scope.cameraList.length) {
                $scope.cameraList.forEach(function (n) { n.checked = false });
            }
            item.checked = !item.checked;
        }
        if(data.bindCameraId){
            var findVal=$scope.cameraList.find(function(v){
                  return data.bindCameraId==v.equipmentId
            })
            lastSelId=findVal.id
            $scope.checkOne(findVal)
        }
        $scope.delete = function () {
            if(lastSelId){
                $http.get("/ovu-pcos/pcos/equipment/cameraShootingRange/delete/" + lastSelId, fac.postConfig).success(function (resp) {
                    if (resp.code == 0) {
                        window.msg(resp.msg);
                        $uibModalInstance.close();
                    }else{
                        alert(resp.msg)
                    }
                });
            }else{
                $uibModalInstance.close();
            }     
        }
        $scope.save = function () {
            var selectCamera = $scope.cameraList.find(function (d) {
                return d.checked
            });
            if (!selectCamera) {
                alert("请选择一个摄像头！")
                return
            }
            let coordinates=[]
            points.forEach(v => {coordinates.push({longitude:v[0],latitude:v[1] })});
            var param={
                equipmentId:selectCamera.equipmentId,
                coordinates:JSON.stringify(coordinates),
                id:lastSelId
            }
            $http.post("/ovu-pcos/pcos/equipment/cameraShootingRange/edit",param).success(function (resp) {
                if (resp.code == 0) {
                    window.msg(resp.msg);
                    $uibModalInstance.close({selCameraId:selectCamera.equipmentId});
                }else{
                    alert(resp.msg)
                }
            });

            
        }
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        }
    });

})();
