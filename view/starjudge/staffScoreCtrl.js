/**
 * Created by Zn on 2018/4/2.
 */
(function () {
    "use strict";
    var app = angular.module("angularApp");

    app.controller('staffScoreCtrl', function ($scope, $rootScope, $uibModal, $state, $http, $filter, fac) {
        document.title='人员评分';
        $scope.pageModel = {};
        $scope.search={};
        fac.setPostDict($rootScope);
        app.modulePromiss.then(function(){
            
            $scope.deptTree_staffScore=fac.getGlobalTree();
            if($scope.deptTree_staffScore.length){
                $scope.search.deptId = $scope.deptTree_staffScore[0].id;
            }
            
        })
        $scope.setDept = function(search,node){
           
            if (node.state.selected) {
                $scope.find(1);
            }
        }

  
        $scope.find = function(pageNo){
            // $scope.deptId=$scope.search.deptId;
            // $scope.deptName=$scope.search.deptName;
            $scope.search = $scope.search||{};
            var curDept = fac.getSelectedNode($scope.deptTree_staffScore);
            if(curDept){
                $scope.search.deptId = curDept.id;
                $scope.search.deptName=curDept.deptName;
            }else{
                alert("请选择部门！");
                return;
            }
            $.extend($scope.search,{currentPage:pageNo||$scope.pageModel.currentPage||1,pageSize:$scope.pageModel.pageSize||10});
            $scope.search.name = $scope.search.user?$scope.search.user.name:undefined;
            fac.getPageResult("/ovu-base/pcos/person/listByGrid.do",$scope.search,function(data){
                data.list.forEach(function(n){
                    n.postList = [];
                    n.mrList = [];
                    if(n.postIds){
                        var deptpost = n.postIds.split(",");
                        n.postList = deptpost.map(function(m){return m.indexOf("^")>0?(m.split("^")):(null)})
                        n.postList = n.postList.filter(function(m){return $rootScope.flatDetpTree.find(function(z){return z.id ==m[0] })});

                        delete n.postIds;
                    }
                    if(n.role_ids){
                        n.mrList = n.role_ids.split(',');
                    }
                })
                $scope.pageModel = data;
            });
        };
        //点击批量填分
        $scope.dealMultiple=function () {
            var selectObjArr=[];
            var checkedItems = $scope.pageModel.data.filter(function (item) {
                return item.checked;
            });
            //未勾选任何条目
            if(checkedItems.length==0){
                alert('请勾选需评分的条目');
                return;
            }else {
                //评分为不为空
                if($scope.selectScore){
                    // var reg=/^[1-9]\d*$|^0$/;   // 注意：故意限制了 0321 这种格式，如不需要，直接reg=/^\d+$/;
                    var reg=/^[1-9]\d*$/;
                    if(reg.test($scope.selectScore)==true){
                        checkedItems.forEach(function (n) {
                            var selectObj={};
                            selectObj.personId=n.id;
                            selectObj.scoreNow=$scope.selectScore;
                            // selectObj.deptId=$scope.deptId;
                            // selectObj.deptId=$scope.deptName;
                            selectObjArr.push(selectObj);
                        })
                    }else{
                        alert("您输入的非有效数字");
                        return;
                    }
                }
                else {
                    alert('请输入分数');
                    return;
                }

            }
            var obj={
                records:selectObjArr
            }
            $http.post('/ovu-pcos/pcos/star/record/set',obj).success(function (data) {
                if(data.success){
                    $scope.selectScore='';
                }

            })
        }
        //列表各item的失去焦点事件
        $scope.makeScore=function (item) {
            // var reg=/^[1-9]\d*$|^0$/;   // 注意：故意限制了 0321 这种格式，如不需要，直接reg=/^\d+$/;
            var reg=/^[1-9]\d*$/;
            if(reg.test(item.score)==true){
                var obj={
                    records:[{personId:item.id,scoreNow:item.score}]
                };
                if(item.score){
                    $http.post('/ovu-pcos/pcos/star/record/set',obj).success(function (data) {
                        if(data.success){
                            item.score='';
                        }

                    })
                }
            }else{
                alert("您输入的非有效数字");
                return;
            }
        }
        //点击历史得分
        $scope.historyScore = function (item) {
            var param=item;
            // $.extend(param,{oriList: $scope.oriList})
            var id;
            if(item.postList.length!=0){
                id=item.postList[0][1];
            }
            param.workId=id;
            var modal = $uibModal.open({
                animation: false,
                size: 'lg',
                templateUrl: '/view/starjudge/modal.historyScore.html',
                controller: 'storyScoreCtrl',
                resolve: {
                    param: param
                }
            });
            modal.result.then(function() {
                $scope.find();
            });
        }
    });
    app.controller('storyScoreCtrl', function ($scope,$rootScope, $http, $uibModal, $uibModalInstance, $filter, fac, param) {
        // $http.post("/ovu-base/system/dept/tree.do",{parkId:parkId},fac.postConfig).success(function(data){
           
        //     var treeView = $("#dept_tree").data('treeview');
        //     //$scope.treeData = data;
        //     $scope.oriList = treeView.getUnchecked();
          
            
        // });
        $scope.pageModel = {};
        $scope.item=param;
        // $scope.oriList = param.oriList;
        
        $http.post('/ovu-pcos/pcos/star/record/list',{personId:param.id},fac.postConfig).success(function (data) {
            $scope.pageModel = data
        })
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    })
})();
