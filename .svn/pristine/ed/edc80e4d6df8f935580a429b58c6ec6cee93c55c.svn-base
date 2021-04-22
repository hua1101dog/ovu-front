// 题库管理

(function () {
    "use strict";
    var app = angular.module("angularApp");
    app.controller('subjectGroupCtrl', function ($scope, $rootScope, $http, $filter, $uibModal, fac) {
        document.title = "题库管理";
        $scope.config = {
            edit: false,
            showCheckbox: true
        }

        $scope.pageModel = {};
        $scope.search={};
        $scope.treeData = [];
        $scope.types = [];
        app.modulePromiss.then(function () {
          $scope.find();
        });


        //题目类型树
        $scope.treeData = [{ "text": "单选题", "id": '1', 'checked': false },
            { "text": "多选题", "id": '2', 'checked': false },
            { "text": "判断题", "id": '3', 'checked': false },
            { "text": "填空题", "id": '4', 'checked': false },
            { "text": "问答题", "id": '5', 'checked': false },
        ];

        //列表查询
        $scope.find = function (pageNo) {
            $.extend($scope.search, { currentPage: pageNo || $scope.pageModel.currentPage || 1, pageSize: $scope.pageModel.pageSize || 10, types: $scope.types.join(',') });
            fac.getPageResult("/ovu-pcos/pcos/newknowledge/subject/list.do", $scope.search, function (data) {
                $scope.pageModel = data;
            });
        };

        //批量删除题库
        $scope.delAll = function () {
            var ids = $scope.pageModel.list.reduce(function (ret, n) { n.checked && ret.push(n.id); return ret }, []);
            del(ids);
        };
        //删除题库
        $scope.del = function (item) {
            del([item.id]);

        }
        function del(ids) {
            confirm("确认删除选中的" + ids.length + "条记录?", function () {
                $http.post("/ovu-pcos/pcos/newknowledge/subject/delete.do", { "ids": ids.join() }, fac.postConfig).success(function (resp) {
                    if (resp.code == "0") {
                        $scope.find();
                        msg(resp.msg);
                    } else {
                        alert(resp.msg);
                    }
                })
            });
        }

        //新增、编辑
        $scope.showEditModal = function (sub, show) {
            if (show) {
                //查看
                this.show = show;
            };
            var copy = angular.extend({}, sub);
            copy = angular.extend(copy, {show: show });
            var modal = $uibModal.open({
                animation: false,
                size: 'lg',
                templateUrl: '/view/knowledge/subject/modal.editSubject.html',
                controller: 'editSubjectCtrl'
                , resolve: { copy: copy }
            });
            modal.result.then(function () {
                $scope.find();
            }, function () {
                console.info('Modal dismissed at: ' + new Date());
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
    app.controller('editSubjectCtrl', function ($scope, $http, fac, $uibModalInstance, copy) {
        $scope.item = copy || {};
        $scope.show = copy.show;
        $scope.item.tempImages=[];
        $scope.item.tempAnswers=[];

        $scope.resetType=function(){
            if(copy.id){
                return;
            }
            $scope.item.question='';
            $scope.item.answer='';
            $scope.item.tempImages=[];
            $scope.item.tempAnswers=[];
            $scope.item.optionDetail=[];

            if($scope.item.type==1 || $scope.item.type==2){
                options.forEach(function(item,index){
                    $scope.item.optionDetail.push({
                        option:item,
                        optionContent:'',
                        blankContent:'',
                        type:'',
                        num:(index+1),
                        checked: false
                    });
                });
            }
        }

        //新增时
        var options=['A','B','C','D'];
        $scope.contentList = [];
        if(!$scope.item.id){
            $scope.item.type = 1;

            $scope.resetType();
        }else{
            $http.post("/ovu-pcos/pcos/newknowledge/subject/detail", { "ids": copy.id }, fac.postConfig).success(function (resp) {
                if (resp.code == 0) {
                    $scope.item=resp.data.subjectDetail[0];
                    $scope.item.tempImages=$scope.item.images?$scope.item.images.split(','):[];
                    if($scope.item.type==2){
                        $scope.item.optionDetail.forEach(function (o) {
                            if($scope.item.answer.indexOf(o.option)!=-1){
                                o.checked=true;
                            }
                        });
                    }
                    if($scope.item.type==4){
                        $scope.item.tempAnswers=[];
                        $scope.item.answer.split('$').forEach(function (value,index) {
                            $scope.item.tempAnswers.push({order:(index+1),answer:value});
                        });
                    }
                } else {
                    alert('获取详情失败！');
                }
            })
        }

        $scope.addOption=function(item){
            var extOption='';
            var num;
            var len=item.optionDetail.length;
            if(len==6){
                alert('多选题选项不能超过6个选项！');
                return;
            }
            if(len==4){
                extOption='E';
                num=5;
            }else if(len==5){
                extOption='F';
                num=6;
            }

            $scope.item.optionDetail.push({
                option:extOption,
                optionContent:'',
                num:num,
                checked: false
            });
        }

        $scope.delOption=function(item){
            if(item.option=='E' && $scope.item.optionDetail.length==6){
                alert('请先删除F选项！');
                return;
            }
            $scope.item.optionDetail.splice($scope.item.optionDetail.indexOf(item),1);
        }

        $scope.addBlankText=function(type){
            if(type==0 && $scope.item.tempAnswers.length==5){
               alert('最多只能设置5个填空段!');
               return;
            }

            var len=$scope.item.optionDetail.length;
            $scope.item.optionDetail.push({
                blankContent:type==0?'（ ）':'',
                num:(len+1),
                type:type
            });

            if(type==0){
                $scope.item.tempAnswers.push({order:($scope.item.tempAnswers.length+1),answer:''});
            }
        };

        $scope.backspace=function(){
            if($scope.item.optionDetail.length>0){
                var len=$scope.item.optionDetail.length;
                var type=$scope.item.optionDetail[len-1].type;
                $scope.item.optionDetail.splice(len-1,1);

                if(type==0){
                    $scope.item.tempAnswers.splice($scope.item.tempAnswers.length-1,1);
                }
            }
        }


        $scope.save = function (form,item) {
            form.$setSubmitted(true);
            if (!form.$valid) {
                return;
            }

            //赋值
            var questions=[];
            var anwsers=[];
            if(item.type==2){
                item.optionDetail.forEach(function(o){
                    if(o.checked){
                        anwsers.push(o.option);
                    }
                })
                if(anwsers.length<2){
                    alert('多选题不能少于2个正确答案！');
                    return;
                }

                item.answer=anwsers.join('$');
            }else if(item.type==4){
                item.optionDetail.forEach(function(o){
                    questions.push(o.blankContent);
                })
                item.question=questions.join('');

                item.tempAnswers.forEach(function(o){
                    anwsers.push(o.answer);
                })
                item.answer=anwsers.join('$');
            }

            if(!item.question){
                alert("题干不能为空！");
                return;
            }
            if(!item.answer){
                alert("正确答案不能为空！");
                return;
            }

            item.images=$scope.item.tempImages.join(',');
            console.log(item);
            $http.post("/ovu-pcos/pcos/newknowledge/subject/edit", item).success(function (resp) {
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
