(function () {
    "use strict";
    var app = angular.module("angularApp");
    app.controller('ownGroupCtrl', function ($scope, $rootScope, $http, $filter, $uibModal, fac) {
        document.title = "个人成绩";
        $scope.pageModel = {};
        $scope.search={};
        app.modulePromiss.then(function () {
            $scope.search.type=1;
            $scope.find(1);
        });

        //列表查询
        $scope.find = function (pageNo) {
            $scope.search.personName = $scope.search.user ? $scope.search.user.name : undefined;
            $.extend($scope.search, { currentPage: pageNo || $scope.pageModel.currentPage || 1, pageSize: $scope.pageModel.pageSize || 10});
            fac.getPageResult("/ovu-pcos/pcos/newknowledge/result/ownList.do", $scope.search, function (data) {
                $scope.pageModel = data;
            });
        };

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
                $scope.search.parkId = data.id;
            }, function () {

            });
        }

        //预览
        $scope.review = function (sub) {
            var copy = angular.extend({}, sub);
            var modal = $uibModal.open({
                animation: false,
                size: 'lg',
                templateUrl: './knowledge/modal.showOwnHistory.html',
                controller: 'personHistoryCtrl'
                , resolve: { sub: copy }
            });
            modal.result.then(function () {

            });
        }

        $scope.export=function () {
            var ids = $scope.pageModel.list.reduce(function (ret, n) { n.checked && ret.push(n.personId); return ret }, []);
            var elemIF = document.createElement("iframe");
            var param = 'personId='+ids.join();
            elemIF.src = "/ovu-pcos/pcos/newknowledge/result/ownExport.do?" + param;
            elemIF.style.display = "none";
            document.body.appendChild(elemIF);
        }

    });

    app.controller('personHistoryCtrl', function ($scope, $http, fac, $uibModal,$uibModalInstance, sub) {
        $scope.pageModel = {};
        $scope.search={personId:sub.personId};

        //列表查询
        $scope.find = function (pageNo) {
            $.extend($scope.search, { currentPage: pageNo || $scope.pageModel.currentPage || 1, pageSize: $scope.pageModel.pageSize || 10});
            fac.getPageResult("/ovu-pcos/pcos/newknowledge/result/ownDetailList", $scope.search, function (data) {
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

        $scope.showPersonScore=function(item){
            var sub={
                paperId:item.paperId,
                personId:item.personId,
                show:true
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
        }

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    });
})();
