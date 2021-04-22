/**
 * Created by Administrator on 2017/7/20.
 * modify by ghostsf.com 2018/3/20
 */
(function() {
    "use strict";
    var app = angular.module("angularApp");
    app.controller('instanceCtrl', function ($scope, $http,$uibModal,fac) {
        $scope.search = {};
        $scope.pageModel = {};

        $scope.find = function(pageNo){
            $.extend($scope.search,{currentPage:pageNo||$scope.pageModel.currentPage||1,pageSize:$scope.pageModel.pageSize||10});
            $scope.search.pageIndex = $scope.search.currentPage-1;
            fac.getPageResult("/ovu-base/system/instance/list.do",$scope.search,function(data){
                $scope.pageModel = data;
                $scope.pageModel.data && $scope.pageModel.data.forEach(function(item){
                	item.createTime = formatDateTime(item.createTime);
                	item.updateTime = formatDateTime(item.updateTime);
                })
            });
        };
        $scope.find(1);

        //添加与保存实例
        $scope.showEditModal = function(domain){
            var copy = angular.extend({},domain);
            var modal = $uibModal.open({
                animation: false,
                size:'lg',
                templateUrl: 'instance/modal.instance.html',
                controller: 'modalInstanceCtrl'
                ,resolve: {item: function(){return copy;}}
            });
            modal.result.then(function () {
                $scope.find();
            }, function () {
                console.info('Modal dismissed');
            });
        }

        //批量删除
        $scope.delAll = function() {
            var ids = $scope.pageModel.list.reduce(function(ret, n) {
                n.checked && ret.push(n.id);
                return ret
            }, []);
            if (ids.length == 0) {
                alert("请选择要删除的实例！");
                return;
            }
            doDel(ids.join());
        };

        $scope.del = function(item){
            doDel(item.id);
        }

		function formatDateTime(inputTime) {  
		    var date = new Date(inputTime);
		    var y = date.getFullYear();  
		    var m = date.getMonth() + 1;  
		    m = m < 10 ? ('0' + m) : m;  
		    var d = date.getDate();  
		    d = d < 10 ? ('0' + d) : d;  
		    var h = date.getHours();
		    h = h < 10 ? ('0' + h) : h;
		    var minute = date.getMinutes();
		    var second = date.getSeconds();
		    minute = minute < 10 ? ('0' + minute) : minute;  
		    second = second < 10 ? ('0' + second) : second; 
		    return y + '-' + m + '-' + d+' '+h+':'+minute+':'+second;  
		};


        function doDel(id) {
            confirm("确认删除所选实例？",function(){
                $http.get("/ovu-base/system/instance/del/"+id).success(function(resp){
                    if(resp.code === 0){
                        msg('删除成功');
                        $scope.find();
                    }else{
                        alert(resp.msg);
                    }
                })
            });
        }

    });

    app.controller('modalInstanceCtrl', function($scope,$http,$uibModal,$uibModalInstance,fac,item) {
        $scope.item = item;
        $scope.parks=[];
        
        $scope.dataTypes = [];

        //获取数据类型
        $http.get("/ovu-base/system/dictionary/get?item=PUBLISH_PTYPE").success(function(resp){
        	if(resp.code == 0){
        		$scope.dataTypes = resp.data;
        		if($scope.dataTypes){
        			$scope.dataTypes.forEach(function(item){
        				item.checked = false;
        			})
        			//获取实例项目
			        if(item && item.id){
			            $http.get("/ovu-base/system/instance/getInstanceRels.do?id="+item.id).success(function(resp){
			                if(resp.code==0){
			                    $scope.parks = resp.data.parKlist;
			                    $scope.dataTypes && $scope.dataTypes.forEach(function(item){
			                    	resp.data.typeList && resp.data.typeList.forEach(function(item1){
			                    		if(item.id == item1.typeId){
			                    			item.checked = true;
			                    		}
			                    	})
			                    })
			                }
			            })
			        }
        		}
        	}
        })
        
        //选择数据类型
        $scope.checkOne = function(item){
        	item.checked = !item.checked;
        }

        //选择项目
        $scope.choosePark=function(){
            var modal = $uibModal.open({
                animation: false,
                size:'lg',
                templateUrl: '/common/modal.select.parks.html',
                controller: 'parksSelectorCtrl'
                ,resolve: {data: function(){return {};}}
            });
            modal.result.then(function (data) {
                if($scope.parks && $scope.parks.length>0){
                    data.forEach(function(part){
                        $scope.parks.forEach(function(item){
                            if(part.id==item.parkId){
                                part.isExist=true;
                            }
                        });
                    });
                }

                data.forEach(function(part){
                    if(!part.isExist){
                        $scope.parks.push({parkId:part.id,parkName:part.parkName,fullPath:part.fullPath});
                    }
                });
            });
        };
        //删除项目
        $scope.delpark=function(parks,p){
            parks.splice(parks.indexOf(p),1);
        };

        //保存
        $scope.save = function(form,instance){
            form.$setSubmitted(true);
            if(!form.$valid){
                return;
            }
            instance.typeIds = "";
            $scope.dataTypes && $scope.dataTypes.forEach(function(item,index,list){
            	if(item.checked){
            		instance.typeIds += item.id+",";
            	}
            })
            if(!instance.typeIds){
            	alert("请选择数据类型！");
            	return;
            }
            instance.typeIds = instance.typeIds.substring(0,instance.typeIds.length-1);
            instance.parkIds = "";
            $scope.parks && $scope.parks.forEach(function(n,index,list){
                if(n.parkId){
                    instance.parkIds += n.parkId+(index==list.length-1?"":",");
                }
            });
            if(!instance.parkIds){
            	alert("请选择项目");
            	return;
            }
            delete instance.createTime;
            delete instance.updateTime;
            $http.post("/ovu-base/system/instance/save.do",instance,fac.postConfig).success(function(resp, status, headers, config) {
                if(resp.code==0){
                    $uibModalInstance.close();
                    msg('保存成功!');
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
