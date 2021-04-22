/**
 * Created by Zn on 2018/4/19.
 */
(function () {
    "use strict";
    var app = angular.module("angularApp");

    app.controller('powerSettingCtrl', function ($scope, $rootScope, $uibModal, $state, $http, $filter, fac) {
        document.title='权限设置';
        $scope.pageModel = {};
        $scope.search={};
        var urlList='';
        var urlDel='';
        app.modulePromiss.then(function () {
            $scope.search = {personRole:0};
            $scope.find(1);
        });
        $scope.toggleManager=function () {
            // $scope.search.personName='';
            $scope.search.personRole=0;
            $scope.find();
        };
        $scope.toggleMainManager=function () {
            // $scope.search.mName='';
            $scope.search.personRole=1;
            $scope.find();
        };
        $scope.showManager=function (item) {
            var copy=angular.extend({},item);
            // copy= angular.extend(copy,{parkId: $scope.search.parkId});
            var modal = $uibModal.open({
                animation: false,
                size: 'max',
                templateUrl: '/view/log/permissions/modal.newpermissionsEdit.html',
                controller: 'managerPermissionCtrl',
                resolve: {
                    param: copy
                }
            });
            modal.result.then(function() {
                $scope.find();
            });
        };
        $scope.showMainManager=function (item) {
            var param=item;
            var modal = $uibModal.open({
                animation: false,
                size: 'lg',
                templateUrl: '/view/managermailbox/modal.mainManagerPermission.html',
                controller: 'mainManagerPermissionCtrl',
                resolve: {
                    param: param
                }
            });
            modal.result.then(function() {
                $scope.find();
            });
        };
        $scope.find = function (pageNo) {
            if($scope.search.personRole==0){
                urlList='/ovu-pcos/pcos/m_email/list';
                $scope.search.mName = $scope.search.user?$scope.search.user.name:undefined;
                $scope.search.gmName && delete  $scope.search.gmName
            }
            else {
                urlList='/ovu-pcos/pcos/gm_email/list';
                $scope.search.gmName = $scope.search.user?$scope.search.user.name:undefined;
                $scope.search.mName && delete  $scope.search.mName
            }
            $.extend($scope.search, {currentPage: pageNo || 1, pageSize: $scope.pageModel.pageSize || 10});

            $scope.search.pageIndex = $scope.search.currentPage - 1;
            fac.getPageResult(urlList, $scope.search, function (res) {
                $scope.pageModel = res;
              /*  pageModel.data = pageModel.data.map(function (item) {
                    item.personNameList = item.personNameList.split(",");
                    return item;
                })*/
            });
        };
        $scope.batchDel=function () {
            var checkedItems = $scope.pageModel.data.filter(function (item) {
                return item.checked;
            });
            var checkedItemsId = '';
            for (var i = 0; i < checkedItems.length; i++) {
                checkedItemsId += checkedItems[i].id + ',';
            }
            checkedItemsId = (checkedItemsId.substring(checkedItemsId.length - 1) === ',') ? checkedItemsId.substring(0, checkedItemsId.length - 1) : checkedItemsId;
            if($scope.search.personRole==0){
                urlDel='/ovu-pcos/pcos/m_email/delete';
            }
            else {
                urlDel='/ovu-pcos/pcos/gm_email/delete';
            }
            confirm("删除选中的数据？", function () {
                $http.post(urlDel,{ids:checkedItemsId},fac.postConfig).success(function (res) {
                    if(res.success){
                        msg('删除成功');
                        $scope.find();
                    }else{
                        if(!res.msg){
                            alert("操作失败")
                        }else{
                            alert(res.msg)
                        }
                        
                    }
                })
            });
        }
        $scope.del=function (item) {
            if($scope.search.personRole==0){
                urlDel='/ovu-pcos/pcos/m_email/delete';
            }
            else {
                urlDel='/ovu-pcos/pcos/gm_email/delete';
            }
            confirm("删除此条数据？", function () {
                $http.post(urlDel,{ids:item.id},fac.postConfig).success(function (res) {
                    if(res.success){
                        msg('删除成功');
                        $scope.find();
                    }else{
                        if(!res.msg){
                            alert("操作失败")
                        }else{
                            alert(res.msg)
                        }
                        
                    }
                })
            });

        }
    });

    app.controller('managerPermissionCtrl', repositoryEditModalCtrl);
    function repositoryEditModalCtrl($scope, $timeout, $uibModalInstance, $http, fac, param) {
        var vm = $scope.vm = this;
        $scope.leaderList = {};
        $scope.parkList = {};
        $scope.personList = {};
        // $scope.search = { parkId: param.parkId ||''};
        fac.setPostDict($scope);
        $scope.persons=[];
        $scope.personlist=[];
        $scope.shows = "";
        vm.type;
        var parkId = param.parkId;
        var permissionId=param.id;
        $scope.parkNameList = [];
        $scope.personNameList=[];
        $scope.show = ""
        $scope.parks = [];
        $scope.parkLength=0;
        $scope.treeDataList=[];
        $scope.search={}

        //编辑权限
        if (fac.isNotEmpty(permissionId)) {
            $http.get("/ovu-pcos/pcos/m_email/detail?id=" + permissionId).success(function (data, status, headers, config) {

                var parkList=data.parkList.reduce(function(ret, n) {
                    n.parkName && ret.push(n.parkName
                    );
                    return ret
                }, []);
                var parkIdList=data.parkList.reduce(function(ret, n) {
                    n.parkId && ret.push(n.parkId
                    );
                    return ret
                }, []);
                $scope.tree(parkIdList.join(','));
                // var parkList=data.data.parkName.split(",");
                $scope.parkLength=parkList.length;
                //需要将id也放入，以便后面的判断
                var i=0;
                parkList.forEach(function (parkName) {
                    // $scope.parkList.forEach(function(v){
                    //     if(v.parkName==parkName){
                    //          v.checked=true
                    //     }
                    //    })
                    var temp={};
                	temp.parkName =parkName;
                    temp.id=parkIdList[i];
                	$scope.parks.push(temp);
                    $scope.parkNameList.push(temp);

                	i++;
                })

                $scope.pName=data.mList[0].name;
                $scope.parentId=data.mList[0].managerId;
                var personList = data.pList.reduce(function(ret, n) {
                    n.name && ret.push(n.name
                    );
                    return ret
                }, []);
                var perIdList = data.pList.reduce(function(ret, n) {
                    n.personId && ret.push(n.personId
                    );
                    return ret
                }, []);
              //需要将id也放入，以便后面的判断
                var j=0;
                personList.forEach(function (personName) {

                	var temp={};
                	temp.personName =personName;
                	temp.id = perIdList[j];
                	$scope.persons.push(temp);
                	$scope.personlist.push(temp);
                	j++;
                })
                $scope.personIdList=param.personIdList;
                $scope.findParks();
            })
        }
        // else{
        //     $scope.findParks();
        // }
        $scope.checkPost = function (item, data) {
            item.checked = !item.checked;
            if (data) {
                item.checked = data.data.every(function (v) {
                    return !v.checked;
                });
                item.checked = item.checked;
            }

            $scope.pName = item.personName;
            $scope.parentId=item.id;
        }

        $scope.checkPerson = function (item, data) {
            item.checked = !item.checked;
            if (data) {
                data.checked = data.data.every(function (v) {
                    return v.checked;
                });
            }
            if (item.checked) {
            	var isSelected=false;
            	$scope.personlist&&$scope.personlist.forEach(function (person) {
            		if(item.id==person.id){
            			isSelected=true;
            		}

                })
                //在编辑状态下如果在编辑前没有被选中的才加入
                if(!isSelected){
                    $scope.personlist.push(item);
                }

                if ($scope.personlist.length > 10) {
                    $scope.persons = $scope.personlist.slice(0, 10)
                } else {
                    $scope.persons = $scope.personlist;
                }
            } else{
                if($scope.personlist.length>10){
                    // $scope.personlist.splice( $scope.personlist.indexOf(item), 1);
                    var i=0;
                	$scope.personlist && $scope.personlist.forEach(function (person) {
                		if(item.id==person.id){
                			 $scope.personlist.splice(i, 1);
                			 return;

                		}
                    i++;
                    })
                    $scope.persons=$scope.personlist.slice(0, 10);
                }else{
                    // $scope.personlist.splice( $scope.personlist.indexOf(item), 1);

                    var i=0;
                	$scope.personlist && $scope.personlist.forEach(function (person) {
                		if(item.id==person.id){
                			 $scope.personlist.splice(i, 1);
                			 return;

                		}
                    i++;
                    })
                    $scope.persons=$scope.personlist.slice(0, 10);
                    $scope.persons = $scope.personlist;
                }

            }

        }
        $scope.checkPersonAll = function (data) {
            data.checked = !data.checked;
            data.data.forEach(function (n) {
                n.checked = data.checked
                	var isSelected=false;
                	$scope.personlist&&$scope.personlist.forEach(function (person) {
                		if(n.id==person.id){
                			isSelected=true;
                		}

                    })
                    //在编辑状态下如果在编辑前没有被选中的才加入
                    if(!isSelected){
                    	$scope.personlist.push(n);
                    }
                    if(!n.checked && isSelected){
                        var i=0;
                       $scope.personlist.forEach(function(v){
                             i++;
                           if(v.id==n.id){
                              $scope.personlist.splice(i-1,1) ;
                           }
                         })

                     }


            });
            $scope.shows = ""
            $scope.persons = $scope.personlist.slice(0, 10)

        }
        $scope.getmores = function () {
            $scope.persons = $scope.personlist;
            $scope.shows = true;
        }
        $scope.getlesss = function () {
            $scope.persons = $scope.personlist.slice(0, 10);
            $scope.shows = false;
        }
         //删除下属
         $scope.delP = function (per, p) {
            $scope.personList.data && 	$scope.personList.data.forEach(function(v){
                (v.id==p.id) && (v.checked=false)
            })
            p.checked = false;
            if (per.length <= 10) {
                per.splice( per.indexOf(p), 1);
                $scope.persons = per;
                //这是提交保存的数据对象
                $scope.personlist=per;
                $scope.show = ""
            } else {
                per.splice( per.indexOf(p), 1);
                //这是提交保存的数据对象
                $scope.personlist=per;
                $scope.persons=per.slice(0, 10);
            }
            $scope.personlist=per;

        };

        $scope.checkpark = function (item, data) {
            item.checked = !item.checked;
            if (data) {
                data.checked = data.data.every(function (v) {
                    return v.checked;
                });
            }
            if (item.checked) {
             	var isSelected=false;
            	$scope.parkNameList&&$scope.parkNameList.forEach(function (park) {
            		if(item.id==park.id){
            			isSelected=true;
            		}

                })
                //在编辑状态下如果在编辑前没有被选中的才加入
                if(!isSelected){
                	 $scope.parkNameList.push(item);
                }

                if ($scope.parkNameList.length > 2) {
                    $scope.parks = $scope.parkNameList.slice(0, 2)
                } else {
                    $scope.parks = $scope.parkNameList;
                }
            } else{
                if($scope.parkNameList.length>2){
                    // $scope.parkNameList.splice( $scope.parkNameList.indexOf(item), 1);
                    $scope.parks=$scope.parkNameList.slice(0, 2);
                    var i=0;
                	$scope.parkNameList&& $scope.parkNameList.forEach(function (person) {
                		if(item.id==person.id){
                            $scope.parkNameList.splice(i, 1);
                			 return;

                		}
                    i++;
                    })
                    $scope.parks = $scope.parkNameList;
                    $scope.parks=$scope.parkNameList.slice(0, 2);
                }else{
                    var i=0;
                	$scope.parkNameList&& $scope.parkNameList.forEach(function (person) {
                		if(item.id==person.id){
                            $scope.parkNameList.splice(i, 1);
                			 return;

                		}
                    i++;
                    })
                    $scope.parks = $scope.parkNameList
                    // $scope.parkNameList.splice( $scope.parkNameList.indexOf(item), 1);
                    // $scope.parks = $scope.parkNameList;

                }

            }
       var parkNames=[];
        $scope.parkNameList.forEach(function(v){
            parkNames.push(v.id);
        });
        $scope.parkLength=parkNames.length;
        if($scope.parkLength==0){
            parkNames='';
        }else{
            parkNames=parkNames.join(",");
        }
        if(parkNames==''){
            $scope.hasDep=true;
            $scope.personList.data=[];
        }
        $scope.tree(parkNames);

        }
            //部门数
            $scope.config = {
                edit: false,
                showCheckbox: true
            }
             // var factree = [];
             $scope.tree=function(ids){
                $scope.treeData=[];
                $http.post("/ovu-base/system/dept/tree",).success(function (data) {
                    $scope.treeData=data || []
                        //   $scope.treeDataList[0].state = { selected: true };
                        //  factree = fac.treeToFlat($scope.treeDataList);

                        //  $scope.search.DEPT_ID =  $scope.treeDataList[0].did;
                     });
                     deptIds=[];
            }
        $scope.checkparkAll = function (data) {
            data.checked = !data.checked;
            data.data.forEach(function (n) {
                n.checked = data.checked

                	var isSelected=false;
                	$scope.parkNameList&&$scope.parkNameList.forEach(function (park) {
                		if(n.id==park.id){
                			isSelected=true;
                		}

                    })
                    //在编辑状态下如果在编辑前没有被选中的才加入
                    if((!isSelected) && (n.checked)){
                    	 $scope.parkNameList.push(n);
                    }
                    if(!n.checked && isSelected){
                       var i=0;
                       $scope.parkNameList.forEach(function(v){
                            i++;
                          if(v.id==n.id){
                              $scope.parkNameList.splice(i-1,1) ;
                          }
                        })

                    }

            });
            $scope.show = ""
            $scope.parks = $scope.parkNameList.slice(0, 2);
            var ids = $scope.parkNameList.reduce(function (ret, n) {
                ret.push(n.id);
                return ret;
            }, []).join();
            if( $scope.parks ==''){
                $scope.hasDep=true;
                $scope.personList.data=[];
            }
            $scope.tree(ids);
        }
        $scope.tree();
        $scope.getmore = function () {
            $scope.parks = $scope.parkNameList;
            $scope.show = true;
        }
        $scope.getless = function () {
            $scope.parks = $scope.parkNameList.slice(0, 2);
            $scope.show = false;
        }
        //删除项目
        $scope.del = function (parks, p) {
            $scope.parkList.data && $scope.parkList.data.forEach(function(v){
              (v.id==p.id) && (v.checked=false)
            })
            p.checked = false;
            if (parks.length <= 2) {
                parks.splice( parks.indexOf(p), 1);
                $scope.parks = parks;
                $scope.parkNameList = parks;
                $scope.show = ""
            } else {
                parks.splice( parks.indexOf(p), 1);
                $scope.parkNameList = parks;
                $scope.parks=parks.slice(0, 2);
            }
            var ids = $scope.parkNameList.reduce(function (ret, n) {
                ret.push(n.id);
                return ret;
            }, []).join();
            $scope.tree(ids);
        };

        //领导人员列表
        $scope.find = function (pageNo) {
            $scope.search.personName = $scope.search.highUser?$scope.search.highUser.name:undefined;
            angular.extend($scope.search, { currentPage: pageNo || $scope.leaderList.currentPage || 1, pageSize: $scope.leaderList.pageSize || 10 });
            fac.getPageResult("/ovu-pcos/pcos/worklogs/multi/worklogpermission/personlist.do", $scope.search, function (data) {
                $scope.leaderList = data.data;
                $scope.leaderList.currentPage = $scope.leaderList.pageIndex + 1;
                $scope.leaderList.totalPage = $scope.leaderList.pageTotal;
                $scope.search.totalCount = $scope.leaderList.totalRecord = $scope.leaderList.totalCount;
                if ($scope.leaderList.data && $scope.leaderList.data.length >= 0) {
                    $scope.leaderList.list = $scope.leaderList.data;
                }
                var pages = [];
                var hash = {};
                var list = [1, $scope.search.currentPage - 1, $scope.search.currentPage, $scope.search.currentPage + 1, $scope.leaderList.pageTotal];
                list.forEach(function (v) {
                    if (!hash[v] && v <= $scope.leaderList.pageTotal && v > 0) {
                        hash[v] = true;
                        pages.push(v);
                    }
                })
                if (pages.length > 2 && pages.indexOf(2) == -1) {
                    pages.splice(1, 0, '······');
                }
                if (pages.length > 2 && pages.indexOf($scope.leaderList.pageTotal - 1) == -1) {
                    pages.splice(pages.length - 1, 0, '······');
                }
                $scope.leaderList.pages = pages;
            });
        }
        $scope.find();
        //项目信息列表
        $scope.findParks = function (pageNo) {
            angular.extend($scope.search, { currentPage: pageNo || $scope.parkList.currentPage || 1, pageSize: $scope.parkList.pageSize || 10 });
            delete $scope.search.parkId;
            delete $scope.search.DEPT_ID;
            fac.getPageResult("/ovu-pcos/pcos/worklogs/multi/worklogpermission/parklist.do", $scope.search, function (data) {
                $scope.parkList = data.data;
                $scope.parkList.data.forEach(function(v){
                    $scope.parkNameList.forEach(function(n){
                            if(n.id==v.id){
                                v.checked=true;
                            }
                    })
                })
                $scope.parkList.currentPage = $scope.parkList.pageIndex + 1;
                $scope.parkList.totalPage = $scope.parkList.pageTotal;
                $scope.search.totalCount = $scope.parkList.totalRecord = $scope.parkList.totalCount;
                if ($scope.parkList.data && $scope.parkList.data.length >= 0) {
                    $scope.parkList.list = $scope.parkList.data;
                }
                var pages = [];
                var hash = {};
                var list = [1, $scope.search.currentPage - 1, $scope.search.currentPage, $scope.search.currentPage + 1, $scope.parkList.pageTotal];
                list.forEach(function (v) {
                    if (!hash[v] && v <= $scope.parkList.pageTotal && v > 0) {
                        hash[v] = true;
                        pages.push(v);
                    }
                })
                if (pages.length > 2 && pages.indexOf(2) == -1) {
                    pages.splice(1, 0, '······');
                }
                if (pages.length > 2 && pages.indexOf($scope.parkList.pageTotal - 1) == -1) {
                    pages.splice(pages.length - 1, 0, '······');
                }
                $scope.parkList.pages = pages;

            });
        }
        $scope.findParks();

        function expandFather(node) {
            var father = $scope.treeData.find(function (n) {
                return n.did == node.pdid
            });
            if (father) {
                father.state = father.state || {};
                father.state.expanded = true;
                expandFather(father);
            }
        }
        function uncheckFather(node) {
            var father = $scope.treeData.find(function (n) { return n.parkId == node.pid });
            if (father) {
                father.state = father.state || {};
                father.state.checked = false;
                uncheckFather(father);
            }
        }

        var deptIds=[];
        var dep="";
        $scope.hasDep=true;
        $scope.check = function (node) {
            node.state = node.state || {};
            node.state.checked = !node.state.checked;
            function checkSons(node, status) {
                node.state = node.state || {};
                node.state.checked = status;

                if(node.state.checked){
                    deptIds.push(node.id);

                }else{
                    // deptIds.splice(deptIds.indexOf(deptIds[node.did],1)) ;
                    var i=0;
                    deptIds &&  deptIds.forEach(function(v){
                       if(v==node.id) {

                          deptIds.splice(i,1);
                       }
                       i++;
                    })
                }
                if (node.nodes && node.nodes.length) {
                    node.nodes.forEach(function (n) {
                        checkSons(n, status);
                    })
                }
            }
            if (node.state.checked) {
                checkSons(node, true);
                if (!node.node) {

                }
            } else {
                checkSons(node, false);

            }
            dep=deptIds.join(",");
            if(dep){
                $scope.findPerson(1,dep);
                $scope.hasDep=false;
            }
            else {
                $scope.personList.data=[];
                $scope.hasDep=true;
            }

        }

        //查询下属人员列表
        $scope.findPerson = function (pageNo,id) {
            delete $scope.search.deptId;
            id=dep
            angular.extend($scope.search, { currentPage: pageNo || $scope.personList.currentPage || 1, pageSize: $scope.personList.pageSize || 10,
                personName:$scope.lowerUser?$scope.lowerUser.name:undefined,
                deptIds:id
            });
            fac.getPageResult("/ovu-pcos/pcos/worklogs/multi/worklogpermission/personlist.do", $scope.search, function (data) {
                $scope.personList = data.data;
                $scope.personList.data.forEach(function(v){
                    $scope.personlist.forEach(function(n){
                       if(n.id==v.id){
                            v.checked=true;
                       }
                    })
                })
                $scope.personList.currentPage = $scope.personList.pageIndex + 1;
                $scope.personList.totalPage = $scope.personList.pageTotal;
                $scope.search.totalCount = $scope.personList.totalRecord = $scope.personList.totalCount;
                if ($scope.personList.data && $scope.personList.data.length >= 0) {
                    $scope.personList.list = $scope.personList.data;
                }
                var pages = [];
                var hash = {};
                var list = [1, $scope.search.currentPage - 1, $scope.search.currentPage, $scope.search.currentPage + 1, $scope.personList.pageTotal];
                list.forEach(function (v) {
                    if (!hash[v] && v <= $scope.personList.pageTotal && v > 0) {
                        hash[v] = true;
                        pages.push(v);
                    }
                })
                if (pages.length > 2 && pages.indexOf(2) == -1) {
                    pages.splice(1, 0, '······');
                }
                if (pages.length > 2 && pages.indexOf($scope.personList.pageTotal - 1) == -1) {
                    pages.splice(pages.length - 1, 0, '······');
                }
                $scope.personList.pages = pages;
            });
        }

        vm.save = function () {
            if (fac.isEmpty($scope.parentId) ||  fac.isEmpty($scope.personlist)) {
                alert("请填写数据");
                return;
            }
            // var personIdList = vm.staffs.map(function (obj) {
            //     return obj.personId;
            // })
            $scope.personlists=[]
            $scope.personlist.forEach(function(v){
                $scope.personlists.push(v.id);
            })
            $scope.personlists=$scope.personlists.join(",");
           
            var params = {
                managerId: $scope.parentId,
               
                 personId: $scope.personlists,
                 id:param ? param.id:'',
                };
                $http.post('/ovu-pcos/pcos/m_email/edit',params,fac.postConfig).success(function (res) {
                    if(res.success){
                        if(res.msg){
                            layer.alert(res.msg, { btn: ['确定'], title: false });

                        }else{
                            msg("保存成功");
                        }
                        $uibModalInstance.close();
                    }
                    else {
                        alert('操作失败');
                    }
                })

        }

        vm.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };

    }
    app.controller('mainManagerPermissionCtrl', function ($scope, $http, $uibModal, $uibModalInstance, $filter, fac, param) {
        $scope.search={}
        $scope.pageModelMainManager = {};
        $scope.pageModelManager = {};
        $scope.searchMainManager={};
        $scope.searchManager={};
        $scope.managerList=[];
        $scope.managerIdArr=[];
        $scope.gmItem={};
        $scope.item=param;
        /*$http.post('/ovu-pcos/pcos/star/record/list',{personId:param.ID},fac.postConfig).success(function (data) {
         $scope.pageModel = data
         })*/
        //判断是新增还是编辑操作
        if(param){
            //编辑操作 回显数据
            $http.post('/ovu-pcos/pcos/gm_email/detail',{id:param.id},fac.postConfig).success(function (res) {
                var managerId='';
                /*res.mNameList=res.mNameList.join(',');*/
                $scope.gmItem.gmName=res.gmName;
                $scope.gmItem.gmId=res.gmId;
                res.mList.forEach(function (v) {
                    managerId+=v.managerId+',';
                });
                res.mList.forEach(function (v) {
                    var obj={};
                    obj.managerId=v.managerId;
                    obj.mName=v.name;
                    $scope.managerList.push(obj);
                })
                $scope.managerIds=managerId;
            })
        }
        //总经理列表查询
        $scope.findMainManager=function (pageNo) {
            $.extend($scope.searchMainManager, {currentPage: pageNo || 1, pageSize: $scope.pageModelMainManager.pageSize || 10});
            $scope.searchMainManager.pageIndex = $scope.searchMainManager.currentPage - 1;
            fac.getPageResult('/ovu-pcos/pcos/gm_email/allList', $scope.searchMainManager, function (res) {
                $scope.pageModelMainManager = res;
                $scope.pageModelMainManager.currentPage = $scope.pageModelMainManager.pageIndex + 1;
                $scope.pageModelMainManager.totalPage = $scope.pageModelMainManager.pageTotal;
                $scope.search.totalCount = $scope.pageModelMainManager.totalRecord = $scope.pageModelMainManager.totalCount;
                if ($scope.pageModelMainManager.data && $scope.pageModelMainManager.data.length >= 0) {
                    $scope.pageModelMainManager.list = $scope.pageModelMainManager.data;
                }
            });
        }
        //经理列表查询
        $scope.findManager=function (pageNo) {
            $.extend($scope.searchManager, {currentPage: pageNo || 1, pageSize: $scope.pageModelManager.pageSize || 10});
            $scope.searchManager.pageIndex = $scope.searchManager.currentPage - 1;
            fac.getPageResult('/ovu-pcos/pcos/m_email/allList', $scope.searchManager, function (res) {
                $scope.pageModelManager = res;
                $scope.pageModelManager.currentPage = $scope.pageModelManager.pageIndex + 1;
                $scope.pageModelManager.totalPage = $scope.pageModelManager.pageTotal;
                $scope.search.totalCount = $scope.pageModelManager.totalRecord = $scope.pageModelManager.totalCount;
                if ($scope.pageModelManager.data && $scope.pageModelManager.data.length >= 0) {
                    $scope.pageModelManager.list = $scope.pageModelManager.data;
                }
            });
        };

        $scope.checkPost = function (item, data) {
            /*item.checked = !item.checked;
            if (data) {
                item.checked = data.data.every(function (v) {
                    return !v.checked;
                });
                item.checked = item.checked;
            }*/
            $scope.gmItem.gmName = item.gmName;
            $scope.gmItem.gmId=item.gmId;
        }

        $scope.checkAll = function (data) {
            data.checked = !data.checked;
            data.list.forEach(function (item) {
                item.checked = data.checked
                if (item.checked) {
                    if(JSON.stringify($scope.managerList).indexOf(item.managerId)==-1){
                        $scope.managerList.unshift(item);
                    }
                }
                else{
                    $scope.managerList.splice($scope.managerList.indexOf(item), 1);
                }
            });
            $scope.managerList.forEach(function (v) {
                $scope.managerIdArr.push(v.managerId);
            })
            $scope.managerIds=$scope.managerIdArr.join(',');
            $scope.managerIdArr=[];
        }

        $scope.checkSonPost = function (item, data) {
            item.checked = !item.checked;
            if (data) {
                data.checked = data.data.every(function (v) {
                    return v.checked;
                });
            }
            if (item.checked) {
                if(JSON.stringify($scope.managerList).indexOf(item.managerId)==-1){
                    $scope.managerList.unshift(item);
                }
                else {
                    alert('不允许重复添加');
                }
            }
            else{
                $scope.managerList.splice($scope.managerList.indexOf(item), 1);
            }
            $scope.managerList.forEach(function (v) {
                $scope.managerIdArr.push(v.managerId);
            })
            $scope.managerIds=$scope.managerIdArr.join(',');
            $scope.managerIdArr=[];
        }
        $scope.del = function (managerList, p) {
            $scope.managerList.forEach(function(v){
                (v.managerId==p.id) && (v.checked=false)
              })
            p.checked = false;
            managerList.splice(managerList.indexOf(p), 1);
            $scope.managerList = managerList;
            $scope.show = ""
            $scope.managerList.forEach(function (v) {
                $scope.managerIdArr.push(v.managerId);
            })
            $scope.managerIds=$scope.managerIdArr.join(',');
            $scope.managerIdArr=[];
        };
        $scope.save=function () {
            var obj={
                id:param?param.id:'',
                gmId:$scope.gmItem.gmId,
                managerId:$scope.managerIds
            }
            if(!obj.gmId){
                alert('请选择总经理');
                return;
            }
            if(!obj.managerId){
                alert('请选择经理');
                return;
            }
             //判断是否有重复值


            var gmIdList=$scope.gmItem.gmId.split(',');
             var managerIdList=$scope.managerIds.split(',');
             var arr1=gmIdList.concat(managerIdList);
             function repeat(arr)
             {
                return /(\x0f[^\x0f]+)\x0f[\s\S]*\1/.test("\x0f"+arr.join("\x0f\x0f") +"\x0f");
             }
             if(repeat(arr1)){
                 alert('领导和组员重复');
                return
             }
            $http.post('/ovu-pcos/pcos/gm_email/edit',obj,fac.postConfig).success(function (res) {
                if(res.success){
                    if(res.msg){
                        layer.alert(res.msg, { btn: ['确定'], title: false });
                    }else{
                        msg("保存成功");
                    }
                    $uibModalInstance.close();
                }
                else {
                    alert('操作失败');
                }
            })
        }
        $scope.findMainManager();
        $scope.findManager();
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    })
})();
