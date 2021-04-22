
(function() {

    var app = angular.module("angularApp");
    //人员异动ctl
    app.controller('personSignCtl', function($scope, $rootScope, $http, $filter, $uibModal, fac) {
        document.title = "OVU-签到统计";
        $scope.pageModel = {};

        app.modulePromiss.then(function() {
            $scope.search = {
                isGroup: fac.isGroupVersion(),
                date: $filter('date')(new Date(), "yyyy-MM-dd")
            };
            if ($scope.search.isGroup) {
                loadDeptTree();
            } else {
                if (app.park) {
                    $scope.search.parkId = app.park.id;
                    $scope.search.parkName = app.park.parkName;
                }
                if (!$scope.search.parkId) {
                    alert("请先选定一个项目");
                    return;
                } else {
                    loadDeptTree($scope.search.parkId);
                }
            }
        })


        $scope.find = function(pageNo) {
            $.extend($scope.search, {
                currentPage: pageNo || $scope.pageModel.currentPage || 1,
                pageSize: $scope.pageModel.pageSize || 10
            });
            fac.getPageResult("/ovu-pcos/pcos/person/pagePersonSign.do", $scope.search, function(data) {
                $scope.pageModel = data;
            });
        };

        $scope.showDetailModal = function(person) {
            var modal = $uibModal.open({
                animation: false,
                size: '',
                templateUrl: 'signDetail.html',
                controller: 'signDetailCtrl',
                resolve: {
                    params: {
                        userId: person.USER_ID,
                        day: $scope.search.date
                    }
                }
            });
        }


        function loadDeptTree(parkId) {
            $http.post("/ovu-base/system/dept/tree.do", {
                parkId: parkId
            }, fac.postConfig).success(function(data) {
                if (data.length) {
                    data[0].state = {
                        selected: true
                    };
                    $scope.search.DEPT_ID = data[0].id;
                    $scope.find(1);
                }

                $('#dept_tree').treeview({
                    data: data
                });
                $('#dept_tree').on('nodeSelected', function(event, node) {
                    if (node.id) {
                        $scope.search.DEPT_ID = node.id;
                        $scope.find(1);
                    }
                });
                $('#dept_tree').on('nodeUnselected', function(event, node) {
                    delete $scope.search.DEPT_ID;
                    console.log(node.id);
                    if (app.park) {
                        $scope.search.DEPT_ID = data[0].id;
                    }
                });
            });
        };

    });

    app.controller('signDetailCtrl', function($scope, $rootScope, $http, $uibModalInstance, $filter, fac, params) {

        $http.get("/ovu-pcos/pcos/person/listByPerson.do", {
            params: params
        }).success(function(list) {
            $scope.list = list;
        })

        $scope.cancel = function() {
            $uibModalInstance.dismiss('cancel');
        };
    });
})()
