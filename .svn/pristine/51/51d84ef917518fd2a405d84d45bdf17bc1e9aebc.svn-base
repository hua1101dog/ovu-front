/**
 * 合同审批管理
 */
(function () {
  'use strict';

  document.title = "合同审批管理";
  var app = angular.module("angularApp");

  app.controller('ContractApproveCtl', ContractApproveCtl);

  function ContractApproveCtl($scope, $timeout, $uibModal, $http, fac) {
    var vm = this;
    $scope.pageModel = {};
    $scope.search = {};

    vm.auditingStatusDict = [
      [0, "未审核 "],
      [1, "审核不通过"]
    ],
    //分页表格
    $scope.find = function (pageNo) {
      angular.extend($scope.search, {
        currentPage: pageNo || $scope.pageModel.currentPage || 1,
        pageSize: $scope.pageModel.pageSize || 10
      });
      $scope.search.pageIndex = $scope.search.currentPage - 1;
      fac.getPageResult("/ovu-pcos/pcos/contractManagement/auditingList.do", $scope.search, function (data) {
        $scope.pageModel = data;
      });
    }
    $scope.find();
    //审核通过与否
    vm.approve = function (id, type) {
      if (type == 1) {
        //通过直接发请求
        $http.get("/ovu-pcos/pcos/contractManagement/auditingPass.do?contractId=" + id).success(function (data, status, headers, config) {
          if (data.success) {
            msg("保存成功!");
            $scope.find();
          } else {
            alert();
          }
        })
      } else {
        //弹出框
        var modal = $uibModal.open({
          animation: false,
          templateUrl: '../view/contract/approve/modal.reason.html',
          controller: 'ReasonCtrl',
          resolve: {
            id: id
          }
        });
        modal.result.then(function () {
          $scope.find();
        }, function () {
          console.info('Modal dismissed at: ' + new Date());
        });
      }
    }
  }

  //审核不通过原因控制器
  app.controller('ReasonCtrl', ReasonCtrl);

  function ReasonCtrl($scope, $timeout, $uibModalInstance, $http, fac, id) {
    var vm = $scope.vm = this;
    vm.item = {contractId: id};

    vm.save = function (form, item) {
      form.$setSubmitted(true);
      if (!form.$valid) {
        return;
      }
      $http.post("/ovu-pcos/pcos/contractManagement/auditingNotPass.do", item, fac.postConfig).success(function (data, status, headers, config) {
        if (data.success) {
          $uibModalInstance.close();
          msg("保存成功!");
        } else {
          alert();
        }
      })
    }
    vm.cancel = function () {
      $uibModalInstance.dismiss('cancel');
    };

  }
})()
