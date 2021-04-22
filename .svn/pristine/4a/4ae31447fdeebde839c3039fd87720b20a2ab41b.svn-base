(function () {
    var app = angular.module("angularApp");
    //底部菜单
    app.controller('bottomMenuCtrl', function ($scope, $rootScope, $http, $filter, $uibModal, fac) {
        document.title = "OVU-APP专用配置(集团)";
        angular.extend($rootScope, fac.dicts);
        $scope.search = {
            mainType : 1
        };
        // $scope.current = null;
        $scope.pageModel = {};
  
        $scope.selectList = [];

        app.modulePromiss.then(function () {
            $scope.find()
        });


        // 查询列表
        $scope.find = function (pageNo) {
            if ($scope.pageModel.currentPage) {
                delete $scope.pageModel.currentPage;
            }
            $.extend($scope.search, {
                currentPage: pageNo || $scope.pageModel.currentPage || 1,
                pageSize: $scope.pageModel.pageSize || 10
            });
            $scope.search.pageIndex = $scope.search.currentPage - 1;
            $scope.search.totalCount = $scope.pageModel.totalCount || 0;
            fac.getPageResult("/ovu-park/backstage/mainSer/page", $scope.search, function (data) {
                $scope.pageModel = data;
            });

        };

        $scope.selectOne = function (product) {

            if (!product.checked) {
                $scope.selectList.push(product.id)
                product.checked = !product.checked
  
            } else {
                $scope.selectList.splice($scope.selectList.indexOf(product.id), 1)
                product.checked = !product.checked
            }
            
            if( $scope.selectList.length == $scope.pageModel.data.length){
                $scope.allFlag = true
            }else{
                $scope.allFlag = false
            }

        }


        //添加/修改
        $scope.showEditModal = function (item) {

        	// if(!fac.checkPark($scope)){
        	// 	return
            // }

            var item = item ? item : {};

            var modal = $uibModal.open({
                animation: false,
                size: 'md',
                templateUrl: '/view/serviceManage/AppSpecialConfig/modal.editBottomMenuConfig.html',
                controller: 'editBottomMenuConfig',
                resolve: {
                    item:item
                }
            });
            modal.result.then(function () {
                $scope.find();
            }, function () {
                $scope.find();
                console.info('Modal dismissed at: ' + new Date());
            });
            event.stopPropagation(); 
        };

        $scope.del = function () {
            var delList = $scope.selectList.toString();
            if ($scope.selectList.length > 0) {
                confirm("确认删除该服务分类吗?", function () {
                    $.get("/ovu-park/backstage/mainSer/delete", {
                        ids: delList,
                        mainType: '1'
                    }, function (resp) {
                        window.msg("删除成功!");
                        $scope.find();
                    });
                })
            } else {
                alert("请先选择服务！");
            }
        };

        // $rootScope.$on("refresh", function (event) {
        //     $scope.showChild($scope.current);
        // });

        $scope.delAll = function () {
            $scope.selectList = []
            angular.forEach($scope.pageModel.data, function (data, index, arrary) {
                data.checked = false;
            })
        }
        $scope.checkAll = function () {
            if ($scope.allFlag) {
                $scope.delAll();
                angular.forEach($scope.pageModel.data, function (data, index, arrary) {
                    $scope.selectOne(data)
                })
            }else{
                $scope.delAll();
            }

        }

    });
    // 底部菜单新增分类=》编辑框组件
    app.controller('editBottomMenuConfig', function ($scope, $rootScope, $http, $uibModalInstance, $filter, $uibModal, fac, item) {
        $scope.parentServiceName = "底部菜单"
        $scope.personDeptTree = []

        if(item.serviceIds){
            fac.getResult("/ovu-park/backstage/mainSer/listAppSer",{serviceIds:item.serviceIds},  function (res) {
                $scope.personDeptTree = res
            });
    
        }
    
        var cache = {
            "id": item.id,
            "mainType":item.mainType
        }
        $scope.userClassify={
            	enterprise:item.permission&&item.permission.indexOf('2')!=-1?true:false,
                virtualCom:item.permission&&item.permission.indexOf('0')!=-1?true:false,
                staff:item.permission&&item.permission.indexOf('3')!=-1?true:false,
                personal:item.permission&&item.permission.indexOf('1')!=-1?true:false,
                operation:item.permission&&item.permission.indexOf('4')!=-1?true:false
            }
        $scope.item = {}
        angular.extend($scope.item,item,cache);
        
        fac.getResult("/ovu-park/backstage/mainSer/maxNo", {mainType:'1'}, function (success) {
            $scope.item.orderNo = $scope.item.orderNo ? $scope.item.orderNo : success.orderNo
        });


         // 获取第一级职位
         $scope.loadJobType = function () {
            $http.post("/ovu-park/backstage/mainSer/cascadeSer", {}, fac.postConfig).success(function (resp) {
                if (resp.code == 0) {
                    console.log(resp)
                    var datas = resp.data;
                    for(var i=0;i<datas.length;i++){
                        datas[i].iconCls = "noBg";
                        datas[i].text = datas[i].serviceName;
                        if(!datas[i].isLeaf){
                            datas[i].state = "closed";
                        }
                    }
                    $('#AppServerTree').tree({
                        data:datas,
                        animate:true,
                        onBeforeExpand:function(row){
                            if(row){
                                loadData(row);
                            }
                            return false;
                        },
                        onClick:function(row){
                            if(row){
                                selJob(row);
                            }
                        }                        
                    });


                } else {
                    alert(resp.message);
                }
            });
        }
        $scope.loadJobType();
        
        // 获取子节点
        function loadData (row){
            var params = {
                "parentId":row.id
            }
            $http.post("/ovu-park/backstage/mainSer/cascadeSer", params, fac.postConfig).success(function (resp) {
                if (resp.code == 0) {
                    var datas = resp.data;
                    var childrenNodes =$('#AppServerTree').tree('getChildren', row.target);
                    if(childrenNodes.length>0){
                        for(var i=0;i<childrenNodes.length;i++){
                            $('#AppServerTree').tree('remove', childrenNodes[i].target);
                        }
                    };
                    for(var i=0;i<datas.length;i++){
                        datas[i].iconCls = "noBg";
                        datas[i].text = datas[i].serviceName;
                        if(!datas[i].isLeaf){
                            datas[i].state = "closed";
                        }
                    };
                    var node = $('#AppServerTree').tree("getSelected");
                    $('#AppServerTree').tree("append", {
                        parent: row.target,
                        data: datas,
                    });
                    $('#AppServerTree').tree('expand', row.target);
                    // return true;
                } else {
                    alert(resp.message);
                }
            });
        }

        

        // 选择子节点
        function selJob(row){
            if(row.isLeaf == 1) {
                $scope.personDeptTree.push({id:row.id,serviceName:row.serviceName})
                $scope.personDeptTree = func4($scope.personDeptTree)
                // calcuPersonDept()
            }
            // debugger
            $scope.item.checkName = row.text;
            $scope.$apply(function(){
                $scope.item.checkName = row.text;
            });
            $scope.item.parentId = row.id
           
        }
        // 清楚选中父级
        $scope.clearSel = function(){
            $scope.item.parentId = null;
            $scope.item.checkName = null;
        }


         //供应商显示列表去重
         function func4(objArray) {
            var result = [];
            var temp = {};
            for(var i=0;i<objArray.length;i++){  
                var myname = objArray[i].id;
                if(temp[myname]){
                    continue;
                }  
                temp[myname] = true;
                result.push(objArray[i])
            }  
            return result;  
        }
        $scope.delPro = function(item){
            // debugger
            // $scope.personDeptTree.splice($scope.personDeptTree.indexOf(item.id), 1)
            // console.log("$scope.personDeptTree",$scope.personDeptTree)
            for (var i =0; i < $scope.personDeptTree.length; i++)
                if ($scope.personDeptTree[i].id === item.id) {
                    $scope.personDeptTree.splice(i,1);
                    break;
                }
        }

       //上移
        $scope.moveUp = function(arr,index){
            if(index == 0) {
                return;
            }
            $scope.personDeptTree = swapItems($scope.personDeptTree, index, index - 1);
            debugger
            console.log(" $scope.personDeptTree", $scope.personDeptTree)
        }

        //下移
        $scope.moveDown = function(arr,index){
            if(index == arr.length -1) {
                return;
            }
            $scope.personDeptTree = swapItems($scope.personDeptTree, index, index + 1);
            debugger
            console.log(" $scope.personDeptTree", $scope.personDeptTree)
        }

        // 交换数组元素
            var swapItems = function(arr, index1, index2) {
            arr[index1] = arr.splice(index2, 1, arr[index1])[0];
                     return arr;
            };


        $scope.save = function (form) {
            if ($(".save").attr("disabled")) {
                return false;
            }           
            form.$setSubmitted(true);
            if (!form.$valid) {
                return;
            }
            var tempArr=[]
            $scope.userClassify.virtualCom&&tempArr.push('0');
            $scope.userClassify.personal&&tempArr.push('1');
            $scope.userClassify.enterprise&&tempArr.push("2");
            $scope.userClassify.staff&&tempArr.push("3");
            $scope.userClassify.operation&&tempArr.push("4");
            $scope.item.permission=tempArr.join(",")
            // 字段补全
            // $scope.item.parkId = $scope.dept.parkId
            debugger
            $scope.item.serviceIds = $scope.personDeptTree.map(e =>e.id).join()
            $scope.item.mainType = '1'

            $.get("/ovu-park/backstage/mainSer/saveOrEdit", $scope.item, function (resp) {
                if(resp.code == 0){
                    $uibModalInstance.close();
                    window.msg("操作成功!");

                }else{
                    window.alert("操作失败")
                }
                
            });
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    });

   //消息栏菜单
   app.controller('newsMenuCtrl', function ($scope, $rootScope, $http, $filter, $uibModal, fac) {
    document.title = "OVU-APP专用配置(集团)";
    angular.extend($rootScope, fac.dicts);
    $scope.search = {
        mainType : 4,
    };

    $scope.pageModel = {};

    var selectList = [];

    app.modulePromiss.then(function () {
 
            $scope.find(1);

    });

        // 查询列表
        $scope.find = function (pageNo) {
        if ($scope.pageModel.currentPage) {
            delete $scope.pageModel.currentPage;
        }
        $.extend($scope.search, {
            currentPage: pageNo || $scope.pageModel.currentPage || 1,
            pageSize: $scope.pageModel.pageSize || 10
        });
        $scope.search.pageIndex = $scope.search.currentPage - 1;
        $scope.search.totalCount = $scope.pageModel.totalCount || 0;
        fac.getPageResult("/ovu-park/backstage/mainSer/page", $scope.search, function (data) {
            $scope.pageModel = data;
        });

    };

    $scope.selectOne = function (product) {
        if (!product.checked) {
            selectList.push(product.id)
            product.checked = !product.checked
        } else {
            selectList.splice(selectList.indexOf(product.id), 1)
            product.checked = !product.checked
        }
        console.log(selectList)
        if( selectList.length == $scope.pageModel.data.length){
            $scope.allFlag = true
        }else{
            $scope.allFlag = false
        }

    }


    //消息栏
    $scope.showEditModal = function (item) {
        var item = item ? item : {};
        var modal = $uibModal.open({
            animation: false,
            size: 'md',
            templateUrl: '/view/serviceManage/AppSpecialConfig/model.editNewsMenuConfig.html',
            controller: 'editNewsMenuConfig',
            resolve: {
                // categorySetting: copy,
                item:item
            }
        });
        modal.result.then(function () {
            $scope.find();
            // $scope.showChild($scope.current);
        }, function () {
            $scope.find();
            console.info('Modal dismissed at: ' + new Date());
        });
        event.stopPropagation(); 
    };

    $scope.del = function () {
        var delList = selectList.toString();
        if (selectList.length > 0) {
            confirm("确认删除该服务分类吗?", function () {
                fac.getResult("/ovu-park/backstage/mainSer/delete", {
                    ids: delList,
                    mainType: '4'
                }, function (resp) {
                    window.msg("删除成功!");
                    $scope.find();
                });
            })
        } else {
            alert("请先选择服务！");
        }
    };


    $scope.delAll = function () {
        selectList = []
        angular.forEach($scope.pageModel.data, function (data, index, arrary) {
            data.checked = false;
        })
    }
    $scope.checkAll = function () {
        if ($scope.allFlag) {
            $scope.delAll();
            angular.forEach($scope.pageModel.data, function (data, index, arrary) {
                $scope.selectOne(data)
            })
        }else{
            $scope.delAll();
        }

    }

});

    // 消息栏新增分类=》编辑框组件
    app.controller('editNewsMenuConfig', function ($scope, $rootScope, $http, $uibModalInstance, $filter, $uibModal, fac, item) {
        $scope.parentServiceName = "消息栏"
      
        var cache = {
            "id": item.id,
            "mainType":item.mainType
        }
        $scope.userClassify={
            	enterprise:item.permission&&item.permission.indexOf('2')!=-1?true:false,
                virtualCom:item.permission&&item.permission.indexOf('0')!=-1?true:false,
                staff:item.permission&&item.permission.indexOf('3')!=-1?true:false,
                personal:item.permission&&item.permission.indexOf('1')!=-1?true:false,
                operation:item.permission&&item.permission.indexOf('4')!=-1?true:false
            }
        $scope.item = {}
        angular.extend($scope.item,item,cache);

        fac.getResult("/ovu-park/backstage/mainSer/maxNo", {mainType:'4'}, function (success) {
            $scope.item.orderNo = $scope.item.orderNo ? $scope.item.orderNo : success.orderNo
        });


        $scope.save = function (form) {
            if ($(".save").attr("disabled")) {
                return false;
            }
            if (!$scope.item.appLogoUrl) {
                alert("必须上传图片");
                return false;
            }
            form.$setSubmitted(true);
            if (!form.$valid) {
                return;
            }
              //用户分类
            if(!$scope.userClassify.virtualCom&&!$scope.userClassify.personal&&!$scope.userClassify.enterprise&&!$scope.userClassify.staff&&!$scope.userClassify.operation){
                alert("请勾选用户权限");
                return false;
            }
            var tempArr=[]
            $scope.userClassify.virtualCom&&tempArr.push('0');
            $scope.userClassify.personal&&tempArr.push('1');
            $scope.userClassify.enterprise&&tempArr.push("2");
            $scope.userClassify.staff&&tempArr.push("3");
            $scope.userClassify.operation&&tempArr.push("4");
            $scope.item.permission=tempArr.join(",")
            // 字段补全
            // $scope.item.parkId = $scope.dept.parkId
            $scope.item.mainType = '4'

            $.get("/ovu-park/backstage/mainSer/saveOrEdit", $scope.item, function (resp) {
                if(resp.code == 0){
                    $uibModalInstance.close();
                    window.msg("操作成功!");

                }else{
                    window.alert("操作失败")
                }
                
            });
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    });

    //banner菜单
    app.controller('bannerMenuCtrl', function ($scope, $rootScope, $http, $filter, $uibModal, fac) {
    document.title = "OVU-APP专用配置(集团)";
    angular.extend($rootScope, fac.dicts);
    $scope.search = {
        mainType : 3
    };
    $scope.pageModel = {};

    var selectList = [];

    app.modulePromiss.then(function () {
            $scope.find();
    });


    // 查询列表
    $scope.find = function (pageNo) {
        if ($scope.pageModel.currentPage) {
            delete $scope.pageModel.currentPage;
        }
        $.extend($scope.search, {
            currentPage: pageNo || $scope.pageModel.currentPage || 1,
            pageSize: $scope.pageModel.pageSize || 10
        });
        $scope.search.pageIndex = $scope.search.currentPage - 1;
        $scope.search.totalCount = $scope.pageModel.totalCount || 0;
        fac.getPageResult("/ovu-park/backstage/mainSer/page", $scope.search, function (data) {
            $scope.pageModel = data;
        });

    };

    $scope.selectOne = function (product) {
        if (!product.checked) {
            selectList.push(product.id)
            product.checked = !product.checked
        } else {
            selectList.splice(selectList.indexOf(product.id), 1)
            product.checked = !product.checked
        }
        console.log(selectList)
       
        if( selectList.length == $scope.pageModel.data.length){
            $scope.allFlag = true
        }else{
            $scope.allFlag = false
        }
    }


    //添加/修改
    $scope.showEditModal = function (item) {
        var item = item ? item : {};

        var modal = $uibModal.open({
            animation: false,
            size: 'md',
            templateUrl: '/view/serviceManage/AppSpecialConfig/model.editBannerMenuconfig.html',
            controller: 'editBannerMenuconfig',
            resolve: {
                item:item
            }
        });
        modal.result.then(function () {
            $scope.find();
        }, function () {
            $scope.find();
            console.info('Modal dismissed at: ' + new Date());
        });
        event.stopPropagation(); 
    };

    $scope.del = function () {
        var delList = selectList.toString();
        if (selectList.length > 0) {
            confirm("确认删除该服务分类吗?", function () {
                fac.getResult("/ovu-park/backstage/mainSer/delete", {
                    ids: delList,
                    // edition: '2'
                }, function (resp) {
                    window.msg("删除成功!");
                    $scope.find();
                });
            })
        } else {
            alert("请先选择服务！");
        }
    };


    $scope.delAll = function () {
        selectList = []
        angular.forEach($scope.pageModel.data, function (data, index, arrary) {
            data.checked = false;
        })
    }
    $scope.checkAll = function () {
        if ($scope.allFlag) {
            $scope.delAll();
            angular.forEach($scope.pageModel.data, function (data, index, arrary) {
                $scope.selectOne(data)
            })
        }else{
            $scope.delAll();
        }

    }

    });

    // banner菜单新增分类=》编辑框组件
    app.controller('editBannerMenuconfig', function ($scope, $rootScope, $http, $uibModalInstance, $filter, $uibModal, fac, item) {
        $scope.parentServiceName = "banner栏"
        var cache = {
            "id": item.id,
            // "parentServiceName":"banner栏",
            "mainType":item.mainType
        }
        $scope.userClassify={
                enterprise:item.permission&&item.permission.indexOf('2')!=-1?true:false,
                virtualCom:item.permission&&item.permission.indexOf('0')!=-1?true:false,
                staff:item.permission&&item.permission.indexOf('3')!=-1?true:false,
                personal:item.permission&&item.permission.indexOf('1')!=-1?true:false,
                operation:item.permission&&item.permission.indexOf('4')!=-1?true:false
            }
        $scope.item = {}
        angular.extend($scope.item,item,cache);

        fac.getResult("/ovu-park/backstage/mainSer/maxNo", {mainType:'3'}, function (success) {
            $scope.item.orderNo = $scope.item.orderNo ? $scope.item.orderNo : success.orderNo
        });

        $scope.save = function (form) {
            if ($(".save").attr("disabled")) {
                return false;
            }
            if (!$scope.item.appLogoUrl) {
                alert("必须上传图片");
                return false;
            }
            form.$setSubmitted(true);
            if (!form.$valid) {
                return;
            }
              //用户分类
            if(!$scope.userClassify.virtualCom&&!$scope.userClassify.personal&&!$scope.userClassify.enterprise&&!$scope.userClassify.staff&&!$scope.userClassify.operation){
                alert("请勾选用户权限");
                return false;
            }
            var tempArr=[]
            $scope.userClassify.virtualCom&&tempArr.push('0');
            $scope.userClassify.personal&&tempArr.push('1');
            $scope.userClassify.enterprise&&tempArr.push("2");
            $scope.userClassify.staff&&tempArr.push("3");
            $scope.userClassify.operation&&tempArr.push("4");
            $scope.item.permission=tempArr.join(",")
            // 字段补全
            // $scope.item.parkId = $scope.dept.parkId
            $scope.item.mainType = '3'

            $.get("/ovu-park/backstage/mainSer/saveOrEdit", $scope.item, function (resp) {
                if(resp.code == 0){
                    $uibModalInstance.close();
                    window.msg("操作成功!");
                }else{
                    window.alert("操作失败")
                } 
            });
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    });

    //热点栏菜单
    app.controller('hotspotMenuCtrl', function ($scope, $rootScope, $http, $filter, $uibModal, fac) {
        document.title = "OVU-APP专用配置(集团)";
        angular.extend($rootScope, fac.dicts);
        $scope.search = {
            mainType : 2
        };

        $scope.pageModel = {};
    
        var selectList = [];
    
        app.modulePromiss.then(function () {
                $scope.find();
        });
    
    
        // 查询列表
        $scope.find = function (pageNo) {
            if ($scope.pageModel.currentPage) {
                delete $scope.pageModel.currentPage;
            }
            $.extend($scope.search, {
                currentPage: pageNo || $scope.pageModel.currentPage || 1,
                pageSize: $scope.pageModel.pageSize || 10
            });
            $scope.search.pageIndex = $scope.search.currentPage - 1;
            $scope.search.totalCount = $scope.pageModel.totalCount || 0;
            fac.getPageResult("/ovu-park/backstage/mainSer/page", $scope.search, function (data) {
                $scope.pageModel = data;
            });
    
        };
    
        $scope.selectOne = function (product) {
            if (!product.checked) {
                selectList.push(product.id)
                product.checked = !product.checked
            } else {
                selectList.splice(selectList.indexOf(product.id), 1)
                product.checked = !product.checked
            }
            console.log(selectList)
            if( selectList.length == $scope.pageModel.data.length){
                $scope.allFlag = true
            }else{
                $scope.allFlag = false
            }
        }
    
    
        //添加/修改
        $scope.showEditModal = function (item) {
            var item = item ? item : {};
            var modal = $uibModal.open({
                animation: false,
                size: 'md',
                templateUrl: '/view/serviceManage/AppSpecialConfig/model.editHotspotMenuConfig.html',
                controller: 'editHotspotMenuConfig',
                resolve: {
                    item:item
                }
            });
            modal.result.then(function () {
                $scope.find();
            }, function () {
                $scope.find();
                console.info('Modal dismissed at: ' + new Date());
            });
            event.stopPropagation(); 
        };
    
        $scope.del = function () {
            var delList = selectList.toString();
            if (selectList.length > 0) {
                confirm("确认删除该服务分类吗?", function () {
                    fac.getResult("/ovu-park/backstage/mainSer/delete", {
                        ids: delList,
                        mainType : 2
                    }, function (resp) {
                        window.msg("删除成功!");
                        $scope.find();
                    });
                })
            } else {
                alert("请先选择服务！");
            }
        };
    

    
        $scope.delAll = function () {
            selectList = []
            angular.forEach($scope.pageModel.data, function (data, index, arrary) {
                data.checked = false;
            })
        }
        $scope.checkAll = function () {
            if ($scope.allFlag) {
                $scope.delAll();
                angular.forEach($scope.pageModel.data, function (data, index, arrary) {
                    $scope.selectOne(data)
                })
            }else{
                $scope.delAll();
            }
    
        }
    
    });
    
    //热点栏菜单新增分类=》编辑框组件
    app.controller('editHotspotMenuConfig', function ($scope, $rootScope, $http, $uibModalInstance, $filter, $uibModal, fac, item) {
        $scope.parentServiceName = "热点栏"
        $scope.personDeptTree = []

        if(item.serviceIds){
            fac.getResult("/ovu-park/backstage/mainSer/listAppSer",{serviceIds:item.serviceIds},  function (res) {
                $scope.personDeptTree = res
            });
    
        }

        var cache = {
            "id": item.id,
            "mainType":item.mainType
        }
        $scope.userClassify={
                enterprise:item.permission&&item.permission.indexOf('2')!=-1?true:false,
                virtualCom:item.permission&&item.permission.indexOf('0')!=-1?true:false,
                staff:item.permission&&item.permission.indexOf('3')!=-1?true:false,
                personal:item.permission&&item.permission.indexOf('1')!=-1?true:false,
                operation:item.permission&&item.permission.indexOf('4')!=-1?true:false
            }
        $scope.item = {}
        angular.extend($scope.item,item,cache);

        fac.getResult("/ovu-park/backstage/mainSer/maxNo", {mainType:'2'}, function (success) {
            $scope.item.orderNo = $scope.item.orderNo ? $scope.item.orderNo : success.orderNo
        });
        
            // 获取第一级职位
            $scope.loadJobType = function () {
                $http.post("/ovu-park/backstage/mainSer/cascadeSer", {}, fac.postConfig).success(function (resp) {
                    if (resp.code == 0) {
                        var datas = resp.data;
                        for(var i=0;i<datas.length;i++){
                            datas[i].iconCls = "noBg";
                            datas[i].text = datas[i].serviceName;
                            if(!datas[i].isLeaf){
                                datas[i].state = "closed";
                            }
                        }
                        $('#AppServerTree_hot').tree({
                            data:datas,
                            animate:true,
                            onBeforeExpand:function(row){
                                if(row){
                                    loadData(row);
                                }
                                return false;
                            },
                            onClick:function(row){
                                if(row){
                                    selJob(row);
                                }
                            }                        
                        });


                    } else {
                        alert(resp.message);
                    }
                });
            }
            $scope.loadJobType();

            // 获取子节点
            function loadData (row){
                var params = {
                    "parentId":row.id
                }
                $http.post("/ovu-park/backstage/mainSer/cascadeSer", params, fac.postConfig).success(function (resp) {
                    if (resp.code == 0) {
                        var datas = resp.data;
                        var childrenNodes =$('#AppServerTree_hot').tree('getChildren', row.target);
                        if(childrenNodes.length>0){
                            for(var i=0;i<childrenNodes.length;i++){
                                $('#AppServerTree_hot').tree('remove', childrenNodes[i].target);
                            }
                        };
                        for(var i=0;i<datas.length;i++){
                            datas[i].iconCls = "noBg";
                            datas[i].text = datas[i].serviceName;
                            if(!datas[i].isLeaf){
                                datas[i].state = "closed";
                            }
                        };
                        var node = $('#AppServerTree_hot').tree("getSelected");
                        $('#AppServerTree_hot').tree("append", {
                            parent: row.target,
                            data: datas,
                        });
                        $('#AppServerTree_hot').tree('expand', row.target);
                        // return true;
                    } else {
                        alert(resp.message);
                    }
                });
            }



            // 选择子节点
            function selJob(row){
                if(row.isLeaf == 1) {
                    $scope.personDeptTree.push({id:row.id,serviceName:row.serviceName})
                    $scope.personDeptTree = func4($scope.personDeptTree)
                    // calcuPersonDept()
                }
                // debugger
                $scope.item.checkName = row.text;
                $scope.$apply(function(){
                    $scope.item.checkName = row.text;
                });
                $scope.item.parentId = row.id
            
            }
            // 清楚选中父级
            $scope.clearSel = function(){
                $scope.item.parentId = null;
                $scope.item.checkName = null;
            }


            //供应商显示列表去重
            function func4(objArray) {
                var result = [];
                var temp = {};
                for(var i=0;i<objArray.length;i++){  
                    var myname = objArray[i].id;
                    if(temp[myname]){
                        continue;
                    }  
                    temp[myname] = true;
                    result.push(objArray[i])
                }  
                return result;  
            }
            $scope.delPro = function(item){
                for (var i =0; i < $scope.personDeptTree.length; i++)
                if ($scope.personDeptTree[i].id === item.id) {
                    $scope.personDeptTree.splice(i,1);
                    break;
                }
            }
            
         //上移
        $scope.moveUp = function(arr,index){
            if(index == 0) {
                return;
            }
            $scope.personDeptTree = swapItems($scope.personDeptTree, index, index - 1);
            debugger
            console.log(" $scope.personDeptTree", $scope.personDeptTree)
        }

        //下移
        $scope.moveDown = function(arr,index){
            if(index == arr.length -1) {
                return;
            }
            $scope.personDeptTree = swapItems($scope.personDeptTree, index, index + 1);
            debugger
            console.log(" $scope.personDeptTree", $scope.personDeptTree)
        }

        // 交换数组元素
            var swapItems = function(arr, index1, index2) {
            arr[index1] = arr.splice(index2, 1, arr[index1])[0];
                     return arr;
            };


        $scope.save = function (form) {
            if ($(".save").attr("disabled")) {
                return false;
            }

            form.$setSubmitted(true);
            if (!form.$valid) {
                return;
            }
                //用户分类
            if(!$scope.userClassify.virtualCom&&!$scope.userClassify.personal&&!$scope.userClassify.enterprise&&!$scope.userClassify.staff&&!$scope.userClassify.operation){
                alert("请勾选用户权限");
                return false;
            }
            var tempArr=[]
            $scope.userClassify.virtualCom&&tempArr.push('0');
            $scope.userClassify.personal&&tempArr.push('1');
            $scope.userClassify.enterprise&&tempArr.push("2");
            $scope.userClassify.staff&&tempArr.push("3");
            $scope.userClassify.operation&&tempArr.push("4");
            $scope.item.permission=tempArr.join(",")
            // 字段补全
            // $scope.item.serviceLevel = "2";
            // $scope.item.edition = categorySetting.edition;
            // $scope.item.parkId = $scope.dept.parkId
            $scope.item.mainType = '2'
            $scope.item.serviceIds = $scope.personDeptTree.map(e =>e.id).join()

            fac.getResult("/ovu-park/backstage/mainSer/saveOrEdit", $scope.item, function (resp) {
                $uibModalInstance.close();
                window.msg("添加服务分类成功!");
                // $rootScope.$broadcast("refresh");
            });
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    });

    //启动页栏菜单
      app.controller('startMenuCtrl', function ($scope, $rootScope, $http, $filter, $uibModal, fac) {
        document.title = "OVU-APP专用配置(集团)";
        angular.extend($rootScope, fac.dicts);
        $scope.search = {
        };
        $scope.pageModel = {};
        app.modulePromiss.then(function () {
            $scope.find();
        });


        // 查询列表
        $scope.find = function () {
            fac.getResult("/ovu-park/backstage/config/getStartPageConfig", $scope.search, function (service) {
                $scope.pageModel = service;
            });
        };
    
    
        //添加/修改
        $scope.showEditModal = function (item) {

            var modal = $uibModal.open({
                animation: false,
                size: 'md',
                templateUrl: '/view/serviceManage/AppSpecialConfig/model.editStartMenuConfig.html',
                controller: 'editStartMenuConfig',
                resolve: {
                    item:item
                }
            });
            modal.result.then(function () {
                $scope.find();
            }, function () {
                $scope.find();
                console.info('Modal dismissed at: ' + new Date());
            });
            event.stopPropagation(); 
        };
    
        $scope.del = function (item) {
            if (item.id) {
                confirm("确认删除该服务分类吗?", function () {
                    fac.getResult("/ovu-park/backstage/config/appParkConfig/delete", {
                        id: item.id,
                        // edition: '2'
                    }, function (resp) {
                        $scope.find();
                        window.msg("删除成功!");
                    });
                })
            } else {
                alert("请先选择服务！");
            }
        };
       
    
    });
    
    //启动页菜单新增分类=》编辑框组件
    app.controller('editStartMenuConfig', function ($scope, $rootScope, $http, $uibModalInstance, $filter, $uibModal, fac, item) {
        $scope.parentServiceName = "引导页"

        $scope.item_1 = {}
        $scope.item_2 = {}
        $scope.item_3 = {}

        if(item && item.picList.length > 0){
            $scope.item_1 = item.picList[0] ? item.picList[0] : {}
            $scope.item_2 = item.picList[1] ? item.picList[1] : {}
            $scope.item_3 = item.picList[2] ? item.picList[2] : {}
        }

        if(item){
            var cache = {
                "id": item.id || '',
            }
        }

        $scope.item = {}
        angular.extend($scope.item,item,cache);

     
        $scope.save = function (form) {
            if ($(".save").attr("disabled")) {
                return false;
            }

            form.$setSubmitted(true);
            if (!form.$valid) {
                return;
            }

            if(!$scope.item_1.photo && !$scope.item_2.photo && !!$scope.item_3.photo){
                alert("必须上传图片");
                return false;
            }

            
            // if($scope.item_1.photo && !$scope.item_1.rate){
            //     alert("请输入图片1的概率")
            //     return false;
            // }

            // if($scope.item_2.photo && !$scope.item_2.rate){
            //     alert("请输入图片2的概率")
            //     return false;
            // }

            // if($scope.item_3.photo && !$scope.item_3.rate){
            //     alert("请输入图片3的概率")
            //     return false;
            // }


            if( $scope.item_1.rate && ($scope.item_1.rate > 100 || $scope.item_1.rate < 0)){
                alert("请输入正确的图片概率")
                return false;
            }
            if( $scope.item_2.rate && ($scope.item_2.rate > 100 || $scope.item_2.rate < 0)){
                alert("请输入正确的图片概率")
                return false;
            }
            if( $scope.item_3.rate && ($scope.item_3.rate > 100 || $scope.item_3.rate < 0)){
                alert("请输入正确的图片概率")
                return false;
            }


            if($scope.item_1.rate || $scope.item_2.rate || $scope.item_3.rate){
                let rate_1 = $scope.item_1.rate ? $scope.item_1.rate : 0
                let rate_2 = $scope.item_2.rate ? $scope.item_2.rate : 0
                let rate_3 = $scope.item_3.rate ? $scope.item_3.rate : 0  
                if((rate_1*1 + rate_2*1 + rate_3*1) != 100){
                    alert("概率之和不为100，请重新输入")
                    return false
                }
            }

            $scope.item.picList = []

            if($scope.item_1.photo){
                $scope.item.picList.push($scope.item_1)
            }

            if($scope.item_2.photo){
                $scope.item.picList.push($scope.item_2)
            }

            if($scope.item_3.photo){
                $scope.item.picList.push($scope.item_3)
            }

            // 字段补全
            // $scope.item.parkId = $scope.dept.parkId

            var loading = layer.load(2, {
                shade: [0.1, '#000'] //0.1透明度的白色背景
            });
            $(".save").attr("disabled",true)
            $.ajax({
                type: 'post',
                dataType: 'json',
                url: '/ovu-park/backstage/config/saveOrEditStartPage',
                data: JSON.stringify($scope.item),
                contentType:"application/json",
                success: function (result) {
                    $(".save").attr("disabled",false)
                    layer.close(loading);
                    $uibModalInstance.close();
                    window.msg("操作成功!");
                },
                error: function(data){
                    $(".save").attr("disabled",false)
                    layer.close(loading);
                  alert("操作异常");
                }
            });
           
            // $.post("/ovu-park/backstage/config/saveOrEditStartPage",{id:$scope.item.id,name:$scope.item.name,picList:JSON.stringify($scope.item.picList)}, function (resp){
            //     $uibModalInstance.close();
            //     window.msg("操作成功!");

            // });
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    });

      //全局控制菜单
      app.controller('globalMenuCtrl', function ($scope, $rootScope, $http, $filter, $uibModal, fac) {
        document.title = "OVU-APP专用配置(集团)";
        angular.extend($rootScope, fac.dicts);
        $scope.search = {
            // mainType : 2
        };
        $scope.current = null;
        $scope.pageModel = {};
    
        var selectList = [];
    
        app.modulePromiss.then(function () {
                $scope.find();
        });
    
    
        // 查询列表
        $scope.find = function () {
            fac.getResult("/ovu-park/app/index/config/global/get", $scope.search, function (service) {
                $scope.pageModel = service;
            });
        };


    
        //添加/修改
        $scope.showEditModal = function (item) {
            var item = item ? item : {};
            var modal = $uibModal.open({
                animation: false,
                size: 'md',
                templateUrl: '/view/serviceManage/AppSpecialConfig/model.editGlobalMenu.html',
                controller: 'editGlobalMenu',
                resolve: {
                    item:item
                }
            });
            modal.result.then(function () {
                $scope.find();
            }, function () {
                console.info('Modal dismissed at: ' + new Date());
            });
            event.stopPropagation(); 
        };
    
    });
    
    //全局控制菜单新增分类=》编辑框组件
    app.controller('editGlobalMenu', function ($scope, $rootScope, $http, $uibModalInstance, $filter, $uibModal, fac, item) {
        $scope.parentServiceName = "全局控制"
        var cache = {
            "id": item.id,

        }

        $scope.item = {}
        angular.extend($scope.item,item,cache);


        $scope.save = function (form) {
            if ($(".save").attr("disabled")) {
                return false;
            }

            form.$setSubmitted(true);
            if (!form.$valid) {
                return;
            }

            // 字段补全
            // $scope.item.parkId = $scope.dept.parkId


            fac.getResult("/ovu-park/backstage/config/editGlobal", $scope.item, function (resp) {
                $uibModalInstance.close();
                window.msg("操作成功!");
            });
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    });
})()
