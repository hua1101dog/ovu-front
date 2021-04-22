(function() {
    var app = angular.module("angularApp");
    app.controller('roomManageCtrl', function ($scope,$rootScope,$http,$filter,$location,$uibModal,fac) {
        document.title = "房间管理";
        var width=$(window).width()-300
        $('#table_room').width(width)
        $scope.saleStatus= [{key:0,value:'销控'},{key:1,value:'待售'},{key:2,value:'认购'},{key:3,value:'签约'}]
        app.modulePromiss.then(function(){
            $scope.search={};
            $scope.selCount=0;
            $scope.pageModel = {};
            $scope.isSync=true
            $scope.checkSyncBtn()
            $scope.$watch('project.id', function (projectId, oldValue) {
                if (projectId) {
                    $scope.search.park_id=""
                    $scope.search.stage_id=""
                    $scope.search.build_id=""
                    $scope.search.park_id = $rootScope.project.parkId;
                    $rootScope.project.stageId&&($scope.search.stage_id= $rootScope.project.stageId);
                    $rootScope.project.buildId&&($scope.search.build_id= $rootScope.project.buildId);
                    $scope.find(1)
                }
            })

        });
        console.log("window.location",window.location.toString())
        console.log("$location",$location)
        //同步按钮
        $scope.checkSyncBtn= function () {
            $http.post("/ovu-park/backstage/sale/saleparkhouse/isSync", fac.postConfig).success(function (resp) {
                if (resp.code == 0) {
                    if(resp.data==0){
                        $scope.isSync=false
                    }
                } 
            });
        }
        $scope.checkAll = function () {
            $scope.pageModel.checked = !$scope.pageModel.checked;
            $scope.pageModel.list.forEach(function (n) { n.checked = $scope.pageModel.checked });
            $scope.selCount = ($scope.pageModel.checked ? $scope.pageModel.list.length : 0)
        }
        $scope.checkOne = function (item) {
            item.checked = !item.checked;
            if ($scope.pageModel && $scope.pageModel.list) {
                $scope.pageModel.checked = $scope.pageModel.list.every(function (v) {
                    return v.checked;
                });
            }
            if (item.checked) {
                $scope.selCount++;
            } else {
                $scope.selCount--;
            }
        }

        $scope.find = function (pageNo) {
            $scope.selCount=0
             $.extend($scope.search, { currentPage: pageNo || $scope.pageModel.currentPage || 1, pageSize: $scope.pageModel.pageSize || 10 });
             fac.getPageResult("/ovu-park/backstage/sale/saleparkhouse/list", $scope.search, function (data) {
                 $scope.pageModel = data;
            });
        };
         //编辑／新增模态窗口
        $scope.showRoomDetail = function (house_id) {
            var modal = $uibModal.open({
                animation: false,
                size: 'lg',
                templateUrl: '/view/investmentSystem/projectPrepare/roomManage/modal.roomDetail.html',
                controller: 'roomDetailCtrl',
                resolve: { param:{'houseId': house_id } }
            });
            modal.result.then(function () {
                $scope.find();
            }, function () {
                console.info('Modal dismissed at: ' + new Date());
            });
        };

        //批量放盘
        $scope.batchOpen= function (item) {
            var houseIds=[]
            if(item&&item.sale_status!=0){
                  return
            }
            confirm("确认放盘?", function() {
                if(item){
                    houseIds.push(item.house_id)
                }else{
                    $scope.pageModel.data.forEach(function (n) {
                        if(n.checked){
                            houseIds.push(n.house_id)
                        }
                    });
                }
                $http.post("/ovu-park/backstage/sale/saleparkhouse/batchOpen",{houseIds:houseIds.join()}, fac.postConfig).success(function (resp) {
                    if (resp.code == 0) {
                        window.msg(resp.msg);
                        $scope.find(1);
                        
                    } else if(resp.code == 1){
                        var modal = $uibModal.open({
                            animation: true,
                            size: '',
                            templateUrl: 'batchOpenFailDetail.html',
                            controller:'batchOpenFailDetailCtrl',
                            resolve: { item:{msg:resp.msg}}
                            
                        });
                        modal.result.then(function () {
                           
                        }, function () {
                            console.info('Modal dismissed at: ' + new Date());
                        });
                        $scope.find(1);
                    }else{
                        alert(resp.msg);
                    }
                });
            });

        }
        //同步操作
        $scope.synchronization= function () {
            $http.post("/ovu-park/backstage/sale/saleparkhouse/sync",{modifyBy:$rootScope.user.id}, fac.postConfig).success(function (resp) {
                if (resp.code == 0) {
                    layer.msg(resp.msg+"</br>提示：只同步销售状态为销控状态的房屋", { time: 3000, icon: 1 });
                    // window.msg(resp.msg);
                } else {
                    alert(resp.msg);
                }
            });
        }

        //批量回收
        $scope.batchRecycle= function (item) {
            var houseIds=[]
            if(item&&item.sale_status!=1){
                return
          }
            confirm("确认回收?", function() {
                if(item){
                    houseIds.push(item.house_id)
                }else{
                    $scope.pageModel.data.forEach(function (n) {
                        if(n.checked){
                            houseIds.push(n.house_id)
                        }
                    });
                }

                $http.post("/ovu-park/backstage/sale/saleparkhouse/batchRecycle", {houseIds:houseIds.join()}, fac.postConfig).success(function (resp) {
                    if (resp.code == 0) {
                        //window.msg(resp.msg);
                        layer.msg(resp.msg, { time: 5000, icon: 1});
                        $scope.find(1);
                    } else {
                        layer.msg(resp.msg,{ time: 5000, icon: 5});
                    }
                });
            });
        }

    });

   

    app.controller('roomDetailCtrl', function ($scope, $rootScope, $http, $uibModalInstance, $filter, fac, param) {
        var initData = function () {
                //根据id查询详情
                $http.post("/ovu-park/backstage/sale/saleparkhouse/getHouseById",param,fac.postConfig).success(function(resp){
                    if(resp.code == 0){
                        $scope.houseInfo = resp.data;
                        $scope.houseInfo.sale_statusStr=$filter('toSaleStatus')($scope.houseInfo.sale_status);
                        $scope.houseInfo.area_statusStr=$filter('toAreaStatus')($scope.houseInfo.area_status);
                        $scope.houseInfo.rentTypeStr=$filter('toRentSaleType')($scope.houseInfo.rent_sale_type);
                        $scope.houseInfo.aspectStr=$filter('toDictionaryText')($scope.houseInfo.aspect,$scope.direction.data);
                  /*      $scope.aspectList.forEach(aspect => {
                            if(aspect.dicVal == $scope.houseInfo.aspect){
                                $scope.houseInfo.aspect = aspect.dicItem;
                            }
                        })*/
                    }else{
                        window.alert(resp.msg);
                    }
                });
        }
        initData()
        fac.loadSelect($scope,"HOUSE_DIRECTION")//房间朝向
        // 保存
        $scope.save = function () {

        }
        // 取消
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        }
    });
    app.controller('batchOpenFailDetailCtrl', function ($scope, $rootScope, $http, $uibModalInstance, $filter, fac, item) {
        console.log("msg---",item.msg)
        // 取消
        $scope.roomMsg=item.msg
        $scope.isShow=false
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        }
    });
})();

