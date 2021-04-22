/**
 * Created by Zn on 2018/4/19.
 */
/**
 * Created by Zn on 2018/4/19.
 */
(function () {
    "use strict";
    var app = angular.module("angularApp");

    app.controller('informDealCtrl', function ($scope, $rootScope, $uibModal, $state, $http, $filter, fac) {
        document.title='信息处理';
        $scope.pageModel = {};
        $scope.search = {};
        // var parkId='';
        app.modulePromiss.then(function () {
            $scope.$watch('dept.id', function (deptId, oldValue) {
                if (deptId) {
                $scope.search.deptId=deptId
                    $scope.find(1);
                }
            })
        });
      
       /*
        $scope.parks=[];
        $scope.parksList=[];
        $scope.choosePark=function(){
            var modal = $uibModal.open({
                animation: false,
                size:'lg',
                templateUrl: '/common/modal.select.parks.html',
                controller: 'parksSelectorCtrl'
                ,resolve: {data: function(){
                    return {};}}
            });
            modal.result.then(function (data) {
                $scope.parkIdArr=[];
                $scope.parks = [];
                data.forEach(function(part){
                        $scope.parks.push({id:part.id,parkName:part.parkName});
                });

                if($scope.parks.length>3){
                    $scope.parks.forEach(function (v) {
                        $scope.parkIdArr.push(v.id);
                    });
                    $scope.search.parkId=$scope.parkIdArr.join(',');
                    $scope.parkList=$scope.parks.slice(0,3)
                }else{
                    $scope.parks.forEach(function (v) {
                        $scope.parkIdArr.push(v.id);
                    });
                    $scope.search.parkId=$scope.parkIdArr.join(',');
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
            $scope.parkList.forEach(function (v) {
                parkId+=v.id+',';
            })
            $scope.search.parkId=parkId;
            parkId='';
        };
        */
       
        $scope.showExam=function (item) {
            var param=item;
            var modal = $uibModal.open({
                animation: false,
                size: 'md',
                templateUrl: '/view/managermailbox/modal.examine.html',
                controller: 'informExamineCtrl',
                resolve: {
                    param: param
                }
            });
            modal.result.then(function() {
                $scope.find();
            });
        };
        $scope.dealOpinion=function (item) {
            var param=item;
            var modal = $uibModal.open({
                animation: false,
                size: 'md',
                templateUrl: '/view/managermailbox/modal.opinion.html',
                controller: 'informOpinionCtrl',
                resolve: {
                    param: param
                }
            });
            modal.result.then(function() {
                $scope.find();
            });
        }
        $scope.find = function (pageNo) {
            if(!$rootScope.dept ||!$rootScope.dept.id){
                alert("请选择部门！");
                return false;
            }
            $.extend($scope.search, {currentPage: pageNo || 1, pageSize: $scope.pageModel.pageSize || 10});
            $scope.search.pageIndex = $scope.search.currentPage - 1;
            fac.getPageResult("/ovu-pcos/pcos/gm_email/list2", $scope.search, function (data) {
                data.data.forEach(function (v) {
                    if(v.images){
                        v.images=v.images.split(',');
                    }
                    else {
                        v.images='';
                    }
                })
                $scope.pageModel = data;
            });
        };
    });
    app.controller('informOpinionCtrl', function ($scope, $http, $uibModal, $uibModalInstance, $filter, fac, param) {
        $scope.item=param;
        //当状态为已完成的时候才能查询处理意见
        if(param.isEnd==1){
            $http.post('/ovu-pcos/pcos/gm_email/replyDetail',{id:param.id},fac.postConfig).success(function (res) {
                $scope.itemOpinion=res;
            })
        }
        /*$http.post('/ovu-pcos/pcos/star/record/list',{personId:param.ID},fac.postConfig).success(function (data) {
         $scope.pageModel = data
         })*/
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    })
    app.controller('informExamineCtrl', function ($scope, $http, $uibModal, $uibModalInstance, $filter, fac, param) {
        $scope.item=param;
        $scope.itemOpinion={};
        $http.post('/ovu-pcos/pcos/gm_email/replyDetail',{id:param.id},fac.postConfig).success(function (res) {
            $scope.itemOpinion=res;
        })
        $scope.save=function () {
            delete $scope.itemOpinion.createTime;
            delete $scope.itemOpinion.modifyTime;
            delete $scope.itemOpinion.mReplyTime;
            delete $scope.itemOpinion.gmReplyTime;
            $http.post('/ovu-pcos/pcos/gm_email/reply',$scope.itemOpinion,fac.postConfig).success(function (res) {
                if(res.success){
                    msg('批复成功');
                    $uibModalInstance.close();
                }else{
                    if(res.msg){
                     alert(res.msg)
                    }else{
                        alert("操作失败")
                    }
                }
            })
        }
        /*$http.post('/ovu-pcos/pcos/star/record/list',{personId:param.ID},fac.postConfig).success(function (data) {
         $scope.pageModel = data
         })*/
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    })
})();
