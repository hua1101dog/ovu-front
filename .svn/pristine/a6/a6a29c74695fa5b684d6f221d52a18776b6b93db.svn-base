//加载单元
function Ovu3DMap() {
}

var latDeviation = .005482
var lngDeviation = -.002465


Ovu3DMap.prototype.name;

//加载地图，生成JSON
Ovu3DMap.prototype.mapJson;
Ovu3DMap.prototype.loadJson = function (url) {
    var that = this;
    var pro = new Promise(function fn1(resolve, reject) {
        $.getJSON(url).then(function (geodata) {
            that.mapJson = geodata;
            resolve(geodata);
        });
    });
    return pro;
}

//转化工具方法;
function ArrayUtil(name) {
    this.name = name
}

ArrayUtil.prototype.name;
ArrayUtil.prototype.LaglatArray = function (arr) {
    var boundsArr = [];
    if (arr.length < 2) {
        return boundsArr;
    }
    arr.filter(function (item) {
        boundsArr.push(new AMap.LngLat(item.O + latDeviation, item.N + lngDeviation));
    })
    return boundsArr

};

//楼层信息;
function CurMap3DData(name) {
    this.name = name
}

CurMap3DData.prototype.newOutline = [];
CurMap3DData.prototype.height;
CurMap3DData.prototype.fillColor;
CurMap3DData.prototype.center = [];
CurMap3DData.prototype.textName;

CurMap3DData.prototype.FuncAreas = [];

CurMap3DData.prototype.loadJsonData = function (_curFloor) {

    //地板属性赋值
    this.getGeoFloorData(_curFloor);
    this.getGeoRoomData(_curFloor);
}
/***
 * 获取地图数据中的最低层地板边线数据的数组
 *
 */
CurMap3DData.prototype.getGeoFloorData = function (data) {

    var util = new ArrayUtil();
    var parobj = {};

    this.fillColor = data.fillColor
    this.textName = ""
    this.height = data.height;

    //经纬度转化
    this.newOutline = util.LaglatArray(data.FloorArealine);
    this.center = data.center;

    return parobj;
}
/**
 * 返回所有房间的边界区域数据
 * @author Yuanpan
 * @param data
 */
CurMap3DData.prototype.getGeoRoomData = function (data) {

    var util = new ArrayUtil();

    var roomArray = [];
    data.FuncAreasMod.forEach(itemLine => {

        //房间对象
        var _funcArea = new FuncArea();

        //循环添加房间属性
        _funcArea.newOutline = util.LaglatArray(itemLine.buildingOutline);
        _funcArea.height = itemLine.height;
        _funcArea.fillColor = itemLine.fillColor;
        _funcArea.CenterPoint = [itemLine.CenterPoint[0] + latDeviation, itemLine.CenterPoint[1] + lngDeviation];
        _funcArea.TextName = itemLine.TextName;

        roomArray.push(_funcArea);

    });

    this.FuncAreas = roomArray;

};


//房间信息
function FuncArea(name) {
    this.name = name
}

FuncArea.prototype.newOutline = [];
FuncArea.prototype.height;
FuncArea.prototype.fillColor = "";
FuncArea.prototype.center = [];
FuncArea.prototype.textName;

function Draw3DMap(name) {
    this.name = name
}

Draw3DMap.prototype.map;
Draw3DMap.prototype.object3Dlayer;

Draw3DMap.prototype.zoomVal = 16.8;
Draw3DMap.prototype.zoomBo = true;
Draw3DMap.prototype._CurMap3DData;
Draw3DMap.prototype.textArr = [];


//画图的核心方法
Draw3DMap.prototype.draw = function (map, _curFloor, object3Dlayer) {

    //设置地图的光线
    map.AmbientLight = new AMap.Lights.AmbientLight([1, 1, 1], .9);
    map.DirectionLight = new AMap.Lights.DirectionLight([-6, -2, 14], [1, 1, 1], .2);


    //加载数据
    //object3Dlayer.clear();

    //赋值方法
    this.map = map;
    this.object3Dlayer = object3Dlayer;


    if (map.getZoom() <= this.zoomVal) {
        this.zoomBo = false;
    } else {
        this.zoomBo = true
    }

    var _CurMap3DData = new CurMap3DData()
    _CurMap3DData.loadJsonData(_curFloor);

    this._CurMap3DData = _CurMap3DData;

    //重画算法
    //object3Dlayer.reDraw();
    //画地板
    this.Draw3DMapFloor(_CurMap3DData);
    //画房间
    for (var i = 0; i < _CurMap3DData.FuncAreas.length; i++) {
        var funcArea = _CurMap3DData.FuncAreas[i];
        this.Draw3DMapFuncArea(funcArea);
    }


}

