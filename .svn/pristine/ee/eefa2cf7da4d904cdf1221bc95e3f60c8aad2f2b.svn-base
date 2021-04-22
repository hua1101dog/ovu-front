(function () {
    "use strict";
    var app = angular.module("angularApp");

    // 资产信息
    app.controller('assetInformationCtrl', function ($scope, $rootScope, $sce, $uibModal, $state, $http, $filter, fac) {
        document.title = '资产信息';
        $scope.pageModel = {};
        $scope.search = {};
        $scope.config = false
        $scope.hasNode=true
        // 页面初始化
        app.modulePromiss.then(function () {
            $scope.$watch('dept.id', function (deptId, oldValue) {

                if (deptId) {
                    if ($scope.dept.parkId) {
                        $scope.search.deptId = deptId
                        fac.setAssetsClassTree({deptId:$scope.search.deptId}).then(function (AssetClyTree) {
                            if (AssetClyTree && AssetClyTree[0]) {
                                $scope.selectNode($scope.AssetClyTree[0]);
                            }
                        });

                    } else {
                        $scope.search.deptId  && delete $scope.search.deptId
                        alert('请选择跟项目关联的部门');
                        return
                    }

                }
            })

        })
        $scope.init = function (id) {
            //查询所有二级分类
            $http.post("/ovu-gallery/asset/category/getAssetCategoryList", {
                parentId: id
            }).success(function (data) {
                $scope.secondList = data.data;

            });
        }
        //查询藏品的归属单位
        function collectionCount(level) {
            var params={}
            if(level==1){
             params={
                'assetCategoryParentId': $scope.search.assetCategoryParentId,
                'deptId' : $scope.search.deptId
             }
            }else{
                params={
                 'assetCategoryId': $scope.search.assetCategoryId,
                'deptId' : $scope.search.deptId
                } 
            }
            $http.post("/ovu-gallery/asset/collection/getAssetCollectionCountByAscription",params).success(function (data) {
                $scope.collectionCount = data.data;
            });
        }
        //选中分类节点
        $scope.selectNode = function (node) {
            if ($scope.curNode != node) {
                $scope.curNode && $scope.curNode.state && ($scope.curNode.state.selected = false);
            }
            node.state = node.state || {};
            node.state.selected = !node.state.selected;
          
            if (node.state.selected) {
                $scope.curNode = node;
                $scope.search.parentId && delete $scope.search.parentId
                $scope.search.assetCategoryId && delete $scope.search.assetCategoryId
                $scope.search.assetCategoryName && delete $scope.search.assetCategoryName
                $scope.level && delete $scope.level
                $scope.type && delete $scope.type
                $scope.search.status && delete $scope.search.status
                $scope.search.assetCategoryParentId  && delete $scope.search.assetCategoryParentId
                $scope.level = node.level;
                $scope.type=node.type
                if ($scope.level == 1) {
                    //如果一级分类为藏品
                    if(node.nodes && node.nodes.length>0){
                        $scope.hasNode=true
                    }else{
                        $scope.hasNode=false
                    }
                    $scope.isId = node.id
                    if (node.type == 'collection') {
                        //如果为藏品
                        $scope.search.assetCategoryParentId = node.id;
                        $scope.search.status=''
                        collectionCount(1)
                    } else if (node.type == 'book') {
                        //如果为书籍
                        $scope.search.assetCategoryParentId = node.id;
                    } else {
                        //如果为其他的资产
                        $scope.search.parentId = node.id;
                      
                    }
                    $scope.init(node.id);
                } else {
                    $scope.isId = node.pid
                    //二级分类
                    $scope.search.assetCategoryParentId = node.pid;
                    $scope.search.assetCategoryId = node.id;
                    $scope.search.assetCategoryName = node.text;
                    if(node.type == 'collection'){
                        collectionCount(2)
                    }
                    
                }
                $scope.find(1);


            } else {
                delete $scope.curNode;
            }
        }

        $scope.getclass = function (id) {
            $http.post("/ovu-gallery/asset/category/getAssetCategoryList", {
                'parentId': id
            }).success(function (data) {
                $scope.secondList = data.data;

            });
        }

        var findUrl = ''
        // 查询
        $scope.find = function (pageNo) {

            $.extend($scope.search, {
                currentPage: pageNo || 1,
                pageSize: $scope.pageModel.pageSize || 10
            });
            $scope.search.pageIndex = $scope.search.currentPage - 1;

            if ($scope.type == 'book') {
                //如果为书籍
                findUrl = "/ovu-gallery/asset/book/getAssetBookList"
            } else if ($scope.type == 'collection') {
                //如果为藏品

                findUrl = "/ovu-gallery/asset/collection/getAssetCollectionList"
            } else {
                //如果为其他资产
                findUrl = "/ovu-gallery/asset/fixed/getAssetFixedList"
            }
            fac.getPageResult(findUrl, $scope.search, function (data) {
                var pageModel = data;
                $scope.pageModel = pageModel;
            });
        }
        // 编辑
        $scope.showEditModal = function (item) {
            if ($scope.type == 'book') {
                //如果为书籍
                var copy = angular.extend({
                    assetId: $scope.isId,
                    deptId: $scope.search.deptId
                }, item);
                var modal = $uibModal.open({
                    animation: false,
                    size: 'lg',
                    templateUrl: '/view/gallery/resourceManagement/modal.booksEdit.html',
                    controller: 'booksEditModelCtrl',
                    resolve: {
                        param: copy
                    }
                });
                modal.result.then(function () {
                    // fac.setAssetsClassTree({deptId:$scope.search.deptId})
                    fac.setAssetsClassTree($scope.search);
                    $scope.find()
                   
                }, function () {
                    console.info('Modal dismissed at: ' + new Date());
                });
            } else if ($scope.type == 'collection') {
                //如果为藏品
                var copy = angular.extend({
                    deptId: $scope.search.deptId,
                  assetId: $scope.isId,
                }, item);
                
                var modal = $uibModal.open({
                    animation: false,
                    size: 'lg',
                    templateUrl: '/view/gallery/resourceManagement/modal.collectionEdit.html',
                    controller: 'collectionEdit',
                    resolve: {
                        param: copy
                    }
                });
                modal.result.then(function () {
                    // fac.setAssetsClassTree({deptId:$scope.search.deptId})
                    fac.setAssetsClassTree($scope.search)
                    $scope.find()
                    collectionCount()
                }, function () {
                    console.info('Modal dismissed at: ' + new Date());
                });
            } else {
                //如果为其他资产
                var copy = angular.extend({
                    assetId: $scope.isId,
                    deptId: $scope.search.deptId
                }, item);
                var modal = $uibModal.open({
                    animation: false,
                    size: 'lg',
                    templateUrl: '/view/gallery/resourceManagement/modal.assetEdit.html',
                    controller: 'assetEditModelCtrl',
                    resolve: {
                        param: copy
                    }
                });
                modal.result.then(function () {
                    // fac.setAssetsClassTree({deptId:$scope.search.deptId})
                    fac.setAssetsClassTree($scope.search)
                    $scope.find()
                   
                    
                }, function () {
                    console.info('Modal dismissed at: ' + new Date());
                });
            }

        }
        // 新增藏品
        $scope.showAddModal = function () {
            var copy = angular.extend({
                deptId: $scope.search.deptId,
                assetId: $scope.isId,
            }, {});
            var modal = $uibModal.open({
                animation: false,
                size: 'lg',
                templateUrl: '/view/gallery/resourceManagement/modal.collectionAdd.html',
                controller: 'collectionAdd',
                resolve: {
                    param: copy
                }

            });
            modal.result.then(function () {
                // fac.setAssetsClassTree({deptId:$scope.search.deptId})
                fac.setAssetsClassTree($scope.search);
                $scope.find()
                
                collectionCount()
            }, function () {
                console.info('Modal dismissed at: ' + new Date());
            });
        }
        // 删除
        var url = '';
        var u = ''

        $scope.del = function (item) {

            if ($scope.type == 'book') {
                //如果为书籍
                url = "/ovu-gallery/asset/book/deleteAssetBook"
            } else if ($scope.type == 'collection') {
                //如果为藏品

                url = "/ovu-gallery/asset/collection/deleteAssetCollection"
            } else {
                //如果为其他资产
                url = "/ovu-gallery/asset/fixed/deleteAssetFixed"
            }
            confirm("删除此条数据后，需要重新添加数据，确认删除吗？", function () {
                $http.post(url, {
                    id: item.id
                }).success(function (data) {
                    if (data.code == 0) {
                        // fac.setAssetsClassTree({deptId:$scope.search.deptId})
                        fac.setAssetsClassTree($scope.search)
                        $scope.find()
                        if($scope.type == 'collection'){
                            collectionCount()
                        }
                        msg("删除成功");
                    } else {
                        alert("失败");
                    }
                });
            });
        }
        //导入
        $scope.importExcel = function () {
            if ($scope.type == 'book') {
                //如果为书籍
                u = '/ovu-gallery/asset/book/importBookExcel'
            } else if ($scope.type == 'collection') {
                //如果为藏品

                u = '/ovu-gallery/asset/collection/importCollectionExcel'
            } else {
                //如果为其他资产
                u = '/ovu-gallery/asset/fixed/importFixedExcel'
            }

            fac.upload({
                url: u,
                params: {deptId:$scope.search.deptId},
                accept: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
            }, function (resp) {
                if (resp.code == 0) {
                    msg(resp.msg);
                    // $scope.find();
                    fac.setAssetsClassTree($scope.search);
                    $scope.find()
                 
                } else {

                    alert(resp.msg);
                  
                }
            })
           
        }
        //导出
        $scope.exportExcel = function (no) {
            var elemIF = document.createElement("iframe");
            elemIF.src = "/ovu-gallery/asset/collection/exportExcel?flag="+no;
            elemIF.style.display = "none";
            document.body.appendChild(elemIF);

        }

        //藏品出库
        $scope.outbound = function (item) {

            var copy = angular.extend({
                assetCategoryId: $scope.search.assetCategoryId
            }, item);
            var modal = $uibModal.open({
                animation: false,
                size: 'md',
                templateUrl: '/view/gallery/resourceManagement/modal.outbound.html',
                controller: 'collectionOut',
                resolve: {
                    param: copy
                }
            });
            modal.result.then(function () {
                $scope.find();
            }, function () {
                console.info('Modal dismissed at: ' + new Date());
            });

        }
        //藏品入库
        $scope.inStorage = function (item) {
            var copy = angular.extend({
                assetCategoryId: $scope.search.assetCategoryId
            }, item);
            var modal = $uibModal.open({
                animation: false,
                size: 'md',
                templateUrl: '/view/gallery/resourceManagement/modal.inStorage.html',
                controller: 'collectionIn',
                resolve: {
                    param: copy
                }
            });
            modal.result.then(function () {
                $scope.find();
            }, function () {
                console.info('Modal dismissed at: ' + new Date());
            });
        }


    });

    // 新增编辑其他资产Controller
    app.controller('assetEditModelCtrl', function ($scope, $http, $uibModal, $uibModalInstance, $filter, fac, param) {

        $scope.item = param || {};
        //获取二级分类
        $http.post("/ovu-gallery/asset/category/getAssetCategoryList", {
            'parentId': param.assetId
        }).success(function (data) {
            $scope.secondList = data.data;
        });
        $scope.save = function (form, item) {
            var url = ''
            form.$setSubmitted(true);
            if (!form.$valid) {
                return;
            }
            if (param.id) {
                url = "/ovu-gallery/asset/fixed/editAssetFixed"
            } else {
                url = "/ovu-gallery/asset/fixed/saveAssetFixed"
            }
            $http.post(url, $scope.item).success(function (data) {
                if (data.code == 0) {
                    msg(data.msg);
                    $uibModalInstance.close();
                } else {
                    alert(data.msg);
                    $uibModalInstance.close();
                }
            });
        }
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };

    });
    // 新增藏品Controller
    app.controller('collectionAdd', function ($scope, $http, $uibModal, $uibModalInstance, $filter, fac, param) {
        $scope.item = param;
        //查询二级分类
        $http.post("/ovu-gallery/asset/category/getAssetCategoryList", {
            parentId: param.assetId
        }).success(function (data) {
            $scope.secondList = data.data;
            $scope.secondList.forEach(function(v){
                  if(v.id==$scope.item.assetCategoryId){
                    //  $scope.item.type=v.assetName
                  }
            })

        });
        $scope.getClass=function(id){
            $scope.secondList.forEach(function(v){
                if(v.id==id){
                //    $scope.item.type=v.assetName
                }
          })
        }
        
        $scope.save = function (form, item) {
            form.$setSubmitted(true);
            if (!form.$valid) {
                return;
            }
            
            $http.post('/ovu-gallery/asset/collection/saveAssetCollection', $scope.item).success(function (data) {
                if (data.code == 0) {
                    msg(data.msg);
                    $uibModalInstance.close();
                } else {
                    alert(data.msg);
                    $uibModalInstance.close();
                }
            });
        }
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };

    });
    // 编辑藏品Controller
    app.controller('collectionEdit', function ($scope, $http, $uibModal, $uibModalInstance, $filter, fac, param) {
        $scope.search = {};
        $scope.pageModel = {};
        $scope.item = param;
        $scope.search.assetCollectionId = param.id;
    
     
        //查询二级分类
        $http.post("/ovu-gallery/asset/category/getAssetCategoryList", {
            parentId: param.assetId
        }).success(function (data) {
            $scope.secondList = data.data;
            $scope.secondList.forEach(function(v){
                  if(v.id==$scope.item.assetCategoryId){
                    //  $scope.item.type=v.assetName
                  }
            })

        });
        $scope.getClass=function(id){
            $scope.secondList.forEach(function(v){
                if(v.id==id){
                //    $scope.item.type=v.assetName
                }
          })
        }
        $scope.find = function (pageNo) {
            angular.extend($scope.search, {
                currentPage: pageNo || $scope.pageModel.currentPage || 1,
                pageSize: $scope.pageModel.pageSize || 10
            });
            fac.getPageResult("/ovu-gallery/asset/collectionOperation/collectionOperationList", $scope.search, function (data) {
                $scope.pageModel = data;

            });

        };
        $scope.changeIndex = function (index) {
            if (index == 0) {


            } else {
                if (index == 1) {
                    $scope.search.status = 0 //出库
                } else {
                    $scope.search.status = 1 //入库
                    //入库
                }
                $scope.find();
            }

        };
        //删除方法
        function del(pm) {
            confirm("确认删除该条记录?", function () {
                $http.post('/ovu-gallery/asset/collectionOperation/deleteAssetCollectionOperation', pm).success(function (resp) {
                    if (resp.code == 0) {
                        $scope.find();
                        msg(resp.msg)
                    } else {
                        alert(resp.msg);
                    }
                })
            });
        }
        //出库
        $scope.delOut = function (id) {
            del({
                'id': id
            })
        }
        //入库
        $scope.delIn = function (id) {
            del({
                'id': id
            })
        }


        $scope.save = function (form, item) {

            form.$setSubmitted(true);
            if (!form.$valid) {
                return;
            }

            $http.post('/ovu-gallery/asset/collection/editAssetCollection', $scope.item).success(function (data) {
                if (data.code == 0) {
                    msg(data.msg);
                    $uibModalInstance.close();
                } else {
                    alert(data.msg);
                    $uibModalInstance.close();
                }
            });
        }
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };

    });
    // 藏品出库Controller
    app.controller('collectionOut', function ($scope, $http, $uibModal, $uibModalInstance, $filter, fac, param) {

        $scope.item = param;
        $scope.item.status = '0';
        $scope.item.assetCollectionId = param.id;
        $scope.save = function (form, item) {

            form.$setSubmitted(true);
            if (!form.$valid) {
                return;
            }

            $http.post('/ovu-gallery/asset/collectionOperation/saveAssetCollectionOperation', $scope.item).success(function (data) {
                if (data.code == 0) {
                    msg(data.msg);
                    $uibModalInstance.close();
                } else {
                    alert(data.msg);
                    $uibModalInstance.close();
                }
            });
        }
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };

    });
    // 藏品入库Controller
    app.controller('collectionIn', function ($scope, $http, $uibModal, $uibModalInstance, $filter, fac, param) {

        $scope.item = param;
        $scope.item.status = '1';
        $scope.item.assetCollectionId = param.id;
        $scope.save = function (form, item) {

            form.$setSubmitted(true);
            if (!form.$valid) {
                return;
            }

            $http.post('/ovu-gallery/asset/collectionOperation/saveAssetCollectionOperation', $scope.item).success(function (data) {
                if (data.code == 0) {
                    msg(data.msg);
                    $uibModalInstance.close();
                } else {
                    alert(data.msg);
                    $uibModalInstance.close();
                }
            });
        }
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };

    });
    // 书籍新增编辑Controller
    app.controller('booksEditModelCtrl', function ($scope, $http, $uibModal, $uibModalInstance, $filter, fac, param) {

        $scope.item = param || {};
         if($scope.item.id){
            $scope.item.name = param.bookName
         }
        $http.post("/ovu-gallery/asset/category/getAssetCategoryList", {
            parentId: param.assetId
        }).success(function (data) {
            $scope.secondList = data.data;

        });

        $scope.save = function (form, item) {
            var url = ''
            form.$setSubmitted(true);
            if (!form.$valid) {
                return;
            }
            if (param.id) {
                url = "/ovu-gallery/asset/book/editAssetBook"
            } else {
                url = "/ovu-gallery/asset/book/saveAssetBook"
            }
            $scope.item.bookName && delete $scope.item.bookName
            $http.post(url, $scope.item).success(function (data) {
                if (data.code == 0) {
                    msg(data.msg);
                    $uibModalInstance.close();
                } else {
                    alert(data.msg);
                    $uibModalInstance.close();
                }
            });
        }
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };

    });


})();
