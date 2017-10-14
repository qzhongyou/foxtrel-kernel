/**
 * @authors       qzhongyou
 * @date          2017-10-10 17:34:31
 * @description   foxtrel 功能集成
 */

'use strict';
var foxtrel = module.exports = {};

//register global variable
Object.defineProperty(global, 'foxtrel', {
    enumerable : true,
    writable : false,
    value : foxtrel
});

//日志
foxtrel.log = require("./lib/log.js");

//require插件请求
foxtrel.require = require("./lib/require.js");

//util工具
foxtrel.util =require("./lib/util.js");

//配置
foxtrel.config = require("./lib/config.js");

//项目信息
foxtrel.project =require("./lib/project.js");

//uri资源
foxtrel.uri =require("./lib/uri.js");


