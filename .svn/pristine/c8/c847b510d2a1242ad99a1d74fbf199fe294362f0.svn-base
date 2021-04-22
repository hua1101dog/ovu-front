import * as THREE from "Three";
//++++++++++++++++
//camera：相机
//OrbitControls：相机控制器对象，用来求解焦点
//a2:canvas标签的宽度width
//b2:canvas标签的高度height
//mouseX:鼠标在canvas标签的相对位置的宽度
//mouseY:鼠标在canvas标签的相对位置的高度
//功能：求相机位置投影到三维世界的xyz坐标
//++++++++++++++++
export function getRay(camera, OrbitControls, a2, b2, mouseX, mouseY) //a=window.innerWidth,b=window.innerHeight;这是求解屏幕任意一点往三维世界做射线，用于几何模型的捕捉
{
    camera.updateProjectionMatrix();
    OrbitControls.update();
    var distance, BB, x1, y1, a1, h1, dx, A;
    distance = R(camera, OrbitControls);
    BB = 2 * Math.atan((a2 / b2) * Math.tan(camera.fov * Math.PI / 360)) * 180 / Math.PI; //相机的水平视角宽度
    x1 = Math.abs(distance * Math.tan(BB / 2 * Math.PI / 180)); //投影到target垂直面的width
    y1 = x1 * b2 / a2; //投影到target垂直面的height
    a1 = aa2(camera, OrbitControls);
    h1 = Math.abs(y1 * Math.cos(a1 * Math.PI / 180)); //y轴的实际高,即垂直面上边界与水平面的距离
    dx = Math.abs(y1 * Math.sin(a1 * Math.PI / 180)); //高度投影到xoz面的高de 1/2，即垂直面与水平面交界处和垂直面上边界之间部分投影到水平面
    A = Math.abs(Math.atan((camera.position.x - OrbitControls.target.x) / (camera.position.z - OrbitControls.target.z)) * 180 / Math.PI);
    var ttx, tty, yy, z2, x2, dd1;
    if ((mouseX <= (a2 / 2)) && (mouseY <= (b2 / 2))) {
        tty = -((a2 / 2 - mouseX) / (a2 / 2)) * x1;
        ttx = ((b2 / 2 - mouseY) / (b2 / 2)) * dx;
    } else if ((mouseX > (a2 / 2)) && (mouseY <= (b2 / 2))) {
        tty = (mouseX - (a2 / 2)) / (a2 / 2) * x1;
        ttx = ((b2 / 2 - mouseY) / (b2 / 2)) * dx;
    } else if ((mouseX <= (a2 / 2)) && (mouseY > (b2 / 2))) {
        tty = -((a2 / 2 - mouseX) / (a2 / 2)) * x1;
        ttx = -(mouseY - (b2 / 2)) / (b2 / 2) * dx;
    } else {
        tty = (mouseX - (a2 / 2)) / (a2 / 2) * x1;
        ttx = -(mouseY - (b2 / 2)) / (b2 / 2) * dx;
    }
    x2 = camera.position.x - OrbitControls.target.x;
    z2 = camera.position.z - OrbitControls.target.z;
    if (x2 <= 0 && z2 <= 0) {
        A = 90 - A;
    } else if (z2 <= 0 && x2 > 0) {
        A = 90 + A;
    } else if (z2 > 0 && x2 > 0) {
        A = 270 - A;
    } else {
        A = 270 + A;
    }
    dd1 = getXY(ttx, tty, A);
    yy = getY(h1, b2, mouseY);
    return [dd1[0], yy, dd1[1]];
}


//++++++++++++++++
//camera：相机
//OrbitControls：相机控制器对象，用来求解焦点
//功能：求相机位置到焦点位置的长度
//++++++++++++++++
export function R(camera, OrbitControls) {
    var center, Distance;
    center = new THREE.Vector3(OrbitControls.target.x, OrbitControls.target.y, OrbitControls.target.z);
    Distance = Math.sqrt((center.x - camera.position.x) * (center.x - camera.position.x) + (center.z - camera.position.z) *
        (center.z - camera.position.z) + (center.y - camera.position.y) * (center.y - camera.position.y));
    return Distance;
}


//++++++++++++++++
//camera：相机
//OrbitControls：相机控制器对象，用来求解焦点
//功能：求相机位置与焦点连接线与水平面的夹角
//++++++++++++++++
export function aa2(camera, OrbitControls) {
    var AA, point0, point1, distance0, distance1;
    point0 = new THREE.Vector3();
    point1 = new THREE.Vector3();
    point0.copy(OrbitControls.target);
    distance0 = Math.sqrt((point0.x - camera.position.x) * (point0.x - camera.position.x) + (point0.z - camera.position.z) * (point0.z - camera.position.z));
    camera.updateProjectionMatrix();
    point1.copy(camera.position).sub(point0);
    distance1 = point1.length(); //与焦点的距离
    AA = Math.acos(distance0 / distance1) * 180 / Math.PI; //相机与水平面的夹角
    return AA;
}


