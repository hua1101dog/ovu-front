/*
   添加Canvas图层
*/



//加载单元
function OvuMap() {
}

OvuMap.prototype.name;
OvuMap.prototype.curFloor;


//配置文件主路径
OvuMap.prototype.themePath = "/res/js/mapUtils/theme.json";

OvuMap.prototype.themePath1 = "/res/js/mapUtils/fillcolor2.json";


// OvuMap.prototype.loadPath = function () {
//     let that = this;
//     $.getJSON("./views/project/project1/static/cytd_V1.14.geojson").then(function (geodata) {
//
//         $.getJSON(that.mapPath).then(function (data) {
//             //let abc = geodata;
//             data.geojsonobj = geodata;
//             that.curFloor = data;
//
//             that.loadTheme();
//         });
//     });
//
// };

OvuMap.prototype.loadTheme = function () {
    let that = this;
    $.getJSON(that.themePath1).then(function (geodata) {
        $.getJSON(that.themePath).then(function (data) {
            if (that.curFloor != undefined) {
                that.curFloor.theme = data;
                that.curFloor.theme1 = geodata;
            }
        });
    });

};


//导入JS文件
OvuMap.prototype.mapJson;
OvuMap.prototype.loadJson = function (url) {
    let that = this;
    $.getJSON(url).then(function (geodata) {
        that.mapJson = geodata;
        //resolve(geodata);
    });
}

function FuncArea() {

}

FuncArea.prototype.newOutline;
FuncArea.prototype.fillColor;

//数据处理单元
function CurMap2DData(devValue) {
  this.devValue = devValue;
}

CurMap2DData.prototype._curFloor;
CurMap2DData.prototype.theme;

CurMap2DData.prototype.newOutline;
CurMap2DData.prototype.fillColor;

CurMap2DData.prototype.FuncAreas;
CurMap2DData.prototype.devValue;

//属性处理
CurMap2DData.prototype.loadData = function (_curFloor) {
    this._curFloor = _curFloor;
    //地板属性赋值
    let floorBorderObj = this.getGeoFloorData(_curFloor);
    this.newOutline = floorBorderObj.newOutline;//_curFloor.newOutline;
    this.fillColor = floorBorderObj.fillColor;//_curFloor.fillColor;

    let roomary = this.getGeoRoomData(_curFloor);
    let _funcAreas = [];
    roomary.forEach(room => {
        let _funcArea = new FuncArea();
        //循环添加房间属性
        _funcArea.newOutline = room.newOutline;//_curFloor.FuncAreas[i].newOutline;
        _funcArea.fillColor = room.fillColor;//_curFloor.FuncAreas[i].fillColor;

        _funcAreas.push(_funcArea);
    })

    this.FuncAreas = _funcAreas;

    this.getExtremum();
}


CurMap2DData.prototype.loadJsonData = function (_curFloor) {

    // debugger;

    this.newOutline = _curFloor.newLineXY;
    this.fillColor = _curFloor.fillColor;

    let _funcAreas = [];
    _curFloor.FuncAreasMod.forEach(room => {
        let _funcArea = new FuncArea();
        //循环添加房间属性
        _funcArea.newOutline = room.newLineXY;
        _funcArea.fillColor = room.fillColor;

        _funcArea.name = room.TextName;
        _funcArea.Center = room.CenterXY;

        _funcAreas.push(_funcArea);
    })

    this.FuncAreas = _funcAreas;

    this.getExtremum();

}

//获取级值的方法
CurMap2DData.prototype.getExtremum = function () {

    if (this.newOutline.length < 2) {

        this.minX = 0;
        this.minY = 0;
        this.maxX = 0;
        this.maxY = 0;

        this.minX = minX;
        this.minY = minY;
        this.maxX = maxX;
        this.maxY = maxY;

        return;
    }
    let minX = 9999999,
        minY = 9999999,
        maxX = -9999999,
        maxY = -9999999;

    let points = this.newOutline;

    for (let i = 0; i < points.length - 1; i += 2) {

        if (points[i] > maxX) {
            maxX = points[i];
        }
        if (points[i] < minX) {
            minX = points[i];
        }
        if (points[i + 1] > maxY) {
            maxY = points[i + 1];
        }
        if (points[i + 1] < minY) {
            minY = points[i + 1];
        }
    }
    //console.log([
    //    [minX, minY],
    //    [maxX, maxY]
    //]);
    if(this.devValue==undefined){
       this.devValue=0;
    }
    this.minX = minX-this.devValue;
    this.minY = minY-this.devValue;
    this.maxX = maxX;
    this.maxY = maxY;
}

