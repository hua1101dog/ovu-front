/**
 * Created by wangheng on 2017/9/19.
 * 通知
 */
(function() {
    "use strict";
    var app = angular.module("app",['ng.ueditor']);

    //通知list控制器
    app.controller('DataCtrl', DataCtrl);
    function DataCtrl($scope, $http,$state, fac) {
        var vm = this;
        $scope.pageModel = {};
        $scope.search = {};
        vm.title = "公示数据";
        //查看
        vm.see = function (dataId) {
            if(!fac.isEmpty(dataId)) {
                $state.go('app.homeManage.data.details', {id: dataId});
            }
        }
        // 新增
        vm.add = function(){
            $state.go('app.homeManage.data.add');
        }
        // 修改
        vm.edit = function(dataId){
            if(!fac.isEmpty(dataId)) {
                $state.go('app.homeManage.data.add', {id: dataId});
            } else {
            }
        }
        //批量删除
        vm.batchDel = function () {
            var ids = $scope.pageModel.list.reduce(function(ret, n) {
                n.checked && ret.push(n.dataId);
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
                $http.post("/ovu-pcos/pcos/govcloud/data/delete.do", {
                    "dataIds": ids.join()
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
            fac.getPageResult("/ovu-pcos/pcos/govcloud/data/list.do",$scope.search,function(data){
                $scope.pageModel = data;
            });
        };

        $scope.find(1);

    }

    app.controller('DataAddCtrl', DataAddCtrl);
    function DataAddCtrl($scope,$state, $http, fac) {
        var vm = this;
        vm.item={};
        vm.titles=['公示数据','新增公示数据'];
        //是否展示类型这个字段
        vm.showType = true;
        //类型下拉框
        vm.typeDict  = fac.dicts.dataTypeDict;
        var dataId = $state.params.id;
        //修改
        if(fac.isNotEmpty(dataId)){
            vm.titles[1] = '编辑公示数据';
            $http.get("/ovu-pcos/pcos/govcloud/data/get.do?dataId="+dataId).success(function(data) {
                vm.item = data || {};
            }).error(function () {
                alert();
            })
        }
        //ue空间准备就绪便会触发
        $scope.ready = function(editor){
            vm.editor = editor;
        }
        //保存
        vm.save = function (form,item) {
            form.$setSubmitted(true);
            if(!form.$valid){
                return;
            }
            var param = {title:item.title,content:item.content,type:item.type,dataId:dataId};
            $http.post("/ovu-pcos/pcos/govcloud/data/edit.do",param,fac.postConfig).success(function(data) {
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

        // 编辑框第二次加载销毁
        $scope.$on('$destroy', function() {
            vm.editor.destroy();
        });
    }
    //查看详情
    app.controller('DataDetailsCtrl', DataDetailsCtrl);
    function DataDetailsCtrl($scope,$state, $http) {
        var vm = this;
        vm.item={};
        vm.titles=['公示数据','查看公示数据'];
        vm.editor;
        //修改
        $http.get("/ovu-pcos/pcos/govcloud/data/get.do?dataId="+$state.params.id).success(function(data) {
            var content="<h2 style='text-align: center;'>"+data.title+"</h2>"+data.content;
            vm.item.content =content;
        }).error(function () {
            alert();
        })

        //ue空间准备就绪便会触发
        $scope.ready = function(editor){
            //禁用ue只能查看
            vm.editor = editor;
            editor.setDisabled('fullscreen');
        }
        vm.cancel = function () {
            stateGoList($state);
        }

        // 编辑框第二次加载销毁
        $scope.$on('$destroy', function() {
            vm.editor.destroy();
        });
    }
    
    function stateGoList($state) {
        $state.go('app.homeManage.data.list');
    }

})();