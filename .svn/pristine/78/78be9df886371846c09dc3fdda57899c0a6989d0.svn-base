/**
 * Created by Administrator on 2017/7/20.
 */
(function() {
    "use strict";
    var app = angular.module("angularApp");
    app.controller('multiProjectCtrl', function ($scope, $http,$uibModal,fac,$location) {
        document.title ="多项目概览";
        $scope.search = {};
        $scope.pageModel = {};

        $scope.find = function(pageNo){
            $.extend($scope.search,{currentPage:pageNo||$scope.pageModel.currentPage||1,pageSize:$scope.pageModel.pageSize||10});
            $scope.search.pageIndex = $scope.search.currentPage-1;
            fac.getPageResult("/ovu-pcos/taking/statistics/list",$scope.search,function(data){
                data.data.forEach(function(item){
                    if(!item.taking_state || item.taking_state==0){
                        item.progress="0%";//未立项
                    }else if(item.taking_state==1){
                        item.progress="50%";//承接中断
                    }else if(item.taking_state==2){
                        item.progress="100%";//完成
                    }else if(item.taking_state==4){
                        item.progress="80%";//承接中
                    }else{
                        item.progress="0%";
                    }
                });
                $scope.pageModel = data;
            });
        };
        $scope.find(1);

        //承接立项
        $scope.approval = function(item){
          var obj={projectId:item.id,projectName:item.name,state:item.taking_state};
            $location.url("/undertaking/approval/takingApprove").search(obj);
        };
        //查看详情
        $scope.show = function(item){
            var obj={projectId:item.id,projectName:item.name,state:item.taking_state};
            $location.url("/undertaking/statistics/singleProject").search(obj);
        };
        //二次承接
        $scope.twice = function(item){
            var obj={projectId:item.id,projectName:item.name,state:item.taking_state};
            $location.url("/undertaking/twice/takingInit").search(obj);
        };
    });
})();
