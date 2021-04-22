(function () {
    var app = angular.module("angularApp");
    // 企业
    app.controller('companyInfoIndexCtrl', function ($scope, $rootScope, $state, $q, $http, $filter, $uibModal, fac) {
        document.title = "OVU-企业信息";
        var vm = $scope.vm = this;
        angular.extend($rootScope, fac.dicts);
        $scope.search = {
            parkId: ''
        };
        $rootScope.houseIdTypes = {};
        $scope.pageModel = {};
        fac.loadSelect($scope, "ENTERPRISE_NATURE");
        /* fac.loadSelect($scope, "INDUSTRY");*/
        $scope.find = function (pageNo) {
            if (!$scope.search.parkId) {
                alert("请选择项目关联的部门")
                $scope.pageModel = {};
                return
            }

            $.extend($scope.search, {
                currentPage: pageNo || $scope.pageModel.currentPage || 1,
                pageSize: $scope.pageModel.pageSize || 10
            });
            $scope.search.pageIndex = $scope.search.currentPage - 1;
            $scope.search.totalCount = $scope.pageModel.totalCount || 0;
            if ($scope.searchAllowed) {
                $scope.search.allowed = parseInt($scope.searchAllowed);
            }
            fac.getPageResult("/ovu-base/ovupark/backstage/customer/listCompanyByGrid", $scope.search, function (resp) {
                $scope.pageModel = resp;
            });
        };

        // 页面初始化
        app.modulePromiss.then(function () {
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

                }
            })
        })

        //下载空白模板
        $scope.downComTmpl = function () {
            if (!$scope.search.parkId) {
                alert("请选择项目关联的部门")
                $scope.pageModel = {};
                return
            }
            window.open("/ovupark/企业信息模板.xls")
        }

        //导入企业
        $scope.uploadCompany = function () {
            if (!$scope.search.parkId) {
                alert("请选择项目关联的部门")
                $scope.pageModel = {};
                return
            }
            fac.upload({
                url: "/ovu-base/ovupark/backstage/customer/uploadExcel",
                params: {
                    parkId: $scope.dept.parkId
                },
                accept: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
            }, function (resp) {
                if (resp.code === 0) {
                    window.msg(resp.msg);
                    $scope.find();
                } else {
                    window.alert(resp.msg);
                }
            })
        }

        //获取一级行业类型
        $scope.parentIndustryList = function () {
            $http.post("/ovu-base/ovupark/web/industry/queryIndustryList", {
                grade: 0
            }, fac.postConfig).success(function (resp) {
                if (resp.code == 0) {
                    $scope.parentIndustryList = resp.data;
                }
            });
        };
        //获取一级行业下对应父行业的行业类型列表
        $scope.getIndustryList = function () {
            if (fac.isEmpty($scope.search.parentIndustryCode)) {
                $('.childSelect').removeClass('selectInvalid');
                $scope.search.industryCode = '';
                $scope.industryList = [];
            } else {
                $http.post("/ovu-base/ovupark/web/industry/queryIndustryByParentCode", {
                    parentCode: $scope.search.parentIndustryCode
                }, fac.postConfig).success(function (resp) {
                    if (resp.code == 0) {
                        $scope.search.industryCode = '';
                        $scope.industryList = resp.data;
                    }
                });
            }
        };
        //先加在一级行业列表，当一级行业选取的时候，触发二级行业的选择
        $scope.parentIndustryList();

        //加载二级行业列表,作为列表回显使用
        $http.post("/ovu-base/ovupark/web/industry/queryIndustryList", {
            grade: 1
        }, fac.postConfig).success(function (resp) {
            if (resp.code == 0) {
                $scope.secondIndustryList = resp.data;
            }
        });

        //获取行业名称
        $scope.getIndustryName = function (industryCode) {
            var industryName = "--";
            angular.forEach($scope.secondIndustryList, function (industryObj) {
                if (industryCode == industryObj.industryCode) {
                    industryName = industryObj.industryName;
                }
            });
            return industryName;
        };

        // init
        // app.modulePromiss.then(function() {
        //     fac.initPage($scope,function(){
        //     	$scope.find(1);
        //     })
        // });

        //新增/编辑企业
        vm.showEditModal = function (company) {
            if (!fac.checkPark($scope)) {
                return
            }
            $scope.search.parkId = $scope.dept.parkId;
            // if(!company){
            //     company.companyType = '1'
            // }
            var copy = {
                'company': angular.extend({}, company),
                "companyTypeList": $scope.companyTypeList
            };
            var modal = $uibModal.open({
                animation: false,
                size: 'lg',
                templateUrl: '/view/customerMgmt/companyInfo/modal.editEnterprise.html',
                controller: 'editCompanyModalCtrl',
                resolve: {
                    params: copy
                }
            });
            modal.result.then(function () {
                $scope.find(1);
            }, function () {
                console.info('Modal dismissed at: ' + new Date());
            });
        };
        //查看员工信息
        vm.showStaffInfo = function (item) {
            var copy = angular.extend({}, item);
            var modal = $uibModal.open({
                animation: false,
                size: 'lg',
                windowClass:'company-modal',
                templateUrl: '/view/customerMgmt/companyInfo/modal.staffInfo.html',
                controller: 'company_staffCtrl',
                resolve: {
                    account: copy
                }
            });
            modal.result.then(function () {
                $scope.find();
            }, function () {
                console.info('Modal dismissed at: ' + new Date());
            });
        };

        //初始化 解绑
        vm.showAccountAssign = function (company, operateType) {
            if (!fac.checkPark($scope)) {
                return
            }
            $scope.search.parkId = $scope.dept.parkId;
            var copy = angular.extend({}, company);
            copy.operateType = operateType;
            if (copy.operateType == 'init') {
                copy.title = "账号初始化";
            } else if (copy.operateType == 'unbind') {
                copy.title = "账号解绑";
            }
            copy.parkId = $scope.dept.parkId;
            var modal = $uibModal.open({
                animation: false,
                size: "sm",
                templateUrl: '/view/customerMgmt/companyInfo/modal.accountAssign.html',
                controller: 'accountAssignCtrl',
                resolve: {
                    company: copy
                }
            });
            modal.result.then(function () {
                $scope.find();
            }, function () {
                console.info('Modal dismissed at: ' + new Date());
            });
        };

        // 查询
        
        vm.query = function (pageNo) {
            if (fac.isNotEmpty($scope.search.parentIndustryCode) && fac.isEmpty($scope.search.industryCode)) {
                $('.childSelect').addClass('selectInvalid');
            } else {
                $('.childSelect').removeClass('selectInvalid');
                fac.initPage($scope, function () {
                    $scope.find(1);
                })
            }
        };
    });
    //查看员工
    app.controller('company_staffCtrl', function ($scope, $rootScope, $http, $uibModalInstance, $uibModal, fac, account) {
        $scope.account = account;
        $scope.pageModel = {};
        var param = {
            "id": $scope.account.id
        };

        //查询
        $scope.find = function (pageNo) {
            $.extend(param, {
                currentPage: pageNo || $scope.pageModel.currentPage || 1,
                pageSize: $scope.pageModel.pageSize || 10
            });
            param.pageIndex = param.currentPage - 1;
            param.totalCount = $scope.pageModel.totalCount || 0;
            fac.getPageResult("/ovu-base/ovupark/backstage/companyStuff/listStaffAccountInfoByGrid", param, function (data) {
                $scope.pageModel = data;
            });
        };

        if ($scope.account && $scope.account.id) {
            $scope.find(1);
        }


        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };

    });
    app.controller('accountAssignCtrl', function ($scope, $rootScope, $http, $uibModalInstance, $uibModal, $filter, fac, company) {
        var vm = $scope.vm = this;
        $scope.item = company;
        $scope.mobileStatus = false;
        //账号解绑
        vm.unbindAccount = function (account) {
            var param = {
                "id": account.id
            };
            confirm("一旦解绑，该企业关联账号的所有数据将丢失，且数据不可恢复，是否确认解绑?", function () {
                $.post('/ovu-base/ovupark/backstage/customer/unbundlingAccount', param, fac.postConfig).then(function (resp) {
                    if (resp.code == 0) {
                        msg(resp.message);
                        $uibModalInstance.close();
                    } else {
                        alert(resp.message);
                    }
                });
            });
        };
        $scope.$watch("item.mobile", function (newValue, oldValue) {
            $scope.mobileStatus = false;
            if (!/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/.test(newValue) && !/^0?(13[0-9]|14[5-9]|15[012356789]|166|17[0135678]|18[0-9]|19[89])[0-9]{8}$/.test(newValue)) {
                $scope.mobileStatus = true;
            }
        })
        //账号初始化
        $scope.initAccount = function (form, account) {
            form.$setSubmitted(true);
            if (!form.$valid) {
                return;
            }
            if (!account.isVirtual) {
                account.isVirtual = "0";
            }
            if ($scope.mobileStatus) {
                alert("登录账号为常用邮箱或是手机号码,请正确输入!");
                return;
            }
            var param = {
                "id": account.id,
                "loginName": account.mobile,
                isVirtual: account.isVirtual
            };
            $.post('/ovu-base/ovupark/backstage/customer/initAccountBefore', param, fac.postConfig).then(function (resp) {
                if (resp.code != -1) {
                    if (resp.data == 1) {
                        confirm("该登录账号是已存在的个人账号，是否继续进行角色转换?", function () {
                            $http.post("/ovu-base/ovupark/backstage/customer/initAccount", param, fac.postConfig).success(function (resp) {
                                if (resp.code == 0) {
                                    msg(resp.message);
                                    $uibModalInstance.close();
                                } else {
                                    alert(resp.message);
                                }
                            })
                        });
                    } else if (resp.data == 0) {
                        $http.post("/ovu-base/ovupark/backstage/customer/initAccount", param, fac.postConfig).success(function (resp) {
                            if (resp.code == 0) {
                                msg(resp.message);
                                $uibModalInstance.close();
                            } else {
                                alert(resp.message);
                            }
                        })
                    } else if (resp.data == 2) {
                        alert(resp.message);
                    }
                } else {
                    alert(resp.message)
                }
            });
        };
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
            $scope.item.mobile = '';
        };
    });
    app.controller('editCompanyModalCtrl', function ($scope, $rootScope, $http, $uibModalInstance, $uibModal, $filter, fac, params) {
        $scope.item = params.company;
        $scope.item.companyType = $scope.item.companyType ? $scope.item.companyType.toString() : '1';
        $scope.item.isChild = $scope.item.isChild ? $scope.item.isChild + '' : '0';
        /*$scope.industryList = params.industryList;*/
        $scope.companyTypeList = params.companyTypeList;
        $scope.uniformSocialCreditCodeCopy = angular.copy($scope.item.uniformSocialCreditCode) 
        
        
        $scope.url = "/ovu-crm/backstage/crmCustomer/manage/investCustomerQueryByPage";
        $scope.style = "width:200%;max-height:500px;min-height:200px;";
        $scope.search = {
            haveAccounts: 0,
            name: $scope.item.companyName,
            type: 2
        }
        
        $scope.checkName = function (params) {
            $scope.item.companyName = params.name || "";
            if(params.type === "check") {
                $scope.item.linkman = params.contactMan || "";
                $scope.item.mobile = params.phone || "";
                $scope.item.nameId = params.id || "";
            }
        }

        var seperator = ",,";
        var brandLimit = 3;

       $scope.jobDic = [
            [2, '董事长'],
            [1, '总经理'],
            [5, '副总经理'],
            [6, '法人'],
            [7, '股东'],
            [8, '主任'],
            [3, '经理'],
            [4, '职员']
        ],

        //企业类型切换
        $scope.changeComType = function(type){
            switch(type){
                case '1':
                $scope.item.uniformSocialCreditCode = $scope.uniformSocialCreditCodeCopy ? $scope.uniformSocialCreditCodeCopy : ''
                break;
                case '2':
                $scope.item.uniformSocialCreditCode = '000000000000000000';
                break;
                case '3':
                $scope.item.uniformSocialCreditCode = '111111111111111111';
                break;
                case '4':
                $scope.item.uniformSocialCreditCode = '222222222222222222';
                break;
            }

        }

        //获取企业规模
        $scope.getCompanySizeList = function () {
            $http.post("/ovu-base/system/dictionary/get?item=ENTERPRISE_SIZE", fac.postConfig).success(function (resp) {
                if (resp.code == 0) {
                    $scope.companySizeList = resp.data;
                }
            });
        };

        //获取一级行业类型
        $scope.parentIndustryList = function () {
            $http.post("/ovu-base/ovupark/web/industry/queryIndustryList", {
                grade: 0
            }, fac.postConfig).success(function (resp) {
                if (resp.code == 0) {
                    $scope.parentIndustryList = resp.data;
                }
            });
        };
        //获取一级行业下对应父行业的行业类型列表
        $scope.getIndustryList = function (type) {
            if (fac.isEmpty($scope.item.parentIndustryCode)) {
                $scope.item.industryCode = '';
                $scope.industryList = [];
            } else {
                $http.post("/ovu-base/ovupark/web/industry/queryIndustryByParentCode", {
                    parentCode: $scope.item.parentIndustryCode
                }, fac.postConfig).success(function (resp) {
                    if (resp.code == 0) {
                        $scope.industryList = resp.data;
                        if (type == 'select') {
                            $scope.item.industryCode = '';
                        }
                    }
                });
            }

        };
        //获取单个行业
        $scope.getIndusty = function () {
            $http.post("/ovu-base/ovupark/web/industry/queryIndustryByCode", {
                industryCode: $scope.item.industryCode
            }, fac.postConfig).success(function (resp) {
                if (resp.code == 0) {
                    $scope.item.parentIndustryCode = resp.data.parentCode;
                    $scope.getIndustryList();
                }
            });
        };

        //查询出父级行业列表
        $scope.parentIndustryList();
        //获取父行业，以作回显
        if ($scope.item.industryCode) {
            $scope.getIndusty();
        }
        //获取品牌logo的list $scope.brandLogoList
        var getBrandLogoList = function () {
            var tempBrandList = [];
            var tempBrandLogoList = [];
            $scope.brandLogoList = [{
                'brand': '',
                'brandLogo': ''
            }];
            if (!fac.isEmpty($scope.item.brand)) {
                $scope.brandLogoList = [];
                if (!fac.isEmpty($scope.item.brand)) {
                    tempBrandList = $scope.item.brand.split(seperator);
                }
                if (!fac.isEmpty($scope.item.brandLogo)) {
                    tempBrandLogoList = $scope.item.brandLogo.split(seperator);
                }
                for (var i = 0; i < tempBrandList.length; i++) {
                    $scope.brandLogoList.push({
                        'brand': tempBrandList[i],
                        'brandLogo': tempBrandLogoList[i]
                    });
                }
            }
        };
        getBrandLogoList();
        //添加删除brand brandLogo
        $scope.addBrand = function () {
            if ($scope.brandLogoList.length < brandLimit) {
                $scope.brandLogoList.push({
                    'brand': '',
                    'brandLogo': ''
                });
            }
        };

        $scope.deleteBrand = function (index) {
            var tempList = [];
            for (var i = 0; i < $scope.brandLogoList.length; i++) {
                if (i != index) {
                    tempList.push($scope.brandLogoList[i]);
                }
            }
            $scope.brandLogoList = tempList;
        };
        if ($scope.item.moneyType) {
            $scope.item.moneyType = $scope.item.moneyType + "";
        }
        if ($scope.item.status) {
            $scope.item.status = $scope.item.status + "";
        }
        if ($scope.item.city) {
            company.city = $scope.item.city + "";
        }
        if ($scope.item.job) {
            $scope.item.job = $scope.item.job + "";
        }
        if ($scope.item.regAddrType) {
            $scope.item.regAddrType = $scope.item.regAddrType + "";
        }
        if ($scope.item.enterpriseNatureCode) {
            $scope.item.enterpriseNatureCode = $scope.item.enterpriseNatureCode + "";
        }
        if ($scope.item.enterpriseSizeCode) {
            $scope.item.SIZE = $scope.item.enterpriseSizeCode + "";
        }
        if ($scope.item.industryCode) {
            $scope.item.industryCode = $scope.item.industryCode + "";
        }
        // if ($scope.item.regAddrDomain) {
        //     $scope.item.regAddrDomain = $scope.item.regAddrDomain + "";
        // }
        if ($scope.item.enterStatus) {
            $scope.item.enterStatus = $scope.item.enterStatus + "";
        }
        if ($scope.item.isckx) {
            $scope.item.isckx = $scope.item.isckx + "";
        }
        if ($scope.item.changeues) {
            $scope.item.changeues = $scope.item.changeues + "";
        }
        if ($scope.item.beListed) {
            $scope.item.beListed = $scope.item.beListed + "";
        }
        if ($scope.item.operationStatus) {
            $scope.item.operationStatus = $scope.item.operationStatus + "";
        }
        if ($scope.item.operatingClassCode) {
            $scope.item.operatingClassCode = $scope.item.operatingClassCode + "";
        }
        if ($scope.item.listedPlate) {
            $scope.item.listedPlate = $scope.item.listedPlate + "";
        }
        if (!$scope.item.moneyType) {
            $scope.item.moneyType = 1;
        }
        if ($scope.item.siteOwnership) {
            $scope.item.siteOwnership = $scope.item.siteOwnership + "";
        }
        var getStageList = function () {
            $http.post("/ovu-base/system/park/stageList", {
                parkId: $scope.dept.parkId
            }, fac.postConfig).success(function (resp) {
                if (resp.code == 0) {
                    $scope.stageList = resp.data;
                }
            });
        };
        var getBuildList = function () {
            var params = {
                'stageId': $scope.item.stageId
            };
            $http.post("/ovu-base/system/parkBuild/getBuilds", params, fac.postConfig).success(function (data) {
                $scope.buildList = data;
            });
        };
        var getUnitList = function () {
            var params = {
                'buildId': $scope.item.buildId
            };
            $http.post("/ovu-base/system/parkHouse/listUnitNo_mute", params, fac.postConfig).success(function (resp) {
                $scope.unitList = resp.data;
            });
        };
        var getFloorList = function () {
            var params = {
                "buildId": $scope.item.buildId,
                "unitNo": $scope.item.unitNum
            };
            $http.post("/ovu-base/system/parkHouse/listGroundNo_mute", params, fac.postConfig).success(function (resp) {
                if (resp.code == 0) {
                    $scope.floorList = resp.data;
                }
            });
        };
        var getHouseList = function () {
            var params = {
                "buildId": $scope.item.buildId,
                "unitNo": $scope.item.unitNum,
                'groundNo': $scope.item.floorNum
            };
            $http.post("/ovu-base/system/parkHouse/getHouses", params, fac.postConfig).success(function (resp) {
                if (resp.code == 0) {
                    $scope.houseList = resp.data;
                }
            });
        };

        //分期，楼栋，楼层三级联动
        $scope.findAllStage = function () {
            if ($scope.item.regAddrType == 1) {
                $scope.loadStage();
            } else if ($scope.item.regAddrType == 2) {
                //获取园区外的区域列表
                $http.post("/ovu-base/ovupark/backstage/customer/getCityDistricts", {
                    parkId: $scope.dept.parkId
                }, fac.postConfig).success(function (resp) {
                    if (resp.code == 0) {
                        $scope.itemDomain = resp.data;
                    }
                });
            }
        };

        //根据parkId获得分期列表
        $scope.loadStage = function () {
            $http.post("/ovu-base/system/park/stageList", {
                parkId: $scope.dept.parkId
            }, fac.postConfig).success(function (resp) {
                if (resp.code == 0) {
                    $scope.stageList = resp.data;
                    $scope.buildList = [];
                    $scope.unitList = [];
                    $scope.floorList = [];
                    $scope.houseList = [];
                }
            });
        };
        //根据stageId获得楼栋信息
        $scope.selectStage = function () {
            var params = {
                'stageId': $scope.item.stageId
            };
            $http.post("/ovu-base/system/parkBuild/getBuilds", params, fac.postConfig).success(function (data) {
                $scope.buildList = data;
                $scope.unitList = [];
                $scope.floorList = [];
                $scope.houseList = [];
                $scope.item.buildId = '';
                $scope.item.unitNum = '';
                $scope.item.floorNum = '';
                $scope.item.houseId = '';
            });
        };


        //根据buildId获得单元信息
        $scope.selectBuild = function () {
            var params = {
                'buildId': $scope.item.buildId
            };
            $http.post("/ovu-base/system/parkHouse/listUnitNo_mute", params, fac.postConfig).success(function (resp) {
                $scope.unitList = resp.data;
                $scope.floorList = [];
                $scope.houseList = [];
                $scope.item.unitNum = '';
                $scope.item.floorNum = '';
                $scope.item.houseId = '';
            });
        };

        //根据buildId,unitId获取楼层信息
        $scope.selectUnit = function () {
            var params = {
                "buildId": $scope.item.buildId,
                "unitNo": $scope.item.unitNum
            };
            $http.post("/ovu-base/system/parkHouse/listGroundNo_mute", params, fac.postConfig).success(function (resp) {
                if (resp.code == 0) {
                    $scope.floorList = resp.data;
                    $scope.houseList = [];
                    $scope.item.floorNum = '';
                    $scope.item.houseId = '';
                }
            });
        };
        //根据buildId,unitId,groundNo获取楼层信息
        $scope.selectGround = function () {
            var params = {
                "buildId": $scope.item.buildId,
                "unitNo": $scope.item.unitNum,
                'groundNo': $scope.item.floorNum
            };
            $http.post("/ovu-base/system/parkHouse/getHouses", params, fac.postConfig).success(function (resp) {
                if (resp.code == 0) {
                    $scope.houseList = resp.data;
                    $scope.item.houseId = '';
                }
            });
        };

        $scope.backShowSpaceInfo = function () {
            var params = {
                "stageId": $scope.item.stageId,
                "buildId": $scope.item.buildId,
                "groundNo": $scope.item.floorNum,
            };
            $http.post("/ovu-base/system/parkHouse/getCascadeSpaceList", params, fac.postConfig).success(function (resp) {
                if (resp.code) {
                    var backData = resp.data;
                    $scope.stageList = backData.stageList;
                    $scope.builds = backData.buildList;
                    $scope.groundList = backData.groundList;
                    $scope.houseList = backData.houseList;
                }
            });
        };
        if ($scope.item.regAddrType == 1) {
            getStageList();
            getBuildList();
            getUnitList();
            getFloorList();
            getHouseList();
        } else if ($scope.item.regAddrType == 2) {
            $http.post("/ovu-base/ovupark/backstage/customer/getCityDistricts", {
                parkId: $scope.dept.parkId
            }, fac.postConfig).success(function (resp) {
                if (resp.code == 0) {
                    $scope.itemDomain = resp.data;
                }
            });
        }
        $scope.changePhone = function (item) {
            if (item.mobile != undefined) {
                item.phoneChange = true;
            }
        };
    
        //输入
        $scope.changeStaffCount = function () {
            let val = $scope.item.staffCount * 1
            console.log("val", val)
            if (val >= 0 && val < 50) {
                // console.log("0")
               $scope.item.enterpriseSizeCode = '1'
            } else if (val >= 50 && val < 100) {
                // console.log("1")
                $scope.item.enterpriseSizeCode = '2'
            } else if (val >= 100 && val < 300) {
                // console.log("2")
                $scope.item.enterpriseSizeCode = '3'
            } else if (val >= 300 && val < 500) {
                // console.log("3")
                $scope.item.enterpriseSizeCode = '4'
            } else if (val >= 500 && val < 1000) {
                // console.log("4")
                $scope.item.enterpriseSizeCode = '5'
            } else if (val >= 1000 && val < 5000) {
                // console.log("5")
                $scope.item.enterpriseSizeCode = '6'
            } else if (val >= 5000 && val < 10000) {
                // console.log("6")
                $scope.item.enterpriseSizeCode = '7'
            } else if (val >= 10000) {
                // console.log("7")
                $scope.item.enterpriseSizeCode = '8'
            }else{
                alert('输入人数错误')
            }
        }


        $scope.checkEmployeeNum = function (item) {
            if (item.staffCount && item.enterpriseSizeCode) {
                switch (item.enterpriseSizeCode) {
                    case "0":
                        if (item.staffCount > 0) {
                            window.alert("请填写跟人数相匹配的员工人数!");
                            return false;
                        }
                        return true;
                        break;
                    case "1":
                        if (item.staffCount > 50) {
                            window.alert("请填写跟人数相匹配的员工人数!");
                            return false;
                        }
                        return true;
                        break;
                    case "2":
                        if (item.staffCount < 50 || item.staffCount > 100) {
                            window.alert("请填写跟人数相匹配的员工人数!");
                            return false;
                        }
                        return true;
                        break;
                    case "3":
                        if (item.staffCount < 100 || item.staffCount > 300) {
                            window.alert("请填写跟人数相匹配的员工人数!");
                            return false;
                        }
                        return true;
                        break;
                    case "4":
                        if (item.staffCount < 300 || item.staffCount > 500) {
                            window.alert("请填写跟人数相匹配的员工人数!");
                            return false;
                        }
                        return true;
                        break;
                    case "5":
                        if (item.staffCount < 500 || item.staffCount > 1000) {
                            window.alert("请填写跟人数相匹配的员工人数!");
                            return false;
                        }
                        return true;
                        break;
                    case "6":
                        if (item.staffCount < 1000 || item.staffCount > 5000) {
                            window.alert("请填写跟人数相匹配的员工人数!");
                            return false;
                        }
                        return true;
                        break;
                    case "7":
                        if (item.staffCount < 5000 || item.staffCount > 10000) {
                            window.alert("请填写跟人数相匹配的员工人数!");
                            return false;
                        }
                        return true;
                        break;
                    case "8":
                        if (item.staffCount < 10000) {
                            window.alert("请填写跟人数相匹配的员工人数!");
                            return false;
                        }
                        return true;
                        break;
                }
            } else {
                return true;
            }
        };
        var checkBrandExist = function (brandLogoList) {
            var isValid = true;
            angular.forEach(brandLogoList, function (obj) {
                if (fac.isEmpty(obj.brand) && fac.isNotEmpty(obj.brandLogo)) {
                    isValid = false;
                }
            });
            return isValid;
        };
        $scope.save = function (form, item) {
            debugger;
            form.$setSubmitted(true);
            // 根据保存的注册地址删减传参数  1:园区内 2：园区外
            if ($scope.item.regAddrType == '1') {
                // delete item.regAddrDomain;
                delete item.corporateRegAddr;
            } else {
                delete item.stageId;
                delete item.buildId;
                delete item.unitNum;
                delete item.floorNum;
                delete item.houseId;
            }
            if (item.regCapital > 99999999999) {
                alert("注册资本最大位数为11位！");
                return;
            }
            if (!form.$valid) {
                return;
            }
            //判断企业品牌和品牌logo，不能单独上传品牌logo，而没有品牌名称
            if (!checkBrandExist($scope.brandLogoList)) {
                alert("品牌logo和品牌名称必须一起出现!");
                return;
            }
            if (!$scope.checkEmployeeNum(item)) {
                return false;
            }
            var tempBrand = [];
            var tempBrandLogo = [];
            for (var i = 0; i < $scope.brandLogoList.length; i++) {
                if (!fac.isEmpty($scope.brandLogoList[i].brand)) {
                    tempBrand.push($scope.brandLogoList[i].brand);
                    tempBrandLogo.push(fac.isEmpty($scope.brandLogoList[i].brandLogo) ? "noImage" : $scope.brandLogoList[i].brandLogo);
                }
                $scope.item.brand = tempBrand.join(seperator);
                $scope.item.brandLogo = tempBrandLogo.join(seperator);
            }
            var params = angular.copy(item);
            params.parkId = $scope.dept.parkId;
            $http.post("/ovu-base/ovupark/backstage/customer/save", params, fac.postConfig).success(function (resp) {
                if (resp.code == 0) {
                    if($scope.item.nameId) {
                        $http.post("/ovu-crm/backstage/crmCustomer/manage/bindUserInfo",{id: $scope.item.nameId, parkUserId:resp.data}).success(function(response) {
                            if(response.code == 0) {
                                window.msg("操作成功!");
                                $uibModalInstance.close();
                            }
                        })
                    } else {
                        window.msg("操作成功!");
                        $uibModalInstance.close();
                    }
                } else {
                    alert(resp.message);
                }
            });
        };
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    });
    app.directive('ngEnter', function () {
        return function (scope, element, attrs) {
            element.bind("keydown keypress", function (event) {
                if (event.which === 13) {
                    scope.$apply(function () {
                        scope.$eval(attrs.ngEnter);
                    });
                    event.preventDefault();
                }
            });
        };
    });
    
    // 个人
    app.controller('personInfoIndexCtrl', function ($scope, $rootScope, $state, $q, $http, $filter, $uibModal, fac) {
        document.title = "OVU-用户信息";
        angular.extend($rootScope, fac.dicts);
        var vm = $scope.vm = this;
        $scope.search = {
            userType:'1'
        };
        $scope.pageModel = {};
         // 查询列表
         $scope.find = function (pageNo) {
            $.extend($scope.search, {
                currentPage: pageNo || $scope.pageModel.currentPage || 1,
                pageSize: $scope.pageModel.pageSize || 10
            });
            $scope.search.pageIndex = $scope.search.currentPage - 1;
            $scope.search.totalCount = $scope.pageModel.totalCount || 0;
            fac.getPageResult("/ovu-base/ovupark/backstage/customerUser/personInfoPage", $scope.search, function (data) {
                $scope.pageModel = data;
            });
        }

        //新增 、 编辑
        $scope.addAccount = function (item) {
            var modal = $uibModal.open({
                animation: true,
                size: 'md',
                templateUrl: '/view/customerMgmt/companyInfo/model.addAccount.html',
                controller: 'addAccountCtrl',
                resolve: {
                    param: item
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

        // 初始化
        vm.personAccountAssign = function (company, operateType) {
            if (!fac.checkPark($scope)) {
                return
            }
            $scope.search.parkId = $scope.dept.parkId;
            var copy = angular.extend({}, company);
            copy.operateType = operateType;
            if (copy.operateType == 'init') {
                copy.title = "账号初始化";
            } else if (copy.operateType == 'unbind') {
                copy.title = "账号解绑";
            }
            copy.parkId = $scope.dept.parkId;
            var modal = $uibModal.open({
                animation: false,
                size: "sm",
                templateUrl: '/view/customerMgmt/companyInfo/modal.personAccountAssign.html',
                controller: 'personAccountAssign',
                resolve: {
                    company: copy
                }
            });
            modal.result.then(function () {
                $scope.find();
            }, function () {
                console.info('Modal dismissed at: ' + new Date());
            });
        };

        vm.query = function () {
            if(!fac.checkPark($scope)){
        		return
        	}else{
        		$scope.find(1);
        	}
        };

         // 页面初始化
         app.modulePromiss.then(function () {
            fac.initPage($scope, function () {
                $scope.find(1);
            })
        });
    });
    // 个人初始化
    app.controller('personAccountAssign', function ($scope, $rootScope, $http, $uibModalInstance, $uibModal, $filter, fac, company) {
        var vm = $scope.vm = this;
        $scope.item = company;
        //账号解绑
        vm.unbindAccount = function (account) {
            var param = {
                "id": account.id
            };
            confirm("一旦解绑，该企业关联账号的所有数据将丢失，且数据不可恢复，是否确认解绑?", function () {
                $.post('/ovu-base/ovupark/backstage/customer/unbundlingAccount', param, fac.postConfig).then(function (resp) {
                    if (resp.code == 0) {
                        msg(resp.message);
                        $uibModalInstance.close();
                    } else {
                        alert(resp.message);
                    }
                });
            });
        };
        //账号初始化
        $scope.initAccount = function (form, account) {
            form.$setSubmitted(true);
            if (!form.$valid) {
                return;
            }
            if (!account.isVirtual) {
                account.isVirtual = "0";
            }
            if (!/^(1[34578]\d{9})$/.test(account.phone)) {
                window.alert("登录账号为常用手机号码，请正确输入！");
                return;
            }
            var param = {
                loginName: account.phone,
                personId: account.id,
                isVirtual: account.isVirtual
            };
            $.post('/ovu-base/ovupark/backstage/customerUser/editUser', param, fac.postConfig).then(function (resp) {
                if (resp.code == 0) {
                    $http.post("/ovu-crm/backstage/crmCustomer/manage/bindUserInfo",{parkUserId:resp.data}).success(function(response) {
                        if(response.code == 0) {
                            msg("保存成功");
                            $uibModalInstance.close();
                        } else {
                            alert(resp.msg);
                        }
                    })
                } else {
                    alert(resp.message)
                }
            });
        };
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
            $scope.item.mobile = '';
        };
    });
    //新增编辑个人账号
    app.controller('addAccountCtrl', function ($scope, $rootScope, $http, $uibModalInstance, $uibModal, fac,param) {
        console.log(app.park)
        $scope.url = "/ovu-crm/backstage/crmCustomer/manage/investCustomerQueryByPage";
        $scope.style = "width:200%;max-height:500px;min-height:200px;";
        $scope.item =  {};
        angular.copy(param,$scope.item)
        $scope.search = {
            haveAccounts: 0,
            name: $scope.item.name,
            type: 1
        }
        $scope.checkName = function (params) {
            $scope.item.name = params.name || "";
            if(params.type === "check") {
                $scope.item.phone = params.phone || "";
                $scope.item.nameId = params.id || "";
            }
        }
        $scope.save = function (form, item){
            form.$setSubmitted(true);
            if (!form.$valid) {
                return;
            }
            let params = {'phone':item.phone,'name':item.name};
            if(item.id) {
                params = {'id':item.id,'name':item.name,'phone':item.phone};
            }
            $http.post("/ovu-base/ovupark/backstage/customerUser/savePerson", params, fac.postConfig).success(function(resp){
                if(resp.code == 0){
                    if($scope.item.nameId) {
                        $http.post("/ovu-crm/backstage/crmCustomer/manage/bindUserInfo",{id: $scope.item.nameId, parkUserId:resp.data}).success(function(response) {
                            if(response.code == 0) {
                                msg("保存成功");
                                $uibModalInstance.close();
                            } else {
                                alert(resp.msg);
                            }
                        })
                    } else {
                        msg("保存成功");
                        $uibModalInstance.close();
                    }
                }else{
                    alert(resp.msg);
                }
            });

        }
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    });
})();
