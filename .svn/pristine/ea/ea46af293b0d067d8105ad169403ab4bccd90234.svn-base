(function () {
    var app = angular.module("angularApp");
    app.controller('financeDealWithCtrl', function ($scope, $rootScope, $http, $filter, $uibModal, fac) {
        document.title = "财务待办";
        app.modulePromiss.then(function () {
            $scope.search = {
                status:'0'
            };
            $scope.selCount = 0;
            $scope.pageModel = {};
            $scope.$watch('project.id', function (projectId, oldValue) {
                if (projectId) {
                    $scope.search.parentHouseId = $rootScope.project.id;
                    $scope.find(1)
                }
            })

        });
        $scope.find = function (pageNo) {
            $.extend($scope.search, { currentPage: pageNo || $scope.pageModel.currentPage || 1, pageSize: $scope.pageModel.pageSize || 10 });
            fac.getPageResult("/ovu-park/backstage/sale/financeWaiting/findPage", $scope.search, function (data) {
                $scope.pageModel = data;
            });
        };
        //标识完成
        $scope.identification = function (id, houseId, status, type) {
            if(status == '1'){
                return false;
            }
            layer.confirm("是否标识完成？", { btn: ['是', '否'] }, function () {
                $http.post("/ovu-park/backstage/sale/financeWaiting/finish", { id: id, houseId: houseId, type: type}, fac.postConfig).success(function (resp) {
                    if (resp.code == 0) {
                        window.msg("标识完成成功！");
                        $scope.find(1);
                    } else {
                        alert(resp.msg);
                    }
                })
            });
        }
        //财务处理
        $scope.toDealWith = function (houseId) {
            var modal = $uibModal.open({
                animation: false,
                size: 'lg',
                templateUrl: '/view/investmentSystem/financeManage/modal.financeHandle.html',
                controller: 'financeHandleCtrl',
                resolve: { houseInfo: {houseId:houseId} }
            });
            modal.result.then(function () {
                $scope.find();
            }, function () {
                $scope.find();
                console.info('Modal dismissed at: ' + new Date());
            });
        };
    });

    // //财务处理
    // app.controller('financeHandleCtrl', function ($scope, $rootScope, $http, $uibModalInstance, $uibModal, $filter, fac, houseInfo) {
    //     $scope.financeInfo = {};
    //     $scope.addnum = 1;
    //     $scope.sfcMoneyCount=0
    //     $scope.sfiMoneyCount=0
    //     $scope.sfcChecked=false
    //     //查询财务处理详情
    //     var queryFinanceDetail=function(){
    //         $http.post("/ovu-park/backstage/sale/finance/findInfo",{ 'houseId': houseInfo.houseId },fac.postConfig).success(function(resp){
    //             if (resp.code == 0) {
    //                 $scope.financeInfo = resp.data;
    //                 $scope.addnum = $scope.financeInfo.sfcList ? $scope.financeInfo.sfcList.length + 1 : 1
    //                 calculateSfcCount()
    //             } else {
    //                 alert(resp.msg)
    //             }
    //         });
    //     }
    //     queryFinanceDetail()
    //     $scope.checkAll = function (sfcList) {
    //         if($scope.financeInfo.sfcList&&$scope.financeInfo.sfcList.length>0){
    //             $scope.sfcChecked=!$scope.sfcChecked
    //             $scope.financeInfo.sfcList.forEach(function (n) { n.checked = $scope.sfcChecked});
    //         }
    //     }
    //     $scope.checkOne = function (item) {
    //         item.checked = !item.checked;
    //         if ($scope.financeInfo.sfcList && $scope.financeInfo.sfcList.length>0) {
    //             $scope.sfcChecked= $scope.financeInfo.sfcList.every(function (v) {
    //                 return v.checked;
    //             });
    //         }
    //     }
    //     $scope.hasChecked = function (data) {
    //         if (data && data.length) {
    //             return data.filter(function (n) {
    //                 return n.checked
    //             }).length;
    //         }
    //         return false;
    //     }
    //
    //     var calculateSfcCount=function () {
    //         $scope.sfcMoneyCount = 0;
    //         $scope.sfiMoneyCount = 0;
    //         $scope.financeInfo.sfcList.forEach(function (v) {
    //             $scope.sfcMoneyCount+=parseFloat(v.amountRmb)
    //         });
    //         $scope.financeInfo.sfiList.forEach(function (v) {
    //             if(v.status!='0'){
    //                 $scope.sfiMoneyCount+=parseFloat(v.receiveAmountRmb)
    //             }
    //         });
    //     }
    //     //切换房间
    //     $scope.changeHouse = function () {
    //
    //         var modal = $uibModal.open({
    //             animation: false,
    //             size: '',
    //             templateUrl: '/view/investmentSystem/financeManage/modal.selectHouse.html',
    //             controller: 'selectHouseCtrl',
    //             resolve: { contact: { "parkId": app.park.parkId } }
    //         });
    //         modal.result.then(function (data) {
    //             console.log("data.houses:", data.houses)
    //             // angular.extend($scope.baseMsg, data.houses)
    //
    //         }, function () {
    //         });
    //     }
    //     //合同详情
    //     $scope.showContractDetail = function (id) {
    //         var modal = $uibModal.open({
    //             animation: false,
    //             size: 'md',
    //             templateUrl: '/view/investmentSystem/financeManage/modal.contractDetail.html',
    //             controller: 'contractDetailCtrl',
    //             resolve: { data: { id: id } }
    //         });
    //         modal.result.then(function () {
    //         }, function () {
    //             console.info('Modal dismissed at: ' + new Date());
    //         });
    //     }
    //     //认购详情
    //     $scope.showSubscripDetail = function (id) {
    //         var modal = $uibModal.open({
    //             animation: false,
    //             size: 'md',
    //             templateUrl: '/view/investmentSystem/financeManage/modal.subscriptionDetail.html',
    //             controller: 'subscriptionDetailCtrl',
    //             resolve: { data: { id: id } }
    //         });
    //         modal.result.then(function () {
    //
    //         }, function () {
    //             console.info('Modal dismissed at: ' + new Date());
    //         });
    //
    //     };
    //     //删除供款明细
    //     $scope.delete = function (id) {
    //         confirm("确定删除该供款明细?", function () {
    //             let ids = [];
    //             $scope.financeInfo.sfcList.forEach(sfc=>{
    //                 if(sfc.checked){
    //                     ids.push(sfc.id)
    //                 }
    //             });
    //             if(ids.length==0){
    //                 alert("请选择一条记录");
    //             }else{
    //                 $http.post("/ovu-park/backstage/sale/finance/collection/delete", { collectionIdList: ids.join() }, fac.postConfig).success(function (resp) {
    //                     if (resp.code == 0) {
    //                         window.msg("删除成功！");
    //                         queryFinanceDetail()
    //                     } else {
    //                         alert(resp.msg);
    //                     }
    //                 });
    //             }
    //         })
    //     }
    //     //新增供款明细
    //     $scope.addDetailed = function (id) {
    //         var modal = $uibModal.open({
    //             animation: false,
    //             size: 'md',
    //             templateUrl: '/view/investmentSystem/financeManage/modal.addDetailed.html',
    //             controller: 'addDetailedCtrl',
    //             resolve: { deData: { num: $scope.addnum, id: id } }
    //         });
    //         modal.result.then(function () {
    //             queryFinanceDetail()
    //         }, function () {
    //             console.info('Modal dismissed at: ' + new Date());
    //         });
    //
    //     };
    //     //sfcData有数据表示收款；sfcData没有表示查看
    //     $scope.receiveMoney = function (id,isEdit) {
    //         var modal = $uibModal.open({
    //             animation: false,
    //             size: 'lg',
    //             templateUrl: '/view/investmentSystem/financeManage/modal.receiveMoney.html',
    //             controller: 'receiveMoneyCtrl',
    //             resolve: {sfcData:{isEdit:isEdit,id:id}}
    //         });
    //         modal.result.then(function () {
    //             queryFinanceDetail()
    //         }, function () {
    //             console.info('Modal dismissed at: ' + new Date());
    //         });
    //     }
    //     //退款
    //     $scope.returnMoney = function (type, status, id, isEdit) {
    //         if(type == '0' && status =='1'){
    //             return false;
    //         }
    //         var modal = $uibModal.open({
    //             animation: false,
    //             size: 'lg',
    //             templateUrl: '/view/investmentSystem/financeManage/modal.returnMoney.html',
    //             controller: 'returnMoneyCtrl',
    //             resolve: {sfcData:{isEdit:isEdit,id:id,type:type}}
    //         });
    //         modal.result.then(function () {
    //             queryFinanceDetail()
    //         }, function () {
    //             console.info('Modal dismissed at: ' + new Date());
    //         });
    //     }
    //
    //     // 保存
    //     $scope.save = function () {
    //
    //     }
    //     // 取消
    //     $scope.cancel = function () {
    //         $uibModalInstance.dismiss('cancel');
    //     }
    // });
    // // 切换房间
    // app.controller('selectHouseCtrl', function ($scope, $rootScope, $http, $uibModalInstance, $filter, fac, contact) {
    //     $scope.item = contact;
    //     $rootScope.treeData = null;
    //     $rootScope.flatData = null;
    //     $scope.config = { edit: false, showCheckbox: false }
    //     $scope.rightObj = '';
    //     $scope.newChooseIds = [];//编辑资源，已选定，即将要关联的空间id
    //     var dataObj = {
    //         "parkId": $scope.item.parkId
    //     }
    //     $http.post(" /ovu-park/backstage/invest/saleContract/getHouseTree", dataObj, fac.postConfig).success(function (treeData) {
    //         $rootScope.treeData = treeData.data;
    //         $rootScope.flatData = fac.treeToFlat(treeData.data);
    //         var node = $scope.flatData.find(function (n) { return n.did == houses.houseId });
    //         if (node != undefined) {
    //             node.state = node.state || {};
    //             node.state.selected = true;
    //             $scope.curNode = node
    //             expandFather(node);
    //             $scope.rightObj = node.stageName + ">" + node.buildName + ">" + node.houseName;
    //         }
    //
    //     });
    //
    //     function expandFather(node) {
    //         var father = $scope.flatData.find(function (n) { return n.did == node.pdid });
    //         if (father) {
    //             father.state = father.state || {};
    //             father.state.expanded = true;
    //             expandFather(father);
    //         }
    //     }
    //
    //
    //     $scope.selectNode = function (node) {
    //         if ($scope.curNode != node) {
    //             $scope.curNode && $scope.curNode.state && ($scope.curNode.state.selected = false);
    //         }
    //         node.state = node.state || {};
    //         node.state.selected = !node.state.selected;
    //         if (node.state.selected) {
    //             $scope.curNode = node;
    //             if (node.houseId) {
    //                 $scope.rightObj = node.stageName + ">" + node.buildName + ">" + node.houseName;
    //             } else {
    //                 $scope.rightObj = '';
    //             }
    //         } else {
    //             $scope.rightObj = ''
    //         }
    //     }
    //     $scope.save = function () {
    //         if (!$scope.rightObj || !$scope.curNode) {
    //             alert("请选择房屋！");
    //             return;
    //         }
    //         var houses = {
    //             houseId: $scope.curNode.did,
    //             houseName: $scope.rightObj,
    //             area: $scope.curNode.area,
    //             areaSu: $scope.curNode.areaSu,
    //             recordNumber: $scope.curNode.recordNumber
    //         }
    //
    //         $uibModalInstance.close({ houses: houses });
    //     }
    //     $scope.cancel = function () {
    //         $uibModalInstance.dismiss('cancel');
    //     }
    // });
    // //合同详情
    // app.controller('contractDetailCtrl', function ($scope, $rootScope, $http, $uibModalInstance, $uibModal, $filter, fac, data) {
    //     $scope.item = data
    //     $scope.isEdit = data.id ? true : false
    //     // 保存
    //     $scope.save = function () {
    //         $uibModalInstance.close()
    //     }
    //     // 取消
    //     $scope.cancel = function () {
    //         $uibModalInstance.dismiss('cancel');
    //     }
    // });
    // //认购详情
    // app.controller('subscriptionDetailCtrl', function ($scope, $rootScope, $http, $uibModalInstance, $uibModal, $filter, data) {
    //     $scope.item = data;
    //     $scope.isEdit = data.id ? true : false
    //     $scope.isSubscription= false
    //     // 保存
    //     $scope.save = function (form) {
    //         $uibModalInstance.close()
    //     }
    //     // 取消
    //     $scope.cancel = function () {
    //         $uibModalInstance.dismiss('cancel');
    //     }
    // });
    // //新增供款明细
    // app.controller('addDetailedCtrl', function ($scope, $rootScope, $http, $uibModalInstance, $filter, deData) {
    //     $scope.detailed = {
    //         orderNum: deData.num,
    //         balanceId: deData.id
    //     }
    //     // 保存
    //     $scope.save = function () {
    //         $.post("/ovu-park/backstage/sale/finance/collection/add", $scope.detailed, function (resp) {
    //             if (resp.code == 0) {
    //                 window.msg("新增成功！");
    //                 $uibModalInstance.close();
    //             } else {
    //                 window.alert(resp.msg);
    //             }
    //         });
    //         $uibModalInstance.close()
    //     }
    //     // 取消
    //     $scope.cancel = function () {
    //         $uibModalInstance.dismiss('cancel');
    //     }
    // });
    // //收款
    // app.controller('receiveMoneyCtrl', function ($scope, $rootScope, $http, $uibModalInstance, $filter,sfcData,fac) {
    //     $scope.isEdit=sfcData.isEdit;
    //     $scope.id=sfcData.id;
    //     $scope.invoices = {};
    //     //收款页面初始化
    //     var initData = function () {
    //         //根据id查询收款新
    //         if($scope.isEdit){
    //             let param = {balanceId:$scope.id};
    //             $http.post("/ovu-park/backstage/sale/finance/invoices/init",param,fac.postConfig).success(function(resp){
    //                 if(resp.code == 0){
    //                     $scope.invoices = resp.data;
    //                 }else{
    //                     window.alert(resp.msg);
    //                     $uibModalInstance.close();
    //                 }
    //             });
    //         }else{
    //             let param = {id:$scope.id};
    //             $http.post("/ovu-park/backstage/sale/finance/invoices/findInfo",param,fac.postConfig).success(function(resp){
    //                 if(resp.code == 0){
    //                     $scope.invoices = resp.data;
    //                     $scope.receiveMoneyTotal(null);
    //                 }else{
    //                     window.alert(resp.msg);
    //                     $uibModalInstance.close();
    //                 }
    //             });
    //         }
    //
    //
    //     }
    //     initData()
    //     // 保存
    //     $scope.save = function (form) {
    //         form.$setSubmitted(true);
    //         if (!form.$valid) {
    //             return false;
    //         }
    //         //应收应该等于实收
    //         let isOk = true;
    //         $scope.invoices.detailList.forEach(detail=>{
    //             if(detail.amount !=0 && detail.amount != detail.amountRmb){
    //                 isOk = false;
    //                 return
    //             }
    //         })
    //         if(!isOk){
    //             window.alert("实收金额不等于应收金额！");
    //             return false
    //         }
    //         $scope.invoices.detailListStr = JSON.stringify($scope.invoices.detailList);
    //         $scope.invoices.type = "0";
    //         $http.post("/ovu-park/backstage/sale/finance/invoices/add",$scope.invoices,fac.postConfig).success(function(resp){
    //             if(resp.code == 0){
    //                 window.msg("收款成功！");
    //                 $uibModalInstance.close()
    //             }else{
    //                 window.alert(resp.msg);
    //             }
    //         })
    //     }
    //     $scope.examine = function (id) {
    //         layer.confirm("是否通过审核？", { btn: ['是', '否'] }, function () {
    //             $http.post("/ovu-park/backstage/sale/finance/invoices/approve",{id:id,status:"2"},fac.postConfig).success(function(resp){
    //                 if(resp.code == 0){
    //                     window.msg("审批成功！");
    //                     $uibModalInstance.close()
    //                 }else{
    //                     window.alert(resp.msg);
    //                 }
    //             })
    //         },function () {
    //             $http.post("/ovu-park/backstage/sale/finance/invoices/approve",{id:id,status:"0"},fac.postConfig).success(function(resp){
    //                 if(resp.code == 0){
    //                     window.msg("驳回成功！");
    //                     $uibModalInstance.close()
    //                 }else{
    //                     window.alert(resp.msg);
    //                 }
    //             })
    //         });
    //     }
    //
    //     // 取消
    //     $scope.cancel = function () {
    //         $uibModalInstance.dismiss('cancel');
    //     }
    //     // 汇总单据收款总金额
    //     $scope.receiveMoneyTotal = function (detail) {
    //         if(detail!=null && detail.amount != detail.amountRmb){
    //             window.alert("收款金额必须等于应收金额!");
    //             return false
    //         }
    //         $scope.receivedAmountRate = 0;
    //         $scope.receivedAmount = 0;
    //         if ($scope.invoices && $scope.invoices.detailList){
    //             $scope.invoices.detailList.forEach(detail=>{
    //                 if(detail.amount){
    //                     $scope.receivedAmountRate = ($scope.receivedAmountRate + detail.amount).toFixed(2);
    //                     $scope.receivedAmount = ($scope.receivedAmount + detail.amount*(1-detail.rate/100)).toFixed(2);
    //                 }
    //             })
    //         }
    //     }
    // });
    // //退款
    // app.controller('returnMoneyCtrl', function ($scope, $rootScope, $http, $uibModalInstance, $filter,sfcData,fac) {
    //     //初始化退款信息
    //     $scope.isEdit=sfcData.isEdit;
    //     $scope.id=sfcData.id;
    //     $scope.returnInfo = {};
    //     let param = {id:$scope.id};
    //     if(sfcData.type == '0'){
    //         $http.post("/ovu-park/backstage/sale/finance/invoices/findInfo",param,fac.postConfig).success(function(resp){
    //             if(resp.code == 0){
    //                 $scope.returnInfo = resp.data;
    //                 //退款单据列表默认为收款单据列表
    //                 $scope.returnInfo.refundDetailList = resp.data.detailList;
    //                 $scope.receiveMoneyTotal();
    //                 $scope.returnMoneyTotal(null);
    //             }else{
    //                 window.alert(resp.msg);
    //                 $uibModalInstance.close();
    //             }
    //         });
    //     }else{
    //         $http.post("/ovu-park/backstage/sale/finance/invoices/findRefundInfo",param,fac.postConfig).success(function(resp){
    //             if(resp.code == 0){
    //                 $scope.returnInfo = resp.data;
    //                 $scope.receiveMoneyTotal();
    //                 $scope.returnMoneyTotal(null);
    //             }else{
    //                 window.alert(resp.msg);
    //                 $uibModalInstance.close();
    //             }
    //         });
    //     }
    //
    //
    //     // 保存
    //     $scope.save = function () {
    //         //校验退款金额
    //         let flag =true;
    //         if ($scope.returnInfo && $scope.returnInfo.refundDetailList){
    //             $scope.returnInfo.refundDetailList.forEach(detail=>{
    //                  if(detail.refundAmount != detail.amount){
    //                      flag =false;
    //                  }
    //             })
    //             if(!flag){
    //                 window.alert("退款金额不等于收款金额，不允许收款！");
    //                 return false;
    //             }
    //         }else{
    //             window.alert("没有退款信息，不能提交！");
    //             return false;
    //         }
    //         //保存退款信息
    //         $scope.returnInfo.refundForId = $scope.returnInfo.id;
    //         $scope.returnInfo.id = null;
    //         $scope.returnInfo.type = "1";
    //         $scope.returnInfo.refundDetailListStr = JSON.stringify($scope.returnInfo.refundDetailList);
    //         $http.post("/ovu-park/backstage/sale/finance/invoices/add",$scope.returnInfo,fac.postConfig).success(function(resp){
    //             if(resp.code == 0){
    //                 window.msg("退款成功！");
    //                 $uibModalInstance.close()
    //             }else{
    //                 window.alert(resp.msg);
    //             }
    //         })
    //     }
    //     $scope.examine = function (id) {
    //         layer.confirm("是否通过审核？", { btn: ['是', '否'] }, function () {
    //             $http.post("/ovu-park/backstage/sale/finance/invoices/approve",{id:id,status:"2"},fac.postConfig).success(function(resp){
    //                 if(resp.code == 0){
    //                     window.msg("审批成功！");
    //                     $uibModalInstance.close()
    //                 }else{
    //                     window.alert(resp.msg);
    //                 }
    //             })
    //         },function () {
    //             $http.post("/ovu-park/backstage/sale/finance/invoices/approve",{id:id,status:"0"},fac.postConfig).success(function(resp){
    //                 if(resp.code == 0){
    //                     window.msg("驳回成功！");
    //                     $uibModalInstance.close()
    //                 }else{
    //                     window.alert(resp.msg);
    //                 }
    //             })
    //         });
    //     }
    //
    //     // 取消
    //     $scope.cancel = function () {
    //         $uibModalInstance.dismiss('cancel');
    //     }
    //     // 汇总单据收款总金额
    //     $scope.receiveMoneyTotal = function () {
    //         $scope.receivedAmountRate = 0;
    //         $scope.receivedAmount = 0;
    //         if ($scope.returnInfo && $scope.returnInfo.detailList){
    //             $scope.returnInfo.detailList.forEach(detail=>{
    //                 if(detail.amount){
    //                     $scope.receivedAmountRate = ($scope.receivedAmountRate + detail.amount).toFixed(2);
    //                     $scope.receivedAmount = ($scope.receivedAmount + detail.amount*(1-detail.rate/100)).toFixed(2);
    //                 }
    //             })
    //         }
    //     }
    //     // 汇总单据退款总金额
    //     $scope.returnMoneyTotal = function (detail) {
    //         if(detail!=null && detail.refundAmount != detail.amount){
    //             window.alert("退款金额必须等于实收金额");
    //             return false
    //         }
    //         $scope.refundAmountRate = 0;
    //         $scope.refundAmount = 0;
    //         if ($scope.returnInfo && $scope.returnInfo.refundDetailList){
    //             $scope.returnInfo.refundDetailList.forEach(detail=>{
    //                 if(detail.refundAmount){
    //                     $scope.refundAmountRate = ($scope.refundAmountRate + detail.refundAmount).toFixed(2);
    //                     $scope.refundAmount = ($scope.refundAmount + detail.refundAmount*(1-detail.rate/100)).toFixed(2);
    //                 }
    //             })
    //         }
    //     }
    // });

    app.filter("toStatus", function () {//转换状态
        return function (value) {
            if (value == 0) {
                return "未处理";
            } else if (value == 1) {
                return "已处理";
            } else {
                return "废除";
            }
        }
    });



})();
