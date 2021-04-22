var twoDparam = {};
window.houseID = '';
(function() {
    var app = angular.module("angularApp");
    app.controller('financeManageCtrl', function ($scope,$rootScope,$http,$filter,$uibModal,fac,$state) {
        document.title = "财务管理";
        app.modulePromiss.then(function(){
            $scope.search={};
            $scope.selCount=0;
            $scope.selCountMoney=0;
            $scope.pageModel = {};
            fac.initPage($scope, function () {
                $scope.find(1);
            })
            
        });
        $scope.billTypeArr=['','全款','首款','尾款']
        $rootScope.checkAll = function () {
            $scope.pageModel.checked = !$scope.pageModel.checked;
            if($scope.pageModel.checked){
                $scope.pageModel.list.forEach(function (n) {
                    n.checked = $scope.pageModel.checked
                    $scope.selCountMoney+=n.billAmount;
                });
                $scope.selCount=$scope.pageModel.list.length;

            }else{
                $scope.pageModel.list.forEach(function (n) {
                    n.checked = $scope.pageModel.checked
    
                });
                $scope.selCountMoney=0
                $scope.selCount=0;
            }
 
        }
        $scope.checkOne = function (item) {
            item.checked = !item.checked;
            if ($scope.pageModel && $scope.pageModel.list) {
                $scope.pageModel.checked = $scope.pageModel.list.every(function (v) {
                    return v.checked;
                });
            }
            if(item.checked){
                $scope.selCountMoney+=item.billAmount;
                $scope.selCount++;
            }else{
                $scope.selCountMoney-=item.billAmount;
                $scope.selCount--;
            }
        }
        $scope.clearSel= function () {
            $scope.pageModel.checked = false;
            $scope.pageModel.list.forEach(function (n) {
                n.checked = $scope.pageModel.checked
            });
            $scope.selCount=0;
            $scope.selCountMoney=0;
        }
        
        $scope.find = function (pageNo) {
            $scope.search.parkId = app.park.parkId;
            $.extend($scope.search, { currentPage: pageNo || $scope.pageModel.currentPage || 1, pageSize: $scope.pageModel.pageSize || 10 });
            // $scope.search.pageIndex = $scope.search.currentPage - 1;
            // $scope.search.totalCount = $scope.pageModel.totalCount || 0;

            fac.getPageResult("/ovu-park/backstage/invest/saleContractBill/listWithPage", $scope.search, function (data) {
                $scope.pageModel = data;
            });
        };
        //升序降序查询
        $scope.sortSearch=function (type) {
            if($scope.search.sortFactor==type){
                $scope.search.sortDirection=$scope.search.sortDirection==2?1:2
            }else{
                $scope.search.sortDirection=2
                $scope.search.sortFactor=type;
                
            }
         
            $scope.find(1)
        }
        //
        $scope.resetSearch=function () {
            $scope.search.secondPartyName=""
            $scope.search.isOverdue=""
            $scope.search.signDateStart=""
            $scope.search.signDateEnd=""
            $scope.search.sortDirection=2;
            $scope.search.sortFactor=0;
            $scope.find(1)
        }
        

        //合同详情
        $scope.openDetail = function (id) {

            var modal = $uibModal.open({
                animation: true,
                size: 'lg',
                templateUrl: '/view/investmentMamage/contractManage/modal.contractDetail.html',
                controller: 'contractDetailCtrl',
                resolve: {
                    ids:function() {
                        return id;
                    }
                }
                
            });
            modal.result.then(function () {
                $scope.find();
            }, function () {
                console.info('Modal dismissed at: ' + new Date());
            });

        };    
             // 新增、合同
         $scope.addContract = function(){
            $location.url('/investmentMamage/contractManage/addContract')
        }
        //作废合同
        $scope.cancelContract = function(contractId){
            confirm("确认作废吗？", function () {
                $http.post('/ovu-park/backstage/invest/saleContract/delete',{"contractId":contractId},fac.postConfig).success(function(resp){
                    if(resp.code==0) {
                        window.msg("作废成功！");
                        $scope.find(1)
                    }else{
                        alert(resp.message);
                    }
    
                });
            })
           
        }
        //财务标识
        $scope.identification = function (id,financeFlag) {
            if(financeFlag){
                 return;
            }
            var modal = $uibModal.open({
                animation: true,
                size: '',
                templateUrl: 'identification.html',
                controller: 'identificationCtrl',
                resolve: { param:{'id': id } }
                
            });
            modal.result.then(function () {
                $scope.find();
            }, function () {
                console.info('Modal dismissed at: ' + new Date());
            });

        };
     
    });

    //财务标识
    app.controller('identificationCtrl', function ($scope, $rootScope, $http, $uibModalInstance, $filter, fac, param) {
       
        // 保存
        $scope.save = function () {
            if(!$scope.financeDate){
                  alert("请选择时间！")
                  return;
            }
            $http.post("/ovu-park/backstage/invest/saleContractBill/financeCheck", { billId: param.id, financeDate: $scope.financeDate}, fac.postConfig).success(function (resp) {
                if (resp.code == 0) {
                    $uibModalInstance.close();
                } else {
                    window.alert(resp.message);
                }
            });
        }
        // 取消
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        }
    });

})();
