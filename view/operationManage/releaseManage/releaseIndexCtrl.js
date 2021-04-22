(function () {
  var app = angular.module("angularApp");
  app.service('AppService', function ($http, fac) {
    var that = this;
    this.park = {
      parkNo: '',
      parkName: ''
    };
    //项目编号
    this.parkNo = '';
    this.onlyIndoorMap = true;
  });
  /* 会议室制器 */
  app.controller('meetingRoomCtl', function ($scope, $rootScope, $http, $filter, $uibModal, fac) {
    document.title = "OVU-发布管理";
    angular.extend($rootScope, fac.dicts);
    $scope.search = {
      userType: "0",
    };
    $scope.pageModel = {};
    // $scope.stageMap = {};
    // $scope.floorMap = {};
    // 发布时间
    $scope.timeFlag = [{
      text: "全部",
      value: 0
    },
    {
      text: "一个月内",
      value: 1
    },
    {
      text: "三个月内",
      value: 2
    },
    {
      text: "六个月内",
      value: 3
    },
    {
      text: "一年内",
      value: 4
    }
    ]
    // 发布状态 - 用户
    $scope.status = [{
      text: "待审核",
      value: 0
    },
    {
      text: "已通过",
      value: 1
    },
    {
      text: "已拒绝",
      value: 2
    },
    {
      text: "已撤销",
      value: 3
    },
    ]
    // 发布状态  -  运营方
    $scope.status2 = [{
      text: "已发布",
      value: 1
    },
    {
      text: "已撤销",
      value: 3
    }
    ]
    $scope.changeSearchStatus = function () {
      $scope.search.status = '';
      $scope.query();
    }
    // 查询列表
    $scope.find = function (pageNo) {
      if ($scope.pageModel.currentPage) {
        delete $scope.pageModel.currentPage;
      }
      $.extend($scope.search, {
        currentPage: pageNo || $scope.pageModel.currentPage || 1,
        pageSize: $scope.pageModel.pageSize || 10
      });
      $scope.search.pageIndex = $scope.search.currentPage - 1;
      $scope.search.totalCount = $scope.pageModel.totalCount || 0;
      fac.getPageResult("/ovu-park/backstage/operate/office/list", $scope.search, function (data) {
        $scope.pageModel = data;
      });

      fac.getPageResult("/ovu-park/backstage/operate/office/spaceList", $scope.search, function (data) {
        $scope.houseMap = data.houseMap;
        console.log("$scope.houseMap", $scope.houseMap)
      });
    };
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
    //查看会议室预定列表
    $scope.showMeetingRoomList = function (x) {
      var modal = $uibModal.open({
        animation: true,
        size: 'xl',
        templateUrl: '/view/operationManage/bookingManage/modal.bookingMeetingList.html',
        controller: 'bookingMettingListCtrl',
        resolve: {
          param: x
        }
      });
      modal.result.then(function () {
        if ($scope.pageModel.data.length == 1 && $scope.pageModel.currentPage > 1) {
          $scope.pageModel.currentPage = $scope.pageModel.currentPage - 1;
        }
        $scope.find(1);
      }, function () {
        console.info('Modal dismissed at: ' + new Date());
      });
    }
    // 设备 过滤
    $scope.getEqTypeName = function (param) {
      $scope.typeNames = [];
      $scope.typeList = [];
      if (param) {
        var typeLists = param.split(",");
        $scope.typeList = angular.copy(typeLists);
        for (var i = 0; i < $scope.typeList.length; i++) {
          var type = $scope.typeList[i];
          $scope.type = $scope.trimStr(type);
          if (1 == new Number($scope.type)) {
            $scope.typeNames.push("投影设备");
          } else if (2 == new Number($scope.type)) {
            $scope.typeNames.push("音响话筒");
          } else if (3 == new Number($scope.type)) {
            $scope.typeNames.push("视频终端");
          }
        }
      }
      return $scope.typeNames.join(",");
    }
    // 撤销撤销
    $scope.revokeOffice = function (x) {
      if (x.status == 1) {
        confirm("确认撤销吗?", function () {
          fac.getResult("/ovu-park/backstage/operate/office/revokeOffice", {
            id: x.id,
            status: 3
          }, function () {
            window.msg("撤销成功");
            $scope.find();
          });
        })
      } else {
        return false;
      }
    }
    //删除
    $scope.del = function (x) {
      if (x.status == 3) {
        confirm("确定删除？", function () {
          fac.getResult("/ovu-park/backstage/operate/office/remove", {
            ids: x.id
          }, function (resp) {

            window.msg("删除成功!");
            $scope.find();

          });
        })
      } else {
        return false;
      }


    }
    app.modulePromiss.then(function () {
      fac.initPage($scope, function () {
        $scope.find(1);
      })
    });
    $scope.query = function () {
      fac.initPage($scope, function () {
        $scope.find(1);
      })
    }
    // 去除空格
    $scope.trimStr = function (str) {
      return str.replace(/(^\s*)|(\s*$)/g, "");
    }
    //新增 、 编辑
    $scope.showEditModal = function (office) {

      var temp = $scope.houseMap;
      if (office && office.status != 3) {
        return false
      };
      if (!fac.checkPark($scope)) {
        return
      }
      office = office || {
        // creatorName: app.user.loginName,
        creatorId: app.user.id
      };
      office.parkId = app.park.parkId;
      office.updatorId = app.user.id;
      var copy = angular.extend({}, office);
      if (fac.isNotEmpty($scope.houseMap)) {
        copy.houseObj = $scope.houseMap[office.houseId];
      }
      var modal = $uibModal.open({
        animation: true,
        size: 'md',
        templateUrl: '/view/operationManage/releaseManage/modal.addMeetingRoom.html',
        controller: 'addMeetingRoomCtrl',
        resolve: {
          office: copy
        }
      });
      modal.result.then(function () {
        if ($scope.pageModel.data.length == 1 && $scope.pageModel.currentPage > 1) {
          $scope.pageModel.currentPage = $scope.pageModel.currentPage - 1;
        }
        $scope.find(1);
      }, function () {
        console.info('Modal dismissed at: ' + new Date());
      });
    }





    $scope.currentNum = 1;
    $scope.setCurrentNum = function (num) {
      $scope.currentNum = num;
      $scope.search = {};
      delete $scope.pageModel.currentPage;
      if (num == 1) {
        $scope.search.status = null;
        $scope.find();
      }
      if (num >= 2) {
        $scope.search.status = num - 2;
        $scope.find();
      }
    }
    //修改状态
    $scope.changeStatus = function (office, status) {
      fac.getResult("/ovu-park/backstage/operate/office/updateStatus", {
        id: office.id,
        status: status
      }, function (resp) {
        window.msg("操作成功!");
        $scope.find();
      });
    };
    // 确定 审核通过
    $scope.check = function (x) {
      if (x.status == 0) {
        confirm("确定审核通过", function () {
          $scope.changeStatus(x, 1);
        })
      }
      /*else if(x.status==3){
                    confirm("确定同意撤销",function(){
                          $scope.changeStatus(x,3);
                      })
                  }*/
      else {
        return false
      }

    }
    // 拒绝 审核拒绝
    $scope.reject = function (x) {
      if (x.status == 0) {
        var copy = angular.extend({}, x);
        var modalInstance = $uibModal.open({
          size: 'md',
          animation: true,
          templateUrl: '/view/operationManage/releaseManage/modal.reject.html',
          controller: 'addAdsenseCtrl',
          resolve: {
            office: copy
          }
        });
        modalInstance.result.then(function () {
          $scope.find();
        }, function () {
          $scope.find();
        });
      } else {
        return false
      }

    }

    // 查看图片
    $scope.showPhotoEditModal = function (office) {
      var copy = angular.extend({}, office);
      var modalInstance = $uibModal.open({
        size: 'md',
        animation: true,
        templateUrl: '/view/operationManage/releaseManage/modal.showPhoto.html',
        controller: 'showOfficePhotoCtrl',
        resolve: {
          office: copy
        }
      });
    }


  });

  // 查看图片
  app.controller('showOfficePhotoCtrl', function ($scope, $http, $uibModalInstance, fac, office) {
    $scope.carouselPhotos = [];
    if (office.photos) {
      $scope.carouselPhotos = office.photos.split(",");
    }
    $scope.cancel = function () {
      $uibModalInstance.dismiss('cancel');
    };
  });


  // 会议室审核拒绝
  app.controller('addAdsenseCtrl', function ($scope, $http, $uibModalInstance, fac, office) {
    $scope.auditOpinion = "";
    // $scope.saveReject = function () {
    //     $uibModalInstance.dismiss('cancel');
    // }
    $scope.cancel = function () {
      $uibModalInstance.dismiss('cancel');
    }
    $scope.saveReject = function () {
      if (!$scope.auditOpinion) {
        alert("请填写拒绝原因!")
        return
      }
      $http.post("/ovu-park/backstage/operate/office/updateStatus", {
        id: office.id,
        status: 2,
        approvtOpinion: $scope.auditOpinion
      }, fac.postConfig).success(function (resp) {
        if (resp.code == 0) {
          $uibModalInstance.dismiss('cancel');
          window.msg("操作成功!");
        } else {
          $uibModalInstance.dismiss('cancel');
          window.alert("操作失败");
        }
      });
    }
  });

  /* 添加会议室控制器 */
  app.controller('addMeetingRoomCtrl', function ($scope, $rootScope, $http, $uibModalInstance, $filter, fac, office, $uibModal) {
    $scope.item = office;
    if (fac.isNotEmpty($scope.item.houseObj)) {
      $scope.item.stageId = $scope.item.houseObj.stageId;
      $scope.item.buildId = $scope.item.houseObj.buildId;
      $scope.item.unitNo = $scope.item.houseObj.unitNo;
      $scope.item.groundNo = $scope.item.houseObj.groundNo;
      $scope.item.houseId = $scope.item.houseObj.id;
    }
    $scope.item.pics = $scope.item.photos ? $scope.item.photos.split(",") : [];
    $scope.search = {};
    $scope.pubulishedMsg = '';
    var getStageList = function () {
      $http.post("/ovu-base/system/park/stageList", {
        parkId: app.park.parkId
      }, fac.postConfig).success(function (resp) {
        if (resp.code == 0) {
          $scope.stageList = resp.data;
        }
      });
    }
    var getBuildList = function () {
      var params = {
        'stageId': $scope.item.houseObj.stageId
      }
      $http.post("/ovu-base/system/parkBuild/getBuilds", params, fac.postConfig).success(function (data) {
        $scope.buildList = data;
      });
    }
    var getUnitList = function () {
      var params = {
        'buildId': $scope.item.houseObj.buildId
      };
      $http.post("/ovu-base/system/parkHouse/listUnitNo_mute", params, fac.postConfig).success(function (resp) {
        $scope.unitList = resp.data;
      });
    }
    var getFloorList = function () {
      var params = {
        "buildId": $scope.item.houseObj.buildId,
        "unitNo": $scope.item.houseObj.unitNo
      }
      $http.post("/ovu-base/system/parkHouse/listGroundNo_mute", params, fac.postConfig).success(function (resp) {
        if (resp.code == 0) {
          $scope.floorList = resp.data;
        }
      });
    }
    var getHouseList = function () {
      var params = {
        "buildId": $scope.item.houseObj.buildId,
        "unitNo": $scope.item.houseObj.unitNo,
        'groundNo': $scope.item.houseObj.groundNo,
        "rmCats": "FW11,FW12,FW16",
        "isSperated": 0
      }
      $http.post("/ovu-base/system/parkHouse/queryHouseListSelective", params, fac.postConfig).success(function (resp) {
        if (resp.code == 0) {
          $scope.tempHouseList = resp.data;
          $scope.houseList = [];
          angular.forEach($scope.tempHouseList, function (houseObj) {
            if (houseObj.spaceStatus == '1') {
              $scope.houseList.push(houseObj);
            }
          });
        }
      });
    }
    //根据parkId获得分期列表
    $scope.loadStage = function () {
      $http.post("/ovu-base/system/park/stageList", {
        parkId: app.park.parkId
      }, fac.postConfig).success(function (resp) {
        if (resp.code == 0) {
          $scope.stageList = resp.data;
          $scope.buildList = [];
          $scope.unitList = [];
          $scope.floorList = [];
          $scope.houseList = [];
        }
      });
    }
    //根据stageId获得楼栋信息
    $scope.selectStage = function () {
      var params = {
        'stageId': $scope.item.stageId
      }
      $http.post("/ovu-base/system/parkBuild/getBuilds", params, fac.postConfig).success(function (data) {
        $scope.buildList = data;
        $scope.unitList = [];
        $scope.floorList = [];
        $scope.houseList = [];
        $scope.item.buildId = '';
        $scope.item.unitNo = '';
        $scope.item.groundNo = '';
        $scope.item.houseId = '';
      });
    }


    //根据buildId获得单元信息
    $scope.selectBuild = function () {
      var params = {
        'buildId': $scope.item.buildId
      };
      $http.post("/ovu-base/system/parkHouse/listUnitNo_mute", params, fac.postConfig).success(function (resp) {
        $scope.unitList = resp.data;
        $scope.floorList = [];
        $scope.houseList = [];
        $scope.item.unitNo = '';
        $scope.item.groundNo = '';
        $scope.item.houseId = '';
      });
    }

    //根据buildId,unitId获取楼层信息
    $scope.selectUnit = function () {
      var params = {
        "buildId": $scope.item.buildId,
        "unitNo": $scope.item.unitNum
      }
      $http.post("/ovu-base/system/parkHouse/listGroundNo_mute", params, fac.postConfig).success(function (resp) {
        if (resp.code == 0) {
          $scope.floorList = resp.data;
          $scope.houseList = [];
          $scope.item.groundNo = '';
          $scope.item.houseId = '';
        }
      });
    }
    //根据buildId,unitNo,groundNo获取楼层信息
    $scope.selectGround = function () {
      $scope.houseList = [];
      var params = {
        "buildId": $scope.item.buildId,
        "unitNo": $scope.item.unitNo,
        'groundNo': $scope.item.groundNo,
        "rmCats": "FW11,FW12,FW16",
        "isSperated": 0
      }
      $http.post("/ovu-base/system/parkHouse/queryHouseListSelective", params, fac.postConfig).success(function (resp) {
        if (resp.code == 0) {
          $scope.tempHouseList = resp.data;
          angular.forEach($scope.tempHouseList, function (houseObj) {
            if (houseObj.spaceStatus == '1') {
              $scope.houseList.push(houseObj);
            }
          });
          $scope.item.houseId = '';
        }
      });
    }
    $scope.moneyChange = function (money) {
      if (!money && money != 0) {
        return;
      }
      if (money == 0) {
        $scope.item.singlePrice = money;
        return;
      }
      let curValue = money;
      if (!(/^\d+(\.\d+)?$/.test(curValue))) {
        window.alert("单价不能为负值!");
        $scope.item.singlePrice = '';
        return;
      }
      let decimal = curValue.split(".")[1]
      if (decimal && decimal.length > 2) {
        curValue = Number(curValue);
        curValue = curValue.toFixed(2);
        $scope.item.singlePrice = curValue;
      }
    }
    //如果有stageId，表示是编辑页面，没有为新增页面
    if (fac.isEmpty($scope.item.stageId)) {
      $scope.loadStage();
    } else {
      getStageList();
      getBuildList();
      getUnitList();
      getFloorList();
      getHouseList();
    }
    //查询房间是否 已经被发布
    var queryHouseStatus = function (id) {
      if (!fac.isEmpty(id)) {
        $http.post("/ovu-park/backstage/operate/office/hadPublish", {
          houseId: id,
        }, fac.postConfig).success(function (data) {
          if (data.code == 0) {
            $scope.pubulishedMsg = data.message;
            $scope.item.area = data.data.area;
          } else {
            $scope.pubulishedMsg = '';
          }
        });
      } else {
        $scope.pubulishedMsg = '';
      }
    }
    $scope.queryIsPublished = function (houseId) {
      queryHouseStatus(houseId);
    }
    /* 复选框 */
    $scope.tagcategories = [{
      id: 1,
      name: '投影设备'
    },
    {
      id: 2,
      name: '音响/话筒'
    },
    {
      id: 3,
      name: '视频终端'
    },
    ];
    $scope.selected = [];
    $scope.selectedTags = [];
    //判断复选框是否被选中
    $scope.isSelected = function (id) {
      var index = $scope.findCheckBoxIndex(id);
      if (index != -1) {
        return true;
      } else {
        return false;
      }
      getDevice();
    }
    //判断该下标是否被选中，回显选中设备
    $scope.findCheckBoxIndex = function (param) {
      var xiabiao = -1;
      if (office.deviceType) {
        $scope.selected = office.deviceType.split(',');
      }
      angular.forEach($scope.selected, function (select, index) {
        if (param == select) {
          xiabiao = index;
          return;
        }
      });
      return xiabiao;
    }

    //复选框选中与反选赋值
    var updateSelected = function (action, id, name) {
      var id = id.toString();
      if (action == 'add' && $scope.selected.indexOf(id) == -1) {
        $scope.selected.push(id);
        $scope.selectedTags.push(name);
      }
      if (action == 'remove' && $scope.selected.indexOf(id) != -1) {
        var idx = $scope.selected.indexOf(id);
        $scope.selected.splice(idx, 1);
        $scope.selectedTags.splice(idx, 1);
      }
      console.info($scope.selected);
    }

    //点击复选框选中与反选
    $scope.updateSelection = function ($event, id) {
      var checkbox = $event.target;
      var action = (checkbox.checked ? 'add' : 'remove');
      updateSelected(action, id, checkbox.name);
      getDevice();
    }

    //给设备类型添加参数
    function getDevice () {
      $scope.item.deviceType = $scope.selected.join(",");
    }

    $scope.saveMeetingRoom = function (form, item) {
      form.$setSubmitted(true);
      if (!form.$valid) {
        return;
      }
      if (item.pics.length == 0) {
        window.msg("必须至少上传1张图片, 请上传图片!")
        return false;
      }
      if (item.pics.length > 5) {
        window.msg("最多只能上传5张图片, 请删除多余的图片!")
        return false;
      }
      if ($scope.item.area == null || $scope.item.area == 0) {
        window.alert("该空间面积未维护无法发布，请联系系统管理员!");
        return;
      }
      item.photos = item.pics.join(",");
      var params = angular.copy($scope.item);
      params.parkId = app.park.parkId;
      params.houseId = $scope.item.houseId;
      params.groundNumber = $scope.item.groundNo;
      params.buildId = $scope.item.buildId;
      params.stateId = $scope.item.stageId;
      // params.creatorName = app.park.deptName;
      params.contactManId = $scope.item.parkUserId;
      params.creatorName = $scope.item.nickName;
      params.creatorPhone = $scope.item.phone;

      delete params.houseObj;
      $http.post("/ovu-park/backstage/operate/office/saveOrEdit", params, fac.postConfig).success(function (resp) {
        if (resp.code == 0) {
          window.msg("操作成功!");
          $uibModalInstance.close();
        } else {
          alert(resp.message);
        }
      });
      
    }

    //添加联系人

    $scope.phonePeople = function (w) {
      var params = {
        parkId: app.park.parkId,
        currentPage: 1,
        pageSize: 10,
        pageIndex: 0,
        userType: "3",
      };
      fac.getPageResult("/ovu-base/ovupark/backstage/customer/getListByIdsNew", params, function (resp) {
        for (var i = 0; i < resp.data.length; i++) {
          if ($scope.item.parkUserId && $scope.item.parkUserId.indexOf(resp.data[i].id) != -1) {
            resp.data[i].disabled = true;
          } else {
            resp.data[i].disabled = false;
          }
        }
        // console.log('nickName', $scope.item)
        if ($scope.item.nickName) {
          var nickName = $scope.item.nickName.split(",")
          var phone = $scope.item.phone.split(",")
          var parkUserIds = $scope.item.parkUserId.split(',')

          var customers = nickName.map((e, i) => {
            return {
              id: parkUserIds[i],
              nickname: e,
              phone: phone[i]
            }
          })
        }




        //选择联系人
        var modal = $uibModal.open({
          animation: false,
          size: 'lg',
          templateUrl: '/view/operationManage/releaseManage/modal.chooseCompany.html',
          controller: 'chooseCompanyCtrl',
          resolve: { chooseCompany: { pages: resp, customers: customers } }
        });
        //执行成功后操作的方法（模态框关闭执行函数）
        modal.result.then(function (r) {
          $scope.item.nickName = r.pNames;    //已添加回显
          $scope.item.phone = r.phone;
          $scope.item.parkUserId = r.pIds;
          $scope.item.customers = r.tempAddedCustomers;
          $scope.item.creatorName = r.pNames
          $scope.item.creatorPhone = r.phone
          console.log('$scope.item', $scope.item)
          $(".chooseCompanyPanle input").val(r.pNames);   //写入联系人姓名
          $(".chooseCompanyPanleone input").val(r.phone);   //写入联系人电话
          $scope.$applyAsync();
        }, function (reason) {
          // $scope.find();
          console.info('Modal chooseCompany dismissed at: ' + new Date());
        });
      });

    };


    $scope.cancel = function () {
      $uibModalInstance.dismiss('cancel');
    };
  });































  //用户/个人选择器（第二个模态框）
  app.controller('chooseCompanyCtrl', function ($scope, $rootScope, $http, $uibModalInstance, $filter, fac, chooseCompany, $uibModal) {
    angular.extend($rootScope, fac.dicts);
    $scope.pageModel = chooseCompany.pages;
    $scope.item = chooseCompany.item;
    $scope.customers = chooseCompany.customers;

    $scope.search = {
      parkId: app.park.parkId,
      currentPage: 1,
      pageSize: 10,
      pageIndex: 0,
      totalCount: 0,
      // nickname: "",
      userType: "3",
      phone: "",
    }
    $scope.userType = [
      { value: 1, text: "个人用户" },
      { value: 3, text: "员工用户" },
    ]




    $scope.find = function (pageNo) {
      $.extend($scope.search, { currentPage: pageNo || $scope.pageModel.currentPage || 1, pageSize: $scope.pageModel.pageSize || 10 });
      $scope.search.pageIndex = $scope.search.currentPage - 1;
      $scope.search.totalCount = $scope.pageModel.totalCount || 0;
      fac.getPageResult("/ovu-base/ovupark/backstage/customer/getListByIdsNew", $scope.search, function (cInfos) {
        for (var i = 0; i < cInfos.data.length; i++) {
          if ($scope.ids && $scope.ids.indexOf(cInfos.data[i].id) != -1) {
            cInfos.data[i].disabled = true;
          } else {
            cInfos.data[i].disabled = false;
          }
        }
        $scope.pageModel = cInfos;
        $scope.$applyAsync();
      });
    };


    //查询
    $scope.query = function () {
      $scope.pageModel.currentPage = 0;
      $scope.pageModel.pageSize = 10;
      $scope.pageModel.pageIndex = 0;
      $scope.pageModel.totalCount = 0;
      $scope.find();
    }














    $scope.removePersonItem = function (personId, personName) {
      $("#selectTable  #" + personId).html("<span class='glyphicon glyphicon-plus'></span>添加");
      $("#selectTable  #" + personId).removeAttr("disabled");
      $("#selectTable  #" + personId).removeAttr("ng-disabled");
    };

    $scope.initRemove = function (cus) {
      $scope.removePersonItem(cus.id, cus.nickname);
      $("li[personId=" + cus.id + "]", ".ul-persons").remove();
    };




    //选择联系人
    $scope.addPersonItem = function (item, bool) {
      var personId = item.id;

      $scope.personName = item.name || item.loginName;
      $scope.personPhone = item.phone;
      if ($("#selectTable  #" + personId).attr("disabled") || $("#selectTable  #" + personId).attr("ng-disabled") == "true") {
        return false;
      }

      if ($(".ul-persons li").length > 0) {
        alert("只能添加1个联系人")
      } else {
        var li = $("<li ></li>");
        $(li).addClass("item");
        $(li).attr("personId", personId);
        $(li).attr("personName", $scope.personName);
        $(li).attr("phone", $scope.personPhone);
        $(li).text($scope.personName);
        var a = $('<a href="javascript:void(0);"></a>');
        $(a).append("<i class='fa fa-remove'></i>");
        $(li).append(a);
        $(".ul-persons").append(li);
        if (bool) {//添加人员，状态改为已添加
          $("#selectTable  #" + personId).html("<span class='glyphicon'></span>已添加");
          $("#selectTable  #" + personId).attr("disabled", "disabled");
        }
      }



      $(a).bind("click", function () {
        $(this).parent().remove();
        $scope.removePersonItem(personId, $scope.personName);
      });

    };


    //用户选择器确定按钮
    $scope.checkPerson = function () {
      var checkedP = $(".ul-persons .item");
      if (checkedP.length <= 0) {
        window.alert("请至少添加一个用户!");
        return false;
      }
      var pIds = "", pNames = "", phone = ""
      var tempAddedCustomers = [];
      checkedP.each(function (index) {
        pIds += $(this).attr("personId");
        pNames += $(this).attr("personName");
        phone += $(this).attr("phone");
        tempAddedCustomers.push({ 'id': $(this).attr("personId"), 'personName': $(this).attr("personName") });
        if (index < checkedP.length - 1) {
          pIds += ",";
          pNames += ",";
          phone += ","
        }
      });
      //关闭模态框传递结果（上面的r接收）
      $uibModalInstance.close({ pIds: pIds, pNames: pNames, phone: phone, tempAddedCustomers: tempAddedCustomers });
    };

    $scope.cancel = function () {
      $uibModalInstance.dismiss('cancel');
    };

  });



  /* 场地控制器 */
  app.controller('positionCtl', function ($scope, $rootScope, $http, $filter, $uibModal, fac) {
    angular.extend($rootScope, fac.dicts);
    $scope.search = {
      userType: "0",
    };
    $scope.pageModel = {};
    // 发布时间
    $scope.timeFlag = [{
      text: "全部",
      value: 0
    },
    {
      text: "一个月内",
      value: 1
    },
    {
      text: "三个月内",
      value: 2
    },
    {
      text: "六个月内",
      value: 3
    },
    {
      text: "一年内",
      value: 4
    }
    ]
    // 发布状态
    $scope.status = [{
      text: "待审核",
      value: 0
    },
    {
      text: "已通过",
      value: 1
    },
    {
      text: "已拒绝",
      value: 2
    },
    {
      text: "已撤销",
      value: 3
    }
    ]
    $scope.status2 = [{
      text: "已发布",
      value: 1
    },
    {
      text: "已撤销",
      value: 3
    }
    ];
    $scope.changeSearchStatus = function () {
      $scope.search.status = '';
      $scope.query();
    }
    // 查询
    $scope.find = function (pageNo) {
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
      });
    };
    app.modulePromiss.then(function () {
      fac.initPage($scope, function () {
        $scope.find(1);
      })
    });
    $scope.query = function () {
      fac.initPage($scope, function () {
        $scope.find(1);
      })
    }
    //查看场地预定列表
    $scope.showSpaceList = function (x) {
      var modal = $uibModal.open({
        animation: true,
        size: 'xl',
        templateUrl: '/view/operationManage/bookingManage/modal.bookingSpaceList.html',
        controller: 'bookingSpaceListCtrl',
        resolve: {
          param: x
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
    // 撤销
    $scope.revokeOffice = function (x) {
      if (x.status == 1) {
        confirm("确认撤销吗?", function () {
          fac.getResult("/ovu-park/backstage/operate/yard/revokeYard", {
            id: x.id,
            status: 3
          }, function (resp) {
            window.msg("撤销成功");
            $scope.find();

          });
        })
      } else {
        return false;
      }
    }
    //删除
    $scope.del = function (x) {
      if (x.status == 3) {
        confirm("确定删除？", function () {
          fac.getResult("/ovu-park/backstage/operate/yard/remove", {
            ids: x.id
          }, function (resp) {
            window.msg("删除成功!");
            $scope.find();

          });
        })
      } else {
        return false;
      }


    }

    //修改状态
    $scope.changeStatus = function (yard, status) {
      fac.getResult("/ovu-park/backstage/operate/yard/updateYardType", {
        id: yard.id,
        status: status
      }, function (resp) {
        window.msg("操作成功!");
        $scope.find();

      });
    };

    //新增、编辑
    $scope.showEditModal = function (yard) {
      if (yard && yard.status != 3) {
        return false
      };
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
        size: 'md',
        templateUrl: '/view/operationManage/releaseManage/modal.addYard.html',
        controller: 'addPoritionCtrl',
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
    $scope.currentNum = 1;
    $scope.setCurrentNum = function (num) {
      $scope.currentNum = num;
      $scope.search = {};
      delete $scope.pageModel.currentPage;
      if (num == 1) {
        $scope.search.status = null;
        $scope.find();
      }
      if (num >= 2) {
        $scope.search.status = num - 2;
        $scope.find();
      }
    }
    // 确定 审核通过
    $scope.check = function (x) {
      if (x.status == 0) {
        confirm("确定审核通过", function () {
          $scope.changeStatus(x, 1);
        })
      }
      /*else if(x.status==3){
                    confirm("确定同意撤销",function(){
                          $scope.changeStatus(x,3);
                      })
                  }*/
      else {
        return false
      }

    }
    // 拒绝 审核拒绝
    $scope.reject = function (x) {
      if (x.status == 0) {
        var copy = angular.extend({}, x);
        var modalInstance = $uibModal.open({
          size: 'md',
          animation: true,
          templateUrl: '/view/operationManage/releaseManage/modal.reject.html',
          controller: 'rejectYardCtrl',
          resolve: {
            item: copy
          }
        });
        modalInstance.result.then(function () {

          $scope.find();
        }, function () {
          $scope.find();
        });
      } else {
        return false
      }

    }

    // 查看图片
    $scope.showPhotoEditModal = function (yard) {
      var copy = angular.extend({}, yard);
      var modalInstance = $uibModal.open({
        size: 'md',
        animation: true,
        templateUrl: '/view/operationManage/releaseManage/modal.showPhoto.html',
        controller: 'showYardPhotoCtrl',
        resolve: {
          yard: copy
        }
      });
    }
    //查看位置
    $scope.showPosition = function (positon) {
      var copy = angular.extend({
        unclick: true
      }, positon);

      if (!positon.mapLng) {
        alert('当前场地没有位置信息!')
      } else {
        var modalInstance = $uibModal.open({
          size: 'lg',
          animation: true,
          templateUrl: '/view/operationManage/releaseManage/modal.showPosition.html',
          controller: 'showPositionCtrl',
          resolve: {
            positon: copy
          }
        });
      }

    }
  });

  // 查看图片
  app.controller('showYardPhotoCtrl', function ($scope, $http, $uibModalInstance, fac, yard) {
    $scope.carouselPhotos = [];
    if (yard.photos) {
      $scope.carouselPhotos = yard.photos.split(",");
    }
    $scope.cancel = function () {
      $uibModalInstance.dismiss('cancel');
    };
  });

  /* 添加场地控制器 */
  app.controller('addPoritionCtrl', function ($scope, $http, $uibModalInstance, $filter, fac, yard, $uibModal) {
    $scope.item = yard;
    $scope.item.pics = $scope.item.photos ? $scope.item.photos.split(",") : [];

    $scope.saveYard = function (form, item) {
      form.$setSubmitted(true);
      if (!form.$valid) {
        return;
      }
      // if (fac.isEmpty(item.mapLat)) {
      //     alert("请选择场地位置！")
      //     return false;
      // }
      if (fac.isEmpty(item.useFor)) {
        alert("必须选会场功能！");
        return false;
      }

      if (item.pics.length == 0) {
        alert("必须至少上传1张图片, 请上传图片!")
        return false;
      }

      if (item.pics.length > 5) {
        alert("最多只能上传5张图片, 请删除多余的图片!")
        return false;
      }
      item.photos = item.pics.join(",");
      $http.post("/ovu-park/backstage/operate/yard/saveOrEdit", $scope.item, fac.postConfig).success(function (resp) {
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
        templateUrl: '/view/operationManage/releaseManage/modal.showPosition.html',
        controller: 'SpaceSetMapCtrl',
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
  // 场地审核拒绝
  app.controller('rejectYardCtrl', function ($scope, $http, $uibModalInstance, fac, item) {
    $scope.auditOpinion = "";
    // $scope.saveReject = function () {
    //     $uibModalInstance.dismiss('cancel');
    // }
    $scope.cancel = function () {
      $uibModalInstance.dismiss('cancel');
    }
    $scope.saveReject = function () {
      if (!$scope.auditOpinion) {
        alert("请填写拒绝原因!")
        return
      }
      $http.post("/ovu-park/backstage/operate/yard/updateYardType", {
        id: item.id,
        status: 2,
        auditOpinion: $scope.auditOpinion
      }, fac.postConfig).success(function (resp) {
        if (resp.code == 0) {
          $uibModalInstance.dismiss('cancel');
          window.msg("操作成功!");
        } else {
          $uibModalInstance.dismiss('cancel');
          window.alert("操作失败");
        }
      });
    }
  });


  /*广告位控制器 */
  app.controller('adsenseCtl', function ($scope, $rootScope, $http, $filter, $uibModal, fac) {
    angular.extend($rootScope, fac.dicts);
    $scope.search = {
      userType: "0",
    };
    $scope.pageModel = {};
    // 发布时间
    $scope.timeFlag = [{
      text: "全部",
      value: 0
    },
    {
      text: "一个月内",
      value: 1
    },
    {
      text: "三个月内",
      value: 2
    },
    {
      text: "六个月内",
      value: 3
    },
    {
      text: "一年内",
      value: 4
    }
    ]
    // 发布状态
    $scope.status = [{
      text: "待审核",
      value: 0
    },
    {
      text: "已通过",
      value: 1
    },
    {
      text: "已拒绝",
      value: 2
    },
    {
      text: "已撤销",
      value: 3
    }
    ];
    $scope.status2 = [{
      text: "已发布",
      value: 1
    },
    {
      text: "已撤销",
      value: 3
    }
    ];
    $scope.changeSearchStatus = function () {
      $scope.search.status = '';
      $scope.query();
    }
    $scope.find = function (pageNo) {
      if ($scope.pageModel.currentPage) {
        delete $scope.pageModel.currentPage;
      }
      $.extend($scope.search, {
        currentPage: pageNo || $scope.pageModel.currentPage || 1,
        pageSize: $scope.pageModel.pageSize || 10
      });
      $scope.search.pageIndex = $scope.search.currentPage - 1;
      $scope.search.totalCount = $scope.pageModel.totalCount || 0;
      fac.getPageResult("/ovu-park/backstage/operate/advertisement/list", $scope.search, function (data) {
        $scope.pageModel = data;
      });
    };
    app.modulePromiss.then(function () {
      fac.initPage($scope, function () {
        $scope.find(1);
      })
    });
    $scope.query = function () {
      fac.initPage($scope, function () {
        $scope.find(1);
      })
    }

    //查看广告位预定列表
    $scope.showAdvList = function (x) {
      var modal = $uibModal.open({
        animation: true,
        size: 'xl',
        templateUrl: '/view/operationManage/bookingManage/modal.bookingAdvList.html',
        controller: 'bookingAdvListCtrl',
        resolve: {
          param: x
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
    // 撤销撤销
    $scope.revokeOffice = function (x) {
      if (x.status == 1) {
        confirm("确认撤销吗?", function () {
          fac.getResult("/ovu-park/backstage/operate/advertisement/revokeActivity", {
            id: x.id,
            status: 3
          }, function () {
            window.msg("撤销成功");
            $scope.find();
          });
        })
      } else {
        return false;
      }
    }
    //删除
    $scope.del = function (x) {
      if (x.status == 3) {
        confirm("确定删除？", function () {
          $http.post("/ovu-park/backstage/operate/advertisement/remove", {
            ids: x.id
          }, fac.postConfig).success(function (resp) {
            if (resp) {
              window.msg("删除成功!");
              $scope.find();
            }
          });
        })
      } else {
        return false;
      }
    }

    //修改状态
    $scope.changeStatus = function (ad, newStatus) {
      $http.post("/ovu-park/backstage/operate/advertisement/updateActivityType", {
        id: ad.id,
        status: newStatus
      }, fac.postConfig).success(function (resp) {
        if (resp) {
          window.msg("审核操作成功!");
          $scope.find();
        }
      });
    };

    //弹出新增编辑的模态框
    $scope.showEditModal = function (ad) {
      if (ad && ad.status != 3) {
        return false
      };
      if (!fac.checkPark($scope)) {
        return
      }
      ad = ad || {
        creatorName: app.user.loginName,
        creatorId: app.user.id
      };
      ad.parkId = app.park.parkId;
      ad.updatorId = app.user.id;
      var copy = angular.extend({}, ad);
      var modal = $uibModal.open({
        animation: false,
        size: 'md',
        templateUrl: '/view/operationManage/releaseManage/modal.addAdsense.html',
        controller: 'addAdsenseCtl',
        resolve: {
          ad: copy
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
    $scope.currentNum = 1;
    $scope.setCurrentNum = function (num) {
      $scope.currentNum = num;
      $scope.search = {};
      delete $scope.pageModel.currentPage;
      if (num == 1) {
        $scope.search.status = null;
        $scope.find();
      }
      if (num >= 2) {
        $scope.search.status = num - 2;
        $scope.find();
      }
    }
    // 确定 审核通过
    $scope.check = function (x) {
      if (x.status == 0) {
        confirm("确定审核通过", function () {
          $scope.changeStatus(x, 1);
        })
      }
      /*else if(x.status==3){
                    confirm("确定同意撤销",function(){
                          $scope.changeStatus(x,3);
                      })
                  }*/
      else {
        return false
      }

    }
    // 拒绝 审核拒绝
    $scope.reject = function (x) {
      if (x.status == 0) {
        var copy = angular.extend({}, x);
        var modalInstance = $uibModal.open({
          size: 'md',
          animation: true,
          templateUrl: '/view/operationManage/releaseManage/modal.reject.html',
          controller: 'rejectAdCtrl',
          resolve: {
            item: copy
          }
        });
        modalInstance.result.then(function () {

          $scope.find();
        }, function () {
          $scope.find();
          // console.info('Modal dismissed at: ' + new Date());
        });
      } else {
        return false
      }

    }

    // 查看图片
    $scope.showPhotoEditModal = function (ad) {
      var copy = angular.extend({}, ad);
      var modalInstance = $uibModal.open({
        size: 'md',
        animation: true,
        templateUrl: '/view/operationManage/releaseManage/modal.showPhoto.html',
        controller: 'showAdPhotoCtrl',
        resolve: {
          ad: copy
        }
      });
    }
    //查看位置
    $scope.showPosition = function (positon) {
      var copy = angular.extend({
        unclick: true
      }, positon);
      if (!positon.mapLng) {
        alert('当前广告位没有位置信息!')
      }
      var modalInstance = $uibModal.open({
        size: 'lg',
        animation: true,
        templateUrl: '/view/operationManage/releaseManage/modal.showPosition.html',
        controller: 'showPositionCtrl',
        resolve: {
          positon: copy
        }
      });
    }
  });


  /*xxfb控制器 */
  app.controller('infoCtl', function ($scope, $rootScope, $http, $filter, $uibModal, fac) {
    angular.extend($rootScope, fac.dicts);
    var today = $filter('date')(new Date(), 'yyyy-MM-dd')

    $scope.search = {

    };

    $scope.usetime = ''
    $scope.pageModel = {};
    // 发布时间

    // 发布状态
    $scope.status = [{
      text: "待发布",
      value: 1
    },
    {
      text: "已发布",
      value: 2
    },
    ];

    $scope.query = function () {
      if ($scope.usetime) {
        $scope.search.publishEndTime = $scope.usetime.split('-')[1].trim()
        $scope.search.publishStartTime = $scope.usetime.split('-')[0].trim()
      } else {
        delete $scope.search.publishEndTime
        delete $scope.search.publishStartTime
      }

      fac.initPage($scope, function () {
        $scope.find(1);
      })
    }

    $scope.showDetail = function (item) {
      $http.get("/ovu-park/backstage/operate/information/get/" + item.infoId).success(function (resp) {
        if (resp.code == 0) {
          console.log(resp.data)
          var modal = $uibModal.open({
            size: 'lg',
            animation: true,
            templateUrl: '/view/operationManage/releaseManage/modal.infodetail.html',
            controller: 'showInfodetailCtrl',
            resolve: {
              data: resp.data
            }
          });
        }
      });
    }

    $scope.releaseInfo = function (item) {
      $http.get("/ovu-park/backstage/operate/information/publish/" + item.infoId).success(function (resp) {
        if (resp.code == 0) {
          window.msg("操作成功!");
          $scope.find();
        }
      });
    }



    $scope.find = function (pageNo) {
      if ($scope.pageModel.currentPage) {
        delete $scope.pageModel.currentPage;
      }
      $.extend($scope.search, {
        currentPage: pageNo || $scope.pageModel.currentPage || 1,
        pageSize: $scope.pageModel.pageSize || 10
      });
      $scope.search.pageIndex = $scope.search.currentPage - 1;
      $scope.search.totalCount = $scope.pageModel.totalCount || 0;
      fac.getPageResult("/ovu-park/backstage/operate/information/page", $scope.search, function (data) {
        $scope.pageModel = data;
      });
    };
    app.modulePromiss.then(function () {
      fac.initPage($scope, function () {
        $scope.find(1);
      })
    });





  });
  app.controller('showInfodetailCtrl', function ($scope, $http, $uibModalInstance, fac, data) {
    $scope.data = data
    $scope.cancel = function () {
      $uibModalInstance.dismiss('cancel');
    };
  });

  // 查看图片
  app.controller('showAdPhotoCtrl', function ($scope, $http, $uibModalInstance, fac, ad) {
    $scope.carouselPhotos = [];
    if (ad.photos) {
      $scope.carouselPhotos = ad.photos.split(",");
    }
    $scope.cancel = function () {
      $uibModalInstance.dismiss('cancel');
    };
  });


  /* 添加广告位控制器 */
  app.controller('addAdsenseCtl', function ($scope, $rootScope, $http, $uibModalInstance, $filter, fac, ad, $uibModal) {
    $scope.reduceInfoLength = 2000;
    $scope.item = ad;
    $scope.item.pics = $scope.item.photos ? $scope.item.photos.split(",") : [];
    // 控制实收说明字数
    $scope.contentLength = function (content, type) {
      let length = content ? content.length : 0;
      $scope.reduceInfoLength = 2000 - length;
    }

    // 单价限制,大于0的正数,限制最多两位小数
    $scope.limitPrice = function (money, type) {
      if (!money && money != 0) {
        return;
      }
      let curValue = money;
      if (!(/^\d+(\.\d+)?$/.test(curValue))) {
        if (type == 1) {
          alert("发布广告位单价不能为负值!");
          $scope.item.price = '';
        } else if (type == 2) {
          alert("发布广告位订单金额不能为负值!");
          $scope.item.reducedPrice = '';
        }
        return;
      }
      curValue = curValue.toFixed(2);
      curValue = Number(curValue);
      if (type == 1) {
        $scope.item.price = curValue;
      } else if (type == 2) {
        $scope.item.reducedPrice = curValue;
      }
    }
    // $scope.user = $rootScope.user
    $scope.saveAdvertisment = function (form, item) {
      form.$setSubmitted(true);
      if (!form.$valid) {
        return;
      }
      if (fac.isEmpty(item.adType)) {
        alert("请选择广告位类型！")
        return false;
      }
      // if (fac.isEmpty(item.mapLat)) {
      //     alert("请选择广告位位置！")
      //     return false;
      // }
      if (item.pics.length == 0) {
        alert("必须至少上传1张图片, 请上传图片!")
        return false;
      }
      if (item.pics.length > 5) {
        alert("最多只能上传5张图片, 请删除多余的图片！")
        return false;
      }
      item.photos = item.pics.join(",");
      var params = angular.copy($scope.item);
      params.parkId = $scope.dept.parkId;
      console.log("params", params);
      $http.post("/ovu-park/backstage/operate/advertisement/saveOrEdit", params, fac.postConfig).success(function (resp) {
        if (resp.code == 0) {
          window.msg("操作成功!");
          $uibModalInstance.close();
        } else {
          console.log("resp.message", resp.message);
          alert(resp.message);
        }
      });
    }

    $scope.cancel = function () {
      $uibModalInstance.dismiss('cancel');
    };

    //地图模块开始
    var map;
    $scope.setMap = function (item) {
      var copy = angular.extend({}, item);
      var modalInstance = $uibModal.open({
        size: 'lg',
        animation: true,
        templateUrl: '/view/operationManage/releaseManage/modal.showPosition.html',
        controller: 'AdsSetMapCtrl',
        resolve: {
          positon: copy
        }
      });
      modalInstance.result.then(function (data) {
        item.mapLng = data.mapLng
        item.mapLat = data.mapLat
      });
    };


  });

  // 场地审核拒绝
  app.controller('rejectAdCtrl', function ($scope, $http, $uibModalInstance, fac, item) {
    $scope.auditOpinion = "";
    // $scope.saveReject = function () {
    //     $uibModalInstance.dismiss('cancel');
    // }
    $scope.cancel = function () {
      $uibModalInstance.dismiss('cancel');
    }
    $scope.saveReject = function () {
      if (!$scope.auditOpinion) {
        alert("请填写拒绝原因!")
        return
      }
      $http.post("/ovu-park/backstage/operate/advertisement/updateActivityType", {
        id: item.id,
        status: 2,
        auditOpinion: $scope.auditOpinion
      }, fac.postConfig).success(function (resp) {
        if (resp.code == 0) {
          $uibModalInstance.dismiss('cancel');
          window.msg("操作成功!");
        } else {
          $uibModalInstance.dismiss('cancel');
          window.error("操作失败");
        }
      });
    }
  });

  app.controller('bookingMettingListCtrl', function ($scope, $rootScope, $http, $filter, $uibModalInstance, $uibModal, fac, param) {
    $scope.search = {
      timeFlag: "0",
      boardroomId: param.id,
      parkId: param.parkId
    };
    $scope.pageModel = {};
    // 发布时间
    $scope.timeFlag = [{
      text: "全部",
      value: 0
    },
    {
      text: "一周内",
      value: 1
    },
    {
      text: "一个月内",
      value: 2
    },
    {
      text: "三个月内",
      value: 3
    }
    ]
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
    // 会议室位置
    $scope.getPosition = function (houseId) {
      if (fac.isEmpty($scope.houseMap)) {
        return "--"
      } else {
        var houseObj = $scope.houseMap[houseId]
        if (fac.isNotEmpty(houseObj)) {
          return houseObj.stageName + houseObj.buildName + houseObj.unitNum + "单元" + houseObj.groundNum + "层" + houseObj.houseName;
        } else {
          return '--'
        }
      }
    }
    // 查询列表
    $scope.find = function (pageNo) {
      if ($scope.pageModel.currentPage) {
        delete $scope.pageModel.currentPage;
      }

      $.extend($scope.search, {
        currentPage: pageNo || $scope.pageModel.currentPage || 1,
        pageSize: $scope.pageModel.pageSize || 10
      });
      $scope.search.pageIndex = $scope.search.currentPage - 1;
      $scope.search.totalCount = $scope.pageModel.totalCount || 0;

      fac.getPageResult("/ovu-park/backstage/operate/officeReserve/list", $scope.search, function (data) {
        $scope.pageModel = data;
        // $scope.houseMap = data.data[0].houseMap;
      });
      fac.getPageResult("/ovu-park/backstage/operate/office/spaceList", $scope.search, function (data) {
        $scope.houseMap = data.houseMap;
      })
    };
    $scope.cancel = function () {
      $uibModalInstance.dismiss('cancel');
    };

    // 订单状态
    $scope.getStatus = function (mOrderStatus) {
      switch (mOrderStatus) {
        case 0:
          return "待付款";
        case 1:
          return "进行中";
        case 2:
          return "已完成";
        case 3:
          return "已取消";
        case 4:
          return "待退款";
        case 5:
          return "交易关闭";
      }
    }

    // 详情
    $scope.getDetail = function (item) {
      item.office.position = $scope.getPosition(item.office.houseId)
      var modal = $uibModal.open({
        animation: true,
        size: 'md',
        templateUrl: '/view/operationManage/bookingManage/modal.meetingDetail.html',
        controller: 'meetingDetailCtrl',
        resolve: {
          item: item
        }
      });
    };
    $scope.find(1);
    /**
     * 获得办公室硬件配置  （ filter ）
     * */
    $scope.getEqTypeName = function (param) {
      $scope.typeNames = [];
      $scope.typeList = [];
      if (param) {
        var typeLists = param.split(",");
        $scope.typeList = angular.copy(typeLists);
        for (var i = 0; i < $scope.typeList.length; i++) {
          var type = $scope.typeList[i];
          $scope.type = $scope.trimStr(type);
          if (1 == new Number($scope.type)) {
            $scope.typeNames.push("投影设备");
          } else if (2 == new Number($scope.type)) {
            $scope.typeNames.push("音响话筒");
          } else if (3 == new Number($scope.type)) {
            $scope.typeNames.push("视频终端");
          }
        }
      }
      return $scope.typeNames.join(",");
    }
    /**
     * 去除空格
     * */
    $scope.trimStr = function (str) {
      return str.replace(/(^\s*)|(\s*$)/g, "");
    }
  });

  /* 会议室详情 - 控制器 */
  app.controller('meetingDetailCtrl', function ($scope, $http, $uibModalInstance, $filter, fac, item) {
    $scope.item = item;
    $scope.conferenceType = ''
    $scope.getDetail = function (id) {
      $http.get("/ovu-park/backstage/operate/officeReserve/getOrderInfoById?id=" + id).success(function (resp) {
        if (resp.code == 0) {
          $scope.item.reservation = resp.data.reserve.reservation;
        }
      })
    }
    $scope.getDetail($scope.item.id);

    app.modulePromiss.then(function () {
      // console.log('666')
      $scope.init()
    })

    $scope.init = function () {
      let strArr = []
      if (!item.conferenceType) {
        $scope.conferenceType = '--'
        return
      }
      let arr = item.conferenceType.split(',')
      for (i of arr) {
        if (i == 1) {
          strArr.push('矿泉水')
        } else if (i == 2) {
          strArr.push('茶水')
        } else if (i == 3) {
          strArr.push('果盘')
        }
      }
      let arr_1 = strArr.join()
      // console.log('arr1',arr_1)
      $scope.conferenceType = arr_1
    }


    // 订单状态
    $scope.getStatus = function (mOrderStatus) {
      switch (mOrderStatus) {
        case 0:
          return "待付款";
        case 1:
          return "进行中";
        case 2:
          return "已完成";
        case 3:
          return "已取消";
        case 4:
          return "待退款";
        case 5:
          return "交易关闭";
      }
    }
    $scope.cancel = function () {
      $uibModalInstance.dismiss('cancel');
    };

  });
  /* 场地控制器 */
  app.controller('bookingSpaceListCtrl', function ($scope, $rootScope, $http, $filter, $uibModalInstance, $uibModal, fac, param) {
    $scope.search = {
      timeFlag: "0",
      yardId: param.id,
      parkId: param.parkId
    };
    $scope.pageModel = {};
    // 发布时间
    $scope.timeFlag = [{
      text: "全部",
      value: 0
    },
    {
      text: "一周内",
      value: 1
    },
    {
      text: "一个月内",
      value: 2
    },
    {
      text: "三个月内",
      value: 3
    }
    ]
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

    // 查询列表
    $scope.find = function (pageNo) {
      if ($scope.pageModel.currentPage) {
        delete $scope.pageModel.currentPage;
      }

      $.extend($scope.search, {
        currentPage: pageNo || $scope.pageModel.currentPage || 1,
        pageSize: $scope.pageModel.pageSize || 10
      });
      $scope.search.pageIndex = $scope.search.currentPage - 1;
      $scope.search.totalCount = $scope.pageModel.totalCount || 0;

      fac.getPageResult("/ovu-park/backstage/operate/yardReserve/list", $scope.search, function (data) {
        $scope.pageModel = data;
      });
    };

    // 订单状态
    $scope.getStatus = function (mOrderStatus) {
      switch (mOrderStatus) {
        case 0:
          return "待付款";
        case 1:
          return "进行中";
        case 2:
          return "已完成";
        case 3:
          return "已取消";
        case 4:
          return "待退款";
        case 5:
          return "交易关闭";
      }
    }

    // 详情
    $scope.getDetail = function (item) {
      var modal = $uibModal.open({
        animation: true,
        size: 'md',
        templateUrl: '/view/operationManage/bookingManage/modal.spaceDetail.html',
        controller: 'spaceDetailCtrl',
        resolve: {
          item: item
        }
      });
    };
    $scope.find();
    $scope.cancel = function () {
      $uibModalInstance.dismiss('cancel');
    };
    /**
     * 去除空格
     * */
    $scope.trimStr = function (str) {
      return str.replace(/(^\s*)|(\s*$)/g, "");
    }
  });

  /* 场地详情 - 控制器 */
  app.controller('spaceDetailCtrl', function ($scope, $http, $uibModalInstance, $uibModal, $filter, fac, item) {
    $scope.item = item;
    $scope.getDetail = function (id) {
      $http.get("/ovu-park/backstage/operate/yardReserve/getOrderInfoById?id=" + id).success(function (resp) {
        if (resp.code == 0) {
          $scope.item.reservation = resp.data.reservation;
        }
      })
    }
    $scope.getDetail($scope.item.id);
    // 订单状态
    $scope.getStatus = function (mOrderStatus) {
      switch (mOrderStatus) {
        case 0:
          return "待付款";
        case 1:
          return "进行中";
        case 2:
          return "已完成";
        case 3:
          return "已取消";
        case 4:
          return "待退款";
        case 5:
          return "交易关闭";
      }
    }
    //查看位置
    $scope.showPosition = function (positon) {
      var copy = angular.extend({
        unclick: true
      }, positon);
      if (!positon.mapLng) {
        alert('当前广告位没有位置信息!')
      }
      var modalInstance = $uibModal.open({
        size: 'lg',
        animation: true,
        templateUrl: '/view/operationManage/releaseManage/modal.showPosition.html',
        controller: 'showPositionCtrl',
        resolve: {
          positon: copy
        }
      });
    }
    $scope.cancel = function () {
      $uibModalInstance.dismiss('cancel');
    };
  });
  /* 广告位制器 */
  app.controller('bookingAdvListCtrl', function ($scope, $rootScope, $http, $filter, $uibModalInstance, $uibModal, fac, param) {
    $scope.search = {
      timeFlag: "0",
      advertisementId: param.id,
      parkId: param.parkId
    };
    $scope.pageModel = {};
    // 发布时间
    $scope.timeFlag = [{
      text: "全部",
      value: 0
    },
    {
      text: "一周内",
      value: 1
    },
    {
      text: "一个月内",
      value: 2
    },
    {
      text: "三个月内",
      value: 3
    }
    ]
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
    // 查询列表
    $scope.find = function (pageNo) {
      if ($scope.pageModel.currentPage) {
        delete $scope.pageModel.currentPage;
      }

      $.extend($scope.search, {
        currentPage: pageNo || $scope.pageModel.currentPage || 1,
        pageSize: $scope.pageModel.pageSize || 10
      });
      $scope.search.pageIndex = $scope.search.currentPage - 1;
      $scope.search.totalCount = $scope.pageModel.totalCount || 0;
      fac.getPageResult("/ovu-park/backstage/operate/advertisementReserve/list", $scope.search, function (data) {
        $scope.pageModel = data;
      });
    };

    // 订单状态
    $scope.getStatus = function (mOrderStatus) {
      switch (mOrderStatus) {
        case 0:
          return "待付款";
        case 1:
          return "进行中";
        case 2:
          return "已完成";
        case 3:
          return "已取消";
        case 4:
          return "待退款";
        case 5:
          return "交易关闭";
      }
    }
    //  预定时长
    $scope.timeRange = function (start, end) {
      var a = moment(start, "YYYY-MM")
      return moment(end, "YYYY-MM").diff(a, 'month')
    }
    $scope.cancel = function () {
      $uibModalInstance.dismiss('cancel');
    };

    // 详情
    $scope.getDetail = function (item) {
      var modal = $uibModal.open({
        animation: true,
        size: 'md',
        templateUrl: '/view/operationManage/bookingManage/modal.advDetail.html',
        controller: 'advDetailCtrl',
        resolve: {
          item: item
        }
      });
    };


    $scope.find();
    /**
     * 去除空格
     * */
    $scope.trimStr = function (str) {
      return str.replace(/(^\s*)|(\s*$)/g, "");
    }
  });

  /* 广告位详情 - 控制器 */
  app.controller('advDetailCtrl', function ($scope, $http, $uibModal, $uibModalInstance, $filter, fac, item) {
    $scope.item = item;
    $scope.getDetail = function (id) {
      $http.get("/ovu-park/backstage/operate/advertisementReserve/getOrderInfoById?id=" + id).success(function (resp) {
        if (resp.code == 0) {
          $scope.item.reservation = resp.data.reservation;
        }
      })
    }
    $scope.getDetail($scope.item.id);
    // 订单状态
    $scope.getStatus = function (mOrderStatus) {
      switch (mOrderStatus) {
        case 0:
          return "待付款";
        case 1:
          return "进行中";
        case 2:
          return "已完成";
        case 3:
          return "已取消";
        case 4:
          return "待退款";
        case 5:
          return "交易关闭";
      }
    }
    //查看位置
    $scope.showPosition = function (positon) {
      var copy = angular.extend({
        unclick: true
      }, positon);
      if (!positon.mapLng) {
        alert('当前广告位没有位置信息!')
      }
      var modalInstance = $uibModal.open({
        size: 'lg',
        animation: true,
        templateUrl: '/view/operationManage/releaseManage/modal.showPosition.html',
        controller: 'showPositionCtrl',
        resolve: {
          positon: copy
        }
      });
    }
    $scope.cancel = function () {
      $uibModalInstance.dismiss('cancel');
    };
    //  预定时长
    $scope.timeRange = function (start, end) {
      var a = moment(start, "YYYY-MM")
      return moment(end, "YYYY-MM").diff(a, 'month')
    }
  });
  //广告位设置地图
  app.controller('AdsSetMapCtrl', function ($scope, $http, $uibModalInstance, $filter, fac, positon) {
    var positionList = [];
    var map
    var mapLng = [];
    var mapLat = [];
    var arr = [];
    var arr1 = [];

    $scope.$on('birdMap', function (event, data) {
      map = data
    });
    $scope.$on('adv', function (event, data) {
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
  //场地设置地图
  app.controller('SpaceSetMapCtrl', function ($scope, $http, $uibModalInstance, $filter, fac, positon) {
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

  // 发布状态 - 用户
  app.filter("realaseStatus", function () {
    return function (status) {
      if (status == 0) {
        return "待审核";
      } else if (status == 1) {
        return "已通过";
      } else if (status == 2) {
        return "已拒绝";
      } else if (status == 3) {
        return "已撤销";
      } else {
        return "--";
      }
    }
  });
  // 发布状态 - 运营方
  app.filter("realaseStatus2", function () {
    return function (status) {
      if (status == 1) {
        return "已发布";
      } else if (status == 3) {
        return "已撤销";
      } else {
        return "--";
      }
    }
  });
  app.filter("dateDay", function () {
    return function (str) {
      if (str) {
        return str.slice(0, 10)
      } else {
        return "--"
      }

    }
  });
})()
