// 试卷管理

(function () {
    "use strict";
    var app = angular.module("angularApp");
    app.controller('paperResultCtrl', function ($scope, $rootScope, $http, $filter, $uibModal, fac) {
        document.title = "试卷成绩";
        $scope.pageModel = {};
        // app.modulePromiss.then(function () {
        //     fac.initPage($scope, function () {
        //         $scope.search.parkIds=$scope.search.parkId;
        //         $scope.find(1);
        //     }, function () {
        //         $scope.find(1);
        //     })
        // });
        $scope.search={}
        app.modulePromiss.then(function () {
            $scope.$watch('dept.id', function (deptId, oldValue) {
                if (deptId) {
                    if ($scope.dept.parkId) {
                        $scope.search.parkIds = $scope.dept.parkId;
                        $scope.find(1);
                    } else {
                        alert('请选择跟项目关联的部门');
                        return 
                    }

                }
            })
        })
        //列表查询
        $scope.find = function (pageNo) {
            if(!$rootScope.dept ||!$rootScope.dept.id){
                alert("请选择部门！");
                return false;
            }
            $.extend($scope.search, { currentPage: pageNo || $scope.pageModel.currentPage || 1, pageSize: $scope.pageModel.pageSize || 10});
            fac.getPageResult("/ovu-pcos/pcos/newknowledge/result/list.do", $scope.search, function (data) {
                $scope.pageModel = data;
            });
        };

        //批量删除试卷
        $scope.delAll = function () {
            var ids = $scope.pageModel.list.reduce(function (ret, n) { n.checked && n.status!=1 && ret.push(n.id); return ret }, []);
            del(ids);
        };
        //删除试卷
        $scope.del = function (item) {
            del(item.id);

        }
        function del(ids) {
            confirm("确认删除选中的" + ids.length + "条记录?", function () {
                $http.post("/ovu-pcos/pcos/newknowledge/result/delete", { "ids": ids.join() }, fac.postConfig).success(function (resp) {
                    if (resp.code == "0") {
                        $scope.find();
                        msg(resp.msg);
                    } else {
                        alert(resp.msg);
                    }
                })
            });
        }

        //评分列表
        $scope.showEditModal = function (sub) {
            var copy = angular.extend({}, sub);
            copy.parkId= $scope.search.parkId || '';
            var modal = $uibModal.open({
                animation: false,
                size: 'lg',
                templateUrl: './knowledge/modal.operResult.html',
                controller: 'showResultCtrl'
                , resolve: { sub: copy }
            });
            modal.result.then(function () {

            }, function () {
                console.info('Modal dismissed at: ' + new Date());
            });
        }

        //查看成绩
        $scope.review = function (sub) {
            var copy = angular.extend({}, sub);
            var modal = $uibModal.open({
                animation: false,
                size: 'lg',
                templateUrl: './knowledge/modal.showResult.html',
                controller: 'showResultCtrl'
                , resolve: { sub: copy }
            });
            modal.result.then(function () {

            });
        }

    });

    app.controller('showResultCtrl', function ($scope, $http, fac, $uibModal,$uibModalInstance, sub) {
        $scope.item = sub || {};
        $scope.item.isGroup=0;

        $scope.pageModel = {};
        $scope.search={paperId:sub.id};

        //列表查询
        $scope.find = function (pageNo) {
            $.extend($scope.search, { currentPage: pageNo || $scope.pageModel.currentPage || 1, pageSize: $scope.pageModel.pageSize || 10});
            fac.getPageResult("/ovu-pcos/pcos/newknowledge/result/resultList", $scope.search, function (data) {
                data.data && data.data.forEach(function (item) {
                   if(item.isAttend==0 && !item.markingTime){
                       item.totalGrade='--';
                       item.score1='--';
                       item.score2='--';
                       item.score3='--';
                       item.score4='--';
                       item.score5='--';
                   }
                });
                $scope.pageModel = data;
            });
        };
        $scope.find(1);

        $scope.findPark = function () {
            var modal = $uibModal.open({
                animation: false,
                size: "lg",
                templateUrl: '/common/modal.select.parks.html',
                controller: 'parksSelectorCtrl',
                resolve: {
                    data: function () {
                        return { isOnly: true }
                    }
                }
            });
            modal.result.then(function (data) {
                $scope.search.parkName = data.fullPath;
                $scope.search.parkIds = data.id;
            }, function () {

            });
        }

        $scope.export=function(){
            var elemIF = document.createElement("iframe");
            var personName=$scope.search.personName?$scope.search.personName:'';
            var parkIds=$scope.search.parkIds?$scope.search.parkIds:'';
            var param = 'paperId='+$scope.search.paperId+'&personName='+personName+'&parkIds='+parkIds;
            elemIF.src = "/ovu-pcos/pcos/newknowledge/result/export.do?" + param;
            elemIF.style.display = "none";
            document.body.appendChild(elemIF);

        }

        $scope.showPersonScore=function(item){
            operPersonScore(item,true);
        }

        $scope.markScore=function(item){
            operPersonScore(item,false);
        }

        function operPersonScore(item,isShow){
            var sub={
                paperId:item.paperId,
                personId:item.personId,
                show:isShow
            };
            var modal = $uibModal.open({
                animation: false,
                size: "lg",
                templateUrl: '/view/knowledge/modal.personScore.html',
                controller: 'operPersonScoreCtrl',
                resolve: {
                    sub: function () {
                        return sub;
                    }
                }
            });
            modal.result.then(function (data) {
                if(!isShow){
                    $scope.find();
                }
            });
        }


        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    });
})();
