(function () {
    var app = angular.module("angularApp");

    app.controller('turnoverInfoCtrl', function ($scope, $rootScope, $http, $filter, $uibModal, fac) {
        document.title = "OVU-客流信息统计";
        angular.extend($rootScope, fac.dicts);
        $scope.params = {};
        $scope.search = {
            buildIds: '6cdc0961f199496580f856a8fa85e430,0ad6e05bd39e4b06a57de0f64f30ef63,0d561dedce2f4865b26ee458565692ae,1316d3a0e8a04713bbf5f78b63a3c044,173754f5bfec49a3a952c8ef5f76a7f6,1a18784d38654d6f9e41624b3b805e53,1f974916cbd244c6bb62682e00b833ca,2a6f47745a0243edb2b708023fe90402,49596e6ce91c4b839569e48d26d75ff8,6eb601b4f79c43eaa8e630ee421f810d,75d92dbc630c4d2da70c0b81019bc0e7,786f9ac551fd4a6599e23640d70d779a,819b0b453a154e9287da84262f3f4a9e,979c36f91eee4b0b93e433ddf62f32e9,a54d9a631b9c4b67b2c20648585a09c7,bd09cde5b6e94a729094d7e4cad626c9,c29b8e0298584801a0d00fea9966ba25,cb708c48c470462da5eb28f73954f105,d0caa164631649899b8c13eeb341659d,ed07ad562f084e658a8e8fcb47e25904,fdd6a6731e484f479fcf0406f0be8292'
        };
        $scope.trafficStatistics = [];
        // $scope.parkNo = '04201110001CYTD'
        $scope.searchInfo = function (boflag) {
            console.log('search=', $scope.search)
            console.log($scope.params)
            if (!$scope.search.startDate) {
                $scope.search.startDate = $scope.getNewDate(new Date())
            }
            if (!$scope.search.endDate) {
                $scope.search.endDate = $scope.getNewDate(new Date())
            }
            // console.log($scope.parks)
            // $http.get('/ovu-park/daping/trafficStatistics/space/getBuildByParkNo', { params: { parkNo: '04201110001CYTD' } }).success(function (resp) {
            //     console.log(resp)
            // }) 
            //if ($scope.search.startTime && $scope.search.endTime) {
            if ($scope.params.type == '0' || boflag) {
                $http.get("/ovu-park/daping/trafficStatistics/getTimeStatisticsByEquip", { params: $scope.search }).success(function (resp) {
                    console.log('resp=', resp)
                    $scope.trafficStatistics = resp.data
                });

            } else if ($scope.params.type == '1') {
                $http.post("/ovu-park/daping/trafficStatistics/getTimeStatisticsByPerson", $scope.search, fac.postConfig).success(function (resp2) {
                    console.log('resp2=', resp2)
                    $scope.trafficStatistics = resp2.data
                });

            } else if ($scope.params.type == '2') {
                $scope.search.type = 0
                $http.post("/ovu-park/daping/trafficStatistics/getTimeStatisticsByPerson", $scope.search, fac.postConfig).success(function (resp2) {
                    console.log('resp2=', resp2)
                    $scope.trafficStatistics = resp2.data
                });

            } else {
                alert("请选择统计类型");
            }
            // } else {
            //     $http.get("/ovu-park/daping/trafficStatistics/getTimeStatisticsByEquip?buildIds=6cdc0961f199496580f856a8fa85e430,0ad6e05bd39e4b06a57de0f64f30ef63,0d561dedce2f4865b26ee458565692ae,1316d3a0e8a04713bbf5f78b63a3c044,173754f5bfec49a3a952c8ef5f76a7f6,1a18784d38654d6f9e41624b3b805e53,1f974916cbd244c6bb62682e00b833ca,2a6f47745a0243edb2b708023fe90402,49596e6ce91c4b839569e48d26d75ff8,6eb601b4f79c43eaa8e630ee421f810d,75d92dbc630c4d2da70c0b81019bc0e7,786f9ac551fd4a6599e23640d70d779a,819b0b453a154e9287da84262f3f4a9e,979c36f91eee4b0b93e433ddf62f32e9,a54d9a631b9c4b67b2c20648585a09c7,bd09cde5b6e94a729094d7e4cad626c9,c29b8e0298584801a0d00fea9966ba25,cb708c48c470462da5eb28f73954f105,d0caa164631649899b8c13eeb341659d,ed07ad562f084e658a8e8fcb47e25904,fdd6a6731e484f479fcf0406f0be8292").success(function (resp) {
            //         console.log(resp)
            //         $scope.trafficStatistics = resp.data
            //     });
            // }

            // 从进出员工统计



        }

        $scope.exportToTable = function () {
            var startDate = $scope.search.startDate;
            var endDate = $scope.search.endDate;
            var statisticalType = $scope.search.statisticalType;
            var requestData = "buildIds=" + $scope.search.buildIds;
            if (startDate) {
                requestData += "&startDate=" + startDate;
            }
            if (endDate) {
                requestData += "&endDate=" + endDate;
            }
            if (statisticalType) {
                requestData += "&statisticalType=" + statisticalType;
            }
            // requestData += "&rentsaleCharacter=1";
            var URL = encodeURI("/ovu-park/daping/trafficStatistics/exportTimeStatisticsByEquip?" + requestData);
            window.location.href = URL;
        }



        $scope.parks = [];

        $scope.getNewDate = function (time) {
            var date = new Date(time);
            var year = date.getFullYear();
            /* 在日期格式中，月份是从0开始的，因此要加0
             * 使用三元表达式在小于10的前面加0，以达到格式统一  如 09:11:05
             * */
            var month =
                date.getMonth() + 1 < 10
                    ? "0" + (date.getMonth() + 1)
                    : date.getMonth() + 1;
            var day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();

            // 拼接
            return (
                year +
                "-" +
                month +
                "-" +
                day
            );
        }
        console.log($scope.getNewDate(new Date()))
        $scope.searchInfo(true)
        // $scope.chooseBuild = function () {
        //     if (!$scope.parks == []) {
        //         $scope.parks = [];
        //     }
        //     var modal = $uibModal.open({
        //         animation: false,
        //         size: 'lg',
        //         templateUrl: '/view/reportManage/turnoverInfo/modal.select.builds.html',
        //         controller: 'buildsSelectorCtrl',
        //         resolve: { data: function () { return {}; } }
        //     });
        //     modal.result.then(function (data) {
        //         if ($scope.parks && $scope.parks.length > 0) {
        //             data.forEach(function (part) {
        //                 $scope.parks.forEach(function (item) {
        //                     if (part.id == item.id) {
        //                         part.isExist = true;
        //                     }
        //                 });
        //             });
        //         }

        //         data.forEach(function (part) {
        //             if (!part.isExist) {
        //                 $scope.parks.push({ id: part.id, parkName: part.parkName });
        //             }
        //         });
        //         if ($scope.parks.length > 3) {
        //             $scope.parkList = $scope.parks.slice(0, 3)
        //         } else {
        //             $scope.parkList = $scope.parks;
        //         }
        //     });

        // };

        // $scope.show = ""
        // $scope.getmore = function () {
        //     $scope.parkList = $scope.parks;
        //     $scope.show = true;
        // }
        // $scope.getless = function () {
        //     $scope.parkList = $scope.parks.slice(0, 3);
        //     $scope.show = false;
        // }

        // $scope.delpark = function (parks, p) {

        //     if ($scope.parkList.length <= 3) {
        //         parks.splice(parks.indexOf(p), 1);
        //         $scope.parkList = parks.slice(0, 3);
        //         $scope.show = ""
        //     } else {
        //         parks.splice(parks.indexOf(p), 1);
        //     }


        // };

    })

    app.controller('buildsSelectorCtrl', function ($scope, $rootScope, $http, $uibModalInstance, $filter, fac, data) {
        $scope.onlyOne = data.isOnly || false; //是否单选
        $scope.config = {
            edit: false
        };
        $scope.pageModel = {};
        // $scope.search = {
        //     isGroup: app.curModule.isGroup
        // };
        $scope.parks = [];
        // $scope.find = function (pageNo) {
        //     $scope.search.parentId = $scope.curNode && $scope.curNode.id;
        //     $.extend($scope.search, {
        //         currentPage: pageNo || $scope.pageModel.currentPage || 1,
        //         pageSize: $scope.pageModel.pageSize || 10
        //     });
        //     fac.getPageResult("/ovu-base/system/park/listByGrid", $scope.search, function (data) {
        //         data.data.forEach(function (p) {
        //             $scope.parks.forEach(function (park) {
        //                 if (p.id == park.id) {
        //                     p.checked = true;
        //                 }
        //             });
        //         });
        //         $scope.pageModel = data;
        //     });
        // };
        $scope.search = {
            parkNo: '04201110001CYTD'
        }
        $scope.find = function () {
            $http.get('/ovu-park/daping/trafficStatistics/space/getBuildByParkNo', { params: $scope.search }).success(function (resp) {
                console.log(resp)
                // $scope.treeData = resp.data
            })
        }

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