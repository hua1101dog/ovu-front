(function () {
	var app = angular.module("angularApp");
	app.controller('ResultCtl', function ($scope, $rootScope, $uibModal, $http, $filter, fac) {
		document.title = "巡查结果";
		$scope.pageModel = {};
		$scope.search = {};

		//查询视频配置列表
		$scope.find = function (pageNo) {
			if (!fac.hasActivePark($scope.search)) {
				return;
			}
			$.extend($scope.search, { currentPage: pageNo || $scope.pageModel.currentPage || 1, pageSize: $scope.pageModel.pageSize || 10 });
			fac.getPageResult("/ovu-pcos/pcos/quality/insresult/mergeList.do", $scope.search, function (data) {
				$scope.pageModel = data;
			});
		};

		app.modulePromiss.then(function () {
			fac.initPage($scope, function () {
				$scope.find();
			}, function () {
				$scope.find();
			});

		})

		//新增或者修改弹出框
		$scope.showEditModal = function (id) {
			var resultModal = $uibModal.open({
				animation: false,
				size: 'max',
				templateUrl: '/view/quality/result/modal.quality.result.html',
				controller: 'ResultModalCtrl',
				resolve: {
					id: id
				}
			});
			resultModal.result.then(function () {

			});
		}
	});
	//新增修改供应商弹出框控制器
	app.controller('ResultModalCtrl', function ($scope, $http, $uibModalInstance, $filter, fac, id) {
		$scope.insItemList = [];
		$scope.pointList = [];
		//巡查点列表
		$http.get("/ovu-pcos/pcos/quality/insresult/insPointList.do?id=" + id).success(function (data, status, headers, config) {
			if (fac.isNotEmpty(data)) {
				//显示的巡查点
				$scope.pointList = data.data;
				//点击第一个巡查点
				$scope.clickOnePoint($scope.pointList[0], 0);
			} else {
				alert();
			}
		})
		//显示图片
		$scope.showPhoto = function (src, imgList) {
			$("#sImg").attr('src', src);
			var src = event.srcElement.getAttribute("src") || src;
			if (src && src.indexOf("?imageView2") > -1) {
				src = src.substr(0, src.indexOf("?imageView2"));
			}
			$scope.curPic = { url: src, on: true };
			//下一张图片
			
			var j=imgList.length-1;
			var i=0;
			$scope.next = function () {
				
				if(i==imgList.length-1){
					alert('最后一张');
					j=imgList.length-1;
					return
				}
				i++;
				if(imgList.length>1){
					$scope.curPic={url:imgList[i],on:true}
				
				}else{
					alert('最后一张');
				}
			
			
			},
				$scope.before = function () {
					
					if(j==0){
						alert('第一张');
						i=0;
						return
					}
					j--;
					if(imgList.length>1){
						$scope.curPic={url:imgList[j],on:true}
					}else{
						alert('最后一张');
					}
				}

		},

			//点击单个巡查点
			$scope.clickOnePoint = function (ins, index) {
				//选中哪个
				$scope.selectedPoint = index;
				if (fac.isNotEmpty(ins.insResultId)) {
					$http.get("/ovu-pcos/pcos/quality/insresult/get.do?insResultId=" + ins.insResultId).success(function (data, status, headers, config) {
						if (fac.isNotEmpty(data)) {
							data.forEach(function (n) {
								if (fac.isNotEmpty(n.feedback)) {
									n.isOk = true;
								}
							})
							//显示右边的巡查项
							$scope.insItemList = data;
							//点击第一个巡查项
							$scope.clickOneIns($scope.insItemList[0], 0);
						} else {
							alert();
						}
					})
				}
			};
		//点击单个巡查项进行评价
		$scope.clickOneIns = function (ins, index) {
			//选中哪个
			$scope.selectedListItem = index;
			if (fac.isNotEmpty(ins.itemImgPath)) {
				if (angular.isString(ins.itemImgPath)) {
					ins.itemImgPath = ins.itemImgPath.split(',');

				}
			} else {
				ins.itemImgPath = [];
			}
			$scope.ins = ins;
		};
		//保存评价
		$scope.save = function (form) {
			form.$setSubmitted(true);
			if (!form.$valid) {
				return;
			}
			var param = angular.copy($scope.ins);
			param.insPointId = $scope.insPointId;
			delete param.imgPath;
			delete param.checkType;
			$http.post("/ovu-pcos/pcos/quality/insresult/edit.do", param, fac.postConfig).success(function (data) {
				if (data.success) {
					msg("保存成功!");
					$scope.ins.isOk = true;
				} else {
					alert("操作失败!");
				}

			});

		}
		$scope.cancel = function () {
			$uibModalInstance.dismiss('cancel');
		};
	});
})()
