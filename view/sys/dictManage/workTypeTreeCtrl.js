/**
 * Created by Administrator on 2017/7/20.
 */
(function() {
    "use strict";
    var app = angular.module("angularApp");
    //项目架构ctl
    app.controller('workTypeTreeCtrl', function ($scope,$rootScope, $http,$filter,$uibModal,$timeout,fac) {
        document.title ="工作分类树";
        
        function getWorkTypeTree(type){
            $http.get("/ovu-pcos/pcos/workunit/worktypeTree", { params: {type:type} }).success(function (resp) {
                if(resp.code == 0){
                    var tree = resp.data || [];
                    fac.copyTreeState($scope.worktypeTree,tree);
                    $scope.worktypeTree = tree;
                    
                }
            })
        }
        $timeout(function() {
            getWorkTypeTree($scope.type);
        })
        //添加一级分类
        $scope.addTopNode = function(){
            var worktype = {type:$scope.type};
            var modal = $uibModal.open({
                animation: true,
                size:'',
                templateUrl: '/view/workunit/modal.worktype.html',
                controller: 'worktypeCtrl'
                ,resolve: {worktype: function(){return angular.extend({},worktype);}}
            });
            modal.result.then(function (data) {
                getWorkTypeTree($scope.type);
            }, function () {
                console.info('Modal dismissed at: ' + new Date());
            });
        }

        //添加子分类
        $scope.addSon = function (node) {
            $http.get("/ovu-pcos/pcos/workunit/listWorkitem.do?worktypeId="+node.id).success(function(itemList){
                if(itemList.length){
                    alert("此工作分类下已存在"+itemList.length+"个工作事项,不可添加子分类！");
                }else{
                    var worktype = {ptexts:(node.ptexts?node.ptexts+">":"")+node.text,PARENT_ID:node.id,
                        pids:(node.pids?node.pids+",":"")+node.id,
                        type:$scope.type}
                    var modal = $uibModal.open({
                        animation: true,
                        size:'',
                        templateUrl: '/view/workunit/modal.worktype.html',
                        controller: 'worktypeCtrl'
                        ,resolve: {worktype: function(){return worktype;}}
                    });
                    modal.result.then(function (data) {
                        getWorkTypeTree($scope.type);
                    });
                }
            })
        }
        //编辑分类
        $scope.editNode = function(node,pnode){
            node.WORKTYPE_NAME = node.text;
            node.ID = node.id;
            node.PARENT_ID=node.pid;
            var modal = $uibModal.open({
                animation: true,
                size:'',
                templateUrl: '/view/workunit/modal.worktype.html',
                controller: 'worktypeCtrl'
                ,resolve: {worktype: function(){return angular.extend({},node);}}
            });
            modal.result.then(function (data) {
                getWorkTypeTree($scope.type);
            });
        }
         //移动菜单
         $scope.moveNode = function(node){
            var copy = angular.extend({name:'节点'},node);
            $http.get("/ovu-pcos/pcos/workunit/worktypeTree", { params: {type:$scope.type} }).success(function(resp){
                var nodeFolders  = resp.data;
                var modal = $uibModal.open({
                    animation: false,
                    size:'',
                    templateUrl: 'sys/modal.moveMenu.html',
                    controller: 'modalMoveNodeCtrl'
                    ,resolve: {item: function(){return copy;},nodeFolders:function(){return nodeFolders}}
                });
                modal.result.then(function () {
                    getMenuTree($scope.curModule.id);
                }, function () {
                    console.info('Modal dismissed at: ' + new Date());
                });
            })
        }

        //选中分类项
        $scope.selectNode= function (node) {
            var curNode = fac.getSelectedNode($scope.worktypeTree);
            if (curNode && curNode != node) {
                curNode.state.selected = false;
            }
            node.state = node.state || {};
            node.state.selected = !node.state.selected;
        }

        //删除分类项
        $scope.delNode = function(node){
            if(node.nodes && node.nodes.length){
                alert("此节点有下级节点,不能删除！")
            }else{
                confirm("确定删除分类["+node.text+"]吗?",function(){
                    $http.get("/ovu-pcos/pcos/workunit/delWorktype.do",{params:{worktype_id:node.WORKTYPE_ID}}).success(function(resp){
                        if(resp.success){
                            getWorkTypeTree($scope.type);
                        }else{
                            alert(resp.error);
                        }
                    });
                })
            }
        }

    });

    app.controller('worktypeCtrl', function($scope,$rootScope,$http,$uibModalInstance,$filter,fac,worktype) {
        $scope.item = worktype;
        

        $scope.save = function(form,item){
            form.$setSubmitted(true);
            if(!form.$valid){
                return;
            }
            $http.post("/ovu-pcos/pcos/workunit/saveWorktype.do",item,fac.postConfig).success(function(resp, status, headers, config) {
                if(resp.success){
                    var rsdata=resp.data;
                    rsdata.ptexts = item.ptexts;
                    rsdata.text = rsdata.WORKTYPE_NAME;
                    rsdata.id = rsdata.ID;
                    rsdata.pid = rsdata.PARENT_ID;
                    rsdata.WORKTYPE_ID = rsdata.ID;
                    $uibModalInstance.close(rsdata);
                    msg("保存成功!");
                } else {
                    alert(resp.error);
                }
            })
        }

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    });
   
    app.controller('modalMoveNodeCtrl', function($scope,$http,$uibModalInstance,fac,item,nodeFolders) {
        $scope.item = item;
        $scope.menuFolders = nodeFolders;
        $scope.save = function () {
            var params = {menuId:item.id,pid:item.pid}
            // $http.get("/ovu-base/sys/menu/move", {params:params}).success(function (data, status, headers, config) {
            //     if (data.code === 0) {
            //         $uibModalInstance.close();
            //         msg("保存成功!");
            //     } else {
            //         alert(data.msg);
            //     }
            // })
            console.log(params)
        }

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    });



})();
