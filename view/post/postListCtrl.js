
(function() {

    var app = angular.module("angularApp");
    app.controller('postCtl', function ($scope,$rootScope, $http,$filter,$uibModal,fac) {
        document.title ="OVU-岗位管理";
        $scope.search={};
        $scope.pageModel={};
        app.modulePromiss.then(function(){
            $scope.search = {isGroup:fac.isGroupVersion()};
            loadPostTypeTree();
            $scope.find(1);
        });

        //查询
        $scope.find = function(pageNo) {
            $.extend($scope.search, {
                currentPage: pageNo || $scope.pageModel.currentPage || 1,
                pageSize: $scope.pageModel.pageSize || 10
            });
            fac.getPageResult("/ovu-base/system/post/listByGrid.do", $scope.search, function(data) {
                $scope.pageModel = data;
            });
        };

        //新增分类
        $scope.addSon= $scope.addTopNode = function(node){
            var type=node ? {parentId:node.id}: {};
            var modal = $uibModal.open({
                animation: false,
                size:'md',
                templateUrl: 'post/modal.postType.html',
                controller: 'postTypeModalCtrl'
                ,resolve: {type:function(){return  angular.extend({},type);}}
            });
            modal.result.then(function (data) {
                if(node){
                    node.state = node.state || {};
                    node.state.expanded = true;
                    node.nodes = node.nodes || [];
                    node.nodes.push(data);
                }else{
                    $scope.postListTreeData.push(data);
                }
            }, function () {
                console.info('Modal dismissed at: ' + new Date());
            });
        };
        //编辑分类
        $scope.editNode = function(node){
            node=node || {};
            var modal = $uibModal.open({
                animation: false,
                size:'md',
                templateUrl: 'post/modal.postType.html',
                controller: 'postTypeModalCtrl'
                ,resolve: {type:function(){return  angular.extend({},node);}}
            });
            modal.result.then(function (data) {
                angular.extend(node,data);
            }, function () {
                console.info('Modal dismissed at: ' + new Date());
            });
        };

        //选中分类
        $scope.selectNode= function (search,node) {
            if(node.state.selected){
                $scope.curNode=node;
            }else{
                delete $scope.curNode;
            }
            $scope.find(1);
        };
        //删除分类
        $scope.delNode = function(node){
            if(node.nodes && node.nodes.length>0){
                alert('该分类下还有子分类，不能删除！');
                return;
            }

            confirm("确认删除分类["+node.text+"]吗?",function(){
                $http.post("/ovu-base/system/postType/remove.do",{id:node.id},fac.postConfig).success(function(data){
                    if(data.success){
                        if ($scope.curNode == node) {
                            delete $scope.curNode;
                        }
                        var list = fac.treeToFlat($scope.postListTreeData);
                        var parent = list.find(function(n){return n.id == node.parentId });
                        if (parent) {
                            parent.nodes.splice(parent.nodes.indexOf(node), 1)
                        } else {
                            $scope.postListTreeData.splice($scope.postListTreeData.indexOf(node), 1)
                        }
                    }else{
                        alert(data.error);
                    }
                });
            })
        };

        //新增岗位
        $scope.editPost = function(item){
            if($scope.curNode){
                item=item || {postType:$scope.curNode.id};
                var modal = $uibModal.open({
                    animation: false,
                    size:'',
                    templateUrl: 'post/modal.post.html',
                    controller: 'postModalCtrl'
                    ,resolve: {post:function(){return  angular.extend({},item);}}
                });
                modal.result.then(function (data) {
                    $scope.find();
                }, function () {
                    console.info('Modal dismissed at: ' + new Date());
                });
            }else{
                alert('请选择一个岗位分类！');
            }
        };
        //删除岗位
        $scope.del = function(item){
            confirm("确认删除该岗位吗?",function(){
                $http.post("/ovu-base/system/post/remove.do",{id:item.id},fac.postConfig).success(function(data){
                    if(data.success){
                        $scope.find();
                    }else{
                        alert(data.error);
                    }
                });
            })
        };

        function loadPostTypeTree(){
            $http.post("/ovu-base/system/postType/tree.do",{},fac.postConfig).success(function(data){
                $scope.postListTreeData = data;
            });
        };

    });

    app.controller('postTypeModalCtrl', function($scope,$rootScope,$http,$uibModalInstance,$uibModal,$filter,fac,type) {
        $scope.item = type || {};

        //保存
        $scope.save = function(form, item) {
            form.$setSubmitted(true);
            if (!form.$valid) {
                return;
            }

            $http.post("/ovu-base/system/postType/save.do", item,fac.postConfig).success(function(resp) {
                if (resp.success) {
                    var type=resp.data;
                    type.text=type.typeName;
                    $uibModalInstance.close(type);
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
    app.controller('postModalCtrl', function($scope,$rootScope,$http,$uibModalInstance,$uibModal,$filter,fac,post) {
        $scope.item = post || {};
        $http
        .get("/ovu-base/sys/orgRole/listModuleAndRole")
        .success(function (resp) {
            if (resp.code == 0) {

                if(post.roleIds){
                    var arr=post.roleIds.split(',')
                    $rootScope.execTreeNode(resp.data,function(role){
                        if(role.roles){
                            $rootScope.execTreeNode(role.roles,function(n){
                                var id=n.id+''
                              if(arr.indexOf(id)>=0){
                               
                                  n.checked=true
                                
  
                              }
                             
                          })
                        }
                    })
                }
                $scope.modules = resp.data;
                
            }
        });

        //保存
        $scope.save = function(form, item) {
            form.$setSubmitted(true);
            if (!form.$valid) {
                return;
            }var roleIdList = [];
            $scope.modules &&
                $scope.modules.forEach(function (n) {
                    n.roles &&
                        n.roles.forEach(function (m) {
                            m.checked && roleIdList.push(m.id);
                        });
                });
                item.roleIds=roleIdList.join()
            $http.post("/ovu-base/system/post/save.do", item,fac.postConfig).success(function(data) {
                if (data.success) {
                    $uibModalInstance.close();
                    msg("保存成功!");
                } else {
                    alert(data.error);
                }
            })
        }


        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    });
})()
