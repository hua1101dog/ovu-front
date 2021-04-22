(function() {
	var app = angular.module("angularApp");

	app.service('HumanInsService',HumanInsService);
	function HumanInsService() {
		var that = this;
        //添加标记
        this.addMarker = function(map, data) {
            var imagePath;
            if(data.hasOwnProperty('isIns')){
                //是否巡查
                if(data.isIns){
                    //室外
                    if(data.type == 2){
                        if(data.equipmentId){
                            imagePath = '../res/img/quality/out-ins-video.png';
                        }else {
                            imagePath = '../res/img/quality/out-ins-novideo.png';
                        }
                    }else {
                        if(data.equipmentId){
                            imagePath = '../res/img/quality/in-ins-video.png';
                        }else {
                            imagePath = '../res/img/quality/in-ins-novideo.png';
                        }
                    }
                }else {
                    if(data.type == 2){
                        if(data.equipmentId){
                            imagePath = '../res/img/quality/out-video.png';
                        }else {
                            imagePath = '../res/img/quality/out-novideo.png';
                        }
                    }else {
                        if(data.equipmentId){
                            imagePath = '../res/img/quality/in-video.png';
                        }else {
                            imagePath = '../res/img/quality/in-novideo.png';
                        }
                    }
                }
            }else {
                if(data.type == 2){
                    if(data.equipmentId){
                        imagePath = '../res/img/quality/out-ins-video.png';
                    }else {
                        imagePath = '../res/img/quality/out-ins-novideo.png';
                    }
                }else {
                    if(data.equipmentId){
                        imagePath = '../res/img/quality/in-ins-video.png';
                    }else {
                        imagePath = '../res/img/quality/in-ins-novideo.png';
                    }
                }
            }
            var icon = new AMap.Icon({
                image : imagePath
            });
            var marker = new AMap.Marker({
                icon : icon,
                position : [data.longitude,data.latitude],
                map : map,
                extData:data
            });
            marker.setLabel({//label默认蓝框白底左上角显示，样式className为：amap-marker-label
                offset : new AMap.Pixel(20, 20),//修改label相对于maker的位置
                content : data.name
            });
            return marker;
        }

        this.addDefaultMarker = function (map, data) {
            var marker = new AMap.Marker({
                position : [data.longitude,data.latitude],
                map : map,
                extData:data
            });
            return marker;
        }

        this.zindex= 0 ;
        //添加折线
        this.addPolyline = function (map,path, data ,color) {
            var polyline = new AMap.Polyline({
                path: path,          //设置线覆盖物路径
                strokeColor: color || "#2196F3", //线颜色
                strokeOpacity: 1,       //线透明度
                strokeWeight: 10,        //线宽
                strokeStyle: "solid",   //线样式
                strokeDasharray: [10, 5], //补充线样式
                showDir:true,
                map:map,
                bubble: false,
                extData:data
            });
            return polyline;
        }
        //渲染地图marker和折线
        this.rederMarker2Line = function (data,map,markers,polylines,polylineColor) {
            data && data.forEach(function (da) {
                var path =[];  //折线经纬度数组
                da.pointList.forEach(function (point) {
                    if(point.longitude){
                        path.push([point.longitude,point.latitude]);
                        var marker = that.addMarker(map, point); //每个巡查点都要生成maker
                        markers.push(marker);
                    }
                })
                that.addWalking(map,path,polylineColor); //开始导航
            })
        }
        //地图导航
        this.addWalking = function(map,path,outlineColor){
            var obj = {
                map : map,
                hideMarkers : true,
                autoFitView :true
            }
            //描边颜色
            if(outlineColor){
                obj.outlineColor = outlineColor;
                obj.isOutline = true;
            }
            for (var i = 0; i < path.length - 1; i++) {
                var walking = new AMap.Walking(obj); 
                //根据起终点坐标规划步行路线
                walking.search(path[i], path[i+1]);        
            }
        }
        //重置checkbox为不勾选
        this.resetCheckBox = function (list) {
            list && list.forEach(function (li) {
                li.checked && delete li.checked;
            })
        }
    }

    /**
	 * 1.进入该页面查询所有的巡查点，并在地图展示
	 * 2.查询所有的巡查路线和巡查项，在左侧展示
     */
	app.controller('HumanInsCtrl',function($scope, $rootScope, $uibModal, $http,fac, mapService,HumanInsService) {
        document.title = "视频巡查";
		$scope.isPlay= false;     //是否进入视频播放
        $scope.search = {};
		$scope.pageModel = {};
		$scope.orbitTypes =  [{name:'巡查路线设计轨迹',value:1},
							  {name:'巡查路线实际轨迹',value:2},
            				  {name:'人员执行轨迹',value:3}];         //巡查轨迹选择ng-model的集合
		$scope.date = moment().format('YYYY-MM-DD');   //左侧查询条件默认时间

        //地图基本配置
        $scope.mapOptions = {
            toolbar : true,
            // map-self config
            resizeEnable : true,
            // ui map config
            uiMapCache : false,
            zoom : 18,
            //精简模式
            liteStyle : true,
            expandZoomRange:true
        };
        //地图标记点
        $scope.markers = [];
        //折线
        $scope.polylines = [];

		//查询分页列表
		$scope.find = function(pageNo){
            angular.extend($scope.search,{currentPage:pageNo||$scope.pageModel.currentPage||1,pageSize:$scope.pageModel.pageSize||10});
            fac.getPageResult("/ovu-pcos/pcos/quality/humanins/getPointList.do",$scope.search,function(data){
                $scope.pageModel = data;
            });
        };

        //通过巡查点名称来查询 查询路线和巡查项选择 ，用于地图左侧的查询条件
        $scope.searchWay2Item = function () {
            var param={params:{insPointName:$scope.insPointName,parkId:$scope.search.parkId}};
            //1.查询巡查路线
            $http.get("/ovu-pcos/pcos/quality/insway/loadWayName.do",param).success(function (data) {
				$scope.wayList = angular.copy(data) || [];    //查询条件的路线列表
				$scope.wayList2 = angular.copy(data);   //巡查轨迹历史 路线列表
            })
            //2.查询巡查项类型
            $http.get("/ovu-pcos/pcos/quality/humanins/getAllItemType.do",param).success(function (data) {
				$scope.itemTypeList = data || [];
            })
        }
		//地图左侧的面板查询,参数为巡查点insPointName
		$scope.findMapData = function() {
            //1.查询所有的巡查点
            $http.get('/ovu-pcos/pcos/quality/insway/getMapPoint',{params:{parkId:$scope.search.parkId}}).success(function (data) {
                   mapService.setMapBounds($scope.myMap,data);
                	$scope.myMap.clearMap();
                    var markers=[];
                    data && data.forEach(function(dt){
                        if(dt.longitude){
                            var marker =HumanInsService.addMarker($scope.myMap, dt);
                            markers.push(marker);
                        }
                    })
                    $scope.markers=markers;
            })
            //2.根据项目id查询左侧的巡查路线以及巡查项
            $scope.searchWay2Item();
        }

        //人工巡查列表 下拉框选择巡查项列表
        function getAllInsItemById() {
            var param = {parkId : $scope.search.parkId};
            $http.get('/ovu-pcos/pcos/quality/humanins/getAllInsItem',{params:param}).success(function (data) {
                $scope.insItems = data;
            })
        }

		//初始化地图和列表
        $scope.initMap2List = function(){
            if(!fac.hasOnlyPark($scope.search)){
                return;
            }
            $scope.findMapData();
            $scope.find(1);
            getAllInsItemById();
		}

        app.modulePromiss.then(function(){
            fac.initPage($scope, function() {
            	//集团版第一步应该查询地图的所有巡查点
                $scope.initMap2List();
            },function () {
                //项目第一步应该查询地图的所有巡查点
                $scope.initMap2List();
            });

        })

		//改变左侧查询条件中，巡查路线或者巡查项类型checkboc触发的事件
		//这两个checkbox是互斥的
		//type   2为路线，1位巡查项类型
		$scope.changeWayOrItemType = function (type) {
        	$scope.type = type;     //保存这个type，以后的遍历要用
        	var list = type == 2 ? $scope.itemTypeList : $scope.wayList;
            HumanInsService.resetCheckBox(list);

			//并且上面的查询和下面的历史轨迹也是互斥的
			HumanInsService.resetCheckBox($scope.wayList2);   //清除路线checkbox
            HumanInsService.resetCheckBox($scope.orbitTypes); //清除轨迹选择checkbox

        }
        //改变左侧轨迹历史条件时，来与上面的查询进行互斥操作
        $scope.changeWayOrItemTypeBottom = function () {
            HumanInsService.resetCheckBox($scope.wayList);
            HumanInsService.resetCheckBox($scope.itemTypeList);
        }

		//地图左侧查询条件 完成按钮
		//遍历路线或者巡查项类型即可。
		$scope.finish1 = function () {
            if(!$scope.type){
            	alert("请勾选查询条件");
            	return;
			}
            $scope.myMap.clearMap();
			var ids = [];
            var list =  $scope.type == 1 ? $scope.itemTypeList : $scope.wayList;
            list.forEach(function (li) {
                li.checked && ids.push(li.insWayId || li.insItemTypeId);
            })
			if(ids.length == 0){
                alert("请选择路线或巡查项类型");
                return;
			}
			var param={type:$scope.type};
			if($scope.type == 2){
                param.wayIds = ids.join();
			}else {
                param.insItemTypeIds = ids.join();
			}
			$http.get('/ovu-pcos/pcos/quality/humanins/loadWayMapByType.do',{params:param}).success(function (data) {
				//展示巡查路线，地图打点，连线
				HumanInsService.rederMarker2Line(data,$scope.myMap,$scope.markers,$scope.polylines);
            })
        }
		//地图左侧查询条件 重置按钮
        $scope.reset1 = function () {
            var list = $scope.type == 1 ? $scope.itemTypeList : $scope.wayList;
            list.forEach(function (li) {
                li.checked && delete li.checked;
            })
			$scope.insPointName = "";
            $scope.myMap.clearMap();
        }

        //地图左侧历史 完成按钮
        $scope.finish2 = function () {
            $scope.myMap.clearMap();
        	//1.拿到路线的ids
			var ids = $scope.wayList2.reduce(function (ret,n) {
                n.checked && ret.push(n.insWayId);
				return ret;
            },[]).join();
			//2.拿到巡查轨迹选择的orbitType
            var types = $scope.orbitTypes.reduce(function (ret,n) {
                n.checked && ret.push(n.value);
                return ret;
            },[]).join();
            if(ids.length == 0 || types.length == 0){
                alert("请选择路线和轨迹");
                return;
            }
            var param = {date:$scope.date,wayIds:ids,orbitType:types};
            $http.get('/ovu-pcos/pcos/quality/humanins/getInsOrbitList.do',{params:param}).success(function (data) {
                //展示巡查路线，地图打点，连线
                //默认蓝色表示设计路线，绿色是实际轨迹， 红色是人员轨迹
                HumanInsService.rederMarker2Line(data.designWay,$scope.myMap,$scope.markers,$scope.polylines);
                HumanInsService.rederMarker2Line(data.realWay,$scope.myMap,$scope.markers,$scope.polylines,"green");

                //人员执行轨迹
                data && data.executeWay && data.executeWay.forEach(function (da) {
                        var path =[];  //折线经纬度数组
                        da.pointList && da.pointList.forEach(function (point) {
                            path.push([point.longitude,point.latitude]);
                            var marker = HumanInsService.addDefaultMarker($scope.myMap, point); //每个巡查点都要生成maker
                            $scope.markers.push(marker);;
                        })
                        fac.isNotEmpty(path) && $scope.polylines.push(HumanInsService.addPolyline($scope.myMap,path,da,"#D84C29"));
                })
            })
        }

        //地图左侧历史 重置按钮
        $scope.reset2 = function () {
			$scope.date = "";
            HumanInsService.resetCheckBox($scope.wayList2);
			HumanInsService.resetCheckBox($scope.orbitTypes);
            $scope.myMap.clearMap();
        }

		//点击地图标记点，如果是室内为弹出层，室外则跳转到选择巡查线路弹出框
		$scope.clickMarker = function($event, $params, marker) {
            var insWayId = $scope.wayList.reduce(function (ret,n) {
                n.checked && ret.push(n.insWayId);
				return ret;
            },[]).join();
            var insItemTypeIds=$scope.itemTypeList.reduce(function (ret,n) {
                n.checked && ret.push(n.insItemTypeId);
				return ret;
            },[]).join();
          var point = marker.getExtData();
            point=angular.extend(point,{insWayId:insWayId,insItemTypeIds:insItemTypeIds});
         
           inpectCommonAction(point);
		}

		//列表巡查按钮,这里显示的是点位，无论室内还是室外都要直接跳到选择路线处
		$scope.inpect = function(point){
			inpectCommonAction(point,true);
		}

		//巡查公共方法
		function inpectCommonAction(point,isPoint){
			//室外，则直接弹出选择巡查路线弹出框
			if(point.type == 2 || isPoint){
                chooseInsWayModal(point);
				//室外标题即为点位名称
				$scope.insTitle=point.name;
			}
			else{
            //楼栋，则显示楼层信息,这里的室内是指楼栋
                var modal = $uibModal.open({
                    animation : false,
                    size : 'lg',
                    templateUrl : '/view/quality/humanIns/modal.humanIns.Inside.html',
                    controller : 'InsideController',
                    resolve : {
                        param:point
                    }
                });
                modal.result.then(function(data) {
                    /*  chooseInsWayModal(data);
                     //室内标题为室内点的名称
                     $scope.insTitle=data.name; */
                 }, function () {
                     console.log('Modal dismissed at: ' + new Date());
                   })
             }
         }
		//巡查项列表
		$scope.insItemList=[];

		//选择巡查路线弹出框 ,这里需要项目id
		function chooseInsWayModal(point) {
		    var param = {parkId : $scope.search.parkId,insPointId: point.insPointId};
            var modal = $uibModal.open({
                    animation : false,
                    templateUrl : '/view/quality/humanIns/modal.quality.chosoeWay.html',
                    controller : 'chosoeWayontroller',
                    resolve : {
                        param: function(){
                            return param;
                        }
                    }
                });
            modal.result.then(function(data) {
                //如果是室内点，这里要先关闭掉室内点的弹出框
                point.type != 2 &&  $rootScope.$broadcast("closeIndoorModal");;
                //这里集中处理视频播放的问题以及巡查项查询
                console.log(data);
                //这里集中处理视频播放的问题以及巡查项查询
               $scope.args = angular.extend({},point,data);
               
                //显示播放界面
                $scope.isPlay= true;
                //开始播放监控视频
                if($scope.args.equipmentId){
                    $scope.equipmentId = $scope.args.equipmentId;
                }else {
                    $scope.equipmentId = null;
                    alert('该巡查点没有关联摄像头');
                }
                $http.get("/ovu-pcos/pcos/quality/humanins/getInsItemFormByPointId.do?insPointId="+point.insPointId).success(function (data) {
                    if (fac.isNotEmpty(data)) {
                        //显示右边的巡查项
                        $scope.insItemList = data;
                        //点击第一个巡查项
                        if(fac.isNotEmpty($scope.insItemList)){
                            $scope.clickOneIns($scope.insItemList[0],0);
                        }
                    } else {
                        $scope.insItemList = [];
                        $scope.ins = {};
                        alert("请配置巡查项");
                        $scope.saveDisabled = true;
                    }
                });
            });
        }

	    //点击单个巡查项进行评价
		$scope.clickOneIns = function(ins,index){
	    	//选中哪个
	    	$scope.selectedListItem=index;
	    	if(!ins.imgPaths){
                ins.imgPaths = [];
            }
	    	$scope.ins = ins;
	    };
		//保存评价
	    $scope.save = function(form){
	    	form.$setSubmitted(true);
			if (!form.$valid) {
				return;
			}
	    	var param=angular.copy($scope.ins);
			if(!param.score){
                alert("请选择评分");
                return;
            }
            if(fac.isEmpty(param.imgPaths)){
                alert("请选择截屏图片");
                return;
            }
	    	param.insResultId=$scope.insResultId;
	    	param.parkId= $scope.search.parkId;
            param.imgPaths = param.imgPaths.join();
            param.orbitId = $scope.args.orbitId;
            param.insWayId = $scope.args.insWayId;
            param.insPointId = $scope.args.insPointId;
            param.pointType = $scope.args.pointType;
	    	delete param.imgPath;
	    	$http.post("/ovu-pcos/pcos/quality/humanins/saveResult.do",param , fac.postConfig).success(function (data) {
            	if(data.success){
            		msg("保存成功!");
            		$scope.insResultId =data.result.insResultId;
            		$scope.ins.isOk =true;
                    $scope.ins.id =data.result.id;
            	}else{
            		alert("操作失败!");
            	}

	    	});

	    }
	    //截取视频生产厂图片
	    $scope.cutoutImg = function (picList,limit) {
            if (limit && picList && picList.length == limit) {
                alert('上传图片限制为' + limit + '张!');
                return;
            }
            var iframe = document.getElementsByTagName('iframe')[0].contentWindow;  //获取iframe元素
            var video = iframe.document.getElementsByTagName('video')[0];  //获取视频dom
            var canvas = document.createElement('canvas')           //创建画布
            canvas.width = video.clientWidth;                       //画布的宽高等于视频的宽高
            canvas.height = video.clientHeight;
            var ctx = canvas.getContext('2d');
            ctx.drawImage(video, 0, 0, video.clientWidth, video.clientHeight); //利用canvas画图片
            var url = canvas.toDataURL();               //获取base64图片地址
            $http.post('/ovu-base/uploadBase64Img',url).success(function (data) {
                if(data.success){
                    picList && picList.push(data.url);
                }else{
                    alert('截屏失败');
                }
            })
        }
        //返回到地图页面
	   $scope.goBack = function () {
           $scope.$broadcast('destory');  //销毁video实例
           $scope.isPlay = false;
           $scope.insResultId = null;
           $scope.saveDisabled = null;
           $scope.type && $scope.finish1();
       }

	 /**
         * 需2018/5/10需求变更。InsideController点击确定不要关闭弹出框了
         */
        $scope.$on("indoorChooseInsWayModal",function(event,data){
            chooseInsWayModal(data);
            //室内标题为室内点的名称
            $scope.insTitle=data.name;
        })
	});
	//室内选择器模态框
	app.controller('InsideController', function($scope,$rootScope, $http, $uibModalInstance, $filter, fac, param) {
        $scope.noIndoorMap = true; //无室内地图，默认为true
		$scope.insTitle=param.name;   //楼栋标题
		//获取楼栋信息
		$http.get("/ovu-pcos/pcos/quality/humanins/getFloorNum.do?insPointId="+param.insPointId).success(function (data) {
            // $scope.floorNum = createContinuousArray(data.floorNum);
            $scope.oGroundNum = createContinuousArray(data.floor.oGroundNum);
            $scope.uGroundNum = createContinuousArray(data.floor.uGroundNum);
            // $scope.getPointList($scope.floorNum[0],0);
            $scope.getPointList($scope.uGroundNum,0);
           
		});
        
        //获取地上的 巡查点列表和室内地图
        $scope.getPointList = function(floor,index){
            $scope.selectedFloor=index;
           
           var arg = {insPointId:param.insPointId,floorNum:index+1,wayIds:param.insWayId,insItemTypeIds:param.insItemTypeIds};
          if(param.insWayId==""){
             delete arg.wayIds;
          }else if(param.insItemTypeIds==""){
            delete arg.insItemTypeIds;
          }
            $http.get("/ovu-pcos/pcos/quality/humanins/getInnerPointList.do",{params:arg}).success(function (data) {
                //这里修改了数据结构
                $scope.pointList = data.pointList;
                //获取到的地图json路径
                if(data.mapUrl){
                    initIndoorMap(data)
                }else{
                    $scope.noIndoorMap = true;
                }
            });
        }

        //获取地下的 巡查点列表和室内地图
        $scope.getPointLists = function(floor,index){
            $scope.selectedFloor=(-index)-1;
            var arg = {insPointId:param.insPointId,floorNum:-floor,wayIds:param.insWayId,insItemTypeIds:param.insItemTypeIds}
            if(param.insWayId==""){
                delete arg.wayIds;
             }else if(param.insItemTypeIds==""){
               delete arg.insItemTypeIds;
             }
            $http.get("/ovu-pcos/pcos/quality/humanins/getInnerPointList.do",{params:arg}).success(function (data) {
                 //这里修改了数据结构
                 $scope.pointList = data.pointList;
                 //获取到的地图json路径
                if(data.mapUrl){
                    initIndoorMap(data)
                }else{
                    $scope.noIndoorMap = true;
                }
            });
        }

		//巡查，就去监控页面
		$scope.patrol = function(item){
            // $uibModalInstance.close(item);
            $rootScope.$broadcast("indoorChooseInsWayModal",item);
		}
        $scope.$on("closeIndoorModal",function(event){
            $uibModalInstance.dismiss('cancel');
        })
		$scope.cancel = function(){
			$uibModalInstance.dismiss('cancel');
		}

		//创建连续数组
		function createContinuousArray(count) {
		    var a = [], b = 1;
		    for (; b <= count; b++)
		        a.push(b);
		    return a;
        }
        //创建连续数组

        //初始化室内地图，并打点
        function initIndoorMap(data){
            $scope.noIndoorMap = false;
            document.querySelector('#canvas').innerHTML = '';
            /* var data ={
                mapUrl : 'http://oyroeq9vl.bkt.clouddn.com/20180510164043107_794.geojson',
                pointList:[
                    {longitude:114.31819199195192,
                      latitude: 30.472834323840004,name:"666"}
                ]
            }    */
            AirocovMap.Config.set({
                showViewMode: "MODE_3D",
                zoom: 2
            });

            var map = new AirocovMap.Map({
                container: document.getElementById("canvas"),
                themeUrl: "/res/js/AirocovMap/theme/fillcolor.json",
                mapList: [
                    {
                        name: "F1",
                        mapUrl: data.mapUrl
                    }
                ]
            });

            //创建2D/3D切换控件,并设置位置
            var modeSwitch = new AirocovMap.Controls.ModeSwitch({
                left: "20px", //与容器左侧距离
                bottom: "100px", //与容器底部距离
                //position: "absolute"
            });

             //地图加载完成回调函数
             map.event.on("loaded", function () {
                //将模式切换控件添加到地图中
                map.addControl(modeSwitch);
                //开始打点
                data.pointList && data.pointList.forEach(function(point){
                    //生成图片标注
                    var imgMark = new AirocovMap.Markers.ImageMarker({
                        imgMarker: "../res/img/quality/indoor.png", //图片路径
                        size: 5, //图片大小缩放系数
                        //position:[x,y,z], //三维坐标系坐标
                        lnglat: [point.longitude, point.latitude], //经纬度坐标
                        info : point.name,
                        userData: {
                            point : point
                        },
                        y: 2, //三维坐标系坐标y值
                        mapCenter: map.getMapCenter("F1"), //地图中心点
                        callback: function (imgMark) {
                            //将图片标注添加到地图
                            map.addToLayer(imgMark, "F1", "otherGroup", true);
                        }
                    });
                })
            });

             //地图点击事件
             map.event.on("click", function (e) {
                if(e.type == "marker"){
                    var point = e.target.info.properties.userData.point;
                    $scope.patrol(point);
                }
            });
        }
        
	});

    //选择巡查路线控制器
    app.controller('chosoeWayontroller', function($scope,$http,$uibModalInstance, $filter, fac, param) {

        //进入该页面，首先要 判断今天是否已经选择了巡查路线
        //根据insOrbit进行判断
        $http.get('/ovu-pcos/pcos/quality/humanins/checkBegin.do',{params:{parkId:param.parkId}}).success(function (data) {
            //如果今天没有已选择的路线，则查询路线，否则回选这个路线即可
            if(fac.isEmpty(data.insOrbit)){
                $http.get("/ovu-pcos/pcos/quality/insway/loadWayName",{params:{parkId:param.parkId,insPointId:param.insPointId}}).success(function (data) {
                    $scope.wayList = data || [];
                })
            }
            $scope.item = data;
        })

        //确定，就去监控页面
        $scope.save = function(form,id){
            if(!$scope.item.insOrbit  || fac.isEmpty($scope.item.insOrbit.insWayId)){
                alert('请选择线路');
                return;
            }
            $scope.item.insOrbit.pointType = id;
            $uibModalInstance.close($scope.item.insOrbit);
        }
        //取消
        $scope.cancel = function(){
            $uibModalInstance.dismiss('cancel');
        }

    });
})();
