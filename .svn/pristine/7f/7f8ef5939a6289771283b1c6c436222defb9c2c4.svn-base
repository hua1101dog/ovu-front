(function () {
  var app = angular.module("angularApp");
  app.controller('fixPriceCtl', function ($scope, $rootScope, $http, $filter, $uibModal, fac, ) {
    document.title = "OVU-收房提醒";
    angular.extend($rootScope, fac.dicts);
    $scope.search = {};
    $scope.pageType = "no";
    $scope.pageModel = {};
    $scope.search.houseStatus = 1;
    // $scope.search.spaceStatus = "";
    $scope.houseTypeList = [{
      'text': '办公用房',
      'id': 'FW11'
    }, {
      'text': '住宅用房',
      'id': 'FW12'
    }, {
      'text': '商业用房',
      'id': 'FW16'
    }]



    console.log($scope.houseTypeList);
    $scope.find = function (pageNo) {
      if (!app.park || !app.park.parkId) {
        window.msg("请先选择一个项目!");
        return false;
      }
      $scope.search.parkId = app.park.parkId;
      $.extend($scope.search, {
        currentPage: pageNo || $scope.pageModel.currentPage || 1,
        pageSize: $scope.pageModel.pageSize || 10
      });
      $scope.search.pageIndex = $scope.search.currentPage - 1;
      $scope.search.totalCount = $scope.pageModel.totalCount || 0;
      fac.getPageResult("/ovu-park/backstage/parkHouseStatus/listHouse", $scope.search, function (data) {
        $scope.pageModel = data;
      });
    };




    // 状态切换
    $scope.sellTatusByTab = function (event, type) {
      $(".div-panel").removeClass("div-active");
      $(event.target).addClass("div-active");
      $scope.pageType = type;
      $scope.search = {};
      delete $scope.pageModel.currentPage;
      delete $scope.pageModel.totalCount;
      delete $scope.stageList;
      delete $scope.buildList;
      delete $scope.unitList;
      delete $scope.groundList;
      delete $scope.search.houseStatus;

      //no未提醒
      if ('no' == type) {
        $scope.search.houseStatus = 1
        // $scope.search.spaceStatus = 1
      }

      //sell可收房
      else if ('sell' == type) {
        $scope.search.houseStatus = 2
        // $scope.search.spaceStatus = 2

        //all全部
      } else if ('all' == type) {
        $scope.search.houseStatus = ""
        // $scope.search.spaceStatus = ''
      }
      loadStageListByParkId(app.park.parkId);
      $scope.find();
    }



    //收房提醒
    $scope.houseRemind = function (item) {
      confirm("确定发送收房提醒吗", function () {
        $http.get("/ovu-park/backstage/parkHouseStatus/status?rmStatus=3&ids=" + item.id).success(function (res) {
          console.log(res)
          if (res.code == 0) {
            window.msg("完成");
            $scope.find();
          }
          else {
            window.msg("修改异常");
          }
        })
      })
    }
    //点击批量收房提醒
    $scope.manyChange = function () {
      var ids = $scope.pageModel.list.reduce(function (ret, n) {
        n.checked && ret.push(n.id);
        return ret
      }, []);
      if (ids.length == 0) {
        alert("请选择要发送的收房提醒！");
        return;
      }
      dodel(ids.join());
    };
    $scope.del = function (item) {
      dodel(item.id);
    };
    function dodel (ids) {
      confirm("确认发送收房提醒吗?", function () {
        console.log(ids)
        $http.get("/ovu-park/backstage/parkHouseStatus/status?rmStatus=3&ids=" + ids).success(function (res) {
          console.log(res)
          if (res.code == 0) {
            window.msg("完成");
            $scope.find();
          } else {
            window.msg("修改失败");
          }
        })
      })
    }


    $scope.spacePropertyList = [];
    $scope.initSpace = function () {
      $http.get("/ovu-base/system/parkHouse/getSpacePropertyType").then(function (response) {
        console.log(response)
        if (response.status == 200) {
          $scope.spaceRentList = response.data;
          $scope.spaceRentListCopy = angular.copy($scope.spaceRentList);
          $scope.spaceRentListCopy.forEach((v, i) => {
            if (v.code == 1) {
              $scope.planPurposeList = v.nodes;
              angular.forEach(v.nodes, function (item) {
                angular.forEach(item.nodes, function (item1) {
                  $scope.spacePropertyList.push(item1);
                })
              })
            }
          })
          $scope.planPurposeListCopy = angular.copy($scope.planPurposeList);
        }
      })
    }
    $scope.initSpace();

    // 选择户规划用途
    $scope.planPurposeChange = function (params) {
      console.log(params);
      if (params) {
        $scope.planPurposeListCopy.forEach((v, i) => {
          if (v.code == params) {
            $scope.propertyClassifyList = v.nodes;
          }
        })
      } else {
        $scope.propertyClassifyList = [];
      }
    }


    //全选
    $scope.checkAll = function () {
      $scope.pageModel.checked = !$scope.pageModel.checked;
      if ($scope.pageModel.checked) {
        $scope.pageModel.list.forEach(function (n) {
          n.checked = $scope.pageModel.checked
          $scope.selCountMoney += n.contractAmount;
        });
        $scope.selCount = $scope.pageModel.list.length;

      } else {
        $scope.pageModel.list.forEach(function (n) {
          n.checked = $scope.pageModel.checked

        });
        $scope.selCountMoney = 0
        $scope.selCount = 0;
      }

    }
    //单选
    $scope.checkOne = function (item) {
      item.checked = !item.checked;
      if ($scope.pageModel && $scope.pageModel.list) {
        $scope.pageModel.checked = $scope.pageModel.list.every(function (v) {
          return v.checked;
        });
      }
      if (item.checked) {
        $scope.selCountMoney += item.contractAmount;
        $scope.selCount++;
      } else {
        $scope.selCountMoney -= item.contractAmount;
        $scope.selCount--;
      }
    }


    //获取物业名称
    $scope.getSpacePropertyName = function (params) {
      let name;
      $scope.spacePropertyList.forEach((v, i) => {
        if (v.dicCode == params) {
          name = v.dicItem;
        }
      })
      return name;
    }

    //选择分期
    $scope.changeStage = function (STAGE) {
      if (null == STAGE) {
        delete $scope.floorList;
        delete $scope.unitList;
        delete $scope.groundList;
        delete $scope.search.stageId;
      } else {
        $scope.search.stageId = STAGE.id;
        loadFloorListByStageId(STAGE.id); //获得楼栋
      }
      $scope.find();

    }
    //选择楼栋
    $scope.changeBuild = function (BUILD) {
      if (null == BUILD) {
        delete $scope.unitList;
        delete $scope.groundList;
        delete $scope.search.buildId;
      } else {
        $scope.search.buildId = BUILD.id;
        loadUnitListByBuildId(BUILD.id) //获得单元
      }
      $scope.find();

    }
    //选择单元
    $scope.changeUnit = function (BUILD, unit) {
      if (null == unit) {
        delete $scope.groundList;
        delete $scope.search.unitId;
      } else {
        $scope.search.unitNo = unit;
        loadGroundListByFloorId(BUILD.id, unit); //获得楼层
      }
      $scope.find();

    }
    //选择楼层
    $scope.changeGround = function (GROUND_NUM) {
      $scope.search.groundNo = GROUND_NUM;

      $scope.find();
    }





    //获取分期
    function loadStageListByParkId (parkId) {
      $scope.stageList = [];
      $http.post("/ovu-base/system/park/stageList.do", {
        parkId: parkId
      }, fac.postConfig).success(function (data) {
        $scope.stageList = data.data;
      });
    }

    //获取楼栋
    function loadFloorListByStageId (stageId) {
      $scope.buildList = [];
      $http.post("/ovu-base/system/parkBuild/getBuilds.do", {
        stageId: stageId
      }, fac.postConfig).success(function (data) {
        $scope.buildList = data;
      });
    }

    //获取单元
    function loadUnitListByBuildId (buildId) {
      $scope.unitList = [];
      $http.post("/ovu-base/system/parkHouse/listUnitNo_mute.do", {
        buildId: buildId
      }, fac.postConfig).success(function (data) {
        $scope.unitList = data.data;
      });
    }

    //获取楼层
    function loadGroundListByFloorId (buildId, unit) {
      $scope.groundList = [];
      $http.post("/ovu-base/system/parkHouse/listGroundNo_mute.do", {
        buildId: buildId,
        unitNo: unit
      }, fac.postConfig).success(function (data) {
        $scope.groundList = data.data;
      });
    }

    app.modulePromiss.then(function () {
      fac.loadSelect($scope, "HOUSE_TYPE");
      fac.initPage($scope, function () {
        loadStageListByParkId(app.park.parkId);
        $scope.find(1);
      })
    });
  });

  //定义
  app.controller('addOrEditPriceCtrl', function ($scope, $http, $uibModalInstance, $filter, fac, param) {
    $scope.sellOptions = [{
      'name': '租赁',
      'value': 1
    }, {
      'name': '招商',
      'value': 2
    }, {
      'name': '租售',
      'value': 3
    }];
    $scope.addorview = param.type;
    $scope.savePrice = function (form, item) {
      form.$setSubmitted(true);
      if (!form.$valid) {
        return;
      }

      // var obj = {
      //     "id": item.id,
      //     "sellStatus": item.sellStatus
      // };

      $.post("/ovu-base/system/parkHouse/updateSellStatus", obj, function (data) {
        if (data.code == 0) {
          window.msg(data.msg);
          $uibModalInstance.close();
        } else {
          alert(data.msg);
        }
      });
    }

    $scope.cancel = function () {
      $uibModalInstance.dismiss('cancel');
    };

    $scope.item = param.house;
  });

  //批量重定义
  app.controller('batchEditPriceCtrl', function ($scope, $http, $uibModalInstance, $filter, fac, param) {
    console.log('param', param)
    $scope.item = {};
    $scope.sellOptions = [{
      'name': '租赁',
      'value': 1
    }, {
      'name': '招商',
      'value': 2
    }, {
      'name': '租售',
      'value': 3
    }];

    $scope.savePrice = function (form, item) {
      confirm("确认定义此策略吗?", function () {
        form.$setSubmitted(true);
        if (!form.$valid) {
          return;
        }
        var obj = {
          "houseIds": param.ids,
          "sellStatus": item.sellStatus
        };

        $.post("/ovu-base/system/parkHouse/updateSellStatusBath", obj, function (data) {
          if (data.code == 0) {
            window.msg(data.msg);
            $uibModalInstance.close();
          } else {
            alert(data.msg);
          }
        });
      })
    }

    $scope.cancel = function () {
      $uibModalInstance.dismiss('cancel');
    };
  });



  app.filter("rmCatType1", function () {
    return function (status) {
      switch (status) {
        case 'FW10':
          return '设备房';
          break;
        case 'FW11':
          return '办公用房';
          break;
        case 'FW12':
          return '住宅用房';
          break;
        case 'FW13':
          return '公共用房';
          break;
        case 'FW14':
          return '厨房酒店用房';
          break;
        case 'FW15':
          return '艺术类用房';
          break;
        case 'FW16':
          return '商业用房';
          break;
        case 'FW17':
          return '工厂用房';
          break;
        case 'FW18':
          return '公共区域';
          break;
      }
    }
  })

  app.filter("housePlanPurposesType1", function () {
    return function (status) {
      switch (status) {
        case 1:
          return '办公用途';
          break;
        case 2:
          return '商业用途';
          break;
        case 3:
          return '其他用途';
          break;
        case 4:
          return '工业用途';
          break;
        case 5:
          return '停车位用途';
          break;
      }
    }
  })

  app.filter("spaceType1", function () {
    return function (status) {
      switch (status) {
        case 1:
          return '自持';
          break;
        case 2:
          return '已租';
          break;
        case 3:
          return '已售';
          break;
      }
    }
  })

  app.filter("spaceSellType", function () {
    return function (status) {
      switch (status) {
        case 1:
          return '租赁';
          break;
        case 2:
          return '招商';
          break;
        case 3:
          return '租售';
          break;
      }
    }
  })

})()
