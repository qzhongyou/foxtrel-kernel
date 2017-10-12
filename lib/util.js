/**
 * @authors       qzhongyou
 * @date          2017-10-11 15:33:27
 * @description   工具函数 lodash本地化派生方法
 */

'use strict';
const _ = require('lodash');


class Util {
    constructor(){
        /**
         *
         * @type set
         */
        this.set =_.set;
        /**
         *
         * @type get
         */
        this.get =_.get;
    }
    /**
     *
     * @param targetValue   目标元素
     * @param srcValue   来源元素
     * @returns {*}
     */
    merge(targetValue, srcValue) {
        if (_.isArray(targetValue) && _.isArray(srcValue)) {
            //合并去重
            targetValue = [...new Set(targetValue.concat(srcValue))];
            //异或
        } else if (_.isArray(targetValue) ^ _.isArray(srcValue)) {
            targetValue = srcValue;
        } else if (typeof targetValue === 'object' && typeof srcValue === 'object') {
            for (var key in srcValue) {
                if (srcValue.hasOwnProperty(key)) {
                    targetValue[key] = customizer(targetValue[key], srcValue[key]);
                }
            }
        } else {
            targetValue = srcValue;
        }
        return targetValue;
    }
}

module.exports = new Util();