//画地板模型的方法
Draw3DMap.prototype.Draw3DMapFloor = function (CurMap3DData) {

    var map = this.map;
    var object3Dlayer = this.object3Dlayer;

    var prism = new AMap.Object3D.Prism({
        path: CurMap3DData.newOutline,
        height: CurMap3DData.height,
        color: CurMap3DData.fillColor
    });

    prism.transparent = true;
    object3Dlayer.add(prism);

    if (CurMap3DData.textName) {
        var text = new AMap.Text({
            text: CurMap3DData.textName,
            verticalAlign: 'bottom',
            position: CurMap3DData.CenterPoint,
            height: CurMap3DData.height,
            style: {
                'background-color': 'transparent',
                '-webkit-text-stroke': 'red',
                '-webkit-text-stroke-width': '0.5px',
                'text-align': 'center',
                'border': 'none',
                'color': 'white',
                'font-size': '24px',
                'font-weight': 600
            }
        });
        text.setMap(map);
    }
}

//画房间模型的方法
Draw3DMap.prototype.Draw3DMapFuncArea = function (funcArea) {

    var object3Dlayer = this.object3Dlayer;

    //console.log(funcArea.height);

    var prism = new AMap.Object3D.Prism({
        path: funcArea.newOutline,
        height: funcArea.height * 5,
        color: funcArea.fillColor
    });

    prism.transparent = true;
    object3Dlayer.add(prism);

    this.Draw3DMapTextLabel(funcArea, this.zoomBo);

}


//绘制文字的方法
Draw3DMap.prototype.Draw3DMapText = function () {

    var _CurMap3DData = this._CurMap3DData

    var map = this.map;
    if (_CurMap3DData === undefined) {
        return;
    }

    if (map.getZoom() <= this.zoomVal) {
        //map.clearMap();
        this.textArr.forEach(value => {
            value.hide();
        })
        this.zoomBo = false;
    } else {
        if (this.zoomBo) return;
        //
        // for (var i = 0; i < _CurMap3DData.FuncAreas.length; i++) {
        //     this.Draw3DMapTextLabel(_CurMap3DData.FuncAreas[i], false);
        // }

        this.textArr.forEach(value => {
            value.show();
        })

        this.zoomBo = true;
    }

}

//绘制单个文字标题的方法
Draw3DMap.prototype.Draw3DMapTextLabel = function (funcArea, drawFlag) {

    var map = this.map;

    if ((funcArea.TextName && !this.zoomBo) || drawFlag) {
        var text = new AMap.Text({
            text: funcArea.TextName,
            verticalAlign: 'bottom',
            position: funcArea.CenterPoint,
            height: funcArea.height * 5 + 1,
            style: {
                'background-color': 'transparent',
                '-webkit-text-stroke': '#666666',
                '-webkit-text-stroke-width': '0.5px',
                'text-align': 'center',
                'border': 'none',
                'color': 'black',
                'font-size': '12px',
            }
        });

        text.setMap(map);
        this.textArr.push(text);

    }


}


//路径导航

function PathNavigation3D() {
}

PathNavigation3D.prototype.map = null;
PathNavigation3D.prototype.startPoints = [];
PathNavigation3D.prototype.startIndex = 0;
PathNavigation3D.prototype.endPoints = [];
PathNavigation3D.prototype.endIndex = 0;
PathNavigation3D.prototype.points = [];
PathNavigation3D.prototype.pointsMatrix = [];
PathNavigation3D.prototype.path = [];
PathNavigation3D.prototype.tracker = [];
PathNavigation3D.prototype.meshLine = null;
PathNavigation3D.prototype.object3Dlayer = null;
PathNavigation3D.prototype.pathUrl = 'cytdnktlj.json';
PathNavigation3D.prototype.count = 0;
PathNavigation3D.prototype.timer = null;
PathNavigation3D.prototype.options = {
    lineWidth: 5,
    lineColor: 'rgba(0,255,0, 1.0)',
    pointColor: [0, 0, 1, 1],
    pointSize: 30,
    height: 20,
};

