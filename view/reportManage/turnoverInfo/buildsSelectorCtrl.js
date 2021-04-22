(function () {
    var app = angular.module("angularApp");

    app.controller('buildsSelectorCtrl', function ($scope, $rootScope, $http, $uibModalInstance, $filter, fac, data) {
        $scope.onlyOne = data.isOnly || false; //是否单选
        $scope.config = {
            edit: false
        };
        $scope.pageModel = {};
        $scope.search = {
            isGroup: app.curModule.isGroup
        };
        $scope.parks = [];
        $scope.find = function (pageNo) {
            $scope.search.parentId = $scope.curNode && $scope.curNode.id;
            $.extend($scope.search, {
                currentPage: pageNo || $scope.pageModel.currentPage || 1,
                pageSize: $scope.pageModel.pageSize || 10
            });
            fac.getPageResult("/ovu-base/system/park/listByGrid", $scope.search, function (data) {
                data.data.forEach(function (p) {
                    $scope.parks.forEach(function (park) {
                        if (p.id == park.id) {
                            p.checked = true;
                        }
                    });
                });
                $scope.pageModel = data;
            });
        };
        $scope.selectNode = function (node) {
            if ($scope.curNode != node) {
                $scope.curNode && $scope.curNode.state && ($scope.curNode.state.selected = false);
            }
            node.state = node.state || {};
            node.state.selected = !node.state.selected;
            if (node.state.selected) {
                $scope.curNode = node;
                $scope.find(1);
            } else {
                delete $scope.curNode;
            }
        };

        //单个添加
        $scope.checkOne = function (park, data) {
            park.checked = !park.checked;
            if (data) {
                data.checked = data.every(function (v) {
                    return v.checked;
                });
            }
            if (park.checked) {
                var isSelected = false;
                if ($scope.onlyOne) { //单选
                    $scope.parks.unshift(park);
                }
                $scope.parks && $scope.parks.forEach(function (item) {
                    if (park.id == item.id) {
                        isSelected = true;
                    }
                })
                //在编辑状态下如果在编辑前没有被选中的才加入
                if (!isSelected) {
                    $scope.parks.unshift(park);
                }
            } else {
                $scope.parks.splice($scope.parks.indexOf(park), 1);
            }
        }

        //全选
        $scope.checkAll = function (data) {
            data.checked = !data.checked;
            data.data.forEach(function (n) {
                n.checked = data.checked
                var isSelected = false;
                $scope.parks && $scope.parks.forEach(function (park) {
                    if (n.id == park.id) {
                        isSelected = true;
                    }

                })
                //在编辑状态下如果在编辑前没有被选中的才加入
                if ((!isSelected) && (n.checked)) {
                    $scope.parks.push(n);
                }
                if (!n.checked && isSelected) {
                    var i = 0;
                    $scope.parks.forEach(function (v) {
                        i++;
                        if (v.id == n.id) {
                            $scope.parks.splice(i - 1, 1);
                        }
                    })

                }

            });


        }

        //删除
        $scope.del = function (parks, park) {
            park.checked = false;
            parks.splice(parks.indexOf(park), 1);
        };
        app.modulePromiss.then(function () {
            $scope.treeData = fac.getParkTree("0");

            $scope.treeData.forEach(function (da) {
                da.state = da.state || {};
                da.state.expanded = true;
            })

            $scope.find();
        })


        //点击单个项目
        $scope.clickOnePark = function (item) {
            $scope.curPark = item;
        }
        $scope.save = function () {
            var datas;
            if ($scope.onlyOne) {
                datas = $scope.curPark;
            } else {
                datas = $scope.parks.reduce(function (ret, n) {
                    n.checked && ret.push(n);
                    return ret
                }, []);
            }
            if (fac.isEmpty(datas)) {
                alert("请选择项目！");
            } else {
                $uibModalInstance.close(datas);
            }
        }

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    });
})()