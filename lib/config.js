/**
 * @authors       qzhongyou
 * @date          2017-10-11 11:14:52
 * @description   配置信息
 */

'use strict';

//默认配置
const DEFALUT_CONFIGS = {};

class Config {
    constructor() {
        this.data = {};
        if (arguments.length > 0) {
            this.merge(arguments);
        }
    }

    /**
     *
     * @param path    a.b.c
     * @param value
     */
    set(path, value) {
        var me = this;
        if (typeof value === 'undefined') {
            if (typeof path === 'object') {
                this.data = path;
            }
        } else {
            path = String(path || '').trim();
            if (path) {
                var pathArr = ''.split.call(path, '.');
                for (var i = 1, len = pathArr.length; i < len; i++) {
                    var tmp = pathArr.slice(0, i).join(".");
                    var type = typeof foxtrel.util.get(me.data, tmp);
                    if (!(type === "object" || type === "undefined")) {
                        foxtrel.log.error('forbidden to set property[' + tmp + '] of [' + type + '] data');
                        return;
                    }
                }
                me.data =  foxtrel.util.set(me.data, path, value);
            }
        }
    }

    get(path) {
        var me =this;
        path = String(path || '').trim();
        if (path) {
            return foxtrel.util.get(me.data, path);
        }
        foxtrel.log.error('undefined path');
        return ;
    }

    del(path) {
        var me =this;
        path = String(path || '').trim();
        if(path){
            var strScript = "";
            if (/\[\d+\]$/.test(path)) {
                var iStr, index, pathArr;
                iStr = path.match(/\[\s*\d+\s*\]$/)[0];
                index = iStr.match(/\d+/)[0];
                pathArr = path.split(iStr)[0];
                strScript = `try{
                    if(data.${pathArr}){
                        data.${pathArr}.splice(${index},1)
                    }}catch(err){
                        foxtrel.log.error('invalid path.');
                    }`;
            } else {
                strScript = 'delete ' + path;
            }
            var vm =require("vm");
            const script = new vm.Script(strScript);
            const contextSandbox = vm.createContext({data:me.data,foxtrel:foxtrel});
            script.runInContext(contextSandbox);
        }
    }

    merge() {
        var me = this;
        [].slice().call(arguments).forEach((arg)=> {
            if (typeof arg === 'object') {
                foxtrel.util.merge(me.data, arg);
            } else {
                foxtrel.log.warning('unable to merge data[' + arg + '].please check the type of data');
            }
        })
    }

    require() {

    }
}

module.exports = new Config(DEFALUT_CONFIGS);