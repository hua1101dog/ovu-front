(function () {
    "use strict";
    var app = angular.module("angularApp");
    app.controller('cultivateIssueDetailsCtrl', function ($scope, $rootScope, $http, $filter, $uibModal,fac) {
        document.title = "培训课件发放详情";
        $scope.pageModel = {};
        $scope.search = {};
       
        $scope.show=false
       
        app.modulePromiss.then(function () {

            $scope.$watch('dept.id', function (deptId, oldValue) {
                if (deptId) {
                    $scope.search.deptId = deptId
                    $scope.search.coursewareName && delete $scope.search.coursewareName
                    $scope.find(1)
                }
               
            })
        })

       $scope.find=function(pageNo){
            $.extend($scope.search, { currentPage: pageNo || $scope.pageModel.currentPage || 1, pageSize: $scope.pageModel.pageSize || 10});
        fac.getPageResult("/ovu-pcos/pcos/newknowledge/train/list",$scope.search,function (data) {
            $scope.pageModel =data;

        });
        }
     
        //查看人群
        $scope.showPerson = function (sub) {
            $scope.show=true
         
            var copy = angular.extend({textRecord:$scope.textRecord,
            show:$scope.show,showTitle:'培训人群'}, sub);
            copy.type = 0;
            copy.step = 1;
            var modal = $uibModal.open({
                animation: false,
                size: 'lg',
                templateUrl: './knowledge/showPerson.html',
                controller: 'showknowledgePersonCtrl',
                resolve: {
                    sub: copy
                }
            });
            modal.result.then(function () {});
        }

        //查看详情
        $scope.showEditModal = function (sub,pageNo) {
            var copy = angular.extend({data:$scope.data}, sub);
            var modal = $uibModal.open({
                animation: false,
                size: 'lg',
                templateUrl: './knowledge/cultivateDetailsModal.html',
                controller: 'checkIssueDetailsCtrl',
                resolve: {
                    sub: copy
                }
            });
            modal.result.then(function () {

            });
        
           
        }       
    });
    app.controller('checkIssueDetailsCtrl', function ($scope, $http, fac, $uibModal, $uibModalInstance, sub) {
 
        $scope.pageModel = {};
        $scope.search={}
 
        $scope.find=function(pageNo){
            $.extend($scope.search, { currentPage: pageNo || $scope.pageModel.currentPage || 1, pageSize: $scope.pageModel.pageSize || 10,id:sub.id,coursewareId:sub.coursewareId});
            fac.getPageResult("/ovu-pcos/pcos/newknowledge/train/viewedList",$scope.search,function (data) {
                  
                   $scope.pageModel=data
             
                   
           });
        }
        $scope.find(1)
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    });

    //查看人群
    app.controller('showIssuePersonCtrl', function ($scope, $http, fac, $uibModalInstance, sub) {
             
        $scope.search = {}
        $scope.item = sub || {};  
        $scope.personList=sub.personList
        $scope.show=sub.show

        //关闭       
        $scope.cancel = function () { 
            $uibModalInstance.dismiss('cancel');
        };
    });
})()
