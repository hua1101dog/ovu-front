(function() {
    "use strict";
    var app = angular.module("angularApp");

    app.controller('createHtmlCtrl', function($scope, $rootScope, $uibModal, $http, $timeout, $state, $filter, fac, $sce) {
        $scope.search = {
            isWarning: 0,
            isParent: 1,
            parkId: sessionStorage.getItem('parkId')
        };
        //合同分类名称列表
        $http.post('/ovu-pcos/pcos/compact/classify/loadClassifyList', { parkId: sessionStorage.getItem('parkId') }, fac.postConfig).success(function(data) {
            $scope.agreementList = data;
        });
        //合同分类模版列表
        $scope.agreementsList = function(id) {
            $http.post('/ovu-pcos/pcos/compact/templet/loadTempletList', { classifyId: id }, fac.postConfig).success(function(data) {
                $scope.templetList = data;
            })
            $http.post('/ovu-pcos/pcos/compact/info/loadCompactList', { classifyId: id }, fac.postConfig).success(function(data) {
                $scope.fatherAgreementsList = data;
            })
        };
        //加载合同模板相关数据
        $scope.templetsList = function(id) {
            $http.post('/ovu-pcos/pcos/compact/templet/loadData', { templetId: id }, fac.postConfig).success(function(data) {
                $scope.detailAgreement = data;

                $scope.detailAgreement.dataItem.forEach(function(v, index) {
                    if (v.dataItemType === 4) {
                        v[v.dataItemCode] = '';
                        $timeout(function() {
                            var editor = createWangEditor(index, function(html) {
                                v[v.dataItemCode] = html;
                            });
                            editor.txt.html(v[v.dataItemCode]);

                        });
                    }
                });

                $scope.content = $sce.trustAsHtml($scope.detailAgreement.templet.templetDetail);
            });
        };

        // 富文本
        function createWangEditor(index, onchange) {
            var editor = new window.wangEditor('#wang-editor-' + index);
            editor.customConfig.uploadImgServer = '/ovu-base/uploadImg.do';
            // wangEditor 菜单栏不支持换行折叠 https://www.kancloud.cn/wangfupeng/wangeditor3/335777
            // 精简配置项
            editor.customConfig.menus = [
                'head', // 标题
                'bold', // 粗体
                'fontSize', // 字号
                'fontName', // 字体
                'italic', // 斜体
                'underline', // 下划线
                'strikeThrough', // 删除线
                // 'foreColor', // 文字颜色
                // 'backColor', // 背景颜色
                // 'link', // 插入链接
                // 'list', // 列表
                'justify', // 对齐方式
                // 'quote', // 引用
                // 'emoticon', // 表情
                'image', // 插入图片
                'table', // 表格
                // 'video', // 插入视频
                // 'code', // 插入代码
                // 'undo', // 撤销
                // 'redo' // 重复
            ];
            editor.customConfig.onchange = function(html) {
                // html 即变化之后的内容
                // console.log(html)
                onchange(html);
            };
            editor.create();
            return editor;
        }

        //创建合同
        $scope.save = function(form) {
            form.$setSubmitted(true);
            if (!form.$valid) {
                return;
            }
            if (!fac.isEmpty($scope.detailAgreement.dataItem)) {
                $scope.detailAgreement.dataItem.forEach(function(v) {
                    if (v[v.dataItemCode] == undefined) {
                        $scope.search[v.dataItemCode] = '';
                    } else {
                        $scope.search[v.dataItemCode] = v[v.dataItemCode];
                    }

                })
            }
            $http.post('/ovu-pcos/pcos/compact/info/save', $scope.search).success(function(data) {
                if (data.status == 0) {
                    msg(data.desc);
                } else {
                    alert(data.desc);
                }

                $state.go('admin', { folder: 'agreement', page: 'creat' });
            })

        };

        $scope.cancel = function() {
            $state.go('admin', { folder: 'agreement', page: 'creat' });
        };
    })
})();