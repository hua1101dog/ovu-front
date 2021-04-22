
/**
 * Created by chenxi on 2018/3/7.
 */
(function () {
    "use strict";
    var app = angular.module("angularApp");




    app.directive("cameraDetect", function () {
        return {
            scope: {
                cameraCode:'=',
                camera:"="
            },
            link: function (scope, ele, attrs, c) {
                $.ajax({
                    url: "/ovu-camera/api/ping?cameraCode="+scope.cameraCode,
                    cache: true,
                    timeout: 0,
                    success: function (resp) {
                        if(resp.code==0){
                            scope.camera.cameraStatus = resp.data;
                            scope.$apply();
                        }
                    }
                });
            }
        }
    });

    app.controller('cameraCtrl', function ($scope, $rootScope, $http, $filter, $uibModal, fac) {
        String.prototype.trim = function (char, type) {
            if (char) {
                if (type == 'left') {
                    return this.replace(new RegExp('^\\'+char+'+', 'g'), '');
                } else if (type == 'right') {
                    return this.replace(new RegExp('\\'+char+'+$', 'g'), '');
                }
                return this.replace(new RegExp('^\\'+char+'+|\\'+char+'+$', 'g'), '');
            }
            return this.replace(/^\s+|\s+$/g, '');
        };

        document.title = "摄像机设备管理";
        $scope.search = {};
        $scope.pageModel = {};
        $scope.lanConfig = {edit:false};
        function getLantree(){
            $http.get('/ovu-camera/pcos/videomanagement/hardware/allLan').success(function (res) {
                if(res.code == 0){
                    $scope.lanTree = res.data;
                    $scope.flatLanTree=fac.treeToFlat($scope.lanTree);
                }else{
                    alert(res.msg);
                }
            })
        }

        getLantree();

        $http.get("/ovu-camera/pcos/videomanagement/camerinfo/rtspDict").success(function(resp){
            if(resp.code ==0){
                $rootScope.rtspDict = resp.data;
            }
        })

        //选中分类节点
        $scope.selectNode = function (node) {
            if ($scope.curNode != node) {
                $scope.curNode && $scope.curNode.state && ($scope.curNode.state.selected = false);
            }
            node.state = node.state || {};
            node.state.selected = !node.state.selected;
            if (node.state.selected) {
                $scope.curNode = node;
                $scope.find(1);
            } else {
                delete $scope.curNode;
            }
        }

        //分页
        $scope.find = function (pageNo) {
          /*  if (!fac.hasActivePark($scope.search)) {
                return;
            }*/
            if($scope.curNode){
                $scope.search.parkId = $scope.curNode.parkId;
                $scope.search.lanId = $scope.curNode.lanId;
            }else{
                delete $scope.search.parkId;
                delete $scope.search.lanId;
            }
            angular.extend($scope.search, { currentPage: pageNo || $scope.pageModel.currentPage || 1, pageSize: $scope.pageModel.pageSize || 10 });
            fac.getPageResult('/ovu-camera/pcos/videomanagement/camerinfo/pageList.do', $scope.search, function (data) {
                $scope.pageModel = data;
                data.data.forEach(n=>{
                    if(n.parkSpaces && n.parkSpaces.length){
                        n.parkSpaces.forEach(m=>{
                            m.base64 = 'data:image/jpeg;base64,'+m.base64.substring(1,m.base64.length-1)}
                        )
                    }
                })
            })
        }

        $scope.showHistory = function(space){
            var modal = $uibModal.open({
                animation: false,
                size: 'lg',
                templateUrl: '/view/middleware/zenith.history.html',
                controller: 'zenithHistoryCtrl',
                resolve: {
                    space: function () { return space;}
                }
            });
            modal.result.then(function () {
            }, function () {
            });
        }

        $scope.find();
        $scope.printScreen = function (camera) {
            var params ={
                cameraCode:camera.code,
                resolution:"p1080",
                time:Date.parse(new Date())
            }
            $http.get( "/ovu-camera/api/printScreen",{params:params}).success(function (res) {
                if(res.code == 0){
                    $scope.$applyAsync(function () {
                        camera.photoUrl=res.data
                    });
                }else{
                    alert(res.msg);
                }
            })
        }
        //添加摄像机
        $scope.showEditModal = function (camera) {
            var copy = angular.extend({}, camera);
            function callback(){
                var modal = $uibModal.open({
                    animation: false,
                    size: 'lg',
                    templateUrl: "../view/videomanagement/camera.modal.html",
                    controller: 'cameraEditModalCtrl',
                    controllerAs: 'vm',
                    resolve: {
                        camera: copy,
                        lanTree:function (){return $scope.lanTree}
                    }
                })
                modal.result.then(function () {
                    $scope.find();
                })
            }
            if (fac.isNotEmpty(copy.code)) {
                $http.get('/ovu-camera/pcos/videomanagement/camerinfo/get.do', { params: { code: copy.code } }).success(function (res) {
                    angular.extend(copy, res);
                    callback();
                })
            }else {
                callback();
            }
        }
        //删除设备
        $scope.del = function (id) {
            confirm("确认删除该设备吗?", function () {
                $http.get("/ovu-camera/pcos/videomanagement/camerinfo/delete.do?id=" + id).success(function (msg) {
                    if (msg.success) {
                        $scope.find();
                    } else {
                        alert();
                    }
                })
            })
        }
        //刷新摄像头状态
        $scope.updateCameraStatus = function (item) {
            $http.get('/ovu-camera/pcos/videomanagement/camerinfo/updateCameraStatus.do', { params: { id:item.id,code: item.code } }).success(function (res) {
               if (res.code == 0) {
                   item.cameraStatus = res.data;
                   msg("状态更新成功!");
                } else {
                    alert();
                }
            })
        }
    });
    app.controller('cameraEditModalCtrl', function ($scope, $uibModal, $uibModalInstance, $http, fac, camera,lanTree) {
        $scope.lanTree = lanTree;
        var vm = $scope.vm = this;
        $scope.item={}


        $scope.$watch("item",function(cameraInfo,o){
            if(cameraInfo.lanId ){
                if(!o||o.lanId!=cameraInfo.lanId||!$scope.imosHardwareList){
                    $http.post("/ovu-camera/pcos/videomanagement/hardware/pageList",{lanId:cameraInfo.lanId,hasImos:true,pageSize:1000},fac.postConfig).success(function (resp, status, headers, config) {
                        $scope.imosHardwareList = resp.data.data;
                    });
                }
            }
            if(!cameraInfo.cameraModel){
                $scope.curRtspUrl="请勾选正确的摄像机型号！"
            }else {
                var rtspObj =  $scope.rtspDict.find(function(n){return n.id == cameraInfo.cameraModel });
                if(!rtspObj){
                    return;
                }
                if(!o ||o.cameraModel!=cameraInfo.cameraModel ){
                    !cameraInfo.cameraUser && (cameraInfo.cameraUser = rtspObj.defaultUser)
                    !cameraInfo.cameraPasswd  && (cameraInfo.cameraPasswd = rtspObj.defaultPassword)
                    !cameraInfo.port && (cameraInfo.port = rtspObj.defaultPort)
                }
                var rtspRule = rtspObj.rtspRule;
                cameraInfo.cameraUser && (rtspRule = rtspRule.replace("{user}",cameraInfo.cameraUser));
                cameraInfo.cameraPasswd && (rtspRule = rtspRule.replace("{password}",cameraInfo.cameraPasswd));
                cameraInfo.ip && (rtspRule = rtspRule.replace("{ip}",cameraInfo.ip));
                cameraInfo.port && (rtspRule = rtspRule.replace("{port}",cameraInfo.port));
                cameraInfo.channel && (rtspRule = rtspRule.replace("{channel}",cameraInfo.channel));
                $scope.curRtspUrl = rtspRule;
            }
        },true)

        camera.imosHardwares = camera.imosHardwares||[];
        camera.zenithParkSpaces= camera.zenithParkSpaces || [];
        $scope.item = camera;


        $scope.addItem=function(){
          $scope.item.zenithParkSpaces.push({frameId:'',frameName:'',houseNo:''});
        }
        vm.save = function (form, item) {
            form.$setSubmitted(true);
            if (!form.$valid) {
                return
            }
            camera.imosHardwareIds =camera.imosHardwares.reduce(function(ret,n){ret.push(n.id);return ret},[]).join();
            delete item.createTime;

            $http.post('/ovu-camera/pcos/videomanagement/camerinfo/edit.do', item).success(function (res) {
                if (res.success) {
                    $uibModalInstance.close();
                    msg("保存成功!");
                } else {
                    alert(res.msg);
                }
            })
        };
    })

    app.controller('zenithHistoryCtrl', function ($scope, $uibModal, $uibModalInstance, $http, fac, space) {
        var vm = $scope.vm = this;
        $scope.space = space;
        $scope.search = {parkSpaceId:space.id};
        $scope.pageModel = {};

        //分页
        var pushUrls = [];
        $scope.find = function (pageNo) {
            angular.extend($scope.search, { currentPage: pageNo || $scope.pageModel.currentPage || 1, pageSize: $scope.pageModel.pageSize || 10 });
            fac.getPageResult('/middleware/zenith/getZenithHistory',$scope.search, function (data) {
                $scope.pageModel = data;
                data.data.forEach(function(n){
                    n.sendJsonArray = JSON.parse(n.sendJson);
                    n.sendJsonArray = n.sendJsonArray.filter(function(m){
                        var pushUrl = pushUrls.find(function(x){return x.id == m.pushUrlId});
                        if(pushUrl){
                            m.pushName = pushUrl.name;
                            return true;
                        }else {
                            return false;
                        }
                    })
                })
            })
            console.log($scope.pageModel);
        }

        if(space.parkNo){
            $http.get("/middleware/pushUrl/getPushUrls",{params:{parkNo:space.parkNo,company:"zenith"}}).success(function(resp){
                if(resp.code == 0){
                    pushUrls = resp.data;
                    $scope.find();
                }else{
                    alert(resp.msg);
                }
            })
        }else {
            $scope.find();
        }


        $scope.copy =  function(clipBoardContent){
            const input = document.createElement('input');
            document.body.appendChild(input);
            input.setAttribute('value', clipBoardContent);
            input.select();
            if (document.execCommand('copy')) {
                document.execCommand('copy');
                alert("复制成功!");
            }
            document.body.removeChild(input);
        }

        $scope.reSend = function(item,rec){
            item.pushUrlId = rec.pushUrlId;
            confirm("重新推送此条数据吗？",function () {
                $http.post('/middleware/zenith/reSend', item).success(function (res) {
                    if (res.code == 0) {
                        if(res.data == 1){
                            rec.status = 1;
                            msg("推送成功!");
                        }else{
                            alert(res.msg);
                        }
                    } else {
                        alert(res.msg);
                    }
                })
            })
        }

    })

})()
