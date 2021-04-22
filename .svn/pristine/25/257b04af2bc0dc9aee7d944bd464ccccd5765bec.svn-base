/**
 * Created by Cx on 2019/4/4.
 */
(function () {
    "use strict";
    var app = angular.module("angularApp");

    // 缴费Controller
    app.controller('paymentReportCtrl', function ($scope, $rootScope, $sce, $uibModal, $state, $http, $filter, fac) {
        document.title = 'OVU-缴费报表';
        $scope.pageModel = {};
        $scope.search = {};
        $scope.search.type=1

        // 页面初始化
            app.modulePromiss.then(function(){
            	$scope.$watch('dept.id', function (deptId, oldValue) {
	                if (deptId) {
	                    if ($scope.dept.parkId) {
	                        $scope.search.parkId = $scope.dept.parkId;
	                        $scope.search.parkName = $scope.dept.parkName;
	                        $scope.init()
	                    } else {
                            alert('请选择跟项目关联的部门');
                            $scope.search.parkId &&  delete $scope.search.parkId
                            $scope.search.parkName &&  delete $scope.search.parkName;
	                      
	                    }
	
	                }
            	})
            	
                
            })
     
        
        $scope.init=function(){
           $scope.search.startTime=moment().subtract(1, 'months').format('YYYY-MM-DD');
           $scope.search.endTime=moment().format('YYYY-MM-DD');
            selectClassify();
            $scope.find();
        }
        
       
        
        function selectClassify() {
            $http.get("/ovu-energy/energy/classify/list.do").success(function (data) {
                $scope.measureCategory=data.data;
            });
        }

		$scope.changeCategory = function (id) {
            $http.post("/ovu-energy/energy/item/list", {
                classifyId: id
            }, fac.postConfig).success(function (data) {
                $scope.fenXiangList = data.data;
            });
        }

        // 查询
        $scope.find = function (pageNo) {
     
            $.extend($scope.search, {currentPage: pageNo || 1, pageSize: $scope.pageModel.pageSize || 10});
            $scope.search.pageIndex = $scope.search.currentPage - 1;
            fac.getPageResult(" /ovu-energy/energy/billing/record/page", $scope.search, function (data) {
            	var pageModel = data;
                if (pageModel.data != undefined) {
                    pageModel.data = pageModel.data.map(function (item) {
                        item.spaceName =  item.spaceName && $sce.trustAsHtml(item.spaceName.split(",").map(function (v, i) {
                            return (i + 1) + '.' + v;
                        }).join('<br>'));
                        return item;
                    })
                }
                $scope.pageModel = pageModel;
            });
        }
      
        //充值统计
        $scope.total=function(item){
          
            var data={parkId:$scope.search.parkId,startTime:$scope.search.startTime,endTime:$scope.search.endTime}
            var modal = $uibModal.open({
                animation: false,
                size: 'lg',
                templateUrl: '/view/energy/chargingManage/payment/modal.payTotalModal.html',
                controller: 'payTotalCtrl',
                resolve: {
                    param: data
                }
            });
            modal.result.then(function () {
                $scope.find();
            }, function () {
                $scope.find();
            });
        }
        $scope.exportForm=function () {
            var url = "/ovu-energy/energy/billing/record/export?parkId="+$scope.search.parkId;
            if($scope.search.startTime){
                url = url + "&startTime=" + $scope.search.startTime;
            }
            if($scope.search.endTime){
                url = url + "&endTime=" + $scope.search.endTime;
            }
            window.location.href=url;
            

        }
       
    });
    
   
    app.controller('payTotalCtrl', function ($scope, $uibModal, $uibModalInstance, $http, $timeout,fac,param){
        var vm = $scope.vm = this;
        var dataList=[]
        $http.post('/ovu-energy/energy/billing/record/stats',param,fac.postConfig).success(function (data) {
           if(data.code==0){
            dataList=data.data ||[];
            var nameList=[];
           var valueList=[]
           dataList && dataList.forEach((v)=>{
            nameList.push(v.name);
            valueList.push(v.value)

           })
           initPayment(nameList,valueList)

           }
           
        })
        function initPayment(data1, data2) {
            var myChartPayment = echarts.init(document.getElementById('paymentData'));
            var paymentOption = {
                tooltip: {
                    trigger: 'item',
                    axisPointer: { // 坐标轴指示器，坐标轴触发有效
                        type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
                    },
                },
                xAxis: {
                    data: data1,
                    silent: false,
                    axisLine: {
                        onZero: true
                    },
                    splitLine: {
                        show: false
                    },
                    splitArea: {
                        show: false
                    },
                    axisLabel: {
                        interval: 0,
                        rotate: -45, //倾斜度 -90 至 90 默认为0
                        textStyle: {
                            fontSize: "12"

                        }
                    }
                },
                yAxis: [{
                    name:'元',
                    splitArea: {
                        show: false
                    },
                    
                }],
                grid: {
                    left: '10%',
                    bottom: '20%'
                },
                series: [{
                    name: '充值总额',
                    type: 'bar',

                    data: data2,
                    barGap: '0%',
                    label: {
                        normal: {
                            show: true,
                            position: 'outside',
                            formatter: "{c}"
                        }
                    },
                    itemStyle: {
                        normal: {
                            color: function (params) {
                                //自定义颜色
                                var colorList = [
                                    'rgba(96, 157, 202)'
                                ];
                                return colorList[params.dataIndex]



                            },
                        }
                    }

                },
                ]
            };
            myChartPayment.setOption(paymentOption);
            //图标自适应大小
            window.addEventListener('resize', function () {
                myChartPayment.resize();

            });
        }
       
       
       
    	//点击取消
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    });
   
})();
