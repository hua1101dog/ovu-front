// 试卷管理
(function() {
    "use strict";
    var app = angular.module("angularApp");
    app.controller("paperCtrl", function(
        $scope,
        $rootScope,
        $http,
        $filter,
        $uibModal,
        fac
    ) {
        document.title = "试卷管理";
        $scope.pageModel = {};
        $scope.textRecord = {};
        $scope.search = {};
        $scope.treePaper = [];
        $scope.arr = [];
        if ($rootScope.hasPower("编辑")) {
            $scope.config = {
                edit: true,
                showCheckbox: false
            };
        }
        app.modulePromiss.then(function() {
            $scope.$watch("dept.id", function(deptId, oldValue) {
                if (deptId) {
                    $scope.deptId = deptId;
                }
                if ($rootScope.dept.pid == "0") {
                    $scope.search.deptId = deptId;
                    $scope.isPublicSubject = 1;
                    $scope.pid = 0;
                    $scope.config1 = {
                        edit: true,
                        showCheckbox: false
                    };
                } else if ($rootScope.dept.pid != "0") {
                    $scope.search.deptId = deptId;
                    $scope.isPublicSubject = 0;
                    $scope.config1 = {
                        edit: false,
                        showCheckbox: false
                    };
                }
                getPaperTree();
            });
        });

        //添加试卷分类
        $scope.addTopNode = function() {
            $scope.treePaper.push({
                state: {
                    edit: true
                },
                copy: {
                    parentId: 0,
                    deptId: $scope.deptId
                }
            });
        };

        //添加子类
        $scope.addSon = function(node) {
            node.nodes = node.nodes || [];
            node.state = node.state || {};
            node.state.expanded = true;
            // node.isLeaf=true;
            node.nodes.push({
                parentId: node.id,
                state: {
                    edit: true,
                    expanded: true
                },
                copy: {
                    parentId: node.id,
                    deptId: node.deptId
                }
            });
        };

        $scope.selectNode = function(search, node) {
            $scope.arr = [];
            if (node) {
                if (node.state.selected) {
                    $scope.curNode = node;
                } else {
                    delete $scope.curNode;
                }
            }
            var arr = [];
            $scope.ids = [];
            arr.push($scope.curNode);

            fac.treeToFlat(arr).forEach(n => {
                $scope.ids.push(n.id);
            });

            $scope.ids = $scope.ids.join(",");
            $scope.find();
        };

        //获取试卷分类列表树
        function getPaperTree() {
            $http
                .post(
                    "/ovu-pcos/pcos/newknowledge/paperClassification/list",
                    {
                        deptId: $scope.deptId
                    },
                    fac.postConfig
                )
                .success(function(res) {
                    $scope.treePaper = res.data;
                });
            $scope.search.paperName && delete $scope.search.paperName;
            $scope.search.text && delete $scope.search.text;
            $scope.search.id && delete $scope.search.id;
            $scope.search.ids && delete $scope.search.ids;
            $scope.ids && delete $scope.ids;
            $scope.find();
        }

        //删除项目分类
        $scope.delNode = function(node) {
            if (node.nodes && node.nodes.length) {
                alert("此节点有下级节点,不能删除！");
            } else {
                confirm("确定删除 " + node.text + "?", function() {
                    $http
                        .post(
                            "/ovu-pcos/pcos/newknowledge/paperClassification/delete",
                            {
                                id: node.id
                            },
                            fac.postConfig
                        )
                        .success(function(resp) {
                            if (resp.code == 0) {
                                getPaperTree();
                                if ($scope.curNode == node) {
                                    delete $scope.curNode;
                                }
                                var parent = getNodeById(node.parentId);
                                if (parent) {
                                    parent.nodes.splice(
                                        parent.nodes.indexOf(node),
                                        1
                                    );
                                } else {
                                    $scope.treePaper.splice(
                                        $scope.treePaper.indexOf(node),
                                        1
                                    );
                                }
                            } else {
                                //alert(resp.error);
                                alert(resp.msg);
                            }
                        });
                    //zg end
                });
            }
        };
        $scope.save = function(node) {
            if (!node.copy.text) {
                alert("名称不能为空");
                return;
            }
            var filterData; //需要过滤的数据
            if (node.parentId && node.parentId != 0) {
                //子分类(在同级节点是否重复)
                var pnode = fac.treeToFlat($scope.treePaper).find(function(n) {
                    return n.id == node.parentId;
                });
                filterData = pnode.nodes;
            } else {
                //第一级
                filterData = $scope.treePaper;
            }
            var findData = filterData.find(function(n) {
                return n.id != node.copy.id && n.text == node.copy.text;
            });
            if (findData) {
                alert("分类名称已存在");
                return;
            }
            var park = {};

            park.parentId = node.copy.parentId;
            park.id = node.copy.id;
            park.deptId = node.copy.deptId;
            park.text = node.copy.text;
            node.state.expanded = true;
            $http
                .post(
                    "/ovu-pcos/pcos/newknowledge/paperClassification/edit",
                    park,
                    fac.postConfig
                )
                .success(function(resp) {
                    if (resp.code == 0) {
                        getPaperTree();
                    } else {
                        alert(resp.msg);
                    }
                });
        };
        $scope.undo = function(node) {
            if (node.id) {
                node.state.edit = false;
            } else {
                var parent = getNodeById(node.parentId);
                if (parent) {
                    parent.nodes.splice(parent.nodes.indexOf(node), 1);
                } else {
                    $scope.treePaper.splice($scope.treePaper.indexOf(node), 1);
                }
            }
        };

        $scope.editNode = function(node) {
            node.copy = angular.extend({}, node);
            node.copy.parkType = "0";
            node.copy.SORT = $scope.treePaper.length;
            node.state = node.state || {};
            node.state.edit = true;
        };

        function getNodeById(did) {
            if (!did) {
                return false;
            }
            var node = fac.getNodeById($scope.treePaper, did);
            return node;
        }

        //列表查询
        $scope.find = function(pageNo) {
            $.extend($scope.search, {
                currentPage: pageNo || $scope.pageModel.currentPage || 1,
                pageSize: $scope.pageModel.pageSize || 10,
                ids: $scope.ids,
                deptId: $scope.deptId
            });
            if (!$scope.search.paperName) {
                $scope.search.ids && delete $scope.search.ids;
            }
            fac.getPageResult(
                "/ovu-pcos/pcos/newknowledge/paper/list",
                $scope.search,
                function(data) {
                    $scope.pageModel = data;
                }
            );
        };

        //批量删除试卷
        $scope.delAll = function() {
            var ids = $scope.pageModel.list.reduce(function(ret, n) {
                n.checked && n.status != 1 && ret.push(n.id);
                return ret;
            }, []);
            if (ids.length == 0) {
                alert("已开启的试卷不能删除！");
                return;
            }
            del(ids.join());
        };
        //删除试卷
        $scope.del = function(item) {
            del(item.id);
        };

        function del(ids) {
            confirm("确认删除选中的记录?", function() {
                $http
                    .post(
                        "/ovu-pcos/pcos/newknowledge/paper/delete",
                        {
                            ids: ids
                        },
                        fac.postConfig
                    )
                    .success(function(resp) {
                        if (resp.code == "0") {
                            $scope.find();
                            // msg(resp.msg);
                        } else {
                            alert("该考试有考试记录无法删除！");
                        }
                    });
            });
        }

        //选中所有题目
        $scope.checkAll = function(data) {
            data.checked = !data.checked;
            data.data.forEach(function(n) {
                n.checked = data.checked;
                var isSelected = false;
                $scope.arr &&
                    $scope.arr.forEach(function(person) {
                        if (n.id == person.id) {
                            isSelected = true;
                        }
                    });
                //在编辑状态下如果在编辑前没有被选中的才加入
                if (!isSelected) {
                    $scope.arr.push(n);
                }
                if (!n.checked && isSelected) {
                    var i = 0;
                    $scope.arr.forEach(function(v) {
                        i++;
                        if (v.id == n.id) {
                            $scope.arr.splice(i - 1, 1);
                        }
                    });
                }
            });
        };

        //选中题目
        $scope.checkOne = function(item) {
            item.checked = !item.checked;
            if (item.checked) {
                $scope.arr.push(item);
            } else {
                var index = $scope.arr.findIndex(v => {
                    return v.id == item.id;
                });
                $scope.arr.splice(index, 1);
            }
        };
        //新增、编辑
        $scope.showEditModal = function(sub) {
            var copy = angular.extend(
                {
                    treePaper: $scope.treePaper,
                    deptId: $scope.deptId,
                    isPublicSubject: $scope.isPublicSubject
                },
                sub
            );
            copy.type = 0;
            copy.step = 1;
            var modal = $uibModal.open({
                animation: false,
                size: "lg",
                templateUrl: "./knowledge/modal.addPaper.html",
                controller: "editPaperCtrl",
                resolve: {
                    sub: copy
                }
            });
            modal.result.then(function() {
                $scope.find(1);
            });
        };

        //随机新增
        $scope.randomModal = function(sub) {
            var copy = angular.extend(
                {
                    treeClass: $scope.treeClass,
                    deptId: $scope.deptId,
                    isPublicSubject: $scope.isPublicSubject
                },
                sub
            );
            copy.type = 0;
            var modal = $uibModal.open({
                animation: false,
                size: "lg",
                templateUrl: "./knowledge/modal.randomModal.html",
                controller: "randomModalPaperCtrl",
                resolve: {
                    sub: copy
                }
            });
            modal.result.then(function() {
                $scope.find();
            });
        };

        //批量新增、编辑
        $scope.batchAddModal = function(sub) {
            var copy = angular.extend(
                {
                    arr: $scope.arr,
                    deptId: $scope.deptId
                },
                sub
            );
            copy.type = 0;
            var modal = $uibModal.open({
                animation: false,
                size: "lg",
                templateUrl: "./knowledge/modal.batchAddPaper.html",
                controller: "batchAddPaperCtrl",
                resolve: {
                    sub: copy
                }
            });
            modal.result.then(function(data) {
                $scope.arr = data.arr;
                $scope.arr = [];
                $scope.find(1);
            });
        };

        //考试记录
        $scope.examRecordModal = function(sub) {
            var copy = angular.extend({}, sub);
            var modal = $uibModal.open({
                animation: false,
                size: "lg",
                templateUrl: "./knowledge/modal.examRecord.html",
                controller: "examRecordCtrl",
                resolve: {
                    sub: copy
                }
            });
            modal.result.then(function() {});
        };

        //复用
        $scope.repeatedModal = function(sub) {
            var copy = angular.extend({}, sub);
            var modal = $uibModal.open({
                animation: false,
                size: "lg",
                templateUrl: "./knowledge/repeatedModal.html",
                controller: "repeatedModalCtrl",
                resolve: {
                    copy: copy
                }
            });
            modal.result.then(function() {
                $scope.find();
            });
        };
    });

    app.controller("editPaperCtrl", function(
        $scope,
        $http,
        fac,
        $uibModal,
        $uibModalInstance,
        sub,
        $compile
    ) {
        $scope.pageModel = {};
        $scope.search = {};
        $scope.typeList = [];
        $scope.arr = [];
        $scope.item = sub || {};

        $scope.item.step = 1;
        $scope.num1 = 0;
        $scope.num2 = 0;
        $scope.num3 = 0;
        $scope.num4 = 0;
        $scope.num5 = 0;

        var pageModelChecked;

        $scope.numscore = {
            totalNum: 0,
            totalScore: 0,

            score: {}
        };

        //获取知识体系分类
        function getParkTree() {
            $http
                .post(
                    "/ovu-pcos/pcos/newknowledge/hierarchy/list",
                    fac.postConfig
                )
                .success(function(res) {
                    $scope.treeClass = res.data;
                });
        }
        getParkTree();

        //选择分类
        $scope.selectClass = function() {
            var copy = angular.extend(
                {
                    treePaper: $scope.treePaper,
                    deptId: $scope.deptId
                },
                sub
            );

            var modal = $uibModal.open({
                animation: false,
                size: "lg",
                templateUrl: "./knowledge/selectClass.html",
                controller: "selectPaperCtrl",
                resolve: {
                    sub: copy
                }
            });
            modal.result.then(function(data) {
                $scope.item.paperClassificationId = data.id;
                $scope.text = data.text;
            });
        };

        //点击选择知识体系分类中的题目
        $scope.selectAllClass = function() {
            var copy = angular.extend(
                {
                    treeClass: $scope.treeClass
                },
                sub
            );

            copy.type = 0;
            var modal = $uibModal.open({
                animation: false,
                size: "lg",
                templateUrl: "./knowledge/selectAllClass.html",
                controller: "selectAllClassCtrl",
                resolve: {
                    sub: copy
                }
            });
            modal.result.then(function(data) {
                $scope.item.id = data.id;
                $scope.textClass = data.textClass;
                $scope.find(1);
            });
        };

        //列表题目查询
        $scope.find = function(pageNo) {
            $.extend($scope.search, {
                currentPage: pageNo || $scope.pageModel.currentPage || 1,
                pageSize: $scope.pageModel.pageSize || 10,
                ids: $scope.item.id,
                typeList: $scope.typeList.join(",")
            });
            fac.getPageResult(
                "/ovu-pcos/pcos/newknowledge/subject/queryPagingByIdsAndType",
                $scope.search,
                function(data) {
                    $scope.pageModel = data;
                    $scope.pageModel.checked = pageModelChecked;
                    console.log($scope.arr);
                    $scope.arr.length &&
                        $scope.arr.forEach(v => {
                            $scope.pageModel.data.forEach(item => {
                                if (v.id == item.id) {
                                    item.checked = true;
                                }
                            });
                        });
                }
            );
        };
        $scope.find(1);

        //全部
        $scope.classListAll = function() {
            $scope.item.id = "";
            $scope.textClass = "";
            $scope.find(1);
        };

        //不限类型
        $scope.typeListAll = function() {
            $scope.typeList = [];
            $scope.find(1);
        };
        //选中类型
        $scope.checkType = function(flag) {
            if ($scope.typeList.length && $scope.typeList.indexOf(flag) > -1) {
                $scope.typeList.splice($scope.typeList.indexOf(flag), 1);
            } else {
                $scope.typeList.push(flag);
            }
            $scope.find(1);
        };

        //选中题目
        $scope.checkOne = function(item) {
            item.checked = !item.checked;
            if (item.checked) {
                $scope.arr.push(item);
                if (item.type == 1) {
                    $scope.num1++;
                }
                if (item.type == 2) {
                    $scope.num2++;
                }
                if (item.type == 3) {
                    $scope.num3++;
                }
                if (item.type == 4) {
                    $scope.num4++;
                }
                if (item.type == 5) {
                    $scope.num5++;
                }
                $scope.totalNum =
                    $scope.num1 +
                    $scope.num2 +
                    $scope.num3 +
                    $scope.num4 +
                    $scope.num5;
            } else {
                item.check = false;
                var index = $scope.arr.findIndex(v => {
                    return item.id == v.id;
                });
                $scope.arr.splice(index, 1);
                if (item.type == 1) {
                    $scope.num1--;
                }
                if (item.type == 2) {
                    $scope.num2--;
                }
                if (item.type == 3) {
                    $scope.num3--;
                    $scope.type = item.type;
                }
                if (item.type == 4) {
                    $scope.num4--;
                }
                if (item.type == 5) {
                    $scope.num5--;
                }
                $scope.totalNum =
                    $scope.num1 +
                    $scope.num2 +
                    $scope.num3 +
                    $scope.num4 +
                    $scope.num5;
            }
        };

        //选中所有题目
        $scope.checkAll = function() {
            // $scope.arr=[]
            $scope.pageModel.checked = !$scope.pageModel.checked;
            $scope.num1 = 0;
            $scope.num2 = 0;
            $scope.num3 = 0;
            $scope.num4 = 0;
            $scope.num5 = 0;
            if ($scope.pageModel.checked) {
                $scope.pageModel.data.forEach(v => {
                    $scope.arr.push(v);
                });
                let newobj = {};
                $scope.arr = $scope.arr.reduce((preVal, curVal) => {
                    newobj[curVal.id]
                        ? ""
                        : (newobj[curVal.id] = preVal.push(curVal));
                    return preVal;
                }, []);
                $scope.arr.forEach(v => {
                    v.checked = true;
                    if (v.type == 1) {
                        $scope.num1++;
                    }
                    if (v.type == 2) {
                        $scope.num2++;
                    }
                    if (v.type == 3) {
                        $scope.num3++;
                    }
                    if (v.type == 4) {
                        $scope.num4++;
                    }
                    if (v.type == 5) {
                        $scope.num5++;
                    }
                });
                $scope.totalNum =
                    $scope.num1 +
                    $scope.num2 +
                    $scope.num3 +
                    $scope.num4 +
                    $scope.num5;
            } else {
                $scope.pageModel.checked = false;
                $scope.pageModel.data.forEach(v => {
                    v.checked = false;
                    var index = $scope.arr.findIndex(f => {
                        return f.id == v.id;
                    });
                    $scope.arr.splice(index, 1);
                });
                // $scope.num1 = 0
                //     $scope.num2 = 0
                //     $scope.num3 = 0
                //     $scope.num4 = 0
                //     $scope.num5 = 0
                console.log($scope.arr);
                $scope.arr.forEach(v => {
                    v.checked = true;
                    if (v.type == 1) {
                        $scope.num1++;
                    }
                    if (v.type == 2) {
                        $scope.num2++;
                    }
                    if (v.type == 3) {
                        $scope.num3++;
                    }
                    if (v.type == 4) {
                        $scope.num4++;
                    }
                    if (v.type == 5) {
                        $scope.num5++;
                    }
                });
                $scope.totalNum =
                    $scope.num1 +
                    $scope.num2 +
                    $scope.num3 +
                    $scope.num4 +
                    $scope.num5;
            }
        };

        //查看题目详情
        $scope.look = function(item, show) {
            if (show) {
                this.show = show;
            }
            var copy = angular.extend({ id: item.id, show: show }, item);
            var modal = $uibModal.open({
                animation: false,
                size: "lg",
                templateUrl: "knowledge/subject/modal.editSubject.html",
                controller: "editSubjectCtrl",
                resolve: {
                    sub: copy
                }
            });
        };
        //下一步
        $scope.subjectIds = [];
        $scope.next = function(form, item, pageNo) {
            $scope.item.paperClassificationId =
                $scope.item.paperClassificationId;

            if (item.step == 1) {
                if (!$scope.item.text) {
                    alert("试卷名称不能为空！");
                    return;
                } else if (!$scope.item.description) {
                    alert("试卷描述不能为空！");
                    return;
                }
                if ($scope.item.paperClassificationId == undefined) {
                    alert("试卷分类不能为空！");
                    return;
                }
                $scope.pageModel.checked = pageModelChecked;
            }
            if (item.step == 2) {
                if ($scope.arr.length == 0) {
                    alert("您还没有选题目！");
                    return;
                }
                $scope.arr.forEach(n => {
                    $scope.subjectIds.push(n.id);
                });

                item.subjectIds = $scope.subjectIds.join(",");
                pageModelChecked = $scope.pageModel.checked;
            }
            if (item.step == 3) {
                $scope.calcluScore();
                if ($scope.num1 == 0) {
                    $scope.numscore.score.score1 = 0;
                } else {
                    if ($scope.numscore.score.score1 < 1) {
                        alert("单选题分数必须>=1！");
                        return;
                    }
                }
                if ($scope.num2 == 0) {
                    $scope.numscore.score.score2 = 0;
                } else if ($scope.num2 > 0) {
                    if ($scope.numscore.score.score2 < 1) {
                        alert("多选题分数必须>=1！");
                        return;
                    }
                }
                if ($scope.num3 == 0) {
                    $scope.numscore.score.score3 = 0;
                } else if ($scope.num3 > 0) {
                    if ($scope.numscore.score.score3 < 1) {
                        alert("判断题分数必须>=1！");
                        return;
                    }
                }
                if ($scope.num4 == 0) {
                    $scope.numscore.score.score4 = 0;
                } else if ($scope.num4 > 0) {
                    if ($scope.numscore.score.score4 < 1) {
                        alert("填空题分数必须>=1！");
                        return;
                    }
                }
                if (!$scope.item.passGrade || $scope.item.passGrade <= 0) {
                    alert("及格分数必须>=1！");
                    return;
                }
                // if($scope.numscore.score.score5==0 &&$scope.num5>0){
                //     alert('单选题分数不能为0！')
                //     return;
                // }
            }

            $scope.item.paperClassificationId =
                $scope.item.paperClassificationId;
            $scope.item.step = item.step + 1;
            if (item.step == 4) {
                $scope.arr.forEach(v => {
                    if (v.type == 1) {
                        v.score = $scope.numscore.score.score1;
                    } else if (v.type == 2) {
                        v.score = $scope.numscore.score.score2;
                    } else if (v.type == 3) {
                        v.score = $scope.numscore.score.score3;
                    } else if (v.type == 4) {
                        v.score = $scope.numscore.score.score4;
                    }
                });
                console.log($scope.arr);
                $.extend($scope.search, {
                    list: $scope.arr
                });
                $http
                    .post(
                        "/ovu-pcos/pcos/newknowledge/subject/subjectSort",
                        $scope.search
                    )
                    .success(function(resp) {
                        console.log(resp);
                        if (resp.code == "0") {
                            $scope.arr = resp.data;
                            // msg(resp.msg);
                            // $uibModalInstance.close()
                        } else {
                            alert(resp.msg);
                        }
                    });
                //   $('#question').text(''+$scope.numscore.score.score5+'')
            }
            $.extend($scope.search, {
                currentPage: pageNo || $scope.pageModel.currentPage || 1,
                pageSize: $scope.pageModel.pageSize || 10,
                deptId: $scope.item.deptId,
                isPublicSubject: $scope.item.isPublicSubject
                // subjectIds:$scope.item.subjectIds
            });

            fac.getPageResult(
                "/ovu-pcos/pcos/newknowledge/subject/queryPagingByIdsAndType",
                $scope.search,
                function(data) {
                    $scope.pageModel = data;

                    $scope.pageModel.checked = pageModelChecked;
                    if ($scope.pageModel.checked) {
                        $scope.pageModel.data.forEach(v => {
                            v.checked = true;
                        });
                    }
                }
            );

            if ($scope.numscore.totalScore < item.passGrade) {
                alert("及格分不得大于总分！");
                return;
            }
        };

        //上一步
        $scope.item.score5 = 0;
        $scope.before = function(form, item) {
            if (item.step == 2) {
                $scope.arr.forEach(n => {
                    $scope.subjectIds.push(n.id);
                });

                item.subjectIds = $scope.subjectIds.join(",");
                pageModelChecked = $scope.pageModel.checked;
            }
            if ($scope.item.step == 3) {
                $scope.pageModel.checked = pageModelChecked;
                $scope.find(1);
            }
            if ($scope.item.step > 1) {
                $scope.item.step = item.step - 1;
            }
            // $scope.item.score5=$scope.numscore.score.score5
        };

        //保存试卷
        $scope.savePaper = function(item) {
            $scope.list = [];

            $scope.arr.forEach(n => {
                if (n.type == 1) {
                    n.score = $scope.numscore.score.score1;
                } else if (n.type == 2) {
                    n.score = $scope.numscore.score.score2;
                } else if (n.type == 3) {
                    n.score = $scope.numscore.score.score3;
                } else if (n.type == 4) {
                    n.score = $scope.numscore.score.score4;
                } else {
                }
            });

            $scope.isOk = true;
            $scope.arr.forEach(v => {
                if (v.type == 5 && !v.score) {
                    alert("问答题未设置分数！");
                    return ($scope.isOk = false);
                } else if (v.type == 5) {
                    $scope.list.push({
                        id: v.id,
                        score: v.score
                    });
                }
            });
            if (!$scope.isOk) {
                return $scope.isOk;
            }

            if ($scope.totalNum == 0) {
                alert("当前无题目，请添加题目！");
                return;
            }
            if ($scope.num5 > 0) {
                if (!$scope.numscore.score.score5) {
                    alert("请输入问答题分数");
                    return;
                }
            } else {
                $scope.numscore.score.score5 = 0;
            }

            if ($scope.numscore.totalScore < item.passGrade) {
                alert("及格分不得大于总分！");
                return;
            }

            $scope.score = [
                $scope.numscore.score.score1,
                $scope.numscore.score.score2,
                $scope.numscore.score.score3,
                $scope.numscore.score.score4
            ];
            $scope.num = [$scope.num1, $scope.num2, $scope.num3, $scope.num4];
            $.extend($scope.search, {
                ids: $scope.id,
                text: item.text,
                paperClassificationId: $scope.item.paperClassificationId,
                description: item.description,
                deptId: $scope.item.deptId,
                // subjectIds: item.subjectIds,
                // score: $scope.score.join(','),
                count: $scope.arr.length,
                totalGrade: $scope.numscore.totalScore,
                passGrade: item.passGrade,
                questionList: $scope.arr
            });
            $http
                .post("/ovu-pcos/pcos/newknowledge/paper/edit", $scope.search)
                .success(function(resp) {
                    if (resp.code == "0") {
                        msg(resp.msg);
                        $uibModalInstance.close();
                    } else {
                        alert(resp.msg);
                    }
                });
        };

        //升降排列
        $scope.sort = function(smallIndex, biggerIndex) {
            var small = $scope.arr[smallIndex];
            var big = $scope.arr[biggerIndex];

            $scope.arr[smallIndex] = big;
            $scope.arr[biggerIndex] = small;
        };

        $scope.numscore.score.score1 = 0;
        $scope.numscore.score.score2 = 0;
        $scope.numscore.score.score3 = 0;
        $scope.numscore.score.score4 = 0;
        $scope.numscore.score.score5 = 0;
        $scope.calcluScore = function() {
            var totalScore = 0;
            if ($scope.numscore.score.score1) {
                totalScore += $scope.numscore.score.score1 * $scope.num1;
            }
            if ($scope.numscore.score.score2) {
                totalScore += $scope.numscore.score.score2 * $scope.num2;
            }
            if ($scope.numscore.score.score3) {
                totalScore += $scope.numscore.score.score3 * $scope.num3;
            }
            if ($scope.numscore.score.score4) {
                totalScore += $scope.numscore.score.score4 * $scope.num4;
            }
            if ($scope.numscore.score.score5) {
                totalScore += $scope.numscore.score.score5;
            }
            $scope.numscore.totalScore = totalScore;
        };

        $scope.getScore5 = function(v) {
            v = v - 0;

            var num = 0;
            $scope.isCompileFn = true;
            $scope.arr.forEach(q => {
                if (q.type == 5 && q.score !== undefined) {
                    q.score = q.score - 0 || 0;
                    num += q.score;
                } else {
                }
            });
            $("#question").text("");
            $scope.numscore.score.score5 = num;
            $scope.calcluScore();
            var compileFn = $compile("<div>{{numscore.score.score5}}</div>");
            // 传入scope，得到编译好的dom对象(已封装为jqlite对象)
            // 也可以用$scope.$new()创建继承的作用域
            var $dom = compileFn($scope);
            // 添加到文档中
            $dom.appendTo("#question");
        };

        $scope.del = function(item) {
            $scope.arr.splice($scope.arr.indexOf(item), 1);
            if (item.type == 1) {
                $scope.num1--;
            }
            if (item.type == 2) {
                $scope.num2--;
            }
            if (item.type == 3) {
                $scope.num3--;
            }
            if (item.type == 4) {
                $scope.num4--;
            }
            if (item.type == 5) {
                $scope.num5--;
                item.score = item.score || 0;
                $scope.numscore.score.score5 -= item.score;
            }
            $scope.totalNum =
                $scope.num1 +
                $scope.num2 +
                $scope.num3 +
                $scope.num4 +
                $scope.num5;
            //计算
            $scope.calcluScore();
        };

        $scope.selectPerson = function() {
            var sub = deFormatP($scope.item) || {};
            sub.isGroup = 0;
            var modal = $uibModal.open({
                animation: false,
                size: sub.isGroup ? "max" : "lg",
                templateUrl: "/view/knowledge/modal.selectPersons.html",
                controller: "selectPaperPersonsCtrl",
                resolve: {
                    sub: function() {
                        return sub;
                    }
                }
            });
            modal.result.then(function(data) {
                if (data) {
                    formatP(data);
                }
            });
        };

        function formatP(data) {
            var parkIds = [],
                parkNames = [],
                deptIds = [],
                deptNames = [],
                personIds = [],
                personNames = [];
            data.parks.forEach(function(item) {
                parkIds.push(item.id);
                parkNames.push(item.parkName);
            });
            data.depts.forEach(function(item) {
                deptIds.push(item.id);
                deptNames.push(item.deptName);
            });
            data.persons.forEach(function(item) {
                personIds.push(item.id);
                personNames.push(item.personName);
            });

            $scope.item.parkIds = parkIds.join();
            $scope.item.parkNames = parkNames.join();
            $scope.item.deptIds = deptIds.join();
            $scope.item.deptNames = deptNames.join();
            $scope.item.personIds = personIds.join();
            $scope.item.personNames = personNames.join();
        }

        function deFormatP(item) {
            var result = {
                parks: [],
                depts: [],
                persons: []
            };
            var parkIds = [],
                parkNames = [],
                deptIds = [],
                deptNames = [],
                personIds = [],
                personNames = [];
            if (item.parkIds) {
                parkIds = item.parkIds.split(",");
                parkNames = item.parkNames.split(",");
            }
            if (item.deptIds) {
                deptIds = item.deptIds.split(",");
                deptNames = item.deptNames.split(",");
            }
            if (item.personIds) {
                personIds = item.personIds.split(",");
                personNames = item.personNames.split(",");
            }

            parkIds.forEach(function(value, index) {
                result.parks.push({
                    id: value,
                    parkName: parkNames[index]
                });
            });
            deptIds.forEach(function(value, index) {
                result.depts.push({
                    id: value,
                    deptName: deptNames[index]
                });
            });
            personIds.forEach(function(value, index) {
                result.persons.push({
                    id: value,
                    personName: personNames[index]
                });
            });

            return result;
        }

        $scope.cancel = function() {
            $uibModalInstance.dismiss("cancel");
        };
        // }
    });

    app.controller("selectPaperCtrl", function(
        $scope,
        $http,
        fac,
        $uibModalInstance,
        sub
    ) {
        $scope.item = sub || {};

        $scope.treePaper = sub.treePaper;

        $scope.setpaperClassificationId = function(item) {
            sub.text = item.undefined;
            $scope.item.paperClassificationId = item.paperClassificationId;
            $scope.item = sub;
        };

        $scope.saveSelectClass = function(item) {
            if (item.paperClassificationId == undefined) {
                alert("请选择试卷分类！");
                return;
            }
            var tempObj = {
                id: $scope.item.paperClassificationId,
                text: $scope.item.undefined
            };
            $uibModalInstance.close(tempObj);
        };

        $scope.cancel = function() {
            $uibModalInstance.dismiss("cancel");
        };
    });

    //选择所有分类
    app.controller("selectAllClassCtrl", function(
        $scope,
        $http,
        fac,
        $uibModalInstance,
        sub
    ) {
        $scope.item = sub || {};

        $scope.treeClass = sub.treeClass;

        $scope.setHierarchyClassification = function(item) {
            sub.textClass = item.undefined;
            $scope.item.id = item.id;
            $scope.item = sub;
        };

        $scope.saveSelectAllClass = function(item) {
            if (item.id == undefined) {
                alert("请选择试卷分类！");
                return;
            }

            $scope.id = item.id;

            var tempObj = {
                id: $scope.id,
                textClass: $scope.item.undefined
            };
            $uibModalInstance.close(tempObj);
        };
        $scope.cancel = function() {
            $uibModalInstance.dismiss("cancel");
            //列表题目查询
        };
    });

    //考试记录
    app.controller("examRecordCtrl", function(
        $scope,
        $http,
        fac,
        $uibModalInstance,
        $uibModal,
        sub
    ) {
        $scope.pageModel = {};
        $scope.search = {};
        $scope.state = "";
        $scope.textRecord = {};
        $scope.item = sub || {};
        console.log(sub);
        // $scope.textRecord = sub.textRecord

        $scope.find = function(pageNo, sub) {
            $.extend($scope.search, {
                currentPage: pageNo || $scope.pageModel.currentPage || 1,
                pageSize: $scope.pageModel.pageSize || 10,
                pageIndex: pageNo - 1,
                paperId: $scope.item.id
            });
            $http
                .post(
                    "/ovu-pcos/pcos/newknowledge/examine/list",
                    $scope.search,
                    fac.postConfig
                )
                .success(function(resp) {
                    console.log(resp);
                    if (resp.code == 0) {
                        $scope.textRecord = resp.data;
                        // msg(resp.msg);
                        console.log($scope.textRecord);
                        $scope.textRecord.data.forEach(v => {
                            var endD = new Date(v.startTime);
                            function contrast_time() {
                                var nowD = new Date(); //当前时间

                                if (nowD.getTime() > endD.getTime()) {
                                    //getTime() 方法可返回距 1970 年 1 月 1 日之间的毫秒数。
                                    // alert('当前时间大于对比时间')

                                    $scope.state = 1;
                                } else {
                                    // alert('当前时间小于对比时间')
                                    $scope.state = 0;
                                }
                            }
                            contrast_time();
                        });
                    } else {
                        alert(resp.msg);
                    }
                    $scope.pageModel = resp.data;
                    $scope.pageModel.totalPage = $scope.pageModel.pageTotal;
                    $scope.pageModel.currentPage =
                        $scope.pageModel.pageIndex + 1;
                    $scope.pageModel.totalRecord = $scope.pageModel.totalCount;

                    var list = [
                        1,
                        $scope.pageModel.currentPage - 1,
                        $scope.pageModel.currentPage,
                        $scope.pageModel.currentPage + 1,
                        $scope.pageModel.totalPage
                    ];
                    var pages = [];
                    var hash = {};
                    list.forEach(function(v) {
                        if (
                            !hash[v] &&
                            v <= $scope.pageModel.totalPage &&
                            v > 0
                        ) {
                            hash[v] = true;
                            pages.push(v);
                        }
                    });
                    if (pages.length > 2 && pages.indexOf(2) == -1) {
                        pages.splice(1, 0, "······");
                    }
                    if (
                        pages.length > 2 &&
                        pages.indexOf($scope.pageModel.totalPage - 1) == -1
                    ) {
                        pages.splice(pages.length - 1, 0, "······");
                    }
                    $scope.pageModel.pages = pages;
                });
        };
        $scope.find(1);

        //考试结果
        $scope.testResultModal = function(sub) {
            var copy = angular.extend(
                { textRecord: $scope.textRecord, isSaveMaxScore: 0 },
                sub
            );
            var modal = $uibModal.open({
                animation: false,
                size: "lg",
                templateUrl: "./knowledge/modal.testResultModal.html",
                controller: "testResultModalCtrl",
                resolve: { sub: copy }
            });
            modal.result.then(function(data) {
                // $scope.data=data.data
                // console.log($scope.data)

                $scope.find(1);
            });
        };

        //查看人群
        $scope.showPerson = function(sub) {
            var copy = angular.extend(
                {
                    textRecord: $scope.textRecord,
                    showTitle:'考试人群'
                },
                sub
            );

            copy.type = 0;
            copy.step = 1;
            var modal = $uibModal.open({
                animation: false,
                size: "lg",
                templateUrl: "./knowledge/showPerson.html",
                controller: "showknowledgePersonCtrl",
                resolve: {
                    sub: copy
                }
            });
            modal.result.then(function() {});
        };

        //批量考试编辑编辑
        $scope.batchAddModal = function(sub) {
            var copy = angular.extend({}, sub);
            copy.type = 0;
            var modal = $uibModal.open({
                animation: false,
                size: "lg",
                templateUrl: "./knowledge/modal.batchAddPaper.html",
                controller: "batchAddPaperCtrl",
                resolve: {
                    sub: copy
                }
            });
            modal.result.then(function() {
                $scope.find(1);
            });
        };

        //关闭
        $scope.cancel = function() {
            $uibModalInstance.dismiss("cancel");
        };
    });

    //考试结果
    app.controller("testResultModalCtrl", function(
        $scope,
        $http,
        fac,
        $uibModal,
        $uibModalInstance,
        sub
    ) {
        $scope.search = {};
        $scope.item = sub || {};
        $scope.item.isSaveMaxScore = 0;
        $scope.pageModel = {};
        $scope.data = {};
        $scope.find = function(pageNo, n, flag) {
            $scope.n = n;
            $.extend($scope.search, {
                currentPage: pageNo || $scope.pageModel.currentPage || 1,
                pageSize: $scope.pageModel.pageSize || 10,
                examineId: sub.id,
                isSaveMaxScore: $scope.n,
                isSubmit: $scope.item.isSubmit
            });
            fac.getPageResult(
                "/ovu-pcos/pcos/newknowledge/result/list",
                $scope.search,
                function(data) {
                    if (!flag) {
                        $scope.data = data;
                        if (data.minScore == undefined) {
                            data.minScore = "-";
                        }
                        if (data.maxScore == undefined) {
                            data.maxScore = "-";
                        }
                        if (data.passCount == undefined) {
                            data.passCount = "-";
                        }
                        if (data.attendCount == undefined) {
                            data.attendCount = "-";
                        }
                    } else {
                        $scope.data.isAllMark = data.isAllMark;
                    }
                    $scope.pageModel = data.pageResult;
                    $scope.pageModel.totalPage = $scope.pageModel.pageTotal;
                    $scope.pageModel.currentPage =
                        $scope.pageModel.pageIndex + 1;
                    $scope.pageModel.totalRecord = $scope.pageModel.totalCount;
                    var list = [
                        1,
                        $scope.pageModel.currentPage - 1,
                        $scope.pageModel.currentPage,
                        $scope.pageModel.currentPage + 1,
                        $scope.pageModel.totalPage
                    ];
                    var pages = [];
                    var hash = {};
                    list.forEach(function(v) {
                        if (
                            !hash[v] &&
                            v <= $scope.pageModel.totalPage &&
                            v > 0
                        ) {
                            hash[v] = true;
                            pages.push(v);
                        }
                    });
                    if (pages.length > 2 && pages.indexOf(2) == -1) {
                        pages.splice(1, 0, "······");
                    }
                    if (
                        pages.length > 2 &&
                        pages.indexOf($scope.pageModel.totalPage - 1) == -1
                    ) {
                        pages.splice(pages.length - 1, 0, "······");
                    }
                    $scope.pageModel.pages = pages;
                }
            );
        };
        $scope.find(1, 0);
        //设置是否为最高分
        $scope.setIsSaveMaxScore = function(item, pageNo) {
            if (item == 1) {
                $scope.find(1, 1, true);
            } else if (item == 0) {
                $scope.find(1, 0, true);
            }
        };
        $scope.setIsSaveMaxScore($scope.item.isSaveMaxScore, 1);
        //考试分析
        $scope.changeIndex = function(index, pageNo) {
            $scope.find(1);
            $scope.hide = false;
            if (index == 1) {
                $scope.hide = true;
                if ($scope.data.isAllMark == 0) {
                    //考试没有结束
                    alert("答题分析未公布！");
                    return;
                }
                $.extend($scope.search, {
                    currentPage: pageNo || $scope.pageModel.currentPage || 1,
                    pageSize: $scope.pageModel.pageSize || 10,
                    examineId: sub.id
                });
                $http
                    .post(
                        "/ovu-pcos/pcos/newknowledge/result/analyse",
                        $scope.search,
                        fac.postConfig
                    )
                    .success(function(data) {
                        if (data.code == 0) {
                            $scope.pageModel1 = data.data;
                        } else {
                            alert(data.msg);
                        }
                    });
            } else {
                $scope.setIsSaveMaxScore($scope.item.isSaveMaxScore, 1);
            }
        };
        //导出
        $scope.downloadFile = function() {
            var url = "/ovu-pcos/pcos/newknowledge/result/export";
            getBlankTmpl(url);
        };
        function getBlankTmpl(url) {
            var elemIF = document.createElement("iframe");
            elemIF.src = url + "?examineId=" + $scope.item.id;
            elemIF.style.display = "none";
            document.body.appendChild(elemIF);
        }
        //评分
        $scope.gradeModal = function(sub) {
            var copy = angular.extend(
                { subjectDetail: sub.subjectDetails },
                sub
            );
            var modal = $uibModal.open({
                animation: false,
                size: "lg",
                templateUrl: "./knowledge/modal.gradeModal.html",
                controller: "gradeModalCtrl",
                resolve: { sub: copy }
            });
            modal.result.then(function() {
                $scope.find();
            });
        };
        //查看详情
        $scope.showEditModal = function(sub) {
            if (sub.isSubmit != 1) {
                return;
            }
            var copy = angular.extend({}, sub);
            var modal = $uibModal.open({
                animation: false,
                size: "lg",
                templateUrl: "./knowledge/subjectDetail.html",
                controller: "subjectDetailCtrl",
                resolve: { sub: copy }
            });
            modal.result.then(function() {});
        };
        //关闭
        $scope.cancel = function() {
            var tempObj = {
                data: $scope.data
            };
            $uibModalInstance.close(tempObj);
            // $uibModalInstance.dismiss('cancel');
        };
    });
   

    //编辑新增ctrl
    app.controller("batchAddPaperCtrl", function(
        $scope,
        $http,
        $rootScope,
        fac,
        $uibModal,
        $uibModalInstance,
        sub
    ) {
        $scope.search = {};
        $scope.item = sub || {};
        $scope.ids = [];
        $scope.personIds = [];
        $scope.arr = sub.arr;
        $scope.personList = sub.personList;
        $scope.deptId = sub.deptId;
        $scope.item.isRestrict = 0;
        $scope.item.isPublic = 1;
        $scope.groupIds = [];
        $scope.takeInPersonIds = [];

        if ($scope.item.id) {
            $scope.item.personList.forEach(v => {
                $scope.personIds.push(v.id);
            });
            $scope.personIds = $scope.personIds.join(",");
        }

        //勾选上的试卷集合
        if (sub.arr) {
            $scope.arr.forEach(v => {
                $scope.ids.push(v.id);
            });
            $scope.ids = $scope.ids.join(",");
        }

        //选择分组
        $scope.selectGroud = function(sub) {
            $http
                .post(
                    "/ovu-pcos/pcos/newknowledge/group/list",
                    { deptId: $scope.item.deptId },
                    fac.postConfig
                )
                .success(function(resp) {
                    if (resp.code == 0) {
                        // msg(resp.msg);
                        $scope.groudList = resp.data;
                    } else {
                        alert(resp.msg);
                    }
                });
        };
        $scope.checkOne = function(item) {
            item.checked = !item.checked;
            if (item.checked) {
                $scope.groupIds.push(item.id);
            } else {
                var index = $scope.groupIds.findIndex(v => {
                    return item.id == v;
                });
                $scope.groupIds.splice(index, 1);
            }

            // $http
            //     .post(
            //         "/ovu-pcos/pcos/newknowledge/group/queryByGroupId",
            //         {
            //             ids: $scope.groupIds.join(",")
            //         },
            //         fac.postConfig
            //     )
            //     .success(function(resp) {
            //         if (resp.code == 0) {
            //             // msg(resp.msg)
            //             $scope.personList = resp.data;
            //             $scope.personIds1 = [];
            //             $scope.personList.forEach(v => {
            //                 $scope.personIds1.push(v.id);
            //             });
            //         } else {
            //             alert(resp.msg);
            //         }
            //     });
        };

        //删除人员
        $scope.delP = function(per, p) {
            $scope.personList.data &&
                $scope.personList.data.forEach(function(v) {
                    v.id == p.id && (v.checked = false);
                });

            p.checked = false;
            if (per.length <= 10) {
                per.splice(per.indexOf(p), 1);
                $scope.persons = per;
                //这是提交保存的数据对象
                $scope.personList = per;
                $scope.show = "";
            } else {
                per.splice(per.indexOf(p), 1);
                //这是提交保存的数据对象
                $scope.personList = per;
                $scope.persons = per.slice(0, 10);
            }
            $scope.personList = per;
            $scope.personIds1 = [];
            $scope.personList.forEach(v => {
                $scope.personIds1.push(v.id);
            });
        };

        //删除导入人群
        $scope.delTP = function(Tper, p) {
            $scope.takeInPersonList.data &&
                $scope.takeInPersonList.data.forEach(function(v) {
                    v.id == p.id && (v.checked = false);
                });
            p.checked = false;

            if (Tper.length <= 10) {
                Tper.splice(Tper.indexOf(p), 1);
                $scope.Tpersons = Tper;
                //这是提交保存的数据对象
                $scope.takeInPersonList = Tper;
                $scope.show = "";
            } else {
                Tper.splice(Tper.indexOf(p), 1);
                //这是提交保存的数据对象
                $scope.takeInPersonList = Tper;
                $scope.Tpersons = Tper.slice(0, 10);
            }
            $scope.takeInPersonList = Tper;
            $scope.takeInPersonIds = [];
            $scope.takeInPersonList.forEach(v => {
                $scope.takeInPersonIds.push(v.id);
            });
        };

        //下载模板
        $scope.downloadFile = function() {
            var url = "/ovu-pcos/pcos/newknowledge/examine/downloadExcel";
            getBlankTmpl(url);
        };

        function getBlankTmpl(url, type) {
            var elemIF = document.createElement("iframe");
            elemIF.src = url + "?type=" + type;
            elemIF.style.display = "none";
            document.body.appendChild(elemIF);
        }

        //导入
        $scope.uploadText = function() {
            uploadExcel(function(resp) {
                if (resp.passCode == 0) {
                    $scope.takeInPersonList = resp.data;
                    $scope.takeInPersonList.forEach(v => {
                        $scope.takeInPersonIds.push(v.id);
                    });
                    rtmsg();
                }
            });

            function rtmsg() {
                $scope.worktaskMsg = "导入成功！";
                msg("导入成功！");
                $scope.$apply();
            }
        };

        function uploadExcel(fn) {
            fac.upload(
                {
                    url: "/ovu-pcos/pcos/newknowledge/examine/importPerson",
                    accept:
                        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                },
                function(resp) {
                    if (resp.success) {
                        fn && fn(resp);
                    } else {
                        alert(resp.error);
                    }
                }
            );
        }

        //保存考试设置
        $scope.save = function(item) {
            $scope.personIds = $scope.takeInPersonIds.concat($scope.personIds1);
            if ($scope.item.text == undefined) {
                alert("请输入考试名称！");
                return;
            }
            if ($scope.item.startTime == undefined) {
                alert("请输入开始考试时间！");
                return;
            }
            if ($scope.item.endTime == undefined) {
                alert("请输入结束考试时间！");
                return;
            }
            if (!$scope.takeInPersonIds.length && !$scope.groupIds.length) {
                alert("请选择考试人员！");
                return;
            }
            if ($scope.item.isRestrict == 1) {
                if ($scope.item.count == undefined) {
                    alert("请选择考试次数！");
                    return;
                }
            }
            if ($scope.item.isPublic == 0) {
                if ($scope.item.publicTime == undefined) {
                    alert("请选择公布答案时间！");
                    return;
                }
            }
            $.extend($scope.search, {
                personIds: $scope.personIds.join(","),
                text: $scope.item.text,
                isPublic: $scope.item.isPublic,
                isRestrict: $scope.item.isRestrict,
                startTime: $scope.item.startTime,
                endTime: $scope.item.endTime,
                count: $scope.item.count,
                publicTime: $scope.item.publicTime,
                ids: $scope.ids,
                deptId: $scope.deptId,
                groupIds: $scope.groupIds.join(",")
                // id:$scope.item.id
            });
            $http
                .post(
                    "/ovu-pcos/pcos/newknowledge/examine/edit",
                    $scope.search,
                    fac.postConfig
                )
                .success(function(resp) {
                    if (resp.code == "0") {
                        msg(resp.msg);

                        var tempObj = {
                            arr: $scope.arr
                        };
                        $uibModalInstance.close(tempObj);
                    } else {
                        alert(resp.msg);
                    }
                });
        };
        //关闭
        $scope.cancel = function() {
            $uibModalInstance.dismiss("cancel");
        };
    });
    //随机组卷
    app.controller("randomModalPaperCtrl", function(
        $scope,
        $http,
        fac,
        $uibModal,
        $uibModalInstance,
        sub,
        $compile
    ) {
        $scope.pageModel = {};
        $scope.search = {};
        $scope.typeList = [];
        $scope.arr = [];
        $scope.subjectIds = [];
        $scope.item = sub || {};
        $scope.item.step = 1;
        $scope.item.ids = [];
        $scope.blocked = false;
        $scope.deptId = sub.deptId;
        $scope.num = [];
        var copyTree = [];

        $scope.config = {
            edit: false,
            showCheckbox: true
        };
        $scope.numscore = {
            totalNum: 0,
            totalScore: 0,
            // num: {
            //     num1: 0,
            //     num2: 0,
            //     num3: 0,
            //     num4: 0,
            //     num5: 0
            // },
            score: {}
        };
        //获取试卷分类列表树
        function getPaperTree() {
            $http
                .post(
                    "/ovu-pcos/pcos/newknowledge/paperClassification/list",
                    {
                        deptId: $scope.deptId
                    },
                    fac.postConfig
                )
                .success(function(res) {
                    $scope.treePaper = res.data;
                });
        }
        getPaperTree();

        //不限类型
        $scope.typeListAll = function() {
            $scope.typeList = [];
            $scope.find(1);
        };

        function getParkTree(pageNo, node) {
            $http
                .post(
                    "/ovu-pcos/pcos/newknowledge/hierarchy/list",
                    fac.postConfig
                )
                .success(function(res) {
                    $scope.treeClass = res.data;
                });
        }
        getParkTree();
        //列表查询
        $scope.find = function(pageNo) {
            $.extend($scope.search, {
                currentPage: pageNo || $scope.pageModel.currentPage || 1,
                pageSize: $scope.pageModel.pageSize || 10,
                ids: $scope.ids,
                deptId: $scope.deptId
            });
            fac.getPageResult(
                "/ovu-pcos/pcos/newknowledge/paper/list",
                $scope.search,
                function(data) {
                    $scope.pageModel = data;
                }
            );
        };
        //点击选择知识体系分类中的题目
        $scope.selectAllClass = function() {
            var copy = angular.extend(
                {
                    treeClass: $scope.treeClass
                },
                sub
            );

            var modal = $uibModal.open({
                animation: false,
                size: "lg",
                templateUrl: "./knowledge/selectAllClass.html",
                controller: "selectAllClassCtrl",
                resolve: {
                    sub: copy
                }
            });
            modal.result.then(function(data) {
                $scope.item.id = data.id;
                $scope.textClass = data.textClass;
                $scope.find(1);
            });
        };

        //选择分类
        $scope.selectClass = function() {
            var copy = angular.extend(
                {
                    treePaper: $scope.treePaper
                },
                sub
            );

            var modal = $uibModal.open({
                animation: false,
                size: "lg",
                templateUrl: "./knowledge/selectClass.html",
                controller: "selectPaperCtrl",
                resolve: {
                    sub: copy
                }
            });
            modal.result.then(function(data) {
                $scope.item.paperClassificationId = data.id;
                $scope.text = data.text;
            });
        };

        //选中知识体系分类
        $scope.selectNode = function(node) {
            ($scope.selectList = []),
                $scope.execTreeNode($scope.treeClass, function(n) {
                    if (n.state && n.state.checked) {
                        $scope.selectList.push(n.id);
                    }
                });

            $scope.ids = $scope.selectList.join(",");
        };

        //选中题目类型
        $scope.checkType = function(flag) {
            if ($scope.typeList.length && $scope.typeList.indexOf(flag) > -1) {
                $scope.typeList.splice($scope.typeList.indexOf(flag), 1);
            } else {
                $scope.typeList.push(flag);
            }
        };

        //下一步
        $scope.subjectIds = [];
        $scope.next = function(form, item) {
            copyTree = $scope.treeClass || [];
            $scope.item.paperClassificationId =
                $scope.item.paperClassificationId;
            if (item.step == 1) {
                if (!$scope.item.text) {
                    alert("试卷名称不能为空！");
                    return;
                } else if (!$scope.item.description) {
                    alert("试卷描述不能为空！");
                    return;
                }
            }
            if (item.step == 2) {
                if ($scope.ids == undefined) {
                    alert("请选择分类！");
                    return;
                }
            }
            if (item.step == 3) {
                if ($scope.item.num1 == 0) {
                    $scope.numscore.score.score1 = 0;
                }
                if ($scope.item.num2 == 0) {
                    $scope.numscore.score.score2 = 0;
                }
                if ($scope.item.num3 == 0) {
                    $scope.numscore.score.score3 = 0;
                }
                if ($scope.item.num4 == 0) {
                    $scope.numscore.score.score4 = 0;
                }
                if (
                    $scope.item.num1 - 0 > $scope.item.count[0] - 0 ||
                    $scope.item.num1 - 0 < 0
                ) {
                    alert("单选题数量有误！");
                    if ($scope.numscore.score.score1 < 1) {
                        alert("单选题分数有误！");
                        return;
                    }
                    return;
                }
                if (
                    $scope.item.num1 - 0 < $scope.item.count[0] - 0 &&
                    $scope.item.num1 - 0 > 0
                ) {
                    if ($scope.numscore.score.score1 <= 0) {
                        alert("单选题分数有误！");
                        return;
                    }
                }
                if ($scope.numscore.score.score1 < 0) {
                    alert("单选题分数有误！");
                    return;
                }

                if (
                    $scope.item.num2 - 0 > $scope.item.count[1] - 0 ||
                    $scope.item.num2 - 0 < 0
                ) {
                    alert("多选题数量有误！");
                    if ($scope.numscore.score.score2 <= 0) {
                        alert("多选题分数有误！");
                        return;
                    }
                    return;
                }
                if (
                    $scope.item.num2 - 0 < $scope.item.count[1] - 0 &&
                    $scope.item.num2 - 0 > 0
                ) {
                    if ($scope.numscore.score.score2 <= 0) {
                        alert("多选题分数有误！");
                        return;
                    }
                }
                if ($scope.numscore.score.score2 < 0) {
                    alert("多选题分数有误！");
                    return;
                }

                if (
                    $scope.item.num3 - 0 > $scope.item.count[2] - 0 ||
                    $scope.item.num3 - 0 < 0
                ) {
                    alert("判断题数量有误！");
                    if ($scope.numscore.score.score3 <= 0) {
                        alert("判断题分数有误！");
                        return;
                    }
                    return;
                }
                if (
                    $scope.item.num3 - 0 < $scope.item.count[2] - 0 &&
                    $scope.item.num3 - 0 > 0
                ) {
                    if ($scope.numscore.score.score3 <= 0) {
                        alert("判断题分数有误！");
                        return;
                    }
                }
                if ($scope.numscore.score.score3 < 0) {
                    alert("判断题分数有误！");
                    return;
                }

                if (
                    $scope.item.num4 - 0 > $scope.item.count[3] - 0 ||
                    $scope.item.num4 - 0 < 0
                ) {
                    alert("填空题数量有误！");
                    if ($scope.numscore.score.score4 < 1) {
                        alert("填空题分数有误！");
                        return;
                    }
                    return;
                }
                if (
                    $scope.item.num4 - 0 < $scope.item.count[3] - 0 &&
                    $scope.item.num4 - 0 > 0
                ) {
                    if ($scope.numscore.score.score4 <= 0) {
                        alert("填空题分数有误！");
                        return;
                    }
                }
                if ($scope.numscore.score.score4 < 0) {
                    alert("填空题分数有误！");
                    return;
                }
                if ($scope.item.num5 - 0 < 0) {
                    alert("问答题数量有误！");
                    return;
                }

                if (!$scope.item.passGrade || $scope.item.passGrade <= 0) {
                    alert("及格分必须>=1");
                    return;
                }

                if ($scope.numscore.totalScore < item.passGrade) {
                    alert("及格分不得大于总分！");
                    // return;
                }
            }
            $scope.item.step = item.step + 1;
            if (item.step == 4) {
                $scope.blocked = true;
            }
            if (item.step == 3) {
                $http
                    .post(
                        "/ovu-pcos/pcos/newknowledge/subject/queryByIdsAndType",
                        {
                            ids: $scope.ids,
                            typeList: $scope.typeList.join(","),
                            deptId: $scope.item.deptId,
                            isPublicSubject: $scope.item.isPublicSubject
                        },
                        fac.postConfig
                    )
                    .success(function(res) {
                        $scope.item.count = res.data.countStr.split(",");

                        res.data.subjectDetail.forEach(v => {
                            $scope.item.ids.push(v.id);
                        });
                    });
            }

            if (item.step == 4) {
                var count =
                    $scope.item.num1 +
                    "," +
                    $scope.item.num2 +
                    "," +
                    $scope.item.num3 +
                    "," +
                    $scope.item.num4 +
                    "," +
                    $scope.item.num5;

                $http
                    .post(
                        "/ovu-pcos/pcos/newknowledge/subject/randomSubjects",
                        {
                            subjectIds: $scope.item.ids.join(","),
                            countStr: count
                        },
                        fac.postConfig
                    )
                    .success(function(res) {
                        $scope.pageModel = res.data;
                        $scope.pageModel.forEach(v => {
                            $scope.subjectIds.push(v.id);
                        });
                        $scope.pageModel.forEach(n => {
                            if (n.type == 1) {
                                n.score = $scope.numscore.score.score1;
                            } else if (n.type == 2) {
                                n.score = $scope.numscore.score.score2;
                            } else if (n.type == 3) {
                                n.score = $scope.numscore.score.score3;
                            } else if (n.type == 4) {
                                n.score = $scope.numscore.score.score4;
                            } else {
                            }
                        });
                    });
            }
        };

        //上一步
        $scope.before = function(form, item) {
            if ($scope.item.step == 3) {
                $scope.treeClass = copyTree;
            }
            if ($scope.item.step > 1) {
                $scope.item.step = item.step - 1;
            }
        };

        //添加题目
        $scope.selectSubject = function(pageNo) {
            $scope.blocked = true;
            $.extend($scope.search, {
                currentPage: pageNo || $scope.pageModel.currentPage || 1,
                pageSize: $scope.pageModel.pageSize || 10,
                deptId: $scope.item.deptId,
                isPublicSubject: $scope.item.isPublicSubject,
                subjectIds: $scope.subjectIds.join(",")
            });

            fac.getPageResult(
                "/ovu-pcos/pcos/newknowledge/subject/selectSubjects",
                $scope.search,
                function(data) {
                    $scope.data = data;

                    var copy = angular.extend(
                        {
                            deptId: $scope.item.deptId,
                            data: $scope.data,
                            pageModel: $scope.pageModel
                        },
                        sub
                    );
                    var modal = $uibModal.open({
                        animation: false,
                        size: "lg",
                        templateUrl:
                            "/view/knowledge/modal.select.subject.html",
                        controller: "selectSubjectCtrl",
                        resolve: {
                            copy: copy
                        }
                    });
                    modal.result.then(function(data) {
                        $scope.arr = data.arr;
                        $scope.pageModel = $scope.pageModel.concat($scope.arr);
                        $scope.subjectIds = [];

                        $scope.pageModel.forEach(n => {
                            $scope.subjectIds.push(n.id);
                        });

                        $scope.arr.forEach(v => {
                            if (v.type == 1) {
                                $scope.item.num1++;
                            }
                            if (v.type == 2) {
                                $scope.item.num2++;
                            }
                            if (v.type == 3) {
                                $scope.item.num3++;
                            }
                            if (v.type == 4) {
                                $scope.item.num4++;
                            }
                            if (v.type == 5) {
                                $scope.item.num5++;
                            }
                        });

                        $scope.calcluScore();
                    });
                }
            );
        };
        //保存试卷
        $scope.savePaper = function(item) {
            $scope.list = [];
            $scope.arr.forEach(n => {
                if (n.type == 1) {
                    n.score = $scope.numscore.score.score1;
                } else if (n.type == 2) {
                    n.score = $scope.numscore.score.score2;
                } else if (n.type == 3) {
                    n.score = $scope.numscore.score.score3;
                } else if (n.type == 4) {
                    n.score = $scope.numscore.score.score4;
                } else {
                }
            });
            $scope.isOk = true;
            $scope.pageModel.forEach(v => {
                if (v.type == 5 && !v.score) {
                    alert("问答题未设置分数！");
                    return ($scope.isOk = false);
                } else if (v.type == 5) {
                    $scope.list.push({
                        id: v.id,
                        score: v.score
                    });
                }
            });
            if (!$scope.isOk) {
                return $scope.isOk;
            }
            if (
                $scope.item.num1 - 0 > 0 &&
                $scope.numscore.score.score1 - 0 <= 0
            ) {
                alert("请设置单选题分数！");
                return;
            }
            if (
                $scope.item.num2 - 0 > 0 &&
                $scope.numscore.score.score2 - 0 <= 0
            ) {
                alert("请设置多选题分数！");
                return;
            }
            if (
                $scope.item.num3 - 0 > 0 &&
                $scope.numscore.score.score3 - 0 <= 0
            ) {
                alert("请设置判断题分数！");
                return;
            }
            if (
                $scope.item.num4 - 0 > 0 &&
                $scope.numscore.score.score4 - 0 <= 0
            ) {
                alert("请设置填空题分数！");
                return;
            }

            if ($scope.totalNum == 0) {
                alert("当前无题目，请添加题目！");
                return;
            }
            if ($scope.numscore.totalScore < item.passGrade) {
                alert("及格分不得大于总分！");
                return;
            }
            if ($scope.item.num5 > 0) {
                if (!$scope.numscore.score.score5) {
                    alert("请输入问答题分数");
                    return;
                }
            } else {
                $scope.numscore.score.score5 = 0;
            }

            $scope.score = [
                $scope.numscore.score.score1,
                $scope.numscore.score.score2,
                $scope.numscore.score.score3,
                $scope.numscore.score.score4
            ];
            $scope.num = [
                $scope.item.num1,
                $scope.item.num2,
                $scope.item.num3,
                $scope.item.num4,
                $scope.item.num5
            ];

            $.extend($scope.search, {
                text: item.text,
                paperClassificationId: $scope.item.paperClassificationId,
                description: item.description,
                deptId: $scope.item.deptId,
                // num:$scope.num.join(','),
                count: $scope.pageModel.length,
                totalGrade: $scope.numscore.totalScore,
                passGrade: item.passGrade,
                questionList: $scope.pageModel
            });
            $http
                .post("/ovu-pcos/pcos/newknowledge/paper/edit", $scope.search)
                .success(function(resp) {
                    if (resp.code == "0") {
                        msg(resp.msg);
                        $uibModalInstance.close();
                        // $scope.find(1)
                    } else {
                        alert(resp.msg);
                    }
                });
        };

        //升降排列
        $scope.sort = function(smallIndex, biggerIndex) {
            var small = $scope.pageModel[smallIndex];
            var big = $scope.pageModel[biggerIndex];

            $scope.pageModel[smallIndex] = big;
            $scope.pageModel[biggerIndex] = small;
        };

        //设置问答题分数
        $scope.getScore5 = function(v) {
            v = v - 0;
            console.log($scope.pageModel);
            // $scope.numscore.score.score5+=v
            // $scope.calcluScore()
            // console.log($scope.numscore.score.score5)
            var num = 0;
            $scope.isCompileFn = true;
            $scope.pageModel.forEach(q => {
                if (q.type == 5 && q.score !== undefined) {
                    q.score = q.score - 0 || 0;
                    num += q.score;
                } else {
                }
            });
            $("#question").text("");

            $scope.numscore.score.score5 = num;
            $scope.calcluScore();
            var compileFn = $compile("<div>{{numscore.score.score5}}</div>");
            // 传入scope，得到编译好的dom对象(已封装为jqlite对象)
            // 也可以用$scope.$new()创建继承的作用域
            var $dom = compileFn($scope);
            // 添加到文档中
            $dom.appendTo("#question");
        };

        $scope.numscore.score.score1 = 0;
        $scope.numscore.score.score2 = 0;
        $scope.numscore.score.score3 = 0;
        $scope.numscore.score.score4 = 0;
        $scope.numscore.score.score5 = 0;
        $scope.item.num1 = 0;
        $scope.item.num2 = 0;
        $scope.item.num3 = 0;
        $scope.item.num4 = 0;
        $scope.item.num5 = 0;
        $scope.calcluScore = function() {
            $scope.totalNum = 0;

            $scope.totalNum =
                $scope.item.num1 +
                $scope.item.num2 +
                $scope.item.num3 +
                $scope.item.num4 +
                $scope.item.num5;
            var totalScore = 0;
            if ($scope.numscore.score.score1) {
                totalScore += $scope.numscore.score.score1 * $scope.item.num1;
            }
            if ($scope.numscore.score.score2) {
                totalScore += $scope.numscore.score.score2 * $scope.item.num2;
            }
            if ($scope.numscore.score.score3) {
                totalScore += $scope.numscore.score.score3 * $scope.item.num3;
            }
            if ($scope.numscore.score.score4) {
                totalScore += $scope.numscore.score.score4 * $scope.item.num4;
            }
            if ($scope.numscore.score.score5) {
                totalScore += $scope.numscore.score.score5;
            }
            $scope.numscore.totalScore = totalScore;
        };

        $scope.del = function(detail) {
            $scope.pageModel.splice($scope.pageModel.indexOf(detail), 1);
            if (detail.type == 1) {
                $scope.item.num1--;
            }
            if (detail.type == 2) {
                $scope.item.num2--;
            }
            if (detail.type == 3) {
                $scope.item.num3--;
            }
            if (detail.type == 4) {
                $scope.item.num4--;
            }
            if (detail.type == 5) {
                $scope.item.num5--;
                detail.score = detail.score || 0;
                $scope.numscore.score.score5 -= detail.score;
            }

            //计算
            $scope.calcluScore();
        };

        $scope.cancel = function() {
            $uibModalInstance.dismiss("cancel");
        };
        // }
    });
    //复用
    app.controller("repeatedModalCtrl", function(
        $scope,
        $http,
        fac,
        $uibModal,
        $uibModalInstance,
        copy,
        $compile
    ) {
        $scope.pageModel = {};
        $scope.search = {};
        $scope.item = copy || {};
        $scope.item.ids = [];
        $scope.num = [];
        $scope.count = [];
        $scope.score = [];
        $scope.subjectIds = [];
        $scope.totalNum = 0;
        $scope.totalScore = 0;
        $scope.config = {
            edit: false,
            showCheckbox: true
        };

        $scope.numscore = {
            totalNum: 0,
            totalScore: 0,
            score: {}
        };

        $http
            .post(
                "/ovu-pcos/pcos/newknowledge/paper/detail",
                {
                    paperId: copy.id
                },
                fac.postConfig
            )
            .success(function(resp) {
                if (resp.code == "0") {
                    // $scope.find();
                    $scope.numscore.score.score5 = 0;
                    $scope.data = resp.data;
                    $scope.pageModel = resp.data.subjectDetail;
                    $scope.pageModel.forEach(v => {
                        $scope.subjectIds.push(v.id);
                        if (v.type == 5) {
                            $scope.numscore.score.score5 += v.paperScore - 0;
                        }
                    });
                    $scope.pageModel.forEach(n => {
                        if (n.type == 1) {
                            $scope.score1 = n.paperScore;
                        } else if (n.type == 2) {
                            $scope.score2 = n.paperScore;
                        } else if (n.type == 3) {
                            $scope.score3 = n.paperScore;
                        } else if (n.type == 4) {
                            $scope.score4 = n.paperScore;
                        } else {
                        }
                    });
                    $scope.count = $scope.data.countStr.split(",");
                    // $scope.score=$scope.data.score.split(',')
                    $scope.count1 = $scope.count[0];
                    $scope.count2 = $scope.count[1];
                    $scope.count3 = $scope.count[2];
                    $scope.count4 = $scope.count[3];
                    $scope.count5 = $scope.count[4];
                    // $scope.score1=$scope.score[0]
                    // $scope.score2=$scope.score[1]
                    // $scope.score3=$scope.score[2]
                    // $scope.score4=$scope.score[3]
                    if ($scope.count[0] == 0) {
                        $scope.score1 = 0;
                    }
                    if ($scope.count[1] == 0) {
                        $scope.score2 = 0;
                    }
                    if ($scope.count[2] == 0) {
                        $scope.score3 = 0;
                    }
                    if ($scope.count[3] == 0) {
                        $scope.score4 = 0;
                    }
                    if ($scope.count[4] == 0) {
                        $scope.score5 = 0;
                    }
                    if ($scope.count.length == 4) {
                        $scope.count5 = 0;
                    }
                    $scope.changeScore = function() {
                        $scope.totalScore =
                            ($scope.score1 - 0) * ($scope.count1 - 0) +
                            ($scope.score2 - 0) * ($scope.count2 - 0) +
                            ($scope.score3 - 0) * ($scope.count3 - 0) +
                            ($scope.score4 - 0) * ($scope.count4 - 0) +
                            ($scope.numscore.score.score5 - 0);
                    };

                    $scope.totalNum =
                        $scope.count1 -
                        0 +
                        ($scope.count2 - 0) +
                        ($scope.count3 - 0) +
                        ($scope.count4 - 0) +
                        ($scope.count5 - 0);
                    if ($scope.count5 == 0) {
                        $scope.count5 = 0;
                    }
                    // msg(resp.msg);
                    $scope.changeScore();
                } else {
                    alert(resp.msg);
                }
            });

        //设置问答题分数
        $scope.getScore5 = function(v) {
            var num = 0;
            $scope.isCompileFn = true;

            $scope.pageModel.forEach(q => {
                if (q.type == 5) {
                    q.paperScore = q.paperScore - 0 || 0;
                    num += q.paperScore;
                }
            });
            $("#question").text("");
            $scope.numscore.score.score5 = num;
            $scope.changeScore();
            var compileFn = $compile("<div>{{numscore.score.score5}}</div>");
            // 传入scope，得到编译好的dom对象(已封装为jqlite对象)
            // 也可以用$scope.$new()创建继承的作用域
            var $dom = compileFn($scope);
            // 添加到文档中
            $dom.appendTo("#question");
        };

        //添加题目
        $scope.selectSubject = function(pageNo) {
            if ($scope.item.deptId == "b549f6d04b3b42a599ac0b872027e294") {
                $scope.item.isPublicSubject = 1;
            } else {
                $scope.item.isPublicSubject = 0;
            }
            $.extend($scope.search, {
                currentPage: pageNo || $scope.pageModel.currentPage || 1,
                pageSize: $scope.pageModel.pageSize || 10,
                deptId: $scope.item.deptId,
                isPublicSubject: $scope.item.isPublicSubject,
                subjectIds: $scope.subjectIds.join(",")
            });

            fac.getPageResult(
                "/ovu-pcos/pcos/newknowledge/subject/selectSubjects",
                $scope.search,
                function(data) {
                    $scope.data = data;

                    var copy = angular.extend({
                        data: $scope.data,
                        pageModel: $scope.pageModel,
                        isPublicSubject: $scope.item.isPublicSubject,
                        deptId: $scope.item.deptId
                    });
                    var modal = $uibModal.open({
                        animation: false,
                        size: "lg",
                        templateUrl:
                            "/view/knowledge/modal.select.subject.html",
                        controller: "selectSubjectCtrl",
                        resolve: {
                            copy: copy
                        }
                    });
                    modal.result.then(function(data) {
                        $scope.item.id = data.id;
                        $scope.arr = data.arr;
                        $scope.pageModel = $scope.pageModel.concat($scope.arr);
                        $scope.subjectIds = [];

                        $scope.pageModel.forEach(n => {
                            $scope.subjectIds.push(n.id);
                        });

                        $scope.arr.forEach(v => {
                            if (v.type == 1) {
                                $scope.count1++;
                            }
                            if (v.type == 2) {
                                $scope.count2++;
                            }
                            if (v.type == 3) {
                                $scope.count3++;
                            }
                            if (v.type == 4) {
                                $scope.count4++;
                            }
                            if (v.type == 5) {
                                $scope.count5++;
                            }
                        });
                        $scope.totalNum =
                            $scope.count1 -
                            0 +
                            ($scope.count2 - 0) +
                            ($scope.count3 - 0) +
                            ($scope.count4 - 0) +
                            ($scope.count5 - 0);
                        $scope.changeScore();
                    });
                }
            );
        };

        //保存试卷
        $scope.savePaper = function(item) {
            $scope.list = [];

            $scope.pageModel.forEach(n => {
                if (n.type == 1) {
                    n.paperScore = n.score = $scope.score1;
                } else if (n.type == 2) {
                    n.paperScore = n.score = $scope.score1;
                } else if (n.type == 3) {
                    n.paperScore = n.score = $scope.score3;
                } else if (n.type == 4) {
                    n.paperScore = n.score = $scope.score4;
                } else {
                }
            });
            $scope.isOk = true;
            $scope.pageModel.forEach(v => {
                if (v.type == 5 && !v.paperScore) {
                    alert("问答题未设置分数！");
                    return ($scope.isOk = false);
                } else if (v.type == 5) {
                    $scope.list.push({
                        id: v.id,
                        score: v.paperScore
                    });
                }
                v.score = v.paperScore;
            });
            if (!$scope.isOk) {
                return $scope.isOk;
            }
            if ($scope.totalNum == 0) {
                alert("当前无题目，请添加题目！");
                return;
            }
            if ($scope.count1 - 0 > 0 && $scope.score1 - 0 <= 0) {
                alert("请设置单选题分数！");
                return;
            }
            if ($scope.count2 - 0 > 0 && $scope.score2 - 0 <= 0) {
                alert("请设置多选题分数！");
                return;
            }
            if ($scope.count3 - 0 > 0 && $scope.score3 - 0 <= 0) {
                alert("请设置判断题分数！");
                return;
            }
            if ($scope.count4 - 0 > 0 && $scope.score4 - 0 <= 0) {
                alert("请设置填空题分数！");
                return;
            }
            if ($scope.count5 > 0) {
                if (!$scope.numscore.score.score5) {
                    alert("请输入问答题分数");
                    return;
                }
            }
            if ($scope.totalScore < item.passGrade) {
                alert("及格分不得大于总分！");
                // return
            }

            $scope.score = [
                $scope.score1 - 0,
                $scope.score2 - 0,
                $scope.score3 - 0,
                $scope.score4 - 0
            ];
            $scope.num = [
                $scope.count1 - 0,
                $scope.count2 - 0,
                $scope.count3 - 0,
                $scope.count4 - 0
            ];

            $.extend($scope.search, {
                text: item.text,
                paperClassificationId: $scope.item.paperClassificationId,
                description: item.description,
                deptId: $scope.item.deptId,
                count: $scope.pageModel.length,
                totalGrade: $scope.totalScore,
                passGrade: item.passGrade,
                questionList: $scope.pageModel
            });
            $http
                .post("/ovu-pcos/pcos/newknowledge/paper/edit", $scope.search)
                .success(function(resp) {
                    if (resp.code == "0") {
                        $uibModalInstance.close();
                        msg(resp.msg);
                    } else {
                        alert(resp.msg);
                    }
                });
        };

        //升降排列
        $scope.sort = function(smallIndex, biggerIndex) {
            var small = $scope.pageModel[smallIndex];
            var big = $scope.pageModel[biggerIndex];

            $scope.pageModel[smallIndex] = big;
            $scope.pageModel[biggerIndex] = small;
        };

        $scope.del = function(item) {
            $scope.pageModel.splice($scope.pageModel.indexOf(item), 1);
            if (item.type == 1) {
                $scope.count1--;
                if ($scope.count1 == 0) {
                    $scope.score1 = 0;
                }
            }
            if (item.type == 2) {
                $scope.count2--;
                if ($scope.count2 == 0) {
                    $scope.score2 = 0;
                }
            }
            if (item.type == 3) {
                $scope.count3--;
                if ($scope.count3 == 0) {
                    $scope.score3 = 0;
                }
            }
            if (item.type == 4) {
                $scope.count4--;
                if ($scope.count4 == 0) {
                    $scope.score4 = 0;
                }
            }
            if (item.type == 5) {
                $scope.count5--;
                item.paperScore = item.paperScore || 0;
                $scope.numscore.score.score5 -= item.paperScore;
            }
            $scope.totalNum =
                $scope.count1 -
                0 +
                ($scope.count2 - 0) +
                ($scope.count3 - 0) +
                ($scope.count4 - 0) +
                ($scope.count5 - 0);
            //计算
            $scope.changeScore();
        };

        $scope.cancel = function() {
            $uibModalInstance.dismiss("cancel");
        };
        // }
    });

    //添加题目
    app.controller("selectSubjectCtrl", function(
        $scope,
        $http,
        fac,
        $uibModal,
        $uibModalInstance,
        copy
    ) {
        $scope.search = {};
        $scope.typeList = [];
        $scope.arr = [];
        $scope.item = copy || {};
        $scope.pageModel = copy.pageModel;
        $scope.num1 = 0;
        $scope.num2 = 0;
        $scope.num3 = 0;
        $scope.num4 = 0;
        $scope.num5 = 0;
        $scope.subjectIds = [];
        var pageModelChecked;
        $scope.pageModel.forEach(v => {
            $scope.subjectIds.push(v.id);
        });
        //获取知识体系分类
        function getParkTree() {
            $http
                .post(
                    "/ovu-pcos/pcos/newknowledge/hierarchy/list",
                    fac.postConfig
                )
                .success(function(res) {
                    $scope.treeClass = res.data;
                });
        }
        getParkTree();

        //点击选择知识体系分类中的题目
        $scope.selectAllClass = function() {
            var copy = angular.extend(
                {
                    treeClass: $scope.treeClass
                },
                copy
            );

            var modal = $uibModal.open({
                animation: false,
                size: "lg",
                templateUrl: "./knowledge/selectAllClass.html",
                controller: "selectAllClassCtrl",
                resolve: {
                    sub: copy
                }
            });
            modal.result.then(function(data) {
                $scope.item.id = data.id;
                $scope.textClass = data.textClass;

                $scope.find(1);
            });
        };

        //全部
        $scope.classListAll = function() {
            $scope.item.id = "";
            $scope.textClass = "";
            $scope.find(1);
        };

        //不限类型
        $scope.typeListAll = function() {
            $scope.typeList = [];
            $scope.find(1);
        };
        //列表题目查询
        $scope.find = function(pageNo) {
            $.extend($scope.search, {
                currentPage: pageNo || $scope.pageModel.currentPage || 1,
                pageSize: $scope.pageModel.pageSize || 10,
                subjectIds: $scope.subjectIds.join(","),
                typeList: $scope.typeList.join(","),
                isPublicSubject: $scope.item.isPublicSubject,
                deptId: $scope.item.deptId,
                ids: $scope.item.id
            });
            fac.getPageResult(
                "/ovu-pcos/pcos/newknowledge/subject/selectSubjects",
                $scope.search,
                function(data) {
                    $scope.pageModel = data;
                    $scope.pageModel.checked = pageModelChecked;
                    $scope.arr.length &&
                        $scope.arr.forEach(v => {
                            $scope.pageModel.data.forEach(item => {
                                if (v.id == item.id) {
                                    item.checked = true;
                                }
                            });
                        });
                }
            );
        };
        $scope.find(1);

        //选中类型
        $scope.checkType = function(flag) {
            if ($scope.typeList.length && $scope.typeList.indexOf(flag) > -1) {
                $scope.typeList.splice($scope.typeList.indexOf(flag), 1);
            } else {
                $scope.typeList.push(flag);
            }
            $scope.find(1);
        };
        //查看题目详情
        $scope.look = function(item, show) {
            if (show) {
                this.show = show;
            }

            $http
                .post(
                    "/ovu-pcos/pcos/newknowledge/subject/subjectDetail",
                    { id: item.id },
                    fac.postConfig
                )
                .success(function(resp) {
                    if (resp.code == "0") {
                        var copy = angular.extend(
                            { data: resp.data, show: show },
                            item
                        );
                        var modal = $uibModal.open({
                            animation: false,
                            size: "",
                            templateUrl:
                                "knowledge/subject/modal.editSubject.html",
                            controller: "editSubjectCtrl",
                            resolve: {
                                sub: copy
                            }
                        });
                        // msg(resp.msg);
                    } else {
                        alert(resp.msg);
                    }
                });
        };
        //选中题目
        $scope.checkOne = function(item) {
            item.checked = !item.checked;
            if (item.checked) {
                $scope.arr.push(item);
                if (item.type == 1) {
                    $scope.num1++;
                }
                if (item.type == 2) {
                    $scope.num2++;
                }
                if (item.type == 3) {
                    $scope.num3++;
                }
                if (item.type == 4) {
                    $scope.num4++;
                }
                if (item.type == 5) {
                    $scope.num5++;
                }
                $scope.totalNum =
                    $scope.num1 +
                    $scope.num2 +
                    $scope.num3 +
                    $scope.num4 +
                    $scope.num5s;
            } else {
                var index = $scope.arr.findIndex(v => {
                    return v.id == item.id;
                });
                $scope.arr.splice(index, 1);
                item.checked = false;
                if (item.type == 1) {
                    $scope.num1--;
                }
                if (item.type == 2) {
                    $scope.num2--;
                }
                if (item.type == 3) {
                    $scope.num3--;
                    $scope.type = item.type;
                }
                if (item.type == 4) {
                    $scope.num4--;
                }
                if (item.type == 5) {
                    $scope.num5--;
                }
                $scope.totalNum =
                    $scope.num1 +
                    $scope.num2 +
                    $scope.num3 +
                    $scope.num4 +
                    $scope.num5;
            }
        };
        //选中所有题目
        $scope.checkAll = function() {
            // $scope.arr=[]

            $scope.pageModel.checked = !$scope.pageModel.checked;

            if ($scope.pageModel.checked) {
                $scope.num1 = 0;
                $scope.num2 = 0;
                $scope.num3 = 0;
                $scope.num4 = 0;
                $scope.num5 = 0;
                $scope.pageModel.data.forEach(v => {
                    $scope.arr.push(v);
                });
                let newobj = {};
                $scope.arr = $scope.arr.reduce((preVal, curVal) => {
                    newobj[curVal.id]
                        ? ""
                        : (newobj[curVal.id] = preVal.push(curVal));
                    return preVal;
                }, []);
                $scope.arr.forEach(v => {
                    v.checked = true;
                    if (v.type == 1) {
                        $scope.num1++;
                    }
                    if (v.type == 2) {
                        $scope.num2++;
                    }
                    if (v.type == 3) {
                        $scope.num3++;
                    }
                    if (v.type == 4) {
                        $scope.num4++;
                    }
                    if (v.type == 5) {
                        $scope.num5++;
                    }
                });
                $scope.totalNum =
                    $scope.num1 +
                    $scope.num2 +
                    $scope.num3 +
                    $scope.num4 +
                    $scope.num5;
            } else {
                $scope.pageModel.checked = false;
                $scope.pageModel.data.forEach(v => {
                    v.checked = false;
                    var index = $scope.arr.findIndex(f => {
                        return f.id == v.id;
                    });
                    $scope.arr.splice(index, 1);
                });
                $scope.num1 = 0;
                $scope.num2 = 0;
                $scope.num3 = 0;
                $scope.num4 = 0;
                $scope.num5 = 0;

                $scope.arr.forEach(v => {
                    v.checked = true;
                    if (v.type == 1) {
                        $scope.num1++;
                    }
                    if (v.type == 2) {
                        $scope.num2++;
                    }
                    if (v.type == 3) {
                        $scope.num3++;
                    }
                    if (v.type == 4) {
                        $scope.num4++;
                    }
                    if (v.type == 5) {
                        $scope.num5++;
                    }
                });
                $scope.totalNum =
                    $scope.num1 +
                    $scope.num2 +
                    $scope.num3 +
                    $scope.num4 +
                    $scope.num5;
            }
        };

        //保存
        $scope.save = function() {
            var tempObj = {
                arr: $scope.arr
            };
            $uibModalInstance.close(tempObj);
            if ($scope.arr.length != 0) {
                msg("题目添加成功！");
            } else {
                alert("未选择题目");
                return;
            }
        };

        //关闭
        $scope.cancel = function() {
            $uibModalInstance.dismiss("cancel");
        };
    });

    app.controller("showPersonsCtrl", function(
        $scope,
        $http,
        fac,
        $uibModalInstance,
        sub
    ) {
        $scope.item = sub || {};

        $http
            .post(
                "/ovu-pcos/pcos/newknowledge/paper/detail",
                {
                    id: sub.id
                },
                fac.postConfig
            )
            .success(function(resp) {
                if (resp.code == 0) {
                    $scope.item = resp.data;
                } else {
                    alert("获取详情失败！");
                }
            });

        $scope.cancel = function() {
            $uibModalInstance.dismiss("cancel");
        };
    });
    //评分
    app.controller("gradeModalCtrl", function(
        $scope,
        $http,
        fac,
        $uibModalInstance,
        sub
    ) {
        $scope.item = sub || {};
        $scope.subjectIds = [];
        $scope.score = [];
        $scope.pageModel = sub.subjectDetail;

        $scope.getScore5 = function(v, p) {
            if (v > p) {
                $scope.item.subjectDetail.forEach(n => {
                    if (n.score == v) {
                        n.score = "";
                    }
                });
                alert("评分不得高于问答题分数！");
                return;
            }
        };

        $scope.save = function(sub) {
            $scope.score = [];
            $scope.subjectIds = [];
            sub.subjectDetail.forEach(n => {
                $scope.subjectIds.push(n.id), $scope.score.push(n.score);
            });
            $http
                .post(
                    "/ovu-pcos/pcos/newknowledge/result/marking",
                    {
                        subjectIds: $scope.subjectIds.join(","),
                        score: $scope.score.join(","),
                        id: sub.id
                    },
                    fac.postConfig
                )
                .success(function(data) {
                    if (data.code == 0) {
                        msg("评分成功！");
                        $uibModalInstance.close();
                    } else {
                        alert("评分失败！");
                    }
                });
        };
        $scope.cancel = function() {
            $uibModalInstance.dismiss("cancel");
        };
    });

    //考试查看详情
    app.controller("subjectDetailCtrl", function(
        $scope,
        $http,
        fac,
        $uibModalInstance,
        sub
    ) {
        $scope.search = {};
        $scope.item = sub || {};

        $scope.show = sub.show;

        function getParkTree() {
            $http
                .post(
                    "/ovu-pcos/pcos/newknowledge/hierarchy/list",
                    fac.postConfig
                )
                .success(function(res) {
                    $scope.treeClass = res.data;
                });
        }
        getParkTree();

        $http
            .post(
                "/ovu-pcos/pcos/newknowledge/result/detail",
                { resultId: $scope.item.id },
                fac.postConfig
            )
            .success(function(resp) {
                if (resp.code == "0") {
                    $scope.pageModel = resp.data;
                    $scope.pageModel &&
                        $scope.pageModel.subjectDetail.length &&
                        $scope.pageModel.subjectDetail.forEach((v, i) => {
                            if (v.type == 4) {
                                //返回值 _$fffd$_$cffc$_
                                v.chooseCopy = v.choose.split("_$"); // ["", "fffd$", "cffc$_"]
                                v.chooseCopy = v.chooseCopy.join(","); //,fffd$,cffc$_

                                v.chooseCopy = v.chooseCopy.replace(/,/g, ""); //fffd$cffc$_
                                v.chooseCopy = v.chooseCopy.replace(/_/g, ""); //fffd$cffc$

                                if (
                                    v.chooseCopy.lastIndexOf("$") ==
                                    v.chooseCopy.length - 1
                                ) {
                                    //截取末尾的 $
                                    v.chooseCopy = v.chooseCopy.substr(
                                        0,
                                        v.chooseCopy.length - 1
                                    ); //fffd$cffc
                                }
                                if (v.chooseCopy.indexOf("$") == 0) {
                                    //截取开头的 $
                                    v.chooseCopy = v.chooseCopy.substr(
                                        1,
                                        v.chooseCopy.length - 1
                                    ); //fffd$cffc
                                }

                                v.chooseCopy = v.chooseCopy.split("$"); //["fffd", "cffc"]
                                var arr = [];
                                v.chooseCopy.length &&
                                    v.chooseCopy.forEach(cho => {
                                        cho = "(" + cho + ")";
                                        arr.push(cho);
                                    });
                                v.chooseNewArr = arr;
                            }
                        });
                } else {
                    alert(resp.msg);
                }
            });
        $scope.cancel = function() {
            $uibModalInstance.dismiss("cancel");
        };
    });
    //题目查看详情
    app.controller("editSubjectCtrl", function(
        $scope,
        $http,
        fac,
        $uibModalInstance,
        sub
    ) {
        $scope.search = {};
        $scope.item = sub || {};

        $scope.show = sub.show;

        $scope.cancel = function() {
            $uibModalInstance.dismiss("cancel");
        };
    });
})();
