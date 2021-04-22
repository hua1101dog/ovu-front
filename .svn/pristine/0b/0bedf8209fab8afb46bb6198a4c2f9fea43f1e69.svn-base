// 试卷管理

(function () {
    "use strict";
    var app = angular.module("angularApp");
    app.controller('paperGroupCtrl', function ($scope, $rootScope, $http, $filter, $uibModal, fac) {
        document.title = "试卷管理";
        $scope.pageModel = {};
        $scope.search={};
        app.modulePromiss.then(function () {
            $scope.find(1);
        });

        //列表查询
        $scope.find = function (pageNo) {
            $.extend($scope.search, { currentPage: pageNo || $scope.pageModel.currentPage || 1, pageSize: $scope.pageModel.pageSize || 10});
            fac.getPageResult("/ovu-pcos/pcos/newknowledge/paper/list.do", $scope.search, function (data) {
                $scope.pageModel = data;
            });
        };

        //批量删除试卷
        $scope.delAll = function () {
            var ids = $scope.pageModel.list.reduce(function (ret, n) { n.checked && n.status!=1 && ret.push(n.id); return ret }, []);
            if(ids.length==0){
                alert('已开启的试卷不能删除！');
                return;
            }
            del(ids.join());
        };
        //删除试卷
        $scope.del = function (item) {
            del(item.id);

        }
        function del(ids) {
            confirm("确认删除选中的记录?", function () {
                $http.post("/ovu-pcos/pcos/newknowledge/paper/delete", { "ids": ids }, fac.postConfig).success(function (resp) {
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
        $scope.showEditModal = function (sub) {
            var copy = angular.extend({}, sub);
       
            copy.type=1;
            var modal = $uibModal.open({
                animation: false,
                size: 'lg',
                templateUrl: './knowledge/modal.editPaper.html',
                controller: 'editPaperCtrl'
                , resolve: { sub: copy }
            });
            modal.result.then(function () {
                $scope.find();
            }, function () {
                console.info('Modal dismissed at: ' + new Date());
            });
        }

        $scope.showPersons=function(item){
            var copy = angular.extend({}, item);
            var modal = $uibModal.open({
                animation: false,
                size: '',
                templateUrl: 'showPersons.html',
                controller: 'showPersonsCtrl'
                , resolve: { sub: copy }
            });
        }

        //预览
        $scope.review = function (sub) {
            var copy = angular.extend({}, sub);
            var modal = $uibModal.open({
                animation: false,
                size: 'lg',
                templateUrl: './knowledge/modal.reviewPaper.html',
                controller: 'reviewPaperCtrl'
                , resolve: { sub: copy }
            });
            modal.result.then(function () {

            });
        }

        $scope.startExam=function(item) {
            confirm("确认开启这次试卷考试?", function () {
                $http.post("/ovu-pcos/pcos/newknowledge/paper/start", { id: item.id }, fac.postConfig).success(function (resp) {
                    if (resp.code == "0") {
                        $scope.find();
                        msg(resp.msg);
                    } else {
                        alert(resp.msg);
                    }
                })
            });
        }

        $scope.endExam=function(item) {
            var copy = angular.extend({}, item);
            var modal = $uibModal.open({
                animation: false,
                size: '',
                templateUrl: 'confirmEndPaper.html',
                controller: 'endPaperCtrl'
                , resolve: { sub: copy }
            });
            modal.result.then(function () {
                $scope.find();
            });
        }
    });

    app.controller('endPaperCtrl', function ($scope, $http, fac, $uibModalInstance, sub) {
        $scope.item = sub || {};

        $http.post("/ovu-pcos/pcos/newknowledge/paper/end", { id: sub.id }, fac.postConfig).success(function (resp) {
            if (resp.code == 0) {
                $scope.item=resp.data;
            } else {
                alert(resp.msg);
            }
        })

        $scope.save = function () {
            $http.post("/ovu-pcos/pcos/newknowledge/paper/sendMessage", {id:$scope.item.id},fac.postConfig).success(function (resp) {
                if (resp.code == 0) {
                    msg('考试已结束！');
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


    app.controller('editPaperCtrl', function ($scope, $http, fac, $uibModal,$uibModalInstance, sub) {
        $scope.item = sub || {};
        $scope.currParkId=sub.currParkId;
        $scope.item.subjectDetail=[];

        $scope.numscore={
            totalNum:0,totalScore:0,
            num:{num1:0,num2:0,num3:0,num4:0,num5:0},
            score:{}
        };

        if (sub.id){
            $http.post("/ovu-pcos/pcos/newknowledge/paper/detail", { "id": sub.id }, fac.postConfig).success(function (resp) {
                if (resp.code == 0) {
                    $scope.item=resp.data;
                    $scope.item.subjectDetail.forEach(function (detail) {
                        detail.tempImages=[];
                        if (detail.images){
                            detail.tempImages=detail.images.split(",");
                        }
                        if(detail.type==2){
                            detail.answer=detail.answer.split('$').join('、');
                        }else if(detail.type==4){
                            var extAnswer=[];
                            detail.answer.split('$').forEach(function (value,index) {
                                extAnswer.push((index+1)+"."+value);
                            });
                            detail.answer=extAnswer.join('  ');
                        }

                    });
                    setProperValue(resp.data);
                } else {
                    alert('获取详情失败！');
                }
            })
        }

        function setProperValue(item){
            $scope.numscore.totalNum=item.totalCount;
            $scope.numscore.totalScore=item.totalScore;

            var nums=item.count.split(",") || [];
            var scores=item.score.split(",") || [];
            $scope.numscore.num={num1:nums[0],num2:nums[1],num3:nums[2],num4:nums[3],num5:nums[4]};
            $scope.numscore.score={score1:Number(scores[0]),score2:Number(scores[1]),score3:Number(scores[2]),score4:Number(scores[3]),score5:Number(scores[4])};

        }

        $scope.sort=function(smallIndex,biggerIndex){
            var small=$scope.item.subjectDetail[smallIndex];
            var big=$scope.item.subjectDetail[biggerIndex];

            $scope.item.subjectDetail[smallIndex]=big;
            $scope.item.subjectDetail[biggerIndex]=small;
        };

        $scope.calcluScore=function(){

            $scope.numscore.num={num1:0,num2:0,num3:0,num4:0,num5:0};
            $scope.item.subjectDetail.forEach(function (detail) {
                if (detail.type==1){
                    $scope.numscore.num.num1++;
                }else if (detail.type==2){
                    $scope.numscore.num.num2++;
                }else if (detail.type==3){
                    $scope.numscore.num.num3++;
                }else if (detail.type==4){
                    $scope.numscore.num.num4++;
                }else if (detail.type==5){
                    $scope.numscore.num.num5++;
                }
            });
            $scope.numscore.totalNum=$scope.item.subjectDetail.length;


            var totalScore=0;
            if ($scope.numscore.score.score1){
                totalScore+=$scope.numscore.score.score1;
            }
            if ($scope.numscore.score.score2){
                totalScore+=$scope.numscore.score.score2;
            }
            if ($scope.numscore.score.score3){
                totalScore+=$scope.numscore.score.score3;
            }
            if ($scope.numscore.score.score4){
                totalScore+=$scope.numscore.score.score4;
            }
            if ($scope.numscore.score.score5){
                totalScore+=$scope.numscore.score.score5;
            }
            $scope.numscore.totalScore=totalScore;
        };


        $scope.del=function(detail){
            $scope.item.subjectDetail.splice($scope.item.subjectDetail.indexOf(detail),1);

            //计算
            $scope.calcluScore();
        };

        $scope.selectSubject=function(){
            var modal = $uibModal.open({
                animation: false,
                size:'lg',
                templateUrl: '/view/knowledge/modal.select.subject.html',
                controller: 'selectSubjectCtrl'
                ,resolve: {parkId:function(){return '';}}
            });
            modal.result.then(function (data) {
                if(data){
                    var ids=[];
                    data.forEach(function (s) {
                        ids.push(s.id);
                    });
                    $http.post("/ovu-pcos/pcos/newknowledge/subject/detail", {"ids": ids.join()}, fac.postConfig).success(function (resp) {
                        if (resp.code == 0) {
                            data=resp.data.subjectDetail;
                            data.forEach(function (detail) {
                                detail.tempImages=detail.images?detail.images.split(','):[];
                                if(detail.type==2){
                                    detail.answer=detail.answer.split('$').join('、');
                                }else if(detail.type==4){
                                    var extAnswer=[];
                                    detail.answer.split('$').forEach(function (value,index) {
                                        extAnswer.push((index+1)+"."+value);
                                    });
                                    detail.answer=extAnswer.join('  ');
                                }
                            });
                            setSj(data);
                        } else {
                            alert('获取详情失败！');
                        }
                    })
                }
            });
            function setSj(datas){
                $scope.item.subjectDetail=$scope.item.subjectDetail || [];
                if ($scope.item.subjectDetail.length>0){
                    $scope.item.subjectDetail.forEach(function (sub) {
                        datas.forEach(function (detail) {
                            if(sub.id==detail.id){
                                detail.isExist=true;
                            }
                        })
                    })
                }

                datas.forEach(function (detail) {
                    if(!detail.isExist){
                        $scope.item.subjectDetail.push(detail);
                    }
                });

                //计算
                $scope.calcluScore();
            }
        }

        $scope.selectPerson=function(){
            var sub=deFormatP($scope.item) || {};
            sub.isGroup=1;
            var modal = $uibModal.open({
                animation: false,
                size:sub.isGroup?'max':'lg',
                templateUrl: '/view/knowledge/modal.selectPersons.html',
                controller: 'selectPaperPersonsCtrl'
                ,resolve: {sub:function () {
                        return sub;
                    }}
            });
            modal.result.then(function (data) {
                if(data){
                    formatP(data);
                }
            });
        }

        function formatP(data){
            var parkIds=[],parkNames=[],deptIds=[],deptNames=[],personIds=[],personNames=[];
            data.parks.forEach(function (item) {
                parkIds.push(item.id);
                parkNames.push(item.parkName);
            })
            data.depts.forEach(function (item) {
                deptIds.push(item.id);
                deptNames.push(item.deptName);
            })
            data.persons.forEach(function (item) {
                personIds.push(item.id);
                personNames.push(item.personName);
            })

            $scope.item.parkIds=parkIds.join();
            $scope.item.parkNames=parkNames.join();
            $scope.item.deptIds=deptIds.join();
            $scope.item.deptNames=deptNames.join();
            $scope.item.personIds=personIds.join();
            $scope.item.personNames=personNames.join();
        }
        function deFormatP(item){
            var result={parks:[],depts:[],persons:[]};
            var parkIds=[],parkNames=[],deptIds=[],deptNames=[],personIds=[],personNames=[];
            if(item.parkIds){
                parkIds=item.parkIds.split(',');
                parkNames=item.parkNames.split(',');
            }
            if(item.deptIds){
                deptIds=item.deptIds.split(',');
                deptNames=item.deptNames.split(',');
            }
            if(item.personIds){
                personIds=item.personIds.split(',');
                personNames=item.personNames.split(',');
            }

            parkIds.forEach(function (value,index) {
                result.parks.push({id:value,parkName:parkNames[index]});
            })
            deptIds.forEach(function (value,index) {
                result.depts.push({id:value,deptName:deptNames[index]});
            })
            personIds.forEach(function (value,index) {
                result.persons.push({id:value,personName:personNames[index]});
            })

            return result;
        }


        $scope.save = function (form,item) {
            form.$setSubmitted(true);
            if (!form.$valid) {
                return;
            }
            var sscore=$scope.numscore.score;
            var nnum=$scope.numscore.num;

            if(!item.subjectDetail || item.subjectDetail.length==0){
                alert('题目不能为空！');
                return;
            }
            if(nnum.num1==0 && sscore.score1>0){
                alert('单选题数量为0，分值应该设为0！');
                return;
            }else if(nnum.num2==0 && sscore.score2>0){
                alert('多选题数量为0，分值应该设为0！');
                return;
            }else if(nnum.num3==0 && sscore.score3>0){
                alert('判断题数量为0，分值应该设为0！');
                return;
            }else if(nnum.num4==0 && sscore.score4>0){
                alert('填空题数量为0，分值应该设为0！');
                return;
            }else if(nnum.num5==0 && sscore.score5>0){
                alert('问答题数量为0，分值应该设为0！');
                return;
            }

            if($scope.numscore.totalScore!=100){
                alert('总分必须为100分！');
                return;
            }

            if(!item.parkNames){
                alert("项目不能为空！");
                return;
            }
            if(!item.deptNames){
                alert("部门不能为空！");
                return;
            }
            if(!item.personNames){
                alert("人员不能为空！");
                return;
            }

            var subjectIds=[];
            item.subjectDetail && item.subjectDetail.forEach(function (detail) {
                subjectIds.push(detail.id);
            });
            item.subjectIds=subjectIds.join();
            item.count=nnum.num1+','+nnum.num2+','+nnum.num3+','+nnum.num4+','+nnum.num5+','+$scope.numscore.totalNum;
            item.score=sscore.score1+','+sscore.score2+','+sscore.score3+','+sscore.score4+','+sscore.score5+','+$scope.numscore.totalScore;

            $http.post("/ovu-pcos/pcos/newknowledge/paper/edit", item,fac.postConfig).success(function (resp) {
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

    app.controller('selectPaperPersonsCtrl', function ($scope, $http, fac, $uibModalInstance, sub) {
        $scope.item = sub || {};
        $scope.parks=sub.parks || [];
        $scope.depts=sub.depts || [];
        $scope.persons=sub.persons || [];
        $scope.parkPageModel={};
        $scope.treeData=[];
        $scope.pageModel={};
        $scope.search={};

        

        //带入时
        if($scope.parks.length>0){
           loadDeptTree();
        }
        if($scope.depts.length>0){
            loadDeptPerson($scope.depts[0].id);
        }

        $scope.findParks=function(){
            $http.get("/ovu-base/system/park/listByGrid.do?pageSize=1000").success(function(ret){
                if(ret.code ===0){
                    ret.data.data.forEach(function(p){
                        $scope.parks.forEach(function(park){
                            if(p.id==park.id){
                                p.checked=true;
                            }
                        });
                    });
                    $scope.parkPageModel.list=ret.data.data;
                }
            })
        }
        if($scope.item.isGroup){
            $scope.findParks();
        }


        //勾选项目
        $scope.checkpark=function(park){
            park.checked=!park.checked;

            if(park.checked){
                $scope.parks.push({id:park.id,parkName:park.parkName});
            }else{
                $scope.parks.forEach(function (p) {
                    if(park.id==p.id){
                        $scope.parks.splice($scope.parks.indexOf(p),1);
                    }
                })

                //人员清除
                if($scope.parks.length>0 && $scope.persons.length>0){
                    var node = $scope.treeDataFlat.find(function(n){return n.parkId == park.id});
                    if(node){
                        removeDeptPerson(node.did);
                    }
                }
            }

            loadDeptTree();
        }

        //全选项目
        $scope.checkparkAll=function(){
            $scope.parkPageModel.checked=!$scope.parkPageModel.checked;

            $scope.parks=[];
            if($scope.parkPageModel.checked){
                $scope.parkPageModel.list.forEach(function (item) {
                    item.checked=true;

                    $scope.parks.push({id:item.id,parkName:item.parkName});
                })
            }else{
                $scope.parkPageModel.list.forEach(function (item) {
                    item.checked=false;
                })
            }

            loadDeptTree();
        }
        
        //勾选部门
        $scope.deptIds=[]
        $scope.check = function(node){
            node.state = node.state||{};
            node.state.checked = !node.state.checked;
            function checkSons(node,status){
                if(status){
                    var i=isInDeptArray($scope.depts,node);
                    if(i==-1){
                        $scope.depts.push({id:node.did,deptName:node.text});
                    }
                }else{
                    var i=isInDeptArray($scope.depts,node);
                    if(i!=-1){
                        $scope.depts.splice(i,1);
                    }
                }
                node.state = node.state||{};
                node.state.checked = status;
                if(node.nodes && node.nodes.length){
                    node.nodes.forEach(function(n){checkSons(n,status);})
                }
            }
            function uncheckFather(node){
                var father = worktypeList.find(function(n){return n.id == node.pid});
                if(father){
                    father.state = father.state||{};
                    father.state.checked = false;
                    uncheckFather(father);
                }
            }

            var currDeptId;
            if(node.state.checked){
                if($scope.currNode && $scope.currNode!=node){
                    $scope.currNode.state.selected = false;
                }
                node.state.selected = true;
                $scope.currNode=node;
                currDeptId=node.did;

                checkSons(node,true);
            }else{
                node.state.selected = false;

                checkSons(node,false);
            }

            if(currDeptId){
                $scope.deptIds.push(currDeptId);
                loadDeptPerson($scope.deptIds.join(','));
            }else{
                if($scope.depts.length==0){
                    $scope.persons=[];
                    $scope.pageModel.checked=false;
                    $scope.pageModel.list && $scope.pageModel.list.forEach(function (item) {
                        item.checked=false;
                    });
                    return;
                }

                //移除已选人员
                if($scope.depts.length>0 && $scope.persons.length>0){
                  
                    removeDeptPerson(node.did);
                }

                //取消人员列表
                if($scope.currNode && $scope.currNode!=node){
                    
                    loadDeptPerson($scope.currNode.did);
                }else{
                   
                    loadDeptPerson(node.did);
                }
            }
        };

        //选中部门
        // $scope.selectNode = function(node){
        //     if(node.state.checked){
        //         if($scope.currNode && $scope.currNode!=node){
        //             $scope.currNode.state.selected = false;
        //         }
        //         node.state.selected = true;
        //         $scope.currNode=node;

        //         loadDeptPerson(node.did);
        //     }else{
        //         node.state.selected = false;
        //     }
        // };



        function removeDeptPerson(deptId){
            $http.post("/ovu-base/pcos/person/getPersonListByDeptId4All.do", {deptId:deptId},fac.postConfig).success(function (data) {
                 data.forEach(function(p){
                     $scope.persons.forEach(function(person){
                         if(p.id==person.id){
                             $scope.persons.splice($scope.persons.indexOf(person),1);
                         }
                     });
                });
            });
        }

        //加载部门树
        function loadDeptTree(){
            if($scope.parks.length==0){
                $scope.treeData=[];
                $scope.depts=[];
                $scope.pageModel={};
                $scope.persons=[];
                return;
            }

            var parkIds=[];
            $scope.parks.forEach(function(park){
                parkIds.push(park.id);
            });

            $scope.treeData=[];
            $http.post("/ovu-pcos/pcos/worklogs/multi/worklogpermission/detptree.do", {parkId:parkIds.join()},fac.postConfig).success(function (resp) {
                var data=resp.data || [];
                data.forEach(function(v){
                    $scope.treeData.push(v[0]);
                });
                //带入时进行选中
                if($scope.depts.length>0){
                    $scope.treeDataFlat=fac.treeToFlat($scope.treeData);

                    var tmpDepts=[];
                    $scope.depts.forEach(function (dept) {
                        var node = $scope.treeDataFlat.find(function(n){return n.did == dept.id});
                        if(node){
                            tmpDepts.push(dept);
                            node.state = node.state||{};
                            node.state.checked =true;
                            expandFather(node);
                        }
                    })

                    $scope.depts=tmpDepts;
                }
            });

            function expandFather(node){
                var father = $scope.treeDataFlat.find(function(n){return n.did == node.pdid});
                if(father){
                    father.state = father.state||{};
                    father.state.expanded = true;
                    expandFather(father);
                }
            }
        }

        $scope.find = function(pageNo){
            loadPersonData(pageNo);
        };
        // $scope.search.deptId=[];
        //加载部门人员
        function loadDeptPerson(deptId){
        
            if(deptId){
               $scope.hasDep=true;
            }

            $scope.search.deptId=deptId;
            loadPersonData(1);
        }

        function loadPersonData(pageNo){
            $.extend($scope.search,{currentPage:pageNo||$scope.pageModel.currentPage||1,pageSize:$scope.pageModel.pageSize||10});
            fac.getPageResult("/ovu-base/pcos/person/listByGrid.do",$scope.search,function(data){
                data.data.forEach(function(p){
                    $scope.persons && $scope.persons.forEach(function(person){
                        if(p.id==person.id){
                            p.checked=true;
                        }
                    });
                });
                $scope.pageModel = data;
            });
        }

        //选中人员
        $scope.checkPerson=function(person){
            person.checked=!person.checked;

            if(person.checked){
                $scope.persons.push({id:person.id,personName:person.name});
            }else{
                $scope.persons.forEach(function(p){
                    if(person.id==p.id){
                        $scope.persons.splice($scope.persons.indexOf(p),1);
                    }
                });
            }
        }

        //全选人员
        $scope.checkPersonAll=function(){
            $scope.pageModel.checked=!$scope.pageModel.checked;

            if($scope.pageModel.checked){
                $scope.pageModel.list.forEach(function (item) {
                    item.checked=true;

                    var i=isInArray($scope.persons,item);

                    if(i==-1){
                        $scope.persons.push({id:item.id,personName:item.name});
                    }
                })
            }else{
                $scope.pageModel.list.forEach(function (item) {
                    item.checked=false;

                    var i=isInArray($scope.persons,item);
                    if(i!=-1){
                        $scope.persons.splice(i,1);
                    }
                })
            }
        }

        //删除人员
        $scope.delPerson=function (persons,person) {
            $scope.pageModel.list.forEach(function (item) {
                if(item.id==person.id){
                    item.checked=false;
                }
            })

            persons.splice(persons.indexOf(person),1);
        }

        function isInDeptArray(arr, value) {
            //debugger;
            var f = -1;
            arr.forEach(function (p, i) {
                if (p.id === value.did) {
                    f = i;
                }
            });
            return f;
        }

        function isInArray(arr, value) {
            //debugger;
            var f = -1;
            arr.forEach(function (p, i) {
                if (p.id === value.id) {
                    f = i;
                }
            });
            return f;
        }

        $scope.save = function (form,item) {
            if($scope.parks.length==0){
                alert("项目不能为空！");
                return;
            }
            if($scope.depts.length==0){
                alert("部门不能为空！");
                return;
            }
            if($scope.persons.length==0){
                alert("人员不能为空！");
                return;
            }

            var data={
                parks:$scope.parks,
                depts:$scope.depts,
                persons:$scope.persons
            };
            $uibModalInstance.close(data);

        }

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    });

    app.controller('reviewPaperCtrl', function ($scope, $http, fac, $uibModalInstance, sub) {
        $scope.item = sub || {};

        $scope.numscore={
            totalNum:0,totalScore:0,
            num:{num1:0,num2:0,num3:0,num4:0,num5:0},
            score:{}
        };

        if (sub.id){
            $http.post("/ovu-pcos/pcos/newknowledge/paper/detail", { "id": sub.id }, fac.postConfig).success(function (resp) {
                if (resp.code == 0) {
                    $scope.item=resp.data;
                    $scope.item.subjectDetail.forEach(function (detail) {
                        detail.tempImages=[];
                        if (detail.images){
                            detail.tempImages=detail.images.split(",");
                        }
                        if(detail.type==2){
                            detail.answer=detail.answer.split('$').join('、');
                        }else if(detail.type==3){
                            if(detail.answer=='A'){
                                detail.answer='正确';
                            }else{
                                detail.answer='错误';
                            }
                        }else if(detail.type==4){
                            var extAnswer=[];
                            detail.answer.split('$').forEach(function (value,index) {
                                extAnswer.push((index+1)+"."+value);
                            });
                            detail.answer=extAnswer.join('  ');
                        }

                    });
                    setProperValue(resp.data);
                } else {
                    alert('获取详情失败！');
                }
            })

        }

        function setProperValue(item){
            $scope.numscore.totalNum=item.totalCount;
            $scope.numscore.totalScore=item.totalScore;

            var nums=item.count.split(",") || [];
            var scores=item.score.split(",") || [];
            $scope.numscore.num={num1:nums[0],num2:nums[1],num3:nums[2],num4:nums[3],num5:nums[4]};
            $scope.numscore.score={score1:scores[0],score2:scores[1],score3:scores[2],score4:scores[3],score5:scores[4]};
        }

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    });

    app.controller('selectSubjectCtrl', function ($scope, $http, fac, $uibModalInstance) {
        $scope.config = {
            edit: false,
            showCheckbox: true
        }

        $scope.pageModel = {};
        $scope.search={};
        $scope.treeData = [];
        $scope.types = [];


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
        $scope.find(1);

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

        $scope.save = function () {
            var datas = $scope.pageModel.list.reduce(function (ret, n) {
                n.checked && ret.push(n);
                return ret
            }, []);
            if (datas.length == 0) {
                alert("请选择题目！");
            } else {
                $uibModalInstance.close(datas);
            }
        }

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    });

    app.controller('showPersonsCtrl', function ($scope, $http, fac, $uibModalInstance, sub) {
        $scope.item = sub || {};

        $http.post("/ovu-pcos/pcos/newknowledge/paper/detail", { "id": sub.id }, fac.postConfig).success(function (resp) {
            if (resp.code == 0) {
                $scope.item=resp.data;
            } else {
                alert('获取详情失败！');
            }
        })

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    });

})();
