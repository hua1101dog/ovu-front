(function () {
    var app = angular.module("angularApp");
    //正常跟进客户
    app.controller('normallyCtrl', function ($scope, $rootScope, $http, $filter, $uibModal, fac) {
        document.title = "OVU-客户管理";
        angular.extend($rootScope, fac.dicts);
        $scope.pageModel = {};
        $scope.search = {}
        $scope.customerList = []
        console.log(fac.dicts,$rootScope)
        app.modulePromiss.then(function () {
            fac.initPage($scope, function () {
                $scope.pageModel=[]
                $scope.find();
            })
        });
        fac.getPageResult("/ovu-base/system/dictionary/get", $scope.search, function (data) {
            $scope.intentionLevelList = data.PURPOSE_LEVEL;
            $scope.followWayList = data.FOLLOW_TYPE
            $scope.customerStatusList = data.CUSTOMER_STATUS
        });
        // 查询列表
        $scope.find = function (pageNo) {
            if($rootScope.dept.parkId==undefined){
                alert('请选择跟项目关联的部门！')
                return false
            }else{
                $scope.search.parkId=$rootScope.dept.parkId
            }
            $.extend($scope.search, {
                currentPage: pageNo || $scope.pageModel.currentPage || 1,
                pageSize: $scope.pageModel.pageSize || 10
            });
            $scope.search.pageIndex = $scope.search.currentPage - 1;
            $scope.search.totalCount = $scope.pageModel.totalCount || 0;
            $scope.search.lateFollow = 0
            $scope.search.assignationStatus = 2
            fac.getPageResult("/ovu-crm/backstage/crmCustomer/manage/queryByPage", $scope.search, function (data) {
                $scope.pageModel = data;
            });
        }
        $scope.find();

        // 分配
        $scope.distribution = function (news) {
            var copy = angular.extend({}, news);
            var modal = $uibModal.open({
                animation: false,
                size: 'lg',
                templateUrl: '/view/crm/customerManagement/modal.distribution.html',
                controller: 'distribution',
                resolve: {
                    news: copy
                }
            });
            modal.result.then(function () {
                if ($scope.pageModel.data.length == 1 && $scope.pageModel.currentPage > 1) {
                    $scope.pageModel.currentPage = $scope.pageModel.currentPage - 1;
                }
                $scope.find(1);
            }, function () {
                console.info('Modal dismissed at: ' + new Date());
            });
        }

        //批量回收
        $scope.allRecycle = function (pageModel) {
            pageModel.data.forEach(ele => {
                if (ele.checked == true) {
                    $scope.customerList.push(ele)
                }
            });
            item = {
                type: 2,
                customerList: $scope.customerList
            }
            $http.post("/ovu-crm/backstage/crmCustomer/manage/batchOperate", item).success(function (resp) {
                if (resp.code == 0) {
                    window.msg("回收成功!");
                    $scope.find();
                } else {
                    alert(resp.msg);
                }
            });
        }
        //回收
        $scope.recycle = function (news) {
            var copy = angular.extend({}, news);
            var modal = $uibModal.open({
                animation: false,
                size: 'lg',
                templateUrl: '/view/crm/customerManagement/modal.recycle.html',
                controller: 'recycle',
                resolve: {
                    news: copy
                }
            });
            modal.result.then(function () {
                if ($scope.pageModel.data.length == 1 && $scope.pageModel.currentPage > 1) {
                    $scope.pageModel.currentPage = $scope.pageModel.currentPage - 1;
                }
                $scope.find(1);
            }, function () {
                console.info('Modal dismissed at: ' + new Date());
            });
        }

        // 查看
        $scope.view = function (news) {
            var copy = angular.extend({}, news);
            var modal = $uibModal.open({
                animation: false,
                size: 'lg',
                templateUrl: '/view/crm/customerManagement/modal.view.html',
                controller: 'viewModal',
                resolve: {
                    news: copy
                }
            });
            modal.result.then(function () {
                if ($scope.pageModel.data.length == 1 && $scope.pageModel.currentPage > 1) {
                    $scope.pageModel.currentPage = $scope.pageModel.currentPage - 1;
                }
                $scope.find(1);
            }, function () {
                console.info('Modal dismissed at: ' + new Date());
            });
        }

        //编辑
        $scope.edit = function (news) {
            var copy = angular.extend({}, news);
            var modal = $uibModal.open({
                animation: false,
                size: 'lg',
                templateUrl: '/view/crm/customerManagement/modal.editOverdue.html',
                controller: 'editOverdue',
                resolve: {
                    news: copy
                }
            });
            modal.result.then(function () {
                if ($scope.pageModel.data.length == 1 && $scope.pageModel.currentPage > 1) {
                    $scope.pageModel.currentPage = $scope.pageModel.currentPage - 1;
                }
                $scope.find(1);
            }, function () {
                console.info('Modal dismissed at: ' + new Date());
            });
        }

        function getParams(obj) {
            var str = []
            console.log(obj)
            for (var k in obj) {
                if (obj[k] ||obj[k]==0)
                    str.push(k + '=' + obj[k])
            }
            return '?' + str.join('&')
        }
        //导出客户
        $scope.showReception = function () {
            console.log(1111)
            console.log($scope.search)
           if(  $scope.search.type||
                $scope.search.name||
                $scope.search.phone||
                $scope.search.customerStatus||
                $scope.search.intentionLevel||
                $scope.search.followStartTime||
                $scope.search.followEndTime||
                $scope.search.operator){
                var params={
                    type:$scope.search.type,
                    name:$scope.search.name,
                    phone:$scope.search.phone,
                    customerStatus:$scope.search.customerStatus,
                    intentionLevel:$scope.search.intentionLevel,
                    followStartTime:$scope.search.followStartTime,
                    followEndTime:$scope.search.followEndTime,
                    operator:$scope.search.operator,
                    lateFollow:0,
                    assignationStatus: 2
                }
                console.log(params)
                var str = getParams(params)
                console.log(str)
                location.href='/ovu-crm/backstage/crmCustomer/manage/exportCustomer'+ str
            }else{
                location.href='/ovu-crm/backstage/crmCustomer/manage/exportCustomer?lateFollow=0&assignationStatus=2'
                console.log(params)
            }
            

        };
    
        //导入明源客户和跟进记录
        $scope.importCustomer = function (t) {
            if (!$scope.dept.parkId) {
                alert("请选择项目关联的部门")
                $scope.pageModel = {};
                return
            }
            fac.upload({
                url: "/ovu-crm/backstage/crmCustomer/import/uploadExcel",
                params: {
                    parkId: $scope.dept.parkId,
                    type: t
                },
                accept: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
            }, function (resp) {
                layer.open({
                    title: resp.data
                    ,area: ['640px','400px']
                    ,shadeClose: true         //点击遮罩关闭
                    ,content: resp.msg
                });
            })
        }
        
    });
    //逾期未跟进
    app.controller('overdueCtrl', function ($scope, $rootScope, $http, $filter, $uibModal, fac) {
        document.title = "OVU-客户管理";
        angular.extend($rootScope, fac.dicts);
        $scope.pageModel = {};
        $scope.search = {}
        $scope.customerList = []
        app.modulePromiss.then(function () {
            fac.initPage($scope, function () {
                $scope.pageModel=[]
                $scope.find();
            })
        });
        fac.getPageResult("/ovu-base/system/dictionary/get", $scope.search, function (data) {
            $scope.intentionLevelList = data.PURPOSE_LEVEL;
            $scope.followWayList = data.FOLLOW_TYPE
            $scope.customerStatusList = data.CUSTOMER_STATUS
        });
        // 查询列表
        $scope.find = function (pageNo) {
            if($rootScope.dept.parkId==undefined){
                alert('请选择跟项目关联的部门！')
                return false
            }else{
                $scope.search.parkId=$rootScope.dept.parkId
            }
            $.extend($scope.search, {
                currentPage: pageNo || $scope.pageModel.currentPage || 1,
                pageSize: $scope.pageModel.pageSize || 10
            });
            $scope.search.pageIndex = $scope.search.currentPage - 1;
            $scope.search.totalCount = $scope.pageModel.totalCount || 0;
            $scope.search.lateFollow = 1
            $scope.search.assignationStatus = 2
           
            fac.getPageResult("/ovu-crm/backstage/crmCustomer/manage/queryByPage", $scope.search, function (data) {
                $scope.pageModel = data;
            });
            $scope.search.type1=$scope.search.type
            $scope.search.name1=$scope.search.name
            $scope.search.phone1=$scope.search.phone
            $scope.search.customerStatus1=$scope.search.customerStatus
            $scope.search.intentionLevel1=$scope.search.intentionLevel
            $scope.search.followStartTime1=$scope.search.followStartTime
            $scope.search.followEndTime1=$scope.search.followEndTime
            $scope.search.operator1=$scope.search.operator
            console.log( $scope.search)
        }
        $scope.find();

        // 分配
        $scope.distribution = function (news) {
            var copy = angular.extend({}, news);
            var modal = $uibModal.open({
                animation: false,
                size: 'lg',
                templateUrl: '/view/crm/customerManagement/modal.distribution.html',
                controller: 'distribution',
                resolve: {
                    news: copy
                }
            });
            modal.result.then(function () {
                if ($scope.pageModel.data.length == 1 && $scope.pageModel.currentPage > 1) {
                    $scope.pageModel.currentPage = $scope.pageModel.currentPage - 1;
                }
                $scope.find(1);
            }, function () {
                console.info('Modal dismissed at: ' + new Date());
            });
        }

        //批量回收
        $scope.allRecycle = function (pageModel) {
            pageModel.data.forEach(ele => {
                if (ele.checked == true) {
                    $scope.customerList.push(ele)
                }
            });
            item = {
                type: 2,
                customerList: $scope.customerList
            }
            $http.post("/ovu-crm/backstage/crmCustomer/manage/batchOperate", item).success(function (resp) {
                if (resp.code == 0) {
                    window.msg("回收成功!");
                    $scope.find();
                } else {
                    alert(resp.msg);
                }
            });
        }
        //回收
        $scope.recycle = function (news) {
            var copy = angular.extend({}, news);
            var modal = $uibModal.open({
                animation: false,
                size: 'lg',
                templateUrl: '/view/crm/customerManagement/modal.recycle.html',
                controller: 'recycle',
                resolve: {
                    news: copy
                }
            });
            modal.result.then(function () {
                if ($scope.pageModel.data.length == 1 && $scope.pageModel.currentPage > 1) {
                    $scope.pageModel.currentPage = $scope.pageModel.currentPage - 1;
                }
                $scope.find(1);
            }, function () {
                console.info('Modal dismissed at: ' + new Date());
            });
        }

        // 查看
        $scope.view = function (news) {
            var copy = angular.extend({}, news);
            var modal = $uibModal.open({
                animation: false,
                size: 'lg',
                templateUrl: '/view/crm/customerManagement/modal.view.html',
                controller: 'viewModal',
                resolve: {
                    news: copy
                }
            });
            modal.result.then(function () {
                if ($scope.pageModel.data.length == 1 && $scope.pageModel.currentPage > 1) {
                    $scope.pageModel.currentPage = $scope.pageModel.currentPage - 1;
                }
                $scope.find(1);
            }, function () {
                console.info('Modal dismissed at: ' + new Date());
            });
        }

        //编辑
        $scope.edit = function (news) {
            var copy = angular.extend({}, news);
            var modal = $uibModal.open({
                animation: false,
                size: 'lg',
                templateUrl: '/view/crm/customerManagement/modal.editOverdue.html',
                controller: 'editOverdue',
                resolve: {
                    news: copy
                }
            });
            modal.result.then(function () {
                if ($scope.pageModel.data.length == 1 && $scope.pageModel.currentPage > 1) {
                    $scope.pageModel.currentPage = $scope.pageModel.currentPage - 1;
                }
                $scope.find(1);
            }, function () {
                console.info('Modal dismissed at: ' + new Date());
            });
        }

        function getParams(obj) {
            var str = []
            for (var k in obj) {
                if (obj[k])
                    str.push(k + '=' + obj[k])
            }
            return '?' + str.join('&')
        }
        //导出客户
        $scope.showReception = function () {
            console.log(1111)
           if(  $scope.search.type||
                $scope.search.name||
                $scope.search.phone||
                $scope.search.customerStatus||
                $scope.search.intentionLevel||
                $scope.search.followStartTime||
                $scope.search.followEndTime||
                $scope.search.operator){
                var params={
                    lateFollow:1,
                    type:$scope.search.type,
                    name:$scope.search.name,
                    phone:$scope.search.phone,
                    customerStatus:$scope.search.customerStatus,
                    intentionLevel:$scope.search.intentionLevel,
                    followStartTime:$scope.search.followStartTime,
                    followEndTime:$scope.search.followEndTime,
                    operator:$scope.search.operator,
                    assignationStatus: 2
                }
                var str = getParams(params)
                console.log('/ovu-crm/backstage/crmCustomer/manage/exportCustomer'+ str)
                location.href='/ovu-crm/backstage/crmCustomer/manage/exportCustomer'+ str
            }else{
                location.href='/ovu-crm/backstage/crmCustomer/manage/exportCustomer?lateFollow=1&assignationStatus=2'
            }
            

        };
    });
    // 查询
    app.controller('viewModal', function ($scope, $http, $uibModalInstance, $filter, fac, news) {
        $scope.item = news;
        $scope.item.show = true
        $scope.pageModel1 = {};
        $scope.pageModel2 = {};
        $scope.pageModel3 = {};
        $scope.pageModel4 = {};
        $scope.search = {}
        $scope.search1 = {}
        $scope.search2 = {}
        $scope.search3 = {}
        $scope.search4 = {}
        $scope.search5 = {}
        fac.getPageResult("/ovu-base/system/dictionary/get", $scope.search, function (data) {
            $scope.intentionLevelList = data.PURPOSE_LEVEL;
            $scope.followList = data.FOLLOW_TYPE
            console.log(data.PURPOSE_LEVEL, data.FOLLOW_TYPE)
        });
        $http.post("/ovu-crm/backstage/crmCustomer/manage/queryByPrimaryKey" + "/" + $scope.item.id).success(function (resp) {
            console.log(resp)
            $scope.search = resp.data
        })
        $scope.show = function (item) {
            if (item == 1) {
                $scope.item.show = false
            } else {
                $scope.item.show = true
            }
        }

        //跟进记录
        $scope.find1 = function (pageNo) {
            $.extend($scope.search1, {
                currentPage: pageNo || $scope.pageModel1.currentPage || 1,
                pageSize: $scope.pageModel1.pageSize || 10
            });
            $scope.search1.pageIndex = $scope.search1.currentPage - 1;
            $scope.search1.totalCount = $scope.pageModel1.totalCount || 0;
            $scope.search1.customerId = $scope.item.id
            console.log( $scope.search1)
            fac.getPageResult("/ovu-crm/backstage/crmCustomerFollowLog/getCustomerFollowLogByPage", $scope.search1, function (data) {
                $scope.pageModel1 = data;
                console.log(data)
            });
        }
        $scope.find1()

        //变更记录
        $scope.find2 = function (pageNo) {
            $.extend($scope.search2, {
                currentPage: pageNo || $scope.pageModel2.currentPage || 1,
                pageSize: $scope.pageModel2.pageSize || 10
            });
            $scope.search2.pageIndex = $scope.search2.currentPage - 1;
            $scope.search2.totalCount = $scope.pageModel2.totalCount || 0;
            $scope.search2.customerId = $scope.item.id
            fac.getPageResult("/ovu-crm/backstage/crmCustomer/changeLog/queryChangeLogByPage", $scope.search2, function (data) {
                $scope.pageModel2 = data;
                console.log($scope.pageModel2)
            });
        }
        $scope.find2()

        //分配日志
        $scope.find3 = function (pageNo) {
            $.extend($scope.search3, {
                currentPage: pageNo || $scope.pageModel3.currentPage || 1,
                pageSize: $scope.pageModel3.pageSize || 10
            });
            $scope.search3.pageIndex = $scope.search3.currentPage - 1;
            $scope.search3.totalCount = $scope.pageModel3.totalCount || 0;
            $scope.search3.customerId = $scope.item.id
            $scope.search3.actionType=2
            fac.getPageResult("/ovu-crm/backstage/crmCustomer/changeLog/queryChangeLogByPage", $scope.search3, function (data) {
                $scope.pageModel3 = data;
                console.log($scope.pageModel3)
            });
        }
        $scope.find3()

        //回收日志
        $scope.find4 = function (pageNo) {
            $.extend($scope.search4, {
                currentPage: pageNo || $scope.pageModel4.currentPage || 1,
                pageSize: $scope.pageModel4.pageSize || 10
            });
            $scope.search4.pageIndex = $scope.search4.currentPage - 1;
            $scope.search4.totalCount = $scope.pageModel4.totalCount || 0;
            $scope.search4.customerId = $scope.item.id
            $scope.search4.actionType=3
            fac.getPageResult("/ovu-crm/backstage/crmCustomer/changeLog/queryChangeLogByPage", $scope.search4, function (data) {
                $scope.pageModel4 = data;
                console.log($scope.pageModel4)
            });
        }
        $scope.find4()

        //购房意向
        $scope.find5 = function () {
           $http.post("/ovu-crm/backstage/contract/queryCustomerInvestment",{customerId:$scope.item.id},fac.postConfig).success(function (resp) {
            if (resp.code == 0) {
                $scope.search5=resp.data
                console.log(resp)

            } else {
                alert(resp.msg);
            }
        })
    };
        $scope.find5()
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };

    });

    //分配
    app.controller('distribution', function ($scope, $http, $uibModalInstance, $filter, fac, news) {
        $scope.pageModel = {};
        $scope.search = {}
        $scope.agentList = []
        $scope.customerList=[]
        $scope.item = news;
        console.log($scope.item)
        if(!$scope.item.data){
            $scope.customerList = [$scope.item]
        }else{
            $scope.item.data.forEach(ele=>{
                if(ele.checked==true){
                    $scope.customerList.push(ele)
                }
            })
        }
        // 查询列表
        $scope.find = function (pageNo) {
            $.extend($scope.search, {
                currentPage: pageNo || $scope.pageModel.currentPage || 1,
                pageSize: $scope.pageModel.pageSize || 10
            });
            $scope.search.pageIndex = $scope.search.currentPage - 1;
            $scope.search.totalCount = $scope.pageModel.totalCount || 0;
            // $scope.search.parkId=$scope.item.parkId
            fac.getPageResult("/ovu-crm/backstage/investment/agentInfo/agentList", $scope.search, function (data) {
                $scope.pageModel = data;
                console.log($scope.pageModel)
            });
        }
        $scope.find();

        //确定分配
        $scope.saveNews = function (pageModal) {
            console.log(pageModal)
            pageModal.data.forEach(ele => {
                if(ele.checked==true){
                    $scope.agentList.push(ele)
                }
            });
            if($scope.customerList.length<$scope.agentList.length){
                alert('分配的置业顾问数量不能大于客户数量！！！')
                return false
            }
            var item={
                type : 1,
                customerList:$scope.customerList,
                agentList:$scope.agentList
            }
            console.log(item)
            $http.post("/ovu-crm/backstage/crmCustomer/manage/batchOperate", item).success(function (resp) {
                if (resp.code == 0) {
                    $uibModalInstance.close();
                    window.msg("分配成功!");

                } else {
                    alert(resp.msg);
                }
            });
        }
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    });
    //回收
    app.controller('recycle', function ($scope, $http, $uibModalInstance, $filter, fac, news) {
        $scope.item = news
        $scope.customerList=[]
        console.log($scope.item)
        //确定回收
        $scope.saveNews = function (item) {
            console.log(item)
           if(!$scope.item.data){
            console.log($scope.search)
            item.type = 2
            item.id = $scope.item.id
            item.recoveryReason = $scope.search.recoveryReason
            item = {
                type: 2,
                customerList: [{
                    id: $scope.item.id,
                    recoveryReason: $scope.search.recoveryReason
                }]
            }
           }else{
            $scope.item.data.forEach(ele => {
                        if (ele.checked == true) {
                            $scope.customerList.push(ele)
                        }
                    });
                    item = {
                        type: 2,
                        customerList: $scope.customerList
                    }
           }

            $http.post("/ovu-crm/backstage/crmCustomer/manage/batchOperate", item).success(function (resp) {
                if (resp.code == 0) {
                    $uibModalInstance.close();
                    window.msg("修改成功!");

                } else {
                    alert(resp.msg);
                }
            });
        }
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    });
    //编辑
    app.controller('editOverdue', function ($scope, $http, $uibModalInstance, $filter, fac, news) {
        $scope.item = news;
        console.log($scope.item)
        $scope.item.type = $scope.item.type.toString()
        //行业
        // $http.post("/ovu-crm/backstage/crmCustomer/manage/queryIndustry").success(function (resp) {
        //     if (resp.code == 0) {
        //         console.log(resp)

        //     } else {
        //         alert(resp.msg);
        //     }
        // });

        //确定编辑
        $scope.saveNews = function (item) {
            console.log(item)
            $http.post("/ovu-crm/backstage/crmCustomer/manage/update", item).success(function (resp) {
                if (resp.code == 0) {
                    $uibModalInstance.close();
                    window.msg("编辑成功!");

                } else {
                    alert(resp.msg);
                }
            });
        }
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    });
    //公共客户
    app.controller('publicCtrl', function ($scope, $rootScope, $http, $filter, $uibModal, fac) {
        document.title = "OVU-客户管理";
        angular.extend($rootScope, fac.dicts);
        $scope.pageModel = {};
        $scope.search = {}
        $scope.customerList = []
        app.modulePromiss.then(function () {
            fac.initPage($scope, function () {
                $scope.pageModel=[]
                $scope.find();
            })
        });
        fac.getPageResult("/ovu-base/system/dictionary/get", $scope.search, function (data) {
            $scope.intentionLevelList = data.PURPOSE_LEVEL;
            $scope.followWayList = data.FOLLOW_TYPE
        });
        // 查询列表
        $scope.find = function (pageNo) {
            if($rootScope.dept.parkId==undefined){
                alert('请选择跟项目关联的部门！')
                return false
            }else{
                $scope.search.parkId=$rootScope.dept.parkId
            }
            $.extend($scope.search, {
                currentPage: pageNo || $scope.pageModel.currentPage || 1,
                pageSize: $scope.pageModel.pageSize || 10
            });
            $scope.search.pageIndex = $scope.search.currentPage - 1;
            $scope.search.totalCount = $scope.pageModel.totalCount || 0;
            $scope.search.assignationStatus = 1
            
            fac.getPageResult("/ovu-crm/backstage/crmCustomer/manage/queryByPage", $scope.search, function (data) {
                $scope.pageModel = data;
                console.log($scope.pageModel)
            });
        }
        $scope.find();

        // 分配
        $scope.distribution = function (news) {
            var copy = angular.extend({}, news);
            var modal = $uibModal.open({
                animation: false,
                size: 'lg',
                templateUrl: '/view/crm/customerManagement/modal.distribution.html',
                controller: 'distribution',
                resolve: {
                    news: copy
                }
            });
            modal.result.then(function () {
                if ($scope.pageModel.data.length == 1 && $scope.pageModel.currentPage > 1) {
                    $scope.pageModel.currentPage = $scope.pageModel.currentPage - 1;
                }
                $scope.find(1);
            }, function () {
                console.info('Modal dismissed at: ' + new Date());
            });
        }

        // 查看
        $scope.view = function (news) {
            var copy = angular.extend({}, news);
            var modal = $uibModal.open({
                animation: false,
                size: 'lg',
                templateUrl: '/view/crm/customerManagement/modal.view.html',
                controller: 'viewModal',
                resolve: {
                    news: copy
                }
            });
            modal.result.then(function () {
                if ($scope.pageModel.data.length == 1 && $scope.pageModel.currentPage > 1) {
                    $scope.pageModel.currentPage = $scope.pageModel.currentPage - 1;
                }
                $scope.find(1);
            }, function () {
                console.info('Modal dismissed at: ' + new Date());
            });
        }

        //编辑
        $scope.edit = function (news) {
            var copy = angular.extend({}, news);
            var modal = $uibModal.open({
                animation: false,
                size: 'lg',
                templateUrl: '/view/crm/customerManagement/modal.editOverdue.html',
                controller: 'editOverdue',
                resolve: {
                    news: copy
                }
            });
            modal.result.then(function () {
                if ($scope.pageModel.data.length == 1 && $scope.pageModel.currentPage > 1) {
                    $scope.pageModel.currentPage = $scope.pageModel.currentPage - 1;
                }
                $scope.find(1);
            }, function () {
                console.info('Modal dismissed at: ' + new Date());
            });
        }

        //导出客户
        $scope.showReception = function () {
            console.log(1111)
           if(  $scope.search.type1||
                $scope.search.name1||
                $scope.search.phone1||
                $scope.search.customerStatus1||
                $scope.search.intentionLevel1||
                $scope.search.followStartTime1||
                $scope.search.followEndTime1||
                $scope.search.operator1){
                var params={
                    type:$scope.search.type1,
                    name:$scope.search.name1,
                    phone:$scope.search.phone1,
                    customerStatus:$scope.search.customerStatus1,
                    intentionLevel:$scope.search.intentionLevel1,
                    followStartTime:$scope.search.followStartTime1,
                    followEndTime:$scope.search.followEndTime1,
                    operator:$scope.search.operator1,
                    assignationStatus: 1
                }
                var str = getParams(params)
                console.log('/ovu-crm/backstage/crmCustomer/manage/exportCustomer'+ str,params)
                location.href='/ovu-crm/backstage/crmCustomer/manage/exportCustomer'+ str
            }else{
                location.href='/ovu-crm/backstage/crmCustomer/manage/exportCustomer?assignationStatus=1'
            }
        };

        // 移至垃圾箱
        $scope.move= function(news){
            console.log(news)
            item={
                type:3,
                customerList:[{
                    id:news.id,
                    assignationStatus:4
                }]
            }
            console.log(item)
            layer.confirm("确定要将选择的客户移至垃圾箱么？",function(){
                $http.post("/ovu-crm/backstage/crmCustomer/manage/batchOperate",item).success(function(resp){
                    if(resp.code == 0){
                        window.msg("移动成功!");
                        $scope.find();
                    }else{
                    	alert(resp.message);
                    }
                });
            })
        };

        // 批量移至垃圾箱
        $scope.moveAll= function(pageModel){
            pageModel.data.forEach(ele => {
                if (ele.checked == true) {
                    ele.assignationStatus=4
                    $scope.customerList.push(ele)
                }
            });
            item = {
                type: 3,
                customerList: $scope.customerList
            }
            layer.confirm("确定要将选择的客户移至垃圾箱么？",function(){
                $http.post("/ovu-crm/backstage/crmCustomer/manage/batchOperate",item).success(function(resp){
                    if(resp.code == 0){
                        window.msg("移动成功!");
                        $scope.find();
                    }else{
                    	alert(resp.message);
                    }
                });
            })
        };
    });
    //重复客户
    app.controller('repeatCtrl', function ($scope, $rootScope, $http, $filter, $uibModal, fac) {
        app.modulePromiss.then(function () {
            fac.initPage($scope, function () {
                $scope.find();
            })
        });
        document.title = "OVU-重复客户";
        angular.extend($rootScope, fac.dicts);
        $scope.pageModel = {};
        $scope.search = {}
        $scope.customerList = []
        fac.getPageResult("/ovu-base/system/dictionary/get", $scope.search, function (data) {
            $scope.intentionLevelList = data.PURPOSE_LEVEL;
            $scope.followWayList = data.FOLLOW_TYPE;
        });
        // 查询列表
        $scope.find = function (pageNo) {
            if($rootScope.dept.parkId==undefined){
                alert('请选择跟项目关联的部门！')
                return false
            }else{
                $scope.search.parkId=$rootScope.dept.parkId
            }
            $.extend($scope.search, {
                currentPage: pageNo || $scope.pageModel.currentPage || 1,
                pageSize: $scope.pageModel.pageSize || 10
            });
            $scope.search.pageIndex = $scope.search.currentPage - 1;
            $scope.search.totalCount = $scope.pageModel.totalCount || 0;
            
            fac.getPageResult("/ovu-crm/backstage/crmCustomer/manage/repeatCustomerByPage", $scope.search, function (data) {
                $scope.pageModel = data;
                console.log($scope.pageModel)
            });
        }
        $scope.find();

        // 查看
        $scope.view = function (news) {
            var copy = angular.extend({}, news);
            var modal = $uibModal.open({
                animation: false,
                size: 'lg',
                templateUrl: '/view/crm/customerManagement/modal.view.html',
                controller: 'viewModal',
                resolve: {
                    news: copy
                }
            });
            modal.result.then(function () {
                if ($scope.pageModel.data.length == 1 && $scope.pageModel.currentPage > 1) {
                    $scope.pageModel.currentPage = $scope.pageModel.currentPage - 1;
                }
                $scope.find(1)
            }, function () {
                console.info('Modal dismissed at: ' + new Date());
            });
        }

        //编辑
        $scope.edit = function (news) {
            console.log('...........')
            var copy = angular.extend({}, news);
            var modal = $uibModal.open({
                animation: false,
                size: 'lg',
                templateUrl: '/view/crm/customerManagement/modal.editOverdue.html',
                controller: 'editOverdue',
                resolve: {
                    news: copy
                }
            });
            modal.result.then(function () {
                if ($scope.pageModel.data.length == 1 && $scope.pageModel.currentPage > 1) {
                    $scope.pageModel.currentPage = $scope.pageModel.currentPage - 1;
                }
                $scope.find(1);
            }, function () {
                console.info('Modal dismissed at: ' + new Date());
            });
        }

        //处理重复
        $scope.delRepeat=function(item){
            console.log('oooo处理重复')
            var modal = $uibModal.open({
                animation: false,
                size: 'lg',
                templateUrl: '/view/crm/customerManagement/modal.delRepeat.html',
                controller: 'delRepeatModal',
                resolve: {
                    data: {
                        item: item
                    }
                }

            })
            // debugger
            modal.result.then(function () {
                // debugger
                if ($scope.pageModel.data.length == 1 && $scope.pageModel.currentPage > 1) {
                    $scope.pageModel.currentPage = $scope.pageModel.currentPage - 1;
                }
                $scope.find();
            }, function () {
                console.info('Modal dismissed at: ' + new Date());
            });
        }
    });
    //处理重复
    app.controller('delRepeatModal', function ($scope, $rootScope, $http, $filter, $uibModal, fac,$uibModalInstance,data) {
        $scope.repeatList=data.item
        console.log('iiiii',$scope.repeatList)
        $scope.repeatList.forEach(item=>{
            if(item.customerStatus==90||item.customerStatus==99){//签约认购的不可勾选
                item.checked=false
            }else{
                item.checked=true
            }
        })
        //选择框点击
        $scope.chooseClick=function(item){
            // debugger
            if(item.customerStatus==90||item.customerStatus==99){
                window.alert('已签约,已认购的用户不可勾选!')
            }else{
                item.checked=!item.checked
            }
        }
        //点击确认
        $scope.chooseSure=function(){
            let abandonList=[]
            console.log('pppppppppp',$scope.repeatList)
            $scope.repeatList.forEach(item=>{
                if(item.checked){
                    abandonList.push(item)
                }
            })
            $http.post("/ovu-crm/backstage/crmCustomer/manage/batchOperate",{ type: 4, customerList:abandonList }).success(function(resp){
                if(resp.code == 0){
                    window.msg("丢弃成功!");
                    $uibModalInstance.close();
                }else{
                    alert(resp.message)
                }
            });
        },
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
       
    });
    //无效客户
    app.controller('invalidCtrl', function ($scope, $rootScope, $http, $filter, $uibModal, fac) {
        document.title = "OVU-客户管理";
        angular.extend($rootScope, fac.dicts);
        $scope.pageModel = {};
        $scope.search = {}
        $scope.customerList = []
        app.modulePromiss.then(function () {
            fac.initPage($scope, function () {
                $scope.pageModel=[]
                $scope.find();
            })
        });
        fac.getPageResult("/ovu-base/system/dictionary/get", $scope.search, function (data) {
            $scope.intentionLevelList = data.PURPOSE_LEVEL;
            $scope.followWayList = data.FOLLOW_TYPE
        });
        // 查询列表
        $scope.find = function (pageNo) {
            if($rootScope.dept.parkId==undefined){
                alert('请选择跟项目关联的部门！')
                return false
            }else{
                $scope.search.parkId=$rootScope.dept.parkId
            }
            $.extend($scope.search, {
                currentPage: pageNo || $scope.pageModel.currentPage || 1,
                pageSize: $scope.pageModel.pageSize || 10
            });
            $scope.search.pageIndex = $scope.search.currentPage - 1;
            $scope.search.totalCount = $scope.pageModel.totalCount || 0;
            $scope.search.assignationStatus = 3
           
            fac.getPageResult("/ovu-crm/backstage/crmCustomer/manage/queryByPage", $scope.search, function (data) {
                $scope.pageModel = data;
                console.log($scope.pageModel)
            });
        }
        $scope.find();

        // 分配
        $scope.distribution = function (news) {
            var copy = angular.extend({}, news);
            var modal = $uibModal.open({
                animation: false,
                size: 'lg',
                templateUrl: '/view/crm/customerManagement/modal.distribution.html',
                controller: 'distribution',
                resolve: {
                    news: copy
                }
            });
            modal.result.then(function () {
                if ($scope.pageModel.data.length == 1 && $scope.pageModel.currentPage > 1) {
                    $scope.pageModel.currentPage = $scope.pageModel.currentPage - 1;
                }
                $scope.find(1);
            }, function () {
                console.info('Modal dismissed at: ' + new Date());
            });
        }

        //回收
        $scope.recycle = function (news) {
            var copy = angular.extend({}, news);
            var modal = $uibModal.open({
                animation: false,
                size: 'lg',
                templateUrl: '/view/crm/customerManagement/modal.recycle.html',
                controller: 'recycle',
                resolve: {
                    news: copy
                }
            });
            modal.result.then(function () {
                if ($scope.pageModel.data.length == 1 && $scope.pageModel.currentPage > 1) {
                    $scope.pageModel.currentPage = $scope.pageModel.currentPage - 1;
                }
                $scope.find(1);
            }, function () {
                console.info('Modal dismissed at: ' + new Date());
            });
        }

        // 查看
        $scope.view = function (news) {
            var copy = angular.extend({}, news);
            var modal = $uibModal.open({
                animation: false,
                size: 'lg',
                templateUrl: '/view/crm/customerManagement/modal.view.html',
                controller: 'viewModal',
                resolve: {
                    news: copy
                }
            });
            modal.result.then(function () {
                if ($scope.pageModel.data.length == 1 && $scope.pageModel.currentPage > 1) {
                    $scope.pageModel.currentPage = $scope.pageModel.currentPage - 1;
                }
                $scope.find(1);
            }, function () {
                console.info('Modal dismissed at: ' + new Date());
            });
        }

        //编辑
        $scope.edit = function (news) {
            var copy = angular.extend({}, news);
            var modal = $uibModal.open({
                animation: false,
                size: 'lg',
                templateUrl: '/view/crm/customerManagement/modal.editOverdue.html',
                controller: 'editOverdue',
                resolve: {
                    news: copy
                }
            });
            modal.result.then(function () {
                if ($scope.pageModel.data.length == 1 && $scope.pageModel.currentPage > 1) {
                    $scope.pageModel.currentPage = $scope.pageModel.currentPage - 1;
                }
                $scope.find(1);
            }, function () {
                console.info('Modal dismissed at: ' + new Date());
            });
        }

        //导出客户
        $scope.showReception = function () {
            console.log(1111)
           if(  $scope.search.type1||
                $scope.search.name1||
                $scope.search.phone1||
                $scope.search.customerStatus1||
                $scope.search.intentionLevel1||
                $scope.search.followStartTime1||
                $scope.search.followEndTime1||
                $scope.search.operator1){
                var params={
                    type:$scope.search.type1,
                    name:$scope.search.name1,
                    phone:$scope.search.phone1,
                    customerStatus:$scope.search.customerStatus1,
                    intentionLevel:$scope.search.intentionLevel1,
                    followStartTime:$scope.search.followStartTime1,
                    followEndTime:$scope.search.followEndTime1,
                    operator:$scope.search.operator1,
                    assignationStatus: 3
                }
                var str = getParams(params)
                console.log('/ovu-crm/backstage/crmCustomer/manage/exportCustomer'+ str,params)
                location.href='/ovu-crm/backstage/crmCustomer/manage/exportCustomer'+ str
            }else{
                location.href='/ovu-crm/backstage/crmCustomer/manage/exportCustomer?assignationStatus=3'
            }
            

        };

        // 移至垃圾箱
        $scope.move= function(news){
            console.log(news)
            item={
                type:3,
                customerList:[{
                    id:news.id,
                    assignationStatus:4
                }]
            }
            console.log(item)
            layer.confirm("确定要将选择的客户移至垃圾箱么？",function(){
                $http.post("/ovu-crm/backstage/crmCustomer/manage/batchOperate",item).success(function(resp){
                    if(resp.code == 0){
                        window.msg("移动成功!");
                        $scope.find();
                    }else{
                    	alert(resp.message);
                    }
                });
            })
        };

        // 批量移至垃圾箱
        $scope.moveAll= function(pageModel){
            pageModel.data.forEach(ele => {
                if (ele.checked == true) {
                    ele.assignationStatus=4
                    $scope.customerList.push(ele)
                }
            });
            item = {
                type: 3,
                customerList: $scope.customerList
            }
            console.log(item)
            layer.confirm("确定要将选择的客户移至垃圾箱么？",function(){
                $http.post("/ovu-crm/backstage/crmCustomer/manage/batchOperate",item).success(function(resp){
                    if(resp.code == 0){
                        window.msg("移动成功!");
                        $scope.find();
                    }else{
                    	alert(resp.message);
                    }
                });
            })
        };
    });
    //垃圾箱客户
    app.controller('binCtrl', function ($scope, $rootScope, $http, $filter, $uibModal, fac) {
        document.title = "OVU-客户管理";
        angular.extend($rootScope, fac.dicts);
        $scope.pageModel = {};
        $scope.search = {}
        $scope.customerList = []
        app.modulePromiss.then(function () {
            fac.initPage($scope, function () {
                $scope.pageModel=[]
                $scope.find();
            })
        });
        fac.getPageResult("/ovu-base/system/dictionary/get", $scope.search, function (data) {
            $scope.intentionLevelList = data.PURPOSE_LEVEL;
            $scope.followWayList = data.FOLLOW_TYPE
        });
        // 查询列表
        $scope.find = function (pageNo) {
            if($rootScope.dept.parkId==undefined){
                alert('请选择跟项目关联的部门！')
                return false
            }else{
                $scope.search.parkId=$rootScope.dept.parkId
            }
            $.extend($scope.search, {
                currentPage: pageNo || $scope.pageModel.currentPage || 1,
                pageSize: $scope.pageModel.pageSize || 10
            });
            $scope.search.pageIndex = $scope.search.currentPage - 1;
            $scope.search.totalCount = $scope.pageModel.totalCount || 0;
            $scope.search.assignationStatus = 4
           
            fac.getPageResult("/ovu-crm/backstage/crmCustomer/manage/queryByPage", $scope.search, function (data) {
                $scope.pageModel = data;
                console.log($scope.pageModel)
            });
        }
        $scope.find();

        //批量回收
        $scope.allRecycle = function (pageModel) {
            pageModel.data.forEach(ele => {
                if (ele.checked == true) {
                    $scope.customerList.push(ele)
                }
            });
            item = {
                type: 2,
                customerList: $scope.customerList
            }
            $http.post("/ovu-crm/backstage/crmCustomer/manage/batchOperate", item).success(function (resp) {
                if (resp.code == 0) {
                    window.msg("回收成功!");
                    $scope.find();
                } else {
                    alert(resp.msg);
                }
            });
        }

        //回收
        $scope.recycle = function (news) {
            var copy = angular.extend({}, news);
            var modal = $uibModal.open({
                animation: false,
                size: 'lg',
                templateUrl: '/view/crm/customerManagement/modal.recycle.html',
                controller: 'recycle',
                resolve: {
                    news: copy
                }
            });
            modal.result.then(function () {
                if ($scope.pageModel.data.length == 1 && $scope.pageModel.currentPage > 1) {
                    $scope.pageModel.currentPage = $scope.pageModel.currentPage - 1;
                }
                $scope.find(1);
            }, function () {
                console.info('Modal dismissed at: ' + new Date());
            });
        }

        // 查看
        $scope.view = function (news) {
            var copy = angular.extend({}, news);
            var modal = $uibModal.open({
                animation: false,
                size: 'lg',
                templateUrl: '/view/crm/customerManagement/modal.view.html',
                controller: 'viewModal',
                resolve: {
                    news: copy
                }
            });
            modal.result.then(function () {
                if ($scope.pageModel.data.length == 1 && $scope.pageModel.currentPage > 1) {
                    $scope.pageModel.currentPage = $scope.pageModel.currentPage - 1;
                }
                $scope.find(1);
            }, function () {
                console.info('Modal dismissed at: ' + new Date());
            });
        }

        //导出客户
        $scope.showReception = function () {
            console.log(1111)
           if(  $scope.search.type1||
                $scope.search.name1||
                $scope.search.phone1||
                $scope.search.customerStatus1||
                $scope.search.intentionLevel1||
                $scope.search.followStartTime1||
                $scope.search.followEndTime1||
                $scope.search.operator1){
                var params={
                    type:$scope.search.type1,
                    name:$scope.search.name1,
                    phone:$scope.search.phone1,
                    customerStatus:$scope.search.customerStatus1,
                    intentionLevel:$scope.search.intentionLevel1,
                    followStartTime:$scope.search.followStartTime1,
                    followEndTime:$scope.search.followEndTime1,
                    operator:$scope.search.operator1,
                    assignationStatus: 4
                }
                var str = getParams(params)
                console.log('/ovu-crm/backstage/crmCustomer/manage/exportCustomer'+ str,params)
                location.href='/ovu-crm/backstage/crmCustomer/manage/exportCustomer'+ str
            }else{
                location.href='/ovu-crm/backstage/crmCustomer/manage/exportCustomer?assignationStatus=4'
            }
            

        };

    });
    //丢弃客户
    app.controller('discardedCtrl', function ($scope, $rootScope, $http, $filter, $uibModal, fac) {
        document.title = "OVU-客户管理";
        angular.extend($rootScope, fac.dicts);
        $scope.pageModel = {};
        $scope.search = {}
        $scope.customerList = []
        app.modulePromiss.then(function () {
            fac.initPage($scope, function () {
                $scope.pageModel=[]
                $scope.find();
            })
        });
        fac.getPageResult("/ovu-base/system/dictionary/get", $scope.search, function (data) {
            $scope.intentionLevelList = data.PURPOSE_LEVEL;
            $scope.followWayList = data.FOLLOW_TYPE
        });
        // 查询列表
        $scope.find = function (pageNo) {
            if($rootScope.dept.parkId==undefined){
                alert('请选择跟项目关联的部门！')
                return false
            }else{
                $scope.search.parkId=$rootScope.dept.parkId
            }
            $.extend($scope.search, {
                currentPage: pageNo || $scope.pageModel.currentPage || 1,
                pageSize: $scope.pageModel.pageSize || 10
            });
            $scope.search.pageIndex = $scope.search.currentPage - 1;
            $scope.search.totalCount = $scope.pageModel.totalCount || 0;
            $scope.search.assignationStatus = 5
           
            fac.getPageResult("/ovu-crm/backstage/crmCustomer/manage/queryByPage", $scope.search, function (data) {
                $scope.pageModel = data;
                console.log($scope.pageModel)
            });
        }
        $scope.find();

        //批量回收
        $scope.allRecycle = function (pageModel) {
            pageModel.data.forEach(ele => {
                if (ele.checked == true) {
                    $scope.customerList.push(ele)
                }
            });
            item = {
                type: 2,
                customerList: $scope.customerList
            }
            $http.post("/ovu-crm/backstage/crmCustomer/manage/batchOperate", item).success(function (resp) {
                if (resp.code == 0) {
                    window.msg("回收成功!");
                    $scope.find();
                } else {
                    alert(resp.msg);
                }
            });
        }
        //回收
        $scope.recycle = function (news) {
            var copy = angular.extend({}, news);
            var modal = $uibModal.open({
                animation: false,
                size: 'lg',
                templateUrl: '/view/crm/customerManagement/modal.recycle.html',
                controller: 'recycle',
                resolve: {
                    news: copy
                }
            });
            modal.result.then(function () {
                if ($scope.pageModel.data.length == 1 && $scope.pageModel.currentPage > 1) {
                    $scope.pageModel.currentPage = $scope.pageModel.currentPage - 1;
                }
                $scope.find(1);
            }, function () {
                console.info('Modal dismissed at: ' + new Date());
            });
        }

        // 查看
        $scope.view = function (news) {
            var copy = angular.extend({}, news);
            var modal = $uibModal.open({
                animation: false,
                size: 'lg',
                templateUrl: '/view/crm/customerManagement/modal.view.html',
                controller: 'viewModal',
                resolve: {
                    news: copy
                }
            });
            modal.result.then(function () {
                if ($scope.pageModel.data.length == 1 && $scope.pageModel.currentPage > 1) {
                    $scope.pageModel.currentPage = $scope.pageModel.currentPage - 1;
                }
                $scope.find(1);
            }, function () {
                console.info('Modal dismissed at: ' + new Date());
            });
        }

        //导出客户
        $scope.showReception = function () {
            console.log(1111)
           if(  $scope.search.type1||
                $scope.search.name1||
                $scope.search.phone1||
                $scope.search.customerStatus1||
                $scope.search.intentionLevel1||
                $scope.search.followStartTime1||
                $scope.search.followEndTime1||
                $scope.search.operator1){
                var params={
                    type:$scope.search.type1,
                    name:$scope.search.name1,
                    phone:$scope.search.phone1,
                    customerStatus:$scope.search.customerStatus1,
                    intentionLevel:$scope.search.intentionLevel1,
                    followStartTime:$scope.search.followStartTime1,
                    followEndTime:$scope.search.followEndTime1,
                    operator:$scope.search.operator1,
                    assignationStatus: 5
                }
                var str = getParams(params)
                console.log('/ovu-crm/backstage/crmCustomer/manage/exportCustomer'+ str,params)
                location.href='/ovu-crm/backstage/crmCustomer/manage/exportCustomer'+ str
            }else{
                location.href='/ovu-crm/backstage/crmCustomer/manage/exportCustomer?assignationStatus=5'
            }
            

        };
    });
})()
