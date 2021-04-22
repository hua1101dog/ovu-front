// 题库管理

(function () {
    "use strict";
    var app = angular.module("angularApp");
    app.controller('subjectCtrl', function ($scope, $rootScope, $http, $filter, $uibModal, fac) {
        document.title = "题库管理";
        var slectedIndex
        if ($rootScope.hasPower("编辑")) {
            $scope.config1 = {
                edit: true,
                showCheckbox: false,
            };
        }
        $scope.config = {
            edit: false,
            showCheckbox: false,
        }
        $scope.pageModel = {};
        $scope.search = {};
        $scope.treeClass = [];
        $scope.types = [];
        $scope.arr = []
        $scope.subjectIds = []
        app.modulePromiss.then(function () {
            $scope.$watch('dept.id', function (deptId, oldValue) {
                if (deptId) {
                    $scope.search.deptId = deptId;

                }
                if ($rootScope.dept.pid == '0') {
                    $scope.search.deptId = deptId;
                    $scope.isPublicSubject = 1
                    $scope.pid = 0
                    $scope.config1 = {
                        edit: true,
                        showCheckbox: false,
                    }
                    $scope.changeIndex(0)


                } else if ($rootScope.dept.pid != '0') {
                    $scope.pid = $rootScope.dept.pid
                    $scope.search.deptId = deptId;
                    $scope.isPublicSubject = 0
                    $scope.config1 = {
                        edit: false,
                        showCheckbox: false,
                    }
                    $scope.changeIndex(0)
                }
                getParkTree()
                $scope.changeIndex(0)
                $scope.find()

            })

        })

        $scope.changeIndex = function (index) {
            slectedIndex = index
            $scope.slectedIndex = index
            $scope.subjectType = index;
            if ($scope.subjectType == 1) {
                $scope.config = {
                    edit: false,
                    showCheckbox: false,
                }
            }
            $scope.find()
        }


        $scope.addTopNode = function () {
            $scope.treeClass.push({
                state: {
                    edit: true
                },
                copy: {
                    // subjectType:$scope.subjectType,
                    parentId: 0,
                    // isPublicSubject:$scope.isPublicSubject
                }
            });
        }

        $scope.addSon = function (node) {
            console.log(node)
            if(node.pids.split(',').length==5){
                // $scope.config1={
                //     edit: false,
                // showCheckbox: false,
                // }
                alert('最多只能五级节点！')
                return
            }
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
                    subjectType: $scope.subjectType,
                    isPublicSubject: $scope.isPublicSubject
                }
            });

        }

        function getNodeById(did) {
            if (!did) {
                return false;
            }
            var node = fac.getNodeById($scope.treeClass, did);
            return node;
        }

        $scope.selectNode = function (search, node) {
            $scope.arr=[]
            if (node.state.selected) {
                $scope.curNode = node;
            } else {
                delete $scope.curNode;
            }
            var arr = []
            $scope.ids = []
            arr.push($scope.curNode)
            fac.treeToFlat(arr).forEach((n) => {
                $scope.ids.push(n.id)
            })
            $scope.ids = $scope.ids.join(',')

            $scope.changeIndex(slectedIndex)
        }

        function getParkTree(pageNo, node) {
            $http.post('/ovu-pcos/pcos/newknowledge/hierarchy/list', fac.postConfig).success(function (res) {
                $scope.treeClass = res.data
              
                $.extend($scope.search, {
                    currentPage: pageNo || $scope.pageModel.currentPage || 1,
                    pageSize: $scope.pageModel.pageSize || 10,
                    isPublicSubject: $scope.isPublicSubject,
                    ids: $scope.ids,
                    subjectType: $scope.subjectType,
                    typeList: $scope.typeList.join(',')
                });


                // $scope.selectNode($scope.search, $scope.treeClass[0])
            })
            $scope.search.text && delete $scope.search.text
            $scope.search.id && delete  $scope.search.id
            $scope.search.ids && delete $scope.search.ids
            $scope.ids && delete $scope.ids
            $scope.typeList=[]
            $scope.search.question && delete $scope.search.question
        }
        //删除项目分类
        $scope.delNode = function (node) {
            if (node.nodes && node.nodes.length) {
                alert("此节点有下级节点,不能删除！");
            } else {
                confirm("确定删除 " + node.text + "?", function () {
                    $http.post("/ovu-pcos/pcos/newknowledge/hierarchy/delete", {
                        id: node.id
                    }, fac.postConfig).success(function (resp) {
                        if (resp.code == 0) {
                            getParkTree();
                            if ($scope.curNode == node) {
                                delete $scope.curNode;
                            }
                            var parent = getNodeById(node.parentId);
                            if (parent) {
                                parent.nodes.splice(parent.nodes.indexOf(node), 1)
                            } else {
                                $scope.treeClass.splice($scope.treeClass.indexOf(node), 1)
                            }
                        } else {
                            //alert(resp.error);
                            alert(resp.msg);
                        }
                    });
                    //zg end
                })
            }
        }
        $scope.save = function (node) {
            if (!node.copy.text) {
                alert('名称不能为空');
                return;
            }

            var filterData; //需要过滤的数据
            if (node.parentId && node.parentId != 0) {
                //子分类(在同级节点是否重复)
                var pnode = fac.treeToFlat($scope.treeClass).find(function (n) {
                    return (n.id == node.parentId)
                });
                filterData = pnode.nodes;
            } else {
                //第一级
                filterData = $scope.treeClass;
            }
            var findData = filterData.find(function (n) {
                return (n.id != node.copy.id && n.text == node.copy.text)
            });
            if (findData) {
                alert('分类名称已存在');
                return;
            }


            var park = {};
            // park.isPublicSubject=node.copy.isPublicSubject
            park.id = node.copy.id;
            park.parentId = node.copy.parentId;
            park.deptId = $scope.search.deptId
            park.text = node.copy.text;
            // park.parkNo = node.copy.code;
            // park.subjectType=node.copy.subjectType
            // node.state.expanded=true;
            $http.post("/ovu-pcos/pcos/newknowledge/hierarchy/edit", park, fac.postConfig).success(function (resp) {
                if (resp.code == 0) {
                    // msg(resp.msg);
                    getParkTree();
                } else {
                    alert(resp.msg);
                }
            });
            //zg end
        }
        $scope.undo = function (node) {
            if (node.id) {
                node.state.edit = false;
            } else {
                var parent = getNodeById(node.parentId);
                if (parent) {
                    parent.nodes.splice(parent.nodes.indexOf(node), 1)
                } else {
                    $scope.treeClass.splice($scope.treeClass.indexOf(node), 1)
                }
            }
        }
        $scope.editNode = function (node) {
            node.copy = angular.extend({}, node);
            node.copy.parkType = '0';
            node.copy.SORT = $scope.treeClass.length;
            node.state = node.state || {};
            node.state.edit = true;
        }
        //列表查询
        $scope.find = function (pageNo) {
            $.extend($scope.search, {
                currentPage: pageNo || $scope.pageModel.currentPage || 1,
                pageSize: $scope.pageModel.pageSize || 10,
                isPublicSubject: $scope.isPublicSubject,
                ids: $scope.ids,
                subjectType: $scope.subjectType,
                typeList: $scope.typeList.join(','),
                deptId: $scope.search.deptId
            });
            if (!$scope.search.text) {
                $scope.search.ids && delete $scope.search.ids
            }
            fac.getPageResult("/ovu-pcos/pcos/newknowledge/subject/list", $scope.search, function (data) {
                $scope.pageModel = data;
            });
        };

        //导入
        $scope.uploadText = function () {
            var param = {
                deptId: $scope.search.deptId,
                isPublicSubject: $scope.isPublicSubject
            }
            uploadExcel(param, function (resp) {
                if (resp.passCode == 0) {
                    rtmsg();
                    $scope.find(1);
                }
            })

            function rtmsg() {
                $scope.worktaskMsg = "导入成功！";
                msg("导入成功！");
                $scope.$apply();
            }
        }

        function uploadExcel(params, fn) {
            fac.upload({
                url: "/ovu-pcos/pcos/newknowledge/subject/importSubject",
                params: params,
                accept: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
            }, function (resp) {
                if (resp.success) {
                    fn && fn(resp);
                } else {
                    alert(resp.error);
                }
            })
        }

        //批量删除题库
        $scope.delAll = function () {
            $scope.arr.forEach((v) => {
                $scope.subjectIds.push(v.id)
            })
            $http.post("/ovu-pcos/pcos/newknowledge/subject/delete", {
                ids: $scope.subjectIds.join(',')
            }, fac.postConfig).success(function (resp) {
                if (resp.code == "0") {
                    $scope.find();
                    // msg(resp.msg);
                    $scope.subjectIds = []
                    $scope.arr = []
                } else {
                    alert(resp.msg);
                }
            });
        };
        //删除题库
        $scope.del = function (item) {
            del([item.id]);

        }

        function del(ids) {
            confirm("确认删除选中的" + ids.length + "条记录?", function () {
                $http.post("/ovu-pcos/pcos/newknowledge/subject/delete", {
                    "ids": ids.join(',')
                }, fac.postConfig).success(function (resp) {
                    if (resp.code == "0") {
                        $scope.find();
                        $scope.subjectIds = []
                        $scope.arr = []
                    } else {
                        alert(resp.msg);
                    }
                })
            });
        }

        //下载模板
        $scope.downloadFile = function () {
            var url = "/ovu-pcos/pcos/newknowledge/subject/downloadExcel";
            getBlankTmpl(url);
        }

        function getBlankTmpl(url, type) {
            var elemIF = document.createElement("iframe");
            elemIF.src = url + "?type=" + type;
            elemIF.style.display = "none";
            document.body.appendChild(elemIF);
        }

        //是否公开
        $scope.isPublic = function (item) {
            var isPublic = (item.isPublic == 0 ? '1' : '0');
            $http.post("/ovu-pcos/pcos/newknowledge/subject/publicSelected", {
                subjectIds: item.id,
                isPublic: isPublic
            }, fac.postConfig).success(function (resp) {
                if (resp.code == "0") {
                    $scope.find(1);
                    // msg(resp.msg);
                } else {
                    alert(resp.msg);
                }
            });
        }
        //新增、编辑、查看详情
        $scope.showEditModal = function (sub, show) {
            var tree = []
            if (show) {
                //查看
                this.show = show;
            }
            $http.post('/ovu-pcos/pcos/newknowledge/hierarchy/list', fac.postConfig).success(function (res) {
                tree = res.data
                var copy = $.extend({
                    treeClass: tree,
                    isPublicSubject: $scope.isPublicSubject,
                    show: show
                }, sub);

                copy.isPublic = (copy.equipment_id ? 1 : 0);
                copy.parkId = $scope.search.parkId || '';
                copy.deptId = $scope.search.deptId

                var modal = $uibModal.open({
                    size: 'lg',
                    templateUrl: '/view/knowledge/subject/modal.editSubject.html',
                    controller: 'editSubjectCtrl111',
                    resolve: {
                        copy: copy
                    }
                });
                modal.result.then(function () {
                    $scope.find();
                });
            })




        }
        //选中所有题目
        $scope.checkAll = function (data) {
            data.checked = !data.checked;
            data.data.forEach(function (n) {
                n.checked = data.checked
                var isSelected = false;
                $scope.arr && $scope.arr.forEach(function (person) {
                    if (n.id == person.id) {
                        isSelected = true;
                    }

                })
                //在编辑状态下如果在编辑前没有被选中的才加入
                if (!isSelected) {
                    $scope.arr.push(n);
                }
                if (!n.checked && isSelected) {
                    var i = 0;
                    $scope.arr.forEach(function (v) {
                        i++;
                        if (v.id == n.id) {
                            $scope.arr.splice(i - 1, 1);
                        }
                    })

                }
            });

        }

        //选中题目
        $scope.checkOne = function (item) {
            item.checked = !item.checked
            if (item.checked) {
                $scope.arr.push(item)
            } else {
                var index = $scope.arr.findIndex(v => {
                    return v.id == item.id
                })
                $scope.arr.splice(index, 1)
            }
        }
        $scope.typeList = []
        //选中类型
        $scope.checkType = function (flag) {
            if ($scope.typeList.length && $scope.typeList.indexOf(flag) > -1) {
                $scope.typeList.splice($scope.typeList.indexOf(flag), 1)
            } else {
                $scope.typeList.push(flag)
                // $scope.typeList=$scope.typeList.join(',')                
            }
            $scope.find(1)
        }

        //移动
        $scope.moveEditModal = function (show) {
            var tree = []
            $scope.arr.forEach((v) => {
                $scope.subjectIds.push(v.id)
            })
            $http.post('/ovu-pcos/pcos/newknowledge/hierarchy/list', fac.postConfig).success(function (res) {
                tree = res.data
                var copy = angular.extend({
                    treeClass: tree,
                    subjectIds: $scope.subjectIds
                });
                copy.parkId = $scope.search.parkId || '';
                copy = angular.extend(copy, {
                    show: show
                });
                var modal = $uibModal.open({
                    animation: false,
                    size: 'lg',
                    templateUrl: '/view/knowledge/subject/moveEditModal.html',
                    controller: 'editSubjectCtrl111',
                    resolve: {
                        copy: copy,

                    }
                })
                modal.result.then(function () {
                    $scope.arr=[]
                    $scope.subjectIds=[]
                    $scope.find();
                   

                });
            })

        }


        //批量公开
        $scope.openAll = function () {
            if ($scope.arr.length == 0) {
                alert('未选需要公开题目！')
                return;
            } else {
                $scope.arr.forEach((v) => {
                    $scope.subjectIds.push(v.id)
                })
            }
            $http.post("/ovu-pcos/pcos/newknowledge/subject/publicSelected", {
                subjectIds: $scope.subjectIds.join(','),
                isPublic: 1
            }, fac.postConfig).success(function (resp) {
                if (resp.code == "0") {
                    $scope.arr=[]
                    $scope.subjectIds=[]
                    msg(resp.msg);
                    $scope.find();
                    
                } else {
                    alert(resp.msg);
                }
            });
        }
        //批量收录
        $scope.takeInModal = function (sub) {

            function getParkTree() {
                $http.post('/ovu-pcos/pcos/newknowledge/hierarchy/list', fac.postConfig).success(function (res) {
                    $scope.treeClass = res.data
                })
            }
            getParkTree()
            $scope.arr.forEach((v) => {
                $scope.subjectIds.push(v.id)
            })
            var copy = angular.extend({
                ids: $scope.subjectIds,
                treeClass: $scope.treeClass,
                deptId: $scope.search.deptId
            }, sub);
            copy = angular.extend(copy);
            var modal = $uibModal.open({
                animation: false,
                size: 'lg',
                templateUrl: '/view/knowledge/subject/takeInModal.html',
                controller: 'takeSubjectCtrl',
                resolve: {
                    copy: copy
                }
            });
            modal.result.then(function () {
                $scope.arr=[]
                $scope.subjectIds=[]
                $scope.find();

            });

        }

        $scope.check = function (node) {
            node.state = node.state || {};
            node.state.checked = !node.state.checked;
            if (node.state.checked) {
                $scope.types.push(node.id);

            } else {
                var index = $scope.types.findIndex(function (v) {
                    return (v == node.id)
                });
                $scope.types.splice(index, 1);
            }
            $scope.find();

        }


    });
    app.controller('editSubjectCtrl111', function ($scope, $http, fac, $uibModalInstance, copy) {
        $scope.search = {};
        $scope.treeClass111 = copy.treeClass
        $scope.item = copy || {};
        $scope.item.tempAnswers = [];
        $scope.show = copy.show;

        $scope.search.deptId = copy.deptId;

        if ($scope.item.isPublic == 1) {
            $scope.item.isPublic = 1
        } else {
            $scope.item.isPublic = 0
        }
        $scope.resetType = function () {
            if (copy.id) {
                return;
            }
            $scope.item.question = '';
            $scope.item.answer = '';
            $scope.item.tempAnswers = [];
            $scope.item.optionDetail = [];

            if ($scope.item.type == 1 || $scope.item.type == 2) {
                options.forEach(function (item, index) {
                    $scope.item.optionDetail.push({
                        option: item,
                        optionContent: '',
                        blankContent: '',
                        type: '',
                        num: (index + 1),
                        checked: false
                    });
                });
            }
        }

        //新增时
        var options = ['A', 'B', 'C', 'D'];
        $scope.contentList = [];
        if (!$scope.item.id) {
            $scope.item.type = 1;
            $scope.resetType();
        } else {
            $http.post("/ovu-pcos/pcos/newknowledge/subject/subjectDetail", {
                "id": copy.id
            }, fac.postConfig).success(function (resp) {
                if (resp.code == 0) {

                    $scope.item = resp.data;
                    if ($scope.item.type == 2) {
                        $scope.item.optionDetail.forEach(function (o) {
                            if ($scope.item.answer.indexOf(o.option) != -1) {
                                o.checked = true;
                            }
                        });

                    }
                    if ($scope.item.type == 4) {
                        $scope.item.tempAnswers = [];
                        $scope.item.answer.split('$').forEach(function (value, index) {
                            $scope.item.tempAnswers.push({
                                order: (index + 1),
                                answer: value
                            });
                        });
                        console.log($scope.item.tempAnswers)
                    }
                } else {
                    alert('获取详情失败！');
                }
            })
        }

        //选中分类
        $scope.setHierarchyClassification = function (item) {
            $scope.hierarchyClassificationId = item.hierarchyClassificationId
        }

        //确认移动题库
        $scope.saveMove = function (form) {
            form.$setSubmitted(true);
            if (!form.$valid) {
                return;
            }
            if (copy.subjectIds.length != 0) {
                var params = {
                    subjectIds: copy.subjectIds.join(','),
                    hierarchyId: $scope.hierarchyClassificationId,
                }
                $http.post("/ovu-pcos/pcos/newknowledge/subject/move", params, fac.postConfig).success(function (resp) {
                    if (resp.code == "0") {
                        msg(resp.msg);
                        $uibModalInstance.close()
                        // $scope.find()
                    } else {
                        alert(resp.msg);
                    }
                });
            } else (
                alert('您未选择题目')
            )
        }

        // $scope.optionDetail = {}
        //继续添加
        $scope.continue = function (form, item) {

            form.$setSubmitted(true);
            if (!form.$valid) {
                return;
            }
            var questions = []
            var anwsers = []
            if (item.type == 2) {
                item.optionDetail.forEach((o) => {
                    if (o.checked) {
                        anwsers.push(o.option)
                    }
                })
                if (anwsers.length < 2) {
                    alert('多选题不能少于2个正确答案！');
                    return;
                }
                item.answer = anwsers.join('$')
            } else if (item.type == 4) {
                item.optionDetail.forEach((o) => {
                    questions.push(o.blankContent)
                })
                item.question = questions.join(',')
                if (questions == '') {
                    alert('内容不能为空');
                    return;
                }
                item.question = questions.join('');
                item.tempAnswers.forEach(function (o) {
                    anwsers.push(o.answer);
                })
                item.answer = anwsers.join('$');
            }

            if (!item.question) {
                alert('题干不能为空！');
                return;
            }

            if (item.type == 1 || item.type == 2) {
                item.optionDetail.forEach((o) => {
                    $scope.optionContent = o.optionContent
                })
                if ($scope.optionContent == '') {

                    alert('内容不能为空');
                    return;
                }
            }
            if (!item.answer) {
                alert('正确答案不能为空！');
                return;
            }


            if (item.hierarchyClassificationId == undefined) {
                alert('分类不能为空');
                return;
            }
            
            $http.post("/ovu-pcos/pcos/newknowledge/subject/edit", item).success(function (resp) {
                if (resp.code == 0) {
                    msg('保存成功！');
                    if (item.type == 1) {
                        $scope.options = []
                        $scope.item.optionDetail.forEach(v => {
                            $scope.options.push(v.option)
                            v.optionContent=''
                        })
                        $scope.item.optionDetail.splice(4)
                    }
                    if (item.type == 2) {
                        $scope.options = []
                        $scope.item.optionDetail.forEach(v => {
                            $scope.options.push(v.option)
                            v.optionContent=''
                         
                            v.checked=false
                        })
                        $scope.item.optionDetail.splice(4)
                        $scope.item.question=''
                    }
                    if (item.type == 4) {
                        $scope.item.optionDetail.splice(4)
                        $scope.item.tempAnswers.splice(0)
                        item.optionDetail.forEach((o) => {
                            o.optionContent = ''
                            o.checked = false
                            o.blankContent = ''
                        })
                    }
                  
                    item.question = ''
                    item.answer = ''
                    $scope.options = ['A', 'B', 'C', 'D'];
                } else {
                    alert(resp.msg);
                }
            });
        }

        $scope.addOption = function (item, show) {
            if (show) {
                //查看
                this.show = show;
            }
            var extOption = '';
            var num;
            var len = item.optionDetail.length;
            if (len == 10) {
                alert('题目选项不能超过10个选项！');
                return;
            }
            if (len == 4) {
                extOption = 'E';
                num = 5;
            } else if (len == 5) {
                extOption = 'F';
                num = 6;
            } else if (len == 6) {
                extOption = 'G';
                num = 7;
            } else if (len == 7) {
                extOption = 'H';
                num = 8;
            } else if (len == 8) {
                extOption = 'I';
                num = 9;
            } else if (len == 9) {
                extOption = 'J';
                num = 10;
            }

            $scope.item.optionDetail.push({
                option: extOption,
                optionContent: '',
                num: num,
                checked: false
            });
        }

        $scope.delOption = function (item) {

            if ($scope.item.optionDetail.length == 4) {
                alert('不能再删除选项！')
                return
            }
            if (item.option == 'E' && $scope.item.optionDetail.length == 6) {
                alert('请先删除F选项！');
                return;
            }
            if (item.option == 'F' && $scope.item.optionDetail.length == 7) {
                alert('请先删除G选项！');
                return;
            }
            if (item.option == 'G' && $scope.item.optionDetail.length == 8) {
                alert('请先删除H选项！');
                return;
            }
            if (item.option == 'H' && $scope.item.optionDetail.length == 9) {
                alert('请先删除I选项！');
                return;
            }
            if (item.option == 'I' && $scope.item.optionDetail.length == 10) {
                alert('请先删除J选项！');
                return;
            }
            $scope.item.optionDetail.splice($scope.item.optionDetail.indexOf(item), 1);

        }
        $scope.setText = function (optionDetail) {
            return optionDetail.map(function (v) { return v.blankContent }).join('')
        }


        $scope.addBlankText = function (type) {
            if (type == 0 && $scope.item.tempAnswers.length == 5) {
                alert('最多只能设置5个填空段!');
                return;
            }

            var len = $scope.item.optionDetail.length;
            $scope.item.optionDetail.push({
                blankContent: type == 0 ? '（）' : '',
                num: (len + 1),
                type: type
            });

            if (type == 0) {
                $scope.item.tempAnswers.push({ order: ($scope.item.tempAnswers.length + 1), answer: '' });
            }
        };

        $scope.backspace = function () {
            if ($scope.item.optionDetail.length > 0) {
                var len = $scope.item.optionDetail.length;
                var type = $scope.item.optionDetail[len - 1].type;
                $scope.item.optionDetail.splice(len - 1, 1);

                if (type == 0) {
                    $scope.item.tempAnswers.splice($scope.item.tempAnswers.length - 1, 1);
                }
            }
        }


        //保存题目
        $scope.saveQuestion = function (form, item) {
            form.$setSubmitted(true);
            if (!form.$valid) {
                return;
            }
            var questions = []
            var anwsers = []
            if (item.type == 2) {
                item.optionDetail.forEach((o) => {
                    if (o.checked) {
                        anwsers.push(o.option)
                    }
                })
                if (anwsers.length < 2) {
                    alert('多选题不能少于2个正确答案！');
                    return;
                }
                item.answer = anwsers.join('$')
            } else if (item.type == 4) {
                item.optionDetail.forEach((o) => {
                    questions.push(o.blankContent)
                })
                item.question = questions.join(',')
                if (questions == '') {
                    alert('内容不能为空');
                    return;
                }
                item.question = questions.join('');
                item.tempAnswers.forEach(function (o) {
                    anwsers.push(o.answer);
                })
                item.answer = anwsers.join('$');
            }


            if (!item.question) {
                alert('题干不能为空！');
                return;
            }
            if (item.type == 1 || item.type == 2) {
                item.optionDetail.forEach((o) => {
                    $scope.optionContent = o.optionContent
                })
                if ($scope.optionContent == '') {

                    alert('内容不能为空');
                    return;
                }
            }
            if (!item.answer) {
                alert('正确答案不能为空！');
                return;
            }


            if (item.hierarchyClassificationId == undefined) {
                alert('分类不能为空');
                return;
            }
            // $.extend($scope.search, {
            //     type: $scope.item.type,
            //     isPublic: $scope.item.isPublic,
            //     question: $scope.item.question,
            //     optionDetail: $scope.item.optionDetail,
            //     hierarchyClassificationId: $scope.item.hierarchyClassificationId,
            //     answer: $scope.item.answer,
            //     isPublicSubject: $scope.item.isPublicSubject,
            //     deptId: copy.deptId,
            //     id:$scope.item.id
            // })
            $http.post("/ovu-pcos/pcos/newknowledge/subject/edit", item).success(function (resp) {
                if (resp.code == 0) {
                    msg('保存成功！');
                    $uibModalInstance.close()
                } else {
                    alert(resp.msg);
                }
            });
        }

        $scope.cancel = function () {
            $uibModalInstance.close()
            // $scope.find(1)
            $uibModalInstance.dismiss('cancel');
        };
    });
    app.controller('takeSubjectCtrl', function ($scope, $http, fac, $uibModalInstance, copy) {
        $scope.item = copy || {};
        $scope.show = copy.show;

        $scope.treeClass = copy.treeClass

        //选中分类
        $scope.setHierarchyClassification = function (item) {
            $scope.hierarchyClassificationId = item.hierarchyClassificationId
        }

        //是否公开
        $scope.isPublic = function (item) {
            var isPublic = (item.isPublic == 0 ? '1' : '0');
            $scope.isPublic = isPublic
        }

        $scope.save = function (item) {
            if ($scope.item.ids == '') {
                alert('请选择收录的题目')
                return;
            }
            $http.post("/ovu-pcos/pcos/newknowledge/subject/embody", {
                hierarchyClassificationId: $scope.hierarchyClassificationId,
                ids: $scope.item.ids.join(','),
                isPublic: $scope.item.isPublic,
                deptId: $scope.item.deptId
            }, fac.postConfig).success(function (resp) {
                if (resp.code == 0) {
                    msg('保存成功！');
                    $uibModalInstance.close();
                } else {
                    alert(resp.msg);
                }
            })
        }
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };

    });
})();
