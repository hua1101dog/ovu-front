(function() {
        var app = angular.module("angularApp");
        app.controller('newsCtl', function ($scope, $rootScope, $http, $uibModal, fac) {  
        	document.title ="OVU-工单报表";         
            angular.extend($rootScope,fac.dicts);
            $scope.search = {
                serviceType:0,
            };
            $scope.pageModel = {};
            $scope.isShow = true;
            // 查询
            $scope.find = function(pageNo){
                if(!app.park || !app.park.ID){
					window.msg("请先选择一个项目!");
					return false;
				}
				$scope.search.parkId = app.park.ID;
                $.extend($scope.search,{currentPage:pageNo||$scope.pageModel.currentPage||1,pageSize:$scope.pageModel.pageSize||10});
                
                $scope.search.pageIndex = $scope.search.currentPage-1;
                $scope.search.totalCount = $scope.pageModel.totalCount||0;  
                $scope.search.serviceType = 0;  
                // $scope.search.workUnitName = ""
                 // 工单列表
                console.log(pageNo);//2
                console.log("工单报表params：",$scope.search)
                var aa = pageNo;
                var params = {
                    serviceType:0,
                    pageIndex:aa||$scope.pageModel.currentPage||1,
                    totalCount:$scope.pageModel.totalCount||0,
                    pageSize:$scope.pageModel.pageSize||10,
                    name:$scope.search.name,
                    workUnitName:$scope.search.workUnitName,
                    fromCreateTime:$scope.search.fromCreateTime,
                    toCreateTime:$scope.search.toCreateTime
                }
                fac.getPageResult("/ovu-park/backstage/serviceOrder/list", $scope.search,function(data){ 
                    console.log($scope.search);   
                    $scope.pageModel = data;
                });
                var data1 = {
                	parkId:app.park.ID,
                    serviceType:0,
                    name:$scope.search.name,
                    workUnitName:$scope.search.workUnitName,
                    fromCreateTime:$scope.search.fromCreateTime,
                    toCreateTime:$scope.search.toCreateTime
                }
                // 工单状态统计  左
                $.post("/ovu-park/backstage/serviceOrder/getCntByWorkStatus",data1,function(resp){
                    if(resp.code){
                        console.log("左",resp);
                        initStatusPie(resp.data);
                    }
                })
                // 工单分类统计  右
                $.post("/ovu-park/backstage/serviceOrder/getCntByWorkName",data1,function(resp){
                    console.log("分类统计",data1)
                    if(resp.code){
                        console.log("右",resp);
                        initClassifyPie(resp.data);
                    }
                })       
            };      
            
            //格式化工单状态
            $scope.validateStatus=["待派发","待接收","","","已退回","待执行","","待评价","已关闭"];
            //工单状态统计 左
            function initStatusPie(data) {              
                var legendData = data.map(function(n){
                    return n.name+"("+n.value+")条";
                });
                var seriesData = data.map(function(n){
                    n.name = n.name+"("+n.value+")条";
                    return n;
                });
                var total = 0;
                for(var i in data){
                    total+=data[i].value;
                }           
                var myChart = echarts.init(document.getElementById('status'));
                option = {
                        title : {
                            text: '总计：' + total+'条',
                            textStyle:{
                                fontSize:'16'
                            },
                            x:'center'
                        },
                        tooltip : {
                            trigger: 'item',
                            formatter: "{b} : {c} ({d}%)"
                        },
                        legend: {
                            orient: 'vertical',
                            left: 'left',
                            data:legendData
                        },
                        series : [
                            {
                                name: '',
                                type: 'pie',
                                radius : '55%',
                                center: ['50%', '60%'],
                                data:seriesData,
                                itemStyle: {
                                       normal:{
                                         label:{
                                         show:true,
                                         formatter: '{b}'
                                         },
                                         labelLine:{
                                         show:true
                                         }
                                         },
                                           emphasis: {
                                               shadowBlur: 10,
                                               shadowOffsetX: 0,
                                               shadowColor: 'rgba(0, 0, 0, 0.5)'
                                           }
                                       }                                
                            }
                        ]
                        
                    };
                myChart.setOption(option);
                window.addEventListener("resize",function(){
                    myChart.resize();
                });
            }
            //工单分类统计 右
            function initClassifyPie(data) {
                var legendData = data.map(function(n){
                    return n.name+"("+n.value+")条";
                });
                var seriesData = data.map(function(n){
                    n.name = n.name+"("+n.value+")条";
                    return n;
                });
                var myChart = echarts.init(document.getElementById('classify'));            
                option = {
                    tooltip: {
                        trigger: 'item',
                        formatter: "{b}: {c} ({d}%)"
                    },
                    legend: {
                        orient: 'vertical',
                        x: 'left',
                        data:legendData
                    },
                    series: [
                        {
                            name:'',
                            type:'pie',
                            radius: ['40%', '70%'],
                            avoidLabelOverlap: false,
                            label: {
                                normal: {
                                    show: false,
                                    position: 'center'
                                },
                                emphasis: {
                                    show: true,
                                    textStyle: {
                                        fontSize: '30',
                                        fontWeight: 'bold'
                                    }
                                }
                            },
                            labelLine: {
                                normal: {
                                    show: false
                                }
                            },
                            data:seriesData
                        }
                    ]
                };
                myChart.setOption(option);
                window.addEventListener("resize",function(){
                    myChart.resize();
                });
            }
            loadWorkNameListParm();

           
            app.modulePromiss.then(function() {
                fac.initPage($scope,function(){
                	$scope.find();
                })
            });
            // 工单类型  下拉框
            function loadWorkNameListParm(){
                $scope.workNameList = [];
                // fac.getPageResult("/ovu-park/serviceOrder/getAllWorkName.do",$scope.search,function(data){
                //     $scope.workNameList = data.workNameList;
                // });

                var params = {
                    serviceType:0
                }
                console.log("工单类型params",$scope.search);

                // $.post("/ovu-park/backstage/serviceOrder/getAllWorkName",params,function(){
                //     if(data.code){
                //         $scope.workNameList = data.workNameList;
                //     }else{
                //         window.alert(data.message);
                //     }
                // })
                // fac.getPageResult("/ovu-park/backstage/serviceOrder/getAllWorkName",params,function(data){          
                //     if(data.code){
                //         $scope.workNameList = data.workNameList;
                //     }else{
                //         window.alert(data.message);
                //     }
                // });
                $http({      
                    method: "POST",      
                    url:"/ovu-park/backstage/serviceOrder/getAllWorkName",    
                    data: params,    
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },    
                    transformRequest: function(obj) {    
                        var str = [];    
                        for (var s in obj) {    
                                str.push(encodeURIComponent(s) + "=" + encodeURIComponent(obj[s]));    
                        }
                        return str.join("&");    
                    }    
                }).success(function(data){
                    if(data.code){
                        $scope.workNameList = data.data;
                    }else{
                        window.alert(data.message);
                    }
                });

                // fac.getPageResult("/ovu-park/backstage/serviceOrder/getAllWorkName",$scope.search,function(data){

                //     if(data.code){
                //         $scope.workNameList = data.workNameList;
                //     }else{
                //         window.alert(data.message);
                //     }
                // });
            }
            //导出excel
            $scope.excelData = function(){
                // 企业名称 
                var  name = $scope.search.name  || null;
                // 工单类型
                var  workUnitName = encodeURI($scope.search.workUnitName || null);
                var  fromCreateTime = $scope.search.fromCreateTime || null;
                var  toCreateTime = $scope.search.toCreateTime || null;
                var pageIndex = $scope.search.currentPage - 1;
                var pageSize = $scope.search.pageSize;
                var requestData = "parkId="+app.park.ID+"&pageIndex=" + pageIndex + "&pageSize="+ pageSize
                /*if (name && typeof(name)!= 'undefined') {
                    requestData += "&name=" + name;
                }
                if (workUnitName && workUnitName!= undefined) {
                    requestData += "&workUnitName=" + workUnitName;
                }
                if (fromCreateTime && fromCreateTime!= undefined) {
                    requestData += "&fromCreateTime=" + fromCreateTime;
                }
                if (toCreateTime && typeof(toCreateTime)!= 'undefined') {
                    requestData += "&toCreateTime=" + toCreateTime;
                }*/
                requestData += "&name=" + name;
                requestData += "&workUnitName=" + workUnitName;
                requestData += "&fromCreateTime=" + fromCreateTime;
                requestData += "&toCreateTime=" + toCreateTime;
                var  url = encodeURI("/ovu-park/backstage/serviceOrder/excelData?"+ requestData);
                console.info(url);
                window.location.href = url;
            }       
        }); 
    })()