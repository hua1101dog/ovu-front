(function() {
    var app = angular.module("angularApp");

    app.controller('passengerStaticsCtl', function ($scope,$rootScope,$uibModal, $http,$filter,fac,$q) {
        document.title ="OVU-客流统计分析";
        $scope.pageModel = {};
        $scope.search = {};

        app.modulePromiss.then(function(){
            $rootScope.$watch('dept.id', function (deptId, oldValue) {
                if (deptId) {
                    delete $scope.search.floorId;
                    delete $scope.search.buildName;
                    getBuildTree(deptId);

                    $scope.find(1);
                }else{
                    $scope.pageModel = {};
                }
            })
        });


        //查询
        $scope.find = function(pageNo){
            if(!fac.initDeptId($scope.search)){
                return;
            }
            $.extend($scope.search,{currentPage:pageNo||1,pageSize:$scope.pageModel.pageSize||10});
            fac.getPageResult("/ovu-pcos/pcos/passengerFlow/list.do",$scope.search,function(data){
                $scope.pageModel = data;
                data.data.forEach(function (item) {
                    item.retenNum=0;
                    if (item.codes) {
                        getPassengerData(item.codes).then(function (psData) {
                            console.log(psData);

                            item.videos.forEach(function (v) {
                                v.enterNum=0;
                                v.exitNum=0;
                                psData.forEach(function (o) {
                                    if (v.code==o.code) {
                                        v.enterNum=o.enterNumber;
                                        v.exitNum=o.exitNumber;
                                    }
                                })
                                item.retenNum+=(v.enterNum-v.exitNum);
                            })
                        })
                    }

                })

            });
        };

        function getPassengerData(codes) {
            var deferred = $q.defer();
            var param={cameraCodes:codes,time:moment().format('YYYY-MM-DD')};

            $http.post("/dapingAgent/api/camera/getCameraPassenger",param,fac.postConfig).success(function (data) {
                if(data.code==0){
                    deferred.resolve(data.data);
                }
            });
            return deferred.promise;
        }

        function getBuildTree(deptId) {
            $http.post("/ovu-pcos/pcos/passengerFlow/getBuildTree.do",{deptId:deptId},fac.postConfig).success(function (data) {
                if(data.code==0){
                    $scope.houseTree=data.data;
                }
            });
        }

    });

})()
