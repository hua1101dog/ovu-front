/**
 * Created by Administrator on 2017/7/20.
 */
(function() {
    "use strict";
    var app = angular.module("angularApp");
    app.controller('roleCtrl', function ($scope,$rootScope, $http,$uibModal,$uibPosition,$q,fac) {
        //资源树不可修改,仅作展示
        $scope.menuConfig={edit:false,showCheckbox:true,checkOperate:false};
        function findModule(){
            $http.get("/ovu-base/sys/role/list").success(function(list){
                $scope.moduleList  = list;
                if(list.length && list[0].roles&& list[0].roles.length){
                    var module = list[0];
                    var role = list[0].roles[0];
                    $scope.showRoleMenu(role);
                };
            })
        }

        var flatData;
        function getMenuTree(moduleId,roleId){
            $http.get("/ovu-base/sys/menu/treeForRole",{params:{moduleId:moduleId,roleId:roleId}}).success(function(resp){
                $scope.menuTree  = resp.data;
                flatData = fac.treeToFlat(resp.data);
                flatData.forEach(function(n){
                    if(n.roleId){
                        n.state = n.state||{};
                        n.state.checked = true;
                    }
                    if(n.operations){
                        var opList = n.operations.split(",");
                        n.powers = n.powers||"";
                        var powerList = n.powers.split(",");
                        n.operationList = opList.map(function(n){return {name:n,on:powerList.indexOf(n)>-1 }})
                    }
                })
            })
        }

        function getAppRes(role){
            role.appResources = role.appResources ||"";
            var ids = role.appResources.split(",");
            $http.get("/ovu-base/sys/appRes/listForRole",{params:{moduleId:role.moduleId,roleId:role.id}}).success(function(list){
                role.appRes = list;
            })
        }

        $scope.showRoleMenu = function(role){
            if($scope.curRole && role != $scope.curRole &&  $scope.curRole.edit){
                alert("请先完成当前编辑中的角色！");
            }else{
                $scope.curRole = role;
                $scope.menuConfig.checkOperate = role.edit;
                getMenuTree(role.moduleId,role.id);
                getAppRes(role);
            }
        }
        findModule()

        $scope.addRole = function(module){
            if($scope.curRole && $scope.curRole.edit){
                alert("请先完成当前编辑中的角色！");
            }else{
                var role = {moduleId:module.id,edit:true,copy:{moduleId:module.id}};
                module.roles = module.roles||[];
                module.roles.push(role);
                $scope.showRoleMenu(role);
            }
        }
        $scope.editRole = function(role){
            if($scope.curRole && $scope.curRole.edit){
                alert("请先完成当前编辑中的角色！");
            }else{
                delete role.copy;
                role.copy = angular.extend({},role);
                role.edit = true;
                $scope.showRoleMenu(role);
            }
        }

        $scope.cancel = function(module,role){
            if(role.id){
                role.edit = false;
            }else{
                module.roles.splice(module.roles.indexOf(role),1);
               delete $scope.curRole;
            }
        }

        function getPowers(menu){
            if(menu.operationList){
                return menu.operationList.reduce(function(ret,n){n.on && (ret+=","+ n.name);return ret},"");
            }
            return "";
        }

        $scope.save = function(role,form){
            form.$setSubmitted(true);
            if(!form.$valid){
                return;
            }
            role.copy.menus = flatData.reduce(function(ret,n){n.state && n.state.checked && ret.push({menuId:n.id,powers:getPowers(n)});return ret},[]);
            var appRes = role.appRes.reduce(function(ret,n){n.checked&&ret.push(n.id);return ret},[])
            role.copy.appResources = appRes.join();
            $http.post("/ovu-base/sys/role/save",role.copy).success(function(resp){
                if(resp.code === 0){
                    msg("保存成功！");
                    angular.extend(role,resp.data);
                    role.edit= false;
                    $scope.showRoleMenu(role);
                }else{
                    alert(resp.msg);
                }
            });
        }

        $scope.del = function(module,role){
            confirm("确定删除 "+role.name,function(){
                $http.get("/ovu-base/sys/role/del/"+role.id).success(function(resp){
                    if(resp.code === 0){
                        if($scope.curRole== role){
                            delete $scope.curRole;
                        }
                        module.roles.splice(module.roles.indexOf(role),1)
                    }
                });
            })
        }

        $scope.selectMenuEdit = function(){

        }

        $scope.check = function(node){
            if(!$scope.curRole || !$scope.curRole.edit){
                return;
            }
            node.state = node.state||{};
            node.state.checked = !node.state.checked;
            function checkSons(node,status){
                node.state = node.state||{};
                node.state.checked = status;
                //如果不勾选菜单，那么按钮级操作也取消勾选
                if(!status){
                    node.operationList && node.operationList.forEach(function(n){n.on = false});
                }
                if(node.nodes && node.nodes.length){
                    node.nodes.forEach(function(n){checkSons(n,status);})
                }
            }
            function uncheckFather(node){
                var father = flatData.find(function(n){return n.id == node.pid});
                if(father){
                    father.state = father.state||{};
                    father.state.checked = false;
                    uncheckFather(father);
                }
            }
            /*function checkFather(node){
                var pid = node.pid;
                while(!!pid){
                    var father = flatData.find(function(n){return n.id == pid});
                    if(father){
                        father.state = father.state||{};
                        father.state.checked = true;
                        pid = father.pid;
                    }else{
                        pid = null;
                    }
                }
            }*/
            if(node.state.checked){
                checkSons(node,true);
            }else{
                checkSons(node,false);
                uncheckFather(node);
            }
        }

        $scope.checkAppOperation = function(menuConfig,appItem){
            if(menuConfig.checkOperate){
                appItem.checked = !appItem.checked;
            }
        }

    });

})();