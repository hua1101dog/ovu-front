/**
 * Created by Zn on 2017/11/20.
 */
(function (angular) {
    "use strict";
    var app = angular.module("angularApp");
    app.controller('energyFormCtrl', function ($scope, $rootScope, $uibModal,$sce, $state, $http, $filter, fac){
        document.title='能源综合报表';
        $scope.search={};
        $scope.pageModel={};
        $scope.fn=function () {
            selectClassify();
            $scope.find();
        }
        var startTime=moment().subtract(1, 'months').format('YYYY-MM-DD');
        var endTime=moment().format('YYYY-MM-DD');
        app.modulePromiss.then(function () {
            $scope.search.startTime=startTime;
            $scope.search.endTime=endTime;
            if(!$scope.search.startTime || !$scope.search.endTime){
                    alert('请选择起始时间和截止时间');
                    return
            }
            $scope.$watch('dept.id', function (deptId, oldValue) {
                if (deptId) {
                    if ($scope.dept.parkId) {
                        $scope.search.parkId = $scope.dept.parkId;
                        $scope.search.parkName = $scope.dept.parkName;
                        $scope.fn();
                    } else {
                        alert('请选择跟项目关联的部门');
                        $scope.search.parkId &&  delete $scope.search.parkId
                        $scope.search.parkName &&  delete $scope.search.parkName;
                   
                    }

                }

            })
        })
        function selectClassify() {
            $http.get("/ovu-energy/energy/classify/list.do").success(function (data) {
                $scope.measureCategory=data.data;
            });
        }

        $scope.changeCategory=function (id) {

            $http.post("/ovu-energy/energy/item/list",{parkId:$scope.search.parkId,classifyId:id},fac.postConfig).success(function (data) {
                $scope.fenXiangList=data.data;
            });

        }
        $scope.find=function (pageNo) {
            if (!$rootScope.dept || !$rootScope.dept.id) {
                alert("请选择部门！");
                return false;
            }
            $.extend($scope.search, {currentPage: pageNo || 1, pageSize: $scope.pageModel.pageSize || 10});
            $scope.search.pageIndex = $scope.search.currentPage - 1;
            if(!$scope.search.startTime || !$scope.search.endTime){
                alert('请选择起始时间和截止时间');
                return
        }
            fac.getPageResult("/ovu-energy/energy/report/point/list", $scope.search, function (data) {
                var pageModel = data;
                if(pageModel.data!=undefined){
                    pageModel.data=pageModel.data.map(function (item) {
                        item.spaceName=$sce.trustAsHtml(item.spaceName.split(",").map(function (v,i) {
                            return (i+1)+'.'+v;
                        }).join('<br>'));
                        return item;
                    })
                }
                $scope.pageModel = pageModel;
            });
        }
        $scope.exportForm=function () {
            var checkedItemsId='';
            var checkedItems = $scope.pageModel.data.filter(function(item){
                return item.checked;
            });

            for (var i = 0; i < checkedItems.length; i++) {
                checkedItemsId+=checkedItems[i].pointId+',';
            }
            checkedItemsId=(checkedItemsId.substring(checkedItemsId.length-1)===',')?checkedItemsId.substring(0,checkedItemsId.length-1):checkedItemsId;
            if(checkedItemsId!==''){
                window.location.href="/ovu-energy/energy/report/point/export?pointIds="+checkedItemsId;
            }
            else {
                alert("请勾选下面条目");
            }

        }
        $scope.seeTrend=function (item) {
            if(!$scope.search.startTime || !$scope.search.endTime){
                alert('请选择起始时间和截止时间');
                return
        }
            var param={
                pointId:item.pointId,
                startTime:$scope.search.startTime,
                endTime:$scope.search.endTime,
                pointName:item.pointName,
                parkName:item.parkName,
                unit:item.pointUnitName
            }
            $uibModal.open({
                animation: false,
                size: 'lg',
                templateUrl: '/view/energy/energyAnalysis/modal.seeTrend.html',
                controller: 'seeTrendModalCtrl',
                resolve:{
                    param:param
                }
            });
        };
    });
    app.controller('seeTrendModalCtrl', function ($scope, $rootScope, $uibModal,$uibModalInstance, $state, $http, $filter, fac,param){
        $http.get('/ovu-energy/energy/report/point/trend',{params:param}).success(function (data) {
            data = data.data;
            var timeArr=[];
            $scope.average=data.average;
            $scope.startTimeArr=[];
            $scope.endTimeArr=[];
            $scope.startDataArr=[];
            $scope.endDataArr=[];
            $scope.cycleArr=[];
            $scope.valueArr=[];
            var series=[];
            var template={
                name:'',
                type:'line',
                data:[5, 11, 15, 11, 12, 13, 6],
                markLine: {
                    symbol:"none",
                    data: [
                        { type: 'average',
                          name: '平均值',
                          lineStyle: {
                            normal: {
                              color: "green",
                              width: 2,
                              type: "solid"
                            }
                          },
                          label:{
                            normal:{
                              formatter:'平均值\n{c}'
                            }
                          }
                        }
                    ]
                }
            }
            if(!fac.isEmpty(data.trendList)){
                var copyTemplate=angular.copy(template);
              data.trendList.forEach(function (v) {
              
                // var tempTime=(v.startTime==undefined?v.startTime='':v.startTime)+'\n\n'+(v.endTime==undefined?v.endTime='':v.endTime);
                var tempTime=v.time
                timeArr.push(tempTime);
                // $scope.startTimeArr.push(v.startTime);
                // $scope.endTimeArr.push(v.endTime);
                // $scope.startDataArr.push(v.startValue);
                // $scope.endDataArr.push(v.endValue);
                // $scope.cycleArr.push(v.cycle);
                //减法解决精度缺失问题
                //   function numSub(num1, num2) {
                //       var baseNum, baseNum1, baseNum2;
                //       try {
                //           baseNum1 = num1.toString().split(".")[1].length;
                //       } catch (e) {
                //           baseNum1 = 0;
                //       }
                //       try {
                //           baseNum2 = num2.toString().split(".")[1].length;
                //       } catch (e) {
                //           baseNum2 = 0;
                //       }
                //       //两者大的再加1，不然部分减法依旧出现精度缺失问题
                //       baseNum = Math.pow(10, Math.max(baseNum1, baseNum2)+1);
                //       return (num1 * baseNum - num2 * baseNum) / baseNum;
                //   };
                //   $scope.valueArr.push(numSub(v.endValue,v.startValue));
                // for (var i = 0; i < $scope.valueArr.length; i++) {
                //   if(isNaN($scope.valueArr[i])){
                //     $scope.valueArr[i]='';
                //   }

                // }
                $scope.valueArr.push(v.value);
              

              });
              copyTemplate.data=$scope.valueArr || []
            }  
            
            series.push(copyTemplate);
         
            $scope.dataTrend.xAxis.data=timeArr;
            $scope.dataTrend.series=series;
          
            $scope.dataTrend.title.text=param.pointName+'总趋势图';
            $scope.dataTrend.title.subtext='所属项目：'+param.parkName+' 计量点单位：'+param.unit;
        });
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
        $scope.dataTrend={
            title: {
                text: '水表1号总趋势图',
                subtext: '所属项目：创意天地 计量单位：m³',
                x:'center'
            },
            tooltip: {
                trigger: 'axis',
                // formatter: function (params) {
                //   if(params instanceof Array){
                //         return  '起始时间：'+ ($scope.startTimeArr[params[0].dataIndex]==undefined?$scope.startTimeArr[params[0].dataIndex]='':$scope.startTimeArr[params[0].dataIndex])+'<br />'
                //             +'截止时间：'+($scope.endTimeArr[params[0].dataIndex]==undefined?$scope.endTimeArr[params[0].dataIndex]='':$scope.endTimeArr[params[0].dataIndex])+'<br />'
                //             +'起始数据：'+($scope.startDataArr[params[0].dataIndex]==undefined?$scope.startDataArr[params[0].dataIndex]='':$scope.startDataArr[params[0].dataIndex])+'<br />'
                //             +'截至数据：'+($scope.endDataArr[params[0].dataIndex]==undefined?$scope.endDataArr[params[0].dataIndex]='':$scope.endDataArr[params[0].dataIndex])+'<br />'
                //             +'增长数据：'+($scope.valueArr[params[0].dataIndex]==undefined?$scope.valueArr[params[0].dataIndex]='':$scope.valueArr[params[0].dataIndex])+'<br />'
                //             +'周期：'+($scope.cycleArr[params[0].dataIndex]==undefined?$scope.cycleArr[params[0].dataIndex]='':$scope.cycleArr[params[0].dataIndex])+'天';
                //     }
                // }
            },
            xAxis:  {
                type: 'category',
                data: [],
                name:'时间'
            },
            yAxis: {
                type: 'value',
                name:'值'
            },
            series: []
        };
    });
})(angular)