PathNavigation3D.prototype.loadPath = function () {


    if (this.timer !== null) {
        return;
    }


    if (this.points.length === 0) {
        let that = this;
        $.getJSON(that.pathUrl).then(function (data) {
            that.points = data;
            that.initPathNavigation3D();
            that.setPointsMatrix();
            that.getNearPoint();
            that.setPath();
            that.setTrack(.000009);
            that.drawTracker();
            that.addInfoWindow();
            that.stopNav();
            that.startMove();
        });
    } else {
        this.initPathNavigation3D();
        this.getNearPoint();
        this.setPath();
        this.setTrack(.000009);
        this.drawTracker();
        this.addInfoWindow();
        this.stopNav();
        this.startMove();

    }

};


PathNavigation3D.prototype.initPathNavigation3D = function () {
    this.path = [];
    this.tracker = [];
    this.count = 0;
};


PathNavigation3D.prototype.setPointsMatrix = function () {

    for (let i = 0, len = this.points.length; i < len; i++) {
        let row = [];
        for (let j = 0; j < len; j++) {
            if (i === j) {
                row.push(0);
            }
            else {
                row.push(Infinity);
            }
        }
        this.pointsMatrix.push(row);
    }

    for (let i = 0, len = this.points.length; i < len; i++) {
        let curPoint = this.points[i];
        for (let j = 0, nextP_len = curPoint.nextPoint.length; j < nextP_len; j++) {
            this.pointsMatrix[i][curPoint.nextPoint[j]] = this.getLenght(curPoint.coor, this.points[curPoint.nextPoint[j]].coor);
        }
    }
};

PathNavigation3D.prototype.getLenght = function (p1, p2) {
    return Math.sqrt((p1[0] - p2[0]) * (p1[0] - p2[0]) + (p1[1] - p2[1]) * (p1[1] - p2[1]));

}

PathNavigation3D.prototype.dijkstra = function () {
    let dist = []
    let prevPath = []
    let s = new Array();
    for (let i = 0; i < this.pointsMatrix.length; i++) {
        s[i] = 0;
        dist[i] = this.pointsMatrix[this.startIndex][i];
        prevPath.push([this.startIndex, i])
    }
    dist[this.startIndex] = 0;
    s[this.startIndex] = 1;

    for (let i = 1; i < this.pointsMatrix.length - 1; i++) {

        let min = Number.POSITIVE_INFINITY;
        let v = -1;

        for (let w = 0; w < this.pointsMatrix.length; w++) {
            if (s[w] == 0 && dist[w] < min) {
                v = w;
                min = dist[w];
            }
        }
        if (v == -1) {
            break;
        }

        s[v] = 1;

        for (let j = 0; j < this.pointsMatrix.length; j++) {
            if (s[j] == 0 && min + this.pointsMatrix[v][j] < dist[j]) {
                dist[j] = min + this.pointsMatrix[v][j];
                for (let n = 0; n < prevPath[v].length; n++) {
                    prevPath[j][n] = prevPath[v][n];
                }
                prevPath[j].push(j)
            }
        }
    }
    return prevPath
}

PathNavigation3D.prototype.getNearPoint = function () {
    let start_dis = Number.POSITIVE_INFINITY;
    let end_dis = Number.POSITIVE_INFINITY;
    for (let i = 0; i < this.points.length; i++) {
        let s_dis = this.getLenght(this.startPoints, this.points[i].lnglat)
        if (start_dis > s_dis) {
            start_dis = s_dis;
            this.startIndex = i;
        }
        let e_dis = this.getLenght(this.endPoints, this.points[i].lnglat)
        if (end_dis > e_dis) {
            end_dis = e_dis;
            this.endIndex = i;
        }
    }
}


