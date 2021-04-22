(function(THREE, win) {
    var Map = function(canvas, url, dome) {

        this.clickModel = []; //场景中可以点击的物体放在此处
        this.autoModel = []; //场景中可以自动旋转，缩放，隐藏的物体放此数组中
        this.model = [];
        this.pathModel = null; //存储路径模型的变量.
        this.mapdata = []; //地图数据信息
        this.nowMap; //  当前正在使用的地图数据
        this.urlPath = url; //图片，地图，路径等数据的加载路径
        this.container = document.getElementById(canvas);
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        //初始化渲染器
        this.renderer = new THREE.WebGLRenderer({
            antialias: true
        });
        // 模拟点击模块用的数组
        this.lastModels = [];
        //
        this.infowindowPosition = dome;
        // 定位气泡信息使用的数组  气泡三维坐标
        this.positionInfoWindow = [];

        this.events = [];
        //初始化相机控制器
        // this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement, this.clickModel);
        this.controls = new THREE.OrbitControls(this);
    }
    Map.prototype = {
        //初始化

        init: function() {
            //三维场景初始化
            console.log("wxwxwxwxwxwxwxwxwx")
            console.log(this)
            var s1 = this.container.style.width;
            var s2 = this.container.style.height;
            //      var s3=this.container.style.top;
            //      var s4=this.container.style.left;

            // wjong begin
            // var x = parseInt(s1.slice(0, s1.length - 2));
            // var y = parseInt(s2.slice(0, s2.length - 2));

            var x = this.container.offsetWidth;
            var y = this.container.offsetHeight;


            // wjlong end


            // wjlong begin
            // var top = this.container.offsetTop;
            // var left = this.container.offsetLeft;
            var top = this.getOffsetTop(this.container);
            var left = this.getOffsetLeft(this.container);
            // wjlong end



            this.renderer.domElement.top = top;
            this.renderer.domElement.left = left;
            this.renderer.setSize(x, y);
            // console.log(this.renderer.domElement.style.left);
            // console.log(this.renderer.domElement.width);
            // console.log(this.renderer.domElement.height);
            this.renderer.setClearColor(0xededed);
            this.renderer.setPixelRatio(window.devicePixelRatio);
            this.container.appendChild(this.renderer.domElement);
            //设置相机位置
            //this.camera.position.set(0,20,20);
            this.camera.position.set(0, 300, 0);
            // 光源
            var light1 = new THREE.DirectionalLight(0xffffff, 0.6);
            light1.position.set(300, 150, 0);
            this.scene.add(light1);

            var light2 = new THREE.DirectionalLight(0xffffff, 0.6);
            light2.position.set(-300, 150, 0);
            this.scene.add(light2);

            var light3 = new THREE.DirectionalLight(0xffffff, 0.6);
            light3.position.set(0, 150, -300);
            this.scene.add(light3);

            var light4 = new THREE.DirectionalLight(0xffffff, 0.5);
            light4.position.set(0, 150, 300);
            this.scene.add(light4);
            //辅助坐标系
            // var axis=new THREE.AxisHelper(100);
            // this.scene.add(axis);
        },
        getOffsetLeft: function(obj) {
            var tmp = obj.offsetLeft;
            var val = obj.offsetParent;
            while (val != null) {
                tmp += val.offsetLeft;
                val = val.offsetParent;
            }
            return tmp;
        },
        getOffsetTop: function(obj) {
            var tmp = obj.offsetTop;
            var val = obj.offsetParent;
            while (val != null) {
                tmp += val.offsetTop;
                val = val.offsetParent;
            }
            return tmp;
        },
        loadData: function(mapurl) {

            //数据初始化
            var mapdata = new mapData();

            mapdata.load(mapurl, this.urlPath + "geojson/route/route-3.json");

            this.nowMap = mapdata;
        },
        update: function() {
            this.controls.update();
        },
        animate: function() {
            requestAnimationFrame(this.animate.bind(this));
            this.update();
            this.render();
        },
        //渲染场景
        render: function() {
            this.autoChange();
            this.detectHide();
            this.renderer.render(this.scene, this.camera);
        },
        //控制场景中需要随相机变化而变化的物体
        autoChange: function() {

            //获取相机位置
            var x = this.camera.position.x;
            var y = this.camera.position.y;
            var z = this.camera.position.z;
            //计算相机和原点的距离
            var dis = Math.sqrt(x * x + y * y + z * z) / 20;
            if (dis < 2) {
                dis = 2;
            }
            //根据距离，调整悬浮名字和图片的大小

            for (var i = 0; i < this.autoModel.length; i++) {
                if (this.autoModel[i].info.specialSite > 0 && this.autoModel[i].info.specialSite < 16) {
                    this.autoModel[i].scale.set(dis, dis, dis);
                } else if (this.autoModel[i].info.specialSite >= 16 && this.autoModel[i].info.specialSite < 26) {
                    this.autoModel[i].scale.set(this.autoModel[i].len * dis, dis * 0.6, this.autoModel[i].len * dis);
                } else if (this.autoModel[i].info.specialSite == 36) {

                    this.autoModel[i].scale.set(this.autoModel[i].len * dis, dis * 0.6, this.autoModel[i].len * dis);
                }
                this.autoModel[i].position.setY(this.autoModel[i].info.h + dis / 5);
            }
            //路径动画效果
            if (this.pathModel != null) {
                this.pathModel.material.map.offset.x += 0.01;
                this.pathModel.material.map.offset.y += 0.01;
                if (this.pathModel.material.map.offset.x > 1) this.pathModel.material.map.offset.x = 0;
                if (this.pathModel.material.map.offset.y > 1) this.pathModel.material.map.offset.y = 0;
            }
        },
        clearMap: function() {

            for (var i = 4; i < this.scene.children.length; i++) {
                this.scene.remove(this.scene.children[i]);
            }
            //this.scene.remove(this.model[0]);

            this.clickModel.splice(0, this.clickModel.length);
            this.autoModel.splice(0, this.autoModel.length);
            this.model.splice(0, this.model.length);

        },
        deleteObjectByName: function(name) {
            var obj = this.scene.getObjectByName(name);
            this.scene.remove(obj);
        },
        lockScene: function() {
            this.controls.enableZoom = false;
            this.controls.enableRotate = false;
            this.controls.enablePan = false;
            this.camera.position.set(0, 200, 0);
        },
        //绘制整个场景
        draw: function() {

            //2.3D转换
            //			var mapdata=new mapData();
            //	   		mapdata.load(this.urlPath+mapurl,this.urlPath+"geojson/route/route-3.json");
            //	   		this.nowMap=mapdata;

            var floor = new THREE.Mesh();
            var logoGroup = new THREE.Group();
            var planeGroup = new THREE.Group();
            var roomGroup = new THREE.Group();
            var nameGroup = new THREE.Group();
            var facilityGroup = new THREE.Group();
            for (var i = 0; i < this.nowMap.geojson.length; i++) {
                if (this.nowMap.geojson[i].specialSite >= 1 && this.nowMap.geojson[i].specialSite < 16) {
                    var logo = this.drawLogo(this.nowMap.geojson[i]);
                    this.autoModel.push(logo);
                    logoGroup.add(logo);
                } else if (this.nowMap.geojson[i].specialSite >= 26 && this.nowMap.geojson[i].specialSite < 36) {
                    var plane = this.drawPlane(this.nowMap.geojson[i]);
                    planeGroup.add(plane);
                } else if (this.nowMap.geojson[i].specialSite >= 16 && this.nowMap.geojson[i].specialSite < 26) {
                    var room = this.drawRoom(this.nowMap.geojson[i]);
                    this.clickModel.push(room.children[1]);
                    roomGroup.add(room);
                    var name = this.drawName(this.nowMap.geojson[i]);
                    if (name != null) {
                        nameGroup.add(name);
                        this.autoModel.push(name);
                    }
                } else if (this.nowMap.geojson[i].specialSite == 0) {
                    var bottom = this.drawRoom(this.nowMap.geojson[i]);
                    bottom.name = "bottom";
                    floor.add(bottom);
                } else if (this.nowMap.geojson[i].specialSite > 35) {
                    var facility = new THREE.Mesh();
                    var obj = this.nowMap.geojson[i];

                    var imgPath = this.urlPath + "image/" + obj.specialSite + ".png";
                    var texture = new THREE.TextureLoader().load(imgPath);
                    var spriteMaterial = new THREE.SpriteMaterial({
                        map: texture,
                        color: 0xffffff,
                        transparent: false
                    });
                    var sprite = new THREE.Sprite(spriteMaterial);
                    sprite.scale.set(9, 9, 9);
                    sprite.position.set(obj.center[0], obj.y + 4.5, obj.center[1]);
                    sprite.len = 1;
                    sprite.name = obj.name;
                    sprite.info = obj;
                    facility.add(sprite);
                    this.clickModel.push(sprite);
                    //this.autoModel.push(sprite);
                    facilityGroup.add(facility);
                }
            }
            logoGroup.name = "logo";
            floor.add(logoGroup);
            nameGroup.name = "name";
            floor.add(nameGroup);
            planeGroup.name = "plane";
            floor.add(planeGroup);
            roomGroup.name = "room";
            floor.add(roomGroup);
            facilityGroup.name = "facility";
            floor.add(facilityGroup);
            floor.name = "floor";
            this.model[0] = floor;
            this.scene.add(this.model[0]);
            // for(var i=0;i<this.autoModel.length;i++){
            //     this.scene.add(this.autoModel[i]);
            //     //console.log(this.autoModel[i].info);
            // }

            //console.log(this.clickModel);

        },
        //绘制房间
        drawRoom: function(obj) {
            var roomModel = new THREE.Mesh();
            var shape = new THREE.Shape();
            var geometry = new THREE.Geometry();
            var gap = obj.gap;
            var rx = gap * (obj.line[0][0] - obj.center[0]) + obj.center[0];
            var ry = gap * (obj.line[0][1] - obj.center[1]) + obj.center[1];
            shape.moveTo(rx, ry);
            geometry.vertices.push(new THREE.Vector3(rx, obj.h + 0.1, -ry));
            for (var i = 1; i < obj.line.length; i++) {
                rx = gap * (obj.line[i][0] - obj.center[0]) + obj.center[0];
                ry = gap * (obj.line[i][1] - obj.center[1]) + obj.center[1];
                shape.lineTo(rx, ry);
                geometry.vertices.push(new THREE.Vector3(rx, obj.h + 0.1, -ry));
            }
            var material;
            var fillColor = (obj.fillColor !== undefined) ? obj.fillColor : "#5AC2FA";

            if (obj.specialSite != 0) {
                var basicMaterial = new THREE.LineBasicMaterial({
                    color: "#686E71"
                });
                var line = new THREE.Line(geometry, basicMaterial);
                roomModel.add(line);
                material = new THREE.MeshLambertMaterial({
                    color: fillColor,
                    side: THREE.DoubleSide,
                    transparent: true,
                    opacity: obj.opacity,
                })
            } else {
                material = new THREE.MeshLambertMaterial({
                    color: fillColor,
                    side: THREE.DoubleSide
                })
            }
            var extrudeSettings = {
                amount: obj.h,
                bevelEnabled: false
            };
            var roomShape = new THREE.ExtrudeGeometry(shape, extrudeSettings);
            var room = new THREE.Mesh(roomShape, material);
            room.rotation.x = -Math.PI / 2;
            room.info = obj;
            room.name = obj.name;
            roomModel.add(room);
            roomModel.position.setY(obj.y);
            roomModel.info = obj;
            roomModel.name = obj.name;
            return roomModel;
        },
        //绘制房间上的名称
        drawName: function(obj) {
            var specialSite = obj.specialSite;
            var type = obj.type;
            var img = new Image();
            img.src = this.urlPath + "image/type" + type + ".png";

            var str = obj.name;
            if (str == undefined) {
                return null;
            } else {
                var canvas = document.createElement("canvas");
                canvas.width = str.length * 200 + 100; //512;
                canvas.height = 120;
                var context = canvas.getContext('2d');
                //context.fillStyle = "white";
                //context.fillRect(0, 0, canvas.width, canvas.height);
                context.font = '100px Microsoft YaHei';
                context.textAlign = 'left';
                context.textBaseline = 'middle';
                context.fillStyle = '#000000';
                context.fillText(str, canvas.width / 2 + 50, canvas.height / 2);
                context.drawImage(img, canvas.width / 2 - 50, canvas.height / 2 - 50, 100, 100);
                var shadowTexture = new THREE.CanvasTexture(canvas);

                var spriteMaterial = new THREE.SpriteMaterial({
                    map: shadowTexture,
                    color: 0xffffff,
                    transparent: false
                });
                var sprite = new THREE.Sprite(spriteMaterial);
                sprite.scale.set(str.length * 2, 1.3, 1);
                sprite.position.set(obj.center[0], obj.h + 1, -obj.center[1]);
                sprite.len = str.length;
                sprite.name = obj.name;
                sprite.info = obj;
                return sprite;
            }
        },

        //绘制平面区域
        drawPlane: function(obj) {
            var shape = new THREE.Shape();
            var gap = obj.gap;
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
                new THREE.MeshBasicMaterial({
                    color: (obj.fillColor !== undefined) ? obj.fillColor : "#FFFFFF",
                    side: THREE.DoubleSide
                }));
            plane.rotation.x = -Math.PI / 2;
            plane.position.setY(obj.y + 0.5);
            plane.name = obj.name;
            plane.info = obj;
            return plane;
        },
        //绘制特殊区域的logo
        drawLogo: function(obj) {
            console.log("111111111111111111111111111")
            var imgPath = this.urlPath + "image/" + obj.specialSite + ".png";
            var texture = new THREE.TextureLoader().load(imgPath);
            var spriteMaterial = new THREE.SpriteMaterial({
                map: texture,
                color: 0xffffff,
                transparent: false
            });
            var sprite = new THREE.Sprite(spriteMaterial);
            sprite.scale.set(20, 20, 20);
            sprite.position.set(obj.center[0], obj.h + 2, -obj.center[1]);
            sprite.len = 1;
            sprite.name = obj.name;
            sprite.info = obj;
            sprite.addInScene = true;
            return sprite;
        },

        //路径导航
        findPathById: function(start, end) {
            //获取路径点的坐标
            var path = this.nowMap.findPathById(start, end);
            if (path == undefined) return;
            //将路径点坐标转换为向量格式
            var points = [];
            for (var i = 0; i < path.length; i++) {
                points.push(new THREE.Vector3(path[i][0], 2, -path[i][1]));
            }
            //生成路径曲线
            var sp = new THREE.SplineCurve3(points);
            //获取路径长度
            var len = parseInt(sp.getLength());
            var tubeGeometry = new THREE.TubeGeometry(sp, len * 2, 0.4, 30, false)
                //设置图片纹理
            var texture = new THREE.TextureLoader().load(this.urlPath + "image/7.png");
            //设置纹理贴图方式为重复贴图    *******非常重要*******
            texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
            texture.repeat.set(parseInt(len / 4) == 0 ? 1 : parseInt(len / 4), 1);
            var material = new THREE.MeshBasicMaterial({
                map: texture,
                transparent: true
            });
            //生成路径几何模型
            this.pathModel = new THREE.Mesh(tubeGeometry, material);
            this.scene.add(this.pathModel);
        },
        //检测是否存在遮挡
        detectHide: function() {
            var detectModels = this.autoModel;
            var object = this.camera;
            if (detectModels == undefined) return;
            for (var i = 0; i < detectModels.length; i++) {
                detectModels[i].visible = true;
            }
            var raycaster = new THREE.Raycaster();
            for (var i = 0; i < detectModels.length; i++) {
                if (detectModels[i].visible == false) continue;
                raycaster.set(object.position, new THREE.Vector3().subVectors(detectModels[i].position, object.position).normalize());
                var intersect = raycaster.intersectObjects(detectModels, true);
                for (var j = 0; j < intersect.length; j++) {
                    intersect[j].dis = intersect[j].point.distanceTo(object.position);
                    intersect[j].cameradis = Math.sqrt(intersect[j].dis * intersect[j].dis - intersect[j].distance * intersect[j].distance);
                }
                intersect.sort(function(a, b) {
                    return a.cameradis - b.cameradis;
                });
                for (var j = 1; j < intersect.length; j++) {
                    intersect[j].object.visible = false;
                }
            }
        },

        // 将模块涂红  模拟点击模块
        showSpecialModel: function(name) {
            if (!this.scene.getObjectByName(name)) {
                alert('楼层信息不存在！');
                return;
            }
            //相同模块info.id
            var id = this.scene.getObjectByName(name).info.id;
            var floor = this.scene.getObjectByName("floor");
            var room = floor.getObjectByName("room");
            console.log("this.lastModels");
            console.log(this.lastModels);
            for (var i = 0; i < this.lastModels.length; i++) {
                var now = this.lastModels[i];
                if (now.children.length) {
                    now.children[1].material.color.set(now.children[1].info.fillColor);
                } else {
                    now.material.color.set(now.info.fillColor);
                }

            }
            this.lastModels = [];
            // for (var i = 0; i < room.children.length; i++) {
            //     var now = room.children[i];
            //     now.children[1].material.color.set(now.info.fillColor);
            // }
            this.lastModels.splice(0, this.lastModels.length);
            for (var i = 0; i < room.children.length; i++) {
                if (room.children[i].info.id == id) {
                    var now = room.children[i].children[1];
                    now.material.color.set("#f56273");
                    this.lastModels.push(room.children[i]);
                }
            }
            //点击模块时触发事件 start
            var evt = {
                type: 'mapModule',
                moduleInfo: this.scene.getObjectByName(name).info,
                mapInfoList: this.nowMap.mapinfo
            };
            map.trigger('xwClick', evt);
            //点击模块时触发事件 end
        },
        // 模拟点击设备
        showSpecialFacility: function(name) {
            var facility = { object: this.scene.getObjectByName(name) };
            this.positionInfoWindow = facility.object.position;
            this.position_info_windows(facility.object.position);
            //点击设备时触发事件 start
            var evt = {
                type: 'mapFacility',
                intersects: facility,
            };
            //点击设备时触发事件 end
            this.trigger("xwClick", evt);
        },

        // 定位气泡信息  e  三维坐标
        position_info_windows: function(e) {
            if (e.length == 0) {
                return;
            }
            var a = [],
                b = [];
            a.push(this.camera.position.x, this.camera.position.y, this.camera.position.z);
            b.push(this.controls.target.x, this.controls.target.y, this.controls.target.z);
            var cubePosition = [Number(e.x), Number(e.y), Number(e.z)];
            // var dd = getPixelFromCoordinate(a, b, cubePosition, map.camera.fov, window.innerWidth, window.innerHeight);
            var dd = getPixelFromCoordinate(a, b, cubePosition, this.camera.fov, this.renderer.domElement.width, this.renderer.domElement.height);
            // var mydiv = document.getElementById("infowindow");
            var mydiv = document.getElementById(this.infowindowPosition);
            // mydiv.style.top = dd[0] - 170 + "px";
            // mydiv.style.left = dd[1] - 100 + "px";
            mydiv.style.top = dd[0] - mydiv.children[0].style.height.replace("px", "") - 30 + "px";
            mydiv.style.left = dd[1] - mydiv.children[0].style.width.replace("px", "") / 2 + "px";
        },

        on: function(key, callback) {
            if (key === 'xwClick') {
                this.events.push(callback);
            }
        },
        off: function(key, fn) {
            if (key === 'xwClick') {
                var fnIndex;
                this.events.some(function(v, index) {
                    if (v === fn) {
                        fnIndex = index;
                        return true;
                    }
                });
                this.events.splice(fnIndex, 1);
            }
        },
        trigger: function(key, evt) {
            if (key === 'xwClick') {
                this.events.forEach(function(cb) {
                    cb(evt);
                });
            }
        }

    }

    win.XWMap = Map;
})(AirocovMap.THREE, window);
