(function () {
    var app = angular.module("angularApp");
    app.directive('wdatePicker', function () {
        return {
            restrict: "A",
            require: '?ngModel',
             scope: {},
            link: function (scope, element, attrs, ngModel) {
                if (!ngModel) return;
                element.bind('click', function () {
                    window.WdatePicker({
                        dateFmt : "HH:mm",
                        onpicked: function () { element.change() },
                        oncleared: function () { element.change() }
                    })
                });
                element.on("blur",function () {
                    var val = this.value;
                    scope.$apply(function () {
                        ngModel.$setViewValue(val);
                    });
                })
   
            }
        }
    });
	app.controller('ruleCtl', function ($scope, $rootScope, $uibModal, $http, $filter, fac) {
		document.title = "视频巡查截图规则设置";
		$scope.pageModel = {};
		$scope.search = {};
        $scope.search.insType=2 //视频巡查
		
		$scope.find = function (pageNo) {
			
			$.extend($scope.search, { currentPage: pageNo || $scope.pageModel.currentPage || 1, pageSize: $scope.pageModel.pageSize || 10 });
			fac.getPageResult("/ovu-pcos/pcos/inspection/inspoint/page.do", $scope.search, function (data) {
				$scope.pageModel = data;
			});
		};

		app.modulePromiss.then(function () {
			// fac.initPage($scope, function () {
			// 	$scope.find();
			// }, function () {
			// 	$scope.find();
            // });
            function getPostion() {
                var position = []

                function getNode(nodes) {
                    nodes && nodes.forEach(function (n) {
                        if (n.id == $scope.dept.parkId) {
                            position = n
                        } else {
                            if (n.nodes && n.nodes.length) {
                                getNode(n.nodes)
                            }
                        }
                    })
                }
                getNode($rootScope.parkTree)
                return position
            }
            $scope.$watch('dept.id', function (deptId, oldValue) {
                // if(!$scope.node.parkId){
                //     alert('请选择叶子节点');
                //      return
                // }
                if(deptId){
                    $scope.park = getPostion();
                      $scope.search.deptId=deptId            
                      $scope.find();
                }
               
            })

		})

		//设置截图规则
		$scope.showEditModal = function (item) {
            var copy = angular.extend({}, item);
            copy = angular.extend(copy, {
                deptId: $scope.search.deptId,

            });
			var resultModal = $uibModal.open({
				animation: false,
				size: 'md',
				templateUrl: '/view/inspection/rule/modal.inspection.rule.html',
				controller: 'ruleModalCtrl',
				resolve: {
					data: copy
				}
			});
			resultModal.result.then(function () {

			});
        }
           //查询位置
           $scope.showLocation = function (item) {
            
            var modal = $uibModal.open({
                animation: false,
                size: 'lg',
                templateUrl: '/view/quality/point/modal.point.getLocation.html',
                controller: 'GetLocationController',
                resolve: {
                    param: {
                        latitude: item.latitude,
                        longitude: item.longitude,
                        park:$scope.park
                    }
                }
            });
            modal.result.then(function () {
                $scope.find();
            });
        }
          //删除截图规则
          $scope.del = function (id) {
            confirm("确认删除该规则?", function () {
                $http.post("/ovu-pcos/pcos/inspection/inscapturerule/delete", {
                    "insPointId": id
                },fac.postConfig).success(function (resp) {
                    if (resp.code == 0) {
                        msg(resp.msg);
                        $scope.find();
                       
                    } else {
                        alert(resp.msg);
                    }
                })
            });
        }
	});
	//设置截图规则
	app.controller('ruleModalCtrl', function ($scope, $http, $uibModalInstance, $filter, fac, data) {
             //获取截图规则
             $scope.item={};
             $scope.item.timeList=[];
            
        if (fac.isNotEmpty(data.insPointId)) {
            $http.get("/ovu-pcos/pcos/inspection/inscapturerule/get.do?insPointId=" + data.insPointId).success(function (resp) {
                if (resp.code==0) {
                    resp.data &&  ($scope.item=resp.data);
                    var list= ($scope.item.captureTime && $scope.item.captureTime.split(',')) || [];
                    $scope.item.timeList=[];
                    list.forEach(function(v){
                        $scope.item.timeList.push({time:v})
                    })

                } 
            })
        }
		$scope.addTime=function(){
            $scope.item.timeList.push({
                time: ''
            });
        }
        $scope.delTime=function(i){
            $scope.item.timeList.splice($scope.item.timeList.indexOf(i), 1);
        }
		
		
		//保存
		$scope.save = function (form,item) {
			form.$setSubmitted(true);
			if (!form.$valid) {
				return;
            }
         var arr=[];
         var captureTime=''
         item.timeList.forEach(function(v){
            arr.push(v.time);
         });
         captureTime=arr.join(',')
         var parm={insPointId:data.insPointId,captureNum:item.captureNum,captureTime:captureTime,deptId:data.deptId}
			$http.post("/ovu-pcos/pcos/inspection/inscapturerule/edit", parm,fac.postConfig).success(function (resp) {
				if (resp.code==0) {
                    $uibModalInstance.close();
					msg(resp.msg);
				
				} else {
					alert(resp.msg);
				}

			});

		}
		$scope.cancel = function () {
			$uibModalInstance.dismiss('cancel');
		};
	});
})()
