(function() {
	var app = angular.module("angularApp");
	app.controller('serviceSortingCtl', function ($scope, $rootScope, $http, $filter, $uibModal, fac) {		
		document.title ="OVU-管家服务分类";
		angular.extend($rootScope,fac.dicts);
		$scope.search = {parentId : "0"};
		$scope.treeRootLen = 0;
		$scope.pageModel = {};
		function expandTree(treeSelector,data,keys){
            function _addDefaultState(nodes){
                nodes.forEach(function(n){
                    n.state = {expanded : false	};
                    if(n.nodes && n.nodes.length>0){
                        _addDefaultState(n.nodes);
                    }
                })
            }
            _addDefaultState(data);
        
            var treeView = $(treeSelector).data('treeview');
            if(!treeView||!Array.isArray(keys)){
                return;
            }
            var oriList = treeView.getUnchecked();
            function _addState(node){
                for(var i=0;i<keys.length;i++){
                    if(node.hasOwnProperty(keys[i])){
                        var key = keys[i];
                        var oldNode = oriList.find(function(n){return n[key] == node[key]});
                        oldNode && (node.state = oldNode.state);
                        break;
                    }
                }
                if(node.nodes && node.nodes.length>0){
                    node.nodes.forEach(function(n){
                        _addState(n);
                    })
                }
            }
            data.forEach(function(n){
                _addState(n);
            });
        }
		$scope.loadServiceSortingTree = function(){
			if(app.park && app.park.parkId){
				$scope.parkId = app.park.parkId
			}
			$("#treeloading").removeClass("hide");
			$.post("/ovu-park/backstage/operate/serviceClassification/getTreeList", {parkId:$scope.parkId}, function(data) {
                $("#treeloading").addClass("hide");
				expandTree("#dept_tree",data.data,["did"]);
				//data.unshift({did:'0',deptNo:'',pdid:'',text:'无',nodes:[]});
				if(!data.data || data.data.length == 0){
					$scope.treeRootLen = 0;
					$('#dept_tree').html("暂无分类");
				}else{
					$scope.treeRootLen = data.data.length;
					console.log($scope.treeRootLen);
					$('#dept_tree').treeview({
						data : data.data
					});
					var selNode = $("#dept_tree").treeview('getSelected');
					if(selNode && selNode.length>0){
						$('#dept_tree').treeview('revealNode',selNode[0].nodeId);
						$('#dept_tree').treeview('expandNode',selNode[0].nodeId);
					}
					$('#dept_tree').on('nodeSelected', function(event, node) {
						$("#parentId").val(node.did);
						$("#parentName").text(node.text);
						
						if(node.nodes == undefined){
							$("#nodeLength").text(0);
						}else{
							$("#nodeLength").text(node.nodes.length);
						}
						
						$("#searchTxt").val("");
						$scope.find(1);
					});
					$('#dept_tree').on('nodeUnselected', function(event, node) {
						$("#parentId").val("0");
						$("#parentName").text("");
						$("#nodeLength").text("");
						$scope.find(1);
					});
				}
			}, 'json');
		};


        $scope.find = function(pageNo){
            $.extend($scope.search, {currentPage:pageNo || $scope.pageModel.currentPage || 1, pageSize:$scope.pageModel.pageSize || 10});
            $scope.search.pageIndex = $scope.search.currentPage-1;
            $scope.search.totalCount = $scope.pageModel.totalCount||0;
            var searchVal = $("#searchTxt").val();
            var pid = $("#parentId").val();
            var nodeLength = $("#nodeLength").text();
            var param = {};
            if(pid == "" && searchVal==""){
                pid = "0";
            }

            if(searchVal && searchVal!=""){
                $scope.search.serviceName = searchVal;
                $scope.search.parentId;
            }else{

                if(pid == "0" || nodeLength > 0){
                    $scope.search.parentId = pid;
                    delete $scope.search.id;
                }else{
                    $scope.search.id = pid;
                    delete $scope.search.parentId;
                }

                //$scope.search.parentId = pid;
                delete $scope.search.serviceName;
            }

            $("#toolbarTr").prevAll().remove();
            $("#tableloading").removeClass("hide");
            if($scope.pageModel.currentPage){
                delete $scope.pageModel.currentPage;
            }
            //console.log($scope.search);
            fac.getPageResult("/ovu-park/backstage/operate/serviceClassification/list", $scope.search, function(data){
                $("#tableloading").addClass("hide");
                if(data && data.data && data.data.length>0){
                    //console.log("PageList:");
                    //console.log(data);
                    $scope.pageModel = data;
                }
            });
        };

        app.modulePromiss.then(function() {
            fac.initPage($scope,function(){
            	$scope.loadServiceSortingTree();
            	$scope.find(1);
            })
        });
        $scope.query = function(){
        	fac.initPage($scope, function () {
                $scope.find(1);
            })
        }
        $scope.findRoot = function(){
            $("#parentId").val("");
            $("#parentName").text("");
            $("#searchTxt").val("");

            $scope.find(1);
        }

        //删除分类信息
        $scope.delItem = function(serviceSorting){
            $.post("/ovu-park/backstage/operate/serviceClassification/getChildrenById", {parentId : serviceSorting.id}, function(result){
            	if(result.data&& result.data.data.length > 0){
                    window.alert("该分类下面存在下级分类, 无法删除！");
                }else{
                    confirm("确定删除分类 ["+serviceSorting.serviceName+"]",function(){
                        $.post("/ovu-park/backstage/operate/serviceClassification/del",{ids: serviceSorting.id},function(code){
                        	if(code.code==0){
                                window.msg("删除成功!");
                                $scope.loadServiceSortingTree();
                                $scope.find(1);
                            }else{
                                window.alert("删除失败!");
                            }
                        });
                    });
                }
            });
        };

        //交换位置
        $scope.changeItems = function(changeInfo){
            $.post("/ovu-park/backstage/operate/serviceClassification/exchange", changeInfo, function(resp){
                if(resp){
                    window.msg("移位成功!");
                    $scope.loadServiceSortingTree();
                    $scope.find();
                }else{
                    window.alert("移位失败!");
                }
            });
        };

        $scope.optItem = function(serviceSorting, type, event){
            if(type == 'del'){

                $scope.delItem(serviceSorting);

            }else if(type == 'up' || type == 'down'){
                var cid = parseInt($(event.target).attr("data-sid"));
                if(cid == 0 && type == 'up'){
                    window.alert("已经是第一个,不能上移!");
                    return false;
                }
                if(cid == $scope.pageModel.data.length - 1 && type == 'down'){
                    window.alert("已经是最后一个,不能下移!");
                    return false;
                }

                if(!$scope.search.parentId){
                    window.alert("请先选择一个分类节点!");
                    return false;
                }

                if(type == 'up'){
                    cid --;
                }else{
                    cid ++;
                }

                var otherItem = $scope.pageModel.data[cid];
                var changeInfo = {
                    id1 : serviceSorting.id,
                    position1 : serviceSorting.position,
                    id2 : otherItem.id,
                    position2 : otherItem.position
                };
                //console.log(changeInfo);
                $scope.changeItems(changeInfo);
            }
        };

        $scope.showEditModal = function (serviceSorting) {//
            serviceSorting = serviceSorting || {parentId : "0", 
            	position : $scope.treeRootLen + 1,
            	creatorName:app.user.LOGIN_NAME, 
            	creatorId : app.user.ID};
        	serviceSorting.parkId = app.park.parkId;
        	serviceSorting.updatorId = app.user.ID;
            var um;
            var copy = angular.extend({}, serviceSorting);

            var modal = $uibModal.open({
                animation: false,
                size: 'lg',
                templateUrl: '/view/operationManage/serviceClassifica/modal.editServiceClassification.html',
                controller: 'editServiceSorting'
                , resolve: {serviceSorting: copy},
                backdrop: 'static',
                keyboard: false
            });
            modal.rendered.then(function(){
                console.log("Modal rendered");
            });
            modal.result.then(function () {

                $scope.loadServiceSortingTree();
                $scope.find();
            }, function () {
                console.info('Modal dismissed at: ' + new Date());
            });
        };

    });

    app.filter("convertDescription",function(){//转换分类描述
        return function(content) {
            if(content !=null && content.length > 16){
                content = content.substring(0, 16) + "...";
            }else {
            	content = "--";
            }
            return content;
        }
    });

    app.controller('editServiceSorting',function($scope, $http, $uibModalInstance, $filter, fac, serviceSorting, $uibModal){
        $scope.item = serviceSorting;

        $scope.getMaxPosition = function(parentId){
            $.post("/ovu-park/backstage/operate/serviceClassification/getMaxPosition", {parentId : parentId,parkId:app.park.parkId}, function(data){
                console.log("maxCount: "+ data.data);
                $scope.item.position = data.data + 1;
                $scope.$apply();
            });
        };

        $scope.saveServiceSorting = function (form, item) {
            form.$setSubmitted(true);
            if (!form.$valid) {
                return false;
            }
        	delete item.children;
            //console.log($scope.item);
            $.post("/ovu-park/backstage/operate/serviceClassification/saveOrEdit", $scope.item, function(resp){
                if(resp.code==0){
                	 window.msg("操作成功!");
                	 $uibModalInstance.close();
                }else{
                	 window.alert("操作失败!");
                }
            });

        }

        $scope.chooseSorting= function () {
            var modal = $uibModal.open({
                animation: false,
                size: 'md',
                templateUrl: '/view/operationManage/serviceClassifica/modal.serviceClassification.html',
                controller: 'serviceSortingCtrl',
                resolve: {}
            });
            modal.rendered.then(function(){
                console.log("Modal rendered");
            });
            modal.result.then(function (r) {
                $scope.item.parentId = r.did;
                $scope.item.parentName = r.text;
                $scope.getMaxPosition(r.did);

                $scope.$applyAsync();
            }, function (reason) {
                console.info('Modal ChoosePerson dismissed at: ' + new Date());
            });
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    });

    app.controller('serviceSortingCtrl',function($scope, $rootScope, $http, $uibModalInstance, $filter, fac, $uibModal){

        function expandTree(treeSelector,data,keys){
            function _addDefaultState(nodes){
                nodes.forEach(function(n){
                    n.state = {expanded : false	};
                    if(n.nodes && n.nodes.length>0){
                        _addDefaultState(n.nodes);
                    }
                })
            }
            _addDefaultState(data);
        
            var treeView = $(treeSelector).data('treeview');
            if(!treeView||!Array.isArray(keys)){
                return;
            }
            var oriList = treeView.getUnchecked();
            function _addState(node){
                for(var i=0;i<keys.length;i++){
                    if(node.hasOwnProperty(keys[i])){
                        var key = keys[i];
                        var oldNode = oriList.find(function(n){return n[key] == node[key]});
                        oldNode && (node.state = oldNode.state);
                        break;
                    }
                }
                if(node.nodes && node.nodes.length>0){
                    node.nodes.forEach(function(n){
                        _addState(n);
                    })
                }
            }
            data.forEach(function(n){
                _addState(n);
            });
        }
        $scope.getSortingTree = function(){
            $.post("/ovu-park/backstage/operate/serviceClassification/getTreeList", {parkId:app.park.parkId}, function(data) {
                expandTree("#modalDeptTree",data.data,["did"]);
                if(!data.data || data.data.length == 0){
                    $('#modalDeptTree').html("暂无分类");
                }else{
                    if(data.data && data.data.length>0){
                        data.data.unshift({did:'0', pdid:'0', text:'无'});
                    }
                    $('#modalDeptTree').treeview({
                        data : data.data
                    });
                    $('#modalDeptTree').on('nodeSelected', function(event, node) {

                        console.log(node.did + " " + node.text);
                        $uibModalInstance.close({did: node.did, text: node.text});
                    });
                }
            }, 'json');
        };

        $scope.getSortingTree();

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    });
})();