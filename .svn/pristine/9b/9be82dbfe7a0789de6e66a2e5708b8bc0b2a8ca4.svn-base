/**
 * Created by wangheng on 2017/9/19.
 * 通知
 */
(function() {
    "use strict";
    var app = angular.module("app");

    //通知list控制器
    app.controller('NotifyDetailCtrl', NotifyDetailCtrl);
    function NotifyDetailCtrl($scope, $http,$state, fac) {
        var vm = this;
        $scope.pageModel = {};
        $scope.search = {noFilter:true};
        vm.title = "通知公告";

        $scope.find = function(pageNo){
            angular.extend($scope.search,{currentPage:pageNo||$scope.pageModel.currentPage||1,pageSize:$scope.pageModel.pageSize||10});
            fac.getPageResult("/ovu-pcos/pcos/govcloud/notice/list.do",$scope.search,function(data){
                $scope.pageModel = data;
                //如果首页点击单个新闻跳转而来
                if($state.params.id){
                    vm.see($state.params.id)
                }else {
                    fac.isNotEmpty(data.data) && vm.see(data.data[0].noticeId);
                }

            });
        };

        vm.see = function (id) {
            $http.get("/ovu-pcos/pcos/govcloud/notice/get.do?noticeId="+id).success(function(data) {
                var content="<h2 style='text-align: center;'>"+data.title+"</h2>"+data.content;
                vm.content =content;
            }).error(function () {
                alert();
            })
        }

        //ue空间准备就绪便会触发
        $scope.ready = function(editor){
            //禁用ue只能查看
            editor.setDisabled('fullscreen');
        }

        $scope.find(1);
    }

})();