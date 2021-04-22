(function () {
    "use strict";
    var app = angular.module("angularApp");
    app.service('AppService', function ($http, fac) {
        var that = this;
        this.park = {parkNo: '', parkName: '',parkId:''};
        //项目编号
        this.parkNo = '';
        this.onlyIndoorMap = true;
    });
    app.controller('faceTrackCtrl', function ($scope, $rootScope, AppService, $http, $filter, $uibModal, fac) {
        document.title = "陌生人轨迹";
        //$scope.parkNo = AppService.parkNo;
        $scope.pageModel = {};
        $scope.lastPageModel={};
        $scope.lastNull=false;

        $scope.search={
            startTime:moment().add(-15,'minute').format('YYYY-MM-DD HH:mm'),
            endTime:moment().format('YYYY-MM-DD HH:mm')
        };

        //地图初始化
        AppService.park = {parkNo: '', parkName: '',parkId:''};
        AppService.parkNo = '';


        app.modulePromiss.then(function(){
            $rootScope.$watch('dept.id', function (deptId, oldValue) {
                if (deptId) {
                    var parkDept=fac.getParkDept(null,deptId);
                    if(parkDept){
                        $scope.search.parkId=parkDept.parkId;
                       
                        $scope.search.parkName=parkDept.parkName;
                    
                    }else{
                        $scope.search.parkId="";
                        $scope.search.parkName=""
                    }
                    $scope.find(1);
                    reloadMap();
                }
            })
        });

        //摄像头经纬度定义
        var cameraPoint={
            "4":{"lnglat":"114.3177936766382,30.474551856414326","floor":"F1"}, //一层入口摄像头
            "5":{"lnglat":"114.3178334522753,30.47453067601977","floor":"F1"}, //一层电梯口摄像头
            "19":{"lnglat":"114.31784119445375,30.474543736343968","floor":"F1"}, //1楼北门
            "22":{"lnglat":"114.31782664667928,30.47446571675213","floor":"F1"}, //1楼南门
            "24":{"lnglat":"114.31783334894077,30.474537149474596","floor":"F1"}, //6楼北门
            "26":{"lnglat":"114.31783401683049,30.474560444520318","floor":"F1"}, //6楼北摄像头
            "10":{"lnglat":"114.31782520090437,30.47447244918195","floor":"F1"}, //10层北门
            "23":{"lnglat":"114.31782277657734,30.474538336782896","floor":"F1"}, //10楼南门
        };

        //列表查询
        $scope.find = function (pageNo) {
            //项目判断
            if(!fac.hasSpecialPark($scope.search) || $scope.lastNull){
                $scope.pageModel = {};
                return;
            }
            $.extend($scope.search, { currentPage: pageNo || $scope.pageModel.currentPage || 1, pageSize: $scope.pageModel.pageSize || 10});
            fac.getPageResult("/ovu-pcos/face/strangerHistory.do", $scope.search, function (data) {
                $scope.lastPageModel=data;
                $scope.pageModel = data;
            });
        };

        $scope.$watch("search.startTime", function(newValue, oldValue,scope){
            //console.log(oldValue+'/'+newValue);
            if(newValue!=oldValue){
                scope.search.endTime=moment(newValue,'YYYY-MM-DD HH:mm').add(15,'minute').format('YYYY-MM-DD HH:mm');
            }
        });

        $scope.findParkCallback=function () {
            $scope.find(1);
            reloadMap();

        }

        function reloadMap(){
            //加载地图
           
           
            AppService.park = {parkId: $scope.search.parkId, parkName: $scope.search.parkName};
            //项目编号
          

            $scope.$broadcast("reloadMap"+window.location.hash);
        }

        //操作按钮控制
        $scope.showtk=false;
        $scope.$on("isBuildingMap", function (event, obj) {
            $scope.showtk=obj;
            $scope.lastNull=false;
            $scope.pageModel=$scope.lastPageModel;
        });

        //楼层陌生人列表控制
        $scope.$on("toGround", function (event, state) {
            var groundName=state.name;
            var showGrouds=["F1"];
            if (showGrouds.indexOf(groundName)!=-1){
                $scope.lastNull=false;
                $scope.pageModel=$scope.lastPageModel;
            }else{
                $scope.lastNull=true;
                $scope.pageModel={};
            }
        });


        // 陌生人轨迹
        $scope.photos=[];
        $scope.showTrack=function (item) {
            //测试
            // if(1==1){
            //     var datas=[];
            //     datas.push(getData(item));
            //     $scope.$broadcast("showPerson",datas);
            // }

            //头像比对
            var param=$.extend($scope.search,{pageIndex:0,pageSize:100,id:item.id,photo:item.photo});
            $http.post("/ovu-pcos/face/strangerTrack.do", param,fac.postConfig).success(function (resp) {
                if (resp.code == 0) {
                    var datas=[];
                    resp.data.forEach(function (obj) {
                        datas.push(getData(obj));
                    });
                    datas=datas.reverse();
                    $scope.$broadcast("showPerson",datas);
                } else {
                    alert(resp.msg);
                }
            });


            function getData(obj){
                var cp=cameraPoint[obj.screen.id] || cameraPoint["4"];
                var lntlat=cp.lnglat.split(',');
                return {
                    time:obj.time,
                    position:obj.screen.camera_position,
                    photo:obj.photo,
                    map_lng:lntlat[0],
                    map_lat:lntlat[1],
                    floor:cp.floor
                };
            }
        };

        //显示位置
        $scope.showPosition=function (item) {
            var datas=[];
            datas.push({
                time:item.time,
                position:item.screen.camera_position,
                photo:item.photo,
                floor:'创意天地',
                map_lng:'114.323453',
                map_lat:'30.472098'
            });
            $scope.$broadcast("showPerson",datas,false);
        }

    });

})();
