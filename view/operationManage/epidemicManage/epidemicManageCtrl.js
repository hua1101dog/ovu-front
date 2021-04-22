(function () {
    var app = angular.module("angularApp");
    /* 疫情报告 */
    app.controller('epidemicManage', function ($scope, $rootScope, $http, $filter, $uibModal, fac) {
        document.title = "OVU-疫情管理";
        angular.extend($rootScope, fac.dicts);

        $scope.search = {
            parkId:$scope.dept.parkId
        };
        $scope.pageModel = {

        };

        // 页面初始化
        app.modulePromiss.then(function () {
            $scope.$watch('dept.id', function (deptId, oldValue) {
                if (deptId) {
                    if ($scope.dept.parkId) {
                        $scope.search.parkId = $scope.dept.parkId
                        $scope.find()
                    } else {
                        $scope.search.parkId && delete $scope.search.parkId
                        // alert('请选择跟项目关联的部门')
                        $scope.find()
                        return
                    }

                }
            })
        })
        //本日异常报告
        $scope.showReception = function(){
            // $.get('/ovu-park/backstage/nCov/returnwork/parkStatistic',{parkId:$scope.dept.parkId},function(res){
            //     if(res.code ==0 ){
            //         console.log('疫情报告',res)
            //     }
            // }).then((res) => {
            var modal = $uibModal.open({
                animation: true,
                size: 'lg',
                templateUrl: '/view/operationManage/epidemicManage/model.receptionReport.html',
                controller: 'receptionReportCtrl',
                resolve: {
                    // item: res
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
            // })
        }

        $scope.showReportEdit = function(item,type){
            var modal = $uibModal.open({
                animation: true,
                size: 'md',
                templateUrl: '/view/operationManage/epidemicManage/model.reportEdit.html',
                controller: 'reportEditCtrl',
                resolve: {
                    item: {item:item,type:type}
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
        }

        $scope.showReportDetail = function(item,type){
            // item = item || {publishPersonName : app.user.nickname,parkId :  $scope.dept.parkId};
        	// news.updatorId = app.user.id;
            // var copy = angular.extend({},item);
            var modal = $uibModal.open({
                animation: true,
                size: 'md',
                templateUrl: '/view/operationManage/epidemicManage/model.reportEdit.html',
                controller: 'reportEditCtrl',
                resolve: {
                    item: {item:item,type:type}
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
        }

        // 查询列表
        $scope.find = function (pageNo) {

            if (!$scope.search.parkId) {
                alert("请选择项目关联的部门")
                $scope.pageModel = {};
                return
            }

            if ($scope.pageModel.currentPage) {
                delete $scope.pageModel.currentPage;
            }
            $.extend($scope.search, {
                currentPage: pageNo || $scope.pageModel.currentPage || 1,
                pageSize: $scope.pageModel.pageSize || 10
            });
            $scope.search.pageIndex = $scope.search.currentPage - 1;
            $scope.search.totalCount = $scope.pageModel.totalCount || 0;

            fac.getPageResult("/ovu-park/backstage/nCov/returnwork/page", $scope.search, function (data) {
                $scope.pageModel = data;
                // console.log('$scope.pageModel', $scope.pageModel)
                // if (data.data.length > 0) {
                //     $scope.houseMap = data.data[0].houseMap;
                // }
            })

        };

        $scope.init =function(){
            setTimeout(function(){
                $scope.find()
            },50)
        }
        $scope.init()

        $scope.query = function () {
            fac.initPage($scope, function () {
                $scope.find(1);
            })
        }

        /*本日异常报告 - 控制器 */
        // app.controller('receptionReportCtrl', function ($scope, $http, $uibModalInstance, $filter, fac, item) {
        //     // $scope.item = item;
        //     $scope.cancel = function () {
        //         $uibModalInstance.dismiss('cancel');
        //     };
        // });



    });

    /*本日异常报告 - 控制器 */
    app.controller('receptionReportCtrl', function ($scope, $http, $uibModalInstance, $filter, fac) {
        $.get('/ovu-park/backstage/nCov/returnwork/parkStatistic',{parkId:$scope.dept.parkId},function(res){
                if(res.code ==0 ){
                    $scope.item = res.data;
                    console.log('疫情报告',$scope.item)
                }
            })
        // $scope.item = item;
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    });

    
    /*编辑、查看疫情信息 - 控制器 */
    app.controller('reportEditCtrl', function ($scope, $http, $uibModalInstance, $filter, fac, item){
        console.log("item",item)
        $scope.item = item;
        $scope.item.isShowEdit = false
        $scope.item.buildNameEdit = ''
        $scope.pageModel ={}
        $.get('/ovu-park/backstage/nCov/returnwork/dayReg/'+$scope.item.item.id,function(res){
            if(res.code ==0 ){
                $scope.pageModel = res.data;
                // console.log('报告详情',$scope.pageModel)
            }

        })
        $scope.showEdit = function(){
            $scope.item.isShowEdit = !$scope.item.isShowEdit
        }
        
        // var params = {
        //     'userId':item.userId
        // }

        $.get('/ovu-park/backstage/nCov/returnwork/checkIsHB?userId='+ item.item.userId,function(res){
           if(res.code == 0){
               $scope.item.isHB = res.data
            //    console.log("666",$scope.isHB)
           }
        })


        //根据parkId获得分期列表
        $scope.loadStage = function () {
            $http.post("/ovu-base/system/park/stageList", {
                parkId: $scope.dept.parkId
            }, fac.postConfig).success(function (resp) {
                if (resp.code == 0) {
                    $scope.stageList = resp.data;
                    $scope.buildList = [];
                }
            });
        }

        $scope.getDaysBetween = function(start){
            if (!start) return "--";
            let startDate = Date.parse(new Date(start));
            let endDate = new Date().getTime()
            console.log('startDate',startDate)
            console.log('endDate',endDate)
            let days = (endDate - startDate) / (1 * 24 * 60 * 60 * 1000);
            return Math.floor(days);
            },

        $scope.loadStage();
        //根据stageId获得楼栋信息
        $scope.selectStage = function () {
            var params = {
                'stageId': $scope.item.stageId
            }
            $http.post("/ovu-base/system/parkBuild/getBuilds", params, fac.postConfig).success(function (data) {
                $scope.buildList = data;

                $scope.item.buildId = '';

            });
        }

        $scope.selectBuild = function(x){
            var s = $scope.buildList.filter(v => { return v.id == x})
            console.log("x",s[0])
            $scope.item.buildNameEdit = s[0]
        }

        $scope.showExit = function(){
            $scope.pageModel.buildName = $scope.item.buildNameEdit.buildName || $scope.pageModel.buildName
            $scope.item.isShowEdit = false
        }

        //保存
        $scope.save = function(){
            var params = {
                userId:$scope.pageModel.userId,
                buildId:$scope.item.buildNameEdit.stageId,
                buildName:$scope.pageModel.buildName
            }

                $.post("/ovu-park/backstage/nCov/returnwork/update/staffBuild",params,function(resp){
                    if(resp.code == 0){
                        window.msg("修改成功!");
                        $uibModalInstance.close();
                    }else{
                        window.alert(resp.msg);
                    }
                });
 
        }
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    });

     // 选择楼栋
     app.controller('selectBuildModalCtrl', function ($scope, $rootScope, $http, $uibModalInstance, $filter, fac, stageObj) {
        $rootScope.treeData = null;
        $rootScope.flatData = null;
        $scope.config = { edit: false, showCheckbox: true }
        $scope.rightObj = '';
        var parkId = $rootScope.project.parkId
        $scope.newChooseIds = [];//编辑资源，已选定，即将要关联的空间id
        $scope.treeData = []
        $scope.treeData.push(stageObj.stageTree)
        var dataObj = {
            "stageId": stageObj.stageTree.id
        }

        $http.post("/ovu-park/backstage/sale/saleparkhouse/getBuildIdByStageId", dataObj, fac.postConfig).success(function (treeData) {
            if (treeData.code == 0) {
                $scope.treeData[0].nodes = []
                treeData.data.forEach(function (n) {
                    $scope.treeData[0].nodes.push({ id: n.buildId, buildId: n.buildId, text: n.buildName, buildName: n.buildName, parkName: n.parkName, parkId: n.parkId, pid: n.stageId, stageId: n.stageId, stageName: n.stageName })
                })
                $scope.flatData = fac.treeToFlat($scope.treeData);
                $scope.rightList = [];
                stageObj.builds.forEach(function (build) {
                    var node = $scope.flatData.find(function (n) { return n.id == build.id });
                    if (node != undefined) {
                        node.state = node.state || {};
                        node.state.checked = true;
                        expandFather(node);
                        node.fullPath = node.stageName + ">" + node.buildName;
                        $scope.rightList.push(node);
                        $scope.newChooseIds.push(node.buildId);
                    }
                });
            }
        });

        function expandFather(node) {
            var father = $scope.flatData.find(function (n) { return n.id == node.pid });
            if (father) {
                father.state = father.state || {};
                father.state.expanded = true;
                expandFather(father);
            }
        }
        $scope.validChooseHids = [];//用于收集已勾选的房屋id
        $scope.reduceHis = [];//用于收集取消勾选的房屋id
        $scope.check = function (node) {
            node.state = node.state || {};
            node.state.checked = !node.state.checked;
            function checkSons(node, status) {
                node.state = node.state || {};
                node.state.checked = status;
                if (node.nodes && node.nodes.length) {
                    node.nodes.forEach(function (n) {
                        if (node.state.checked) {//当选中的时候
                            if ($scope.validChooseHids.indexOf(n.buildId) === -1) {//只有不包含当前房屋的id时，才加入
                                $scope.validChooseHids.push(n.buildId);
                            }
                        }
                        checkSons(n, status);
                    });
                } else {
                    if (node.state.checked) {//当选中的时候
                        if ($scope.validChooseHids.indexOf(node.buildId) === -1) {//只有不包含当前房屋的id时，才加入
                            $scope.validChooseHids.push(node.buildId);
                        }
                    } else {//当未选中的时候
                        $scope.validChooseHids.splice($scope.validChooseHids.indexOf(node.buildId), 1);
                        $scope.reduceHis.push(node.buildId);
                    }
                }
            }
            function uncheckFather(node) {
                var father = $scope.flatData.find(function (n) { return n.id == node.pid });
                if (father) {
                    father.state = father.state || {};
                    father.state.checked = false;
                    uncheckFather(father);
                }
            }
            if (node.state.checked) {
                checkSons(node, true);
            } else {
                checkSons(node, false);
                uncheckFather(node);
            }
            $scope.rightList = $scope.flatData.filter(function (n) { return n.state && n.state.checked == true && n.pid != null && n.buildName != null })
            //console.info(angular.toJson($scope.rightList));
           
            $scope.newChooseIds = [];
            for (var i = 0; i < $scope.rightList.length; i++) {
                var rightObj = $scope.rightList[i];
                var fullPath = rightObj.stageName + ">" + rightObj.buildName;
                $scope.rightList[i].fullPath = fullPath;
                $scope.newChooseIds.push(rightObj.buildId);
            }
            if ($scope.rightList.length == 0) {
                $scope.newChooseIds = [];
            }
        }
        $scope.save = function () {
            var builds = [];
            angular.copy($scope.rightList, builds);
            $uibModalInstance.close({ builds: builds, newChooseIds: $scope.newChooseIds });
            $scope.reduceHis = [];//清空
        }
        //copy======end
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        }
    });

    /* 疫情公开 */
    app.controller('epidemicPublicCtrl', function ($scope, $rootScope, $http, $filter, $uibModal, fac) {
        angular.extend($rootScope, fac.dicts);
        $scope.search = {
           
        };
        $scope.pageModel = {};


        // 页面初始化
        app.modulePromiss.then(function () {
            $scope.$watch('dept.id', function (deptId, oldValue) {
                if (deptId) {
                    if ($scope.dept.parkId) {
                        $scope.search.parkId = $scope.dept.parkId
                        $scope.find()
                    } else {
                        $scope.search.parkId && delete $scope.search.parkId
                        // alert('请选择跟项目关联的部门')
                        $scope.find()
                        return
                    }

                }
            })
        })

        //删除
        $scope.del = function(ids){
            $.post("/ovu-park/backstage/nCov/infopublish/delete",{ids: ids},function(resp){
                if(resp.code == 0){
                    window.msg("删除成功!");
                    $scope.find();
                }else{
                    window.alert(resp.message);
                }
            });
        };

        //批量操作
        $scope.batchOpt = function(pageModal, optType){
            var ids="";
            confirm("确定删除选择项?",function(){
                var datas = pageModal.data;
                for(var i=0; i<datas.length;i++){
                    if(datas[i].checked){//过滤掉已发送的通知
                        ids += datas[i].id;
                        if(i<datas.length-1){
                            ids += ",";
                        }
                    }
                }
                $scope.del(ids);
            });
        };

         //单个删除
         $scope.delItem= function(message){
            confirm("确定删除疫情公开表"+ "\n" + "[" + message.title + "]?",function(){
                $scope.del(message.id);
            });
        };
        
        //发布
        $scope.publish = function(item){
            confirm("确定发布?",function(){
                $.post("/ovu-park/backstage/nCov/infopublish/publish",{id: item.id,status:2},function(resp){
                    if(resp.code == 0){
                        window.msg("发布成功!");
                        $scope.find();
                    }else{
                        window.alert(resp.message);
                    }
                });
            });
        }

        // 查询列表
        $scope.find = function (pageNo){
            
            if (!$scope.search.parkId) {
                alert("请选择项目关联的部门")
                $scope.pageModel = {};
                return
            }

            if ($scope.pageModel.currentPage) {
                delete $scope.pageModel.currentPage;
            }

            $.extend($scope.search, {
                currentPage: pageNo || $scope.pageModel.currentPage || 1,
                pageSize: $scope.pageModel.pageSize || 10
            });
            $scope.search.pageIndex = $scope.search.currentPage - 1;
            $scope.search.totalCount = $scope.pageModel.totalCount || 0;
            fac.getPageResult("/ovu-park/backstage/nCov/infopublish/page", $scope.search, function (data) {
                $scope.pageModel = data;
                // console.log(data)
            });
        };

        $scope.init =function(){
            setTimeout(function(){
                $scope.find()
            },50)
        }
        $scope.init()

        // 新增、编辑
        $scope.showNews = function (item) {
            item = item || {publishPersonName : app.user.nickname,parkId :  $scope.dept.parkId};
        	// news.updatorId = app.user.id;
            var copy = angular.extend({},item);
            var modal = $uibModal.open({
                animation: true,
                size: 'lg',
                templateUrl: '/view/operationManage/epidemicManage/model.publicAdd.html',
                controller: 'publicAddCtrl',
                resolve: {
                    item: copy
                }
            });
            modal.result.then(function () {
                // if($scope.pageModel.data.length == 1 && $scope.pageModel.currentPage > 1){
                //     $scope.pageModel.currentPage = $scope.pageModel.currentPage -1;
                // }
                $scope.init();
            }, function () {
                console.info('Modal dismissed at: ' + new Date());
            });
        };

         // 预览
         $scope.pre = function (item) {
            var modal = $uibModal.open({
                animation: true,
                size: 'md',
                templateUrl: '/view/operationManage/epidemicManage/model.preview.html',
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
        $scope.query = function () {
            if (!fac.checkPark($scope)) {
                return
            } else {
                $scope.find(1);
            }
        }

    });

    /* 新增、编辑园区疫情公开表 - 控制器 */
    app.controller('publicAddCtrl', function ($scope, $http, $uibModalInstance, $filter, $uibModal, fac, item) {
        $scope.item = item;
        $scope.search = {};
        $scope.search.pics = $scope.item.logo ? $scope.item.logo.split(",") : [];
        $scope.saveNews = function (form, item) {
            console.log(item)
            form.$setSubmitted(true);
            if (!form.$valid) {
                return;
            }
            if (!item.content) {
                window.alert("请填写园区抗疫快报的内容!")
                return false;
            }
            item.logo = $scope.search.pics.join(",");
    		var loading = layer.load(2, {
                shade: [0.1,'#fff'] //0.1透明度的白色背景
              });
            if(item.id){
                $.post("/ovu-park/backstage/nCov/infopublish/edit",item,function(resp){
                    layer.close(loading);
                    if(resp.code == 0){
                         window.msg("修改成功!");
                         $uibModalInstance.close();
                    }else{
                        alert("操作 失败!");
                        $scope.cancel();
                    }
                });
            }
            if(!item.id){
                $.post("/ovu-park/backstage/nCov/infopublish/edit",item,function(resp){
                    layer.close(loading);
                	if(resp.code == 0){
                         window.msg("新增成功!");
                         $uibModalInstance.close();
                   }else{
                       alert("操作 失败!");
                       $scope.cancel();
                   }
                });
            }
        }


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
    /* 企业复工 */
    app.controller('companyWorkCtrl', function ($scope, $rootScope, $http, $filter, $uibModal, fac) {
        angular.extend($rootScope, fac.dicts);
        $scope.search = {
            approveStatus: '0'
        };
        $scope.pageModel = {};

        // 页面初始化
        app.modulePromiss.then(function () {
            $scope.$watch('dept.id', function (deptId, oldValue) {
                if (deptId) {
                    if ($scope.dept.parkId) {
                        $scope.search.parkId = $scope.dept.parkId
                        $scope.find()
                    } else {
                        $scope.search.parkId && delete $scope.search.parkId
                        // alert('请选择跟项目关联的部门')
                        $scope.find()
                        return
                    }

                }
            })
        })

        $scope.showReturnStaffList = function(item){
            var modal = $uibModal.open({
                animation: true,
                size: 'lg',
                templateUrl: '/view/operationManage/epidemicManage/model.returnStaffList.html',
                controller: 'returnStaffListCtrl',
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

        //审核
        $scope.showAudit = function(item,type){
            var modal = $uibModal.open({
                animation: true,
                size: 'lg',
                templateUrl: '/view/operationManage/epidemicManage/model.auditEdit.html',
                controller: 'auditEditCtrl',
                resolve: {
                    item: {
                        data:item,
                        type:type
                    }
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
        }

        // 查询列表
        $scope.find = function (pageNo) {
            
            if (!$scope.search.parkId) {
                alert("请选择项目关联的部门")
                $scope.pageModel = {};
                return
            }

            if ($scope.pageModel.currentPage) {
                delete $scope.pageModel.currentPage;
            }

            $.extend($scope.search, {
                currentPage: pageNo || $scope.pageModel.currentPage || 1,
                pageSize: $scope.pageModel.pageSize || 10
            });
            $scope.search.pageIndex = $scope.search.currentPage - 1;
            $scope.search.totalCount = $scope.pageModel.totalCount || 0;

            fac.getPageResult("/ovu-park/nCov/returnwork/companyReturnInfoPage", $scope.search, function (data) {
                $scope.pageModel = data;
            });
        };

        $scope.init =function(){
            setTimeout(function(){
                $scope.find()
            },50)
        }
        $scope.init()

        $scope.query = function () {
            fac.initPage($scope, function () {
                $scope.find(1);
            })
        }

    });

     /* 复工员工审核 - 控制器 */
     app.controller('auditEditCtrl', function ($scope, $http, $uibModalInstance, $uibModal, $filter, fac, item) {
        $scope.item = item
    
        $scope.publishPersonName = item.data.approver || app.user.nickname
        // $.get('/ovu-park/backstage/nCov/returnwork/listReturnStaff',{regId:item.id},function(res){
        //     if(res.code ==0 ){
        //         $scope.pageModel = res;
        //         console.log('复工人员列表',$scope.pageModel)
        //     }
        // })
        $scope.save = function (form, item,type) {
            form.$setSubmitted(true);
            if (!form.$valid) {
                return;
            }
            
            if(type == 1){
                let params = {
                    id:$scope.item.data.id,
                    approveStatus:'1',
                    approveBack:item.approveBack||""
                }
                $.get("/ovu-park/backstage/nCov/returnwork/returnApprove",params,function(resp){
                    if(resp.code == 0){
                         window.msg("审核成功!");
                         $uibModalInstance.close();
                    }else{
                        alert("操作 失败!");
                        $scope.cancel();
                    }
                });
            }
            if(type == 2){
                let params = {
                    id:$scope.item.data.id,
                    approveStatus:'2',
                    approveBack:item.approveBack||""
                }
                $.get("/ovu-park/backstage/nCov/returnwork/returnApprove",params,function(resp){
                	if(resp.code == 0){
                         window.msg("审核成功!");
                         $uibModalInstance.close();
                   }else{
                       alert("操作 失败!");
                       $scope.cancel();
                   }
                });
            }
        }
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
     
 
    });


    /* 复工员工清单 - 控制器 */
    app.controller('returnStaffListCtrl', function ($scope, $http, $uibModalInstance, $uibModal, $filter, fac, item) {
    	
        $scope.pageModel = {};
        var param = {
            "regId": item.id
        };

        //查询
        $scope.find = function (pageNo) {
            $.extend(param, {
                currentPage: pageNo || $scope.pageModel.currentPage || 1,
                pageSize: $scope.pageModel.pageSize || 10
            });
            param.pageIndex = param.currentPage - 1;
            param.totalCount = $scope.pageModel.totalCount || 0;
            fac.getPageResult("/ovu-park/backstage/nCov/returnwork/listReturnStaff", param, function (data) {
                $scope.pageModel = data;
            });
        };

        if (item.id) {
            $scope.find(1);
        }

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    	
 
    });

     /* 体温报表 */
     app.controller('bodyHeatCtrl', function ($scope, $rootScope, $http, $filter, $uibModal, fac) {
        angular.extend($rootScope, fac.dicts);
        $scope.search = {

        };
        $scope.pageModel = {};

     
        // 页面初始化
        app.modulePromiss.then(function () {
            $scope.$watch('dept.id', function (deptId, oldValue) {
                if (deptId) {
                    if ($scope.dept.parkId) {
                        $scope.search.parkId = $scope.dept.parkId
                        $scope.find()
                    } else {
                        $scope.search.parkId && delete $scope.search.parkId
                        // alert('请选择跟项目关联的部门')
                        $scope.find()
                        return
                    }

                }
            })
        })

        // 查询列表
        $scope.find = function (pageNo) {
            if (!$scope.search.parkId) {
                alert("请选择项目关联的部门")
                $scope.pageModel = {};
                return
            }

            if ($scope.pageModel.currentPage) {
                delete $scope.pageModel.currentPage;
            }

            $.extend($scope.search, {
                currentPage: pageNo || $scope.pageModel.currentPage || 1,
                pageSize: $scope.pageModel.pageSize || 10
            });
            $scope.search.pageIndex = $scope.search.currentPage - 1;
            $scope.search.totalCount = $scope.pageModel.totalCount || 0;

            fac.getPageResult("/ovu-park/backstage/nCov/temperaturereg/page", $scope.search, function (data) {
                $scope.pageModel = data;
            });
        };

        $scope.init =function(){
            setTimeout(function(){
                $scope.find()
            },50)
        }
        $scope.init()

        $scope.query = function () {
            fac.initPage($scope, function () {
                $scope.find(1);
            })
        }
        /**
         * 去除空格
         * */
        // $scope.trimStr = function (str) {
        //     return str.replace(/(^\s*)|(\s*$)/g, "");
        // }
    });

    /* 车辆登记报表 */
    app.controller('carRegisterCtrl', function ($scope, $rootScope, $http, $filter, $uibModal, fac) {
        angular.extend($rootScope, fac.dicts);
        $scope.search = {

        };
        $scope.pageModel = {};

     
        // 页面初始化
        app.modulePromiss.then(function () {
            $scope.$watch('dept.id', function (deptId, oldValue) {
                if (deptId) {
                    if ($scope.dept.parkId) {
                        $scope.search.parkId = $scope.dept.parkId
                        $scope.find()
                    } else {
                        $scope.search.parkId && delete $scope.search.parkId
                        // alert('请选择跟项目关联的部门')
                        $scope.find()
                        return
                    }

                }
            })
        })

        // 查询列表
        $scope.find = function (pageNo) {
            if (!$scope.search.parkId) {
                alert("请选择项目关联的部门")
                $scope.pageModel = {};
                return
            }

            if ($scope.pageModel.currentPage) {
                delete $scope.pageModel.currentPage;
            }

            $.extend($scope.search, {
                currentPage: pageNo || $scope.pageModel.currentPage || 1,
                pageSize: $scope.pageModel.pageSize || 10
            });
            $scope.search.pageIndex = $scope.search.currentPage - 1;
            $scope.search.totalCount = $scope.pageModel.totalCount || 0;

            fac.getPageResult("/ovu-park/backstage/nCov/carreg/page", $scope.search, function (data) {
                $scope.pageModel = data;
            });
        };

        $scope.init =function(){
            setTimeout(function(){
                $scope.find()
            },50)
        }
        $scope.init()

        $scope.query = function () {
            fac.initPage($scope, function () {
                $scope.find(1);
            })
        }
        //查看详情
        $scope.showDetail = function(item){
            var modal = $uibModal.open({
                animation: true,
                size: 'md',
                templateUrl: '/view/operationManage/epidemicManage/model.carDetail.html',
                controller: 'carDetailCtrl',
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
        }

        /**
         * 去除空格
         * */
        // $scope.trimStr = function (str) {
        //     return str.replace(/(^\s*)|(\s*$)/g, "");
        // }
    });

    /*查看详情 - 控制器*/
    app.controller('carDetailCtrl', function ($scope, $http, $uibModalInstance, $uibModal, $filter, fac, item) {
        $scope.item = item;
        $.post("/ovu-park/backstage/nCov/carreg/get",{id:item.id},function(resp){
            if(resp.code == 0){
                 $scope.item = resp.data
                 console.log('车辆详情',$scope.item)
            }else{
                alert(resp.msg);
                
            }
        });
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    })
    app.filter("inOutStatus",function(){//转换企业数值和文字
        return function(value) {
            if(value == "1"){
                return "入";
            } else if(value == "2"){
                return "出";
            } else if(value == "3"){
                return "运营方登记";
            } else{
                return "";
            }
        }
    })
})()
