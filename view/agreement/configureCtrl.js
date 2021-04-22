(function() {
    "use strict";
    var app = angular.module("angularApp");

    var editor;

    //客户管理ctrl
    app.controller("configureCtrl", function($scope, $rootScope, $uibModal, $http, $state, $filter, fac) {
        document.title = "合同配置管理";
        $scope.pageModel = {};
        $scope.search = {};


        //判断是集团版还是项目版
        app.modulePromiss.then(function() {
            $scope.search = {
                isGroup: fac.isGroupVersion()
            };
            if ($scope.search.isGroup) {
                ($scope.search.parkId == undefined || $scope.search.parkId == 'undefined' || $scope.search.parkId == null) ? $scope.search.parkId = '': $scope.search.parkId;

                $scope.find();
            } else {
                $scope.$watch('park', function(newValue, oldValue) {
                    if (newValue && newValue.id) {
                        $scope.search.parkId = newValue.id;
                        //parkId = $scope.search.parkId;
                        //$scope.search.PARK_NAME = newValue.PARK_NAME;
                        $scope.find();
                    } else {
                        alert("请先选定一个项目");
                    }
                });
            }
        });


        $scope.find = function(pageNo) {
            $.extend($scope.search, {
                currentPage: pageNo || 1,
                pageSize: $scope.pageModel.pageSize || 10
            });
            $scope.search.pageIndex = $scope.search.currentPage - 1;

            $http.post('/ovu-pcos/pcos/compact/classify/loadClassifyList', {
                parkId: $scope.search.parkId
            }, fac.postConfig).success(function(data) {
                $scope.map = data;
            })


            fac.getPageResult("/ovu-pcos/pcos/compact/templet/pageQuery", $scope.search, function(data) {
                $scope.pageModel = data;
            })
        };



        $scope.del = function(item) {
            confirm("确认删除吗？", function() {
                $http.post('/ovu-pcos/pcos/compact/templet/del', {
                    templetId: item.templetId
                }, fac.postConfig).success(function(data) {
                    if (data.status) {
                        $scope.find();
                        msg(data.msg);
                    } else {
                        msg(data.msg);
                    }
                })

            })
        }

        //编辑／新增模态窗口
        $scope.showModal = function(item) {
            item == undefined ? item = {
                title: '新增合同模版',
                templetId: undefined,
                parkId: $scope.search.parkId
            } : item.title = '编辑合同模版';
            //把parkId加到item中传到modal
            //item.parkId = $scope.search.parkId;
            var modal = $uibModal.open({
                animation: false,
                size: 'lg',
                templateUrl: '/view/agreement/agreementconfigure/modal.configure.html',
                controller: 'editcConfigureCtrl',
                resolve: {
                    item: angular.copy(item)
                }
            });
            modal.result.then(function() {
                $scope.find();
            });
            modal.rendered.then(function(item) {
                console.log("Modal rendered");
                //实例化富文本编辑器
                editor = new window.wangEditor('#content');
                editor.customConfig.uploadImgServer = '/ovu-base/uploadImg.do';
                editor.create();
            });
            modal.opened.then(function() {
                console.log("Modal opened");
            });

        }

    });


    app.controller("editcConfigureCtrl", function($scope, $http, $uibModal, $uibModalInstance, $timeout, $filter, fac, item) {

        var parkIds = item.parkId;
        $scope.item = item;
        // 显示模态框title
        $scope.title = item.title;

        //item == undefined ? item = { templetId: undefined } : item;
        //根据合同分类id下拉展示合同模板名称  {classifyId:item.classifyId}
        $http.post("/ovu-pcos/pcos/compact/classify/loadClassifyList", {
            parkId: item.parkId
        }, fac.postConfig).success(function(data) {
            $scope.msg = data;
        });
        if (item.classifyId) {
            $scope.classifyId = item.classifyId;
        }

        //编辑-加载合同模版相关数据
        if (item.templetId) {
            $http.post("/ovu-pcos/pcos/compact/templet/getById", {
                templetId: item.templetId
            }, fac.postConfig).success(function(data) {
                $timeout(function() {
                    console.log(editor)
                    editor.txt.html(data.templetDetail);
                     // console.log("获取当前合同模版的内容",editor.txt.html());
                },100);
               
                $scope.templetName = item.templetName;
            });
        }
        $scope.save = function(form, item) {
            console.log(item);

            form.$setSubmitted(true);
            if (!form.$valid) {
                return;
            }
            // delete item.creatorId;
            // delete item.createTime;

            // $scope.item.remove(creatorId);
            // $scope.item.remove(createTime);
            var newContent = editor.txt.html();
            var info = {
                classifyId: $scope.classifyId,
                templetName: $scope.templetName,
                templetDetail: newContent,
                parkId: parkIds,
                templetId: item.templetId
            }
            var addInfo = {
                classifyId: $scope.classifyId,
                templetName: $scope.templetName,
                templetDetail: newContent,
                //parkId: $scope.item.parkId    
                parkId: parkIds
            }

            if (item.title == '新增合同模版') {
                if (newContent == '<p><br></p>') {
                    alert('请输入合同模版内容')
                } else {
                    $http.post("/ovu-pcos/pcos/compact/templet/edit", addInfo, fac.postConfig).success(function(data, status, headers, config) {
                        if (data.status) {
                            $uibModalInstance.close();
                            msg(data.msg);
                        } else {
                            alert(data.msg);
                        }
                    })
                }

            } else {
                $http.post("/ovu-pcos/pcos/compact/templet/edit", info, fac.postConfig).success(function(data, status, headers, config) {
                    if (data.status) {
                        $uibModalInstance.close();
                        msg("保存成功！");
                    } else {
                        alert("保存失败");
                    }
                })
            }

        };

        $scope.cancel = function() {
            $uibModalInstance.dismiss("cancel");
            editor.txt.html('');
            //um.destroy();
        };

        // wangEditor 超链接点击
        $('body').delegate('#content .w-e-text-container a', 'click', function() {
            // location.href = this.href;
            window.open(this.href);
        });
        // 销毁的时候解绑代理
        this.$onDestroy = function() {
            $('body').undelegate();
        };

    });



})();