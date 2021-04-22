(function () {
  var app = angular.module("angularApp");
  app.controller('groupCustomServiceCtrl', function ($scope, $rootScope, $http, $filter, $uibModal, fac) {
    angular.extend($rootScope, fac.dicts);
    document.title = "OVU-参观点管理";
    $scope.search = {};
    $scope.pageModel = {};

    fac.loadSelect($scope, "SERVICE_SCOPE");



  //参观点列表
    $scope.find = function (pageNo) {
      if ($scope.pageModel.currentPage) {
        delete $scope.pageModel.currentPage;
      }
      $.extend($scope.search, {
        currentPage: pageNo || $scope.pageModel.currentPage || 1,
        pageSize: $scope.pageModel.pageSize || 10,
        dataStatus: $scope.dataStatus = 1,
      });
      $scope.search.pageIndex = $scope.search.currentPage - 1;
      $scope.search.totalCount = $scope.pageModel.totalCount || 0;

      fac.getPageResult("/ovu-park/backstage/receptionpoint/page", $scope.search, function (data) {
        $scope.pageModel = data;
      });
    };
    $scope.find();

    //删除参观点
    $scope.del = function (item) {
      confirm("确定删除 ?", function () {
        $http.get('/ovu-park/backstage/receptionpoint/deletePoint?id=' + item.id).success(function (resp) {
          console.log(resp)
          if (resp.code == 0) {
            window.msg("完成")
          } else {
            alert(resp.msg)
          }
        })
        $scope.find();
      })

    }

    //新增/编辑
    $scope.newAdd = function (item) {

      if (!app.park) {
        windows.error("请先选择一个项目！");
        return false;
      }
      item = item || { creatorId: app.user.id, creatorName: app.user.nickname };
      item.parkId = app.park.parkId;
      item.updatorId = app.user.id;
      // item.updatorName = app.user.nickname;
      var copy = angular.extend({}, item);
      var modal = $uibModal.open({
        animation: false,
        size: 'lg',
        templateUrl: '/view/integratManage/visiAdmin/modal.visiAdim.html',
        controller: 'addvisiAdmin',
        resolve: { item: copy }
      });
      modal.result.then(function () {
        $scope.find(1);
      });
    }

  });


  //新增参观点（第一个模态框）
  app.controller('addvisiAdmin', function ($scope, $http, $uibModalInstance, $filter, item, fac, $uibModal) {
    $scope.count = 1;
    $scope.item = item;
    // $scope.item.pics = [];
    $scope.parkUserId = '';
    $scope.selectedReceiver = '';
    // $scope.item.photourl = [];
    $scope.item.pics = $scope.item.photoUrl ? $scope.item.photoUrl.split(",") : [];

    //添加联系人
    $scope.phonePeople = function () {
      var params = {
        parkId: app.park.parkId,
        currentPage: 1,
        pageSize: 10,
        pageIndex: 0,
      };
      fac.getPageResult("/ovu-base/ovupark/backstage/customer/getListByIdsNew", params, function (resp) {
        for (var i = 0; i < resp.data.length; i++) {
          if ($scope.item.sendCustomers && $scope.item.sendCustomers.indexOf(resp.data[i].id) != -1) {
            resp.data[i].disabled = true;
          } else {
            resp.data[i].disabled = false;
          }
        }

        //第一个模态框
        var modal = $uibModal.open({
          animation: false,
          size: 'lg',
          templateUrl: '/view/integratManage/visiAdmin/modal.chooseCompany.html',
          controller: 'chooseCompanyCtrl',
          resolve: { chooseCompany: { pages: resp, customers: $scope.item.customers, ids: $scope.item.sendCustomers } }
        });
        modal.result.then(function (r) {

          $scope.item.parkUserId = r.pNames;
          $scope.item.phone = r.phone;
          $(".chooseCompanyPanle input").val(r.pNames);
          $(".chooseCompanyPanleone input").val(r.phone);
          $scope.$applyAsync();

        }, function (reason) {
          console.info('Modal chooseCompany dismissed at: ' + new Date());
        });
      });

    };

    //新增参观点确定按钮
    $scope.saveNews = function (form, item) {
      form.$setSubmitted(true);
      if (!form.$valid) {
        return;
      }
      if (item.pics.length > 3) {
        $scope.count = 1;
        window.msg("照片最多只能上传3张图片, 请删除多余的图片！");
        return false;
      }
      item.photoUrl = item.pics.join(",");
      $scope.item.parkId = app.park.parkId;

      fac.getResult("/ovu-park/backstage/receptionpoint/edit", item, function (resp) {
        if (resp.code == 0) {
          window.msg("成功");
          layer.close(loading);
          $uibModalInstance.close();
        } else {
          alert(resp.msg);
          $scope.count = 1;
          layer.close(loading);
        }
      });
      $uibModalInstance.close();
      $scope.find();
    };


    $scope.cancel = function () {
      $uibModalInstance.dismiss('cancel');
    };





    //取消
    $scope.sort = function (nodeList, node, index) {
      if (index < 0) {
        index += nodeList.length;
      } else if (index >= nodeList.length) {
        index -= nodeList.length;
      }
      var otherNode = nodeList[index];
      if (!node.id || !otherNode.id) {
        alert("请先保存编辑中节点！");
        return;
      }
      var oriIndex = nodeList.indexOf(node);
      $http.post("/ovu-base/sys/menu/sort", [{ id: node.id, sort: index }, { id: otherNode.id, sort: oriIndex }]).success(function (resp) {
        if (resp.code === 0) {
          nodeList.splice(oriIndex, 1);
          nodeList.splice(index, 0, node);
        } else {
          alert(resp.msg);
        }
      });
    }

  });



  //用户选择器（第二个模态框）
  app.controller('chooseCompanyCtrl', function ($scope, $rootScope, $http, $uibModalInstance, $filter, fac, chooseCompany, $uibModal) {
    $scope.pageModel = chooseCompany.pages;
    $scope.customers = chooseCompany.customers;
    $scope.ids = chooseCompany.ids;
    angular.extend($rootScope, fac.dicts);
    $scope.search = {
      parkId: app.park.parkId,
      currentPage: 1,
      pageSize: 10,
      pageIndex: 0,
      totalCount: 0,
      nickname: "",
      userType: "",
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
      // loginId
      var personId = item.id;
      $scope.personName = item.nickname;
      $scope.personPhone = item.phone;
      // $scope.onePhone = item.phone;
      if ($("#selectTable  #" + personId).attr("disabled") || $("#selectTable  #" + personId).attr("ng-disabled") == "true") {
        return false;
      }

      //如果是单选，已经添加了一个，先删除原来的，在添加新的人员
      if (bool) {
        $(".ul-persons .item").each(function () {
          var id = $(this).attr("personId");//获取原来的人员id
          //var name=$(this).attr("personName");//原来的人员姓名，状态改为可选
          $("#selectTable  #" + id).removeAttr("disabled");
          $("#selectTable  #" + id).html("<span class='glyphicon glyphicon-plus'></span>添加");
          $(".ul-persons .item").remove();
        });
      }

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

      $(a).bind("click", function () {
        $(this).parent().remove();
        $scope.removePersonItem(personId, $scope.personName);
      });

    };


    //第二个模块用户选择器确定按钮
    $scope.checkPerson = function () {
      var checkedP = $(".ul-persons .item");
      if (checkedP.length <= 0) {
        window.msg("请至少添加一个用户!");
        return false;
      }
      var pIds = "", pNames = "", phone = ""
      checkedP.each(function (index) {
        pIds += $(this).attr("personId");
        pNames += $(this).attr("personName");
        phone += $(this).attr("phone");
        if (index < checkedP.length - 1) {
          pIds += ",";
          pNames += ",";
          phone += ","
        }
      });
      $uibModalInstance.close({ pIds: pIds, pNames: pNames, phone: phone });
    };

    $scope.cancel = function () {
      $uibModalInstance.dismiss('cancel');
    };

  });



  //参观订单
  app.controller('groupCustomServiceCtrlone', function ($scope, $rootScope, $http, $filter, $uibModal, fac) {
    angular.extend($rootScope, fac.dicts);
    $scope.search = {};
    $scope.pageModel = {};
    $scope.isShow = true;
    fac.loadSelect($scope, "SERVICE_SCOPE");

    // $scope.find = function (pageNo) {
    //   if ($scope.pageModel.currentPage) {
    //     delete $scope.pageModel.currentPage;
    //   }
    //   $.extend($scope.search, {
    //     currentPage: pageNo || $scope.pageModel.currentPage || 1,
    //     pageSize: $scope.pageModel.pageSize || 10
    //   });
    //   $scope.search.pageIndex = $scope.search.currentPage - 1;
    //   $scope.search.totalCount = $scope.pageModel.totalCount || 0;
    //   fac.getPageResult("/ovu-park/backstage/solution/customerService/list", $scope.search, function (data) {
    //     $scope.pageModel = data;
    //   });
    // };
    $scope.find();

    $scope.findone = function (pageNo) {

      if ($scope.pageModel.currentPage) {
        delete $scope.pageModel.currentPage;
      }
      $.extend($scope.search, {
        currentPage: pageNo || $scope.pageModel.currentPage || 1,
        pageSize: $scope.pageModel.pageSize || 10
      });
      $scope.search.pageIndex = $scope.search.currentPage - 1;
      $scope.search.totalCount = $scope.pageModel.totalCount || 0;
      if ($scope.all) {
        $scope.search.pointName = $scope.all;
      }

      $http.get('/ovu-park/backstage/receptionorder/queryByName', { params: $scope.search }).then(function (res) {
        console.log(res)
        if (res.code == 0) {
          window.msg("完成")
        } else {
          alert("查询失败")
        }
      })
    };



    //新增/编辑
    $scope.newAdd = function (news) {
      var copy = angular.extend({}, news);
      var modal = $uibModal.open({
        animation: false,
        size: 'lg',
        templateUrl: '/view/integratManage/visiAdmin/modal.visiAdim.html',
        controller: 'addvisiAdmin',
        resolve: { news: copy }
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

    app.modulePromiss.then(function () {
      fac.initPage($scope, function () {
        $scope.find(1);
      })
    });
  });



  //推荐路线
  app.controller('groupCustomServiceCtrltwo', function ($scope, $rootScope, $http, $filter, $uibModal, fac) {
    angular.extend($rootScope, fac.dicts);
    document.title = "OVU-参观点管理";
    $scope.search = {};
    $scope.pageModel = {};
    $scope.isShow = true;
    fac.loadSelect($scope, "SERVICE_SCOPE");


    /*app.modulePromiss.then(function() {
        fac.initPage($scope,function(){
            $scope.find();
        })
    });*/
    $scope.find();








    //新增/编辑
    $scope.addRouter = function (news) {
      var copy = angular.extend({}, news);
      var modal = $uibModal.open({
        animation: false,
        size: 'lg',
        templateUrl: '/view/integratManage/visiAdmin/modal.addRouter.html',
        controller: 'visitList',
        resolve: { news: copy }
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

  });



  //推荐路线（参观点列表）
  app.controller('visitList', function ($scope, $rootScope, $http, $uibModalInstance, $filter, fac, $uibModal) {
    angular.extend($rootScope, fac.dicts);
    $scope.search = {};
    $scope.pageModel = {};
    $scope.isShow = true;
    fac.loadSelect($scope, "SERVICE_SCOPE");

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
      fac.getPageResult("/ovu-park/backstage/solution/customerService/list", $scope.search, function (data) {
        $scope.pageModel = data;
      });
    };
    $scope.find();
    $scope.cancel = function () {
      $uibModalInstance.dismiss('cancel');
    };


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
    $scope.nodeList =
    {
      "code": 0,
      "data": [
        {
          "resourceId": "",
          "roleId": "",
          "icon": "sheshiyunweizhongxin",
          "pid": "",
          "resourceName": "",
          "sort": "",
          "url": "",
          "operations": "",
          "nodes": [
            {
              "resourceId": 46656,
              "roleId": "",
              "ptexts": "生产运营中心",
              "icon": "sheshishepeizhibiao",
              "pid": 13020,
              "resourceName": "设备运营中心",
              "sort": "",

            },
            {
              "resourceId": 46657,
              "roleId": "",
              "ptexts": "生产运营中心",
              "icon": "fuwu1",
              "pid": 13020,
              "resourceName": "人员运营中心",
              "sort": "",

            }
          ],
          "menuType": 2,
          "id": 13020,
          "text": "生产运营中心",
          "moduleId": 221,
          "pids": "",
          "powers": ""
        },
        {
          "resourceId": 46659,
          "roleId": "",
          "icon": "yuanquanquanzhongxin",
          "pid": "",
          "resourceName": "安全监控中心",
          "sort": "",
          "url": "app.safe",
          "operations": "",
          "menuType": 1,
          "id": 13024,
          "text": "安全监控中心",
          "moduleId": 221,
          "pids": "",
          "powers": ""
        },
        {
          "resourceId": 46660,
          "roleId": "",
          "icon": "sheshiyunweizhongxin",
          "pid": "",
          "resourceName": "设施运维中心",
          "sort": "",
          "url": "app.facility",
          "operations": "",
          "menuType": 1,
          "id": 13025,
          "text": "设施运维中心",
          "moduleId": 221,
          "pids": "",
          "powers": ""
        },
        {
          "resourceId": "",
          "roleId": "",
          "icon": "qiyefuwuzhongxin",
          "pid": "",
          "resourceName": "",
          "sort": "",
          "url": "",
          "operations": "",
          "nodes": [
            {
              "resourceId": 46776,
              "roleId": "",
              "ptexts": "能源运营中心",
              "icon": "dianbiao",
              "pid": 13154,
              "resourceName": "电表",
              "sort": "",
              "url": "app.energy.electric",
              "operations": "",
              "menuType": 1,
              "id": 13155,
              "text": "电表",
              "moduleId": 221,
              "pids": "13154",
              "powers": ""
            },
            {
              "resourceId": 46775,
              "roleId": "",
              "ptexts": "能源运营中心",
              "icon": "shuibiao",
              "pid": 13154,
              "resourceName": "水表",
              "sort": "",
              "url": "app.energy.water",
              "operations": "",
              "menuType": 1,
              "id": 13156,
              "text": "水表",
              "moduleId": 221,
              "pids": "13154",
              "powers": ""
            }
          ],
          "menuType": 2,
          "id": 13154,
          "text": "能源运营中心",
          "moduleId": 221,
          "pids": "",
          "powers": ""
        }
      ],
      "msg": ""
    }
    $scope.nodeList = $scope.nodeList.data;



    //上下移动的方法
    $scope.sort = function (nodeList, node, index) {
      if (index < 0) {
        index += nodeList.length;
      } else if (index >= nodeList.length) {
        index -= nodeList.length;
      }
      var otherNode = nodeList[index];
      if (!node.id || !otherNode.id) {
        alert("请先保存编辑中节点！");
        return;
      }
      var oriIndex = nodeList.indexOf(node);
      $http.post("/ovu-base/sys/menu/sort", [{ id: node.id, sort: index }, { id: otherNode.id, sort: oriIndex }]).success(function (resp) {
        if (resp.code === 0) {
          nodeList.splice(oriIndex, 1);
          nodeList.splice(index, 0, node);
        } else {
          alert(resp.msg);
        }
      });
    }
  });
})();