PathNavigation3D.prototype.setPath = function () {
    let _path = this.dijkstra();
    let mark = [];
    mark.push(_path[this.endIndex][0]);
    for (let i = 1, len = _path[this.endIndex].length; i < len; i++) {
        if (mark[mark.length - 1] !== _path[this.endIndex][i]) {
            mark.push(_path[this.endIndex][i]);
        }
    }
    this.path.push(this.startPoints);
    for (let i = 0; i < mark.length; i++) {
        this.path.push([this.points[mark[i]].lnglat[0], this.points[mark[i]].lnglat[1]]);

    }

}

PathNavigation3D.prototype.setTrack = function (step) {
    if (this.path === [])

        return;

    let startLine = [];
    let startLineLen = this.getLenght(this.path[1], this.path[2]);
    let _startLineLen = 0;
    while (_startLineLen < startLineLen) {
        let x = this.path[1][0] + (this.path[2][0] - this.path[1][0]) * _startLineLen / startLineLen;
        let y = this.path[1][1] + (this.path[2][1] - this.path[1][1]) * _startLineLen / startLineLen;
        startLine.push([x, y]);
        _startLineLen += step;
    }
    startLine.push(this.path[2]);

    let s_len = Number.POSITIVE_INFINITY;
    let s_next = 0;
    for (let i = 0; i < startLine.length; i++) {
        let dis = this.getLenght(this.startPoints, startLine[i]);
        if (s_len > dis) {
            s_len = dis;
            s_next = i;
        }
    }

    this.path[1]=startLine[s_next];

    let endLine = [];
    let pn = this.path.length;
    let endLineLen = this.getLenght(this.path[pn-2], this.path[pn-1]);
    let _endLineLen = 0;
    while (_endLineLen < endLineLen) {
        let x = this.path[pn-2][0] + (this.path[pn-1][0] - this.path[pn-2][0]) * _endLineLen / endLineLen;
        let y = this.path[pn-2][1] + (this.path[pn-1][1] - this.path[pn-2][1]) * _endLineLen / endLineLen;
        endLine.push([x, y]);
        _endLineLen += step;
    }
    endLine.push(this.path[pn-2]);
    let e_len = Number.POSITIVE_INFINITY;
    let e_next = 0;
    for (let i = 0; i < endLine.length; i++) {

        let dis = this.getLenght(this.endPoints, endLine[i]);
        if (e_len > dis) {
            e_len = dis;
            e_next = i;
        }
    }

    this.path[pn-1]=endLine[e_next];


    this.path.push(this.endPoints);



    let _lnglat = this.map.lngLatToGeodeticCoord(new AMap.LngLat(this.path[0][0], this.path[0][1]));
    this.tracker.push(_lnglat);
    let tracker_len = 0;
    let sum = 0;
    let lineMark = [];
    lineMark.push(0);
    for (let i = 0; i < this.path.length - 1; i++) {
        sum += Math.sqrt((this.path[i][0] - this.path[i + 1][0]) * (this.path[i][0] - this.path[i + 1][0]) + (this.path[i][1] - this.path[i + 1][1]) * (this.path[i][1] - this.path[i + 1][1]));
        lineMark.push(sum);
    }
    while (tracker_len < sum) {
        for (let i = 0; i < lineMark.length - 1; i++) {
            if (lineMark[i] <= tracker_len && lineMark[i + 1] > tracker_len) {
                if (lineMark[i + 1] < tracker_len + step) {
                    let lnglat = this.map.lngLatToGeodeticCoord(new AMap.LngLat(this.path[i + 1][0], this.path[i + 1][1]));
                    this.tracker.push(lnglat);
                    tracker_len = lineMark[i + 1];
                } else {
                    let dl = lineMark[i + 1] - lineMark[i];
                    let tdl = tracker_len - lineMark[i];
                    let x = this.path[i][0] + (this.path[i + 1][0] - this.path[i][0]) * tdl / dl;
                    let y = this.path[i][1] + (this.path[i + 1][1] - this.path[i][1]) * tdl / dl;
                    let lnglat = this.map.lngLatToGeodeticCoord(new AMap.LngLat(x, y));
                    this.tracker.push(lnglat);
                    tracker_len += step;
                }
            }

        }
    }


}


