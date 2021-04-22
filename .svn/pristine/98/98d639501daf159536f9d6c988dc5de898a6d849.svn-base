// import mapConfig from "../models/config";
// import helper from "../models/helper";
const helper = require("../models/helper");
const mapConfig = require("../models/config");
const draw = require("./draw");

/**
 * 地图数据获取并处理
 */
class MapData {
    constructor(object) {
        this.geoJson = [];
        this.object = object;
        this.center = [];
        this.commonTheme = [];
        draw.baseUrl = this.getBaseUrl();
    }

    //获取指定数据
    async getData() {
        let commonTheme, mapList;
        if (this.object.mapList && this.object.mapList instanceof Array) {
            let floor = this.getFloor();
            //判断是否有模板
            if (this.object.themeUrl && helper.isEmpty(this.commonTheme)) {
                commonTheme = await this.getCommonTheme();
                this.commonTheme = commonTheme;
            }
            mapList = await this.asyncMap(floor);
        } else {
            throw new Error("maplist format error");
        }
        return {mapList};
    }

    //获取指定数据
    getRemainData() {
        this.asyncMap(this.object.mapList).then(mapList => this.mapDataHandle(mapList));
    }

    ajaxGet(url) {
        return new Promise(function (resolve, reject) {
            let request = new XMLHttpRequest();
            request.timeout = 3000;
            if (request) {
                request.onreadystatechange = function () {
                    if (request.readyState === XMLHttpRequest.DONE) {
                        if (request.status === 200) {
                            let result = helper.isJSON(request.responseText);
                            if (result) {
                                resolve(result);
                            } else {
                                reject(result);
                            }
                        }
                    }
                }
                request.open("GET", url, true);
                request.send();
            } else {
                throw new Error("XMLHttpRequest failed");
            }
        })
    }

    //获取指定楼层集合
    getFloor(mapList = this.object.mapList) {
        let floor;
        let index = mapList.findIndex(value => value.name == mapConfig.defaultFloor) == -1 ? 0 :
            mapList.findIndex(value => value.name == mapConfig.defaultFloor);
        if (mapConfig.showAllFloor) {
            if (mapList.length <= mapConfig.count) {
                return mapList;
            } else {
                floor = mapList.splice(index, mapConfig.count);
                if (floor.length < mapConfig.count) {
                    mapList.splice(-1, mapConfig.count - floor.length).forEach(value => floor.unshift(value));
                }
            }
        } else {
            //处理单层显示
            floor = mapList.splice(index, 1);
        }
        return floor;

    }

    //异步加载公用模板
    async getCommonTheme() {
        let themeJson = await this.ajaxGet(this.object.themeUrl);
        return themeJson;
    }

    //异步加载地图
    async asyncMap(floors) {
        const ret = [];
        for (let i = 0, floor; floor = floors[i]; i++) {
            let mapJson, themeJson, otherJson, name;
            if (floor.mapUrl && floor.name) {
                mapJson = await this.ajaxGet(floor.mapUrl);
                if (floor.themeUrl) {
                    themeJson = await this.ajaxGet(floor.themeUrl);
                } else if (!helper.isEmpty(this.commonTheme)) {
                    themeJson = this.commonTheme;
                }
                if (floor.other) otherJson = floor.other;
                name = floor.name;
            } else {
                throw  new Error('mapList format error');
            }
            ret.push({mapJson, themeJson, otherJson, name});
        }
        return ret;
    }

    //数据处理
    mapDataHandle(arr) {
        for (let i = 0, mapArr; mapArr = arr[i]; i++) {
            if (mapArr.mapJson) {
                if (mapArr.themeJson) {
                    if (mapArr.otherJson) {
                        this.geoJson.push(this.mapThemeOtherHandle(mapArr));
                    } else {
                        this.geoJson.push(this.mapThemeHandle(mapArr));
                    }
                } else {
                    this.geoJson.push(this.mapHandle(mapArr));
                }
            }
        }
    }

