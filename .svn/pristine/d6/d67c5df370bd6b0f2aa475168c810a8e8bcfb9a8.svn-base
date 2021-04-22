/**
 * Created by Zn on 2018/1/3.
 */
(function () {
    "use strict";
    var app = angular.module("angularApp");

    app.controller('playbackInformCtrl', function ($scope, $rootScope, $uibModal, $state, $http, $filter, fac) {
        $scope.startTime='';
        $scope.equipmentId='';
        app.modulePromiss.then(function () {
            $scope.openerOpenTime=sessionStorage.getItem('openerOpenTime')
            $scope.equipmentId = sessionStorage.getItem('equipmentId');
                   
            // $scope.startTime = GetDate($scope.openerOpenTime);
          
           console.log( $scope.endTime);
           console.log($scope.startTime)
            $scope.equipmentId = sessionStorage.getItem('equipmentId');
            if(fac.isNotEmpty($scope.equipmentId) && ($scope.equipmentId!=='null')){
                $http.get('/ovu-pcos/api/video/getCameras.do?equipmentId='+$scope.equipmentId).success(function(res){
                    if(res.code ==0 ){
                        //摄像头列表
                        $scope.cameraList=res.data || []
                    }
                })
            }else{
                alert("未指定摄像机！")
            }        
         
        })
        
       
      
        $scope.goback = function () {
            $state.go('admin', {folder: 'acs', page: 'open'});
        }
       
    });
  
})();
