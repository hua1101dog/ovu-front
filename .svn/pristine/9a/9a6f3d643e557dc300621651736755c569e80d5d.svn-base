
(function () {
    "use strict";
    var app = angular.module("angularApp");
    app.controller('houseRecordCtrl', function ($scope, $rootScope, $http, $filter, $uibModal, $timeout, fac) {
        document.title = "房屋档案管理";
        $scope.pageModel = {};
        $scope.search = {};
        $scope.config = {};
        $scope.selectList = []
        var selectedIndex;
        $scope.house_source = {}
        $scope.house_status = {}
        $scope.house_type = {}
        app.modulePromiss.then(function () {

            initDeptWatch();

            $scope.houseSearchtreeData = [];
            fac.initPage($scope, function () {


                fac.loadSelect($scope, "HOUSE_IS_DECORATION");
                fac.loadSelect($scope, "HOUSE_STATUS");
                fac.loadSelect($scope, "HOUSE_TYPE");




            })
        });
        $rootScope.$on("findPage", function () {
            $scope.find(1)
            $scope.pageModel.checked = false
            $scope.pageModel.data && $scope.pageModel.data.forEach(v => {
                v.checked = false
                v.houseInfo = false
                $('#InfoConts').css('display', 'none')
            })
           
        });

        //监控部门变化
        function initDeptWatch() {
            $scope.$watch('dept', function (dept, oldValue) {
                // if(!$scope.search){
                // 	$scope.search = {};
                // }
                $scope.search = {};
                if (dept.id != $scope.search.deptId) {
                    $scope.search.parkId = dept.parkId;
                    $scope.search.deptId = dept.id;

                    $rootScope.houseSearchtreeData && delete $rootScope.houseSearchtreeData;
                    $scope.houseSearchtreeData && delete $scope.houseSearchtreeData;
                    $scope.search.parkName && delete $scope.search.parkName;
                    $scope.search.houseId && delete $scope.search.houseId;
                    $scope.search.houseNo && delete $scope.search.houseNo;
                    $scope.search.groundNo && delete $scope.search.groundNo;

                }
                if ($scope.search.parkId) {
                    $http.post("/ovu-base/system/park/getWithPath", { ids: $scope.search.parkId }, fac.postConfig).
                        success(function (resp) {
                            if (resp.data && resp.data.length > 0) {
                                $scope.search.parkName = resp.data[0].fullPath;
                            }
                        })
                    $scope.loadHouseTree();
                }
                $scope.search.spaceName && delete $scope.search.spaceName

            }, true)
        }

        $scope.initSpace = function () {
            $http.get("/ovu-base/system/parkHouse/getSpacePropertyType").then(function (response) {

                if (response.status == 200) {
                    $scope.spaceRentList = response.data;

                }
            })
        }
        $scope.initSpace();



        $scope.find = function (pageNo) {
            var rmStatusStr
            var houseSourceStr
            var isDecoration
            if ($scope.house_status.value) {

                rmStatusStr = $scope.house_status.value.reduce((ret, n) => {
                    ret.push(n.dicCode)
                    return ret
                }, []).join(',')

            }
            if ($scope.house_source.value) {

                houseSourceStr = $scope.house_source.value.reduce((ret, n) => {
                    ret.push(n.id)
                    return ret
                }, []).join(',')

            }
            if ($scope.house_type.value) {

                isDecoration = $scope.house_type.value.reduce((ret, n) => {
                    ret.push(n.dicCode)
                    return ret
                }, []).join(',')

            }

            $('#InfoConts').css('display', 'none')
            if (!$scope.search.deptId) {
                $scope.pageModel.totalCount = 0;
                $scope.pageModel.totalPage = 1;
                $scope.pageModel.data = [];
                return;
            }

            angular.extend($scope.search, {
                currentPage: pageNo || $scope.pageModel.currentPage || 1,
                pageSize: $scope.pageModel.pageSize || 10,
                rmStatusStr: rmStatusStr,
                houseSourceStr: houseSourceStr,
                isDecoration: isDecoration
            });
            fac.getPageResult("/ovu-base/house/people/listByGrid", $scope.search, function (data) {

                data.data && data.data.forEach(function (v) {

                    v.name && (v.name = v.name.split(','));
                    v.idCard && (v.idCard = v.idCard.split(','));
                    v.ownerUnit && (v.ownerUnit = v.ownerUnit.split(','));
                    v.phone && (v.phone = v.phone.split(','));

                })
                $scope.pageModel = data;

            });
            //  }
        };

        $scope.loadHouseTree = function () {
            $http.post("/ovu-base/system/parkStage/treeNew.do", {

                parkId: $scope.search.parkId,
                level: "4",
            }, fac.postConfig).success(function (treeData) {
                if (treeData && treeData.length) {
                    $scope.flatData = fac.treeToFlat(treeData);
                    $scope.flatData.forEach(function (n) {
                        // n.floorId ? (n.isLeaf = true) : (n.isLeaf = false);
                        n.buildNo ? (n.isLeaf = true) : (n.isLeaf = false);
                    });
                    $scope.houseSearchtreeData = treeData;
                    if ($scope.houseSearchtreeData && $scope.houseSearchtreeData.length) {
                        $scope.houseSearchtreeData[0].state = {
                            selected: true
                        }
                        $scope.selectNode($scope.houseSearchtreeData[0], $scope.houseSearchtreeData[0])
                    }
                }



            });

        }

        $scope.selectNode = function (search, node) {
            if ($scope.curNode != node) {
                $scope.curNode && $scope.curNode.state && ($scope.curNode.state.selected = false);
            }
            node.state = node.state || {};
            //    node.state.selected = !node.state.selected;
            if (node.state.selected) {
                $scope.curNode = node;
                if (node.level == 1) {
                    $scope.search.buildId && delete $scope.search.buildId;
                    $scope.search.unitNo && delete $scope.search.unitNo;
                    $scope.search.groundNo && delete $scope.search.groundNo;

                    $scope.search.stageId = node.id;

                } else if (node.level == "2") {
                    $scope.search.unitNo && delete $scope.search.unitNo;
                    $scope.search.groundNo && delete $scope.search.groundNo;
                    $scope.search.stageId = node.parentId;
                    $scope.search.buildId = node.id;
                } else if (node.level == "3") {
                    $scope.search.groundNo && delete $scope.search.groundNo;
                    var build = $scope.getNode({ id: node.parentId });
                    if (build) {

                        $scope.search.stageId = build.parentId;
                    }
                    $scope.search.buildId = node.parentId;
                    $scope.search.unitNo = node.data.unitNo;

                } else if (node.level == "4") {
                    $scope.search.groundNo = node.textNo;

                    var parent = $scope.getNode({ id: node.parentId })
                    $scope.search.buildId = parent.data.buildId;
                    $scope.search.unitNo = parent.data.unitNo;
                    var grandfather = $scope.getNode({ id: parent.parentId })
                    $scope.search.stageId = grandfather.parentId

                }
            } else {
                delete $scope.search.stageId;
                delete $scope.search.buildId;
                delete $scope.search.unitNo;
                delete $scope.search.groundNo;
                $scope.search.houseNo && delete $scope.search.houseNo;
                $scope.search.houseId && delete $scope.search.houseId;

            }

            //如果选中楼栋节点，更新楼层下拉选项值
            if ($scope.search.groundNo) {
                $scope.getHouses(node.id);
            } else {

                delete $scope.search.groundNo;
            }
            //删除房屋信息
            delete $scope.houseNos;
            delete $scope.search.houseNo;
            delete $scope.search.houseId;

            $scope.find(1)
        }
        //查看房屋
        $scope.houseInfo = function (item, index, $event) {
            $scope.pageModel.data && $scope.pageModel.data.forEach(v => {
                if (item.id !== v.id) {
                    v.houseInfo = false
                }
            })
            item.houseInfo = !item.houseInfo
            $scope.houseIdCopy = item.houseId
            if (item.houseInfo) {
                $scope.showTable=true
                $scope.selectHouseId = item.id
                $scope.selectHouseName= item.houseName 
                $scope.showTableIndex=index
                $('#InfoConts').css('top', (index + 1) * ($('#houseRecord td').height() + 16) + $('#houseInfo-top').height()+20+48+$('#houseRecord td').height()+50 + 'px').css('display', 'block')
                $scope.changeIndex(10);


            } else {
                $scope.showTable=false
                $('#InfoConts').css('display', 'none')

            }

        }
        $(window).resize(function() {
          if( $scope.showTable){
              
            $('#InfoConts').css('top', ($scope.showTableIndex + 1) * ($('#houseRecord td').height() + 16) + $('#houseInfo-top').height()+20+48+$('#houseRecord td').height()+50 + 'px').css('display', 'block')
          }
        
        })

		/**
		 * 房屋查询 
		 * 数据改造start
		 */
        //在只知道节点id下，获取节点完整信息
        $scope.getNode = function (node) {
            var ret;
            var flag = false;
            //使用array模拟栈
            var stack = new Array();
            var nodes = $scope.houseSearchtreeData;
            for (let i = 0; i < nodes.length; i++) {
                stack.push(nodes[i]);
            }
            while (stack.length > 0 && !flag) {
                //出栈
                var curNode = stack.pop();
                if (curNode.id === node.id) {
                    ret = curNode;
                    flag = true;
                    break;
                }
                if (!flag && curNode.nodes && curNode.nodes.length > 0) {
                    for (let j = 0; j < curNode.nodes.length; j++) {
                        stack.push(curNode.nodes[j]);
                    }
                }
            }
            return ret;
        }

        //单元修改
        $scope.getHouses = function (id) {
            if (!$scope.search.groundNo) {
                delete $scope.houseNos;
                delete $scope.search.houseId;
                delete $scope.search.houseNo;
                delete $scope.search.groundNo;
                return;
            }

            $http.post("/ovu-base/system/parkHouse/getHousesByFloor?floorId=" + id).success(function (res) {
                if (res.code == 0) {
                    $scope.houseNos = res.data;
                }
            })
        }

        //房屋修改
        //修改后需要将数据发布到子controller
        $scope.houseNoChange = function () {
            //选择楼层时，不更新表格
            $scope.changeIndex(selectedIndex);
        }
		/**
		 *end 
		 */


        //编辑房屋信息
        $scope.showEditModal = function (item) {
            var copy = angular.extend({}, item);

            if (!copy.PARK_ID) {
                angular.extend(copy, { PARK_ID: $scope.search.parkId, isDecoration: $scope.isDecoration })
            }
            var modal = $uibModal.open({
                animation: false,
                templateUrl: '/view/houseRecord/modal.editHouse.html',
                size: 'lg',
                controller: 'editHouseRecordCtrl',
                controllerAs: 'vm',
                resolve: { item: copy }
            });
            modal.result.then(function () {
                $scope.find(1);
            }, function () {
                console.info('Modal dismissed at: ' + new Date());
            });


        }
        //应急报事
        $scope.addWorkunit = function () {
            $scope.selectList = $rootScope.getCheckData($scope.pageModel.data)
            if ($scope.selectList.length > 1) {
                alert('只可单个房屋报事')
                return
            }
            if (!$scope.selectList[0].ownerList || !$scope.selectList[0].ownerList.length) {
                alert('当前房屋无业主信息,不可报事')
                return
            }


            var copy = {
                EVENT_TYPE: 1,
                SOURCE: 1,
                is_equip: 2,
                PARK_ID: $scope.selectList[0].parkId,
                STAGE_ID: $scope.selectList[0].stageId,
                FLOOR_ID: $scope.selectList[0].buildId,
                ground_no: $scope.selectList[0].groundNo,
                CUSTOMER_PHONE: $scope.selectList[0].ownerList[0].phone,
                unit_no: $scope.selectList[0].unitNo,
                HOUSE_ID: $scope.selectList[0].id,
                CUSTOMER_ID: $scope.selectList[0].ownerList[0].id,
                CUSTOMER_NAME: $scope.selectList[0].ownerList[0].name,
                CUSTOMER_ADDR: $scope.selectList[0].stageName + $scope.selectList[0].buildName + $scope.selectList[0].unitName + $scope.selectList[0].floorName + $scope.selectList[0].houseName,

            };

            var modal = $uibModal.open({
                animation: false,
                size: 'lg',
                templateUrl: '/view/houseRecord/workunitEmergen.edit.modal.html',
                controller: 'workunitEmergenModalCtrl'
                , resolve: { item: copy }
            });
            modal.result.then(function () {
                $scope.find();
            }, function () {
                console.info('Modal dismissed at: ' + new Date());
            });





        }

        //拆分
        $scope.separate = function () {

            $scope.selectList = $rootScope.getCheckData($scope.pageModel.data)

            if ($scope.selectList.length > 1) {
                alert('只可单个房屋拆分')
                return
            }
            if (!$scope.selectList[0].area || !$scope.selectList[0].areaProperty || $scope.selectList[0].houseSource !== 1) {
                alert('只可拆分基础空间且有建筑面积和使用面积的空间')
                return
            }
            localStorage.removeItem('houseRecord_id');
            localStorage.setItem("houseRecord_id", $scope.selectList[0].id );

            $rootScope.target('houseRecord/spaceSeparate', "空间拆分", false, '', { houseId: $scope.selectList[0].id }, 'houseRecord/spaceSeparate');
        }
        //合并
        $scope.mergeSpace = function () {
            
            $scope.selectList = $rootScope.getCheckData($scope.pageModel.data)
            
            var ids = $scope.selectList.reduce(function (ret, n) { ret.push(n.id); return ret }, []).join(',');
            $http.post('/ovu-base/house/space/checkMerge',{houseIds:ids},fac.postConfig).success(res=>{
                if(res.code==0){
               
                    localStorage.removeItem('houseRecord_id');
                    localStorage.setItem("houseRecord_id", ids);
                    $rootScope.target('houseRecord/sapceMerge', "空间合并", false, '', { houseIds: ids }, 'houseRecord/sapceMerge');
                }else if(res.code==2){
                    localStorage.removeItem('houseRecord_id');
                    localStorage.setItem("houseRecord_id", ids);
                    confirm(res.msg+",是否继续合并?", function () {
                        $rootScope.target('houseRecord/sapceMerge', "空间合并", false, '', { houseIds: ids }, 'houseRecord/sapceMerge');
                    });
                }else{
                    alert(res.msg)
                }
            })
          
           
        }
        //导出
        $scope.exprot = function () {
        //     
        var url='/ovu-base/house/people/export?&'
        for(var i in $scope.search) {
            if( i!=='currentPage' && i!=='pageSize' && i!=='pageIndex' && i!=='parkName' && i!=='spaceName'){
                if($scope.search[i]){
                    url=url+i+'='+$scope.search[i]+'&'
                }
            }
          
       }
        
        
    
         window.location.href=url

        }
        //产权变更
        $scope.setPropertyChange = function () {
            $scope.selectList = $rootScope.getCheckData($scope.pageModel.data)
            if ($scope.selectList.length > 1) {
                alert('只可单个房屋变更')
                return
            }

            if($scope.selectList[0].rentsaleCharacter==0){
                alert('当前房屋租售性质为不可租售')
                return
            }

            var copy = angular.extend({}, $scope.selectList[0]);
            var modal = $uibModal.open({
                animation: false,
                size: 'lg',
                templateUrl: '/view/houseRecord/modal.property.change.html',
                controller: 'propertyChangeCtrl'
                , resolve: { item: copy }
            });
            modal.result.then(function () {
                $scope.find(1);
                $('#InfoConts').css('display', 'none')
            }, function () {
                console.info('Modal dismissed at: ' + new Date());
            });
        }
        //产权变更记录
        $scope.changeHistory = function (item) {
            var copy = angular.extend({}, item);


            var modal = $uibModal.open({
                animation: false,
                templateUrl: '/view/houseRecord/modal.property.changeHistroy.html',
                size: 'md',
                controller: 'changeHistroyCtrl',

                resolve: { item: copy }
            });
        }
        //房屋租赁记录
        $scope.rentHistory = function (item) {
            var copy = angular.extend({}, item);


            var modal = $uibModal.open({
                animation: false,
                templateUrl: '/view/houseRecord/modal.property.rentHistroy.html',
                size: 'md',
                controller: 'rentHistroyCtrl',

                resolve: { item: copy }
            });
        }
        //查看父子关系
        $scope.showSpace = function (item) {
            //拆合空间才可查看父子关系
            localStorage.removeItem('houseSource');
            localStorage.removeItem('houseRecord_id');
            localStorage.setItem("houseRecord_id", item.id);
            localStorage.setItem("houseSource", item.houseSource);
            $rootScope.target('houseRecord/showRelative', "空间信息", false, '', { houseId: item.id,houseSource:item.houseSource }, 'houseRecord/showRelative');
        }
        //出/退租
        $scope.rent = function () {
            //房屋状态为“空置中和自住中”的房屋可出租,房屋状态为“出租中”的房屋可退租，否则弹出提示框提醒维护房屋状态修改为“空置中或自住中”
            $scope.selectList = $rootScope.getCheckData($scope.pageModel.data)
            if ($scope.selectList.length > 1) {
                alert('只可单个出退租')
                return
            }
            if (!$scope.selectList[0].ownerList || !$scope.selectList[0].ownerList.length) {
                alert('当前房屋无业主信息,不可出退租')
                return
            }
            if($scope.selectList[0].rentsaleCharacter==0){
                alert('当前房屋租售性质为不可租售')
                return
            }

            if ($scope.selectList[0].rmStatus !== '出租中' && $scope.selectList[0].rmStatus !== '自住中' && $scope.selectList[0].rmStatus !== '空置中') {
                alert('维护房屋状态修改为“空置中或自住中或出租中')
                return
            }
            $http.get("/ovu-base/house/rent/checkHouse?id=" + $scope.selectList[0].id).success(function (res) {
                
                $scope.hasNoTen=false
                if (res.code == 0) {
                    //自住或空置中
                    // $scope.houseNos = res.data;

                    if (res.data == '自住或空置中') {
                        $scope.hasNoTen=true
                    } else {
                        $scope.hasNoTen=false
                    
                    }
                    var copy = angular.extend({ hasNoTen:$scope.hasNoTen }, $scope.selectList[0]);
                    var modal = $uibModal.open({
                        animation: false,
                        size: 'lg',
                        templateUrl: '/view/houseRecord/modal.rentHouse.html',
                        controller: 'rentHouseCtrl'
                        , resolve: { item: copy }
                    });
                    modal.result.then(function () {
                        $scope.find(1);
                        $('#InfoConts').css('display', 'none')
                    }, function () {
                        console.info('Modal dismissed at: ' + new Date());
                    });


                } else {
                    alert(res.msg)
                }

            })






        }
        //查看更多人员
        $scope.showMorePerson = function (item, $event) {
            $event.stopPropagation()

            var content = ''
            if (item.ownerList && item.ownerList.length) {
                content = '<div>业主：</div>'
                item.ownerList.forEach(v => {
                    content += "<div style='text-indent: 2em;'><div>姓名：" + v.name + "</div><div>手机号：" + v.phone + "</div></div>"
                })
            }
            if (item.relativeList && item.relativeList.length) {
                content = content + '<div>亲属：</div>'
                item.relativeList.forEach(v => {

                    content += "<div style='text-indent: 2em;'><div>姓名：" + v.relationName + "</div><div>手机号：" + v.relationTel + "</div></div>"
                })
            }
            if (item.ownerTenantList && item.ownerTenantList.length) {
                content = content + '<div>租户：</div>'
                item.ownerTenantList.forEach(v => {

                    content += "<div style='text-indent: 2em;'><div>姓名：" + v.tenantName + "</div><div>手机号：" + v.tenantTel + "</div></div>"
                })

            }
            layer.alert(content, {
                skin: "layui-layer-lan",
                closeBtn: 1,
                title: item.houseName,
            });
        }





        //批量删除

        $scope.delAll = function () {
            var flag = true
            //非基础空间 并且没有亲属、租户、业主
            $scope.selectList = $rootScope.getCheckData($scope.pageModel.data)
            for (var i = 0; i < $scope.selectList.length; i++) {
                if ($scope.selectList[i].ownerTenantList ||
                    $scope.selectList[i].ownerList || 
                    $scope.selectList[i].relativeList  ||
                    $scope.selectList[i].houseSource == 1
                ) {
                    flag = false
                    break;
                }

            }
            if (!flag) {
                alert('只可删除没有亲属、租户、业主的非基础空间')
                return
            }
            var ids = $scope.selectList.reduce(function (ret, n) { n.checked && ret.push(n.id); return ret }, []);
            delGroup(ids);
        };
        $scope.del = function (item) {
            delGroup([item.id]);
        }

        function delGroup(ids) {
            confirm("确认删除选中的" + ids.length + "条记录?", function () {
                $http.post("/ovu-base/system/parkHouse/removes", { "ids": ids.join() }, fac.postConfig).success(function (resp) {
                    if (resp.code == "0") {
                        $scope.find(1);
                        $('#InfoConts').css('display', 'none')
                        msg(resp.msg);
                    } else {
                        msg(resp.msg);
                    }
                })
            });
        }


        $scope.changeIndex = function (index) {
            $scope.active=index
            $scope.$broadcast('index' + index);
            selectedIndex = index;
            $scope.selectedIndex = selectedIndex
        };



    });
    //编辑房屋

    app.controller("editHouseRecordCtrl", function ($scope, $rootScope, $uibModal, $uibModalInstance, $http, fac, item) {
        $scope.item = item
        $scope.isReadonly = true
      
        $scope.initSpace = function () {
            $http.get("/ovu-base/system/parkHouse/getSpacePropertyType").then(function (response) {
               
                if (response.status == 200) {
                    $scope.spaceRentList = response.data;
                   
                   
                   
                }
            })
        }
       
        $scope.initSpace();
        fac.loadSelect($scope,null,function(){
            getData()
        }
        )
         function getData(){
            $scope.houseType = $rootScope.dicData['HOUSE_TYPE'];
            $scope.isDecoration = $rootScope.dicData['HOUSE_IS_DECORATION'];
            $scope.houseStatus= $rootScope.dicData['HOUSE_STATUS']
            $http.get('/ovu-base/house/people/houseAndRole?id='+item.id).success(function (res) {
                $scope.item=res.data
                if($scope.item.rmCat){
                    $scope.treeTypeList = $rootScope.dicData[$scope.item.rmCat];
                }
                $scope.item.rentsaleCharacter += '';
                $scope.item.owner = res.data.ownerList || []
                $scope.item.owner && $scope.item.owner.length && $scope.item.owner.forEach(v => {
                    var arr = []
                    var str=v.phone.split(',')
                    str.forEach(v => {
                        arr.push({phone:v})
                    })
                    v.phones = arr
                    v.ownerCars=v.ownerCars || []
                })
                $scope.item.relative = res.data.relativeList || []
                $scope.item.relative && $scope.item.relative.length && $scope.item.relative.forEach(v => {
                    var arr = []
                    var str=v.relationTel.split(',')
                    str.forEach(v => {
                        arr.push({phone:v})
                    })
                    v.phones = arr
                    v.ownerCars=v.ownerCars || []
                })
                $scope.item.tenant = res.data.ownerTenantList || []
                $scope.item.tenant && $scope.item.tenant.length && $scope.item.tenant.forEach(v => {
                    var arr = []
                    var str=v.tenantTel.split(',')
                    str.forEach(v => {
                        arr.push({phone:v})
                    })
                    v.phones = arr
                    v.ownerCars=v.ownerCars || []
                })
    
    
    
            })
         }
        $scope.addPhone = function (arr) {
            arr=arr|| []
            if (arr.length && arr.length == 2) {
                alert('最多可添加2个手机号')
                return
            }
            arr.push({phone: '' })
        }


        $scope.selectHouseType = function (item) {

            $scope.treeTypeList = $rootScope.dicData[item.rmCat];

        }
        //保存
        $scope.save = function (form) {
            form.$setSubmitted(true);
            if (!form.$valid) {
                return;
            }
             var params={
                parkhouse:{},
                ownerList:$scope.item.owner,
                ownerTenantList:$scope.item.tenant,
                ownerRelativeList:$scope.item.relative
             }
                delete params.parkhouse.ownerList 
                delete params.parkhouse.ownerTenantList
                delete params.parkhouse.relativeList 
                
                
                
                for(var k in $scope.item){
                    if(!angular.isArray($scope.item[k]) && k!=='updateTime'){
                    
                      params.parkhouse[k]=$scope.item[k]
                    }
                }
                params.ownerList.length && params.ownerList.forEach(v=>{
                    var arr = []
                    v.phones.forEach(v => {
                        arr.push(v.phone)
                    })
                    v.phone = arr.join(',')
                })
                params.ownerTenantList.length && params.ownerTenantList.forEach(v=>{
                    var arr = []
                    v.phones.forEach(v => {
                        arr.push(v.phone)
                    })
                    v.tenantTel = arr.join(',')
                })
                params.ownerRelativeList.length && params.ownerRelativeList.forEach(v=>{
                    var arr = []
                    v.phones.forEach(v => {
                        arr.push(v.phone)
                    })
                    v.relationTel = arr.join(',')
                })
               
            $http.post("/ovu-base/house/people/save",params).success(function(resp){
                if(resp.code == 0){
                    msg(resp.msg);
                    $uibModalInstance.close();
                }else{
                    alert(resp.msg)
                }
            })
        }




        //点击取消
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    });
    //产权变更
    app.controller("propertyChangeCtrl", function ($scope, $rootScope, $uibModal, $uibModalInstance, $http, fac, item) {
        $scope.item = item
        $scope.isReadonly = false
        $scope.item.owner = [{
            phones: [
                { phone: '' }
            ],
            ownerCars: []
        }]
        $scope.item.relative = []
        $scope.houseChange = {
            changeTime: $rootScope.today_global
        }

        $scope.addPhone = function (arr) {
            arr=arr|| []
            if (arr.length && arr.length == 2) {
                alert('最多可添加2个手机号')
                return
            }
            arr.push({phone: '' })
        }


        //保存
        $scope.save = function (form) {
            form.$setSubmitted(true);
            if (!form.$valid) {
                return;
            }

            $scope.item.owner.forEach(v => {
                // v.tenantTel=v.phones.join(',')
                var arr = []
                v.phones.forEach(v => {
                    arr.push(v.phone)
                })
                v.phone = arr.join(',')
            })
            $scope.item.relative.length && $scope.item.relative.forEach(v => {
                // v.tenantTel=v.phones.join(',')
                var arr = []
                v.phones.forEach(v => {
                    arr.push(v.phone)
                })
                v.relationTel = arr.join(',')
            })
            $scope.saveData = {

                'houseChange': $scope.houseChange,
                'houseId': item.id,
                ownerList: $scope.item.owner,
                ownerRelativeList: $scope.item.relative

            };



            $http.post("/ovu-base/house/change/save", $scope.saveData).success(function (resp) {
                if (resp.code == 0) {
                    msg(resp.msg);
                    $uibModalInstance.close();
                }else{
                    alert(resp.msg)
                }
            })
        }




        //点击取消
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    });
    //产权变更记录
    app.controller("changeHistroyCtrl", function ($scope, $rootScope, $uibModal, $uibModalInstance, $http, fac, item) {
        $scope.item = item
        $http.get('/ovu-base/house/change/historyList?houseId=' + item.id).success(function (res) {

            $scope.dataList = res.data




        })







        //点击取消
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    });
    //出退租
    app.controller("rentHouseCtrl", function ($scope, $rootScope, $uibModal, $uibModalInstance, $http, fac, item) {
        $scope.item = item
      
        $scope.myIndex = 0
        $scope.ownerTenantList = [{
            phones: [
                { phone: '' }
            ],
            ownerCars: []
        }]
        
       $scope.minDate='1900-01-01'

        $scope.addPhone = function (arr) {
            arr=arr|| []
            if (arr.length && arr.length == 2) {
                alert('最多可添加2个手机号')
                return
            }
            arr.push({ phone: '' })
        }
        $http.get('/ovu-base/house/rent/list?houseId=' + item.id).success(function (res) {

            $scope.ownerTenantList = res.data
            if ($scope.ownerTenantList && $scope.ownerTenantList.length) {
                $scope.ownerTenantList.forEach(v=>{
                    v.beginTime=v.beginTime.substring(0, 10)
                    v.endTime=v.endTime.substring(0, 10)
                    var arr = v.tenantTel.split(',')
                    v.phones=[]
                    arr.forEach(a => {
                        v.phones.push({phone:a})
                    })
                  
                })
            } else {
                $scope.ownerTenantList = [{
                    phones: [
                        { phone: '' }
                    ],
                    ownerCars: []
                }]
            }



        })




        //保存
        $scope.save = function (form) {
            form.$setSubmitted(true);
            if ($scope.myIndex==0) {

                if (!form.$valid) {
                    return;
                }
            } else {

            }

            $scope.saveData = {

                'ownerTenantList': $scope.ownerTenantList,
                'houseId': item.id

            };

            var url = ''
            if ($scope.myIndex==0) {
                url = '/ovu-base/house/rent/in'
                var flag = true
                //非基础空间 并且没有亲属、租户、业主
              
                for (var i = 0; i < $scope.ownerTenantList.length; i++) {
                    if ($scope.ownerTenantList[i].beginTime>$scope.ownerTenantList[i].endTime
                    ) {
                        flag = false
                        break;
                    }
    
                }
                if (!flag) {
                    alert('开始时间不能大于结束时间')
                    return
                }
                $scope.ownerTenantList.forEach(v => {


                    var arr = []
                    v.phones.forEach(v => {
                        arr.push(v.phone)
                    })
                    v.tenantTel = arr.join(',')
                })
            } else {
                url = '/ovu-base/house/rent/out'
                var arr = []
                $scope.ownerTenantList.forEach(v => {
                    if (v.checked) {
                        arr.push(v)

                    }
                })
                var flag = true
                for (var i = 0; i < arr.length; i++) {
                    if (!arr[i].tureEndTime) {
                        flag = false
                        break;
                    }

                }
                if (arr.length == 0) {
                    alert('请选择租户')
                    return

                }
                if (!flag) {

                    return
                }

                $scope.saveData.ownerTenantList = arr
            }

            confirm("当前操作只保存当前页面，请核对业主及亲属的相关信息，信息变动请及时更新，并确认", function () {

                $http.post(url, $scope.saveData).success(function (resp) {
                    if (resp.code == 0) {
                        msg(resp.msg);
                        $uibModalInstance.close();
                    }else{
                        alert(resp.msg)
                    }
                })
            });



        }




        //点击取消
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    });

    //租赁记录 
    app.controller("rentHistroyCtrl", function ($scope, $rootScope, $uibModal, $uibModalInstance, $http, fac, item) {
        $scope.item = item

        $http.get('/ovu-base/house/rent/historyList?houseId=' + item.id).success(function (res) {

            $scope.dataList = res.data




        })







        //点击取消
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    });



    //工单模块 报事查询
    app.controller("workunitCtrl", function ($scope, $rootScope, $http, $filter, $uibModal, fac) {
        $scope.pageModel = {};
        //    
        $scope.$on('index4', function (event, data) {
            $scope.search = { houseId: $scope.$parent.$parent.selectHouseId };
            $scope.changeWorkUnit(3)
        });


        var url = '';

        $scope.find = function (pageNo) {
            $scope.$parent.search.pageSize && delete $scope.$parent.search.pageSize
            $scope.$parent.search.currentPage && delete $scope.$parent.search.currentPage
            delete $scope.$parent.search.pageIndex
            $scope.$parent.search.totalCount && delete $scope.$parent.search.totalCount
            angular.extend($scope.search, { currentPage: pageNo || $scope.pageModel.currentPage || 1, pageSize: $scope.pageModel.pageSize || 10 }, $scope.$parent.search);
            if (!$scope.search.deptId) {
                $scope.pageModel.totalCount = 0;
                $scope.pageModel.totalPage = 1;
                $scope.pageModel.data = [];
                alert("请选择部门");
                return;
            }
            var search = angular.copy($scope.search);
            delete search.deptId;
            if ($scope.workUnitIndex == 1) {
                url = '/ovu-pcos/pcos/building_search/workunit/sourceunit/queryList.do'
            } else if ($scope.workUnitIndex == 2) {
                url = '/ovu-pcos/pcos/building_search/workunit/decoration/queryList.do'
            } else {
                url = '/ovu-pcos/pcos/building_search/workunit/workunitSearche/queryList.do'
            }
            fac.getPageResult(url, search, function (res) {
                $scope.pageModel = res;
            });

        };
        $scope.changeWorkUnit = function (index) {
            $scope.search.unitStatus && delete $scope.search.unitStatus
            $scope.search.params && delete $scope.search.params
            $scope.search.workunitType && delete $scope.search.workunitType
            $scope.search.pageSize && delete $scope.search.pageSize
            $scope.search.currentPage && delete $scope.search.currentPage
            $scope.search.pageIndex && delete $scope.search.pageIndex
            $scope.search.totalCount && delete $scope.search.totalCount

            $scope.workUnitIndex = index
            $scope.find(1)
        }
        // 显示报装证件
        $scope.showReportCertif = function (item) {
            var modal = $uibModal.open({
                animation: false,
                templateUrl: '/view/houseSearch/ownerInfo/workunit/modal.reportCertif.html',
                size: 'lg',
                controller: 'ReportCertifCtrl',
                controllerAs: 'vm',
                resolve: { item: item }
            });



        };


    })

    // 报装证件
    app.controller('ReportCertifCtrl', function ($scope, $rootScope, $http, $filter, $uibModal, $uibModalInstance, fac, item) {
        var vm = $scope.vm = this;
        vm.item = item;
        vm.showPhoto = $rootScope.showPhoto;
        vm.processImgUrl = $rootScope.processImgUrl;

        // 请求所有的报装文件
        $http.post('/ovu-pcos/pcos/presFile/list.do', {
            pageIndex: 0,
            pageSize: 100
        }, fac.postConfig).then(function (res) {
            var data = res.data.data;

            if (!item.certificateUrl || !item.certificateId) {
                msg('该报装请求没有报装证件');
            } else {
                var arr = item.certificateUrl.split(',');

                var ids = item.certificateId.split(',');
                arr = arr.map(function (url, index) {
                    var file = data.filter(function (v) {
                        return v.id === parseInt(ids[index]);
                    })[0];
                    if (file) {
                        return [file.fileName, url];
                    } else {
                        return ['该类文件已删除', ''];
                    }
                }).filter(function (v) {
                    return v[1];
                });
                if (!arr.length) {
                    msg('该报装请求没有报装证件');
                    return;
                }
                // 默认显示第一张图片
                arr[0].active = true;
                vm.imgUrl = vm.processImgUrl(arr[0][1]);

                //展示多张图片 2018/09/12
                var urls = arr[0][1].split(";");
                vm.imgUrls = []
                urls.forEach(function (v) {
                    vm.imgUrls.push(vm.processImgUrl(v));
                })
                vm.imgUrlsActive = vm.imgUrls[0];

                vm.certifList = arr;




            }
        });

        vm.switchImage = function (item) {
            vm.imgUrlsActive = item.item;
        };

        

        vm.clickPicTitle = function (item, list) {
            list.forEach(function (v) {
                v.active = false;
            });
            item.active = true;
            vm.imgUrl = vm.processImgUrl(item[1]);

            //展示多张图片 2018/09/12
            var urls = item[1].split(";");
            vm.imgUrls = []
            urls.forEach(function (v) {
                vm.imgUrls.push(vm.processImgUrl(v));
            })
            vm.imgUrlsActive = vm.imgUrls[0];

            console.log('1====>', vm.imgUrl)
        };

        vm.cancel = function () {

            $uibModalInstance.dismiss('cancel');
        };
    })


    //设备模块
    app.controller("equipmentCtrl", function ($scope, $rootScope, $http, $filter, $uibModal, fac) {
        $scope.eq_pageModel = {};

        $scope.$on('index5', function (event) {
            $scope.search = { houseId: $scope.$parent.$parent.selectHouseId };
            $scope.find(1);
        });

        $scope.find = function (pageNo) {
            $scope.$parent.search.pageSize && delete $scope.$parent.search.pageSize
            $scope.$parent.search.currentPage && delete $scope.$parent.search.currentPage
            delete $scope.$parent.search.pageIndex
            $scope.$parent.search.totalCount && delete $scope.$parent.search.totalCount
            angular.extend($scope.search, { currentPage: pageNo || $scope.eq_pageModel.currentPage || 1, pageSize: $scope.eq_pageModel.pageSize || 10 }, $scope.$parent.search);
            if (!$scope.search.deptId) {
                $scope.eq_pageModel.totalCount = 0;
                $scope.eq_pageModel.totalPage = 1;
                $scope.eq_pageModel.data = [];
                alert("请选择部门");
                return;
            }
            fac.getPageResult("/ovu-pcos/pcos/building_search/equip_search/queryList.do", $scope.search, function (res) {
                $scope.eq_pageModel = res;
            });
        };
    })



    //车辆模块
    app.controller("carCtrl", function ($scope, $rootScope, $http, $filter, $uibModal, fac) {
        $scope.car_pageModel = {};

        $scope.$on('index3', function (event) {
            $scope.search = { houseId: $scope.$parent.$parent.selectHouseId};
            $scope.find(1);
        });

        $scope.find = function (pageNo) {
            $scope.$parent.search.pageSize && delete $scope.$parent.search.pageSize
            $scope.$parent.search.currentPage && delete $scope.$parent.search.currentPage
            delete $scope.$parent.search.pageIndex
            $scope.$parent.search.totalCount && delete $scope.$parent.search.totalCount
            angular.extend($scope.search, { currentPage: pageNo || $scope.car_pageModel.currentPage || 1, pageSize: $scope.car_pageModel.pageSize || 10 }, $scope.$parent.search);


            fac.getPageResult("/ovu-base/owner/car/list", $scope.search, function (res) {
                $scope.car_pageModel = res;
            });
        };
    })
    //投诉模块
    app.controller("complaintsCtrl", function ($scope, $rootScope, $http, $filter, $uibModal, $location, fac) {
        $scope.complaint_pageModel = {};

        $scope.complainType = 1
        $scope.$on('index6', function (event) {
            $scope.search = {};
            $scope.find(1);
        });

        var url = ''
        $scope.find = function (pageNo) {




            if (!$scope.complainType) {
                if ($location.$$url == '/houseSearch/houseSearch') {
                    alert("请选择投诉类型");
                }

                return;
            }

            $scope.search.communityId = $scope.$parent.search.parkId
            $scope.search.houseId = $scope.$parent.$parent.selectHouseId

            if ($scope.complainType == 1) {
                $scope.search.communityId = $scope.$parent.search.parkId
                $scope.search.pageSize && delete $scope.search.pageSize
                $scope.search.currentPage && delete $scope.search.currentPage
                angular.extend($scope.search, { page: pageNo - 1, rows: $scope.complaint_pageModel.pageSize || 10, type: 1 });
                url = '/ovu-pcos/api/ilidao/getComplain'
            } else {
                $scope.search.rows && delete $scope.search.rows
                $scope.search.page && delete $scope.search.page
                angular.extend($scope.search, { currentPage: pageNo || $scope.complaint_pageModel.currentPage || 1, pageSize: $scope.complaint_pageModel.pageSize || 10 });
                url = '/ovu-pcos/pcos/reportstat/other/statComplainWorkUnit'
            }

            fac.getPageResult(url, $scope.search, function (res) {
                $scope.complaint_pageModel = res;

            });
            //是否显示工单
            $scope.isShowWorkUnit = function (flag, id) {
                if (flag == 1) {
                    return
                } else {
                    $rootScope.showWorkUnitDetail(id)
                }
            }
        };
    })
    //邻里模块
    app.controller("neighborhoodCtrl", function ($scope, $rootScope, $http, $filter, $uibModal, $location, fac) {
        $scope.nei_pageModel = {};

        $scope.$on('index7', function (event) {
            $scope.search = {};
            $scope.find(1);
        });

        $scope.find = function (pageNo) {

            if (!$scope.$parent.search.deptId) {
                $scope.nei_pageModel.totalCount = 0;
                $scope.nei_pageModel.totalPage = 1;
                $scope.nei_pageModel.data = [];
                alert("请选择部门");
                return;
            }


            $scope.search.communityId = $scope.$parent.search.parkId
            $scope.search.houseId = $scope.$parent.$parent.selectHouseId
            angular.extend($scope.search, { page: pageNo - 1, rows: $scope.nei_pageModel.pageSize || 10 });

            fac.getPageResult("/ovu-pcos/api/ilidao/getRelation", $scope.search, function (res) {
                $scope.nei_pageModel = res;
            });
        };
    })
    //活动模块
    app.controller("activeCtrl", function ($scope, $rootScope, $http, $filter, $uibModal, $location, fac) {
        $scope.active_pageModel = {};

        $scope.$on('index8', function (event) {

            $scope.find(1);
        });

        $scope.find = function (pageNo) {

            $scope.search.communityId = $scope.$parent.search.parkId
            $scope.search.houseId = $scope.$parent.$parent.selectHouseId
            angular.extend($scope.search, { page: pageNo - 1, rows: $scope.active_pageModel.pageSize || 10 });

            fac.getPageResult("/ovu-pcos/api/ilidao/getActivity", $scope.search, function (res) {
                $scope.active_pageModel = res;
            });
        };
    })
    //满意度模块
    app.controller("satisfactionCtrl", function ($scope, $rootScope, $http, $filter, $uibModal, $location, fac) {
        $scope.satisfac_pageModel = {};

        $scope.$on('index9', function (event) {
            $scope.search = { houseId: $scope.$parent.$parent.selectHouseId };
            $scope.find(1);
        });

        $scope.find = function (pageNo) {
            // $scope.$parent.search.houseId='c86badef9e054e94895b210d22c1d3f4'
            if (!$scope.$parent.search.deptId) {
                $scope.satisfac_pageModel.totalCount = 0;
                $scope.satisfac_pageModel.totalPage = 1;
                $scope.satisfac_pageModel.data = [];
                alert("请选择部门");
                return;
            }
            if (!$scope.$parent.search.houseId) {

                if ($location.$$url == '/houseSearch/houseSearch') {
                    alert("请选择房号");
                }
                return;
            }
            $scope.search.communityId = $scope.$parent.search.parkId
            $scope.search.houseId = $scope.$parent.search.houseId

            angular.extend($scope.search, { page: pageNo - 1, rows: $scope.satisfac_pageModel.pageSize || 10 });
            fac.getPageResult("/ovu-pcos/api/ilidao/getSpvote", $scope.search, function (res) {
                $scope.satisfac_pageModel = res;

            });
        };
        //查看详情
        $scope.showDetail = function (item) {
            var copy = angular.extend({}, item);
            copy.communityId = $scope.search.communityId
            copy.houseId = $scope.$parent.search.houseId

            var modal = $uibModal.open({
                animation: false,
                templateUrl: '/view/houseSearch/ownerInfo/modal.SatisfaDetai.html',
                size: 'lg',
                controller: 'showSatisfaDetailCtrl',
                controllerAs: 'vm',
                resolve: { item: copy }
            });

        }
    })
    //查看满意度调查
    app.controller("showSatisfaDetailCtrl", function ($scope, $uibModal, $uibModalInstance, $http, fac, item) {

        $http.get('/ovu-pcos//api/ilidao/getSpvoteAll', { params: item }).success((res) => {
            $scope.dataList = res.data
        })

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };



    })
    //备忘录模块
    app.controller("ownermemoCtrl", function ($scope, $rootScope, $http, $filter, $uibModal, $location, fac) {
        $scope.pageModel_memo = {};

        $scope.$on('index10', function (event) {
            $scope.search = {};
            $scope.find(1);
        });

        $scope.find = function (pageNo) {
           
            if (!$scope.$parent.search.deptId) {
                $scope.pageModel_memo.totalCount = 0;
                $scope.pageModel_memo.totalPage = 1;
                $scope.pageModel_memo.data = [];
                alert("请选择部门");
                return;
            }

            $scope.search.communityId = $scope.$parent.search.parkId
            $scope.search.houseId = $scope.$parent.$parent.selectHouseId

            angular.extend($scope.search, { currentPage: pageNo || $scope.pageModel_memo.currentPage || 1, pageSize: $scope.pageModel_memo.pageSize || 10 });
            fac.getPageResult("/ovu-base/ownermemo/page", $scope.search, function (res) {
                $scope.pageModel_memo = res;

            });
        };
        // 新增or 编辑
        $scope.showMemoEditModal = function (item) {
            var copy = angular.extend({}, item);

            if (!copy.houseId) {
                angular.extend(copy, { houseId: $scope.search.houseId })
            }


            var modal = $uibModal.open({
                animation: false,
                templateUrl: '/view/houseSearch/ownerInfo/modal.ownermemo.html',
                size: 'md',
                controller: 'showOwnermemoCtrl',
                controllerAs: 'vm',
                resolve: { item: copy }
            });
            modal.result.then(function () {
                $scope.find();
            }, function () {

            });

        }
        $scope.delete = function (id) {
            confirm("确认删除该条记录吗?", function () {
                $http.get("/ovu-base/ownermemo/delete/" + id).success(function (res) {
                    if (res.msg) {
                        $scope.find();
                    }
                });
            })
        }
    })
    //新增编辑备忘录
    app.controller("showOwnermemoCtrl", function ($scope, $uibModal, $uibModalInstance, $http, fac, item) {

        //保存
        $scope.item = item
        $scope.save = function (form) {
            form.$setSubmitted(true);
            if (!form.$valid) {
                return;
            }



            $http.post("/ovu-base/ownermemo/edit", $scope.item).success(function (resp) {
                if (resp.code == 0) {
                    msg(resp.msg);
                    $uibModalInstance.close();
                }else{
                    alert(resp.msg)
                }
            })
        }
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };










    })
})();
