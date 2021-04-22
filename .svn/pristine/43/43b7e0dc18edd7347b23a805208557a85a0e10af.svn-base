(function() {
    document.title = "一人一档";
    "use strict";
    var app = angular.module("angularApp");
    app.service('AppService', function ($http, fac) {
        var that = this;
        this.park = { parkNo: '', parkName: '' };
        //项目编号
        this.parkNo = '';
    });
    app.controller('aPersonACtrl',function($scope, $rootScope, $interval, $http, $filter, $uibModal, fac, AppService) {
        $scope.tabs = true;
        $scope.search = {};
        $scope.pageModel = {};
        $scope.personList = [];
        
        app.modulePromiss.then(function () {
            $rootScope.$watch('dept.id', function (deptId, oldValue) {
                if (deptId) {
                    var parkDept = fac.getParkDept(null, deptId);
                if (parkDept) {
                  $scope.search.parkId = parkDept.parkId;
                  $scope.search.parkName = parkDept.parkName;
                  console.log('$scope.search.parkId :', $scope.search.parkId);
                } else {
                  $scope.search.parkId = '';
                  $scope.search.parkName = '';
                };
              };
            });
          });
          function getDisRealList(pageNo){
            $http.get(`/faceDiscern/stranger/listByPage?pageIndex=${pageNo || 0}&pageSize=${$scope.pageModel.pageSize || 10}&parkId=${$scope.search.parkId}`).success(function (resp) {
               $scope.pageModel = resp.data;
               $scope.pageModel.disabled = "加载更多";
               let  datas = resp.data.data;
               for (let i = 0; i < datas.length; i++) {
                //    datas[i].avatarPhoto = "http://192.168.6.100" + datas[i].avatar;
                //    datas[i].photosLength = datas[i].photos.length;
               }
               $scope.personList = $scope.personList.concat(resp.data.data);
               if(resp.data.data.length<10){
                   $scope.pageModel.disabled = "没有更多了!"
               }
            });
        };
        function getRealList(pageNo){
            $http.get(`/faceDiscern/staffManage/listByPage?pageIndex=${pageNo || 0}&pageSize=${$scope.pageModel.pageSize || 10}&parkId=${$scope.search.parkId}`).success(function (resp) {
               $scope.pageModel = resp.data;
               $scope.pageModel.disabled = "加载更多";
               let  datas = resp.data.data;
               for (let i = 0; i < datas.length; i++) {
                   datas[i].avatarPhoto = "http://192.168.6.100" + datas[i].avatar;
                   datas[i].photosLength = datas[i].photos.length;
               }
               $scope.personList = $scope.personList.concat(resp.data.data);
               if(resp.data.data.length<10){
                   $scope.pageModel.disabled = "没有更多了!"
               }
            });
        };
        var page = 1;
        $scope.loadMore = function(){
            if($scope.tabs){
                page++;
                getRealList(page);
            }else{
                getDisRealList(page);
            }
        };
        $scope.$watch('tabs', function (current, prev) {
           console.log( 'prev :', current);
           if(current){
            $scope.personList = [];
            getRealList(1);
           }else{
            $scope.personList = [];
            getDisRealList(0);
           }
        });
        $scope.goDetails = function(item){
            $rootScope.target("equipment/aPersonADetail", "档案详情", false, '', {
                "item": item,
              }, "equipment/aPersonADetail");
        };
    });
})();
