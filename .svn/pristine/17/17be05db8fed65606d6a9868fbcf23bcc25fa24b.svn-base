/*
 * @Date: 2018-05-03 14:41:29 
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2018-05-15 11:03:05
 */

(function(angular) {
    var app = angular.module("angularApp");
    app.controller('indoorMapCtrl', ['$scope','$rootScope', '$http', '$uibModal', 'fac', function($scope,$rootScope, $http, $uibModal, fac) {

        $scope.pageModel = {};
        // $scope.pageModel.totalCount = 10;
        // $scope.pageModel.currentPage = 1;
        // $scope.pageModel.numPerPage = 10;

        $scope.pageModel.data = [{
            mapName: 'XX室内地图',
            mapUrl: '10000',
            mapType: '2'
        }];

        //查询列表
        $scope.findPage = function(pageIndex, pageSize) {
            $http.get("/ovu-pcos/Map/MapUpload/list.do", {
                params: {
                    pageIndex: pageIndex || 0,
                    pageSize: pageSize || 10,
                    // id: 10
                }
            }).then(function(res) {
                console.log('res.data');
                console.log(res.data);
                var pageModel = res.data;
                // $scope.pageModel = {};
                $scope.pageModel.data = pageModel.data.map(function(v) {
                    return {
                        id: v.id,
                        mapName: v.mapName,
                        mapType: parseInt(v.mapType),
                        parkName: v.park_name,
                        stageNum: v.stage_name,
                        // stage: { stageName: v.stage_name },
                        floorNum: v.floor_name,
                        unitNum: v.unitNo,
                        groundNum: v.groundNo,
                        roomNum: v.house_name,
                        mapUrl: v.mapUrl,
                        parkId: v.parkId,
                        stageId: v.stageId,
                        floorId: v.floorId,
                        houseId: v.houseId
                    }
                });
                $scope.pageModel.currentPage = pageModel.pageIndex + 1;
                $scope.pageModel.numPerPage = pageModel.pageSize;
                $scope.pageModel.totalCount = pageModel.totalCount;

            });
        };

        $scope.findPage();

        // 选择每页（？）多少条数据
        $scope.numSelect = function($event) {

            $scope.findPage(0, $event.nowSelected);
        };

        // 页码改变
        $scope.pageChanged = function(e) {

            $scope.findPage(e.currentPage - 1, $scope.pageModel.numPerPage);

        };



        // 编辑 新增
        $scope.showEditModal = function(item) {
            console.log('打开编辑');
            console.log(item);
            var modal = $uibModal.open({
                animation: true,
                component: 'mapAddEditModal',
                size: 'md',
                resolve: {
                    item: function() {
                        return item;
                    },
                    title: function() {
                        if (!item) {
                            return '新增室内地图';
                        }
                        return '编辑室内地图';
                    }
                }
            });
            // 返回一个promise
            // return modal.result;
            modal.result.then(function(value) {
                console.log('value');
                console.log(value);
                $http.post('/ovu-pcos/Map/MapUpload/edit.do', {
                    id: value.id ? value.id : null,
                    mapName: value.mapName,
                    mapUrl: value.mapUrl,
                    mapType: value.mapType,
                    parkId: value.parkId,
                    stageId: value.mapType > 1 ? value.STAGE.stageId : null,
                    floorId: value.mapType > 2 ? value.FLOOR.floorId : null,
                    unitNo: value.mapType > 3 ? value.unitNo : null,
                    groundNo: value.mapType > 4 ? value.groundNo : null,
                    houseId: value.mapType > 5 ? value.houseId : null
                }, fac.postConfig).then(function(res) {
                    console.log(res.data);
                    if (res.data.success) {
                        var lastPage = Math.ceil(($scope.pageModel.totalCount + 1) / $scope.pageModel.numPerPage);
                        $scope.findPage(lastPage - 1, $scope.pageModel.numPerPage);

                    } else if (res.data.message) {
                        confirm(res.data.message);
                    }
                });
            }, function() {
                console.info('Modal dismissed at: ' + new Date());
            });
        };

        // 删除
        $scope.del = function(item) {
            confirm('确定要删除' + item.mapName + '？', function() {
                console.log('发请求删除');
                console.log(item)
                $http.post("/ovu-pcos/Map/MapUpload/delete.do", {
                    ids: item.id
                }, fac.postConfig).success(function(res) {
                    console.log('resasdfasdgasdgfqasgdrasdfga');
                    console.log(res);
                    if (res.success) {
                        $scope.findPage();
                    }
                });
            });
        };

    }]);

    app.component('mapAddEditModal', {
        templateUrl: '/view/indoorMapUpload/modal.addEditMap.html',
        bindings: {
            close: '&',
            dismiss: '&',
            resolve: '<'
        },
        controller: function($scope, $rootScope, $http, $timeout, fac) {
            var $ctrl = this;
            $ctrl.$onInit = function() {
                $ctrl.item = angular.copy($ctrl.resolve.item);
                $ctrl.title = $ctrl.resolve.title;
                if ($ctrl.item.parkId) {
                    $ctrl.callback();
                    houseTreePromiss.then(function(){
                        if ($ctrl.item.stageId) {
                            $ctrl.item.STAGE = $ctrl.houseTree.find(function(n) {
                                return n.stageId == $ctrl.item.stageId
                            });
                            if ($ctrl.item.STAGE && $ctrl.item.STAGE.nodes && $ctrl.item.floorId) {
                                $ctrl.item.FLOOR = $ctrl.item.STAGE.nodes.find(function(n) {
                                    return n.floorId == $ctrl.item.floorId
                                });
                                if ($ctrl.item.FLOOR) {
                                    $ctrl.geneUnit($ctrl.item.FLOOR);
                                    $ctrl.geneGround($ctrl.item.FLOOR);
                                    $ctrl.getHouseList($ctrl.item.FLOOR);
                                }
                            }
                        }
                    });
                }
            };
            $ctrl.ok = function(form) {
                form.$setSubmitted(true);
                if (!form.$valid) {
                    return;
                }
                $ctrl.close({
                    $value: $ctrl.item
                });
            };
            $ctrl.cancel = function() {
                $ctrl.dismiss({
                    $value: $ctrl.item
                });
            };

            /*start 项目期楼栋选择*/
            var houseTreePromiss;
            $ctrl.findPark = $rootScope.findPark;
            $ctrl.callback = function(){
              $ctrl.item.parkName = $ctrl.item.PARK_NAME || $ctrl.item.parkName;
              houseTreePromiss = fac.getHouseTree($ctrl,$ctrl.item.parkId);
            }

            //选择房号
            $ctrl.getHouseList = function(floor) {
                floor.houseList = [];
                if ($ctrl.item.groundNo) {
                    $http.post("/ovu-base/system/parkHouse/getHouses.do", {
                        floorId: floor.floorId,
                        unit_no: $ctrl.item.unitNo,
                        ground_no: $ctrl.item.groundNo
                    }, fac.postConfig).success(function(list) {
                        floor.houseList = list;
                        $ctrl.changeHouse();
                    })
                }
            }

            //选择单元、楼层
            $ctrl.geneUnit = function(floor) {
                if (!floor) {
                    return;
                }
                floor.groundList = [];
                var param = {
                    pageSize:1000,
                    pageIndex:0,
                    floorId:floor.floorId||""
                };
                $http.get("/ovu-base/system/parkHouse/listUnitNo_mute.do",{params:param}).success(function(resp){
                    floor.unitList = resp.data;
                })
            }

            $ctrl.geneGround = function(floor) {
                if (!floor||!$ctrl.item.unitNo) {
                    floor.groundList = [];
                    return;
                }
                var param = {
                    pageSize:1000,
                    pageIndex:0,
                    floorId:floor.floorId||"",
                    unit_no:$ctrl.item.unitNo
                };
                $http.get("/ovu-base/system/parkHouse/listGroundNo_mute.do",{params:param}).success(function(resp){
                    floor.groundList = resp.data;
                })
            }
            //改变房屋，触发方法
            $ctrl.changeHouse = function () {
                $ctrl.item.houseName =  ($ctrl.item.houseId && $ctrl.item.FLOOR.houseList &&  $ctrl.item.FLOOR.houseList.find(function (house) {
                    return house.ID = $ctrl.item.houseId;
                }).HOUSE_NAME) || '';
            }
            /*end*/



            //选择文件
            $ctrl.selectDoc = function(item) {
                console.log(item);
                var itembak = angular.copy(item);
                var param = { url: "/ovu-pcos/upload/document.do", accept: '*' };
                fac.upload(param, function(resp) {
                    if (resp.status == 1) {
                        item.mapUrl = resp.url;
                        item.fileName = resp.fileName;
                        $scope.$apply();
                    } else {
                        alert(resp.error);
                    }
                    item = angular.merge(itembak, item);
                    console.log(item);
                });
            };

            $ctrl.addFile = function (item, urlField, nameField) {
              upload({ url: "/ovu-base/uploadFileToYun.do", accept: "*" }, function (resp) {
                if (resp.success && resp.data) {
                  item[urlField] = resp.data.url;
                  item[nameField] = resp.data.name;
                  $rootScope.$apply();
                  console.log(item);
                  $http.get(resp.data.url).then(function(res){
                    console.log('res',res);
                  }).catch(function(err){
                    console.log('err',err);
                  });
                } else {
                  alert(resp.error);
                }
              })
            }

            function upload(options, fn) {
            if (typeof (options.params) != "object") {
              options.params = {};
            }
            if (!options.url) {
              options.url = '/ovu-base/uploadImg.do';
            }
            var index;
            if (options.nowait) {
              options.onSubmit = function () {
              };
            } else {
              options.onSubmit = function () {
                index = layer.load(1, {
                  shade: [0.2, '#000'] //0.1透明度的白色背景
                });
              };
            }
            options.onComplate = function (data) {
              layer.close(index);
              if (Array.isArray(data)) {
                fn && fn(data);
              } else if ("object" == typeof data) {
                if (data.success || data.status == 1) {
                  fn && fn(data);
                } else {
                  layer.alert(data.error || "上传发生错误!", { btn: ['ok'], title: false });
                }
              } else if ("string" == typeof data && data.indexOf('url') != -1) {
                data = JSON.parse(data);
                if (data.success || data.status == 1) {
                  fn && fn(data);
                } else {
                  layer.alert(data.error || "上传发生错误!", { btn: ['ok'], title: false });
                }
              } else {
                layer.alert("发生错误:" + data, { btn: ['ok'], title: false });
              }
            };
            // 上传方法
            $.upload(options);
          }

        }
    });


    app.component('decorationPagination', {
        templateUrl: '/view/decoration/common/pagination/view.html',
        bindings: {
            totalCount: '<',
            currentPage: '<',
            numPerPage: '<',
            onSelectChange: '&',
            onPageChanged: '&'
        },
        controller: ['decoration.pageService', function(pageService) {
            var vm = this;

            vm.$onInit = function() {
                // 最多显示1 2 3 4 5 5个页面按钮
                vm.maxSize = 5;
                // 到（）页  [1,2,3....]
                vm.selectablePages = pageService.getSelectablePages(vm.totalCount, vm.numPerPage);
                // 当前显示(0|第11|1-10)条
                vm.currentDisplay = pageService.getCurrentDisplay(vm.totalCount, vm.numPerPage, vm.currentPage);
            };
            vm.$onChanges = function(changes) {
                // 更新 selectablePages
                vm.selectablePages = pageService.getSelectablePages(vm.totalCount, vm.numPerPage);
                // 更新 currentDisplay
                vm.currentDisplay = pageService.getCurrentDisplay(vm.totalCount, vm.numPerPage, vm.currentPage);
            };
            // 每页 条 变化时  改变numPerPage
            vm.selectChange = function() {
                // 更新每页条数 后 currentPage 设置1
                vm.currentPage = 1;
                // 更新 selectablePages
                vm.selectablePages = pageService.getSelectablePages(vm.totalCount, vm.numPerPage);
                // 更新 currentDisplay
                vm.currentDisplay = pageService.getCurrentDisplay(vm.totalCount, vm.numPerPage, vm.currentPage);
                // 这里的语法很怪异 但是确实就是这么用的
                vm.onSelectChange({
                    $event: {
                        nowSelected: vm.numPerPage
                    }
                });
            };

            //当前页码变化时  改变 currentPage
            vm.pageChanged = function() {
                // 更新 currentDisplay
                vm.currentDisplay = pageService.getCurrentDisplay(vm.totalCount, vm.numPerPage, vm.currentPage);
                vm.onPageChanged({
                    $event: {
                        currentPage: vm.currentPage
                    }
                })
            };

        }],
        controllerAs: 'vm'
    });

    app.service('decoration.pageService', function() {
        // 根据总的数据条数totalCount=11  每页数据条数numPerPage=5  得到pageList = [1,2,3]
        this.getSelectablePages = function(totalCount, numPerPage) {
            var pageList = [];
            var pageCount = Math.ceil(totalCount / numPerPage);
            for (var i = 0; i < pageCount; i++) {
                pageList.push(i + 1);
            }
            return pageList;
        };
        // 根据 数据总条数 每页多少条 当前页码 计算 《共(?)条 当前显示(0|第11|1-10)条》
        this.getCurrentDisplay = function(totalCount, numPerPage, currentPage) {
            // 当前显示的开始项目 编号
            var from = (currentPage - 1) * numPerPage + 1;
            // 当前显示的结束项目 编号
            var to = currentPage * numPerPage > totalCount ? totalCount : currentPage * numPerPage;

            // 显示内容
            var currentDisplay = '';
            if (parseInt(to) === 0) {
                currentDisplay = '0';
            } else if (parseInt(from) === parseInt(to)) {
                currentDisplay = '第' + from;
            } else {
                currentDisplay = from + '-' + to;
            }
            return currentDisplay;
        };
    });




})(angular);