//整个地板的最小X,Y  和 最大X,Y
CurMap2DData.prototype.minX = 0;
CurMap2DData.prototype.minY = 0;
CurMap2DData.prototype.maxX = 0;
CurMap2DData.prototype.maxY = 0;


//绘图单元
function Draw2DMap(width,height,mapzoom,devValue) {
    this.canvas = document.createElement('canvas');
    this.canvas.width=width;
    this.canvas.height=height;
    this.context = this.canvas.getContext('2d');
    this.context.fillStyle = 'rgb(0,100,255)';
    this.context.strokeStyle = 'white';
    this.context.globalAlpha = 1;
    this.context.lineWidth = 2;
    this.mapZoom=mapzoom;
    this.devValue = devValue;
};
/**
 * 地图大小缩放值
 * @type {number}
 */
Draw2DMap.prototype.zoomVal = 16.8;

Draw2DMap.prototype.draw = function (_curFloor, map) {

    //let _CurMap2DData = new CurMap2DData();

    //_CurMap2DData.loadData(_curFloor);
    //_CurMap2DData.loadTheme(_curFloor.theme)
    let _CurMap2DData = new CurMap2DData(this.devValue);
    _CurMap2DData.loadJsonData(_curFloor);

    this.context.save();

    this.drawfloor( _CurMap2DData);

    this.drawRoom(_CurMap2DData);

    this.context.restore();

    this.drawContText( _CurMap2DData, map);

    this.drawPubPoints( _CurMap2DData);
}

//画最低层地板
Draw2DMap.prototype.drawfloor = function (mapdata) {
    //let theme = mapdata.theme;
    let poly = mapdata.newOutline;

    this.context.beginPath();
    //debugger;
    this.context.moveTo((poly[0] - mapdata.minX) * this.mapZoom, (-poly[1] - mapdata.minY) * this.mapZoom);
    for (let i = 2; i < poly.length - 1; i += 2) {
        this.context.lineTo((poly[i] - mapdata.minX) * this.mapZoom, (-poly[i + 1] - mapdata.minY) * this.mapZoom);
    }
    this.context.closePath();

    this.context.fillStyle = mapdata.fillColor;
    this.context.fill();
    this.context.strokeStyle = "#666666";
    this.context.lineWidth = 1;
    this.context.stroke();
};

//画房间
Draw2DMap.prototype.drawRoom = function (mapdata) {

    let funcAreas = mapdata.FuncAreas;
    for (let i = 0; i < funcAreas.length; i++) {
        let funcArea = funcAreas[i];
        let poly = funcArea.newOutline;
        if (poly.length < 6) { //less than 3 points, return
            continue;
        }
        this.context.beginPath();


        this.context.moveTo((poly[0] - mapdata.minX) * this.mapZoom, (-poly[1] - mapdata.minY) * this.mapZoom);
        for (let j = 2; j < poly.length - 1; j += 2) {
            this.context.lineTo((poly[j] - mapdata.minX) * this.mapZoom, (-poly[j + 1] - mapdata.minY) * this.mapZoom);
        }
        this.context.closePath();

        this.context.fillStyle = funcArea.fillColor;
        this.context.fill();
        this.context.stroke();
    }

};

Draw2DMap.prototype.showNames = true;
Draw2DMap.prototype.showPubPoints = false;

Draw2DMap.prototype.clearMap=function(width,height){
    this.context.clearRect(0,0,width,height)
}


Draw2DMap.prototype.drawContText = function ( mapdata, map) {
    if (!this.showNames || map.getZoom() <= this.zoomVal) return;

    let funcAreas = mapdata.FuncAreas;
    let theme = mapdata.theme;

    //let fontStyle = theme.fontStyle;
    let fontStyle = {
        "opacity": 5,
        "textAlign": "center",
        "textBaseline": "middle",
        "color": "#000000",
        "fontsize": 48,
        "halfWidth": 18,
        "fontface": "'Lantinghei SC', 'Microsoft YaHei', 'Hiragino Sans GB', 'Helvetica Neue', Helvetica, STHeiTi, Arial, sans-serif"
    }
    //_ctx.textAlign = fontStyle.textAlign;

    this.context.lineWidth = 10;
    this.context.textAlign = 'center';
    this.context.textBaseline = fontStyle.textBaseline;
    this.context.fillStyle = fontStyle.color;
    //this.context.font = fontStyle.fontsize + "px " + fontStyle.fontface;

    this.context.font = '24px Calibri';

    let textRects = [];
    for (let i = 0; i < funcAreas.length; i++) {

        let nameText = funcAreas[i].name;
        let center = funcAreas[i].Center;

        this.context.fillText(nameText, (center[0] - mapdata.minX - fontStyle.halfWidth) * this.mapZoom >> 0, (-center[1] - mapdata.minY) * this.mapZoom >> 0);
    }
}

