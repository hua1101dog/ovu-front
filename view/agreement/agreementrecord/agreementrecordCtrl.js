(function(){
    "use strict";
    var app = angular.module("angularApp");

    app.controller('recordHtmlCtrl',function($scope,$rootScope, $uibModal, $http, $state, $filter, fac,$sce ){
        $scope.search={
            compactInfoId:sessionStorage.getItem('id')
        };
        $http.post('/ovu-pcos/pcos/compact/info/view',$scope.search,fac.postConfig).success(function (data) {
            $scope.inform=data.compactInfo;
            $scope.itemList = data.itemList;
            $scope.content=$sce.trustAsHtml($scope.inform.compactDetail);
            if(data.compactCall){
                $scope.remind = data.compactCall;
            }else{
                $scope.remind = {};
            }
        })
      
        //合同备案
        $scope.examPass=function () {
            $http.post('/ovu-pcos/pcos/compact/info/recordPass',$scope.search,fac.postConfig).success(function (data) {
                if(data.status==0){
                    msg(data.desc);
                }
                else {
                    alert(data.desc);
                }
                 $state.go('admin', { folder: 'agreement', page: 'record'});
            })
        }
       
        $scope.back = function(){
            $state.go('admin', { folder: 'agreement', page: 'record'});
        }
    })
})();
