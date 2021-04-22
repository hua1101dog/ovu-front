(function () {
    var app = angular.module("angularApp");
    app.controller('accountManageCtrl', function ($scope, $rootScope, $http, $filter, $uibModal, fac) {
        document.title = "收支管理";
        app.modulePromiss.then(function () {
            $scope.search = {
                status:'0'
            };
            $scope.selCount = 0;
            $scope.pageModel = {};
            $scope.$watch('project.id', function (projectId, oldValue) {
                if (projectId) {
                    $scope.search.parentHouseId = $rootScope.project.id;
                    // $scope.search.park_id = $rootScope.project.parkId;
                    // $rootScope.project.stageId&&($scope.search.stage_id= $rootScope.project.stageId);
                    // $rootScope.project.buildId&&($scope.search.build_id= $rootScope.project.buildId);
                    $scope.find(1)
                }
            })

        });
        $scope.find = function (pageNo) {
            $.extend($scope.search, { currentPage: pageNo || $scope.pageModel.currentPage || 1, pageSize: $scope.pageModel.pageSize || 10 });
            fac.getPageResult("/ovu-park/backstage/sale/finance/findPage", $scope.search, function (data) {
                $scope.pageModel = data;
            });
        };
        //财务处理
        $scope.toDealWith = function (houseId) {
            var modal = $uibModal.open({
                animation: false,
                size: 'lg',
                templateUrl: '/view/investmentSystem/financeManage/modal.financeHandle.html',
                controller: 'financeHandleCtrl',
                resolve: {houseInfo: {houseId:houseId}}
            });
            modal.result.then(function () {
                $scope.find();
            }, function () {
                $scope.find();
                console.info('Modal dismissed at: ' + new Date());
            });
        };




    });

    // //财务处理
    // app.controller('financeHandleCtrl', function ($scope, $rootScope, $http, $uibModalInstance, $uibModal, $filter, fac) {
    //     //切换房间
    //     $scope.changeHouse = function () {
    //
    //         var modal = $uibModal.open({
    //             animation: false,
    //             size: '',
    //             templateUrl: '/view/investmentSystem/financeManage/modal.selectHouse.html',
    //             controller: 'selectHouseCtrl',
    //             resolve: { contact: { "parkId": app.park.parkId } }
    //         });
    //         modal.result.then(function (data) {
    //             console.log("data.houses:", data.houses)
    //             // angular.extend($scope.baseMsg, data.houses)
    //
    //         }, function () {
    //         });
    //     }
    //     //合同详情
    //     $scope.showContractDetail = function (id) {
    //         var modal = $uibModal.open({
    //             animation: false,
    //             size: 'md',
    //             templateUrl: '/view/investmentSystem/financeManage/modal.contractDetail.html',
    //             controller: 'contractDetailCtrl',
    //             resolve: { data: { id: id } }
    //         });
    //         modal.result.then(function () {
    //         }, function () {
    //             console.info('Modal dismissed at: ' + new Date());
    //         });
    //     }
    //     //认购详情
    //     $scope.showSubscripDetail = function (id) {
    //         var modal = $uibModal.open({
    //             animation: false,
    //             size: 'md',
    //             templateUrl: '/view/investmentSystem/financeManage/modal.subscriptionDetail.html',
    //             controller: 'subscriptionDetailCtrl',
    //             resolve: { data: { id: id } }
    //         });
    //         modal.result.then(function () {
    //
    //         }, function () {
    //             console.info('Modal dismissed at: ' + new Date());
    //         });
    //
    //     };
    //     //删除供款明细
    //     $scope.delete = function (id) {
    //     }
    //     //新增供款明细
    //     $scope.addDetailed = function (id) {
    //         var modal = $uibModal.open({
    //             animation: false,
    //             size: 'md',
    //             templateUrl: '/view/investmentSystem/financeManage/modal.addDetailed.html',
    //             controller: 'addDetailedCtrl',
    //             resolve: {}
    //         });
    //         modal.result.then(function () {
    //
    //         }, function () {
    //             console.info('Modal dismissed at: ' + new Date());
    //         });
    //
    //     };
    //     //收款
    //     $scope.receiveMoney = function () {
    //         var modal = $uibModal.open({
    //             animation: false,
    //             size: 'lg',
    //             templateUrl: '/view/investmentSystem/financeManage/modal.receiveMoney.html',
    //             controller: 'receiveMoneyCtrl',
    //             resolve: {}
    //         });
    //         modal.result.then(function () {
    //
    //         }, function () {
    //             console.info('Modal dismissed at: ' + new Date());
    //         });
    //     }
    //     //退款
    //     $scope.returnMoney = function () {
    //         var modal = $uibModal.open({
    //             animation: false,
    //             size: 'lg',
    //             templateUrl: '/view/investmentSystem/financeManage/modal.returnMoney.html',
    //             controller: 'returnMoneyCtrl',
    //             resolve: {}
    //         });
    //         modal.result.then(function () {
    //
    //         }, function () {
    //             console.info('Modal dismissed at: ' + new Date());
    //         });
    //     }
    //
    //     // 保存
    //     $scope.save = function () {
    //
    //     }
    //     // 取消
    //     $scope.cancel = function () {
    //         $uibModalInstance.dismiss('cancel');
    //     }
    // });
    // // 切换房间
    // app.controller('selectHouseCtrl', function ($scope, $rootScope, $http, $uibModalInstance, $filter, fac, contact) {
    //     $scope.item = contact;
    //     $rootScope.treeData = null;
    //     $rootScope.flatData = null;
    //     $scope.config = { edit: false, showCheckbox: false }
    //     $scope.rightObj = '';
    //     $scope.newChooseIds = [];//编辑资源，已选定，即将要关联的空间id
    //     var dataObj = {
    //         "parkId": $scope.item.parkId
    //     }
    //     // $http.post(" /ovu-park/backstage/invest/saleContract/getHouseTree", dataObj, fac.postConfig).success(function (treeData) {
    //     //     $rootScope.treeData = treeData.data;
    //     //     $rootScope.flatData = fac.treeToFlat(treeData.data);
    //     //     var node = $scope.flatData.find(function (n) { return n.did == houses.houseId });
    //     //     if (node != undefined) {
    //     //         node.state = node.state || {};
    //     //         node.state.selected = true;
    //     //         $scope.curNode=node
    //     //         expandFather(node);
    //     //         $scope.rightObj = node.stageName + ">" + node.buildName + ">" + node.houseName;
    //
    //     //     }
    //
    //     // });
    //
    //     function expandFather(node) {
    //         var father = $scope.flatData.find(function (n) { return n.did == node.pdid });
    //         if (father) {
    //             father.state = father.state || {};
    //             father.state.expanded = true;
    //             expandFather(father);
    //         }
    //     }
    //
    //
    //     $scope.selectNode = function (node) {
    //         if ($scope.curNode != node) {
    //             $scope.curNode && $scope.curNode.state && ($scope.curNode.state.selected = false);
    //         }
    //         node.state = node.state || {};
    //         node.state.selected = !node.state.selected;
    //         if (node.state.selected) {
    //             $scope.curNode = node;
    //             if (node.houseId) {
    //                 $scope.rightObj = node.stageName + ">" + node.buildName + ">" + node.houseName;
    //             } else {
    //                 $scope.rightObj = '';
    //             }
    //         } else {
    //             $scope.rightObj = ''
    //         }
    //     }
    //     $scope.save = function () {
    //         if (!$scope.rightObj || !$scope.curNode) {
    //             alert("请选择房屋！");
    //             return;
    //         }
    //         var houses = {
    //             houseId: $scope.curNode.did,
    //             houseName: $scope.rightObj,
    //             area: $scope.curNode.area,
    //             areaSu: $scope.curNode.areaSu,
    //             recordNumber: $scope.curNode.recordNumber
    //         }
    //
    //         $uibModalInstance.close({ houses: houses });
    //     }
    //     $scope.cancel = function () {
    //         $uibModalInstance.dismiss('cancel');
    //     }
    // });
    // //合同详情
    // app.controller('contractDetailCtrl', function ($scope, $rootScope, $http, $uibModalInstance, $uibModal, $filter, fac, data) {
    //     $scope.item = data
    //     $scope.isEdit = data.id ? true : false
    //     // 保存
    //     $scope.save = function () {
    //         $uibModalInstance.close()
    //     }
    //     // 取消
    //     $scope.cancel = function () {
    //         $uibModalInstance.dismiss('cancel');
    //     }
    // });
    // //认购详情
    // app.controller('subscriptionDetailCtrl', function ($scope, $rootScope, $http, $uibModalInstance, $uibModal, $filter, data) {
    //     $scope.item = data;
    //     $scope.isEdit = data.id ? true : false
    //     // 保存
    //     $scope.save = function (form) {
    //         $uibModalInstance.close()
    //     }
    //     // 取消
    //     $scope.cancel = function () {
    //         $uibModalInstance.dismiss('cancel');
    //     }
    // });
    // //新增供款明细
    // app.controller('addDetailedCtrl', function ($scope, $rootScope, $http, $uibModalInstance, $filter) {
    //     // 保存
    //     $scope.save = function () {
    //         $uibModalInstance.close()
    //     }
    //     // 取消
    //     $scope.cancel = function () {
    //         $uibModalInstance.dismiss('cancel');
    //     }
    // });
    // //收款
    // app.controller('receiveMoneyCtrl', function ($scope, $rootScope, $http, $uibModalInstance, $filter) {
    //     // 保存
    //     $scope.save = function () {
    //         $uibModalInstance.close()
    //     }
    //     $scope.examine = function () {
    //         layer.confirm("是否通过审核？", { btn: ['是', '否'] }, function () {
    //             // $http.post("/ovu-pcos/pcos/message/delete.do",{id:ids.join()},fac.postConfig).success(function(resp){
    //             //     if(resp.success){
    //             //
    //             //     }else{
    //             //         alert('删除失败');
    //             //     }
    //             // })
    //         });
    //     }
    //
    //     // 取消
    //     $scope.cancel = function () {
    //         $uibModalInstance.dismiss('cancel');
    //     }
    // });
    // //退款
    // app.controller('returnMoneyCtrl', function ($scope, $rootScope, $http, $uibModalInstance, $filter) {
    //     // 保存
    //     $scope.save = function () {
    //         $uibModalInstance.close()
    //     }
    //     $scope.examine = function () {
    //         layer.confirm("是否通过审核？", { btn: ['是', '否'] }, function () {
    //             // $http.post("/ovu-pcos/pcos/message/delete.do",{id:ids.join()},fac.postConfig).success(function(resp){
    //             //     if(resp.success){
    //             //
    //             //     }else{
    //             //         alert('删除失败');
    //             //     }
    //             // })
    //         });
    //     }
    //
    //     // 取消
    //     $scope.cancel = function () {
    //         $uibModalInstance.dismiss('cancel');
    //     }
    // });
    //
    app.filter("toStatus",function(){//转换状态
    	return function(value) {
    		if(value == 0){
    			return "未处理";
    		} else if(value == 1){
    			return "已处理";
    		} else {
    			return "废除";
    		}
    	}
    });

})();
