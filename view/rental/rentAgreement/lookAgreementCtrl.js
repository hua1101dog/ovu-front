(function() {
    var app = angular.module("angularApp");
    app.controller('lookAgreementCtrl', function ($scope, $rootScope, $http, $uibModal, fac,$location) {	
        $scope.contractId = $rootScope.pages.params;
        var curPage;
        setTimeout(function () {
            curPage = $rootScope.getCurTabPage($rootScope.pages.active, $rootScope.pages);
        })
        $scope.opinion="";
        // 获取合同详情
        $scope.getContractMsg = function(){
            var param = $scope.contractId;
            $http.post("/ovu-park/backstage/rental/contract/getInfoById",param,fac.postConfig).success(function(resp){
                $scope.contractMsg = resp.data;
            });
        }
        //  获取合同详细信息
        $scope.pageModel ={};
        $scope.search = {contractId:$scope.contractId.id};
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
                console.log($scope.pageModel.data);
			});
        }
        $scope.back = function(){
            // window.history.back(); 
            $scope.$emit('needToClose',curPage);
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
