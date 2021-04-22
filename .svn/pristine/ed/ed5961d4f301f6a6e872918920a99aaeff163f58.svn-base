(function() {
    document.title ="OVU-园区管家";
    var app = angular.module("angularApp");
    app.controller('parkStewardCtl', function ($scope,$rootScope, $http,$filter,$uibModal,fac) {
        angular.extend($rootScope,fac.dicts);
        $scope.search = {};
        $scope.pageModel = {};

        //查询
        $scope.find = function(pageNo){
        	if(!app.park || !app.park.ID){
				window.msg("请先选择一个项目!");
				return false;
			}
        	$scope.search.parkId = app.park.ID;
        	
            $.extend($scope.search,{currentPage:pageNo||$scope.pageModel.currentPage||1,pageSize:$scope.pageModel.pageSize||10});
            $scope.search.pageIndex = $scope.search.currentPage-1;
            $scope.search.totalCount = $scope.pageModel.totalCount||0;

            fac.getPageResult("/ovu-base/ovupark/backstage/parkSteward/listByParm", $scope.search, function(data){
                console.log(data);
                $scope.pageModel = data;
            });
        }

        app.modulePromiss.then(function() {
            fac.initPage($scope,function(){
            	$scope.find();
            })
        });

        $scope.validate = function(item){
            $.post("/ovu-base/ovupark/backstage/parkSteward/getCustomersOfParksteward", {"psId": item.id}, function (resp) {
                if (resp.code && resp.data.length > 0) {
                    window.alert("该管家下关联有企业, 不能删除!");
                    return false;
                } else {
                    $scope.del(item.id);
                }
            });
        };

        $scope.del = function (id) {
            confirm("确认删除该园区管家信息吗?", function () {
                $.post("/ovu-base/ovupark/backstage/parkSteward/remove", {ids : id}, function (resp) {
                    if (resp.code) {
                        window.msg("删除成功!");
                        $scope.find();
                    } else {
                        window.alert(resp.message);
                    }
                });
            })
        };

        //添加/修改
        $scope.showEditModal = function (parkSteward) {
        	if(!app.park || !app.park.ID){
				window.msg("请先选择一个项目!");
				return false;
			}
        	$scope.search.parkId = app.park.ID;
        	
            parkSteward = parkSteward || {createrId : app.user.ID};
            var copy = angular.extend({}, parkSteward);
            copy.parkId = app.park.ID;
            
            var modal = $uibModal.open({
                animation: false,
                size: 'md',
                templateUrl: '/view/operationManage/parkHousekeeper/modal.parkSteward.html',
                controller: 'modal.parkStewardCtrl',
                resolve: {parkSteward: copy}

            });
            modal.result.then(function () {
                $scope.find();
            }, function () {
                console.info('Modal dismissed at: ' + new Date());
            });
        };
    });

    app.controller('modal.parkStewardCtrl', function($scope, $http, $uibModalInstance, $filter, $uibModal, fac, parkSteward) {
        $scope.item = parkSteward;
        $scope.initServiceRanges = [];
        $scope.initLabels = [];

        //初始化人员信息
        $scope.initPersonInfo = function(){
            if($scope.item.personId){
                $http.post("/ovu-base/pcos/person/personInfo", {personId : $scope.item.personId}, fac.postConfig).success(function (personInfo) {
                    console.log(personInfo);
                    if(personInfo){
                        $scope.item.personName = personInfo.NAME;
                        $scope.item.sex = personInfo.SEX;
                        $scope.item.partinDay = personInfo.PARTIN_DAY;
                        $scope.item.jobCode = personInfo.JOB_CODE;
                        $scope.item.phone = personInfo.PHONE;
                    }
                });
            }
        };
        
        //初始化服务范围
        $scope.initSortingsInfo = function(){
            if($scope.item.serviceRange){
                $scope.initServiceRanges = JSON.parse($scope.item.serviceRange);
            }
        };
        
        //初始化评价标签
        $scope.initLabelsInfo = function(){
            if($scope.item.label){
                $scope.initLabels = JSON.parse($scope.item.label);
            }
        };

        $scope.initPersonInfo();
        $scope.initSortingsInfo();
        $scope.initLabelsInfo();

        $scope.saveParkSteward = function (form) {
        	if($(".saveParkSteward").attr("disabled")){
                return false;
            }
        	
            form.$setSubmitted(true);
            if (!form.$valid) {
                return;
            }
            console.log($scope.item);
            if(!$scope.item.serviceRange){
                window.alert("请至少添加一条服务分类!");
                return false;
            }
            if(!$scope.item.label){
                window.alert("请至少添加一条标签!");
                return false;
            }
            $.post("/ovu-base/ovupark/backstage/parkSteward/saveOrEdit", $scope.item, function(resp) {
            	if (resp.code) {
                    $uibModalInstance.close();
                    window.msg("添加管家成功!");
                } else {
                    window.alert(resp.message);
                }
            });
        };

        //人员选择
        $scope.choosePerson = function () {
            $.post("/ovu-base/ovupark/backstage/parkSteward/getParkStewards", {type : "onlyId", parkId : app.park.ID}, function(resp) {
            	psList = [];
            	if(resp.code){
                	psList = resp.data;
                }else{
                	window.alert(resp.message);
                }
            	var data = angular.extend([], psList);
                var modal = $uibModal.open({
                    animation: false,
                    size: 'lg',
                    templateUrl: '/view/operationManage/parkHousekeeper/modal.choosePerson.html',
                    controller: 'choosePersonCtrl',
                    resolve: {AllParkSteWards : function(){
                        return data.toString();
                    }}
                });
                modal.rendered.then(function(){
                    console.log("Modal rendered");
                });
                modal.result.then(function (p) {
                    console.log(p);
                    $scope.item.personId = p.pIds;
                    $scope.item.personName = p.pNames;
                    $scope.initPersonInfo();
                }, function (reason) {
                    console.info('Modal ChoosePerson dismissed at: ' + new Date());
                });
            });

        };

        //服务分类选择器
        $scope.chooseSorting = function () {
            var data = angular.extend({}, $scope.initServiceRanges);
            var modal = $uibModal.open({
                animation: false,
                size: 'md',
                templateUrl: '/view/operationManage/parkHousekeeper/modal.chooseServiceClassification.html',
                controller: 'chooseServiceSortingCtrl',
                resolve: {initServiceRanges: data}
            });
            modal.rendered.then(function(){
                console.log("Modal rendered");
            });
            modal.result.then(function (s) {
                $('.sortingRange').empty();
                console.log(s);
                var sortingIds = s.sortingIds.split("{@}"), sortingNames = s.sortingNames.split("{@}");
                var sR = [];
                for(i = 0; i < sortingIds.length; i++){
                    $('.sortingRange').append('<div class="div-panel" title="'+sortingNames[i]+'">'+sortingNames[i]+'</div>');
                    sR.push({sortingId: sortingIds[i], sortingName: sortingNames[i]});
                }
                if(sR.length > 0){
                    $scope.item.serviceRange = JSON.stringify(sR);
                }
                $scope.$applyAsync();
            }, function (reason) {
                console.info('Modal ChoosePerson dismissed at: ' + new Date());
            });
        };

        //标签选择器
        $scope.chooseLabel = function () {
            var data = angular.extend([], $scope.initLabels);
            var modal = $uibModal.open({
                animation: false,
                size: 'md',
                templateUrl: '/view/operationManage/parkHousekeeper/modal.chooseLabel.html',
                controller: 'chooseLabelCtrl',
                resolve: {initLabels: function(){
                    return data;
                }}
            });
            modal.rendered.then(function(){
                console.log("Modal rendered");
            });
            modal.result.then(function (L) {
                $('.myLabels').empty();
                console.log(L);
                var labelIds = L.labelIds.split("{@}"), labelNames = L.labelNames.split("{@}");
                var sR = [];
                for(i = 0; i < labelIds.length; i++){
                    $('.myLabels').append('<div class="div-panel" title="'+labelNames[i]+'">'+(labelNames[i].length > 4 ? labelNames[i].substring(0, 4)+"..." : labelNames[i])+'</div>');
                    sR.push({id: labelIds[i], label: labelNames[i], count: 0});
                }
                if(sR.length > 0){
                    $scope.item.label = JSON.stringify(sR);
                }
                $scope.$applyAsync();
            }, function (reason) {
                console.info('Modal ChoosePerson dismissed at: ' + new Date());
            });
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    });

    app.controller('choosePersonCtrl',function($scope, $rootScope, $http, $uibModalInstance, $filter, fac, $uibModal, AllParkSteWards){
        angular.extend($rootScope,fac.dicts);
        $scope.AllParkSteWards = AllParkSteWards;
        $scope.search = {};
        $scope.pageModel = {};
        fac.setPostDict($rootScope);

        $scope.loadDeptTree = function(){
            $("#treeloading").removeClass("hide");
            $.post("/ovu-base/system/dept/tree", {parkId : app.park.ID}, function(data) {
                $("#treeloading").addClass("hide");
                if(!data || data.length == 0){
                    $('#dept_tree').html("暂无部门信息");
                }else{
                    //初始化人员列表
                    data[0].state = {selected:true};
                    $scope.search.DEPT_ID = data[0].did;
                    $scope.findPerson(1);

                    $('#dept_tree').treeview({data : data});
                    var treeView = $("#dept_tree").data('treeview');
                    $scope.treeData = data;
                    $scope.oriList = treeView.getUnchecked();

                    $('#dept_tree').on('nodeSelected', function(event, node) {
                        $scope.search.DEPT_ID = node.did;
                        $scope.findPerson(1);
                    });
                    $('#dept_tree').on('nodeUnselected', function(event, node) {
                        delete $scope.search.DEPT_ID;
                        console.log(node.did);
                    });
                }
            }, 'json');
        };

        $scope.findPerson = function(pageNo){
            $.extend($scope.search, {currentPage:pageNo || $scope.pageModel.currentPage || 1, pageSize:$scope.pageModel.pageSize || 10});
            $scope.search.pageIndex = $scope.search.currentPage-1;
            $scope.search.totalCount = $scope.pageModel.totalCount||0;

            $("#toolbarTr").prevAll().remove();
            $("#tableloading").removeClass("hide");
            console.log($scope.search);
            fac.getPageResult("/ovu-base/pcos/person/listByGrid",$scope.search,function(data){
                $("#tableloading").addClass("hide");
                data.list.forEach(function(n){
                    //处理部门
                    n.postList = [];
                    if(n.posts){
                        var deptpost = n.posts.split(",");
                        n.postList = deptpost.map(function(m){return m.indexOf("^")>0?(m.split("^")):(null)})
                        delete n.posts;
                    }

                    //标记已是管家的人员
                    if($scope.AllParkSteWards && $scope.AllParkSteWards.indexOf(n.ID) != -1){
                        n.disabled = true;
                    }else{
                        n.disabled = false;
                    }
                });
                console.log(data);

                $scope.pageModel = data;
            });
        };

        $scope.loadDeptTree();

        $scope.removePersonItem = function(personId,personName){
            $("#selectTable  #"+personId).html("<span class='glyphicon glyphicon-plus'></span>添加");
            $("#selectTable  #"+personId).removeAttr("disabled");

            $("#selectTable  #"+personId).removeAttr("ng-disabled");
        };

        $scope.initRemove = function(person){
            $scope.removePersonItem(person.id, person.personName);

            $("li[personId='"+person.id+"']", ".ul-persons").remove();
        };

        $scope.addPersonItem = function(item, bool){
            var personId = item.ID,
                personName = item.NAME;
            if($("#selectTable  #"+personId).attr("disabled") || $("#selectTable  #"+personId).attr("ng-disabled") == "true"){
                return false;
            }

            //如果是单选，已经添加了一个，先删除原来的，在添加新的人员
            if(bool){
                $(".ul-persons .item").each(function(){
                    var id = $(this).attr("personId");//获取原来的人员id
                    //var name=$(this).attr("personName");//原来的人员姓名，状态改为可选
                    $("#selectTable  #"+id).removeAttr("disabled");
                    $("#selectTable  #"+id).html("<span class='glyphicon glyphicon-plus'></span>选择");
                    $(".ul-persons .item").remove();
                });
            }

            var li = $('<li class="item" personId="'+personId+'" personName="'+personName+'">'+personName+'</li>');
            var a = $('<a href="javascript:void(0);"><i class="fa fa-remove"></i></a>');
            $(li).append(a);
            $(".ul-persons").append(li);
            //添加人员，状态改为已添加
            $("#selectTable  #"+personId).html("<span class='glyphicon'></span>已选择");
            $("#selectTable  #"+personId).attr("disabled", "disabled");

            $(a).bind("click",function(){
                $(this).parent().remove();
                $scope.removePersonItem(personId, personName);
            });

        };

        $scope.checkPerson = function(){
            var checkedP = $(".ul-persons .item");
            if(checkedP.length <=0 ){
                window.msg("请至少添加一个人员!");
                return false;
            }
            var pIds = "", pNames = "";
            checkedP.each(function(index){
                pIds += $(this).attr("personId");
                pNames += $(this).attr("personName");
                if(index < checkedP.length -1){
                    pIds += ",";
                    pNames += ",";
                }
            });

            $uibModalInstance.close({pIds: pIds, pNames: pNames});
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };

    });

    app.controller('chooseServiceSortingCtrl',function($scope, $rootScope, $http, $uibModalInstance, $filter, fac, $uibModal, initServiceRanges){
        angular.extend($rootScope,fac.dicts);
        $scope.initServiceRanges = initServiceRanges;
        $scope.search = {parentId : "0"};
        $scope.pageModel = {};

        $scope.find = function(pageNo){
            $.extend($scope.search, {currentPage:pageNo || $scope.pageModel.currentPage || 1, pageSize:$scope.pageModel.pageSize || 10});
            $scope.search.pageIndex = $scope.search.currentPage-1;
            $scope.search.totalCount = $scope.pageModel.totalCount||0;

            var searchVal = $("#searchTxt").val();
            var param = {};

            if(searchVal && searchVal!=""){
                $scope.search.serviceName = searchVal;
                delete $scope.search.parentId;
            }else{
                $scope.search.parentId = "0";
                delete $scope.search.serviceName;
            }

            $("#toolbarTr").prevAll().remove();
            $("#tableloading").removeClass("hide");
            fac.getPageResult("/ovu-park/backstage/operate/serviceClassification/list", $scope.search, function(result){
                $("#tableloading").addClass("hide");
                if(result && result.data && result.data.length > 0){
                    //处理已有服务分类
                    if($scope.initServiceRanges){
                        var ss = JSON.stringify($scope.initServiceRanges);
                        for(var i = 0; i<result.data.length; i++){
                            if(ss && ss.indexOf(result.data[i].id) != -1){
                            	result.data[i].disabled = true;
                            }else{
                            	result.data[i].disabled = false;
                            }
                        }
                    }

                    $scope.pageModel = result;
                }
            });
        };

        app.modulePromiss.then(function() {
            fac.initPage($scope,function(){
            	$scope.find();
            })
        });

        $scope.removeSortingItem = function(sortingId, sortingName){
            $("#selectTable  #"+sortingId).html("<span class='glyphicon glyphicon-plus'></span>添加");
            $("#selectTable  #"+sortingId).removeAttr("disabled");

            $("#selectTable  #"+sortingId).removeAttr("ng-disabled");
        };

        $scope.initRemove = function(sr){
            $scope.removeSortingItem(sr.sortingId, sr.sortingName);

            $("li[sortingId='"+sr.sortingId+"']", ".ul-persons").remove();
        };

        $scope.addSortingItem = function(item, bool){
            var sortingId = item.id, sortingName = item.serviceName;
            if($("#selectTable  #"+sortingId).attr("disabled") || $("#selectTable  #"+sortingId).attr("ng-disabled") == "true"){
                return false;
            }

            //如果是单选，已经添加了一个，先删除原来的，在添加新的人员
            if(bool){
                $(".ul-persons .item").each(function(){
                    var id = $(this).attr("sortingId");//获取原来的人员id
                    //var name=$(this).attr("personName");//原来的人员姓名，状态改为可选
                    $("#selectTable  #"+id).removeAttr("disabled");
                    $("#selectTable  #"+id).html("<span class='glyphicon glyphicon-plus'></span>添加");
                    $(".ul-persons .item").remove();
                });
            }

            var li = $('<li class="item" sortingId="'+sortingId+'" sortingName="'+sortingName+'">'+sortingName+'</li>');
            var a = $('<a href="javascript:void(0);"><i class="fa fa-remove"></i></a>');
            $(li).append(a);
            $(".ul-persons").append(li);
            //添加人员，状态改为已添加
            $("#selectTable  #"+sortingId).html("<span class='glyphicon'></span>已添加");
            $("#selectTable  #"+sortingId).attr("disabled", "disabled");


            $(a).bind("click",function(){
                $(this).parent().remove();
                $scope.removeSortingItem(sortingId, sortingName);
            });

        };

        $scope.checkSorting = function(){
            var checkedS = $(".ul-persons .item");
            if(checkedS.length <=0 ){
                window.msg("请至少添加一个分类!");
                return false;
            }
            var sIds = "", sNames = "";
            checkedS.each(function(index){
                sIds += $(this).attr("sortingId");
                sNames += $(this).attr("sortingName");
                if(index < checkedS.length -1){
                    sIds += "{@}";
                    sNames += "{@}";
                }
            });

            $uibModalInstance.close({sortingIds: sIds, sortingNames: sNames});
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    });

    app.controller('chooseLabelCtrl', function($scope, $rootScope, $http, $uibModalInstance, $filter, fac, $uibModal, initLabels){
        angular.extend($rootScope,fac.dicts);
        $scope.initLabels = initLabels;
        $scope.AllLabels = [
            {id: "1", label: "好评"},
            {id: "2", label: "中评"},
            {id: "3", label: "差评"},
            {id: "4", label: "服务态度好"},
            {id: "5", label: "响应及时"},
            {id: "6", label: "态度恶劣,不靠谱"},
            {id: "7", label: "能力强，有责任心"},
            {id: "8", label: "不善沟通"},
            {id: "9", label: "能力不够"}
        ];

        //处理已有服务分类
        if($scope.initLabels){
            for(var i = 0; i< $scope.AllLabels.length; i++){
                if($scope.initLabels && $scope.initLabels.length > 0){
                    for(var j = 0; j< $scope.initLabels.length; j++){
                        if($scope.AllLabels[i].id == $scope.initLabels[j].id){
                            $scope.AllLabels[i].disabled = true;
                            break;
                        }else{
                            $scope.AllLabels[i].disabled = false;
                        }
                    }
                }else{
                    $scope.AllLabels[i].disabled = false;
                }
            }
        }

        $scope.removeLabelItem = function(labelId, labelName){
            $("#selectTable  #"+labelId).html("<span class='glyphicon glyphicon-plus'></span>添加");
            $("#selectTable  #"+labelId).removeAttr("disabled");

            $("#selectTable  #"+labelId).removeAttr("ng-disabled");
        };

        $scope.initRemove = function(L){
            $scope.removeLabelItem(L.id, L.label);

            $("li[labelId='"+L.id+"']", ".ul-persons").remove();
        };

        $scope.addLabelItem = function(item, bool){
            var labelId = item.id, labelName = item.label;
            if($("#selectTable  #"+labelId).attr("disabled") || $("#selectTable  #"+labelId).attr("ng-disabled") == "true"){
                return false;
            }

            //如果是单选，已经添加了一个，先删除原来的，在添加新的标签
            if(bool){
                $(".ul-persons .item").each(function(){
                    var id = $(this).attr("labelId");//获取原来的标签id
                    //var name=$(this).attr("personName");//原来的标签，状态改为可选
                    $("#selectTable  #"+id).removeAttr("disabled");
                    $("#selectTable  #"+id).html("<span class='glyphicon glyphicon-plus'></span>添加");
                    $(".ul-persons .item").remove();
                });
            }

            var li = $('<li class="item" labelId="'+labelId+'" labelName="'+labelName+'">'+labelName+'</li>');
            var a = $('<a href="javascript:void(0);"><i class="fa fa-remove"></i></a>');
            $(li).append(a);
            $(".ul-persons").append(li);
            //添加标签，状态改为已添加
            $("#selectTable  #"+labelId).html("<span class='glyphicon'></span>已添加");
            $("#selectTable  #"+labelId).attr("disabled", "disabled");


            $(a).bind("click",function(){
                $(this).parent().remove();
                $scope.removeLabelItem(labelId, labelName);
            });

        };

        $scope.checkLabel = function(){
            var checkedL = $(".ul-persons .item");
            if(checkedL.length <=0 ){
                window.msg("请至少添加一个标签!");
                return false;
            }
            var sIds = "", sNames = "";
            checkedL.each(function(index){
                sIds += $(this).attr("labelId");
                sNames += $(this).attr("labelName");
                if(index < checkedL.length -1){
                    sIds += "{@}";
                    sNames += "{@}";
                }
            });

            $uibModalInstance.close({labelIds: sIds, labelNames: sNames});
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    });
})();
