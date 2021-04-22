/**
 * Created by wangheng on 2017/8/28.
 */
(function() {
    "use strict";
    var app = angular.module("angularApp");
    app.controller('MultiVideoCtrl', function ($scope,$rootScope, $http,$filter,$uibModal,$location,fac) {
    	var vm= this;
        document.title ="视频监控";
        $scope.pageModel = {pageSize:3};

        app.modulePromiss.then(function(){
            $scope.search = {
                isGroup: fac.isGroupVersion()
            };
            if (app.park) {
               /* $scope.search.parkId = app.park.ID;
                $scope.search.PARK_NAME = app.park.PARK_NAME;*/
            }
            $scope.find();
        })

        $scope.find = function(pageNo){
           /* if(!fac.hasActivePark($scope.search)){
                return;
            }*/
            angular.extend($scope.search,{currentPage:pageNo||$scope.pageModel.currentPage||1,pageSize:$scope.pageModel.pageSize||10});
            fac.getPageResult("/ovu-pcos/pcos/fire/firemonitor/list.do",$scope.search,function(data){
                $scope.pageModel = data;
            });
        };

        vm.goSingleVedio = function (item){
        	$rootScope.singleVideoParam=angular.copy(item);
        	$location.path('/fire/singleVideo').search({firePointId:item.firePointId});
        }

    });

})();
