/**
 * by ghostsf
 */
(function () {
  "use strict";
  var app = angular.module("angularApp");

  app.controller('performance_scoreCtrl', function ($scope, $rootScope, $http, $filter, $uibModal, fac) {
    document.title = "定义分值";
	$scope.config = { edit:false}
    $scope.pageModel = {};

    app.modulePromiss.then(function () {
      $scope.search = {
        isGroup: fac.isGroupVersion(),
        tab: 0
      };
      $scope.find();
      //初始化为计划工单
      fac.workTypeTree($scope,1);
      $scope.worktypeTree = $scope.planWorkTypeTree;
    });

    $scope.find = function (pageNo) {
      if (!fac.hasActivePark($scope.search)) {
        return;
      }
      if ($scope.curNode) {
        $scope.search.WORKTYPE_ID = $scope.curNode.WORKTYPE_ID;
        $scope.search.WORKITEM_ID = $scope.curNode.WORKITEM_ID;
      } else {
        delete $scope.search.WORKTYPE_ID;
        delete $scope.search.WORKITEM_ID;
      }
      $.extend($scope.search, {
        currentPage: pageNo || $scope.pageModel.currentPage || 1,
        pageSize: $scope.pageModel.pageSize || 10
      });
      fac.getPageResult("/ovu-pcos/pcos/performance/score/queryByPage.do", $scope.search, function (data) {
        $scope.pageModel = data;
      });
    };

    $scope.selectNode = function (search,node) {
      if ($scope.curNode != node) {
        $scope.curNode && $scope.curNode.state && ($scope.curNode.state.selected = false);
      }
      node.state = node.state || {};
    //  node.state.selected = !node.state.selected;
      if (node.state.selected) {
        $scope.curNode = node;
        console.log("node select  :" + $scope.curNode);
        $scope.find(1);
      } else {
        delete $scope.curNode;
      }
    };

    $scope.dotab = function (tab) {
      $scope.pageModel.currentPage = 1;
      $scope.search.tab = tab;
      if(tab == 0){
      	fac.workTypeTree($scope,1);
      	$scope.worktypeTree = $scope.planWorkTypeTree;
      }else if(tab == 1){
      	fac.workTypeTree($scope,2);
      	$scope.worktypeTree = $scope.emerWorkTypeTree;
      }
      delete $scope.curNode
      $scope.find();
    };

    $scope.saveScore = function (item) {
      var param = {};
      if ($scope.search.tab === 0) {
        param.workitem_id = item.ID;
        param.worktype_id = "";
      } else {
        param.worktype_id = item.ID;
        param.workitem_id = "";
      }
      if (item.score === "") {
        alert("请填写分值");
        return;
      }
      var reg = new RegExp("^[0-9]*$");
      if (!reg.test(item.score)) {
        alert("请填写整数");
        return;
      }
      if(parseInt(item.score)>999){
        alert("分值不要超过三位数");
        return;
      }
      param.score = item.score;
      $http.post("/ovu-pcos/pcos/performance/score/saveScore.do", param, fac.postConfig).success(function (resp, status, headers, config) {
        if (resp.success) {
          msg("保存成功!");
        } else {
          alert(resp.error);
        }
      })
    };

  });


})();
