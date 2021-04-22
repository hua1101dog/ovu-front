var THREE = require("../vendor/OrbitControls");
var autoModels = require("./draw").autoModels;
var clickModels = require("./draw").clickModels;
var enevt = require("../models/event");
// var feature = require("../vendor/3dToScreen");
var Scene = function (dom, canvasPositin, bgColor) {
    this.dom = dom;
    this.scene = new THREE.Scene();
    // this.camera = new THREE.PerspectiveCamera(75, Number.parseInt(this.dom.offsetWidth) / Number.parseInt(this.dom.offsetHeight), 0.1, 1000);
    this.camera = new THREE.PerspectiveCamera(75, Number.parseInt(this.dom.offsetWidth) / Number.parseInt(this.dom.offsetHeight), 0.1, 2000);
    this.renderer = new THREE.WebGLRenderer({antialias: true});
    this.renderer.domElement.top = this.getOffsetTop(this.dom);
    this.renderer.domElement.left = this.getOffsetLeft(this.dom);
    this.control = new THREE.OrbitControls(this.camera, this.renderer.domElement);
    // this.dom.addEventListener("resize", this.resize.bind(this), false);
    this.init(canvasPositin);
    this.animate();
};
//初始化
Scene.prototype.init = function (positin) {
    this.renderer.setSize(Number.parseInt(this.dom.offsetWidth), Number.parseInt(this.dom.offsetHeight));
    this.dom.appendChild(this.renderer.domElement);
    this.camera.position.set(positin.x, positin.y, positin.z);
    this.camera.lookAt({x: 100, y: 100, z: 100});
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

    // var axis = new THREE.AxisHelper(100);
    // this.scene.add(axis);
};
//重复渲染屏幕
Scene.prototype.animate = function () {
    this.control.update();
    this.autoChange();
    this.detectHide();
    this.resize();
    enevt.emit("onMouseMove");
    requestAnimationFrame(this.animate.bind(this));
    this.renderer.render(this.scene, this.camera);
};
//往场景中添加模型
Scene.prototype.add = function (obj) {
    this.scene.add(obj);
};
//清除整个画面
Scene.prototype.clearMap = function () {
    var len = this.scene.children.length;
    while (len != 4) {
        this.scene.remove(this.scene.children[4]);
        len = this.scene.children.length;
    }
    autoModels.splice(0, autoModels.length);
    clickModels.splice(0, clickModels.length);
};
//更新clickModels
Scene.prototype.updateClickModels = function (array) {
    //this.control.updateClickModels(array);
};
//窗口重绘
Scene.prototype.resize = function () {
    this.camera.aspect = Number.parseInt(this.dom.offsetWidth) / Number.parseInt(this.dom.offsetHeight);
    this.camera.updateProjectionMatrix();
    this.renderer.domElement.top = this.getOffsetTop(this.dom);
    this.renderer.domElement.left = this.getOffsetLeft(this.dom);
    this.renderer.setSize(Number.parseInt(this.dom.offsetWidth), Number.parseInt(this.dom.offsetHeight));
};
//获取dom元素距离屏幕左边的距离
Scene.prototype.getOffsetLeft = function (obj) {
    var tmp = obj.offsetLeft;
    var val = obj.offsetParent;
    while (val != null) {
        tmp += val.offsetLeft;
        val = val.offsetParent;
    }
    return tmp;

};
//获取dom元素距离屏幕顶部的距离
Scene.prototype.getOffsetTop = function (obj) {
    var tmp = obj.offsetTop;
    var val = obj.offsetParent;
    while (val != null) {
        tmp += val.offsetTop;
        val = val.offsetParent;
    }
    return tmp;

};
//场景中需要随相机位置变化而变化的模型在此处改变
Scene.prototype.autoChange = function () {
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
    for (var i = 0; i < autoModels.length; i++) {
        if (autoModels[i].info.sType > 0 && autoModels[i].info.sType < 1000) {
            autoModels[i].scale.set(dis / 2, dis / 2, dis / 2);
        } else {
            autoModels[i].scale.set(autoModels[i].len * dis, dis * 0.6, autoModels[i].len * dis);
        }
        autoModels[i].position.setY(Number(autoModels[i].info.y) + Number(autoModels[i].info.height) + dis / 2 + 1);
    }
    //路径动画效果
    // if(this.pathModel!=null){
    //     this.pathModel.material.map.offset.x+=0.01;
    //     this.pathModel.material.map.offset.y+=0.01;
    //     if(this.pathModel.material.map.offset.x>1)this.pathModel.material.map.offset.x=0;
    //     if(this.pathModel.material.map.offset.y>1)this.pathModel.material.map.offset.y=0;
    // }a
};
//检测场景中的遮挡问题
Scene.prototype.detectHide = function () {
    var detectModels = autoModels;
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
};

Scene.prototype.setPosition = function (position) {
    if ((typeof position.x === "number") && (typeof position.y === "number") && (typeof position.z === "number")) {
        this.camera.position.set(position.x, position.y, position.z);
    } else {
        this.camera.position.set(0, 200, 100);
    }
}


module.exports = Scene;