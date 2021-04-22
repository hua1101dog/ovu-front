/**
 * Created by Zn on 2018/1/4.
 */
(function () {
    "use strict";
    var app = angular.module("angularApp");

    app.controller('controlCtrl', function ($scope, $rootScope, $uibModal, $state, $http, $filter, fac) {
        document.title = '设备房监控'
        
        $scope.STAGE = {};
    	$scope.BUILD = {};
    	$scope.UNIT = {};
    	$scope.FLOOR = {};
    	$scope.HOUSE = {};
        app.modulePromiss.then(function () {
            $scope.search = {};
            $scope.pageModel = {};
            // $scope.$watch('park', function(newValue, oldValue) {
            //     if (newValue && newValue.id) {
            //         $scope.search.parkId = newValue.id;
            //         $scope.search.parkName = newValue.parkName;
            //         $scope.selectEquipRoom();
            //         $scope.find();
            //     } else {
            //         alert("请先选定一个项目");
            //     }
            // })
            $scope.$watch('dept.id', function (deptId, oldValue) {
                if (deptId) {
                    if ($scope.dept.parkId) {
                        $scope.search.parkId = $scope.dept.parkId;
                        $scope.selectEquipRoom();
                        initSpaceTree();
                        $scope.find();
                    } else {
                        alert('请选择跟项目关联的部门');
                        return
                    }

                }
            })
        })
        $scope.selectEquipRoom = function () {
            $http.post('/ovu-pcos/pcos/equiphouse/getHouseListName', $scope.search, fac.postConfig).success(function (data) {
                $scope.equipNameArr = data;
                
                //初始化select2
        		$(".ui-select2").select2({width:"resolve"});
                $scope.equipNameArrSel2 = [{id:"",text:"---请选择---"}];
                data && data.forEach(function(item){
                	$scope.equipNameArrSel2.push({id:item.equipHouseId,text:item.equipHouseName});
                });
                $(".ui-select2").select2({data:$scope.equipNameArrSel2});
            })
        }
        $scope.find = function (pageNo) {
            if(!$rootScope.dept ||!$rootScope.dept.id){
                alert("请选择部门！");
                return false;
            }
            
            setSpaceCondtion();
            
            $.extend($scope.search, {
                currentPage: pageNo || 1,
                pageSize: $scope.pageModel.pageSize || 10
            });
            $scope.search.pageIndex = $scope.search.currentPage - 1;
            fac.getPageResult("/ovu-pcos/pcos/equiphouse/getEquipHouseImg", $scope.search, function (data) {
                if (data.data) {
                    data.data.forEach(function (v) {
                        var arr = [{
                            val: '+',
                            unit: ''
                        }, {
                            val: '+',
                            unit: ''
                        }, {
                            val: '+',
                            unit: ''
                        }, {
                            val: '+',
                            unit: ''
                        }];
                        v.sensorData.forEach(function (k) {
                            k && k.boxNumber && (arr[k.boxNumber - 1] = k);
                        })
                        v.sensorData = arr;
                        v.url = v.houseImgs && v.houseImgs[0] && v.houseImgs[0].screenUrl;
                        v.selected = 0;
                    })
                }
                $scope.pageModel = data;
            });
        }
        /* $scope.picArr=['/image/dome.png','/image/dy.png'];
         $scope.picSrc='/image/dome.png';*/
        /*$scope.selected=0;*/
        $scope.togglePic = function (itemPic, index, item) {
            item.url = itemPic.screenUrl;
            /*item.url='/image/dome.png';*/
            item.selected = index;
        }
        $scope.seeHistoryVideo = function (item) {
            sessionStorage.setItem("equipHouseId", item.equipHouseId);
            $state.go('admin', {
                folder: 'equipmentroom',
                page: 'equipHistoryVideo'
            });
        }
        $scope.goEquipInform = function (item) {
            sessionStorage.setItem("equipName", item.equipHouseName);
            sessionStorage.setItem("equipHouseId", item.equipHouseId);
            sessionStorage.setItem("houseId", item.houseId);
            // $state.go('admin', {
            //     folder: 'equipmentroom',
            //     page: 'equipInform'
            // });
            $rootScope.target('/equipmentroom/equipInform','设备房概览详情',false,'','','/equipmentroom/equipInform')

        }
        $scope.selectedParam = function (item, boxNumber) {
            var param = {
                houseId: item.houseId,
                boxNumber: boxNumber,
                equipHouseId: item.equipHouseId
            }
            var modal = $uibModal.open({
                animation: false,
                size: 'lg',
                templateUrl: '/view/equipmentroom/modal.checkParamSelected.html',
                controller: 'checkParamSelectedCtrl',
                resolve: {
                    param: param
                }
            });
            modal.result.then(function (data) {
                /*item['param'+index]=data.val+data.unit;*/
                $scope.find($scope.search.pageIndex + 1);
            }, function () {
                console.info('Modal dismissed at: ' + new Date());
            });
        };
        
        function initSpaceTree(){
        	$scope.STAGE = {};
        	$scope.BUILD = {};
        	$scope.UNIT = {};
        	$scope.FLOOR = {};
        	$scope.HOUSE = {};
        	$scope.HOUSES = [];
        	$http.post("/ovu-base/system/parkStage/treeNew",{parkId:$scope.search.parkId,level:4},fac.postConfig).success(function(ret){
        		$scope.treeData = ret;
        	})
        }
        $scope.HOUSES = [];
        $scope.selectFloor = function(){
        	setSpaceCondtion();
        	$http.post("/ovu-base/system/parkHouse/getHouses",{buildId:$scope.search.buildId,
        		unitNo:$scope.search.unitNo,groundNo:$scope.search.groundNo},fac.postConfig).success(function(ret){
        		$scope.HOUSES = ret.data;
        	})
        }
        function setSpaceCondtion(){
        	if($scope.STAGE){
        		$scope.search.stageId = $scope.STAGE.id;
        	}else{
        		delete $scope.search.stageId;
        	}
        	if($scope.BUILD){
        		$scope.search.buildId = $scope.BUILD.id;
        	}else{
        		delete $scope.search.buildId;
        	}
        	if($scope.UNIT && $scope.UNIT.data){
        		$scope.search.unitNo = $scope.UNIT.data.unitNo;
        	}else{
        		delete $scope.search.unitNo;
        	}
        	if($scope.FLOOR && $scope.FLOOR.data){
        		$scope.search.groundNo = $scope.FLOOR.data.floorNo;
        	}else{
        		delete $scope.search.groundNo;
        	}
        	if($scope.HOUSE){
        		$scope.search.houseId = $scope.HOUSE.id;
        	}else{
        		delete $scope.search.houseId;
        	}
        }
        
    });
    app.controller('checkParamSelectedCtrl', function ($scope, $http, $uibModal, $uibModalInstance, $filter, fac, param) {
        $scope.pageModel = {};
        $scope.search={
            houseId:param.houseId
        }
       $scope.find = function (pageNo) {
            $.extend($scope.search, {currentPage: pageNo || 1,pageSize:$scope.pageModel.pageSize|| 10 });
            $scope.search.pageIndex = $scope.search.currentPage - 1;
            fac.getPageResult("/ovu-pcos/pcos/equiphouse/getEquipHouseAllSensor", $scope.search,function (data) {
                $scope.pageModel = data;
            });
        }
        $scope.find(1)
        $scope.save = function () {
            var item = $scope.pageModel.data.find(function (v) {
                return v.checked == true;
            })
            param.equipId = item.equipId;
            param.paramId = item.paramId;
            param.sensorId = item.sensorId;
            $http.post('/ovu-pcos/pcos/equiphouse/saveHouseParam', param, fac.postConfig).success(function (data) {
                if (data.status) {
                    msg(data.msg);
                    $uibModalInstance.close(item);
                } else {
                    alert();
                }
            })
        }
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
        $scope.checkOne = function (item, data) {
            data.forEach(function (v) {
                v.checked = false;
            })
            item.checked = !item.checked;
        }
    })
})();
