(function() {
    var app = angular.module("angularApp");
    app.controller('examAgreementCtrl', function ($scope, $rootScope, $http, $uibModal, fac,$location) {		
        $scope.contractId = $rootScope.pages.params.id;
        $scope.opinion="";
        // 获取合同详情
        $scope.getContractMsg = function(){
            var param = {id:$scope.contractId};
            $http.post("/ovu-park/backstage/rental/contract/getInfoById",param,fac.postConfig).success(function(resp){
                $scope.contractMsg = resp.data;
            });
        }
        //  获取合同详细信息
        $scope.pageModel ={};
        $scope.search = {contractId:$scope.contractId};
        $scope.find = function(){
			fac.getPageResult("/ovu-park/backstage/rental/contract/contractExpenditure/listByContractId", $scope.search,function(data){
                $scope.pageModel = [];
                data.forEach(function (n) {
                    if (n.firstPrice==0){
                        n.firstPrice = null;
                    }
                    if (n.name!="履约保证金"){
                        $scope.pageModel.push(n);
                    }
                });
                console.log($scope.pageModel);
			});
        }
        // 提交审批
        $scope.submint = function(state){
            var params = {
                "id":$scope.contractId,
                "status":state,
                "approveId":app.user.id,
                "approveOpinion":$scope.opinion,
            }
            $http.post("/ovu-park/backstage/rental/contract/approve",params,fac.postConfig).success(function(resp){
                if(resp.code==0){
                    // $location.url("/rental/home/rent");
                    $rootScope.target("rental/home/rent", "首页", false,'',{},"rental/home/rent");
                }else{
                    window.alert(resp.message)
                }
            });
        }
        $scope.back = function(){
            // $location.url('/rental/home/rent');
            // window.history.back(-1);
            $rootScope.target("rental/home/rent", "首页", false,'',{},"rental/home/rent");
        } 
        app.modulePromiss.then(function() {
            fac.initPage($scope,function(){
                $scope.find();
            })
            $scope.getContractMsg();
        });

    //查看费用标准
    $scope.openSetCost = function (index,item) {
        var modal = $uibModal.open({
            animation: false,
            size: '',
            templateUrl: '/view/rental/rentAgreement/modal.setCost.html',
            controller: 'setCostCtrl',
            resolve: { expenditure: item,index: index,view:true}
        });
    }
});

//查看费用标准
app.controller('setCostCtrl', function ($scope, $rootScope, $http, $uibModalInstance, $filter, fac,expenditure,index,view) {
    $scope.expenditure = expenditure;
    $scope.index = index;
    $scope.view = view;

    // 取消
    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    }

});
   
})()
