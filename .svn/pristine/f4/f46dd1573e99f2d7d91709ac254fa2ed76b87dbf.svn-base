(function () {
    // ueditor和umeditor样式存在冲突，页面移除umeditor.css
    function removeStyles(){
        var filename = 'umeditor.css';  //移除引入的文件名
        var targetelement = "link";
        var targetattr = "href";
        var allsuspects = document.getElementsByTagName(targetelement)
        for (var i = allsuspects.length; i>=0 ; i--){
            if (allsuspects[i] && allsuspects[i].getAttribute(targetattr) != null && allsuspects[i].getAttribute(targetattr).indexOf(filename) != -1) {
                allsuspects[i].parentNode.removeChild(allsuspects[i])
            }
        }
    }
    removeStyles();
    var app = angular.module("angularApp");
    app.controller('cartCtl', function ($scope, $rootScope, $http, $filter, $uibModal, fac) {
        document.title = "OVU-产业智库";
        angular.extend($rootScope, fac.dicts);
        $scope.search = {};
        $scope.pageModel = {};
        $scope.isShow = true;
        $scope.find = function (pageNo) {
            // if(!app.park || !app.park.parkId){
            // 	window.msg("请先选择一个项目!");
            // 	return false;
            // }
            // if($scope.pageModel.currentPage){
            //     delete $scope.pageModel.currentPage;
            // }
            if (!$scope.search.endTime) {
                $scope.search.endTime = moment().format('YYYY-MM-DD')
            }
            $.extend($scope.search, {
                currentPage: pageNo || $scope.pageModel.currentPage || 1,
                pageSize: $scope.pageModel.pageSize || 10
            });
            $scope.search.pageIndex = $scope.search.currentPage - 1;
            $scope.search.totalCount = $scope.pageModel.totalCount || 0;
            $scope.search.businessType = 2
            fac.getPageResult("/ovu-base/system/dictionary/get", $scope.search, function (data) {
                $scope.contentTypeList = data.INDUSTRY_CATEGORY;
            });
            // $scope.search.INDUSTRY_CATEGORY='INDUSTRY_CATEGORY'
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
            layer.confirm("<span style='color:#ff0000'>确定删除 " + '《' + news.title + '》' + "</span>", function () {
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
            }, function () {});
        };

        // 是否发布项目
        $scope.publish = function (news) {
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

        //编辑、新增
        $scope.editCart = function (news) {
            news = news || {
                creatorId: app.user.id,
                creatorName: app.user.nickname
            };
            news.parkId = app.park.parkId;
            news.updatorId = app.user.id;
            news.contentTypeList = $scope.contentTypeList
            news.businessType = 2
            var editor;
            var E
            if (news.id) {
                news.contentType = news.contentType.toString()
            }
            news.contentTypeList.forEach(ele => {
                if (ele.dicSort == news.contentType) {
                    news.contentTypeName = ele.dicItem
                }
            });
            var copy = angular.extend({}, news);
            console.log(news)
            var modal = $uibModal.open({
                animation: false,
                size: 'lg',
                templateUrl: '/view/operationManage/newsManage/modal.editCart.html',
                controller: 'editCart',
                resolve: {
                    news: copy
                }
            });
            modal.rendered.then(function () {
                // 页面加载后，调整编辑器的z-index，防止工具栏的层被遮挡
                setTimeout("$('#cyzk > .edui-editor').css('z-index', '6666');", 1000);
                //     //初始化UM
                //     E = window.wangEditor;
                //     editor = new E('#cartEditor');
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
            }, function () {});
        }

        $scope.maintain = function (news) {
            var copy = angular.extend({}, news);
            var modal = $uibModal.open({
                animation: false,
                size: 'lg',
                templateUrl: '/view/operationManage/newsManage/modal.maintain.html',
                controller: 'BBBB',
                resolve: {
                    news: copy
                }
            });
            modal.result.then(function () {
                if ($scope.pageModel.data.length == 1 && $scope.pageModel.currentPage > 1) {
                    $scope.pageModel.currentPage = $scope.pageModel.currentPage - 1;
                }
                $scope.find();
            }, function () {
                console.info('Modal dismissed at: ' + new Date());
            });
        }
        // $scope.find(1);
    });
    app.controller('editCart', function ($scope, $rootScope, $http, $uibModalInstance, $filter, fac, news) {
        $scope.item = news;
        console.log(news)
        $scope.item.businessType = 2
        $scope.item.dataStatus = 1
        $http.post("/ovu-base/system/dictionary/get", fac.postConfig).success(function (resp) {
            if (resp.code == 0) {
                $scope.contentTypeList = resp.data.INDUSTRY_CATEGORY;
                $rootScope.dicData = resp.data;
            }
            if ($scope.item.contentType == 'INDUSTRY_RESEARCH') {
                $scope.contentTypeList = $rootScope.dicData[$scope.item.contentType];
            } else if ($scope.item.contentType == "INDUSTRY_INSIGHT") {
                $scope.secondTypeList = $rootScope.dicData[$scope.item.contentType];
            }
        });
        $scope.item.pics = $scope.item.photo ? $scope.item.photo.split(",") : [];
        $scope.item.image = $scope.item.topImage ? $scope.item.topImage.split(",") : [];
        $scope.item.listView1 = $scope.item.listView ? $scope.item.listView.split(",") : [];
        $scope.item.type = news.type + "";

        $scope.contentType = function (item) {
            console.log( $rootScope.dicData)
            $scope.secondTypeList = $rootScope.dicData[item.contentType];
            console.log($scope.secondTypeList)
        }
        console.log($scope.item)
        $scope.saveNews = function (from, item) {
            item.contentTypeList.forEach(ele => {
                if (ele.dicCode == item.contentType) {
                    item.contentTypeName = ele.dicItem
                }
            });
            if (item.secondTypeList) {
                item.secondTypeList.forEach(ele => {
                    if (ele.dicSort == item.secondType) {
                        item.secondTypeName = ele.dicItem
                    }
                });
            }
            if (item.pics.length > 1) {
                window.msg("最多只能上传1张图片, 请删除多余的图片!");
                return false;
            }

            if (item.id) {
                if (!item.title) {
                    alert('请输入标题！')
                    return false
                }
                if (!item.contentType) {
                    alert('请选择分类！')
                    return false
                }
                if (item.outAddress) {
                    if (item.outAddress.substring(0, 8) != 'https://' && item.outAddress.substring(0, 7) != 'http://') {
                        alert('请输入正确地址')
                        return false
                    } else {

                    }
                }
                // if (item.photo == '') {
                //     alert('请上传图片！')
                //     return false
                // }
                if (item.isTop == 1) {
                    console.log(item.image)
                    if (item.image.length == 0) {
                        alert('请上传置顶图！')
                        return false
                    }
                } else {}
                if (item.listView1.length == 0) {
                    alert('请上传列表图！')
                    return false
                }
                item.businessType = 2
                item.photo = item.pics.join(",");
                item.topImage = item.image.join(",");
                item.listView = item.listView1.join(",");
                // item.content=item.conent.replace(/"/g, '\"');
                $http.post("/ovu-park/backstage/bulletin/update", item, fac.postConfig).success(function (resp) {
                    if (resp.code == 0) {
                        $uibModalInstance.close();
                        window.msg("修改成功!");

                    } else {
                        alert(resp.msg);
                    }
                });
            } else {
                if (!item.title) {
                    alert('请输入标题！')
                    return false
                }
                if (!item.contentType) {
                    alert('请选择分类！')
                    return false
                }
                if (item.outAddress) {
                    var reg = /^([hH][tT]{2}[pP]:\/\/|[hH][tT]{2}[pP][sS]:\/\/)(([A-Za-z0-9-~]+)\.)+([A-Za-z0-9-~\/])+$/;
                    if (!reg.test(item.outAddress)) {
                        alert('请输入正确地址')
                        return false
                    }
                } else {

                }
                if (item.isTop == 1) {
                    if (item.image.length == 0) {
                        alert('请上传置顶图！')
                        return false
                    }
                } else {}
                if (item.listView1.length == 0) {
                    alert('请上传列表图！')
                    return false
                }
                item.businessType = 2
                item.photo = item.pics.join(",");
                item.topImage = item.image.join(",");
                item.listView = item.listView1.join(",");
                $http.post("/ovu-park/backstage/bulletin/save", item, fac.postConfig).success(function (resp) {
                    if (resp.code == 0) {
                        $uibModalInstance.close();
                        window.msg("新增成功!");
                    } else {
                        alert(resp.msg);
                    }
                });
            }

        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    });

    /* 预览 - 控制器 */
    app.controller('previewCtrl', function ($scope, $http, $uibModalInstance, $filter, $uibModal, fac, item) {
        $scope.item = item;


        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    });

    //首页维护
    app.controller('BBBB', function ($scope, $http, $uibModalInstance, $filter, $uibModal, fac, news) {
        $scope.item = news;
        $scope.item.slideshow = []
        $scope.item.magazine = []
        $scope.item.industryResearch = []
        $scope.item.layoutResearch = []
        //请求维护数据
        $http.post("/ovu-park/backstage/HomeMaintain/queryData").success(function (resp) {
            if (resp.code == 0) {
                $scope.item.slideshow = [resp.data.slideshow]
                $scope.item.magazine = [resp.data.magazine]
                $scope.item.industryResearch = [resp.data.industryResearch]
                $scope.item.layoutResearch = [resp.data.layoutResearch]
                $scope.item.magazineTitle = resp.data.magazineTitle
                $scope.item.industryStudyTitle = resp.data.industryStudyTitle
                $scope.item.layoutStudyTitle = resp.data.layoutStudyTitle
                $scope.item.id = resp.data.id
            } else {
                alert(resp.msg);
            }
        });

        $scope.saveNews = function (item) {
            item.slideshow = item.slideshow.toString()
            item.magazine = item.magazine.toString()
            item.industryResearch = item.industryResearch.toString()
            item.layoutResearch = item.layoutResearch.toString()
            item.parkId = item.parkId
            item.magazineTitle = item.magazineTitle
            item.industryStudyTitle = item.industryStudyTitle
            item.layoutStudyTitle = item.layoutStudyTitle
            item.id = item.id
            $scope.item = JSON.stringify(item)
            $http.post("/ovu-park/backstage/HomeMaintain/saveOrUpdate", $scope.item).success(function (resp) {
                if (resp.code == 0) {
                    window.msg("修改成功!");
                    $uibModalInstance.close();
                } else {
                    alert(resp.msg);
                }
            });
        }
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    });
})();
