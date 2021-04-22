(function() {
    document.title = "OVU-签到设置";
    var app = angular.module("angularApp");
    //人员异动ctl
    app.controller('personSignSettingsCtl', function($scope, $rootScope, $http, $filter, $uibModal, fac) {
        $scope.pageModel = {};

        app.modulePromiss.then(function() {
            $scope.search = {
                isGroup: fac.isGroupVersion()
            };
            if (app.park) {
                $scope.search.parkId = app.park.ID;
                $scope.search.PARK_NAME = app.park.PARK_NAME;
            }
            $scope.find();
        })


        $scope.find = function(pageNo) {
            var currentPage = pageNo || $scope.pageModel.currentPage || 1;
            $.extend($scope.search, {
                currentPage: currentPage,
                pageIndex: currentPage - 1,
                pageSize: $scope.pageModel.pageSize || 10
            });
            $http.post("/ovu-pcos/pcos/setupsign/list.do", $scope.search, fac.postConfig).success(function(res) {
                console.log('res');
                console.log(res);
                $scope.pageModel = res;
            });
        };

        $scope.showDetail = function(person) {
            var modal = $uibModal.open({
                animation: false,
                size: '',
                templateUrl: 'signSettingsDetail.html',
                controller: 'signSettingsDetailCtrl',
                resolve: {
                    params: {
                        userId: person.USER_ID,
                        day: $scope.search.date
                    },
                    person: person
                }
            });
            modal.result.then(function() {
                $scope.find();
            }, function() {
                console.info('Modal dismissed at: ' + new Date());
            });
        };

        $scope.openParkModal = function(item) {
            modalPark.open({
                callback: function(node) {
                    item.PARENT_ID = node.did;
                    item.parentPath = node.fullPath;
                    item.TOP_ID_ = node.top_id_;
                    modalPark.close();
                    $scope.$apply();
                },
                parkType: 0,
                leafOnly: true,
                selectedId: item.PARENT_ID
            });
        };


        function loadDeptTree(parkId) {
            $http.post("/ovu-base/system/dept/tree.do", {
                parkId: parkId
            }, fac.postConfig).success(function(data) {
                if (data.length) {
                    data[0].state = {
                        selected: true
                    };
                    $scope.search.DEPT_ID = data[0].did;
                    $scope.find(1);
                }

                $('#dept_tree').treeview({
                    data: data
                });
                $('#dept_tree').on('nodeSelected', function(event, node) {
                    if (node.did) {
                        $scope.search.DEPT_ID = node.did;
                        $scope.find(1);
                    }
                });
                $('#dept_tree').on('nodeUnselected', function(event, node) {
                    delete $scope.search.DEPT_ID;
                    console.log(node.did);
                });
            });
        };

        $scope.findDept = function() {
            modalDept.open({
                callback: function(node) {
                    if (node.did && node.text) {
                        // if (node.pdid && node.pdid == $scope.item.ID) {
                        //     alert("不能选择下级机构为其上级机构!");
                        //     return;
                        // }
                        // $scope.item.PARENT_NAME = node.text;
                        // $scope.item.PARENT_ID = node.did;
                        // $scope.$apply();
                        $scope.search.deptName = node.text;
                        $scope.search.deptId = node.did;
                        $scope.$apply();
                    }
                    modalDept.close();
                }
            });
        };

    });

    app.controller('signSettingsDetailCtrl', function($scope, $rootScope, $http, $uibModalInstance, $filter, fac, params, person) {

        $http.post('/ovu-pcos/pcos/daysign/get.do', {
            id: person.id
        }, fac.postConfig).success(function(data) {
            $scope.person = data;
        });

        $scope.cancel = function() {
            $uibModalInstance.dismiss('cancel');
        };
    });

})();