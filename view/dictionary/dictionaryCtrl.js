/**
 * @author  hy
 * @date 2019-05-23
 */
(function () {
    "use strict";
    var app = angular.module("angularApp");

    app.controller('dictionaryCtrl', function ($scope, $rootScope, $http, $filter, $uibModal, fac) {
        document.title = "OVU-数据字典管理";
   
        $scope.pageModel = {};

        $scope.search = {};
        
        $scope.curDicTypeNode = {};

        $scope.getdTypeTree = function(){
            $http.post("/ovu-base/system/dictionarytypetree/tree").success(function(resp){
                if(resp.data){
                    $scope.dTypeTree = resp.data;
                }
            })
        }
        
        $scope.find = function (pageNo) {

            $.extend($scope.search, {
                currentPage: pageNo || $scope.pageModel.currentPage || 1,
                pageSize: $scope.pageModel.pageSize || 10
            });
            
            fac.getPageResult("/ovu-base/system/dictionary/list", $scope.search, function (data) {
                $scope.pageModel = data;
            });
        };

        $scope.setDicList = function(search,node){
            
            if(node.state.selected){
                $scope.search.dicType = node.no;
                $scope.curDicTypeNode = node;
            }else{
                delete $scope.search.dicType;
                $scope.curDicTypeNode = {};
            }
            $scope.find(1);
        }
        
        //新增字典
        $scope.addDic = function () {
            var modal = $uibModal.open({
                animation: true,
                size: 'lg',
                templateUrl: 'dictionary/modal/modal.addDic.html',
                controller: 'addDicCtrl'
                , resolve: {param: $scope.curDicTypeNode.data}
            });
            modal.result.then(function () {
                $scope.find();
            }, function () {
            });
        }
        
        $scope.editDic = function (item) {
            var modal = $uibModal.open({
                animation: true,
                size: 'lg',
                templateUrl: 'dictionary/modal/modal.editDic.html',
                controller: 'editDicCtrl'
                , resolve: {param: item}
            });
            modal.result.then(function () {
                $scope.find();
            }, function () {
            });
        }
        
        //新增字典类型
        $scope.addTopNode = $scope.addDicType = function (item) {
            item = item == undefined ? {} : item;
            var modal = $uibModal.open({
                animation: true,
                size: 'lg',
                templateUrl: 'dictionary/modal/modal.addDicType.html',
                controller: 'addDicTypeCtrl'
                , resolve: {param: item}
            });
            modal.result.then(function () {
                $scope.getdTypeTree();
            }, function () {
            });
        }
        
        $scope.editNode = function (item) {
            item = item == undefined ? {} : item;
            var modal = $uibModal.open({
                animation: true,
                size: 'lg',
                templateUrl: 'dictionary/modal/modal.addDicType.html',
                controller: 'editDicTypeCtrl'
                , resolve: {param: item.data}
            });
            modal.result.then(function () {
                $scope.getdTypeTree();
            }, function () {
            });
        }
        
        $scope.delNode = function(item){
            $http.get("/ovu-base/system/dictionarytypetree/del?id="+item.id).success(function(resp){
                if(resp.code == 0){
                    msg("删除成功");
                    $scope.getdTypeTree();
                }else{
                    alert(resp.msg);
                }
            })
        }

    $scope.refreshCache = function(){
        $http.get("/ovu-base/system/dictionary/refreshCache").success(function(resp){
                if(resp.code == 0){
                    msg("刷新成功");
                }else{
                    alert(resp.msg);
                }
            })
    }

        $scope.getdTypeTree();
        $scope.find(1);
    });

    /**
     * 增加字典类型
     */
    app.controller('addDicTypeCtrl', function ($scope, $rootScope, $http, $uibModalInstance, $uibModal, $filter, fac, param) {
        $scope.saveItem = {};
        if(param && param.id){
            $scope.saveItem.parentDicType = param.dicType;
            $scope.saveItem.dictionaryId = param.id;
        }else{
            $scope.saveItem.parentDicType = "0";
        }
        
        /**
         * 根据dictionary id查询 dictype ，如果存在，则编辑子类型，否则新增子类型
         */
        $scope.getDicType = function(){
            $http.get("/ovu-base/system/dictionarytypetree/get?dictionaryId="+param.id).success(function(resp){
                if(resp.data){
                    $scope.saveItem = resp.data;
                }
            })
        }
        
        if(param && param.id){
            $scope.getDicType();
        }
        
        $scope.save = function(form,saveItem){
            $http.post("/ovu-base/system/dictionarytypetree/save", saveItem, fac.postConfig).success(function(resp){
                if(resp.code == 0){
                    msg("保存成功！");
                    $uibModalInstance.close();
                }else{
                    alert(resp.msg);
                }
            })
        }

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    });
    
    /**
     * 编辑字典类型
     */
    app.controller('editDicTypeCtrl', function ($scope, $rootScope, $http, $uibModalInstance, $uibModal, $filter, fac, param) {
        $scope.saveItem = param;
        $scope.save = function(form,saveItem){
            $http.post("/ovu-base/system/dictionarytypetree/save", saveItem, fac.postConfig).success(function(resp){
                if(resp.code == 0){
                    msg("保存成功！");
                    $uibModalInstance.close();
                }else{
                    alert(resp.msg);
                }
            })
        }

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    });
    
     /**
     * 新增字典
     */
    app.controller('addDicCtrl', function ($scope,$rootScope, $http, $uibModalInstance, $uibModal, $filter, fac, param) {
        $scope.saveItem = {};
        $scope.saveItem.appName = "base";
        if(param && param.id){
            $scope.saveItem.parentId = param.dictionaryId;
            $scope.saveItem.parentDicType = param.parentDicType;
            $scope.saveItem.dicType = param.dicType;
        }else{
            $scope.saveItem.parentDicType = "0";
        }
        
        /*$scope.getParkTree = function(){
            $http.get("/ovu-base/system/park/tree").success(function(resp){
                $scope.parkTree = resp.data;
            })
        }*/
        
        $scope.initDicTypeTree = function(){
            $http.post("/ovu-base/system/dictionarytypetree/treeList?parentDicType="+$scope.saveItem.parentDicType).success(function(resp){
                $scope.dicTypeTree = resp.data;
            })
        }
        
        /*$scope.getParkTree();*/
        $scope.initDicTypeTree();
        
        $scope.save = function(form,saveItem){
            $http.post("/ovu-base/system/dictionary/save", saveItem, fac.postConfig).success(function(resp){
                if(resp.code == 0){
                    msg("保存成功！");
                    $uibModalInstance.close();
                }else{
                    alert(resp.msg);
                }
            })
        }

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    });

    /**
     * 新增字典
     */
    app.controller('editDicCtrl', function ($scope,$rootScope, $http, $uibModalInstance, $uibModal, $filter, fac, param) {
        $scope.saveItem = angular.copy(param);
        
        /*$scope.getParkTree = function(){
            $http.get("/ovu-base/system/park/tree").success(function(resp){
                $scope.parkTree = resp.data;
            })
        }*/
        
        /*$scope.initDicTypeTree = function(){
            $http.post("/ovu-base/system/dictionarytypetree/treeList?parentDicType="+$scope.saveItem.parentDicType).success(function(resp){
                $scope.dicTypeTree = resp.data;
            })
        }*/
        
        /*$scope.getParkTree();*/
        /*$scope.initDicTypeTree();*/
        
        $scope.save = function(form,saveItem){
            $http.post("/ovu-base/system/dictionary/save", saveItem, fac.postConfig).success(function(resp){
                if(resp.code == 0){
                    msg("保存成功！");
                    $uibModalInstance.close();
                }else{
                    alert(resp.msg);
                }
            })
        }

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    });
})();
