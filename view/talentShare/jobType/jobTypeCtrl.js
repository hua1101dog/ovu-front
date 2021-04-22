/**
 * Created by Administrator on 2017/7/20.
 */
(function () {
    "use strict";
    var app = angular.module("angularApp");
    app.controller('jobTypeCtrl', function ($scope, $rootScope, $http, $filter, $uibModal, $timeout, fac,$compile) {
        document.title = "OVU-职位类型管理";
       

        $scope.pageModel = {};
        $scope.search = {};
        
        // 获取 第一级 数据 
        $scope.find = function (pageNo) {
            $.extend($scope.search, {
                currentPage: pageNo || $scope.pageModel.currentPage || 1,
                pageSize: $scope.pageModel.pageSize || 10
            });
            fac.getPageResult("/ovu-park/backstage/talentShare/jobType/listPage", $scope.search, function (data) {
                //console.info(angular.toJson(data));
                $scope.pageModel = data;
                // console.log(data)
                // 初始化  tree grid
                var mockJson = $scope.pageModel.data;
                for(var i=0;i<mockJson.length;i++){
                    mockJson[i].iconCls = "noBg";
                    if(mockJson[i].hasChild){
                        mockJson[i].state = "closed";
                    }
                };
                $('#tt').treegrid({
                    data: mockJson,
                    animate:true,
                    idField: 'id',
                    treeField: 'name',
                    parentField: 'menuid',
                    // rownumbers: true,
                    queryParams: {
                        "id": "-1"
                    },
                    singleSelect:false,
                    rowStyler:function(){
                        return 'height:40px'
                    },
                    //首次查询参数           
                    columns: [[
                        {
                            field: "id",
                            title: "编号",
                            width:500,
                            // align: 'center',
                            checkbox : true,
                        },{
                            field: "name",
                            title: "类别名称",
                            checkbox:false,
                            width:500,
                        }, {
                            field: "createTime",
                            align: 'center',
                            title: "创建时间",
                            checkbox:false,
                            width: 250
                        }, {
                            field: "creater",
                            align: 'center',
                            title: "创建人",
                            checkbox:false,
                            width: 190
                        }, {
                            field: "updateTime",
                            align: 'center',
                            title: "修改时间",
                            checkbox:false,
                            width: 250
                        }, {
                            field: "updater",
                            align: 'center',
                            title: "修改人",
                            checkbox:false,
                            width: 178
                        },
                        {
                            field:"edit",
                            align: 'center',
                            title:'操作',
                            checkbox:false,
                            width:200,
                            formatter: function(value,row,index){
                                //写一下controller名称
                            	return "<a href='javascript:void(0)' onclick='javascript:window.delRow(\""+row.id+"\")'><span class='fa fa-trash'></span>删除</a>&nbsp;&nbsp<a href='javascript:void(0)' onclick='javascript:window.editRow(\""+row.id+"\")'><span class='fa fa-edit'></span>编辑</a>"
                            }
                        }
                    ]],
                    toolbar : [ {  
                            id : 'addLeafBtn',  
                            text : '添加职位',  
                            iconCls : 'noBg',  
                            handler : function() {  
                                showEditModal();  
                            }  
                        }
                        , {  
                            id : 'deleteSel',  
                            text : '删除',  
                            iconCls : 'noBg',   
                            handler : function() {  
                                delSel();  
                            }  
                        }
                    ],
                    onBeforeExpand : function(row) {  
                        // 此处就是异步加载地所在  
                        if (row) {  
                            appendTree(row);
                        };
                        return false;
                    }
                })
            });
        };
        $scope.find();
        // 删除 单条
        window.delRow = function (rowId){
            confirm("确认删除职位类型吗?", function () {
                var param = { "typeIds": rowId };
                $http.post("/ovu-park/backstage/talentShare/jobType/batchRemove", param, fac.postConfig).success(function (resp) {
                    if (resp.code == 0) {
                        $('#tt').treegrid('remove',rowId);
                    } else {
                        alert(resp.message);
                    }
                });
            });
        }
        // 全部删除
        window.delSel = function(){
            var selNodes = $('#tt').treegrid("getSelections");
            if(selNodes){
                var ids=[]
                for(var i=0;i<selNodes.length;i++){
                    ids.push(selNodes[i].id);
                }
                ids = ids.join(",");
                var params = { "typeIds":  ids };
                console.log(params);
                confirm("确认全部删除吗?", function () {
                    $http.post("/ovu-park/backstage/talentShare/jobType/batchRemove", params, fac.postConfig).success(function (resp) {
                        if (resp.code == 0) {
                            $scope.find();
                        } else {
                            alert(resp.message);
                        }
                    });
                });
            }
            
        }
        // 编辑  单条
        window.editRow = function(rowId){
            showEditModal(rowId)
        }
        // 添加节点
        function appendTree(row) {
            // 删除原来 子节点 
            var params = {
                parentId:row.id
            };
            // 获取 新的子节点
            $http.post("/ovu-park/backstage/talentShare/jobType/listChild", params, fac.postConfig).success(function (resp) {
                if (resp.code == 0) {
                    var childrenNodes = $('#tt').treegrid('getChildren', row.id);
                    if(childrenNodes.length>0){
                        for(var i=0;i<childrenNodes.length;i++){
                            $('#tt').treegrid('remove', childrenNodes[i].id);
                        }
                    };
                    if(resp.data.length>0){
                        var datas = resp.data;
                        for(var i=0;i<datas.length;i++){
                            datas[i].iconCls = "noBg";
                            if(datas[i].hasChild){
                                datas[i].state = "closed";
                            }
                        };
                        $('#tt').treegrid('append', {
                            parent: row.id,
                            data: datas,
                        });
                        $('#tt').treegrid('expand', row.id);
                    }else{
                        return;
                    }
                } else {
                    alert(resp.message);
                }
            });
        }
        // 新增编辑
        function showEditModal(id) {
            /* if (!fac.hasOnlyPark($scope.search)) {
                 return;
             }*/
            var jobType = {};
            if(id){
                var parentDom =  $('#tt').treegrid("getParent",id);
                var thisDom = $('#tt').treegrid("find",id);
                angular.copy(thisDom,jobType);
                if(parentDom){
                    jobType.parentId = parentDom.id;
                    jobType.parentName = parentDom.name;
                }
                // jobType.name = thisDom.name;
                jobType.id = id;
            }
            var modal = $uibModal.open({
                animation: false,
                size: 'md',
                templateUrl: '/view/talentShare/jobType/modal.editJobType.html',
                controller: 'editJobTypeCtrl',
                resolve: { jobType: jobType }
            });
            modal.result.then(function (node) {
                // 新增添加完执行
                $scope.find(1);
            }, function () {
            });
        };
        // 修改插件样式
        $(".datagrid-htable").css("height","40px;")
    });

    // 新增和编辑 控制器 
    app.controller('editJobTypeCtrl', function ($scope, $rootScope, $http, $uibModalInstance, $filter, fac, jobType) {
        var oldParentId = jobType.parentId;
        
        $scope.item = jobType;
        // 获取第一级职位
        $scope.loadJobType = function () {
            $http.post("/ovu-park/backstage/talentShare/jobType/list", {}, fac.postConfig).success(function (resp) {
                if (resp.code == 0) {
                    var datas = resp.data;
                    for(var i=0;i<datas.length;i++){
                        datas[i].iconCls = "noBg";
                        datas[i].text = datas[i].name;
                        if(datas[i].hasChild){
                            datas[i].state = "closed";
                        }
                    }
                    $('#jobTree').tree({
                        data:datas,
                        animate:true,
                        onBeforeExpand:function(row){
                            if(row){
                                loadData(row);
                            }
                            return false;
                        },
                        onClick:function(row){
                            if(row){
                                selJob(row);
                            }
                        }                        
                    });


                } else {
                    alert(resp.message);
                }
            });
        }
        $scope.loadJobType();
        
        // 获取子节点
        function loadData (row){
            var params = {
                "parentId":row.id
            }
            $http.post("/ovu-park/backstage/talentShare/jobType/list", params, fac.postConfig).success(function (resp) {
                if (resp.code == 0) {
                    var datas = resp.data;
                    var childrenNodes =$('#jobTree').tree('getChildren', row.target);
                    if(childrenNodes.length>0){
                        for(var i=0;i<childrenNodes.length;i++){
                            $('#jobTree').tree('remove', childrenNodes[i].target);
                        }
                    };
                    for(var i=0;i<datas.length;i++){
                        datas[i].iconCls = "noBg";
                        datas[i].text = datas[i].name;
                        if(datas[i].hasChild){
                            datas[i].state = "closed";
                        }
                    };
                    var node = $('#jobTree').tree("getSelected");
                    $('#jobTree').tree("append", {
                        parent: row.target,
                        data: datas,
                    });
                    $('#jobTree').tree('expand', row.target);
                    // return true;
                } else {
                    alert(resp.message);
                }
            });
        }
        // 选择子节点
        function selJob(row){
            $scope.item.parentName = row.text;
            $scope.$apply(function(){
                $scope.item.parentName = row.text;
            });
            $scope.item.parentId = row.id
        }
        // 清楚选中父级
        $scope.clearSel = function(){
            $scope.item.parentId = null;
            $scope.item.parentName = null;
        }
        // 保存
        $scope.save = function (form, item) {
            form.$setSubmitted(true);
            if (!form.$valid) {
                return;
            }
            var params = {
                userId: app.user.id,
                newParentId:item.parentId,
                parentId:item.parentId,
                oldParentId:oldParentId,
                name:item.name,
                id:item.id,
            }
            $http.post("/ovu-park/backstage/talentShare/jobType/save", params, fac.postConfig).success(function (resp) {
                if (resp.code == 0) {
                    var node = {

                    };
                    $uibModalInstance.close(item);
                    msg("保存成功!");
                } else {
                    alert(resp.message);
                }
            })
        }
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    });
})();