Draw2DMap.prototype.drawPubPoints = function ( mapdata) {
    if (!this.showPubPoints) return;

    let _sprites = mapdata._sprites;
    let pubPoints = mapdata._curFloor.PubPoint;
    let imgWidth = 20, imgHeight = 20;

    let imgWidthHalf = imgWidth / 2, imgHeightHalf = imgHeight / 2;
    for (let i = 0; i < pubPoints.length; i++) {
        let pubPoint = pubPoints[i];
        let center = pubPoint.newOutline;

        pubPoint.visible = true;

        if (pubPoint.visible) {
            let image = _sprites[pubPoints[i].Type];
            if (image !== undefined) {
                //console.log(image.src);
                this.context.drawImage(image, (center[0] - mapdata.minX - imgWidthHalf) >> 0, (-center[1] - mapdata.minY - imgHeightHalf) >> 0, imgWidth, imgHeight);
                //console.log('111');
            }
        }
    }
}

//经纬度处理
function lnglat() {

}

lnglat.prototype.coordinateToMercato = function (coordinates) {

    let dinatesToMercato = coordinates.slice(0)

    dinatesToMercato = dinatesToMercato instanceof Array ? dinatesToMercato : []

    dinatesToMercato[0] = Number.parseFloat(dinatesToMercato[0]) * 20037508.34 / 180

    //dinatesToMercato[1] = Math.log(Math.tan((90 + Number.parseFloat(dinatesToMercato[1])) * Math.PI / 360)) / (Math.PI / 180)
    dinatesToMercato[1] = Number.parseFloat(dinatesToMercato[1]) * 20037508.34 / 180

    if (dinatesToMercato.includes(NaN)) {

        //console.error("The latitude and longitude format is not correct.")
        return []
    }

    return dinatesToMercato
}

lnglat.prototype.mercatoToCoordinates = function ({ mercato, mapCenter = [0, 0] }) {
    let lnglat = [],
        x, y

    x = (mercato[0] + mapCenter[0]) / 20037508.34 * 180
    y = (mercato[1] + mapCenter[1]) / 20037508.34 * 180
    y = -180 / Math.PI * (2 * Math.atan(Math.exp(y * Math.PI / 180)) - Math.PI / 2)

    lnglat.push(x)
    lnglat.push(y)

    return lnglat
}

lnglat.prototype.coordinatesToMercato = function ({ coordinates, mapCenter = [0, 0] }) {
    let lnglat = [],
        mercato;

    if (!(coordinates instanceof Array)) {
        return false
    }
    mapCenter = this.coordinateToMercato(mapCenter);
    if (coordinates[0] instanceof Array) {

        coordinates.forEach(item => {
            mercato = this.coordinateToMercato(item)
            let coordinatesDiff = []

            coordinatesDiff[0] = Math.floor(mercato[0] - mapCenter[0])
            coordinatesDiff[1] = Math.floor(mercato[1] - mapCenter[1])
            lnglat.push(coordinatesDiff)

        })

    } else {

        mercato = this.coordinateToMercato(coordinates)

        lnglat[0] = mercato[0] - mapCenter[0]
        lnglat[1] = mercato[1] - mapCenter[1]
    }

    return lnglat
}

/******************************新增***********************************/

function PathNavigation() {
}

PathNavigation.prototype.map = null;
PathNavigation.prototype.CanvasLayer = null;
PathNavigation.prototype.startPoints = [];
PathNavigation.prototype.startIndex = 0;
PathNavigation.prototype.endPoints = [];
PathNavigation.prototype.endIndex = 0;
PathNavigation.prototype.points = [];
PathNavigation.prototype.pointsMatrix = [];
PathNavigation.prototype.path = [];
PathNavigation.prototype.tracker = [];
PathNavigation.prototype.pathUrl = 'cytdnktlj.json';
PathNavigation.prototype.count = 0;
PathNavigation.prototype.timer = null;
PathNavigation.prototype.pathline = null;
PathNavigation.prototype.circle = null;


PathNavigation.prototype.loadPath = function () {


    if (this.timer !== null) {
        return;
    }


    if (this.points.length === 0) {
        let that = this;
        $.getJSON(that.pathUrl).then(function (data) {
            that.points = data;
            that.initPathNavigation();
            that.setPointsMatrix();
            that.getNearPoint();
            that.setPath();
            that.setTrack(.000009);
            that.createTrack();
            that.addInfoWindow();
            that.startMove();
            //
        });
    } else {
        this.initPathNavigation();
        this.getNearPoint();
        this.setPath();
        this.setTrack(.000009);
        this.createTrack();
        this.addInfoWindow();
        this.startMove();
    }

};


