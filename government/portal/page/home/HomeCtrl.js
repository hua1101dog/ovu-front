/**
 * Created by wangheng on 2017/9/19.
 * 通知
 */
(function() {
    "use strict";
    var app = angular.module("app");

    //通知list控制器
    app.controller('HomeCtrl', HomeCtrl);
    function HomeCtrl($scope, $http,$state, fac) {
        var vm=this;
        vm.myInterval = 5000;  //图表轮播间隔
        vm.active = 0;  //图表当前索引

        //点击每个新闻
        vm.see = function (item) {
            if(item.noticeId){
                $state.go('app.notifyDetail',{id:item.noticeId});
            }else if(item.newsId){
                $state.go('app.newsDetail',{id:item.newsId});
            }else if(item.guideId){
                $state.go('app.guideDetail',{id:item.guideId});
            }else if(item.dataId){
                $state.go('app.dataDetail',{id:item.dataId});
            }
        }

        //登录
        vm.login = function (form,item) {
            form.$setSubmitted(true);
            if(!form.$valid){
                return;
            }
            item.password = base64encode(item.password);
            $http.post("/ovu-base/login",item,fac.postConfig).success(function(data) {
                if(data.success){
                    window.location.href = data.url;
                }else{
                    alert(data.error);
                }
            }).error(function () {
                alert("服务器登录异常！");
            })
        }

        //设备查询
        vm.searchSensor = function (form,item) {
            form.$setSubmitted(true);
            if(!form.$valid){
                return;
            }
            $http.get("/ovu-pcos/pcos/equipment/get.do?regiCode="+item.regiCode+"&maintainName="+item.maintainName).success(function(data) {
                if(data.success){
                    $state.go('app.sensorDetail',{sensorData:data});
                }else{
                    alert('请输入正确的查询条件!');
                }
            }).error(function () {
                alert("请输入正确的查询条件!");
            })
        }

        //人员查询
        vm.searchUser = function (form,item) {
            form.$setSubmitted(true);
            if(!form.$valid){
                return;
            }
            $http.get("/ovu-base/pcos/person/getPersonInfoByName.do",{params:item}).success(function(data) {
                if(fac.isNotEmpty(data)){
                    $state.go('app.userDetail',{userData:data});
                }else{
                    alert('请输入正确的查询条件!');
                }
            }).error(function () {
                alert("请输入正确的查询条件!");
            })
        }


        //接口数据
        //通知公告数据
        var param={currentPage:1,pageSize:5,pageIndex:0,noFilter:true};
        $http.post("/ovu-pcos/pcos/govcloud/notice/list.do",param,fac.postConfig)
            .success(function(data){
                vm.noticeList = data.data || [];
        });
        //行业新闻。图表新闻
        $http.post("/ovu-pcos/pcos/govcloud/news/list.do",angular.extend({type:1},param),fac.postConfig)
            .success(function(data){
                vm.news1List = data.data || [];
                if(vm.news1List){
                  var img=  vm.news1List.map(function(v){
                        return v.imgPaths=v.imgPaths.split(",") || [];
                    })
                }
              console.log(vm.news1List);
            });
        //行业新闻。文字新闻
        param.pageSize = 6;
        $http.post("/ovu-pcos/pcos/govcloud/news/list.do",angular.extend({type:2},param),fac.postConfig)
            .success(function(data){
                vm.news2List = data.data || [];
        });
        //公示数据>培训考试结果
        $http.post("/ovu-pcos/pcos/govcloud/data/list.do",angular.extend({type:1},param),fac.postConfig)
            .success(function(data){
                vm.data1List = data.data || [];
        });
        //公示数据>设备注册登记结果公示
        $http.post("/ovu-pcos/pcos/govcloud/data/list.do",angular.extend({type:2},param),fac.postConfig)
            .success(function(data){
                vm.data2List = data.data || [];
            });
        //业务指南
        param.pageSize=12;
        vm.guide1List=[];
        vm.guide2List=[];
        $http.post("/ovu-pcos/pcos/govcloud/guide/list.do",angular.extend(param),fac.postConfig)
            .success(function(data){
                if(angular.isArray(data.data)){
                    data.data.forEach(function (da,index) {
                        if(index < 6){
                            vm.guide1List.push(da);
                        }else{
                            vm.guide2List.push(da);
                        }
                    })
                }
            });

    }

})();
