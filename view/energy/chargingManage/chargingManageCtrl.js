/**
 * Created by HY on 2018/10/23.
 */
(function(angular) {
    "use strict";
    var app = angular.module("angularApp");
    app.controller('chargingManageCtrl', function($scope, $rootScope, $uibModal, $state, $http, $filter, fac) {
        document.title='计费管理';
        $scope.search = {

        };
        $scope.fn=function () {
            selectClassify();
            $scope.find();
        }
        $scope.pageModel = {};
        app.modulePromiss.then(function() {
        	$scope.$watch('dept.id', function (deptId, oldValue) {
                if (deptId) {
                    if ($scope.dept.parkId) {
                        $scope.search.parkId = $scope.dept.parkId;
                        $scope.search.PARK_NAME = $scope.dept.parkName;
                    } else {
                        alert('请选择跟项目关联的部门');
                        $scope.search.parkId &&  delete $scope.search.parkId
                        $scope.search.PARK_NAME &&  delete $scope.search.PARK_NAME;
                    }

                }
				$scope.fn();
            })
        	
            /*$scope.search = { isGroup: fac.isGroupVersion() };
            if ($scope.search.isGroup) {
                $scope.find();
            } else {
                $scope.$watch('park', function(newValue, oldValue) {
                    if (newValue && newValue.id) {
                        $scope.search.parkId = newValue.id;
                        $scope.search.PARK_NAME = newValue.parkName;
                        $scope.fn();
                    } else {
                        alert("请先选定一个项目");
                    }
                })
            }*/
        })
        function selectClassify() {
            $http.get("/ovu-energy/energy/classify/list.do").success(function (data) {
                $scope.measureCategory=data.data;
            });
        }
        selectClassify();
       /* $scope.download = function(item) {
            window.location.href = '/ovu-energy/energy/read/download?importId=' + item.importId;
        };*/
        $scope.del = function(item) {
            confirm("是否删除？", function() {
                $http.post('/ovu-energy/energy/billingimport/delete', { importId: item.importId }, fac.postConfig).success(function(data) {
                    if (data.code==0) {
                        msg(data.msg);
                        $scope.find();
                    } else {
                        alert(data.msg);
                    }
                });
            })
        }
        $scope.find = function(pageNo) {
            if(!$scope.search.personName){
                delete $scope.search.personId;
            }
            if($scope.search.billTime){
            	$scope.search.billingTime = $scope.search.billTime.replace(/-/g,'');;
            }else{
            	$scope.search.billingTime = undefined;
            }
            $.extend($scope.search, { currentPage: pageNo || 1, pageSize: $scope.pageModel.pageSize || 10 });
            $scope.search.pageIndex = $scope.search.currentPage - 1;
            fac.getPageResult("/ovu-energy/energy/billingimport/list", $scope.search, function(data) {
                $scope.pageModel = data;
            });
        };
        $scope.outputTemplate = function(type) {
            var param = {
                type: type,
                parkId: $scope.search.parkId
            };
            $uibModal.open({
                animation: false,
                size: 'lg',
                templateUrl: '/view/energy/chargingManage/charge/modal.outputTemplate.html',
                controller: 'chargeOptTemplateModalCtrl',
                resolve: {
                    param: function() {
                        return param;
                    }
                }
            });
        };
        //导入，带选择子页面
        /*
        $scope.inputFile = function(type) {
            var modal = $uibModal.open({
                animation: false,
                size: 'md',
                templateUrl: '/view/energy/chargingManage/charge/modal.inputSelect.html',
                controller: 'inputModalCtrl',
                resolve: {
                    type: type
                }
            });
            modal.result.then(function() {
                $scope.find();
            });
        };*/
       //导入，直接导入
       $scope.inputFile = function(type) {
            uploadExcel({importTypeId:type}, function(resp) {
	            	if(resp && resp.data && resp.data.failNum>0){
	            		var modal = $uibModal.open({
	                    animation: false,
	                    size: 'lg',
	                    templateUrl: '/view/energy/chargingManage/charge/modal.inputCounts.html',
	                    controller: 'chargeIptCountsModalCtrl',
	                    resolve: {
	                        param: resp.data
	                    }
	                });
	                modal.result.then(function() {
	                	$scope.find();
	            	});
            	}else{
            		msg("导入成功");
            		$scope.find();
            	}
                
            });
        };
        //可能需要根据导入类型不同走不同分支，具体看后台实现
        function uploadExcel(params, fn) {
        	fac.upload({url:"/ovu-energy/energy/billingimport/import",params:params,
                accept:"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"},function(resp){
                if(resp.code == 0){
                    fn && fn(resp);
                }else{
                    alert(resp.error);
                }
            })
        }
       
        $scope.selectedPerson=function(item,search){
            search.personId=item.id;
         }
    });

    app.controller('chargeOptTemplateModalCtrl', function($scope, $http, $uibModal, $uibModalInstance, $filter, fac, param) {
        var read = '';
        $scope.item = {
            parkId: param.parkId,
            readWay: read,
            importType: param.type
        };
        $http.get("/ovu-energy/energy/classify/list.do").success(function (data) {
            $scope.measureCategory=data.data;
        });
        $scope.confirm = function() {
            $scope.item.readWay = read;
            if($scope.item.classifyId===undefined){
                alert("请选择计量分类");
                return;
            }
            if($scope.item.readWay==''){
                alert('请选择抄表方式');
                return;
            }
            if(!$scope.item.billTime){
            	 alert('请选择账单时间');
                return;
            }
            if(!$scope.item.startTime){
            	 alert('请选择开始时间');
                return;
            }
            if(!$scope.item.endTime){
            	 alert('请选择结束时间');
                return;
            }
            var time = $scope.item.billTime.replace(/-/g,'');
            window.location.href = '/ovu-energy/energy/billingimport/template?parkId=' 
	            + $scope.item.parkId + '&classifyId=' + $scope.item.classifyId + 
	            '&readWay=' + $scope.item.readWay + '&importTypeId=' + $scope.item.importType
	            +"&billTime="+time+"&startTime="+$scope.item.startTime+
	            "&endTime="+$scope.item.endTime;
            $uibModalInstance.close();

        }
        $scope.allCheck = false;
        $scope.handCheck = false;
        $scope.autoCheck = false;
        $scope.cancel = function() {
            $uibModalInstance.dismiss('cancel');
        };
        
        //抄表方式选择
        $scope.clickAll = function() {
            $scope.handCheck = $scope.allCheck;
            $scope.autoCheck = $scope.allCheck;
            $scope.handCheck && $scope.autoCheck ? $scope.readType = '1,2' : $scope.readType = '';
            read = $scope.readType;
        };
        $scope.clickSingle = function() {
            $scope.allCheck = $scope.handCheck && $scope.autoCheck;
            if ($scope.allCheck) {
                $scope.readType = '1,2';
            } else if ($scope.handCheck) {
                $scope.readType = '1';
            } else if ($scope.autoCheck) {
                $scope.readType = '2';
            } else {
                $scope.readType = '';
            }
            read = $scope.readType;
        };
        
        //账单时间选择
        //传参格式：2018-10
        $scope.$watch("item",function(newValue,oldValue){
        	if(newValue.billTime != oldValue.billTime){
        		$scope.dateChange();
        	}
        },true)
        
        $scope.dateChange = function(){
        	var date = $scope.item.billTime
        	var dat ;
        	if(!date){
        		return;
        	}
        	dat = date.split("-");
        	if(dat.length != 2){
        		return;
        	}
        	var new_year = dat[0];    //取当前的年份          
	        var new_month = dat[1];//取下一个月的第一天，方便计算（最后一天不固定）          
	        var new_date = new Date(new_year,new_month,1);
	        
            $scope.item.startTime = (new Date(new_year,new_month-1,1)).
            	toLocaleDateString().replace(/\//g,'-');       //取当年当月中的第一天
            	
            $scope.item.endTime = (new Date(new_date.getTime()-1000*60*60*24)).
            	toLocaleDateString().replace(/\//g,'-');//获取当月最后一天日
        }
    });
    
    app.controller('chargeIptCountsModalCtrl', function($scope, $rootScope, $http, $uibModal, $uibModalInstance, $filter, fac, param) {
        $scope.item = param;
        $scope.cancel = function() {
            $uibModalInstance.dismiss('cancel');
        };
        $scope.download = function() {
            window.location.href = '/ovu-energy/energy/read/downloadErrorData?fileName=' + param.fileName;
        }
    });
})(angular)
