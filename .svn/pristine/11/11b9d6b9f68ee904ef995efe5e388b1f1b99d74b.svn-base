/**
 * Created by Zn on 2017/11/20.
 */
(function (angular) {
    "use strict";
    var app = angular.module("angularApp");
    app.controller('energyFamilySplitFormCtrl', function ($scope, $rootScope,$sce, $uibModal, $state, $http, $filter, fac){
        document.title='能源分户综合报表';
        $scope.search={};
        $scope.pageModel={};
        $scope.fn=function () {
            selectClassify();
            $scope.find();
            $scope.changeSpaceName();
        }

        $scope.seeTrend=function (item) {
            $scope.search.spaceName=item.spaceName;
            var param=$scope.search;
            if(!param.startTime){
                alert('开始时间不能为空');
                return
            }
            else if(!param.endTime){
                alert('开始时间不能为空');
                return
            }
            else if(!param.spaceName){
                alert('空间名称不能为空');
                return
            }
            else if(!param.classifyId){
                alert('计量分类不能为空');
                return
            }
            else if(!param.itemId){
                alert('计量分项不能为空');
                return
            }
            $uibModal.open({
                animation: false,
                size: 'lg',
                templateUrl: '/view/energy/energyAnalysis/modal.familySplit.html',
                controller: 'familySplitModalCtrl',
                resolve:{
                    param:param
                }
            });
        };
        var startTime=moment().subtract(1, 'months').format('YYYY-MM-DD');
        var endTime=moment().format('YYYY-MM-DD');
        app.modulePromiss.then(function () {
          
            $scope.search.year=new Date().getFullYear();
            $scope.search.startTime=startTime;
            $scope.search.endTime=endTime;
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
        $scope.find=function (pageNo) {
            if (!$rootScope.dept || !$rootScope.dept.id) {
                alert("请选择部门！");
                return false;
            }
            $.extend($scope.search, {currentPage: pageNo || 1, pageSize: $scope.pageModel.pageSize || 10});
            $scope.search.pageIndex = $scope.search.currentPage - 1;
            fac.getPageResult("/ovu-energy/energy/report/space/list", $scope.search, function (data) {
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
        };
        function selectClassify() {
            $http.get("/ovu-energy/energy/classify/list.do").success(function (data) {
                $scope.measureCategory=data.data;
            });
        }

        $scope.changeSpaceName=function () {
            $http.post('/ovu-energy/energy/report/space',{parkId:$scope.search.parkId},fac.postConfig).success(function (data) {
                data = data.data;
                $scope.spaceNameArr=[];
                if(!fac.isEmpty(data)){
                    data.forEach(function (v) {
                    $scope.spaceNameArr.push(v.spaceName);
                  })
                }
            })
        }
        $scope.changeCategory=function (id) {
            $http.post("/ovu-energy/energy/item/list",{classifyId:id},fac.postConfig).success(function (data) {
                $scope.fenXiangList=data.data;
            });
        }
    });
    app.controller('familySplitModalCtrl', function ($scope, $rootScope, $uibModal,$uibModalInstance, $state, $http, $filter, fac,param){
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
        $http.get('/ovu-energy/energy/report/space/trend',{params:param}).success(function (data) {
            data = data.data;
            $scope.familySplitData.title.text=(data.spaceName==undefined?'':data.spaceName)+'趋势图';
            $scope.familySplitData.title.subtext='业主：'+(data.ownerName==undefined?'':data.ownerName)+
                                                 '\n计量分类：'+(data.classifyName==undefined?'':data.classifyName)+
                                                 ' 计量分项：'+(data.itemName==undefined?'':data.itemName)+
                                                 ' 单位：'+(data.pointUnit==undefined?'':data.pointUnit);
            $scope.timeArr=[];
            $scope.valueArr=[];
            if(data.list){
                data.list.forEach(function (v) {
                    $scope.timeArr.push(v.time);
                    $scope.valueArr.push(v.value);
                })
                $scope.familySplitData.xAxis.data=$scope.timeArr;
                $scope.familySplitData.series[0].data=$scope.valueArr;
            }
        })
        $scope.familySplitData={
            title: {
                text: '水表1号总趋势图',
                subtext: '所属项目：创意天地 计量单位：m³',
                x:'center'
            },
            tooltip: {
                trigger: 'axis',
                formatter: function (params) {
                    if(params instanceof Array){
                        return  '时间：'+ ($scope.timeArr[params[0].dataIndex]==undefined?$scope.timeArr[params[0].dataIndex]='':$scope.timeArr[params[0].dataIndex])+'<br />'
                                +'数据：'+($scope.valueArr[params[0].dataIndex]==undefined?$scope.valueArr[params[0].dataIndex]='':$scope.valueArr[params[0].dataIndex]);
                    }
                }
            },
            xAxis:  {
                type: 'category',
                data: [],
                name:'时间'
            },
            yAxis: {
                type: 'value',
                name:'数值'
            },
            series: [
                {
                    type:'line',
                    data:[],
                }
            ]
        };
    });
})(angular)
