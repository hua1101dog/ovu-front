/**
 * Created by Administrator on 2017/7/20.
 */
(function() {
    "use strict";
    var app = angular.module("angularApp");

    //人员异动ctl
    app.controller('personChangeCtl', function ($scope,$rootScope, $http,$filter,$uibModal,fac) {
        document.title ="OVU-人员异动管理";
        $scope.search = {};
        $scope.pageModel = {};
        fac.setPostDict($rootScope);

        app.modulePromiss.then(function(){
            $scope.deptTree_personChange=fac.getGlobalTree();
            if($scope.deptTree_personChange.length){
                $scope.search.deptId = $scope.deptTree_personChange[0].id;
            }
        });

        $scope.setDept = function(search,node){
            if(node.state.selected){
                $scope.find(1);
            }
        }

        //查询
        $scope.find = function(pageNo){
            if(!$scope.search.deptId){
                return;
            }
            $.extend($scope.search,{currentPage:pageNo||$scope.pageModel.currentPage||1,pageSize:$scope.pageModel.pageSize||10});
            fac.getPageResult("/ovu-base/pcos/person/listByGrid.do",$scope.search,function(data){
                data.list.forEach(function(n){
                    n.postList = [];
                    if(n.postIds){
                        var deptpost = n.postIds.split(",");
                        var postList = deptpost.map(function(m){return m.indexOf("^")>0?(m.split("^")):(null)})
                        n.postList = postList.filter(function(m){return $rootScope.flatDetpTree.find(function(o){return o.id == m[0]}) })
                        delete n.postIds;
                    }
                })
                $scope.pageModel = data;
            });
        };

        //异动日志
        $scope.showLog = function(item){
            var modal = $uibModal.open({
                animation: false,
                size:'lg',
                templateUrl: '/view/person/modal.personChangeLog.html',
                controller: 'personChangeLogModalCtrl'
                ,resolve: {id: function(){return item.id}}
            });
            modal.result.then(function () {
            }, function () {
                console.info('Modal dismissed at: ' + new Date());
            });
        }

        //异动操作
        $scope.showChangeModal = function(person){
            var modal = $uibModal.open({
                animation: false,
                size:'lg',
                templateUrl: '/view/person/personChange.modal.html',
                controller: 'personChangeModalCtrl'
                ,resolve: {person: angular.extend({},person)}
            });
            modal.result.then(function () {
                $scope.find();
            }, function () {
                console.info('Modal dismissed at: ' + new Date());
            });
        }

    });

    app.controller('personChangeLogModalCtrl', function($scope,$http,$uibModalInstance,fac,id) {
        $scope.search = {id:id};
        $scope.pageModel = {};
        //人员异动日志
        $scope.find = function(pageNo){
            $.extend($scope.search,{currentPage:pageNo||$scope.pageModel.currentPage||1,pageSize:$scope.pageModel.pageSize||10});
            fac.getPageResult("/ovu-base/pcos/person/changeList.do",$scope.search,function(data){
                $scope.pageModel = data;
                $scope.pageModel.list.map(function (e) {
                    if(e.deptNames){
                        var arr = e.deptNames.split(" > ");
                    if(arr.length > 1){
                        e.deptNames =  arr[arr.length-1];
                    }
                    }
                    return e;
                });
            });
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
        $scope.find();
    });

    app.controller('personChangeModalCtrl', function($scope,$rootScope,$http,$uibModal,$uibModalInstance,$filter,fac,person) {
       
        $scope.person = person;
        $scope.deptTreeChange=$scope.$parent.deptTree
         var checkIds=[] //手动选中的ID
        if($scope.deptTreeChange.length){
            $rootScope.execTreeNode($scope.deptTreeChange,function(n){
               if (n.parkId) {
                   if(n.nodes && n.nodes.length){
                
                    $rootScope.execTreeNode(n.nodes,function(node){
                        node.parentPark=true
                        node.pidCopy=n.id
                    })
                   }
                 
                   
               }
            })

        }
       
         var selectDeptIdArr=[];
         $scope.selectDeptIds=''
        $scope.personHandoverList=[]
        if(person.postList.length){
            person.postList.forEach(v=>{
                selectDeptIdArr.push(v[0])
            })
            $scope.selectDeptIds=selectDeptIdArr.join(',')
        }
        var deptIdList = [];
        var flag=true

        var vm = $scope.vm = this;

        vm.filteredDeptTree=$.extend(true,[],app.filteredDeptTree);
        
        var flatDeptTreeNoParkSon = fac.treeToFlat(vm.filteredDeptTree);
        var flatDetpTree = fac.treeToFlat(app.deptTree);
        $rootScope.execTreeNode( vm.filteredDeptTree,function(v){
            v.state=v.state || {}
            if(v.state){
                    v.state.selected=false
            }
        })
        //部门选择器 计算
        function calcuPersonDept(){
            vm.personDeptTree = fac.filterTree($.extend(true,[],vm.filteredDeptTree),"id",deptIdList,true);
        }
        /**
         * 选中部门下所有人员
         * @param node
         */
        $scope.afterCheck = function (node) {
            //手动选中
            node.state=node.state || {}
          
            if(node.state.checked && checkIds.indexOf(node.id)==-1){
                checkIds.push(node.id)
    
               }else if(!node.state.checked){
                // checkIds=checkIds.splice(checkIds.indexOf(node.id),1)
                var index = checkIds.findIndex((v,i)=>{
                    return node.id==v
                 })
                 checkIds.splice(index,1)
               }
               $scope.selectPermission()
            // deptIdList = deptIdList.filter(function(n){
            //     return !flatDeptTreeNoParkSon.find(function(m){return m.id == n})
            // })

          
        };
        $scope.change = {personId:person.id,changeType:1,changeTime:$filter('date')(new Date(), "yyyy-MM-dd"),
            deptIds:"",   deptNames:"", postIds:"", postNames:""};
        var oldPosts=[];
        deptIdList = person.deptIds?person.deptIds.split(","):[];
        flatDeptTreeNoParkSon.map(function(n){ if(deptIdList.indexOf(n.id)>-1){n.state = n.state||{};n.state.checked = true;} })
        calcuPersonDept();
        //人员关联的部门、岗位
        $http.get("/ovu-base/pcos/person/getPersonPosts.do?id="+person.id).then(function(resp){
            $scope.posts = resp.data;
            
           
              
            oldPosts=angular.extend(oldPosts,resp.data);
            return $scope.posts;
        }).then(function(posts){
            posts.forEach(function(item){
                $scope.getPostList(item);
            })
        })
        $scope.delPost=function(list,item){
            
            list.splice(list.indexOf(item),1)
            $scope.selectPermission()
                
        }
        $scope.selectPermission=function(){
         
            //数据权限里面的数据+岗位的数据
               var arr=[]
                $scope.posts.forEach(v=>{
                   
                   if(v.parentParkDeptId && checkIds.indexOf(v.parentParkDeptId)==-1){
                       arr.push(v.parentParkDeptId)
                   }else if(checkIds.indexOf(v.deptId)==-1){
                       arr.push(v.deptId)
                   }
               })
              
               deptIdList=arr.concat(checkIds)
                flatDeptTreeNoParkSon.map(function (n) {
                    if (deptIdList.indexOf(n.id) > -1) {
                        n.state = n.state || {};
                        n.state.checked = true;
                    }else{
                       n.state = n.state || {};
                       n.state.checked = false;
                    }
                });
                calcuPersonDept();
           }
           $scope.clearDept=function(){
           
           }

        //获取工作交接
        $http.get("/ovu-pcos/pcos/personhandover/getHandoverModules/"+person.id).success(function(resp){
           $scope.personHandoverList=resp.data || []
        })

        $scope.getPostList = function(item,node){
         
           if(node){
                 item.deptFullName=node.fullPath
                 if(node.parentPark){
                    //父节点是park
                    item.parentParkDeptId=node.pidCopy
                    
                }else{
                      item.parentParkDeptId=null
                }
                $scope.selectPermission()  
            }else{
                
            }
            item.postList = [];
            item.deptId && $http.get("/ovu-base/pcos/person/getPost.do?id="+item.deptId).success(function(res){
                item.postList = res;
                $rootScope.execTreeNode($scope.deptTreeChange,function(n){
                    if (n.id==item.deptId) {
                        item.parentParkDeptId=n.pidCopy
                      
                        
                    }
                 })
            })
           
      
        }
        //切换状态
        $scope.changeType=function(){
            $scope.personHandoverList && $scope.personHandoverList.forEach(v=>{
                v.personHandover=[]
            })
        }
         //复制第一行选中的人员
        $scope.copyPerson=function(item){
           $scope.personHandoverList.forEach(function(v,i){
                    if(i!==0){
                       v.personHandover = item.personHandover 
                     
                       
       
                    }
                 })
         
        
        }

        //保存
        $scope.save = function(form,change){
            form.$setSubmitted(true);
            if(!form.$valid){
                return;
            }
            if(change.changeType == 3) {
                //离职
                delete change.deptIds;
                delete change.deptNames;
                delete change.postIds;
                delete change.postNames;
                
            }else if(change.changeType == 2){
                //停薪留职
                oldPosts.forEach(function(n,index,list){
                    change.deptIds += n.deptId+(index==list.length-1?"":",");
                    change.deptNames += n.deptName+(index==list.length-1?"":",");
                    change.postIds += n.postId+(index==list.length-1?"":",");
                    var post = n.postList.find(function(p){return p.id == n.postId});
                    change.postNames += post.postName+(index==list.length-1?"":",");
                })

            }else{
                //调岗
                if(!$scope.posts.length){
                     alert('请选择岗位')
                     return
                }
                $scope.posts.forEach(function(post){
                    var dfNames=post.deptFullName?post.deptFullName.split('>'):[];
                    if (dfNames.length>0){
                        post.deptName=dfNames[dfNames.length-1].trim();
                    }
                })

                for(var index =0; index< $scope.posts.length;index++){
                    if(index+1>$scope.posts.length){
                        break;
                    }
                    var curPost = $scope.posts[index];
                    var samePost = $scope.posts.slice(index+1).find(function(n){return n.deptId ==curPost.deptId && n.postId == curPost.postId });
                    if(samePost){
                        var post = samePost.postList.find(function(p){return p.id == samePost.postId});
                        alert("存在重复岗位："+samePost.deptName+" - "+post.postName);
                        return;
                    }
                }

                change.deptIds="",change.deptNames="",change.postIds="",change.postNames="";
                $scope.posts.forEach(function(n,index,list){
                    change.deptIds += n.deptId+(index==list.length-1?"":",");
                    change.deptNames += n.deptName+(index==list.length-1?"":",");
                    change.postIds += n.postId+(index==list.length-1?"":",");
                    var post = n.postList.find(function(p){return p.id == n.postId});
                    change.postNames += post.postName+(index==list.length-1?"":",");
                })
            }
             // 逻辑变更
           /* if(change.changeType == 1 || change.changeType == 3){ //调岗、离职
                $http.post("/ovu-pcos/pcos/workunit/getTodoJobs.do",{personId:person.id},fac.postConfig).success(function(resp) {
                    if(resp.success){
                        var data=resp.data;
                        data.name=person.name;
                        if(data.jhNum || data.yjNum || data.authNum || data.permissionNum){
                            $uibModal.open({
                                animation: false,
                                size:'',
                                templateUrl: 'notToDo.html',
                                controller: 'personNotToDoModalCtrl'
                                ,resolve: {data: function(){return data}}
                            });
                        }else{
                            doSave();
                        }
                    } else {
                        alert('获取未完成事项失败!');
                    }
                })
            }else{
                doSave();
            }*/
            doSave();

            function doSave(){
              
                $scope.personHandoverList.forEach(v=>{
                   if(v.personHandover){
                      v.personHandover.newPersonId=v.personHandover.id
                     v.personHandover.personId=person.id
                 }else{
                    flag=false
                 }

                })
                if(!flag){
                  alert('请选择部门内的人员')
                  return 
                }
                change.personHandoverList=$scope.personHandoverList
                change.permissionDeptIds=deptIdList.join(',')
                
                $http.post("/ovu-pcos/pcos/personchange/save.do",change).success(function(data, status, headers, config) {
                    if(data.code==0){
                        $uibModalInstance.close();
                        msg("保存成功!");
                    } else {
                        alert('保存失败!');
                    }
                })
            }
        }
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    });

    app.controller('personNotToDoModalCtrl', function($scope,$http,$uibModalInstance,fac,data) {
        $scope.item = data;

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    });

})();
