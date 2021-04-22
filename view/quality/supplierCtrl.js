(function () {
  var app = angular.module("angularApp");
  app.controller('supplierCtl', function ($scope, $rootScope, $uibModal, $http, $filter, fac) {
    document.title = "供应商管理";
    $scope.pageModel = {};
    $scope.search = {};

    app.modulePromiss.then(function () {
      fac.initPage($scope, function () {
        $scope.find();
      }, function () {
        $scope.find();
      });

    })

    //查询供应商列表
    $scope.find = function (pageNo) {
      console.log(11)
      $.extend($scope.search, {
        currentPage: pageNo || $scope.pageModel.currentPage || 1,
        pageSize: $scope.pageModel.pageSize || 10
      });
      fac.getPageResult("/ovu-pcos/pcos/quality/supplier/list.do", $scope.search, function (data) {
        console.log(data, 911)
        $scope.pageModel = data;
      });
    };
    //删除单个供应商
    $scope.del = function (item) {
      del(item.supplierId);
    }

    function del(id) {
      confirm("确认删除该供应商?", function () {
        $http.post("/ovu-pcos/pcos/quality/supplier/delete.do", {"supplierId": id}, fac.postConfig).success(function (resp) {
          if (resp.success) {
            $scope.find();
          } else {
            alert(resp.msg);
          }
        })
      });
    }

    //新增或者修改弹出框
    $scope.showEditModal = function (supplierId) {
      if (!$scope.search.parkId) {
        alert("请选择项目")
        return;
      }
      var param = {supplierId: supplierId, parkId: $scope.search.parkId};
      var modal = $uibModal.open({
        animation: false,
        size: 'lg',
        templateUrl: '/view/quality/supplier/modal.quality.supplier.html',
        controller: 'supplierAddOrEditModalCtrl',
        resolve: {
          param: param
        }
      });
      modal.result.then(function () {
        $scope.find();
      });
    }

  });
  //新增修改供应商弹出框控制器
  app.controller('supplierAddOrEditModalCtrl', function ($scope, $http, $uibModalInstance, $filter, fac, param) {
    var parkId = param.parkId;
    if (fac.isNotEmpty(param.supplierId)) {
      $http.get("/ovu-pcos/pcos/quality/supplier/get.do?supplierId=" + param.supplierId).success(function (data) {
        if (fac.isNotEmpty(data)) {
          $scope.item = data;
        } else {
          alert();
        }
      })
    }
    //保存
    $scope.save = function (form, item) {
      form.$setSubmitted(true);
      if (!form.$valid) {
        return;
      }

      if (fac.isEmpty(param.supplierId)) {
        item.parkId = parkId;
      }
      delete item.createTime;
      $http.post("/ovu-pcos/pcos/quality/supplier/edit.do", item, fac.postConfig).success(function (data, status, headers, config) {
        if (data.success) {
          $uibModalInstance.close();
          msg("保存成功!");
        } else {
          alert();
        }
      })
    }
    $scope.cancel = function () {
      $uibModalInstance.dismiss('cancel');
    };

  });
})()
