(function (angular, doc) {
 
  angular.module('angularApp')

    .controller('elevatorOverviewController', ['$scope', '$http', '$rootScope', 'fac', function ($scope, $http, $rootScope, fac) {
      $scope.pageModel = {};
      $scope.search = {};
      $scope.names = ['图片模式', '列表模式'];
      $rootScope.config = {edit: false};

      $scope.selectedName = $scope.names[0];
      $scope.checklog = false;

      /*function hasActivePark(search) {
          if (!search.projectId) {
              alert("请选择项目！");
              return false;
          } else {
              return true;
          }
      }*/

      app.modulePromiss.then(function () {
        fac.initPage($scope, function () {
          init();
        }, function () {
          $scope.find();
        });

      })


      function init() {
        $scope.search.projectId = $scope.search.parkId;
        // 项目空间
        $http({
          method: 'GET',
          url: '/ovu-pcos/pcos/liftreport/center/single/project/space.do',
          params: {
            'projectId': $scope.search.projectId
          }
        }).success(function (resp) {
          var datamap = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十'];
          var data = resp || [];
          data.forEach(function (v, i) {
            datamap.some(function (innerV, inneri) {
              if (v.text.startsWith(innerV)) {
                v.index = inneri;
                return true;
              }
            });
          });
          data.sort(function (a, b) {
            return a.index - b.index;
          })
          //  $('#dept_tree').treeview({
          //      data: data
          //  });

          $scope.treeData = data;
        });
        $scope.find();
      }


      $scope.find = function (pageNo) {
        $scope.search.buildingId = $scope.curNode && $scope.curNode.id;
        $.extend($scope.search, {currentPage: pageNo || 1, pageSize: $scope.pageModel.pageSize || 10});
        fac.getPageResult("/ovu-pcos/pcos/liftreport/center/single/lift/display/page.do", $scope.search, function (data) {
          $scope.pageModel = data;
        });
        $scope.findToatl();
      }
      $scope.findToatl = function () {
        $http({
          method: 'post',
          url: '/ovu-pcos/pcos/liftreport/center/single/lift/display/total.do',
          params: $scope.search
        }).success(function (data) {
          $scope.topbarData = data;
        });
      }

      //  $scope.checklog = false;
      $scope.checkLog = function () {
        $scope.checklog = true;
      };
      $scope.back = function () {
        $scope.checklog = false;
        $scope.selectedName = $scope.names[1];
      }

      //获取设备类型树
      $http.get("/ovu-pcos/pcos/equipment/getEmtTree.do").success(function (resp) {
        if (resp.success) {
          $scope.typeData = resp.data;
        }
      })
      //选择树节点
      $scope.selectNode = function (node) {
         $scope.search.parentId=node.parentId;//解决点击子菜单有数据，点击子菜单的父菜单无数据问题（Zn）
        //电梯分类
        if (node.domain_id) {
          /*if (fac.isEmpty(node.nodes)) {*/
            $scope.search.modelId = node.id;
            $scope.search.modelName = node.text;
            $scope.search.modelHover = $scope.search.modelFocus = false;
          /*} else {
            alert("请选择产品型号！");
          }*/
        } else {
          //项目数
          if ($scope.curNode != node) {
            $scope.curNode && $scope.curNode.state && ($scope.curNode.state.selected = false);
          }
          node.state = node.state || {};
          node.state.selected = !node.state.selected;
          if (node.state.selected) {
            $scope.curNode = node;
            $scope.find();
          } else {
            delete $scope.curNode;
          }
        }
      }
    }])

    .controller('CardListCtrl', function ($scope, $http, fac) {
      $scope.checkLog = true;
    })

})(angular, document);
