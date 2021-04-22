// 集团版培训管理 
(function () {
    "use strict";
    var app = angular.module("angularApp");
    app.controller('trainGroupCtrl', function ($scope, $rootScope, $http, $filter, $uibModal, fac) {
        document.title = "培训管理";
        $scope.pageModel = {};
        $scope.search={};
        app.modulePromiss.then(function () {
            $scope.find(1);
        });

        // 集团版type=1 项目版 type=0;
        $scope.find = function (pageNo) {
            $scope.type = 1;
            $.extend($scope.search, {
                currentPage: pageNo || $scope.pageModel.currentPage || 1,
                pageSize: $scope.pageModel.pageSize || 10,
                type: $scope.type,
            });
            fac.getPageResult("/ovu-pcos/pcos/newknowledge/train/list", $scope.search, function (data) {
                $scope.pageModel = data;
                $scope.pageModel.data && $scope.pageModel.data.forEach(function (v) {
                    //  v.attachment=v.attachment.split(",") || [];
                    v.fileList = [];
                    v.attachmentPdfPath = v.attachmentPdfPath.split(",") || [];
                    v.attachmentName = v.attachmentName.split(",") || [];

                    // v.attachmentPdfPath.forEach(function(v){
                    //     v.fileList.push({path:v});
                    // })
                    v.attachmentName.forEach(function (name, index) {
                        v.fileList.push({
                            name: name,
                            path: v.attachmentPdfPath[index]
                        });
                    })
                })
            });

        };

       

        //批量删除培训
        $scope.delAll = function () {
            var ids = $scope.pageModel.list.reduce(function (ret, n) {
                n.checked && ret.push(n.id);
                return ret
            }, []);
            del(ids);
        };
        //删除培训
        $scope.del = function (item) {
            del([item.id]);

        }

        function del(ids) {
            confirm("确认删除选中的" + ids.length + "条记录?", function () {
                $http.post("/ovu-pcos/pcos/newknowledge/train/delete.do", {
                    "ids": ids.join()
                }, fac.postConfig).success(function (resp) {
                    if (resp.code == "0") {
                        $scope.find();
                        msg(resp.msg);
                    } else {
                        alert(resp.msg);
                    }
                })
            });
        }
        //新增修改模态框
        $scope.showEditModal = function (task) {
            var copy = angular.extend({}, task);
            copy = angular.extend(copy, {
                type: $scope.type,
              
            });
            var url = "./knowledgeGroup/train/modal.muleditTrain.html";
            var modal = $uibModal.open({
                animation: false,
                size: 'max',
                templateUrl: url,
                controller: 'editTrainCtrl',
                resolve: {
                    task: copy
                }
            });
            modal.result.then(function () {
                $scope.find();
            }, function () {
                console.info('Modal dismissed at: ' + new Date());
            });
        }
        //浏览次数
        $scope.viewed = function (task) {
            var copy = angular.extend({}, task);
            copy = angular.extend(copy, {});
            var modal = $uibModal.open({
                animation: false,
                size: 'max',
                templateUrl: './knowledge/train/modal.viewed.html',
                controller: 'viewedCtrl',
                resolve: {
                    task: copy
                }
            });
            modal.result.then(function () {
                $scope.find();
            }, function () {
                console.info('Modal dismissed at: ' + new Date());
            });

        }

    });

    app.controller('editTrainCtrl', function ($scope, $timeout, $uibModalInstance, $http, fac, task) {
        var vm = $scope.vm = this;
        $scope.parkList = {};
        $scope.shows = "";
        $scope.show = ""
        $scope.parks = [];
        $scope.parkLength = 0;
        $scope.treeDataList = [];
        $scope.search = {};
        $scope.fileList = []; //上传文件数组
        $scope.depts = []; //要显示的部门数
        $scope.item = {};
        var parkId=task.parkId
       if(task.type==0){
           
        loadDeptTree();
       }

        //编辑
        if (fac.isNotEmpty(task.id)) {
            $http.get("/ovu-pcos/pcos/newknowledge/train/detail?id=" + task.id).success(function (data, status, headers, config) {
                angular.extend($scope.item, data.data);
                var parkList = $scope.item.parkNames.split(",");
                var parkIdList = $scope.item.parkIds.split(",");
                var deptList = $scope.item.deptNames.split(",");
                var deptIdList = $scope.item.deptIds.split(",");
                $scope.parkLength = parkList.length;
                $scope.item.attachmentName = $scope.item.attachmentName.split(',');
                $scope.item.attachmentPath = $scope.item.attachmentPath.split(',')
                $scope.item.attachmentName.forEach(function (name, index) {
                    $scope.fileList.push({
                        name: name,
                        path: $scope.item.attachmentPath[index]
                    });
                })

                //需要将id也放入，以便后面的判断
                var i = 0;
                var j = 0
                parkList.forEach(function (parkName) {
                    // $scope.parkList.forEach(function(v){
                    //     if(v.parkName==parkName){
                    //          v.checked=true
                    //     }
                    //    })
                    var temp = {};
                    temp.parkName = parkName;
                    temp.id = parkIdList[i];
                    $scope.parks.push(temp);


                    i++;
                })
                deptList.forEach(function (depName) {
                    // $scope.parkList.forEach(function(v){
                    //     if(v.parkName==parkName){
                    //          v.checked=true
                    //     }
                    //    })
                    var temp = {};
                    temp.text = depName;
                    temp.did = deptIdList[j];
                    $scope.depts.push(temp);

                    j++;
                })
                loadDeptTree();

            })
        }

        $scope.accepts = [".pdf",".doc", ".docx", ".xlsx", ".pdf", ".pptx"];
        //删除文件

        $scope.delFile = function (list, item) {
            var index = list.findIndex(function (v) {
                return (v.name == item.name)
            });
            list.splice(index, 1);
        }



        $scope.checkpark = function (park, data) {
            park.checked = !park.checked;

            if (park.checked) {
                $scope.parks.push({
                    id: park.id,
                    parkName: park.parkName
                });
            } else {
                $scope.parks.forEach(function (p) {
                    if (park.id == p.id) {
                        $scope.parks.splice($scope.parks.indexOf(p), 1);
                    }
                })
               
            }
           
            loadDeptTree();


        }
      
        //加载部门树
        function loadDeptTree() {
           
            var parkIds = [];
            if(task.type==0){
            //项目版
            parkIds=parkId.split(',');
            }else{
                if ($scope.parks.length == 0) {
                    $scope.treeData = [];
                    $scope.depts = [];
                    $scope.pageModel = {};
                    $scope.persons = [];
                    return;
                }
                $scope.parks.forEach(function (park) {
                    parkIds.push(park.id);
                });
            }
            
           

            $scope.treeData = [];
            $http.post("/ovu-pcos/pcos/worklogs/multi/worklogpermission/detptree.do", {
                parkId: parkIds.join()
            }, fac.postConfig).success(function (resp) {
                var data = resp.data || [];
                data.forEach(function (v) {
                    $scope.treeData.push(v[0]);
                });
                //带入时进行选中
                if($scope.depts.length>0){
                    $scope.treeDataFlat=fac.treeToFlat($scope.treeData);
                    var tmpDepts=[];
                    $scope.depts.forEach(function (dept) {
                        var node = $scope.treeDataFlat.find(function(n){return n.did == dept.did});
                        if(node){
                            tmpDepts.push(dept);
                            node.state = node.state||{};
                            node.state.checked =true;
                            expandFather(node);
                        }
                    })

                    $scope.depts=tmpDepts;
                }
            });
            function expandFather(node) {
                var father = $scope.treeDataFlat.find(function (n) {
                    return n.did == node.pdid
                });
                if (father) {
                    father.state = father.state || {};
                    father.state.expanded = true;
                    expandFather(father);
                }
            }
        }
        //全选项目

        $scope.checkparkAll = function (data) {

            data.checked = !data.checked;
            $scope.parks = [];
            if (data.checked) {
                data.list.forEach(function (item) {
                    item.checked = true;

                    $scope.parks.push({
                        id: item.id,
                        parkName: item.parkName
                    });
                })
            } else {
                data.list.forEach(function (item) {
                    item.checked = false;
                })
            }
            loadDeptTree();
        }



        //删除项目
        $scope.del = function (parks, p) {
            $scope.parkList.data && $scope.parkList.data.forEach(function (v) {
                (v.id == p.id) && (v.checked = false)
            })
            p.checked = false;
            var index = parks && parks.findIndex(function (n) {
                return n.id == p.id
            })
            parks.splice(index, 1);
            $scope.parks = parks;
            var ids = $scope.parks.reduce(function (ret, n) {
                ret.push(n.id);
                return ret;
            }, []).join();
            $scope.tree(ids);
            if (ids == '') {
                $scope.depts = [];
            }

        };

        //项目信息列表
        $scope.findParks = function (pageNo) {
            angular.extend($scope.search, {
                currentPage: pageNo || $scope.parkList.currentPage || 1,
                pageSize: $scope.parkList.pageSize || 10
            });
            delete $scope.search.parkId;
            delete $scope.search.DEPT_ID;
            fac.getPageResult("/ovu-pcos/pcos/worklogs/multi/worklogpermission/parklist.do", $scope.search, function (data) {
                $scope.parkList = data.data;
                $scope.parkList.data.forEach(function (v) {
                    $scope.parks.forEach(function (n) {
                        if (n.id == v.id) {
                            v.checked = true;
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
        if (task.type == 1) {
            $scope.findParks();
        }
        //删除部门
        $scope.delP = function (list, node) {
            list && list.forEach(function (item, i) {
                $scope.treeData.forEach(function (v) {
                    v.state = v.state || {};
                    if (v.did == node.did) {
                        v.state.checked = false;
                    }

                    function checkNode(n) {
                        if (n.nodes) {
                            n.nodes.forEach(function (no) {
                                if (no.did == node.did) {
                                    no.state = no.state || {};
                                    no.state.checked = false;
                                }
                                checkNode(no);
                            })

                        }


                    }
                    checkNode(v);

                })
            })
            var index = list && list.findIndex(function (n) {
                return n.did == node.did
            })
            list.splice(index, 1);
            $scope.depts = list;

        }
        //选中部门
        $scope.check = function (node) {
            node.state = node.state || {};
            node.state.checked = !node.state.checked;

            function checkSons(node, status) {
                node.state = node.state || {};
                node.state.checked = status;
                if (node.state.checked) {
                    var isSelected = false;
                    $scope.depts && $scope.depts.forEach(function (item) {
                        if (item.did == node.did) {
                            isSelected = true;
                        }

                    })
                    //在编辑状态下如果在编辑前没有被选中的才加入
                    if (!isSelected) {
                        $scope.depts.push(node);
                    }

                } else {
                    var index = $scope.depts && $scope.depts.findIndex(function (v) {
                        return (v.did == node.did)
                    })
                    // deptIds.push(node.did);
                    $scope.depts.splice(index, 1);

                }
                if (node.nodes && node.nodes.length) {
                    node.nodes.forEach(function (n) {
                        checkSons(n, status);
                    })
                }
            }
            if (node.state.checked) {
                checkSons(node, true);
            } else {
                checkSons(node, false);

            }



        }

        vm.save = function (form) {
            form.$setSubmitted(true);
            if (!form.$valid) {
                return;
            }
            var ids;
            var depIds;
            // 集团版
            if (fac.isEmpty($scope.parks)) {
                alert("请填写数据");
                return;
            }
            // ids 项目id数组
            ids = $scope.parks.reduce(function (ret, n) {
                ret.push(n.id);
                return ret

            }, []).join(',');
            depIds = $scope.depts.reduce(function (ret, n) {
                ret.push(n.did);
                return ret

            }, []).join(',');
            // 部门 id 数组
            if (fac.isEmpty($scope.fileList)) {
                alert("请上传文件");
                return;
            }
            if (fac.isEmpty(depIds)) {
                alert("请选择部门");
                return;
            }


            var attachments = $scope.fileList.reduce(function (ret, n) {
                ret.push(n.path);
                return ret
            }, []).join(',');
            var attachmentName = $scope.fileList.reduce(function (ret, n) {
                ret.push(n.name);
                return ret
            }, []).join(',');
            var params = {
                id: task.id,
                parkIds: ids,
                deptIds: depIds,
                attachmentName: attachmentName,
                type: 1,
                attachmentPath: attachments,
                content: $scope.item.content,
                title: $scope.item.title,
                type: task.type
            };
            $http.post("/ovu-pcos/pcos/newknowledge/train/edit.do", params, fac.postConfig).success(function (data, status, headers, config) {
                if (data.code == "0") {
                    msg(data.msg);
                    $uibModalInstance.close();
                } else {
                    $uibModalInstance.close();
                    alert(data.msg);
                }
            })

        }
        vm.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };



    });
    app.controller('viewedCtrl', function ($scope, $timeout, $uibModalInstance, $http, fac, task) {
        var vm = $scope.vm = this;
        $scope.search = {};
        $scope.pageModel = {};
        $scope.find = function (pageNo) {
            $.extend($scope.search, {
                currentPage: pageNo || $scope.pageModel.currentPage || 1,
                pageSize: $scope.pageModel.pageSize || 10,
                id: task.id
            });
            fac.getPageResult("/ovu-pcos/pcos/newknowledge/train/viewedList", $scope.search, function (data) {
                $scope.pageModel = data;
            });
        }
        $scope.find();

        vm.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };



    });

})();