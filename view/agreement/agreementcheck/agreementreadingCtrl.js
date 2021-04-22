(function(){
    "use strict";
    var app = angular.module("angularApp");

    app.controller('readingHtmlCtrl',function($scope,$rootScope, $uibModal, $http, $state, $filter, fac,$sce ){
        $scope.search={
            compactInfoId:sessionStorage.getItem('id')
        };
        $http.post('/ovu-pcos/pcos/compact/info/check',$scope.search,fac.postConfig).success(function (data) {
            $scope.inform=data.compactInfo;
            $scope.content=$sce.trustAsHtml($scope.inform.compactDetail);
        })
        $http.post('/ovu-pcos/pcos/compact/info/backFlowList',$scope.search,fac.postConfig).success(function (data) {
            $scope.stepList=data;
        })
        $scope.examPass=function () {
            $http.post('/ovu-pcos/pcos/compact/info/pass',$scope.search,fac.postConfig).success(function (data) {
                if(data.status==0){
                    msg(data.desc);
                }
                else {
                    alert(data.desc);
                }
                 $state.go('admin', { folder: 'agreement', page: 'check'});
            })
        }
        $scope.agreementback=function () {
            if($scope.search.passDetail==undefined){
                alert('请输入退回意见');
                return;
            }
            if(!$scope.search.flowId){
                alert('请选择退回流程');
                return;
            }
            $http.post('/ovu-pcos/pcos/compact/info/back',$scope.search,fac.postConfig).success(function (data) {
                if(data.status == 0){
                    msg(data.desc);
                }else{
                    alert(data.desc);
                }
                $state.go('admin', { folder: 'agreement', page: 'check'});

            })
        };

        $scope.back = function(){
            $state.go('admin', { folder: 'agreement', page: 'check'});
        }
    })
})();
