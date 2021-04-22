import helper from "./helper";

//提供给用户的工具方法
const utils = {
    isObject: helper.isType("Object"),
    isString: helper.isType("String"),
    isArray: Array.isArray || helper.isType("Array"),
    isFunction: helper.isType("Function"),
    isUndefined: helper.isType("Undefined")
}

export default utils;