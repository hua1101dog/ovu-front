(function() {
    "use strict";
    var app = angular.module("angularApp");
    var editor;
    //var parkId;
    var deptId;
    //入伙协议管理ctrl
    app.controller("partnershipagreementCtrl", function($scope, $rootScope, $uibModal, $http, $state, $filter, fac, agreementService) {
        document.title = "入伙协议管理";
        $scope.pageModel = {};
        $scope.search = {};

        app.modulePromiss.then(function() {
            /*$scope.$watch('park', function(newValue, oldValue) {
                if (newValue && newValue.id) {
                    $scope.search.parkId = newValue.id;
                    //$scope.search.PARK_NAME = newValue.PARK_NAME;
                    //parkId 存起来
                    parkId = $scope.search.parkId;

                    $scope.find();
                } else {
                    alert("请先选定一个项目");
                }
            });*/
            //集团版、项目版合并，监控部门变化
            $scope.$watch('dept', function (dept, oldValue) {
            	if(!$scope.search){
            		$scope.search = {};
            	}
                if(dept.id != $scope.search.deptId){
                	$scope.search.deptId = dept.id;
                	deptId = dept.id;
                }
                if($scope.search.deptId){
                	$scope.find();
                }else{
                	$scope.pageModel.data = [];
                	$scope.pageModel.totalCount = 0;
                	$scope.pageModel.totalPage = 1;
                }
                /*else{
                	alert("请先选定一个部门");
                }*/
            },true)
        });

        //批量删除
        $scope.delAll = function() {
            // var ids = $scope.pageModel.list.reduce(function (ret, n) { 
            var agreementIds = $scope.pageModel.list.reduce(function(ret, n) {
                n.checked && ret.push(n.agreementId);
                return ret
            }, []);
            if (agreementIds.length == 0) {
                alert("请选择要删除的协议！");
                return;
            }
            dodel(agreementIds.join());
        };
        //单个删除
        $scope.del = function(item) {
            dodel(item.agreementId);
        }

        function dodel(agreementIds) {
            confirm("确认删除吗?", function() {
                agreementService.delAgreementGuide({ agreementIds: agreementIds }).then(function(result) {
                    if (result.data.success) {
                        $scope.find();
                    } else {
                        alert('删除失败');
                    }
                })
            })
        };

        //进入页面渲染数据 分页
        $scope.find = function(pageNo) {
        	if(!$scope.search.deptId){
        		alert("请选择部门")
        		return;
        	}
            $.extend($scope.search, { currentPage: pageNo || 1, pageSize: $scope.pageModel.pageSize || 10 });
            $scope.search.pageIndex = $scope.search.currentPage - 1;
            agreementService.getAgreementGuide($scope.search).then(function(result) {
                if (result) {
                    $scope.pageModel = result;
                }
            })

        };

        //编辑／新增模态窗口
        $scope.showModal = function(item) {
            item == undefined ? item = { ss: '添加' } : item.ss = '编辑';
            var modal = $uibModal.open({
                animation: false,
                size: 'lg',
                templateUrl: '/view/join/partnershipagreement/modal.partnershipagreement.html',
                controller: 'editpartnershipagreementCtrl',
                resolve: { item: item }
            });
            modal.result.then(function() {
                $scope.find();
            });
            modal.rendered.then(function() {
                //modal框添加富文本编辑器
                editor = new window.wangEditor('#content_part');
                editor.customConfig.uploadImgServer = '/ovu-base/uploadImg.do';
                editor.create();
                //如果是编辑
                if (item) {
                    editor.txt.html(item.agreementContent);
                }
                console.log("Modal rendered");
            });
            modal.opened.then(function() {
                console.log("Modal opened");
            });
        }

    });

    app.controller("editpartnershipagreementCtrl", function($scope, $http, $uibModal, $uibModalInstance, $filter, fac, item, agreementService) {
        $scope.item = item;
        item == undefined ? item = { customerId: undefined } : item;
        $scope.title = item.agreementTitle;
        $scope.save = function(form, item) {
            form.$setSubmitted(true);
            if (!form.$valid) {
                return;
            }
            //获取编辑之后富文本编辑器中的内容 将修改后的富文本编辑器内容保存到后台
            var newContent = editor.txt.html();
            var textContent = editor.txt.text();
            $scope.item = item;
            var data = {
                //parkId: parkId,
                deptId:deptId,
                agreementTitle: $scope.title,
                agreementContent: newContent,
                agreementId: item.agreementId
            };
            if (textContent == 0) {
                alert('请输入内容')
            } else if (textContent.length > 600) {
                alert('您输入的内容超过最大字数600');
            } else if (item.ss == '添加') {
                delete data.agreementId;
                agreementService.editAgreementGuide(data).then(function(result) {
                    if (result.data.success) {
                        $uibModalInstance.close();
                        msg("保存成功！");
                    } else {
                        alert("保存失败");
                    }
                })
            } else {
                agreementService.editAgreementGuide(data).then(function(result) {
                    if (result.data.success) {
                        $uibModalInstance.close();
                        msg("保存成功！");
                    } else {
                        alert("保存失败");
                    }
                })
            }

        }

        $scope.cancel = function() {
            $uibModalInstance.dismiss("cancel");
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
    app.service('agreementService', ['$http', '$q', 'fac', function ($http, $q, fac) {
        var getGuideUrl = '/ovu-pcos/join/agreement/list',
            editGuideUrl = '/ovu-pcos/join/agreement/edit',
            delGuideUrl = '/ovu-pcos/join/agreement/delete';

        this.getAgreementGuide = function (info) {
            return $q(function (resolve, reject) {
                fac.getPageResult(getGuideUrl, info, function (pageModel) {
                    resolve(pageModel);
                });
            });
        };
        this.editAgreementGuide = function (data) {
            return $http.post(editGuideUrl, data, fac.postConfig);
        };
        this.delAgreementGuide = function (data) {
            return $http.post(delGuideUrl, data, fac.postConfig);
        }
    }])
    



})();