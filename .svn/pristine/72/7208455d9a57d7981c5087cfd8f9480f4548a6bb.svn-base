(function () {
    var app = angular.module("angularApp");
    app.controller('subscriptionManageCtrl', function ($scope, $rootScope, $http, $filter, $uibModal, fac) {
        document.title = "认购管理";
        var width=$(window).width()-300
        $('#table_subs').width(width)
        app.modulePromiss.then(function () {
            $scope.search = {
                haveEffective:'1'
            };
            $scope.selCount = 0;
            $scope.pageModel = {};
            $scope.$watch('project.id', function (projectId, oldValue) {
                if (projectId) {
                    $scope.search.parkId='';
                    $scope.search.stageId='';
                    $scope.search.buildId='';
                    $scope.search.parkId = $rootScope.project.parkId;
                    $rootScope.project.stageId && ($scope.search.stageId = $rootScope.project.stageId)
                    $rootScope.project.buildId && ($scope.search.buildId = $rootScope.project.buildId)
                    $scope.find(1)
                }
            })

        });

        $scope.checkAll = function () {
            $scope.pageModel.checked = !$scope.pageModel.checked;
            $scope.pageModel.list.forEach(function (n) { n.checked = $scope.pageModel.checked });
            $scope.selCount = ($scope.pageModel.checked ? $scope.pageModel.list.length : 0)
        }
        $scope.checkOne = function (item) {
            item.checked = !item.checked;
            if ($scope.pageModel && $scope.pageModel.list) {
                $scope.pageModel.checked = $scope.pageModel.list.every(function (v) {
                    return v.checked;
                });
            }
            if (item.checked) {
                $scope.selCount++;
            } else {
                $scope.selCount--;
            }
        }


        $scope.find = function (pageNo) {
            $.extend($scope.search, { currentPage: pageNo || $scope.pageModel.currentPage || 1, pageSize: $scope.pageModel.pageSize || 10 });
            fac.getPageResult("/ovu-park/backstage/subscription/queryPage", $scope.search, function (data) {
                $scope.pageModel = data;
            });
        };
        //批量作废
        $scope.batchCancel = function () {
            var houseIds = []
            confirm("确认批量作废?", function () {
                $scope.pageModel.data.forEach(function (n) {
                    if (n.checked) {
                        houseIds.push(n.houseId)
                    }
                });

                $http.post("/ovu-park/backstage/subscription/batchCancelSubscription", { houseIds: houseIds.join(","), personId: app.user.id }, fac.postConfig).success(function (resp) {
                    if (resp.code == 0) {
                        window.msg('批量作废成功' + resp.data.success + '个,' + "失败" + resp.data.fail + '个');
                        $scope.find(1)
                    } else {
                        alert(resp.msg);
                    }
                    $uibModalInstance.close();
                });
            });
        }
        //作废
        $scope.cancelSubscription = function (id) {
            confirm("确认要作废该认购协议?", function () {
                $http.post("/ovu-park/backstage/subscription/cancelSubscription", { subscriptionId: id }, fac.postConfig).success(function (resp) {
                    if (resp.code == 0) {
                        window.msg("作废成功！");
                        $scope.find(1)
                    } else {
                        alert(resp.msg);
                    }
                    $uibModalInstance.close();
                });
            });
        }
        //新增认购
        $scope.addSubscription = function () {
            var modal = $uibModal.open({
                animation: false,
                size: 'lg',
                templateUrl: '/view/investmentSystem/transactionManage/subscriptionManage/modal.addSubscription.html',
                controller: 'addSubscriptionCtrl',
                resolve: {}
            });
            modal.result.then(function () {
                $scope.find();
            }, function () {
                console.info('Modal dismissed at: ' + new Date());
            });
        };
        //签约
        $scope.toSigning = function (id) {
            var modal = $uibModal.open({
                animation: false,
                size: 'lg',
                templateUrl: '/view/investmentSystem/financeManage/modal.subscriptionDetail.html',
                controller: 'signDetailCtrl',
                resolve: { data: { id: id } }
            });
            modal.result.then(function () {
                $scope.find();
            }, function () {
                console.info('Modal dismissed at: ' + new Date());
            });
        };



    });

    //新增认购
    app.controller('addSubscriptionCtrl', function ($scope, $rootScope, $http, $uibModalInstance, $uibModal, $filter, fac) {
        //当前page页面
        $scope.config = { edit: false, showCheckbox: false }
        $scope.curTabIndex = 1;
        // $scope.pageModel = {};
        $scope.selCustomer = {};
        $scope.showCustomerModal = true;
        $scope.signInfo = {};
        $scope.selHouse = {};
        $scope.parkList = []//项目
        var curSelNodeId = ""
        //业务员获取焦点出现弹框
        $scope.businessManagerFocus=function(){
            console.log('业务员获取焦点出现弹框')
            var modal = $uibModal.open({
                animation: false,
                size: 'md',
                templateUrl: '/view/investmentSystem/transactionManage/contractManage/modal.chooseManager.html',
                controller: 'chooseManager',
                // resolve: { customerObj: item }
            });
            modal.result.then(function (data) {
                console.log('------------',data)
                $scope.signInfo.businessManager=data.name
                $scope.signInfo.businessManagerId=data.id
                // $scope.find();
            }, function () {
                console.info('Modal dismissed at: ' + new Date());
            });
        }
        //初始化页面
        app.modulePromiss.then(function(){
            $scope.search={
            };
            $scope.selCount=0;
            $scope.pageModel = {};
            // $scope.isSync=true
            // $scope.checkSyncBtn()
            $scope.$watch('project.id', function (projectId, oldValue) {
                if (projectId) {
                    $scope.search.parkId=""
                    $scope.search.stage_id=""
                    $scope.search.build_id=""
                    $scope.search.parkId = $rootScope.project.parkId;
                    $rootScope.project.stageId&&($scope.search.stage_id= $rootScope.project.stageId);
                    $rootScope.project.buildId&&($scope.search.build_id= $rootScope.project.buildId);
                    $scope.find(1)
                }
            })

        });
        //查看合同窗口
        $scope.showCustomer = function (item) {
            console.log('000000000',item)
            var modal = $uibModal.open({
                animation: false,
                size: 'lg',
                templateUrl: '/view/investmentSystem/customerManage/modal.showCustomer.html',
                controller: 'showCustomerCtrl',
                resolve: { customerObj: item }
            });
            modal.result.then(function () {
                $scope.find();
            }, function () {
                console.info('Modal dismissed at: ' + new Date());
            });
        };

        //新增客户的数量
        $scope.addcustomerNum = 1;
        $scope.find = function (pageNo) {
            $.extend($scope.search, { currentPage: pageNo || $scope.pageModel.currentPage || 1, pageSize: $scope.pageModel.pageSize || 10 });
            fac.getPageResult("/ovu-crm/backstage/crmCustomer/manage/queryByPage", $scope.search, function (data) {
                $scope.pageModel = data;
            });
        };

        $rootScope.projectTree.forEach(function (node) { $scope.parkList.push({ "id": node.id, "parkName": node.parkName }) })
        $scope.selHouse.parkId = $rootScope.project.parkId

        var delUnit = function (item) {
            item.forEach(function (node) {
                if (node.nodes) {
                    if (node.type == "楼栋") {
                        delete node.nodes
                    } else {
                        delUnit(node.nodes)
                    }

                }

            })

        }
        $scope.serachBuild = function (parkId) {
            $scope.stageTree = []//分期楼栋
            $scope.unitList = []//单元
            $scope.floorList = []//楼层
            $scope.houseList = []//房间
            curSelNodeId = ""
            $http.post("/ovu-park/backstage/sale/saleparkhouse/tree", { park_id: parkId, sale_status: 1 }, fac.postConfig).success(function (resp) {
                if (resp.code == 0) {
                    $scope.stageTree = resp.data;
                    $scope.flatTreeData = fac.treeToFlat($scope.stageTree);
                    delUnit($scope.stageTree)
                    console.log($scope.flatTreeData)
                } else {
                    alert(resp.msg);
                }
            });
        }

        $scope.serachBuild($scope.selHouse.parkId)

        $scope.findListByBuild = function (title, node, list) {
            $scope.houseList = [];
            if (title == '楼层') {
                $scope.floorList = [];
                $scope.checkOne($scope.unitList, node)
                $scope.flatTreeData.forEach(function (n) {
                    if (n.type == title && n.parentId == node.id) {
                        $scope.floorList.push({ id: n.id, name: n.text, status: n.sale_status, checked: false })
                    }
                })

            } else if (title == '房间') {
                $scope.checkOne($scope.floorList, node)
                $scope.flatTreeData.forEach(function (n) {
                    if (n.type == title && n.parentId == node.id) {
                        $scope.houseList.push({ id: n.id, name: n.text, status: n.sale_status, checked: false })
                    }
                })
            }
        }
        $scope.selectNode = function (node) {
            if (curSelNodeId) {//重置上次选中
                var lastSelNode = $scope.flatTreeData.find(function (obj) { return obj.id == curSelNodeId })
                lastSelNode.state.selected = false;
                lastSelNode.state.highLight = false;
            }
            node.state = node.state || {};
            node.state.selected = true;
            node.state.highLight = true;
            curSelNodeId = node.id
            $scope.unitList = []//单元
            $scope.floorList = []//楼层
            $scope.houseList = []//房间
            if (node.build_id) {
                $scope.flatTreeData.forEach(function (n) {
                    if (n.type == '单元' && n.parentId == node.id) {
                        $scope.unitList.push({ id: n.id, name: n.text, status: n.sale_status, checked: false })
                    }
                })
            }
        }
        $scope.checkOne = function (list, item) {
            if (list && list.length) {
                list.forEach(function (n) { n.checked = false });
            }
            item.checked = !item.checked;
        }
        $scope.nextStep = function () {
            if ($scope.curTabIndex == 1) {
                var selectHouse = $scope.houseList.find(function (d) {
                    return d.checked
                });
                if (!selectHouse) {
                    alert("请选择一个房间！")
                    return
                }
                $.extend($scope.selHouse, selectHouse)

            }
            $scope.find(1)//查询客户列表
            if ($scope.curTabIndex == 2) {
                $scope.selCustomer = $scope.pageModel.data.find(function (d) {
                    return d.checked
                });
                if (!$scope.selCustomer) {
                    alert("请选择一个客户！")
                    return
                }
            }
            $scope.curTabIndex++
            if ($scope.curTabIndex == 3) {
                //查询房间信息
                $http.post("/ovu-park/backstage/sale/saleparkhouse/getHouseById", { houseId: $scope.selHouse.id }, fac.postConfig).success(function (resp) {
                    if (resp.code == 0) {
                        $scope.houseInfo = resp.data;
                        $scope.houseInfo.houseName=$scope.houseInfo.park_name+'/'+$scope.houseInfo.stage_name+'/'+$scope.houseInfo.build_name+'/'+$scope.houseInfo.unit_name+'单元/'+$scope.houseInfo.floor_name+'层/'+$scope.houseInfo.house_code
                        $scope.houseInfo.areaStatusName = $filter('toAreaStatus')($scope.houseInfo.area_status);
                        $scope.signInfo.housePrice = parseFloat($scope.houseInfo.standardHouseTotalPriceNew);
                        $scope.signInfo.standardPrice = $scope.houseInfo.standardHouseTotalPriceNew
                        $scope.signInfo.amountTax = parseFloat($scope.houseInfo.agreementPrice) - parseFloat($scope.houseInfo.agreementPriceTax)
                        $scope.signInfo.taxRate = $scope.houseInfo.standardTaxRate;
                        $scope.signInfo.paymentType = 0
                        $scope.signInfo.haveMergeContract=0
                        $scope.signInfo.priceType=0
                        $scope.resetDiscount()
                        $scope.calculateMoney()
                    } else {
                        alert(resp.msg);
                    }
                });
                fac.loadSelect($scope, "DECORATION_STANDARD")  //装修
            }
        }

        //重置折扣
        $scope.resetDiscount = function () {
            if ($scope.signInfo.paymentType == 0) {
                $scope.signInfo.discount = 100
            } else {
                $scope.signInfo.discount = $scope.houseInfo.salePaymentMethodList.find(function (h) { return h.id == $scope.signInfo.paymentType }).discount
            }
        }

        //根据房间总价重新计算套内成交单价和建筑成交单价
        $scope.calculateMoney = function () {
            if($scope.houseInfo.area&&$scope.houseInfo.area!==0){
                if($scope.signInfo.housePrice){
                    $scope.signInfo.buildingDealUnit = ($scope.signInfo.housePrice / (parseFloat($scope.houseInfo.area))).toFixed(2)//建筑面积
                }else{
                    $scope.signInfo.buildingDealUni=''
                }
            }
            if($scope.houseInfo.area_su&&$scope.houseInfo.area_su!==0){
                if($scope.signInfo.housePrice){
                    $scope.signInfo.insetDealUnit = ($scope.signInfo.housePrice / (parseFloat($scope.houseInfo.area_su))).toFixed(2)//套内面积
                }else{
                    $scope.signInfo.insetDealUnit=''
                }
            }
            
        }

        //根据装修单价计算装修总价
        $scope.calDecoratePrice = function () {
            $scope.signInfo.decorateTotalPrice = ($scope.signInfo.decorateUnitPrice * (parseFloat($scope.houseInfo.area))).toFixed(2)
        }
        
        //根据协议总价计算税额和总价（不含税）
        $scope.calTaxRate = function () {
            $scope.signInfo.amountTax=''
            $scope.signInfo.agreementPrice=''
            if($scope.signInfo.agreementPriceTax&&$scope.signInfo.taxRate){
                // $scope.signInfo.amountTax =( $scope.signInfo.agreementPriceTax * (parseFloat($scope.signInfo.taxRate))/100).toFixed(2)
                // $scope.signInfo.agreementPrice =( $scope.signInfo.agreementPriceTax -$scope.signInfo.amountTax).toFixed(2)
                $scope.signInfo.agreementPrice = parseFloat(($scope.signInfo.agreementPriceTax/(1*1 + ($scope.signInfo.taxRate/100))).toFixed(2))
                $scope.signInfo.amountTax =parseFloat(($scope.signInfo.agreementPriceTax - $scope.signInfo.agreementPrice).toFixed(2))
            }
        }

        //新增客户
        $scope.addCustomer = function () {
            $scope.showCustomerModal = false
            var modal = $uibModal.open({
                animation: false,
                size: 'lg',
                templateUrl: '/view/investmentSystem/transactionManage/subscriptionManage/modal.addCustomer.html',
                controller: 'addCustomerCtrls',
                resolve: { customerNum: $scope.addcustomerNum }
            });
            modal.result.then(function (isAdd) {
                $scope.showCustomerModal = true
                if (isAdd) {
                    $scope.addcustomerNum++;
                    $scope.find(1)
                }
            }, function () {
                $uibModalInstance.dismiss('cancel');
            });
            let aa = $scope.saleCertificateTypeList
        };
        //签约
        var toSignModal = function () {
            var modal = $uibModal.open({
                animation: false,
                size: 'lg',
                templateUrl: '/view/investmentSystem/transactionManage/subscriptionManage/modal.signDetail.html',
                controller: 'signDetailCtrl',
                resolve: { data: { customeId: $scope.selCustomer.id, customeName: $scope.selCustomer.name, phone: $scope.selCustomer.phone, } }
            });
            modal.result.then(function () {

            }, function () {
                console.info('Modal dismissed at: ' + new Date());
            });
            modal.rendered.then(function () {
                $uibModalInstance.close();
                console.log("Modal rendered");
            });
        };
        // 保存
        $scope.save = function (form,type) {
            form.$setSubmitted(true);
            if (!form.$valid) {
                return false;
            }
            var agreementPriceTax=$scope.signInfo.agreementPriceTax* $scope.signInfo.discount/100
            if($scope.houseInfo.minHouseTotalPriceNew>agreementPriceTax){
                alert("协议总价*折扣不能低于底价！")
                return 
            }
            var housePrice=$scope.signInfo.housePrice* $scope.signInfo.discount/100
            if($scope.houseInfo.minHouseTotalPriceNew>housePrice){
                alert("房间总价*折扣不能低于底价！")
                return 
            }
            $scope.signInfo.customeId=$scope.selCustomer.id
            $scope.signInfo.houseId=$scope.selHouse.id;
            $scope.signInfo.buildingUnit=$scope.houseInfo.standardAreaUnitPriceNew
            $scope.signInfo.insetUnit=$scope.houseInfo.standardAreaSuUnitPriceNew
            if(type){
                $http.post("/ovu-park/backstage/subscription/add", $scope.signInfo, fac.postConfig).success(function (resp) {
                    if (resp.code == 0) {
                        window.msg("新增成功！");
                    } else {
                        alert(resp.msg);
                    }
                    $uibModalInstance.close();
                });
            }else{
                $http.post("/ovu-park/backstage/subscription/add", $scope.signInfo, fac.postConfig).success(function (resp) {
                    if (resp.code == 0) {
                        window.msg("新增成功！");
                    } else {
                        alert(resp.msg);
                    }
                });
            }
          
        }
        // 取消
        $scope.cancel = function () {
            $uibModalInstance.close();
        }
    });
     //选择业务员弹框
     app.controller('chooseManager', function ($scope, $rootScope, $http, $uibModalInstance, $uibModal, $filter, fac) {
        $scope.pageModel={}
        $scope.search={
            parkId:'',
            name:'',
            phone:''
        }
        $scope.managerList=[]
        $scope.$watch('project.id', function (projectId, oldValue) {
            if (projectId) {
                $scope.search.parkId = '';
                $scope.search.parkId = app.park.parkId
                $scope.search.parkId = $rootScope.project.parkId;
                $rootScope.project.stageId && ($scope.search.stageId = $rootScope.project.stageId)
                $rootScope.project.buildId && ($scope.search.buildId = $rootScope.project.buildId)
                $scope.find(1)
            }
        })
        // $scope.find = function (pageNo) {
        //     $.extend($scope.search, {
        //         currentPage: pageNo || $scope.pageModel.currentPage || 1,
        //         pageSize: $scope.pageModel.pageSize || 10
        //     });
        //     fac.getPageResult("/ovu-park/backstage/contract/listPage", $scope.search, function (data) {
        //         $scope.pageModel = data;
        //     });
        // };
        //业务员查询接口
        $scope.find=function(pageNo){
            $.extend($scope.search, {
                currentPage: pageNo || $scope.pageModel.currentPage || 1,
                pageSize: 10
            });
            // if(!$scope.search.name){
            //     $scope.search.name=null
            // }
            // if($scope.search.phone){
            //     $scope.search.phone=null
            // }
            $scope.search.pageIndex=$scope.search.currentPage-1
            $scope.search.totalCount=$scope.pageModel.totalCount || 0
            fac.getPageResult('/ovu-crm/backstage/investment/agentInfo/agentList',$scope.search,function(data){
                    console.log('/////',data)
                    $scope.pageModel=data
                    $scope.pageModel.data.forEach(v=>{
                        v.checked=false
                    })
                    console.log('...........',$scope.pageModel)
                // }else{
                    // alert(data.msg);
                // }
            })
            // $http.get(`/ovu-crm/backstage/investment/agentInfo/agentList?parkId=${$scope.search.parkId}&name=${$scope.search.name}&phone=${$scope.search.phone}&currentPage=${$scope.search.currentPage}&pageSize=${$scope.search.pageSize}&pageIndex=${$scope.search.pageIndex}&totalCount=${$scope.search.totalCount}`).success(function (resp) {
            //     if (resp.code == 0) {
            //         $scope.managerList=resp.data
            //         $scope.managerList.data.forEach(v=>{
            //             v.checked=false
            //         })
            //         console.log('...........',$scope.managerList)
            //         // window.msg(resp.msg);
            //         // $uibModalInstance.close();
            //     } else {
            //         alert(resp.msg);
            //     }
    
    
            // })
        }
        $rootScope.checkOne = function (item) {
            let isOneChecked=false
            if(item.checked==false){
                $scope.pageModel.data.forEach(v=>{
                    if(v.checked){
                        v.checked=false
                    }
                })
                item.checked=true
            }else{
                item.checked=false
            }
            
        }
        $scope.chooseSure=function(){
            $scope.pageModel.data.forEach(v=>{
                if(v.checked){
                    let data={'name':v.name,'id':v.id}
                    $uibModalInstance.close(data);
                }
            })
            // $uibModalInstance.dismiss('cancle');
        }


        // 取消
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancle');
        }
    });
    //新增客户
    app.controller('addCustomerCtrls', function ($scope, $rootScope, $http, $uibModalInstance, fac, $filter, customerNum) {
        $scope.customerNum = customerNum;
        $scope.dictionary={}
        $scope.industryList=[]
        $scope.customerInfo = {
            parkId:$rootScope.project.parkId,
            type:2
        }
          //获取下拉框字典
          $http.post('/ovu-base/system/dictionary/get').success(function(resp){
            if(resp.code == 0){
                console.log('获取意向级别',resp)
                $scope.dictionary=resp.data
            }else{
                
            }
        });
        //行业下拉数据
        $http.post('/ovu-base/ovupark/backstage/industry/queryIndustryTwoLevelList').success(function(resp){
            if(resp.code == 0){
                console.log('行业下拉数据',resp)
                $scope.industryList=resp.data
                console.log('$scope.industryList',$scope.industryList)
            }else{
                
            }
        });
        //意向项目
        $http.post(`/ovu-park/backstage/sale/saleparkhouse/getStageIdByParkId?parkId=${$rootScope.project.parkId}`).success(function(resp){
            console.log('获取意向项目接口------',resp)
            if(resp.code == 0){
                console.log('行业下拉数据',resp)
                $scope.projectSelectList=resp.data
                console.log($scope.projectSelectList,'======')
            }else{
                
            }
        });
        $scope.fatherIndustryChange=function(item){//item model的id
            $scope.industryList.forEach(i=>{
                if(i.industryCode==item){
                    $scope.sonList=i.node
                    console.log('$scope.sonList',$scope.sonList)
                }
            })  
        }
          $scope.radioChange=function(i){
            if(i==1){//个人
                console.log('选择的个人')
            }else if(i==2){//企业
                console.log('选择的企业')
            }
        }
        $scope.phoneBlur=function(val){
            console.log('手机输入框失去焦点事件',val)
            if(val&&val.length>10){
                $.post("/ovu-crm/backstage/crmCustomer/manage/checkPhoneNum",{phone:val,parkId:$rootScope.project.parkId},function(resp){
                    if(resp.code == 0 && resp.data.status==1){
                        layer.confirm(`${resp.data.prompt}`,{ title:''})
                    }else{
                         
                    }
                });
            }
            
        }
        fac.loadSelect($scope, "CERTIFICATE_TYPE")  //证件类型
        // 保存
        $scope.save = function (form) {
            form.$setSubmitted(true);
            if (!form.$valid) {
                return false;
            }
            $http.post("/ovu-crm/backstage/crmCustomer/manage/save", $scope.customerInfo).success( function (resp) {
                if (resp.code == 0) {
                    window.msg("新增成功！");
                } else {
                    window.alert(resp.msg);
                }
                $uibModalInstance.close(true)
            });

        }
        $scope.beforeStep = function () {
            $uibModalInstance.close(false)
        }
        // 取消
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        }
    });
    app.controller('signDetailCtrl', function ($scope, $rootScope, $http, $uibModalInstance, $uibModal, $filter, fac, data) {
        $scope.item = data;
        $scope.userName = app.user.id;
        $scope.subsInfo = {}
        $scope.isSubscription = true;
        fac.loadSelect($scope, "DECORATION_STANDARD")  //装修
        $http.get("/ovu-park/backstage/subscription/selectBySubscriptionId?subscriptionId=" + $scope.item.id).success(function (resp) {
            if (resp.code == 0) {
                $scope.subsInfo = resp.data
            } else {
                alert(resp.msg)
            }
        })
        //资料审核
        $scope.dataExamine = function () {
            layer.confirm("是否通过本协议的资料审核？", { btn: ['是', '否'] }, function () {
                $http.get("/ovu-park/backstage/subscription/verifyMeterial?subscriptionId=" + $scope.item.id + "&verifyPerson=" + $scope.userName).success(function (resp) {
                    if (resp.code == 0) {
                        window.msg(resp.msg);
                        $uibModalInstance.close();
                    } else {
                        alert(resp.msg);
                    }
                })
            });
        }
        $scope.toSign = function () {
            layer.confirm("是否转签约？", { btn: ['是', '否'] }, function () {
                $http.get("/ovu-park/backstage/subscription/rollOutContract?subscriptionId=" + $scope.item.id + "&orderStatusChangePerson=" + $scope.userName).success(function (resp) {
                    if (resp.code == 0) {
                        window.msg(resp.msg);
                        $uibModalInstance.close();
                    } else {
                        alert(resp.msg);
                    }
                    
                })
            });
        }
        $scope.receiveMoney = function (houseId,cusName) {
            $http.post("/ovu-park/backstage/sale/finance/findInfo", { 'houseId': houseId }, fac.postConfig).success(function (resp) {
                if (resp.code == 0) {
                    if (resp.data.id) {
                        var modal = $uibModal.open({
                            animation: false,
                            size: 'lg',
                            templateUrl: '/view/investmentSystem/financeManage/modal.receiveMoney.html',
                            controller: 'receiveMoneyCtrl',
                            resolve: { sfcData: { isEdit: true,name:cusName, id: resp.data.id } }
                        });
                        modal.result.then(function () {

                        }, function () {
                            console.info('Modal dismissed at: ' + new Date());
                        });
                    }
                } else {
                    alert(resp.msg)
                }
            });
        }
        // 取消
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancle');
        }
    });
    app.controller('showCustomerCtrl', function ($scope, $rootScope, $http, $uibModalInstance, $filter, fac, customerObj) {
        $scope.curIndex = 1;
        $scope.contactList = []
        $scope.dictionary={}
        $scope.industryList=[]
        $scope.customerInfo = {
            id:customerObj?customerObj.id:'',
            type:2
            // isHighTech: "0",
            // isListed: "0"
        }

         //获取下拉框字典
         $http.post('/ovu-base/system/dictionary/get').success(function(resp){
            if(resp.code == 0){
                console.log('获取意向级别',resp)
                $scope.dictionary=resp.data
            }else{
                
            }
        });
        //行业下拉数据
        $http.post('/ovu-base/ovupark/backstage/industry/queryIndustryTwoLevelList').success(function(resp){
            if(resp.code == 0){
                console.log('行业下拉数据',resp)
                $scope.industryList=resp.data
                console.log('$scope.industryList',$scope.industryList)
            }else{
                
            }
        });
        //意向项目
        $http.post(`/ovu-park/backstage/sale/saleparkhouse/getStageIdByParkId?parkId=${$rootScope.project.parkId}`).success(function(resp){
            console.log('获取意向项目接口------',resp)
            if(resp.code == 0){
                console.log('行业下拉数据',resp)
                $scope.projectSelectList=resp.data
                console.log($scope.projectSelectList,'======')
            }else{
                
            }
        });
        $scope.fatherIndustryChange=function(item){//item model的id
            $scope.industryList.forEach(i=>{
                if(i.industryCode==item){
                    $scope.sonList=i.node
                    console.log('$scope.sonList',$scope.sonList)
                }
            })  
        }
        var initData = function () {
            if ($scope.customerInfo.id) {//编辑
                console.log('编辑----------')
                //根据id查询详情
                let param = {id:$scope.customerInfo.id};
                console.log('param',param)
                $http.get(`/ovu-crm/backstage/crmCustomer/manage/queryByPrimaryKey/${$scope.customerInfo.id}`).success(function(resp){
                    console.log('根据id查询详情',resp)
                    if(resp.code == 0){
                        
                        $scope.customerInfo = resp.data
                        console.log('$scope.customerInfo',$scope.customerInfo)
                        $scope.customerInfo.registeredCapital=$scope.customerInfo.registeredCapital?$scope.customerInfo.registeredCapital/10000:''
                        $scope.contactList = $scope.customerInfo.contactList?$scope.customerInfo.contactList:[];
                        $scope.customerInfo.isHighTech=$scope.customerInfo.isHighTech==''?'0':$scope.customerInfo.isHighTech
                        $scope.customerInfo.isListed=$scope.customerInfo.isListed==''?'0':$scope.customerInfo.isListed
                        let len = $scope.contactList.length;
                        for (var i = 0; i < 5 - len; i++) {
                            $scope.contactList.push({})
                        }
                    }else{
                        window.alert(resp.msg);
                    }
                });
                //根据id查询修改记录
                //http://localhost/ovu-base/system/log/list
                $scope.pageModel = {};
                
                $scope.findLog = function (pageNo) {
                    let key = ",\\\"id\\\":" + $scope.customerInfo.id + ",";
                    let logParams = {subSystem: "LST003003",
                                     params: key}
                    $.extend(logParams, { currentPage: pageNo || $scope.pageModel.currentPage || 1, pageSize: $scope.pageModel.pageSize || 10 });
                    fac.getPageResult("/ovu-base/system/log/list",logParams, function (data) {
                        $scope.pageModel = data;
                    });
                };
                $scope.findLog(1);
            } else {//新增
                console.log('新增----------')
               
                for (var i = 0; i < 5; i++) {
                    $scope.contactList.push({})
                }
               
                
            }
        }
        initData()
      
        $scope.radioChange=function(i){
            if(i==1){//个人
                console.log('选择的个人')
            }else if(i==2){//企业
                console.log('选择的企业')
            }
        }
        //手机号相同校验
        $scope.phoneBlur=function(val){
            console.log('手机输入框失去焦点事件',val)
            if(val&&val.length>10){
                $.post("/ovu-crm/backstage/crmCustomer/manage/checkPhoneNum",{phone:val,parkId:$rootScope.project.parkId},function(resp){
                    if(resp.code == 0 && resp.data.status==1){
                        layer.confirm(`${resp.data.prompt}`,{ title:''},function(){
                            $scope.customerInfo.phone=''
                        })
                    }else{
                         
                    }
                });
            }
            
        }
        // 保存
        $scope.save = function (form,param,type) {
            form.$setSubmitted(true);
            if (!form.$valid) {
                return false;
            }
            //var param=angular.copy($scope.customerInfo)
            let contactList =[];
            $scope.contactList.forEach(v => {
                  if(v.contactName){
                    delete v.$$hashKey;
                    contactList.push(v);
                  }
            });
            delete param.sex;
            delete param.birthDate;
            param.contactList=[];
            param.parkId=$rootScope.project.parkId;
            // param.contactListStr = JSON.stringify(contactList);
            if($scope.customerInfo.id){//编辑
                $.post("/ovu-park/backstage/sale/person/edit",param,function(resp){
                    if(resp.code == 0){
                    	window.msg("修改成功！");
                    	if(type){
                    	    $uibModalInstance.close();
                        }
                    }else{
                        window.alert(resp.msg); 
                    }
                });

            }else{//新增
                delete param.id;
                $http.post("/ovu-crm/backstage/crmCustomer/manage/save",param).success(function(resp){
                    if(resp.code == 0){
                    	window.msg("新增成功！");
                        $scope.customerInfo.id = resp.data;
                        param.id = resp.data;
                        if(type){
                            $uibModalInstance.close();
                        }
                    }else{
                        window.alert(resp.msg); 
                    }
                });

            }
        }

        // 取消
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        }
    


    });
    // //收款
    // app.controller('receiveMoneyCtrl', function ($scope, $rootScope, $http, $uibModalInstance, $filter) {
    //     // 保存
    //     $scope.save = function () {
    //         $uibModalInstance.close()
    //     }
    //     $scope.examine = function () {
    //         layer.confirm("是否通过审核？", { btn: ['是', '否'] }, function () {
    //             // $http.post("/ovu-pcos/pcos/message/delete.do",{id:ids.join()},fac.postConfig).success(function(resp){
    //             //     if(resp.success){
    //             //        
    //             //     }else{
    //             //         alert('删除失败');
    //             //     }
    //             // })
    //         });
    //     }

    //     // 取消
    //     $scope.cancel = function () {
    //         $uibModalInstance.dismiss('cancel');
    //     }
    // });

})();
