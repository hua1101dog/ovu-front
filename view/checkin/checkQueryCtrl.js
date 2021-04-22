/**
 * Created by Zn on 2017/12/14.
 */
(function () {
  "use strict";
  var app = angular.module("angularApp");

  app.controller('checkQueryCtrl', function ($scope, $rootScope, $uibModal, $state, $http, $filter, fac) {
    document.title = '签到查询';
    $scope.pageModel = {};
    $scope.search = {};
    //   $scope.callback=function () {
    //         $scope.find();
    //         $scope.search.PARENT_NAME='';
    //         $scope.search.deptId='';

    //     }
    app.modulePromiss.then(function () {
      // $scope.search = {isGroup: fac.isGroupVersion()};
      $scope.search.startTime = moment().format('YYYY-MM-DD');
      $scope.search.endTime = moment().format('YYYY-MM-DD');
      $scope.deptTree = fac.getGlobalTree();
      if ($scope.deptTree.length) {
        $scope.search.deptId = $scope.deptTree[0].id;
      }
    })
    $scope.find = function (pageNo) {
      $scope.search = $scope.search || {};
      var curDept = fac.getSelectedNode($scope.deptTree);
      if (curDept) {
        $scope.search.deptId = curDept.id;
      } else {
        alert("请选择部门！");
        return;
      }
      $.extend($scope.search, { currentPage: pageNo || 1, pageSize: $scope.pageModel.pageSize || 10 });
      $scope.search.pageIndex = $scope.search.currentPage - 1;
      $scope.search.userName = $scope.search.user ? $scope.search.user.name : undefined;
      fac.getPageResult("/ovu-pcos/pcos/checkIn/personSign/list", $scope.search, function (data) {
        $scope.pageModel = data;

      });
    };

    $scope.setDept = function (search, node) {

      if (node.state.selected) {
        $scope.find(1);
      }
    }
    $scope.export = function () {
      var checkedItemsId = '';
      var checkedItems = $scope.pageModel.data.filter(function (item) {
        return item.checked;
      });

      for (var i = 0; i < checkedItems.length; i++) {
        checkedItemsId += checkedItems[i].id + ',';
      }
      checkedItemsId = (checkedItemsId.substring(checkedItemsId.length - 1) === ',') ? checkedItemsId.substring(0, checkedItemsId.length - 1) : checkedItemsId;
      if (checkedItemsId !== '') {
        console.log(checkedItemsId);
        window.location.href = "/ovu-pcos/pcos/checkIn/personSign/export?ids=" + checkedItemsId;
      }
      else {
        alert("请勾选下面条目");
      }
    }
    $scope.seeInfo = function (item) {
      var modal = $uibModal.open({
        animation: false,
        size: 'lg',
        templateUrl: '/view/checkin/modal.seeInfo.html',
        controller: 'checkQuerySeeInfoModalCtrl',
        resolve: {
          param: item
        }
      });
      modal.result.then(function () {
        $scope.find();
      }, function () {
        console.info('Modal dismissed at: ' + new Date());
      });
    };
  });

  app.controller('checkQuerySeeInfoModalCtrl', function ($scope, $http, $uibModal, $uibModalInstance, $filter, fac, param) {
    $http.post("/ovu-pcos/pcos/checkIn/personSign/get", param, fac.postConfig).success(function (data) {
      $scope.list = data;
      console.log($scope.list)
      $scope.list && $scope.list.forEach(function (v) {
        v.picture = (v.picture && v.picture.split(",")) || [];
      });
    });
    $scope.cancel = function () {
      $uibModalInstance.dismiss('cancel');
    };

  });
})();