    //处理只有地图数据
    mapHandle(mapObj) {
        let map = [], defaultHeight, defaultColor;
        this.center = this.coordinatesToMercato(this.getCenter(mapObj.mapJson.features));

        mapObj.mapJson.features.forEach(item => {
            if (item.geometry.type == "Point") {
                if (item.properties.sType === 0 || item.properties.sType === "0") {
                    //设置地板默认高度和颜色
                    defaultHeight = 2;
                    defaultColor = "#EFEFEF";
                } else if (item.properties.sType === 1000 || item.properties.sType === "1000") {
                    //设置墙默认高度和颜色
                    defaultHeight = 8;
                    defaultColor = "#EFEFEF";
                } else {
                    //设置模块高度和颜色
                    defaultHeight = 5;
                    defaultColor = "#35B2EA";
                }
                map[item.properties.id] = Object.assign(item.properties, {
                    center: this.coordinatesToCoordinates3({
                        dinatesArr: item.geometry.coordinates,
                        mapCenter: this.center
                    }),
                    fillcolor: item.properties.fillcolor ? item.properties.fillcolor : defaultColor,
                    name: !helper.isEmpty(item.properties.name) ? item.properties.name : null,
                    sType: !helper.isEmpty(item.properties.sType) ? item.properties.sType : null,
                    id: item.properties.id,
                    height: !helper.isEmpty(item.properties.height) ? item.properties.height : defaultHeight,
                    alpha: !helper.isEmpty(item.properties.alpha) ? item.properties.alpha : null,
                    strokecolor: !helper.isEmpty(item.properties.strokecolor) ? item.properties.strokecolor : null,
                    image: !helper.isEmpty(item.properties.image) ? item.properties.image : null,
                    fontSize: !helper.isEmpty(item.properties.fontSize) ? item.properties.fontSize : null,
                    logo: !helper.isEmpty(item.properties.logo) ? item.properties.logo : null,
                    line: null
                });
            } else if (item.geometry.type == "LineString") {
                if (map[item.properties.id - 1000]) {
                   map[item.properties.id - 1000].line = this.coordinatesToCoordinates3({
                        mapCenter: this.center,
                        dinatesArr: item.geometry.coordinates
                    });
                }
            }
        });
        let mapArr = [], j = 0, i = 0;
        for (i in map) {
            if (map.hasOwnProperty(i)) {
                mapArr[j] = map[i];
                j++;
            }
        }
        return {
            name: mapObj.name,
            geoJson: mapArr
        };
    }

    //处理 地图 + 配色方案 数据
    mapThemeHandle(mapObj) {
        let mapArr = this.mapHandle(mapObj);
        mapArr.geoJson.forEach((item, index, arr) => {
            mapObj.themeJson.point.some((value) => {
                if (value.sType == item.sType) {
                    mapArr.geoJson[index].fillcolor = !helper.isEmpty(value.color) ? value.color : item.fillcolor;
                    mapArr.geoJson[index].height = !helper.isEmpty(value.height) ? value.height : item.height;
                    mapArr.geoJson[index].alpha = !helper.isEmpty(value.alpha) ? value.alpha : item.alpha;
                    mapArr.geoJson[index].strokecolor = !helper.isEmpty(value.strokecolor) ? value.strokecolor : null;
                    mapArr.geoJson[index].image = !helper.isEmpty(value.image) ? value.image : null;
                    mapArr.geoJson[index].fontSize = !helper.isEmpty(value.fontSize) ? value.fontSize : 12;
                    mapArr.geoJson[index].logo = !helper.isEmpty(value.logo) ? value.logo : item.logo;
                    return true;
                }
            });
        });

        return mapArr;
    }

