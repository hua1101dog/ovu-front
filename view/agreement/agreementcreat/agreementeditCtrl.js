(function() {
    "use strict";
    var app = angular.module("angularApp");

    app.controller('agreementedithtmlCtrl', function($scope, $rootScope, $uibModal, $http, $timeout, $state, $filter, fac, $sce) {
        $scope.search = {
            compactStatus: sessionStorage.getItem('status'),
            parkId: sessionStorage.getItem('parkId'),
            compactInfoId: sessionStorage.getItem('id')
        };
        //合同查看
        $http.post('/ovu-pcos/pcos/compact/info/view', $scope.search, fac.postConfig).success(function(data) {
            $scope.inform = data.compactInfo;
            // $scope.itemList = data.itemList;
            if (data.compactCall) {
                $scope.remind = data.compactCall;
            } else {
                $scope.remind = { 'warnType': 0 };
            }

            $scope.itemList = data.itemList.map(function(v, index) {
                var compactInfoData = v.compactInfoData;
                if (v.dataItemType === 3) {
                    compactInfoData = parseFloat(compactInfoData);
                }
                return {
                    isNeed: v.isNeed,
                    itemId: v.itemId,
                    dataItemType: v.dataItemType,
                    dataItemCode: v.dataItemCode,
                    dataItemName: v.dataItemName,
                    compactInfoId: v.compactInfoId,
                    compactInfoData: compactInfoData
                }
            });

            $scope.itemList.forEach(function(v, index) {
                if (v.dataItemType === 4) {
                    $timeout(function() {
                        var editor = createWangEditor(index, function(html) {
                            // console.log(html);
                            v.compactInfoData = html;
                        });
                        editor.txt.html(v.compactInfoData);
                    });
                }
            });

            $scope.content = $sce.trustAsHtml($scope.inform.compactDetail);

            //回选合同分类名称下拉列表
            $http.post('/ovu-pcos/pcos/compact/classify/loadClassifyList', { parkId: sessionStorage.getItem('parkId') }, fac.postConfig).success(function(data) {
                $scope.agreementList = data;
            });
            //回选合同分类模版下拉
            $http.post('/ovu-pcos/pcos/compact/templet/loadTempletList', { classifyId: $scope.inform.classifyId }, fac.postConfig).success(function(data) {
                $scope.templetList = data;
            });
            //回选父合同分类下拉
            // $http.post('/ovu-pcos/pcos/compact/info/loadCompactList', { classifyId: $scope.inform.classifyId }, fac.postConfig).success(function (data) {
            //     $scope.fatherAgreementsList = data;
            //     console.log(data);
            // })


        });

        //合同分类模版下拉列表
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
                // $scope.detailAgreement = data;
                $scope.content = $sce.trustAsHtml(data.templet.templetDetail);
            })
        };

        // 富文本
        function createWangEditor(index, onchange) {
            var editor = new window.wangEditor('#wang-editor-' + index);
            editor.customConfig.uploadImgServer = '/ovu-base/uploadImg.do';
            editor.customConfig.onchange = function(html) {
                // html 即变化之后的内容
                // console.log(html)
                onchange(html);
            };
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
            editor.create();
            return editor;
        }

        //合同提交
        $scope.commit = function(form) {
            form.$setSubmitted(true);
            if (!form.$valid) {
                return;
            }
            //console.log('$scope.itemList', $scope.itemList);
            var data = [];
            var obj = new Object();
            if (!fac.isEmpty($scope.itemList)) {

                // $scope.itemList.forEach(function(v) {
                //     v[v.dataItemCode] = v.compactInfoData;
                //     data.push(v.dataItemCode + ':' + v.compactInfoData);
                // })
                // for (var x in data) {
                //     var split = data[x].split(':');
                //     obj[split[0]] = split[1];
                // }
                $scope.itemList.forEach(function(v) {
                    v[v.dataItemCode] = v.compactInfoData;
                    obj[v.dataItemCode] = v.compactInfoData;
                });
                // console.log('obj=========>', obj);
            }

            //console.log('$scope.inform', $scope.inform);
            $.extend(obj, $scope.inform, $scope.remind);

            obj.parkId = $scope.search.parkId;
            $http.post('/ovu-pcos/pcos/compact/info/commit', obj).success(function(data) {
                if (data.status == 0) {
                    msg(data.msg);
                    $state.go('admin', { folder: 'agreement', page: 'creat' });
                } else {
                    alert(data.msg);
                }
            })
        };

        // 返回
        $scope.back = function() {
            $state.go('admin', { folder: 'agreement', page: 'creat' });
        };

    });
})();