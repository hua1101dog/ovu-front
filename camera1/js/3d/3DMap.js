var Map=function (option) {
     
    //DIV对象
    this.containerId  =  option.containerId;
    
    //渲染器
    this.container    =  document.getElementById(this.containerId);
    
    //地图的URL
    this.mapServerURL =  option.mapServerURL

    //JSON字符串
    this.geojson      =  [];
    
    //点击事件
    this.clickModel   =  []; 

    this.autoModel    =  [];      //场景中可以自动旋转，缩放，隐藏的物体放此数组中
    
    //模型对象
    this.model        =  [];
    
    //图片，地图，路径等数据的加载路径
    this.urlPath="";   
    
    //场景
    this.scene        = new THREE.Scene();
    //摄像机
    this.camera       = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );
    //初始化渲染器
    this.renderer     = new THREE.WebGLRenderer({antialias: true});
    //初始化相机控制器
    this.controls     = new THREE.OrbitControls( this.camera, this.renderer.domElement,this.clickModel );

}


Map.prototype={
    //初始化
    getMap:function (url) {               
        var that=this;
        
        //设置成异步
        $.ajaxSetup({
            async: false
        });

        //获取JSON字符串
        $.getJSON(url, function (data, status) {
            if (status == 'success') {
                debugger;
                console.log(this.geojson);
                that.geojson.push(data)
            }            
        });

    },

    init:function () {
          
        //debugger;

        //加载数据           
        //this.getMap(this.mapServerURL);

        //三维场景初始化
        var s1=this.container.style.width;
        var s2=this.container.style.height;
        var x=parseInt(s1.slice(0,s1.length-2));
        var y=parseInt(s2.slice(0,s2.length-2));

        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setClearColor(0xffffff);
        this.renderer.setPixelRatio( window.devicePixelRatio );

        this.container.appendChild(this.renderer.domElement);

        //设置相机位置
        //this.camera.position.set(0,20,20);
        this.camera.position.set(-107,104,15);

        // 光源
        var light1 = new THREE.DirectionalLight(0xffffff,0.6);
        light1.position.set(300, 150, 0);
        this.scene.add(light1);

        var light2=new THREE.DirectionalLight(0xffffff,0.6);
        light2.position.set(-300,150,0);
        this.scene.add(light2);

        var light3=new THREE.DirectionalLight(0xffffff,0.6);
        light3.position.set(0,150,-300);
        this.scene.add(light3);

        var light4=new THREE.DirectionalLight(0xffffff,0.5);
        light4.position.set(0,150,300);
        this.scene.add(light4);

        //画图工具
        this.draw();

    },

        //绘制整个场景
    draw:function () {
        var img=new Image();
        img.src=this.urlPath+"image/6.png";
        var floor=new THREE.Mesh();
        var roomGroup=new THREE.Group();
        var nameGroup=new THREE.Group();
       
       //for(var i=0;i<this.geojson.length;i++){
       //    if(this.geojson[i].specialSite>=16&&this.geojson[i].specialSite<26){
       //        var room=this.drawRoom(this.geojson[i]);
       //        this.clickModel.push(room);
       //        roomGroup.add(room);
       //        var name=this.drawName(this.geojson[i],img);
       //        if(name!=null){
       //            this.autoModel.push(name);
       //        }
       //    }
       //}

       //var geom = new THREE.CircleGeometry(100,40,0,2*Math.PI);  
       //var mesh = new THREE.MeshBasicMaterial({    
       //   color : 'green',  
       //   wireframe : true   
       //});  
       //var cube = new THREE.Mesh(geom,mesh);    
       //roomGroup.add(cube);   


       //var geom = new THREE.CylinderGeometry(2,4,6,20,20,false);  
       //var mesh = new THREE.MeshBasicMaterial({    
       //    color : 'green',  
       //    wireframe : true   
       //});  
       //var cube = new THREE.Mesh(geom,mesh);    
       //this.clickModel.push(cube);
       //roomGroup.add(cube);  

        //var geom1 = new THREE.TorusGeometry(20,5,100,100,2*Math.PI);  
        //var mesh1 = new THREE.MeshBasicMaterial({    
        //    color     : 'red',  
        //    wireframe : true   
        //});  
        //var cube1 = new THREE.Mesh(geom1,mesh1);  
        //cube1.position.set(13,5,17);
        //this.clickModel.push(cube1);  
        //roomGroup.add(cube1);

        roomGroup.name="room";
        floor.add(roomGroup);
        floor.name="floor";
        this.model["floor"]=floor;
        this.scene.add(floor);
        for(var i=0;i<this.autoModel.length;i++){
            this.scene.add(this.autoModel[i]);
        }
    },
    //绘制房间
    drawRoom:function (obj) {
        var roomModel=new THREE.Mesh();
        var shape=new THREE.Shape();
        var geometry=new THREE.Geometry();
        var gap=obj.gap;
        var rx=gap*(obj.line[0][0]-obj.center[0])+obj.center[0];
        var ry=gap*(obj.line[0][1]-obj.center[1])+obj.center[1];
        shape.moveTo(rx,ry);
        geometry.vertices.push(new THREE.Vector3(rx,obj.h+0.01,-ry));
        for(var i=1;i<obj.line.length;i++){
            rx=gap*(obj.line[i][0]-obj.center[0])+obj.center[0];
            ry=gap*(obj.line[i][1]-obj.center[1])+obj.center[1];
            shape.lineTo(rx,ry);
            geometry.vertices.push(new THREE.Vector3(rx,obj.h+0.01,-ry));
        }
        var material;
        var fillColor=(obj.fillColor!==undefined)?obj.fillColor:"#5AC2FA";
        if(obj.specialSite!=0) {
            var basicMaterial = new THREE.LineBasicMaterial({color: "#888888"});
            var line = new THREE.Line(geometry, basicMaterial);
            roomModel.add(line);
            material=new THREE.MeshLambertMaterial({
                color: fillColor,
                side: THREE.DoubleSide
            })
        }else{
            material=new THREE.MeshLambertMaterial({
                color: fillColor,
                side: THREE.DoubleSide
            })
        }
        var extrudeSettings = {amount: obj.h, bevelEnabled: false};
        var roomShape = new THREE.ExtrudeGeometry(shape, extrudeSettings);
        var room = new THREE.Mesh(roomShape,material);
        room.rotation.x = -Math.PI / 2;
        room.info=obj;
        roomModel.add(room);
        roomModel.position.setY(obj.y);
        roomModel.info=obj;
        roomModel.name=obj.name;
        return roomModel;
    },
    //绘制房间上的名称
    drawName:function (obj,img) {
        //房间名称
        var str=obj.name;
        if(str==undefined){
            return null;
        }else {
            //创建canvas
            var canvas=document.createElement("canvas");
            canvas.width = str.length*200+100;//512;
            canvas.height = 120;

            //设置显示字体
            var context = canvas.getContext('2d');
            context.font = '100px Microsoft YaHei';
            context.textAlign='left';
            context.textBaseline='middle';
            context.fillStyle = '#000000';
            context.fillText(str, canvas.width/2+50, canvas.height/2);
            
            //如果图形存在
            if(img.complete){
                context.drawImage(img,canvas.width/2-50, canvas.height/2-50,100,100);
            }
            
            
            var shadowTexture = new THREE.CanvasTexture(canvas);
            var spriteMaterial = new THREE.SpriteMaterial( { map: shadowTexture, color: 0xffffff,transparent: false } );
            var sprite = new THREE.Sprite( spriteMaterial );

            sprite.scale.set(str.length*2,1.3,1);
            sprite.position.set(obj.center[0],obj.h+1,-obj.center[1]);
            sprite.len=str.length;
            sprite.name=obj.name;
            sprite.info=obj;

            return sprite;
        }
    },
    update:function () {
        this.controls.update();
    },
    animate:function () {
        requestAnimationFrame(this.animate.bind(this));
        this.update();
        this.render();
    },
    //渲染场景
    render:function() {
        this.autoChange();
        //this.detectHide();
        this.renderer.render(this.scene, this.camera);
    },  
    
    autoChange:function () {

        //获取相机位置
        var x=this.camera.position.x;
        var y=this.camera.position.y;
        var z=this.camera.position.z;
        //计算相机和原点的距离
        var dis=Math.sqrt(x*x+y*y+z*z)/20;
        if(dis<2){
            dis=2;
        }
        //根据距离，调整悬浮名字和图片的大小
        for(var i=0;i<this.autoModel.length;i++){
            if(this.autoModel[i].info.specialSite>0&&this.autoModel[i].info.specialSite<16){
                this.autoModel[i].scale.set(dis/2,dis/2,dis/2);
            }else{
                this.autoModel[i].scale.set(this.autoModel[i].len*dis,dis*0.6,this.autoModel[i].len*dis);
            }
                this.autoModel[i].position.setY(this.autoModel[i].info.h+dis/2);
        }
        //路径动画效果
        if(this.pathModel!=null){
            this.pathModel.material.map.offset.x+=0.01;
            this.pathModel.material.map.offset.y+=0.01;
            if(this.pathModel.material.map.offset.x>1)this.pathModel.material.map.offset.x=0;
            if(this.pathModel.material.map.offset.y>1)this.pathModel.material.map.offset.y=0;
        }
    }

}    