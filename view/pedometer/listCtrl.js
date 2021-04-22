/**
 * @author  ghostsf
 * @date 2017-11-13
 */
(function () {
    "use strict";
    var app = angular.module("angularApp");

    app.controller('listCtrl', function ($scope, $rootScope, $http, $filter, $uibModal, fac) {
        document.title = "OVU-计步查询";
   
        fac.setPostDict($rootScope);

        $scope.pageModel = {};

        $scope.search = {};

        //默认一周内的
        function initSearch() {
            var date = new Date();
            $scope.search.endTime = getDateStr(date);
            date.setDate(date.getDate() - 6);
            $scope.search.startTime = getDateStr(date);
        }

        function getDateStr(date) {
            const year = date.getFullYear();
            const month = date.getMonth() + 1;
            const day = date.getDate();
            return [year, month, day].map(function (n) {
                n = n.toString();
                return n[1] ? n : '0' + n;
            }).join('-');
        }

        app.modulePromiss.then(function () {
            initSearch();
            $scope.deptTree_pedometer=fac.getGlobalTree();
            if($scope.deptTree_pedometer.length){
                $scope.search.deptId = $scope.deptTree_pedometer[0].id;
            }
         
        })

        $scope.find = function (pageNo) {

            var curDept = fac.getSelectedNode($scope.deptTree_pedometer);
            if(curDept){
                $scope.search.deptId = curDept.id;
            }else{
                alert("请选择部门！");
                return;
            }

            $.extend($scope.search, {
                currentPage: pageNo || $scope.pageModel.currentPage || 1,
                pageSize: $scope.pageModel.pageSize || 10
            });
            $scope.search.personName = $scope.search.user?$scope.search.user.name:undefined;
            
            fac.getPageResult("/dapingAgent/person/pedometerList.do", $scope.search, function (data) {
                data.list.forEach(function(n){
                    n.postList = [];
                    if(n.postIds){
                        var deptpost = n.postIds.split(",");
                        n.postList = deptpost.map(function(m){return m.indexOf("^")>0?(m.split("^")):(null)})
                        delete n.postIds;
                    }
                });
                $scope.pageModel = data;
            });
        };

        $scope.setDept = function(search,node){
            if(node.state.selected){
                $http.get("/ovu-base/pcos/person/getPost.do?id="+search.deptId).success(function(res){
                    $scope.position_options = res;
                })
                $scope.find(1);
            }else{
                $scope.position_options = [];
            }
        }
        function getPostList() {
            $scope.position_options = [];
            var curDept = fac.getSelectedNode($scope.deptTree_pedometer);
            curDept && $http.get("/ovu-base/pcos/person/getPost.do?id=" + curDept.id).success(function (res) {
                $scope.position_options = res;
            })
        }

        $scope.detail = function (item) {
            var param = {
                parkId: $scope.search.parkId,
                personId: item.personId,
                userId: item.userId,
                startTime: $scope.search.startTime,
                endTime: $scope.search.endTime
            };
            var modal = $uibModal.open({
                animation: true,
                templateUrl: 'pedometer/modal.detail.html',
                controller: 'checkCtrl'
                , resolve: {param: param}
            });
            modal.result.then(function () {
                $scope.find();
            }, function () {
            });
        }


    });

    /**
     * 查看详情
     */
    app.controller('checkCtrl', function ($scope, $rootScope, $http, $uibModalInstance, $uibModal, $filter, fac, param) {
        $scope.search = {};

        $scope.pageModel = {};
        $scope.person = {};

        $scope.find = function (pageNo) {
            $.extend($scope.search, {
                currentPage: pageNo || $scope.pageModel.currentPage || 1,
                pageSize: $scope.pageModel.pageSize || 10,
                userId: param.userId,
            });
            fac.getPageResult("/dapingAgent/person/getHistorySteps.do", $scope.search, function (data) {
                $scope.pageModel = data;
            });
        };

        $scope.find(1);

        $http.get("/ovu-base/pcos/person/personInfo.do", {params: { personId:param.personId}}).success(function (data) {
            var depts = "";
            var posts = "";
            var parks = "";
            if(data){
                data.posts && data.posts.forEach(function (p) {
                    depts += p.deptName + "->";
                    posts += p.postName + ",";
                });
                data.parks &&  data.parks.forEach(function (p) {
                    parks += p.parkName + ",";
                });
                depts = depts.substring(0, depts.lastIndexOf('->'));
                posts = posts.substring(0, posts.lastIndexOf(','));
                parks = parks.substring(0, parks.lastIndexOf(','));
                $scope.person.name = data.name;
                $scope.person.sex = data.sex;
                $scope.person.jobcode = data.jobCode;
                $scope.person.depts = depts;
                $scope.person.posts = posts;
                $scope.person.parks = parks;
            }
           
        });

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    });

})();
