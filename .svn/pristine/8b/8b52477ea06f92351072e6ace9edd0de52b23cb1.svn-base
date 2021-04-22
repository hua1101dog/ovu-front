(function () {
    var app = angular.module("angularApp");
    app.controller('h5UploadIndexCtrl', function ($scope, $rootScope, $http, $filter, $uibModal, fac) {
        document.title = "OVU-通知管理";
        $scope.current = 1;
        angular.extend($rootScope, fac.dicts);
        $scope.search = {};
        $scope.pageModel = {};
        $scope.stateOut = [{
                value: 0,
                text: "未生效"
            },
            {
                value: 1,
                text: "已生效"
            }
        ];
        // 查询
        $scope.find = function (pageNo) {
            $.extend($scope.search, {
                currentPage: pageNo || $scope.pageModel.currentPage || 1,
                pageSize: $scope.pageModel.pageSize || 10
            });
            fac.getPageResult("/ovu-park/backstage/zipFile/pageRecord", $scope.search, function (data) {
                $scope.pageModel = data;
            });
        };
        $scope.find();
        $scope.query = function () {
            $scope.find();
        }
        // 新增和编辑
        $scope.showEditModal = function (item) {
            var modal = $uibModal.open({
                animation: false,
                size: 'lg',
                templateUrl: '/view/integratManage/h5Upload/modal.upload.html',
                controller: 'updateAppModalCtrl',
                resolve: {
                    data: angular.extend({}, item)
                }
            });
            modal.result.then(function () {
                $scope.find();
            }, function () {
                console.info('Modal dismissed at: ' + new Date());
            });
        };

        // 是否生效
        $scope.confirm = function (item) {
            let params = {
                status: item.status === 0 ? 1 : 0,
                id: item.id,
            }
            let text = item.status === 0 ? "确认生效吗" : "确认取消吗"
            confirm(text, function () {
                $http.get("/ovu-park/backstage/userforce/updateStatus", {
                    params: params
                }).success(function (response) {
                    if (response.code === 0) {
                        if (item.status === 0) {
                            msg("已生效!");
                        } else {
                            msg("已取消!");
                        }
                        $scope.find();
                    }
                })
            })
        }
        // 删除
        $scope.cancel = function (item) {
            let params = {
                id: item.id,
            }
            confirm("确定删除吗", function () {
                $http.get("/ovu-park/backstage/userforce/delete", {
                    params: params
                }).success(function (response) {
                    if (response.code === 0) {
                        msg("已删除!");
                        $scope.find();
                    }
                })
            })
        }
    });

    // 新增编辑
    app.controller('updateAppModalCtrl', function ($scope, $rootScope, $http, $uibModalInstance, $uibModal, $filter, fac, data) {
        $scope.item = {};
        $scope.urls = [];
        if (data.id) {
            $http.get("/ovu-park/backstage/zipFile/getRecord?id=" + data.id).success(function (response) {
                console.log(response)
                if (response.code === 0) {
                    let result = response.data;
                    $scope.item = result;
                    $scope.urls = $scope.item.urls.split(",");
                }
            })
        }

        // 上传合同
        var accepts = ['.zip'];
        $scope.fileObj = {};
        $scope.uploadFile = function () {
            $("input[type=file][name='upfile']").click();
            $("input[type=file][name='upfile']").unbind("change");
            $("input[type=file][name='upfile']").on("change", function (e) {
                let curFile = $("#upfile")[0].files[0];
                let fileName = curFile.name;
                let express = fileName.substring(
                    fileName.lastIndexOf(".")
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
                $scope.fileObj = curFile;
                $rootScope.$apply();
            })
        };
        // 删除合同文档
        $scope.delContactFile = function (index) {
            $scope.contactFileList.splice(index, 1);
        };
        //保存
        $scope.save = function (form, item) {
            form.$setSubmitted(true);
            if (!form.$valid) {
                alert("请完成必填项!");
                return;
            }
            var formData = new FormData();
            formData.append("file", $("#upfile")[0].files[0]);
            formData.append("rootPath", item.rootPath);
            let urls;
            let params = {
                platformName: item.platformName,
                function: item.function,
                developer: item.developer,
                rootPath: item.rootPath
            }
            var loading = layer.load(2, {
                shade: [0.2, '#000'] //0.1透明度的白色背景
            });
            $.ajax({
                url: "/ovu-base/ovupark/backstage/zipFile/unZipToYun",
                type: "post",
                dataType: "json",
                data: formData,
                async: false,
                cache: false,
                contentType: false,
                processData: false,
                success: function (response) {
                    layer.close(loading);
                    if (response.code === 0) {
                        let result = response.data;
                        urls = result.join(",");
                        params.urls = urls;
                        $http.post("/ovu-park/backstage/zipFile/saveRecord", params, fac.postConfig).success(function (data) {
                            if (data.code === 0) {
                                $uibModalInstance.close();
                                msg("保存成功!");
                            } else {
                                alert(data.error);
                            }
                        })
                    }
                },
            });

        };


        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };


    });


    app.filter("takeEffect", function () { //转换标题
        return function (value) {
            if (value == 0) {
                return "未生效";
            } else if (value == 1) {
                return "已生效";
            } else {
                return "--";
            }
        }
    });
})()
