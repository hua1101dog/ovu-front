(function() {
    var app = angular.module("angularApp");
    app.controller('assetManageCtrl', function ($scope, $rootScope, $http, $filter, $uibModal, fac) {
    	document.title ="OVU-资产安全权限管理";
        angular.extend($rootScope,fac.dicts);
        $scope.assetSafe = [
            {
                value:1,
                text:"已开启"
            },
            {
                value:0,
                text:"已关闭"
            }
        ]
        
        $scope.search = {
            assetSafe:"",
            loginName:"",
            nickname:"",
        };
        $scope.pageModel = {};
        $scope.find = function(pageNo){
            $.extend($scope.search,{
                currentPage:pageNo||$scope.pageModel.currentPage||1,
                pageSize:$scope.pageModel.pageSize||10
            });

            $scope.search.parkId = app.park && app.park.parkId ? app.park.parkId : "";
            $scope.search.pageIndex = $scope.search.currentPage-1;
            $scope.search.totalCount = $scope.pageModel.totalCount||0;

            if($scope.pageModel.currentPage){
                delete $scope.pageModel.currentPage;
            }

            fac.getPageResult("/ovu-park/backstage/assetsafety/listAccount",$scope.search,function(data){
                $scope.pageModel = data;
            });
        };
        console.log(app.user);
        $scope.change = function(state,id){
            // state 1 已开启  0 未开启
            // assetSafe  是否开启 1开启，0关闭
            var params = {
                assetSafe:state==1?0:1,
                loginId:id,
                parkId: app.park && app.park.parkId ? app.park.parkId : ""
            }
           var cache = state==1 ? "关闭" : "开启";
            confirm("确定" + cache + "权限?",function(){
                $http.post("/ovu-park/backstage/assetsafety/updateAssetSafe",params,fac.postConfig).success(function(resp){
                    if(resp.code == 0){
                        window.msg("已为您"+cache+"权限");
                        $scope.find();
                    }else{
                    	window.alert(resp.message);
                    }
                });
            })
        }
        app.modulePromiss.then(function() {
            fac.initPage($scope,function(){
                $scope.find(1);
            })
        });
    });
    // 发布状态
    app.filter("userType", function () {
        return function (status) {
            if (status == 1) {
                return "个人";
            } else if (status == 2) {
                return "企业";
            } else if (status == 3) {
                return "员工";
            } else {
                return "--";
            }
        }
    });
})()
