/**
 * Created by Administrator on 2017/7/20.
 */
(function() {
    "use strict";
    var app = angular.module("angularApp");
    app.controller('menuCtrl', function ($scope,$rootScope, $http,$uibModal,$uibPosition,fac) {
        //资源树不可修改,仅作展示
        $scope.config={edit:false};
        function findModule(){
            $http.get("/ovu-base/sys/module/list").success(function(list){
                $scope.moduleList  = list;
                list.length && ($scope.showModuleMenu(list[0]));
            })
        }

        function getMenuTree(moduleId){
            $http.get("/ovu-base/sys/menu/tree?moduleId="+moduleId).success(function(resp){
                $scope.menuTree  = resp.data;
            })
        }
        $http.get("/ovu-base/sys/resource/tree?withUrl=true").success(function(resp){
            $rootScope.resourceTree  = resp.data;
        })

        //添加与保存子系统
        $scope.showModuleModal = function(module){
            var copy = angular.extend({},module);
            var modal = $uibModal.open({
                animation: false,
                size:'',
                templateUrl: 'sys/module.modal.html',
                controller: 'modalModuleCtrl'
                ,resolve: {item: function(){return copy;}}
            });
            modal.result.then(function () {
                findModule();
            }, function () {
                console.info('Modal dismissed at: ' + new Date());
            });
        }

        $scope.showModuleMenu = function(module){
            $scope.curModule = module;
            getMenuTree(module.id);
        }

        findModule()

        $scope.addTopNode = function(){
            if(!$scope.menuTree){
                alert("请先选中子系统！");
            }
            $scope.menuTree.push({state:{edit:true},copy:{moduleId:$scope.curModule.id}});
        }

        $scope.showResource = function(copy,event){
            var inputDiv = event.target;
            var offsetParent = $uibPosition.offsetParent(inputDiv);
            var resourceSelector  = document.querySelector("#resourceSelector");
                $scope.curCopy = copy;
                offsetParent.append(resourceSelector);
                angular.element(resourceSelector).css({ top:'36px', left:'0px' });
                angular.element(resourceSelector).removeClass("hide");
        }

        $scope.setCurCopy = function(copy){
            //console.log($scope.curCopy);
            if(!$scope.curCopy||copy!=$scope.curCopy){return}
            var resourceSelector  = document.querySelector("#resourceSelector");
            delete $scope.curCopy;
            angular.element(resourceSelector).addClass("hide");
            document.body.append($(resourceSelector).parent()[0].removeChild(resourceSelector));
        }
        $scope.save = function(node,form){
            form.$setSubmitted(true);
            if(!form.$valid){
                return;
            }
            node.copy.menuType = node.copy.resourceId?1:2;
            node.copy.icon = node.copy.icon?node.copy.icon:'fa fa-cube';
            $http.post("/ovu-base/sys/menu/save",node.copy).success(function(resp){
                if(resp.code === 0){
                    msg("保存成功！");
                    angular.extend(node,resp.data);
                    node.state.edit= false;
                }else{
                    alert();
                }
            });
        }
        //删除子系统
        $scope.delModule = function(module){
            confirm("确定删除 "+module.name+" 吗?",function(){
                $http.get("/ovu-base/sys/module/del/"+module.id).success(function(resp){
                    if(resp.code === 0){
                        if(module == $scope.curModule){
                            delete $scope.curModule;
                            $scope.menuTree  = [];
                        }
                        $scope.moduleList.splice($scope.moduleList.indexOf(module),1);
                        msg(resp.msg);
                    }else{
                        alert(resp.msg);
                    }
                });
            })
        }


        $scope.undo = function(node){
            if(node.id){
                node.state.edit = false;
            }else{
                var parent = node.pid && fac.getNodeById($scope.menuTree,node.pid);
                if(parent){
                    parent.nodes.splice(parent.nodes.indexOf(node),1)
                }else{
                    $scope.menuTree.splice($scope.menuTree.indexOf(node),1)
                }
            }
        }

        $scope.selectResource= function(resourceNode){
            if(!$scope.curCopy) return;
            if(!resourceNode.url){
                alert("请选择带有url资源的叶子节点！");
                return;
            }
            $scope.curCopy.resourceId = resourceNode.id;
            $scope.curCopy.resourceName = resourceNode.text;
            $("#resourceSelector").addClass("hide");
            document.body.append($("#resourceSelector").parent()[0].removeChild(resourceSelector));
        }

        //删除菜单
        $scope.delNode = function(node){
            if(node.nodes && node.nodes.length){
                alert("此节点有下级节点,不能删除！")
            }else{
                confirm("确定删除 "+node.text,function(){
                    $http.get("/ovu-base/sys/menu/del/"+node.id).success(function(resp){
                        if(resp.code === 0){
                            if($scope.curNode == node){
                                delete $scope.curNode;
                            }
                            var parent = fac.getNodeById($scope.menuTree,node.pid);
                            if(parent){
                                parent.nodes.splice(parent.nodes.indexOf(node),1)
                            }else{
                                $scope.menuTree.splice($scope.menuTree.indexOf(node),1)
                            }
                        }
                    });
                })
            }
        }

        $scope.editNode = function(node){
            node.copy = angular.extend({},node);
            node.state = node.state||{};
            node.state.edit = true;
        }





        //移动菜单
        $scope.moveNode = function(node){
            var copy = angular.extend({name:'菜单'},node);
            $http.get("/ovu-base/sys/menu/tree?withLeaf=false&moduleId="+$scope.curModule.id).success(function(resp){
                var menuFolders  = resp.data;
                var modal = $uibModal.open({
                    animation: false,
                    size:'',
                    templateUrl: 'sys/modal.moveMenu.html',
                    controller: 'modalMoveMenuCtrl'
                    ,resolve: {item: function(){return copy;},menuFolders:function(){return menuFolders}}
                });
                modal.result.then(function () {
                    getMenuTree($scope.curModule.id);
                }, function () {
                    console.info('Modal dismissed at: ' + new Date());
                });
            })
        }



        var curResource = {state:{}};
        var curMenu;
        $scope.selectMenuEdit= function (node) {
            if(curMenu != node){
                curMenu && curMenu.state &&(curMenu.state.selected = false);
            }
            node.state = node.state||{};
            node.state.selected = !node.state.selected;
            if(node.state.selected){
                curMenu = node;
            }

            if(node.state.selected && node.resourceId){
                var resource =  fac.getNodeById($scope.resourceTree,node.resourceId,true);
               if(curResource !=resource) {
                   curResource.state.selected = false;
               }
                curResource = resource;
                curResource.state = curResource.state||{};
                curResource.state.selected = true;
            }else{
                curResource && curResource.state &&(curResource.state.selected = false);
            }
        }

        $scope.addSon= function(node){
            node.nodes = node.nodes||[];
            node.state = node.state||{};
            node.state.expanded = true;
            node.nodes.push({pid:node.id,state:{edit:true},copy:{pid:node.id,pids:(node.pids?node.pids+",":"")+node.id,moduleId:$scope.curModule.id}});
        }

        $scope.sort = function(nodeList,node,index){
            if(index<0){
                index +=  nodeList.length;
            } else if(index >= nodeList.length){
                index -=  nodeList.length;
            }
            var otherNode = nodeList[index];
            if(!node.id ||!otherNode.id){
                alert("请先保存编辑中节点！");
                return;
            }
            var oriIndex= nodeList.indexOf(node);
            $http.post("/ovu-base/sys/menu/sort",[{id:node.id,sort:index},{id:otherNode.id,sort:oriIndex}]).success(function(resp){
                if(resp.code === 0){
                    nodeList.splice(oriIndex,1);
                    nodeList.splice(index,0,node);
                }else{
                    alert(resp.msg);
                }
            });
        }


    });


    
    app.controller('modalMoveMenuCtrl', function($scope,$http,$uibModalInstance,fac,item,menuFolders) {
        $scope.item = item;
        $scope.menuFolders = menuFolders;
        $scope.save = function () {
            var params = {menuId:item.id,pid:item.pid}
            $http.get("/ovu-base/sys/menu/move", {params:params}).success(function (data, status, headers, config) {
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








    app.controller('modalModuleCtrl', function($scope,$http,$uibModalInstance,fac,item) {
        $scope.item = item;
        $http.get("/ovu-base/sys/appRes/list",{params:{moduleId:item.id}}).success(function(list){
            item.appRes = list;
        })

        $scope.save = function (form) {
            form.$setSubmitted(true);
            if (!form.$valid) {
                return;
            }
            var appResIdList = [];
            $scope.item.appRes && $scope.item.appRes.forEach(function(n){
                n.checked && (appResIdList.push(n.id))
            })
            $scope.item.appResIds = appResIdList.join();

            $http.post("/ovu-base/sys/module/save", item).success(function (data, status, headers, config) {
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