PathNavigation.prototype.initPathNavigation = function () {
    this.path = [];
    this.tracker = [];
    this.count = 0;
};


PathNavigation.prototype.setPointsMatrix = function () {

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

PathNavigation.prototype.getLenght = function (p1, p2) {
    return Math.sqrt((p1[0] - p2[0]) * (p1[0] - p2[0]) + (p1[1] - p2[1]) * (p1[1] - p2[1]));
}

PathNavigation.prototype.dijkstra = function () {
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

PathNavigation.prototype.getNearPoint = function () {
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


PathNavigation.prototype.setPath = function () {

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


PathNavigation.prototype.createTrack = function () {

    this.drawTracker();
    this.drawPoint();
    let infoWindowText_start = `<img style="width: 40px;height: 40px;" src="./img/start.png"/>`;
    this.infoWindow_start = new AMap.Marker({
        position: this.startPoints,
        content: infoWindowText_start,
        offset: new AMap.Pixel(-20, -38)
    });


    let infoWindowText_end = `<img style="width: 40px;height: 40px;" src="./img/end.png"/>`;
    this.infoWindow_end = new AMap.Marker({
        position: this.endPoints,
        content: infoWindowText_end,
        offset: new AMap.Pixel(-20, -38)
    });


}


PathNavigation.prototype.addInfoWindow = function () {
    this.map.add(this.infoWindow_start);
    this.map.add(this.infoWindow_end);
}

PathNavigation.prototype.setTrack = function (step) {
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

    this.path[1] = startLine[s_next];

    let endLine = [];
    let pn = this.path.length;
    let endLineLen = this.getLenght(this.path[pn - 2], this.path[pn - 1]);
    let _endLineLen = 0;
    while (_endLineLen < endLineLen) {
        let x = this.path[pn - 2][0] + (this.path[pn - 1][0] - this.path[pn - 2][0]) * _endLineLen / endLineLen;
        let y = this.path[pn - 2][1] + (this.path[pn - 1][1] - this.path[pn - 2][1]) * _endLineLen / endLineLen;
        endLine.push([x, y]);
        _endLineLen += step;
    }
    endLine.push(this.path[pn - 2]);
    let e_len = Number.POSITIVE_INFINITY;
    let e_next = 0;
    for (let i = 0; i < endLine.length; i++) {

        let dis = this.getLenght(this.endPoints, endLine[i]);
        if (e_len > dis) {
            e_len = dis;
            e_next = i;
        }
    }

    this.path[pn - 1] = endLine[e_next];


    this.path.push(this.endPoints);

    this.tracker.push(this.path[0]);
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
                    this.tracker.push(this.path[i + 1]);
                    tracker_len = lineMark[i + 1];
                } else {
                    let dl = lineMark[i + 1] - lineMark[i];
                    let tdl = tracker_len - lineMark[i];
                    let x = this.path[i][0] + (this.path[i + 1][0] - this.path[i][0]) * tdl / dl;
                    let y = this.path[i][1] + (this.path[i + 1][1] - this.path[i][1]) * tdl / dl;
                    this.tracker.push([x, y]);
                    tracker_len += step;
                }
            }

        }
    }


}


PathNavigation.prototype.drawTracker = function () {

    if (this.path === [])

        return;

    this.pathline = new AMap.Polyline({
        path: this.path,
        isOutline: true,
        strokeColor: "#00FF00",
        strokeOpacity: 1,
        strokeWeight: 6,
        lineJoin: 'round',
        lineCap: 'round',
        zIndex: 50,
    })
    this.map.add(this.pathline);
    this.map.setFitView([this.pathline])
};


PathNavigation.prototype.drawPoint = function (point) {

    this.circle = new AMap.Circle({
        center: point,
        radius: 7, //半径
        strokeColor: "#0000ff",
        fillColor: "#0000ff",
        zIndex: 52,
    })

    this.map.add(this.circle);
};

PathNavigation.prototype.move = function () {

    if (this.tracker === [])

        return;

    this.map.remove(this.circle);

    this.drawPoint(this.tracker[this.count]);
    this.count++;
}

PathNavigation.prototype.stopNav = function () {

    if (this.points.length === 0)
        return;
    if (this.timer) {
        clearInterval(this.timer);
        this.timer = null;
        this.map.remove([this.pathline, this.circle])
        this.infoWindow_start.hide();
        this.infoWindow_end.hide();

    }


}

