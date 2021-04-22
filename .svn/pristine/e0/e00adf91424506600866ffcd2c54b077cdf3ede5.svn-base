(function () {
    var app = angular.module("angularApp");
    /* 疫情报告 */
    app.controller('visitorManageCtrl', function ($scope, $rootScope, $http, $filter, $uibModal, fac) {
        document.title = "OVU-访客管理";
        angular.extend($rootScope, fac.dicts);

        $scope.search = {
            parkId:$scope.dept.parkId
        };
        $scope.pageModel = {};
        //选择分期
        $scope.changeStage= function(STAGE){
            if(null == STAGE){
                delete $scope.floorList;
                delete $scope.unitList;
                delete $scope.groundList;
                delete $scope.search.stageId;
                $scope.buildList = [];
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

        
        //初始化
        app.modulePromiss.then(function () {
            fac.initPage($scope, function () {
                loadStageListByParkId(app.park.parkId);
                $scope.find(1);
            })
        });

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

            fac.getPageResult("/ovu-park/backstage/visitor/list", $scope.search, function (data) {
                $scope.pageModel = data;
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
    });

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
