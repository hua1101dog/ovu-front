(function () {
    "use strict";
    var app = angular.module("angularApp");
    app.controller('workunitKpiStatCtrl', function ($scope, $rootScope, $http, $filter, $uibModal, fac) {
        document.title = "OVU-关键指标统计分析";
        $scope.search = $scope.param = {};
        $scope.kpiPlanList=[];
        $scope.kpiEmerList=[];

        $scope.kpiSearch={
            dbName:app.envName,
            domainId:app.domain.id,
            date:moment().format('YYYY-MM')
        };
        $scope.type='jh';
        $scope.cycleDate='';


        app.modulePromiss.then(function () {

        })

        $scope.find=function(){
            if ($scope.type=='jh') {
                findKpiPlan();
            }else{
                findKpiEmer();
            }
        }

        $scope.setCurTab=function (type) {
            $scope.type=type;
            $scope.find();
        }

        function findKpiPlan() {
            $http.post("/dapingAgent/api/workunit/getPlanUnitWorkTypeStatics",$scope.kpiSearch, fac.postConfig).success(function (resp) {
                if (resp.code==0){
                    $scope.kpiPlanList=resp.data;
                    //合计行
                    if($scope.kpiPlanList.length>0){
                        summuryRow(1);
                    }
                    setTimeout(function () {
                        mergeCells(1);
                    })
                    if(resp.data){
                        var one=resp.data[0];
                        $scope.cycleDate=one.startDate+' ~ '+one.endDate;
                    }
                }
            });
        }
        function findKpiEmer() {
            $http.post("/dapingAgent/api/workunit/getEmerUnitWorkTypeStatics",$scope.kpiSearch, fac.postConfig).success(function (resp) {
                if (resp.code==0){
                    $scope.kpiEmerList=resp.data;
                    //合计行
                    if($scope.kpiEmerList.length>0){
                        summuryRow(2);
                    }
                    setTimeout(function () {
                        mergeCells(2);
                    })

                    if(resp.data){
                        var one=resp.data[0];
                        $scope.cycleDate=one.startDate+' - '+one.endDate;
                    }
                }
            });
        }
        //合并单元格
        function mergeCells(type){
            var fcells=[];
            var tableName;
            var data=[];
            if (type==1) {
                tableName="kpiPlanTable";
                data=$scope.kpiPlanList;
            }else{
                tableName="kpiEmerTable";
                data=$scope.kpiEmerList;
            }

            data.forEach(function(item,index){
                var fid=item.parkId;

                if(fcells.indexOf(fid)>-1){
                    REDIPS.table.mark(true, tableName, index+1, 0);
                    if((index+1)==data.length){
                        REDIPS.table.merge('v', true, tableName);
                    }
                }else{
                    fcells.push(fid);
                    if((index+1)==data.length){
                        REDIPS.table.merge('v', true, tableName);
                        REDIPS.table.mark(true, tableName, index+1, 0);
                    }
                    REDIPS.table.merge('v', true, tableName);
                    if((index+1)!=data.length){
                        REDIPS.table.mark(true, tableName, index+1, 0);
                    }
                }
            });
        }
        
        //生成合计列
        function summuryRow(type){
            var row = {};
            row.parkName = "合计";
            row.workTypeName = "合计";
            if(type == 1){
                var archCount = 0;
                var total = 0;
                var rate ;
                $scope.kpiPlanList.forEach(function(item,index){
                    archCount += item.archCount;
                    total += item.total;
                })
                rate = ((archCount*100)/total).toFixed(2) + "%";
                row.archCount = archCount;
                row.total = total;
                row.rate = rate;
                $scope.kpiPlanList.push(row);
            }else{
                var faultCount = 0;
                var total = 0;
                var rate ;
                $scope.kpiEmerList.forEach(function(item,index){
                    faultCount += item.faultCount;
                    total += item.total;
                })
                rate = ((total-faultCount)*100/total).toFixed(2) + "%";
                row.faultCount = faultCount;
                row.total = total;
                row.rate = rate;
                $scope.kpiEmerList.push(row);
            }
        }
        
        $scope.export = function(type){
            if(type == 1){
                var url = "/dapingAgent/api/workunit/export/exportPlanUnitStat?&date="+$scope.kpiSearch.date;
            }else{
                var url = "/dapingAgent/api/workunit/export/exportEmerUnitStat?&date="+$scope.kpiSearch.date;
            }
            if($scope.kpiSearch.dbName){
                url += "&dbName=" + $scope.kpiSearch.dbName;
            }
            if($scope.kpiSearch.parkId){
                url += "&parkId=" + $scope.kpiSearch.parkId
            }
            if($scope.kpiSearch.domainId){
                url += "&domainId=" + $scope.kpiSearch.domainId;
            }
            if($scope.cycleDate){
                url += "&cycleDate=" + $scope.cycleDate;
            }
            window.location.href = url;
        }
    })
})();
