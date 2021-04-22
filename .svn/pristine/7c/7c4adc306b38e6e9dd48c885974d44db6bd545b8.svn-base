// 历史记录查询
// 配电柜回路管理
/**
 * Created by Cx on 2018/10/23.
 */
(function (angular) {
    "use strict";
    var app = angular.module("angularApp");
    app.controller('historicalRecordCtrl', function ($scope, $rootScope, $uibModal, $state, $http, $filter, $location,fac) {
        document.title = '历史记录查询';
        $scope.msg = {};
        $scope.search = {};
        $scope.item = {}
        $scope.config = {
            edit: false
        };
        $scope.isNode = false // 是否展示配电柜

        // 页面初始化
        app.modulePromiss.then(function () {
            // fac.initPage($scope, function () {
            //     $scope.init()
            // }, function () {
            //     $scope.init()
            // });
            $scope.search = {
                parkId: sessionStorage.getItem('parkId'),
             
            }
            $scope.pageModel = {};
          
            $scope.init()

        })
        $scope.init = function () {
            $scope.findTree()

        }
        $scope.findTree = function () {
            //树数据
            $http.get("/ovu-energy/energy/transformer/tree.do?parkId=" + $scope.search.parkId).success(function (data) {
                $scope.trmTreeData = data.data || [];
                !$scope.trmTreeData[0] && ($scope.pageModel = {});
                $scope.trmTreeData[0] && ($scope.trmTreeData[0].state={selected:true})
                $scope.trmTreeData[0] && $scope.selectNode('',$scope.trmTreeData[0]);
            });
        }
      
        // //点击一级菜单
        $scope.clickMainMenu = function () {
            $scope.isNode = false ;
            
          
        };
        // //点击二级菜单
        $scope.clickSubMenu = function () {
           
            $scope.isNode = true ;
          
        };

        $scope.selectNode = function (search,node) {
            
            if (!$scope.search.parkId) {
                alert('请选择项目')
            }
            if (node.state.selected) {
                if (node.parentId == '0') {
                   
                    $scope.clickMainMenu(node.id);
                    $scope.isNode = false;
                    $http.post('/ovu-energy/energy/transformer/get', {
                        trId: node.id
                    }, fac.postConfig).success(function (data) {
                        $scope.item = data.data || [];
                        $scope.item.modifyTime && delete  $scope.item.modifyTime
                        $scope.item.createTime && delete  $scope.item.createTime
                        $scope.item.creatorId   && delete  $scope.item.creatorId
                        $scope.item.domainId && delete  $scope.item.domainId
                        if(data.data.refTrId){
                            $scope.transformList && $scope.transformList.forEach(function(v){
                                if($scope.item.refTrId==v.trId){
                                    $scope.selected.value = v
                                }
                            })
                        
                          
                        }
                     })
                } else {
                    $scope.isNode = true;
                    $scope.clickSubMenu();
                    $http.post('/ovu-energy/energy/distributor/get', {
                        dtId: node.id
                    }, fac.postConfig).success(function (data) {
                        $scope.item = data.data
                        $scope.item.modifyTime && delete  $scope.item.modifyTime
                        $scope.item.createTime && delete  $scope.item.createTime
                        $scope.item.creatorId   && delete  $scope.item.creatorId
                        $scope.item.domainId && delete  $scope.item.domainId
                       

                    })
                }
            } 



        };
      

      

        
        //返回
        $scope.return=function(){
            $state.go('admin', {
                folder: 'energy',
                page: 'pdgroom'
            });
        }
      
      
      
       




    });
  
})(angular)