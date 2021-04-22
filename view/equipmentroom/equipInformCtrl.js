/**
 * Created by Zn on 2018/1/3.
 */
(function () {
    "use strict";
    var app = angular.module("angularApp");

    app.controller('informCtrl', function ($scope, $rootScope, $uibModal, $state, $http, $filter, fac) {

        app.modulePromiss.then(function () {
            $scope.search = {
                houseId: sessionStorage.getItem('houseId'),
                equipHouseId:sessionStorage.getItem('equipHouseId')
            }
            $scope.pageModel = {};
            $scope.equipHouseId=sessionStorage.getItem('equipHouseId')
            $scope.equipName = sessionStorage.getItem('equipName');
            // $scope.$watch('park', function (newValue, oldValue) {
            //     if (newValue && newValue.id) {
            //         $scope.search.parkId = newValue.id;
            //         $scope.search.parkName = newValue.parkName;
            //         $scope.videoControl();
            //         $scope.getHouseSensorData();
            //         $scope.getEquipCategory();
            //         $scope.find();
            //     } else {
            //         alert("请先选定一个项目");
            //     }
            // })
            $scope.$watch('dept.id', function (deptId, oldValue) {
                if (deptId) {
                    if ($scope.dept.parkId) {
                        $scope.search.parkId = $scope.dept.parkId;
                        $scope.videoControl();
                                $scope.getHouseSensorData();
                                $scope.getEquipCategory();
                                $scope.find();
                    } else {
                        alert('请选择跟项目关联的部门');
                        return
                    }

                }
            })
            $.get('/ovu-pcos/api/video/getCameras.do',{equipmentId: $scope.equipHouseId},function(res){
                if(res.code ==0 ){
                    //摄像头列表
                    $scope.cameraList=res.data
                }
            })
        })
        
        $scope.equipStatus = [[1, "运行"], [2, "停用"], [3, "故障"], [4, "报废"]];
        $scope.isRegular = [[1, "是"], [2, "否"]];
        $scope.videoControl=function () {
            $http.post('/ovu-pcos/pcos/equiphouse/getHouseVideo', $scope.search,fac.postConfig).success(function (data) {
                $scope.deviceId=data;
            })
        }
        $scope.getHouseSensorData = function () {
            $http.post('/ovu-pcos/pcos/equiphouse/getHouseSensorData', $scope.search, fac.postConfig).success(function (data) {
                $scope.sensorData = data;
            })
        }
        $scope.getEquipCategory = function () {
            $http.post('/ovu-pcos/pcos/equiphouse/getEquipTypeList', {houseId: sessionStorage.getItem('houseId')}, fac.postConfig).success(function (data) {
                $scope.equipCategory = data;
            })
        }
        $scope.find = function (pageNo) {
            if(!$rootScope.dept ||!$rootScope.dept.id){
                alert("请选择部门！");
                return false;
            }
            $.extend($scope.search, {currentPage: pageNo || 1, pageSize: $scope.pageModel.pageSize || 10});
            $scope.search.pageIndex = $scope.search.currentPage - 1;
            fac.getPageResult("/ovu-pcos/pcos/equiphouse/getInnerEquip", $scope.search, function (data) {
                $scope.pageModel=data;
                })
        }

        $scope.enterInformModal = function (item) {
            item.parkId=$scope.search.parkId;
            var param=item;
            var modal=$uibModal.open({
                animation: false,
                size: 'lg',
                templateUrl: '/view/equipmentroom/modal.equipInform.html',
                controller: 'equipmentInformModalCtrl',
                resolve:{param:param}
            });
            modal.result.then(function (){
                $scope.find();
            })
        }
        $scope.seeHistoryData = function () {
            var param={equipHouseId:sessionStorage.getItem('equipHouseId')};
            $uibModal.open({
                animation: false,
                size: 'md',
                templateUrl: '/view/equipmentroom/modal.historyData.html',
                controller: 'historyDataModalCtrl',
                resolve:{param:param}
            });
        }
        $scope.goback = function () {
            // $state.go('admin', {folder: 'equipmentroom', page: 'equipOverview'});
        }
        $scope.seeHistoryVideo=function () {
            $state.go('admin', {folder: 'equipmentroom', page: 'equipHistoryVideo'});
        }
    });
    app.controller('historyOrderCtrl', function ($scope, $rootScope, $uibModal, $state, $http, $filter, fac) {
        app.modulePromiss.then(function() {
            $scope.search={
                houseId: sessionStorage.getItem('houseId'),
                unitStatus:8
            };
            $scope.pageModel={};
            // $scope.$watch('park', function(newValue, oldValue) {
            //     if (newValue && newValue.id) {
            //         $scope.search.parkId = newValue.id;
            //         $scope.search.parkName = newValue.parkName;
            //         $scope.find();
            //     } else {
            //         alert("请先选定一个项目");
            //     }
            // })
            $scope.$watch('dept.id', function (deptId, oldValue) {
                if (deptId) {
                    if ($scope.dept.parkId) {
                        $scope.search.parkId = $scope.dept.parkId;
                                $scope.find();
                    } else {
                        alert('请选择跟项目关联的部门');
                        return
                    }

                }
            })
        })
        $scope.find = function (pageNo) {
            $.extend($scope.search, {currentPage: pageNo || 1, pageSize: $scope.pageModel.pageSize || 10});
            $scope.search.pageIndex = $scope.search.currentPage - 1;
            fac.getPageResult("/ovu-pcos/pcos/equiphouse/getHouseWorkUnit", $scope.search, function (data) {
                $scope.pageModel = data;
            });
        };
        //查看回访详情
        $scope.showReturnVisit = function(id){
            $uibModal.open({
                animation: false,
                templateUrl: '../view/workunit/modal.showReturnVisit.html',
                size:'lg',
                controller: 'showReturnVisitModalCtrl',
                resolve: {
                    id: function(){return id;}
                }
            });
        }
    });
    app.controller('equipmentInformModalCtrl', function ($scope, $rootScope,$timeout, $uibModalInstance, $uibModal, $state, $http, $filter, fac,param) {
        $scope.equipName=param.equipName;
        $scope.equipCode=param.equipCode;
        $scope.pageModel={};
        $scope.paramSearch={
            equipId:param.equipId,
            parkId:param.parkId,
            equipmentId:param.equipId,
            unitStatus:8
        }
        console.log()
        $rootScope.workTypeChange = function (workTypeId) {
            $scope.workItemDict = [];
            workTypeId && $http.get("/ovu-pcos/pcos/workunit/listWorkitem.do?worktypeId=" + workTypeId).success(function (resp) {
                $scope.workItemDict = resp;
            });
        }
        $scope.chooseWorkType = function () {
            modalWork.open({
                callback: function (node) {
                    if (node.tid == 0) {
                        delete $scope.paramSearch.WORKTYPE_ID;
                        delete $scope.paramSearch.WORKTYPE_NAME;
                        $scope.workItemDict = [];
                        delete $scope.paramSearch.WORKITEM_ID;
                    }else{
                        if (node.nodes && node.nodes.length) {
                            alert("请选择子节点！");
                            return;
                        }else{
                            if (node.tid && node.text) {
                                $scope.paramSearch.WORKTYPE_ID = node.tid;
                                $scope.paramSearch.WORKTYPE_NAME = node.text;
                                $rootScope.workTypeChange($scope.paramSearch.WORKTYPE_ID)
                            }
                        }
                    }
                    $scope.$apply();
                    modalWork.close();
                },
                selectedId: $scope.paramSearch.WORKTYPE_ID
            });
        }
        /*$scope.chooseWorkType = function() {
            modalWork.open({
                callback: function(node) {
                    if (node.tid && node.text) {
                        $timeout(function () {
                            $scope.paramSearch.WORKTYPE_ID = node.tid;
                            $scope.paramSearch.WORKTYPE_NAME = node.text;
                                $rootScope.workTypeChange($scope.paramSearch.WORKTYPE_ID)
                            }
                    if (node.tid == 0) {
                    }
                    }
                    $scope.$apply();
                    modalWork.close();
                },
                selectedId: $scope.paramSearch.WORKTYPE_ID
            });
        }*/
        $scope.isRegular=[[1,'正常'],[2,'异常']];
        $scope.seeInform=function () {
         $http.post('/ovu-pcos/pcos/equipment/get',{id:param.equipId},fac.postConfig).success(function (data) {
             $scope.equipInform=data.data;
         })
        }
        $scope.seeInform();
        $scope.paramAddShow=function () {
            $http.post('/ovu-pcos/pcos/equiphouse/param/list',$scope.paramSearch,fac.postConfig).success(function (data) {
                $scope.paramAddData=data;
            })
        }
        $scope.paramAddShow();
        $scope.paramAdd=function () {
            if($scope.paramSearch.paramName!=undefined&&$scope.paramSearch.paramVal!=undefined){
                $http.post('/ovu-pcos/pcos/equiphouse/param/edit',$scope.paramSearch,fac.postConfig).success(function (data) {
                    if(data.status){
                        $scope.isClick=true;
                        msg(data.msg);
                        $scope.paramSearch.paramName='';
                        $scope.paramSearch.paramVal='';
                        $scope.paramAddShow();
                    }
                    else {
                        alert(data.msg);
                    }
                })
            }
            else {
                alert('请输入完整');
            }

        }
        $scope.paramDel=function (item) {
            confirm('是否删除',function () {
                $http.post('/ovu-pcos/pcos/equiphouse/param/del',{id:item.id},fac.postConfig).success(function (data) {
                    if(data.status){
                        msg(data.msg);
                        $scope.paramAddShow();
                        $scope.paramSearch.paramName='';
                        $scope.paramSearch.paramVal='';
                    }
                    else {
                        alert();
                    }
                })
            })
        }
        $scope.seeTask=function () {
            fac.getPageResult("/ovu-pcos/pcos/worktask/listByGrid", $scope.paramSearch, function (data) {
                $scope.pageModel = data;
            });
        }
        $scope.seeOrder=function (pageNo) {
            $.extend($scope.paramSearch, {currentPage: pageNo || 1, pageSize: $scope.pageModel.pageSize || 10});
            $scope.paramSearch.pageIndex = $scope.paramSearch.currentPage - 1;
            fac.getPageResult("/ovu-pcos/pcos/equiphouse/getHouseWorkUnit", $scope.paramSearch, function (data) {
                $scope.pageModel = data;
            });
        }
        $scope.seeSensorData=function () {
            $http.post('/ovu-pcos/pcos/equiphouse/getEquipSensorData',$scope.paramSearch,fac.postConfig).success(function (data) {
                $scope.sensorData=data;
            })
        }
        $scope.seeSensorData();
        $http.post('/ovu-pcos/pcos/equiphouse/getSensorType',{equipHouseId:param.equipId},fac.postConfig).success(function (data) {
            /*$scope.paramSearch.itemId=data[0].itemId;*/
            $scope.itemArr=data;
        })
        var isFirst=true;
        $scope.historyQuery=function (item,pageNo) {
           /* //当参数栏的下拉框选择空，则paramId和sensorId都不存在，查所有
            if($scope.paramSearch.paramId==null){
                $scope.paramSearch.sensorId='';
            }*/
            $scope.selected=4;
          /*  if(!item){
                item = $scope.paramSearch.selectedParam;
            }*/
          if(!item && isFirst){
              //点击历史查询给paramId和sensorId赋第一个对象的值，isFirst开始为true，这里只进一次，当切换参数栏时，paramId和sensorId会跟着切换以至于不会重新进入此逻辑而固定这两个参数为上一次的值
              if(!fac.isEmpty(param.sensorData)){
                  param.sensorData[0].paramId==undefined?$scope.paramSearch.paramId='':$scope.paramSearch.paramId=param.sensorData[0].paramId;
                  param.sensorData[0].sensorId==undefined?$scope.paramSearch.sensorId='':$scope.paramSearch.sensorId=param.sensorData[0].sensorId;
                  isFirst=false;
              }
          }
            if(item){
                $scope.paramSearch.sensorId=item.sensorId;
                $scope.paramSearch.paramId=item.paramId;
            }
          $scope.paramSearch.equipHouseId=param.equipId;
        $http.post('/ovu-pcos/pcos/equiphouse/getSensorType',{equipHouseId:param.equipId},fac.postConfig).success(function (data) {
            /*$scope.paramSearch.itemId=data[0].itemId;*/
            $scope.itemArr=data;
            if(!fac.isEmpty(data)){
                data.forEach(function (v) {
                    //判断选择的是哪个paramId,然后给sensorId赋相对应的值
                    if(v.paramId==$scope.paramSearch.paramId){
                        $scope.paramSearch.sensorId=v.sensorId;
                        $.extend($scope.paramSearch, {currentPage: pageNo || 1, pageSize: $scope.pageModel.pageSize || 10});
                        $scope.paramSearch.pageIndex = $scope.paramSearch.currentPage - 1;
                        fac.getPageResult("/ovu-pcos/pcos/equiphouse/getDetectHistory", $scope.paramSearch, function (data) {
                            $scope.pageModel = data;
                        });
                    }
                })
            }
        })
        }
        //查看回访详情
        $scope.showReturnVisit = function(id){
            $uibModal.open({
                animation: false,
                templateUrl: '../view/workunit/modal.showReturnVisit.html',
                size:'lg',
                controller: 'showReturnVisitModalCtrl',
                resolve: {
                    id: function(){return id;}
                }
            });
        }
        $scope.cancel = function () {
            if($scope.isClick){
                $uibModalInstance.close('cancel');
            }
            else {
                $uibModalInstance.dismiss('cancel');
            }
        };
    });
    app.controller('historyDataModalCtrl', function ($scope, $rootScope, $uibModalInstance, $uibModal, $state, $http, $filter, fac,param) {
        $scope.search={
            equipHouseId:param.equipHouseId
        };
        $scope.pageModel={};
        $scope.isRegular=[[1,'正常'],[2,'异常']];
        $http.post('/ovu-pcos/pcos/equiphouse/getSensorType',$scope.search,fac.postConfig).success(function (data) {
            $scope.nameArr = data;
            $scope.search.sensorId=$scope.nameArr[0].sensorId;
            $scope.search.paramId=$scope.nameArr[0].paramId;
            $scope.find();
        })
        $scope.toggleTab = function (id) {
            $scope.selected = id;
            $scope.search.sensorId=$scope.nameArr[id].sensorId;
            $scope.search.paramId=$scope.nameArr[id].paramId;
            $scope.search.startDate='';
            $scope.search.endDate='';
            $scope.search.isRegular='';
            $scope.find();
        }
        $scope.find=function (pageNo) {

            $.extend($scope.search, {currentPage: pageNo || 1, pageSize: $scope.pageModel.pageSize || 10});
            $scope.search.pageIndex = $scope.search.currentPage - 1;
            fac.getPageResult("/ovu-pcos/pcos/equiphouse/getDetectHistory", $scope.search, function (data) {
                $scope.pageModel=data;
            })
        }
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    });
    //查看回访
    app.controller('showReturnVisitModalCtrl', function($scope,$uibModalInstance,$http,fac,id) {
        $scope.search={unitId:id};
        $scope.pageModel={};

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };

        $scope.find = function(pageNo){
            $.extend($scope.search,{currentPage:pageNo||$scope.pageModel.currentPage||1,pageSize:$scope.pageModel.pageSize||10});
            fac.getPageResult("/ovu-pcos/pcos/workunit_callback/list.do",$scope.search,function(data){
                $scope.pageModel = data;
            });
        }
        $scope.find();
    });
})();