//++++++++++++++++
//y：相机与焦点连接线在焦点的位置的垂直面在水平面的投影平面的高度的投影，相当于mouse在canvas标签height的投影
//b2：canvas标签的高度height
//mouseY：鼠标在canvas标签的相对位置的高度
//功能：求鼠标在三维世界投影的高度
//++++++++++++++++
export function getY(y, b2, mouseY) {
    var y1;
    if (mouseY >= (b2 / 2)) {
        y1 = -y * (mouseY - b2 / 2) / (b2 / 2);
    } else {
        y1 = y * (b2 / 2 - mouseY) / b2 * 2;
    }
    return y1;
}


//++++++++++++++++
//x：鼠标x位置在三维世界投影到水平面的到中心点的长度
//y: 鼠标x位置在三维世界投影到水平面的到中心点的长度
//a：投影到三维世界水平面的xoy坐标与三维xoz坐标的旋转角度
//功能：求鼠标在三维世界投影的x,z的坐标
//++++++++++++++++
export function getXY(x, y, a) {
    var x1, y1;
    x1 = x * Math.cos(a / 180 * Math.PI) - y * Math.sin(a / 180 * Math.PI);
    y1 = x * Math.sin(a / 180 * Math.PI) + y * Math.cos(a / 180 * Math.PI);
    return [x1, y1];
}


//上面为求解屏幕任意一点往三维的垂直射线
//*******************************************************************
//下面为三维任意一点转为屏幕坐标


//+++++++++++++++++++++
//已知abc三点求面积
//++++++++++++++++++++++
export function getS(a, b, c) {
    var ab, ac, bc, abc, s;
    ab = getLength(a, b);
    ac = getLength(a, c);
    bc = getLength(b, c);
    abc = (ab + ac + bc) / 2;
    s = Math.sqrt(abc * (abc - ab) * (abc - ac) * (abc - bc));
    return s;
}

//++++++++++++++++++++++
//a：为相机的position
//b：为相机的焦点position
//已知ab两点求解距离
//++++++++++++++++++++++
export function getLength(a, b) {
    var length, dx, dy, dz;
    dx = a[0] - b[0];
    dy = a[1] - b[1];
    dz = a[2] - b[2];
    length = Math.sqrt(dx * dx + dy * dy + dz * dz);
    return length;
}


//++++++++++++++++++++++
//a：为相机的position
//b：为相机的焦点position
//c：为三维中任意一点
//功能：求解c在ab直线上的垂点的坐标
//++++++++++++++++++++
export function getP(a, b, c) {
    var s, cameraToC, cameraToLook, h, distance, XL;
    s = getS(a, b, c);
    cameraToLook = getLength(a, b);
    cameraToC = getLength(a, c);
    h = 2 * s / cameraToLook;
    distance = Math.sqrt(cameraToC * cameraToC - h * h) - cameraToLook;
    XL = [b[0] - a[0], b[1] - a[1], b[2] - a[2]];
    return getNewXYZ(b, XL, distance);
}

//+++++++++++++++
//XL：任意向量
//功能：使得向量模单位化为1后的向量
//+++++++++++++++++
export function length_1(XL) {
    var XL_length, x, y, z;
    XL_length = Math.sqrt(XL[0] * XL[0] + XL[1] * XL[1] + XL[2] * XL[2]);
    x = XL[0] / XL_length;
    y = XL[1] / XL_length;
    z = XL[2] / XL_length;
    return [x, y, z]
}

//++++++++++++++++
//a：为已知坐标点
//XL：为任意向量
//distance：为在XL方向上的距离
//功能：求解点a在向量xl方向移动distance距离后的坐标
//++++++++++++++++++
export function getNewXYZ(a, XL, distance) {
    var dXL, p, dxyz;
    dXL = length_1(XL);
    p = [];
    dxyz = [dXL[0] * distance, dXL[1] * distance, dXL[2] * distance];
    p.push(a[0] + dxyz[0], a[1] + dxyz[1], a[2] + dxyz[2]);
    return p;
}

//++++++++++++++++
//camera：相机
//OrbitControls：相机控制器对象，用来求解焦点
//功能：求相机位置与焦点连接线与水平面的夹角
//++++++++++++++++
export function getA(a, c) {
    var AA, distance0, distance1;
    distance0 = Math.sqrt((c[0] - a[0]) * (c[0] - a[0]) + (c[2] - a[2]) * (c[2] - a[2]));
    distance1 = Math.sqrt((c[0] - a[0]) * (c[0] - a[0]) + (c[1] - a[1]) * (c[1] - a[1]) + (c[2] - a[2]) * (c[2] - a[2]));
    AA = Math.acos(distance0 / distance1) * 180 / Math.PI; //相机与水平面的夹角
    return AA;
}


