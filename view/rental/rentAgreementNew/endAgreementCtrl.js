(function() {
    var app = angular.module("angularApp");
    app.controller('endAgreementCtrl', function ($scope, $rootScope, $http, $filter, $uibModal, fac, $location) {		
        var curPage;
        setTimeout(function () {
            curPage = $rootScope.getCurTabPage($rootScope.pages.active, $rootScope.pages);
        })
        $scope.contractId = $rootScope.pages.params;
        $scope.suspendDate = "";
        $scope.suspendReason = "乙方违约";
        $scope.costEndTime = "";
        $scope.planOutTime = "";
        $scope.agent = app.user.nickname!=null?app.user.nickname:app.user.loginName;
        $scope.agnetDept = "";
        $scope.breakContractPrice = "";
        $scope.deductionPrice = "";
        $scope.breakContractRemark = "";
        // 获取合同详情
        $scope.getContractMsg = function(){
            var param = $scope.contractId;
            param.contractId = $scope.contractId.id;
            $http.post("/ovu-park/backstage/rental/contractBaseInfo/viewContractInfo",param,fac.postConfig).success(function(resp){
                if(resp.code==0){
                    $scope.contractMsg = resp.data;
                    console.log($scope.contractMsg);
                }else{
                    window.error(resp.msg);
                }
               
            });
            $http.post("/ovu-park/backstage/rental/contractAccount/detail",param,fac.postConfig).success(function(resp){
                if(resp.code==0){
                    $scope.receivableAmount = resp.data.receivableAmount;
                    $scope.receiveAmount = resp.data.receiveAmount;
                    $scope.reliefAmount = resp.data.reliefAmount;
                    $scope.unReceiveAmount = $scope.receivableAmount - $scope.receiveAmount - $scope.reliefAmount;
                }else{
                    window.alert(resp.msg);
                }

            });
        }
        //  获取合同详细信息
        $scope.pageModel ={};
        $scope.search = {contractId:$scope.contractId.id};
        $scope.find = function(){
			$http.post("/ovu-park/backstage/rental/rentalContractRelativeExpenditure/select", $scope.search, fac.postConfig).success(function(data){
                console.log(data);
                $scope.pageModel = data;
                // data.forEach(function (n) {
                //     if (n.firstPrice==0){
                //         n.firstPrice = null;
                //     }
                //     if (n.name!="履约保证金"){
                //         $scope.pageModel.push(n);
                //     }
                // });
			});
        }
        // 终止合同
        
        $scope.submit = function(isValid){
            if(!isValid.$valid ) {
                if(isValid.$error.pattern) {
                    window.alert('金额输入值必须大于0且最多两位小数！');
                }else{
                    window.alert('请完成必填项！');
                }
                return false;
            }
            confirm("确认终止该合同？", function () {
                var params = {
                    "id":$scope.contractId.id,
                    "suspendReason":$scope.suspendReason,
                    "suspendDate":$scope.suspendDate,
                    "costEndTime":$scope.costEndTime,
                    "planOutTime":$scope.planOutTime,
                    "agent":$scope.agent,
                    "agnetDept":$scope.agnetDept,
                    "breakContractPrice":$scope.breakContractPrice,
                    "deductionPrice":$scope.deductionPrice,
                    "breakContractRemark":$scope.breakContractRemark,
                    "updatorId":app.user.personId,
                    "updatorName":$scope.agent
                }
                $http.post("/ovu-park/backstage/rental/contractBaseInfo/suspend",params,fac.postConfig).success(function(resp){
                    if(resp.code==0){
                        // $location.url("/rental/rentAgreementNew/rentAgreement");
                        $scope.$emit("needToClose", curPage);
                    }else{
                        window.alert(resp.msg)
                    }
                });
            });
        }
        $scope.cancle =  function(){
            // $location.url('/rental/rentAgreementNew/rentAgreement')
            $scope.$emit("needToClose", curPage);
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
                templateUrl: '/view/rental/rentAgreementNew/modal.setCost.html',
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
