// import mapConfig from "./models/config";
// import MapData from "./control/MapData";
// import utils from "./models/utils";
const mapConfig = require("./models/config");
const MapData = require("./control/MapData");
// const utils = require("./models/utils");
const Map = require("./control/airocovMap");

const VERSION = 1.1;

const config = function (config) {
    mapConfig.position = config.position || mapConfig.position;
    mapConfig.defaultFloor = config.defaultFloor || mapConfig.defaultFloor;
    mapConfig.count = config.count || mapConfig.count;
    mapConfig.defaultGap = config.defaultGap || mapConfig.defaultGap;
    mapConfig.showAllFloor = config.showAllFloor || mapConfig.showAllFloor;
}

// const airocovMap = {
//     VERSION,
//     config,
//     Map,
//     utils,
// };
window.AirocovMap = Map;
// export default  ;


