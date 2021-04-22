/**
 * Created by wangheng on 2017/9/19.
 * 通知
 */
(function() {
    "use strict";
    var app = angular.module("app",['ng.ueditor']);

    //通知list控制器
    app.controller('NotifyCtrl', NotifyCtrl);
    function NotifyCtrl($scope, $http,$state, fac) {
        var vm = this;
        $scope.pageModel = {};
        $scope.search = {};
        vm.title = "通知公告";
        //查看
        vm.see = function (noticeId) {
            if(!fac.isEmpty(noticeId)) {
                $state.go('app.homeManage.notify.details', {id: noticeId});
            }
        }
        // 新增
        vm.add = function(){
            $state.go('app.homeManage.notify.add');
        }
        // 修改
        vm.edit = function(noticeId){
            if(!fac.isEmpty(noticeId)) {
                $state.go('app.homeManage.notify.add', {id: noticeId});
            } else {
            }
        }
        //批量删除
        vm.batchDel = function () {
            var ids = $scope.pageModel.list.reduce(function(ret, n) {
                n.checked && ret.push(n.noticeId);
                return ret
            }, []);
            del(ids);
        }
        //单个删除
        vm.del = function (id) {
            del([id]);
        }

        function del(ids) {
            confirm("确认删除?", function() {
                $http.post("/ovu-pcos/pcos/govcloud/notice/delete.do", {
                    "noticeIds": ids.join()
                }, fac.postConfig).success(function(resp) {
                    if (resp.success) {
                        $scope.find();
                    } else {
                        alert(resp.error);
                    }
                })
            });
        }

        $scope.find = function(pageNo){
            angular.extend($scope.search,{currentPage:pageNo||$scope.pageModel.currentPage||1,pageSize:$scope.pageModel.pageSize||10});
            fac.getPageResult("/ovu-pcos/pcos/govcloud/notice/list.do",$scope.search,function(data){
                $scope.pageModel = data;
            });
        };

        $scope.find(1);

    }

    app.controller('NotifyAddCtrl', NotifyAddCtrl);
    function NotifyAddCtrl($scope,$state, $http, fac) {
        var vm = this;
        vm.item={};
        vm.titles=['通知公告','新增通知公告'];
        var noticeId = $state.params.id;
        //修改
        if(fac.isNotEmpty(noticeId)){
            vm.titles[1] = '编辑通知公告'
            $http.get("/ovu-pcos/pcos/govcloud/notice/get.do?noticeId="+noticeId).success(function(data) {
                vm.item = data || {};
            }).error(function () {
                alert();
            })
        }
        //ue空间准备就绪便会触发
        $scope.ready = function(editor){
        }
        //保存
        vm.save = function (form,item) {
            form.$setSubmitted(true);
            if(!form.$valid){
                return;
            }
            var param = {title:item.title,content:item.content,noticeId:noticeId};
            $http.post("/ovu-pcos/pcos/govcloud/notice/edit.do",param,fac.postConfig).success(function(data) {
                if(data.success){
                    msg("保存成功!");
                    stateGoList($state);
                } else {
                    alert();
                }
            })
        }
        
        vm.cancel = function () {
            stateGoList($state);
        }
    }
    //查看详情
    app.controller('NotifyDetailsCtrl', NotifyDetailsCtrl);
    function NotifyDetailsCtrl($scope,$state, $http) {
        var vm = this;
        vm.item={};
        vm.titles=['通知公告','查看通知公告'];
        //修改
        $http.get("/ovu-pcos/pcos/govcloud/notice/get.do?noticeId="+$state.params.id).success(function(data) {
            var content="<h2 style='text-align: center;'>"+data.title+"</h2>"+data.content;
            vm.item.content =content;
        }).error(function () {
            alert();
        })

        //ue空间准备就绪便会触发
        $scope.ready = function(editor){
            //禁用ue只能查看
            editor.setDisabled('fullscreen');
        }

        vm.cancel = function () {
            stateGoList($state);
        }
    }

    function stateGoList($state) {
        $state.go('app.homeManage.notify.list');
    }

})();