(function () {
    var app = angular.module("angularApp");
    /* 会议室制器 */
    app.controller('publishSportsPlaceCtrl', function ($scope, $rootScope, $http, $filter, $uibModal, fac) {
        document.title = "OVU-场地管理";
        angular.extend($rootScope, fac.dicts);

        $scope.search = {
            userType: 0,
            parkId: '',
            timeFlag:'0'
        };
        $scope.pageModel = {
            userType: ''
        };

        // 发布状态
        $scope.status = [{
                text: "待付款",
                value: 0
            },
            {
                text: "进行中",
                value: 1
            },
            {
                text: "已完成",
                value: 2
            },
            {
                text: "已取消",
                value: 3
            },
            {
                text: "待退款",
                value: 4
            },
            {
                text: "交易关闭",
                value: 5
            }
        ]

        // 页面初始化
        app.modulePromiss.then(function () {
            $scope.$watch('dept.id', function (deptId, oldValue) {
                if (deptId) {
                    if ($scope.dept.parkId) {
                        $scope.search.parkId = $scope.dept.parkId
                        $scope.find()
                    } else {
                        $scope.search.parkId && delete $scope.search.parkId
                        // alert('请选择跟项目关联的部门')
                        $scope.find()
                        return
                    }

                }
            })
        })


        // 查询列表
        $scope.find = function (pageNo) {

            if (!$scope.search.parkId) {
                alert("请选择项目关联的部门")
                $scope.pageModel = {};
                return
            }

            if ($scope.pageModel.currentPage) {
                delete $scope.pageModel.currentPage;
            }
            $.extend($scope.search, {
                currentPage: pageNo || $scope.pageModel.currentPage || 1,
                pageSize: $scope.pageModel.pageSize || 10
            });
            $scope.search.pageIndex = $scope.search.currentPage - 1;
            $scope.search.totalCount = $scope.pageModel.totalCount || 0;

            fac.getPageResult("/ovu-park/backstage/operate/yard/list", $scope.search, function (data) {
                $scope.pageModel = data;
                console.log('$scope.pageModel', $scope.pageModel)
            })

            // fac.getPageResult("/ovu-park/backstage/operate/office/spaceList", $scope.search, function (data) {
            //     $scope.houseMap = data.houseMap;
            // })

        };

        // $scope.init =function(){
        //     setTimeout(function(){
        //         $scope.find()
        //     },50)
        // }
        // $scope.init()
        // 会议室位置
        $scope.getPosition = function (houseId) {
            if (fac.isEmpty($scope.houseMap)) {
                return "--"
            } else {
                var houseObj = $scope.houseMap[houseId]
                if (fac.isNotEmpty(houseObj)) {
                    var ground = "--";
                    if (houseObj.groundNum) {
                        ground = houseObj.groundNum + "层";
                    }
                    if (houseObj.floorName) {
                        ground = houseObj.floorName;
                    }
                    return houseObj.stageName + houseObj.buildName + houseObj.unitNum + "单元" + ground + houseObj.houseName;
                } else {
                    return '--'
                }
            }
        }
        $scope.changeUserType = [{
                value: 0,
                text: "运营方"
            },
            {
                value: 1,
                text: "用户"
            }
        ]

        $scope.changeSearchStatus = function () {
            if ($scope.selUserType) {
                var sel = $scope.changeUserType.find(v => {
                    return v.value == $scope.selUserType
                })
                switch (sel.value) {
                    case 0:
                        $scope.search.userType = 0;
                        $scope.pageModel.userType = 0;
                        break;
                    case 1:
                        $scope.search.userType = 1;
                        $scope.pageModel.userType = 1;
                        break;
                }
            }
            $scope.find();
        }

        //新增、编辑
        $scope.addOrEditModal = function (yard) {
            if (!fac.checkPark($scope)) {
                return
            }
            yard = yard || {
            creatorName: app.user.loginName,
            creatorId: app.user.id
            };
            yard.parkId = app.park.parkId;
            yard.updatorId = app.user.id;
            var copy = angular.extend({}, yard);
            var modal = $uibModal.open({
            animation: false,
            size: 'lg',
            templateUrl: '/view/operationManage/placeManage/modal.addYard.html',
            controller: 'addSportsPlaceCtrl',
            resolve: {
                yard: copy
            }
            });
            modal.result.then(function () {
            if ($scope.pageModel.data.length == 1 && $scope.pageModel.currentPage > 1) {
                $scope.pageModel.currentPage = $scope.pageModel.currentPage - 1;
            }
            $scope.find();
            }, function () {
            console.info('Modal dismissed at: ' + new Date());
            
            });
        }

        // 订单状态
        $scope.getStatus = function (mOrderStatus) {
            switch (mOrderStatus) {
                case '0':
                    return "待审核";
                case '1':
                    return "已通过";
                case '2':
                    return "已拒绝";
                case '3':
                    return "已撤销";
            }
        }

        /**
         * 去除空格
         * */
        $scope.trimStr = function (str) {
            return str.replace(/(^\s*)|(\s*$)/g, "");
        }
        // app.modulePromiss.then(function () {

        //     $scope.find();

        // });

        $scope.query = function () {
            fac.initPage($scope, function () {
                $scope.find(1);
            })
        }
    });

    /* 添加场地控制器 */
  app.controller('addSportsPlaceCtrl', function ($scope, $http, $uibModalInstance, $filter, fac, yard, $uibModal) {
    $scope.item = yard;
    $scope.item.pics = $scope.item.photos ? $scope.item.photos.split(",") : [];
    $scope.ContactPersonString = []
    $scope.opentimeString=[]

    if ($scope.item.ContactPersonString) {
        $scope.ContactPersonString = eval("(" + $scope.item.ContactPersonString + ")");
    }

    if ($scope.item.opentimeString) {
        $scope.opentimeString = eval("(" + $scope.item.opentimeString + ")");
    }

    $scope.saveYard = function (form, item) {
      form.$setSubmitted(true);
      if (!form.$valid) {
        return;
      }

      if (!$scope.ContactPersonString || $scope.ContactPersonString.length == 0) {
        alert("请添加联系人！");
        return;
    }

    
    if (!$scope.opentimeString || $scope.opentimeString.length == 0) {
        alert("请添加营业时间！");
        return;
    }

      if (item.pics.length == 0) {
        alert("必须至少上传1张图片, 请上传图片!")
        return false;
      }

      if (item.pics.length > 5) {
        alert("最多只能上传5张图片, 请删除多余的图片!")
        return false;
      }
      item.ContactPersonString = JSON.stringify($scope.ContactPersonString)
      item.opentimeString = JSON.stringify($scope.opentimeString)
      item.photos = item.pics.join(",");
      console.log('item',item)
      $http.post("/ovu-park/backstage/operate/yard/saveOrEdit", item, fac.postConfig).success(function (resp) {
        if (resp.code == 0) {
          window.msg("操作成功!");
          $uibModalInstance.close();
        } else {
          alert("操作失败!");
        }
      });

    }

    $scope.cancel = function () {
      $uibModalInstance.dismiss('cancel');
    };

    var map;
    $scope.setMap = function (item) {
      var copy = angular.extend({}, item);
      var modalInstance = $uibModal.open({
        size: 'lg',
        animation: true,
        templateUrl: '/view/operationManage/placeManage/modal.showPosition.html',
        controller: 'placeSetMapCtrl',
        resolve: {
          positon: copy
        }
      });
      modalInstance.result.then(function (data) {
        item.mapLng = data.mapLng
        item.mapLat = data.mapLat
      });
    };


    //关闭地图
    $scope.closeMap = function () {
      $('.map').hide();
      map.destroy();
      $("#myPageTop input").val("");
    };
  });


   //场地设置地图
   app.controller('placeSetMapCtrl', function ($scope, $http, $uibModalInstance, $filter, fac, positon) {
    var positionList = [];
    var map
    var mapLng = [];
    var mapLat = [];
    var arr = [];
    var arr1 = [];

    $scope.$on('birdMap', function (event, data) {
      map = data
    });
    $scope.$on('position', function (event, data) {
      mapLng = [];
      mapLat = [];
      positionList = data;
      positionList.forEach(position => {
        mapLng.push(position[0])
        mapLat.push(position[1])
      })

      $scope.map_lat = mapLat.join(',')
      $scope.map_lng = mapLng.join(',');

    });


    $scope.unclick = positon.unclick;
    if (positon.mapLat) {
      arr = positon.mapLat.split(',')
      arr1 = positon.mapLng.split(',') || []
    }
    arr && arr.forEach((e, i) => {
      positionList.push([arr1[i] - 0, e - 0])
    })


    positionList.forEach(position => {
      mapLng.push(position[0])
      mapLat.push(position[1])
    })
    $scope.map_lat = mapLat.join(',')
    $scope.map_lng = mapLng.join(',');


    $scope.cancel = function () {
      $uibModalInstance.dismiss('cancel');
    };
    $scope.save = function () {
      $uibModalInstance.close({
        mapLng: mapLng.join(','),
        mapLat: mapLat.join(',')
      });
    }

  });

})()
