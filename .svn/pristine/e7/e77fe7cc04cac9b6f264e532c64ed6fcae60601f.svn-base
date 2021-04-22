(function () {
    var app = angular.module("angularApp");
    app.controller('contractManageCtrl', function ($scope, $rootScope, $http, $filter, $uibModal, fac) {
        document.title = "合同管理";
        app.modulePromiss.then(function () {
            $scope.search = {
                haveEffective:'1'
            };
            $scope.selCount = 0;
            $scope.pageModel = {};
            var width = $(window).width() - 300
            $('#table_cont').width(width)
            $scope.$watch('project.id', function (projectId, oldValue) {
                if (projectId) {
                    $scope.search.parkId = '';
                    $scope.search.stageId = '';
                    $scope.search.buildId = ''
                    $scope.search.parkId = $rootScope.project.parkId;
                    $rootScope.project.stageId && ($scope.search.stageId = $rootScope.project.stageId)
                    $rootScope.project.buildId && ($scope.search.buildId = $rootScope.project.buildId)
                    $scope.find(1)
                }
            })

        });

        $rootScope.checkAll = function () {
            $scope.pageModel.checked = !$scope.pageModel.checked;
            $scope.pageModel.list.forEach(function (n) {
                n.checked = $scope.pageModel.checked
            });
            $scope.selCount = ($scope.pageModel.checked ? $scope.pageModel.list.length : 0)
        }
        $rootScope.checkOne = function (item) {
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
            $.extend($scope.search, {
                currentPage: pageNo || $scope.pageModel.currentPage || 1,
                pageSize: $scope.pageModel.pageSize || 10
            });
            fac.getPageResult("/ovu-park/backstage/contract/listPage", $scope.search, function (data) {
                $scope.pageModel = data;
            });
        };
        //批量作废
        $scope.batchCancelContract = function () {
            var houseIds = []
            confirm("确认批量作废选中的合同?", function () {
                $scope.pageModel.data.forEach(function (n) {
                    if (n.checked) {
                        houseIds.push(n.houseId)
                    }
                });

                $http.post("/ovu-park/backstage/contract/batchCancelContract", {
                    houseIds: houseIds.join(","),
                    personId: app.user.id
                }, fac.postConfig).success(function (resp) {
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
        $scope.cancelContract = function (id) {
            confirm("确认要作废该合同?", function () {
                $http.post("/ovu-park/backstage/contract/cancelContractOrder", {
                    contractId: id
                }, fac.postConfig).success(function (resp) {
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

        //新增合同选择房间
        $scope.addContract = function (id) {
            var modal = $uibModal.open({
                animation: false,
                size: 'lg',
                templateUrl: '/view/investmentSystem/transactionManage/contractManage/modal.addContract.html',
                controller: 'addContractCtrl',
                resolve: {
                    param: {
                        'id': id
                    }
                }
            });
            modal.result.then(function () {
                $scope.find();
            }, function () {
                console.info('Modal dismissed at: ' + new Date());
            });
        };
        //新增or编辑合同
        $scope.showContractDetail = function (item) {
            if (item.contractType == 2 || item.contractType == 5) { //待提交或是已驳回和再次编辑
                var modal1 = $uibModal.open({
                    animation: false,
                    size: 'lg',
                    templateUrl: '/view/investmentSystem/transactionManage/contractManage/modal.showContract.html',
                    controller: 'showContractCtrl',
                    resolve: {
                        data: function () {
                            return angular.extend({},item)
                        }
                    }
                });
                modal1.result.then(function () {
                    $scope.find();
                }, function () {
                    console.info('Modal dismissed at: ' + new Date());
                });

            } else { //审批中和已签约不能编辑
                var modal2 = $uibModal.open({
                    animation: false,
                    size: 'md',
                    templateUrl: '/view/investmentSystem/financeManage/modal.contractDetail.html',
                    controller: 'contractDataCtrl',
                    resolve: {
                        data: {
                            id: item.id
                        }
                    }
                });
                modal2.result.then(function () {
                    $scope.find();
                }, function () {
                    console.info('Modal dismissed at: ' + new Date());
                });

            }

        }


    });

    //新增合同选择房间
    app.controller('addContractCtrl', function ($scope, $rootScope, $http, $uibModalInstance, $uibModal, $filter, fac) {
        $scope.config = {
            edit: false,
            showCheckbox: false
        }
        console.log('新增合同页面-----------')
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
        $scope.curTabIndex = 1;
        //新增客户的数量
        $scope.addcustomerNum = 1;
        // $scope.pageModel = {};
        $scope.selCustomer = {};
        $scope.selHouse = {}
        $scope.parkList = [] //项目
        var curSelNodeId = ""

        app.modulePromiss.then(function () {
            $scope.search = {};
            $scope.selCount = 0;
            $scope.pageModel = {};
            // $scope.isSync=true
            // $scope.checkSyncBtn()
            $scope.$watch('project.id', function (projectId, oldValue) {
                if (projectId) {
                    $scope.search.parkId = ""
                    $scope.search.stage_id = ""
                    $scope.search.build_id = ""
                    $scope.search.parkId = $rootScope.project.parkId;
                    $rootScope.project.stageId && ($scope.search.stage_id = $rootScope.project.stageId);
                    $rootScope.project.buildId && ($scope.search.build_id = $rootScope.project.buildId);
                    $scope.find(1)
                }
            })

        });

        ////新增客户的时候需要隐藏客户列表
        $scope.showModal = true;
        $scope.find = function (pageNo) {
            $.extend($scope.search, {
                currentPage: pageNo || $scope.pageModel.currentPage || 1,
                pageSize: $scope.pageModel.pageSize || 10
            });
            $scope.search.haveAccounts=1
            fac.getPageResult("/ovu-crm/backstage/crmCustomer/manage/investCustomerQueryByPage", $scope.search, function (data) {
                console.log('新增合同列表查询',data)
                $scope.pageModel = data;
            });
        };
        $rootScope.projectTree.forEach(function (node) {
            $scope.parkList.push({
                "id": node.id,
                "parkName": node.parkName
            })
        })
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
            $scope.stageTree = [] //分期楼栋
            $scope.unitList = [] //单元
            $scope.floorList = [] //楼层
            $scope.houseList = [] //房间
            curSelNodeId = ""
            $http.post("/ovu-park/backstage/sale/saleparkhouse/tree", {
                park_id: parkId,
                sale_status: 1
            }, fac.postConfig).success(function (resp) {
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
                        $scope.floorList.push({
                            id: n.id,
                            name: n.text,
                            status: n.sale_status,
                            checked: false
                        })
                    }
                })

            } else if (title == '房间') {
                $scope.checkOne($scope.floorList, node)
                $scope.flatTreeData.forEach(function (n) {
                    if (n.type == title && n.parentId == node.id) {
                        $scope.houseList.push({
                            id: n.id,
                            name: n.text,
                            status: n.sale_status,
                            checked: false
                        })
                    }
                })
            }
        }
        $scope.selectNode = function (node) {
            if (curSelNodeId) { //重置上次选中
                var lastSelNode = $scope.flatTreeData.find(function (obj) {
                    return obj.id == curSelNodeId
                })
                lastSelNode.state.selected = false;
                lastSelNode.state.highLight = false;
            }
            node.state = node.state || {};
            node.state.selected = true;
            node.state.highLight = true;
            curSelNodeId = node.id
            $scope.unitList = [] //单元
            $scope.floorList = [] //楼层
            $scope.houseList = [] //房间
            if (node.build_id) {
                $scope.flatTreeData.forEach(function (n) {
                    if (n.type == '单元' && n.parentId == node.id) {
                        $scope.unitList.push({
                            id: n.id,
                            name: n.text,
                            status: n.sale_status,
                            checked: false
                        })
                    }
                })
            }
        }
        $scope.checkOne = function (list, item) {
            console.log("点击项目的时候",item)
            sessionStorage.setItem('addContractId',item.id)

            if (list && list.length) {
                list.forEach(function (n) {
                    n.checked = false
                });
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
            $scope.find(1) //查询客户列表
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
            if ($scope.curTabIndex == 3) { //弹窗合同窗口,并关闭当前弹窗
                var modal = $uibModal.open({
                    animation: false,
                    size: 'lg',
                    templateUrl: '/view/investmentSystem/transactionManage/contractManage/modal.showContract.html',
                    controller: 'showContractCtrl',
                    resolve: {
                        data: {
                            customName: $scope.selCustomer.name,
                            customPhone: $scope.selCustomer.phone,
                            customeId: $scope.selCustomer.id,
                            houseId: $scope.selHouse.id
                        }
                    }
                });
                modal.result.then(function () {
                    $uibModalInstance.close();
                }, function () {
                    $scope.cancel();
                    console.info('Modal dismissed at: ' + new Date());
                });
                modal.rendered.then(function () {
                    //$uibModalInstance.close();
                    console.log("Modal rendered");
                });
                modal.opened.then(function () {
                    console.log("Modal opened");
                });
            }

        }
        //新增客户
        $scope.addCustomer = function (id) {
            $scope.showModal = false
            var modal = $uibModal.open({
                animation: false,
                size: 'lg',
                templateUrl: '/view/investmentSystem/transactionManage/subscriptionManage/modal.addCustomer.html',
                controller: 'addCustomerCtrlc',
                resolve: {
                    customerNum: $scope.addcustomerNum
                }
            });
            modal.result.then(function (isAdd) {
                $scope.showModal = true
                if (isAdd) {
                    $scope.addcustomerNum++;
                    $scope.find(1)
                }
            }, function () {
                $uibModalInstance.dismiss('cancel');
                console.info('Modal dismissed at: ' + new Date());
            });
        };

        // 取消
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        }
    });
    //新增/编辑合同
    app.controller('showContractCtrl', function ($scope, $rootScope, $http, $uibModalInstance, $uibModal, $filter, fac, data) {
        $scope.item = data
        $scope.userid = app.user.id;
        $scope.isEdit = data.id ? true : false
        $scope.contactInfo = {};
        $scope.dloanInfo = {}

        fac.loadSelect($scope, "DECORATION_STANDARD") //装修  
        fac.loadSelect($scope, "FUND_BANK") //公积金银行 
        fac.loadSelect($scope, "MORTGAGE_BANK") //贷款银行
        fac.loadSelect($scope, "BANLANCE_PLAN") //装修方案    
        $http.post("/ovu-park/backstage/sale/saleparkhouse/getHouseById", {
            houseId: $scope.item.houseId
        }, fac.postConfig).success(function (resp) {
            if (resp.code == 0) {
                $scope.houseInfo = resp.data;
                if ($scope.isEdit) {
                    $http.post("/ovu-park/backstage/contract/selectById", {
                        contractId: $scope.item.id
                    }, fac.postConfig).success(function (resp) {
                        if (resp.code == 0) {
                            $scope.contactInfo = resp.data;
                            $scope.contactInfo.paymentType = parseInt($scope.contactInfo.paymentType)
                            // $scope.dloanInfo.isMortgageBank = $scope.contactInfo.mortgageBank ? 1 : 0
                            // $scope.dloanInfo.isProvidentFund = $scope.contactInfo.fundBank ? 1 : 0
                            $scope.contactInfo.area_statusStr = $filter('toAreaStatus')($scope.houseInfo.area_status)
                            $scope.contactInfo.mortgageYear && ($scope.contactInfo.mortgageYear = parseInt($scope.contactInfo.mortgageYear))
                            $scope.contactInfo.fundYear && ($scope.contactInfo.fundYear = parseInt($scope.contactInfo.fundYear))
                            $scope.contactInfo.contractFilingNo = $scope.contactInfo.contractFilingNo ? $scope.contactInfo.contractFilingNo : $scope.houseInfo.record_number
                            $scope.isShowVerify = $scope.contactInfo.signContractNo ? true : false
                            $scope.resetDiscount();
                        } else {
                            alert(resp.msg);
                        }
                    })
                } else {
                    $scope.contactInfo = {
                        customName: $scope.item.customName,
                        customPhone: $scope.item.customPhone,
                        customeId: sessionStorage.getItem('addContractId'),
                        house_name: $scope.houseInfo.park_name + '/' + $scope.houseInfo.stage_name + '/' + $scope.houseInfo.build_name + '/' + $scope.houseInfo.unit_name + '单元/' + $scope.houseInfo.floor_name + '层/' + $scope.houseInfo.house_code,
                        houseId: $scope.item.houseId,
                        house_structure: $scope.houseInfo.house_structure,
                        area_statusStr: $filter('toAreaStatus')($scope.houseInfo.area_status),
                        area: $scope.houseInfo.area,
                        area_su: $scope.houseInfo.area_su,
                        buildingUnit: $scope.houseInfo.standardAreaUnitPriceNew,
                        insetUnit: $scope.houseInfo.standardAreaSuUnitPriceNew,
                        standardPrice: $scope.houseInfo.standardHouseTotalPriceNew,
                        taxRate: $scope.houseInfo.taxRate,
                        paymentType: 0,
                        housePrice: parseFloat($scope.houseInfo.standardHouseTotalPriceNew),
                        haveMergeContract: 0,
                        priceType: 0,
                        contractFilingNo: $scope.houseInfo.record_number,
                        referencesPerson:$scope.item.investCollaborator,
                        referencesPersonId:$scope.item.investCollaboratorId,
                        businessManager:$scope.item.operator,
                        businessManagerId:$scope.item.operatorId
                    }
                    $scope.resetDiscount();
                    $scope.calculateMoney();
                }
            } else {
                alert(resp.msg);
            }
        })
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
                $scope.contactInfo.businessManager=data.name
                $scope.contactInfo.businessManagerId=data.id
                // $scope.find();
            }, function () {
                console.info('Modal dismissed at: ' + new Date());
            });
        }
        //重置折扣
        $scope.resetDiscount = function () {
            if ($scope.contactInfo.paymentType == 0) {
                $scope.contactInfo.discount = 100;
                $scope.dloanInfo.isMortgageBank = 0;
                $scope.dloanInfo.isProvidentFund = 0;
                $scope.contactInfo.mortgageBank = "";
                $scope.contactInfo.mortgageMoney = "";
                $scope.contactInfo.mortgageYear = "";
                $scope.contactInfo.fundBank = "";
                $scope.contactInfo.fundMoney = "";
                $scope.contactInfo.fundYear = "";
            } else {
                $scope.dloanInfo = $scope.houseInfo.salePaymentMethodList.find(function (h) {
                    return h.id == $scope.contactInfo.paymentType
                })
                $scope.dloanInfo.isMortgageBank = 1;
                $scope.dloanInfo.isProvidentFund = 1;
                $scope.contactInfo.discount = $scope.dloanInfo.discount;
            }

        }
        //根据房间总价重新计算套内成交单价和建筑成交单价
        $scope.calculateMoney = function () {
            if ($scope.houseInfo.area && $scope.houseInfo.area !== 0 && $scope.contactInfo.housePrice) {
                if ($scope.contactInfo.housePrice) {
                    $scope.contactInfo.buildingDealUnit = ($scope.contactInfo.housePrice / (parseFloat($scope.houseInfo.area))).toFixed(2) //建筑面积
                } else {
                    $scope.contactInfo.buildingDealUnit = ''
                }
            }
            if ($scope.houseInfo.area_su && $scope.houseInfo.area_su !== 0) {
                if ($scope.contactInfo.housePrice) {
                    $scope.contactInfo.insetDealUnit = ($scope.contactInfo.housePrice / (parseFloat($scope.houseInfo.area_su))).toFixed(2) //套内面积
                } else {
                    $scope.contactInfo.insetDealUnit = ''
                }

            }

        }
        //根据装修单价计算装修总价
        $scope.calDecoratePrice = function () {
            $scope.contactInfo.decorateTotalPrice = ($scope.contactInfo.decorateUnitPrice * (parseFloat($scope.houseInfo.area))).toFixed(2)
        }

        //根据合同总价计算税额和总价（不含税）
        $scope.calTaxRate = function () {
            $scope.contactInfo.amountTax = ''
            $scope.contactInfo.contractPrice = ''
            if ($scope.contactInfo.contractPriceTax && $scope.contactInfo.taxRate) {
                $scope.contactInfo.contractPrice = parseFloat(($scope.contactInfo.contractPriceTax/(1*1 + ($scope.contactInfo.taxRate/100))).toFixed(2))
                // $scope.contactInfo.amountTax = parseFloat(($scope.contactInfo.contractPriceTax * (parseFloat($scope.contactInfo.taxRate)) / 100).toFixed(2)) 
                $scope.contactInfo.amountTax =parseFloat(($scope.contactInfo.contractPriceTax - $scope.contactInfo.contractPrice).toFixed(2))
            }
        }
        
        //资料审核
        // $scope.dataExamine = function () {
        //     layer.confirm("是否通过本合同的资料审核？", {
        //         btn: ['是', '否']
        //     }, function () {
        //         var param = {
        //             contractId: $scope.item.id,
        //             orderStatusChangePerson: $scope.userid,
        //             reviewedPersonId: $scope.userid
        //         }
        //         $http.post("/ovu-park/backstage/contract/verifyMeterial", param, fac.postConfig).success(function (resp) {
        //             if (resp.code == 0) {
        //                 window.msg(resp.msg);
        //                 $uibModalInstance.close();
        //             } else {
        //                 alert(resp.msg);
        //             }

        //         })
        //     });
        // }
         //合同审批
         $scope.dataExamine = function () {
            layer.confirm("是否提交合同资料？", {
                btn: ['是', '否']
            }, function () {
                var param = {
                    contractId: $scope.item.id,
                    parkId: $rootScope.project.parkId,
                }
                var url = "/ovu-park/backstage/flow/saleContact/commit";
                if($scope.item.contractType == 5) {
                    url = "/ovu-park/backstage/flow/saleContact/reCommit";
                }
                $http.post(url, param, fac.postConfig).success(function (resp) {
                    if (resp.code == 0) {
                        window.msg(resp.msg);
                        $uibModalInstance.close();
                    } else {
                        alert(resp.msg);
                    }

                })
            });
        }
        //重置认购
        $scope.resetSubscri = function () {
            confirm("确定重置认购？", function () {
                var param = {
                    contractId: $scope.item.id,
                    orderStatusChangePerson: $scope.userid
                }
                $http.post("/ovu-park//backstage/contract/resetSubscription", param, fac.postConfig).success(function (resp) {
                    if (resp.code == 0) {
                        window.msg(resp.msg);
                        $uibModalInstance.close();
                    } else {
                        alert(resp.msg);
                    }


                })
            });
        }
        //收款
        $scope.receiveMoney = function (houseId,cusName) {
            $http.post("/ovu-park/backstage/sale/finance/findInfo", {
                'houseId': houseId
            }, fac.postConfig).success(function (resp) {
                if (resp.code == 0) {
                    if (resp.data.id) {
                        var modal = $uibModal.open({
                            animation: false,
                            size: 'lg',
                            templateUrl: '/view/investmentSystem/financeManage/modal.receiveMoney.html',
                            controller: 'receiveMoneyCtrl',
                            resolve: {
                                sfcData: {
                                    isEdit: true,
                                    name: cusName,
                                    id: resp.data.id
                                }
                            }
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
        // 保存
        $scope.save = function (form, type) {
            console.log('保存参数-------', $scope.contactInfo)
            form.$setSubmitted(true);
            if (!form.$valid) {
                return false;
            }
            if ($scope.contactInfo.paymentType != 0) {
                var totalPrice = $scope.contactInfo.mortgageMoney + $scope.contactInfo.fundMoney
                if (totalPrice >= $scope.contactInfo.contractPriceTax) {
                    alert("贷款金额必须小于合同总价")
                    return
                }

            }
            var contractPriceTax = $scope.contactInfo.contractPriceTax * $scope.contactInfo.discount / 100
            if ($scope.houseInfo.minHouseTotalPriceNew > contractPriceTax) {
                alert("合同总价*折扣不能低于底价！")
                return
            }
            var housePrice = $scope.contactInfo.housePrice * $scope.contactInfo.discount / 100
            if ($scope.houseInfo.minHouseTotalPriceNew > housePrice) {
                alert("房间总价*折扣不能低于底价！")
                return
            }
            if ($scope.isEdit) {
                editContract(type)
            } else {
                addContract(type)
            }
        }
        var addContract = function (type) {
            
            if ($scope.isEdit) { ////保存并关闭
                
                $http.post("/ovu-park/backstage/contract/save", $scope.contactInfo, fac.postConfig).success(function (resp) {
                    if (resp.code == 0) {
                        window.msg("保存成功！");
                    } else {
                        alert(resp.msg);
                    }
                });

            } else { //保存

                $http.post("/ovu-park/backstage/contract/save", $scope.contactInfo, fac.postConfig).success(function (resp) {
                    if (resp.code == 0) {
                        window.msg("保存成功！");
                        $uibModalInstance.close();
                    } else {
                        alert(resp.msg);
                    }
                });

            }
        }
        var editContract = function (type) {
            if ($scope.isEdit) { ////保存并关闭
                $http.post("/ovu-park/backstage/contract/update", $scope.contactInfo, fac.postConfig).success(function (resp) {
                    if (resp.code == 0) {
                        window.msg("修改成功！");
                    } else {
                        alert(resp.msg);
                    }
                });

            } else { //保存
                $http.post("/ovu-park/backstage/contract/update", $scope.contactInfo, fac.postConfig).success(function (resp) {
                    if (resp.code == 0) {
                        window.msg("保存成功！");
                        $scope.isShowVerify = true
                    } else {
                        alert(resp.msg);
                    }
                });

            }
        }
        // 取消
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancle');
        }
    });
    //新增客户
    app.controller('addCustomerCtrlc', function ($scope, $rootScope, $http, $uibModalInstance, $filter, customerNum) {
        $scope.customerNum = customerNum;
        $scope.dictionary={}
        $scope.industryList=[]
        $scope.customerInfo = {
            parkId: $rootScope.project.parkId,
            type:2
        }
        console.log('新增认购弹框')
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
        // 保存
        $scope.save = function (form) {
            form.$setSubmitted(true);
            if (!form.$valid) {
                return false;
            }
            $http.post("/ovu-crm/backstage/crmCustomer/manage/save", $scope.customerInfo).success(function (resp) {
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
    //合同详情
    app.controller('contractDataCtrl', function ($scope, $rootScope, $http, $uibModalInstance, $uibModal, $filter, fac, data) {
        $scope.item = data
        $scope.isShowBtn = true
        $scope.isContract = true
        $scope.userid = app.user.id;
        fac.loadSelect($scope, "DECORATION_STANDARD") //装修  
        fac.loadSelect($scope, "FUND_BANK") //公积金银行 
        fac.loadSelect($scope, "MORTGAGE_BANK") //贷款银行
        fac.loadSelect($scope, "BANLANCE_PLAN") //装修方案  
        $http.post("/ovu-park/backstage/contract/selectById", {
            contractId: $scope.item.id
        }, fac.postConfig).success(function (resp) {
            if (resp.code == 0) {
                $scope.contactInfo = resp.data;

            } else {
                alert(resp.msg);
            }
        })
        //重置认购
        $scope.resetSubscri = function () {
            confirm("确定重置认购？", function () {
                var param = {
                    contractId: $scope.item.id,
                    orderStatusChangePerson: $scope.userid
                }
                $http.post("/ovu-park//backstage/contract/resetSubscription", param, fac.postConfig).success(function (resp) {
                    if (resp.code == 0) {
                        window.msg(resp.msg);
                        $uibModalInstance.close();
                    } else {
                        alert(resp.msg);
                    }


                })
            });
        }
        //收款
        $scope.receiveMoney = function (houseId,cusName) {
            $http.post("/ovu-park/backstage/sale/finance/findInfo", {
                'houseId': houseId
            }, fac.postConfig).success(function (resp) {
                if (resp.code == 0) {
                    if (resp.data.id) {
                        var modal = $uibModal.open({
                            animation: false,
                            size: 'lg',
                            templateUrl: '/view/investmentSystem/financeManage/modal.receiveMoney.html',
                            controller: 'receiveMoneyCtrl',
                            resolve: {
                                sfcData: {
                                    isEdit: true,
                                    name:cusName,
                                    id: resp.data.id
                                }
                            }
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
        // 保存
        $scope.save = function () {
            $uibModalInstance.close()
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

})();
