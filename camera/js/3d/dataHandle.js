//数据处理的JS
var mapData = function() {
    this.center; //整个地图的中心
    this.geojson = []; //整个地图转换后的3D坐标系中的geojson数据
    this.point; //地图上路径规划所要用到的点的信息
    this.height = 0; //地图所处高度，在多楼层显示时使用
    this.pointNumber = 0; //地图中点的个数
    this.arcs = []; //路径信息的邻接矩阵，因路径中邻接矩阵多为稀疏矩阵，利用率较低，所以本程序中只实现了邻接链表的迪杰斯特拉算法，邻接矩阵暂未使用
    this.edge = []; //路径信息的邻接链表
    this.camerajson = []; //获取摄像机的JSON字符串
    this.cameraDataList = []; //后台数据
}
mapData.prototype = {
    //加载地图和路径数据信息
    load: function(mapurl, routeurl) {
        this.getMap(mapurl);
        this.ajaxGetMap("geojson/camera.json");
        if (routeurl !== undefined) {
            this.getRoute(routeurl);
        } else {
            console.error("routeurl is not correct");
        }
    },
    //地图信息处理程序
    //1.
    //[104.06054645169002, 30.67096538979]
    //[11583967.041059423, 3590091.056485579]
    //2.
    //[104.06117859796001, 30.67142410508]
    //[11584037.411260296, 3590150.425661111]
    //
    coordinates2Mercator: function(lnglat) { //经纬度转墨卡托坐标

        // lnglat = lnglat instanceof Array ? lnglat : [];
        // lnglat[0] = lnglat[0] * 20037508.34 / 180;
        // lnglat[1] = Math.log(Math.tan((90 + Number(lnglat[1])) * Math.PI / 360)) / (Math.PI / 180);
        // lnglat[1] = lnglat[1] * 20037508.34 / 180;
        // return lnglat;
        // debugger;

        var lng = lnglat instanceof Array ? lnglat.slice() : [];
        lng[0] = lng[0] * 20037508.34 / 180;
        lng[1] = Math.log(Math.tan((90 + Number(lng[1])) * Math.PI / 360)) / (Math.PI / 180);
        lng[1] = lng[1] * 20037508.34 / 180;
        return lng;

    },
    //
    //转化成3D地图信息
    //1.
    //
    //
    //
    //
    //
    //
    coordinates2ToCoordinates3: function(array) { //经纬度转换到三维坐标系中的坐标
        //debugger;
        var arr = [];
        for (var i = 0; i < array.length; i++) {
            var a = this.coordinates2Mercator(array[i]);
            var b = [];
            b[0] = a[0] - this.center[0];
            b[1] = a[1] - this.center[1];
            arr.push(b);
        }
        return arr;
    },
    computeGrith: function(array) { //计算边缘周长
        var total = 0;
        for (var i = 0; i < array.length - 1; i++) {
            var a = Math.sqrt(Math.pow((array[i][0] - array[i + 1][0]), 2) + Math.pow((array[i][1] - array[i + 1][1]), 2));
            total = total + a;
        }
        return total;
    },
    sort: function() { //对geojson中的数据根据self_id排序;
        for (var i = 0; i < this.geojson.length; i++) {
            for (var j = i; j < this.geojson.length; j++) {
                var x = parseInt(this.geojson[i].self_id);
                var y = parseInt(this.geojson[j].self_id);
                if (x > y) {
                    var tmp = this.geojson[i];
                    this.geojson[i] = this.geojson[j];
                    this.geojson[j] = tmp;
                }
            }
        }
    },
    ajaxGetMap: function(url) { // 加载摄像头的数据
        var that = this;

        //debugger  

        $.ajaxSetup({
            async: false
        });

        //$.post(url,
        //{
        //  equipment:"camera"
        //},
        //function(data,status){
        //  if(status === 'success' ){
        //     that.camerajson = data; 
        //  }
        //});

        // 刘牛绘制camerajson
        // $.getJSON(url, function (data, status) {
        //     if (status === 'success') {
        //         that.camerajson = data;
        //     }
        // });


        // 获取后台数据    
        $.get('/ovu-pcos/pcos/CameraRange/queryCameraList.do?mapId=1').success(function(res) {
            // var dataList = res;
            that.cameraDataList = res;
        });

    },
    getMap: function(url) { //根据URL获得地图数据
        var that = this;
        $.ajaxSetup({
            async: false
        });
        $.getJSON(url, function(data, status) {
            if (status === 'success') {
                //debugger;
                //寻找地图中心点
                for (var i = 0; i < data.features.length; i++) {
                    if (data.features[i].properties.specialSite == 0) {

                        //console.log("JSON字符串 开始.......");
                        //console.log(data.features[i]);
                        //console.log(JSON.stringify(data.features[i]));
                        //console.log("JSON字符串 结束.......");

                        that.center = that.coordinates2Mercator(data.features[i].geometry.coordinates);
                        break;
                    }
                }
                //that.center = that.coordinates2Mercator(data.center);
                //获得point类型的数目，减少循环次数
                for (var i = 0; i < data.features.length; i++) {
                    if (data.features[i].geometry.type == "LineString") {
                        that.pointNumber = i;
                        break;
                    }
                }
                //解析地图数据，生成geojson对象数组
                for (var i = 0; i < that.pointNumber; i++) {
                    var obj = {};
                    obj.name = data.features[i].properties.name;
                    obj.self_id = data.features[i].properties.self_id;
                    obj.relative_id = data.features[i].properties.relative_id;
                    obj.specialSite = data.features[i].properties.specialSite;
                    if (obj.specialSite == 0) {
                        obj.y = -0.5; //建筑物在3D场景中在竖坐标的位置
                        obj.h = 0.5; //建筑物的高度
                        obj.gap = 1; //建筑物缩放比例
                        // obj.gap = 20.940054110842684;
                    } else {
                        obj.y = 0;
                        obj.h = 2;
                        obj.gap = 1;
                        // obj.gap = 20.940054110842684;
                    }
                    var coor = that.coordinates2Mercator(data.features[i].geometry.coordinates);
                    var arr = [];
                    arr[0] = coor[0] - that.center[0];
                    arr[1] = coor[1] - that.center[1];
                    obj.center = arr;
                    for (var j = that.pointNumber; j < data.features.length; j++) {
                        if (data.features[j].properties.relative_id == obj.self_id) {
                            obj.fillColor = data.features[j].properties.fillcolor;
                            var line = that.coordinates2ToCoordinates3(data.features[j].geometry.coordinates);
                            obj.line = line;
                            obj.grith = that.computeGrith(line);
                            break;
                        }
                    }
                    that.geojson.push(obj);
                }
                //将生成的geojson排序
                that.sort();
            }
        })
    },
    //路径信息处理程序
    getRoute: function(url) {
        var that = this;
        $.ajaxSetup({
            async: false
        });
        $.getJSON(url, function(data, status) {
            if (status == 'success') {
                that.point = data;
                that.arcs = that.getArcs(that.point);
                that.edge = that.getEdge(that.point);
            }
        })
    },
    //判断路径数据中两个点是否相邻
    isAdjacent: function(point, pointA, pointB) {
        for (var i in point[pointA].nextPoint) {
            if (point[pointA].nextPoint[i] == pointB) {
                return true;
            }
        }
        return false;
    },
    //计算两个点的距离
    distance: function(p1, p2) {
        var dis = Math.sqrt(Math.pow(p1[0] - p2[0], 2) + Math.pow((p1[1] - p2[1]), 2));
        return dis;
    },
    //获得路径中两个相邻点的距离
    getDistance: function(point, start, end) {
        //var Sdistance = Math.sqrt((point[start].coor[0] - point[end].coor[0]) * (point[start].coor[0] - point[end].coor[0]) + (point[start].coor[1] - point[end].coor[1]) * (point[start].coor[1] - point[end].coor[1]));
        var Sdistance = this.distance(point[start].coor, point[end].coor);
        return Sdistance;
    },
    //获得路径信息的邻接矩阵.方便使用迪杰斯特拉算法
    getArcs: function(point) {
        var len = point.length;
        var array = new Array(len);
        for (var i = 0; i < len; i++) {
            array[i] = new Array(len);
            for (var j = 0; j < len; j++) {
                if (this.isAdjacent(point, i, j)) {
                    array[i][j] = this.getDistance(point, i, j);
                } else {
                    array[i][j] = Number.POSITIVE_INFINITY; //正无穷大
                }
            }
        }
        return array;
    },
    //获得路径信息的邻接链表
    getEdge: function(point) {
        var edge = new Array(point.length);
        for (var i = 0; i < point.length; i++) {
            edge[i] = [];
            for (var j = 0; j < point[i].nextPoint.length; j++) {
                edge[i][j] = {};
                edge[i][j].next = point[i].nextPoint[j];
                edge[i][j].cost = this.getDistance(point, i, point[i].nextPoint[j]);
            }
        }
        return edge;
    },
    //根据self_id获取对应的模型数据信息;
    getModelInfo: function(self_id) {
        var info = null;
        for (var i = 0; i < this.geojson.length; i++) {
            if (self_id == this.geojson[i].self_id) {
                info = this.geojson[i];
            }
        }
        return info;
    },
    //根据id在路径数据中获得距离最近的点
    getNearestPoint: function(id) {
        var p;
        var dis = Number.POSITIVE_INFINITY;
        //获取id对应的坐标
        var coor = this.getModelInfo(id).center;
        //根据坐标，在point中找距离最近的点，返回其在数组中所在位置
        for (var i = 0; i < this.point.length; i++) {
            var d = this.distance(coor, this.point[i].coor);
            if (d < dis) {
                p = i;
                dis = d;
            }
        }
        return p;
    },
    //根据起点和终点，寻找最短路径
    findPathById: function(start, end) {
        if (this.getModelInfo(start) == null || this.getModelInfo(end) == null) {
            //alert("起点或终点不存在");
            return;
        }
        var path = [];
        var pstart = this.getNearestPoint(start);
        var pend = this.getNearestPoint(end);
        var obj = this.Dijstra(pstart);
        var s = pend;
        //终点坐标加入路径
        path.push(this.getModelInfo(end).center);
        while (s != pstart) {
            path.push(this.point[s].coor);
            s = obj.last[s];
        }
        path.push(this.point[pstart].coor);
        //起点坐标加入路径
        path.push(this.getModelInfo(start).center);
        return path;
    },
    //迪杰斯特拉算法
    Dijstra: function(start) {
        var length = this.point.length;
        var mark = new Array(length);
        var dis = new Array(length);
        var last = new Array(length);
        //初始化
        for (var i = 0; i < length; i++) {
            mark[i] = false; //所有节点均不属于集合
            dis[i] = -1; //所有节点均不可达
            last[i] = -1;
        }
        dis[start] = 0; //  将起始节点加入集合
        mark[start] = true;
        var newP = start;
        for (var i = 1; i < length; i++) {
            for (var j = 0; j < this.edge[newP].length; j++) {
                var t = this.edge[newP][j].next;
                var c = this.edge[newP][j].cost;
                if (mark[t] == true) continue;
                if (dis[t] == -1 || dis[t] > dis[newP] + c) {
                    dis[t] = dis[newP] + c;
                    last[t] = newP;
                }
            }
            var min = Number.POSITIVE_INFINITY;
            for (var j = 0; j < length; j++) {
                if (mark[j] == true) continue;
                if (dis[j] == -1) continue;
                if (dis[j] < min) {
                    min = dis[j];
                    newP = j;
                }
            }
            mark[newP] = true;
        }
        return { dis: dis, last: last }
    }
}