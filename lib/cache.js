/**
 * @authors       qzhongyou
 * @date          2017-10-14 11:10:54
 * @description   缓存处理工具
 */

'use strict';

var CACHE_ROOT = "";
var ph = require('path');
class Cache {

    /**
     * @description 获取缓存路径
     * @returns {*}
     */
    getCachePath() {
        if (!CACHE_ROOT) {
            CACHE_ROOT = foxtrel.project.getCachePath(...arguments);
        }
        return foxtrel.util.realpathSafe(CACHE_ROOT + "/" + [].join.call(arguments, "/"));
    }


    /**
     * @description 设置缓存路径
     * @returns {*}
     */
    setCachePath(path) {
        if (ph.resolve(path) == path) {
            CACHE_ROOT = path;
        } else {
            CACHE_ROOT = foxtrel.project.getCachePath(path);
        }
    }


    /**
     * @description 删除缓存
     * @returns {*}
     */
    clean() {
        if (!foxtrel.util.exists(CACHE_ROOT)) {
            CACHE_ROOT = foxtrel.project.getCachePath(...arguments);
        }

        if (foxtrel.util.del(CACHE_ROOT)) {
            foxtrel.log.debug(`${CACHE_ROOT}, deleted successfully`);
        }
    }
}

module.exports = new Cache();
