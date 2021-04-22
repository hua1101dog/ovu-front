 (function () {
    var app = angular.module("angularApp");
    app.service('AppService', function ($http, fac) {
        var that = this;
        this.park = {
            parkNo: '',
            parkName: ''
        };
        //项目编号
        this.parkNo = '';
        this.onlyIndoorMap = true;
    });
    //企业
    app.controller('companyCtrl', function ($scope, $rootScope, $http, $filter, $uibModal, fac) {
        document.title = "OVU-企业账号管理";
        angular.extend($rootScope, fac.dicts);
        var vm = $scope.vm = this;
        $scope.search = {
            userType:'2'
        };
        $scope.isVirtuals = [
            [0, "否"],
            [1, "是"]
        ]
        // if (fac.isEmpty($scope.search.userType)) {
        //     $scope.search.userType = '2';
        // }
        $scope.pageModel = {};
        // $rootScope.houseIdTypes = {};
         // 查询列表
         $scope.find = function (pageNo) {
            $.extend($scope.search, {
                currentPage: pageNo || $scope.pageModel.currentPage || 1,
                pageSize: $scope.pageModel.pageSize || 10
            });
            $scope.search.pageIndex = $scope.search.currentPage - 1;
            $scope.search.totalCount = $scope.pageModel.totalCount || 0;
            $scope.search.isVirtual = $scope.search.userType!=2 ? "" : $scope.search.isVirtual ;
            fac.getPageResult("/ovu-base/ovupark/backstage/customerUser/accountManager", $scope.search, function (data) {
                $scope.pageModel = data;
                console.log('$scope.pageModel',$scope.pageModel)
                angular.forEach($scope.pageModel.data, function (obj) {
                    if (obj.parkId == app.park.parkId) {
                        obj.userPermission = obj.userType;
                    } else {
                        obj.userPermission = 1;
                    }
                });
            });
        }

         // 重置(原编辑)
         vm.modify = function (item) {
        	if(!fac.checkPark($scope)){
        		return
        	}
            var copy = angular.extend({}, item);
            copy.parkId = app.park.parkId;
            var modal = $uibModal.open({
                animation: false,
                templateUrl: '/view/customerMgmt/accountManage/modal.editAccount.html',
                controller: 'editAccountCtrl',
                size: 'sm',
                resolve: {account: copy}
            });
            modal.result.then(function () {
                $scope.find();
            }, function () {
                console.info('Modal dismissed at: ' + new Date());
            });
        }

        vm.query = function () {
            if(!fac.checkPark($scope)){
        		return
        	}else{
        		$scope.find(1);
        	}
        };

          // 分配
          vm.showAccountAssign = function (personal) {
        	if(!fac.checkPark($scope)){
        		return
            }
            if (personal.allowed === 1) {
                return;
            }
            var modal = $uibModal.open({
                animation: false,
                templateUrl: '/view/customerMgmt/accountManage/modal.accountAssign.html',
                controller: 'assignPersonalCtrl',
                resolve: {personFac: personal}
            });
            modal.result.then(function () {
                $scope.find();
            }, function () {
                console.info('Modal dismissed at: ' + new Date());
            });
        }

        //查看租户信息
        vm.showRentalInfo = function (item) {
            var copy = angular.extend({}, item);
            var modal = $uibModal.open({
                animation: false,
                size: 'sm',
                templateUrl: '/view/customerMgmt/accountManage/modal.renterInfo.html',
                controller: 'renterInfoCtrl',
                resolve: {account: copy}
            });
            modal.result.then(function () {
                $scope.find();
            }, function () {
                console.info('Modal dismissed at: ' + new Date());
            });
        };

         //冻结解冻账号
         vm.freezeAccount = function (item) {
            let id = item.userType===1?item.id:item.loginId;
            var param = {"id": id};
            $http.post("/ovu-base/ovupark/backstage/customerUser/freezenAccount", param, fac.postConfig).success(function (resp) {
                if(resp.code == 0){
                    $scope.find();
                }else {
                    alert(resp.msg);
                }
            })
        };

         // 页面初始化
         app.modulePromiss.then(function () {
            fac.initPage($scope, function () {
                $scope.find(1);
            })
        });
    });

     //员工
     app.controller('staffCtrl', function ($scope, $rootScope, $http, $filter, $uibModal, fac) {
        document.title = "OVU-企业账号管理";
        angular.extend($rootScope, fac.dicts);
        var vm = $scope.vm = this;
        $scope.search = {
            userType:'3'
        };
        $scope.isVirtuals = [
            [0, "否"],
            [1, "是"]
        ]
        // if (fac.isEmpty($scope.search.userType)) {
        //     $scope.search.userType = '3';
        // }
        $scope.pageModel = {};
        // $rootScope.houseIdTypes = {};
         // 查询列表
         $scope.find = function (pageNo) {
            $.extend($scope.search, {
                currentPage: pageNo || $scope.pageModel.currentPage || 1,
                pageSize: $scope.pageModel.pageSize || 10
            });
            $scope.search.pageIndex = $scope.search.currentPage - 1;
            $scope.search.totalCount = $scope.pageModel.totalCount || 0;
            $scope.search.isVirtual = $scope.search.userType!=2 ? "" : $scope.search.isVirtual ;
            fac.getPageResult("/ovu-base/ovupark/backstage/customerUser/accountManager", $scope.search, function (data) {
                $scope.pageModel = data;
                console.log('$scope.pageModel',$scope.pageModel)
                angular.forEach($scope.pageModel.data, function (obj) {
                    if (obj.parkId == app.park.parkId) {
                        obj.userPermission = obj.userType;
                    } else {
                        obj.userPermission = 1;
                    }
                });
            });
        }

        //员工查看详情
        vm.showDetail = function (account) {
            var copy = angular.extend({}, account);
            var modal = $uibModal.open({
                animation: false,
                size: 'sm',
                templateUrl: '/view/customerMgmt/accountManage/modal.staff.html',
                controller: 'staffDetailCtrl',
                resolve: {account: copy}
            });
            modal.result.then(function () {
                $scope.find();
            }, function () {
                console.info('Modal dismissed at: ' + new Date());
            });
        }

        vm.query = function () {
            if(!fac.checkPark($scope)){
        		return
        	}else{
        		$scope.find(1);
        	}
        };

        //查看租户信息
        vm.showRentalInfo = function (item) {
            var copy = angular.extend({}, item);
            var modal = $uibModal.open({
                animation: false,
                size: 'sm',
                templateUrl: '/view/customerMgmt/accountManage/modal.renterInfo.html',
                controller: 'renterInfoCtrl',
                resolve: {account: copy}
            });
            modal.result.then(function () {
                $scope.find();
            }, function () {
                console.info('Modal dismissed at: ' + new Date());
            });
        };

         // 页面初始化
         app.modulePromiss.then(function () {
            fac.initPage($scope, function () {
                $scope.find(1);
            })
        });
    });

    //个人
    app.controller('personCtrl', function ($scope, $rootScope, $http, $filter, $uibModal, fac) {
        document.title = "OVU-企业账号管理";
        angular.extend($rootScope, fac.dicts);
        var vm = $scope.vm = this;
        $scope.search = {
            userType:'1'
        };
        // $scope.isVirtuals = [
        //     [0, "否"],
        //     [1, "是"]
        // ]
        // if (fac.isEmpty($scope.search.userType)) {
        //     $scope.search.userType = '1';
        // }
        $scope.pageModel = {};
        // $rootScope.houseIdTypes = {};
         // 查询列表
         $scope.find = function (pageNo) {
            $.extend($scope.search, {
                currentPage: pageNo || $scope.pageModel.currentPage || 1,
                pageSize: $scope.pageModel.pageSize || 10
            });
            $scope.search.pageIndex = $scope.search.currentPage - 1;
            $scope.search.totalCount = $scope.pageModel.totalCount || 0;
            // $scope.search.isVirtual = $scope.search.userType!=2 ? "" : $scope.search.isVirtual ;
            fac.getPageResult("/ovu-base/ovupark/backstage/customerUser/accountManager", $scope.search, function (data) {
                $scope.pageModel = data;
                console.log('$scope.pageModel',$scope.pageModel)
                angular.forEach($scope.pageModel.data, function (obj) {
                    if (obj.parkId == app.park.parkId) {
                        obj.userPermission = obj.userType;
                    } else {
                        obj.userPermission = 1;
                    }
                });
            });
        }

        //新增 、 编辑
        $scope.addAccount = function () {
            var modal = $uibModal.open({
                animation: true,
                size: 'md',
                templateUrl: '/view/customerMgmt/accountManage/model.addAccount.html',
                controller: 'addPersonAccountCtrl',
                resolve: {
                    
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

        vm.query = function () {
            if(!fac.checkPark($scope)){
        		return
        	}else{
        		$scope.find(1);
        	}
        };

        // 分配
        $scope.personAssign = function (item) {
            var modal = $uibModal.open({
                animation: true,
                size: 'md',
                templateUrl: '/view/customerMgmt/accountManage/modal.accountAssign.html',
                controller: 'assignPersonalCtrl',
                resolve: {
                    personFac: item
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
        // 重置
        $scope.personModify = function (item) {
        	if(!fac.checkPark($scope)){
        		return
        	}
            var copy = angular.extend({}, item);
            copy.parkId = app.park.parkId;
            var modal = $uibModal.open({
                animation: false,
                templateUrl: '/view/customerMgmt/accountManage/modal.editAccount.html',
                controller: 'editAccountCtrl',
                size: 'sm',
                resolve: {account: copy}
            });
            modal.result.then(function () {
                $scope.find();
            }, function () {
                console.info('Modal dismissed at: ' + new Date());
            });
        }

        //查看租户信息
        vm.showRentalInfo = function (item) {
            var copy = angular.extend({}, item);
            var modal = $uibModal.open({
                animation: false,
                size: 'sm',
                templateUrl: '/view/customerMgmt/accountManage/modal.renterInfo.html',
                controller: 'renterInfoCtrl',
                resolve: {account: copy}
            });
            modal.result.then(function () {
                $scope.find();
            }, function () {
                console.info('Modal dismissed at: ' + new Date());
            });
        };

         //冻结解冻账号
         vm.freezeAccount = function (item) {
            let id = item.userType===1?item.id:item.loginId;
            var param = {"id": id};
            $http.post("/ovu-base/ovupark/backstage/customerUser/freezenAccount", param, fac.postConfig).success(function (resp) {
                if(resp.code == 0){
                    $scope.find();
                }else {
                    alert(resp.msg);
                }
            })
        };

         // 页面初始化
         app.modulePromiss.then(function () {
            fac.initPage($scope, function () {
                $scope.find(1);
            })
        });
    });

    //新增个人账号
    app.controller('addPersonAccountCtrl', function ($scope, $rootScope, $http, $uibModalInstance, $uibModal, fac) {
        var vm = $scope.vm = this;
        $scope.save = function (form, item){
            form.$setSubmitted(true);
            if (!form.$valid) {
                return;
            }
            // if (!item.nickname) {
            //     window.msg("请输入正确的账号!")
            //     return false;
            // }
            // var loginId = item.id;
            // if(item.userType == 2){
            // 	loginId = item.loginId;
            // }
            var params = {'loginName':item.loginName,'personName':item.nickname};
            // fac.getResult('/ovu-base/ovupark/backstage/customerUser/addUser', params, function (resp) {
            //     msg("保存成功");
            //     $uibModalInstance.close();
            // });
            $http.post("/ovu-base/ovupark/backstage/customerUser/addUser", params, fac.postConfig).success(function(resp){
                if(resp.code == 0){
                    msg("保存成功");
                    $uibModalInstance.close();
                }else{
                    alert(resp.msg);
                }
            });

        }
         //重置密码
         vm.resetPWD = function () {
            let curLoginId = 'ovu888888';
            confirm("是否重置密码?", function () {
                var param = {'loginId': curLoginId};
                $http.post("/ovu-base/ovupark/backstage/customerUser/resetPassword", param, fac.postConfig).success(function(resp){
                    if(resp.code == 0){
                    	 msg(resp.message);
                    }else{
                    	 alert(resp.message);
                    }
                });
            });
        }

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    });

    //查看员工详情
    app.controller('staffDetailCtrl', function ($scope, $rootScope, $http, $uibModalInstance, $uibModal, fac, account) {
        //查询
        var getStaffInfo = function () {
            var param = {"ID": account.loginId};
            fac.getResult("/ovu-base/ovupark/backstage/companyStuff/getStaffInfoByAccId", param, function (resp) {
            	$scope.staff = resp;
            })
        }
        getStaffInfo();

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    });

    //分配账号
    app.controller('assignPersonalCtrl', function ($scope, $rootScope, $http, $uibModalInstance, $uibModal, $filter, fac, personFac) {
        $scope.item = personFac;
        var getMyParksteward = function(){
        	var id = '';
        	if($scope.item.userType == 2 ||$scope.item.userType == 3){
        		id = $scope.item.loginId;
        	}else if($scope.item.userType == 1){
        		id = $scope.item.id;
        	}
            var params = { 
                "parkId":app.park.parkId,
                "cusId":id
            }
            $http.post("/ovu-park/backstage/parkSteward/getMyParksteward", params, fac.postConfig).success(function(resp){
            	if(resp.code == 0){
            		var data = resp.data;
            		if(!fac.isEmpty(data)){
            			$scope.item.psId = data.id;
            		}
            	}         
            });  
        }
        var getSpaceList = function () {
        	var id = '';
        	if($scope.item.userType == 1){
        		id = $scope.item.id;
        	}else {
        		id = $scope.item.loginId;
        	}
            var params = { "parkId":app.park.parkId,"id":id}
            $http.post("/ovu-park/backstage/houseBusiness/getAccountSpace", params, fac.postConfig).success(function(resp){
            	if(resp.code == 0){
            		$scope.tenantHouseList = resp.data.tenantHouseList;
            		$scope.ownerHouseList = resp.data.ownerHouseList;
            	}         
            });     
        }
        var getParkStewardList = function () {
            var params = { "parkId":app.park.parkId}
            $http.post("/ovu-park/backstage/parkSteward/getParkStewards", params, fac.postConfig).success(function(resp){
            	if(resp.code == 0){
            		$scope.parkStewardList = resp.data;
            	}         
            });     
        }
        if($scope.item.userType == 2) {
            getSpaceList();
            getParkStewardList();
            getMyParksteward();
        }
        $scope.save = function (form, item) {
            form.$setSubmitted(true);
            if (!form.$valid) {
                if(item.userType == 2) {
                    if (!/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/.test(item.newLoginName)) {
                        window.alert("登录账号为常用邮箱,请正确输入邮箱地址!");
                        return;
                    }
                } else if(item.userType == 1) {
                    if (!/^(1[34578]\d{9})$/.test(item.newLoginName)) {
                        window.alert("登录账号为常用手机号码，请正确输入！");
                        return;
                    }
                }
                window.alert("请完成必填项!");
                return;
            }
            //如果是未分配，那么把状态值改为已分配（做系统分配处理）
           /* if (!item.allowed || item.allowed == 0) {
                $scope.item.allowed = 1;
            }*/
            if(item.userType == 2) {
                if (fac.isEmpty($scope.ownerHouseList) && fac.isEmpty($scope.tenantHouseList)) {
                    window.alert("分配管家必须选择产权空间或者租赁空间！");
                    return false;
                }
            }
            
            let curLoginId = '';
            if (item.userType === 1) {
                curLoginId = item.id;
            } else if (item.userType === 2 || item.userType === 3) {
                curLoginId = item.loginId;
            }
            confirm("是否分配登录账号?", function () {
                let params = {'loginId': curLoginId, 'loginName': item.newLoginName};
                $http.post("/ovu-base/ovupark/backstage/customerUser/resetLoginName", params, fac.postConfig).success(function(resp){
                    if(resp.code == 0){
                        let loginId = '';
                        if(item.userType == 1){
                            loginId = item.id;
                        }else{
                            loginId = item.loginId;
                        }
                        let params = {'loginId':loginId,'psId':item.psId,'parkId':app.park.parkId};
                        $http.post("/ovu-park/backstage/parkSteward/allotForAccount", params, fac.postConfig).success(function(resp){
                            if(resp.code == 0){
                                $uibModalInstance.close();
                                msg("操作成功");
                            }else{
                                alert(resp.msg);
                            }    
                        }); 
                        $http.post("/ovu-crm/backstage/crmCustomer/manage/bindUserInfo", {parkUserId: item.id}).success(function(resp){
                            if(resp.code == 0){
                            }else{
                            }    
                        }); 
                    }else{
                    	 alert(resp.message);
                    }
                });
            });
            
        }
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    });
    //查看租户
    app.controller('renterInfoCtrl', function ($scope, $rootScope, $http, $uibModalInstance, $uibModal, fac, account) {
        $scope.pageModel = {};
        $scope.search = {
            firstPartyId: account.personId,
            firstPartyType: account.userType,
            parkId: app.park.parkId
        };
        //查询
        $scope.find = function (pageNo) {
            $.extend($scope.search, {
                currentPage: pageNo || $scope.pageModel.currentPage || 1,
                pageSize: $scope.pageModel.pageSize || 10
            });
            $scope.search.pageIndex = $scope.search.currentPage - 1;
            $scope.search.totalCount = $scope.pageModel.totalCount || 0;
            fac.getPageResult("/ovu-park/backstage/rental/contract/listEffectTenantsByPage", $scope.search, function (data) {
                $scope.pageModel = data;
                console.info($scope.pageModel.data);
            });
        }

        $scope.find(1);
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    });
    // 重置(弃用)
    app.controller('resetCtrl', function ($scope, $rootScope, $http, $uibModalInstance, $uibModal, fac, account) {
        var vm = $scope.vm = this;
        vm.newNameInput = false;
        $scope.item = account;
        $scope.item.newLoginName = '';
        //重置账号
        $scope.save = function (item) {
            if (!item.newLoginName) {
                if (!/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/.test(item.newLoginName)) {
                    window.alert("新账号为常用邮箱,请正确输入邮箱地址!");
                    return;
                }
                window.alert("请输入新账号!");
                return;
            }
            let curLoginId = '';
            if (item.userType === 1) {
                curLoginId = item.id;
            } else if (item.userType === 2 || item.userType === 3) {
                curLoginId = item.loginId;
            }
            confirm("是否重置登录账号?", function () {
                var params = {'loginId': curLoginId, 'loginName': item.newLoginName};
                $http.post("/ovu-base/ovupark/backstage/customerUser/resetLoginName", params, fac.postConfig).success(function(resp){
                    if(resp.code == 0){
                    	 msg(resp.message);
                    	 $scope.item.loginName = item.newLoginName;
                         vm.newNameInput = false;
                         $uibModalInstance.close();
                    }else{
                    	 alert(resp.message);
                    }
                });
            });
        }

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    });
    //重置(原编辑)
    app.controller('editAccountCtrl', function ($scope, $rootScope, $http, $uibModalInstance, $uibModal, fac, account) {
        var vm = $scope.vm = this;
        vm.newNameInput = false;
        $scope.item = account;
        $scope.item.newLoginName = '';
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
        /*//获取所属行业
        $scope.loadIndustry = function () {
        	 $http.post("/ovu-base/system/dictionary/get?item=INDUSTRY", fac.postConfig).success(function(resp){
                 if(resp.code == 0){
                 	$scope.industryList = resp.data;
                 }
             });
        }*/
      //获取一级行业类型
    	$scope.parentIndustryList = function(){
        	$http.post("/ovu-base/ovupark/web/industry/queryIndustryList",{grade : 0}, fac.postConfig).success(function(resp){
                if(resp.code == 0){
                	$scope.parentIndustryList = resp.data;
                }
            });
        }
    	//获取一级行业下对应父行业的行业类型列表
    	$scope.getIndustryList = function(type){
    		if(fac.isEmpty($scope.item.parentIndustryCode)){
    			$scope.item.industryCode = '';
    			$scope.industryList = [];
    		}else{
    			$http.post("/ovu-base/ovupark/web/industry/queryIndustryByParentCode",
            			{parentCode : $scope.item.parentIndustryCode} ,fac.postConfig).success(function(resp){
                    if(resp.code == 0){
                    	$scope.industryList = resp.data;
                    	if(type == 'select'){
                    		$scope.item.industryCode = '';
                    	}
                    }
                });
    		}
        	
        }
    	//获取单个行业
    	$scope.getIndusty = function(){
        	$http.post("/ovu-base/ovupark/web/industry/queryIndustryByCode",
        			{industryCode : $scope.item.industryCode} ,fac.postConfig).success(function(resp){
                if(resp.code == 0){
                	$scope.item.parentIndustryCode = resp.data.parentCode;
    				$scope.getIndustryList();
                }
            });
        }
        
        if($scope.item.userType == 2) {
            //查询出父级行业列表
            $scope.parentIndustryList();
            //获取父行业，以作回显
            if($scope.item.industryCode){
                $scope.getIndusty();
            }
        }
        
        //重置账号
        vm.resetLoginName = function (item) {
            if (!item.newLoginName) {
                window.alert("请输入新账号!");
                return;
            }
            if(item.userType ==2) {
                if (!/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/.test(item.newLoginName)) {
                    window.alert("新账号为常用邮箱,请正确输入邮箱地址!");
                    return;
                }
            } else if(item.userType == 1) {
                if (!/^(1[34578]\d{9})$/.test(item.newLoginName)) {
                    window.alert("新账号为常用手机号码，请正确输入！");
                    return;
                }
            }
            // console.log(item)
            let curLoginId = '';
            if (item.userType === 1) {
                curLoginId = item.id;
            } else if (item.userType === 2 || item.userType === 3) {
                curLoginId = item.loginId;
            }
            confirm("是否重置登录账号?", function () {
                var params = {'loginId': curLoginId, 'loginName': item.newLoginName};
                $http.post("/ovu-base/ovupark/backstage/customerUser/resetLoginName", params, fac.postConfig).success(function(resp){
                    if(resp.code == 0){
                    	 msg(resp.message);
                    	 $scope.item.loginName = item.newLoginName;
                         vm.newNameInput = false;
                    }else{
                    	 alert(resp.message);
                    }
                });
            });
        }
        //重置联系方式
        vm.resetPhone = function (item) {
            let curLoginId = '';
            if (item.userType === 1) {
                curLoginId = item.id;
            } else if (item.userType === 2 || item.userType === 3) {
                curLoginId = item.loginId;
            }
            confirm("是否重置联系方式?", function () {
                var params = {'loginId': curLoginId, 'phone': item.newPhone};
                $http.post("/ovu-base/ovupark/backstage/customerUser/resetPhone", params, fac.postConfig).success(function(resp){
                    if(resp.code == 0){
                    	 msg(resp.message);
                    	 $scope.item.phone = item.newPhone;
                         vm.newPhoneInput = false;
                    }else{
                    	 alert(resp.message);
                    }
                });
            });
        }
        //重置密码
        vm.resetPWD = function (item) {
            let curLoginId = '';
            if (item.userType === 1) {
                curLoginId = item.id;
            } else if (item.userType === 2 || item.userType === 3) {
                curLoginId = item.loginId;
            }
            confirm("是否重置密码?", function () {
                var param = {'loginId': curLoginId};
                $http.post("/ovu-base/ovupark/backstage/customerUser/resetPassword", param, fac.postConfig).success(function(resp){
                    if(resp.code == 0){
                    	 msg(resp.message);
                    }else{
                    	 alert(resp.message);
                    }
                });
            });
        }

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };

        $scope.save = function (form, item) {
            msg("保存成功");
            $uibModalInstance.close();
        }
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
})()
