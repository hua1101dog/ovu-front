
(function() {
	"use strict";
	var app = angular.module("angularApp");
	app.controller('workunitTjParkCtl', function ($scope,$rootScope, $http,$filter,$uibModal,fac) {
        document.title ="工单统计-单项目";
      $scope.search={
          dbName:app.envName,
          startTime:moment().add(-1,'days').format('YYYY-MM-DD'),
          endTime:moment().add(-1,'days').format('YYYY-MM-DD')
      };

      $scope.pageModel={};
        app.modulePromiss.then(function(){
            $rootScope.$watch('dept.id', function (deptId, oldValue) {
                if (deptId) {
                    $scope.search.deptId=deptId;
                    loadDeptTree();
                    $scope.find(1);
                }
            })
        });

      //查询
      $scope.find = function(pageNo) {
        if (!fac.initDeptId($scope.search)) {
          return;
        }
        $.extend($scope.search, {
          currentPage: pageNo || $scope.pageModel.currentPage || 1,
          pageSize: $scope.pageModel.pageSize || 10
        });
        $.extend($scope.search,{currentPage:pageNo||$scope.pageModel.currentPage||1,pageSize:$scope.pageModel.pageSize||10});
        fac.getPageResult("/dapingAgent/api/workunit/pageWorkunitStatics",$scope.search,function(data){
          $scope.pageModel = data;
        });
      };

      function loadDeptTree(){
          if($scope.search.deptId){
              $http.get('/ovu-base/system/dept/tree.do?deptId='+$scope.search.deptId).success(function (data) {
                  $scope.searchDeptTree=data;
              });
          }else{
              $scope.searchDeptTree=[];
          }
      }

      //详情
      $scope.detail = function(detail,type){
          var unitIds='';
          if (type=='未接单'){
              unitIds=detail.yjWjdIds;
          }else if(type=='已接单'){
              unitIds=detail.yjYjdIds;
          }
        var modal = $uibModal.open({
          animation: false,
          size:'lg',
          templateUrl: '/view/workunit/workunit_tjPark.modal.html',
          controller: 'parkUnitModalCtrl'
          ,resolve: {data: angular.extend({
                    ids:unitIds,
                    personId:detail.id,
                    startTime:$scope.search.startTime,
                    endTime:$scope.search.endTime
          })}
        });
        modal.result.then(function () {
        }, function () {
          console.info('Modal dismissed at: ' + new Date());
        });
      }

      //导出
      $scope.export = function(){
        var elemIF = document.createElement("iframe");
        var param=encodeURIComponent(encodeURIComponent(JSON.stringify($scope.search)));
        elemIF.src = "/dapingAgent/api/workunit/exportPark.do?json="+param;
        elemIF.style.display = "none";
        document.body.appendChild(elemIF);
      }
	});

  app.controller('parkUnitModalCtrl', function($scope,$rootScope,$http,$uibModalInstance,$filter,fac,data) {
        $scope.type=data.type || '';
        $scope.search={
            ids:data.ids,
            STATUS:999
        };

        $scope.pageModel={};

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };

        $scope.find=function(pageNo){
            $.extend($scope.search, {
                currentPage: pageNo || $scope.pageModel.currentPage || 1,
                pageSize: $scope.pageModel.pageSize || 10
            });
            fac.getPageResult("/ovu-pcos/pcos/workunit/parkWorkunitlist.do",$scope.search,function(data){
                $scope.pageModel = data;
            });
        };

        $scope.find(1);

    });

  app.controller('emergenStatisticsParkModalCtrl', function($scope,$rootScope,$http,$uibModalInstance,$filter,fac,data) {
      $scope.unitStatisticsStatus=[
          [999, "全部"],
          [-1, "已发单"],
          [-2, "自发单"],
          [1, "未接单"],
          [5, "已接单"],
          [7, "已执行"],
          [8, "已评价"]
      ];
    $scope.search={
      personId:data.personId,   //人员ID
      WORKUNIT_TYPE:2,  //应急工单
      parkId:data.parkId,
      STATUS:7, //已执行
      operateType:23,    //已执行
      startTime:data.startTime,
      endTime:data.endTime,
      finishTimeStart:data.finishTimeStart,
      finishTimeEnd:data.finishTimeEnd
    };
    $scope.pageModel={};

    $scope.cancel = function () {
      $uibModalInstance.dismiss('cancel');
    };

    $scope.find=function(pageNo){
      $scope.search.operateType=getOperType($scope.search.STATUS);
      $.extend($scope.search, {
        currentPage: pageNo || $scope.pageModel.currentPage || 1,
        pageSize: $scope.pageModel.pageSize || 10
      });
      fac.getPageResult("/ovu-pcos/workunit/statistics/statisticsPersonUnits.do",$scope.search,function(data){
        data.data.forEach(function(item){
          item.pictures=[];
          item.photos=[];
          if(item.PICTURE){
            item.pictures=item.PICTURE.split(',');
          }
          if(item.PHOTO){
            item.photos=item.PHOTO.split(',');
          }
          if(item.EVALUATE_SCORE){
            switch(item.EVALUATE_SCORE){
              case 1: item.EVALUATE_SCORE='☆'; break;
              case 2: item.EVALUATE_SCORE='☆☆'; break;
              case 3: item.EVALUATE_SCORE='☆☆☆'; break;
              case 4: item.EVALUATE_SCORE='☆☆☆☆'; break;
              case 5: item.EVALUATE_SCORE='☆☆☆☆☆'; break;
            }
          }
        });
        $scope.pageModel = data;
      });
    };

    function getOperType(status){
        var operType=null;
        if(status==1){
          operType=21;//待接单
        }else if(status==5){
          operType=22;//待执行
        }else if(status==7){
          operType=23;//已执行
        }else if(status==8){
          operType=23;//已评价(工单被评价)
        }
        if(status==8){
          $scope.search.IsClosed=1;
        }else{
          delete $scope.search.IsClosed;
        }

        if(status==-1) {
            $scope.search.self = 0;
        }else if(status==-2){
            $scope.search.self=1;
        }else{
            delete $scope.search.self;
        }

        return operType;
    }

    $scope.chooseWorkType = function(){
      modalWork.open({
        callback:function(node){
          if(node.tid && node.text){
            if(node.tid == "0"){
              delete $scope.search.WORKTYPE_ID;
              delete $scope.search.WORKTYPE_NAME;
            }else{
              $scope.search.WORKTYPE_ID = node.tid;
              $scope.search.WORKTYPE_NAME = node.text;
            }
            $scope.$apply();
          }
          modalWork.close();
        },
        selectedId:$scope.search.WORKTYPE_ID
      });
    }

    $scope.find(1);

  });
})()