    //处理 地图 + 配色方案 + 第三方 数据
    mapThemeOtherHandle(mapObj) {
        let sType = new Set([]),
            index,
            dinatesInfo,
            others;
        let mapArr = this.mapThemeHandle(mapObj);
        this.checkOther(mapObj.otherJson);
        mapObj.otherJson.forEach(item => {
            if (item.type == "Point") {
                if (!sType.has(item.sType)) {
                    sType.add(item.sType);
                }
                item.sType = Array.from(sType).findIndex(element => element == item.sType) + 500;
                item.center = [Number.parseFloat(item.x), Number.parseFloat(item.z)];
                item.center.y = Number.parseFloat(item.y);
                mapArr.geoJson.push(item);
            } else if (item.type == "Room") {
                index = mapArr.geoJson.findIndex(element => element.id == item.id);
                if (index != -1) {
                    mapArr.geoJson[index].name = item.name ? item.name : mapArr.geoJson[index].name;
                    mapArr.geoJson[index].height = item.height ? item.height : mapArr.geoJson[index].height;
                    mapArr.geoJson[index].fillcolor = item.fillcolor ? item.fillcolor : mapArr.geoJson[index].fillcolor;
                    mapArr.geoJson[index].other = item ? item : null;
                }
            } else if (item.type == "Position") {
                if (!sType.has(item.sType)) {
                    sType.add(item.sType);
                }
                item.sType = Array.from(sType).findIndex(element => element == item.sType) + 500;
                dinatesInfo = this.coordinatesToCoordinates3({mapCenter: this.center, dinatesArr: item.dinates});
                if(dinatesInfo[0] instanceof Array){
                    dinatesInfo.forEach(value => {
                        item.center = [Number.parseFloat(value[0]), Number.parseFloat(value[1])];
                        others = JSON.parse(JSON.stringify(item));
                        mapArr.geoJson.push(others);
                    })
                }else {
                    item.center = [Number.parseFloat(dinatesInfo[0]), Number.parseFloat(dinatesInfo[1])];
                    others = JSON.parse(JSON.stringify(item));
                    mapArr.geoJson.push(others);
                }

            }
        });
        return mapArr;
    }

    //获取每张地图的中心点
    getCenter(featuresArr) {
        const features = featuresArr.find(element => element.properties.id == 0);
        return features.geometry.coordinates;
    }

    //转墨卡托坐标
    coordinatesToMercato(dinatesArr) {
        let dinatesToMercato = dinatesArr.slice(0);
        dinatesToMercato = dinatesToMercato instanceof Array ? dinatesToMercato : [];
        dinatesToMercato[0] = Number.parseFloat(dinatesToMercato[0]) * 20037508.34 / 180;
        dinatesToMercato[1] = Math.log(Math.tan((90 + Number.parseFloat(dinatesToMercato[1])) * Math.PI / 360)) / (Math.PI / 180);
        dinatesToMercato[1] = Number.parseFloat(dinatesToMercato[1]) * 20037508.34 / 180;
        return dinatesToMercato;
    }

    //经纬度转换到三维坐标系中的坐标
    coordinatesToCoordinates3({mapCenter, dinatesArr}) {
        let coordinatesThreeArr = [];
        if (!(dinatesArr[0] instanceof Array)) {
            const centerMercato = this.coordinatesToMercato(dinatesArr);
            coordinatesThreeArr[0] = centerMercato[0] - mapCenter[0];
            coordinatesThreeArr[1] = centerMercato[1] - mapCenter[1];
        } else {
            dinatesArr.forEach((item) => {
                let dinatesToMercato = this.coordinatesToMercato(item);
                let dinatesDiff = [];
                dinatesDiff[0] = dinatesToMercato[0] - mapCenter[0];
                dinatesDiff[1] = dinatesToMercato[1] - mapCenter[1];
                coordinatesThreeArr.push(dinatesDiff);
            })
        }
        return coordinatesThreeArr;
    }

    //判断第三方数据格式
    checkOther(other) {
        let isEmpty = helper.isEmpty;
        if (0 <= other.length && other instanceof Array) {
            other.forEach(value => {
                if (value.type === "Point") {
                    if (isEmpty(value.x) || isEmpty(value.y) || isEmpty(value.z) || isEmpty(value.sType)) {
                        throw new Error("other x,y,z,sType is  must field");
                    }
                } else if (value.type === "Room") {
                    if (isEmpty(value.id)) {
                        throw new Error("other missing  id");
                    }
                } else if (value.type === "Position") {
                    if (isEmpty(value.dinates)) {
                        throw new Error("other missing  dinates");
                    }
                } else {
                    throw new Error("other missing  type");
                }
            });
        } else {
            throw new Error("Other data error");
        }
    }

    addRt(dinates) {
        let dinatesToMercato = [];
        let dinatesInfo = this.coordinatesToCoordinates3(dinates);
        dinatesInfo.forEach(value => {
            let center = [Number.parseFloat(value[0]), Number.parseFloat(value[1])];
            dinatesToMercato.push(center);
        })
        return dinatesToMercato;
    }

    getBaseUrl(themeUrl = this.object.themeUrl) {
        if(this.object.themeUrl){
            let imgArr = themeUrl.split("/");
            imgArr.pop();
            let baseUrl = imgArr.join("/");
            return baseUrl;
        }
    }


}

// export default MapData;
module.exports = MapData;