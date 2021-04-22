var THREE = require("../vendor/Three");
var helper = require("../models/helper");
var draw = {
    highLightModel: [],
    clickModels: [],
    autoModels: [],
    baseUrl: null,
    draw: function (array) {
        var floor = new THREE.Mesh(),
            logoGroup = new THREE.Group(),
            planeGroup = new THREE.Group(),
            roomGroup = new THREE.Group(),
            nameGroup = new THREE.Group(),
            roomLineGroup = new THREE.Group(),
            bottom, pulicUtilities, otherModels, room, name, roomLine;
        for (var i = 0; i < array.length; i++) {
            if (array[i].sType == 0) {
                bottom = this.drawRoom(array[i]);
                roomGroup.add(bottom);
                this.clickModels.push(bottom);
            } else if (1 <= array[i].sType && array[i].sType < 500) {
                pulicUtilities = this.drawLogo(array[i]);
                if (pulicUtilities != null) {
                    logoGroup.add(pulicUtilities);
                    this.autoModels.push(pulicUtilities);
                }
            } else if (500 <= array[i].sType && array[i].sType < 1000) {
                otherModels = this.drawLogo(array[i]);
                if (otherModels != null) {
                    logoGroup.add(otherModels);
                    this.clickModels.push(otherModels);
                }
            } else if (1000 <= array[i].sType && array[i].sType < 2000) {
                roomLine = this.drawLine(array[i]);
                roomLine.forEach(function (line) {
                    roomLineGroup.add(line);
                })
                room = this.drawRoom(array[i]);
                roomGroup.add(room);
                if (room.info.sType != 1000) {
                    this.clickModels.push(room);
                }
                name = this.drawName(array[i]);
                if (name != null) {
                    nameGroup.add(name);
                    this.autoModels.push(name);
                }
            } else if (array[i].sType > 2000) {
                room = this.drawRoom(array[i]);
                planeGroup.add(room);
                name = this.drawName(array[i]);
                if (name != null) {
                    nameGroup.add(name);
                    this.autoModels.push(name);
                }
            }
        }


        logoGroup.name = "logo";
        floor.add(logoGroup);
        planeGroup.name = "plane";
        floor.add(planeGroup);

        roomLineGroup.name = "roomLine";
        floor.add(roomLineGroup);


        roomGroup.name = "room";
        floor.add(roomGroup);
        nameGroup.name = "name";
        floor.add(nameGroup);
        floor.name = "floor";
        return floor;
    },
    //绘制模块边框线
    drawLine: function (obj) {
        var lines = [];
        var geometry = new THREE.Geometry();
        var lineMaterial = new THREE.LineBasicMaterial({color: obj.strokecolor ? obj.strokecolor : "#B6B6B7"});
        var gap = obj.gap ? obj.gap : 1;
        for (var n = 0; n < obj.line.length; n++) {
            var rx = gap * (obj.line[n][0] - obj.center[0]) + obj.center[0];
            var ry = gap * (obj.line[n][1] - obj.center[1]) + obj.center[1];

            geometry.vertices.push(new THREE.Vector3(rx, obj.height, -ry));
            lines.push(new THREE.Line(geometry, lineMaterial));

        }
        return lines;
    },
    //绘制房间
    drawRoom: function (obj) {
        var shape = new THREE.Shape();
        var gap = obj.gap ? obj.gap : 1; //房间大小的缩放比例
        //将房间边缘按点连线
        var rx = gap * (obj.line[0][0] - obj.center[0]) + obj.center[0];
        var ry = gap * (obj.line[0][1] - obj.center[1]) + obj.center[1];
        shape.moveTo(rx, ry);
        for (var i = 1; i < obj.line.length; i++) {
            rx = gap * (obj.line[i][0] - obj.center[0]) + obj.center[0];
            ry = gap * (obj.line[i][1] - obj.center[1]) + obj.center[1];
            shape.lineTo(rx, ry);
        }

        //把shape变成三维的几何体
        if (obj.sType == 0) {
            obj.y = obj.y ? obj.y : -1;
            obj.height = (obj.height != null) ? obj.height : 1;
            obj.fillcolor = obj.fillcolor ? obj.fillcolor : "#efefef";
        } else {
            if (obj.sType == 1000) {
                obj.height = (obj.height != null) ? obj.height : 10;
            } else {
                obj.height = (obj.height != null) ? obj.height : 3;
            }
            obj.y = (obj.y != null) ? obj.y : 0;
            obj.fillcolor = obj.fillcolor ? obj.fillcolor : "#35B2EA";
        }

        var extrudeSettings = {amount: obj.height, bevelEnabled: false};
        var roomShape = new THREE.ExtrudeGeometry(shape, extrudeSettings);

        var room = new THREE.Mesh(roomShape,
            new THREE.MeshLambertMaterial({
                color: obj.fillcolor,
                side: THREE.DoubleSide
            })
        );
        //设置几何体位置
        room.rotation.x = -Math.PI / 2;
        room.position.setY(obj.y);
        room.info = obj; //保存房间信息
        room.name = obj.name;
        return room;
    },
    //绘制平面区域
    drawPlane: function (obj) {
        var shape = new THREE.Shape();
        var gap = obj.gap ? obj.gap : 1; //平面大小的缩放比例
        //将平面边缘按点连线
        var rx = gap * (obj.line[0][0] - obj.center[0]) + obj.center[0];
        var ry = gap * (obj.line[0][1] - obj.center[1]) + obj.center[1];
        shape.moveTo(rx, ry);
        for (var i = 1; i < obj.line.length; i++) {
            rx = gap * (obj.line[i][0] - obj.center[0]) + obj.center[0];
            ry = gap * (obj.line[i][1] - obj.center[1]) + obj.center[1];
            shape.lineTo(rx, ry);
        }
        var planeShape = new THREE.ShapeGeometry(shape);
        var plane = new THREE.Mesh(planeShape,
            new THREE.MeshLambertMaterial({
                color: obj.fillcolor ? obj.fillcolor : "#FFFFFF",
                side: THREE.DoubleSide
            }));
        plane.rotation.x = -Math.PI / 2;
        plane.position.setY(Number(obj.y) + 0.1);
        plane.name = obj.name;
        plane.info = obj;
        return plane;
    },
    //绘制卫生间等小logo
    drawLogo: function (obj) {
        var imgPath = null;
        //导入图片纹理
        if (!obj.logo) {
            return null;
        }
        if (this.baseUrl) {
            imgPath = this.baseUrl + "/" + obj.logo;
        } else {
            imgPath = obj.logo;
        }
        var texture = new THREE.TextureLoader().load(imgPath);
        var spriteMaterial = new THREE.SpriteMaterial({
            map: texture,
            color: 0xffffff,
            transparent: false
        });

        var sprite = new THREE.Sprite(spriteMaterial);
        sprite.scale.set(12, 12, 12);
        var y = obj.y ? obj.y : 1;
        var h = obj.height ? obj.height : 0;
        obj.y = y;

        obj.height = h;
        sprite.position.set(obj.center[0], 10, -obj.center[1]);
        sprite.len = 1;
        sprite.name = obj.name;
        sprite.info = obj;

        return sprite;
    },
    //绘制房间上的名称
    drawName: function (obj) {
        obj.y = obj.y ? obj.y : 0;
        var str = obj.name;
        var img = new Image();
        if (!helper.isEmpty(obj.logo)) {
            if (this.baseUrl) {
                img.src = this.baseUrl + "/" + obj.logo;
            } else {
                img.src = obj.logo;
            }
        }
        if (str == undefined) {
            return null;
        } else {
            var canvas = document.createElement("canvas");
            canvas.width = str.length * 200 + 100; //512;
            canvas.height = 120;
            var context = canvas.getContext('2d');
            context.font = '100px 方正淮圆简体';
            context.textAlign = 'left';
            context.textBaseline = 'middle';
            context.fillStyle = '#5F5D5D';
            context.fillText(str, canvas.width / 2 + 50, canvas.height / 2);
            if (img.complete) {
                context.drawImage(img, canvas.width / 2 - 50, canvas.height / 2 - 50, 100, 100);
            }
            var shadowTexture = new THREE.CanvasTexture(canvas);
            var spriteMaterial = new THREE.SpriteMaterial({
                map: shadowTexture,
                color: 0xffffff,
                transparent: false
            });
            var sprite = new THREE.Sprite(spriteMaterial);
            sprite.scale.set(str.length * 2 * 6, 1.3 * 6, 6);
            sprite.position.set(obj.center[0], Number(obj.height) + Number(obj.y) + 3 + 1, -obj.center[1]);
            sprite.len = str.length;
            sprite.name = obj.name;
            sprite.info = obj;
            return sprite;
        }
    },
}
module.exports = draw;