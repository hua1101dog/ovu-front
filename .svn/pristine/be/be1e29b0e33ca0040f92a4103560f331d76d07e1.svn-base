 var Map = function (canvas) {
     this.clickModel = []; //场景中可以点击的物体放在此处
     this.clickfloor = []; //场景中可以点击的物体放在此处;
     this.autoModel = []; //场景中可以自动旋转，缩放，隐藏的物体放此数组中

     this.cameraclickModel = []; //摄像头监控模型

     this.model = [];
     this.pathModel = null; //存储路径模型的变量.
     this.mapdata = []; //地图数据信息
     this.nowMap; //  当前正在使用的地图数据
     this.urlPath = ""; //图片，地图，路径等数据的加载路径
     this.container = document.getElementById(canvas);
     this.scene = new THREE.Scene();
     this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);


     this.showCamera      = false;
     this.showCameraRange = false;

     //初始化渲染器
     this.renderer = new THREE.WebGLRenderer({
         antialias: true
     });
     //初始化相机控制器
     this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement, this.clickModel,this.clickfloor);
 }
 Map.prototype = {
     //初始化
     init: function () {
         //数据初始化
         var mapdata = new mapData();
         mapdata.load("geojson/61.geojson", "geojson/route/route-3.json");
         this.nowMap = mapdata;
         //三维场景初始化
         var s1 = this.container.style.width;
         var s2 = this.container.style.height;
         var x = parseInt(s1.slice(0, s1.length - 2));
         var y = parseInt(s2.slice(0, s2.length - 2));
         this.renderer.setSize(window.innerWidth, window.innerHeight);
         // console.log(this.renderer.domElement.style.left);
         // console.log(this.renderer.domElement.width);
         // console.log(this.renderer.domElement.height);
         this.renderer.setClearColor(0xffffff);
         this.renderer.setPixelRatio(window.devicePixelRatio);
         this.container.appendChild(this.renderer.domElement);
         //设置相机位置
         //this.camera.position.set(0,20,20);
         //this.camera.position.set(-107,104,15);

         this.camera.position.set(-0.00014994937928827648, 149.96666296206467, -0.000002276763284375873);

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

     clearMap: function() {
               
            var num = this.scene.children.length;
            //debugger;   
            for (var i = 0; i < num; i++) {
                this.scene.remove(this.scene.children[0]);
            }
            //this.scene.remove(this.model[0]);
             
            //debugger;
            //this.scene.remove(this.scene.children[4]);

            this.clickModel.splice(0, this.clickModel.length);
            this.autoModel.splice(0, this.autoModel.length);
            this.model.splice(0, this.model.length);
            this.cameraclickModel.splice(0, this.cameraclickModel.length);

     },

     update: function () {
         this.controls.update();
     },
     animate: function () {
         requestAnimationFrame(this.animate.bind(this));
         this.update();
         this.render();
     },
     //渲染场景
     render: function () {
         this.autoChange();
         this.detectHide();
         this.renderer.render(this.scene, this.camera);
     },
     //控制场景中需要随相机变化而变化的物体
     autoChange: function () {

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
                 this.autoModel[i].scale.set(dis / 2, dis / 2, dis / 2);
             } else {
                 this.autoModel[i].scale.set(this.autoModel[i].len * dis, dis * 0.6, this.autoModel[i].len * dis);
             }
             this.autoModel[i].position.setY(this.autoModel[i].info.h + dis / 2);
         }
         //路径动画效果
         if (this.pathModel != null) {
             this.pathModel.material.map.offset.x += 0.01;
             this.pathModel.material.map.offset.y += 0.01;
             if (this.pathModel.material.map.offset.x > 1) this.pathModel.material.map.offset.x = 0;
             if (this.pathModel.material.map.offset.y > 1) this.pathModel.material.map.offset.y = 0;
         }
     },
     //绘制整个场景
     draw: function () {
         var img = new Image();
         img.src = this.urlPath + "image/6.png";
         var floor = new THREE.Mesh();
         var logoGroup = new THREE.Group();
         var planeGroup = new THREE.Group();
         var roomGroup = new THREE.Group();
         var nameGroup = new THREE.Group();

         var cameraGroup = new THREE.Group();

         for (var i = 0; i < this.nowMap.geojson.length; i++) {
             if (this.nowMap.geojson[i].specialSite >= 1 && this.nowMap.geojson[i].specialSite < 16) {

                 //console.log("图片边框开始");
                 //console.log(this.nowMap.geojson[i]);
                 //console.log(JSON.stringify(this.nowMap.geojson[i]));
                 //console.log("图片边框结束");

                 var logo = this.drawLogo(this.nowMap.geojson[i]);
                 this.autoModel.push(logo);
                 logoGroup.add(logo);
             } else if (this.nowMap.geojson[i].specialSite >= 26 && this.nowMap.geojson[i].specialSite < 36) {
                 var plane = this.drawPlane(this.nowMap.geojson[i]);
                 planeGroup.add(plane);
             } else if (this.nowMap.geojson[i].specialSite >= 16 && this.nowMap.geojson[i].specialSite < 26) {

                 //debugger;
                 //绝对等于
                 //if (this.nowMap.geojson[i].name === '日间手术病房区') {
                 //    console.log("模型边框开始");
                 //    console.log(this.nowMap.geojson[i]);
                 //    console.log(JSON.stringify(this.nowMap.geojson[i]));
                 //    console.log("模型边框结束");
                 //}
                
                 //画房间
                 var room = this.drawRoom(this.nowMap.geojson[i]);
                 this.clickModel.push(room);
                 roomGroup.add(room);

                 //画名称
                 var name = this.drawName(this.nowMap.geojson[i], img);
                 if (name != null) {
                     this.autoModel.push(name);
                 }

             } else if (this.nowMap.geojson[i].specialSite == 0) {

                 //console.log("楼层边框开始");
                 //console.log(this.nowMap.geojson[i]);
                 //console.log(JSON.stringify(this.nowMap.geojson[i]));
                 //console.log("楼层边框结束");
                 
                 //画边框
                 var bottom = this.drawRoom(this.nowMap.geojson[i]);
                 this.clickfloor.push(bottom);
                 bottom.name = "bottom";
                 floor.add(bottom);

             }
         }


          //圆柱体
          //var geom = new THREE.CylinderGeometry(6, 6, 3, 20, 20, false);
          //var mesh = new THREE.MeshBasicMaterial({
          //    color: '#000000', 
          //    transparent: true,
          //    opacity: 0.5,
          //    wireframe: false
          //});
          //var cube = new THREE.Mesh(geom, mesh);
          //cube.position.set(-8.05135750442338, 2.000000000000012, -53.28468937521021);
          //this.cameraclickModel.push(cube);
          //cameraGroup.add(cube);

          //var geom1 = new THREE.CylinderGeometry(15, 15, 3, 20, 20, false);
          //var mesh1 = new THREE.MeshBasicMaterial({
          //    color: '#7CFC00',
          //    transparent: true,
          //    opacity: 0.4,
          //    wireframe: false
          //});
          //var cube1 = new THREE.Mesh(geom1, mesh1);
          //cube1.position.set(-8.05135750442338, 2.000000000000012, -53.28468937521021);
          //this.cameraclickModel.push(cube1);
          //cameraGroup.add(cube1);

          //var geom2 = new THREE.CylinderGeometry(25, 25, 3, 20, 20, false);
          //var mesh2 = new THREE.MeshBasicMaterial({
          //    color: '#000080',
          //    transparent: true,
          //    opacity: 0.3,
          //    wireframe: false
          //});
          //var cube2 = new THREE.Mesh(geom2, mesh2);
          //cube2.position.set(-8.05135750442338, 2.000000000000012, -53.28468937521021);
          //this.cameraclickModel.push(cube2);
          //cameraGroup.add(cube2);
         
           

         //摄像头图片 
         //var sxtJson = {"name":"电梯","self_id":"1401","relative_id":"1301","specialSite":"4","y":0,"h":6.000000000000012,"gap":1,"center":[-8.05135750442338,-53.28468937521021]};  
         //var logo1 = this.drawCameraLogo(sxtJson);
         //this.autoModel.push(logo1);
         //logoGroup.add(logo1);


         //for (var i = 0; i < this.nowMap.camerajson.length; i++) {
         //     if(this.showCamera      == true ||  this.showCameraRange == true){
         //             var logo1 = this.drawCameraLogo(this.nowMap.camerajson[i]);
         //             this.autoModel.push(logo1);
         //             logoGroup.add(logo1);  
         //     }
         //     if(this.showCameraRange == true){
         //            if(i%3==0){
         //                var cameraArray = this.drawCameraRenge(this.nowMap.camerajson[i]);
         //                cameraGroup.add(cameraArray);
         //            }else{
         //                var cameraArray1 = this.drawCameraRengeSector(this.nowMap.camerajson[i]);
         //                cameraGroup.add(cameraArray1);
         //            }
         //     }
         //}

         var logo1 = this.drawCameraLogo(this.nowMap.camerajson[0]);
             this.autoModel.push(logo1);
             logoGroup.add(logo1); 
         var cameraArray1 = this.drawCameraRengeSector(this.nowMap.camerajson[0]);
             this.autoModel.push(cameraArray1);
             cameraGroup.add(cameraArray1);             

         //圆形
         //var curve = new THREE.EllipseCurve(
         //    0, 0, // ax, aY
         //    10, 10, // xRadius, yRadius
         //    0, 2 * Math.PI, // aStartAngle, aEndAngle
         //    false, // aClockwise
         //    0 // aRotation
         //);

         //var path = new THREE.Path(curve.getPoints(50));
         //var geometry = path.createPointsGeometry(50);
         //var material = new THREE.LineBasicMaterial({
         //    color: 0xff0000
         //});

         // Create the final object to add to the scene
         //var ellipse = new THREE.Line(geometry, material);
         //ellipse.rotateX(3.1415926 / 2);

         //ellipse.position.set(-8, 2, -53);
         //this.clickModel.push(ellipse);
         //roomGroup.add(ellipse);

         //var geom1 = new THREE.TorusGeometry(20,5,20,20,2*Math.PI);  
         //var mesh1 = new THREE.MeshBasicMaterial({    
         //    color     : 'red',  
         //    wireframe : true   
         //});  
         //var cube1 = new THREE.Mesh(geom1,mesh1);  
         //this.clickModel.push(cube1);  
         //roomGroup.add(cube1);  

          
        
        //初始化扇形对象
        //var cameraModel =new makeCamera({r:30,_x:5,_y:6,start:45,end:90,fillColor:'#C0C0C0'});
        //cameraModel.init();
        //var cameraRange =  cameraModel.getCameraRange();
        //var cameraRoom = this.drawCamera(cameraRange);
        //this.cameraclickModel.push(cameraRoom);
        //cameraGroup.add(cameraRoom);

        //var cameraModel1 =new makeCamera({r:40,_x:5,_y:6,start:45,end:90,fillColor:'#FFFFFF'});
        //cameraModel1.init();
        //var cameraRange1 =  cameraModel1.getCameraRange();
        //var cameraRoom1 = this.drawCamera(cameraRange1);
        //this.cameraclickModel.push(cameraRoom1);
        //cameraGroup.add(cameraRoom1);

        //var cameraname = this.drawName(cameraRange, img);
        //if (cameraname != null) {
        //    this.autoModel.push(cameraname);
        //}

        //var cameraname1 = this.drawName(cameraRange1, img);
        //if (cameraname1 != null) {
        //    this.autoModel.push(cameraname1);
        //}        

         logoGroup.name = "logo";
         floor.add(logoGroup);

         // nameGroup.name="name";
         // floor.add(nameGroup);
         
         planeGroup.name = "plane";
         floor.add(planeGroup);

         cameraGroup.name = "camera";
         floor.add(cameraGroup);

         roomGroup.name = "room";
         floor.add(roomGroup);
         floor.name = "floor";
         
         this.model["floor"] = floor;
         this.scene.add(floor);
         
         for (var i = 0; i < this.autoModel.length; i++) {
             this.scene.add(this.autoModel[i]);
             //console.log(this.autoModel[i].info);
         }
         
         console.log(this.model);
         //console.log(this.clickModel);
     },
     //绘制房间
     drawRoom: function (obj) {
         var roomModel = new THREE.Mesh();
         var shape = new THREE.Shape();
         var geometry = new THREE.Geometry();
         var gap = obj.gap;
         var rx = gap * (obj.line[0][0] - obj.center[0]) + obj.center[0];
         var ry = gap * (obj.line[0][1] - obj.center[1]) + obj.center[1];
         shape.moveTo(rx, ry);
         geometry.vertices.push(new THREE.Vector3(rx, obj.h + 0.01, -ry));
         for (var i = 1; i < obj.line.length; i++) {
             rx = gap * (obj.line[i][0] - obj.center[0]) + obj.center[0];
             ry = gap * (obj.line[i][1] - obj.center[1]) + obj.center[1];
             shape.lineTo(rx, ry);
             geometry.vertices.push(new THREE.Vector3(rx, obj.h + 0.01, -ry));
         }
         var material;
         var fillColor = (obj.fillColor !== undefined) ? obj.fillColor : "#5AC2FA";
         if (obj.specialSite != 0) {
             var basicMaterial = new THREE.LineBasicMaterial({
                 color: "#888888"
             });
             var line = new THREE.Line(geometry, basicMaterial);
             roomModel.add(line);
             material = new THREE.MeshLambertMaterial({
                 color: fillColor,
                 side: THREE.DoubleSide
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
         roomModel.add(room);
         roomModel.position.setY(obj.y);
         roomModel.info = obj;
         roomModel.name = obj.name;
         return roomModel;
     },

     drawCamera: function (obj) {
         var roomModel = new THREE.Mesh();
         var shape = new THREE.Shape();
         var geometry = new THREE.Geometry();
         var gap = obj.gap;
         var rx = gap * (obj.line[0][0] - obj.center[0]) + obj.center[0];
         var ry = gap * (obj.line[0][1] - obj.center[1]) + obj.center[1];
         shape.moveTo(rx, ry);
         geometry.vertices.push(new THREE.Vector3(rx, obj.h , -ry));
         for (var i = 1; i < obj.line.length; i++) {
             rx = gap * (obj.line[i][0] - obj.center[0]) + obj.center[0];
             ry = gap * (obj.line[i][1] - obj.center[1]) + obj.center[1];
             shape.lineTo(rx, ry);
             geometry.vertices.push(new THREE.Vector3(rx, obj.h , -ry));
         }
         var material;
         var fillColor = (obj.fillColor !== undefined) ? obj.fillColor : "#FFFFFF";
         if (obj.specialSite != 0) {
             var basicMaterial = new THREE.LineBasicMaterial({
                 color: "#000000"
             });
             var line = new THREE.Line(geometry, basicMaterial);
             roomModel.add(line);
             material = new THREE.MeshLambertMaterial({
                 color: fillColor,
                 side: THREE.DoubleSide,
                 transparent: true,
                 opacity: 0.5
             })
         } else {
             material = new THREE.MeshLambertMaterial({
                 color: fillColor,
                 side: THREE.DoubleSide,
                 transparent: true,
                 opacity: 0.5
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
         roomModel.add(room);
         roomModel.position.setY(obj.y);
         roomModel.info = obj;
         roomModel.name = obj.name;
         return roomModel;
     },
     //绘制房间上的名称
     drawName: function (obj, img) {
         var str = obj.name;
         if (str == undefined) {
             return null;
         } else {
             var canvas = document.createElement("canvas");
             canvas.width = str.length * 200 + 100; //512;
             canvas.height = 120;
             var context = canvas.getContext('2d');
             // context.fillStyle = "white";
             // context.fillRect(0, 0, canvas.width, canvas.height);
             context.font = '100px Microsoft YaHei';
             context.textAlign = 'left';
             context.textBaseline = 'middle';
             context.fillStyle = '#000000';
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
             sprite.scale.set(str.length * 2, 1.3, 1);
             sprite.position.set(obj.center[0], obj.h + 1, -obj.center[1]);
             sprite.len = str.length;
             sprite.name = obj.name;
             sprite.info = obj;
             return sprite;
         }
     },
     //绘制平面区域
     drawPlane: function (obj) {
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
         plane.position.setY(obj.y + 0.1);
         plane.name = obj.name;
         plane.info = obj;
         return plane;
     },
     //绘制特殊区域的logo
     drawLogo: function (obj) {
         var imgPath = "image/" + obj.specialSite + ".png";
         var texture = new THREE.TextureLoader().load(imgPath);
         var spriteMaterial = new THREE.SpriteMaterial({
             map: texture,
             color: 0xffffff,
             transparent: false
         });
         var sprite = new THREE.Sprite(spriteMaterial);
         sprite.scale.set(4, 4, 4);
         sprite.position.set(obj.center[0], obj.h + 2, -obj.center[1]);
         sprite.len = 1;
         sprite.name = obj.name;
         sprite.info = obj;
         sprite.addInScene = true;
         return sprite;
     },
     //绘制摄像机的范围
     drawCameraLogo:function(obj){
         var imgPath = "image/sxt.png";
         var texture = new THREE.TextureLoader().load(imgPath);
         var spriteMaterial = new THREE.SpriteMaterial({
             map: texture,
             color: 0xffffff,
             transparent: false
         });
         var sprite = new THREE.Sprite(spriteMaterial);
         sprite.scale.set(4, 4, 4);
         sprite.position.set(obj.center[0], obj.h + 2, obj.center[1]);
         sprite.len = 1;
         sprite.name = obj.name;
         sprite.info = obj;
         sprite.addInScene = true;
         return sprite;
     },
     //画圆柱形的摄像范围
     drawCameraRenge:function(obj){
          
          var cameraArray = new THREE.Group(); 

          var geom = new THREE.CylinderGeometry(6, 6, 3, 20, 20, false);
          var mesh = new THREE.MeshBasicMaterial({
              color: '#000000', 
              transparent: true,
              opacity: 0.5,
              wireframe: false
          });
          var cube = new THREE.Mesh(geom, mesh);
          cube.position.set(obj.center[0], 2.000000000000012, obj.center[1]);
          this.cameraclickModel.push(cube);
          cameraArray.add(cube);

          var geom2 = new THREE.CylinderGeometry(25, 25, 3, 20, 20, false);
          var mesh2 = new THREE.MeshBasicMaterial({
              color: '#000080',
              transparent: true,
              opacity: 0.3,
              wireframe: false
          });
          var cube2 = new THREE.Mesh(geom2, mesh2);
          cube2.position.set(obj.center[0], 2.000000000000012, obj.center[1]);
          this.cameraclickModel.push(cube2);
          cameraArray.add(cube2);

          return cameraArray;
     },
     //画扇形的摄像范围
     drawCameraRengeSector:function(obj){
        var cameraArray = new THREE.Group(); 

        var cameraModel =new makeCamera({r:30,_x:obj.center[0],_y:obj.center[1],start:45,end:90,fillColor:'#C0C0C0'});
        cameraModel.init();
        var cameraRange =  cameraModel.getCameraRange();
        var cameraRoom = this.drawCamera(cameraRange);
        //this.cameraclickModel.push(cameraRoom);
        //cameraGroup.add(cameraRoom);

        var cameraModel1 =new makeCamera({r:45,_x:obj.center[0],_y:obj.center[1],start:45,end:90,fillColor:'#FFFFFF'});
        cameraModel1.init();
        var cameraRange1 =  cameraModel1.getCameraRange();
        var cameraRoom1 = this.drawCamera(cameraRange1);
        //this.cameraclickModel.push(cameraRoom1);
        //cameraGroup.add(cameraRoom1);
        
        cameraArray.add(cameraRoom);
        cameraArray.add(cameraRoom1);

        return cameraArray;
     },

     //路径导航
     findPathById: function (start, end) {
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
     detectHide: function () {
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
             intersect.sort(function (a, b) {
                 return a.cameradis - b.cameradis;
             });
             for (var j = 1; j < intersect.length; j++) {
                 intersect[j].object.visible = false;
             }
         }
     }
 }