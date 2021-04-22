/**
 * Created by Administrator on 2017/7/20.
 */
(function() {
    "use strict";
    var app = angular.module("angularApp");
    app.controller('uploadCtl', function ($scope,$rootScope, $http,$filter,$uibModal,fac) {
        document.title ="OVU-数据导入";

        app.modulePromiss.then(function(){
            $scope.isGroup = fac.isGroupVersion();
            $scope.$watch('dept.id', function (deptId, oldValue) {
                if (deptId) {

                    if($scope.dept.parkId){
                        $scope.topPark={id:$scope.dept.parkId,parkName:$scope.dept.parkName};
                    }else{
                        $scope.topPark={};
                    }
                }
            })
        });

        function validatePark(){
            if (!$rootScope.dept || !$rootScope.dept.id) {
                alert("请选择部门！");
                return false;
            }
            if(!$scope.topPark || !$scope.topPark.id){
                alert("请选择项目部门！");
                return false;
            }
            return true;
        }

        function validateDept(){
            if (!$rootScope.dept || !$rootScope.dept.id) {
                alert("请选择部门！");
                return false;
            }
            return true;
        }

        //上传空间数据
        $scope.uploadSpace = function(){
            if(!validatePark()){
                return;
            }
            fac.upload({url:"/ovu-base/uploadExcel.do",params:{type:"park",parkId:$scope.topPark.id},
                accept:"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"},function(resp){
                 if(resp.code==0){
                    $scope.parkMsg = "导入成功！";
                    msg("导入成功！");
                    if(resp.linkMap){
                        $http.post("/ovu-pcos/wab/ilidao/updateEmsId",{map:resp.linkMap}).success(function(ret){
                            if(ret.CODE == 0){
                              console.log('爱丽岛Id同步成功！')
                              console.log(resp.linkMap)

                            }
                        })

                    }
                    if(resp.linkList){
                        $http.post(`/ovu-base/system/parkHouse/syncHouse`,{linkList:resp.linkList}).success(function(res){

                            if(res.code == 0){
                                console.log('房屋数据同步成功！')
                                console.log(resp.linkList)

                              }
                        })

                }

                    $scope.$apply();

                    if(resp.fail>0){
                        confirm("当前有 " + resp.fail + " 条数据导入错误,是否下载错误信息?", function () {
                            var elemIF = document.createElement("iframe");
                            elemIF.src = "/ovu-base/getErrorExcel?excelName="+resp.excelName;
                            elemIF.style.display = "none";
                            document.body.appendChild(elemIF);

                        })
                    }
                 }else{
                     msg(resp.error)
                 }
            })
        }

        //上传工作标准
        $scope.uploadStandard =function(){
            var param={type:"workstandard"};
            uploadExcel(param,function(resp){
                if(resp.passCode==0){
                    rtmsg();
                }else{
                    uploadAgain('工作事项序号',param,function(){
                        rtmsg();
                    });
                }
            });

            function rtmsg(){
                $scope.workstandardMsg = "导入成功！";
                msg("导入成功！");
                $scope.$apply();
            }
        }

        //上传工作任务
        $scope.uploadTask =function(){
            if (!validateDept()){
                return;
            }

            var param={type:"worktask",deptId:$rootScope.dept.id};
            uploadExcel(param,function(resp){
                if(resp.passCode==0){
                    rtmsg();
                }else{
                    uploadAgain('工作任务编码',param,function(){
                        rtmsg();
                    });
                }
            });

            function rtmsg(){
                $scope.worktaskMsg = "导入成功！";
                msg("导入成功！");
                $scope.$apply();
            }
        }

        //上传设备信息
        $scope.uploadEquipInfo =function(){
            if(!validatePark()){
                return;
            }

            var param={type:"equipInfo",parkId:$scope.topPark.id};
            uploadExcel(param,function(resp){
                if(resp.passCode==0){
                    rtmsg();
                }else{
                    uploadAgain('设备编码',param,function(){
                        rtmsg();
                    });
                }
            });

            function rtmsg(){
                $scope.equipInfoMsg = "导入成功！";
                msg("导入成功！");
                $scope.$apply();
            }
        }

        function uploadExcel(params,fn){
            fac.upload({url:"/ovu-pcos/upload/uploadExcel.do",params:params,
                accept:"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"},function(resp){
                if(resp.success){
                    fn && fn(resp);
                }else{
                    alert(resp.error);
                }
            })
        }

        function uploadAgain(name,params,fn){
            confirm(name+"在系统中已存在，是否继续导入？", function () {
                $http.post("/ovu-pcos/upload/uploadAgain.do", params, fac.postConfig).success(function (resp) {
                    if(resp.success){
                        fn && fn(resp);
                    }else{
                        alert(resp.error);
                    }
                })
            })
        }

        //导出工作标准
        $scope.downloadWorktype = function(){
            var elemIF = document.createElement("iframe");
            elemIF.src = "/ovu-pcos/upload/downloadWorktype.do";
            elemIF.style.display = "none";
            document.body.appendChild(elemIF);
        }

        //导出空间数据
        $scope.getParkSpaceTmpl = function(){
            var url="/ovu-base/getParkSpaceTmpl.do";
            getTmpl(url);
        }

        //下载工作任务模板
        $scope.getTaskTmpl = function(){
            var url="/ovu-pcos/upload/getTaskTmpl.do";
            getTmpl(url);
        }
        //下载设备信息模板
        $scope.getEquipInfoTmpl = function(){
            var url="/ovu-pcos/upload/getEquipmentInfoTmpl.do";
            getTmpl(url);
        }

        //下载空间模板
        $scope.downSpaceTmpl = function(){
            var url="/ovu-base/downBlankTmpl.do";
            getBlankTmpl(url,'space');
        }
        //下载工作标准模板
        $scope.downWorkstandardTmpl = function(){
            var url="/ovu-pcos/upload/downBlankTmpl.do";
            getBlankTmpl(url,'workstandard');
        }
        //下载工作任务模板
        $scope.downWorktaskTmpl = function(){
            var url="/ovu-pcos/upload/downBlankTmpl.do";
            getBlankTmpl(url,'worktask');
        }
        //下载设备信息模板
        $scope.downEquipInfoTmpl = function(){
            var url="/ovu-pcos/upload/downBlankTmpl.do";
            getBlankTmpl(url,'equipInfo');
        }

        function getBlankTmpl(url,type){
            var elemIF = document.createElement("iframe");
            elemIF.src = url+"?type="+type;
            elemIF.style.display = "none";
            document.body.appendChild(elemIF);
        }


        function getTmpl(url){
            if(!validatePark()){
                return;
            }
            var elemIF = document.createElement("iframe");
            elemIF.src = url+"?parkId="+$scope.topPark.id+"&deptId="+$rootScope.dept.id;
            elemIF.style.display = "none";
            document.body.appendChild(elemIF);
        }

    });

})();
