/**
 * Created by Administrator on 2017/7/20.
 */
(function () {
    "use strict";
    var app = angular.module("angularApp");
    app.controller('parkCtl', function ($scope, $rootScope, $http, $filter, $uibModal, fac) {
        document.title = "OVU-项目架构";
        window.$rootScope = $rootScope;
        window.$scope = $scope;
        $scope.search = {isAll:1};
        $scope.pageModel = {};
        //$scope.config ={edit:false};
        if($rootScope.hasPower("编辑")){
            $scope.spaceConfig ={edit:true};
        }

        app.modulePromiss.then(function() {
            loadTypeTree();
            $scope.find(1);
        })

        function getParkTree() {
            $scope.$emit('refreshParkCache');
        }

        $scope.find = function (pageNo) {
            $.extend($scope.search, {currentPage: pageNo || 1, pageSize: $scope.pageModel.pageSize || 10});
            fac.getPageResult("/ovu-base/system/park/listByGrid", $scope.search, function (data) {
                $scope.pageModel = data;
            });
        };

        function loadTypeTree() {
            $rootScope.getDomainParkTree(true).then(function (data) {
                $scope.parkTreeData = data;
            });
        }

        $scope.showModal = function (park) {
            if (park) {
                var parent = getNodeById(park.parentId);
                parent && (park.parentPath = (parent.fullPath || parent.text));
            }
            var copy = angular.extend({parkType: 1}, park);
            var modal = $uibModal.open({
                animation: false,
                size: 'lg',
                templateUrl: 'space/modal.editPark.html',
                controller: 'editParkModalCtrl',
                resolve: {
                    park: function () {
                        return copy;
                    }
                }
            });
            modal.result.then(function () {
                $scope.$emit('refreshParkCache');
                $scope.find();
            }, function () {
                console.info('Modal dismissed at: ' + new Date());
            });

            modal.rendered.then(function () {
                $scope.showCusmap1(copy);

                // wjlong BEGIN添加地图搜索功能
                AMap.plugin(['AMap.Autocomplete'], function () {
                    // 如果是编辑界面 获取已选城市 搜索范围锁定在该城市  选中了武汉市 搜索建设银行 优先显示武汉的建设银行
                    var city = '';
                    var arr = copy.city ? copy.city.split(',') : '';
                    if (arr && arr[1]) {
                        city = arr[1];
                    }
                    var autoOptions = {
                        city: city, //城市，默认全国
                        input: "map-keyword" //使用联想输入的input的id
                    };
                    var autocomplete = new AMap.Autocomplete(autoOptions);

                    // 搜索点 每次打点之前 先把以前搜索出来的点清除了
                    var searchMarkers = [];

                    function addSearchMarker(map, position, title) {
                        map.remove(searchMarkers);
                        var marker = new AMap.Marker({
                            position: position,
                            title: title,
                            map: copy.map,
                            icon: '/res/img/mark_bs/mark_bs5.png'
                        });
                        searchMarkers.push(marker);
                    }

                    function autoSelect(e) {
                        var location = e.poi.location;
                        var adcode = e.poi.adcode;
                        // setCity 有一些点不能正常设置  搜索王元(公交站) adcode 320812 不能正常设置
                        // copy.map.setCity(e.poi.adcode);
                        // console.log(e.poi);
                        if (location) {
                            copy.map.setCenter(location);
                            var position = [location.lng, location.lat];
                            var title = e.poi.name;
                            addSearchMarker(copy.map, position, title);
                        } else if (e.poi.adcode) {
                            copy.map.setCity(adcode);
                            console.log('该poi点没有具体的经纬度坐标,不能添加marker点,搜索的极有可能是一个市或者更大的范围');
                        }

                    }

                    AMap.event.addListener(autocomplete, "select", autoSelect);
                    AMap.event.addListener(autocomplete, "choose", function (e) {
                        $('#map-keyword').one('keydown', function (event) {
                            if (event.keyCode == 13) {
                                $('.amap-sug-result').css({
                                    visibility: 'hidden',
                                    display: 'none'
                                });
                                autoSelect(e);
                            }
                        })
                    });
                    // 如果选择了行政区，就设置所在城市
                    $rootScope.$on('选择了行政区', function (e, data) {
                        var arr = data.split(',');
                        if (arr[1]) {
                            autocomplete.setCity(arr[1]);
                        }
                    });
                });
                // wjlong END
            });

            modal.opened.then(function () {
                console.log("Modal opened");
            });
        }


        $scope.addTopNode = function () {
            $scope.parkTreeData.push({
                parkType: 0,
                state: {edit: true},
                copy: {
                    parkType: 0,
                    SORT: $scope.parkTreeData.length
                }
            });
        }

        $scope.addSon = function (node) {
            $http.get("/ovu-base/system/park/directRealState.do?pid=" + node.id).then(function (resp) {
                if (resp.data.data > 0) {
                    alert("此空间下已有实体项目，不可再添加子空间！");
                } else {
                    node.nodes = node.nodes || [];
                    node.state = node.state || {};
                    node.state.expanded = true;
                    node.nodes.push({
                        parkType: 0,
                        parentId: node.id,
                        state: {edit: true},
                        copy: {parkType: 0, parentId: node.id, SORT: node.nodes.length}
                    });
                }
            });
        }

        function getNodeById(did) {
            if (!did) {
                return false;
            }

            var node = fac.getNodeById($scope.parkTreeData,did);
            return node;
        }

        $scope.selectNode = function (search,node) {
            if (node.state.selected) {
                $scope.curNode = node;
            } else {
                delete $scope.curNode;
            }
            $scope.find(1);
        }

        //删除实体项目
        $scope.del = function (park) {
            confirm("确定删除 " + park.parkName + "?", function () {
                $http.post("/ovu-base/system/park/removes", {ids: park.id}, fac.postConfig).success(function (resp) {
                    if (resp.code == 0) {
                        $scope.$emit('refreshParkCache');
                        $scope.find();
                        msg(resp.msg);
                    } else {
                        alert(resp.msg);
                    }
                });
            })
        }

        //删除项目分类
        $scope.delNode = function (node) {
            if (node.nodes && node.nodes.length) {
                alert("此节点有下级节点,不能删除！");
            } else {
                confirm("确定删除 " + node.text + "?", function () {
                    //zg begin
                    //$http.post("/ovu-base/system/park/removes.do", {ids: node.did}, fac.postConfig).success(function (resp) {
                    $http.post("/ovu-base/system/park/removes", {ids: node.id}, fac.postConfig).success(function (resp) {
                        if (resp.code == 0) {
                            getParkTree();
                            if ($scope.curNode == node) {
                                delete $scope.curNode;
                            }
                            var parent = getNodeById(node.parentId);
                            if (parent) {
                                parent.nodes.splice(parent.nodes.indexOf(node), 1)
                            } else {
                                $scope.parkTreeData.splice($scope.parkTreeData.indexOf(node), 1)
                            }
                        } else {
                            //alert(resp.error);
                            alert(resp.msg);
                        }
                    });
                    //zg end
                })
            }
        }
        $scope.save = function (node) {
            if (!node.copy.text) {
                alert('名称不能为空');
                return;
            }

            var filterData; //需要过滤的数据
            if (node.parentId && node.parentId != 0) {
                //子分类(在同级节点是否重复)
                var pnode = fac.treeToFlat($scope.parkTreeData).find(function (n) {
                    return (n.id == node.parentId)
                });
                filterData = pnode.nodes;
            } else {
                //第一级
                filterData = $scope.parkTreeData;
            }
            var findData = filterData.find(function (n) {
                return (n.id != node.copy.id && n.text == node.copy.text)
            });
            if (findData) {
                alert('分类名称已存在');
                return;
            }


            var park = {};
            park.sort = node.copy.SORT;
            park.id = node.copy.id;
            park.parentId = node.copy.parentId;
            park.parkType = node.copy.parkType;
            park.parkName = node.copy.text;
            park.parkNo = node.copy.code;
            $http.post("/ovu-base/system/park/save", park, fac.postConfig).success(function (resp) {
                if (resp.code == 0) {
                    msg(resp.msg);
                    node.id = resp.data.id;
                    node.text = resp.data.parkName;
                    node.code = resp.data.parkNo;
                    node.parentId = resp.data.parentId;
                    node.pid = resp.data.parentId;
                    node.sort = resp.data.sort;
                    node.parkType = resp.data.parkType;
                    node.state.edit = false;
                    getParkTree();
                } else {
                    alert(resp.msg);
                }
            });
            //zg end
        }
        $scope.undo = function (node) {
            if (node.id) {
                node.state.edit = false;
            } else {
                var parent = getNodeById(node.parentId);
                if (parent) {
                    parent.nodes.splice(parent.nodes.indexOf(node), 1)
                } else {
                    $scope.parkTreeData.splice($scope.parkTreeData.indexOf(node), 1)
                }
            }
        }
        $scope.editNode = function (node) {
            node.copy = angular.extend({}, node);
            node.copy.parkType = '0';
            node.copy.SORT = $scope.parkTreeData.length;
            node.state = node.state || {};
            node.state.edit = true;
        }

        // 实例化点标记
        var markers = [];
        var ovu2DMap;
        var map2dDraw;
        $rootScope.showCusmap1 = function (copy) {
            var mapConfig = {resizeEnable: true, zoom: 15};
            if (copy.map) {
                mapConfig.zoom = copy.map.getZoom();
            }
            if (copy.trPosition && copy.blPosition) {
                var topRight = copy.trPosition.split(",");
                var bomLeft = copy.blPosition.split(",");
                var centerLng = (Number(topRight[0]) + Number(bomLeft[0])) / 2;
                var centerLat = (Number(topRight[1]) + Number(bomLeft[1])) / 2;
                mapConfig.center = [centerLng.toFixed(6), centerLat.toFixed(6)];
                //有图片，没有鸟瞰图时，展示图片
                if (copy.parkIcon && !copy.airscapePath) {
                    var imageLayer = new AMap.ImageLayer({
                        url: $rootScope.processImgUrl(copy.parkIcon, 'origin'),
                        bounds: new AMap.Bounds(
                            bomLeft,
                            topRight
                        ),
                        zooms: [15, 18]
                    });
                    mapConfig.layers = [
                        new AMap.TileLayer(),
                        imageLayer
                    ]
                }
            }
            copy.map = new AMap.Map('container', mapConfig);
            addMarker(copy);

            //-------------------------------------------------------------------------------
            //-------------------------------------------------------------------------------
            //画出图层
            //地图需要参数
            var topRight = copy.trPosition ? copy.trPosition.split(",") : undefined;
            var bomLeft =  copy.blPosition ? copy.blPosition.split(",") : undefined;
            var points;
            if(topRight && bomLeft){
                var centerLng = (Number(topRight[0]) + Number(bomLeft[0])) / 2;
                var centerLat = (Number(topRight[1]) + Number(bomLeft[1])) / 2;
                points = [[Number(bomLeft[0]),Number(bomLeft[1])],
                    [Number(topRight[0]),Number(topRight[1])]];
            }
            
            var width = copy.mapWidth ? copy.mapWidth :2000;
            var height = copy.mapHeight ? copy.mapHeight :2000;
            var zoom = copy.mapZoom ? copy.mapZoom :2.5;
            /* $rootScope.processImgUrl(copy.parkIcon, 'origin'),*/
            var mapUrl = copy.airscapePath;
            if(mapUrl){
                if(mapUrl.indexOf("http") == -1){
                    mapUrl = "/ovu-base" + mapUrl;
                }
                ovu2DMap = new OvuMap();
                map2dDraw = new Draw2DMap(width,height,zoom,undefined);
                ovu2DMap.loadTheme();
                ovu2DMap.loadJson(mapUrl);
                var draw = function (argument) {
                    AMap.Util.requestAnimFrame(draw);
                    if (ovu2DMap.mapJson === undefined) {
                        return;
                    }
                    var _curFloor = ovu2DMap.mapJson;
                    //地图绘制
                    map2dDraw.draw( _curFloor,copy.map)
                    //图层刷新
                    copy.CanvasLayer.reFresh();
                }

                copy.CanvasLayer = new AMap.CanvasLayer({
                    canvas: map2dDraw.canvas,
                    bounds: new AMap.Bounds(
                        new AMap.LngLat(points[0][0],points[0][1]),
                        new AMap.LngLat(points[1][0],points[1][1])
                    ),
                    zooms: [3, 18],
                });
                //把图层 存放到 地图中
                copy.CanvasLayer.setMap(copy.map);
                //绘图循环的核心方法
                draw(23);
            }
            //-------------------------------------------------------------------------------
            //-------------------------------------------------------------------------------

            //为地图注册click事件获取鼠标点击出的经纬度坐标
            var clickEventListener = copy.map.on('click', function (e) {
                // console.log(e.lnglat);
                if (copy.TR_active) {
                    copy.trPosition = e.lnglat.lng + "," + e.lnglat.lat;
                    addMarker(copy);
                    $scope.$apply();
                }
                if (copy.BL_active) {
                    copy.blPosition = e.lnglat.lng + "," + e.lnglat.lat;
                    addMarker(copy);
                    $scope.$apply();
                }
                //document.getElementById("lnglat").value = e.lnglat.getLng() + ',' + e.lnglat.getLat()
            });


            function addMarker(park) {
                park.map.remove(markers);
                if (park.trPosition) {
                    var marker = new AMap.Marker({
                        icon: "http://webapi.amap.com/theme/v1.3/markers/n/mark_b.png",
                        position: park.trPosition.split(",")
                    });
                    marker.setMap(park.map);
                    markers.push(marker);
                }
                if (park.blPosition) {
                    var marker = new AMap.Marker({
                        icon: "http://webapi.amap.com/theme/v1.3/markers/n/mark_r.png",
                        position: park.blPosition.split(",")
                    });
                    marker.setMap(park.map);
                    markers.push(marker);
                }

            }
        }

    });

    app.controller('editParkModalCtrl', function ($scope,$rootScope,$http, $uibModalInstance, $filter, $timeout, fac, AMapDupNames, park) {
        $scope.item = park;
       
        //初始化调整参数
        var mapProperties = $scope.item.director ? $scope.item.director.split(","):[];
        $scope.item.mapWidth = mapProperties[0]?Number(mapProperties[0]):2000;
        $scope.item.mapHeight = mapProperties[1]?Number(mapProperties[1]):2000;
        $scope.item.mapZoom = mapProperties[2]?Number(mapProperties[2]):2.5;
        
        park.cityObj = {name: park.city || "", code: park.cityCode || ""};
        $rootScope.getDomainParkTree(true).then(function (data) {
            $scope.parkTypeTree = data;
        });
        $scope.auths=[];
        $scope.orgTree=[];

        //获取运营公司
        $rootScope.searchOrg(null,'operatingCompany').then(function (data) {
            $scope.auths=data;
        })

        if(park.id && park.authOrgId){
            getOrgTree(park.authOrgId);
        }


        //集团版, 用于选择项目分类
        $scope.selectParkType = function (node) {
            if (node.nodes && node.nodes.length) {
                alert("请选择叶子节点！");
            } else {
                park.parentId = node.id;
                park.fullPath = node.fullPath || node.text;
                park.parkHover = park.parkFocus = false;
            }
        }

        //更改运营公司
        $scope.changeOperatorCompany = function (authOrgId) {
            if (authOrgId) {
                getOrgTree(authOrgId);
            }else{
                $scope.item.authOrgId=null;
                $scope.item.authOrgName=null;
                $scope.item.authOrgDeptId=null;
                $scope.item.authOrgDeptName=null;
                $scope.orgTree=[];
            }
        }
        function getOrgTree(domainId){
            $rootScope.searchOrgDeptTree(domainId).then(function (data) {
                $scope.orgTree=data;
            });
        }

        //更改城市
        $scope.changeLoc = function (address) {
            if (address) {
                $scope.item.map.setCity(address);
            }
        }

        function geneParkno() {
            var china = "0";
            var area = park.regionCode || park.cityCode || "(城市编码)";
            var domain = app.domain?app.domain.domainCode : "0001";
            var nameInit = park.nameInit || "(项目简称首字母)";
            park.parkNo = china + area + domain + nameInit;
        }

        //更改项目简称
        $scope.nameChange = function (name) {
            if($scope.item.id){
                return;
            }
            //编辑简称项目编码不修改
            if (name && name.length) {
                $http.post("/ovu-base/system/park/toPinying_mute", {name: name}, fac.postConfig).success(function (resp) {
                    if (resp.code == 0) {
                        if (resp.data != "" && resp.data != undefined) {
                            var pingying = resp.data;
                            while (pingying.length < 4) {
                                pingying += "0";
                            }
                            park.nameInit = pingying.substr(0, 4);
                            geneParkno();
                        }
                    }
                })
            } else {
                delete park.nameInit;
                geneParkno();
            }
        }
        
        //业态修改
        $scope.yetaiChange = function(){
            if($scope.item.id){
                msg("业态修改将导致该项目下的空间编码修改，请谨慎操作！");
            }
        }

        //保存
        $scope.save = function (form, item) {
            form.$setSubmitted(true);
            if (!form.$valid) {
                return;
            }
            if (item.id) {
                //清空opTime，这个参数不需要传到后台，后台会返回这个参数
                delete item.opTime;
            }
            item.director = (item.mapWidth?item.mapWidth:"") + "," + (item.mapHeight?item.mapHeight:"") + "," + (item.mapZoom?item.mapZoom:"");
            /*item.opTime = $filter('date')(new Date(), "yyyy-MM-dd HH:mm:ss")*/
            $http.post("/ovu-base/system/park/save", item, fac.postConfig).success(function (data, status, headers, config) {
                if (data.code == 0) {
                    $uibModalInstance.close();
                    msg(data.msg);
                } else {
                    alert(data.msg);
                }
            })
        }
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };

        // wjlong BEGIN 添加图片删除功能
        $scope.$on('删除图片成功', function (file) {
            // console.log('收到广播，删除图片成功');
            $scope.showTrash = false;
        });
        // wjlong END

        // wjlong BEGIN
        // console.log('全国所有的重名的行政区数据');
        // console.log(AMapDupNames.dupDistincts);
        // wjlong END

        //初始化地址选择器参数数

        var option = {
            url: '/ovu-base/system/park/city',
            selectCallback: function (data, val) {
                // wjlong BEGIN 添加功能：选择城市 高德地图切换到所选的城市
                var cityInputArr = val.split(',');
                var city = cityInputArr.pop();
                var cityParent = cityInputArr.pop();
                // 判断是不是有重名的行政区名字 比如 朝阳区  北京有一个 长春也有一个
                if (AMapDupNames.isInDupDistincts(city)) {
                    var dupCitys = AMapDupNames.getDupDistincts(city);
                    var res = dupCitys.filter(function (v) {
                        return v.pname === cityParent;
                    });
                    city = res[0].adcode;
                }
                $scope.item.map.setCity(city);

                $scope.$emit('选择了行政区', val);
                // wjlong END

                $timeout(function () {
                    $scope.item.city = val;
                    $scope.item.provinceCode = null;
                    $scope.item.cityCode_ = null;
                    $scope.item.regionCode = null;
                    for (var i = 0; i < data.length; i++) {
                        switch (i) {
                            case 0:
                                $scope.item.provinceCode = data[i];
                                break;
                            case 1:
                                $scope.item.cityCode_ = $scope.item.cityCode = data[i];
                                break;
                            case 2:
                                $scope.item.regionCode = data[i];
                                if (!park.nameInit && park.shortName) {
                                    $scope.nameChange(park.shortName);
                                }
                                geneParkno();
                                break;
                            default:
                                break;
                        }
                    }
                });
            }
        };
        $timeout(function () {
            //初始化地址选择器
            $('#addressSelect').addressSelect(option);

            //$scope.domainCode = app.domain.domain_code;
        });

		$scope.uploadFile = function(){
			$rootScope.addLimitFileCallBack($scope.item,"airscapePath","airscapeName",[".json",'.geojson'],
				$rootScope.showCusmap1,$scope.item);
        }
        $scope.uploadFileToPlane = function(){
			$rootScope.addLimitFileCallBack($scope.item,"parkEmapPath","parkEmapName",[".json",'.geojson']);
		}
		$scope.deleteFile = function(){
			$scope.item.airscapePath = "";
			$scope.item.airscapeName = "";
			//刷新地图
			$rootScope.showCusmap1($scope.item)
        }
        $scope.deleteFileToPlane = function(){
			$scope.item.parkEmapPath = "";
			$scope.item.parkEmapName = "";
		
		}
    });

    // wjlong BEGIN 缓存高德城市数据
    app.factory('AMapCityCache', ['$q', function ($q) {

        return $q(function (resolve, reject) {
            AMap.service('AMap.DistrictSearch', function () { //回调函数
                //实例化DistrictSearch
                var districtSearch = new AMap.DistrictSearch();
                //TODO: 使用districtSearch对象调用行政区查询的功能
                districtSearch.setLevel('country');
                districtSearch.setSubdistrict(3);
                districtSearch.search('中国', function (status, result) {
                    if (status === 'complete') {
                        var list = wideTraversal(result.districtList[0]);
                        var nameCounts = nameCount(list);
                        var dupArr = getDupList(nameCounts);
                        var ret = getDupDistincts(dupArr, list);
                        resolve(ret);
                    } else {
                        reject(status);
                    }
                });
            });
        });

        // 广度优先遍历
        function wideTraversal(node) {
            var rootNode = angular.copy(node);
            var nodes = [];
            if (rootNode != null) {
                var queue = [];
                rootNode.padcode = '';
                rootNode.pnmae = '';
                queue.unshift(rootNode);
                while (queue.length != 0) {
                    var item = queue.shift();
                    nodes.push(item);
                    var districtList = item.districtList;
                    delete item.districtList;
                    var pAdcode = item.adcode;
                    var pName = item.name;
                    if (angular.isArray(districtList)) {
                        districtList.forEach(function (v) {
                            v.padcode = pAdcode;
                            v.pname = pName;
                            queue.push(v);
                        });
                    }
                }
            }
            return nodes;
        }

        // 数组查重
        function nameCount(arr) {
            // arr = [1,1,'d','d',...]   obj = {'1':2,'d':2,...}
            var obj = {};
            var uniqueArr = [];
            arr.forEach(function (v) {
                if (obj[v.name]) {
                    obj[v.name]++;
                } else {
                    obj[v.name] = 1;
                    uniqueArr.push(v);
                }
            });

            // res = [{name:'1',count:2},...]
            var res = [];
            uniqueArr.forEach(function (v) {
                res.push({
                    name: v.name,
                    count: obj[v.name],
                    // adcode: v.adcode,
                    // pname: v.pname,
                    // padcode: v.padcode
                });
            });

            return res;
        }

        // 取出重复的节点list
        function getDupList(nameCounts) {
            var dupArr = [];
            nameCounts.forEach(function (v) {
                if (v.count !== 1) {
                    dupArr.push(v);
                }
            });
            return dupArr;
        }

        // 获取 dupDistinctList
        function getDupDistincts(dupArr, list) {
            var dupDistincts = {};
            dupDistincts.index = dupArr;
            dupDistincts.data = [];
            dupArr.forEach(function (v) {
                list.forEach(function (innerV) {
                    if (innerV.name === v.name) {
                        dupDistincts.data.push(innerV);
                    }
                });
            });
            return dupDistincts;
        }
    }]);
    app.service('AMapDupNames', function () {
        this.dupDistincts = {
            index: [
                {"name": "东区", "count": 2},
                {"name": "朝阳区", "count": 2}, {"name": "通州区", "count": 2}, {"name": "和平区", "count": 2}, {
                    "name": "河东区",
                    "count": 2
                }, {"name": "长安区", "count": 2}, {"name": "桥西区", "count": 3}, {
                    "name": "新华区",
                    "count": 3
                }, {"name": "桥东区", "count": 2}, {"name": "城区", "count": 5}, {"name": "矿区", "count": 2}, {
                    "name": "郊区",
                    "count": 4
                }, {"name": "新城区", "count": 2}, {"name": "青山区", "count": 2}, {
                    "name": "铁西区",
                    "count": 3
                }, {"name": "铁东区", "count": 2}, {"name": "海州区", "count": 2}, {
                    "name": "西安区",
                    "count": 2
                }, {"name": "向阳区", "count": 2}, {"name": "南山区", "count": 2}, {
                    "name": "宝山区",
                    "count": 2
                }, {"name": "普陀区", "count": 2}, {"name": "鼓楼区", "count": 4}, {
                    "name": "西湖区",
                    "count": 2
                }, {"name": "江北区", "count": 2}, {"name": "永定区", "count": 2}, {
                    "name": "市中区",
                    "count": 4
                }, {"name": "白云区", "count": 2}, {"name": "龙华区", "count": 2}, {
                    "name": "城中区",
                    "count": 2
                }, {"name": "城关区", "count": 2}
            ],
            data: [
                {
                    "citycode": "1852",
                    "adcode": "810003",
                    "name": "东区",
                    "center": {"O": 22.279693, "M": 114.22600299999999, "lng": 114.226003, "lat": 22.279693},
                    "level": "district",
                    "padcode": "810000",
                    "pname": "香港特别行政区"
                }, {
                    "citycode": "0812",
                    "adcode": "510402",
                    "name": "东区",
                    "center": {"O": 26.546491, "M": 101.70410900000002, "lng": 101.704109, "lat": 26.546491},
                    "level": "district",
                    "padcode": "510400",
                    "pname": "攀枝花市"
                }, {
                    "citycode": "010",
                    "adcode": "110105",
                    "name": "朝阳区",
                    "center": {"O": 39.921506, "M": 116.44320500000003, "lng": 116.443205, "lat": 39.921506},
                    "level": "district",
                    "padcode": "110100",
                    "pname": "北京城区"
                }, {
                    "citycode": "0431",
                    "adcode": "220104",
                    "name": "朝阳区",
                    "center": {"O": 43.833762, "M": 125.288254, "lng": 125.288254, "lat": 43.833762},
                    "level": "district",
                    "padcode": "220100",
                    "pname": "长春市"
                }, {
                    "citycode": "010",
                    "adcode": "110112",
                    "name": "通州区",
                    "center": {"O": 39.909946, "M": 116.65643399999999, "lng": 116.656434, "lat": 39.909946},
                    "level": "district",
                    "padcode": "110100",
                    "pname": "北京城区"
                }, {
                    "citycode": "0513",
                    "adcode": "320612",
                    "name": "通州区",
                    "center": {"O": 32.06568, "M": 121.07382799999999, "lng": 121.073828, "lat": 32.06568},
                    "level": "district",
                    "padcode": "320600",
                    "pname": "南通市"
                }, {
                    "citycode": "022",
                    "adcode": "120101",
                    "name": "和平区",
                    "center": {"O": 39.117196, "M": 117.214699, "lng": 117.214699, "lat": 39.117196},
                    "level": "district",
                    "padcode": "120100",
                    "pname": "天津城区"
                }, {
                    "citycode": "024",
                    "adcode": "210102",
                    "name": "和平区",
                    "center": {"O": 41.789833, "M": 123.420368, "lng": 123.420368, "lat": 41.789833},
                    "level": "district",
                    "padcode": "210100",
                    "pname": "沈阳市"
                }, {
                    "citycode": "022",
                    "adcode": "120102",
                    "name": "河东区",
                    "center": {"O": 39.128294, "M": 117.25158399999998, "lng": 117.251584, "lat": 39.128294},
                    "level": "district",
                    "padcode": "120100",
                    "pname": "天津城区"
                }, {
                    "citycode": "0539",
                    "adcode": "371312",
                    "name": "河东区",
                    "center": {"O": 35.089916, "M": 118.402893, "lng": 118.402893, "lat": 35.089916},
                    "level": "district",
                    "padcode": "371300",
                    "pname": "临沂市"
                }, {
                    "citycode": "0311",
                    "adcode": "130102",
                    "name": "长安区",
                    "center": {"O": 38.036347, "M": 114.53939500000001, "lng": 114.539395, "lat": 38.036347},
                    "level": "district",
                    "padcode": "130100",
                    "pname": "石家庄市"
                }, {
                    "citycode": "029",
                    "adcode": "610116",
                    "name": "长安区",
                    "center": {"O": 34.158926, "M": 108.907173, "lng": 108.907173, "lat": 34.158926},
                    "level": "district",
                    "padcode": "610100",
                    "pname": "西安市"
                }, {
                    "citycode": "0311",
                    "adcode": "130104",
                    "name": "桥西区",
                    "center": {"O": 38.004193, "M": 114.46108800000002, "lng": 114.461088, "lat": 38.004193},
                    "level": "district",
                    "padcode": "130100",
                    "pname": "石家庄市"
                }, {
                    "citycode": "0319",
                    "adcode": "130503",
                    "name": "桥西区",
                    "center": {"O": 37.059827, "M": 114.46860100000004, "lng": 114.468601, "lat": 37.059827},
                    "level": "district",
                    "padcode": "130500",
                    "pname": "邢台市"
                }, {
                    "citycode": "0313",
                    "adcode": "130703",
                    "name": "桥西区",
                    "center": {"O": 40.819581, "M": 114.86965700000002, "lng": 114.869657, "lat": 40.819581},
                    "level": "district",
                    "padcode": "130700",
                    "pname": "张家口市"
                }, {
                    "citycode": "0311",
                    "adcode": "130105",
                    "name": "新华区",
                    "center": {"O": 38.05095, "M": 114.46337699999998, "lng": 114.463377, "lat": 38.05095},
                    "level": "district",
                    "padcode": "130100",
                    "pname": "石家庄市"
                }, {
                    "citycode": "0317",
                    "adcode": "130902",
                    "name": "新华区",
                    "center": {"O": 38.314416, "M": 116.86628400000001, "lng": 116.866284, "lat": 38.314416},
                    "level": "district",
                    "padcode": "130900",
                    "pname": "沧州市"
                }, {
                    "citycode": "0375",
                    "adcode": "410402",
                    "name": "新华区",
                    "center": {"O": 33.737251, "M": 113.29397699999998, "lng": 113.293977, "lat": 33.737251},
                    "level": "district",
                    "padcode": "410400",
                    "pname": "平顶山市"
                }, {
                    "citycode": "0319",
                    "adcode": "130502",
                    "name": "桥东区",
                    "center": {"O": 37.071287, "M": 114.50705800000003, "lng": 114.507058, "lat": 37.071287},
                    "level": "district",
                    "padcode": "130500",
                    "pname": "邢台市"
                }, {
                    "citycode": "0313",
                    "adcode": "130702",
                    "name": "桥东区",
                    "center": {"O": 40.788434, "M": 114.89418899999998, "lng": 114.894189, "lat": 40.788434},
                    "level": "district",
                    "padcode": "130700",
                    "pname": "张家口市"
                }, {
                    "citycode": "0352",
                    "adcode": "140202",
                    "name": "城区",
                    "center": {"O": 40.075666, "M": 113.298026, "lng": 113.298026, "lat": 40.075666},
                    "level": "district",
                    "padcode": "140200",
                    "pname": "大同市"
                }, {
                    "citycode": "0353",
                    "adcode": "140302",
                    "name": "城区",
                    "center": {"O": 37.847436, "M": 113.60066899999998, "lng": 113.600669, "lat": 37.847436},
                    "level": "district",
                    "padcode": "140300",
                    "pname": "阳泉市"
                }, {
                    "citycode": "0355",
                    "adcode": "140402",
                    "name": "城区",
                    "center": {"O": 36.20353, "M": 113.123088, "lng": 113.123088, "lat": 36.20353},
                    "level": "district",
                    "padcode": "140400",
                    "pname": "长治市"
                }, {
                    "citycode": "0356",
                    "adcode": "140502",
                    "name": "城区",
                    "center": {"O": 35.501571, "M": 112.85355500000003, "lng": 112.853555, "lat": 35.501571},
                    "level": "district",
                    "padcode": "140500",
                    "pname": "晋城市"
                }, {
                    "citycode": "0660",
                    "adcode": "441502",
                    "name": "城区",
                    "center": {"O": 22.779207, "M": 115.36505799999998, "lng": 115.365058, "lat": 22.779207},
                    "level": "district",
                    "padcode": "441500",
                    "pname": "汕尾市"
                }, {
                    "citycode": "0352",
                    "adcode": "140203",
                    "name": "矿区",
                    "center": {"O": 40.036858, "M": 113.17720600000001, "lng": 113.177206, "lat": 40.036858},
                    "level": "district",
                    "padcode": "140200",
                    "pname": "大同市"
                }, {
                    "citycode": "0353",
                    "adcode": "140303",
                    "name": "矿区",
                    "center": {"O": 37.868494, "M": 113.55527899999998, "lng": 113.555279, "lat": 37.868494},
                    "level": "district",
                    "padcode": "140300",
                    "pname": "阳泉市"
                }, {
                    "citycode": "0353",
                    "adcode": "140311",
                    "name": "郊区",
                    "center": {"O": 37.944679, "M": 113.59416299999998, "lng": 113.594163, "lat": 37.944679},
                    "level": "district",
                    "padcode": "140300",
                    "pname": "阳泉市"
                }, {
                    "citycode": "0355",
                    "adcode": "140411",
                    "name": "郊区",
                    "center": {"O": 36.218388, "M": 113.10121100000003, "lng": 113.101211, "lat": 36.218388},
                    "level": "district",
                    "padcode": "140400",
                    "pname": "长治市"
                }, {
                    "citycode": "0454",
                    "adcode": "230811",
                    "name": "郊区",
                    "center": {"O": 46.810085, "M": 130.32719399999996, "lng": 130.327194, "lat": 46.810085},
                    "level": "district",
                    "padcode": "230800",
                    "pname": "佳木斯市"
                }, {
                    "citycode": "0562",
                    "adcode": "340711",
                    "name": "郊区",
                    "center": {"O": 30.821069, "M": 117.76802600000002, "lng": 117.768026, "lat": 30.821069},
                    "level": "district",
                    "padcode": "340700",
                    "pname": "铜陵市"
                }, {
                    "citycode": "0471",
                    "adcode": "150102",
                    "name": "新城区",
                    "center": {"O": 40.858289, "M": 111.66554400000001, "lng": 111.665544, "lat": 40.858289},
                    "level": "district",
                    "padcode": "150100",
                    "pname": "呼和浩特市"
                }, {
                    "citycode": "029",
                    "adcode": "610102",
                    "name": "新城区",
                    "center": {"O": 34.266447, "M": 108.96071599999999, "lng": 108.960716, "lat": 34.266447},
                    "level": "district",
                    "padcode": "610100",
                    "pname": "西安市"
                }, {
                    "citycode": "0472",
                    "adcode": "150204",
                    "name": "青山区",
                    "center": {"O": 40.643246, "M": 109.90157199999999, "lng": 109.901572, "lat": 40.643246},
                    "level": "district",
                    "padcode": "150200",
                    "pname": "包头市"
                }, {
                    "citycode": "027",
                    "adcode": "420107",
                    "name": "青山区",
                    "center": {"O": 30.640191, "M": 114.38496800000001, "lng": 114.384968, "lat": 30.640191},
                    "level": "district",
                    "padcode": "420100",
                    "pname": "武汉市"
                }, {
                    "citycode": "024",
                    "adcode": "210106",
                    "name": "铁西区",
                    "center": {"O": 41.820807, "M": 123.33396800000003, "lng": 123.333968, "lat": 41.820807},
                    "level": "district",
                    "padcode": "210100",
                    "pname": "沈阳市"
                }, {
                    "citycode": "0412",
                    "adcode": "210303",
                    "name": "铁西区",
                    "center": {"O": 41.119884, "M": 122.969629, "lng": 122.969629, "lat": 41.119884},
                    "level": "district",
                    "padcode": "210300",
                    "pname": "鞍山市"
                }, {
                    "citycode": "0434",
                    "adcode": "220302",
                    "name": "铁西区",
                    "center": {"O": 43.146155, "M": 124.34572200000002, "lng": 124.345722, "lat": 43.146155},
                    "level": "district",
                    "padcode": "220300",
                    "pname": "四平市"
                }, {
                    "citycode": "0412",
                    "adcode": "210302",
                    "name": "铁东区",
                    "center": {"O": 41.089933, "M": 122.99105199999997, "lng": 122.991052, "lat": 41.089933},
                    "level": "district",
                    "padcode": "210300",
                    "pname": "鞍山市"
                }, {
                    "citycode": "0434",
                    "adcode": "220303",
                    "name": "铁东区",
                    "center": {"O": 43.162105, "M": 124.40959099999998, "lng": 124.409591, "lat": 43.162105},
                    "level": "district",
                    "padcode": "220300",
                    "pname": "四平市"
                }, {
                    "citycode": "0418",
                    "adcode": "210902",
                    "name": "海州区",
                    "center": {"O": 42.011162, "M": 121.65763800000002, "lng": 121.657638, "lat": 42.011162},
                    "level": "district",
                    "padcode": "210900",
                    "pname": "阜新市"
                }, {
                    "citycode": "0518",
                    "adcode": "320706",
                    "name": "海州区",
                    "center": {"O": 34.572274, "M": 119.16350899999998, "lng": 119.163509, "lat": 34.572274},
                    "level": "district",
                    "padcode": "320700",
                    "pname": "连云港市"
                }, {
                    "citycode": "0437",
                    "adcode": "220403",
                    "name": "西安区",
                    "center": {"O": 42.927324, "M": 125.14928099999997, "lng": 125.149281, "lat": 42.927324},
                    "level": "district",
                    "padcode": "220400",
                    "pname": "辽源市"
                }, {
                    "citycode": "0453",
                    "adcode": "231005",
                    "name": "西安区",
                    "center": {"O": 44.577625, "M": 129.616058, "lng": 129.616058, "lat": 44.577625},
                    "level": "district",
                    "padcode": "231000",
                    "pname": "牡丹江市"
                }, {
                    "citycode": "0468",
                    "adcode": "230402",
                    "name": "向阳区",
                    "center": {"O": 47.342468, "M": 130.29423499999996, "lng": 130.294235, "lat": 47.342468},
                    "level": "district",
                    "padcode": "230400",
                    "pname": "鹤岗市"
                }, {
                    "citycode": "0454",
                    "adcode": "230803",
                    "name": "向阳区",
                    "center": {"O": 46.80779, "M": 130.365346, "lng": 130.365346, "lat": 46.80779},
                    "level": "district",
                    "padcode": "230800",
                    "pname": "佳木斯市"
                }, {
                    "citycode": "0468",
                    "adcode": "230404",
                    "name": "南山区",
                    "center": {"O": 47.315174, "M": 130.286788, "lng": 130.286788, "lat": 47.315174},
                    "level": "district",
                    "padcode": "230400",
                    "pname": "鹤岗市"
                }, {
                    "citycode": "0755",
                    "adcode": "440305",
                    "name": "南山区",
                    "center": {"O": 22.533287, "M": 113.93041299999999, "lng": 113.930413, "lat": 22.533287},
                    "level": "district",
                    "padcode": "440300",
                    "pname": "深圳市"
                },
                {
                    "citycode": "0469",
                    "adcode": "230506",
                    "name": "宝山区",
                    "center": {"O": 46.577167, "M": 131.401589, "lng": 131.401589, "lat": 46.577167},
                    "level": "district",
                    "padcode": "230500",
                    "pname": "双鸭山市"
                }, {
                    "citycode": "021",
                    "adcode": "310113",
                    "name": "宝山区",
                    "center": {"O": 31.405457, "M": 121.48961199999997, "lng": 121.489612, "lat": 31.405457},
                    "level": "district",
                    "padcode": "310100",
                    "pname": "上海城区"
                }, {
                    "citycode": "021",
                    "adcode": "310107",
                    "name": "普陀区",
                    "center": {"O": 31.249603, "M": 121.39551399999999, "lng": 121.395514, "lat": 31.249603},
                    "level": "district",
                    "padcode": "310100",
                    "pname": "上海城区"
                }, {
                    "citycode": "0580",
                    "adcode": "330903",
                    "name": "普陀区",
                    "center": {"O": 29.97176, "M": 122.323867, "lng": 122.323867, "lat": 29.97176},
                    "level": "district",
                    "padcode": "330900",
                    "pname": "舟山市"
                }, {
                    "citycode": "025",
                    "adcode": "320106",
                    "name": "鼓楼区",
                    "center": {"O": 32.066601, "M": 118.77018199999998, "lng": 118.770182, "lat": 32.066601},
                    "level": "district",
                    "padcode": "320100",
                    "pname": "南京市"
                }, {
                    "citycode": "0516",
                    "adcode": "320302",
                    "name": "鼓楼区",
                    "center": {"O": 34.288646, "M": 117.18557599999997, "lng": 117.185576, "lat": 34.288646},
                    "level": "district",
                    "padcode": "320300",
                    "pname": "徐州市"
                }, {
                    "citycode": "0591",
                    "adcode": "350102",
                    "name": "鼓楼区",
                    "center": {"O": 26.081983, "M": 119.30391700000001, "lng": 119.303917, "lat": 26.081983},
                    "level": "district",
                    "padcode": "350100",
                    "pname": "福州市"
                }, {
                    "citycode": "0378",
                    "adcode": "410204",
                    "name": "鼓楼区",
                    "center": {"O": 34.78856, "M": 114.34830599999998, "lng": 114.348306, "lat": 34.78856},
                    "level": "district",
                    "padcode": "410200",
                    "pname": "开封市"
                }, {
                    "citycode": "0571",
                    "adcode": "330106",
                    "name": "西湖区",
                    "center": {"O": 30.259463, "M": 120.13019400000002, "lng": 120.130194, "lat": 30.259463},
                    "level": "district",
                    "padcode": "330100",
                    "pname": "杭州市"
                }, {
                    "citycode": "0791",
                    "adcode": "360103",
                    "name": "西湖区",
                    "center": {"O": 28.657595, "M": 115.87723299999999, "lng": 115.877233, "lat": 28.657595},
                    "level": "district",
                    "padcode": "360100",
                    "pname": "南昌市"
                }, {
                    "citycode": "0574",
                    "adcode": "330205",
                    "name": "江北区",
                    "center": {"O": 29.886781, "M": 121.55508099999997, "lng": 121.555081, "lat": 29.886781},
                    "level": "district",
                    "padcode": "330200",
                    "pname": "宁波市"
                }, {
                    "citycode": "023",
                    "adcode": "500105",
                    "name": "江北区",
                    "center": {"O": 29.606703, "M": 106.57427100000001, "lng": 106.574271, "lat": 29.606703},
                    "level": "district",
                    "padcode": "500100",
                    "pname": "重庆城区"
                }, {
                    "citycode": "0597",
                    "adcode": "350803",
                    "name": "永定区",
                    "center": {"O": 24.723961, "M": 116.73209099999997, "lng": 116.732091, "lat": 24.723961},
                    "level": "district",
                    "padcode": "350800",
                    "pname": "龙岩市"
                }, {
                    "citycode": "0744",
                    "adcode": "430802",
                    "name": "永定区",
                    "center": {"O": 29.119855, "M": 110.53713800000003, "lng": 110.537138, "lat": 29.119855},
                    "level": "district",
                    "padcode": "430800",
                    "pname": "张家界市"
                }, {
                    "citycode": "0531",
                    "adcode": "370103",
                    "name": "市中区",
                    "center": {"O": 36.651335, "M": 116.99784499999998, "lng": 116.997845, "lat": 36.651335},
                    "level": "district",
                    "padcode": "370100",
                    "pname": "济南市"
                }, {
                    "citycode": "0632",
                    "adcode": "370402",
                    "name": "市中区",
                    "center": {"O": 34.863554, "M": 117.55613900000003, "lng": 117.556139, "lat": 34.863554},
                    "level": "district",
                    "padcode": "370400",
                    "pname": "枣庄市"
                }, {
                    "citycode": "1832",
                    "adcode": "511002",
                    "name": "市中区",
                    "center": {"O": 29.587053, "M": 105.06759699999998, "lng": 105.067597, "lat": 29.587053},
                    "level": "district",
                    "padcode": "511000",
                    "pname": "内江市"
                }, {
                    "citycode": "0833",
                    "adcode": "511102",
                    "name": "市中区",
                    "center": {"O": 29.555374, "M": 103.76132899999999, "lng": 103.761329, "lat": 29.555374},
                    "level": "district",
                    "padcode": "511100",
                    "pname": "乐山市"
                }, {
                    "citycode": "020",
                    "adcode": "440111",
                    "name": "白云区",
                    "center": {"O": 23.157367, "M": 113.27323799999999, "lng": 113.273238, "lat": 23.157367},
                    "level": "district",
                    "padcode": "440100",
                    "pname": "广州市"
                }, {
                    "citycode": "0851",
                    "adcode": "520113",
                    "name": "白云区",
                    "center": {"O": 26.678561, "M": 106.62300700000003, "lng": 106.623007, "lat": 26.678561},
                    "level": "district",
                    "padcode": "520100",
                    "pname": "贵阳市"
                }, {
                    "citycode": "0755",
                    "adcode": "440309",
                    "name": "龙华区",
                    "center": {"O": 22.696667, "M": 114.04542200000003, "lng": 114.045422, "lat": 22.696667},
                    "level": "district",
                    "padcode": "440300",
                    "pname": "深圳市"
                }, {
                    "citycode": "0898",
                    "adcode": "460106",
                    "name": "龙华区",
                    "center": {"O": 20.031006, "M": 110.32849199999998, "lng": 110.328492, "lat": 20.031006},
                    "level": "district",
                    "padcode": "460100",
                    "pname": "海口市"
                }, {
                    "citycode": "0772",
                    "adcode": "450202",
                    "name": "城中区",
                    "center": {"O": 24.366, "M": 109.4273, "lng": 109.4273, "lat": 24.366},
                    "level": "district",
                    "padcode": "450200",
                    "pname": "柳州市"
                }, {
                    "citycode": "0971",
                    "adcode": "630103",
                    "name": "城中区",
                    "center": {"O": 36.545652, "M": 101.70529799999997, "lng": 101.705298, "lat": 36.545652},
                    "level": "district",
                    "padcode": "630100",
                    "pname": "西宁市"
                }, {
                    "citycode": "0891",
                    "adcode": "540102",
                    "name": "城关区",
                    "center": {"O": 29.654838, "M": 91.14055200000001, "lng": 91.140552, "lat": 29.654838},
                    "level": "district",
                    "padcode": "540100",
                    "pname": "拉萨市"
                }, {
                    "citycode": "0931",
                    "adcode": "620102",
                    "name": "城关区",
                    "center": {"O": 36.057464, "M": 103.82530700000001, "lng": 103.825307, "lat": 36.057464},
                    "level": "district",
                    "padcode": "620100",
                    "pname": "兰州市"
                }
            ]
        };
        this.isInDupDistincts = function (value) {
            return this.dupDistincts.index.some(function (v) {
                return v.name === value;
            });
        };
        this.getDupDistincts = function (value) {
            var res = [];
            this.dupDistincts.data.forEach(function (v) {
                if (v.name === value) {
                    res.push(v);
                }
            });
            return res;
        };
    });
    // wjlong END

})();
