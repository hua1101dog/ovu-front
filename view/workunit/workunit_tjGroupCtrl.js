
(function() {
	"use strict";
	var app = angular.module("angularApp");
	app.controller('workunitTjGroupCtl', function ($scope,$rootScope, $http,$filter,$uibModal,fac) {
      document.title ="工单统计";
      $scope.search={};
      $scope.pageModel={};
      app.modulePromiss.then(function(){
          $scope.search={
              dbName:app.envName,
              domainId:app.domain.id,
              startTime:moment().add(-1,'days').format('YYYY-MM-DD'),
              endTime:moment().add(-1,'days').format('YYYY-MM-DD')
          };
          $scope.find(1);
      });

      //查询
      $scope.find = function(pageNo) {
        $.extend($scope.search, {
          currentPage: pageNo || $scope.pageModel.currentPage || 1,
          pageSize: $scope.pageModel.pageSize || 10
        });
        $.extend($scope.search,{currentPage:pageNo||$scope.pageModel.currentPage||1,pageSize:$scope.pageModel.pageSize||10});
          fac.getPageResult("/dapingAgent/api/workunit/pageGroupWorkunitStatics",$scope.search,function(data){
              $scope.pageModel = data;
          });
      };

      //详情
      $scope.detail = function(detail){
        var modal = $uibModal.open({
          animation: false,
          size:'lg',
          templateUrl: '/view/workunit/modal.emergenStatistics.html',
          controller: 'emergenStatisticsModalCtrl'
          ,resolve: {data: angular.extend({
            parkId:detail.id,
            startTime:$scope.search.startTime,
            endTime:$scope.search.endTime,
            finishTimeStart:$scope.search.finishTimeStart,
            finishTimeEnd:$scope.search.finishTimeEnd
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
          elemIF.src = "/dapingAgent/api/workunit/exportGroup.do?json="+param;
        elemIF.style.display = "none";
        document.body.appendChild(elemIF);
      }
	});

  app.controller('emergenStatisticsModalCtrl', function($scope,$rootScope,$http,$uibModalInstance,$filter,fac,data) {
      $scope.unitStatisticsStatus= [
          [999, "全部"],
          [1, "未接单"],
          [5, "已接单"],
          [7, "已执行"],
          [8, "已评价"]
      ];
      $scope.search={
        isStatistics:1,
        WORKUNIT_TYPE:2,
        parkId:data.parkId,
        STATUS:7,
        startTime:data.startTime,
        endTime:data.endTime,
        finishTimeStart:data.finishTimeStart,
        finishTimeEnd:data.finishTimeEnd,
        shieldText:'第三方部门'
      };
      $scope.pageModel={};

      $scope.cancel = function () {
          $uibModalInstance.dismiss('cancel');
      };

      $scope.find=function(pageNo){
          $scope.search.IsClosed=getOperType($scope.search.STATUS);
          $.extend($scope.search, {
            currentPage: pageNo || $scope.pageModel.currentPage || 1,
            pageSize: $scope.pageModel.pageSize || 10
          });
          fac.getPageResult("/ovu-pcos/pcos/workunit/parkWorkunitlist.do",$scope.search,function(data){
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

      function getOperType(status){
        if(status==8){
          return 1;
        }
        return null;
      }

  });

})();
