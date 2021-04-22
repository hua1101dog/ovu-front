/**
 * 反馈信息
 */
(function () {
    "use strict";
    var app = angular.module("angularApp");
    app.controller('feedbackListCtrl', function ($scope, $rootScope, $uibModal, $location, $http, $filter, fac) {
        $scope.search = {};
        document.title = "反馈信息列表";
        $scope.search = {};
        $scope.pageModel = {};
       
        app.modulePromiss.then(function () {
            // fac.initPage($scope, function () {
            //     $scope.find(1);
            // },function () {
            //     $scope.find(1);
            // });
            $scope.$watch('dept.id', function (deptId, oldValue) {
                if (deptId) {
                    // $scope.search.deptId = deptId;
                    var parkIds=[]
                    console.log(deptId)
                    console.log($scope.filteredDeptTree)
                    $rootScope.execTreeNode($scope.filteredDeptTree, function(
                        node
                    ) {
                        
                        if (node.id==deptId) {
                            //过滤出当前选中的部门
                        var nodeArr = new Array();
                        nodeArr[0] = node;
                        $rootScope.execTreeNode(nodeArr, function(
                            park
                        ) {
                            
                            if (park.parkId) {
                                //过滤出当前选择部门的所有项目部门
                                parkIds.push(park.parkId)
                            }
                        });
                        }
                    });
                    // 反馈信息列表需支持级联展示
                    $scope.search.parkId = parkIds.join(',');
                        $scope.find();

                }
            })
        })
           
      
        //分页
        $scope.find = function (pageNo) {
            if(!$rootScope.dept ||!$rootScope.dept.id){
                alert("请选择部门！");
                return false;
            }
        //    var ids=$scope.parks.reduce(function(ret,n){ret.push(n.id);return ret},[]);
        //      $scope.search.parkId=ids.join(",");
             $.extend($scope.search, { currentPage: pageNo || $scope.pageModel.currentPage || 1, 
                pageSize: $scope.pageModel.pageSize || 10,
            });
            fac.getPageResult('/ovu-pcos/pcos/feedback/list.do', $scope.search, function (data) {
                $scope.pageModel = data;
                $scope.pageModel.data && $scope.pageModel.data.forEach(function (v) {
                     if (!v.images) {
                           v.images = [];
                       } else {
                           v.images = v.images.split(",") || [];
                       }
                   });
               
            });
            
        }
        $scope.parks = [];
        $scope.parksList=[];
       $scope.choosePark = function () {
             $scope.parks=[];
             $scope.parkList=[];
             var modal = $uibModal.open({
                 animation: false,
                 size: 'lg',
                 templateUrl: '/common/modal.select.parks.html',
                 controller: 'parksSelectorCtrl'
                 , resolve: { data: function () { return {}; } }
             });
             modal.result.then(function (data) {
                 if ($scope.parks && $scope.parks.length > 0) {
                     data.forEach(function (part) {
                         $scope.parks.forEach(function (item) {
                             if (part.id == item.id) {
                                 part.isExist = true;
                             }
                         });
                     });
                    
                 }
 
                 data.forEach(function (part) {
                     if (!part.isExist) {
                         $scope.parks.push({ id: part.id, parkName: part.parkName });
                     }
                   
                 });
              if($scope.parks.length>3){
                 $scope.parkList= $scope.parks.slice(0,3);
              }else{
                $scope.parkList=$scope.parks;
             }
                 
             });
             
         }; 
      
         $scope.show=""
         $scope.getmore=function(){
             $scope.parkList=$scope.parks;
             $scope.show=true;
         }
         $scope.getless=function(){
             $scope.parkList=$scope.parks.slice(0,3);
              $scope.show=false;
         }
         
         $scope.delpark = function (parks, p) {
           
             if($scope.parkList.length<=3){
                parks.splice(parks.indexOf(p), 1); 
                $scope.parkList= parks.slice(0,3);
                $scope.show=""
             }else{
                 parks.splice(parks.indexOf(p), 1);
             }
             
           
         };
       

    });

})();