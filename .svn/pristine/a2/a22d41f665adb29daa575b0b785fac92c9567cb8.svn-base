(function () {
    "use strict";
    var app = angular.module("angularApp");
    app.controller('linpCtrl', function ($scope, $rootScope, $http, $filter, $uibModal, fac) {
        document.title = "领普开关";
        $scope.search = {};
        $scope.pageModel = {};

        //分页
        $scope.find = function (pageNo) {
            angular.extend($scope.search, { currentPage: pageNo || $scope.pageModel.currentPage || 1, pageSize: $scope.pageModel.pageSize || 10 });
            fac.getPageResult('/middleware/linp/list', $scope.search, function (data) {
                $scope.pageModel = data;
                var ids=[];
                $scope.pageModel && $scope.pageModel.data && $scope.pageModel.data.forEach((v)=>{
                   ids.push(v.id);
                })
                ids=ids.join(',');
                var  params=angular.extend($scope.search,{ids:ids})
                $scope.pageModel.data &&  fac.getPageResult('/middleware/linp/getSwitchStatus_mute', params, function (data) {
                    $scope.pageModel = data
                })
            })
        }

        $scope.find(1);
        //
        $scope.editDevSwitchSta=function(item){
           
            $http.get('/middleware/linp/switchLight',{params:{entityId:item.entityId,dataPointId:item.dataPointId}}).success(function (res) {
                
                if (res.code=='0') {
                   msg("操作成功！");
				   $scope.find();
                } else {
                    alert(res.msg);
                }
            })

        }
       

        $scope.showEditModal = function (item) {
            var copy = angular.extend({},item);
            var modal = $uibModal.open({
                animation: false,
                size: '',
                templateUrl: "/view/middleware/linp.modal.html",
                controller: 'linpEditCtrl',
                controllerAs: 'vm',
                resolve: {
                	linp: copy
                }
            })
            modal.result.then(function () {
                $scope.find();
            })
        }
       
        //删除设备
        $scope.del = function (id) {
            confirm("确认删除该设备吗?", function () {
                $http.get("/middleware/linp/del?ids=" + id).success(function (resp) {
                    if (resp.code == 0) { 
                        $scope.find();
                    } else {
                        alert(resp.msg);
                    }
                })
            })
        }
    });
    app.controller('linpEditCtrl', function ($scope, $uibModal, $uibModalInstance, $http, fac, linp) {
        var vm = $scope.vm = this;
        $scope.item = linp;
			$http.post('/middleware/linp/getDataPointList').success(function (res) {
                if (res.code == 0) {
                   $scope.dataPointList=res.data;
                   
                }else{
               $scope.dataPointList=[];
				}
            })
        vm.save = function (form, item) {
            form.$setSubmitted(true);
            if (!form.$valid) {
                return
            }
            delete item.optime;

            $http.post('/middleware/linp/save', item).success(function (res) {
                if (res.code == 0) {
                    $uibModalInstance.close();
                    msg("保存成功!");
                } else {
                    alert(res.msg);
                }
            })
        };
        vm.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        }
    })
    
 


  

})()
