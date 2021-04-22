(function(global) {
    // CCD尺寸（单位 英寸）=> ccd 
    // 水平尺寸（单位 mm）=> h 
    // 垂直尺寸（单位 mm）=> v 
    var cameraSizeList = [{ ccd: '1/4', h: 3.2, v: 2.4 }, { ccd: '1/3', h: 4.8, v: 3.6 }, { ccd: '1/2.5', h: 5.76, v: 4.29 }, { ccd: '1/2', h: 6.4, v: 4.8 }, { ccd: '1/1.8', h: 7.18, v: 5.32 }, { ccd: '2/3', h: 8.8, v: 6.6 }];

    // 焦距f（单位 mm）=> f 
    // 看清车牌的距离（单位 m）=> licensePlateDistance 
    // 看清人的距离（单位 m）=> personDistance 
    // 模糊区（单位 m）=> blureDistance 
    // 水平视角=> horizontalAngle 
    // 垂直视角=> verticalAngle 
    var cameraFocusList = [{ f: 3.6, licensePlateDistance: 2.5, personDistance: 6, blureDistance: 8, horizontalAngle: 0, verticalAngle: 0, }, { f: 4, licensePlateDistance: 3, personDistance: 7, blureDistance: 9, horizontalAngle: 0, verticalAngle: 0, }, { f: 6, licensePlateDistance: 5, personDistance: 10, blureDistance: 15, horizontalAngle: 0, verticalAngle: 0, }, { f: 8, licensePlateDistance: 7, personDistance: 15, blureDistance: 30, horizontalAngle: 0, verticalAngle: 0, }, { f: 12, licensePlateDistance: 10, personDistance: 20, blureDistance: 40, horizontalAngle: 0, verticalAngle: 0, }, { f: 16, licensePlateDistance: 15, personDistance: 30, blureDistance: 50, horizontalAngle: 0, verticalAngle: 0, }, { f: 25, licensePlateDistance: 25, personDistance: 50, blureDistance: 80, horizontalAngle: 0, verticalAngle: 0, }];
    // 价格 => price
    var cameraPriceList = [{ price: 350 }, { price: 2500 }];

    // 类型 => type
    var cameraTypeList = [{ type: '球机' }, { type: '枪机' }];

    // 角度转弧度
    function angleToRadian(angle) {
        return Math.PI / 180 * angle;
    }
    // 角度转弧度
    function radianToAngle(radian) {
        return 180 / Math.PI * radian;
    }

    // 计算水平视角
    function getHorizontalAngle(h, f) {
        var radian = 2 * Math.atan(h / (2 * f));
        return radianToAngle(radian);
    }
    // 计算垂直视角
    function getVerticallAngle(v, f) {
        var radian = 2 * Math.atan(v / (2 * f));
        return radianToAngle(radian);
    }

    // 根据尺寸 焦点 获取一个摄像头的具体参数
    function getCamera(ccd, f) {
        var sizeIndex;
        cameraSizeList.some(function(item, index) {
            if (item.ccd === ccd) {
                sizeIndex = index;
                return true;
            }
        });

        if (!sizeIndex && sizeIndex !== 0) {
            console.log('暂时没有该尺寸的摄像头');
            return;
        }

        var focusIndex;
        cameraFocusList.some(function(item, index) {
            if (item.f === f) {
                focusIndex = index;
                return true;
            }
        });

        if (!focusIndex && focusIndex !== 0) {
            console.log('暂时没有该焦距的摄像头');
            return;
        }

        var sizeItem = cameraSizeList[sizeIndex],
            focusItem = cameraFocusList[focusIndex];

        var horiAngle = getHorizontalAngle(sizeItem.h, focusItem.f),
            vertiAngle = getVerticallAngle(sizeItem.v, focusItem.f);
        var camera = {
            ccd: sizeItem.ccd,
            h: sizeItem.h,
            v: sizeItem.v,
            f: focusItem.f,
            licensePlateDistance: focusItem.licensePlateDistance,
            personDistance: focusItem.personDistance,
            blureDistance: focusItem.blureDistance,
            horizontalAngle: horiAngle,
            verticalAngle: vertiAngle
        };

        return camera;

    }

    function getCameraSizeList() {
        return cameraSizeList;
    }

    function getCameraFocusList() {
        return cameraFocusList;
    }

    function getCameraTypeList() {
        return cameraTypeList;
    }

    global.getCamera = getCamera;
    global.getCameraSizeList = getCameraSizeList;
    global.getCameraFocusList = getCameraFocusList;
    global.getCameraTypeList = getCameraTypeList;

})(window);