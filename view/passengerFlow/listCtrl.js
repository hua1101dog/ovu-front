(function() {
    var app = angular.module("angularApp");

    app.controller('passengerFlowCtl', function ($scope,$rootScope,$uibModal, $http,$filter,fac) {
        document.title ="OVU-客流统计配置";
        $scope.pageModel = {};
        $scope.search = {};
        var curParkId='';

        app.modulePromiss.then(function(){
            $rootScope.$watch('dept.id', function (deptId, oldValue) {
                if (deptId) {
                    var parkDept=fac.getParkDept(null,deptId);
                    if (parkDept){
                        curParkId=parkDept.parkId;
                        delete $scope.search.floorId;
                        delete $scope.search.buildName;
                        fac.getStageTree($scope,parkDept.parkId);
                    }else{
                        curParkId='';
                    }
                    $scope.find(1);
                }else{
                    $scope.pageModel = {};
                }
            })
        });


        //查询
        $scope.find = function(pageNo){
            if(!fac.initDeptId($scope.search)){
                return;
            }
            $.extend($scope.search,{currentPage:pageNo||1,pageSize:$scope.pageModel.pageSize||10});
            fac.getPageResult("/ovu-pcos/pcos/passengerFlow/list.do",$scope.search,function(data){
                $scope.pageModel = data;
            });
        };

        //批量删除
        $scope.delAll = function(){
            var ids = $scope.pageModel.list.reduce(function(ret,n){n.checked && ret.push(n.id);return ret},[]);
            if(ids.length==0){
                alert("请选择要删除的配置！");
                return;
            }
            dodel(ids.join());
        };
        $scope.del = function(item){
            dodel(item.id);
        }
        function dodel(ids){
            confirm("确认删除选中的配置?",function(){
                $http.post("/ovu-pcos/pcos/passengerFlow/delete.do",{ids:ids},fac.postConfig).success(function(resp){
                    if(resp.code==0){
                        $scope.find(1);
                    }else{
                        alert('删除失败');
                    }
                })
            });
        }

        $scope.showEditModal = function(group){
            if(!fac.initDeptId($scope.search)){
                return;
            }
            group = group||{};
            group.parkId=curParkId;
            group.deptId=$scope.search.deptId;
            var modal = $uibModal.open({
                animation: false,
                size:'lg',
                templateUrl: '/view/passengerFlow/select.videos.html',
                controller: 'passengerFlowModalCtrl'
                ,resolve: {group: $.extend(true,{},group)}
            });
            modal.result.then(function () {
                $scope.find();
            }, function () {
                console.info('Modal dismissed at: ' + new Date());
            });
        }


    });
    app.controller('passengerFlowModalCtrl', function($scope,$rootScope,$http,$uibModalInstance,$uibModal,$filter,fac,group) {

        $scope.model = group;
        group.videos=group.videos || [];

        if (!group.id){
            fac.getStageTree($scope,group.parkId);
        }

        $scope.search = {
            deptId: $rootScope.dept.id,
            preSetEquipType: 'camera'
        };

        $scope.pageModel = {};
        $scope.find = function (pageNo) {
            $.extend($scope.search, {
                currentPage: pageNo || $scope.pageModel.currentPage || 1,
                pageSize: $scope.pageModel.pageSize || 10
            });
            $scope.search.pageIndex = $scope.search.currentPage - 1;
            fac.getPageResult("/ovu-pcos/pcos/equipment/queryByPage.do", $scope.search, function (data) {
                $scope.pageModel = data;
                $scope.pageModel.data.forEach(function (item) {
                    group.videos.forEach(function (v) {
                        if (item.id==v.id) {
                            item.checked=true;
                        }
                    })
                });

            });
        };
        $scope.find(1);

        //选中人员
        $scope.checkOne=function(person){
            person.checked=!person.checked;

            if(person.checked){
                $scope.model.videos.push({id:person.id,name:person.name});
            }else{
                $scope.model.videos.forEach(function(p){
                    if(person.id==p.id){
                        $scope.model.videos.splice($scope.model.videos.indexOf(p),1);
                    }
                });
            }
        }

        //全选人员
        $scope.checkAll=function(){
            $scope.pageModel.checked=!$scope.pageModel.checked;

            if($scope.pageModel.checked){
                $scope.pageModel.list.forEach(function (item) {
                    item.checked=true;

                    var i=isInArray($scope.model.videos,item);

                    if(i==-1){
                        $scope.model.videos.push({id:item.id,name:item.name});
                    }
                })
            }else{
                $scope.pageModel.list.forEach(function (item) {
                    item.checked=false;

                    var i=isInArray($scope.model.videos,item);
                    if(i!=-1){
                        $scope.model.videos.splice(i,1);
                    }
                })
            }
        }

        //删除人员
        $scope.delVideo=function (persons,person) {
            $scope.pageModel.list.forEach(function (item) {
                if(item.id==person.id){
                    item.checked=false;
                }
            })

            persons.splice(persons.indexOf(person),1);
        }

        function isInArray(arr, value) {
            //debugger;
            var f = -1;
            arr.forEach(function (p, i) {
                if (p.id === value.id) {
                    f = i;
                }
            });
            return f;
        }

        //保存
        $scope.save = function(form,item){
            form.$setSubmitted(true);
            if(!form.$valid){
                return;
            }

            var videoIds=[];
            item.videos.forEach(function (v) {
                videoIds.push(v.id);
            });
            item.videoIds=videoIds.join();
            console.log(item);
            $http.post("/ovu-pcos/pcos/passengerFlow/save.do",item,fac.postConfig).success(function(data, status, headers, config) {
                if(data.code==0){
                    $uibModalInstance.close();
                    msg("保存成功!");
                } else {
                    alert("保存失败");
                }
            })
        }
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    });

})()
