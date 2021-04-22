/**
 * Created by Administrator on 2017/7/20.
 */
(function () {
  "use strict";
  var app = angular.module("app");

  app.controller('WorkManageCtrl', function ($scope, $rootScope, $http, $filter, $uibModal, fac, AppService) {
      document.title = "维保工作管理";
      $scope.pageModel = {};
      $scope.search = {"DATA_STATUS": "1", STATUS: 5};
      angular.extend($scope, fac.dicts);

      $scope.chooseWorkType = function (search) {
        modalWork.open({
          callback: function (node) {
            if (node.tid && node.text) {
                search.WORKTYPE_ID = node.tid;
                search.WORKTYPE_NAME = node.text;
              if (node.tid == "0") {
                delete search.WORKTYPE_ID
              }
            }
            $scope.$apply();
            modalWork.close();
          },
          selectedId: search.WORKTYPE_ID
        });
      }
      $scope.search = {curTab: "DCL"};
      $scope.setCurTab = function (tab) {
        if ($scope.search.curTab != tab) {
          $scope.search.curTab = tab;
          $scope.$broadcast($scope.search.curTab);
        }
      }

      //展示工单详情
      $scope.showWorkUnitDetail = function (workunitId) {
        var modal = $uibModal.open({
          animation: false,
          size: "lg",
          templateUrl: '/view/workunit/modal.workunitDetail.html',
          controller: 'workUnitDetailModalCtrl'
          , resolve: {
            workunitId: function () {
              return workunitId
            }, isFault: false
          }
        });
      };

      //查询维保单位list
      /* AppService.getMaintenanceunitList().then(function (data) {
           $scope.maintenanceunitList = data || [];
       })*/

      $scope.$broadcast($scope.search.curTab);

  });

  app.controller('allDclCtl', function ($scope, $rootScope, $http, $filter, $uibModal, fac) {
      $scope.search = {isClosed: 2, operateType: 1}
      $scope.pageModel = {};

      $scope.find = function (pageNo) {
        $.extend($scope.search, $scope.$parent.search, {
          currentPage: pageNo || $scope.pageModel.currentPage || 1,
          pageSize: $scope.pageModel.pageSize || 10
        });
        fac.getPageResult("/ovu-pcos/pcos/workunit/parkWorkunitlist.do", $scope.search, function (data) {
          $scope.pageModel = data;
        });
      };
      $scope.$on("DCL", function () {
        $scope.find();
      });

      $scope.find();
  });
  app.controller('allYgbCtl', function ($scope, $rootScope, $http, $filter, $uibModal, fac) {
      $scope.search = {isClosed: 1}
      $scope.pageModel = {};

      $scope.find = function (pageNo) {
        $.extend($scope.search, $scope.$parent.search, {
          currentPage: pageNo || $scope.pageModel.currentPage || 1,
          pageSize: $scope.pageModel.pageSize || 10
        });
        fac.getPageResult("/ovu-pcos/pcos/workunit/parkWorkunitlist.do", $scope.search, function (data) {
          $scope.pageModel = data;
        });
      };
      $scope.$on("YGB", function () {
        $scope.find();
      });
  });

  //工单详情或故障详情
  app.controller('workUnitDetailModalCtrl', function ($scope, $rootScope, $http, $uibModalInstance, $filter, fac, workunitId, isFault) {
    angular.extend($scope, fac.dicts);
    var workunit = $scope.item = {ID: workunitId, isFault: isFault};
    $scope.phaseList = [];

    //Deprecated
    $scope.chooseTask = function (task) {
      $scope.curTask = task;
      if (!task.stepList || task.stepList.length == 0) {
        $http.post("/ovu-pcos/pcos/workunit/getWorkStepById.do", {
          taskId: task.ID,
          unitId: workunit.ID
        }, fac.postConfig).success(function (resp) {
          task.stepList = resp.steplist;
          var stepOperList = [];
          if (resp.arr && resp.arr.ID) {
            stepOperList = JSON.parse(resp.arr.DESCRIPTION);
          }
          task.stepList.forEach(function (n) {
            switch (n.OPERATION_TYPE) {
              case "1":
                break;
              case "2":
                break;
              case "3":
                n.options = n.OPTIONS_LIST.split(/[,，]/);
                break;
              case "4":
                break;
            }
            n.oper = stepOperList.find(function (m) {
              return m.id == n.ID
            }) || {id: n.ID};
          });

        })
      }
    }

    var workUnitPromise = $http.get("/ovu-pcos/pcos/workunit/getWorkunit.do?id=" + workunit.ID).then(function (resp) {
      var ret = resp.data;
      if (ret.success) {
        angular.extend(workunit, ret.data);
        workunit.evaluates && workunit.evaluates.forEach(function (n) {
          n.photos = n.PICTURE ? (n.PICTURE.split(",")) : [];
        });
        // 巡检验收工单添加 巡检验收标准
        // workunit.onsiteinsp_node = '[{"title":"1.检查主墙面是否破损"},{"title":"2.检查房屋厨房卫生间是否漏水"},{"title":"3"},{"title":"4"},{"title":"5"}]';
        if (workunit.onsiteinsp_node) {
          var list = JSON.parse(workunit.onsiteinsp_node);
          workunit.onsiteinsp_node = list.map(function (item) {
            return item.title;
          }).join('<br/>');
        }
        //应急工单
        if (workunit.WORKUNIT_TYPE == 1) {
          $scope.task = workunit.task;
          var stepOperList = [];
          if ($scope.task.DESCRIPTION_ID && $scope.task.DESCRIPTION) {
            stepOperList = JSON.parse($scope.task.DESCRIPTION);
          }
          $scope.task.stepChild.forEach(function (n) {
            if (n.OPERATION_TYPE == 3) {
              //选择
              n.options = n.OPTIONS_LIST.split(/[,，]/);
            }
            n.oper = stepOperList.find(function (m) {
              return m.id == n.WORKSTEP_ID
            }) || {id: n.WORKSTEP_ID};
          });

        } else {
          workunit.pictures = workunit.PICTURE ? workunit.PICTURE.split(",") : [];
          workunit.photos = workunit.PHOTO ? workunit.PHOTO.split(",") : [];
        }
      } else {
        alert(ret.error);
      }
      return workunit;
    });
    workUnitPromise.then(function () {

      fillProgressBar();

      //工单生成
      if (workunit.WORKUNIT_TYPE == 2) {
        $scope.phaseList.push({
          title: "报事",
          time: workunit.REPORT_TIME || workunit.CREATE_DATE,
          content: "发起人：" + (workunit.SOURCE_PERSON_NAME || "无")
        })
      } else {
        $scope.phaseList.push({
          title: "工单生成",
          time: workunit.REL_TIME,
          content: "发起人：" + workunit.SOURCE_PERSON_NAME || "无"
        })
      }

      if (workunit.callbacks && workunit.callbacks.length) {
        var callbacks = workunit.callbacks.map(function (n) {
          return {title: "回访", time: n.BACK_TIME, content: "回访人：" + n.BACK_NAME, BACK_TEXT: n.BACK_TEXT}
        });
        $scope.phaseList = $scope.phaseList.concat(callbacks)
      }
      if (workunit.histories && workunit.histories.length) {
        workunit.histories.forEach(function (n) {
          var phase = {time: n.CREATE_TIME, UNIT_STATUS: n.UNIT_STATUS};
          switch (n.UNIT_STATUS) {
            case 1:
              phase.title = "派发";
              phase.content = "派发人：" + (n.WORK_PERSON_NAME || '系统自动派发');
              phase.noDetail = false;
              phase.WORK_CONTENT = n.WORK_CONTENT;
              break;
            case 4:
              phase.title = "退回";
              phase.content = "回退人：" + n.WORK_PERSON_NAME;
              phase.WORK_CONTENT = n.WORK_CONTENT;
              break;
            case 5:
              phase.title = "接单";
              phase.content = "执行人：" + n.WORK_PERSON_NAME;
              phase.noDetail = true;
              break;
            case 7:
              phase.title = "执行";
              phase.content = "执行人：" + n.WORK_PERSON_NAME;
              break;
            case 8:
              phase.title = "评价";
              phase.content = "管理人：" + n.WORK_PERSON_NAME;
              phase.evaluate = workunit.evaluates.find(function (n) {
                return n.EVALUATE_TYPE == 2
              })
              break;
          }
          phase.title && $scope.phaseList.push(phase);
        })
      }
      if (workunit.evaluates && workunit.evaluates.length) {
        var eva = workunit.evaluates.find(function (n) {
          return n.EVALUATE_TYPE == 1
        });
        if (eva) {
          var phase = {title: "评价", time: eva.CREATE_TIME, content: "发起人：" + eva.WORK_PERSON_NAME || "无"}
          phase.evaluate = eva;
          $scope.phaseList.push(phase)
        }
      }
      //工单督办
      if (workunit.supervises && workunit.supervises.length) {
        var supervises = workunit.supervises.map(function (n) {
          return n.SUPERVISE_STATUS == 1 ? {
            title: "已督办",
            time: n.SUPERVISE_TIME,
            content: "督办人：" + n.SUPERVISE_PERSON_NAME,
            noDetail: true
          } : {title: "待督办", time: n.CREATE_TIME, content: "", noDetail: true}
        });
        $scope.phaseList = $scope.phaseList.concat(supervises)
      }

      //查看设备详情
      if (workunit.equipment_id) {
        $scope.showEquipment = true;
        getEquipmentInfo(workunit.equipment_id);
      }
    })

    function fillProgressBar() {

      var types = ['success', 'info', 'warning', 'danger'];
      $scope.stacked = [{
        value: 1,
        UNIT_STATUS: -1,
        title: workunit.WORKUNIT_TYPE == 2 ? '报事' : '工单生成',
        type: 'default'
      },
        {value: 1, UNIT_STATUS: 1, title: '派发', type: 'default'},
        {value: 1, UNIT_STATUS: 4, title: '退回', type: 'default'},
        {value: 1, UNIT_STATUS: 5, title: '接单', type: 'default'},
        {value: 1, UNIT_STATUS: 7, title: '执行', type: 'default'},
        {value: 1, UNIT_STATUS: 8, title: '评价', type: 'default'}
      ];
      $scope.stacked.forEach(function (n) {
        if (workunit.UNIT_STATUS >= n.UNIT_STATUS) {
          n.type = 'success';
        }
      })
      if (workunit.UNIT_STATUS == 4) {
        $scope.stacked[2].type = 'danger';
        $scope.stacked[3].value = 0;
      } else {
        $scope.stacked[2].value = 0;
      }
    };

    function getEquipmentInfo(equipmentId) {
      $http.get("/ovu-pcos/pcos/equipment/get.do?id=" + equipmentId).success(function (resp) {
        if (resp.success) {
          $scope.equipinfo = resp.data;

        } else {
          alert(resp.error);
        }
      });
    }

    $scope.cancel = function () {
      $uibModalInstance.dismiss('cancel');
    };
  });
  ;

})();
