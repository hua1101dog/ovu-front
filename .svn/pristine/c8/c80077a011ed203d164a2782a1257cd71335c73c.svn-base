(function () {
    //ueditor和umeditor样式存在冲突，页面移除umeditor.css
    function removeStyles() {
        var filename = 'umeditor.css'; //移除引入的文件名
        var targetelement = "link";
        var targetattr = "href";
        var allsuspects = document.getElementsByTagName(targetelement)
        for (var i = allsuspects.length; i >= 0; i--) {
            if (allsuspects[i] && allsuspects[i].getAttribute(targetattr) != null && allsuspects[i].getAttribute(targetattr).indexOf(filename) != -1) {
                allsuspects[i].parentNode.removeChild(allsuspects[i])
            }
        }
    }
    removeStyles();





    var app = angular.module("angularApp");
    app.controller('alertsCtl', function ($scope, $rootScope, $http, $filter, $uibModal, fac) {
        document.title = "OVU-招商快讯";
        angular.extend($rootScope, fac.dicts);
        $scope.search = {};
        $scope.pageModel = {};
        $scope.isShow = true;

        $scope.find = function (pageNo) {
            // if(!app.park || !app.park.parkId){
            // 	window.msg("请先选择一个项目!");
            // 	return false;
            // }
            // if ($scope.pageModel.currentPage) {
            //     delete $scope.pageModel.currentPage;
            // }
            console.log($scope.pageModel)
            if (!$scope.search.endTime) {
                $scope.search.endTime = moment().format('YYYY-MM-DD')
                // console.log(moment().format('YYYY-MM-DD'))
            }
            $.extend($scope.search, {
                currentPage: pageNo || $scope.pageModel.currentPage || 1,
                pageSize: $scope.pageModel.pageSize || 10
            });
            $scope.search.pageIndex = $scope.search.currentPage - 1;
            $scope.search.totalCount = $scope.pageModel.totalCount || 0;
            $scope.search.businessType = 1
            // console.log($scope.search)
            fac.getPageResult("/ovu-park/backstage/bulletin/queryByTerm", $scope.search, function (data) {
                $scope.pageModel = data;
            });
        };
        $scope.find();
        // app.modulePromiss.then(function() {
        //     fac.initPage($scope,function(){
        //     	$scope.find();
        //     })
        // });

        // 删除实体项目
        $scope.del = function (news) {
            news.dataStatus = 0
            console.log(news)
            layer.confirm("<span style='color:#ff0000'>确定删除" + '《'+news.title+'》'+"</span>", function () {
                $http.post("/ovu-park/backstage/bulletin/update", {
                    id: news.id,
                    dataStatus: news.dataStatus
                }, fac.postConfig).success(function (resp) {
                    if (resp.code == 0) {
                        window.msg("删除成功!");
                        $scope.find();
                    } else {
                        alert(resp.msg);
                    }
                });
            })
        };

        // 预览
        $scope.pre = function (item) {
            var modal = $uibModal.open({
                animation: true,
                size: 'md',
                templateUrl: '/view/operationManage/newsManage/modal.preveiw.html',
                controller: 'previewCtrl',
                resolve: {
                    item: item
                }
            });
            modal.result.then(function () {
                // if($scope.pageModel.data.length == 1 && $scope.pageModel.currentPage > 1){
                //     $scope.pageModel.currentPage = $scope.pageModel.currentPage -1;
                // }
                $scope.find();
            }, function () {
                console.info('Modal dismissed at: ' + new Date());
            });
        };

        // 是否发布项目
        $scope.publish = function (news) {
            console.log(news)
            news.dataStatus = 1
            if (news.publishStatus == 2) {
                confirm("确定发布 " + news.title, function () {
                    $http.post("/ovu-park/backstage/bulletin/update", {
                        id: news.id,
                        dataStatus: news.dataStatus,
                        publishStatus: 1
                    }, fac.postConfig).success(function (resp) {
                        if (resp.code == 0) {
                            window.msg("发布成功!");
                            $scope.find();
                        } else {
                            alert(resp.msg);
                        }
                    });
                })
            } else {

            }
            if (news.publishStatus == 1) {
                confirm("确定撤回 " + news.title, function () {
                    $http.post("/ovu-park/backstage/bulletin/update", {
                        id: news.id,
                        dataStatus: news.dataStatus,
                        publishStatus: 2,
                        isTop: 0
                    }, fac.postConfig).success(function (resp) {
                        if (resp.code == 0) {
                            window.msg("撤回成功!");
                            $scope.find();
                        } else {
                            alert(resp.msg);
                        }
                    });
                })
            } else {

            }
        };

        //是否取消置顶
        $scope.isTop = function (news) {
            $scope.num = 0
            console.log($scope.pageModel, 1111)
            $scope.pageModel.data.forEach(ele => {
                if (ele.isTop == 1) {
                    $scope.num++
                    if ($scope.num == 5) {
                        alert('置顶数量最多5条！')
                        return false
                    }
                }
            });
            news.dataStatus = 1
            if (news.isTop == 0 && $scope.num < 5) {
                confirm("确定置顶 " + news.title, function () {
                    $http.post("/ovu-park/backstage/bulletin/update", {
                        id: news.id,
                        dataStatus: news.dataStatus,
                        isTop: 1
                    }, fac.postConfig).success(function (resp) {
                        if (resp.code == 0) {
                            window.msg("置顶成功!");
                            $scope.find();
                        } else {
                            alert(resp.msg);
                        }
                    });
                })
            } else {

            }
            if (news.isTop == 1) {
                confirm("确定取消置顶 " + news.title, function () {
                    $http.post("/ovu-park/backstage/bulletin/update", {
                        id: news.id,
                        dataStatus: news.dataStatus,
                        isTop: 0
                    }, fac.postConfig).success(function (resp) {
                        if (resp.code == 0) {
                            window.msg("取消成功!");
                            $scope.find();
                        } else {
                            alert(resp.msg);
                        }
                    });
                })
            } else {

            }
        };

        //编辑、新增
        $scope.showNews = function (news) {
            news = news || {
                creatorId: app.user.id,
                creatorName: app.user.nickname
            };
            // news.parkId = app.park.parkId;
            news.businessType = 1
            news.updatorId = app.user.id;
            var copy = angular.extend({}, news);
            var modal = $uibModal.open({
                animation: false,
                size: 'md',
                templateUrl: '/view/operationManage/newsManage/modal.editAlerts.html',
                controller: 'AAAA',
                resolve: {
                    news: copy
                }
            });
            modal.rendered.then(function () {
                // 页面加载后，调整编辑器的z-index，防止工具栏的层被遮挡
                setTimeout("$('#zskx > .edui-editor').css('z-index', '6666');", 1000);
                //     //初始化UM
                //     E = window.wangEditor;
                //     editor = new E('#alertsEditor');
                //     editor.customConfig.uploadImgShowBase64 = true;   // 使用 base64 保存图片
                //     editor.create();
                //     if(news.content){
                //         editor.txt.html(news.content);
                //     }
            });
            modal.result.then(function () {
                if ($scope.pageModel.data.length == 1 && $scope.pageModel.currentPage > 1) {
                    $scope.pageModel.currentPage = $scope.pageModel.currentPage - 1;
                }
                $scope.find();
            }, function () {
                console.info('Modal dismissed at: ' + new Date());
            });
            /*modal.rendered.then(function(){
                console.log("Modal rendered");
                $("#avatar").dropzone({
                    url: "/ovu-park/upload/img.do",
                    acceptedFiles:".png,.jpg,.jpeg,.gif",
                    init: function() {
                        this.on("success", function(file,json) {
                            if(json && json.status==1){
                                copy.PHOTO = json.url;
                                $scope.$apply();
                            }else{
                                alert("上传失败！");
                            }
                        });
                    }
                });
            });*/
        }

    });
    app.controller('AAAA', function ($scope, $http, $uibModalInstance, $filter, fac, news) {
        $scope.item = news;
        $scope.item.businessType = 1
        $scope.item.dataStatus = 1
        console.log($scope.item)
               if($scope.item.id){
                if($scope.item.topic!='' && $scope.item.topic!=null){
                    console.log(111,$scope.item.topic)
                    if($scope.item.topic.split(',')[0]==1){
                        $scope.item.topic1=1
                        $scope.item.pic1=$scope.item.topic.split(',')[1]
                    }else if($scope.item.topic.split(',')[0]==2){
                        $scope.item.topic2=1
                        $scope.item.pic2=$scope.item.topic.split(',')[1]
                    }else if($scope.item.topic.split(',')[0]==3){
                        $scope.item.topic3=1
                        $scope.item.pic3=$scope.item.topic.split(',')[1]
                    }
                }else{}
                if($scope.item.isDisplay!='' || $scope.item.isDisplay!=null){
                    $scope.item.isDisplay=parseInt($scope.item.isDisplay)
                }
               }
        $scope.item.pics = $scope.item.photo ? $scope.item.photo.split(",") : [];
        $scope.item.image = $scope.item.firstImage ? $scope.item.firstImage.split(",") : [];
        $scope.item.pic1 = $scope.item.pic1 ? $scope.item.pic1.split(",") : [];
        $scope.item.pic2 = $scope.item.pic2 ? $scope.item.pic2.split(",") : [];
        $scope.item.pic3 = $scope.item.pic3 ? $scope.item.pic3.split(",") : [];
        // $scope.item.type = news.type+"";
        console.log($scope.item)
        $scope.saveNews = function (form, item) {
            console.log(item)

            if (!item.title) {
                alert('请输入标题！')
                return false
            }
            if (item.outAddress) {
               if(item.outAddress.substring(0, 8)!='https://' && item.outAddress.substring(0, 7)!='http://'){
                    alert('请输入正确地址')
                    return false
           } else {
            }
        }
            if (item.isDisplay == 1) {
                console.log(item.image.length==0)
                if (item.image.length==0) {
                    alert('请上传首页显示图片！')
                    return false
                }else{
                }
            }else{
                item.isDisplay=0
                item.image=[]
            }
            if((item.topic1 == 1&&item.topic2 == 1)||(item.topic1 == 1&&item.topic3 == 1)||(item.topic3 == 1&&item.topic2 == 1&&item.topic2 == 1)||(item.topic1 == 1&&item.topic3 == 1)){
                alert('只能选择专题其中一个')
                return false
            }else{
                if (item.topic1 == 1) {
                    if (item.pic1.length==0) {
                        alert('请上传专题一图片！')
                        return false
                    }else{
                        item.topic=`1,`+item.pic1
                        console.log(item.topic)
                    }
                } else if (item.topic2 == 1) {
                    if (item.pic2.length==0) {
                        alert('请上传专题二图片！')
                        return false
                    }else{
                        item.topic=`2,`+item.pic2
                        console.log(item.topic)
                    }
                } else if (item.topic3 == 1) {
                    if (item.pic3.length==0) {
                        alert('请上传专题三图片！')
                        return false
                    }else{
                        item.topic=`3,`+item.pic3
                        console.log(item.topic)
                    }
                }else if (item.topic1 == 0) {                  
                        item.topic=''
                        console.log(item.topic)
                }else if (item.topic2 == 0) {                  
                    item.topic=''
                    console.log(item.topic)
            }else if (item.topic3 == 0) {                  
                item.topic=''
                console.log(item.topic)
        }
            }
            item.businessType=1
            item.photo = item.pics.join(",");
            item.firstImage=item.image.join(',')
            console.log(item.firstImage,item.businessType)
            // $uibModalInstance.close();
            if (item.id) {               
                $http.post("/ovu-park/backstage/bulletin/update", item, fac.postConfig).success(function (resp) {
                    if (resp.code == 0) {
                        $uibModalInstance.close();
                        window.msg("修改成功!");

                    } else {
                        alert(resp.msg);
                    }
                });
            } else {

            }
            if (!item.id) {
                $http.post("/ovu-park/backstage/bulletin/save", item, fac.postConfig).success(function (resp) {
                    if (resp.code == 0) {
                        $uibModalInstance.close();
                        window.msg("新增成功!");
                    } else {
                        alert(resp.msg);
                    }
                });
            } else {

            }
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    });
    app.controller('previewCtrl', function ($scope, $http, $uibModalInstance, $filter, $uibModal, fac, item) {
        $scope.item = item;


        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    });
})();
