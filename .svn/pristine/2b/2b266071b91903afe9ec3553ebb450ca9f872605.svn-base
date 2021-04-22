
(function() {
    var app = angular.module("angularApp");
    app.controller('contractManageCtrl', function ($scope,$rootScope,$http,$filter,$uibModal,fac) {
        document.title = "合同管理";
        
        app.modulePromiss.then(function(){
            $scope.search={dataStatus:'1'};
            $scope.selCount=0;
            $scope.selCountMoney=0;
            $scope.pageModel = {};
            fac.initPage($scope, function () {
                $scope.find(1);
            })
            
        });
        $rootScope.checkAll = function () {
            $scope.pageModel.checked = !$scope.pageModel.checked;
            if($scope.pageModel.checked){
                $scope.pageModel.list.forEach(function (n) {
                    n.checked = $scope.pageModel.checked
                    $scope.selCountMoney+=n.contractAmount;
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
        $rootScope.checkOne = function (item) {
            item.checked = !item.checked;
            if ($scope.pageModel && $scope.pageModel.list) {
                $scope.pageModel.checked = $scope.pageModel.list.every(function (v) {
                    return v.checked;
                });
            }
            if(item.checked){
                $scope.selCountMoney+=item.contractAmount;
                $scope.selCount++;
            }else{
                $scope.selCountMoney-=item.contractAmount;
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

            fac.getPageResult("/ovu-park/backstage/invest/saleContract/listWithPage", $scope.search, function (data) {
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
            $scope.search.secondPartyName="";
            $scope.search.dataStatus='1'
            $scope.search.payMethod=""
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
            $rootScope.target('/investmentMamage/contractManage/addContract','新增合同')
           // $location.url('/investmentMamage/contractManage/addContract')
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
    });
 
  
    app.controller('contractDetailCtrl', function($scope,$http,$uibModalInstance,fac,ids) {
        $scope.contractInfo={};
        $scope.houseInfo={};
        $scope.contractId=ids
        function getContractInfo() {
                $http.post('/ovu-park/backstage/invest/saleContract/detail',{"contractId":$scope.contractId},fac.postConfig).success(function(resp){
                    if(resp.code==0) {
                        $scope.contractInfo = resp.data.contract;
                        $scope.houseInfo = resp.data.contractHouse;
                       
                    }else{
                        alert(resp.message);
                    }

                });
        }
        getContractInfo();
 

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    });

})();
