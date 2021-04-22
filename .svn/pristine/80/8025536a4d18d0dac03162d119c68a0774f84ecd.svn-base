
(function () {
    "use strict";
    var app = angular.module("angularApp");

    // 计量点Controller
    app.controller('energyPointCtrl', function ($scope, $rootScope, $sce, $uibModal, $http, $filter, fac) {
        document.title = '计量点管理';
        $scope.pageModel = {};
        $scope.search = {};
        $scope.hasPark=true;

        // 页面初始化
        app.modulePromiss.then(function () {
            $scope.$watch('dept.id', function (deptId, oldValue) {
                if (deptId) {
                    if ($scope.dept.parkId) {
                        $scope.search.parkId = $scope.dept.parkId;
                        $scope.search.parkName = $scope.dept.parkName;
                        $scope.init();
                    } else {
                        alert('请选择跟项目关联的部门');
                        $scope.search.parkId &&  delete $scope.search.parkId
                        $scope.search.parkName &&  delete $scope.search.parkName;

                    }

                }

            })
        })

        $scope.init = function () {
            selectClassify();
            $scope.find();
        }

        function selectClassify() {
            $http.get("/ovu-energy/energy/classify/list.do").success(function (data) {
                $scope.measureCategory = data.data;
                
            });
            $http.get("/ovu-energy/energy/point/ratioList?parkId="+$scope.search.parkId).success(function (data) {
                $scope.radioList = data.data;
               

            });
           
        }

        $scope.changeCategory = function (id) {

            $http.get("/ovu-energy/energy/item/list", {
                params: {
                    classifyId: id
                }
            }).success(function (data) {
                $scope.fenXiangList = data.data;
            });

        }

        // 查询
        $scope.find = function (pageNo) {
            if (!$rootScope.dept || !$rootScope.dept.id) {
                alert("请选择部门！");
                return false;
            }
            $.extend($scope.search, {
                currentPage: pageNo || 1,
                pageSize: $scope.pageModel.pageSize || 10
            });
            $scope.search.pageIndex = $scope.search.currentPage - 1;
            fac.getPageResult("/ovu-energy/energy/point/list", $scope.search, function (data) {
                var pageModel = data;
                if (pageModel.data != undefined) {
                    pageModel.data = pageModel.data.map(function (item) {
                        item.spaceName = item.spaceName && $sce.trustAsHtml(item.spaceName.split(",").map(function (v, i) {
                            return (i + 1) + '.' + v;
                        }).join('<br>'));
                        return item;
                    })
                }
                $scope.pageModel = pageModel;
            });
        }
        // 修改计量点
        $scope.showEditModal = function (item) {
            var param = {
                item: item === undefined ? item = {
                    pointId: undefined,
                    readWay: 1,
                    meterProtocol: 1,
                } : item,
                parkId: $scope.search.parkId,
                parkName: $scope.search.parkName
            };
            var modal = $uibModal.open({
                animation: false,
                size: 'lg',
                templateUrl: '/view/energy/energyPoint/modal.energyPointEdit.html',
                controller: 'EnergyPointEditModelCtrl',
                resolve: {
                    param: param
                }
            });
            modal.result.then(function () {
                $scope.find();
            }, function () {
                console.info('Modal dismissed at: ' + new Date());
            });
        }


        // 删除
        $scope.del = function (item) {
            confirm("删除此条数据后，需要重新添加数据，确认删除吗？", function () {
                $http.post("/ovu-energy/energy/point/delete", {
                    pointId: item.pointId
                }, fac.postConfig).success(function (data) {
                    if (data.code == 0) {
                        $scope.find();
                        msg("删除成功");
                    } else {
                        alert("失败");
                    }
                });
            });
        }
        //导出
        $scope.outputDo = function () {
            var pointIds = $scope.pageModel.list.reduce(function (ret, n) {
                n.checked && ret.push(n.pointId);
                return ret
            }, []).join(',');
            var parkId = $scope.search.parkId == undefined ? $scope.search.parkId = '' : $scope.search.parkId
            if (pointIds != '') {
              
                window.location.href = "/ovu-energy/energy/point/export?pointIds=" + pointIds + "&parkId=" + parkId;
            } else {
                alert("请勾选下面条目");
            }

           
        }

        //导入
        $scope.importExcel = function () {
            var param = {
                parkId: $scope.search.parkId
            };
            var modal = $uibModal.open({
                animation: false,
                //              size: '',
                templateUrl: '/view/energy/energyPoint/modal.energyPointImport.html',
                controller: 'energyPointImportCtrl',
                resolve: {
                    param: param
                }
            });
            modal.result.then(function () {
                $scope.find();
            }, function () {
                //              $scope.find();
            });
        }
        //导入结束

        //建档
        $scope.meterBuild = function () {
            var pointIds = $scope.pageModel.list.reduce(function (ret, n) {
                n.checked && ret.push(n.pointId);
                return ret
            }, []);
            if (pointIds !== '') {
              
                $http.get("/ovu-energy/energy/point/meterBuild?pointIds=" + pointIds).success(function (res) {
                    if (res.code == 0) {
                        msg(res.msg);
                    } else {
                        alert(res.msg);
                    }
                    $scope.find()
                })
            } else {
                alert("请勾选下面条目");
            }

        }

        // 启用或停用仪表
        $scope.editUseStatus = function(item,useStatus) {
            var titleMsg = "";
            if (useStatus == 1) {
                titleMsg = "确认启用仪表吗？"
            } else {
                titleMsg = "停用仪表后将不会采集仪表的数据,确认停用吗？"
            }
            confirm(titleMsg, function () {
                $http.post("/ovu-energy/energy/point/editUseStatus", {
                    pointId: item.pointId,
                    useStatus: useStatus
                }).success(function (res) {
                    if (res.code == 0) {
                        msg(res.msg);
                    } else {
                        alert(res.msg);
                    }
                    $scope.find()
                });
            });
        }
        $scope.setStatusAll=function(useStatus){
            var pointIds = $scope.pageModel.list.reduce(function (ret, n) {
                n.checked && ret.push(n.pointId);
                return ret
            }, []).join(',');
            // var titleMsg = "";
            // if (useStatus == 1) {
            //     titleMsg = "确认启用仪表吗？"
            // } else {
            //     titleMsg = "停用仪表后将不会采集仪表的数据,确认停用吗？"
            // }
            // confirm(titleMsg, function () {
            //     $http.post("/ovu-energy/energy/point/batchEditUseStatus", {
            //         ids: pointIds,
            //         useStatus: useStatus
            //     },fac.postConfig).success(function (res) {
            //         if (res.code == 0) {
            //             msg(res.msg);
            //         } else {
            //             alert(res.msg);
            //         }
            //         $scope.find()
            //     });
            // });
            var modal = $uibModal.open({
                animation: false,
                size: 'lg',
                templateUrl: '/view/energy/energyPoint/modal.setPnStatus.html',
                controller: 'setPnStatusCtrl',
                resolve: {
                    data: function () {return pointIds;}
                }
            });
            modal.result.then(function () {
                $scope.find();
            }, function () {
                console.info('Modal dismissed at: ' + new Date());
            });
         
            
        }
    });

    // 新增、修改Controller
    app.controller('EnergyPointEditModelCtrl', function ($scope, $http, $uibModal, $uibModalInstance, $filter, fac, param) {
        var operaObj = {};
        $scope.item = "";
        $scope.item = {
            parkId: param.parkId,
            readWay: 1,
            meterProtocol: 1,
            type:1,
            control:1
        };

        $scope.arrInform = [];

        // 修改回显
        if (param.item.pointId) {
            $scope.item.measureAdd = false;
            $http.post("/ovu-energy/energy/point/get", {
                pointId: param.item.pointId
            }, fac.postConfig).success(function (data) {
                $scope.item = data.data;
                $http.get("/ovu-energy/energy/classify/list.do").success(function (data) {
                    $scope.measureCategory = data.data;
                    $scope.measureCategory && $scope.measureCategory.forEach(function (v) {
                        if (v.classifyId == $scope.item.classifyId) {
                            $scope.item.meterProtocolType = v.type;
                        }

                    })
                });
                // $scope.changeCategory($scope.item.classifyId,)

                $http.post("/ovu-energy/energy/item/list", {
                    classifyId: $scope.item.classifyId
                }, fac.postConfig).success(function (data) {
                    $scope.fenXiangList = data.data;

                });


            });
        }

        // 选择空间
        $scope.contactSpace = function (item) {

             var copy=angular.extend(item,param)

            var modal = $uibModal.open({
                animation: false,
                size: 'lg',
                templateUrl: '/view/energy/energyPoint/modal.connectionSpace.html',
                controller: 'connectionSpaceModalCtrl',
                resolve: {
                    param: copy
                }
            });
            modal.result.then(function (data) {

                var dataObj = {};
                if ($scope.item.spaceName === undefined) {
                    $scope.item.spaceName = '';
                }
                //重新选择时保证带出来的spaceName不重复添加
                $scope.item.spaceName = '';
                var spaceList = [];
                for (var i = 0; i < data.length; i++) {
                    dataObj = {
                        stageId: data[i].stageId,
                        buildId: data[i].buildId,
                        unitNo: data[i].unitNo,
                        groundNo: data[i].groundNo,
                        houseId: data[i].houseId,
                        location: data[i].location,
                        scale:data[i].scale
                    };
                    $scope.item.spaceName = $scope.item.spaceName + "," + data[i].location;
                    spaceList.push(dataObj);
                }
                if ($scope.item.spaceName.substr(0, 1) === ',') {
                    $scope.item.spaceName = $scope.item.spaceName.substr(1);
                }
                operaObj = {
                    spaceList: spaceList
                };
            }, function () {

            });
        }

        $scope.equChange = function () {
            $scope.item.equipmentName  && delete $scope.item.equipmentName;
            $scope.item.equipmentId && delete $scope.item.equipmentId ;
            $scope.item.equipmentName && delete $scope.item.equipmentName
            $scope.item.equipmentCode && delete $scope.item.equipmentCode

        }

        $http.get("/ovu-energy/energy/classify/list.do").success(function (data) {
            $scope.measureCategory = data.data;
        });
        $scope.changeCategory = function (id) {
            // $scope.item.meterProtocolType=type;

            $scope.measureCategory.forEach(function (v) {
                if (v.classifyId == id) {
                    $scope.item.meterProtocolType = v.type;
                }

            })
            $http.post("/ovu-energy/energy/item/list", {
                classifyId: id
            }, fac.postConfig).success(function (data) {
                $scope.fenXiangList = data.data;

            });

        }
        param = {
            parkId: param.parkId,
            parkName: param.parkName,

        }



        $scope.chooseEquipment = function (item) {
            var copy = angular.extend({parkId:item.parkId}, item);
            copy = angular.extend(copy);
           if(item.readWay==1){
               //手动
            var modal = $uibModal.open({
                animation: false,
                size: 'lg',
                templateUrl: '/view/equipment/selector.equipment.html',
                controller: 'equipmentSelectorCtrl',
                resolve: {
                    data: function () {
                        return {
                            parkId: item.parkId,
                            equipment_id: item.equipmentId
                        };
                    }
                }
            });
            modal.result.then(function (data) {
                $scope.item.equipmentId = data.id;
                $scope.item.equipmentName = data.name;
                $scope.item.equipmentCode = data.equip_code;
                $scope.item.pointCode=data.equip_code.substring(17)
                // $scope.item.equipmentLocation = data.parkName + ' ' + data.stage_name + ' ' + data.floor_name + ' ' + data.house_name;
            });
           }else{
               //自动
            var modal = $uibModal.open({
                animation: false,
                size: 'max',
                templateUrl: '/view/energy/energyPoint/selector.equipment.html',
                controller: 'eqSelectorCtrl',
                resolve: {
                    task: copy
                }
            });
            modal.result.then(function (res) {
                $scope.item.equipmentId = res.id || res.deviceId;
                $scope.item.equipmentName = res.name || res.deviceId;
                $scope.item.equipmentCode = res.equip_code ||  res.deviceId
                // $scope.item.equipmentLocation = res.parkName + ' ' + res.stage_name + ' ' + res.floor_name + ' ' + res.house_name;

                $scope.item.pointCode= res.equip_code.substring(17) ||  res.deviceId
            });
           }
        }

        $scope.save = function (form, item) {

            form.$setSubmitted(true);
            if (!form.$valid) {
                return;
            }
            operaObj.pointId = item.pointId;
            operaObj.pointName = item.pointName;
            operaObj.pointCode = item.pointCode;
            //   operaObj.pointUnit=item.pointUnit;
            operaObj.parkId = item.parkId;
            operaObj.classifyId = item.classifyId;
            operaObj.itemId = item.itemId;
            operaObj.readWay = item.readWay;
            operaObj.equipmentId = item.equipmentId;
            operaObj.equipmentName = item.equipmentName;
            operaObj.equipmentCode = item.equipmentCode;
            operaObj.meterAddr = item.meterAddr;
            operaObj.meterProtocol = item.meterProtocol;
            operaObj.ratio = item.ratio;
            operaObj.lossRate = item.lossRate;
            operaObj.source=1;
            operaObj.type=item.type-0;
            operaObj.unitPrice=item.unitPrice;
            operaObj.initValue=item.initValue
            operaObj.control=item.control
            /*  operaObj.equipmentLocation=item.equipmentLocation;*/

            $http.post('/ovu-energy/energy/point/edit', operaObj).success(function (data) {
                if (data.code == 0) {
                    msg(data.msg);
                    $uibModalInstance.close();
                } else {
                    alert(data.msg);
                    $uibModalInstance.close();
                }
            });
        }
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };

    });


    app.controller('eqSelectorCtrl', function ($scope, $http, $uibModal, $uibModalInstance, $filter, fac, task) {
        $scope.config = {
            edit: false
        };
        $scope.index=1;

        $scope.search = {
            parkId: task.parkId,
            deptId: task.deptId,
            preSetEquipType: task.preSetEquipType,
        };
        task.equipmentId && $http.get("/ovu-pcos/pcos/equipment/get.do?id=" + task.equipmentId).success(function (data) {
            $scope.curEquip = data;
        })

        $scope.pageModel = {};
        var url=''

        $scope.find = function (pageNo) {
            if($scope.index==1){
                url='/ovu-pcos/pcos/equipment/queryByPage.do'
               }else{
               url='/ovu-energy/energy/deviceList.do'
               }
            //    $scope.search.currentPage  && delete $scope.search.currentPage;
            //    $scope.search.pageSize  && delete $scope.search.pageSize;
            //    $scope.search.pageIndex  && delete $scope.search.pageIndex;
            $.extend($scope.search, {
                currentPage: pageNo || $scope.pageModel.currentPage || 1,
                pageSize: $scope.pageModel.pageSize || 10
            });
            var param=angular.extend({},$scope.search);
            param.totalCount  && delete param.totalCount
            $scope.search.pageIndex = $scope.search.currentPage - 1;
            fac.getPageResult(url, param, function (data) {
                $scope.pageModel = data;
            });
        };
        $scope.find(1);
        $http.get("/ovu-pcos/pcos/equipment/getEmtTree", {
            params: $scope.search
        }).success(function (resp) {
            if (resp.success) {
                $scope.equipTypeTree = resp.data;
            }
        })
         $scope.changeIndex=function(index){
            $scope.index=index;
            if(index==1){
                $scope.curEquip={}
            }else{
                $scope.sel={}
            }
             $scope.find();
         }
          // 选择设备
        $scope.checkItem = function (item) {
            $scope.curEquip = item
        }// 选择第三方设备
        $scope.selected = function (item) {
            $scope.selDeviceId = item.deviceId;
            $scope.sel=item;
        }
        $scope.save = function (curEquip) {
            console.log()

            if ((!$scope.curEquip) && (!$scope.selDeviceId)) {
                alert("请选择设备！");
            } else {
                $scope.curEquip
                $scope.sel
                var data;
                if($scope.index==1){
                    data=$scope.curEquip
                }else{
                    data=$scope.sel
                }
                $uibModalInstance.close(data);
            }
        }
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    })
    app.controller('connectionSpaceModalCtrl', function ($scope, $http, $uibModal, $timeout, $uibModalInstance, $filter, fac, param) {
        //    $scope.search = {parkId:param.parkId};

        param.spaceList && param.spaceList.forEach(function(v){
            v.scale=parseInt(v.scale);
            v.parkName=param.parkName;
            v.seeScale=true
        })
        $scope.informArr= param.spaceList || []
        $scope.del = function (index) {
            /* $scope.informArr.splice(index,1);*/
            confirm("是否删除", function () {
                $timeout(function () {
                    $scope.informArr.splice(index, 1);
                    var num=0
                    $scope.informArr.forEach(function(v,i){
                        v.scale=Math.floor(100/$scope.informArr.length);
                        num+=v.scale;
                       if(num<100){
                            $scope.informArr[$scope.informArr.length-1].scale= $scope.informArr[$scope.informArr.length-1].scale+100-num
                       }

                     })
                })
            })
        }
        param.parkId && $http.post("/ovu-base/system/parkStage/tree.do", {
            parkId: param.parkId,
            level: "2",
        }, fac.postConfig).success(function (data) {
            $scope.floorTree = data;
        });

        $scope.editBtn=function (item) {

            $scope.informArr.forEach(function(v){
                    v.scale=0
                    v.seeScale=false

            })
        }
        $scope.saveBtn=function (item) {
            if(!item.scale){
                alert("输入不能为空");
                return;
            }

            for (var i = 0; i < $scope.informArr.length; i++) {
                $scope.informArr[i].ratio=parseInt($scope.informArr[i].scale)
            }

            item.seeScale=true;

        }
        $scope.finish = function () {

            if (!$scope.search.stageId) {
                alert("请选择使用位置");
                return
            }
            var stage = $scope.floorTree.reduce(function (ret, n) {
                (n.id == $scope.search.stageId) && ret.push(n.text);
                return ret;
            }, []).join();
            $scope.search.stage = stage;
            var build = $scope.buildList.reduce(function (ret, n) {
                (n.id == $scope.search.buildId) && ret.push(n.buildName);
                return ret;
            }, []).join();
            $scope.search.build = build;
            if ($scope.houseList) {
                var house = $scope.houseList.reduce(function (ret, n) {
                    (n.id == $scope.search.houseId) && ret.push(n.houseName);
                    return ret;
                }, []).join();
            }
            $scope.search.house = house || '';

            var location = ($scope.search.stageId && $scope.search.stage) +
                (($scope.search.buildId && $scope.search.build) || '') +
                (($scope.search.unitNo && $scope.search.unitNo + '单元' || '')) +
                (($scope.search.groundNo && $scope.search.groundNo + '楼' || '')) +
                (($scope.search.houseId && $scope.search.house || ''));

            var objItem = {
                parkName: param.parkName,
                location: location,
                stageId: $scope.search.stageId || '',
                buildId: $scope.search.buildId || '',
                unitNo: $scope.search.unitNo || null,
                groundNo: $scope.search.groundNo || null,
                houseId: $scope.search.houseId || '',
                seeScale:true,


            };
             var flag=true
            //校验不能添加重复的内容
            for(var i=0;i<$scope.informArr.length;i++){
                if($scope.informArr[i].location===objItem.location){
                    flag=false

                }
            }

            if (flag) {
                $scope.informArr.push(objItem);
                var num=0
             $scope.informArr.forEach(function(v,i){
                v.scale=Math.floor(100/$scope.informArr.length);
                num+=v.scale;
               if(num<100){
                    $scope.informArr[$scope.informArr.length-1].scale= $scope.informArr[$scope.informArr.length-1].scale+100-num
               }

             })
            } else {
                alert("重复不能添加");
            }
        }
        //加载楼栋树
        $scope.loadHouseTree = function () {
            delete $scope.floorTree;
            param.parkId && $http.post("/ovu-base/system/parkStage/tree.do", {
                parkId: param.parkId,
                level: "2",
            }, fac.postConfig).success(function (data) {
                $scope.floorTree = data;
            });
        }
        $scope.loadHouseTree();
        $scope.geneBuild = function (search) {
            if (!search || !search.stageId) {
                $scope.buildList = [];
                return;
            }
            var param = {
                stageId: search.stageId
            }
            $http.get("/ovu-base/system/parkBuild/getBuilds.do", {
                params: param
            }).success(function (res) {

                $scope.buildList = res;

            });
        }

        $scope.geneSearchUnit = function (search) {
            if (!search || !search.buildId) {
                $scope.unitList = [];
                return;
            }
            var param = {
                pageSize: 1000,
                pageIndex: 0,
                buildId: search.buildId || ""
            };
            $http.get("/ovu-base/system/parkHouse/listUnitNo_mute.do", {
                params: param
            }).success(function (resp) {
                $scope.unitList = resp.data;

            })
        }

        $scope.geneSearchGround = function (search) {
            if (!search || !search.buildId || !search.unitNo) {
                $scope.groundList = [];
                return;
            }
            var param = {
                pageSize: 1000,
                pageIndex: 0,
                buildId: search.buildId || "",
                unitNo: search.unitNo
            };
            $http.get("/ovu-base/system/parkHouse/listGroundNo_mute.do", {
                params: param
            }).success(function (resp) {
                $scope.groundList = resp.data;

            })
        }

        $scope.getHouseList = function (search) {
            $scope.houseList = [];
            if (search.groundNo) {
                $http.post("/ovu-base/system/parkHouse/getHouses.do", {
                    buildId: search.buildId,
                    unitNo: search.unitNo,
                    groundNo: search.groundNo
                }, fac.postConfig).success(function (list) {
                    $scope.houseList = list.data;

                })
            }
        }
        $scope.save = function () {
            var num=0
            for(var i=0;i<$scope.informArr.length;i++){
                num+=$scope.informArr[i].scale
            }
            if(num!==100){
             alert('能耗占比之和必须为100%')
             return
            }
            $uibModalInstance.close($scope.informArr);
        }
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    });

    //导入
    app.controller("energyPointImportCtrl", function ($scope, $http, $uibModal, $timeout, $uibModalInstance, $filter, fac, param) {
        //导出模板
        $scope.outputTemplate = function () {
            if (param.parkId) {
                window.location.href = "/ovu-energy/energy/point/exportModel?parkId=" + param.parkId;
            }
        };
        //导入，直接导入
        $scope.inputFile = function () {
            uploadExcel({
                parkId: param.parkId
            }, function (resp) {
                if (resp && resp.data && resp.data.failNum > 0) {
                    var modal = $uibModal.open({
                        animation: false,
                        size: 'lg',
                        templateUrl: '/view/energy/energyPoint/import/modal.inputCounts.html',
                        controller: 'PointIptCountsModalCtrl',
                        resolve: {
                            param: resp.data
                        }
                    });
                } else {
                    msg("导入成功");
                    $uibModalInstance.close();
                }
            });
        };
        //可能需要根据导入类型不同走不同分支，具体看后台实现
        function uploadExcel(params, fn) {
            fac.upload({
                    url: "/ovu-energy/energy/point/importEnergyPoint",
                    params: params,
                    accept: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                },
                function (resp) {
                    if (resp.code == 0) {
                        fn && fn(resp);
                    } else {
                        alert(resp.error);
                    }
                })
        }

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        }
    });

    app.controller('PointIptCountsModalCtrl', function ($scope, $rootScope, $http, $uibModal, $uibModalInstance, $filter, fac, param) {
        $scope.item = param;
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
        $scope.download = function () {
            window.location.href = '/ovu-energy/energy/read/downloadErrorData?fileName=' + param.fileName;
        }
    });
    app.controller('setPnStatusCtrl', function ($scope, $rootScope, $http, $uibModalInstance, $filter, fac, data) {
    
       

       
        $scope.save = function (form,item) {
            form.$setSubmitted(true);
            if (!form.$valid) {
                return;
            }


            $http.post("/ovu-energy/energy/point/batchEditUseStatus", {ids:data,useStatus:$scope.item.useStatus},fac.postConfig).success(function (resp) {
                if (resp.code==0) {
                    msg('批量设置成功！');
                    $uibModalInstance.close();
                } else {
                    alert(resp.msg);
                }
            })

        }
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    });
})();
