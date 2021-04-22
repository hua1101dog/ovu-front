/**
 * Created by Administrator on 2017/7/20.
 */
(function() {
    "use strict";
    var app = angular.module("angularApp");
    app.controller('workunitRuleCtl', function ($scope,$rootScope, $http,$filter,$uibModal,fac) {
        document.title ="OVU-督办规则";
        fac.setDeptDict($rootScope);
        fac.setPostDict($rootScope);
        $scope.pageModel = {};

        $scope.find = function(pageNo){
            if(!fac.hasActivePark($scope.search)){
                return;
            }
            $.extend($scope.search,{currentPage:pageNo||$scope.pageModel.currentPage||1,pageSize:$scope.pageModel.pageSize||10});
            fac.getPageResult("/ovu-pcos/pcos/workunit/rule/queryByPage.do",$scope.search,function(data){
                $scope.pageModel = data;
            });
        };

        app.modulePromiss.then(function() {
            fac.initPage($scope,function(){
                $scope.find(1);
            },function(){
                $scope.find(1);
            })
        })

        $scope.del = function(item){
            confirm("确认删除该规则吗?",function(){
                $http.post("/ovu-pcos/pcos/workunit/rule/del.do",{"id":item.ID},fac.postConfig).success(function(resp) {
                    if (resp.success) {
                        $scope.find();
                    } else {
                        alert(resp.error);
                    }
                })
            })
        }

        $scope.showEditModal = function(rule){
            rule=rule || {};
            rule.isGroup = $scope.search.isGroup;
            var modal = $uibModal.open({
                animation: false,
                size:'lg',
                templateUrl: '/common/modal.editRule.html',
                controller: 'editRuleCtrl'
                ,resolve: {rule: angular.extend({},rule)}
            });
            modal.result.then(function () {
                $scope.find();
            }, function () {
                console.info('Modal dismissed at: ' + new Date());
            });
        }

    });

    app.controller('editRuleCtrl', function($scope,$rootScope,$http,$uibModalInstance,$filter,fac,rule) {

        console.log(rule)
        $scope.item = rule;
        fac.setParkTree($scope);
        function getPostList(item){
            item.postList = [];
            item.DEPT_ID && $http.get("/ovu-base/pcos/person/getPost.do?id="+item.DEPT_ID).success(function(res){
                item.postList = res;
            })
        }

        if(rule.DEPT_ID){
            var dept = $scope.oriList.find(function(n){return n.id == rule.DEPT_ID})
            if(dept){
                rule.DEPT_NAME = dept.text;
                getPostList(rule)
            }
        }
   /*     if(rule.WORKTYPE_IDS){
            $scope.worktypeTree.forEach(function(n){if(rule.WORKTYPE_IDS.indexOf(n.id)>-1){n.chosen = true}});
        }*/

        //集团版, 用于选择项目
        $scope.selectPark = function(node) {
            if (node.data.parkType == 1) {
                if(node.id!=rule.PARK_ID){
                  rule.DEPT_ID = null;
                  rule.DEPT_NAME = null;
                  rule.POST_ID=null;
                }

                rule.PARK_NAME = node.fullPath || node.text;
                rule.PARK_ID = node.id;
                rule.parkHover =rule.parkFocus = false;
            } else {
                alert("请先择项目！");
            }
        }
       /* $scope.setPark = function(){
            modalPark.open({
                callback:function(node){
                    rule.PARK_NAME = node.fullPath;
                    rule.PARK_ID = node.did;
                    $scope.$apply();
                    modalPark.close();
                }
                ,realStateOnly:true
                ,selectedId:rule.PARK_ID
            });
        }*/

        $scope.openDeptModal = function(item){
          if(!item.PARK_ID){
            alert("请先选择项目！");
            return;
          }
            modalDept.open({
                callback:function(node){
                    if(node.id && node.text){
                        item.DEPT_ID = node.id;
                        item.DEPT_NAME = node.text;
                        getPostList(item);
                        $scope.$apply();
                    }
                    modalDept.close();
                },
                parkId:item.PARK_ID
                ,selectedId:item.DEPT_ID
            });
        };

        $scope.save = function(form,rule){
            form.$setSubmitted(true);
            if(!form.$valid){
                return;
            }

            var worktypeList = $scope.worktypeTree.filter(function(n){return n.chosen});
            if(!worktypeList||worktypeList.length == 0){
                alert("请选择工作分类！");
                return;
            }
            var list = worktypeList.reduce(function(sum,n){sum.push(n.id);return sum;},[]);
            rule.WORKTYPE_IDS = list.join();

            $http.post("/ovu-pcos/pcos/workunit/rule/saveOrUpdate.do",rule,fac.postConfig).success(function(resp, status, headers, config) {
                if(resp.success){
                    $uibModalInstance.close();
                } else {
                    alert();
                }
            })
        }

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    });


})();