PathNavigation3D.prototype.drawTracker = function () {


    let points = [];

    this.path.forEach((v) => {
        points.push(new AMap.LngLat(v[0], v[1]))
    });

    this.meshLine = new AMap.Object3D.MeshLine({
        path: points,
        height: 1,
        color: this.options.lineColor,
        width: this.options.lineWidth,
    });


    let infoWindowText_start = `<img style="width: 40px;height: 40px;" src="./img/start.png"/>`;
    this.infoWindow_start = new AMap.Marker({
        position: this.startPoints,
        content: infoWindowText_start,
        offset: new AMap.Pixel(-20, -40)
    });


    let infoWindowText_end = `<img style="width: 40px;height: 40px;" src="./img/end.png"/>`;
    this.infoWindow_end = new AMap.Marker({
        position: this.endPoints,
        content: infoWindowText_end,
        offset: new AMap.Pixel(-20, -40)
    });


};

PathNavigation3D.prototype.addInfoWindow = function () {
    this.map.add(this.infoWindow_start);
    this.map.add(this.infoWindow_end);
    this.map.add(this.object3Dlayer);
    this.infoWindow_start.hide();
    this.infoWindow_end.hide();
}

PathNavigation3D.prototype.showInfoWindow = function () {
    this.infoWindow_end.show();
    this.infoWindow_start.show();
}


PathNavigation3D.prototype.drawPoint = function (center) {
    let segment = 20;
    let cylinder = new AMap.Object3D.Mesh();
    let geometry = cylinder.geometry;
    let verticesLength = segment * 2;
    let path = []
    for (let i = 0; i < segment; i += 1) {
        let angle = 2 * Math.PI * i / segment;
        let x = center.x + Math.cos(angle) * this.options.pointSize;
        let y = center.y + Math.sin(angle) * this.options.pointSize;
        path.push([x, y]);
        geometry.vertices.push(x, y, -1); //底部顶点
        geometry.vertices.push(x, y, -2); //顶部顶点

        geometry.vertexColors.push.apply(geometry.vertexColors, this.options.pointColor); //底部颜色
        geometry.vertexColors.push.apply(geometry.vertexColors, this.options.pointColor); //顶部颜色

        let bottomIndex = i * 2;
        let topIndex = bottomIndex + 1;
        let nextBottomIndex = (bottomIndex + 2) % verticesLength;
        let nextTopIndex = (bottomIndex + 3) % verticesLength;

        geometry.faces.push(bottomIndex, topIndex, nextTopIndex); //侧面三角形1
        geometry.faces.push(bottomIndex, nextTopIndex, nextBottomIndex); //侧面三角形2
    }

    // 构建顶面三角形,为了区分顶面点和侧面点使用不一样的颜色,所以需要独立的顶点
    for (let i = 0; i < segment; i += 1) {
        geometry.vertices.push.apply(geometry.vertices, geometry.vertices.slice(i * 6 + 3, i * 6 + 6)); //底部顶点
        geometry.vertexColors.push.apply(geometry.vertexColors, this.options.pointColor);
    }

    let triangles = AMap.GeometryUtil.triangulateShape(path);
    let offset = segment * 2;

    for (let v = 0; v < triangles.length; v += 3) {
        geometry.faces.push(triangles[v] + offset, triangles[v + 2] + offset, triangles[v + 1] + offset);
    }

    return cylinder;
};

PathNavigation3D.prototype.move = function () {

    if (this.tracker === [])

        return;

    this.object3Dlayer.clear();

    this.object3Dlayer.add(this.meshLine);

    this.object3Dlayer.add(this.drawPoint(this.tracker[this.count]));

    ++this.count;
}

PathNavigation3D.prototype.stopNav = function () {
    if (this.timer===null)
        return;
    if (this.timer) {
        clearInterval(this.timer);
        this.timer = null;
    }
    this.object3Dlayer.clear();
    this.infoWindow_start.hide();
    this.infoWindow_end.hide();

}

PathNavigation3D.prototype.startMove = function () {
    this.showInfoWindow();
    this.timer = setInterval(() => {
        if (this.count > this.tracker.length - 1)
            this.count = 0;
        this.move();
    }, 30);
}