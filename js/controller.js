/**
 * Created by Administrator on 2017/4/13.
 */
(function () {
    var app = angular.module("angularApp");

    app.controller('selectDeptCtrl', function ($scope, $rootScope, $http, $uibModalInstance, fac, data) {
        $scope.onlyOne = data.isOnly || false; //是否单选
        $scope.config = {
            edit: false
        };
        $scope.pageModel = {};
        $scope.search = {
            isGroup: app.curModule.isGroup
        };
        $scope.parks = [];
        $scope.find = function (pageNo) {
            $scope.search.parentId = $scope.curNode && $scope.curNode.id;
            $.extend($scope.search, {
                currentPage: pageNo || $scope.pageModel.currentPage || 1,
                pageSize: $scope.pageModel.pageSize || 10
            });
            fac.getPageResult("/ovu-base/system/park/listByGrid", $scope.search, function (data) {
                data.data.forEach(function (p) {
                    $scope.parks.forEach(function (park) {
                        if (p.id == park.id) {
                            p.checked = true;
                        }
                    });
                });
                $scope.pageModel = data;
            });
        };
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
        };

        //单个添加
        $scope.checkOne = function (park, data) {
            park.checked = !park.checked;
            if (data) {
                data.checked = data.every(function (v) {
                    return v.checked;
                });
            }
            if (park.checked) {
                var isSelected = false;
                if ($scope.onlyOne) { //单选
                    $scope.parks.unshift(park);
                }
                $scope.parks && $scope.parks.forEach(function (item) {
                    if (park.id == item.id) {
                        isSelected = true;
                    }
                });
                //在编辑状态下如果在编辑前没有被选中的才加入
                if (!isSelected) {
                    $scope.parks.unshift(park);
                }
            } else {
                $scope.parks.splice($scope.parks.indexOf(park), 1);
            }
        };

        //全选
        $scope.checkAll = function (data) {
            data.checked = !data.checked;
            data.data.forEach(function (n) {
                n.checked = data.checked;
                var isSelected = false;
                $scope.parks && $scope.parks.forEach(function (park) {
                    if (n.id == park.id) {
                        isSelected = true;
                    }

                });
                //在编辑状态下如果在编辑前没有被选中的才加入
                if ((!isSelected) && (n.checked)) {
                    $scope.parks.push(n);
                }
                if (!n.checked && isSelected) {
                    var i = 0;
                    $scope.parks.forEach(function (v) {
                        i++;
                        if (v.id == n.id) {
                            $scope.parks.splice(i - 1, 1);
                        }
                    })

                }

            });


        };

        //删除
        $scope.del = function (parks, park) {
            park.checked = false;
            parks.splice(parks.indexOf(park), 1);
        };
        app.modulePromiss.then(function () {
            $scope.treeData = fac.getParkTree("0");

            $scope.treeData.forEach(function (da) {
                da.state = da.state || {};
                da.state.expanded = true;
            });

            $scope.find();
        });


        //点击单个项目
        $scope.clickOnePark = function (item) {
            $scope.curPark = item;
        };
        $scope.save = function () {
            var datas;
            if ($scope.onlyOne) {
                datas = $scope.curPark;
            } else {
                datas = $scope.parks.reduce(function (ret, n) {
                    n.checked && ret.push(n);
                    return ret
                }, []);
            }
            if (fac.isEmpty(datas)) {
                alert("请选择项目！");
            } else {
                $uibModalInstance.close(datas);
            }
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    });
    //多项目选择器
    app.controller('parksSelectorCtrl', function ($scope, $rootScope, $http, $uibModalInstance, $filter, fac, data) {
        $scope.onlyOne = data.isOnly || false; //是否单选

        $scope.config = {
            edit: false
        };
        $scope.pageModel = {};
        $scope.search = {
            isGroup: app.curModule.isGroup
        };
      
        $scope.parks =data.parks ||  [];
        
        $scope.find = function (pageNo) {
            $scope.search.parentId = $scope.curNode && $scope.curNode.id;
            $.extend($scope.search, {
                currentPage: pageNo || $scope.pageModel.currentPage || 1,
                pageSize: $scope.pageModel.pageSize || 10
            });
            fac.getPageResult("/ovu-base/system/park/listByGrid", $scope.search, function (data) {
                data.data.length && data.data.forEach(function (p) {
                    $scope.parks.length && $scope.parks.forEach(function (park) {
                        if (p.id == park.id) {
                            p.checked = true;
                          
                        }
                    });
                  
                });
                $scope.pageModel = data;
            });
        };
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
        };

        //单个添加
        $scope.checkOne = function (park, data) {
            park.checked = !park.checked;
            var index=$scope.parks.findIndex(v=>{
                return v.id==park.id
            })
            if (data) {
                data.checked = data.every(function (v) {
                    return v.checked;
                });
            }
            if (park.checked) {
               
                if ($scope.onlyOne) { //单选
                    $scope.parks.unshift(park);
                }
               
                //在编辑状态下如果在编辑前没有被选中的才加入
                if (index<0) {
                    $scope.parks.unshift(park);
                }
            } else {
                $scope.parks.splice(index, 1);
                park.checked=false
            }
        };

        //全选
        $scope.checkAll = function (data) {
            data.checked = !data.checked;
            data.data.forEach(function (n) {
                n.checked = data.checked;
                var isSelected = false;
                $scope.parks && $scope.parks.forEach(function (park) {
                    if (n.id == park.id) {
                        isSelected = true;
                    }

                });
                //在编辑状态下如果在编辑前没有被选中的才加入
                if ((!isSelected) && (n.checked)) {
                    $scope.parks.push(n);
                }
                if (!n.checked && isSelected) {
                    var i = 0;
                    $scope.parks.forEach(function (v) {
                        i++;
                        if (v.id == n.id) {
                            $scope.parks.splice(i - 1, 1);
                        }
                    })

                }

            });


        };

        //删除
        $scope.del = function (parks, park) {
            park.checked = false;
        
            $scope.pageModel.data.forEach(function (p) {
                if (p.id == park.id) {
                    p.checked = false;
                }
            });
            var index=parks.findIndex(v=>{
                return v.id==park.id
            })
            parks.splice(index, 1);
        };
        app.modulePromiss.then(function () {
            $scope.treeData = fac.getParkTree("0");
         
            $scope.treeData.forEach(function (da) {
                da.state = da.state || {};
                da.state.expanded = true;
            });

            $scope.find();
        });


        //点击单个项目
        $scope.clickOnePark = function (item) {
            $scope.curPark = item;
        };
        $scope.save = function () {
            var datas;
            if ($scope.onlyOne) {
                datas = $scope.curPark;
            } else {
                datas = $scope.parks.reduce(function (ret, n) {
                    ret.push(n);
                    return ret
                }, []);
            }
         
            if (fac.isEmpty(datas) && !data.unNeed) {
                alert("请选择项目！");
            } else {
                $uibModalInstance.close(datas);
            }
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    });
    //岗位选择器
    app.controller('postSelectorCtrl', function ($scope, $rootScope, $http, $uibModalInstance, $filter, fac, data) {
        $scope.config = {
            edit: false
        };
        $scope.pageModel = {};
        $scope.search = {};

        $scope.find = function (pageNo) {
            $scope.search.parentId = $scope.curNode && $scope.curNode.id;
            $.extend($scope.search, {
                currentPage: pageNo || $scope.pageModel.currentPage || 1,
                pageSize: $scope.pageModel.pageSize || 10
            });
            $scope.search.pageIndex = $scope.search.currentPage - 1;
            fac.getPageResult("/ovu-base/system/post/listByGrid.do", $scope.search, function (data) {
                $scope.pageModel = data;
            });
        };


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
        };

        
        function loadDeptTree() {
            $http.post("/ovu-base/system/postType/tree.do", {}, fac.postConfig).success(function (data) {
                $scope.deptListTreeData = data;
            });
        }
        loadDeptTree();
        $scope.find();

        $scope.save = function () {
            var datas = $scope.pageModel.list.reduce(function (ret, n) {
                n.checked && ret.push(n);
                return ret
            }, []);
            if (datas.length == 0) {
                alert("请选择岗位！");
            } else {
                $uibModalInstance.close(datas);
            }
        };
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    });
    //业主选择器
    app.controller('ownerSelectorCtrl', function ($scope, $rootScope, $http, $uibModalInstance, $filter, fac, data) {
        $rootScope.config = {
            edit: false
        };

        data.parkId = data.parkId ? data.parkId : '';
        $scope.pageModel = {};
        $scope.owner = {};
        $scope.onlyOne = data.onlyOne || false; //是否单选



        $http.post("/ovu-base/system/parkStage/tree.do", {

            parkId: data.parkId,
            level: "4",
        }, fac.postConfig).success(function (treeData) {
            if(treeData){
                $scope.flatData = fac.treeToFlat(treeData);
            }
          
            $scope.flatData && $scope.flatData.forEach(function (n) {

                n.buildNo ? (n.isLeaf = true) : (n.isLeaf = false);
            });
            $scope.treeData = treeData;

            if (!fac.hasOnlyPark($scope.search)) {
                $scope.pageModel = {};
            } else {
                $scope.find();
            }
        });


        $scope.find = function (pageNo) {

            angular.extend($scope.search, {
                currentPage: pageNo || $scope.pageModel.currentPage || 1,
                pageSize: $scope.pageModel.pageSize || 10
            });
            if (data.isHouse) {
                fac.getPageResult("/ovu-pcos/decoration/decorationApply/ownerlist.do", $scope.search, function (data) {
                    data.data && data.data.forEach(function (v) {
                        if (!v.houseName) {
                            v.houseName = [];
                        } else {
                            v.houseName = v.houseName.split(",") || [];
                        }
                    });
                    $scope.pageModel = data;


                });
            } else {
                fac.getPageResult("/ovu-base/owner/list.do", $scope.search, function (data) {
                    data.data && data.data.forEach(function (v) {
                        if (!v.houseName) {
                            v.houseName = [];
                        } else {
                            v.houseName = v.houseName.split(",") || [];
                        }
                    });
                    $scope.pageModel = data;

                });
            }

        };

        $scope.search = {
            parkId: data.parkId
        };

        // //选中节点
        // $scope.selectNode = function (node) {
        //     if ($scope.curNode != node) {
        //         $scope.curNode && $scope.curNode.state && ($scope.curNode.state.selected = false);
        //     }
        //     node.state = node.state || {};
        //     node.state.selected = !node.state.selected;
        //     if (node.state.selected) {
        //         $scope.curNode = node;
        //         nodeSelected(node);
        //         $scope.find(1);
        //     } else {
        //         delete $scope.curNode;
        //     }
        // };

        // function nodeSelected(node) {
        //     if (node.buildId) { //选中楼栋
        //         $scope.curStage = {stageId: node.stageId};
        //         $scope.curFloor = node;
        //         $scope.unitList = [];
        //         var param = {
        //             pageSize: 1000,
        //             pageIndex: 0,
        //             buildId: $scope.curFloor.buildId || ""
        //         };
        //         $http.get("/ovu-base/system/parkHouse/listUnitNo_mute.do", {params: param}).success(function (resp) {
        //             $scope.unitList = resp.data;
        //         })
        //     } else { //选中分期
        //         $scope.curStage = node;
        //         delete $scope.curFloor;
        //         delete $scope.unitList;
        //         delete $scope.groundList;
        //     }
        // }

        $scope.geneSearchGround = function () {
            if (!$scope.search.unitNo) {
                $scope.groundList = [];
                return;
            }
            var param = {
                pageSize: 1000,
                pageIndex: 0,
                buildId: $scope.search.buildId || "",
                unitNo: $scope.search.unitNo
            };
            $http.get("/ovu-base/system/parkHouse/listGroundNo_mute.do", {
                params: param
            }).success(function (resp) {
                $scope.groundList = resp.data;
            })
        };

        //选择
        $scope.select = function (person) {

            // if (person) {
            //     $scope.owner.id = person.id;
            //     $scope.owner.name = person.name;
            //     $scope.owner.phone = person.phone;

            //     //地址=分期+楼栋+单元+楼层+房号
            //     $scope.owner.address = '';
            //     $scope.owner.address += person.STAGE_NAME ? person.STAGE_NAME : ''; //分期
            //     $scope.owner.address += person.FLOOR_NAME ? person.FLOOR_NAME : ''; //楼栋
            //     $scope.owner.address += person.unit_no ? person.unit_no + '单元' : ''; //单元
            //     $scope.owner.address += person.ground_no ? person.ground_no + '楼' : ''; //楼层
            //     $scope.owner.address += person.HOUSE_NAME ? person.HOUSE_NAME : ''; //房号
            //     //房屋信息
            //     $scope.owner.houseId = person.house_id;
            //     $scope.owner.houseName = person.HOUSE_NAME;
            //     $scope.owner.houseNo = person.HOUSE_NO;
            // }
            if (person) {
                $scope.owner.id = person.id;
                $scope.owner.ownerIds = person.ownerIds || '';
                $scope.owner.name = person.name;
                $scope.owner.phone = person.phone;

                //地址=分期+楼栋+单元+楼层+房号
                // $scope.owner.address = '';
                // $scope.owner.address += person.stageName ? person.stageName : ''; //分期
                // $scope.owner.address += person.buildName ? person.buildName : ''; //楼栋
                // $scope.owner.address += person.unitNo ? person.unitNo + '单元' : ''; //单元
                // $scope.owner.address += person.groundNo ? person.groundNo + '楼' : ''; //楼层
                // $scope.owner.address += person.houseName ? person.houseName : ''; //房号
                // //房屋信息
                $scope.owner.houseId = person.houseId;
                $scope.owner.houseName = person.houseName;
                $scope.owner.houseNo = person.houseNo;
                $scope.owner.address = person.address
            }

        };

        //确定
        $scope.save = function () {
            if (!$scope.owner.id) {
                alert("请选择业主！");
            } else {
                $uibModalInstance.close($scope.owner);
            }
        };
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    });
    //人员选择器（单角色多人）
    app.controller('personSelectorCtrl', function ($scope, $rootScope, $http, $uibModalInstance, $filter, fac, data) {
        $scope.config = {
            edit: false
        };

        fac.setPostDict($scope);
        $scope.search = {};
        $scope.oriList = [];
        $scope.pageModel = {};
        $scope.persons = [];
        $scope.currDeptName = ''; //当前节点部门
        $scope.onlyOne = data.onlyOne || false; //是否单选
        $scope.unNeed = data.unNeed || false; //是否必填 默认为false必填  true 不必填
      

        if (data.per_Id && data.per_Name) { //初始化加载
            var ids = data.per_Id.split(',');
            var names = data.per_Name.split(',');
            for (var i = 0; i < ids.length; i++) {
                $scope.persons.push({
                    id: ids[i],
                    name: names[i]
                });
            }
        }

        //查询
        $scope.find = function (pageNo) {
            if (!$scope.search.deptId) {
                return;
            }
            $.extend($scope.search, {
                currentPage: pageNo || $scope.pageModel.currentPage || 1,
                pageSize: $scope.pageModel.pageSize || 10
            });
            $scope.search.pageIndex = $scope.search.currentPage - 1;
            fac.getPageResult("/ovu-base/pcos/person/listByGrid.do", $scope.search, function (data) {
                data.list.forEach(function (n) {
                    n.postList = [];
                    n.mrList = [];
                    if (n.postIds) {
                        var deptpost = n.postIds.split(",");
                        n.postList = deptpost.map(function (m) {
                            return m.indexOf("^") > 0 ? (m.split("^")) : (null)
                        });

                        delete n.postIds;
                    }
                });
                $scope.pageModel = data;
            });
        };

        //选中节点
        $scope.selectNode = function (node) {
            if ($scope.curNode != node) {
                $scope.curNode && $scope.curNode.state && ($scope.curNode.state.selected = false);
            }
            node.state = node.state || {};
            node.state.selected = !node.state.selected;
            if (node.state.selected) {
                $scope.curNode = node;
                $scope.search.deptId = node.id;
            }
            $scope.find(1);
        };

        //添加
        $scope.addPersonItem = function (person) {
            var is_exist = false;

            if ($scope.onlyOne) { //单选
                $scope.persons = [];
                $scope.persons.push({
                    id: person.id,
                    name: person.name
                });
            }

            $scope.persons.forEach(function (item) {
                if (person.id == item.id) {
                    is_exist = true;
                }
            });
            if (!is_exist) {
                $scope.persons.push({
                    id: person.id,
                    name: person.name
                });
            }
        };

        //删除
        $scope.del = function (persons, person) {
            persons.splice(persons.indexOf(person), 1);
        };


        //确定
        $scope.save = function () {

            if($scope.unNeed){
                var ids = [],
                        names = [];
                    $scope.persons.length && $scope.persons.forEach(function (item) {
                        ids.push(item.id);
                        names.push(item.name);
                    });
    
                    $uibModalInstance.close({
                        per_Id: ids.join(),
                        per_Name: names.join()
                    });
            }else{
                if ($scope.persons.length == 0) {
                    alert("请选择人员！");
                } else {
                    var ids = [],
                        names = [];
                    $scope.persons.forEach(function (item) {
                        ids.push(item.id);
                        names.push(item.name);
                    });
    
                    $uibModalInstance.close({
                        per_Id: ids.join(),
                        per_Name: names.join()
                    });
                }
            }
        };
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
        //加载组织树
        if (data.parkId) {
            //传入deptId，获取deptId下所有子节点组织树
            $http.get("/ovu-base/system/dept/tree?parkId=" + data.parkId).success(function (tree) {
                $scope.treeData = tree;
                $scope.search.deptId = $scope.treeData[0].id;
                $scope.selectNode($scope.treeData[0]);
                $scope.oriList = fac.treeToFlat($scope.treeData);
                $scope.find(1);
            })
        } else {
            //物业公司，默认是全局的组织树
            $scope.treeData = fac.getGlobalTree();
            $scope.search.deptId = $scope.treeData[0].id;
            $scope.selectNode($scope.treeData[0]);
            $scope.oriList = fac.treeToFlat($scope.treeData);
            $scope.find(1);
        }
    });
    //人员选择器（园区通定制）
    app.controller('personSelectorYqtCtrl', function ($scope, $rootScope, $http, $uibModalInstance, $filter, fac, data) {
        $scope.config = {
            edit: false
        };
        fac.setPostDict($scope);
        $scope.search = {};
        $scope.oriList = [];
        $scope.pageModel = {};
        $scope.persons = [];
        $scope.idsString = data.per_Id;
        $scope.currDeptName = ''; //当前节点部门
        $scope.onlyOne = data.onlyOne || false; //是否单选

        //查询
        $scope.find = function (pageNo) {
            if (!$scope.search.deptId) {
                return;
            }
            $.extend($scope.search, {
                currentPage: pageNo || $scope.pageModel.currentPage || 1,
                pageSize: $scope.pageModel.pageSize || 10
            });
            $scope.search.pageIndex = $scope.search.currentPage - 1;
            fac.getPageResult("/ovu-base/pcos/person/listByGrid.do", $scope.search, function (data) {
                data.list.forEach(function (n) {
                    n.postList = [];
                    n.mrList = [];
                    if (n.postIds) {
                        var deptpost = n.postIds.split(",");
                        n.postList = deptpost.map(function (m) {
                            return m.indexOf("^") > 0 ? (m.split("^")) : (null)
                        });

                        delete n.postIds;
                    }
                });
                $scope.pageModel = data;

            });
        };

        //选中节点
        $scope.selectNode = function (node) {
            if ($scope.curNode != node) {
                $scope.curNode && $scope.curNode.state && ($scope.curNode.state.selected = false);
            }
            node.state = node.state || {};
            node.state.selected = !node.state.selected;
            if (node.state.selected) {
                $scope.curNode = node;
                $scope.search.deptId = node.id;
            }
            $scope.find(1);
        };

        //添加
        $scope.addPersonItem = function (person) {
            var is_exist = false;

            if ($scope.onlyOne) { //单选
                $scope.persons = [];
                $scope.persons.push(person);
            }

            $scope.persons.forEach(function (item) {
                if (person.id == item.id) {
                    is_exist = true;
                }
            });
            if (!is_exist) {
                $scope.persons.push(person);
            }
        };

        //删除
        $scope.del = function (persons, person) {
            persons.splice(persons.indexOf(person), 1);
        };


        //确定
        $scope.save = function () {
            if ($scope.persons.length == 0) {
                alert("请选择人员！");
            } else {
                var ids = [],
                    names = [];
                $scope.persons.forEach(function (item) {
                    ids.push(item.id);
                    names.push(item.name);
                });

                $uibModalInstance.close($scope.persons);
            }
        };
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
        //加载组织树
        if (data.parkId) {
            //传入deptId，获取deptId下所有子节点组织树
            $http.get("/ovu-base/system/dept/tree?parkId=" + data.parkId).success(function (tree) {
                $scope.treeData = tree;
                $scope.search.deptId = $scope.treeData[0].id;
                $scope.selectNode($scope.treeData[0]);
                $scope.oriList = fac.treeToFlat($scope.treeData);
                $scope.find(1);
            })
        } else {
            //物业公司，默认是全局的组织树
            $scope.treeData = fac.getGlobalTree();
            $scope.search.deptId = $scope.treeData[0].id;
            $scope.selectNode($scope.treeData[0]);
            $scope.oriList = fac.treeToFlat($scope.treeData);
            $scope.find(1);
        }
    });

    //人员选择器（多部门多人）
    //by ghostsf
    app.controller('mutiDeptPersonSelectorCtrl', function ($scope, $rootScope, $http, $uibModalInstance, $filter, $q, fac, deptTree) {
        $scope.pageModel = {};
        $scope.personsSelected = [];
        $scope.currDeptName = ''; //当前节点部门
        $scope.search = {};
        $scope.deptTree = deptTree;

        /**
         * 判断人员是否在已选人员列表中
         */
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

        /**
         * 分页查询
         * @param pageNo
         */
        $scope.find = function (pageNo) {
            var deferred = $q.defer();

            var curDept = fac.getSelectedNode($scope.deptTree);
            if (curDept) {
                $scope.search.deptId = curDept.id;
            } else if ($rootScope.dept) {
                $scope.search.deptId = $rootScope.dept.id;
            } else {
                alert("请选择部门！");
                return;
            }
            $.extend($scope.search, {
                currentPage: pageNo || $scope.pageModel.currentPage || 1,
                pageSize: $scope.pageModel.pageSize || 10
            });
            fac.getPageResult("/ovu-base/pcos/person/listByGrid.do", $scope.search, function (data) {
                deferred.resolve(data);
                $scope.pageModel = data;
                $scope.pageModel.list.map(function (n) {
                    n.checked = isInArray($scope.personsSelected, n) !== -1;
                    return n;
                });
            });
            return deferred.promise;
        };
        $scope.find(1);

        /**
         * 查询全部并全部加入选择
         * type 0选中 1取消选择
         */
        $scope.findAll = function (type) {
            if (!$scope.search.deptId) {
                alert("未查到关联部门！");
                return;
            }
            var param = angular.extend({}, $scope.search);
            $http.post("/ovu-base/pcos/person/getPersonListByDeptId4All.do", param, fac.postConfig).success(function (data) {
                data = data || [];
                data.forEach(function (n) {
                    var i = isInArray($scope.personsSelected, n);
                    if (type === 0 && i === -1) {
                        var personItem = {
                            id: n.id,
                            name: n.name
                        };
                        $scope.personsSelected.push(personItem);
                    } else if (type === 1 && i !== -1) {
                        $scope.personsSelected.splice(i, 1);
                    }
                });
            });
        };

        /**
         * 选择该部门节点 列出该部门下所有人员
         * @param node
         */
        $scope.setDept = function (node) {
            var curDept = fac.getSelectedNode($scope.deptTree);
            if (curDept && curDept != node) {
                curDept.state.selected = false;
            }
            node.state = node.state || {};
            node.state.selected = !node.state.selected;
            if (node.state.selected) {
                $scope.find(1).then(function () {
                    $scope.pageModel.list.map(function (n) {
                        n.checked = isInArray($scope.personsSelected, n) !== -1;
                    });
                });
            }
        };
        /**
         * 选中部门下所有人员
         * @param node
         */
        $scope.check = function (node) {
            //debugger;
            node.state = node.state || {};
            node.state.checked = !node.state.checked;
            $scope.search.deptId = node.id;
            $scope.currDeptName = node.text;
            $scope.curNode = node;

            //标记选择部门的状态
            function checkSons(node, status) {
                node.state = node.state || {};
                node.state.checked = status;
                if (node.nodes && node.nodes.length) {
                    node.nodes.forEach(function (n) {
                        checkSons(n, status);
                    })
                }
            }

            // function uncheckFather(node) {
            //     var father = $scope.flatData.find(function (n) {
            //         return n.id === node.parentId
            //     });
            //     if (father) {
            //         father.state = father.state || {};
            //         father.state.checked = false;
            //         uncheckFather(father);
            //     }
            // }
            function uncheckFather(node) {
                var father = deptTree.find(function (n) {
                    return n.id === node.pid
                });
                if (father) {
                    father.state = father.state || {};
                    father.state.checked = false;
                    uncheckFather(father);
                }
            }

            if (node.state.checked) {
                checkSons(node, true);
            } else {
                checkSons(node, false);
                uncheckFather(node);
            }

            //标记选择人员的状态
            if (node.state.checked) {
                $scope.find(1).then(function () {
                    $scope.pageModel.list.map(function (n) {
                        n.checked = true;
                        var i = isInArray($scope.personsSelected, n);
                        if (i === -1) {
                            var personItem = {
                                id: n.id,
                                name: n.name
                            };
                            $scope.personsSelected.push(personItem);
                        }
                        return n;
                    });
                });

                //全部门人员标记选择
                $scope.findAll(0);
            } else {
                delete $scope.curNode;
                $scope.find(1).then(function () {
                    $scope.pageModel.list.map(function (n) {
                        n.checked = false;
                        var i = isInArray($scope.personsSelected, n);
                        if (i !== -1) {
                            $scope.personsSelected.splice(i, 1);
                        }
                        return n;
                    });
                });

                //全部门人员标记选择
                $scope.findAll(1);
            }
        };

        /**
         * 选择人员或者取消选择
         * @param person
         */
        $scope.checkAll = function (data) {
            data.checked = !data.checked;
            data.data.forEach(function (n) {
                n.checked = data.checked;
                var isSelected = false;
                $scope.personsSelected && $scope.personsSelected.forEach(function (person) {
                    if (n.id == person.id) {
                        isSelected = true;
                    }

                });
                //在编辑状态下如果在编辑前没有被选中的才加入
                if (!isSelected) {
                    $scope.personsSelected.push(n);
                }
                if (!n.checked && isSelected) {
                    var i = 0;
                    $scope.personsSelected.forEach(function (v) {
                        i++;
                        if (v.id == n.id) {
                            $scope.personsSelected.splice(i - 1, 1);
                        }
                    })

                }


            });
        };

        $scope.selectPersonItem = function (person, data) {
            //标记是否选择
            person.checked = !person.checked;
            if (data && data.list) {
                data.checked = data.list.every(function (v) {
                    return v.checked;
                });
            }
            //加入选择组
            var i = isInArray($scope.personsSelected, person);
            if (!person.checked && i !== -1) {
                $scope.personsSelected.splice(i, 1);
                $scope.pageModel.checked = false
            } else if (person.checked && i === -1) {
                var personItem = {
                    id: person.id,
                    name: person.name
                };
                $scope.personsSelected.push(personItem);
            }
        };
        /**
         * 删除已选的
         * @param personItem
         */
        $scope.delSelectedPersonItem = function (personItem) {
            var f = -1;
            $scope.personsSelected.forEach(function (p, i) {
                if (p.id === personItem.id) {
                    f = i;
                }
            });
            if (f !== -1) {
                $scope.personsSelected.splice(f, 1);
                // $scope.find();
            }
        };

        /**
         * 确定
         */
        $scope.save = function () {
            if ($scope.personsSelected.length === 0) {
                alert("请选择人员！");
            } else {
                $uibModalInstance.close({
                    personsSelected: $scope.personsSelected
                });
            }
        };

        /**
         * 取消
         */
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    });


    //工单详情或故障详情
    app.controller('workUnitDetailModalCtrl', function ($scope, $rootScope, $http, $uibModalInstance, $filter, fac, workunitId, isFault) {

        var workunit = $scope.item = {
            ID: workunitId,
            isFault: isFault
        };
        $scope.phaseList = [];

        //Deprecated
        $scope.chooseTask = function (task) {
            $scope.curTask = task;
            if (!task.stepList || task.stepList.length == 0) {
                $http.post("/ovu-pcos/pcos/workunit/getWorkStepById.do", {
                    taskId: task.ID,
                    unitId: workunit.ID
                }, fac.postConfig).success(function (resp) {
                    task.stepList = resp.steplist;
                    var stepOperList = [];
                    if (resp.arr && resp.arr.ID) {
                        stepOperList = JSON.parse(resp.arr.DESCRIPTION);
                    }
                    task.stepList.forEach(function (n) {
                        switch (n.OPERATION_TYPE) {
                            case "1":
                                break;
                            case "2":
                                break;
                            case "3":
                                n.options = n.OPTIONS_LIST.split(/[,，]/);
                                break;
                            case "4":
                                break;
                        }
                        n.oper = stepOperList.find(function (m) {
                            return m.id == n.ID
                        }) || {
                            id: n.ID
                        };
                    });

                })
            }
        };

        var workUnitPromise = $http.get("/ovu-pcos/pcos/workunit/getWorkunit.do?id=" + workunit.ID).then(function (resp) {
            var ret = resp.data;
            if (ret.success) {
                angular.extend(workunit, ret.data);
                workunit.evaluates && workunit.evaluates.forEach(function (n) {
                    n.photos = n.PICTURE ? (n.PICTURE.split(",")) : [];
                });
                // 巡检验收工单添加 巡检验收标准
                // workunit.onsiteinsp_node = '[{"title":"1.检查主墙面是否破损"},{"title":"2.检查房屋厨房卫生间是否漏水"},{"title":"3"},{"title":"4"},{"title":"5"}]';
                if (workunit.onsiteinsp_node) {
                    var list = JSON.parse(workunit.onsiteinsp_node);
                    workunit.onsiteinsp_node = list.map(function (item) {
                        return item.title;
                    }).join('<br/>');
                }
                //应急工单
                if (workunit.WORKUNIT_TYPE == 1) {
                    $scope.task = workunit.task;
                    if(!$scope.task ){
                       return
                    }
                    var stepOperList = [];
                    if ($scope.task.DESCRIPTION_ID && $scope.task.DESCRIPTION) {
                        stepOperList = JSON.parse($scope.task.DESCRIPTION);
                    }
                    $scope.task.stepChild.forEach(function (n) {
                        if (n.OPERATION_TYPE == 3) {
                            //选择
                            n.options = n.OPTIONS_LIST.split(/[,，]/);
                        }
                        n.oper = stepOperList.find(function (m) {
                            return m.id == n.WORKSTEP_ID
                        }) || {
                            id: n.WORKSTEP_ID
                        };
                    });

                } else {
                    workunit.pictures = workunit.PICTURE ? workunit.PICTURE.split(",") : [];
                    workunit.photos = workunit.PHOTO ? workunit.PHOTO.split(",") : [];
                }
            } else {
                alert(ret.error);
            }
            return workunit;
        });
        workUnitPromise.then(function () {

            fillProgressBar();

            //工单生成
            if (workunit.WORKUNIT_TYPE == 2) {
                $scope.phaseList.push({
                    title: "报事",
                    time: workunit.REPORT_TIME || workunit.CREATE_DATE,
                    content: "发起人：" + (workunit.SOURCE_PERSON_NAME || "无")
                })
            } else {
                $scope.phaseList.push({
                    title: "工单生成",
                    time: workunit.REL_TIME,
                    content: "发起人：" + workunit.SOURCE_PERSON_NAME || "无"
                })
            }

            if (workunit.callbacks && workunit.callbacks.length) {
                var callbacks = workunit.callbacks.map(function (n) {
                    return {
                        title: "回访",
                        time: n.BACK_TIME,
                        content: "回访人：" + n.BACK_NAME,
                        BACK_TEXT: n.BACK_TEXT
                    }
                });
                $scope.phaseList = $scope.phaseList.concat(callbacks)
            }
            if (workunit.delays && workunit.delays.length) {
                var callbacks = workunit.delays.map(function (n) {
                    var statusName = '';
                    if (n.status == 0) {
                        statusName = '审核中';
                    } else if (n.status == 1) {
                        statusName = '审核通过';
                    } else {
                        statusName = '审核不通过';
                    }
                    return {
                        title: "延期",
                        content: "执行人：" + workunit.EXEC_PERSON_NAME,
                        status: n.status,
                        statusName: statusName,
                        time: n.createTime,
                        date: n.date,
                        reason: n.reasonName,
                        remark: n.remark,
                        verifyTime: n.verifyTime,
                        verifyRemark: n.verifyRemark
                    }
                });
                $scope.phaseList = $scope.phaseList.concat(callbacks)
            }
            if (workunit.histories && workunit.histories.length) {
                workunit.histories.forEach(function (n) {
                    var phase = {
                        time: n.CREATE_TIME,
                        UNIT_STATUS: n.UNIT_STATUS
                    };
                    switch (n.UNIT_STATUS) {
                        case 1:
                            phase.title = "派发";
                            phase.content = "派发人：" + (n.WORK_PERSON_NAME || '系统自动派发');
                            phase.noDetail = false;
                            phase.WORK_CONTENT = n.WORK_CONTENT;
                            break;
                        case 2:
                            phase.title = "修订";
                            phase.content = "派发人：" + n.WORK_PERSON_NAME;
                            phase.WORK_CONTENT = n.WORK_CONTENT;
                            break;
                        case 4:
                            phase.title = "退回";
                            phase.content = "回退人：" + n.WORK_PERSON_NAME;
                            phase.WORK_CONTENT = n.WORK_CONTENT;
                            break;
                        case 5:
                            phase.title = "接单";
                            phase.content = "执行人：" + n.WORK_PERSON_NAME;
                            phase.noDetail = true;
                            break;
                        case 7:
                            phase.title = "执行";
                            phase.content = "执行人：" + n.WORK_PERSON_NAME;
                            break;
                        // case 8:
                        //     phase.title = "评价";
                        //     // phase.content = "管理人：" + n.WORK_PERSON_NAME;
                        //    var eva=phase.evaluate = workunit.evaluates.find(function (n) {
                        //         return n.EVALUATE_TYPE == 2
                        //     });
                        //     if(eva){
                        //         phase.content = "管理人：" + eva.PERSON_NAME ;
                        //     }else{
                        //         phase.hasNoManage=true //如果没有管理人评价，则不向数组push
                        //     }
                           
                        //     break;
                    }
                    phase.title && !phase.hasNoManage && $scope.phaseList.push(phase);
                })
              
            }
            if (workunit.evaluates && workunit.evaluates.length) {
                workunit.evaluates.forEach(function (n) {
                    var phase
                     if(n.EVALUATE_TYPE == '1'){
                        
                        phase = {
                            title: "评价",
                            time: n.CREATE_TIME,
                            content: "发起人：" + n.PERSON_NAME || "无",
                            
                        };
                     }else{
                        phase = {
                            title: "评价",
                            time: n.CREATE_TIME,
                            content: "管理人：" + n.PERSON_NAME || "无"
                        };
                     }
                     phase.evaluate = n;
                     $scope.phaseList.push(phase)
                });
              
                
               
            }
            //工单督办
            if (workunit.supervises && workunit.supervises.length) {
                var supervises = workunit.supervises.map(function (n) {
                    return n.SUPERVISE_STATUS == 1 ? {
                        title: "已督办",
                        time: n.SUPERVISE_TIME,
                        content: "督办人：" + n.SUPERVISE_PERSON_NAME,
                        noDetail: true
                    } : {
                        title: "待督办",
                        time: n.CREATE_TIME,
                        content: "",
                        noDetail: true
                    }
                });
                $scope.phaseList = $scope.phaseList.concat(supervises)
            }

            //查看设备详情
            if (workunit.equipment_id) {
                $scope.showEquipment = true;
                getEquipmentInfo(workunit.equipment_id);
            }
        });

        function fillProgressBar() {

            var types = ['success', 'info', 'warning', 'danger'];
            $scope.stacked = [{
                    value: 1,
                    UNIT_STATUS: -1,
                    title: workunit.WORKUNIT_TYPE == 2 ? '报事' : '工单生成',
                    type: 'default'
                },
                {
                    value: 1,
                    UNIT_STATUS: 1,
                    title: '派发',
                    type: 'default'
                },
                {
                    value: 1,
                    UNIT_STATUS: 4,
                    title: '退回',
                    type: 'default'
                },
                {
                    value: 1,
                    UNIT_STATUS: 5,
                    title: '接单',
                    type: 'default'
                },
                {
                    value: 1,
                    UNIT_STATUS: 7,
                    title: '执行',
                    type: 'default'
                },
                {
                    value: 1,
                    UNIT_STATUS: 8,
                    title: '评价',
                    type: 'default'
                }
            ];
            $scope.stacked.forEach(function (n) {
                if (workunit.UNIT_STATUS >= n.UNIT_STATUS) {
                    n.type = 'success';
                }
            });
            if (workunit.UNIT_STATUS == 4) {
                $scope.stacked[2].type = 'danger';
                $scope.stacked[3].value = 0;
            } else {
                $scope.stacked[2].value = 0;
            }
        }

        function getEquipmentInfo(equipmentId) {
            $http.get("/ovu-pcos/pcos/equipment/get.do?id=" + equipmentId).success(function (resp) {
                if (resp.success) {
                    $scope.equipinfo = resp.data;

                } else {
                    alert(resp.error);
                }
            });
        }

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    });

    //设备选择器
    app.controller('equipmentSelectorCtrl', function ($scope, $rootScope, $http, $uibModalInstance, $filter, fac, data) {
        $rootScope.config = {
            edit: false,
            showCheckbox: false
        };
       
        $scope.search = {
            parkId: data.parkId,
            deptId: data.deptId,
            preSetEquipType: data.preSetEquipType,
        };
        data.equipment_id && $http.get("/ovu-pcos/pcos/equipment/get.do?id=" + data.equipment_id).success(function (data) {
            $scope.curEquip = data.data;
      
          
        });

        $scope.pageModel = {};
        $scope.find = function (pageNo) {
            $.extend($scope.search, {
                currentPage: pageNo || $scope.pageModel.currentPage || 1,
                pageSize: $scope.pageModel.pageSize || 10
            });
            $scope.search.pageIndex = $scope.search.currentPage - 1;
            fac.getPageResult("/ovu-pcos/pcos/equipment/queryByPage.do", $scope.search, function (data) {
                $scope.pageModel = data;
            });
        };
        $scope.find(1);
        $http.get("/ovu-pcos/pcos/equipment/getEmtTree", {
            params: $scope.search
        }).success(function (resp) {
            if (resp.success) {
                $scope.equipTypeTree = resp.data;
            }
        });

        $scope.save = function () {
            if (!$scope.curEquip && !$scope.curEquip.id) {
                alert("请选择设备！");
            } else {
                $uibModalInstance.close($scope.curEquip);
            }
        };
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    });
      //设备多选择器
      app.controller('equipmentSelectorMultCtrl', function ($scope, $rootScope, $http, $uibModalInstance, $filter, fac, data) {
        $rootScope.config = {
            edit: false,
            showCheckbox: false
        };
         $scope.selectEqList=data.selectEqList || []
          $scope.cameraIds=data.cameraIds
        $scope.search = {
            parkId: data.parkId,
            deptId: data.deptId,
            preSetEquipType: data.preSetEquipType,
        };
         
        data.equipment_id && $http.get("/ovu-pcos/pcos/equipment/get.do?id=" + data.equipment_id).success(function (resp) {
         
            $scope.curEquip = data;
        });
      
        $scope.pageModel = {};
        $scope.find = function (pageNo) {
            $.extend($scope.search, {
                currentPage: pageNo || $scope.pageModel.currentPage || 1,
                pageSize: $scope.pageModel.pageSize || 10
            });
            $scope.search.pageIndex = $scope.search.currentPage - 1;
            fac.getPageResult("/ovu-pcos/pcos/equipment/queryByPage.do", $scope.search, function (data) {
                $scope.pageModel = data;
                if($scope.cameraIds){
                    $scope.pageModel.data.forEach(v=>{
                        if( $scope.cameraIds.indexOf(v.id)!==-1){
                        v.checked=true
                         
                       
                        }
                    })
                  
                }
            });
        };
        $scope.find(1);
        $http.get("/ovu-pcos/pcos/equipment/getEmtTree", {
            params: $scope.search
        }).success(function (resp) {
            if (resp.success) {
                $scope.equipTypeTree = resp.data;
            }
        });
        $scope.checkAll=function(data){
            data.checked = !data.checked;
            data.data.forEach(function (n) {
                n.checked = data.checked;
                var isSelected = false;
                $scope.selectEqList && $scope.selectEqList.forEach(function (park) {
                    if (n.id == park.id) {
                        isSelected = true;
                    }

                });
                //在编辑状态下如果在编辑前没有被选中的才加入
                if ((!isSelected) && (n.checked)) {
                    $scope.selectEqList.push(n);
                }
                if (!n.checked && isSelected) {
                    var i = 0;
                    $scope.selectEqList.forEach(function (v) {
                        i++;
                        if (v.id == n.id) {
                            $scope.selectEqList.splice(i - 1, 1);
                        }
                    })

                }

            });
        }
        $scope.checkOne=function(item,data){
            item.checked = !item.checked;
            if (data && data.list) {
                data.checked = data.list.every(function (v) {
                    return v.checked;
                });
            }
            if(item.checked){
                $scope.selectEqList.push(item);
            }else{
                var index=$scope.selectEqList.findIndex(v=>{
                  return v.id==item.id
                })
                $scope.selectEqList.splice(index, 1);
            }
        }

        $scope.save = function () {
            if (!$scope.selectEqList && !$scope.selectEqList.length) {
                alert("请选择设备！");
            } else {
                $uibModalInstance.close($scope.selectEqList);
            }
        };
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    });

    //设备多选选择器
    app.controller('equipmentMultiSelectorCtrl', function ($scope, $rootScope, $http, $uibModalInstance, $filter, fac, data) {
        $rootScope.config = {
            edit: false
        };

        var typeTreePromiss = fac.setEquipTypeTree();
        typeTreePromiss.then(function () {
            if ($rootScope.equipTypeTree) {
                $scope.equipTypeTree = $rootScope.equipTypeTree;
              
            }
        });
        

        $scope.pageModel = {};

        $scope.find = function (pageNo) {
            /*$scope.search.equipTypeId = $scope.curNode && $scope.curNode.id;//Zn(电梯里后台需要equipTypeId字段)*/
            $.extend($scope.search, {
                currentPage: pageNo || $scope.pageModel.currentPage || 1,
                pageSize: $scope.pageModel.pageSize || 10
            });
            $scope.search.pageIndex = $scope.search.currentPage - 1;
            fac.getPageResult("/ovu-pcos/pcos/equipment/queryByPage.do", $scope.search, function (data) {
                $scope.pageModel = data;
            });
        };

        $scope.search = {
            parkId: data.parkId,
            equip_type: data.equipType
        };

        $scope.selectNode = function (node) {
            if ($scope.curNode != node) {
                $scope.curNode && $scope.curNode.state && ($scope.curNode.state.selected = false);
            }
            node.state = node.state || {};
            node.state.selected = !node.state.selected;
            if (node.state.selected) {
                $scope.curNode = node;
                $scope.search.stageId = node.stageNo ? node.id : undefined;
                $scope.search.floorId = node.buildNo ? node.id : undefined;
                $scope.find();
            } else {
                delete $scope.curNode;
                delete $scope.search.stageId;
                delete $scope.search.floorId;
            }
        };

        $scope.selectType = function (node) {
            $scope.search.equipTypeId = node.id;
            $scope.search.equipTypeName = (node.ptexts ? node.ptexts + " > " : "") + node.text;
            $scope.search.modelHover = $scope.search.modelFocus = false;
        };

        $scope.find();

        $scope.save = function () {
            var data = $scope.pageModel.list.reduce(function (ret, n) {
                n.checked && ret.push(n);
                return ret
            }, []);
            if (data.length == 0) {
                alert("选择项不能为空！");

            } else {
                $uibModalInstance.close(data);
            }
        };
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    });

    //摄像机多选选择器
    app.controller('cameraMultiSelectorCtrl', function ($scope, $rootScope, $http, $uibModalInstance, $filter, fac, data) {
        $rootScope.config = {
            edit: false
        };

        $scope.pageModel = {};

        $scope.find = function (pageNo) {
            $.extend($scope.search, {
                currentPage: pageNo || $scope.pageModel.currentPage || 1,
                pageSize: $scope.pageModel.pageSize || 10
            });
            $scope.search.pageIndex = $scope.search.currentPage - 1;
            fac.getPageResult("/ovu-pcos/pcos/videomanagement/camerinfo/pageList.do", $scope.search, function (data) {
                $scope.pageModel = data;
            });
        };

        $scope.search = {
            parkId: data.parkId
        };

        $scope.find();

        $scope.save = function () {
            var data = $scope.pageModel.list.reduce(function (ret, n) {
                n.checked && ret.push(n);
                return ret
            }, []);
            if (data.length == 0) {
                alert("请选择摄像机！");

            } else {
                $uibModalInstance.close(data);
            }
        };
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    });

    //传感器选择器
    app.controller('sensorSelectorCtrl', function ($scope, $rootScope, $http, $uibModalInstance, $filter, fac, data) {
        $rootScope.config = {
            edit: false
        };
        $scope.excludeSensorIds = data.excludeSensorIds || [];
        var houseTreePromiss = fac.getHouseTree($scope, data.parkId);
        data.sensor.id && $http.get("/ovu-pcos/pcos/sensor/get.do?id=" + data.sensor.id).success(function (resp) {
            if (resp) {
                $scope.curItem = resp.data;
            }
        });
        $scope.pageModel = {};
        $scope.find = function (pageNo) {
            $.extend($scope.search, {
                currentPage: pageNo || $scope.pageModel.currentPage || 1,
                pageSize: $scope.pageModel.pageSize || 10
            });
            $scope.search.pageIndex = $scope.search.currentPage - 1;
            fac.getPageResult("/ovu-pcos/pcos/sensor/queryByPage.do", $scope.search, function (data) {
                $scope.pageModel = data;
            });
        };

        $scope.search = {
            parkId: data.parkId,
            sensorTypeId: data.sensor.sensor_type_id,
            sensor_type_name: data.sensor.sensor_type_name
        };

        $scope.selectNode = function (node) {
            if ($scope.curNode != node) {
                $scope.curNode && $scope.curNode.state && ($scope.curNode.state.selected = false);
            }
            node.state = node.state || {};
            node.state.selected = !node.state.selected;
            if (node.state.selected) {
                $scope.curNode = node;
                $scope.search.stageId = node.stageId;
                $scope.search.floorId = node.floorId;
                $scope.find();
            } else {
                delete $scope.curNode;
                delete $scope.search.stageId;
                delete $scope.search.floorId;
            }
        };

        $scope.find();

        $scope.save = function () {

            if (!$scope.curItem || !$scope.curItem.id) {
                alert("请选择传感器！");
            } else {
                $uibModalInstance.close($scope.curItem);
            }
        };
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    });

    //配件多选选择器
    app.controller('partsMultiSelectorCtrl', function ($scope, $rootScope, $http, $uibModalInstance, $filter, fac, data) {
        $rootScope.config = {
            edit: false
        };

        $scope.pageModel = {};
        $scope.find = function (pageNo) {
            $.extend($scope.search, {
                currentPage: pageNo || $scope.pageModel.currentPage || 1,
                pageSize: $scope.pageModel.pageSize || 10
            });
            $scope.search.pageIndex = $scope.search.currentPage - 1;
            fac.getPageResult("/ovu-pcos/pcos/parts/getList.do", $scope.search, function (data) {
                $scope.pageModel = data;
            });
        };

        $scope.search = {
            projectId: data.parkId
        };

        $scope.find();

        $scope.save = function () {
            var data = $scope.pageModel.list.reduce(function (ret, n) {
                n.checked && ret.push(n);
                return ret
            }, []);
            if (data.length == 0) {
                alert("请选择配件！");
            } else {
                $uibModalInstance.close(data);
            }
        };
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    });
    //系统版本选择器
    app.controller('proversionSelectorCtrl', function ($scope, $rootScope, $http, $uibModalInstance, $filter, fac, data) {
        $rootScope.config = {
            edit: false
        };

        $scope.pageModel = {};
        $scope.find = function (pageNo) {
            $.extend($scope.search, {
                currentPage: pageNo || $scope.pageModel.currentPage || 1,
                pageSize: $scope.pageModel.pageSize || 10
            });
            $scope.search.pageIndex = $scope.search.currentPage - 1;
            fac.getPageResult("/ovu-base/sys/version/listPro.do", $scope.search, function (data) {
                $scope.pageModel = data;
            });
        };

        $scope.search = {
            parentId: data.basicId
        };

        $scope.find();

        $scope.save = function () {
            var data = $scope.pageModel.list.reduce(function (ret, n) {
                n.checked && ret.push(n);
                return ret
            }, []);
            if (data.length == 0) {
                alert("请选择系统版本！");
            } else {
                $uibModalInstance.close(data);
            }
        };
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    });
    //拓展项目选择器
    app.controller('selectProjectCtrl', function ($scope, $rootScope, $http, $uibModalInstance, $uibModal) {
        $scope.projects = [];
        $scope.item = {};

        function loadProjects() {
            $http.post("/ovu-pcos/taking/init/listProjects.do").success(function (data) {
                $scope.projects = data;
            });
        }
        loadProjects();

        $scope.save = function (form, item) {
            form.$setSubmitted(true);
            if (!form.$valid) {
                return;
            }

            var project = $scope.projects.find(function (p) {
                return p.id == item.id
            }) || {};
            $uibModalInstance.close(project);
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    });

    //设备详情
    app.controller('equipDetailModalCtrl', function ($scope, $rootScope, $http, $uibModalInstance, $filter, fac, equipmentId) {
        $scope.item = {
            id: equipmentId
        };

        $http.get("/ovu-pcos/pcos/equipment/get.do?id=" + equipmentId).success(function (resp) {
            if (resp.success) {
                $rootScope.equipment = $scope.item = resp.data;
            } else {
                alert(resp.error);
            }
        });
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    });

    app.controller('sensorDetailModalCtrl', function ($scope, $rootScope, $http, $uibModalInstance, $uibModal, fac, sensorId) {
        $scope.item = {
            id: sensorId
        };
        $http.get("/ovu-pcos/pcos/sensor/get.do?id=" + sensorId).success(function (resp) {
            if (resp.success) {
                $scope.item = resp.data;
                if (resp.data.params) {
                    resp.data.params.forEach(function (n) {
                        if (n.val_and_time && n.val_and_time.indexOf("#") > -1) {
                            var list = n.val_and_time.split("#");
                            n.val = list[0];
                            n.last_time = list[1];
                        }
                    })
                }
            } else {
                alert(resp.error);
            }
        });

        $scope.showDetectHistory = function (sensorId, paramId, paramName) {
            var modal = $uibModal.open({
                animation: false,
                size: '',
                templateUrl: '/view/equipment/modal.detectHistory.html',
                controller: 'detectHistoryCtrl',
                resolve: {
                    param: function () {
                        return {
                            sensorId: sensorId,
                            paramId: paramId,
                            name: paramName
                        };
                    }
                }
            });
            modal.result.then(function () {}, function () {});
        };


        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    });

    app.controller('detectHistoryCtrl', function ($scope, $rootScope, $http, $uibModalInstance, $filter, fac, param) {
        $scope.search = param;
        $scope.pageModel = {};
        $scope.find = function (pageNo) {
            $.extend($scope.search, {
                currentPage: pageNo || $scope.pageModel.currentPage || 1,
                pageSize: $scope.pageModel.pageSize || 10
            });
            fac.getPageResult("/ovu-pcos/pcos/sensor/getDetectHistory.do", $scope.search, function (data) {
                $scope.pageModel = data;
            });
        };
        $scope.find();
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    });


    //设备任务
    app.controller('equipWorktaskCtrl', function ($scope, $rootScope, $uibModal, $http, $filter, fac) {
        $scope.pageModel = {};
        $scope.search = {
            equipmentId: $scope.$resolve.equipmentId
        };

        $scope.find = function (pageNo) {
            $.extend($scope.search, {
                currentPage: pageNo || $scope.pageModel.currentPage || 1,
                pageSize: $scope.pageModel.pageSize || 10
            });
            $scope.search.pageIndex = $scope.search.currentPage - 1;
            fac.getPageResult("/ovu-pcos/pcos/workunit/equipmentWorktasklist.do", $scope.search, function (data) {
                $scope.pageModel = data;
            });
        };
        $scope.find();

        $scope.showWorkunitsModal = function (task) {
            var modal = $uibModal.open({
                animation: false,
                size: 'lg',
                templateUrl: '/view/workunit/modal.workunits.html',
                controller: 'workunitsModalCtrl',
                resolve: {
                    task: function () {
                        return task;
                    }
                }
            });
            modal.result.then(function () {}, function () {
                console.info('Modal dismissed at: ' + new Date());
            });
        }
    });

    //设备工单
    app.controller('equipWorkunitCtrl', function ($scope, $rootScope, $http, $filter, fac) {
        $scope.pageModel = {};
        $scope.search = {
            equipmentId: $scope.$resolve.equipmentId
        };
        $scope.find = function (pageNo) {

            $.extend($scope.search, {
                currentPage: pageNo || $scope.pageModel.currentPage || 1,
                pageSize: $scope.pageModel.pageSize || 10
            });
            fac.getPageResult("/ovu-pcos/pcos/workunit/equipmentWorkunitlist.do", $scope.search, function (data) {
                $scope.pageModel = data;
            });
        };

        $scope.changeType = function (typeId) {
            if (typeId) {
                if (typeId == 1) {
                    $scope.worktypeTree = $rootScope.planWorkTypeTree;
                } else {
                    $scope.worktypeTree = $rootScope.emerWorkTypeTree;
                }
            } else {
                $scope.worktypeTree = [];
            }
            delete $scope.search.worktypeId;
            delete $scope.search.nodeText;

        };

        //选择工作分类
        $scope.chooseWorkType = function () {
            modalWork.open({
                callback: function (node) {
                    if (node.tid && node.text) {
                        $scope.search.WORKTYPE_ID = node.tid;
                        $scope.search.WORKTYPE_NAME = node.text;
                        if (node.tid == "0") {
                            delete $scope.search.WORKTYPE_ID
                        }
                        $scope.$apply();
                    }
                    modalWork.close();
                },
                selectedId: $scope.search.WORKTYPE_ID
            });
        };
        $scope.find();

    });

    //计划任务详情
    app.controller('worktaskModalCtrl', function ($rootScope, $scope, $http, $uibModal, $uibModalInstance, $filter, fac, task) {
        $scope.item = task;
        if (task && task.PARK_ID) {
            task.parkId = task.PARK_ID;
            task.stageId = task.STAGE_ID;
            task.buildId = task.FLOOR_ID;
            task.unitNo = task.unit_no;
            task.groundNo = task.ground_no;
            task.houseId = task.HOUSE_ID;
        }

        $scope.workTypeChange = function (workTypeId) {
            $scope.workItemDict = [];
            workTypeId && $http.get("/ovu-pcos/pcos/workunit/listWorkitem.do?worktypeId=" + workTypeId).success(function (resp) {
                $scope.workItemDict = resp;
            });
        };

        $scope.selectWorkType = function (worktype) {
            $scope.workTypeChange(worktype.WORKTYPE_ID);
        };

        $scope.$watch("item.WORKITEM_ID", function (workitemId) {
            var workitem = undefined;
            if (workitemId) {
                workitem = $scope.workItemDict.find(function (n) {
                    return n.id == workitemId;
                })
            }
            if (workitem && workitem.hasScan == 1) {
                task.is_equip = 1;
                task.hasScan = true;
            } else {
                task.hasScan = false;
            }
        });

        /*function genePersons(){
            task.persons = [];
            if(task.ALLOCATION_PERSON_ID && task.ALLOCATION_PERSON_NAME){
                var ids = task.ALLOCATION_PERSON_ID.split(",");
                var names = task.ALLOCATION_PERSON_NAME.split(",");
                for(var i=0;i<ids.length;i++){
                    task.persons.push({id:ids[i],name:names[i]});
                }
            }
        }

        $scope.delPerson = function(item,p){
            item.persons.splice(item.persons.indexOf(p),1);
            item.ALLOCATION_PERSON_ID = item.persons.reduce(function(ret,n){ ret.push(n.id);return ret},[]).join();
            item.ALLOCATION_PERSON_NAME = item.persons.reduce(function(ret,n){ ret.push(n.name);return ret},[]).join();
        }*/

        $scope.save = function (form, item) {
            form.$setSubmitted(true);
            if (!form.$valid) {
                return;
            }
            /* if(!item.persons||item.persons.length==0){
                 alert("请至少选择一个派发人！");
                 return ;
             }*/
            item.PARK_ID = item.parkId || item.PARK_ID;
            item.STAGE_ID = item.stageId;
            item.FLOOR_ID = item.buildId;
            item.unit_no = item.unitNo;
            item.ground_no = item.groundNo;
            item.HOUSE_ID = item.houseId;

            $http.post("/ovu-pcos/pcos/worktask/saveOrUpdate.do", {
                data: JSON.stringify(item)
            }, fac.postConfig).success(function (resp, status, headers, config) {
                if (resp.code == 0) {
                    $uibModalInstance.close();
                    msg("保存成功!");
                } else {
                    alert(resp.msg);
                }
            })
        };
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };


        $scope.workTypeChange(task.WORKTYPE_ID);

        $scope.setDept = function (task, dept) {
            if (dept) {
                if (dept.parkId != task.PARK_ID) {
                    delete task.equipment_id;
                    delete task.equipment_name;
                    delete task.STAGE;
                    delete task.FLOOR;
                    delete task.unit_no;
                    delete task.ground_no;
                    delete task.HOUSE_ID;
                }
                task.PARK_ID = dept.parkId;
                task.PARK_NAME = dept.parkName;
                if (dept.parkId) {
                    houseTreePromiss = fac.getHouseTree($scope, dept.parkId);
                }
            } else {
                delete item.parkId;
            }
        };

        $scope.chooseEquipment = function (task) {
            if (!task.PARK_ID) {
                alert("请先选择项目！");
                return;
            }
            var modal = $uibModal.open({
                animation: false,
                size: 'lg',
                templateUrl: '/view/equipment/selector.equipment.html',
                controller: 'equipmentSelectorCtrl',
                resolve: {
                    data: function () {
                        return {
                            parkId: task.PARK_ID,
                            equipment_id: task.equipment_id
                        };
                    }
                }
            });
            modal.result.then(function (data) {

                task.equipment_id = data.id;
                task.equipment_name = data.name;
            });
        }

    });


    app.controller('workunitsModalCtrl', function ($scope, $http, $uibModal, $uibModalInstance, $filter, fac, task) {

        $scope.task = task;
        $scope.search = {
            ID: task.ID
        };
        $scope.pageModel = {};
        $scope.find = function (pageNo) {
            $.extend($scope.search, {
                currentPage: pageNo || 1,
                pageSize: $scope.pageModel.pageSize || 10
            });
            fac.getPageResult("/ovu-pcos/pcos/worktask/listWorkunit.do", $scope.search, function (data) {
                $scope.pageModel = data;
            });
        };

        $scope.release = function () {
            var recs = $scope.pageModel.list.filter(function (n) {
                return n.checked
            });
            var cans = recs.filter(function (n) {
                return n.REL_STATUS != 1
            });
            if (cans.length == 0) {
                alert("仅有未发布的工单可发布！");
                return;
            }
            var cannotNum = recs.length - cans.length;

            confirm("确认发布选中的 " + cans.length + " 条工单?" + (cannotNum ? (cannotNum + '条工单已是发布状态！') : ''), function () {
                var unitIds = cans.reduce(function (ret, n) {
                    ret.push(n.ID);
                    return ret
                }, []).join();
                $http.post("/ovu-pcos/pcos/workunit/batchSetRel.do", {
                    unitIds: unitIds
                }, fac.postConfig).success(function (resp) {
                    if (resp.success) {
                        $scope.find();
                    } else {
                        alert(resp.error);
                    }
                })
            });

        };

        $scope.delAll = function () {

            var recs = $scope.pageModel.list.filter(function (n) {
                return n.checked
            });
            var canDels = recs.filter(function (n) {
                return n.UNIT_STATUS < 5
            });
            if (canDels.length == 0) {
                alert("仅有未接单状态的工单可删除！");
                return;
            }
            var cannotDelNum = recs.length - canDels.length;
            confirm("确认删除选中的 " + canDels.length + " 条工单?" + (cannotDelNum ? (" " + cannotDelNum + '条工单因已接单不可删除！') : ''), function () {
                var unitIds = canDels.reduce(function (ret, n) {
                    ret.push(n.ID);
                    return ret
                }, []).join();
                $http.post("/ovu-pcos/pcos/workunit/remove.do", {
                    unitIds: unitIds
                }, fac.postConfig).success(function (resp) {
                    if (resp.success) {
                        $scope.find();
                    } else {
                        alert(resp.error);
                    }
                })
            });
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
        $scope.find();

        //查看报告
        $scope.checkReport = function () {
            var recs = $scope.pageModel.list.filter(function (n) {
                return n.checked
            });
            if (recs.length != 1) {
                alert("请选择一条工单！");
                return false;
            }
            var param = {
                parkName: task.PARK_NAME,
                location: (task.STAGE_NAME || '') + (task.FLOOR_NAME || '') +
                    (task.HOUSE_NAME || '') + (task.ADDRESS || ''),
                id: recs[0].ID,
                equipmentName: task.equipment_name
            };
            var modal = $uibModal.open({
                animation: false,
                size: 'lg',
                templateUrl: '/view/workunit/modal.liftReport.html',
                controller: 'LiftReportCtrl',
                resolve: {
                    param: param
                }
            });
            modal.result.then(function () {}, function () {
                console.info('Modal dismissed at: ' + new Date());
            });
        }
    });


    //人员选择器（工单派发）
    app.controller('personUnitSelectorCtrl', function ($scope, $rootScope, $http, $uibModalInstance, $filter, fac, data) {

        $scope.data = data;
        $scope.tabs = [{
            search: {},
            pageModel: {}
        }, {
            search: {},
            pageModel: {}
        }];


        $scope.exePerson = data.exePerson || {}; //执行人
        $scope.assPersons = data.assPersons || []; //协助人
        $scope.managePerson = data.managePerson || {}; //管理人
        $scope.remark = data.remark || '';

        function find(pageNo, search, pageModel) {
            $.extend(search, {
                currentPage: pageNo || pageModel.currentPage || 1,
                pageSize: pageModel.pageSize || 10
            });
            fac.getPageResult("/workunit/sys/queryPerson_mute", search, function (data) {
                angular.extend(pageModel, data);
            });
        }
        //查询本部门相关的人员
        $scope.find0 = function (pageNo) {
            find(pageNo, $scope.tabs[0].search, $scope.tabs[0].pageModel);
        };
        //查询 物业部门的人员
        $scope.find1 = function (pageNo) {
            find(pageNo, $scope.tabs[1].search, $scope.tabs[1].pageModel);
        };

        $http.get("/ovu-base/system/dept/getDeptInfo?deptId=" + data.deptId).success(function (resp) {
            if (resp.code == 0) {
                $scope.tabs[0].search.deptName = resp.data.deptName;
                $scope.tabs[0].search.authDeptId = data.deptId;
                $scope.find0(1);
            }
        });

        //app.domain.orgType == 'maintenanceUnit' &&
       
        if (data.parkId) {
            //管理人可以先择物业公司的
            $http.get("/ovu-base/system/dept/getDeptInfo?parkId=" + data.parkId).success(function (resp) {
                if (resp.code == 0 && resp.data.id != data.deptId) {
                    $scope.tabs[1].search.deptName = resp.data.deptName;
                    $scope.tabs[1].search.authDeptId = resp.data.id;
                    $scope.find1(1);
                }
            })
        }

        //添加执行人（单人、!=协助人&!=管理人）
        $scope.setExecPerson = function (item) {
            if ($scope.managePerson == item) {
                $scope.managePerson = {};
            }
            var assisPerson = $scope.assPersons.find(function (n) {
                return n.id == item.id
            });
            assisPerson && $scope.assPersons.splice($scope.assPersons.indexOf(assisPerson), 1);
            $scope.exePerson = item;
        };

        //添加管理人（单人、!=执行人）
        $scope.setManagePerson = function (item) {
            if ($scope.exePerson && $scope.exePerson.id == item.id) {
                $scope.exePerson = {};
            }
            $scope.managePerson = item;
        };

        //添加协助人（多人、!=执行人）
        $scope.addAssiPerson = function (item) {
            if ($scope.exePerson && $scope.exePerson.id == item.id) {
                $scope.exePerson = {};
            }
            var assisPerson = $scope.assPersons.find(function (n) {
                return n.id == item.id
            });
            !assisPerson && ($scope.assPersons.push(item));
        };

        $scope.existAssis = function (item) {
            return $scope.assPersons.find(function (n) {
                return n.id == item.id
            })
        };
       

        //删除
        $scope.del = function (persons, person) {
            persons.splice(persons.indexOf(person), 1);
        };
        $scope.delExePerson = function () {
            $scope.exePerson = {};
        };
        $scope.delMngPerson = function () {
            $scope.managePerson = {};
        };

        //确定
        $scope.save = function () {
            if (!$scope.exePerson.id) {
                alert("请选择执行人！");

            } else if (!$scope.managePerson.id) {
                alert("请选择管理人！");

            } else {
                var assids = [];
                var assNames=[]
                $scope.assPersons.forEach(function (item) {
                    assids.push(item.id);
                    assNames.push(item.name);
                });
                $uibModalInstance.close({
                    execId: $scope.exePerson.id,
                    execName: $scope.exePerson.name,
                    assistanceIds: assids.join(),
                    assistanceNames:assNames.join(),
                    manageId: $scope.managePerson.id,
                    manageName: $scope.managePerson.name,
                    remark: $scope.remark
                });
            }
        };
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    });

    /**
     * 拓展项目报价单Ctrl
     */
    app.controller('costReportModalCtrl', function ($scope, $rootScope, $http, $uibModalInstance, $uibModal, $filter, fac, param) {
        $scope.passes = [
            [1, "通过"],
            [2, "不通过"]
        ];
        $scope.config = {
            edit: false
        }; //左侧树不可编辑

        $scope.isEdit = param.isEdit; //能否编辑
        $scope.canExport = param.canExport; //能否导出
        $scope.item = {}; //form实体
        $scope.pays = []; //支付列表
        $scope.costs = []; //支付明细列表
        $scope.earning = {}; //收入表
        $scope.log = {}; //报价版本
        var costList = [];

        getTypeTree();

        var url = "/ovu-pcos/extend/report/getProjectCosts.do?id=" + param.id;
        if (param.versionId) {
            url = "/ovu-pcos/extend/report/getProVersionCosts.do?id=" + param.id + "&versionId=" + param.versionId;
        }

        $http.get(url).success(function (data) {
            $scope.pays = data.pays;
            $scope.earning = data.earning;
            $scope.item = data.project;
            $scope.item.is_pass = $scope.item.is_pass == 0 ? null : $scope.item.is_pass;
            $scope.log = data.log;

            setCostEarning();
        });

        function setCostEarning() {
            if ($scope.earning.price_h) {
                $scope.earning.price_h_x = ($scope.earning.price_h / 1.06).toFixed(2);
            }
            if ($scope.earning.price_h_x && $scope.earning.count_h && $scope.earning.scale_h) {
                $scope.earning.price_h_x2 = ($scope.earning.price_h_x * $scope.earning.count_h * $scope.earning.scale_h / 100).toFixed(2);
            }
            if ($scope.earning.price_h_x2) {
                $scope.earning.price_h_x3 = ($scope.earning.price_h_x2 * 0.06).toFixed(2);
            }
            if ($scope.earning.price_s) {
                $scope.earning.price_s_x = ($scope.earning.price_s / 1.06).toFixed(2);
            }
            if ($scope.earning.price_s_x && $scope.earning.count_s && $scope.earning.scale_s) {
                $scope.earning.price_s_x2 = ($scope.earning.price_s_x * $scope.earning.count_s * $scope.earning.scale_s / 100).toFixed(2);
            }
            if ($scope.earning.price_s_x2) {
                $scope.earning.price_s_x3 = ($scope.earning.price_s_x2 * 0.06).toFixed(2);
            }
            if ($scope.earning.price_k) {
                $scope.earning.price_k_x = ($scope.earning.price_k / 1.06).toFixed(2);
            }
            if ($scope.earning.price_k_x && $scope.earning.count_k && $scope.earning.scale_k) {
                $scope.earning.price_k_x2 = ($scope.earning.price_k_x * $scope.earning.count_k * $scope.earning.scale_k / 100).toFixed(2);
            }
            if ($scope.earning.price_k_x2) {
                $scope.earning.price_k_x3 = ($scope.earning.price_k_x2 * 0.06).toFixed(2);
            }
            if ($scope.earning.price_b) {
                $scope.earning.price_b_x = ($scope.earning.price_b / 1.06).toFixed(2);
            }
            if ($scope.earning.price_b_x && $scope.earning.count_b && $scope.earning.scale_b) {
                $scope.earning.price_b_x2 = ($scope.earning.price_b_x * $scope.earning.count_b * $scope.earning.scale_b / 100).toFixed(2);
            }
            if ($scope.earning.price_b_x2) {
                $scope.earning.price_b_x3 = ($scope.earning.price_b_x2 * 0.06).toFixed(2);
            }
            if ($scope.earning.price_o) {
                $scope.earning.price_o_x = ($scope.earning.price_o / 1.06).toFixed(2);
            }
            if ($scope.earning.price_o_x && $scope.earning.count_o && $scope.earning.scale_o) {
                $scope.earning.price_o_x2 = ($scope.earning.price_o_x * $scope.earning.count_o * $scope.earning.scale_o / 100).toFixed(2);
            }
            if ($scope.earning.price_o_x2) {
                $scope.earning.price_o_x3 = ($scope.earning.price_o_x2 * 0.06).toFixed(2);
            }
            if ($scope.earning.price_u) {
                $scope.earning.price_u_x = ($scope.earning.price_u / 1.06).toFixed(2);
            }
            if ($scope.earning.price_u_x && $scope.earning.count_u && $scope.earning.scale_u) {
                $scope.earning.price_u_x2 = ($scope.earning.price_u_x * $scope.earning.count_u * $scope.earning.scale_u / 100).toFixed(2);
            }
            if ($scope.earning.price_u_x2) {
                $scope.earning.price_u_x3 = ($scope.earning.price_u_x2 * 0.06).toFixed(2);
            }
            if ($scope.earning.price_d) {
                $scope.earning.price_d_x = ($scope.earning.price_d / 1.06).toFixed(2);
            }
            if ($scope.earning.price_d_x && $scope.earning.count_d && $scope.earning.scale_d) {
                $scope.earning.price_d_x2 = ($scope.earning.price_d_x * $scope.earning.count_d * $scope.earning.scale_d / 100).toFixed(2);
            }
            if ($scope.earning.price_d_x2) {
                $scope.earning.price_d_x3 = ($scope.earning.price_d_x2 * 0.06).toFixed(2);
            }
        }

        $scope.selectNode = function (node) {
            if ($scope.curNode != node) {
                $scope.curNode && $scope.curNode.state && ($scope.curNode.state.selected = false);
            }
            node.state = node.state || {};
            node.state.selected = !node.state.selected;
            if (node.state.selected) {
                $scope.curNode = node;
                changeNode(node);
            } else {
                delete $scope.curNode;
            }
            changeNode($scope.curNode);
        };


        function changeNode(node) {
            if (node) {
                $scope.costs = costList.reduce(function (ret, n) {
                    (n.fid == node.id) && ret.push(n);
                    return ret;
                }, []);
            }
        }


        $scope.save = function (form, item) {
            form.$setSubmitted(true);
            if (!form.$valid) {
                return;
            }
            $http.post("/ovu-pcos/extend/report/save.do", {
                projectId: param.id,
                is_pass: item.is_pass,
                remark: item.remark
            }, fac.postConfig).success(function (data, status, headers, config) {
                if (data.success) {
                    msg("审核成功!");
                    $uibModalInstance.close();
                } else {
                    alert(data.error);
                }
            })
        };

        $scope.export = function () {
            var projectId = $scope.log.project_id;
            var versionId = $scope.log.version_id;

            var elemIF = document.createElement("iframe");
            elemIF.src = "/ovu-pcos/extend/report/export.do?projectId=" + projectId + "&versionId=" + versionId;
            elemIF.style.display = "none";
            document.body.appendChild(elemIF);
        };

        $scope.exportExternal = function () {
            var projectId = $scope.log.project_id;
            var versionId = $scope.log.version_id;

            var elemIF = document.createElement("iframe");
            elemIF.src = "/ovu-pcos/extend/report/exp_external.do?projectId=" + projectId + "&versionId=" + versionId;
            elemIF.style.display = "none";
            document.body.appendChild(elemIF);
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };

        function getTypeTree() {
            $http.get("/ovu-pcos/extend/report/typeTopTree.do").success(function (data) {
                $scope.treeData = data;
            });
        }

        getprovercost();

        function getprovercost() {
            $http.post("/ovu-pcos/extend/report/listprovercost.do", {
                projectId: param.id,
                versionId: param.versionId
            }, fac.postConfig).success(function (data) {
                costList = data;
            });
        }
    });

    //查看成绩单
    app.controller('operPersonScoreCtrl', function ($scope, $rootScope, fac, $uibModalInstance, $uibModal, $http, sub) {
        $scope.show = sub.show != undefined ? sub.show : true;
        $scope.item = sub || {};

        $scope.search = {
            paperId: sub.paperId,
            personId: sub.personId
        };

        $scope.numscore = {
            totalNum: 0,
            totalScore: 0,
            num: {
                num1: 0,
                num2: 0,
                num3: 0,
                num4: 0,
                num5: 0
            },
            score: {}
        };

        $http.post("/ovu-pcos/pcos/newknowledge/result/detail", $scope.search, fac.postConfig).success(function (resp) {
            if (resp.code == 0) {
                $scope.item = resp.data;
                $scope.item.subjectDetail.forEach(function (detail) {
                    detail.tempImages = [];
                    if (detail.images) {
                        detail.tempImages = detail.images.split(",");
                    }
                    if (detail.type == 2) {
                        detail.answer = detail.answer.split('$').join('、');
                        detail.choose = detail.choose ? detail.choose.split('$').join('、') : '';
                    } else if (detail.type == 3) {
                        if (detail.answer == 'A') {
                            detail.answer = '正确';
                        } else {
                            detail.answer = '错误';
                        }

                        if (detail.choose == 'A') {
                            detail.choose = '正确';
                        } else {
                            detail.choose = '错误';
                        }
                    } else if (detail.type == 4) {
                        var extAnswer = [];
                        detail.answer.split('$').forEach(function (value, index) {
                            extAnswer.push((index + 1) + "." + value);
                        });
                        detail.answer = extAnswer.join('  ');

                        var extChoose = [];
                        var chooOrder = 0;
                        detail.choose && detail.choose.split('$').forEach(function (value) {
                            if (value != '_') {
                                chooOrder++;
                                extChoose.push(chooOrder + "." + value);
                            }

                        });
                        detail.choose = extChoose.join('  ');

                    }

                });
                setProperValue($scope.item);
            }
        });

        function setProperValue(item) {
            $scope.numscore.totalNum = item.totalCount;
            $scope.numscore.totalScore = item.totalScore;

            var nums = item.count.split(",") || [];
            var scores = item.paperScore ? item.paperScore.split(",") : [];
            $scope.numscore.num = {
                num1: nums[0],
                num2: nums[1],
                num3: nums[2],
                num4: nums[3],
                num5: nums[4]
            };
            $scope.numscore.score = {
                score1: Number(scores[0]),
                score2: Number(scores[1]),
                score3: Number(scores[2]),
                score4: Number(scores[3]),
                score5: Number(scores[4])
            };
        }

        $scope.save = function (form, item) {
            form.$setSubmitted(true);
            if (!form.$valid) {
                return;
            }

            var result = {
                paperId: sub.paperId,
                personId: sub.personId,
                subjectList: []
            };

            var sscore = $scope.numscore.score;
            for (var i = 0; i < item.subjectDetail.length; i++) {
                var detail = item.subjectDetail[i];
                if (detail.type == 4 && detail.markScore > sscore.score4 / ($scope.numscore.num.num4 - 0)) {
                    alert('第' + (i + 1) + '题评分不能大于设定的分值！');
                    return false;
                }
                if (detail.type == 5 && detail.markScore > sscore.score5 / ($scope.numscore.num.num5 - 0)) {
                    alert('第' + (i + 1) + '题评分不能大于设定的分值！');
                    return false;
                }

                if (detail.type == 4 || detail.type == 5) {
                    result.subjectList.push({
                        subjectId: detail.id,
                        score: detail.markScore
                    });
                }
            }

            
            $http.post("/ovu-pcos/pcos/newknowledge/result/marking", result).success(function (resp) {
                if (resp.code == 0) {
                    msg('评分成功！');
                    $uibModalInstance.close();
                } else {
                    alert(resp.msg);
                }
            })
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };


    });
    // //选择仪表
    app.controller('choosePointModalCtrl', function ($scope, $rootScope, $http, $sce, $filter, $uibModalInstance, fac, parm) {
        $scope.pageModel = {};
        $scope.search = {};
        $scope.pointId = parm.pointId;
        $scope.pointName = parm.pointName;
        $http.get("/ovu-energy/energy/classify/list.do").success(function (data) {
            $scope.measureCategory = data.data;
        });
        $scope.changeCategory = function (id) {

            $http.get("/ovu-energy/energy/item/list", {
                params: {
                    classifyId: id
                }
            }).success(function (data) {
                $scope.fenXiangList = data.data;
            });

        };
        $scope.find = function (pageNo) {
            angular.extend($scope.search, {
                currentPage: pageNo || $scope.pageModel.currentPage || 1,
                pageSize: $scope.pageModel.pageSize || 10,
                pageIndex: $scope.search.currentPage - 1,
                parkId: parm.parkId,
            });

            fac.getPageResult("/ovu-energy/energy/point/list", $scope.search, function (data) {
                var pageModel = data;
                if (pageModel.data != undefined) {
                    pageModel.data = pageModel.data.map(function (item) {
                        item.spaceName = item.spaceName && $sce.trustAsHtml(item.spaceName.split(",").map(function (v, i) {
                            return (i + 1) + '.' + v;
                        }).join('<br>'));
                        return item;
                    })
                }
                $scope.pageModel = pageModel;



            });
        };
        $scope.find();
        $scope.checkOne = function (item, data) {
            item.checked = !item.checked;
            if (data) {
                item.checked = data.data.every(function (v) {
                    return !v.checked;
                });
                item.checked = item.checked;
            }
            $scope.pointId = item.pointId;
            $scope.pointCode = item.pointCode;
            $scope.pointName = item.pointName;
        };
        /**
         * 确定
         */
        //删除选中
        $scope.delPoint = function () {
            $scope.pointId && delete $scope.pointId;
            $scope.pointCode && delete $scope.pointCode;
            $scope.pointName && delete $scope.pointName;
        };
        $scope.save = function (form) {
            var obj = {
                pointId: $scope.pointId,
                pointCode: $scope.pointCode,
                pointName: $scope.pointName
            };
            if (!$scope.pointId) {
                alert("请选择表！");
            } else {
                $uibModalInstance.close(obj);
            }
        };

        /**
         * 取消
         */
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    });

    //查看地图位置
    app.controller('GetLocationController', function ($scope, $http, $uibModalInstance, $filter, $timeout, fac, param) {
        var ovu2DMap1;
        var map2dDraw1;
        var CanvasLayers;

        function drawAirspace() {
            //画出图层
            //地图需要参数
            var topRight = param.park.trPosition ? param.park.trPosition.split(",") : undefined;
            var bomLeft = param.park.blPosition ? param.park.blPosition.split(",") : undefined;
            // var width =  $scope.myMap.mapWidth ?  $scope.myMap.mapWidth :2000;
            //  var height =  $scope.myMap.mapHeight ?  $scope.myMap.mapHeight :1000;
            //  var zoom =  $scope.myMap.mapZoom ?  $scope.myMap.mapZoom :2.5;
            var mapProperties = param.park.director ? param.park.director.split(",") : [];
            var width = mapProperties[0] ? Number(mapProperties[0]) : 2000;
            var height = mapProperties[1] ? Number(mapProperties[1]) : 2000;
            var zoom = mapProperties[2] ? Number(mapProperties[2]) : 2.76;
            if (param.park.airscapePath) {


                if (param.park.airscapePath.indexOf("http") == -1) {
                    param.park.airscapePath = "/ovu-base" + param.park.airscapePath;
                }
                ovu2DMap1 = new OvuMap();
                map2dDraw1 = new Draw2DMap(width, height, zoom, undefined);
                ovu2DMap1.loadTheme();
                ovu2DMap1.loadJson(param.park.airscapePath);
                var draw1 = function (argument) {
                    AMap.Util.requestAnimFrame(draw1);
                    if (ovu2DMap1.mapJson === undefined) {
                        return;
                    }
                    var _curFloor = ovu2DMap1.mapJson;
                    //地图绘制
                    map2dDraw1.draw(_curFloor, $scope.myMap);
                    //图层刷新
                    CanvasLayers.reFresh();
                };
                CanvasLayers = new AMap.CanvasLayer({
                    canvas: map2dDraw1.canvas,
                    bounds: new AMap.Bounds(
                        bomLeft,
                        topRight
                    ),
                    zooms: [3, 18],
                });
                //把图层 存放到 地图中
                CanvasLayers.setMap($scope.myMap);
                //绘图循环的核心方法
                draw1(22);


            }
        }
        $scope.mapOptions = {
            toolbar: true,
            // map-self config

            resizeEnable: true,
            // ui map config
            uiMapCache: false,
            zoom: 15,
            expandZoomRange: true
        };
        $scope.markers = [];
        //添加标记
        function addMarker(lng, lat) {
            $scope.markers = [];
            var lnglat = new AMap.LngLat(lng, lat);
            $scope.myMap.setCenter(lnglat);
            $scope.myMap.clearMap();
            $scope.markers.push(new AMap.Marker({
                map: $scope.myMap,
                position: lnglat
            }));
        }
        $timeout(function () {
            param.longitude && addMarker(param.longitude, param.latitude);
            drawAirspace()
        }, 500);
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };

    });

    /*房屋人员选择器,以房屋为主查询,可以查询房屋信息,如果该房屋下有业主信息,将一并查出*/
    app.controller('housePersonSelectorCtrl', function ($scope, $rootScope, $http, $uibModalInstance, $filter, fac, data) {
        $scope.search = {};
        $scope.pageModel = {};
        $scope.pageModel.data = [];
        $scope.houseInfo = {};

        $scope.find = function (pageNo) {
            if (!$scope.search.parkId) {
                msg("请先选择项目！");
                return;
            }
            angular.extend($scope.search, {
                currentPage: pageNo || $scope.pageModel.currentPage || 1,
                pageSize: $scope.pageModel.pageSize || 10
            });
            fac.getPageResult("/ovu-base/system/parkHouse/listHousePersonByGrid", $scope.search, function (data) {
                $scope.pageModel = data;
            });
        };
        if (data.data.item && data.data.item.parkId) {
            $scope.search.parkId = data.data.item.parkId;
            $scope.search.parkName = data.data.item.parkName;
            $scope.find(1)
        }
        $scope.selectParkCallback = function (item) {
            //
        };
        //选择
        $scope.select = function (house) {
            if (house) {
                $scope.houseInfo.id = house.id;
                $scope.houseInfo.groundNo = house.groundNo;
                $scope.houseInfo.unitNo = house.unitNo;
                $scope.houseInfo.buildId = house.buildId;
                $scope.houseInfo.stageId = house.stageId;
                $scope.houseInfo.parkId = house.parkId;
                $scope.houseInfo.houseName = house.houseName;
            }

        };
        //确定
        $scope.save = function () {
            if (!$scope.houseInfo.id) {
                alert("请选择房屋！");
            } else {
                $uibModalInstance.close($scope.houseInfo);
            }
        };
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    });

    /**
     * 招商系统财务处理公共控件
     * add by chenyin
     * on 2019年6月14日11:00:52
     */
    //财务处理
    app.controller('financeHandleCtrl', function ($scope, $rootScope, $http, $uibModalInstance, $uibModal, $filter, fac, houseInfo, $timeout) {
        
        $scope.financeInfo = {};
        $scope.addnum = 1;
        $scope.sfcMoneyCount = 0;
        $scope.sfiMoneyCount = 0;
        $scope.sfcChecked = false;
        //查询财务处理详情
        var queryFinanceDetail = function (houseId) {
            $http.post("/ovu-park/backstage/sale/finance/findInfo", {
                'houseId': houseId
            }, fac.postConfig).success(function (resp) {
                if (resp.code == 0) {
                    $scope.financeInfo = resp.data;
                    $scope.addnum = $scope.financeInfo.sfcList ? $scope.financeInfo.sfcList.length + 1 : 1;
                    calculateSfcCount()
                } else {
                    alert(resp.msg)
                }
            });
        };
        queryFinanceDetail(houseInfo.houseId);
        fac.loadSelect($scope, "AMOUNT_TYPE"); //款项类型
        fac.loadSelect($scope, "AMOUNT_NAME"); //款项名称

        $scope.checkAll = function (sfcList) {
            if ($scope.financeInfo.sfcList && $scope.financeInfo.sfcList.length > 0) {
                $scope.sfcChecked = !$scope.sfcChecked;
                $scope.financeInfo.sfcList.forEach(function (n) {
                    n.checked = $scope.sfcChecked
                });
            }
        };
        $scope.checkOne = function (item) {
            item.checked = !item.checked;
            if ($scope.financeInfo.sfcList && $scope.financeInfo.sfcList.length > 0) {
                $scope.sfcChecked = $scope.financeInfo.sfcList.every(function (v) {
                    return v.checked;
                });
            }
        };
        $scope.hasChecked = function (data) {
            if (data && data.length) {
                return data.filter(function (n) {
                    return n.checked
                }).length;
            }
            return false;
        };

        var calculateSfcCount = function () {
            $scope.sfcMoneyCount = 0;
            $scope.sfiMoneyCount = 0;
            $scope.financeInfo.sfcList.forEach(function (v) {
                $scope.sfcMoneyCount += parseFloat(v.amountRmb);
                if (v.status == 1) {
                    $scope.isReceive = false
                }
            });
            $scope.financeInfo.sfiList.forEach(function (v) {
                if (v.status != '0') {
                    $scope.sfiMoneyCount += parseFloat(v.receiveAmountRmb)
                }
            });
            if ($scope.sfcMoneyCount != $scope.financeInfo.shouldAmount) {
                $scope.isReceive = true
            } else {
                $scope.isReceive = false
            }
        };
        //切换房间
        $scope.changeHouse = function () {

            var modal = $uibModal.open({
                animation: false,
                size: '',
                templateUrl: '/view/investmentSystem/financeManage/modal.selectHouse.html',
                controller: 'selectHouseCtrl',
                resolve: {
                    contact: {
                        "parkId": app.park.parkId
                    }
                }
            });
            modal.result.then(function (data) {
                queryFinanceDetail(data.houseId)
            }, function () {});
        };
        //合同详情
        $scope.showContractDetail = function (houseId) {
            if (!$scope.financeInfo.contractStatus) {
                return
            }
            var modal = $uibModal.open({
                animation: false,
                size: 'md',
                templateUrl: '/view/investmentSystem/financeManage/modal.contractDetail.html',
                controller: 'contractDetailCtrl',
                resolve: {
                    data: {
                        id: houseId
                    }
                }
            });
            modal.result.then(function () {}, function () {
                console.info('Modal dismissed at: ' + new Date());
            });
        };
        //认购详情
        $scope.showSubscripDetail = function (houseId) {
            if (!$scope.financeInfo.subscriptionStatus) {
                return
            }
            var modal = $uibModal.open({
                animation: false,
                size: 'md',
                templateUrl: '/view/investmentSystem/financeManage/modal.subscriptionDetail.html',
                controller: 'subscriptionDetailCtrl',
                resolve: {
                    data: {
                        id: houseId
                    }
                }
            });
            modal.result.then(function () {

            }, function () {
                console.info('Modal dismissed at: ' + new Date());
            });

        };
        //删除供款明细
        $scope.delete = function (id) {
            confirm("确定删除该供款明细?", function () {
                let ids = [];
                $scope.financeInfo.sfcList.forEach(sfc => {
                    if (sfc.checked) {
                        ids.push(sfc.id)
                    }
                });
                if (ids.length == 0) {
                    alert("请选择一条记录");
                } else {
                    $http.post("/ovu-park/backstage/sale/finance/collection/delete", {
                        collectionIdList: ids.join()
                    }, fac.postConfig).success(function (resp) {
                        if (resp.code == 0) {
                            window.msg("删除成功！");
                            queryFinanceDetail(houseInfo.houseId)
                        } else {
                            alert(resp.msg);
                        }
                    });
                }
            })
        };
        //新增供款明细
        $scope.addDetailed = function (id,houseId) {
            var modal = $uibModal.open({
                animation: false,
                size: 'md',
                templateUrl: '/view/investmentSystem/financeManage/modal.addDetailed.html',
                controller: 'addDetailedCtrl',
                resolve: {
                    deData: {
                        num: $scope.addnum,
                        id: id,
                        houseId:houseId
                    }
                }
            });
            modal.result.then(function () {
                $timeout(function () {
                    queryFinanceDetail(houseInfo.houseId)
                }, 500);


            }, function () {
                console.info('Modal dismissed at: ' + new Date());
            });

        };
        //sfcData有数据表示收款；sfcData没有表示查看
        $scope.receiveMoney = function (id,name,isEdit) {
            var modal = $uibModal.open({
                animation: false,
                size: 'lg',
                templateUrl: '/view/investmentSystem/financeManage/modal.receiveMoney.html',
                controller: 'receiveMoneyCtrl',
                resolve: {
                    sfcData: {
                        isEdit: isEdit,
                        name:name,
                        id: id
                    }
                }
            });
            modal.result.then(function () {
                queryFinanceDetail(houseInfo.houseId)
            }, function () {
                console.info('Modal dismissed at: ' + new Date());
            });
        };
        //退款
        $scope.returnMoney = function (type, status, id, isEdit) {
            if (type == '0' && status == '1') {
                return false;
            }
            var modal = $uibModal.open({
                animation: false,
                size: 'lg',
                templateUrl: '/view/investmentSystem/financeManage/modal.returnMoney.html',
                controller: 'returnMoneyCtrl',
                resolve: {
                    sfcData: {
                        isEdit: isEdit,
                        id: id,
                        type: type
                    }
                }
            });
            modal.result.then(function () {
                queryFinanceDetail(houseInfo.houseId)
            }, function () {
                console.info('Modal dismissed at: ' + new Date());
            });
        };

        // 保存
        $scope.save = function () {

        };
        // 取消
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        }


    });

    // 切换房间
    app.controller('selectHouseCtrl', function ($scope, $rootScope, $http, $uibModalInstance, $filter, fac, contact) {
        $scope.item = contact;
        $rootScope.treeData = null;
        $rootScope.flatData = null;
        $scope.config = {
            edit: false,
            showCheckbox: false
        };
        $scope.rightObj = '';
        $scope.newChooseIds = []; //编辑资源，已选定，即将要关联的空间id
        var dataObj = {
            "park_id": $rootScope.project.parkId,
            "haveFinance": true
        };
        $http.post(" /ovu-park/backstage/sale/saleparkhouse/tree", dataObj, fac.postConfig).success(function (treeData) {
            $rootScope.treeData = treeData.data;
            $rootScope.flatData = fac.treeToFlat(treeData.data);
        });

        function expandFather(node) {
            var father = $scope.flatData.find(function (n) {
                return n.did == node.pdid
            });
            if (father) {
                father.state = father.state || {};
                father.state.expanded = true;
                expandFather(father);
            }
        }

        $scope.selectNode = function (node) {
            if ($scope.curNode != node) {
                $scope.curNode && $scope.curNode.state && ($scope.curNode.state.selected = false);
            }
            node.state = node.state || {};
            node.state.selected = !node.state.selected;
            if (node.state.selected) {
                $scope.curNode = node;
                if (node.house_id) {
                    $scope.rightObj = node.stage_name + ">" + node.build_name + ">" + node.house_name;
                } else {
                    $scope.rightObj = '';
                }
            } else {
                $scope.rightObj = ''
            }
        };
        $scope.save = function () {
            if (!$scope.rightObj || !$scope.curNode) {
                alert("请选择房屋！");
                return;
            }
            // 切换房间
            $uibModalInstance.close({
                houseId: $scope.curNode.house_id
            });
        };
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        }
    });
    //合同详情
    app.controller('contractDetailCtrl', function ($scope, $rootScope, $http, $uibModalInstance, $uibModal, $filter, fac, data) {
        $scope.item = data;
        $scope.isContract = false;
        fac.loadSelect($scope, "DECORATION_STANDARD"); //装修
        fac.loadSelect($scope, "FUND_BANK"); //公积金银行
        fac.loadSelect($scope, "MORTGAGE_BANK"); //贷款银行
        fac.loadSelect($scope, "BANLANCE_PLAN"); //装修方案
        $http.post("/ovu-park/backstage/contract/selectByHouseId", {
            houseId: $scope.item.id
        }, fac.postConfig).success(function (resp) {
            if (resp.code == 0) {
                $scope.contactInfo = resp.data;
            } else {
                alert(resp.msg);
            }
        });
        // 保存
        $scope.save = function () {
            $uibModalInstance.close()
        };
        // 取消
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        }
    });
    //认购详情
    app.controller('subscriptionDetailCtrl', function ($scope, $rootScope, $http, $uibModalInstance, $uibModal, $filter, fac, data) {
        $scope.item = data;
        $scope.isSubscription = false;
        fac.loadSelect($scope, "DECORATION_STANDARD"); //装修
        $http.get("/ovu-park/backstage/subscription/selectByHouseId?houseId=" + $scope.item.id).success(function (resp) {
            if (resp.code == 0) {
                $scope.subsInfo = resp.data
            } else {
                alert(resp.msg)
            }
        });
        // 保存
        $scope.save = function (form) {
            $uibModalInstance.close()
        };
        // 取消
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        }
    });
    //新增供款明细
    app.controller('addDetailedCtrl', function ($scope, $rootScope, $http, $uibModalInstance, $filter, fac, deData) {
        $scope.detailed = {
            orderNum: deData.num,
            balanceId: deData.id,
            exchangeRate: 1.00,
            amountRmb: 0,
            currency: "RMB",
            houseId:deData.houseId
        };
        // 保存
        $scope.save = function (form, detailed) {
            form.$setSubmitted(true);
            if (!form.$valid) {
                return false;
            }
            $.post("/ovu-park/backstage/sale/finance/collection/add", $scope.detailed, function (resp) {
                if (resp.code == 0) {
                    window.msg("新增成功！");
                    $uibModalInstance.close();
                } else {
                    window.alert(resp.msg);
                }
            });
            $uibModalInstance.close()
        };
        // 取消
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
        $scope.currencyChange = function (detailed) {
            //根据币种查询汇率
            if (detailed.currency == 'RMB') {
                detailed.exchangeRate = 1.00;
                detailed.amountRmb = detailed.amount;
            }

        };
        $scope.changeAmountRmb = function (detailed) {
            //根据汇率计算折人民币金额
            detailed.amountRmb = detailed.amount;

        };
        fac.loadSelect($scope, "AMOUNT_TYPE"); //款项类型
        fac.loadSelect($scope, "AMOUNT_NAME"); //款项名称
        fac.loadSelect($scope, "CURRENCY") //币种
    });
    //收款
    app.controller('receiveMoneyCtrl', function ($scope, $rootScope, $http, $uibModalInstance, $filter, sfcData, fac) {
       
        $scope.isEdit = sfcData.isEdit;
        $scope.id = sfcData.id;
        $scope.invoices = {};
        //收款页面初始化
        var initData = function () {
            //根据id查询收款新
            if ($scope.isEdit) {
                let param = {
                    balanceId: $scope.id
                };
                $http.post("/ovu-park/backstage/sale/finance/invoices/init", param, fac.postConfig).success(function (resp) {
                    if (resp.code == 0) {
                        $scope.invoices = resp.data;
                        $scope.invoices.payerId = $scope.invoices.payerId ? $scope.invoices.payerId : sfcData.name
                        $scope.invoices.payeeId = $scope.invoices.payeeId ? $scope.invoices.payeeId : app.user.nickname
                    } else {
                        window.alert(resp.msg);
                        $uibModalInstance.close();
                    }
                });
            } else {
                let param = {
                    id: $scope.id
                };
                $http.post("/ovu-park/backstage/sale/finance/invoices/findInfo", param, fac.postConfig).success(function (resp) {
                    if (resp.code == 0) {
                        $scope.invoices = resp.data;
                        $scope.receiveMoneyTotal(null);
                    } else {
                        window.alert(resp.msg);
                        $uibModalInstance.close();
                    }
                });
            }


        };
        initData();
        // 保存
        $scope.save = function (form) {
            form.$setSubmitted(true);
            if (!form.$valid) {
                return false;
            }
            //应收应该等于实收
            let isOk = true;
            $scope.invoices.detailList.forEach(detail => {
                if (detail.amount != 0 && detail.amount != detail.amountRmb) {
                    isOk = false;

                }
            });
            if (!isOk) {
                window.alert("实收金额不等于应收金额！");
                return false
            }
            $scope.invoices.detailListStr = JSON.stringify($scope.invoices.detailList);
            $scope.invoices.type = "0";
            $http.post("/ovu-park/backstage/sale/finance/invoices/add", $scope.invoices, fac.postConfig).success(function (resp) {
                if (resp.code == 0) {
                    window.msg("收款成功！");
                    $uibModalInstance.close()
                } else {
                    window.alert(resp.msg);
                }
            })
        };
        $scope.examine = function (id, balanceId) {
            layer.confirm("是否通过审核？", {
                btn: ['是', '否']
            }, function () {
                $http.post("/ovu-park/backstage/sale/finance/invoices/approve", {
                    id: id,
                    balanceId: balanceId,
                    status: "2"
                }, fac.postConfig).success(function (resp) {
                    if (resp.code == 0) {
                        window.msg("审批成功！");
                        $uibModalInstance.close()
                    } else {
                        window.alert(resp.msg);
                    }
                })
            }, function () {
                $http.post("/ovu-park/backstage/sale/finance/invoices/approve", {
                    id: id,
                    balanceId: balanceId,
                    status: "0"
                }, fac.postConfig).success(function (resp) {
                    if (resp.code == 0) {
                        window.msg("驳回成功！");
                        $uibModalInstance.close()
                    } else {
                        window.alert(resp.msg);
                    }
                })
            });
        };

        // 取消
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
        // 汇总单据收款总金额
        $scope.receiveMoneyTotal = function (detail) {
            if (detail != null && detail.amount != detail.amountRmb) {
                window.alert("收款金额必须等于应收金额!");
                return false
            }
            $scope.receivedAmountRate = 0;
            $scope.receivedAmount = 0;
            if ($scope.invoices && $scope.invoices.detailList) {
                $scope.invoices.detailList.forEach(detail => {
                    if (detail.amount) {
                        $scope.receivedAmountRate = (parseFloat($scope.receivedAmountRate) + detail.amount).toFixed(2);
                        $scope.receivedAmount = (parseFloat($scope.receivedAmount) + detail.amount * (1 - detail.rate / 100)).toFixed(2);
                    }
                })
            }
        };
        fac.loadSelect($scope, "AMOUNT_TYPE"); //款项类型
        fac.loadSelect($scope, "AMOUNT_NAME"); //款项名称
        fac.loadSelect($scope, "PAY_TYPE"); //支付方式
        fac.loadSelect($scope, "ENTRY_BANK"); //入账银行
        fac.loadSelect($scope, "BANK_PAY_TYPE"); //银付方式
        fac.loadSelect($scope, "SWIPED_TERMINA"); //刷卡终端
        fac.loadSelect($scope, "BANK_CARD"); //银行卡
        fac.loadSelect($scope, "CLEARING_FORM") //结算方式


    });
    //退款
    app.controller('returnMoneyCtrl', function ($scope, $rootScope, $http, $uibModalInstance, $filter, sfcData, fac) {
        //初始化退款信息
        $scope.isEdit = sfcData.isEdit;
        $scope.id = sfcData.id;
        $scope.returnInfo = {};
        let param = {
            id: $scope.id
        };
        if (sfcData.type == '0') {
            $http.post("/ovu-park/backstage/sale/finance/invoices/findInfo", param, fac.postConfig).success(function (resp) {
                if (resp.code == 0) {
                    $scope.returnInfo = resp.data;
                    //退款单据列表默认为收款单据列表
                    $scope.returnInfo.refundDetailList = resp.data.detailList;
                    $scope.receiveMoneyTotal();
                    $scope.returnMoneyTotal(null);
                } else {
                    window.alert(resp.msg);
                    $uibModalInstance.close();
                }
            });
        } else {
            $http.post("/ovu-park/backstage/sale/finance/invoices/findRefundInfo", param, fac.postConfig).success(function (resp) {
                if (resp.code == 0) {
                    $scope.returnInfo = resp.data;
                    $scope.receiveMoneyTotal();
                    $scope.returnMoneyTotal(null);
                } else {
                    window.alert(resp.msg);
                    $uibModalInstance.close();
                }
            });
        }


        // 保存
        $scope.save = function () {
            //校验退款金额
            let flag = true;
            if ($scope.returnInfo && $scope.returnInfo.refundDetailList) {
                $scope.returnInfo.refundDetailList.forEach(detail => {
                    if (detail.refundAmount != detail.amount) {
                        flag = false;
                    }
                });
                if (!flag) {
                    window.alert("退款金额不等于收款金额，不允许收款！");
                    return false;
                }
            } else {
                window.alert("没有退款信息，不能提交！");
                return false;
            }
            //保存退款信息
            $scope.returnInfo.refundForId = $scope.returnInfo.id;
            $scope.returnInfo.id = null;
            $scope.returnInfo.type = "1";
            $scope.returnInfo.refundDetailListStr = JSON.stringify($scope.returnInfo.refundDetailList);
            $http.post("/ovu-park/backstage/sale/finance/invoices/add", $scope.returnInfo, fac.postConfig).success(function (resp) {
                if (resp.code == 0) {
                    window.msg("退款成功！");
                    $uibModalInstance.close()
                } else {
                    window.alert(resp.msg);
                }
            })
        };
        $scope.examine = function (id, balanceId) {
            layer.confirm("是否通过审核？", {
                btn: ['是', '否']
            }, function () {
                $http.post("/ovu-park/backstage/sale/finance/invoices/approve", {
                    id: id,
                    balanceId: balanceId,
                    status: "2"
                }, fac.postConfig).success(function (resp) {
                    if (resp.code == 0) {
                        window.msg("审批成功！");
                        $uibModalInstance.close()
                    } else {
                        window.alert(resp.msg);
                    }
                })
            }, function () {
                $http.post("/ovu-park/backstage/sale/finance/invoices/approve", {
                    id: id,
                    balanceId: balanceId,
                    status: "0"
                }, fac.postConfig).success(function (resp) {
                    if (resp.code == 0) {
                        window.msg("驳回成功！");
                        $uibModalInstance.close()
                    } else {
                        window.alert(resp.msg);
                    }
                })
            });
        };

        // 取消
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
        // 汇总单据收款总金额
        $scope.receiveMoneyTotal = function () {
            $scope.receivedAmountRate = 0;
            $scope.receivedAmount = 0;
            if ($scope.returnInfo && $scope.returnInfo.detailList) {
                $scope.returnInfo.detailList.forEach(detail => {
                    if (detail.amount) {
                        $scope.receivedAmountRate = (parseFloat($scope.receivedAmountRate) + detail.amount).toFixed(2);
                        $scope.receivedAmount = (parseFloat($scope.receivedAmount) + detail.amount * (1 - detail.rate / 100)).toFixed(2);
                    }
                })
            }
        };
        // 汇总单据退款总金额
        $scope.returnMoneyTotal = function (detail) {
            if (detail != null && detail.refundAmount != detail.amount) {
                window.alert("退款金额必须等于实收金额");
                return false
            }
            $scope.refundAmountRate = 0;
            $scope.refundAmount = 0;
            if ($scope.returnInfo && $scope.returnInfo.refundDetailList) {
                $scope.returnInfo.refundDetailList.forEach(detail => {
                    if (detail.refundAmount) {
                        $scope.refundAmountRate = (parseFloat($scope.refundAmountRate) + detail.refundAmount).toFixed(2);
                        $scope.refundAmount = (parseFloat($scope.refundAmount) + detail.refundAmount * (1 - detail.rate / 100)).toFixed(2);
                    }
                })
            }
        };
        fac.loadSelect($scope, "AMOUNT_TYPE"); //款项类型
        fac.loadSelect($scope, "AMOUNT_NAME"); //款项名称
        fac.loadSelect($scope, "PAY_TYPE"); //支付方式
        fac.loadSelect($scope, "ENTRY_BANK"); //入账银行
        fac.loadSelect($scope, "BANK_PAY_TYPE"); //银付方式
        fac.loadSelect($scope, "SWIPED_TERMINA"); //刷卡终端
        fac.loadSelect($scope, "BANK_CARD"); //银行卡
        fac.loadSelect($scope, "CLEARING_FORM") //结算方式
    });

    // 新增编辑租赁合同(租赁申请和租赁合同共用)
    app.directive('ngInput', [function () {
        return {
            restrict: 'A',
            require: '?ngModel',
            link: function (scope, element, attrs) {
                element.on('input', oninput);
                scope.$on('$destroy', function () { //销毁的时候取消事件监听
                    element.off('input', oninput);
                });

                function oninput(event) {
                    scope.$evalAsync(attrs['ngInput'], {
                        $event: event,
                        $value: this.value
                    });
                }
            }
        }
    }]);
       //选择业务员弹框
       app.controller('chooseManager', function ($scope, $rootScope, $http, $uibModalInstance, $uibModal, $filter, fac) {
        $scope.pageModel={}
        $scope.search={
            parkId:'',
            name:'',
            phone:''
        }
        $scope.managerList=[]
        $scope.$watch('project.id', function (projectId, oldValue) {
            if (projectId) {
                $scope.search.parkId = '';
                $scope.search.parkId = app.park.parkId
                $scope.search.parkId = $rootScope.project.parkId;
                $rootScope.project.stageId && ($scope.search.stageId = $rootScope.project.stageId)
                $rootScope.project.buildId && ($scope.search.buildId = $rootScope.project.buildId)
                $scope.find(1)
            }
        })
        //业务员查询接口
        $scope.find=function(pageNo){
            $.extend($scope.search, {
                currentPage: pageNo || $scope.pageModel.currentPage || 1,
                pageSize: 8
            });
            $scope.search.pageIndex=$scope.search.currentPage-1
            $scope.search.totalCount=$scope.pageModel.totalCount || 0
            fac.getPageResult('/ovu-crm/backstage/investment/agentInfo/agentList',$scope.search,function(data){
               
                    $scope.pageModel=data
                    $scope.pageModel.data.forEach(v=>{
                        v.checked=false
                    })
                   

            })
        }
        $rootScope.checkOne = function (item) {
            let isOneChecked=false
            if(item.checked==false){
                $scope.pageModel.data.forEach(v=>{
                    if(v.checked){
                        v.checked=false
                    }
                })
                item.checked=true
            }else{
                item.checked=false
            }
            
        }
        $scope.chooseSure=function(){
            $scope.pageModel.data.forEach(v=>{
                if(v.checked){
                    let data={'name':v.name,'id':v.id}
                    $uibModalInstance.close(data);
                }
            })

        }


        // 取消
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancle');
        }
    });
    app.controller('addAgreementCtrl', function ($scope, $rootScope, $http, $filter, $uibModal, $uibModalInstance, fac, curContractId) {
      
        //业务员获取焦点出现弹框
        $scope.businessManagerFocus=function(){
       
            var modal = $uibModal.open({
                animation: false,
                size: 'md',
                templateUrl: '/view/rental/rentAgreementNew/modal.chooseManager.html',
                controller: 'chooseManager',
                // resolve: { customerObj: item }
            });
            modal.result.then(function (data) {
            
                $scope.baseMsg.consultant=data.name
                $scope.baseMsg.consultantId=data.id
                // $scope.find();
            }, function () {
                console.info('Modal dismissed at: ' + new Date());
            });
        }
     
        // 保存账单生成约定(createBillModel)和合同状态(status)
        $scope.contractBillStatus = angular.copy(curContractId);
        // 控制执行中的按租赁空间生成账单的合同 true为执行中,false为非执行中
        $scope.executingContractStatus = false;
        if ($scope.contractBillStatus && $scope.contractBillStatus.createBillModel == '2' && $scope.contractBillStatus.status == '2') {
            $scope.executingContractStatus = true;
        }
        $scope.user = app.user;
        $scope.title = {
            addStatus: true
        };
        // 存储编辑是的原始租赁空间
        $scope.beginningRentHouses = [];
        // 每次变更/新增空间相对新增加的租赁空间
        $scope.newAddRentHouses = [];
        // 每次变更/新增空间相对还剩余的租赁空间
        $scope.beLeftRentHouses = [];
        // 新增步骤
        $scope.currentStep = 1;
        // 租金约定步的tab栏控制
        $scope.rentalStep = 1;
        // 基本资料相关状态值
        $scope.leaseTimeChange = false;
        $scope.leaseDetailChange = true;
        // 首期约定
        $scope.toFirstPeriod = false;
        // 基本资料详细设置
        $scope.baseMsgDetailStatus = false;
        // 判断抽成模式的保底金额是否有填写
        $scope.bottomAmountStatus = false;
        // 租金模式
        $scope.rentalModalList = [{
                id: 1,
                text: "固定租金"
            },
            {
                id: 2,
                text: "比例抽成"
            },
            {
                id: 3,
                text: "固定租金,比例抽成"
            }
        ];
        // 乙方类型
        $scope.secondTypeList = [{
                value: 1,
                text: "个人"
            },
            {
                value: 2,
                text: "企业"
            }
        ];
        // 支付方式
        $scope.payWay = [{
                value: 1,
                text: "月付"
            },
            {
                value: 2,
                text: "季付"
            },
            {
                value: 3,
                text: "年付"
            }
        ];
        // 免租期
        $scope.freeTime = [{
                value: 1,
                text: "一个月"
            },
            {
                value: 2,
                text: "两个月"
            },
            {
                value: 3,
                text: "三个月"
            }
        ];
        // 月天数
        $scope.monthCount = [{
                value: 1,
                text: "固定天数30天/月"
            },
            {
                value: 2,
                text: "自然月"
            }
        ];
        // 租金约定
        // 计费单位
        $scope.unitStatus = [{
                name: '元/日/㎡',
                id: 1
            },
            {
                name: '元/月/㎡',
                id: 2
            },
            {
                name: '元/季度/㎡',
                id: 3
            },
            {
                name: '元/半年/㎡',
                id: 4
            },
            {
                name: '元/年/㎡',
                id: 5
            }
        ];
        // 交费周期
        $scope.payStatus = [{
                name: '月',
                id: 1
            },
            {
                name: '季度',
                id: 2
            },
            {
                name: '半年',
                id: 3
            },
            {
                name: '年',
                id: 4
            }
        ];
        // 周期推算方式
        $scope.cycleStatus = [{
            name: '按月顺推',
            id: 1
        }];
        // 固定租金约定--交费期限
        $scope.dueTimeStatus = [{
                name: '上期最后一日',
                id: 1
            },
            {
                name: '本期首日',
                id: 2
            },
            {
                name: '本期首日后',
                id: 3
            },
            {
                name: '本期首日前',
                id: 5
            }
        ];
        // 抽成租金约定--交费期限
        $scope.rentOutDueTimeStatus = [
            // { name: '本期首日后', id: 1 },
            {
                name: '营业额提交后',
                id: 4
            }
        ];
        // 首期交费期限
        $scope.downPayStatus = [{
                // name: '合同审批后',
                name: '合同线上审批后',
                id: 1
            },
            {
                name: '指定日期',
                id: 2
            },
            {
                // name: '第三个选项',
                name: '合同线下审批日期后',
                id: 3
            }
        ];
        // 抽成模式
        $scope.cutStatus = [{
                name: '按金额抽成',
                id: 1
            },
            {
                name: '按比例抽成',
                id: 2
            }
        ];
        // 计费基准
        $scope.taxStatus = [{
                name: '税前',
                id: 1
            },
            {
                name: '税后',
                id: 2
            }
        ];
        // 费项名称
        $scope.otherChargeStatus = [{
            name: '履约保证金',
            id: 1
        }];
        // 抽成模式
        $scope.commissionModelStatus = [{
            name: '固定比例',
            id: 2
        }];
        // 计费标准
        $scope.billingRatesList = [{
                name: '一次性收费',
                id: 1
            },
            {
                name: '周期性收费',
                id: 2
            },
            {
                name: '计量表收费',
                id: 3
            },
            {
                name: '单位：日/㎡',
                id: 4
            },
            {
                name: '单位：月/㎡',
                id: 5
            },
            {
                name: '单位：季度/㎡',
                id: 6
            },
            {
                name: '单位：年/㎡',
                id: 7
            },
        ];

        // 已租赁空间
        $scope.hasRentedHouseTree = function (id) {
            var dataObj = {
                "id": id
            };
            $http.post("/ovu-park/backstage/rental/contract/getRentHouseTree ", dataObj, fac.postConfig).success(function (resp) {
                if (resp.code == 0) {
                    var tree = resp.data.tree;
                    var rentList = resp.data.rentList;
                    $rootScope.treeData = tree;
                    $rootScope.flat = fac.treeToFlat(tree);
                    $rootScope.ownerChooseIds = []; //合同已关联的空间id
                    if (rentList && rentList.length > 0) {
                        rentList.forEach(function (n) {
                            var treeNode;
                            var data = $scope.flat.find(function (m) {
                                treeNode = m;
                                return m.houseId == n.id;
                            });
                            data && (n.fullPath = data.fullPath);
                            n.fullPath = treeNode.stageName + ">" + treeNode.buildName + ">" + treeNode.houseName;
                            $rootScope.ownerChooseIds.push(n.houseId);
                        });
                        $scope.rentHouses = rentList.filter(function (n) {
                            return n.fullPath
                        });

                    }
                }
            });
        };
        // 获取 合同类型 新增 or 编辑
        $scope.getConteactType = function () {
            var params = {
                "parkId": app.park.parkId,
                "isInvest": "0" //0:非招商, 1:招商
            };
            $http.post("/ovu-park/backstage/rental/contractType/listAll", params, fac.postConfig).success(function (resp) {
                if (resp.code == 0) {
                    $scope.typeList = resp.data;
                    // 编辑 or 新增 合同 
                    // 编辑
                    if (curContractId && curContractId.id) {
                        $scope.title.addStatus = false;
                        $scope.contractId = curContractId;
                        $scope.edit = true;
                        $scope.contactType = "";
                        $scope.baseMsg = {};
                        $scope.fixedRentMsg = {};
                        $scope.rentOutMsg = {};
                        $scope.initialAgreeMsg = {};
                        $scope.otherChargeMsg = {};
                        $scope.conditionMsg = {};
                        $scope.billStandard = {};
                        $scope.contactType = $scope.contractId.contractTypeId;
                        $scope.contactTypeCache = $scope.contractId.contractTypeId;
                        $scope.baseMsg.id = curContractId.id;
                        // 获取关联空间
                        $scope.hasRentedHouseTree($scope.contractId.id);
                        $scope.checkOne($scope.contactType);
                    }
                    // 新增 
                    else {
                        $scope.title.addStatus = true;
                        $scope.contactType = "";
                        $scope.baseMsg = {};
                        $scope.contactFileList = [];
                    }
                } else {
                    window.alert(resp.message);
                }
            });
        };
        // 获取税率
        $scope.getTaxRate = function () {
            $http.get("/ovu-park/backstage/rental/contractParam/getParamByCode?code=RENT_TAX_RATE&parkId="+app.park.parkId).success(function (resp) {
                if (resp.code === 0) {
                    $scope.contractTaxRate = resp.data;
                } else {
                    window.alert(resp.message);
                }
            })
        };
        // 获取 递增率列表
        $scope.getRate = function () {
            $http.post("/ovu-park/backstage/rental/increaseRate/listAll", {
                parkId: app.park.parkId
            }, fac.postConfig).success(function (resp) {
                if (resp.code == 0) {
                    $scope.rateList = resp.data;
                } else {
                    window.alert(resp.message);
                }
            });
        };
        // 获取首期约定涵盖日期（按合同生成账单）
        $scope.getFirstPeriodDate = function (id) {
            let param = {
                contractId: id
            };
            $http.post("/ovu-park/backstage/rental/contractBaseInfo/getFirstPeriodDate", param, fac.postConfig).success(function (resp) {
                if (resp.code === 0) {
                    $scope.initialAgreeMsg.firstStartDate = resp.data.start;
                    $scope.initialAgreeMsg.firstEndDate = resp.data.end;
                    $scope.toFirstPeriod = true;
                }
            })
        };
        // 获取首期约定涵盖日期（按租赁空间生成账单）
        $scope.getHouseFirstPeriodDate = function (id) {
            let param = {
                contractId: id
            };
            $http.post("/ovu-park/backstage/rental/contractBaseInfo/getHouseFirstPeriodDate", param, fac.postConfig).success(function (resp) {
                if (resp.code === 0) {
                    $scope.initialAgreeMsg.initialAgreeList = resp.data;
                    $scope.initialAgreeMsg.initialAgreeList.forEach((value, index) => {
                        value.firstStartDate = value.start;
                        value.firstEndDate = value.end;
                    });
                    if ($scope.initialAgreeMsg.initialAgreeList.length > 0) {
                        $scope.initialAgreeMsg.firstPayPeriod = $scope.initialAgreeMsg.initialAgreeList[0].firstPayPeriod ? ($scope.initialAgreeMsg.initialAgreeList[0].firstPayPeriod + '') : '';
                        $scope.initialAgreeMsg.firstAppiontDate = $scope.initialAgreeMsg.initialAgreeList[0].firstAppiontDate ? $filter('date')($scope.initialAgreeMsg.initialAgreeList[0].firstAppiontDate, 'yyyy-MM-dd') : '';
                        $scope.initialAgreeMsg.afterApproveDays = $scope.initialAgreeMsg.initialAgreeList[0].afterApproveDays ? ($scope.initialAgreeMsg.initialAgreeList[0].afterApproveDays) : '';
                    } else {
                        $scope.initialAgreeMsg.firstPayPeriod = '';
                        $scope.initialAgreeMsg.firstAppiontDate = '';
                        $scope.initialAgreeMsg.afterApproveDays = '';
                    }

                    $scope.toFirstPeriod = true;
                }
            })
        };
        // 选择 合同类型
        $scope.checkOne = function (id, status) {
           
            if (status) {
                return;
            }
            for (var i in $scope.typeList) {
                if (id === $scope.typeList[i].id) {
                    $scope.typeList[i].checked = !$scope.typeList[i].checked;
                } else {
                    $scope.typeList[i].checked = false;
                }
            }
            $scope.contactType = id;
        };

        $scope.blurBox = 0;
        $scope.selCustomer = function (x) {
            $scope.secondPartyName = x.customerName;
            $scope.baseMsg.secondPartyId = x.customerId;
            $scope.baseMsg.secondPartyName = x.customerName;
            $scope.baseMsg.secondPartyType = x.userType;
          
            $scope.blurBox = 0;
        };

        // ----------------------------------------------------------
        //添加费项
        $scope.openExpenditureList = function () {
            var modal = $uibModal.open({
                animation: false,
                size: '',
                templateUrl: '/view/rental/rentAgreementNew/modal.expenditure.html',
                controller: 'rentExpenditureCtrl',
                resolve: {
                    expenditureList: function () {
                        return $scope.expenditureList;
                    },
                    expenditureCodes: function () {
                        return $scope.conditionMsg.expenditureIds;
                    }
                }
            });
            modal.result.then(function (data) {
                $scope.conditionMsg.expenditureCodes = data.expenditureCodes;
                $scope.conditionMsg.expenditureNames = data.expenditureNames;
                $scope.conditionMsg.expenditureIds = data.expenditureIds;
                $scope.blurBox = 0;
            }, function () {});
        };
        // 获取 所有费项列表
        $scope.expenditureListAll = function () {
            var params = {
                status: "1",
                parkId: app.park.parkId,
            };
            $http.post("/ovu-park/backstage/rental/rentalExpenditureManage/select", params, fac.postConfig).success(function (resp) {
                $scope.expenditureList = [];
                if (resp.code == 0) {
                    resp.data.forEach(function (n) {
                        if (n.category == "05" && n.name == "履约保证金") {
                            $scope.expenditureList.unshift(n);
                            return;
                        }
                        $scope.expenditureList.push(n);
                    });
                    if ($scope.expenditureList.length == 0) {
                        confirm("当前未设置履约保证金,请先去费项管理设置履约保证金!");
                    }
                } else {
                    window.alert(resp.message);
                }
            });
        };
        // 上传合同
        var accepts = ['.doc', '.docx', '.pdf', '.xls', '.xlsx'];

        $scope.uploadFile = function () {
            if ($scope.executingContractStatus) {
                return;
            }
            var params = {};
            $scope.contactFileList = $scope.contactFileList || [];
            $rootScope.addLimitFiles2($scope.contactFileList, 'url', 'name', accepts, 5);

        };
        // 删除合同文档
        $scope.delContactFile = function (index) {
            if ($scope.executingContractStatus) {
                return;
            }
            $scope.contactFileList.splice(index, 1);
        };
        // 添加空间
        $scope.openRentHouseModal = function (houses, contactId) {
            if (houses == undefined) {
                houses = [];
            }
            var modal = $uibModal.open({
                animation: false,
                size: 'md',
                templateUrl: '/view/rental/rentAgreementNew/modal.houseMulti.html',
                controller: 'rentHouseModalCtrl',
                resolve: {
                    houses: function () {
                        return angular.extend([], houses)
                    },
                    contact: {
                        "id": contactId,
                        "parkId": app.park.parkId,
                        "parkName": app.park.parkName
                    },
                    beginningHouse: function () {
                        return angular.extend([], $scope.beginningRentHouses);
                    }
                }
            });
            modal.result.then(function (data) {
                let starts = [];
                let ends = [];
                let approachTimes = [];
                // 比较合并
                data.houses = assignObject(data.houses, $scope.rentHouses);
                $scope.rentHouses = data.houses;
                $scope.newAddRentHouses = data.newAddHouseList;
                $scope.beLeftRentHouses = data.beLeftHouseList;
                $scope.rentHouses.forEach((value, index) => {
                    !value.leaseStart && (value.leaseStart = $scope.baseMsg.leaseStart);
                    !value.leaseEnd && (value.leaseEnd = $scope.baseMsg.leaseEnd);
                    !value.enterDate && (value.enterDate = $scope.baseMsg.enterDate);
                    value.leaseStart && starts.push(value.leaseStart);
                    value.leaseEnd && ends.push(value.leaseEnd);
                    value.enterDate && approachTimes.push(value.enterDate);
                });
                if (!$scope.executingContractStatus) {
                    let minStartTime = getMaxMin(starts, 1);
                    let maxEndTime = getMaxMin(ends, 0);
                    let minApproachTime = getMaxMin(approachTimes, 1);
                    $scope.baseMsg.leaseStart = minStartTime;
                    $scope.baseMsg.leaseEnd = maxEndTime;
                    $scope.baseMsg.enterDate = minApproachTime;
                }
                $scope.baseMsgDetailStatus = isEqual(starts, ends);
                // 房屋id拼接的字符串
                $scope.newChooseIds = data.newChooseIds;
                var params = {
                    'contractHouseIds': $scope.newChooseIds.join(',')
                };
                $http.post("/ovu-park/backstage/rental/contract/calculateRental", params, fac.postConfig).success(function (resp) {
                    if (resp.code == 0) {
                        $scope.baseMsg.contractArea = resp.data.totalArea;
                        $scope.baseMsg.initMonthRental = resp.data.initMonthRental;
                    } else {
                        delete $scope.baseMsg.contractArea;
                        delete $scope.baseMsg.initMonthRental;
                        window.alert(resp.message)
                    }
                })
            }, function () {});
        };
        // 比较两个数组(数组元素为对象),合并相同项
        function assignObject(targetArr, mergedArr) {
            if (!mergedArr) {
                return targetArr;
            }
            if (mergedArr.length === 0) {
                return targetArr;
            }
            for (let i = 0; i < targetArr.length; i++) {
                let tarele = targetArr[i];
                for (let j = 0; j < mergedArr.length; j++) {
                    let merele = mergedArr[j];
                    if (tarele.houseId == merele.houseId) {
                        Object.assign(tarele, merele);
                    }
                }
            }
            return targetArr;
        }
        // 添加乙方
        $scope.openRentHouseParty = function () {
            if ($scope.executingContractStatus) {
                return;
            }
            var modal = $uibModal.open({
                animation: false,
                size: '',
                templateUrl: '/view/rental/rentAgreementNew/modal.houseParty.html',
                controller: 'rentHousePartyCtrl',
                resolve: {}
            });
            modal.result.then(function (data) {
                $scope.secondPartyName = data.secondParty.name;
                $scope.baseMsg.secondPartyName = data.secondParty.name;
                $scope.baseMsg.secondPartyId = data.secondParty.personId;
                $scope.baseMsg.secondPartyType = data.secondParty.userType;
                $scope.blurBox = 0;
            }, function () {});
        };
        //设置费用标准
        $scope.openSetCost = function (index, item) {
            var modal = $uibModal.open({
                animation: false,
                size: '',
                templateUrl: '/view/rental/rentAgreementNew/modal.setCost.html',
                controller: 'setCostCtrl1',
                resolve: {
                    expenditure: item,
                    index: index
                }
            });
            modal.result.then(function (data) {
                var index = data.index;
                $scope.pageModel[index] = data.expenditure;
                $scope.blurBox = 0;
            }, function () {});
        };
        // 设置计费方式
        $scope.setConst = function () {
            var modal = $uibModal.open({
                animation: false,
                size: '',
                templateUrl: '/view/rental/rentAgreementNew/modal.setCost.html',
                controller: 'rentSetCostCtrl',
                resolve: {
                    houses: function () {
                        return angular.extend([], houses)
                    },
                    contact: {
                        "id": contactId,
                        "parkId": app.park.parkId
                    }
                }
            });
            modal.result.then(function (data) {

                $http.post("").success(function (resp) {

                })
            }, function () {});
        };

        // 费用分页列表
        $scope.pageModel = {};
        $scope.pageModelCache = {};
        $scope.search = {};
        $scope.searchCache = {};
        // 储存所有定价
        $scope.forFind = function () {
            // 储存 费项 列表数据
            $scope.searchCache.contractId = $scope.baseMsg.id;
            fac.getPageResult("/ovu-park/backstage/rental/contract/contractExpenditure/listByContractId", $scope.searchCache, function (data) {
                $scope.pageModelCache = data;
                angular.forEach($scope.pageModelCache, function (data, index, array) {
                    var x = index;
                    $scope.billStandard.contractExpenditureList[x] = {
                        averageUnitPrice: array[index].averageUnitPrice,
                        id: array[index].id
                    }
                });
            });
            
        };
        $scope.find = function () {
            $scope.search.contractId = $scope.baseMsg.id;
            fac.getPageResult("/ovu-park/backstage/rental/contract/contractExpenditure/listByContractId", $scope.search, function (data) {
                $scope.pageModel = [];
                data.forEach(function (n) {
                    if (n.firstPrice != null && n.firstPrice != 0) {
                        n.yesOrNo = "1";
                    } else {
                        n.yesOrNo = "0";
                    }
                    var t = n.payTime;
                    n.payTime = parseInt(t);
                    if (n.name != "租金") {
                        n.payType = "11";
                    }
                    if (n.name != "履约保证金") {
                        $scope.pageModel.push(n);
                    }
                });
            });
        };
        // 账单约定变化控制租金模式
        $scope.billStatusChange = function (type) {
            if (type === '1') {
                $scope.rentalModalList = [{
                        id: 1,
                        text: "固定租金"
                    },
                    {
                        id: 2,
                        text: "比例抽成"
                    },
                    {
                        id: 3,
                        text: "固定租金,比例抽成"
                    }
                ];
            } else {
                $scope.rentalModalList = [{
                    id: 1,
                    text: "固定租金"
                }];
                $scope.baseMsg.rentalModal = '1';
            }
        };
        // 租期详细设置
        $scope.leaseDetail = function (start, end, enter) {
            if (!$scope.rentHouses || $scope.rentHouses.length == 0) {
                window.alert("请选择租赁空间!");
                return false;
            }
            $scope.rentHouses.forEach((value, index) => {
                !value.leaseStart && (value.leaseStart = start);
                !value.leaseEnd && (value.leaseEnd = end);
                !value.enterDate && (value.enterDate = enter);
            });

            var modal = $uibModal.open({
                animation: false,
                size: '',
                templateUrl: '/view/rental/rentAgreementNew/modal.leaseDetail.html',
                controller: 'leaseDetailCtrl',
                resolve: {
                    item: function () {
                        return $scope.rentHouses;
                    },
                    leaseMsg: function () {
                        return $.extend({}, {
                            executingContractStatus: $scope.executingContractStatus,
                            start: $scope.baseMsg.leaseStart,
                            end: $scope.baseMsg.leaseEnd
                        })
                    }
                }
            });
            modal.opened.then(function () { //模态窗口打开之后执行的函数   
                $scope.leaseDetailChange = false;
            });
            modal.result.then(function (data) {
                if (data.minStartTime && !$scope.executingContractStatus) {
                    $scope.baseMsg.leaseStart = data.minStartTime;
                }
                if (data.maxEndTime && !$scope.executingContractStatus) {
                    $scope.baseMsg.leaseEnd = data.maxEndTime;
                }
                $scope.baseMsg.leaseMonth = getTotalMonths($scope.baseMsg.leaseStart, $scope.baseMsg.leaseEnd, 1);
                $scope.baseMsg.enterDate = data.minApproachTime;
                $scope.rentHouses = data.detailList;
                $scope.baseMsgDetailStatus = data.status;
            }, function () {
                console.info('Modal dismissed at: ' + new Date());
            });
        };

        //租期改变& 计算租期
        $scope.getLeaseMonth = function (leaseStart, leaseEnd, type) {
            $scope.leaseTimeChange = true;
            $scope.baseMsgDetailStatus = false;
            let months = getTotalMonths(leaseStart, leaseEnd, 1);
            if (type == 1) {
                $scope.baseMsg.leaseMonth = months;
                // let enterToStart = legalTime(leaseStart, $scope.baseMsg.enterDate, 3);
                // let enterToEnd = legalTime($scope.baseMsg.enterDate, leaseEnd, 3);
                // if (!enterToStart || !enterToEnd) {
                    // $scope.baseMsg.enterDate = leaseStart;
                // }
            }
            $scope.rentHouses && $scope.rentHouses.forEach((value, index) => {
                value.leaseStart = $scope.baseMsg.leaseStart;
                value.leaseEnd = $scope.baseMsg.leaseEnd;
                value.enterDate = $scope.baseMsg.enterDate;
            })
        };
        $scope.pageModel = [];
        //监听“是否按首期”选项，调整首期金额的值
        $scope.$watch("pageModel", function (newVal, oldVa1) {
            for (var i = 0; i < newVal.length; i++) {
                if (newVal[i].yesOrNo == "0") {
                    newVal[i].firstPrice = 0;
                }
            }
        }, true);

        /**
         * 租金约定
         */

        /**
         * 固定租金约定部分开始
         */
        $scope.isNoClick = true;
        $scope.fixedTimeLegitimacy = true;
        $scope.fixedTimeLimit = true;
        // 租赁条件约定起止时间和截止时间
        $scope.fixedRentStartTimes = [];
        $scope.fixedRentEndTimes = [];
        // 租赁条件约定列表
        $scope.fixedRentList = [];
        // 存储租赁条件约定列表单价(保持精度)
        $scope.fixedRentUnitPriceList = [];

        // 关于起止时间的联系 type:1是操作的开始时间;2是操作的截止时间
        $scope.fixedRentEndChange = function (curStart, oldStart, curEnd, oldEnd, index, type) {
         
            // debugger;
            $scope.fixedTimeLimit = legalTime(curEnd, $scope.baseMsg.leaseEnd, 2);
            $scope.fixedTimeLegitimacy = legalTime(curStart, curEnd, 1);
            if (type === 1) {
                if (!$scope.fixedTimeLegitimacy) {
                    $scope.fixedRentStartTimes[index] = oldStart;
                }
                let yesterDay = getYesOrTom($scope.fixedRentStartTimes[index], 1);
                $scope.fixedRentEndTimes[index - 1] = yesterDay;
            } else if (type === 2) {
                if (!$scope.fixedTimeLimit) {
                    $scope.fixedRentEndTimes[index] = oldEnd;
                }
                if (!$scope.fixedTimeLegitimacy) {
                    $scope.fixedRentEndTimes[index] = oldEnd;
                }
                if ($scope.fixedRentEndTimes[$scope.fixedRentEndTimes.length - 1] === $scope.baseMsg.leaseEnd) {
                    $scope.isNoClick = true;
                } else {
                    $scope.isNoClick = false;
                }
                let tomorrow = getYesOrTom($scope.fixedRentEndTimes[index], 2);
                $scope.fixedRentStartTimes[index + 1] = tomorrow;
            }
        };
        $scope.getNumbers = function (num) {
          
        };
        // 计算单价和总价
        $scope.fixPriceChange = function (params, index, type) {
          
            let price = params;
            let taxRate;
            if (type === 1) {
                if (!price && price !== 0) {
                    window.alert("固定租金单价不能为空和零!");
                    $scope.fixedRentList[index].totalPrice = '';
                    $scope.fixedRentList[index].taxPrice = '';
                    $scope.fixedRentList[index].rentPrice = '';
                    return false;
                }
                if (!(/^\d+(\.\d+)?$/.test(price))) {
                    window.alert("固定租金单价不能为负值!");
                    price = 0;
                }
                $scope.fixedRentList[index].unitPrice = price;
                $scope.fixedRentList[index].totalPrice = price * $scope.fixedRentList[index].area;

            } else if (type === 2) {
                if (!price && price !== 0) {
                    window.alert("固定租金不能为空和零!");
                    $scope.fixedRentList[index].unitPrice = '';
                    $scope.fixedRentList[index].taxPrice = '';
                    $scope.fixedRentList[index].rentPrice = '';
                    return false;
                }
                if (!(/^\d+(\.\d+)?$/.test(price))) {
                    window.alert("固定租金不能为负值!");
                    price = 0;
                }
                $scope.fixedRentList[index].unitPrice = price / $scope.fixedRentList[index].area;
                $scope.fixedRentList[index].totalPrice = price;
            }
            $scope.fixedRentUnitPriceList[index] = $scope.fixedRentList[index].unitPrice;
            taxRate = $scope.fixedRentList[index].taxRate / 100;
            $scope.fixedRentList[index].taxPrice = $scope.fixedRentList[index].totalPrice * taxRate / (1+taxRate);
            $scope.fixedRentList[index].rentPrice = $scope.fixedRentList[index].totalPrice - $scope.fixedRentList[index].taxPrice;
            $scope.fixedRentList[index].houseRentalConditions = unitTotalPriceChange($scope.fixedRentList[index].houseRentalConditions, $scope.fixedRentList[index].unitPrice, 1);
            $scope.fixedRentList[index].unitPrice = ($scope.fixedRentList[index].unitPrice).toFixed(2);
            $scope.fixedRentList[index].totalPrice = ($scope.fixedRentList[index].totalPrice).toFixed(2);
            $scope.fixedRentList[index].unitPrice = Number($scope.fixedRentList[index].unitPrice);
            $scope.fixedRentList[index].totalPrice = Number($scope.fixedRentList[index].totalPrice);
        };
        // 同步租约条件详情中的信息
        function unitTotalPriceChange(str, value, type) {
            if (!str) {
                return;
            }
            let arr = JSON.parse(str);
            if (arr.length === 0) {
                return;
            }
            let taxRate;
            arr.forEach((v, i) => {
                if (type === 1) {
                    v.unitPrice = value;
                    v.totalPrice = v.unitPrice * v.area;
                    taxRate = v.taxRate / 100;
                    v.taxPrice = v.totalPrice * taxRate / (1+taxRate);
                    v.rentPrice = v.totalPrice - v.taxPrice;
                    v.unitPrice = (v.unitPrice).toFixed(2);
                    v.unitPrice = Number(v.unitPrice);
                    v.totalPrice = (v.totalPrice).toFixed(2);
                    v.totalPrice = Number(v.totalPrice);
                }
            });
            arr = JSON.stringify(arr);
            return arr;
        }
        // 租赁条件约定的增加功能
        $scope.fixRentTermsAdd = function () {
            $scope.fixedRentEndTimes.push($scope.baseMsg.leaseEnd);
            $scope.fixedRentList.push({
                unitPrice: 0,
                area: $scope.baseMsg.contractArea,
                totalPrice: 0,
                taxPrice: 0,
                rentPrice: 0,
                taxRate: $scope.contractTaxRate
            });
            if ($scope.fixedRentEndTimes[$scope.fixedRentEndTimes.length - 1] === $scope.baseMsg.leaseEnd) {
                $scope.isNoClick = true;
            } else {
                $scope.isNoClick = false;
            }
        };
        // 租赁条件约定详细设置
        $scope.houseRentalConditionStatus = []; // 对详细设置的空间进行增减,一次变更租赁空间只进行一次增减 1表示false,2表示true
        $scope.fixRentDetail = function (type, index, obj) {
            if (!$scope.houseRentalConditionStatus[index]) {
                $scope.houseRentalConditionStatus[index] = 1;
            }
            let transmitData = {};
            if (type === 1) {
                let houseData = obj[2].houseRentalConditions ? JSON.parse(obj[2].houseRentalConditions) : [];
                transmitData = {
                    type: type,
                    index: index,
                    leaseStart: $scope.fixedRentStartTimes[index],
                    leaseEnd: $scope.fixedRentEndTimes[index],
                    unitPrice: $scope.fixedRentUnitPriceList[index],
                    taxRate: obj[1],
                    houseRentalConditions: houseData,
                    contractId: $scope.baseMsg.id,
                    unitStatus: $scope.fixedRentMsg.payUnit,
                    executingContractStatus: $scope.executingContractStatus
                };
                if ($scope.executingContractStatus) {
                    transmitData.newAddRentHouses = angular.copy($scope.newAddRentHouses);
                    transmitData.beLeftRentHouses = angular.copy($scope.beLeftRentHouses);
                    transmitData.houseRentalConditionStatus = $scope.houseRentalConditionStatus;
                }
            } else if (type === 2) { // 无此类型了
                let houseData = obj[0].houseFreePeriods ? JSON.parse(obj[0].houseFreePeriods) : [];
                transmitData = {
                    type: type,
                    leaseStart: $scope.baseMsg.leaseStart,
                    leaseEnd: $scope.baseMsg.leaseEnd,
                    freeStart: $scope.freeRentStartTimes[index],
                    freeEnd: $scope.freeRentEndTimes[index],
                    freeDays: $scope.freeTotalDays[index],
                    contractId: $scope.baseMsg.id,
                    houseFreePeriods: houseData
                }
            } else if (type === 3) { // 无此类型了
                let houseData = obj[0].houseFreePeriods ? JSON.parse(obj[0].houseFreePeriods) : [];
                transmitData = {
                    type: type,
                    leaseStart: $scope.baseMsg.leaseStart,
                    leaseEnd: $scope.baseMsg.leaseEnd,
                    freeStart: $scope.freeOutStartTimes[index],
                    freeEnd: $scope.freeOutEndTimes[index],
                    freeDays: $scope.freeOutTotalDays[index],
                    contractId: $scope.baseMsg.id,
                    houseFreePeriods: houseData
                }
            }

            var modal = $uibModal.open({
                animation: false,
                size: 'lg',
                templateUrl: '/view/rental/rentAgreementNew/modal.fixedRentDetail.html',
                controller: 'fixRentDetailCtrl',
                resolve: {
                    item: function () {
                        return $.extend({}, {
                            data: transmitData
                        })
                    }
                }
            });
            modal.result.then(function (data) {
                if (data.type === 1) {
                    $scope.fixedRentList[index].totalPrice = Number(data.obj.totalPrice);
                    $scope.fixedRentList[index].unitPrice = $scope.fixedRentList[index].totalPrice / $scope.fixedRentList[index].area;
                    $scope.fixedRentUnitPriceList[index] = $scope.fixedRentList[index].unitPrice;
                    let taxRate = $scope.fixedRentList[index].taxRate / 100;
                    $scope.fixedRentList[index].taxPrice = $scope.fixedRentList[index].totalPrice * taxRate / (1+taxRate);
                    $scope.fixedRentList[index].rentPrice = $scope.fixedRentList[index].totalPrice - $scope.fixedRentList[index].taxPrice;
                    $scope.fixedRentList[index].unitPrice = ($scope.fixedRentList[index].unitPrice).toFixed(2);
                    $scope.fixedRentList[index].totalPrice = ($scope.fixedRentList[index].totalPrice).toFixed(2);
                    $scope.fixedRentList[index].unitPrice = Number($scope.fixedRentList[index].unitPrice);
                    $scope.fixedRentList[index].totalPrice = Number($scope.fixedRentList[index].totalPrice);
                    $scope.fixedRentList[index].houseRentalConditions = data.detailSetup;
                    $scope.fixedRentMsg.payUnit = data.obj.unitStatus;
                    $scope.houseRentalConditionStatus[index] = 2;
                } else if (data.type === 2) { // 无此类型了
                    $scope.freeRentStartTimes[index] = data.obj.start;
                    $scope.freeRentEndTimes[index] = data.obj.end;
                    $scope.freeTotalDays[index] = data.obj.days;
                    $scope.freeRentList[index].houseFreePeriods = data.detailSetup;
                } else if (type === 3) { // 无此类型了
                    $scope.freeOutStartTimes[index] = data.obj.start;
                    $scope.freeOutEndTimes[index] = data.obj.end;
                    $scope.freeOutTotalDays[index] = data.obj.days;
                    $scope.freeOutList[index].houseFreePeriods = data.detailSetup;
                }
            }, function () {
                console.info('Modal dismissed at: ' + new Date());
            });
        };

        // 租赁条件约定删除功能
        $scope.fixRentTermsCancel = function (value, index) {
            if ($scope.executingContractStatus) {
                return;
            }
            var layerIndex = layer.confirm('确认删除吗？', {
                btn: ['确定', '取消'], //按钮
                shade: 0.3 //不显示遮罩
            }, function () {
                if (index === $scope.fixedRentList.length - 1) {
                    $scope.fixedRentEndTimes[index - 1] = $scope.fixedRentEndTimes[index];
                } else {
                    $scope.fixedRentStartTimes[index + 1] = $scope.fixedRentStartTimes[index];
                }
                $scope.fixedRentEndTimes.splice(index, 1);
                $scope.fixedRentStartTimes.splice(index, 1);
                $scope.fixedRentList.splice(index, 1);
                isNoClick = true;
                $scope.$apply();
                layer.close(layerIndex);
            }, function () {
                
            });
        };

        // 免租期约定
        $scope.freeRentStartTimes = [];
        $scope.freeRentEndTimes = [];
        $scope.freeTotalDays = [];
        $scope.freeRentList = [];
        $scope.freeRentHouseIds = [];
        // 免租期--选择租赁空间
        $scope.freeRentChooseHouse = function (houseId, index) {
            $scope.freeRentHouseIds[index] = houseId;
        };
        // 免租期约定增加功能
        $scope.fixRentFreeAdd = function () {
            $scope.freeRentList.push({
                executingContractStatus: false
            });
            if ($scope.contractBillStatus.status == 2) {
                $scope.optionalRentHouses = $scope.newAddRentHouses;
            } else {
                $scope.optionalRentHouses = $scope.rentHouses;
            }
        };

        // 免租期约定删除功能
        $scope.fixRentFreeCancel = function (value, index) {
            var layerIndex = layer.confirm('确认删除吗？', {
                btn: ['确定', '取消'], //按钮
                shade: 0.3 //不显示遮罩
            }, function () {
                $scope.freeRentStartTimes.splice(index, 1);
                $scope.freeRentEndTimes.splice(index, 1);
                $scope.freeTotalDays.splice(index, 1);
                $scope.freeRentList.splice(index, 1);
                $scope.$apply();
                layer.close(layerIndex);
            }, function () {
               
            });
        };
        // 免租期--起始时间的验证和计算  houseId用来获取租赁空间的合同租期
        $scope.freeRentTimeChange = function (curStart, oldStart, curEnd, oldEnd, index, type, houseId) {
            if ($scope.baseMsg.createBillModel === '2') { // 按租赁空间生成账单模式
                if (!$scope.freeRentHouseIds[index]) {
                    window.alert("请先选择租赁空间再设置免租期!");
                    type === 1 ? ($scope.freeRentStartTimes[index] = null) : ($scope.freeRentEndTimes[index] = null);
                    return;
                }
                let spaceLeaseStart;
                let spaceLeaseEnd;
                $scope.optionalRentHouses.forEach((value, index) => {
                    if (value.houseId === houseId) {
                        spaceLeaseStart = value.leaseStart;
                        spaceLeaseEnd = value.leaseEnd;
                    }
                });
                var limitStartToSLS = legalTime(spaceLeaseStart, curStart, 2);
                var limitStartToSLE = legalTime(curStart, spaceLeaseEnd, 2);
                var limitEndToSLS = legalTime(spaceLeaseStart, curEnd, 2);
                var limitEndToSLE = legalTime(curEnd, spaceLeaseEnd, 2);
            }
            let limitStartToEnd = true;
            if (curStart && curEnd) {
                limitStartToEnd = legalTime(curStart, curEnd, 1);
            }
            let limitStartToLS = legalTime($scope.baseMsg.leaseStart, curStart, 2);
            let limitStartToLE = legalTime(curStart, $scope.baseMsg.leaseEnd, 2);
            let limitEndToLS = legalTime($scope.baseMsg.leaseStart, curEnd, 2);
            let limitEndToLE = legalTime(curEnd, $scope.baseMsg.leaseEnd, 2);
            if (type === 1) {
                if ($scope.baseMsg.createBillModel === '2') {
                    if (freeTimeDuplicate(curStart, curEnd, $scope.freeRentStartTimes, $scope.freeRentEndTimes, index, $scope.freeRentHouseIds)) {
                        window.alert("同一租赁空间的多个免租期的日期选择无法有重合日期!");
                        $scope.freeRentStartTimes[index] = null;
                        return;
                    }
                    if (!limitStartToEnd || !limitStartToSLS || !limitStartToSLE) {
                        $scope.freeRentStartTimes[index] = oldStart;
                    }
                } else {
                    if (freeTimeDuplicate(curStart, curEnd, $scope.freeRentStartTimes, $scope.freeRentEndTimes, index)) {
                        window.alert("多个免租期的日期选择无法有重合日期!");
                        $scope.freeRentStartTimes[index] = null;
                        return;
                    }
                    if (!limitStartToEnd || !limitStartToLS || !limitStartToLE) {
                        $scope.freeRentStartTimes[index] = oldStart;
                    }
                }
            } else if (type === 2) {
                if ($scope.baseMsg.createBillModel === '2') {
                    if (freeTimeDuplicate(curStart, curEnd, $scope.freeRentStartTimes, $scope.freeRentEndTimes, index, $scope.freeRentHouseIds)) {
                        window.alert("同一租赁空间的多个免租期的日期选择无法有重合日期!");
                        $scope.freeRentEndTimes[index] = null;
                        return;
                    }
                    if (!limitStartToEnd || !limitEndToSLS || !limitEndToSLE) {
                        $scope.freeRentEndTimes[index] = oldEnd;
                    }
                } else {
                    if (freeTimeDuplicate(curStart, curEnd, $scope.freeRentStartTimes, $scope.freeRentEndTimes, index)) {
                        window.alert("多个免租期的日期选择无法有重合日期!");
                        $scope.freeRentEndTimes[index] = null;
                        return;
                    }
                    if (!limitStartToEnd || !limitEndToLE || !limitEndToLS) {
                        $scope.freeRentEndTimes[index] = oldEnd;
                    }
                }
            }
            // 免租天数
            $scope.freeTotalDays[index] = getTotalMonths($scope.freeRentStartTimes[index], $scope.freeRentEndTimes[index], 2);
            $scope.freeRentList[index].houseFreePeriods = freeTimeChange($scope.freeRentList[index].houseFreePeriods, $scope.freeRentStartTimes[index], $scope.freeRentEndTimes[index], $scope.freeTotalDays[index]);
        };
        // 同步免租期详情的信息
        function freeTimeChange(str, start, end, days) {
            if (!str) {
                return;
            }
            let arr = JSON.parse(str);
            if (arr.length === 0) {
                return;
            }
            arr.forEach((v, i) => {
                v.freeDateStart = start;
                v.freeDateEnd = end;
                v.days = days;
            })
        }
        /**
         * 固定租金约定部分结束
         */
        /**--------------------------------手动分割线------------------------------------ */
        /**
         * 抽成租金约定部分开始
         */

        // 状态值
        $scope.rentOutNoClick = true;
        $scope.rentOutTimeLegitimacy = true;
        $scope.rentOutTimeLimit = true;
        // 起止时间和数据列表
        $scope.rentOutStartTimes = [];
        $scope.rentOutEndTimes = [];
        $scope.rentOutList = [];
        // 租赁条件约定增加
        $scope.rentOutTermsAdd = function () {
            $scope.rentOutEndTimes.push($scope.baseMsg.leaseEnd);
            $scope.rentOutList.push({
                commissionModel: '2',
                commissionPercent: 0,
                billingAmount: 0
            });
            if ($scope.rentOutEndTimes[$scope.rentOutEndTimes.length - 1] === $scope.baseMsg.leaseEnd) {
                $scope.rentOutNoClick = true;
            } else {
                $scope.rentOutNoClick = false;
            }
        };
        // 租赁条件约定删除
        $scope.rentOutCancel = function (value, index) {
            var layerIndex = layer.confirm('确认删除吗？', {
                btn: ['确定', '取消'], //按钮
                shade: 0.3 //不显示遮罩
            }, function () {
                if (index === $scope.rentOutList.length - 1) {
                    $scope.rentOutEndTimes[index - 1] = $scope.rentOutEndTimes[index];
                } else {
                    $scope.rentOutStartTimes[index + 1] = $scope.rentOutStartTimes[index];
                }
                $scope.rentOutEndTimes.splice(index, 1);
                $scope.rentOutStartTimes.splice(index, 1);
                $scope.rentOutList.splice(index, 1);
                rentOutNoClick = true;
                $scope.$apply();
                layer.close(layerIndex);
            }, function () {
               
            });
        };
        $scope.rentOutEndChange = function (curStart, oldStart, curEnd, oldEnd, index, type) {
         
            $scope.rentOutTimeLimit = legalTime(curEnd, $scope.baseMsg.leaseEnd, 2);
            $scope.rentOutTimeLegitimacy = legalTime(curStart, curEnd, 1);
            if (type === 1) {
                if (!$scope.rentOutTimeLegitimacy) {
                    $scope.rentOutStartTimes[index] = oldStart;
                }
                let yesterDay = getYesOrTom($scope.rentOutStartTimes[index], 1);
                $scope.rentOutEndTimes[index - 1] = yesterDay;
            } else if (type === 2) {
                if (!$scope.rentOutTimeLimit) {
                    $scope.rentOutEndTimes[index] = oldEnd;
                }
                if (!$scope.rentOutTimeLegitimacy) {
                    $scope.rentOutEndTimes[index] = oldEnd;
                }
                if ($scope.rentOutEndTimes[$scope.rentOutEndTimes.length - 1] === $scope.baseMsg.leaseEnd) {
                    $scope.rentOutNoClick = true;
                } else {
                    $scope.rentOutNoClick = false;
                }
                let tomorrow = getYesOrTom($scope.rentOutEndTimes[index], 2);
                $scope.rentOutStartTimes[index + 1] = tomorrow;
            }
        };
        $scope.zeroStart = function (item) {
         
        };
        $scope.rentOutCommissChange = function (value, index, type) {
            if (type === 1) {
                if (!value && value !== 0) {
                    window.alert("抽成比例不能为空!");
                    $scope.rentOutList[index].commissionPercent = '';
                    return false;
                }
                if (value < 0) {
                    window.alert("抽成比例不能为负!");
                }
                if (value > 100) {
                    window.alert("抽成比例不能大于100!");
                    $scope.rentOutList[index].commissionPercent = '';
                    return false;
                }
                $scope.rentOutList[index].commissionPercent = value.toFixed(2);
                if ($scope.rentOutList[index].commissionPercent.indexOf('-') !== -1) {
                    $scope.rentOutList[index].commissionPercent = $scope.rentOutList[index].commissionPercent.substr(1);
                }
                $scope.rentOutList[index].commissionPercent = Number($scope.rentOutList[index].commissionPercent);
            } else if (type === 2) {
                if (!value && value !== 0) {
                    // window.alert("保底金额不能为空和零!");
                    $scope.rentOutList[index].billingAmount = '';
                    return false;
                }
                if (value < 0) {
                    window.alert("保底金额不能为负!");
                }
                $scope.rentOutList[index].billingAmount = value.toFixed(2);
                if ($scope.rentOutList[index].billingAmount.indexOf('-') !== -1) {
                    $scope.rentOutList[index].billingAmount = $scope.rentOutList[index].billingAmount.substr(1);
                }
                $scope.rentOutList[index].billingAmount = Number($scope.rentOutList[index].billingAmount);
            }
        };

        // 免租期约定
        $scope.freeOutStartTimes = [];
        $scope.freeOutEndTimes = [];
        $scope.freeOutTotalDays = [];
        $scope.freeOutList = [];

        // 免租期约定增加功能
        $scope.rentOutFreeAdd = function () {
            $scope.freeOutList.push({})
        };

        // 免租期约定删除功能
        $scope.rentOutFreeCancel = function (value, index) {
            var layerIndex = layer.confirm('确认删除吗？', {
                btn: ['确定', '取消'], //按钮
                shade: 0.3 //不显示遮罩
            }, function () {
                $scope.freeOutStartTimes.splice(index, 1);
                $scope.freeOutEndTimes.splice(index, 1);
                $scope.freeOutTotalDays.splice(index, 1);
                $scope.freeOutList.splice(index, 1);
                $scope.$apply();
                layer.close(layerIndex);
            }, function () {
               
            });
        };
        // 免租期--起始时间的验证和计算
        $scope.freeOutTimeChange = function (curStart, oldStart, curEnd, oldEnd, index, type) {
            
            let limitStartToEnd = true;
            if (curStart && curEnd) {
                limitStartToEnd = legalTime(curStart, curEnd, 1);
            }
            let limitStartToLS = legalTime($scope.baseMsg.leaseStart, curStart, 2);
            let limitStartToLE = legalTime(curStart, $scope.baseMsg.leaseEnd, 2);
            let limitEndToLS = legalTime($scope.baseMsg.leaseStart, curEnd, 2);
            let limitEndToLE = legalTime(curEnd, $scope.baseMsg.leaseEnd, 2);
            if (type === 1) {
                if (freeTimeDuplicate(curStart, curEnd, $scope.freeOutStartTimes, $scope.freeOutEndTimes, index)) {
                    window.alert("多个免租期的日期选择无法有重合日期!");
                    $scope.freeOutStartTimes[index] = null;
                    return;
                }
                if (!limitStartToEnd || !limitStartToLS || !limitStartToLE) {
                    $scope.freeOutStartTimes[index] = oldStart;
                }
            } else if (type === 2) {
                if (freeTimeDuplicate(curStart, curEnd, $scope.freeOutStartTimes, $scope.freeOutEndTimes, index)) {
                    window.alert("多个免租期的日期选择无法有重合日期!");
                    $scope.freeOutEndTimes[index] = null;
                    return;
                }
                if (!limitStartToEnd || !limitEndToLE || !limitEndToLS) {
                    $scope.freeOutEndTimes[index] = oldEnd;
                }
            }
            // 免租天数
            $scope.freeOutTotalDays[index] = getTotalMonths($scope.freeOutStartTimes[index], $scope.freeOutEndTimes[index], 2);
            $scope.freeOutList[index].houseFreePeriods = freeTimeChange($scope.freeOutList[index].houseFreePeriods, $scope.freeOutStartTimes[index], $scope.freeOutEndTimes[index], $scope.freeOutTotalDays[index]);
        };

        // 计费周期和交费周期联动
        $scope.cycleChange = function (value, type) {
            if (type === 1) {
                $scope.rentOutMsg.payCycle = value ? value + '' : '';
            } else if (type === 2) {
                $scope.rentOutMsg.turnoverCycle = value ? value + '' : '';
            }
        };

        /**
         * 抽成租金约定部分结束
         */

        /**
         * 首期约定部分开始
         */


        /**
         * 首期约定部分结束
         */

        /**
         * 其他费项开始
         */
        $scope.otherChargeStartTimes = [];
        $scope.otherChargeEndTimes = [];
        $scope.otherChargeList = [];

        // 新增功能
        $scope.otherChargeAdd = function () {
            $scope.otherChargeList.push({
                contractId: $scope.baseMsg.id,
                expenditureId: '',
                billingRates: '',
                unitPrice: 0,
                totalPrice: 0,
                rentPrice: 0,
                taxPrice: 0
            });
        };
        // 时间选择器控制
        $scope.otherChargeTimeChange = function (curStart, oldStart, curEnd, oldEnd, index, type) {
            let limitStartToEnd = true;
            if (curStart && curEnd) {
                limitStartToEnd = legalTime(curStart, curEnd, 1);
            }
            if (type === 1) {
                if (!limitStartToEnd || !limitStartToLS || !limitStartToLE) {
                    $scope.otherChargeStartTimes[index] = oldStart;
                }
            } else if (type === 2) {
                if (!limitStartToEnd || !limitEndToLE || !limitEndToLS) {
                    $scope.otherChargeEndTimes[index] = oldEnd;
                }
            }
        };

        // 删除功能
        $scope.otherChargeCancel = function (value, index) {
            var layerIndex = layer.confirm('确认删除吗？', {
                btn: ['确定', '取消'], //按钮
                shade: 0.3 //不显示遮罩
            }, function () {
                $scope.otherChargeList.splice(index, 1);
                $scope.$apply();
                layer.close(layerIndex);
            }, function () {
               
            });
        };
        // 计算单价和总价
        $scope.otherChargeChange = function (params, index, type) {
            let price = params;
            let taxRate;
            if (type === 1) {
                if (!price && price !== 0) {
                    window.alert("费项单价不能为空!");
                    return false;
                }
                if (!(/^\d+(\.\d+)?$/.test(price))) {
                    window.alert("费项单价不能为负值!");
                    price = 0;
                }
                $scope.otherChargeList[index].unitPrice = price.toFixed(2);
                $scope.otherChargeList[index].unitPrice = Number($scope.otherChargeList[index].unitPrice);
                $scope.otherChargeList[index].totalPrice = (price * $scope.baseMsg.contractArea).toFixed(2);
                $scope.otherChargeList[index].totalPrice = Number($scope.otherChargeList[index].totalPrice);
                taxRate = $scope.otherChargeList[index].taxRate / 100;
                $scope.otherChargeList[index].taxPrice = $scope.otherChargeList[index].totalPrice * taxRate / (1+taxRate);
                $scope.otherChargeList[index].rentPrice = $scope.otherChargeList[index].totalPrice - $scope.otherChargeList[index].taxPrice;
            } else if (type === 2) {
                if ($scope.baseMsg.rentalModal === '1' || ($scope.baseMsg.rentalModal !== '1' && !$scope.bottomAmountStatus)) {
                    if (!price && price !== 0) {
                        window.alert("费项总价不能为空!");
                        return false;
                    }
                    if (!(/^\d+(\.\d+)?$/.test(price))) {
                        window.alert("费项总价不能为负值!");
                        price = 0;
                    }
                }
                if (index === 0) {
                    $scope.otherChargeList[index].totalPrice = price.toFixed(2);
                    $scope.otherChargeList[index].totalPrice = Number($scope.otherChargeList[index].totalPrice);
                    taxRate = $scope.otherChargeList[index].taxRate / 100;
                    $scope.otherChargeList[index].taxPrice = params * taxRate / (1+taxRate);
                    $scope.otherChargeList[index].rentPrice = params - $scope.otherChargeList[index].taxPrice;
                    return false;
                }
                $scope.otherChargeList[index].unitPrice = (price / $scope.baseMsg.contractArea).toFixed(2);
                $scope.otherChargeList[index].unitPrice = Number($scope.otherChargeList[index].unitPrice);
                $scope.otherChargeList[index].totalPrice = price.toFixed(2);
                $scope.otherChargeList[index].totalPrice = Number($scope.otherChargeList[index].totalPrice);
                taxRate = $scope.otherChargeList[index].taxRate / 100;
                $scope.otherChargeList[index].taxPrice = params * taxRate / (1+taxRate);
                $scope.otherChargeList[index].rentPrice = params - $scope.otherChargeList[index].taxPrice;
            }
        };

        // 费项名称选择
        $scope.expenditureChange = function (id, index) {
            let obj = {};
            $scope.expenditureList.forEach((v, i) => {
                if (v.id === id) {
                    obj = v;
                }
            });
            $scope.otherChargeList[index] = $.extend($scope.otherChargeList[index], obj);
          
        };

        // 获取空间履约保证金周期
        $scope.getDateCycle = function (house) {
            return new Promise(function (resolve, reject) {
                let houseArr = house;
                houseArr.forEach((value, index) => {
                    value.contractId = $scope.baseMsg.id;
                });
                let params = {
                    contractId: $scope.baseMsg.id,
                    rentalContractHouseInfos: JSON.stringify(houseArr)
                };
                $http.get("/ovu-park/backstage/rental/contractBaseInfo/getDateCycle", {
                    params: params
                }).success(function (resp) {
                   
                    if (resp.code === 0) {
                        let houseList = resp.data || [];
                        houseList.length > 0 && houseList.forEach((value, index) => {
                            value.disabledStatus = true;
                        });
                        resolve(houseList);
                    } else {
                        reject(houseArr);
                    }
                })
            })
        };
        // 获取空间首期约定
        $scope.getFirstPeriodDateByHouse = function (house) {
            return new Promise(function (resolve, reject) {
                let houseArr = house;
                houseArr.forEach((value, index) => {
                    value.contractId = $scope.baseMsg.id;
                    value.contractHouseId = value.houseId;
                    value.firstStartDate = value.leaseStart;
                    value.firstEndDate = value.leaseEnd;
                });
                let params = {
                    houseContractConditions: JSON.stringify(houseArr)
                };
                $http.get("/ovu-park/backstage/rental/contractBaseInfo/getFirstPeriodDateByHouse", {
                    params: params
                }).success(function (resp) {
                 
                    if (resp.code === 0) {
                        let houseList = resp.data || [];
                        houseList.length > 0 && houseList.forEach((value, index) => {
                            value.disabledStatus = true;
                        });
                        resolve(houseList);
                    } else {
                        reject(houseArr);
                    }
                })
            })
        };
        /**
         * 其他费项结束
         */

        // 点击下一步 
        $scope.nextStep = function (form) {
            form.$setSubmitted(true);
            // 保存合同类型
            if ($scope.currentStep === 1) {
                if (!$scope.contactType) {
                    window.alert("请选择合同类型");
                    return;
                }
                var params = {
                    contractTypeId: $scope.contactType,
                    parkId: app.park.parkId,
                    creatorId: app.user.personId,
                    creatorName: app.user.nickname != null ? app.user.nickname : app.user.loginName,
                    code: $scope.baseMsg.code,
                    name: $scope.baseMsg.name,
                    firstPartyName: $scope.baseMsg.firstPartyName
                };
                params.id = $scope.contractId ? $scope.contractId.id : "";
                if ($scope.contactTypeCache && ($scope.contactTypeCache === $scope.contactType)) {
                    let nextStep = {
                        contractId: $scope.baseMsg.id,
                        next: 1
                    };
                    $http.post("/ovu-park/backstage/rental/contractBaseInfo/nextContractInfo", nextStep, fac.postConfig).success(function (resp) {
                       
                        if (resp.code === 0) {
                            let starts = [];
                            let ends = [];
                            // 基本资料
                            $scope.baseMsg.id = resp.data.id;
                            $scope.baseMsg.parkId = resp.data.parkId;
                            $scope.baseMsg.name = resp.data.name;
                            $scope.baseMsg.code = resp.data.code;
                            $scope.baseMsg.firstPartyName = resp.data.firstPartyName;
                            $scope.baseMsg.firstPartyId = resp.data.firstPartyId;
                            $scope.baseMsg.firstPartyType = resp.data.firstPartyType;
                            $scope.baseMsg.secondPartyName = resp.data.secondPartyName;
                            $scope.baseMsg.secondPartyId = resp.data.secondPartyId;
                            $scope.baseMsg.secondPartyType = resp.data.secondPartyType;
                            $scope.rentHouses = resp.data.rentalContractHouseInfos;
                            $scope.rentHouses.forEach((value, index) => {
                                value.leaseStart = $filter('date')(value.leaseStart, 'yyyy-MM-dd');
                                value.leaseEnd = $filter('date')(value.leaseEnd, 'yyyy-MM-dd');
                                value.enterDate = $filter('date')(value.enterDate, 'yyyy-MM-dd');
                                value.state = {
                                    checked: true
                                };
                                starts.push(value.leaseStart);
                                ends.push(value.leaseEnd)
                            });
                            $scope.beginningRentHouses = angular.copy($scope.rentHouses) || [];
                            $scope.newAddRentHouses = [];
                            $scope.beLeftRentHouses = angular.copy($scope.rentHouses) || [];
                            $scope.baseMsg.contractArea = resp.data.contractArea;
                            // 生成账单约定
                            $scope.baseMsg.createBillModel = String(resp.data.createBillModel);
                            $scope.billStatusChange($scope.baseMsg.createBillModel);
                            $scope.baseMsg.rentalModal = (resp.data.rentalModal ? resp.data.rentalModal.toString() : '1');
                            $scope.baseMsg.leaseStart = $filter('date')(resp.data.leaseStart, 'yyyy-MM-dd');
                            $scope.baseMsg.leaseEnd = $filter('date')(resp.data.leaseEnd, 'yyyy-MM-dd');
                            $scope.baseMsg.leaseMonth = resp.data.leaseMonth;
                            $scope.baseMsg.enterDate = $filter('date')(resp.data.enterDate, 'yyyy-MM-dd');
                            $scope.baseMsg.signDate = $filter('date')(resp.data.signDate, 'yyyy-MM-dd');
                            $scope.baseMsg.consultant = resp.data.consultant;
                            $scope.baseMsg.consultantId = resp.data.consultantId;
                            $scope.contactFileList = resp.data.contractFileList || [];
                            $scope.baseMsg.contractFiles = JSON.stringify(resp.data.contractFileList);
                            $scope.baseMsg.contractHouseIds = resp.data.contractHouseIds;
                            $scope.baseMsg.contractHouseInfos = JSON.stringify(resp.data.rentalContractHouseInfos);
                            $scope.baseMsg.initMonthRental = resp.data.initMonthRental;
                            $scope.baseMsgCache = {};
                            angular.copy($scope.baseMsg, $scope.baseMsgCache);
                            starts = starts.sort();
                            ends = ends.sort();
                            $scope.baseMsgDetailStatus = isEqual(starts, ends);
                        }
                        ++$scope.currentStep;
                    })
                } else {
                    $scope.contactTypeCache = $scope.contactType;
                    $http.post("/ovu-park/backstage/rental/contractBaseInfo/saveContractType", params, fac.postConfig).success(function (resp) {
                        if (resp.code == 0) {
                            window.msg("合同类型保存成功");
                            ++$scope.currentStep;
                            if (resp.data) {
                                $scope.baseMsg.id = resp.data.id;
                                $scope.baseMsg.creatorId = $scope.user.personId;
                                $scope.baseMsg.code = resp.data.code;
                                $scope.baseMsg.name = resp.data.name;
                                $scope.baseMsg.rentalModal = resp.data.rentalModal || '1';
                                $scope.baseMsg.contactStatus = resp.data.contactStatus;
                                $scope.baseMsg.consultantId = resp.data.consultantId;
                                $scope.baseMsg.contractTypeId = resp.data.contractTypeId;
                                $scope.baseMsg.status = resp.data.status;
                                $scope.baseMsg.firstPartyId = resp.data.firstPartyId;
                                $scope.baseMsg.firstPartyName = resp.data.firstPartyName;
                                $scope.baseMsg.firstPartyType = resp.data.firstPartyType;
                                var d = new Date();
                                $scope.baseMsg.signDate = d.format("yyyy-MM-dd");
                                $scope.baseMsg.rentalModal = '1';
                                $scope.baseMsg.billStatus = '1';
                            }
                        } else {
                            window.alert(resp.msg);
                        }
                    });
                }
            }
            // 保存基本资料
            else if ($scope.currentStep === 2) {
                if (!form.$valid || ($scope.rentHouses.length == 0) || !$scope.baseMsg.createBillModel) {
                    if ($scope.rentHouses.length === 0) {
                        window.alert('请选择租赁空间！');
                        return false;
                    }
                    window.alert('请完成必填项！');
                    return false;
                }
                if ($scope.leaseTimeChange && $scope.leaseDetailChange) {
                    $scope.rentHouses.forEach((value, index) => {
                        value.leaseStart = $scope.baseMsg.leaseStart;
                        value.leaseEnd = $scope.baseMsg.leaseEnd;
                        value.enterDate = $scope.baseMsg.enterDate;
                    })
                }
                $scope.newAddRentHouses = assignObject($scope.newAddRentHouses, $scope.rentHouses);
                $scope.optionalRentHouses = angular.copy($scope.rentHouses);
                $scope.baseMsg.parkId = app.park.parkId;
                $scope.baseMsg.contractFiles = JSON.stringify($scope.contactFileList);
                $scope.baseMsg.contractHouseInfos = JSON.stringify($scope.rentHouses);
                if (angular.equals($scope.baseMsg, $scope.baseMsgCache) || $scope.executingContractStatus) {
                    let next = $scope.baseMsg.rentalModal === '2' ? 3 : 2;
                    let nextStep = {
                        contractId: $scope.baseMsg.id,
                        next: next
                    };
                    $http.post("/ovu-park/backstage/rental/contractBaseInfo/nextContractInfo", nextStep, fac.postConfig).success(function (resp) {
                       
                        if (resp.code === 0) {
                            $scope.fixedRentMsg = {};
                            $scope.rentOutMsg = {};
                            $scope.initialAgreeMsg = {};
                            $scope.otherChargeMsg = {};
                            $scope.fixedRentList = [];
                            $scope.fixedRentStartTimes = [];
                            $scope.fixedRentEndTimes = [];
                            $scope.freeRentList = [];
                            $scope.freeRentStartTimes = [];
                            $scope.freeRentEndTimes = [];
                            $scope.freeTotalDays = [];
                            $scope.rentOutList = [];
                            $scope.rentOutStartTimes = [];
                            $scope.rentOutEndTimes = [];
                            $scope.freeOutList = [];
                            $scope.freeOutStartTimes = [];
                            $scope.freeOutEndTimes = [];
                            $scope.freeOutTotalDays = [];
                            $scope.freeRentHouseIds = [];
                            if (next === 2) { // 固定租金
                                $scope.rentalStep = 1;
                                $scope.houseRentalConditionStatus = [];
                                fixedRentWriteBack(resp.data);
                            } else if (next === 3) { // 抽成比例
                                $scope.rentalStep = 2;
                                rentOutWriteBack(resp.data);
                            }
                        }
                        ++$scope.currentStep;
                    })
                } else {
                    $http.post("/ovu-park/backstage/rental/contractBaseInfo/saveBaseInfo", $scope.baseMsg, fac.postConfig).success(function (resp) {
                        if (resp.code == 0) {
                            $scope.leaseTimeChange = false;
                            $scope.leaseDetailChange = true;
                            // 缓存基本资料
                            $scope.baseMsgCache = {};
                            angular.copy($scope.baseMsg, $scope.baseMsgCache);
                            window.msg("基本资料保存成功");
                            $scope.expenditureListAll();

                            // 改版保留租金约定填写的数据
                            let next = $scope.baseMsg.rentalModal === '2' ? 3 : 2;
                            let nextStep = {
                                contractId: $scope.baseMsg.id,
                                next: next
                            };
                            $http.post("/ovu-park/backstage/rental/contractBaseInfo/nextContractInfo", nextStep, fac.postConfig).success(function (resp) {
                               
                                if (resp.code === 0) {
                                    $scope.fixedRentMsg = {};
                                    $scope.rentOutMsg = {};
                                    $scope.initialAgreeMsg = {};
                                    $scope.otherChargeMsg = {};
                                    $scope.fixedRentList = [];
                                    $scope.fixedRentStartTimes = [];
                                    $scope.fixedRentEndTimes = [];
                                    $scope.freeRentList = [];
                                    $scope.freeRentStartTimes = [];
                                    $scope.freeRentEndTimes = [];
                                    $scope.freeTotalDays = [];
                                    $scope.rentOutList = [];
                                    $scope.rentOutStartTimes = [];
                                    $scope.rentOutEndTimes = [];
                                    $scope.freeOutList = [];
                                    $scope.freeOutStartTimes = [];
                                    $scope.freeOutEndTimes = [];
                                    $scope.freeOutTotalDays = [];
                                    if (resp.data.rentalContractConditions) {
                                        if (next === 2) { // 固定租金
                                            $scope.rentalStep = 1;
                                            $scope.houseRentalConditionStatus = [];
                                            fixedRentWriteBack(resp.data);
                                        } else if (next === 3) { // 抽成比例
                                            $scope.rentalStep = 2;
                                            rentOutWriteBack(resp.data);
                                        }
                                    } else {
                                        // 控制固定租金约定和抽成租金约定
                                        if ($scope.baseMsg.rentalModal === '2') { // 抽成比例
                                            $scope.rentalStep = 2;
                                            $scope.rentOutStartTimes[0] = $scope.baseMsg.leaseStart;
                                            $scope.rentOutEndTimes[0] = $scope.baseMsg.leaseEnd;
                                            $scope.rentOutList[0] = {
                                                commissionModel: '2',
                                            };
                                        } else { // 固定租金
                                            $scope.rentalStep = 1;
                                            $scope.fixedRentMsg.payUnit = '2';
                                            $scope.fixedRentMsg.createBillModel = $scope.baseMsg.createBillModel;
                                            $scope.fixedRentStartTimes[0] = $scope.baseMsg.leaseStart;
                                            $scope.fixedRentEndTimes[0] = $scope.baseMsg.leaseEnd;
                                            $scope.fixedRentList[0] = {
                                                unitPrice: 0,
                                                area: $scope.baseMsg.contractArea,
                                                totalPrice: 0,
                                                taxPrice: 0,
                                                rentPrice: 0,
                                                taxRate: $scope.contractTaxRate
                                            };
                                        }
                                    }
                                }
                            });
                            ++$scope.currentStep;
                        } else {
                            window.alert(resp.msg);
                        }
                    });
                   
                }
            }
            // 租金约定
            else if ($scope.currentStep === 3) {
                let fixedUnitEmpty = false;
                let fixedUnitprice = false;
                let fixedRentListState = isEmpty($scope.fixedRentList);
                let fixedRentEndTimeState = isEmpty($scope.fixedRentEndTimes);
                let freeRentListState = isEmpty($scope.freeRentList);
                let freeRentStartTimeState = isEmpty($scope.freeRentStartTimes);
                let freeRentEndTimeState = isEmpty($scope.freeRentEndTimes);

                let rentOutEmpty = false;
                let rentOutZero = false;
                let rentOutProportion = false;
                let rentOutGuaranteeamount = false;
                let rentOutListState = isEmpty($scope.rentOutList);
                let rentOutEndTimeState = isEmpty($scope.rentOutEndTimes);
                let freeOutListState = isEmpty($scope.freeOutList);
                let freeOutStartTimeState = isEmpty($scope.freeOutStartTimes);
                let freeOutEndTimeState = isEmpty($scope.freeOutEndTimes);
                if (!form.$valid) {
                    window.alert("请完成必填项!");
                    return false;
                }
                if (!fixedRentEndTimeState) {
                    if ($scope.fixedRentEndTimes[$scope.fixedRentEndTimes.length - 1] != $scope.baseMsg.leaseEnd) {
                        window.alert('租赁条件约定列表最后一行的截止时间必须为合同租期的截止时间!');
                        return false;
                    }
                }
                if (!fixedRentListState) {
                    $scope.fixedRentList.forEach((value, index) => {
                        if (!value.unitPrice && value.unitPrice != 0) {
                            fixedUnitEmpty = true;
                        }
                        if (!(/^\d+(\.\d+)?$/.test(value.unitPrice)) && value.unitPrice) {
                            fixedUnitprice = true;
                        }
                        value.leaseStart = $scope.fixedRentStartTimes[index];
                        value.leaseEnd = $scope.fixedRentEndTimes[index];
                        value.contractId = $scope.baseMsg.id;
                        value.rentModel = 1;
                        value.unitPrice = $scope.fixedRentUnitPriceList[index];
                    });
                    if (fixedUnitEmpty) {
                        window.alert('请设置合同的固定租金单价!');
                        return false;
                    }
                    if (fixedUnitprice) {
                        window.alert("合同固定租金单价不能为负值!");
                        return false;
                    }
                    $scope.fixedRentMsg.contractConditionList = JSON.stringify($scope.fixedRentList);
                }
                if (!freeRentListState && !freeRentStartTimeState && !freeRentEndTimeState) {
                    $scope.freeRentList.forEach((value, index) => {
                        value.freeDateStart = $scope.freeRentStartTimes[index];
                        value.freeDateEnd = $scope.freeRentEndTimes[index];
                        value.days = $scope.freeTotalDays[index];
                        value.contractId = $scope.baseMsg.id;
                        value.rentModel = 1;
                    })
                }
                $scope.fixedRentMsg.freePeriodList = JSON.stringify($scope.freeRentList);
                $scope.fixedRentMsg.contractId = $scope.baseMsg.id;
                $scope.fixedRentMsg.parkId = $scope.baseMsg.parkId;
                if (!rentOutEndTimeState) {
                    if ($scope.rentOutEndTimes[$scope.rentOutEndTimes.length - 1] != $scope.baseMsg.leaseEnd) {
                        window.alert('租赁条件约定列表最后一行的截止时间必须为合同租期的截止时间!');
                        return false;
                    }
                }
                if (!rentOutListState) {
                    $scope.rentOutList.forEach((value, index) => {
                        if (!value.commissionPercent && value.commissionPercent !== 0) {
                            rentOutEmpty = true;
                        }
                        if (value.commissionPercent === 0) {
                            rentOutZero = true;
                        }
                        if (!(/^\d+(\.\d+)?$/.test(value.commissionPercent)) && value.commissionPercent) {
                            rentOutProportion = true;
                        }
                        if (!(/^\d+(\.\d+)?$/.test(value.billingAmount)) && value.billingAmount) {
                            rentOutGuaranteeamount = true;
                        }
                        value.leaseStart = $scope.rentOutStartTimes[index];
                        value.leaseEnd = $scope.rentOutEndTimes[index];
                        value.contractId = $scope.baseMsg.id;
                        value.rentModel = 2;
                    });
                    if (rentOutEmpty) {
                        window.alert("抽成比例不能为空!");
                        return false;
                    }
                    if (rentOutZero) {
                        window.alert("抽成比例不能为零!");
                        return false;
                    }
                    if (rentOutProportion) {
                        window.alert("抽成比例不能为负值!");
                        return false;
                    }
                    if (rentOutGuaranteeamount) {
                        window.alert("保底金额不能为负值!");
                        return false;
                    }
                    $scope.rentOutMsg.contractConditionList = JSON.stringify($scope.rentOutList);
                }
                if (!freeOutListState && !freeOutStartTimeState && !freeOutEndTimeState) {
                    $scope.freeOutList.forEach((value, index) => {
                        value.freeDateStart = $scope.freeOutStartTimes[index];
                        value.freeDateEnd = $scope.freeOutEndTimes[index];
                        value.days = $scope.freeOutTotalDays[index];
                        value.contractId = $scope.baseMsg.id;
                        value.rentModel = 2;
                    })
                }
                $scope.rentOutMsg.freePeriodList = JSON.stringify($scope.freeOutList);
                $scope.rentOutMsg.contractId = $scope.baseMsg.id;
                $scope.rentOutMsg.parkId = $scope.baseMsg.parkId;
                if ($scope.baseMsg.rentalModal === '1') { //固定租金
                    if (angular.equals($scope.fixedRentMsg, $scope.fixedRentMsgCache) || $scope.executingContractStatus) {
                        let nextStep = {
                            contractId: $scope.baseMsg.id,
                            next: 4
                        };
                        $http.post("/ovu-park/backstage/rental/contractBaseInfo/nextContractInfo", nextStep, fac.postConfig).success(function (resp) {
                           
                            if (resp.code === 0) {
                                $scope.getFirstPeriodDate($scope.baseMsg.id);
                                if ($scope.executingContractStatus) {
                                    $scope.getFirstPeriodDateByHouse($scope.newAddRentHouses).then(function (value) {
                                        initialAgreeWriteBack(resp.data, value);
                                        ++$scope.currentStep;
                                        $scope.$apply();
                                    }, function (error) {
                                        initialAgreeWriteBack(resp.data, error);
                                        ++$scope.currentStep;
                                        $scope.$apply();
                                    });
                                    return;
                                }
                                initialAgreeWriteBack(resp.data);
                            }
                            ++$scope.currentStep;
                        })
                    } else {
                        $http.post("/ovu-park/backstage/rental/contractBaseInfo/saveFixedRentCondition", $scope.fixedRentMsg, fac.postConfig).success(function (resp) {
                            if (resp.code === 0) {
                                $scope.fixedRentMsgCache = {};
                                angular.copy($scope.fixedRentMsg, $scope.fixedRentMsgCache);
                                window.msg(resp.msg);
                                ++$scope.currentStep;
                                if ($scope.baseMsg.createBillModel == '1') {
                                    $scope.getFirstPeriodDate($scope.baseMsg.id);
                                    $scope.initialAgreeMsg.firstPayPeriod = '';
                                    $scope.initialAgreeMsg.firstAppiontDate = '';
                                    $scope.initialAgreeMsg.afterApproveDays = '';
                                } else {
                                    $scope.getHouseFirstPeriodDate($scope.baseMsg.id);
                                }

                                $scope.initialAgreeMsg.createBillModel = $scope.baseMsg.createBillModel;
                            } else {
                                window.alert(resp.msg);
                            }
                        })
                    }
                } else if ($scope.baseMsg.rentalModal === '2') { //抽成租金
                    if (angular.equals($scope.rentOutMsg, $scope.rentOutMsgCache)) {
                        let nextStep = {
                            contractId: $scope.baseMsg.id,
                            next: 4
                        };
                        $http.post("/ovu-park/backstage/rental/contractBaseInfo/nextContractInfo", nextStep, fac.postConfig).success(function (resp) {
                            
                            if (resp.code === 0) {
                                $scope.getFirstPeriodDate($scope.baseMsg.id);
                                initialAgreeWriteBack(resp.data);
                            }
                            ++$scope.currentStep;
                        })
                    } else {
                        $http.post("/ovu-park/backstage/rental/contractBaseInfo/saveCommissionRentCondition", $scope.rentOutMsg, fac.postConfig).success(function (resp) {
                            if (resp.code === 0) {
                                $scope.rentOutMsgCache = {};
                                angular.copy($scope.rentOutMsg, $scope.rentOutMsgCache);
                                window.msg(resp.msg);
                                ++$scope.currentStep;
                                $scope.getFirstPeriodDate($scope.baseMsg.id);
                                $scope.initialAgreeMsg.firstPayPeriod = '';
                                $scope.initialAgreeMsg.firstAppiontDate = '';
                                $scope.initialAgreeMsg.afterApproveDays = '';
                                $scope.initialAgreeMsg.createBillModel = $scope.baseMsg.createBillModel;
                            } else {
                                window.alert(resp.msg);
                            }
                        })
                    }
                } else if ($scope.baseMsg.rentalModal === '3') { //固定加抽成
                    if ($scope.rentalStep === 1) { // 固定
                        if (angular.equals($scope.fixedRentMsg, $scope.fixedRentMsgCache)) {
                            let nextStep = {
                                contractId: $scope.baseMsg.id,
                                next: 3
                            };
                            $http.post("/ovu-park/backstage/rental/contractBaseInfo/nextContractInfo", nextStep, fac.postConfig).success(function (resp) {
                               
                                if (resp.code === 0) {
                                    rentOutWriteBack(resp.data);
                                }
                                $scope.rentalStep = 2;
                            })
                        } else {
                            $http.post("/ovu-park/backstage/rental/contractBaseInfo/saveFixedRentCondition", $scope.fixedRentMsg, fac.postConfig).success(function (resp) {
                                if (resp.code === 0) {
                                    $scope.fixedRentMsgCache = {};
                                    angular.copy($scope.fixedRentMsg, $scope.fixedRentMsgCache);
                                    window.msg(resp.msg);
                                    $scope.rentalStep = 2;
                                    $scope.rentOutStartTimes[0] = $scope.baseMsg.leaseStart;
                                    $scope.rentOutEndTimes[0] = $scope.baseMsg.leaseEnd;
                                    $scope.rentOutList[0] = {
                                        commissionModel: '2'
                                    };
                                } else {
                                    window.alert(resp.msg);
                                }
                            })
                        }
                    } else if ($scope.rentalStep === 2) { // 抽成
                        if (angular.equals($scope.rentOutMsg, $scope.rentOutMsgCache)) {
                            let nextStep = {
                                contractId: $scope.baseMsg.id,
                                next: 4
                            };
                            $http.post("/ovu-park/backstage/rental/contractBaseInfo/nextContractInfo", nextStep, fac.postConfig).success(function (resp) {
                               
                                if (resp.code === 0) {
                                    $scope.getFirstPeriodDate($scope.baseMsg.id);
                                    initialAgreeWriteBack(resp.data);
                                }
                                ++$scope.currentStep;
                            })
                        } else {
                            $http.post("/ovu-park/backstage/rental/contractBaseInfo/saveCommissionRentCondition", $scope.rentOutMsg, fac.postConfig).success(function (resp) {
                                if (resp.code === 0) {
                                    $scope.rentOutMsgCache = {};
                                    angular.copy($scope.rentOutMsg, $scope.rentOutMsgCache);
                                    window.msg(resp.msg);
                                    ++$scope.currentStep;
                                    $scope.getFirstPeriodDate($scope.baseMsg.id);
                                    $scope.initialAgreeMsg.firstPayPeriod = '';
                                    $scope.initialAgreeMsg.firstAppiontDate = '';
                                    $scope.initialAgreeMsg.afterApproveDays = '';
                                    $scope.initialAgreeMsg.createBillModel = $scope.baseMsg.createBillModel;
                                } else {
                                    window.alert(resp.msg);
                                }
                            })
                        }
                    }
                }

            }
            // 保存首期约定
            else if ($scope.currentStep === 4) {
                if (!form.$valid) {
                    window.alert('请完成必填项!');
                    return false;
                }
                $scope.bottomAmountStatus = $scope.rentOutList.some((value, index) => {
                    return value.billingAmount;
                });
                $scope.initialAgreeMsg.contractId = $scope.baseMsg.id;
                $scope.initialAgreeMsg.parkId = $scope.baseMsg.parkId;

                $scope.otherChargeList = [];
                $scope.otherChargeStartTimes = [];
                $scope.otherChargeEndTimes = [];
                let nextStep = {
                    contractId: $scope.baseMsg.id,
                    next: 5
                };
                $http.post("/ovu-park/backstage/rental/contractBaseInfo/nextContractInfo", nextStep, fac.postConfig).success(function (resp) {
                   
                    if (resp.code === 0) {
                        if ($scope.executingContractStatus) {
                            $scope.getDateCycle($scope.newAddRentHouses).then(function (value) {
                                otherChargeWriteBack(resp.data, value);
                                ++$scope.currentStep;
                                $scope.$apply();
                            }, function (error) {
                                otherChargeWriteBack(resp.data, error);
                                ++$scope.currentStep;
                                $scope.$apply();
                            });

                            return;
                        }
                        otherChargeWriteBack(resp.data);
                    }
                    ++$scope.currentStep;
                });
                if ($scope.baseMsg.createBillModel == '1') { // 按合同
                    $http.post("/ovu-park/backstage/rental/contractBaseInfo/saveFirstCondition", $scope.initialAgreeMsg, fac.postConfig).success(function (resp) {
                        if (resp.code === 0) {
                            window.msg(resp.msg);
                        } else {
                            window.alert(resp.msg);
                        }
                    })
                } else { // 按租赁空间
                    $scope.initialAgreeMsg.initialAgreeList.forEach((value, index) => {
                        value.firstPayPeriod = $scope.initialAgreeMsg.firstPayPeriod;
                        value.firstAppiontDate = $scope.initialAgreeMsg.firstAppiontDate;
                        value.afterApproveDays = $scope.initialAgreeMsg.afterApproveDays;
                        value.contractId = $scope.baseMsg.id;
                        value.parkId = $scope.baseMsg.parkId;
                    });
                    let params = {
                        houseCondition: JSON.stringify($scope.initialAgreeMsg.initialAgreeList)
                    };
                    $http.post("/ovu-park/backstage/rental/contractBaseInfo/saveHouseFirstCondition", params, fac.postConfig).success(function (resp) {
                        if (resp.code === 0) {
                            $scope.initialAgreeMsgCache = {};
                            angular.copy($scope.initialAgreeMsg, $scope.initialAgreeMsgCache);
                            window.msg(resp.msg);
                        } else {
                            window.alert(resp.msg);
                        }
                    })
                }

                // }
            }
            // 其他费项
            else if ($scope.currentStep === 5) {

            }
        };
        // 上一步
        $scope.backStep = function (form) {
            form.$setSubmitted(true);
            if ($scope.currentStep == 2 && angular.equals($scope.baseMsg, $scope.baseMsgCache)) {
                --$scope.currentStep;
                return;
            }
            if ($scope.currentStep == 3) {
                if ($scope.baseMsg.rentalModal === '3' && $scope.rentalStep === 2) {
                    $scope.rentOutMsg.contractConditionList = JSON.stringify($scope.rentOutList);
                    $scope.rentOutMsg.freePeriodList = JSON.stringify($scope.freeOutList);
                    if (angular.equals($scope.rentOutMsg, $scope.rentOutMsgCache)) {
                        $scope.rentalStep = 1;
                        return;
                    }
                }
                if ($scope.baseMsg.rentalModal === '2' && $scope.rentalStep === 2) {
                    $scope.rentOutMsg.contractConditionList = JSON.stringify($scope.rentOutList);
                    $scope.rentOutMsg.freePeriodList = JSON.stringify($scope.freeOutList);
                    if (angular.equals($scope.rentOutMsg, $scope.rentOutMsgCache)) {
                        $scope.rentalStep = 1;
                        --$scope.currentStep;
                        return;
                    }
                }
                if ($scope.baseMsg.rentalModal === '1') {
                    $scope.fixedRentMsg.contractConditionList = JSON.stringify($scope.fixedRentList);
                    $scope.fixedRentMsg.freePeriodList = JSON.stringify($scope.freeRentList);
                    if (angular.equals($scope.fixedRentMsg, $scope.fixedRentMsgCache)) {
                        --$scope.currentStep;
                        return;
                    }
                }
            }
            if ($scope.currentStep == 4 && angular.equals($scope.initialAgreeMsg, $scope.initialAgreeMsgCache)) {
                $scope.fixedRentList.forEach((value, index) => {
                    value.unitPrice = value.unitPrice.toFixed(2);
                    value.unitPrice = Number(value.unitPrice);
                });
                --$scope.currentStep;
                return;
            }
            if ($scope.currentStep == 5 && angular.equals($scope.otherChargeList, $scope.otherChargeListCache)) {
                --$scope.currentStep;
                return;
            }
            if (!$scope.executingContractStatus) {
                let layerInx = layer.confirm('是否保存当前数据？', {
                    btn: ['确定', '取消'], //按钮
                    shade: 0.3 //不显示遮罩
                }, function () {
                    backSave(form);
                    $scope.$apply();
                    layer.close(layerInx);
                }, function () {
                    backNotSave();
                    $scope.$apply();
                    layer.close(layerInx);
                });
            } else {
                let layerIndex = layer.confirm('返回上一页后当前页面填写的信息无法保存,确认返回？', {
                    btn: ['确定', '取消'], //按钮
                    shade: 0.3 //不显示遮罩
                }, function () {
                    --$scope.currentStep;
                    $scope.$apply();
                    layer.close(layerIndex);
                }, function () {
                    layer.close(layerIndex);
                });
            }

            if ($scope.currentStep === 4) {
                $scope.fixedRentList.forEach((value, index) => {
                    value.unitPrice = value.unitPrice.toFixed(2);
                    value.unitPrice = Number(value.unitPrice);
                })
            }
        };
        // 上一步保存操作
        function backSave(form) {
            // 基本资料也
            if ($scope.currentStep === 2 && !angular.equals($scope.baseMsg, $scope.baseMsgCache)) {
                if (!form.$valid || ($scope.rentHouses.length == 0) || !$scope.baseMsg.createBillModel) {
                    if (!$scope.rentHouses || $scope.rentHouses.length === 0) {
                        window.alert('请选择租赁空间！');
                        return false;
                    }
                    window.alert('请完成必填项！');
                    return false;
                }
                if ($scope.leaseTimeChange && $scope.leaseDetailChange) {
                    $scope.rentHouses.forEach((value, index) => {
                        value.leaseStart = $scope.baseMsg.leaseStart;
                        value.leaseEnd = $scope.baseMsg.leaseEnd;
                        value.enterDate = $scope.baseMsg.enterDate;
                    })
                }
                $scope.newAddRentHouses = assignObject($scope.newAddRentHouses, $scope.rentHouses);
                $scope.optionalRentHouses = angular.copy($scope.rentHouses);
                $scope.baseMsg.parkId = app.park.parkId;
                $scope.baseMsg.contractFiles = JSON.stringify($scope.contactFileList);
                $scope.baseMsg.contractHouseInfos = JSON.stringify($scope.rentHouses);
                $http.post("/ovu-park/backstage/rental/contractBaseInfo/saveBaseInfo", $scope.baseMsg, fac.postConfig).success(function (resp) {
                    if (resp.code == 0) {
                        $scope.leaseTimeChange = false;
                        $scope.leaseDetailChange = true;
                        // 缓存基本资料
                        $scope.baseMsgCache = {};
                        angular.copy($scope.baseMsg, $scope.baseMsgCache);
                        window.msg("基本资料保存成功");
                        --$scope.currentStep;
                    } else {
                        window.alert(resp.msg);
                    }
                });
                return;
            }
            // 租金约定
            else if ($scope.currentStep === 3) {
                if ($scope.baseMsg.rentalModal === '1' || ($scope.baseMsg.rentalModal === '3' && $scope.rentalStep === 1) && !angular.equals($scope.fixedRentMsg, $scope.fixedRentMsgCache)) { //固定租金
                    let fixedUnitEmpty = false;
                    let fixedUnitprice = false;
                    let fixedRentListState = isEmpty($scope.fixedRentList);
                    let fixedRentEndTimeState = isEmpty($scope.fixedRentEndTimes);
                    let freeRentListState = isEmpty($scope.freeRentList);
                    let freeRentStartTimeState = isEmpty($scope.freeRentStartTimes);
                    let freeRentEndTimeState = isEmpty($scope.freeRentEndTimes);

                    if (!fixedRentEndTimeState) {
                        if ($scope.fixedRentEndTimes[$scope.fixedRentEndTimes.length - 1] != $scope.baseMsg.leaseEnd) {
                            window.alert('租赁条件约定列表最后一行的截止时间必须为合同租期的截止时间!');
                            return false;
                        }
                    }
                    if (!fixedRentListState) {
                        $scope.fixedRentList.forEach((value, index) => {
                            if (!value.unitPrice) {
                                fixedUnitEmpty = true;
                            }
                            if (!(/^\d+(\.\d+)?$/.test(value.unitPrice)) && value.unitPrice) {
                                fixedUnitprice = true;
                            }
                            value.leaseStart = $scope.fixedRentStartTimes[index];
                            value.leaseEnd = $scope.fixedRentEndTimes[index];
                            value.contractId = $scope.baseMsg.id;
                            value.rentModel = 1;
                            value.unitPrice = $scope.fixedRentUnitPriceList[index];
                        });
                        if (fixedUnitEmpty) {
                            window.alert('请设置合同的固定租金单价!');
                            return false;
                        }
                        if (fixedUnitprice) {
                            window.alert("合同固定租金单价不能为负值!");
                            return false;
                        }
                        $scope.fixedRentMsg.contractConditionList = JSON.stringify($scope.fixedRentList);
                    }
                    if (!freeRentListState && !freeRentStartTimeState && !freeRentEndTimeState) {
                        $scope.freeRentList.forEach((value, index) => {
                            value.freeDateStart = $scope.freeRentStartTimes[index];
                            value.freeDateEnd = $scope.freeRentEndTimes[index];
                            value.days = $scope.freeTotalDays[index];
                            value.contractId = $scope.baseMsg.id;
                            value.rentModel = 1;
                        })
                    }
                    $scope.fixedRentMsg.freePeriodList = JSON.stringify($scope.freeRentList);
                    $scope.fixedRentMsg.contractId = $scope.baseMsg.id;
                    $scope.fixedRentMsg.parkId = $scope.baseMsg.parkId;
                    $http.post("/ovu-park/backstage/rental/contractBaseInfo/saveFixedRentCondition", $scope.fixedRentMsg, fac.postConfig).success(function (resp) {
                        if (resp.code === 0) {
                            $scope.fixedRentMsgCache = {};
                            angular.copy($scope.fixedRentMsg, $scope.fixedRentMsgCache);
                            window.msg(resp.msg);
                            --$scope.currentStep;
                        } else {
                            window.alert(resp.msg);
                        }
                    });
                    return;
                }

                if ($scope.baseMsg.rentalModal === '2' || ($scope.baseMsg.rentalModal === '3' && $scope.rentalStep === 2) && !angular.equals($scope.rentOutMsg, $scope.rentOutMsgCache)) {
                    let rentOutEmpty = false;
                    let rentOutZero = false;
                    let rentOutProportion = false;
                    let rentOutGuaranteeamount = false;
                    let rentOutListState = isEmpty($scope.rentOutList);
                    let rentOutEndTimeState = isEmpty($scope.rentOutEndTimes);
                    let freeOutListState = isEmpty($scope.freeOutList);
                    let freeOutStartTimeState = isEmpty($scope.freeOutStartTimes);
                    let freeOutEndTimeState = isEmpty($scope.freeOutEndTimes);
                    if (!form.$valid) {
                        window.alert("请完成必填项!");
                        return false;
                    }
                    if (!rentOutEndTimeState) {
                        if ($scope.rentOutEndTimes[$scope.rentOutEndTimes.length - 1] != $scope.baseMsg.leaseEnd) {
                            window.alert('租赁条件约定列表最后一行的截止时间必须为合同租期的截止时间!');
                            return false;
                        }
                    }
                    if (!rentOutListState) {
                        $scope.rentOutList.forEach((value, index) => {
                            if (!value.commissionPercent && value.commissionPercent !== 0) {
                                rentOutEmpty = true;
                            }
                            if (value.commissionPercent === 0) {
                                rentOutZero = true;
                            }
                            if (!(/^\d+(\.\d+)?$/.test(value.commissionPercent)) && value.commissionPercent) {
                                rentOutProportion = true;
                            }
                            if (!(/^\d+(\.\d+)?$/.test(value.billingAmount)) && value.billingAmount) {
                                rentOutGuaranteeamount = true;
                            }
                            value.leaseStart = $scope.rentOutStartTimes[index];
                            value.leaseEnd = $scope.rentOutEndTimes[index];
                            value.contractId = $scope.baseMsg.id;
                            value.rentModel = 2;
                        });
                        if (rentOutEmpty) {
                            window.alert("抽成比例不能为空!");
                            return false;
                        }
                        if (rentOutZero) {
                            window.alert("抽成比例不能为零!");
                            return false;
                        }
                        if (rentOutProportion) {
                            window.alert("抽成比例不能为负值!");
                            return false;
                        }
                        if (rentOutGuaranteeamount) {
                            window.alert("保底金额不能为负值!");
                            return false;
                        }
                        $scope.rentOutMsg.contractConditionList = JSON.stringify($scope.rentOutList);
                    }
                    if (!freeOutListState && !freeOutStartTimeState && !freeOutEndTimeState) {
                        $scope.freeOutList.forEach((value, index) => {
                            value.freeDateStart = $scope.freeOutStartTimes[index];
                            value.freeDateEnd = $scope.freeOutEndTimes[index];
                            value.days = $scope.freeOutTotalDays[index];
                            value.contractId = $scope.baseMsg.id;
                            value.rentModel = 2;
                        })
                    }
                    $scope.rentOutMsg.freePeriodList = JSON.stringify($scope.freeOutList);
                    $scope.rentOutMsg.contractId = $scope.baseMsg.id;
                    $scope.rentOutMsg.parkId = $scope.baseMsg.parkId;
                    $http.post("/ovu-park/backstage/rental/contractBaseInfo/saveCommissionRentCondition", $scope.rentOutMsg, fac.postConfig).success(function (resp) {
                        if (resp.code === 0) {
                            $scope.rentOutMsgCache = {};
                            angular.copy($scope.rentOutMsg, $scope.rentOutMsgCache);
                            window.msg(resp.msg);
                            --$scope.currentStep;
                        } else {
                            window.alert(resp.msg);
                        }
                    });
                    return;
                }
            }
            // 保存首期约定
            else if ($scope.currentStep === 4 && !angular.equals($scope.initialAgreeMsg, $scope.initialAgreeMsgCache)) {
                if (!form.$valid) {
                    window.alert('请完成必填项!');
                    return false;
                }
                $scope.bottomAmountStatus = $scope.rentOutList.some((value, index) => {
                    return value.billingAmount;
                });
                $scope.initialAgreeMsg.contractId = $scope.baseMsg.id;
                $scope.initialAgreeMsg.parkId = $scope.baseMsg.parkId;
                if ($scope.baseMsg.createBillModel == '1') { // 按合同
                    $http.post("/ovu-park/backstage/rental/contractBaseInfo/saveFirstCondition", $scope.initialAgreeMsg, fac.postConfig).success(function (resp) {
                        if (resp.code === 0) {
                            window.msg(resp.msg);
                            --$scope.currentStep;
                        } else {
                            window.alert(resp.msg);
                        }
                    })
                } else { // 按租赁空间
                    $scope.initialAgreeMsg.initialAgreeList.forEach((value, index) => {
                        value.firstPayPeriod = $scope.initialAgreeMsg.firstPayPeriod;
                        value.firstAppiontDate = $scope.initialAgreeMsg.firstAppiontDate;
                        value.afterApproveDays = $scope.initialAgreeMsg.afterApproveDays;
                        value.contractId = $scope.baseMsg.id;
                        value.parkId = $scope.baseMsg.parkId;
                    });
                    let params = {
                        houseCondition: JSON.stringify($scope.initialAgreeMsg.initialAgreeList)
                    };
                    $http.post("/ovu-park/backstage/rental/contractBaseInfo/saveHouseFirstCondition", params, fac.postConfig).success(function (resp) {
                        if (resp.code === 0) {
                            window.msg(resp.msg);
                            --$scope.currentStep;
                        } else {
                            window.alert(resp.msg);
                        }
                    })
                }
                return;
            }
            // 其他费项
            else if ($scope.currentStep === 5 && !angular.equals($scope.otherChargeList, $scope.otherChargeListCache)) {
                let params = {
                    contractRelativeExpenditures: ''
                };
                let otherChargeListState = isEmpty($scope.otherChargeList);
                let otherChargeStartTimeState = isEmpty($scope.otherChargeStartTimes);
                let otherChargeEndTimeState = isEmpty($scope.otherChargeEndTimes);
                if (!form.$valid) {
                    window.alert('请完成必填项!');
                    return false;
                }
                let totalPrice;
                let totalPriceZero = false;
                let totalPriceEmpty = false;
                let totalPriceNegative = false;
                if ($scope.baseMsg.rentalModal === '1' || ($scope.baseMsg.rentalModal !== '1' && !$scope.bottomAmountStatus)) {
                    $scope.otherChargeList.forEach((value, index) => {
                        totalPrice = value.totalPrice;
                        if (totalPrice === 0) {
                            totalPriceZero = true;
                        }
                        if (!totalPrice && totalPrice !== 0) {
                            totalPriceEmpty = true;
                        }
                        if (!(/^\d+(\.\d+)?$/.test(totalPrice))) {
                            totalPriceNegative = true;
                        }
                    });
                    if (totalPriceZero) {
                        window.alert("费项总价不能为零!");
                        return false;
                    }
                    if (totalPriceEmpty) {
                        window.alert("费项总价不能为空!");
                        return false;
                    }
                    if (totalPriceNegative) {
                        window.alert("费项总价不能为负值!");
                        return false;
                    }

                }
                if (!otherChargeListState && !otherChargeStartTimeState && !otherChargeEndTimeState) {
                    $scope.otherChargeList.forEach((value, index) => {
                        value.payDateStart = $scope.otherChargeStartTimes[index];
                        value.payDateEnd = $scope.otherChargeEndTimes[index];
                    })
                }
                params.contractRelativeExpenditures = JSON.stringify($scope.otherChargeList);
                $http.post("/ovu-park/backstage/rental/contractBaseInfo/saveContractExpenditure", params, fac.postConfig).success(function (resp) {
                    if (resp.code === 0) {
                        window.msg(resp.msg);
                        --$scope.currentStep;
                    } else {
                        window.alert(resp.msg);
                    }
                });
                return;
            }
            --$scope.currentStep;
        }
        // 上一步不保存操作
        function backNotSave() {
            if ($scope.baseMsg.rentalModal === '3' && $scope.rentalStep === 2 && $scope.currentStep === 3) {
                $scope.rentalStep = 1;
                $scope.rentOutList = [];
                return;
            }
            if ($scope.baseMsg.rentalModal === '2' && $scope.rentalStep === 2 && $scope.currentStep === 3) {
                $scope.rentalStep = 1;
            }
            --$scope.currentStep;
        }
        // 保存合同 
        $scope.save = function (form) {
            form.$setSubmitted(true);
            let params = {
                contractRelativeExpenditures: ''
            };
            let otherChargeListState = isEmpty($scope.otherChargeList);
            let otherChargeStartTimeState = isEmpty($scope.otherChargeStartTimes);
            let otherChargeEndTimeState = isEmpty($scope.otherChargeEndTimes);
            if (!form.$valid) {
                window.alert('请完成必填项!');
                return false;
            }
            let totalPrice;
            let totalPriceZero = false;
            let totalPriceEmpty = false;
            let totalPriceNegative = false;
            if ($scope.baseMsg.rentalModal === '1' || ($scope.baseMsg.rentalModal !== '1' && !$scope.bottomAmountStatus)) {
                $scope.otherChargeList.forEach((value, index) => {
                    totalPrice = value.totalPrice;
                    if (totalPrice === 0) {
                        totalPriceZero = true;
                    }
                    if (!totalPrice && totalPrice !== 0) {
                        totalPriceEmpty = true;
                    }
                    if (!(/^\d+(\.\d+)?$/.test(totalPrice))) {
                        totalPriceNegative = true;
                    }
                });
                if (totalPriceZero) {
                    window.alert("费项总价不能为零!");
                    return false;
                }
                if (totalPriceEmpty) {
                    window.alert("费项总价不能为空!");
                    return false;
                }
                if (totalPriceNegative) {
                    window.alert("费项总价不能为负值!");
                    return false;
                }

            }
            if (!otherChargeListState && !otherChargeStartTimeState && !otherChargeEndTimeState) {
                $scope.otherChargeList.forEach((value, index) => {
                    value.payDateStart = $scope.otherChargeStartTimes[index];
                    value.payDateEnd = $scope.otherChargeEndTimes[index];
                })
            }
            if ($scope.executingContractStatus) {
                let houseList = [];
                $scope.rentHouses.forEach((value, index) => {
                    houseList.push(value.houseId);
                });
                let layerIndex = layer.confirm('该操作一经保存无法修改,请确认是否保存？', {
                    btn: ['确定', '取消'], //按钮
                    shade: 0.3 //不显示遮罩
                }, function () {
                    params.contractId = $scope.baseMsg.id;
                    params.parkId = $scope.baseMsg.parkId;
                    params.houseInfos = JSON.stringify($scope.rentHouses);
                    params.houseId = houseList.join(",");
                    params.contractConditionList = JSON.stringify($scope.fixedRentList);
                    params.freePeriodList = $scope.fixedRentMsg.freePeriodList;
                    params.contractRelativeExpenditures = JSON.stringify($scope.otherChargeList);
                    $http.post("/ovu-park/backstage/rental/contractBaseInfo/updateContractHouse", params, fac.postConfig).success(function (resp) {
                        if (resp.code === 0) {
                            window.msg(resp.msg);
                            layer.close(layerIndex);
                            $uibModalInstance.close();
                        } else {
                            layer.close(layerIndex);
                            window.alert(resp.msg);
                        }
                    })
                }, function () {
                    
                });
                return;
            }
            params.contractRelativeExpenditures = JSON.stringify($scope.otherChargeList);
            $http.post("/ovu-park/backstage/rental/contractBaseInfo/saveContractExpenditure", params, fac.postConfig).success(function (resp) {
                if (resp.code === 0) {
                    window.msg(resp.msg);
                    $uibModalInstance.close();
                } else {
                    window.alert(resp.msg);
                }
            })
        };
        app.modulePromiss.then(function () {
            $scope.getConteactType();
            $scope.expenditureListAll();
            $scope.getRate();
            $scope.getTaxRate();
        });

        $scope.cancel = function () {
            var layerIndex = layer.confirm('确认关闭吗？', {
                btn: ['确定', '取消'], //按钮
                shade: 0.3 //不显示遮罩
            }, function () {
                $uibModalInstance.dismiss('cancel');
                layer.close(layerIndex);
            }, function () {
               
            });
        };

        $scope.$on("$destroy", function () {
            $rootScope.pages.params = {};
            $scope.title.addStatus = true;
        });

        // 固定租金约定回显
        function fixedRentWriteBack(data) {
            $scope.fixedRentList = data.rentalContractConditions || [];
            if ($scope.fixedRentList.length === 0) {
                $scope.fixedRentStartTimes[0] = $scope.baseMsg.leaseStart;
                $scope.fixedRentEndTimes[0] = $scope.baseMsg.leaseEnd;
                $scope.fixedRentList[0] = {
                    unitPrice: 0,
                    area: $scope.baseMsg.contractArea,
                    totalPrice: 0,
                    taxPrice: 0,
                    rentPrice: 0,
                    taxRate: $scope.contractTaxRate
                };
            } else {
                let totalPrice = 0;
                let totalArea = 0;
                $scope.fixedRentList.forEach((value, index) => {
                    value.leaseStart = $filter('date')(value.leaseStart, 'yyyy-MM-dd');
                    $scope.fixedRentStartTimes[index] = value.leaseStart;
                    value.leaseEnd = $filter('date')(value.leaseEnd, 'yyyy-MM-dd');
                    $scope.fixedRentEndTimes[index] = value.leaseEnd;
                    // 筛选每个分段合同中的租赁空间
                    let newAddRentHouses = angular.copy($scope.newAddRentHouses);
                    let beLeftRentHouses = angular.copy($scope.beLeftRentHouses);
                    if ($scope.executingContractStatus) {
                        value.houseConditionList = getDifferentHouse(beLeftRentHouses, value.houseConditionList, 2);
                        newAddRentHouses = checkAddContractLease(newAddRentHouses, value.leaseStart, value.leaseEnd);
                        value.houseConditionList.push.apply(value.houseConditionList, newAddRentHouses);
                    }
                    totalPrice = 0;
                    totalArea = 0;
                    for (let i = 0; i < value.houseConditionList.length; i++) {
                        if (value.houseConditionList[i].totalPrice) {
                            totalPrice += value.houseConditionList[i].totalPrice;
                        } else {
                            totalPrice += value.unitPrice * value.houseConditionList[i].area;
                        }
                        totalArea += value.houseConditionList[i].area;
                    }
                    value.area = totalArea || $scope.baseMsg.contractArea;
                    value.totalPrice = (totalPrice).toFixed(2);
                    value.totalPrice = Number(value.totalPrice);

                    $scope.fixedRentUnitPriceList[index] = value.unitPrice;
                    value.houseRentalConditions = JSON.stringify(value.houseConditionList);
                })
            }
            $scope.freeRentList = data.rentalContractFreePeriods || [];
            if ($scope.executingContractStatus) {
                $scope.freeRentList = getDifferentHouse($scope.beLeftRentHouses, $scope.freeRentList, 2);
            }
            $scope.freeRentList.forEach((value, index) => {
                value.freeDateStart = $filter('date')(value.freeDateStart, 'yyyy-MM-dd');
                $scope.freeRentStartTimes[index] = value.freeDateStart;
                value.freeDateEnd = $filter('date')(value.freeDateEnd, 'yyyy-MM-dd');
                $scope.freeRentEndTimes[index] = value.freeDateEnd;
                $scope.freeTotalDays[index] = value.days;
                $scope.freeRentHouseIds[index] = value.houseId;
                if ($scope.executingContractStatus) {
                    value.executingContractStatus = true;
                } else {
                    value.executingContractStatus = false;
                }
            });
            $scope.fixedRentMsg.contractConditionList = JSON.stringify($scope.fixedRentList);
            $scope.fixedRentMsg.freePeriodList = JSON.stringify($scope.freeRentList);
            $scope.fixedRentMsg.payUnit = $scope.fixedRentList[0] ? ($scope.fixedRentList[0].payUnit ? $scope.fixedRentList[0].payUnit + '' : '2') : '2';
            $scope.fixedRentMsg.payCycle = $scope.fixedRentList[0] ? ($scope.fixedRentList[0].payCycle ? $scope.fixedRentList[0].payCycle + '' : '') : '';
            $scope.fixedRentMsg.cycleWay = $scope.fixedRentList[0] ? ($scope.fixedRentList[0].cycleWay ? $scope.fixedRentList[0].cycleWay + '' : '') : '';
            $scope.fixedRentMsg.payDate = $scope.fixedRentList[0] ? ($scope.fixedRentList[0].payDate ? $scope.fixedRentList[0].payDate + '' : '') : '';
            $scope.fixedRentMsg.afterDays = $scope.fixedRentList[0] ? ($scope.fixedRentList[0].afterDays ? $scope.fixedRentList[0].afterDays : '') : '';
            $scope.fixedRentMsg.contractId = data.id;
            $scope.fixedRentMsg.parkId = data.parkId;
            $scope.fixedRentMsg.createBillModel = $scope.baseMsg.createBillModel;
            $scope.fixedRentMsgCache = {};
            angular.copy($scope.fixedRentMsg, $scope.fixedRentMsgCache);
        }
        // 比例抽成约定回显
        function rentOutWriteBack(data) {
            $scope.rentOutList = data.rentalContractConditions || [];
            if ($scope.rentOutList.length === 0) {
                $scope.rentOutStartTimes[0] = $scope.baseMsg.leaseStart;
                $scope.rentOutEndTimes[0] = $scope.baseMsg.leaseEnd;
                $scope.rentOutList[0] = {
                    commissionModel: '2',
                    billingAmount: 0
                };
            } else {
                $scope.rentOutList.forEach((value, index) => {
                    value.leaseStart = $filter('date')(value.leaseStart, 'yyyy-MM-dd');
                    $scope.rentOutStartTimes[index] = value.leaseStart;
                    value.leaseEnd = $filter('date')(value.leaseEnd, 'yyyy-MM-dd');
                    $scope.rentOutEndTimes[index] = value.leaseEnd;
                    value.commissionModel = value.rentModel + '';
                })
            }
            $scope.freeOutList = data.rentalContractFreePeriods || [];
            $scope.freeOutList.forEach((value, index) => {
                value.freeDateStart = $filter('date')(value.freeDateStart, 'yyyy-MM-dd');
                $scope.freeOutStartTimes[index] = value.freeDateStart;
                value.freeDateEnd = $filter('date')(value.freeDateEnd, 'yyyy-MM-dd');
                $scope.freeOutEndTimes[index] = value.freeDateEnd;
                $scope.freeOutTotalDays[index] = value.days;
            });
            $scope.rentOutMsg.contractConditionList = JSON.stringify(data.rentalContractConditions);
            $scope.rentOutMsg.freePeriodList = JSON.stringify(data.rentalContractFreePeriods);
            $scope.rentOutMsg.turnoverCycle = $scope.rentOutList[0] ? ($scope.rentOutList[0].turnoverCycle ? $scope.rentOutList[0].turnoverCycle + '' : '') : '';
            $scope.rentOutMsg.turnoverCycleWay = $scope.rentOutList[0] ? ($scope.rentOutList[0].turnoverCycleWay ? $scope.rentOutList[0].turnoverCycleWay + '' : '') : '';
            $scope.rentOutMsg.turnoverStandard = $scope.rentOutList[0] ? ($scope.rentOutList[0].turnoverStandard ? $scope.rentOutList[0].turnoverStandard + '' : '') : '';
            $scope.rentOutMsg.payCycle = $scope.rentOutList[0] ? ($scope.rentOutList[0].payCycle ? $scope.rentOutList[0].payCycle + '' : '') : '';
            $scope.rentOutMsg.cycleWay = $scope.rentOutList[0] ? ($scope.rentOutList[0].cycleWay ? $scope.rentOutList[0].cycleWay + '' : '') : '';
            $scope.rentOutMsg.payDate = $scope.rentOutList[0] ? ($scope.rentOutList[0].payDate ? $scope.rentOutList[0].payDate + '' : '') : '';
            $scope.rentOutMsg.afterDays = $scope.rentOutList[0] ? ($scope.rentOutList[0].afterDays ? $scope.rentOutList[0].afterDays : '') : '';
            $scope.rentOutMsg.contractId = data.id;
            $scope.rentOutMsg.parkId = data.parkId;
            $scope.rentOutMsgCache = {};
            angular.copy($scope.rentOutMsg, $scope.rentOutMsgCache);
        }
        // 首期约定回显
        function initialAgreeWriteBack(data, newAddHouse) {
            let writeBackData = data.rentalContractConditions || [];
            if ($scope.baseMsg.createBillModel == '1') { // 按合同生成账单
                $scope.initialAgreeMsg.firstStartDate = writeBackData[0] ? writeBackData[0].firstStartDate : 0;
                $scope.initialAgreeMsg.firstEndDate = writeBackData[0] ? writeBackData[0].firstEndDate : 0;
                $scope.initialAgreeMsg.firstStartDate = $filter('date')($scope.initialAgreeMsg.firstStartDate, 'yyyy-MM-dd');
                $scope.initialAgreeMsg.firstEndDate = $filter('date')($scope.initialAgreeMsg.firstEndDate, 'yyyy-MM-dd');
                $scope.initialAgreeMsg.firstPayPeriod = writeBackData[0] ? (writeBackData[0].firstPayPeriod ? writeBackData[0].firstPayPeriod + '' : '') : '';
                $scope.initialAgreeMsg.firstAppiontDate = writeBackData[0] ? (writeBackData[0].firstAppiontDate ? writeBackData[0].firstAppiontDate : '') : '';
                $scope.initialAgreeMsg.firstAppiontDate && ($scope.initialAgreeMsg.firstAppiontDate = $filter('date')($scope.initialAgreeMsg.firstAppiontDate, 'yyyy-MM-dd'));
                $scope.initialAgreeMsg.afterApproveDays = writeBackData[0] ? (writeBackData[0].afterApproveDays ? writeBackData[0].afterApproveDays : '') : '';
                $scope.initialAgreeMsg.contractId = data.id;
                $scope.initialAgreeMsg.parkId = data.parkId;
                $scope.initialAgreeMsg.createBillModel = $scope.baseMsg.createBillModel;
            } else { // 按租赁空间生成账单
                $scope.initialAgreeMsg.initialAgreeList = writeBackData;
                if ($scope.executingContractStatus) {
                    $scope.beLeftRentHouses = assignObject($scope.beLeftRentHouses, $scope.rentHouses);
                    $scope.initialAgreeMsg.initialAgreeList = getDifferentHouse($scope.beLeftRentHouses, $scope.initialAgreeMsg.initialAgreeList, 2);
                    $scope.initialAgreeMsg.initialAgreeList.push.apply($scope.initialAgreeMsg.initialAgreeList, newAddHouse);
                }
                $scope.initialAgreeMsg.initialAgreeList.forEach((value, index) => {
                    value.firstStartDate = $filter('date')(value.firstStartDate, 'yyyy-MM-dd');
                    value.firstEndDate = $filter('date')(value.firstEndDate, 'yyyy-MM-dd');
                    value.houseName = value.houseName ? value.houseName : '--'
                });
                $scope.initialAgreeMsg.firstPayPeriod = writeBackData[0] ? (writeBackData[0].firstPayPeriod ? writeBackData[0].firstPayPeriod + '' : '') : '';
                $scope.initialAgreeMsg.firstAppiontDate = writeBackData[0] ? (writeBackData[0].firstAppiontDate ? writeBackData[0].firstAppiontDate : '') : '';
                $scope.initialAgreeMsg.firstAppiontDate && ($scope.initialAgreeMsg.firstAppiontDate = $filter('date')($scope.initialAgreeMsg.firstAppiontDate, 'yyyy-MM-dd'));
                $scope.initialAgreeMsg.afterApproveDays = writeBackData[0] ? (writeBackData[0].afterApproveDays ? writeBackData[0].afterApproveDays : '') : '';
                $scope.initialAgreeMsg.createBillModel = $scope.baseMsg.createBillModel;
            }
            $scope.initialAgreeMsgCache = {};
            angular.copy($scope.initialAgreeMsg, $scope.initialAgreeMsgCache);
        }
        // 其他费项回显
        function otherChargeWriteBack(data, newAddHouse) {
            let curTime = new Date().format("yyyy-MM-dd");
            let taxRate;
            let standardObj = $.extend({
                contractId: $scope.baseMsg.id,
                expenditureName: '履约保证金',
                expenditureId: $scope.expenditureList[0].id,
                billingRates: '1',
                taxRate: $scope.expenditureList[0].taxRate
            }, $scope.expenditureList[0]);
            $scope.otherChargeList = data.rentalContractRelativeExpenditures || [];
            if ($scope.executingContractStatus) {
                $scope.beLeftRentHouses = assignObject($scope.beLeftRentHouses, $scope.rentHouses);
                $scope.otherChargeList = getDifferentHouse($scope.beLeftRentHouses, $scope.otherChargeList, 2);
                $scope.otherChargeList.push.apply($scope.otherChargeList, newAddHouse);
            }
            $scope.otherChargeList.forEach((value, index) => {
                if (value.disabledStatus) {
                    value.payDateStart = value.payDateStart ? $filter('date')(value.payDateStart, 'yyyy-MM-dd') : '';
                    value.payDateEnd = value.payDateEnd ? $filter('date')(value.payDateEnd, 'yyyy-MM-dd') : '';
                    $scope.otherChargeStartTimes[index] = value.payDateStart || value.leaseStart;
                    $scope.otherChargeEndTimes[index] = value.payDateEnd || value.leaseEnd;
                    value.contractId = value.contractId || $scope.baseMsg.id;
                    value.expenditureName = value.expenditureName || '履约保证金';
                    value.expenditureId = value.expenditureId || $scope.expenditureList[0].id;
                    value.billingRates = '1';
                    value.taxRate = value.taxRate || $scope.expenditureList[0].taxRate;
                    return;
                }
                value.payDateStart = value.payDateStart ? $filter('date')(value.payDateStart, 'yyyy-MM-dd') : $scope.initialAgreeMsg.firstStartDate;
                value.payDateEnd = value.payDateEnd ? $filter('date')(value.payDateEnd, 'yyyy-MM-dd') : $scope.initialAgreeMsg.firstEndDate;
                $scope.otherChargeStartTimes[index] = value.payDateStart;
                $scope.otherChargeEndTimes[index] = value.payDateEnd;
                value.unitPrice = "";
                taxRate = value.taxRate / 100;
                value.taxPrice = value.totalPrice * taxRate / (1+taxRate);
                value.rentPrice = value.totalPrice - value.taxPrice;
                value.disabledStatus = false;
            });
            $scope.otherChargeListCache = [];
            angular.copy($scope.otherChargeList, $scope.otherChargeListCache);
        }

        // 免租期控制重叠
        function freeTimeDuplicate(addStart, addEnd, arrStart, arrEnd, index, houseIdArr) {
            if (isEmpty(arrStart) || isEmpty(arrEnd)) {
                return;
            }
            let start = [];
            let end = [];
            if (houseIdArr) {
                let curHouseId = houseIdArr[index];
                houseIdArr.forEach((v, i) => {
                    if (v === curHouseId) {
                        arrStart[i] && (start[i] = arrStart[i]);
                        arrEnd[i] && (end[i] = arrEnd[i]);
                    } else {
                        arrStart[i] && (start[i] = '');
                        arrEnd[i] && (end[i] = '');
                    }
                })
            } else {
                start = angular.copy(arrStart);
                end = angular.copy(arrEnd);
            }
            let startLength = start.length;
            let endLength = end.length;
            if (startLength > endLength) {
                start.splice(index, 1);
            } else if (startLength < endLength) {
                end.splice(index, 1);
            } else {
                start.splice(index, 1);
                end.splice(index, 1);
            }
            let duplicate = false;
            try {
                start.forEach((value, index) => {
                    if (addStart && value && end[index] && legalTime(value, addStart, 4) && legalTime(addStart, end[index], 4)) {
                        duplicate = true;
                        throw Error();
                    }
                    if (addEnd && value && end[index] && legalTime(value, addEnd, 4) && legalTime(addEnd, end[index], 4)) {
                        duplicate = true;
                        throw Error();
                    }
                    if (addStart && addEnd) {
                        if (value && legalTime(addStart, value, 4) && legalTime(value, addEnd, 4)) {
                            duplicate = true;
                            throw Error();
                        }
                        if (end[index] && legalTime(addStart, end[index], 4) && legalTime(end[index], addEnd, 4)) {
                            duplicate = true;
                            throw Error();
                        }
                    }
                })
            } catch (error) {

            }
            return duplicate;
        }
        // 区间日期的月数
        function getTotalMonths(start, end, type) {
            if (!start || !end) {
                return;
            }
            var startTime = new Date(start);
            var endTime = new Date(end);
            var months;
            var days;
            months = (endTime.getFullYear() - startTime.getFullYear()) * 12;
            months -= startTime.getMonth();
            months += endTime.getMonth();
            if (startTime.getDate() >= endTime.getDate()) {
                months = (months == 0 ? 0 : months);
            } else {
                months = (months == 0 ? 1 : months + 1);
            }

            days = (endTime.getTime() - startTime.getTime()) / 1000 / 60 / 60 / 24 + 1;

            if (type === 1) {
                return months;
            } else if (type === 2) {
                return days;
            }
        }

        // 验证时间的大小;
        function legalTime(start, end, type) {
            if (!start || !end) {
                return true;
            }
            var beginDate = start;
            var endDate = end;
            var d1 = new Date(beginDate.replace("/\-/g", "\/"));
            var d2 = new Date(endDate.replace("/\-/g", "\/"));
            if (beginDate != "" && endDate != "" && d1 > d2) {
                if (type === 1) {
                    window.alert("开始时间不能大于结束时间！");
                } else if (type === 2) {
                    window.alert("开始时间或结束时间不能超出合同租期！");
                } else if (type === 3) {
                    window.alert("进场时间必须在合同租期之内!")
                } else if (type === 4) {

                }
                return false;
            }
            return true;
        }

        // 获取前一天或后一天,type=1为前一天,type=2为后一天
        function getYesOrTom(time, type) {
            var date = new Date(time.replace("/\-/g", "\/")).getTime();
            if (type === 1) {
                return $filter("date")((date - 24 * 60 * 60 * 1000), "yyyy-MM-dd");
            } else if (type === 2) {
                return $filter("date")((date + 24 * 60 * 60 * 1000), "yyyy-MM-dd");
            }
        }

        // 验证空数组和空对象
        function isEmpty(obj) {
            //检验null和undefined
            if (!obj && obj !== 0 && obj !== '') {
                return true;
            }
            //检验数组
            if (Array.prototype.isPrototypeOf(obj) && obj.length === 0) {
                return true;
            }
            //检验对象
            if (Object.prototype.isPrototypeOf(obj) && Object.keys(obj).length === 0) {
                return true;
            }
            return false;
        }
        // 提取两个数组中异同的部分 type=1不同的部分;type=2相同的部分 newChoose为target
        function getDifferentHouse(original, newChoose, type) {
            let differentArr = [];
            let sameArr = [];
            let sameStatus = false;
            let sameObj;
            let diffObj;
            for (let i = 0; i < newChoose.length; i++) {
                contractHouseId = newChoose[i].contractHouseId || newChoose[i].houseId;
                for (let j = 0; j < original.length; j++) {
                    houseId = original[j].contractHouseId || original[j].houseId;
                    sameStatus = false;
                    if (contractHouseId === houseId) {
                        sameObj = $.extend({}, newChoose[i], original[j]);
                        sameArr.push(sameObj);
                        sameStatus = true;
                        break;
                    }
                }
                if (!sameStatus) {
                    diffObj = $.extend({}, newChoose[i]);
                    differentArr.push(diffObj);
                }
            }
            if (type === 1) {
                return differentArr;
            } else {
                return sameArr;
            }
        }

        // 验证新增空间的合同时间是否在当前的合同租期之内, 返回合同租期内的新增空间
        function checkAddContractLease(newHouse, leaseStart, leaseEnd) {
            let house = [];
            newHouse.forEach((value, index) => {
                let start = legalTime(value.leaseStart, leaseEnd);
                let end = legalTime(leaseStart, value.leaseEnd);
                if (start && end) {
                    house.push(value);
                }
            });
            return house;
        }

        // 获取时间数组的最大最小值(格式是2019-04-10);
        function getMaxMin(arr, type) {
            if (arr.length == 0) {
                return '';
            }
            var array = [];
            for (let i = 0; i < arr.length; i++) {
                let item = new Date(arr[i].replace("/\-/g", "\/"));
                array.push(item);
            }
            // debugger;
            if (type == 0) {
                return $filter("date")(Math.max(...array), "yyyy-MM-dd");
            } else if (type == 1) {
                return $filter("date")(Math.min(...array), "yyyy-MM-dd");
            }
        }

        // 判断数组中是否有不相同的项 true为有
        function isEqual(array1, array2) {
            if (!array1 || !array2) {
                return false;
            }
            if (array1.length === 0) {
                return false;
            }
            let status = false;
            let arr1 = array1.sort();
            let arr2 = array2.sort();
            for (let i = 0; i < arr1.length; i++) {
                if (arr1[i] && arr1[i + 1] && arr1[i] !== arr1[i + 1]) {
                    status = true;
                }
            }
            for (let i = 0; i < arr2.length; i++) {
                if (arr2[i] && arr2[i + 1] && arr2[i] !== arr2[i + 1]) {
                    status = true;
                }
            }
            return status;
        }
    });

    // 添加空间
    app.controller('rentHouseModalCtrl', function ($scope, $rootScope, $http, $uibModalInstance, $filter, fac, houses, contact, beginningHouse) {
        $scope.originalHouseList = angular.copy(beginningHouse);
        // 用于收集当勾选确认后记录相对于进入时新增加的空间
        $scope.newAddHouseList = [];
        // 用于收集进入时经过勾选还剩下的空间
        $scope.beLeftHouseList = [];
        $scope.item = contact;
        $rootScope.treeData = null;
        $rootScope.flatData = null;
        $scope.config = {
            edit: false,
            showCheckbox: true
        };

        $scope.newChooseIds = []; //编辑租赁资源，已选定，即将要关联的空间id
        var dataObj = {
            "id": $scope.item.id,
            "parkId": $scope.item.parkId
        };

        $http.post("/ovu-park/backstage/rental/contract/getContractHouseTree", dataObj, fac.postConfig).success(function (treeData) {
            $rootScope.treeData = treeData.data;
            $rootScope.flatData = fac.treeToFlat(treeData.data);
            $scope.rightList = [];
            houses.forEach(function (house) {
                // debugger;
                var node = $scope.flatData.find(function (n) {
                    return n.did == house.houseId
                });
                if (node != undefined) {
                    node.state = node.state || {};
                    node.state.checked = true;
                    expandFather(node);
                    // node.fullPath = node.stageName + ">" + node.buildName + ">" + node.houseName;
                    $scope.rightList.push(node);
                    $scope.newChooseIds.push(node.houseId);
                }
            });
        });

        function expandFather(node) {
            var father = $scope.flatData.find(function (n) {
                return n.did == node.pdid
            });
            if (father) {
                father.state = father.state || {};
                father.state.expanded = true;
                expandFather(father);
            }
        }

        var obj = {};
        $scope.validChooseHids = []; //用于收集已勾选的房屋id
        $scope.reduceHis = []; //用于收集取消勾选的房屋id
        $scope.check = function (node) {
            node.state = node.state || {};
            node.state.checked = !node.state.checked;

            function checkSons(node, status) {
                node.state = node.state || {};
                node.state.checked = status;
                if (node.nodes && node.nodes.length) {
                    node.nodes.forEach(function (n) {
                        if (node.state.checked) { //当选中的时候
                            if ($scope.validChooseHids.indexOf(n.houseId) === -1) { //只有不包含当前房屋的id时，才加入
                                $scope.validChooseHids.push(n.houseId);
                            }
                        }
                        checkSons(n, status);
                    });
                } else {
                    if (node.state.checked) { //当选中的时候
                        if ($scope.validChooseHids.indexOf(node.houseId) === -1) { //只有不包含当前房屋的id时，才加入
                            $scope.validChooseHids.push(node.houseId);
                        }
                    } else { //当未选中的时候
                        let params = {
                            contractId: $scope.item.id,
                            houseId: node.houseId
                        };
                        $http.get("/ovu-park/backstage/rental/contractBaseInfo/deleteContractHouse", {
                            params: params
                        }).success(function (response) {
                            if (response.code === 0) {
                                $scope.validChooseHids.splice($scope.validChooseHids.indexOf(node.houseId), 1);
                                $scope.reduceHis.push(node.houseId);
                            } else {
                                window.alert(response.msg);
                                node.state.checked = true;
                                $scope.rightList = $scope.flatData.filter(function (n) {
                                    return n.state && n.state.checked == true && n.pdid != null && n.houseName != null
                                })
                            }
                        })
                    }
                }
            }

            function uncheckFather(node) {
                var father = $scope.flatData.find(function (n) {
                    return n.did == node.pdid
                });
                if (father) {
                    father.state = father.state || {};
                    father.state.checked = false;
                    uncheckFather(father);
                }
            }
            if (node.state.checked) {
                checkSons(node, true);
            } else {
                checkSons(node, false);
                uncheckFather(node);
            }
            $scope.rightList = $scope.flatData.filter(function (n) {
                return n.state && n.state.checked == true && n.pdid != null && n.houseName != null
            });
            $scope.newChooseIds = [];
            for (var i = 0; i < $scope.rightList.length; i++) {
                var rightObj = $scope.rightList[i];
                var fullPath = rightObj.stageName + ">" + rightObj.buildName + ">" + rightObj.houseName;
                $scope.rightList[i].fullPath = fullPath;
                $scope.newChooseIds.push(rightObj.houseId);
            }
            if ($scope.rightList.length == 0) {
                $scope.newChooseIds = [];
            }
        };
        $scope.save = function () {
            var houses = [];
            angular.copy($scope.rightList, houses);
            if (houses.length == 0) {
                window.alert("请选择租赁空间!");
                return;
            }
            angular.forEach(houses, function (value, key) {
                houses[key].id = value.did;
                houses[key].parkName = app.park.parkName;
                houses[key].parkId = app.park.parkId;
                houses[key].houseType = "1";
                houses[key].unitNo = getNum(value.unitName)[0];
                houses[key].floorNo = getNum(value.floorName)[0];
            });
            $scope.newAddHouseList = getDifferentHouse($scope.originalHouseList, houses, 1);
            $scope.beLeftHouseList = getDifferentHouse($scope.originalHouseList, houses, 2);
            houses = getDifferentHouse($scope.originalHouseList, houses, 3);
            $uibModalInstance.close({
                houses: houses,
                newChooseIds: $scope.newChooseIds,
                newAddHouseList: $scope.newAddHouseList,
                beLeftHouseList: $scope.beLeftHouseList
            });
            $scope.reduceHis = []; //清空
        };
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
        // 提取字符串中的数字
        function getNum(Str, isFilter) {
            //用来判断是否把连续的0去掉
            isFilter = isFilter || false;
            if (typeof Str === "string") {
                // var arr = Str.match(/(0\d{2,})|([1-9]\d+)/g);
                //"/[1-9]\d{1,}/g",表示匹配1到9,一位数以上的数字(不包括一位数).
                //"/\d{2,}/g",  表示匹配至少二个数字至多无穷位数字
                var arr = Str.match(isFilter ? /[1-9]\d{1,}/g : /\d{2,}/g);
               
                if (arr) {
                    return arr.map(function (item) {
                        return item;
                    });
                } else {
                    let curUnit = Str.indexOf("单元");
                    let curFloor = Str.indexOf("层");
                    if (curUnit != -1) {
                        return Str.slice(0, curUnit);
                    }
                    if (curFloor != -1) {
                        return Str.slice(0, curFloor);
                    }
                }
            } else {
                return [];
            }
        }
        // 验证租赁空间是否可删除
        function cancelRentSpace(contractId, houseId) {
            let params = {
                contractId: contractId,
                houseId: houseId
            };
            $http.get("/ovu-park/backstage/rental/contractBaseInfo/deleteContractHouse", {
                params: params
            }).success(function (response) {
                if (response.code === 0) {
                    return false;
                } else {
                    window.alert(response.msg);
                    return true;
                }
            })
        }
        // 提取两个数组中异同的部分 type=1不同的部分;type=2相同的部分
        function getDifferentHouse(original, newChoose, type) {
            let differentArr = [];
            let differentArrId = [];
            let sameArr = [];
            let sameStatus = false;
            let sameObj;
            let diffObj;
            if (original.length === 0) {
                if (type === 1 || type === 3) {
                    return newChoose;
                } else {
                    return original;
                }
            }
            for (let i = 0; i < newChoose.length; i++) {
                for (let j = 0; j < original.length; j++) {
                    sameStatus = false;
                    if (newChoose[i].houseId === original[j].houseId) {
                        sameObj = $.extend({
                            disabledStatus: false
                        }, newChoose[i]);
                        sameArr.push(sameObj);
                        sameStatus = true;
                        newChoose[i].disabledStatus = false;
                        break;
                    }
                }
                if (!sameStatus) {
                    diffObj = $.extend({
                        disabledStatus: true
                    }, newChoose[i]);
                    differentArr.push(diffObj);
                    newChoose[i].disabledStatus = true;
                }
            }
            if (type === 1) {
                return differentArr;
            } else if (type === 2) {
                return sameArr;
            } else if (type === 3) {
                return newChoose;
            }
        }

    });

    // 添加乙方
    app.controller('rentHousePartyCtrl', function ($scope, $rootScope, $http, $uibModalInstance, $filter, fac) {
        $scope.search = {};
        $scope.personPageModel = {};
        $scope.companyPageModel = {};
        // 获取 乙方人员列表
        $scope.searchCustomers1 = function (pageNo) {
            $scope.search.parkId = app.park.parkId;
            $.extend($scope.search, {
                currentPage: pageNo || $scope.personPageModel.currentPage || 1,
                pageSize: $scope.personPageModel.pageSize || 10
            });
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
            $.extend($scope.search, {
                currentPage: pageNo || $scope.companyPageModel.currentPage || 1,
                pageSize: $scope.companyPageModel.pageSize || 10
            });
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
            $uibModalInstance.close({
                secondParty: $scope.secondParty
            });
            $scope.reduceHis = []; //清空
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

    //添加费项
    app.controller('rentExpenditureCtrl', function ($scope, $rootScope, $http, $uibModalInstance, $filter, fac, expenditureList, expenditureCodes) {
        if (expenditureList != null && expenditureCodes != null) {
            expenditureList.forEach(function (expenditure) {
                var judge = true;
                expenditureCodes.forEach(function (code) {
                    if (judge) {
                        if (expenditure.code == code) {
                            expenditure.checked = true;
                            judge = false;
                        } else {
                            expenditure.checked = false;
                        }
                    }
                });
            });
        }
        $scope.expendituretem = {};
        $scope.expendituretem.data = expenditureList;
        $scope.expendituretem.list = expenditureList;
        // 选中费项
        $scope.selectExpenditure = function (event, x) {
            if (event.target.tagName.toLowerCase() != "td" && event.target.tagName.toLowerCase() != "tr") {
                return false;
            }
            $(event.target).parent().parent().children("tr").removeClass("success");
            $(event.target).parent().addClass("success");
        };
        // 保存
        $scope.expenditureCodes = {};
        $scope.expenditureNames = [];
        $scope.expenditureIds = [];
        $scope.save = function (expenditures) {
            expenditures.data.forEach(function (n) {
                if (n.checked || n.name == "租金") {
                    $scope.expenditureCodes += n.code + ",";
                    $scope.expenditureNames.push(n.name);
                    $scope.expenditureIds.push(n.code);
                }
            });

            $uibModalInstance.close({
                expenditureCodes: $scope.expenditureCodes,
                expenditureNames: $scope.expenditureNames,
                expenditureIds: $scope.expenditureIds
            });
            $scope.reduceHis = []; //清空
        };
        // 取消
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        }

    });

    //设置费用标准
    app.controller('setCostCtrl1', function ($scope, $rootScope, $http, $uibModalInstance, $filter, fac, expenditure, index) {
        $scope.expenditure = expenditure;
        $scope.index = index;
        $scope.view = false;
        // 保存
        $scope.save = function () {
            if (expenditure.payType == '3' && expenditure.proportion <= 0) {
                window.alert('营业额不能小于等于0！');
                return false;
            }
            if (expenditure.payType == '2' && expenditure.amountStandard <= 0) {
                window.alert('抽成金额不能小于等于0！');
                return false;
            }
            if (expenditure.payType == '11' && expenditure.amountStandard < 0) {
                window.alert('价格不能小于0！');
                return false;
            }
            $uibModalInstance.close({
                expenditure: $scope.expenditure,
                index: $scope.index
            });
            $scope.reduceHis = []; //清空
        };
        // 取消
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        }

    });

    // 租期详细设置
    app.controller('leaseDetailCtrl', function ($scope, $rootScope, $http, $filter, $uibModalInstance, fac, $location, item, leaseMsg) {
        var timeLegitimacy = true;
        var startToEnter = true;
        var endToEnter = true;

        var inProcessStart = true;
        var inProcessEnd = true;


        $scope.startTimes = [];
        $scope.endTimes = [];
        $scope.totalTimes = [];
        $scope.approachTimes = [];
        $scope.rentalList = item;
        $scope.leaseMsg = leaseMsg;

        $scope.rentalList.forEach((v, i) => {
            $scope.startTimes[i] = v.leaseStart;
            $scope.endTimes[i] = v.leaseEnd;
            $scope.approachTimes[i] = v.enterDate;
            $scope.totalTimes[i] = getTotalMonths($scope.startTimes[i], $scope.endTimes[i])
        });

        //计算租期
        $scope.getLeaseMonth = function (leaseStart, leaseEnd, enter, index, type) {
            timeLegitimacy = legalTime(leaseStart, leaseEnd, 1);
            // startToEnter = legalTime(leaseStart, enter, 2);
            // endToEnter = legalTime(enter, leaseEnd, 3);
            // 执行中合同的空间租期需要在合同租期之内
            if ($scope.leaseMsg.executingContractStatus) {
                inProcessStart = legalTime($scope.leaseMsg.start, leaseStart, 4);
                inProcessEnd = legalTime(leaseEnd, $scope.leaseMsg.end, 5);
                if (!inProcessStart) {
                    $scope.startTimes[index] = $scope.leaseMsg.start;
                }
                if (!inProcessEnd) {
                    $scope.endTimes[index] = $scope.leaseMsg.end;
                }
            }
            if (!timeLegitimacy) {
                if (type === 1) {
                    leaseEnd = leaseStart;
                    $scope.endTimes[index] = $scope.startTimes[index];
                } else if (type === 2) {
                    leaseStart = leaseEnd;
                    $scope.startTimes[index] = $scope.endTimes[index];
                }
                timeLegitimacy = true;
            }
            // if (!startToEnter || !endToEnter) {
                // $scope.approachTimes[index] = $scope.startTimes[index];
                // startToEnter = true;
                // endToEnter = true;
            // }
            $scope.totalTimes[index] = getTotalMonths(leaseStart, leaseEnd);
        };

        // 确认
        $scope.save = function (form) {
            
            if (!form.$valid) {
                window.alert('请完成必填项！');
                return false;
            }
            $scope.rentalList.forEach((v, i) => {
                v.leaseStart = $scope.startTimes[i];
                v.leaseEnd = $scope.endTimes[i];
                v.enterDate = $scope.approachTimes[i];
            });
            var starts = angular.copy($scope.startTimes);
            var ends = angular.copy($scope.endTimes);
            var status = isEqual(starts, ends);

            $uibModalInstance.close({
                detailList: $scope.rentalList,
                status: status,
                minStartTime: getMaxMin($scope.startTimes, 1),
                maxEndTime: getMaxMin($scope.endTimes, 0),
                minApproachTime: getMaxMin($scope.approachTimes, 1)
            });
        };
        // 取消
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
        // 区间日期的月数
        function getTotalMonths(start, end) {
            if (!start || !end) {
                return;
            }
            var startTime = new Date(start);
            var endTime = new Date(end);
            var months;
            months = (endTime.getFullYear() - startTime.getFullYear()) * 12;
            months -= startTime.getMonth();
            months += endTime.getMonth();
            if (startTime.getDate() >= endTime.getDate()) {
                months = (months == 0 ? 0 : months);
            } else {
                months = (months == 0 ? 1 : months + 1);
            }
            return months;
        }
        // 验证开始时间和结束时间的大小
        function legalTime(start, end, type) {
            if (!start || !end) {
                return true;
            }
            var beginDate = start;
            var endDate = end;
            var d1 = new Date(beginDate.replace("/\-/g", "\/"));
            var d2 = new Date(endDate.replace("/\-/g", "\/"));
            if (beginDate != "" && endDate != "" && d1 > d2) {
                if (type === 1) {
                    window.alert("合同租期开始时间不能大于结束时间!");
                    return false;
                } else if (type === 2) {
                    window.alert("进场时间不能小于合同租期开始时间!");
                    return false;
                } else if (type == 3) {
                    window.alert("进场时间不能大于合同租期结束时间!");
                    return false;
                } else if (type == 4) {
                    window.alert("增加空间的合同开始时间不能小于合同租期开始时间!");
                    return false;
                } else if (type == 5) {
                    window.alert("增加空间的合同结束时间不能大于合同租期结束时间!");
                    return false;
                }
            }
            if (beginDate != "" && endDate != "" && d1 === d2) {
                if (type === 4) {
                    return true;
                }
            }
            return true;
        }
        // 获取时间数组的最大最小值(格式是2019-04-10);
        function getMaxMin(arr, type) {
            var array = [];
            for (let i = 0; i < arr.length; i++) {
                let item = new Date(arr[i].replace("/\-/g", "\/"));
                array.push(item);
            }
            // debugger;
            if (type == 0) {
                return $filter("date")(Math.max(...array), "yyyy-MM-dd");
            } else if (type == 1) {
                return $filter("date")(Math.min(...array), "yyyy-MM-dd");
            }
        }

        // 判断数组中是否有不相同的项 true为有
        function isEqual(array1, array2) {
            if (!array1 || !array2) {
                return false;
            }
            if (array1.length === 0) {
                return false;
            }
            let status = false;
            let arr1 = array1.sort();
            let arr2 = array2.sort();
            for (let i = 0; i < arr1.length; i++) {
                if (arr1[i] && arr1[i + 1] && arr1[i] !== arr1[i + 1]) {
                    status = true;
                }
            }
            for (let i = 0; i < arr2.length; i++) {
                if (arr2[i] && arr2[i + 1] && arr2[i] !== arr2[i + 1]) {
                    status = true;
                }
            }
            return status;
        }
    });

    // 园区通预定管理和发布管理查看位置
    app.controller('showPositionCtrl', function ($scope, $http, $uibModalInstance, fac, positon) {
        $scope.map_lng = positon.mapLng;
        $scope.map_lat = positon.mapLat;
        $scope.unclick = positon.unclick;
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    });

    // 固定租金约定租赁条件约定租金和免租期详细设置
    app.controller('fixRentDetailCtrl', function ($scope, $rootScope, $http, $uibModalInstance, $location, $filter, fac, item) {
        $scope.detailData = item.data;
        let classify = $scope.detailData.type;
        $scope.executingContractStatus = $scope.detailData.executingContractStatus;
        $scope.houseRentalConditionStatus = $scope.detailData.houseRentalConditionStatus;
        $scope.unitStatus = [{
                name: '元/日/㎡',
                id: 1
            },
            {
                name: '元/月/㎡',
                id: 2
            },
            {
                name: '元/季度/㎡',
                id: 3
            },
            {
                name: '元/半年/㎡',
                id: 4
            },
            {
                name: '元/年/㎡',
                id: 5
            }
        ];
        $scope.payUnit = '2';

        // 租赁条件约定--计算单价和总价
        $scope.fixPriceChange = function (params, index, type) {
            let price = params;
            let taxRate;
            if (type === 1) {
                if (!price && price != 0) {
                    window.alert("固定租金单价不能为空!");
                    return false;
                }
                if (!(/^\d+(\.\d+)?$/.test(price))) {
                    window.alert("固定租金单价不能为负值!");
                    price = 0;
                }
                $scope.fixedRentSpaces[index].unitPrice = price.toFixed(2);
                $scope.fixedRentSpaces[index].unitPrice = Number($scope.fixedRentSpaces[index].unitPrice);
                $scope.fixedRentSpaces[index].totalPrice = ($scope.fixedRentSpaces[index].unitPrice * $scope.fixedRentSpaces[index].area).toFixed(2);
                $scope.fixedRentSpaces[index].totalPrice = Number($scope.fixedRentSpaces[index].totalPrice);
                taxRate = $scope.fixedRentSpaces[index].taxRate / 100;
                $scope.fixedRentSpaces[index].taxPrice = $scope.fixedRentSpaces[index].totalPrice * taxRate / (1+taxRate);
                $scope.fixedRentSpaces[index].rentPrice = $scope.fixedRentSpaces[index].totalPrice - $scope.fixedRentSpaces[index].taxPrice;
            } else if (type === 2) {
                if (!price && price !== 0) {
                    window.alert("固定租金不能为空!");
                    return false;
                }
                if (!(/^\d+(\.\d+)?$/.test(price))) {
                    window.alert("固定租金不能为负值!");
                    price = 0;
                }
                $scope.fixedRentSpaces[index].totalPrice = price.toFixed(2);
                $scope.fixedRentSpaces[index].totalPrice = Number($scope.fixedRentSpaces[index].totalPrice);
                $scope.fixedRentSpaces[index].unitPrice = ($scope.fixedRentSpaces[index].totalPrice / $scope.fixedRentSpaces[index].area).toFixed(2);
                $scope.fixedRentSpaces[index].unitPrice = Number($scope.fixedRentSpaces[index].unitPrice);
                taxRate = $scope.fixedRentSpaces[index].taxRate / 100;
                $scope.fixedRentSpaces[index].taxPrice = price * taxRate / (1+taxRate);
                $scope.fixedRentSpaces[index].rentPrice = price - $scope.fixedRentSpaces[index].taxPrice;
            }
        };

        // 免租期--起始时间的验证和计算
        $scope.freeRentTimeChange = function (curStart, oldStart, curEnd, oldEnd, index, type) {
            let limitStartToEnd = true;
            if (curStart && curEnd) {
                limitStartToEnd = legalTime(curStart, curEnd, 1);
            }
            let limitStartToLS = legalTime($scope.detailData.leaseStart, curStart, 2);
            let limitStartToLE = legalTime(curStart, $scope.detailData.leaseEnd, 2);
            let limitEndToLS = legalTime($scope.detailData.leaseStart, curEnd, 2);
            let limitEndToLE = legalTime(curEnd, $scope.detailData.leaseEnd, 2);
            if (type === 1) {
                if (!limitStartToEnd || !limitStartToLS || !limitStartToLE) {
                    $scope.freeRentStartTimes[index] = oldStart;
                }
            } else if (type === 2) {
                if (!limitStartToEnd || !limitEndToLE || !limitEndToLS) {
                    $scope.freeRentEndTimes[index] = oldEnd;
                }
            }
            // 免租天数
            $scope.freeTotalDays[index] = getTotalMonths($scope.freeRentStartTimes[index], $scope.freeRentEndTimes[index], 2);
        };

        $scope.checkBox = function (status) {
           
        };
        let params = {
            contractId: $scope.detailData.contractId,
            startDate: $scope.detailData.leaseStart,
            endDate: $scope.detailData.leaseEnd
        };
        $http.post("/ovu-park/backstage/rental/contractBaseInfo/queryLeaseSpace", params, fac.postConfig).success(function (resp) {
            if (resp.code === 0) {
                if (classify === 1) {
                    if ($scope.detailData.houseRentalConditions.length === 0) {
                        $scope.fixedRentSpaces = resp.data;
                    } else {
                        $scope.fixedRentSpaces = getDifferentHouse($scope.detailData.houseRentalConditions, resp.data, 2);
                    }
                    if ($scope.executingContractStatus) {
                        if ($scope.houseRentalConditionStatus[$scope.detailData.index] == 1) {
                            $scope.fixedRentSpaces = getDifferentHouse($scope.detailData.beLeftRentHouses, $scope.fixedRentSpaces, 2);
                            $scope.detailData.newAddRentHouses = checkAddContractLease($scope.detailData.newAddRentHouses, $scope.detailData.leaseStart, $scope.detailData.leaseEnd);
                            $scope.fixedRentSpaces.push.apply($scope.fixedRentSpaces, $scope.detailData.newAddRentHouses);
                        } else {
                            $scope.fixedRentSpaces = $scope.detailData.houseRentalConditions;
                        }
                    }
                    let taxRate;
                    $scope.fixedRentSpaces.forEach((value, index) => {
                        !value.contractHouseId && (value.contractHouseId = value.houseId);
                        value.rentModel = 1;
                        if (!value.unitPrice) {
                            value.leaseStart = $scope.detailData.leaseStart;
                            value.leaseEnd = $scope.detailData.leaseEnd;
                            value.taxRate = $scope.detailData.taxRate;
                            value.unitPrice = $scope.detailData.unitPrice;
                            if (value.unitPrice) {
                                value.totalPrice = (value.unitPrice * value.area).toFixed(2);
                                value.unitPrice = value.unitPrice.toFixed(2);
                                value.unitPrice = Number(value.unitPrice);
                                value.totalPrice = Number(value.totalPrice);
                                taxRate = value.taxRate / 100;
                                value.taxPrice = value.totalPrice * taxRate / (1+taxRate);
                                value.rentPrice = value.totalPrice - value.taxPrice;
                            }
                        }
                    })
                } else { // 无此类型了
                    let rentModel = classify - 1;
                    $scope.freeRentStartTimes = [];
                    $scope.freeRentEndTimes = [];
                    $scope.freeTotalDays = [];
                    $scope.freeRentSpaces = $scope.detailData.houseFreePeriods.length === 0 ? resp.data : $scope.detailData.houseFreePeriods;
                    $scope.freeRentSpaces.forEach((value, index) => {
                        value.rentModel = rentModel;
                        if (value.freeDateStart) {
                            $scope.freeRentStartTimes[index] = $filter('date')(value.freeDateStart, 'yyyy-MM-dd');
                            $scope.freeRentEndTimes[index] = $filter('date')(value.freeDateEnd, 'yyyy-MM-dd');
                            $scope.freeTotalDays[index] = value.days;
                            value.isFree = (value.isFree === "1" ? true : false);
                        } else {
                            $scope.freeRentStartTimes[index] = $scope.detailData.freeStart;
                            $scope.freeRentEndTimes[index] = $scope.detailData.freeEnd;
                            $scope.freeTotalDays[index] = $scope.detailData.freeDays;
                            value.isFree = true;
                        }
                    })
                }
            }
        });

        $scope.save = function (form) {
            let fixedUnitEmpty = false;
            if (!form.$valid) {
                window.alert('请完成必填项!');
                return false;
            }
            if (classify === 1) {
                let allTotalPrice = 0;
                let allTotalArea = 0;
                let averagePrice = 0;
                $scope.fixedRentSpaces.forEach((value, index) => {
                    if (!value.unitPrice) {
                        fixedUnitEmpty = true;
                    }
                    allTotalPrice += value.totalPrice;
                    allTotalArea += value.area;
                });
                if (fixedUnitEmpty) {
                    window.alert("请设置合同的固定租金单价!");
                    return false;
                }
                averagePrice = (allTotalPrice / allTotalArea);
                $uibModalInstance.close({
                    type: classify,
                    index: $scope.detailData.index,
                    obj: {
                        unitPrice: averagePrice,
                        totalPrice: allTotalPrice,
                        unitStatus: $scope.detailData.unitStatus,
                        totalArea: allTotalArea
                    },
                    detailSetup: JSON.stringify($scope.fixedRentSpaces)
                });
            } else { // 无此类型了
                let minStart = $scope.freeRentStartTimes[0];
                let maxEnd = $scope.freeRentEndTimes[0];
                let maxToMinDays = $scope.freeTotalDays[0];

                if ($scope.freeRentStartTimes.length > 1) {
                    minStart = getMaxMin($scope.freeRentStartTimes, 2);
                    maxEnd = getMaxMin($scope.freeRentEndTimes, 1);
                    maxToMinDays = Math.max.apply(Math, $scope.freeTotalDays);
                }
                $scope.freeRentSpaces.forEach((value, index) => {
                    value.contractHouseId = value.id;
                    value.isFree = value.isFree ? '1' : '0';
                    value.freeDateStart = $scope.freeRentStartTimes[index];
                    value.freeDateEnd = $scope.freeRentEndTimes[index];
                    value.days = $scope.freeTotalDays[index];
                });
                $uibModalInstance.close({
                    type: classify,
                    obj: {
                        start: minStart,
                        end: maxEnd,
                        days: maxToMinDays
                    },
                    detailSetup: JSON.stringify($scope.freeRentSpaces)
                });
            }
        };

        $scope.cancel = function (params) {
            $uibModalInstance.dismiss('cancel');
        };

        // 区间日期的月数
        function getTotalMonths(start, end, type) {
            if (!start || !end) {
                return;
            }
            var startTime = new Date(start);
            var endTime = new Date(end);
            var months;
            var days;
            months = (endTime.getFullYear() - startTime.getFullYear()) * 12;
            months -= startTime.getMonth();
            months += endTime.getMonth();
            if (startTime.getDate() >= endTime.getDate()) {
                months = (months == 0 ? 0 : months);
            } else {
                months = (months == 0 ? 1 : months + 1);
            }

            days = (endTime.getTime() - startTime.getTime()) / 1000 / 60 / 60 / 24 + 1;

            if (type === 1) {
                return months;
            } else if (type === 2) {
                return days;
            }
        }

        // 验证时间的大小  type=1表示比较开始和结束时间;type=2表示比较开始时间或结束时间和合同租期;
        function legalTime(start, end, type) {
            if (!start || !end) {
                return;
            }
            var beginDate = start;
            var endDate = end;
            var d1 = new Date(beginDate.replace("/\-/g", "\/"));
            var d2 = new Date(endDate.replace("/\-/g", "\/"));
            if (beginDate != "" && endDate != "" && d1 > d2) {
                if (type === 1) {
                    window.alert("开始时间不能大于结束时间！");
                } else if (type === 2) {
                    window.alert("开始时间或结束时间不能超出合同租期！");
                } else {

                }
                return false;
            }
            return true;
        }

        // 获取时间数组的最大最小值(格式是2019-04-10);
        function getMaxMin(arr, type) {
            var array = [];
            for (let i = 0; i < arr.length; i++) {
                let item = new Date(arr[i].replace("/\-/g", "\/"));
                array.push(item);
            }
            // debugger;
            if (type == 1) {
                return $filter("date")(Math.max(...array), "yyyy-MM-dd");
            } else if (type == 2) {
                return $filter("date")(Math.min(...array), "yyyy-MM-dd");
            }
        }

        // 提取两个数组中异同的部分 type=1不同的部分;type=2相同的部分  
        function getDifferentHouse(original, newChoose, type) {
            let differentArr = [];
            let sameArr = [];
            let sameStatus = false;
            let sameObj;
            let diffObj;
            let contractHouseId;
            let houseId;
            for (let i = 0; i < newChoose.length; i++) {
                contractHouseId = newChoose[i].contractHouseId || newChoose[i].houseId;
                for (let j = 0; j < original.length; j++) {
                    sameStatus = false;
                    houseId = original[j].contractHouseId || original[j].houseId;
                    if (contractHouseId == houseId) {
                        sameObj = $.extend({}, newChoose[i], original[j]);
                        sameArr.push(sameObj);
                        sameStatus = true;
                        break;
                    }
                }
                if (!sameStatus) {
                    diffObj = $.extend({}, newChoose[i]);
                    differentArr.push(diffObj);
                }
            }
            if (type === 1) {
                return differentArr;
            } else {
                return sameArr;
            }
        }

        // 验证新增空间的合同时间是否在当前的合同租期之内, 返回合同租期内的新增空间
        function checkAddContractLease(newHouse, leaseStart, leaseEnd) {
            let house = [];
            newHouse.forEach((value, index) => {
                let start = legalTime(value.leaseStart, leaseEnd);
                let end = legalTime(leaseStart, value.leaseEnd);
                if (start && end) {
                    house.push(value);
                }
            });
            return house;
        }
    });
       //查看人群
       app.controller('showknowledgePersonCtrl', function ($scope, $http, fac, $uibModalInstance, sub) {
             
        $scope.search = {}
        $scope.item = sub || {};  
        $scope.personList=sub.personList
        $scope.show=sub.show

        //关闭       
        $scope.cancel = function () { 
            $uibModalInstance.dismiss('cancel');
        };
    });
    //应急报事
    app.controller('workunitEmergenModalCtrl', function ($rootScope, $scope, $http, $uibModal, $uibModalInstance, $filter, fac, item) {

        $scope.item = item;
        $scope.groudList_e = [];
        $scope.groudList_m = []
        $scope.selectParks = [];
        $scope.showParkMore = false
        $scope.exec = {}
        $scope.manage = {}
        item.EVENT_TYPE = item.EVENT_TYPE || 0;
        item.IS_MULTIPARK=item.IS_MULTIPARK || 2
        function getNode(v) {
            if (v.parkType == 1) {
                item.PARK_ID = v.id;
                item.PARK_NAME = v.parkName;

            } else {
                v.nodes && v.nodes.forEach(node => {
                    getNode(node)
                })
            }
        }

        var parkList = []
    
        if (!item.ID) {
           
            // if($rootScope.parkTree[0].nodes.length==1){             
            //      //如果当前用户只挂载一个项目 
            //      $scope.hasOnlyPark=true
            //     $rootScope.parkTree[0].nodes.forEach(v=>{
            //         getNode(v)
            //     })           
            // }
            $rootScope.execTreeNode($rootScope.parkTree, function (v) {
                if (v.parkType == 1) {
                    parkList.push(v)

                }
            })
            if (parkList.length == 1) {
                //如果当前用户只挂载一个项目
                $scope.hasOnlyPark = true
                item.PARK_ID = parkList[0].id;
                item.PARK_NAME = parkList[0].parkName;
            }
        }
        $scope.item.REPORT_TIME = $scope.item.REPORT_TIME || moment().format('YYYY-MM-DD HH:mm:ss');
        item.pics = item.PICTURE ? item.PICTURE.split(",") : [];

        $scope.locations = [{
            parkId: item.PARK_ID,
            stageId: item.STAGE_ID,
            buildId: item.FLOOR_ID,
            unitNo: item.unit_no,
            groundNo: item.ground_no,
            houseId: item.HOUSE_ID
        }];

        $scope.clickMultipark = function (item) {
            if (item.IS_MULTIPARK == 1) {   //多项目
                item.PARK_ID = null;
                item.PARK_NAME = null;
                item.EVENT_TYPE = null;
                item.is_equip = 2;
                item.STAGE_ID = null;
                item.FLOOR_ID = null;
                item.unit_no = null;
                item.ground_no = null;
                item.HOUSE_ID = null;
                item.CUSTOMER_ID = null;
                item.CUSTOMER_NAME = null;
                item.CUSTOMER_ADDR = null;
                item.CUSTOMER_PHONE = null;
                item.EVENT_ADDR = null;
                item.equipment_id = null;
                item.equipment_name = null;
            } else if (item.IS_MULTIPARK == 2) {

            }
        };
        $scope.choosePark = function (arr) {
            
            var array = $.extend([], $scope.selectParks)
            var modal = $uibModal.open({
                animation: false,
                size: 'lg',
                templateUrl: '/common/modal.select.parks.html',
                controller: 'parksSelectorCtrl'
                , resolve: {
                    data: function () {
                        return {
                            parks: arr
                        };
                    }
                }
            });
            modal.result.then(function (data) {
               

                data.forEach(function (park) {
                    var index
                    if ($scope.selectParks.length) {
                        index = $scope.selectParks.findIndex(v => {
                            return v.id == park.id
                        })
                    }
                    if (index < 0) {
                        $scope.selectParks.push({ id: park.id, parkName: park.parkName, fullPath: park.fullPath, checked: true });
                    }




                });
               


            }, function () {
                $scope.selectParks = array

            });


        };
        $scope.delPark = function (park, parks) {
            park.checked = false;
            parks.splice(parks.indexOf(park), 1);
        }

        //选择业主
        $scope.selectOwner = function () {
            if (!item.PARK_ID) {
                alert('请选择项目！');
                return;
            }
            var modal = $uibModal.open({
                animation: false,
                size: 'lg',
                templateUrl: '/common/modal.select.owner.html',
                controller: 'ownerSelectorCtrl'
                , resolve: { data: function () { return { parkId: item.PARK_ID }; } }
            });
            modal.result.then(function (data) {
                if (data) {
                    $scope.item.CUSTOMER_ID = data.id;
                    $scope.item.CUSTOMER_NAME = data.name;
                    $scope.item.CUSTOMER_PHONE = data.phone;
                    $scope.item.CUSTOMER_ADDR = data.address;
                    $scope.search={
                        currentPage:  1,
                        pageSize:  100,
                        ownerId:data.id
                    };
                    fac.getPageResult("/ovu-base/system/parkHouse/listHousePersonByGrid", $scope.search, function (data) {
                       if(data.data && data.data.length){
                        var house=data.data[0]
                       
                        $scope.locations[0] = {
                            PARK_ID: house.parkId,
                            stageId: house.stageId,
                            buildId: house.buildId,
                            unitNo: house.unitNo,
                            groundNo: house.groundNo,
                            houseId: house.id,
                            parkId: house.parkId,
                            PARK_NAME: item.PARK_NAME,
                            parkName:item.PARK_NAME
                        }
                      
                       }
                     
                    });

                }
            });
        }

        //
        $scope.onOwnerCallback = function (item) {
            if (!item.PARK_ID) {
                delete $scope.item.CUSTOMER_ID;
                delete $scope.item.CUSTOMER_NAME;
                delete $scope.item.CUSTOMER_PHONE;
                delete $scope.item.CUSTOMER_ADDR;
            }
        }
        function getGroup(deptId, flag) {
            $http
                .post(
                    "/ovu-pcos/pcos/newknowledge/group/list",
                    {
                        deptId: deptId
                    },
                    fac.postConfig
                )
                .success(function (resp) {
                    if (resp.code == 0) {
                        // msg(resp.msg);
                        if (flag == 1) {
                            $scope.groudList_e = resp.data || []
                        } else {
                            $scope.groudList_m = resp.data || []
                        }


                    } else {
                        alert(resp.msg);
                    }
                });
        }
        $scope.execCallback = function (node) {

            //获取分组


            getGroup(node.deptId, 1)
        }
        $scope.manageCallback = function (node) {
            getGroup(node.deptId, 2)
        }



        $scope.chooseEquipment = function (task) {
            var modal = $uibModal.open({
                animation: false,
                size: 'lg',
                templateUrl: '/view/equipment/selector.equipment.html',
                controller: 'equipmentSelectorCtrl'
                , resolve: { data: function () { return { parkId: task.PARK_ID, equipment_id: task.equipment_id }; } }
            });
            modal.result.then(function (data) {
               
                task.equipment_id = data.id;
                task.equipment_name = data.name;
               
                
            });
        }
        $scope.clearManage=function(){
            item.MANAGE_PERSON_NAME = null
            item.MANAGE_PERSON_ID = null
            item.isGroup='0'
          }
        $scope.chooseManagePerson = function (item) {
            var managePerson = {};
            if (item.MANAGE_PERSON_NAME) {
                managePerson = {
                    name: item.MANAGE_PERSON_NAME,
                    id: item.MANAGE_PERSON_ID
                }
            } else {
                managePerson = {}
            }

            var modal = $uibModal.open({
                animation: false,
                size: 'lg',
                templateUrl: '/view/workunit/selector.managePerson.html',
                controller: 'managePersonSelectorCtrl',
                resolve: {
                    data: function () {
                        return {
                            managePerson: managePerson
                        }
                    }
                }
            });
            modal.result.then(function (data) {
                item.MANAGE_PERSON_NAME = data.name
                item.MANAGE_PERSON_ID = data.id
            
            });
        }

     
        //房屋选择
        $scope.selectHouse = function (index, item) {

            var modal = $uibModal.open({
                animation: false,
                size: 'max',
                templateUrl: '../common/modal.select.housePerson.html',
                controller: 'housePersonSelectorCtrl',
                resolve: {
                    data: function () {
                        return {
                            data: { index: index, item: item }

                        };
                    }
                }
            });
            modal.result.then(function (house) {
                if (house) {
                    $scope.locations[index] = {
                        parkId: house.parkId,
                        stageId: house.stageId,
                        buildId: house.buildId,
                        unitNo: house.unitNo,
                        groundNo: house.groundNo,
                        houseId: house.id
                    };
                   
                }
            });
        };
        //保存
        $scope.save = function (form, item) {
         
            
       
            form.$setSubmitted(true);
            if (!form.$valid) {
                return;
            }

            if (item.EVENT_TYPE == 0 && item.IS_MULTIPARK == 2) {
                //单项目
                if (!$scope.locations.every(function (n) {
                    return n.parkId
                })) {
                    alert('请选择项目！');
                    return;
                } else {
                    //紫缘酒店必须选到楼栋那一级
                    if (app.domain.orgType == 'hotel') {
                        for (let i = 0; i < $scope.locations.length; i++) {
                            if (!$scope.locations[i].buildId) {
                                alert('请选择楼栋！');
                                return;
                            }
                        }
                    }
                }


            }
             

            if (item.EVENT_TYPE == 0) {
                //公共报事
                item.is_equip = 2
                if ($scope.locations.length > 1) {
                    item.PARK_GROUP = $scope.locations.reduce(function (ret, n) { ret.push(n.parkId); return ret }, []).join();
                    item.locationsJson = JSON.stringify($scope.locations);
                } else {
                    delete item.PARK_GROUP;
                    var loc1 = $scope.locations[0];
                    item.PARK_ID = loc1.parkId;
                    item.STAGE_ID = loc1.stageId;
                    item.FLOOR_ID = loc1.buildId;
                    item.unit_no = loc1.unitNo;
                    item.ground_no = loc1.groundNo;
                    item.HOUSE_ID = loc1.houseId;
                }
                if ($scope.item.IS_MULTIPARK == 1) {

                    if ($scope.selectParks.length == 0) {
                        alert('请选择项目')
                        return
                    }
                    var ids = $scope.selectParks.reduce(function (ret, n) {
                        n.checked && ret.push(n.id);
                        return ret;
                    }, []);
                    item.parkIds = JSON.stringify(ids)
                    //多项目
                    if (item.execGroupId && (!item.manageGroupId && !item.MANAGE_PERSON_NAME)) {
                        alert('请选择管理人！');
                        return;

                    }
                    if ((item.manageGroupId || item.MANAGE_PERSON_NAME) && !item.execGroupId) {
                        alert('请选择执行人！');
                        return;

                    }

                } else {
                    item.parkIds && delete item.parkIds
                    $scope.selectParks = []
                }



                item.CUSTOMER_ID && delete item.CUSTOMER_ID;
                item.CUSTOMER_NAME && delete item.CUSTOMER_NAME;
                item.CUSTOMER_PHONE && delete item.CUSTOMER_PHONE;
                item.CUSTOMER_ADDR && delete item.CUSTOMER_ADDR;
                item.equipment_name && delete item.equipment_name
                item.equipment_id && delete item.equipment_id
                if ($scope.item.IS_MULTIPARK == 2) {
                    item.parkIds && delete item.parkIds

                }

            }
            if (item.EVENT_TYPE == 1) {
                //    代业主报事
                item.equipment_name && delete item.equipment_name
                item.equipment_id && delete item.equipment_id
                item.IS_MULTIPARK && delete item.IS_MULTIPARK
                item.parkIds && delete item.parkIds
                item.manageGroupId && delete item.manageGroupId
                item.execGroupId && delete item.execGroupId
                item.MANAGE_PERSON_ID && delete item.MANAGE_PERSON_ID
                item.isGroup && delete item.isGroup
                item.MANAGE_PERSON_NAME && delete $scope.item.MANAGE_PERSON_NAME
                item.is_equip = 2

            }
            if (item.EVENT_TYPE == 3) {
                //设备设施
                item.CUSTOMER_ID && delete item.CUSTOMER_ID;
                item.CUSTOMER_NAME && delete item.CUSTOMER_NAME;
                item.CUSTOMER_PHONE && delete item.CUSTOMER_PHONE;
                item.CUSTOMER_ADDR && delete item.CUSTOMER_ADDR;
                item.IS_MULTIPARK && delete item.IS_MULTIPARK
                item.parkIds && delete item.parkIds
                item.manageGroupId && delete item.manageGroupId
                item.execGroupId && delete item.execGroupId
                item.MANAGE_PERSON_ID && delete item.MANAGE_PERSON_ID
                item.isGroup && delete item.isGroup
                item.MANAGE_PERSON_NAME && delete item.MANAGE_PERSON_NAME
                item.is_equip = 1;

            }


            item.PICTURE = item.pics.join(",")
            if(item.EXEC_PERSON_NAME==''){
                delete item.EXEC_PERSON_NAME
            }
            if(item.MANAGE_PERSON_NAME==''){
                delete item.MANAGE_PERSON_NAME
            }
            if(item.ACCEPT_TIME==''){
                delete item.ACCEPT_TIME
            }
            if( $scope.locations.length){
               
                item.PARK_ID=$scope.locations[0].parkId || item.PARK_ID
                item.STAGE_ID=$scope.locations[0].stageId
               item.FLOOR_ID=$scope.locations[0].buildId
               item.UNIT_NUM=$scope.locations[0].unitNo
               item.GROUND_NUM=$scope.locations[0].groundNo
                item.HOUSE_ID=$scope.locations[0].houseId

            }
             
          //报事位置和详细位置填其一
          if(item.IS_MULTIPARK!=1 && item.is_equip!=1){
            if(!item.EVENT_ADDR){
                if(!item.FLOOR_ID){
                    alert('请选择报事位置');
                   
                    return;
                }
            }
        }
           

            $http.post("/ovu-pcos/pcos/workunit/saveEmergenWorkunit.do", item, fac.postConfig).success(function (data, status, headers, config) {
                if (data.success) {
                    $uibModalInstance.close();
                    msg("保存成功!");
                } else {
                    layer.open({
                        type: 1,
                        skin: 'layerContent', //样式类名
                        closeBtn: 1, //不显示关闭按钮

                        content: data.msg
                    });


                }
            })
        }

    });
   
    //人员选择器（设置执行人管理人协助人）
   app.controller('personWorkUnitSelectorCtrl', function ($scope, $rootScope, $http, $uibModalInstance, $filter, fac, data) {

    $scope.data = data;
    $scope.tabs = [{
        search: {},
        pageModel: {}
    }, {
        search: {},
        pageModel: {}
    }];


    $scope.exePerson = data.exePerson || []; //执行人
    $scope.assPersons = data.assPersons || []; //协助人
    $scope.managePerson = data.managePerson || {}; //管理人
    $scope.remark = data.remark || '';
    // $scope.readOnlyExe=false
    // $scope.readOnlyAss=false
    // data.workTypeId &&  $http
    // .post("/ovu-pcos/pcos/workunitauthority/query", {
    //     deptId: data.deptId,
    //     workTypeId: data.workTypeId,
    //     parkId: data.parkid,
    // })
    // .success(function (resp) {
    //     if (resp.data && resp.data.length) {
    //         if(resp.data[0].isOutSourcing==1){
    //             $scope.isOut=true
    //             if(data.exePerson.length){
    //                 //当授权给外包公司时，执行人只读
    //                 $scope.readOnlyExe=true
                  
    //             }
    //             if(data.assPersons.length){
    //                 //当授权给外包公司时，协助人只读
    //                 $scope.readOnlyAss=true
    //                return
    //             }
    //         }else{
    //             $scope.isOut=false
    //         }
            
            
    //     }
    // });
    function find(pageNo, search, pageModel) {
        $.extend(search, {
            currentPage: pageNo || pageModel.currentPage || 1,
            pageSize: pageModel.pageSize || 10
        });
        fac.getPageResult("/workunit/sys/queryPerson_mute", search, function (data) {
            angular.extend(pageModel, data);
        });
    }
    //查询本部门相关的人员
    $scope.find0 = function (pageNo) {
        find(pageNo, $scope.tabs[0].search, $scope.tabs[0].pageModel);
    };
      //查询 物业部门的人员
      $scope.find1 = function (pageNo) {
        find(pageNo, $scope.tabs[1].search, $scope.tabs[1].pageModel);
    };

    $http.get("/ovu-base/system/dept/getDeptInfo?deptId=" + data.deptId).success(function (resp) {
        if (resp.code == 0) {
            $scope.tabs[0].search.deptName = resp.data.deptName;
            $scope.tabs[0].search.authDeptId = data.deptId;
            $scope.find0(1);
        }
    });

    if (data.parkId) {
        //管理人可以先择物业公司的
        $http.get("/ovu-base/system/dept/getDeptInfo?parkId=" + data.parkId).success(function (resp) {
            if (resp.code == 0 && resp.data.id != data.deptId) {
                $scope.tabs[1].search.deptName = resp.data.deptName;
                $scope.tabs[1].search.authDeptId = resp.data.id;
                $scope.find1(1);
            }
        })
    }
    
    //添加执行人（多人、!=协助人&!=管理人）
    $scope.setExecPerson = function (item) {
       
       
      
        
      
        if ($scope.managePerson == item) {
            $scope.managePerson = {};
        }
        var assPerson = $scope.assPersons.find(function (n) {
            return n.id == item.id
        });
        assPerson && $scope.assPersons.splice($scope.assPersons.indexOf(assPerson), 1);
        var exePerson = $scope.exePerson.find(function (n) {
            return n.id == item.id
        });
        !exePerson && $scope.exePerson.push(item);
      
    };

    //添加管理人（单人、!=执行人）
    $scope.setManagePerson = function (item) {
        
        var exePerson = $scope.exePerson.find(function (n) {
            return n.id == item.id
        });
        exePerson && $scope.exePerson.splice($scope.exePerson.indexOf(exePerson), 1);
        var assPerson = $scope.assPersons.find(function (n) {
            return n.id == item.id
        });
        assPerson && $scope.assPersons.splice($scope.assPersons.indexOf(assPerson), 1);
        $scope.managePerson = item;
    };
 
    //添加协助人（多人、!=执行人） (最多可添加4个)
    $scope.addAssiPerson = function (item) {
       
        if($scope.assPersons.length && $scope.assPersons.length==4){
            alert('最多只可设置4个协助人')
            return
          }
        var exePerson = $scope.exePerson.find(function (n) {
            return n.id == item.id
        });

        exePerson && $scope.exePerson.splice($scope.exePerson.indexOf(exePerson), 1);
        var assPerson = $scope.assPersons.find(function (n) {
            return n.id == item.id
        });
        !assPerson && ($scope.assPersons.push(item));
    };

    $scope.existAssis = function (item) {
        return $scope.exePerson.find(function (n) {
            return n.id == item.id
        })
    };
    $scope.assAssis = function (item) {
        return $scope.assPersons.find(function (n) {
            return n.id == item.id
        })
    };
    //删除
    $scope.del = function (persons, person) {
        persons.splice(persons.indexOf(person), 1);
    };
   
   

    //确定
    $scope.save = function () {
        // 最多可以设置多个执行人，最少设置1人
                   // 最多可以设置4个协助人，可为空
                     // 管理人有且仅有1个
        if (!$scope.exePerson.length && (data.setType=='zx' || data.setType=='xz')) {
            alert("请选择执行人！");

        } else if (!$scope.managePerson.id && data.setType=='gl') {
            alert("请选择管理人！");

        } else {
            var execids = [];
            $scope.exePerson.length && $scope.exePerson.forEach(function (item) {
                execids.push(item.id);
            });
            var asscids = [];
            $scope.assPersons.length && $scope.assPersons.forEach(function (item) {
                asscids.push(item.id);
            });
            $uibModalInstance.close({
                execId: execids.join(),
                assistanceIds: asscids.join(),
                manageId: $scope.managePerson.id,
                // remark: $scope.remark
            });
        }
    };
    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
});


})();
