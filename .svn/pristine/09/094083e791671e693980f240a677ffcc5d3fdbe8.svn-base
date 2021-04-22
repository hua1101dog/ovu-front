/**
 * Created by Administrator on 2017/7/20.
 */
(function() {
    "use strict";
    var app = angular.module("angularApp");
    app.controller('resourceCtrl', function ($scope, $http,$uibModal,fac) {

        $scope.search = {};
        $scope.pageModel = {};
        $scope.config = {
            moveOper: true,
            edit:true
        }
        $scope.getResourceTree= function(pageNo){
            $http.get("/ovu-base/sys/resource/tree?withUrl=false").success(function(resp){
                $scope.treeData  = resp.data;
            })
        }
        $scope.getResourceTree();

        $scope.find = function(pageNo){
            $.extend($scope.search,{currentPage:pageNo||$scope.pageModel.currentPage||1,pageSize:$scope.pageModel.pageSize||10});
            $scope.search.pageIndex = $scope.search.currentPage-1;
            fac.getPageResult("/ovu-base/sys/resource/list",$scope.search,function(data){
                $scope.pageModel = data;
            });
        };
        $scope.find(1);

        $scope.addTopNode = function(){
            $scope.treeData.push({state:{edit:true},copy:{is_leaf:2}});
        }

        $scope.addSon= function(node){
            $http.get("/ovu-base/sys/resource/hasLeaf?pid="+node.id).success(function(resp){
                if(resp.cnt>0){
                    alert("此分类已存在资源，不可再添加下级分类！");
                }else{
                    node.nodes = node.nodes||[];
                    node.state = node.state||{};
                    node.state.expanded = true;
                    node.nodes.push({pid:node.id,state:{edit:true},copy:{pid:node.id,pids:(node.pids?node.pids+",":"")+node.id,is_leaf:2}});
                }
            })
        }
        $scope.editNode = function(node){
            node.copy = angular.extend({},node);
            node.state = node.state||{};
            node.state.edit = true;
        }
            //移动菜单
        $scope.moveNode = function(node){
            var copy = angular.extend({},node);
                var menuFolders  = $scope.treeData;
                var modal = $uibModal.open({
                    animation: false,
                    size:'',
                    templateUrl: 'sys/modal.moveResource.html',
                    controller: 'modalMoveResourceCtrl'
                    ,resolve: {item: function(){return copy;},menuFolders:function(){return menuFolders}}
                });
                modal.result.then(function () {
                    $scope.getResourceTree();

                }, function () {
                    console.info('Modal dismissed at: ' + new Date());
                });
        }

        $scope.selectNode= function (search,node) {
            if(node.state.selected){
                $scope.search.pid=node.id;
                $scope.curNode = node;
            }else{
                delete $scope.curNode;
            }
            $scope.find(1);
        }

        $scope.delNode = function(node){
            if(node.nodes && node.nodes.length){
                alert("此节点有下级节点,不能删除！")
            }else{
                $http.get("/ovu-base/sys/resource/hasLeaf?pid="+node.id).then(function(resp){
                    if(resp.cnt>0){
                        alert("此分类已存在资源，请先删除资源！");
                    }else{
                        confirm("确定删除 "+node.text,function(){
                            $http.get("/ovu-base/sys/resource/delType?id="+node.id).success(function(resp){
                                if(resp.code === 0){
                                    if($scope.curNode == node){
                                        delete $scope.curNode;
                                    }
                                    var parent = fac.getNodeById($scope.treeData,node.pid);
                                    if(parent){
                                        parent.nodes.splice(parent.nodes.indexOf(node),1)
                                    }else{
                                        $scope.treeData.splice($scope.treeData.indexOf(node),1)
                                    }
                                }
                            });
                        })
                    }
                });
            }
        }

        $scope.delAll = function(){
            var ids = $scope.pageModel.list.reduce(function(ret,n){n.checked && ret.push(n.id);return ret},[]);
            del(ids,"确认删除选中的 "+ids.length+" 条资源吗?");
        };
        $scope.del = function(item){
            del([item.id],"确认删除 "+item.text+" 吗?");
        }

        function del(ids,msg){
            confirm(msg,function(){
                $http.post("/ovu-base/sys/resource/del",{"ids":ids.join()},fac.postConfig).success(function(resp){
                    if(resp.code === 0){
                        $scope.find();
                    }else{
                        alert(resp.msg);
                    }
                })
            });
        }

        $scope.save = function(node,form){
            form.$setSubmitted(true);
            if(!form.$valid){
                return;
            }
            $http.post("/ovu-base/sys/resource/save",node.copy).success(function(resp){
                if(resp.code === 0){
                    msg("保存成功！");
                    angular.extend(node,resp.data);
                    node.state.edit= false;
                }else{
                    alert(resp.msg);
                }
            });
        }

        $scope.undo = function(node){
            if(node.id){
                node.state.edit = false;
            }else{
                var parent = node.pid && fac.getNodeById($scope.treeData,node.pid);
                if(parent){
                    parent.nodes.splice(parent.nodes.indexOf(node),1)
                }else{
                    $scope.treeData.splice($scope.treeData.indexOf(node),1)
                }
            }
        }

        //添加与保存域
        $scope.showEditModal = function(resource){
            var copy = angular.extend({is_leaf:1},resource);
            var modal = $uibModal.open({
                animation: false,
                size:'',
                templateUrl: 'sys/modal.resource.html',
                controller: 'modalResourceCtrl'
                ,resolve: {item: function(){return copy;}}
            });
            modal.result.then(function () {
                $scope.find();
            }, function () {
                console.info('Modal dismissed at: ' + new Date());
            });
        }

    });
    app.controller('modalMoveResourceCtrl', function($scope,$http,$uibModalInstance,fac,item,menuFolders) {
        $scope.item = item;
        $scope.menuFolders = menuFolders;
        $scope.save = function () {
            if(!item.pid){
                item.pid="";
            }
            $http.post("/ovu-base/sys/resource/save", item).success(function (data, status, headers, config) {
                if (data.code === 0) {
                    $uibModalInstance.close();
                    msg("保存成功!");
                } else {
                    alert(data.msg);
                }
            })
        }

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    });


    app.controller('modalResourceCtrl', function($scope,$http,$uibModalInstance,fac,item) {
        $scope.item = item;

        $http.get("/ovu-base/sys/resource/tree?withUrl=false").success(function(resp){
            $scope.treeData  = resp.data;
        })

        $scope.selectNode = function(node){
            item.pid = node.id;
            item.pids = (node.pids?node.pids+",":"")+node.id,
            item.ptexts= (node.ptexts?node.ptexts+ " > ":"") +node.text;
            item.typeHover = item.typeFocus = false;
        }

        $scope.save = function (form) {
            form.$setSubmitted(true);
            if (!form.$valid) {
                return;
            }
            $http.post("/ovu-base/sys/resource/save", item).success(function (data, status, headers, config) {
                if (data.code === 0) {
                    $uibModalInstance.close();
                    msg("保存成功!");
                } else {
                    alert(data.msg);
                }
            })
        }
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    });
})();
