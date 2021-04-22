(function() {
    "use strict";
    var app = angular.module("angularApp");
    app.controller('variableCtl', function ($scope,$rootScope, $http,$filter,$uibModal,fac) {
        document.title ="OVU-变量设置";
        $scope.search={};
        $scope.pageModel={};
        $scope.config={edit:true};
        app.modulePromiss.then(function(){
            $scope.search = {isGroup:fac.isGroupVersion()};
            loadDeptTree();
        });

        //查询
        $scope.find = function(pageNo) {
            if(!fac.hasActivePark($scope.search)){
                return;
            }
            $.extend($scope.search, {
                currentPage: pageNo || $scope.pageModel.currentPage || 1,
                pageSize: $scope.pageModel.pageSize || 10
            });
            fac.getPageResult("/ovu-pcos/extend/payVariable/list.do", $scope.search, function(data) {
                $scope.pageModel = data;
            });
        };

        //新增分类
        $scope.addSon= $scope.addTopNode = function(node){
            var type=node ? {pid:node.id}: {};
            var modal = $uibModal.open({
                animation: false,
                size:'',
                templateUrl: 'expand/paySetting/modal.payType.html',
                controller: 'payTypeModalCtrl'
                ,resolve: {type:function(){return  angular.extend({},type);}}
            });
            modal.result.then(function (data) {
                if(node){
                    node.state = node.state || {};
                    node.state.expanded = true;
                    node.nodes = node.nodes || [];
                    node.nodes.push(data);
                }else{
                    $scope.treeData_variable.push(data);
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
                size:'',
                templateUrl: 'expand/paySetting/modal.payType.html',
                controller: 'payTypeModalCtrl'
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
                $scope.curNode = node;
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
                $http.post("/ovu-pcos/extend/payType/remove.do",{id:node.id},fac.postConfig).success(function(data){
                    if(data.success){
                        if ($scope.curNode == node) {
                            delete $scope.curNode;
                        }
                        var list = fac.treeToFlat($scope.treeData_variable);
                        var parent = list.find(function(n){return n.id == node.pid });
                        if (parent) {
                            parent.nodes.splice(parent.nodes.indexOf(node), 1)
                        } else {
                            $scope.treeData_variable.splice($scope.treeData_variable.indexOf(node), 1)
                        }
                    }else{
                        alert(data.error);
                    }
                });
            })
        };

        //新增变量
        $scope.editPost = function(item){
            if($scope.curNode){
                item=item || {type_id:$scope.curNode.id};
                var modal = $uibModal.open({
                    animation: false,
                    size:'lg',
                    templateUrl: 'expand/paySetting/modal.payVariable.html',
                    controller: 'payVariableModalCtrl'
                    ,resolve: {post:function(){return  angular.extend({},item);}}
                });
                modal.result.then(function (data) {
                    $scope.find();
                }, function () {
                    console.info('Modal dismissed at: ' + new Date());
                });
            }else{
                alert('请选择一个类型！');
            }
        };
        //批量删除变量
        $scope.delAll = function() {
            var ids = $scope.pageModel.list.reduce(function(ret, n) {
                n.checked && ret.push(n.id);
                return ret
            }, []);
            doDel(ids.join());
        };
        //删除变量
        $scope.del = function(item){
            doDel(item.id);
        };
        function doDel(id){
            confirm("确认删除选中的变量吗?",function(){
                $http.post("/ovu-pcos/extend/payVariable/remove.do",{id:id},fac.postConfig).success(function(data){
                    if(data.success){
                        $scope.find();
                    }else{
                        alert(data.error);
                    }
                });
            })
        }

        function loadDeptTree(){
            $http.post("/ovu-pcos/extend/payType/tree.do",{},fac.postConfig).success(function(data){
                $scope.treeData_variable = data;
            });
        };

    });

    app.controller('payTypeModalCtrl', function($scope,$rootScope,$http,$uibModalInstance,$uibModal,$filter,fac,type) {
        $scope.item = type || {};

        //保存
        $scope.save = function(form, item) {
            form.$setSubmitted(true);
            if (!form.$valid) {
                return;
            }

            $http.post("/ovu-pcos/extend/payType/save.do", item,fac.postConfig).success(function(resp) {
                if (resp.success) {
                    $uibModalInstance.close(resp.data);
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
    app.controller('payVariableModalCtrl', function($scope,$rootScope,$http,$uibModalInstance,$uibModal,$filter,fac,post) {
        $scope.item = post || {};
        $scope.item.val_type=$scope.item.val_type?$scope.item.val_type:1;
        $scope.item.value=$scope.item.value?Number($scope.item.value):null;
        $scope.item.formula_text= $scope.item.formula_text?$scope.item.formula_text:'';
        $scope.item.formula= $scope.item.formula?$scope.item.formula:'';
        $scope.variables = [];

        app.modulePromiss.then(function(){
            $scope.config={edit:false};
            loadTree();
        });

        //选中分类
        $scope.selectNode= function (node) {
            if($scope.curNode != node){
                $scope.curNode && $scope.curNode.state &&($scope.curNode.state.selected = false);
            }
            node.state = node.state||{};
            node.state.selected = !node.state.selected;
            if(node.state.selected){
                $scope.curNode = node;
            }else{
                delete $scope.curNode;
            }
            loadVariables();
        };

        //清空公式
        $scope.clear=function(){
            $scope.item.formula_text= '';
            $scope.item.formula= '';
            $scope.variables.forEach(function(v){
                v.checked=false;
            });
        };

        //选中变量参数
        $scope.checkVariable=function(v){
            if($scope.item.formula && !checkFormulaOper()){
                alert('请选择运算符！');
                return false;
            }
            v.checked=!v.checked;

            $scope.item.formula_text+=($scope.item.formula_text?" "+v.name: v.name);
            $scope.item.formula+=($scope.item.formula?" "+v.id: v.id);
        };

        //点击运算符
        $scope.clickOper=function(o){
            if(!$scope.item.formula){
                alert('请先选择变量！');
                return false;
            }
            if(!checkFormulaOper()){
                $scope.item.formula_text+= " "+formateO(o);
                $scope.item.formula+= " "+formateO(o);
            }
        };

        //切换计算公式按钮
        $scope.changeValType=function(){
            if($scope.item.val_type==1){
                $scope.item.val_type=2;
                $scope.item.value=null;

            }else{
                $scope.item.val_type=1;
                $scope.item.formula=null;
            }
        };

        //保存
        $scope.save = function(form, item) {
            form.$setSubmitted(true);
            if (!form.$valid) {
                return;
            }

            if(item.formula && checkFormulaOper()){
                item.formula_text= item.formula_text.substr(0,item.formula_text.length-1);
                item.formula= item.formula.substr(0,item.formula.length-1);
            }

            $http.post("/ovu-pcos/extend/payVariable/save.do", item,fac.postConfig).success(function(data) {
                if (data.success) {
                    $uibModalInstance.close();
                    msg("保存成功!");
                } else {
                    alert(data.error);
                }
            })
        };

        function loadTree(){
            $http.post("/ovu-pcos/extend/payType/tree.do",{},fac.postConfig).success(function(data){
                $scope.treeData_variable = data;
            });
        };
        function loadVariables(){
            if($scope.curNode){
                var id=$scope.curNode.id;
                $http.post("/ovu-pcos/extend/formula/list.do",{id: id},fac.postConfig).success(function(data){
                    $scope.variables = data;

                    //参数是否已配置
                    if($scope.item.formula && $scope.variables){
                        $scope.variables.forEach(function(v){
                            if($scope.item.formula.indexOf(v.id)>-1){
                                v.checked=true;
                            }
                        });
                    }

                });
            }
        };

        function formateO(o){
            var ot='';
            if(o==1){
                ot='+';
            }else if(o==2){
                ot='-';
            }if(o==3){
                ot='×';
            }if(o==4){
                ot='÷';
            }
            return ot;
        }

        function checkFormulaOper(){
            var lc=$scope.item.formula.charAt($scope.item.formula.length-1);
            return (lc=='+' || lc=='-' || lc=='×' || lc=='÷');
        }

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    });

})()