PathNavigation.prototype.showInfoWindow = function () {
    this.infoWindow_start.show();
    this.infoWindow_end.show();

}

PathNavigation.prototype.startMove = function () {
    this.showInfoWindow()
    this.timer = setInterval(() => {
        if (this.count > this.tracker.length - 1)
            this.count = 0;
        this.move();
    }, 30);
}


function Marker(_class) {
    this._class = _class;
}

Marker.prototype.lnglat = [];
Marker.prototype.infoWindow = null;
Marker.prototype.infoWindowText = '';
Marker.prototype.title = '';
Marker.prototype.content = '';
Marker.prototype.imgUrl = '';
Marker.prototype.hit_imgUrl = '';

Marker.prototype.map = null;
Marker.prototype.href = '';
Marker.prototype.isRestaurant = false;
Marker.prototype.photos = null;
Marker.prototype.icon = null;
Marker.prototype.marker = null;
Marker.prototype.hit_markerImg = null;
Marker.prototype.markerImg = null;
Marker.prototype.associateM = null;

Marker.prototype.closeInfoWindow = function () {
    this.map.remove(this.infoWindow);
}


Marker.prototype.createInfoWindow = function () {

    let info = document.createElement("div");
    info.className = "info-content";

    let content_inner = document.createElement("div");
    content_inner.className = "content-inner";

    let closeX = document.createElement("span");
    closeX.innerHTML = 'x';
    closeX.className = 'close';
    closeX.onclick = () => {
        this.closeInfoWindow();

    };


    let tips_title1 = document.createElement("div");
    tips_title1.className = 'tips-title1';
    tips_title1.innerHTML = '园区导航';

    let tips_title2 = null;

    if (this.isRestaurant) {
        tips_title2 = document.createElement("div");
        tips_title2.className = 'tips-title2';
        tips_title2.innerHTML = this.title;
        tips_title2.onclick = () => {

            imgUrl = this.photos;

            initRestaurantPhotos(this.lnglat);

            $($('.dialog')[0]).css('display', 'block');

        }
    } else {

        tips_title2 = document.createElement("div");
        tips_title2.className = 'tips-title2';
        tips_title2.innerHTML = this.title;
        tips_title2.onclick = () => {
            startPathNav(startPoint, [Number(this.lnglat[0]), Number(this.lnglat[1])]);
        }

    }


    let content = document.createElement("div");
    content.className = 'content';
    content.innerHTML = this.content;

    let sharp = document.createElement("div");
    sharp.className = 'amap-info-sharp sharp';

    content_inner.appendChild(closeX);
    content_inner.appendChild(tips_title1);
    content_inner.appendChild(tips_title2);
    content_inner.appendChild(content);
    info.appendChild(content_inner);
    info.appendChild(sharp);

    this.infoWindowText = info;

};


Marker.prototype.hide = function () {
    this.map.clearInfoWindow();
    this.marker.hide();
}


Marker.prototype.show = function () {
    this.marker.show();
}

Marker.prototype.addInfoWindow = function () {
    this.createInfoWindow();
    this.infoWindow = new AMap.InfoWindow({
        isCustom: true,  //使用自定义窗体
        content: this.infoWindowText,
        offset: new AMap.Pixel(16, -10)
    });

    this.markerImg = document.createElement("img");
    this.markerImg.className = this._class;
    this.markerImg.style = 'width:40px;height:40px';
    this.markerImg.src = './img/' + this.imgUrl;

    this.hit_markerImg = document.createElement("img");
    this.hit_markerImg.className = this._class;
    this.hit_markerImg.style = 'width:50px;height:50px';
    this.hit_markerImg.src = './img/' + this.hit_imgUrl;

    this.marker = new AMap.Marker({
        map: this.map,
        position: [Number(this.lnglat[0]), Number(this.lnglat[1])],
        offset: new AMap.Pixel(-20, -20)
    });
    this.marker.setContent(this.markerImg);


    //鼠标点击marker弹出自定义的信息窗体
    AMap.event.addListener(this.marker, 'click', () => {
        if (last_marker === this)
            return
        this.infoWindow.open(this.map, this.marker.getPosition());
        this.marker.setContent(this.hit_markerImg);
        this.marker.setOffset(new AMap.Pixel(-25, -25));


        if (last_marker !== null) {
            last_marker.closeInfoWindow();
            last_marker.marker.setContent(last_marker.markerImg);
            last_marker.marker.setOffset(new AMap.Pixel(-20, -20));
        }
        last_marker = this

    });

}





