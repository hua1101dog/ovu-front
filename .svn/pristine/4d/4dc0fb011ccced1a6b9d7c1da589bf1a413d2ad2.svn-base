(function() {
    var app = angular.module("angularApp");
    app.controller('systemListCtrl', function ($scope, $rootScope, $http, $filter, $uibModal, fac) {
    	document.title ="OVU-导览系统管理";
        angular.extend($rootScope,fac.dicts);
        $scope.search = {
            
        };
        $scope.pageModel = {};

        $scope.item = {
            isShowEdit:false,
            title:'',
            explains:''
        }

        //显示新增
        $scope.showEdit = function(){
            $scope.item.isShowEdit = true
        }

        //关闭新增
        $scope.cancelEdit = function(){
            $scope.item = {
                isShowEdit:false,
                title:'',
                explains:''
            }
        }

        //保存新增
        $scope.saveEdit = function(){
            let item = {
                title:$scope.item.title,
                parkId:$scope.dept.parkId,
                explains:$scope.item.explains
            }
            $.get("/ovu-park/backstage/QueryMachineManage/save",item,function(res){
                if(res.code == 0){
                    window.msg("新增成功")
                    $scope.find(1)
                }else{
                    window.alert(res.msg)
                }
            })
            
        }

        //删除
        $scope.del = function(item){
            confirm("确认删除？", function() {
                $.get("/ovu-park/backstage/QueryMachineManage/delete",{id:item.id},function(res){
                    if(res.code == 0){
                        window.msg("删除成功")
                        $scope.find(1)
                    }else{
                        window.alert(res.msg)
                    }
                })
            })
         
        }

        // 预览大屏
        $scope.goto = function ({address,id,parkNo}) {
            let str = `${location.protocol}//${location.host}${address}?userId=${id}&parkNo=${parkNo}`
            window.open(str, "_blank");
        }

        //发布
       $scope.publish = function(item){
        let status,title;
        if(item.publishStatus==0){
            status='1'
            title='发布'
        }else{
            status='0'
            title='取消发布'
        }
        confirm("确认"+title+"？", function() {
            $.get("/ovu-park/backstage/QueryMachineManage/update",{id:item.id,publishStatus:status},function(res){
                if(res.code == 0){
                    window.msg(title+"成功")
                    $scope.find(1)
                }else{
                    window.alert(res.msg)
                }
            })
        })
       }

            //添加/修改
     $scope.showEditModel = function (item) {
            if (!$scope.search.parkId) {
                alert("请选择项目关联的部门")
                return
            } 
            var modal = $uibModal.open({
                animation: false,
                size: 'md',
                templateUrl: '/view/navigationSystemManage/systemList/model.editModel.html',
                controller: 'systemListEdit',
                resolve: {
                    item:item
                }
            });
            modal.result.then(function () {
                $scope.find(1);
            }, function () {
                $scope.find();
                console.info('Modal dismissed at: ' + new Date());
            });
        };

        //进入管理
        $scope.toModelManage = function(item){
            // $rootScope.target("navigationSystemManage/modelManage/modelManageIndex", "板块管理", false, '', {'id':item.id}, "navigationSystemManage/modelManage/modelManageIndex");
            var modal = $uibModal.open({
                animation: false,
                size: 'lg',
                templateUrl: '/view/navigationSystemManage/modelManage/modelManageIndex.html',
                controller: 'modelManageCtrl',
                resolve: {
                    item:item
                }
            });
            modal.result.then(function () {
                $scope.find(1);
            }, function () {
                $scope.find();
                console.info('Modal dismissed at: ' + new Date());
            });
        }
 
        $scope.find = function(pageNo){
            if (!$scope.search.parkId) {
                alert("请选择项目关联的部门")
                $scope.pageModel = {};
                return
            }
            $scope.item = {
                isShowEdit:false,
                title:'',
                explains:''
            }
        	if($scope.pageModel.currentPage){
                delete $scope.pageModel.currentPage;
            }
            $.extend($scope.search,{currentPage:pageNo||$scope.pageModel.currentPage||1,pageSize:$scope.pageModel.pageSize||10});
            $scope.search.pageIndex = $scope.search.currentPage-1;
            $scope.search.totalCount = $scope.pageModel.totalCount||0;
            fac.getPageResult("/ovu-park/backstage/QueryMachineManage/queryByPage", $scope.search,function(data){
                $scope.pageModel = data;
            });
        };
        app.modulePromiss.then(function() {
            // $scope.find(1);
            // fac.initPage($scope,function(){
            // 	$scope.find(1);
            // })
            $scope.$watch('dept.id', function (deptId, oldValue) {
                if (deptId) {
                    if ($scope.dept.parkId) {
                        $scope.search.parkId = $scope.dept.parkId
                        $scope.find();
                    } else {
                        $scope.search.parkId && delete $scope.search.parkId
                        $scope.find();
                        return
                    }
                }else{
                    $scope.find();
                }
            })
        });
        $scope.query = function(){
        	fac.initPage($scope, function () {
                $scope.find(1);
            })
        }
    });

     // 新增/标签管理
     app.controller('systemListEdit', function ($scope, $rootScope, $http, $uibModalInstance, $filter, $uibModal, fac, item) {
        $scope.item = item || {}
        $scope.save = function (form,item) {
            form.$setSubmitted(true);
            if (!form.$valid) {
                return;
            }
            var loading = layer.load(2, {
                shade: [0.1,'#fff'] //0.1透明度的白色背景
              });
            if(item.id){
                $.get("/ovu-park/backstage/QueryMachineManage/update", $scope.item, function (resp) {
                    layer.close(loading);
                    if(resp.code == 0){
                        $uibModalInstance.close();
                        window.msg("操作成功!");
    
                    }else{
                        window.alert("操作失败")
                    }
                    
                });
            }else{
                let item = {
                    title:$scope.item.title,
                    parkId:$scope.dept.parkId,
                    explains:$scope.item.explains,
                    address:$scope.item.address
                }
                $.get("/ovu-park/backstage/QueryMachineManage/save",item,function(res){
                    layer.close(loading);
                    if(res.code == 0){
                        $uibModalInstance.close();
                        window.msg("新增成功")
                    }else{
                        window.alert(res.msg)
                    }
                })
            }

           
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    });

    //标签管理
    app.controller('modelManageCtrl', function ($scope, $rootScope, $http, $filter, $uibModal, fac, $uibModalInstance,item) {
        document.title = "OVU-标签管理";
        // if(!$rootScope.pages.params){
        //     window.alert("请先选择查询机")
        //     window.location.href = "/view/main.html?module=250#/navigationSystemManage/systemList/systemListIndex";
        //     $rootScope.target("navigationSystemManage/systemList/systemList", "系统列表", false, '', '', "navigationSystemManage/systemList/systemList");
        // }
        $scope.itemObj=item;
        angular.extend($rootScope, fac.dicts);
        // $scope.contractId = $rootScope.pages.params;
        $scope.contractId = item
        $scope.search = {
            machineId: item.id
        };

        $scope.pageModel = {};

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
            fac.getPageResult("/ovu-park/backstage/QueryMachineManage/block/queryAll", $scope.search, function (data) {
                $scope.pageModel = data;
            });
        };
        
        app.modulePromiss.then(function () {
            fac.initPage($scope, function () {
                $scope.find(1);
            })
        });
        $scope.query = function () {
            fac.initPage($scope, function () {
                $scope.find(1);
            })
        }

        //模块上移
        $scope.provModel = function(item,curIndex){
            if(curIndex==0){
                window.msg("已经是第一个，不能上移")
                return 
            }
            let params = {
                machineId: $scope.contractId.id,
                orderNo:item.orderNo,
                type:1,
                id:item.id
            }
            $.get("/ovu-park/backstage/QueryMachineManage/block/upOrDown",params, function (resp) {
                if(resp.code == 0){
                    window.msg("上移成功")
                    $scope.find(1)
                }else{
                    window.alert("操作失败")
                }
                
            });
        }

          //模块下移
          $scope.nextModel = function(item,curIndex){
            if(curIndex==$scope.pageModel.length-1){
                window.msg("已经是最后一个，不能下移")
                return 
            }
            let params = {
                machineId: $scope.contractId.id,
                orderNo:item.orderNo,
                type:0,
                id:item.id
            }
            $.get("/ovu-park/backstage/QueryMachineManage/block/upOrDown",params, function (resp) {
                if(resp.code == 0){
                    window.msg("下移成功")
                    $scope.find(1)
                }else{
                    window.alert("操作失败")
                }
                
            });
        }

        $scope.delModel = function(item){
            confirm("确认删除？", function() {
            let params = {
                machineId: $scope.contractId.id,
                orderNo:item.orderNo,
                id:item.id
            }

            $.get("/ovu-park/backstage/QueryMachineManage/block/delete",params, function (resp) {
                if(resp.code == 0){
                    window.msg("删除成功")
                    $scope.find(1)
                }else{
                    window.alert("操作失败")
                }
            
                });

            })
        }

        //查看详情
        $scope.showModel = function(item){
            var modal = $uibModal.open({
                animation: false,
                size: 'lg',
                templateUrl: '/view/navigationSystemManage/modelManage/model.showModel.html',
                controller: 'showModelCtrl',
                resolve: {
                    item: item
                }
            });
            modal.result.then(function () {
                $scope.find();
            }, function () {
                console.info('Modal dismissed at: ' + new Date());
            });
        }

        //新增板块
        $scope.addModel = function () {
            var modal = $uibModal.open({
                animation: false,
                size: 'lg',
                templateUrl: '/view/navigationSystemManage/modelManage/model.addModel.html',
                controller: 'modelManageAddCtrl',
                resolve: {
                    item: $scope.contractId
                }
            });
            modal.result.then(function () {
                $scope.find(1);
            }, function () {
                $scope.find();
                console.info('Modal dismissed at: ' + new Date());
            });
        }

        //编辑板块
        $scope.editModel = function (item) {
            var modal = $uibModal.open({
                animation: false,
                size: 'lg',
                templateUrl: '/view/navigationSystemManage/modelManage/model.editModel.html',
                controller: 'modelManageEditCtrl',
                resolve: {
                    item: item
                }
            });
            modal.result.then(function () {
                $scope.find();
            }, function () {
                $scope.find();
                console.info('Modal dismissed at: ' + new Date());
            });
        }
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    });

      // 新增板块
      app.controller('modelManageAddCtrl', function ($scope, $rootScope, $http, $uibModalInstance, $filter, $uibModal, fac, item) {
        $scope.item = item
        $scope.contractId = $scope.item;
        $scope.showModal_2 = false
        $scope.showModal_3 = false
        $scope.item_1 = {supportCheck:'1',contentForm:'0',navigationContent:'0'}
        $scope.item_2 = {supportCheck:'1',contentForm:'0',navigationContent:'0'}
        $scope.item_3 = {supportCheck:'1',contentForm:'0',navigationContent:'0'}
        $scope.companyList1=[]
        $scope.companyList2=[]
        $scope.companyList3=[]
        $scope.textImgList1=[{themeTitle:'',themeContent:''}]
        $scope.textImgList2=[{themeTitle:'',themeContent:''}]
        $scope.textImgList3=[{themeTitle:'',themeContent:''}]

        $scope.block = {
            machineId: $scope.contractId.id
        }
        $scope.contentList = []
        $scope.showModal2 = function () {
            if($scope.showModal_2){
                $scope.showModal_2=false
                $scope.showModal_3=false
            }else{
                $scope.showModal_2 = !$scope.showModal_2
                $scope.item_2 = {supportCheck:'1',contentForm:'0',navigationContent:'0'}
                $scope.textImgList2=[{themeTitle:'',themeContent:''}]
            }
            
        }
        $scope.showModal3 = function () {
            $scope.showModal_3 = !$scope.showModal_3
            if( $scope.showModal_3 ){
                $scope.item_3 = {supportCheck:'1',contentForm:'0',navigationContent:'0'}
                $scope.textImgList3=[{themeTitle:'',themeContent:''}]
            }
        }
        $scope.searchCompany1 = function (name) {
            console.log(name)
            if (!name) {
                return
            }
            var param = {
                parkId: app.park.parkId,
                pageSize: 10,
                pageIndex: 0,
                companyName: name
            };
            $http.get('/ovu-base/ovupark/backstage/customer/listCompanyByGrid', {
                params: param
            }).success(function (response) {
                if (response && response.code == 0) {
                    $scope.companyList1 = response.data.data;
                    for (var i = 0; i < $scope.companyList1.length; i++) {
                        if ($scope.companyList1[i].companyName == $scope.item_1.companyName) {
                            $scope.item_1.navigationRange = $scope.companyList1[i].id;
                            break;
                            
                        }
                    }
                    if(i==$scope.companyList1.length){
                        $scope.item_1.navigationRange ='';
                    }
                }
            })
        }
        $scope.searchCompany2 = function (name) {
            if (!name) {
                return
            }
            var param = {
                parkId: app.park.parkId,
                pageSize: 10,
                pageIndex: 0,
                companyName: name
            };
            $http.get('/ovu-base/ovupark/backstage/customer/listCompanyByGrid', {
                params: param
            }).success(function (response) {
                if (response && response.code == 0) {
                    $scope.companyList2 = response.data.data;
                    for (var i = 0; i < $scope.companyList2.length; i++) {
                        if ($scope.companyList2[i].companyName == $scope.item_2.companyName) {
                            $scope.item_2.navigationRange = $scope.companyList2[i].id;
                            break;
                        }
                    }
                    if(i==$scope.companyList2.length){
                        $scope.item_2.navigationRange ='';
                    }
                }
            })
        }
        $scope.searchCompany3 = function (name) {
            console.log(name)
            if (!name) {
                return
            }
            var param = {
                parkId:app.park.parkId,
                pageSize: 10,
                pageIndex: 0,
                companyName: name
            };
            $http.get('/ovu-base/ovupark/backstage/customer/listCompanyByGrid', {
                params: param
            }).success(function (response) {
                if (response && response.code == 0) {
                    $scope.companyList3 = response.data.data;
                    for (var i = 0; i < $scope.companyList3.length; i++) {
                        if ($scope.companyList3[i].companyName == $scope.item_3.companyName) {
                            $scope.item_3.navigationRange = $scope.companyList3[i].id;
                            break;
                        }
                    }
                    if(i==$scope.companyList3.length){
                        $scope.item_3.navigationRange ='';
                    }
                }
            })
        }
        // 选择地图
        $scope.setName = function (name) {
            let param={
                parkId:app.park.parkId
            }
            $http.get("/ovu-park/backstage/QueryMachineManage/content/queryMap", {
                params: param
            }).success(function (response) {
                if (response && response.code == 0) {
                    $scope.pageModel = response.data;
                } else {
                    window.alert(response.msg);
                }
            })
        }
        $scope.setName()

        $scope.addContent = function () {
            $scope.textImgList1.push({themeTitle:'',themeContent:''})
        }

        $scope.addContent_2 = function () {
            $scope.textImgList2.push({themeTitle:'',themeContent:''})
        }

        $scope.addContent_3 = function () {
            $scope.textImgList3.push({themeTitle:'',themeContent:''})
        }

        $scope.delContent = function(){
            if( $scope.textImgList1.length == 1){
                window.alert("至少保留一条内容")
                return
            }else{
                $scope.textImgList1.pop()
            }
        }

        $scope.delContent_2 = function(){
            if($scope.textImgList2.length == 1){
                window.alert("至少保留一条内容")
                return
            }else{
                $scope.textImgList2.pop()
            }
        }

        $scope.delContent_3 = function(){
            if($scope.textImgList3.length == 1){
                window.alert("至少保留一条内容")
                return
            }else{
                $scope.textImgList3.pop()
            }

        }



        $scope.save = function (form, item) {
            
            form.$setSubmitted(true);
            if (!form.$valid) {
                return;
            }
            if ($scope.item_1.title) {
                if($scope.item_1.supportCheck==0){
                    let textListArr = []
                    let titleListArr =[]
                    if($scope.item_1.contentForm != 1){
                        for (let i = 0; i <  $scope.textImgList1.length; i++) {
                            let tempText1 =  $scope.textImgList1[i]
                            if(!tempText1.themeContent){
                                alert("请填写第一个板块的内容"+(i+1))
                                retrun
                            }
                            textListArr.push(tempText1.themeContent)
                            titleListArr.push(tempText1.themeTitle)
                        }
                        $scope.item_1.contentList =textListArr
                        $scope.item_1.themeList =titleListArr
                        $scope.item_1.companyName=''
                        $scope.item_1.navigationRange=''
                        $scope.item_1.navigationContent='0'
                        $scope.item_1.map=''
                    }else{
                        if($scope.item_1.navigationContent==0&&!$scope.item_1.navigationRange){
                            alert("选择企业无效！")
                            return
                        }
                    }
                    if($scope.item_1.navigationContent==1){
                        $scope.item_1.companyName=''
                    }
                }else{
                    $scope.item_1.contentForm='0'
                    $scope.item_1.companyName=''
                    $scope.item_1.navigationRange=''
                    $scope.item_1.navigationContent='0'
                }
                
                $scope.contentList.push($scope.item_1)
            }

            if ($scope.showModal_2){
                if($scope.item_2.orderNo==$scope.item_1.orderNo){
                    alert("请不要填写重复的序号！")
                    return
                }
                
                if($scope.item_2.supportCheck==0){
                    let textListArr_2 = []
                    let titleListArr_2 =[]
                    if($scope.item_2.contentForm != 1){
                        for (let i = 0; i <  $scope.textImgList2.length; i++) {
                            let tempText2 =  $scope.textImgList2[i]
                            if(!tempText2.themeContent){
                                alert("请填写第二个板块的内容"+(i+1))
                                retrun
                            }
                            textListArr_2.push(tempText2.themeContent)
                            titleListArr_2.push(tempText2.themeTitle)
                        }
                        $scope.item_2.themeList = titleListArr_2
                        $scope.item_2.contentList = textListArr_2
                        $scope.item_2.companyName=''
                        $scope.item_2.navigationRange=''
                        $scope.item_2.navigationContent='0'
                        $scope.item_2.map=''
                    }else{
                        if($scope.item_2.navigationContent==0&&!$scope.item_2.navigationRange){
                            alert("选择企业无效！")
                            return
                        }
                    }
                    if($scope.item_2.navigationContent==1){
                        $scope.item_2.companyName=''
                    }
                }else{
                    $scope.item_2.contentForm='0'
                    $scope.item_2.companyName=''
                    $scope.item_2.navigationRange=''
                    $scope.item_2.navigationContent='0'
                }
               
                $scope.contentList.push($scope.item_2)
            }

            if ($scope.showModal_3) {
                if($scope.item_3.orderNo==$scope.item_1.orderNo||$scope.item_3.orderNo==$scope.item_2.orderNo){
                    alert("请不要填写重复的序号！")
                    return
                }
                if($scope.item_3.supportCheck==0){
                    if($scope.item_3.contentForm != 1){
                        let textListArr_3 = []
                        let titleListArr_3 = []
                        for (let i = 0; i <  $scope.textImgList3.length; i++) {
                            let tempText3 =  $scope.textImgList3[i]
                            if(!tempText3.themeContent){
                                alert("请填写第三个板块的内容"+(i+1))
                                retrun
                            }
                            textListArr_3.push(tempText3.themeContent)
                            titleListArr_3.push(tempText3.themeTitle)
                        }
                        $scope.item_3.themeList = titleListArr_3
                        $scope.item_3.contentList = textListArr_3
                        $scope.item_3.companyName=''
                        $scope.item_3.navigationRange=''
                        $scope.item_3.navigationContent='0'
                        $scope.item_3.map=''
                    }else{
                        if($scope.item_3.navigationContent==0&&!$scope.item_3.navigationRange){
                            alert("选择企业无效！")
                            return
                        }
                    }
                    if($scope.item_3.navigationContent==1){
                        $scope.item_3.companyName=''
                    }
                }else{
                    $scope.item_3.contentForm='0'
                    $scope.item_3.companyName=''
                    $scope.item_3.navigationRange=''
                    $scope.item_3.navigationContent='0'
                }
                
                $scope.contentList.push($scope.item_3)
            }

            let params = {
                block: $scope.block,
                contentList: $scope.contentList
            }
            $.ajax({
                type: 'post',
                dataType: 'json',
                url: '/ovu-park/backstage/QueryMachineManage/block/save',
                data: JSON.stringify(params),
                contentType: "application/json",
                success: function (res) {
                    if (res.code == 0) {
                        $uibModalInstance.close();
                        window.msg("操作成功!");
                    } else {
                        window.alert(res.msg)
                    }

                },
                error: function (data) {
                    alert("操作异常");
                }
            });

        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    });
     // 编辑板块
     app.controller('modelManageEditCtrl', function ($scope, $rootScope, $http, $uibModalInstance, $filter, $uibModal, fac, item) {
        $scope.item = item
        $scope.contractId = $rootScope.pages.params;
        $scope.showModal_2 = false
        $scope.showModal_3 = false
        $scope.item_1 = {}
        $scope.item_2 = {}
        $scope.item_3 = {}
        $scope.textImgList1=[]
        $scope.textImgList2=[]
        $scope.textImgList3=[]
        $scope.companyList1=[]
        $scope.companyList2=[]
        $scope.companyList3=[]
        $scope.contentList=[]
        $http.get('/ovu-park/backstage/QueryMachineManage/block/queryInfo?id=' + $scope.item.id).success(function (resp){
            if(resp.code == 0){
                $scope.block = resp.data.block
                let tempContentList = resp.data.contentList
                
                if(tempContentList.length > 0){
                    $scope.item_1 =tempContentList[0]
                    $scope.item_1.orderNo=parseInt($scope.item_1.orderNo)
                    if($scope.item_1.contentForm != 1){
                        let tempTheme1=JSON.parse($scope.item_1.theme)
                        if(tempTheme1){ 
                            let tempContent1=JSON.parse($scope.item_1.content)
                            tempTheme1&&tempTheme1.forEach((element,i) => {
                                $scope.textImgList1.push({themeTitle:element,themeContent:tempContent1[i]})
                            });
                            delete $scope.item_1.theme
                            delete $scope.item_1.content
                        }else{
                            $scope.textImgList1=[{themeTitle:'',themeContent:''}]
                           
                        }
                       
                    }
                }

                if(tempContentList.length >1){
                    $scope.item_2 = tempContentList[1]
                    $scope.item_2.orderNo=parseInt($scope.item_2.orderNo)
                    $scope.showModal_2 = true
                    if($scope.item_2.contentForm != 1){
                        let tempTheme2= JSON.parse($scope.item_2.theme)
                        if(tempTheme2){
                            let tempContent2= JSON.parse($scope.item_2.content)
                            tempTheme2&&tempTheme2.forEach((element,i) => {
                                $scope.textImgList2.push({themeTitle:element,themeContent:tempContent2[i]})
                            });
                            delete $scope.item_2.theme
                            delete $scope.item_2.content
                        }else{
                            $scope.textImgList2=[{themeTitle:'',themeContent:''}]
                        }
                    }
                }
                
                if(tempContentList.length >2){
                    $scope.item_3 = tempContentList[2]
                    $scope.item_3.orderNo=parseInt($scope.item_3.orderNo)
                    $scope.showModal_3 = true
                    if($scope.item_3.contentForm != 1){
                        let tempTheme3= JSON.parse($scope.item_3.theme)
                        if(tempTheme3){
                            let tempContent3= JSON.parse($scope.item_3.content)
                            tempTheme3&&tempTheme3.forEach((element,i) => {
                                $scope.textImgList3.push({themeTitle:element,themeContent:tempContent3[i]})
                            });
                            delete $scope.item_3.theme
                            delete $scope.item_3.content
                        }else{
                            $scope.textImgList3=[{themeTitle:'',themeContent:''}]
                        }
                        
                    }
                }


            }else{
                window.alert("操作失败")
            }
            
        });


        $scope.showModal2 = function () {
            if($scope.showModal_2){
                $scope.showModal_2=false
                $scope.showModal_3=false

            }else{
                $scope.showModal_2 = !$scope.showModal_2
                $scope.item_2 = {supportCheck:'1',contentForm:'0',navigationContent:'0'}
                $scope.textImgList2=[{themeTitle:'',themeContent:''}]
            }
        }
        $scope.showModal3 = function () {
            $scope.showModal_3 = !$scope.showModal_3
            if( $scope.showModal_3){
                $scope.item_3 = {supportCheck:'1',contentForm:'0',navigationContent:'0'}
                $scope.textImgList3=[{themeTitle:'',themeContent:''}]
            }
            
        }
        $scope.searchCompany1 = function (name) {
            console.log(name)
            if (!name) {
                return
            }
            var param = {
                parkId: app.park.parkId,
                pageSize: 10,
                pageIndex: 0,
                companyName: name
            };
            $http.get('/ovu-base/ovupark/backstage/customer/listCompanyByGrid', {
                params: param
            }).success(function (response) {
                if (response && response.code == 0) {
                    $scope.companyList1 = response.data.data;
                    for (var i = 0; i < $scope.companyList1.length; i++) {
                        if ($scope.companyList1[i].companyName == $scope.item_1.companyName) {
                            $scope.item_1.navigationRange = $scope.companyList1[i].id;
                            break;
                            
                        }
                    }
                    if(i==$scope.companyList1.length){
                        $scope.item_1.navigationRange ='';
                    }
                }
            })
        }
        $scope.searchCompany2 = function (name) {
            console.log(name)
            if (!name) {
                return
            }
            var param = {
                parkId: app.park.parkId,
                pageSize: 10,
                pageIndex: 0,
                companyName: name
            };
            $http.get('/ovu-base/ovupark/backstage/customer/listCompanyByGrid', {
                params: param
            }).success(function (response) {
                if (response && response.code == 0) {
                    $scope.companyList2 = response.data.data;
                    for (var i = 0; i < $scope.companyList2.length; i++) {
                        if ($scope.companyList2[i].companyName == $scope.item_2.companyName) {
                            $scope.item_2.navigationRange = $scope.companyList2[i].id;
                            break;
                        }
                    }
                    if(i==$scope.companyList2.length){
                        $scope.item_2.navigationRange ='';
                    }
                }
            })
        }
        $scope.searchCompany3 = function (name) {
            console.log(name)
            if (!name) {
                return
            }
            var param = {
                parkId:app.park.parkId,
                pageSize: 10,
                pageIndex: 0,
                companyName: name
            };
            $http.get('/ovu-base/ovupark/backstage/customer/listCompanyByGrid', {
                params: param
            }).success(function (response) {
                if (response && response.code == 0) {
                    $scope.companyList3 = response.data.data;
                    for (var i = 0; i < $scope.companyList3.length; i++) {
                        if ($scope.companyList3[i].companyName == $scope.item_3.companyName) {
                            $scope.item_3.navigationRange = $scope.companyList3[i].id;
                            break;
                        }
                    }
                    if(i==$scope.companyList3.length){
                        $scope.item_3.navigationRange ='';
                    }
                }
            })
        }

        // 选择客户
        $scope.setName = function (name) {
            let param={
                parkId:app.park.parkId
            }
            $http.get("/ovu-park/backstage/QueryMachineManage/content/queryMap", {
                params: param
            }).success(function (response) {
                if (response && response.code == 0) {
                    $scope.pageModel = response.data;
                    // for (var i = 0; i < $scope.staffList.data.length; i++) {
                    //     if ($scope.staffList.data[i].name === $scope.search.userName) {
                    //         $scope.search.userName = $scope.staffList.data[i].name;
                    //         $scope.search.userId = $scope.staffList.data[i].id;
                    //         $scope.search.userType = $scope.staffList.data[i].userType
                    //         $scope.search.userTypeStr = $filter('userTypeStatus')($scope.staffList.data[i].userType);
                    //         $scope.chooseStaff = $scope.staffList.data[i];
                    //         break;
                    //     }
                    // }
                } else {
                    window.alert(response.msg);
                }
            })
        }
        $scope.setName()

     
        var getContent=function(curIndex){ 
            //添加图文
            let divContent = `
            <div class="textList">
            <label class="control-label  col-xs-2">主题`+curIndex+`:</label>
             <div class="col-xs-9">
                  <input type="text"  class="form-control ng-pristine ng-untouched ng-valid ng-empty titleList">
              </div>
              <div class="col-xs-11" style="position: relative;margin: 5px 0 5px 150px ">
              <label class="col-xs-2 control-label" style="margin-left: -140px;"> 内容`+curIndex+`：</label>
            <div class="edui-container" style="width: 635px; z-index: 999;"><div class="edui-toolbar"><div class="edui-btn-toolbar" unselectable="on" onmousedown="return false"><div class="edui-btn edui-btn-fullscreen" unselectable="on" onmousedown="return false" data-original-title="全屏"> <div unselectable="on" class="edui-icon-fullscreen edui-icon"></div><div class="edui-tooltip" unselectable="on" onmousedown="return false"><div class="edui-tooltip-arrow" unselectable="on" onmousedown="return false"></div><div class="edui-tooltip-inner" unselectable="on" onmousedown="return false"></div></div></div><div class="edui-btn edui-btn-source" unselectable="on" onmousedown="return false" data-original-title="源代码"> <div unselectable="on" class="edui-icon-source edui-icon"></div><div class="edui-tooltip" unselectable="on" onmousedown="return false"><div class="edui-tooltip-arrow" unselectable="on" onmousedown="return false"></div><div class="edui-tooltip-inner" unselectable="on" onmousedown="return false"></div></div></div><div class="edui-separator" unselectable="on" onmousedown="return false"></div><div class="edui-btn edui-btn-undo  edui-disabled" unselectable="on" onmousedown="return false" data-original-title="撤销"> <div unselectable="on" class="edui-icon-undo edui-icon"></div><div class="edui-tooltip" unselectable="on" onmousedown="return false"><div class="edui-tooltip-arrow" unselectable="on" onmousedown="return false"></div><div class="edui-tooltip-inner" unselectable="on" onmousedown="return false"></div></div></div><div class="edui-btn edui-btn-redo  edui-disabled" unselectable="on" onmousedown="return false" data-original-title="重做"> <div unselectable="on" class="edui-icon-redo edui-icon"></div><div class="edui-tooltip" unselectable="on" onmousedown="return false"><div class="edui-tooltip-arrow" unselectable="on" onmousedown="return false"></div><div class="edui-tooltip-inner" unselectable="on" onmousedown="return false"></div></div></div><div class="edui-separator" unselectable="on" onmousedown="return false"></div><div class="edui-btn edui-btn-bold" unselectable="on" onmousedown="return false" data-original-title="加粗"> <div unselectable="on" class="edui-icon-bold edui-icon"></div><div class="edui-tooltip" unselectable="on" onmousedown="return false"><div class="edui-tooltip-arrow" unselectable="on" onmousedown="return false"></div><div class="edui-tooltip-inner" unselectable="on" onmousedown="return false"></div></div></div><div class="edui-btn edui-btn-italic" unselectable="on" onmousedown="return false" data-original-title="斜体"> <div unselectable="on" class="edui-icon-italic edui-icon"></div><div class="edui-tooltip" unselectable="on" onmousedown="return false"><div class="edui-tooltip-arrow" unselectable="on" onmousedown="return false"></div><div class="edui-tooltip-inner" unselectable="on" onmousedown="return false"></div></div></div><div class="edui-btn edui-btn-underline" unselectable="on" onmousedown="return false" data-original-title="下划线"> <div unselectable="on" class="edui-icon-underline edui-icon"></div><div class="edui-tooltip" unselectable="on" onmousedown="return false"><div class="edui-tooltip-arrow" unselectable="on" onmousedown="return false"></div><div class="edui-tooltip-inner" unselectable="on" onmousedown="return false"></div></div></div><div class="edui-btn edui-btn-strikethrough" unselectable="on" onmousedown="return false" data-original-title="删除线"> <div unselectable="on" class="edui-icon-strikethrough edui-icon"></div><div class="edui-tooltip" unselectable="on" onmousedown="return false"><div class="edui-tooltip-arrow" unselectable="on" onmousedown="return false"></div><div class="edui-tooltip-inner" unselectable="on" onmousedown="return false"></div></div></div><div class="edui-separator" unselectable="on" onmousedown="return false"></div><div class="edui-btn edui-btn-superscript" unselectable="on" onmousedown="return false" data-original-title="上标"> <div unselectable="on" class="edui-icon-superscript edui-icon"></div><div class="edui-tooltip" unselectable="on" onmousedown="return false"><div class="edui-tooltip-arrow" unselectable="on" onmousedown="return false"></div><div class="edui-tooltip-inner" unselectable="on" onmousedown="return false"></div></div></div><div class="edui-btn edui-btn-subscript" unselectable="on" onmousedown="return false" data-original-title="下标"> <div unselectable="on" class="edui-icon-subscript edui-icon"></div><div class="edui-tooltip" unselectable="on" onmousedown="return false"><div class="edui-tooltip-arrow" unselectable="on" onmousedown="return false"></div><div class="edui-tooltip-inner" unselectable="on" onmousedown="return false"></div></div></div><div class="edui-separator" unselectable="on" onmousedown="return false"></div><div class="edui-splitbutton edui-splitbutton-forecolor" unselectable="on" data-original-title="字体颜色"><div class="edui-btn" unselectable="on"><div unselectable="on" class="edui-icon-forecolor edui-icon"></div><div class="edui-splitbutton-color-label"></div></div><div unselectable="on" class="edui-btn edui-dropdown-toggle"><div unselectable="on" class="edui-caret"></div></div><div class="edui-tooltip" unselectable="on" onmousedown="return false"><div class="edui-tooltip-arrow" unselectable="on" onmousedown="return false"></div><div class="edui-tooltip-inner" unselectable="on" onmousedown="return false"></div></div><div class="edui-tooltip" unselectable="on" onmousedown="return false" style="z-index: 1000; display: none; top: 22px; left: -14px;"><div class="edui-tooltip-arrow" unselectable="on" onmousedown="return false"></div><div class="edui-tooltip-inner" unselectable="on" onmousedown="return false">字体颜色</div></div></div><div class="edui-splitbutton edui-splitbutton-backcolor" unselectable="on" data-original-title="背景色"><div class="edui-btn" unselectable="on"><div unselectable="on" class="edui-icon-backcolor edui-icon"></div><div class="edui-splitbutton-color-label"></div></div><div unselectable="on" class="edui-btn edui-dropdown-toggle"><div unselectable="on" class="edui-caret"></div></div><div class="edui-tooltip" unselectable="on" onmousedown="return false"><div class="edui-tooltip-arrow" unselectable="on" onmousedown="return false"></div><div class="edui-tooltip-inner" unselectable="on" onmousedown="return false"></div></div></div><div class="edui-separator" unselectable="on" onmousedown="return false"></div><div class="edui-btn edui-btn-removeformat" unselectable="on" onmousedown="return false" data-original-title="清除格式"> <div unselectable="on" class="edui-icon-removeformat edui-icon"></div><div class="edui-tooltip" unselectable="on" onmousedown="return false"><div class="edui-tooltip-arrow" unselectable="on" onmousedown="return false"></div><div class="edui-tooltip-inner" unselectable="on" onmousedown="return false"></div></div></div><div class="edui-separator" unselectable="on" onmousedown="return false"></div><div class="edui-btn edui-btn-insertorderedlist" unselectable="on" onmousedown="return false" data-original-title="有序列表"> <div unselectable="on" class="edui-icon-insertorderedlist edui-icon"></div><div class="edui-tooltip" unselectable="on" onmousedown="return false"><div class="edui-tooltip-arrow" unselectable="on" onmousedown="return false"></div><div class="edui-tooltip-inner" unselectable="on" onmousedown="return false"></div></div></div><div class="edui-btn edui-btn-insertunorderedlist" unselectable="on" onmousedown="return false" data-original-title="无序列表"> <div unselectable="on" class="edui-icon-insertunorderedlist edui-icon"></div><div class="edui-tooltip" unselectable="on" onmousedown="return false"><div class="edui-tooltip-arrow" unselectable="on" onmousedown="return false"></div><div class="edui-tooltip-inner" unselectable="on" onmousedown="return false"></div></div></div><div class="edui-separator" unselectable="on" onmousedown="return false"></div><div class="edui-btn edui-btn-selectall" unselectable="on" onmousedown="return false" data-original-title="全选"> <div unselectable="on" class="edui-icon-selectall edui-icon"></div><div class="edui-tooltip" unselectable="on" onmousedown="return false"><div class="edui-tooltip-arrow" unselectable="on" onmousedown="return false"></div><div class="edui-tooltip-inner" unselectable="on" onmousedown="return false"></div></div></div><div class="edui-btn edui-btn-cleardoc" unselectable="on" onmousedown="return false" data-original-title="清空文档"> <div unselectable="on" class="edui-icon-cleardoc edui-icon"></div><div class="edui-tooltip" unselectable="on" onmousedown="return false"><div class="edui-tooltip-arrow" unselectable="on" onmousedown="return false"></div><div class="edui-tooltip-inner" unselectable="on" onmousedown="return false"></div></div></div><div class="edui-btn edui-btn- edui-btn-name-paragraph edui-combobox" unselectable="on" onmousedown="return false" data-original-title="段落格式"> <span unselectable="on" onmousedown="return false" class="edui-button-label">段落格式</span><span class="edui-button-spacing"></span><span unselectable="on" onmousedown="return false" class="edui-caret"></span><div class="edui-tooltip" unselectable="on" onmousedown="return false"><div class="edui-tooltip-arrow" unselectable="on" onmousedown="return false"></div><div class="edui-tooltip-inner" unselectable="on" onmousedown="return false"></div></div></div><div class="edui-separator" unselectable="on" onmousedown="return false"></div><div class="edui-btn edui-btn- edui-btn-name-fontfamily edui-combobox" unselectable="on" onmousedown="return false" data-original-title="字体"> <span unselectable="on" onmousedown="return false" class="edui-button-label">arial</span><span class="edui-button-spacing"></span><span unselectable="on" onmousedown="return false" class="edui-caret"></span><div class="edui-tooltip" unselectable="on" onmousedown="return false"><div class="edui-tooltip-arrow" unselectable="on" onmousedown="return false"></div><div class="edui-tooltip-inner" unselectable="on" onmousedown="return false"></div></div></div><div class="edui-btn edui-btn- edui-btn-name-fontsize edui-combobox" unselectable="on" onmousedown="return false" data-original-title="字号"> <span unselectable="on" onmousedown="return false" class="edui-button-label">16</span><span class="edui-button-spacing"></span><span unselectable="on" onmousedown="return false" class="edui-caret"></span><div class="edui-tooltip" unselectable="on" onmousedown="return false"><div class="edui-tooltip-arrow" unselectable="on" onmousedown="return false"></div><div class="edui-tooltip-inner" unselectable="on" onmousedown="return false"></div></div></div><div class="edui-separator" unselectable="on" onmousedown="return false"></div><div class="edui-btn edui-btn-justifyleft" unselectable="on" onmousedown="return false" data-original-title="居左对齐"> <div unselectable="on" class="edui-icon-justifyleft edui-icon"></div><div class="edui-tooltip" unselectable="on" onmousedown="return false"><div class="edui-tooltip-arrow" unselectable="on" onmousedown="return false"></div><div class="edui-tooltip-inner" unselectable="on" onmousedown="return false"></div></div></div><div class="edui-btn edui-btn-justifycenter" unselectable="on" onmousedown="return false" data-original-title="居中对齐"> <div unselectable="on" class="edui-icon-justifycenter edui-icon"></div><div class="edui-tooltip" unselectable="on" onmousedown="return false"><div class="edui-tooltip-arrow" unselectable="on" onmousedown="return false"></div><div class="edui-tooltip-inner" unselectable="on" onmousedown="return false"></div></div></div><div class="edui-btn edui-btn-justifyright" unselectable="on" onmousedown="return false" data-original-title="居右对齐"> <div unselectable="on" class="edui-icon-justifyright edui-icon"></div><div class="edui-tooltip" unselectable="on" onmousedown="return false"><div class="edui-tooltip-arrow" unselectable="on" onmousedown="return false"></div><div class="edui-tooltip-inner" unselectable="on" onmousedown="return false"></div></div></div><div class="edui-separator" unselectable="on" onmousedown="return false"></div><div class="edui-btn edui-btn-link" unselectable="on" onmousedown="return false" data-original-title="超链接"> <div unselectable="on" class="edui-icon-link edui-icon"></div><div class="edui-tooltip" unselectable="on" onmousedown="return false"><div class="edui-tooltip-arrow" unselectable="on" onmousedown="return false"></div><div class="edui-tooltip-inner" unselectable="on" onmousedown="return false"></div></div></div><div class="edui-btn edui-btn-unlink" unselectable="on" onmousedown="return false" data-original-title="取消链接"> <div unselectable="on" class="edui-icon-unlink edui-icon"></div><div class="edui-tooltip" unselectable="on" onmousedown="return false"><div class="edui-tooltip-arrow" unselectable="on" onmousedown="return false"></div><div class="edui-tooltip-inner" unselectable="on" onmousedown="return false"></div></div></div><div class="edui-separator" unselectable="on" onmousedown="return false"></div><div class="edui-btn edui-btn-emotion " unselectable="on" onmousedown="return false" data-original-title="表情"> <div unselectable="on" class="edui-icon-emotion edui-icon"></div><div class="edui-tooltip" unselectable="on" onmousedown="return false"><div class="edui-tooltip-arrow" unselectable="on" onmousedown="return false"></div><div class="edui-tooltip-inner" unselectable="on" onmousedown="return false"></div></div></div><div class="edui-btn edui-btn-image" unselectable="on" onmousedown="return false" data-original-title="图片"> <div unselectable="on" class="edui-icon-image edui-icon"></div><div class="edui-tooltip" unselectable="on" onmousedown="return false"><div class="edui-tooltip-arrow" unselectable="on" onmousedown="return false"></div><div class="edui-tooltip-inner" unselectable="on" onmousedown="return false"></div></div></div><div class="edui-btn edui-btn-video" unselectable="on" onmousedown="return false" data-original-title="视频"> <div unselectable="on" class="edui-icon-video edui-icon"></div><div class="edui-tooltip" unselectable="on" onmousedown="return false"><div class="edui-tooltip-arrow" unselectable="on" onmousedown="return false"></div><div class="edui-tooltip-inner" unselectable="on" onmousedown="return false"></div></div></div><div class="edui-separator" unselectable="on" onmousedown="return false"></div><div class="edui-btn edui-btn-map" unselectable="on" onmousedown="return false" data-original-title="百度地图"> <div unselectable="on" class="edui-icon-map edui-icon"></div><div class="edui-tooltip" unselectable="on" onmousedown="return false"><div class="edui-tooltip-arrow" unselectable="on" onmousedown="return false"></div><div class="edui-tooltip-inner" unselectable="on" onmousedown="return false"></div></div></div><div class="edui-separator" unselectable="on" onmousedown="return false"></div><div class="edui-btn edui-btn-horizontal" unselectable="on" onmousedown="return false" data-original-title="分隔线"> <div unselectable="on" class="edui-icon-horizontal edui-icon"></div><div class="edui-tooltip" unselectable="on" onmousedown="return false"><div class="edui-tooltip-arrow" unselectable="on" onmousedown="return false"></div><div class="edui-tooltip-inner" unselectable="on" onmousedown="return false"></div></div></div><div class="edui-btn edui-btn-print" unselectable="on" onmousedown="return false" data-original-title="打印"> <div unselectable="on" class="edui-icon-print edui-icon"></div><div class="edui-tooltip" unselectable="on" onmousedown="return false"><div class="edui-tooltip-arrow" unselectable="on" onmousedown="return false"></div><div class="edui-tooltip-inner" unselectable="on" onmousedown="return false"></div></div></div><div class="edui-btn edui-btn-preview" unselectable="on" onmousedown="return false" data-original-title="预览"> <div unselectable="on" class="edui-icon-preview edui-icon"></div><div class="edui-tooltip" unselectable="on" onmousedown="return false"><div class="edui-tooltip-arrow" unselectable="on" onmousedown="return false"></div><div class="edui-tooltip-inner" unselectable="on" onmousedown="return false"></div></div></div><div class="edui-btn edui-btn-drafts  edui-disabled" unselectable="on" onmousedown="return false" data-original-title="草稿箱"> <div unselectable="on" class="edui-icon-drafts edui-icon"></div><div class="edui-tooltip" unselectable="on" onmousedown="return false"><div class="edui-tooltip-arrow" unselectable="on" onmousedown="return false"></div><div class="edui-tooltip-inner" unselectable="on" onmousedown="return false"></div></div></div><div class="edui-btn edui-btn-formula " unselectable="on" onmousedown="return false" data-original-title="数学公式"> <div unselectable="on" class="edui-icon-formula edui-icon"></div></div></div><div class="edui-dialog-container"></div></div><div class="edui-editor-body" style="position: relative;"><div type="text/html" style="margin: auto; width: 615px; min-height: 300px; z-index: 999;" ng-model="item.content" meta-umeditor="" meta-umeditor-config="config" meta-umeditor-placeholder="" class="ng-untouched ng-valid edui-body-container ng-empty ng-dirty ng-valid-parse" id="metaUmeditor-331586253542009" contenteditable="true" aria-invalid="false"><p><br></p></div><div class="metaUmeditorPlaceholder" style="position: absolute; top: 0px; left: 0px; padding: 0px 10px; line-height: 24px; color: rgb(204, 204, 204);"></div><div class="metaUmeditorPlaceholder" style="position: absolute; top: 0px; left: 0px; padding: 0px 10px; line-height: 24px; color: rgb(204, 204, 204);"></div></div></div></div></div>`
            return  divContent
        }

            $scope.addContent = function () {
                $scope.textImgList1.push({themeTitle:'',themeContent:''})
            }
    
            $scope.addContent_2 = function () {
                $scope.textImgList2.push({themeTitle:'',themeContent:''})
            }
    
            $scope.addContent_3 = function () {
                $scope.textImgList3.push({themeTitle:'',themeContent:''})
            }
    
            $scope.delContent = function(){
                if( $scope.textImgList1.length == 1){
                    window.alert("至少保留一条内容")
                    return
                }else{
                    $scope.textImgList1.pop()
                }
            }
    
            $scope.delContent_2 = function(){
                if($scope.textImgList2.length == 1){
                    window.alert("至少保留一条内容")
                    return
                }else{
                    $scope.textImgList2.pop()
                }
            }
    
            $scope.delContent_3 = function(){
                if($scope.textImgList3.length == 1){
                    window.alert("至少保留一条内容")
                    return
                }else{
                    $scope.textImgList3.pop()
                }
    
            }
    



        $scope.save = function (form, item) {
            
            form.$setSubmitted(true);
                    if (!form.$valid) {
                        return;
                    }

            if ($scope.item_1.title) {
                if($scope.item_1.supportCheck==0){
                    if($scope.item_1.contentForm != 1){
                        let textListArr = []
                        let titleListArr =[]
                        for (let i = 0; i <  $scope.textImgList1.length; i++) {
                            let tempText1 =  $scope.textImgList1[i]
                            if(!tempText1.themeContent){
                                alert("请填写第一个板块的内容"+(i+1))
                                retrun
                            }
                            textListArr.push(tempText1.themeContent)
                            titleListArr.push(tempText1.themeTitle)
                        }
                        $scope.item_1.contentList = textListArr
                        $scope.item_1.themeList = titleListArr
                        $scope.item_1.companyName=''
                        $scope.item_1.navigationRange=''
                        $scope.item_1.navigationContent='0'
                        $scope.item_1.map=''

                    }else{
                        if($scope.item_1.navigationContent==0&&!$scope.item_1.navigationRange){
                            alert("选择企业无效！")
                            return
                        }
                    }
                    if($scope.item_1.navigationContent==1){
                        $scope.item_1.companyName=''
                    }
                }else{
                    $scope.item_1.contentForm='0'
                    $scope.item_1.companyName=''
                    $scope.item_1.navigationRange=''
                    $scope.item_1.navigationContent='0'
                }
                
                $scope.contentList.push($scope.item_1)

            }

            if ($scope.showModal_2){
                if($scope.item_2.orderNo==$scope.item_1.orderNo){
                    alert("请不要填写重复的序号！")
                    return
                }
                if($scope.item_2.supportCheck==0){
                    if($scope.item_2.contentForm != 1){
                        let textListArr_2 = []
                        let titleListArr_2 =[]
                        for (let i = 0; i <  $scope.textImgList2.length; i++) {
                            let tempText2 =  $scope.textImgList2[i]
                            if(!tempText2.themeContent){
                                alert("请填写第二个板块的内容"+(i+1))
                                retrun
                            }
                            textListArr_2.push(tempText2.themeContent)
                            titleListArr_2.push(tempText2.themeTitle)
                        }
                        $scope.item_2.themeList = titleListArr_2
                        $scope.item_2.contentList = textListArr_2
                        $scope.item_2.companyName=''
                        $scope.item_2.navigationRange=''
                        $scope.item_2.navigationContent='0'
                        $scope.item_2.map=''
                    }else{
                        if($scope.item_2.navigationContent==0&&!$scope.item_2.navigationRange){
                            alert("选择企业无效！")
                            return
                        }
                    }
                    if($scope.item_2.navigationContent==1){
                        $scope.item_2.companyName=''
                    }
                }else{
                    $scope.item_2.contentForm='0'
                    $scope.item_2.companyName=''
                    $scope.item_2.navigationRange=''
                    $scope.item_2.navigationContent='0'
                }
              
                $scope.contentList.push($scope.item_2)
            }

            if ($scope.showModal_3) {
                if($scope.item_3.orderNo==$scope.item_1.orderNo||$scope.item_3.orderNo==$scope.item_2.orderNo){
                    alert("请不要填写重复的序号！")
                    return
                }
                if($scope.item_3.supportCheck==0){
                    if($scope.item_3.contentForm != 1){
                        let textListArr_3 = []
                        let titleListArr_3 = []
                        for (let i = 0; i <  $scope.textImgList3.length; i++) {
                            let tempText3 =  $scope.textImgList3[i]
                            if(!tempText3.themeContent){
                                alert("请填写第三个板块的内容"+(i+1))
                                retrun
                            }
                            textListArr_3.push(tempText3.themeContent)
                            titleListArr_3.push(tempText3.themeTitle)
                        }
                        $scope.item_3.themeList =titleListArr_3
                        $scope.item_3.contentList = textListArr_3
                        $scope.item_3.companyName=''
                        $scope.item_3.navigationRange=''
                        $scope.item_3.navigationContent='0'
                        $scope.item_3.map=''
                    }else{
                        if($scope.item_3.navigationContent==0&&!$scope.item_3.navigationRange){
                            alert("选择企业无效！")
                            return
                        }
                    }
                    if($scope.item_3.navigationContent==1){
                        $scope.item_3.companyName=''
                    }
                }else{
                    $scope.item_3.contentForm='0'
                    $scope.item_3.companyName=''
                    $scope.item_3.navigationRange=''
                    $scope.item_3.navigationContent='0'
                }
                $scope.contentList.push($scope.item_3)
            }

            let params = {
                block: $scope.block,
                contentList: $scope.contentList
            }
            $.ajax({
                type: 'post',
                dataType: 'json',
                url: '/ovu-park/backstage/QueryMachineManage/block/update',
                data: JSON.stringify(params),
                contentType: "application/json",
                success: function (res) {
                    if (res.code == 0) {
                        $uibModalInstance.close();
                        window.msg("操作成功!");
                    } else {
                        window.alert(res.msg)
                    }

                },
                error: function (data) {
                    alert("操作异常");
                }
            });

        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    });
     // 查看详情
     app.controller('showModelCtrl', function ($scope, $rootScope, $http, $uibModalInstance, $filter, $uibModal, fac, item) {
        $scope.item = item
        $scope.mapList=[]
        $scope.setName = function (name) {
            let param={
                parkId:app.park.parkId
            }
            $http.get("/ovu-park/backstage/QueryMachineManage/content/queryMap", {
                params: param
            }).success(function (response) {
                if (response && response.code == 0) {
                    $scope.mapList = response.data;
                } 
                queryTagInfo()
            })
        }
        $scope.setName()
        function queryTagInfo(){
            $http.get('/ovu-park/backstage/QueryMachineManage/block/queryInfo?id=' + $scope.item.id).success(function (resp) {
                if(resp.code == 0){
                    $scope.pageModel = resp.data
                    $scope.block =$scope.pageModel.block
                    $scope.contentList = $scope.pageModel.contentList
                    $scope.contentList&&$scope.contentList.forEach(v=>{
                        if(v.contentForm != 1){
                            let tempTheme= JSON.parse(v.theme)
                            let tempContent= JSON.parse(v.content)
                            v.textImgList=[]
                            tempTheme&&tempTheme.forEach((element,i) => {
                            v.textImgList.push({themeTitle:element,themeContent:tempContent[i]})
                            });
                        }
                    })
                }else{
                    window.alert("操作失败")
                }
            })
        }
        // app.modulePromiss.then(function () {
        //     $scope.find();
        // });

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    })
})()