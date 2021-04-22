/**
 * Created by Administrator on 2017/7/20.
 */
(function () {
    "use strict";
    var app = angular.module("angularApp");
    //项目架构ctl
    app.controller('stationIndexCtrl', function ($scope, $rootScope, $timeout, $http, $filter, $uibModal, fac) {
        document.title = "工位管理";
        //初始化为空
        $scope.pageModel = {};
        $scope.search = {};

        app.modulePromiss.then(function() {
            fac.initPage($scope,function(){
            	$scope.find(1);
            })
        });
        
        //查询
        $scope.find = function (pageNo) {
            if($scope.curNode){
                $scope.search.equipTypeId = $scope.curNode.id;
            }else{
                delete $scope.search.equipTypeId;
            }
            $.extend($scope.search, {currentPage: pageNo || $scope.pageModel.currentPage || 1,pageSize: $scope.pageModel.pageSize || 10});
            fac.getPageResult("/ovu-pcos/mobile/workPosition/queryByPage.do", $scope.search, function (data) {
                data.list.forEach(function (n) {
                    n.sensorList = [];
                    if (n.sensors && n.sensors.indexOf("#") > 0) {
                        var sensorArray = n.sensors.split(",");
                        sensorArray.forEach(function (m) {
                            var sensor = m.split("#");
                            if (sensor && sensor.length == 2) {
                                n.sensorList.push({
                                    id: sensor[0],
                                    name: sensor[1]
                                });
                            }
                        })
                    }
                })
                $scope.pageModel = data;
            });
        };

     

      

      
        //添加编辑工位
        $scope.showEditModal = function (item) {
            if (!item) {
                return;
            }
            var copy = angular.extend({}, item);
            if (!copy.park_id) {
                angular.extend(copy, {
                    park_id: $scope.search.parkId,
                    park_name: $scope.search.parkName,
                  
                });
            }
            //appendTo是为了规避ui-select在模态框被动画造成的一个bug
            var modal = $uibModal.open({
                animation: false,
                size: 'max',
                templateUrl: '/view/operationManage/stationManage/modal.station.html',
                controller: 'stationModalCtrl',
                appendTo: angular.element('#NgCtrlTag'),
                resolve: {
                    station: function () {
                        return copy;
                    }
                }
            });
            modal.result.then(function (data) {
                $scope.find();
            }, function () {
                console.info('Modal dismissed at: ' + new Date());
            });
        }


        
        


       

        //删除工位
        $scope.delAll = function () {
            var ids = $scope.pageModel.list.reduce(function (ret, n) {
                n.checked && ret.push(n.id);
                return ret
            }, []);
            del(ids, "确认删除选中的 " + ids.length + " 个工位吗?");
        };
        $scope.del = function (item) {
            del([item.id], "确认删除 " + item.name + " 吗?");
        }

        function del(ids, msg) {
            confirm(msg, function () {
                $http.post("/ovu-pcos/pcos/equipment/del.do", {
                    "ids": ids.join()
                }, fac.postConfig).success(function (resp) {
                    if (resp.success) {
                      
                        $scope.find();
                    } else {
                        alert(resp.error);
                    }
                })
            });
        }

      

        //导出Excel
        $scope.exportExcel = function () {
            var ids = $scope.pageModel.list.reduce(function (ret, n) {
                n.checked && ret.push(n.id);
                return ret
            }, []);

            var elemIF = document.createElement("iframe");
            var param = encodeURIComponent(encodeURIComponent(JSON.stringify({ ID: ids.join() })));
            elemIF.src = "/ovu-pcos/pcos/equipment/exportPosExcel?searchJson=" + param;
            elemIF.style.display = "none";
            document.body.appendChild(elemIF);

        };
    });


   

    app.controller('stationModalCtrl', function ($scope, $rootScope, $timeout, $http, $uibModalInstance, $uibModal, $filter, $q, fac, station) {
        
        $scope.item = station;
        $scope.item.equip_status=1;
       
        $scope.save = function (form, item) {
            form.$setSubmitted(true);
            if (!form.$valid) {
                return;
            } 
               console.log(item);      
            item.STAGE && (item.stage_id = item.STAGE.stageId);
            item.FLOOR && (item.floor_id = item.FLOOR.floorId);
           
            $http.post("/ovu-pcos/pcos/workPosition/save", item).success(function (data, status, headers, config) {
                if (data.code==0) {
                    $uibModalInstance.close();
                    msg("保存成功!");
                } else {
                    alert(data.msg);
                }
            })
        }

      
      

      

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };

    });
  
})();
