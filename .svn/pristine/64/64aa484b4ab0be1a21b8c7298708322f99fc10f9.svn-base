(function() {
    "use strict";
    var app = angular.module("angularApp");
    app.controller('formulaCtl', function ($scope,$rootScope, $http,$filter,$uibModal,fac) {
        document.title ="OVU-计算公式设置";
        $scope.item={};
        $scope.config={edit:false};

        app.modulePromiss.then(function(){
          loadDeptTree();
        });


        //选中分类
        $scope.selectNode= function (search,node) {
            if(node.state.selected){
                $scope.curNode = node;
            }else{
                delete $scope.curNode;
            }
            load();
        };

        function load(){
            if($scope.curNode){
                $scope.item=$scope.curNode;
                if($scope.item.formula){
                    $http.post("/ovu-pcos/extend/formula/detail.do",{id:$scope.curNode.id},fac.postConfig).success(function(data){
                        $scope.item=angular.extend($scope.item,data);
                    });
                }
            }
        }


        //设置公式
        $scope.set = function(item){
            var modal = $uibModal.open({
                animation: false,
                size:'lg',
                templateUrl: 'expand/paySetting/modal.formula.html',
                controller: 'payformulaModalCtrl'
                ,resolve: {model:function(){return  angular.extend({},item);}}
            });
            modal.result.then(function (data) {
                $scope.item=data;
            }, function () {
                console.info('Modal dismissed at: ' + new Date());
            });
        };

        function loadDeptTree(){
            $http.post("/ovu-pcos/extend/payType/tree.do",{},fac.postConfig).success(function(data){
                $scope.treeData_formula = data;
            });
        };

    });

    app.controller('payformulaModalCtrl', function($scope,$rootScope,$http,$uibModalInstance,$uibModal,$filter,fac,model) {
        $scope.item = model || {};
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

        //保存
        $scope.save = function(form, item) {
            form.$setSubmitted(true);
            if (!form.$valid) {
                return;
            }

            if(checkFormulaOper()){
                item.formula_text= item.formula_text.substr(0,item.formula_text.length-1);
                item.formula= item.formula.substr(0,item.formula.length-1);
            }

            $http.post("/ovu-pcos/extend/formula/save.do", item,fac.postConfig).success(function(data) {
                if (data.success) {
                    $uibModalInstance.close(item);
                    msg("保存成功!");
                } else {
                    alert(data.error);
                }
            })
        };

        function loadTree(){
            $http.post("/ovu-pcos/extend/payType/tree.do",{},fac.postConfig).success(function(data){
                $scope.treeData_formula = data;
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
