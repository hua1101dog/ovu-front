(function () {
    var app = angular.module("angularApp");
    app.controller('inspectionOfficeRoomCtl', function ($scope, $rootScope, $http, $filter, $uibModal, fac) {
        document.title = "OVU-办公巡检";
        angular.extend($rootScope, fac.dicts);
        $scope.search = {};
        $scope.pageModel = {};
        $scope.isShow = true;

        //选择分期
        $scope.changeStage= function(STAGE){
            if(null == STAGE){
                delete $scope.floorList;
                delete $scope.unitList;
                delete $scope.groundList;
                delete $scope.search.stageId;
            }else{
                $scope.search.stageId = STAGE.id;
                loadFloorListByStageId(STAGE.id);//获得楼栋
            }
            $scope.find();

        };
        //选择楼栋
        $scope.changeBuild= function(BUILD){
            if (null == BUILD) {
                delete $scope.unitList;
                delete $scope.groundList;
                delete $scope.search.buildId;
            }else{
                $scope.search.buildId = BUILD.id;
                loadUnitListByBuildId(BUILD.id)//获得单元
            }
            $scope.find();

        };
        //选择单元
        $scope.changeUnit = function (BUILD, unit) {
            if (null == unit) {
                delete $scope.groundList;
                delete $scope.search.unitId;
            } else {
                $scope.search.unitNo= unit;
                loadGroundListByFloorId(BUILD.id, unit);//获得楼层
            }
            $scope.find();

        };
        //选择楼层
        $scope.changeGround= function(GROUND_NUM){
            $scope.search.groundNo = GROUND_NUM;

            $scope.find();
        };

        //获取分期
        function loadStageListByParkId(parkId){
            $scope.stageList = [];
            $http.post("/ovu-base/system/park/stageList.do", {
                parkId: parkId
            }, fac.postConfig).success(function (data) {
                $scope.stageList = data.data;
            });
        }
        //获取楼栋
        function loadFloorListByStageId(stageId){
            $scope.buildList = [];
            $http.post("/ovu-base/system/parkBuild/getBuilds.do", {
                stageId : stageId
            },fac.postConfig).success(function(data){
                $scope.buildList = data;
            });
        }
        //获取单元
        function loadUnitListByBuildId(buildId) {
            $scope.unitList = [];
            $http.post("/ovu-base/system/parkHouse/listUnitNo_mute.do", {
                buildId: buildId
            }, fac.postConfig).success(function (data) {
                $scope.unitList = data.data;
            });
        }
        //获取楼层
        function loadGroundListByFloorId(buildId,unit){
            $scope.groundList = [];
            $http.post("/ovu-base/system/parkHouse/listGroundNo_mute.do", {
                buildId: buildId,
                unitNo: unit
            },fac.postConfig).success(function(data){
                $scope.groundList = data.data;
            });
        }



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
            $scope.search.inspectionType = 2;//办公
            fac.getPageResult("/ovu-park/backstage/inspection/businessInspection/listByPage", $scope.search, function (resp) {
                $scope.pageModel = resp;
            });
        };
        //初始化
        app.modulePromiss.then(function () {
            fac.initPage($scope, function () {
                loadStageListByParkId(app.park.parkId);
                $scope.find(1);
            })
        });

        $scope.query = function () {
            fac.initPage($scope, function () {
                $scope.find(1);
            })
        };

        //删除实体项目
        $scope.del = function (item) {
            confirm("确定删除?", function () {
                $http.post("/ovu-park/backstage/inspection/businessInspection/delete", {id: item.id}, fac.postConfig).success(function (resp) {
                    if (resp.code == 0) {
                        window.msg("删除成功！");
                        $scope.find(1);
                    } else {
                        alert(resp.message);
                    }
                });
            })
        };

        //新增
        $scope.showNews = function (item) {
            if (!app.park) {
                windows.error("请先选择一个项目！");
                return false;
            }
            item = item || {creatorId: app.user.id, creatorName: app.user.nickname};
            item.parkId = app.park.parkId;
            item.updatorId = app.user.id;
            item.updatorName = app.user.nickname;
            var copy = angular.extend({}, item);
            var modal = $uibModal.open({
                animation: false,
                size: 'lg',
                templateUrl: '/view/operationManage/inspection/modal.addInspectionOfficeRoom.html',
                controller: 'editInspectionOfficeCtrl',
                resolve: {item: copy}
            });
            modal.result.then(function () {
                $scope.query();
            });
        };

        //查看详情
        $scope.showDetail = function (item) {
            var copy = angular.extend({}, item);
            var modal = $uibModal.open({
                animation: false,
                size: 'lg',
                templateUrl: '/view/operationManage/inspection/modal.inspectionOfficeDetail.html',
                controller: 'officeDetails'
                , resolve: {item: copy}
            });
        }

    });


    app.controller('officeDetails', function ($scope, $http, $uibModalInstance, $filter, fac, item) {
        $scope.item = item;
        if ($scope.item.businessType === 3) {
            $scope.item.businessTypeName = "办公";
        }


        if($scope.item.housePurpose===1){
            $scope.item.housePurposeName="自持自用";
        }
        if($scope.item.housePurpose===2){
            $scope.item.housePurposeName="自持租赁";
        }
        if($scope.item.housePurpose===3){
            $scope.item.housePurposeName="业主自用";
        }
        else if($scope.item.housePurpose===4){
            $scope.item.housePurposeName="业主转租";
        }

        if($scope.item.housePurpose===1){
            $scope.item.housePurpose="自持自用";
        }
        if($scope.item.housePurpose===2){
            $scope.item.housePurpose="自持租赁";
        }
        if($scope.item.housePurpose===3){
            $scope.item.housePurpose="业主自用";
        }
        else if($scope.item.housePurpose===4){
            $scope.item.housePurpose="业主转租";
        }


       
    

        if ($scope.item.inspectionTime) {
            $scope.item.inspectionTime = $filter("date")($scope.item.inspectionTime,"yyyy-MM-dd");
        }
        if ($scope.item.rentStartTime) {
            $scope.item.rentStartTime = $filter("date")($scope.item.rentStartTime,"yyyy-MM-dd");
        }
        if ($scope.item.rentEndTime) {
            $scope.item.rentEndTime = $filter("date")($scope.item.rentEndTime,"yyyy-MM-dd");
        }

  //计算租期
  $scope.getLeaseMonth = function (rentStartTime, rentEndTime) {
    var start = new Date(rentStartTime);
    var end = new Date(rentEndTime);
    var months;
    months = (end.getFullYear() - start.getFullYear()) * 12;
    months -= start.getMonth();
    months += end.getMonth();
    return months = 0 ? 1 : months + 1;
}
        if ($scope.item.brandImg) {
            $scope.item.brandPics = $scope.item.brandImg.split(",");
        }

        if ($scope.item.img) {
            $scope.item.pics = $scope.item.img.split(",");
        }

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    });



//添加办公巡检JS
    app.controller('editInspectionOfficeCtrl', function ($scope, $http, $uibModalInstance, $filter, $uibModal, fac, item) {
        $scope.count = 1;
        $scope.item = item;
        $scope.build = {};
        $scope.item.pics = [];
        $scope.item.brandPics = [];
        if($scope.item.housePurpose){
            $scope.item.housePurpose=$scope.item.housePurpose+''
        }
        if($scope.item.id){
            //查询合同关联乙方
          $http.post("/ovu-park/backstage/inspection/businessInspection/getContractSecondParty", {houseId:$scope.item.houseId,parkId:app.park.parkId}, fac.postConfig).success(function (resp) {
              $scope.item.relationPerson=resp.data.secondPartyName;
          });
       }
        if ($scope.item.businessType) {
            $scope.item.businessType += "";
        }

        if ($scope.item.inspectionTime) {
            $scope.item.inspectionTime = $filter("date")($scope.item.inspectionTime,"yyyy-MM-dd");
        }else {
            $scope.item.inspectionTime = $filter("date")(new Date(),"yyyy-MM-dd");
        }
        if ($scope.item.rentStartTime) {
            $scope.item.rentStartTime = $filter("date")($scope.item.rentStartTime,"yyyy-MM-dd");
        }
        if ($scope.item.rentEndTime) {
            $scope.item.rentEndTime = $filter("date")($scope.item.rentEndTime,"yyyy-MM-dd");
        }



          //计算租期
      $scope.getLeaseMonth = function (rentStartTime, rentEndTime) {
    	var start = new Date(rentStartTime);
    	var end = new Date(rentEndTime);
    	var months;
	    months = (end.getFullYear() - start.getFullYear()) * 12;
	    months -= start.getMonth();
	    months += end.getMonth();
	    return months = 0 ? 1 : months + 1;
    }
        
        if ($scope.item.brandImg) {
            $scope.item.brandPics = $scope.item.brandImg.split(",");
        }

        if ($scope.item.img) {
            $scope.item.pics = $scope.item.img.split(",");
        }

        var getStageList = function () {
            $http.post("/ovu-base/system/park/stageList", {parkId: app.park.parkId}, fac.postConfig).success(function (resp) {
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
                $scope.buildList.forEach((value,index)=>{
                    if (value.id == item.buildId){
                        $scope.build = value;
                    }
                })
            });
        };
        var getUnitList = function () {
            var params = {'buildId': $scope.item.buildId};
            $http.post("/ovu-base/system/parkHouse/listUnitNo_mute", params, fac.postConfig).success(function (resp) {
                $scope.unitList = resp.data;
            });
        };
        var getFloorList = function () {
            var params = {"buildId": $scope.item.buildId, "unitNo": $scope.item.unitNo};
            $http.post("/ovu-base/system/parkHouse/listGroundNo_mute", params, fac.postConfig).success(function (resp) {
                if (resp.code == 0) {
                    $scope.floorList = resp.data;
                }
            });
        };
        var getHouseList = function () {
            var params = {
                "buildId": $scope.item.buildId,
                "unitNo": $scope.item.unitNo,
                'groundNo': $scope.item.groundNo,
                "rentsaleCharacter": "1"
            };
            $http.post("/ovu-base/system/parkHouse/queryHouseListSelective", params, fac.postConfig).success(function (resp) {
        
                if (resp.code == 0) {
                    $scope.tempHouseList = resp.data;
                    $scope.houseList = resp.data;
                }
            });
        };

        //根据parkId获得分期列表
        $scope.loadStage = function () {
            $http.post("/ovu-base/system/park/stageList", {parkId: app.park.parkId}, fac.postConfig).success(function (resp) {
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
                $scope.item.unitNo = '';
                $scope.item.groundNo = '';
                $scope.item.houseId = '';
            });
        };


        //根据buildId获得单元信息
        $scope.selectBuild = function (value) {
            console.log(value);
            $scope.item.buildId = value.id;
            $scope.item.buildName = value.buildName;
            var params = {'buildId': $scope.item.buildId};
            $http.post("/ovu-base/system/parkHouse/listUnitNo_mute", params, fac.postConfig).success(function (resp) {
                $scope.unitList = resp.data;
                $scope.floorList = [];
                $scope.houseList = [];
                $scope.item.unitNo = '';
                $scope.item.groundNo = '';
                $scope.item.houseId = '';
            });
        };

        //根据buildId,unitId获取楼层信息
        $scope.selectUnit = function () {
            var params = {"buildId": $scope.item.buildId, "unitNo": $scope.item.unitNum};
            $http.post("/ovu-base/system/parkHouse/listGroundNo_mute", params, fac.postConfig).success(function (resp) {
                if (resp.code == 0) {
                    $scope.floorList = resp.data;
                    $scope.houseList = [];
                    $scope.item.groundNo = '';
                    $scope.item.houseId = '';
                }
            });
        };
        //根据buildId,unitNo,groundNo获取楼层信息
        $scope.selectGround = function () {
            $scope.houseList = [];
            var params = {
                "buildId": $scope.item.buildId, "unitNo": $scope.item.unitNo, 'groundNo': $scope.item.groundNo,
                "rentsaleCharacter": "1"
            };
            $http.post("/ovu-base/system/parkHouse/queryHouseListSelective", params, fac.postConfig).success(function (resp) {
                if (resp.code == 0) {
                    $scope.houseList = resp.data;
                    $scope.item.houseId = '';
                }
            });
        };
        //如果有stageId，表示是编辑页面，没有为新增页面
        if (fac.isEmpty($scope.item.stageId)) {
            $scope.loadStage();
        } else {
            getStageList();
            getBuildList();
            getUnitList();
            getFloorList();
            getHouseList();
        }


        $scope.addValue = function (houseId) {
            $scope.houseList.forEach(function (value,index){
                if (houseId == value.id)
                {
                    $scope.item.houseName = value.houseName;
                    $scope.item.houseCode = value.houseCode;
                }
            });
            var params = {"houseId": houseId,"inspectionType":2};
            $http.post("/ovu-park/backstage/inspection/businessInspection/findLast", params, fac.postConfig).success(function (resp) {
                if (resp.code == 0 && resp.data) {
                    $scope.item.businessType = resp.data.businessType;
                    if ($scope.item.businessType) {
                        $scope.item.businessType += "";
                    }

                    $scope.item.enterName = resp.data.enterName;
                    $scope.item.brand = resp.data.brand;
                    $scope.item.brandImg = resp.data.brandImg;
                    if ($scope.item.brandImg) {
                        $scope.item.brandPics = $scope.item.brandImg.split(",");
                    }

                    $scope.item.phone = resp.data.phone;
                    $scope.item.longitude = resp.data.longitude;
                    $scope.item.latitude = resp.data.latitude;

                    $scope.item.inspectionTime = resp.data.inspectionTime;
                    if ($scope.item.inspectionTime) {
                        $scope.item.inspectionTime = $filter("date")($scope.item.inspectionTime,"yyyy-MM-dd");
                    }else {
                        $scope.item.inspectionTime = $filter("date")(new Date(),"yyyy-MM-dd");
                    }
                    if ($scope.item.rentStartTime) {
                        $scope.item.rentStartTime = $filter("date")($scope.item.rentStartTime,"yyyy-MM-dd");
                    }
                    if ($scope.item.rentEndTime) {
                        $scope.item.rentEndTime = $filter("date")($scope.item.rentEndTime,"yyyy-MM-dd");
                    }
                      //计算租期
      $scope.getLeaseMonth = function (rentStartTime, rentEndTime) {
    	var start = new Date(rentStartTime);
    	var end = new Date(rentEndTime);
    	var months;
	    months = (end.getFullYear() - start.getFullYear()) * 12;
	    months -= start.getMonth();
	    months += end.getMonth();
	    return months = 0 ? 1 : months + 1;
    }
                    $scope.item.img = resp.data.img;
                    if ($scope.item.img) {
                        $scope.item.pics = $scope.item.img.split(",");
                    }

                    $scope.item.remark = resp.data.remark;
                }
            });
               //查询合同关联乙方
            $http.post("/ovu-park/backstage/inspection/businessInspection/getContractSecondParty", {houseId:houseId,parkId:app.park.parkId}, fac.postConfig).success(function (resp) {
                $scope.item.relationPerson=resp.data.secondPartyName;
            });
        };
              // 选择入驻方
        $scope.openResidents = function () {
            var modal = $uibModal.open({
                animation: false,
                size: '',
                templateUrl: '/view/operationManage/inspection/modal.selResident.html',
                controller: 'selOfficeResidentCtrl',
                resolve: {}
            });
            modal.result.then(function (data) {
                $scope.item.enterName = data.secondParty.name;
                $scope.item.phone = data.secondParty.phone;
                $scope.item.parkUserId = data.secondParty.personId;
            }, function () {
            });
        };

        $scope.saveInspection = function (form, item) {
            $scope.count = 2;
            form.$setSubmitted(true);
            if (!form.$valid) {
                $scope.count = 1;
                return false;
            }
            if (item.pics.length > 3) {
                $scope.count = 1;
                window.msg("巡检照片最多只能上传3张图片, 请删除多余的图片！");
                return false;
            }
            if (item.brandPics.length > 3) {
                $scope.count = 1;
                window.msg("品牌照片最多只能上传3张图片, 请删除多余的图片！");
                return false;
            }
            item.img = item.pics.join(",");
            item.brandImg = item.brandPics.join(",");
            item.inspectionType = 2;
            var loading = layer.load(2, {
				shade: [0.1,'#fff'] //0.1透明度的白色背景
			});
            $.post("/ovu-park/backstage/inspection/businessInspection/saveOrEdit", item, function (resp) {
                if (resp.code == 0) {
                    window.msg("保存成功！");
                    layer.close(loading);
                    $uibModalInstance.close();
                } else {
                    window.alert(resp.message);
                    $scope.count = 1;
                    layer.close(loading);
                }
            });
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    });
    // 选择入驻方
    app.controller('selOfficeResidentCtrl', function ($scope, $rootScope, $http, $uibModalInstance, $uibModal,$filter, fac) {
        $scope.search = {};
        $scope.personPageModel = {};
        $scope.companyPageModel = {};
        // 获取 乙方人员列表
        $scope.searchCustomers1 = function (pageNo) {
            $scope.search.parkId = app.park.parkId;
            $.extend($scope.search, { currentPage: pageNo || $scope.personPageModel.currentPage || 1, pageSize: $scope.personPageModel.pageSize || 10 });
            $scope.search.pageIndex = $scope.search.currentPage - 1;
            $scope.search.totalCount = $scope.personPageModel.totalCount || 0;

            $http.post("/ovu-park/backstage/rental/contract/getPersonInfo", $scope.search, fac.postConfig).success(function (resp) {
                if (resp.code == 0) {
                    $scope.personList = resp.data.data;
                    $scope.personPageModel = resp.data;
                    $scope.personPageModel.currentPage = $scope.personPageModel.pageIndex + 1;
                    var pages = [];
                    var hash = {};
                    var list = [1, $scope.search.currentPage - 1, $scope.search.currentPage, $scope.search.currentPage + 1, $scope.personPageModel.pageTotal];
                    list.forEach(function (v) {
                        if (!hash[v] && v <= $scope.personPageModel.pageTotal && v > 0) {
                            hash[v] = true;
                            pages.push(v);
                        }
                    });
                    if (pages.length > 2 && pages.indexOf(2) == -1) {
                        pages.splice(1, 0, '······');
                    }
                    if (pages.length > 2 && pages.indexOf($scope.personPageModel.pageTotal - 1) == -1) {
                        pages.splice(pages.length - 1, 0, '······');
                    }
                    $scope.personPageModel.pages = pages;
                } else {
                    window.alert(resp.message);
                }
            });
        };

        // 获取 乙方企业列表
        $scope.searchCustomers2 = function (pageNo) {
            $scope.search.parkId = app.park.parkId;
            $.extend($scope.search, { currentPage: pageNo || $scope.companyPageModel.currentPage || 1, pageSize: $scope.companyPageModel.pageSize || 10 });
            $scope.search.pageIndex = $scope.search.currentPage - 1;
            $scope.search.totalCount = $scope.companyPageModel.totalCount || 0;
            $http.post("/ovu-park/backstage/rental/contract/getCompanyInfo", $scope.search, fac.postConfig).success(function (resp) {
                if (resp.code == 0) {
                    $scope.companyList = resp.data.data;
                    $scope.companyPageModel = resp.data;
                    $scope.companyPageModel.currentPage = $scope.companyPageModel.pageIndex + 1;
                    var pages = [];
                    var hash = {};
                    var list = [1, $scope.search.currentPage - 1, $scope.search.currentPage, $scope.search.currentPage + 1, $scope.companyPageModel.pageTotal];
                    list.forEach(function (v) {
                        if (!hash[v] && v <= $scope.companyPageModel.pageTotal && v > 0) {
                            hash[v] = true;
                            pages.push(v);
                        }
                    });
                    if (pages.length > 2 && pages.indexOf(2) == -1) {
                        pages.splice(1, 0, '······');
                    }
                    if (pages.length > 2 && pages.indexOf($scope.companyPageModel.pageTotal - 1) == -1) {
                        pages.splice(pages.length - 1, 0, '······');
                    }
                    $scope.companyPageModel.pages = pages;
                } else {
                    window.alert(resp.message);
                }
            });
        };
        $scope.addResident=function(type){
            var modal = $uibModal.open({
                animation: true,
                size: '',
                templateUrl: 'addResident.html',
                controller:function ($scope,  $http, $uibModalInstance,fac,data) {
                      // 取消
                    $scope.item=data;
                    $scope.item.parkId  =app.park.parkId;
                    $scope.cancel = function () {
                        $uibModalInstance.dismiss('cancel');
                    };
                      // 保存
                    $scope.save = function (form) {
                        form.$setSubmitted(true);
                        if (!form.$valid) {
                            return;
                        }
                        if(!fac.isPhoneNumber( $scope.item.phone)){
                            alert('请输入正确的手机号码！');
                            return;
                        }
                        $http.post("/ovu-park/backstage/inspection/businessInspection/addUser", $scope.item, fac.postConfig).success(function (resp) {
                            if (resp.code == 0) {
                                window.msg(resp.msg);
                                $uibModalInstance.close();
                            }else{
                                alert(resp.msg)
                            }
                        })
                        
                    }   
                },
                resolve: { data:{userType:type}}
                
            });
            modal.result.then(function () {
                if(type==1){
                    $scope.searchCustomers1(1)
                }else{
                    $scope.searchCustomers2(1)
                }
               
            }, function () {
                console.info('Modal dismissed at: ' + new Date());
            });
        };
        // 选中乙方
        $scope.selectSecondPart = function (event, x) {
            $scope.secondParty = x;
            if (event.target.tagName.toLowerCase() != "td" && event.target.tagName.toLowerCase() != "tr") {
                return false;
            }
            $(event.target).parent().parent().children("tr").removeClass("success");
            $(event.target).parent().addClass("success");
        };
        // 保存
        $scope.save = function () {
            $uibModalInstance.close({ secondParty: $scope.secondParty });
            $scope.reduceHis = [];//清空
        };
        // 取消
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };

        app.modulePromiss.then(function () {
            $scope.searchCustomers1();
            $scope.searchCustomers2();
        });
    });
    app.filter('trustHtml', function ($sce) {
        return function (input) {
            return $sce.trustAsHtml(input);
        }
    });

    // 支付方式
    app.filter("businessTypeList", function () {
        return function (status) {
            switch (status) {
                case 1:
                    return '餐饮';
                    break;
                case 2:
                    return '商业';
                    break;
                case 3:
                    return '办公';
                    break;
            }
        }
    })

})();
