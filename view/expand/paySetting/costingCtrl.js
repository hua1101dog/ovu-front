(function() {
    "use strict";
    var app = angular.module("angularApp");
    app.controller('costingCtl', function ($scope,$rootScope, $http,$filter,$uibModal,$location,fac,$timeout) {
        document.title ="成本计算";
        $scope.projectId=null;
        $scope.isJump=false;//是否跳转过来
        $scope.list=[];//配置集合
        $scope.costModel={project_id:null,total_pay:0,total_earning:0,costPays:[],costEarning:{}};//配置数据集合
        $scope.earning={};//收入测算

        $scope.init=function(){
            //加载项目列表
            loadProjects();
            setTxt();

            //从报价单跳转过来
            if ($location.search().projectId) {
                $scope.isJump=true;
                $scope.projectId = $location.search().projectId;
                getCostModel($scope.projectId);
            }

            //加载付款项列表
            load();
        };

        //生成
        $scope.build=function(form){
            form.$setSubmitted(true);
            if (!form.$valid) {
                return;
            }

            var modal = $uibModal.open({
                animation: true,
                size: '',
                templateUrl: 'expand/paySetting/modal.project.html',
                controller: 'selectProjectModalCtrl'
                , resolve: {projects:function(){return  angular.extend({},$scope.projects);}}
            });
            modal.result.then(function (data) {
                $scope.costModel.project_id=data.projectId;
                doSave();
            }, function () {
                console.info('Modal dismissed at: ' + new Date());
            });

        };
        //保存
        $scope.save=function(form){
            form.$setSubmitted(true);
            if (!form.$valid) {
                return;
            }

            doSave();
        };

        function doSave(){
            $scope.costModel.costPays=[];
            //支出
            $scope.list.forEach(function(item){
                var ids=[],values=[];
                var formula_value='';
                if(item.pays){
                    item.pays.forEach(function(pay,index){
                        ids.push(pay.id);
                        values.push(pay.value);
                        //公式文本拼接
                        formula_value+=pay.value+pay.unit+(item.opers[index]?item.opers[index]:'');
                    });
                }
                //构造支出报价实体
                if(item.type_id){
                    var cost={};
                    cost.id=item.cost_id;
                    cost.project_id=item.cost_project_id;
                    cost.version_id=item.cost_version;
                    cost.name=item.type_name;
                    cost.parent_id=item.type_id;
                    cost.result_value=item.result_value;
                    cost.top_id=item.fid;
                    cost.formula_value=formula_value;
                    cost.variable_list=ids.join();
                    cost.value_list=values.join();
                    cost.create_time=item.cost_create_time;
                    $scope.costModel.costPays.push(cost);
                }
            });

            //收入
            $scope.costModel.costEarning=$scope.earning || {};

            $http.post("/ovu-pcos/extend/cost/save.do",{json:JSON.stringify($scope.costModel),isEdit:$scope.isJump?true:false},fac.postConfig).success(function(data){
                if(data.success){
                    if(!$scope.isJump){
                        msg('生成报价表成功！');
                        $location.url("/expand/report/list");
                    }else{
                        msg('保存成功！');
                    }
                }else{
                    alert(data.error);
                }
            });
        }

        //返回
        $scope.goback = function() {
            //window.history.back();
            $location.url("/expand/report/list");
        };

        //查询报价配置
        $scope.find = function() {
            $http.post("/ovu-pcos/extend/cost/list.do",{projectId:$scope.projectId},fac.postConfig).success(function(data){
                $scope.list = data;

                $scope.list.forEach(function(item){
                    //$scope.changeCost(item);
                    item.pays.forEach(function(pay){
                        $scope.changeCost(item,pay);
                    })
                });

                //总支出
                setTotalPay();

                $timeout(function(){
                    mergeCells();
                });
            });
        };

        //合并单元格
        function mergeCells(){
            var fcells=[],scells=[];
            $scope.list.forEach(function(item,index){
                var fid=item.fid;

                if(fcells.indexOf(fid)>-1){
                    REDIPS.table.mark(true, 'mytable', index+1, 0);
                    if((index+1)==$scope.list.length){
                        REDIPS.table.merge('v', true, 'mytable');
                    }
                }else{
                    fcells.push(fid);
                    if((index+1)==$scope.list.length){
                        REDIPS.table.merge('v', true, 'mytable');
                        REDIPS.table.mark(true, 'mytable', index+1, 0);
                    }
                    REDIPS.table.merge('v', true, 'mytable');
                    if((index+1)!=$scope.list.length){
                        REDIPS.table.mark(true, 'mytable', index+1, 0);
                    }
                }
            });
            $scope.list.forEach(function(item,index){
                var sid=item.sid;
                if(sid){
                    if(scells.indexOf(sid)>-1){
                        REDIPS.table.mark(true, 'mytable', index+1, 1);
                        if((index+1)==$scope.list.length){
                            REDIPS.table.merge('v', true, 'mytable');
                        }
                    }else{
                        scells.push(sid);
                        if((index+1)==$scope.list.length){
                            REDIPS.table.merge('v', true, 'mytable');
                            REDIPS.table.mark(true, 'mytable', index+1, 1);
                        }
                        REDIPS.table.merge('v', true, 'mytable');
                        if((index+1)!=$scope.list.length){
                            REDIPS.table.mark(true, 'mytable', index+1, 1);
                        }
                    }
                }else{
                    REDIPS.table.merge('v', true, 'mytable');
                }
            });
        }

        //查询收入
        function getCostModel(projectId) {
            $http.post("/ovu-pcos/extend/cost/listData.do",{projectId:projectId},fac.postConfig).success(function(data){
                $scope.costModel=data;
                $scope.earning=$scope.costModel.costEarning;
                $scope.setEarning();
            });
        };

        //更改项的值
        $scope.changeCost=function(item,currPay){
            item.result_value=null;
            var isBreak=false;

            if(item.pays && item.pays.length>0){
                item.pays.forEach(function(pay,index){
                    if(!pay.value){
                        item.result_value=null;
                        isBreak=true;
                    }else{
                        pay.value=Number(pay.value);
                    }
                    if(!isBreak){   //项值不为空
                        if(index>0){
                            if(index<=item.opers.length){
                                var oper=item.opers[index-1];//运算符
                                var attrValue=pay.value;
                                if(oper=='+'){
                                    item.result_value=item.result_value+attrValue;
                                }else if(oper=='-'){
                                    item.result_value=item.result_value-attrValue;
                                }else if(oper=='×'){
                                    item.result_value=item.result_value*attrValue;
                                }else if(oper=='÷'){
                                    item.result_value=item.result_value/attrValue;
                                }
                            }
                        }else{
                            //首次值等于自己
                            item.result_value=Number(pay.value);
                        }
                    }
                });
                item.result_value=item.result_value?item.result_value.toFixed(2):null;
            }

            //当前变量是否被其他变量引用
            changeOtherFormulaValue(item,currPay);

            //总支出
            setTotalPay();
        };


        function changeOtherFormulaValue(item,pay){
            if(!pay){
                return;
            }
            var currValue=pay.value?pay.value:Number(0);
            $scope.list.forEach(function(item){
                //console.log(item.type_name);
                item.pays.forEach(function(it,index){
                    //变量是计算公式时
                    if(it.val_type==2 && it.formula.indexOf(pay.id)>-1){

                        var formula=it.formula;
                        //console.log('公式：'+formula);
                        //把id替换实际值
                        $scope.list.forEach(function(item2){
                            item2.pays.forEach(function(p,index){
                                var value=p.value?p.value:Number(0);
                                formula=formula.replace(p.id,value);
                            });
                        });

                        //没找到值替换为0
                        var fms=formula.split(" ");
                        fms.forEach(function(fm,index){
                            if(fm && fm.length==32){
                                fms[index]=0;
                            }
                        });
                        formula=fms.join('');

                        formula=formula.replace(/\s/g,"");
                        //console.log('填值：'+formula);
                        //计算公式的值
                        it.value=eval(formula);

                        //计算当前公式所在项的计算公式
                        $scope.changeCost(item,it);
                    }
                });
            });
        }

        //设置总支出
        function setTotalPay(){
            $scope.costModel.total_pay=Number(0);
            $scope.list.forEach(function(item){
                $scope.costModel.total_pay+=item.result_value?Number(item.result_value):0;
            });
            $scope.costModel.total_pay= $scope.costModel.total_pay.toFixed(2);
        }

        //加载成本配置数据
        function load(){
            //设置收入初始值
            $scope.setEarning();
            //加载支出数据
            $scope.find();
        }


        //加载项目
        function loadProjects(){
            $http.post("/ovu-pcos/extend/cost/listProjects.do",{},fac.postConfig).success(function(data){
                $scope.projects = data;
            });
        };

        //计算收入测算
        $scope.setEarning=function(){
            $scope.earning.price_h_x=null,$scope.earning.price_h_x2=null,$scope.earning.price_h_x3=null,$scope.earning.price_h_x4=null;
            $scope.earning.price_s_x=null,$scope.earning.price_s_x2=null,$scope.earning.price_s_x3=null,$scope.earning.price_s_x4=null;
            $scope.earning.price_k_x=null,$scope.earning.price_k_x2=null,$scope.earning.price_k_x3=null,$scope.earning.price_k_x4=null;
            $scope.earning.price_b_x=null,$scope.earning.price_b_x2=null,$scope.earning.price_b_x3=null,$scope.earning.price_b_x4=null;
            $scope.earning.price_o_x=null,$scope.earning.price_o_x2=null,$scope.earning.price_o_x3=null,$scope.earning.price_o_x4=null;
            $scope.earning.price_u_x=null,$scope.earning.price_u_x2=null,$scope.earning.price_u_x3=null,$scope.earning.price_u_x4=null;
            $scope.earning.price_d_x=null,$scope.earning.price_d_x2=null,$scope.earning.price_d_x3=null,$scope.earning.price_d_x4=null;



            //高层
            if($scope.earning.price_h){
                $scope.earning.price_h_x=($scope.earning.price_h/1.06).toFixed(2);
            }
            if($scope.earning.price_h_x && $scope.earning.count_h && $scope.earning.scale_h) {
                $scope.earning.price_h_x2 = ($scope.earning.price_h_x * $scope.earning.count_h * $scope.earning.scale_h / 100).toFixed(2);
            }
            if($scope.earning.price_h_x2) {
                $scope.earning.price_h_x3 = ($scope.earning.price_h_x2 * 0.06).toFixed(2);
            }
            if($scope.earning.price_h_x2 && $scope.earning.price_h_x3) {
                $scope.earning.price_h_x4 = Number($scope.earning.price_h_x2) + Number($scope.earning.price_h_x3);
                $scope.earning.price_h_x4 =$scope.earning.price_h_x4.toFixed(2);
                $scope.earning.price_h_money=$scope.earning.price_h_x4;
            }

            //超高层
            if($scope.earning.price_s){
                $scope.earning.price_s_x=($scope.earning.price_s/1.06).toFixed(2);
            }
            if($scope.earning.price_s_x && $scope.earning.count_s && $scope.earning.scale_s) {
                $scope.earning.price_s_x2 = ($scope.earning.price_s_x * $scope.earning.count_s * $scope.earning.scale_s / 100).toFixed(2);
            }
            if($scope.earning.price_s_x2) {
                $scope.earning.price_s_x3 = ($scope.earning.price_s_x2 * 0.06).toFixed(2);
            }
            if($scope.earning.price_s_x2 && $scope.earning.price_s_x3) {
                $scope.earning.price_s_x4 = Number($scope.earning.price_s_x2) + Number($scope.earning.price_s_x3);
                $scope.earning.price_s_x4 =$scope.earning.price_s_x4.toFixed(2);
                $scope.earning.price_s_money=$scope.earning.price_s_x4;
            }

            //幼儿园
            if($scope.earning.price_k){
                $scope.earning.price_k_x=($scope.earning.price_k/1.06).toFixed(2);
            }
            if($scope.earning.price_k_x && $scope.earning.count_k && $scope.earning.scale_k) {
                $scope.earning.price_k_x2 = ($scope.earning.price_k_x * $scope.earning.count_k * $scope.earning.scale_k / 100).toFixed(2);
            }
            if($scope.earning.price_k_x2) {
                $scope.earning.price_k_x3 = ($scope.earning.price_k_x2 * 0.06).toFixed(2);
            }
            if($scope.earning.price_k_x2 && $scope.earning.price_k_x3) {
                $scope.earning.price_k_x4 = Number($scope.earning.price_k_x2) + Number($scope.earning.price_k_x3);
                $scope.earning.price_k_x4 =$scope.earning.price_k_x4.toFixed(2);
                $scope.earning.price_k_money=$scope.earning.price_k_x4;
            }

            //商业
            if($scope.earning.price_b){
                $scope.earning.price_b_x=($scope.earning.price_b/1.06).toFixed(2);
            }
            if($scope.earning.price_b_x && $scope.earning.count_b && $scope.earning.scale_b) {
                $scope.earning.price_b_x2 = ($scope.earning.price_b_x * $scope.earning.count_b * $scope.earning.scale_b / 100).toFixed(2);
            }
            if($scope.earning.price_b_x2) {
                $scope.earning.price_b_x3 = ($scope.earning.price_b_x2 * 0.06).toFixed(2);
            }
            if($scope.earning.price_b_x2 && $scope.earning.price_b_x3) {
                $scope.earning.price_b_x4 = Number($scope.earning.price_b_x2) + Number($scope.earning.price_b_x3);
                $scope.earning.price_b_x4 =$scope.earning.price_b_x4.toFixed(2);
                $scope.earning.price_b_money=$scope.earning.price_b_x4;
            }

            //其他
            if($scope.earning.price_o){
                $scope.earning.price_o_x=($scope.earning.price_o/1.06).toFixed(2);
            }
            if($scope.earning.price_o_x && $scope.earning.count_o && $scope.earning.scale_o) {
                $scope.earning.price_o_x2 = ($scope.earning.price_o_x * $scope.earning.count_o * $scope.earning.scale_o / 100).toFixed(2);
            }
            if($scope.earning.price_o_x2) {
                $scope.earning.price_o_x3 = ($scope.earning.price_o_x2 * 0.06).toFixed(2);
            }
            if($scope.earning.price_o_x2 && $scope.earning.price_o_x3) {
                $scope.earning.price_o_x4 = Number($scope.earning.price_o_x2) + Number($scope.earning.price_o_x3);
                $scope.earning.price_o_x4 =$scope.earning.price_o_x4.toFixed(2);
                $scope.earning.price_o_money=$scope.earning.price_o_x4;
            }

            //地下
            if($scope.earning.price_u){
                $scope.earning.price_u_x=($scope.earning.price_u/1.06).toFixed(2);
            }
            if($scope.earning.price_u_x && $scope.earning.count_u && $scope.earning.scale_u) {
                $scope.earning.price_u_x2 = ($scope.earning.price_u_x * $scope.earning.count_u * $scope.earning.scale_u / 100).toFixed(2);
            }
            if($scope.earning.price_u_x2) {
                $scope.earning.price_u_x3 = ($scope.earning.price_u_x2 * 0.06).toFixed(2);
            }
            if($scope.earning.price_u_x2 && $scope.earning.price_u_x3) {
                $scope.earning.price_u_x4 = Number($scope.earning.price_u_x2) + Number($scope.earning.price_u_x3);
                $scope.earning.price_u_x4 =$scope.earning.price_u_x4.toFixed(2);
                $scope.earning.price_u_money=$scope.earning.price_u_x4;
            }

            //地上
            if($scope.earning.price_d){
                $scope.earning.price_d_x=($scope.earning.price_d/1.06).toFixed(2);
            }
            if($scope.earning.price_d_x && $scope.earning.count_d && $scope.earning.scale_d) {
                $scope.earning.price_d_x2 = ($scope.earning.price_d_x * $scope.earning.count_d * $scope.earning.scale_d / 100).toFixed(2);
            }
            if($scope.earning.price_d_x2) {
                $scope.earning.price_d_x3 = ($scope.earning.price_d_x2 * 0.06).toFixed(2);
            }
            if($scope.earning.price_d_x2 && $scope.earning.price_d_x3) {
                $scope.earning.price_d_x4 = Number($scope.earning.price_d_x2) + Number($scope.earning.price_d_x3);
                $scope.earning.price_d_x4 =$scope.earning.price_d_x4.toFixed(2);
                $scope.earning.price_d_money=$scope.earning.price_d_x4;
            }

            //算合计
            $scope.earning.price_total_one=0;
            $scope.earning.price_total_two=0;
            if($scope.earning.price_h_x4){
                $scope.earning.price_total_one+=Number($scope.earning.price_h_x4);
            }
            if($scope.earning.price_s_x4){
                $scope.earning.price_total_one+=Number($scope.earning.price_s_x4);
            }
            if($scope.earning.price_k_x4){
                $scope.earning.price_total_one+=Number($scope.earning.price_k_x4);
            }
            if($scope.earning.price_b_x4){
                $scope.earning.price_total_one+=Number($scope.earning.price_b_x4);
            }
            if($scope.earning.price_o_x4){
                $scope.earning.price_total_one+=Number($scope.earning.price_o_x4);
            }

            if($scope.earning.price_u_x4){
                $scope.earning.price_total_two+=Number($scope.earning.price_u_x4);
            }
            if($scope.earning.price_d_x4){
                $scope.earning.price_total_two+=Number($scope.earning.price_d_x4);
            }

            //总合计
            $scope.costModel.total_earning=$scope.earning.price_total_one+$scope.earning.price_total_two;

            //格式化
            $scope.earning.price_total_one=$scope.earning.price_total_one.toFixed(2);
            $scope.earning.price_total_two=$scope.earning.price_total_two.toFixed(2);
            $scope.costModel.total_earning=$scope.costModel.total_earning.toFixed(2);


            //设置默认显示
            setTxt();
        }
        function setTxt(){
            var txt_x='含税单价/1.06 保留2位数';
            var txt_x2='不含税单价*收费面积*收费率';
            var txt_x3='收入*0.06 保留2位数';
            var txt_x4='收入+增值税金';

            $scope.earning.price_h_x=$scope.earning.price_h_x?$scope.earning.price_h_x+'元':txt_x;
            $scope.earning.price_h_x2=$scope.earning.price_h_x2?$scope.earning.price_h_x2+'元':txt_x2;
            $scope.earning.price_h_x3=$scope.earning.price_h_x3?$scope.earning.price_h_x3+'元':txt_x3;
            $scope.earning.price_h_x4=$scope.earning.price_h_x4?$scope.earning.price_h_x4+'元':txt_x4;

            $scope.earning.price_s_x=$scope.earning.price_s_x?$scope.earning.price_s_x+'元':txt_x;
            $scope.earning.price_s_x2=$scope.earning.price_s_x2?$scope.earning.price_s_x2+'元':txt_x2;
            $scope.earning.price_s_x3=$scope.earning.price_s_x3?$scope.earning.price_s_x3+'元':txt_x3;
            $scope.earning.price_s_x4=$scope.earning.price_s_x4?$scope.earning.price_s_x4+'元':txt_x4;

            $scope.earning.price_k_x=$scope.earning.price_k_x?$scope.earning.price_k_x+'元':txt_x;
            $scope.earning.price_k_x2=$scope.earning.price_k_x2?$scope.earning.price_k_x2+'元':txt_x2;
            $scope.earning.price_k_x3=$scope.earning.price_k_x3?$scope.earning.price_k_x3+'元':txt_x3;
            $scope.earning.price_k_x4=$scope.earning.price_k_x4?$scope.earning.price_k_x4+'元':txt_x4;

            $scope.earning.price_b_x=$scope.earning.price_b_x?$scope.earning.price_b_x+'元':txt_x;
            $scope.earning.price_b_x2=$scope.earning.price_b_x2?$scope.earning.price_b_x2+'元':txt_x2;
            $scope.earning.price_b_x3=$scope.earning.price_b_x3?$scope.earning.price_b_x3+'元':txt_x3;
            $scope.earning.price_b_x4=$scope.earning.price_b_x4?$scope.earning.price_b_x4+'元':txt_x4;

            $scope.earning.price_o_x=$scope.earning.price_o_x?$scope.earning.price_o_x+'元':txt_x;
            $scope.earning.price_o_x2=$scope.earning.price_o_x2?$scope.earning.price_o_x2+'元':txt_x2;
            $scope.earning.price_o_x3=$scope.earning.price_o_x3?$scope.earning.price_o_x3+'元':txt_x3;
            $scope.earning.price_o_x4=$scope.earning.price_o_x4?$scope.earning.price_o_x4+'元':txt_x4;

            $scope.earning.price_u_x=$scope.earning.price_u_x?$scope.earning.price_u_x+'元':txt_x;
            $scope.earning.price_u_x2=$scope.earning.price_u_x2?$scope.earning.price_u_x2+'元':txt_x2;
            $scope.earning.price_u_x3=$scope.earning.price_u_x3?$scope.earning.price_u_x3+'元':txt_x3;
            $scope.earning.price_u_x4=$scope.earning.price_u_x4?$scope.earning.price_u_x4+'元':txt_x4;

            $scope.earning.price_d_x=$scope.earning.price_d_x?$scope.earning.price_d_x+'元':txt_x;
            $scope.earning.price_d_x2=$scope.earning.price_d_x2?$scope.earning.price_d_x2+'元':txt_x2;
            $scope.earning.price_d_x3=$scope.earning.price_d_x3?$scope.earning.price_d_x3+'元':txt_x3;
            $scope.earning.price_d_x4=$scope.earning.price_d_x4?$scope.earning.price_d_x4+'元':txt_x4;

        }

        $scope.init();
    });

    app.controller('selectProjectModalCtrl', function ($scope, $rootScope, $http, $uibModalInstance, $uibModal,projects) {
        $scope.projects=projects || [];
        $scope.item={};

        $scope.save = function (form, item) {
            form.$setSubmitted(true);
            if (!form.$valid) {
                return;
            }

            $uibModalInstance.close(item);
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    });
})()