//+++++++++++++++++++++
//a:camera的position
//b:camera焦点的position
//c:三维空间任意一点坐标
//fov：camera的fov
//width:canvas标签的宽度width
//heigth:canvas标签的高度height
//功能：求解任意c点所在平面内屏幕在上面的投影相对于中点的width和heigth
//++++++++++++++++++++
export function getBound(a, b, c, fov, width, heigth) {
    var distance, BB, x1, y1, a1, dx;
    var p = getP(a, b, c);
    distance = getLength(a, p);
    BB = getSP(width, heigth, fov);
    x1 = Math.abs(distance * Math.tan(BB / 2 * Math.PI / 180)); //投影到target垂直面的width
    y1 = x1 * heigth / width; //投影到target垂直面的height
    a1 = getA(a, p);
    dx = Math.abs(y1 * Math.sin(a1 * Math.PI / 180));
    return [x1, dx];
}

//+++++++++++++++++++++++
//width:canvas标签的宽度width
//heigth:canvas标签的高度height
//功能：相机的水平视角宽度
//++++++++++++++++++++++
export function getSP(width, heigth, fov) {
    return 2 * Math.atan((width / heigth) * Math.tan(fov * Math.PI / 360)) * 180 / Math.PI;
}


//+++++++++++++++++++
//功能：求解dx与dz之间的夹角，然后转为屏幕投影x轴与三维x轴的夹角,顺时针为针，
//      在此考虑屏幕x轴在三维x轴的顺时针方向，三维x轴为基准，若以屏幕x轴为基准则在返回值加-
//+++++++++++++++++++
export function getX_Z(a, b) {
    var A, x2, z2;
    A = Math.abs(Math.atan((a[0] - b[0]) / (a[2] - b[2])) * 180 / Math.PI);
    x2 = a[0] - b[0];
    z2 = a[2] - b[2];
    if (x2 <= 0 && z2 <= 0) {
        A = 90 - A;
    } else if (z2 <= 0 && x2 > 0) {
        A = 90 + A;
    } else if (z2 > 0 && x2 > 0) {
        A = 270 - A;
    } else {
        A = 270 + A;
    }
    return A;
}

//+++++++++++++++++++
//
//功能：求解三维坐标转为屏幕坐标
//+++++++++++++++++++++
export function getPixelFromCoordinate(a, b, c, fov, width, heigth) {
    var A, p, dpc, p1, width_heigth, pxy;
    p = getP(a, b, c);
    A = -getX_Z(a, p);
    dpc = []; //p点（垂足点）到c点的向量,只考虑在zox平面的投影，所以为二维
    dpc.push(p[0] - c[0], p[2] - c[2]); //三维xoz上投影的向量
    p1 = getXY(dpc[0], dpc[1], A); //c点在xoz中的投影转为屏幕xoz的坐标
    width_heigth = getBound(a, b, c, fov, width, heigth);
    pxy = d2ToPx(p1, width, heigth, width_heigth[0], width_heigth[1]);
    return pxy;
}

//++++++++++++++++++
//p1:c点在屏幕xoz中的坐标
//width:canvas标签的宽度width
//heigth:canvas标签的高度height
//width1：任意c点所在平面内屏幕在上面的投影相对于中点的width1
//heigth1：任意c点所在平面内屏幕在上面的投影相对于中点的heigth
//功能：将屏幕二维平面的xoz坐标转为屏幕px的坐标
//++++++++++++++++++++
export function d2ToPx(p1, width, heigth, width1, heigth1) {
    var dx, dy, p2 = [];
    p2.push(p1[0] + heigth1, width1 - p1[1]); //将原点移动到canvas DOM的左上角
    dx = p2[0] / heigth1 / 2 * heigth;
    dy = p2[1] / width1 / 2 * width;
    return [dx, dy];

}

//+++++++++++++++++++++++
//未完成
//++++++++++++++++++++++++
export function getCoordinateFromPixel() {

}

//++++++++++++++++++++++++++++++
//判断某一经纬度坐标是否处于当前朝向的半球面上，若是则返回true，反之背面false
export function isBM(a, b) {
    var cosa = (a[0] * b[0] + a[2] * b[2]) / (Math.sqrt(a[0] * a[0] + a[2] * a[2]) * Math.sqrt(b[0] * b[0] + b[2] * b[2]));
    var jz = (Math.acos(cosa) / Math.PI * 180);
    if (jz <= 90) {
        return true;
    } else {
        return false;
    }
}