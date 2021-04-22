(function () {
	var app = angular.module("angularApp");
	app.controller('PointCtrl', function ($scope, $rootScope, $uibModal, $http, $filter, fac) {
		document.title = "巡查点管理";
		$scope.pageModel = {};
		$scope.search = {};

		//查询巡查点列表
		$scope.find = function (pageNo) {

			if (!fac.hasActivePark($scope.search)) {
				return;
			}
			$.extend($scope.search, { currentPage: pageNo || $scope.pageModel.currentPage || 1, pageSize: $scope.pageModel.pageSize || 10 });
			fac.getPageResult("/ovu-pcos/pcos/quality/inspoint/list.do", $scope.search, function (data) {
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
		//删除
		$scope.del = function (id) {
			confirm("确认删除该巡查点?", function () {
				$http.post("/ovu-pcos/pcos/quality/inspoint/delete.do", { "insPointId": id }, fac.postConfig).success(function (resp) {
					if (resp.success) {
						$scope.find();
					} else {
						alert(resp.msg);
					}
				})
			});
		}

		//新增或者修改弹出框
		$scope.showEditModal = function (id) {
			if (!fac.hasOnlyPark($scope.search)) {
				return;
			}
			var modal = $uibModal.open({
				animation: false,
				templateUrl: '/view/quality/point/modal.quality.point.html',
				controller: 'PointAddOrEditModalCtrl',
				size: 'lg',
				resolve: {
					param: {
						id: id,
						parkId: $scope.search.parkId
					}

				}
			});
			modal.result.then(function () {
				$scope.find();
			});
		}
		//显示视频
		$scope.showCameraModal = function (id) {
			if (fac.isEmpty(id)) {
				msg('该巡查点未绑定视频');
				return;
			}
			fac.showVideo(id);
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
						longitude: item.longitude
					}
				}
			});
			modal.result.then(function () {
				$scope.find();
			});
		}

		//设置巡查项
		$scope.setType = function (id) {
			if (!fac.hasOnlyPark($scope.search)) {
				return;
			}
			var param = { parkId: $scope.search.parkId, id: id };
			var modal = $uibModal.open({
				animation: false,
				size: 'lg',
				templateUrl: '/view/quality/point/modal.quality.setInspectItems.html',
				controller: 'setInspectItemsCtrl',
				resolve: {
					param: param
				}
			});
			modal.result.then(function () {
				$scope.find();
			});
		}

	});
	//新增修改巡查点弹出框控制器
	app.controller('PointAddOrEditModalCtrl', function ($scope, $http, $uibModalInstance, $uibModal, $timeout, fac, param) {
		var geocoder;
		$scope.item = { parkId: param.parkId };
		var houseTreePromiss = fac.getHouseTree($scope, param.parkId);
		//判断app.park 中有无坐标
		var mapCenter;
		if (app.park && app.park.blPosition) {
			mapCenter = app.park.blPosition.split(",");
		} else {
			// 默认定位到武汉创意天地
			mapCenter = [114.32233, 30.471139];

		}
		$scope.mapOptions = {
			toolbar: false,
			// map-self config,
			center: new AMap.LngLat(mapCenter[0], mapCenter[1]),
			resizeEnable: true,
			// ui map config
			uiMapCache: false,
			zoom: 18,
			expandZoomRange: true
		};
		//查询位置
		$scope.searchPoint = function () {
			//加载查询组件
			if (fac.isEmpty(geocoder)) {
				AMap && AMap.service('AMap.Geocoder', function () {//回调函数
					//实例化Geocoder
					geocoder = new AMap.Geocoder({
					});
				})
			}
			geocoder && geocoder.getLocation($scope.item.searchLocation, function (status, result) {
				if (status === 'complete' && result.info === 'OK') {
					addMarker(result.geocodes[0].location);
				} else {
					alert("获取位置失败");
				}
			});
		}
		//点击地图
		$scope.clickMap = function ($event, $params) {
			addMarker($params[0].lnglat);
		}
		//添加标记
		function addMarker(lnglat) {
			$scope.myMap.setCenter(lnglat);
			$scope.myMap.clearMap();
			$scope.markers = [];
			$scope.markers.push(new AMap.Marker({
				map: $scope.myMap,
				position: lnglat
			}));
			//经度
			$scope.item.longitude = lnglat.lng;
			//纬度
			$scope.item.latitude = lnglat.lat;
		}
		if (fac.isNotEmpty(param.id)) {
			$http.get("/ovu-pcos/pcos/quality/inspoint/getBasicInfo.do?insPointId=" + param.id).success(function (data, status, headers, config) {
				if (fac.isNotEmpty(data)) {
					$scope.item = data;
					$timeout(function () {
						data.longitude && addMarker(new AMap.LngLat(data.longitude, data.latitude));
					}, 500)
					houseTreePromiss.then(function () {
						if ($scope.item.stageId) {
							$scope.item.stageId = $scope.houseTree.find(function (n) {
								return n.id == $scope.item.stageId
							});
							if ($scope.item.stageId && $scope.item.floorId) {
								var param = {
									stageId: $scope.item.stageId.id
								}
								$http.get("/ovu-base/system/parkBuild/getBuilds.do", { params: param }).success(function (res) {
									$scope.buildList = res;
									$scope.item.floorId = $scope.buildList.find(function (n) { return n.id == $scope.item.floorId })
								});
								if ($scope.item) {
									$scope.geneUnit($scope.item);
									$scope.geneGround($scope.item);
									$scope.getHouseList($scope.item);
								}
							}
						}
					});
				} else {
					alert();
				}
			})
		}
		// 获取分期

		$http.post("/ovu-base/system/parkStage/tree.do", {

			parkId: param.parkId,
			level: "2",
		}, fac.postConfig).success(function (res) {
			$scope.treeData = res;

		});
		//获取楼栋
		$scope.geneBuild = function (task) {
			if (!task || !task.stageId) {
				$scope.buildList = [];
				return;
			}
			var param = {
				stageId: task.stageId.id || task.stageId
			}
			$http.get("/ovu-base/system/parkBuild/getBuilds.do", { params: param }).success(function (res) {

				$scope.buildList = res;

			});
		}
		//获取单元
		$scope.geneUnit = function (task) {

			if (!task || !task.floorId) {
				$scope.unitList = [];
				return;
			}
			var param = {
				pageSize: 1000,
				pageIndex: 0,
				buildId: task.floorId.id || task.floorId
			};
			$http.get("/ovu-base/system/parkHouse/listUnitNo_mute.do", { params: param }).success(function (resp) {
				$scope.unitList = resp.data;

			})
		}
		//获取楼栋
		$scope.geneGround = function (task) {
			if (!task || !task.floorId || !task.unitNo) {
				$scope.groundList = [];
				return;
			}
			var param = {
				pageSize: 1000,
				pageIndex: 0,
				buildId: task.floorId.id || task.floorId,
				unitNo: task.unitNo
			};
			$http.get("/ovu-base/system/parkHouse/listGroundNo_mute.do", { params: param }).success(function (resp) {
				$scope.groundList = resp.data;

			})
		}
		$scope.getHouseList = function (task) {
			$scope.houseList = [];
			if (task.groundNo) {
				$http.post("/ovu-base/system/parkHouse/getHouses.do",
					{
						buildId: task.floorId.id || task.floorId,
						unitNo: task.unitNo,
						groundNo: task.groundNo,
					}, fac.postConfig).success(function (list) {
						$scope.houseList = list.data;

					})
			}

		}
		$scope.save = function (form, item) {
			form.$setSubmitted(true);
			if (!form.$valid) {
				return;
			}
			var param = angular.copy(item);

			if (param.type == 1) {
				param.stageId = item.stageId.id || item.stageId;
				param.floorId = item.floorId.id || item.floorId;
			} else {
				param.stageId = '';
				param.floorId = '';
				param.unitNo = '';
				param.groundNo = '';
				param.houseId = '';
			}
			delete param.STAGE;
			delete param.FLOOR;
			delete param.createTime;
			delete param.creatorId;
			delete param.stage_id;
			delete param.floor_id;
			delete param.unit_no;
			delete param.ground_no;
			delete param.house_id;


			$http.post("/ovu-pcos/pcos/quality/inspoint/editBasicInfo.do", param, { headers: { "Content-Type": "form" } }).success(function (data, status, headers, config) {
				if (data.success) {
					$uibModalInstance.close();
					msg("保存成功!");
				} else {
					alert();
				}
			})
		}
		$scope.cancel = function () {
			$uibModalInstance.dismiss('cancel');
		};

		$scope.chooseSensor = function () {
			var modal = $uibModal.open({
				animation: false,
				size: 'lg',
				templateUrl: '/view/equipment/selector.equipment.html',
				controller: 'equipmentSelectorCtrl',
				resolve: {
					data: function () {
						return {
							parkId: $scope.item.parkId
						}
					}
				}
			});
			modal.result.then(function (data) {
				$scope.item.equipmentId = data.id;
				$scope.item.videoName = data.name;   //视频名称
			});
		}

	});
	//选择设备
	app.controller('ChooseSensorModalCtrl', function ($scope, $http, $uibModal, $uibModalInstance, $filter, fac) {
		$scope.search = {};
		$scope.pageModel = {};
		$scope.find = function (pageNo) {
			$.extend($scope.search, { currentPage: pageNo || $scope.pageModel.currentPage || 1, pageSize: $scope.pageModel.pageSize || 10 });
			$scope.search.pageIndex = $scope.search.currentPage - 1;
			fac.getPageResult("/ovu-pcos/pcos/quality/inspoint/getEmtList.do", $scope.search, function (data) {
				$scope.pageModel = data;
			});
		}

		$scope.save = function () {
			var sensor;
			angular.forEach($scope.pageModel.data, function (se) {
				if (se.checked) {
					sensor = se;
				}
			})
			if (!sensor) {
				alert('请选择设备')
			}
			$uibModalInstance.close({ sensor: sensor });
		}
		$scope.cancel = function () {
			$uibModalInstance.dismiss('cancel');
		};

		// $scope.find();

		//获取设备类型树
		$http.get("/ovu-pcos/pcos/equipment/getEmtTree.do").success(function (resp) {
			if (resp.success) {
				$scope.typeData = resp.data;
			}
		})
		//选择树节点
		$scope.selectNode = function (node) {
			if (fac.isEmpty(node.nodes)) {
				$scope.search.modelId = node.id;
				$scope.search.emtTypeName = node.text;
				$scope.search.modelHover = search.modelFocus = false;
			} else {
				alert("请选择产品型号！");
			}
		}
	});

	//设置巡查项弹出框控制器
	app.controller('setInspectItemsCtrl', function ($scope, $http, $uibModalInstance, $filter, $q, fac, param) {
		var id = param.id;
		var parkId = param.parkId;
		//树配置
		$scope.config = { edit: false, showCheckbox: true };
		//巡查标准list
		$scope.normList = [];
		//供应商
		$scope.supplierList = [];
		$scope.results = [];  //选中的巡查项
		var checkedIds = []; //选中的巡查类型的id
		//树数据
		$http.get("/ovu-pcos/pcos/quality/insitemtype/tree.do?parkId=" + parkId).success(function (data) {
			$scope.treeData = data || [];
			$scope.flatData = fac.treeToFlat(data);
		})
		//供应商数据
		$http.get("/ovu-pcos/pcos/quality/supplier/getAll.do?parkId=" + parkId).success(function (data) {
			$scope.supplierList = data || [];
		})
		//获取巡查项
		$http.get("/ovu-pcos/pcos/quality/inspoint/getInsItem.do?insPointId=" + id).success(function (data) {
			if (fac.isNotEmpty(data.selectedItemTypeIds)) {
				//已选择的巡查标准
				$scope.results = data.itemList;
				checkedIds = data.selectedItemTypeIds;
				var promise = getByInsItemTypeId(data.selectedItemTypeIds);
				promise.then(function () {
					//回选巡查标准
					$scope.normList.forEach(function (n) {
						if (data.selectedItemIds && data.selectedItemIds.indexOf(n.insItemId) != -1) {
							n.checked = true;
						}
					})
					//回选树
					$scope.flatData.forEach(function (node) {
						if (data.selectedItemTypeIds.indexOf(Number(node.id)) != -1) {
							node.state = node.state || {};
							node.state.checked = true;
							expandFather(node);
						}
					})

				})

			}
		})
		//展开父节点
		function expandFather(node) {
			var father = $scope.flatData.find(function (n) { return n.id == node.parentId });
			if (father) {
				father.state = father.state || {};
				father.state.expanded = true;
				expandFather(father);
			}
		}

		$scope.check = function (node) {
			node.state = node.state || {};
			node.state.checked = !node.state.checked;
			if (node.state.checked) {
				checkedIds.push(node.id)
			} else {
				$scope.checkAllTypeModel = false;
				var index = checkedIds.findIndex(function (n) {
					return n == node.id
				})
				checkedIds.splice(index, 1);
				var list = [];  //选中的数组
				$scope.results && $scope.results.forEach(function (v) {
					if (v.insItemTypeId == node.id) {
						list.push(v);
					}
				});
				//从已有的数组过滤掉选中的数组
				$scope.results = $scope.results.concat(list).filter(function(v){ 
					return $scope.results.indexOf(v)===-1 || list.indexOf(v)===-1
				  })
			}
			getByInsItemTypeId(checkedIds);
		};
		//巡查项选中
		$scope.normChecked = function (item) {
			item.checked = !item.checked;
			if (item.checked == true) {
				$scope.results.push(item);
			} else {
				$scope.checkAllNormModel = false
				var index = $scope.results && $scope.results.findIndex(function (n) {
					return item.insItemId == n.insItemId
				})
				$scope.results.splice(index, 1)
			}
		}
		//根据已选择巡查类型id获取巡查标准
		function getByInsItemTypeId(checkedIds) {
			var deferred = $q.defer();
			$http.post("/ovu-pcos/pcos/quality/insitem/getByInsItemTypeId.do", { "insItemTypeIds": checkedIds + '' }, fac.postConfig).success(function (data, status, headers, config) {
				if (fac.isNotEmpty(data)) {
					$scope.normList = data;
					$scope.normList.forEach(function (da) {
						$scope.results && $scope.results.forEach(function (v) {
							if (v.insItemId == da.insItemId) {
								da.checked = true;
							}
						})
					})
				} else {
					$scope.normList = [];
				}
				deferred.resolve(data);
			})
			return deferred.promise;
		}
		//勾选所有的巡查项类型
		$scope.checkAllType = function () {
			checkedIds = [];
			$scope.flatData.forEach(function (n) {
				n.state = n.state || {};
				n.state.checked = $scope.checkAllTypeModel;
				if ($scope.checkAllTypeModel) {

					checkedIds.push(n.id);

				} else {
					checkedIds = [];
					$scope.normList = [];
					$scope.results = [];
				}
			})
			getByInsItemTypeId(checkedIds);


		}
		//勾选所有的巡查项
		$scope.checkAllNorm = function () {
			$scope.results = [];
			$scope.normList.forEach(function (n) {
				n.checked = $scope.checkAllNormModel;
				var index = $scope.results && $scope.results.findIndex(function (v) {
					return n.insItemId == v.insItemId
				})
				if ((n.checked == true) && (index == -1)) {
					$scope.results.push(n);
				} else {
					$scope.results = [];
				}
			})
		}
		//删除已选的巡查项
		$scope.delResult = function (item) {
			var index = $scope.results && $scope.results.findIndex(function (v) {
				return item.insItemId == v.insItemId
			})
			$scope.results.splice(index, 1);
			$scope.normList && $scope.normList.forEach(function (v) {
				(item.insItemId == v.insItemId) && (v.checked = false)
			})
			// $scope.results.splice(index,1);
		}
		$scope.save = function (form) {
			var noSelectSupplier = $scope.results.find(function (n) {
				return !n.supplierId;
			})
			if (noSelectSupplier) {
				alert("请选择供应商");
				return;
			}
			var param = { insPointId: id, list: $scope.results };
			$http.post("/ovu-pcos/pcos/quality/inspoint/editInsItem.do", param).success(function (data, status, headers, config) {
				if (data.success) {
					$uibModalInstance.close();
					msg("保存成功!");
				} else {
					alert();
				}
			})
		};
		$scope.cancel = function () {
			$uibModalInstance.dismiss('cancel');
		};
	});
	//显示位置控制器
	app.controller('GetLocationController', function ($scope, $http, $uibModalInstance, $filter, $timeout, fac, param) {
		$scope.mapOptions = {
			toolbar: true,
			// map-self config
			// center: new AMap.LngLat(mapCenter[0], mapCenter[1]),
			resizeEnable: true,
			// ui map config
			uiMapCache: false,
			zoom: 17,
			expandZoomRange: true
		};
		$scope.markers = [];
		//添加标记
		function addMarker(lng, lat) {
			$scope.markers = [];
			var lnglat = new AMap.LngLat(lng, lat);
			$scope.myMap.setCenter(lnglat);
			$scope.myMap.clearMap();
			$scope.markers.push(new AMap.Marker({
				map: $scope.myMap,
				position: lnglat
			}));
		}
		$timeout(function () {
			param.longitude && addMarker(param.longitude, param.latitude);
		}, 500)
		$scope.cancel = function () {
			$uibModalInstance.dismiss('cancel');
		};

	});

})()
