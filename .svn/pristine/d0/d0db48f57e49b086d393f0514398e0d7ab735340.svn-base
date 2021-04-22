(function () {
    var app = angular.module("angularApp");
    app.controller('groupPlanCtrl', function ($scope, $rootScope, $http, $filter, $uibModal, fac) {
        angular.extend($rootScope, fac.dicts);
        document.title = "OVU-方案管理";
        $scope.search = {};
        $scope.pageModel = {};
        $scope.isShow = true;

        $scope.find = function (pageNo) {
            if ($scope.pageModel.currentPage) {
                delete $scope.pageModel.currentPage;
            }
            angular.extend($scope.search, {
                currentPage: pageNo || $scope.pageModel.currentPage || 1,
                pageSize: $scope.pageModel.pageSize || 10
            });
            $scope.search.pageIndex = $scope.search.currentPage - 1;
            $scope.search.totalCount = $scope.pageModel.totalCount || 0;


            fac.getPageResult("/ovu-park/backstage/solution/list", $scope.search, function (data) {
                $scope.pageModel = data;
            });

            fac.getResult("/ovu-park/backstage/solution/listSolutionType", {text: '请求解决方案类型列表'}, function (data) {
                $rootScope.SolutionTypeList = data;
            });

        };

        /*app.modulePromiss.then(function() {
            fac.initPage($scope,function(){
            	$scope.find();
            })
        });*/
        $scope.find();

        //删除实体项目
        $scope.del = function (news) {
            confirm("确定删除 " + news.title, function () {
                fac.getResult("/ovu-park/backstage/solution/remove", {id: news.id}, function (resp) {
                    if (resp) {
                        window.msg("删除成功!");
                        $scope.find();
                    }
                });
            })
        }


        //新增/编辑
        $scope.showItem = function (news) {
            var copy = angular.extend({}, news);

            function creatModal() {
                var modal = $uibModal.open({
                    animation: false,
                    size: 'md',
                    templateUrl: '/view/operationManage/groupPlan/modal.html',
                    controller: 'A3',
                    resolve: {news: copy}
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

            if (news) {
                fac.getResult('/ovu-park/backstage/solution/getSolution', {id: news.id}, function (success) {
                    copy.productIds = success.productList;
                    copy.customerUserId = success.solutionBase.companyUserId;
                    copy.serviceScope = success.serviceScope;
                    creatModal();
                })
            } else {
                creatModal()
            }


        }
    });
    app.controller('A3', function ($scope, $http, $uibModalInstance, $filter, fac, news, $rootScope, $uibModal) {
        $scope.item = news;

        if (news.createTime) {
            //编辑的时候，重传createTime会导致异常，此处针对该bug做的前端处理
            delete $scope.item.createTime;
        }
        $scope.item.solutionServiceId = news.solutionServiceId;
        $scope.item.picsOne = $scope.item.imgUrl ? $scope.item.imgUrl.split(",") : [];

        //回显商品列表
        $rootScope.productIds = news.productIds ? news.productIds : [];
        $rootScope.productLength = '您已选择' + $rootScope.productIds.length + '个商品...';
        //回显企业名称
        $scope.search = {
            companyName: news.companyName
        }
        //回显附件名称
        $scope.item.name = $scope.item.attachUrl ? '已上传附件...' : '请上传附件';
        $scope.serviceScope = (news.serviceScope || 1) + '';

        $scope.save = function (form, item) {
            if (!item.companyUserId) {
                window.alert("只能选择已存在的公司")
                return;
            }
            form.$setSubmitted(true);
            if (!form.$valid) {
                return;
            }
            if (item.picsOne.length > 1) {
                window.msg("最多只能上传1张图片, 请删除多余的图片!")
                return false;
            }
            item.imgUrl = item.picsOne.join(",");
            item.productIds = $rootScope.productIds.join(",");
            item.companyName = $scope.search.companyName;
            item.productNum = $rootScope.productIds.length;

            if (item.id) {
                fac.getResult("/ovu-park/backstage/solution/saveOrEdit", item, function (code) {
                    window.msg("修改成功!");
                    $rootScope.productIds = []
                    $uibModalInstance.close();

                });
            }
            else {
                fac.getResult("/ovu-park/backstage/solution/saveOrEdit", item, function (code) {
                    window.msg("新增成功!");
                    $rootScope.productIds = []
                    $uibModalInstance.close();

                });
            }
        }

        $scope.changepic = function () {
            var reads = new FileReader();
            f = document.getElementById('file').files[0];
            reads.readAsDataURL(f);
            reads.onload = function (e) {
                document.getElementById('show').src = this.result;
            };
        }

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };

        $scope.focusCompany = function () {
            $scope.showCompanyFlag = true;
        }

        $scope.$watch('search.companyName', function (newValue, oldValue) {
            if (newValue != oldValue) {
                if (newValue != '') {
                    fac.getResult("/ovu-park/backstage/solution/listCompanyByName", $scope.search, function (data) {
                        $scope.companyList = data;
                    });
                }
            }
        });

        $scope.changeServiceScope = function () {
            fac.getResult("/ovu-park/backstage/solution/customerService/list", {
                serviceScope: $scope.serviceScope,
            }, function (data) {
                $scope.CustomServiceList = data.data;
            });
        }
        $scope.changeServiceScope();
        $scope.showCompanyFlag = false;

        $scope.chooseCompany = function (item) {
            $scope.showCompanyFlag = false;
            $scope.item.companyUserId = item.customerUserId;
            $scope.search.companyName = item.companyName;

            /*fac.getResult("/ovu-park/backstage/solution/getCustomerService", {
                companyUserId: item.customerUserId,
            }, function (data) {
                $scope.CustomServiceList = data;
                fac.getResult("/ovu-park/backstage/solution/customerService/list", {
                    serviceScope: $scope.serviceScope,
                }, function (result) {
                    $scope.CustomServiceList = result.data;
                    $scope.item.customServiceId = data.id
                });
            });*/
        }
        if (news.id) {
            $scope.chooseCompany($scope.item)
        }


        //显示商品
        $scope.showProduct = function () {
            var copy = angular.extend({}, {companyUserId: $scope.item.companyUserId, productIds: news.productIds});
            $uibModal.open({
                animation: false,
                size: 'md',
                templateUrl: '/view/operationManage/groupPlan/modalProduct.html',
                controller: 'B3',
                resolve: {params: copy}
            });
        }

        $scope.changesolutionService = function () {
            angular.forEach($rootScope.SolutionTypeList, function (d, i, a) {
                if ($scope.item.solutionServiceId == d.id) {
                    $scope.item.solutionServiceName = d.solutionServiceName
                }
            })
        }

    });
    app.controller('B3', function ($scope, $uibModalInstance, $http, $filter, fac, params, $rootScope) {
        $scope.cancel = function () {
            $uibModalInstance.close()
        };
        fac.getResult("/ovu-park/backstage/solution/listCategory",
            {text: '请求产品分类',companyId: params.companyUserId},
            function (data) {
            $rootScope.categoryList = data;
        });
        $scope.changeCategory = function () {
            if ($scope.item.cateId) {
                fac.getResult("/ovu-park/backstage/solution/listProduct", {
                    companyUserId: params.companyUserId,
                    cateId: $scope.item.cateId,
                }, function (data) {
                    console.log($rootScope.productIds)
                    angular.forEach(data, function (d, i, a) {
                        if ($rootScope.productIds.indexOf(d.id) != -1) {
                            d.checked = true
                        }
                    })
                    $scope.ProductList = data;
                });
            }
        }
        $scope.checkItem = function (product, index) {
            if (product.checked) {
                $rootScope.productIds.push(product.id)
            } else {
                $rootScope.productIds.splice($rootScope.productIds.indexOf(product.id), 1)
            }
            $rootScope.productLength = '您已选择' + $rootScope.productIds.length + '个商品...';
        }
    })
})();
