(function(angular, document, win) {
    document.title = "报装申请";
    var app = angular.module('angularApp');
    app.component('reportReqApp', {
        templateUrl: '/view/decoration/reportrequest/reportRequestApp.html',
        controller: 'ReportReqCtrl',
        controllerAs: 'vm'
    });

    app.controller('ReportReqCtrl', ['$rootScope', '$scope', '$http', 'fac', 'decoration.reportReqModalHelper', 'decoration.commonService',
        function($rootScope, $scope, $http, fac, reqModalHelper, commonService) {
			document.title = "报装申请";
            var vm = this;
            vm.$onInit = function() {
                vm.parkId = '';
                vm.deptId = '';
                vm.pageModel = {};

                vm.findPark = $rootScope.findPark;

                // 全选
                // vm.checkAll = commonService.checkAll;
                vm.checkAll = function(pageModel) {
                    pageModel.checked = !pageModel.checked;
                    pageModel.data.forEach(function(n) {
                        n.auditState != '1' && (n.checked = pageModel.checked);
                    });
                };
                // 单选
                // vm.checkOne = commonService.checkOne;
                vm.checkOne = function(item, pageModel) {
                    if (item.auditState != '1') {
                        commonService.checkOne(item, pageModel);
                    } else {
                        return false;
                    }
                };
                // 是否有选择
                vm.hasChecked = commonService.hasChecked;

                vm.find = function() {
                    var search = angular.merge({}, vm.search, { currentPage: 1 });
                    reqModalHelper.find(search, vm);
                };

                // 会话验证 判断是否需要登录
                app.modulePromiss.then(function() {
                    /*vm.search = {};
                    if (app.park) {
                        vm.parkId = app.park.id;
                        vm.search.parkName = app.park.parkName;
                        // $rootScope.parkId = app.park.ID;
                    }
                    vm.search.isGroup = fac.isGroupVersion();
                    vm.search.parkId = vm.parkId;
                    vm.search.currentPage = 1;
                    vm.search.numPerPage = 10;
                    if (vm.search.isGroup) {
                        modalHelper.find(vm.search, vm);
                    } else {
                        $scope.$watch(function() {
                            return $rootScope.park;
                        }, function(newValue, oldValue) {
                            if (newValue && newValue.id) {
                                vm.parkId = newValue.id;
                                vm.search.parkId = newValue.id;
                                vm.search.parkName = newValue.parkName;
                                modalHelper.find(vm.search, vm);
                            } else {
                                alert("请先选定一个项目");
                            }
                        });
                    }*/
                    //集团版、项目版合并，监控部门变化
                    vm.search = {};
		        //    $rootScope.$watch('dept', function (deptOrig, oldValue) {
		        	$scope.$watch(function() {
                            return $rootScope.dept;
                        }, function(deptOrig, oldValue) {
                           
			            	if(!$scope.search){
			            		$scope.search = {};
			            	}
			            	var deptCopy = angular.copy(deptOrig);
			                if(deptCopy.id != $scope.search.deptId){
			                	$scope.search.deptId = deptCopy.id;
			                	vm.deptId = deptCopy.id;
			                	vm.parkId = deptCopy.parkId;
			                	$rootScope.parkId = deptCopy.parkId;
			                }
			                
		                	vm.search.deptId = $scope.search.deptId;
		                	vm.search.currentPage = 1;
		                	vm.search.numPerPage = vm.pageModel.numPerPage?vm.pageModel.numPerPage:10;
			               	if($scope.search.deptId){
			                	reqModalHelper.find(vm.search, vm);
			                }else{
			                //清空表格
			                	vm.parkId = undefined;
			                	vm.pageModel.totalCount = 0;
			                	vm.pageModel.totalPage1;
			                	vm.pageModel.data = [];
			                }
		            },true)
                });

            };

            // 选择每页（？）多少条数据
            vm.numSelect = function($event) {
            //    vm.search.parkId = vm.parkId;
                vm.search.deptId = vm.deptId;
                vm.search.currentPage = 1;
                vm.search.numPerPage = $event.nowSelected;
                reqModalHelper.find(vm.search, vm);
            };

            // 页码改变
            vm.pageChanged = function(e) {
                if (e.currentPage) {
                    vm.search.currentPage = e.currentPage;
                    vm.search.numPerPage = vm.pageModel.numPerPage;
                    reqModalHelper.find(vm.search, vm);
                }
            };

            vm.toAdd = function() {
                /*if (!vm.parkId) {
                    modalHelper.selectProj("请先选择项目");
                    return;
                }*/
                reqModalHelper.addEdit(null, vm);
            };
            vm.toEdit = function(item) {
                reqModalHelper.addEdit(item, vm);
            };
            vm.toDelete = function(item) {
                reqModalHelper.del([item.id], "确认删除这条报装申请吗?", vm);
            };
            vm.toDelAll = function() {
                var ids = vm.pageModel.data.reduce(function(ret, n) {
                    n.checked && n.auditState != '1' && ret.push(n.id);
                    return ret
                }, []);
                if (!ids.length) {
                    confirm('没有可以删除的报装申请');
                    return;
                }
                reqModalHelper.del(ids, "确认删除选中的项目吗?", vm);
            };

            vm.toWorkUnit = function(item, generateWorkUnit) {
                reqModalHelper.toWorkUnit(item, vm, generateWorkUnit);
            };

            vm.toApprove = function(item) {
                reqModalHelper.approve(item, vm);
            };
            // 显示报装证件
            vm.showReportCertif = function(item) {

                reqModalHelper.showReportCertif(item, vm);
                return;


                $http.post('/ovu-pcos/pcos/presFile/list.do', {
                    pageIndex: 0,
                    pageSize: 100
                }, fac.postConfig).then(function(res) {
                    var data = res.data.data;
                    if (!item.reportCertif || !item.certificate_id) {
                        msg('该报装请求没有报装证件');
                    } else {
                        var arr = item.reportCertif.split(',');
                        // var ids = [18, 19, 21, 23];
                        var ids = item.certificate_id.split(',');
                        arr = arr.map(function(url, index) {
                            var file = data.filter(function(v) {
                                return v.id === parseInt(ids[index]);
                            })[0];
                            if (file) {
                                return [file.fileName, url];
                            } else {
                                return ['该类文件已删除', '']
                            }
                        }).filter(function(v) {
                            return v[1];
                        });
                        if (!arr.length) {
                            msg('该报装请求没有报装证件');
                            return;
                        }
                        var str = arr.map(function(v) {
                            return '<div>' +
                                '<a class="row btn-link" style="display: block; width: 100%; margin-bottom: 10px" href="' +
                                v[1] + '"target="_blank">' +
                                '<span class="col-xs-5 text-right">' +
                                v[0] +
                                ': </span>' +
                                '<span class="col-xs-7"><input class="form-control" readOnly type="text" value=' + v[1] + '></span>' +
                                '</a>' +
                                '</div>';
                        }).join('');
                        // confirm(str, function() {}, true);
                        layer.confirm(str, { btn: [], title: false }, function(index) {
                            layer.close(index);
                        }, function() {});
                    }

                });

            };
        }
    ]);

    app.component('reportReqEditModal', {
        templateUrl: '/view/decoration/reportrequest/modal.reportRequestEdit.html',
        bindings: {
            close: '&',
            dismiss: '&',
            resolve: '<'
        },
        controller: ['$http', '$rootScope', 'fac', '$timeout', '$uibModal', function($http, $rootScope, fac, $timeout, $uibModal) {
            var $ctrl = this;
            $ctrl.$onInit = function() {
                // 引用rootScope的方法 上传文件
                $ctrl.addFile = $rootScope.addFile;
                $ctrl.addPhoto = $rootScope.addPhoto;
                $ctrl.clearPhoto = $rootScope.clearPhoto;
                $ctrl.showPhoto = $rootScope.showPhoto;
                $ctrl.processImgUrl = $rootScope.processImgUrl;
                $ctrl.delPhoto = $rootScope.delPhoto;
                $ctrl.addPhotos = $rootScope.addPhotos;

				// 深拷贝 防止模态框变化引起table同步变化
                $ctrl.item = angular.copy($ctrl.resolve.item);
                $ctrl.title = $ctrl.resolve.title;
                // var parkId = $rootScope.park.parkId;
                // 报装项目
                $http.get('/ovu-pcos/decoration/decorationApply/getItem.do', {
                    params: {
                        // park_id: parkId
                    }
                }).then(function(res) {
                    var data = res.data;
                    $ctrl.multiSelectData = afterGetItemMap(data);
                    
                });

                function afterGetItemMap(serverData) {
                    var data = serverData.map(function(v) {
                        return {
                            id: v.id,
                            itemName: v.projectName,
                            label: v.projectName
                        }
                    });
                    return data;
                }
                $ctrl.multiSelectModel = [];
                $ctrl.multiSelectData = [];
                $ctrl.multiSelectSettings = {
                    styleActive: true,
                };

                $ctrl.localSettings = {
                    checkAll: '全选',
                    uncheckAll: '全不选',
                    buttonDefaultText: '点击选择',
                    dynamicButtonTextSuffix: '项已选中',
                    selectionCount: '项已选中'
                };

                // multiselect 事件
                $ctrl.multiSelectEvents = {
                    onSelectionChanged: function() {
                        var selectedItems = [];
                        $ctrl.multiSelectData.forEach(function(v) {
                            $ctrl.multiSelectModel.some(function(selectedV) {
                                if (selectedV.id === v.id) {
                                    selectedItems.push(v);
                                    return true;
                                }
                            });
                        });
                        $ctrl.item.reportProject = selectedItems.reduce(function(acc, v) {
                            return acc === '' ? v.itemName : acc + ',' + v.itemName;
                        }, '');
                        $ctrl.item.reportProjectNames = selectedItems.reduce(function(acc, v) {
                            return acc === '' ? v.itemName : acc + ',' + v.itemName;
                        }, '');
                        $ctrl.item.reportProjectIds = selectedItems.reduce(function(acc, v) {
                            return acc === '' ? v.id : acc + ',' + v.id;
                        }, '');
                    },
                };

                // 请求 报装文件 
                $http.post('/ovu-pcos/pcos/presFile/list.do', {
                    pageIndex: 0,
                    pageSize: 100
                }, fac.postConfig).then(function(res) {
                    $ctrl.item.files = res.data.data;
                    if ($ctrl.item.certificate_id) {
                        var ids = $ctrl.item.certificate_id.split(','),
                            urls = $ctrl.item.certificate_url.split(',');
                        var files = $ctrl.item.files;
                        files.forEach(function(v) {
                            var index;
                            ids.some(function(innerV, innerI) {
                                if (innerV == v.id) {
                                    index = innerI;
                                    return true;
                                }
                            });
                            if(index != undefined && index>-1){
                            	//仅一个图片时的存储；
	                            v.fileUrl = urls[index];
	                            
	                            //多个图片时的存储
	                            v.fileUrls = urls[index].split(";");
                            }else{
                            	v.fileUrls = [];
                            }
                        });
                    }else{
                    	var files = $ctrl.item.files;
                    	files.forEach(function(v) {
                    		v.fileUrls = [];
                    	})
                    }

                });
            };

            //选择业主
            $ctrl.selectOwner = function() {
                var isHouse=true
                var modal = $uibModal.open({
                    animation: false,
                    size: 'max',
                    templateUrl: '../common/modal.select.owner.html',
                    controller: 'ownerSelectorCtrl',
                    resolve: {
                        data: function() {
                            return {
                                parkId: $rootScope.parkId,
                                isHouse:isHouse

                            };
                        }
                    }
                });
                modal.result.then(function(data) {
                    if (data) {
                        $ctrl.item.roomName = data.houseName[0];
                        $ctrl.item.roomNo = data.houseNo;
                        $ctrl.item.roomId = data.id;
                        $ctrl.item.ownerId = data.ownerIds;
                        $ctrl.item.ownerName = data.name;
                        $ctrl.item.ownerTel = data.phone;
                    }
                });
            };
            // 提交报装申请
            $ctrl.ok = function(form) {
                form.$setSubmitted(true);
                if (!form.$valid) {
                    return;
                }
                var flag = false;
                var flagName = "";
//              $ctrl.item = $ctrl.item
				// 2018/09/12 存储多张图片
				$ctrl.item.files.forEach(function(v){
					var urls = "";
					if(!v.fileUrls || v.fileUrls.length == 0){
						flag = true;
						flagName = v.fileName;
						return;
					}
					v.fileUrls.forEach(function(u){
						urls = urls + u + ";";
					});
					if(urls && urls.substring(urls.length-1,urls.length)===";"){
						urls = urls.substring(0,urls.length-1);
					}
					v.fileUrl = urls;
				})
				if(flag){
					alert("请上传 "+flagName+" 图片！");
					return;
				}
                $ctrl.close({
                    $value: $ctrl.item
                });
            };
            $ctrl.cancel = function() {
                $ctrl.dismiss({
                    $value: $ctrl.item
                });
            };

        }]
    });

    app.component('reportReqApproveModal', {
        templateUrl: '/view/decoration/reportrequest/modal.reportRequestApprove.html',
        bindings: {
            close: '&',
            dismiss: '&',
            resolve: '<'
        },
        controller: function($http, $rootScope, fac) {
            var $ctrl = this;
            $ctrl.$onInit = function() {
                // 深拷贝 防止模态框变化引起table同步变化
                $ctrl.item = angular.copy($ctrl.resolve.item);
                // console.log('item', $ctrl.item);
                $ctrl.item.resonRest = 300;

                $ctrl.showPhoto = $rootScope.showPhoto;
                $ctrl.processImgUrl = $rootScope.processImgUrl;
                //设置默认值，如果是没有审核过的数据，则默认选择审核未通过
                if($ctrl.item.auditState==3){
                	$ctrl.item.auditState=2;
                }
                
                // 请求 报装文件 
                $http.post('/ovu-pcos/pcos/presFile/list.do', {
                    pageIndex: 0,
                    pageSize: 100
                }, fac.postConfig).then(function(res) {
                    $ctrl.item.files = res.data.data;
                    if ($ctrl.item.certificate_id) {
                        var ids = $ctrl.item.certificate_id.split(','),
                            urls = $ctrl.item.certificate_url.split(',');
                        var files=$ctrl.item.files;
                        files.forEach(function(v) {
                            var index;
                            ids.some(function(innerV, innerI) {
                                if (innerV == v.id) {
                                    index = innerI;
                                    return true;
                                }
                            });
                            if(index != undefined && index>-1){
                            	v.fileUrl = urls[index];
                            
	                            //多个图片时的存储
	                            v.fileUrls = urls[index].split(";");
                            }else{
                            	v.fileUrls = [];
                            }
                        });
                    }

                });
            };
            $ctrl.resonTestChange = function() {
                var len = $ctrl.item.approveDesc.length;
                if (len < 300) {
                    $ctrl.item.resonRest = 300 - len;
                } else {
                    $ctrl.item.resonRest = 0;
                    $ctrl.item.approveDesc = $ctrl.item.approveDesc.substr(0, 300);
                }
            };
            $ctrl.ok = function(form) {
                form.$setSubmitted(true);
                if (!form.$valid) {
                    return;
                }
                $ctrl.close({
                    $value: $ctrl.item
                });
            };
            $ctrl.cancel = function() {
                $ctrl.dismiss({
                    $value: $ctrl.item
                });
            };
        }
    });

    //工单列表
    app.component('reportReqWorkUnitModal', {
        templateUrl: '/view/decoration/reportrequest/modal.reportRequestWorkUnit.html',
        bindings: {
            close: '&',
            dismiss: '&',
            resolve: '<'
        },
        controller: function($http, $rootScope, fac, $timeout) {
            var $ctrl = this;
            $ctrl.$onInit = function() {
                // 图片上传
                $ctrl.showPhoto = $rootScope.showPhoto;
                $ctrl.addPhotos = $rootScope.addPhotos;
                $ctrl.delPhoto = $rootScope.delPhoto;
                $ctrl.processImgUrl = $rootScope.processImgUrl;
                // unitStatusDict
                $ctrl.unitStatusDict = $rootScope.unitStatusDict;

                // 深拷贝 防止模态框变化引起table同步变化
                $ctrl.item = angular.copy($ctrl.resolve.item);
                $ctrl.item.photos = $ctrl.item.photos || [];
                $ctrl.parkId = angular.copy($ctrl.resolve.parkId);
                $ctrl.deptId = angular.copy($ctrl.resolve.deptId);
                $ctrl.showWorkUnitDetail = $rootScope.showWorkUnitDetail;
                $ctrl.pageModel = {};
                $ctrl.item.workUnitName = $ctrl.item.roomName + $ctrl.item.ownerName + '报装申请';
                // console.log('item:', $ctrl.item);
                find();
            };

            // 选择每页（？）多少条数据
            $ctrl.numSelect = function($event) {
                find(0, $event.nowSelected);
            };

            // 页码改变
            $ctrl.pageChanged = function(e) {

                if (e.currentPage) {
                    find(e.currentPage - 1, $ctrl.pageModel.pageSize);
                }
            };

            function find(pageIndex, pageSize) {
                if (!angular.isNumber(pageIndex)) {
                    pageIndex = $ctrl.pageModel.pageIndex || 0;
                }
                var data = {
                    park_id: $ctrl.parkId || $ctrl.item.park_id,
                    deptId: $ctrl.deptId || $ctrl.item.deptId,
                    // decoration_type: 2,
                    apply_id: $ctrl.item.id,
                    pageIndex: pageIndex,
                    pageSize: pageSize || $ctrl.pageModel.pageSize || 10
                };
                $http.post('/ovu-pcos/decoration/decorationApply/getOrderList.do', data, fac.postConfig).then(function(res) {
                    $ctrl.pageModel = res.data;
                    $ctrl.pageModel.currentPage = $ctrl.pageModel.pageIndex + 1;
                    $ctrl.pageModel.numPerPage = $ctrl.pageModel.pageSize;
                });
            }

            $ctrl.chooseWorkType = function() {
                modalWork.open({
                    callback: function(node) {
                        if (node.tid && node.text) {
                            $timeout(function() {
                                if (node.tid == "0") {
                                    delete $ctrl.item.WORKTYPE_NAME;
                                    delete $ctrl.item.worktype_ID;
                                } else {
                                    $ctrl.item.WORKTYPE_NAME = node.text;
                                    $ctrl.item.worktype_ID = node.tid;
                                }
                            })

                        }
                        modalWork.close();
                    },
                    selectedId: $ctrl.item.worktype_ID
                });
            };

            $ctrl.ok = function(form) {
                form.$setSubmitted(true);
                if (!form.$valid) {
                    return;
                }
                $ctrl.close({
                    $value: $ctrl.item
                });
            };
            $ctrl.cancel = function() {
                $ctrl.dismiss({
                    $value: $ctrl.item
                });
            };
        }
    });

    // 选择项目提醒
    app.component('selectProjConfirmModal', {
        templateUrl: '/view/decoration/reportrequest/modal.selectTip.html',
        bindings: {
            close: '&',
            dismiss: '&',
            resolve: '<'
        },
        controller: function($http, $rootScope) {
            var $ctrl = this;
            $ctrl.$onInit = function() {
                // 深拷贝 防止模态框变化引起table同步变化
                $ctrl.msg = angular.copy($ctrl.resolve.msg);
            };
            $ctrl.ok = function(form) {
                $ctrl.close({
                    $value: ''
                });
            };
            $ctrl.cancel = function() {
                $ctrl.dismiss({
                    $value: $ctrl.item
                });
            };
        }
    });

    // 报装证件
    app.component('reportCertifModal', {
        templateUrl: '/view/decoration/reportrequest/modal.reportCertif.html',
        bindings: {
            close: '&',
            dismiss: '&',
            resolve: '<'
        },
        controller: ['$http', '$rootScope', 'fac', function($http, $rootScope, fac) {
            var $ctrl = this;
            $ctrl.$onInit = function() {
                $ctrl.item = $ctrl.resolve.item;
                $ctrl.showPhoto = $rootScope.showPhoto;
                $ctrl.processImgUrl = $rootScope.processImgUrl;

                // 请求所有的报装文件
                $http.post('/ovu-pcos/pcos/presFile/list.do', {
                    pageIndex: 0,
                    pageSize: 100
                }, fac.postConfig).then(function(res) {
                    var data = res.data.data;
                    var item = $ctrl.item;
                    if (!item.reportCertif || !item.certificate_id) {
                        msg('该报装请求没有报装证件');
                    } else {
                        var arr = item.reportCertif.split(',');
                        // var ids = [18, 19, 21, 23];
                        var ids = item.certificate_id.split(',');
                        arr = arr.map(function(url, index) {
                            var file = data.filter(function(v) {
                                return v.id === parseInt(ids[index]);
                            })[0];
                            if (file) {
                                return [file.fileName, url];
                            } else {
                                return ['该类文件已删除', '']
                            }
                        }).filter(function(v) {
                            return v[1];
                        });
                        if (!arr.length) {
                            msg('该报装请求没有报装证件');
                            return;
                        }
                        // 默认显示第一张图片
                        arr[0].active = true;
                        
                        $ctrl.imgUrl = $ctrl.processImgUrl(arr[0][1]);
                        //展示多张图片 2018/09/12
                        var urls = arr[0][1].split(";");
                        $ctrl.imgUrls = []
                        urls.forEach(function(v){
                        	$ctrl.imgUrls.push($ctrl.processImgUrl(v));
                        })
                        $ctrl.imgUrlsActive = $ctrl.imgUrls[0];
                        
                        $ctrl.certifList = arr;

                        console.log('0====>', $ctrl.imgUrl)
                    }
                });
            };

            $ctrl.clickPicTitle = function(item, list) {
                list.forEach(function(v) {
                    v.active = false;
                });
                item.active = true;
                $ctrl.imgUrl = $ctrl.processImgUrl(item[1]);
                
                //展示多张图片 2018/09/12
                var urls = item[1].split(";");
                $ctrl.imgUrls = []
                urls.forEach(function(v){
                	$ctrl.imgUrls.push($ctrl.processImgUrl(v));
                })
                $ctrl.imgUrlsActive = $ctrl.imgUrls[0];
                
                console.log('1====>', $ctrl.imgUrl)
            };
            
            $ctrl.switchImage = function(item){
            	$ctrl.imgUrlsActive = item.item;
            };
            
            $ctrl.cancel = function() {
                $ctrl.dismiss({
                    $value: ''
                });
            };
        }]
    });

    app.service('decoration.reportReqHttpHelper', ['$http', '$q', 'fac', function($http, $q, fac) {
        var getFlielistUrl = '/ovu-pcos/decoration/decorationApply/list.do',
            delteFileUrl = '/ovu-pcos/decoration/decorationApply/delete.do',
            addEditFileUrl = '/ovu-pcos/decoration/decorationApply/edit.do';

        var getWorkUnitList = '/ovu-pcos/decoration/decorationApply/getOrderList.do',
            // getWorkUnitDetail = '/ovu-pcos/decoration/decorationApply/getOrderDetails.do',
            addWorkUnit = '/ovu-pcos/decoration/decorationApply/addOrder.do';

        // 查询 和 搜索
        this.getList = function(search) {
            var currentPage = search.currentPage || 1; // 默认 显示第一页

            // begin 后台代码规范  字段名修改 
            // var searchObj = {
            //     park_id: search.parkId || '',
            //     pageSize: search.numPerPage || 20, // 默认每页20条数据
            //     pageIndex: currentPage - 1,
            //     room_name: search.roomName,
            //     owner_tel: search.ownerTel,
            //     owner_name: search.ownerName,
            //     worker_name: search.workerName,
            //     worker_tel: search.workerTel,
            //     apply_status: search.auditState
            // };
            var searchObj = {
            	parkId: search.parkId || undefined,
            	deptId: search.deptId || undefined,
                pageSize: search.numPerPage || 20, // 默认每页20条数据
                pageIndex: currentPage - 1,
                roomName: search.roomName,
                ownerTel: search.ownerTel,
                ownerName: search.ownerName,
                workerName: search.workerName,
                workerTel: search.workerTel,
                applyStatus: search.auditState
            };
            // end
            return $q(function(resolve, reject) {
                $http.post(getFlielistUrl, searchObj, fac.postConfig)
                    .success(function(res) {
                        // 数据映射 方便查看前后端数据字段
                        var data = res.data;
                        if(data){
                        	data = res.data.map(function(v) {
                        		
                        		 return {
                                     id: v.id,
                                     roomNo: v.roomNo,
                                     roomName: v.roomName,
                                     roomId: v.roomId,
                                     ownerName: v.ownerName ? v.ownerName.split(',') : [],
                                     ownerTel: v.ownerTel ? v.ownerTel.split(',') : [],
                                     decoCompony: v.decorationCompany,
                                     construcDirector: v.workerName,
                                     construcTel: v.workerTel ? v.workerTel.split(',') : [],
                                     reportProject: v.decorationItems,
                                     reportProjectNames: v.decorationName,
                                     reportCertif: v.certificateUrl,
                                     files: v.certificateUrl ? v.certificateUrl.split(',') : [],
                                     auditState: v.applyStatus,
                                     suggest: v.suggest,
                                     parkId: v.parkId,
                                     certificate_id: v.certificateId,
                                     certificate_url: v.certificateUrl,
                                     approveDesc: v.approveDesc
                                 };
//                                return {
//                                    id: v.id,
//                                    roomNo: v.roomId,
//                                    roomName: v.roomName,
//                                    roomId: v.roomId,
//                                    ownerName: v.ownerName,
//                                    ownerTel: v.ownerTel,
//                                    decoCompony: v.decorationCompany,
//                                    construcDirector: v.workerName,
//                                    construcTel: v.workerTel,
//                                    reportProject: v.decorationItems,
//                                    reportProjectNames: v.decorationName,
//                                    reportCertif: v.certificateUrl,
//                                    files: v.certificateUrl ? v.certificateUrl.split(',') : [],
//                                    auditState: v.applyStatus,
//                                    suggest: v.suggest,
//                                    parkId: v.parkId,
//                                    certificate_id: v.certificateId,
//                                    certificate_url: v.certificateUrl,
//                                    approve_desc: v.approveDesc
//                                };
                            });
                        }
                

                        var pageModel = {
                            currentPage: res.pageIndex + 1,
                            numPerPage: res.pageSize,
                            totalCount: res.totalCount,
                            data: data
                        };
                        console.log(pageModel)
                        resolve(pageModel);
                    }).error(function() {
                        reject('请求数据失败');
                    });
            })
        };

        // 删除 fileIds '1,2,3'
        this.deleteFile = function(ids) {
            // begin 后台代码规范  字段名修改 
            // return $http.post(delteFileUrl, {
            //     ids: ids
            // }, fac.postConfig);
            return $http.post(delteFileUrl, {
                id: ids
            }, fac.postConfig);
            // end
        };
        // 编辑 新增
        this.addEditFile = function(parkId, id, roomName, roomId, ownerId,
            ownerName, ownerTel, decoCompony, construcDirector,
            construcTel, reportProject, reportProjectNames,
            certificateId, reportCertif, auditState, suggest,deptId) {
            // begin 后台代码规范  字段名修改 
            // var data = {
            //     park_id: parkId,
            //     id: id,
            //     room_id: roomNo,
            //     room_name: roomName,
            //     owner_id: ownerId,
            //     owner_name: ownerName,
            //     owner_tel: ownerTel,
            //     decoration_company: decoCompony,
            //     worker_name: construcDirector,
            //     worker_tel: construcTel,
            //     decoration_items: reportProject,
            //     decoration_name: reportProjectNames,
            //     certificate_id: certificateId,
            //     certificate_url: reportCertif,
            //     apply_status: auditState,
            //     suggest: suggest
            // };
            var data = {
                parkId: parkId,
                deptId: deptId,
                id: id,
                roomId: roomId,
                roomName: roomName,
                ownerId: ownerId,
                ownerName: ownerName,
                ownerTel: ownerTel,
                decorationCompany: decoCompony,
                workerName: construcDirector,
                workerTel: construcTel,
                decorationItems: reportProject,
                decorationName: reportProjectNames,
                certificateId: certificateId,
                certificateUrl: reportCertif,
                applyStatus: auditState,
                suggest: suggest
            };
            // end
            return $http.post(addEditFileUrl, data, fac.postConfig);
        };
        // 审批
        this.approve = function(item) {
            // begin 后台代码规范  字段名修改 
            // return $http.post('/ovu-pcos/decoration/decorationApply/isPass.do', {
            //     id: item.id,
            //     apply_status: item.auditState,
            //     approve_desc: item.approve_desc
            // }, fac.postConfig);
            return $http.post('/ovu-pcos/decoration/decorationApply/isPass.do', {
                id: item.id,
                applyStatus: item.auditState,
                approveDesc: item.approveDesc
            }, fac.postConfig);
            // end
        };
        // 获取工单列表
        this.getWorkUnitList = function(data) {
            return $http.get(getWorkUnitList, {
                params: data
            });
        };
        //新增工单
        this.addWorkUnit = function(data) {
            return $http.post(addWorkUnit, data, fac.postConfig);
        };
    }]);

    app.service('decoration.reportReqModalHelper', ['$uibModal', 'decoration.reportReqHttpHelper','fac','$rootScope', function($uibModal, httpHelper,fac,$rootScope) {
        // 编辑模态框
        function openEditModal(item, isNewAdd) {
            var modal = $uibModal.open({
                animation: true,
                component: 'reportReqEditModal',
                size: 'md',
                resolve: {
                    item: function() {
                        return item;
                    },
                    title: function() {
                        if (isNewAdd) {
                            return '代业主申请报装';
                        }
                        return '编辑报装申请';
                    }
                }
            });
            // 返回一个promise
            return modal.result;
        }
        // 删除确认模态框
        function openConfirmModal(msg) {
            var modal = $uibModal.open({
                animation: true,
                component: 'decoration.ConfirmModal',
                size: 'md',
                resolve: {
                    msg: function() {
                        return msg;
                    }
                }
            });
            // 返回一个promise
            return modal.result;
        }
        // 打开审批模态框
        function openApproveModal(item) {
            var modal = $uibModal.open({
                animation: true,
                component: 'reportReqApproveModal',
                size: 'md',
                resolve: {
                    item: function() {
                        return item;
                    },
                }
            });
            // 返回一个promise
            return modal.result;
        }
        // 打开工单modal
        function openWorkUnitModal(item, vm, generateWorkUnit) {
            var modal = $uibModal.open({
                animation: true,
                component: 'reportReqWorkUnitModal',
                size: 'md',
                resolve: {
                    item: function() {
                        item.generateWorkUnit = generateWorkUnit;
                        return item;
                    },
                    title: function() {
                        return generateWorkUnit ? '生成工单' : '工单列表';
                    },
                    parkId: function() {
                        return vm.parkId
                    }
                }
            });
            return modal.result;
        }

        // 获取数据封装 非纯函数
        this.find = function(search, vm) {
            if(app.domain.orgType == 'operatingCompany'||app.domain.orgType == 'propertyManagement'){
                delete search.deptId;
                search.parkId = fac.getAuthParkIds($rootScope.dept);
            }
        	if(!search.deptId && !search.parkId){
        		alert("请选择部门");
        		return;
        	}
            httpHelper.getList(search).then(function(res) {
                // 如果没有parkId 就不要显示数据
                if (!vm.parkId) {
                    vm.pageModel.data = [];
                    return;
                }
                vm.pageModel = res;
            });
        };
        // 添加 或者 编辑
        this.addEdit = function(item, vm) {
            var isNewAdd = false;
            if (!item) {
                isNewAdd = true;
                item = {};
            }
            var context = this;
            openEditModal(item, isNewAdd).then(function(item) {
                item.reportCertif = item.files.map(function(v) {
                    return v.fileUrl
                }).join();
                item.certificateId = item.files.map(function(v) {
                    return v.id
                }).join();
                httpHelper.addEditFile(vm.parkId, item.id, item.roomName,
                    item.roomId, item.ownerId, item.ownerName,
                    item.ownerTel, item.decoCompony,
                    item.construcDirector,
                    item.construcTel, item.reportProjectIds,
                    item.reportProjectNames,
                    item.certificateId,
                    item.reportCertif,
                    item.auditState, item.suggest,vm.deptId)

                .then(function(res) {
                    if (res.data.success) {
                        if (isNewAdd) {
                            // 添加数据 要跳转到最后一页 后台没有排序 新增在最后一条
                            // var lastPage = Math.ceil((vm.pageModel.totalCount + 1) / vm.pageModel.numPerPage);
                            // 后台排序
                            var lastPage = 1;
                            vm.pageModel.currentPage = lastPage;
                        }
                        var search = {
                        //    parkId: vm.parkId,
                            deptId: vm.deptId,
                            currentPage: vm.pageModel.currentPage,
                            numPerPage: vm.pageModel.numPerPage,
                            roomName: vm.roomName,
                            applyStatus: vm.auditState
                        };
                        context.find(search, vm);
                    }
                });
            }, function() {
                console.info('Modal dismissed at: ' + new Date());
            });
        };
        // [id1,id2...] 删除数据
        this.del = function(ids, msg, vm) {
            var context = this;
            // openConfirmModal(msg).then(function() {
            //     httpHelper.deleteFile(ids.join()).then(function(res) {
            //         if (res.data.success) {
            //             var search = {
            //                 parkId: vm.parkId,
            //                 currentPage: vm.pageModel.currentPage,
            //                 numPerPage: vm.pageModel.numPerPage,
            //                 room_name: vm.roomNO
            //             };
            //             context.find(search, vm);
            //         } else {
            //             confirm('已经审核通过或者已经生成工单的申请不能删除');
            //         }

            //     });

            // }, function() {
            //     console.info('Modal dismissed at: ' + new Date());
            // });

            confirm(msg, function() {
                httpHelper.deleteFile(ids.join()).then(function(res) {
                    if (res.data.success) {
                        var search = {
                        //    parkId: vm.parkId,
                            deptId: vm.deptId,
                            currentPage: vm.pageModel.currentPage,
                            numPerPage: vm.pageModel.numPerPage,
                            roomName: vm.roomName
                        };
                        context.find(search, vm);
                    } else {
                        confirm('已经审核通过或者已经生成工单的申请不能删除');
                    }

                });

            });
        };
        //审核
        this.approve = function(item, vm) {
            var context = this;
            openApproveModal(item).then(function(item) {
                httpHelper.approve(item).then(function(res) {
                    // if (res.data.success) {
                    if (res) {
                        var search = {
                        //    parkId: vm.parkId,
                            deptId: vm.deptId,
                            currentPage: vm.pageModel.currentPage,
                            numPerPage: vm.pageModel.numPerPage,
                            roomName: vm.roomName
                        };
                        context.find(search, vm);
                    }
                });
            });
        };
        // 打开工单
        this.toWorkUnit = function(item, vm, generateWorkUnit) {
            var apply_id = item.id;
            openWorkUnitModal(item, vm, generateWorkUnit).then(function(result) {
                if (generateWorkUnit) {
                    var data = {
                        PARK_ID: vm.parkId || item.parkId,
                        apply_id: apply_id,
                        WORKUNIT_NAME: result.roomName,
                        // WORKUNIT_NAME: result.workUnitName,
                        DESCRIPTION: result.workUnitDesc,
                        PICTURE: result.photos.join(),
                        CUSTOMER_NAME: result.ownerName,
                        CUSTOMER_PHONE: result.construcTel,
                        house_name: result.roomName,
                        room_id: result.roomId,
                        WORKTYPE_ID: result.worktype_ID,
                        WORKTYPE_NAME: result.WORKTYPE_NAME
                    };

                    httpHelper.addWorkUnit(data).then(function(res) {});
                }

            }, function() {
                console.log('打开modal失败');
            });
        };
        // 选择项目提示
        this.selectProj = function(msg) {
            var modal = $uibModal.open({
                animation: true,
                component: 'selectProjConfirmModal',
                size: 'md',
                resolve: {
                    msg: function() {
                        return msg;
                    }
                }
            });
            // 返回一个promise
            return modal.result;
        };

        // 显示报装证件
        this.showReportCertif = function(item, vm) {
            var modal = $uibModal.open({
                animation: true,
                component: 'reportCertifModal',
                size: 'md',
                resolve: {
                    item: function() {
                        return item;
                    },
                    // title: function() {
                    //     return generateWorkUnit ? '生成工单' : '工单列表';
                    // },
                    // parkId: function() {
                    //     return vm.parkId
                    // }
                }
            });
        };
    }]);

    app.service('decoration.commonService', function() {
        // 全选
        this.checkAll = function(pageModel) {
            pageModel.checked = !pageModel.checked;
            pageModel.data.forEach(function(n) {
                n.checked = pageModel.checked
            });
        };

        // 单选
        this.checkOne = function(item, pageModel) {
            item.checked = !item.checked;
            pageModel.checked = pageModel.data.every(function(v) {
                return v.checked;
            });
        };

        // 是否有选择
        this.hasChecked = function(pageModel) {
            if (pageModel && pageModel.data && pageModel.data.length) {
                return pageModel.data.filter(function(n) {
                    return n.checked
                }).length;
            }
            return false;
        };
    });

})(angular, document, window);