/**
 * Created by Administrator on 2017/7/20.
 */
(function () {
    "use strict";
    var app = angular.module("angularApp");
    app.controller("personCtl", function (
        $scope,
        $rootScope,
        $http,
        $filter,
        $uibModal,
        fac
    ) {
        document.title = "OVU-人员管理";
        $scope.search = { jobStatus: 1 };
        $scope.pageModel = {list:[]};
        $scope.moduleRoles = [];

        listmoduleroles();
       

        app.modulePromiss.then(function () {
            $scope.deptTree = fac.getGlobalTree();
            fac.setPostDict($rootScope);
            if ($scope.deptTree.length) {
                $scope.search.deptId = $scope.deptTree[0].id;
            }
        });

        $scope.setDept = function (search, node) {
            if (node.state.selected) {
                $http
                    .get("/ovu-base/pcos/person/getPost.do?id=" + search.deptId)
                    .success(function (res) {
                        $scope.search.postList = res;
                    });
                $scope.find(1);
            } else {
                $scope.search.postList = [];
            }
        };
        var timestamp = Date.parse(new Date());

        /**/
        //列表查询
        $scope.find = function (pageNo) {
            if (!$scope.search.deptId) {
                return;
            }
            $.extend($scope.search, {
                currentPage: pageNo || $scope.pageModel.currentPage || 1,
                pageSize: $scope.pageModel.pageSize || 10,
            });
            fac.getPageResult(
                "/ovu-base/pcos/person/listByGrid.do",
                $scope.search,
                function (data) {
                    data.list.forEach(function (n) {
                        n.postList = [];
                        n.deptList = [];
                        n.mrList = [];
                        //创建时间往后推7天,才可以生成通知单
                        n.createTimeStamp =
                            new Date(n.createTime).getTime() +
                            7 * 24 * 60 * 60 * 1000; //将创建时间转为时间戳,并获取7天之后的时间

                        if (timestamp <= n.createTimeStamp) {
                            //当前时间在创建时间7天之类
                            n.hasSetNotice = true;
                        } else {
                            n.hasSetNotice = false;
                        }

                        if (n.deptIds) {
                            var deptPark = n.deptIds.split(",");
                            n.deptList = deptPark.filter(function (m) {
                                return $rootScope.fullflatDeptTree.find(
                                    function (o) {
                                        return o.id == m;
                                    }
                                );
                            });
                        }
                        if (n.postIds) {
                            var deptpost = n.postIds.split(",");
                            var postList = deptpost.map(function (m) {
                                return m.indexOf("^") > 0 ? m.split("^") : null;
                            });
                            n.postList = postList.filter(function (m) {
                                return $rootScope.fullflatDeptTree.find(
                                    function (o) {
                                        return o.id == m[0];
                                    }
                                );
                            });
                            delete n.postIds;
                        }
                        if (n.roleIds) {
                            n.mrList = n.roleIds.split(",");
                        }
                    });
                    $scope.pageModel = data;
                }
            );
        };

        //删除
        $scope.del = function (item) {
            confirm("确认删除该人员吗?", function () {
                $http
                    .post(
                        "/ovu-base/pcos/person/delete.do",
                        { id: item.id },
                        fac.postConfig
                    )
                    .success(function (resp) {
                        if (resp.success) {
                            $scope.find();
                        } else {
                            alert(resp.error);
                        }
                    });
            });
        };

        //新增、编辑
        $scope.showEditModal = function (person) {
            person = person || { jobStatus: 1 };
            var modal = $uibModal.open({
                animation: false,
                size: "lg",
                templateUrl: "/view/person/person.modal.html",
                controller: "personModalCtrl",
                resolve: { person: angular.extend({}, person) },
            });
            modal.result.then(
                function () {
                    $scope.find();
                },
                function () {
                    console.info("Modal dismissed at: " + new Date());
                }
            );
        };

        //人员详情信息
        $scope.showPersonInfo = function (personId) {
            var modal = $uibModal.open({
                animation: false,
                size: "",
                templateUrl: "/view/person/modal.personInfo.html",
                controller: "personInfoModalCtrl",
                resolve: {
                    personId: function () {
                        return personId;
                    },
                },
            });
            modal.result.then(
                function () {},
                function () {
                    console.info("Modal dismissed at: " + new Date());
                }
            );
        };

        //编辑账号
        $scope.showUserModal = function (person) {
            $http
                .get("/ovu-base/sys/admin/get.do", {
                    params: {
                        userId: person.userId,
                        moduleId: app.curModule.id,
                    },
                })
                .success(function (resp) {
                    var user = resp.data;
                    user.personId = person.id;
                    user.jobCode = person.jobCode;
                    user.name = person.name;

                    var modal = $uibModal.open({
                        animation: false,
                        size: "",
                        templateUrl: "/view/person/modal.user.html",
                        controller: "userModalCtrl",
                        resolve: { user: user },
                    });
                    modal.result.then(
                        function () {
                            $scope.find();
                        },
                        function () {
                            console.info("Modal dismissed at: " + new Date());
                        }
                    );
                });
        };
        $scope.hasPersonId = function (data) {
            if (data && data.list && data.list.length) {
                return data.list.filter(function (n) {
                    return n.checked && n.id;
                }).length;
            }
            return false;
        };

        $scope.hasChecked = function (data) {
            if (data && data.list && data.list.length) {
                return data.list.filter(function (n) {
                    return n.checked && n.userId;
                }).length;
            }
            return false;
        };
        // 判断导出按钮是否可以点击
        $scope.hasExport = function (data) {
            return !$scope.hasPersonId(data) || !$scope.search.deptId;
        };
        //账户锁定
        $scope.lockUser = function () {
            var ids = $scope.pageModel.list.reduce(function (ret, n) {
                n.checked && n.userId && ret.push(n.userId);
                return ret;
            }, []);
            ids &&
                $http
                    .get(
                        "/ovu-base/system/user/bathchDisableUser.do?ids=" +
                            ids +
                            ""
                    )
                    .success(function (data) {
                        if (data.code === 0) {
                            msg(data.msg);
                            $scope.find();
                        } else {
                            alert(data.msg);
                        }
                    });
        };
        //密码重置
        $scope.resetPassword = function () {
            var ids = $scope.pageModel.list.reduce(function (ret, n) {
                n.checked && ret.push(n.userId);
                return ret;
            }, []);
            ids &&
                $http
                    .get(
                        "/ovu-base/system/user/bathchResetPwd.do?ids=" +
                            ids +
                            ""
                    )
                    .success(function (data) {
                        if (data.code === 0) {
                            msg(data.msg);
                            $scope.find();
                        } else {
                            alert(data.msg);
                        }
                    });
        };

        //人员详情信息
        $scope.movePerson = function () {
            var ids = $scope.pageModel.list.reduce(function (ret, n) {
                n.checked && ret.push(n.id);
                return ret;
            }, []);
            var userIds = $scope.pageModel.list.reduce(function (ret, n) {
                n.checked && ret.push(n.userId);
                return ret;
            }, []);
            var modal = $uibModal.open({
                animation: false,
                size: "lg",
                templateUrl: "/view/person/personMove.modal.html",
                controller: "personMoveModalCtrl",
                resolve: {
                    personIds: function () {
                        return ids;
                    },
                    userIds: function () {
                        return userIds;
                    },
                },
            });
            modal.result.then(
                function () {
                    $scope.find();
                },
                function () {
                    console.info("Modal dismissed at: " + new Date());
                }
            );
        };

        //批理设置角色
        $scope.setRoleForUsers = function () {
            var userIds = $scope.pageModel.list.reduce(function (ret, n) {
                n.checked && n.userId && ret.push(n.userId);
                return ret;
            }, []);
            var roleIds=$scope.pageModel.list.reduce(function (ret, n) {
                
                n.checked && n.roleIds && ret.push(n.roleIds);
                
                return ret;
            }, []);
           
            var modal = $uibModal.open({
                animation: false,
                size: "lg",
                templateUrl: "/view/person/userRole.modal.html",
                controller: "userRoleModalCtrl",
                resolve: {
                    userIds: function () {
                        return userIds;
                    },
                    roleIds:function(){
                        return roleIds;
                    }
                },
            });
            modal.result.then(
                function () {
                    $scope.find();
                },
                function () {
                    console.info("Modal dismissed at: " + new Date());
                }
            );
        };

        //查询模块角色
        function listmoduleroles() {
            $http
                .get("/ovu-base/sys/listmoduleroles.do")
                .success(function (data) {
                    $scope.moduleRoles = data;
                });
        }

        // 导出人员信息
        $scope.exportPerson = function () {
            // 选中的人员id
            var ids = $scope.pageModel.list.reduce(function (ret, n) {
                n.checked && ret.push(n.id);
                return ret;
            }, []);
            // 选中的部门id
            var deptId = $scope.search.deptId;

            // 导出
            window.location.href =
                "/ovu-base/pcos/person/export?ids=" + ids + "&deptId=" + deptId;
        };

        //生成通知单
        $scope.setNotice = function (person) {
            var modal = $uibModal.open({
                animation: false,
                size: "lg",
                templateUrl: "/view/person/setNotice.modal.html",
                controller: "setNoticeModalCtrl",
                resolve: { person: angular.extend({}, person) },
            });
            modal.result.then(
                function () {
                    $scope.find();
                },
                function () {
                    console.info("Modal dismissed at: " + new Date());
                }
            );
        };
        //查看通知单
        $scope.showNotice = function (person) {
            var modal = $uibModal.open({
                animation: false,
                size: "lg",
                templateUrl: "/view/person/showNotice.modal.html",
                controller: "showNoticeModalCtrl",
                resolve: { person: angular.extend({}, person) },
            });
            modal.result.then(
                function () {},
                function () {
                    console.info("Modal dismissed at: " + new Date());
                }
            );
        };
    });

    app.controller("personInfoModalCtrl", function (
        $scope,
        $http,
        fac,
        $uibModalInstance,
        personId
    ) {
        $http
            .get("/ovu-base/pcos/person/personInfo.do?personId=" + personId)
            .success(function (person) {
                $scope.item = person;
            });
        $scope.cancel = function () {
            $uibModalInstance.dismiss("cancel");
        };
    });
    app.controller("personMoveModalCtrl", function (
        $scope,
        $http,
        fac,
        $uibModalInstance,
        personIds,
        userIds
    ) {
        $scope.posts = [];
        $scope.selectOrg = function (org) {
            $scope.posts = $scope.posts.filter(function (n) {
                return !n.domainId || n.domainId == org.id;
            });
            getOrgTree(org.domainCode);
        };

        function getOrgTree(domainCode) {
            $http
                .get(
                    "/ovu-base/system/dept/rightTree.do?domainCode=" +
                        domainCode
                )
                .success(function (resp) {
                    if (resp.code == 0) {
                        $scope.outSourceDeptTree = resp.data;
                    }
                });
        }

        $scope.getPostList = function (item) {
            if (item.deptId) {
                item.postList = [];
                item.deptId &&
                    $http
                        .get(
                            "/ovu-base/pcos/person/getPost.do?id=" + item.deptId
                        )
                        .success(function (res) {
                            item.postList = res;
                        });
            } else {
                item.postList = [];
            }
        };

        $scope.save = function (form) {
            form.$setSubmitted(true);
            if (!form.$valid) {
                return;
            }
            if (!$scope.posts || $scope.posts.length == 0) {
                alert("请选择岗位！");
                return;
            }
            var deptIds = $scope.posts.reduce(function (ret, n) {
                ret.push(n.deptId);
                return ret;
            }, []);
            var postIds = $scope.posts.reduce(function (ret, n) {
                ret.push(n.postId);
                return ret;
            }, []);

            $http
                .get("/ovu-base/pcos/person/movePersons.do", {
                    params: {
                        personIds: personIds,
                        userIds: userIds,
                        domainId: $scope.org.id,
                        deptIds: deptIds,
                        postIds: postIds,
                    },
                })
                .success(function (resp) {
                    if (resp.code == 0) {
                        msg("迁移成功！");
                        $http.get("/ovu-pcos/pcos/arrange/plan/deleteArrangePlan", {
                            params: {
                                personId: personIds,
                              
                            },
                        })
                        $uibModalInstance.close();
                    }
                });
        };
    });

    app.controller("personModalCtrl", function (
        $scope,
        $rootScope,
        $http,
        $uibModalInstance,
        $uibModal,
        $filter,
        fac,
        person,
        $timeout,
        AMapDupNames
    ) {
        $scope.item = person;
     
        $scope.deptTreeCopy=$scope.$parent.deptTree
        if($scope.deptTreeCopy.length){
            $rootScope.execTreeNode($scope.deptTreeCopy,function(n){
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
      
        $scope.posts = [];
        var deptIdList = [];
        var selectDeptId=[]
        $scope.contactPerson = [];
        //通过身份证号码设置年龄
        function getAGE(value) {
            var myDate = new Date();
            var month = myDate.getMonth() + 1;
            var day = myDate.getDate();
            if (value && value.length == 15) {
                value =
                    value.substring(0, 6) + "19" + value.substring(6, 15) + "0";
            }
            var age = myDate.getFullYear() - value.substring(6, 10) - 1;
            if (
                value.substring(10, 12) < month ||
                (value.substring(10, 12) == month &&
                    value.substring(12, 14) <= day)
            ) {
                age++;
            }
            $scope.item.age = age;
            $scope.item.birthday =
                value.substring(6, 10) +
                "-" +
                value.substring(10, 12) +
                "-" +
                value.substring(12, 14);
        }

        if ($scope.item.contactPerson) {
            $scope.contactPerson = eval("(" + $scope.item.contactPerson + ")");
        }
        if ($scope.item.idCard) {
            getAGE($scope.item.idCard);
        }

        var vm = ($scope.vm = this);

        vm.filteredDeptTree = $.extend(true, [], app.filteredDeptTree);
        var flatDeptTreeNoParkSon = fac.treeToFlat(vm.filteredDeptTree);
        var flatDetpTree = fac.treeToFlat(app.deptTree);

        //部门选择器 计算
        function calcuPersonDept() {
           
            vm.personDeptTree = fac.filterTree(
                $.extend(true, [], vm.filteredDeptTree),
                "id",
                deptIdList,
                true
            );
            
            
        }
        /**
         * 选中部门下所有人员
         * @param node
         */
        $scope.getAge = function (value) {
            getAGE(value);
        };
        var checkIds=[]
        $scope.afterCheck = function (node) {
            checkIds=[]
           if(node.state && node.state.checked && checkIds.indexOf(node.id)==-1){
            checkIds.push(node.id)

           }
          
         
            deptIdList = deptIdList.filter(function (n) {
                return !flatDeptTreeNoParkSon.find(function (m) {
                    return m.id == n 
                });
            });
           
            var ids = flatDeptTreeNoParkSon.reduce(function (ret, n) {
                n.state && n.state.checked && ret.push(n.id);
                return ret;
            }, []);
            
           
         
            deptIdList= ids
           if(node.state && !node.state.checked){
              var arr=[node]
              $rootScope.execTreeNode(arr,function(node){
                if(deptIdList.indexOf(node.id)!==-1){
                  var index=deptIdList.findIndex(function(v){
                    return v==node.id
                  })
                  deptIdList.splice(index,1)
                }
            })
           }
          
            calcuPersonDept();
        
        };

        //获取人员岗位
        if (person && person.id) {
            //初始化当前用户拥有数据权限的部门树
            deptIdList = person.deptIds ? person.deptIds.split(",") : [];
            checkIds=deptIdList
            flatDeptTreeNoParkSon.map(function (n) {
                if (deptIdList.indexOf(n.id) > -1) {
                    n.state = n.state || {};
                    n.state.checked = true;
                }
            });
           
           
           
            $rootScope.execTreeNode(vm.filteredDeptTree,function(node){
                if(deptIdList.indexOf(node.id)!==-1){
                 
                    node.state = node.state || {};
                    node.state.checked = true;
                }else{
                    node.state = node.state || {};
                    node.state.checked = false;
                }
            })
            calcuPersonDept();
            $http
                .get("/ovu-base/pcos/person/getPersonPosts.do?id=" + person.id)
                .then(function (resp) {
                    resp.data.forEach(function (n) {
                        n.text = n.deptFullName;
                        if (
                            !flatDetpTree.find(function (m) {
                                return m.id == n.deptId;
                            })
                        ) {
                            n.readOnly = true;
                        }
                    });
                    $scope.posts = resp.data;
                    $scope.posts.length &&  $scope.posts.forEach(function (item) {
                   
                        $rootScope.execTreeNode($scope.deptTreeCopy,function(n){
                            if (n.id==item.deptId) {
                                item.parentPark=n.parentPark
                                item.pidCopy=n.pidCopy
                                item.parentParkDeptId=n.pidCopy
                                
                            }
                         })
                        
                    })
                    return $scope.posts;
                })
                .then(function (posts) {
                    posts.forEach(function (item) {
                   
                        $rootScope.execTreeNode($scope.deptTreeCopy,function(n){
                            if (n.id==item.deptId) {
                                item.parentPark=n.parentPark
                            
                                item.parentParkDeptId=n.pidCopy
                                
                            }
                         })
                        $scope.getPostList(item);
                    });
                });
        }

        //获取部门下的岗位
        $scope.getPostList = function (item, node) {
            if (node) {
                item.deptFullName = node.fullPath;
                if(node.parentPark){
                    //父节点是park
                    item.parentParkDeptId=node.pidCopy
                      
                }else{

                }
                
               
            }
          
            if (item.deptId) {
                item.postList = [];
               
                item.deptId &&
                    $http
                        .get(
                            "/ovu-base/pcos/person/getPost.do?id=" + item.deptId
                        )
                        .success(function (res) {
                            item.postList = res;
                            item.postList.forEach(v=>{
                                if(item.deptId==v.deptId){
                                  v.parentPark=item.parentPark
                              
                                  v.parentParkDeptId=item.pidCopy
                                }
                            })
                        });

            } else {
                item.postList = [];
            }
            $scope.selectPermission()
        }; 
        $scope.selectPermission=function(){
         
         //数据权限里面的数据+岗位的数据
           
            var arr=[]
             $scope.posts.forEach(v=>{
                
                if(v.parentParkDeptId && checkIds.indexOf(v.parentParkDeptId)==-1){
                    arr.push(v.parentParkDeptId)
                }else if(!v.parentParkDeptId && checkIds.indexOf(v.deptId)==-1){
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

        //保存
        $scope.save = function (form, person) {
            form.$setSubmitted(true);
            if (!form.$valid) {
                return;
            }
            if (!$scope.contactPerson || $scope.contactPerson.length == 0) {
                alert("请添加紧急联系人！");
                return;
            }
            delete person.posts;
            if (!$scope.posts || $scope.posts.length == 0) {
                alert("请选择岗位！");
                return;
            }
          
            // $scope.selectPermission()
      
            person.deptIds=deptIdList.join(',')
           
            if (!person.deptIds) {
                alert("请配置数据权限");
                return;
            }
            
            //检查部门、岗位是否重复
            for (var index = 0; index < $scope.posts.length; index++) {
                if (index + 1 > $scope.posts.length) {
                    break;
                }
                var curPost = $scope.posts[index];
                var samePost = $scope.posts.slice(index + 1).find(function (n) {
                    return (
                        n.deptId == curPost.deptId && n.postId == curPost.postId
                    );
                });
                if (samePost) {
                    var post = samePost.postList.find(function (p) {
                        return p.id == samePost.postId;
                    });
                    alert(
                        "存在重复岗位：" +
                            samePost.deptName +
                            " - " +
                            post.postName
                    );
                    return;
                }
            }

            person.contactPerson = JSON.stringify($scope.contactPerson);
            var posts=[]
           $scope.posts.forEach(v=>{
            posts.push({
                deptId:v.deptId,
                postId:v.postId
            })
           })
             
             person.posts=posts
             
           

            $http
                .post("/ovu-base/pcos/person/save.do", person)
                .success(function (resp, status, headers, config) {
                    if (resp.success) {
                        var deptIds = "",
                            postIds = "";

                        $scope.posts &&
                            $scope.posts.forEach(function (n, index, list) {
                                deptIds +=
                                    n.deptId +
                                    (index == list.length - 1 ? "" : ",");
                                postIds +=
                                    n.postId +
                                    (index == list.length - 1 ? "" : ",");
                            });
                       
                       /*     $http
                            .post(
                                "/ovu-base/pcos/person/save_post_dept.do",
                                {
                                    personId: resp.personId,
                                    deptIds: deptIds,
                                    postIds: postIds,
                                },
                                fac.postConfig
                            )
                            .success(function (resp2) {
                                if (resp.success) {
                                    $uibModalInstance.close();
                                } else {
                                    alert("保存岗位失败！");
                                }
                            });
                        msg("保存成功!");
                        改成一次保存
                        */
                       $uibModalInstance.close();
                       msg("保存成功!");
                    } else {
                        alert(resp.error);
                    }
                });
        };
        $scope.cancel = function () {
            $uibModalInstance.dismiss("cancel");
        };
        //初始化地址选择器参数数

        var option = {
            url: "/ovu-base/system/park/city",
            selectCallback: function (data, val) {
                // 添加功能：选择城市
                var cityInputArr = val.split(",");
                var city = cityInputArr.pop();
                var cityParent = cityInputArr.pop();
                // 判断是不是有重名的行政区名字 比如 朝阳区  北京有一个 长春也有一个
                if (AMapDupNames.isInDupDistincts(city)) {
                    var dupCitys = AMapDupNames.getDupDistincts(city);
                    var res = dupCitys.filter(function (v) {
                        return v.pname === cityParent;
                    });
                    city = res[0].adcode;
                }

                $scope.$emit("选择了行政区", val);

                $timeout(function () {
                    $scope.item.regionName = val;
                    $scope.item.provinceCode = null;
                    $scope.item.cityCode = null;
                    $scope.item.districtCode = null;
                    for (var i = 0; i < data.length; i++) {
                        switch (i) {
                            case 0:
                                $scope.item.provinceCode = data[i];
                                break;
                            case 1:
                                $scope.item.cityCode = data[i];
                                break;
                            case 2:
                                $scope.item.districtCode = data[i];

                                break;
                            default:
                                break;
                        }
                    }
                });
            },
        };
        $timeout(function () {
            //初始化地址选择器
            $("#placeSelect").addressSelect(option);

            //$scope.domainCode = app.domain.domain_code;
        });
    });

    app.controller("userModalCtrl", function (
        $scope,
        $rootScope,
        $http,
        $uibModalInstance,
        $uibModal,
        $filter,
        fac,
        user
    ) {
        $scope.item = user;
        //         1:如果loginName不为空，按照现有的逻辑走
        // 2:如果loginName为空,就用工号和姓名把 账号和昵称补全。
        // 3:如果loginName为空,并且工号也为空,那么久把昵称用性命补全
        //
        $scope.item.loginName = $scope.item.loginName || user.jobCode;
        $scope.item.nickname = $scope.item.nickname || user.name;

        //保存用户
        $scope.save = function (form) {
            form.$setSubmitted(true);
            if (!form.$valid) {
                return;
            }

            var param = {
                id: $scope.item.id,
                loginName: $scope.item.loginName,
            };
            $http
                .post(
                    "/ovu-base/sys/admin/checkLoginNameMute.do",
                    param,
                    fac.postConfig
                )
                .success(function (data) {
                    if (data.isUnique) {
                        doSave();
                    } else {
                        alert("登录账号已被使用！");
                    }
                });

            function doSave() {
                var roleIdList = [];
                $scope.item.modules &&
                    $scope.item.modules.forEach(function (n) {
                        n.roles &&
                            n.roles.forEach(function (m) {
                                m.checked && roleIdList.push(m.id);
                            });
                    });
                $scope.item.roleIds = roleIdList.join();

                //复制对象，删除冗余的上传数据
                var model = angular.extend({}, $scope.item);
                delete model.modules;
                $http
                    .post("/ovu-base/sys/admin/saveAccount.do", model)
                    .success(function (data, status, headers, config) {
                        if (data.code === 0) {
                            $uibModalInstance.close();
                            msg("保存成功!");
                        } else {
                            alert(data.msg);
                        }
                    });
            }
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss("cancel");
        };

        //密码重置
        $scope.resetPassword = function () {
            $http
                .get("/ovu-base/system/user/bathchResetPwd.do?ids=" + user.id)
                .success(function (data) {
                    if (data.code === 0) {
                        msg(data.msg);
                        $uibModalInstance.close();
                    } else {
                        alert(data.msg);
                    }
                });
        };
    });

    app.controller("userRoleModalCtrl", function (
        $scope,
        $rootScope,
        $http,
        $uibModalInstance,
        $uibModal,
        $filter,
        fac,
        userIds,
        roleIds
    ) {
        var ids=userIds
        $http
            .get("/ovu-base/sys/orgRole/listModuleAndRole")
            .success(function (resp) {
                if (resp.code == 0) {
 
                    if(ids.length==1 && roleIds.length==1){
                        var arr=roleIds[0].split(',')
                        $rootScope.execTreeNode(resp.data,function(role){
                            if(role.roles){
                                $rootScope.execTreeNode(role.roles,function(n){
                                    var id=n.id+''
                                  if(arr.indexOf(id)>=0){
                                   
                                      n.checked=true
                                    
      
                                  }
                                 
                              })
                            }
                        })
                    }
                    $scope.modules = resp.data;
                    
                }
            });
        //保存用户
        $scope.save = function () {
            var roleIdList = [];
            $scope.modules &&
                $scope.modules.forEach(function (n) {
                    n.roles &&
                        n.roles.forEach(function (m) {
                            m.checked && roleIdList.push(m.id);
                        });
                });
            $http
                .get("/ovu-base/sys/admin/setRoleForUsers", {
                    params: { roleIds: roleIdList.join(), ids: userIds },
                })
                .success(function (data, status, headers, config) {
                    if (data.code === 0) {
                        $uibModalInstance.close();
                        msg("保存成功!");
                    } else {
                        alert(data.msg);
                    }
                });
        };
    });

    app.controller("setNoticeModalCtrl", function (
        $scope,
        $rootScope,
        $http,
        $uibModalInstance,
        $uibModal,
        $filter,
        fac,
        person
    ) {
        $scope.item = person;
        $scope.search = {};
        $scope.selected={}
       
        function getPerson(deptId){
            var param={
                currentPage: 1,
                pageSize: 10000000,
                deptId: deptId,
            }
            fac.getPageResult(
                "/ovu-base/pcos/person/findPerson_mute.do",
                param,
                function (data) {
                    $scope.personListBlock = data.data;
                }
            );
        }
        //获取员工信息
        $http
            .get("/ovu-pcos/pcos/person/getInfo/" + person.id)
            .success(function (res) {
                $scope.deptName = res.data.deptName;
                $scope.deptId=res.data.deptId
                $scope.number = res.data.number;
                $scope.year = res.data.year;
                $scope.FullYear = new Date(res.data.time).getFullYear();
                $scope.month = new Date(res.data.time).getMonth() + 1;
                $scope.time = new Date(res.data.time).getDate();
                $scope.getTimes = res.data.time.split("-");
               
                getPerson($scope.deptId)
            });
          
           

        //保存
        $scope.save = function (form) {
            form.$setSubmitted(true);
            if (!form.$valid) {
                return;
            }
            

        
            var params = {};
            if(!$scope.selected.value){
             alert('请选择接收人')
             return
            }
            
            var ids = $scope.selected.value.reduce(function (ret, n) {
               ret.push(n.id);
                return ret
            }, []);

            params.content = document.getElementById("html2canvas").innerHTML;
            params.receiverPersonId = ids.join(',');
            params.personId = person.id;
            params.arrivalTime = $scope.item.arrivalTime;
        
            $http
                .post("/ovu-pcos/pcos/person/save", params)
                .success(function (resp, status, headers, config) {
                    if (resp.code == "0") {
                        msg(resp.msg);
                        $uibModalInstance.close();
                    } else {
                        alert(resp.msg);
                        $uibModalInstance.close();
                    }
                });
        };
        $scope.cancel = function () {
            $uibModalInstance.dismiss("cancel");
        };
    });
    app.controller("showNoticeModalCtrl", function (
        $scope,
        $rootScope,
        $http,
        $uibModalInstance,
        $uibModal,
        $sce,
        $filter,
        fac,
        person
    ) {
        $scope.item = person;

        $http
            .get("/ovu-pcos/pcos/person/get/" + person.id)
            .success(function (res) {
                $scope.person = res.data;
                $scope.person.content = $sce.trustAsHtml($scope.person.content);
                $scope.person.createName =
                    app.user.personName || app.user.nickname;
            });

        $scope.cancel = function () {
            $uibModalInstance.dismiss("cancel");
        };
    });
    app.service("AMapDupNames", function () {
        this.dupDistincts = {
            index: [
                { name: "东区", count: 2 },
                { name: "朝阳区", count: 2 },
                { name: "通州区", count: 2 },
                { name: "和平区", count: 2 },
                {
                    name: "河东区",
                    count: 2,
                },
                { name: "长安区", count: 2 },
                { name: "桥西区", count: 3 },
                {
                    name: "新华区",
                    count: 3,
                },
                { name: "桥东区", count: 2 },
                { name: "城区", count: 5 },
                { name: "矿区", count: 2 },
                {
                    name: "郊区",
                    count: 4,
                },
                { name: "新城区", count: 2 },
                { name: "青山区", count: 2 },
                {
                    name: "铁西区",
                    count: 3,
                },
                { name: "铁东区", count: 2 },
                { name: "海州区", count: 2 },
                {
                    name: "西安区",
                    count: 2,
                },
                { name: "向阳区", count: 2 },
                { name: "南山区", count: 2 },
                {
                    name: "宝山区",
                    count: 2,
                },
                { name: "普陀区", count: 2 },
                { name: "鼓楼区", count: 4 },
                {
                    name: "西湖区",
                    count: 2,
                },
                { name: "江北区", count: 2 },
                { name: "永定区", count: 2 },
                {
                    name: "市中区",
                    count: 4,
                },
                { name: "白云区", count: 2 },
                { name: "龙华区", count: 2 },
                {
                    name: "城中区",
                    count: 2,
                },
                { name: "城关区", count: 2 },
            ],
            data: [
                {
                    citycode: "1852",
                    adcode: "810003",
                    name: "东区",
                    center: {
                        O: 22.279693,
                        M: 114.22600299999999,
                        lng: 114.226003,
                        lat: 22.279693,
                    },
                    level: "district",
                    padcode: "810000",
                    pname: "香港特别行政区",
                },
                {
                    citycode: "0812",
                    adcode: "510402",
                    name: "东区",
                    center: {
                        O: 26.546491,
                        M: 101.70410900000002,
                        lng: 101.704109,
                        lat: 26.546491,
                    },
                    level: "district",
                    padcode: "510400",
                    pname: "攀枝花市",
                },
                {
                    citycode: "010",
                    adcode: "110105",
                    name: "朝阳区",
                    center: {
                        O: 39.921506,
                        M: 116.44320500000003,
                        lng: 116.443205,
                        lat: 39.921506,
                    },
                    level: "district",
                    padcode: "110100",
                    pname: "北京城区",
                },
                {
                    citycode: "0431",
                    adcode: "220104",
                    name: "朝阳区",
                    center: {
                        O: 43.833762,
                        M: 125.288254,
                        lng: 125.288254,
                        lat: 43.833762,
                    },
                    level: "district",
                    padcode: "220100",
                    pname: "长春市",
                },
                {
                    citycode: "010",
                    adcode: "110112",
                    name: "通州区",
                    center: {
                        O: 39.909946,
                        M: 116.65643399999999,
                        lng: 116.656434,
                        lat: 39.909946,
                    },
                    level: "district",
                    padcode: "110100",
                    pname: "北京城区",
                },
                {
                    citycode: "0513",
                    adcode: "320612",
                    name: "通州区",
                    center: {
                        O: 32.06568,
                        M: 121.07382799999999,
                        lng: 121.073828,
                        lat: 32.06568,
                    },
                    level: "district",
                    padcode: "320600",
                    pname: "南通市",
                },
                {
                    citycode: "022",
                    adcode: "120101",
                    name: "和平区",
                    center: {
                        O: 39.117196,
                        M: 117.214699,
                        lng: 117.214699,
                        lat: 39.117196,
                    },
                    level: "district",
                    padcode: "120100",
                    pname: "天津城区",
                },
                {
                    citycode: "024",
                    adcode: "210102",
                    name: "和平区",
                    center: {
                        O: 41.789833,
                        M: 123.420368,
                        lng: 123.420368,
                        lat: 41.789833,
                    },
                    level: "district",
                    padcode: "210100",
                    pname: "沈阳市",
                },
                {
                    citycode: "022",
                    adcode: "120102",
                    name: "河东区",
                    center: {
                        O: 39.128294,
                        M: 117.25158399999998,
                        lng: 117.251584,
                        lat: 39.128294,
                    },
                    level: "district",
                    padcode: "120100",
                    pname: "天津城区",
                },
                {
                    citycode: "0539",
                    adcode: "371312",
                    name: "河东区",
                    center: {
                        O: 35.089916,
                        M: 118.402893,
                        lng: 118.402893,
                        lat: 35.089916,
                    },
                    level: "district",
                    padcode: "371300",
                    pname: "临沂市",
                },
                {
                    citycode: "0311",
                    adcode: "130102",
                    name: "长安区",
                    center: {
                        O: 38.036347,
                        M: 114.53939500000001,
                        lng: 114.539395,
                        lat: 38.036347,
                    },
                    level: "district",
                    padcode: "130100",
                    pname: "石家庄市",
                },
                {
                    citycode: "029",
                    adcode: "610116",
                    name: "长安区",
                    center: {
                        O: 34.158926,
                        M: 108.907173,
                        lng: 108.907173,
                        lat: 34.158926,
                    },
                    level: "district",
                    padcode: "610100",
                    pname: "西安市",
                },
                {
                    citycode: "0311",
                    adcode: "130104",
                    name: "桥西区",
                    center: {
                        O: 38.004193,
                        M: 114.46108800000002,
                        lng: 114.461088,
                        lat: 38.004193,
                    },
                    level: "district",
                    padcode: "130100",
                    pname: "石家庄市",
                },
                {
                    citycode: "0319",
                    adcode: "130503",
                    name: "桥西区",
                    center: {
                        O: 37.059827,
                        M: 114.46860100000004,
                        lng: 114.468601,
                        lat: 37.059827,
                    },
                    level: "district",
                    padcode: "130500",
                    pname: "邢台市",
                },
                {
                    citycode: "0313",
                    adcode: "130703",
                    name: "桥西区",
                    center: {
                        O: 40.819581,
                        M: 114.86965700000002,
                        lng: 114.869657,
                        lat: 40.819581,
                    },
                    level: "district",
                    padcode: "130700",
                    pname: "张家口市",
                },
                {
                    citycode: "0311",
                    adcode: "130105",
                    name: "新华区",
                    center: {
                        O: 38.05095,
                        M: 114.46337699999998,
                        lng: 114.463377,
                        lat: 38.05095,
                    },
                    level: "district",
                    padcode: "130100",
                    pname: "石家庄市",
                },
                {
                    citycode: "0317",
                    adcode: "130902",
                    name: "新华区",
                    center: {
                        O: 38.314416,
                        M: 116.86628400000001,
                        lng: 116.866284,
                        lat: 38.314416,
                    },
                    level: "district",
                    padcode: "130900",
                    pname: "沧州市",
                },
                {
                    citycode: "0375",
                    adcode: "410402",
                    name: "新华区",
                    center: {
                        O: 33.737251,
                        M: 113.29397699999998,
                        lng: 113.293977,
                        lat: 33.737251,
                    },
                    level: "district",
                    padcode: "410400",
                    pname: "平顶山市",
                },
                {
                    citycode: "0319",
                    adcode: "130502",
                    name: "桥东区",
                    center: {
                        O: 37.071287,
                        M: 114.50705800000003,
                        lng: 114.507058,
                        lat: 37.071287,
                    },
                    level: "district",
                    padcode: "130500",
                    pname: "邢台市",
                },
                {
                    citycode: "0313",
                    adcode: "130702",
                    name: "桥东区",
                    center: {
                        O: 40.788434,
                        M: 114.89418899999998,
                        lng: 114.894189,
                        lat: 40.788434,
                    },
                    level: "district",
                    padcode: "130700",
                    pname: "张家口市",
                },
                {
                    citycode: "0352",
                    adcode: "140202",
                    name: "城区",
                    center: {
                        O: 40.075666,
                        M: 113.298026,
                        lng: 113.298026,
                        lat: 40.075666,
                    },
                    level: "district",
                    padcode: "140200",
                    pname: "大同市",
                },
                {
                    citycode: "0353",
                    adcode: "140302",
                    name: "城区",
                    center: {
                        O: 37.847436,
                        M: 113.60066899999998,
                        lng: 113.600669,
                        lat: 37.847436,
                    },
                    level: "district",
                    padcode: "140300",
                    pname: "阳泉市",
                },
                {
                    citycode: "0355",
                    adcode: "140402",
                    name: "城区",
                    center: {
                        O: 36.20353,
                        M: 113.123088,
                        lng: 113.123088,
                        lat: 36.20353,
                    },
                    level: "district",
                    padcode: "140400",
                    pname: "长治市",
                },
                {
                    citycode: "0356",
                    adcode: "140502",
                    name: "城区",
                    center: {
                        O: 35.501571,
                        M: 112.85355500000003,
                        lng: 112.853555,
                        lat: 35.501571,
                    },
                    level: "district",
                    padcode: "140500",
                    pname: "晋城市",
                },
                {
                    citycode: "0660",
                    adcode: "441502",
                    name: "城区",
                    center: {
                        O: 22.779207,
                        M: 115.36505799999998,
                        lng: 115.365058,
                        lat: 22.779207,
                    },
                    level: "district",
                    padcode: "441500",
                    pname: "汕尾市",
                },
                {
                    citycode: "0352",
                    adcode: "140203",
                    name: "矿区",
                    center: {
                        O: 40.036858,
                        M: 113.17720600000001,
                        lng: 113.177206,
                        lat: 40.036858,
                    },
                    level: "district",
                    padcode: "140200",
                    pname: "大同市",
                },
                {
                    citycode: "0353",
                    adcode: "140303",
                    name: "矿区",
                    center: {
                        O: 37.868494,
                        M: 113.55527899999998,
                        lng: 113.555279,
                        lat: 37.868494,
                    },
                    level: "district",
                    padcode: "140300",
                    pname: "阳泉市",
                },
                {
                    citycode: "0353",
                    adcode: "140311",
                    name: "郊区",
                    center: {
                        O: 37.944679,
                        M: 113.59416299999998,
                        lng: 113.594163,
                        lat: 37.944679,
                    },
                    level: "district",
                    padcode: "140300",
                    pname: "阳泉市",
                },
                {
                    citycode: "0355",
                    adcode: "140411",
                    name: "郊区",
                    center: {
                        O: 36.218388,
                        M: 113.10121100000003,
                        lng: 113.101211,
                        lat: 36.218388,
                    },
                    level: "district",
                    padcode: "140400",
                    pname: "长治市",
                },
                {
                    citycode: "0454",
                    adcode: "230811",
                    name: "郊区",
                    center: {
                        O: 46.810085,
                        M: 130.32719399999996,
                        lng: 130.327194,
                        lat: 46.810085,
                    },
                    level: "district",
                    padcode: "230800",
                    pname: "佳木斯市",
                },
                {
                    citycode: "0562",
                    adcode: "340711",
                    name: "郊区",
                    center: {
                        O: 30.821069,
                        M: 117.76802600000002,
                        lng: 117.768026,
                        lat: 30.821069,
                    },
                    level: "district",
                    padcode: "340700",
                    pname: "铜陵市",
                },
                {
                    citycode: "0471",
                    adcode: "150102",
                    name: "新城区",
                    center: {
                        O: 40.858289,
                        M: 111.66554400000001,
                        lng: 111.665544,
                        lat: 40.858289,
                    },
                    level: "district",
                    padcode: "150100",
                    pname: "呼和浩特市",
                },
                {
                    citycode: "029",
                    adcode: "610102",
                    name: "新城区",
                    center: {
                        O: 34.266447,
                        M: 108.96071599999999,
                        lng: 108.960716,
                        lat: 34.266447,
                    },
                    level: "district",
                    padcode: "610100",
                    pname: "西安市",
                },
                {
                    citycode: "0472",
                    adcode: "150204",
                    name: "青山区",
                    center: {
                        O: 40.643246,
                        M: 109.90157199999999,
                        lng: 109.901572,
                        lat: 40.643246,
                    },
                    level: "district",
                    padcode: "150200",
                    pname: "包头市",
                },
                {
                    citycode: "027",
                    adcode: "420107",
                    name: "青山区",
                    center: {
                        O: 30.640191,
                        M: 114.38496800000001,
                        lng: 114.384968,
                        lat: 30.640191,
                    },
                    level: "district",
                    padcode: "420100",
                    pname: "武汉市",
                },
                {
                    citycode: "024",
                    adcode: "210106",
                    name: "铁西区",
                    center: {
                        O: 41.820807,
                        M: 123.33396800000003,
                        lng: 123.333968,
                        lat: 41.820807,
                    },
                    level: "district",
                    padcode: "210100",
                    pname: "沈阳市",
                },
                {
                    citycode: "0412",
                    adcode: "210303",
                    name: "铁西区",
                    center: {
                        O: 41.119884,
                        M: 122.969629,
                        lng: 122.969629,
                        lat: 41.119884,
                    },
                    level: "district",
                    padcode: "210300",
                    pname: "鞍山市",
                },
                {
                    citycode: "0434",
                    adcode: "220302",
                    name: "铁西区",
                    center: {
                        O: 43.146155,
                        M: 124.34572200000002,
                        lng: 124.345722,
                        lat: 43.146155,
                    },
                    level: "district",
                    padcode: "220300",
                    pname: "四平市",
                },
                {
                    citycode: "0412",
                    adcode: "210302",
                    name: "铁东区",
                    center: {
                        O: 41.089933,
                        M: 122.99105199999997,
                        lng: 122.991052,
                        lat: 41.089933,
                    },
                    level: "district",
                    padcode: "210300",
                    pname: "鞍山市",
                },
                {
                    citycode: "0434",
                    adcode: "220303",
                    name: "铁东区",
                    center: {
                        O: 43.162105,
                        M: 124.40959099999998,
                        lng: 124.409591,
                        lat: 43.162105,
                    },
                    level: "district",
                    padcode: "220300",
                    pname: "四平市",
                },
                {
                    citycode: "0418",
                    adcode: "210902",
                    name: "海州区",
                    center: {
                        O: 42.011162,
                        M: 121.65763800000002,
                        lng: 121.657638,
                        lat: 42.011162,
                    },
                    level: "district",
                    padcode: "210900",
                    pname: "阜新市",
                },
                {
                    citycode: "0518",
                    adcode: "320706",
                    name: "海州区",
                    center: {
                        O: 34.572274,
                        M: 119.16350899999998,
                        lng: 119.163509,
                        lat: 34.572274,
                    },
                    level: "district",
                    padcode: "320700",
                    pname: "连云港市",
                },
                {
                    citycode: "0437",
                    adcode: "220403",
                    name: "西安区",
                    center: {
                        O: 42.927324,
                        M: 125.14928099999997,
                        lng: 125.149281,
                        lat: 42.927324,
                    },
                    level: "district",
                    padcode: "220400",
                    pname: "辽源市",
                },
                {
                    citycode: "0453",
                    adcode: "231005",
                    name: "西安区",
                    center: {
                        O: 44.577625,
                        M: 129.616058,
                        lng: 129.616058,
                        lat: 44.577625,
                    },
                    level: "district",
                    padcode: "231000",
                    pname: "牡丹江市",
                },
                {
                    citycode: "0468",
                    adcode: "230402",
                    name: "向阳区",
                    center: {
                        O: 47.342468,
                        M: 130.29423499999996,
                        lng: 130.294235,
                        lat: 47.342468,
                    },
                    level: "district",
                    padcode: "230400",
                    pname: "鹤岗市",
                },
                {
                    citycode: "0454",
                    adcode: "230803",
                    name: "向阳区",
                    center: {
                        O: 46.80779,
                        M: 130.365346,
                        lng: 130.365346,
                        lat: 46.80779,
                    },
                    level: "district",
                    padcode: "230800",
                    pname: "佳木斯市",
                },
                {
                    citycode: "0468",
                    adcode: "230404",
                    name: "南山区",
                    center: {
                        O: 47.315174,
                        M: 130.286788,
                        lng: 130.286788,
                        lat: 47.315174,
                    },
                    level: "district",
                    padcode: "230400",
                    pname: "鹤岗市",
                },
                {
                    citycode: "0755",
                    adcode: "440305",
                    name: "南山区",
                    center: {
                        O: 22.533287,
                        M: 113.93041299999999,
                        lng: 113.930413,
                        lat: 22.533287,
                    },
                    level: "district",
                    padcode: "440300",
                    pname: "深圳市",
                },
                {
                    citycode: "0469",
                    adcode: "230506",
                    name: "宝山区",
                    center: {
                        O: 46.577167,
                        M: 131.401589,
                        lng: 131.401589,
                        lat: 46.577167,
                    },
                    level: "district",
                    padcode: "230500",
                    pname: "双鸭山市",
                },
                {
                    citycode: "021",
                    adcode: "310113",
                    name: "宝山区",
                    center: {
                        O: 31.405457,
                        M: 121.48961199999997,
                        lng: 121.489612,
                        lat: 31.405457,
                    },
                    level: "district",
                    padcode: "310100",
                    pname: "上海城区",
                },
                {
                    citycode: "021",
                    adcode: "310107",
                    name: "普陀区",
                    center: {
                        O: 31.249603,
                        M: 121.39551399999999,
                        lng: 121.395514,
                        lat: 31.249603,
                    },
                    level: "district",
                    padcode: "310100",
                    pname: "上海城区",
                },
                {
                    citycode: "0580",
                    adcode: "330903",
                    name: "普陀区",
                    center: {
                        O: 29.97176,
                        M: 122.323867,
                        lng: 122.323867,
                        lat: 29.97176,
                    },
                    level: "district",
                    padcode: "330900",
                    pname: "舟山市",
                },
                {
                    citycode: "025",
                    adcode: "320106",
                    name: "鼓楼区",
                    center: {
                        O: 32.066601,
                        M: 118.77018199999998,
                        lng: 118.770182,
                        lat: 32.066601,
                    },
                    level: "district",
                    padcode: "320100",
                    pname: "南京市",
                },
                {
                    citycode: "0516",
                    adcode: "320302",
                    name: "鼓楼区",
                    center: {
                        O: 34.288646,
                        M: 117.18557599999997,
                        lng: 117.185576,
                        lat: 34.288646,
                    },
                    level: "district",
                    padcode: "320300",
                    pname: "徐州市",
                },
                {
                    citycode: "0591",
                    adcode: "350102",
                    name: "鼓楼区",
                    center: {
                        O: 26.081983,
                        M: 119.30391700000001,
                        lng: 119.303917,
                        lat: 26.081983,
                    },
                    level: "district",
                    padcode: "350100",
                    pname: "福州市",
                },
                {
                    citycode: "0378",
                    adcode: "410204",
                    name: "鼓楼区",
                    center: {
                        O: 34.78856,
                        M: 114.34830599999998,
                        lng: 114.348306,
                        lat: 34.78856,
                    },
                    level: "district",
                    padcode: "410200",
                    pname: "开封市",
                },
                {
                    citycode: "0571",
                    adcode: "330106",
                    name: "西湖区",
                    center: {
                        O: 30.259463,
                        M: 120.13019400000002,
                        lng: 120.130194,
                        lat: 30.259463,
                    },
                    level: "district",
                    padcode: "330100",
                    pname: "杭州市",
                },
                {
                    citycode: "0791",
                    adcode: "360103",
                    name: "西湖区",
                    center: {
                        O: 28.657595,
                        M: 115.87723299999999,
                        lng: 115.877233,
                        lat: 28.657595,
                    },
                    level: "district",
                    padcode: "360100",
                    pname: "南昌市",
                },
                {
                    citycode: "0574",
                    adcode: "330205",
                    name: "江北区",
                    center: {
                        O: 29.886781,
                        M: 121.55508099999997,
                        lng: 121.555081,
                        lat: 29.886781,
                    },
                    level: "district",
                    padcode: "330200",
                    pname: "宁波市",
                },
                {
                    citycode: "023",
                    adcode: "500105",
                    name: "江北区",
                    center: {
                        O: 29.606703,
                        M: 106.57427100000001,
                        lng: 106.574271,
                        lat: 29.606703,
                    },
                    level: "district",
                    padcode: "500100",
                    pname: "重庆城区",
                },
                {
                    citycode: "0597",
                    adcode: "350803",
                    name: "永定区",
                    center: {
                        O: 24.723961,
                        M: 116.73209099999997,
                        lng: 116.732091,
                        lat: 24.723961,
                    },
                    level: "district",
                    padcode: "350800",
                    pname: "龙岩市",
                },
                {
                    citycode: "0744",
                    adcode: "430802",
                    name: "永定区",
                    center: {
                        O: 29.119855,
                        M: 110.53713800000003,
                        lng: 110.537138,
                        lat: 29.119855,
                    },
                    level: "district",
                    padcode: "430800",
                    pname: "张家界市",
                },
                {
                    citycode: "0531",
                    adcode: "370103",
                    name: "市中区",
                    center: {
                        O: 36.651335,
                        M: 116.99784499999998,
                        lng: 116.997845,
                        lat: 36.651335,
                    },
                    level: "district",
                    padcode: "370100",
                    pname: "济南市",
                },
                {
                    citycode: "0632",
                    adcode: "370402",
                    name: "市中区",
                    center: {
                        O: 34.863554,
                        M: 117.55613900000003,
                        lng: 117.556139,
                        lat: 34.863554,
                    },
                    level: "district",
                    padcode: "370400",
                    pname: "枣庄市",
                },
                {
                    citycode: "1832",
                    adcode: "511002",
                    name: "市中区",
                    center: {
                        O: 29.587053,
                        M: 105.06759699999998,
                        lng: 105.067597,
                        lat: 29.587053,
                    },
                    level: "district",
                    padcode: "511000",
                    pname: "内江市",
                },
                {
                    citycode: "0833",
                    adcode: "511102",
                    name: "市中区",
                    center: {
                        O: 29.555374,
                        M: 103.76132899999999,
                        lng: 103.761329,
                        lat: 29.555374,
                    },
                    level: "district",
                    padcode: "511100",
                    pname: "乐山市",
                },
                {
                    citycode: "020",
                    adcode: "440111",
                    name: "白云区",
                    center: {
                        O: 23.157367,
                        M: 113.27323799999999,
                        lng: 113.273238,
                        lat: 23.157367,
                    },
                    level: "district",
                    padcode: "440100",
                    pname: "广州市",
                },
                {
                    citycode: "0851",
                    adcode: "520113",
                    name: "白云区",
                    center: {
                        O: 26.678561,
                        M: 106.62300700000003,
                        lng: 106.623007,
                        lat: 26.678561,
                    },
                    level: "district",
                    padcode: "520100",
                    pname: "贵阳市",
                },
                {
                    citycode: "0755",
                    adcode: "440309",
                    name: "龙华区",
                    center: {
                        O: 22.696667,
                        M: 114.04542200000003,
                        lng: 114.045422,
                        lat: 22.696667,
                    },
                    level: "district",
                    padcode: "440300",
                    pname: "深圳市",
                },
                {
                    citycode: "0898",
                    adcode: "460106",
                    name: "龙华区",
                    center: {
                        O: 20.031006,
                        M: 110.32849199999998,
                        lng: 110.328492,
                        lat: 20.031006,
                    },
                    level: "district",
                    padcode: "460100",
                    pname: "海口市",
                },
                {
                    citycode: "0772",
                    adcode: "450202",
                    name: "城中区",
                    center: {
                        O: 24.366,
                        M: 109.4273,
                        lng: 109.4273,
                        lat: 24.366,
                    },
                    level: "district",
                    padcode: "450200",
                    pname: "柳州市",
                },
                {
                    citycode: "0971",
                    adcode: "630103",
                    name: "城中区",
                    center: {
                        O: 36.545652,
                        M: 101.70529799999997,
                        lng: 101.705298,
                        lat: 36.545652,
                    },
                    level: "district",
                    padcode: "630100",
                    pname: "西宁市",
                },
                {
                    citycode: "0891",
                    adcode: "540102",
                    name: "城关区",
                    center: {
                        O: 29.654838,
                        M: 91.14055200000001,
                        lng: 91.140552,
                        lat: 29.654838,
                    },
                    level: "district",
                    padcode: "540100",
                    pname: "拉萨市",
                },
                {
                    citycode: "0931",
                    adcode: "620102",
                    name: "城关区",
                    center: {
                        O: 36.057464,
                        M: 103.82530700000001,
                        lng: 103.825307,
                        lat: 36.057464,
                    },
                    level: "district",
                    padcode: "620100",
                    pname: "兰州市",
                },
            ],
        };
        this.isInDupDistincts = function (value) {
            return this.dupDistincts.index.some(function (v) {
                return v.name === value;
            });
        };
        this.getDupDistincts = function (value) {
            var res = [];
            this.dupDistincts.data.forEach(function (v) {
                if (v.name === value) {
                    res.push(v);
                }
            });
            return res;
        };
    });
})();
