// 在线培训
(function() {
    "use strict";
    var app = angular.module("angularApp");
    app.controller("cultivateCtl", function(
        $scope,
        $rootScope,
        $http,
        $filter,
        $uibModal,
        fac
    ) {
        document.title = "培训库管理";
        $scope.config1 = {
            edit: true,
            showCheckbox: false
        };

        $scope.config = {
            edit: false,
            showCheckbox: false
        };

        $scope.pageModel = {};
        $scope.search = {};
        $scope.treeData = [];
        $scope.types = [];
        $scope.arr = [];

        app.modulePromiss.then(function() {
            $scope.$watch("dept.id", function(deptId, oldValue) {
                if (deptId) {
                    $scope.deptId = deptId;

                    getParkTree();
                }
            });
        });

        function getParkTree(pageNo, node) {
            $.extend($scope.search, {
                currentPage: pageNo || $scope.pageModel.currentPage || 1,
                pageSize: $scope.pageModel.pageSize || 10
            });
            $http
                .post(
                    "/ovu-pcos/pcos/newknowledge/hierarchy/list",
                    fac.postConfig
                )
                .success(function(res) {
                    $scope.treeClass = res.data;
                });
            $scope.search.cultivateName && delete $scope.search.cultivateName;
            $scope.search.id && delete $scope.search.id;
            $scope.search.ids && delete $scope.search.ids;
            $scope.ids && delete $scope.ids;
            $scope.search.text && delete $scope.search.text;
            $scope.find(1);
        }

        $scope.selectNode = function(search, node) {
            if (node.state.selected) {
                $scope.curNode = node;
            } else {
                delete $scope.curNode;
            }
            $scope.ids = [];
            $scope.arr.push($scope.curNode);
            fac.treeToFlat($scope.arr).forEach(n => {
                $scope.ids.push(n.id);
            });
            $scope.ids = $scope.ids.join(",");
            $scope.arr = [];
            $scope.curNode = [];
            $scope.find();
        };

        //列表查询
        $scope.find = function(pageNo) {
            $.extend($scope.search, {
                currentPage: pageNo || $scope.pageModel.currentPage || 1,
                pageSize: $scope.pageModel.pageSize || 10,
                ids: $scope.ids,
                deptId: $scope.deptId
            });
            if (!$scope.search.cultivateName) {
                $scope.search.ids && delete $scope.search.ids;
            }
            fac.getPageResult(
                "/ovu-pcos/pcos/newknowledge/courseware/list",
                $scope.search,
                function(data) {
                    $scope.pageModel = data;
                }
            );
        };

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
        //选中课件
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

        //发放课件
        $scope.provideModal = function(sub, show) {
            if (show) {
                //查看
                this.show = show;
            }
            var copy = angular.extend(
                {
                    arr: $scope.arr
                },
                sub
            );
            copy.parkId = $scope.search.parkId || "";
            copy = angular.extend(copy, {
                deptId: $scope.deptId,
                show: show
            });
            var modal = $uibModal.open({
                animation: false,
                size: "lg",
                templateUrl: "/view/knowledge/provideModal.html",
                controller: "provideModalCtrl",
                resolve: {
                    copy: copy
                }
            });
            modal.result.then(function() {
                $scope.arr = [];
              
              
                $scope.find(1);
            });
        };

        //新增
        $scope.showEditModal = function(sub, show) {
            if (show) {
                this.show = show;
            }

            var copy = angular.extend(
                {
                    treeClass: $scope.treeClass,
                    deptId: $scope.deptId
                },
                sub
            );
            copy = angular.extend(copy, {
                show: show
            });
            var modal = $uibModal.open({
                animation: false,
                size: "lg",
                templateUrl: "/view/knowledge/addCultivateModal.html",
                controller: "editCultivateCtrl",
                resolve: {
                    copy: copy
                }
            });
            modal.result.then(function() {
                $scope.find();
            });
        };
        //删除课件
        $scope.del = function(item) {
            $http
                .post(
                    "/ovu-pcos/pcos/newknowledge/courseware/delete",
                    {
                        ids: item.id
                    },
                    fac.postConfig
                )
                .success(function(data) {
                    if (data.code == 0) {
                    } else {
                        alert(data.msg);
                        return;
                    }
                    $scope.find();
                });
        };
        //批量删除课件

        $scope.allDelModal = function(item) {
            $scope.ids = [];
            $scope.arr.forEach(v => {
                $scope.ids.push(v.id);
            });
            $http
                .post(
                    "/ovu-pcos/pcos/newknowledge/courseware/delete",
                    {
                        ids: $scope.ids.join(",")
                    },
                    fac.postConfig
                )
                .success(function(data) {
                    if (data.code == 0) {
                        $scope.arr = [];
                    } else {
                        alert(data.msg);
                        return;
                    }
                    $scope.find();
                });
        };
    });
    app.controller("editCultivateCtrl", function(
        $scope,
        $http,
        fac,
        $uibModalInstance,
        $uibModal,
        copy
    ) {
        $scope.item = copy || {};
        $scope.show = copy.show;
        $scope.contentName = [];
        $scope.contentPath = [];
        $scope.fileList = [];
        $scope.coursewareDetail = [];
        $scope.accepts = [
            ".doc",
            ".docx",
            ".pdf",
            ".xls",
            ".xlsx",
            ".jpg",
            ".png",
            ".txt",
            ".ppt",
            ".pptx"
        ];

        function getParkTree() {
            $http
                .post(
                    "/ovu-pcos/pcos/newknowledge/hierarchy/list",
                    fac.postConfig
                )
                .success(function(res) {
                    $scope.item.treeClass = res.data;
                });
        }
        getParkTree();
        if ($scope.item.id) {
            //查看详情
            $http
                .post(
                    "/ovu-pcos/pcos/newknowledge/courseware/detail",
                    {
                        id: copy.id
                    },
                    fac.postConfig
                )
                .success(function(data) {
                    $scope.pageModel = data.data;
                    $scope.fileList = data.data.coursewareDetail;
                    $scope.item.hierarchyClassificationId =
                        data.data.hierarchyClassificationId;
                });
        }
        //删除
        $scope.del = function(detail) {
            $scope.pageModel.coursewareDetail.splice(
                $scope.pageModel.coursewareDetail.indexOf(detail),
                1
            );
        };
        $scope.addLimitFiles3 = function(
            urlField,
            nameField,
            accepts,
            fileList,
            typeField
        ) {
            upload(
                {
                    url: "/ovu-pcos/pcos/newknowledge/courseware/uploadToYun",
                    accept: "*"
                },
                function(resp) {
                    if (resp.CODE == "0" && resp) {
                        $scope.type = 0;
                        var fileUrl = resp.url;
                        var express = fileUrl.substring(
                            fileUrl.lastIndexOf(".")
                        );
                        if (
                            accepts &&
                            accepts.length > 0 &&
                            accepts.indexOf(express) == -1
                        ) {
                            alert(
                                "只允许上传格式为:[" +
                                    accepts.join("、") +
                                    "]的文件"
                            );
                            return;
                        }
                        if (fileList.length > 0) {
                            if (fileList[0].name == resp.name) {
                                alert("不允许上传重复文件");
                                return;
                            }
                        }
                        var item = {};
                        item[urlField] = fileUrl;
                        item[nameField] = resp.name;
                        item[typeField] = 0;
                        fileList.push(item);
                        $scope.$apply();
                    } else {
                        alert(resp.error);
                    }
                }
            );
        };

        function upload(options, fn) {
            if (typeof options.params != "object") {
                options.params = {};
            }
            if (!options.url) {
                options.url = "/ovu-base/uploadImg.do";
            }
            var index;
            if (options.nowait) {
                options.onSubmit = function() {};
            } else {
                options.onSubmit = function() {
                    index = layer.load(1, {
                        shade: [0.2, "#000"] //0.1透明度的白色背景
                    });
                };
            }
            options.onComplate = function(data) {
                layer.close(index);
                if (Array.isArray(data)) {
                    fn && fn(data);
                } else if ("object" == typeof data) {
                    if (data.success || data.status == 1 || data.code == 0) {
                        fn && fn(data);
                    } else {
                        layer.alert(data.error || data.msg || "上传发生错误!", {
                            btn: ["ok"],
                            title: false
                        });
                    }
                } else if (
                    "string" == typeof data &&
                    data.indexOf("url") != -1
                ) {
                    data = JSON.parse(data);
                    if (data.success || data.status == 1 || data.code == 0) {
                        fn && fn(data);
                    } else {
                        layer.alert(data.error || data.msg || "上传发生错误!", {
                            btn: ["ok"],
                            title: false
                        });
                    }
                } else {
                    layer.alert("发生错误:" + data, {
                        btn: ["ok"],
                        title: false
                    });
                }
            };
            // 上传方法
            $.upload(options);
        }

        //删除文件

        $scope.delFile = function(list, item) {
            var index = list.findIndex(function(v) {
                return v.name == item.name;
            });
            list.splice(index, 1);
        };

        //点击音频
        $scope.audioModal = function(item, show1) {
            if (show1) {
                this.show1 = show1;
            }
        };
        //保存音频
        $scope.save1 = function(nameField, urlField, typeField, item, show) {
            var item = {};
            item[urlField] = $scope.item.contentPath1;
            item[nameField] = $scope.item.contentName1;
            item[typeField] = 2;
            if (item[urlField] == undefined && item[nameField] == undefined) {
                alert("请输入名称和地址！");
                return;
            }

            $scope.fileList.push(item);

            this.show1 = !show;
            $scope.item.contentName1 = "";
            $scope.item.contentPath1 = "";
        };
        //取消音频
        $scope.cancel1 = function(show1) {
            if (show1) {
                this.show1 = !show1;
            }
            $scope.item.contentName1 = "";
            $scope.item.contentPath1 = "";
        };

        //点击视频
        $scope.videoModal = function(show2) {
            if (show2) {
                this.show2 = show2;
            }
        };
        //保存视频
        $scope.save2 = function(nameField, urlField, typeField, item, show) {
            var item = {};
            if (
                $scope.item.contentName2 == undefined &&
                $scope.item.contentPath2 == undefined
            ) {
                alert("请输入名称和地址！");
                return;
            }
            item[urlField] = $scope.item.contentPath2;
            item[nameField] = $scope.item.contentName2;
            item[typeField] = 1;
            $scope.fileList.push(item);

            this.show2 = !show;
            $scope.item.contentName2 = "";
            $scope.item.contentPath2 = "";
        };
        //取消视频
        $scope.cancel2 = function(show2) {
            if (show2) {
                this.show2 = !show2;
            }
            $scope.item.contentName2 = "";
            $scope.item.contentPath2 = "";
        };

        //保存课件
        $scope.save = function() {
            if (!$scope.item.text) {
                alert("请输入课件名称!");
                return;
            }
            if ($scope.item.hierarchyClassificationId == undefined) {
                alert("请选择分类!");
                return;
            }

            if (!$scope.item.id) {
                if ($scope.fileList.length == 0) {
                    alert("请上传文件!");
                    return;
                }
            }

            if ($scope.item.id) {
                if ($scope.pageModel.coursewareDetail.length == 0) {
                    alert("请上传文件!");
                    return;
                }
            }

            var params = {
                text: $scope.item.text,
                hierarchyClassificationId:
                    $scope.item.hierarchyClassificationId,
                coursewareDetail: $scope.fileList,
                deptId: $scope.item.deptId,
                id: $scope.item.id
            };
            $http
                .post("/ovu-pcos/pcos/newknowledge/courseware/edit", params)
                .success(function(data) {
                    if (data.code == 0) {
                        $scope.pageModel = data;
                        msg("保存成功!");
                        $uibModalInstance.close();
                    } else {
                        alert(data.msg);
                    }
                });
        };

        $scope.cancel = function() {
            $uibModalInstance.dismiss("cancel");
        };
    });
    app.controller("provideModalCtrl", function(
        $scope,
        $http,
        fac,
        $uibModalInstance,
        $uibModal,
        copy
    ) {
        $scope.item = copy || {};
        $scope.search = {};
        $scope.show = copy.show;
        $scope.arr = copy.arr;
        $scope.ids = [];
        $scope.groupIds = [];
        $scope.takeInPersonIds = [];

        $scope.arr.forEach(v => {
            $scope.ids.push(v.id);
        });
        if ($scope.item.id) {
            $scope.item.personList.forEach(v => {
                $scope.personIds.push(v.id);
            });
            $scope.personIds = $scope.personIds.join(",");
        }

        //选择分组
        $scope.selectGroud = function(sub) {
            $http
                .post(
                    "/ovu-pcos/pcos/newknowledge/group/list",
                    {
                        deptId: $scope.item.deptId
                    },
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
                $scope.workcopyMsg = "导入成功！";
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

        //保存发放课件
        $scope.save = function(form) {
            form.$setSubmitted(true);
            if (!form.$valid) {
                return;
            }
            $scope.personIds = $scope.takeInPersonIds.concat($scope.personIds1);
           
            if ($scope.personIds == "" && !$scope.groupIds.length) {
                alert("请选择人员！");
                return;
            }
            var end = new Date($scope.item.endTime)
           
            var endTime = end.getTime(end) 
           
            var timestamp=new Date().getTime()
             
              if(endTime<timestamp ){
                  alert('培训时间必须大于当前时间,请重新选择')
                  $scope.item.endTime=''
            
                  return
              }

            var params = {
                title: $scope.item.title,
                content: $scope.item.content,
                startTime: $scope.item.startTime,
                endTime: $scope.item.endTime,
                personIds: $scope.personIds.join(","),
                coursewareIds: $scope.ids.join(","),
                deptId: $scope.item.deptId,
                groupIds: $scope.groupIds.join(",")
            };

            $http
                .post(
                    "/ovu-pcos/pcos/newknowledge/train/edit",
                    params,
                    fac.postConfig
                )
                .success(function(resp) {
                    if (resp.code == "0") {
                        $uibModalInstance.close();
                        $scope.ids = [];
                        msg(resp.msg);
                    } else {
                        alert(resp.msg);
                    }
                });
        };

        $scope.cancel = function() {
            $uibModalInstance.dismiss("cancel");
        };
    });
    //选择分组
    app.controller("selectGroudCtrl", function(
        $scope,
        $http,
        fac,
        $uibModalInstance,
        sub
    ) {
        $scope.search = {};
        $scope.item = sub || {};
        $scope.groudList = sub.data;
        $scope.ids = [];
        $scope.arr = [];
        $scope.personList = [];
        $scope.personIds = [];
        //点击分组
        $scope.checkOne = function(item) {
            item.checked = !item.checked;
            if (item.checked) {
                $scope.ids.push(item.id);
            } else {
                var index = $scope.ids.findIndex(v => {
                    return item.id == v;
                });
                $scope.ids.splice(index, 1);
            }
            if ($scope.ids.length > 0) {
                $scope.ids = $scope.ids.join(",");
            }

            $http
                .post(
                    "/ovu-pcos/pcos/newknowledge/group/queryByGroupId",
                    {
                        ids: $scope.ids
                    },
                    fac.postConfig
                )
                .success(function(resp) {
                    if (resp.code == 0) {
                        // msg(resp.msg);
                        $scope.personList = resp.data;
                    } else {
                        alert(resp.msg);
                    }
                });
            if ($scope.ids.length > 0) {
                $scope.ids = $scope.ids.split(",");
            }
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
        };

        //保存
        $scope.save = function() {
            $scope.personList.forEach(v => {
                $scope.personIds.push(v.id);
            });
            $scope.personIds = $scope.personIds.join(",");
            var tempObj = {
                personIds: $scope.personIds
            };
            $uibModalInstance.close(tempObj);
        };
        //关闭
        $scope.cancel = function() {
            $uibModalInstance.dismiss("cancel");
        };
    });
})();
