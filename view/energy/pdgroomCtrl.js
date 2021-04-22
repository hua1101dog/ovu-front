// 配电柜回路管理
/**
 * Created by Cx on 2018/10/23.
 */
(function (angular) {
    "use strict";
    var app = angular.module("angularApp");
    app.controller('pdgroomCtrl', function ($scope, $rootScope, $uibModal, $state, $http, $filter, $location, fac) {
        document.title = '配电柜回路管理';
        $scope.msg = {};
        $scope.search = {};
        $scope.item = {}
        $scope.config = {
            edit: false
        };
        $scope.isNode = false // 是否展示配电柜

        // 页面初始化
        app.modulePromiss.then(function () {
            $scope.$watch('dept.id', function (deptId, oldValue) {
                if (deptId) {
                    if ($scope.dept.parkId) {
                        $scope.search.parkId = $scope.dept.parkId;
                        $scope.search.parkName = $scope.dept.parkName;
                        fac.setInsitemtypeTree2({parkId:$scope.search.parkId}).then(function(trmTreeData){
                            if( trmTreeData&& trmTreeData[0]){
                              $scope.trmTreeData[0].state={selected:true}
                                $scope.selectNode('',$scope.trmTreeData[0]);
                            }
                        });
                    } else {
                        alert('请选择跟项目关联的部门');
                        $scope.search.parkId &&  delete $scope.search.parkId
                        $scope.search.parkName &&  delete $scope.search.parkName;
                    }

                }

            })

        })
        $scope.find = function(id,text){
           
            if(angular.isDefined(id)){
                $scope.dtId=id
                $scope.pdgroomName=text
                $http.post('/ovu-energy/energy/distributor/loop/list', {
                    dtId: id
                }, fac.postConfig).success(function (data) {
                    $scope.data = data.data

                })
            }
            
           
        };

        $scope.selectNode = function (search,node) {
            if (!$scope.search.parkId) {
                alert('请选择项目')
            }

          
            if (node.state.selected) {
                
                if (node.parentId == '0') {

                    $scope.isNode = false;
                    $http.post('/ovu-energy/energy/transformer/status', {
                        trId: node.id
                    }, fac.postConfig).success(function (data) {
                        $scope.data = data.data;


                    })
                } else {
                    $scope.isNode = true;
                     $scope.find(node.id,node.text);
                }
            } else {
                delete $scope.curNode;

            }



        };
        //新增回路
        $scope.addPdg = function (loopId) {
            var copy = angular.extend({}, {loopId: loopId,dtId: $scope.dtId,parkId: $scope.search.parkId});

            var modal = $uibModal.open({
                animation: false,
                size: 'md',
                templateUrl: 'energy/modal.addLoop.html',
                controller: 'addLoopCtrl',
                resolve: {
                    item: function () {
                        return copy;
                    }
                }
            });
            modal.result.then(function (data) {
                fac.setInsitemtypeTree2({parkId:$scope.search.parkId});
                $scope.find($scope.dtId,$scope.pdgroomName);
               
            });
        }




        //历史记录
        $scope.goHistory = function () {
            // $location.path('/energy/historicalRecord').search({
            //     id: $scope.id,
            //     name: $scope.name,
            //     parkId:$scope.search.parkId
            // });
            sessionStorage.setItem("id", $scope.id);
            sessionStorage.setItem("name", $scope.name);
            sessionStorage.setItem("parkId", $scope.search.parkId);
            $state.go('admin', {
                folder: 'energy',
                page: 'historicalRecord'
            });
            // $scope.id=$routeParams.newNo;
            // $scope.name=$routeParams.lastBill  通过$routeParamsh获取参数
        }








    });
    //新增回路
    app.controller('addLoopCtrl', function ($scope,$uibModal, $uibModalInstance, $http, fac, item) {
        $scope.item=item;
        $scope.item.dtId=item.dtId
      if(fac.isNotEmpty(item.loopId)){
        $http.get('/ovu-energy/energy/distributor/loop/get?loopId='+item.loopId,).success(function (data) {
            if (data.code == 0) {
              $scope.item=data.data
            }
        });
      }
      $scope.chooseByq = function (id, name) {

        var modal = $uibModal.open({
            animation: false,
            size: 'lg',
            templateUrl: 'energy/modal.choosePoint.html',
            controller: 'choosePointModalCtrl',
            resolve: {
                parm: function () {
                    return {
                        parkId: item.parkId,
                        pointId: id,
                        pointName: name

                    }
                }
            }
        });
        modal.result.then(function (data) {
            $scope.item.outMeterName = data.pointName,
                $scope.item.outMeterId = data.pointId
        }, function () {
            console.info('Modal dismissed at: ' + new Date());
        });
    }

        $scope.save = function (form) {
            form.$setSubmitted(true);

            if (!form.$valid) {
                return;
            }

            delete $scope.item.createTime;
            delete $scope.item.modifyTime;
            $http.post('/ovu-energy/energy/distributor/loop/edit', $scope.item, fac.postConfig).success(function (data) {
                if (data.code == 0) {
                    msg(data.msg);
                    $uibModalInstance.close();


                } else {
                    alert(data.msg);
                }
            });


        }

        $scope.delete = function (loopId) {
            confirm("确认删除吗？", function () {
                $http.post("/ovu-energy/energy/distributor/loop/delete", {
                    loopId: item.loopId
                }, fac.postConfig).success(function (data) {
                    if (data.code == 0) {
                        msg(data.msg);
                        $uibModalInstance.close();
                    } else {
                        alert(data.msg);
                    }
                });
            });
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };

    });

})(angular)