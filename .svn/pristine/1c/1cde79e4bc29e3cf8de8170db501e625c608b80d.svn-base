(function() {
    var app = angular.module("angularApp");
    app.controller('workunitAuthCtrl', function ($scope,$rootScope,$uibModal, $http,$filter,fac) {
        document.title ="应急工单派发授权";
        $scope.pageModel = {};
        $scope.search = {"heeh":0};

        $scope.find = function(pageNo){
            if(!fac.initDeptId($scope.search)){
                return;
            }
            $scope.search.userId = $scope.search.user?$scope.search.user.userId:undefined;
            $scope.search.userName = $scope.search.user?$scope.search.user.name:undefined;
            $.extend($scope.search,{currentPage:pageNo||$scope.pageModel.currentPage||1,pageSize:$scope.pageModel.pageSize||10});
            fac.getPageResult("/ovu-pcos/pcos/workunit/workunitAuth/list.do",$scope.search,function(data){
                $scope.pageModel = data;
            });
        };

        app.modulePromiss.then(function(){
            $scope.$watch('dept.id', function (deptId, oldValue) {
                if (deptId) {
                    if(['maintenanceUnit','securityUnit','greenUnit'].indexOf(app.domain.orgType)>-1 ){
                        $http.get("/ovu-pcos/pcos/workunit/outSourceWorkTypeTree?deptId="+deptId).success(function(resp){
                            if(resp.code == 0){
                                $scope.$parent.emerWorkTypeTree =resp.data;
                            }
                        })
                    }
                    $scope.find(1);
                }
            })
        });

        //选中分类项
        $scope.selectNode= function (search,node) {
            if(node.state.selected){
                $scope.curNode = node;

            }else{
                delete $scope.curNode;
            }
            $scope.find(1);
        }

        /*  $scope.selectPerson = function(item,search){
              if(item){
                  search.userId = item.id;
              }
          }*/
        /**
         * 删除所有
         */
        $scope.delAll = function(){
            var idList = $scope.pageModel.list.reduce(function(ret,n){n.checked && ret.push(n.id);return ret},[]);
            delAuth(idList);
        };

        /**
         * 删除
         * @param item
         */
        $scope.del = function(item){
            delAuth([item.id]);
        }

        function delAuth(idList){
            confirm("确认删除选中的"+idList.length+"条记录?",function(){
                $http.get("/ovu-pcos/pcos/workunit/workunitAuth/del.do",{params:{"ids":idList.join()}}).success(function(resp){
                    if(resp.code == 0){
                        $scope.find();
                    }else{
                        alert(resp.msg);
                    }
                })
            });
        }

        //新增、编辑
        $scope.editNode = function(worktype) {
            if(!$rootScope.dept){
                alert("请先选择工单归属部门！");
                return;
            }
            var params = {worktypeId:worktype.id,deptId:$rootScope.dept.id}
            $http({method:'POST',url:"/ovu-pcos/pcos/workunit/workunitAuth/getByType",params:params}).success(function(resp){
                if(resp.code == 0){
                    $scope.editModal(angular.extend(params,resp.data));
                }
            })
        };

        //新增、编辑
        $scope.editModal = function(item) {
            item = item || {};
            var modal = $uibModal.open({
                animation: false,
                size:'',
                templateUrl: '/view/workunit/workunitAuth.modal.html?t='+Date.now(),
                controller: 'workunitAuthModalCtrl'
                ,resolve: {auth:angular.extend({},item)}
            });
            modal.result.then(function (data) {
                $scope.find();
            }, function () {
                console.info('Modal dismissed at: ' + new Date());
            });
        };


    });

    //派单授权
    app.controller('workunitAuthModalCtrl', function($scope,$http,$uibModalInstance,$filter,fac,auth) {
        $scope.item = auth;
        auth.authType = (auth.outSourceCode?2:1);
        auth.users = [];
        $scope.$watch('item.user',function(newV,oldV){
           
            $scope.selectPerson(newV)
         })

        function getOrgTree(domainCode){
            $http.get("/ovu-base/system/dept/rightTree.do?domainCode="+domainCode).success(function(resp){
                if(resp.code == 0) {
                    $scope.outSourceDeptTree = resp.data;
                }
            })
        }
        if(auth.userIds){
            var userIdList = auth.userIds.split(",");
            var personNameList = auth.personNames.split(",");
            for(var i in userIdList){
                auth.users.push({userId:userIdList[i],name:personNameList[i]})
            }
        }else if(auth.outSourceCode){
            auth.org = {domainCode:auth.outSourceCode,domainName:auth.outSourceName}
            getOrgTree(auth.outSourceCode);
        }

      //切换类型
      $scope.changeType = function (type) {
        $scope.item.users = [];
        if (type == 2) {
            //是外包公司，
        } else {
            //不是外包公司，删除外包的所有相关信息
            $scope.item.org && delete $scope.item.org;
            //不是外包公司，删除域id
            $scope.item.outSourceCode && delete $scope.item.outSourceCode;
            $scope.item.outSourceName && delete $scope.item.outSourceName;
            $scope.item.outSourceDeptId && delete $scope.item.outSourceDeptId;
            $scope.item.outSourceDeptName && delete $scope.item.outSourceDeptName;
        }
    };


        $scope.selectOrg = function(org){
            $scope.item.outSourceCode = org.domainCode;
            $scope.item.outSourceName = org.domainName;
            delete $scope.item.outSourceDeptId;
            delete $scope.item.outSourceDeptName;
            getOrgTree(org.domainCode);
        };

        //选择人员
        $scope.selectPerson = function(user){
            if(!user){
                return;
            }
            if(!user.userId){
                alert("此用户“"+user.name+"”未分配系统账号！");
                return;
            }
            if($scope.item.users.find(function(n){return n.userId == user.userId})){
                alert("此用户“"+user.name+"”已存在！");
                return;
            }
            $scope.item.users.push(user);
            $scope.item.user=null;

        };


     

        //保存
        $scope.save = function(form,item){
            form.$setSubmitted(true);
            if(!form.$valid){
                return;
            }
            if(item.authType == 1){
                //非外包
                if(item.users.length==0){
                    alert("请至少选择一位派发人！");
                    return;
                }
                var userIdList = item.users.reduce(function(ret,n){n.userId && ret.push(n.userId);return ret},[]);
                item.userIds =userIdList.join();
                item.outSourceCode = undefined;
                item.outSourceDeptId = undefined;
            }else {
               delete item.userIds;
            }
            $http.post("/ovu-pcos/pcos/workunit/workunitAuth/save.do",item).success(function(ret){
                if(ret.code == 0){
                    $uibModalInstance.close();
                    msg("授权成功!");
                }else{
                    alert(ret.msg);
                }
            })
        }

    });

})()
