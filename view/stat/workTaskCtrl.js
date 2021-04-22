/**
 * 工作任务频次表.
 */
(function () {
    "use strict";
    var app = angular.module("angularApp");
    app.controller('workTaskCtrl', function ($scope, $rootScope, $uibModal, $location, $http, $filter, fac) {
        $scope.search = {};
        document.title = "工作任务频次表";
        $scope.search = {};
        $scope.pageModel = {};
        app.modulePromiss.then(function () {
            $scope.search = {startTime:getDefaultMonth(),endTime:getDefaultDate()};
            $scope.find(1);

        })
        $scope.parks=[];
        $scope.parksList=[];
        
        $scope.choosePark=function(){
            if(!$scope.parks==[]){
                $scope.parks=[];    
             }
            var modal = $uibModal.open({
                animation: false,
                size:'lg',
                templateUrl: '/common/modal.select.parks.html',
                controller: 'parksSelectorCtrl'
                ,resolve: {data: function(){return {};}}
            });
            modal.result.then(function (data) {
                if($scope.parks && $scope.parks.length>0){
                    data.forEach(function(part){
                        $scope.parks.forEach(function(item){
                            if(part.id==item.id){
                                part.isExist=true;
                            }
                        });
                    });
                }

                data.forEach(function(part){
                    if(!part.isExist){
                        $scope.parks.push({ id: part.id, parkName: part.parkName });
                    }
                });
                if($scope.parks.length>3){
                    $scope.parkList=$scope.parks.slice(0,3)
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
         //上个月
         function getDefaultDate(){
            var date=new Date();
            var year=date.getFullYear();
            var month=date.getMonth()+1;
            if(month==1){
                year=year-1;
                month=12;
            }else{
                month=month-1;
            }
            var d=year+"-"+(month<10?"0"+month:month);

            return d;
        }
        //今年第一个月
        function getDefaultMonth(){
            var date=new Date();
            var year=date.getFullYear();
           
            var d=year+"-01";

            return d;
        }
        
     
        //分页
        $scope.find = function (pageNo) {
         
        // if($scope.curNode ){
           
        //     if($scope.curNode.WORKITEM_ID){
        //         // $scope.search.workTypeId = $scope.curNode.pid;
        //         delete $scope.search.workTypeId;
        //         $scope.search.workItemId =$scope.curNode.WORKITEM_ID;
        //     }else{
        //         $scope.search.workTypeId = $scope.curNode.id;
        //          $scope.search.workTypePid=$scope.curNode.pid;
        //         delete $scope.search.workItemId;
        //     }
        // }else{
        //     delete $scope.search.workTypeId;
        //     delete $scope.search.workItemId;
        //     delete  $scope.search.workTypePid;
        // } 
         if($scope.parks.length!==0){
            var ids=$scope.parks.reduce(function(ret,n){ret.push(n.id);return ret},[]);
            $scope.search.parkId=ids.join(",");
         }
             $.extend($scope.search, { currentPage: pageNo || $scope.pageModel.currentPage || 1, 
                pageSize: $scope.pageModel.pageSize || 10,
                withWorkitem: false,
                countWorkTask:true
            });
           
            fac.getPageResult('/ovu-pcos/pcos/reportstat/other/statworktask.do', $scope.search, function (data) {
                $scope.pageModel = data
            });
           
           
        }
        
        $scope.selectNode= function (node) {
           
            node.state = node.state||{};
            node.state.selected =true;
            if(node.state.selected){
           
              $scope.search.workTypePid=node.pid
              
                $scope.find();
            }
            
        }

    });

})();