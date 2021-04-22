/**
 * @author  ghostsf
 * @date 2017-11-13
 */
(function () {
    "use strict";
    var app = angular.module("angularApp");

    app.controller('performanceStatisticsCtrl', function ($scope, $state, $rootScope, $http, $filter, $uibModal, fac) {
        document.title = "绩效统计";
        $scope.pageModel = {};

        fac.setPostDict($rootScope);
        
        $scope.search = {};

        $scope.Math = Math;
        
      

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
        	$scope.deptTree_performance= fac.getGlobalTree();
         
           
            if($scope.deptTree_performance.length){
                $scope.search.deptId = $scope.deptTree_performance[0].id;
            }
            initSearch();
		
        })

        $scope.find = function (pageNo) {
        	if(!$scope.search.deptId){
        		alert("请选择部门");
        		return;
        	}
            $.extend($scope.search, {currentPage: pageNo || $scope.pageModel.currentPage || 1, pageSize: $scope.pageModel.pageSize || 10});
            fac.getPageResult("/ovu-pcos/pcos/performance/statistics/queryByPage.do", $scope.search, function (data) {
                data.list.forEach(function(n){
                    n.postList = [];
                    if(n.postIds){
                        var deptpost = n.postIds.split(",");
                        var postList = deptpost.map(function(m){return m.indexOf("^")>0?(m.split("^")):(null)})
                    //    n.postList = postList.filter(function(m){return $scope.oriList.find(function(o){return o.id == m[0]}) })
                        n.postList = postList;
                        delete n.postIds;
                    }
                });
                $scope.pageModel = data;
            });
        };

        function getPostList() {
            $scope.position_options = [];
            $scope.search.deptId && $http.get("/ovu-base/pcos/person/getPost.do?id=" + $scope.search.deptId).success(function (res) {
                $scope.position_options = res;
            })
        }

       
        $scope.setDept = function(search,node){
        	
            if(node.state.selected){
            	
                getPostList();
                $scope.find(1);
            }
        }


        $scope.analysis = function (item) {
            var param = {
                personId: item.id,
                startTime: $scope.search.startTime,
                endTime: $scope.search.endTime
            };
            var modal = $uibModal.open({
                animation: true,
                size: 'lg',
                templateUrl: 'performance/modal.analysis.html',
                controller: 'analysisCtrl'
                , resolve: {param: param}
            });
            modal.result.then(function () {
                $scope.find();
            }, function () {
                console.info('Modal dismissed at: ' + new Date());
            });
        }


    });

    /**
     * 绩效分析
     */
    app.controller('analysisCtrl', function ($scope, $rootScope, $http, $uibModalInstance, $uibModal, $filter, fac, param) {
        $scope.Math = Math;

        $scope.person = {};

        if (fac.isNotEmpty(param.personId)) {
            //数据查询处理
            $http.get("/ovu-pcos/pcos/performance/statistics/analysis.do", {params: param}).success(function (data) {
                if (data.success) {
                    $scope.analysisdatas = data.data;
                } else {
                    alert(data.error);
                }
            })

            //预先获得工单条数
            $http.get("/ovu-pcos/pcos/performance/statistics/getWorkunitCounts.do", {params: param}).success(function (data) {
                if (data.success) {
                    $scope.countDatas = data.data;
                } else {
                    alert(data.error);
                }
            })
        }

        $http.get("/ovu-base/pcos/person/personInfo.do", {params: param}).success(function (data) {
            var parks = "";
            var posts = "";
            data.parks.forEach(function (p) {
                parks += p.parkName + ",";
            });
            data.posts.forEach(function (p) {
                posts += p.postName + ",";
            });
            parks = parks.substring(0, parks.lastIndexOf(','));
            posts = posts.substring(0, posts.lastIndexOf(','));
            $scope.person.park = parks;
            $scope.person.name = data.name;
            $scope.person.sex = data.sex;
            $scope.person.jobcode = data.jobCode;
            $scope.person.posts = posts;
        });

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    });

})();
