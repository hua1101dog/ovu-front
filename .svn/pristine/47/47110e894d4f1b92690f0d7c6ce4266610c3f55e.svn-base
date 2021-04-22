/**
 * Created by wangheng on 2017/9/19.
 * 通知
 */
(function() {
    "use strict";
    var app = angular.module("app",['ng.ueditor']);

    //list控制器
    app.controller('NewsCtrl', NewsCtrl);
    function NewsCtrl($scope, $http,$state, fac) {
        var vm = this;
        $scope.pageModel = {};
        $scope.search = {};
        vm.title = "行业新闻";
        //查看
        vm.see = function (newsId) {
            if(!fac.isEmpty(newsId)) {
                $state.go('app.homeManage.news.details', {id: newsId});
            }
        }
        // 新增
        vm.add = function(){
            $state.go('app.homeManage.news.add');
        }
        // 修改
        vm.edit = function(newsId){
            if(!fac.isEmpty(newsId)) {
                $state.go('app.homeManage.news.add', {id: newsId});
            } else {
            }
        }
        //批量删除
        vm.batchDel = function () {
            var ids = $scope.pageModel.list.reduce(function(ret, n) {
                n.checked && ret.push(n.newsId);
                return ret
            }, []);
            del(ids);
        }
        //单个删除
        vm.del = function (id) {
            del([id]);
        }

        function del(ids) {
            confirm("确认删除?", function() {
                $http.post("/ovu-pcos/pcos/govcloud/news/delete.do", {
                    "newsIds": ids.join()
                }, fac.postConfig).success(function(resp) {
                    if (resp.success) {
                        $scope.find();
                    } else {
                        alert(resp.error);
                    }
                })
            });
        }

        $scope.find = function(pageNo){
            angular.extend($scope.search,{currentPage:pageNo||$scope.pageModel.currentPage||1,pageSize:$scope.pageModel.pageSize||10});
            fac.getPageResult("/ovu-pcos/pcos/govcloud/news/list.do",$scope.search,function(data){
                $scope.pageModel = data;
            });
        };

        $scope.find(1);

    }

    app.controller('NewsAddCtrl', NewsAddCtrl);
    function NewsAddCtrl($scope,$state, $http, fac) {
        var vm = this;
        vm.item={};
        vm.titles=['行业新闻','新增行业新闻'];
        //是否展示类型这个字段
        vm.showType = true;
        //类型下拉框
        vm.typeDict  = fac.dicts.newsTypeDict;
        var newsId = $state.params.id;
        //修改
        vm.item.pics=[];
        if(fac.isNotEmpty(newsId)){
            vm.titles[1] = '编辑行业新闻';
            $http.get("/ovu-pcos/pcos/govcloud/news/get.do?newsId="+newsId).success(function(data) {
                vm.item = data || {};
                if(!data.imgPaths){
                    vm.item.pics=[];
                }else{
                    vm.item.pics=data.imgPaths.split(",") || [];
                }
               
                vm.changeType();
            }).error(function () {
                alert();
            })
        }
       
        //ue空间准备就绪便会触发
        $scope.ready = function(editor){
        }
        //保存
        vm.save = function (form,item) {
            form.$setSubmitted(true);
            if(!form.$valid){
                return;
            }
            item.pics && ( item.pics = item.pics.join(","))
            
            var param = {title:item.title,content:item.content,type:item.type,imgPaths: item.pics,newsId:newsId};
            $http.post("/ovu-pcos/pcos/govcloud/news/edit.do",param,fac.postConfig).success(function(data) {
                if(data.success){
                    msg("保存成功!");
                    stateGoList($state);
                  
                } else {
                    alert();
                }
            })
        }

        vm.cancel = function () {
            stateGoList($state);
        }
      
        //添加照片
       /* vm.addPhoto =function (item){
            fac.upload({url:"/ovu-pcos/upload/img.do"},function(resp){
                if(resp.status==1){
                    vm.item.imgPaths=resp.url;
                    $scope.$apply();
                }else{
                    alert(resp.error);
                }
            })
        }*/
        //改变类型
        vm.changeType =function () {
            if(vm.item.type == 1){

                vm.hideUe = true;
            }else{
                vm.hideUe = false;
            }
        }
    }
    //查看详情
    app.controller('NewsDetailsCtrl', NewsDetailsCtrl);
    function NewsDetailsCtrl($scope,$state, $http) {
        var vm = this;
        vm.item={};
        vm.titles=['行业新闻','查看行业新闻'];
        //修改
        $http.get("/ovu-pcos/pcos/govcloud/news/get.do?newsId="+$state.params.id).success(function(data) {
            if(data.type == 1){
                data.imgPaths=data.imgPaths.split(",") || [];
                // vm.item.pics=data.imgPaths.split(",") || [];
               
               var img=  data.imgPaths.map(function(v){
                
              return   '<div><img style="display: block;" src="'+v+'" /></div><br />'
                   
                }).join('')
               
              
                // var content="<h2 style='text-align: center;'>"+data.title+"</h2>"
                //             +"<img style='height: auto;' src='"+data.imgPaths+"' />";
                var content="<h2 style='text-align: center;'>"+data.title+"</h2>"
               +"<div >"+img+"</div>";
                            
                            
            }else{
                var content="<h2 style='text-align: center;'>"+data.title+"</h2>"+data.content || '';
            }
            vm.item.content =content;
        }).error(function () {
            alert();
        })

        //ue空间准备就绪便会触发
        $scope.ready = function(editor){
            //禁用ue只能查看
            editor.setDisabled('fullscreen');
        }

        vm.cancel = function () {
            stateGoList($state);
        }
    }

    function stateGoList($state) {
        $state.go('app.homeManage.news.list');
    }
})();
