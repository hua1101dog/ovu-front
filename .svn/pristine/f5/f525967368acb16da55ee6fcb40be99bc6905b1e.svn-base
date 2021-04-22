(function() {
    "use strict";
    var app = angular.module("angularApp");
    //入伙指引管理ctrl
    app.controller("partnershipguideCtrl", function($scope, $rootScope, $uibModal, $http, $state, $filter, fac, guideService) {
        document.title = "入伙指引";
        $scope.search = {};
        //定义全局变量存储数据
        var oldTitle;
        var oldContent;
        var oldTextContent;
        var id;

        var editor = new window.wangEditor('#partnershipguide');
        // window.editor = editor;
        // 设置wangEditor图片上传路径
        editor.customConfig.uploadImgServer = '/ovu-base/uploadImg.do';
        editor.create();

        //获取登陆权限 和 parkID
        app.modulePromiss.then(function() {
            /*$scope.$watch('park', function(newValue, oldValue) {
                if (newValue && newValue.id) {
                    $scope.search.parkId = newValue.id;
                    $scope.search.parkName = newValue.parkName;
                    $scope.find($scope.search.parkId);
                    //selectClassify();
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
                	
                	id = '';
                }
                if($scope.search.deptId){
                	$scope.find($scope.search.deptId);
                }else{
                	alert("请选择部门")
                	$scope.title = '';
                    editor.txt.html('');
                }
            },true)
        });

        // 页面进入就执行 渲染页面
        $scope.find = function(deptId) {
            guideService.getGuide(deptId).then(function(result) {
                if (result.data.success) {
                    if (result.data.joinGuide != '') {
                        // 备份数据
                        oldTitle = result.data.joinGuide.title;
                        oldContent = result.data.joinGuide.content;
                        id = result.data.joinGuide.id;
                        //渲染页面
                        $scope.title = result.data.joinGuide.title;
                        editor.txt.html(result.data.joinGuide.content);
                        //把富文本text内容存起来
                        oldTextContent = editor.txt.text();
                        //console.log('oldTextContent',oldTextContent);
                    } else {
                        alert("该部门当前没有数据");
                        $scope.title = '';
                        editor.txt.html('');
                    }
                }
            }).catch(function(err) {
                console.log(err);
            });
        };

        //保存 把用户写入的信息传到服务器当中
        $scope.save = function(form) {
        	if(!$scope.search.deptId){
        		alert("请先选定一个部门");
        		return;
        	}
            // form.$setSubmitted(true);
            // if (!form.$valid) {
            //     return;
            // }
            var newContent = editor.txt.html();
            var newTextContent = editor.txt.text();
            //console.log('oldTextContent',newTextContent);
            var newTitle = $scope.title;
            if (oldTitle == newTitle && oldContent == newContent && oldTextContent == newTextContent) {
                alert('您未修改任何内容！');
            } else if (!newTitle) {
                alert('请输入标题！');
            } else if (newTextContent.length == 0) {
                alert('请输入内容！');
            } else if (newTextContent.length > 600) {
                alert('您输入的内容超过最大字数600');
            } else {
                var data = {
                    deptId: $scope.search.deptId,
                    title: newTitle,
                    content: newContent,
                    id: id
                };
                guideService.editGuide(data).then(function(result) {
                    if (result.data.success) {
                        msg('保存成功！');
                        $scope.find($scope.search.deptId);
                    } else {
                        alert('保存失败');
                    }
                });

            }
        };

        $scope.cancel = function() {
            //重新渲染页面
            $scope.title = oldTitle;
            editor.txt.html(oldContent);
        };

        // wangEditor 超链接点击
        $('#partnershipguide').delegate('.w-e-text-container a', 'click', function() {
            // location.href = this.href;
            window.open(this.href);
        });

        // 销毁的时候解绑代理
        this.$onDestroy = function() {
            $('#partnershipguide').undelegate();
        };
    });
    app.service('guideService', ['$http', '$q', 'fac', function ($http, $q, fac) {
        var getGuideUrl = '/ovu-pcos/join/guide/getJoinGuide',
            editGuideUrl = '/ovu-pcos/join/guide/edit';

        this.getGuide = function (deptId) {
            return $http.post(getGuideUrl, { deptId: deptId }, fac.postConfig);
        };
        this.editGuide = function (data) {
            return $http.post(editGuideUrl,  data, fac.postConfig);
            // return $q(function (resolve, reject) {
            //     sessionStorage.setItem(data.parkId, JSON.stringify({ title: data.title, content: data.content }));
            //     resolve({ success: true });
            // });
        }
    }]);


})();